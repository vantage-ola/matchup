# MatchDay — Technical Specification
### v1 — Fake Currency, 1v1, Matchup-Only Default

> Status: v1 Spec. Real money, probabilistic scoring, and many-vs-many are explicitly out of scope.

---

## Table of Contents

1. System Architecture
2. Data Models
3. Game State Machine
4. The Matchup Engine
5. Settlement Engine
6. API Endpoints
7. WebSocket Events
8. Frontend Screens & flows
9. Bot / House Player
10. Third-party Integrations
11. Tech Stack
12. Project Structure
13. Environment Variables
14. Build & Run

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND                              │
│           Vite + React + TypeScript                     │
│                                                         │
│  /lobby      /matchup/:sessionId      /settlement/:id   │
│                                                         │
│  WebSocket client — live game state sync                │
└────────────────────────┬────────────────────────────────┘
                         │  HTTP + WebSocket
┌────────────────────────▼───────────────────────────────┐
│                   BACKEND                              │
│           Node.js + Express + TypeScript               │
│                                                        │
│  REST API        WebSocket Server       Scheduler      │
│  (auth, lobby,   (matchup engine,       (fixture sync, │
│   settlement)     game state)            settlement)   │
└──────┬─────────────────┬───────────────────────────────┘
       │                 │
┌──────▼──────┐   ┌──────▼──────┐
│  PostgreSQL │   │    Redis    │
│  persistent │   │  ephemeral  │
│  data       │   │  game state │
└─────────────┘   └─────────────┘
                         │
              ┌──────────▼──────────┐
              │  Football Data API  │
              │  (post-match only)  │
              └─────────────────────┘
```

**Why Redis for game state?**
The Matchup session is hot, real-time, and ephemeral — it lives for ~5 minutes. Redis handles the sub-second read/write needed for move commits and turn resolution. Postgres handles everything that needs to persist beyond the session.

---

## 2. Data Models

### PostgreSQL Schema

```sql
-- Users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  avatar_url    TEXT,
  wallet_balance INTEGER NOT NULL DEFAULT 1000, -- fake currency, in kobo-equivalent units
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Fixtures (populated by scheduler from football API)
CREATE TABLE fixtures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id     TEXT UNIQUE NOT NULL,       -- API provider's fixture ID
  home_team       TEXT NOT NULL,
  away_team       TEXT NOT NULL,
  home_team_logo  TEXT,
  away_team_logo  TEXT,
  league          TEXT NOT NULL,              -- 'EPL', 'UCL', 'LaLiga', etc.
  kickoff_at      TIMESTAMP NOT NULL,
  status          TEXT DEFAULT 'scheduled',   -- scheduled | live | finished
  real_home_goals INTEGER,                    -- populated after FT
  real_away_goals INTEGER,
  raw_result      JSONB,                      -- full API response, for reference
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Lobbies (one per fixture, opens T-30min)
CREATE TABLE lobbies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id  UUID REFERENCES fixtures(id),
  opens_at    TIMESTAMP NOT NULL,
  closes_at   TIMESTAMP NOT NULL,
  status      TEXT DEFAULT 'open',    -- open | closed
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Matchup Sessions (one per pair of players)
CREATE TABLE matchup_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lobby_id        UUID REFERENCES lobbies(id),
  fixture_id      UUID REFERENCES fixtures(id),
  player1_id      UUID REFERENCES users(id),
  player2_id      UUID REFERENCES users(id),  -- NULL if bot
  player1_side    TEXT NOT NULL,              -- 'home' | 'away'
  player2_side    TEXT NOT NULL,
  stake_per_player INTEGER NOT NULL,          -- in fake currency units
  pot             INTEGER NOT NULL,           -- stake * 2
  game_mode       TEXT DEFAULT 'matchup_only', -- 'matchup_only' | 'real_match'
  status          TEXT DEFAULT 'pending',     -- pending | active | completed | settled
  started_at      TIMESTAMP,
  ended_at        TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Matchup Results (written when session ends)
