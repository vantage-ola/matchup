# Matchup — UI Design System & Component Guidelines

> Version 1.0 · Reference for consistent UI development and prompting

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout & Responsive Design](#layout--responsive-design)
5. [Component Patterns](#component-patterns)
6. [Shadcn Component Mapping](#shadcn-component-mapping)
7. [Dark Mode](#dark-mode)
8. [Page-Specific Guidelines](#page-specific-guidelines)
9. [Prompting Guidelines](#prompting-guidelines)

---

## Design Philosophy

### Core Principles

**Swiss Modernist + Football Culture**

The design is precise, purposeful, and respects the user's intelligence. Every element earns its place. No decoration for decoration's sake.

- **The pitch is the hero** — the 2D tactical view is the visual anchor
- **Typography does the work** — hierarchy through weight and size, not color
- **Flat geometric shapes** — no gradients, no shadows beyond 4px radius
- **Generous white space** — elements breathe, Swiss grid alignment

### What This Is NOT

- Not a gaming app aesthetic (no neon, glow effects, RPG badges)
- Not a fintech app aesthetic (no friendly illustrations, no "seamless experience")
- Not a betting app aesthetic (no odds displays, no accumulator cards)
- Not corporate (no stock photography, no sanitized marketing)

---

## Color System

### Light Mode

```css
/* Primary Colors */
--primary: #004521;           /* Deep pitch green - actions, emphasis */
--primary-container: #1B5E35; /* Darker green - buttons, fills */
--on-primary: #FFFFFF;        /* Text on primary */

/* Secondary Colors */
--secondary: #056D3D;         /* Mid green */
--secondary-container: #9DF6B8;

/* Accent Colors */
--tertiary: #00452D;
--tertiary-fixed: #94F6C4;    /* Mint - opponent differentiation */
--tertiary-fixed-dim: #78D9AA;

/* Surface Colors */
--background: #FFFFFF;        /* Pure white - main canvas */
--surface: #FEF9F1;           /* Off-white cream */
--surface-container: #F2EDE5;
--surface-container-low: #F8F3EB;
--surface-container-high: #ECE8E0;
--surface-container-highest: #E7E2DA;

/* Text Colors */
--on-surface: #111111;        /* Near-black - primary text */
--on-surface-variant: #404941;
--outline: #707970;           /* Mid-grey - labels, borders */
--outline-variant: #C0C9BE;

/* Functional Colors */
--error: #BA1A1A;
--success: #1B5E35;
```

### Dark Mode

```css
/* Primary Colors */
--primary: #92D6A2;           /* Lighter green for dark mode */
--primary-container: #1B5E35; /* Same green - buttons, fills */
--on-primary: #FFFFFF;

/* Surface Colors */
--background: #111111;        /* Near-black - main canvas */
--surface: #1A1A1A;
--surface-container: #222222;
--surface-container-low: #1F1F1F;
--surface-container-high: #2A2A2A;
--surface-container-highest: #333333;

/* Text Colors */
--on-surface: #FEF9F1;        /* Cream - primary text */
--on-surface-variant: #A0A0A0;
--outline: #707970;
--outline-variant: #444444;

/* Accent Colors */
--tertiary-fixed: #6ECFA0;    /* Mint accent - slightly adjusted for dark */
--tertiary-fixed-dim: #78D9AA;
```

### Tailwind Config Reference

```ts
// tailwind.config.ts
colors: {
  primary: {
    DEFAULT: '#004521',
    container: '#1B5E35',
    fixed: '#ADF2BC',
    'fixed-dim': '#92D6A2',
  },
  secondary: {
    DEFAULT: '#056D3D',
    container: '#9DF6B8',
  },
  tertiary: {
    DEFAULT: '#00452D',
    fixed: '#94F6C4',
    'fixed-dim': '#78D9AA',
    container: '#005F3F',
  },
  background: '#FFFFFF',
  surface: {
    DEFAULT: '#FEF9F1',
    container: '#F2EDE5',
    'container-low': '#F8F3EB',
    'container-high': '#ECE8E0',
    'container-highest': '#E7E2DA',
  },
  foreground: '#111111',
  muted: '#888888',
  border: '#C0C9BE',
}
```

---

## Typography

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
letter-spacing: -0.01em; /* Base tracking */
```

### Type Scale

| Token | Size | Weight | Tracking | Usage |
|-------|------|--------|----------|-------|
| `display-lg` | 56px | 900 | -0.05em | Large scorelines |
| `headline-lg` | 32px | 900 | -0.05em | Page titles |
| `headline-md` | 24px | 800 | -0.02em | Section headers |
| `title-md` | 18px | 700 | -0.01em | Card titles, team names |
| `body-md` | 14px | 400 | -0.01em | Body text |
| `body-sm` | 12px | 400 | -0.01em | Secondary text |
| `label-sm` | 11px | 600 | +0.05em | Uppercase labels |
| `label-xs` | 10px | 600 | +0.05em | Small labels |

### Tailwind Typography Classes

```tsx
// Large numerals (scores)
<span className="text-5xl font-black tracking-tight">

// Headlines
<h1 className="text-2xl font-bold tracking-tight uppercase">

// Labels
<span className="text-[11px] font-semibold uppercase tracking-wider text-muted">

// Body
<p className="text-sm leading-tight">
```

---

## Layout & Responsive Design

### Breakpoints

```css
/* Mobile Portrait (default) */
/* Tablet: md: 768px */
/* Desktop: lg: 1024px */
/* Wide: xl: 1280px */
```

### Layout Patterns

#### Game Screens (Landscape Required)

```
Mobile Portrait:
┌─────────────────────┐
│  🔄 ROTATE PROMPT   │
│                     │
│  Rotate your device │
│  to play the match  │
│                     │
│    [pitch icon]     │
└─────────────────────┘

Mobile/Desktop Landscape:
┌──────────────────────┬──────────┐
│                      │          │
│      PITCH VIEW      │  MOVES   │
│       (70%)          │  (30%)   │
│                      │          │
│                      │ [COMMIT] │
└──────────────────────┴──────────┘
```

#### List Screens (Responsive)

```
Mobile Portrait:
┌─────────────────────┐
│ Header              │
├─────────────────────┤
│ [Card 1]            │
│ [Card 2]            │
│ [Card 3]            │
│                     │
├─────────────────────┤
│ Bottom Nav          │
└─────────────────────┘

Desktop:
┌──────────┬──────────────────────┐
│ Side Nav │ Header               │
│          ├──────────────────────┤
│ [nav]    │ [Card] [Card] [Card] │
│ [nav]    │                      │
│ [nav]    │                      │
│          │                      │
│ [user]   │                      │
└──────────┴──────────────────────┘
```

### Split Layout Ratios

```tsx
// Game screen: 70/30 split
<main className="flex flex-col md:flex-row h-screen">
  <section className="w-full md:w-[70%]">{/* Pitch */}</section>
  <aside className="w-full md:w-[30%]">{/* Controls */}</aside>
</main>

// Wallet/Profile: 35/65 split
<main className="flex flex-col md:flex-row h-full">
  <section className="w-full md:w-[35%]">{/* Summary */}</section>
  <section className="w-full md:w-[65%]">{/* Details */}</section>
</main>
```

### Landscape Orientation Prompt

```tsx
// Show on mobile portrait for game screens
<div className="flex md:hidden fixed inset-0 z-50 bg-primary-container items-center justify-center">
  <div className="text-center text-on-primary p-8">
    <RotateCcw className="w-16 h-16 mx-auto mb-4" />
    <h2 className="text-2xl font-bold tracking-tight mb-2">ROTATE DEVICE</h2>
    <p className="text-sm opacity-80">This tactical interface requires landscape orientation.</p>
  </div>
</div>
```

---

## Component Patterns

### Buttons

```tsx
// Primary Button
<Button className="bg-primary-container text-on-primary h-[52px] font-bold uppercase tracking-wide rounded">
  EXECUTE PLAY
</Button>

// Secondary Button (outline)
<Button variant="outline" className="border-primary-container text-on-surface h-[52px]">
  ADJUST FORMATION
</Button>

// Ghost Button
<Button variant="ghost" className="border-outline text-on-surface h-[52px]">
  VIEW DETAILS
</Button>

// Disabled
<Button disabled className="opacity-50 cursor-not-allowed">
  CONFIRM TACTICS
</Button>
```

### Move Chips (Game Controls)

```tsx
// Unselected
<button className="px-4 py-2 bg-surface text-primary border border-outline-variant rounded font-bold text-sm uppercase">
  PASS
</button>

// Selected
<button className="px-4 py-2 bg-primary text-on-primary rounded font-bold text-sm uppercase">
  RUN
</button>

// Committed/Locked
<button className="px-4 py-2 bg-primary-container text-on-primary rounded font-bold text-sm uppercase flex items-center gap-2">
  <Lock className="w-3 h-3" />
  SHOOT
</button>
```

### Input Fields

```tsx
// Swiss-style flat input
<div className="relative">
  <label className="block text-[11px] uppercase tracking-wider text-muted mb-1">
    USERNAME
  </label>
  <input className="w-full bg-transparent border-0 border-b border-outline-variant 
    focus:border-primary-container px-0 py-2 text-on-surface font-medium
    transition-colors outline-none" />
</div>
```

### Status Indicators

```tsx
// Open/Live
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" />
  <span className="text-sm font-semibold text-on-surface">LIVE</span>
</div>

// Waiting
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full border-2 border-outline" />
  <span className="text-sm text-muted">WAITING</span>
</div>

// Settled/Complete
<div className="flex items-center gap-2">
  <CheckCircle className="w-4 h-4 text-primary-container" />
  <span className="text-sm font-semibold text-primary-container">SETTLED</span>
</div>
```

### Fixture Cards

```tsx
<article className="bg-surface-container-low border border-outline-variant/20 rounded overflow-hidden">
  {/* Header */}
  <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high">
    <span className="text-[10px] uppercase tracking-wider font-bold text-primary">PREMIER LEAGUE</span>
    <span className="text-[10px] uppercase tracking-wider text-muted">20:00</span>
  </div>
  
  {/* Teams */}
  <div className="p-6 flex items-center justify-between">
    <div className="flex flex-col items-center gap-3 w-1/3">
      <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center font-bold text-lg">
        ARS
      </div>
      <span className="font-bold text-sm">Arsenal</span>
    </div>
    
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black tracking-tight text-on-surface">VS</span>
    </div>
    
    <div className="flex flex-col items-center gap-3 w-1/3">
      <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center font-bold text-lg">
        CHE
      </div>
      <span className="font-bold text-sm">Chelsea</span>
    </div>
  </div>
  
  {/* Footer */}
  <div className="p-4 border-t border-outline-variant/20 flex justify-between items-center">
    <span className="text-[10px] uppercase tracking-wider text-muted">EMIRATES STADIUM</span>
    <Button size="sm" className="text-[10px] uppercase">JOIN</Button>
  </div>
</article>
```

### Result Tags (Win/Loss/Draw)

```tsx
// Win
<span className="w-6 h-6 rounded bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold">
  W
</span>

// Loss
<span className="w-6 h-6 rounded bg-surface border border-primary-container text-primary-container flex items-center justify-center text-xs font-bold">
  L
</span>

// Draw
<span className="w-6 h-6 rounded bg-surface border border-outline text-muted flex items-center justify-center text-xs font-bold">
  D
</span>
```

### Transaction Rows

```tsx
<div className="flex justify-between items-center py-4 border-b border-outline-variant/20 hover:bg-surface-container-high/50 transition-colors">
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-on-surface">Won vs @drillz99 · Arsenal/Chelsea</span>
    <span className="text-[10px] text-muted">Today, 14:30</span>
  </div>
  <span className="text-sm font-bold text-primary">+₦566</span>
</div>
```

---

## Shadcn Component Mapping

### Custom Variants to Add

```tsx
// button.tsx - Add these variants
variants: {
  variant: {
    // Existing...
    primary: "bg-primary-container text-on-primary hover:bg-primary-container/90",
    secondary: "border border-primary-container bg-transparent text-on-surface hover:bg-surface-container-high",
    ghost: "border border-outline bg-transparent text-on-surface hover:bg-surface-container-high",
    move: "border border-outline-variant bg-surface text-primary hover:border-primary-container",
    "move-selected": "bg-primary text-on-primary",
    "move-committed": "bg-primary-container text-on-primary",
  }
}

// badge.tsx - Add these variants
variants: {
  variant: {
    // Existing...
    live: "bg-tertiary-fixed text-on-tertiary-fixed animate-pulse",
    league: "border border-primary text-primary bg-transparent",
    result: "bg-primary-container text-on-primary",
    "result-loss": "border border-primary-container text-primary-container bg-transparent",
  }
}
```

### Recommended Shadcn Components

| Component | Usage |
|-----------|-------|
| `Button` | All CTAs, move chips, actions |
| `Input` | Login forms, stake inputs |
| `Card` | Fixture cards, stat cards (modify for flat style) |
| `Badge` | League tags, status indicators, result tags |
| `Separator` | 1px dividers between sections |
| `Avatar` | User initials in profile header |
| `Progress` | Stat bars (xG, possession) |
| `Tabs` | Mode toggles (Matchup Only / Real Match Mode) |
| `Skeleton` | Loading states |

### Components to Create Custom

| Component | Reason |
|-----------|--------|
| `Pitch` | 2D tactical view - core game component |
| `MoveSelector` | Game move buttons with commit state |
| `ScoreBar` | Live score + phase indicator |
| `ResolutionOverlay` | Move reveal animation overlay |
| `SettlementCard` | Post-match results display |
| `FixtureCard` | Match listing card |
| `WalletBadge` | Balance display in header |
| `OrientationPrompt` | Rotate device modal |

---

## Dark Mode

### Implementation

```tsx
// Root layout or App.tsx
<html className="dark">
  {/* ... */}
</html>

// Or with toggle
const [theme, setTheme] = useState<'light' | 'dark'>('light');

<html className={theme}>
  {/* ... */}
</html>
```

### Tailwind Dark Mode Classes

```tsx
// All components should use dark: variants
<div className="bg-background dark:bg-[#111111]">
  <p className="text-on-surface dark:text-[#FEF9F1]">
    Text content
  </p>
</div>

// Primary stays green, text inverts
<button className="bg-primary-container text-on-primary dark:bg-primary-container dark:text-on-primary">
  Button
</button>

// Surfaces get darker
<div className="bg-surface-container dark:bg-[#222222]">
  <span className="text-muted dark:text-[#707970]">Label</span>
</div>
```

### Key Dark Mode Mappings

| Light | Dark |
|-------|------|
| `bg-white` / `bg-background` | `dark:bg-[#111111]` |
| `bg-surface` (#FEF9F1) | `dark:bg-[#1A1A1A]` |
| `bg-surface-container` | `dark:bg-[#222222]` |
| `text-on-surface` (#111111) | `dark:text-[#FEF9F1]` |
| `text-muted` (#888888) | `dark:text-[#707970]` |
| `border-outline-variant` | `dark:border-[#444444]` |
| `primary-container` (#1B5E35) | Same (unchanged) |
| `tertiary-fixed` (#94F6C4) | `dark:#6ECFA0` |

---

## Page-Specific Guidelines

### 1. Splash / Onboarding

```
Layout: Landscape (844x390)
Split: 33% left (branding) / 67% right (pitch graphic)

Left:
- "MATCHUP" wordmark, bold 48px, deep green
- Tagline "Play the match. Own the result."
- "GET STARTED" button

Right:
- Minimal pitch outline SVG, deep green lines
- No fill, pure geometry
```

### 2. Login

```
Layout: Landscape
Split: 50% left (form) / 50% right (decorative)

Left:
- "MATCHUP" small top-left
- "Sign in." heading, 32px bold
- Username input (bottom border only)
- Password input (bottom border only)
- "CONTINUE" button, 200px width
- "New here? Create account" link

Right:
- Faded pitch outline, decorative
- Low opacity, geometric
```

### 3. Home (Fixtures)

```
Mobile Portrait:
- Header with date/matchday
- Vertical scrollable fixture cards
- Bottom nav bar

Desktop:
- Left sidebar (navigation)
- Main content: fixture grid (2-3 columns)
- Match cards with live/upcoming states
```

### 4. Fixture Detail

```
Mobile Portrait:
- Back button + fixture header
- Side selection (home/away) stacked
- Stake input
- Mode toggle
- "Find Opponent" CTA

Desktop/Landscape:
- Left (40%): Header, side selection
- Right (60%): Stake, mode, CTA
```

### 5. Matchmaking (Waiting)

```
Landscape only:
- Left (70%): Large pitch outline with pulsing indicator
- Right (30%): "Finding opponent", timer, selected side, cancel
```

### 6. Live Game (Matchup)

```
Landscape only:
- Left (70%):
  - ScoreBar (teams, score, phase)
  - Pitch view (FM 2D style)
  - Status strip ("Opponent committed")
- Right (30%):
  - "YOUR MOVE" header
  - Move buttons (vertical stack)
  - "COMMIT" button
```

### 7. Resolution Overlay

```
Full screen overlay:
- Dark background (#111 at 90% opacity)
- Center card (500px wide, cream):
  - Two columns: "You" | "Opponent"
  - Move names + icons
  - Center: outcome ("GOAL", "TACKLED")
  - Description line
- Auto-fades
```

### 8. Settlement

```
Landscape:
- Left (45%):
  - "Full Time" header
  - Fixture label
  - Scoreline block (two columns)
  - Goal events
- Right (55%):
  - Stats row (possession/tackles/shots)
  - Winner strip
  - Payout block ("+₦566")
  - Action buttons (Play Again, View Wallet)
```

### 9. Wallet

```
Landscape:
- Left (35%):
  - "Wallet" title
  - Balance card with green dividers
  - "Claim daily ₦200" button
  - Footer note
- Right (65%):
  - "Recent Activity" header
  - Transaction list
```

### 10. Profile

```
Landscape:
- Left (35%):
  - Avatar (initials)
  - Name + handle
  - Stats grid (Played/Won/Win Rate)
  - Match History section
- Right (65%):
  - Match history rows with result tags
```

---

## Prompting Guidelines

### For New Components

When prompting for a new component, include:

```
1. Component name and purpose
2. Layout (landscape/portrait, split ratios)
3. Color tokens (use design system names)
4. Typography tokens
5. States (default, hover, selected, disabled)
6. Responsive behavior
7. Dark mode considerations
```

### Example Prompt

```
Create a FixtureCard component for a football strategy app.

Layout: Card with header, body, footer sections

Structure:
- Header: league badge (left), time/status (right)
- Body: Two team columns flanking "VS" or score
- Footer: venue (left), action button (right)

Colors:
- Background: bg-surface-container-low
- Border: border-outline-variant/20
- Header bg: bg-surface-container-high
- League badge: text-primary, uppercase tracking-wider
- VS text: text-muted

Typography:
- League: text-[10px] uppercase tracking-wider font-bold
- Team abbreviations: text-lg font-bold
- Team names: text-sm font-bold
- VS: text-3xl font-black tracking-tight
- Venue: text-[10px] uppercase tracking-wider text-muted
- Button: text-[10px] uppercase

States:
- Live: green pulsing dot + "67'"
- Upcoming: grey time display
- Hover: bg-surface-container-high/50

Dark mode:
- bg-surface-container-low → dark:bg-[#1F1F1F]
- text-on-surface → dark:text-[#FEF9F1]
- border-outline-variant → dark:border-[#444444]

Responsive:
- Full width on mobile
- Grid item on desktop (3 columns)
```

### For Page Layouts

```
Create a [PageName] page for Matchup football strategy app.

Reference: See design_inspo/[filename].html for layout

Layout:
- Desktop: [sidebar + main] or [split left/right]
- Mobile: [stacked with bottom nav]
- Game screens: Landscape only with rotate prompt

Key sections:
1. [Section name]: [description]
2. [Section name]: [description]

Components needed:
- [Component1]
- [Component2]

Responsive breakpoints:
- md: 768px (show sidebar, hide bottom nav)
- lg: 1024px (larger grid)

Dark mode: All surfaces and text inverted per design system
```

### For Dark Mode Variations

```
Convert the following component/page to dark mode:

1. Replace background colors:
   - bg-white / bg-background → dark:bg-[#111111]
   - bg-surface → dark:bg-[#1A1A1A]
   - bg-surface-container → dark:bg-[#222222]

2. Replace text colors:
   - text-on-surface (#111111) → dark:text-[#FEF9F1]
   - text-muted (#888888) → dark:text-[#707970]

3. Keep primary colors:
   - primary-container (#1B5E35) stays same
   - tertiary-fixed adjusts slightly to #6ECFA0

4. Replace borders:
   - border-outline-variant → dark:border-[#444444]
```

---

## Quick Reference

### Color Classes (Tailwind)

```tsx
// Backgrounds
"bg-background"      // White / #111111 dark
"bg-surface"         // Cream / #1A1A1A dark
"bg-surface-container"  // #F2EDE5 / #222222 dark
"bg-surface-container-low"  // #F8F3EB / #1F1F1F dark
"bg-surface-container-high" // #ECE8E0 / #2A2A2A dark
"bg-primary-container"  // #1B5E35 (both modes)

// Text
"text-on-surface"    // #111111 / #FEF9F1 dark
"text-muted"         // #888888 / #707970 dark
"text-primary"       // #004521 / #92D6A2 dark
"text-tertiary-fixed"  // #94F6C4 / #6ECFA0 dark

// Borders
"border-outline-variant"  // #C0C9BE / #444444 dark
"border-primary-container"  // #1B5E35 (both)
```

### Spacing Scale

```tsx
// Standard spacing
"p-4"  // 16px - card padding
"p-6"  // 24px - section padding
"p-8"  // 32px - page padding
"gap-2" // 8px - tight gap
"gap-4" // 16px - standard gap
"gap-6" // 24px - loose gap
```

### Border Radius

```tsx
"rounded"      // 2px (sharp)
"rounded-sm"   // 4px (default for cards)
"rounded-lg"   // 8px
"rounded-full" // 9999px (circles)
```

---

*This document is a living reference. Update as components evolve and patterns emerge.*
