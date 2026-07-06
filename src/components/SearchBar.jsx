import { Search, MapPin, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { searchCity } from '../api/weather';

export default function SearchBar({ onSelectCity, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const handleSearch = useCallback(async (q) => {
    if (q.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const cities = await searchCity(q);
      setResults(cities);
      setShowDropdown(cities.length > 0);
      if (cities.length === 0) setError('Город не найден');
    } catch (err) {
      setError('Ошибка поиска. Проверьте подключение.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(query), 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, handleSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectCity(city) {
    setQuery(`${city.name}, ${city.country}`);
    setShowDropdown(false);
    setResults([]);
    onSelectCity({ name: city.name, country: city.country, lat: city.lat, lon: city.lon });
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') setShowDropdown(false);
  }

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="search-input-group">
        <Search className="search-icon" size={20} />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Поиск города..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />
        {loading && <Loader2 className="search-spinner" size={20} />}
      </div>

      {error && <div className="search-error">{error}</div>}

      {showDropdown && results.length > 0 && (
        <ul className="search-dropdown">
          {results.map((city) => (
            <li key={city.id} className="search-result-item" onClick={() => selectCity(city)}>
              <MapPin size={16} className="result-pin" />
              <div className="result-info">
                <span className="result-name">{city.name}</span>
                <span className="result-region">
                  {city.region ? `${city.region}, ` : ''}{city.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
