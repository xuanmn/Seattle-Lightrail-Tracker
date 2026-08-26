# 🚆 Seattle Light Rail Tracker

> **Live Website:** 👉 **[https://xuanmn.github.io/Seattle-Lightrail-Tracker/](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)**

A modern, responsive, real-time departure countdown board and multi-station tracker for **Seattle's Sound Transit Link Light Rail** (1 Line & 2 Line), hosted live on **GitHub Pages**.

[![Live Demo](https://img.shields.io/badge/🌐_Open_Live_Tracker-xuanmn.github.io%2FSeattle--Lightrail--Tracker-008542?style=for-the-badge&logo=googlechrome&logoColor=white)](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)
[![Sound Transit](https://img.shields.io/badge/Sound%20Transit-Link%20Light%20Rail-008542?style=for-the-badge)](https://www.soundtransit.org)
[![1 Line](https://img.shields.io/badge/1%20Line-Lynnwood%20⇄%20Federal%20Way-008542?style=for-the-badge)](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)
[![2 Line](https://img.shields.io/badge/2%20Line-Downtown%20Redmond%20⇄%20South%20Bellevue-0072CE?style=for-the-badge)](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-29%20Passing-success?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## ✨ Features

- **Live Regional Transit Data Out-of-the-Box**: Direct client-side integration with the Puget Sound OneBusAway REST API (`api.pugetsound.onebusaway.org`), delivering real-time arrival predictions, vehicle tracking, and delay statuses without requiring a custom proxy backend.
- **Complete Sound Transit 1 Line & 2 Line Network**:
  - **1 Line (26 Stations)**: Full route from Lynnwood City Center in Snohomish County to Federal Way Downtown in South King County (serving Mountlake Terrace, Shoreline North/185th, Shoreline South/148th, Northgate, Roosevelt, U-District, University of Washington, Capitol Hill, Westlake, Symphony, Pioneer Square, Int'l Dist/Chinatown, Stadium, SODO, Beacon Hill, Mount Baker, Columbia City, Othello, Rainier Beach, Tukwila Int'l Blvd, SeaTac Airport, Angle Lake, Kent Des Moines, Star Lake, and Federal Way Downtown).
  - **2 Line (10 Stations)**: Eastside line connecting Downtown Redmond through South Bellevue (serving Marymoor Village, Redmond Technology, Overlake Village, Bel-Red, Spring District, Wilburton, Bellevue Downtown, East Main, and South Bellevue).
- **Directional Departure Cards & Dynamic Countdown**:
  - Side-by-side Northbound/Southbound or Eastbound/Westbound platform displays.
  - High-visibility countdown badges (`ARRIVING`, `3 MIN`, `12 MIN`) and real-time status chips (`On Time`, `+3m Delay`, `Early`, `Scheduled`).
  - Simplified destination pill tags (e.g. `To Lynnwood`, `To Federal Way`, `To Redmond`, `To South Bellevue`).
- **Segmented Direction Filter Controls**: Inline segmented pill selectors on every station card (`Both`, `Northbound`, `Southbound` / `Both`, `Eastbound`, `Westbound`) for focused one-way commuting, with per-station preference persistence.
- **Dual Dashboard View Modes**:
  - **★ Favorites**: Instant glance at your starred stations for everyday commuters.
  - **All Stations**: Geographic route-order listing of all stations along the active line.
- **One-Click Station Management**:
  - Star or unstar stations directly from the departure board or the modal picker.
  - Station picker modal with line filtering tabs, quick search browsing, and instant toast confirmations.
- **Interactive Dark-Mode System Map**: Built-in SVG vector schematic map of the Link Light Rail system with interactive pan/zoom controls, line highlight toggles (1 Line, 2 Line, or Both), station labels, and Park & Ride availability tags.
- **Regional Transit Guide & FAQ**: Built-in modal guide detailing 1 Line & 2 Line transfers, cross-lake express bus connections (Sound Transit Express routes 550, 545, 542), standard fare pricing (flat $3 adult fare, free for youth 18 and under, ORCA card / Transit GO Ticket app), and operating hours.
- **Smooth Real-time Tickers**: Automatic 60-second background polling cycle with lightweight second-by-second countdown ticks (optimized DOM updates without full card re-renders).
- **Configurable Time Format**: Easily toggle between 12-hour (`2:30 PM`) and 24-hour (`14:30`) clock and arrival timestamps in Settings.
- **Local Storage Persistence**: Pinned stations, active line selection, 12h/24h time format preference, and station direction filters persist seamlessly across sessions.
- **Modern Glassmorphic UI**: Dynamic line theming (Emerald Green for 1 Line, Cobalt Blue for 2 Line), micro-animations, typography (`Outfit`, `Inter`, `JetBrains Mono`), and responsive layouts with mobile safe-area inset support.
- **GitHub Pages Ready**: 100% client-side static web application with responsive layout and relative asset bundling.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Language & Runtime** | [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Mode) |
| **Build Tool & Bundler** | [Vite 6.0](https://vitejs.dev/) |
| **Styling & Design System** | Vanilla CSS Design Tokens, CSS Grid / Flexbox, Glassmorphism, Micro-animations |
| **Typography** | Google Fonts ([Outfit](https://fonts.google.com/specimen/Outfit), [Inter](https://fonts.google.com/specimen/Inter), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)) |
| **Icons** | Custom accessible inline SVGs |
| **Testing** | [Vitest 2.1](https://vitest.dev/) with `jsdom` (28 unit & integration tests) |
| **Deployment** | [GitHub Pages](https://pages.github.com/) via GitHub Actions |

---

## 🙏 Acknowledgements & API Credits

This project is made possible thanks to the following open-source projects, APIs, and transit agencies:

* **[OneBusAway (Puget Sound)](https://onebusaway.org/)**: The open-source platform and REST API ([`api.pugetsound.onebusaway.org`](https://developer.onebusaway.org/)) providing real-time arrival predictions, vehicle tracking, and schedule data for the Seattle & Puget Sound region.
* **[Sound Transit Open Transit Data](https://www.soundtransit.org/help-contacts/business-information/open-transit-data-otd)**: For providing GTFS schedule feeds and real-time vehicle positioning for the Link Light Rail (1 Line & 2 Line).
* **[Transit Tracker API](https://github.com/tjhorner/transit-tracker-api)**: Created by [@tjhorner](https://github.com/tjhorner) and [Eastside Urbanism](https://github.com/EastsideUrbanism), providing the API specification and departure board concepts that inspired this project.
* **[King County Metro](https://kingcounty.gov/en/dept/metro/rider-tools/open-data)**: For regional transit data infrastructure and open developer feeds across King County.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
