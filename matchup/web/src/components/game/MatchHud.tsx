import { useMemo } from 'react';
import type { GameState, Player } from '@/lib/engine';

interface MatchHudProps {
  state: GameState;
}

interface TeamStats {
  passes: number;
  shots: number;
  shotsOnTarget: number;
}

function aggregateTeamStats(players: Player[], team: 'home' | 'away'): TeamStats {
  return players
    .filter((p) => p.team === team)
    .reduce(
      (acc, p) => ({
        passes: acc.passes + p.stats.passesCompleted,
        shots: acc.shots + p.stats.shots,
        shotsOnTarget: acc.shotsOnTarget + p.stats.shotsOnTarget,
      }),
      { passes: 0, shots: 0, shotsOnTarget: 0 },
    );
}

function computePossession(events: GameState['events']): { home: number; away: number } {
  if (events.length === 0) return { home: 50, away: 50 };
  let homeCount = 0;
  let awayCount = 0;
  for (const e of events) {
    if (e.team === 'home') homeCount++;
    else awayCount++;
  }
  const total = homeCount + awayCount;
  const homePct = Math.round((homeCount / total) * 100);
  return { home: homePct, away: 100 - homePct };
}

export function MatchHud({ state }: MatchHudProps) {
  const possession = useMemo(() => computePossession(state.events), [state.events]);
  const homeStats = useMemo(() => aggregateTeamStats(state.players, 'home'), [state.players]);
  const awayStats = useMemo(() => aggregateTeamStats(state.players, 'away'), [state.players]);

  const isStoppage = state.timeRemaining < 60 && state.timeRemaining > 0 && state.status === 'playing';
  const stoppageMinute = Math.ceil(state.timeRemaining / 60);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Possession bar */}
      <div className="flex items-center gap-2 rounded bg-card px-3 py-1.5 border border-border">
        <span className="text-[10px] font-bold tabular-nums text-foreground">
          {possession.home}%
        </span>
        <div className="relative flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${possession.home}%` }}
          />
          <div
            className="h-full rounded-full bg-destructive/90 transition-all duration-500 ease-out"
            style={{ width: `${possession.away}%` }}
          />
        </div>
        <span className="text-[10px] font-bold tabular-nums text-foreground">
          {possession.away}%
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between rounded bg-card px-3 py-1.5 border border-border text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="tabular-nums text-foreground">{homeStats.passes} <span className="text-muted-foreground/70">PAS</span></span>
          <span className="tabular-nums text-foreground">{homeStats.shots} <span className="text-muted-foreground/70">SHO</span></span>
          <span className="tabular-nums text-foreground">{homeStats.shotsOnTarget} <span className="text-muted-foreground/70">SOT</span></span>
        </div>

        {isStoppage && (
          <span className="rounded bg-destructive px-1.5 py-0.5 text-[9px] font-black text-destructive-foreground animate-pulse">
            +{stoppageMinute}
          </span>
        )}

        <div className="flex items-center gap-3 md:gap-4">
          <span className="tabular-nums text-foreground"><span className="text-muted-foreground/70">PAS</span> {awayStats.passes}</span>
          <span className="tabular-nums text-foreground"><span className="text-muted-foreground/70">SHO</span> {awayStats.shots}</span>
          <span className="tabular-nums text-foreground"><span className="text-muted-foreground/70">SOT</span> {awayStats.shotsOnTarget}</span>
        </div>
      </div>
    </div>
  );
}
