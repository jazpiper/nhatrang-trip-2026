import { state, updateWishlistBadge } from '../store/state.js';
import { saveToStorage } from '../utils/storage.js';
import { formatVND, formatKRW, escapeHtml, showToast } from '../utils/helpers.js';

// Get Filtered Activities
export function getFilteredActivities() {
  if (typeof NHA_TRANG_ACTIVITIES === 'undefined') return [];
  return NHA_TRANG_ACTIVITIES.filter(item => {
    if (state.wishlistOnly && !state.wishlist.includes(item.id)) return false;
    if (state.actCategory !== 'all' && item.category !== state.actCategory) return false;
    if (state.actTag !== 'all') {
      const tagMap = {
        'wife': ['wife', '와이프', '커플', '인기'],
        'photo': ['photo', '인생샷', '사진', '스팟', '성지', '인스타'],
        'spa': ['spa', '스파', '힐링', '마사지', '온천', '머드'],
        'rain': ['rain', '비오는날', '비올때', '실내', '워터파크', '테마파크']
      };
      const keywords = tagMap[state.actTag] || [state.actTag];
      const itemTags = (item.tags || []).concat([item.category, item.categoryLabel || '', item.badge || '']);
      const hasTag = itemTags.some(t => {
        const tLower = (t || '').toLowerCase();
        return keywords.some(k => tLower.includes(k.toLowerCase()));
      });
      if (!hasTag) return false;
    }
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchTitleEn = (item.titleEn || '').toLowerCase().includes(q);
      const matchDesc = (item.description || item.highlight || '').toLowerCase().includes(q);
      const matchLoc = (item.location || '').toLowerCase().includes(q);
      const matchHighlight = (item.highlight || '').toLowerCase().includes(q);
      const matchCat = (item.categoryLabel || item.category || '').toLowerCase().includes(q);
      const matchTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
      const matchMapQuery = (item.googleMapQuery || '').toLowerCase().includes(q);
      if (!matchTitle && !matchTitleEn && !matchDesc && !matchLoc && !matchHighlight && !matchCat && !matchTags && !matchMapQuery) return false;
    }
    return true;
  }).sort((a, b) => {
    if (state.sortBy === 'rating') return b.rating - a.rating;
    if (state.sortBy === 'price-asc') return a.priceVnd - b.priceVnd;
    if (state.sortBy === 'price-desc') return b.priceVnd - a.priceVnd;
    return 0; // recommended
  });
}

// Render Activity Cards
export function renderCards() {
  const cardsGrid = document.getElementById('cardsGridContainer');
  const resultCountText = document.getElementById('resultCountText');
  if (!cardsGrid) return;

  const list = getFilteredActivities();
  if (resultCountText) {
    resultCountText.innerHTML = `총 <strong>${list.length}</strong>개의 추천 액티비티`;
  }

  if (list.length === 0) {
    cardsGrid.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <h3>조건에 맞는 액티비티가 없습니다</h3>
        <p>필터 조건을 초기화하거나 다른 검색어로 찾아보세요.</p>
        <button class="btn-reset-filters" id="btnResetFilters">필터 전체 초기화</button>
      </div>
    `;
    const resetBtn = document.getElementById('btnResetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const evt = new CustomEvent('reset-filters');
        window.dispatchEvent(evt);
      });
    }
    return;
  }

  cardsGrid.innerHTML = list.map(item => {
    const isWish = state.wishlist.includes(item.id);
    const userNote = state.notes[item.id];
    const tagBadges = (item.tags || []).slice(0, 3).map(t => {
      let label = t;
      if (t === 'wife' || t === '와이프추천' || t === '와이프픽') label = '💖 와이프 픽';
      else if (t === 'photo' || t === '인생샷') label = '📸 인생샷';
      else if (t === 'spa' || t === '힐링' || t === '힐링스파') label = '💆 힐링';
      else if (t === 'rain' || t === '비오는날강추' || t === '비올때강추') label = '☔ 비올때 강추';
      else label = `# ${t}`;
      return `<span class="mini-tag">${label}</span>`;
    }).join('');

    const mainImg = (item.images && item.images.length > 0) ? item.images[0] : (item.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80');
    const dayBadge = item.suggestedDay || item.recommendedDay || '';

    return `
      <div class="activity-card" data-id="${item.id}">
        <div class="card-media-wrapper">
          <img src="${mainImg}" alt="${item.title}" class="card-img" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';" />
          <span class="card-badge-top-left">${item.badge || ''}</span>
          <button class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-id="${item.id}" title="찜하기" aria-label="찜하기">
            ${isWish ? '♥' : '♡'}
          </button>
          ${dayBadge ? `<span class="card-badge-day">${dayBadge}</span>` : ''}
        </div>
        <div class="card-body">
          <div class="card-header-line">
            <span class="card-title">${item.title}</span>
            <span class="card-rating"><span class="star">★</span> ${item.rating}</span>
          </div>
          <div class="card-meta-line">
            <span>⏱️ ${item.duration}</span>
            <span>•</span>
            <span>📍 ${item.location}</span>
          </div>
          <div class="card-tag-pill-list">
            ${tagBadges}
          </div>
          <div class="card-price-line">
            <span class="price-main">${formatVND(item.priceVnd)}</span>
            <span class="price-krw">(${formatKRW(item.priceVnd)})</span>
            <span class="price-sub">/ ${item.pricePer || '1인'}</span>
          </div>
          ${userNote ? `
            <div class="card-note-badge">
              <span>📝</span>
              <span>${escapeHtml(userNote)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  cardsGrid.querySelectorAll('.activity-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-heart-btn')) return;
      const id = card.dataset.id;
      const activity = NHA_TRANG_ACTIVITIES.find(a => a.id === id);
      if (activity) openActivityModal(activity);
    });
  });

  cardsGrid.querySelectorAll('.card-heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.id);
      renderCards();
    });
  });
}

