import ReportsView from './admin_reports_components/ReportsView';

export const metadata = {
  title: 'Reports & Analytics | Admin | Library Management System',
  description: 'View library statistics, generate custom reports, and export data.',
};

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <ReportsView />
    </div>
  );
}
