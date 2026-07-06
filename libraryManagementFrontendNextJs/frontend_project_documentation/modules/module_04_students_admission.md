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
