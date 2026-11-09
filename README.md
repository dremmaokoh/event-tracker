# CityPulse — City Events Discovery & Tracking Dashboard

A modern, responsive web application for discovering, tracking, rating, and managing events across cities. Built with vanilla HTML5, CSS3, and JavaScript, with **client-side persistence via `localStorage`** and zero external backend dependencies.

---

## 🌟 Key Product Features

### 1. 🏙️ Multi-City Discovery & Filtering
- **City Selector**: Filter events by city (e.g., *Lagos, London, New York, Tokyo, Paris*, or custom cities).
- **Category Filter Chips**: Instant filtering across *Music & Concerts, Tech & Business, Food & Drink, Arts & Culture, Sports & Fitness, and Nightlife*.
- **Minimum Rating Filter**: Filter by top-tier (4.5+ ★), highly rated (4.0+ ★), or all events.
- **Sorting Options**: Sort by *Most Recommended, Highest Rated, Upcoming Date, or Recently Added*.
- **Live Search**: Instant keyword search across event names, venues, descriptions, and cities.

### 2. ❤️ Interactive Recommendations & Ratings
- **Recommend (Upvote)**: Attendees can recommend events with a live counter and persistent state.
- **Community Star Ratings**: Visitors can click to submit their 1–5 star ratings, recalculating average scores and review counts in real time.
- **Detailed Event View**: Click any event card to view high-resolution imagery, full schedule details, venue location, pricing, and attendee sentiment.

### 3. 🛡️ Dual Role Architecture: Public vs. Admin
- **Public Explorer View**: Clean, distraction-free view for citizens and tourists to browse, search, recommend, and rate events.
- **Admin Studio Mode**: One-click toggle in the navbar to enter management mode:
  - **Create Events**: Insert new events with photo URL (plus quick presets for concerts, tech, food, art, and parties), date/time, venue, price, and description.
  - **Edit Events**: Modify any existing event details.
  - **Delete Events**: Delete events with a custom confirmation modal.
  - **Custom City Support**: Add events in any city worldwide.

### 4. 💾 100% Local Persistence
- All created events, edits, deletions, user recommendations, and submitted ratings are automatically synchronized with browser `localStorage`.
- Data stays preserved even after refreshing the page or restarting the browser.

---

## 📁 Project Structure

```text
Event Tracker/
├── index.html       # Semantic layout, hero search, event cards grid, and modal dialogs
├── style.css        # Responsive styling, color tokens, animations, and card layouts
├── script.js        # Data controller, localStorage sync, filtering engine, and role management
└── README.md        # Product documentation
```

---

## 🚀 How to Run

No build step or dependencies required! Simply double-click `index.html` in your browser or run:

```bash
# In Windows PowerShell:
start "Event Tracker\index.html"
```

