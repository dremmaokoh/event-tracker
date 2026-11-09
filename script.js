/**
 * ============================================================================
 * CityPulse Nigeria — City Events Discovery & Tracking Dashboard
 * Vanilla JavaScript with Web Storage (localStorage) Persistence
 * ============================================================================
 */

// Storage Keys
const STORAGE_EVENTS_KEY = 'citypulse_events_data';
const STORAGE_USER_RECS_KEY = 'citypulse_user_recommendations';
const STORAGE_USER_RATINGS_KEY = 'citypulse_user_ratings';
const STORAGE_EVENT_COMMENTS_KEY = 'citypulse_event_comments';
const STORAGE_ADMIN_ACCOUNTS_KEY = 'citypulse_admin_accounts';
const STORAGE_ADMIN_SESSION_KEY = 'citypulse_admin_session';
const STORAGE_TICKETS_KEY = 'citypulse_tickets';

const FREE_EVENT_LIMIT = 5;
const PREMIUM_PRICE_NGN = 5000;

// Always used for checkout. Public test key from Paystack's own popup sample.
const PAYSTACK_PUBLIC_KEY = 'pk_test_448800889e222223b1407c1bae6e57b612aeb8f0';

const SEED_HOSTS = {
  'evt-ng-101': { hostName: 'Adaeze Cole', hostEmail: 'adaeze@lagoslive.ng' },
  'evt-ng-102': { hostName: 'Lagos Tech Fest', hostEmail: 'hello@lagostechfest.ng' },
  'evt-ng-103': { hostName: 'Ibrahim Danladi', hostEmail: 'ibrahim@abujagrills.ng' },
  'evt-ng-104': { hostName: 'Garden City Live', hostEmail: 'bookings@gardencitylive.ng' },
  'evt-ng-105': { hostName: 'Agodi Arts Collective', hostEmail: 'studio@agodiarts.ng' },
  'evt-ng-106': { hostName: 'Coal City Devs', hostEmail: 'team@coalcitydevs.ng' },
  'evt-ng-107': { hostName: 'Calabar Carnival', hostEmail: 'info@calabarcarnival.ng' },
  'evt-ng-108': { hostName: 'Blake Resort', hostEmail: 'nights@blakeresort.ng' }
};

// Sales defaults for the sample events. Applied only when an event has no saved values.
const SEED_SALES = {
  'evt-ng-101': { ticketCapacity: 500, discountPercent: 15, ticketCloseAt: '2026-11-20T18:00' },
  'evt-ng-102': { ticketCapacity: 80, discountPercent: 10, ticketCloseAt: '2026-11-11T18:00' },
  'evt-ng-103': { ticketCapacity: 400, discountPercent: 0, ticketCloseAt: '2026-12-04T12:00' },
  'evt-ng-104': { ticketCapacity: 180, discountPercent: 0, ticketCloseAt: '2026-11-28T18:00' },
  'evt-ng-105': { ticketCapacity: 150, discountPercent: 20, ticketCloseAt: '2026-11-30T10:00' },
  'evt-ng-106': { ticketCapacity: 200, discountPercent: 0, ticketCloseAt: '2026-12-09T09:00' },
  'evt-ng-107': { ticketCapacity: 900, discountPercent: 0, ticketCloseAt: '2026-12-12T14:00' },
  'evt-ng-108': { ticketCapacity: 40, discountPercent: 0, ticketCloseAt: '2026-11-10T20:00' }
};

// Preset curated Unsplash photos for quick event creation
const IMAGE_PRESETS = {
  concert: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
  art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
  party: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80'
};

// Seed Nigerian Events across major cities (Lagos, Abuja, Port Harcourt, Ibadan, Enugu, etc.)
const defaultNigerianEvents = [
  {
    id: 'evt-ng-101',
    name: 'Afrobeats Live in Concert: Eko Atlantic Nights',
    city: 'Lagos',
    venue: 'Eko Atlantic Waterfront, Victoria Island, Lagos',
    category: 'Music & Concerts',
    date: '2026-11-28T18:00',
    currency: '₦',
    price: '₦20,000',
    priceVal: 20000,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    description: 'An unforgettable night of world-class Afrobeats, live drum ensembles, fire dancers, and guest performances by Grammy-nominated artists along the scenic Atlantic shoreline.',
    rating: 4.9,
    ratingCount: 168,
    recommendations: 342,
    createdAt: Date.now() - 3600000 * 24 * 5
  },
  {
    id: 'evt-ng-102',
    name: 'Lagos Tech Fest & Venture Capital Mixer 2026',
    city: 'Lagos',
    venue: 'Landmark Event Centre, Victoria Island, Lagos',
    category: 'Tech & Business',
    date: '2026-11-24T09:00',
    currency: '$',
    price: '$50',
    priceVal: 50,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: 'Connecting 3,000+ Nigerian founders, global venture capitalists, fintech architects, and software engineers. Keynote panels on AI in Africa, Web3 rails, and high-growth scaling.',
    rating: 4.8,
    ratingCount: 124,
    recommendations: 289,
    createdAt: Date.now() - 3600000 * 24 * 3
  },
  {
    id: 'evt-ng-103',
    name: 'Abuja International Suya, Grills & Palmwine Fiesta',
    city: 'Abuja',
    venue: 'Millennium Park, Maitama, Abuja (FCT)',
    category: 'Food & Drink',
    date: '2026-12-05T12:00',
    currency: '₦',
    price: '₦5,000',
    priceVal: 5000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    description: 'Savor Nigeria’s tastiest delicacies from master pitmasters: gourmet Asun, spiced Kilishi, honey-glazed suya skewers, fresh palmwine, and acoustic guitar sessions under the trees.',
    rating: 4.9,
    ratingCount: 145,
    recommendations: 310,
    createdAt: Date.now() - 3600000 * 24 * 7
  },
  {
    id: 'evt-ng-104',
    name: 'Garden City Jazz & Highlife Gala',
    city: 'Port Harcourt',
    venue: 'Port Harcourt Polo Club, Old GRA, Rivers State',
    category: 'Music & Concerts',
    date: '2026-11-30T19:30',
    currency: '₦',
    price: '₦12,500',
    priceVal: 12500,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    description: 'An elegant evening celebrating the rich legacy of Niger Delta Highlife and smooth contemporary Jazz. Featuring live saxophone quartets, aged wine tastings, and dinner banquet.',
    rating: 4.7,
    ratingCount: 78,
    recommendations: 165,
    createdAt: Date.now() - 3600000 * 24 * 4
  },
  {
    id: 'evt-ng-105',
    name: 'Ibadan Heritage Arts & Contemporary Textile Expo',
    city: 'Ibadan',
    venue: 'Agodi Gardens & Cultural Pavilion, Ibadan, Oyo State',
    category: 'Arts & Culture',
    date: '2026-12-02T10:00',
    currency: '₦',
    price: '₦3,500',
    priceVal: 3500,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    description: 'Showcasing master Adire textile artisans, bronze sculptors, and avant-garde Yoruba visual art installations with pottery workshops, poetry slams, and traditional drum performances.',
    rating: 4.6,
    ratingCount: 62,
    recommendations: 130,
    createdAt: Date.now() - 3600000 * 24 * 6
  },
  {
    id: 'evt-ng-106',
    name: 'Coal City Innovation & Developers Summit',
    city: 'Enugu',
    venue: 'Enugu State International Conference Centre, Independence Layout',
    category: 'Tech & Business',
    date: '2026-12-10T09:30',
    currency: 'Free',
    price: 'Free Admission',
    priceVal: 0,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    description: 'Empowering Southeast Nigerian tech talent. Features a 24-hour hackathon, robotics demo booths, cloud architecture workshops, and job recruitment roundtables.',
    rating: 4.8,
    ratingCount: 92,
    recommendations: 215,
    createdAt: Date.now() - 3600000 * 24 * 2
  },
  {
    id: 'evt-ng-107',
    name: 'Calabar Carnival Prelude & Cultural Street Parade',
    city: 'Calabar',
    venue: 'Calabar Cultural Centre & Mary Slessor Avenue, Cross River',
    category: 'Arts & Culture',
    date: '2026-12-14T14:00',
    currency: '₦',
    price: '₦8,000',
    priceVal: 8000,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    description: 'The prelude to Africa’s biggest street party! Marvel at dazzling masquerades, intricate feathered costumes, vibrant carnival floats, and non-stop Calabar culinary delights.',
    rating: 4.9,
    ratingCount: 198,
    recommendations: 420,
    createdAt: Date.now() - 3600000 * 24 * 9
  },
  {
    id: 'evt-ng-108',
    name: 'Federal Capital Midnight Glow & Lounge Party',
    city: 'Abuja',
    venue: 'Blake Resort & Sky Lounge, Garki 2, Abuja',
    category: 'Nightlife',
    date: '2026-11-27T22:00',
    currency: '₦',
    price: '₦15,000',
    priceVal: 15000,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Abuja’s most anticipated rooftop nightlife party with UV neon body paints, celebrity guest DJs, VIP bottle service, shisha cabanas, and panoramic night views of Aso Rock.',
    rating: 4.7,
    ratingCount: 88,
    recommendations: 185,
    createdAt: Date.now() - 3600000 * 24 * 1
  }
];

// Seed attendee comments for realistic community discussion
const defaultComments = {
  'evt-ng-101': [
    {
      id: 'cmt-1',
      name: 'Chidi Okafor',
      text: 'Last year was an absolute movie! Make sure you get to Eko Atlantic before 6 PM to beat the bridge traffic.',
      rating: 5,
      date: '2 days ago'
    },
    {
      id: 'cmt-2',
      name: 'Zainab Ahmed',
      text: 'Super hyped for the guest performers. Can anyone confirm if the VIP passes include reserved parking?',
      rating: 5,
      date: 'Yesterday'
    }
  ],
  'evt-ng-103': [
    {
      id: 'cmt-3',
      name: 'Ibrahim Danladi',
      text: 'The honey suya from the Maitama pitmasters is unbeatable. Best family festival in Abuja hands down!',
      rating: 5,
      date: '3 days ago'
    }
  ]
};

// Default demo administrator credentials
const defaultAdminAccount = {
  name: 'Emmanuel Okoh',
  email: 'admin@citypulse.ng',
  password: 'password123',
  city: 'Lagos',
  plan: 'free'
};

// App State
let events = [];
let userRecommendations = new Set();
let userRatings = {}; // { eventId: rating }
let eventComments = {}; // { eventId: [ { id, name, text, rating, date } ] }
let tickets = []; // local ticket / RSVP records
let currentAdminUser = null; // null if not logged in
let isSharedLinkView = false; // true if opened via shared attendee link
let pendingSignup = null;
let checkoutContext = null;
let pageView = 'discover';
let studioSort = 'tickets';
let studioWhen = 'all';

// Filter State
let selectedCity = 'all';
let selectedCategory = 'all';
let selectedAdmission = 'all';
let selectedCurrency = 'all';
let minRatingFilter = 0;
let sortBy = 'recommended';
let searchKeyword = '';

