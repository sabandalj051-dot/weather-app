import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Wind,
  Thermometer,
} from 'lucide-react';
import { HourlyWeatherItem, WeatherUnits } from '../types/weather';
import { getWeatherCondition, renderWeatherIcon } from '../utils/weatherCodes';

interface HourlyForecastProps {
  hourly: HourlyWeatherItem[];
  units: WeatherUnits;
}

type MetricMode = 'temp' | 'rain' | 'wind';

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  units,
}) => {
  const [mode, setMode] = useState<MetricMode>('temp');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
            Hourly Forecast (24 Hours)
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Metric Segmented Control */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('temp')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-sky-500/50 ${
                mode === 'temp'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temp</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('rain')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-sky-500/50 ${
                mode === 'rain'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Rain %</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('wind')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-sky-500/50 ${
                mode === 'wind'
                  ? 'bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Wind</span>
            </button>
          </div>

          {/* Scroll Nav Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
              aria-label="Scroll hourly forecast left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
              aria-label="Scroll hourly forecast right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hourly Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pt-4 pb-2 scroll-smooth no-scrollbar"
        tabIndex={0}
        aria-label="24-hour horizontal forecast timeline"
      >
        {hourly.map((item, index) => {
          const condition = getWeatherCondition(item.weatherCode, item.isDay);
          const isNow = index === 0;

          return (
            <div
              key={`${item.time}-${index}`}
              className={`flex flex-col items-center justify-between min-w-[76px] sm:min-w-[84px] p-3 rounded-2xl border transition-all select-none shrink-0 ${
                isNow
                  ? 'bg-sky-500/15 border-sky-500/40 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/40 hover:bg-slate-800/60 border-slate-800/80'
              }`}
            >
              {/* Time */}
              <span
                className={`text-xs font-semibold ${
                  isNow ? 'text-sky-300' : 'text-slate-400'
                }`}
              >
                {item.displayTime}
              </span>

              {/* Weather Icon */}
              <div
                className={`my-3 p-1.5 rounded-xl ${
                  isNow ? 'text-sky-400' : condition.accentColor
                }`}
              >
                {renderWeatherIcon(condition.iconName, 'w-6 h-6')}
              </div>

              {/* Dynamic Value according to selected mode */}
              <div className="text-center">
                {mode === 'temp' && (
                  <div className="font-bold text-sm sm:text-base text-slate-100">
                    {item.temperature}
                    {units.temperature}
                  </div>
                )}

                {mode === 'rain' && (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-0.5 text-xs font-bold text-blue-400">
                      <Droplets className="w-3 h-3" />
                      <span>{item.precipitationProbability}%</span>
                    </div>
                    {item.precipitation > 0 && (
                      <span className="text-[10px] text-slate-400">
                        {item.precipitation} {units.precipitation}
                      </span>
                    )}
                  </div>
                )}

                {mode === 'wind' && (
                  <div className="text-center">
                    <div className="text-xs font-bold text-cyan-300">
                      {item.windSpeed}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {units.windSpeed}
                    </div>
                  </div>
                )}
              </div>

              {/* Secondary micro indicator */}
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                {item.precipitationProbability > 15 && mode !== 'rain' && (
                  <span className="text-blue-400 font-medium">
                    {item.precipitationProbability}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
