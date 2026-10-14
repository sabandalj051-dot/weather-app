# Atmosphere Weather — Product Roadmap

This document outlines the planned engineering milestones and architectural evolutionary phases for Atmosphere Weather.

---

## Phase 1: MVP Foundation (v0.1.0) — [COMPLETED]

- [x] **Open-Meteo Integration**: Connect to Open-Meteo Geocoding and Forecast API endpoints without API keys or database.
- [x] **Current Weather Display**: Temperature, feels-like temperature, humidity, wind speed, pressure, UV index, and weather description.
- [x] **24-Hour Timeline**: 24-hour hourly forecast with temperature, rain probability, and wind metrics.
- [x] **7-Day Forecast**: Weekly outlook with relative temperature range spectrum bars.
- [x] **WMO Code Mapping**: Full mapping of World Meteorological Organization codes 0–99 with contextual icons and atmospheric theme gradients.
- [x] **Units Switching**: Seamless toggling between Metric (°C, km/h, mm, hPa) and Imperial (°F, mph, in, inHg).
- [x] **Location Search & GPS**: Debounced search with autocomplete, keyboard navigation, GPS geolocation, and reverse geocoding.
- [x] **Favorites & Recents**: Persistent pinned cities and recent search history saved in `localStorage`.
- [x] **System States**: Accessible loading skeletons, error screens with retry and fallback cities, and offline status banner.
- [x] **Documentation**: Full suite of architectural, deployment, testing, and beginner learning guides.

---

## Phase 2: Enhanced Visualization & Radar (v0.2.0) — [PLANNED]

- [ ] **Interactive Weather Radar Map**:
  - Embed OpenStreetMap / RainViewer precipitation radar layer.
  - Play/pause radar animation across past 2 hours and next 30-minute forecast.
- [ ] **Interactive Temperature Curve**:
  - Smooth SVG bezier curve for the 24-hour temperature and precipitation chart.
- [ ] **Air Quality Index (AQI)**:
  - Integrate Open-Meteo Air Quality API (PM2.5, PM10, Nitrogen Dioxide, Ozone, European AQI, and US AQI).
- [ ] **Severe Weather Alerts**:
  - National meteorological warnings and advisories where provided by open data sources.

---

## Phase 3: PWA & Offline Enhancements (v0.3.0) — [PLANNED]

- [ ] **Progressive Web App (PWA)**:
  - Service worker caching for app shell and icon assets.
  - Installable to desktop, iOS Home Screen, and Android.
  - Web App Manifest with theme colors and adaptive icons.
- [ ] **IndexedDB Offline Cache**:
  - Store full forecast snapshots for all pinned cities for true offline browsing during flights or outages.
- [ ] **Multi-City Dashboard Mode**:
  - Side-by-side card comparison of multiple favorited cities at a glance.

---

## Phase 4: Extended Customization & Developer API (v1.0.0) — [PLANNED]

- [ ] **Theme Personalization**:
  - OLED True Black mode, High-Contrast Accessibility mode, and Classic Light mode.
- [ ] **Share Weather Cards**:
  - Generate downloadable or shareable visual weather summary images (HTML5 Canvas).
- [ ] **Export Capabilities**:
  - Export historical or 7-day forecast data to CSV or JSON for research or outdoor trip planning.
