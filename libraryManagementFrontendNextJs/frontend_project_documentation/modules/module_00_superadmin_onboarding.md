# MODULE 0: Super Admin — Onboarding Wizard + Platform Dashboard
> **Who uses this:** Super Admin (SaaS Platform Owner) ONLY — not library admins, not staff
> **Route Group:** `src/app/(superadmin)/`
> **CSS:** `src/app/(superadmin)/superadmin.css` — imported in `layout.tsx`, applied via `.superadmin-theme` class
> **Icons:** `lucide-react` ONLY — no material-symbols
> **Component classes:** All `sa-*` classes defined in `superadmin.css`

---

## 📁 Actual File Structure

```
src/app/(superadmin)/
├── layout.tsx                        # Root layout — applies .superadmin-theme, imports superadmin.css
│                                     # NO sidebar/header here — setup-wizard is standalone
├── superadmin.css                    # CSS variables (.superadmin-theme) + all sa-* component classes
├── hardcoded.json                    # Mock data for setup wizard
├── reusable/
│   └── schema.ts                     # Zod schemas for all wizard steps
│
├── setup-wizard/
│   └── page.tsx                      # Route: /setup-wizard — standalone, no app shell
│
└── superadmin/
    ├── layout.tsx                    # Shell layout — imports Sidebar + Header (only for /superadmin/* routes)
    ├── dashboard/
    │   └── page.tsx                  # Route: /superadmin/dashboard
    ├── libraries/
    │   └── page.tsx                  # Route: /superadmin/libraries
    ├── subscriptions/
    │   └── page.tsx                  # Route: /superadmin/subscriptions
    ├── billing/
    │   └── page.tsx                  # Route: /superadmin/billing
    ├── support-tickets/
    │   └── page.tsx                  # Route: /superadmin/support-tickets
    ├── audit-logs/
    │   └── page.tsx                  # Route: /superadmin/audit-logs
    ├── system-health/
    │   └── page.tsx                  # Route: /superadmin/system-health
    └── settings/
        └── page.tsx                  # Route: /superadmin/settings

src/app/(superadmin)/dashboard/       # Shared UI components (used by superadmin/dashboard/page.tsx)
    ├── Sidebar.tsx                   # Lucide-react icons, sa-nav-link classes
    ├── Header.tsx                    # Bell + UserCircle icons, sa-btn-icon class
    ├── KpiCard.tsx                   # sa-kpi-card class
    ├── SystemHealthPanel.tsx         # Links to /superadmin/system-health
    ├── ActionItemsPanel.tsx          # Links to relevant superadmin pages
    ├── RecentLibrariesTable.tsx      # Links to /superadmin/libraries
    ├── Layout.tsx                    # (legacy, not used — shell is in superadmin/layout.tsx)
    └── hardcoded.json                # Mock KPI, system health, action items, recent libraries data
```

---

## Layout Architecture

```
(superadmin)/layout.tsx          → wraps ALL routes with .superadmin-theme
    │
    ├── /setup-wizard            → NO shell (standalone wizard page)
    │
    └── (superadmin)/superadmin/layout.tsx  → adds Sidebar + Header
            ├── /superadmin/dashboard
            ├── /superadmin/libraries
            ├── /superadmin/subscriptions
            ├── /superadmin/billing
            ├── /superadmin/support-tickets
            ├── /superadmin/audit-logs
            ├── /superadmin/system-health
            └── /superadmin/settings
```

---

## Login Flow

| Condition | Redirect |
|---|---|
| Super Admin logs in | → `/superadmin/dashboard` |
| First-time setup needed | → `/setup-wizard` (then → `/superadmin/dashboard` on launch) |
| Skip wizard | → `/superadmin/dashboard` |

Defined in `src/app/(auth)/hardcoded.json`:
```json
{
  "id": "superadmin",
  "redirectTo": "/superadmin/dashboard",
  "setupComplete": true
}
```

---

## Sidebar Navigation (`dashboard/Sidebar.tsx`)

