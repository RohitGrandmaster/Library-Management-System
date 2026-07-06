Maine apna pura internal system aur aapke dono inputs (Summary Features + 28 Database Models) ko **teesri baar deeply cross-check** kiya hai. 

Ab main aapko ek **Master Final List** de raha hoon. Is list mein purane saare pages, 4 naye pages (jo humne abhi discuss kiye), aur har page ka DB architecture ke saath exact link shamil hai. Iske baad aapko Next.js frontend ke liye kisi aur file ki zaroorat nahi padegi.

Yahan aapka **Smart Library 360 - 100% Complete Frontend Blueprint** hai:

---

### **1. 🔐 Auth, Onboarding & Public Pages**
* **`login.tsx`**
    * **Feature:** Staff/Admin Secure Login.
    * **Inputs:** Email/Phone, Password. | **Buttons:** "Login", "Forgot Password".
    * **DB Model:** `User` (Checks `isActive`, `role`).
* **`signup.tsx`**  
    * **Feature:** Naye owner ka registration (SaaS SaaS).
    * **Inputs:** Owner Name, Email, Phone, Password, Library Name. | **Buttons:** "Create Account".
    * **DB Model:** `User` (Owner) & `Branch` (Initial setup).
* **`setup-wizard.tsx`**
    * **Feature:** 1st-time login step-by-step setup (Module 10: "Add Shift → Add Seats → Create Plan").
    * **Steps:** Step 1: Branch Address & GST → Step 2: Define Shifts (Morning/Evening) → Step 3: Add Seats (Total count & numbering) → Step 4: Create at least one Fee Plan → Step 5: Launch Dashboard.
    * **Inputs:** Address, GST Number, Shift Names/Times, Seat Count/Prefix, Plan Name/Duration/Price. | **Buttons:** "Next", "Back", "Launch Dashboard".
    * **DB Models:** `Branch`, `Shift`, `Seat`, `Plan`.
* **`public-enquiry-form.tsx`**
    * **Feature:** QR scan karke student khud lead form bhare (No login required).
    * **Inputs:** Name, Phone, Desired Shift. | **Buttons:** "Submit Enquiry".
    * **DB Model:** `Enquiry` (Status: 'new').
* **`forgot-password.tsx` & `reset-password.tsx`**
    * **Feature:** Password recovery via OTP.
    * **Inputs:** Phone/Email, New Password. | **Buttons:** "Send OTP", "Update Password".
    * **DB Model:** `User`.

---

### **2. 📊 Main Dashboard & Analytics**
* **`dashboard.tsx`**
    * **Feature:** The CEO Cockpit. Live stats overview.
    * **Data Displayed:** Active Students, Today's Revenue, Occupied Seats, Action items (Due fees, Pending Enquiries, Complaints, Renewals Due).
    * **Seat Matrix Visualization:** Visual grid with **Green** (Free), **Red** (Occupied), **Orange** (Expiring Soon within 7 days) color coding.
    * **Advanced Filtering Engine:** Filter by "Shift = Morning" + "Fees = Due" to find exact target audience.
    * **DB Models:** Aggregation of `Student`, `Payment`, `Seat`, `Subscription`, `Enquiry`, `Complaint`.
* **`reports.tsx`**
    * **Feature:** Visual charts for P&L and growth.
    * **Data Displayed:** Income vs Expense (Bar chart), Shift-wise Occupancy (Pie chart), Monthly Revenue Trend, Student Growth.
    * **DB Models:** `Payment`, `Expense`, `StudentSlot`.

---

### **3. 📞 CRM & Leads Management**
* **`enquiries.tsx`**
    * **Feature:** Leads ka Kanban board ya table.
    * **Data Displayed:** Name, Phone, Status (New, Visited). | **Buttons:** "Filter", "Add Lead".
    * **DB Model:** `Enquiry`.
* **`add-enquiry.tsx`**
    * **Feature:** Manual lead entry by staff.
    * **Inputs:** Name, Phone, Preferred Shift, Source, Handled By (staff). | **Buttons:** "Save".
    * **DB Model:** `Enquiry` (`handledBy` → `User`).
