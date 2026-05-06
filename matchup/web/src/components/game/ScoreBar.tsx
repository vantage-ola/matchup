import type { GameState } from '@/lib/engine';

interface ScoreBarProps {
  state: GameState;
  homeFormation: string;
  awayFormation: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ScoreBar({ state, homeFormation, awayFormation }: ScoreBarProps) {
  return (
    <div className="flex h-14 items-center justify-between rounded-lg bg-card px-3 text-card-foreground">
      <div className="flex flex-col items-start gap-1">
        <span className="text-[10px] text-muted-foreground">{homeFormation}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold tabular-nums">{state.score.home}</span>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium tabular-nums">{formatTime(state.timeRemaining)}</span>
          <span className="text-[10px] text-muted-foreground">
            {state.possession === 'home' ? 'HOME' : 'AWAY'}
          </span>
        </div>
        <span className="text-2xl font-bold tabular-nums">{state.score.away}</span>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">{awayFormation}</span>
      </div>
    </div>
  );
}
