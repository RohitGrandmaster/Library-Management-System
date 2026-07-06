# 🏛️ Smart Library 360 - Enterprise Management System

**Complete Business Automation for Self-Study Centers & Reading Rooms**
*(Powered by Smart ID Auto-Fill & Trust-Score Algorithms)*

---

## 🛠️ Official Tech Stack — Use These, Nothing Else

> **⚠️ RULE:** Before adding ANY new package, check this table first.
> Adding an unlisted package requires a team discussion. This prevents bloat and duplicate solutions.

---

### Core Framework

| Layer | Package | Version | Why This One |
|---|---|---|---|
| **Framework** | `next` | `16.x` | App Router, RSC, built-in optimizations |
| **Language** | `typescript` | `5.x` | Type safety across all modules |
| **Styling** | `tailwindcss` | `4.x` | Utility-first, no runtime overhead |
| **CSS Utilities** | `clsx` + `tailwind-merge` | latest | Safe class merging via `cn()` helper |

---

### UI Components — shadcn/ui Pattern

> **RULE:** Do NOT install the shadcn CLI or use a global `src/components/ui/` folder.
> Manually build shadcn-style components (Radix primitive + Tailwind styling) **per route group** in that group's `reusable/` folder.

| Package | Usage |
|---|---|
| `@radix-ui/react-dialog` | Modals & confirmation dialogs |
| `@radix-ui/react-select` | Dropdowns |
| `@radix-ui/react-switch` | Toggle switches |
| `@radix-ui/react-tabs` | Tab navigation |
| `@radix-ui/react-label` | Accessible form labels |
| `@radix-ui/react-tooltip` | Hover tooltips |
| `@radix-ui/react-accordion` | Collapsible sections |
| `@radix-ui/react-separator` | Visual dividers |
| `class-variance-authority` | Component variant system (CVA) for Button/Badge |

**Component file locations (Feature-Based Isolation):**
```
(auth)/reusable/       → schema.ts, PasswordStrengthMeter
(system)/reusable/     → Button, Card, Input, Label, Badge, Switch, Tabs, Select, Textarea, Dialog, Progress, KpiCard, utils.ts
(admin)/reusable/      → KpiCard, SeatCell, SeatMatrixGrid, ChartCard, etc.
(manager)/reusable/    → (same pattern)
```

---

### Icons — Lucide React ✅ (Only This)

| Package | Decision |
|---|---|
| ✅ `lucide-react` | **USE THIS.** Tree-shakeable, consistent stroke style, 1100+ icons, TypeScript-first |
| ❌ `@mui/icons-material` | **DO NOT USE.** Heavy (~5MB uncompressed), pulls in full MUI runtime |
| ❌ `react-icons` | **DO NOT USE.** Inconsistent styles across icon sets |
| ❌ Material Symbols (Google Fonts CDN) | **DO NOT USE.** Network-dependent, causes layout shift |

```tsx
// ✅ Correct usage — reference CSS token, never hardcode hex
import { BookOpen, Users, IndianRupee } from 'lucide-react';
<BookOpen size={20} className="text-[var(--primary)]" />

// ❌ Never do this — hex hardcoded in className
<BookOpen size={20} className="text-[#6366F1]" />

// ❌ Never do this — wrong icon library
import { Search } from '@mui/icons-material';
```

---

### Forms — react-hook-form + Zod ✅ (Only This)

| Package | Role |
|---|---|
| `react-hook-form` | Form state, registration, submission, error handling |
| `zod` | Schema definition + type inference |
| `@hookform/resolvers` | Bridge between RHF and Zod (`zodResolver`) |

**Rules:**
- Always use `useForm` / `useFieldArray` — never manage form state with raw `useState`
- All schemas live in `reusable/schema.ts` within the relevant route group
- Use `isSubmitting` from `formState` for loading states — never a separate `useState`
- Use `Controller` for custom inputs (OTP boxes, color pickers, etc.)

```tsx
// ✅ Correct pattern
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MyData>({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
});

// ❌ Never mix raw useState with RHF
const [email, setEmail] = useState(''); // ← wrong when a form exists
```

---

### Data Tables — AG Grid ✅ (Only This)

| Package | Decision |
|---|---|
| ✅ `ag-grid-react` (Community) | **USE THIS.** Virtualized rows, column sorting/filtering/pinning, CSV export, zero dependencies |
| ❌ TanStack Table | Requires building UI from scratch — too much boilerplate per page |
| ❌ Plain `<table>` | No virtualization — will lag with 200+ rows |
| ❌ MUI DataGrid | Pulls in full MUI runtime |

**AG Grid setup per module (v33+):**
```tsx
// 1. Register modules once per page
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { gridTheme } from '../../reusable/gridTheme'; // reads CSS vars from module.css

ModuleRegistry.registerModules([AllCommunityModule]);

// 2. Pass theme prop — NO className wrapper div needed
<AgGridReact theme={gridTheme} rowData={data} columnDefs={colDefs} />

// ❌ Old v32 pattern — DO NOT USE
// <div className="ag-theme-alpine-dark"><AgGridReact /></div>
```

