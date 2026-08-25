# Seattle Light Rail Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and test a high-visibility, responsive, real-time web application for Seattle Link Light Rail (1 Line & 2 Line) tracking and departure boards, ready for GitHub Pages deployment.

**Architecture:** A lightweight client-side SPA powered by Vite + Vanilla TypeScript and modern CSS. Connects directly to the Puget Sound OneBusAway REST API out-of-the-box for live vehicle predictions and delays, with configurable support for `transit-tracker-api` WebSocket streaming. Features an interactive multi-station dashboard, instant station search/pinning, and a full-screen Kiosk Departure Board mode.

**Tech Stack:** Vite, TypeScript, Vanilla CSS (Design Tokens, Glassmorphism, Micro-animations), Vitest for unit testing.

**Spec:** `docs/superpowers/specs/2026-08-25-seattle-lightrail-tracker-design.md`

## Global Constraints
- **Target Platform:** GitHub Pages static site hosting (zero backend runtime requirement, relative paths for assets via `./` base).
- **Transit Scope:** Sound Transit Link Light Rail (1 Line: Lynnwood ⇄ Angle Lake, 2 Line: South Bellevue ⇄ Downtown Redmond).
- **Design Aesthetic:** Sound Transit Line Colors (1 Line `#008542`, 2 Line `#0072CE`), Transit Dark Slate theme (`#0b0f17`), high-contrast departure fonts, smooth second-by-second countdown ticks.
- **Dependency Minimalist:** Pure TypeScript + Vanilla CSS + Vite + Vitest. No bloated frameworks.

---

## File Structure

```
├── index.html                           # Entry HTML with meta tags, SEO, font links
├── package.json                         # Project dependencies and build scripts
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite config with base path for GitHub Pages
├── src/
│   ├── types/
│   │   └── transit.ts                   # Station, Arrival, Prediction, and Settings types
│   ├── data/
│   │   └── stations.ts                  # Link Light Rail stations catalog (1 Line & 2 Line)
│   ├── services/
│   │   ├── oba-api.ts                   # Puget Sound OneBusAway API client
│   │   ├── tracker-api.ts               # transit-tracker-api WebSocket & REST client
│   │   └── storage.ts                   # LocalStorage manager for pinned stops & settings
│   ├── utils/
│   │   ├── time.ts                      # Time formatting, countdown calculation, delay text
│   │   └── dom.ts                       # DOM helper utilities and element builders
│   ├── styles/
│   │   ├── theme.css                    # CSS variables, typography, reset, design tokens
│   │   ├── layout.css                   # Header, container, grid, modal styles
│   │   ├── board.css                    # Station card, countdown chips, live pulse
│   │   └── kiosk.css                    # Fullscreen kiosk departure board layout
│   ├── components/
│   │   ├── Header.ts                    # App header with line switcher, clock & action buttons
│   │   ├── StationCard.ts               # Directional station arrival card component
│   │   ├── StationPickerModal.ts        # Station browser and pinning modal
│   │   ├── KioskView.ts                 # Big screen departure board view
│   │   └── SettingsModal.ts             # Settings configuration modal
│   └── main.ts                          # App initialization, polling loop, event bus
└── tests/
    ├── time.test.ts                     # Unit tests for countdown and delay formatting
    ├── stations.test.ts                 # Unit tests for station catalog and stop ID resolution
    ├── storage.test.ts                  # Unit tests for local storage serialization
    └── oba-api.test.ts                  # Unit tests for API response transformation
```

---

### Task 1: Project Scaffolding, Build Config & Testing Harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `tests/setup.ts`

**Interfaces:**
- Produces: Runnable Vite dev server (`npm run dev`), build script (`npm run build`), test suite (`npm run test`).

- [ ] **Step 1: Create package.json with dependencies**
Create `package.json` with Vite, TypeScript, Vitest, and jsdom.
- [ ] **Step 2: Create tsconfig.json and vite.config.ts**
Configure TypeScript and Vite with relative base (`base: './'`) for GitHub Pages compatibility.
- [ ] **Step 3: Create index.html**
Write semantic HTML5 skeleton with viewport, SEO meta tags, Google Fonts (`Outfit`, `Inter`, `JetBrains Mono`), and root container `#app`.
- [ ] **Step 4: Install dependencies and verify test setup**
Run `npm install` and `npm run test` to verify Vitest configuration.
- [ ] **Step 5: Commit**
```bash
git add package.json tsconfig.json vite.config.ts index.html tests/setup.ts
git commit -m "chore: scaffold project structure with Vite, TypeScript, and Vitest"
```

---

### Task 2: Station Data Models & Sound Transit Link Catalog

**Files:**
- Create: `src/types/transit.ts`
- Create: `src/data/stations.ts`
- Test: `tests/stations.test.ts`

