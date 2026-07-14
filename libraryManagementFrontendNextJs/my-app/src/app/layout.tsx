import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ManagerRoute } from "@/app/manager/ManagerRoute";
import { AdminRoute } from "@/app/admin/AdminRoute";
import { FinanceRoute } from "@/app/finance/FinanceRoute";
import { SuperadminRoute } from "@/app/superadmin/SuperadminRoute";
import { EngagementRoute } from "@/app/engagement/EngagementRoute";
import { SystemRoute } from "@/app/system/SystemRoute";
import { CrmRoute } from "@/app/crm/CrmRoute";
import { AccountingRoute } from "@/app/accounting/AccountingRoute";
import { CommunicationRoute } from "@/app/communication/CommunicationRoute";
import { SeatsRoute } from "@/app/seats_shifts_lockers/SeatsRoute";
import { AuthRoute } from "@/app/auth/AuthRoute";

export const metadata: Metadata = {
  title: "Nexus 360",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-background text-on-background" suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <ManagerRoute>
            <AdminRoute>
              <FinanceRoute>
                <SuperadminRoute>
                  <EngagementRoute>
                    <SystemRoute>
                      <CrmRoute>
                        <AccountingRoute>
                          <CommunicationRoute>
                            <SeatsRoute>
                              <AuthRoute>
                                {children}
                              </AuthRoute>
                            </SeatsRoute>
                          </CommunicationRoute>
                        </AccountingRoute>
                      </CrmRoute>
                    </SystemRoute>
                  </EngagementRoute>
                </SuperadminRoute>
              </FinanceRoute>
            </AdminRoute>
          </ManagerRoute>
        </ThemeProvider>
      </body>
    </html>
  );
}
