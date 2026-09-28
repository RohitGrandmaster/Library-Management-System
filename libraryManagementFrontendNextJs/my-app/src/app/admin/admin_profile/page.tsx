import ProfileView from './admin_profile_components/ProfileView';

export const metadata = {
  title: 'My Profile | Admin | Library Management System',
  description: 'Manage your personal details, security settings, and active devices.',
};

export default function AdminProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <ProfileView />
    </div>
  );
}
