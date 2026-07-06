import { Gauge, Droplets, Wind, Sun, Eye, Thermometer, Clock } from 'lucide-react';
import { getWeatherDescription } from '../api/weather';
import WeatherIcon from './WeatherIcon';

export default function CurrentWeather({ data, cityName, onShowHourly }) {
  if (!data) return null;

  const { current, daily } = data;
  const today = daily ? {
    max: daily.temperature_2m_max[0],
    min: daily.temperature_2m_min[0],
    sunrise: daily.sunrise[0],
    sunset: daily.sunset[0],
  } : null;

  const description = getWeatherDescription(current.weather_code);

  return (
    <div className="current-weather">
      <div className="current-main">
        <div className="current-temp-block">
          <div className="current-temp-value">{Math.round(current.temperature_2m)}°</div>
          <div className="current-description">{description}</div>
          <div className="current-feels-like">
            Ощущается как {Math.round(current.apparent_temperature)}°
          </div>
          {today && (
            <div className="current-range">
              <span className="range-high">↑ {Math.round(today.max)}°</span>
              <span className="range-low">↓ {Math.round(today.min)}°</span>
            </div>
          )}
        </div>
        <div className="current-icon-block">
          <WeatherIcon code={current.weather_code} isDay={!!current.is_day} size={96} />
        </div>
      </div>

      {today && (
        <div className="current-sun">
          <span><Sun size={14} /> Восход {formatTime(today.sunrise)}</span>
          <span><Sun size={14} /> Закат {formatTime(today.sunset)}</span>
        </div>
      )}

      <div className="current-details">
        <DetailItem icon={Droplets} label="Влажность" value={`${current.relative_humidity_2m}%`} />
        <DetailItem icon={Wind} label="Ветер" value={`${Math.round(current.wind_speed_10m)} км/ч`} />
        <DetailItem icon={Thermometer} label="Давление" value={`${Math.round(current.pressure_msl)} гПа`} />
        <DetailItem icon={Eye} label="УФ-индекс" value={current.uv_index?.toFixed(1) || '—'} />
      </div>

      {onShowHourly && (
        <button className="hourly-link-btn" onClick={onShowHourly}>
          <Clock size={16} />
          Почасовой прогноз
        </button>
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="detail-item">
      <Icon size={18} className="detail-icon" />
      <div className="detail-info">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value}</span>
      </div>
    </div>
  );
}

function formatTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