Uses `lucide-react` icons only. Nav items:

| Label | Route | Icon |
|---|---|---|
| Dashboard | `/superadmin/dashboard` | `LayoutDashboard` |
| Setup Wizard | `/setup-wizard` | `Wand2` |
| Libraries | `/superadmin/libraries` | `Building2` |
| Subscriptions | `/superadmin/subscriptions` | `CreditCard` |
| Billing | `/superadmin/billing` | `Receipt` |
| Support Tickets | `/superadmin/support-tickets` | `HeadphonesIcon` |
| Audit Logs | `/superadmin/audit-logs` | `ScrollText` |
| System Health | `/superadmin/system-health` | `Activity` |
| Platform Settings | `/superadmin/settings` | `Settings` |

Active state: `sa-nav-link--active` CSS class (indigo right border + tinted bg)

---

## CSS Pattern (`superadmin.css`)

Single file — contains both CSS variable tokens AND all `sa-*` component classes:

```css
@layer base {
  .superadmin-theme {
    --primary: #6366F1;   --purple: #8B5CF6;
    --bg-page: #0F0F1A;   --bg-card: #1A1A2E;
    --bg-sidebar: #12121F; --bg-header: #16162A;
    --bg-input: #1E1E32;  --border: #2A2A3E;
    --text-primary: #F0F0FF; --text-secondary: #8888AA;
    --success: #10B981;   --warning: #F59E0B;
    --danger: #EF4444;    --info: #3B82F6;
    /* + sb-bg, sb-text, sb-active, sb-muted for sidebar */
  }
}
@layer components {
  /* sa-input, sa-label, sa-select, sa-card, sa-kpi-card, sa-tip-card */
  /* sa-btn-primary (--flex, --full), sa-btn-ghost (--sm, --danger, --warning, --success) */
  /* sa-btn-icon (--danger, --success, --reveal), sa-btn-dashed */
  /* sa-badge (--success, --warning, --danger, --info, --primary) */
  /* sa-action-badge (--created, --updated, --deleted, --fee) */
  /* sa-table-header, sa-table-row (--alt), sa-actions-bar */
  /* sa-breadcrumb, sa-page-title, sa-progress-track, sa-progress-fill--* */
  /* sa-spinner, sa-nav-link (--active), sa-status-dot (--success, --info, --warning) */
  /* sa-step-item (--active), sa-glow-tr */
}
```

---

## PAGE: `/setup-wizard`

**File:** `src/app/(superadmin)/setup-wizard/page.tsx`
**Type:** `'use client'` — standalone full page, no app shell
**When:** First-time signup OR accessed via sidebar "Setup Wizard" link

### Layout
- Left panel (260px): Step stepper sidebar with `BookOpen` logo, 5 numbered steps, tip card, "Skip setup" button
- Right panel (flex-1): Top progress bar (indigo→purple gradient) + step form content + footer nav

### Steps

| # | Title | Form | Key Fields | DB |
|---|---|---|---|---|
| 1 | Branch Details | `react-hook-form` + zod | Library Name, Address, City, GST (optional) | `Branch` |
| 2 | Define Shifts | `useFieldArray` | Shift Name, Start Time, End Time | `Shift` |
| 3 | Add Seats | `react-hook-form` + zod | Total Seats, Seat Prefix + live preview grid | `Seat` |
| 4 | Fee Plans | `useFieldArray` | Plan Name, Duration (days), Price (₹) | `Plan` |
| 5 | Launch | Read-only summary | Branch info + shifts + plans chips | `Branch.setupComplete = true` |

### Key Technical Rules
1. `layout.tsx` root wrapper has NO Sidebar/Header — wizard is standalone
2. `react-hook-form` + `zodResolver` for all steps — never raw `useState` for form fields
3. `useFieldArray` for Steps 2 & 4 (dynamic rows)
4. Each step renders `<form id="step{N}-form">` — Next button uses `form="step{N}-form"` to trigger validation
5. Step data accumulates in parent state via `onNext(data)` callbacks
6. Launch → redirects to `/superadmin/dashboard`
7. Skip → redirects to `/superadmin/dashboard`

