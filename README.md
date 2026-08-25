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
- **Smooth Real-time Tickers**: Second-by-second countdown calculations between background API refreshes.
- **Multi-Station Dashboard & Favorites**: Star / pin your daily commute stations to keep them front and center.
- **Kiosk / Big Screen Departure Mode**: Fullscreen, high-contrast digital departure board layout with auto-rotation, perfect for wall monitors, iPads, or TV screens.
- **Optional `transit-tracker-api` Backend Support**: Toggleable settings input to connect to custom [transit-tracker-api](https://github.com/tjhorner/transit-tracker-api) WebSocket / REST instances.
- **Local Storage Persistence**: Pinned stations, active lines, and refresh interval preferences are saved automatically.
- **GitHub Pages Ready**: 100% client-side static application with relative asset bundling.

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
4. Create `.github/workflows/deploy.yml` with the following workflow:

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

## 🛠️ Tech Stack & Architecture

- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Micro-animations, Google Fonts (Outfit, Inter, JetBrains Mono)
- **Testing**: [Vitest](https://vitest.dev/)
- **Data APIs**: Puget Sound OneBusAway REST API + [Transit Tracker API](https://github.com/tjhorner/transit-tracker-api)

---

## 📄 License
MIT
