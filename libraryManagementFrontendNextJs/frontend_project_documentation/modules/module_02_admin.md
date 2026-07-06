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