CREATE TABLE matchup_results (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        UUID REFERENCES matchup_sessions(id),
  player1_goals     INTEGER NOT NULL,
  player2_goals     INTEGER NOT NULL,
  player1_possession INTEGER NOT NULL,  -- percentage 0-100
  player2_possession INTEGER NOT NULL,
  player1_tackles   INTEGER NOT NULL,
  player2_tackles   INTEGER NOT NULL,
  player1_shots     INTEGER NOT NULL,
  player2_shots     INTEGER NOT NULL,
  player1_assists   INTEGER NOT NULL,
  player2_assists   INTEGER NOT NULL,
  player_events     JSONB NOT NULL,     -- [{minute, type, player, team}] for settlement screen
  created_at        TIMESTAMP DEFAULT NOW()
);

-- Settlements
CREATE TABLE settlements (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            UUID REFERENCES matchup_sessions(id),
  player1_matchup_score NUMERIC(5,2),   -- 0-100
  player2_matchup_score NUMERIC(5,2),
  player1_accuracy_score NUMERIC(5,2),  -- NULL if matchup_only mode
  player2_accuracy_score NUMERIC(5,2),
  player1_combined_score NUMERIC(5,2),
  player2_combined_score NUMERIC(5,2),
  player1_payout        INTEGER,        -- fake currency
  player2_payout        INTEGER,
  status                TEXT DEFAULT 'pending', -- pending | complete
  settled_at            TIMESTAMP,
  created_at            TIMESTAMP DEFAULT NOW()
);
```

### Redis Schema (ephemeral game state)

```
matchup:{sessionId}:state         → JSON GameState object (see §4)
matchup:{sessionId}:p1_move       → committed move (set only, expires after resolution)
matchup:{sessionId}:p2_move       → committed move (set only, expires after resolution)
matchup:{sessionId}:lock          → mutex lock for turn resolution
lobby:{lobbyId}:queue:home        → list of user IDs waiting on home side
lobby:{lobbyId}:queue:away        → list of user IDs waiting on away side
```

---

## 3. Game State Machine

### Matchup Session States

```
PENDING ──► ACTIVE ──► COMPLETED ──► SETTLED
             │
             └──► ABANDONED (both players disconnect > 30s)
```

### Turn States (within ACTIVE)

```
WAITING_FOR_MOVES
   P1 commits move  ──► WAITING_FOR_P2
   P2 commits move  ──► WAITING_FOR_P1
   Both commit      ──► RESOLVING ──► ANIMATING ──► WAITING_FOR_MOVES
                                                        │
                                              (if phase complete)
                                                        ▼
                                              PHASE_TRANSITION
                                                        │
                                              (if all phases done)
                                                        ▼
                                                   COMPLETED
```

### GameState Object (stored in Redis)

```typescript
interface GameState {
  sessionId: string;
  phase: number;              // current phase number (1-indexed)
  totalPhases: number;        // variable — set at session creation
  turn: number;               // current turn within phase
  movesPerPhase: number;      // variable — set at session creation
  attackingPlayer: 'p1' | 'p2';
  
  ball: {
    position: GridPosition;   // {col: number, row: number}
    carrier: 'p1' | 'p2' | null;
  };

  players: {
    p1: PlayerState;
    p2: PlayerState;
  };

  turnStatus: 'waiting_both' | 'waiting_p1' | 'waiting_p2' | 'resolving';
  
  score: {
    p1: number;
    p2: number;
  };

  stats: MatchupStats;
  events: MatchEvent[];       // goals, tackles, assists — for settlement screen
  lastResolution: Resolution | null;
}

interface PlayerState {
  movesRemaining: number;
  movesUsed: Move[];
  position: GridPosition;
  possession: boolean;
}

interface MatchupStats {
  p1: { possession: number; tackles: number; shots: number; assists: number; };
  p2: { possession: number; tackles: number; shots: number; assists: number; };
}

interface MatchEvent {
  type: 'goal' | 'tackle' | 'assist' | 'possession_change';
  player: 'p1' | 'p2';
  turn: number;
  phase: number;
}

interface Resolution {
  p1Move: Move;
  p2Move: Move;
  outcome: 'advance' | 'intercept' | 'tackle' | 'goal' | 'save' | 'miss';
  possessionChange: boolean;
  goalScored: boolean;
  scorer?: 'p1' | 'p2';
}

type GridPosition = { col: number; row: number; };

type Move =
  | 'pass'
  | 'long_ball'
  | 'run'
  | 'press'
  | 'tackle'
  | 'hold_shape'
  | 'shoot'
  | 'sprint';
