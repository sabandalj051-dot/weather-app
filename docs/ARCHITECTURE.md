# Atmosphere Weather — Architecture & Technical Design

This document details the system design, data flow, component hierarchy, and design decisions of the Atmosphere Weather application.

---

## 1. Architectural Philosophy

Atmosphere Weather is engineered as a **zero-backend, client-side single page application (SPA)**. It adheres to three key engineering constraints:
1. **Zero Database Dependency**: All user preferences (favorites, search history, unit preference, last visited city) reside strictly in the client's `localStorage`.
2. **Open Data Principles**: All meteorological observations and geocoding rely on Open-Meteo's open public REST API (under CC BY 4.0 license), requiring no secret keys or credit card credentials.
3. **Resilience & Fault Tolerance**: Every request carries an `AbortController` to cancel in-flight queries when new queries occur, preventing race conditions. Offline state changes are captured via standard DOM events.

---

## 2. Component Hierarchy

```
App (src/App.tsx)
 ├── OfflineBanner (src/components/OfflineBanner.tsx)
 ├── Header (src/components/Header.tsx)
 │    ├── Brand Logo
 │    ├── Unit Switcher (°C / °F segmented control)
 │    ├── Refresh Trigger with spin animation
 │    └── Network status indicator
 ├── SearchBar (src/components/SearchBar.tsx)
 │    ├── Input field with debounce (280ms)
 │    ├── Clear query button
 │    ├── GPS Geolocation button
 │    └── Dropdown (Autocomplete results & recent searches)
 ├── FavoriteLocationsBar (src/components/FavoriteLocationsBar.tsx)
 │    └── Quick-access city chips (Presets + User Pinned)
 └── Dynamic State Container
      ├── LoadingSkeleton (src/components/LoadingSkeleton.tsx)
      ├── ErrorState (src/components/ErrorState.tsx)
      └── Main Weather View
           ├── CurrentWeatherHero (src/components/CurrentWeatherHero.tsx)
           │    ├── Location header + Star/Pin toggle
           │    ├── Primary temperature display
           │    ├── Condition description & icon
           │    └── Micro-metric summary pills
           ├── HourlyForecast (src/components/HourlyForecast.tsx)
           │    ├── Metric mode selector (Temp / Rain / Wind)
           │    ├── Horizontal scrollable timeline
           │    └── 24-hour hour cards
           ├── DailyForecast (src/components/DailyForecast.tsx)
           │    ├── 7-day list
           │    ├── Relative min-to-max visual heat spectrum bar
           │    └── Precipitation probabilities and sums
           └── WeatherMetricsGrid (src/components/WeatherMetricsGrid.tsx)
                ├── Thermal Perception (Feels like & Dew point)
                ├── Wind & Direction (Needle & Beaufort scale)
                ├── Relative Humidity & Comfort rating
                ├── UV Index & Health recommendations
                ├── Optical Visibility assessment
                ├── Barometric Surface Pressure & trends
                ├── Solar Cycle (Sunrise / Sunset times)
                └── Precipitation accumulation totals
```

---

## 3. Data Flow

```
User Action (Search / GPS / Favorite / Unit switch)
         │
         ▼
[ services/weatherApi.ts ]
 ├── searchLocations(query, signal) ──> Open-Meteo Geocoding API
 ├── reverseGeocodeCoordinates(lat, lon) ──> Reverse Geocode Client
 └── fetchWeatherData(location, unit, signal) ──> Open-Meteo Forecast API
         │
         ▼ (JSON Response)
[ Transformer Layer ]
 ├── WMO code analysis (src/utils/weatherCodes.tsx)
 ├── Unit conversions (km/h <-> mph, hPa <-> inHg, mm <-> in)
 ├── Daylight & Timezone string normalization
 └── 24-hour window slice & 7-day aggregation
         │
         ▼
[ React State in App.tsx ]
 ├── weatherData (WeatherData | null)
 ├── isLoading (boolean)
 ├── error (string | null)
 ├── isOffline (boolean)
 └── unitSystem ('metric' | 'imperial')
         │
         ▼
[ Presentation Components ]
 (Hero, Hourly, 7-Day, Metrics, Skeletons)
```

---

## 4. Key Technical Decisions

### A. Debounced Autocomplete with AbortController
- Problem: Fast keystrokes trigger multiple HTTP requests, risking out-of-order response overwrites.
- Solution: A 280ms debounce window combined with `AbortController.abort()` cancels the previous pending request before starting a new one.

### B. Unit Conversion at the API Layer vs Client Display
- Problem: Converting temperatures in multiple nested components often leads to rounding discrepancies (e.g., 20°C = 68°F, but rounding after calculations could yield 67°F or 69°F).
- Solution: We pass the requested unit parameters directly to Open-Meteo (`temperature_unit=celsius|fahrenheit`, `wind_speed_unit=kmh|mph`, `precipitation_unit=mm|inch`). This ensures meteorologically sound calculations for apparent temperature, wind gusts, and precipitation sums straight from the meteorological model.

### C. Relative Visual Temperature Spectrum Bar
- In the 7-day forecast, rather than displaying static text numbers, we compute the global minimum and global maximum across all 7 days:
  $$\text{totalRange} = \max(\text{daily.tempMax}) - \min(\text{daily.tempMin})$$
  Each day's bar is placed dynamically at:
  $$\text{left} = \frac{\text{day.tempMin} - \text{globalMin}}{\text{totalRange}} \times 100\%$$
  $$\text{width} = \frac{\text{day.tempMax} - \text{day.tempMin}}{\text{totalRange}} \times 100\%$$
  This matches the familiar visualization seen in modern iOS and Android weather applications.

### D. Zero-Layout-Shift Loading Skeletons
- Loading states mirror the exact pixel dimensions and grid arrangement of the final rendered weather dashboard, preventing Cumulative Layout Shift (CLS).

### E. Offline Resilience
- `window.addEventListener('online')` and `window.addEventListener('offline')` toggle an unobtrusive notification banner without disrupting current view content.
