import SupportView from './admin_support_components/SupportView';

export const metadata = {
  title: 'Help & Support | Admin | Library Management System',
  description: 'Communicate with Platform Support, raise tickets, and check system status.',
};

export default function AdminSupportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <SupportView />
    </div>
  );
}