### Hardcoded Mock Data (`hardcoded.json`)
```json
{
  "setupWizard": {
    "libraryName": "City Reading Hub",
    "address": "Block A, Sector 18, Civil Lines",
    "city": "Allahabad",
    "gst": "09AAAAA0000A1Z5",
    "seatCount": 60,
    "seatPrefix": "SL-",
    "shifts": [
      { "name": "Morning",   "start": "06:00", "end": "12:00" },
      { "name": "Afternoon", "start": "12:00", "end": "18:00" },
      { "name": "Evening",   "start": "18:00", "end": "22:00" }
    ],
    "plans": [
      { "name": "Monthly",   "days": 30, "price": 1000 },
      { "name": "Quarterly", "days": 90, "price": 2800 }
    ]
  }
}
```

---

## PAGE: `/superadmin/dashboard`

**File:** `src/app/(superadmin)/superadmin/dashboard/page.tsx`
**Type:** Server Component (data from `dashboard/hardcoded.json`)

### Layout
- Row 1: 4 KPI cards (Total Libraries, Total Students, Platform Revenue, Pending Setups)
- Row 2: `SystemHealthPanel` (col-span-7) + `ActionItemsPanel` (col-span-5)
- Row 3: `RecentLibrariesTable`

### Components (`dashboard/` folder)

| Component | Description | Links To |
|---|---|---|
| `KpiCard` | Stat card with trend/alert | — |
| `SystemHealthPanel` | Uptime, active users, API latency, last backup | `/superadmin/system-health` |
| `ActionItemsPanel` | Clickable action items list | Libraries / Subscriptions / Support / System Health |
| `RecentLibrariesTable` | Recently registered libraries table | `/superadmin/libraries` |

### Hardcoded Data (`dashboard/hardcoded.json`)
```json
{
  "kpiCards": [
    { "title": "Total Libraries",   "value": "38",        "icon": "store",            "trend": "+4 this month" },
    { "title": "Total Students",    "value": "14,820",    "icon": "groups",           "subtitle": "Across all branches" },
    { "title": "Platform Revenue",  "value": "₹2,14,000", "icon": "currency_rupee",   "trend": "+18%" },
    { "title": "Pending Setups",    "value": "5",         "icon": "pending_actions",  "alert": "Needs Attention" }
  ],
  "systemHealth": { "uptime": "99.97%", "activeUsers": 1284, "apiLatency": "42ms", "lastBackup": "2h ago" },
  "actionItems": [ ... ],
  "recentLibraries": [ ... ]
}
```

---

## PAGE: `/superadmin/libraries`

**File:** `src/app/(superadmin)/superadmin/libraries/page.tsx`
**Type:** `'use client'`

### Features
- Search by name or location (live filter)
- Table: Library Name + Plan | Location | Seats progress bar | Status badge | Actions
- Actions always visible (not hover-only): Eye (view panel) | Edit (edit panel) | ShieldAlert (suspend/reactivate)
- **Slide-over panel:** View mode shows owner info + occupancy. Edit mode has inline form (name, owner, phone, location, plan dropdown)
- Suspend toggles `Active` ↔ `Maintenance` in list state
- Save updates list state + shows toast
- "Add Branch" → `Link` to `/setup-wizard`

---

## PAGE: `/superadmin/subscriptions`

**File:** `src/app/(superadmin)/superadmin/subscriptions/page.tsx`
**Type:** `'use client'`

### Features
- 3 KPI cards: Active Subscriptions | MRR | Churn Rate
- Filter tabs: All | Paid | Due Soon | Overdue
- Row click → slide-over panel
- **Panel:** Billing details + MRR value + status badge + "Renew Now" (marks Paid) + "Edit Plan" (inline plan selector)
- All state changes reflect in list immediately + toast

---

## PAGE: `/superadmin/billing`

