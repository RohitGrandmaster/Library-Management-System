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

==================================================================================

# MODULE 1: Auth & Onboarding
> Prepend `global_design_system.md` before giving to Stitch.
> These pages do NOT use the App Shell (no sidebar, no header).

---

#### `login.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Split-screen — Left half: dark background + abstract library SVG illustration + tagline "Manage Smarter, Grow Faster" + app logo. Right half: centered white/dark card (480px wide, border-radius 16px).
- **Fields:** Email or Phone(`text`, "Email or Phone Number", *req) | Password(`password`, 👁️ show/hide toggle icon on right, *req)
- **Buttons:** "Login" → full-width primary (inside card, below password) | "Forgot Password?" → text link, centered below Login button
- **Bottom of card:** "Don't have an account? Sign Up" → text link
- **Error State:** Red inline message below password field on failed login: "Invalid credentials. Please try again."
- **DB:** `User` (checks `isActive`, `role`)

---

#### `signup.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Same split-screen as login. Right card width: 520px.
- **Fields:** Owner Name(`text`, *req) | Email(`email`, *req) | Phone(`tel`, "+91 9800000000", *req) | Library Name(`text`, "e.g. City Reading Hub", *req) | Password(`password`, with color strength meter bar below: Weak=red/Medium=amber/Strong=green) | Confirm Password(`password`)
- **Buttons:** "Create Account" → full-width primary
- **Bottom of card:** "Already have an account? Login" → text link
- **DB:** `User` (Owner), `Branch`

---

#### `setup-wizard.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Two-panel — Left (280px): Numbered vertical stepper (Steps 1–5, active=indigo highlight, completed=green ✓ icon, future=gray). Right panel: current step form content. Top of right panel: horizontal progress bar (20%→100%).
- **Step 1 — Branch Details:**
  - Library Name(`text`, pre-filled from signup, *req) | Address(`textarea rows=3`, *req) | City(`text`, *req) | GST Number(`text`, "22AAAAA0000A1Z5", optional)
- **Step 2 — Define Shifts:**
  - Dynamic row list: ShiftName(`text`) | StartTime(`time`) | EndTime(`time`) | ✕ Remove button. Pre-filled rows: "Morning 06:00–12:00", "Evening 12:00–18:00". "➕ Add Another Shift" ghost button below rows.
- **Step 3 — Add Seats:**
  - Total Count(`number min=1`, *req) | Prefix(`text maxlength=3`, "A-") | Live preview text: "Seats will be: A-01, A-02, A-03..."
- **Step 4 — Fee Plan:**
  - Plan Name(`text`, "Monthly", *req) | Duration Days(`number`, "30", *req) | Price ₹(`number`, "1000", *req). "➕ Add Another Plan" ghost button.
- **Step 5 — Launch:**
  - Summary card: Library name displayed large | Badges: "[N] Shifts Added", "[N] Seats Created", "[N] Plans Ready". Confetti animation on load.
- **Buttons (each step):** "← Back" ghost (hidden on step 1) | "Next Step →" primary. Step 5 only: "🚀 Launch Dashboard" full-width primary.
- **DB:** `Branch`, `Shift`, `Seat`, `Plan`

---

#### `public-enquiry-form.tsx`
- **Opens As:** Full public page, no login, no app shell. Accessed via QR code scan.
- **Layout:** Full-screen centered card (440px wide). Top of card: library logo + library name (pulled from branch branding). Below: simple clean form. Mobile-first design.
- **Fields:** Name(`text`, "Your Full Name", *req) | Phone(`tel`, "+91 XXXXXXXXXX", *req) | Preferred Shift(`select`, options loaded from active Shifts showing name + timing) | Message(`textarea rows=2`, "Any questions? (optional)")
- **Buttons:** "Submit Enquiry" → full-width primary
- **Post-submit state:** Form replaced by success screen: ✅ large green icon + "Thank you, [Name]!" heading + "We'll contact you on [Phone] shortly." subtext
- **DB:** `Enquiry` (status auto-set to 'new')

---

#### `forgot-password.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Centered card (440px). "← Back to Login" text link above card.
- **Fields:** Phone or Email(`text`, "Your registered phone or email", *req)
- **Helper text below field:** "An OTP will be sent to your registered mobile number."
- **Buttons:** "Send OTP" → full-width primary
- **DB:** `User`

---

#### `reset-password.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Centered card (480px).
- **Fields:**
  - OTP: 6 separate single-character `<input type="text" maxlength="1">` boxes in a row, auto-focus advances to next box on input. Labeled "Enter OTP sent to your phone".
  - New Password(`password`, with strength indicator bar below)
  - Confirm Password(`password`)
- **Buttons:** "Update Password" → full-width primary | "Resend OTP" → text link with countdown timer "Resend in 00:45" (disabled until timer hits 0)
- **DB:** `User`


==================================================================================

# MODULE 02: Admin Dashboard & Analytics

> **Who uses this:** Library Admin (Owner / Branch Manager) — NOT Super Admin, NOT Staff
> All pages use the full Admin App Shell (Admin Sidebar + Admin Header).
> Route group: `src/app/(admin)/`

---

## Access Control

| Role | Access |
|---|---|
| **Admin (Library Owner)** | ✅ Full access — default landing page after login |
| **Super Admin (SaaS Owner)** | ❌ Goes to `/superadmin/dashboard` instead |
| **Manager / Staff** | ❌ Goes to `/students` instead |

---

## Route Group Layout Architecture

### `(admin)/layout.tsx` — Root Theme Wrapper
- **File:** `src/app/(admin)/layout.tsx`
- **Type:** Server Component
- **Purpose:** Wraps all admin pages in `<div className="admin-theme min-h-screen">` which activates all CSS custom property tokens defined in `admin.css`.
- **Imports:** `./admin.css` (the single source of truth for all design tokens — no hex in TSX ever)

### `(admin)/admin/layout.tsx` — Shell Layout
- **File:** `src/app/(admin)/admin/layout.tsx`
- **Type:** Client Component (`'use client'`)
- **State:** `collapsed: boolean` (React `useState`, default `false`) — controls sidebar width
- **Sidebar width values:** `collapsed ? 60 : 240` (pixels, applied via inline `style` — permitted because this is a dynamic runtime value)
- **Structure:**
  ```
  <div class="admin-shell-flex">        // flex row, min-h-screen
    <Sidebar collapsed onToggle />       // fixed, z-40
    <div style={{ marginLeft: sidebarWidth }}>   // flex-1, transition-all 300ms
      <Header sidebarWidth />            // fixed, z-30, top bar
      <main class="admin-shell-content"> // padding: 24px top 88px
        {children}
      </main>
    </div>
  </div>
  ```

---

## Design System — `admin.css` (842 lines)

**File:** `src/app/(admin)/admin.css`
**Rule:** ALL hex values live ONLY in this file. Pages and components NEVER contain hex codes — they use `var(--token)` strings.

### Section 1 — Font
- Google Fonts: `Inter` (weights 400, 500, 600, 700, 800)

### Section 2 — CSS Custom Properties (inside `.admin-theme`)

#### Core Brand
| Token | Value | Usage |
|---|---|---|
| `--primary` | `#6366F1` | Indigo-500 — CTAs, active states, sidebar active |
| `--primary-hover` | `#4F46E5` | Indigo-600 — hover on primary buttons |
| `--primary-subtle` | `rgba(99,102,241,0.08)` | Hover backgrounds on nav items |

#### Backgrounds
| Token | Value |
|---|---|
| `--bg-page` | `#0F0F1A` |
| `--bg-card` | `#1A1A2E` |
| `--bg-sidebar` | `#12121F` |
| `--bg-header` | `#16162A` |
| `--bg-input` | `#1E1E32` |

#### Borders
| Token | Value |
|---|---|
| `--border` | `#2A2A3E` |
| `--border-focus` | `#6366F1` |

#### Text
| Token | Value |
|---|---|
| `--text-primary` | `#F0F0FF` |
| `--text-secondary` | `#8888AA` |
| `--text-disabled` | `#44445A` |

#### Semantic Colors
| Token | Hex | Usage |
|---|---|---|
| `--success` | `#10B981` | Green — paid, free seats, positive trend |
| `--success-bg` | `#064E3B` | Success badge backgrounds |
| `--warning` | `#F59E0B` | Amber — expiring, due |
| `--warning-bg` | `#451A03` | Warning badge backgrounds |
| `--danger` | `#EF4444` | Red — errors, occupied, danger actions |
| `--danger-bg` | `#450A0A` | Danger badge backgrounds |
| `--info` | `#3B82F6` | Blue — info states |
| `--info-bg` | `#1E3A5F` | Info badge backgrounds |
| `--purple` | `#8B5CF6` | UPI mode, misc |
| `--purple-bg` | `#2E1065` | Purple badge backgrounds |
| `--purple-light` | `#A78BFA` | Card payment mode text |

#### Icon Background Tokens (rgba, derived — must stay in CSS)
| Token | Value |
|---|---|
| `--icon-bg-primary` | `rgba(99,102,241,0.12)` |
| `--icon-bg-success` | `rgba(16,185,129,0.12)` |
| `--icon-bg-warning` | `rgba(245,158,11,0.12)` |
| `--icon-bg-danger` | `rgba(239,68,68,0.12)` |
| `--icon-bg-purple` | `rgba(139,92,246,0.12)` |
| `--icon-bg-info` | `rgba(59,130,246,0.12)` |

#### Chart & Overlay Tokens
| Token | Value |
|---|---|
| `--chart-grid-line` | `rgba(255,255,255,0.05)` |
| `--chart-indigo` | `#6366F1` |
| `--chart-green` | `#10B981` |
| `--chart-red` | `#EF4444` |
| `--chart-amber` | `#F59E0B` |
| `--chart-blue` | `#3B82F6` |
| `--chart-purple` | `#8B5CF6` |
| `--chart-area-green` | `rgba(16,185,129,0.15)` |
| `--primary-cursor` | `rgba(99,102,241,0.06)` — Recharts bar hover rect |
| `--tip-box-bg` | `rgba(99,102,241,0.06)` |
| `--tip-box-border` | `rgba(99,102,241,0.15)` |

### Section 3 — Component Classes (`@layer components`, all prefixed `admin-`)

#### Buttons
| Class | Description |
|---|---|
| `.admin-btn-primary` | Indigo bg, white text, 8px radius, hover darkens |
| `.admin-btn-ghost` | Transparent, `--border` border, hover indigo border + subtle bg |
| `.admin-btn-danger` | Red bg, white text, hover opacity 0.88 |
| `.admin-btn-ghost-danger` | Transparent, red border + red text, hover red bg |
| `.admin-btn-icon` | 32×32px icon button, border, hover indigo tint |

#### Form Elements
| Class | Description |
|---|---|
| `.admin-input` | Dark bg, border, 8px radius, focus glow ring via `color-mix` |
| `.admin-select` | Same as input, cursor pointer |
| `.admin-textarea` | Same as input, `resize: vertical` |
| `.admin-label` | 13px, secondary color, `display: block`, `margin-bottom: 6px` |
| `.admin-label-required::after` | Appends ` *` in danger color |
| `.admin-error` | 12px, danger color, `margin-top: 4px` |

#### Cards & Panels
| Class | Description |
|---|---|
| `.admin-card` | `bg-card`, `1px border`, `12px radius` |
| `.admin-card-header` | `16px 20px` padding, bottom border, flex space-between |
| `.admin-card-body` | `20px` padding |

#### Badges
| Class | Description |
|---|---|
| `.admin-badge` | Pill shape (`999px` radius), 2px 10px padding, 11px 600-weight |
| `.admin-badge-success` | Green text + bg + border (30% alpha) |
| `.admin-badge-warning` | Amber text + bg + border |
| `.admin-badge-danger` | Red text + bg + border |
| `.admin-badge-info` | Blue text + bg + border |
| `.admin-badge-purple` | Purple text + bg + border |
| `.admin-badge-primary` | Indigo text + subtle bg + border |

#### Page Typography
| Class | Size/Weight | Color |
|---|---|---|
| `.admin-breadcrumb` | 12px | `--text-secondary` |
| `.admin-page-title` | 22px / 700 | `--text-primary` |
| `.admin-page-subtitle` | 13px | `--text-secondary` |
| `.admin-section-title` | 16px / 600 | `--text-primary` |
| `.admin-caption` | 12px | `--text-secondary` |
| `.admin-text-secondary/danger/warning/success/primary` | Color utilities | — |

#### KPI / Stat Cards
| Class | Description |
|---|---|
| `.admin-kpi-card` | Card with 20px padding, flex column, 12px gap |
| `.admin-kpi-icon` | 36×36px rounded box, flex center |
| `.admin-kpi-label` | 11px uppercase, letter-spacing 0.07em, secondary color |
| `.admin-kpi-value` | 28px / 700, primary color |
| `.admin-kpi-sub` | 12px secondary |
| `.admin-trend-up` | Pill badge — green text + bg, 11px, includes `TrendingUp` icon |
| `.admin-trend-down` | Pill badge — red text + bg, 11px, includes `TrendingDown` icon |

#### Chart Cards
| Class | Description |
|---|---|
| `.admin-chart-card` | Card + 24px padding |
| `.admin-chart-title` | 15px / 600 |
| `.admin-chart-legend-label` | 11px secondary |
| `.admin-chart-badge` | 11px 600, 4px radius, color dynamically set via `style` prop (CSS var string) |

#### Seat Matrix
| Class | Description |
|---|---|
| `.seat-free` | Green tint bg + border, green text |
| `.seat-occupied` | Red tint bg + border, red text |
| `.seat-expiring` | Amber tint bg + border, amber text |
| `.seat-maintenance` | Gray tint bg + border, secondary text |
| `.admin-seat-tooltip` | Absolute positioned, below cell center — opacity 0 → 1 on `.group:hover` |
| `.admin-seat-name` | 12px / 600, primary text |
| `.admin-seat-expiry` | 10px, secondary color |
| `.admin-seat-expiring` | 10px, warning color |
| `.admin-seat-empty` | 11px, secondary color |
| `.admin-shift-morning` | Pill badge — indigo |
| `.admin-shift-evening` | Pill badge — green |
| `.admin-shift-night` | Pill badge — amber |
| `.admin-shift-default` | Pill badge — primary subtle |

#### Tab Bar
| Class | Description |
|---|---|
| `.admin-tab-bar` | Flex row, 4px gap + padding, rounded, dark bg |
| `.admin-tab` | 12px / 500, transparent by default, hover lightens text |
| `.admin-tab.active` | Indigo bg, white text |

#### Filter Bar
| Class | Description |
|---|---|
| `.admin-filter-bar` | Flex wrap, top border, semi-transparent bg |
| `.admin-filter-label` | 12px / 500 secondary |
| `.admin-filter-clear` | Underlined text link, no border/bg |

#### Action Items
| Class | Description |
|---|---|
| `.admin-action-item` | Flex space-between, 14px 16px padding, 8px radius, no-underline link |
| `.admin-action-item-danger` | Red tint bg + 3px red left border, hover deepens |
| `.admin-action-item-warning` | Amber tint bg + 3px amber left border, hover deepens |
| `.admin-action-count-danger` | Bold red count |
| `.admin-action-count-warning` | Bold amber count |

