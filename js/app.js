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

  /**
   * Sanitizes deserialized localStorage data to prevent prototype pollution,
   * type confusion, and poisoned array/object properties.
   */
  function sanitizeStorageData(data, fallback) {
    if (data === null || data === undefined) {
      if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
        const cleanFallback = Object.create(null);
        Object.assign(cleanFallback, fallback);
        return cleanFallback;
      }
      return fallback;
    }

    if (Array.isArray(fallback)) {
      if (!Array.isArray(data)) return fallback.slice();
      return data
        .filter(item => typeof item === 'string' || typeof item === 'number')
        .slice(0, 500)
        .map(item => String(item).slice(0, 200));
    }

    if (typeof fallback === 'object' && fallback !== null) {
      const cleanObj = Object.create(null);
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        Object.assign(cleanObj, fallback);
        return cleanObj;
      }
      const entries = Object.entries(data).slice(0, 500);
      for (const [k, v] of entries) {
        if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
        const cleanKey = String(k).slice(0, 100);
        if (typeof v === 'string') {
          cleanObj[cleanKey] = v.slice(0, 5000);
        } else if (v !== null && v !== undefined && (typeof v === 'number' || typeof v === 'boolean')) {
          cleanObj[cleanKey] = String(v).slice(0, 5000);
        }
      }
      return cleanObj;
    }

    if (typeof fallback === 'string') {
      if (typeof data !== 'string') return fallback;
      return data.slice(0, 5000);
    }

    if (typeof fallback === 'number') {
      const num = Number(data);
      return isNaN(num) ? fallback : num;
    }

    if (typeof fallback === 'boolean') {
      return typeof data === 'boolean' ? data : fallback;
    }

    return fallback;
  }

  function loadFromStorage(key, fallback) {
    if (!hasStorage()) return sanitizeStorageData(null, fallback);
    try {
      if (typeof key !== 'string' || !key.startsWith('nha_trang_')) {
        console.warn('Blocked reading from non-namespaced storage key:', key);
        return sanitizeStorageData(null, fallback);
      }
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return sanitizeStorageData(null, fallback);
      const parsed = JSON.parse(raw);
      return sanitizeStorageData(parsed, fallback);
    } catch (e) {
      console.warn('LocalStorage load error for key "' + key + '":', e);
      return sanitizeStorageData(null, fallback);
    }
  }

  function saveToStorage(key, val) {
    if (!hasStorage()) return false;
    try {
      if (typeof key !== 'string' || !key.startsWith('nha_trang_')) {
        console.warn('Blocked writing to non-namespaced storage key:', key);
        return false;
      }
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.warn('LocalStorage save error for key "' + key + '":', e);
      return false;
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
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const ENTITY_MAP = {
    'colon': ':',
    'sol': '/',
    'bsol': '\\',
    'tab': '',
    'newline': '',
    'amp': '&',
    'quot': '"',
    'apos': "'",
    'lt': '<',
    'gt': '>'
  };

  const ENTITY_REGEX = /&(?:(colon|sol|bsol|tab|newline|amp|quot|apos|lt|gt)|#x([0-9a-f]+)|#([0-9]+));?/gi;

  function decodeHtmlEntities(str) {
    if (!str || typeof str !== 'string') return '';
    if (str.indexOf('&') === -1) return str;

    let decoded = str;
    for (let i = 0; i < 5; i++) {
      if (decoded.indexOf('&') === -1) break;
      const prev = decoded;
      decoded = decoded.replace(ENTITY_REGEX, (m, name, hex, dec) => {
        if (name) {
          const val = ENTITY_MAP[name.toLowerCase()];
          return val !== undefined ? val : m;
        }
        if (hex) {
          return String.fromCharCode(parseInt(hex, 16) || 0);
        }
        if (dec) {
          return String.fromCharCode(parseInt(dec, 10) || 0);
        }
        return m;
      });
      if (decoded === prev) break;
    }
    return decoded;
  }

  /**
   * Sanitizes dynamic URLs to prevent javascript:, vbscript:, data:, and other XSS attacks.
   * Only allows valid http(s), tel, mailto, anchor (#), and safe relative paths.
   */
  function sanitizeUrl(url, fallback = '#') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    if (trimmed === '' || trimmed === '#') return '#';

    const decoded = decodeHtmlEntities(trimmed);
    const normalized = decoded.replace(/[\x00-\x1f\x7f-\x9f\s]/g, '');

    if (/^(?:javascript|vbscript|data|file|blob|livescript|mocha):/i.test(normalized)) {
      return fallback;
    }

    if (/^[/\\\\]{2}/.test(normalized) || /^[/\\\\]{2}/.test(trimmed) || /^[/\\\\]{2}/.test(decoded)) {
      return fallback;
    }

    const schemeMatch = normalized.match(/^([a-z0-9+.-]+):/i);
    if (schemeMatch) {
      const scheme = schemeMatch[1].toLowerCase();
      if (['http', 'https', 'tel', 'mailto'].includes(scheme)) {
        if ((scheme === 'http' || scheme === 'https') && !/^(?:https?:\/\/)/i.test(normalized)) {
          return fallback;
        }
        return trimmed;
      }
      return fallback;
    }

    if (/^(?:#|\/|\.\/|\.\.\/|\?)/.test(trimmed) && !/^[/\\\\]{2}/.test(trimmed) && !/^[/\\\\]{2}/.test(normalized)) {
      return trimmed;
    }

    if (/^[a-zA-Z0-9_.~!*();@&=+$,/?%#[\]-]+$/.test(trimmed) && !trimmed.includes(':') && !decoded.includes(':') && !/^[/\\\\]{2}/.test(trimmed) && !/^[/\\\\]{2}/.test(normalized)) {
      return trimmed;
    }

    return fallback;
  }

  /**
   * Sanitizes image URLs to prevent script execution via image attributes or handlers.
   */
  function sanitizeImageUrl(url, fallback = '') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    if (trimmed === '') return fallback;

    const decoded = decodeHtmlEntities(trimmed);
    const normalized = decoded.replace(/[\x00-\x1f\x7f-\x9f\s]/g, '');

    if (/^(?:javascript|vbscript|file|blob|livescript|mocha):/i.test(normalized)) {
      return fallback;
    }

    if (/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-zA-Z0-9+/=]+$/i.test(normalized)) {
      return trimmed;
    }

    if (/^[/\\\\]{2}/.test(normalized) || /^[/\\\\]{2}/.test(trimmed) || /^[/\\\\]{2}/.test(decoded)) {
      return fallback;
    }

    const schemeMatch = normalized.match(/^([a-z0-9+.-]+):/i);
    if (schemeMatch) {
      const scheme = schemeMatch[1].toLowerCase();
      if (scheme === 'http' || scheme === 'https') {
        if (!/^(?:https?:\/\/)/i.test(normalized)) return fallback;
        return trimmed;
      }
      return fallback;
    }

    if (/^(?:\/|\.\/|\.\.\/)/.test(trimmed) && !/^[/\\\\]{2}/.test(trimmed) && !/^[/\\\\]{2}/.test(normalized)) {
      return trimmed;
    }

    if (/^[a-zA-Z0-9_.~!*();@&=+$,/?%#[\]-]+$/.test(trimmed) && !trimmed.includes(':') && !decoded.includes(':') && !/^[/\\\\]{2}/.test(trimmed) && !/^[/\\\\]{2}/.test(normalized)) {
      return trimmed;
    }

    return fallback;
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
        const origText = btnEl.textContent;
        btnEl.textContent = '✓ 복사완료';
        btnEl.style.borderColor = 'var(--color-sea)';
        btnEl.style.color = 'var(--color-sea)';
        setTimeout(() => {
          btnEl.textContent = origText;
          btnEl.style.borderColor = '';
          btnEl.style.color = '';
        }, 2000);
      }
    };

    copyTextToClipboard(addressText, notifySuccess);
  }



  function copyTextToClipboard(text, callback) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(callback).catch(() => {
        fallbackCopy(text, callback);
      });
    } else {
      fallbackCopy(text, callback);
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

    // Hotel Dining Filter State
    hoteldiningCategory: 'all',
    hoteldiningTag: 'all',

    // Shopping Filter State
    shoppingCategory: 'all',
    shoppingTag: 'all',

    // Currency Filter State
    currencyCategory: 'all',
    currencyTag: 'all',

    // Spa Filter State
    spaCategory: 'all',
    spaTag: 'all',

    // Curation Filter State
    curationCategory: 'all',
    curationTag: 'all',

    // Guide Hub Filter State
    guideCategory: 'all',
    guideTag: 'all',
    
    // Global Toolbar State
    searchQuery: '',
    sortBy: 'recommended',
    currentView: ['list', 'grid'].includes(loadFromStorage('nha_trang_view', 'list')) ? loadFromStorage('nha_trang_view', 'list') : 'list',
    density: ['tight', 'comfy'].includes(loadFromStorage('nha_trang_density', 'tight')) ? loadFromStorage('nha_trang_density', 'tight') : 'tight',
    openNowOnly: false,
    wishlistOnly: false,
    
    // LocalStorage State
    wishlist: loadFromStorage('nha_trang_wishlist', []),
    gourmetWishlist: loadFromStorage('nha_trang_gourmet_wishlist', []),
    stayWishlist: loadFromStorage('nha_trang_stay_wishlist', []),
    hoteldiningWishlist: loadFromStorage('nha_trang_hoteldining_wishlist', []),
    spaWishlist: loadFromStorage('nha_trang_spa_wishlist', []),
    shoppingWishlist: loadFromStorage('nha_trang_shopping_wishlist', []),
    currencyWishlist: loadFromStorage('nha_trang_currency_wishlist', []),
    notes: loadFromStorage('nha_trang_notes', {}),
    gourmetNotes: loadFromStorage('nha_trang_gourmet_notes', {}),
    stayNotes: loadFromStorage('nha_trang_stay_notes', {}),
    hoteldiningNotes: loadFromStorage('nha_trang_hoteldining_notes', {}),
    spaNotes: loadFromStorage('nha_trang_spa_notes', {}),
    shoppingNotes: loadFromStorage('nha_trang_shopping_notes', {}),
    currencyNotes: loadFromStorage('nha_trang_currency_notes', {}),
    
    // Active Modals
    activeModalActivity: null,
    activeModalGourmet: null,
    activeModalStay: null,
    activeModalHoteldining: null,
    activeModalSpa: null,
    activeModalShopping: null,
    activeModalCurrency: null,
    activeModalFlashcard: null
  };

  function updateWishlistBadge() {
    const total = (state.wishlist ? state.wishlist.length : 0) +
                  (state.gourmetWishlist ? state.gourmetWishlist.length : 0) +
                  (state.stayWishlist ? state.stayWishlist.length : 0) +
                  (state.hoteldiningWishlist ? state.hoteldiningWishlist.length : 0) +
                  (state.spaWishlist ? state.spaWishlist.length : 0) +
                  (state.shoppingWishlist ? state.shoppingWishlist.length : 0) +
                  (state.currencyWishlist ? state.currencyWishlist.length : 0);
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistBtn = document.getElementById('wishlistToggleBtn');
    
    if (wishlistCount) wishlistCount.textContent = total;
    if (wishlistBtn) {
      wishlistBtn.classList.toggle('active', state.wishlistOnly);
      wishlistBtn.setAttribute('aria-pressed', String(state.wishlistOnly));
    }
  }

  function resetStateFilters() {
    state.actCategory = 'all';
    state.actTag = 'all';
    state.gourmetCategory = 'all';
    state.gourmetTag = 'all';
    state.stayCategory = 'all';
    state.stayTag = 'all';
    state.hoteldiningCategory = 'all';
    state.hoteldiningTag = 'all';
    state.spaCategory = 'all';
    state.spaTag = 'all';
    state.shoppingCategory = 'all';
    state.shoppingTag = 'all';
    state.currencyCategory = 'all';
    state.currencyTag = 'all';
    state.curationCategory = 'all';
    state.curationTag = 'all';
    state.guideCategory = 'all';
    state.guideTag = 'all';
    state.searchQuery = '';
    state.sortBy = 'recommended';
    state.wishlistOnly = false;
    state.openNowOnly = false;
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


  // --- 3.55 List Row Pipeline ---
  // 다섯 도메인이 같은 행 컴포넌트를 공유한다. 사진이 실제 장소가 아닌 스톡이라
  // 면적의 절반을 정보 없이 쓰던 카드 대신, 정보를 앞세운 84px 행을 기본 뷰로 둔다.
  // 카드 템플릿(cardTemplate)은 그리드 뷰용으로 그대로 살려둔다.

  /**
   * "15:00 - 21:00", "18:00 - 22:30 (야간 영업)", "24시간" 표기에서 지금 영업 중인지 판정.
   * 형식을 못 읽으면 null — 화면에 상태를 아예 띄우지 않는다.
   */
  function isOpenNow(openHours, now) {
    if (!openHours || typeof openHours !== 'string') return null;
    if (/24\s*시간|24h|24\/7/i.test(openHours)) return true;

    const times = openHours.match(/(\d{1,2}):(\d{2})/g);
    if (!times || times.length < 2) return null;

    const toMin = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const start = toMin(times[0]);
    const end = toMin(times[1]);
    const d = now || new Date();
    const cur = d.getHours() * 60 + d.getMinutes();

    if (end <= start) return cur >= start || cur < end;   // 자정 넘겨 영업
    return cur >= start && cur < end;
  }

  /**
   * "지금 영업중" 필터. 영업시간을 파싱하지 못한 항목은 남긴다 —
   * 정보가 없다는 이유로 숨기면 목록에서 사라진 이유를 알 수 없다.
   */
  function filterOpenNow(list) {
    if (!state.openNowOnly) return list;
    return list.filter(item => isOpenNow(item.openHours) !== false);
  }

  /**
   * "통오징어 반쎄오 (Bánh Xèo Mực Tôm - 45,000 VND)"처럼 이름과 가격이 한 문자열에
   * 섞인 대표 항목을 둘로 나눈다.
   */
  function parseSignature(raw) {
    if (!raw) return null;
    const text = typeof raw === 'string' ? raw : (raw.name || '');
    if (!text) return null;
    const price = text.match(/([\d.,]+\s*(?:VND|₫|동))/i);
    const name = text.replace(/\s*\(.*\)\s*$/, '').trim();
    return { name: name || text, price: price ? price[1].trim() : '' };
  }

  /** 데이터에 지도 URL이 있으면 그대로, 없으면 정식 상호 + 주소로 검색 URL을 만든다. */
  function buildMapUrl(item) {
    if (item.googleMapUrl) return sanitizeUrl(item.googleMapUrl);
    const query = item.googleMapQuery
      || [item.nameVi, item.addressVi].filter(Boolean).join(' ')
      || `${item.nameKo || item.name || item.title || ''} Nha Trang`;
    return sanitizeUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
  }

  /**
   * 공용 리스트 행 마크업. 도메인마다 스키마가 달라 각 섹션의 xRowTemplate이
   * 어댑터 역할로 v를 만들어 넘긴다. 여기서 필드를 늘리면 다섯 도메인 전부에
   * 영향이 가고 test-render-snapshot.js가 잡는다.
   */
  function itemRowHTML(v) {
    // 이미지가 깨져도 빈 박스가 남지 않게 이모지를 아래에 깔고 그 위에 사진을 올린다
    const fallback = `<span class="row-thumb-fallback">${escapeHtml(v.emoji || '📍')}</span>`;
    const safeImg = sanitizeImageUrl(v.imgUrl);
    const thumb = safeImg
      ? `${fallback}<img class="row-img" src="${escapeHtml(safeImg)}" alt="${escapeHtml(v.name)}" loading="lazy" onerror="this.remove();" />`
      : fallback;

    const tags = (v.tags || []).slice(0, 2).map(t =>
      `<span class="row-tag${t.hot ? ' is-hot' : ''}">${escapeHtml(t.label)}</span>`
    ).join('');

    const ratingHtml = v.rating
      ? `<span class="row-rating"><span class="star">★</span> ${escapeHtml(v.rating)}` +
        (v.reviewCount ? ` <span class="cnt">(${Number(v.reviewCount).toLocaleString()})</span>` : '') +
        `</span>`
      : '';

    let statusHtml = '';
    if (v.openState === true) statusHtml = `<span class="row-open">영업중</span>`;
    else if (v.openState === false) statusHtml = `<span class="row-closed">영업 종료</span>`;

    const metaBits = [ratingHtml, statusHtml]
      .concat((v.metaParts || []).filter(Boolean).map(m => `<span>${escapeHtml(m)}</span>`))
      .filter(Boolean)
      .join('<span class="row-dot">·</span>');

    const line3Bits = [];
    if (v.sigLabel) {
      line3Bits.push(
        `<span class="row-sig">${escapeHtml(v.sigLabel)}</span>` +
        (v.sigValue ? ` <b>${escapeHtml(v.sigValue)}</b>` : '')
      );
    }
    if (v.subText) line3Bits.push(`<span class="row-vi">${escapeHtml(v.subText)}</span>`);

    const safeMapUrl = sanitizeUrl(v.mapUrl);

    return `
      <article class="item-row" data-id="${escapeHtml(v.id)}" tabindex="0">
        <div class="row-thumb">
          ${thumb}
          ${v.rank ? `<span class="row-rank">${escapeHtml(v.rank)}</span>` : ''}
        </div>
        <div class="row-main">
          <div class="row-line1">
            <span class="row-name">${escapeHtml(v.name)}</span>
            ${tags}
          </div>
          <div class="row-line2">${metaBits}</div>
          ${line3Bits.length ? `<div class="row-line3">${line3Bits.join('<span class="row-dot">·</span>')}</div>` : ''}
          ${v.note ? `<div class="row-note">📝 ${escapeHtml(v.note)}</div>` : ''}
        </div>
        <div class="row-right">
          <div class="row-price">
            ${v.priceMain ? `<span class="row-price-v">${escapeHtml(v.priceMain)}</span>` : ''}
            ${v.priceKrw ? `<span class="row-price-k">${escapeHtml(v.priceKrw)}</span>` : ''}
            ${v.priceUnit ? `<span class="row-price-u">${escapeHtml(v.priceUnit)}</span>` : ''}
          </div>
          <div class="row-acts">
            <button type="button" class="row-ico row-heart ${v.isWish ? 'is-wishlisted' : ''}" data-id="${escapeHtml(v.id)}" title="찜하기" aria-label="찜하기">♥</button>
            <a class="row-ico" href="${escapeHtml(safeMapUrl)}" target="_blank" rel="noopener noreferrer" title="구글 지도에서 보기" aria-label="구글 지도에서 보기">↗</a>
          </div>
        </div>
      </article>
    `;
  }

  /** 컨테이너를 현재 뷰 모드의 레이아웃 클래스로 바꾸고 리스트 여부를 반환한다. */
  function applyViewClass(container) {
    const isList = state.currentView === 'list';
    container.className = isList
      ? 'items-list' + (state.density === 'comfy' ? ' is-comfy' : '')
      : 'cards-grid';
    return isList;
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

    // 영업중 필터는 openHours를 가진 도메인에만 실제로 작용한다
    // (없는 도메인은 isOpenNow가 null이라 그대로 통과).
    const list = filterOpenNow(cfg.getFiltered());
    if (countEl) {
      countEl.innerHTML = cfg.countHtml(list.length);
    }

    if (list.length === 0) {
      container.className = 'empty-state-wrap';
      container.innerHTML = cfg.emptyHtml();
      const resetBtn = document.getElementById(cfg.resetBtnId);
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('reset-filters'));
        });
      }
      return;
    }

    const isList = applyViewClass(container) && !!cfg.rowTemplate;
    container.innerHTML = isList
      ? list.map((item, idx) => cfg.rowTemplate(item, idx)).join('')
      : list.map(cfg.cardTemplate).join('');

    const itemSelector = isList ? '.item-row' : cfg.cardSelector;
    const ignore = (cfg.ignoreSelectors || ['.card-heart-btn']).concat(['.row-heart', 'a']);

    container.querySelectorAll(itemSelector).forEach(card => {
      const open = () => {
        const item = cfg.findItem(card.dataset.id);
        if (item) cfg.openModal(item);
      };
      card.addEventListener('click', (e) => {
        if (ignore.some(sel => e.target.closest(sel))) return;
        open();
      });
      card.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (ignore.some(sel => e.target.closest(sel))) return;
        e.preventDefault();
        open();
      });
    });

    container.querySelectorAll('.card-heart-btn, .row-heart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        cfg.toggleWishlist(btn.dataset.id);
        cfg.rerender();
      });
    });
  }

  // --- 3.7 Declarative Modal Field Bindings ---
  // 7개 모달이 공유하던 "getElementById -> null 가드 -> 대입" 반복만 걷어낸다.
  // 도메인 고유 블록(ATM 단계, 흥정표, 갤러리 등)은 각 openXModal에 그대로 남는다.
  function applyModalFields(item, fields) {
    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el) return;
      const v = typeof f.value === 'function' ? f.value(item) : item[f.value];
      if (f.as === 'html') el.innerHTML = v == null ? '' : escapeHtml(v);
      else if (f.as === 'src') el.src = sanitizeImageUrl(v == null ? '' : v);
      else if (f.as === 'href') el.href = sanitizeUrl(v == null ? '' : v);
      else el.textContent = v == null ? '' : v;
    });
  }

  // --- 3.8 Shared Modal Chrome & Wishlist Plumbing ---
  // 도메인마다 손으로 복제돼 있던 "찜 토글 / 모달 닫기 / 모달 열기 마무리"를
  // DOMAINS 테이블 위의 함수 하나로 모은다. 도메인 고유 문구·필드명은 전부
  // 테이블에서 읽으므로 여기에는 분기가 없다. DOMAINS는 이 함수들보다 아래에
  // 선언되지만 호출 시점에는 이미 초기화돼 있다 (initEvents와 같은 패턴).

  /** 찜 목록에 id를 넣거나 뺀다. 토스트 문구는 도메인마다 다르므로 테이블 값을 쓴다. */
  function toggleDomainWishlist(key, id) {
    const d = getDomain(key);
    if (!d.wishField) return;
    if (!state[d.wishField]) state[d.wishField] = [];
    const list = state[d.wishField];
    const idx = list.indexOf(id);
    let toastMsg = '';
    if (idx > -1) {
      list.splice(idx, 1);
      toastMsg = d.wishToastRemove;
    } else {
      list.push(id);
      toastMsg = d.wishToastAdd;
    }
    const saved = saveToStorage(d.wishKey, list);
    if (saved === false && hasStorage()) {
      showToast('⚠️ 저장 공간 부족');
    } else if (toastMsg) {
      showToast(toastMsg);
    }
    updateWishlistBadge();
  }

  /** 모달을 닫고 스크롤 락을 풀고 활성 항목 참조를 끊는다. */
  function closeDomainModal(key) {
    const d = getDomain(key);
    const modal = document.getElementById(d.modalId);
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    state[d.activeModalField] = null;
  }

  /**
   * openXModal 6개가 공유하는 마지막 단계: 노트 input 채우기 -> 하트 버튼 문구/핸들러
   * -> 모달 활성화 + 스크롤 락. 하트 버튼은 모달을 열 때마다 새 항목으로 갈아끼워야
   * 하므로 addEventListener가 아니라 .onclick 대입을 유지한다 (중복 바인딩 방지).
   */
  function finishModalOpen(key, item, modal) {
    const d = getDomain(key);

    if (d.notesField) {
      const noteInput = d.noteInputIds.map(i => document.getElementById(i)).find(Boolean);
      if (noteInput) {
        noteInput.value = (state[d.notesField] || {})[item.id] || '';
        const noteStatus = d.noteStatusIds.map(i => document.getElementById(i)).find(Boolean);
        if (noteStatus) noteStatus.textContent = '';
      }
    }

    const heartBtn = d.modalHeartBtnId ? document.getElementById(d.modalHeartBtnId) : null;
    if (heartBtn) {
      // 찜 상태 클래스는 `is-wishlisted`다. 통일 전에는 스파만 `.active`를 붙이고
      // 나머지 5개는 아무 클래스도 안 붙여, 여섯 모달 전부 CSS가 기다리는 상태를
      // 받지 못하고 있었다 (style.css의 `.btn-secondary-link.is-wishlisted`).
      const paint = () => {
        const on = (state[d.wishField] || []).includes(item.id);
        heartBtn.textContent = on ? '♥ 찜 취소' : '♡ 찜하기';
        heartBtn.classList.toggle('is-wishlisted', on);
      };
      paint();
      heartBtn.onclick = () => {
        toggleDomainWishlist(key, item.id);
        paint();
        d.render();
      };
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * 모달 갤러리(메인 이미지 + 썸네일 행 + 클릭 시 스왑). 숙소·쇼핑·환전·스파가
   * 같은 구조를 복제하고 있었다. 액티비티만 sub-imgs-grid 구조라 자체 코드로 남는다.
   *
   * 이미지 배열과 메인 이미지 src/alt는 도메인마다 fallback 체인이 달라 호출부에서
   * 확정해 넘긴다. 썸네일 마크업·data 속성·escapeHtml 적용은 여기서 하나로 통일했다
   * (통일 전 숙소·쇼핑은 src를 escape하지 않아 프로젝트 규약을 위반하고 있었다).
   */
  function renderModalGallery(cfg) {
    const mainImgEl = document.getElementById(cfg.mainImgId);
    const thumbsRow = document.getElementById(cfg.thumbsId);
    const images = cfg.images || [];

    if (mainImgEl) {
      mainImgEl.src = sanitizeImageUrl(cfg.mainSrc);
      mainImgEl.alt = cfg.mainAlt || '';
    }
    if (!thumbsRow) return;

    thumbsRow.innerHTML = images.map((src, idx) => `
        <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
          <img src="${escapeHtml(sanitizeImageUrl(src))}" alt="${escapeHtml(cfg.thumbAlt)} 사진 ${idx + 1}" loading="lazy" />
        </div>
      `).join('');

    thumbsRow.querySelectorAll('.gallery-thumb').forEach(th => {
      th.addEventListener('click', () => {
        const idx = parseInt(th.dataset.idx, 10);
        if (mainImgEl && images[idx]) mainImgEl.src = sanitizeImageUrl(images[idx]);
        thumbsRow.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        th.classList.add('active');
      });
    });
  }

  /** `✔` 불릿 <ul>. 액티비티/숙소 모달이 각자 지역 정의로 복제하던 헬퍼. */
  function setBulletList(id, list, fallbackText) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!list || list.length === 0) {
      el.innerHTML = `<li>${escapeHtml(fallbackText)}</li>`;
      return;
    }
    el.innerHTML = list.map(li => `<li><span class="bullet">✔</span> ${escapeHtml(li)}</li>`).join('');
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

  /** 액티비티 태그의 내부 코드값을 사람이 읽는 라벨로. 카드/행이 공유한다. */
  function activityTagLabel(t) {
    if (t === 'wife' || t === '와이프추천' || t === '와이프픽' || t === '인기추천') return '💖 인기 추천';
    if (t === 'photo' || t === '인생샷') return '📸 인생샷';
    if (t === 'spa' || t === '스파' || t === '힐링') return '💆 힐링 스파';
    if (t === 'rain' || t === '비오는날') return '☔ 비오는날 추천';
    return t;
  }

  function activityCardTemplate(item) {
    const isWish = (state.wishlist || []).includes(item.id);
    const userNote = (state.notes || {})[item.id];
    const tagBadges = (item.tags || []).slice(0, 3)
      .map(t => `<span class="card-tag-pill">${escapeHtml(activityTagLabel(t))}</span>`).join('');

    return `
        <div class="activity-card" data-id="${escapeHtml(item.id)}">
          <div class="card-media-wrapper">
            <img class="card-img" src="${escapeHtml(sanitizeImageUrl(item.imageUrl || (item.images && item.images[0]) || ''))}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80'" />
            <span class="card-badge-top-left">${escapeHtml(item.badge || item.categoryLabel || '추천')}</span>
            <button class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-id="${escapeHtml(item.id)}" title="위시리스트 저장" aria-label="위시리스트 저장">
              ♥
            </button>
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.title)}</span>
              <span class="card-rating"><span class="star">★</span> ${escapeHtml(item.rating || 4.8)}</span>
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

  function activityRowTemplate(item, idx) {
    return itemRowHTML({
      id: item.id,
      rank: idx + 1,
      imgUrl: item.imageUrl || (item.images && item.images[0]) || '',
      emoji: '🏝',
      name: item.title,
      tags: [
        item.badge ? { label: item.badge, hot: true } : null,
        item.categoryLabel ? { label: item.categoryLabel } : null
      ].filter(Boolean),
      rating: item.rating || null,
      reviewCount: item.reviewCount,
      openState: null,
      metaParts: [item.duration, item.location],
      sigLabel: item.bestTime ? `☀️ ${item.bestTime}` : '',
      subText: (item.tags || []).slice(0, 3).map(activityTagLabel).join(' · '),
      priceMain: formatVND(item.priceVnd),
      priceKrw: formatKRW(item.priceVnd),
      priceUnit: item.pricePer || '1인',
      isWish: (state.wishlist || []).includes(item.id),
      note: (state.notes || {})[item.id],
      mapUrl: buildMapUrl(item)
    });
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
      rowTemplate: activityRowTemplate,
      cardSelector: '.activity-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => NHA_TRANG_ACTIVITIES.find(a => a.id === id),
      openModal: openActivityModal,
      toggleWishlist: toggleWishlist,
      rerender: renderCards
    });
  }


  function toggleWishlist(id) { toggleDomainWishlist('activities', id); }

  const ACTIVITY_MODAL_FIELDS = [
    { id: 'modalBadge', value: item => item.badge || item.categoryLabel || '추천' },
    { id: 'modalCategory', value: item => item.categoryLabel || item.category },
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
    { id: 'modalMapLink', as: 'href', value: item => sanitizeUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.googleMapQuery || item.titleEn || item.title) + ' Nha Trang')}`) },
    { id: 'modalReserveLink', as: 'href', value: item => sanitizeUrl(item.reserveUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' Nha Trang')}`) },
  ];

  function openActivityModal(item) {
    state.activeModalActivity = item;
    const modal = document.getElementById('detailModal');
    if (!modal) return;

    // Gallery
    const galleryGrid = document.getElementById('modalGallery');
    if (galleryGrid) {
      const imgs = (item.images && item.images.length > 0) ? item.images : [item.imageUrl];
      const mainImg = sanitizeImageUrl(imgs[0] || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80');
      const subImgs = imgs.slice(1, 5);

      galleryGrid.innerHTML = `
        <div class="gallery-main-img-wrap">
          <img class="main-img" src="${escapeHtml(mainImg)}" alt="${escapeHtml(item.title)}" />
        </div>
        ${subImgs.length > 0 ? `
          <div class="sub-imgs-grid">
            ${subImgs.map(src => `<img src="${escapeHtml(sanitizeImageUrl(src))}" alt="갤러리 사진" loading="lazy" />`).join('')}
          </div>
        ` : ''}
      `;
    }

    applyModalFields(item, ACTIVITY_MODAL_FIELDS);

    // Lists
    const fallback = '해당 정보는 현장 확인 또는 예약처 안내를 참고하세요.';
    setBulletList('modalIncludedList', item.included, fallback);
    setBulletList('modalNotIncludedList', item.notIncluded, fallback);
    setBulletList('modalWhatToBringList', item.whatToBring, fallback);

    finishModalOpen('activities', item, modal);
  }

  function closeActivityModal() { closeDomainModal('activities'); }

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
        <div class="activity-card gourmet-card" data-id="${escapeHtml(item.id)}">
          <div class="card-media-wrapper">
            <div class="gourmet-media-top-row">
              <span class="card-badge-top-left">${escapeHtml(item.badge || item.categoryLabel || '맛집')}</span>
              <button class="card-heart-btn card-heart-btn-static ${isWish ? 'is-wishlisted' : ''}" data-id="${escapeHtml(item.id)}" title="위시리스트 저장" aria-label="위시리스트 저장">
                ♥
              </button>
            </div>
            <div class="gourmet-media-info">
              <div class="gourmet-media-eyebrow">Google Maps 인증 맛집</div>
              <div class="gourmet-media-name">${escapeHtml(item.name)}</div>
              <div class="gourmet-media-name-vi">${escapeHtml(item.nameVi || '')}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.name)}</span>
              <span class="card-rating"><span class="star">★</span> ${escapeHtml(item.rating || 4.5)} <span class="card-review-count">(${Number(item.reviewCount || 0).toLocaleString()})</span></span>
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
              <div class="gourmet-signature-preview">
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

  function gourmetRowTemplate(item, idx) {
    const sig = parseSignature((item.signatureMenu || [])[0]);
    return itemRowHTML({
      id: item.id,
      rank: idx + 1,
      emoji: item.iconEmoji || '🍽️',
      name: item.name,
      tags: [
        item.badge ? { label: item.badge, hot: true } : null,
        item.categoryLabel ? { label: item.categoryLabel } : null
      ].filter(Boolean),
      rating: item.rating,
      reviewCount: item.reviewCount,
      openState: isOpenNow(item.openHours),
      metaParts: [item.openHours, item.location],
      sigLabel: sig ? `⭐ ${sig.name}` : '',
      sigValue: sig ? sig.price : '',
      subText: item.nameVi,
      priceMain: formatVND(item.avgPriceVnd),
      priceKrw: formatKRW(item.avgPriceVnd),
      priceUnit: '1인 예상',
      isWish: (state.gourmetWishlist || []).includes(item.id),
      note: (state.gourmetNotes || {})[item.id],
      mapUrl: buildMapUrl(item)
    });
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
      rowTemplate: gourmetRowTemplate,
      cardSelector: '.gourmet-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => NHA_TRANG_GOURMETS.find(g => g.id === id),
      openModal: openGourmetModal,
      toggleWishlist: toggleGourmetWishlist,
      rerender: renderGourmets
    });
  }

  function toggleGourmetWishlist(id) { toggleDomainWishlist('gourmet', id); }

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
    { id: 'gourmetModalPhotosBtn', as: 'href', value: item => sanitizeUrl(item.photosUrl || item.mapUrl || '#') },
    { id: 'gourmetModalMapBtn', as: 'href', value: item => sanitizeUrl(item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.name) + ' Nha Trang')}`) },
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
              ${m.price ? `<span class="gourmet-menu-price">(${escapeHtml(m.price)})</span>` : ''}
              ${m.desc ? `<div class="gourmet-menu-desc">${escapeHtml(m.desc)}</div>` : ''}
            </li>
          `;
        }).join('');
      } else {
        menuList.innerHTML = '<li>현장 메뉴판을 참고하세요.</li>';
      }
    }

    const officialBtn = document.getElementById('gourmetModalOfficialBtn');
    if (officialBtn) officialBtn.href = sanitizeUrl(item.photosUrl || item.mapUrl || '#');

    finishModalOpen('gourmet', item, modal);
  }

  function closeGourmetModal() { closeDomainModal('gourmet'); }

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
    const mainImg = sanitizeImageUrl((item.photos && item.photos[0]) || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80');
    const themeLabel = item.themeName ? item.themeName.split(' ')[0] : '추천 숙소';
    const amenitiesBadges = (item.amenities || []).slice(0, 3).map(a => `<span class="card-tag-pill">${escapeHtml(a)}</span>`).join('');

    return `
        <div class="activity-card stay-card" data-id="${escapeHtml(item.id)}">
          <div class="card-media-wrapper">
            <img class="card-img" src="${escapeHtml(mainImg)}" alt="${escapeHtml(item.nameKo)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80'" />
            <span class="card-badge-top-left stay-badge-cat">${escapeHtml(item.category || '호텔')}</span>
            <span class="stay-badge-theme">${escapeHtml(themeLabel)}</span>
            <button class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-id="${escapeHtml(item.id)}" title="위시리스트 저장" aria-label="위시리스트 저장">
              ♥
            </button>
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.nameKo)}</span>
              <span class="card-rating">
                <span class="star">★</span> ${escapeHtml(item.rating || 4.5)} 
                <span class="card-review-count">(${Number(item.reviewCount || 0).toLocaleString()})</span>
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

  function stayRowTemplate(item, idx) {
    const checkInOut = [item.checkIn, item.checkOut].filter(Boolean).join(' / ');
    return itemRowHTML({
      id: item.id,
      rank: idx + 1,
      imgUrl: item.coverImage || (item.images && item.images[0]) || '',
      emoji: '🏨',
      name: item.nameKo,
      tags: [
        item.themeName ? { label: item.themeName, hot: true } : null,
        item.category ? { label: item.category } : null
      ].filter(Boolean),
      rating: item.rating,
      reviewCount: item.reviewCount,
      openState: null,
      metaParts: [item.area, checkInOut].filter(Boolean),
      sigLabel: (item.amenities || []).length ? `🛎 ${item.amenities[0]}` : '',
      subText: (item.amenities || []).slice(1, 3).join(' · '),
      priceMain: formatVND(item.pricePerNightVnd),
      priceKrw: formatKRW(item.pricePerNightVnd),
      priceUnit: '1박 기준',
      isWish: (state.stayWishlist || []).includes(item.id),
      note: (state.stayNotes || {})[item.id],
      mapUrl: buildMapUrl(item)
    });
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
      rowTemplate: stayRowTemplate,
      cardSelector: '.stay-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => NHA_TRANG_STAYS.find(s => s.id === id),
      openModal: openStayModal,
      toggleWishlist: toggleStayWishlist,
      rerender: renderStays
    });
  }

  function toggleStayWishlist(id) { toggleDomainWishlist('stays', id); }

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
    { id: 'stayModalMapBtn', as: 'href', value: item => sanitizeUrl(item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.nameKo) + ' Nha Trang')}`) },
  ];

  function openStayModal(item) {
    state.activeModalStay = item;
    const modal = document.getElementById('stayModal');
    if (!modal) return;

    const photos = (item.photos && item.photos.length > 0) ? item.photos : ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80'];
    renderModalGallery({
      mainImgId: 'stayModalMainImg', thumbsId: 'stayModalThumbs',
      images: photos, mainSrc: photos[0], mainAlt: item.nameKo, thumbAlt: '숙소'
    });

    applyModalFields(item, STAY_MODAL_FIELDS);

    // Modal Header Fields (unique combined string, not a plain field lookup)
    const modalCheckInOut = document.getElementById('stayModalCheckInOut');
    if (modalCheckInOut) modalCheckInOut.textContent = item.checkInOut || '입실 14:00 / 퇴실 12:00';

    // Lists
    const fallback = '상세 정보는 예약 페이지를 확인하세요.';
    setBulletList('stayModalAmenitiesList', item.amenities, fallback);
    setBulletList('stayModalHighlightsList', item.highlights, fallback);
    setBulletList('stayModalNearbyList', item.nearbySpots, fallback);

    const tripBtn = document.getElementById('stayModalTripBtn');
    if (tripBtn) tripBtn.href = sanitizeUrl(item.bookingUrl || item.mapUrl || '#');

    finishModalOpen('stays', item, modal);
  }

  function closeStayModal() { closeDomainModal('stays'); }

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
    const mainImg = sanitizeImageUrl((item.photos && item.photos[0]) || 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80');
    const tagPills = (item.tags || []).slice(0, 3).map(t => `<span class="card-tag-pill">${escapeHtml(t)}</span>`).join('');
    const qualityTierBadge = item.qualityTier ? `<span class="shopping-badge-tier">${escapeHtml(item.qualityTier)}</span>` : '';
    const acBadge = item.hasAirConditioning ? `<span class="shopping-badge-ac">❄️ 에어컨</span>` : '';

    return `
        <div class="activity-card shopping-card" data-id="${escapeHtml(item.id)}">
          <div class="card-media-wrapper">
            <img class="card-img" src="${escapeHtml(mainImg)}" alt="${escapeHtml(item.nameKo || item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80'" />
            <span class="card-badge-top-left">${escapeHtml(item.badge || item.categoryLabel || '쇼핑')}</span>
            ${qualityTierBadge}
            ${acBadge}
            <button class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-id="${escapeHtml(item.id)}" title="위시리스트 저장" aria-label="위시리스트 저장">
              ♥
            </button>
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.nameKo || item.name)}</span>
              <span class="card-rating">
                <span class="star">★</span> ${escapeHtml(item.rating || 4.7)} 
                <span class="card-review-count">(${Number(item.reviewCount || 0).toLocaleString()})</span>
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

  function shoppingRowTemplate(item, idx) {
    const sig = parseSignature((item.signatureItems || [])[0]);
    return itemRowHTML({
      id: item.id,
      rank: idx + 1,
      imgUrl: item.coverImage || (item.images && item.images[0]) || '',
      emoji: '🛍️',
      name: item.nameKo || item.name,
      tags: [
        item.qualityTier ? { label: item.qualityTier, hot: true } : null,
        item.hasAirConditioning ? { label: '❄️ 에어컨' } : null,
        item.categoryLabel ? { label: item.categoryLabel } : null
      ].filter(Boolean).slice(0, 2),
      rating: item.rating,
      reviewCount: item.reviewCount,
      openState: isOpenNow(item.openHours),
      metaParts: [item.openHours, item.location],
      sigLabel: sig ? `🛍 ${sig.name}` : '',
      sigValue: sig ? sig.price : '',
      subText: item.bargainingRequired ? '흥정 필요' : '',
      priceMain: formatVND(item.avgPriceVnd),
      priceKrw: formatKRW(item.avgPriceVnd),
      priceUnit: item.pricePer || '평균',
      isWish: (state.shoppingWishlist || []).includes(item.id),
      note: (state.shoppingNotes || {})[item.id],
      mapUrl: buildMapUrl(item)
    });
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
      rowTemplate: shoppingRowTemplate,
      cardSelector: '.shopping-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => NHA_TRANG_SHOPPING.find(s => s.id === id),
      openModal: openShoppingModal,
      toggleWishlist: toggleShoppingWishlist,
      rerender: renderShopping
    });
  }

  function toggleShoppingWishlist(id) { toggleDomainWishlist('shopping', id); }

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
    { id: 'shoppingModalPhotosBtn', as: 'href', value: item => sanitizeUrl(item.photosUrl || item.mapUrl || '#') },
    { id: 'shoppingModalMapBtn', as: 'href', value: item => sanitizeUrl(item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.nameKo || item.name) + ' Nha Trang')}`) },
  ];

  function openShoppingModal(item) {
    state.activeModalShopping = item;
    const modal = document.getElementById('shoppingModal');
    if (!modal) return;

    const photos = (item.photos && item.photos.length > 0) ? item.photos : ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80'];
    renderModalGallery({
      mainImgId: 'shoppingModalMainImg', thumbsId: 'shoppingModalThumbs',
      images: photos, mainSrc: photos[0], mainAlt: item.nameKo || item.name, thumbAlt: '매장'
    });

    // Modal Header
    applyModalFields(item, SHOPPING_MODAL_FIELDS);

    const modalAcBadge = document.getElementById('shoppingModalAcBadge');
    if (modalAcBadge) {
      modalAcBadge.textContent = item.hasAirConditioning ? '❄️ 에어컨 완비' : '💨 선풍기 가동';
      modalAcBadge.style.display = item.hasAirConditioning ? 'inline-block' : 'none';
    }

    const facilitiesEl = document.getElementById('shoppingModalFacilities');
    if (facilitiesEl) {
      const allFacilities = (item.facilities || []).concat(item.paymentMethods || []);
      if (allFacilities.length > 0) {
        facilitiesEl.innerHTML = allFacilities.map(f => `<span class="facility-pill">${escapeHtml(f)}</span>`).join('');
      } else {
        facilitiesEl.innerHTML = '<span class="facility-pill">현금/카드 결제 가능</span>';
      }
    }

    renderShoppingBargainTable(item, document.getElementById('shoppingModalBargainingTable'));
    renderShoppingSentiment(item, document.getElementById('shoppingModalSentimentPanel'));

    // Customs Warning
    const customsWarningText = document.getElementById('shoppingCustomsWarningText');
    if (customsWarningText) {
      customsWarningText.textContent = item.customsCaution || '자가사용 목적 1인 소량 반입을 준수하고 영수증 및 포장 박스/택을 분리하세요.';
    }

    finishModalOpen('shopping', item, modal);
  }

  function renderShoppingBargainTable(item, containerEl) {
    if (!containerEl) return;
    if (item.bargainingGuide && item.bargainingGuide.length > 0) {
      containerEl.innerHTML = `
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
                <td class="price-tip">${escapeHtml(row.tip || '-')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      containerEl.innerHTML = '<p class="modal-empty-note">정찰제 매장이거나 현장 시세에 따라 안내됩니다.</p>';
    }
  }

  function renderShoppingSentiment(item, containerEl) {
    if (!containerEl) return;
    if (item.sentimentAnalysis) {
      const sa = item.sentimentAnalysis;
      containerEl.innerHTML = `
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
          <div class="community-verdict-box">
            📢 커뮤니티 총평: ${escapeHtml(sa.communityVerdict)}
          </div>
        ` : ''}
        ${sa.scamWarning ? `
          <div class="scam-warning-box">
            🚨 호객/눈탱이 방지: ${escapeHtml(sa.scamWarning)}
          </div>
        ` : ''}
      `;
    } else {
      containerEl.innerHTML = '<p class="modal-empty-note">커뮤니티 후기 분석 정보 준비 중입니다.</p>';
    }
  }


  function closeShoppingModal() { closeDomainModal('shopping'); }

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
        <div class="activity-card currency-card" data-id="${escapeHtml(item.id)}">
          <div class="card-media-wrapper">
            <img class="card-img" src="${escapeHtml(sanitizeImageUrl(item.coverImage || (item.images || [])[0] || ''))}" alt="${escapeHtml(item.nameKo || item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80'" />
            <span class="card-badge-top-left ${item.feeFree ? 'badge-fee-zero' : ''}">${escapeHtml(item.badge || item.categoryLabel || '환전·ATM')}</span>
            <button type="button" class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-id="${escapeHtml(item.id)}" aria-label="찜하기">
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
              <span class="rating">★ ${escapeHtml(item.rating || '-')}</span>
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
                <a href="${escapeHtml(sanitizeUrl(item.googleMapUrl || ''))}" target="_blank" rel="noopener noreferrer" class="btn-currency-map" title="구글 지도로 보기">📍 지도</a>
                <a href="${escapeHtml(sanitizeUrl(item.googlePhotosUrl || item.googleMapUrl || ''))}" target="_blank" rel="noopener noreferrer" class="btn-currency-photos" title="실시간 사진 보기">📸 사진</a>
              </div>
            </div>
          </div>
        </div>
      `;
  }

  function currencyRowTemplate(item, idx) {
    return itemRowHTML({
      id: item.id,
      rank: idx + 1,
      imgUrl: item.coverImage || (item.images && item.images[0]) || '',
      emoji: '💱',
      name: item.nameKo || item.name,
      tags: [
        { label: item.feeFree ? '수수료 0원' : '우대 환율', hot: !!item.feeFree },
        item.categoryLabel ? { label: item.categoryLabel } : null
      ].filter(Boolean),
      rating: item.rating,
      reviewCount: item.reviewCount,
      openState: isOpenNow(item.openHours),
      metaParts: [item.openHours, item.location],
      sigLabel: (item.supportedCards || []).length ? `💳 ${item.supportedCards.slice(0, 3).join(', ')}` : '',
      subText: item.bestTiming || item.nameVi,
      priceMain: item.feeFree ? '수수료 0 VND' : '최우대 스프레드',
      priceKrw: '',
      priceUnit: item.feePolicy || '',
      isWish: (state.currencyWishlist || []).includes(item.id),
      note: (state.currencyNotes || {})[item.id],
      mapUrl: buildMapUrl(item)
    });
  }

  function renderCurrency() {
    renderDomainGrid({
      gridContainerId: 'currencyCardsGridContainer',
      countTextId: 'currencyResultCountText',
      getFiltered: getFilteredCurrency,
      countHtml: (n) => `총 <strong>${n}</strong>개의 검증 환전소 & 수수료 무료 ATM`,
      emptyHtml: () => `
        <div class="empty-state empty-state-compact">
          <div class="icon">💱</div>
          <h3>조건에 맞는 환전소나 ATM이 없습니다</h3>
          <p>
            선택하신 카테고리 또는 태그를 변경하거나 검색어를 초기화해보세요.
          </p>
          <button class="btn-primary-reserve" id="btnResetCurrencyFilters">
            전체 보기 및 필터 초기화
          </button>
        </div>
      `,
      resetBtnId: 'btnResetCurrencyFilters',
      cardTemplate: currencyCardTemplate,
      rowTemplate: currencyRowTemplate,
      cardSelector: '.currency-card',
      ignoreSelectors: ['.card-heart-btn', '.btn-currency-map', '.btn-currency-photos'],
      findItem: (id) => (typeof NHA_TRANG_CURRENCY !== 'undefined' ? NHA_TRANG_CURRENCY : []).find(s => s.id === id),
      openModal: openCurrencyModal,
      toggleWishlist: toggleCurrencyWishlist,
      rerender: renderCurrency
    });
  }

  function toggleCurrencyWishlist(id) { toggleDomainWishlist('currency', id); }

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
    { id: 'currencyModalPhotosBtn', as: 'href', value: item => sanitizeUrl(item.googlePhotosUrl || item.googleMapUrl || '#') },
    { id: 'currencyModalMapBtn', as: 'href', value: item => sanitizeUrl(item.googleMapUrl || '#') },
  ];

  function openCurrencyModal(item) {
    const modal = document.getElementById('currencyModal');
    if (!modal || !item) return;

    state.activeModalCurrency = item;

    const images = (item.images && item.images.length > 0) ? item.images : [item.coverImage].filter(Boolean);
    renderModalGallery({
      mainImgId: 'currencyModalMainImg', thumbsId: 'currencyModalThumbs',
      images, mainSrc: images[0] || item.coverImage,
      mainAlt: item.nameKo || item.name, thumbAlt: item.nameKo || item.name
    });

    applyModalFields(item, CURRENCY_MODAL_FIELDS);

    const modalFeeBadge = document.getElementById('currencyModalFeeBadge');
    if (modalFeeBadge) {
      modalFeeBadge.textContent = item.feeFree ? '현지 수수료 0 VND' : '최고 우대 환전';
      modalFeeBadge.style.background = item.feeFree ? 'var(--success-surface)' : 'var(--warn-surface)';
      modalFeeBadge.style.color = item.feeFree ? 'var(--success-mark)' : 'var(--warn-mark)';
    }

    // NOTE: copy handler is bound once in initEvents() via addEventListener.
    // Do NOT also assign .onclick here — both would fire on a single click.

    renderCurrencyCardsList(item, document.getElementById('currencyModalCardsList'));
    renderCurrencyAtmSteps(item, document.getElementById('currencyModalAtmSteps'));
    renderCurrencyDccGuide(document.getElementById('currencyModalDccGuide'));
    renderCurrencyRatesBox(item, document.getElementById('currencyModalRatesBox'));
    renderCurrencyLimitsBox(item, document.getElementById('currencyModalLimitsBox'));
    renderCurrencyFacilities(item, document.getElementById('currencyModalFacilities'));

    finishModalOpen('currency', item, modal);
  }

  function renderCurrencyCardsList(item, el) {
    if (!el) return;
    el.innerHTML = (item.supportedCards || []).map(card => `
      <div class="supported-card-item">
        <span class="card-icon">💳</span>
        <span class="card-name">${escapeHtml(card)}</span>
        <span class="card-status-badge ${item.feeFree ? 'free' : 'exchange'}">${item.feeFree ? '수수료 0원' : '환전 가능'}</span>
      </div>
    `).join('');
  }

  function renderCurrencyAtmSteps(item, el) {
    if (!el) return;
    if (item.category === 'atm_zero_fee') {
      el.innerHTML = `
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
      el.innerHTML = `
        <div class="atm-steps-box">
          <div class="atm-step-item"><span class="step-badge">1</span><span><strong>지폐 상태 확인:</strong> 2013년 이후 발행 빳빳한 $100 신권(낙서/찢김 없음) 제시</span></div>
          <div class="atm-step-item"><span class="step-badge">2</span><span><strong>환율 호가 확인:</strong> 매장 내 계산기에 직원이 찍어주는 환율 확인</span></div>
          <div class="atm-step-item"><span class="step-badge">3</span><span><strong>계수기 대조:</strong> 지폐 계수기 앞에서 금액 확인 후 즉시 가방 안쪽에 수납</span></div>
        </div>
      `;
    }
  }

  function renderCurrencyDccGuide(el) {
    if (!el) return;
    el.innerHTML = `
      <div class="dcc-warning-box">
        <div class="dcc-warning-header">
          <span>🛡️ DCC(원화 이중결제) 차단 필수 수칙</span>
        </div>
        <p>ATM 화면 또는 POS 단말기에서 통화 선택 창이 뜰 경우 <strong>반드시 [Without Conversion] 및 [VND]</strong>를 선택하세요. 원화(KRW) 선택 시 3~8% 불필요한 바가지 수수료가 발생합니다.</p>
      </div>
    `;
  }

  function renderCurrencyRatesBox(item, el) {
    if (!el) return;
    el.innerHTML = `
      <div class="exchange-perks-list">
        ${(item.exchangePerks || []).map(perk => `
          <div class="perk-item"><span class="perk-icon">✨</span><span>${escapeHtml(perk)}</span></div>
        `).join('')}
      </div>
    `;
  }

  function renderCurrencyLimitsBox(item, el) {
    if (!el) return;
    el.innerHTML = `
      <div class="limit-info-box">
        <div class="limit-row"><strong>인출/환전 한도:</strong> <span>${escapeHtml(item.withdrawalLimit || '제한 없음')}</span></div>
        <div class="limit-row"><strong>지원 통화/수단:</strong> <span>${(item.supportedCurrencies || []).map(c => escapeHtml(c)).join(', ')}</span></div>
      </div>
    `;
  }

  function renderCurrencyFacilities(item, el) {
    if (!el) return;
    el.innerHTML = (item.facilities || []).map(f => `
      <span class="facility-chip">✓ ${escapeHtml(f)}</span>
    `).join('');
  }

  function closeCurrencyModal() { closeDomainModal('currency'); }

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
              b.style.background = 'var(--success-mark)';
              b.style.color = 'white';
            } else {
              b.style.background = 'rgba(255,255,255,0.1)';
              b.style.color = 'var(--neutral-border)';
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

  // --- 8.35 Hotel Dining Domain Logic ---
  const HOTELDINING_SEARCH_SPEC = {
    strings: ['name', 'nameVi', 'hotelName', 'location', 'addressVi', 'highlight', 'description', 'localTip', 'categoryLabel', 'badge', 'dressCode'],
    arrays: ['tags', 'signatureMenu']
  };

  function hoteldiningCategoryMatch(item, cat) {
    if (cat === 'all') return true;
    return item.hotelKey === cat || item.category === cat;
  }

  function hoteldiningTagMatch(item, tag) {
    if (tag === 'all') return true;
    const allText = [
      ...(item.tags || []),
      ...(item.signatureMenu || []),
      item.hotelName || '',
      item.name || '',
      item.highlight || '',
      item.description || ''
    ].join(' ').toLowerCase();

    if (tag === 'ocean_view') {
      return allText.includes('오션뷰') || allText.includes('비치') || allText.includes('해변') || allText.includes('바다');
    }
    if (tag === 'breakfast' || tag === 'buffet') {
      return allText.includes('조식') || allText.includes('뷔페') || (item.category === 'buffet');
    }
    if (tag === 'sunset_bar' || tag === 'lounge_bar') {
      return allText.includes('선셋') || allText.includes('루프탑') || allText.includes('라운지') || (item.category === 'lounge_bar');
    }
    if (tag === 'seafood_bbq') {
      return allText.includes('씨푸드') || allText.includes('해산물') || allText.includes('bbq') || allText.includes('그릴') || (item.category === 'seafood_bbq');
    }
    if (tag === 'fine_dining') {
      return allText.includes('파인다이닝') || allText.includes('코스') || allText.includes('프렌치') || (item.category === 'fine_dining');
    }
    if (tag === 'family') {
      return allText.includes('가족') || allText.includes('키즈') || allText.includes('풀보드') || allText.includes('어린이');
    }
    return (item.tags || []).includes(tag);
  }

  function hoteldiningCompare(a, b) {
    if (state.sortBy === 'rating') {
      return ((b.rating || 0) * 10000 + (b.reviewCount || 0)) - ((a.rating || 0) * 10000 + (a.reviewCount || 0));
    }
    if (state.sortBy === 'price-asc') {
      return (a.avgPriceVnd || 0) - (b.avgPriceVnd || 0);
    }
    if (state.sortBy === 'price-desc') {
      return (b.avgPriceVnd || 0) - (a.avgPriceVnd || 0);
    }
    return 0;
  }

  function getFilteredHotelDinings() {
    if (typeof NHA_TRANG_HOTEL_DININGS === 'undefined') return [];
    return applyDomainFilter({
      source: NHA_TRANG_HOTEL_DININGS,
      catField: 'hoteldiningCategory',
      tagField: 'hoteldiningTag',
      wishField: 'hoteldiningWishlist',
      categoryMatch: hoteldiningCategoryMatch,
      tagMatch: hoteldiningTagMatch,
      searchMatch: (item, q) => matchTextFields(item, q, HOTELDINING_SEARCH_SPEC),
      compare: hoteldiningCompare
    });
  }

  function hoteldiningCardTemplate(item) {
    const isWish = (state.hoteldiningWishlist || []).includes(item.id);
    const userNote = (state.hoteldiningNotes || {})[item.id];
    const mainImg = sanitizeImageUrl(item.coverImage || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80');
    const tagsHtml = (item.tags || []).slice(0, 3).map(tag => `<span class="card-tag-pill">${escapeHtml(tag)}</span>`).join('');
    const hotelShortName = item.hotelName ? item.hotelName.split('(')[0].trim() : '5성급 호텔';

    return `
      <div class="activity-card hoteldining-card" data-id="${escapeHtml(item.id)}">
        <div class="card-media-wrapper">
          <img class="card-img" src="${escapeHtml(mainImg)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'" />
          <span class="card-badge-top-left stay-badge-cat">${escapeHtml(item.categoryLabel || '호텔 다이닝')}</span>
          <span class="stay-badge-theme">${escapeHtml(item.badge || '추천')}</span>
          <button class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-id="${escapeHtml(item.id)}" title="위시리스트 저장" aria-label="위시리스트 저장">
            ♥
          </button>
        </div>
        <div class="card-body">
          <div class="card-meta-line" style="font-weight: 700; color: var(--color-primary-ink); margin-bottom: 2px;">
            <span>🏨 ${escapeHtml(hotelShortName)}</span>
          </div>
          <div class="card-header-line">
            <span class="card-title">${escapeHtml(item.name)}</span>
            <span class="card-rating">
              <span class="star">★</span> ${escapeHtml(item.rating || 4.5)} 
              <span class="card-review-count">(${Number(item.reviewCount || 0).toLocaleString()})</span>
            </span>
          </div>
          <div class="card-meta-line">
            <span>🕒 ${escapeHtml(item.openHours || '영업')}</span>
            <span>•</span>
            <span>📍 ${escapeHtml(item.location || '')}</span>
          </div>
          <div class="card-tag-pill-list">
            ${tagsHtml}
          </div>
          <div class="card-price-line">
            <span class="price-main">${formatVND(item.avgPriceVnd)}</span>
            <span class="price-krw">(${formatKRW(item.avgPriceVnd)})</span>
            <span class="price-sub">${escapeHtml(item.pricePer || '/ 1인 기준')}</span>
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

  function hoteldiningRowTemplate(item, idx) {
    return itemRowHTML({
      id: item.id,
      rank: idx + 1,
      imgUrl: item.coverImage || (item.images && item.images[0]) || '',
      emoji: item.iconEmoji || '🍽️',
      name: item.name,
      tags: [
        item.categoryLabel ? { label: item.categoryLabel, hot: true } : null,
        item.badge ? { label: item.badge } : null
      ].filter(Boolean),
      rating: item.rating,
      reviewCount: item.reviewCount,
      openState: isOpenNow(item.openHours),
      metaParts: [item.hotelName, item.location].filter(Boolean),
      sigLabel: (item.signatureMenu || []).length ? `🍽️ ${item.signatureMenu[0]}` : '',
      subText: item.dressCode ? `👔 ${item.dressCode}` : '',
      priceMain: formatVND(item.avgPriceVnd),
      priceKrw: formatKRW(item.avgPriceVnd),
      priceUnit: item.pricePer || '1인 기준',
      isWish: (state.hoteldiningWishlist || []).includes(item.id),
      note: (state.hoteldiningNotes || {})[item.id],
      mapUrl: buildMapUrl(item)
    });
  }

  function renderHotelDinings() {
    renderDomainGrid({
      gridContainerId: 'hoteldiningCardsGridContainer',
      countTextId: 'hoteldiningResultCountText',
      getFiltered: getFilteredHotelDinings,
      countHtml: (n) => `총 <strong>${n}</strong>개의 호텔 시그니처 다이닝`,
      emptyHtml: () => `
        <div class="empty-state">
          <div class="icon">🍽️</div>
          <h3>조건에 맞는 호텔 다이닝이 없습니다</h3>
          <p>필터 조건을 초기화하거나 다른 검색어로 찾아보세요.</p>
          <button class="btn-reset-filters" id="btnResetHotelDiningFilters">필터 전체 초기화</button>
        </div>
      `,
      resetBtnId: 'btnResetHotelDiningFilters',
      cardTemplate: hoteldiningCardTemplate,
      rowTemplate: hoteldiningRowTemplate,
      cardSelector: '.hoteldining-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => (typeof NHA_TRANG_HOTEL_DININGS !== 'undefined' ? NHA_TRANG_HOTEL_DININGS : []).find(d => d.id === id),
      openModal: openHotelDiningModal,
      toggleWishlist: toggleHotelDiningWishlist,
      rerender: renderHotelDinings
    });
  }

  function toggleHotelDiningWishlist(id) {
    toggleDomainWishlist('hoteldining', id);
  }

  const HOTELDINING_MODAL_FIELDS = [
    { id: 'hoteldiningModalBadge', value: item => item.badge || '호텔 다이닝' },
    { id: 'hoteldiningModalCategory', value: item => item.categoryLabel || item.category || '다이닝' },
    { id: 'hoteldiningModalTitle', value: 'name' },
    { id: 'hoteldiningModalHotelName', value: item => `🏨 ${item.hotelName || ''}` },
    { id: 'hoteldiningModalNameVi', value: item => `🇻🇳 ${item.nameVi || ''}` },
    { id: 'hoteldiningModalRating', value: item => `★ ${item.rating || 4.5} (${Number(item.reviewCount || 0).toLocaleString()}개 구글 리뷰)` },
    { id: 'hoteldiningModalPriceRange', value: item => item.priceRangeVnd || `${formatVND(item.avgPriceVnd)}` },
    { id: 'hoteldiningModalOpenHours', value: item => item.openHours || '06:30 - 22:00' },
    { id: 'hoteldiningModalLocation', value: item => item.location || '호텔 내' },
    { id: 'hoteldiningModalAddress', value: item => item.addressVi || '' },
    { id: 'hoteldiningModalHighlight', value: item => item.highlight || item.name },
    { id: 'hoteldiningModalDressCode', value: item => item.dressCode || '스마트 캐주얼' },
    { id: 'hoteldiningModalReservation', value: item => item.reservationRequired || '사전 예약 권장' },
    { id: 'hoteldiningModalPhone', value: item => item.phone || '호텔 대표번호 문의' },
    { id: 'hoteldiningModalDesc', value: item => item.description || '' },
    { id: 'hoteldiningModalTip', value: item => item.localTip || '방문 전 창가 좌석 사전 예약을 권장합니다.' },
    { id: 'hoteldiningModalPriceVnd', value: item => formatVND(item.avgPriceVnd) },
    { id: 'hoteldiningModalPriceKrw', value: item => `(${formatKRW(item.avgPriceVnd)})` },
    { id: 'hoteldiningModalPricePer', value: item => item.pricePer ? `/ ${item.pricePer}` : '/ 1인 기준' },
    { id: 'hoteldiningModalMapLink', as: 'href', value: item => sanitizeUrl(item.googleMapUrl || buildMapUrl(item)) },
    { id: 'hoteldiningModalPhotosLink', as: 'href', value: item => sanitizeUrl(item.googlePhotosUrl || item.googleMapUrl || buildMapUrl(item)) },
    { id: 'hoteldiningModalOfficialLink', as: 'href', value: item => sanitizeUrl(item.officialUrl || item.googleMapUrl || '#') }
  ];

  function openHotelDiningModal(item) {
    state.activeModalHoteldining = item;
    const modal = document.getElementById('hoteldiningModal');
    if (!modal) return;

    const photos = (item.images && item.images.length > 0) ? item.images : (item.coverImage ? [item.coverImage] : ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80']);
    renderModalGallery({
      mainImgId: 'hoteldiningModalMainImg', thumbsId: 'hoteldiningModalThumbs',
      images: photos, mainSrc: photos[0], mainAlt: item.name, thumbAlt: '다이닝'
    });

    applyModalFields(item, HOTELDINING_MODAL_FIELDS);

    // Signature Menu List
    setBulletList('hoteldiningModalSignatureList', item.signatureMenu, '대표 메뉴 정보는 공식 안내를 참고하세요.');

    finishModalOpen('hoteldining', item, modal);
  }

  function closeHotelDiningModal() {
    closeDomainModal('hoteldining');
  }
  // --- 8.4 Spa & Massage Domain ---
  const SPA_SEARCH_SPEC = {
    strings: ['name', 'nameKo', 'nameVi', 'nameEn', 'location', 'districtLabel', 'addressVi', 'highlight', 'description', 'localTip', 'pickupDropoff', 'tipPolicy'],
    arrays: ['tags', 'facilities', 'features'],
    extra: (item, q) => (item.courses || []).some(c => textIncludes(c.name, q) || textIncludes(c.description, q))
  };

  function spaCategoryMatch(item, cat) {
    if (cat === 'all') return true;
    return item.category === cat;
  }

  function spaTagMatch(item, tag) {
    if (tag === 'all') return true;
    const allText = [
      ...(item.tags || []),
      ...(item.facilities || []),
      item.pickupDropoff || '',
      item.tipPolicy || '',
      item.luggageShower?.details || '',
      item.highlight || '',
      item.openHours || '',
      item.description || ''
    ].join(' ').toLowerCase();

    if (tag === 'pickup') {
      return (item.pickupDropoff && (item.pickupDropoff.includes('무료') || item.pickupDropoff.includes('셔틀') || item.pickupDropoff.includes('지원'))) ||
             allText.includes('픽업') || allText.includes('셔틀');
    }
    if (tag === 'shower') {
      return (item.luggageShower && (item.luggageShower.shower || item.luggageShower.luggage)) ||
             allText.includes('샤워') || allText.includes('짐보관');
    }
    if (tag === 'tip_included') {
      return (item.tipPolicy && item.tipPolicy.includes('포함') && !item.tipPolicy.includes('별도')) ||
             (item.tags || []).some(t => t.includes('팁포함'));
    }
    if (tag === 'hot_stone') {
      return allText.includes('핫스톤') || allText.includes('아로마') || allText.includes('대나무') || allText.includes('허브');
    }
    if (tag === 'mud_bath') {
      return allText.includes('머드') || allText.includes('온천') || (item.category === 'family_maternity' && item.name.includes('머드'));
    }
    if (tag === 'couple_room') {
      return allText.includes('커플') || allText.includes('프라이빗') || allText.includes('vip') || allText.includes('개별');
    }
    if (tag === 'late_night') {
      return allText.includes('심야') || allText.includes('0.5박') ||
             (item.openHours && (item.openHours.includes('22:') || item.openHours.includes('23:') || item.openHours.includes('24:')));
    }
    return false;
  }

  function spaCompare(a, b) {
    if (state.sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
    }
    if (state.sortBy === 'price-asc') {
      return (a.avgPriceVnd || a.price90minVnd || a.price60minVnd || 0) - (b.avgPriceVnd || b.price90minVnd || b.price60minVnd || 0);
    }
    if (state.sortBy === 'price-desc') {
      return (b.avgPriceVnd || b.price90minVnd || b.price60minVnd || 0) - (a.avgPriceVnd || a.price90minVnd || a.price60minVnd || 0);
    }
    return 0;
  }

  function getFilteredSpas() {
    return applyDomainFilter({
      source: typeof NHA_TRANG_SPAS !== 'undefined' ? NHA_TRANG_SPAS : [],
      catField: 'spaCategory',
      tagField: 'spaTag',
      wishField: 'spaWishlist',
      categoryMatch: spaCategoryMatch,
      tagMatch: spaTagMatch,
      searchMatch: (item, q) => matchTextFields(item, q, SPA_SEARCH_SPEC),
      compare: spaCompare
    });
  }


  function spaCardTemplate(item) {
    const isWishlisted = (state.spaWishlist || []).includes(item.id);
    const userNote = (state.spaNotes || {})[item.id];
    const isTipIncluded = item.tipPolicy && item.tipPolicy.includes('포함') && !item.tipPolicy.includes('별도');
    const tipBadgeClass = isTipIncluded ? 'spa-badge-service tip-included' : 'spa-badge-service';
    const tipBadgeText = isTipIncluded ? '팁 포함' : '팁 별도';

    const tagsHtml = (item.tags || []).slice(0, 3).map(tag =>
      `<span class="card-tag-pill">${escapeHtml(tag)}</span>`
    ).join('');

    return `
      <div class="spa-card" data-id="${escapeHtml(item.id)}" tabindex="0" role="button" aria-label="${escapeHtml(item.nameKo || item.name)}">
        <div class="card-media-wrapper">
          <img class="card-img" src="${escapeHtml(sanitizeImageUrl(item.coverImage || (item.images && item.images[0]) || ''))}" alt="${escapeHtml(item.nameKo || item.name)}" loading="lazy" />
          <button class="card-heart-btn ${isWishlisted ? 'is-wishlisted' : ''}" data-id="${escapeHtml(item.id)}" title="위시리스트 토글" aria-label="위시리스트">
            ${isWishlisted ? '♥' : '♡'}
          </button>
          <span class="card-badge-top-left">${escapeHtml(item.badge || '추천 스파')}</span>
        </div>
        <div class="card-body">
          <div class="card-category-row">
            <span class="card-cat-pill">${escapeHtml(item.categoryLabel || '스파')}</span>
            <span class="${tipBadgeClass}">${tipBadgeText}</span>
          </div>
          <h3 class="card-title">${escapeHtml(item.nameKo || item.name)}</h3>
          <p class="card-name-vi">🇻🇳 ${escapeHtml(item.nameVi || '')}</p>
          <div class="card-meta-line">
            <span class="rating">★ ${escapeHtml(item.rating || '-')}</span>
            <span class="reviews">(${(item.reviewCount || 0).toLocaleString()})</span>
            <span class="dot">·</span>
            <span class="hours">⏰ ${escapeHtml(item.openHours || '영업시간 미확인')}</span>
          </div>
          <p class="card-location-line">📍 ${escapeHtml(item.location || '나트랑')}</p>

          <div class="card-tag-pill-list">
            ${tagsHtml}
          </div>

          <p class="card-highlight-text">✨ ${escapeHtml(item.highlight || '')}</p>

          <div class="card-price-line">
            <span class="price-main">${item.avgPriceVnd ? formatVND(item.avgPriceVnd) : escapeHtml(item.priceRangeVnd || '')}</span>
            <span class="price-krw">(${item.avgPriceVnd ? formatKRW(item.avgPriceVnd) : ''})</span>
            <span class="price-sub">${escapeHtml(item.pricePer || '/ 90분 기준')}</span>
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

  function spaRowTemplate(item, idx) {
    const isTipIncluded = item.tipPolicy && item.tipPolicy.includes('포함') && !item.tipPolicy.includes('별도');
    return itemRowHTML({
      id: item.id,
      rank: idx + 1,
      imgUrl: item.coverImage || (item.images && item.images[0]) || '',
      emoji: '💆',
      name: item.nameKo || item.name,
      tags: [
        { label: isTipIncluded ? '팁 포함' : '팁 별도', hot: isTipIncluded },
        item.categoryLabel ? { label: item.categoryLabel } : null
      ].filter(Boolean),
      rating: item.rating,
      reviewCount: item.reviewCount,
      openState: isOpenNow(item.openHours),
      metaParts: [item.openHours, item.districtLabel || item.location],
      sigLabel: item.highlight ? `✨ ${item.highlight}` : '',
      subText: item.nameVi,
      priceMain: item.avgPriceVnd ? `${(item.avgPriceVnd / 10000).toLocaleString()}만 동` : (item.priceRangeVnd || '시세 확인'),
      priceKrw: item.avgPriceVnd ? `약 ${Math.round(item.avgPriceVnd * currentBenchmarkRate / 100).toLocaleString()}원` : '',
      priceUnit: item.pricePer || '/ 90분 기준',
      isWish: (state.spaWishlist || []).includes(item.id),
      note: (state.spaNotes || {})[item.id],
      mapUrl: buildMapUrl(item)
    });
  }

  function renderSpa() {
    renderDomainGrid({
      gridContainerId: 'spaCardsGridContainer',
      countTextId: 'spaResultCountText',
      getFiltered: getFilteredSpas,
      countHtml: (n) => `총 <strong>${n}</strong>개의 힐링 스파 & 마사지`,
      emptyHtml: () => `
        <div class="empty-state">
          <div class="icon">💆</div>
          <h3>조건에 맞는 스파나 마사지 샵이 없습니다</h3>
          <p>선택하신 카테고리 또는 태그를 변경하거나 검색어를 초기화해보세요.</p>
          <button class="btn-reset-filters" id="btnResetSpaFilters">필터 전체 초기화</button>
        </div>
      `,
      resetBtnId: 'btnResetSpaFilters',
      cardTemplate: spaCardTemplate,
      rowTemplate: spaRowTemplate,
      cardSelector: '.spa-card',
      ignoreSelectors: ['.card-heart-btn', '.btn-spa-map', '.btn-spa-photos'],
      findItem: (id) => (typeof NHA_TRANG_SPAS !== 'undefined' ? NHA_TRANG_SPAS : []).find(s => s.id === id),
      openModal: openSpaModal,
      toggleWishlist: toggleSpaWishlist,
      rerender: renderSpa
    });
  }

  function toggleSpaWishlist(id) { toggleDomainWishlist('spa', id); }

  const SPA_MODAL_FIELDS = [
    { id: 'spaModalBadge', value: item => item.badge || item.categoryLabel || '추천 스파' },
    { id: 'spaModalCategory', value: 'categoryLabel' },
    { id: 'spaModalTitle', value: item => item.nameKo || item.name },
    { id: 'spaModalNameVi', value: item => `🇻🇳 ${item.nameVi || ''}` },
    { id: 'spaModalRating', value: item => `★ ${item.rating || '-'} (${(item.reviewCount || 0).toLocaleString()}개 리뷰)` },
    { id: 'spaModalHours', value: item => item.openHours || '영업시간 문의' },
    { id: 'spaModalPriceRange', value: item => item.priceRangeVnd || item.priceRange || '' },
    { id: 'spaModalLocation', value: item => item.location || '나트랑' },
    { id: 'spaModalAddress', value: 'addressVi' },
    { id: 'spaModalPickup', value: item => item.pickupDropoff || '픽업/샌딩 문의' },
    { id: 'spaModalTipPolicy', value: item => item.tipPolicy || '팁 정책 확인' },
    { id: 'spaModalLuggage', value: item => item.luggageShower?.details || '짐보관/샤워 시설 문의' },
    { id: 'spaModalDesc', value: item => item.description || '' },
    { id: 'spaModalTip', value: item => item.localTip || '' },
    { id: 'spaModalAvgPrice', value: item => item.avgPriceVnd ? formatVND(item.avgPriceVnd) : '' },
    { id: 'spaModalAvgKrw', value: item => item.avgPriceVnd ? `(${formatKRW(item.avgPriceVnd)})` : '' },
    { id: 'spaModalPricePer', value: item => item.pricePer || '/ 90분 기준' },
    { id: 'spaModalPhotosBtn', as: 'href', value: item => sanitizeUrl(item.googlePhotosUrl || item.googleMapUrl || '#') },
    { id: 'spaModalMapBtn', as: 'href', value: item => sanitizeUrl(item.googleMapUrl || buildMapUrl(item)) },
  ];

  function openSpaModal(item) {
    const modal = document.getElementById('spaModal');
    if (!modal || !item) return;

    state.activeModalSpa = item;

    const images = (item.images && item.images.length > 0) ? item.images : [item.coverImage].filter(Boolean);
    renderModalGallery({
      mainImgId: 'spaModalMainImg', thumbsId: 'spaModalThumbs',
      images, mainSrc: images[0] || item.coverImage || '',
      mainAlt: item.nameKo || item.name || '스파 사진', thumbAlt: item.nameKo || item.name
    });

    applyModalFields(item, SPA_MODAL_FIELDS);

    const tipBadge = document.getElementById('spaModalTipBadge');
    if (tipBadge) {
      const isTipInc = item.tipPolicy && item.tipPolicy.includes('포함') && !item.tipPolicy.includes('별도');
      tipBadge.textContent = isTipInc ? '팁 포함' : '팁 별도';
      tipBadge.style.background = isTipInc ? 'var(--color-primary-light)' : 'var(--warn-surface)';
      tipBadge.style.color = isTipInc ? 'var(--color-primary-ink)' : 'var(--warn-ink)';
    }

    const pickupBadge = document.getElementById('spaModalPickupBadge');
    if (pickupBadge) {
      const hasPickup = item.pickupDropoff && (item.pickupDropoff.includes('무료') || item.pickupDropoff.includes('셔틀') || item.pickupDropoff.includes('지원'));
      pickupBadge.textContent = hasPickup ? '픽드랍 지원' : '픽드랍 별도';
      pickupBadge.style.background = hasPickup ? 'var(--color-primary-light)' : 'var(--color-bg-subtle)';
      pickupBadge.style.color = hasPickup ? 'var(--color-primary-ink)' : 'var(--color-text-secondary)';
    }

    const tbody = document.getElementById('spaModalCourseTableBody');
    if (tbody) {
      const courses = item.courses || [];
      tbody.innerHTML = courses.map(c => `
        <tr>
          <td class="course-name">
            <strong>${escapeHtml(c.name || '')}</strong>
            ${c.description ? `<p class="course-desc">${escapeHtml(c.description)}</p>` : ''}
          </td>
          <td class="course-time">${escapeHtml(c.durationMin != null ? String(c.durationMin) : '-')}분</td>
          <td class="course-vnd">${escapeHtml(Number(c.priceVnd || 0).toLocaleString())} VND</td>
          <td class="course-krw">약 ${escapeHtml(Number(c.priceKrw || Math.round((c.priceVnd || 0) * currentBenchmarkRate / 100)).toLocaleString())}원</td>
        </tr>
      `).join('');
    }

    const amenEl = document.getElementById('spaModalAmenities');
    if (amenEl) {
      const list = item.amenities || item.facilities || [];
      amenEl.innerHTML = list.map(a => `<span class="spa-amenity-pill">✨ ${escapeHtml(a)}</span>`).join('');
    }

    finishModalOpen('spa', item, modal);
  }

  function closeSpaModal() { closeDomainModal('spa'); }

  // --- 8.5 Guide Hub & Survival Kit Domain Logic ---
  function getFilteredFlashcards() {
    if (typeof NHA_TRANG_GUIDE_HUB === 'undefined' || !NHA_TRANG_GUIDE_HUB.flashcards) return [];
    let list = [...NHA_TRANG_GUIDE_HUB.flashcards];

    const cat = state.guideCategory;
    const tag = state.guideTag;
    const targetCat = (cat !== 'all') ? cat : (tag !== 'all' ? tag : null);

    if (targetCat && targetCat !== 'all' && targetCat !== 'flashcards') {
      list = list.filter(fc => fc.category === targetCat);
    }

    const q = (state.searchQuery || '').trim().toLowerCase();
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter(fc => {
        const text = `${fc.ko} ${fc.vi} ${fc.pronunciation} ${fc.purpose} ${fc.categoryLabel || ''} ${fc.category}`.toLowerCase();
        return tokens.every(t => text.includes(t));
      });
    }

    return list;
  }

  function getFilteredSouvenirs() {
    if (typeof NHA_TRANG_GUIDE_HUB === 'undefined' || !NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix || !NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix.items) return [];
    let list = [...NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix.items];

    const q = (state.searchQuery || '').trim().toLowerCase();
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter(item => {
        const text = `${item.nameKo} ${item.nameVi} ${item.category} ${item.unit} ${item.description} ${item.originalVsFakeTip}`.toLowerCase();
        return tokens.every(t => text.includes(t));
      });
    }

    return list;
  }

  function getFilteredPharmacyMeds() {
    if (typeof NHA_TRANG_GUIDE_HUB === 'undefined' || !NHA_TRANG_GUIDE_HUB.emergencyPharmacy || !NHA_TRANG_GUIDE_HUB.emergencyPharmacy.pharmacyMeds) return [];
    let list = [...NHA_TRANG_GUIDE_HUB.emergencyPharmacy.pharmacyMeds];

    const q = (state.searchQuery || '').trim().toLowerCase();
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter(med => {
        const text = `${med.brandName} ${med.activeIngredient} ${med.category} ${med.symptom} ${med.dosageKo} ${med.boxPhotoTip}`.toLowerCase();
        return tokens.every(t => text.includes(t));
      });
    }

    return list;
  }

  // 가이드 허브는 리스트가 아니라 4개 독립 섹션의 조립이다. 한 함수가 450행에
  // 걸쳐 전부 만들던 것을 섹션별 함수로 갈랐다. renderGuide는 카테고리 필터에
  // 따라 조립하고 이벤트를 바인딩하는 일만 한다.

  function guideAirportTableHTML(matrix) {
    return `
          <!-- Airport Matrix Table -->
          <div class="airport-table-wrap">
            <table class="airport-table">
              <thead>
                <tr>
                  <th>이동 구간</th>
                  <th>거리/시간</th>
                  <th>4인승 세단</th>
                  <th>7인승 SUV</th>
                  <th>16인승 밴</th>
                  <th>대중교통 / 특이사항</th>
                </tr>
              </thead>
              <tbody>
                ${matrix.map(r => `
                  <tr>
                    <td><strong>${escapeHtml(r.routeKo)}</strong><div class="souv-name-vi">${escapeHtml(r.routeVi)}</div></td>
                    <td>${r.distanceKm}km<br><span class="label">(${escapeHtml(r.durationMins)})</span></td>
                    <td><strong class="souv-price-mart">${r.sedan4SeatVnd.toLocaleString()}동</strong><br><span class="label">약 ${r.sedan4SeatKrw.toLocaleString()}원</span></td>
                    <td><strong class="souv-price-mart">${r.suv7SeatVnd.toLocaleString()}동</strong><br><span class="label">약 ${r.suv7SeatKrw.toLocaleString()}원</span></td>
                    <td><strong>${r.van16SeatVnd.toLocaleString()}동</strong><br><span class="label">약 ${r.van16SeatKrw.toLocaleString()}원</span></td>
                    <td><span class="label">${escapeHtml(r.busOption)}</span><br><span class="airport-note-warn">💡 ${escapeHtml(r.nightSurcharge)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>`;
  }

  function guideTaxiCompareHTML(comparison) {
    return `
          <!-- 3-Way Taxi Comparison Grid -->
          <div class="taxi-compare-grid">
            <!-- Xanh SM EV -->
            <div class="taxi-compare-card taxi-card-accent-primary">
              <div class="taxi-card-header">
                <div>
                  <h3 class="taxi-card-name">⚡ ${escapeHtml(comparison.xanhSM.nameKo)}</h3>
                  <div class="souv-name-vi">${escapeHtml(comparison.xanhSM.nameVi)}</div>
                </div>
                <span class="taxi-card-tag taxi-card-tag-primary">추천 1위</span>
              </div>
              <div class="taxi-pros"><strong>장점:</strong> ${escapeHtml(comparison.xanhSM.pros)}</div>
              <div class="taxi-cons"><strong>단점:</strong> ${escapeHtml(comparison.xanhSM.cons)}</div>
              <div class="taxi-hotline">📞 콜센터: ${escapeHtml(comparison.xanhSM.hotline)}</div>
            </div>

            <!-- Grab -->
            <div class="taxi-compare-card taxi-card-accent-success">
              <div class="taxi-card-header">
                <div>
                  <h3 class="taxi-card-name">📱 ${escapeHtml(comparison.grab.nameKo)}</h3>
                  <div class="souv-name-vi">${escapeHtml(comparison.grab.nameVi)}</div>
                </div>
                <span class="taxi-card-tag taxi-card-tag-success">정찰제 앱</span>
              </div>
              <div class="taxi-pros"><strong>장점:</strong> ${escapeHtml(comparison.grab.pros)}</div>
              <div class="taxi-cons"><strong>단점:</strong> ${escapeHtml(comparison.grab.cons)}</div>
              <div class="taxi-hotline">📲 예약: ${escapeHtml(comparison.grab.bookingMethod)}</div>
            </div>

            <!-- Traditional Taxis -->
            <div class="taxi-compare-card taxi-card-accent-neutral">
              <div class="taxi-card-header">
                <div>
                  <h3 class="taxi-card-name">🚕 ${escapeHtml(comparison.traditionalTaxis.nameKo)}</h3>
                  <div class="souv-name-vi">${escapeHtml(comparison.traditionalTaxis.nameVi)}</div>
                </div>
                <span class="taxi-card-tag">호텔 대기</span>
              </div>
              <div class="taxi-pros"><strong>장점:</strong> ${escapeHtml(comparison.traditionalTaxis.pros)}</div>
              <div class="taxi-cons"><strong>단점:</strong> ${escapeHtml(comparison.traditionalTaxis.cons)}</div>
              <div class="taxi-hotline">📞 ${escapeHtml(comparison.traditionalTaxis.hotline)}</div>
            </div>
          </div>`;
  }

  function guideScamPreventionHTML(scamPrevention) {
    return `
          <!-- Scam Prevention 5 Rules -->
          <div class="guide-block-spacer">
            <h3 class="guide-subsection-title guide-subsection-title-warn">
              🛡️ 현지 택시·교통 사기 예방 5대 수칙
            </h3>
            <div class="scam-checklist-grid">
              ${scamPrevention.map(s => `
                <div class="scam-card">
                  <h4 class="scam-title">⚠️ ${escapeHtml(s.titleKo)}</h4>
                  <p class="scam-warning">${escapeHtml(s.warningText)}</p>
                  <p class="scam-action">💡 <strong>대처법:</strong> ${escapeHtml(s.actionRule)}</p>
                </div>
              `).join('')}
            </div>
          </div>`;
  }

  function guideIntercityBusHTML(intercityBuses) {
    return `
          <!-- Intercity Bus Guide (Dalat & Mui Ne) -->
          <div class="guide-block-spacer">
            <h3 class="guide-subsection-title">
              🚌 근교 도시 시외버스 & 리무진 가이드 (달랏 & 무이네)
            </h3>
            <div class="intercity-bus-grid">
              ${intercityBuses.map(b => `
                <div class="intercity-bus-card">
                  <div class="intercity-bus-header-row">
                    <h4 class="intercity-bus-destination">📍 ${escapeHtml(b.destination)}</h4>
                    <span class="label">${b.distanceKm}km (${escapeHtml(b.duration)})</span>
                  </div>
                  <p class="intercity-bus-route-feature">${escapeHtml(b.routeFeature)}</p>
                  <div class="intercity-bus-operators-box">
                    <strong class="intercity-bus-operators-label">주요 운행사 & 요금:</strong>
                    <ul class="intercity-bus-operators-list">
                      ${b.majorOperators.map(op => `
                        <li><strong>${escapeHtml(op.name)}:</strong> ${escapeHtml(op.type)} — <span class="souv-price-mart">${op.fareVnd.toLocaleString()}동</span> (약 ${op.fareKrw.toLocaleString()}원)</li>
                      `).join('')}
                    </ul>
                  </div>
                  <div class="intercity-bus-tip">
                    💡 ${escapeHtml(b.tips)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>`;
  }

  function guideMotorbikeRentalHTML(motorbikeRental) {
    return `
          <!-- Motorbike Rental Guide -->
          <div class="motorbike-guide-box">
            <h4 class="motorbike-guide-title">
              🛵 오토바이(스쿠터) 렌트 수칙 & 안전 가이드
            </h4>
            <div class="motorbike-guide-grid">
              <div><strong>💰 1일 렌트비:</strong> ${escapeHtml(motorbikeRental.pricePerDayVnd)}</div>
              <div><strong>🛵 인기 기종:</strong> ${escapeHtml(motorbikeRental.popularModels)}</div>
              <div><strong>📑 보증금 원칙:</strong> ${escapeHtml(motorbikeRental.depositRules)}</div>
              <div><strong>🪖 면허 및 법규:</strong> ${escapeHtml(motorbikeRental.legalRequirements)}</div>
              <div><strong>⛽ 주유 팁:</strong> ${escapeHtml(motorbikeRental.fuelType)}</div>
              <div><strong>🛡️ 안전 수칙:</strong> ${escapeHtml(motorbikeRental.safetyTip)}</div>
            </div>
          </div>`;
  }

  /** 교통·그랩 가이드 섹션 (공항 이동, 택시 앱 비교, 근교 버스, 안전 수칙). */
  function guideTransportHTML(transport) {
    return `
        <section class="guide-section-block" id="transportGuidePanel">
          <div class="guide-section-header">
            <h2 class="guide-section-title">🚗 깜란공항 & 나트랑 시내 교통 완벽 가이드</h2>
            <p class="guide-section-desc">공항 이동 요금표, 전기차 Xanh SM vs 그랩 vs 일반 택시 비교, 5대 사기 예방법</p>
          </div>
${guideAirportTableHTML(transport.airportMatrix)}
${guideTaxiCompareHTML(transport.taxiComparison)}
${guideScamPreventionHTML(transport.scamPrevention)}
${guideIntercityBusHTML(transport.intercityBuses)}
${guideMotorbikeRentalHTML(transport.motorbikeRental)}
        </section>
      `;
  }

  /** 30개 기념품 시세표 비교 테이블 HTML 생성 */
  function guideSouvenirsTableHTML(souvenirs) {
    return `<!-- 30 Souvenir Items Comparison Table -->
          <div class="souvenirs-matrix-wrap">
            <table class="souvenirs-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>품목명 (한국어 / 베트남어)</th>
                  <th>분류</th>
                  <th>규격/용량</th>
                  <th>롯데마트 정찰가</th>
                  <th>시장 목표 흥정가</th>
                  <th>흥정 할인율</th>
                  <th>정품 vs 짝퉁 구별 팁</th>
                  <th>세관 통관</th>
                </tr>
              </thead>
              <tbody>
                ${souvenirs.map((item, idx) => {
                  const martKrw = formatKRW(item.officialPriceVnd);
                  const marketKrw = formatKRW(item.marketBargainPriceVnd);
                  return `
                    <tr>
                      <td class="souv-index-cell">${idx + 1}</td>
                      <td>
                        <div class="souv-name-ko">${escapeHtml(item.nameKo)}</div>
                        <div class="souv-name-vi">${escapeHtml(item.nameVi)}</div>
                        <div class="souv-description">${escapeHtml(item.description)}</div>
                      </td>
                      <td><span class="mini-tag">${escapeHtml(item.category)}</span></td>
                      <td><span class="label">${escapeHtml(item.unit)}</span></td>
                      <td>
                        <div class="souv-price-mart">${item.officialPriceVnd.toLocaleString()}동</div>
                        <div class="souv-price-krw">${martKrw}</div>
                      </td>
                      <td>
                        <div class="souv-price-market">${item.marketBargainPriceVnd.toLocaleString()}동</div>
                        <div class="souv-price-krw">${marketKrw}</div>
                      </td>
                      <td>
                        <span class="souv-discount-badge">-${item.targetDiscountPercent}%</span>
                      </td>
                      <td class="souv-tip-cell">
                        💡 ${escapeHtml(item.originalVsFakeTip)}
                      </td>
                      <td>
                        <span class="souv-customs-badge ${item.customsAllowed ? 'customs-allowed' : 'customs-restricted'}">
                          ${item.customsAllowed ? '✓ 반입가능' : '⚠️ 검역주의'}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>`;
  }

  /** 시장 흥정 팁 콜아웃 박스 HTML 생성 */
  function guideBargainingTipsHTML(bargainingTips) {
    return `<!-- Bargaining Tips Callout Box -->
          <div class="bargaining-guide-box">
            <h3 class="guide-callout-title guide-callout-title-warn">
              🏷️ ${escapeHtml(bargainingTips.marketName)} 실전 5단계 흥정 전략
            </h3>
            <ul class="bargaining-tips-list">
              ${bargainingTips.coreStrategy.map(st => `
                <li>${escapeHtml(st)}</li>
              `).join('')}
            </ul>
          </div>`;
  }

  /** 세관 및 농림축산검역 안내 박스 HTML 생성 */
  function guideCustomsQuarantineHTML(customsQuarantine) {
    return `<!-- Customs Quarantine Guide Box -->
          <div class="customs-guide-box">
            <h3 class="guide-callout-title guide-callout-title-info">
              ✈️ 대한민국 관세청 면세 한도 & 농림축산검역본부 반입 규정
            </h3>
            <div class="customs-info-grid">
              <div class="customs-info-card customs-info-card-info">
                <strong class="customs-info-label-info">💵 1인 면세 한도:</strong>
                <ul class="customs-info-list">
                  <li>기본 면세: 미화 <strong>${escapeHtml(customsQuarantine.dutyFreeAllowance.basicAllowanceUsd)}</strong></li>
                  <li>주류: ${escapeHtml(customsQuarantine.dutyFreeAllowance.alcoholLimit)}</li>
                  <li>담배: ${escapeHtml(customsQuarantine.dutyFreeAllowance.tobaccoLimit)}</li>
                  <li>향수: ${escapeHtml(customsQuarantine.dutyFreeAllowance.perfumeLimit)}</li>
                </ul>
              </div>
              <div class="customs-info-card customs-info-card-danger">
                <strong class="customs-info-label-danger">🚫 반입 전면 금지 (검역 과태료):</strong>
                <ul class="customs-info-list customs-info-list-danger">
                  ${customsQuarantine.prohibitedItems.map(p => `
                    <li>${escapeHtml(p)}</li>
                  `).join('')}
                </ul>
              </div>
              <div class="customs-info-card customs-info-card-success">
                <strong class="customs-info-label-success">✅ 반입 가능 품목:</strong>
                <ul class="customs-info-list customs-info-list-success">
                  ${customsQuarantine.permittedItems.map(p => `
                    <li>${escapeHtml(p)}</li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>`;
  }

  /** 롯데마트 기념품 시세표 섹션. 정찰가/시장 흥정가와 원화 환산을 나란히 둔다. */
  function guideSouvenirMatrixHTML(matrix, souvenirs) {
    return `
        <section class="guide-section-block" id="souvenirsGuidePanel">
          <div class="guide-section-header">
            <div class="guide-header-flex-row">
              <div>
                <h2 class="guide-section-title">🛒 롯데마트 Top 30 쇼핑 시세표</h2>
                <p class="guide-section-desc">정찰제 마트 공식가 vs 담시장·야시장 흥정 목표가 & 정품 구별법 (총 30개 품목)</p>
              </div>
              <span class="mini-tag mini-tag-info">
                검색 일치: ${souvenirs.length}개 품목
              </span>
            </div>
          </div>

          ${guideSouvenirsTableHTML(souvenirs)}

          ${guideBargainingTipsHTML(matrix.bargainingTips)}

          ${guideCustomsQuarantineHTML(matrix.customsQuarantine)}
        </section>
      `;
  }

  /** 응급·24시 약국 섹션 (상비약, 24시 병원, 보험 청구). */
  function guideEmergencyHTML(emergency, meds) {
    return `
        <section class="guide-section-block" id="emergencyGuidePanel">
          <div class="guide-section-header">
            <h2 class="guide-section-title">💊 응급 상비약 & 24시 국제병원 가이드</h2>
            <p class="guide-section-desc">베트남 약국 핵심 10대 상비약, 빈멕·VK 국제병원 24시 핫라인, 해외 여행자보험 5대 청구 서류</p>
          </div>

          <!-- 10 Key Travel Remedies Grid -->
          <div>
            <h3 class="guide-block-title">
              🏥 현지 약국 즉시 구매 가능 10대 핵심 상비약
            </h3>
            <div class="meds-grid">
              ${meds.map(m => `
                <div class="med-card">
                  <div class="med-header">
                    <div>
                      <h4 class="med-name">${escapeHtml(m.brandName)}</h4>
                      <div class="med-ingredient">${escapeHtml(m.activeIngredient)}</div>
                    </div>
                    <span class="med-symptom-tag">${escapeHtml(m.category)}</span>
                  </div>
                  <div class="med-symptom-line">
                    🎯 증상: ${escapeHtml(m.symptom)}
                  </div>
                  <div class="med-dosage">
                    <strong>복용법:</strong> ${escapeHtml(m.dosageKo)}
                  </div>
                  <div class="med-box-tip">
                    📦 ${escapeHtml(m.boxPhotoTip)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 24h International Hospitals -->
          <div class="guide-block-spacer-lg">
            <h3 class="guide-block-title">
              🚨 나트랑 24시 국제 응급 종합병원
            </h3>
            <div class="hospitals-grid">
              ${emergency.hospitals.map(h => `
                <div class="hospital-card">
                  <div>
                    <h4 class="hospital-name-ko">${escapeHtml(h.nameKo)}</h4>
                    <p class="hospital-name-vi">${escapeHtml(h.nameVi)}</p>
                    <p class="hospital-address">📍 ${escapeHtml(h.addressVi)}</p>
                  </div>
                  <div class="hospital-hotline-box">
                    <a href="${escapeHtml(sanitizeUrl('tel:' + h.hotline.replace(/\s+/g, '')))}" class="hospital-hotline-btn">
                      <span>📞 진료 예약/문의: ${escapeHtml(h.hotline)}</span>
                    </a>
                    <a href="${escapeHtml(sanitizeUrl('tel:' + h.emergency24h.replace(/\s+/g, '')))}" class="hospital-hotline-btn hospital-hotline-btn-emergency">
                      <span>🚨 24시 응급실: ${escapeHtml(h.emergency24h)}</span>
                    </a>
                    <a href="${escapeHtml(sanitizeUrl(h.googleMapUrl))}" target="_blank" rel="noopener noreferrer" class="btn-secondary hospital-directions-link">
                      <span>🗺️ 구글 지도 길찾기</span>
                    </a>
                  </div>
                  <ul class="hospital-features-list">
                    ${h.features.map(f => `
                      <li>${escapeHtml(f)}</li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Insurance Claim 5-Step Guide -->
          <div class="insurance-guide-box">
            <h3 class="insurance-guide-title">
              📑 ${escapeHtml(emergency.insuranceGuide.title)}
            </h3>
            <div>
              ${emergency.insuranceGuide.steps.map(st => `
                <div class="insurance-step-item">
                  <div class="insurance-step-no">${escapeHtml(st.stepNo)}</div>
                  <div>
                    <div class="insurance-step-title">${escapeHtml(st.nameKo)}</div>
                    <div class="insurance-step-desc">${escapeHtml(st.desc)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
  }

  /** 원터치 생존 베트남어 플래시카드 섹션. */
  function guideFlashcardsHTML(flashcards, cat) {
    return `
        <section class="guide-section-block" id="flashcardsGuidePanel">
          <div class="guide-section-header">
            <div class="guide-header-flex-row">
              <div>
                <h2 class="guide-section-title">🗣️ 원터치 생존 베트남어 (21종 소통 카드)</h2>
                <p class="guide-section-desc">식당·카페, 택시·그랩, 쇼핑·시장, 응급·호텔 상황별 원클릭 대화 카드 (클릭 시 전면 확대 & 텍스트 복사)</p>
              </div>
              <span class="mini-tag mini-tag-primary">
                카드 ${flashcards.length}개 표시
              </span>
            </div>
          </div>

          <!-- Flashcards Responsive Grid -->
          <div class="flashcards-grid">
            ${flashcards.map(fc => `
              <div class="flashcard-card" data-fc-id="${escapeHtml(fc.id)}">
                <div class="flashcard-card-top">
                  <span class="flashcard-card-icon">${escapeHtml(fc.icon || '🗣️')}</span>
                  <span class="flashcard-card-cat">${escapeHtml(fc.categoryLabel)}</span>
                </div>
                <h3 class="flashcard-card-ko">${escapeHtml(fc.ko)}</h3>
                <div class="flashcard-card-vi">${escapeHtml(fc.vi)}</div>
                <div class="flashcard-card-pron">${escapeHtml(fc.pronunciation)}</div>
                <div class="flashcard-card-purpose">🎯 ${escapeHtml(fc.purpose)}</div>
                <div class="flashcard-card-actions">
                  <button type="button" class="btn-flashcard-zoom" data-fc-zoom="${escapeHtml(fc.id)}">
                    <span>🔍 크게 보기</span>
                  </button>
                  <button type="button" class="btn-flashcard-card-copy" data-fc-copy="${escapeHtml(fc.vi)}">
                    <span>📋 복사</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
  }

  function renderGuide() {
    const container = document.getElementById('guideCardsGridContainer');
    if (!container) return;
    if (typeof NHA_TRANG_GUIDE_HUB === 'undefined') {
      container.innerHTML = '<div class="empty-state">가이드 데이터를 불러오는 중입니다...</div>';
      return;
    }

    const { transport, shoppingPriceMatrix, emergencyPharmacy } = NHA_TRANG_GUIDE_HUB;
    const cat = state.guideCategory;
    const showAll = cat === 'all';
    const showTransport = showAll || cat === 'transport';
    const showShopping = showAll || cat === 'shopping';
    const showEmergency = showAll || cat === 'emergency';
    const showFlashcards = showAll || cat === 'flashcards';

    const filteredSouvenirs = getFilteredSouvenirs();
    const filteredMeds = getFilteredPharmacyMeds();
    const filteredFlashcards = getFilteredFlashcards();

    let html = '';

    // Transport & Grab Guide Section
    if (showTransport) html += guideTransportHTML(transport);

    // Lotte Mart Top 30 Souvenir Price Matrix Section
    if (showShopping) html += guideSouvenirMatrixHTML(shoppingPriceMatrix, filteredSouvenirs);

    // Emergency & 24h Pharmacy Guide Section
    if (showEmergency) html += guideEmergencyHTML(emergencyPharmacy, filteredMeds);

    // One-Touch Vietnamese Flashcards Section
    if (showFlashcards) html += guideFlashcardsHTML(filteredFlashcards, cat);

    container.innerHTML = html;

    // Bind flashcard click & zoom events
    container.querySelectorAll('[data-fc-id]').forEach(cardEl => {
      cardEl.addEventListener('click', (e) => {
        if (e.target.closest('[data-fc-copy]')) return;
        const fcId = cardEl.dataset.fcId;
        const fc = NHA_TRANG_GUIDE_HUB.flashcards.find(f => f.id === fcId);
        if (fc) openFlashcardModal(fc);
      });
    });

    container.querySelectorAll('[data-fc-copy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.fcCopy;
        if (text) {
          const notifySuccess = () => {
            showToast(`📋 베트남어가 복사되었습니다: "${text}"`);
            const span = btn.querySelector('span') || btn;
            const origText = span.textContent;
            span.textContent = '✓ 복사 완료!';
            setTimeout(() => { span.textContent = origText; }, 2000);
          };
          copyTextToClipboard(text, notifySuccess);
        }
      });
    });
  }

  function openFlashcardModal(fc) {
    if (!fc) return;
    state.activeModalFlashcard = fc;

    const iconEl = document.getElementById('flashcardModalIcon');
    const catEl = document.getElementById('flashcardModalCategory');
    const koEl = document.getElementById('flashcardModalKo');
    const viEl = document.getElementById('flashcardModalVi');
    const pronEl = document.getElementById('flashcardModalPron');
    const purposeEl = document.getElementById('flashcardModalPurpose');
    const copyBtn = document.getElementById('flashcardCopyBtn');
    const closeBtn2 = document.getElementById('flashcardModalCloseBtn2');

    if (iconEl) iconEl.textContent = fc.icon || '🗣️';
    if (catEl) catEl.textContent = fc.categoryLabel || '생존 베트남어';
    if (koEl) koEl.textContent = fc.ko;
    if (viEl) viEl.textContent = fc.fullscreenText || fc.vi;
    if (pronEl) pronEl.textContent = fc.pronunciation;
    if (purposeEl) purposeEl.textContent = fc.purpose;

    if (copyBtn) {
      copyBtn.onclick = () => {
        const textToCopy = fc.vi;
        const notifySuccess = () => {
          showToast(`📋 복사완료: "${textToCopy}"`);
          const span = copyBtn.querySelector('span') || copyBtn;
          const origText = span.textContent;
          span.textContent = '✓ 복사 완료!';
          setTimeout(() => { span.textContent = origText; }, 2000);
        };
        copyTextToClipboard(textToCopy, notifySuccess);
      };
    }

    if (closeBtn2) {
      closeBtn2.onclick = () => closeFlashcardModal();
    }

    const modalEl = document.getElementById('flashcardModal');
    if (modalEl) {
      modalEl.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeFlashcardModal() { closeDomainModal('guide'); }

  // --- 8.5 Curation Scenario Domain ---
  function getFilteredCurations() {
    if (typeof NHA_TRANG_CURATIONS === 'undefined' || !NHA_TRANG_CURATIONS) {
      return [];
    }

    const cat = state.curationCategory;
    const tag = state.curationTag;
    const q = state.searchQuery ? state.searchQuery.toLowerCase() : '';

    return NHA_TRANG_CURATIONS.filter(item => {
      // 1. Category Filter
      if (cat && cat !== 'all') {
        const itemCat = item.scenarioKey || item.category;
        if (itemCat !== cat) return false;
      }

      // 2. Tag Filter
      if (tag && tag !== 'all') {
        const allTagText = [
          ...(item.tags || []),
          ...(item.highlights || []),
          ...(item.keyTips || []),
          item.summary || '',
          item.title || ''
        ].join(' ').toLowerCase();

        if (tag === 'luggage' && !(allTagText.includes('짐보관') || allTagText.includes('공항') || allTagText.includes('샌딩') || allTagText.includes('체크아웃'))) return false;
        if (tag === 'indoor' && !(allTagText.includes('실내') || allTagText.includes('머드') || allTagText.includes('온천') || allTagText.includes('우천') || allTagText.includes('애프터눈티'))) return false;
        if (tag === 'late' && !(allTagText.includes('심야') || allTagText.includes('야간') || allTagText.includes('클럽') || allTagText.includes('루프탑') || allTagText.includes('야식'))) return false;
        if (tag === 'sunset' && !(allTagText.includes('선셋') || allTagText.includes('커플') || allTagText.includes('크루즈') || allTagText.includes('파인다이닝') || allTagText.includes('오션뷰'))) return false;
      }

      // 3. Search Query
      if (q) {
        const inTitle = textIncludes(item.title, q) || textIncludes(item.titleEn, q);
        const inSummary = textIncludes(item.summary, q);
        const inTarget = textIncludes(item.targetAudience, q);
        const inTags = (item.tags || []).some(t => textIncludes(t, q));
        const inHighlights = (item.highlights || []).some(h => textIncludes(h, q));
        const inTips = (item.keyTips || []).some(t => textIncludes(t, q));
        const inTimeline = (item.timeline || []).some(step => {
          const inStep = textIncludes(step.title, q) || textIncludes(step.actionGuide, q) || textIncludes(step.location, q);
          const inPlaces = (step.places || step.recommendedPlaces || []).some(p => textIncludes(p.name, q) || textIncludes(p.highlight, q));
          return inStep || inPlaces;
        });

        if (!inTitle && !inSummary && !inTarget && !inTags && !inHighlights && !inTips && !inTimeline) {
          return false;
        }
      }

      return true;
    });
  }

  function getFilteredCuration() {
    return getFilteredCurations();
  }

  function getDomainEmoji(domain) {
    const emojis = {
      spa: '💆',
      gourmet: '🍜',
      shopping: '🛍️',
      hoteldining: '🍽️',
      activities: '⛵',
      stays: '🏨',
      currency: '💱'
    };
    return emojis[domain] || '📍';
  }

  function renderCurationTimelineStep(step) {
    const places = step.places || step.recommendedPlaces || [];
    const stepNo = step.stepNo || step.step;
    const transit = step.transitTime || step.duration || '';
    const actionDesc = step.actionGuide || step.description || '';

    const placesHtml = places.length > 0 ? `
      <div class="timeline-places-grid">
        ${places.map(place => {
          const safeMapUrl = sanitizeUrl(place.mapUrl || place.googleMapUrl || buildMapUrl(place));
          const emoji = getDomainEmoji(place.domain);
          const ratingText = place.rating
            ? `<span class="timeline-place-rating"><span class="star">★</span> ${escapeHtml(place.rating)}</span>`
            : '';
          const reviewCountText = place.reviewCount
            ? `<span>(${Number(place.reviewCount).toLocaleString()})</span>`
            : '';
          const categoryOrHours = place.categoryLabel || place.hours || '';

          return `
            <div class="timeline-place-card">
              <div class="timeline-place-thumb">${emoji}</div>
              <div class="timeline-place-info">
                <span class="timeline-place-name" title="${escapeHtml(place.name)}">${escapeHtml(place.name)}</span>
                <div class="timeline-place-sub">
                  ${ratingText}
                  ${reviewCountText}
                  ${categoryOrHours ? `<span>·</span><span>${escapeHtml(categoryOrHours)}</span>` : ''}
                </div>
              </div>
              <div class="timeline-place-actions">
                <a class="btn-curation-map" href="${escapeHtml(safeMapUrl)}" target="_blank" rel="noopener noreferrer" title="구글 지도에서 보기">지도 ↗</a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : '';

    return `
      <div class="timeline-step">
        <div class="timeline-node">${stepNo}</div>
        <div class="timeline-step-header">
          <span class="timeline-time-badge">${escapeHtml(step.time)}</span>
          <h4 class="timeline-step-title">${escapeHtml(step.title)}</h4>
          ${transit ? `<span class="timeline-transit-badge">🚗 ${escapeHtml(transit)}</span>` : ''}
        </div>
        <p class="timeline-step-desc">${escapeHtml(actionDesc)}</p>
        ${placesHtml}
      </div>
    `;
  }

  function renderCurationCard(course) {
    const keyClass = course.scenarioKey || course.category || 'checkout';
    const keyTips = course.keyTips || course.highlights || [];
    const timeline = course.timeline || [];

    const tipsHtml = keyTips.length > 0 ? `
      <div class="curation-tip-box">
        <div class="curation-tip-title">💡 핵심 실전 꿀팁 & 동선 가이드</div>
        <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px;">
          ${keyTips.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    return `
      <article class="curation-card" data-id="${escapeHtml(course.id)}">
        <div class="curation-header">
          <div class="curation-header-top">
            <span class="curation-badge ${escapeHtml(keyClass)}">${escapeHtml(course.iconEmoji || '🎯')} ${escapeHtml(course.badge)}</span>
            <span class="curation-badge" style="background: var(--color-bg-subtle); color: var(--color-text-secondary);">⏱️ ${escapeHtml(course.duration || course.durationEstimate)}</span>
          </div>
          <h3 class="curation-title">${escapeHtml(course.title)}</h3>
          <p class="curation-summary">${escapeHtml(course.summary)}</p>
        </div>

        <div class="curation-meta-grid">
          <div class="curation-meta-item">
            <span class="curation-meta-label">추천 대상:</span>
            <span class="curation-meta-value">${escapeHtml(course.targetAudience || '자유여행자')}</span>
          </div>
          <div class="curation-meta-item">
            <span class="curation-meta-label">예상 경비:</span>
            <span class="curation-meta-value">${escapeHtml(course.estimatedCostKrw || course.estimatedCostVnd || course.budgetEstimate)}</span>
          </div>
          <div class="curation-meta-item">
            <span class="curation-meta-label">추천 교통:</span>
            <span class="curation-meta-value">${escapeHtml(course.recommendedTransport || '그랩 및 도보')}</span>
          </div>
          <div class="curation-meta-item">
            <span class="curation-meta-label">소요 시간:</span>
            <span class="curation-meta-value">${escapeHtml(course.duration || course.durationEstimate)}</span>
          </div>
        </div>

        ${tipsHtml}

        <div class="curation-timeline">
          ${timeline.map(renderCurationTimelineStep).join('')}
        </div>
      </article>
    `;
  }

  function renderCuration() {
    const container = document.getElementById('curationCardsGridContainer');
    const countEl = document.getElementById('curationResultCountText');
    if (!container) return;

    const list = getFilteredCurations();
    if (countEl) {
      countEl.innerHTML = `총 <strong>${list.length}</strong>개의 맞춤 상황별 추천 코스`;
    }

    if (list.length === 0) {
      container.className = 'empty-state-wrap';
      container.innerHTML = `
        <div class="empty-state">
          <div class="icon">🎯</div>
          <h3>조건에 맞는 상황별 코스가 없습니다</h3>
          <p>검색어나 필터 조건을 변경해 보세요.</p>
          <button class="btn-reset-filters" id="curationResetFiltersBtn">필터 초기화</button>
        </div>
      `;
      const resetBtn = document.getElementById('curationResetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('reset-filters'));
        });
      }
      return;
    }

    container.className = 'curation-container';
    container.innerHTML = list.map(renderCurationCard).join('');
  }
  // --- 8.6 Domain Registry ---
  // 7개 도메인의 배선 차이를 한 테이블로 모은다. 탭을 추가할 때 손댈 곳을
  // 줄이는 것이 목적이며, 렌더/필터/모달 로직은 각 도메인 섹션에 그대로 있다.
  // activities만 접두어 규칙이 다르다(actCategory / wishlist / detailModal 등) —
  // 접두어로 유도하지 말고 이 표의 값을 그대로 쓸 것.
  const DOMAINS = [
    {
      key: 'activities',
      render: () => renderCards(),
      categoryNavId: 'activityCategoryNav', tagChipsId: 'activityTagChips',
      catAttr: 'category', tagAttr: 'tag',
      catField: 'actCategory', tagField: 'actTag',
      notesField: 'notes', notesKey: 'nha_trang_notes',
      wishField: 'wishlist', wishKey: 'nha_trang_wishlist',
      wishToastAdd: '♥ 위시리스트에 저장되었습니다!', wishToastRemove: '위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'modalHeartBtn',
      hasOpenHours: false, hasPriceSort: true, showViewToggle: true,
      activeModalField: 'activeModalActivity',
      modalId: 'detailModal', modalCloseBtnId: 'modalCloseBtn', closeModal: () => closeActivityModal(),
      noteInputIds: ['modalNoteInput', 'noteInput'], noteStatusIds: ['modalNoteStatus', 'noteStatus'],
      copyAddressBtnId: null,
      gridSectionId: 'activitiesGridSection',
      placeholder: '액티비티 검색 (예: 스노클링, 마사지, 인생샷, 아이리조트)...',
      heroTitle: '나트랑 힐링 여행 가이드 🌴',
      heroSubtitle: '호핑, 스파, 빈원더스, 선셋 크루즈 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">✨</span> 엄선된 32개 리얼 액티비티</span>
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
      wishField: 'gourmetWishlist', wishKey: 'nha_trang_gourmet_wishlist',
      wishToastAdd: '♥ 맛집 위시리스트에 저장되었습니다!', wishToastRemove: '맛집 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'gourmetModalHeartBtn',
      hasOpenHours: true, hasPriceSort: true, showViewToggle: true,
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
      wishField: 'stayWishlist', wishKey: 'nha_trang_stay_wishlist',
      wishToastAdd: '♥ 숙소 위시리스트에 저장되었습니다!', wishToastRemove: '숙소 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'stayModalHeartBtn',
      hasOpenHours: false, hasPriceSort: true, showViewToggle: true,
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
      key: 'hoteldining',
      render: () => renderHotelDinings(),
      categoryNavId: 'hoteldiningCategoryNav', tagChipsId: 'hoteldiningTagChips',
      catAttr: 'hdcategory', tagAttr: 'hdtag',
      catField: 'hoteldiningCategory', tagField: 'hoteldiningTag',
      notesField: 'hoteldiningNotes', notesKey: 'nha_trang_hoteldining_notes',
      wishField: 'hoteldiningWishlist', wishKey: 'nha_trang_hoteldining_wishlist',
      wishToastAdd: '♥ 호텔 다이닝 위시리스트에 저장되었습니다!', wishToastRemove: '호텔 다이닝 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'hoteldiningModalHeartBtn',
      hasOpenHours: true, hasPriceSort: true, showViewToggle: true,
      activeModalField: 'activeModalHoteldining',
      modalId: 'hoteldiningModal', modalCloseBtnId: 'hoteldiningModalCloseBtn', closeModal: () => closeHotelDiningModal(),
      noteInputIds: ['hoteldiningNoteInput'], noteStatusIds: ['hoteldiningNoteStatus'],
      copyAddressBtnId: 'hoteldiningCopyAddressBtn',
      gridSectionId: 'hoteldiningGridSection',
      placeholder: '호텔 다이닝, 뷔페, 메뉴 검색 (예: 쿡북카페, 피스트, 바카로, 씨푸드BBQ, 조식)...',
      heroTitle: '나트랑 5성급 호텔 시그니처 다이닝 🍽️',
      heroSubtitle: '인터내셔널 조식·디너 뷔페부터 오션뷰 씨푸드 BBQ, 파인다이닝 & 루프탑 바 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">🏨</span> 5성급 호텔 시그니처 24곳</span>
          <span class="hero-stat-pill"><span class="icon">🦞</span> 랍스터 & 해산물 무제한 BBQ</span>
          <span class="hero-stat-pill"><span class="icon">🌅</span> 나트랑 비치 파노라마 오션뷰</span>
          <span class="hero-stat-pill"><span class="icon">🍸</span> 45층 360도 스카이라운지 바</span>
        `
    },
    {
      key: 'spa',
      render: () => renderSpa(),
      categoryNavId: 'spaCategoryNav', tagChipsId: 'spaTagChips',
      catAttr: 'spacategory', tagAttr: 'spatag',
      catField: 'spaCategory', tagField: 'spaTag',
      notesField: 'spaNotes', notesKey: 'nha_trang_spa_notes',
      wishField: 'spaWishlist', wishKey: 'nha_trang_spa_wishlist',
      wishToastAdd: '❤️ 스파 위시리스트에 담겼습니다!', wishToastRemove: '🤍 스파 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'spaModalHeartBtn',
      hasOpenHours: true, hasPriceSort: true, showViewToggle: true,
      activeModalField: 'activeModalSpa',
      modalId: 'spaModal', modalCloseBtnId: 'spaModalCloseBtn', closeModal: () => closeSpaModal(),
      noteInputIds: ['spaNoteInput'], noteStatusIds: ['spaNoteStatus'],
      copyAddressBtnId: 'spaCopyAddressBtn',
      gridSectionId: 'spaGridSection',
      placeholder: '스파, 마사지, 이발관, 머드온천 검색 (예: 센스파, 픽업, 핫스톤, 아이리조트)...',
      heroTitle: '나트랑 힐링 스파 & 마사지 💆',
      heroSubtitle: '5성급 호텔 스파부터 가성비 로컬 마사지, 황제 이발관, 픽드랍·팁 완벽 정리',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">💆</span> 엄선된 24선 힐링 스파</span>
          <span class="hero-stat-pill"><span class="icon">🚗</span> 무료 픽업·샌딩 & 짐보관</span>
          <span class="hero-stat-pill"><span class="icon">💵</span> 코스별 60/90/120분 정찰 시세</span>
          <span class="hero-stat-pill"><span class="icon">♨️</span> 시그니처 머드 온천 & 바버샵</span>
        `
    },
    {
      key: 'shopping',
      render: () => renderShopping(),
      categoryNavId: 'shoppingCategoryNav', tagChipsId: 'shoppingTagChips',
      catAttr: 'shopcategory', tagAttr: 'shoptag',
      catField: 'shoppingCategory', tagField: 'shoppingTag',
      notesField: 'shoppingNotes', notesKey: 'nha_trang_shopping_notes',
      wishField: 'shoppingWishlist', wishKey: 'nha_trang_shopping_wishlist',
      wishToastAdd: '♥ 쇼핑 위시리스트에 저장되었습니다!', wishToastRemove: '쇼핑 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'shoppingModalHeartBtn',
      hasOpenHours: true, hasPriceSort: true, showViewToggle: true,
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
      wishField: 'currencyWishlist', wishKey: 'nha_trang_currency_wishlist',
      wishToastAdd: '❤️ 환전/ATM 위시리스트에 담겼습니다!', wishToastRemove: '🤍 환전/ATM 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'currencyModalHeartBtn',
      // 환전소/ATM에는 가격이 없어 가격 정렬을 그대로 두면 선택해도 순서가 안 바뀐다.
      hasOpenHours: true, hasPriceSort: false, showViewToggle: true,
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
    },
    {
      key: 'curation',
      render: () => renderCuration(),
      categoryNavId: 'curationCategoryNav', tagChipsId: 'curationTagChips',
      catAttr: 'curcategory', tagAttr: 'curtag',
      catField: 'curationCategory', tagField: 'curationTag',
      notesField: null, notesKey: null,
      wishField: null, wishKey: null,
      wishToastAdd: null, wishToastRemove: null,
      modalHeartBtnId: null,
      hasOpenHours: false, hasPriceSort: false, showViewToggle: false,
      activeModalField: null,
      modalId: null, modalCloseBtnId: null, closeModal: () => {},
      noteInputIds: [], noteStatusIds: [],
      copyAddressBtnId: null,
      gridSectionId: 'curationGridSection',
      placeholder: '상황별 코스, 장소, 키워드 검색 (예: 체크아웃, 머드온천, 세일링클럽, 선셋크루즈)...',
      heroTitle: '나트랑 맞춤 상황별 추천 코스 🎯',
      heroSubtitle: '마지막 날 체크아웃 투어부터 우천 실내, 심야 핫스팟, 커플 힐링 코스 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">✈️</span> 밤 11시 비행기 체크아웃 투어</span>
          <span class="hero-stat-pill"><span class="icon">🌧️</span> 우천 대비 100% 실내 힐링 코스</span>
          <span class="hero-stat-pill"><span class="icon">🌙</span> 밤 10시 이후 심야 핫스팟 02시</span>
          <span class="hero-stat-pill"><span class="icon">💑</span> 커플 & 로맨틱 파인다이닝 크루즈</span>
        `
    },
    {
      key: 'guide',
      render: () => renderGuide(),
      categoryNavId: 'guideCategoryNav', tagChipsId: 'guideTagChips',
      catAttr: 'guidecategory', tagAttr: 'guidetag',
      catField: 'guideCategory', tagField: 'guideTag',
      notesField: null, notesKey: null,
      // 허브 탭이라 찜·노트·리스트/그리드 개념이 없다.
      wishField: null, wishKey: null,
      wishToastAdd: null, wishToastRemove: null,
      modalHeartBtnId: null,
      hasOpenHours: false, hasPriceSort: true, showViewToggle: false,
      activeModalField: 'activeModalFlashcard',
      modalId: 'flashcardModal', modalCloseBtnId: 'flashcardModalCloseBtn', closeModal: () => closeFlashcardModal(),
      noteInputIds: [], noteStatusIds: [],
      copyAddressBtnId: null,
      gridSectionId: 'guideGridSection',
      placeholder: '가이드 검색 (예: 공항, 그랩, 롯데마트, 스멕타, 고수 빼주세요)...',
      heroTitle: '나트랑 여행 꿀팁 & 생존 킷 💡',
      heroSubtitle: '교통·그랩 가이드, 롯데마트 30대 시세표, 응급 상비약/병원, 원터치 베트남어',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">🚗</span> 깜란공항 & 그랩 완벽 가이드</span>
          <span class="hero-stat-pill"><span class="icon">🛒</span> 롯데마트 30대 기념품 시세표</span>
          <span class="hero-stat-pill"><span class="icon">💊</span> 응급 상비약 10종 & 24시 병원</span>
          <span class="hero-stat-pill"><span class="icon">🗣️</span> 원터치 생존 베트남어 21종</span>
        `
    }
  ];

  function getDomain(key) {
    return DOMAINS.find(d => d.key === key) || DOMAINS[0];
  }

  function renderCurrentTab() {
    getDomain(state.currentTab).render();
  }


  // --- 8.7 Lazy Data Loading ---
  // 데이터 7종 중 data.js(액티비티 + DEFAULT_EXCHANGE_RATE)만 index.html에서
  // 정적으로 로드하고, 나머지 6종은 해당 탭 최초 진입 시 <script> 태그를 동적
  // 삽입해 불러온다. fetch가 아니라 클래식 스크립트라 file://에서도 동작하고,
  // 로드 완료 후에는 전역 const가 생겨 기존 코드가 그대로 동작한다.
  // 초기 전송량이 데이터 전체(gzip 기준 약 232KB)에서 약 90KB로 줄어든다.
  const LAZY_DATA = {
    gourmet: { src: './gourmet-data.js', containerId: 'gourmetCardsGridContainer', ready: () => typeof NHA_TRANG_GOURMETS !== 'undefined' },
    stays: { src: './stays-data.js', containerId: 'staysCardsGridContainer', ready: () => typeof NHA_TRANG_STAYS !== 'undefined' },
    hoteldining: { src: './hotel-dining-data.js', containerId: 'hoteldiningCardsGridContainer', ready: () => typeof NHA_TRANG_HOTEL_DININGS !== 'undefined' },
    spa: { src: './spa-data.js', containerId: 'spaCardsGridContainer', ready: () => typeof NHA_TRANG_SPAS !== 'undefined' },
    shopping: { src: './shopping-data.js', containerId: 'shoppingCardsGridContainer', ready: () => typeof NHA_TRANG_SHOPPING !== 'undefined' },
    currency: { src: './currency-data.js', containerId: 'currencyCardsGridContainer', ready: () => typeof NHA_TRANG_CURRENCY !== 'undefined' },
    curation: { src: './curation-data.js', containerId: 'curationCardsGridContainer', ready: () => typeof NHA_TRANG_CURATIONS !== 'undefined' },
    guide: { src: './guide-data.js', containerId: 'guideCardsGridContainer', ready: () => typeof NHA_TRANG_GUIDE_HUB !== 'undefined' }
  };

  const lazyDataPromises = {};

  function ensureDomainData(tab) {
    const lazy = LAZY_DATA[tab];
    if (!lazy || lazy.ready()) return Promise.resolve();
    if (!lazyDataPromises[tab]) {
      lazyDataPromises[tab] = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = lazy.src;
        script.onload = resolve;
        script.onerror = () => {
          // 실패한 태그와 캐시를 걷어내야 "다시 불러오기"가 실제로 재시도된다
          script.remove();
          delete lazyDataPromises[tab];
          reject(new Error('데이터 로드 실패: ' + lazy.src));
        };
        document.head.appendChild(script);
      });
    }
    return lazyDataPromises[tab];
  }

  function showDataLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.className = 'empty-state-wrap';
    container.innerHTML = `
        <div class="empty-state data-loading-state">
          <div class="icon">🌊</div>
          <p>데이터를 불러오는 중…</p>
        </div>
      `;
  }

  function showDataLoadError(tab, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.className = 'empty-state-wrap';
    container.innerHTML = `
        <div class="empty-state">
          <div class="icon">⚠️</div>
          <h3>데이터를 불러오지 못했습니다</h3>
          <p>네트워크 상태를 확인한 뒤 다시 시도해 주세요.</p>
          <button class="btn-reset-filters" id="dataRetryBtn">다시 불러오기</button>
        </div>
      `;
    const retryBtn = document.getElementById('dataRetryBtn');
    if (retryBtn) retryBtn.addEventListener('click', () => switchMainTab(tab));
  }

  // --- 9. Tab Switching & UI Controller ---
  function updateTabNavButtons(tab) {
    document.querySelectorAll('.nav-tab-btn, .mobile-tab-btn').forEach(btn => {
      const isActive = btn.dataset.tab === tab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });
  }

  function updateDomainVisibility(tab) {
    DOMAINS.forEach(d => {
      const isMatch = d.key === tab;
      const nav = document.getElementById(d.categoryNavId);
      if (nav) nav.style.display = isMatch ? 'block' : 'none';

      const chips = document.getElementById(d.tagChipsId);
      if (chips) chips.style.display = isMatch ? 'flex' : 'none';

      const section = document.getElementById(d.gridSectionId);
      if (section) section.style.display = isMatch ? 'block' : 'none';
    });
  }

  function updateSearchClearBtn() {
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    if (searchClearBtn && searchInput) {
      searchClearBtn.style.display = searchInput.value ? 'block' : 'none';
    }
  }

  function updateHeroAndToolbarUI(domain) {
    const toolbarSection = document.querySelector('.toolbar-section');
    if (toolbarSection) toolbarSection.style.display = 'block';

    // 리스트/그리드 전환은 리스트를 쓰는 여섯 탭 전부에서 필요하다.
    const viewToggleButtons = document.getElementById('viewToggleButtons');
    if (viewToggleButtons) viewToggleButtons.style.display = domain.showViewToggle ? 'flex' : 'none';

    // 환전소/ATM에는 '가격'이 없어 avgPriceVnd가 전부 0이다. 가격 정렬 옵션을 숨긴다.
    const hidePriceSort = !domain.hasPriceSort;
    const sortSelectEl = document.getElementById('sortSelect');
    if (sortSelectEl) {
      sortSelectEl.querySelectorAll('option[value="price-asc"], option[value="price-desc"]').forEach(opt => {
        opt.hidden = hidePriceSort;
        opt.disabled = hidePriceSort;
      });
      if (hidePriceSort && (state.sortBy === 'price-asc' || state.sortBy === 'price-desc')) {
        state.sortBy = 'recommended';
        sortSelectEl.value = 'recommended';
      }
    }

    const searchInput = document.getElementById('searchInput');
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitleDesc = document.getElementById('heroSubtitleDesc');
    const heroTagsArea = document.getElementById('heroTagsArea');

    if (searchInput) {
      searchInput.placeholder = domain.placeholder;
      searchInput.setAttribute('aria-label', domain.heroTitle + ' 검색');
    }
    updateSearchClearBtn();
    if (heroTitle) heroTitle.textContent = domain.heroTitle;
    if (heroSubtitleDesc) heroSubtitleDesc.textContent = domain.heroSubtitle;
    if (heroTagsArea) heroTagsArea.innerHTML = domain.heroPills;

    // 영업시간 데이터가 있는 도메인에서만 "지금 영업중" 칩을 노출한다
    const openNowChip = document.getElementById('openNowChip');
    const hasHours = !!domain.hasOpenHours;
    if (openNowChip) {
      openNowChip.style.display = hasHours ? 'inline-flex' : 'none';
      if (!hasHours) {
        state.openNowOnly = false;
        openNowChip.classList.remove('active');
      }
    }

    const densityToggle = document.getElementById('densityToggleButtons');
    const showDensity = domain.showViewToggle && state.currentView === 'list';
    if (densityToggle) densityToggle.style.display = showDensity ? 'flex' : 'none';
  }

  function handleTabLazyLoadingAndRender(tab, domain) {
    // 지연 로딩 대상 탭은 데이터가 준비된 뒤에 렌더한다. 로드 중 다른 탭으로
    // 이동했으면(레이스) 렌더하지 않는다 — 그 탭의 switchMainTab이 알아서 한다.
    const lazy = LAZY_DATA[tab];
    if (!lazy || lazy.ready()) {
      domain.render();
      return;
    }
    showDataLoading(lazy.containerId);
    ensureDomainData(tab).then(() => {
      if (state.currentTab === tab) domain.render();
    }).catch(() => {
      if (state.currentTab === tab) showDataLoadError(tab, lazy.containerId);
    });
  }

  function switchMainTab(tab) {
    state.currentTab = tab;
    updateTabNavButtons(tab);
    const domain = getDomain(tab);
    updateDomainVisibility(tab);
    updateHeroAndToolbarUI(domain);
    handleTabLazyLoadingAndRender(tab, domain);
  }

  /** 뷰 모드는 다섯 탭 전체에 적용되고 다음 방문까지 유지된다. */
  function setViewMode(mode) {
    if (mode !== 'list' && mode !== 'grid') return;
    state.currentView = mode;
    saveToStorage('nha_trang_view', mode);

    const listBtn = document.getElementById('viewListBtn');
    const gridBtn = document.getElementById('viewGridBtn');
    if (listBtn) {
      listBtn.classList.toggle('active', mode === 'list');
      listBtn.setAttribute('aria-pressed', String(mode === 'list'));
    }
    if (gridBtn) {
      gridBtn.classList.toggle('active', mode === 'grid');
      gridBtn.setAttribute('aria-pressed', String(mode === 'grid'));
    }

    const densityToggle = document.getElementById('densityToggleButtons');
    const showDensity = getDomain(state.currentTab).showViewToggle && mode === 'list';
    if (densityToggle) densityToggle.style.display = showDensity ? 'flex' : 'none';

    renderCurrentTab();
  }

  function setDensity(mode) {
    if (mode !== 'tight' && mode !== 'comfy') return;
    state.density = mode;
    saveToStorage('nha_trang_density', mode);

    const tightBtn = document.getElementById('densityTightBtn');
    const comfyBtn = document.getElementById('densityComfyBtn');
    if (tightBtn) {
      tightBtn.classList.toggle('active', mode === 'tight');
      tightBtn.setAttribute('aria-pressed', String(mode === 'tight'));
    }
    if (comfyBtn) {
      comfyBtn.classList.toggle('active', mode === 'comfy');
      comfyBtn.setAttribute('aria-pressed', String(mode === 'comfy'));
    }

    renderCurrentTab();
  }

  function resetFilters() {
    resetStateFilters();

    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    if (searchInput) searchInput.value = '';
    updateSearchClearBtn();
    if (sortSelect) sortSelect.value = 'recommended';

    DOMAINS.forEach(d => {
      document.querySelectorAll(`#${d.categoryNavId} .category-item-btn`).forEach(b => {
        const isActive = b.dataset[d.catAttr] === 'all';
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      document.querySelectorAll(`#${d.tagChipsId} .tag-chip-btn`).forEach(b => {
        const isActive = b.dataset[d.tagAttr] === 'all';
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
    });

    updateWishlistBadge();

    renderCurrentTab();
    showToast('필터가 모두 초기화되었습니다.');
  }

  // Helper modal functions
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

  function initNavEvents() {
    // Nav Tabs — 상단 탭과 모바일 하단 탭바가 같은 핸들러를 쓴다
    document.querySelectorAll('.nav-tab-btn, .mobile-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchMainTab(btn.dataset.tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
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
  }

  function initFilterEvents() {
    // Category & Tag Buttons
    DOMAINS.forEach(d => {
      document.querySelectorAll(`#${d.categoryNavId} .category-item-btn`).forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll(`#${d.categoryNavId} .category-item-btn`).forEach(b => {
            const isActive = b === btn;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-pressed', String(isActive));
          });
          state[d.catField] = btn.dataset[d.catAttr];
          d.render();
        });
      });

      document.querySelectorAll(`#${d.tagChipsId} .tag-chip-btn`).forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll(`#${d.tagChipsId} .tag-chip-btn`).forEach(b => {
            const isActive = b === btn;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-pressed', String(isActive));
          });
          state[d.tagField] = btn.dataset[d.tagAttr];
          d.render();
        });
      });
    });

    // Search Input & Clear Button
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    if (searchInput) {
      let searchDebounce;
      searchInput.addEventListener('input', (e) => {
        updateSearchClearBtn();
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          state.searchQuery = e.target.value.trim();
          renderCurrentTab();
        }, 200);
      });
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchInput.value) {
          e.stopPropagation();
          searchInput.value = '';
          updateSearchClearBtn();
          state.searchQuery = '';
          renderCurrentTab();
          searchInput.blur();
        }
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        updateSearchClearBtn();
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
    const viewListBtn = document.getElementById('viewListBtn');
    if (viewGridBtn) viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    if (viewListBtn) viewListBtn.addEventListener('click', () => setViewMode('list'));
    document.getElementById('densityTightBtn')?.addEventListener('click', () => setDensity('tight'));
    document.getElementById('densityComfyBtn')?.addEventListener('click', () => setDensity('comfy'));

    // 지금 영업중 필터
    document.getElementById('openNowChip')?.addEventListener('click', (e) => {
      state.openNowOnly = !state.openNowOnly;
      e.currentTarget.classList.toggle('active', state.openNowOnly);
      e.currentTarget.setAttribute('aria-pressed', String(state.openNowOnly));
      renderCurrentTab();
    });

    // Global reset-filters event listener
    window.addEventListener('reset-filters', resetFilters);
  }

  function initDomainModalEvents() {
    DOMAINS.forEach(d => {
      const modalEl = document.getElementById(d.modalId);
      document.getElementById(d.modalCloseBtnId)?.addEventListener('click', d.closeModal);
      modalEl?.addEventListener('click', (e) => {
        if (e.target === modalEl) d.closeModal();
      });

      if (d.copyAddressBtnId) {
        document.getElementById(d.copyAddressBtnId)?.addEventListener('click', (e) => {
          if (state[d.activeModalField]) copyAddress(state[d.activeModalField].addressVi, e.currentTarget);
        });
      }
    });

    // Notes Auto-save Handlers
    const noteInputMap = new Map();
    DOMAINS.forEach(d => {
      (d.noteInputIds || []).forEach(id => noteInputMap.set(id, d));
    });

    document.addEventListener('input', (e) => {
      if (!e.target || !e.target.id) return;
      const d = noteInputMap.get(e.target.id);
      if (!d) return;
      if (!state[d.activeModalField]) return;
      const val = typeof e.target.value === 'string' ? e.target.value.slice(0, 5000) : '';
      if (!state[d.notesField]) state[d.notesField] = Object.create(null);
      state[d.notesField][state[d.activeModalField].id] = val;
      const saved = saveToStorage(d.notesKey, state[d.notesField]);
      let s = null;
      for (const statusId of d.noteStatusIds) {
        s = document.getElementById(statusId);
        if (s) break;
      }
      if (s) {
        if (saved === false && hasStorage()) {
          s.textContent = '⚠️ 저장 공간 부족';
        } else {
          s.textContent = '✓ 저장 완료';
        }
      }
      d.render();
    });
  }

  function initCalcModalEvents() {
    const calcModal = document.getElementById('calcModal');

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
  }

  function initGuideModalEvents() {
    const guideModal = document.getElementById('guideModal');

    document.getElementById('openGuideBtn')?.addEventListener('click', () => openModal(guideModal));
    document.getElementById('guideCloseBtn')?.addEventListener('click', () => closeModal(guideModal));
    guideModal?.addEventListener('click', (e) => {
      if (e.target === guideModal) closeModal(guideModal);
    });

    // POS Simulator Choice Handlers
    document.querySelectorAll('.btn-pos-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.posChoice === 'vnd') {
          alert('🎉 정답입니다! 현지 통화(VND) 결제로 추가 수수료 0원을 방어했습니다.');
        } else if (btn.dataset.posChoice === 'krw') {
          alert('⚠️ 주의! KRW 결제 시 3~8% 이중 환전 수수료가 발생합니다. 반드시 VND를 선택하세요!');
        }
      });
    });
  }

  function initGlobalKeyboardEvents() {
    const calcModal = document.getElementById('calcModal');
    const guideModal = document.getElementById('guideModal');

    // ESC Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        DOMAINS.forEach(d => d.closeModal());
        closeModal(calcModal);
        closeModal(guideModal);
      }
    });
  }

  // --- 10. Event Listeners Initialization ---
  function initEvents() {
    initNavEvents();
    initFilterEvents();
    initDomainModalEvents();
    initCalcModalEvents();
    initGuideModalEvents();
    initGlobalKeyboardEvents();

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
    updateHeroAndToolbarUI(getDomain(state.currentTab));
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
      sanitizeUrl,
      sanitizeImageUrl,
      formatVND,
      formatKRW,
      formatVerbalVND,
      formatVerbalKRW,
      applyModalFields,
      getFilteredActivities,
      activitiesSearchMatch,
      getFilteredGourmets,
      getFilteredStays,
      getFilteredHotelDinings,
      getFilteredSpas,
      getFilteredShopping,
      getFilteredCurrency,
      getFilteredCurations,
      getFilteredCuration,
      // Renderers — exported for the snapshot harness (test-render-snapshot.js).
      // They resolve `document` at call time, so the harness can install a stub
      // AFTER requiring this file, which keeps the bootstrap above from running.
      renderCards,
      renderGourmets,
      renderStays,
      renderHotelDinings,
      renderSpa,
      renderShopping,
      renderCurrency,
      renderCurrencyCardsList,
      renderCuration,
      // Modal openers — Phase 4 refactor target, snapshotted the same way.
      openActivityModal,
      openGourmetModal,
      openStayModal,
      openHotelDiningModal,
      closeHotelDiningModal,
      openSpaModal,
      closeSpaModal,
      openShoppingModal,
      openCurrencyModal,
      renderGuide,
      openFlashcardModal,
      closeFlashcardModal,
      getFilteredFlashcards,
      getFilteredSouvenirs,
      getFilteredPharmacyMeds,
      // Clipboard & UI helpers
      copyAddress,
      copyTextToClipboard,
      fallbackCopy,
      // Storage & View helpers
      sanitizeStorageData,
      loadFromStorage,
      saveToStorage,
      setViewMode,
      setDensity,
      toggleDomainWishlist
    };
  }
})();
