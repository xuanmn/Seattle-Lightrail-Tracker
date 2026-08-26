# Official Station Names Alignment & Static System Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align all Sound Transit station names in the tracker with official Sound Transit directory standards and add a dark-mode interactive Static System Map modal to the application.

**Architecture:** Update the centralized static station definitions in `src/data/stations.ts` while preserving stop and station IDs. Create a standalone `SystemMapModal.ts` component rendering a bespoke vector SVG schematic transit map with interactive zoom/pan controls, line highlight filters, and legend. Connect the modal trigger to the global navigation `Header.ts` and `main.ts`.

**Tech Stack:** TypeScript (Strict), Vanilla CSS (Design Tokens, Glassmorphism, CSS Transitions), SVG (Vector graphics, viewBox transformations), Vitest + jsdom.

**Spec:** [docs/superpowers/specs/2026-08-25-official-stations-and-system-map-design.md](file:///Users/xuanmn/Developer/Seattle%20Lightrail%20Tracker/docs/superpowers/specs/2026-08-25-official-stations-and-system-map-design.md)

## Global Constraints

- Retain all existing station IDs (e.g. `shoreline-north-185th`, `international-district-chinatown`, `bel-red`) and OneBusAway stop IDs (e.g. `1_99005`, `1_1127`) to guarantee 100% backward compatibility with user saved favorites and live API endpoints.
- No external mapping or GIS library dependencies (pure native lightweight SVG + CSS).
- Maintain existing dark-mode design system (`#008542` Sound Transit Green for 1 Line, `#0072CE` Sound Transit Blue for 2 Line).

---

### Task 1: Align Official Station Names & Update Station Tests

**Files:**
- Modify: `src/data/stations.ts`
- Modify: `tests/stations.test.ts`

**Interfaces:**
- Produces: Updated `STATIONS` array with official Sound Transit names (`Shoreline North/185th`, `Shoreline South/148th`, `Intl. District / Chinatown`, `Tukwila Intl. Blvd.`, `BelRed`).

- [ ] **Step 1: Write tests asserting official station names**

Update `tests/stations.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { STATIONS, getStationsByLine, getStationById } from '../src/data/stations';

describe('Station Data Catalog', () => {
  it('contains exactly 23 Line 1 stations and 10 Line 2 stations', () => {
    const line1 = getStationsByLine('line-1');
    const line2 = getStationsByLine('line-2');
    expect(line1).toHaveLength(23);
    expect(line2).toHaveLength(10);
  });

  it('uses official Sound Transit naming for updated stations', () => {
    expect(getStationById('shoreline-north-185th')?.name).toBe('Shoreline North/185th');
    expect(getStationById('shoreline-south-148th')?.name).toBe('Shoreline South/148th');
    expect(getStationById('international-district-chinatown')?.name).toBe('Intl. District / Chinatown');
    expect(getStationById('tukwila-intl-blvd')?.name).toBe('Tukwila Intl. Blvd.');
    expect(getStationById('bel-red')?.name).toBe('BelRed');
    expect(getStationById('symphony')?.name).toBe('Symphony');
  });

  it('retains valid stop IDs for Puget Sound OneBusAway', () => {
    const westlake = getStationById('westlake');
    expect(westlake?.platforms.northbound?.stopId).toBe('1_1121');
    expect(westlake?.platforms.southbound?.stopId).toBe('1_1122');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL on `Shoreline North/185th`, `Shoreline South/148th`, `Tukwila Intl. Blvd.`, or `BelRed` name assertion.

- [ ] **Step 3: Update `src/data/stations.ts` with official names**

Update the following station objects in `src/data/stations.ts`:
- `shoreline-north-185th`: `name: 'Shoreline North/185th'`
- `shoreline-south-148th`: `name: 'Shoreline South/148th'`
- `international-district-chinatown`: `name: 'Intl. District / Chinatown'`
- `tukwila-intl-blvd`: `name: 'Tukwila Intl. Blvd.'`
- `bel-red`: `name: 'BelRed'`, `shortName: '130th Station'`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (all tests pass).

- [ ] **Step 5: Commit changes**

```bash
git add src/data/stations.ts tests/stations.test.ts
git commit -m "fix(data): align station names with official Sound Transit directory"
```

---

### Task 2: Build the Static System Map Modal Component & Vector Schematic Canvas

**Files:**
- Create: `src/components/SystemMapModal.ts`
- Create: `src/styles/map.css`
- Create: `tests/map.test.ts`
- Modify: `src/main.ts` (import `map.css`)

**Interfaces:**
- Produces: `SystemMapModal` class with `.open()`, `.close()`, zoom/pan controls, line highlight toggles, and SVG rendering.

- [ ] **Step 1: Write failing unit test for `SystemMapModal`**

Create `tests/map.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { SystemMapModal } from '../src/components/SystemMapModal';

describe('SystemMapModal Component', () => {
  let modal: SystemMapModal;

  beforeEach(() => {
    document.body.innerHTML = '';
    modal = new SystemMapModal();
  });

  it('renders modal overlay into document body with map elements', () => {
    const overlay = document.querySelector('.system-map-modal-overlay');
    expect(overlay).not.toBeNull();
    const svg = overlay?.querySelector('svg.system-map-svg');
    expect(svg).not.toBeNull();
  });

  it('opens and closes modal using open/close methods', () => {
    const overlay = document.querySelector('.system-map-modal-overlay') as HTMLElement;
    expect(overlay.classList.contains('open')).toBe(false);

    modal.open();
    expect(overlay.classList.contains('open')).toBe(true);

    modal.close();
    expect(overlay.classList.contains('open')).toBe(false);
  });

  it('contains line highlight filter controls and zoom controls', () => {
    const filterButtons = document.querySelectorAll('.map-filter-btn');
    expect(filterButtons.length).toBeGreaterThanOrEqual(3); // All, 1 Line, 2 Line

    const zoomBtns = document.querySelectorAll('.map-zoom-btn');
    expect(zoomBtns.length).toBeGreaterThanOrEqual(3); // Zoom in, zoom out, reset
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL with "Cannot find module '../src/components/SystemMapModal'".

- [ ] **Step 3: Create `src/styles/map.css`**

Create `src/styles/map.css` with styling for:
- `.system-map-modal-overlay`, `.system-map-container` (full responsive modal layout, max-width 1000px).
- `.map-viewport-wrapper` (pan/zoom clipping container with grab/grabbing cursor).
- `.map-toolbar` (line highlight filter pills and zoom/reset controls).
- `.system-map-svg` (crisp track lines, station nodes, water accents, glowing filter strokes, and readable typography).
- `.map-footer-links` (official Sound Transit map link button).

- [ ] **Step 4: Create `src/components/SystemMapModal.ts`**

Implement `SystemMapModal` with:
- Full SVG schematic diagram depicting:
  - 1 Line track (`#008542`) and all 23 stations.
  - 2 Line track (`#0072CE`) and Eastside stations across Lake Washington.
  - Transfer junction at Chinatown-ID / Downtown tunnel.
  - Airport indicator at SeaTac.
  - Stylized Puget Sound and Lake Washington water bodies.
- Interactive Zoom (+ / - / Reset) and Pan (mouse drag, touch drag, wheel zoom) updating SVG `transform="translate(x, y) scale(s)"`.
- Line highlight toggles (`all`, `line-1`, `line-2`) dimming non-selected lines.
- Escape key listener and backdrop click to dismiss.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit changes**

```bash
git add src/components/SystemMapModal.ts src/styles/map.css tests/map.test.ts src/main.ts
git commit -m "feat(map): implement SystemMapModal with interactive SVG schematic transit map"
```

---

### Task 3: Integrate System Map into Header and Application Coordinator

**Files:**
- Modify: `src/components/Header.ts`
- Modify: `src/main.ts`
- Modify: `src/styles/layout.css`

**Interfaces:**
- Consumes: `HeaderCallbacks.onMapClick: () => void`
- Produces: "System Map" button in header navigation opening `SystemMapModal`.

- [ ] **Step 1: Update `Header.ts` to include `onMapClick` callback and "System Map" button**

In `src/components/Header.ts`:
- Add `onMapClick: () => void;` to `HeaderCallbacks`.
- Add a new "System Map" button in `header-actions`:
  ```typescript
  const mapBtn = createElement(
    'button',
    'header-text-btn header-map-btn',
    `🗺️ System Map`
  );
  mapBtn.title = 'View Sound Transit Link Light Rail System Map';
  mapBtn.onclick = () => this.callbacks.onMapClick();
  ```
- Insert `mapBtn` into `header-actions` alongside `faqBtn` and `settingsBtn`.

- [ ] **Step 2: Wire `SystemMapModal` in `src/main.ts`**

In `src/main.ts`:
- Import `SystemMapModal` and `import './styles/map.css';`.
- Instantiate `this.mapModal = new SystemMapModal();`.
- Pass `onMapClick: () => this.mapModal.open()` into `HeaderComponent` callbacks.

- [ ] **Step 3: Update `src/styles/layout.css` for responsive header buttons**

Ensure `.header-text-btn` and `.header-map-btn` scale cleanly across desktop, tablet, and mobile views.

- [ ] **Step 4: Run tests and build to verify integration**

Run: `npm test && npm run build`
Expected: PASS (all tests pass, build succeeds).

- [ ] **Step 5: Commit changes**

```bash
git add src/components/Header.ts src/main.ts src/styles/layout.css
git commit -m "feat(header): add System Map button to top navigation and wire modal trigger"
```

---

### Task 4: Polish, Accessibility & Final Verification

**Files:**
- Modify: `README.md`
- Verify: Full browser rendering, keyboard navigation, and responsive layouts.

- [ ] **Step 1: Update `README.md` to document the System Map feature**

Add bullet point under Features:
- **Interactive System Map**: Built-in dark-mode vector SVG schematic route map of Link Light Rail (1 Line & 2 Line) with interactive zoom/pan controls, line highlight toggles, and official Sound Transit references.

- [ ] **Step 2: Run test suite & build check**

Run: `npm test && npm run build`
Expected: All 5 test suites pass, TypeScript compiles with 0 errors.

- [ ] **Step 3: Commit and push**

```bash
git add README.md
git commit -m "docs: document System Map feature in README"
```
