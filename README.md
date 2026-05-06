# Matchup

Turn-based football strategy on a 22×11 grid. Two teams of 11 alternate single actions, chess-style — every successful move ends your turn and flips possession. The engine is deterministic with an injectable RNG: tackles are an 80% success gamble in production; tests pin the RNG for reproducibility. An in-app rulebook is reachable from the setup screen and from the in-game `?` button.

## Layout

```
matchup/
├── engine/        # Pure TypeScript game engine
├── simulation/    # AI strategies + AI vs AI runner
└── web/           # React 19 + Vite + shadcn/ui frontend
old/               # Previous prototype — ignore
docs/              # Brand guidelines, design system, archived briefs
```

## Commands

```bash
bun matchup/engine/test.ts        # Run engine tests
bun matchup/simulation/run.ts     # AI vs AI simulation
bun --cwd matchup/web dev         # Start web app
bun --cwd matchup/web build       # Production build
```

Use `bun` — not npm/node/npx.

## Game modes

- **1v1 Local Co-op** — two humans, one screen
- **vs AI** — human plays home, `aggressiveStrategy` plays away

## Docs

- `matchup/engine/README.md` — engine spec (grid, rules, API)
- `AGENTS.md` — guidance for AI coding agents
- `docs/BRAND_GUIDELINES.md` — voice and tone
- `docs/UI_DESIGN_SYSTEM.md` — UI design system
