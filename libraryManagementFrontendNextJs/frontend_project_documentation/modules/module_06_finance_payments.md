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
