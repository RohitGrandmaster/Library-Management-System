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
