import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { GameState, Resolution, Move } from '../types';

export default function Matchup() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [gameState] = useState<GameState | null>(null);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [opponentCommitted] = useState(false);
  const [resolution] = useState<Resolution | null>(null);

  useEffect(() => {
    // TODO: Connect WebSocket
    // TODO: Fetch initial game state
    // TODO: Handle events: OPPONENT_COMMITTED, TURN_RESOLVED, PHASE_TRANSITION, MATCHUP_COMPLETE
  }, [sessionId]);

  const handleCommit = async () => {
    if (!selectedMove) return;
    // TODO: Send COMMIT_MOVE via WebSocket
  };

  const moves: Move[] = [
    'pass',
    'long_ball',
    'run',
    'press',
    'tackle',
    'hold_shape',
    'shoot',
    'sprint',
  ];

  if (!gameState) {
    return <div>Loading matchup...</div>;
  }

  const isMyTurn = gameState.turnStatus !== 'resolving';

  return (
    <div className="matchup-page">
      <header className="matchup-header">
        <a href="/">&larr;</a>
        <span>
          Phase {gameState.phase}/{gameState.totalPhases}
        </span>
      </header>

      <div className="score-bar">
        <span className="p1-score">{gameState.score.p1}</span>
        <span className="p2-score">{gameState.score.p2}</span>
      </div>

      {/* Pitch component would go here */}
      <div className="pitch">
        <div className="ball" />
      </div>

      <div className="opponent-status">
        {opponentCommitted ? (
          <span>Opponent committed</span>
        ) : (
          <span>Waiting for opponent...</span>
        )}
      </div>

      {resolution && (
        <div className="resolution-overlay">
          <div className="outcome">{resolution.outcome}</div>
        </div>
      )}

      <div className="move-selector">
        <div className="moves">
          {moves.map((move) => (
            <button
              key={move}
              className={selectedMove === move ? 'selected' : ''}
              onClick={() => setSelectedMove(move)}
              disabled={!isMyTurn}
            >
              {move}
            </button>
          ))}
        </div>
        <button
          className="commit-button"
          onClick={handleCommit}
          disabled={!selectedMove || !isMyTurn}
        >
          Commit
        </button>
      </div>
    </div>
  );
}