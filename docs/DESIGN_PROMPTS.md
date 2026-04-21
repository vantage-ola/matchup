# Matchup — Flux 2 Pro Design Prompts
### For use with Figma Weave AI / Flux 2 Pro image generation

> These prompts are organised by screen. Each prompt is self-contained — paste directly into Flux 2 Pro. Run 3-4 variations per screen by adding "variation 2", "variation 3" at the end, or by slightly modifying the compositional instruction.

---

## SYSTEM PROMPT (Prepend to every prompt for consistency)

```
Flat UI mockup, mobile-first app screen, landscape orientation 844x390px. 
Design language: Swiss modernist meets football culture. 
Color palette: pure white background #FFFFFF, deep pitch green #1B5E35, 
mid green #2D8653, mint accent #6ECFA0, near-black text #111111, 
mid-grey label #888888. 
Typography: Neue Helvetica or Inter, ultra-clean, strong typographic hierarchy, 
large numerals, tight tracking on labels. 
No gradients, no drop shadows, no rounded corners beyond 4px. 
Flat geometric shapes only. Zero decorative ornamentation. 
The aesthetic is: a clean architect's sketchpad that opened onto a football pitch.
```

> Copy this system prompt, then append the individual screen prompt below it.

---

## 00. OVERALL APP VIBE / DIRECTION

```
Design direction overview for Matchup, a football strategy mobile app.

CORE AESTHETIC:
Swiss modernist design philosophy meets authentic football culture. 
Every screen should feel like it was designed by an architect who loves football — 
precise, purposeful, zero ornamentation. The pitch is the hero. Typography does the work.

VISUAL LANGUAGE:
- Layout: Landscape orientation (844x390px), always. Pitch left, data/controls right.
- Color discipline: Pure white #FFFFFF is the canvas. Deep pitch green #1B5E35 is the ink.
  Mint #6ECFA0 is the accent — use sparingly, only for opponent differentiation or highlights.
- Typography: Helvetica or Inter. Bold for scores and headlines. Regular for body. 
  Tracked uppercase labels for metadata. Large numerals for impact.
- Shapes: Flat. Geometric. No rounded corners beyond 4px. No gradients. No shadows. 
  No decorative flourishes. A button is a rectangle. A pitch is a rectangle. 
  A card is a section with 1px dividers.

EMOTIONAL TONE:
Confident without performance. Knowledgeable without showing off. 
Like the friend who says "Salah scores here" and is right — and says nothing when he isn't.
No hype. No confetti. No "congratulations!" popups. The game itself is the drama.
When a player wins, show the numbers. Let the result speak.

WHAT THIS IS NOT:
- Not a gaming app aesthetic: no neon, no glow effects, no RPG-style badges, no "level up" energy
- Not a fintech app aesthetic: no friendly illustrations, no "seamless experience" copy, 
  no wallet app energy with a football skin
- Not a betting app aesthetic: no odds displays, no accumulator cards, no "cash out" buttons
- Not corporate: no stock photography, no generic "passionate fans" imagery, 
  no sanitised marketing language

THE PITCH IS THE CANVAS:
The 2D top-down pitch view is the visual anchor of the entire app. 
It should feel like Football Manager's match view — tactical, readable, real. 
Green stripes. White lines. Player dots. Ball position. Nothing more.
The pitch doesn't need decoration. The pitch IS the decoration.

TYPOGRAPHIC HIERARCHY:
- Scorelines: Bold 40px+, near-black. The most important number on screen.
- Headlines: Bold 24-32px, near-black.
- Labels: 10-11px, tracked uppercase, grey. Metadata, not content.
- Body: 12-14px, regular, near-black or grey depending on hierarchy.
- Numbers: Always larger than their labels. Always bold.

SPATIAL RHYTHM:
Generous white space. Elements breathe. 
1px dividers separate sections — no thick borders, no card containers, no elevated surfaces.
The white background IS the surface. Everything sits directly on it.
Swiss grid alignment. Left-aligned text. Numbers right-aligned in columns.
Nothing floats without an anchor.

THE FEELING:
Clean. Intelligent. Serious about football. 
The design should respect the user's knowledge — they know the game, 
they don't need hand-holding, they don't need decoration to stay engaged.
Give them a pitch, a scoreline, a move to make. That's it. That's the product.

In a single image: A match programme designed by Josef Müller-Brockmann.
Flat colors. Strong type. Zero clutter. Pure football.
```

