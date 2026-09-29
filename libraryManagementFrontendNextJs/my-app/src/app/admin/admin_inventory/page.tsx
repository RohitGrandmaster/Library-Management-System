import InventoryView from './admin_inventory_components/InventoryView';

export const metadata = {
  title: 'Inventory | Admin | Library Management System',
  description: 'Manage physical book stock, transfers, verification, and valuation.',
};

export default function AdminInventoryPage() {
  return (
    <div className="w-full min-w-0">
      <InventoryView />
    </div>
  );
}
