import type { Move, GameState, PlayerNumber } from '../types/index.js';

export function getBotMove(state: GameState, botSide: PlayerNumber): Move {
  const isAttacking = state.attackingPlayer === botSide;
  const movesLeft = state.players[botSide].movesRemaining;

  if (isAttacking) {
    const inFinalThird = state.ball.position.col > 7;
    if (inFinalThird && movesLeft <= 2) {
      return 'shoot';
    }
    return Math.random() > 0.5 ? 'pass' : 'run';
  } else {
    return Math.random() > 0.4 ? 'hold_shape' : 'tackle';
  }
}

export async function scheduleBotMove(
  sessionId: string,
  botSide: PlayerNumber,
  state: GameState
): Promise<void> {
  const delay = 1500 + Math.random() * 1500;

  setTimeout(async () => {
    const move = getBotMove(state, botSide);
    // TODO: Commit bot move to Redis
    // TODO: Emit WebSocket event
  }, delay);
}