---

## LOGO PROMPTS — For Ideogram v3

### Logo Concept 1 — Pure Typography with Pitch Geometry

```
Minimal wordmark logo for a football strategy app called "Matchup". 
The word "Matchup" in bold Helvetica Neue, deep pitch green #1B5E35, 
set on pure white #FFFFFF background. 
The letterforms are clean, strong weight, tight tracking.
Subtle integration: a minimal horizontal line extends from the left of the "M" 
and another from the right of the "p", creating a subtle pitch boundary feel.
No icon, no symbol — the typography IS the logo.
Swiss modernist design. Flat. Zero gradients. Zero shadows. 
Print-ready. Works at 32px and 320px.
```

---

### Logo Concept 2 — Pitch Lines Through Typography

```
Wordmark logo for "Matchup" football strategy app.
Bold Helvetica wordmark in deep pitch green #1B5E35 on pure white #FFFFFF.
A single thin horizontal line crosses through the middle of the word — 
like a halfway line on a pitch — passing through the lowercase letters.
The line is slightly lighter green #2D8653. Clean, geometric, purposeful.
The line divides but doesn't break the word — suggesting two sides, one game.
Flat design. No gradients. No shadows. Swiss modernist aesthetic.
```

---

### Logo Concept 3 — Abstract Mark + Wordmark

```
Logo for football strategy app "Matchup". 
Left side: abstract geometric mark — two vertical rectangles facing each other, 
one deep green #1B5E35, one mint #6ECFA0, separated by thin white gap.
The rectangles suggest two teams, two sides, a matchup. Minimal, architectural.
Right side: wordmark "Matchup" in bold Helvetica, deep green, 
positioned to the right of the mark with generous breathing room.
Pure white #FFFFFF background.
Flat. Zero gradients. Zero shadows. Swiss design. 2024.
```

---

### Logo Concept 4 — Monogram "M" with Pitch Geometry

```
Monogram logo for "Matchup" football strategy app.
Single letter "M" in bold weight, deep pitch green #1B5E35.
The "M" is constructed from geometric lines that echo a football pitch — 
the two downward strokes suggest goal posts, the angular peaks suggest field geometry.
Set on pure white #FFFFFF background.
Below the monogram: full wordmark "Matchup" in smaller Helvetica bold, deep green.
Flat design. No gradients. No shadows. Architectural precision.
Works as app icon, favicon, and print logo.
```

---

### NEGATIVE PROMPT (append to any logo prompt)

```
Negative prompt: No gradients, no drop shadows, no glow effects, no 3D, 
no bevel, no emboss, no lens flare, no realistic textures, no photographs, 
no cartoon style, no mascot, no character, no swoosh, no globe, no circle frame, 
no generic tech icon, no lightning bolt, no star burst, no decorative swirls, 
no serif fonts, no script fonts, no handwritten style, no distressed texture, 
no vintage aesthetic, no neon colors, no metallic finish, no glass effect, 
no gradient mesh, no complex illustration, no busy composition, no clipart, 
no stock icon energy, no corporate blue, no purple gradients, no glossy button.
```

---

## 01. ONBOARDING / SPLASH SCREEN

```
App splash screen for a football strategy game called Matchup, landscape orientation.
Pure white background. Left third: wordmark "Matchup" in bold Helvetica, 
deep green, 48px, tracking -0.02em, left-aligned. Below: tagline "Play the match. 
Own the result." in regular weight, 16px, mid-grey.
Right two-thirds: a minimal top-down football pitch outline drawn in deep green — 
just the lines, no fill, pure geometry like an architectural blueprint. 
The pitch fills the space horizontally, cropped at top and bottom edges, 
giving it a poster quality.
Bottom-left corner: single button, deep green fill, white label "Get Started", 
all-caps, letter-spacing 0.1em, 200px width. Generous white space. Nothing else.
```