#### Tip Box
| Class | Description |
|---|---|
| `.admin-tip-box` | Flex row, 12px padding, 8px radius, indigo subtle bg + border |
| `.admin-tip-text` | 12px, secondary, line-height 1.5 |

#### Payment Modes
| Class | Description |
|---|---|
| `.mode-upi` | Purple text + bg |
| `.mode-cash` | Blue (info) text + bg |
| `.mode-card` | Purple-light text + purple bg |
| `.mode-bank` | Green text + bg |

#### Avatars
| Class | Size | Description |
|---|---|---|
| `.admin-avatar` | 32×32px | Circular, indigo bg, white 12px 700 text, cursor pointer |
| `.admin-avatar-sm` | 28×28px | Circular, icon-bg-primary, primary color text |

#### Shell Layout
| Class | Description |
|---|---|
| `.admin-shell-flex` | `display: flex`, `min-height: 100vh` |
| `.admin-shell-content` | `padding: 24px`, `padding-top: 88px` (clears fixed header) |
| `.admin-header` | Fixed, `top:0 right:0`, `z-40`, 64px height, bg-header, bottom border, `transition: left 0.3s` |
| `.admin-header-branch` | Flex row, dark bg input bg, border, 8px radius — branch selector pill |
| `.admin-bell-btn` | Relative, 8px padding, no border, secondary color, hover primary |
| `.admin-bell-dot` | 6×6px absolute circle, danger color — notification dot |
| `.admin-sidebar` | Fixed `left:0 top:0`, `z-40`, 100% height, flex column, `transition: width 0.3s`, overflow hidden |
| `.admin-sidebar-logo` | 64px height row, align center, bottom border |
| `.admin-sidebar-logo-text` | 14px / 700, white, no-wrap, text-overflow ellipsis |
| `.admin-menu-btn` | 6px padding, 8px radius, no border, secondary color, flex center |
| `.admin-sidebar-footer` | 12px padding, top border, flex row, gap 8px |
| `.admin-sidebar-user-name` | 13px / 600, primary text, text-overflow ellipsis |
| `.admin-sidebar-user-email` | 12px secondary, text-overflow ellipsis |
| `.admin-logout-btn` | No border/bg, secondary color, hover danger color |
| `.admin-nav-item` | Flex row, 10px 14px padding, 8px radius, 14px / 500, secondary color → hover indigo subtle |
| `.admin-nav-item.active` | Indigo subtle bg, primary color, 3px left indigo border, padding-left 11px |
| `.admin-nav-group-label` | 11px / 600 uppercase, disabled color, letter-spacing 0.08em, 12px 14px 4px padding |

#### Dashboard Specific
| Class | Description |
|---|---|
| `.admin-dashboard-row2` | `grid-template-columns: 3fr 2fr`, 16px gap — breaks to `1fr` at ≤1024px |
| `.admin-recent-amount` | 13px / 700, success color |
| `.admin-recent-time` | 12px secondary |
| `.admin-name-cell` | 13px / 500, primary text |

#### Empty State
| Class | Description |
|---|---|
| `.admin-empty-state` | Flex column center, 48px 24px padding, text-center |
| `.admin-empty-icon` | 40px font-size, 12px bottom margin |
| `.admin-empty-title` | 16px / 600, secondary, 6px bottom margin |
| `.admin-empty-sub` | 13px secondary, 16px bottom margin |

### Section 4 — AG Grid Tokens (on `:root`)
| Token | Value |
|---|---|
| `--ag-bg` | `#1A1A2E` |
| `--ag-fg` | `#F0F0FF` |
| `--ag-header-bg` | `rgba(99,102,241,0.08)` |
| `--ag-header-text` | `#8888AA` |
| `--ag-border` | `#2A2A3E` |
| `--ag-odd-row-bg` | `rgba(255,255,255,0.02)` |
| `--ag-row-hover` | `rgba(99,102,241,0.06)` |
| `--ag-font` | `Inter, sans-serif` |

---

## Shell Components

