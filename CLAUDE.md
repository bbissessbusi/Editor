# CLAUDE.md — Editor (Remotion Video Project)

## Project Overview

This is a **Remotion video composition project** that creates animated social media reels using React and TypeScript. The primary output is a 15-second 9:16 vertical video reel designed for viral marketing showcasing Claude Code skills.

**Tech Stack:** React 18, TypeScript 5, Remotion 4

---

## Repository Structure

```
Editor/
├── src/
│   ├── index.ts          # Entry point — registers RemotionRoot
│   ├── Root.tsx          # Composition registry (defines video specs)
│   ├── HelloWorld.tsx    # Simple animated demo composition
│   └── SocialReel.tsx    # Main 15-second social media reel (~1,200 LOC)
├── .claude/
│   ├── settings.json     # Claude Code hook configuration
│   └── hooks/
│       └── session-start.sh  # Runs `npm install` on remote sessions
├── remotion.config.ts    # Remotion output config (JPEG format, overwrite enabled)
├── tsconfig.json         # TypeScript config (ES6 target, strict mode)
└── package.json          # NPM config with dev scripts
```

---

## Development Commands

```bash
npm start        # Start Remotion Studio (interactive preview, hot reload)
npm run build    # Bundle compositions for production
npm run render   # Render video file(s) to disk (outputs to out/)
npm run upgrade  # Upgrade Remotion to latest version
```

**Primary workflow:** Use `npm start` to open Remotion Studio in the browser for live preview while editing compositions.

---

## Key Architecture Concepts

### Compositions

Compositions are registered in `src/Root.tsx` via Remotion's `<Composition>` component:

- **`SocialReel`** — 1080×1920px (9:16), 450 frames @ 30fps (15 seconds). The main production video.
- **`HelloWorld`** — 1280×720px (16:9), 150 frames @ 30fps. A simple demo.

### SocialReel Scene Structure

`SocialReel.tsx` is organized into scenes wrapped in Remotion `<Sequence>` components:

| Scene | Frames | Description |
|-------|--------|-------------|
| Hook | 0–89 | Viral opening — headline, grid background, stat strip |
| Transition 01 | 90–109 | Cyan numbered transition |
| GitHub Skills | 110–229 | Skill cards sliding in |
| Transition 02 | 230–249 | Gold numbered transition |
| Phone Proof | 250–374 | iPhone mockup with document scroll |
| Transition 03 | 375–394 | Red numbered transition |
| CTA | 395–449 | Call-to-action with button and trust pills |

### Animation Primitives

Remotion animation hooks used throughout the codebase:

```typescript
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const frame = useCurrentFrame();         // Current frame number (0-based)
const { fps, durationInFrames } = useVideoConfig();

// Linear interpolation between keyframes
const opacity = interpolate(frame, [0, 30], [0, 1]);

// Physics-based spring animation
const scale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
```

### Reusable UI Components (defined in SocialReel.tsx)

- **`GlassCard`** — Frosted glass card with gradient border and backdrop blur
- **`GlassHeading`** — Styled heading with glow effect
- **`AnimBG`** — Pulsing animated grid background
- **`NumberedTransition`** — Reusable scene transition with numbered circle and expanding line

---

## Code Conventions

### Naming

- **Components:** PascalCase (`HookScene`, `GlassCard`, `AnimBG`)
- **Constants:** UPPERCASE (`CYAN`, `GOLD`, `RED`, `BG`, `W`, `H`, `SAFE_TOP`)
- **Functions/variables:** camelCase (`interpolate`, `useCurrentFrame`)
- **Files:** PascalCase for component files (`SocialReel.tsx`), lowercase for entry points (`index.ts`)

### Styling

All styles are **inline React styles** (`style={{ ... }}`) using `React.CSSProperties`. There are no external CSS files or CSS modules.

Color constants are defined at the top of `SocialReel.tsx`:
```typescript
const BG    = "#0a0a0f";   // Background dark
const CYAN  = "#00e5ff";   // Accent blue
const GOLD  = "#ffd700";   // Accent gold
const RED   = "#ff3b3b";   // Accent red
const W     = 1080;        // Video width
const H     = 1920;        // Video height
const SAFE_TOP = 120;      // Safe zone top padding
```

### Section Organization

Large files use comment dividers:
```typescript
// ─── Scene Name ───────────────────────────────────────────────────────────────
```

### Layout

- `AbsoluteFill` from Remotion is used for full-screen layered positioning
- Absolute positioning with explicit `left`, `top`, `width`, `height` values
- Z-index layering for visual stacking

---

## TypeScript Configuration

- **Strict mode enabled** — all TypeScript strict checks are active
- **Target:** ES6
- **Module:** ES2022
- **JSX:** React (automatic transform)
- **Output:** `./build/`

Avoid `any` types. Use proper Remotion types where applicable.

---

## Output & Rendering

- **Output directory:** `out/` (git-ignored)
- **Build directory:** `build/` (git-ignored)
- **Format:** JPEG frames (configured in `remotion.config.ts`)
- **Overwrite:** Enabled — re-rendering doesn't prompt for confirmation

---

## No Test Suite

This project has no automated tests. Validation is done visually:
1. Run `npm start` to open Remotion Studio
2. Scrub through the timeline to verify animations
3. Render a test output with `npm run render` to check final output

---

## Git Workflow

- Current development branch: `claude/add-claude-documentation-fK5M7`
- Commits use simple, descriptive messages
- `node_modules/`, `out/`, `build/`, and `.remotion/` are git-ignored

---

## Claude Code Integration

The `.claude/` directory configures Claude Code behavior for this repository:

- **`settings.json`** — Defines a `SessionStart` hook
- **`hooks/session-start.sh`** — Automatically runs `npm install` at the start of each remote Claude Code session to ensure dependencies are available

When modifying compositions, always verify changes in Remotion Studio (`npm start`) before committing.