```

---

## 4. The Matchup Engine

### 4.1 Session Initialisation

When two players are matched:

```typescript
function initSession(player1Id: string, player2Id: string, fixtureId: string): GameState {
  const PHASES = 6;          // variable — start here, tune in playtesting
  const MOVES_PER_PHASE = 5; // variable — start here, tune in playtesting

  return {
    sessionId: uuid(),
    phase: 1,
    totalPhases: PHASES,
    turn: 1,
    movesPerPhase: MOVES_PER_PHASE,
    attackingPlayer: 'p1',   // p1 attacks first, alternates each phase
    ball: { position: { col: 5, row: 5 }, carrier: 'p1' },
    players: {
      p1: { movesRemaining: MOVES_PER_PHASE, movesUsed: [], position: { col: 5, row: 5 }, possession: true },
      p2: { movesRemaining: MOVES_PER_PHASE, movesUsed: [], position: { col: 5, row: 4 }, possession: false },
    },
    turnStatus: 'waiting_both',
    score: { p1: 0, p2: 0 },
    stats: {
      p1: { possession: 0, tackles: 0, shots: 0, assists: 0 },
      p2: { possession: 0, tackles: 0, shots: 0, assists: 0 },
    },
    events: [],
    lastResolution: null,
  };
}
```

### 4.2 Move Commit

When a player commits a move, it is written to Redis immediately. Resolution only runs once **both** moves are present.

```typescript
async function commitMove(sessionId: string, player: 'p1' | 'p2', move: Move): Promise<void> {
  await redis.set(`matchup:${sessionId}:${player}_move`, move, { EX: 30 });

  const p1Move = await redis.get(`matchup:${sessionId}:p1_move`);
  const p2Move = await redis.get(`matchup:${sessionId}:p2_move`);

  if (p1Move && p2Move) {
    await resolveTurn(sessionId, p1Move as Move, p2Move as Move);
  } else {
    // Broadcast to both players that one side has committed (no move revealed yet)
    await updateTurnStatus(sessionId, player === 'p1' ? 'waiting_p2' : 'waiting_p1');
  }
}
```

### 4.3 Turn Resolution

This is the core of the engine. The resolution matrix determines outcomes.

```typescript
// Randomness modifier — bounded between -15 and +15 on a 0-100 outcome scale
function randomiser(): number {
  return Math.floor(Math.random() * 31) - 15;
}

// The outcome matrix — attacker move vs defender move → base outcome score (0-100)
// Score > 50 = attacker wins, Score < 50 = defender wins
const OUTCOME_MATRIX: Record<Move, Record<Move, number>> = {
  pass:      { hold_shape: 65, press: 45, tackle: 40, run: 60, pass: 55, long_ball: 55, shoot: 55, sprint: 50 },
  long_ball: { hold_shape: 50, press: 60, tackle: 35, run: 55, pass: 50, long_ball: 50, shoot: 50, sprint: 55 },
  run:       { hold_shape: 60, press: 50, tackle: 45, run: 55, pass: 60, long_ball: 55, shoot: 55, sprint: 50 },
  shoot:     { hold_shape: 55, press: 70, tackle: 70, run: 60, pass: 65, long_ball: 60, shoot: 55, sprint: 60 },
  sprint:    { hold_shape: 65, press: 50, tackle: 40, run: 60, pass: 60, long_ball: 55, shoot: 55, sprint: 55 },
  // Defensive moves — these are for when attacker plays a defensive move (poor play)
  press:     { hold_shape: 40, press: 50, tackle: 50, run: 45, pass: 45, long_ball: 40, shoot: 40, sprint: 45 },
  tackle:    { hold_shape: 35, press: 45, tackle: 50, run: 40, pass: 40, long_ball: 35, shoot: 35, sprint: 40 },
  hold_shape:{ hold_shape: 35, press: 40, tackle: 40, run: 35, pass: 35, long_ball: 35, shoot: 35, sprint: 35 },
};

// NOTE: This matrix is a starting point only. Balance through playtesting.

