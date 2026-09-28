import CirculationView from './admin_circulation_components/CirculationView';

export const metadata = {
  title: 'Circulation Desk | Admin | Library Management System',
  description: 'Manage book issues, returns, renewals, and branch transfers.',
};

export default function AdminCirculationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <CirculationView />
    </div>
  );
}