**When to use AG Grid vs simple table:**
- **ALWAYS use AG Grid.** Do not use plain `<table>` elements or flex/grid based custom tables. Even if there are only 5 static rows, use `ag-grid-react` to maintain 100% UI consistency, enforce strict column sizing, and prevent technical debt when the module scales later.

---

### Charts — Recharts ✅ (Only This)

| Package | Decision |
|---|---|
| ✅ `recharts` | **USE THIS.** Native React components, JSX-first API, full TypeScript types, CSS var strings work directly in props, tree-shakeable, React 19 + Next 16 compatible, actively maintained (v3 released 2024) |
| ❌ `chart.js` + `react-chartjs-2` | **BANNED.** Imperative canvas API wrapped in a React shim — not JSX-native, CSS vars don't work in config objects, requires `'use client'` guards everywhere, worse TypeScript DX, no tree-shaking |
| ❌ D3.js | **DO NOT USE.** Imperative DOM manipulation, no React integration, massive learning curve |

**Why Recharts wins for enterprise in 2026:**
- Every chart element (`<Bar>`, `<Line>`, `<XAxis>`) is a real React component — conditional rendering, props, refs all work naturally
- CSS custom properties (`var(--primary)`) pass directly into `fill`, `stroke`, `color` props — zero theming boilerplate
- TypeScript-first: all props are typed, no `@types/` package needed
- Works in RSC-adjacent pages — no canvas ref hacks needed
- `ResponsiveContainer` handles resize natively without extra plugins

**Recharts usage pattern:**
```tsx
// ✅ Correct — CSS var strings as data-driven colors (Rule 3 compliant)
const PIE_COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)'];

<ResponsiveContainer width="100%" height={280}>
  <BarChart data={data}>
    <CartesianGrid stroke="var(--border)" strokeOpacity={0.4} />
    <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
    <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
    <Bar dataKey="Revenue" fill="var(--primary)" radius={[4,4,0,0]} />
    <Bar dataKey="Expenses" fill="var(--danger)"  radius={[4,4,0,0]} />
  </BarChart>
</ResponsiveContainer>

// ❌ Never use chart.js — imperative config, no CSS var support
const options = { scales: { x: { ticks: { color: '#8888AA' } } } }; // hex hardcoded
```

---

### Notifications / Toast

| Package | Decision |
|---|---|
| ✅ `react-hot-toast` | **USE THIS.** 5kb, zero config, works with App Router |
| ❌ `react-toastify` | Larger bundle, styled differently |

---

### Dates

| Package | Decision |
|---|---|
| ✅ `date-fns` | **USE THIS.** Tree-shakeable, functional, TypeScript-first |
| ❌ `moment.js` | **BANNED.** 67kb, unmaintained, not tree-shakeable |
| ❌ `dayjs` | Similar to date-fns but less TypeScript-native |

---

### ❌ Banned Packages (Never Add)

| Package | Reason |
|---|---|
| `@mui/material` | Already in project as legacy — do NOT use for new components |
| `@emotion/react` / `@emotion/styled` | CSS-in-JS runtime, conflicts with Tailwind |
| `styled-components` | Same as above |
| `axios` | `fetch()` is sufficient for Next.js RSC patterns |
| `lodash` | Use native JS or specific tiny packages |
| `jquery` | Obviously no |
| `chart.js` + `react-chartjs-2` | Imperative canvas API, no CSS var support, not JSX-native — use `recharts` |
| `wouter` | Use Next.js App Router — no client-side router needed |

---

### 📐 CSS Architecture — THE LAW (Read Before Writing Any Module)

---

#### ⚠️ THE CORE RULE — One CSS File Per Route Group. Zero Exceptions.

Every route group gets **exactly one CSS file**. That file is the **single source of truth** for ALL visual values in that module — every color token, every component class, every third-party library theme value.

**If you want to change any color tomorrow — you open ONE file. It reflects everywhere instantly.**

---

#### 📁 File Naming & Location

| Route Group | CSS File | Imported In |
|---|---|---|
| `(superadmin)` | `superadmin.css` | `(superadmin)/layout.tsx` |
| `(auth)` | `auth.css` | `(auth)/layout.tsx` |
| `(admin)` | `admin.css` | `(admin)/layout.tsx` |
| `(manager)` | `manager.css` | `(manager)/layout.tsx` |
| `(system)` | `system.css` | `(system)/layout.tsx` |

**Rules:**
- CSS file lives at the **root** of its route group folder — never inside a subfolder
- Imported **once only** in `layout.tsx` — never inside a page or component file
- The `layout.tsx` wraps children in a theme class: `<div className="modulename-theme">`

```tsx
// ✅ (auth)/layout.tsx — correct
import './auth.css';
export default function AuthLayout({ children }) {
  return <div className="auth-theme min-h-screen">{children}</div>;
}

// ✅ (superadmin)/layout.tsx — correct
import './superadmin.css';
export default function SuperAdminLayout({ children }) {
  return <div className="superadmin-theme">{children}</div>;
}
```

---

