import AcquisitionView from './admin_acquisition_components/AcquisitionView';

export const metadata = {
  title: 'Acquisition | Admin | Library Management System',
  description: 'Manage library purchases, vendor orders, and inventory receiving flow.',
};

export default function AdminAcquisitionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <AcquisitionView />
    </div>
  );
}
