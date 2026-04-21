# MatchDay — Idea Brief
### A simultaneous hidden-move football strategy game, settled by real match results

> Status: Idea fully locked. Technical spec written. See SPEC.md.

---

## The Spark
I used to play a lot of football games growing up - FIFA, PES, DREAM LEAGUE SOCCER, FTS, FOOTBALL MANAGER... name it. Yesterday I sat down to watch the second leg of the 2026 UCL game of Barca against Atletico... and as a Barca hater, I felt a lot of anxiety while watching the game as I did not want Barca to qualify...I wonder how Barca fans felt in that game...

The goal is to recapture that feeling but make it social, real-money, and tied to actual football happening in the world.

The core fantasy: you're not just watching Barcelona vs Atletico - you're *playing* it, with skin in the game, against someone on the other side who wants the opposite result.

---

## What This Is

A game that is **chess in structure but never feels like chess** — because the theme, visuals, pace, and vocabulary are pure football.

References:
- **Chess** — simultaneous hidden moves, resource management, defined move sets
- **Football Manager (FM)** — top-down 2D pitch view, tactical positioning
- **Score Hero** — gesture-based, cinematic moment-to-moment feel

Nothing on mobile combines all three. That's the gap.

---

## The Game Loop

```
T-30min   Lobby opens. Users pick sides, get matched, pay in (fake currency in v1).

T-20min   5-minute "Matchup" begins.
           Simultaneous hidden-move football game.
           Both players exhaust their defined move sets across attack and defense phases.
           Each player generates a simulated scoreline from their performance.

T-15min   Matchup ends. Scorelines locked. Hidden from opponent until settlement.
           Users go watch the real match however they want.

[Real match plays — 90 minutes]

FT        Real result fetched via single API call.
           Settlement runs. Payout calculated.
           Opponent's scoreline + full match stats revealed side by side.
```

---

## The Matchup — Core Mechanic

### The Hidden Move System

Both players have a hand of football action moves. Each turn, both players secretly commit a move simultaneously — neither sees what the other picked until both have committed. Moves resolve together. That simultaneous reveal is the mind game.

Move types (exact set and counts are variables — balanced through playtesting):
- **Pass** — advance ball through a channel
- **Long Ball** — bypass midfield, higher risk
- **Run** — player makes a run into space
- **Press** — high pressure to win ball back
- **Tackle** — direct challenge
- **Hold Shape** — close passing lanes, defensive discipline
- **Shoot** — attempt on goal (position-gated)
- **Sprint** — accelerate a move, burns a resource

### Turn Resolution

P1 commits first, but nothing resolves until P2 commits. Both moves reveal simultaneously — that animation is the dramatic moment. A small randomness modifier applies to contested moves. Skill dominates, drama is preserved.

### The Possession Flip

If the defender wins the ball, they immediately get a counter-attack opportunity with remaining moves in that phase. A bad pass leads to a breakaway — a real football consequence.

### Movement

Grid-based and free movement — both. Grid for tactical positioning; free movement for runs and pressing. Keeps it readable without feeling rigid.

### Pitch View

FM 2D simulation style. Top-down, player dots on a green pitch, ball position updates after each resolution.

### Fairness

Both players get the same number of attack phases and the same move allocation per phase. No structural advantage for either side.

### Possession Tracking

Tracked by successful ball-carries (moves landed with possession). Feeds into the post-match stats on the settlement screen.

---

## Scoreline Generation — Two Modes

### Direct (v1 — Arcade)
Goals scored in the Matchup = the predicted scoreline. Raw, immediate.

### Probabilistic (v2 — Simulation)
Matchup performance stats (possession %, shots, tackles, moves landed) feed a formula that generates a realistic scoreline. A dominant performance that only converted 1 goal might resolve to 2-0 or 3-1. Feels more like real football.

Both modes coexist eventually. Could be a user-facing setting or per-fixture game mode.

---

## Settlement — Two Layers

### Layer 1 — Matchup Result (always active)
Higher simulated scoreline wins.

### Layer 2 — Real Match Accuracy (toggleable — Real Match Mode)
Each player's simulated scoreline scored against the actual result. Points for correct winner, goal difference, exact score, total goals.

### Payout — Proportional, Not Winner-Takes-All

```
₦500 each. ₦1,000 pot. 10% platform fee = ₦900 to split.

User1 combined score: 74%  →  ~₦666
User2 combined score: 26%  →  ~₦234
```

Nobody walks away with zero. No LMSR — proportional scoring is simpler, transparent, sufficient.

### The Key Insight

**You can lose the real match and still win the Matchup.**

A Chelsea fan gets destroyed 4-0 by Barcelona. But if he dominated the Matchup and his simulated scoreline was closer to the real result — he walks away with more money. Skill beats luck. Better player wins, not luckier supporter. This is what separates MatchDay from a bet slip.

---

## Fairness Algorithm — The Walkover Problem

Pre-match probability weighting on Layer 2 only. If the real result was a low-probability outcome, predictions in reasonable ranges lose fewer points. Correct predictions of unlikely outcomes earn bonus points. Layer 1 (Matchup game) is completely unaffected — pure skill.

Must be fully transparent. After settlement, show users exactly how their score was calculated. Trust depends on it.

---

## The Settlement Screen

Two states — one screen:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MATCHUP-ONLY MODE

  YOUR RESULT       OPPONENT
     2 - 1            1 - 2

  ⚽ Jiménez 23'    ⚽ Nketiah 67'
  ⚽ Jiménez 71'
  🅰 Andreas 23'    🅰 Martinelli 67'

  Possession  54%  |  46%
  Tackles      4   |   2
  Shots        3   |   2

  YOU WON THE MATCHUP ✓
  +₦566 credited to wallet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REAL MATCH MODE (pending)

  [same stats]

  YOU WON THE MATCHUP ✓
  +₦200 from Matchup — credited now

  ════════════════════════════════
  LIVE MODE — waiting for real match
  Arsenal vs Chelsea · Kicks off 2h 14m

  Your predicted result: 2-1
  Potential bonus: +₦340
  ════════════════════════════════
```

The reveal — both simulated scorelines shown side by side before the real result drops in — needs to feel like the final whistle, not a receipt. This screen is the product.

---

## No-Opponent Fallback

If no opponent is found within 20 seconds of joining the queue, a bot fills the slot automatically. Bot commits moves with a randomised human-feeling delay. House P&L tracked separately.

---

## Leagues at Launch

Major leagues — EPL, UCL, La Liga, Serie A, Ligue 1. AFCON when in season. Prioritised by Nigerian audience interest.

---

## Target User

People who want something new, built for banter — clean, real, not seen before. Already deep in football culture. Want more than a bet slip. Mobile-first. Defined by appetite, not age.

---

## v1 Scope

**In:**
- 1v1 matchmaking
- Fake/in-app currency
- Direct scoreline mode
- Matchup-only mode as default, Real Match Mode as optional toggle
- Major league fixtures
- Bot fallback
- Post-match settlement screen with full stats

**Deferred:**
- Real money (needs legal structure — NLRC)
- Probabilistic scoreline mode
- Many-vs-many
- Move count balancing (variable, tuned through playtesting)
- Move interaction matrix (built iteratively on top of v1)

---

## What's Next

Spec is written. See **SPEC.md** for full technical architecture, data models, game engine, API, WebSocket events, and build order.

---

