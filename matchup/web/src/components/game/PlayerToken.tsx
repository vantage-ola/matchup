import type { Player } from '@/lib/engine';

interface PlayerTokenProps {
  player: Player;
  isSelected: boolean;
  isCurrent: boolean;
  compact: boolean;
  tackleFailed?: boolean;
  onClick: () => void;
}

const SHORT_NAMES: Record<string, string> = {
  gk: 'GK',
  def1: 'CB1', def2: 'CB2', def3: 'CB3', def4: 'CB4', def5: 'CB5',
  mid1: 'CM1', mid2: 'CM2', mid3: 'CM3', mid4: 'CM4', mid5: 'CM5',
  fwd1: 'ST', fwd2: 'RW', fwd3: 'LW',
};

function getShortName(player: Player): string {
  const suffix = player.id.replace(/^(home|away)_/, '');
  return SHORT_NAMES[suffix] ?? suffix.toUpperCase();
}

export function PlayerToken({ player, isSelected, isCurrent, compact, tackleFailed, onClick }: PlayerTokenProps) {
  const isHome = player.team === 'home';

  const animation = tackleFailed
    ? 'tackle-fail 400ms ease-out 1'
    : isSelected
    ? 'pulse 1.5s ease-in-out infinite'
    : 'none';

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center rounded-full transition-all"
      style={{
        width: compact ? 22 : 30,
        height: compact ? 22 : 30,
        backgroundColor: isHome ? '#ffffff' : '#e11d48',
        color: isHome ? '#0f172a' : '#ffffff',
        border: isHome ? '2px solid #0f172a' : '2px solid #fecdd3',
        opacity: isCurrent ? 1 : 0.45,
        boxShadow: isSelected ? '0 0 0 3px #facc15' : 'none',
        animation,
        fontSize: compact ? 6 : 8,
        fontWeight: 700,
        lineHeight: 1,
        cursor: isCurrent ? 'pointer' : 'default',
      }}
    >
      {!compact && getShortName(player)}
      {player.hasBall && (
        <span
          className="absolute rounded-full bg-amber-400"
          style={{
            width: compact ? 6 : 8,
            height: compact ? 6 : 8,
            bottom: -2,
            right: -2,
          }}
        />
      )}
    </button>
  );
}
