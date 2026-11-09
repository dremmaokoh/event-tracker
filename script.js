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
  city: 'Lagos'
};

// App State
let events = [];
let userRecommendations = new Set();
let userRatings = {}; // { eventId: rating }
let eventComments = {}; // { eventId: [ { id, name, text, rating, date } ] }
let currentAdminUser = null; // null if not logged in
let isSharedLinkView = false; // true if opened via shared attendee link

// Filter State
let selectedCity = 'all';
let selectedCategory = 'all';
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
const adminControls = document.getElementById('adminControls');
const adminAvatarText = document.getElementById('adminAvatarText');
const adminNameDisplay = document.getElementById('adminNameDisplay');
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
const eventPriceAmount = document.getElementById('eventPriceAmount');

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

/* ── Storage Functions ────────────────────────────────────────────────────── */
function loadData() {
  // 1. Events
  const savedEvents = localStorage.getItem(STORAGE_EVENTS_KEY);
  if (savedEvents) {
    try {
      events = JSON.parse(savedEvents);
    } catch (e) {
      events = [...defaultNigerianEvents];
      saveEvents();
    }
  } else {
    events = [...defaultNigerianEvents];
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

function getAdminAccounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ADMIN_ACCOUNTS_KEY)) || [defaultAdminAccount];
  } catch (e) {
    return [defaultAdminAccount];
  }
}

