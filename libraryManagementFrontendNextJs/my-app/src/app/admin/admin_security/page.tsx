import SecurityView from './admin_security_components/SecurityView';

export const metadata = {
  title: 'Library Security | Admin | Library Management System',
  description: 'Monitor manager sessions, failed logins, and enforce library-level access policies.',
};

export default function AdminSecurityPage() {
  return (
    <div className="w-full min-w-0">
      <SecurityView />
    </div>
  );
}
