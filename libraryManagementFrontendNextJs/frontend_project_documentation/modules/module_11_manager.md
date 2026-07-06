-

### 1. MANAGER DASHBOARD — `/manager/dashboard`

**Page Title:** Manager Dashboard  
**Subtitle:** Good morning, [Manager Name] — yeh hai aaj ka quick overview

#### Row 1: 4 KPI Cards (sirf operational)

| # | KPI Card                    | Example Value     | Icon              | Color Token     |
|---|-----------------------------|-------------------|-------------------|-----------------|
| 1 | Active Students Today       | 142               | `Users`           | `--primary`     |
| 2 | Today’s Attendance          | **94%**           | `CalendarCheck`   | `--success`     |
| 3 | Pending Enquiries           | 7                 | `Phone`           | `--info`        |
| 4 | Seats / Lockers Expiring (next 7 days)| 11                | `Armchair`        | `--warning`     |

#### Row 2: Two Column Layout
- **Left (65%)** → Mini Seat Matrix (view only)  
  - Sirf aaj ke shifts ka grid  
  - Click karne pe student profile khulega (no edit)
- **Right (35%)** → My Action Items  
  - New Enquiries (count + link)  
  - Follow-ups Due Today  
  - Open Complaints  
  - Payment Promises Due Today
  - Maintenance / Broken Assets Alerts
  - Expiring Subscriptions (with "Renew" shortcut)

#### Row 3: Recent Activity (2 small tables)
- Recent 5 New Admissions (Name + Smart ID + Shift)
- Recent 5 Enquiries (Name + Phone + Status)

**Quick Links (right sticky sidebar)**
- All Students
- Enquiries
- Collect Fee
- Add Complaint / Notice
- Waitlist
- Mark Attendance
- QR Scanner
- My Profile

**Manager Dashboard mein YE SAB BILKUL NAHI DIKHENGE:**
- Revenue, Collection, Profit, MRR
- Recent Payments feed
- Any finance related action items
- Export buttons

---

### 2. MANAGER REPORTS — `/manager/reports`

**Route:** `/manager/reports`  
**Page Title:** Reports  
**Subtitle:** Operational overview (finance reports blocked)

#### Top Bar
- Date Range: This Week / This Month / Last 30 Days
- Branch filter → sirf apna branch (change nahi kar sakta)

#### Row 1: 4 KPI Cards (operational only)

| KPI                        | Icon             | Color     |
|----------------------------|------------------|-----------|
| Total Active Students      | `Users`          | primary   |
| Attendance % this month    | `CalendarCheck`  | success   |
| New Admissions this month  | `UserPlus`       | info      |
| Open Enquiries             | `Phone`          | warning   |

#### Charts (2×2 Grid) — Sirf ye 4 charts allowed

1. **Shift-wise Occupancy** → Pie chart (Morning / Evening / Custom)
2. **Student Growth Trend** → Line chart (Joined vs Exited — last 30 days)
3. **Daily Attendance Trend** → Bar chart
4. **Top Absentees** → Horizontal bar (top 5 students)
5. **Complaints Status** → Donut chart (Open vs Resolved)

#### Bottom Section: Tables
- Absentee Report (same jaise absentee-report page)
- Enquiry Conversion Rate (New → Converted %)
- Seat Utilization Report (per shift)
- Locker Utilization Report
- Pending Maintenance (Assets & Seats)

**Manager Reports mein YE SAB BLOCKED / HIDE rahega:**
- Income vs Expenses chart
- Revenue Trend
- Net Profit
- Any financial numbers
- Export PDF / Export Excel button (completely hidden)
- P&L, Collection, Expenses reports

---

**Summary (Manager vs Admin)**

| Feature                    | Manager ko Dikhega? | Admin (Owner) ko Dikhega? |
|----------------------------|---------------------|---------------------------|
| Revenue / Collection KPI   | ❌ No               | Yes                       |
| Finance Charts             | ❌ No               | Yes                       |
| Seat Matrix (view)         | Yes                 | Yes                       |
| Attendance & Enquiries     | Yes                 | Yes                       |
| Export Buttons             | ❌ No               | Yes                       |
| Profit / P&L               | ❌ No               | Yes                       |

Yeh design **spec ke access control** ko perfectly follow karta hai aur tumhari “alag login” wali requirement ko bhi pura karta hai.

**Final Lock?**  
Agar yeh final pasand hai toh bas bolo **“Lock kar do”** — main turant folder structure, layout.tsx, page.tsx aur components bana ke deta hoon.  

Koi last change chahiye? Ya seedha code shuru karein? 🔥