function saveAdminAccounts(accounts) {
  localStorage.setItem(STORAGE_ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
}

/* ── Admin Authentication Controller ──────────────────────────────────────── */
function updateAuthUI() {
  if (currentAdminUser && !isSharedLinkView) {
    // Verified Admin is logged in
    openAuthModalBtn.style.display = 'none';
    adminControls.style.display = 'flex';
    adminBanner.style.display = 'block';

    adminNameDisplay.textContent = currentAdminUser.name || 'Admin';
    adminSessionEmail.textContent = currentAdminUser.email;
    
    // Initials avatar
    const initials = (currentAdminUser.name || 'Admin')
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    adminAvatarText.textContent = initials;
  } else {
    // Public Attendee / Visitor view
    // Strictly hide ALL admin posting, editing, and deletion controls!
    openAuthModalBtn.style.display = 'inline-flex';
    adminControls.style.display = 'none';
    adminBanner.style.display = 'none';
  }
}

function loginAdmin(email, password) {
  const accounts = getAdminAccounts();
  const matched = accounts.find(
    acc => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
  );

  if (matched) {
    isSharedLinkView = false; // exit forced public mode
    currentAdminUser = { name: matched.name, email: matched.email, city: matched.city };
    localStorage.setItem(STORAGE_ADMIN_SESSION_KEY, JSON.stringify(currentAdminUser));
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

function registerAdmin(name, email, password, city) {
  const accounts = getAdminAccounts();
  const exists = accounts.some(acc => acc.email.toLowerCase() === email.trim().toLowerCase());

  if (exists) {
    showToast('An admin account with this email already exists.', 'warning');
    return false;
  }

  const newAccount = { name, email, password, city };
  accounts.push(newAccount);
  saveAdminAccounts(accounts);

  isSharedLinkView = false;
  currentAdminUser = { name, email, city };
  localStorage.setItem(STORAGE_ADMIN_SESSION_KEY, JSON.stringify(currentAdminUser));
  updateAuthUI();
  closeAuthModal();
  showToast(`Account registered successfully! Welcome, ${name}.`, 'how_to_reg');
  render();
  return true;
}

function logoutAdmin() {
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
      if (!matchName && !matchDesc && !matchVenue && !matchCity) {
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

/* ── Main Render ──────────────────────────────────────────────────────────── */
function render() {
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

  // Render Event Cards
  const isAdmin = Boolean(currentAdminUser) && !isSharedLinkView;

  eventsGrid.innerHTML = filtered.map(evt => {
    const isRecommended = userRecommendations.has(evt.id);
    const formattedDate = formatEventDate(evt.date);
    const starString = renderStars(evt.rating || 0);
    const commentsList = eventComments[evt.id] || [];

    return `
      <article class="event-card" data-id="${evt.id}">
        <!-- Media / Cover Image -->
        <div class="card-media" onclick="openDetailModal('${evt.id}')">
          <img src="${escapeHtml(evt.image)}" alt="${escapeHtml(evt.name)}" loading="lazy" onerror="this.src='${IMAGE_PRESETS.concert}'">
          <span class="badge-category">${escapeHtml(evt.category)}</span>
          ${evt.price ? `<span class="badge-price">${escapeHtml(evt.price)}</span>` : ''}
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

            ${isAdmin ? `
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
          ${evt.price ? `<span class="badge-price">${escapeHtml(evt.price)}</span>` : ''}
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
      </div>

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

  editEventId.value = '';
  eventForm.reset();
  formModalTitle.textContent = 'Post New Nigerian Event';
  saveBtnText.textContent = 'Publish Event';
  formHeaderIcon.textContent = 'add_circle';
  customCityGroup.style.display = 'none';
  eventCurrency.value = '₦';
  ticketAmountGroup.style.display = 'flex';

  const tomorrow = new Date(Date.now() + 3600000 * 24);
  document.getElementById('eventDate').value = tomorrow.toISOString().slice(0, 16);

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

  editEventId.value = evt.id;
  document.getElementById('eventName').value = evt.name;
  document.getElementById('eventVenue').value = evt.venue;
  document.getElementById('eventCategory').value = evt.category;
  document.getElementById('eventDate').value = evt.date;
  document.getElementById('eventImage').value = evt.image;
  document.getElementById('eventDescription').value = evt.description;

  // Currency & price parsing
  if (evt.price && evt.price.includes('$')) {
    eventCurrency.value = '$';
    ticketAmountGroup.style.display = 'flex';
    eventPriceAmount.value = evt.price.replace('$', '').trim();
  } else if (evt.price && evt.price.includes('Free')) {
    eventCurrency.value = 'Free';
    ticketAmountGroup.style.display = 'none';
    eventPriceAmount.value = '';
  } else {
    eventCurrency.value = '₦';
    ticketAmountGroup.style.display = 'flex';
    eventPriceAmount.value = (evt.price || '').replace('₦', '').trim();
  }

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
  const curr = eventCurrency.value;
  const amountStr = eventPriceAmount.value.trim();
  let formattedPrice = 'Free Admission';
  let numericPrice = 0;

  if (curr === 'Free') {
    formattedPrice = 'Free Admission';
    numericPrice = 0;
  } else if (curr === '$') {
    formattedPrice = `$${amountStr || '25'}`;
    numericPrice = parseFloat(amountStr) || 25;
  } else {
    formattedPrice = `₦${amountStr || '5,000'}`;
    numericPrice = parseFloat((amountStr || '5000').replace(/,/g, '')) || 5000;
  }

  if (!name || !venue || !date || !image || !description) {
    showToast('Please fill in all required fields.', 'warning');
    return;
  }

  const editId = editEventId.value;

  if (editId) {
    const index = events.findIndex(e => e.id === editId);
    if (index !== -1) {
      events[index] = {
        ...events[index],
        name,
        city,
        category,
        date,
        venue,
        image,
        currency: curr,
        price: formattedPrice,
        priceVal: numericPrice,
        description
      };
      showToast(`Updated "${name}"`, 'check_circle');
    }
  } else {
    const newEvent = {
      id: 'evt-ng-' + Date.now(),
      name,
      city,
      category,
      date,
      venue,
      image,
      currency: curr,
      price: formattedPrice,
      priceVal: numericPrice,
      description,
      rating: 5.0,
      ratingCount: 1,
      recommendations: 1,
      createdAt: Date.now()
    };
    events.unshift(newEvent);
    showToast(`Published "${name}" in ${city}, Nigeria!`, 'add_task');
  }

  saveEvents();
  syncCityDropdownOptions();
  closeFormModal();
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

  showToast(`Deleted "${targetName}"`, 'delete_forever');
  closeDeleteConfirm();
  render();
}

/* ── Auth Modal Controller ────────────────────────────────────────────────── */
function openAuthModal() {
  authModal.classList.add('open');
  authModal.setAttribute('aria-hidden', 'false');
  document.getElementById('loginEmail').focus();
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

/* ── Event Bindings ───────────────────────────────────────────────────────── */
function bindEvents() {
  brandLogoBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Auth button & Modal
  openAuthModalBtn.addEventListener('click', openAuthModal);
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
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const city = document.getElementById('regCity').value;
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    registerAdmin(name, email, password, city);
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
    sortSelect.value = 'recommended';
    categoryChips.forEach(c => c.classList.toggle('active', c.getAttribute('data-category') === 'all'));
    render();
  });

  // Currency select in Event Form
  eventCurrency.addEventListener('change', e => {
    ticketAmountGroup.style.display = e.target.value === 'Free' ? 'none' : 'flex';
  });

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
  [authModal, shareModal, eventDetailModal, eventFormModal, deleteConfirmModal, ratingModal].forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
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
    }
  });
}

// Start app
document.addEventListener('DOMContentLoaded', init);
