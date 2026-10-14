import React from 'react';
import {
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Umbrella,
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import {
  getWindDirectionCardinal,
  getUVAssessment,
  getBeaufortScale,
} from '../utils/weatherCodes';

interface WeatherMetricsGridProps {
  weather: WeatherData;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  weather,
}) => {
  const { current, daily, units } = weather;
  const today = daily[0];

  const uvInfo = getUVAssessment(today?.uvIndexMax ?? current.uvIndex ?? 0);
  const beaufort = getBeaufortScale(
    units.windSpeed === 'km/h' ? current.windSpeed : current.windSpeed * 1.60934
  );
  const cardinalDirection = getWindDirectionCardinal(current.windDirection);

  // Pressure analysis
  const pressureValue = current.surfacePressure;
  const standardPressure = units.pressure === 'inHg' ? 29.92 : 1013.25;
  const pressureDiff = pressureValue - standardPressure;
  const pressureTrend =
    pressureDiff > 2
      ? 'High pressure (Fair skies)'
      : pressureDiff < -2
      ? 'Low pressure (Precipitation likely)'
      : 'Normal atmospheric pressure';

  // Visibility status
  const visibilityVal = current.visibility ?? 10;
  let visibilityDesc = 'Clear horizon';
  if (units.visibility === 'km') {
    if (visibilityVal < 1) visibilityDesc = 'Dense fog / Low visibility';
    else if (visibilityVal < 4) visibilityDesc = 'Hazy conditions';
    else if (visibilityVal < 10) visibilityDesc = 'Moderate visibility';
    else visibilityDesc = 'Excellent clarity';
  } else {
    if (visibilityVal < 0.6) visibilityDesc = 'Dense fog / Low visibility';
    else if (visibilityVal < 2.5) visibilityDesc = 'Hazy conditions';
    else if (visibilityVal < 6) visibilityDesc = 'Moderate visibility';
    else visibilityDesc = 'Excellent clarity';
  }

  // Humidity comfort
  let humidityComfort = 'Comfortable';
  if (current.relativeHumidity > 70) humidityComfort = 'Humid & Muggy';
  else if (current.relativeHumidity < 30) humidityComfort = 'Dry air';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Feels Like */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Thermal Perception
          </span>
          <Thermometer className="w-4 h-4 text-rose-400" />
        </div>
        <div className="my-3">
          <div className="text-3xl font-extrabold text-white">
            {current.apparentTemperature}
            {units.temperature}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {current.apparentTemperature === current.temperature
              ? 'Feels similar to the actual temperature.'
              : current.apparentTemperature > current.temperature
              ? 'Humidity makes it feel warmer than measured.'
              : 'Wind chill causes conditions to feel cooler.'}
          </p>
        </div>
        {current.dewPoint !== undefined && (
          <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
            Dew point: <span className="text-slate-200 font-medium">{current.dewPoint}{units.temperature}</span>
          </div>
        )}
      </div>

      {/* 2. Wind & Gusts */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Wind & Direction
          </span>
          <Wind className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {current.windSpeed}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {units.windSpeed} · {cardinalDirection}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {/* Visual Compass Needle */}
            <div
              className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center shrink-0 bg-slate-800"
              title={`Wind coming from ${current.windDirection}°`}
            >
              <div
                className="w-1.5 h-3 bg-cyan-400 rounded-full"
                style={{
                  transform: `rotate(${current.windDirection}deg)`,
                  transformOrigin: 'center center',
                }}
              />
            </div>
            <span className="text-xs text-slate-300 font-medium">
              {beaufort.description} (Scale {beaufort.scale})
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          Peak Gusts:{' '}
          <span className="text-slate-200 font-medium">
            {current.windGusts} {units.windSpeed}
          </span>
        </div>
      </div>

      {/* 3. Humidity & Comfort */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Relative Humidity
          </span>
          <Droplets className="w-4 h-4 text-sky-400" />
        </div>
        <div className="my-3">
          <div className="text-3xl font-extrabold text-white">
            {current.relativeHumidity}%
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
              style={{ width: `${current.relativeHumidity}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{humidityComfort}</p>
        </div>
        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          Precipitation: <span className="text-slate-200 font-medium">{current.precipitation} {units.precipitation}</span>
        </div>
      </div>

      {/* 4. UV Index */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            UV Index
          </span>
          <Sun className="w-4 h-4 text-amber-400" />
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {today?.uvIndexMax ?? current.uvIndex ?? 0}
            </span>
            <span className={`text-sm font-bold ${uvInfo.color}`}>
              {uvInfo.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{uvInfo.advice}</p>
        </div>
        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          Max daily peak: <span className="text-slate-200 font-medium">{today?.uvIndexMax ?? 0}</span>
        </div>
      </div>

      {/* 5. Visibility */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Visibility
          </span>
          <Eye className="w-4 h-4 text-teal-400" />
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white">
              {visibilityVal}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              {units.visibility}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{visibilityDesc}</p>
        </div>
        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          Standard clear range: <span className="text-slate-200 font-medium">10+ {units.visibility}</span>
        </div>
      </div>

      {/* 6. Surface Pressure */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Barometric Pressure
          </span>
          <Gauge className="w-4 h-4 text-purple-400" />
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white">
              {pressureValue}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              {units.pressure}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{pressureTrend}</p>
        </div>
        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          Sea-level baseline: <span className="text-slate-200 font-medium">{units.pressure === 'inHg' ? '29.92 inHg' : '1013.2 hPa'}</span>
        </div>
      </div>

      {/* 7. Sunrise & Sunset */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Solar Cycle
          </span>
          <Sunrise className="w-4 h-4 text-amber-400" />
        </div>
        <div className="my-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Sunrise</span>
            </div>
            <span className="font-bold text-white">{today?.sunrise ?? '--:--'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Sunset className="w-4 h-4 text-rose-400" />
              <span>Sunset</span>
            </div>
            <span className="font-bold text-white">{today?.sunset ?? '--:--'}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          Daytime status: <span className="text-slate-200 font-medium">{current.isDay ? 'Sun is up' : 'Night time'}</span>
        </div>
      </div>

      {/* 8. Precipitation Overview */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Precipitation Total
          </span>
          <Umbrella className="w-4 h-4 text-blue-400" />
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white">
              {today?.precipitationSum ?? 0}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              {units.precipitation} today
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Max probability: <span className="text-blue-400 font-semibold">{today?.precipitationProbabilityMax ?? 0}%</span>
          </p>
        </div>
        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          Current rate: <span className="text-slate-200 font-medium">{current.precipitation} {units.precipitation}</span>
        </div>
      </div>
    </div>
  );
};
