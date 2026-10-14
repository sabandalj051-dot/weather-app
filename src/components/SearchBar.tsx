import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Loader2, X, History, Compass } from 'lucide-react';
import { GeoLocation } from '../types/weather';
import { searchLocations, reverseGeocodeCoordinates } from '../services/weatherApi';

interface SearchBarProps {
  onSelectLocation: (location: GeoLocation) => void;
  onUseGeolocation: () => void;
  isLocating: boolean;
  selectedLocationName?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectLocation,
  onUseGeolocation,
  isLocating,
  selectedLocationName,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<GeoLocation[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load recents from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('atmosphere_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (e) {
      console.warn('Could not read recent searches:', e);
    }
  }, []);

  const saveRecentSearch = (loc: GeoLocation) => {
    try {
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (item) => item.latitude !== loc.latitude || item.longitude !== loc.longitude
        );
        const updated = [loc, ...filtered].slice(0, 5);
        localStorage.setItem('atmosphere_recent_searches', JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn('Could not save recent search:', e);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      setHighlightedIndex(-1);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const items = await searchLocations(trimmed, controller.signal);
        setResults(items);
        setHighlightedIndex(-1);
        setIsOpen(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setSearchError('Failed to fetch matching locations. Please check your connection.');
          setResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (loc: GeoLocation) => {
    saveRecentSearch(loc);
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentList = query.trim().length >= 2 ? results : recentSearches;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen && currentList.length > 0) {
        setIsOpen(true);
      } else if (currentList.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % currentList.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentList.length > 0) {
        setHighlightedIndex((prev) =>
          prev <= 0 ? currentList.length - 1 : prev - 1
        );
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < currentList.length) {
        handleSelect(currentList[highlightedIndex]);
      } else if (currentList.length > 0) {
        handleSelect(currentList[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 pointer-events-none text-slate-400">
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city, region, or country (e.g., Tokyo, London, Zurich)..."
          className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 text-slate-100 placeholder-slate-400 text-sm md:text-base rounded-2xl border border-slate-700/80 shadow-lg shadow-black/20 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all backdrop-blur-md"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Search city or location"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 p-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800 focus:outline-none"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* GPS Geolocation Button */}
        <button
          type="button"
          onClick={onUseGeolocation}
          disabled={isLocating}
          className="absolute right-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700/70 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          title="Detect weather at your current GPS location"
          aria-label="Use current location"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Compass className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">GPS</span>
        </button>
      </div>

      {/* Autocomplete & Recents Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-40 backdrop-blur-xl animate-in fade-in-50 slide-in-from-top-2 duration-150"
          role="listbox"
        >
          {/* Query Results */}
          {query.trim().length >= 2 ? (
            <div>
              {searchError && (
                <div className="p-4 text-xs text-rose-400 bg-rose-950/20 border-b border-rose-900/30">
                  {searchError}
                </div>
              )}

              {results.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto py-1 divide-y divide-slate-800/40">
                  {results.map((loc, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    const subtitle = [loc.admin1, loc.country]
                      .filter(Boolean)
                      .join(', ');

                    return (
                      <li
                        key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                        role="option"
                        aria-selected={isHighlighted}
                        onClick={() => handleSelect(loc)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                          isHighlighted
                            ? 'bg-sky-500/15 text-white'
                            : 'text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <MapPin
                            className={`w-4 h-4 shrink-0 ${
                              isHighlighted ? 'text-sky-400' : 'text-slate-400'
                            }`}
                          />
                          <div className="truncate">
                            <span className="font-medium text-sm text-slate-100">
                              {loc.name}
                            </span>
                            {subtitle && (
                              <span className="text-xs text-slate-400 ml-2">
                                {subtitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {loc.country_code && (
                          <span className="text-[11px] font-mono text-slate-400 border border-slate-700/60 px-1.5 py-0.5 rounded uppercase shrink-0">
                            {loc.country_code}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : !isSearching ? (
                <div className="p-6 text-center text-sm text-slate-400">
                  <p className="font-medium text-slate-300">No locations found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try searching for another city, airport, or coordinate.
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            /* Recent Searches or Suggested Cities */
            <div className="p-2">
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <ul className="py-1">
                    {recentSearches.map((loc, idx) => (
                      <li
                        key={`recent-${loc.id}-${loc.latitude}`}
                        role="option"
                        aria-selected={idx === highlightedIndex}
                        onClick={() => handleSelect(loc)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer text-sm transition-colors ${
                          idx === highlightedIndex
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{loc.name}</span>
                          {loc.country && (
                            <span className="text-xs text-slate-400">
                              · {loc.country}
                            </span>
                          )}
                        </div>
                        {loc.country_code && (
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {loc.country_code}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recentSearches.length === 0 && (
                <div className="px-4 py-3 text-xs text-slate-400 text-center">
                  Type at least 2 characters to search global weather stations.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
