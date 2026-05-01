import { useEffect, useState } from 'react';
import type { MoveResult } from '@/lib/engine';

interface MoveResultBarProps {
  result: MoveResult | null;
}

const OUTCOME_LABELS: Record<string, string> = {
  success: 'Move',
  intercepted: 'Intercepted!',
  blocked: 'Blocked!',
  tackled: 'Tackle!',
  goal: 'GOAL!',
  miss: 'Miss!',
};

export function MoveResultBar({ result }: MoveResultBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!result) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [result]);

  if (!result || !visible) return null;

  const isGoal = result.outcome === 'goal';

  return (
    <div
      className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md px-4 py-1.5 text-sm font-bold transition-opacity duration-300"
      style={{
        backgroundColor: isGoal ? '#22c55e' : 'rgba(0,0,0,0.75)',
        color: '#fff',
        opacity: visible ? 1 : 0,
      }}
    >
      {OUTCOME_LABELS[result.outcome] ?? result.outcome}
    </div>
  );
}
