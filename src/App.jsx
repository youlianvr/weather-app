import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import ThemeSwitcher from './components/ThemeSwitcher';
import MusicPlayer from './components/MusicPlayer';
import { getWeather } from './api/weather';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import HourlyPage from './components/HourlyPage';
import Loading from './components/Loading';
import './App.css';

const DEFAULT_CITY = 'Дубно';
const DUBNO = { name: 'Дубно', country: 'Беларусь', lat: 53.442, lon: 24.376 };
const STORAGE_KEY = 'weatherApp_city';
const VERSION_KEY = 'weatherApp_version';
const STORAGE_VERSION = 2;
const THEME_KEY = 'weatherApp_theme';

/** Миграция: очищаем старые сохранённые данные, чтобы использовать Дубно */
function migrateStorage() {
  const version = localStorage.getItem(VERSION_KEY);
  if (Number(version) !== STORAGE_VERSION) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
  }
}

export default function App() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'green';
    } catch {
      return 'green';
    }
  });
  const [city, setCity] = useState(() => {
    migrateStorage();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DUBNO;
    } catch {
      return DUBNO;
    }
  });

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = useCallback(async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const data = await getWeather(lat, lon);
      setWeather(data);
    } catch (err) {
      setError('Не удалось загрузить погоду. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(city.lat, city.lon);
  }, [city, fetchWeather]);

  function selectCity(newCity) {
    setCity(newCity);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCity));
  }

  function handleThemeChange(newTheme) {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation не поддерживается браузером');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCity((prev) => {
          const updated = { ...prev, lat, lon };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      },
      () => setError('Не удалось определить местоположение'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <div className="app" data-theme={theme}>
          <header className="app-header">
            <h1 className="app-title">Погода</h1>
            <p className="app-subtitle">🌍 Прогноз по всему миру</p>
          </header>

          <ThemeSwitcher theme={theme} onThemeChange={handleThemeChange} />
          <MusicPlayer />

          <div className="search-section">
            <SearchBar onSelectCity={selectCity} />
            <button className="geo-btn" onClick={detectLocation} title="Моё местоположение">
              <MapPin size={18} />
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <main className="content">
            {loading ? (
              <Loading />
            ) : weather ? (
              <>
                <div className="city-badge">
                  <MapPin size={16} />
                  {city.name}, {city.country}
                </div>
                <CurrentWeather data={weather} cityName={city.name} onShowHourly={() => navigate('/hourly')} />
                <Forecast daily={weather.daily} />
              </>
            ) : null}
          </main>

          <footer className="app-footer">
            <p>Data: <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo.com</a></p>
          </footer>
        </div>
      } />

      <Route path="/hourly" element={
        <div className="app" data-theme={theme}>
          <HourlyPage city={city} weather={weather} loading={loading} />
        </div>
      } />
    </Routes>
  );
}