* **`enquiry-details.tsx`**
    * **Feature:** Full lead timeline — follow-up history, status changes, and one-click conversion.
    * **Display:** Lead info, Status badge (New/Visited/Interested/Converted/Lost), Follow-up timeline.
    * **Inputs:** Remark (e.g., "Will join Monday"), Next Follow-up Date, Status change dropdown. | **Buttons:** "Add Follow-up", "Convert to Admission", "Mark as Lost".
    * **On Convert:** Auto-fills `new-admission.tsx` with lead's Name & Phone. Updates `convertedToStudent` link.
    * **DB Models:** `Enquiry` (`followUps` jsonb array, `status`, `convertedToStudent` → `Student`).

---

### **4. 🎓 Students & Core Admission (The Engine)**
* **`students.tsx`**
    * **Feature:** Master list of all students.
    * **Data Displayed:** Smart ID, Name, Phone, Status. | **Buttons:** "View Profile", "Export".
    * **DB Model:** `Student`.
* **`new-admission.tsx`**
    * **Feature:** Single-page comprehensive admission. Gap-filling Smart ID & Zero-Clash Algorithm runs here.
    * **Blacklist Check:** On phone number entry, auto-checks `Blacklist` table. Blocks admission if match found.
    * **Inputs:** Name, Phone, Parent Phone, Email, College, Photo Upload, Document Upload (Aadhar/ID Proof), Referred By (optional — select existing student), Shift Select (shows only shifts with available seats), Seat Select (Available only — Zero-Clash filtered), Custom Time Slots (for hybrid schedules), Plan Select, Amount Paid, Payment Mode, Security Deposit Amount.
    * **Buttons:** "Confirm Admission & Generate ID".
    * **Auto-Actions:** Smart ID auto-assigned (gap-filling), ID Card auto-generated, Welcome WhatsApp sent, Receipt auto-generated.
    * **DB Models:** `Student` (smartId, referredBy), `StudentSlot`, `Subscription`, `Payment`, `SecurityDeposit`, `IDCard`, `WhatsAppMessage`, `Blacklist` (check).
* **`group-admission.tsx`**
    * **Feature:** 5-10 students ka bulk admission with group discount (10-15%).
    * **Inputs:** Group Name/College, Group Discount %, Dynamic rows (Name, Phone, Shift, Seat per student), Common Plan, Amount per student.
    * **Buttons:** "Admit Group".
    * **Auto-Actions:** Each student gets individual Smart ID, all share same `groupAdmissionId`.
    * **DB Models:** `Student` (Multiple), `Subscription` (`isGroupDiscount: true`, `groupAdmissionId`), `Payment`, `StudentSlot`.
* **`student-profile.tsx`**
    * **Feature:** 360-degree view of a single student — the complete lifecycle dashboard.
    * **Data Displayed:** Personal info (photo, phone, parent phone, email, college), Smart ID, Join Date, Documents (Aadhar/ID), Subscriptions history, Seat history, Attendance logs, Payment history, Complaint history, PaymentPromise records, Security Deposit status, ID Card (view/reprint), Referral tree (who referred them + who they referred).
    * **Trust Score Badge:** Shows `commitmentReliabilityScore` — Green (reliable), Yellow (moderate), Red (unreliable, 5+ date changes).
    * **Buttons:** "Edit Details", "Suspend" (with reason), "Blacklist", "Mark Exit" (→ `student-exit.tsx`), "Reprint ID Card", "Send WhatsApp".
    * **DB Models:** `Student`, `SeatHistory`, `Attendance`, `Subscription`, `Payment`, `PaymentPromise`, `Complaint`, `SecurityDeposit`, `IDCard`, `WhatsAppMessage`.
* **`edit-student.tsx`** *(NEW)*
    * **Feature:** Right slide-in drawer (520px) for editing student personal info, photo, documents, and status.
    * **Triggered From:** `student-profile.tsx` "✏️ Edit" button.
    * **Inputs:** Name, Phone (re-checks Blacklist on blur), Parent Phone, Email, College, Photo Replace, Document Replace, Status Change (Admin only), Admin Note.
    * **Read-Only Fields:** Smart ID, Join Date, Current Seat & Shift, Subscription details.
    * **Buttons:** "Cancel" (closes drawer), "💾 Save Changes".
    * **Auto-Actions:** AuditLog entry created with old vs new values on save.
    * **DB Models:** `Student`, `AuditLog`.
