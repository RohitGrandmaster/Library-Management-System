'use client';
import { useState } from 'react';
import { Database, Server, Globe, RefreshCw } from 'lucide-react';

// Colour class map — maps a CSS var string key to a CSS class
// This replaces all inline style={{ color }} and style={{ backgroundColor }}
type ColourKey = 'success' | 'info' | 'warning' | 'danger';

const COLOR_TEXT_CLS: Record<ColourKey, string> = {
  success: 'sa-metric--success',
  info:    'sa-metric--info',
  warning: 'sa-metric--warning',
  danger:  'sa-metric--danger',
};

const COLOR_FILL_CLS: Record<ColourKey, string> = {
  success: 'sa-progress-fill--dynamic-success',
  info:    'sa-progress-fill--dynamic-info',
  warning: 'sa-progress-fill--dynamic-warning',
  danger:  'sa-progress-fill--danger',
};

const BASE_INFRA: Array<{ label: string; sub: string; val: string; pct: number; colorKey: ColourKey }> = [
  { label: 'Web Servers',                  sub: '4 Nodes (aws-ap-south-1)',  val: 'Healthy (99.99%)', pct: 100, colorKey: 'success' },
  { label: 'API Latency (REST + GraphQL)', sub: 'Average P95 Delay',         val: '45ms',             pct: 25,  colorKey: 'info' },
];

const BASE_DB: Array<{ label: string; sub: string; val: string; pct: number; colorKey: ColourKey }> = [
  { label: 'Postgres Primary Cluster', sub: 'Read/Write Ops',    val: 'Operational',  pct: 100, colorKey: 'success' },
  { label: 'Redis Caching Servers',    sub: 'Memory Allocation', val: '78% Utilized', pct: 78,  colorKey: 'warning' },
];

const GATEWAYS = [
  { n: 'WhatsApp Cloud API', st: 'Connected',  dotCls: 'sa-status-dot--success' },
  { n: 'Razorpay Gateway',   st: 'Connected',  dotCls: 'sa-status-dot--success' },
  { n: 'AWS S3 Backups',     st: 'Syncing...', dotCls: 'sa-status-dot--info' },
];

function MetricRow({
  label, sub, val, pct, colorKey,
}: { label: string; sub: string; val: string; pct: number; colorKey: ColourKey }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-[13px] font-medium text-primary">{label}</p>
          <p className="text-[11px] text-secondary">{sub}</p>
        </div>
        {/* ✅ No inline style. colorKey drives className */}
        <span className={`text-[13px] font-bold ${COLOR_TEXT_CLS[colorKey]}`}>{val}</span>
      </div>
      <div className="sa-progress-track">
        {/* ✅ Only dynamic width stays in style — that's Rule 3 allowed */}
        <div className={COLOR_FILL_CLS[colorKey]} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SystemHealthPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('Just now');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  return (
    <>
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>System Health</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="sa-page-title">Component Status Dashboard</h1>
          <button className="sa-btn-ghost sa-btn-ghost--sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : `Refresh · ${lastRefresh}`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="sa-card p-6">
          <h2 className="text-[14px] font-bold text-primary mb-6 flex items-center gap-2">
            <Server size={16} className="sa-metric--primary" /> Main Infrastructure
          </h2>
          <div className="space-y-6">
            {BASE_INFRA.map(m => <MetricRow key={m.label} {...m} />)}
          </div>
        </div>

        <div className="sa-card p-6">
          <h2 className="text-[14px] font-bold text-primary mb-6 flex items-center gap-2">
            <Database size={16} className="sa-metric--warning" /> Databases & Cache
          </h2>
          <div className="space-y-6">
            {BASE_DB.map(m => <MetricRow key={m.label} {...m} />)}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 sa-card p-6">
          <h2 className="text-[14px] font-bold text-primary mb-5 flex items-center gap-2">
            <Globe size={16} className="sa-metric--primary" /> External Gateways
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GATEWAYS.map(s => (
              <div key={s.n} className="sa-gateway-card">
                <div className={`sa-status-dot ${s.dotCls}`} />
                <div>
                  <p className="sa-gateway-name">{s.n}</p>
                  <p className="sa-gateway-status">{s.st}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
