# Atmosphere Weather

> A modern, responsive, precision weather dashboard built with React, TypeScript, Tailwind CSS, and the Open-Meteo API. Zero tracking, zero API keys required, and no database overhead.

![Atmosphere Weather Preview](https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1200&q=80)

---

## Features

- **Global Location Search**: Instant geocoding with debounce and keyboard accessibility (`ArrowUp`, `ArrowDown`, `Enter`, `Esc`) powered by Open-Meteo.
- **GPS Auto-Detection**: One-click device geolocation lookup with reverse geocoding to identify your local city.
- **Current Meteorological Conditions**:
  - Live temperature with condition-based atmospheric themes.
  - Apparent ("Feels like") temperature, dew point, and comfort assessment.
  - Wind speed, directional compass needle (0–360°), cardinal notation (e.g., SSE), and Beaufort wind scale.
  - Relative humidity, barometric pressure (hPa / inHg), UV index rating with health advice, and optical visibility.
- **24-Hour Hourly Timeline**: Interactive timeline with quick switches for Temperature (°), Precipitation Probability (%), and Wind Speed.
- **7-Day Daily Forecast**: High and low temperatures plotted on a visual heat spectrum relative to the week's range, daily precipitation accumulation, and sunrise/sunset timings.
- **Unit Switching**: One-tap toggle between Metric (°C, km/h, mm, hPa) and Imperial (°F, mph, in, inHg) with persistent memory.
- **Favorite Locations**: Pin/star your favorite locations for quick one-click navigation alongside preset world metropolises (Tokyo, London, New York, Paris, Sydney, Zurich).
- **Offline & Error Resilience**: Network connectivity detection (`navigator.onLine`), graceful error states with suggested fallback cities, and zero-layout-shift pulse skeletons.
- **Open Standards**: Fully conforms to the World Meteorological Organization (WMO) 0–99 weather interpretation code standard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **API Provider** | [Open-Meteo](https://open-meteo.com/) (Open Data, CC BY 4.0, No API Key required) |

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/atmosphere-weather.git
   cd atmosphere-weather
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Available Scripts

- `npm run dev`: Starts the local development server on port 3000.
- `npm run build`: Compiles TypeScript and builds production assets into `dist/`.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs TypeScript type checking (`tsc --noEmit`).

---

## Architecture Overview

```
src/
├── components/           # Modular UI components
│   ├── Header.tsx                 # Brand, unit switch, refresh, offline indicator
│   ├── SearchBar.tsx              # Debounced search, keyboard nav, GPS
│   ├── FavoriteLocationsBar.tsx   # Fast city switcher & pinned favorites
│   ├── CurrentWeatherHero.tsx     # Hero temperature & ambient theme
│   ├── HourlyForecast.tsx         # 24-hour timeline with metric modes
│   ├── DailyForecast.tsx          # 7-day outlook with relative range bar
│   ├── WeatherMetricsGrid.tsx     # 8 detailed meteorological metric cards
│   ├── LoadingSkeleton.tsx        # Zero-CLS loading state
│   ├── ErrorState.tsx             # Friendly error recovery & diagnostics
│   ├── OfflineBanner.tsx          # Offline detection alert
│   └── Footer.tsx                 # Open-Meteo attribution and license
├── services/
│   └── weatherApi.ts              # Open-Meteo fetchers and data transformers
├── types/
│   └── weather.ts                 # Strongly-typed meteorological interfaces
├── utils/
│   └── weatherCodes.tsx           # WMO code mapping, icons, and themes
├── App.tsx                        # Main state coordinator
├── main.tsx                       # React DOM entrypoint
└── index.css                      # Global styles and Tailwind imports
```

---

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Architecture & Data Flow](docs/ARCHITECTURE.md)
- [Roadmap & Planned Phases](docs/ROADMAP.md)
- [Testing & Verification Guide](docs/TESTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Beginner Developer Learning Notes](docs/LEARNING_NOTES.md)
- [Changelog](CHANGELOG.md)

---

## Data Attribution & License

- Weather data and geocoding services provided by **[Open-Meteo](https://open-meteo.com/)** under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license.
- Source code released under the **Apache-2.0 License**.
