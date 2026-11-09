/**
 * ============================================================================
 * CityPulse — City Event Tracker Controller
 * Vanilla JavaScript with Web Storage (localStorage) Persistence
 * ============================================================================
 */

// Storage Keys
const STORAGE_EVENTS_KEY = 'citypulse_events_data';
const STORAGE_USER_RECS_KEY = 'citypulse_user_recommendations';
const STORAGE_USER_RATINGS_KEY = 'citypulse_user_ratings';
const STORAGE_VIEW_MODE_KEY = 'citypulse_view_mode';

// Preset curated Unsplash photos for quick event creation
const IMAGE_PRESETS = {
  concert: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
  art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
  party: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80'
};

// Rich Seed Data across multiple cities
const defaultEvents = [
  {
    id: 'evt-101',
    name: 'Eko International Tech Summit 2026',
    city: 'Lagos',
    venue: 'Landmark Event Centre, Victoria Island',
    category: 'Tech & Business',
    date: '2026-11-28T09:00',
    price: 'Free / VIP ₦25,000',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: 'The premier technology and startup gathering in West Africa. Join 2,500+ founders, venture capitalists, and engineers showcasing breakthroughs in AI, Fintech, Clean Energy, and Cloud Infrastructure.',
    rating: 4.9,
    ratingCount: 142,
    recommendations: 238,
    createdAt: Date.now() - 3600000 * 24 * 5
  },
  {
    id: 'evt-102',
    name: 'Afrobeats & Vibes Under the Palms',
    city: 'Lagos',
    venue: 'Eko Atlantic Waterfront, Lagos',
    category: 'Music & Concerts',
    date: '2026-12-05T18:00',
    price: '₦15,000',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    description: 'An electrifying outdoor beachside concert featuring top chart-topping African artists, international guest DJs, live brass sections, artisan cocktails, and unforgettable ocean sunsets.',
    rating: 4.8,
    ratingCount: 96,
    recommendations: 189,
    createdAt: Date.now() - 3600000 * 24 * 4
  },
  {
    id: 'evt-103',
    name: 'London Contemporary Street Food & Craft Beer Expo',
    city: 'London',
    venue: 'Tobacco Dock, Wapping, London',
    category: 'Food & Drink',
    date: '2026-11-20T12:00',
    price: '£18',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    description: 'Experience over 60 independent street food chefs, masterclasses from Michelin-starred sommeliers, live acoustic sets, and the UKs largest selection of micro-brewery cask ales.',
    rating: 4.7,
    ratingCount: 84,
    recommendations: 145,
    createdAt: Date.now() - 3600000 * 24 * 8
  },
  {
    id: 'evt-104',
    name: 'Brooklyn Underground Art & Light Installations',
    city: 'New York',
    venue: 'Industry City, Brooklyn, NY',
    category: 'Arts & Culture',
    date: '2026-11-22T17:30',
    price: '$25',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    description: 'A mind-bending walk-through exhibition of interactive neon sculptures, projection mapping, soundscapes, and digital canvas displays created by emerging New York visionaries.',
    rating: 4.9,
    ratingCount: 112,
    recommendations: 204,
    createdAt: Date.now() - 3600000 * 24 * 2
  },
  {
    id: 'evt-105',
    name: 'Shibuya Neon Cyberpunk Night Market & Beats',
    city: 'Tokyo',
    venue: 'Miyashita Park Rooftop, Shibuya, Tokyo',
    category: 'Nightlife',
    date: '2026-12-01T21:00',
    price: '¥3,500',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Late-night electronic synthwave festival meeting traditional Tokyo night-market street foods, retro arcade tournaments, and futuristic apparel showcases overlooking the city lights.',
    rating: 4.8,
    ratingCount: 78,
    recommendations: 167,
    createdAt: Date.now() - 3600000 * 24 * 6
  },
  {
    id: 'evt-106',
    name: 'Paris Autumn Marathon & Riverside 10K',
    city: 'Paris',
    venue: 'Pont d’Iéna / Seine Riverbank, Paris',
    category: 'Sports & Fitness',
    date: '2026-11-29T07:30',
    price: '€35',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
    description: 'Run through historic avenues, starting at the foot of the Eiffel Tower and winding along the iconic Seine River. Includes timing chip, finisher medal, and recovery pastry breakfast.',
    rating: 4.6,
    ratingCount: 54,
    recommendations: 92,
    createdAt: Date.now() - 3600000 * 24 * 10
  }
];

