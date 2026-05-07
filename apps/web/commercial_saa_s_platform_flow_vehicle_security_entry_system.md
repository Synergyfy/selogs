# Commercial SaaS Platform Structure
## Vehicle Security Entry Logging System

---

# 1. PLATFORM DIRECTION

The platform is now a commercial SaaS product.

Target users:
- Hotels
- Estates
- Offices
- Security Companies
- Event Centers
- Residential Estates
- Corporate Facilities

The platform allows businesses to:
- Register online
- Subscribe to plans
- Add branches/locations
- Manage staff and devices
- Capture vehicle entries digitally
- Use the platform with monthly or yearly subscriptions

---

# 2. WEBSITE STRUCTURE (PUBLIC WEBSITE)

## 2.1 Homepage

The homepage should feel security-focused and professional.

### Homepage Design Direction
Use visuals related to:
- Hotel gate security
- Estate security checkpoints
- Security guards using phones/tablets
- Vehicle entry scanning
- Boom gates and access control

The homepage should immediately communicate:
- Security
- Speed
- Digital transformation
- Accountability

---

# 3. HEADER / TOP MENU

## Main Navigation
- Home
- Features
- Pricing
- Industries
- FAQ
- Contact Us
- Login
- Get Started

---

# 4. HOMEPAGE SECTIONS

## 4.1 Hero Section

### Text Example
"Replace Manual Vehicle Logging with a Smart Digital Security System"

### Buttons
- Start Free Trial
- Book Demo

---

## 4.2 Trusted Industries Section

Show industries using the platform:
- Hotels
- Estates
- Security Companies
- Corporate Offices
- Event Centers

---

## 4.3 Features Section

### Core Features
- Plate Number Capture
- Offline Mode
- Staff Tracking
- Branch Management
- OCR Plate Detection
- Dashboard Reporting
- Mobile App Support
- Real-time Sync

---

## 4.4 How It Works Section

### Step-by-step:
1. Create Account
2. Add Locations
3. Add Staff
4. Install Mobile App
5. Start Capturing Entries

---

## 4.5 Industry Solutions Section

Separate cards for:
- Hotel Security
- Estate Security
- Security Companies
- Corporate Security

---

## 4.6 Pricing Preview Section

Simple pricing cards:
- Starter
- Business
- Enterprise

Each plan should display:
- Trial period
- Included locations
- Included staff/devices

---

## 4.7 FAQ Section

Questions such as:
- Does it work offline?
- Can I add branches?
- Can I track staff?
- Is there a free trial?
- Can I use my existing phones?

---

## 4.8 Footer

Include:
- Company Info
- Terms
- Privacy Policy
- Contact Information
- Social Links

---

# 5. PUBLIC PRICING PAGE

## Pricing Structure

The pricing must be:
- Simple
- Flexible
- Easy to understand

---

## Base Pricing Example

### Starter Plan
- 1 Location
- Limited Staff
- Trial Included

### Business Plan
- Multiple Locations
- More Staff
- Advanced Reports

### Enterprise Plan
- Unlimited Locations
- Priority Support
- Custom Features

---

## Branch Pricing Logic

Example:
- Base Plan = ₦5,000/month
- Extra Branch = ₦1,000 or ₦2,000/month

The pricing system must support:
- Per location charges
- Per device charges (optional)
- Per staff charges (optional)
- Add-on feature charges

---

# 6. USER REGISTRATION FLOW

## Step 1: Create Account
Fields:
- Full Name
- Email
- Phone Number
- Password

---

## Step 2: Verify Account
- Email OTP or SMS OTP

---

## Step 3: Create Organization
Fields:
- Organization Name
- Organization Type
- Main Location

---

## Step 4: Brand Identity
Fields:
- Logo
- Primary Color
- Secondary Color

---

## Step 5: Choose Subscription Plan

IMPORTANT:
After signup, user must first go to the subscription selection page before accessing the dashboard.

---

# 7. SUBSCRIPTION FLOW INSIDE DASHBOARD

## Subscription Page

This is different from the public pricing page.

The dashboard subscription page should:
- Show current plan
- Show trial countdown
- Show upgrade options
- Show branch pricing
- Show add-on pricing

---

## Subscription Actions

User can:
- Start free trial
- Upgrade plan
- Add branches
- Add features
- Renew subscription
- Change billing cycle

---

# 8. PAYMENT SYSTEM

## Payment Methods
- Card
- Bank Transfer
- USSD (future)

---

## Billing Cycles
- Monthly
- Quarterly
- Yearly

