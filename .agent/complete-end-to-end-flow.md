Complete End-to-End Flow
Commercial Vehicle Security Entry Platform
This document explains the complete structure and flow of the platform from beginning to end.
It includes:
Public website flow
User onboarding flow
Subscription flow
Branch and gate structure
Mobile app flow
Vehicle check-in flow
Vehicle check-out flow
Dashboard flow
Super admin flow
Billing and pricing flow
Multi-branch and multi-gate logic
Offline sync flow
The purpose of this document is to ensure that:
Nothing is missed
Developers understand the full structure
Designers understand all page relationships
The platform can scale properly
---
1. PLATFORM OVERVIEW
The platform is a commercial SaaS security system used to:
Digitally capture vehicle entries
Digitally capture vehicle exits
Track vehicles currently inside locations
Track security staff activity
Manage multiple branches and gates
Operate offline and sync online
Target users:
Hotels
Estates
Security Companies
Corporate Offices
Event Centers
Residential Facilities
---
2. MAIN SYSTEM COMPONENTS
The platform consists of:
Public Website
Authentication System
Subscription & Billing System
User Dashboard
Super Admin Dashboard
Branch Management System
Gate Management System
Staff Management System
Device Management System
Vehicle Entry & Exit System
Mobile App
OCR Plate Recognition Engine
Offline Sync Engine
Notification System
---
3. PUBLIC WEBSITE FLOW
---
3.1 Homepage
Purpose:
Introduce the platform and convert visitors into customers.
---
Homepage Sections
Header / Navigation
Contains:
Logo
Home
Features
Industries
Pricing
FAQ
Contact
Login
Get Started
---
Hero Section
Contains:
Strong security-focused headline
Short explanation
CTA Buttons:
Start Free Trial
Book Demo
---
Trusted Industries Section
Shows:
Hotels
Estates
Security Companies
Offices
Event Centers
---
Features Section
Shows:
OCR Plate Capture
Offline Support
Staff Tracking
Multi-Branch Management
Multi-Gate Support
Real-time Sync
Dashboard Reporting
---
How It Works Section
Shows:
Create Account
Setup Organization
Add Staff
Setup Gates & Devices
Start Capturing Vehicles
---
Industry Solutions Section
Separate cards for:
Hotel Security
Estate Security
Security Companies
Corporate Security
---
Pricing Preview Section
Shows:
Starter Plan
Business Plan
Enterprise Plan
---
FAQ Section
Answers common questions.
---
Footer
Contains:
Terms
Privacy Policy
Contact Information
Social Links
---
4. FEATURES PAGE FLOW
Purpose:
Explain all major platform features.
---
Feature Sections
Vehicle Check-In
OCR plate scanning
Manual correction
---
Vehicle Check-Out
Fast search
Exit tracking
---
Offline Mode
Works without internet
Auto sync later
---
Staff Accountability
Track which guard handled each vehicle
---
Branch & Gate Management
Multiple locations
Multiple gates per location
---
Reporting
Search
Filters
Vehicle tracking
---
5. INDUSTRIES PAGE FLOW
Purpose:
Show how the platform works for each industry.
---
Industry Sections
Hotel Security
Estate Security
Security Companies
Corporate Offices
Event Centers
---
6. PRICING PAGE FLOW
Purpose:
Public pricing page.
---
Pricing Header
Contains:
Pricing explanation
Monthly / Yearly toggle
---
Pricing Cards
Starter Plan
1 Branch
Basic Features
Trial Included
---
Business Plan
Multiple Branches
More Devices
More Staff
---
Enterprise Plan
Unlimited Usage
Custom Features
---
Add-On Pricing
Shows:
Extra Branch Price
Extra Device Price
Extra Staff Price
Advanced Feature Price
---
CTA Section
Buttons:
Start Free Trial
Contact Sales
---
7. FAQ PAGE FLOW
Contains:
General Questions
Pricing Questions
Offline Questions
Mobile App Questions
Security Questions
---
8. CONTACT PAGE FLOW
Contains:
Contact Form
Contact Information
Support Information
---
9. AUTHENTICATION FLOW
---
9.1 Create Account
Fields:
Full Name
Email
Phone Number
Password
---
9.2 Verify Account
Methods:
Email OTP
SMS OTP
---
9.3 Forgot Password
Flow:
Enter Email
Receive Reset Link / OTP
Create New Password
---
10. ORGANIZATION SETUP FLOW
---
10.1 Create Organization
Fields:
Organization Name
Organization Type
Main Location
---
10.2 Brand Identity Setup
Fields:
Upload Logo
Primary Color
Secondary Color
Custom System Name (optional)
---
10.3 Choose Industry Mode
Options:
Hotel Mode
Estate Mode
Security Company Mode
Corporate Office Mode
---
11. SUBSCRIPTION FLOW
IMPORTANT:
User must select a subscription before accessing dashboard.
---
Subscription Page
Contains:
Current Plan
Trial Countdown
Upgrade Options
Branch Pricing
Add-On Pricing
---
Billing Cycles
Monthly
Quarterly
Yearly
---
Payment Methods
Card
Bank Transfer
USSD (future)
---
Subscription States
Trial
Active
Expired
Suspended
---
12. USER DASHBOARD FLOW
---
Dashboard Overview
Shows:
Total Entries Today
Vehicles Currently Inside
Active Staff
Active Devices
Active Branches
Subscription Status
---
Sidebar Navigation
Dashboard
Entries
Active Vehicles
Branches
Gates
Staff
Devices
Subscription
Billing
Settings
---
13. BRANCH MANAGEMENT FLOW
Purpose:
Manage multiple locations.
---
Branch Page
Features:
Add Branch
Edit Branch
Disable Branch
---
Branch Fields
Branch Name
Address
Branch Code
---
Branch Pricing Logic
When branch is added:
System automatically calculates extra subscription cost.
Example:
First branch included
Additional branch = ₦1,000/month
---
14. GATE MANAGEMENT FLOW
Purpose:
Manage entry and exit points.
---
Gate Page
Features:
Add Gate
Edit Gate
Disable Gate
---
Gate Fields
Gate Name
Gate Type
Entry
Exit
Both
---
Gate Assignment
Each gate belongs to:
One Branch
---
15. STAFF MANAGEMENT FLOW
Purpose:
Manage security personnel.
---
Features
Add Staff
Edit Staff
Disable Staff
---
Staff Fields
Staff Name
Staff ID
Phone Number
Assigned Branch
---
16. DEVICE MANAGEMENT FLOW
Purpose:
Manage mobile devices.
---
Features
Register Device
Assign Device
Remove Device
Monitor Last Sync
---
Device Assignment
Each device must belong to:
One Branch
One Gate
---
Device Data
Device ID
Assigned Branch
Assigned Gate
Last Active Time
---
17. MOBILE APP FLOW
---
Step 1: Open App
---
Step 2: Enter Organization Code
---
Step 3: Device Connects to Organization
---
Step 4: Staff Check-In (Start Shift)
Guard enters:
Staff ID
System automatically knows:
Branch
Gate
based on device assignment.
---
Step 5: Home Screen
Buttons:
New Entry
Check-Out Vehicle
Sync Now
Displays:
Current Staff ID
Current Gate
Sync Status
---
18. VEHICLE CHECK-IN FLOW
---
Step 1: Tap New Entry
---
Step 2: Camera Opens
Guard captures vehicle plate.
---
Step 3: OCR Detection
System:
Reads plate number
Auto-fills plate field
---
Step 4: Entry Form
Fields:
Plate Number (editable)
Phone Number (optional)
Notes (optional)
---
Step 5: Save Entry
System saves:
Plate Number
Branch
Gate
Check-in Time
Staff ID
Device ID
Status = IN
---
Duplicate Protection
If plate already has status = IN inside branch:
Show warning:
"Vehicle already inside this location"
---
19. VEHICLE CHECK-OUT FLOW
---
Step 1: Tap Check-Out Vehicle
---
Step 2: Search Vehicle
Methods:
Search plate manually
Scan plate again
Select from active vehicles list
---
Step 3: Vehicle Details Screen
Shows:
Plate Number
Check-in Time
Duration
Check-in Staff
---
Step 4: Confirm Check-Out
Guard taps:
Check-Out
---
Step 5: Save Check-Out
System updates:
Status = OUT
Check-out Time
Check-out Staff ID
Check-out Gate
---
Step 6: Return to Home Screen
---
20. ACTIVE VEHICLES FLOW
Purpose:
Show vehicles currently inside branch.
---
Active Vehicle Logic
Only show:
Vehicles where status = IN
Within current branch
---
Active Vehicles Page
Shows:
Plate Number
Time Inside
Gate Entered
Staff Who Logged Entry
---
21. ENTRY MANAGEMENT FLOW
Purpose:
View all entry and exit records.
---
Filters
Date
Branch
Gate
Staff
Status (IN / OUT)
---
Table Columns
Plate Number
Branch
Check-in Gate
Check-out Gate
Check-in Staff
Check-out Staff
Duration
Status
---
22. OFFLINE SYNC FLOW
Purpose:
Ensure app works without internet.
---
Offline Logic
When offline:
Entries saved locally
Check-outs saved locally
---
Sync Logic
When internet becomes available:
Unsynced records upload automatically
---
Sync Status
Each record contains:
Synced
Not Synced
---
23. BILLING PAGE FLOW
Contains:
Current Plan
Expiry Date
Billing History
Download Invoice
Renew Subscription
Upgrade Plan
---
24. SETTINGS PAGE FLOW
---
Organization Settings
Organization Name
Contact Info
---
Brand Identity Settings
Logo
Colors
---
System Settings
Enable Notes
Enable Phone Number
OCR Settings
---
25. SUPER ADMIN DASHBOARD FLOW
IMPORTANT:
This dashboard is only for platform owners.
---
Dashboard Overview
Shows:
Total Customers
Revenue
Active Subscriptions
Expired Accounts
Active Devices
Total Entries Captured
---
Sidebar Navigation
Dashboard
Customers
Plans
Billing
Features
Notifications
Settings
---
26. CUSTOMER MANAGEMENT FLOW
Super admin can:
View organizations
Suspend organizations
Activate organizations
Extend trial periods
Upgrade plans manually
---
27. PLAN MANAGEMENT FLOW
Super admin can:
Create Plan
Edit Plan
Delete Plan
---
Plan Settings
Each plan can define:
Branch limit
Staff limit
Device limit
OCR access
Analytics access
Export access
Trial days
---
28. FEATURE MANAGEMENT FLOW
Purpose:
Create paid add-ons.
---
Add-On Examples
Extra Branch
Extra Device
Extra Staff Slot
Advanced Reports
Export Features
---
29. NOTIFICATION SYSTEM FLOW
Notifications for:
Trial Ending
Subscription Expiry
Payment Success
Failed Payment
Branch Limit Reached
---
30. SECURITY & ACCOUNTABILITY RULES
Every record must track:
Who checked vehicle in
Who checked vehicle out
Which gate handled entry
Which gate handled exit
Which branch vehicle belongs to
---
31. IMPORTANT SYSTEM RULES
DO NOT:
Allow guards manually select branch
Allow guards manually select gate
Allow duplicate active vehicle entries
Mix records across branches
System should automatically detect:
Branch
Gate
Device
based on device assignment.
---
32. FUTURE FEATURES (NOT REQUIRED NOW)
Facial Recognition
Visitor Pass Printing
Boom Gate Integration
AI Analytics
Multi-Country Support
Visitor Pre-Registration
---
33. FINAL PRODUCT GOAL
The goal is to create a simple but scalable security platform that allows organizations to:
Digitally capture vehicle entries and exits
Track vehicles currently inside locations
Track security staff activity
Manage multiple branches and gates
Operate offline
Subscribe online
Scale easily across locations
Maintain security accountability
---
34. FINAL DEVELOPMENT PRINCIPLES
The platform must always remain:
Simple
Fast
Reliable
Offline-first
Easy for guards to use
Easy for admins to manage
Commercially scalable