**Interfaces:**
- Produces:
  - `Station`, `TransitArrival`, `LineConfig`, `AppSettings` types in `src/types/transit.ts`
  - `STATIONS: Station[]`, `getStationsByLine(lineId: string): Station[]`, `getStationById(id: string): Station | undefined` in `src/data/stations.ts`

- [ ] **Step 1: Write failing station catalog test**
Test that `getStationsByLine('line-1')` returns all 23 stations with valid northbound and southbound stop IDs, and `getStationsByLine('line-2')` returns all 10 Eastside stations.
- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/stations.test.ts`
Expected: FAIL
- [ ] **Step 3: Implement `src/types/transit.ts` and `src/data/stations.ts`**
Define complete types and the accurate Link Light Rail station database (including Lynnwood City Center through Angle Lake for 1 Line, and South Bellevue through Downtown Redmond for 2 Line).
- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/stations.test.ts`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add src/types/transit.ts src/data/stations.ts tests/stations.test.ts
git commit -m "feat: implement transit data types and Sound Transit Link station catalog"
```

---

### Task 3: Time Formatting, Arrival Calculations & Countdown Utilities

**Files:**
- Create: `src/utils/time.ts`
- Test: `tests/time.test.ts`

**Interfaces:**
- Produces:
  - `calculateMinutesRemaining(targetEpochMs: number, nowEpochMs?: number): number`
  - `formatCountdownBadge(targetEpochMs: number, nowEpochMs?: number): { text: string, isNow: boolean }`
  - `formatClockTime(epochMs: number, is24Hour?: boolean): string`
  - `formatDelayStatus(delaySeconds: number, isRealtime: boolean): { text: string, type: 'ontime' | 'delayed' | 'early' | 'scheduled' }`

- [ ] **Step 1: Write failing unit tests for time calculations**
Test countdown outputs (`"ARRIVING"` for ≤0.5 min, `"3 MIN"`, `"14 MIN"`), delay status calculations (`"On Time"` for 0 to 60s delay, `"+3m Delay"` for >60s, `"Early"` for <-60s), and 12h/24h time formatting.
- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/time.test.ts`
Expected: FAIL
- [ ] **Step 3: Implement `src/utils/time.ts`**
Write bulletproof calculation functions handling edge cases, clock drifts, and millisecond timestamps.
- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/time.test.ts`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add src/utils/time.ts tests/time.test.ts
git commit -m "feat: implement arrival countdown and delay calculation utilities"
```

---

### Task 4: Puget Sound OneBusAway & Transit Tracker API Clients

**Files:**
- Create: `src/services/oba-api.ts`
- Create: `src/services/tracker-api.ts`
- Test: `tests/oba-api.test.ts`

**Interfaces:**
- Consumes: `Station`, `TransitArrival` from `src/types/transit.ts`
- Produces:
  - `fetchArrivalsForStation(station: Station, apiKey?: string): Promise<{ direction1: TransitArrival[], direction2: TransitArrival[] }>`
  - `TransitTrackerWebSocketClient` for connecting to custom `transit-tracker-api` servers.

- [ ] **Step 1: Write failing test for OneBusAway response parser**
Mock a sample OneBusAway API response for stop `1_99611` (Capitol Hill) and test that `transformObaArrivals` extracts correct route, direction, destination, predicted vs scheduled times, and delay seconds.
- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/oba-api.test.ts`
Expected: FAIL
- [ ] **Step 3: Implement `src/services/oba-api.ts` and `src/services/tracker-api.ts`**
Implement REST fetchers with timeout handling (AbortController), fallback to scheduled times when realtime is unavailable, and WebSocket client for custom backend instances.
- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/oba-api.test.ts`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add src/services/oba-api.ts src/services/tracker-api.ts tests/oba-api.test.ts
git commit -m "feat: implement Puget Sound OneBusAway and Transit Tracker API clients"
```

---

### Task 5: Local Storage & State Management

**Files:**
- Create: `src/services/storage.ts`
- Test: `tests/storage.test.ts`

**Interfaces:**
- Produces:
  - `getPinnedStationIds(): string[]`
  - `togglePinnedStation(stationId: string): boolean`
  - `getActiveLine(): 'line-1' | 'line-2'`
  - `setActiveLine(line: 'line-1' | 'line-2'): void`
  - `getSettings(): AppSettings`
  - `updateSettings(partial: Partial<AppSettings>): AppSettings`

- [ ] **Step 1: Write failing storage tests**
Test default initialization (pinned stations default to key hubs: Westlake, Capitol Hill, UW, Bellevue Downtown), toggling favorites, and saving/loading settings.
- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/storage.test.ts`
Expected: FAIL
- [ ] **Step 3: Implement `src/services/storage.ts`**
Implement safe LocalStorage wrapper with JSON parse error safety.
- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/storage.test.ts`
Expected: PASS
- [ ] **Step 5: Commit**
```bash
git add src/services/storage.ts tests/storage.test.ts
git commit -m "feat: implement local storage and settings persistence layer"
```

---

### Task 6: Modern CSS Design System & Theme Styles

**Files:**
- Create: `src/styles/theme.css`
- Create: `src/styles/layout.css`
- Create: `src/styles/board.css`
- Create: `src/styles/kiosk.css`

**Interfaces:**
- Produces: Complete CSS custom property design system, dark transit theme, responsive grid, glassmorphism cards, glowing status dots, flip/countdown badges, and fullscreen kiosk layout.

- [ ] **Step 1: Implement `src/styles/theme.css`**
Define CSS variables for Sound Transit colors (`--st-green: #008542`, `--st-blue: #0072CE`, `--bg-primary: #0b0f17`, `--bg-card: rgba(18, 26, 38, 0.8)`), font stacks, typography hierarchy, and glassmorphism utilities.
- [ ] **Step 2: Implement `src/styles/layout.css` and `src/styles/board.css`**
Style header bar, line switcher pills, directional columns, departure cards, countdown chips, delay tags, and animations (pulse, skeleton loaders, subtle hover lifts).
- [ ] **Step 3: Implement `src/styles/kiosk.css`**
High-visibility, large-format kiosk layout with high contrast for wall/desktop display.
- [ ] **Step 4: Commit**
```bash
git add src/styles/
git commit -m "feat: add modern transit design system, departure board styles, and kiosk CSS"
```

