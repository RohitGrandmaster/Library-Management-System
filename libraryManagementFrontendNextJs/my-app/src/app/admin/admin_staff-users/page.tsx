import StaffManagersView from './admin_staff-users_components/StaffManagersView';

export const metadata = {
  title: 'Staff & Managers | Admin | Library Management System',
  description: 'Manage library staff, branch managers, and their access permissions.',
};

export default function AdminStaffManagersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <StaffManagersView />
    </div>
  );
}
