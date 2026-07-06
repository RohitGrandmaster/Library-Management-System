# 🚀 Smart Library 360 — Frontend Development Flow

> **Rule 1:** Har phase complete karo, tabhi agla shuru karo.
> **Rule 2:** Components route group ke andar **co-located** hote hain — koi global `src/modules/` ya `src/components/ui/` nahi hai.
> **Rule 3:** `features.md` ka tech stack follow karo — banned packages ADD MAT KARO.
> **Rule 4:** Har phase ke saath uska **Module file** diya gaya hai — wahan se exact UI specs, fields, layouts, DB models lo.

---

## 📚 Module File → Development Phase Cross-Reference

> **HOW TO USE:** Jab bhi koi phase/step build karo, uske saamne diya hua `module_XX_*.md` file kholo.
> Wahan exact UI layout, fields, button labels, DB models, empty states, modals — sab kuch likha hai.

| Module File | Covers | Dev Phase |
|---|---|---|
| `module_00_superadmin_onboarding.md` ⭐ | **FULL spec:** `setup-wizard` (all 5 steps), `branch-setup-wizard` (all components), schemas, DB models | Phase 2 |
| `module_01_auth_onboarding.md` | `login.tsx`, `signup.tsx`, `forgot-password.tsx`, `reset-password.tsx` | Phase 1 |
| `module_01_auth_onboarding.md` | `setup-wizard.tsx` *(basic spec — use `module_00` for full detail)* | Phase 2 |
| `module_01_auth_onboarding.md` | `public-enquiry-form.tsx` *(now in `(public)`)* | Phase 8 Step 8.1 |
| `module_02_03_dashboard_crm.md` → **MODULE 2** | `dashboard.tsx`, `reports.tsx` | Phase 4 |
| `module_02_03_dashboard_crm.md` → **MODULE 3** | `enquiries.tsx`, `add-enquiry.tsx`, `enquiry-details.tsx` | Phase 8 |
| `module_04_students_admission.md` | `students.tsx`, `new-admission.tsx`, `group-admission.tsx`, `student-profile.tsx`, `edit-student.tsx`, `student-exit.tsx`, `id-card-generator.tsx`, `referral-bonus.tsx`, `alumni.tsx`, `document-vault.tsx` | Phase 5 |
| `module_05_seats_shifts_lockers.md` | `seat-matrix.tsx`, `seats.tsx` *(seat-management)*, `seat-maintenance-log.tsx`, `shifts.tsx`, `shift-migration.tsx`, `seat-history.tsx`, `allocations.tsx`, `lockers.tsx`, `locker-matrix.tsx` | Phase 6 |
| `module_05_seats_shifts_lockers.md` | `shift-gap-analyzer.tsx` *(route group: `(accounting)`)* | Phase 9 Step 9.5 |
| `module_06_finance_payments.md` | `subscriptions.tsx`, `renewals.tsx`, `payments.tsx`, `collect-fee.tsx`, `payment-promises.tsx`, `student-trust-score.tsx`, `security-deposits.tsx`, `invoice.tsx`, `receipt.tsx`, `late-fees.tsx`, `auto-suspend.tsx`, `referrals.tsx`, `refunds.tsx` | Phase 7 |
| `module_07_accounts_auditing.md` | `expenses.tsx`, `add-expense.tsx`, `expense-categories.tsx`, `seat-gap-report.tsx`, `daily-settlement.tsx`, `financial-reports.tsx`, `assets.tsx`, `asset-maintenance.tsx` | Phase 9 |
| `module_08_attendance_comms.md` | `attendance.tsx`, `absentee-report.tsx`, `qr-scanner.tsx`, `complaints.tsx`, `notices.tsx`, `notification-center.tsx`, `holiday-calendar.tsx`, `whatsapp-logs.tsx`, `whatsapp-templates.tsx` | Phase 10 |
| `module_09_admin_security.md` | `branches.tsx`, `staff-users.tsx`, `permissions.tsx`, `plans.tsx`, `coupons.tsx`, `blacklist.tsx`, `audit-logs.tsx` | Phase 11 |
| `module_09_admin_security.md` | `waitlist.tsx` *(route group: `(Seats & Shifts)`)* | Phase 6 Step 6.8 |
| `module_09_admin_security.md` | `bulk-import.tsx`, `data-export.tsx`, `backups.tsx`, `gst-tax-settings.tsx` *(route group: `(system)` / `(finance)`)* | Phase 12 |
| `module_10_system_utilities.md` | `settings.tsx`, `profile.tsx`, `offline.tsx`, `maintenance.tsx`, `404.tsx`, `500.tsx`, `gap-filling.tsx`, `smart-id-autofill.tsx`, `waitlist-automation.tsx`, `power-saving.tsx`, `branding.tsx`, `auto-scale.tsx`, `whatsapp-integration.tsx` | Phase 12 |

> ⚠️ **Note on Module Numbering:** The module files were written before the route group refactor. Their internal numbering (Module 1–10) does NOT match the Phase numbers (0–13) in this flow. Always use the table above to find the right module for any phase step.

---

## ⚙️ PHASE 0 — Project Setup (Sabse Pehle, Ek Baar)

> Ye koi "screen" nahi hai — ye foundation hai. Bina iske kuch bhi kaam nahi karega.

### Kya banao:

**Step 0.1 — Project Bootstrap**
- [ ] Next.js 16.x App Router + TypeScript 5.x + TailwindCSS 4.x (already initialized in `my-app/`)
- [ ] `src/app/globals.css` — Design tokens (`@theme`): colors, font, glass-panel, otp-input utilities
- [ ] `src/app/layout.tsx` — Root layout: Inter font (Google Fonts), `bg-background text-on-background`
- [ ] `src/app/page.tsx` — Root redirect: `redirect('/login')` or `redirect('/dashboard')` based on auth state

**Step 0.2 — Design System (globals.css)**
```
Color tokens already in globals.css (@theme):
  --color-background: #12121d     (page bg)
  --color-surface-container: #1f1e2a  (card bg)
  --color-primary: #c0c1ff        (indigo accent)
  --color-tertiary: #ffb783       (orange accent)
  --color-error: #ffb4ab          (red)
  --color-outline: #908fa0        (muted text)
Font: Inter 400/500/600/700/800 — Google Fonts
Icons: lucide-react ONLY (never Material Symbols, never MUI icons)
```

