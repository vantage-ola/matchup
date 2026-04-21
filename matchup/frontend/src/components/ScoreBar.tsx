import type { GameState, PlayerNumber } from '../types';

interface ScoreBarProps {
  gameState: GameState;
  playerSide: PlayerNumber;
  homeTeam: string;
  awayTeam: string;
}

export default function ScoreBar({
  gameState,
  playerSide,
  homeTeam,
  awayTeam,
}: ScoreBarProps) {
  const isHome = playerSide === 'p1';

  const getDisplayScore = () => {
    if (isHome) {
      return {
        left: gameState.score.p1,
        right: gameState.score.p2,
      };
    }
    return {
      left: gameState.score.p2,
      right: gameState.score.p1,
    };
  };

  const score = getDisplayScore();

  return (
    <div className="score-bar">
      <div className="team left">
        <span className="name">{isHome ? homeTeam : awayTeam}</span>
        <span className="score">{score.left}</span>
      </div>

      <div className="match-info">
        <span className="phase">
          Phase {gameState.phase}/{gameState.totalPhases}
        </span>
        <span className="turn">Turn {gameState.turn}</span>
        {gameState.attackingPlayer === playerSide ? (
          <span className="attacking">Attacking</span>
        ) : (
          <span className="defending">Defending</span>
        )}
      </div>

      <div className="team right">
        <span className="score">{score.right}</span>
        <span className="name">{isHome ? awayTeam : homeTeam}</span>
      </div>
    </div>
  );
}