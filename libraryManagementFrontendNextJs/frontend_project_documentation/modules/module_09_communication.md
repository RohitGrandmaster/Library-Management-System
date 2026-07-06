
## 📁 Route Group: `(communication)`
> CSS: `communication.css` · Theme class: `communication-theme` · Prefix: `eng-`
> Pages: notices, notification-center, whatsapp-logs, whatsapp-templates, complaints

---

#### `complaints.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Top: filter tabs. Below: full-width data table.
- **Filter Tabs:** All | 🔴 Open | 🟡 In-Progress | ✅ Resolved
- **Table Columns (L→R):** # | Title | Student Name (or "Anonymous" if isAnonymous=true, shown in italic gray) | Description (truncated, expandable on click) | Status Badge | Submitted Date | Resolved By (or "—") | Resolved Date | Actions ("👁️ View", "🔄 Mark In-Progress", "✅ Resolve")
- **Top Bar:** "➕ Add Complaint" primary (staff raises on student's behalf)
- **"Add Complaint" Modal (480px):** Student(`search`, optional — leave empty for anonymous) | Anonymous `<toggle>` labeled "Hide student identity from staff view" | Title(`text`, *req) | Description(`textarea rows=4`, *req) → Cancel | "Submit Complaint" primary
- **"Resolve" Action:** Modal — Resolution Note(`textarea rows=3`, *req) → Cancel | "✅ Mark Resolved" green
- **Empty State (Open tab):** 😊 icon + "No open complaints! All issues are resolved."
- **DB:** `Complaint`

---

#### `notices.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Top: "📢 Post Notice" primary button (right-aligned). Below: vertical card list of all notices.
- **Notice Card:** Title (H2) | Message (body text, truncated to 3 lines with "Read more" expand) | Valid Till badge (green if active, gray if expired) | "Posted by [Staff Name] · DD/MM/YY" caption | Status badge | Buttons: "✏️ Edit" ghost | "🗑️ Delete" ghost danger | "📱 Broadcast via WhatsApp" ghost
- **Add/Edit Notice Modal (520px):** Title(`text`, *req) | Message(`textarea rows=6`, *req) | Valid Till(`date`, *req) → Cancel | "📢 Post Notice" primary
- **"Broadcast via WhatsApp" Confirmation:** "Send this notice to all [N] active students via WhatsApp?" → Cancel | Broadcast
- **"Delete" Confirmation:** "Delete this notice?" → Cancel | Delete (red)
- **Empty State:** 📢 icon + "No notices posted yet." + "📢 Post Notice"
- **DB:** `Notice`, `WhatsAppMessage`

---

#### `notification-center.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Left sidebar (200px): category filter list. Right main area: notification items list.
- **Left Filter List (clickable categories):** All Notifications | 💰 Finance | 📞 CRM | 🪑 Operations | 📅 Attendance | Priority: High Only
- **Notification Item (each row in right area):** Large icon for category (colored) | Title (bold) | Description text (secondary) | "[Time] ago" timestamp (right-aligned) | Priority badge (🔴 High / 🟡 Medium) | "→ Go to page" arrow link
- **Example Notification Items:**
  - 🔴 Finance: "5 subscriptions expire today" → `renewals.tsx`
  - 🟡 CRM: "Call Rahul — enquired 3 days ago" → `enquiry-details.tsx`
  - 🔴 Finance: "3 Payment Promise dates hit today" → `payment-promises.tsx`
  - 🟡 Ops: "Seat A-05 maintenance overdue by 45 days" → `seat-maintenance-log.tsx`
- **Top-right:** "✅ Mark All Read" ghost button
- **Empty State:** 🔔 icon + "All caught up! No pending notifications."
- **DB:** Aggregates `Subscription`, `Enquiry`, `PaymentPromise`, `Attendance`, `Seat`, `AssetMaintenanceLog`

---

#### `whatsapp-logs.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Full-width data table.
- **Table Columns (L→R):** Date/Time | Phone | Student Name (linked) | Message Type Badge (welcome=blue, fee_reminder=amber, receipt=green, notice=purple, renewal=indigo) | Status Badge (Pending=amber, Sent=blue, Delivered=green, Failed=red) | Error Message (if failed, otherwise "—") | Actions ("👁️ View Message")
- **Filter Bar:** Message Type `<select>` | Status `<select>` | Date range | Student search
- **"View Message" Action:** Opens modal (560px) showing full message text content
- **Empty State:** 📱 icon + "No WhatsApp messages logged yet."
- **DB:** `WhatsAppMessage`

---

#### `whatsapp-templates.tsx`
- **Route group:** `(communication)`
- **Opens As:** Full page
- **Layout:** Two-column — Left (260px): Template type list (sidebar). Right: Template editor panel.
- **Left — Template List (clickable):** Welcome Message | Fee Reminder | Renewal Alert | Payment Receipt | Notice Broadcast | Absentee Parent Alert | PTP Payment Reminder. Active item highlighted with Indigo left border.
- **Right — Template Editor:**
  - Template Type label (H2, readonly)
  - Message Body: `<textarea rows=8>` with character counter below
  - Variable chips row below textarea (click to insert at cursor): `{name}` `{amount}` `{duedate}` `{planname}` `{libraryname}` `{phone}` `{seat}` — clicking a chip inserts it into the message body
  - Variables Legend: "Use variables above to personalize messages. E.g.: 'Hi {name}, your fee of ₹{amount} is due on {duedate}.'"
  - Buttons: "📱 Send Test Message" ghost (opens phone number input modal) | "💾 Save Template" primary
- **DB:** `Branch` (branding/settings) or `WhatsAppTemplate`
