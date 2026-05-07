# Digital Vehicle Entry Logging System (Offline-First)

## 1. Project Overview
This system is a simple mobile and web solution for security personnel to capture and store vehicle entry records digitally.

It replaces manual pen-and-paper logging with a fast, reliable system that works both offline and online.

---

## 2. Objectives
- Capture vehicle plate numbers quickly
- Capture phone numbers (optional)
- Identify which staff captured each entry
- Store data offline
- Sync data when internet is available
- Provide a simple dashboard for viewing records

---

## 3. System Components
1. Android Mobile App (for guards)
2. Backend Server (API + Database)
3. Web Dashboard (for admins)

---

## 4. Staff Identification System (NEW - CORE FEATURE)

### 4.1 Approach: Shift-Based Staff Check-in (Recommended)

Instead of full login, each security staff will identify themselves at the start of their shift.

### 4.2 Flow:
1. Open app
2. Enter Staff ID
3. Tap "Start Shift"
4. App saves staff ID for the session

All entries recorded during the session will automatically be linked to that staff.

### 4.3 Optional Fields:
- Staff Name (optional)

### 4.4 Requirements:
- Staff ID must be required before capturing entries
- App should remember staff until logout or app reset

---

## 5. Mobile App Features

### 5.1 Home Screen
- Button: New Entry
- Button: Sync Now
- Sync Status Indicator
- Display current Staff ID

### 5.2 New Entry Flow
1. Tap New Entry
2. Camera opens
3. Capture plate image
4. OCR detects plate number
5. Auto-fill plate field
6. Allow manual edit
7. Enter phone number (optional)
8. Tap Save

### 5.3 Data Stored Per Entry
- Plate Number
- Phone Number (optional)
- Timestamp (auto)
- Device ID
- Staff ID (required)
- Staff Name (optional)
- Sync Status

---

## 6. Offline Functionality
- All entries stored locally using SQLite
- App must work fully without internet
- Each record marked as synced or unsynced

---

## 7. Sync System

### Auto Sync
- Trigger when internet is available

### Manual Sync
- Sync Now button

### Sync Logic
- Send only unsynced records
- Mark records as synced after success
- Retry failed sync automatically

---

## 8. OCR Requirements
- Use on-device OCR
- Fast detection (2–3 seconds)
- Accuracy target: 80–90%
- Must allow manual correction

---

## 9. Backend API

### POST /entries
Payload:
- plate_number
- phone_number
- timestamp
- device_id
- staff_id
- staff_name (optional)

### GET /entries
Query:
- plate_number (optional)
- date range (optional)
- staff_id (optional)

---

## 10. Database Structure

### Table: entries
- id
- plate_number
- phone_number
- timestamp
- device_id
- staff_id
- staff_name
- created_at
- updated_at

---

## 11. Web Dashboard

### Features
- Admin login
- Table view of records
- Search by plate number
- Filter by date
- Filter by staff

### Table Columns
- Plate Number
- Phone Number
- Timestamp
- Staff ID
- Device ID

---

## 12. UI Screens

### Screen 0: Staff Check-in
- Input: Staff ID
- Button: Start Shift

### Screen 1: Home
- Display Staff ID
- New Entry
- Sync Now

### Screen 2: Camera
- Live camera preview
- Capture button

### Screen 3: Entry Form
Fields:
- Plate Number (editable)
- Phone Number (optional)

Buttons:
- Save
- Cancel

---

## 13. Performance Requirements
- Entry process < 10 seconds
- OCR processing < 3 seconds
- App must not freeze

---

## 14. Security Requirements
- Use HTTPS for API
- Admin authentication
- Secure data storage

---

## 15. Error Handling
- If OCR fails → allow manual entry
- If save fails → retry option
- If sync fails → auto retry

---

## 16. Deployment Plan

### Phase 1
- Build mobile app
- Build backend API
- Build dashboard

### Phase 2
- Pilot with few locations

### Phase 3
- Improve based on feedback

---

## 17. Future Features (Not in MVP)
- Plate history tracking
- Blacklist system
- Notifications
- Analytics dashboard

---

## 18. Success Criteria
- Easy for guards to use
- Fast entry process
- Works offline
- Reliable sync
- Easy record search
- Ability to track which staff logged each entry

---

## 19. Key Principles
- Keep it simple
- Offline-first
- Fast and reliable
- Minimal typing
- Clear staff accountability