#### 🏗️ CSS File Internal Structure — Follow This Order Always

```css
/* ─────────────────────────────────────────────
   SECTION 1 — Font Import
───────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');


/* ─────────────────────────────────────────────
   SECTION 2 — Color & Design Tokens
   ALL hex values live HERE and ONLY HERE.
   Pages and components NEVER contain hex codes.
───────────────────────────────────────────── */
@layer base {
  .modulename-theme {
    /* ── Core Brand ── */
    --primary:          #6366F1;   /* Indigo-500  — buttons, active nav, links        */
    --primary-hover:    #4F46E5;   /* Indigo-600  — button hover                      */
    --primary-subtle:   #EEF2FF;   /* Indigo-50   — badge bg, selected row highlight  */

    /* ── Backgrounds ── */
    --bg-page:          #0F0F1A;   /* darkest — main page background                  */
    --bg-card:          #1A1A2E;   /* card, panel, table background                   */
    --bg-sidebar:       #12121F;   /* sidebar background                              */
    --bg-header:        #16162A;   /* top header background                           */
    --bg-input:         #1E1E32;   /* input field background                          */

    /* ── Borders ── */
    --border:           #2A2A3E;   /* card borders, table dividers, input borders     */
    --border-focus:     #6366F1;   /* input border on focus                           */

    /* ── Text ── */
    --text-primary:     #F0F0FF;   /* headings, table values, all primary text        */
    --text-secondary:   #8888AA;   /* labels, captions, placeholders, subtitles       */
    --text-disabled:    #44445A;   /* disabled states                                 */

    /* ── Semantic Status Colors ── */
    --success:          #10B981;   /* Emerald-500 — active/paid/present/working       */
    --success-bg:       #064E3B;   /* Emerald-900 — success badge background          */
    --warning:          #F59E0B;   /* Amber-500   — pending/expiring/moderate         */
    --warning-bg:       #451A03;   /* Amber-900   — warning badge background          */
    --danger:           #EF4444;   /* Red-500     — error/overdue/suspended/broken    */
    --danger-bg:        #450A0A;   /* Red-900     — danger badge background           */
    --info:             #3B82F6;   /* Blue-500    — new/neutral/cash mode             */
    --info-bg:          #1E3A5F;   /* Blue-900    — info badge background             */
    --purple:           #8B5CF6;   /* Violet-500  — alumni/UPI/special callouts       */
    --purple-bg:        #2E1065;   /* Violet-900  — purple badge background           */

    /* ── Module-specific extras go here (examples) ── */
    /* --branding-primary-default: #c0c1ff; */
    /* --branding-accent-default:  #ffb783; */

    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    color: var(--text-primary);
    background-color: var(--bg-page);
    box-sizing: border-box;
  }

  .modulename-theme *,
  .modulename-theme *::before,
  .modulename-theme *::after {
    box-sizing: border-box;
  }
}


/* ─────────────────────────────────────────────
   SECTION 3 — Reusable Component Classes
   Prefix: module abbreviation (sa-, auth-, sys-, adm-)
   Every visual element used in this module
   gets a class here. No exceptions.
───────────────────────────────────────────── */
@layer components {

  /* ── Buttons ── */
  .xx-btn-primary { ... }
  .xx-btn-ghost   { ... }
  .xx-btn-danger  { ... }
  .xx-btn-icon    { ... }

  /* ── Form Elements ── */
  .xx-input    { ... }
  .xx-label    { ... }
  .xx-select   { ... }
  .xx-textarea { ... }
  .xx-error    { ... }

  /* ── Cards & Panels ── */
  .xx-card        { ... }
  .xx-card-header { ... }

  /* ── Badges ── */
  .xx-badge           { ... }
  .xx-badge--success  { ... }
  .xx-badge--warning  { ... }
  .xx-badge--danger   { ... }
  .xx-badge--info     { ... }
  .xx-badge--primary  { ... }

  /* ── Tables ── */
  .xx-table-header { ... }
  .xx-table-row    { ... }

  /* ── Page Layout ── */
  .xx-page       { ... }
  .xx-breadcrumb { ... }
  .xx-page-title { ... }

  /* ── KPI / Stat Cards ── */
  .xx-kpi-card { ... }

  /* ── Progress / Spinner ── */
  .xx-progress-track { ... }
  .xx-progress-fill  { ... }
  .xx-spinner        { ... }

  /* ── Any page-specific utility classes ── */
  /* e.g. .xx-offline-page, .xx-preview-sidebar, etc. */
}


/* ─────────────────────────────────────────────
   SECTION 4 — Third-Party Library Tokens
   AG Grid, Recharts, etc.
   These MUST live here — never in JS/TS files.
───────────────────────────────────────────── */
:root {
  --ag-bg:          #1A1A2E;
  --ag-fg:          #F0F0FF;
  --ag-header-bg:   rgba(99,102,241,0.08);
  --ag-header-text: #8888AA;
  --ag-border:      #2A2A3E;
  --ag-odd-row-bg:  rgba(255,255,255,0.02);
  --ag-row-hover:   rgba(99,102,241,0.06);
  --ag-font:        Inter, sans-serif;
  --ag-font-size:   13;
}
```

