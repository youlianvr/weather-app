import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Droplets, Wind, Thermometer, Sun, Gauge } from 'lucide-react';
import { getWeatherDescription } from '../api/weather';
import WeatherIcon from './WeatherIcon';
import Loading from './Loading';

export default function HourlyPage({ city, weather, loading }) {
  const navigate = useNavigate();

  if (loading) return <Loading />;
  if (!weather || !weather.hourly) {
    return (
      <div className="hourly-error">
        <p>Нет данных почасового прогноза</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> На главную
        </button>
      </div>
    );
  }

  // Берём только сегодняшние часы (первые 24 записи)
  const hourly = weather.hourly;
  const todayHours = hourly.time.map((t, i) => ({
    time: t,
    hour: parseInt(t.split('T')[1].split(':')[0], 10),
    temp: hourly.temperature_2m[i],
    feelsLike: hourly.apparent_temperature[i],
    weatherCode: hourly.weather_code[i],
    precipitation: hourly.precipitation[i],
    precipProb: hourly.precipitation_probability[i],
    wind: hourly.wind_speed_10m[i],
    humidity: hourly.relative_humidity_2m[i],
    uv: hourly.uv_index[i],
    isDay: hourly.is_day[i],
  }));

  // Текущий час — из первого временного слота API (уже в местном времени)
  const now = new Date();
  const currentHour = now.getHours();

  return (
    <div className="hourly-page">
      <div className="hourly-header">
        <button className="hourly-back" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="hourly-title">Почасовой прогноз</h2>
          <p className="hourly-city">{city.name}, {city.country}</p>
        </div>
      </div>

      <div className="hourly-scroll">
        <div className="hourly-list">
          {todayHours.map((h) => {
            const isPast = h.hour < currentHour;
            const isNow = h.hour === currentHour;
            const isFuture = h.hour > currentHour;

            return (
              <div
                key={h.time}
                className={`hourly-card ${isNow ? 'now' : ''} ${isPast ? 'past' : ''}`}
              >
                <div className="hourly-card-time">
                  {isNow ? (
                    <span className="hourly-now-badge">Сейчас</span>
                  ) : (
                    <>
                    <Clock size={12} />
                    {String(h.hour).padStart(2, '0')}:00
                    </>
                  )}
                </div>

                <WeatherIcon code={h.weatherCode} isDay={h.isDay} size={28} />

                <div className="hourly-card-temp">
                  {Math.round(h.temp)}°
                </div>

                <div className="hourly-card-feels">
                  {Math.round(h.feelsLike)}°
                </div>

                <div className="hourly-card-desc">
                  {getWeatherDescription(h.weatherCode)}
                </div>

                <div className="hourly-card-stats">
                  <span title="Осадки">
                    <Droplets size={12} /> {h.precipitation?.toFixed(1)} мм
                  </span>
                  {h.precipProb > 0 && (
                    <span className="precip-prob" title="Вероятность осадков">
                      {Math.round(h.precipProb)}%
                    </span>
                  )}
                  <span title="Ветер">
                    <Wind size={12} /> {Math.round(h.wind)} км/ч
                  </span>
                  <span title="Влажность">
                    <Gauge size={12} /> {Math.round(h.humidity)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
