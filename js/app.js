/**
 * Nha Trang Trip 2026 - Main Application Logic
 * Pure Vanilla JS, Zero External Dependencies
 * Works flawlessly in both file:// (local double click) and http(s):// (Vercel)
 */

(function() {
  'use strict';

  // --- 1. Storage Helpers ---
  function loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return fallback;
    }
  }

  function saveToStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // --- 2. Formatting & UI Helpers ---
  function formatVND(num) {
    if (!num) return '0 VND';
    return Number(num).toLocaleString() + ' VND';
  }

  function formatKRW(numVND) {
    if (!numVND) return '약 0원';
    const rate = typeof DEFAULT_EXCHANGE_RATE !== 'undefined' ? DEFAULT_EXCHANGE_RATE : 0.054;
    const krw = Math.round((numVND * rate) / 100) * 100;
    return '약 ' + krw.toLocaleString() + '원';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getIntensityStars(level) {
    const total = 5;
    return '⚡'.repeat(Math.min(level || 3, total));
  }

  function showToast(msg, duration = 2500) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function copyAddress(addressText, btnEl) {
    if (!addressText) return;
    const notifySuccess = () => {
      showToast('📋 베트남어 주소가 복사되었습니다! 그랩(Grab)에 붙여넣기 하세요.');
      if (btnEl) {
        const origText = btnEl.innerHTML;
        btnEl.innerHTML = '✓ 복사완료';
        btnEl.style.borderColor = 'var(--color-sea)';
        btnEl.style.color = 'var(--color-sea)';
        setTimeout(() => {
          btnEl.innerHTML = origText;
          btnEl.style.borderColor = '';
          btnEl.style.color = '';
        }, 2000);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addressText).then(notifySuccess).catch(() => {
        fallbackCopy(addressText, notifySuccess);
      });
    } else {
      fallbackCopy(addressText, notifySuccess);
    }
  }

  function fallbackCopy(text, callback) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
      else showToast('📋 주소가 복사되었습니다!');
    } catch (e) {
      prompt('주소를 복사하세요:', text);
    }
    ta.remove();
  }

  // --- 3. Global Application State ---
  const state = {
    currentTab: 'activities', // 'activities' | 'gourmet' | 'stays' | 'shopping' | 'currency'
    
    // Activities Filter State
    actCategory: 'all',
    actTag: 'all',
    
    // Gourmet Filter State
    gourmetCategory: 'all',
    gourmetTag: 'all',

    // Stays Filter State
    stayCategory: 'all',
    stayTag: 'all',

    // Shopping Filter State
    shoppingCategory: 'all',
    shoppingTag: 'all',

    // Currency Filter State
    currencyCategory: 'all',
    currencyTag: 'all',
    
    // Global Toolbar State
    searchQuery: '',
    sortBy: 'recommended',
    currentView: 'grid', // 'grid' | 'timeline'
    wishlistOnly: false,
    
    // LocalStorage State
    wishlist: loadFromStorage('nha_trang_wishlist', []),
    gourmetWishlist: loadFromStorage('nha_trang_gourmet_wishlist', []),
    stayWishlist: loadFromStorage('nha_trang_stay_wishlist', []),
    shoppingWishlist: loadFromStorage('nha_trang_shopping_wishlist', []),
    currencyWishlist: loadFromStorage('nha_trang_currency_wishlist', []),
    notes: loadFromStorage('nha_trang_notes', {}),
    gourmetNotes: loadFromStorage('nha_trang_gourmet_notes', {}),
    stayNotes: loadFromStorage('nha_trang_stay_notes', {}),
    shoppingNotes: loadFromStorage('nha_trang_shopping_notes', {}),
    currencyNotes: loadFromStorage('nha_trang_currency_notes', {}),
    
    // Active Modals
    activeModalActivity: null,
    activeModalGourmet: null,
    activeModalStay: null,
    activeModalShopping: null,
    activeModalCurrency: null
  };

  function updateWishlistBadge() {
    const total = (state.wishlist ? state.wishlist.length : 0) +
                  (state.gourmetWishlist ? state.gourmetWishlist.length : 0) +
                  (state.stayWishlist ? state.stayWishlist.length : 0) +
                  (state.shoppingWishlist ? state.shoppingWishlist.length : 0) +
                  (state.currencyWishlist ? state.currencyWishlist.length : 0);
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistBtn = document.getElementById('wishlistToggleBtn');
    
    if (wishlistCount) wishlistCount.textContent = total;
    if (wishlistBtn) wishlistBtn.classList.toggle('active', state.wishlistOnly);
  }

  function resetStateFilters() {
    state.actCategory = 'all';
    state.actTag = 'all';
    state.gourmetCategory = 'all';
    state.gourmetTag = 'all';
    state.stayCategory = 'all';
    state.stayTag = 'all';
    state.shoppingCategory = 'all';
    state.shoppingTag = 'all';
    state.currencyCategory = 'all';
    state.currencyTag = 'all';
    state.searchQuery = '';
    state.sortBy = 'recommended';
    state.wishlistOnly = false;
  }

  // --- 4. Activities Domain Logic ---
  function getFilteredActivities() {
    if (typeof NHA_TRANG_ACTIVITIES === 'undefined') return [];
    return NHA_TRANG_ACTIVITIES.filter(item => {
      if (state.wishlistOnly && !state.wishlist.includes(item.id)) return false;
      if (state.actCategory !== 'all' && item.category !== state.actCategory) return false;
      if (state.actTag !== 'all') {
        const tagMap = {
          'wife': ['wife', '인기', '추천', '커플', '인기추천'],
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
        const matchTags = (item.tags || []).some(t => (t || '').toLowerCase().includes(q));
        const matchMapQuery = (item.googleMapQuery || '').toLowerCase().includes(q);
        if (!matchTitle && !matchTitleEn && !matchDesc && !matchLoc && !matchHighlight && !matchCat && !matchTags && !matchMapQuery) return false;
      }
      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (state.sortBy === 'price-asc') return (a.priceVnd || 0) - (b.priceVnd || 0);
      if (state.sortBy === 'price-desc') return (b.priceVnd || 0) - (a.priceVnd || 0);
      return 0; // recommended
    });
  }

  function renderCards() {
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
          window.dispatchEvent(new CustomEvent('reset-filters'));
        });
      }
      return;
    }

    cardsGrid.innerHTML = list.map(item => {
      const isWish = state.wishlist.includes(item.id);
      const userNote = state.notes[item.id];
      const tagBadges = (item.tags || []).slice(0, 3).map(t => {
        let label = t;
        if (t === 'wife' || t === '와이프추천' || t === '와이프픽' || t === '인기추천') label = '💖 인기 추천';
        if (t === 'photo' || t === '인생샷') label = '📸 인생샷';
        if (t === 'spa' || t === '스파' || t === '힐링') label = '💆 힐링 스파';
        if (t === 'rain' || t === '비오는날') label = '☔ 비오는날 추천';
        return `<span class="card-tag-pill">${escapeHtml(label)}</span>`;
      }).join('');

      let dayBadge = '';
      if (item.suggestedDay) {
        dayBadge = item.suggestedDay.split(' ')[0] || '';
      }

      return `
        <div class="activity-card" data-id="${item.id}">
          <div class="card-media-wrapper">
            <img class="card-img" src="${item.imageUrl || (item.images && item.images[0]) || ''}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80'" />
            <span class="card-badge-top-left">${escapeHtml(item.badge || item.categoryLabel || '추천')}</span>
            <button class="card-heart-btn ${isWish ? 'active' : ''}" data-id="${item.id}" title="위시리스트 저장" aria-label="위시리스트 저장">
              ♥
            </button>
            ${dayBadge ? `<span class="card-badge-day">${escapeHtml(dayBadge)}</span>` : ''}
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.title)}</span>
              <span class="card-rating"><span class="star">★</span> ${item.rating || 4.8}</span>
            </div>
            <div class="card-meta-line">
              <span>⏱️ ${escapeHtml(item.duration || '약 2~3시간')}</span>
              <span>•</span>
              <span>📍 ${escapeHtml(item.location || '나트랑')}</span>
            </div>
            <div class="card-tag-pill-list">
              ${tagBadges}
            </div>
            <div class="card-price-line">
              <span class="price-main">${formatVND(item.priceVnd)}</span>
              <span class="price-krw">(${formatKRW(item.priceVnd)})</span>
              <span class="price-sub">/ ${escapeHtml(item.pricePer || '1인')}</span>
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

  function renderTimeline() {
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
              <div class="item-title">${escapeHtml(act.title)}</div>
              <div class="item-meta">
                <span>★ ${act.rating || 4.8}</span>
                <span>•</span>
                <span>${escapeHtml(act.duration || '')}</span>
                <span>•</span>
                <span>${escapeHtml(act.location || '')}</span>
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
            <span class="day-number">${escapeHtml(dayNumberText)}</span>
            <span class="day-date">${escapeHtml(dayDateText || '')}</span>
            <span class="day-theme">${escapeHtml(day.theme || '')}</span>
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

  function toggleWishlist(id) {
    if (!state.wishlist) state.wishlist = [];
    const idx = state.wishlist.indexOf(id);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast('위시리스트에서 제외되었습니다.');
    } else {
      state.wishlist.push(id);
      showToast('♥ 위시리스트에 저장되었습니다!');
    }
    saveToStorage('nha_trang_wishlist', state.wishlist);
    updateWishlistBadge();
  }

  function openActivityModal(item) {
    state.activeModalActivity = item;
    const modal = document.getElementById('detailModal');
    if (!modal) return;

    // Gallery
    const galleryGrid = document.getElementById('modalGallery');
    if (galleryGrid) {
      const imgs = (item.images && item.images.length > 0) ? item.images : [item.imageUrl];
      const mainImg = imgs[0] || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80';
      const subImgs = imgs.slice(1, 5);

      galleryGrid.innerHTML = `
        <div class="gallery-main-img-wrap">
          <img class="main-img" src="${mainImg}" alt="${escapeHtml(item.title)}" />
        </div>
        ${subImgs.length > 0 ? `
          <div class="sub-imgs-grid">
            ${subImgs.map(src => `<img src="${src}" alt="갤러리 사진" loading="lazy" />`).join('')}
          </div>
        ` : ''}
      `;
    }

    // Modal Header Fields
    const modalBadge = document.getElementById('modalBadge');
    if (modalBadge) modalBadge.textContent = item.badge || item.categoryLabel || '추천';

    const modalCategory = document.getElementById('modalCategory');
    if (modalCategory) modalCategory.textContent = item.categoryLabel || item.category;

    const modalDay = document.getElementById('modalDay');
    if (modalDay) modalDay.textContent = item.suggestedDay || '일정 추천';

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = item.title;

    const modalTitleEn = document.getElementById('modalTitleEn');
    if (modalTitleEn) modalTitleEn.textContent = item.titleEn || '';

    // Meta Grid
    const modalRating = document.getElementById('modalRating');
    if (modalRating) modalRating.textContent = `★ ${item.rating || 4.8} (구글/트립어드바이저)`;

    const modalDuration = document.getElementById('modalDuration');
    if (modalDuration) modalDuration.textContent = item.duration || '약 2~3시간';

    const modalBestTime = document.getElementById('modalBestTime');
    if (modalBestTime) modalBestTime.textContent = item.bestTime || '오전 중 추천';

    const modalLocation = document.getElementById('modalLocation');
    if (modalLocation) modalLocation.textContent = item.location || '나트랑 시내';

    // Highlight
    const modalHighlight = document.getElementById('modalHighlight');
    if (modalHighlight) modalHighlight.textContent = item.highlight || item.description || '';

    // Couple / Traveler Tip
    const modalCoupleTip = document.getElementById('modalCoupleTip');
    if (modalCoupleTip) modalCoupleTip.textContent = item.coupleTip || item.travelerTip || item.localTip || '즐겁고 안전한 여행 되세요!';

    // Lists
    const setList = (id, list) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!list || list.length === 0) {
        el.innerHTML = '<li>해당 정보는 현장 확인 또는 예약처 안내를 참고하세요.</li>';
      } else {
        el.innerHTML = list.map(li => `<li><span class="bullet">✔</span> ${escapeHtml(li)}</li>`).join('');
      }
    };

    setList('modalIncludedList', item.included);
    setList('modalNotIncludedList', item.notIncluded);
    setList('modalWhatToBringList', item.whatToBring);

    // Note Input
    const noteInput = document.getElementById('modalNoteInput') || document.getElementById('noteInput');
    const noteStatus = document.getElementById('modalNoteStatus') || document.getElementById('noteStatus');
    if (noteInput) {
      noteInput.value = state.notes[item.id] || '';
      if (noteStatus) noteStatus.textContent = '';
    }

    // Price Sticky
    const modalPriceVnd = document.getElementById('modalPriceVnd');
    if (modalPriceVnd) modalPriceVnd.textContent = formatVND(item.priceVnd);

    const modalPriceKrw = document.getElementById('modalPriceKrw');
    if (modalPriceKrw) modalPriceKrw.textContent = `(${formatKRW(item.priceVnd)})`;

    const modalPricePer = document.getElementById('modalPricePer');
    if (modalPricePer) modalPricePer.textContent = `/ ${item.pricePer || '1인 기준'}`;

    // Action Buttons
    const heartBtn = document.getElementById('modalHeartBtn');
    if (heartBtn) {
      const isWish = state.wishlist.includes(item.id);
      heartBtn.textContent = isWish ? '♥ 찜 취소' : '♡ 찜하기';
      heartBtn.onclick = () => {
        toggleWishlist(item.id);
        const updatedWish = state.wishlist.includes(item.id);
        heartBtn.textContent = updatedWish ? '♥ 찜 취소' : '♡ 찜하기';
        renderCards();
      };
    }

    const mapLink = document.getElementById('modalMapLink');
    if (mapLink) {
      const query = item.googleMapQuery || item.titleEn || item.title;
      mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ' Nha Trang')}`;
    }

    const reserveLink = document.getElementById('modalReserveLink');
    if (reserveLink) {
      reserveLink.href = item.reserveUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' Nha Trang')}`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeActivityModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    state.activeModalActivity = null;
  }

  // --- 5. Gourmet Domain Logic ---
  function getFilteredGourmets() {
    if (typeof NHA_TRANG_GOURMETS === 'undefined') return [];
    return NHA_TRANG_GOURMETS.filter(item => {
      if (state.wishlistOnly && !state.gourmetWishlist.includes(item.id)) return false;
      
      // Category Filter
      if (state.gourmetCategory !== 'all') {
        const cat = state.gourmetCategory;
        const tagStr = (item.tags || []).join(' ');
        let matchCat = false;
        if (cat === 'fruit') {
          matchCat = (item.category === 'fruit' || item.category === 'cafe' || item.category === 'dessert' || (item.categoryLabel && (item.categoryLabel.includes('카페') || item.categoryLabel.includes('디저트') || item.categoryLabel.includes('생과일'))));
        } else if (cat === 'rice') {
          matchCat = (item.category === 'rice' || (item.category === 'vietnamese' && (tagStr.includes('가정식') || tagStr.includes('솥밥') || tagStr.includes('치킨라이스') || tagStr.includes('닭고기밥') || tagStr.includes('전통') || tagStr.includes('식당'))) || tagStr.includes('가정식') || tagStr.includes('솥밥') || tagStr.includes('치킨라이스') || tagStr.includes('닭고기밥') || tagStr.includes('껌땀') || tagStr.includes('누룽지'));
        } else if (cat === 'pho') {
          matchCat = (item.category === 'pho' || item.category === 'bunca' || tagStr.includes('쌀국수') || tagStr.includes('분짜') || tagStr.includes('분까') || tagStr.includes('분보') || (item.category === 'vietnamese' && tagStr.includes('쌀국수')) || (item.categoryLabel && (item.categoryLabel.includes('쌀국수') || item.categoryLabel.includes('분짜'))));
        } else if (cat === 'banhxeo') {
          matchCat = (item.category === 'banhxeo' || tagStr.includes('반쎄오') || tagStr.includes('넴느엉') || tagStr.includes('반깐') || (item.categoryLabel && item.categoryLabel.includes('반쎄오')));
        } else if (cat === 'seafood') {
          matchCat = (item.category === 'seafood' || (item.categoryLabel && item.categoryLabel.includes('해산물')) || tagStr.includes('해산물') || tagStr.includes('조개'));
        } else if (cat === 'banhmi') {
          matchCat = (item.category === 'banhmi' || tagStr.includes('반미'));
        } else {
          matchCat = (item.category === cat);
        }
        if (!matchCat) return false;
      }

      // Tag Filter
      if (state.gourmetTag !== 'all') {
        const gt = state.gourmetTag;
        const tagStr = (item.tags || []).join(' ');
        let matchTag = false;
        if (gt === 'line' && (tagStr.includes('줄서는') || tagStr.includes('1위') || tagStr.includes('인기') || tagStr.includes('성지') || tagStr.includes('명가') || tagStr.includes('단골'))) matchTag = true;
        else if (gt === 'ac' && (tagStr.includes('에어컨') || tagStr.includes('냉방') || tagStr.includes('쾌적') || tagStr.includes('위생'))) matchTag = true;
        else if (gt === 'breakfast' && (tagStr.includes('아침') || tagStr.includes('모닝') || tagStr.includes('해장') || (item.openHours && (item.openHours.startsWith('05:') || item.openHours.startsWith('06:') || item.openHours.startsWith('07:'))))) matchTag = true;
        else if (gt === 'seafood' && (tagStr.includes('정찰제') || tagStr.includes('해산물') || tagStr.includes('조개') || item.category === 'seafood')) matchTag = true;
        else if (gt === 'night' && (tagStr.includes('야간') || tagStr.includes('야식') || tagStr.includes('맥주') || tagStr.includes('심야') || (item.openHours && (item.openHours.includes('23:') || item.openHours.includes('24:') || item.openHours.includes('02:'))))) matchTag = true;
        else if (item.tags && item.tags.includes(gt)) matchTag = true;
        if (!matchTag) return false;
      }
      
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchName = (item.name || '').toLowerCase().includes(q);
        const matchNameVi = (item.nameVi || '').toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        const matchLoc = (item.location || '').toLowerCase().includes(q);
        const matchHighlight = (item.highlight || '').toLowerCase().includes(q);
        const matchBadge = (item.badge || '').toLowerCase().includes(q);
        const matchCatLabel = (item.categoryLabel || '').toLowerCase().includes(q);
        const matchTags = (item.tags || []).some(t => (t || '').toLowerCase().includes(q));
        const matchMenu = (item.signatureMenu || []).some(m => {
          const mStr = typeof m === 'string' ? m : (m.name + ' ' + m.desc);
          return mStr.toLowerCase().includes(q);
        });
        if (!matchName && !matchNameVi && !matchDesc && !matchLoc && !matchHighlight && !matchBadge && !matchCatLabel && !matchTags && !matchMenu) return false;
      }
      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'rating') return ((b.rating || 0) * 10000 + (b.reviewCount || 0)) - ((a.rating || 0) * 10000 + (a.reviewCount || 0));
      if (state.sortBy === 'price-asc') return (a.avgPriceVnd || 0) - (b.avgPriceVnd || 0);
      if (state.sortBy === 'price-desc') return (b.avgPriceVnd || 0) - (a.avgPriceVnd || 0);
      return 0;
    });
  }

  function renderGourmets() {
    const gourmetCardsGrid = document.getElementById('gourmetCardsGridContainer');
    const gourmetResultCountText = document.getElementById('gourmetResultCountText');
    if (!gourmetCardsGrid) return;

    const list = getFilteredGourmets();
    if (gourmetResultCountText) {
      gourmetResultCountText.innerHTML = `총 <strong>${list.length}</strong>개의 현지인 찐 맛집`;
    }

    if (list.length === 0) {
      gourmetCardsGrid.innerHTML = `
        <div class="empty-state">
          <div class="icon">🍜</div>
          <h3>조건에 맞는 맛집이 없습니다</h3>
          <p>필터 조건을 초기화하거나 다른 메뉴·식당 이름으로 찾아보세요.</p>
          <button class="btn-reset-filters" id="btnResetGourmetFilters">필터 전체 초기화</button>
        </div>
      `;
      const resetBtn = document.getElementById('btnResetGourmetFilters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('reset-filters'));
        });
      }
      return;
    }

    gourmetCardsGrid.innerHTML = list.map(item => {
      const isWish = (state.gourmetWishlist || []).includes(item.id);
      const userNote = (state.gourmetNotes || {})[item.id];
      const tagBadges = (item.tags || []).slice(0, 3).map(t => `<span class="card-tag-pill">${escapeHtml(t)}</span>`).join('');
      
      const sigPreview = (item.signatureMenu && item.signatureMenu.length > 0)
        ? (typeof item.signatureMenu[0] === 'string' ? item.signatureMenu[0] : item.signatureMenu[0].name)
        : '';

      return `
        <div class="activity-card gourmet-card" data-id="${item.id}">
          <div class="card-media-wrapper" style="background: #1E293B; min-height: 180px; display: flex; flex-direction: column; justify-content: space-between; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; z-index: 2;">
              <span class="card-badge-top-left" style="background: rgba(255,255,255,0.95); color: #0F172A;">${escapeHtml(item.badge || item.categoryLabel || '맛집')}</span>
              <button class="card-heart-btn ${isWish ? 'active' : ''}" data-id="${item.id}" title="위시리스트 저장" aria-label="위시리스트 저장" style="position: static;">
                ♥
              </button>
            </div>
            <div style="color: white; z-index: 2;">
              <div style="font-size: 0.75rem; color: #94A3B8; font-weight: 600;">Google Maps 인증 맛집</div>
              <div style="font-size: 1.15rem; font-weight: 800; line-height: 1.3; margin-top: 2px;">${escapeHtml(item.name)}</div>
              <div style="font-size: 0.8rem; color: #CBD5E1; opacity: 0.9;">${escapeHtml(item.nameVi || '')}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.name)}</span>
              <span class="card-rating" style="color: #EA580C;"><span class="star">★</span> ${item.rating || 4.5} <span style="font-size: 0.75rem; color: var(--color-text-tertiary);">(${Number(item.reviewCount || 0).toLocaleString()})</span></span>
            </div>
            <div class="card-meta-line">
              <span>⏰ ${escapeHtml(item.openHours || '영업시간 확인')}</span>
              <span>•</span>
              <span>📍 ${escapeHtml(item.location || '나트랑')}</span>
            </div>
            <div class="card-tag-pill-list">
              ${tagBadges}
            </div>
            ${sigPreview ? `
              <div style="font-size: 0.82rem; color: var(--color-ocean); font-weight: 600; margin: 4px 0 2px 0;">
                ⭐ 대표: ${escapeHtml(sigPreview)}
              </div>
            ` : ''}
            <div class="card-price-line">
              <span class="price-main">${formatVND(item.avgPriceVnd)}</span>
              <span class="price-krw">(${formatKRW(item.avgPriceVnd)})</span>
              <span class="price-sub">/ 1인 예상</span>
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

    gourmetCardsGrid.querySelectorAll('.gourmet-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-heart-btn')) return;
        const id = card.dataset.id;
        const gourmet = NHA_TRANG_GOURMETS.find(g => g.id === id);
        if (gourmet) openGourmetModal(gourmet);
      });
    });

    gourmetCardsGrid.querySelectorAll('.card-heart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleGourmetWishlist(btn.dataset.id);
        renderGourmets();
      });
    });
  }

  function toggleGourmetWishlist(id) {
    if (!state.gourmetWishlist) state.gourmetWishlist = [];
    const idx = state.gourmetWishlist.indexOf(id);
    if (idx > -1) {
      state.gourmetWishlist.splice(idx, 1);
      showToast('맛집 위시리스트에서 제외되었습니다.');
    } else {
      state.gourmetWishlist.push(id);
      showToast('♥ 맛집 위시리스트에 저장되었습니다!');
    }
    saveToStorage('nha_trang_gourmet_wishlist', state.gourmetWishlist);
    updateWishlistBadge();
  }

  function openGourmetModal(item) {
    state.activeModalGourmet = item;
    const modal = document.getElementById('gourmetModal');
    if (!modal) return;

    const modalBadge = document.getElementById('gourmetModalBadge');
    if (modalBadge) modalBadge.textContent = item.badge || item.categoryLabel || '인기맛집';

    const modalCategory = document.getElementById('gourmetModalCategory');
    if (modalCategory) modalCategory.textContent = item.categoryLabel || item.category;

    const modalTitle = document.getElementById('gourmetModalTitle');
    if (modalTitle) modalTitle.textContent = item.name;

    const modalNameVi = document.getElementById('gourmetModalNameVi');
    if (modalNameVi) modalNameVi.textContent = item.nameVi || item.name;

    const modalRating = document.getElementById('gourmetModalRating');
    if (modalRating) modalRating.textContent = `★ ${item.rating || 4.5} (${Number(item.reviewCount || 0).toLocaleString()}개 구글 리뷰)`;

    const modalHours = document.getElementById('gourmetModalHours');
    if (modalHours) modalHours.textContent = item.openHours || '영업시간 확인 권장';

    const modalPriceRange = document.getElementById('gourmetModalPriceRange');
    if (modalPriceRange) modalPriceRange.textContent = item.priceRange || `${formatVND(item.avgPriceVnd)} 내외`;

    const modalMeal = document.getElementById('gourmetModalMeal');
    if (modalMeal) modalMeal.textContent = item.recommendedMeal || '점심 / 저녁';

    const modalAddress = document.getElementById('gourmetModalAddress');
    if (modalAddress) modalAddress.textContent = item.addressVi || item.location;

    const modalHighlight = document.getElementById('gourmetModalHighlight');
    if (modalHighlight) modalHighlight.textContent = item.highlight || item.description;

    const modalDesc = document.getElementById('gourmetModalDesc');
    if (modalDesc) modalDesc.textContent = item.description || '';

    const menuList = document.getElementById('gourmetModalMenuList');
    if (menuList) {
      if (item.signatureMenu && item.signatureMenu.length > 0) {
        menuList.innerHTML = item.signatureMenu.map(m => {
          if (typeof m === 'string') return `<li><span class="bullet">⭐</span> <strong>${escapeHtml(m)}</strong></li>`;
          return `
            <li>
              <span class="bullet">⭐</span>
              <strong>${escapeHtml(m.name)}</strong>
              ${m.price ? `<span style="color: var(--color-sea); font-weight: 700; margin-left: 8px;">(${escapeHtml(m.price)})</span>` : ''}
              ${m.desc ? `<div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 2px;">${escapeHtml(m.desc)}</div>` : ''}
            </li>
          `;
        }).join('');
      } else {
        menuList.innerHTML = '<li>현장 메뉴판을 참고하세요.</li>';
      }
    }

    const modalTip = document.getElementById('gourmetModalTip');
    if (modalTip) modalTip.textContent = item.localTip || '웨이팅이 있을 수 있으니 여유 있게 방문하세요.';

    const noteInput = document.getElementById('gourmetNoteInput');
    const noteStatus = document.getElementById('gourmetNoteStatus');
    if (noteInput) {
      noteInput.value = (state.gourmetNotes || {})[item.id] || '';
      if (noteStatus) noteStatus.textContent = '';
    }

    const avgPrice = document.getElementById('gourmetModalAvgPrice');
    if (avgPrice) avgPrice.textContent = formatVND(item.avgPriceVnd);

    const avgKrw = document.getElementById('gourmetModalAvgKrw');
    if (avgKrw) avgKrw.textContent = `(${formatKRW(item.avgPriceVnd)})`;

    const pricePer = document.getElementById('gourmetModalPricePer');
    if (pricePer) pricePer.textContent = '/ 1인 예상';

    const heartBtn = document.getElementById('gourmetModalHeartBtn');
    if (heartBtn) {
      const isWish = (state.gourmetWishlist || []).includes(item.id);
      heartBtn.textContent = isWish ? '♥ 찜 취소' : '♡ 찜하기';
      heartBtn.onclick = () => {
        toggleGourmetWishlist(item.id);
        const updated = (state.gourmetWishlist || []).includes(item.id);
        heartBtn.textContent = updated ? '♥ 찜 취소' : '♡ 찜하기';
        renderGourmets();
      };
    }

    const photosBtn = document.getElementById('gourmetModalPhotosBtn');
    if (photosBtn) photosBtn.href = item.photosUrl || item.mapUrl || '#';

    const officialBtn = document.getElementById('gourmetModalOfficialBtn');
    if (officialBtn) officialBtn.href = item.photosUrl || item.mapUrl || '#';

    const mapBtn = document.getElementById('gourmetModalMapBtn');
    if (mapBtn) mapBtn.href = item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.name) + ' Nha Trang')}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGourmetModal() {
    const modal = document.getElementById('gourmetModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    state.activeModalGourmet = null;
  }

  // --- 6. Stays Domain Logic ---
  function getFilteredStays() {
    if (typeof NHA_TRANG_STAYS === 'undefined') return [];
    return NHA_TRANG_STAYS.filter(item => {
      if (state.wishlistOnly && !state.stayWishlist.includes(item.id)) return false;

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

      if (state.stayTag !== 'all') {
        const t = state.stayTag;
        const allTags = (item.tags || []).concat(item.amenities || []).join(' ').toLowerCase();
        let match = false;
        if (t === 'pool' && (allTags.includes('수영장') || allTags.includes('인피니티풀') || allTags.includes('루프탑풀') || allTags.includes('풀') || item.category === '풀빌라')) match = true;
        else if (t === 'beach' && (allTags.includes('오션') || allTags.includes('비치') || allTags.includes('해변') || allTags.includes('바다'))) match = true;
        else if (t === 'private_pool' && (allTags.includes('단독') || allTags.includes('프라이빗') || allTags.includes('개별') || item.category === '풀빌라')) match = true;
        else if (t === 'budget' && ((item.pricePerNightVnd || 0) <= 1000000 || allTags.includes('가성비') || allTags.includes('5만') || item.theme === 'theme1' || item.theme === 'theme4')) match = true;
        else if (t === 'shopping' && (allTags.includes('야시장') || allTags.includes('쇼핑') || allTags.includes('시내') || allTags.includes('마트') || (item.nearbySpots || []).some(s => (s || '').includes('야시장') || (s || '').includes('마트')))) match = true;
        else if ((item.tags || []).includes(t)) match = true;

        if (!match) return false;
      }

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
        const inTags = (item.tags || []).some(tag => (tag || '').toLowerCase().includes(q));
        const inAmenities = (item.amenities || []).some(amenity => (amenity || '').toLowerCase().includes(q));
        const inHighlights = (item.highlights || []).some(hl => (hl || '').toLowerCase().includes(q));
        const inNearby = (item.nearbySpots || []).some(spot => (spot || '').toLowerCase().includes(q));

        if (!inNameKo && !inNameEn && !inNameVi && !inArea && !inAddress && !inAddressVi && !inCategory && !inTheme && !inTags && !inAmenities && !inHighlights && !inNearby) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'rating') return ((b.rating || 0) * 10000 + (b.reviewCount || 0)) - ((a.rating || 0) * 10000 + (a.reviewCount || 0));
      if (state.sortBy === 'price-asc') return (a.pricePerNightVnd || 0) - (b.pricePerNightVnd || 0);
      if (state.sortBy === 'price-desc') return (b.pricePerNightVnd || 0) - (a.pricePerNightVnd || 0);
      return 0;
    });
  }

  function renderStays() {
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
          <button class="btn-reset-filters" id="btnResetStaysFilters">필터 전체 초기화</button>
        </div>
      `;
      const resetBtn = document.getElementById('btnResetStaysFilters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('reset-filters'));
        });
      }
      return;
    }

    staysCardsGrid.innerHTML = list.map(item => {
      const isWish = (state.stayWishlist || []).includes(item.id);
      const userNote = (state.stayNotes || {})[item.id];
      const mainImg = (item.photos && item.photos[0]) || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80';
      const themeLabel = item.themeName ? item.themeName.split(' ')[0] : '추천 숙소';
      const amenitiesBadges = (item.amenities || []).slice(0, 3).map(a => `<span class="card-tag-pill">${escapeHtml(a)}</span>`).join('');

      return `
        <div class="activity-card stay-card" data-id="${item.id}">
          <div class="card-media-wrapper">
            <img class="card-img" src="${mainImg}" alt="${escapeHtml(item.nameKo)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80'" />
            <span class="card-badge-top-left stay-badge-cat">${escapeHtml(item.category || '호텔')}</span>
            <span class="stay-badge-theme">${escapeHtml(themeLabel)}</span>
            <button class="card-heart-btn ${isWish ? 'active' : ''}" data-id="${item.id}" title="위시리스트 저장" aria-label="위시리스트 저장">
              ♥
            </button>
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.nameKo)}</span>
              <span class="card-rating" style="color: #2563EB;">
                <span class="star">★</span> ${item.rating || 4.5} 
                <span style="font-size: 0.75rem; color: var(--color-text-tertiary);">(${Number(item.reviewCount || 0).toLocaleString()})</span>
              </span>
            </div>
            <div class="card-meta-line">
              <span>📍 ${escapeHtml(item.area || '나트랑')}</span>
              <span>•</span>
              <span>${escapeHtml(item.checkInOut || '입실 14:00')}</span>
            </div>
            <div class="card-tag-pill-list">
              ${amenitiesBadges}
            </div>
            <div class="card-price-line">
              <span class="price-main">${formatVND(item.pricePerNightVnd)}</span>
              <span class="price-krw">(${formatKRW(item.pricePerNightVnd)})</span>
              <span class="price-sub">/ 1박 기준</span>
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

    staysCardsGrid.querySelectorAll('.stay-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-heart-btn')) return;
        const id = card.dataset.id;
        const stay = NHA_TRANG_STAYS.find(s => s.id === id);
        if (stay) openStayModal(stay);
      });
    });

    staysCardsGrid.querySelectorAll('.card-heart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStayWishlist(btn.dataset.id);
        renderStays();
      });
    });
  }

  function toggleStayWishlist(id) {
    if (!state.stayWishlist) state.stayWishlist = [];
    const idx = state.stayWishlist.indexOf(id);
    if (idx > -1) {
      state.stayWishlist.splice(idx, 1);
      showToast('숙소 위시리스트에서 제외되었습니다.');
    } else {
      state.stayWishlist.push(id);
      showToast('♥ 숙소 위시리스트에 저장되었습니다!');
    }
    saveToStorage('nha_trang_stay_wishlist', state.stayWishlist);
    updateWishlistBadge();
  }

  function openStayModal(item) {
    state.activeModalStay = item;
    const modal = document.getElementById('stayModal');
    if (!modal) return;

    // Gallery
    const mainImgEl = document.getElementById('stayModalMainImg');
    const thumbsRow = document.getElementById('stayModalThumbs');
    const photos = (item.photos && item.photos.length > 0) ? item.photos : ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80'];
    
    if (mainImgEl) {
      mainImgEl.src = photos[0];
      mainImgEl.alt = item.nameKo;
    }
    if (thumbsRow) {
      thumbsRow.innerHTML = photos.map((src, i) => `
        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
          <img src="${src}" alt="숙소 사진 ${i+1}" loading="lazy" />
        </div>
      `).join('');
      
      thumbsRow.querySelectorAll('.gallery-thumb').forEach(th => {
        th.addEventListener('click', () => {
          thumbsRow.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          th.classList.add('active');
          const idx = parseInt(th.dataset.index, 10);
          if (mainImgEl && photos[idx]) mainImgEl.src = photos[idx];
        });
      });
    }

    // Modal Header Fields
    const modalBadge = document.getElementById('stayModalBadge');
    if (modalBadge) modalBadge.textContent = item.badge || '추천';

    const modalCategory = document.getElementById('stayModalCategory');
    if (modalCategory) modalCategory.textContent = item.category || '호텔';

    const modalThemeBadge = document.getElementById('stayModalThemeBadge');
    if (modalThemeBadge) modalThemeBadge.textContent = item.themeName || '테마 숙소';

    const modalTitle = document.getElementById('stayModalTitle');
    if (modalTitle) modalTitle.textContent = item.nameKo;

    const modalNameVi = document.getElementById('stayModalNameVi');
    if (modalNameVi) modalNameVi.textContent = `${item.nameVi || ''} (${item.nameEn || ''})`;

    const modalRating = document.getElementById('stayModalRating');
    if (modalRating) modalRating.textContent = `★ ${item.rating || 4.5} (${Number(item.reviewCount || 0).toLocaleString()}개 구글 리뷰)`;

    const modalPriceRange = document.getElementById('stayModalPriceRange');
    if (modalPriceRange) modalPriceRange.textContent = item.priceRange || `${formatVND(item.pricePerNightVnd)} / 1박`;

    const modalCheckInOut = document.getElementById('stayModalCheckInOut');
    if (modalCheckInOut) modalCheckInOut.textContent = item.checkInOut || '입실 14:00 / 퇴실 12:00';

    const modalLocation = document.getElementById('stayModalLocation');
    if (modalLocation) modalLocation.textContent = `${item.area || '시내'} / ${item.address || ''}`;

    const modalAddress = document.getElementById('stayModalAddress');
    if (modalAddress) modalAddress.textContent = item.addressVi || item.address;

    const modalHighlight = document.getElementById('stayModalHighlight');
    if (modalHighlight) modalHighlight.textContent = (item.highlights && item.highlights[0]) || item.nameKo;

    // Lists
    const setList = (id, list) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!list || list.length === 0) {
        el.innerHTML = '<li>상세 정보는 예약 페이지를 확인하세요.</li>';
      } else {
        el.innerHTML = list.map(li => `<li><span class="bullet">✔</span> ${escapeHtml(li)}</li>`).join('');
      }
    };

    setList('stayModalAmenitiesList', item.amenities);
    setList('stayModalHighlightsList', item.highlights);
    setList('stayModalNearbyList', item.nearbySpots);

    const modalTip = document.getElementById('stayModalTip');
    if (modalTip) modalTip.textContent = item.localTip || item.coupleTip || '체크인 시 고층이나 오션뷰 배정을 요청해보세요.';

    const noteInput = document.getElementById('stayNoteInput');
    const noteStatus = document.getElementById('stayNoteStatus');
    if (noteInput) {
      noteInput.value = (state.stayNotes || {})[item.id] || '';
      if (noteStatus) noteStatus.textContent = '';
    }

    const avgPrice = document.getElementById('stayModalAvgPrice');
    if (avgPrice) avgPrice.textContent = formatVND(item.pricePerNightVnd);

    const avgKrw = document.getElementById('stayModalAvgKrw');
    if (avgKrw) avgKrw.textContent = `(${formatKRW(item.pricePerNightVnd)})`;

    const pricePer = document.getElementById('stayModalPricePer');
    if (pricePer) pricePer.textContent = '/ 1박 기준';

    const heartBtn = document.getElementById('stayModalHeartBtn');
    if (heartBtn) {
      const isWish = (state.stayWishlist || []).includes(item.id);
      heartBtn.textContent = isWish ? '♥ 찜 취소' : '♡ 찜하기';
      heartBtn.onclick = () => {
        toggleStayWishlist(item.id);
        const updated = (state.stayWishlist || []).includes(item.id);
        heartBtn.textContent = updated ? '♥ 찜 취소' : '♡ 찜하기';
        renderStays();
      };
    }

    const mapBtn = document.getElementById('stayModalMapBtn');
    if (mapBtn) mapBtn.href = item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.nameKo) + ' Nha Trang')}`;

    const tripBtn = document.getElementById('stayModalTripBtn');
    if (tripBtn) tripBtn.href = item.bookingUrl || item.mapUrl || '#';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeStayModal() {
    const modal = document.getElementById('stayModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    state.activeModalStay = null;
  }

  // --- 7. Shopping Domain Logic ---
  function getFilteredShopping() {
    if (typeof NHA_TRANG_SHOPPING === 'undefined') return [];

    return NHA_TRANG_SHOPPING.filter(item => {
      if (state.wishlistOnly && !state.shoppingWishlist.includes(item.id)) return false;

      if (state.shoppingCategory !== 'all') {
        if (item.category !== state.shoppingCategory) return false;
      }

      if (state.shoppingTag !== 'all') {
        const t = state.shoppingTag;
        let match = false;
        const allText = [
          ...(item.tags || []),
          ...(item.facilities || []),
          ...(item.paymentMethods || []),
          item.qualityTier || '',
          item.category || ''
        ].join(' ').toLowerCase();

        if (t === 'ac') {
          if (item.hasAirConditioning || allText.includes('에어컨')) match = true;
        } else if (t === 'fixed') {
          if (item.bargainingRequired === false || allText.includes('정찰')) match = true;
        } else if (t === 'transfer') {
          if (allText.includes('계좌이체') || allText.includes('원화') || allText.includes('gln') || allText.includes('카카오페이')) match = true;
        } else if (t === 'bargain') {
          if (item.bargainingRequired === true || allText.includes('흥정')) match = true;
        } else if (t === 'mirror_tier') {
          if (item.category === 'boutique_mirror' || allText.includes('미러') || allText.includes('sa급')) match = true;
        } else if (t === 'value') {
          if (allText.includes('가성비') || (item.avgPriceVnd || 0) <= 250000 || item.category === 'dam_market') match = true;
        } else if ((item.tags || []).includes(t)) {
          match = true;
        }

        if (!match) return false;
      }

      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const inName = (item.name || '').toLowerCase().includes(q);
        const inNameKo = (item.nameKo || '').toLowerCase().includes(q);
        const inNameVi = (item.nameVi || '').toLowerCase().includes(q);
        const inNameEn = (item.nameEn || '').toLowerCase().includes(q);
        const inCategory = (item.categoryLabel || '').toLowerCase().includes(q);
        const inLocation = (item.location || '').toLowerCase().includes(q);
        const inAddress = (item.addressVi || '').toLowerCase().includes(q);
        const inQuality = (item.qualityTier || '').toLowerCase().includes(q);
        const inHighlight = (item.highlight || '').toLowerCase().includes(q);
        const inDesc = (item.description || '').toLowerCase().includes(q);
        const inTip = (item.localTip || '').toLowerCase().includes(q);
        const inTags = (item.tags || []).some(tag => (tag || '').toLowerCase().includes(q));
        const inFacilities = (item.facilities || []).some(fac => (fac || '').toLowerCase().includes(q));
        const inSignature = (item.signatureItems || []).some(sig => (sig || '').toLowerCase().includes(q));
        const inBargain = (item.bargainingGuide || []).some(bg => (bg.item || '').toLowerCase().includes(q) || (bg.tip || '').toLowerCase().includes(q));
        const inSentiment = item.sentimentAnalysis ? (
          (item.sentimentAnalysis.communityVerdict || '').toLowerCase().includes(q) ||
          (item.sentimentAnalysis.pros || []).some(p => (p || '').toLowerCase().includes(q)) ||
          (item.sentimentAnalysis.cons || []).some(c => (c || '').toLowerCase().includes(q)) ||
          (item.sentimentAnalysis.scamWarning || '').toLowerCase().includes(q)
        ) : false;

        if (!inName && !inNameKo && !inNameVi && !inNameEn && !inCategory && !inLocation && !inAddress && !inQuality && !inHighlight && !inDesc && !inTip && !inTags && !inFacilities && !inSignature && !inBargain && !inSentiment) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'rating') return ((b.rating || 0) * 10000 + (b.reviewCount || 0)) - ((a.rating || 0) * 10000 + (a.reviewCount || 0));
      if (state.sortBy === 'price-asc') return (a.avgPriceVnd || 0) - (b.avgPriceVnd || 0);
      if (state.sortBy === 'price-desc') return (b.avgPriceVnd || 0) - (a.avgPriceVnd || 0);
      return 0;
    });
  }

  function renderShopping() {
    const shoppingCardsGrid = document.getElementById('shoppingCardsGridContainer');
    const shoppingResultCountText = document.getElementById('shoppingResultCountText');
    if (!shoppingCardsGrid) return;

    const list = getFilteredShopping();
    if (shoppingResultCountText) {
      shoppingResultCountText.innerHTML = `총 <strong>${list.length}</strong>개의 검증 쇼핑 스팟`;
    }

    if (list.length === 0) {
      shoppingCardsGrid.innerHTML = `
        <div class="empty-state">
          <div class="icon">🛍️</div>
          <h3>조건에 맞는 쇼핑 스팟이 없습니다</h3>
          <p>필터 조건을 초기화하거나 다른 검색어로 찾아보세요.</p>
          <button class="btn-reset-filters" id="btnResetShoppingFilters">필터 전체 초기화</button>
        </div>
      `;
      const resetBtn = document.getElementById('btnResetShoppingFilters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('reset-filters'));
        });
      }
      return;
    }

    shoppingCardsGrid.innerHTML = list.map(item => {
      const isWish = (state.shoppingWishlist || []).includes(item.id);
      const userNote = (state.shoppingNotes || {})[item.id];
      const mainImg = (item.photos && item.photos[0]) || 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80';
      const tagPills = (item.tags || []).slice(0, 3).map(t => `<span class="card-tag-pill">${escapeHtml(t)}</span>`).join('');
      const qualityTierBadge = item.qualityTier ? `<span class="shopping-badge-tier">${escapeHtml(item.qualityTier)}</span>` : '';
      const acBadge = item.hasAirConditioning ? `<span class="shopping-badge-ac">❄️ 에어컨</span>` : '';

      return `
        <div class="activity-card shopping-card" data-id="${item.id}">
          <div class="card-media-wrapper">
            <img class="card-img" src="${mainImg}" alt="${escapeHtml(item.nameKo || item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80'" />
            <span class="card-badge-top-left" style="background: rgba(255, 56, 92, 0.95); color: white;">${escapeHtml(item.badge || item.categoryLabel || '쇼핑')}</span>
            ${qualityTierBadge}
            ${acBadge}
            <button class="card-heart-btn ${isWish ? 'active' : ''}" data-id="${item.id}" title="위시리스트 저장" aria-label="위시리스트 저장">
              ♥
            </button>
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.nameKo || item.name)}</span>
              <span class="card-rating" style="color: #FF385C;">
                <span class="star">★</span> ${item.rating || 4.7} 
                <span style="font-size: 0.75rem; color: var(--color-text-tertiary);">(${Number(item.reviewCount || 0).toLocaleString()})</span>
              </span>
            </div>
            <div class="card-meta-line">
              <span>📍 ${escapeHtml(item.location || '나트랑')}</span>
              <span>•</span>
              <span>⏰ ${escapeHtml(item.openHours || '09:00 - 21:00')}</span>
            </div>
            <div class="card-tag-pill-list">
              ${tagPills}
            </div>
            <div class="card-price-line">
              <span class="price-main">${formatVND(item.avgPriceVnd)}</span>
              <span class="price-krw">(${formatKRW(item.avgPriceVnd)})</span>
              <span class="price-sub">/ 평균 기준</span>
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

    shoppingCardsGrid.querySelectorAll('.shopping-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-heart-btn')) return;
        const id = card.dataset.id;
        const spot = NHA_TRANG_SHOPPING.find(s => s.id === id);
        if (spot) openShoppingModal(spot);
      });
    });

    shoppingCardsGrid.querySelectorAll('.card-heart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleShoppingWishlist(btn.dataset.id);
        renderShopping();
      });
    });
  }

  function toggleShoppingWishlist(id) {
    if (!state.shoppingWishlist) state.shoppingWishlist = [];
    const idx = state.shoppingWishlist.indexOf(id);
    if (idx > -1) {
      state.shoppingWishlist.splice(idx, 1);
      showToast('쇼핑 위시리스트에서 제외되었습니다.');
    } else {
      state.shoppingWishlist.push(id);
      showToast('♥ 쇼핑 위시리스트에 저장되었습니다!');
    }
    saveToStorage('nha_trang_shopping_wishlist', state.shoppingWishlist);
    updateWishlistBadge();
  }

  function openShoppingModal(item) {
    state.activeModalShopping = item;
    const modal = document.getElementById('shoppingModal');
    if (!modal) return;

    // Gallery
    const mainImgEl = document.getElementById('shoppingModalMainImg');
    const thumbsRow = document.getElementById('shoppingModalThumbs');
    const photos = (item.photos && item.photos.length > 0) ? item.photos : ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80'];
    
    if (mainImgEl) {
      mainImgEl.src = photos[0];
      mainImgEl.alt = item.nameKo || item.name;
    }
    if (thumbsRow) {
      thumbsRow.innerHTML = photos.map((src, i) => `
        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
          <img src="${src}" alt="매장 사진 ${i+1}" loading="lazy" />
        </div>
      `).join('');

      thumbsRow.querySelectorAll('.gallery-thumb').forEach(th => {
        th.addEventListener('click', () => {
          thumbsRow.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          th.classList.add('active');
          const idx = parseInt(th.dataset.index, 10);
          if (mainImgEl && photos[idx]) mainImgEl.src = photos[idx];
        });
      });
    }

    // Modal Header
    const modalBadge = document.getElementById('shoppingModalBadge');
    if (modalBadge) modalBadge.textContent = item.badge || item.categoryLabel || '쇼핑';

    const modalCategory = document.getElementById('shoppingModalCategory');
    if (modalCategory) modalCategory.textContent = item.categoryLabel || item.category;

    const modalQualityBadge = document.getElementById('shoppingModalQualityBadge');
    if (modalQualityBadge) modalQualityBadge.textContent = item.qualityTier || '품질 인증';

    const modalAcBadge = document.getElementById('shoppingModalAcBadge');
    if (modalAcBadge) {
      modalAcBadge.textContent = item.hasAirConditioning ? '❄️ 에어컨 완비' : '💨 선풍기 가동';
      modalAcBadge.style.display = item.hasAirConditioning ? 'inline-block' : 'none';
    }

    const modalTitle = document.getElementById('shoppingModalTitle');
    if (modalTitle) modalTitle.textContent = item.nameKo || item.name;

    const modalNameVi = document.getElementById('shoppingModalNameVi');
    if (modalNameVi) modalNameVi.textContent = `${item.nameVi || ''} ${item.nameEn ? `(${item.nameEn})` : ''}`;

    const modalRating = document.getElementById('shoppingModalRating');
    if (modalRating) modalRating.textContent = `★ ${item.rating || 4.7} (${Number(item.reviewCount || 0).toLocaleString()}개 구글 리뷰)`;

    const modalHours = document.getElementById('shoppingModalHours');
    if (modalHours) modalHours.textContent = item.openHours || '09:00 - 21:00';

    const modalPriceRange = document.getElementById('shoppingModalPriceRange');
    if (modalPriceRange) modalPriceRange.textContent = item.priceRange || `${formatVND(item.avgPriceVnd)} 내외`;

    const modalLocation = document.getElementById('shoppingModalLocation');
    if (modalLocation) modalLocation.textContent = item.location || '나트랑 시내';

    const modalAddress = document.getElementById('shoppingModalAddress');
    if (modalAddress) modalAddress.textContent = item.addressVi || item.location;

    const modalHighlight = document.getElementById('shoppingModalHighlight');
    if (modalHighlight) modalHighlight.textContent = item.highlight || item.description;

    // Facilities & Payment Badges
    const facilitiesEl = document.getElementById('shoppingModalFacilities');
    if (facilitiesEl) {
      const allFacilities = (item.facilities || []).concat(item.paymentMethods || []);
      if (allFacilities.length > 0) {
        facilitiesEl.innerHTML = allFacilities.map(f => `<span class="facility-pill">${escapeHtml(f)}</span>`).join('');
      } else {
        facilitiesEl.innerHTML = '<span class="facility-pill">현금/카드 결제 가능</span>';
      }
    }

    // Bargaining Table
    const bargainTableEl = document.getElementById('shoppingModalBargainingTable');
    if (bargainTableEl) {
      if (item.bargainingGuide && item.bargainingGuide.length > 0) {
        bargainTableEl.innerHTML = `
          <table class="bargain-table">
            <thead>
              <tr>
                <th>품목</th>
                <th>상인 호가 (부르는 값)</th>
                <th>추천 적정가 (흥정 목표)</th>
                <th>실전 꿀팁</th>
              </tr>
            </thead>
            <tbody>
              ${item.bargainingGuide.map(row => `
                <tr>
                  <td><strong>${escapeHtml(row.item)}</strong></td>
                  <td class="price-asking">${escapeHtml(row.askingPrice || '-')}</td>
                  <td class="price-target">${escapeHtml(row.targetPrice || '-')}</td>
                  <td style="font-size: 0.85rem; color: var(--color-text-secondary);">${escapeHtml(row.tip || '-')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } else {
        bargainTableEl.innerHTML = '<p style="color: var(--color-text-secondary); font-size: 0.9rem;">정찰제 매장이거나 현장 시세에 따라 안내됩니다.</p>';
      }
    }

    // Sentiment Analysis
    const sentimentPanel = document.getElementById('shoppingModalSentimentPanel');
    if (sentimentPanel) {
      if (item.sentimentAnalysis) {
        const sa = item.sentimentAnalysis;
        sentimentPanel.innerHTML = `
          <div class="pros-cons-grid">
            <div class="pros-box">
              <h4>👍 한국인 여행자 칭찬 포인트</h4>
              <ul>
                ${(sa.pros || []).map(p => `<li><span class="bullet">✔</span> ${escapeHtml(p)}</li>`).join('')}
              </ul>
            </div>
            <div class="cons-box">
              <h4>⚠️ 주의 및 아쉬운 점</h4>
              <ul>
                ${(sa.cons || []).map(c => `<li><span class="bullet">✕</span> ${escapeHtml(c)}</li>`).join('')}
              </ul>
            </div>
          </div>
          ${sa.communityVerdict ? `
            <div style="margin-top: 14px; padding: 12px 16px; background: #F8FAFC; border-radius: var(--radius-md); font-size: 0.88rem; color: var(--color-ocean); font-weight: 700;">
              📢 커뮤니티 총평: ${escapeHtml(sa.communityVerdict)}
            </div>
          ` : ''}
          ${sa.scamWarning ? `
            <div style="margin-top: 8px; padding: 10px 14px; background: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 4px; font-size: 0.85rem; color: #991B1B;">
              🚨 호객/눈탱이 방지: ${escapeHtml(sa.scamWarning)}
            </div>
          ` : ''}
        `;
      } else {
        sentimentPanel.innerHTML = '<p style="color: var(--color-text-secondary); font-size: 0.9rem;">커뮤니티 후기 분석 정보 준비 중입니다.</p>';
      }
    }

    // Customs Warning
    const customsWarningText = document.getElementById('shoppingCustomsWarningText');
    if (customsWarningText) {
      customsWarningText.textContent = item.customsCaution || '자가사용 목적 1인 소량 반입을 준수하고 영수증 및 포장 박스/택을 분리하세요.';
    }

    const modalDesc = document.getElementById('shoppingModalDesc');
    if (modalDesc) modalDesc.textContent = item.description || '';

    const modalTip = document.getElementById('shoppingModalTip');
    if (modalTip) modalTip.textContent = item.localTip || '기분 좋은 쇼핑을 위해 가벼운 미소와 함께 흥정해보세요.';

    const noteInput = document.getElementById('shoppingNoteInput');
    const noteStatus = document.getElementById('shoppingNoteStatus');
    if (noteInput) {
      noteInput.value = (state.shoppingNotes || {})[item.id] || '';
      if (noteStatus) noteStatus.textContent = '';
    }

    const avgPrice = document.getElementById('shoppingModalAvgPrice');
    if (avgPrice) avgPrice.textContent = formatVND(item.avgPriceVnd);

    const avgKrw = document.getElementById('shoppingModalAvgKrw');
    if (avgKrw) avgKrw.textContent = `(${formatKRW(item.avgPriceVnd)})`;

    const pricePer = document.getElementById('shoppingModalPricePer');
    if (pricePer) pricePer.textContent = '/ 평균 기준';

    const heartBtn = document.getElementById('shoppingModalHeartBtn');
    if (heartBtn) {
      const isWish = (state.shoppingWishlist || []).includes(item.id);
      heartBtn.textContent = isWish ? '♥ 찜 취소' : '♡ 찜하기';
      heartBtn.onclick = () => {
        toggleShoppingWishlist(item.id);
        const updated = (state.shoppingWishlist || []).includes(item.id);
        heartBtn.textContent = updated ? '♥ 찜 취소' : '♡ 찜하기';
        renderShopping();
      };
    }

    const photosBtn = document.getElementById('shoppingModalPhotosBtn');
    if (photosBtn) photosBtn.href = item.photosUrl || item.mapUrl || '#';

    const mapBtn = document.getElementById('shoppingModalMapBtn');
    if (mapBtn) mapBtn.href = item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.nameKo || item.name) + ' Nha Trang')}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeShoppingModal() {
    const modal = document.getElementById('shoppingModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    state.activeModalShopping = null;
  }

  // --- 8. Currency & ATM Domain Logic ---
  let currentBenchmarkRate = 5.45;

  function formatVerbalVND(vnd) {
    if (!vnd || vnd <= 0) return '0 동 (0k VND)';
    let text = '';
    if (vnd >= 100000000) {
      const eok = Math.floor(vnd / 100000000);
      const man = Math.floor((vnd % 100000000) / 10000);
      text = man > 0 ? `${eok}억 ${man.toLocaleString()}만 동` : `${eok}억 동`;
    } else if (vnd >= 10000) {
      const man = Math.floor(vnd / 10000);
      const rest = vnd % 10000;
      text = rest > 0 ? `${man.toLocaleString()}만 ${rest.toLocaleString()} 동` : `${man.toLocaleString()}만 동`;
    } else {
      text = `${vnd.toLocaleString()} 동`;
    }

    let kText = '';
    if (vnd >= 1000000) {
      const m = vnd / 1000000;
      kText = (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + 'M VND';
    } else if (vnd >= 1000) {
      const k = Math.round(vnd / 1000);
      kText = `${k}k VND`;
    } else {
      kText = `${vnd} VND`;
    }
    return `${text} (${kText})`;
  }

  function formatVerbalKRW(krw) {
    if (!krw || krw <= 0) return '약 0원';
    if (krw >= 100000000) {
      const eok = Math.floor(krw / 100000000);
      const man = Math.floor((krw % 100000000) / 10000);
      const rest = krw % 10000;
      if (man > 0 && rest > 0) return `약 ${eok}억 ${man.toLocaleString()}만 ${rest.toLocaleString()}원`;
      if (man > 0) return `약 ${eok}억 ${man.toLocaleString()}만원`;
      return `약 ${eok}억원`;
    } else if (krw >= 10000) {
      const man = Math.floor(krw / 10000);
      const rest = krw % 10000;
      if (rest > 0) return `약 ${man.toLocaleString()}만 ${rest.toLocaleString()}원`;
      return `약 ${man.toLocaleString()}만원`;
    } else {
      return `약 ${krw.toLocaleString()}원`;
    }
  }

  function getFilteredCurrency() {
    if (typeof NHA_TRANG_CURRENCY === 'undefined') return [];

    return NHA_TRANG_CURRENCY.filter(item => {
      if (state.wishlistOnly && !(state.currencyWishlist || []).includes(item.id)) return false;

      if (state.currencyCategory && state.currencyCategory !== 'all') {
        const cat = state.currencyCategory;
        if (cat === 'atm_zero_fee') {
          if (item.category !== 'atm_zero_fee') return false;
        } else if (cat === 'exchange_gold') {
          if (item.category !== 'exchange_gold') return false;
        } else if (cat === 'exchange_bank') {
          if (item.category !== 'exchange_bank') return false;
        } else if (cat === 'exchange_airport') {
          if (item.category !== 'exchange_airport') return false;
        } else if (cat === 'card_travellog') {
          const cards = (item.supportedCards || []).join(' ');
          const tags = (item.tags || []).join(' ');
          if (!cards.includes('트래블로그') && !tags.includes('트래블로그') && item.category !== 'exchange_gold') return false;
        } else if (cat === 'card_travelwallet') {
          const cards = (item.supportedCards || []).join(' ');
          const tags = (item.tags || []).join(' ');
          if (!cards.includes('트래블월렛') && !tags.includes('트래블월렛') && item.category !== 'exchange_gold') return false;
        } else if (cat === 'card_sol_toss_wibee') {
          const cards = (item.supportedCards || []).join(' ');
          const tags = (item.tags || []).join(' ');
          if (!cards.includes('쏠트래블') && !cards.includes('토스') && !cards.includes('위비') &&
              !tags.includes('신한쏠트래블') && !tags.includes('토스뱅크') && !tags.includes('위비트래블') &&
              item.category !== 'exchange_gold') return false;
        } else if (item.category !== cat) {
          return false;
        }
      }

      if (state.currencyTag && state.currencyTag !== 'all') {
        const t = state.currencyTag;
        let match = false;
        const allText = [
          ...(item.tags || []),
          ...(item.facilities || []),
          ...(item.supportedCards || []),
          ...(item.supportedCurrencies || []),
          ...(item.exchangePerks || []),
          item.badge || '',
          item.category || '',
          item.location || '',
          item.feePolicy || ''
        ].join(' ').toLowerCase();

        if (t === 'fee_free' || t === 'zero_fee') {
          if (item.feeFree === true || allText.includes('수수료 0') || allText.includes('수수료0')) match = true;
        } else if (t === 'travellog') {
          if (allText.includes('트래블로그') || (item.supportedCards && item.supportedCards.some(c => c.includes('트래블로그')))) match = true;
        } else if (t === 'travelwallet') {
          if (allText.includes('트래블월렛') || (item.supportedCards && item.supportedCards.some(c => c.includes('트래블월렛')))) match = true;
        } else if (t === 'sol_travel') {
          if (allText.includes('쏠트래블') || allText.includes('sol') || (item.supportedCards && item.supportedCards.some(c => c.includes('쏠')))) match = true;
        } else if (t === 'toss_bank') {
          if (allText.includes('토스') || (item.supportedCards && item.supportedCards.some(c => c.includes('토스')))) match = true;
        } else if (t === 'wibee') {
          if (allText.includes('위비') || (item.supportedCards && item.supportedCards.some(c => c.includes('위비')))) match = true;
        } else if (t === 'usd100') {
          if (allText.includes('100달러') || allText.includes('신권') || (item.supportedCurrencies && item.supportedCurrencies.some(c => c.includes('100')))) match = true;
        } else if (t === 'livebank_24h') {
          if (allText.includes('livebank') || allText.includes('24시간') || (item.facilities && item.facilities.some(f => f.includes('24시간')))) match = true;
        } else if (t === 'night_market') {
          if (allText.includes('야시장') || allText.includes('여행자거리') || (item.location || '').includes('야시장')) match = true;
        } else if (t === 'korean_atm') {
          if (allText.includes('한국어') || (item.facilities && item.facilities.some(f => f.includes('한국어')))) match = true;
        } else if ((item.tags || []).includes(t)) {
          match = true;
        }

        if (!match) return false;
      }

      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const inName = (item.name || '').toLowerCase().includes(q);
        const inNameKo = (item.nameKo || '').toLowerCase().includes(q);
        const inNameVi = (item.nameVi || '').toLowerCase().includes(q);
        const inNameEn = (item.nameEn || '').toLowerCase().includes(q);
        const inCategory = (item.categoryLabel || '').toLowerCase().includes(q);
        const inLocation = (item.location || '').toLowerCase().includes(q);
        const inAddress = (item.addressVi || '').toLowerCase().includes(q);
        const inDistrict = (item.districtLabel || '').toLowerCase().includes(q);
        const inHighlight = (item.highlight || '').toLowerCase().includes(q);
        const inDesc = (item.description || '').toLowerCase().includes(q);
        const inTip = (item.localTip || '').toLowerCase().includes(q);
        const inFee = (item.feePolicy || '').toLowerCase().includes(q);
        const inLimit = (item.withdrawalLimit || '').toLowerCase().includes(q);
        const inTags = (item.tags || []).some(t => (t || '').toLowerCase().includes(q));
        const inFacilities = (item.facilities || []).some(f => (f || '').toLowerCase().includes(q));
        const inCards = (item.supportedCards || []).some(c => (c || '').toLowerCase().includes(q));
        const inCurrencies = (item.supportedCurrencies || []).some(c => (c || '').toLowerCase().includes(q));
        const inPerks = (item.exchangePerks || []).some(p => (p || '').toLowerCase().includes(q));

        if (!inName && !inNameKo && !inNameVi && !inNameEn && !inCategory && !inLocation && !inAddress &&
            !inDistrict && !inHighlight && !inDesc && !inTip && !inFee && !inLimit && !inTags &&
            !inFacilities && !inCards && !inCurrencies && !inPerks) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'rating') {
        const scoreA = (a.rating || 0) * 100000 + (a.reviewCount || 0);
        const scoreB = (b.rating || 0) * 100000 + (b.reviewCount || 0);
        return scoreB - scoreA;
      }
      if (state.sortBy === 'reviews' || state.sortBy === 'reviewCount') {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (state.sortBy === 'name') {
        return (a.nameKo || a.name).localeCompare(b.nameKo || b.name, 'ko');
      }
      if (state.sortBy === 'price-asc') {
        return (a.avgPriceVnd || 0) - (b.avgPriceVnd || 0);
      }
      if (state.sortBy === 'price-desc') {
        return (b.avgPriceVnd || 0) - (a.avgPriceVnd || 0);
      }
      return 0;
    });
  }

  function renderCurrency() {
    const gridContainer = document.getElementById('currencyCardsGridContainer');
    const countText = document.getElementById('currencyResultCountText');
    if (!gridContainer) return;

    const list = getFilteredCurrency();
    if (countText) {
      countText.innerHTML = `총 <strong>${list.length}</strong>개의 검증 환전소 & 수수료 무료 ATM`;
    }

    if (list.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 48px 24px; text-align: center;">
          <div class="icon" style="font-size: 3rem; margin-bottom: 12px;">💱</div>
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">조건에 맞는 환전소나 ATM이 없습니다</h3>
          <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-bottom: 20px;">
            선택하신 카테고리 또는 태그를 변경하거나 검색어를 초기화해보세요.
          </p>
          <button class="btn-primary-reserve" id="btnResetCurrencyFilters" style="padding: 10px 22px; background: #059669;">
            전체 보기 및 필터 초기화
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('btnResetCurrencyFilters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('reset-filters'));
        });
      }
      return;
    }

    gridContainer.innerHTML = list.map(item => {
      const isWish = (state.currencyWishlist || []).includes(item.id);
      const userNote = (state.currencyNotes || {})[item.id];
      const feeBadgeClass = item.feeFree ? 'free' : 'exchange';
      const feeBadgeText = item.feeFree ? '🎁 수수료 0원' : '💱 최우대 환율';

      const cardPills = (item.supportedCards || []).slice(0, 4).map(c => `
        <span class="supported-card-pill">${escapeHtml(c)}</span>
      `).join('');
      const morePill = (item.supportedCards || []).length > 4 ? `
        <span class="supported-card-pill more">+${(item.supportedCards || []).length - 4}</span>
      ` : '';

      return `
        <div class="activity-card currency-card" data-id="${item.id}">
          <div class="card-media-wrapper">
            <img class="card-img" src="${item.coverImage}" alt="${escapeHtml(item.nameKo || item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80'" />
            <span class="card-badge-top-left ${item.feeFree ? 'badge-fee-zero' : ''}">${escapeHtml(item.badge || item.categoryLabel)}</span>
            <button type="button" class="card-heart-btn ${isWish ? 'active' : ''}" data-id="${item.id}" aria-label="찜하기">
              ${isWish ? '♥' : '♡'}
            </button>
            ${userNote ? `<span class="card-user-note-badge" title="${escapeHtml(userNote)}">📝 메모</span>` : ''}
          </div>
          <div class="card-content">
            <div class="card-category-row">
              <span class="card-cat-pill">${escapeHtml(item.categoryLabel)}</span>
              <span class="currency-badge-fee ${feeBadgeClass}">${feeBadgeText}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.nameKo || item.name)}</h3>
            <p class="card-name-vi">🇻🇳 ${escapeHtml(item.nameVi)}</p>
            <div class="card-meta-line">
              <span class="rating">★ ${item.rating}</span>
              <span class="reviews">(${item.reviewCount.toLocaleString()})</span>
              <span class="dot">·</span>
              <span class="hours">⏰ ${escapeHtml(item.openHours)}</span>
            </div>
            <p class="card-location-line">📍 ${escapeHtml(item.location)}</p>

            <div class="supported-card-pills-row">
              ${cardPills}${morePill}
            </div>

            <p class="card-highlight-text">✨ ${escapeHtml(item.highlight)}</p>

            <div class="card-bottom-bar">
              <div class="card-fee-info">
                <span class="fee-main">${item.feeFree ? '수수료 0 VND' : '최우대 스프레드'}</span>
                <span class="fee-sub">${escapeHtml(item.feePolicy)}</span>
              </div>
              <div class="currency-card-actions">
                <a href="${item.googleMapUrl}" target="_blank" rel="noopener noreferrer" class="btn-currency-map" onclick="event.stopPropagation();" title="구글 지도로 보기">📍 지도</a>
                <a href="${item.googlePhotosUrl}" target="_blank" rel="noopener noreferrer" class="btn-currency-photos" onclick="event.stopPropagation();" title="실시간 사진 보기">📸 사진</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    gridContainer.querySelectorAll('.currency-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-heart-btn') || e.target.closest('.btn-currency-map') || e.target.closest('.btn-currency-photos')) return;
        const spotId = card.dataset.id;
        const spot = (typeof NHA_TRANG_CURRENCY !== 'undefined' ? NHA_TRANG_CURRENCY : []).find(s => s.id === spotId);
        if (spot) openCurrencyModal(spot);
      });
    });

    gridContainer.querySelectorAll('.card-heart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        toggleCurrencyWishlist(id);
        renderCurrency();
      });
    });
  }

  function toggleCurrencyWishlist(id) {
    if (!state.currencyWishlist) state.currencyWishlist = [];
    const idx = state.currencyWishlist.indexOf(id);
    if (idx > -1) {
      state.currencyWishlist.splice(idx, 1);
      showToast('🤍 환전/ATM 위시리스트에서 제외되었습니다.');
    } else {
      state.currencyWishlist.push(id);
      showToast('❤️ 환전/ATM 위시리스트에 담겼습니다!');
    }
    saveToStorage('nha_trang_currency_wishlist', state.currencyWishlist);
    updateWishlistBadge();
  }

  function openCurrencyModal(item) {
    const modal = document.getElementById('currencyModal');
    if (!modal || !item) return;

    state.activeModalCurrency = item;

    const mainImgEl = document.getElementById('currencyModalMainImg');
    const thumbsRow = document.getElementById('currencyModalThumbs');
    const images = (item.images && item.images.length > 0) ? item.images : [item.coverImage];

    if (mainImgEl) {
      mainImgEl.src = images[0] || item.coverImage;
      mainImgEl.alt = item.nameKo || item.name;
    }

    if (thumbsRow) {
      thumbsRow.innerHTML = images.map((img, idx) => `
        <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
          <img src="${img}" alt="${escapeHtml(item.nameKo || item.name)} 사진 ${idx + 1}" loading="lazy" />
        </div>
      `).join('');

      thumbsRow.querySelectorAll('.gallery-thumb').forEach(th => {
        th.addEventListener('click', () => {
          const idx = parseInt(th.dataset.idx, 10);
          if (mainImgEl) mainImgEl.src = images[idx];
          thumbsRow.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          th.classList.add('active');
        });
      });
    }

    const modalBadge = document.getElementById('currencyModalBadge');
    if (modalBadge) modalBadge.textContent = item.badge || item.categoryLabel;

    const modalCategory = document.getElementById('currencyModalCategory');
    if (modalCategory) modalCategory.textContent = item.categoryLabel;

    const modalFeeBadge = document.getElementById('currencyModalFeeBadge');
    if (modalFeeBadge) {
      modalFeeBadge.textContent = item.feeFree ? '현지 수수료 0 VND' : '최고 우대 환전';
      modalFeeBadge.style.background = item.feeFree ? '#ECFDF5' : '#FEF3C7';
      modalFeeBadge.style.color = item.feeFree ? '#059669' : '#D97706';
    }

    const modalTitle = document.getElementById('currencyModalTitle');
    if (modalTitle) modalTitle.textContent = item.nameKo || item.name;

    const modalNameVi = document.getElementById('currencyModalNameVi');
    if (modalNameVi) modalNameVi.textContent = `🇻🇳 ${item.nameVi}`;

    const modalRating = document.getElementById('currencyModalRating');
    if (modalRating) modalRating.textContent = `★ ${item.rating} (${item.reviewCount.toLocaleString()}개 리뷰)`;

    const modalHours = document.getElementById('currencyModalHours');
    if (modalHours) modalHours.textContent = item.openHours || '24시간 연중무휴';

    const modalFeePolicy = document.getElementById('currencyModalFeePolicy');
    if (modalFeePolicy) modalFeePolicy.textContent = item.feePolicy || '수수료 0원';

    const modalLocation = document.getElementById('currencyModalLocation');
    if (modalLocation) modalLocation.textContent = item.location || '시내 중심';

    const modalAddress = document.getElementById('currencyModalAddress');
    if (modalAddress) modalAddress.textContent = item.addressVi;

    const copyBtn = document.getElementById('currencyCopyAddressBtn');
    if (copyBtn) {
      copyBtn.onclick = () => copyAddress(item.addressVi, copyBtn);
    }

    const highlightEl = document.getElementById('currencyModalHighlightText');
    if (highlightEl) highlightEl.textContent = item.highlight || '';

    const cardsListEl = document.getElementById('currencyModalCardsList');
    if (cardsListEl) {
      cardsListEl.innerHTML = (item.supportedCards || []).map(card => `
        <div class="supported-card-item">
          <span class="card-icon">💳</span>
          <span class="card-name">${escapeHtml(card)}</span>
          <span class="card-status-badge ${item.feeFree ? 'free' : 'exchange'}">${item.feeFree ? '수수료 0원' : '환전 가능'}</span>
        </div>
      `).join('');
    }

    const atmStepsEl = document.getElementById('currencyModalAtmSteps');
    if (atmStepsEl) {
      if (item.category === 'atm_zero_fee') {
        atmStepsEl.innerHTML = `
          <div class="atm-steps-box">
            <div class="atm-step-item"><span class="step-badge">1</span><span><strong>카드 삽입 & 언어:</strong> 영문(English) 선택</span></div>
            <div class="atm-step-item"><span class="step-badge">2</span><span><strong>6자리 PIN 입력:</strong> 4자리 비밀번호 + 뒤에 00 입력 후 ENTER</span></div>
            <div class="atm-step-item"><span class="step-badge">3</span><span><strong>계좌 선택:</strong> 반드시 [Checking / Current Account] 선택</span></div>
            <div class="atm-step-item"><span class="step-badge">4</span><span><strong>금액 선택:</strong> 1회 인출 한도 (${escapeHtml(item.withdrawalLimit || '500만동')})</span></div>
            <div class="atm-step-item danger"><span class="step-badge">5</span><span><strong>★DCC 거절:</strong> 'Without Conversion' / 'No' 선택</span></div>
            <div class="atm-step-item warning"><span class="step-badge">6</span><span><strong>★★카드 먼저 회수!:</strong> 현금보다 카드가 먼저 나옵니다 (30초 내 회수)</span></div>
            <div class="atm-step-item"><span class="step-badge">7</span><span><strong>현금 & 영수증:</strong> 50만동 지폐 매수 확인 후 수령</span></div>
          </div>
        `;
      } else {
        atmStepsEl.innerHTML = `
          <div class="atm-steps-box">
            <div class="atm-step-item"><span class="step-badge">1</span><span><strong>지폐 상태 확인:</strong> 2013년 이후 발행 빳빳한 $100 신권(낙서/찢김 없음) 제시</span></div>
            <div class="atm-step-item"><span class="step-badge">2</span><span><strong>환율 호가 확인:</strong> 매장 내 계산기에 직원이 찍어주는 환율 확인</span></div>
            <div class="atm-step-item"><span class="step-badge">3</span><span><strong>계수기 대조:</strong> 지폐 계수기 앞에서 금액 확인 후 즉시 가방 안쪽에 수납</span></div>
          </div>
        `;
      }
    }

    const dccGuideEl = document.getElementById('currencyModalDccGuide');
    if (dccGuideEl) {
      dccGuideEl.innerHTML = `
        <div class="dcc-warning-box">
          <div class="dcc-warning-header">
            <span>🛡️ DCC(원화 이중결제) 차단 필수 수칙</span>
          </div>
          <p>ATM 화면 또는 POS 단말기에서 통화 선택 창이 뜰 경우 <strong>반드시 [Without Conversion] 및 [VND]</strong>를 선택하세요. 원화(KRW) 선택 시 3~8% 불필요한 바가지 수수료가 발생합니다.</p>
        </div>
      `;
    }

    const ratesBoxEl = document.getElementById('currencyModalRatesBox');
    if (ratesBoxEl) {
      ratesBoxEl.innerHTML = `
        <div class="exchange-perks-list">
          ${(item.exchangePerks || []).map(perk => `
            <div class="perk-item"><span class="perk-icon">✨</span><span>${escapeHtml(perk)}</span></div>
          `).join('')}
        </div>
      `;
    }

    const limitsBoxEl = document.getElementById('currencyModalLimitsBox');
    if (limitsBoxEl) {
      limitsBoxEl.innerHTML = `
        <div class="limit-info-box">
          <div class="limit-row"><strong>인출/환전 한도:</strong> <span>${escapeHtml(item.withdrawalLimit || '제한 없음')}</span></div>
          <div class="limit-row"><strong>지원 통화/수단:</strong> <span>${(item.supportedCurrencies || []).map(c => escapeHtml(c)).join(', ')}</span></div>
        </div>
      `;
    }

    const facilitiesEl = document.getElementById('currencyModalFacilities');
    if (facilitiesEl) {
      facilitiesEl.innerHTML = (item.facilities || []).map(f => `
        <span class="facility-chip">✓ ${escapeHtml(f)}</span>
      `).join('');
    }

    const modalDesc = document.getElementById('currencyModalDesc');
    if (modalDesc) modalDesc.textContent = item.description || '';

    const modalTip = document.getElementById('currencyModalTip');
    if (modalTip) modalTip.textContent = item.localTip || '';

    const noteInput = document.getElementById('currencyNoteInput');
    const noteStatus = document.getElementById('currencyNoteStatus');
    if (noteInput) {
      noteInput.value = (state.currencyNotes || {})[item.id] || '';
      if (noteStatus) noteStatus.textContent = '';
    }

    const heartBtn = document.getElementById('currencyModalHeartBtn');
    if (heartBtn) {
      const isWish = (state.currencyWishlist || []).includes(item.id);
      heartBtn.textContent = isWish ? '♥ 찜 취소' : '♡ 찜하기';
      heartBtn.onclick = () => {
        toggleCurrencyWishlist(item.id);
        const updated = (state.currencyWishlist || []).includes(item.id);
        heartBtn.textContent = updated ? '♥ 찜 취소' : '♡ 찜하기';
        renderCurrency();
      };
    }

    const photosBtn = document.getElementById('currencyModalPhotosBtn');
    if (photosBtn) photosBtn.href = item.googlePhotosUrl || item.googleMapUrl;

    const mapBtn = document.getElementById('currencyModalMapBtn');
    if (mapBtn) mapBtn.href = item.googleMapUrl;

    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeCurrencyModal() {
    const modal = document.getElementById('currencyModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
    document.body.style.overflow = '';
    state.activeModalCurrency = null;
  }

  function initCurrencyCalculator() {
    const vndInputMain = document.getElementById('calcVndInputMain');
    const krwInputMain = document.getElementById('calcKrwInputMain');
    const vndHelperMain = document.getElementById('calcVndHelperMain');
    const krwHelperMain = document.getElementById('calcKrwHelperMain');
    const resetBtnMain = document.getElementById('calcResetBtnMain');

    const calcModalVnd = document.getElementById('calcVndInput');
    const calcModalKrw = document.getElementById('calcKrwInput');

    function updateFromVnd(vndValue) {
      const raw = String(vndValue).replace(/[^0-9]/g, '');
      const vnd = parseInt(raw, 10) || 0;
      const krw = Math.round(vnd * (currentBenchmarkRate / 100));

      if (vndInputMain) vndInputMain.value = vnd > 0 ? vnd.toLocaleString() : '';
      if (krwInputMain) krwInputMain.value = krw > 0 ? krw.toLocaleString() : '';
      if (vndHelperMain) vndHelperMain.textContent = formatVerbalVND(vnd);
      if (krwHelperMain) krwHelperMain.textContent = formatVerbalKRW(krw);

      if (calcModalVnd) calcModalVnd.value = vnd > 0 ? vnd.toLocaleString() : '';
      if (calcModalKrw) calcModalKrw.value = krw > 0 ? krw.toLocaleString() : '';
    }

    function updateFromKrw(krwValue) {
      const raw = String(krwValue).replace(/[^0-9]/g, '');
      const krw = parseInt(raw, 10) || 0;
      const vnd = Math.round((krw / (currentBenchmarkRate / 100)) / 1000) * 1000;

      if (krwInputMain) krwInputMain.value = krw > 0 ? krw.toLocaleString() : '';
      if (vndInputMain) vndInputMain.value = vnd > 0 ? vnd.toLocaleString() : '';
      if (vndHelperMain) vndHelperMain.textContent = formatVerbalVND(vnd);
      if (krwHelperMain) krwHelperMain.textContent = formatVerbalKRW(krw);

      if (calcModalVnd) calcModalVnd.value = vnd > 0 ? vnd.toLocaleString() : '';
      if (calcModalKrw) calcModalKrw.value = krw > 0 ? krw.toLocaleString() : '';
    }

    document.querySelectorAll('.calc-rate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rateVal = parseFloat(btn.dataset.rate);
        if (!isNaN(rateVal) && rateVal > 0) {
          currentBenchmarkRate = rateVal;
          document.querySelectorAll('.calc-rate-btn').forEach(b => {
            b.classList.toggle('active', b === btn);
            if (b === btn) {
              b.style.background = '#059669';
              b.style.color = 'white';
            } else {
              b.style.background = 'rgba(255,255,255,0.1)';
              b.style.color = '#E2E8F0';
            }
          });

          const currentVnd = vndInputMain ? parseInt(vndInputMain.value.replace(/[^0-9]/g, ''), 10) || 0 : 0;
          if (currentVnd > 0) {
            updateFromVnd(currentVnd);
          } else {
            const currentKrw = krwInputMain ? parseInt(krwInputMain.value.replace(/[^0-9]/g, ''), 10) || 0 : 0;
            if (currentKrw > 0) updateFromKrw(currentKrw);
          }
        }
      });
    });

    vndInputMain?.addEventListener('input', (e) => updateFromVnd(e.target.value));
    krwInputMain?.addEventListener('input', (e) => updateFromKrw(e.target.value));

    document.querySelectorAll('.btn-calc-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const addVnd = parseInt(btn.dataset.addvnd, 10) || 0;
        const currentVnd = vndInputMain ? parseInt(vndInputMain.value.replace(/[^0-9]/g, ''), 10) || 0 : 0;
        const newVnd = currentVnd + addVnd;
        updateFromVnd(newVnd);
      });
    });

    resetBtnMain?.addEventListener('click', () => {
      if (vndInputMain) vndInputMain.value = '';
      if (krwInputMain) krwInputMain.value = '';
      if (vndHelperMain) vndHelperMain.textContent = '0 동 (0k VND)';
      if (krwHelperMain) krwHelperMain.textContent = '약 0원';
      if (calcModalVnd) calcModalVnd.value = '';
      if (calcModalKrw) calcModalKrw.value = '';
    });

    if (vndInputMain && !vndInputMain.value) {
      updateFromVnd(100000);
    }
  }

  // --- 9. Tab Switching & UI Controller ---
  function switchMainTab(tab) {
    state.currentTab = tab;
    
    const navTabs = document.querySelectorAll('.nav-tab-btn');
    navTabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    const isActivities = tab === 'activities';
    const isGourmet = tab === 'gourmet';
    const isStays = tab === 'stays';
    const isShopping = tab === 'shopping';
    const isCurrency = tab === 'currency';

    // Toggle Category Bars
    const activityCategoryNav = document.getElementById('activityCategoryNav');
    const gourmetCategoryNav = document.getElementById('gourmetCategoryNav');
    const stayCategoryNav = document.getElementById('stayCategoryNav');
    const shoppingCategoryNav = document.getElementById('shoppingCategoryNav');
    const currencyCategoryNav = document.getElementById('currencyCategoryNav');
    
    if (activityCategoryNav) activityCategoryNav.style.display = isActivities ? 'block' : 'none';
    if (gourmetCategoryNav) gourmetCategoryNav.style.display = isGourmet ? 'block' : 'none';
    if (stayCategoryNav) stayCategoryNav.style.display = isStays ? 'block' : 'none';
    if (shoppingCategoryNav) shoppingCategoryNav.style.display = isShopping ? 'block' : 'none';
    if (currencyCategoryNav) currencyCategoryNav.style.display = isCurrency ? 'block' : 'none';

    // Toggle Tag Chips
    const activityTagChips = document.getElementById('activityTagChips');
    const gourmetTagChips = document.getElementById('gourmetTagChips');
    const stayTagChips = document.getElementById('stayTagChips');
    const shoppingTagChips = document.getElementById('shoppingTagChips');
    const currencyTagChips = document.getElementById('currencyTagChips');
    
    if (activityTagChips) activityTagChips.style.display = isActivities ? 'flex' : 'none';
    if (gourmetTagChips) gourmetTagChips.style.display = isGourmet ? 'flex' : 'none';
    if (stayTagChips) stayTagChips.style.display = isStays ? 'flex' : 'none';
    if (shoppingTagChips) shoppingTagChips.style.display = isShopping ? 'flex' : 'none';
    if (currencyTagChips) currencyTagChips.style.display = isCurrency ? 'flex' : 'none';
    
    const toolbarSection = document.querySelector('.toolbar-section');
    if (toolbarSection) toolbarSection.style.display = 'block';
    
    const viewToggleButtons = document.getElementById('viewToggleButtons');
    if (viewToggleButtons) viewToggleButtons.style.display = isActivities ? 'flex' : 'none';

    const searchInput = document.getElementById('searchInput');
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitleDesc = document.getElementById('heroSubtitleDesc');
    const heroTagsArea = document.getElementById('heroTagsArea');
    
    const activitiesSection = document.getElementById('activitiesGridSection');
    const timelineSection = document.getElementById('timelineSection');
    const gourmetSection = document.getElementById('gourmetGridSection');
    const staysSection = document.getElementById('staysGridSection');
    const shoppingSection = document.getElementById('shoppingGridSection');
    const currencySection = document.getElementById('currencyGridSection');

    if (isActivities) {
      if (searchInput) searchInput.placeholder = '액티비티 검색 (예: 스노클링, 마사지, 인생샷, 아이리조트)...';
      if (heroTitle) heroTitle.textContent = '나트랑 힐링 여행 가이드 🌴';
      if (heroSubtitleDesc) heroSubtitleDesc.textContent = '호핑, 스파, 빈원더스, 선셋 크루즈 큐레이션';
      if (heroTagsArea) {
        heroTagsArea.innerHTML = `
          <span class="hero-stat-pill"><span class="icon">✨</span> 엄선된 43개 리얼 액티비티</span>
          <span class="hero-stat-pill"><span class="icon">💆</span> 프라이빗 스파 & 머드온천</span>
          <span class="hero-stat-pill"><span class="icon">⛵</span> 럭셔리 선셋 크루즈 & 호핑</span>
          <span class="hero-stat-pill"><span class="icon">🏜️</span> 달랏 / 무이네 근교투어</span>
        `;
      }
      if (activitiesSection) activitiesSection.style.display = state.currentView === 'grid' ? 'block' : 'none';
      if (timelineSection) timelineSection.style.display = state.currentView === 'timeline' ? 'block' : 'none';
      if (gourmetSection) gourmetSection.style.display = 'none';
      if (staysSection) staysSection.style.display = 'none';
      if (shoppingSection) shoppingSection.style.display = 'none';
      if (currencySection) currencySection.style.display = 'none';
      
      if (state.currentView === 'grid') renderCards();
      else renderTimeline();
      
    } else if (isGourmet) {
      if (searchInput) searchInput.placeholder = '로컬 맛집 & 메뉴 검색 (예: 반쎄오, 뚝배기쌀국수, 탄스엉, 망고)...';
      if (heroTitle) heroTitle.textContent = '나트랑 현지인 찐 로컬 맛집 🍜';
      if (heroSubtitleDesc) heroSubtitleDesc.textContent = '구글 지도 실시간 평점 & 리뷰 검증 완료 현지 맛집 큐레이션';
      if (heroTagsArea) {
        heroTagsArea.innerHTML = `
          <span class="hero-stat-pill"><span class="icon">📍</span> Google Maps 실시간 연동 검증</span>
          <span class="hero-stat-pill"><span class="icon">🔥</span> 현지인 & 스페셜티 113곳</span>
          <span class="hero-stat-pill"><span class="icon">🦞</span> 바가지 없는 해산물 정찰제</span>
          <span class="hero-stat-pill"><span class="icon">🥭</span> 특A급 생망고 & 솔트커피</span>
        `;
      }
      if (activitiesSection) activitiesSection.style.display = 'none';
      if (timelineSection) timelineSection.style.display = 'none';
      if (gourmetSection) gourmetSection.style.display = 'block';
      if (staysSection) staysSection.style.display = 'none';
      if (shoppingSection) shoppingSection.style.display = 'none';
      if (currencySection) currencySection.style.display = 'none';
      renderGourmets();
      
    } else if (isStays) {
      if (searchInput) searchInput.placeholder = '숙소명, 지역, 편의시설 검색 (예: 인터컨티넨탈, 풀빌라, 인피니티풀, 야시장)...';
      if (heroTitle) heroTitle.textContent = '나트랑 테마별 추천 숙소 & 리조트 🏨';
      if (heroSubtitleDesc) heroSubtitleDesc.textContent = '입국 웰컴 0.5박부터 5성급 럭셔리, 감성 풀빌라, 출국 전 0.5박 큐레이션';
      if (heroTagsArea) {
        heroTagsArea.innerHTML = `
          <span class="hero-stat-pill"><span class="icon">✨</span> 4개 테마별 엄선 24선</span>
          <span class="hero-stat-pill"><span class="icon">👑</span> 5성급 럭셔리 호캉스 & 리조트</span>
          <span class="hero-stat-pill"><span class="icon">🏊</span> 프라이빗 단독 온수/인피니티 풀빌라</span>
          <span class="hero-stat-pill"><span class="icon">💰</span> 5만원 이하 시내 중심 0.5박 알짜 호텔</span>
        `;
      }
      if (activitiesSection) activitiesSection.style.display = 'none';
      if (timelineSection) timelineSection.style.display = 'none';
      if (gourmetSection) gourmetSection.style.display = 'none';
      if (staysSection) staysSection.style.display = 'block';
      if (shoppingSection) shoppingSection.style.display = 'none';
      if (currencySection) currencySection.style.display = 'none';
      renderStays();
    } else if (isShopping) {
      if (searchInput) searchInput.placeholder = '쇼핑 스팟, 브랜드, 품목 검색 (예: 켄켄크록스, 담시장, 미스앤미스터, 스투시, 탑젤리)...';
      if (heroTitle) heroTitle.textContent = '나트랑 짝퉁 & 패션 쇼핑 가이드 🛍️';
      if (heroSubtitleDesc) heroSubtitleDesc.textContent = '담시장, 야시장, 미러급 부티크부터 실전 흥정 시세표 & 세관 유의사항 총정리';
      if (heroTagsArea) {
        heroTagsArea.innerHTML = `
          <span class="hero-stat-pill"><span class="icon">👑</span> 미러급 & SA급 하이엔드 샵</span>
          <span class="hero-stat-pill"><span class="icon">🏷️</span> 품목별 실전 흥정 적정가 가이드</span>
          <span class="hero-stat-pill"><span class="icon">❄️</span> 에어컨 완비 & 한국 계좌이체 매장</span>
          <span class="hero-stat-pill"><span class="icon">✈️</span> 한국 세관 통관 & 주의사항 완벽 대비</span>
        `;
      }
      if (activitiesSection) activitiesSection.style.display = 'none';
      if (timelineSection) timelineSection.style.display = 'none';
      if (gourmetSection) gourmetSection.style.display = 'none';
      if (staysSection) staysSection.style.display = 'none';
      if (shoppingSection) shoppingSection.style.display = 'block';
      if (currencySection) currencySection.style.display = 'none';
      renderShopping();
    } else if (isCurrency) {
      if (searchInput) searchInput.placeholder = '환전소, 은행명, 카드사 검색 (예: VPBank, TPBank, 김청, 트래블로그, 100달러)...';
      if (heroTitle) heroTitle.textContent = '나트랑 환전 & 수수료 무료 ATM 가이드 💱';
      if (heroSubtitleDesc) heroSubtitleDesc.textContent = '5대 여행 체크카드 맞춤 수수료 0원 ATM & 실전 환율 계산기';
      if (heroTagsArea) {
        heroTagsArea.innerHTML = `
          <span class="hero-stat-pill"><span class="icon">🏧</span> 5대 카드 수수료 0원 ATM 8곳</span>
          <span class="hero-stat-pill"><span class="icon">💎</span> 김청·김빈 100달러 우대 환전</span>
          <span class="hero-stat-pill"><span class="icon">🛡️</span> DCC 이중환전 차단 완벽 가이드</span>
          <span class="hero-stat-pill"><span class="icon">💱</span> 실시간 양방향 환율 계산기</span>
        `;
      }
      if (activitiesSection) activitiesSection.style.display = 'none';
      if (timelineSection) timelineSection.style.display = 'none';
      if (gourmetSection) gourmetSection.style.display = 'none';
      if (staysSection) staysSection.style.display = 'none';
      if (shoppingSection) shoppingSection.style.display = 'none';
      if (currencySection) currencySection.style.display = 'block';
      renderCurrency();
    }
  }

  function setViewMode(mode) {
    state.currentView = mode;
    const viewGridBtn = document.getElementById('viewGridBtn');
    const viewTimelineBtn = document.getElementById('viewTimelineBtn');
    
    if (viewGridBtn) viewGridBtn.classList.toggle('active', mode === 'grid');
    if (viewTimelineBtn) viewTimelineBtn.classList.toggle('active', mode === 'timeline');

    if (state.currentTab === 'activities') {
      const activitiesSection = document.getElementById('activitiesGridSection');
      const timelineSection = document.getElementById('timelineSection');
      if (activitiesSection) activitiesSection.style.display = mode === 'grid' ? 'block' : 'none';
      if (timelineSection) timelineSection.style.display = mode === 'timeline' ? 'block' : 'none';
      if (mode === 'timeline') renderTimeline();
      else renderCards();
    }
  }

  function resetFilters() {
    resetStateFilters();

    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'recommended';

    document.querySelectorAll('#activityCategoryNav .category-item-btn').forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
    document.querySelectorAll('#gourmetCategoryNav .category-item-btn').forEach(b => b.classList.toggle('active', b.dataset.gcategory === 'all'));
    document.querySelectorAll('#stayCategoryNav .category-item-btn').forEach(b => b.classList.toggle('active', b.dataset.scategory === 'all'));
    document.querySelectorAll('#shoppingCategoryNav .category-item-btn').forEach(b => b.classList.toggle('active', b.dataset.shopcategory === 'all'));
    document.querySelectorAll('#currencyCategoryNav .category-item-btn').forEach(b => b.classList.toggle('active', b.dataset.currcategory === 'all'));

    document.querySelectorAll('#activityTagChips .tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.tag === 'all'));
    document.querySelectorAll('#gourmetTagChips .tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.gtag === 'all'));
    document.querySelectorAll('#stayTagChips .tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.stag === 'all'));
    document.querySelectorAll('#shoppingTagChips .tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.shoptag === 'all'));
    document.querySelectorAll('#currencyTagChips .tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.currtag === 'all'));

    updateWishlistBadge();

    if (state.currentTab === 'activities') {
      if (state.currentView === 'grid') renderCards();
      else renderTimeline();
    } else if (state.currentTab === 'gourmet') {
      renderGourmets();
    } else if (state.currentTab === 'stays') {
      renderStays();
    } else if (state.currentTab === 'shopping') {
      renderShopping();
    } else if (state.currentTab === 'currency') {
      renderCurrency();
    }
    showToast('필터가 모두 초기화되었습니다.');
  }

  // --- 10. Event Listeners Initialization ---
  function initEvents() {
    // Nav Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchMainTab(btn.dataset.tab));
    });

    // Wishlist Toggle
    const wishlistBtn = document.getElementById('wishlistToggleBtn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        state.wishlistOnly = !state.wishlistOnly;
        updateWishlistBadge();
        if (state.currentTab === 'activities') renderCards();
        else if (state.currentTab === 'gourmet') renderGourmets();
        else if (state.currentTab === 'stays') renderStays();
        else if (state.currentTab === 'shopping') renderShopping();
        else if (state.currentTab === 'currency') renderCurrency();
      });
    }

    // Category Buttons
    document.querySelectorAll('#activityCategoryNav .category-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#activityCategoryNav .category-item-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.actCategory = btn.dataset.category;
        renderCards();
      });
    });

    document.querySelectorAll('#gourmetCategoryNav .category-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#gourmetCategoryNav .category-item-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gourmetCategory = btn.dataset.gcategory;
        renderGourmets();
      });
    });

    document.querySelectorAll('#stayCategoryNav .category-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#stayCategoryNav .category-item-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.stayCategory = btn.dataset.scategory;
        renderStays();
      });
    });

    document.querySelectorAll('#shoppingCategoryNav .category-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#shoppingCategoryNav .category-item-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.shoppingCategory = btn.dataset.shopcategory;
        renderShopping();
      });
    });

    document.querySelectorAll('#currencyCategoryNav .category-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#currencyCategoryNav .category-item-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currencyCategory = btn.dataset.currcategory;
        renderCurrency();
      });
    });

    // Tag Buttons
    document.querySelectorAll('#activityTagChips .tag-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#activityTagChips .tag-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.actTag = btn.dataset.tag;
        renderCards();
      });
    });

    document.querySelectorAll('#gourmetTagChips .tag-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#gourmetTagChips .tag-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.gourmetTag = btn.dataset.gtag;
        renderGourmets();
      });
    });

    document.querySelectorAll('#stayTagChips .tag-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#stayTagChips .tag-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.stayTag = btn.dataset.stag;
        renderStays();
      });
    });

    document.querySelectorAll('#shoppingTagChips .tag-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#shoppingTagChips .tag-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.shoppingTag = btn.dataset.shoptag;
        renderShopping();
      });
    });

    document.querySelectorAll('#currencyTagChips .tag-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#currencyTagChips .tag-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currencyTag = btn.dataset.currtag;
        renderCurrency();
      });
    });

    // Search Input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      let searchDebounce;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          state.searchQuery = e.target.value.trim();
          if (state.currentTab === 'activities') renderCards();
          else if (state.currentTab === 'gourmet') renderGourmets();
          else if (state.currentTab === 'stays') renderStays();
          else if (state.currentTab === 'shopping') renderShopping();
          else if (state.currentTab === 'currency') renderCurrency();
        }, 200);
      });
    }

    const searchClearBtn = document.getElementById('searchClearBtn');
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        state.searchQuery = '';
        if (state.currentTab === 'activities') renderCards();
        else if (state.currentTab === 'gourmet') renderGourmets();
        else if (state.currentTab === 'stays') renderStays();
        else if (state.currentTab === 'shopping') renderShopping();
        else if (state.currentTab === 'currency') renderCurrency();
      });
    }

    // Sort Select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        if (state.currentTab === 'activities') renderCards();
        else if (state.currentTab === 'gourmet') renderGourmets();
        else if (state.currentTab === 'stays') renderStays();
        else if (state.currentTab === 'shopping') renderShopping();
        else if (state.currentTab === 'currency') renderCurrency();
      });
    }

    // View Toggles
    const viewGridBtn = document.getElementById('viewGridBtn');
    const viewTimelineBtn = document.getElementById('viewTimelineBtn');
    if (viewGridBtn) viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    if (viewTimelineBtn) viewTimelineBtn.addEventListener('click', () => setViewMode('timeline'));

    // Global reset-filters event listener
    window.addEventListener('reset-filters', resetFilters);

    // Modals Close Events
    const detailModal = document.getElementById('detailModal');
    const gourmetModal = document.getElementById('gourmetModal');
    const stayModal = document.getElementById('stayModal');
    const shoppingModal = document.getElementById('shoppingModal');
    const currencyModal = document.getElementById('currencyModal');
    const calcModal = document.getElementById('calcModal');
    const guideModal = document.getElementById('guideModal');

    document.getElementById('modalCloseBtn')?.addEventListener('click', closeActivityModal);
    detailModal?.addEventListener('click', (e) => {
      if (e.target === detailModal) closeActivityModal();
    });

    document.getElementById('gourmetModalCloseBtn')?.addEventListener('click', closeGourmetModal);
    gourmetModal?.addEventListener('click', (e) => {
      if (e.target === gourmetModal) closeGourmetModal();
    });

    document.getElementById('stayModalCloseBtn')?.addEventListener('click', closeStayModal);
    stayModal?.addEventListener('click', (e) => {
      if (e.target === stayModal) closeStayModal();
    });

    document.getElementById('shoppingModalCloseBtn')?.addEventListener('click', closeShoppingModal);
    shoppingModal?.addEventListener('click', (e) => {
      if (e.target === shoppingModal) closeShoppingModal();
    });

    document.getElementById('currencyModalCloseBtn')?.addEventListener('click', closeCurrencyModal);
    currencyModal?.addEventListener('click', (e) => {
      if (e.target === currencyModal) closeCurrencyModal();
    });

    function openModal(modalEl) {
      if (!modalEl) return;
      modalEl.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeModal(modalEl) {
      if (!modalEl) return;
      modalEl.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Notes Auto-save Handlers
    document.addEventListener('input', (e) => {
      if (e.target.matches('#modalNoteInput') || e.target.matches('#noteInput')) {
        if (!state.activeModalActivity) return;
        state.notes[state.activeModalActivity.id] = e.target.value;
        saveToStorage('nha_trang_notes', state.notes);
        const s = document.getElementById('modalNoteStatus') || document.getElementById('noteStatus');
        if (s) s.textContent = '✓ 저장 완료';
        renderCards();
      } else if (e.target.matches('#gourmetNoteInput')) {
        if (!state.activeModalGourmet) return;
        state.gourmetNotes[state.activeModalGourmet.id] = e.target.value;
        saveToStorage('nha_trang_gourmet_notes', state.gourmetNotes);
        const s = document.getElementById('gourmetNoteStatus');
        if (s) s.textContent = '✓ 저장 완료';
        renderGourmets();
      } else if (e.target.matches('#stayNoteInput')) {
        if (!state.activeModalStay) return;
        state.stayNotes[state.activeModalStay.id] = e.target.value;
        saveToStorage('nha_trang_stay_notes', state.stayNotes);
        const s = document.getElementById('stayNoteStatus');
        if (s) s.textContent = '✓ 저장 완료';
        renderStays();
      } else if (e.target.matches('#shoppingNoteInput')) {
        if (!state.activeModalShopping) return;
        state.shoppingNotes[state.activeModalShopping.id] = e.target.value;
        saveToStorage('nha_trang_shopping_notes', state.shoppingNotes);
        const s = document.getElementById('shoppingNoteStatus');
        if (s) s.textContent = '✓ 저장 완료';
        renderShopping();
      } else if (e.target.matches('#currencyNoteInput')) {
        if (!state.activeModalCurrency) return;
        state.currencyNotes[state.activeModalCurrency.id] = e.target.value;
        saveToStorage('nha_trang_currency_notes', state.currencyNotes);
        const s = document.getElementById('currencyNoteStatus');
        if (s) s.textContent = '✓ 저장 완료';
        renderCurrency();
      }
    });

    // Copy Address Handlers
    document.getElementById('gourmetCopyAddressBtn')?.addEventListener('click', (e) => {
      if (state.activeModalGourmet) copyAddress(state.activeModalGourmet.addressVi, e.currentTarget);
    });
    document.getElementById('stayCopyAddressBtn')?.addEventListener('click', (e) => {
      if (state.activeModalStay) copyAddress(state.activeModalStay.addressVi, e.currentTarget);
    });
    document.getElementById('shoppingCopyAddressBtn')?.addEventListener('click', (e) => {
      if (state.activeModalShopping) copyAddress(state.activeModalShopping.addressVi, e.currentTarget);
    });
    document.getElementById('currencyCopyAddressBtn')?.addEventListener('click', (e) => {
      if (state.activeModalCurrency) copyAddress(state.activeModalCurrency.addressVi, e.currentTarget);
    });

    // Calculator Modal
    document.getElementById('openCalcBtn')?.addEventListener('click', () => openModal(calcModal));
    document.getElementById('calcCloseBtn')?.addEventListener('click', () => closeModal(calcModal));
    calcModal?.addEventListener('click', (e) => {
      if (e.target === calcModal) closeModal(calcModal);
    });

    const rate = typeof DEFAULT_EXCHANGE_RATE !== 'undefined' ? DEFAULT_EXCHANGE_RATE : 0.0545;
    const calcVndInput = document.getElementById('calcVndInput');
    const calcKrwInput = document.getElementById('calcKrwInput');

    calcVndInput?.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const vnd = parseInt(raw, 10) || 0;
      e.target.value = vnd ? vnd.toLocaleString() : '';
      if (calcKrwInput) calcKrwInput.value = vnd ? Math.round(vnd * rate).toLocaleString() : '';
    });

    calcKrwInput?.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const krw = parseInt(raw, 10) || 0;
      e.target.value = krw ? krw.toLocaleString() : '';
      if (calcVndInput) calcVndInput.value = krw ? Math.round(krw / rate).toLocaleString() : '';
    });

    document.querySelectorAll('.calc-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vnd = parseInt(btn.dataset.vnd, 10);
        if (calcVndInput) calcVndInput.value = vnd.toLocaleString();
        if (calcKrwInput) calcKrwInput.value = Math.round(vnd * rate).toLocaleString();
      });
    });

    // Guide Modal
    document.getElementById('openGuideBtn')?.addEventListener('click', () => openModal(guideModal));
    document.getElementById('guideCloseBtn')?.addEventListener('click', () => closeModal(guideModal));
    guideModal?.addEventListener('click', (e) => {
      if (e.target === guideModal) closeModal(guideModal);
    });

    // ESC Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeActivityModal();
        closeGourmetModal();
        closeStayModal();
        closeShoppingModal();
        closeCurrencyModal();
        closeModal(calcModal);
        closeModal(guideModal);
      }
    });

    // Initialize currency calculator
    initCurrencyCalculator();
  }

  // --- 11. Initialization Entrypoint ---
  function init() {
    updateWishlistBadge();
    initEvents();
    renderCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
