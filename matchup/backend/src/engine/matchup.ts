import type { GameState, Move, PlayerNumber, PlayerSide } from '../types/index.js';
import { resolveTurn } from './resolution.js';

const PHASES = 6;
const MOVES_PER_PHASE = 5;

export function initSession(
  player1Id: string,
  player2Id: string,
  fixtureId: string,
  sessionId: string
): GameState {
  return {
    sessionId,
    phase: 1,
    totalPhases: PHASES,
    turn: 1,
    movesPerPhase: MOVES_PER_PHASE,
    attackingPlayer: 'p1',
    ball: { position: { col: 5, row: 5 }, carrier: 'p1' },
    players: {
      p1: {
        movesRemaining: MOVES_PER_PHASE,
        movesUsed: [],
        position: { col: 5, row: 5 },
        possession: true,
      },
      p2: {
        movesRemaining: MOVES_PER_PHASE,
        movesUsed: [],
        position: { col: 5, row: 4 },
        possession: false,
      },
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

export async function commitMove(
  sessionId: string,
  player: PlayerNumber,
  move: Move
): Promise<void> {
  // TODO: Write move to Redis
  // TODO: Check if both moves committed
  // TODO: If both, call resolveTurn()
  // TODO: Broadcast turn status to players
}

export async function endPhase(sessionId: string, state: GameState): Promise<void> {
  state.phase++;

  if (state.phase > state.totalPhases) {
    await endMatchup(sessionId, state);
    return;
  }

  state.attackingPlayer = state.attackingPlayer === 'p1' ? 'p2' : 'p1';
  state.ball.carrier = state.attackingPlayer;
  state.players.p1.movesRemaining = state.movesPerPhase;
  state.players.p2.movesRemaining = state.movesPerPhase;
  state.turn = 1;
  state.turnStatus = 'waiting_both';

  // TODO: Save state to Redis
  // TODO: Broadcast phase transition
}

export async function endMatchup(sessionId: string, state: GameState): Promise<void> {
  // TODO: Mark session as completed in DB
  // TODO: Generate matchup result
  // TODO: Save result to DB
  // TODO: Update session status to 'completed'
  // TODO: Broadcast MATCHUP_COMPLETE event
}

export function generateScoreline(
  state: GameState,
  playerSide: PlayerSide,
  session: { player1Side: PlayerSide }
): { home: number; away: number } {
  const homePlayer = session.player1Side === 'home' ? 'p1' : 'p2';

  return {
    home: homePlayer === 'p1' ? state.score.p1 : state.score.p2,
    away: homePlayer === 'p1' ? state.score.p2 : state.score.p1,
  };
}