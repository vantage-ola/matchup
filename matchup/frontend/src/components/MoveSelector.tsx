import type { Move, PlayerState } from '../types';

interface MoveSelectorProps {
  selectedMove: Move | null;
  onSelect: (move: Move) => void;
  disabled?: boolean;
  playerState: PlayerState;
}

const MOVE_INFO: Record<Move, { label: string; description: string }> = {
  pass: { label: 'Pass', description: 'Advance through a channel' },
  long_ball: { label: 'Long Ball', description: 'Bypass midfield' },
  run: { label: 'Run', description: 'Make a run into space' },
  press: { label: 'Press', description: 'High pressure to win back' },
  tackle: { label: 'Tackle', description: 'Direct challenge' },
  hold_shape: { label: 'Hold Shape', description: 'Close passing lanes' },
  shoot: { label: 'Shoot', description: 'Attempt on goal' },
  sprint: { label: 'Sprint', description: 'Accelerate, burns a move' },
};

const MOVES: Move[] = [
  'pass',
  'long_ball',
  'run',
  'press',
  'tackle',
  'hold_shape',
  'shoot',
  'sprint',
];

export default function MoveSelector({
  selectedMove,
  onSelect,
  disabled,
  playerState,
}: MoveSelectorProps) {
  const movesRemaining = playerState.movesRemaining;

  return (
    <div className="move-selector">
      <div className="moves-info">
        <span>Moves remaining: {movesRemaining}</span>
      </div>

      <div className="moves-grid">
        {MOVES.map((move) => {
          const info = MOVE_INFO[move];
          const isSelected = selectedMove === move;
          const isDisabled = disabled || movesRemaining <= 0;

          return (
            <button
              key={move}
              className={`move-button ${isSelected ? 'selected' : ''} ${
                isDisabled ? 'disabled' : ''
              }`}
              onClick={() => onSelect(move)}
              disabled={isDisabled}
            >
              <span className="move-label">{info.label}</span>
              <span className="move-desc">{info.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}