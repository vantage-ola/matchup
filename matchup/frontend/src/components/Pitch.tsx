import type { GameState, PlayerNumber } from '../types';

interface PitchProps {
  gameState: GameState;
  playerSide: PlayerNumber;
}

export default function Pitch({ gameState, playerSide: playerSideProp }: PitchProps) {
  const GRID_COLS = 10;
  const GRID_ROWS = 9;

  const getPlayerLabel = () => {
    const sessionLabel = playerSideProp === 'p1' ? 'You' : 'Opponent';
    return sessionLabel;
  };

  const getOpponentLabel = () => {
    const sessionLabel = playerSideProp === 'p1' ? 'Opponent' : 'You';
    return sessionLabel;
  };

  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const isBall =
          gameState.ball.position.col === col && gameState.ball.position.row === row;
        const isP1 =
          gameState.players.p1.position.col === col &&
          gameState.players.p1.position.row === row;
        const isP2 =
          gameState.players.p2.position.col === col &&
          gameState.players.p2.position.row === row;

        const isGoalArea = col >= 8;

        cells.push(
          <div
            key={`${col}-${row}`}
            className={`pitch-cell ${
              isGoalArea ? 'goal-area' : ''
            } ${isP1 ? 'p1' : ''} ${isP2 ? 'p2' : ''} ${
              isBall ? 'ball' : ''
            }`}
          >
            {isBall && <div className="ball-dot" />}
            {isP1 && !isBall && (
              <div className="player-dot p1">{getPlayerLabel().charAt(0)}</div>
            )}
            {isP2 && !isBall && (
              <div className="player-dot p2">
                {getOpponentLabel().charAt(0)}
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="pitch">
      <div className="pitch-grid">{renderGrid()}</div>
      <div className="pitch-labels">
        <span>Home</span>
        <span>Away</span>
      </div>
    </div>
  );
}