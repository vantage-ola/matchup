import {
  type GridPosition,
  rowToNum,
} from '@/lib/engine';

interface GhostTrailProps {
  history: GridPosition[];
}

function cellCenter(col: number, row: string): { x: number; y: number } {
  return {
    x: (col - 0.5) * 10,
    y: (rowToNum(row) + 0.5) * 10,
  };
}

const ALPHAS = [0.12, 0.25, 0.4];

export function GhostTrail({ history }: GhostTrailProps) {
  if (history.length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 220 110"
      preserveAspectRatio="none"
      aria-hidden
    >
      {history.map((pos, idx) => {
        const { x, y } = cellCenter(pos.col, pos.row);
        const age = history.length - 1 - idx;
        const alpha = ALPHAS[ALPHAS.length - 1 - age] ?? 0.1;
        return (
          <rect
            key={`${pos.col}-${pos.row}-${idx}`}
            x={x - 1.2}
            y={y - 1.2}
            width={2.4}
            height={2.4}
            fill="var(--pitch-trail, #facc15)"
            opacity={alpha}
            transform={`rotate(45 ${x} ${y})`}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}