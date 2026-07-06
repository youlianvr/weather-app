import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudFog, CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudLightning } from 'lucide-react';
import { getWeatherIconName } from '../api/weather';

const iconMap = {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudFog,
  CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudLightning,
};

export default function WeatherIcon({ code, isDay = true, size = 48, className = '' }) {
  const iconName = getWeatherIconName(code, isDay);
  const Icon = iconMap[iconName] || Cloud;
  return <Icon size={size} className={`weather-icon ${className}`} />;
}
