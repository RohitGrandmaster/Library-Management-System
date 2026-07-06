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
