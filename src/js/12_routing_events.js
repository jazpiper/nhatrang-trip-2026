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
      const nav = document.getElementById(d.categoryNavId);
      if (nav) nav.style.display = d.key === tab ? 'block' : 'none';

      const chips = document.getElementById(d.tagChipsId);
      if (chips) chips.style.display = d.key === tab ? 'flex' : 'none';

      const section = document.getElementById(d.gridSectionId);
      if (section) section.style.display = d.key === tab ? 'block' : 'none';
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
      const nav = document.getElementById(d.categoryNavId);
      if (nav) {
        nav.querySelectorAll('.category-item-btn').forEach(b => b.classList.toggle('active', b.dataset[d.catAttr] === 'all'));
      }
      const chips = document.getElementById(d.tagChipsId);
      if (chips) {
        chips.querySelectorAll('.tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset[d.tagAttr] === 'all'));
      }
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
    });

    // Notes Auto-save Handlers
    document.addEventListener('input', (e) => {
      DOMAINS.forEach(d => {
        const matchesInput = d.noteInputIds.some(id => e.target.matches(`#${id}`));
        if (!matchesInput) return;
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
    });

    // Copy Address Handlers
    DOMAINS.forEach(d => {
      if (!d.copyAddressBtnId) return;
      document.getElementById(d.copyAddressBtnId)?.addEventListener('click', (e) => {
        if (state[d.activeModalField]) copyAddress(state[d.activeModalField].addressVi, e.currentTarget);
      });
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
