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
