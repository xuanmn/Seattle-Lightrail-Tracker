# 🚊 Seattle Light Rail Tracker

A modern, responsive, real-time departure countdown board and multi-station tracker for **Seattle's Sound Transit Link Light Rail** (1 Line & 2 Line), designed for deployment on **GitHub Pages**.

![Seattle Light Rail Tracker](https://img.shields.io/badge/Sound%20Transit-Link%20Light%20Rail-008542?style=for-the-badge)
![1 Line](https://img.shields.io/badge/1%20Line-Lynnwood%20⇄%20Angle%20Lake-008542?style=for-the-badge)
![2 Line](https://img.shields.io/badge/2%20Line-South%20Bellevue%20⇄%20Redmond-0072CE?style=for-the-badge)

---

## ✨ Features

- **Live Regional Data Out-of-the-Box**: Direct integration with Puget Sound OneBusAway (`api.pugetsound.onebusaway.org`) providing live arrival predictions, GPS tracking, and delay statuses without requiring a backend.
- **Sound Transit Line 1 & Line 2**: Pre-loaded catalog with all 23 stations on the **1 Line** (from Lynnwood City Center through Angle Lake) and all 10 stations on the **2 Line** (from South Bellevue to Downtown Redmond).
- **Directional Departure Cards**: View Northbound/Southbound or Eastbound/Westbound platforms side-by-side with high-visibility countdown badges (`ARRIVING`, `3 MIN`, `12 MIN`).
- **Customizable Dashboard**: Only shows your saved/favorite stations by default, keeping the board fast and clean.
- **One-Click Station Management**: Easily add, search, or remove (✖) stations directly from the dashboard or via the Station Browser modal.
- **Smooth Real-time Tickers**: Automatic 60-second background sync cycle with second-by-second countdown ticks.
- **Regional Transit Guide & FAQ**: Built-in guide explaining connections, line differences, and how to travel between Lynnwood, Seattle, and Bellevue.
- **Optional `transit-tracker-api` Backend Support**: Toggleable settings input to connect to custom [transit-tracker-api](https://github.com/tjhorner/transit-tracker-api) WebSocket / REST instances.
- **Local Storage Persistence**: Pinned stations, active lines, and user preferences are saved automatically in your browser.
- **GitHub Pages Ready**: 100% client-side static application with relative asset bundling.

---

## 🗺️ Transit Guide: How to Get From Lynnwood to Bellevue

Currently, the **1 Line** serves Seattle / Snohomish County and the **2 Line** serves the Eastside. Sound Transit provides several convenient options to travel between Lynnwood and Bellevue:

### 🟢 Option 1: Fastest & Direct (Express Bus via I-405)
* **Route**: **Sound Transit Express Route 535** (or Route 532 peak commuter).
* **Where to board**: **Lynnwood City Center Station Bay 4**.
* **Arrival**: **Bellevue Transit Center / Bellevue Downtown Station**.
* **Travel time**: **35–45 minutes** direct via I-405 without transferring in Seattle.

### 🟡 Option 2: 1 Line Train + Seattle Transfer (via I-90)
* **Step 1**: Take **1 Line South** from Lynnwood City Center to **Int'l District / Chinatown Station** or **Westlake** (~30 min).
* **Step 2**: Transfer to **Sound Transit Express 550** across I-90 directly into **Bellevue Downtown**.
* **Step 3**: Connect directly to the **2 Line** at Bellevue Downtown for Spring District, Overlake, or Redmond.

### 🟣 Future Connection: Direct 1 Line ⇄ 2 Line Rail Transfer
* Once Sound Transit completes the I-90 Link extension connecting Seattle across Lake Washington to South Bellevue, riders will be able to transfer between **Line 1** and **Line 2** at **Chinatown-International District Station** directly on the rail network!

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Test Suite
```bash
npm test
```

### 4. Build for Production (GitHub Pages)
```bash
npm run build
```
The optimized static build is generated in the `dist/` directory.

---

## 🌐 Deploying to GitHub Pages

### Option 1: Automated GitHub Actions (Recommended)

1. Push this repository to your GitHub account.
2. In your repository on GitHub, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will automatically test, build, and deploy your site on every push to `main`!

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Tests
        run: npm test

      - name: Build static site
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Option 2: Deploy `dist/` branch via `gh-pages`
```bash
npx gh-pages -d dist
```

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
