import React from 'react';
import { CloudSun, RotateCw, WifiOff } from 'lucide-react';
import { UnitSystem } from '../types/weather';

interface HeaderProps {
  unitSystem: UnitSystem;
  onUnitChange: (unit: UnitSystem) => void;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: number | null;
  isOffline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  unitSystem,
  onUnitChange,
  onRefresh,
  isLoading,
  lastUpdated,
  isOffline,
}) => {
  const getRelativeTime = (timestamp: number | null): string => {
    if (!timestamp) return '';
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 15) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    return `${Math.floor(diffMin / 60)}h ago`;
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sky-400">
              <CloudSun className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                Atmosphere
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Meteorological forecast engine
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Offline warning indicator */}
          {isOffline && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium"
              title="Browser is offline. Showing cached or previous data."
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offline</span>
            </div>
          )}

          {/* Unit Toggle */}
          <div
            className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-medium"
            role="group"
            aria-label="Temperature unit selection"
          >
            <button
              type="button"
              onClick={() => onUnitChange('metric')}
              className={`px-3 py-1.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                unitSystem === 'metric'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-pressed={unitSystem === 'metric'}
            >
              °C <span className="opacity-75 hidden sm:inline text-[10px]">km/h</span>
            </button>
            <button
              type="button"
              onClick={() => onUnitChange('imperial')}
              className={`px-3 py-1.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                unitSystem === 'imperial'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-pressed={unitSystem === 'imperial'}
            >
              °F <span className="opacity-75 hidden sm:inline text-[10px]">mph</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            title="Fetch latest weather data"
            aria-label="Refresh weather data"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`}
            />
            {lastUpdated && (
              <span className="hidden lg:inline text-slate-400">
                {getRelativeTime(lastUpdated)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
