import React from 'react';
import { Calendar, Droplets, Wind, Sun, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyForecastItem, WeatherUnits } from '../types/weather';
import { getWeatherCondition, renderWeatherIcon } from '../utils/weatherCodes';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  units: WeatherUnits;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, units }) => {
  // Calculate global min and max temperature across all 7 days to position the relative visual bar
  const { globalMin, globalMax } = React.useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    daily.forEach((d) => {
      if (d.temperatureMin < min) min = d.temperatureMin;
      if (d.temperatureMax > max) max = d.temperatureMax;
    });
    // Ensure span is at least 1 to prevent division by zero
    if (min === max) max = min + 1;
    return { globalMin: min, globalMax: max };
  }, [daily]);

  const totalRange = globalMax - globalMin;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
        <Calendar className="w-5 h-5 text-sky-400" />
        <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
          7-Day Outlook
        </h2>
      </div>

      <div className="divide-y divide-slate-800/60 pt-1">
        {daily.map((item, index) => {
          const condition = getWeatherCondition(item.weatherCode, true);
          const isToday = index === 0;

          // Calculate percentage offsets for min and max bars
          const leftPercent = Math.max(
            0,
            Math.min(100, ((item.temperatureMin - globalMin) / totalRange) * 100)
          );
          const rightPercent = Math.max(
            0,
            Math.min(100, ((item.temperatureMax - globalMin) / totalRange) * 100)
          );
          const barWidth = Math.max(8, rightPercent - leftPercent);

          return (
            <div
              key={item.date}
              className={`py-3.5 px-2 sm:px-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isToday ? 'bg-sky-500/5' : 'hover:bg-slate-800/40'
              }`}
            >
              {/* Day Name and Date */}
              <div className="flex items-center justify-between sm:justify-start gap-3 sm:w-44 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-sm sm:text-base ${
                        isToday ? 'text-sky-400 font-bold' : 'text-slate-100'
                      }`}
                    >
                      {item.dayName}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{item.formattedDate}</div>
                </div>

                {/* Mobile condition icon */}
                <div className="sm:hidden flex items-center gap-2">
                  <div className={`p-1 rounded-lg ${condition.accentColor}`}>
                    {renderWeatherIcon(condition.iconName, 'w-5 h-5')}
                  </div>
                  <span className="text-xs text-slate-300 font-medium">
                    {condition.label}
                  </span>
                </div>
              </div>

              {/* Desktop Condition Icon & Label */}
              <div className="hidden sm:flex items-center gap-2.5 w-48 shrink-0">
                <div className={`p-1.5 rounded-xl bg-slate-800/60 ${condition.accentColor}`}>
                  {renderWeatherIcon(condition.iconName, 'w-5 h-5')}
                </div>
                <div className="truncate">
                  <div className="text-sm font-medium text-slate-200 truncate">
                    {condition.label}
                  </div>
                  {item.precipitationProbabilityMax > 15 ? (
                    <div className="flex items-center gap-1 text-[11px] text-blue-400 font-medium">
                      <Droplets className="w-3 h-3" />
                      <span>{item.precipitationProbabilityMax}% rain</span>
                      {item.precipitationSum > 0 && (
                        <span>· {item.precipitationSum}{units.precipitation}</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400">
                      Wind: {item.windSpeedMax} {units.windSpeed}
                    </div>
                  )}
                </div>
              </div>

              {/* Temperature Bar Comparison */}
              <div className="flex items-center gap-3 sm:flex-1 w-full sm:max-w-xs">
                {/* Min Temp */}
                <span className="text-xs sm:text-sm font-semibold text-slate-400 w-8 text-right">
                  {item.temperatureMin}°
                </span>

                {/* Visual Relative Range Bar */}
                <div className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 shadow-sm"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>

                {/* Max Temp */}
                <span className="text-xs sm:text-sm font-bold text-slate-100 w-8 text-left">
                  {item.temperatureMax}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