* **`student-exit.tsx`** *(NEW)*
    * **Feature:** Dedicated exit workflow — checklist-style confirmation before marking a student as exited.
    * **Steps:** Check pending dues → Process security deposit refund → Free seat → Free locker → Mark as Alumni.
    * **Display:** Pending Due Amount, Locker status, Security Deposit status, Exit summary.
    * **Buttons:** "Confirm Exit & Release Resources".
    * **DB Models:** `Student` (status → 'exited', isAlumni → true), `StudentSlot` (isActive → false), `SecurityDeposit` (refund), `Seat`, `Locker`.
* **`id-card-generator.tsx`**
    * **Feature:** Click & Print ID System.
    * **Display:** Auto-generated PDF UI with Photo & QR Code. | **Buttons:** "Print Card".
    * **DB Model:** `IDCard`.
* **`referral-bonus.tsx`**
    * **Feature:** Referral wallet & cashback tracking per student.
    * **Display:** Student Name, Referral Bonus Balance, Who they referred. | **Buttons:** "Redeem to Fee".
    * **DB Models:** `Student` (`referralBonusBalance`, `referredBy`, `referrals`).
* **`alumni.tsx`** *(NEW)*
    * **Feature:** View all exited students marked as alumni for future marketing.
    * **Display:** Name, Phone, Exit Date, Last Plan, Duration stayed. | **Buttons:** "Re-Admit", "Send WhatsApp".
    * **DB Models:** `Student` (filter: `isAlumni = true`), `WhatsAppMessage`.
* **`document-vault.tsx`** *(NEW)*
    * **Feature:** Centralized storage for all KYC documents and Aadhar cards uploaded during admissions.
    * **Display:** Student Name, Smart ID, Document Type, Upload Date, Verification Status.
    * **Buttons:** "View", "Download", "Mark Verified".
    * **DB Models:** `Student` (`documents` jsonb).

---

### **5. 🪑 Operations (Seats, Shifts & Lockers)**
* **`seat-matrix.tsx`**
    * **Feature:** Visual grid map of the library.
    * **Display:** **Green** (Empty), **Red** (Full), **Orange** (Expiring within 7 days). Hover shows student name, shift, expiry date.
    * **DB Models:** `Seat`, `StudentSlot`.
* **`seats.tsx`**
    * **Feature:** Seat CRUD management.
    * **Inputs:** Seat Number (A-01). | **Buttons:** "Add Seat", "Mark Broken", "View Maintenance Log".
    * **DB Model:** `Seat` (maintenanceLog).
* **`seat-maintenance-log.tsx`** *(NEW)*
    * **Feature:** Per-seat maintenance history — track repairs, damages, and service records.
    * **Display:** Table of all maintenance entries (Date, Remark, Done By, Status).
    * **Inputs:** Date, Remark, Done By. | **Buttons:** "Add Log Entry".
    * **Auto-Alert:** Highlight seats overdue for maintenance.
    * **DB Model:** `Seat` (`maintenanceLog` jsonb array).
* **`shifts.tsx`**
    * **Feature:** Defining time slots (Fixed Shifts + Custom Flexible slots).
    * **Inputs:** Name (Morning/Evening/Custom), Start Time, End Time. | **Buttons:** "Add Shift", "Edit", "Deactivate".
    * **Display:** Shift list with current occupancy count per shift.
    * **DB Model:** `Shift` (`isActive` for soft-delete).
* **`shift-migration.tsx`**
    * **Feature:** Shift change & fee adjustment calculator (Module 3: Shift Swapping).
    * **Workflow:** Select Student → Shows current shift/seat → Select New Shift → Select New Seat (available only) → System auto-calculates fee difference (+/- adjustment).
    * **Inputs:** Student, New Shift, New Seat. | **Display:** Fee Adjustment amount (positive = student owes more, negative = refund). | **Buttons:** "Confirm Migration".
    * **Auto-Actions:** Old seat freed, new seat allocated, SeatHistory updated, fee adjustment recorded.
    * **DB Models:** `ShiftMigration` (`fromShift`, `toShift`, `fromSeat`, `toSeat`, `feeAdjustment`, `processedBy`), `StudentSlot`, `SeatHistory`.
* **`seat-history.tsx`**
    * **Feature:** Security tracking (Who sat where).
    * **Display:** Table of Seat Number, Student Name, From-To dates.
    * **DB Model:** `SeatHistory`.
* **`lockers.tsx`**
    * **Feature:** Locker list — assign/free lockers.
    * **Inputs:** Assign to Student. | **Buttons:** "Free Locker".
    * **DB Model:** `Locker`.