// Active dialog targets
let activeEventForRating = null;
let activeEventForDelete = null;
let activeEventForDetail = null;
let newCommentRating = 5;
let toastTimeout = null;

// DOM Elements
const brandLogoBtn = document.getElementById('brandLogoBtn');
const eventsGrid = document.getElementById('eventsGrid');
const hostStudio = document.getElementById('hostStudio');
const discoverView = document.getElementById('discoverView');
const myStudioBtn = document.getElementById('myStudioBtn');
const viewAllEventsBtn = document.getElementById('viewAllEventsBtn');
const brandBadge = document.querySelector('.brand-badge');
const emptyState = document.getElementById('emptyState');
const navCitySelect = document.getElementById('navCitySelect');
const activeCityLabel = document.getElementById('activeCityLabel');
const globalSearchInput = document.getElementById('globalSearchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const ratingFilter = document.getElementById('ratingFilter');
const sortSelect = document.getElementById('sortSelect');
const categoryChips = document.querySelectorAll('.cat-chip');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');

const eventsCountHeading = document.getElementById('eventsCountHeading');
const filterStatusText = document.getElementById('filterStatusText');
const totalRecommendationsCount = document.getElementById('totalRecommendationsCount');
const avgRatingDisplay = document.getElementById('avgRatingDisplay');

// Admin Navbar Elements
const openAuthModalBtn = document.getElementById('openAuthModalBtn');
const openSignupBtn = document.getElementById('openSignupBtn');
const publicHostCta = document.getElementById('publicHostCta');
const footerSignupBtn = document.getElementById('footerSignupBtn');
const footerHostCta = document.getElementById('footerHostCta');
const footerSignedIn = document.getElementById('footerSignedIn');
const adminControls = document.getElementById('adminControls');
const adminAvatarText = document.getElementById('adminAvatarText');
const adminNameDisplay = document.getElementById('adminNameDisplay');
const adminPlanLabel = document.getElementById('adminPlanLabel');
const adminPlanSummary = document.getElementById('adminPlanSummary');
const upgradePlanBtn = document.getElementById('upgradePlanBtn');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const adminBanner = document.getElementById('adminBanner');
const adminSessionEmail = document.getElementById('adminSessionEmail');
const openCreateModalBtn = document.getElementById('openCreateModalBtn');
const sharePublicLinkBtn = document.getElementById('sharePublicLinkBtn');
const quickShareBtn = document.getElementById('quickShareBtn');

// Auth Modal
const authModal = document.getElementById('authModal');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegisterBtn = document.getElementById('tabRegisterBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const fillDemoAdminBtn = document.getElementById('fillDemoAdminBtn');

// Share Modal
const shareModal = document.getElementById('shareModal');
const closeShareModalBtn = document.getElementById('closeShareModalBtn');
const shareLinkInput = document.getElementById('shareLinkInput');
const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');
const shareTwitterBtn = document.getElementById('shareTwitterBtn');

// Event Details Modal
const eventDetailModal = document.getElementById('eventDetailModal');
const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
const detailModalBody = document.getElementById('detailModalBody');

// Event Form Modal
const eventFormModal = document.getElementById('eventFormModal');
const closeFormModalBtn = document.getElementById('closeFormModalBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const eventForm = document.getElementById('eventForm');
const formModalTitle = document.getElementById('formModalTitle');
const saveBtnText = document.getElementById('saveBtnText');
const formHeaderIcon = document.getElementById('formHeaderIcon');
const editEventId = document.getElementById('editEventId');
const eventCity = document.getElementById('eventCity');
const customCityGroup = document.getElementById('customCityGroup');
const customCityInput = document.getElementById('customCityInput');
const eventCurrency = document.getElementById('eventCurrency');
const ticketAmountGroup = document.getElementById('ticketAmountGroup');
const ticketPricingRow = document.getElementById('ticketPricingRow');
const eventPriceAmount = document.getElementById('eventPriceAmount');
const admissionFilter = document.getElementById('admissionFilter');
const currencyFilter = document.getElementById('currencyFilter');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutTitle = document.getElementById('checkoutTitle');
const checkoutSummary = document.getElementById('checkoutSummary');
const checkoutPayBtn = document.getElementById('checkoutPayBtn');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');

// Delete Confirm Modal
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteEventNameDesc = document.getElementById('deleteEventNameDesc');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Rating Modal
const ratingModal = document.getElementById('ratingModal');
const ratingEventTitle = document.getElementById('ratingEventTitle');
const starRatingSelector = document.getElementById('starRatingSelector');
const starRatingFeedback = document.getElementById('starRatingFeedback');
const cancelRatingBtn = document.getElementById('cancelRatingBtn');
const submitRatingBtn = document.getElementById('submitRatingBtn');

// Toast
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

/* ── Lifecycle Initialization ────────────────────────────────────────────── */
function init() {
  detectURLParams();
  loadData();
  bindEvents();
  updateAuthUI();
  syncCityDropdownOptions();
  render();
}

/* ── Check URL Parameters (Shared Link detection) ────────────────────────── */
function detectURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // If user opens a link with view=public or shared=true, guarantee public attendee mode!
  if (urlParams.get('view') === 'public' || urlParams.get('shared') === '1') {
    isSharedLinkView = true;
    currentAdminUser = null; // Do not use admin session when viewing shared link
  }

  // Pre-filter city if specified in shared URL (e.g. ?city=Abuja)
  const cityParam = urlParams.get('city');
  if (cityParam) {
    selectedCity = cityParam;
  }
}

/* ── Event shape: free or ticketed, Naira/Dollar only, named host ─────────── */
function normalizeEvent(evt) {
  const seeded = SEED_HOSTS[evt.id] || {};
  const sales = SEED_SALES[evt.id] || {};
  const explicit = evt.admission === 'free' || evt.admission === 'paid';
  const looksFree = evt.currency === 'Free' || /free/i.test(evt.price || '') || Number(evt.priceVal) === 0;
  const admission = explicit ? evt.admission : (looksFree ? 'free' : 'paid');
  const currency = admission === 'free' ? '' : (evt.currency === '$' ? '$' : '₦');
  let priceVal = admission === 'free' ? 0 : Number(evt.priceVal) || 0;
  let discountPercent = Number(evt.discountPercent != null ? evt.discountPercent : sales.discountPercent) || 0;
  discountPercent = Math.min(90, Math.max(0, discountPercent));
  let listPriceVal = admission === 'free' ? 0 : Number(evt.listPriceVal != null ? evt.listPriceVal : priceVal);
  if (admission === 'paid' && discountPercent > 0 && evt.listPriceVal == null) {
    listPriceVal = priceVal;
    priceVal = currency === '$'
      ? Math.round(listPriceVal * (100 - discountPercent)) / 100
      : Math.round(listPriceVal * (100 - discountPercent) / 100);
  }
  const price = admission === 'free'
    ? 'Free'
    : (currency === '$'
      ? `$${priceVal.toLocaleString('en-US')}`
      : `₦${priceVal.toLocaleString('en-NG')}`);
  const eventTime = evt.date ? new Date(evt.date) : null;
  const fallbackClose = eventTime && !isNaN(eventTime.getTime())
    ? new Date(eventTime.getTime() - 3600000 * 24).toISOString().slice(0, 16)
    : '';

  return {
    ...evt,
    admission,
    currency,
    price,
    priceVal,
    listPriceVal,
    discountPercent: admission === 'paid' ? discountPercent : 0,
    ticketCapacity: Math.max(1, Number(evt.ticketCapacity || sales.ticketCapacity) || 100),
    ticketCloseAt: evt.ticketCloseAt || sales.ticketCloseAt || fallbackClose,
    hostName: evt.hostName || seeded.hostName || 'CityPulse',
    hostEmail: evt.hostEmail || seeded.hostEmail || 'events@citypulse.ng'
  };
}

function formatMoneyAmount(currency, amount) {
  const n = Number(amount) || 0;
  return currency === '$'
    ? `$${n.toLocaleString('en-US')}`
    : `₦${n.toLocaleString('en-NG')}`;
}

function spotsTaken(evt) {
  const kind = isFreeEvent(evt) ? 'rsvp' : 'ticket';
  return tickets.filter(ticket => ticket.eventId === evt.id && ticket.kind === kind).length;
}

function salesState(evt) {
  const sold = spotsTaken(evt);
  const capacity = Math.max(0, Number(evt.ticketCapacity) || 0);
  const closeAt = evt.ticketCloseAt ? new Date(evt.ticketCloseAt).getTime() : null;
  const closed = Boolean(closeAt && Date.now() > closeAt);
  const soldOut = capacity > 0 && sold >= capacity;
  let urgency = '';
  if (!closed && !soldOut && closeAt) {
    const hours = (closeAt - Date.now()) / 36e5;
    if (hours > 0 && hours <= 72) {
      urgency = hours < 1
        ? 'Sales close in under an hour'
        : hours < 24
          ? `Sales close in ${Math.ceil(hours)}h`
          : `Sales close in ${Math.ceil(hours / 24)} days`;
    }
  }
  return { sold, capacity, closed, soldOut, urgency, spotsLeft: Math.max(0, capacity - sold) };
}

function eventEarnings(evt) {
  return tickets
    .filter(ticket => ticket.eventId === evt.id && ticket.kind === 'ticket')
    .reduce((sum, ticket) => sum + (Number(ticket.amount) || 0), 0);
}

function isCurrentEvent(evt) {
  const when = new Date(evt.date).getTime();
  return !when || when >= Date.now();
}

function ensureSeedSales() {
  const specs = [
    { eventId: 'evt-ng-101', count: 86, amount: 17000, currency: '₦' },
    { eventId: 'evt-ng-102', count: 41, amount: 45, currency: '$' },
    { eventId: 'evt-ng-103', count: 120, amount: 5000, currency: '₦' },
    { eventId: 'evt-ng-105', count: 28, amount: 2800, currency: '₦' },
    { eventId: 'evt-ng-107', count: 210, amount: 8000, currency: '₦' },
    { eventId: 'evt-ng-108', count: 40, amount: 15000, currency: '₦' }
  ];
  let changed = false;
  specs.forEach(spec => {
    const already = tickets.some(ticket => ticket.eventId === spec.eventId && ticket.kind === 'ticket');
    if (already) return;
    for (let i = 0; i < spec.count; i += 1) {
      tickets.push({
        id: `seed-${spec.eventId}-${i}`,
        eventId: spec.eventId,
        kind: 'ticket',
        buyerName: 'Attendee',
        buyerEmail: 'guest@citypulse.ng',
        reference: `SEED-${spec.eventId}-${i}`,
        amount: spec.amount,
        currency: spec.currency,
        createdAt: Date.now() - i * 3600000
      });
    }
    changed = true;
  });
  if (changed) saveTickets();
}

function isFreeEvent(evt) {
  return !evt || evt.admission === 'free';
}

function isEventOwner(evt) {
  if (!currentAdminUser || isSharedLinkView || !evt) return false;
  return (evt.hostEmail || '').toLowerCase() === currentAdminUser.email.toLowerCase();
}

function hostedEventCount(email) {
  const target = (email || '').toLowerCase();
  return events.filter(evt => (evt.hostEmail || '').toLowerCase() === target).length;
}

function currentPlan() {
  return currentAdminUser && currentAdminUser.plan === 'premium' ? 'premium' : 'free';
}

/* ── Storage Functions ────────────────────────────────────────────────────── */
function loadData() {
  // 1. Events
  const savedEvents = localStorage.getItem(STORAGE_EVENTS_KEY);
  if (savedEvents) {
    try {
      events = JSON.parse(savedEvents).map(normalizeEvent);
    } catch (e) {
      events = defaultNigerianEvents.map(normalizeEvent);
      saveEvents();
    }
  } else {
    events = defaultNigerianEvents.map(normalizeEvent);
    saveEvents();
  }

  // 2. User Recommendations
  const savedRecs = localStorage.getItem(STORAGE_USER_RECS_KEY);
  if (savedRecs) {
    try {
      userRecommendations = new Set(JSON.parse(savedRecs));
    } catch (e) {
      userRecommendations = new Set();
    }
  }

  // 3. User Ratings
  const savedRatings = localStorage.getItem(STORAGE_USER_RATINGS_KEY);
  if (savedRatings) {
    try {
      userRatings = JSON.parse(savedRatings);
    } catch (e) {
      userRatings = {};
    }
  }

  // 4. Comments & Reviews
  const savedComments = localStorage.getItem(STORAGE_EVENT_COMMENTS_KEY);
  if (savedComments) {
    try {
      eventComments = JSON.parse(savedComments);
    } catch (e) {
      eventComments = { ...defaultComments };
      saveComments();
    }
  } else {
    eventComments = { ...defaultComments };
    saveComments();
  }

  // 4b. Tickets and free RSVPs
  const savedTickets = localStorage.getItem(STORAGE_TICKETS_KEY);
  if (savedTickets) {
    try {
      tickets = JSON.parse(savedTickets);
    } catch (e) {
      tickets = [];
    }
  }
  ensureSeedSales();

  // 5. Admin Accounts
  const savedAccounts = localStorage.getItem(STORAGE_ADMIN_ACCOUNTS_KEY);
  if (!savedAccounts) {
    localStorage.setItem(STORAGE_ADMIN_ACCOUNTS_KEY, JSON.stringify([defaultAdminAccount]));
  }

  // 6. Admin Session (Only if not explicitly on a shared attendee link)
  if (!isSharedLinkView) {
    const savedSession = localStorage.getItem(STORAGE_ADMIN_SESSION_KEY);
    if (savedSession) {
      try {
        currentAdminUser = JSON.parse(savedSession);
        if (currentAdminUser) pageView = 'studio';
      } catch (e) {
        currentAdminUser = null;
      }
    }
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
}

function saveUserRecs() {
  localStorage.setItem(STORAGE_USER_RECS_KEY, JSON.stringify(Array.from(userRecommendations)));
}

function saveUserRatings() {
  localStorage.setItem(STORAGE_USER_RATINGS_KEY, JSON.stringify(userRatings));
}

function saveComments() {
  localStorage.setItem(STORAGE_EVENT_COMMENTS_KEY, JSON.stringify(eventComments));
}

function saveTickets() {
  localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
}

function getAdminAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(STORAGE_ADMIN_ACCOUNTS_KEY)) || [defaultAdminAccount];
    return accounts.map(acc => ({
      ...acc,
      plan: acc.plan === 'premium' ? 'premium' : 'free'
    }));
  } catch (e) {
    return [{ ...defaultAdminAccount }];
  }
}