**File:** `src/app/(superadmin)/superadmin/billing/page.tsx`
**Type:** `'use client'`

### Features
- Search by invoice ID or tenant
- Export CSV button (feedback state)
- Row click → slide-over panel
- **Panel:** Invoice amount + status + details grid + "Download PDF" (loading → downloaded feedback) + "Send Reminder" (overdue only) + "Mark as Paid" (overdue only, updates list)

---

## PAGE: `/superadmin/support-tickets`

**File:** `src/app/(superadmin)/superadmin/support-tickets/page.tsx`
**Type:** `'use client'`

### Features
- Filter tabs: All | Open | In-Progress | Resolved
- "View" button → slide-over panel
- **Panel:** Ticket description + details grid + status toggle buttons (Open/In-Progress/Resolved) + "Save & Notify Tenant" (spinner → success → closes panel, updates list status + toast)

---

## PAGE: `/superadmin/audit-logs`

**File:** `src/app/(superadmin)/superadmin/audit-logs/page.tsx`
**Type:** `'use client'`

### Features
- Search by target or user
- Action filter dropdown: All Actions | Created | Updated | Deleted | Fee_Collected
- Eye button (reveals on row hover via `sa-btn-icon--reveal`) → slide-over panel
- **Panel:** Full log detail + 6-field info grid + action badge

---

## PAGE: `/superadmin/system-health`

**File:** `src/app/(superadmin)/superadmin/system-health/page.tsx`
**Type:** `'use client'`

### Features
- Refresh button with spin animation + updates "last refreshed" timestamp
- Main Infrastructure card: Web Servers + API Latency progress bars
- Databases & Cache card: Postgres + Redis progress bars
- External Gateways: WhatsApp / Razorpay / AWS S3 with animated `sa-status-dot` indicators

---

## PAGE: `/superadmin/settings`

**File:** `src/app/(superadmin)/superadmin/settings/page.tsx`
**Type:** `'use client'`

### Features
- Fully controlled inputs (value + onChange) — not `defaultValue`
- Platform Identity: name, email, phone
- SaaS Auto-Notifications: 4 toggle switches (real toggle UI, not checkboxes)
- Security Defaults: max login attempts, auto-logout minutes
- Save Changes → bottom-right toast + button feedback

---

## Zod Schemas (`reusable/schema.ts`)

```ts
export const branchDetailsSchema = z.object({
  name:    z.string().min(2),
  address: z.string().min(5),
  city:    z.string().min(2),
  gst:     z.string().optional(),
});

export const shiftsSchema = z.object({
  shifts: z.array(z.object({
    name:  z.string().min(1),
    start: z.string().min(1),
    end:   z.string().min(1),
  })).min(1),
});

export const seatsSchema = z.object({
  count:  z.number().min(1).max(9999),
  prefix: z.string().max(3).min(1),
});

export const plansSchema = z.object({
  plans: z.array(z.object({
    name:  z.string().min(1),
    days:  z.number().min(1),
    price: z.number().min(0),
  })).min(1),
});
```

---

## Design Tokens (defined in `superadmin.css` → `.superadmin-theme`)

| Token | Value | Usage |
|---|---|---|
| `--bg-page` | `#0F0F1A` | Page background |
| `--bg-card` | `#1A1A2E` | Cards, panels |
| `--bg-sidebar` | `#12121F` | Sidebar background |
| `--bg-header` | `#16162A` | Header background |
| `--bg-input` | `#1E1E32` | Input fields |
| `--border` | `#2A2A3E` | All borders |
| `--primary` | `#6366F1` | Indigo accent |
| `--purple` | `#8B5CF6` | Gradient end |
| `--text-primary` | `#F0F0FF` | Main text |
| `--text-secondary` | `#8888AA` | Muted text |
| `--success` | `#10B981` | Green states |
| `--warning` | `#F59E0B` | Amber states |
| `--danger` | `#EF4444` | Red states |
| `--info` | `#3B82F6` | Blue states |
