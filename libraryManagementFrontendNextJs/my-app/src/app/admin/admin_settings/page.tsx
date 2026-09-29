import SettingsView from './admin_settings_components/SettingsView';

export const metadata = {
  title: 'Library Settings | Admin | Library Management System',
  description: 'Complete configuration center for library rules, fines, circulation, and working hours.',
};

export default function AdminSettingsPage() {
  return (
    <div className="w-full min-w-0">
      <SettingsView />
    </div>
  );
}
