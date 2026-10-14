import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, MapPin, ServerOff } from 'lucide-react';
import { GeoLocation } from '../types/weather';
import { DEFAULT_PRESET_CITIES } from './FavoriteLocationsBar';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onSelectCity: (city: GeoLocation) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onSelectCity,
}) => {
  const is503 = message.includes('503') || message.toLowerCase().includes('service');
  const [countdown, setCountdown] = useState(is503 ? 5 : 0);

  useEffect(() => {
    if (!is503) return;
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [is503, message, onRetry]);

  return (
    <div className="bg-slate-900/80 border border-rose-900/40 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto backdrop-blur-md shadow-2xl">
      <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 border ${
        is503
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
      }`}>
        {is503 ? <ServerOff className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
        {is503 ? 'Weather Service Temporarily Busy' : 'Weather Data Unavailable'}
      </h2>

      <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
        {is503
          ? 'Open-Meteo is temporarily experiencing high server demand (Status 503). Retrying connection automatically...'
          : message || 'Unable to retrieve meteorological data for this location at the moment.'}
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>
            {countdown > 0 ? `Auto-retrying in ${countdown}s (or Retry Now)` : 'Try Again Now'}
          </span>
        </button>
      </div>

      {/* Suggested cities fallback */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
          Or explore other weather stations:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {DEFAULT_PRESET_CITIES.slice(0, 4).map((city) => (
            <button
              key={`err-suggest-${city.name}`}
              type="button"
              onClick={() => onSelectCity(city)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
