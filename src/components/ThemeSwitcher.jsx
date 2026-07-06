import { Moon, Sun, Leaf } from 'lucide-react';

const themes = [
  { id: 'dark', icon: Moon, label: 'Тёмная' },
  { id: 'green', icon: Leaf, label: 'Зелёная' },
  { id: 'light', icon: Sun, label: 'Светлая' },
];

export default function ThemeSwitcher({ theme, onThemeChange }) {
  return (
    <div className="theme-switcher">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            className={`theme-btn ${isActive ? 'active' : ''}`}
            onClick={() => onThemeChange(t.id)}
            title={t.label}
            aria-label={t.label}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
