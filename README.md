# Seattle Light Rail Tracker

> **Live Website:** 👉 **[https://xuanmn.github.io/Seattle-Lightrail-Tracker/](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)**

A modern, responsive, real-time departure countdown board and multi-station tracker for **Seattle's Sound Transit Link Light Rail** (1 Line & 2 Line), hosted live on **GitHub Pages**.

[![Live Demo](https://img.shields.io/badge/🌐_Open_Live_Tracker-xuanmn.github.io%2FSeattle--Lightrail--Tracker-008542?style=for-the-badge&logo=googlechrome&logoColor=white)](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)
[![Sound Transit](https://img.shields.io/badge/Sound%20Transit-Link%20Light%20Rail-008542?style=for-the-badge)](https://www.soundtransit.org)
[![1 Line](https://img.shields.io/badge/1%20Line-Lynnwood%20⇄%20Angle%20Lake-008542?style=for-the-badge)](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)
[![2 Line](https://img.shields.io/badge/2%20Line-South%20Bellevue%20⇄%20Redmond-0072CE?style=for-the-badge)](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## ✨ Features

- **Live Regional Data Out-of-the-Box**: Direct client-side integration with Puget Sound OneBusAway (`api.pugetsound.onebusaway.org`) providing live arrival predictions, GPS vehicle tracking, and delay statuses without requiring a custom backend.
- **Sound Transit 1 Line & 2 Line**:
  - **1 Line** (23 Stations): Lynnwood City Center through Angle Lake (serving Northgate, UW, Capitol Hill, Downtown Seattle transit tunnel, Beacon Hill, Rainier Valley, and SeaTac Airport).
  - **2 Line** (10 Stations): South Bellevue through Downtown Redmond (serving East Main, Bellevue Downtown, Wilburton, Spring District, Bel-Red, Overlake Village, Redmond Technology, and Marymoor Village).
- **Directional Departure Cards**: View Northbound/Southbound or Eastbound/Westbound platforms side-by-side with high-visibility countdown badges (`ARRIVING`, `3 MIN`, `12 MIN`) and real-time status indicators.
- **Collapsible Platform Columns**: Expand or collapse platform departures independently. When collapsed, a live summary badge displays the next upcoming arrival.
- **Dual Dashboard View Modes**:
  - **★ Favorites**: Focused view showing only your starred stations, with persistent collapse states.
  - **All Stations**: Geographic route-order listing of all stations along the active line.
- **One-Click Station Management**:
  - Star or unstar stations to instantly customize your saved list.
  - Station picker modal with line filtering tabs, sleek scrollable browsing, and quick add/remove buttons.
  - Toast notifications confirming favorite station updates.
- **Configurable Time Format**: Toggle between 12-hour (`2:30 PM`) and 24-hour (`14:30`) clock and departure timestamps in Settings.
- **Smooth Real-time Tickers**: Automatic 60-second background sync cycle with lightweight second-by-second countdown ticks (optimized DOM patching without full card re-renders).
- **Regional Transit Guide & FAQ**: Built-in modal guide with cross-lake route details, travel times, fare information (flat $3 adult, free youth under 18), operating hours, and resource links.
- **Interactive System Map**: Built-in dark-mode vector SVG schematic route map of Link Light Rail (1 Line & 2 Line) with interactive zoom/pan controls, line highlight toggles, and official Sound Transit references.
- **Local Storage Persistence**: Pinned stations, active line selection, 12h/24h time format preference, and platform collapse states are saved automatically in your browser.
- **Dynamic Theming**: Header branding, active pill highlights, and accent colors automatically adapt to the active line (Emerald Green for 1 Line, Cobalt Blue for 2 Line).
- **GitHub Pages Ready**: 100% client-side static web application with responsive layout and relative asset bundling.

---

## 🛠️ Tech Stack

- **Framework / Runtime**: Vanilla TypeScript (Strict Mode)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Micro-animations, Google Fonts (`Outfit`, `Inter`, `JetBrains Mono`)
- **Testing**: [Vitest](https://vitest.dev/) with `jsdom`
- **Target Deployment**: [GitHub Pages](https://pages.github.com/)

---

## 🙏 Acknowledgements & API Credits

This project is made possible thanks to the following open-source projects, APIs, and transit agencies:

* **[OneBusAway (Puget Sound)](https://onebusaway.org/)**: The open-source platform and REST API ([`api.pugetsound.onebusaway.org`](https://developer.onebusaway.org/)) providing real-time arrival predictions, vehicle tracking, and schedule data for the Seattle & Puget Sound region.
* **[Transit Tracker API](https://github.com/tjhorner/transit-tracker-api)**: Created by [@tjhorner](https://github.com/tjhorner) and [Eastside Urbanism](https://github.com/EastsideUrbanism), providing the API specification and departure board concepts that inspired this project.
* **[Sound Transit Open Transit Data](https://www.soundtransit.org/help-contacts/business-information/open-transit-data-otd)**: For providing GTFS schedule feeds and real-time vehicle positioning for the Link Light Rail (1 Line & 2 Line).
* **[King County Metro](https://kingcounty.gov/en/dept/metro/rider-tools/open-data)**: For regional transit data infrastructure and open developer feeds across King County.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
