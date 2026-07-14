'use client';

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, CalendarCheck, Phone, Armchair, ChevronRight, TrendingUp } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '../manager_reusable/gridTheme';
import { fetchApi } from '@/lib/api';

ModuleRegistry.registerModules([AllCommunityModule]);

const SEAT_CLASS: Record<string, string> = {
  available: 'mgr-seat-available',
  occupied:  'mgr-seat-occupied',
  expiring:  'mgr-seat-expiring',
};

const STATUS_CLASS: Record<string, string> = {
  New:        'mgr-badge--info',
  Visited:    'mgr-badge--warning',
  Interested: 'mgr-badge--primary',
  Converted:  'mgr-badge--success',
  Lost:       'mgr-badge--danger',
};

const QUICK_LINKS = [
  { title: 'All Students',    href: '/manager/manager_students'                 },
  { title: 'Enquiries',       href: '/manager/manager_crm/enquiries'            },
  { title: 'Collect Fee',     href: '/manager/manager_finance/collect-fee'      },
  { title: 'Add Complaint',   href: '/manager/manager_communication/complaints' },
  { title: 'Waitlist',        href: '#'                         },
  { title: 'Mark Attendance', href: '/manager/manager_engagement/attendance'    },
  { title: 'QR Scanner',      href: '/manager/manager_engagement/qr-scanner'    },
  { title: 'My Profile',      href: '#'                         },
];

function SmartIdCell({ value }: { value: string }) {
  return <span className="mgr-table-id">{value}</span>;
}
function ShiftCell({ value }: { value: string }) {
  return <span className="mgr-badge mgr-badge--info">{value}</span>;
}
function StatusCell({ value }: { value: string }) {
  const cls = STATUS_CLASS[value] ?? 'mgr-badge--info';
  return <span className={`mgr-badge ${cls}`}>{value}</span>;
}
function PhoneCell({ value }: { value: string }) {
  return <span className="mgr-text-secondary">{value}</span>;
}

const iconMap: Record<string, React.ElementType> = {
  Users, CalendarCheck, Phone, Armchair,
};

export default function ManagerDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/manager/manager_dashboard')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const admissionCols = useMemo(() => [
    { field: 'name',    headerName: 'NAME',     flex: 2, sortable: true },
    { field: 'smartId', headerName: 'SMART ID', flex: 1, sortable: true, cellRenderer: SmartIdCell },
    { field: 'shift',   headerName: 'SHIFT',    flex: 1, sortable: true, cellRenderer: ShiftCell  },
  ], []);

  const enquiryCols = useMemo(() => [
    { field: 'name',   headerName: 'NAME',   flex: 2, sortable: true },
    { field: 'phone',  headerName: 'PHONE',  flex: 1, cellRenderer: PhoneCell },
    { field: 'status', headerName: 'STATUS', flex: 1, sortable: true, cellRenderer: StatusCell },
  ], []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 20 }}>Failed to load dashboard</div>;

  return (
    <div>
      {/* Page Header */}
      <div className="mgr-page-header">
        <div>
          <p className="mgr-breadcrumb">Manager › Dashboard</p>
          <h1 className="mgr-page-title">Manager Dashboard</h1>
          <p className="mgr-page-subtitle">Good morning, Manager — aaj ka quick overview</p>
        </div>
        <div className="mgr-page-actions">
          <Link href="/manager/manager_reports" className="mgr-btn-ghost mgr-btn-sm">
            <TrendingUp size={14} /> View Reports
          </Link>
        </div>
      </div>

      {/* Row 1 — 4 KPI Cards */}
      <div className="mgr-kpi-grid mgr-section-gap">
        {data.kpiData?.map((kpi: any) => {
          const Icon = iconMap[kpi.icon];
          return (
            <div key={kpi.title} className="mgr-kpi-card">
              <div className="mgr-kpi-top-row">
                <div className={`mgr-kpi-icon ${kpi.iconClass}`}><Icon size={18} /></div>
                <span className="mgr-trend-up">{kpi.trend}</span>
              </div>
              <div>
                <p className="mgr-kpi-label">{kpi.title}</p>
                <p className="mgr-kpi-value">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2 — Seat Matrix (65%) + Action Items (35%) */}
      <div className="mgr-dashboard-row2 mgr-section-gap">

        <div className="mgr-card">
          <div className="mgr-card-header">
            <h2 className="mgr-section-title">Mini Seat Matrix — Today&apos;s Shifts</h2>
          </div>
          <div className="mgr-card-body">
            <div className="mgr-seat-grid">
              {data.seatData?.map((seat: any) => (
                <div
                  key={seat.id}
                  className={`mgr-seat-cell ${SEAT_CLASS[seat.status]}`}
                  onClick={() => router.push(`/manager/manager_students?seat=${seat.id}`)}
                >
                  {seat.id}
                </div>
              ))}
            </div>
            <div className="mgr-seat-legend">
              <div className="mgr-seat-legend-item"><div className="mgr-seat-legend-dot mgr-seat-legend-dot--available" />Available</div>
              <div className="mgr-seat-legend-item"><div className="mgr-seat-legend-dot mgr-seat-legend-dot--occupied" />Occupied</div>
              <div className="mgr-seat-legend-item"><div className="mgr-seat-legend-dot mgr-seat-legend-dot--expiring" />Expiring Soon</div>
            </div>
          </div>
        </div>

        <div className="mgr-card">
          <div className="mgr-card-header">
            <h2 className="mgr-section-title">My Action Items</h2>
          </div>
          <div className="mgr-card-body">
            {data.actionItems?.map((item: any) => (
              <div key={item.title} className="mgr-action-item">
                <span className="mgr-action-label">{item.title}</span>
                <div className="mgr-action-right">
                  <span className={item.countClass}>{item.count}</span>
                  {item.showRenew
                    ? <Link href={item.href} className="mgr-btn-primary mgr-btn-sm">Renew</Link>
                    : <Link href={item.href} className="mgr-action-link">View</Link>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — Recent Activity */}
      <div className="mgr-dashboard-row3 mgr-section-gap">

        <div className="mgr-card">
          <div className="mgr-card-header">
            <h2 className="mgr-section-title">Recent New Admissions</h2>
            <Link href="/manager/manager_students" className="mgr-action-link">View all</Link>
          </div>
          <div style={{ height: 280 }}>
            <AgGridReact
              theme={gridTheme}
              rowData={data.recentAdmissions || []}
              columnDefs={admissionCols as any}
              rowHeight={48}
              headerHeight={38}
              suppressMovableColumns
              suppressCellFocus
              defaultColDef={{ resizable: false }}
            />
          </div>
        </div>

        <div className="mgr-card">
          <div className="mgr-card-header">
            <h2 className="mgr-section-title">Recent Enquiries</h2>
            <Link href="/manager/manager_crm/enquiries" className="mgr-action-link">View all</Link>
          </div>
          <div style={{ height: 280 }}>
            <AgGridReact
              theme={gridTheme}
              rowData={data.recentEnquiries || []}
              columnDefs={enquiryCols as any}
              rowHeight={48}
              headerHeight={38}
              suppressMovableColumns
              suppressCellFocus
              defaultColDef={{ resizable: false }}
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mgr-card">
        <div className="mgr-card-header">
          <h2 className="mgr-section-title">Quick Links</h2>
        </div>
        <div className="mgr-card-body">
          <div className="mgr-quick-links-grid">
            {QUICK_LINKS.map((link) => (
              <Link key={link.title} href={link.href} className="mgr-action-link">
                <ChevronRight size={14} />{link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
