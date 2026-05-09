import { useEffect, useState } from 'react';
import {
  type MoveResult,
  rowToNum,
} from '@/lib/engine';

interface InterceptionFlashProps {
  result: MoveResult | null;
}

const FLASH_MS = 650;

function cellCenter(col: number, row: string): { x: number; y: number } {
  return {
    x: (col - 0.5) * 10,
    y: (rowToNum(row) + 0.5) * 10,
  };
}

export function InterceptionFlash({ result }: InterceptionFlashProps) {
  const [active, setActive] = useState(false);

  // Synchronously update 'active' when 'result' changes to avoid cascading renders
  const [lastResult, setLastResult] = useState(result);
  if (result !== lastResult) {
    setLastResult(result);
    if (result && result.outcome === 'intercepted' && result.move) {
      setActive(true);
    } else {
      setActive(false);
    }
  }

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), FLASH_MS);
    return () => clearTimeout(t);
  }, [active]);

  if (!active || !result?.move) return null;

  const interceptor = result.newState.players.find(
    (p) => p.id === result.newState.ballCarrierId,
  );
  if (!interceptor) return null;

  const from = cellCenter(result.move.from.col, result.move.from.row);
  const to = cellCenter(interceptor.position.col, interceptor.position.row);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 220 110"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Faded original pass path */}
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="var(--pitch-lane-blocked, rgba(239,68,68,0.7))"
        strokeWidth={0.5}
        strokeLinecap="square"
        strokeDasharray="2 2"
        vectorEffect="non-scaling-stroke"
        opacity={0.5}
      />

      {/* Burst at interception point */}
      <circle
        cx={to.x}
        cy={to.y}
        r={3}
        fill="none"
        stroke="var(--pitch-lane-blocked, rgba(239,68,68,0.9))"
        strokeWidth={0.6}
        vectorEffect="non-scaling-stroke"
      >
        <animate
          attributeName="r"
          from="0.5"
          to="3"
          dur="0.3s"
          fill="freeze"
        />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="0.65s"
          fill="freeze"
        />
      </circle>

      {/* Solid dot at interception point */}
      <circle
        cx={to.x}
        cy={to.y}
        r={1}
        fill="var(--pitch-lane-blocked, rgba(239,68,68,0.9))"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}