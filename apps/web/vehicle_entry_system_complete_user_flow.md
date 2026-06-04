# Vehicle Entry Logging System - Complete Flow (Step by Step)

---

## 1. Landing Page
This is the first page a business sees.

### Contains:
- Short explanation of the system
- Benefits (No paper, Fast, Works offline)
- Button: Get Started
- Button: Login

---

## 2. Create Account

### User enters:
- Full Name
- Email
- Phone Number
- Password

### Action:
- Click Create Account

---

## 3. Verify Account

### User:
- Enters OTP (Email or SMS)

### After verification:
- Continue to next page

---

## 4. Create Organization

### User enters:
- Organization Name
- Organization Type (Hotel, Estate, Office, Security Company)
- Location

### Action:
- Click Continue

---

## 5. Brand Identity Setup

### User sets:
- Upload Logo
- Primary Color
- Secondary Color (optional)
- Custom System Name (optional)

### Action:
- Click Continue

---

## 6. Choose System Mode

### Options:
- Hotel Mode
- Estate Mode
- Security Company Mode

### Action:
- Continue

---

## 7. Add Staff

### User enters:
- Staff Name
- Staff ID (Required)
- Phone Number (optional)

### Action:
- Add multiple staff
- Continue

---

## 8. Device Setup

### System shows:
- Organization Code

### Instructions:
- Install mobile app
- Enter organization code

### Action:
- Continue to Dashboard

---

# MOBILE APP FLOW

---

## 9. Connect to Organization

### Guard enters:
- Organization Code

### Action:
- Connect

---

## 10. Staff Check-in (Start Shift)

### Guard enters:
- Staff ID

### Action:
- Tap Start Shift

### System:
- Saves session

---

## 11. Home Screen

### Shows:
- Staff ID
- Sync status

### Buttons:
- New Entry
- Sync Now

---

## 12. Capture Entry

### Step 1:
- Tap New Entry

### Step 2:
- Camera opens
- Capture plate

### Step 3: Entry Form
- Plate Number (auto-filled, editable)
- Phone Number (optional)
- Notes (optional)

### Action:
- Save

---

## 13. Save Process

System saves:
- Plate Number
- Phone Number
- Timestamp
- Device ID
- Staff ID
- Sync Status (Not Synced)

---

## 13.5 Check-Out Vehicle

### Guard taps:
- Check-Out Vehicle

### System shows:
- Active vehicles list (currently inside)
- Search by plate number

### Guard selects vehicle:
- Views check-in time
- Views duration stayed

### Guard confirms:
- Tap Confirm Exit
- Status updated to OUT

### System saves:
- Check-out timestamp
- Check-out staff ID
- Sync Status (Not Synced)

---

## 14. Sync Process

### Automatic:
- Sync when internet is available

### Manual:
- Tap Sync Now

### Result:
- Records marked as synced

---

# WEB DASHBOARD FLOW

---

## 15. Login Page

### User enters:
- Email
- Password

---

## 16. Dashboard

### Shows:
- Total entries today
- Total entries this week
- Active staff
- Active devices

---

## 17. Entries Page

### Table Columns:
- Plate Number
- Phone Number
- Timestamp
- Staff ID
- Device ID

### Features:
- Search by plate
- Filter by date
- Filter by staff

---

## 18. Staff Page

### Admin can:
- Add staff
- Edit staff
- Remove staff

---

## 19. Devices Page

### Shows:
- Connected devices

### Info:
- Device ID
- Last sync time

---

## 20. Settings Page

### Sections:

#### Organization Info
- Name
- Location

#### Brand Identity
- Logo
- Colors

#### System Settings
- Enable/disable phone field
- Enable/disable notes field

---

## 21. Logout / End Shift

### Mobile:
- End Shift (clears Staff ID)

### Web:
- Logout

---

# COMPLETE FLOW SUMMARY

1. User opens landing page
2. Creates account
3. Verifies account
4. Creates organization
5. Sets brand identity
6. Chooses system mode
7. Adds staff
8. Gets organization code
9. Installs mobile app
10. Connects device
11. Staff enters ID
12. Captures entries
13. Data saved offline
14. Checks out vehicles (search → select → confirm)
15. Syncs to server
16. Admin views dashboard

---

## KEY PRINCIPLES

- Keep it simple
- Fast usage
- Offline-first
- Minimal typing
- Track staff for accountability

