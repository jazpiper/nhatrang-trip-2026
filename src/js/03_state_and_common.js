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
