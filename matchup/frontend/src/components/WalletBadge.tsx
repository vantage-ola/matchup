interface WalletBadgeProps {
  balance: number;
}

export default function WalletBadge({ balance }: WalletBadgeProps) {
  return (
    <a href="/wallet" className="wallet-badge">
      <span className="icon">&#x20A6;</span>
      <span className="balance">{balance.toLocaleString()}</span>
    </a>
  );
}