// Render Timeline
export function renderTimeline() {
  const timelineContainer = document.getElementById('timelineContainer');
  if (!timelineContainer || typeof NHA_TRANG_SCHEDULE === 'undefined') return;

  timelineContainer.innerHTML = NHA_TRANG_SCHEDULE.map(day => {
    const itemsHtml = (day.activities || day.activityIds || []).map(id => {
      const act = NHA_TRANG_ACTIVITIES.find(a => a.id === id);
      if (!act) return '';
      return `
        <div class="timeline-activity-item" data-id="${act.id}">
          <div class="item-icon">${act.iconEmoji || '📍'}</div>
          <div class="item-content">
            <div class="item-title">${act.title}</div>
            <div class="item-meta">
              <span>★ ${act.rating}</span>
              <span>•</span>
              <span>${act.duration}</span>
              <span>•</span>
              <span>${act.location}</span>
            </div>
          </div>
          <div class="item-price">${formatVND(act.priceVnd)}</div>
        </div>
      `;
    }).join('');

    const dayNumberText = String(day.day).startsWith('Day') ? day.day : `Day ${day.day}`;
    const dayDateText = day.dayOfWeek ? `${day.date} (${day.dayOfWeek})` : day.date;

    return `
      <div class="timeline-day-card">
        <div class="day-header">
          <span class="day-number">${dayNumberText}</span>
          <span class="day-date">${dayDateText}</span>
          <span class="day-theme">${day.theme}</span>
        </div>
        <div class="timeline-activities-list">
          ${itemsHtml}
        </div>
      </div>
    `;
  }).join('');

  timelineContainer.querySelectorAll('.timeline-activity-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const act = NHA_TRANG_ACTIVITIES.find(a => a.id === id);
      if (act) openActivityModal(act);
    });
  });
}

