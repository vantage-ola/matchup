import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface FixtureData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string | null;
  awayTeamLogo: string | null;
  league: string;
  kickoffAt: string;
  status: string;
}

interface LobbyStatus {
  status: string;
  homeCount: number;
  awayCount: number;
}

export default function Fixture() {
  const { id } = useParams<{ id: string }>();
  const [fixture] = useState<FixtureData | null>(null);
  const [lobby] = useState<LobbyStatus | null>(null);
  const [loading] = useState(true);
  const [selectedSide, setSelectedSide] = useState<'home' | 'away'>('home');
  const [stake, setStake] = useState(100);

  useEffect(() => {
    // TODO: Fetch fixture and lobby status
  }, [id]);

  const handleJoin = async () => {
    // TODO: Call POST /api/fixtures/:id/join
    // TODO: Redirect to /matchup/:sessionId
  };

  if (loading || !fixture) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixture-page">
      <header className="fixture-header">
        <a href="/">&larr; Back</a>
      </header>

      <div className="fixture-teams">
        <div className="team home">
          {fixture.homeTeamLogo && (
            <img src={fixture.homeTeamLogo} alt={fixture.homeTeam} />
          )}
          <span>{fixture.homeTeam}</span>
        </div>
        <div className="vs">vs</div>
        <div className="team away">
          {fixture.awayTeamLogo && (
            <img src={fixture.awayTeamLogo} alt={fixture.awayTeam} />
          )}
          <span>{fixture.awayTeam}</span>
        </div>
      </div>

      <div className="kickoff">
        {new Date(fixture.kickoffAt).toLocaleString()}
      </div>

      {lobby && (
        <div className="lobby-status">
          <div className="queue home">
            <span>Home: {lobby.homeCount} waiting</span>
          </div>
          <div className="queue away">
            <span>Away: {lobby.awayCount} waiting</span>
          </div>
        </div>
      )}

      <div className="join-form">
        <h3>Pick your side</h3>
        <div className="side-selector">
          <button
            className={selectedSide === 'home' ? 'selected' : ''}
            onClick={() => setSelectedSide('home')}
          >
            {fixture.homeTeam}
          </button>
          <button
            className={selectedSide === 'away' ? 'selected' : ''}
            onClick={() => setSelectedSide('away')}
          >
            {fixture.awayTeam}
          </button>
        </div>

        <label>
          Stake:
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
          />
        </label>

        <button className="join-button" onClick={handleJoin}>
          Join Matchup
        </button>
      </div>
    </div>
  );
}