async function resolveTurn(sessionId: string, attackerMove: Move, defenderMove: Move): Promise<void> {
  const state = await getState(sessionId);
  const attacker = state.attackingPlayer;
  const defender = attacker === 'p1' ? 'p2' : 'p1';

  const base = OUTCOME_MATRIX[attackerMove][defenderMove];
  const score = Math.max(0, Math.min(100, base + randomiser()));

  let outcome: Resolution['outcome'];
  let goalScored = false;
  let possessionChange = false;

  if (attackerMove === 'shoot') {
    if (score > 60) { outcome = 'goal'; goalScored = true; }
    else if (score > 40) { outcome = 'miss'; }
    else { outcome = 'save'; possessionChange = true; }
  } else {
    if (score > 50) { outcome = 'advance'; }
    else { outcome = 'intercept'; possessionChange = true; }
  }

  // If score > 85, it's a tackle — defender wins AND counter-attack granted
  if (score < 25 && attackerMove !== 'shoot') {
    outcome = 'tackle';
    possessionChange = true;
    state.stats[defender].tackles++;
  }

  // Update state
  if (goalScored) {
    state.score[attacker]++;
    state.stats[attacker].shots++;
    if (attackerMove !== 'shoot') state.stats[attacker].assists++; // last pass = assist
    state.events.push({ type: 'goal', player: attacker, turn: state.turn, phase: state.phase });
  }

  if (possessionChange) {
    state.attackingPlayer = defender;
    state.ball.carrier = defender;
    state.events.push({ type: 'possession_change', player: defender, turn: state.turn, phase: state.phase });
  }

  // Update possession stats (tracked by successful ball-carries)
  if (!possessionChange) {
    state.stats[attacker].possession++;
  }

  const resolution: Resolution = {
    p1Move: attacker === 'p1' ? attackerMove : defenderMove,
    p2Move: attacker === 'p2' ? attackerMove : defenderMove,
    outcome,
    possessionChange,
    goalScored,
    scorer: goalScored ? attacker : undefined,
  };

  state.lastResolution = resolution;
  state.turn++;
  state.players[attacker].movesRemaining--;
  state.players[attacker].movesUsed.push(attackerMove);
  state.turnStatus = 'waiting_both';

  // Check phase end
  const activePlayer = state.attackingPlayer;
  if (state.players[activePlayer].movesRemaining === 0) {
    await endPhase(sessionId, state);
  } else {
    await saveState(sessionId, state);
    await broadcastResolution(sessionId, resolution, state);
  }

  // Clear committed moves
  await redis.del(`matchup:${sessionId}:p1_move`);
  await redis.del(`matchup:${sessionId}:p2_move`);
}
```

### 4.4 Phase Transition

At end of each phase, attacking and defending roles swap.

```typescript
async function endPhase(sessionId: string, state: GameState): Promise<void> {
  state.phase++;

  if (state.phase > state.totalPhases) {
    await endMatchup(sessionId, state);
    return;
  }

  // Swap attacker
  state.attackingPlayer = state.attackingPlayer === 'p1' ? 'p2' : 'p1';
  state.ball.carrier = state.attackingPlayer;

  // Reset move counts for new phase
  state.players.p1.movesRemaining = state.movesPerPhase;
  state.players.p2.movesRemaining = state.movesPerPhase;

  state.turn = 1;
  state.turnStatus = 'waiting_both';

  await saveState(sessionId, state);
  await broadcastPhaseTransition(sessionId, state);
}
```

### 4.5 Scoreline Generation — Direct (v1)

```typescript
function generateScoreline(state: GameState, playerSide: 'p1' | 'p2'): { home: number; away: number } {
  // Direct mode: goals scored in game = scoreline
  // Map p1/p2 goals to home/away based on which side the player picked
  const session = await getSession(state.sessionId);
  const isHomePlayer = session.player1_side === 'home' ? 'p1' : 'p2';

  return {
    home: isHomePlayer === 'p1' ? state.score.p1 : state.score.p2,
    away: isHomePlayer === 'p1' ? state.score.p2 : state.score.p1,
  };
}
```

---

## 5. Settlement Engine

### 5.1 Matchup Score (Layer 1)

```typescript
function calculateMatchupScore(p1Goals: number, p2Goals: number): { p1: number; p2: number } {
  const total = p1Goals + p2Goals;
  if (total === 0) return { p1: 50, p2: 50 }; // draw — split evenly
  return {
    p1: Math.round((p1Goals / total) * 100),
    p2: Math.round((p2Goals / total) * 100),
  };
}
```

### 5.2 Accuracy Score (Layer 2 — Real Match Mode)

```typescript
function calculateAccuracyScore(
  predicted: { home: number; away: number },
  actual: { home: number; away: number },
  preMatchProbability: number // 0-1, implied from pre-match odds
): number {
  let score = 0;

  // Correct winner (40 points)
  const predictedWinner = predicted.home > predicted.away ? 'home' : predicted.away > predicted.home ? 'away' : 'draw';
  const actualWinner = actual.home > actual.away ? 'home' : actual.away > actual.home ? 'away' : 'draw';
  if (predictedWinner === actualWinner) score += 40;

  // Correct goal difference (30 points)
  const predictedDiff = Math.abs(predicted.home - predicted.away);
  const actualDiff = Math.abs(actual.home - actual.away);
  if (predictedDiff === actualDiff) score += 30;
  else score += Math.max(0, 20 - Math.abs(predictedDiff - actualDiff) * 5);

  // Exact scoreline (30 points bonus)
  if (predicted.home === actual.home && predicted.away === actual.away) score += 30;

  // Walkover adjustment — if result was unlikely, reduce the penalty
  // preMatchProbability < 0.15 = very unlikely result
  const improbabilityFactor = Math.max(0, 1 - preMatchProbability * 5); // 0 to 1
  const adjustedScore = score + (100 - score) * improbabilityFactor * 0.4;

  return Math.min(100, Math.round(adjustedScore));
}
```

### 5.3 Combined Score & Payout

```typescript
const LAYER1_WEIGHT = 0.6; // Matchup game performance
const LAYER2_WEIGHT = 0.4; // Real match prediction accuracy
const PLATFORM_FEE  = 0.1; // 10%