---

#### 🏷️ Class Prefix Convention

Every module uses a short prefix for all its CSS classes. This prevents collisions across modules.

| Route Group | Prefix | Example Classes |
|---|---|---|
| `(superadmin)` | `sa-` | `sa-card`, `sa-btn-primary`, `sa-badge--success` |
| `(auth)` | `auth-` | `auth-input`, `auth-btn-primary`, `auth-card` |
| `(system)` | `sys-` | `sys-card`, `sys-btn-ghost`, `sys-kpi-card` |
| `(admin)` | `adm-` | `adm-card`, `adm-btn-primary`, `adm-badge` |
| `(manager)` | `mgr-` | `mgr-card`, `mgr-input`, `mgr-table-row` |

---

#### 🚫 The No-Inline-Style Rule — Exactly How It Works

This is the most important rule. Study the examples below carefully.

**RULE 1 — No hex codes ever in `.tsx` files.**

```tsx
// ✅ CORRECT — color comes from CSS token via Tailwind
<div className="text-[var(--primary)] bg-[var(--bg-card)]" />

// ✅ CORRECT — color comes from CSS class defined in module.css
<div className="sa-card" />

// ❌ WRONG — hex hardcoded in TSX
<div className="text-[#6366F1] bg-[#1A1A2E]" />

// ❌ WRONG — hex hardcoded in state
const [color, setColor] = useState('#6366F1');
```

**RULE 2 — No `style={{ }}` with static values. Static styles belong in CSS classes.**

```tsx
// ✅ CORRECT — static style is a CSS class
<div className="sa-card" />

// ❌ WRONG — static style written inline
<div style={{ backgroundColor: '#1A1A2E', borderRadius: '12px' }} />

// ❌ WRONG — static style using token inline
<div style={{ backgroundColor: 'var(--bg-card)' }} />
// → Instead add .xx-card { background-color: var(--bg-card); } to the CSS file
```

**RULE 3 — `style={{ }}` is ONLY allowed for truly dynamic computed values.**

These are values that are calculated at runtime and cannot be expressed as a static CSS class:

```tsx
// ✅ ALLOWED — dynamic computed width (progress bar, time bar)
<div className="sa-progress-fill" style={{ width: `${pct}%` }} />

// ✅ ALLOWED — dynamic computed position (timeline, seat gap visualizer)
<div className="absolute" style={{ left: `${start}%`, width: `${span}%` }} />

// ✅ ALLOWED — dynamic height for AG Grid container
<div style={{ height: 420 }}><AgGridReact ... /></div>

// ✅ ALLOWED — dynamic color from data array (chart colors, status colors)
// where the color value is already a CSS token string like 'var(--success)'
const METRICS = [
  { color: 'var(--success)' },
  { color: 'var(--danger)' },
];
<Icon style={{ color: metric.color }} />
```

**RULE 4 — Dynamic user-chosen values (e.g. color pickers) use CSS custom properties set via `ref.style.setProperty()`, never scattered inline on children.**

```tsx
// ✅ CORRECT — set CSS var ONCE on container via ref, children use CSS classes
const containerRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  containerRef.current?.style.setProperty('--preview-primary', userChosenColor);
}, [userChosenColor]);

<div ref={containerRef}>
  <div className="xx-preview-icon" />      {/* reads var(--preview-primary) from CSS */}
  <div className="xx-preview-btn" />       {/* reads var(--preview-primary) from CSS */}
  <div className="xx-preview-swatch" />    {/* reads var(--preview-primary) from CSS */}
</div>

// ❌ WRONG — user color scattered on every child inline
<div style={{ backgroundColor: userColor + '22', color: userColor }}>...</div>
<div style={{ backgroundColor: userColor }}>...</div>
<div style={{ color: userColor }}>...</div>
```

**RULE 5 — Default values for dynamic state (color pickers, etc.) come from CSS tokens, not hardcoded hex.**

```tsx
// ✅ CORRECT — read default from CSS token on mount
function readToken(token: string) {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

// In system.css: --branding-primary-default: #6366F1;
useEffect(() => {
  setColor(readToken('--branding-primary-default'));
}, []);

// ❌ WRONG — hex hardcoded as default in useState
const [color, setColor] = useState('#6366F1');
```

---

#### 🔌 AG Grid Theming — CSS Variables Bridge Pattern

AG Grid v33+ uses a JS-based theming API. To keep ALL values in the CSS file:

**Step 1 — Define AG Grid tokens in the module CSS file (Section 4 above).**

**Step 2 — Create ONE `reusable/gridTheme.ts` per route group that reads those CSS vars:**

