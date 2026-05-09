export function RulebookContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      {/* ── 01 ─────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <SectionHead num="01" title="The Goal" />
        <p className="text-muted-foreground">
          Score more than your opponent before the 90-minute clock runs out.
          Every action ticks <Key>10s</Key> off the clock.
        </p>
      </div>

      {/* ── 02 ─────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <SectionHead num="02" title="The Pitch" />
        <p className="text-muted-foreground">
          <Key>22 × 11</Key> grid. Home attacks right, away attacks left.
          Goals sit in column 1 (home) and column 22 (away), rows{' '}
          <Key>e–g</Key>.
        </p>
      </div>

      {/* ── 03 ─────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <SectionHead num="03" title="One Action Per Turn" />
        <p className="text-muted-foreground">
          Like chess — move{' '}
          <strong className="text-foreground">one piece, once</strong>, then
          it's the opponent's turn. Every successful action ends your turn.
        </p>
      </div>

      {/* ── 04 ─────────────────────────────────────────── */}
      <div className="space-y-2">
        <SectionHead num="04" title="Move Types" />
        <div className="grid grid-cols-2 gap-1.5">
          <MoveCard
            label="Dribble"
            value="1 cell"
            note="Ball carrier, any direction"
          />
          <MoveCard
            label="Pass"
            value="Up to 10"
            note="Ball carrier → teammate"
          />
          <MoveCard
            label="Run"
            value="1 cell"
            note="Off-ball, any direction"
          />
          <MoveCard
            label="Shoot"
            value="Up to 10"
            note="Ball carrier → goal column"
          />
          <MoveCard
            label="Tackle"
            value="1 cell"
            note="Step onto the carrier"
          />
        </div>
      </div>

      {/* ── 05 ─────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <SectionHead num="05" title="Pass Risk" />
        <p className="text-muted-foreground">
          A pass fails when a defender sits near the line between passer and
          receiver. No random bust — if the lane is clear, the ball arrives.
          Find the seam.
        </p>
      </div>

      {/* ── 06 ─────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <SectionHead num="06" title="Tackle Gamble" />
        <div className="rounded border border-border bg-muted/30 px-3 py-2.5">
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="rounded-l-full"
              style={{
                width: '80%',
                backgroundColor: 'var(--status-ok, #22c55e)',
              }}
            />
            <div
              className="rounded-r-full"
              style={{
                width: '20%',
                backgroundColor: 'var(--status-error, #ef4444)',
              }}
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-widest">
            <span style={{ color: 'var(--status-ok, #22c55e)' }}>
              Win 80%
            </span>
            <span style={{ color: 'var(--status-error, #ef4444)' }}>
              Bounce 20%
            </span>
          </div>
        </div>
        <p className="text-muted-foreground">
          Step adjacent to the carrier and roll. Win: you take the ball and
          swap places. Bounce: you get pushed back, carrier keeps it, your turn
          is gone.
        </p>
      </div>

      {/* ── 07 ─────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <SectionHead num="07" title="Half-Time" />
        <p className="text-muted-foreground">
          When the clock crosses <Key>30:00</Key>, the match pauses. Tap to
          start the second half.
        </p>
      </div>

      {/* ── Tips ───────────────────────────────────────── */}
      <div className="space-y-2.5 pt-1">
        <SectionHead num="—" title="Tips" />
        <div className="rounded border border-border bg-muted/40 px-3 py-3">
          <ul className="space-y-2 text-muted-foreground">
            <li>Every move costs you the turn. Make it count.</li>
            <li>
              Long passes are cheap — but only if the lane is clean. Read
              defenders before you launch.
            </li>
            <li>
              Defending is positional. Cut passing lanes and force the carrier
              into a 1-cell shuffle.
            </li>
            <li>
              Tackles are a one-shot bet. Don't tackle if a pass blockade does
              the same job.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Primitives ────────────────────────────────────────── */

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[10px] text-muted-foreground/40">
        {num}
      </span>
      <h2 className="text-[11px] font-bold uppercase tracking-widest">
        {title}
      </h2>
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded bg-muted px-1 py-px font-mono text-xs font-semibold text-foreground">
      {children}
    </span>
  );
}

function MoveCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded border border-border px-2.5 py-2">
      <div className="text-[11px] font-bold uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-xs text-muted-foreground">
        {value}
      </div>
      <div className="mt-1 text-[11px] leading-snug text-muted-foreground/60">
        {note}
      </div>
    </div>
  );
}