**Step 0.3 — Shared Utilities (src/app/lib/ or co-located)**
- [ ] `cn()` helper using `clsx` + `tailwind-merge` — used in every component
- [ ] `smartId.util.ts` — Gap-filling Smart ID logic (needed in Admission)
- [ ] `slotConflict.util.ts` — Zero-Clash seat assignment algorithm
- [ ] `lateFee.util.ts` — Late fee calculation rules
- [ ] `trustScore.util.ts` — Commitment reliability score calculation
- [ ] `pdf.util.ts` — PDF generation helper (for ID cards, invoices, receipts)

> ⚠️ **No axios, No TanStack Query, No Zustand, No MUI** — Use native `fetch()` for API calls.

**✅ Phase 0 complete hone ke baad:** Project run hoga, design system ready, utility functions available.

---

## 🔐 PHASE 1 — Authentication (Pure Auth Screens Only)

> **Kyun pehle?** Bina login ke koi bhi screen access nahi hogi.
> **Route Group:** `src/app/(auth)/` — Sirf auth screens. Kuch aur nahi.

### Step 1.1 — Auth Layout
- [ ] `src/app/(auth)/layout.tsx`
  - Centered card layout, dark background, no sidebar
  - Import Inter font, glass-morphism card style

### Step 1.2 — Login Page
- [ ] `src/app/(auth)/login/LoginForm.tsx`
  - `react-hook-form` + `zod` schema from `reusable/schema.ts`
  - Fields: Email/Phone + Password (👁️ toggle visibility)
  - Error state, "Forgot Password?" link → `/forgot-password`
- [ ] `src/app/(auth)/login/page.tsx`

### Step 1.3 — Signup Page
- [ ] `src/app/(auth)/signup/SignupForm.tsx`
  - Fields: Owner Name, Email, Phone, Library Name, Password + Confirm
  - `reusable/PasswordStrengthMeter.tsx` — live strength indicator
- [ ] `src/app/(auth)/signup/page.tsx`

### Step 1.4 — Password Recovery
- [ ] `src/app/(auth)/forgot-password/ForgotForm.tsx`
  - Field: Email/Phone → sends OTP
- [ ] `src/app/(auth)/forgot-password/page.tsx`
- [ ] `src/app/(auth)/reset-password/ResetForm.tsx`
  - 6-char OTP boxes (custom `Controller` input) + New Password + Confirm + Resend timer
- [ ] `src/app/(auth)/reset-password/page.tsx`

### Step 1.5 — Reusable (auth-scoped only)
- [ ] `src/app/(auth)/reusable/schema.ts` — All Zod schemas for auth forms
- [ ] `src/app/(auth)/reusable/PasswordStrengthMeter.tsx` — Strength bar component

**✅ Phase 1 complete hone ke baad:** Owner/staff login/signup/password-reset sab kaam karega.

---

## 🏗️ PHASE 2 — Super-Admin Onboarding

> **Kyun Phase 2?** Naya owner signup ke baad seedha yahan aata hai — library setup karna padta hai.
> **Route Group:** `src/app/(superadmin)/`

### Step 2.1 — First-Time Library Setup Wizard
- [ ] `src/app/(superadmin)/setup-wizard/page.tsx`
  - 5-step wizard: Branch Details → Define Shifts → Add Seats → Create Fee Plan → Launch
  - Left panel: numbered step progress bar
  - Right panel: `react-hook-form` + `zod` step forms
  - Each step saves to DB before moving next
  - DB: `Branch`, `Shift`, `Seat`, `Plan`

### Step 2.2 — Branch Setup Wizard (Multi-Branch)
- [ ] `src/app/(superadmin)/branch-setup-wizard/layout.tsx`
- [ ] `src/app/(superadmin)/branch-setup-wizard/page.tsx`
  - Orchestrator: manages `currentStep` state
- [ ] `src/app/(superadmin)/branch-setup-wizard/components/Sidebar.tsx` — Step progress sidebar
- [ ] `src/app/(superadmin)/branch-setup-wizard/components/BottomNavigation.tsx` — Prev/Next buttons
- [ ] `src/app/(superadmin)/branch-setup-wizard/components/Step1_BranchDetails.tsx`
- [ ] `src/app/(superadmin)/branch-setup-wizard/components/Step2_DefineShifts.tsx`
- [ ] `src/app/(superadmin)/branch-setup-wizard/components/Step3_AddSeats.tsx`
- [ ] `src/app/(superadmin)/branch-setup-wizard/components/Step4_FeePlan.tsx`
- [ ] `src/app/(superadmin)/branch-setup-wizard/components/Step5_Launch.tsx`

**✅ Phase 2 complete hone ke baad:** Naya library owner apna library fully setup kar sakta hai.

---

## 🏗️ PHASE 3 — App Shell (Har Protected Page Ka Wrapper)

> **Kyun abhi?** Ye layout `(admin)`, `(manager)`, `(crm)`, `(finance)` — sab mein use hoga.
> Pehle banao, phir baaki pages iske andar jayenge.

### Step 3.1 — Admin App Shell
- [ ] `src/app/(admin)/dashboard/Sidebar.tsx`
  - `lucide-react` icons ONLY (no Material Symbols)
  - Navigation: Dashboard | Reports | Plans | Coupons | Staff | Permissions | Audit Logs | Blacklist
  - RBAC: Owner dekhega sab, Staff limited sections
  - Active state highlight (border-l-4 border-primary + bg-primary/10)
- [ ] `src/app/(admin)/dashboard/Header.tsx`
  - Left: App logo "Smart Library 360"
  - Center: Global search input
  - Right: 🔔 Notification bell + User avatar + logout
- [ ] `src/app/(admin)/layout.tsx` → imports Sidebar + Header

### Step 3.2 — Manager App Shell (Students module)
- [ ] `src/app/(manager)/layout.tsx`
  - `lucide-react` icons
  - Navigation: Dashboard | Students | Seats & Shifts | Finance | Accounts | Communication | Admin | System
  - Dual sidebar: Main nav + Operations sub-nav (when on seat/shift routes)

