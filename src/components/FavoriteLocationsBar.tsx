import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { GeoLocation } from '../types/weather';

interface FavoriteLocationsBarProps {
  currentLocation: GeoLocation;
  favorites: GeoLocation[];
  onSelect: (location: GeoLocation) => void;
  onToggleFavorite: (location: GeoLocation) => void;
}

export const DEFAULT_PRESET_CITIES: GeoLocation[] = [
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan', country_code: 'JP' },
  { id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom', country_code: 'GB' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, country: 'United States', country_code: 'US' },
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'France', country_code: 'FR' },
  { id: 2147714, name: 'Sydney', latitude: -33.8678, longitude: 151.2073, country: 'Australia', country_code: 'AU' },
  { id: 2657896, name: 'Zurich', latitude: 47.3667, longitude: 8.55, country: 'Switzerland', country_code: 'CH' },
];

export const FavoriteLocationsBar: React.FC<FavoriteLocationsBarProps> = ({
  currentLocation,
  favorites,
  onSelect,
}) => {
  // Combine user favorites first, then presets (avoiding duplicates)
  const displayedCities = React.useMemo(() => {
    const list: GeoLocation[] = [...favorites];
    for (const preset of DEFAULT_PRESET_CITIES) {
      const alreadyPresent = list.some(
        (c) =>
          Math.abs(c.latitude - preset.latitude) < 0.1 &&
          Math.abs(c.longitude - preset.longitude) < 0.1
      );
      if (!alreadyPresent) {
        list.push(preset);
      }
    }
    return list.slice(0, 8);
  }, [favorites]);

  const isCurrent = (loc: GeoLocation) => {
    return (
      Math.abs(loc.latitude - currentLocation.latitude) < 0.05 &&
      Math.abs(loc.longitude - currentLocation.longitude) < 0.05
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0 hidden sm:inline mr-1">
          Quick Access:
        </span>
        {displayedCities.map((city) => {
          const active = isCurrent(city);
          const isUserFav = favorites.some(
            (f) =>
              Math.abs(f.latitude - city.latitude) < 0.05 &&
              Math.abs(f.longitude - city.longitude) < 0.05
          );

          return (
            <button
              key={`${city.name}-${city.latitude}-${city.longitude}`}
              type="button"
              onClick={() => onSelect(city)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                active
                  ? 'bg-sky-500 text-white border-sky-400/80 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              {isUserFav ? (
                <Star
                  className={`w-3 h-3 ${
                    active ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'
                  }`}
                />
              ) : (
                <MapPin className="w-3 h-3 opacity-60" />
              )}
              <span>{city.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
