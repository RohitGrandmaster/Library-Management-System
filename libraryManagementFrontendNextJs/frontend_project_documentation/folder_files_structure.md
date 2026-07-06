---

### 📂 The Complete Feature-Based Architecture (`src/app/` Directory)

#### 🌐 Route Layer: `src/app/`
*(Each route group is self-contained — `page.tsx` + co-located components + optional `reusable/` folder.)*

> **Rule:** Every file lives in the route group that **owns that feature**. No cross-domain files.

```text
src/app/
├── layout.tsx                              # Root layout — html, body, global CSS, fonts [REQUIRED]
├── page.tsx                                # Root → redirects to /dashboard or /login
├── globals.css                             # Global stylesheet
├── sa-components.css                       # Reusable superadmin/system component styles
├── favicon.ico                             # App favicon
├── not-found.tsx                           # 404 Page Not Found (Next.js convention)
├── error.tsx                               # 500 Server Error (Next.js convention)
│
│
├── (accounting)/                           # ── ACCOUNTING ── Expenses, assets & P&L reports
│   ├── layout.tsx                          # Accounting layout 
│   ├── AccountingRoute.tsx                 # Accounting Route Shell
│   ├── asset-maintenance/
│   │   └── page.tsx                        # Route: /asset-maintenance
│   ├── assets/
│   │   └── page.tsx                        # Route: /assets
│   ├── daily-settlement/
│   │   └── page.tsx                        # Route: /daily-settlement
│   ├── expense-categories/
│   │   └── page.tsx                        # Route: /expense-categories
│   ├── expenses/
│   │   ├── page.tsx                        # Route: /expenses
│   │   └── add/
│   │       └── page.tsx                    # Route: /expenses/add
│   ├── financial-reports/
│   │   └── page.tsx                        # Route: /financial-reports
│   ├── seat-gap-report/
│   │   └── page.tsx                        # Route: /seat-gap-report
│   └── shift-gap-analyzer/
│       └── page.tsx                        # Route: /shift-gap-analyzer
│
│
├── (admin)/                                # ── ADMIN ── Dashboard, reports & library configuration
│   ├── layout.tsx
│   ├── AdminRoute.tsx                      # Admin Route Shell
│   ├── admin.css
│   └── admin/
│       ├── layout.tsx
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── audit-logs/
│       │   └── page.tsx                    # Route: /admin/audit-logs
│       ├── blacklist/
│       │   └── page.tsx                    # Route: /admin/blacklist
│       ├── branches/
│       │   └── page.tsx                    # Route: /admin/branches
│       ├── coupons/
│       │   └── page.tsx                    # Route: /admin/coupons
│       ├── dashboard/
│       │   ├── page.tsx                    # Route: /admin/dashboard
│       │   └── hardcoded.json
│       ├── permissions/
│       │   └── page.tsx                    # Route: /admin/permissions
│       ├── plans/
│       │   └── page.tsx                    # Route: /admin/plans
│       ├── reports/
│       │   ├── page.tsx                    # Route: /admin/reports
│       │   └── hardcoded.json
│       ├── reusable/
│       │   ├── ActionItemsList.tsx
│       │   ├── ChartCard.tsx
│       │   ├── gridTheme.ts
│       │   ├── KpiCard.tsx
│       │   ├── RecentPaymentsFeed.tsx
│       │   ├── SeatCell.tsx
│       │   └── SeatMatrixGrid.tsx
│       └── staff-users/
│           └── page.tsx                    # Route: /admin/staff-users
│
│
├── (auth)/                                 # ── AUTHENTICATION ── Login, signup, password reset
│   ├── layout.tsx
│   ├── AuthRoute.tsx                       # Auth Route Shell
│   ├── auth.css
│   ├── hardcoded.json
│   └── auth/
│       ├── enquiry/
│       │   └── page.tsx                    # Route: /auth/enquiry (Public access)
│       ├── forgot-password/
│       │   ├── page.tsx                    # Route: /auth/forgot-password
│       │   └── ForgotForm.tsx
│       ├── login/
│       │   ├── page.tsx                    # Route: /auth/login
│       │   └── LoginForm.tsx
│       ├── reset-password/
│       │   ├── page.tsx                    # Route: /auth/reset-password
│       │   └── ResetForm.tsx
│       ├── reusable/
│       │   ├── PasswordStrengthMeter.tsx
│       │   └── schema.ts
│       └── signup/
│           ├── page.tsx                    # Route: /auth/signup
│           └── SignupForm.tsx
│
│
├── (communication)/                        # ── COMMUNICATION ── Notices, complaints, WhatsApp
│   ├── layout.tsx
│   ├── CommunicationRoute.tsx              # Communication Route Shell
│   ├── communication.css
│   └── communication/
│       ├── complaints/
│       │   └── page.tsx                    # Route: /communication/complaints
│       ├── notices/
│       │   └── page.tsx                    # Route: /communication/notices
│       ├── notification-center/
│       │   └── page.tsx                    # Route: /communication/notification-center
│       ├── whatsapp-logs/
│       │   └── page.tsx                    # Route: /communication/whatsapp-logs
│       └── whatsapp-templates/
│           └── page.tsx                    # Route: /communication/whatsapp-templates
│
│
├── (crm)/                                  # ── CRM ── Enquiry & Lead Management
│   ├── layout.tsx
│   ├── CrmRoute.tsx                        # CRM Route Shell
│   ├── crm.css
│   └── crm/
│       ├── layout.tsx
│       ├── enquiries/
│       │   ├── page.tsx                    # Route: /crm/enquiries
│       │   ├── add/
│       │   │   └── page.tsx                # Route: /crm/enquiries/add
│       │   └── [id]/
│       │       └── page.tsx                # Route: /crm/enquiries/[id]
│       └── reusable/
│           ├── hardcoded.json
│           ├── Header.tsx
│           ├── schema.ts
│           ├── Sidebar.tsx
│           └── types.ts
│
│
├── (engagement)/                           # ── ENGAGEMENT ── Attendance & Scanners
│   ├── layout.tsx
│   ├── EngagementRoute.tsx                 # Engagement Route Shell
│   ├── engagement.css
│   └── engagement/
│       ├── absentee-report/
│       │   └── page.tsx                    # Route: /engagement/absentee-report
│       ├── attendance/
│       │   └── page.tsx                    # Route: /engagement/attendance
│       ├── holiday-calendar/
│       │   └── page.tsx                    # Route: /engagement/holiday-calendar
│       └── qr-scanner/
│           └── page.tsx                    # Route: /engagement/qr-scanner
│
│
├── (finance)/                              # ── FINANCE ── Fees, payments & subscriptions
│   ├── layout.tsx
│   ├── FinanceRoute.tsx                    # Finance Route Shell
│   ├── finance.css
│   └── finance/
│       ├── auto-suspend/
│       │   └── page.tsx                    # Route: /finance/auto-suspend
│       ├── collect-fee/
│       │   └── page.tsx                    # Route: /finance/collect-fee
│       ├── components/
│       │   ├── layout/
│       │   └── ui/hooks/
│       ├── finance-dashboard/
│       │   └── page.tsx                    # Route: /finance/finance-dashboard
│       ├── invoice/
│       │   ├── page.tsx                    # Route: /finance/invoice
│       │   └── [id]/
│       │       └── page.tsx                # Route: /finance/invoice/[id]
│       ├── late-fees/
│       │   └── page.tsx                    # Route: /finance/late-fees
│       ├── lib/
│       │   └── format.ts                   # Formatting utilities isolated for finance
│       ├── payment-promises/
│       │   └── page.tsx                    # Route: /finance/payment-promises
│       ├── payments/
│       │   └── page.tsx                    # Route: /finance/payments
│       ├── receipt/
│       │   ├── page.tsx                    # Route: /finance/receipt
│       │   └── [id]/
│       │       └── page.tsx                # Route: /finance/receipt/[id]
│       ├── referrals/
│       │   └── page.tsx                    # Route: /finance/referrals
│       ├── refunds/
│       │   └── page.tsx                    # Route: /finance/refunds
│       ├── renewals/
│       │   └── page.tsx                    # Route: /finance/renewals
│       ├── reusable/
│       │   └── gridTheme.ts                # AG Grid theme for finance domain
│       ├── security-deposits/
│       │   └── page.tsx                    # Route: /finance/security-deposits
│       ├── subscriptions/
│       │   └── page.tsx                    # Route: /finance/subscriptions
│       └── trust-score/
│           └── page.tsx                    # Route: /finance/trust-score
│
│
├── (manager)/                              # ── MANAGER ── Student lifecycle, admission, reports
│   ├── layout.tsx
│   ├── ManagerRoute.tsx                    # Manager Route Shell
│   ├── documents/
│   │   └── page.tsx                        # Route: /documents
│   ├── student-dashboard/
│   │   ├── page.tsx                        # Route: /student-dashboard
│   │   ├── layout.tsx
│   │   ├── sidebar.tsx
│   │   └── hardcoded.json
│   ├── student-reports/
│   │   └── page.tsx                        # Route: /student-reports
│   └── students/
│       ├── page.tsx                        # Route: /students
│       ├── hardcoded.json
│       ├── alumni/
│       │   └── page.tsx                    # Route: /students/alumni
│       ├── exit/
│       │   └── page.tsx                    # Route: /students/exit
│       ├── group/
│       │   └── page.tsx                    # Route: /students/group
│       ├── id-card/
│       │   └── page.tsx                    # Route: /students/id-card
│       ├── new/
│       │   ├── page.tsx                    # Route: /students/new
│       │   └── AdmissionForm.tsx
│       ├── referrals/
│       │   └── page.tsx                    # Route: /students/referrals
│       └── [id]/
│           ├── page.tsx                    # Route: /students/[id]
│           └── edit/
│               └── page.tsx                # Route: /students/[id]/edit
│
│
├── (seats_shifts_lockers)/                 # ── SEATS, SHIFTS, LOCKERS ── Core inventory mapping
│   ├── layout.tsx
│   ├── SeatsRoute.tsx                      # Seats/Lockers Route Shell
│   ├── seat_shift.css
│   └── seats_shifts_lockers/
│       ├── allocations/
│       │   └── page.tsx                    # Route: /seats_shifts_lockers/allocations
│       ├── locker-matrix/
│       │   └── page.tsx                    # Route: /seats_shifts_lockers/locker-matrix
│       ├── lockers/
│       │   └── page.tsx                    # Route: /seats_shifts_lockers/lockers
│       ├── reusable/
│       │   └── gridTheme.ts
│       ├── seat-history/
│       │   └── page.tsx                    # Route: /seats_shifts_lockers/seat-history
│       ├── seat-management/
│       │   ├── page.tsx                    # Route: /seats_shifts_lockers/seat-management
│       │   └── maintenance/
│       │       └── page.tsx                # Route: /seats_shifts_lockers/seat-management/maintenance
│       ├── seat-matrix/
│       │   └── page.tsx                    # Route: /seats_shifts_lockers/seat-matrix
│       ├── shift-gap/
│       │   └── page.tsx                    # Route: /seats_shifts_lockers/shift-gap
│       ├── shift-management/
│       │   └── page.tsx                    # Route: /seats_shifts_lockers/shift-management
│       └── shift-migration/
│           └── page.tsx                    # Route: /seats_shifts_lockers/shift-migration
│
│
├── (superadmin)/                           # ── SUPER-ADMIN ── Multi-branch config & onboarding
│   ├── layout.tsx
│   ├── SuperadminRoute.tsx                 # Superadmin Route Shell
│   ├── superadmin.css
│   └── superadmin/
│       ├── layout.tsx
│       ├── hardcoded.json
│       ├── audit-logs/
│       │   └── page.tsx                    # Route: /superadmin/audit-logs
│       ├── billing/
│       │   └── page.tsx                    # Route: /superadmin/billing
│       ├── dashboard/
│       │   ├── page.tsx                    # Route: /superadmin/dashboard
│       │   ├── hardcoded.json
│       │   ├── Layout.tsx
│       │   ├── Header.tsx
│       │   ├── Sidebar.tsx
│       │   ├── ActionItemsPanel.tsx
│       │   ├── KpiCard.tsx
│       │   ├── RecentLibrariesTable.tsx
│       │   └── SystemHealthPanel.tsx
│       ├── libraries/
│       │   └── page.tsx                    # Route: /superadmin/libraries
│       ├── reports/
│       │   └── page.tsx                    # Route: /superadmin/reports
│       ├── reusable/
│       │   ├── gridTheme.ts
│       │   └── schema.ts
│       ├── settings/
│       │   └── page.tsx                    # Route: /superadmin/settings
│       ├── setup-wizard/
│       │   └── page.tsx                    # Route: /superadmin/setup-wizard
│       ├── subscriptions/
│       │   └── page.tsx                    # Route: /superadmin/subscriptions
│       ├── support-tickets/
│       │   └── page.tsx                    # Route: /superadmin/support-tickets
│       └── system-health/
│           └── page.tsx                    # Route: /superadmin/system-health
│
│
├── (system)/                               # ── SYSTEM ── Settings, utilities & automation
│   ├── layout.tsx
│   ├── SystemRoute.tsx                     # System Route Shell
│   ├── system.css
│   └── system/
│       ├── auto-scale/
│       │   └── page.tsx                    # Route: /system/auto-scale
│       ├── backups/
│       │   └── page.tsx                    # Route: /system/backups
│       ├── branding/
│       │   └── page.tsx                    # Route: /system/branding
│       ├── bulk-import/
│       │   └── page.tsx                    # Route: /system/bulk-import
│       ├── data-export/
│       │   └── page.tsx                    # Route: /system/data-export
│       ├── gap-filling/
│       │   └── page.tsx                    # Route: /system/gap-filling
│       ├── maintenance/
│       │   └── page.tsx                    # Route: /system/maintenance
│       ├── offline/
│       │   └── page.tsx                    # Route: /system/offline
│       ├── power-saving/
│       │   └── page.tsx                    # Route: /system/power-saving
│       ├── profile/
│       │   └── page.tsx                    # Route: /system/profile
│       ├── settings/
│       │   └── page.tsx                    # Route: /system/settings
│       ├── smart-id/
│       │   └── page.tsx                    # Route: /system/smart-id
│       ├── waitlist-automation/
│       │   └── page.tsx                    # Route: /system/waitlist-automation
│       ├── whatsapp-integration/
│       │   └── page.tsx                    # Route: /system/whatsapp-integration
│       └── reusable/
│           ├── Badge.tsx, Button.tsx, Card.tsx, Dialog.tsx, Input.tsx, KpiCard.tsx, Label.tsx, Progress.tsx, Select.tsx, Switch.tsx, Tabs.tsx, Textarea.tsx, utils.ts
│
│
└── test/                                   # ── DEV ONLY ── Sandbox UI Environment
    └── Page.tsx                            # Route: /test
```