function saveAdminAccounts(accounts) {
  localStorage.setItem(STORAGE_ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
}

/* ── Admin Authentication Controller ──────────────────────────────────────── */
function updateAuthUI() {
  const signedIn = Boolean(currentAdminUser) && !isSharedLinkView;

  if (signedIn) {
    publicHostCta.style.display = 'none';
    adminControls.style.display = 'flex';
    adminBanner.style.display = 'block';
    footerHostCta.hidden = true;
    footerSignedIn.hidden = false;

    const plan = currentPlan();
    const used = hostedEventCount(currentAdminUser.email);
    adminNameDisplay.textContent = currentAdminUser.name || 'Host';
    adminPlanLabel.textContent = plan === 'premium' ? 'Premium host' : 'Free host';
    upgradePlanBtn.style.display = plan === 'premium' ? 'none' : 'inline-flex';

    if (plan === 'premium') {
      adminPlanSummary.innerHTML = `Signed in as <strong>${escapeHtml(currentAdminUser.email)}</strong>. Premium host — you can post unlimited events. Your host name on listings is <strong>${escapeHtml(currentAdminUser.name)}</strong>.`;
      footerSignedIn.textContent = `Hosting as ${currentAdminUser.name} · Premium`;
    } else {
      adminPlanSummary.innerHTML = `Signed in as <strong>${escapeHtml(currentAdminUser.email)}</strong>. Free plan: ${used} of ${FREE_EVENT_LIMIT} events posted. Upgrade with a Paystack test payment to remove the limit. Your host name on listings is <strong>${escapeHtml(currentAdminUser.name)}</strong>.`;
      footerSignedIn.textContent = `Hosting as ${currentAdminUser.name} · Free ${used}/${FREE_EVENT_LIMIT}`;
    }

    const initials = (currentAdminUser.name || 'Host')
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    adminAvatarText.textContent = initials;
  } else {
    publicHostCta.style.display = 'flex';
    adminControls.style.display = 'none';
    adminBanner.style.display = 'none';
    footerHostCta.hidden = false;
    footerSignedIn.hidden = true;
  }
}

function loginAdmin(email, password) {
  const accounts = getAdminAccounts();
  const matched = accounts.find(
    acc => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
  );

  if (matched) {
    isSharedLinkView = false; // exit forced public mode
    currentAdminUser = {
      name: matched.name,
      email: matched.email,
      city: matched.city,
      plan: matched.plan === 'premium' ? 'premium' : 'free'
    };
    localStorage.setItem(STORAGE_ADMIN_SESSION_KEY, JSON.stringify(currentAdminUser));
    pageView = 'studio';
    updateAuthUI();
    closeAuthModal();
    showToast(`Welcome, ${matched.name}! Admin Studio unlocked.`, 'verified_user');
    render();
    return true;
  } else {
    showToast('Invalid email or password. Please try again.', 'error');
    return false;
  }
}

function startHostSession(account) {
  pageView = 'studio';
  isSharedLinkView = false;
  currentAdminUser = {
    name: account.name,
    email: account.email,
    city: account.city,
    plan: account.plan === 'premium' ? 'premium' : 'free'
  };
  localStorage.setItem(STORAGE_ADMIN_SESSION_KEY, JSON.stringify(currentAdminUser));
  updateAuthUI();
  render();
}

function registerAdmin(name, email, password, city, plan) {
  const accounts = getAdminAccounts();
  const cleanEmail = email.trim();
  const exists = accounts.some(acc => acc.email.toLowerCase() === cleanEmail.toLowerCase());

  if (exists) {
    showToast('A host account with this email already exists. Sign in instead.', 'warning');
    return false;
  }

  if (plan === 'premium') {
    pendingSignup = { name, email: cleanEmail, password, city, plan: 'premium' };
    closeAuthModal();
    openCheckout({
      purpose: 'premium-signup',
      title: 'Upgrade to Premium',
      summary: 'Test payment of ₦5,000 unlocks unlimited event posts. Paystack test mode does not charge a real card.',
      amount: PREMIUM_PRICE_NGN,
      currency: '₦',
      name,
      email: cleanEmail,
      buttonLabel: 'Pay ₦5,000 with Paystack (test)'
    });
    return true;
  }

  const newAccount = { name, email: cleanEmail, password, city, plan: 'free' };
  accounts.push(newAccount);
  saveAdminAccounts(accounts);
  startHostSession(newAccount);
  closeAuthModal();
  showToast(`Welcome, ${name}. Free plan: post up to ${FREE_EVENT_LIMIT} events.`, 'how_to_reg');
  return true;
}

function logoutAdmin() {
  pageView = 'discover';
  currentAdminUser = null;
  localStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
  updateAuthUI();
  showToast('Signed out of Admin Studio. Returned to Public Attendee View.', 'logout');
  render();
}

/* ── Share Public Link Generator ─────────────────────────────────────────── */
function openShareModal() {
  // Always append view=public so the recipient enters the attendee mode!
  let baseUrl = window.location.href.split('?')[0];
  let publicUrl = `${baseUrl}?view=public`;
  
  if (selectedCity !== 'all') {
    publicUrl += `&city=${encodeURIComponent(selectedCity)}`;
  }

  shareLinkInput.value = publicUrl;

  const shareText = encodeURIComponent(
    `Check out live events happening in Nigerian cities on CityPulse! Browse, recommend, and leave comments: ${publicUrl}`
  );

  shareWhatsAppBtn.href = `https://api.whatsapp.com/send?text=${shareText}`;
  shareTwitterBtn.href = `https://twitter.com/intent/tweet?text=${shareText}`;

  shareModal.classList.add('open');
  shareModal.setAttribute('aria-hidden', 'false');
}

function copyShareLink() {
  const link = shareLinkInput.value;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).then(() => {
      showToast('Attendee public link copied to clipboard!', 'content_copy');
    }).catch(() => {
      fallbackCopy(link);
    });
  } else {
    fallbackCopy(link);
  }
}

function fallbackCopy(text) {
  shareLinkInput.select();
  document.execCommand('copy');
  showToast('Attendee public link copied to clipboard!', 'content_copy');
}

/* ── Dynamic City Dropdown Sync ───────────────────────────────────────────── */
function syncCityDropdownOptions() {
  const predefinedCities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu', 'Benin City', 'Kano', 'Calabar', 'Asaba'];
  const eventCities = events.map(e => e.city).filter(Boolean);
  const allCities = Array.from(new Set([...predefinedCities, ...eventCities])).sort();

  const currentNav = navCitySelect.value;
  navCitySelect.innerHTML = `<option value="all">🇳🇬 All Nigerian Cities</option>`;
  allCities.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = `📍 ${city}`;
    navCitySelect.appendChild(opt);
  });
  if (allCities.includes(currentNav)) {
    navCitySelect.value = currentNav;
  }
}