---

## Subscription States
- Trial
- Active
- Expired
- Suspended

---

# 9. USER ADMIN DASHBOARD

This dashboard is for hotels, estates, and security companies.

---

## Dashboard Navigation
- Dashboard
- Entries
- Branches
- Staff
- Devices
- Subscription
- Billing
- Settings

---

# 10. USER DASHBOARD OVERVIEW

Show:
- Total Entries Today
- Active Branches
- Active Staff
- Active Devices
- Subscription Status

---

# 11. BRANCH MANAGEMENT SYSTEM

## Purpose
Allow organizations to manage multiple locations.

---

## Branch Page

User can:
- Add Branch
- Edit Branch
- Disable Branch

---

## Branch Fields
- Branch Name
- Branch Address
- Branch Code
- Assigned Devices

---

## Branch Pricing Logic

When adding branch:
- System calculates additional charge automatically

Example:
- First location included
- Additional branch = ₦1,000/month

---

# 12. STAFF MANAGEMENT

## Features
- Add Staff
- Edit Staff
- Disable Staff

---

## Fields
- Staff Name
- Staff ID
- Phone Number
- Assigned Branch

---

# 13. DEVICE MANAGEMENT

## Features
- Register device
- Remove device
- Monitor last sync

---

## Device Data
- Device ID
- Assigned Branch
- Last Active Time

---

# 14. ENTRY MANAGEMENT

## Features
- Search entries
- Filter by branch
- Filter by staff
- Filter by date

---

## Entry Data
- Plate Number
- Phone Number
- Staff ID
- Branch
- Timestamp

---

# 15. SETTINGS PAGE

## Sections

### Organization Settings
- Name
- Contact Info

### Brand Identity
- Logo
- Colors

### System Settings
- Enable Notes
- Enable Phone Number
- OCR Settings

---

# 16. BILLING PAGE

## Features
- Current Subscription
- Billing History
- Download Invoice
- Upgrade Plan
- Renew Subscription

---

# 17. SUPER ADMIN DASHBOARD

IMPORTANT:
This dashboard is separate from customer dashboards.

Only platform owners can access this.

---

# 18. SUPER ADMIN FEATURES

## Platform Overview
- Total Customers
- Active Subscriptions
- Expired Accounts
- Revenue
- Active Devices
- Total Entries Captured

---

## Customer Management

Super admin can:
- View all organizations
- Suspend accounts
- Activate accounts
- Upgrade customers manually
- Extend trial periods

---

# 19. PLAN MANAGEMENT SYSTEM

Super admin must be able to:
- Create plans
- Edit plans
- Delete plans
- Add pricing
- Add features
- Set trial days

---

## Plan Configuration

Each plan can have:
- Number of branches
- Number of staff
- Number of devices
- OCR access
- Analytics access
- Export access

---

# 20. FEATURE MANAGEMENT

Super admin can create paid add-ons.

Examples:
- Extra branch
- Extra staff slots
- Extra devices
- Advanced analytics
- Export reports

---

# 21. SUBSCRIPTION ENGINE

The system should automatically:
- Start trials
- Track expiration dates
- Disable expired accounts
- Send renewal reminders
- Apply branch pricing

---

# 22. NOTIFICATION SYSTEM

Send notifications for:
- Trial ending
- Subscription expiry
- Payment success
- Failed payment

---

# 23. MOBILE APP FLOW

## Guard Flow

1. Open App
2. Enter Organization Code
3. Enter Staff ID
4. Start Shift
5. Capture Vehicle Plate
6. Save Entry
7. Sync Automatically

---

# 24. KEY BUSINESS RULES

- Platform must remain simple
- Mobile flow must stay fast
- Offline mode is mandatory
- Every entry must be tied to staff
- Branch pricing must calculate automatically

---

# 25. FUTURE FEATURES

Not required now:
- Facial recognition
- Visitor pass printing
- Boom gate integration
- AI analytics
- Multi-country support

---

# 26. FINAL PRODUCT STRUCTURE

The platform now consists of:

1. Public Website
2. Customer Dashboard
3. Super Admin Dashboard
4. Mobile App
5. Subscription System
6. Branch Management System
7. Billing & Pricing Engine
8. Offline Sync Engine
9. OCR Plate Recognition System

---

# 27. FINAL GOAL

The goal is to create a scalable commercial platform that allows security organizations to:
- Digitally capture vehicle records
- Manage branches
- Track staff activity
- Operate offline
- Subscribe online
- Scale easily across multiple locations

