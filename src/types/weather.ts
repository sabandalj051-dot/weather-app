export type UnitSystem = 'metric' | 'imperial';

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeatherData {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  uvIndex?: number;
  visibility?: number;
  dewPoint?: number;
}

export interface HourlyWeatherItem {
  time: string;
  timestamp: number;
  displayTime: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  dewPoint?: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  surfacePressure: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
}

export interface WeatherUnits {
  temperature: string;
  windSpeed: string;
  precipitation: string;
  pressure: string;
  visibility: string;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeatherData;
  hourly: HourlyWeatherItem[];
  daily: DailyForecastItem[];
  units: WeatherUnits;
  fetchedAt: number;
  timezone: string;
  isStale?: boolean;
  staleMessage?: string;
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: string;
  theme: 'clear-day' | 'clear-night' | 'cloudy' | 'overcast' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  gradientBg: string;
  accentColor: string;
}
