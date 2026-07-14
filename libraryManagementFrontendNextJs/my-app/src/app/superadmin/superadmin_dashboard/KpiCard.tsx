import { TrendingUp, AlertTriangle } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  trend?: string;
  progress?: number;
  alert?: string;
}

const ICON_MAP: Record<string, string> = {
  store:           '🏛️',
  groups:          '👥',
  currency_rupee:  '₹',
  pending_actions: '⏳',
};

export default function KpiCard({ title, value, icon, subtitle, trend, progress, alert }: KpiCardProps) {
  return (
    <div className="sa-kpi-card">
      <div className="flex items-start justify-between">
        <p className="sa-label">{title}</p>
        <span className="text-2xl leading-none">{ICON_MAP[icon] ?? '📊'}</span>
      </div>

      <div>
        <p className="sa-kpi-value">{value}</p>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {trend && (
            <span className="sa-trend-up">
              <TrendingUp size={11} /> {trend}
            </span>
          )}
          {subtitle && <span className="sa-kpi-subtitle">{subtitle}</span>}
          {alert && (
            <span className="sa-trend-alert">
              <AlertTriangle size={11} /> {alert}
            </span>
          )}
          {progress !== undefined && (
            <div className="sa-progress-track w-16">
              <div className="sa-progress-fill--primary" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
