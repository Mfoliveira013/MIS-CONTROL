import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: number;
  progress?: number;
  footer?: ReactNode;
}

export default function KpiCard({
  title, value, subtitle, icon: Icon,
  iconColor = 'text-primary', iconBg = 'bg-primary/10',
  trend, progress, footer,
}: KpiCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-card-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend >= 0
                ? 'text-success bg-success/10'
                : 'text-danger bg-danger/10'
            }`}
          >
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 leading-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {progress !== undefined && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Meta</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {footer && (
        <div className="pt-2 border-t border-border-light dark:border-border-dark text-xs text-slate-500 dark:text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
}