/* ── Filtering & Sorting Logic ────────────────────────────────────────────── */
function getFilteredEvents() {
  const query = searchKeyword.trim().toLowerCase();

  return events.filter(evt => {
    // City filter
    if (selectedCity !== 'all' && evt.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && evt.category !== selectedCategory) {
      return false;
    }

    if (selectedAdmission !== 'all' && (evt.admission || 'paid') !== selectedAdmission) {
      return false;
    }

    if (selectedCurrency !== 'all') {
      if (isFreeEvent(evt) || evt.currency !== selectedCurrency) return false;
    }

    // Minimum rating filter
    if (minRatingFilter > 0 && (evt.rating || 0) < minRatingFilter) {
      return false;
    }

    // Search query matching
    if (query) {
      const matchName = evt.name.toLowerCase().includes(query);
      const matchDesc = (evt.description || '').toLowerCase().includes(query);
      const matchVenue = (evt.venue || '').toLowerCase().includes(query);
      const matchCity = (evt.city || '').toLowerCase().includes(query);
      const matchHost = (evt.hostName || '').toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchVenue && !matchCity && !matchHost) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'recommended') {
      return (b.recommendations || 0) - (a.recommendations || 0);
    }
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'comments') {
      const cA = (eventComments[a.id] || []).length;
      const cB = (eventComments[b.id] || []).length;
      return cB - cA;
    }
    if (sortBy === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'price-asc') {
      return (a.priceVal || 0) - (b.priceVal || 0);
    }
    if (sortBy === 'newest') {
      return (b.createdAt || 0) - (a.createdAt || 0);
    }
    return 0;
  });
}

function sumEarnings(list, currency) {
  return list
    .filter(evt => !isFreeEvent(evt) && evt.currency === currency)
    .reduce((sum, evt) => sum + eventEarnings(evt), 0);
}

function applyPageView() {
  const host = Boolean(currentAdminUser) && !isSharedLinkView;
  const studio = host && pageView === 'studio';
  document.body.classList.toggle('host-mode', host);
  document.body.classList.toggle('studio-open', studio);
  if (hostStudio) hostStudio.hidden = !studio;
  if (discoverView) discoverView.hidden = studio;
  if (myStudioBtn) myStudioBtn.style.display = host && !studio ? 'inline-flex' : 'none';
  if (viewAllEventsBtn) viewAllEventsBtn.style.display = studio ? 'inline-flex' : 'none';
  if (brandBadge) brandBadge.textContent = studio ? 'Host studio' : 'Nigerian Events Hub';
}

function renderHostStudio() {
  if (!hostStudio || !currentAdminUser) return;
  const mine = events.filter(evt => (evt.hostEmail || '').toLowerCase() === currentAdminUser.email.toLowerCase());
  const visible = mine.filter(evt => {
    if (studioWhen === 'current') return isCurrentEvent(evt);
    if (studioWhen === 'past') return !isCurrentEvent(evt);
    return true;
  }).sort((a, b) => {
    if (studioSort === 'reviews') {
      return (eventComments[b.id] || []).length - (eventComments[a.id] || []).length;
    }
    if (studioSort === 'recommended') return (b.recommendations || 0) - (a.recommendations || 0);
    if (studioSort === 'earnings') return eventEarnings(b) - eventEarnings(a);
    if (studioSort === 'closing') {
      return new Date(a.ticketCloseAt || a.date).getTime() - new Date(b.ticketCloseAt || b.date).getTime();
    }
    return spotsTaken(b) - spotsTaken(a);
  });

  const currentEvents = mine.filter(isCurrentEvent);
  const pastEvents = mine.filter(evt => !isCurrentEvent(evt));
  const ticketsSold = mine.reduce((sum, evt) => sum + (isFreeEvent(evt) ? 0 : spotsTaken(evt)), 0);
  const recs = mine.reduce((sum, evt) => sum + (evt.recommendations || 0), 0);

  const rows = visible.length === 0
    ? `<div class="studio-empty">You have no events in this view yet. Post one and it will show here first.</div>`
    : visible.map(evt => {
      const state = salesState(evt);
      const reviews = (eventComments[evt.id] || []).length;
      const status = state.soldOut ? 'Sold out' : state.closed ? 'Sales closed' : state.urgency || (isCurrentEvent(evt) ? 'On sale' : 'Past event');
      const earned = isFreeEvent(evt) ? 'Free event' : formatMoneyAmount(evt.currency, eventEarnings(evt));
      return `
        <article class="studio-row">
          <div>
            <h3>${escapeHtml(evt.name)}</h3>
            <p>${escapeHtml(evt.city)} · ${escapeHtml(formatEventDate(evt.date))} · ${escapeHtml(status)}</p>
          </div>
          <div class="studio-stats">
            <span><strong>${state.sold}</strong> / ${state.capacity} tickets</span>
            <span><strong>${evt.recommendations || 0}</strong> recommends</span>
            <span><strong>${reviews}</strong> reviews</span>
            <span><strong>${earned}</strong></span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="openDetailModal('${evt.id}')">Reviews</button>
        </article>
      `;
    }).join('');

  const providers = Object.values(events.reduce((map, evt) => {
    const key = (evt.hostEmail || evt.hostName || 'host').toLowerCase();
    if (!map[key]) {
      map[key] = { name: evt.hostName || 'Host', email: evt.hostEmail || '', events: 0, tickets: 0, recs: 0, reviews: 0, naira: 0, dollar: 0, ratingSum: 0 };
    }
    const row = map[key];
    row.events += 1;
    row.tickets += spotsTaken(evt);
    row.recs += evt.recommendations || 0;
    row.reviews += (eventComments[evt.id] || []).length;
    row.ratingSum += evt.rating || 0;
    if (!isFreeEvent(evt) && evt.currency === '$') row.dollar += eventEarnings(evt);
    if (!isFreeEvent(evt) && evt.currency !== '$') row.naira += eventEarnings(evt);
    return map;
  }, {})).sort((a, b) => (b.naira + b.dollar) - (a.naira + a.dollar));

  hostStudio.innerHTML = `
    <div class="studio-hero">
      <p class="studio-kicker">Host studio</p>
      <h1>Your events, ${escapeHtml(currentAdminUser.name)}</h1>
      <p>Your posts come first. Check reviews, recommendations, tickets sold, and what each event has earned.</p>
      <button type="button" class="btn btn-primary" id="studioViewAllBtn">View all events</button>
    </div>
    <div class="studio-metrics">
      <article><span>Current events · ₦</span><strong>${formatMoneyAmount('₦', sumEarnings(currentEvents, '₦'))}</strong></article>
      <article><span>Previous events · ₦</span><strong>${formatMoneyAmount('₦', sumEarnings(pastEvents, '₦'))}</strong></article>
      <article><span>Current events · $</span><strong>${formatMoneyAmount('$', sumEarnings(currentEvents, '$'))}</strong></article>
      <article><span>Previous events · $</span><strong>${formatMoneyAmount('$', sumEarnings(pastEvents, '$'))}</strong></article>
      <article><span>Tickets sold</span><strong>${ticketsSold.toLocaleString()}</strong></article>
      <article><span>Recommendations</span><strong>${recs.toLocaleString()}</strong></article>
    </div>
    <div class="studio-toolbar">
      <h2>My events (${mine.length})</h2>
      <label>When
        <select id="studioWhenSelect">
          <option value="all" ${studioWhen === 'all' ? 'selected' : ''}>All mine</option>
          <option value="current" ${studioWhen === 'current' ? 'selected' : ''}>Current</option>
          <option value="past" ${studioWhen === 'past' ? 'selected' : ''}>Previous</option>
        </select>
      </label>
      <label>Pulling the most
        <select id="studioSortSelect">
          <option value="tickets" ${studioSort === 'tickets' ? 'selected' : ''}>Tickets sold</option>
          <option value="recommended" ${studioSort === 'recommended' ? 'selected' : ''}>Recommendations</option>
          <option value="reviews" ${studioSort === 'reviews' ? 'selected' : ''}>Reviews</option>
          <option value="earnings" ${studioSort === 'earnings' ? 'selected' : ''}>Money earned</option>
          <option value="closing" ${studioSort === 'closing' ? 'selected' : ''}>Closing soon</option>
        </select>
      </label>
    </div>
    <div class="studio-list">${rows}</div>
    <section class="provider-board">
      <h2>Event providers</h2>
      <p>How every host on CityPulse is doing.</p>
      <div class="provider-table">
        ${providers.map(provider => `
          <button type="button" class="provider-row" onclick="viewProvider(decodeURIComponent('${encodeURIComponent(provider.name)}'))">
            <strong>${escapeHtml(provider.name)}</strong>
            <span>${provider.events} events</span>
            <span>${provider.tickets} tickets</span>
            <span>${provider.recs} recommends</span>
            <span>${provider.reviews} reviews</span>
            <span>${formatMoneyAmount('₦', provider.naira)} · ${formatMoneyAmount('$', provider.dollar)}</span>
          </button>
        `).join('')}
      </div>
    </section>
  `;

  const whenSelect = document.getElementById('studioWhenSelect');
  const sortSelectEl = document.getElementById('studioSortSelect');
  const viewAll = document.getElementById('studioViewAllBtn');
  if (whenSelect) whenSelect.onchange = () => { studioWhen = whenSelect.value; render(); };
  if (sortSelectEl) sortSelectEl.onchange = () => { studioSort = sortSelectEl.value; render(); };
  if (viewAll) viewAll.onclick = () => { pageView = 'discover'; render(); };
}

window.viewProvider = function(name) {
  pageView = 'discover';
  searchKeyword = name;
  if (globalSearchInput) {
    globalSearchInput.value = name;
    clearSearchBtn.style.display = 'flex';
  }
  render();
};

