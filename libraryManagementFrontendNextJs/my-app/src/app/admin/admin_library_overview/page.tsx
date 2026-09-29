import LibraryOverviewView from './admin_library_overview_components/LibraryOverviewView';

export const metadata = {
  title: 'Library Overview | Admin | Library Management System',
  description: 'Manage library information, rules, and subscription details.',
};

export default function AdminLibraryOverviewPage() {
  return (
    <div className="w-full min-w-0">
      <LibraryOverviewView />
    </div>
  );
}