function calculatePayout(session: MatchupSession, settlement: Partial<Settlement>): Settlement {
  const { p1: p1Matchup, p2: p2Matchup } = settlement.matchupScores!;
  const { p1: p1Accuracy, p2: p2Accuracy } = settlement.accuracyScores ?? { p1: 50, p2: 50 };

  const isRealMatchMode = session.game_mode === 'real_match';
  const w1 = isRealMatchMode ? LAYER1_WEIGHT : 1.0;
  const w2 = isRealMatchMode ? LAYER2_WEIGHT : 0.0;

  const p1Combined = p1Matchup * w1 + p1Accuracy * w2;
  const p2Combined = p2Matchup * w1 + p2Accuracy * w2;
  const total = p1Combined + p2Combined;

  const pot = session.pot * (1 - PLATFORM_FEE);

  return {
    ...settlement,
    player1_combined_score: Math.round(p1Combined),
    player2_combined_score: Math.round(p2Combined),
    player1_payout: Math.round((p1Combined / total) * pot),
    player2_payout: Math.round((p2Combined / total) * pot),
  } as Settlement;
}
```

---

## 6. API Endpoints

### Auth
```
POST   /api/auth/register          { username, password, displayName }
POST   /api/auth/login             { username, password }  → JWT
GET    /api/auth/me                → User profile + wallet balance
```

### Fixtures & Lobbies
```
GET    /api/fixtures               → Upcoming fixtures (next 48h)
GET    /api/fixtures/:id           → Single fixture details
GET    /api/fixtures/:id/lobby     → Lobby status + player count per side
POST   /api/fixtures/:id/join      { side: 'home' | 'away', stake, gameMode }
                                   → Enters matchmaking queue
```

### Matchup Session
```
GET    /api/sessions/:id           → Session details + current game state
POST   /api/sessions/:id/move      { move: Move }  → Commit a move
GET    /api/sessions/:id/result    → Matchup result (after session ends)
```

### Settlement
```
GET    /api/settlements/:sessionId → Settlement details + payout breakdown
```

### Wallet
```
GET    /api/wallet                 → Balance + transaction history
POST   /api/wallet/claim-daily     → Daily fake currency top-up (keeps new users liquid)
```

---

## 7. WebSocket Events

Connection: `ws://server/matchup/:sessionId?token=JWT`

### Server → Client

