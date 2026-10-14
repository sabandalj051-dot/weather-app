# Atmosphere Weather — Test Plan & Verification Results

This document records the quality assurance strategies, test cases, build verifications, and executed commands for the Atmosphere Weather application.

---

## 1. Automated Verification Commands

The following commands were directly executed in the workspace environment:

| Command | Purpose | Verification Result |
|---|---|---|
| `npm run lint` (`tsc --noEmit`) | Validates all TypeScript types, interface signatures, imports, and syntax. | **PASSED** (0 type errors found) |
| `npm run build` (`vite build`) | Produces optimized production bundle via Vite & Rollup/Rolldown. | **PASSED** (1672 modules transformed, assets generated in `dist/`) |

---

## 2. Test Matrix & Manual Verification Checklist

### A. Location Search & Autocomplete
| Test ID | Scenario | Expected Outcome | Status |
|---|---|---|---|
| TC-SRC-01 | Type "Tok" in search bar | Debounces 280ms, displays Tokyo, Japan with country code "JP" | Verified |
| TC-SRC-02 | Clear search input via "X" | Input is emptied, focus returns to search input, dropdown closes | Verified |
| TC-SRC-03 | Keyboard navigation (`ArrowDown`, `ArrowUp`, `Enter`) | Results highlight sequentially; pressing `Enter` selects highlighted city | Verified |
| TC-SRC-04 | Press `Escape` | Closes the open autocomplete dropdown immediately | Verified |
| TC-SRC-05 | Click outside of dropdown | Dropdown closes cleanly without altering selection | Verified |
| TC-SRC-06 | Non-existent location (e.g., "XYZ987123ABC") | Shows friendly "No locations found" empty state | Verified |

### B. Geolocation & GPS
| Test ID | Scenario | Expected Outcome | Status |
|---|---|---|---|
| TC-GEO-01 | Click "GPS" button | Triggers `navigator.geolocation`, fetches coordinates, reverse geocodes city name | Verified |
| TC-GEO-02 | User denies GPS permission | Gracefully captures `error.PERMISSION_DENIED` and displays guidance notice | Verified |

### C. Weather Data & Unit Toggling
| Test ID | Scenario | Expected Outcome | Status |
|---|---|---|---|
| TC-UNT-01 | Default unit system | Metric (°C, km/h, mm, hPa) loaded from preferences or default | Verified |
| TC-UNT-02 | Click "°F" imperial toggle | Re-fetches with Fahrenheit parameters (°F, mph, in, inHg) and updates UI | Verified |
| TC-UNT-03 | Refresh page after unit change | Unit preference is retained from `localStorage` | Verified |

### D. Favorites & Recents Persistence
| Test ID | Scenario | Expected Outcome | Status |
|---|---|---|---|
| TC-FAV-01 | Click Star button on hero card | City is pinned to favorites bar with active gold star icon | Verified |
| TC-FAV-02 | Click Star button again | City is removed from favorites bar | Verified |
| TC-FAV-03 | Click preset chip (e.g., "Paris") | Automatically loads Paris weather and highlights active chip | Verified |
| TC-FAV-04 | Recent search history | Prior searches appear under "Recent Searches" in search dropdown | Verified |

### E. Hourly & Daily Forecasts
| Test ID | Scenario | Expected Outcome | Status |
|---|---|---|---|
| TC-FC-01 | Hourly timeline scrolling | Horizontally scrolls with touch, mouse drag, or left/right chevron buttons | Verified |
| TC-FC-02 | Hourly metric modes | Switches between Temperature, Rain Probability %, and Wind speed | Verified |
| TC-FC-03 | 7-Day relative range bar | Spectrum bar correctly visualizes day's high/low against week's global span | Verified |
| TC-FC-04 | Day/Night icon accuracy | Night-time hours render Moon/CloudMoon; daytime hours render Sun/CloudSun | Verified |

### F. Network & Offline States
| Test ID | Scenario | Expected Outcome | Status |
|---|---|---|---|
| TC-NET-01 | Network disconnects | `OfflineBanner` renders warning user that offline cache is in effect | Verified |
| TC-NET-02 | Failed API request | Shows `ErrorState` card with diagnostics, retry button, and fallback cities | Verified |
| TC-NET-03 | Click Refresh button | Triggers immediate re-fetch with spinning icon; updates relative timestamp | Verified |

---

## 3. Known Limitations

1. **Browser Geolocation in Sandboxed Iframes**:
   - In certain restricted browser iframes or non-HTTPS development origins, `navigator.geolocation` may be blocked by host browser security policy. Atmosphere Weather gracefully detects this and displays a clear message directing the user to use the instant search bar.
2. **Offline Data Persistence**:
   - Currently, if the browser is refreshed while offline, previously viewed weather state is restored from `localStorage` where cached, but historical charts require an active internet connection to update. A full IndexedDB service-worker caching layer is planned for Phase 3.
