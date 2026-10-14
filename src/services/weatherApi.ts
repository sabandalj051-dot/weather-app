import {
  GeoLocation,
  WeatherData,
  UnitSystem,
  HourlyWeatherItem,
  DailyForecastItem,
  WeatherUnits,
} from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1';

export class WeatherApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Searches for global locations matching the user's query string using Open-Meteo Geocoding API.
 */
export async function searchLocations(
  query: string,
  signal?: AbortSignal
): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(
    trimmed
  )}&count=10&language=en&format=json`;

  try {
    const response = await fetchWithRetry(url, signal, 2);
    if (!response.ok) {
      throw new WeatherApiError(
        `Location search failed with status ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country: item.country,
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone,
    }));
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return [];
    }
    console.error('Error searching locations:', error);
    throw new WeatherApiError(
      error.message || 'Unable to connect to location search service.'
    );
  }
}

/**
 * Resolves coordinates into a human-readable location name via reverse geocode client with fallback.
 */
export async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number
): Promise<GeoLocation> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const name = data.locality || data.city || data.principalSubdivision || 'Current Location';
      return {
        id: Math.round(latitude * 1000 + longitude),
        name,
        latitude,
        longitude,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch (err) {
    console.warn('Reverse geocode lookup warning:', err);
  }

  return {
    id: Math.round(latitude * 1000 + longitude),
    name: 'Current Location',
    latitude,
    longitude,
  };
}

/**
 * Helper to fetch with exponential backoff on transient errors (503, 502, 504, 429).
 */
async function fetchWithRetry(
  url: string,
  signal?: AbortSignal,
  maxRetries = 3
): Promise<Response> {
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    try {
      const response = await fetch(url, { signal });
      if (response.ok) {
        return response;
      }

      // Retry on transient server errors or rate limiting
      if (
        response.status === 503 ||
        response.status === 502 ||
        response.status === 504 ||
        response.status === 429
      ) {
        if (attempt < maxRetries) {
          const delay = attempt * 600 + Math.random() * 300;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      return response;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      if (attempt >= maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 600));
    }
  }
  throw new Error('Network request failed after retries');
}

/**
 * Cache management helpers
 */
function getCacheKey(lat: number, lon: number, unit: UnitSystem): string {
  return `atmosphere_cache_${lat.toFixed(2)}_${lon.toFixed(2)}_${unit}`;
}

function saveToCache(weather: WeatherData, unit: UnitSystem): void {
  try {
    const key = getCacheKey(weather.location.latitude, weather.location.longitude, unit);
    localStorage.setItem(key, JSON.stringify(weather));
    localStorage.setItem('atmosphere_latest_cache', JSON.stringify(weather));
  } catch (e) {
    console.warn('Could not save weather to cache:', e);
  }
}

function getFromCache(lat: number, lon: number, unit: UnitSystem): WeatherData | null {
  try {
    const key = getCacheKey(lat, lon, unit);
    const cached = localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached);
    }
    const latest = localStorage.getItem('atmosphere_latest_cache');
    if (latest) {
      return JSON.parse(latest);
    }
  } catch (e) {
    console.warn('Could not read weather cache:', e);
  }
  return null;
}

/**
 * Fetches real-time, hourly (24-hour), and 7-day daily forecast data from Open-Meteo.
 * Includes automatic retry on transient 503 errors and resilient cache fallback.
 */
