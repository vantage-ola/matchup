import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { GameState, GridPosition, MoveResult, GameMode } from '@/lib/engine';
import { Pitch } from './Pitch';
import { ScoreBar } from './ScoreBar';
import { MoveResultBar } from './MoveResultBar';

interface GameScreenProps {
  state: GameState;
  mode: GameMode;
  homeFormation: string;
  awayFormation: string;
  selectedPlayerId: string | null;
  selectedPlayerMoves: Set<string>;
  lastMoveResult: MoveResult | null;
  isAiThinking: boolean;
  onSelectPlayer: (playerId: string) => void;
  onExecuteMove: (playerId: string, to: GridPosition) => void;
  onDeselect: () => void;
  onQuit: () => void;
}

export function GameScreen({
  state,
  mode,
  homeFormation,
  awayFormation,
  selectedPlayerId,
  selectedPlayerMoves,
  lastMoveResult,
  isAiThinking,
  onSelectPlayer,
  onExecuteMove,
  onDeselect,
  onQuit,
}: GameScreenProps) {
  const [paused, setPaused] = useState(false);

  const turnLabel = mode === 'ai'
    ? (state.possession === 'home' ? 'Your turn' : 'AI thinking...')
    : (state.possession === 'home' ? 'Home turn' : 'Away turn');

  if (paused) {
    return (
      <div className="flex h-dvh items-center justify-center p-4">
        <div className="w-full max-w-xs space-y-4 text-center">
          <h2 className="text-2xl font-bold">PAUSED</h2>
          <p className="text-sm text-muted-foreground">
            {state.score.home} — {state.score.away}
          </p>
          <div className="space-y-2">
            <Button className="h-12 w-full text-lg font-bold" onClick={() => setPaused(false)}>
              RESUME
            </Button>
            <Button variant="outline" className="h-12 w-full" onClick={onQuit}>
              QUIT GAME
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ScoreBar state={state} homeFormation={homeFormation} awayFormation={awayFormation} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-14 px-3 text-xs text-muted-foreground"
          onClick={() => setPaused(true)}
        >
          PAUSE
        </Button>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center">
        <div className="w-full">
          <Pitch
            state={state}
            selectedPlayerId={selectedPlayerId}
            selectedPlayerMoves={selectedPlayerMoves}
            isAiThinking={isAiThinking}
            onSelectPlayer={onSelectPlayer}
            onExecuteMove={onExecuteMove}
            onDeselect={onDeselect}
          />
          <MoveResultBar result={lastMoveResult} />
        </div>
      </div>

      <div className="flex h-10 items-center justify-center rounded-lg bg-card text-sm text-card-foreground">
        {isAiThinking ? (
          <span className="animate-pulse">AI thinking...</span>
        ) : selectedPlayerId ? (
          <span>Tap a highlighted cell to move</span>
        ) : (
          <span>{turnLabel} — tap a player to select</span>
        )}
      </div>
    </div>
  );
}
