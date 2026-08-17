import { state, updateWishlistBadge } from '../store/state.js';
import { saveToStorage } from '../utils/storage.js';
import { formatVND, formatKRW, escapeHtml, showToast } from '../utils/helpers.js';

export function getFilteredStays() {
  if (typeof NHA_TRANG_STAYS === 'undefined') return [];
  return NHA_TRANG_STAYS.filter(item => {
    // 1. Wishlist Only Filter
    if (state.wishlistOnly && !state.stayWishlist.includes(item.id)) return false;

    // 2. Theme Category Filter
    if (state.stayCategory !== 'all') {
      const cat = state.stayCategory;
      const matchesTheme = (
        item.theme === cat ||
        (cat === 'welcome' && item.theme === 'theme1') ||
        (cat === 'luxury' && item.theme === 'theme2') ||
        (cat === 'poolvilla' && item.theme === 'theme3') ||
        (cat === 'goodbye' && item.theme === 'theme4') ||
        (item.themeName && item.themeName.toLowerCase().includes(cat))
      );
      if (!matchesTheme) return false;
    }

    // 3. Tag Filter
    if (state.stayTag !== 'all') {
      const t = state.stayTag;
      const allTags = (item.tags || []).concat(item.amenities || []).join(' ').toLowerCase();
      let match = false;
      if (t === 'pool' && (allTags.includes('수영장') || allTags.includes('인피니티풀') || allTags.includes('루프탑풀') || allTags.includes('풀') || item.category === '풀빌라')) match = true;
      else if (t === 'beach' && (allTags.includes('오션') || allTags.includes('비치') || allTags.includes('해변') || allTags.includes('바다'))) match = true;
      else if (t === 'private_pool' && (allTags.includes('단독') || allTags.includes('프라이빗') || allTags.includes('개별') || item.category === '풀빌라')) match = true;
      else if (t === 'budget' && (item.pricePerNightVnd <= 1000000 || allTags.includes('가성비') || allTags.includes('5만') || item.theme === 'theme1' || item.theme === 'theme4')) match = true;
      else if (t === 'shopping' && (allTags.includes('야시장') || allTags.includes('쇼핑') || allTags.includes('시내') || allTags.includes('마트') || (item.nearbySpots || []).some(s => s.includes('야시장') || s.includes('마트')))) match = true;
      else if ((item.tags || []).includes(t)) match = true;

      if (!match) return false;
    }

    // 4. Search Filter
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const inNameKo = (item.nameKo || '').toLowerCase().includes(q);
      const inNameEn = (item.nameEn || '').toLowerCase().includes(q);
      const inNameVi = (item.nameVi || '').toLowerCase().includes(q);
      const inArea = (item.area || '').toLowerCase().includes(q);
      const inAddress = (item.address || '').toLowerCase().includes(q);
      const inAddressVi = (item.addressVi || '').toLowerCase().includes(q);
      const inCategory = (item.category || '').toLowerCase().includes(q);
      const inTheme = (item.themeName || '').toLowerCase().includes(q);
      const inTags = (item.tags || []).some(tag => tag.toLowerCase().includes(q));
      const inAmenities = (item.amenities || []).some(amenity => amenity.toLowerCase().includes(q));
      const inHighlights = (item.highlights || []).some(hl => hl.toLowerCase().includes(q));
      const inNearby = (item.nearbySpots || []).some(spot => spot.toLowerCase().includes(q));

      if (!inNameKo && !inNameEn && !inNameVi && !inArea && !inAddress && !inAddressVi && !inCategory && !inTheme && !inTags && !inAmenities && !inHighlights && !inNearby) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (state.sortBy === 'rating') return (b.rating * 10000 + b.reviewCount) - (a.rating * 10000 + a.reviewCount);
    if (state.sortBy === 'price-asc') return a.pricePerNightVnd - b.pricePerNightVnd;
    if (state.sortBy === 'price-desc') return b.pricePerNightVnd - a.pricePerNightVnd;
    return 0;
  });
}

