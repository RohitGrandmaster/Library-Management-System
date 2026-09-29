import CirculationView from './admin_circulation_components/CirculationView';

export const metadata = {
  title: 'Circulation Desk | Admin | Library Management System',
  description: 'Manage book issues, returns, renewals, and branch transfers.',
};

export default function AdminCirculationPage() {
  return (
    <div className="w-full min-w-0">
      <CirculationView />
    </div>
  );
}
