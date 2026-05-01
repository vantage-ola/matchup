import { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import type { FormationName } from '@/lib/engine';
import { SetupScreen } from '@/components/setup/SetupScreen';
import { GameScreen } from '@/components/game/GameScreen';
import { FullTimeScreen } from '@/components/game/FullTimeScreen';

export function App() {
  const game = useGame();
  const [formations, setFormations] = useState<{ home: FormationName; away: FormationName }>({
    home: '4-3-3',
    away: '4-3-3',
  });

  if (game.phase === 'setup') {
    return (
      <SetupScreen
        onStart={(mode, home, away) => {
          setFormations({ home, away });
          game.startGame(mode, home, away);
        }}
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
        onSelectPlayer={game.selectPlayer}
        onExecuteMove={game.executeMove}
        onDeselect={game.deselectPlayer}
        onQuit={game.resetGame}
      />
    );
  }

  return null;
}

export default App;
