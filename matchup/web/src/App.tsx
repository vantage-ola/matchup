import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useGame } from '@/hooks/useGame';
import type { FormationName } from '@/lib/engine';
import { MenuScreen } from '@/components/menu/MenuScreen';
import { SetupScreen } from '@/components/setup/SetupScreen';
import { GameScreen } from '@/components/game/GameScreen';
import { FullTimeScreen } from '@/components/game/FullTimeScreen';
import { RulebookScreen } from '@/components/rulebook/RulebookScreen';
import { TutorialScreen } from '@/components/tutorial/TutorialScreen';
import { HistoryScreen } from '@/components/history/HistoryScreen';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { ReplayScreen } from '@/components/replay/ReplayScreen';
import { NotFoundScreen } from '@/components/NotFoundScreen';
import { loadMatchById, type MatchRecord } from '@/lib/storage';

export function App() {
  const game = useGame();
  const navigate = useNavigate();
  const [formations, setFormations] = useState<{ home: FormationName; away: FormationName }>({
    home: '4-3-3',
    away: '4-3-3',
  });
  const [lastMode, setLastMode] = useState<'local' | 'ai'>('local');

  // Sync game phase → URL when phase changes from inside the engine
  // (e.g. fullTime when match ends, halfTime resume, etc.)
  useEffect(() => {
    if (game.phase === 'fullTime') navigate('/fulltime', { replace: true });
    else if (game.phase === 'playing') navigate('/match', { replace: true });
  }, [game.phase, navigate]);

  const handleStart = useCallback(
    (mode: 'local' | 'ai', home: FormationName, away: FormationName) => {
      setFormations({ home, away });
      setLastMode(mode);
      game.startGame(mode, home, away);
    },
    [game],
  );

  const handleRematch = useCallback(() => {
    const swapped = { home: formations.away, away: formations.home };
    setFormations(swapped);
    game.startGame(lastMode, swapped.home, swapped.away);
  }, [formations, lastMode, game]);

  const handleQuitToMenu = useCallback(() => {
    game.resetGame();
    navigate('/');
  }, [game, navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MenuScreen
            onPlay={() => {
              game.goToSetup();
              navigate('/play');
            }}
            onContinue={() => {
              game.continueMatch();
            }}
            onTutorial={() => {
              game.goToTutorial();
              navigate('/tutorial');
            }}
            onShowRulebook={() => navigate('/rulebook')}
            onHistory={() => navigate('/history')}
            onProfile={() => navigate('/profile')}
          />
        }
      />

      <Route
        path="/play"
        element={
          <SetupScreen
            onStart={handleStart}
            onShowRulebook={() => navigate('/rulebook')}
            onBack={() => {
              game.goToMenu();
              navigate('/');
            }}
          />
        }
      />

      <Route
        path="/match"
        element={
          game.state ? (
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
              onQuit={handleQuitToMenu}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/fulltime"
        element={
          game.state ? (
            <FullTimeScreen
              state={game.state}
              homeFormation={formations.home}
              awayFormation={formations.away}
              onPlayAgain={handleQuitToMenu}
              onRematch={handleRematch}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/tutorial"
        element={
          <TutorialScreen
            onComplete={() => {
              game.goToMenu();
              navigate('/');
            }}
            onQuit={() => {
              game.goToMenu();
              navigate('/');
            }}
          />
        }
      />

      <Route path="/rulebook" element={<RulebookScreen onBack={() => navigate(-1)} />} />
      <Route path="/history" element={<HistoryRoute />} />
      <Route path="/profile" element={<ProfileScreen onBack={() => navigate('/')} />} />
      <Route path="/replay/:matchId" element={<ReplayRoute />} />

      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

function HistoryRoute() {
  const navigate = useNavigate();
  return (
    <HistoryScreen
      onBack={() => navigate('/')}
      onReplay={(match: MatchRecord) => navigate(`/replay/${encodeURIComponent(match.matchId)}`)}
    />
  );
}

function ReplayRoute() {
  const navigate = useNavigate();
  const matchId = decodeURIComponent(window.location.pathname.split('/').pop() ?? '');
  const [match, setMatch] = useState<MatchRecord | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void loadMatchById(matchId).then((m) => {
      if (!cancelled) setMatch(m ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  if (match === undefined) return null;
  if (match === null) return <NotFoundScreen />;
  return <ReplayScreen match={match} onBack={() => navigate('/history')} />;
}

export default App;