```ts
// (superadmin)/reusable/gridTheme.ts
// ⚠️ Zero hardcoded values here — everything comes from superadmin.css
import { themeQuartz } from 'ag-grid-community';

const v = (name: string) =>
  typeof window !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    : '';

export const gridTheme = themeQuartz.withParams({
  backgroundColor:       v('--ag-bg'),
  foregroundColor:       v('--ag-fg'),
  headerBackgroundColor: v('--ag-header-bg'),
  headerTextColor:       v('--ag-header-text'),
  borderColor:           v('--ag-border'),
  rowBorder:             true,
  oddRowBackgroundColor: v('--ag-odd-row-bg'),
  rowHoverColor:         v('--ag-row-hover'),
  fontFamily:            v('--ag-font'),
  fontSize:              13,
  wrapperBorder:         false,
  wrapperBorderRadius:   0,
});
```

**Step 3 — Every page using AG Grid imports from this one shared file:**

```tsx
import { gridTheme } from '../../reusable/gridTheme';
<AgGridReact theme={gridTheme} rowData={data} columnDefs={cols} />
```

---

#### ✅ Complete Rules Cheatsheet

| What | ✅ Correct | ❌ Wrong |
|---|---|---|
| Hex color values | Only inside `module.css` tokens | In any `.tsx` or `.ts` file |
| Static element styles | CSS class in `module.css` | `style={{ }}` prop on JSX |
| Dynamic computed values | `style={{ width: pct+'%' }}` | Anything else |
| Dynamic user-chosen colors | `ref.style.setProperty()` once on container | Scattered `style={{ color: userVal }}` on children |
| Default color values in state | `readToken('--my-token')` on mount | `useState('#6366F1')` |
| Tailwind color classes | `bg-[var(--bg-card)]` | `bg-[#1A1A2E]` |
| AG Grid colors | `--ag-*` vars in `module.css` | `withParams({ backgroundColor: '#1A1A2E' })` |
| `gridTheme` file | One per module in `reusable/gridTheme.ts` | Defined per page |
| CSS file import | Once in `layout.tsx` | Inside pages or components |
| Class naming | `sa-card`, `auth-input`, `sys-btn-primary` | Generic names like `.card`, `.btn` |

---

#### 📂 Real Examples From This Codebase

**`(auth)/auth.css`** — tokens + `auth-*` classes, no hex anywhere else:
```css
@layer base {
  .auth-theme {
    --primary:       #6366F1;
    --primary-hover: #4F46E5;
    --primary-subtle:#EEF2FF;
    --bg-page:       #0F0F1A;
    --bg-card:       #1A1A2E;
    --bg-sidebar:    #12121F;
    --bg-input:      #1E1E32;
    --border:        #2A2A3E;
    --border-focus:  #6366F1;
    --text-primary:  #F0F0FF;
    --text-secondary:#8888AA;
    --text-disabled: #44445A;
    --success:       #10B981;  --success-bg: #064E3B;
    --warning:       #F59E0B;  --warning-bg: #451A03;
    --danger:        #EF4444;  --danger-bg:  #450A0A;
    --info:          #3B82F6;  --info-bg:    #1E3A5F;
    --purple:        #8B5CF6;  --purple-bg:  #2E1065;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
  }
}
@layer components {
  .auth-input {
    background-color: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text-primary);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .auth-input:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent);
  }
  .auth-btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--purple));
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 600;
    cursor: pointer;
  }
  .auth-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
  }
  .auth-error {
    font-size: 12px;
    color: var(--danger);
    margin-top: 4px;
  }
  /* ... all other auth-* classes ... */
}
```

**`(auth)/layout.tsx`** — imports CSS once, wraps in theme class:
```tsx
import './auth.css';
export default function AuthLayout({ children }) {
  return <div className="auth-theme min-h-screen">{children}</div>;
}
```

**`(auth)/login/LoginForm.tsx`** — uses only CSS classes, zero hex, zero inline styles:
```tsx
// ✅ Zero hex. Zero style={{}}. Only CSS classes.
<div className="auth-card">
  <input className="auth-input" placeholder="Email" />
  <p className="auth-error">Invalid email</p>
  <button className="auth-btn-primary">Sign In</button>
</div>
```

**`(superadmin)/superadmin.css`** — same pattern with `sa-` prefix:
```css
@layer components {
  .sa-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  .sa-btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--purple));
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-weight: 600;
    cursor: pointer;
  }
  .sa-badge--success {
    background-color: var(--success-bg);
    color: var(--success);
    border: 1px solid color-mix(in srgb, var(--success) 30%, transparent);
  }
  .sa-badge--danger {
    background-color: var(--danger-bg);
    color: var(--danger);
    border: 1px solid color-mix(in srgb, var(--danger) 30%, transparent);
  }
  .sa-progress-track {
    width: 100%;
    height: 6px;
    background-color: var(--border);
    border-radius: 9999px;
    overflow: hidden;
  }
  .sa-progress-fill--success { height: 100%; border-radius: 9999px; background-color: var(--success); }
  .sa-progress-fill--danger  { height: 100%; border-radius: 9999px; background-color: var(--danger); }
  .sa-progress-fill--primary { height: 100%; border-radius: 9999px; background: linear-gradient(90deg, var(--primary), var(--purple)); }
}
```

