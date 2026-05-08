import { useRef, useEffect, useState } from 'react';
import type { Player } from '@/lib/engine';

interface PlayerTokenProps {
  player: Player;
  isSelected: boolean;
  isCurrent: boolean;
  compact: boolean;
  tackleFailed?: boolean;
  onClick: () => void;
  onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void;
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

/**
 * Returns true if the user prefers reduced motion.
 * Safe for SSR (returns false on the server).
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function PlayerToken({ player, isSelected, isCurrent, compact, tackleFailed, onClick, onPointerDown }: PlayerTokenProps) {
  const isHome = player.team === 'home';

  // Track the previous grid position so we can animate the delta
  const prevPosRef = useRef<{ col: number; row: string }>({ col: player.position.col, row: player.position.row });
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const prev = prevPosRef.current;
    const cur = player.position;

    if (prev.col !== cur.col || prev.row !== cur.row) {
      if (!prefersReducedMotion()) {
        // Calculate the reverse offset (where we came from, in grid cells)
        const dx = prev.col - cur.col;
        const dy = (prev.row.charCodeAt(0) - 'a'.charCodeAt(0)) - (cur.row.charCodeAt(0) - 'a'.charCodeAt(0));

        // Jump to old position instantly, then animate to 0
        setOffset({ x: dx, y: dy });
        setIsAnimating(false);

        // Trigger the transition on the next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimating(true);
            setOffset({ x: 0, y: 0 });
          });
        });

        // Clean up animation flag after transition
        const timer = setTimeout(() => setIsAnimating(false), 280);
        prevPosRef.current = { col: cur.col, row: cur.row };
        return () => clearTimeout(timer);
      }

      prevPosRef.current = { col: cur.col, row: cur.row };
    }
  }, [player.position.col, player.position.row]);

  // Convert grid-cell offset to percentage of cell size (100% = 1 cell)
  const translateX = offset.x * 100;
  const translateY = offset.y * 100;

  // tackle-fail keyframes also drive `transform`, so they would clobber the
  // FLIP slide if both ran at once. Skip the shake when we're mid-translate.
  const showTackleFail = tackleFailed && !isAnimating;
  const animation = showTackleFail
    ? 'tackle-fail 400ms ease-out 1'
    : isSelected
    ? 'pulse 1.5s ease-in-out infinite'
    : 'none';

  return (
    <button
      onClick={onClick}
      onPointerDown={onPointerDown}
      className="relative flex items-center justify-center rounded-full"
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
        transform: showTackleFail ? undefined : `translate(${translateX}%, ${translateY}%)`,
        transition: isAnimating ? 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        willChange: isAnimating ? 'transform' : 'auto',
        zIndex: isAnimating ? 10 : undefined,
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