/* ── Main Render ──────────────────────────────────────────────────────────── */
function render() {
  applyPageView();
  if (hostStudio && !hostStudio.hidden) renderHostStudio();

  const filtered = getFilteredEvents();

  // Update Hero & Section Headings
  activeCityLabel.textContent = selectedCity === 'all' 
    ? 'Happening Across Nigeria' 
    : `Happening in ${selectedCity}, Nigeria`;

  eventsCountHeading.textContent = `Live Events (${filtered.length})`;

  // Subtitle info
  let statusParts = [];
  if (selectedCity !== 'all') statusParts.push(`City: ${selectedCity}`);
  if (selectedCategory !== 'all') statusParts.push(`Category: ${selectedCategory}`);
  if (selectedAdmission === 'free') statusParts.push('Free events');
  if (selectedAdmission === 'paid') statusParts.push('Ticketed events');
  if (selectedCurrency !== 'all') statusParts.push(selectedCurrency === '$' ? 'Dollar tickets' : 'Naira tickets');
  if (minRatingFilter > 0) statusParts.push(`Rating: ${minRatingFilter}+★`);
  if (searchKeyword.trim()) statusParts.push(`Search: "${searchKeyword.trim()}"`);

  filterStatusText.textContent = statusParts.length > 0 
    ? `Filtered by: ${statusParts.join(' • ')}` 
    : 'Showing all available Nigerian city listings';

  // Metrics update
  const totalRecs = events.reduce((sum, e) => sum + (e.recommendations || 0), 0);
  const avgRating = events.length > 0 
    ? (events.reduce((sum, e) => sum + (e.rating || 0), 0) / events.length).toFixed(1)
    : '0.0';

  totalRecommendationsCount.textContent = totalRecs.toLocaleString();
  avgRatingDisplay.textContent = avgRating;

  // Empty State Check
  if (filtered.length === 0) {
    eventsGrid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  eventsGrid.innerHTML = filtered.map(evt => {
    const isRecommended = userRecommendations.has(evt.id);
    const formattedDate = formatEventDate(evt.date);
    const starString = renderStars(evt.rating || 0);
    const commentsList = eventComments[evt.id] || [];
    const canManage = isEventOwner(evt);
    const state = salesState(evt);
    const off = Number(evt.discountPercent) || 0;
    const priceHtml = isFreeEvent(evt)
      ? `<span class="badge-price is-free">Free</span>`
      : `${off ? `<span class="price-was">${escapeHtml(formatMoneyAmount(evt.currency, evt.listPriceVal))}</span>` : ''}<span class="badge-price">${escapeHtml(evt.price)}</span>`;
    const flag = state.soldOut
      ? `<span class="badge-soldout">Sold out</span>`
      : state.closed
        ? `<span class="badge-soldout">Sales closed</span>`
        : state.urgency
          ? `<span class="badge-urgency">${escapeHtml(state.urgency)}</span>`
          : '';

    return `
      <article class="event-card" data-id="${evt.id}">
        <!-- Media / Cover Image -->
        <div class="card-media" onclick="openDetailModal('${evt.id}')">
          <img src="${escapeHtml(evt.image)}" alt="${escapeHtml(evt.name)}" loading="lazy" onerror="this.src='${IMAGE_PRESETS.concert}'">
          <span class="badge-category">${escapeHtml(evt.category)}</span>
          ${off ? `<span class="badge-discount">-${off}%</span>` : ''}
          ${flag}
          ${priceHtml}
        </div>

        <!-- Body -->
        <div class="card-body" onclick="openDetailModal('${evt.id}')">
          <div class="card-location-meta">
            <span class="card-city">
              <span class="material-symbols-outlined" style="font-size:16px;">location_on</span>
              ${escapeHtml(evt.city)}, Nigeria
            </span>
            <span class="card-date-badge">
              <span class="material-symbols-outlined" style="font-size:16px;">calendar_today</span>
              ${formattedDate}
            </span>
          </div>

          <h3 class="card-title">${escapeHtml(evt.name)}</h3>
          <p class="card-host">
            <span class="material-symbols-outlined">person</span>
            Hosted by ${escapeHtml(evt.hostName || 'CityPulse')}
          </p>
          <p class="card-desc">${escapeHtml(evt.description)}</p>

          <div class="card-rating-row">
            <span class="stars-container" aria-label="${evt.rating} stars">${starString}</span>
            <span class="rating-score">${(evt.rating || 0).toFixed(1)}</span>
            <span class="rating-count">(${evt.ratingCount || 0} reviews)</span>
            <span class="card-comments-count">
              <span class="material-symbols-outlined" style="font-size:15px;">chat_bubble_outline</span>
              ${commentsList.length}
            </span>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="card-footer">
          <!-- Recommend Button -->
          <button 
            type="button" 
            class="recommend-btn ${isRecommended ? 'recommended' : ''}" 
            onclick="toggleRecommendation(event, '${evt.id}')"
            title="${isRecommended ? 'You recommended this' : 'Click to recommend this event'}"
          >
            <span class="heart-icon">${isRecommended ? '❤️' : '🤍'}</span>
            <span>Recommend</span>
            <strong>(${evt.recommendations || 0})</strong>
          </button>

          <!-- Action Group -->
          <div class="card-action-group">
            <!-- Rate button (Public & Attendee feature) -->
            <button 
              type="button" 
              class="icon-action-btn" 
              onclick="openRatingDialog(event, '${evt.id}')" 
              title="Rate this event"
            >
              <span class="material-symbols-outlined" style="font-size:18px;">star_rate</span>
            </button>

            <!-- Drop comment shortcut button -->
            <button 
              type="button" 
              class="icon-action-btn" 
              onclick="openDetailModal('${evt.id}', true)" 
              title="View & drop comments"
            >
              <span class="material-symbols-outlined" style="font-size:18px;">mode_comment</span>
            </button>

            ${canManage ? `
              <button 
                type="button" 
                class="icon-action-btn" 
                onclick="openEditModal(event, '${evt.id}')" 
                title="Edit Event (Admin Only)"
              >
                <span class="material-symbols-outlined" style="font-size:18px;">edit</span>
              </button>
              <button 
                type="button" 
                class="icon-action-btn delete-btn" 
                onclick="openDeleteConfirm(event, '${evt.id}')" 
                title="Delete Event (Admin Only)"
              >
                <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
              </button>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ── Recommendations (Like / Upvote) ──────────────────────────────────────── */
window.toggleRecommendation = function(event, id) {
  event.stopPropagation();
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  if (userRecommendations.has(id)) {
    userRecommendations.delete(id);
    evt.recommendations = Math.max(0, (evt.recommendations || 0) - 1);
    showToast(`Removed recommendation for "${evt.name}"`, 'heart_minus');
  } else {
    userRecommendations.add(id);
    evt.recommendations = (evt.recommendations || 0) + 1;
    showToast(`You recommended "${evt.name}"!`, 'favorite');
  }

  saveEvents();
  saveUserRecs();
  render();
};

/* ── Interactive 5-Star Rating Modal ─────────────────────────────────────── */
let tempRatingSelection = 0;

window.openRatingDialog = function(event, id) {
  if (event) event.stopPropagation();
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  activeEventForRating = evt;
  ratingEventTitle.textContent = `Rate "${evt.name}"`;
  
  tempRatingSelection = userRatings[id] || 0;
  updateStarSelectorUI(tempRatingSelection);

  ratingModal.classList.add('open');
  ratingModal.setAttribute('aria-hidden', 'false');
};

function updateStarSelectorUI(rating) {
  const stars = starRatingSelector.querySelectorAll('.star-btn');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });

  const ratingLabels = [
    'Select 1 to 5 stars',
    '1 Star — Poor Experience',
    '2 Stars — Fair',
    '3 Stars — Good Vibe',
    '4 Stars — Great Event!',
    '5 Stars — Absolute Must-Attend!'
  ];

  starRatingFeedback.textContent = ratingLabels[rating] || 'Select 1 to 5 stars';
  submitRatingBtn.disabled = rating === 0;
}

function closeRatingDialog() {
  ratingModal.classList.remove('open');
  ratingModal.setAttribute('aria-hidden', 'true');
  activeEventForRating = null;
  tempRatingSelection = 0;
}

function submitRating() {
  if (!activeEventForRating || tempRatingSelection === 0) return;

  const evt = activeEventForRating;
  const previousRating = userRatings[evt.id];

  if (previousRating) {
    const totalScore = (evt.rating * evt.ratingCount) - previousRating + tempRatingSelection;
    evt.rating = parseFloat((totalScore / evt.ratingCount).toFixed(1));
  } else {
    const totalScore = ((evt.rating || 0) * (evt.ratingCount || 0)) + tempRatingSelection;
    evt.ratingCount = (evt.ratingCount || 0) + 1;
    evt.rating = parseFloat((totalScore / evt.ratingCount).toFixed(1));
  }

  userRatings[evt.id] = tempRatingSelection;
  saveEvents();
  saveUserRatings();

  showToast(`Thanks! Your ${tempRatingSelection}★ rating was submitted.`, 'star');
  closeRatingDialog();
  render();
}

/* ── Event Detail Modal with Attendee Comments ────────────────────────────── */
window.openDetailModal = function(id, focusComments = false) {
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  activeEventForDetail = evt;
  const isRecommended = userRecommendations.has(evt.id);
  const formattedDate = formatFullDate(evt.date);
  const comments = eventComments[evt.id] || [];

  detailModalBody.innerHTML = `
    <div class="detail-cover">
      <img src="${escapeHtml(evt.image)}" alt="${escapeHtml(evt.name)}" onerror="this.src='${IMAGE_PRESETS.concert}'">
      <div class="detail-cover-overlay">
        <div class="detail-badges">
          <span class="badge-category">${escapeHtml(evt.category)}</span>
          <span class="badge-price ${isFreeEvent(evt) ? 'is-free' : ''}">${escapeHtml(isFreeEvent(evt) ? 'Free' : evt.price)}</span>
          ${Number(evt.discountPercent) ? `<span class="badge-discount">-${evt.discountPercent}%</span>` : ''}
        </div>
      </div>
    </div>

    <div class="detail-content">
      <h2 class="detail-title">${escapeHtml(evt.name)}</h2>

      <div class="detail-meta-grid">
        <div class="detail-meta-item">
          <div class="detail-meta-icon">
            <span class="material-symbols-outlined">location_on</span>
          </div>
          <div>
            <div class="detail-meta-label">Nigerian City & Venue</div>
            <div class="detail-meta-val">${escapeHtml(evt.city)} — ${escapeHtml(evt.venue)}</div>
          </div>
        </div>

        <div class="detail-meta-item">
          <div class="detail-meta-icon">
            <span class="material-symbols-outlined">schedule</span>
          </div>
          <div>
            <div class="detail-meta-label">Date & Time</div>
            <div class="detail-meta-val">${formattedDate}</div>
          </div>
        </div>

        <div class="detail-meta-item">
          <div class="detail-meta-icon">
            <span class="material-symbols-outlined">star</span>
          </div>
          <div>
            <div class="detail-meta-label">Community Rating</div>
            <div class="detail-meta-val">${(evt.rating || 0).toFixed(1)} / 5.0 (${evt.ratingCount || 0} reviews)</div>
          </div>
        </div>

        <div class="detail-meta-item">
          <div class="detail-meta-icon">
            <span class="material-symbols-outlined">favorite</span>
          </div>
          <div>
            <div class="detail-meta-label">Attendee Recommendations</div>
            <div class="detail-meta-val">${evt.recommendations || 0} People Recommend</div>
          </div>
        </div>

        <div class="detail-meta-item">
          <div class="detail-meta-icon">
            <span class="material-symbols-outlined">person</span>
          </div>
          <div>
            <div class="detail-meta-label">Host</div>
            <div class="detail-meta-val">${escapeHtml(evt.hostName || 'CityPulse')}</div>
          </div>
        </div>
      </div>

      ${renderTicketAction(evt)}

      <div class="detail-desc-block">
        <h4>About this Event</h4>
        <p>${escapeHtml(evt.description)}</p>
      </div>

      <!-- Quick Attendee Actions -->
      <div class="modal-actions mt-2" style="justify-content: flex-start; flex-wrap: wrap;">
        <button 
          type="button" 
          class="recommend-btn ${isRecommended ? 'recommended' : ''}" 
          onclick="toggleRecommendation(event, '${evt.id}')"
        >
          <span class="heart-icon">${isRecommended ? '❤️' : '🤍'}</span>
          <span>Recommend Event (${evt.recommendations || 0})</span>
        </button>

        <button type="button" class="btn btn-secondary" onclick="openRatingDialog(event, '${evt.id}')">
          <span class="material-symbols-outlined">star_rate</span>
          <span>Rate Event</span>
        </button>
      </div>

      <!-- ── ATTENDEE COMMENTS & REVIEWS SECTION ── -->
      <section class="comments-section" id="commentsSection">
        <div class="comments-header">
          <h3 class="comments-title">
            <span class="material-symbols-outlined">forum</span>
            Attendee Reviews & Discussion (${comments.length})
          </h3>
        </div>

        <!-- Drop a Comment Form (Accessible to all attendees) -->
        <div class="comment-form-card">
          <form id="commentSubmitForm" onsubmit="handleCommentSubmit(event, '${evt.id}')">
            <div class="comment-form-row">
              <input 
                type="text" 
                id="commentAuthorName" 
                class="comment-name-input" 
                placeholder="Your Name (e.g. Tunde, Chidinma, Aminu)" 
                required
              >
              <!-- Star rating picker for comment -->
              <div class="comment-rating-picker" id="commentRatingPicker" title="Rate this event with your comment">
                <span class="c-star active" data-v="1" onclick="setCommentRating(1)">★</span>
                <span class="c-star active" data-v="2" onclick="setCommentRating(2)">★</span>
                <span class="c-star active" data-v="3" onclick="setCommentRating(3)">★</span>
                <span class="c-star active" data-v="4" onclick="setCommentRating(4)">★</span>
                <span class="c-star active" data-v="5" onclick="setCommentRating(5)">★</span>
              </div>
            </div>

            <textarea 
              id="commentTextContent" 
              class="comment-textarea" 
              placeholder="Drop a comment, share your tips, or review this event..." 
              required
            ></textarea>

            <button type="submit" class="btn btn-primary btn-sm">
              <span class="material-symbols-outlined" style="font-size:16px;">send</span>
              <span>Post Comment</span>
            </button>
          </form>
        </div>

        <!-- Comments List -->
        <div class="comments-list" id="commentsListContainer">
          ${renderCommentsList(comments)}
        </div>
      </section>
    </div>
  `;

  eventDetailModal.classList.add('open');
  eventDetailModal.setAttribute('aria-hidden', 'false');

  if (focusComments) {
    setTimeout(() => {
      const commentInput = document.getElementById('commentAuthorName');
      if (commentInput) {
        commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        commentInput.focus();
      }
    }, 200);
  }
};

function findTicket(eventId) {
  return tickets.find(ticket => ticket.eventId === eventId) || null;
}

function renderTicketAction(evt) {
  const state = salesState(evt);
  const note = `
    <p class="sales-note">
      ${state.sold} of ${state.capacity} spots taken
      ${state.urgency ? ` · ${escapeHtml(state.urgency)}` : ''}
      ${evt.ticketCloseAt ? ` · Sales close ${escapeHtml(formatFullDate(evt.ticketCloseAt))}` : ''}
    </p>
  `;
  const existing = findTicket(evt.id);
  if (existing) {
    const label = existing.kind === 'rsvp' ? 'You are going' : 'Ticket saved';
    return `
      <div class="ticket-status">
        <span class="material-symbols-outlined">verified</span>
        <div>
          <strong>${label}</strong>
          <p>${escapeHtml(existing.buyerName)} · ${escapeHtml(existing.reference)}</p>
        </div>
      </div>
      ${note}
    `;
  }

  if (state.soldOut) {
    return `${note}<div class="ticket-status is-closed"><strong>Sold out</strong><p>No spots left. The host can release more tickets.</p></div>`;
  }
  if (state.closed) {
    return `${note}<div class="ticket-status is-closed"><strong>Sales closed</strong><p>The deadline to get a ticket has passed.</p></div>`;
  }

  if (isFreeEvent(evt)) {
    return `
      ${note}
      <button type="button" class="btn btn-primary" onclick="reserveFreeSpot('${evt.id}')">
        <span class="material-symbols-outlined">event_available</span>
        <span>RSVP — it's free · ${state.spotsLeft} left</span>
      </button>
    `;
  }

  const was = Number(evt.discountPercent)
    ? `<span class="price-was">${escapeHtml(formatMoneyAmount(evt.currency, evt.listPriceVal))}</span> `
    : '';
  return `
    ${note}
    <button type="button" class="btn btn-primary" onclick="openTicketCheckout('${evt.id}')">
      <span class="material-symbols-outlined">confirmation_number</span>
      <span>Get ticket · ${was}${escapeHtml(evt.price)} · ${state.spotsLeft} left</span>
    </button>
  `;
}

function renderCommentsList(comments) {
  if (!comments || comments.length === 0) {
    return `<div class="empty-comments-box">Be the first attendee to drop a comment or review for this event!</div>`;
  }

  return comments.map(c => {
    const starString = '★'.repeat(c.rating || 5) + '☆'.repeat(5 - (c.rating || 5));
    const initial = (c.name || 'A').charAt(0).toUpperCase();

    return `
      <div class="comment-item">
        <div class="comment-avatar">${escapeHtml(initial)}</div>
        <div class="comment-body">
          <div class="comment-author-row">
            <span class="comment-author-name">${escapeHtml(c.name)}</span>
            <div class="comment-meta">
              <span class="comment-rating-stars">${starString}</span>
              <span>•</span>
              <span>${escapeHtml(c.date || 'Recently')}</span>
            </div>
          </div>
          <p class="comment-text">${escapeHtml(c.text)}</p>
        </div>
      </div>
    `;
  }).join('');
}

window.setCommentRating = function(rating) {
  newCommentRating = rating;
  const stars = document.querySelectorAll('#commentRatingPicker .c-star');
  stars.forEach((s, idx) => {
    s.classList.toggle('active', idx < rating);
  });
};

window.handleCommentSubmit = function(e, eventId) {
  e.preventDefault();

  const nameInput = document.getElementById('commentAuthorName');
  const textInput = document.getElementById('commentTextContent');

  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) return;

  const newComment = {
    id: 'cmt-' + Date.now(),
    name,
    text,
    rating: newCommentRating || 5,
    date: 'Just now'
  };

  if (!eventComments[eventId]) {
    eventComments[eventId] = [];
  }

  eventComments[eventId].unshift(newComment);
  saveComments();

  // Re-render comments container
  const container = document.getElementById('commentsListContainer');
  if (container) {
    container.innerHTML = renderCommentsList(eventComments[eventId]);
  }

  // Reset form inputs
  nameInput.value = '';
  textInput.value = '';
  newCommentRating = 5;
  setCommentRating(5);

  showToast('Your comment was posted!', 'chat');
  render(); // Update card comment count in background
};

function closeDetailModal() {
  eventDetailModal.classList.remove('open');
  eventDetailModal.setAttribute('aria-hidden', 'true');
  activeEventForDetail = null;
}

/* ── Admin: Create & Edit Modal (Strictly Admin only) ─────────────────────── */
function openCreateModal() {
  if (!currentAdminUser || isSharedLinkView) {
    openAuthModal();
    return;
  }

  if (currentPlan() !== 'premium' && hostedEventCount(currentAdminUser.email) >= FREE_EVENT_LIMIT) {
    showToast(`Free plan includes ${FREE_EVENT_LIMIT} events. Upgrade to Premium to post more.`, 'workspace_premium');
    openPremiumUpgrade();
    return;
  }

  editEventId.value = '';
  eventForm.reset();
  formModalTitle.textContent = 'Post New Nigerian Event';
  saveBtnText.textContent = 'Publish Event';
  formHeaderIcon.textContent = 'add_circle';
  customCityGroup.style.display = 'none';
  document.getElementById('admissionPaid').checked = true;
  setAdmissionFields('paid');
  eventCurrency.value = '₦';

  const tomorrow = new Date(Date.now() + 3600000 * 24);
  document.getElementById('eventDate').value = tomorrow.toISOString().slice(0, 16);
  document.getElementById('eventCapacity').value = 100;
  document.getElementById('eventSalesClose').value = new Date(Date.now() + 3600000 * 20).toISOString().slice(0, 16);
  document.getElementById('eventDiscount').value = '0';
  document.getElementById('capacityHint').textContent = 'How many tickets or free spots you will release. You can raise this later.';

  eventFormModal.classList.add('open');
  eventFormModal.setAttribute('aria-hidden', 'false');
  document.getElementById('eventName').focus();
}

window.openEditModal = function(event, id) {
  if (event) event.stopPropagation();
  if (!currentAdminUser || isSharedLinkView) {
    openAuthModal();
    return;
  }

  const evt = events.find(e => e.id === id);
  if (!evt) return;
  if (!isEventOwner(evt)) {
    showToast('Only the host who posted this event can edit it.', 'lock');
    return;
  }

  editEventId.value = evt.id;
  document.getElementById('eventName').value = evt.name;
  document.getElementById('eventVenue').value = evt.venue;
  document.getElementById('eventCategory').value = evt.category;
  document.getElementById('eventDate').value = evt.date;
  document.getElementById('eventImage').value = evt.image;
  document.getElementById('eventDescription').value = evt.description;

  if (isFreeEvent(evt)) {
    document.getElementById('admissionFree').checked = true;
    setAdmissionFields('free');
    eventPriceAmount.value = '';
    eventCurrency.value = '₦';
  } else {
    document.getElementById('admissionPaid').checked = true;
    setAdmissionFields('paid');
    eventCurrency.value = evt.currency === '$' ? '$' : '₦';
    eventPriceAmount.value = String(evt.listPriceVal || evt.priceVal || '');
    document.getElementById('eventDiscount').value = ['10', '15', '20', '25', '50'].includes(String(evt.discountPercent))
      ? String(evt.discountPercent)
      : '0';
  }
  document.getElementById('eventCapacity').value = evt.ticketCapacity || 1;
  document.getElementById('eventSalesClose').value = (evt.ticketCloseAt || '').slice(0, 16);
  document.getElementById('capacityHint').textContent = `${spotsTaken(evt)} already taken. You can raise the number of tickets.`;

  // City handling
  const standardCities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu', 'Benin City', 'Kano', 'Calabar', 'Asaba'];
  if (standardCities.includes(evt.city)) {
    eventCity.value = evt.city;
    customCityGroup.style.display = 'none';
  } else {
    eventCity.value = 'Custom';
    customCityGroup.style.display = 'flex';
    customCityInput.value = evt.city;
  }

  formModalTitle.textContent = 'Edit Event Details';
  saveBtnText.textContent = 'Save Changes';
  formHeaderIcon.textContent = 'edit';

  eventFormModal.classList.add('open');
  eventFormModal.setAttribute('aria-hidden', 'false');
  document.getElementById('eventName').focus();
};

function closeFormModal() {
  eventFormModal.classList.remove('open');
  eventFormModal.setAttribute('aria-hidden', 'true');
}

function handleEventFormSubmit(e) {
  e.preventDefault();

  if (!currentAdminUser || isSharedLinkView) {
    openAuthModal();
    return;
  }

  const name = document.getElementById('eventName').value.trim();
  const category = document.getElementById('eventCategory').value;
  const date = document.getElementById('eventDate').value;
  const venue = document.getElementById('eventVenue').value.trim();
  const image = document.getElementById('eventImage').value.trim();
  const description = document.getElementById('eventDescription').value.trim();

  let city = eventCity.value;
  if (city === 'Custom') {
    city = customCityInput.value.trim() || 'Lagos';
  }

  // Currency formatting
  const admission = document.getElementById('admissionPaid').checked ? 'paid' : 'free';
  const curr = eventCurrency.value === '$' ? '$' : '₦';
  let numericPrice = 0;
  let formattedPrice = 'Free';

  if (admission === 'paid') {
    numericPrice = parseFloat(eventPriceAmount.value.replace(/,/g, ''));
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      showToast('Enter a ticket price in naira or dollars.', 'warning');
      return;
    }
    formattedPrice = formatMoneyAmount(curr, numericPrice);
  }

  const capacity = parseInt(document.getElementById('eventCapacity').value, 10);
  const ticketCloseAt = document.getElementById('eventSalesClose').value;
  let discountPercent = admission === 'paid'
    ? Math.min(90, Math.max(0, parseInt(document.getElementById('eventDiscount').value, 10) || 0))
    : 0;
  if (!Number.isFinite(capacity) || capacity < 1) {
    showToast('Enter how many tickets are available.', 'warning');
    return;
  }
  if (!ticketCloseAt) {
    showToast('Choose when ticket sales close.', 'warning');
    return;
  }
  if (new Date(ticketCloseAt).getTime() > new Date(date).getTime()) {
    showToast('Ticket sales must close by the event start.', 'warning');
    return;
  }

  let listPriceVal = admission === 'free' ? 0 : numericPrice;
  let charge = listPriceVal;
  if (admission === 'paid' && discountPercent > 0) {
    charge = curr === '$'
      ? Math.round(listPriceVal * (100 - discountPercent)) / 100
      : Math.round(listPriceVal * (100 - discountPercent) / 100);
    if (charge <= 0) {
      showToast('The discount leaves nothing to charge.', 'warning');
      return;
    }
    formattedPrice = formatMoneyAmount(curr, charge);
  }

  if (!name || !venue || !date || !image || !description) {
    showToast('Please fill in all required fields.', 'warning');
    return;
  }

  const editId = editEventId.value;

  if (editId) {
    const index = events.findIndex(e => e.id === editId);
    if (index === -1 || !isEventOwner(events[index])) {
      showToast('Only the host who posted this event can edit it.', 'lock');
      return;
    }
    const sold = spotsTaken(events[index]);
    if (capacity < sold) {
      showToast(`${sold} spots are already taken. Set the limit to at least ${sold}.`, 'warning');
      return;
    }
    events[index] = {
      ...events[index],
      name,
      city,
      category,
      date,
      venue,
      image,
      admission,
      currency: admission === 'free' ? '' : curr,
      price: formattedPrice,
      priceVal: admission === 'free' ? 0 : charge,
      listPriceVal,
      discountPercent,
      ticketCapacity: capacity,
      ticketCloseAt,
      description
    };
    showToast(`Updated "${name}"`, 'check_circle');
  } else {
    if (currentPlan() !== 'premium' && hostedEventCount(currentAdminUser.email) >= FREE_EVENT_LIMIT) {
      showToast(`Free plan includes ${FREE_EVENT_LIMIT} events. Upgrade to post more.`, 'workspace_premium');
      openPremiumUpgrade();
      return;
    }

    const newEvent = {
      id: 'evt-ng-' + Date.now(),
      name,
      city,
      category,
      date,
      venue,
      image,
      admission,
      currency: admission === 'free' ? '' : curr,
      price: formattedPrice,
      priceVal: admission === 'free' ? 0 : charge,
      listPriceVal,
      discountPercent,
      ticketCapacity: capacity,
      ticketCloseAt,
      description,
      hostName: currentAdminUser.name,
      hostEmail: currentAdminUser.email,
      rating: 5.0,
      ratingCount: 1,
      recommendations: 1,
      createdAt: Date.now()
    };
    events.unshift(newEvent);
    showToast(`Published "${name}" in ${city}. Hosted by ${currentAdminUser.name}.`, 'add_task');
  }

  saveEvents();
  syncCityDropdownOptions();
  closeFormModal();
  updateAuthUI();
  render();
}