### `Sidebar.tsx`
- **File:** `src/app/(admin)/admin/Sidebar.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:** `{ collapsed: boolean; onToggle: () => void }`
- **Width:** Inline style `width: collapsed ? 60 : 240` (dynamic runtime value — only permitted inline use)
- **Active Detection:** `usePathname()` — `pathname === item.href || pathname.startsWith(item.href + '/')`
- **Logo Row:** Menu hamburger button (`<Menu size={18}>`), logo text `📚 Smart Library 360` (hidden when collapsed)
- **User Footer (hidden when collapsed):**
  - Avatar `LA` (hardcoded initials placeholder)
  - Name: `Library Admin`, Email: `admin@library.com`
  - Logout button (`<LogOut size={14}>`)

#### Full Navigation Groups & Items

| Group | Route | Icon | Label |
|---|---|---|---|
| _(root)_ | `/admin/dashboard` | `LayoutDashboard` | Dashboard |
| _(root)_ | `/admin/reports` | `BarChart2` | Reports |
| **CRM** | `/enquiries` | `Phone` | Enquiries |
| **Students** | `/students` | `Users` | All Students |
| | `/students/new` | `UserPlus` | New Admission |
| | `/students/group` | `Users2` | Group Admission |
| | `/students/alumni` | `UserCheck` | Alumni |
| | `/documents` | `FolderOpen` | Document Vault |
| | `/students/referrals` | `Award` | Referral Bonus |
| **Seats & Shifts** | `/seat-matrix` | `LayoutGrid` | Seat Matrix |
| | `/seat-management` | `Armchair` | Seats |
| | `/shift-management` | `RefreshCw` | Shifts |
| | `/shift-migration` | `ArrowLeftRight` | Shift Migration |
| | `/allocations` | `ClipboardList` | Allocations |
| | `/seat-history` | `History` | Seat History |
| | `/lockers` | `Lock` | Lockers |
| | `/locker-matrix` | `LayoutGrid` | Locker Matrix |
| **Finance** | `/collect-fee` | `IndianRupee` | Collect Fee |
| | `/subscriptions` | `FileText` | Subscriptions |
| | `/renewals` | `RotateCcw` | Renewals |
| | `/payments` | `CreditCard` | Payments |
| | `/payment-promises` | `Handshake` | Payment Promises |
| | `/trust-score` | `Shield` | Trust Scores |
| | `/security-deposits` | `Wallet` | Security Deposits |
| | `/late-fees` | `Clock` | Late Fees |
| | `/auto-suspend` | `Ban` | Auto-Suspend |
| | `/invoice` | `Receipt` | Invoice |
| | `/refunds` | `DollarSign` | Refunds |
| **Operations** | `/attendance` | `CalendarCheck` | Attendance |
| | `/absentee-report` | `ClipboardCheck` | Absentee Report |
| | `/qr-scanner` | `QrCode` | QR Scanner |
| | `/holiday-calendar` | `Calendar` | Holiday Calendar |
| **Accounts & Assets** | `/expenses` | `TrendingUp` | Expenses |
| | `/financial-reports` | `BarChart` | Financial Reports |
| | `/daily-settlement` | `Receipt` | Daily Settlement |
| | `/seat-gap-report` | `LayoutGrid` | Seat Gap Report |
| | `/assets` | `Settings` | Assets |
| | `/asset-maintenance` | `Settings` | Asset Maintenance |
| **Communication** | `/notices` | `Bell` | Notices |
| | `/complaints` | `MessageSquare` | Complaints |
| | `/notification-center` | `BellRing` | Notification Center |
| | `/whatsapp-logs` | `Smartphone` | WhatsApp Logs |
| | `/whatsapp-templates` | `Smartphone` | WhatsApp Templates |
| **Admin** | `/admin/branches` | `Building2` | Branches |
| | `/admin/staff-users` | `Users` | Staff & Users |
| | `/admin/permissions` | `Key` | Permissions |
| | `/admin/plans` | `FileText` | Plans |
| | `/admin/coupons` | `Tag` | Coupons |
| | `/waitlist` | `ListOrdered` | Waitlist |
| | `/admin/blacklist` | `AlertOctagon` | Blacklist |
| | `/admin/audit-logs` | `History` | Audit Logs |
| | `/bulk-import` | `FileUp` | Bulk Import |
| | `/data-export` | `Download` | Data Export |
| | `/backups` | `Database` | Backups |
| **System** | `/settings` | `Settings` | Settings |
| | `/profile` | `User` | Profile |
| | `/branding` | `Palette` | Branding |
| | `/whatsapp-integration` | `Smartphone` | WhatsApp Integration |

> **Note:** All non-`/admin/*` routes in the sidebar do NOT yet have corresponding pages inside the `(admin)` folder — they are future stubs.

### `Header.tsx`
- **File:** `src/app/(admin)/admin/Header.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:** `{ sidebarWidth: number }`
- **Position:** Fixed, `top:0 right:0`, `z-30`, 64px height
- **`left` value:** `style={{ left: sidebarWidth }}` (dynamic inline — shifts with sidebar collapse)
- **Left side:** Branch selector pill — `<Building2>` icon + "Main Branch" text + `<ChevronDown>` icon. Styled with `admin-header-branch` (dark input bg + border).
- **Right side:** Bell button (`admin-bell-btn`) with `admin-bell-dot` (6px danger-color circle) + `admin-avatar` "LA"

---

## Reusable Components — `(admin)/reusable/`

### `KpiCard.tsx`
- **File:** `src/app/(admin)/reusable/KpiCard.tsx`
- **Type:** Server Component (no `'use client'`)
- **Props:**
  ```ts
  {
    label: string;
    value: string;
    icon: LucideIcon;
    iconColor: string;   // MUST be a CSS token string e.g. 'var(--primary)'
    iconBg: string;      // MUST be a CSS token string e.g. 'var(--icon-bg-primary)'
    trend?: { value: string; up: boolean };
    sub?: string;
  }
  ```
- **Layout:** Top row: icon box (inline `style={{ background: iconBg }}`) + trend badge (right-aligned). Bottom: label + value + optional sub text.
- **Trend:** `admin-trend-up` (green, `<TrendingUp>`) or `admin-trend-down` (red, `<TrendingDown>`)

### `ChartCard.tsx`
- **File:** `src/app/(admin)/reusable/ChartCard.tsx`
- **Type:** Server Component
- **Props:**
  ```ts
  {
    title: string;
    badge?: string;
    badgeColor?: string;  // CSS token string e.g. 'var(--success)'
    legend?: { label: string; color: string }[];
    children: React.ReactNode;
  }
  ```
- **Layout:** Header row: title (left) + legend dots + badge (right). Children rendered below (chart goes here).
- **Legend dots:** `12px 12px` colored circle via `style={{ background: l.color }}` (dynamic, must be CSS var string from data)

### `SeatMatrixGrid.tsx`
- **File:** `src/app/(admin)/reusable/SeatMatrixGrid.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:** `{ seats: SeatData[]; shifts: string[] }`
- **`SeatData` interface:**
  ```ts
  {
    id: string;
    shift: string;
    status: 'free' | 'occupied' | 'expiring' | 'maintenance';
    fee: 'Paid' | 'Due';
    occupant?: string;
    expiry?: string;
    studentId?: string;
  }
  ```
- **State:**
  - `activeShift` — tab filter (triggers immediate visual filter)
  - `feeFilter` — pending fee filter (staged, not applied until button click)
  - `appliedFee` — currently-active fee filter
  - `appliedShift` — currently-active shift filter from the bottom select
- **Filter logic:** `tabMatch && feeMatch && shiftMatch` (triple AND)
- **Counts:** Dynamic label → `occupied + expiring` / `free` / `expiring` / `maintenance`
- **Grid:** `grid-template-columns: repeat(auto-fill, 64px)` (dynamic computed → inline `style` allowed), gap 12px
- **Cell click:** `occupied/expiring` → `router.push('/students/{studentId}')` (or `/students` if no ID). `free` → `router.push('/students/new')`
- **Filter bar (bottom):** Shift `<select>` + Fee Status `<select>` + "Apply Filter" button (`handleApply` sets `appliedFee = feeFilter`). "Clear" text link (shown when any filter active, resets all)
- **Legend row:** Pills — Free (green) / Occupied (red) / Expiring ≤7d (amber) / Maintenance (gray)

### `SeatCell.tsx`
- **File:** `src/app/(admin)/reusable/SeatCell.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:** `{ id, status, occupant?, shift?, expiry?, onClick? }`
- **Classes:** `seat-{status} group relative w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105`
- **Content:** `<span class="font-bold text-xs">{id}</span>` + tooltip div
- **Tooltip (`.admin-seat-tooltip`):** Shows on `.group:hover` via `opacity 0→1`
  - If `occupant`: Name (`admin-seat-name`) + shift badge (`.admin-shift-{morning|evening|night|default}`) + expiry (`admin-seat-expiring` if status=expiring, else `admin-seat-expiry`)
  - If no occupant: `admin-seat-empty` text — "Free — click to assign" or "Under Maintenance"
- **Shift class helper:** `getShiftClass(shift)` — maps Morning/Evening/Night to CSS classes, falls back to `admin-shift-default`

### `ActionItemsList.tsx`
- **File:** `src/app/(admin)/reusable/ActionItemsList.tsx`
- **Type:** Server Component
- **Props:** `{ items: ActionItem[] }`
- **`ActionItem` interface:** `{ icon: LucideIcon; label: string; count: number; type: 'danger' | 'warning'; href: string; }`
- **Renders:** `<Link>` tags styled as `admin-action-item admin-action-item-{danger|warning}`
- **Each item:** Icon (colored by type) + count (bold, colored) + label text + `<ChevronRight>` on far right

### `RecentPaymentsFeed.tsx`
- **File:** `src/app/(admin)/reusable/RecentPaymentsFeed.tsx`
- **Type:** Client Component (`'use client'`)
- **Props:** `{ payments: Payment[] }`
- **`Payment` interface:** `{ name, initials, amount, mode: 'UPI'|'Cash'|'Card'|'Bank Transfer', timeAgo, studentId? }`
- **Library:** AG Grid (`AgGridReact`) with `AllCommunityModule` registered globally
- **Theme:** `gridTheme` from `./gridTheme.ts` (reads all values from `--ag-*` CSS vars)
- **Grid config:** `rowHeight: 48`, `headerHeight: 38`, `suppressMovableColumns`, `suppressCellFocus`, `pagination: false`, `rowStyle: { cursor: 'pointer' }`, container height `300px` (inline — dynamic layout value)
- **Columns:**
  | Field | Header | Renderer |
  |---|---|---|
  | `name` | STUDENT NAME | `NameCell` — avatar-sm initials + name text |
  | `amount` | AMOUNT | `AmountCell` — `.admin-recent-amount` (green, bold) |
  | `mode` | MODE | `ModeCell` — `.admin-badge .mode-{upi|cash|card|bank}` |
  | `timeAgo` | TIME | `TimeCell` — `.admin-recent-time` (secondary, 12px) |
- **Row click:** `router.push('/students/{studentId}')` if `studentId` exists
- **"View Report" link:** `href="/payments"` + `<ExternalLink size={12}>`

### `gridTheme.ts`
- **File:** `src/app/(admin)/reusable/gridTheme.ts`
- **Library:** `ag-grid-community` (`themeQuartz`)
- **Pattern:** `v(name)` helper reads `getComputedStyle(document.documentElement).getPropertyValue(name)` — returns `''` if `typeof window === 'undefined'` (SSR safe)
- **Zero hardcoded values** — all come from `--ag-*` CSS vars on `:root`

---

## Pages

### Dashboard — `page.tsx`
- **Route:** `/admin/dashboard`
- **File:** `src/app/(admin)/admin/dashboard/page.tsx`
- **Type:** Server Component (no `'use client'`)
- **Data:** `import data from '../../dashboard/hardcoded.json'`

#### KPI Cards (Row 1 — 4-column grid)
| # | Label | Icon | Color Token | Bg Token |
|---|---|---|---|---|
| 0 | Active Students | `Users` | `--primary` | `--icon-bg-primary` |
| 1 | Today's Collection | `IndianRupee` | `--success` | `--icon-bg-success` |
| 2 | Occupied Seats | `Armchair` | `--warning` | `--icon-bg-warning` |
| 3 | Pending Actions | `AlertCircle` | `--danger` | `--icon-bg-danger` |

- Each card uses `<KpiCard>` with `label`, `value`, icon from `KPI_META`, `trend: { value, up }`, `sub`.

#### Row 2 — Dashboard Grid (`.admin-dashboard-row2`, `3fr 2fr`)

**Left (60%) — Seat Matrix:**
- `<SeatMatrixGrid seats={data.seats} shifts={data.shifts} />`

**Right (40%) — Action Items card (`admin-card`):**
- Header: "Action Items" title + `{sum of all counts} items need your attention` caption
- Body: `<ActionItemsList items={actionItems} />`
- `ACTION_ICONS` map: `{'Fee Renewals Due': RotateCcw, 'New Enquiries': Phone, 'Complaint Open': MessageSquare, 'PTP Dates Today': Handshake}`
- Falls back to `AlertCircle` for unmapped labels
- Tip box (`.admin-tip-box`): 💡 emoji + renewal reminder message
- Footer: Ghost link → `/admin/audit-logs` "View All Activities"

#### Row 3 — Recent Payments
- `<RecentPaymentsFeed payments={data.recentPayments} />`

#### Header bar (page top)
- Breadcrumb: `Smart Library 360 › Admin › Dashboard`
- Page title: `Dashboard`
- Subtitle: `Welcome back — here's what's happening today.`
- Right: Ghost link → `/admin/reports` "View Full Reports ›"

#### Data Shape — `dashboard/hardcoded.json`
- `kpiCards[]`: `{ label, value, trend: { value, up }, sub }`
- `seats[]`: `SeatData` objects
- `shifts[]`: string array
- `actionItems[]`: `{ label, count, type, href }`
- `recentPayments[]`: `Payment` objects

#### DB: `Student`, `Payment`, `Seat`, `Subscription`, `Enquiry`, `Complaint`

---

### Reports — `page.tsx`
- **Route:** `/admin/reports`
- **File:** `src/app/(admin)/admin/reports/page.tsx`
- **Type:** Client Component (`'use client'`) — needs `useState` for filters
- **Data:** `import data from '../../reports/hardcoded.json'`

#### Top Bar
- Breadcrumb: `Smart Library 360 › Admin › Reports`
- Page title: `Analytics & Reports`
- Subtitle: `Financial health and operational overview`
- **Range `<select>`** — `type Range = 'thisMonth' | 'last3Months' | 'thisYear'`, default `'last3Months'`
- **Branch `<select>`** — options: All Branches / Main Branch / Branch 2
- **"Export PDF" button** — `admin-btn-ghost`, triggers `toast.success(...)` (react-hot-toast)
- **"Export Excel" button** — same toast pattern

#### `<Toaster>` config (bottom-right)
- `style`: `bg-card` bg, `text-primary` color, `--border` border, 13px font

#### KPI Cards (4-column grid)
| # | Label | Icon | Color Token | Bg Token |
|---|---|---|---|---|
| 0 | Total Revenue | `IndianRupee` | `--primary` | `--icon-bg-primary` |
| 1 | Total Expenses | `Wallet` | `--danger` | `--icon-bg-danger` |
| 2 | Net Profit | `TrendingUp` | `--success` | `--icon-bg-success` |
| 3 | Active Students | `Users` | `--purple` | `--icon-bg-purple` |

#### Recharts Shared Config
- **`AXIS_TICK`:** `{ fill: 'var(--text-secondary)', fontSize: 11 }`
- **`TOOLTIP_STYLE`:** contentStyle bg/border/color from CSS vars, `cursor.fill: 'var(--primary-cursor)'`

#### Chart Grid (`1×2 lg:grid-cols-2`)

**Chart 1 — Income vs Expenses (top-left):** `<BarChart>` grouped
- Data: `data.incomeVsExpense[range]` — `{ month, income, expense }`
- Bars: Income = `var(--chart-indigo)`, Expense = `var(--chart-red)`, `radius [4,4,0,0]`, `maxBarSize 28`, `barGap 4`
- Y formatter: `₹{n/1000}k`
- Tooltip formatter: `₹{n.toLocaleString('en-IN')}`
- Legend prop: `[{label:'Income', color:'var(--chart-indigo)'}, {label:'Expense', color:'var(--chart-red)'}]`

**Chart 2 — Shift-wise Occupancy % (top-right):** `<PieChart>` donut
- Data: `data.shiftOccupancy` — `{ name, value, color }` (color = CSS var string from JSON)
- `innerRadius 55`, `outerRadius 85`, `paddingAngle 4`
- Cells: `{data.shiftOccupancy.map((e, i) => <Cell fill={e.color} />)}`
- Legend: `iconType="circle"`, `iconSize 8`, 11px secondary color
- Tooltip formatter: `${v}%`

**Chart 3 — Monthly Revenue Trend (bottom-left):** `<AreaChart>`
- Data: `data.revenueTrend[range]` — `{ month, revenue }`
- SVG gradient `id="revGrad"`: `var(--chart-green)` 25%→0% opacity
- Area: `stroke var(--chart-green)`, `strokeWidth 2`, `fill="url(#revGrad)"`, `dot {fill, r:3}`, `activeDot {r:5}`
- Badge: `RANGE_OPTIONS.find(o => o.key === range)?.label`, color `var(--success)`
- Y formatter: `₹{n/1000}k`

**Chart 4 — Student Growth (bottom-right):** `<BarChart>` grouped
- Data: `data.studentGrowth[range]` — `{ month, joined, exited }`
- Bars: Joined = `var(--chart-indigo)`, Exited = `var(--chart-red)`, same radius/maxBarSize
- Legend prop: `[{label:'Joined', color:'var(--chart-indigo)'}, {label:'Exited', color:'var(--chart-red)'}]`

#### Data Shape — `reports/hardcoded.json`
- `kpiCards[]`: `{ label, value, trend: { value, up }, sub }`
- `incomeVsExpense`: `{ thisMonth, last3Months, thisYear }` each = `{ month, income, expense }[]`
- `revenueTrend`: `{ thisMonth, last3Months, thisYear }` each = `{ month, revenue }[]`
- `studentGrowth`: `{ thisMonth, last3Months, thisYear }` each = `{ month, joined, exited }[]`
- `shiftOccupancy[]`: `{ name, value, color }` — color is CSS var string

#### DB: `Payment`, `Expense`, `StudentSlot`

---

## Admin Sub-Pages (Stub Status)

> These routes are registered in the Sidebar NAV and have `page.tsx` files, but are currently **stub placeholders** — content is a single `<div>` text. All need full implementation.

| Route | File | Stub Text |
|---|---|---|
| `/admin/branches` | `admin/branches/page.tsx` | `Branch Manager` |
| `/admin/plans` | `admin/plans/page.tsx` | `Plan Manager` |
| `/admin/coupons` | `admin/coupons/page.tsx` | `Coupon Manager` |
| `/admin/staff-users` | `admin/staff-users/page.tsx` | `Staff Users` |
| `/admin/permissions` | `admin/permissions/page.tsx` | `Permissions Config` |
| `/admin/audit-logs` | `admin/audit-logs/page.tsx` | `Audit Logs` |
| `/admin/blacklist` | `admin/blacklist/page.tsx` | `Blacklist Manager` |



==================================================================================

# MODULE 03: CRM & Enquiries

> **Who uses this:** Library Admin (Owner / Branch Manager) — tracks leads, manages enquiry pipeline
> All pages use the full Admin App Shell (Admin Sidebar + Admin Header).
> Route group: `src/app/(crm)/`
> Sidebar entry: **CRM → Enquiries** (`/enquiries`) under the `(admin)` shell

---

## Access Control

| Role | Access |
|---|---|
| **Admin (Library Owner)** | ✅ Full access |
| **Manager / Staff** | ✅ Read + Add (as configured via Permissions module) |
| **Super Admin** | ❌ Not relevant — SaaS-level, not library-level |

---

## Overview

The CRM module is the lead/enquiry pipeline for the library. It tracks prospective students from first contact through to admission (or loss). The three core views are:

1. **Enquiry Pipeline page** — Kanban + Table toggle, lists all leads
2. **Add Enquiry drawer** — Slide-in drawer to create a new lead
3. **Enquiry Details page** — Full lead profile with timeline and action panel

---

## Pages

### 1. Enquiry Pipeline — `page.tsx`
- **Route:** `/enquiries`
- **File:** `src/app/(crm)/enquiries/page.tsx`
- **Opens As:** Full page (default view for CRM section)

#### Top Bar
| Element | Type | Details |
|---|---|---|
| Search | `<input type="search">` | Placeholder: "Name or phone", filters list in both views |
| Status filter | `<select>` | Options: All / New / Visited / Interested / Converted / Lost |
| "➕ Add Enquiry" | Primary button | Opens `add-enquiry.tsx` drawer (slide-in from right) |

#### View Toggle
- Icon buttons top-right: **Kanban** (default) ↔ **Table**
- State persisted in component-level `useState`

---

#### Kanban View (Default)
- 5 horizontally-scrollable columns
- Column order: `New` → `Visited` → `Interested` → `Converted` → `Lost`

**Column Header:**
- Status label (bold)
- Lead count badge

**Lead Card (inside each column):**
| Field | Display |
|---|---|
| Name | Bold, top of card |
| Phone | Masked: `98****0022` format |
| Preferred Shift | Colored badge (Morning / Evening / Night) |
| Date Added | `DD/MM/YY` format, secondary color |
| Follow-up Due badge | 🔴 Overdue (past date) / 🟡 Today / 🟢 Upcoming |

**Card Interaction:**
- Click any card → navigate to `enquiry-details.tsx` for that lead (`/enquiries/[id]`)
- Cards should be draggable between columns (Kanban DnD — future enhancement)

---

#### Table View
**Columns (L→R):**

| # | Column | Notes |
|---|---|---|
| 1 | `#` | Row number |
| 2 | Name | Bold text |
| 3 | Phone | Masked format `98****0022` |
| 4 | Preferred Shift | Badge |
| 5 | Status | Colored status badge (New/Visited/Interested/Converted/Lost) |
| 6 | Handled By | Staff name |
| 7 | Date Added | `DD/MM/YY` |
| 8 | Follow-up Due | Date, colored if overdue |
| 9 | Actions | Three inline icon buttons: 👁️ View → `/enquiries/[id]` \| ✅ Convert → new-admission.tsx with prefill \| ❌ Mark Lost → confirmation modal |

---

#### Empty State
- Icon: 📞
- Title: "No enquiries yet. Add your first lead."
- Button: "➕ Add Enquiry" (primary, same action as top bar button)

#### DB: `Enquiry`

---

### 2. Add Enquiry Drawer — `page.tsx` (or modal)
- **Route:** `/enquiries/add`
- **File:** `src/app/(crm)/enquiries/add/page.tsx`
- **Opens As:** Right slide-in drawer — **480px wide**, triggered from Enquiry Pipeline page's "Add Enquiry" button

#### Drawer Structure
```
┌─────────────────────────────────────── (480px) ─┐
│ Header: "New Enquiry"        [✕ close button]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Form fields — single column]                  │
│                                                 │
├─────────────────────────────────────────────────┤
│ Footer: [Cancel ghost]  [💾 Save Lead primary]  │
└─────────────────────────────────────────────────┘
```

#### Form Fields

| Field | Type | Placeholder | Required | Notes |
|---|---|---|---|---|
| Name | `text` | "Full Name" | ✅ Yes | |
| Phone | `tel` | "+91 XXXXXXXXXX" | ✅ Yes | 10-digit validation |
| Preferred Shift | `select` | — | No | Options populated from active Shifts in system |
| Source | `select` | — | No | Walk-in / WhatsApp / Referral / Social Media / Phone Call / Other |
| Handled By | `select` | — | No | Options from active staff Users |
| Notes | `textarea rows=3` | "Initial remarks... (optional)" | No | Free text |

#### Buttons
| Button | Action |
|---|---|
| "Cancel" (ghost) | Closes the drawer without saving |
| "💾 Save Lead" (primary) | Validates + creates `Enquiry` record, closes drawer, refreshes pipeline |

#### DB: `Enquiry`

---

### 3. Enquiry Details — `[id]/page.tsx`
- **Route:** `/enquiries/[id]`
- **File:** `src/app/(crm)/enquiries/[id]/page.tsx`
- **Opens As:** Full page — navigated to by clicking any lead card or the 👁️ View action

#### Layout — Two-Column (`60% / 40%`)

```
┌─────────────────────────┬──────────────────────┐
│  LEFT 60%               │  RIGHT 40% (sticky)  │
│  ─────────────          │  ──────────────────   │
│  Lead Info Card  ↑      │  Current Status       │
│  (name, phone,          │  <select> + Update    │
│   source, shift,        │  ─ divider ─          │
│   handled by,           │  Add Follow-Up        │
│   date, status)         │  date + remark        │
│                         │  + ➕ button          │
│  Timeline  ↓            │  Next Follow-up date  │
│  (newest on top)        │  ─ divider ─          │
│  dot + date + remark +  │  ✅ Convert button    │
│  "by [Staff]" caption   │  ❌ Mark as Lost btn  │
└─────────────────────────┴──────────────────────┘
```

---

#### Left Column

**Lead Info Card (top):**
| Field | Display |
|---|---|
| Name | `<h1>` — bold, large |
| Phone | Displayed (full, unmasked on detail page) |
| Source | Badge (Walk-in / WhatsApp / Referral / Social Media / Phone Call / Other) |
| Preferred Shift | Colored badge |
| Handled By | Staff name |
| Date Added | Formatted date |
| Status | Colored status badge |
| Edit icon | Inline edit icon — quick update for "Handled By" and "Preferred Shift" fields |

**Timeline (below info card, newest first):**

Each timeline entry:
```
● [date bold]  Remark text
               by [Staff Name]   ← secondary color caption
```
- Vertical connector line between dots
- Dot color matches entry type (follow-up = indigo, status change = amber, conversion attempt = green, loss = red)

---

#### Right Column (sticky — does not scroll)

**Current Status block:**
- `<select>` dropdown: `New` / `Visited` / `Interested` / `Converted` / `Lost`
- "Update Status" button — saves selection, adds a timeline entry

**Divider**

**Add Follow-Up mini-form:**
| Field | Type | Notes |
|---|---|---|
| Date | `<input type="date">` | Required |
| Remark | `<textarea rows=2>` | Free text |

- "➕ Add Follow-Up" primary button — saves remark, appends to timeline, updates next follow-up date

**Next Follow-up date display:**
- Shows next scheduled follow-up date
- Edit icon to change date inline

**Divider**

**Convert to Admission button:**
- Label: "✅ Convert to Admission"
- Style: Full-width, primary green button
- Action: Navigates to `new-admission.tsx` (`/students/new`) with `Name` + `Phone` pre-filled via query params or state
- Also updates `convertedToStudent` field on `Enquiry` record

**Mark as Lost button:**
- Label: "❌ Mark as Lost"
- Style: Full-width, ghost danger button
- Action: Opens confirmation modal

---

#### "Mark as Lost" Confirmation Modal

```
┌─────────────────────────────────────────────────┐
│  Mark this enquiry as lost?                     │
│                                                 │
│  Optional reason:                               │
│  ┌─────────────────────────────────────────┐    │
│  │  <textarea>                             │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│        [Cancel]         [Mark Lost 🔴]          │
└─────────────────────────────────────────────────┘
```
- Cancel: Closes modal, no changes
- "Mark Lost" (red): Updates `Enquiry.status = 'Lost'`, stores reason, adds timeline entry, returns to `/enquiries`

#### DB: `Enquiry`, `Student`

---

## Data Model — `Enquiry`

| Field | Type | Notes |
|---|---|---|
| `id` | UUID / string | Primary key |
| `name` | string | Full name of prospect |
| `phone` | string | `+91XXXXXXXXXX` format |
| `preferredShift` | string | FK to Shift |
| `source` | enum | `Walk-in \| WhatsApp \| Referral \| Social Media \| Phone Call \| Other` |
| `handledBy` | string | FK to User (staff) |
| `status` | enum | `New \| Visited \| Interested \| Converted \| Lost` |
| `notes` | string? | Initial remarks |
| `followUpDate` | date? | Next scheduled follow-up |
| `convertedToStudent` | string? | FK to Student (set on conversion) |
| `createdAt` | timestamp | Date added |
| `timeline[]` | array | `{ date, remark, by: staffName, type }` |

---

## Navigation Flow

```
/enquiries  (pipeline)
    │
    ├── Click "Add Enquiry" ──────► Add Enquiry Drawer (480px slide-in)
    │                                           │
    │                                    Save Lead ──► refreshes /enquiries
    │
    ├── Click lead card (Kanban) ──► /enquiries/[id]  (details page)
    │                                           │
    │                                    "Convert to Admission"
    │                                           │
    │                                           └──► /students/new?name=...&phone=...
    │
    └── Click 👁️ View (Table) ──────► /enquiries/[id]
```

---

## Status Badge Colors

| Status | Color Token | Background Token |
|---|---|---|
| New | `--info` (blue) | `--info-bg` |
| Visited | `--warning` (amber) | `--warning-bg` |
| Interested | `--purple` | `--purple-bg` |
| Converted | `--success` (green) | `--success-bg` |
| Lost | `--danger` (red) | `--danger-bg` |

---

## Sidebar Integration

The CRM module is accessible via the Admin Sidebar under the **CRM** group:

| Group | Route | Icon | Label |
|---|---|---|---|
| CRM | `/enquiries` | `Phone` | Enquiries |

> The CRM sidebar entry lives inside `(admin)/admin/Sidebar.tsx` in the `NAV` array. Additional CRM sub-routes (`/enquiries/add`, `/enquiries/[id]`) are nested and do not appear as separate sidebar items — they are page-level navigations within the CRM flow.

---

## Implementation Status

| Page | File | Status |
|---|---|---|
| Enquiry Pipeline | `src/app/(crm)/enquiries/page.tsx` | 🚧 To be implemented |
| Add Enquiry Drawer | `src/app/(crm)/enquiries/add/page.tsx` | 🚧 To be implemented |
| Enquiry Details | `src/app/(crm)/enquiries/[id]/page.tsx` | 🚧 To be implemented |

> **Note from previous session (Conversation 16a687e0):** The CRM module was being rebuilt as a fully feature-based, self-contained, and portable module. The architecture requires:
> - No external imports (fully isolated `(crm)` folder)
> - Tech stack: Next.js 16, TypeScript 5, Tailwind 4, Lucide React
> - Strict adherence to the global design system (CSS token strings only in TSX, no hex)
> - Enquiry Pipeline, Add Enquiry drawer, and Enquiry Details page all scoped within `src/app/(crm)/`



==================================================================================

# MODULE 4: Students & Admission
> Prepend `global_design_system.md` before giving to Stitch.
> All pages use the full App Shell.

---

#### `students.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table with top action bar.
- **Table Columns (L→R):** Smart ID | Photo (32px avatar circle) | Name | Phone | Shift | Seat # | Status Badge | Plan Name | Due ₹ (red text if >0) | Join Date | Actions ("👁️ View", "✏️ Edit")
- **Top Bar:** Search(`search`, "Name, phone, Smart ID") | Shift `<select>` | Status `<select>` (Active/Suspended/Exited/All) | "➕ New Admission" primary | "📤 Export" ghost
- **Row click:** → `student-profile.tsx`
- **Empty State:** 🎓 icon + "No students yet. Start by admitting your first student." + "➕ New Admission"
- **DB:** `Student`

---

#### `new-admission.tsx`
- **Opens As:** Full page
- **Layout:** Full-width form. 4 labeled sections divided by horizontal rules + section headings. Two-column grid layout within each section (except Section 2 which is a dropzone layout).
- **Section 1 — Personal Information:**
  - Smart ID(`text`, readonly, auto-filled shows "LIB003" + small gray "↩ Gap slot reused" badge beside it)
  - Name(`text`, *req) | Phone(`tel`, *req) → On blur: auto-checks Blacklist → ✅ "Clear" green badge OR 🔴 "BLACKLISTED: [reason]" danger banner that disables the submit button
  - Parent Phone(`tel`) | Email(`email`) | College / Preparing For(`text`)
  - Referred By(`search` with autocomplete, searches existing students by name/Smart ID, shows selected student as a chip with ✕)
- **Section 2 — Photo & Documents:**
  - Student Photo: Dashed-border image dropzone (drag-and-drop or click-to-browse). Shows thumbnail preview after upload. (*req)
  - Aadhar Card(`file`, accepts .pdf/.jpg/.jpeg/.png) — shows file name after selection
  - ID Proof(`file`, accepts .pdf/.jpg/.jpeg/.png)
- **Section 3 — Seat & Shift Allocation:**
  - Slot Type: Radio buttons — "🕐 Fixed Shift" | "⏱️ Custom Time Slots"
  - If Fixed Shift selected: Shift `<select>` (shows shift name + time + available seat count per option, *req) → Seat `<select>` (dynamically filtered, shows only conflict-free seats labeled "Available", *req) → Locker `<select>` (optional, shows available lockers only)
  - If Custom Slots selected: Dynamic row list — Each row: StartTime(`time`) + EndTime(`time`) + Days checkboxes (M T W T F S) + ✕ Remove. "➕ Add Time Slot" ghost button below.
- **Section 4 — Fee & Payment:**
  - Plan(`select`, "Plan Name — ₹Price (N days)", *req)
  - Base Amount(`number`, readonly, auto-filled from plan selection)
  - Manual Discount ₹(`number`, "0", optional)
  - Coupon Code(`text`, "Enter promo code") + "Apply" button → ✅ "NEWYEAR50 applied: ₹50 off" OR ❌ "Invalid or expired code"
  - Security Deposit ₹(`number`, "0", optional)
  - Total Payable: Read-only display area (large bold, updates live as values change)
  - Amount Paid Now(`number`, *req)
  - Due Amount: Read-only display with red badge if >0 (e.g., "Due: ₹500")
  - Payment Mode: Segmented button group — Cash | UPI | Card | Bank Transfer
  - Transaction ID(`text`, visible + *req ONLY when UPI/Card/Bank selected)
  - Remark(`textarea rows=2`, optional)
- **Buttons:** "🚫 Cancel" ghost (bottom-left) | "✅ Confirm Admission & Generate ID" primary large (bottom-right)
- **Post-submit Success Modal:** Full-screen overlay with animated checklist: "✅ Smart ID LIB003 assigned" | "✅ ID Card generated" | "✅ Welcome WhatsApp sent" | "✅ Receipt #124 created" → "👤 View Student Profile" primary button
- **DB:** `Student`, `StudentSlot`, `Subscription`, `Payment`, `SecurityDeposit`, `IDCard`, `WhatsAppMessage`, `Blacklist`

---

#### `group-admission.tsx`
- **Opens As:** Full page
- **Layout:** Full-width. Top card: Group metadata section. Below: Dynamic student rows table. Right sticky sidebar (280px): Running totals summary card.
- **Top Section Fields:** Group Name/College(`text`, *req) | Common Plan(`select`, *req) | Group Discount %(`number`, 0–50, *req) + live preview "Each student saves ₹X" | Common Shift(`select`, optional — if same for all)
- **Student Rows Table (dynamic):** Columns: # | Name(`text`) | Phone(`tel`) | Shift(`select`) | Seat(`select`, conflict-free) | Amount Paid(`number`) | Mode(`select`) | ✕. "➕ Add Student Row" ghost below table. Min 2 rows, max 20.
- **Right Summary Card:** Total Students | Total Fees (pre-discount) ₹ | Group Discount ₹ | Grand Total ₹ | Per-student amount ₹
- **Buttons:** "🚫 Cancel" ghost | "✅ Admit Group" primary
- **Confirmation:** "Admit [N] students? Each gets a unique Smart ID and Welcome WhatsApp. Confirm?" → Cancel | Confirm
- **DB:** `Student`, `Subscription`, `Payment`, `StudentSlot`

---

#### `student-profile.tsx`
- **Opens As:** Full page
- **Layout:** Full-width. Top: Profile Header Card (full width). Below: Horizontal tab navigation + tab content area.
- **Profile Header Card:**
  - Left: Photo (80px circle) + Name (H1) + Smart ID pill badge + Status badge
  - Center KPIs (horizontal): Join Date | Current Plan | Seat # | Shift | Days as Member
  - Right: Trust Score circular gauge (0–100, colored green≥70 / amber 40–69 / red<40) + "Trust Score" label below
  - Action buttons row (below KPIs): "✏️ Edit" ghost | "🖨️ Print ID" ghost | "📱 WhatsApp" ghost | "⏸️ Suspend" ghost danger | "⛔ Blacklist" ghost danger | "🚪 Mark Exit" danger primary
- **Tab Navigation:** [Personal Info] [Subscriptions] [Payments] [Attendance] [Seat History] [Complaints] [Documents] [Referrals]
- **Personal Info Tab:** Two-col display grid: Phone, Parent Phone, Email, College, Referred By (linked name), Referral Bonus Balance ₹
- **Subscriptions Tab:** Table — Plan | Start | End | Total ₹ | Paid ₹ | Due ₹ (red) | Status Badge | "🔄 Renew" action per row
- **Payments Tab:** Table — Receipt # | Date | Amount ₹ | Mode badge | Late Fee ₹ | Received By | Remark | "👁️ View" action
- **Attendance Tab:** Monthly calendar heatmap (green=present, red=absent, amber=late, gray=holiday) + "Attendance: 87% this month" stat card
- **Seat History Tab:** Table — Seat # | Shift | From Date | To Date | Duration | Reason badge (Admission/Shift Change/Seat Change)
- **Complaints Tab:** Table — Title | Status badge | Submitted Date | Resolved By | Resolved Date
- **Documents Tab:** 3-card grid layout: Aadhar Card | ID Proof | Photo. Each card: doc type label + upload date + Verification badge + "👁️ View" + "⬇️ Download" buttons
- **Referrals Tab:** "Referred By: [Student Name]" section (or "—") + Table of who they referred: Name | Join Date | Bonus Earned ₹
- **Confirmations:** "⏸️ Suspend" → modal (Reason `<select>` + Note `<textarea>`) | "⛔ Blacklist" → modal (Reason `<textarea>`, *req) | "🚪 Mark Exit" → navigates to `student-exit.tsx`
- **DB:** `Student`, `SeatHistory`, `Attendance`, `Subscription`, `Payment`, `PaymentPromise`, `Complaint`, `SecurityDeposit`, `IDCard`, `WhatsAppMessage`

---

#### `edit-student.tsx`
- **Opens As:** Right slide-in drawer (520px wide) — triggered from `student-profile.tsx` "✏️ Edit" button
- **Layout:** Drawer. Header: "Edit Student — [Name]" title + Smart ID badge + ✕ close button. Scrollable single-column form. Sticky footer: action buttons.
- **Section 1 — Personal Information:**
  - Name(`text`, *req) | Phone(`tel`, *req) → On blur: re-checks Blacklist (only if changed) | Parent Phone(`tel`) | Email(`email`) | College / Preparing For(`text`)
  - Referred By(`search` autocomplete, shows current referrer as chip, editable)
- **Section 2 — Photo & Documents:**
  - Student Photo: Current photo shown as thumbnail (64px) + "📷 Change Photo" button (opens file picker) | Aadhar Card: current file name shown + "🔄 Replace" button | ID Proof: current file name shown + "🔄 Replace" button
- **Section 3 — Status & Notes (Admin Only):**
  - Status(`select`: Active / Suspended / Exited / Blacklisted) — changing status here triggers same confirmation modals as `student-profile.tsx` | Admin Note(`textarea rows=3`, internal only, not visible to student)
- **Fields NOT editable here (read-only display):** Smart ID (shown as badge, not editable) | Join Date | Current Seat & Shift (managed via `shift-migration.tsx`) | Subscription & Fee details (managed via `collect-fee.tsx`)
- **Buttons:** "Cancel" ghost (closes drawer) | "💾 Save Changes" primary
- **On Save:** Toast "✅ Student details updated" + AuditLog entry created with old vs new values
- **DB:** `Student`, `AuditLog`

---

#### `student-exit.tsx`
- **Opens As:** Full page (navigated from student-profile.tsx "Mark Exit" button)
- **Layout:** Centered page (max-width 680px). Top: Student info banner. Below: Numbered checklist steps.
- **Student Banner (top):** Photo + Name + Smart ID + Seat # + Locker # (all displayed as info chips)
- **Checklist Steps (numbered, 1–6, each must be addressed before "Confirm Exit"):**
  1. 💰 **Pending Dues** — Shows ₹ due amount. If >0: "Mark as Collected Now" button (mini inline payment form slides open) | "Waive Due Amount" button (reason textarea *req). Status chip: ✅ Clear or 🔴 ₹500 Pending
  2. 🔐 **Security Deposit** — Shows ₹ held. "Process Refund" (opens Deduction Amount field + Reason) | "Forfeit Deposit" (reason *req). Status chip auto-updates.
  3. 🔒 **Locker** — Displays Locker # assigned. Info chip: "Will be freed automatically on exit ✅"
  4. 🪑 **Seat** — Displays Seat # + Shift. Info chip: "Will be freed automatically on exit ✅"
  5. 🎓 **Alumni Status** — `<checkbox checked>` labeled "Add to Alumni group for future marketing campaigns"
  6. 📅 **Exit Details** — Exit Date(`date`, default today) | Exit Reason(`select`: Got Job / Exam Completed / Moving City / Financial / Other) | Additional Note(`textarea rows=2`, optional)
- **Buttons:** "← Cancel & Go Back" ghost | "✅ Confirm Exit & Release Resources" danger primary (full-width)
- **Confirmation Modal:** "This will permanently free Seat A-22 and Locker 5. Student will be marked as Exited. This cannot be undone. Confirm?" → Cancel | "Confirm Exit" (red)
- **DB:** `Student`, `StudentSlot`, `SecurityDeposit`, `Seat`, `Locker`

---

#### `id-card-generator.tsx`
- **Opens As:** Full page
- **Layout:** Two-column — Left (40%): Student search + card settings panel. Right (60%): Live ID card preview.
- **Left Panel:** Student search(`search`, autocomplete by name or Smart ID) | Template: Radio buttons — "Template 1 (Dark)" | "Template 2 (Light)" | Include QR Code: `<checkbox checked>`
- **Right Panel — ID Card Preview:** Displayed at credit-card proportions (scaled up, 85.6×54mm ratio). Dark or light background per template. Library logo (top-left) + Library Name (top-right) | Student photo (circle, centered) | Name (bold), Smart ID badge, Shift, Valid Till date | QR code (bottom-right, 64×64px) + Library phone/address (bottom-left). Subtle drop shadow + primary color top border accent.
- **Buttons:** "🖨️ Print Card" primary | "📥 Download PDF" ghost | "📱 Send via WhatsApp" ghost
- **DB:** `IDCard`

---

#### `referral-bonus.tsx`
- **Opens As:** Full page
- **Layout:** Top: 3 KPI stat cards. Below: full-width data table.
- **KPI Cards:** Total Bonus Issued ₹ | Total Redeemed ₹ | Total Pending Balance ₹
- **Table Columns (L→R):** Smart ID | Name | Referred Students Count | Total Bonus Earned ₹ | Total Redeemed ₹ | Balance ₹ | Actions ("💸 Redeem to Fee")
- **"Redeem to Fee" Modal (480px):** Subscription `<select>` (student's active subscriptions) | Redeem Amount(`number`, max=balance) | Preview: "New due after redemption: ₹X" → "Confirm Redemption" primary
- **Empty State:** 🏅 icon + "No referral records yet."
- **DB:** `Student` (referralBonusBalance, referredBy, referrals)

---

#### `alumni.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table with top action bar.
- **Table Columns (L→R):** Smart ID | Photo (32px) | Name | Phone | Exit Date | Last Plan | Duration Stayed (e.g., "8 months") | Last Seen Date | Actions ("🔄 Re-Admit", "📱 WhatsApp")
- **Top Bar:** Search | Exit date range filter | "📱 Broadcast WhatsApp to All Alumni" ghost button
- **"Re-Admit":** Opens `new-admission.tsx` with Name + Phone pre-filled
- **Empty State:** 🎓 icon + "No alumni yet. Exited students with Alumni status will appear here."
- **DB:** `Student` (isAlumni=true), `WhatsAppMessage`

---

#### `document-vault.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Smart ID | Student Name | Document Type (Aadhar/ID Proof/Photo) | Upload Date | File Preview (small thumbnail icon, clickable) | Verification Status Badge (Verified=green, Pending=amber, Missing=red) | Actions ("👁️ View", "⬇️ Download", "✅ Mark Verified")
- **Filter Bar:** Student search | Document Type `<select>` | Verification Status `<select>`
- **"View" Action:** Opens full-screen lightbox modal showing image preview, with "⬇️ Download" button in top-right of modal
- **Empty State:** 🗄️ icon + "No documents uploaded yet."
- **DB:** `Student` (documents JSONB)



==================================================================================

# MODULE 5: Seats, Shifts & Lockers
> Prepend `global_design_system.md` before giving to Stitch.
> All pages use the full App Shell.

---

#### `seat-matrix.tsx`
- **Opens As:** Full page
- **Layout:** Full-width. Top: Shift filter tabs + legend strip. Main area: CSS grid of seat cells. Right sidebar (280px, slides in on cell click): selected seat detail panel.
- **Filter Bar:** Shift tabs (All | Morning | Evening | [custom shift names]) | Date picker(`date`, default today)
- **Legend (top-right strip):** 🟢 Free | 🔴 Occupied | 🟠 Expiring ≤7 days | ⚫ Maintenance/Broken
- **Grid:** CSS Grid, auto-fill columns. Each cell: 64×64px, border-radius 10px. Cell shows seat number (centered, bold 13px). Colors match legend.
- **Cell Hover:** Scales up slightly (transform scale 1.05) + tooltip popover: Student Name | Shift badge | "Expires: DD/MM/YY" | "📌 View Profile →" link
- **Click Occupied Cell:** Right sidebar appears — shows Student photo, Name, Smart ID, Shift, expiry date + "👁️ View Full Profile" button
- **Click Free Cell:** Right sidebar appears — "Seat A-05 is available" + "⚡ Assign Student →" primary button (→ `new-admission.tsx` pre-filled)
- **DB:** `Seat`, `StudentSlot`

---

#### `seats.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Seat # | Branch | Status Badge (working=green, maintenance=amber, broken=red) | Assigned To (student name linked, or "—") | Last Maintenance Date | Actions ("🔧 View Log" → `seat-maintenance-log.tsx`, "✏️ Edit", "Mark Broken" / "Mark Fixed")
- **Top Bar:** Search by seat number | Status `<select>` | "➕ Add Seat" primary
- **Add/Edit Modal (480px):** Seat Number(`text`, "A-01", *req) | Status(`select`: working/maintenance/broken) → Cancel | Save
- **Confirmation ("Mark Broken"):** "Mark Seat [#] as broken? It will be unavailable for assignment." → Cancel | Confirm
- **Empty State:** 🪑 icon + "No seats added yet." + "➕ Add Seat"
- **DB:** `Seat`

---

#### `seat-maintenance-log.tsx`
- **Opens As:** Full page
- **Layout:** Top: Seat selector `<select>` + current seat status badge displayed beside it. Overdue alert banner below selector (shown conditionally). Middle: maintenance history table. Bottom: "Add New Entry" form card.
- **Overdue Alert Banner (conditional):** 🔴 amber banner "Last maintenance was [60] days ago — attention recommended" (shown if gap > 30 days)
- **Table Columns (L→R):** # | Date | Remark | Done By | Status Before Badge | Status After Badge | Cost ₹ (or "—")
- **Add New Entry Form Card:**
  - Date(`date`, default today, *req) | Remark(`textarea rows=2`, "e.g. Chair leg repaired", *req) | Done By(`text`, "Technician name") | New Seat Status(`select`, *req) | "➕ Add Log Entry" primary button
- **Empty State (no logs for selected seat):** 🔧 icon + "No maintenance history for this seat."
- **DB:** `Seat` (maintenanceLog JSONB array)

---

#### `shifts.tsx`
- **Opens As:** Full page
- **Layout:** Top: "➕ Add Shift" primary button (right-aligned). Below: 3-column card grid of all shifts.
- **Shift Card:** Shift Name (H2) | Time range "06:00 AM → 12:00 PM" (displayed prominently) | Occupancy badge "32 students" | Status badge (Active=green, Inactive=gray) | "✏️ Edit" ghost | "🚫 Deactivate" ghost danger
- **Add/Edit Shift Modal (480px):** Name(`text`, "Morning / Evening / Custom-1", *req) | Start Time(`time`, *req) | End Time(`time`, *req) | Active toggle(`checkbox`, checked by default) → Cancel | Save
- **Confirmation ("Deactivate"):** "Deactivate [Shift Name]? Existing students are unaffected but new admissions cannot be assigned to this shift." → Cancel | Deactivate (amber)
- **Empty State:** 🕐 icon + "No shifts defined. Use Setup Wizard or add manually." + "➕ Add Shift"
- **DB:** `Shift`

---

#### `shift-migration.tsx`
- **Opens As:** Full page
- **Layout:** Centered (max-width 720px). 3-step wizard with step number indicators at top.
- **Step 1 — Select Student:**
  - Student search(`search`, autocomplete by name or Smart ID, *req)
  - On student selected: Current details card appears — "Current Shift: Morning | Current Seat: A-12 | Valid Till: 30 Apr | Plan: Monthly ₹1000"
  - Button: "Next →" primary
- **Step 2 — Choose New Slot:**
  - New Shift(`select`, shows only shifts with available seats + seat count, *req)
  - New Seat(`select`, dynamically filtered to conflict-free seats for chosen shift, *req)
  - Optional Custom Slot: expandable section with StartTime(`time`) + EndTime(`time`)
  - Buttons: "← Back" ghost | "Next →" primary
- **Step 3 — Review Fee Adjustment:**
  - Calculation display card: Old Rate: ₹33/day | New Rate: ₹40/day | Days Remaining: 12 | **Fee Adjustment: ₹+84** (green chip labeled "Student pays more") OR ₹-50 (blue chip labeled "Refund to student")
  - If paying more: Payment Mode segmented (Cash/UPI/Card) | Transaction ID(`text`, if UPI/Card)
  - Remark(`textarea rows=2`, optional)
  - Buttons: "← Back" ghost | "✅ Confirm Migration" primary
- **Confirmation Modal:** "Old Seat A-12 (Morning) will be freed. New Seat B-05 (Evening) assigned. Fee adjustment: ₹+84. Confirm?" → Cancel | Confirm
- **DB:** `ShiftMigration`, `StudentSlot`, `SeatHistory`

---

#### `shift-gap-analyzer.tsx`
- **Opens As:** Full page
- **Layout:** Top: filter bar. Below: one card per shift (scrollable vertically).
- **Filter Bar:** Shift `<select>` (All or specific) | View Period `<select>` (Today / This Week / This Month)
- **Shift Gap Card (one per shift):**
  - Card header: Shift Name (bold) | "38 / 60 seats occupied" | "63% Utilization" (large number) + horizontal progress bar (indigo fill)
  - Horizontal time-slot bar visualization (spanning full card width, 6AM–11PM range): Booked slot blocks = indigo colored blocks (hover shows student name) | Free gaps = gray blocks
  - Gap list below bar: Each gap row: 🕳️ "10:00 AM – 2:00 PM — 8 seats free — Est. revenue loss: ₹800/day" | "⚡ Quick Fill →" button → `new-admission.tsx` pre-filled with that gap slot
- **DB:** `Shift`, `StudentSlot`, `Seat`, `Student`

---

#### `seat-history.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Seat # | Student Name | Smart ID | Shift | Occupied From | Occupied Till | Duration | Reason Badge (Admission / Shift Change / Seat Change)
- **Filter Bar:** Seat `<select>` | Student search | Date range picker
- **Empty State:** 📜 icon + "No seat history records found."
- **DB:** `SeatHistory`

---

#### `allocations.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Student Name | Smart ID | Seat # | Shift | Custom Slots (time ranges or "—") | Locker # (or "—") | Valid From | Valid Till | Days Left Badge (red<7, amber<15) | Status Badge | Actions ("👁️ View Student")
- **Filter Bar:** Shift `<select>` | Status `<select>` (Active/Expired/All) | Date range | "📤 Export" ghost
- **Empty State:** 📋 icon + "No allocations found."
- **DB:** `StudentSlot`, `Locker`

---

#### `lockers.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Locker # | Status Badge (Free=green, Occupied=red, Maintenance=amber) | Assigned To (student name + Smart ID, or "—") | Assigned Since | Actions ("👤 Assign" if free | "🔓 Free Locker" if occupied | "🔧 Mark Maintenance")
- **Top Bar:** "➕ Add Locker" primary | Status `<select>` filter
- **"Assign" Modal (400px):** Student(`search`, autocomplete, *req) → Cancel | "👤 Assign" primary
- **"Free Locker" Confirmation:** "Free Locker [#] from [Student Name]? Locker becomes available immediately." → Cancel | Free Locker
- **Empty State:** 🔒 icon + "No lockers added yet." + "➕ Add Locker"
- **DB:** `Locker`

---

#### `locker-matrix.tsx`
- **Opens As:** Full page
- **Layout:** Full-width. Top: legend strip. Main: CSS grid (same structure as `seat-matrix.tsx` but for lockers).
- **Grid:** 56×56px cells, border-radius 8px. Colors: 🟢 Green=Free, 🔴 Red=Occupied, 🟠 Amber=Maintenance. Cell shows locker number (bold 12px centered).
- **Cell Hover:** Tooltip — Assigned Student Name + "Since: DD/MM/YY" (for occupied) OR "Available" (for free)
- **Click Free Cell:** "⚡ Assign Student →" action
- **Click Occupied Cell:** → `student-profile.tsx`
- **DB:** `Locker`, `StudentSlot`


==================================================================================

# MODULE 6: Finance, Payments & Trust Score
> Prepend `global_design_system.md` before giving to Stitch.
> All pages use the full App Shell.

---

#### `subscriptions.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Student Name | Smart ID | Plan | Start Date | End Date | Days Left Badge (red<7, amber<15, green>15) | Base ₹ | Discount ₹ | Total ₹ | Paid ₹ | Due ₹ (red text if >0) | Status Badge | Actions ("🔄 Renew", "👁️ View")
- **Filter Bar:** Status `<select>` (Active/Expired/Suspended/Cancelled/All) | Plan `<select>` | Shift `<select>` | Date range picker
- **Empty State:** 📋 icon + "No subscriptions found."
- **DB:** `Subscription`

---

#### `renewals.tsx`
- **Opens As:** Full page
- **Layout:** Top: 3 pill filter tabs. Below: full-width data table.
- **Filter Tabs:** "🔴 Expired" | "🟠 Expiring in 7 days" | "🟡 Expiring in 15 days"
- **Table Columns (L→R):** Student Name | Smart ID | Shift | Plan | Expiry Date | Days Remaining (negative shown as "3 days ago" in red) | Last Payment Date | Due ₹ | Actions ("🔄 Renew Now", "📱 Send Reminder")
- **Top-right:** "📱 Remind All" ghost button (bulk WhatsApp to all visible students)
- **"Renew Now":** Navigates to `collect-fee.tsx` with student pre-filled
- **"Send Reminder":** Triggers WhatsApp → success toast "✅ Reminder sent to [Name]"
- **Empty State (on 7-day tab):** ✅ icon + "All subscriptions are up to date!"
- **DB:** `Subscription`, `WhatsAppMessage`

---

#### `payments.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Receipt # | Date | Student Name | Smart ID | Amount ₹ | Mode Badge (Cash=blue, UPI=purple, Card=green, Bank=gray) | Transaction ID | Late Fee ₹ | Received By | Remark | Status Badge (Valid=green / Deleted=gray with strikethrough) | Actions ("👁️ Receipt", "🗑️ Delete")
- **Filter Bar:** Date range picker | Mode `<select>` | Staff `<select>` | Student search | "Show Deleted" `<toggle>` | "📤 Export" ghost
- **Deleted rows:** Entire row text uses strikethrough + gray "DELETED" pill badge. Deletion reason shown in Remark column.
- **"Delete" Confirmation:** "Soft-delete this payment? This action is permanent and logged in Audit Logs. Deletion reason: [textarea, *req]" → Cancel | Delete (red)
- **Empty State:** 💳 icon + "No payments recorded yet."
- **DB:** `Payment`

---

#### `collect-fee.tsx`
- **Opens As:** Full page
- **Layout:** Two-column — Left 55%: form fields. Right 45%: live receipt preview card that updates in real-time as form fills.
- **Left — Form Fields:**
  - Student: `<input type="search" autocomplete>` by name or Smart ID (*req). On select: shows Due Amount banner (🔴 red if >0) and active subscription plan info card below input.
  - Amount(`number`, "₹", *req) | Mode: Segmented button group — Cash | UPI | Card | Bank Transfer
  - Transaction ID(`text`, visible + *req only when UPI/Card/Bank selected)
  - Coupon Code(`text`, "Enter code") + "Apply" button → ✅ "₹50 discount applied" or ❌ "Invalid/expired code"
  - Late Fee(`number`, readonly auto-calculated) + "Override" `<checkbox>` to enable manual edit
  - Remark(`textarea rows=2`)
- **Right — Live Receipt Preview:** Updates dynamically. Shows: Library Name + logo | Receipt # (auto-generated) | Date: Today | Student Name | Amount ₹ | Payment Mode | Received By (logged-in staff).
- **Buttons:** "🚫 Cancel" ghost | "✅ Collect & Generate Receipt" primary (full-width, form footer)
- **Post-submit Toast:** "✅ Receipt #124 generated. WhatsApp sent to +91-98\*\*\*\*0022"
- **Auto-restore Toast (if student was suspended):** "🔓 Student's seat access automatically restored."
- **DB:** `Payment`, `Subscription`, `Coupon`, `WhatsAppMessage`

---

> **📌 RENEWAL WORKFLOW (Referenced by: `renewals.tsx`, `student-profile.tsx`, `collect-fee.tsx`)**
>
> When any "🔄 Renew" button is clicked (from `renewals.tsx`, `student-profile.tsx` Subscriptions tab, or `subscriptions.tsx`), the system navigates to `collect-fee.tsx` with the student pre-filled. The following **renewal logic** executes on fee collection:
>
> 1. **New Subscription Created:** A new `Subscription` record is created (NOT editing the old one). Old subscription's status → `expired`.
> 2. **Date Continuity:** New `startDate` = old `endDate + 1 day` (no gap). New `endDate` = `startDate + plan.durationDays`.
> 3. **Plan Selection:** Defaults to same plan as expiring subscription, but staff can change to a different plan.
> 4. **Carry-Over Dues:** If old subscription has `dueAmount > 0`, it is displayed as a warning banner: "⚠️ Previous due ₹500 will be added to new subscription." Staff can choose: "Add to New Subscription" (adds to `baseAmount`) OR "Waive Previous Due" (requires reason, logged in AuditLog).
> 5. **Seat & Shift Retention:** `StudentSlot.validTill` is extended to match new subscription `endDate`. No seat/shift change occurs during renewal.
> 6. **Auto-Actions on Renewal:** WhatsApp receipt sent, payment recorded, subscription status updated, seat matrix color updates from orange (expiring) to red (occupied).
> 7. **Auto-Restore:** If student was `suspended` due to non-payment, status auto-restores to `active` on successful renewal payment.
> 8. **DB Models Affected:** `Subscription` (new record + old record status update), `Payment`, `StudentSlot` (validTill extended), `Student` (status restore if suspended), `WhatsAppMessage`, `AuditLog`.

---

#### `payment-promises.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Student Name | Smart ID | Promised ₹ | Expected Date | Days Until/Since Due (red if overdue) | Times Changed (red badge if ≥3) | Status Badge (Pending=amber, Fulfilled=green, Overdue=red) | Actions ("✅ Mark Paid", "📅 Extend Date", "👁️ View Student")
- **"Extend Date" Modal:** New Date(`date`, *req) + Reason(`textarea`, *req) + ⚠️ info box "This will decrease the student's Trust Score." → Cancel | Extend (amber)
- **"Mark Paid" Modal:** Confirm amount received → updates `fulfilled = true`
- **Empty State:** 🤝 icon + "No payment promises recorded."
- **DB:** `PaymentPromise`, `Student`

---

#### `student-trust-score.tsx`
- **Opens As:** Full page
- **Layout:** Top: 3 KPI cards. Below: full-width data table (default sorted by lowest trust score first).
- **KPI Cards:** Scored Students Count | 🔴 Low Trust Students (<40) | Average Trust Score
- **Table Columns (L→R):** Rank # | Student Name | Smart ID | Shift | Trust Score (mini circular progress gauge, color coded) | Total Promises Made | Times Date Changed | Fulfilled Count | Badge (🟢 Reliable ≥70 / 🟡 Moderate 40–69 / 🔴 Low Trust <40) | Actions ("👁️ View Student", "📱 WhatsApp")
- **Filter Bar:** Trust Level `<select>` (All/Low Trust/Moderate/Reliable) | Shift `<select>`
- **Empty State:** 🛡️ icon + "Start recording payment promises to build trust scores."
- **DB:** `Student`, `PaymentPromise`

---

#### `security-deposits.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Student Name | Smart ID | Deposit ₹ | Status Badge (Held=blue, Refunded=green, Forfeited=red) | Collected By | Collected Date | Deduction ₹ | Deduction Reason | Refunded Date | Actions ("💸 Process Refund", "➕ Add Deduction")
- **"Process Refund" Modal (480px):** Refund Amount(`number`, auto-filled but editable) | Deduction Amount(`number`, 0 default) | Deduction Reason(`textarea`, *req if deduction >0) | Refund Date(`date`, default today) → Cancel | Process Refund (primary)
- **Empty State:** 💼 icon + "No security deposits recorded."
- **DB:** `SecurityDeposit`

---

#### `invoice.tsx`
- **Opens As:** Full page
- **Layout:** Two-column — Left 35%: search + select panel. Right 65%: A4-proportioned invoice preview.
- **Left Panel:** Student search(`search` autocomplete) | Subscription/Payment `<select>` (to pick which transaction to invoice)
- **Right — Printable A4 Invoice:** Library logo + Name + GST Number + Address + Phone | "TAX INVOICE" heading + Invoice Number (auto) + Invoice Date | "Billed To:" Student Name + Smart ID | Itemized table: Description | HSN/SAC Code | Duration | Amount ₹ | GST % | GST ₹ | Total ₹ | Totals row: Subtotal | GST Amount | Grand Total | Payment details: Mode + Transaction ID + Date | Footer: Signature line + "Thank you for choosing [Library Name]"
- **Buttons:** "📥 Download PDF" primary | "🖨️ Print" ghost | "📱 Send via WhatsApp" ghost
- **DB:** `Payment`, `Subscription`, `Plan`, `Branch`

---

#### `receipt.tsx`
- **Opens As:** Full page
- **Layout:** Centered content (80mm thermal receipt proportions, scaled for screen). Simple and clean.
- **Receipt Content (top to bottom):** Library Name (bold) + Logo | Horizontal divider | "PAYMENT RECEIPT" label | Receipt # (large, monospace) | Date + Time | Student Name + Smart ID | Amount ₹ (very large, bold, Indigo) | Payment Mode badge | Received By (staff name) | Horizontal divider | "Thank you! See you again 😊"
- **Buttons:** "📥 Download PDF" primary | "🖨️ Print" ghost | "📱 Send via WhatsApp" ghost
- **DB:** `Payment`, `Branch`, `Student`

---

#### `late-fees.tsx`
- **Opens As:** Full page
- **Layout:** Top: Configuration card. Below: data table of students with active late fee charges.
- **Config Card:** Grace Period(`number`, "5", label "days after due date, no penalty") | Penalty Per Day(`number`, "₹50") | "💾 Save Rules" primary
- **Table Columns (L→R):** Student Name | Smart ID | Subscription Due Date | Days Overdue | Late Fee Accrued ₹ | Total Due ₹ | Actions ("💰 Collect Now" → `collect-fee.tsx`)
- **Empty State:** ✅ icon + "No active late fee charges."
- **DB:** `Subscription`, `Payment`

---

#### `auto-suspend.tsx`
- **Opens As:** Full page
- **Layout:** Top: Config card + 3 KPI stat cards. Below: suspended students data table.
- **Config Card:** Days Before Auto-Suspend(`number`, "10", label "days overdue before access suspended") | "💾 Save Config" primary
- **KPI Cards:** Currently Suspended | Auto-Restored This Month | Manual Restores
- **Table Columns (L→R):** Student Name | Smart ID | Seat | Shift | Last Payment Date | Days Overdue | Suspended Since | Actions ("📱 Send Reminder", "✅ Manual Restore")
- **"Manual Restore" Confirmation:** "Manually restore access for [Name]? Override reason: [textarea, *req]" → Cancel | Restore
- **Empty State:** 🔓 icon + "No students currently suspended."
- **DB:** `Student`, `Subscription`, `Payment`

---

#### `referrals.tsx`
- **Opens As:** Full page
- **Layout:** Top: 3 KPI stat cards. Below: full-width data table.
- **KPI Cards:** Total Referrals Made | Total Bonus Issued ₹ | Top Referrer (name + count)
- **Table Columns (L→R):** Referrer Name | Smart ID | Referred Count | Referred Student Names (expandable row toggle) | Bonus Earned ₹ | Redeemed ₹ | Balance ₹
- **Empty State:** 👥 icon + "No referrals recorded yet."
- **DB:** `Student` (referredBy, referralBonusBalance)

---

#### `refunds.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Student Name | Smart ID | Exit Date | Deposit Held ₹ | Deduction ₹ | Net Refund ₹ | Status Badge (Pending=amber, Processed=green) | Actions ("💸 Process Refund", "➕ Add Deduction")
- **Empty State:** 💸 icon + "No pending refunds."
- **DB:** `SecurityDeposit`, `Payment`


==================================================================================

# MODULE 7: Accounts & Auditing
> Prepend `global_design_system.md` before giving to Stitch.
> All pages use the full App Shell.

---

#### `expenses.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table with top action bar.
- **Table Columns (L→R):** Date | Category Badge (each category has a color, e.g., Rent=blue, Electricity=amber, Salary=green) | Description | Amount ₹ | Added By | Actions ("✏️ Edit", "🗑️ Delete")
- **Top Bar:** "➕ Add Expense" primary (opens `add-expense.tsx` drawer) | Date range picker | Category `<select>` | "📤 Export" ghost
- **"Delete" Confirmation:** "Delete this expense entry? This cannot be undone." → Cancel | Delete (red)
- **Empty State:** 💸 icon + "No expenses recorded yet." + "➕ Add Expense"
- **DB:** `Expense`, `ExpenseCategory`

---

#### `add-expense.tsx`
- **Opens As:** Right slide-in drawer (480px) — triggered from `expenses.tsx`
- **Layout:** Single-column form in drawer. Header: "Add Expense" + ✕ close icon. Footer: action buttons.
- **Fields:** Category(`select`, from ExpenseCategory list, *req) + "➕ Create New Category" text link beside select | Amount(`number`, "₹ 0.00", *req) | Description(`textarea rows=3`, *req) | Expense Date(`date`, default today, *req)
- **Buttons:** "Cancel" ghost | "💾 Save Expense" primary
- **DB:** `Expense`

---

#### `expense-categories.tsx`
- **Opens As:** Full page
- **Layout:** Top: "➕ Add Category" primary button. Below: 3-column card grid of all categories.
- **Category Card:** Icon (Lucide icon or emoji relevant to category) + Category Name (bold) | "✏️ Edit" ghost | "🗑️ Delete" ghost danger
- **Add/Edit Modal (400px):** Name(`text`, *req) | Icon/Color `<select>` → Cancel | Save
- **"Delete" Confirmation:** "Delete category [Name]? Expenses using this category will be uncategorized." → Cancel | Delete (red)
- **Empty State:** 🏷️ icon + "No expense categories yet." + "➕ Add Category"
- **DB:** `ExpenseCategory`

---

#### `seat-gap-report.tsx`
- **Opens As:** Full page
- **Cross-Reference:** This is the **reporting view** for seat time-slot gaps. For the **interactive algorithm tool** with visual time bars and quick-assign, see `gap-filling.tsx` in Module 10. The two are complementary — this page shows revenue opportunity data, `gap-filling.tsx` is the action tool.
- **Layout:** Top: filter bar. Below: scrollable list of per-seat gap cards.
- **Filter Bar:** Date(`date`, default today) | Shift `<select>`
- **Seat Gap Card (one per seat):**
  - Card header: Seat # (bold) + Branch badge
  - Horizontal time bar (spanning full card width, 6AM–11PM): Booked slots = indigo colored blocks (hover shows assigned student name) | Free gap slots = gray blocks
  - Gap list below bar: Each free gap row: 🕳️ "Free: 10:00 AM – 4:00 PM" + "💰 Est. daily revenue opportunity: ₹800" | "⚡ Assign Student →" button → `new-admission.tsx` pre-filled with this seat + time slot
- **Empty State:** 🪑 icon + "No gap data available. Add student allocations to see time slot gaps."
- **DB:** `Seat`, `StudentSlot`, `Shift`

---

#### `daily-settlement.tsx`
- **Opens As:** Full page
- **Layout:** Centered (max-width 700px). Single large settlement card with clear visual hierarchy.
- **Top Auto-Calculated Summary:**
  - Cash Collected: ₹X (green)
  - UPI Collected: ₹X (green)
  - Card Collected: ₹X (green)
  - Total Income: ₹X (large, bold)
  - Total Expenses Today: ₹X (red)
  - **Net Profit: ₹X** (very large, Indigo color, hero number, biggest element on page)
- **Itemized Breakdown (below summary, two sections):**
  - Payments Today: List — Student Name | Amount ₹ | Mode badge
  - Expenses Today: List — Category | Description | Amount ₹
- **Buttons:** "📱 Send Daily Summary to Owner (WhatsApp)" ghost | "🔒 Close Register" primary
- **"Close Register" Confirmation:** "Lock today's settlement? The day's financial data will be finalized and cannot be edited." → Cancel | Close Register
- **DB:** `DailySettlement`

---

#### `financial-reports.tsx`
- **Opens As:** Full page
- **Layout:** Top: 4 KPI cards. Below: 2×2 chart grid. Below charts: Monthly breakdown data table.
- **KPI Cards:** Total Revenue ₹ | Total Expenses ₹ | Net Profit ₹ | Outstanding Dues ₹ (sum of all active subscription dueAmount)
- **Charts (2×2 grid):**
  1. Grouped Bar: Income (Indigo) vs Expense (Red) by month
  2. Area Line: Revenue trend last 6/12 months (green line + area fill)
  3. Pie/Donut: Expense breakdown by category (colored slices)
  4. Bar: Net Profit by month (green if positive, red if negative)
- **Filter Bar:** Date range `<select>` (This Month / Last 3 Months / This Year / Custom) | Branch `<select>`
- **Buttons:** "📥 Export PDF" ghost | "📊 Export Excel" ghost
- **Monthly Breakdown Table Columns (L→R):** Month | Revenue ₹ | Expenses ₹ | Net Profit ₹ | New Students | Exits
- **DB:** `Payment`, `Expense`, `ExpenseCategory`, `DailySettlement`, `Subscription`

---

#### `assets.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Asset Name | Quantity | Purchase Date | Status Badge (working=green, maintenance=amber, broken=red) | Last Serviced Date | Next Service Due Date | Actions ("🔧 Log Service" → `asset-maintenance.tsx`, "✏️ Edit", "Mark Broken")
- **Top Bar:** "➕ Add Asset" primary | Status `<select>`
- **Add/Edit Modal (480px):** Asset Name(`text`, "AC Unit / Fan / Chair", *req) | Quantity(`number`, *req) | Purchase Date(`date`) | Initial Status(`select`) → Cancel | Save
- **Empty State:** 🏭 icon + "No assets added yet." + "➕ Add Asset"
- **DB:** `Asset`

---

#### `asset-maintenance.tsx`
- **Opens As:** Full page
- **Layout:** Top: Asset selector `<select>` + current asset status badge beside it. Conditional overdue banner. Middle: service log table. Bottom: "Log New Service" form card.
- **Overdue Banner (conditional):** 🔴 "Next service was due on [Date] — [N] days overdue. Action needed!"
- **Table Columns (L→R):** # | Serviced Date | Next Due Date | Remark | Cost ₹ | Serviced By
- **Log New Service Form Card:**
  - Asset(`select`, *req) | Remark(`textarea rows=2`, *req) | Service Date(`date`, default today, *req) | Next Due Date(`date`, *req) | Cost ₹(`number`, "0") | "💾 Log Service" primary button
- **Empty State:** 🔧 icon + "No service logs for this asset."
- **DB:** `AssetMaintenanceLog`



==================================================================================

# MODULE 8: Attendance Engagement
> Prepend `global_design_system.md` before giving to Stitch.
> All pages use the full App Shell.

---

## 📁 Route Group: `(engagement)`
> CSS: `engagement.css` · Theme class: `engagement-theme` · Prefix: `eng-`
> Pages: attendance, absentee-report, qr-scanner, holiday-calendar

---

#### `attendance.tsx`
- **Route group:** `(engagement)`
- **Opens As:** Full page
- **Layout:** Top: Date picker + Shift filter (inline row). Below: Student list with per-row attendance controls.
- **Filter Row:** Date(`date`, default today) | Shift `<select>`
- **Student List (one row per student):** Photo (32px circle) + Name (bold) + Smart ID + Shift badge | Status toggle (Segmented, one-click per student): "🟢 Present" | "🔴 Absent" | "🟡 Late" | In-Time(`time`, shown if Present/Late) | Out-Time(`time`, shown if Present)
- **Consecutive Absentee Alert:** Students absent 3+ consecutive days: row is highlighted amber + "⚠️ 4 days absent" warning badge on right + "📱 Alert Parents" button (inline, per row)
- **Buttons:** "✅ Save Attendance" primary (sticky bottom bar) | "📋 View Full Absentee Report" ghost link (top-right)
- **Empty State:** 📅 icon + "No students found for this shift and date."
- **DB:** `Attendance`, `WhatsAppMessage`

---

#### `absentee-report.tsx`
- **Route group:** `(engagement)`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Student Name | Smart ID | Shift | Days Absent Consecutive (badge: 3–6 days=amber, 7+ days=red) | Last Seen Date | Parent Phone | Actions ("📱 Alert Parents", "✅ Mark as Notified")
- **Filter Bar:** Days Threshold `<select>` (3+ / 5+ / 7+ / Show All) | Shift `<select>`
- **Color-coded rows:** 3–6 day absentees = amber row background, 7+ days = red/danger row background
- **"Alert Parents" action:** Sends WhatsApp to parentPhone → success toast "✅ Alert sent to [Parent Phone]"
- **Top-right:** "📱 Alert All Parents" ghost button (bulk alert to all visible rows)
- **Empty State:** ✅ icon + "No absentees above selected threshold. Great attendance!"
- **DB:** `Attendance`, `Student` (parentPhone), `WhatsAppMessage`

---

#### `qr-scanner.tsx`
- **Route group:** `(engagement)`
- **Opens As:** Full page
- **Layout:** Centered (max-width 600px). Top: live camera viewport. Below: scan result panel.
- **Camera Viewport:** Square (400×400px), rounded-16px. Live webcam feed with QR scanning overlay (4 corner guides). Status label below: "📷 Scanning... Point camera at ID card QR code" with pulsing animation.
- **On QR Detected — Result Panel (slides up):**
  - Student info card: Photo (circle) + Name + Smart ID + Shift badge + "Valid Till: DD/MM/YY"
  - Action buttons: "✅ Mark IN" (primary green, large) | "🔚 Mark OUT" (primary red, large) | "Skip" ghost
  - Auto-success: After marking, shows ✅ animation + "Attendance marked at HH:MM" + resets to scanning state
- **Manual Fallback (text link below camera):** "Enter Smart ID manually →" → shows `<input type="text">` + "Mark IN" / "Mark OUT" buttons
- **DB:** `IDCard`, `Attendance`

---

#### `holiday-calendar.tsx`
- **Route group:** `(engagement)`
- **Opens As:** Full page
- **Layout:** Two-column — Left: Monthly calendar grid (7-col standard calendar). Right (300px): Holiday list panel.
- **Calendar:** Standard month grid (Mon–Sun). Holiday dates highlighted with amber background. Click any highlighted date → shows holiday name in a tooltip. Click non-highlighted date → option to add holiday.
- **Right Holiday List Panel:** All holidays listed: Date (bold) | Event Name | "🗑️ Remove" action
- **"➕ Add Holiday" Button (top of right panel):** Opens Modal (400px) — Date(`date`, *req) | Event Name(`text`, *req) → Cancel | "📅 Add Holiday" primary
- **DB:** `Notice` (or dedicated Holiday table)

---



==================================================================================

# MODULE 9: Admin, Security & System Tools
> Prepend `global_design_system.md` before giving to Stitch.
> All pages use the full App Shell. Most of these require Owner/SuperAdmin role.

---

#### `branches.tsx`
- **Opens As:** Full page
- **Layout:** Top: Per-branch summary stat cards (horizontal scrollable row). Below: full-width data table.
- **Branch Summary Cards (top):** One card per branch — Branch Name | Active Students count | Today's Revenue ₹ | Occupancy %
- **Table Columns (L→R):** Branch Name | Address | City | GST # | Active Students | Today Revenue ₹ | Status Badge | Actions ("🔀 Switch Branch", "✏️ Edit", "👁️ View Dashboard")
- **Top Bar:** "➕ Add Branch" primary
- **Add/Edit Branch Modal (560px):** Name(`text`, *req) | Address(`textarea rows=2`, *req) | City(`text`, *req) | GST Number(`text`, optional) | Active `<toggle>` → Cancel | Save
- **DB:** `Branch`, `Payment`, `Student`

---

#### `staff-users.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Photo (32px circle) | Name | Phone | Email | Role Badge (superadmin=purple, owner=indigo, manager=blue, staff=gray) | Branch | Status Badge | Last Login | Actions ("✏️ Edit", "🚫 Deactivate")
- **Top Bar:** "➕ Add Staff Member" primary | Role `<select>` filter | Status `<select>` filter
- **Add/Edit Modal (480px):** Name(`text`, *req) | Phone(`tel`, *req) | Email(`email`) | Role(`select`: superadmin/owner/manager/staff, *req) | Branch(`select`, *req) | Password(`password`, *req for Add, hidden for Edit — "Change Password" toggle) | Active `<toggle>` → Cancel | Save
- **"Deactivate" Confirmation:** "Deactivate [Name]? They cannot log in until reactivated." → Cancel | Deactivate (amber)
- **DB:** `User`

---

#### `permissions.tsx`
- **Opens As:** Full page
- **Layout:** Top: Role selector tabs. Below: Permission matrix card with grouped checkboxes.
- **Role Tabs:** Staff | Manager | Owner | Super Admin
- **Permission Matrix Card:** Grouped by feature area, each group has a heading:
  - **CRM:** Can view enquiries | Can add enquiries | Can convert to student
  - **Admissions:** Can add students | Can edit student info | Can mark student exit
  - **Finance:** Can collect fees | Can view payments | Can delete payments | Can view profit/P&L
  - **Reports:** Can view reports | Can export data
  - **Admin:** Can manage staff | Can manage plans | Can access audit logs | Can manage blacklist
  - **Settings:** Can change app settings | Can manage branches
- **Permissions pre-filled per role tab, editable by Owner/SuperAdmin only**
- **Buttons:** "↩️ Reset to Default" ghost | "💾 Update Permissions" primary
- **DB:** `User` (permissions JSONB)

---

#### `plans.tsx`
- **Opens As:** Full page
- **Layout:** Top: "➕ Add Plan" primary button. Below: 3-column card grid.
- **Plan Card:** Plan Name (H2, bold) | Duration displayed as "30 days" | Price "₹1,000" (very large, Indigo color) | "23 active subscribers" badge | Status badge (Active=green, Inactive=gray) | "✏️ Edit" ghost | "🚫 Deactivate" ghost danger
- **Add/Edit Plan Modal (480px):** Plan Name(`text`, "Monthly / Quarterly / Custom", *req) | Duration(`number`, "30", label "days", *req) | Price(`number`, "₹", *req) | Active `<toggle>` → Cancel | Save
- **"Deactivate" Confirmation:** "Deactivate [Plan Name]? Existing subscribers are unaffected. No new admissions can use this plan." → Cancel | Deactivate (amber)
- **Empty State:** 💰 icon + "No fee plans yet." + "➕ Add Plan"
- **DB:** `Plan`

---

#### `coupons.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Code (bold monospace font) | Discount (shows "₹50 flat" OR "10% off") | Valid Till | Used / Max (e.g., "12 / 50", or "12 / ∞" if unlimited) | Status Badge (Active=green, Expired=gray, Maxed Out=amber) | ROI Indicator | Actions ("✏️ Edit", "🚫 Deactivate")
- **Top Bar:** "➕ Create Coupon" primary | Status `<select>`
- **Add/Edit Coupon Modal (480px):** Code(`text`, "NEWYEAR50", uppercase auto-format, *req) | Discount Type: Radio — "₹ Flat Amount" | "% Percentage" | Discount Value(`number`, *req) | Valid Till(`date`, optional) | Max Uses(`number`, optional, "Leave blank for unlimited") | Active `<toggle>` → Cancel | Save
- **Empty State:** 🎟️ icon + "No coupons created yet." + "➕ Create Coupon"
- **DB:** `Coupon`

---

#### `waitlist.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Position # | Student Name | Smart ID | Preferred Shift | Preferred Time Slots | Date Added | Status Badge (Waiting=amber, Notified=blue, Converted=green) | Actions ("📱 Notify Now", "✅ Convert to Admission", "🗑️ Remove")
- **Filter Bar:** Shift `<select>` | Status `<select>`
- **"Notify Now":** Sends WhatsApp "A seat is available for your preferred slot!" → success toast
- **"Convert" Action:** → `new-admission.tsx` pre-filled with student details
- **"Remove" Confirmation:** "Remove [Name] from the waitlist?" → Cancel | Remove
- **Empty State:** ⏳ icon + "No students on the waitlist."
- **DB:** `Waitlist`, `WhatsAppMessage`

---

#### `blacklist.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Phone (bold) | Name | Reason (truncated, expandable) | Branch | Added By | Date Added | Actions ("✏️ Edit Reason", "🗑️ Remove from Blacklist")
- **Top Bar:** "➕ Add to Blacklist" primary | Branch `<select>`
- **Info Banner (top of page):** ℹ️ "Phone numbers on this list are automatically blocked during new admissions."
- **Add Modal (480px):** Phone(`tel`, *req) | Name(`text`) | Reason(`textarea rows=3`, *req) → Cancel | "⛔ Add to Blacklist" danger primary
- **"Remove" Confirmation:** "Remove [Phone] from blacklist? This person will be able to register again." → Cancel | Remove (amber)
- **Empty State:** ✅ icon + "Blacklist is empty. No blocked students."
- **DB:** `Blacklist`

---

#### `audit-logs.tsx`
- **Opens As:** Full page
- **Layout:** Full-width data table. Read-only — no add/edit/delete actions.
- **Top Banner:** 🔍 "Fraud Detection — This is a read-only log of all sensitive actions taken by staff."
- **Table Columns (L→R):** Timestamp | Performed By (staff name + role badge) | Entity (Student/Payment/Subscription/etc.) | Entity ID | Action Badge (created=blue, updated=amber, deleted=red, fee_collected=green) | IP Address | "👁️ View Changes" action
- **"View Changes" Action:** Opens modal showing two-column diff: "Before" (old values JSONB, formatted) vs "After" (new values JSONB, formatted). Changed fields highlighted in amber.
- **Filter Bar:** Performed By `<select>` | Entity `<select>` | Action `<select>` | Date range
- **Empty State:** 📋 icon + "No audit logs yet."
- **DB:** `AuditLog`

---

#### `bulk-import.tsx`
- **Opens As:** Full page
- **Layout:** Centered (max-width 700px). Upload card at top. Import history table below.
- **Upload Card:**
  - Entity Type `<select>` (Students / Seats / Lockers, *req)
  - File Dropzone: Dashed border, "📤 Drag & drop Excel file here or click to browse". Accepts .xlsx/.csv.
  - "📥 Download Sample Template" text link below dropzone
  - "🚀 Start Import" primary button (activates after file selection)
- **Post-Import Result Card (replaces upload card):** ✅ "[N] rows imported successfully" (green) + ❌ "[N] rows failed" (red) + Error detail table: Row # | Error Message (e.g., "Row 5: Mobile Number is missing")
- **Import History Table (below, smaller):** Columns: Date | Entity Type | File Name | Success | Failed | Imported By
- **DB:** `BulkImport`

---

#### `data-export.tsx`
- **Opens As:** Full page
- **Layout:** Centered (max-width 600px). Single export configuration card.
- **Export Config Card:**
  - "📥 Export Your Data" heading (H1)
  - Entity Type `<select>` (Students / Payments / Attendance / Subscriptions / Expenses / Seat History, *req)
  - Date Range: Start(`date`) to End(`date`) (optional — leave blank for all)
  - Format: Radio — "📊 Excel (.xlsx)" | "📄 CSV (.csv)"
  - "📥 Download Export" primary button (full-width)
  - Estimated row count preview: "~143 records will be exported" (updates on selection change)
- **DB:** Reads from any selected entity table

---

#### `backups.tsx`
- **Opens As:** Full page
- **Layout:** Top: Last backup status card. Below: Backup history table.
- **Last Backup Status Card:** ✅ "Last automated backup: Today at 02:30 AM" (green badge) OR 🔴 "No backup in 3 days — action required!" | "⬇️ Download Latest Backup" primary button | "🔄 Run Backup Now" ghost
- **Backup History Table Columns (L→R):** Date/Time | Type (Auto/Manual) badge | File Size | Status Badge | Actions ("⬇️ Download")
- **Bottom section:** "🔄 Restore from Backup" — file upload dropzone (accepts .json/.csv) + "⚠️ Warning: Restoring will overwrite current data. Make sure you have a recent backup." amber warning box + "Restore" danger button
- **DB:** Full DB dump tracking

---

#### `gst-tax-settings.tsx`
- **Opens As:** Full page
- **Layout:** Centered card (max-width 560px). Single settings form.
- **Fields:** GST Registration Number(`text`, "22AAAAA0000A1Z5", placeholder) | GST Percentage(`number`, "18", label "% applied on fees") | State Code(`text`, "07 — Delhi") | HSN/SAC Code(`text`, "999299 — Educational services") | "GST Enabled" `<toggle>` (if OFF: invoices generated without GST)
- **Preview Card (below form):** Shows a mini invoice preview updating live as values are entered
- **Buttons:** "💾 Save Tax Settings" primary
- **DB:** `Branch` (gstNumber + tax config fields)



==================================================================================


## 📁 Route Group: `(communication)`
> CSS: `communication.css` · Theme class: `communication-theme` · Prefix: `eng-`
> Pages: notices, notification-center, whatsapp-logs, whatsapp-templates, complaints

---

#### `complaints.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Top: filter tabs. Below: full-width data table.
- **Filter Tabs:** All | 🔴 Open | 🟡 In-Progress | ✅ Resolved
- **Table Columns (L→R):** # | Title | Student Name (or "Anonymous" if isAnonymous=true, shown in italic gray) | Description (truncated, expandable on click) | Status Badge | Submitted Date | Resolved By (or "—") | Resolved Date | Actions ("👁️ View", "🔄 Mark In-Progress", "✅ Resolve")
- **Top Bar:** "➕ Add Complaint" primary (staff raises on student's behalf)
- **"Add Complaint" Modal (480px):** Student(`search`, optional — leave empty for anonymous) | Anonymous `<toggle>` labeled "Hide student identity from staff view" | Title(`text`, *req) | Description(`textarea rows=4`, *req) → Cancel | "Submit Complaint" primary
- **"Resolve" Action:** Modal — Resolution Note(`textarea rows=3`, *req) → Cancel | "✅ Mark Resolved" green
- **Empty State (Open tab):** 😊 icon + "No open complaints! All issues are resolved."
- **DB:** `Complaint`

---

#### `notices.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Top: "📢 Post Notice" primary button (right-aligned). Below: vertical card list of all notices.
- **Notice Card:** Title (H2) | Message (body text, truncated to 3 lines with "Read more" expand) | Valid Till badge (green if active, gray if expired) | "Posted by [Staff Name] · DD/MM/YY" caption | Status badge | Buttons: "✏️ Edit" ghost | "🗑️ Delete" ghost danger | "📱 Broadcast via WhatsApp" ghost
- **Add/Edit Notice Modal (520px):** Title(`text`, *req) | Message(`textarea rows=6`, *req) | Valid Till(`date`, *req) → Cancel | "📢 Post Notice" primary
- **"Broadcast via WhatsApp" Confirmation:** "Send this notice to all [N] active students via WhatsApp?" → Cancel | Broadcast
- **"Delete" Confirmation:** "Delete this notice?" → Cancel | Delete (red)
- **Empty State:** 📢 icon + "No notices posted yet." + "📢 Post Notice"
- **DB:** `Notice`, `WhatsAppMessage`

---

#### `notification-center.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Left sidebar (200px): category filter list. Right main area: notification items list.
- **Left Filter List (clickable categories):** All Notifications | 💰 Finance | 📞 CRM | 🪑 Operations | 📅 Attendance | Priority: High Only
- **Notification Item (each row in right area):** Large icon for category (colored) | Title (bold) | Description text (secondary) | "[Time] ago" timestamp (right-aligned) | Priority badge (🔴 High / 🟡 Medium) | "→ Go to page" arrow link
- **Example Notification Items:**
  - 🔴 Finance: "5 subscriptions expire today" → `renewals.tsx`
  - 🟡 CRM: "Call Rahul — enquired 3 days ago" → `enquiry-details.tsx`
  - 🔴 Finance: "3 Payment Promise dates hit today" → `payment-promises.tsx`
  - 🟡 Ops: "Seat A-05 maintenance overdue by 45 days" → `seat-maintenance-log.tsx`
- **Top-right:** "✅ Mark All Read" ghost button
- **Empty State:** 🔔 icon + "All caught up! No pending notifications."
- **DB:** Aggregates `Subscription`, `Enquiry`, `PaymentPromise`, `Attendance`, `Seat`, `AssetMaintenanceLog`

---

#### `whatsapp-logs.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Date/Time | Phone | Student Name (linked) | Message Type Badge (welcome=blue, fee_reminder=amber, receipt=green, notice=purple, renewal=indigo) | Status Badge (Pending=amber, Sent=blue, Delivered=green, Failed=red) | Error Message (if failed, otherwise "—") | Actions ("👁️ View Message")
- **Filter Bar:** Message Type `<select>` | Status `<select>` | Date range | Student search
- **"View Message" Action:** Opens modal (560px) showing full message text content
- **Empty State:** 📱 icon + "No WhatsApp messages logged yet."
- **DB:** `WhatsAppMessage`

---

#### `whatsapp-templates.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Two-column — Left (260px): Template type list (sidebar). Right: Template editor panel.
- **Left — Template List (clickable):** Welcome Message | Fee Reminder | Renewal Alert | Payment Receipt | Notice Broadcast | Absentee Parent Alert | PTP Payment Reminder. Active item highlighted with Indigo left border.
- **Right — Template Editor:**
  - Template Type label (H2, readonly)
  - Message Body: `<textarea rows=8>` with character counter below
  - Variable chips row below textarea (click to insert at cursor): `{name}` `{amount}` `{duedate}` `{planname}` `{libraryname}` `{phone}` `{seat}` — clicking a chip inserts it into the message body
  - Variables Legend: "Use variables above to personalize messages. E.g.: 'Hi {name}, your fee of ₹{amount} is due on {duedate}.'"
  - Buttons: "📱 Send Test Message" ghost (opens phone number input modal) | "💾 Save Template" primary
- **DB:** `Branch` (branding/settings) or `WhatsAppTemplate`



==================================================================================

# MODULE 10: System, Utilities & Smart Automation
> Prepend `global_design_system.md` before giving to Stitch.
> All pages use the full App Shell unless noted.

---

#### `settings.tsx`
- **Opens As:** Full page
- **Layout:** Multi-section settings page. Left sidebar (200px): settings category list. Right: settings panel for selected category.
- **Settings Categories (left list):** Branding | Late Fee Rules | Auto-Suspend Rules | UPI / Payment | Notifications | General
- **Branding Section:** Upload Logo (image dropzone, preview shown) | App Name(`text`) | Primary Color(`color-picker`, hex input) | Secondary Color(`color-picker`)
- **Late Fee Rules Section:** Grace Period(`number`, "5", label "days") | Penalty Per Day(`number`, "₹50") | Enable Late Fees `<toggle>`
- **Auto-Suspend Section:** Days Before Suspend(`number`, "10") | Enable Auto-Suspend `<toggle>` | Enable Auto-Restore on Payment `<toggle>`
- **UPI/Payment Section:** UPI QR Code: image upload dropzone (preview shown) | UPI ID(`text`, "owner@upi") | Accepted Modes: Checkboxes (Cash / UPI / Card / Bank Transfer)
- **Notification Section:** SMS/WhatsApp API Key(`text`, masked) | "Test Connection" button
- **Buttons:** "💾 Save Settings" primary (per section, or sticky bottom-right for all)
- **DB:** `Branch` (extended branding + settings fields)

---

#### `profile.tsx`
- **Opens As:** Full page
- **Layout:** Centered card (max-width 560px). Two sections: Personal Info + Change Password.
- **Personal Info Section:** Profile Photo (circle, 80px) with "📷 Change Photo" button on hover | Name(`text`, *req) | Email(`email`) | Phone(`tel`, *req) | "💾 Update Profile" primary button
- **Change Password Section (separate card below):** Current Password(`password`) | New Password(`password`, with strength indicator) | Confirm New Password(`password`) | "🔐 Change Password" primary button
- **DB:** `User`

---

#### `offline.tsx`
- **Opens As:** Full page, no sidebar (PWA offline fallback)
- **Layout:** Full-screen centered message. No app shell, no sidebar.
- **Content:** 📡 large icon (no internet signal) | "You're Offline" heading (H1) | "No internet connection detected. Don't worry — your basic features still work:" | Bulleted list: "✅ Mark attendance (syncs when online)" | "✅ View student basic info (cached)" | "❌ Financial transactions require internet" | Pulsing "Waiting for connection..." status badge at bottom | Auto-refreshes and redirects to dashboard when connection restored.

---

#### `maintenance.tsx`
- **Opens As:** Full page
- **Layout:** Full-width. Top: 3 summary count cards. Below: 3 sections (one per resource type) each with their own table.
- **Summary Cards:** Seats Needing Attention (count) | Assets Overdue (count) | Locker Issues (count)
- **Section 1 — Seats:** Table — Seat # | Status Badge | Last Maintenance Date | Days Since Last Maintenance (red if >30) | "🔧 Log Maintenance" action → `seat-maintenance-log.tsx`
- **Section 2 — Assets:** Table — Asset Name | Quantity | Status Badge | Last Serviced | Next Due Date | Days Overdue (red badge if past due) | "📝 Log Service" action → `asset-maintenance.tsx`
- **Section 3 — Lockers:** Table — Locker # | Status Badge | Last Reported Issue | "✏️ Update Status" action
- **DB:** `Seat` (maintenanceLog), `Asset`, `AssetMaintenanceLog`, `Locker`

---

#### `404.tsx`
- **Opens As:** Full page (error page, uses app shell if logged in)
- **Layout:** Full-screen centered content.
- **Content:** "404" in very large bold Indigo text | Illustration: lost/confused person or broken link icon | "Page Not Found" heading | "The page you're looking for doesn't exist or has been moved." subtext | "← Go to Dashboard" primary button | "Go Back" ghost button

---

#### `500.tsx`
- **Opens As:** Full page (error page, uses app shell if logged in)
- **Layout:** Full-screen centered content.
- **Content:** "500" in large bold red text | Illustration: server error/crash icon | "Server Error" heading | "Something went wrong on our end. Our team has been notified." subtext | "🔄 Retry" primary button | "📧 Contact Support" ghost button

---

#### `gap-filling.tsx`
- **Opens As:** Full page
- **Cross-Reference:** This page is the **algorithm visualization & smart assignment tool**. For the **tabular report view** of seat gaps, see `seat-gap-report.tsx` in Module 07. The two pages serve different purposes:
  - `gap-filling.tsx` → Interactive tool: run analysis, visualize time bars, quick-assign students to gaps
  - `seat-gap-report.tsx` (Module 07) → Reporting view: per-seat gap cards with revenue opportunity estimates, filterable by date/shift
- **Layout:** Top: Algorithm controls card. Below: Results visualization.
- **Controls Card:** Date range picker | Shift `<select>` | "🔍 Run Gap Analysis" primary button
- **Results:** Per-seat horizontal time bars showing booked (indigo) vs. free (gray) slots. Each free gap: "🕳️ Gap: 10AM–2PM — 4 seats — 💡 Suggested: Assign student for 4hrs" + "⚡ Quick Assign →" button
- **Purpose:** Visual algorithm page showing which time-seat combinations have capacity that can be monetized. Actionable — designed for staff to immediately fill gaps.
- **DB:** `Seat`, `StudentSlot`, `Shift`

---

#### `smart-id-autofill.tsx`
- **Opens As:** Full page
- **Layout:** Centered info + demo card (max-width 680px).
- **Content:** Algorithm explanation card: "How Smart ID Gap-Fill Works" with a visual flow diagram. Step 1: Student exits → ID freed. Step 2: Next admission → system checks for lowest available gap ID. Step 3: Gap ID assigned to new student, exited student archived. | "🔢 Current ID Sequence" viewer: shows all active IDs as chips (gaps shown in different color) | Manual override: "Force Regenerate Sequence" button (admin only, with confirmation)
- **DB:** `Student` (smartId field sequences)

---

#### `waitlist-automation.tsx`
- **Opens As:** Full page
- **Layout:** Top: automation status toggle card. Below: current waitlist queue + configuration.
- **Status Card:** "Waitlist Auto-Notification" `<toggle>` (ON/OFF) | "When a seat becomes free, automatically WhatsApp the next student in queue."
- **Config:** Notification Message Template(`textarea`, editable) | Notification Delay(`number`, "0", label "minutes after seat becomes available") | "💾 Save Config" primary
- **Queue Preview:** First 5 students in waitlist shown as a visual queue (avatar + name + shift preference + position #)
- **DB:** `Waitlist`, `WhatsAppMessage`

---

#### `power-saving.tsx`
- **Opens As:** Full page
- **Layout:** Top: Status + threshold config card. Below: current room/zone occupancy status.
- **Config Card:** Occupancy Threshold `<input type="number">` % (e.g., "30") | Label: "If shift occupancy drops below this, suggest consolidation". | "Enable Power Saving Alerts" `<toggle>`
- **Zone Status Cards (grid):** Each room/zone (if defined): Zone Name | Current occupancy % | Status (Normal / ⚡ Low — consolidation suggested) | Suggested Action: "Move [N] students to Zone A → Turn off Zone B AC"
- **Alert Log (table below):** Date | Shift | Zone | Threshold Breached | Action Taken
- **DB:** `Seat`, `Locker` (status-based occupancy stats)

---

#### `branding.tsx`
- **Opens As:** Full page
- **Layout:** Two-column — Left 40%: branding settings form. Right 60%: Live preview of how the app looks with current branding.
- **Left — Settings Form:** Library Name(`text`) | Upload Logo (image dropzone, 200×200px preview) | Primary Color(`color-picker` with hex input + color swatch) | Secondary Accent Color(`color-picker`) | App Tagline(`text`, optional)
- **Right — Live Preview:** Mini mockup of the sidebar, login page, and ID card showing how the branding applies in real-time as settings change. Sidebar shows logo, app name, primary color active states. ID card shows logo + library name.
- **Buttons:** "💾 Save Branding" primary | "↩️ Reset to Default" ghost
- **DB:** `Branch` (branding fields)

---

#### `auto-scale.tsx`
- **Opens As:** Full page
- **Layout:** Top: Current capacity overview cards. Below: Threshold configuration + recommendations.
- **Overview Cards:** Total Seats | Total Lockers | Avg Occupancy % (last 30 days) | "Peak Day" (highest occupancy day)
- **Threshold Config:** Seat Alert Threshold `<input type="number">` % (e.g., "90") | Locker Alert Threshold `<input type="number">` % | "Alert me when occupancy exceeds threshold" `<toggle>` | "💾 Save Thresholds"
- **Recommendations Card:** If occupancy >90%: 🔴 "System suggests adding more seats. Current utilization: 94%" + "➕ Add Seats" shortcut button. If <40%: 🟡 "Low occupancy detected. Consider Power Saving mode." + "⚡ Power Saving →" link.
- **DB:** `Seat`, `Locker`

---

#### `whatsapp-integration.tsx`
- **Opens As:** Full page
- **Layout:** Centered (max-width 680px). Single integration configuration card.
- **Integration Card:**
  - Integration Status badge (Connected=green, Not Connected=red) with last tested timestamp
  - API Provider `<select>` (Twilio / Wati / AiSensy / Custom)
  - API Key(`text`, password-masked with 👁️ toggle)
  - API Secret(`text`, password-masked with 👁️ toggle, if required by provider)
  - Webhook URL(`text`, readonly, auto-generated) + "📋 Copy" button
  - Sender Phone Number(`tel`, WhatsApp Business number)
  - "🔌 Test Connection" ghost button → sends test message to owner's phone → shows ✅ "Connection successful" or ❌ "Error: [message]"
- **Usage Stats Card (below):** Messages sent this month | Delivered | Failed | Estimated cost
- **Buttons:** "💾 Save Integration Settings" primary
- **DB:** `WhatsAppMessage`, `Branch` (API config)




==================================================================================




==================================================================================
