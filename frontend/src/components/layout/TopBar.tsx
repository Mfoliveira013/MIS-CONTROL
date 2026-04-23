import { Bell, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/acionamentos': 'Acionamentos',
  '/boletos':      'Boletos',
  '/recuperacoes': 'Recuperações',
  '/acordos':      'Acordos',
  '/devedores':    'Carteira / Devedores',
};

export default function TopBar() {
  const { isDark, toggle } = useTheme();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-20 h-14 flex items-center px-6 gap-4
                       bg-card-light dark:bg-card-dark border-b border-border-light
                       dark:border-border-dark">
      <h1 className="flex-1 text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        {/* Dark/Light Toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500
                     dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700
                     transition-colors"
          aria-label="Alternar tema"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg
                           text-slate-500 dark:text-slate-400 hover:bg-slate-100
                           dark:hover:bg-slate-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border-light dark:border-border-dark">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User size={15} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              Supervisor
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
              Cobrança
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
