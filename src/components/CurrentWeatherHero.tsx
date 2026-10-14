import React from 'react';
import {
  MapPin,
  Star,
  Wind,
  Droplets,
  ArrowUp,
  ArrowDown,
  Clock,
  Compass,
} from 'lucide-react';
import { WeatherData, GeoLocation } from '../types/weather';
import {
  getWeatherCondition,
  renderWeatherIcon,
  getWindDirectionCardinal,
} from '../utils/weatherCodes';

interface CurrentWeatherHeroProps {
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: (loc: GeoLocation) => void;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  weather,
  isFavorite,
  onToggleFavorite,
}) => {
  const { current, daily, location, units } = weather;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);

  const todayForecast = daily[0];
  const highTemp = todayForecast?.temperatureMax ?? current.temperature;
  const lowTemp = todayForecast?.temperatureMin ?? current.temperature;
  const windDir = getWindDirectionCardinal(current.windDirection);

  // Format local time at target location's timezone if available
  const localTimeStr = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: weather.timezone,
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(new Date());
    } catch {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }
  }, [weather.timezone]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br ${condition.gradientBg} p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-500`}
    >
      {/* Background radial glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full gap-8">
        {/* Top bar: Location details + Favorite button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {location.name}
              </h1>
              {location.country_code && (
                <span className="text-xs font-mono font-medium text-slate-400 bg-slate-800/70 border border-slate-700/60 px-2 py-0.5 rounded uppercase">
                  {location.country_code}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-slate-300">
              {location.country && location.country !== location.name && (
                <span>{location.country}</span>
              )}
              {location.admin1 && <span>· {location.admin1}</span>}
              <span className="text-slate-400">·</span>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{localTimeStr}</span>
              </div>
            </div>
          </div>

          {/* Star / Favorite Button */}
          <button
            type="button"
            onClick={() => onToggleFavorite(location)}
            className={`p-3 rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Star
              className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
            />
          </button>
        </div>

        {/* Center: Main Temperature & Weather Condition */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-end gap-6">
          {/* Temperature section */}
          <div className="md:col-span-7 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6">
            <div className="flex items-start">
              <span className="text-7xl sm:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none select-none">
                {current.temperature}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-sky-400 ml-1">
                {units.temperature}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-sm sm:text-base font-medium text-slate-300">
                Feels like{' '}
                <span className="text-white font-semibold">
                  {current.apparentTemperature}
                  {units.temperature}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center gap-1 text-rose-400 font-medium">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>
                    {highTemp}
                    {units.temperature}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sky-400 font-medium">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>
                    {lowTemp}
                    {units.temperature}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Condition Icon & Description */}
          <div className="md:col-span-5 flex flex-col items-start md:items-end justify-end">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-slate-900/60 border border-slate-800 ${condition.accentColor} shadow-lg backdrop-blur-md`}>
                {renderWeatherIcon(condition.iconName, 'w-8 h-8 sm:w-10 sm:h-10')}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {condition.label}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xs md:text-right">
                  {condition.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quick Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Humidity</div>
              <div className="text-sm font-semibold text-slate-100">
                {current.relativeHumidity}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Wind Speed</div>
              <div className="text-sm font-semibold text-slate-100">
                {current.windSpeed} {units.windSpeed}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Direction</div>
              <div className="text-sm font-semibold text-slate-100">
                {windDir} ({current.windDirection}°)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Rain Probability</div>
              <div className="text-sm font-semibold text-slate-100">
                {todayForecast?.precipitationProbabilityMax ?? 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
