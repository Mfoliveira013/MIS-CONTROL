import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, PhoneCall, FileText, DollarSign,
  Handshake, Users, TrendingUp, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/acionamentos', icon: PhoneCall,        label: 'Acionamentos' },
  { to: '/boletos',      icon: FileText,         label: 'Boletos' },
  { to: '/recuperacoes', icon: DollarSign,       label: 'Recuperações' },
  { to: '/acordos',      icon: Handshake,        label: 'Acordos' },
  { to: '/devedores',    icon: Users,            label: 'Devedores' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative flex flex-col bg-card-light dark:bg-card-dark
        border-r border-border-light dark:border-border-dark
        transition-all duration-300 ease-in-out h-screen sticky top-0
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border-light dark:border-border-dark">
        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <TrendingUp size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Cobrança</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Extrajudicial</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5
               ${isActive
                ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-700
                   border border-border-light dark:border-border-dark rounded-full flex items-center
                   justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors z-10"
        aria-label="Recolher menu"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