// App State
let events = [];
let userRecommendations = new Set();
let userRatings = {}; // { eventId: rating }
let isAdminMode = false;

// Filter State
let selectedCity = 'all';
let selectedCategory = 'all';
let minRatingFilter = 0;
let sortBy = 'recommended';
let searchKeyword = '';

// Active dialog targets
let activeEventForRating = null;
let activeEventForDelete = null;
let toastTimeout = null;

// DOM Elements
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

const viewModeToggle = document.getElementById('viewModeToggle');
const viewModeText = document.getElementById('viewModeText');
const adminBanner = document.getElementById('adminBanner');
const exitAdminBtn = document.getElementById('exitAdminBtn');
const openCreateModalBtn = document.getElementById('openCreateModalBtn');

// Modals
const eventDetailModal = document.getElementById('eventDetailModal');
const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
const detailModalBody = document.getElementById('detailModalBody');

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

const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteEventNameDesc = document.getElementById('deleteEventNameDesc');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

const ratingModal = document.getElementById('ratingModal');
const ratingEventTitle = document.getElementById('ratingEventTitle');
const starRatingSelector = document.getElementById('starRatingSelector');
const starRatingFeedback = document.getElementById('starRatingFeedback');
const cancelRatingBtn = document.getElementById('cancelRatingBtn');
const submitRatingBtn = document.getElementById('submitRatingBtn');

const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

/* ── Initialization ───────────────────────────────────────────────────────── */
function init() {
  loadData();
  bindEvents();
  syncCityDropdownOptions();
  render();
}