---

## 02. AUTH — REGISTER / LOGIN

```
Clean login screen for mobile app, landscape orientation. Pure white background. 
Top-left: wordmark "Matchup" small, 16px, deep green.
Left half: large heading "Sign in." in bold Helvetica, 32px, near-black, 
left-aligned, generous top margin.
Two input fields — flat, no border-radius, 1px bottom border only in mid-grey, 
label floats above in 11px uppercase tracked label style.
Fields: "Username" and "Password". Below fields: primary CTA button, 
200px width, deep green fill, white text "Continue", all-caps.
Below button: small text link "New here? Create account" in mid-grey.
Right half: decorative element — minimal football pitch outline in deep green, 
subtle, faded, geometric. 
No card containers, no surface elevation. The form sits directly on white.
Swiss grid alignment throughout. Plenty of breathing room between elements.
```

---

## 03. HOME SCREEN — FIXTURE LIST

```
Home screen for football strategy app showing today's upcoming fixtures, landscape orientation.
Pure white background.

Top bar: left — wordmark "Matchup" 16px deep green.
Right — wallet balance chip: small rectangle, mid-green background,
white text "₦1,200", compact, 12px.

Section label: "Today's Fixtures" in 11px all-caps tracked grey, left-aligned.

Fixture cards — three visible, arranged horizontally in a row with 1px vertical divider lines between them,
no card borders or shadows. Each card contains:
  - League badge text label top-left (e.g. "UCL") in 10px capsule, green outline
  - Team names stacked vertically: home team bold 14px near-black, "vs" in 12px grey, away team bold 14px near-black
  - Kickoff time below, 12px mid-grey
  - Lobby status: small green dot + "Open" or grey dot + "Soon"

Left sidebar: minimal navigation — Home (filled), Fixtures, Wallet, Profile — 
icons only, flat, 24px, stacked vertically, active item in deep green, inactive in grey.

Generous internal padding. Clean typographic rhythm. Nothing that isn't a fixture.
```

---

## 04. FIXTURE DETAIL SCREEN

```
Fixture detail screen for a head-to-head football strategy game, landscape orientation.
Pure white background.

Left section (40% width):
Top: back arrow. Fixture header — two team names stacked vertically
with a central "VS" in deep green between them, bold, large 24px.
Below header: league label and kickoff time in 12px tracked grey.

Side selection: two rows stacked vertically, equal height.
Top row: "Home" — team name, crest placeholder
(simple circle with initials), player count "4 playing".
Bottom row: "Away" — same structure.
When a side is selected, the row background shifts to a very light
tint of green #EAF5EE, with a small check mark in deep green at right.

Right section (60% width):
Stake row — label "Stake" left, amount selector
right with minus/plus controls, flat, no border-radius.
Amount in bold 20px near-black.

Mode toggle: two options "Matchup Only" and "Real Match Mode",
presented as a segmented control, flat, 1px border,
active segment deep green fill / white text,
inactive cream fill / grey text.

CTA button: "Find Opponent →" deep green fill, white label bold.
Below: small grey note "If no opponent found in 20s, a bot joins."
```

---

## 05. MATCHMAKING / WAITING SCREEN

```
Waiting screen for 1v1 football app matchmaking, landscape orientation. Pure white background.

Centre of screen (taking 70% width): large minimal top-down football pitch outline,
deep green lines on white, just the geometry — halfway line, centre circle,
penalty areas, goal boxes. Inside the centre circle: animated pulsing dot
(show as a static ring in the mockup, suggest motion).

Right sidebar (30% width):
"Finding opponent" in 14px regular weight grey, left-aligned.
Below that, a monospace timer counting up "0:08" in bold 24px near-black.
Below timer: single row showing the player's chosen side —
small team crest placeholder + team name, deep green.

At very bottom of sidebar: text link "Cancel" in small mid-grey.

The pitch outline should feel like a signal being broadcast — pure geometry,
minimal presence, maximum tension. Nothing decorative.
```