```typescript
// Opponent committed their move (no move revealed yet)
{ type: 'OPPONENT_COMMITTED' }

// Both moves resolved — send full resolution + new state
{ type: 'TURN_RESOLVED', payload: { resolution: Resolution, state: GameState } }

// Phase ended — roles swapped
{ type: 'PHASE_TRANSITION', payload: { newPhase: number, attackingPlayer: 'p1' | 'p2', state: GameState } }

// Game over — all phases complete
{ type: 'MATCHUP_COMPLETE', payload: { finalState: GameState, result: MatchupResult } }

// Opponent disconnected
{ type: 'OPPONENT_DISCONNECTED', payload: { reconnectWindowSeconds: 30 } }

// Bot filling in for disconnected opponent
{ type: 'BOT_SUBSTITUTED' }

// Real match settled (real_match mode only, fires post FT)
{ type: 'REAL_MATCH_SETTLED', payload: { settlement: Settlement } }
```

### Client → Server

```typescript
// Commit a move for the current turn
{ type: 'COMMIT_MOVE', payload: { move: Move } }

// Heartbeat
{ type: 'PING' }
```

---

## 8. Frontend Screens & Flows

### Screen Map

```
/                       Landing — upcoming fixtures list
/fixture/:id            Fixture detail — lobby status, join button
/matchup/:sessionId     The game — live Matchup session
/settlement/:sessionId  Post-game — results, stats, payout
/wallet                 Balance, transaction history, daily claim
/profile                User stats, match history
```

### Key Components

```
src/
├── pages/
│   ├── Home.tsx
│   ├── Fixture.tsx
│   ├── Matchup.tsx        ← heaviest component, owns WebSocket connection
│   └── Settlement.tsx
├── components/
│   ├── Pitch.tsx          ← FM 2D pitch view, player dots, ball position
│   ├── MoveSelector.tsx   ← move hand UI, commit button
│   ├── ScoreBar.tsx       ← live score + phase indicator
│   ├── ResolutionOverlay.tsx  ← both moves reveal animation
│   ├── SettlementCard.tsx ← scoreline reveal, stats, payout
│   └── WalletBadge.tsx
└── lib/
    ├── api.ts             ← typed fetch wrappers
    ├── socket.ts          ← WebSocket client + event handlers
    └── gameState.ts       ← local state derived from server GameState
```

### Matchup Screen Layout

```
┌─────────────────────────────────┐
│  FUL  2 - 1  LEE    Phase 3/6  │  ← ScoreBar
├─────────────────────────────────┤
│                                 │
│   [FM 2D Pitch View]            │  ← Pitch.tsx
│   Player dots + ball position   │
│   Updates after each resolution │
│                                 │
├─────────────────────────────────┤
│  Opponent: ████ committed       │  ← opponent status
├─────────────────────────────────┤
│  [Pass] [Run] [LongBall]        │  ← MoveSelector.tsx
│  [Shoot] [Sprint]               │
│                   [COMMIT →]    │
└─────────────────────────────────┘
```

When both moves committed → ResolutionOverlay animates in, shows both moves, outcome, then fades.

---

## 9. Bot / House Player

When a user joins the queue and no opponent is found within **20 seconds**, a bot fills the slot.

### Bot Strategy (v1 — simple)

```typescript
function getBotMove(state: GameState, botSide: 'p1' | 'p2'): Move {
  const isAttacking = state.attackingPlayer === botSide;
  const movesLeft = state.players[botSide].movesRemaining;

  if (isAttacking) {
    // Simple attacker: try to shoot when close, otherwise pass/run
    const inFinalThird = state.ball.position.col > 7;
    if (inFinalThird && movesLeft <= 2) return 'shoot';
    return Math.random() > 0.5 ? 'pass' : 'run';
  } else {
    // Simple defender: rotate between tackle and hold_shape
    return Math.random() > 0.4 ? 'hold_shape' : 'tackle';
  }
}
```

Bot commits its move with a randomised delay (1.5-3s) to feel human.

Bot payouts: if user beats the bot, they win from the house pool. Track house P&L separately. If house pool runs negative, cap bot availability or adjust bot difficulty.

---

## 10. Third-Party Integrations

### Football Data API

Used **only post-match** to fetch the real result. No live feed required.

Recommended: **API-Football** (RapidAPI) — free tier covers enough fixtures for v1.