function openActivityModal(act) {
  state.activeModalActivity = act;
  const detailModal = document.getElementById('detailModal');
  
  const images = act.images && act.images.length > 0 ? act.images : (act.imageUrl ? [act.imageUrl] : ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80']);
  const modalGallery = document.getElementById('modalGallery');
  if (modalGallery) {
    if (images.length >= 3) {
      modalGallery.innerHTML = `
        <img src="${images[0]}" alt="${act.title}" class="main-img" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';" />
        <div class="sub-imgs">
          <img src="${images[1]}" alt="${act.title} 2" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';" />
          <img src="${images[2]}" alt="${act.title} 3" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';" />
        </div>
      `;
    } else {
      modalGallery.innerHTML = `
        <img src="${images[0]}" alt="${act.title}" style="width: 100%; height: 100%; object-fit: cover; grid-column: 1 / -1;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';" />
      `;
    }
    modalGallery.style.display = 'grid';
  }

  const setContent = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  };

  setContent('modalBadge', act.badge || '추천');
  setContent('modalCategory', act.categoryLabel || act.category);
  setContent('modalDay', act.suggestedDay || act.recommendedDay);
  setContent('modalTitle', act.title);
  setContent('modalTitleEn', act.titleEn);
  setContent('modalRating', `★ ${act.rating} (${act.reviewCount ? act.reviewCount + '개 리뷰' : ''})`);
  setContent('modalDuration', act.duration);
  setContent('modalBestTime', act.bestTime || act.timeSlot);
  setContent('modalTime', act.bestTime || act.timeSlot);
  setContent('modalLocation', act.location);
  setContent('modalHighlight', act.highlight);
  setContent('modalCoupleTip', act.coupleTip || act.wifeTip);
  setContent('modalWifeTip', act.coupleTip || act.wifeTip);

  const setList = (id, items, fallbackIcon, fallbackText) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = items && items.length > 0
        ? items.map(s => `<li><span class="bullet">${fallbackIcon}</span> <span>${s}</span></li>`).join('')
        : `<li><span class="bullet">${fallbackIcon}</span> <span>${fallbackText}</span></li>`;
    }
  };

  setList('modalIncludedList', act.included, '✓', '기본 입장 및 체험 포함');
  setList('modalNotIncludedList', act.notIncluded, '✕', '개인 경비 및 매너 팁');
  setList('modalWhatToBringList', act.whatToBring || act.supplies, '🎒', '편안한 복장 및 카메라');
  setList('modalSuppliesList', act.whatToBring || act.supplies, '🎒', '편안한 복장 및 카메라');

  const noteInput = document.getElementById('modalNoteInput') || document.getElementById('noteInput');
  const noteStatus = document.getElementById('modalNoteStatus') || document.getElementById('noteStatus');
  if (noteInput) noteInput.value = state.notes[act.id] || '';
  if (noteStatus) noteStatus.textContent = '';

  setContent('modalPriceVnd', formatVND(act.priceVnd));
  setContent('modalPriceKrw', `(${formatKRW(act.priceVnd)})`);
  setContent('modalPricePer', `/ ${act.pricePer || act.priceUnit || '1인 기준'}`);
  setContent('modalPriceSub', `/ ${act.pricePer || act.priceUnit || '1인 기준'}`);

  const modalMapLink = document.getElementById('modalMapLink');
  if (modalMapLink) {
    const mapQuery = act.googleMapQuery || `${act.title} Nha Trang`;
    modalMapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  }
  const modalReserveBtn = document.getElementById('modalReserveLink') || document.getElementById('modalReserveBtn');
  if (modalReserveBtn) {
    modalReserveBtn.href = act.bookingUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.googleMapQuery || act.title)}`;
  }
  
  updateModalHeartState();
  if (detailModal) {
    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function updateModalHeartState() {
  if (!state.activeModalActivity) return;
  const isWish = state.wishlist.includes(state.activeModalActivity.id);
  const modalHeartBtn = document.getElementById('modalHeartBtn');
  if (modalHeartBtn) {
    modalHeartBtn.innerHTML = isWish ? '♥ 찜 완료' : '♡ 찜하기';
    modalHeartBtn.classList.toggle('is-wishlisted', isWish);
  }
}

export function closeActivityModal() {
  const detailModal = document.getElementById('detailModal');
  if (detailModal) {
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  state.activeModalActivity = null;
}

export function toggleWishlist(id) {
  const idx = state.wishlist.indexOf(id);
  if (idx > -1) {
    state.wishlist.splice(idx, 1);
    showToast('액티비티 찜 목록에서 제거되었습니다.');
  } else {
    state.wishlist.push(id);
    showToast('♥ 액티비티 찜 목록에 추가되었습니다!');
  }
  saveToStorage('nha_trang_wishlist', state.wishlist);
  updateWishlistBadge();
  updateModalHeartState();
}
