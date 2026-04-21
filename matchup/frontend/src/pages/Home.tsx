import { useEffect, useState } from 'react';

interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string | null;
  awayTeamLogo: string | null;
  league: string;
  kickoffAt: string;
  status: string;
}

export default function Home() {
  const [fixtures] = useState<Fixture[]>([]);
  const [loading] = useState(true);

  useEffect(() => {
    // TODO: Fetch fixtures from API
  }, []);

  return (
    <div className="home">
      <header className="home-header">
        <h1>MatchDay</h1>
        <p>Choose a match to play</p>
      </header>

      <main className="fixtures-list">
        {loading ? (
          <p>Loading...</p>
        ) : fixtures.length === 0 ? (
          <p>No upcoming matches</p>
        ) : (
          fixtures.map((fixture) => (
            <a key={fixture.id} href={`/fixture/${fixture.id}`} className="fixture-card">
              <div className="fixture-teams">
                <span className="team home">{fixture.homeTeam}</span>
                <span className="vs">vs</span>
                <span className="team away">{fixture.awayTeam}</span>
              </div>
              <div className="fixture-meta">
                <span className="league">{fixture.league}</span>
                <span className="kickoff">
                  {new Date(fixture.kickoffAt).toLocaleString()}
                </span>
              </div>
            </a>
          ))
        )}
      </main>
    </div>
  );
}