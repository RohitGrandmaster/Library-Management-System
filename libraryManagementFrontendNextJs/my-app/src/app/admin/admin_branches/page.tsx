import BranchManagementView from './admin_branches_components/BranchManagementView';

export const metadata = {
  title: 'Branch Management | Admin | Library Management System',
  description: 'Manage all library branches, managers, and branch-specific settings.',
};

export default function AdminBranchesPage() {
  return (
    <div className="w-full min-w-0">
      <BranchManagementView />
    </div>
  );
}
