import FinesView from './admin_fines_components/FinesView';

export const metadata = {
  title: 'Fines & Payments | Admin | Library Management System',
  description: 'Manage library fines, collect payments, issue waivers, and track financial transactions.',
};

export default function AdminFinesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <FinesView />
    </div>
  );
}
