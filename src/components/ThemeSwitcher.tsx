import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const themeConfig = {
  dark: { icon: Moon, label: 'Dark', color: 'bg-slate-700' },
  light: { icon: Sun, label: 'Light', color: 'bg-amber-400' },
  cyber: { icon: Sparkles, label: 'Cyber', color: 'bg-purple-500' },
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50">
      {(Object.keys(themeConfig) as Array<keyof typeof themeConfig>).map((t) => {
        const { icon: Icon, label, color } = themeConfig[t];
        const isActive = theme === t;

        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            title={`${label} theme (press T to cycle)`}
          >
            {isActive && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-card rounded-md shadow-sm"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