**`(superadmin)/superadmin/libraries/page.tsx`** — dynamic progress width is the ONLY `style={{}}`:
```tsx
// ✅ Only dynamic computed value uses style prop — width is runtime-calculated
<div className="sa-progress-track">
  <div className="sa-progress-fill--success" style={{ width: `${pct}%` }} />
</div>

// ✅ Everything else uses CSS classes — zero hex, zero static inline styles
<div className="sa-card">
  <span className="sa-badge sa-badge--success">✅ Active</span>
  <span className="sa-badge sa-badge--danger">🔴 Overdue</span>
</div>

// ✅ Dynamic color from data array — value is a CSS token string, not a hex
const METRICS = [
  { label: 'Web Servers', color: 'var(--success)' },
  { label: 'API Latency', color: 'var(--info)'    },
];
<Icon style={{ color: metric.color }} />  // ✅ token string, not '#10B981'
```

---

## 📖 TABLE OF CONTENTS



# PROJECT KA MATLAB

## 🎯 The Pitch

**Smart Library 360** bas ek database nahi hai. Ye ek **Business Operating System (BOS)** hai.
Ye ek Library Owner ko "Register-Pen" se hata kar "Data-Driven CEO" banata hai. Ye system admission se lekar renewal, complaints, aur profit calculation tak sab kuch automate karta hai.

## 💡 The Problem & Your Solution

| Problem (Traditional Library) | Your Solution (Smart Library 360) |
| --- | --- |
| **Revenue Leakage** (Owner ko pata nahi kitna cash aaya/gaya) | **Daily P&L Report** (Fees Collected - Expenses = Net Profit) |
| **Seat Wastage** (Student chala gaya par seat occupied dikh rahi hai) | **Auto-Vacancy Logic** (Expire hote hi seat free) |
| **Lead Loss** (Log poochne aaye par wapas nahi aaye) | **Enquiry CRM** (Auto follow-up reminders) |
| **Shift Conflicts** (Ek seat par subah/shaam clash) | **Zero-Clash Algorithm** (Time-slot blocking) |
| **Manual ID Cards** (Bahar se print karwana padta hai) | **In-built ID Card Generator** (Click & Print) |

---

---

# TARGET AUDIENCE (Kaun Kharidega?)

1. **Private Reading Rooms / Self-Study Centers** (Major Market in India).
2. **Co-Working Spaces** (Hot desking logic same hai).
3. **Coaching Institutes** jinke paas library facility hai.
4. **Public Libraries** (Government/NGO).

---

---

# 8 CORE MODULES (Complete Features)

## **Module 1: Smart Dashboard (The Cockpit)**

**Owner subah uthkar sabse pehle ye dekhega:**

* **Live Occupancy:** "Morning Shift: 95% Full | Evening: 40% Full".
* **Financial Health:** Today's Collection vs Today's Expense.
* **Action Items:** 5 Renewals Due, 2 New Enquiries, 1 Complaint Pending.
* **Seat Matrix Visualization:**  Ek visual grid jisme Green (Free), Red (Occupied), aur Orange (Expiring Soon) seats dikhein.
* **Advanced Filtering Engine:**
    * Filter by "Shift = Morning" + "Fees = Due".
    * Exact target audience nikalne ke liye.

## **Module 2: Enquiry & Lead CRM (Sales Engine)**



**Feature Missing in most projects!**

* **Lead Capture:** Jab koi student sirf poochne aata hai, uska data `Leads` table mein jayega.
* **Status Tracking:** `New` -> `Visited` -> `Interested` -> `Converted` or `Lost`.
* **Follow-up Reminder:** System admin ko yaad dilayega: *"Call Rahul today (Enquired 2 days ago)."*
* **Conversion:** Ek click mein "Convert to Student" (Data admission form mein copy ho jayega).

## **Module 3: Admission & Seat Allocation (The Core)**

* **Conflict Detection:** Seat assign karne se pehle Time Slot + Seat Number check.
* **Shift Management:**
* *Fixed Shifts:* (e.g., 6AM-12PM, 12PM-6PM).
* *Flexible Slots:* (User defined custom hours).
* **Multi-Slot Support (Hybrid Schedules):**
    * Student can book "8 AM - 10 AM" AND "5 PM - 8 PM" (JSON Array support).
    * Perfect for students jo beech mein college jate hain.


* **Shift Swapping/Migration:** Agar student Morning se Evening jana chahta hai?
* System purani seat free karega -> Nayi seat check karega -> Fees difference calculate karega (+/- adjustment).


* **Document Vault:** Photo, Aadhar Card upload & storage.
* **Group Admission (Batch-wise):**
    * Same college ka 10 students ek saath join kare toh 10-15% group discount apply ho.
    * Bulk management easy ho.
* **Referral Bonus System:**
    * "Aap jo naya student le aao toh ₹200 cashback aapke account mein jayega".
    * Viral growth ke liye.
* **Seat Maintenance Log:**
    * Track karo: Seat 5 ko leg kharab tha, repair done on 15th Jan, working status ✓.
    * Auto-alert agar maintenance due ho.

## **Module 4: Fees & Subscription Engine**

