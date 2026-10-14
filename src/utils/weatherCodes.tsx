import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudHail,
  Wind,
} from 'lucide-react';
import { WeatherConditionInfo } from '../types/weather';

/**
 * Maps WMO (World Meteorological Organization) weather interpretation code
 * to human-readable label, description, icons, and aesthetic theme.
 */
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  // 0: Clear sky
  if (code === 0) {
    return isDay
      ? {
          label: 'Clear Sky',
          description: 'Sun shining with clear atmospheric conditions',
          iconName: 'Sun',
          theme: 'clear-day',
          gradientBg: 'from-amber-500/20 via-sky-500/10 to-slate-900',
          accentColor: 'text-amber-400',
        }
      : {
          label: 'Clear Night',
          description: 'Crisp, starlit skies with calm conditions',
          iconName: 'Moon',
          theme: 'clear-night',
          gradientBg: 'from-indigo-950 via-slate-900 to-slate-950',
          accentColor: 'text-indigo-300',
        };
  }

  // 1-3: Mainly clear, partly cloudy, overcast
  if (code === 1) {
    return isDay
      ? {
          label: 'Mainly Clear',
          description: 'Mostly sunny with scattered faint clouds',
          iconName: 'CloudSun',
          theme: 'clear-day',
          gradientBg: 'from-sky-500/20 via-blue-900/10 to-slate-900',
          accentColor: 'text-sky-300',
        }
      : {
          label: 'Mainly Clear',
          description: 'Night skies with few drifting clouds',
          iconName: 'CloudMoon',
          theme: 'clear-night',
          gradientBg: 'from-slate-900 via-indigo-950/40 to-slate-950',
          accentColor: 'text-indigo-200',
        };
  }

  if (code === 2) {
    return isDay
      ? {
          label: 'Partly Cloudy',
          description: 'Sun intermittently filtered by passing cloud cover',
          iconName: 'CloudSun',
          theme: 'cloudy',
          gradientBg: 'from-blue-600/20 via-slate-800/30 to-slate-900',
          accentColor: 'text-sky-400',
        }
      : {
          label: 'Partly Cloudy',
          description: 'Moon filtered through passing clouds',
          iconName: 'CloudMoon',
          theme: 'cloudy',
          gradientBg: 'from-slate-900 via-blue-950/40 to-slate-950',
          accentColor: 'text-slate-300',
        };
  }

  if (code === 3) {
    return {
      label: 'Overcast',
      description: 'Dense cloud layer obscuring direct sunlight',
      iconName: 'Cloud',
      theme: 'overcast',
      gradientBg: 'from-slate-800/40 via-slate-900 to-slate-950',
      accentColor: 'text-slate-400',
    };
  }

  // 45, 48: Fog
  if (code === 45 || code === 48) {
    return {
      label: code === 48 ? 'Rime Fog' : 'Foggy',
      description: 'Reduced horizontal visibility with dense mist',
      iconName: 'CloudFog',
      theme: 'fog',
      gradientBg: 'from-teal-900/20 via-slate-900 to-slate-950',
      accentColor: 'text-teal-300',
    };
  }

  // 51, 53, 55: Drizzle
  if (code === 51 || code === 53 || code === 55) {
    const intensity = code === 51 ? 'Light' : code === 53 ? 'Moderate' : 'Dense';
    return {
      label: `${intensity} Drizzle`,
      description: 'Fine mist and light precipitation droplets',
      iconName: 'CloudDrizzle',
      theme: 'drizzle',
      gradientBg: 'from-cyan-900/30 via-slate-900 to-slate-950',
      accentColor: 'text-cyan-300',
    };
  }

  // 56, 57: Freezing Drizzle
  if (code === 56 || code === 57) {
    return {
      label: 'Freezing Drizzle',
      description: 'Supercooled drizzle droplets freezing on contact',
      iconName: 'CloudDrizzle',
      theme: 'snow',
      gradientBg: 'from-cyan-950 via-slate-900 to-slate-950',
      accentColor: 'text-cyan-200',
    };
  }

  // 61, 63, 65: Rain
  if (code === 61 || code === 63 || code === 65) {
    const intensity = code === 61 ? 'Slight' : code === 63 ? 'Moderate' : 'Heavy';
    return {
      label: `${intensity} Rain`,
      description: 'Steady rainfall with wet road conditions',
      iconName: 'CloudRain',
      theme: 'rain',
      gradientBg: 'from-blue-900/30 via-slate-900 to-slate-950',
      accentColor: 'text-blue-400',
    };
  }

  // 66, 67: Freezing Rain
  if (code === 66 || code === 67) {
    return {
      label: 'Freezing Rain',
      description: 'Liquid precipitation freezing on ground surfaces',
      iconName: 'CloudHail',
      theme: 'snow',
      gradientBg: 'from-blue-950 via-indigo-950 to-slate-950',
      accentColor: 'text-sky-200',
    };
  }

  // 71, 73, 75, 77: Snow
  if (code === 71 || code === 73 || code === 75 || code === 77) {
    const intensity = code === 71 ? 'Slight' : code === 73 ? 'Moderate' : code === 75 ? 'Heavy' : 'Snow Grains';
    return {
      label: code === 77 ? 'Snow Grains' : `${intensity} Snow`,
      description: 'Falling crystalline frozen precipitation',
      iconName: 'CloudSnow',
      theme: 'snow',
      gradientBg: 'from-slate-800 via-indigo-950/40 to-slate-950',
      accentColor: 'text-indigo-200',
    };
  }

  // 80, 81, 82: Rain Showers
  if (code === 80 || code === 81 || code === 82) {
    const intensity = code === 80 ? 'Light' : code === 81 ? 'Moderate' : 'Violent';
    return {
      label: `${intensity} Showers`,
      description: 'Intermittent bursts of convective rainfall',
      iconName: 'CloudRain',
      theme: 'rain',
      gradientBg: 'from-blue-900/40 via-slate-900 to-slate-950',
      accentColor: 'text-blue-300',
    };
  }

  // 85, 86: Snow Showers
  if (code === 85 || code === 86) {
    return {
      label: code === 86 ? 'Heavy Snow Showers' : 'Snow Showers',
      description: 'Brief, intense periods of snowfall',
      iconName: 'CloudSnow',
      theme: 'snow',
      gradientBg: 'from-slate-800 via-slate-900 to-slate-950',
      accentColor: 'text-slate-200',
    };
  }

  // 95, 96, 99: Thunderstorm
  if (code === 95 || code === 96 || code === 99) {
    const detail = code === 95 ? 'Thunderstorm' : 'Thunderstorm with Hail';
    return {
      label: detail,
      description: 'Convective storm with lightning discharges and heavy rain',
      iconName: code === 95 ? 'CloudLightning' : 'CloudHail',
      theme: 'thunderstorm',
      gradientBg: 'from-purple-950/50 via-slate-900 to-slate-950',
      accentColor: 'text-amber-400',
    };
  }

  // Fallback
  return {
    label: 'Atmospheric Conditions',
    description: 'Current local weather reading',
    iconName: 'Wind',
    theme: 'cloudy',
    gradientBg: 'from-slate-800 via-slate-900 to-slate-950',
    accentColor: 'text-slate-300',
  };
}

