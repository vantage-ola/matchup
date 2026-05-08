import { useState, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import type { FormationName } from '@/lib/engine';
import { SetupScreen } from '@/components/setup/SetupScreen';
import { GameScreen } from '@/components/game/GameScreen';
import { FullTimeScreen } from '@/components/game/FullTimeScreen';
import { RulebookScreen } from '@/components/rulebook/RulebookScreen';

export function App() {
  const game = useGame();
  const [formations, setFormations] = useState<{ home: FormationName; away: FormationName }>({
    home: '4-3-3',
    away: '4-3-3',
  });
  const [lastMode, setLastMode] = useState<'local' | 'ai'>('local');
  const [showRulebook, setShowRulebook] = useState(false);

  const handleStart = useCallback(
    (mode: 'local' | 'ai', home: FormationName, away: FormationName) => {
      setFormations({ home, away });
      setLastMode(mode);
      game.startGame(mode, home, away);
    },
    [game],
  );

  const handleRematch = useCallback(() => {
    // Swap home/away formations and restart with same mode
    const swapped = { home: formations.away, away: formations.home };
    setFormations(swapped);
    game.startGame(lastMode, swapped.home, swapped.away);
  }, [formations, lastMode, game]);

  if (showRulebook) {
    return <RulebookScreen onBack={() => setShowRulebook(false)} />;
  }

  if (game.phase === 'setup') {
    return (
      <SetupScreen
        onStart={handleStart}
        onShowRulebook={() => setShowRulebook(true)}
      />
    );
  }

  if (game.phase === 'fullTime' && game.state) {
    return (
      <FullTimeScreen
        state={game.state}
        homeFormation={formations.home}
        awayFormation={formations.away}
        onPlayAgain={game.resetGame}
        onRematch={handleRematch}
      />
    );
  }

  if (game.state) {
    return (
      <GameScreen
        state={game.state}
        mode={game.mode}
        homeFormation={formations.home}
        awayFormation={formations.away}
        selectedPlayerId={game.selectedPlayerId}
        selectedPlayerMoves={game.selectedPlayerMoves}
        lastMoveResult={game.lastMoveResult}
        isAiThinking={game.isAiThinking}
        ballHistory={game.ballHistory}
        onSelectPlayer={game.selectPlayer}
        onExecuteMove={game.executeMove}
        onDeselect={game.deselectPlayer}
        onResumeFromHalfTime={game.resumeFromHalfTime}
        onQuit={game.resetGame}
      />
    );
  }

  return null;
}

export default App;
