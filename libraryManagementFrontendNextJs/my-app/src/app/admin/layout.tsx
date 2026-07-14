import { AdminRoute } from "./AdminRoute";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminRoute>{children}</AdminRoute>;
}
