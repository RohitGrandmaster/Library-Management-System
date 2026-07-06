# MODULE 10: System, Utilities & Smart Automation
> Prepend `global_design_system.md` before giving to Stitch.
> All pages use the full App Shell unless noted.

---

#### `settings.tsx`
- **Opens As:** Full page
- **Layout:** Multi-section settings page. Left sidebar (200px): settings category list. Right: settings panel for selected category.
- **Settings Categories (left list):** Branding | Late Fee Rules | Auto-Suspend Rules | UPI / Payment | Notifications | General
- **Branding Section:** Upload Logo (image dropzone, preview shown) | App Name(`text`) | Primary Color(`color-picker`, hex input) | Secondary Color(`color-picker`)
- **Late Fee Rules Section:** Grace Period(`number`, "5", label "days") | Penalty Per Day(`number`, "₹50") | Enable Late Fees `<toggle>`
- **Auto-Suspend Section:** Days Before Suspend(`number`, "10") | Enable Auto-Suspend `<toggle>` | Enable Auto-Restore on Payment `<toggle>`
- **UPI/Payment Section:** UPI QR Code: image upload dropzone (preview shown) | UPI ID(`text`, "owner@upi") | Accepted Modes: Checkboxes (Cash / UPI / Card / Bank Transfer)
- **Notification Section:** SMS/WhatsApp API Key(`text`, masked) | "Test Connection" button
- **Buttons:** "💾 Save Settings" primary (per section, or sticky bottom-right for all)
- **DB:** `Branch` (extended branding + settings fields)

---

#### `profile.tsx`
- **Opens As:** Full page
- **Layout:** Centered card (max-width 560px). Two sections: Personal Info + Change Password.
- **Personal Info Section:** Profile Photo (circle, 80px) with "📷 Change Photo" button on hover | Name(`text`, *req) | Email(`email`) | Phone(`tel`, *req) | "💾 Update Profile" primary button
- **Change Password Section (separate card below):** Current Password(`password`) | New Password(`password`, with strength indicator) | Confirm New Password(`password`) | "🔐 Change Password" primary button
- **DB:** `User`

---

#### `offline.tsx`
- **Opens As:** Full page, no sidebar (PWA offline fallback)
- **Layout:** Full-screen centered message. No app shell, no sidebar.
- **Content:** 📡 large icon (no internet signal) | "You're Offline" heading (H1) | "No internet connection detected. Don't worry — your basic features still work:" | Bulleted list: "✅ Mark attendance (syncs when online)" | "✅ View student basic info (cached)" | "❌ Financial transactions require internet" | Pulsing "Waiting for connection..." status badge at bottom | Auto-refreshes and redirects to dashboard when connection restored.

---

#### `maintenance.tsx`
- **Opens As:** Full page
- **Layout:** Full-width. Top: 3 summary count cards. Below: 3 sections (one per resource type) each with their own table.
- **Summary Cards:** Seats Needing Attention (count) | Assets Overdue (count) | Locker Issues (count)
- **Section 1 — Seats:** Table — Seat # | Status Badge | Last Maintenance Date | Days Since Last Maintenance (red if >30) | "🔧 Log Maintenance" action → `seat-maintenance-log.tsx`
- **Section 2 — Assets:** Table — Asset Name | Quantity | Status Badge | Last Serviced | Next Due Date | Days Overdue (red badge if past due) | "📝 Log Service" action → `asset-maintenance.tsx`
- **Section 3 — Lockers:** Table — Locker # | Status Badge | Last Reported Issue | "✏️ Update Status" action
- **DB:** `Seat` (maintenanceLog), `Asset`, `AssetMaintenanceLog`, `Locker`

---

#### `404.tsx`
- **Opens As:** Full page (error page, uses app shell if logged in)
- **Layout:** Full-screen centered content.
- **Content:** "404" in very large bold Indigo text | Illustration: lost/confused person or broken link icon | "Page Not Found" heading | "The page you're looking for doesn't exist or has been moved." subtext | "← Go to Dashboard" primary button | "Go Back" ghost button

---

#### `500.tsx`
- **Opens As:** Full page (error page, uses app shell if logged in)
- **Layout:** Full-screen centered content.
- **Content:** "500" in large bold red text | Illustration: server error/crash icon | "Server Error" heading | "Something went wrong on our end. Our team has been notified." subtext | "🔄 Retry" primary button | "📧 Contact Support" ghost button

---

#### `gap-filling.tsx`
- **Opens As:** Full page
- **Cross-Reference:** This page is the **algorithm visualization & smart assignment tool**. For the **tabular report view** of seat gaps, see `seat-gap-report.tsx` in Module 07. The two pages serve different purposes:
  - `gap-filling.tsx` → Interactive tool: run analysis, visualize time bars, quick-assign students to gaps
  - `seat-gap-report.tsx` (Module 07) → Reporting view: per-seat gap cards with revenue opportunity estimates, filterable by date/shift
