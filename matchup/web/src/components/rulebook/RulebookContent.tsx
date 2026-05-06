export function RulebookContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <section className="space-y-2">
        <h2 className="text-base font-bold uppercase tracking-wide">The goal</h2>
        <p className="text-muted-foreground">
          Score more than your opponent before the 60-minute clock runs out. Every action ticks 10 seconds off.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold uppercase tracking-wide">The pitch</h2>
        <p className="text-muted-foreground">
          22 columns by 11 rows. Home attacks right, away attacks left. Goals sit in column 1 (home) and column 22 (away),
          rows e through g.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold uppercase tracking-wide">One action per turn</h2>
        <p className="text-muted-foreground">
          Like chess. You move <span className="font-bold text-foreground">one piece, once</span>, then it's the
          opponent's turn. Every successful action — pass, dribble, run, anything — ends your turn. Use it well.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold uppercase tracking-wide">Move types</h2>
        <ul className="space-y-1 text-muted-foreground">
          <li>• <span className="font-bold text-foreground">Dribble</span> — ball carrier steps <span className="font-bold text-foreground">1 cell</span> in any direction.</li>
          <li>• <span className="font-bold text-foreground">Pass</span> — ball carrier sends ball to a teammate up to <span className="font-bold text-foreground">10 cells</span>, any direction (backward is fine).</li>
          <li>• <span className="font-bold text-foreground">Run</span> — off-ball player steps <span className="font-bold text-foreground">1 cell</span> in any direction.</li>
          <li>• <span className="font-bold text-foreground">Shoot</span> — ball carrier strikes the goal column from up to <span className="font-bold text-foreground">10 cells</span>.</li>
          <li>• <span className="font-bold text-foreground">Tackle</span> — defender steps <span className="font-bold text-foreground">1 cell</span> onto the carrier.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold uppercase tracking-wide">Pass risk</h2>
        <p className="text-muted-foreground">
          A pass fails when a defender sits on (or near) the line between passer and receiver. No swarm rule, no random
          bust — if the lane is clear, the ball arrives. Find the seam.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold uppercase tracking-wide">Tackle gamble</h2>
        <p className="text-muted-foreground">
          Step adjacent to the carrier and roll. <span className="font-bold text-foreground">80%</span> success: you take
          the ball and swap places. <span className="font-bold text-foreground">20%</span>: you bounce back a cell, the
          carrier keeps it, and your turn is gone.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold uppercase tracking-wide">Half-time</h2>
        <p className="text-muted-foreground">
          When the clock crosses 30:00, the match pauses. Tap to start the second half.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold uppercase tracking-wide">Tips</h2>
        <ul className="space-y-1 text-muted-foreground">
          <li>• Every move costs you the turn. Make it count.</li>
          <li>• Long passes are now cheap — but only if the lane is clean. Read defenders before you launch one.</li>
          <li>• Defending is positional. Cut passing lanes and force the carrier into a 1-cell shuffle.</li>
          <li>• Tackles are 80% but they're a one-shot bet. Don't tackle if a pass blockade does the same job.</li>
        </ul>
      </section>
    </div>
  );
}
