/**
 * All field markings as a single SVG layer.
 * ViewBox 220×110 maps 1:1 to the 22×11 CSS grid (each cell = 10×10 units).
 * Rendered below every interactive overlay so lines never occlude tokens or lanes.
 */
export function PitchMarkings() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 220 110"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* ── Lines ──────────────────────────────────────── */}
      <g
        stroke="var(--pitch-line)"
        fill="none"
        strokeWidth={0.45}
        vectorEffect="non-scaling-stroke"
      >
        {/* Half-way line */}
        <line x1={110} y1={0} x2={110} y2={110} />

        {/* Center circle */}
        <circle cx={110} cy={55} r={18} />

        {/* Home penalty area (cols 1-4, rows c-i) */}
        <rect x={0} y={20} width={40} height={70} />

        {/* Away penalty area (cols 19-22, rows c-i) */}
        <rect x={180} y={20} width={40} height={70} />

        {/* Home 6-yard box (cols 1-2, rows d-h) */}
        <rect x={0} y={30} width={20} height={50} />

        {/* Away 6-yard box (cols 21-22, rows d-h) */}
        <rect x={200} y={30} width={20} height={50} />

        {/* Goal mouths — thicker stroke to mark the target */}
        <line x1={0} y1={40} x2={0} y2={70} strokeWidth={0.9} />
        <line x1={220} y1={40} x2={220} y2={70} strokeWidth={0.9} />
      </g>

      {/* ── Spots ──────────────────────────────────────── */}
      <g fill="var(--pitch-line)">
        <circle cx={110} cy={55} r={1} />
        <circle cx={28} cy={55} r={0.7} />
        <circle cx={192} cy={55} r={0.7} />
      </g>
    </svg>
  );
}