- **Layout:** Top: Algorithm controls card. Below: Results visualization.
- **Controls Card:** Date range picker | Shift `<select>` | "🔍 Run Gap Analysis" primary button
- **Results:** Per-seat horizontal time bars showing booked (indigo) vs. free (gray) slots. Each free gap: "🕳️ Gap: 10AM–2PM — 4 seats — 💡 Suggested: Assign student for 4hrs" + "⚡ Quick Assign →" button
- **Purpose:** Visual algorithm page showing which time-seat combinations have capacity that can be monetized. Actionable — designed for staff to immediately fill gaps.
- **DB:** `Seat`, `StudentSlot`, `Shift`

---

#### `smart-id-autofill.tsx`
- **Opens As:** Full page
- **Layout:** Centered info + demo card (max-width 680px).
- **Content:** Algorithm explanation card: "How Smart ID Gap-Fill Works" with a visual flow diagram. Step 1: Student exits → ID freed. Step 2: Next admission → system checks for lowest available gap ID. Step 3: Gap ID assigned to new student, exited student archived. | "🔢 Current ID Sequence" viewer: shows all active IDs as chips (gaps shown in different color) | Manual override: "Force Regenerate Sequence" button (admin only, with confirmation)
- **DB:** `Student` (smartId field sequences)

---

#### `waitlist-automation.tsx`
- **Opens As:** Full page
- **Layout:** Top: automation status toggle card. Below: current waitlist queue + configuration.
- **Status Card:** "Waitlist Auto-Notification" `<toggle>` (ON/OFF) | "When a seat becomes free, automatically WhatsApp the next student in queue."
- **Config:** Notification Message Template(`textarea`, editable) | Notification Delay(`number`, "0", label "minutes after seat becomes available") | "💾 Save Config" primary
- **Queue Preview:** First 5 students in waitlist shown as a visual queue (avatar + name + shift preference + position #)
- **DB:** `Waitlist`, `WhatsAppMessage`

---

#### `power-saving.tsx`
- **Opens As:** Full page
- **Layout:** Top: Status + threshold config card. Below: current room/zone occupancy status.
- **Config Card:** Occupancy Threshold `<input type="number">` % (e.g., "30") | Label: "If shift occupancy drops below this, suggest consolidation". | "Enable Power Saving Alerts" `<toggle>`
- **Zone Status Cards (grid):** Each room/zone (if defined): Zone Name | Current occupancy % | Status (Normal / ⚡ Low — consolidation suggested) | Suggested Action: "Move [N] students to Zone A → Turn off Zone B AC"
- **Alert Log (table below):** Date | Shift | Zone | Threshold Breached | Action Taken
- **DB:** `Seat`, `Locker` (status-based occupancy stats)

---

#### `branding.tsx`
- **Opens As:** Full page
- **Layout:** Two-column — Left 40%: branding settings form. Right 60%: Live preview of how the app looks with current branding.
- **Left — Settings Form:** Library Name(`text`) | Upload Logo (image dropzone, 200×200px preview) | Primary Color(`color-picker` with hex input + color swatch) | Secondary Accent Color(`color-picker`) | App Tagline(`text`, optional)
- **Right — Live Preview:** Mini mockup of the sidebar, login page, and ID card showing how the branding applies in real-time as settings change. Sidebar shows logo, app name, primary color active states. ID card shows logo + library name.
- **Buttons:** "💾 Save Branding" primary | "↩️ Reset to Default" ghost
- **DB:** `Branch` (branding fields)

---

#### `auto-scale.tsx`
- **Opens As:** Full page
- **Layout:** Top: Current capacity overview cards. Below: Threshold configuration + recommendations.
- **Overview Cards:** Total Seats | Total Lockers | Avg Occupancy % (last 30 days) | "Peak Day" (highest occupancy day)
- **Threshold Config:** Seat Alert Threshold `<input type="number">` % (e.g., "90") | Locker Alert Threshold `<input type="number">` % | "Alert me when occupancy exceeds threshold" `<toggle>` | "💾 Save Thresholds"
- **Recommendations Card:** If occupancy >90%: 🔴 "System suggests adding more seats. Current utilization: 94%" + "➕ Add Seats" shortcut button. If <40%: 🟡 "Low occupancy detected. Consider Power Saving mode." + "⚡ Power Saving →" link.
- **DB:** `Seat`, `Locker`

---

#### `whatsapp-integration.tsx`
- **Opens As:** Full page
- **Layout:** Centered (max-width 680px). Single integration configuration card.
- **Integration Card:**
  - Integration Status badge (Connected=green, Not Connected=red) with last tested timestamp
  - API Provider `<select>` (Twilio / Wati / AiSensy / Custom)
  - API Key(`text`, password-masked with 👁️ toggle)
  - API Secret(`text`, password-masked with 👁️ toggle, if required by provider)
  - Webhook URL(`text`, readonly, auto-generated) + "📋 Copy" button
  - Sender Phone Number(`tel`, WhatsApp Business number)
  - "🔌 Test Connection" ghost button → sends test message to owner's phone → shows ✅ "Connection successful" or ❌ "Error: [message]"
- **Usage Stats Card (below):** Messages sent this month | Delivered | Failed | Estimated cost
- **Buttons:** "💾 Save Integration Settings" primary
- **DB:** `WhatsAppMessage`, `Branch` (API config)
