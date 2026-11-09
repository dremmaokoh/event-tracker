# CityPulse Nigeria 🇳🇬 — Nigerian City Events Hub

A responsive web app for discovering, tracking, rating, and discussing live events across major Nigerian cities. Built with vanilla HTML5, CSS3, and JavaScript. Listings, accounts, reviews, and tickets stay in the browser through `localStorage`. There is no app backend. Ticket sales and Premium upgrades use [Paystack](https://paystack.com) in **test mode**.

Everyone lands on the public events board. Hosting is optional: the header and footer both ask **“Want to post your events?”** and link to sign-up.

---

## Key product features

### 1. Public board and host accounts

- Visitors browse events without an account. They can recommend, rate, comment, RSVP to free events, and pay for tickets.
- **Sign up** and **Sign in** live in the header. The footer repeats **Sign up to host**.
- Sign-up collects a **host name**. That name is shown on every event the host posts (“Hosted by …”).
- Only the host who posted an event can edit or delete it.
- A shared link (`?view=public`) opens the same public board and ignores any saved host session until someone signs in.
- Demo host (free plan): `admin@citypulse.ng` / `password123`.

### 2. Free and Premium hosting

| Plan | What you get | Payment |
| --- | --- | --- |
| **Start free** | Post up to **5** events | None |
| **Premium** | Unlimited events | **₦5,000** one-time Paystack test payment |

The signed-in banner shows usage, for example “Free plan: 1 of 5 events posted”, plus **Upgrade to Premium**. Choosing Premium during sign-up opens checkout before the account is created. Closing the payment window does not create the account.

### 3. Free events and paid tickets

- Each event is either **free** or **ticketed**.
- Paid tickets use **naira (₦)** or **dollars ($)** only. There is no other currency.
- Filters cover free vs ticketed, naira vs dollar tickets, city, category, and rating.
- Sort includes price (low to high). Free events sort as ₦0.
- Free events use **RSVP — it's free**. Paid events use **Get ticket**, which opens Paystack test checkout.
- A saved RSVP or ticket on this browser shows as confirmed on the event. It is not synced to other people.
- Every event has a **ticket or RSVP capacity** and a **sales close** date. Close must be at or before the event starts.
- When the spots are gone, the card and the event page say **Sold out**. The host can later raise the capacity, but not below the number already taken.
- A close date inside the next 72 hours shows an urgency line such as “Sales close in 2 days”. After the deadline the event says **Sales closed** and new tickets or RSVPs stop.
- Hosts can set a discount of 10%, 15%, 20%, 25%, or 50% on a paid ticket. The card shows a red **discount tag**, the old price with a strikethrough, and the amount people actually pay.

### 4. Paystack test checkout

Checkout is test-only. The Paystack test public key is filled in automatically (`pk_test_448800889e222223b1407c1bae6e57b612aeb8f0`). Live keys are not used.

Test card (no real charge):

- Card: `4084084084084081`
- Expiry: any future date
- CVV: `408`
- PIN: `0000`
- OTP: `123456`

Paystack’s inline script is loaded from `https://js.paystack.co/v1/inline.js`. The app does not verify the transaction on a server. The popup reference is saved in this browser only.

### 5. Host studio

After sign-in, the host lands on **Host studio** instead of the public board. The header switches to a dark studio bar.

- The studio lists **only that host’s events** first.
- Each row shows tickets taken against capacity, recommendations, reviews, and money earned. **Reviews** opens the event discussion.
- Filters cover current events, previous events, and which events are pulling the most: tickets sold, recommendations, reviews, money earned, or closing soon.
- Earnings are split into **current** and **previous** events, with naira and dollars kept separate. Current means the event date has not passed.
- **View all events** (in the studio and in the header) returns to the public board. **My studio** brings the host back.
- A provider board lists every host and how their events are doing. Choosing a provider opens the public board filtered to that host name.

### 6. Comments, ratings, and cities

- Each event has attendee reviews inside the details view. Comments are stored under `citypulse_event_comments`.
- Cards show a comment count. **Most Discussed** sorts by that count.
- Cities include Lagos, Abuja, Port Harcourt, Ibadan, Enugu, Benin City, Kano, Calabar, and Asaba, plus a custom city when posting.

### 7. Share links

Signed-in hosts can copy an attendee link (`?view=public`, with the current city when one is selected) or share it on WhatsApp and X.

---

## Project structure

```text
Event Tracker/
├── index.html    # Public board, host studio, event form, checkout modal
├── style.css     # Public board, host studio, tickets, and modals
├── script.js     # Events, studio stats, capacity, discounts, and Paystack test checkout
└── README.md
```

Browser storage keys:

- `citypulse_events_data`
- `citypulse_event_comments`
- `citypulse_user_recommendations`
- `citypulse_user_ratings`
- `citypulse_tickets` — paid tickets and free RSVPs
- `citypulse_admin_accounts` — host accounts, including `plan: "free"` or `"premium"`
- `citypulse_admin_session`

---

## How to run

Open `index.html` in a browser, or from this folder:

```powershell
start index.html
```

Paystack’s script needs a network connection. The test public key is already filled in on the checkout form.