* **Dynamic Packages:** Create plans like "Monthly - ₹1000", "Quarterly - ₹2800 (Discounted)".
* **Partial Payment Support:** Total ₹1000, Paid ₹500, Due ₹500. (System tracks 'Due Amount').
* **Security Deposit Tracking:** Refundable deposit ka alag section.
* **Discount Coupons:** Admin can apply "NEWYEAR50" code.
* **Auto-Invoice:** GST compliant invoice generation (PDF).
* **Late Fee / Penalty System:**
    * Fee due tha 15th ko, payment hua 20th ko → +₹50 penalty add ho.
    * Rules set karo: "₹50 per day after 5 days".
* **Dynamic Capacity Scaling:**
    * "Seats 100 se 150 ho gayi?" System auto-detects max seat number.
    * No need to change code. Just assign Seat 150, system upgrades total capacity.
* **Auto-Downgrade on Non-Payment:**
    * 10 days payment late → Seat access automatically suspend ho jayega.
    * Auto-restore on payment.
* **Referral Discounts / Promo Codes (Dynamic):**
    * Admin dynamically create kar sakta hai: "FRIEND50" = ₹50 discount.
    * Track karo kitna use hua, ROI dekho.
* **Promise to Pay (PTP) Tracking:**
    * Student ne bola "20th ko dunga". Admin sets 'Expected Date' = 20th.
    * 20th ko system Reminder bhejega. "Aaj commitment date hai".
* **Commitment Reliability Score:**
    * System tracks *kitni baar* student ne date change ki (`PaymentExpectedDateChanged`).
    * Agar score high hai (e.g., 5 times changed), toh Manager ko warning milegi "Low Trust Student".

## **Module 5: Operations & Resource Management**

* **Locker Matrix:** Visual grid for lockers (Linked to student ID).
* **ID Card Generator:**
* System student ke photo, name, aur QR code ke saath ek ID Card PDF generate karega.
* Admin bas print karke laminate kar le.


* **Asset/Inventory Management:**
* Total Chairs: 50, ACs: 2, Fans: 10.
* Maintenance Logs: "AC Service Due on 25th".



## **Module 6: Expense Manager (Profit Tracker)**

**Crucial for Business Owners:**

* Admin apne kharche add karega: Rent, Electricity Bill, Cleaning Staff Salary, Newspaper Bill, WiFi Bill.
* **Net Profit Calculation:** `Total Fees Collected - Total Expenses = Real Profit`.

## **Module 7: Attendance & Access Control**

* **Manual Mode:** Staff marks attendance.

* **Absentee Report:** "Rahul 4 din se nahi aaya" -> Auto SMS to parents 

## **Module 8: Student Engagement & Alerts**

* **Smart ID Auto-Fill (Gap Filling):**
    * Agar ID #3 wala student chhod gaya, next student ko ID #3 milega (Not #100).
    * Keeps records compact and serial. but previous student ka data delete nahi hoga
    rather it will be shifted to #100 like that ....
* **Notice Board:** "Library will be closed on Holi". (Broadcast SMS/WhatsApp).
* **Complaint Box:** "AC cooling nahi kar raha" (Anonymous complaints allowed).


## **Module 9: Security & Admin Control (SaaS Essentials)**

**Trust factor increase karne ke liye:**

* **Role-Based Access Control (RBAC):**
    * **Super Admin (Owner):** Can see Revenue, Delete items, Change settings.
    * **Staff (Manager):** Can only Mark Attendance, Add Student, Collect Fee. Mark student as left but cannot see the  Profit.
* **Audit Logs (The "Post-Mortem"):**
    * "Staff Rahul deleted a receipt of ₹500 at 4:30 PM".
    * Har sensitive action ka log maintain hoga. Fraud pakdne ke liye.
* **Automated Data Backups:**
    * Daily Nightly Backup to Cloud.
    * "System crashed? Don't worry, kal raat ka data safe hai."
* **Secure Account Recovery:**
    * "Forgot Password?" logic with OTP verification (Email/SMS).
  

## **Module 10: Onboarding & Migration (The Easy-Switch)**

**Client purana data kaise layega?**

* **Bulk Data Import:**
    * Upload Excel sheet -> 100 students imported in 5 seconds.
    * **Error Handling:** "Row 5 mein Mobile Number missing hai" -> System batayega.
* **Setup Wizard:**
    * First time login karne par step-by-step guide: "Add Shift -> Add Seats -> Create Plan".

---

---

# 15+ KILLER USPs (Selling Points)

Ye wo features hain jo client ko deal close karne par majboor kar denge:

