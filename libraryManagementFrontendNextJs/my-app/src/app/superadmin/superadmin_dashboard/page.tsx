import KpiCard from '@/app/superadmin/superadmin_dashboard/KpiCard';
import SystemHealthPanel from '@/app/superadmin/superadmin_dashboard/SystemHealthPanel';
import ActionItemsPanel from '@/app/superadmin/superadmin_dashboard/ActionItemsPanel';
import RecentLibrariesTable from '@/app/superadmin/superadmin_dashboard/RecentLibrariesTable';
import DashboardOverview from '@/app/superadmin/superadmin_dashboard/DashboardOverview';
import DashboardAnalytics from '@/app/superadmin/superadmin_dashboard/DashboardAnalytics';
import QuickActions from '@/app/superadmin/superadmin_dashboard/QuickActions';
import RecentActivityFeed from '@/app/superadmin/superadmin_dashboard/RecentActivityFeed';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { fetchDashboardData } from '@/app/superadmin/superadmin_dashboard/dashboard_service';
import type { DashboardKpiCard } from '@/app/superadmin/superadmin_dashboard/superadmin_dashboard_types';

export default async function SuperAdminDashboardPage() {
  const data = await fetchDashboardData();
  
  if (!data) return <div>Failed to load dashboard</div>;

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 mb-6">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>Command Center</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="sa-page-title">SuperAdmin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Global platform overview and control center.</p>
          </div>
          <Link href="/superadmin/superadmin_audit-logs" className="sa-btn-ghost sa-btn-ghost--sm">
            <Activity size={14} /> Global Audit Logs
          </Link>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <QuickActions />

      {/* Main KPI Overview (The 23+ Metrics) */}
      <div className="mt-8 mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platform Overview</h2>
        <DashboardOverview />
      </div>

      {/* Analytics & Trends (Charts) */}
      <div className="mt-8 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Dashboard Analytics</h2>
        <DashboardAnalytics />
      </div>

      {/* Legacy/API KPI Cards (Keeping as requested not to delete) */}
      {data.kpiCards && data.kpiCards.length > 0 && (
        <div className="mt-8 mb-8">
           <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Live API Metrics</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {data.kpiCards.map((card: DashboardKpiCard, i: number) => (
               <KpiCard key={i} {...card} />
             ))}
           </div>
        </div>
      )}

      {/* System Health + Action Items */}
      <div className="grid grid-cols-12 gap-8 mb-8">
        <SystemHealthPanel data={data.systemHealth} />
        <ActionItemsPanel data={data.actionItems || []} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
        {/* Row 3: Libraries Table (Spans 2 columns) */}
        <div className="xl:col-span-2">
           <RecentLibrariesTable data={data.recentLibraries || []} />
        </div>
        
        {/* Row 4: Recent Platform Activity (Spans 1 column) */}
        <div className="xl:col-span-1">
           <RecentActivityFeed />
        </div>
      </div>
    </>
  );
}
