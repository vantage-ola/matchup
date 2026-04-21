import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  createdAt: string;
}

export default function Wallet() {
  const [balance] = useState(0);
  const [transactions] = useState<Transaction[]>([]);
  const [canClaim] = useState(false);

  useEffect(() => {
    // TODO: Fetch wallet balance and transactions
    // TODO: Check if daily claim available
  }, []);

  const handleClaim = async () => {
    // TODO: Call POST /api/wallet/claim-daily
    // TODO: Refresh balance
  };

  return (
    <div className="wallet-page">
      <header className="wallet-header">
        <a href="/">&larr; Back</a>
        <h1>Wallet</h1>
      </header>

      <div className="balance-card">
        <span className="label">Balance</span>
        <span className="amount">{balance.toLocaleString()}</span>
      </div>

      {canClaim && (
        <button className="claim-button" onClick={handleClaim}>
          Claim Daily +100
        </button>
      )}

      <div className="transactions">
        <h3>History</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className={`transaction ${tx.type}`}
            >
              <span className="desc">{tx.description}</span>
              <span className="amount">
                {tx.type === 'credit' ? '+' : '-'}
                {tx.amount}
              </span>
              <span className="date">
                {new Date(tx.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}