| # | Feature | Why Client Will Buy? |
| --- | --- | --- |
| **1** | **Gap Filling Algorithm** | Agar Seat 5 par "8-10 AM" aur "4-6 PM" booked hai, system batayega ki "10 AM - 4 PM" slot khaali hai. (Maximize Revenue). |
| **2** | **Seat History Log** | "Pichle 6 mahine mein Seat 12 par kaun kaun baitha tha?" (Security purposes). |
| **3** | **Shift Migration Calculator** | Shift change karte waqt paise ka ghapla nahi hoga. System auto-calculate karega. |
| **4** | **WhatsApp Integration** | Fee Receipt, Welcome Msg, Renewal Alert sidha student ke WhatsApp par. |
| **5** | **Offline Mode (PWA)** | Agar internet chala gaya, tab bhi Attendance aur Basic entry ho sakegi. (Syncs later). |
| **6** | **Multi-Branch Support** | Malik apne ghar baithe "Branch A" aur "Branch B" dono ka revenue dekh sakta hai. |
| **7** | **In-built ID Card Maker** | Bahar se design karwane ka kharcha bachaata hai. |
| **8** | **Auto-Lock Defaulters** | Fee due date nikal gayi? Dashboard par student ka naam "RED" ho jayega. |
| **9** | **Waitlist Automation** | Seat full hai? Waitlist mein dalo. Seat khali hote hi auto-notify karo. |
| **10** | **Power Saving Mode** | "Evening shift mein sirf 10 bachhe hain? Unko Room A mein shift karke Room B ka AC band kar do." (Occupancy Logic). |
| **11** | **Expense vs Income Graph** | Visual chart jo dikhata hai business profit mein hai ya loss mein. |
| **12** | **GST Ready** | Agar library registered hai, toh GST invoice generate hoga. |
| **13** | **Data Export** | Client ko data ka control chahiye. 1-click Excel Backup. |
| **14** | **Daily Settlement Report** | Staff owner ko raat mein SMS bhejta hai: "Aaj ka cash ₹5000, UPI ₹2000. Total ₹7000". |
| **15** | **Blacklist System** | Troublemaker students ko blacklist karo taaki wo dobara join na kar sakein. |
| **16** | **Staff Fraud Detection** | Audit logs batayenge agar staff ne paise lekar entry delete kar di. |
| **17** | **White-Labeling (Branding)** | Client apna logo aur color scheme use kar sakta hai. Make it "Their App". |
| **18** | **Auto-Scale Infrastructure** | Library expand hui? System auto-scale karega (No limit on Seats/Lockers). |

---

---

# THE COMPLETE USER JOURNEY (Story Mode)

## **Scenario: From "Enquiry" to "Alumni"**

### **Stage 1: The Lead (Sales)**

* **Student (Amit)** library aata hai: "Seat hai kya?"
* **Manager:** Dashboard check karta hai. "Morning Full hai, Afternoon mein 2 seats hain."
* Manager Amit ka naam aur phone number **CRM Module** mein dalta hai.
* Amit chala jata hai.
* **2 Days Later:** System Manager ko alert deta hai: "Call Amit". Manager call karta hai -> Amit haan bolta hai.

### **Stage 2: Onboarding (Conversion)**

* Manager CRM mein "Convert" button dabata hai.
* **Admission Form** khulta hai.
* **Seat Selection:** Manager "Afternoon Shift" select karta hai. System Sirf Available seats dikhata hai. Seat 22 select hoti hai.
* **Fees:** ₹1000 Monthly. Amit ₹500 deta hai. System "Due: ₹500" record karta hai.
* **ID Card:** Manager "Print ID" click karta hai aur Amit ko card deta hai.
* Amit ke phone par WhatsApp: *"Welcome to Smart Library! Receipt #123 generated."*

### **Stage 3: Daily Life (Operations)**

* Amit aata hai, Apna Id Card show karta hai to staff -> **Attendance Marked**.
* Amit ko locker chahiye. Manager Locker Grid se **Locker 5** assign karta hai (+₹200 added to bill).
* Amit complain karta hai "WiFi slow hai". Manager system mein Ticket raise karta hai.

### **Stage 4: Renewal & Upsell**

* 28th day par system Amit ko SMS bhejta hai: *"Fees Due in 2 days."*
* Manager ko dashboard par "Upcoming Due" list mein Amit dikhta hai.
* Amit payment karta hai. Manager "Renew Subscription" click karta hai.
* Receipt auto-sent.

### **Stage 5: Exit (Churn Management)**

* Amit ki job lag gayi. Wo chhod raha hai.
* Manager "Mark Exit" karta hai.
* **System Logic:**
1. Seat 22 -> **AVAILABLE**.
2. Locker 5 -> **AVAILABLE**.
3. Stats update: "This Month Exits: +1".


* System Amit ko "Alumni" group mein daal deta hai (Future marketing ke liye).

---

---

# REVENUE MODEL (How YOU will sell this)

Agar aap isse market mein bechna chahte hain, toh yahan pricing models hain:

1. **SaaS Subscription (Recurring):**
* Client pays ₹999/month to use the software.
* *Best for consistent income.*


2. **One-Time License (Product):**
* Charge ₹15,000 - ₹25,000 for lifetime access + AMC (Annual Maintenance Charge) of ₹3,000/year.


3. **Freemium:**
* Upto 20 students free. Above 20, pay per student.



---

### **🚀 Final Check**

Isme ab **CRM, Finance, Operations, Inventory, HR (Shift), Marketing, aur Security** sab cover ho gaya hai. Ab ye sirf ek project nahi, ek **Commercial Product** hai jo kisi bhi Library owner ki life aasaan bana dega.

Does this look perfect for your goal?