---

## 06. MATCHUP GAME SCREEN — MAIN

```
Live game screen for a 1v1 football strategy mobile app, landscape orientation. Pure white background.

Left section — FM-style 2D pitch (70% width):
Top bar (ScoreBar) above pitch:
  Left — home team abbreviation bold 14px, score number bold 24px near-black.
  Centre divider dash. Right — score bold 24px, away team abbreviation bold 14px.
  Rightmost — "Phase 3 of 6" in 11px tracked grey.
  Thin 1px green line below entire top bar.

Pitch area:
  Deep green pitch fill #1B5E35, alternating lighter green stripes #236B42
  for mowing pattern. White line markings — clean geometric.
  Player dots: you = solid white circle 12px with subtle outline.
  Opponent = solid mint circle 12px. Ball = small white square or filled diamond.
  Pitch takes 80% of section height.

Below pitch: status strip — 1px divider, then "Opponent committed ●"
in 12px grey with small filled green indicator dot when true.

Right section — Move Hand (MoveSelector) (30% width):
Header: "Your Move" in 11px tracked grey all-caps.
Move buttons arranged vertically, flat, 1px green border,
cream fill, deep green text. Labels: Pass / Run / Long Ball / Shoot / Sprint.
Selected state: deep green fill / white text.
Bottom: full-width "Commit →" button, deep green fill, white bold text.

Everything is legible at a glance. No decoration. Pure function.
```

---

## 07. MATCHUP GAME SCREEN — RESOLUTION OVERLAY

```
Resolution reveal overlay for a 1v1 football strategy app, landscape orientation.
Overlay sits on top of the game screen — semi-transparent near-black
background #111111 at 90% opacity covering the full screen.

Centre panel: cream white card, no border-radius, flat, centered, 500px wide.
Two columns — left "You", right "Opponent".
Each column shows:
  - move name in bold Helvetica 18px, all-caps, deep green
  - move icon as a minimal flat geometric glyph below

Centre between columns: outcome label in large bold near-white text —
e.g. "GOAL" in 28px tracked all-caps, or "TACKLED", "ADVANCE", "INTERCEPTED".
If goal scored: small football icon or circle, animated burst implied.

Below outcome: short single-line description — "Jiménez scores. 2-1."
in 14px cream/light text.

Panel fades automatically — no dismiss button.
Dark overlay, cream card, deep green text.
High contrast. Cinematic. Like a VAR check on a black screen.
```

---

## 08. SETTLEMENT SCREEN — MATCHUP RESULT

```
Settlement / results screen for a 1v1 football strategy mobile app, landscape orientation.
Pure white background.

Left section (45% width):
Top header: "Full Time" in bold 24px near-black, left-aligned.
Below: fixture label small grey — "Arsenal vs Chelsea · UCL".

Main scoreline block — two columns side by side:
  Left column: "You" label small grey, then scoreline "2 - 1" in bold 40px
  near-black, below it small goal events: "⚽ Jiménez 23', 71'" in 11px grey.
  Right column: "Opponent" label small grey, "1 - 2" bold 40px near-black,
  "⚽ Nketiah 67'" 11px grey.

Right section (55% width):
Stats row: three columns — Possession / Tackles / Shots.
Each: label 10px grey tracked all-caps, value bold 16px near-black.
Your stats in near-black, opponent stats same weight — comparison is visual,
not colour-coded.

1px horizontal divider.

Winner strip: if you won — "You won the Matchup ✓" in small deep green bold.

Payout block: large "+₦566" in bold 32px deep green, left-aligned.
Below: "Credited to wallet" in 11px grey.

Bottom: two flat ghost buttons side by side — "Play Again" (green outline)
and "View Wallet" (grey outline).

Quiet confidence. No confetti. No emoji spam. The numbers celebrate for you.
```

