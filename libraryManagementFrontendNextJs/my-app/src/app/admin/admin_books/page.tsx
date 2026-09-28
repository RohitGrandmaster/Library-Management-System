import BooksCatalogView from './admin_books_components/BooksCatalogView';

export const metadata = {
  title: 'Books & Catalog | Admin | Library Management System',
  description: 'Manage the library catalog, inventory, categories, and physical location of books.',
};

export default function AdminBooksCatalogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <BooksCatalogView />
    </div>
  );
}