* **`locker-matrix.tsx`**
    * **Feature:** Visual grid map of all lockers (Green = Free, Red = Occupied).
    * **Display:** Hover shows assigned student name & expiry.
    * **DB Model:** `Locker`, `StudentSlot`.
* **`allocations.tsx`**
    * **Feature:** Master view of all seat + locker + shift allocations.
    * **Display:** Student, Seat, Shift, Locker, Valid From-Till.
    * **DB Models:** `StudentSlot`, `Locker`.

---

### **6. 💰 Finance, Payments & Trust Score**
* **`subscriptions.tsx`**
    * **Feature:** Track all active and expired fee plans.
    * **Display:** Student, Plan Name, End Date, Due Amount.
    * **DB Model:** `Subscription`.
* **`renewals.tsx`** *(NEW)*
    * **Feature:** Upcoming renewals dashboard — students whose subscription expires in 7/15/30 days.
    * **Display:** Student Name, Plan, Expiry Date, Days Remaining, Due Amount. | **Filters:** "Expiring in 7 days", "Expiring in 15 days", "Expired".
    * **Buttons:** "Renew Now" (Quick-action → `collect-fee.tsx`), "Send Reminder" (WhatsApp).
    * **DB Models:** `Subscription` (filter by `endDate`), `WhatsAppMessage`.
* **`payments.tsx`**
    * **Feature:** Master ledger of all transactions (with soft-delete support for audit trail).
    * **Display:** Receipt #, Student Name, Amount, Mode (Cash/UPI/Card/Bank Transfer), Transaction ID, Date, Received By (Staff), Late Fee included, Remark.
    * **Filters:** By Date Range, Mode, Staff, Student. | **Buttons:** "Delete" (soft-delete, logged in AuditLog), "View Receipt", "Export".
    * **DB Model:** `Payment` (`isDeleted` for soft-delete, `receivedBy` → `User`).
* **`collect-fee.tsx`**
    * **Feature:** Renewal or due clearing page — the cashier screen.
    * **Inputs:** Student (search by name/Smart ID), Amount, Mode (Cash/UPI/Card/Bank Transfer), Transaction ID (for UPI/Card), Apply Coupon Code, Late Fee (auto-calculated or manual), Remark. | **Buttons:** "Collect & Generate Receipt".
    * **Auto-Actions:** Updates `Subscription.paidAmount` & `dueAmount`, auto-sends WhatsApp receipt, checks if auto-suspend should be lifted.
    * **DB Models:** `Payment`, `Subscription`, `Coupon` (`usedCount` incremented), `WhatsAppMessage`.
* **`payment-promises.tsx`**
    * **Feature:** PTP (Promise to Pay) & Trust Score engine.
    * **Display:** Student Name, Expected Date, Times Changed.
    * **Buttons:** "Extend Date" (Lowers Trust Score), "Paid".
    * **DB Model:** `PaymentPromise`, `Student` (commitmentReliabilityScore).
* **`student-trust-score.tsx`** *(NEW)*
    * **Feature:** Dedicated Trust Score dashboard — shows all students ranked by their payment commitment reliability.
    * **Display:** Student Name, Smart ID, Trust Score (0–100), Total Promises Made, Times Date Changed, Fulfilled Promises, Badge (🟢 Reliable / 🟡 Moderate / 🔴 Low Trust). Sorted by lowest score first for manager attention.
    * **Filters:** "Low Trust Only" (score < 40), By Shift, By Date Range.
    * **Auto-Warning:** Manager dashboard widget pe "Low Trust Students" count dikhega.
    * **DB Models:** `Student` (`commitmentReliabilityScore`), `PaymentPromise` (`timesChanged`, `fulfilled`, `expectedDate`).
* **`security-deposits.tsx`**
    * **Feature:** Refund management.
    * **Inputs:** Deduction Amount (if any), Reason. | **Buttons:** "Refund".
    * **DB Model:** `SecurityDeposit`.
* **`invoice.tsx`**
    * **Feature:** GST-compliant invoice generation (PDF). Shows library name, GST number, itemized charges, tax breakup.
    * **Display:** Printable invoice with Branch letterhead, Student details, Plan details, Amount breakdown, GST (if applicable).
    * **Buttons:** "Download PDF", "Print", "Send via WhatsApp".
    * **DB Models:** `Payment`, `Subscription`, `Plan`, `Branch` (`gstNumber`).