### Step 3.3 — Remaining Layout Files
Each protected route group needs its layout.tsx pointing to the shell:
- [ ] `src/app/(crm)/layout.tsx` — CRM shell with CRM nav
- [ ] `src/app/(Seats & Shifts)/layout.tsx` — Ops shell with seat/shift/locker nav
- [ ] `src/app/(finance)/layout.tsx` — Finance shell
- [ ] `src/app/(accounting)/layout.tsx` — Accounting shell
- [ ] `src/app/(engagement)/layout.tsx` — Engagement shell
- [ ] `src/app/(system)/layout.tsx` — System settings shell

### Step 3.4 — Error Pages
- [ ] `src/app/not-found.tsx` — 404 (large "404" + "Go to Dashboard" button)
- [ ] `src/app/error.tsx` — 500 ("Retry" + "Contact Support")

### Step 3.5 — Reusable System Components
- [ ] `src/app/(system)/reusable/Button.tsx` — CVA variants: primary, secondary, ghost, danger
- [ ] `src/app/(system)/reusable/Input.tsx` — Themed input with label + error state
- [ ] `src/app/(system)/reusable/Select.tsx` — Radix `@radix-ui/react-select` styled
- [ ] `src/app/(system)/reusable/Badge.tsx` — CVA: success, warning, error, info, neutral
- [ ] `src/app/(system)/reusable/Dialog.tsx` — Radix `@radix-ui/react-dialog` styled
- [ ] `src/app/(system)/reusable/Tabs.tsx` — Radix `@radix-ui/react-tabs` styled
- [ ] `src/app/(system)/reusable/Switch.tsx` — Radix `@radix-ui/react-switch` styled
- [ ] `src/app/(system)/reusable/utils.ts` — `cn()` helper

**✅ Phase 3 complete hone ke baad:** Sidebar + Header with layout ready. Har page iske andar render hoga.

---

## 📊 PHASE 4 — Admin Dashboard (CEO Cockpit)

> **Kyun abhi?** Login ke baad owner yahan aata hai. Ye "home page" hai.
> **Route Group:** `src/app/(admin)/`

### Step 4.1 — Admin Reusable Components
- [ ] `src/app/(admin)/reusable/KpiCard.tsx` — KPI stat card (title, value, trend badge, icon)
- [ ] `src/app/(admin)/reusable/SeatCell.tsx` — Single seat cell (color: free=green / occupied=red / expiring=orange / maintenance=gray)
- [ ] `src/app/(admin)/reusable/SeatMatrixGrid.tsx` — CSS Grid of SeatCells + shift filter tabs
- [ ] `src/app/(admin)/reusable/ActionItemsList.tsx` — Clickable action items (icon + count + label)
- [ ] `src/app/(admin)/reusable/RecentPaymentsFeed.tsx` — Last 5 payments mini-feed
- [ ] `src/app/(admin)/reusable/ChartCard.tsx` — Dark card wrapper for Recharts charts

