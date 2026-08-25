# 🚊 Seattle Light Rail Tracker

> **Live Website:** 👉 **[https://xuanmn.github.io/Seattle-Lightrail-Tracker/](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)**

A modern, responsive, real-time departure countdown board and multi-station tracker for **Seattle's Sound Transit Link Light Rail** (1 Line & 2 Line), hosted live on **GitHub Pages**.

[![Live Demo](https://img.shields.io/badge/🌐_Open_Live_Tracker-xuanmn.github.io%2FSeattle--Lightrail--Tracker-008542?style=for-the-badge&logo=googlechrome&logoColor=white)](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)
[![Sound Transit](https://img.shields.io/badge/Sound%20Transit-Link%20Light%20Rail-008542?style=for-the-badge)](https://www.soundtransit.org)
[![1 Line](https://img.shields.io/badge/1%20Line-Lynnwood%20⇄%20Angle%20Lake-008542?style=for-the-badge)](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)
[![2 Line](https://img.shields.io/badge/2%20Line-South%20Bellevue%20⇄%20Redmond-0072CE?style=for-the-badge)](https://xuanmn.github.io/Seattle-Lightrail-Tracker/)

---

## ✨ Features

- **Live Regional Data Out-of-the-Box**: Direct integration with Puget Sound OneBusAway (`api.pugetsound.onebusaway.org`) providing live arrival predictions, GPS tracking, and delay statuses without requiring a backend.
- **Sound Transit Line 1 & Line 2**: Pre-loaded catalog with all 23 stations on the **1 Line** (from Lynnwood City Center through Angle Lake) and all 10 stations on the **2 Line** (from South Bellevue to Downtown Redmond).
- **Directional Departure Cards**: View Northbound/Southbound or Eastbound/Westbound platforms side-by-side with high-visibility countdown badges (`ARRIVING`, `3 MIN`, `12 MIN`).
- **Customizable Dashboard**: Only shows your saved/favorite stations by default, keeping the board fast and clean.
- **One-Click Station Management**: Easily star or unstar stations to add or remove them from your saved list.
- **Smooth Real-time Tickers**: Automatic 60-second background sync cycle with second-by-second countdown ticks.
- **Regional Transit Guide & FAQ**: Built-in guide explaining connections, line differences, and fares in the app.
- **Optional `transit-tracker-api` Backend Support**: Toggleable settings input to connect to custom [transit-tracker-api](https://github.com/tjhorner/transit-tracker-api) WebSocket / REST instances.
- **Local Storage Persistence**: Pinned stations, active lines, and user preferences are saved automatically in your browser.
- **GitHub Pages Ready**: 100% client-side static application with relative asset bundling.

---

## 🙏 Acknowledgements & API Credits

This project is made possible thanks to the following open-source projects, APIs, and transit agencies:

* **[Transit Tracker API](https://github.com/tjhorner/transit-tracker-api)**: Created by [@tjhorner](https://github.com/tjhorner) and [Eastside Urbanism](https://github.com/EastsideUrbanism), providing the API specification, Docker backend service, and WebSocket streaming format that inspired this project.
* **[OneBusAway (Puget Sound)](https://onebusaway.org/)**: The open-source platform and REST API ([`api.pugetsound.onebusaway.org`](https://developer.onebusaway.org/)) providing real-time arrival predictions, vehicle tracking, and schedule data for the Seattle & Puget Sound region.
* **[Sound Transit Open Transit Data](https://www.soundtransit.org/help-contacts/business-information/open-transit-data-otd)**: For providing GTFS schedule feeds and real-time vehicle positioning for the Link Light Rail (1 Line & 2 Line).
* **[King County Metro](https://kingcounty.gov/en/dept/metro/rider-tools/open-data)**: For regional transit data infrastructure and open developer feeds across King County.

---

## 🛠️ Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Micro-animations, Google Fonts (Outfit, Inter, JetBrains Mono)
- **Testing**: [Vitest](https://vitest.dev/)
- **Target Deployment**: [GitHub Pages](https://pages.github.com/)

---

## 📄 License
MIT