---

## 09. SETTLEMENT SCREEN — REAL MATCH PENDING STATE

```
Settlement screen in "waiting for real match" state for a football strategy app, landscape orientation.
Pure white background. Same layout as matchup result screen — 
left section with scoreline, right section with stats and winner strip.

Below the stats section in right panel: a distinct "pending" section.
Full-width flat panel, very light green tint background #EAF5EE,
no border-radius, 1px green border top and bottom.

Inside panel:
  "LIVE MODE" label — 10px all-caps deep green tracked.
  Match name bold 14px near-black: "Arsenal vs Chelsea".
  Countdown in bold monospace 18px: "Kicks off in 1h 42m".
  Your predicted result: "Your call: 2–1" in 12px grey.
  Potential bonus: "+₦340 if correct" in 12px deep green.

Bottom of right panel: payout already credited note —
"+₦200 from Matchup — in your wallet" in small grey.

The pending panel should feel like a ticket stub —
something you're holding, waiting for it to resolve.
Calm. Anticipatory. Clean.
```

---

## 10. WALLET SCREEN

```
Wallet screen for a mobile football strategy app, landscape orientation. Pure white background.

Left section (35% width):
Top: page title "Wallet" bold 24px near-black, left-aligned.

Balance card — not a rounded card, a flat section with
1px top and bottom green dividers.
  Balance label: "Available Balance" 10px tracked grey all-caps.
  Amount: "₦4,250" bold 36px near-black.
  Daily claim button: flat outline button below,
  "Claim daily ₦200" deep green text, 1px green border, no fill.

Right section (65% width):
Section label: "Recent Activity" 10px tracked grey all-caps.

Transaction list — each row:
  Left: description — "Won vs @drillz99 · Arsenal/Chelsea" in 12px near-black.
  Below description: timestamp in 10px grey.
  Right: amount — won = "+₦566" in deep green bold 13px,
  lost = "-₦200" in near-black 13px (never red — calm, not punishing).

4-5 transactions visible. 1px divider between rows, no card containers.

Very bottom: small grey note — "Currency is for game use only."
Clean ledger energy. Like a tasteful bank statement.
```

---

## 11. PROFILE SCREEN

```
Profile screen for a mobile football strategy app, landscape orientation. Pure white background.

Left section (35% width):
Top: avatar — flat circle, initials only, deep green background white text,
40px. Right of avatar: display name bold 16px near-black,
username @handle 11px grey.

1px divider.

Stats row — three columns, flat no borders:
  Played / Won / Win Rate.
  Each: value bold 20px near-black, label 10px grey tracked.

1px divider.

Section: "Match History" — 10px tracked grey label.

Right section (65% width):
Match history rows — each row:
  Left: team abbreviations "ARS vs CHE" bold 13px near-black.
  Centre: your scoreline vs opponent scoreline — "2-1 · 1-2" in 12px.
  Right: result tag — flat chip, no border-radius,
  "W" deep green fill white text or "L" cream fill green outline text.
  Below: small grey date + league.

4-5 rows. 1px dividers. No avatars, no achievement badges, no confetti.
This is a record, not a celebration wall.
```

---

## 12. COMPONENT STUDY — BUTTONS & CONTROLS

