import {
  type GridPosition,
  ROWS,
  rowToNum,
} from '@/lib/engine';

interface GhostTrailProps {
  history: GridPosition[];
}

const COLS_COUNT = 22;
const ROWS_COUNT = ROWS.length;

function cellCenter(col: number, row: string): { x: number; y: number } {
  const x = ((col - 0.5) / COLS_COUNT) * 100;
  const rIdx = rowToNum(row);
  const y = ((rIdx + 0.5) / ROWS_COUNT) * 100;
  return { x, y };
}

const ALPHAS = [0.12, 0.25, 0.4];

export function GhostTrail({ history }: GhostTrailProps) {
  if (history.length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {history.map((pos, idx) => {
        const { x, y } = cellCenter(pos.col, pos.row);
        const age = history.length - 1 - idx;
        const alpha = ALPHAS[ALPHAS.length - 1 - age] ?? 0.1;
        return (
          <circle
            key={`${pos.col}-${pos.row}-${idx}`}
            cx={x}
            cy={y}
            r={1.1}
            fill={`rgba(250, 204, 21, ${alpha})`}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

