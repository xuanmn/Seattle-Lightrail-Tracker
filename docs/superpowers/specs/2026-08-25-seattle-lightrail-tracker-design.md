# Seattle Light Rail Tracker - Design Specification

**Date:** 2026-08-25  
**Target Deployment:** GitHub Pages (Client-side Web Application)  
**Primary Focus:** Sound Transit Link Light Rail (1 Line & 2 Line)

---

## 1. Overview & Goals

The Seattle Light Rail Tracker is a fast, responsive, modern web application designed to run entirely on GitHub Pages. It provides real-time arrival predictions, departure countdown boards, and a customizable multi-station dashboard for riders of Seattle's Sound Transit Link Light Rail:
- **1 Line (Green)**: Lynnwood City Center ⇄ Angle Lake (including recent Lynnwood extension stations).
- **2 Line (Blue)**: South Bellevue ⇄ Redmond Technology / Downtown Redmond.

The app is built to work immediately out-of-the-box using the Puget Sound OneBusAway real-time transit API, with optional compatibility with custom `transit-tracker-api` WebSocket/REST endpoints.

---

## 2. Architecture & Tech Stack

### 2.1 Technology Choices
* **Core Build Tool:** Vite (vanilla TypeScript/JavaScript for maximum speed, zero bloat, and clean bundle optimization).
* **Styling:** Custom modern CSS design system with CSS custom properties (design tokens), flexbox/grid, glassmorphism, responsive container queries, and micro-animations. No heavyweight CSS framework dependencies.
* **Icons & Fonts:** Lucide icons / custom SVG icons + Google Fonts (Outfit / Inter / JetBrains Mono for departure digits).
* **Target Environment:** GitHub Pages static site hosting (served from `dist/` or repository root via GitHub Actions).

### 2.2 System Diagram

```
+-------------------------------------------------------------+
|                 Seattle Light Rail Tracker                   |
|                   (Browser Client / PWA)                    |
+------------------------------+------------------------------+
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
+------------------------+             +----------------------+
| Puget Sound OneBusAway |             |  transit-tracker-api |
|       REST API         |             |   WebSocket / REST   |
| (Default Out-of-the-Box|             |  (Optional Custom    |
|   Direct Connection)   |             |   Endpoint Toggle)   |
+------------------------+             +----------------------+
```

---

## 3. Data Model & Station Catalog

### 3.1 Link Light Rail Station Definitions
Each station contains metadata: station ID, formal name, short code, coordinates, lines served, and directional platform stop IDs.

#### 1 Line Stations (North to South):
1. Lynnwood City Center (`1_99001` / `1_99002`)
2. Mountlake Terrace (`1_99003` / `1_99004`)
3. Shoreline North/185th (`1_99005` / `1_99006`)
4. Shoreline South/148th (`1_99007` / `1_99008`)
5. Northgate (`1_99009` / `1_99010`)
6. Roosevelt (`1_99605` / `1_99606`)
7. U District (`1_99607` / `1_99608`)
8. University of Washington (`1_99609` / `1_99610`)
9. Capitol Hill (`1_99611` / `1_99612`)
10. Westlake (`1_1121` / `1_1122`)
11. Symphony (University Street) (`1_1123` / `1_1124`)
12. Pioneer Square (`1_1125` / `1_1126`)
13. Int'l District / Chinatown (`1_1127` / `1_1128`)
14. Stadium (`1_99113` / `1_99114`)
15. SODO (`1_99115` / `1_99116`)
16. Beacon Hill (`1_99117` / `1_99118`)
17. Mount Baker (`1_99119` / `1_99120`)
18. Columbia City (`1_99121` / `1_99122`)
19. Othello (`1_99123` / `1_99124`)
20. Rainier Beach (`1_99125` / `1_99126`)
21. Tukwila International Blvd (`1_99127` / `1_99128`)
22. SeaTac / Airport (`1_99129` / `1_99130`)
23. Angle Lake (`1_99131` / `1_99132`)

#### 2 Line Stations (West to East):
1. South Bellevue (`1_99701` / `1_99702`)
2. East Main (`1_99703` / `1_99704`)
3. Bellevue Downtown (`1_99705` / `1_99706`)
4. Wilburton (`1_99707` / `1_99708`)
5. Spring District (`1_99709` / `1_99710`)
6. Bel-Red (`1_99711` / `1_99712`)
7. Overlake Village (`1_99713` / `1_99714`)
8. Redmond Technology (`1_99715` / `1_99716`)
9. Marymoor Village (`1_99717` / `1_99718`)
10. Downtown Redmond (`1_99719` / `1_99720`)

