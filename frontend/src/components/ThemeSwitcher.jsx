import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeSwitcher({ compact = false }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const options = [
    { value: 'light', icon: Sun, label: t('theme.light', 'Light') },
    { value: 'dark', icon: Moon, label: t('theme.dark', 'Dark') },
    { value: 'system', icon: Laptop, label: t('theme.system', 'System') },
  ];

  if (compact) {
    // Single cycle icon button for compact navigation spaces
    const currentOpt = options.find(o => o.value === theme) || options[2];
    const Icon = resolvedTheme === 'dark' ? Moon : Sun;

    return (
      <button
        type="button"
        onClick={() => {
          if (theme === 'light') setTheme('dark');
          else if (theme === 'dark') setTheme('system');
          else setTheme('light');
        }}
        title={`Theme: ${currentOpt.label} (Click to toggle)`}
        aria-label={`Current theme is ${currentOpt.label}. Click to cycle light, dark, and system themes.`}
        className="p-2 rounded-xl border border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-teal dark:text-ivory hover:bg-beige/40 dark:hover:bg-charcoal-700 transition-colors shadow-xs"
      >
        <Icon className="w-4 h-4 text-terracotta dark:text-amber-300" />
      </button>
    );
  }

  return (
    <div 
      className="inline-flex items-center p-1 rounded-2xl bg-sand-100 dark:bg-charcoal-800 border border-beige dark:border-charcoal-600 shadow-xs"
      role="radiogroup"
      aria-label="Color theme selection"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setTheme(opt.value)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isSelected
                ? 'bg-white dark:bg-charcoal-700 text-teal dark:text-ivory shadow-xs ring-1 ring-beige dark:ring-charcoal-600'
                : 'text-greygreen dark:text-ivory/60 hover:text-teal dark:hover:text-ivory'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-terracotta dark:text-amber-300' : ''}`} />
            <span className="hidden sm:inline font-heading">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
