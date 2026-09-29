import VendorsView from './admin_vendors_components/VendorsView';

export const metadata = {
  title: 'Vendors | Admin | Library Management System',
  description: 'Manage library book suppliers, contacts, and purchase history.',
};

export default function AdminVendorsPage() {
  return (
    <div className="w-full min-w-0">
      <VendorsView />
    </div>
  );
}