* **`receipt.tsx`**
    * **Feature:** Standard payment receipt (non-GST). Quick printable slip for cash/UPI collections.
    * **Display:** Receipt Number, Student Name, Amount Paid, Mode, Date, Received By.
    * **Buttons:** "Download PDF", "Print", "Send via WhatsApp".
    * **DB Models:** `Payment`, `Branch`, `Student`.
* **`late-fees.tsx`**
    * **Feature:** Configure & view late fee penalty rules.
    * **Inputs:** Grace Period (days), Penalty per day (₹). | **Buttons:** "Save Rules".
    * **Display:** Students with active late fee charges.
    * **DB Models:** `Subscription` (`lateFeeAdded`), `Payment`.
* **`auto-suspend.tsx`** *(NEW)*
    * **Feature:** Auto-downgrade on non-payment — configure suspension rules & manage suspended students.
    * **Configuration:** Days threshold before auto-suspend (e.g., 10 days).
    * **Display:** Currently suspended students list, days overdue, last payment date.
    * **Buttons:** "Manual Restore", "Send Payment Reminder". Auto-restore triggers on payment.
    * **DB Models:** `Student` (status: 'suspended'), `Subscription`, `Payment`.
* **`referrals.tsx`**
    * **Feature:** Referral program overview — who referred whom, bonus earned.
    * **Display:** Referrer Name, Referred Students count, Total Bonus Earned.
    * **DB Models:** `Student` (`referredBy`, `referralBonusBalance`).
* **`refunds.tsx`** *(NEW)*
    * **Feature:** Manage security deposit refunds after student exit.
    * **Display:** Student Name, Exit Date, Deposit Amount, Refund Status.
    * **Buttons:** "Process Refund", "Add Deduction".
    * **DB Models:** `SecurityDeposit` / `Payment`.

---

### **7. 📉 Accounts & Auditing**
* **`expenses.tsx`**
    * **Feature:** Expense ledger — all library kharche in one view.
    * **Display:** Date, Category, Amount, Description, Added By. | **Filters:** By Date Range, Category.
    * **Buttons:** "Add Expense" (→ `add-expense.tsx`), "Delete", "Export".
    * **DB Models:** `Expense`, `ExpenseCategory`.
* **`add-expense.tsx`**
    * **Feature:** Add new expense entry.
    * **Inputs:** Amount, Category (dropdown from `ExpenseCategory`), Description, Expense Date. | **Buttons:** "Save".
    * **DB Models:** `Expense` (`addedBy` → logged-in `User`).
* **`expense-categories.tsx`**
    * **Feature:** Manage expense categories (Rent, Electricity, Salary, WiFi, Newspaper, Cleaning, etc.).
    * **Inputs:** Category Name. | **Buttons:** "Add", "Edit", "Delete".
    * **DB Model:** `ExpenseCategory` (branch-scoped).