/* ── Storage Functions ────────────────────────────────────────────────────── */
function loadData() {
  // Load events
  const savedEvents = localStorage.getItem(STORAGE_EVENTS_KEY);
  if (savedEvents) {
    try {
      events = JSON.parse(savedEvents);
    } catch (e) {
      events = [...defaultEvents];
      saveEvents();
    }
  } else {
    events = [...defaultEvents];
    saveEvents();
  }

  // Load user recommendations
  const savedRecs = localStorage.getItem(STORAGE_USER_RECS_KEY);
  if (savedRecs) {
    try {
      userRecommendations = new Set(JSON.parse(savedRecs));
    } catch (e) {
      userRecommendations = new Set();
    }
  }

  // Load user ratings
  const savedRatings = localStorage.getItem(STORAGE_USER_RATINGS_KEY);
  if (savedRatings) {
    try {
      userRatings = JSON.parse(savedRatings);
    } catch (e) {
      userRatings = {};
    }
  }

  // Load view mode
  const savedMode = localStorage.getItem(STORAGE_VIEW_MODE_KEY);
  if (savedMode === 'admin') {
    setAdminMode(true);
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

/* ── Mode Switching (Explorer vs Admin) ──────────────────────────────────── */
function setAdminMode(enabled) {
  isAdminMode = enabled;
  localStorage.setItem(STORAGE_VIEW_MODE_KEY, isAdminMode ? 'admin' : 'explorer');

  if (isAdminMode) {
    viewModeToggle.classList.add('admin-active');
    viewModeToggle.classList.remove('public');
    viewModeText.textContent = 'Admin Studio';
    adminBanner.style.display = 'block';
    openCreateModalBtn.style.display = 'inline-flex';
    showToast('Admin Mode Enabled: You can now create, edit & delete events.', 'shield_person');
  } else {
    viewModeToggle.classList.remove('admin-active');
    viewModeToggle.classList.add('public');
    viewModeText.textContent = 'Explorer Mode';
    adminBanner.style.display = 'none';
    openCreateModalBtn.style.display = 'none';
  }

  render();
}

/* ── Dynamic City Dropdown Sync ───────────────────────────────────────────── */
function syncCityDropdownOptions() {
  const cities = Array.from(new Set(events.map(e => e.city).filter(Boolean))).sort();
  
  // Update Navbar City Select
  const currentNavVal = navCitySelect.value;
  navCitySelect.innerHTML = `<option value="all">🌍 All Cities</option>`;
  cities.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = `📍 ${city}`;
    navCitySelect.appendChild(opt);
  });
  if (cities.includes(currentNavVal)) {
    navCitySelect.value = currentNavVal;
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

    // Search query matching (name, description, venue, city)
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
    if (sortBy === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
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
    ? 'Happening in All Cities' 
    : `Happening in ${selectedCity}`;

  eventsCountHeading.textContent = `Events (${filtered.length})`;

  // Subtitle info
  let statusParts = [];
  if (selectedCity !== 'all') statusParts.push(`City: ${selectedCity}`);
  if (selectedCategory !== 'all') statusParts.push(`Category: ${selectedCategory}`);
  if (minRatingFilter > 0) statusParts.push(`Rating: ${minRatingFilter}+★`);
  if (searchKeyword.trim()) statusParts.push(`Search: "${searchKeyword.trim()}"`);

  filterStatusText.textContent = statusParts.length > 0 
    ? `Filtered by: ${statusParts.join(' • ')}` 
    : 'Showing all available listings';

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
  eventsGrid.innerHTML = filtered.map(evt => {
    const isRecommended = userRecommendations.has(evt.id);
    const userRatingVal = userRatings[evt.id];
    const formattedDate = formatEventDate(evt.date);
    const starString = renderStars(evt.rating || 0);

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
              ${escapeHtml(evt.city)}
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
            <button 
              type="button" 
              class="icon-action-btn" 
              onclick="openRatingDialog(event, '${evt.id}')" 
              title="Rate this event"
            >
              <span class="material-symbols-outlined" style="font-size:18px;">star_rate</span>
            </button>

            ${isAdminMode ? `
              <button 
                type="button" 
                class="icon-action-btn" 
                onclick="openEditModal(event, '${evt.id}')" 
                title="Edit Event (Admin)"
              >
                <span class="material-symbols-outlined" style="font-size:18px;">edit</span>
              </button>
              <button 
                type="button" 
                class="icon-action-btn delete-btn" 
                onclick="openDeleteConfirm(event, '${evt.id}')" 
                title="Delete Event (Admin)"
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
  
  // Pre-select if already rated
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
    '1 Star — Poor',
    '2 Stars — Fair',
    '3 Stars — Good',
    '4 Stars — Great Event!',
    '5 Stars — Absolutely Incredible!'
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
    // Update existing user rating
    const totalScore = (evt.rating * evt.ratingCount) - previousRating + tempRatingSelection;
    evt.rating = parseFloat((totalScore / evt.ratingCount).toFixed(1));
  } else {
    // Add new user rating
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

/* ── Event Detail Modal (Full view) ───────────────────────────────────────── */
window.openDetailModal = function(id) {
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  const isRecommended = userRecommendations.has(evt.id);
  const formattedDate = formatFullDate(evt.date);
  const starString = renderStars(evt.rating || 0);

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
            <div class="detail-meta-label">City & Venue</div>
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
            <div class="detail-meta-label">Recommendations</div>
            <div class="detail-meta-val">${evt.recommendations || 0} Attendees</div>
          </div>
        </div>
      </div>

      <div class="detail-desc-block">
        <h4>About this Event</h4>
        <p>${escapeHtml(evt.description)}</p>
      </div>

      <div class="modal-actions mt-4">
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
    </div>
  `;

  eventDetailModal.classList.add('open');
  eventDetailModal.setAttribute('aria-hidden', 'false');
};

function closeDetailModal() {
  eventDetailModal.classList.remove('open');
  eventDetailModal.setAttribute('aria-hidden', 'true');
}

/* ── Admin: Create & Edit Modal ───────────────────────────────────────────── */
function openCreateModal() {
  editEventId.value = '';
  eventForm.reset();
  formModalTitle.textContent = 'Create New Event';
  saveBtnText.textContent = 'Publish Event';
  formHeaderIcon.textContent = 'add_circle';
  customCityGroup.style.display = 'none';

  // Set default upcoming date
  const tomorrow = new Date(Date.now() + 3600000 * 24);
  document.getElementById('eventDate').value = tomorrow.toISOString().slice(0, 16);

  eventFormModal.classList.add('open');
  eventFormModal.setAttribute('aria-hidden', 'false');
  document.getElementById('eventName').focus();
}

window.openEditModal = function(event, id) {
  if (event) event.stopPropagation();
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  editEventId.value = evt.id;
  document.getElementById('eventName').value = evt.name;
  document.getElementById('eventVenue').value = evt.venue;
  document.getElementById('eventCategory').value = evt.category;
  document.getElementById('eventDate').value = evt.date;
  document.getElementById('eventPrice').value = evt.price || '';
  document.getElementById('eventImage').value = evt.image;
  document.getElementById('eventDescription').value = evt.description;

  // City handling
  const standardCities = ['Lagos', 'London', 'New York', 'Tokyo', 'Paris'];
  if (standardCities.includes(evt.city)) {
    eventCity.value = evt.city;
    customCityGroup.style.display = 'none';
  } else {
    eventCity.value = 'Custom';
    customCityGroup.style.display = 'flex';
    customCityInput.value = evt.city;
  }

  formModalTitle.textContent = 'Edit Event';
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

  const name = document.getElementById('eventName').value.trim();
  const category = document.getElementById('eventCategory').value;
  const date = document.getElementById('eventDate').value;
  const venue = document.getElementById('eventVenue').value.trim();
  const image = document.getElementById('eventImage').value.trim();
  const price = document.getElementById('eventPrice').value.trim();
  const description = document.getElementById('eventDescription').value.trim();

  let city = eventCity.value;
  if (city === 'Custom') {
    city = customCityInput.value.trim() || 'Lagos';
  }

  if (!name || !venue || !date || !image || !description) {
    showToast('Please fill in all required fields.', 'warning');
    return;
  }

  const editId = editEventId.value;

  if (editId) {
    // Edit existing event
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
        price,
        description
      };
      showToast(`Updated "${name}"`, 'check_circle');
    }
  } else {
    // Insert new event
    const newEvent = {
      id: 'evt-' + Date.now(),
      name,
      city,
      category,
      date,
      venue,
      image,
      price: price || 'Free Admission',
      description,
      rating: 5.0,
      ratingCount: 1,
      recommendations: 1,
      createdAt: Date.now()
    };
    events.unshift(newEvent);
    showToast(`Published "${name}" to ${city}!`, 'add_task');
  }

  saveEvents();
  syncCityDropdownOptions();
  closeFormModal();
  render();
}

/* ── Admin: Delete Confirmation Modal ─────────────────────────────────────── */
window.openDeleteConfirm = function(event, id) {
  if (event) event.stopPropagation();
  const evt = events.find(e => e.id === id);
  if (!evt) return;

  activeEventForDelete = evt;
  deleteEventNameDesc.textContent = `Are you sure you want to permanently delete "${evt.name}" located in ${evt.city}?`;

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

  saveEvents();
  saveUserRecs();
  saveUserRatings();
  syncCityDropdownOptions();

  showToast(`Deleted "${targetName}"`, 'delete_forever');
  closeDeleteConfirm();
  render();
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
  // Mode switcher
  viewModeToggle.addEventListener('click', () => {
    setAdminMode(!isAdminMode);
  });

  exitAdminBtn.addEventListener('click', () => {
    setAdminMode(false);
  });

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
  [eventDetailModal, eventFormModal, deleteConfirmModal, ratingModal].forEach(modal => {
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
      closeDetailModal();
      closeFormModal();
      closeDeleteConfirm();
      closeRatingDialog();
    }
  });
}

// Start app
document.addEventListener('DOMContentLoaded', init);