---

### Task 7: UI Components (Header, Station Card, Station Browser Modal, Settings Modal)

**Files:**
- Create: `src/components/Header.ts`
- Create: `src/components/StationCard.ts`
- Create: `src/components/StationPickerModal.ts`
- Create: `src/components/SettingsModal.ts`
- Create: `src/components/KioskView.ts`
- Create: `src/utils/dom.ts`

**Interfaces:**
- Produces: Modular, reactive UI component renderers with event listeners and accessibility attributes.

- [ ] **Step 1: Implement `src/utils/dom.ts`**
Create clean element creation helpers, icon renderers, and event dispatcher utilities.
- [ ] **Step 2: Implement `src/components/Header.ts`**
Header component with Sound Transit logo badge, Line 1 / Line 2 tab buttons, live digital clock, refresh button with spinning icon, and Kiosk / Settings triggers.
- [ ] **Step 3: Implement `src/components/StationCard.ts`**
Card component rendering station name, line badge, favorite star, Northbound/Southbound directional platforms, top 3 arrivals with large countdown badges, status pills, and empty-state placeholders.
- [ ] **Step 4: Implement `src/components/StationPickerModal.ts` & `src/components/SettingsModal.ts`**
Station search and filter dialog (browse all 1 Line & 2 Line stations, pin/unpin with one click) and settings configuration modal.
- [ ] **Step 5: Implement `src/components/KioskView.ts`**
Fullscreen kiosk board rendering extra-large arrival boards with auto-cycle timer.
- [ ] **Step 6: Commit**
```bash
git add src/components/ src/utils/dom.ts
git commit -m "feat: implement UI components for header, station cards, modals, and kiosk mode"
```

---

### Task 8: Application Orchestrator, Live Polling Loop & Interactive App Bootstrapper

**Files:**
- Create: `src/main.ts`

**Interfaces:**
- Coordinates: Data fetching, state updates, local 1-second countdown interval ticker, user interactions, and view mode switching.

- [ ] **Step 1: Implement `src/main.ts`**
Initialize application state, mount DOM components, bind modal event listeners, start background API polling (e.g. every 20 seconds), and start local 1-second interval to update arrival countdowns smoothly between API fetches.
- [ ] **Step 2: Add offline/network error handling banner**
Display a non-intrusive banner if an API request fails, keeping cached predictions visible while retrying.
- [ ] **Step 3: Test full application build and verify end-to-end**
Run `npm run build` and launch preview server with `npm run preview` to verify zero runtime errors.
- [ ] **Step 4: Commit**
```bash
git add src/main.ts
git commit -m "feat: implement application orchestrator and real-time polling loop"
```

---

### Task 9: End-to-End Verification & Walkthrough

**Files:**
- Modify: `README.md`
- Create: `docs/superpowers/walkthrough.md`

- [ ] **Step 1: Run complete test suite**
Run: `npm run test`
Expected: All unit and integration tests PASS.
- [ ] **Step 2: Verify production build output**
Run: `npm run build`
Expected: Clean static files generated in `dist/` with relative asset paths.
- [ ] **Step 3: Test in browser**
Verify interactive UI: switching between Line 1 and Line 2, pinning stations, live arrivals rendering, kiosk mode, and settings persistence.
- [ ] **Step 4: Update README.md with deployment instructions for GitHub Pages**
Provide quick guide on how to deploy to GitHub Pages via Settings > Pages > GitHub Actions / `gh-pages` branch.
- [ ] **Step 5: Commit and finalize**
```bash
git add README.md docs/superpowers/walkthrough.md
git commit -m "docs: finalize README and walkthrough documentation"
```