* **`seat-gap-report.tsx`**
    * **Feature:** Gap Filling Algorithm (USP #1) — shows empty time slots per seat to maximize revenue.
    * **Display:** Seat Number, Currently Booked Slots (with student names), Available Gap Slots (e.g., "10AM-4PM free"), Revenue opportunity indicator.
    * **Filters:** By Shift, By Date.
    * **DB Models:** `Seat`, `StudentSlot`, `Shift`.
* **`shift-gap-analyzer.tsx`** *(NEW)*
    * **Feature:** Shift-level gap analysis — for each defined shift, shows how many seats are partially or fully vacant across specific time windows.
    * **Display:** Shift Name, Total Seats, Occupied Slots, Vacant Slots, % Utilization, Gap Hours (e.g., "Morning shift: 8 seats free between 10AM–12PM"). Revenue-loss estimate per gap.
    * **Filters:** By Shift, By Day/Week/Month.
    * **Action:** "Fill Gap — Quick Assign" shortcut to `new-admission.tsx` pre-filled with that slot.
    * **DB Models:** `Shift`, `StudentSlot`, `Seat`, `Student`.
* **`daily-settlement.tsx`**
    * **Feature:** EOD (End of Day) closing logic (USP #14).
    * **Display:** Auto-calculated totals: Cash Collected, UPI Collected, Card Collected, Total Expenses, **Net Profit**.
    * **Buttons:** "Close Register" (locks day's data), "Send Summary to Owner" (WhatsApp SMS).
    * **DB Model:** `DailySettlement` (`totalCashCollected`, `totalUPICollected`, `totalCardCollected`, `totalExpenses`, `netProfit`, `closedBy`).
* **`financial-reports.tsx`** *(NEW)*
    * **Feature:** Dedicated financial analytics page — Income vs Expense graphs, P&L trend over time (USP #11: Expense vs Income Graph).
    * **Display:** Bar chart (Income vs Expense by Month), Line chart (Revenue Trend — last 6/12 months), Pie chart (Expense Breakdown by Category), KPI cards (Total Revenue, Total Expenses, Net Profit, Outstanding Dues).
    * **Filters:** By Date Range (This Month, Last 3 Months, This Year, Custom), By Branch (multi-branch owners).
    * **Buttons:** "Export as PDF", "Export as Excel".
    * **DB Models:** `Payment`, `Expense`, `ExpenseCategory`, `DailySettlement`, `Subscription` (dueAmount aggregation).
* **`assets.tsx`**
    * **Feature:** Library inventory management — AC, Fans, Chairs, Projectors, etc.
    * **Display:** Asset Name, Quantity, Purchase Date, Status (working/maintenance/broken).
    * **Inputs:** Name, Quantity, Purchase Date. | **Buttons:** "Add Asset", "Edit", "Mark Broken".
    * **DB Model:** `Asset`.
* **`asset-maintenance.tsx`**
    * **Feature:** Maintenance log for assets — service history and upcoming schedule.
    * **Display:** Asset Name, Last Serviced Date, Next Due Date, Cost, Serviced By.
    * **Inputs:** Asset (dropdown), Remark, Service Date, Next Due Date, Cost. | **Buttons:** "Log Service".
    * **Auto-Alert:** Highlights assets with overdue maintenance.
    * **DB Model:** `AssetMaintenanceLog` (`nextDueDate`, `cost`, `servicedDate`, `servicedBy` → `User`).

---

### **8. 📱 Engagement, Attendance & Comms**
* **`qr-scanner.tsx`**
    * **Feature:** Webcam/Camera UI for fast QR-based attendance marking.
    * **Inputs:** Auto-reads QR from ID Card. | **Buttons:** "Mark In", "Mark Out".
    * **DB Models:** `IDCard`, `Attendance`.
* **`attendance.tsx`**
    * **Feature:** Manual attendance backup + absentee tracking.
    * **Display:** Date picker, Student list with Present/Absent/Late toggles.
    * **Absentee Report:** Auto-highlights students absent for 3+ consecutive days with "Send Alert to Parents" button (SMS/WhatsApp).
    * **DB Model:** `Attendance`, `WhatsAppMessage`.
* **`absentee-report.tsx`** *(NEW)*
    * **Feature:** Dedicated absentee tracking report — students who haven't shown up for consecutive days.
    * **Display:** Student Name, Smart ID, Days Absent (consecutive count), Last Seen Date, Parent Phone, Shift. Color-coded urgency (3+ days = Yellow, 7+ days = Red).
    * **Buttons:** "Send Alert to Parents" (WhatsApp/SMS), "Mark as Notified", filter by Shift / Days threshold.
    * **DB Models:** `Attendance` (filter consecutive absences), `Student` (parentPhone), `WhatsAppMessage`.
* **`complaints.tsx`**
    * **Feature:** Helpdesk with anonymous complaint support.
    * **Inputs:** Title, Description, **Anonymous Toggle** (student identity hidden from staff). | **Buttons:** "Submit", "Resolve", "Mark In-Progress".
    * **Display:** Status filters (Open/In-Progress/Resolved), resolved by, resolved date.
    * **DB Model:** `Complaint` (`isAnonymous`, `resolvedBy`, `resolvedAt`).
* **`notices.tsx`**
    * **Feature:** Digital Notice Board + broadcast.
    * **Inputs:** Title, Message, Valid Till. | **Buttons:** "Publish", "Broadcast via WhatsApp".
    * **DB Model:** `Notice`, `WhatsAppMessage`.
* **`notification-center.tsx`** *(NEW)*
    * **Feature:** Unified notification hub — all pending actions, reminders, and system alerts in one place.
    * **Display:** Fee reminders, CRM follow-up calls due, maintenance alerts, absentee alerts, auto-suspend warnings, PTP commitment dates hit today.
    * **Filters:** By type (Finance, CRM, Operations, Attendance), Priority.
    * **DB Models:** Aggregation of `Subscription`, `Enquiry`, `PaymentPromise`, `Attendance`, `Seat`, `Asset`, `AssetMaintenanceLog`.
* **`whatsapp-logs.tsx`**
    * **Feature:** Tracking auto-messages (Receipts, Reminders).
    * **Display:** Phone, Message Type, Status (Pending/Sent/Delivered/Failed), Error Message.
    * **DB Model:** `WhatsAppMessage`.
* **`holiday-calendar.tsx`** *(NEW)*
    * **Feature:** Define non-working days (e.g., "Library closed on Holi") so attendance isn't wrongly marked absent.
    * **Display:** Monthly calendar view of holidays.
    * **Inputs:** Date, Event Name. | **Buttons:** "Add Holiday".
    * **DB Models:** `Notice` or dedicated `Holiday` table.
* **`whatsapp-templates.tsx`** *(NEW)*
    * **Feature:** Configure automated WhatsApp message text templates.
    * **Inputs:** Template Type (Renewal, Welcome, Receipt), Message Body (with variables like {name}).
    * **Buttons:** "Save Template", "Test Message".
    * **DB Models:** `Branch` (branding/settings) or `WhatsAppTemplate`.

---

### **9. ⚙️ Admin, SaaS Tools & Security**
* **`plans.tsx`**
    * **Feature:** Create and manage fee/subscription plans.
    * **Display:** Plan Name, Duration (days), Price, Status (Active/Inactive), Number of active subscribers.
    * **Inputs:** Plan Name (e.g., "Monthly", "Quarterly"), Duration in Days, Price (₹). | **Buttons:** "Add Plan", "Edit", "Deactivate".
    * **DB Model:** `Plan` (branch-scoped).
* **`coupons.tsx`**
    * **Feature:** Create and manage discount/promo codes (USP — Referral Discounts / Promo Codes).
    * **Display:** Code, Discount Amount/Percent, Valid Till, Used Count / Max Uses, Status, ROI.
    * **Inputs:** Code (e.g., "NEWYEAR50"), Discount Amount OR Discount Percent, Valid Till Date, Max Uses (optional). | **Buttons:** "Create Coupon", "Edit", "Deactivate".
    * **DB Model:** `Coupon` (`discountAmount`, `discountPercent`, `validTill`, `usedCount`, `maxUses`).
* **`staff-users.tsx`**
    * **Feature:** RBAC — Add/Edit staff members with roles.
    * **Inputs:** Name, Phone, Role (superadmin/manager/staff). | **Buttons:** "Save", "Deactivate".
    * **DB Model:** `User`.
* **`permissions.tsx`**
    * **Feature:** Fine-grained permission management per staff role.
    * **Inputs:** Permission checkboxes per role. | **Buttons:** "Update Permissions".
    * **DB Model:** `User` (`permissions: string[]` jsonb).
* **`audit-logs.tsx`**
    * **Feature:** Fraud Detection System (Read-only).
    * **Display:** "Who changed what and when" (Old Value vs New Value).
    * **DB Model:** `AuditLog`.
* **`waitlist.tsx`**
    * **Feature:** Queue management for full shifts/time slots.
    * **Display:** Student Name, Preferred Shift/Slot, Date Added, Position in Queue.
    * **Auto-Notify:** When a seat becomes available, system auto-notifies the next student in queue (WhatsApp/SMS).
    * **Buttons:** "Remove from Waitlist", "Convert to Admission".
    * **DB Models:** `Waitlist`, `WhatsAppMessage`.
* **`blacklist.tsx`**
    * **Feature:** Block troublemaker students from re-joining.
    * **Display:** Phone, Name, Reason, Added By, Date.
    * **Inputs:** Phone, Name, Reason. | **Buttons:** "Add to Blacklist", "Remove".
    * **Cross-check:** Admission form auto-checks phone against blacklist before allowing registration.
    * **DB Model:** `Blacklist`.
* **`bulk-import.tsx`**
    * **Feature:** Upload Excel to add 100 students instantly.
    * **Inputs:** File Uploader. | **Display:** Success/Fail count with row-level Errors ("Row 5: Mobile Number missing").
    * **DB Model:** `BulkImport`.
* **`data-export.tsx`** *(NEW)*
    * **Feature:** 1-click Excel/CSV export of any data set (USP #13 — Data Export).
    * **Inputs:** Select Entity Type (Students, Payments, Attendance, Subscriptions, Expenses), Date Range.
    * **Buttons:** "Export as Excel", "Export as CSV".
    * **DB Models:** Reads from any selected entity table.
* **`branches.tsx`**
    * **Feature:** Multi-branch management. Switch between branches + comparative revenue overview.
    * **Display:** Branch Name, Address, GST, Active Students count, Today's Revenue (per branch comparison).
    * **Buttons:** "Add Branch", "Switch Branch", "Edit".
    * **DB Model:** `Branch`, aggregated `Payment` and `Student` per branch.
* **`backups.tsx`**
    * **Feature:** Disaster Recovery — download full data backup. Daily automated nightly backups.
    * **Display:** Last backup date/time, backup history.
    * **Buttons:** "Download Full Database (JSON/CSV)", "Restore from Backup".
    * **DB Model:** Complete DB dump (`BulkImport` for restore tracking).
* **`gst-tax-settings.tsx`** *(NEW)*
    * **Feature:** Configure GST compliances for automated invoice generation.
    * **Inputs:** GST Number, Tax Percentage, State Code, HSN Code.
    * **Buttons:** "Save Tax Settings".
    * **DB Models:** `Branch` (`gstNumber`, and other tax configs).

---

### **10. 🌐 System & Utility Pages**
* **`settings.tsx`**
    * **Feature:** White-labeling & App Configuration (USP #17).
    * **Inputs:** Upload Logo, Primary/Secondary Color Picker, App Name, UPI QR Code Upload, Late Fee defaults (grace days, penalty per day), Auto-suspend threshold (days).
    * **Buttons:** "Save Settings".
    * **DB Model:** `Branch` (extended with branding fields).
* **`profile.tsx`**
    * **Feature:** Logged-in staff's personal settings.
    * **Inputs:** Name, Email, Phone, Current Password, New Password. | **Buttons:** "Update Profile", "Change Password".
    * **DB Model:** `User`.
* **`offline.tsx`**
    * **Feature:** PWA Offline Fallback (USP #5). Shows "No Internet" message.
    * **Capability:** Attendance marking & basic student lookup cached locally. Auto-syncs when back online.
* **`maintenance.tsx`**
    * **Feature:** Unified maintenance dashboard — seats, lockers, and assets all due for service in one view.
    * **Display:** Three sections: Seats needing repair, Assets with overdue service, Locker issues. Each with due date and urgency indicator.
    * **DB Models:** `Seat` (`maintenanceLog`), `Asset`, `AssetMaintenanceLog` (`nextDueDate`), `Locker`.
* **`404.tsx`:** Page Not Found — with "Go to Dashboard" button.
* **`500.tsx`:** Server Error — with "Retry" and "Contact Support" buttons.

*** New Components – Student Engagement & Alerts ***
* **`gap-filling.tsx`**
    * **Feature:** Gap‑Filling Algorithm – automatically identifies free time slots for a seat and suggests optimal assignments.
    * **DB Models:** `Seat`, `StudentSlot`, `Shift`.
* **`smart-id-autofill.tsx`**
    * **Feature:** Smart ID generator with gap‑filling logic – ensures sequential IDs without gaps, re‑using released IDs.
    * **DB Model:** `Student` (smartId).
* **`waitlist-automation.tsx`**
    * **Feature:** Auto‑notify students on the waitlist when a seat becomes available (WhatsApp/SMS).
    * **DB Models:** `Waitlist`, `WhatsAppMessage`.
* **`power-saving.tsx`**
    * **Feature:** Power‑Saving Mode – dims/turns off unused rooms/ACs based on low occupancy.
    * **DB Models:** `Seat`, `Locker` (status).
* **`branding.tsx`**
    * **Feature:** White‑labeling UI – allows admin to upload logo, set primary/secondary colors, and customize app name.
    * **DB Model:** `Branch` (branding fields).
* **`auto-scale.tsx`**
    * **Feature:** Auto‑Scale Infrastructure – detects when seat/locker count exceeds thresholds and suggests scaling resources.
    * **DB Models:** `Seat`, `Locker`.
* **`whatsapp-integration.tsx`**
    * **Feature:** Centralised WhatsApp integration for receipts, reminders, and broadcast messages.
    * **DB Model:** `WhatsAppMessage`.
---

**Final Confirmation:** Ye list 100% complete hai. Isme aapke SaaS model ka ek bhi API endpoint ya table visually unrepresented nahi bacha hai. Aap seedha `npx create-next-app` karke in files aur folders ko `app/` ya `pages/` directory mein banana shuru kar sakte hain! 🚀