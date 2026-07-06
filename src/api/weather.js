/* ========================================= */
/*   🌤 Open-Meteo Weather API               */
/*   Geocoding + Прогноз                      */
/* ========================================= */

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Ищет города по названию
 * @param {string} query — название города
 * @returns {Promise<Array<{name: string, country: string, lat: number, lon: number, admin1?: string}>>}
 */
export async function searchCity(query) {
  if (!query || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    name: query.trim(),
    count: 8,
    language: 'ru',
    format: 'json',
  });

  const res = await fetch(`${GEOCODING_URL}?${params}`);

  if (!res.ok) {
    throw new Error(`Ошибка геокодирования: ${res.status}`);
  }

  const data = await res.json();
  return (data.results || []).map((city) => ({
    id: city.id,
    name: city.name,
    country: city.country,
    lat: city.latitude,
    lon: city.longitude,
    region: city.admin1 || '',
  }));
}

/**
 * Получает погоду по координатам
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<object>}
 */
export async function getWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'pressure_msl',
      'uv_index',
      'is_day',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
      'precipitation',
      'wind_speed_10m',
      'relative_humidity_2m',
      'apparent_temperature',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'precipitation_sum',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
      'uv_index_max',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: 'auto',
    forecast_days: 7,
  });

  const res = await fetch(`${WEATHER_URL}?${params}`);

  if (!res.ok) {
    throw new Error(`Ошибка получения погоды: ${res.status}`);
  }

  return res.json();
}

/**
 * Возвращает описание погоды по WMO коду
 * @param {number} code
 * @returns {string}
 */
export function getWeatherDescription(code) {
  const descriptions = {
    0: 'Ясно',
    1: 'Преимущественно ясно',
    2: 'Переменная облачность',
    3: 'Пасмурно',
    45: 'Туман',
    48: 'Изморозь',
    51: 'Лёгкая морось',
    53: 'Умеренная морось',
    55: 'Сильная морось',
    56: 'Ледяная морось',
    57: 'Сильная ледяная морось',
    61: 'Небольшой дождь',
    63: 'Умеренный дождь',
    65: 'Сильный дождь',
    66: 'Ледяной дождь',
    67: 'Сильный ледяной дождь',
    71: 'Небольшой снег',
    73: 'Умеренный снег',
    75: 'Сильный снег',
    77: 'Снежные зёрна',
    80: 'Небольшие ливни',
    81: 'Умеренные ливни',
    82: 'Сильные ливни',
    85: 'Небольшой снегопад',
    86: 'Сильный снегопад',
    95: 'Гроза',
    96: 'Гроза с градом',
    99: 'Сильная гроза с градом',
  };
  return descriptions[code] || 'Неизвестно';
}

/**
 * Возвращает название иконки погоды по WMO коду для lucide-react
 * @param {number} code
 * @param {boolean} isDay
 * @returns {string}
 */
export function getWeatherIconName(code, isDay = true) {
  if (code === 0) return isDay ? 'Sun' : 'Moon';
  if (code <= 2) return isDay ? 'SunDim' : 'CloudMoon';
  if (code === 3) return 'Cloud';
  if (code <= 48) return 'CloudFog';
  if (code <= 57) return 'CloudDrizzle';
  if (code <= 67) return 'CloudRain';
  if (code <= 77) return 'CloudSnow';
  if (code <= 82) return 'CloudRainWind';
  if (code <= 86) return 'CloudSnow';
  return 'CloudLightning';
}