```typescript
// Called by scheduler after fixture kickoff_at + 110 minutes
async function fetchRealResult(externalFixtureId: string): Promise<FixtureResult> {
  const res = await fetch(
    `https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${externalFixtureId}`,
    { headers: { 'X-RapidAPI-Key': process.env.FOOTBALL_API_KEY! } }
  );
  const data = await res.json();
  const fixture = data.response[0];
  return {
    homeGoals: fixture.goals.home,
    awayGoals: fixture.goals.away,
    status: fixture.fixture.status.short, // 'FT'
  };
}
```

### Scheduler

A cron job runs every 5 minutes to:
1. Open lobbies for fixtures kicking off in 30 minutes
2. Trigger result fetching for fixtures that finished 20+ minutes ago
3. Run settlement for any completed sessions with real results available

Use `node-cron` or a simple `setInterval` for v1. Move to a proper job queue (BullMQ) if needed later.

---

## 11. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React + TypeScript |
| Frontend routing | React Router v6 |
| Frontend state | Zustand (lightweight, no Redux overhead) |
| Backend runtime | Node.js + TypeScript |
| Backend framework | Express.js |
| WebSockets | `ws` library |
| Database | PostgreSQL |
| Cache / game state | Redis |
| Auth | JWT (jsonwebtoken) |
| Password hashing | bcrypt |
| DB migrations | `node-pg-migrate` |
| Scheduler | `node-cron` |
| Football data | API-Football (RapidAPI) |
| Payments | Deferred — fake currency in v1 |

---

## 12. Project Structure

```
matchday/
├── backend/
│   ├── src/
│   │   ├── index.ts                  ← Express + WebSocket server entry
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── fixtures.ts
│   │   │   ├── sessions.ts
│   │   │   ├── settlements.ts
│   │   │   └── wallet.ts
│   │   ├── engine/
│   │   │   ├── matchup.ts            ← Core game engine (§4)
│   │   │   ├── resolution.ts         ← Turn resolution + outcome matrix
│   │   │   ├── settlement.ts         ← Payout calculation (§5)
│   │   │   └── bot.ts                ← Bot player logic
│   │   ├── services/
│   │   │   ├── matchmaking.ts        ← Queue management
│   │   │   ├── football-api.ts       ← API-Football wrapper
│   │   │   └── scheduler.ts          ← Cron jobs
│   │   ├── ws/
│   │   │   ├── server.ts             ← WebSocket server setup
│   │   │   └── handlers.ts           ← Event handlers per session
│   │   └── db/
│   │       ├── schema.sql
│   │       ├── migrations/
│   │       └── queries.ts
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Fixture.tsx
│   │   │   ├── Matchup.tsx
│   │   │   ├── Settlement.tsx
│   │   │   ├── Wallet.tsx
│   │   │   └── Profile.tsx
│   │   ├── components/
│   │   │   ├── Pitch.tsx
│   │   │   ├── MoveSelector.tsx
│   │   │   ├── ScoreBar.tsx
│   │   │   ├── ResolutionOverlay.tsx
│   │   │   ├── SettlementCard.tsx
│   │   │   └── WalletBadge.tsx
│   │   └── lib/
│   │       ├── api.ts
│   │       ├── socket.ts
│   │       └── gameState.ts
│   ├── tsconfig.json
│   └── package.json
│
└── SPEC.md
```

---

## 13. Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/matchday
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
FOOTBALL_API_KEY=your_rapidapi_key
PORT=3001
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

---

## 14. Build & Run

```bash
# Prerequisites
node >= 18
postgresql
redis

# Backend
cd backend
npm install
npm run migrate        # runs node-pg-migrate
npm run dev            # ts-node-dev, hot reload

# Frontend
cd frontend
npm install
npm run dev            # Vite dev server → localhost:5173

# Redis (local)
redis-server

# PostgreSQL (local)
createdb matchday
```

### Build Order for Development

Follow this order to avoid blocked dependencies:

1. DB schema + migrations
2. Auth routes (register/login)
3. Fixture seeding (manually insert a test fixture)
4. Matchmaking queue
5. WebSocket server + session init
6. Matchup engine (resolution logic)
7. Frontend Pitch + MoveSelector (can mock WebSocket)
8. Wire frontend to backend
9. Settlement engine
10. Bot player
11. Scheduler + football API integration

---