# CityPulse Nigeria 🇳🇬 — Nigerian City Events Hub

A modern, responsive web application for discovering, tracking, rating, and discussing live events across major Nigerian cities. Built with vanilla HTML5, CSS3, and JavaScript, with **client-side persistence via `localStorage`** and zero external backend dependencies.

---

## 🌟 Key Product Features

### 1. 👥 Strict Public Attendee vs. Admin Permissions
- **Public Attendee Experience (Shared Links)**:
  - When organizers share event dashboard links (e.g. `?view=public`), attendees are strictly placed in visitor mode.
  - Attendees **CANNOT** see or access "Post Event", edit, or delete controls.
  - Attendees can:
    1. **View** full event listings, photos, schedules, and ticket pricing.
    2. **Recommend (Like/Upvote)** events with live recommendation tally.
    3. **Rate** events (1 to 5 stars) affecting the community score.
    4. **Drop Comments & Reviews**: Read and post real attendee comments directly under each event.
- **Authorized Admin Experience**:
  - Secure Admin Portal with Sign In, Sign Up, and one-click demo access (`admin@citypulse.ng` / `password123`).
  - Only authenticated admins can publish new events, update details, or remove events.

### 2. 💬 Attendee Comments & Community Discussion
- Each event includes a dedicated **Attendee Reviews & Discussion** section inside the details modal.
- Visitors can submit their name, 1–5 star rating, and review text.
- Comments persist across reloads via `localStorage` under `citypulse_event_comments`.
- Cards display live comment counters (`💬`).
- Added sorting filter: **"Most Discussed"** to find the most talked-about events.

### 3. 🇳🇬 Major Nigerian Cities
- Pre-configured with major cultural and commercial hubs:
  - **Lagos** (Victoria Island, Lekki, Eko Atlantic, Ikeja)
  - **Abuja (FCT)** (Maitama, Garki, Millennium Park)
  - **Port Harcourt** (Old GRA, Polo Club)
  - **Ibadan** (Agodi Gardens, Bodija)
  - **Enugu** (Independence Layout, Polo Park)
  - **Benin City**, **Kano**, **Calabar**, **Asaba**, plus custom city support.

### 4. 💵 Naira (₦) & Dollar ($) Ticketing
- Ticket pricing is formatted in **Naira (`₦`)**, **Dollars (`$`)**, or **Free Admission**.
- Sorter supports ordering tickets from lowest to highest price.

### 5. 🔗 Protected Attendee Share Links
- Admins can click **"Share Link"** to copy an attendee-safe public URL (`?view=public`).
- Direct one-click share to **WhatsApp** and **𝕏 (Twitter)**.

---

## 📁 Project Structure

```text
Event Tracker/
├── index.html       # Public layout, attendee comment UI, Admin Auth & Share modals
├── style.css        # Responsive styling with emerald Nigerian theme, comments feed & modals
├── script.js        # Controller with comments engine, permission locks, and localStorage sync
└── README.md        # Product documentation
```

---

## 🚀 How to Run

Simply open `index.html` in your browser or run:

```bash
# In Windows PowerShell:
start "Event Tracker\index.html"
```
