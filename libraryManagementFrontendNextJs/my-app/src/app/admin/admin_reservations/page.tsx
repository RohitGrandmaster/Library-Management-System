import ReservationsView from './admin_reservations_components/ReservationsView';

export const metadata = {
  title: 'Reservations | Admin | Library Management System',
  description: 'Manage book reservations, queues, and pickup schedules.',
};

export default function AdminReservationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <ReservationsView />
    </div>
  );
}
