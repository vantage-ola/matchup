import { Button } from '@/components/ui/button';
import type { GameState } from '@/lib/engine';

interface FullTimeScreenProps {
  state: GameState;
  homeFormation: string;
  awayFormation: string;
  onPlayAgain: () => void;
}

export function FullTimeScreen({ state, homeFormation, awayFormation, onPlayAgain }: FullTimeScreenProps) {
  const winner = state.score.home > state.score.away ? 'HOME WINS'
    : state.score.away > state.score.home ? 'AWAY WINS'
    : 'DRAW';

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-muted-foreground">FULL TIME</h1>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{homeFormation}</p>
              <p className="text-6xl font-bold tabular-nums">{state.score.home}</p>
            </div>
            <span className="text-2xl text-muted-foreground">—</span>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">{awayFormation}</p>
              <p className="text-6xl font-bold tabular-nums">{state.score.away}</p>
            </div>
          </div>
          <p className="text-lg font-semibold">{winner}</p>
        </div>

        <Button className="h-12 w-full text-lg font-bold" onClick={onPlayAgain}>
          PLAY AGAIN
        </Button>
      </div>
    </div>
  );
}
