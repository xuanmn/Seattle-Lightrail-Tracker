# Official Station Names Alignment & Static System Map Design

## Overview
This feature aligns all Sound Transit Link Light Rail station names in the Seattle Lightrail Tracker with the official [Sound Transit Station Directory](https://www.soundtransit.org/ride-with-us/stations/link-light-rail-stations) and introduces a responsive, interactive dark-mode **Static System Map Modal** accessible from the header.

---

## 1. Station Data Alignment (`src/data/stations.ts`)

### Changes
Update station names in `STATIONS` to match official Sound Transit naming conventions while retaining all `id` slugs and OneBusAway `stopId` strings to ensure backward compatibility for saved user preferences and API integrations.

| Station ID | Previous Display Name | Official Sound Transit Name | Subtitle / ShortName |
| :--- | :--- | :--- | :--- |
| `shoreline-north-185th` | Shoreline North / 185th | **Shoreline North/185th** | — |
| `shoreline-south-148th` | Shoreline South / 148th | **Shoreline South/148th** | — |
| `international-district-chinatown` | Int'l District / Chinatown | **Intl. District / Chinatown** | — |
| `tukwila-intl-blvd` | Tukwila Intl Blvd | **Tukwila Intl. Blvd.** | — |
| `bel-red` | Bel-Red / 130th | **BelRed** | 130th Station |
| `symphony` | Symphony | **Symphony** | University Street Station |
| `university-of-washington` | University of Washington | **University of Washington** | UW Station (Husky Stadium) |
| `seatac-airport` | SeaTac / Airport | **SeaTac / Airport** | Seattle-Tacoma Int'l Airport |

---

## 2. Static System Map Component (`src/components/SystemMapModal.ts`)

### Features
- **Vector SVG Schematic Map**:
  - High-contrast, dark-mode stylized schematic transit map of the Puget Sound region.
  - **1 Line Track (Green `#008542`)**: Runs North-South from Lynnwood City Center to Angle Lake.
  - **2 Line Track (Blue `#0072CE`)**: Runs East-West from Downtown Redmond through Bellevue to Seattle / Lynnwood.
  - **Geographic Elements**: Water bodies (Puget Sound, Lake Washington, Lake Union), I-90 floating bridge corridor.
  - **Station Badges & Icons**:
    - Terminus station markers (Lynnwood City Center, Angle Lake, Downtown Redmond, South Bellevue).
    - Transfer interchange station markers (Chinatown-ID, Pioneer Square, Symphony, Westlake).
    - SeaTac Airport terminal marker with airplane glyph (✈️).
    - Amtrak / Sounder train connection markers (King Street / Chinatown-ID).
    - Ferry connection marker (Colman Dock / Pioneer Square).
- **Interactive Controls**:
  - **Zoom In / Zoom Out / Reset**: Scale and reset the map viewBox.
  - **Pan / Drag**: Mouse and touch drag to pan around the map canvas.
  - **Line Highlight Filter**: Toggle buttons to highlight "All Lines", "1 Line Only", or "2 Line Only".
  - **External Link**: Quick link to the official Sound Transit full PDF system map.

---

## 3. UI and Navigation Updates

### Header (`src/components/Header.ts`)
- Add a new **"System Map"** button in `header-actions` between the Clock and the "Transit Guide & FAQ" button.
- Add `onMapClick: () => void` to `HeaderCallbacks`.

### Application Coordinator (`src/main.ts`)
- Instantiate `SystemMapModal`.
- Wire `onMapClick` from `HeaderComponent` to `this.mapModal.open()`.

### Styling (`src/styles/map.css` and `src/styles/layout.css`)
- Modal container with max-width `960px` and responsive height.
- SVG styles for glowing lines, station labels, water body paths, and legend pills.
- Zoom controls floating toolbar on the map container.

---

## 4. Verification & Testing

### Automated Tests
- Update `tests/stations.test.ts` to verify:
  - All 23 Line 1 stations are present and have exact official names.
  - All 10 Line 2 stations are present and have exact official names.
  - Station lookup helpers (`getStationsByLine`, `getStationById`) return correct values.
- Verify `npm test` passes with 100% test coverage.
- Verify `npm run build` generates production bundle without TypeScript errors.

### Manual Verification
- Open the application locally (`npm run dev`).
- Click "System Map" button in the header; verify modal opens smoothly.
- Test zoom controls (+ / - / Reset) and dragging around the canvas.
- Test line filter buttons (1 Line, 2 Line, All Lines).
- Test on mobile viewport to verify responsive scaling.
