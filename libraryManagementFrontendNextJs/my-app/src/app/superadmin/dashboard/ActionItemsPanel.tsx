import Link from 'next/link';
import { AlertTriangle, CreditCard, Headphones, CloudUpload, ChevronRight, Lightbulb, ExternalLink } from 'lucide-react';

interface Props { data: any[]; }

const ICON_MAP: Record<string, React.ElementType> = {
  warning:         AlertTriangle,
  credit_card_off: CreditCard,
  support_agent:   Headphones,
  cloud_upload:    CloudUpload,
};

const ACTION_LINKS: Record<string, string> = {
  'warning':         '/superadmin/libraries',
  'credit_card_off': '/superadmin/subscriptions',
  'support_agent':   '/superadmin/support-tickets',
  'cloud_upload':    '/superadmin/system-health',
};

export default function ActionItemsPanel({ data }: Props) {
  return (
    <div className="col-span-12 lg:col-span-5 sa-card flex flex-col overflow-hidden">
      <div className="p-6 border-b border-[var(--border)]">
        <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Action Items</h2>
      </div>

      <div className="p-6 space-y-3">
        {data.map((item, i) => {
          const isError = item.type === 'error';
          const Icon = ICON_MAP[item.icon] ?? AlertTriangle;
          const href = ACTION_LINKS[item.icon] ?? '/superadmin/dashboard';
          return (
            <Link key={i} href={href}
              className={`sa-action-row ${isError ? 'sa-action-row--error' : 'sa-action-row--info'}`}>
              <div className="flex items-center gap-3">
                <Icon size={16} className={isError ? 'sa-metric--danger' : 'sa-metric--info'} />
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">{item.text}</span>
              </div>
              <ChevronRight size={15} className="sa-metric--muted" />
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-6 border-t border-[var(--border)]">
        <div className="flex items-start gap-3 mb-4">
          <div className="sa-lightbulb-box">
            <Lightbulb size={14} className="sa-metric--primary" />
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            5 newly registered libraries are yet to complete their initial setup wizard.
          </p>
        </div>
        <Link href="/superadmin/libraries" className="sa-panel-view-all">
          <ExternalLink size={13} /> View All Activities
        </Link>
      </div>
    </div>
  );
}
