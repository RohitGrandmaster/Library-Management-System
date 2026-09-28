import CommunicationView from './admin_communication_components/CommunicationView';

export const metadata = {
  title: 'Notifications & Communication | Admin | Library Management System',
  description: 'Manage library announcements, automated triggers, and broadcast messages.',
};

export default function AdminCommunicationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <CommunicationView />
    </div>
  );
}
