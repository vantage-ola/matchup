import type { MatchupResult } from '../types';

interface SettlementCardProps {
  result: MatchupResult | null;
  settlement: {
    player1MatchupScore: number;
    player2MatchupScore: number;
    player1CombinedScore: number;
    player2CombinedScore: number;
    player1Payout: number;
    player2Payout: number;
  };
  playerSide: 'p1' | 'p2';
}

export default function SettlementCard({
  result,
  settlement,
  playerSide,
}: SettlementCardProps) {
  const isP1 = playerSide === 'p1';

  const myScore = isP1 ? settlement.player1MatchupScore : settlement.player2MatchupScore;
  const theirScore = isP1
    ? settlement.player2MatchupScore
    : settlement.player1MatchupScore;
  const myPayout = isP1 ? settlement.player1Payout : settlement.player2Payout;
  const theirPayout = isP1
    ? settlement.player2Payout
    : settlement.player1Payout;

  const iWon = myPayout > theirPayout;

  return (
    <div className={`settlement-card ${iWon ? 'win' : 'loss'}`}>
      {result && (
        <>
          <div className="scoreline">
            <span className="goals">{result.player1Goals}</span>
            <span className="divider">-</span>
            <span className="goals">{result.player2Goals}</span>
          </div>

          <div className="stats">
            <div className="stat">
              <span>Possession</span>
              <span>
                {isP1 ? result.player1Possession : result.player2Possession}% |{' '}
                {isP1 ? result.player2Possession : result.player1Possession}%
              </span>
            </div>
            <div className="stat">
              <span>Tackles</span>
              <span>
                {isP1 ? result.player1Tackles : result.player2Tackles} |{' '}
                {isP1 ? result.player2Tackles : result.player1Tackles}
              </span>
            </div>
            <div className="stat">
              <span>Shots</span>
              <span>
                {isP1 ? result.player1Shots : result.player2Shots} |{' '}
                {isP1 ? result.player2Shots : result.player1Shots}
              </span>
            </div>
          </div>
        </>
      )}

      <div className="scores">
        <div className="score-row">
          <span>Your Matchup Score</span>
          <span>{myScore}</span>
        </div>
        <div className="score-row">
          <span>Their Matchup Score</span>
          <span>{theirScore}</span>
        </div>
      </div>

      <div className={`payout ${iWon ? 'win' : 'loss'}`}>
        {iWon ? (
          <>
            <span>You Won!</span>
            <span>+{myPayout}</span>
          </>
        ) : (
          <>
            <span>You Lost</span>
            <span>-{theirPayout}</span>
          </>
        )}
      </div>
    </div>
  );
}