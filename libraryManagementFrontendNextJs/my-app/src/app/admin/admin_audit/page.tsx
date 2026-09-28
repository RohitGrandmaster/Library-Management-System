import AuditView from './admin_audit_components/AuditView';

export const metadata = {
  title: 'Library Audit Logs | Admin | Library Management System',
  description: 'View and track all library activities, manager actions, and system changes.',
};

export default function AdminAuditPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <AuditView />
    </div>
  );
}
