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
