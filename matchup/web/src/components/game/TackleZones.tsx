import { useMemo } from 'react';
import {
  type GameState,
  ROWS,
  rowToNum,
  gridDistance,
  previewTackle,
} from '@/lib/engine';

interface TackleZonesProps {
  state: GameState;
}

const COLS_COUNT = 22;
const ROWS_COUNT = ROWS.length;

function cellCenter(col: number, row: string): { x: number; y: number } {
  const x = ((col - 0.5) / COLS_COUNT) * 100;
  const rIdx = rowToNum(row);
  const y = ((rIdx + 0.5) / ROWS_COUNT) * 100;
  return { x, y };
}

export function TackleZones({ state }: TackleZonesProps) {
  const carrier = useMemo(() => {
    return state.players.find((p) => p.id === state.ballCarrierId) ?? null;
  }, [state.players, state.ballCarrierId]);

  const adjacentDefenders = useMemo(() => {
    if (!carrier) return [];
    return state.players.filter(
      (p) =>
        p.team !== carrier.team &&
        gridDistance(p.position, carrier.position) === 1
    );
  }, [state.players, carrier]);

  if (!carrier || adjacentDefenders.length === 0) return null;

  const successPct = Math.round(
    previewTackle(state, carrier.id).successProbability * 100
  );

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {adjacentDefenders.map((d) => {
        const { x, y } = cellCenter(d.position.col, d.position.row);
        return (
          <g key={d.id}>
            <circle
              cx={x}
              cy={y}
              r={2.4}
              fill="none"
              stroke="rgba(225, 29, 72, 0.85)"
              strokeWidth={0.5}
              vectorEffect="non-scaling-stroke"
              style={{
                animation: 'tackle-zone-pulse 1.4s ease-in-out infinite',
                transformOrigin: `${x}% ${y}%`,
              }}
            />
            <text
              x={x + 2.2}
              y={y - 1.8}
              fill="rgba(225, 29, 72, 0.95)"
              fontSize={1.6}
              fontWeight={700}
              textAnchor="start"
              style={{ paintOrder: 'stroke' }}
              stroke="rgba(0,0,0,0.4)"
              strokeWidth={0.15}
              vectorEffect="non-scaling-stroke"
            >
              {successPct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
