import { getWeatherDescription } from '../api/weather';
import WeatherIcon from './WeatherIcon';
import { Droplets, Wind } from 'lucide-react';

export default function Forecast({ daily }) {
  if (!daily) return null;

  const days = daily.time.map((_, i) => ({
    date: daily.time[i],
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
    weatherCode: daily.weather_code[i],
    precipitation: daily.precipitation_sum[i],
    wind: daily.wind_speed_10m_max[i],
  }));

  return (
    <div className="forecast">
      <h3 className="forecast-title">Прогноз на 7 дней</h3>
      <div className="forecast-list">
        {days.map((day, i) => (
          <div key={day.date} className={`forecast-card ${i === 0 ? 'today' : ''}`}>
            <div className="forecast-day">
              {i === 0 ? 'Сегодня' : formatDay(day.date)}
            </div>
            <div className="forecast-date">{formatDate(day.date)}</div>
            <div className="forecast-icon">
              <WeatherIcon code={day.weatherCode} size={28} />
            </div>
            <div className="forecast-desc">
              {getWeatherDescription(day.weatherCode)}
            </div>
            <div className="forecast-temps">
              <span className="forecast-max">{Math.round(day.max)}°</span>
              <span className="forecast-min">{Math.round(day.min)}°</span>
            </div>
            <div className="forecast-extras">
              <span><Droplets size={12} /> {day.precipitation?.toFixed(1)} мм</span>
              <span><Wind size={12} /> {Math.round(day.wind)} км/ч</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDay(isoDate) {
  const date = new Date(isoDate + 'T12:00:00');
  return date.toLocaleDateString('ru-RU', { weekday: 'short' });
}

function formatDate(isoDate) {
  const date = new Date(isoDate + 'T12:00:00');
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
