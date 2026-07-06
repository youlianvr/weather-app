import { CloudSun } from 'lucide-react';

export default function Loading() {
  return (
    <div className="loading">
      <CloudSun size={64} className="loading-icon" />
      <p className="loading-text">Загружаем погоду...</p>
    </div>
  );
}
