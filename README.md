# CityPulse Nigeria 🇳🇬 — Nigerian City Events Hub

A modern, responsive web application for discovering, tracking, rating, and managing live events across major Nigerian cities. Built with vanilla HTML5, CSS3, and JavaScript, with **client-side persistence via `localStorage`** and zero external backend dependencies.

---

## 🌟 Key Updates & Features

### 1. 🇳🇬 Major Nigerian Cities Focus
- Pre-configured with major Nigerian cultural and commercial hubs:
  - **Lagos** (Victoria Island, Lekki, Eko Atlantic, Ikeja)
  - **Abuja (FCT)** (Maitama, Garki, Central Business District)
  - **Port Harcourt** (Old GRA, Polo Club, Trans-Amadi)
  - **Ibadan** (Agodi, Bodija, Ring Road)
  - **Enugu** (Independence Layout, Polo Park)
  - **Benin City**, **Kano**, **Calabar**, **Asaba**, plus custom city support.

### 2. 💵 Naira (₦) & Dollar ($) Ticketing
- Ticket pricing is standardized in **Naira (`₦`)** and **Dollars (`$`)**, or **Free Admission**:
  - e.g. `₦20,000` for Afrobeats Concerts, `₦5,000` for Food Fiestas, `$50` for Tech Summits, or Free Admission.
  - Sorter supports ordering tickets from lowest to highest price.

### 3. 🛡️ Admin Sign Up & Login System
- **Authorized Admin Access**: Only verified administrators can publish, edit, or delete events.
- **Admin Portal**:
  - **Sign In**: Login with email and password.
  - **Sign Up**: Register new administrator accounts (stored in `localStorage`).
  - **⚡ Quick Demo Access**: One-click demo login button for quick evaluation (Email: `admin@citypulse.ng` / Password: `password123`).
- **Profile Pill & Sign Out**: Displays the active admin's name, initials, and an instant logout button.

### 4. 🔗 Public Link Sharing
- Admins can click **"Share Link"** in the top navbar or banner:
  - Generates the public dashboard link with city query parameters.
  - One-click copy to clipboard with instant toast notification.
  - Quick share buttons for **WhatsApp** and **𝕏 (Twitter)** to share directly with attendees.

### 5. ❤️ Attendee Interactions
- **Recommend (Upvote)**: Community members can recommend events with a live counter and saved state.
- **Interactive 5-Star Community Ratings**: Attendees can submit ratings (1 to 5 stars) which dynamically updates the event's average rating and review tally.
- **Detailed Event View**: High-resolution imagery, full venue details, schedules, and ticket pricing.

---

## 📁 Project Structure

```text
Event Tracker/
├── index.html       # Nigerian events layout, Admin Auth modal, Share modal, and cards grid
├── style.css        # Responsive styling with emerald Nigerian theme, card elevations & modals
├── script.js        # Controller with localStorage sync, Admin Auth, and Nigerian seed data
└── README.md        # Product documentation
```

---

## 🚀 How to Run

Simply double-click `index.html` in your browser or run:

```bash
# In Windows PowerShell:
start "Event Tracker\index.html"
```
