import { useMemo } from 'react';
import {
  type GameState,
  type Player,
  rowToNum,
  getPassTargets,
} from '@/lib/engine';

interface PassingLanesProps {
  state: GameState;
  selectedPlayerId: string | null;
}

function cellCenter(col: number, row: string): { x: number; y: number } {
  return {
    x: (col - 0.5) * 10,
    y: (rowToNum(row) + 0.5) * 10,
  };
}

export function PassingLanes({ state, selectedPlayerId }: PassingLanesProps) {
  const carrier = useMemo<Player | null>(() => {
    if (!selectedPlayerId) return null;
    const p = state.players.find((pl) => pl.id === selectedPlayerId);
    if (!p || !p.hasBall || p.team !== state.possession) return null;
    return p;
  }, [state.players, state.possession, selectedPlayerId]);

  const targets = useMemo(() => {
    if (!carrier) return [];
    return getPassTargets(state, carrier.id);
  }, [state, carrier]);

  if (!carrier || targets.length === 0) return null;

  const from = cellCenter(carrier.position.col, carrier.position.row);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 220 110"
      preserveAspectRatio="none"
      aria-hidden
    >
      {targets.map((t) => {
        let endCol = t.to.col;
        let endRow = t.to.row;
        if (t.lineRisk === 'blocked' && t.interceptorId) {
          const interceptor = state.players.find(
            (p) => p.id === t.interceptorId,
          );
          if (interceptor) {
            endCol = interceptor.position.col;
            endRow = interceptor.position.row;
          }
        }
        const to = cellCenter(endCol, endRow);

        const stroke =
          t.lineRisk === 'blocked'
            ? 'var(--pitch-lane-blocked, rgba(239,68,68,0.8))'
            : t.lineRisk === 'risk'
              ? 'var(--pitch-lane-risk, rgba(251,191,36,0.8))'
              : 'var(--pitch-lane-clear, rgba(34,197,94,0.8))';

        const dasharray =
          t.lineRisk === 'blocked'
            ? '2 2'
            : t.lineRisk === 'risk'
              ? '4 2'
              : undefined;

        return (
          <g key={t.playerId}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={stroke}
              strokeWidth={0.55}
              strokeLinecap="square"
              strokeDasharray={dasharray}
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={to.x - 1}
              y={to.y - 1}
              width={2}
              height={2}
              fill={stroke}
              transform={`rotate(45 ${to.x} ${to.y})`}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </svg>
  );
}