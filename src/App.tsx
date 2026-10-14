/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GeoLocation, WeatherData, UnitSystem } from './types/weather';
import { fetchWeatherData, reverseGeocodeCoordinates } from './services/weatherApi';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FavoriteLocationsBar, DEFAULT_PRESET_CITIES } from './components/FavoriteLocationsBar';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';
import { OfflineBanner } from './components/OfflineBanner';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  LOCATION: 'atmosphere_last_location',
  UNITS: 'atmosphere_unit_system',
  FAVORITES: 'atmosphere_favorite_locations',
};

const DEFAULT_INITIAL_LOCATION: GeoLocation = {
  id: 1850147,
  name: 'Tokyo',
  latitude: 35.6895,
  longitude: 139.6917,
  country: 'Japan',
  country_code: 'JP',
  admin1: 'Tokyo',
  timezone: 'Asia/Tokyo',
};

export default function App() {
  // 1. Unit System State
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNITS);
      if (saved === 'imperial' || saved === 'metric') return saved;
    } catch (e) {
      console.warn('Could not read unit preference:', e);
    }
    return 'metric';
  });

  // 2. Location State
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved location:', e);
    }
    return DEFAULT_INITIAL_LOCATION;
  });

  // 3. Favorites State
  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read favorites:', e);
    }
    return [];
  });

  // 4. Weather Data & Loading States
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // 5. Offline Status
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  const abortRef = useRef<AbortController | null>(null);

  // Monitor online / offline changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save unit system preference
  const handleUnitChange = (newUnit: UnitSystem) => {
    setUnitSystem(newUnit);
    try {
      localStorage.setItem(STORAGE_KEYS.UNITS, newUnit);
    } catch (e) {
      console.warn('Could not save unit preference:', e);
    }
  };

  // Toggle favorite location
  const handleToggleFavorite = (loc: GeoLocation) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) =>
          Math.abs(f.latitude - loc.latitude) < 0.05 &&
          Math.abs(f.longitude - loc.longitude) < 0.05
      );
      let updated: GeoLocation[];
      if (exists) {
        updated = prev.filter(
          (f) =>
            Math.abs(f.latitude - loc.latitude) >= 0.05 ||
            Math.abs(f.longitude - loc.longitude) >= 0.05
        );
      } else {
        updated = [loc, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save favorites:', e);
      }
      return updated;
    });
  };

  // Check if current location is favorited
  const isCurrentFavorite = favorites.some(
    (f) =>
      Math.abs(f.latitude - currentLocation.latitude) < 0.05 &&
      Math.abs(f.longitude - currentLocation.longitude) < 0.05
  );

  // Fetch weather data for given location & unit
  const loadWeather = useCallback(
    async (location: GeoLocation, unit: UnitSystem) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherData(location, unit, controller.signal);
        setWeatherData(data);

        // Update stored location on successful fetch
        try {
          localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
        } catch (e) {
          console.warn('Could not persist location:', e);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Weather load error:', err);
          setError(
            err.message ||
              'Unable to fetch live weather readings. Please check your internet connection or try again.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Load weather whenever location or unit system changes
  useEffect(() => {
    loadWeather(currentLocation, unitSystem);
  }, [currentLocation, unitSystem, loadWeather]);

  // Periodic auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden && navigator.onLine) {
        loadWeather(currentLocation, unitSystem);
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentLocation, unitSystem, loadWeather]);

  // Manual refresh handler
  const handleRefresh = () => {
    loadWeather(currentLocation, unitSystem);
  };

  // Handle location selection from search or quick bar
  const handleSelectLocation = (loc: GeoLocation) => {
    setGeoError(null);
    setCurrentLocation(loc);
  };

  // Handle GPS location click
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const resolvedLoc = await reverseGeocodeCoordinates(latitude, longitude);
          setCurrentLocation(resolvedLoc);
        } catch (err) {
          setCurrentLocation({
            id: Math.round(latitude * 1000 + longitude),
            name: 'Current Location',
            latitude,
            longitude,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location permission denied. Please allow location access in your browser or search for your city above.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location information is currently unavailable from your device.');
            break;
          case error.TIMEOUT:
            setGeoError('Location request timed out. Please try again.');
            break;
          default:
            setGeoError('Could not determine your location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Offline banner */}
      <OfflineBanner isOffline={isOffline} />

      {/* Header */}
      <Header
        unitSystem={unitSystem}
        onUnitChange={handleUnitChange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        lastUpdated={weatherData?.fetchedAt ?? null}
        isOffline={isOffline}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Search Bar Section */}
        <div className="space-y-2">
          <SearchBar
            onSelectLocation={handleSelectLocation}
            onUseGeolocation={handleUseGeolocation}
            isLocating={isLocating}
            selectedLocationName={currentLocation.name}
          />

          {/* Geolocation Notice / Error */}
          {geoError && (
            <div className="max-w-2xl mx-auto p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center">
              {geoError}
            </div>
          )}

          {/* Quick Access / Saved Cities Bar */}
          <FavoriteLocationsBar
            currentLocation={currentLocation}
            favorites={favorites}
            onSelect={handleSelectLocation}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        {/* Dynamic State Rendering */}
        {error && !weatherData ? (
          <ErrorState
            message={error}
            onRetry={handleRefresh}
            onSelectCity={handleSelectLocation}
          />
        ) : isLoading && !weatherData ? (
          <LoadingSkeleton />
        ) : weatherData ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Stale / Fallback Notice Banner */}
            {weatherData.isStale && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span>
                    {weatherData.staleMessage ||
                      'Weather provider is temporarily experiencing high traffic (503). Showing cached data.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium transition-colors shrink-0"
                >
                  Retry Update
                </button>
              </div>
            )}

            {/* Hero Current Weather */}
            <CurrentWeatherHero
              weather={weatherData}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Hourly Forecast (24 Hours) */}
            <HourlyForecast
              hourly={weatherData.hourly}
              units={weatherData.units}
            />

            {/* Split Section: 7-Day Outlook & Detailed Weather Metrics */}
            <div className="space-y-6">
              {/* 7-Day Forecast */}
              <DailyForecast
                daily={weatherData.daily}
                units={weatherData.units}
              />

              {/* Comprehensive Atmospheric Metrics Grid */}
              <div className="space-y-3">
                <div className="px-1 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Meteorological Observations
                </div>
                <WeatherMetricsGrid weather={weatherData} />
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
