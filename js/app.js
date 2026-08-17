/**
 * Nha Trang Trip 2026 - Main Application Logic
 * Pure Vanilla JS, Zero External Dependencies
 * Works flawlessly in both file:// (local double click) and http(s):// (Vercel)
 */

(function() {
  'use strict';

  // --- 1. Storage Helpers ---
  // Node test runners have no usable localStorage (and Node >= 22 exposes a stub that
  // throws), so feature-detect once instead of warning on every single key.
  function hasStorage() {
    try {
      return typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function';
    } catch (e) {
      return false;
    }
  }

  function loadFromStorage(key, fallback) {
    if (!hasStorage()) return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return fallback;
    }
  }

  function saveToStorage(key, val) {
    if (!hasStorage()) return;
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

  // --- 3.5 Generic Filter Pipeline ---
  // 5개 도메인의 getFilteredX가 공유하던 "찜 -> 카테고리 -> 태그 -> 검색 -> 정렬"
  // 골격만 여기 하나로 모은다. 도메인별 매처/정렬 comparator는 각 섹션에 그대로
  // 남겨 다른 도메인과 절대 공유하지 않는다 (통일 시 카테고리/태그 판정이 깨짐).

  // 검색어 포함 여부. q는 호출부에서 이미 소문자로 정규화되어 들어온다.
  function textIncludes(value, q) {
    return (value || '').toString().toLowerCase().includes(q);
  }

  /**
   * 도메인별 검색을 선언적으로 처리한다.
   *   strings: 스칼라 문자열 필드명 목록
   *   arrays : 문자열 배열 필드명 목록
   *   extra  : 위 두 형태로 표현 못 하는 케이스(중첩 객체, fallback 체인 등)
   * 필드를 늘리거나 줄이면 검색 결과가 바뀌므로 목록은 데이터 스키마와 함께 관리할 것.
   */
  function matchTextFields(item, q, spec) {
    if ((spec.strings || []).some(f => textIncludes(item[f], q))) return true;
    if ((spec.arrays || []).some(f => (item[f] || []).some(v => textIncludes(v, q)))) return true;
    return spec.extra ? !!spec.extra(item, q) : false;
  }
  function applyDomainFilter(cfg) {
    if (typeof cfg.source === 'undefined' || !cfg.source) return [];
    const cat = state[cfg.catField];
    const tag = state[cfg.tagField];
    const q = state.searchQuery ? state.searchQuery.toLowerCase() : '';
    const wish = state[cfg.wishField] || [];

    return cfg.source.filter(item => {
      if (state.wishlistOnly && !wish.includes(item.id)) return false;
      if (cat && cat !== 'all' && !cfg.categoryMatch(item, cat)) return false;
      if (tag && tag !== 'all' && !cfg.tagMatch(item, tag)) return false;
      if (q && !cfg.searchMatch(item, q)) return false;
      return true;
    }).sort(cfg.compare);
  }

  // --- 3.6 Generic Render Pipeline ---
  // 5개 renderX가 공유하던 "컨테이너/카운트 엘리먼트 조회 -> getFilteredX 호출 ->
  // 카운트 갱신 -> 빈 상태 처리 -> 카드 HTML 생성 -> 클릭/찜 바인딩" 골격만 여기
  // 하나로 모은다. 카드 템플릿, 카운트 문구, 빈 상태 마크업, 리셋 버튼 id, 클릭 시
  // 무시할 셀렉터는 도메인마다 완전히 다르므로 cfg 콜백/필드로 그대로 유지하고
  // 절대 통일하지 않는다 (통일하면 렌더 출력이 바뀌어 test-render-snapshot.js가 깨짐).
  function renderDomainGrid(cfg) {
    const container = document.getElementById(cfg.gridContainerId);
    const countEl = document.getElementById(cfg.countTextId);
    if (!container) return;

    const list = cfg.getFiltered();
    if (countEl) {
      countEl.innerHTML = cfg.countHtml(list.length);
    }

    if (list.length === 0) {
      container.innerHTML = cfg.emptyHtml();
      const resetBtn = document.getElementById(cfg.resetBtnId);
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('reset-filters'));
        });
      }
      return;
    }

    container.innerHTML = list.map(cfg.cardTemplate).join('');

    container.querySelectorAll(cfg.cardSelector).forEach(card => {
      card.addEventListener('click', (e) => {
        if ((cfg.ignoreSelectors || ['.card-heart-btn']).some(sel => e.target.closest(sel))) return;
        const id = card.dataset.id;
        const item = cfg.findItem(id);
        if (item) cfg.openModal(item);
      });
    });

    container.querySelectorAll('.card-heart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        cfg.toggleWishlist(btn.dataset.id);
        cfg.rerender();
      });
    });
  }

  // --- 3.7 Declarative Modal Field Bindings ---
  // 5개 모달이 공유하던 "getElementById -> null 가드 -> 대입" 반복만 걷어낸다.
  // 도메인 고유 블록(ATM 단계, 흥정표, 갤러리 등)은 각 openXModal에 그대로 남는다.
  function applyModalFields(item, fields) {
    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el) return;
      const v = typeof f.value === 'function' ? f.value(item) : item[f.value];
      if (f.as === 'html') el.innerHTML = v == null ? '' : v;
      else if (f.as === 'src') el.src = v == null ? '' : v;
      else if (f.as === 'href') el.href = v == null ? '' : v;
      else el.textContent = v == null ? '' : v;
    });
  }

  // --- 4. Activities Domain Logic ---
  function activitiesTagMatch(item, tag) {
    const tagMap = {
      'wife': ['wife', '인기', '추천', '커플', '인기추천'],
      'photo': ['photo', '인생샷', '사진', '스팟', '성지', '인스타'],
      'spa': ['spa', '스파', '힐링', '마사지', '온천', '머드'],
      'rain': ['rain', '비오는날', '비올때', '실내', '워터파크', '테마파크']
    };
    const keywords = tagMap[tag] || [tag];
    const itemTags = (item.tags || []).concat([item.category, item.categoryLabel || '', item.badge || '']);
    return itemTags.some(t => {
      const tLower = (t || '').toLowerCase();
      return keywords.some(k => tLower.includes(k.toLowerCase()));
    });
  }

  const ACTIVITY_SEARCH = {
    strings: ['title', 'titleEn', 'location', 'highlight', 'googleMapQuery'],
    arrays: ['tags'],
    // These two read a fallback chain rather than a single field, so they stay explicit.
    extra: (item, q) => textIncludes(item.description || item.highlight, q) ||
                        textIncludes(item.categoryLabel || item.category, q)
  };

  function activitiesSearchMatch(item, q) {
    return matchTextFields(item, q, ACTIVITY_SEARCH);
  }

  function activitiesCompare(a, b) {
    if (state.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (state.sortBy === 'price-asc') return (a.priceVnd || 0) - (b.priceVnd || 0);
    if (state.sortBy === 'price-desc') return (b.priceVnd || 0) - (a.priceVnd || 0);
    return 0; // recommended
  }

  function getFilteredActivities() {
    if (typeof NHA_TRANG_ACTIVITIES === 'undefined') return [];
    return applyDomainFilter({
      source: NHA_TRANG_ACTIVITIES,
      catField: 'actCategory', tagField: 'actTag', wishField: 'wishlist',
      categoryMatch: (item, cat) => item.category === cat,
      tagMatch: activitiesTagMatch,
      searchMatch: activitiesSearchMatch,
      compare: activitiesCompare
    });
  }

  function activityCardTemplate(item) {
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
  }

  function renderCards() {
    renderDomainGrid({
      gridContainerId: 'cardsGridContainer',
      countTextId: 'resultCountText',
      getFiltered: getFilteredActivities,
      countHtml: (n) => `총 <strong>${n}</strong>개의 추천 액티비티`,
      emptyHtml: () => `
        <div class="empty-state">
          <div class="icon">🔍</div>
          <h3>조건에 맞는 액티비티가 없습니다</h3>
          <p>필터 조건을 초기화하거나 다른 검색어로 찾아보세요.</p>
          <button class="btn-reset-filters" id="btnResetFilters">필터 전체 초기화</button>
        </div>
      `,
      resetBtnId: 'btnResetFilters',
      cardTemplate: activityCardTemplate,
      cardSelector: '.activity-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => NHA_TRANG_ACTIVITIES.find(a => a.id === id),
      openModal: openActivityModal,
      toggleWishlist: toggleWishlist,
      rerender: renderCards
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

  const ACTIVITY_MODAL_FIELDS = [
    { id: 'modalBadge', value: item => item.badge || item.categoryLabel || '추천' },
    { id: 'modalCategory', value: item => item.categoryLabel || item.category },
    { id: 'modalDay', value: item => item.suggestedDay || '일정 추천' },
    { id: 'modalTitle', value: 'title' },
    { id: 'modalTitleEn', value: item => item.titleEn || '' },
    { id: 'modalRating', value: item => `★ ${item.rating || 4.8} (구글/트립어드바이저)` },
    { id: 'modalDuration', value: item => item.duration || '약 2~3시간' },
    { id: 'modalBestTime', value: item => item.bestTime || '오전 중 추천' },
    { id: 'modalLocation', value: item => item.location || '나트랑 시내' },
    { id: 'modalHighlight', value: item => item.highlight || item.description || '' },
    { id: 'modalCoupleTip', value: item => item.coupleTip || item.travelerTip || item.localTip || '즐겁고 안전한 여행 되세요!' },
    { id: 'modalPriceVnd', value: item => formatVND(item.priceVnd) },
    { id: 'modalPriceKrw', value: item => `(${formatKRW(item.priceVnd)})` },
    { id: 'modalPricePer', value: item => `/ ${item.pricePer || '1인 기준'}` },
    { id: 'modalMapLink', as: 'href', value: item => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.googleMapQuery || item.titleEn || item.title) + ' Nha Trang')}` },
    { id: 'modalReserveLink', as: 'href', value: item => item.reserveUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' Nha Trang')}` },
  ];

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

    applyModalFields(item, ACTIVITY_MODAL_FIELDS);

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
  function gourmetCategoryMatch(item, cat) {
    const tagStr = (item.tags || []).join(' ');
    if (cat === 'fruit') {
      return (item.category === 'fruit' || item.category === 'cafe' || item.category === 'dessert' || (item.categoryLabel && (item.categoryLabel.includes('카페') || item.categoryLabel.includes('디저트') || item.categoryLabel.includes('생과일'))));
    } else if (cat === 'rice') {
      return (item.category === 'rice' || (item.category === 'vietnamese' && (tagStr.includes('가정식') || tagStr.includes('솥밥') || tagStr.includes('치킨라이스') || tagStr.includes('닭고기밥') || tagStr.includes('전통') || tagStr.includes('식당'))) || tagStr.includes('가정식') || tagStr.includes('솥밥') || tagStr.includes('치킨라이스') || tagStr.includes('닭고기밥') || tagStr.includes('껌땀') || tagStr.includes('누룽지'));
    } else if (cat === 'pho') {
      return (item.category === 'pho' || item.category === 'bunca' || tagStr.includes('쌀국수') || tagStr.includes('분짜') || tagStr.includes('분까') || tagStr.includes('분보') || (item.category === 'vietnamese' && tagStr.includes('쌀국수')) || (item.categoryLabel && (item.categoryLabel.includes('쌀국수') || item.categoryLabel.includes('분짜'))));
    } else if (cat === 'banhxeo') {
      return (item.category === 'banhxeo' || tagStr.includes('반쎄오') || tagStr.includes('넴느엉') || tagStr.includes('반깐') || (item.categoryLabel && item.categoryLabel.includes('반쎄오')));
    } else if (cat === 'seafood') {
      return (item.category === 'seafood' || (item.categoryLabel && item.categoryLabel.includes('해산물')) || tagStr.includes('해산물') || tagStr.includes('조개'));
    } else if (cat === 'banhmi') {
      return (item.category === 'banhmi' || tagStr.includes('반미'));
    } else {
      return (item.category === cat);
    }
  }

  function gourmetTagMatch(item, gt) {
    const tagStr = (item.tags || []).join(' ');
    if (gt === 'line' && (tagStr.includes('줄서는') || tagStr.includes('1위') || tagStr.includes('인기') || tagStr.includes('성지') || tagStr.includes('명가') || tagStr.includes('단골'))) return true;
    if (gt === 'ac' && (tagStr.includes('에어컨') || tagStr.includes('냉방') || tagStr.includes('쾌적') || tagStr.includes('위생'))) return true;
    if (gt === 'breakfast' && (tagStr.includes('아침') || tagStr.includes('모닝') || tagStr.includes('해장') || (item.openHours && (item.openHours.startsWith('05:') || item.openHours.startsWith('06:') || item.openHours.startsWith('07:'))))) return true;
    if (gt === 'seafood' && (tagStr.includes('정찰제') || tagStr.includes('해산물') || tagStr.includes('조개') || item.category === 'seafood')) return true;
    if (gt === 'night' && (tagStr.includes('야간') || tagStr.includes('야식') || tagStr.includes('맥주') || tagStr.includes('심야') || (item.openHours && (item.openHours.includes('23:') || item.openHours.includes('24:') || item.openHours.includes('02:'))))) return true;
    if (item.tags && item.tags.includes(gt)) return true;
    return false;
  }

  const GOURMET_SEARCH = {
    strings: ['name', 'nameVi', 'description', 'location', 'highlight', 'badge', 'categoryLabel'],
    arrays: ['tags'],
    // signatureMenu entries are either a plain string or {name, desc}.
    extra: (item, q) => (item.signatureMenu || []).some(m => {
      const mStr = typeof m === 'string' ? m : (m.name + ' ' + m.desc);
      return mStr.toLowerCase().includes(q);
    })
  };

  function gourmetSearchMatch(item, q) {
    return matchTextFields(item, q, GOURMET_SEARCH);
  }

  function gourmetCompare(a, b) {
    if (state.sortBy === 'rating') return ((b.rating || 0) * 10000 + (b.reviewCount || 0)) - ((a.rating || 0) * 10000 + (a.reviewCount || 0));
    if (state.sortBy === 'price-asc') return (a.avgPriceVnd || 0) - (b.avgPriceVnd || 0);
    if (state.sortBy === 'price-desc') return (b.avgPriceVnd || 0) - (a.avgPriceVnd || 0);
    return 0;
  }

  function getFilteredGourmets() {
    if (typeof NHA_TRANG_GOURMETS === 'undefined') return [];
    return applyDomainFilter({
      source: NHA_TRANG_GOURMETS,
      catField: 'gourmetCategory', tagField: 'gourmetTag', wishField: 'gourmetWishlist',
      categoryMatch: gourmetCategoryMatch,
      tagMatch: gourmetTagMatch,
      searchMatch: gourmetSearchMatch,
      compare: gourmetCompare
    });
  }

  function gourmetCardTemplate(item) {
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
  }

  function renderGourmets() {
    renderDomainGrid({
      gridContainerId: 'gourmetCardsGridContainer',
      countTextId: 'gourmetResultCountText',
      getFiltered: getFilteredGourmets,
      countHtml: (n) => `총 <strong>${n}</strong>개의 현지인 찐 맛집`,
      emptyHtml: () => `
        <div class="empty-state">
          <div class="icon">🍜</div>
          <h3>조건에 맞는 맛집이 없습니다</h3>
          <p>필터 조건을 초기화하거나 다른 메뉴·식당 이름으로 찾아보세요.</p>
          <button class="btn-reset-filters" id="btnResetGourmetFilters">필터 전체 초기화</button>
        </div>
      `,
      resetBtnId: 'btnResetGourmetFilters',
      cardTemplate: gourmetCardTemplate,
      cardSelector: '.gourmet-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => NHA_TRANG_GOURMETS.find(g => g.id === id),
      openModal: openGourmetModal,
      toggleWishlist: toggleGourmetWishlist,
      rerender: renderGourmets
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

  const GOURMET_MODAL_FIELDS = [
    { id: 'gourmetModalBadge', value: item => item.badge || item.categoryLabel || '인기맛집' },
    { id: 'gourmetModalCategory', value: item => item.categoryLabel || item.category },
    { id: 'gourmetModalTitle', value: 'name' },
    { id: 'gourmetModalNameVi', value: item => item.nameVi || item.name },
    { id: 'gourmetModalRating', value: item => `★ ${item.rating || 4.5} (${Number(item.reviewCount || 0).toLocaleString()}개 구글 리뷰)` },
    { id: 'gourmetModalHours', value: item => item.openHours || '영업시간 확인 권장' },
    { id: 'gourmetModalPriceRange', value: item => item.priceRange || `${formatVND(item.avgPriceVnd)} 내외` },
    { id: 'gourmetModalMeal', value: item => item.recommendedMeal || '점심 / 저녁' },
    { id: 'gourmetModalAddress', value: item => item.addressVi || item.location },
    { id: 'gourmetModalHighlight', value: item => item.highlight || item.description },
    { id: 'gourmetModalDesc', value: item => item.description || '' },
    { id: 'gourmetModalTip', value: item => item.localTip || '웨이팅이 있을 수 있으니 여유 있게 방문하세요.' },
    { id: 'gourmetModalAvgPrice', value: item => formatVND(item.avgPriceVnd) },
    { id: 'gourmetModalAvgKrw', value: item => `(${formatKRW(item.avgPriceVnd)})` },
    { id: 'gourmetModalPricePer', value: () => '/ 1인 예상' },
    { id: 'gourmetModalPhotosBtn', as: 'href', value: item => item.photosUrl || item.mapUrl || '#' },
    { id: 'gourmetModalMapBtn', as: 'href', value: item => item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.name) + ' Nha Trang')}` },
  ];

  function openGourmetModal(item) {
    state.activeModalGourmet = item;
    const modal = document.getElementById('gourmetModal');
    if (!modal) return;

    applyModalFields(item, GOURMET_MODAL_FIELDS);

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

    const noteInput = document.getElementById('gourmetNoteInput');
    const noteStatus = document.getElementById('gourmetNoteStatus');
    if (noteInput) {
      noteInput.value = (state.gourmetNotes || {})[item.id] || '';
      if (noteStatus) noteStatus.textContent = '';
    }

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

    const officialBtn = document.getElementById('gourmetModalOfficialBtn');
    if (officialBtn) officialBtn.href = item.photosUrl || item.mapUrl || '#';

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
  function staysCategoryMatch(item, cat) {
    return (
      item.theme === cat ||
      (cat === 'welcome' && item.theme === 'theme1') ||
      (cat === 'luxury' && item.theme === 'theme2') ||
      (cat === 'poolvilla' && item.theme === 'theme3') ||
      (cat === 'goodbye' && item.theme === 'theme4') ||
      (item.themeName && item.themeName.toLowerCase().includes(cat))
    );
  }

  function staysTagMatch(item, t) {
    const allTags = (item.tags || []).concat(item.amenities || []).join(' ').toLowerCase();
    if (t === 'pool' && (allTags.includes('수영장') || allTags.includes('인피니티풀') || allTags.includes('루프탑풀') || allTags.includes('풀') || item.category === '풀빌라')) return true;
    if (t === 'beach' && (allTags.includes('오션') || allTags.includes('비치') || allTags.includes('해변') || allTags.includes('바다'))) return true;
    if (t === 'private_pool' && (allTags.includes('단독') || allTags.includes('프라이빗') || allTags.includes('개별') || item.category === '풀빌라')) return true;
    if (t === 'budget' && ((item.pricePerNightVnd || 0) <= 1000000 || allTags.includes('가성비') || allTags.includes('5만') || item.theme === 'theme1' || item.theme === 'theme4')) return true;
    if (t === 'shopping' && (allTags.includes('야시장') || allTags.includes('쇼핑') || allTags.includes('시내') || allTags.includes('마트') || (item.nearbySpots || []).some(s => (s || '').includes('야시장') || (s || '').includes('마트')))) return true;
    if ((item.tags || []).includes(t)) return true;
    return false;
  }

  const STAY_SEARCH = {
    strings: ['nameKo', 'nameEn', 'nameVi', 'area', 'address', 'addressVi', 'category', 'themeName'],
    arrays: ['tags', 'amenities', 'highlights', 'nearbySpots']
  };

  function staysSearchMatch(item, q) {
    return matchTextFields(item, q, STAY_SEARCH);
  }

  function staysCompare(a, b) {
    if (state.sortBy === 'rating') return ((b.rating || 0) * 10000 + (b.reviewCount || 0)) - ((a.rating || 0) * 10000 + (a.reviewCount || 0));
    if (state.sortBy === 'price-asc') return (a.pricePerNightVnd || 0) - (b.pricePerNightVnd || 0);
    if (state.sortBy === 'price-desc') return (b.pricePerNightVnd || 0) - (a.pricePerNightVnd || 0);
    return 0;
  }

  function getFilteredStays() {
    if (typeof NHA_TRANG_STAYS === 'undefined') return [];
    return applyDomainFilter({
      source: NHA_TRANG_STAYS,
      catField: 'stayCategory', tagField: 'stayTag', wishField: 'stayWishlist',
      categoryMatch: staysCategoryMatch,
      tagMatch: staysTagMatch,
      searchMatch: staysSearchMatch,
      compare: staysCompare
    });
  }

  function stayCardTemplate(item) {
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
  }

  function renderStays() {
    renderDomainGrid({
      gridContainerId: 'staysCardsGridContainer',
      countTextId: 'stayResultCountText',
      getFiltered: getFilteredStays,
      countHtml: (n) => `총 <strong>${n}</strong>개의 테마별 추천 숙소`,
      emptyHtml: () => `
        <div class="empty-state">
          <div class="icon">🏨</div>
          <h3>조건에 맞는 숙소가 없습니다</h3>
          <p>필터 조건을 초기화하거나 다른 검색어로 찾아보세요.</p>
          <button class="btn-reset-filters" id="btnResetStaysFilters">필터 전체 초기화</button>
        </div>
      `,
      resetBtnId: 'btnResetStaysFilters',
      cardTemplate: stayCardTemplate,
      cardSelector: '.stay-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => NHA_TRANG_STAYS.find(s => s.id === id),
      openModal: openStayModal,
      toggleWishlist: toggleStayWishlist,
      rerender: renderStays
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

  const STAY_MODAL_FIELDS = [
    { id: 'stayModalBadge', value: item => item.badge || '추천' },
    { id: 'stayModalCategory', value: item => item.category || '호텔' },
    { id: 'stayModalThemeBadge', value: item => item.themeName || '테마 숙소' },
    { id: 'stayModalTitle', value: 'nameKo' },
    { id: 'stayModalNameVi', value: item => `${item.nameVi || ''} (${item.nameEn || ''})` },
    { id: 'stayModalRating', value: item => `★ ${item.rating || 4.5} (${Number(item.reviewCount || 0).toLocaleString()}개 구글 리뷰)` },
    { id: 'stayModalPriceRange', value: item => item.priceRange || `${formatVND(item.pricePerNightVnd)} / 1박` },
    { id: 'stayModalLocation', value: item => `${item.area || '시내'} / ${item.address || ''}` },
    { id: 'stayModalAddress', value: item => item.addressVi || item.address },
    { id: 'stayModalHighlight', value: item => (item.highlights && item.highlights[0]) || item.nameKo },
    { id: 'stayModalTip', value: item => item.localTip || item.coupleTip || '체크인 시 고층이나 오션뷰 배정을 요청해보세요.' },
    { id: 'stayModalAvgPrice', value: item => formatVND(item.pricePerNightVnd) },
    { id: 'stayModalAvgKrw', value: item => `(${formatKRW(item.pricePerNightVnd)})` },
    { id: 'stayModalPricePer', value: () => '/ 1박 기준' },
    { id: 'stayModalMapBtn', as: 'href', value: item => item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.nameKo) + ' Nha Trang')}` },
  ];

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

    applyModalFields(item, STAY_MODAL_FIELDS);

    // Modal Header Fields (unique combined string, not a plain field lookup)
    const modalCheckInOut = document.getElementById('stayModalCheckInOut');
    if (modalCheckInOut) modalCheckInOut.textContent = item.checkInOut || '입실 14:00 / 퇴실 12:00';

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

    const noteInput = document.getElementById('stayNoteInput');
    const noteStatus = document.getElementById('stayNoteStatus');
    if (noteInput) {
      noteInput.value = (state.stayNotes || {})[item.id] || '';
      if (noteStatus) noteStatus.textContent = '';
    }

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
  function shoppingTagMatch(item, t) {
    const allText = [
      ...(item.tags || []),
      ...(item.facilities || []),
      ...(item.paymentMethods || []),
      item.qualityTier || '',
      item.category || ''
    ].join(' ').toLowerCase();

    if (t === 'ac') {
      if (item.hasAirConditioning || allText.includes('에어컨')) return true;
    } else if (t === 'fixed') {
      if (item.bargainingRequired === false || allText.includes('정찰')) return true;
    } else if (t === 'transfer') {
      if (allText.includes('계좌이체') || allText.includes('원화') || allText.includes('gln') || allText.includes('카카오페이')) return true;
    } else if (t === 'bargain') {
      if (item.bargainingRequired === true || allText.includes('흥정')) return true;
    } else if (t === 'mirror_tier') {
      if (item.category === 'boutique_mirror' || allText.includes('미러') || allText.includes('sa급')) return true;
    } else if (t === 'value') {
      if (allText.includes('가성비') || (item.avgPriceVnd || 0) <= 250000 || item.category === 'dam_market') return true;
    } else if ((item.tags || []).includes(t)) {
      return true;
    }
    return false;
  }

  const SHOPPING_SEARCH = {
    strings: ['name', 'nameKo', 'nameVi', 'nameEn', 'categoryLabel', 'location',
              'addressVi', 'qualityTier', 'highlight', 'description', 'localTip'],
    arrays: ['tags', 'facilities', 'signatureItems'],
    // bargainingGuide holds objects; sentimentAnalysis is a nested object.
    extra: (item, q) => {
      const inBargain = (item.bargainingGuide || []).some(bg => textIncludes(bg.item, q) || textIncludes(bg.tip, q));
      const s = item.sentimentAnalysis;
      const inSentiment = !!s && (
        textIncludes(s.communityVerdict, q) ||
        (s.pros || []).some(p => textIncludes(p, q)) ||
        (s.cons || []).some(c => textIncludes(c, q)) ||
        textIncludes(s.scamWarning, q)
      );
      return inBargain || inSentiment;
    }
  };

  function shoppingSearchMatch(item, q) {
    return matchTextFields(item, q, SHOPPING_SEARCH);
  }

  function shoppingCompare(a, b) {
    if (state.sortBy === 'rating') return ((b.rating || 0) * 10000 + (b.reviewCount || 0)) - ((a.rating || 0) * 10000 + (a.reviewCount || 0));
    if (state.sortBy === 'price-asc') return (a.avgPriceVnd || 0) - (b.avgPriceVnd || 0);
    if (state.sortBy === 'price-desc') return (b.avgPriceVnd || 0) - (a.avgPriceVnd || 0);
    return 0;
  }

  function getFilteredShopping() {
    if (typeof NHA_TRANG_SHOPPING === 'undefined') return [];
    return applyDomainFilter({
      source: NHA_TRANG_SHOPPING,
      catField: 'shoppingCategory', tagField: 'shoppingTag', wishField: 'shoppingWishlist',
      categoryMatch: (item, cat) => item.category === cat,
      tagMatch: shoppingTagMatch,
      searchMatch: shoppingSearchMatch,
      compare: shoppingCompare
    });
  }

  function shoppingCardTemplate(item) {
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
  }

  function renderShopping() {
    renderDomainGrid({
      gridContainerId: 'shoppingCardsGridContainer',
      countTextId: 'shoppingResultCountText',
      getFiltered: getFilteredShopping,
      countHtml: (n) => `총 <strong>${n}</strong>개의 검증 쇼핑 스팟`,
      emptyHtml: () => `
        <div class="empty-state">
          <div class="icon">🛍️</div>
          <h3>조건에 맞는 쇼핑 스팟이 없습니다</h3>
          <p>필터 조건을 초기화하거나 다른 검색어로 찾아보세요.</p>
          <button class="btn-reset-filters" id="btnResetShoppingFilters">필터 전체 초기화</button>
        </div>
      `,
      resetBtnId: 'btnResetShoppingFilters',
      cardTemplate: shoppingCardTemplate,
      cardSelector: '.shopping-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => NHA_TRANG_SHOPPING.find(s => s.id === id),
      openModal: openShoppingModal,
      toggleWishlist: toggleShoppingWishlist,
      rerender: renderShopping
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

  const SHOPPING_MODAL_FIELDS = [
    { id: 'shoppingModalBadge', value: item => item.badge || item.categoryLabel || '쇼핑' },
    { id: 'shoppingModalCategory', value: item => item.categoryLabel || item.category },
    { id: 'shoppingModalQualityBadge', value: item => item.qualityTier || '품질 인증' },
    { id: 'shoppingModalTitle', value: item => item.nameKo || item.name },
    { id: 'shoppingModalNameVi', value: item => `${item.nameVi || ''} ${item.nameEn ? `(${item.nameEn})` : ''}` },
    { id: 'shoppingModalRating', value: item => `★ ${item.rating || 4.7} (${Number(item.reviewCount || 0).toLocaleString()}개 구글 리뷰)` },
    { id: 'shoppingModalHours', value: item => item.openHours || '09:00 - 21:00' },
    { id: 'shoppingModalPriceRange', value: item => item.priceRange || `${formatVND(item.avgPriceVnd)} 내외` },
    { id: 'shoppingModalLocation', value: item => item.location || '나트랑 시내' },
    { id: 'shoppingModalAddress', value: item => item.addressVi || item.location },
    { id: 'shoppingModalHighlight', value: item => item.highlight || item.description },
    { id: 'shoppingModalDesc', value: item => item.description || '' },
    { id: 'shoppingModalTip', value: item => item.localTip || '기분 좋은 쇼핑을 위해 가벼운 미소와 함께 흥정해보세요.' },
    { id: 'shoppingModalAvgPrice', value: item => formatVND(item.avgPriceVnd) },
    { id: 'shoppingModalAvgKrw', value: item => `(${formatKRW(item.avgPriceVnd)})` },
    { id: 'shoppingModalPricePer', value: () => '/ 평균 기준' },
    { id: 'shoppingModalPhotosBtn', as: 'href', value: item => item.photosUrl || item.mapUrl || '#' },
    { id: 'shoppingModalMapBtn', as: 'href', value: item => item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.nameKo || item.name) + ' Nha Trang')}` },
  ];

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
    applyModalFields(item, SHOPPING_MODAL_FIELDS);

    const modalAcBadge = document.getElementById('shoppingModalAcBadge');
    if (modalAcBadge) {
      modalAcBadge.textContent = item.hasAirConditioning ? '❄️ 에어컨 완비' : '💨 선풍기 가동';
      modalAcBadge.style.display = item.hasAirConditioning ? 'inline-block' : 'none';
    }

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

    const noteInput = document.getElementById('shoppingNoteInput');
    const noteStatus = document.getElementById('shoppingNoteStatus');
    if (noteInput) {
      noteInput.value = (state.shoppingNotes || {})[item.id] || '';
      if (noteStatus) noteStatus.textContent = '';
    }

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
  // KRW per 100 VND. Seeded from DEFAULT_EXCHANGE_RATE so the calculator, the header
  // calculator modal and every card's KRW estimate start from the same number.
  // The rate preset buttons reassign this at runtime.
  let currentBenchmarkRate = (typeof DEFAULT_EXCHANGE_RATE !== 'undefined' ? DEFAULT_EXCHANGE_RATE : 0.0545) * 100;

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

  function currencyCategoryMatch(item, cat) {
    if (cat === 'atm_zero_fee') {
      return item.category === 'atm_zero_fee';
    } else if (cat === 'exchange_gold') {
      return item.category === 'exchange_gold';
    } else if (cat === 'exchange_bank') {
      return item.category === 'exchange_bank';
    } else if (cat === 'exchange_airport') {
      return item.category === 'exchange_airport';
    } else if (cat === 'card_travellog') {
      const cards = (item.supportedCards || []).join(' ');
      const tags = (item.tags || []).join(' ');
      return cards.includes('트래블로그') || tags.includes('트래블로그') || item.category === 'exchange_gold';
    } else if (cat === 'card_travelwallet') {
      const cards = (item.supportedCards || []).join(' ');
      const tags = (item.tags || []).join(' ');
      return cards.includes('트래블월렛') || tags.includes('트래블월렛') || item.category === 'exchange_gold';
    } else if (cat === 'card_sol_toss_wibee') {
      const cards = (item.supportedCards || []).join(' ');
      const tags = (item.tags || []).join(' ');
      return cards.includes('쏠트래블') || cards.includes('토스') || cards.includes('위비') ||
          tags.includes('신한쏠트래블') || tags.includes('토스뱅크') || tags.includes('위비트래블') ||
          item.category === 'exchange_gold';
    } else {
      return item.category === cat;
    }
  }

  function currencyTagMatch(item, t) {
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
      if (item.feeFree === true || allText.includes('수수료 0') || allText.includes('수수료0')) return true;
    } else if (t === 'travellog') {
      if (allText.includes('트래블로그') || (item.supportedCards && item.supportedCards.some(c => c.includes('트래블로그')))) return true;
    } else if (t === 'travelwallet') {
      if (allText.includes('트래블월렛') || (item.supportedCards && item.supportedCards.some(c => c.includes('트래블월렛')))) return true;
    } else if (t === 'sol_travel') {
      if (allText.includes('쏠트래블') || allText.includes('sol') || (item.supportedCards && item.supportedCards.some(c => c.includes('쏠')))) return true;
    } else if (t === 'toss_bank') {
      if (allText.includes('토스') || (item.supportedCards && item.supportedCards.some(c => c.includes('토스')))) return true;
    } else if (t === 'wibee') {
      if (allText.includes('위비') || (item.supportedCards && item.supportedCards.some(c => c.includes('위비')))) return true;
    } else if (t === 'usd100') {
      if (allText.includes('100달러') || allText.includes('신권') || (item.supportedCurrencies && item.supportedCurrencies.some(c => c.includes('100')))) return true;
    } else if (t === 'livebank_24h') {
      if (allText.includes('livebank') || allText.includes('24시간') || (item.facilities && item.facilities.some(f => f.includes('24시간')))) return true;
    } else if (t === 'night_market') {
      if (allText.includes('야시장') || allText.includes('여행자거리') || (item.location || '').includes('야시장')) return true;
    } else if (t === 'korean_atm') {
      if (allText.includes('한국어') || (item.facilities && item.facilities.some(f => f.includes('한국어')))) return true;
    } else if ((item.tags || []).includes(t)) {
      return true;
    }
    return false;
  }

  const CURRENCY_SEARCH = {
    strings: ['name', 'nameKo', 'nameVi', 'nameEn', 'categoryLabel', 'location', 'addressVi',
              'districtLabel', 'highlight', 'description', 'localTip', 'feePolicy', 'withdrawalLimit'],
    arrays: ['tags', 'facilities', 'supportedCards', 'supportedCurrencies', 'exchangePerks']
  };

  function currencySearchMatch(item, q) {
    return matchTextFields(item, q, CURRENCY_SEARCH);
  }

  function currencyCompare(a, b) {
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
    // price-asc / price-desc: switchMainTab hides these options on the currency tab
    // because every spot's avgPriceVnd is 0. Kept only so a stale state.sortBy
    // carried over from another tab degrades to "no reordering" instead of NaN.
    if (state.sortBy === 'price-asc') {
      return (a.avgPriceVnd || 0) - (b.avgPriceVnd || 0);
    }
    if (state.sortBy === 'price-desc') {
      return (b.avgPriceVnd || 0) - (a.avgPriceVnd || 0);
    }
    return 0;
  }

  function getFilteredCurrency() {
    if (typeof NHA_TRANG_CURRENCY === 'undefined') return [];
    return applyDomainFilter({
      source: NHA_TRANG_CURRENCY,
      catField: 'currencyCategory', tagField: 'currencyTag', wishField: 'currencyWishlist',
      categoryMatch: currencyCategoryMatch,
      tagMatch: currencyTagMatch,
      searchMatch: currencySearchMatch,
      compare: currencyCompare
    });
  }

  function currencyCardTemplate(item) {
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
            <img class="card-img" src="${escapeHtml(item.coverImage || (item.images || [])[0] || '')}" alt="${escapeHtml(item.nameKo || item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80'" />
            <span class="card-badge-top-left ${item.feeFree ? 'badge-fee-zero' : ''}">${escapeHtml(item.badge || item.categoryLabel || '환전·ATM')}</span>
            <button type="button" class="card-heart-btn ${isWish ? 'active' : ''}" data-id="${item.id}" aria-label="찜하기">
              ${isWish ? '♥' : '♡'}
            </button>
            ${userNote ? `<span class="card-user-note-badge" title="${escapeHtml(userNote)}">📝 메모</span>` : ''}
          </div>
          <div class="card-content">
            <div class="card-category-row">
              <span class="card-cat-pill">${escapeHtml(item.categoryLabel || '환전·ATM')}</span>
              <span class="currency-badge-fee ${feeBadgeClass}">${feeBadgeText}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.nameKo || item.name)}</h3>
            <p class="card-name-vi">🇻🇳 ${escapeHtml(item.nameVi || '')}</p>
            <div class="card-meta-line">
              <span class="rating">★ ${item.rating || '-'}</span>
              <span class="reviews">(${(item.reviewCount || 0).toLocaleString()})</span>
              <span class="dot">·</span>
              <span class="hours">⏰ ${escapeHtml(item.openHours || '영업시간 미확인')}</span>
            </div>
            <p class="card-location-line">📍 ${escapeHtml(item.location || '나트랑')}</p>

            <div class="supported-card-pills-row">
              ${cardPills}${morePill}
            </div>

            <p class="card-highlight-text">✨ ${escapeHtml(item.highlight || '')}</p>

            <div class="card-bottom-bar">
              <div class="card-fee-info">
                <span class="fee-main">${item.feeFree ? '수수료 0 VND' : '최우대 스프레드'}</span>
                <span class="fee-sub">${escapeHtml(item.feePolicy || '')}</span>
              </div>
              <div class="currency-card-actions">
                <a href="${escapeHtml(item.googleMapUrl || '')}" target="_blank" rel="noopener noreferrer" class="btn-currency-map" onclick="event.stopPropagation();" title="구글 지도로 보기">📍 지도</a>
                <a href="${escapeHtml(item.googlePhotosUrl || item.googleMapUrl || '')}" target="_blank" rel="noopener noreferrer" class="btn-currency-photos" onclick="event.stopPropagation();" title="실시간 사진 보기">📸 사진</a>
              </div>
            </div>
          </div>
        </div>
      `;
  }

  function renderCurrency() {
    renderDomainGrid({
      gridContainerId: 'currencyCardsGridContainer',
      countTextId: 'currencyResultCountText',
      getFiltered: getFilteredCurrency,
      countHtml: (n) => `총 <strong>${n}</strong>개의 검증 환전소 & 수수료 무료 ATM`,
      emptyHtml: () => `
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
      `,
      resetBtnId: 'btnResetCurrencyFilters',
      cardTemplate: currencyCardTemplate,
      cardSelector: '.currency-card',
      ignoreSelectors: ['.card-heart-btn', '.btn-currency-map', '.btn-currency-photos'],
      findItem: (id) => (typeof NHA_TRANG_CURRENCY !== 'undefined' ? NHA_TRANG_CURRENCY : []).find(s => s.id === id),
      openModal: openCurrencyModal,
      toggleWishlist: toggleCurrencyWishlist,
      rerender: renderCurrency
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

  const CURRENCY_MODAL_FIELDS = [
    { id: 'currencyModalBadge', value: item => item.badge || item.categoryLabel },
    { id: 'currencyModalCategory', value: 'categoryLabel' },
    { id: 'currencyModalTitle', value: item => item.nameKo || item.name },
    { id: 'currencyModalNameVi', value: item => `🇻🇳 ${item.nameVi}` },
    { id: 'currencyModalRating', value: item => `★ ${item.rating || '-'} (${(item.reviewCount || 0).toLocaleString()}개 리뷰)` },
    { id: 'currencyModalHours', value: item => item.openHours || '24시간 연중무휴' },
    { id: 'currencyModalFeePolicy', value: item => item.feePolicy || '수수료 0원' },
    { id: 'currencyModalLocation', value: item => item.location || '시내 중심' },
    { id: 'currencyModalAddress', value: 'addressVi' },
    { id: 'currencyModalHighlightText', value: item => item.highlight || '' },
    { id: 'currencyModalDesc', value: item => item.description || '' },
    { id: 'currencyModalTip', value: item => item.localTip || '' },
    { id: 'currencyModalPhotosBtn', as: 'href', value: item => item.googlePhotosUrl || item.googleMapUrl },
    { id: 'currencyModalMapBtn', as: 'href', value: 'googleMapUrl' },
  ];

  function openCurrencyModal(item) {
    const modal = document.getElementById('currencyModal');
    if (!modal || !item) return;

    state.activeModalCurrency = item;

    const mainImgEl = document.getElementById('currencyModalMainImg');
    const thumbsRow = document.getElementById('currencyModalThumbs');
    const images = (item.images && item.images.length > 0) ? item.images : [item.coverImage].filter(Boolean);

    if (mainImgEl) {
      mainImgEl.src = images[0] || item.coverImage;
      mainImgEl.alt = item.nameKo || item.name;
    }

    if (thumbsRow) {
      thumbsRow.innerHTML = images.map((img, idx) => `
        <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(item.nameKo || item.name)} 사진 ${idx + 1}" loading="lazy" />
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

    applyModalFields(item, CURRENCY_MODAL_FIELDS);

    const modalFeeBadge = document.getElementById('currencyModalFeeBadge');
    if (modalFeeBadge) {
      modalFeeBadge.textContent = item.feeFree ? '현지 수수료 0 VND' : '최고 우대 환전';
      modalFeeBadge.style.background = item.feeFree ? '#ECFDF5' : '#FEF3C7';
      modalFeeBadge.style.color = item.feeFree ? '#059669' : '#D97706';
    }

    // NOTE: copy handler is bound once in initEvents() via addEventListener.
    // Do NOT also assign .onclick here — both would fire on a single click.

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

  // --- 8.5 Domain Registry ---
  // 5개 도메인의 배선 차이를 한 테이블로 모은다. 탭을 추가할 때 손댈 곳을
  // 줄이는 것이 목적이며, 렌더/필터/모달 로직은 각 도메인 섹션에 그대로 있다.
  // activities만 접두어 규칙이 다르다(actCategory / wishlist / detailModal 등) —
  // 접두어로 유도하지 말고 이 표의 값을 그대로 쓸 것.
  const DOMAINS = [
    {
      key: 'activities',
      render: () => (state.currentView === 'timeline' ? renderTimeline() : renderCards()),
      categoryNavId: 'activityCategoryNav', tagChipsId: 'activityTagChips',
      catAttr: 'category', tagAttr: 'tag',
      catField: 'actCategory', tagField: 'actTag',
      notesField: 'notes', notesKey: 'nha_trang_notes',
      activeModalField: 'activeModalActivity',
      modalId: 'detailModal', modalCloseBtnId: 'modalCloseBtn', closeModal: () => closeActivityModal(),
      noteInputIds: ['modalNoteInput', 'noteInput'], noteStatusIds: ['modalNoteStatus', 'noteStatus'],
      copyAddressBtnId: null,
      gridSectionId: 'activitiesGridSection',
      placeholder: '액티비티 검색 (예: 스노클링, 마사지, 인생샷, 아이리조트)...',
      heroTitle: '나트랑 힐링 여행 가이드 🌴',
      heroSubtitle: '호핑, 스파, 빈원더스, 선셋 크루즈 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">✨</span> 엄선된 43개 리얼 액티비티</span>
          <span class="hero-stat-pill"><span class="icon">💆</span> 프라이빗 스파 & 머드온천</span>
          <span class="hero-stat-pill"><span class="icon">⛵</span> 럭셔리 선셋 크루즈 & 호핑</span>
          <span class="hero-stat-pill"><span class="icon">🏜️</span> 달랏 / 무이네 근교투어</span>
        `
    },
    {
      key: 'gourmet',
      render: () => renderGourmets(),
      categoryNavId: 'gourmetCategoryNav', tagChipsId: 'gourmetTagChips',
      catAttr: 'gcategory', tagAttr: 'gtag',
      catField: 'gourmetCategory', tagField: 'gourmetTag',
      notesField: 'gourmetNotes', notesKey: 'nha_trang_gourmet_notes',
      activeModalField: 'activeModalGourmet',
      modalId: 'gourmetModal', modalCloseBtnId: 'gourmetModalCloseBtn', closeModal: () => closeGourmetModal(),
      noteInputIds: ['gourmetNoteInput'], noteStatusIds: ['gourmetNoteStatus'],
      copyAddressBtnId: 'gourmetCopyAddressBtn',
      gridSectionId: 'gourmetGridSection',
      placeholder: '로컬 맛집 & 메뉴 검색 (예: 반쎄오, 뚝배기쌀국수, 탄스엉, 망고)...',
      heroTitle: '나트랑 현지인 찐 로컬 맛집 🍜',
      heroSubtitle: '구글 지도 실시간 평점 & 리뷰 검증 완료 현지 맛집 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">📍</span> Google Maps 실시간 연동 검증</span>
          <span class="hero-stat-pill"><span class="icon">🔥</span> 현지인 & 스페셜티 113곳</span>
          <span class="hero-stat-pill"><span class="icon">🦞</span> 바가지 없는 해산물 정찰제</span>
          <span class="hero-stat-pill"><span class="icon">🥭</span> 특A급 생망고 & 솔트커피</span>
        `
    },
    {
      key: 'stays',
      render: () => renderStays(),
      categoryNavId: 'stayCategoryNav', tagChipsId: 'stayTagChips',
      catAttr: 'scategory', tagAttr: 'stag',
      catField: 'stayCategory', tagField: 'stayTag',
      notesField: 'stayNotes', notesKey: 'nha_trang_stay_notes',
      activeModalField: 'activeModalStay',
      modalId: 'stayModal', modalCloseBtnId: 'stayModalCloseBtn', closeModal: () => closeStayModal(),
      noteInputIds: ['stayNoteInput'], noteStatusIds: ['stayNoteStatus'],
      copyAddressBtnId: 'stayCopyAddressBtn',
      gridSectionId: 'staysGridSection',
      placeholder: '숙소명, 지역, 편의시설 검색 (예: 인터컨티넨탈, 풀빌라, 인피니티풀, 야시장)...',
      heroTitle: '나트랑 테마별 추천 숙소 & 리조트 🏨',
      heroSubtitle: '입국 웰컴 0.5박부터 5성급 럭셔리, 감성 풀빌라, 출국 전 0.5박 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">✨</span> 4개 테마별 엄선 24선</span>
          <span class="hero-stat-pill"><span class="icon">👑</span> 5성급 럭셔리 호캉스 & 리조트</span>
          <span class="hero-stat-pill"><span class="icon">🏊</span> 프라이빗 단독 온수/인피니티 풀빌라</span>
          <span class="hero-stat-pill"><span class="icon">💰</span> 5만원 이하 시내 중심 0.5박 알짜 호텔</span>
        `
    },
    {
      key: 'shopping',
      render: () => renderShopping(),
      categoryNavId: 'shoppingCategoryNav', tagChipsId: 'shoppingTagChips',
      catAttr: 'shopcategory', tagAttr: 'shoptag',
      catField: 'shoppingCategory', tagField: 'shoppingTag',
      notesField: 'shoppingNotes', notesKey: 'nha_trang_shopping_notes',
      activeModalField: 'activeModalShopping',
      modalId: 'shoppingModal', modalCloseBtnId: 'shoppingModalCloseBtn', closeModal: () => closeShoppingModal(),
      noteInputIds: ['shoppingNoteInput'], noteStatusIds: ['shoppingNoteStatus'],
      copyAddressBtnId: 'shoppingCopyAddressBtn',
      gridSectionId: 'shoppingGridSection',
      placeholder: '쇼핑 스팟, 브랜드, 품목 검색 (예: 켄켄크록스, 담시장, 미스앤미스터, 스투시, 탑젤리)...',
      heroTitle: '나트랑 짝퉁 & 패션 쇼핑 가이드 🛍️',
      heroSubtitle: '담시장, 야시장, 미러급 부티크부터 실전 흥정 시세표 & 세관 유의사항 총정리',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">👑</span> 미러급 & SA급 하이엔드 샵</span>
          <span class="hero-stat-pill"><span class="icon">🏷️</span> 품목별 실전 흥정 적정가 가이드</span>
          <span class="hero-stat-pill"><span class="icon">❄️</span> 에어컨 완비 & 한국 계좌이체 매장</span>
          <span class="hero-stat-pill"><span class="icon">✈️</span> 한국 세관 통관 & 주의사항 완벽 대비</span>
        `
    },
    {
      key: 'currency',
      render: () => renderCurrency(),
      categoryNavId: 'currencyCategoryNav', tagChipsId: 'currencyTagChips',
      catAttr: 'currcategory', tagAttr: 'currtag',
      catField: 'currencyCategory', tagField: 'currencyTag',
      notesField: 'currencyNotes', notesKey: 'nha_trang_currency_notes',
      activeModalField: 'activeModalCurrency',
      modalId: 'currencyModal', modalCloseBtnId: 'currencyModalCloseBtn', closeModal: () => closeCurrencyModal(),
      noteInputIds: ['currencyNoteInput'], noteStatusIds: ['currencyNoteStatus'],
      copyAddressBtnId: 'currencyCopyAddressBtn',
      gridSectionId: 'currencyGridSection',
      placeholder: '환전소, 은행명, 카드사 검색 (예: VPBank, TPBank, 김청, 트래블로그, 100달러)...',
      heroTitle: '나트랑 환전 & 수수료 무료 ATM 가이드 💱',
      heroSubtitle: '5대 여행 체크카드 맞춤 수수료 0원 ATM & 실전 환율 계산기',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">🏧</span> 5대 카드 수수료 0원 ATM 8곳</span>
          <span class="hero-stat-pill"><span class="icon">💎</span> 김청·김빈 100달러 우대 환전</span>
          <span class="hero-stat-pill"><span class="icon">🛡️</span> DCC 이중환전 차단 완벽 가이드</span>
          <span class="hero-stat-pill"><span class="icon">💱</span> 실시간 양방향 환율 계산기</span>
        `
    }
  ];

  function getDomain(key) {
    return DOMAINS.find(d => d.key === key) || DOMAINS[0];
  }

  function renderCurrentTab() {
    getDomain(state.currentTab).render();
  }

  // --- 9. Tab Switching & UI Controller ---
  function switchMainTab(tab) {
    state.currentTab = tab;

    const navTabs = document.querySelectorAll('.nav-tab-btn');
    navTabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    const domain = getDomain(tab);
    const isActivities = tab === 'activities';
    const isCurrency = tab === 'currency';

    // Toggle Category Bars
    DOMAINS.forEach(d => {
      const nav = document.getElementById(d.categoryNavId);
      if (nav) nav.style.display = d.key === tab ? 'block' : 'none';
    });

    // Toggle Tag Chips
    DOMAINS.forEach(d => {
      const chips = document.getElementById(d.tagChipsId);
      if (chips) chips.style.display = d.key === tab ? 'flex' : 'none';
    });

    const toolbarSection = document.querySelector('.toolbar-section');
    if (toolbarSection) toolbarSection.style.display = 'block';

    const viewToggleButtons = document.getElementById('viewToggleButtons');
    if (viewToggleButtons) viewToggleButtons.style.display = isActivities ? 'flex' : 'none';

    // 환전소/ATM에는 '가격'이 없어 avgPriceVnd가 전부 0이다. 가격 정렬을 그대로 두면
    // 선택해도 순서가 안 바뀌어 고장으로 보이므로 이 탭에서는 옵션 자체를 숨긴다.
    const sortSelectEl = document.getElementById('sortSelect');
    if (sortSelectEl) {
      sortSelectEl.querySelectorAll('option[value="price-asc"], option[value="price-desc"]').forEach(opt => {
        opt.hidden = isCurrency;
        opt.disabled = isCurrency;
      });
      if (isCurrency && (state.sortBy === 'price-asc' || state.sortBy === 'price-desc')) {
        state.sortBy = 'recommended';
        sortSelectEl.value = 'recommended';
      }
    }

    const searchInput = document.getElementById('searchInput');
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitleDesc = document.getElementById('heroSubtitleDesc');
    const heroTagsArea = document.getElementById('heroTagsArea');

    if (searchInput) searchInput.placeholder = domain.placeholder;
    if (heroTitle) heroTitle.textContent = domain.heroTitle;
    if (heroSubtitleDesc) heroSubtitleDesc.textContent = domain.heroSubtitle;
    if (heroTagsArea) heroTagsArea.innerHTML = domain.heroPills;

    // Section display: 자기 탭의 gridSection만 block, 나머지는 전부 none.
    // activities만 grid/timeline 두 뷰가 하나의 gridSectionId를 공유하므로 예외 처리한다.
    const timelineSection = document.getElementById('timelineSection');
    DOMAINS.forEach(d => {
      if (d.key === tab) return;
      const section = document.getElementById(d.gridSectionId);
      if (section) section.style.display = 'none';
    });

    if (isActivities) {
      const activitiesSection = document.getElementById(domain.gridSectionId);
      if (activitiesSection) activitiesSection.style.display = state.currentView === 'grid' ? 'block' : 'none';
      if (timelineSection) timelineSection.style.display = state.currentView === 'timeline' ? 'block' : 'none';
    } else {
      if (timelineSection) timelineSection.style.display = 'none';
      const section = document.getElementById(domain.gridSectionId);
      if (section) section.style.display = 'block';
    }

    domain.render();
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

    DOMAINS.forEach(d => {
      document.querySelectorAll(`#${d.categoryNavId} .category-item-btn`).forEach(b => b.classList.toggle('active', b.dataset[d.catAttr] === 'all'));
      document.querySelectorAll(`#${d.tagChipsId} .tag-chip-btn`).forEach(b => b.classList.toggle('active', b.dataset[d.tagAttr] === 'all'));
    });

    updateWishlistBadge();

    renderCurrentTab();
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
        renderCurrentTab();
      });
    }

    // Category Buttons
    DOMAINS.forEach(d => {
      document.querySelectorAll(`#${d.categoryNavId} .category-item-btn`).forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll(`#${d.categoryNavId} .category-item-btn`).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state[d.catField] = btn.dataset[d.catAttr];
          d.render();
        });
      });
    });

    // Tag Buttons
    DOMAINS.forEach(d => {
      document.querySelectorAll(`#${d.tagChipsId} .tag-chip-btn`).forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll(`#${d.tagChipsId} .tag-chip-btn`).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state[d.tagField] = btn.dataset[d.tagAttr];
          d.render();
        });
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
          renderCurrentTab();
        }, 200);
      });
    }

    const searchClearBtn = document.getElementById('searchClearBtn');
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        state.searchQuery = '';
        renderCurrentTab();
      });
    }

    // Sort Select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderCurrentTab();
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
    const calcModal = document.getElementById('calcModal');
    const guideModal = document.getElementById('guideModal');

    DOMAINS.forEach(d => {
      const modalEl = document.getElementById(d.modalId);
      document.getElementById(d.modalCloseBtnId)?.addEventListener('click', d.closeModal);
      modalEl?.addEventListener('click', (e) => {
        if (e.target === modalEl) d.closeModal();
      });
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
      DOMAINS.forEach(d => {
        const matchesInput = d.noteInputIds.some(id => e.target.matches(`#${id}`));
        if (!matchesInput) return;
        if (!state[d.activeModalField]) return;
        state[d.notesField][state[d.activeModalField].id] = e.target.value;
        saveToStorage(d.notesKey, state[d.notesField]);
        let s = null;
        for (const statusId of d.noteStatusIds) {
          s = document.getElementById(statusId);
          if (s) break;
        }
        if (s) s.textContent = '✓ 저장 완료';
        d.render();
      });
    });

    // Copy Address Handlers
    DOMAINS.forEach(d => {
      if (!d.copyAddressBtnId) return;
      document.getElementById(d.copyAddressBtnId)?.addEventListener('click', (e) => {
        if (state[d.activeModalField]) copyAddress(state[d.activeModalField].addressVi, e.currentTarget);
      });
    });

    // Calculator Modal
    document.getElementById('openCalcBtn')?.addEventListener('click', () => openModal(calcModal));
    document.getElementById('calcCloseBtn')?.addEventListener('click', () => closeModal(calcModal));
    calcModal?.addEventListener('click', (e) => {
      if (e.target === calcModal) closeModal(calcModal);
    });

    // Read the rate live so this modal always agrees with the currency tab calculator,
    // including after the user picks a different rate preset there.
    const getRate = () => currentBenchmarkRate / 100;
    const calcVndInput = document.getElementById('calcVndInput');
    const calcKrwInput = document.getElementById('calcKrwInput');

    calcVndInput?.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const vnd = parseInt(raw, 10) || 0;
      e.target.value = vnd ? vnd.toLocaleString() : '';
      if (calcKrwInput) calcKrwInput.value = vnd ? Math.round(vnd * getRate()).toLocaleString() : '';
    });

    calcKrwInput?.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const krw = parseInt(raw, 10) || 0;
      e.target.value = krw ? krw.toLocaleString() : '';
      if (calcVndInput) calcVndInput.value = krw ? Math.round(krw / getRate()).toLocaleString() : '';
    });

    document.querySelectorAll('.calc-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vnd = parseInt(btn.dataset.vnd, 10) || 0;
        if (calcVndInput) calcVndInput.value = vnd ? vnd.toLocaleString() : '';
        if (calcKrwInput) calcKrwInput.value = vnd ? Math.round(vnd * getRate()).toLocaleString() : '';
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
        DOMAINS.forEach(d => d.closeModal());
        closeModal(calcModal);
        closeModal(guideModal);
      }
    });

    // Initialize currency calculator
    initCurrencyCalculator();
  }

  // --- 11. Initialization Entrypoint ---
  // 5개 모달이 공유하는 껍데기를 여기서 한 번만 만든다. 도메인 마크업은
  // index.html의 <template class="modal-tpl">에 그대로 있고, 이 함수는
  // overlay/box/close 버튼으로 감싸 #modalHost에 넣기만 한다.
  // initEvents()가 모달 id로 엘리먼트를 찾으므로 반드시 그보다 먼저 실행돼야 한다.
  function buildModals() {
    const host = document.getElementById('modalHost');
    if (!host) return;
    document.querySelectorAll('template.modal-tpl').forEach(tpl => {
      const modalId = tpl.dataset.modal;
      const closeId = tpl.dataset.close;
      if (!modalId || !closeId) return;
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = modalId;
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      const box = document.createElement('div');
      box.className = 'modal-box';
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-close-btn';
      closeBtn.id = closeId;
      closeBtn.setAttribute('aria-label', '닫기');
      closeBtn.textContent = '✕';
      box.appendChild(closeBtn);
      box.appendChild(tpl.content.cloneNode(true));
      overlay.appendChild(box);
      host.appendChild(overlay);
    });
  }

  function init() {
    buildModals();
    updateWishlistBadge();
    initEvents();
    renderCards();
  }

  // Browser: boot as usual. Node (test runners): there is no document, so skip booting.
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Node-only export shim so test suites can exercise the REAL filter/sort logic
  // instead of reimplementing it. `module` is undefined in the browser, so this
  // block is inert there and the IIFE keeps leaking nothing into window.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      state,
      resetStateFilters,
      escapeHtml,
      formatVND,
      formatKRW,
      formatVerbalVND,
      formatVerbalKRW,
      getFilteredActivities,
      getFilteredGourmets,
      getFilteredStays,
      getFilteredShopping,
      getFilteredCurrency,
      // Renderers — exported for the snapshot harness (test-render-snapshot.js).
      // They resolve `document` at call time, so the harness can install a stub
      // AFTER requiring this file, which keeps the bootstrap above from running.
      renderCards,
      renderTimeline,
      renderGourmets,
      renderStays,
      renderShopping,
      renderCurrency,
      // Modal openers — Phase 4 refactor target, snapshotted the same way.
      openActivityModal,
      openGourmetModal,
      openStayModal,
      openShoppingModal,
      openCurrencyModal
    };
  }
})();
