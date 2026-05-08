import { useEffect, useState } from 'react';
import {
  type MoveResult,
  ROWS,
  rowToNum,
} from '@/lib/engine';

interface InterceptionFlashProps {
  result: MoveResult | null;
}

const COLS_COUNT = 22;
const ROWS_COUNT = ROWS.length;
const FLASH_MS = 600;

function cellCenter(col: number, row: string): { x: number; y: number } {
  const x = ((col - 0.5) / COLS_COUNT) * 100;
  const rIdx = rowToNum(row);
  const y = ((rIdx + 0.5) / ROWS_COUNT) * 100;
  return { x, y };
}

export function InterceptionFlash({ result }: InterceptionFlashProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!result || result.outcome !== 'intercepted' || !result.move) {
      setActive(false);
      return;
    }
    setActive(true);
    const t = setTimeout(() => setActive(false), FLASH_MS);
    return () => clearTimeout(t);
  }, [result]);

  if (!active || !result?.move) return null;

  const interceptor = result.newState.players.find(
    (p) => p.id === result.newState.ballCarrierId
  );
  if (!interceptor) return null;

  const from = cellCenter(result.move.from.col, result.move.from.row);
  const to = cellCenter(interceptor.position.col, interceptor.position.row);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="rgba(225, 29, 72, 0.95)"
        strokeWidth={0.9}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={to.x}
        cy={to.y}
        r={1.4}
        fill="rgba(225, 29, 72, 0.95)"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