/* ── Admin: Delete Confirmation Modal ─────────────────────────────────────── */
window.openDeleteConfirm = function(event, id) {
  if (event) event.stopPropagation();
  if (!currentAdminUser || isSharedLinkView) {
    openAuthModal();
    return;
  }

  const evt = events.find(e => e.id === id);
  if (!evt) return;
  if (!isEventOwner(evt)) {
    showToast('Only the host who posted this event can delete it.', 'lock');
    return;
  }

  activeEventForDelete = evt;
  deleteEventNameDesc.textContent = `Are you sure you want to permanently delete "${evt.name}" located in ${evt.city}, Nigeria?`;

  deleteConfirmModal.classList.add('open');
  deleteConfirmModal.setAttribute('aria-hidden', 'false');
};

function closeDeleteConfirm() {
  deleteConfirmModal.classList.remove('open');
  deleteConfirmModal.setAttribute('aria-hidden', 'true');
  activeEventForDelete = null;
}

function executeDelete() {
  if (!activeEventForDelete) return;

  const targetId = activeEventForDelete.id;
  const targetName = activeEventForDelete.name;

  events = events.filter(e => e.id !== targetId);
  userRecommendations.delete(targetId);
  delete userRatings[targetId];
  delete eventComments[targetId];

  saveEvents();
  saveUserRecs();
  saveUserRatings();
  saveComments();
  syncCityDropdownOptions();
  updateAuthUI();

  showToast(`Deleted "${targetName}"`, 'delete_forever');
  closeDeleteConfirm();
  render();
}

