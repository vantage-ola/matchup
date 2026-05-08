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
    <div className="flex flex-col gap-1">
      {/* Possession bar */}
      <div className="flex items-center gap-1.5 rounded bg-card/60 px-2 py-1">
        <span className="text-[9px] font-bold tabular-nums text-foreground/80">
          {possession.home}%
        </span>
        <div className="relative flex h-[5px] flex-1 overflow-hidden rounded-full bg-muted/40">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${possession.home}%`,
              background: 'rgba(255,255,255,0.85)',
            }}
          />
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${possession.away}%`,
              background: 'rgba(225,29,72,0.75)',
            }}
          />
        </div>
        <span className="text-[9px] font-bold tabular-nums text-foreground/80">
          {possession.away}%
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between rounded bg-card/60 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="tabular-nums">{homeStats.passes} PAS</span>
          <span className="tabular-nums">{homeStats.shots} SHO</span>
          <span className="tabular-nums">{homeStats.shotsOnTarget} SOT</span>
        </div>

        {isStoppage && (
          <span
            className="rounded bg-destructive/90 px-1.5 py-0.5 text-[9px] font-bold text-white animate-pulse"
          >
            +{stoppageMinute}
          </span>
        )}

        <div className="flex items-center gap-3">
          <span className="tabular-nums">{awayStats.passes} PAS</span>
          <span className="tabular-nums">{awayStats.shots} SHO</span>
          <span className="tabular-nums">{awayStats.shotsOnTarget} SOT</span>
        </div>
      </div>
    </div>
  );
}
