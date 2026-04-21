import type { Resolution, Move } from '../types';

interface ResolutionOverlayProps {
  resolution: Resolution;
  playerSide: 'p1' | 'p2';
  onComplete: () => void;
}

const OUTCOME_LABELS: Record<string, string> = {
  advance: 'Ball Advanced',
  intercept: 'Ball Won',
  tackle: 'Tackle',
  goal: 'GOAL!',
  save: 'Saved',
  miss: 'Missed',
};

export default function ResolutionOverlay({
  resolution,
  playerSide,
  onComplete,
}: ResolutionOverlayProps) {
  const p1Move = resolution.p1Move;
  const p2Move = resolution.p2Move;
  const outcome = OUTCOME_LABELS[resolution.outcome] || resolution.outcome;

  const isWinner =
    (playerSide === 'p1' && resolution.scorer === 'p1') ||
    (playerSide === 'p2' && resolution.scorer === 'p2');

  return (
    <div className="resolution-overlay" onAnimationEnd={onComplete}>
      <div className="moves-reveal">
        <div className="move-card">
          <span className="label">You</span>
          <span className="move">{formatMove(p1Move)}</span>
        </div>
        <div className="vs">vs</div>
        <div className="move-card">
          <span className="label">Opponent</span>
          <span className="move">{formatMove(p2Move)}</span>
        </div>
      </div>

      <div className={`outcome ${isWinner ? 'win' : 'loss'}`}>
        <span>{outcome}</span>
        {resolution.possessionChange && (
          <span className="possession-change">
            {isWinner ? 'Lost' : 'Gained'} possession
          </span>
        )}
      </div>
    </div>
  );
}

function formatMove(move: Move): string {
  return move.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}