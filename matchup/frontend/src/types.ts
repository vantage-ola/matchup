export type Move =
  | 'pass'
  | 'long_ball'
  | 'run'
  | 'press'
  | 'tackle'
  | 'hold_shape'
  | 'shoot'
  | 'sprint';

export type PlayerSide = 'home' | 'away';
export type PlayerNumber = 'p1' | 'p2';

export type GameMode = 'matchup_only' | 'real_match';
export type SessionStatus = 'pending' | 'active' | 'completed' | 'settled' | 'abandoned';
export type TurnStatus = 'waiting_both' | 'waiting_p1' | 'waiting_p2' | 'resolving';
export type Outcome =
  | 'advance'
  | 'intercept'
  | 'tackle'
  | 'goal'
  | 'save'
  | 'miss';

export interface GridPosition {
  col: number;
  row: number;
}

export interface PlayerState {
  movesRemaining: number;
  movesUsed: Move[];
  position: GridPosition;
  possession: boolean;
}

export interface MatchupStats {
  possession: number;
  tackles: number;
  shots: number;
  assists: number;
}

export interface MatchEvent {
  type: 'goal' | 'tackle' | 'assist' | 'possession_change';
  player: PlayerNumber;
  turn: number;
  phase: number;
}

export interface Resolution {
  p1Move: Move;
  p2Move: Move;
  outcome: Outcome;
  possessionChange: boolean;
  goalScored: boolean;
  scorer?: PlayerNumber;
}

export interface GameState {
  sessionId: string;
  phase: number;
  totalPhases: number;
  turn: number;
  movesPerPhase: number;
  attackingPlayer: PlayerNumber;
  ball: {
    position: GridPosition;
    carrier: PlayerNumber | null;
  };
  players: {
    p1: PlayerState;
    p2: PlayerState;
  };
  turnStatus: TurnStatus;
  score: {
    p1: number;
    p2: number;
  };
  stats: {
    p1: MatchupStats;
    p2: MatchupStats;
  };
  events: MatchEvent[];
  lastResolution: Resolution | null;
}

export interface MatchupResult {
  id: string;
  sessionId: string;
  player1Goals: number;
  player2Goals: number;
  player1Possession: number;
  player2Possession: number;
  player1Tackles: number;
  player2Tackles: number;
  player1Shots: number;
  player2Shots: number;
  player1Assists: number;
  player2Assists: number;
  playerEvents: MatchEvent[];
  createdAt: Date;
}

export interface Settlement {
  id: string;
  sessionId: string;
  player1MatchupScore: number;
  player2MatchupScore: number;
  player1AccuracyScore: number | null;
  player2AccuracyScore: number | null;
  player1CombinedScore: number;
  player2CombinedScore: number;
  player1Payout: number;
  player2Payout: number;
  status: 'pending' | 'complete';
  settledAt: Date | null;
  createdAt: Date;
}

export interface MoveSelectorProps {
  selectedMove: Move | null;
  onSelect: (move: Move) => void;
  disabled?: boolean;
  playerState: PlayerState;
}

export interface ScoreBarProps {
  gameState: GameState;
  playerSide: PlayerNumber;
  homeTeam: string;
  awayTeam: string;
}

export interface PitchProps {
  gameState: GameState;
  playerSide: PlayerNumber;
}

export interface ResolutionOverlayProps {
  resolution: Resolution;
  playerSide: 'p1' | 'p2';
  onComplete: () => void;
}

export interface SettlementCardProps {
  result: MatchupResult | null;
  settlement: {
    player1MatchupScore: number;
    player2MatchupScore: number;
    player1CombinedScore: number;
    player2CombinedScore: number;
    player1Payout: number;
    player2Payout: number;
  };
  playerSide: 'p1' | 'p2';
}