### 3.2 Arrival Prediction Entity
```typescript
interface TransitArrival {
  tripId: string;
  routeId: string;
  routeName: string;           // "1 Line" or "2 Line"
  routeColor: string;          // "#008542" (1 Line) or "#0072CE" (2 Line)
  destination: string;         // e.g. "Angle Lake", "Lynnwood City Center"
  direction: 'Northbound' | 'Southbound' | 'Eastbound' | 'Westbound';
  scheduledDepartureTime: number; // Unix timestamp ms
  predictedDepartureTime: number; // Unix timestamp ms (or null if scheduled only)
  minutesUntilArrival: number; // Derived dynamically
  isRealtime: boolean;         // True if live GPS tracked
  delaySeconds: number;        // >0 late, <0 early, 0 on-time
  statusText: string;          // "On Time", "+2 min late", "Scheduled"
}
```

---

## 4. UI/UX Components & Layout

### 4.1 Header Bar
* Sound Transit Link Light Rail badge with live pulse indicator.
* Active line selector tabs: **1 Line (Lynnwood ⇄ Angle Lake)** and **2 Line (South Bellevue ⇄ Redmond)**.
* Live digital clock (12h/24h) + data freshness indicator ("Updated 4s ago" + Manual refresh button).
* View switcher: **Dashboard View** vs. **Kiosk / Big Screen Departure Board**.
* Settings gear icon.

### 4.2 Multi-Station Dashboard View
* **Pinned Stations Grid:** Renders cards for all starred stations (defaults to iconic hubs e.g., Westlake, Capitol Hill, Bellevue Downtown).
* **Station Card Structure:**
  * Header: Station Name, Star / Unstar toggle, Quick directions tag.
  * Direction 1 Column (e.g. Northbound to Lynnwood): Next 3 trains with big countdown chips (`ARRIVING`, `4 MIN`, `14 MIN`), status pill (`On Time`), and scheduled departure clock time (`12:15 PM`).
  * Direction 2 Column (e.g. Southbound to Angle Lake): Next 3 trains with real-time countdown chips and status.
* **Add Station / Browse Drawer:** Allows quick filtering and adding any 1 Line or 2 Line station to the pinned board.

### 4.3 Kiosk / Fullscreen Departure Board Mode
* Designed for wall displays, dedicated tablets, or secondary monitors.
* Extra-large retro/modern high-contrast split-flap/LED-inspired typography.
* Shows next arriving trains with destination, track direction, scheduled time, and big countdown minutes.
* Optional auto-rotation between pinned stations every 15 seconds.

### 4.4 Settings Modal
* **Data Source Switcher:** OneBusAway Puget Sound (Default) or Custom `transit-tracker-api` URL.
* **Auto-Refresh Frequency:** 15s, 20s, 30s, 60s.
* **Time Format:** 12-hour (AM/PM) or 24-hour.
* **Sound Effects / Alerts:** Optional subtle chime when train is 2 minutes away.
* **Reset to Defaults.**

---

## 5. Client-Side State & Persistence

* `localStorage['seattle_transit_pinned_stations']`: Array of pinned station IDs.
* `localStorage['seattle_transit_active_line']`: Active line tab ('line-1' | 'line-2').
* `localStorage['seattle_transit_settings']`: User configuration options (refresh interval, custom API endpoint, time format).
* In-memory cache with graceful fallback: If network drops, displays last known arrivals with a "Stale data - retrying..." warning rather than a blank screen.

---

## 6. Verification & Testing Plan

1. **Station Data Integrity Test:** Validate that all 1 Line and 2 Line station stop IDs resolve properly in Puget Sound OneBusAway.
2. **Real-time Countdown Ticker Test:** Verify second-by-second countdown calculations between API polls without drifting.
3. **Responsive UI & Kiosk Mode Test:** Test layout on mobile (375px), desktop (1440px), and fullscreen kiosk mode (1080p/4K).
4. **Offline & Error Resilience:** Test behavior when API request fails (graceful error banners, automatic exponential backoff retry).
5. **GitHub Pages Build & Deployment Test:** Run `npm run build` to verify clean static bundle generation with zero broken asset paths.