/* ── Auth Modal Controller ────────────────────────────────────────────────── */
function openAuthModal(tab) {
  authModal.classList.add('open');
  authModal.setAttribute('aria-hidden', 'false');
  switchAuthTab(tab === 'register' ? 'register' : 'login');
  const focusId = tab === 'register' ? 'regName' : 'loginEmail';
  document.getElementById(focusId).focus();
}

function closeAuthModal() {
  authModal.classList.remove('open');
  authModal.setAttribute('aria-hidden', 'true');
  loginForm.reset();
  registerForm.reset();
}

function switchAuthTab(tab) {
  if (tab === 'login') {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
  } else {
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
  }
}

/* ── Date Formatting Helpers ──────────────────────────────────────────────── */
function formatEventDate(isoString) {
  if (!isoString) return 'TBA';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(isoString) {
  if (!isoString) return 'Date to be announced';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(i < full ? '★' : '☆');
  }
  return stars.join('');
}

/* ── Toast Notifications ──────────────────────────────────────────────────── */
function showToast(message, icon = 'info') {
  if (toastTimeout) clearTimeout(toastTimeout);

  toastMessage.textContent = message;
  toastIcon.textContent = icon;
  toastNotification.classList.add('show');

  toastTimeout = setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 3500);
}

/* ── HTML Escaping (Security) ─────────────────────────────────────────────── */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ── Admission fields, Paystack test checkout, tickets ───────────────────── */
function setAdmissionFields(admission) {
  const paid = admission === 'paid';
  ticketPricingRow.style.display = paid ? 'grid' : 'none';
  const discountRow = document.getElementById('discountRow');
  if (discountRow) discountRow.style.display = paid ? 'block' : 'none';
  eventPriceAmount.required = paid;
  eventCurrency.required = paid;
}

function getPaystackKey() {
  return PAYSTACK_PUBLIC_KEY;
}

function openCheckout(context) {
  checkoutContext = context;
  checkoutTitle.textContent = context.title;
  checkoutSummary.textContent = context.summary;
  document.getElementById('checkoutName').value = context.name || '';
  document.getElementById('checkoutEmail').value = context.email || '';
  document.getElementById('paystackKeyInput').value = PAYSTACK_PUBLIC_KEY;
  document.getElementById('paystackKeyGroup').style.display = context.purpose === 'rsvp' ? 'none' : 'block';
  checkoutPayBtn.querySelector('span:last-child').textContent = context.buttonLabel || 'Pay with Paystack (test)';
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  checkoutContext = null;
}

function openPremiumUpgrade() {
  if (!currentAdminUser) {
    openAuthModal('register');
    return;
  }
  if (currentPlan() === 'premium') {
    showToast('This host account is already on Premium.', 'workspace_premium');
    return;
  }
  openCheckout({
    purpose: 'premium-upgrade',
    title: 'Upgrade to Premium',
    summary: `Test payment of ₦${PREMIUM_PRICE_NGN.toLocaleString('en-NG')} removes the ${FREE_EVENT_LIMIT}-event limit. No real charge.`,
    amount: PREMIUM_PRICE_NGN,
    currency: '₦',
    name: currentAdminUser.name,
    email: currentAdminUser.email,
    buttonLabel: `Pay ₦${PREMIUM_PRICE_NGN.toLocaleString('en-NG')} with Paystack (test)`
  });
}

window.openTicketCheckout = function(eventId) {
  const evt = events.find(item => item.id === eventId);
  if (!evt || isFreeEvent(evt)) return;
  const state = salesState(evt);
  if (state.soldOut) {
    showToast('This event is sold out.', 'event_busy');
    return;
  }
  if (state.closed) {
    showToast('Ticket sales for this event have closed.', 'schedule');
    return;
  }
  if (findTicket(eventId)) {
    showToast('You already have a ticket for this event on this browser.', 'confirmation_number');
    return;
  }
  openCheckout({
    purpose: 'ticket',
    eventId: evt.id,
    title: 'Get your ticket',
    summary: `${evt.name} · ${evt.price}. Hosted by ${evt.hostName}. Paystack test mode only.`,
    amount: evt.priceVal,
    currency: evt.currency === '$' ? '$' : '₦',
    name: '',
    email: '',
    buttonLabel: `Pay ${evt.price} with Paystack (test)`
  });
};

window.reserveFreeSpot = function(eventId) {
  const evt = events.find(item => item.id === eventId);
  if (!evt || !isFreeEvent(evt)) return;
  const state = salesState(evt);
  if (state.soldOut || state.closed) {
    showToast(state.soldOut ? 'This event is sold out.' : 'RSVP for this event has closed.', 'event_busy');
    return;
  }
  if (findTicket(eventId)) {
    showToast('You already reserved a spot for this event.', 'event_available');
    return;
  }
  openCheckout({
    purpose: 'rsvp',
    eventId: evt.id,
    title: 'Reserve a free spot',
    summary: `${evt.name} is free. Hosted by ${evt.hostName}. No payment.`,
    amount: 0,
    currency: '',
    name: '',
    email: '',
    buttonLabel: 'Save free RSVP'
  });
};

