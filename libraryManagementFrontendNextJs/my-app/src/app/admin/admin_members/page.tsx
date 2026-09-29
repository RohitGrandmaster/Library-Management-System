import MemberManagementView from './admin_members_components/MemberManagementView';

export const metadata = {
  title: 'Members Management | Admin | Library Management System',
  description: 'Manage all library members, their profiles, memberships, and histories.',
};

export default function AdminMembersPage() {
  return (
    <div className="w-full min-w-0">
      <MemberManagementView />
    </div>
  );
}
