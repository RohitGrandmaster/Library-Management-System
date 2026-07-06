# MODULE 1: Auth & Onboarding
> Prepend `global_design_system.md` before giving to Stitch.
> These pages do NOT use the App Shell (no sidebar, no header).

---

#### `login.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Split-screen — Left half: dark background + abstract library SVG illustration + tagline "Manage Smarter, Grow Faster" + app logo. Right half: centered white/dark card (480px wide, border-radius 16px).
- **Fields:** Email or Phone(`text`, "Email or Phone Number", *req) | Password(`password`, 👁️ show/hide toggle icon on right, *req)
- **Buttons:** "Login" → full-width primary (inside card, below password) | "Forgot Password?" → text link, centered below Login button
- **Bottom of card:** "Don't have an account? Sign Up" → text link
- **Error State:** Red inline message below password field on failed login: "Invalid credentials. Please try again."
- **DB:** `User` (checks `isActive`, `role`)

---

#### `signup.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Same split-screen as login. Right card width: 520px.
- **Fields:** Owner Name(`text`, *req) | Email(`email`, *req) | Phone(`tel`, "+91 9800000000", *req) | Library Name(`text`, "e.g. City Reading Hub", *req) | Password(`password`, with color strength meter bar below: Weak=red/Medium=amber/Strong=green) | Confirm Password(`password`)
- **Buttons:** "Create Account" → full-width primary
- **Bottom of card:** "Already have an account? Login" → text link
- **DB:** `User` (Owner), `Branch`

---

#### `setup-wizard.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Two-panel — Left (280px): Numbered vertical stepper (Steps 1–5, active=indigo highlight, completed=green ✓ icon, future=gray). Right panel: current step form content. Top of right panel: horizontal progress bar (20%→100%).
- **Step 1 — Branch Details:**
  - Library Name(`text`, pre-filled from signup, *req) | Address(`textarea rows=3`, *req) | City(`text`, *req) | GST Number(`text`, "22AAAAA0000A1Z5", optional)
- **Step 2 — Define Shifts:**
  - Dynamic row list: ShiftName(`text`) | StartTime(`time`) | EndTime(`time`) | ✕ Remove button. Pre-filled rows: "Morning 06:00–12:00", "Evening 12:00–18:00". "➕ Add Another Shift" ghost button below rows.
- **Step 3 — Add Seats:**
  - Total Count(`number min=1`, *req) | Prefix(`text maxlength=3`, "A-") | Live preview text: "Seats will be: A-01, A-02, A-03..."
- **Step 4 — Fee Plan:**
  - Plan Name(`text`, "Monthly", *req) | Duration Days(`number`, "30", *req) | Price ₹(`number`, "1000", *req). "➕ Add Another Plan" ghost button.
- **Step 5 — Launch:**
  - Summary card: Library name displayed large | Badges: "[N] Shifts Added", "[N] Seats Created", "[N] Plans Ready". Confetti animation on load.
- **Buttons (each step):** "← Back" ghost (hidden on step 1) | "Next Step →" primary. Step 5 only: "🚀 Launch Dashboard" full-width primary.
- **DB:** `Branch`, `Shift`, `Seat`, `Plan`

---

#### `public-enquiry-form.tsx`
- **Opens As:** Full public page, no login, no app shell. Accessed via QR code scan.
- **Layout:** Full-screen centered card (440px wide). Top of card: library logo + library name (pulled from branch branding). Below: simple clean form. Mobile-first design.
- **Fields:** Name(`text`, "Your Full Name", *req) | Phone(`tel`, "+91 XXXXXXXXXX", *req) | Preferred Shift(`select`, options loaded from active Shifts showing name + timing) | Message(`textarea rows=2`, "Any questions? (optional)")
- **Buttons:** "Submit Enquiry" → full-width primary
- **Post-submit state:** Form replaced by success screen: ✅ large green icon + "Thank you, [Name]!" heading + "We'll contact you on [Phone] shortly." subtext
- **DB:** `Enquiry` (status auto-set to 'new')

---

#### `forgot-password.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Centered card (440px). "← Back to Login" text link above card.
- **Fields:** Phone or Email(`text`, "Your registered phone or email", *req)
- **Helper text below field:** "An OTP will be sent to your registered mobile number."
- **Buttons:** "Send OTP" → full-width primary
- **DB:** `User`

---

#### `reset-password.tsx`
- **Opens As:** Full page, no app shell
- **Layout:** Centered card (480px).
- **Fields:**
  - OTP: 6 separate single-character `<input type="text" maxlength="1">` boxes in a row, auto-focus advances to next box on input. Labeled "Enter OTP sent to your phone".
  - New Password(`password`, with strength indicator bar below)
  - Confirm Password(`password`)
- **Buttons:** "Update Password" → full-width primary | "Resend OTP" → text link with countdown timer "Resend in 00:45" (disabled until timer hits 0)
- **DB:** `User`
