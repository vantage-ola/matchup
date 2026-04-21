import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Settlement {
  sessionId: string;
  player1MatchupScore: number;
  player2MatchupScore: number;
  player1AccuracyScore: number | null;
  player2AccuracyScore: number | null;
  player1CombinedScore: number;
  player2CombinedScore: number;
  player1Payout: number;
  player2Payout: number;
  status: 'pending' | 'complete';
}

interface MatchupResult {
  player1Goals: number;
  player2Goals: number;
  player1Possession: number;
  player2Possession: number;
  player1Tackles: number;
  player2Tackles: number;
  player1Shots: number;
  player2Shots: number;
}

export default function Settlement() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [settlement] = useState<Settlement | null>(null);
  const [result] = useState<MatchupResult | null>(null);
  const [loading] = useState(true);

  useEffect(() => {
    // TODO: Fetch settlement and matchup result
  }, [sessionId]);

  if (loading || !settlement) {
    return <div>Loading settlement...</div>;
  }

  const isWinner = settlement.player1Payout > settlement.player2Payout;

  return (
    <div className="settlement-page">
      <header className="settlement-header">
        <h1>Matchup Complete</h1>
      </header>

      <div className="scoreline">
        <span className="p1">{result?.player1Goals ?? 0}</span>
        <span className="divider">-</span>
        <span className="p2">{result?.player2Goals ?? 0}</span>
      </div>

      <div className="stats">
        <div className="stat-row">
          <span>Possession</span>
          <span>
            {result?.player1Possession ?? 0}% | {result?.player2Possession ?? 0}%
          </span>
        </div>
        <div className="stat-row">
          <span>Tackles</span>
          <span>
            {result?.player1Tackles ?? 0} | {result?.player2Tackles ?? 0}
          </span>
        </div>
        <div className="stat-row">
          <span>Shots</span>
          <span>
            {result?.player1Shots ?? 0} | {result?.player2Shots ?? 0}
          </span>
        </div>
      </div>

      <div className="scores">
        <div className="score">
          <span>Matchup Score</span>
          <span>{settlement.player1MatchupScore}</span>
        </div>
        {settlement.player1AccuracyScore && (
          <div className="score">
            <span>Accuracy</span>
            <span>{settlement.player1AccuracyScore}</span>
          </div>
        )}
        <div className="score total">
          <span>Combined</span>
          <span>{settlement.player1CombinedScore}</span>
        </div>
      </div>

      <div className={`payout ${isWinner ? 'win' : 'loss'}`}>
        {isWinner ? (
          <>
            <span>You Won!</span>
            <span>+{settlement.player1Payout}</span>
          </>
        ) : (
          <>
            <span>You Lost</span>
            <span>-{settlement.player2Payout}</span>
          </>
        )}
      </div>
    </div>
  );
}