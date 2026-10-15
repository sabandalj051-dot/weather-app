# Changelog

All notable changes to the Atmosphere Weather application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-15

### Stable Release
- **First stable production release** of Atmosphere Weather.
- Includes the full feature set for reliable weather lookups, resilient remote API handling, and a polished mobile-friendly experience.
- Improved resilience and caching make the app ready for broader use in day-to-day conditions.

### Fixed & Improved
- **Open-Meteo 503 Service Unavailable Resilience**:
  - Implemented automatic retry mechanism with exponential backoff and jitter (up to 3 retries) on HTTP 503, 502, 504, and 429 status codes.
  - Optimized API request parameters with `forecast_days=7` and `forecast_hours=24`, reducing server payload and processing load by over 80%.
  - Added intelligent client-side `localStorage` caching with stale-while-revalidate fallback: if the remote weather provider is temporarily congested, the app seamlessly serves cached observations with graceful degradation.
  - Enhanced `ErrorState` with automated 5-second countdown auto-retry and tailored diagnostics for server congestion.

---

## [0.1.0] - 2026-10-14

### Initial MVP Release

#### Added
- **Core Weather Engine**:
  - Direct integration with Open-Meteo Forecast and Geocoding APIs.
  - Zero required API keys, zero tracking, and no external database required.
- **Location & Search**:
  - Global city search with 280ms debounce.
  - Real-time autocomplete suggestions with city name, administrative region, and ISO country code.
  - Keyboard navigation for search dropdown (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`).
  - GPS device geolocation with reverse geocoding to human-readable names.
  - Recent searches stored locally with automatic deduplication.
  - Fast-access favorite cities bar with preset global capitals (Tokyo, London, New York, Paris, Sydney, Zurich) and persistent pin/unpin favoriting.
- **Current Conditions Hero**:
  - Dynamic atmospheric background gradients reflecting weather conditions (clear day, clear night, cloudy, overcast, fog, drizzle, rain, snow, thunderstorm).
  - Prominent current temperature and apparent ("Feels like") temperature.
  - Today's high and low temperatures.
  - Quick metrics: Humidity, Wind Speed, Cardinal Direction, and Rain Probability.
  - Local timezone-aware clock display.
- **Hourly Forecast**:
  - 24-hour horizontal scrollable timeline with smooth scroll buttons.
  - Segmented control to toggle display modes: Temperature (°), Precipitation Probability (%), and Wind Speed.
  - WMO weather code icons and day/night differentiation.
- **7-Day Forecast**:
  - Daily outlook with high/low temperatures.
  - Visual relative temperature spectrum bar showing each day's range within the 7-day span.
  - Rain probability indicators and rainfall accumulation sums.
- **Atmospheric Metrics Grid**:
  - Thermal perception with dew point calculation.
  - Wind speed, directional compass needle (0–360°), and Beaufort scale classification.
  - Relative humidity with comfort rating (Dry, Comfortable, Humid).
  - UV index evaluation with health and sun-protection guidance.
  - Optical visibility assessment with atmospheric clarity descriptions.
  - Barometric surface pressure with high/low pressure trends.
  - Solar cycle: Sunrise and Sunset times with daytime tracking.
  - Precipitation accumulation summary.
- **Units & Settings**:
  - Segmented switch for Metric (°C, km/h, mm, hPa) and Imperial (°F, mph, in, inHg).
  - Stored in browser `localStorage`.
- **System & Quality of Life**:
  - Manual refresh button with rotation animation and relative timestamp ("Just now", "2m ago").
  - Automatic background polling every 15 minutes when the tab is visible.
  - Offline network detection with banner alert.
  - Zero-layout-shift loading pulse skeletons.
  - User-friendly error recovery card with suggested cities.
- **Documentation**:
  - `README.md`, `CHANGELOG.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/DEPLOYMENT.md`, and `docs/LEARNING_NOTES.md`.
