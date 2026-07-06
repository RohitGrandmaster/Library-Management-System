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