/**
 * Returns the matching Lucide icon element for a given iconName
 */
export function renderWeatherIcon(iconName: string, className: string = 'w-6 h-6'): React.ReactNode {
  switch (iconName) {
    case 'Sun':
      return <Sun className={className} />;
    case 'Moon':
      return <Moon className={className} />;
    case 'CloudSun':
      return <CloudSun className={className} />;
    case 'CloudMoon':
      return <CloudMoon className={className} />;
    case 'Cloud':
      return <Cloud className={className} />;
    case 'CloudFog':
      return <CloudFog className={className} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} />;
    case 'CloudRain':
      return <CloudRain className={className} />;
    case 'CloudLightning':
      return <CloudLightning className={className} />;
    case 'CloudSnow':
      return <CloudSnow className={className} />;
    case 'CloudHail':
      return <CloudHail className={className} />;
    default:
      return <Wind className={className} />;
  }
}

/**
 * Format wind direction degrees into 16-point cardinal compass directions
 */
export function getWindDirectionCardinal(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * UV index assessment
 */
export function getUVAssessment(uvIndex: number): { label: string; color: string; advice: string } {
  if (uvIndex < 3) {
    return { label: 'Low', color: 'text-emerald-400', advice: 'Minimal sun protection required for most people.' };
  }
  if (uvIndex < 6) {
    return { label: 'Moderate', color: 'text-amber-400', advice: 'Wear sunglasses and apply SPF 30+ if outdoors.' };
  }
  if (uvIndex < 8) {
    return { label: 'High', color: 'text-orange-400', advice: 'Seek shade during midday; cover skin and wear a hat.' };
  }
  if (uvIndex < 11) {
    return { label: 'Very High', color: 'text-rose-400', advice: 'Extra protection needed. Avoid midday sun exposure.' };
  }
  return { label: 'Extreme', color: 'text-purple-400', advice: 'Full protection imperative. Unprotected skin burns rapidly.' };
}

/**
 * Beaufort scale estimation from wind speed in km/h
 */
export function getBeaufortScale(windKmh: number): { scale: number; description: string } {
  if (windKmh < 1) return { scale: 0, description: 'Calm' };
  if (windKmh <= 5) return { scale: 1, description: 'Light air' };
  if (windKmh <= 11) return { scale: 2, description: 'Light breeze' };
  if (windKmh <= 19) return { scale: 3, description: 'Gentle breeze' };
  if (windKmh <= 28) return { scale: 4, description: 'Moderate breeze' };
  if (windKmh <= 38) return { scale: 5, description: 'Fresh breeze' };
  if (windKmh <= 49) return { scale: 6, description: 'Strong breeze' };
  if (windKmh <= 61) return { scale: 7, description: 'High wind' };
  if (windKmh <= 74) return { scale: 8, description: 'Gale' };
  if (windKmh <= 88) return { scale: 9, description: 'Strong gale' };
  return { scale: 10, description: 'Storm conditions' };
}
