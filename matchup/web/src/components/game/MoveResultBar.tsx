import { useEffect, useState } from 'react';
import { Goal, Shield, ShieldX, Swords, Target, Footprints, Zap } from 'lucide-react';
import type { MoveResult, Outcome } from '@/lib/engine';

interface MoveResultBarProps {
  result: MoveResult | null;
}

interface OutcomeStyle {
  label: string;
  bg: string;
  fg: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const OUTCOME_STYLE: Record<Outcome, OutcomeStyle> = {
  goal: { label: 'GOAL!', bg: '#16a34a', fg: '#ffffff', Icon: Goal },
  miss: { label: 'Miss!', bg: '#525252', fg: '#ffffff', Icon: Target },
  intercepted: { label: 'Intercepted!', bg: '#dc2626', fg: '#ffffff', Icon: ShieldX },
  blocked: { label: 'Blocked!', bg: '#dc2626', fg: '#ffffff', Icon: Shield },
  tackled: { label: 'Tackle won!', bg: '#16a34a', fg: '#ffffff', Icon: Swords },
  tackleFailed: { label: 'Tackle missed', bg: '#525252', fg: '#ffffff', Icon: Swords },
  success: { label: 'Move', bg: 'rgba(0,0,0,0.75)', fg: '#ffffff', Icon: Footprints },
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

  const style = OUTCOME_STYLE[result.outcome] ?? OUTCOME_STYLE.success;
  const isPass = result.move?.type === 'pass' && result.outcome === 'success';
  const label = isPass ? 'Pass complete' : style.label;
  const Icon = isPass ? Zap : style.Icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md px-4 py-1.5 text-sm font-bold transition-opacity duration-300"
      style={{
        backgroundColor: style.bg,
        color: style.fg,
        opacity: visible ? 1 : 0,
      }}
    >
      <Icon size={16} className="shrink-0" />
      <span>{label}</span>
    </div>
  );
}