### Step 4.2 — Dashboard Page
- [ ] `src/app/(admin)/dashboard/KpiCard.tsx` — Dashboard-local KPI card
- [ ] `src/app/(admin)/dashboard/SeatMatrix.tsx` — Full visual seat grid
- [ ] `src/app/(admin)/dashboard/ActionItemsPanel.tsx` — Renewals due, complaints pending, new enquiries
- [ ] `src/app/(admin)/dashboard/RecentPaymentsTable.tsx` — Last 5 payments table
- [ ] `src/app/(admin)/dashboard/hardcoded.json` — Mock data
- [ ] `src/app/(admin)/dashboard/page.tsx`
  - Row 1: 4 KPI cards (Active Students, Today's Collection, Occupied Seats %, Pending Actions)
  - Row 2 (60/40 split): SeatMatrix + ActionItemsPanel
  - Row 3: RecentPaymentsTable
  - Shift filter tabs above matrix
  - DB: `Student`, `Payment`, `Seat`, `Subscription`, `Enquiry`, `Complaint`

### Step 4.3 — Reports Page
- [ ] `src/app/(admin)/reports/Overview.tsx`
  - 4 KPI cards + 2×2 chart grid (Recharts: Bar, Donut, Area, Line)
  - Filter: Date range + Branch
- [ ] `src/app/(admin)/reports/GrowthReports.tsx`
- [ ] `src/app/(admin)/reports/hardcoded.json`
- [ ] `src/app/(admin)/reports/page.tsx`

**✅ Phase 4 complete hone ke baad:** Login → Dashboard visible with data.

---

## 🎓 PHASE 5 — Students & Admission (THE CORE ENGINE)

> **Kyun abhi?** Ye poore system ka dil hai. Seat, Finance, Attendance — sab students se linked hai.
> **Route Group:** `src/app/(manager)/`

### Step 5.1 — Student List
- [ ] `src/app/(manager)/students/page.tsx`
  - Table: Smart ID | Photo | Name | Phone | Shift | Seat# | Status badge | Plan | Due ₹ | Join Date | Actions
  - Top bar: Search + Shift filter + Status filter + "New Admission" button + "Export" button
  - Pagination at bottom
  - DB: `Student`

### Step 5.2 — New Admission (Most Important Page)
- [ ] `src/app/(manager)/students/new/AdmissionForm.tsx`
  - Section 1: Personal Info (Smart ID auto-fill via `smartId.util.ts`, Blacklist check on phone blur)
  - Section 2: Photo + Aadhar document upload
  - Section 3: Seat & Shift Allocation (`slotConflict.util.ts` — only shows available seats)
    - Fixed shift OR custom time slots (supports multi-slot: "8–10 AM" AND "5–8 PM")
  - Section 4: Fee & Payment (Plan select, Coupon/Promo code, Security Deposit, Amount Paid, Payment Mode)
  - Post-submit: animated success modal with ID card print prompt
  - DB: `Student`, `StudentSlot`, `Subscription`, `Payment`, `SecurityDeposit`, `IDCard`, `Blacklist`
- [ ] `src/app/(manager)/students/new/page.tsx`

### Step 5.3 — Group Admission
- [ ] `src/app/(manager)/students/group/page.tsx`
  - Group metadata (college name, discount %) + dynamic student rows table + running totals sidebar
  - 10-15% group discount auto-applied
  - DB: `Student` (multiple), `Subscription`, `Payment`, `StudentSlot`

### Step 5.4 — Student Profile (360° View)
- [ ] `src/app/(manager)/students/[id]/page.tsx`
  - Profile header: Photo, Name, Smart ID, Status badge, Trust Score gauge, action buttons
  - 8 tabs: Personal Info | Subscriptions | Payments | Attendance | Seat History | Complaints | Documents | Referrals
  - DB: `Student`, `SeatHistory`, `Attendance`, `Subscription`, `Payment`, `Complaint`, `IDCard`

### Step 5.5 — Edit Student
- [ ] `src/app/(manager)/students/[id]/edit/page.tsx`
  - Sections: Personal Info | Photo & Documents | Status & Notes (Owner-only)
  - AuditLog entry on save
  - DB: `Student`, `AuditLog`

### Step 5.6 — Student Exit Workflow
- [ ] `src/app/(manager)/students/exit/page.tsx`
  - 6-step checklist: Pending Dues → Security Deposit Refund → Locker Release → Seat Release → Alumni → Confirm Exit
  - System auto-marks: Seat → AVAILABLE, Locker → AVAILABLE, Student → Alumni
  - DB: `Student`, `StudentSlot`, `SecurityDeposit`, `Seat`, `Locker`

### Step 5.7 — ID Card Generator
- [ ] `src/app/(manager)/students/id-card/page.tsx`
  - Left: Student search + Template selector
  - Right: Live ID card preview (85.6×54mm ratio) with QR code
  - Print button → `pdf.util.ts` generates PDF
  - DB: `IDCard`

### Step 5.8 — Referral Bonus
- [ ] `src/app/(manager)/students/referrals/page.tsx`
  - KPI cards (Total Referrals, Pending, Redeemed) + Table + "Redeem to Fee" modal
  - DB: `Student` (referralBonusBalance)

### Step 5.9 — Alumni List
- [ ] `src/app/(manager)/students/alumni/page.tsx`
  - Table (exited students) + "Re-Admit" button + "Broadcast WhatsApp to Alumni" bulk action
  - DB: `Student` (isAlumni=true)

### Step 5.10 — Document Vault
- [ ] `src/app/(manager)/documents/page.tsx`
  - Table: Smart ID | Student Name | Doc Type | Upload Date | Verification Status | Actions
  - DB: `Student` (documents JSONB)

### Step 5.11 — Student Dashboard
- [ ] `src/app/(manager)/student-dashboard/page.tsx` — Overview stats for staff
- [ ] `src/app/(manager)/student-reports/page.tsx` — Student-specific analytics

**✅ Phase 5 complete hone ke baad:** Students add, edit, exit, ID card, referrals — sab kuch kaam karega.

---

## 🪑 PHASE 6 — Seats, Shifts & Lockers (Operations)

> **Kyun abhi?** Admission mein seat/shift use hoti hai — ab full operational pages banao.
> **Route Group:** `src/app/(Seats & Shifts)/`

### Step 6.1 — Seat Matrix (Visual Cockpit)
- [ ] `src/app/(Seats & Shifts)/seat-matrix/page.tsx`
  - Full-width CSS Grid, 64×64px cells
  - Colors: Green=free, Red=occupied, Orange=expiring soon, Gray=maintenance
  - Shift filter tabs above grid
  - Right sidebar on cell click: current occupant details
  - DB: `Seat`, `StudentSlot`

### Step 6.2 — Seat Management
- [ ] `src/app/(Seats & Shifts)/seat-management/page.tsx`
  - Table + Add/Edit modal (Radix Dialog) + "Mark Broken/Fixed" toggle
  - DB: `Seat`
- [ ] `src/app/(Seats & Shifts)/seat-management/maintenance/page.tsx`
  - Seat selector + Overdue alert banner + Maintenance history table + Add Entry form
  - DB: `Seat` (maintenanceLog JSONB)

### Step 6.3 — Shift Management
- [ ] `src/app/(Seats & Shifts)/shift-management/page.tsx`
  - 3-column card grid + Add/Edit modal + Deactivate toggle
  - Supports: Fixed Shifts (6AM-12PM, 12PM-6PM) + Flexible/Custom slots
  - DB: `Shift`

### Step 6.4 — Shift Migration (3-Step Wizard)
- [ ] `src/app/(Seats & Shifts)/shift-migration/page.tsx`
  - Step 1: Select Student → Step 2: Choose New Slot (shows slot conflict check) → Step 3: Review Fee Adjustment (calculates +/- difference)
  - DB: `StudentSlot`, `SeatHistory`, `Payment`

### Step 6.5 — Seat History
- [ ] `src/app/(Seats & Shifts)/seat-history/page.tsx`
  - Security tracking: who sat on which seat, when
  - Filter by Seat Number or Date range
  - DB: `SeatHistory`

### Step 6.6 — Locker Manager + Matrix
- [ ] `src/app/(Seats & Shifts)/lockers/page.tsx`
  - Table: Locker # | Student | Assigned Date | Due | Status | Actions
  - DB: `Locker`, `StudentSlot`
- [ ] `src/app/(Seats & Shifts)/locker-matrix/page.tsx`
  - Visual grid (same color logic as Seat Matrix)
  - DB: `Locker`

### Step 6.7 — Allocations Master View
- [ ] `src/app/(Seats & Shifts)/allocations/page.tsx`
  - Table: Student | Seat | Shift | Custom Slots | Locker | Valid From–Till | Days Left badge
  - DB: `StudentSlot`, `Locker`

### Step 6.8 — Waitlist
- [ ] `src/app/(Seats & Shifts)/waitlist/page.tsx`
  - Students waiting for a seat vacancy
  - "Notify via WhatsApp" when seat becomes available
  - DB: `Waitlist`, `WhatsAppMessage`

**✅ Phase 6 complete hone ke baad:** Seats/Shifts/Lockers full visibility aur management ready.

---

## 💰 PHASE 7 — Finance, Payments & Trust Score

> **Kyun abhi?** Students admit ho gaye, ab unka paisa track karna hai.
> **Route Group:** `src/app/(finance)/`

### Step 7.1 — Subscription List
- [ ] `src/app/(finance)/subscriptions/page.tsx`
  - Table with Days Left badge (red < 3 days / amber < 7 days / green = healthy)
  - DB: `Subscription`

### Step 7.2 — Renewals Dashboard
- [ ] `src/app/(finance)/renewals/page.tsx`
  - 3 filter tabs: Expired | Expiring 7 days | Expiring 15 days
  - Per row: "Renew Now" + "Send Reminder (WhatsApp)" buttons
  - Bulk action: "Remind All Expiring"
  - DB: `Subscription`, `WhatsAppMessage`

### Step 7.3 — Collect Fee (Cashier Screen)
- [ ] `src/app/(finance)/collect-fee/page.tsx`
  - Left: Form (Student search autocomplete, Amount, Mode: Cash/UPI/Card, Coupon code, Late Fee toggle, Remark)
  - Right: Live receipt preview (updates real-time as you type)
  - Auto-restore suspended student on payment
  - DB: `Payment`, `Subscription`, `Coupon`, `WhatsAppMessage`

### Step 7.4 — Payment Ledger
- [ ] `src/app/(finance)/payments/page.tsx`
  - Master ledger, soft-delete with AuditLog entry, "Show Deleted" toggle
  - DB: `Payment` (isDeleted)

### Step 7.5 — GST Invoice
- [ ] `src/app/(finance)/invoice/[id]/page.tsx`
  - A4-proportioned printable invoice, print CSS (`@media print` hides sidebar)
  - DB: `Payment`, `Subscription`, `Plan`, `Branch`

### Step 7.6 — Payment Receipt
- [ ] `src/app/(finance)/receipt/[id]/page.tsx`
  - Thermal receipt style (80mm width), `@media print` optimization
  - DB: `Payment`, `Branch`, `Student`

### Step 7.7 — Late Fees
- [ ] `src/app/(finance)/late-fees/page.tsx`
  - Config card: Grace Period (days) + Penalty per day (₹)
  - Active late fee table: Student | Due Date | Days Late | Auto-calculated Penalty
  - DB: `Subscription`, `Payment`

### Step 7.8 — Auto Suspend Manager
- [ ] `src/app/(finance)/auto-suspend/page.tsx`
  - Config: Days after due to suspend + Grace toggle
  - 3 KPI cards + Suspended students table + "Restore Access" action
  - DB: `Student`, `Subscription`, `Payment`

### Step 7.9 — Payment Promises (PTP Tracker)
- [ ] `src/app/(finance)/payment-promises/page.tsx`
  - Table: Student | Promised Amount | Commitment Date | # Times Rescheduled
  - "Extend Date" modal (lowers trust score each time)
  - "Mark Paid" action
  - DB: `PaymentPromise`, `Student`

### Step 7.10 — Trust Score Dashboard
- [ ] `src/app/(finance)/trust-score/page.tsx`
  - Ranked table (lowest score first = highest risk)
  - 🟢 High / 🟡 Medium / 🔴 Low trust badges
  - "Low Trust" warning banner on students who changed date 5+ times
  - DB: `Student` (commitmentReliabilityScore), `PaymentPromise`

### Step 7.11 — Security Deposits
- [ ] `src/app/(finance)/security-deposits/page.tsx`
  - Table: Student | Deposit Amount | Date Paid | Status | Refund Date
  - "Process Refund" modal with deduction support
  - DB: `SecurityDeposit`

### Step 7.12 — Refunds
- [ ] `src/app/(finance)/refunds/page.tsx`
  - DB: `SecurityDeposit`, `Payment`

### Step 7.13 — Referral Overview
- [ ] `src/app/(finance)/referrals/page.tsx`
  - DB: `Student` (referredBy, referralBonusBalance)

### Step 7.14 — GST & Tax Settings
- [ ] `src/app/(finance)/gst-tax-settings/page.tsx`
  - GST Number, Tax Rate, HSN Code inputs + Live invoice preview as you type
  - DB: `Branch` (gstNumber + tax config)

**✅ Phase 7 complete hone ke baad:** Poora fee collection, billing, trust score system ready.

---

## 📞 PHASE 8 — CRM & Lead Management

> **Kyun yahan?** Students aur Finance ke baad, CRM ek "sales channel" hai. Core ready hai, ab leads manage karo.
> **Route Group:** `src/app/(crm)/`

### Step 8.1 — Public Enquiry Form (No Auth)
> 📖 **Module Reference:** `module_01_auth_onboarding.md` → `public-enquiry-form.tsx` section

- [ ] `src/app/(public)/layout.tsx` — Minimal layout, no sidebar
- [ ] `src/app/(public)/enquiry/page.tsx`
  - No login required, accessible via QR code scan
  - Full-screen centered card (440px). Library logo + name at top.
  - Fields: Name, Phone, Preferred Shift (`<select>` from active shifts), Message (optional)
  - Post-submit: form replaced by animated success screen "Thank you, [Name]!"
  - DB: `Enquiry` (status auto-set to 'new')

### Step 8.2 — Enquiry List (CRM Pipeline)
> 📖 **Module Reference:** `module_02_03_dashboard_crm.md` → MODULE 3 → `enquiries.tsx` section

- [ ] `src/app/(crm)/enquiries/page.tsx`
  - Toggle view: Kanban Board ↔ Table (icon buttons top-right)
  - Kanban: 5 columns — New | Visited | Interested | Converted | Lost. Cards: Name, Phone (masked), Preferred Shift badge, Follow-up due badge (🔴/🟡/🟢)
  - Table: Name | Phone | Source | Status badge | Handled By | Date Added | Follow-up Due | Actions
  - Top bar: Search + Status filter + "➕ Add Enquiry" primary
  - DB: `Enquiry`

### Step 8.3 — Add Enquiry
> 📖 **Module Reference:** `module_02_03_dashboard_crm.md` → `add-enquiry.tsx` section

- [ ] `src/app/(crm)/enquiries/add/page.tsx`
  - Right slide-in drawer (480px)
  - Fields: Name, Phone, Preferred Shift, Source (`<select>`), Handled By (`<select>` from staff), Notes
  - DB: `Enquiry`

### Step 8.4 — Enquiry Detail (Full Timeline)
> 📖 **Module Reference:** `module_02_03_dashboard_crm.md` → `enquiry-details.tsx` section

- [ ] `src/app/(crm)/enquiries/[id]/page.tsx`
  - Left (60%): Info card + chronological follow-up timeline (newest on top)
  - Right sticky (40%): Status `<select>` updater + Add Follow-up form + "✅ Convert to Admission" + "❌ Mark as Lost"
  - "Convert" → navigates to `/students/new` pre-filled with Name + Phone
  - DB: `Enquiry`, `Student`

**✅ Phase 8 complete hone ke baad:** Lead se Admission tak poora CRM flow ready.

---

## 📉 PHASE 9 — Accounting & P&L Reports

> **Kyun abhi?** Paisa collect ho raha hai — ab kharche bhi track karo aur Net Profit dekho.
> **Route Group:** `src/app/(accounting)/`

### Step 9.1 — Expenses
- [ ] `src/app/(accounting)/expense-categories/page.tsx`
  - CRUD for categories: Rent, Electricity, WiFi, Cleaning Staff, Newspaper, etc.
  - DB: `ExpenseCategory`
- [ ] `src/app/(accounting)/expenses/add/page.tsx`
  - Form: Category | Amount | Date | Payment Mode | Remark | Receipt Photo upload
  - DB: `Expense`
- [ ] `src/app/(accounting)/expenses/page.tsx`
  - Ledger table + filters + totals summary bar
  - DB: `Expense`, `ExpenseCategory`

### Step 9.2 — Daily Settlement (End-of-Day)
- [ ] `src/app/(accounting)/daily-settlement/page.tsx`
  - Cash/UPI/Card totals for the day
  - Net Profit = Fees Collected − Expenses (hero number, large font)
  - "Close Register" action + auto-send SMS to owner
  - DB: `DailySettlement`

### Step 9.3 — Financial Reports (P&L)
- [ ] `src/app/(accounting)/financial-reports/page.tsx`
  - 4 KPI cards + 2×2 chart grid (Recharts: Bar, Donut, Area, Line)
  - Monthly breakdown table: Revenue | Expenses | Net Profit per month
  - Filter: Date range + Branch
  - DB: `Payment`, `Expense`, `DailySettlement`, `Subscription`

### Step 9.4 — Seat Gap Report
> 📖 **Module Reference:** `module_07_accounts_auditing.md` → `seat-gap-report.tsx` section

- [ ] `src/app/(accounting)/seat-gap-report/page.tsx`
  - Filter bar: Date + Shift `<select>`
  - Per-seat gap cards: horizontal time bar (indigo=booked, gray=free) + gap list with revenue estimate
  - "⚡ Assign Student →" shortcut → opens `/students/new` pre-filled with seat + time slot
  - 📌 *Tabular reporting view. For the interactive visual algorithm tool → `/gap-filling` (Phase 12)*
  - DB: `Seat`, `StudentSlot`, `Shift`

### Step 9.5 — Shift Gap Analyzer
> 📖 **Module Reference:** `module_05_seats_shifts_lockers.md` → `shift-gap-analyzer.tsx` section
> *(Note: this page spec is in the Seats module file because it shares the same time-bar visualization logic. But the route lives in `(accounting)` because it's a financial analysis tool.)*

- [ ] `src/app/(accounting)/shift-gap-analyzer/page.tsx`
  - Filter bar: Shift `<select>` + View Period (Today/This Week/This Month)
  - Per-shift card: "X / Y seats occupied" + % Utilization (large) + horizontal progress bar
  - Time-slot bar (6AM–11PM): indigo=booked blocks, gray=free gaps
  - Gap rows: "🕳️ Gap: 10AM–2PM — 8 free seats — Est. loss: ₹800/day" + "⚡ Quick Fill →"
  - DB: `Shift`, `StudentSlot`, `Seat`, `Student`

### Step 9.6 — Assets & Maintenance
- [ ] `src/app/(accounting)/assets/page.tsx`
  - Inventory: Total Chairs, ACs, Fans, Tables + Add/Edit asset modal
  - DB: `Asset`
- [ ] `src/app/(accounting)/asset-maintenance/page.tsx`
  - Service log per asset (AC service due date, repair records)
  - Auto-alert when maintenance overdue
  - DB: `Asset`, `AssetMaintenanceLog`

**✅ Phase 9 complete hone ke baad:** P&L reports, expenses, gap analysis — business intelligence ready.

---

## 📱 PHASE 10 — Attendance, Engagement & Communication

> **Kyun abhi?** Core operations ready hain. Ab daily tasks aur communication automate karo.
> **Route Group:** `src/app/(engagement)/`

### Step 10.1 — Attendance
- [ ] `src/app/(engagement)/attendance/page.tsx`
  - Date + Shift filter + Student grid with Present / Absent / Late toggles
  - 3+ consecutive absent: amber row highlight + "Alert Parents" button per student
  - DB: `Attendance`, `WhatsAppMessage`

### Step 10.2 — QR Scanner
- [ ] `src/app/(engagement)/qr-scanner/page.tsx`
  - Camera viewport (400×400px) + QR scan overlay + "Mark IN / Mark OUT"
  - Manual fallback: Smart ID text input
  - DB: `IDCard`, `Attendance`

### Step 10.3 — Absentee Report
- [ ] `src/app/(engagement)/absentee-report/page.tsx`
  - Color-coded rows: 3–6 days absent = amber, 7+ days = red
  - "Alert All Parents" bulk WhatsApp action
  - DB: `Attendance`, `Student` (parentPhone), `WhatsAppMessage`

### Step 10.4 — Complaints Box
- [ ] `src/app/(engagement)/complaints/page.tsx`
  - Filter tabs: All | Open | In-Progress | Resolved
  - Anonymous complaints allowed toggle
  - DB: `Complaint`

### Step 10.5 — Notice Board
- [ ] `src/app/(engagement)/notices/page.tsx`
  - Vertical notice card list + Add/Edit modal (Radix Dialog)
  - "Broadcast via WhatsApp" confirmation before sending
  - DB: `Notice`, `WhatsAppMessage`

### Step 10.6 — Notification Center
- [ ] `src/app/(engagement)/notification-center/page.tsx`
  - Left: Category filter sidebar (Subscriptions / Enquiries / Payments / Attendance / Assets)
  - Right: Notification feed with priority badges
  - Aggregates from: `Subscription`, `Enquiry`, `PaymentPromise`, `Attendance`, `AssetMaintenanceLog`

### Step 10.7 — Holiday Calendar
- [ ] `src/app/(engagement)/holiday-calendar/page.tsx`
  - Monthly calendar grid (left) + Holiday list panel (right)
  - "Mark as Holiday" removes day from absentee count calculations
  - ⚠️ Use dedicated `Holiday` entity — NOT the `Notice` table
  - DB: `Holiday`

### Step 10.8 — WhatsApp (All 3 features together)
- [ ] `src/app/(engagement)/whatsapp-logs/page.tsx`
  - Full outbox: Student | Message Type | Template Used | Sent At | Status
  - DB: `WhatsAppMessage`
- [ ] `src/app/(engagement)/whatsapp-templates/page.tsx`
  - Template editor with variable chips: `{name}`, `{amount}`, `{dueDate}`, `{planName}`, `{libraryName}`, `{seat}`
  - ⚠️ Use `WhatsAppTemplate` dedicated entity per branch — NOT `Branch` JSONB
  - DB: `WhatsAppTemplate`
- [ ] `src/app/(engagement)/whatsapp-integration/page.tsx`
  - API Provider selector (Twilio / Wati / AiSensy)
  - API Key + Secret + Webhook URL fields + "Test Connection" button
  - DB: `Branch` (whatsapp config)

**✅ Phase 10 complete hone ke baad:** Attendance, complaints, notices, WhatsApp automation — sab chal raha hai.

---

## ⚙️ PHASE 11 — Admin, Security & Configuration

> **Kyun abhi?** Core chal raha hai. Ab owner-level controls add karo.
> **Route Group:** `src/app/(admin)/` *(remaining pages)*

### Step 11.1 — Plans & Coupons
- [ ] `src/app/(admin)/plans/page.tsx`
  - 3-column card grid, Price displayed large
  - Add/Edit modal: Plan Name, Duration (Days), Price, Description, Status toggle
  - DB: `Plan`
- [ ] `src/app/(admin)/coupons/page.tsx`
  - Table + Add modal: Code, Discount (flat ₹ or %), Expiry, Max Uses
  - ROI indicator: Times Used / Total Discount Given
  - DB: `Coupon`

### Step 11.2 — Blacklist
- [ ] `src/app/(admin)/blacklist/page.tsx`
  - Table: Name | Phone | Reason | Blacklisted By | Date
  - Info banner: "Phone numbers are auto-blocked during new admissions"
  - DB: `Blacklist`

### Step 11.3 — Staff & Permissions (RBAC)
- [ ] `src/app/(admin)/staff-users/page.tsx`
  - Role badges: owner=indigo, manager=blue, staff=gray
  - DB: `User`
- [ ] `src/app/(admin)/permissions/page.tsx`
  - Role tabs (Owner / Manager / Staff) + Permission matrix (grouped toggle switches per feature area)
  - DB: `User` (permissions JSONB)

### Step 11.4 — Audit Logs (Fraud Detection)
- [ ] `src/app/(admin)/audit-logs/page.tsx`
  - Read-only log. Filter: User | Action Type | Date Range
  - "View Changes" row action → Before vs After JSON diff modal
  - DB: `AuditLog`

### Step 11.5 — Multi-Branch Management
- [ ] `src/app/(admin)/branches/page.tsx`
  - Per-branch summary cards + Table + "Switch Branch" + "Add Branch → /branch-setup-wizard"
  - DB: `Branch`, `Payment`, `Student`

**✅ Phase 11 complete hone ke baad:** Full admin control — RBAC, audit, plans, staff management ready.

---

## 🌐 PHASE 12 — System, Utilities & Smart Automation

> **Kyun last?** Ye "power-user" features hain jo system ko smarter banate hain.
> **Route Group:** `src/app/(system)/`

### Step 12.1 — Settings
- [ ] `src/app/(system)/settings/page.tsx`
  - Sections: Library General | Late Fee Rules | Auto-Suspend Config | Notification Preferences | UPI & Payment

### Step 12.2 — Profile
- [ ] `src/app/(system)/profile/page.tsx`
  - Personal Info + Change Password (with `PasswordStrengthMeter`)
  - DB: `User`

### Step 12.3 — Branding (White-Labeling)
- [ ] `src/app/(system)/branding/page.tsx`
  - Logo upload + Primary color picker + Library display name
  - Live preview updates as you change values
  - DB: `Branch`

### Step 12.4 — Smart ID System
- [ ] `src/app/(system)/smart-id/page.tsx`
  - Shows current ID assignment rules (Gap-filling algorithm config)
  - "Reindex / Reorganize IDs" trigger with preview
  - DB: `Student` (smartId)

### Step 12.5 — Gap Filling Algorithm (Interactive Tool)
- [ ] `src/app/(system)/gap-filling/page.tsx`
  - Visual time bars per seat — click a gap → "Quick Assign" action
  - 📌 *Interactive visual tool. For the revenue-reporting view → `/seat-gap-report`*
  - DB: `Seat`, `StudentSlot`, `Shift`

### Step 12.6 — Waitlist Automation
- [ ] `src/app/(system)/waitlist-automation/page.tsx`
  - Toggle: Auto-notify next waitlisted student on seat vacancy
  - Priority ordering rules (FIFO / Shift preference)
  - DB: `Waitlist`

### Step 12.7 — Power Saving Mode
- [ ] `src/app/(system)/power-saving/page.tsx`
  - Rule: "If occupancy < X% in shift → consolidate to Room A, turn off Room B AC"
  - DB: `Shift`, `StudentSlot`

### Step 12.8 — Auto-Scale
- [ ] `src/app/(system)/auto-scale/page.tsx`
  - Max seat capacity config — system auto-detects when new seat is assigned beyond current max
  - DB: `Branch`, `Seat`

### Step 12.9 — Unified Maintenance Dashboard
- [ ] `src/app/(system)/maintenance/page.tsx`
  - 3 sections: Seats needing attention | Assets service overdue | Locker issues
  - DB: `Seat`, `Asset`, `AssetMaintenanceLog`, `Locker`

### Step 12.10 — Data Import & Export (System Utilities)
- [ ] `src/app/(system)/bulk-import/page.tsx`
  - Excel/CSV file dropzone → import 100 students in one go
  - Post-import result card: Success count + Row-level errors ("Row 5: Mobile Number missing")
  - DB: `Student`, `BulkImport`
- [ ] `src/app/(system)/data-export/page.tsx`
  - Entity selector (Students / Payments / Expenses) + Date range + Format (Excel/CSV)

### Step 12.11 — Backups
- [ ] `src/app/(system)/backups/page.tsx`
  - Automated daily backup config + Manual "Backup Now" trigger
  - Last 7 backup statuses with download links
  - DB: `Backup`

### Step 12.12 — PWA Offline Fallback
- [ ] `src/app/(public)/offline/page.tsx`
  - "You're Offline" screen with retry button
  - Auto-redirects to dashboard on reconnect

**✅ Phase 12 complete hone ke baad:** Poora system complete. Smart automation, branding, offline support — sab ready.

---

## 🧪 PHASE 13 — Polish, Testing & Launch Prep

> **Final phase.** Sab kuch bana lo, phir ye karo.

- [ ] **RBAC Guards:** Har protected route par auth check — staff ko owner-only pages (Audit, Reports, GST, RBAC) nahi dikhne chahiye
- [ ] **Loading States:** Har async call par skeleton loaders (not spinners) add karo
- [ ] **Toast Notifications:** `react-hot-toast` — collect-fee, admission, delete, errors par
- [ ] **Error Boundaries:** `src/app/error.tsx` properly implement karo
- [ ] **Mobile Responsive:** Sidebar collapse on mobile, table horizontal scroll, breakpoint check
- [ ] **Print Media:** `@media print` CSS — sidebar/header hide karo for invoice, receipt, ID card
- [ ] **Performance:** lazy loading, code splitting, Image optimization (`next/image`)
- [ ] **PWA Setup:** `manifest.json`, service worker, offline caching
- [ ] **WhatsApp Real API:** Switch from mock to real provider (Twilio / Wati / AiSensy)
- [ ] **PDF Generation:** `html2pdf.js` or `@react-pdf/renderer` — test ID cards, invoices, receipts

---

## 📌 Quick Reference — Phase Summary

| Phase | Kya Banao | Route Group | Module File |
|-------|-----------|-------------|-------------|
| **0** | Project setup + design system + utilities | — | — |
| **1** | Auth — Login, Signup, Password Reset | `(auth)` | `module_01_auth_onboarding.md` |
| **2** | Super-Admin — Setup Wizard, Branch Wizard | `(superadmin)` | `module_01_auth_onboarding.md` → `setup-wizard.tsx` |
| **3** | App Shell — Sidebar, Header, Layout files | All groups | — |
| **4** | Admin Dashboard + Reports | `(admin)` | `module_02_03_dashboard_crm.md` → MODULE 2 |
| **5** | Students — Admission to Exit (The Core) | `(manager)` | `module_04_students_admission.md` |
| **6** | Operations — Seats, Shifts, Lockers, Waitlist | `(Seats & Shifts)` | `module_05_seats_shifts_lockers.md` |
| **7** | Finance — Payments, Billing, Trust Score, GST | `(finance)` | `module_06_finance_payments.md` |
| **8** | CRM — Public Form, Leads, Enquiries | `(crm)` + `(public)` | `module_02_03_dashboard_crm.md` → MODULE 3 + `module_01_auth_onboarding.md` → public-enquiry-form |
| **9** | Accounting — Expenses, P&L, Gap Reports, Assets | `(accounting)` | `module_07_accounts_auditing.md` (+ `module_05` for shift-gap-analyzer) |
| **10** | Engagement — Attendance, WhatsApp, Notices, QR | `(engagement)` | `module_08_attendance_comms.md` |
| **11** | Admin Config — Plans, RBAC, Audit, Branches | `(admin)` | `module_09_admin_security.md` |
| **12** | System — Settings, Automation, Import/Export, Backups | `(system)` | `module_10_system_utilities.md` + `module_09_admin_security.md` |
| **13** | Polish, Testing, Launch Prep | — | — |

---

## ⚠️ Key Dependencies (Ye Order Break Mat Karo)

```
Phase 0 (Setup + Utilities)
    ↓
Phase 1 (Auth) — Login zaroori hai sab ke liye
    ↓
Phase 2 (Super-Admin Onboarding) — Wizard setup required before using the app
    ↓
Phase 3 (App Shell) — Layout zaroori hai har page ke liye
    ↓
Phase 4 (Admin Dashboard) — Home screen visible hona chahiye
    ↓
Phase 5 (Students) — Student entity sab kuch ka base hai
    ↓
Phase 6 (Seats & Shifts) — Seat/Shift student se linked hai
    ↓
Phase 7 (Finance) — Payment student + subscription se linked hai
    ↓
Phases 8–12 — In any order (no hard dependencies on each other)
    ↓
Phase 13 (Polish & Launch)
```

---

## 🛠️ Tech Stack Reminder (features.md se — Ye Rules Break Mat Karo)

| Concern | Use This | Never Use |
|---|---|---|
| Framework | Next.js 16.x + TypeScript 5.x | — |
| Styling | TailwindCSS 4.x + `cn()` | styled-components, emotion |
| Icons | `lucide-react` ONLY | MUI Icons, react-icons, Material Symbols |
| Forms | `react-hook-form` + `zod` | raw `useState` for forms |
| UI Primitives | Radix UI per route group | shadcn CLI, global `components/ui/` |
| Charts | `recharts` | Chart.js, D3.js |
| Tables | `<table>` for ≤50 rows / `ag-grid-react` for >50 | MUI DataGrid |
| Toasts | `react-hot-toast` | react-toastify |
| Dates | `date-fns` | moment.js, dayjs |
| HTTP | native `fetch()` | axios |
| State | React `useState`/`useContext` | Zustand, Redux |
| Data cache | native `fetch()` with Next.js caching | TanStack Query |

---

**🎯 Total estimated files: ~150+ (pages + co-located components + utilities)**
**🏁 Build phase by phase. Phase complete → Test → Next phase.**
