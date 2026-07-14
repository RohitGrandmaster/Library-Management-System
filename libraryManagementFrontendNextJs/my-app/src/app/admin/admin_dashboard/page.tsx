import { cookies } from 'next/headers';
import {
  Users, IndianRupee, Armchair, AlertCircle,
  RotateCcw, Phone, MessageSquare, Handshake, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import KpiCard from '@/app/admin/admin_reusable/KpiCard';
import SeatMatrixGrid from '@/app/admin/admin_reusable/SeatMatrixGrid';
import ActionItemsList, { type ActionItem } from '@/app/admin/admin_reusable/ActionItemsList';
import RecentPaymentsFeed from '@/app/admin/admin_reusable/RecentPaymentsFeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value || '';

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

/**
 * Icon color & background tokens for KPI cards.
 * Values MUST be CSS token strings — no hex allowed in TSX files.
 * These are dynamic values from a data array → style={{}} usage is permitted.
 */
const KPI_META = [
  { icon: Users,       iconColor: 'var(--primary)', iconBg: 'var(--icon-bg-primary)' },
  { icon: IndianRupee, iconColor: 'var(--success)', iconBg: 'var(--icon-bg-success)' },
  { icon: Armchair,    iconColor: 'var(--warning)', iconBg: 'var(--icon-bg-warning)' },
  { icon: AlertCircle, iconColor: 'var(--danger)',  iconBg: 'var(--icon-bg-danger)'  },
] as const;

const ACTION_ICONS: Record<string, any> = {
  'Fee Renewals Due': RotateCcw,
  'New Enquiries':    Phone,
  'Complaint Open':   MessageSquare,
  'PTP Dates Today':  Handshake,
};

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  if (!data) return <div>Failed to load dashboard</div>;

  const actionItems: ActionItem[] = data.actionItems.map((a: any) => ({
    ...a,
    icon: ACTION_ICONS[a.label] ?? AlertCircle,
    type: a.type as 'danger' | 'warning',
  }));

  return (
    <div className="space-y-6 pb-10">

      {/* Breadcrumb + Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Smart Library 360 › Admin › Dashboard</p>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back — here's what's happening today.</p>
        </div>
        <Link href="/admin/admin_reports">
          <Button variant="outline" size="sm">
            View Full Reports <ChevronRight size={14} className="ml-1" />
          </Button>
        </Link>
      </div>

      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpiCards.map((card: any, i: number) => (
          <KpiCard
            key={i}
            label={card.label}
            value={card.value}
            icon={KPI_META[i].icon}
            iconColor={KPI_META[i].iconColor}
            iconBg={KPI_META[i].iconBg}
            trend={card.trend as { value: string; up: boolean }}
            sub={card.sub}
          />
        ))}
      </div>

      {/* Row 2: Seat Matrix (60%) + Action Items (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full">
          <SeatMatrixGrid seats={data.seats as any} shifts={data.shifts} />
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full">
          <Card className="flex flex-col h-full border-[var(--border)] bg-[var(--bg-card)] shadow-none">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base">Action Items</CardTitle>
              <CardDescription className="text-xs">
                {data.actionItems.reduce((s: number, a: any) => s + a.count, 0)} items need your attention
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 flex-1">
              <ActionItemsList items={actionItems} />
            </CardContent>

            <div className="px-4 pb-3">
              <div className="flex items-start gap-2 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-3 rounded-md">
                <span className="text-sm">💡</span>
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                  5 students expire within 7 days. Consider sending renewal reminders via WhatsApp.
                </p>
              </div>
            </div>

            <CardFooter className="pt-2 pb-4 border-t px-4">
              <Button asChild variant="ghost" className="w-full text-xs text-muted-foreground hover:text-[var(--text-primary)]">
                <Link href="/admin/admin_audit-logs">
                  View All Activities <ChevronRight size={13} className="ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Row 3: Recent Payments AG Grid */}
      <RecentPaymentsFeed payments={data.recentPayments as any} />
    </div>
  );
}