export function renderStays() {
  const staysCardsGrid = document.getElementById('staysCardsGridContainer');
  const stayResultCountText = document.getElementById('stayResultCountText');
  if (!staysCardsGrid) return;
  
  const list = getFilteredStays();
  if (stayResultCountText) {
    stayResultCountText.innerHTML = `총 <strong>${list.length}</strong>개의 테마별 추천 숙소`;
  }

  if (list.length === 0) {
    staysCardsGrid.innerHTML = `
      <div class="empty-state">
        <div class="icon">🏨</div>
        <h3>조건에 맞는 숙소가 없습니다</h3>
        <p>필터 조건을 초기화하거나 다른 검색어로 찾아보세요.</p>
        <button class="btn-reset-filters" id="btnResetStayFilters">필터 전체 초기화</button>
      </div>
    `;
    const resetBtn = document.getElementById('btnResetStayFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const evt = new CustomEvent('reset-filters');
        window.dispatchEvent(evt);
      });
    }
    return;
  }

  staysCardsGrid.innerHTML = list.map(item => {
    const isWish = state.stayWishlist.includes(item.id);
    const userNote = state.stayNotes[item.id];
    const coverPhoto = item.coverImage || (item.images && item.images[0]) || '';
    const tagsPreview = (item.tags || []).slice(0, 3).map(t => `<span class="mini-tag">#${t}</span>`).join('');

    return `
      <div class="activity-card stay-card" data-sid="${item.id}">
        <div class="card-media-wrapper">
          <img src="${coverPhoto}" alt="${item.nameKo}" class="card-img" loading="lazy" />
          <span class="stay-badge-theme">${item.themeName}</span>
          <span class="stay-badge-cat">${item.category}</span>
          <button class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-sid="${item.id}" title="숙소 찜하기" aria-label="숙소 찜하기">
            ${isWish ? '♥' : '♡'}
          </button>
        </div>
        <div class="card-body">
          <div class="card-header-line">
            <span class="card-title">${item.nameKo}</span>
            <span class="card-rating">
              <span class="star">★</span>
              <span>${item.rating}</span>
            </span>
          </div>
          <div class="stay-name-vi">
            <span>🇻🇳 ${item.nameVi}</span>
          </div>
          <div class="stay-location-meta">
            <span>📍 ${item.area} · 🕒 입실 ${item.checkIn} / 퇴실 ${item.checkOut}</span>
          </div>
          <div class="card-tag-pill-list" style="margin: 6px 0 2px;">
            ${tagsPreview}
          </div>
          <div class="card-price-line">
            <span class="price-main">${formatVND(item.pricePerNightVnd)}</span>
            <span class="price-krw">(${formatKRW(item.pricePerNightVnd)})</span>
            <span class="price-sub">/ 1박 기준</span>
          </div>
          <div class="stay-card-actions">
            <a href="${item.tripDotComUrl}" target="_blank" rel="noopener noreferrer" class="btn-trip-dot-com" onclick="event.stopPropagation();">
              🏨 트립닷컴 예약 ↗
            </a>
            <a href="${item.googleMapUrl}" target="_blank" rel="noopener noreferrer" class="btn-stay-map" onclick="event.stopPropagation();">
              📍 구글 지도 ↗
            </a>
          </div>
          ${userNote ? `
            <div class="card-note-badge" style="background: #E0F2FE; border-color: #BAE6FD; color: #0369A1; margin-top: 8px;">
              <span>📝</span>
              <span>${escapeHtml(userNote)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  staysCardsGrid.querySelectorAll('.stay-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-heart-btn') || e.target.closest('a')) return;
      const sid = card.dataset.sid;
      const stay = NHA_TRANG_STAYS.find(s => s.id === sid);
      if (stay) openStayModal(stay);
    });
  });

  staysCardsGrid.querySelectorAll('.card-heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStayWishlist(btn.dataset.sid);
      renderStays();
    });
  });
}