```
Component reference sheet for a minimal football app design system. 
Pure white background #FFFFFF, laid out as a flat design reference poster. 

Section: Buttons 
  - Primary button: full-width, deep green #1B5E35 fill, white text bold all-caps, 
    no border-radius, height 52px. 
  - Secondary button: cream fill, 1px deep green border, deep green text bold all-caps. 
  - Ghost button: no fill, 1px grey border, grey text. 
  - Destructive: same as ghost but text in near-black. 
  - Disabled state: cream fill, grey text, 1px grey border, opacity 50%. 

Section: Move Chips (for game screen) 
  - Unselected: cream fill, 1px green border, deep green text 13px, 
    horizontal pill shape, padding 12px 20px. 
  - Selected: deep green fill, white text, same shape. 
  - Committed/locked: mid-green fill, white text, small lock icon right. 

Section: Status indicators 
  - Open lobby: green dot 8px + "Open" 12px grey. 
  - Waiting: grey dot pulsing outline + "Waiting" 12px grey. 
  - Settled: deep green checkmark + "Settled" 12px deep green. 

Section: Input fields 
  - Flat, no border-radius, 1px bottom border only, white background, 
    11px tracked grey label floating above, 16px near-black value. 

Swiss typographic grid. Label all elements. Reference sheet style.
```

---

## 13. COMPONENT STUDY — PITCH VIEW

```
Design reference for a top-down 2D football pitch component for a mobile app, landscape orientation.
Component fills a 600x320px area.

Pitch: deep green fill #1B5E35, alternating mowing stripes —
one stripe lighter at #236B42, alternating every ~30px horizontal band.
Pitch markings in white, 1.5px stroke, clean geometry:
  - Outer boundary rectangle with thin inner border offset 4px
  - Centre circle
  - Halfway line
  - Penalty areas left and right
  - Goal boxes left and right
  - Corner arc indicators

Players:
  - Your team: solid white filled circles 11px diameter,
    small number label below in white 9px
  - Opponent team: solid mint green #6ECFA0 circles 11px diameter
  - Ball: white diamond or small square 7px

Overlay text: none on the pitch itself. The pitch is silent.

Below pitch, outside the pitch area:
  Score bar — white background, team abbreviations bold 14px,
  score bold 20px near-black, phase label 11px grey.

This should feel like FM meets Swiss design poster.
Precise, readable, nothing extra.
```

---

## 14. MARKETING / SPLASH GRAPHIC

```
Promotional graphic for a football skill game app called Matchup.
Portrait format 1080x1920px for social/app store (note: this is portrait for marketing, 
different from in-app landscape screens).

Background: pure white #FFFFFF.

Top third: headline text composition —
  "Play the match." bold Helvetica 72px near-black left-aligned.
  "Own the result." bold Helvetica 72px deep green #1B5E35 left-aligned.
  Strong leading, Swiss editorial poster feel.

Centre: large top-down football pitch outline, deep green,
  line art only no fill, oversized so it bleeds slightly past both edges.
  On the pitch: two sets of player dots facing each other —
  white vs mint green, minimal, tactically arranged.

Lower third:
  App name wordmark "Matchup" bold 28px tracked deep green.
  Tagline small grey.
  Minimal CTA if needed: "Play free. Win for real." 12px grey.

Overall: this should look like a match programme crossed with
a modernist art poster. Confident negative space.
Pure football typography. Nothing borrowed from gaming aesthetics.
```

---

## USAGE NOTES

**Orientation:** All screens are designed for landscape orientation (844x390px), 
except for the marketing graphic (section 14) which remains portrait for app store/social use. 
The game is played horizontally with the pitch on the left and controls on the right.

**Variations:** For each prompt, append one of the following to generate alternatives:
- `"Alternative: dark mode version — replace white with near-black #111111, 
   keep deep green accents, white text."`
- `"Alternative: tablet/desktop layout — wider canvas, more breathing room, 
   same typographic system."`
- `"Alternative: emphasise the typographic hierarchy — less UI, more editorial poster feel."`

**Consistency across screens:** Once you settle on a hero screen,
use its exact output as a style reference image in subsequent prompts.
Flux 2 Pro accepts image references — feed it the best matchup screen
output as a visual anchor for the rest.

**What to watch for:**
- The pitch green should always feel purposeful — not decorative background fill
- Helvetica weight contrast is the visual hierarchy system — if weights blur, the design loses its spine
- Cream is always the default surface — deep green is always the action/accent color
- Never let elements float without a grid anchor — alignment is the whole point
- Landscape layout means pitch on left, controls/data on right — always maintain this split
```