function applyPaidOutcome(reference, buyerName, buyerEmail) {
  if (!checkoutContext) return;
  const purpose = checkoutContext.purpose;

  if (purpose === 'ticket') {
    const evt = events.find(item => item.id === checkoutContext.eventId);
    const state = evt ? salesState(evt) : { soldOut: true, closed: true };
    if (!evt || state.soldOut || state.closed) {
      closeCheckout();
      showToast('Those tickets are no longer available.', 'event_busy');
      return;
    }
    tickets.unshift({
      id: 'tkt-' + Date.now(),
      eventId: checkoutContext.eventId,
      kind: 'ticket',
      buyerName,
      buyerEmail,
      reference,
      amount: checkoutContext.amount,
      currency: checkoutContext.currency,
      createdAt: Date.now()
    });
    saveTickets();
    const eventId = checkoutContext.eventId;
    closeCheckout();
    showToast('Ticket confirmed. This was a Paystack test payment.', 'confirmation_number');
    openDetailModal(eventId);
    return;
  }

  if (purpose === 'premium-signup' && pendingSignup) {
    const accounts = getAdminAccounts();
    const account = { ...pendingSignup, plan: 'premium', premiumRef: reference };
    accounts.push(account);
    saveAdminAccounts(accounts);
    pendingSignup = null;
    startHostSession(account);
    closeCheckout();
    showToast('Premium host account is ready. Test payment recorded.', 'workspace_premium');
    return;
  }

  if (purpose === 'premium-upgrade' && currentAdminUser) {
    const accounts = getAdminAccounts();
    const match = accounts.find(acc => acc.email.toLowerCase() === currentAdminUser.email.toLowerCase());
    if (match) {
      match.plan = 'premium';
      match.premiumRef = reference;
      saveAdminAccounts(accounts);
    }
    currentAdminUser.plan = 'premium';
    localStorage.setItem(STORAGE_ADMIN_SESSION_KEY, JSON.stringify(currentAdminUser));
    closeCheckout();
    updateAuthUI();
    showToast('Premium is active on this host account.', 'workspace_premium');
  }
}

function startPaystackPayment(buyerName, buyerEmail) {
  if (!checkoutContext) return;

  const key = getPaystackKey();
  if (!key.startsWith('pk_test_')) {
    showToast('Paste a Paystack test public key that starts with pk_test_.', 'warning');
    document.getElementById('paystackKeyInput').focus();
    return;
  }
  if (typeof PaystackPop === 'undefined') {
    showToast('Paystack did not load. Check your connection and refresh.', 'error');
    return;
  }

  const currency = checkoutContext.currency === '$' ? 'USD' : 'NGN';
  const amount = Math.round(Number(checkoutContext.amount) * 100);
  const handler = PaystackPop.setup({
    key,
    email: buyerEmail,
    amount,
    currency,
    ref: 'CP-' + Date.now(),
    metadata: {
      custom_fields: [
        {
          display_name: 'Purpose',
          variable_name: 'purpose',
          value: checkoutContext.purpose
        }
      ]
    },
    callback(response) {
      applyPaidOutcome(response.reference || 'test-ref', buyerName, buyerEmail);
    },
    onClose() {
      showToast('Payment window closed before confirmation.', 'info');
    }
  });
  handler.openIframe();
}

/* ── Event Bindings ───────────────────────────────────────────────────────── */
function bindEvents() {
  brandLogoBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Auth button & Modal. Visitors stay on the public board until they sign up.
  openAuthModalBtn.addEventListener('click', () => openAuthModal('login'));
  openSignupBtn.addEventListener('click', () => openAuthModal('register'));
  footerSignupBtn.addEventListener('click', () => openAuthModal('register'));
  upgradePlanBtn.addEventListener('click', openPremiumUpgrade);
  myStudioBtn.addEventListener('click', () => {
    pageView = 'studio';
    render();
  });
  viewAllEventsBtn.addEventListener('click', () => {
    pageView = 'discover';
    render();
  });
  closeAuthModalBtn.addEventListener('click', closeAuthModal);
  adminLogoutBtn.addEventListener('click', logoutAdmin);

  tabLoginBtn.addEventListener('click', () => switchAuthTab('login'));
  tabRegisterBtn.addEventListener('click', () => switchAuthTab('register'));

  // Login Form Submit
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    loginAdmin(email, password);
  });

  // Demo Login Quick Button
  fillDemoAdminBtn.addEventListener('click', () => {
    document.getElementById('loginEmail').value = defaultAdminAccount.email;
    document.getElementById('loginPassword').value = defaultAdminAccount.password;
    loginAdmin(defaultAdminAccount.email, defaultAdminAccount.password);
  });

  // Register Form Submit
  document.querySelectorAll('input[name="signupPlan"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const label = document.querySelector('#registerSubmitBtn span:last-child');
      if (!label) return;
      label.textContent = radio.value === 'premium'
        ? 'Continue to test payment'
        : 'Create host account';
    });
  });

  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const city = document.getElementById('regCity').value;
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const plan = (document.querySelector('input[name="signupPlan"]:checked') || {}).value || 'free';
    registerAdmin(name, email, password, city, plan);
  });

  // Share buttons
  sharePublicLinkBtn.addEventListener('click', openShareModal);
  quickShareBtn.addEventListener('click', openShareModal);
  closeShareModalBtn.addEventListener('click', () => shareModal.classList.remove('open'));
  copyShareLinkBtn.addEventListener('click', copyShareLink);

  // Admin Create Event
  openCreateModalBtn.addEventListener('click', openCreateModal);

  // City Picker (Navbar)
  navCitySelect.addEventListener('change', e => {
    selectedCity = e.target.value;
    render();
  });

  // Search Input
  globalSearchInput.addEventListener('input', e => {
    searchKeyword = e.target.value;
    clearSearchBtn.style.display = searchKeyword ? 'flex' : 'none';
    render();
  });

  clearSearchBtn.addEventListener('click', () => {
    globalSearchInput.value = '';
    searchKeyword = '';
    clearSearchBtn.style.display = 'none';
    globalSearchInput.focus();
    render();
  });

  // Ratings Filter & Sort
  ratingFilter.addEventListener('change', e => {
    minRatingFilter = parseFloat(e.target.value) || 0;
    render();
  });

  admissionFilter.addEventListener('change', e => {
    selectedAdmission = e.target.value;
    render();
  });

  currencyFilter.addEventListener('change', e => {
    selectedCurrency = e.target.value;
    render();
  });

  sortSelect.addEventListener('change', e => {
    sortBy = e.target.value;
    render();
  });

  // Category Chips
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedCategory = chip.getAttribute('data-category');
      render();
    });
  });

  // Reset Filters
  resetFiltersBtn.addEventListener('click', () => {
    selectedCity = 'all';
    selectedCategory = 'all';
    minRatingFilter = 0;
    sortBy = 'recommended';
    searchKeyword = '';
    globalSearchInput.value = '';
    navCitySelect.value = 'all';
    ratingFilter.value = '0';
    admissionFilter.value = 'all';
    currencyFilter.value = 'all';
    selectedAdmission = 'all';
    selectedCurrency = 'all';
    sortSelect.value = 'recommended';
    categoryChips.forEach(c => c.classList.toggle('active', c.getAttribute('data-category') === 'all'));
    render();
  });

  document.querySelectorAll('input[name="admissionType"]').forEach(input => {
    input.addEventListener('change', () => setAdmissionFields(input.value));
  });
  setAdmissionFields('paid');

  // Form City custom option toggle
  eventCity.addEventListener('change', e => {
    customCityGroup.style.display = e.target.value === 'Custom' ? 'flex' : 'none';
  });

  // Image preset buttons
  document.querySelectorAll('.preset-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      if (IMAGE_PRESETS[presetKey]) {
        document.getElementById('eventImage').value = IMAGE_PRESETS[presetKey];
      }
    });
  });

  // Form submit & cancel
  eventForm.addEventListener('submit', handleEventFormSubmit);
  cancelFormBtn.addEventListener('click', closeFormModal);
  closeFormModalBtn.addEventListener('click', closeFormModal);

  // Detail Modal close
  closeDetailModalBtn.addEventListener('click', closeDetailModal);

  // Delete Modal
  cancelDeleteBtn.addEventListener('click', closeDeleteConfirm);
  confirmDeleteBtn.addEventListener('click', executeDelete);

  // Rating Modal
  cancelRatingBtn.addEventListener('click', closeRatingDialog);
  submitRatingBtn.addEventListener('click', submitRating);

  starRatingSelector.addEventListener('click', e => {
    if (e.target.classList.contains('star-btn')) {
      const star = parseInt(e.target.getAttribute('data-star'), 10);
      tempRatingSelection = star;
      updateStarSelectorUI(star);
    }
  });

  // Click outside backdrop to close modals
  checkoutForm.addEventListener('submit', e => {
    e.preventDefault();
    const buyerName = document.getElementById('checkoutName').value.trim();
    const buyerEmail = document.getElementById('checkoutEmail').value.trim();
    document.getElementById('paystackKeyInput').value = PAYSTACK_PUBLIC_KEY;

    if (checkoutContext && checkoutContext.purpose === 'rsvp') {
      const evt = events.find(item => item.id === checkoutContext.eventId);
      const state = evt ? salesState(evt) : { soldOut: true, closed: true };
      if (!evt || state.soldOut || state.closed) {
        closeCheckout();
        showToast('Those spots are no longer available.', 'event_busy');
        return;
      }
      tickets.unshift({
        id: 'rsvp-' + Date.now(),
        eventId: checkoutContext.eventId,
        kind: 'rsvp',
        buyerName,
        buyerEmail,
        reference: 'FREE-' + Date.now(),
        amount: 0,
        currency: '',
        createdAt: Date.now()
      });
      const eventId = checkoutContext.eventId;
      saveTickets();
      closeCheckout();
      showToast('Free spot reserved.', 'event_available');
      openDetailModal(eventId);
      return;
    }

    startPaystackPayment(buyerName, buyerEmail);
  });
  closeCheckoutBtn.addEventListener('click', () => {
    pendingSignup = null;
    closeCheckout();
  });

  [authModal, shareModal, eventDetailModal, eventFormModal, deleteConfirmModal, ratingModal, checkoutModal].forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        if (modal === checkoutModal) pendingSignup = null;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        if (modal === checkoutModal) checkoutContext = null;
      }
    });
  });

  // Escape key to close any open modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeAuthModal();
      shareModal.classList.remove('open');
      closeDetailModal();
      closeFormModal();
      closeDeleteConfirm();
      closeRatingDialog();
      pendingSignup = null;
      closeCheckout();
    }
  });
}

// Start app
document.addEventListener('DOMContentLoaded', init);