function openStayModal(s) {
  state.activeModalStay = s;
  const stayModal = document.getElementById('stayModal');
  
  const setContent = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  };

  const images = (s.images && s.images.length > 0) ? s.images : [s.coverImage];
  const stayModalMainImg = document.getElementById('stayModalMainImg');
  if (stayModalMainImg) {
    stayModalMainImg.src = images[0];
    stayModalMainImg.alt = s.nameKo;
  }

  const stayModalThumbs = document.getElementById('stayModalThumbs');
  if (stayModalThumbs) {
    stayModalThumbs.innerHTML = images.map((img, idx) => `
      <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-index="${idx}" title="사진 ${idx + 1} 보기">
        <img src="${img}" alt="${s.nameKo} 사진 ${idx + 1}" loading="lazy" />
      </div>
    `).join('');

    stayModalThumbs.querySelectorAll('.gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.index, 10);
        if (stayModalMainImg && images[idx]) {
          stayModalMainImg.src = images[idx];
          stayModalThumbs.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        }
      });
    });
  }

  setContent('stayModalBadge', s.category);
  setContent('stayModalCategory', s.category);
  setContent('stayModalThemeBadge', s.themeName);
  setContent('stayModalTitle', s.nameKo);
  setContent('stayModalNameVi', `🇻🇳 ${s.nameVi} (${s.nameEn})`);
  setContent('stayModalRating', `★ ${s.rating} (구글 리뷰 ${s.reviewCount.toLocaleString()}개)`);
  setContent('stayModalPriceRange', s.priceRangeVnd || formatVND(s.pricePerNightVnd));
  setContent('stayModalCheckInOut', `입실 ${s.checkIn} / 퇴실 ${s.checkOut}`);
  setContent('stayModalLocation', s.area);
  setContent('stayModalAddress', s.addressVi);
  setContent('stayModalHighlight', (s.highlights && s.highlights[0]) || `${s.nameKo} - ${s.themeName} 추천 숙소`);

  const setList = (id, items, fallbackIcon) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = (items || []).map(a => `
        <li><span class="bullet">${fallbackIcon}</span> <span>${a}</span></li>
      `).join('');
    }
  };

  setList('stayModalAmenitiesList', s.amenities, '✓');
  setList('stayModalHighlightsList', s.highlights, '🌟');
  setList('stayModalNearbyList', s.nearbySpots, '📍');

  setContent('stayModalTip', (s.highlights && s.highlights[1]) 
    ? `${s.highlights[1]} 체크인 시 ${s.checkIn}에 맞춰 프런트에 예약자 영문명과 바우처를 제시하시면 신속한 입실이 가능합니다.` 
    : `편안한 투숙을 위해 체크인(${s.checkIn})과 체크아웃(${s.checkOut}) 시간을 미리 확인해주세요.`
  );

  const stayNoteInput = document.getElementById('stayNoteInput');
  const stayNoteStatus = document.getElementById('stayNoteStatus');
  if (stayNoteInput) stayNoteInput.value = state.stayNotes[s.id] || '';
  if (stayNoteStatus) stayNoteStatus.textContent = '';

  setContent('stayModalAvgPrice', formatVND(s.pricePerNightVnd));
  setContent('stayModalAvgKrw', `(${formatKRW(s.pricePerNightVnd)})`);
  setContent('stayModalPricePer', `/ 1박 기준`);

  const stayModalMapBtn = document.getElementById('stayModalMapBtn');
  if (stayModalMapBtn) stayModalMapBtn.href = s.googleMapUrl;
  
  const stayModalTripBtn = document.getElementById('stayModalTripBtn');
  if (stayModalTripBtn) stayModalTripBtn.href = s.tripDotComUrl;

  updateStayModalHeartState();
  if (stayModal) {
    stayModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function updateStayModalHeartState() {
  if (!state.activeModalStay) return;
  const isWish = state.stayWishlist.includes(state.activeModalStay.id);
  const stayModalHeartBtn = document.getElementById('stayModalHeartBtn');
  if (stayModalHeartBtn) {
    stayModalHeartBtn.innerHTML = isWish ? '♥ 찜 완료' : '♡ 찜하기';
    stayModalHeartBtn.classList.toggle('is-wishlisted', isWish);
  }
}

export function closeStayModal() {
  const stayModal = document.getElementById('stayModal');
  if (stayModal) {
    stayModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  state.activeModalStay = null;
}

export function toggleStayWishlist(id) {
  const idx = state.stayWishlist.indexOf(id);
  if (idx > -1) {
    state.stayWishlist.splice(idx, 1);
    showToast('숙소 찜 목록에서 제거되었습니다.');
  } else {
    state.stayWishlist.push(id);
    showToast('♥ 숙소 찜 목록에 추가되었습니다!');
  }
  saveToStorage('nha_trang_stay_wishlist', state.stayWishlist);
  updateWishlistBadge();
  updateStayModalHeartState();
}
