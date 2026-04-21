import type { Move, Resolution, PlayerNumber, Outcome, GameState } from '../types/index.js';

export function randomiser(): number {
  return Math.floor(Math.random() * 31) - 15;
}

export const OUTCOME_MATRIX: Record<Move, Record<Move, number>> = {
  pass: {
    hold_shape: 65,
    press: 45,
    tackle: 40,
    run: 60,
    pass: 55,
    long_ball: 55,
    shoot: 55,
    sprint: 50,
  },
  long_ball: {
    hold_shape: 50,
    press: 60,
    tackle: 35,
    run: 55,
    pass: 50,
    long_ball: 50,
    shoot: 50,
    sprint: 55,
  },
  run: {
    hold_shape: 60,
    press: 50,
    tackle: 45,
    run: 55,
    pass: 60,
    long_ball: 55,
    shoot: 55,
    sprint: 50,
  },
  shoot: {
    hold_shape: 55,
    press: 70,
    tackle: 70,
    run: 60,
    pass: 65,
    long_ball: 60,
    shoot: 55,
    sprint: 60,
  },
  sprint: {
    hold_shape: 65,
    press: 50,
    tackle: 40,
    run: 60,
    pass: 60,
    long_ball: 55,
    shoot: 55,
    sprint: 55,
  },
  press: {
    hold_shape: 40,
    press: 50,
    tackle: 50,
    run: 45,
    pass: 45,
    long_ball: 40,
    shoot: 40,
    sprint: 45,
  },
  tackle: {
    hold_shape: 35,
    press: 45,
    tackle: 50,
    run: 40,
    pass: 40,
    long_ball: 35,
    shoot: 35,
    sprint: 40,
  },
  hold_shape: {
    hold_shape: 35,
    press: 40,
    tackle: 40,
    run: 35,
    pass: 35,
    long_ball: 35,
    shoot: 35,
    sprint: 35,
  },
};

export async function resolveTurn(
  sessionId: string,
  attackerMove: Move,
  defenderMove: Move,
  state: GameState
): Promise<Resolution> {
  const attacker = state.attackingPlayer;
  const defender = attacker === 'p1' ? 'p2' : 'p1';

  const base = OUTCOME_MATRIX[attackerMove][defenderMove];
  const score = Math.max(0, Math.min(100, base + randomiser()));

  let outcome: Outcome;
  let goalScored = false;
  let possessionChange = false;

  if (attackerMove === 'shoot') {
    if (score > 60) {
      outcome = 'goal';
      goalScored = true;
    } else if (score > 40) {
      outcome = 'miss';
    } else {
      outcome = 'save';
      possessionChange = true;
    }
  } else {
    if (score > 50) {
      outcome = 'advance';
    } else {
      outcome = 'intercept';
      possessionChange = true;
    }
  }

  if (score < 25 && attackerMove !== 'shoot') {
    outcome = 'tackle';
    possessionChange = true;
    state.stats[defender].tackles++;
  }

  if (goalScored) {
    state.score[attacker]++;
    state.stats[attacker].shots++;
    state.events.push({
      type: 'goal',
      player: attacker,
      turn: state.turn,
      phase: state.phase,
    });
  }

  if (possessionChange) {
    state.attackingPlayer = defender;
    state.ball.carrier = defender;
    state.events.push({
      type: 'possession_change',
      player: defender,
      turn: state.turn,
      phase: state.phase,
    });
  }

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

  // TODO: Check if phase complete -> call endPhase()
  // TODO: Save updated state to Redis
  // TODO: Clear committed moves from Redis

  return resolution;
}