export async function fetchWeatherData(
  location: GeoLocation,
  unitSystem: UnitSystem,
  signal?: AbortSignal
): Promise<WeatherData> {
  const isImperial = unitSystem === 'imperial';
  const temperatureUnit = isImperial ? 'fahrenheit' : 'celsius';
  const windSpeedUnit = isImperial ? 'mph' : 'kmh';
  const precipitationUnit = isImperial ? 'inch' : 'mm';

  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    forecast_days: '7',
    forecast_hours: '24',
    timezone: 'auto',
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    precipitation_unit: precipitationUnit,
  });

  const url = `${FORECAST_BASE_URL}/forecast?${params.toString()}`;

  try {
    const response = await fetchWithRetry(url, signal, 3);
    if (!response.ok) {
      // If 503 or 429 and cached data exists, return cached data gracefully
      if (response.status === 503 || response.status === 502 || response.status === 504 || response.status === 429) {
        const cached = getFromCache(location.latitude, location.longitude, unitSystem);
        if (cached) {
          return {
            ...cached,
            location,
            isStale: true,
            staleMessage: `Weather service temporarily busy (${response.status}). Displaying recent cached observations.`,
          };
        }
      }

      throw new WeatherApiError(
        `Weather service responded with error status ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    if (!data.current || !data.hourly || !data.daily) {
      throw new WeatherApiError('Received incomplete weather data from provider.');
    }

    const units: WeatherUnits = {
      temperature: isImperial ? '°F' : '°C',
      windSpeed: isImperial ? 'mph' : 'km/h',
      precipitation: isImperial ? 'in' : 'mm',
      pressure: isImperial ? 'inHg' : 'hPa',
      visibility: isImperial ? 'mi' : 'km',
    };

    // Calculate current dew point and UV index from matching hourly data
    const nowIso = data.current.time;
    const nowTimeIdx = data.hourly.time.findIndex((t: string) => t >= nowIso);
    const resolvedHourlyIdx = nowTimeIdx >= 0 ? nowTimeIdx : 0;

    const currentUv = data.hourly.uv_index?.[resolvedHourlyIdx] ?? 0;
    const rawVisibility = data.hourly.visibility?.[resolvedHourlyIdx] ?? 10000;
    // Open-Meteo returns visibility in meters; convert to km or miles
    const visibilityConverted = isImperial
      ? Math.round((rawVisibility / 1609.34) * 10) / 10
      : Math.round((rawVisibility / 1000) * 10) / 10;

    const dewPoint = data.hourly.dew_point_2m?.[resolvedHourlyIdx];

    // Surface pressure conversion to inHg if imperial
    let currentPressure = data.current.surface_pressure;
    if (isImperial && currentPressure) {
      currentPressure = Math.round((currentPressure * 0.02953) * 100) / 100;
    }

    // Build 24 hours timeline
    const hourlyItems: HourlyWeatherItem[] = [];
    const countHours = Math.min(24, data.hourly.time.length);

    for (let i = 0; i < countHours; i++) {
      const timeStr = data.hourly.time[i];
      const dateObj = new Date(timeStr);
      let displayTime = dateObj.toLocaleTimeString([], {
        hour: 'numeric',
        hour12: true,
      });

      if (i === 0) {
        displayTime = 'Now';
      }

      const rawVis = data.hourly.visibility?.[i] ?? 10000;
      const vis = isImperial
        ? Math.round((rawVis / 1609.34) * 10) / 10
        : Math.round((rawVis / 1000) * 10) / 10;

      let pressure = data.hourly.surface_pressure?.[i] ?? 1013;
      if (isImperial) {
        pressure = Math.round((pressure * 0.02953) * 100) / 100;
      }

      hourlyItems.push({
        time: timeStr,
        timestamp: dateObj.getTime(),
        displayTime,
        temperature: Math.round(data.hourly.temperature_2m[i]),
        apparentTemperature: Math.round(data.hourly.apparent_temperature[i]),
        relativeHumidity: data.hourly.relative_humidity_2m[i],
        dewPoint: data.hourly.dew_point_2m?.[i],
        precipitationProbability: data.hourly.precipitation_probability?.[i] ?? 0,
        precipitation: data.hourly.precipitation?.[i] ?? 0,
        weatherCode: data.hourly.weather_code[i],
        surfacePressure: pressure,
        visibility: vis,
        windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
        windDirection: data.hourly.wind_direction_10m[i],
        uvIndex: Math.round((data.hourly.uv_index?.[i] ?? 0) * 10) / 10,
        isDay: data.hourly.is_day?.[i] === 1,
      });
    }

    // Build 7-day daily forecast
    const dailyItems: DailyForecastItem[] = [];
    const daysCount = Math.min(7, data.daily.time.length);

    for (let d = 0; d < daysCount; d++) {
      const dateStr = data.daily.time[d];
      const dateObj = new Date(`${dateStr}T12:00:00`);

      let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      if (d === 0) dayName = 'Today';
      else if (d === 1) dayName = 'Tomorrow';

      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const sunriseIso = data.daily.sunrise?.[d] || '';
      const sunsetIso = data.daily.sunset?.[d] || '';

      const formatSunTime = (iso: string) => {
        if (!iso) return '--:--';
        try {
          return new Date(iso).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
        } catch {
          return '--:--';
        }
      };

      dailyItems.push({
        date: dateStr,
        dayName,
        formattedDate,
        weatherCode: data.daily.weather_code[d],
        temperatureMax: Math.round(data.daily.temperature_2m_max[d]),
        temperatureMin: Math.round(data.daily.temperature_2m_min[d]),
        apparentTemperatureMax: Math.round(data.daily.apparent_temperature_max[d]),
        apparentTemperatureMin: Math.round(data.daily.apparent_temperature_min[d]),
        sunrise: formatSunTime(sunriseIso),
        sunset: formatSunTime(sunsetIso),
        uvIndexMax: Math.round(data.daily.uv_index_max?.[d] ?? 0),
        precipitationSum: Math.round((data.daily.precipitation_sum?.[d] ?? 0) * 10) / 10,
        precipitationProbabilityMax: data.daily.precipitation_probability_max?.[d] ?? 0,
        windSpeedMax: Math.round(data.daily.wind_speed_10m_max?.[d] ?? 0),
      });
    }

    const result: WeatherData = {
      location: {
        ...location,
        timezone: data.timezone || location.timezone || 'auto',
      },
      current: {
        temperature: Math.round(data.current.temperature_2m),
        apparentTemperature: Math.round(data.current.apparent_temperature),
        relativeHumidity: data.current.relative_humidity_2m,
        surfacePressure: currentPressure,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: data.current.wind_direction_10m,
        windGusts: Math.round(data.current.wind_gusts_10m || 0),
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
        precipitation: data.current.precipitation,
        uvIndex: currentUv,
        visibility: visibilityConverted,
        dewPoint: dewPoint !== undefined ? Math.round(dewPoint) : undefined,
      },
      hourly: hourlyItems,
      daily: dailyItems,
      units,
      fetchedAt: Date.now(),
      timezone: data.timezone || 'UTC',
    };

    // Save successful live result to cache
    saveToCache(result, unitSystem);

    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }

    // Check cache on network failure
    const cached = getFromCache(location.latitude, location.longitude, unitSystem);
    if (cached) {
      return {
        ...cached,
        location,
        isStale: true,
        staleMessage: 'Weather service temporarily unreachable. Showing recent cached observations.',
      };
    }

    console.error('Error fetching weather data:', error);
    throw new WeatherApiError(
      error.message || 'Unable to retrieve live forecast data from Open-Meteo.'
    );
  }
}
