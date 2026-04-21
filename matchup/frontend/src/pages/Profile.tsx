import { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  walletBalance: number;
}

interface MatchHistory {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  payout: number;
  createdAt: string;
}

export default function Profile() {
  const [profile] = useState<UserProfile | null>(null);
  const [matches] = useState<MatchHistory[]>([]);
  const [loading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user profile
    // TODO: Fetch match history
  }, []);

  if (loading || !profile) {
    return <div>Loading profile...</div>;
  }

  const wins = matches.filter((m) => m.result === 'win').length;
  const total = matches.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <a href="/">&larr; Back</a>
      </header>

      <div className="profile-card">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.displayName} className="avatar" />
        ) : (
          <div className="avatar-placeholder">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <h2>{profile.displayName}</h2>
        <p className="username">@{profile.username}</p>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="label">Win Rate</span>
          <span className="value">{winRate}%</span>
        </div>
        <div className="stat">
          <span className="label">Matches</span>
          <span className="value">{total}</span>
        </div>
        <div className="stat">
          <span className="label">Wins</span>
          <span className="value">{wins}</span>
        </div>
      </div>

      <div className="match-history">
        <h3>Recent Matches</h3>
        {matches.length === 0 ? (
          <p>No matches yet</p>
        ) : (
          matches.slice(0, 10).map((match) => (
            <div key={match.id} className={`match-row ${match.result}`}>
              <span className="opponent">{match.opponent}</span>
              <span className="result">{match.result}</span>
              <span className="payout">
                {match.payout > 0 ? '+' : ''}
                {match.payout}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}