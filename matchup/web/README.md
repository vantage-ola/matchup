# Matchup Web

React 19 + Vite + Tailwind v4 + shadcn/ui frontend for the Matchup engine.

## Commands

```bash
bun --cwd matchup/web dev      # Dev server
bun --cwd matchup/web build    # Production build
```

## Structure

```
src/
├── App.tsx                    # Phase router (setup → playing → fullTime)
├── lib/engine.ts              # Bridge — re-exports from @engine and @simulation
├── hooks/useGame.ts           # Central state hook (Engine ref + GameState)
└── components/
    ├── setup/SetupScreen.tsx  # Mode (1v1 local / vs AI) + formation picks
    └── game/                  # Pitch, PlayerToken, ScoreBar, MoveResult, GameScreen, FullTimeScreen
```

The web app does not own game logic. It calls into the engine through `lib/engine.ts`, which re-exports `Engine`, `getValidMoves`, formations, and types via Vite path aliases (`@engine`, `@simulation`).

## Adding shadcn components

```bash
bunx shadcn@latest add <component>
```