---

### 🔄 Change Log — Current Architecture Alignment

| Route Group | Module Change | Reason |
|---|---|---|
| `(Seats & Shifts)` | Renamed to `(seats_shifts_lockers)` | Unified alignment with its actual root path directory nomenclature. |
| `(public)` | Removed / Rehomed | The `/enquiry` walk-in form was moved to `(auth)/auth/enquiry`. The `/offline` PWA fallback was moved to `(system)/system/offline`. No standalone public module required. |
| `(communication)` | Separated from `(engagement)` | Pulled out into its standalone routing domain with its own `CommunicationRoute.tsx` shell, separating core Engagement scanning functions from WhatsApp/Broadcast notification concerns. |

---

### 📐 Feature Domain Ownership Rules

Each route group serves a **single concern**. Any new page should be nested strictly according to its primary domain workflow:

| Domain | Owns |
|---|---|
| `(accounting)` | App-level accounting metrics: Expenses, P&L, assets, gap reports, and daily settlement logs. |
| `(admin)` | Sub-system administration covering Dashboard, analytics reports, plans, coupons, staff RBAC, and audit logs. |
| `(auth)` | **Login, signup, password resets, and public enquiry form processing ONLY.** |
| `(communication)` | Dedicated notification domains including warnings, WhatsApp templates, logs, and complaint boards. |
| `(crm)` | Lead pipelines, open enquiries, lead follow-ups, and prospective client conversion logic. |
| `(engagement)` | Internal footprint monitoring like manual attendance, QR scanning, absentee logging, and calendar events. |
| `(finance)` | Core commercial workflows: Fees, payments, automated invoices, subscription tracking, refunds, and trust score processing. |
| `(manager)` | Student lifecycle operations: Admission handling, profile editing, document vaults, ID card generating, and alumni reporting. |
| `(seats_shifts_lockers)` | Primary inventory mapping: Visualizing matrix floors, assigning lockers, shifting bookings, managing slot maintenance, and allocating available resources limit states. |
| `(superadmin)` | Platform cockpit view, library onboarding setup flows, branch management and SaaS-level subscriptions / systems health tracking. |
| `(system)` | Base infrastructure modules: Environment settings, UI branding, API configs (e.g., smart-ids, power saving modules, waitlist logic), bulk importer/exporter, and backups. |

---
