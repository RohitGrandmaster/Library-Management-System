import SettingsView from './admin_settings_components/SettingsView';

export const metadata = {
  title: 'Library Settings | Admin | Library Management System',
  description: 'Complete configuration center for library rules, fines, circulation, and working hours.',
};

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <SettingsView />
    </div>
  );
}
