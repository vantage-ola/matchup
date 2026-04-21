import type { GameState, Move, PlayerNumber } from '../types';

export function isMyTurn(
  gameState: GameState,
  playerSide: PlayerNumber
): boolean {
  return gameState.turnStatus === 'waiting_both' ||
    (gameState.turnStatus === 'waiting_p1' && playerSide === 'p1') ||
    (gameState.turnStatus === 'waiting_p2' && playerSide === 'p2')
    ? true
    : false;
}

export function getMovesRemaining(
  gameState: GameState,
  playerSide: PlayerNumber
): number {
  return gameState.players[playerSide].movesRemaining;
}

export function canShoot(gameState: GameState, playerSide: PlayerNumber): boolean {
  const attackPosition = gameState.ball.position;
  const isAttacking = gameState.attackingPlayer === playerSide;
  return isAttacking && attackPosition.col >= 7;
}

export function getAttackingPlayer(gameState: GameState): PlayerNumber {
  return gameState.attackingPlayer;
}

export function getPlayerPosition(
  gameState: GameState,
  playerSide: PlayerNumber
): { col: number; row: number } {
  return gameState.players[playerSide].position;
}

export function getBallPosition(
  gameState: GameState
): { col: number; row: number } {
  return gameState.ball.position;
}

export function getScore(
  gameState: GameState,
  playerSide: PlayerNumber
): { mine: number; theirs: number } {
  if (playerSide === 'p1') {
    return {
      mine: gameState.score.p1,
      theirs: gameState.score.p2,
    };
  }
  return {
    mine: gameState.score.p2,
    theirs: gameState.score.p1,
  };
}

export function getPhaseProgress(gameState: GameState): {
  current: number;
  total: number;
  turn: number;
  movesPerPhase: number;
} {
  return {
    current: gameState.phase,
    total: gameState.totalPhases,
    turn: gameState.turn,
    movesPerPhase: gameState.movesPerPhase,
  };
}

export function getStats(
  gameState: GameState,
  playerSide: PlayerNumber
): {
  possession: number;
  tackles: number;
  shots: number;
  assists: number;
} {
  return playerSide === 'p1' ? gameState.stats.p1 : gameState.stats.p2;
}

export function getOpponentStats(
  gameState: GameState,
  playerSide: PlayerNumber
): {
  possession: number;
  tackles: number;
  shots: number;
  assists: number;
} {
  return playerSide === 'p1' ? gameState.stats.p2 : gameState.stats.p1;
}

export function isPhaseComplete(gameState: GameState): boolean {
  const activePlayer = gameState.attackingPlayer;
  return gameState.players[activePlayer].movesRemaining === 0;
}

export function isGameComplete(gameState: GameState): boolean {
  return gameState.phase > gameState.totalPhases;
}

export function availableMoves(
  gameState: GameState,
  playerSide: PlayerNumber
): Move[] {
  const movesAvailable = gameState.players[playerSide].movesRemaining > 0;
  const canShootNow = canShoot(gameState, playerSide);

  const baseMoves: Move[] = ['pass', 'long_ball', 'run', 'press', 'tackle', 'hold_shape', 'sprint'];

  if (canShootNow && movesAvailable) {
    return [...baseMoves, 'shoot'];
  }

  return movesAvailable ? baseMoves : [];
}