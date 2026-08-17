import { state, updateWishlistBadge, resetStateFilters } from './store/state.js';
import { renderCards, renderTimeline, closeActivityModal } from './components/activity.js';
import { renderGourmets, closeGourmetModal } from './components/gourmet.js';
import { renderStays, closeStayModal } from './components/stay.js';
import { renderShopping, closeShoppingModal } from './components/shopping.js';
import { copyAddress, showToast, escapeHtml } from './utils/helpers.js';
import { saveToStorage } from './utils/storage.js';

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

  // Toggle Category Bars
  const activityCategoryNav = document.getElementById('activityCategoryNav');
  const gourmetCategoryNav = document.getElementById('gourmetCategoryNav');
  const stayCategoryNav = document.getElementById('stayCategoryNav');
  const shoppingCategoryNav = document.getElementById('shoppingCategoryNav');
  
  if (activityCategoryNav) activityCategoryNav.style.display = isActivities ? 'block' : 'none';
  if (gourmetCategoryNav) gourmetCategoryNav.style.display = isGourmet ? 'block' : 'none';
  if (stayCategoryNav) stayCategoryNav.style.display = isStays ? 'block' : 'none';
  if (shoppingCategoryNav) shoppingCategoryNav.style.display = isShopping ? 'block' : 'none';

  // Toggle Tag Chips
  const activityTagChips = document.getElementById('activityTagChips');
  const gourmetTagChips = document.getElementById('gourmetTagChips');
  const stayTagChips = document.getElementById('stayTagChips');
  const shoppingTagChips = document.getElementById('shoppingTagChips');
  
  if (activityTagChips) activityTagChips.style.display = isActivities ? 'flex' : 'none';
  if (gourmetTagChips) gourmetTagChips.style.display = isGourmet ? 'flex' : 'none';
  if (stayTagChips) stayTagChips.style.display = isStays ? 'flex' : 'none';
  if (shoppingTagChips) shoppingTagChips.style.display = isShopping ? 'flex' : 'none';
  
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

  if (isActivities) {
    if (searchInput) searchInput.placeholder = '액티비티 검색 (예: 스노클링, 마사지, 인생샷, 아이리조트)...';
    if (heroTitle) heroTitle.textContent = '나트랑 부부 힐링 여행 🌴';
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
    renderGourmets();
    
  } else if (isStays) {
    if (searchInput) searchInput.placeholder = '숙소명, 지역, 편의시설 검색 (예: 인터컨티넨탈, 풀빌라, 인피니티풀, 야시장)...';
    if (heroTitle) heroTitle.textContent = '나트랑 테마별 추천 숙소 & 리조트 🏨';
    if (heroSubtitleDesc) heroSubtitleDesc.textContent = '9/19 웰컴 0.5박부터 5성급 럭셔리, 감성 풀빌라, 출국 전 0.5박 큐레이션';
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
    renderShopping();
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

  document.querySelectorAll('#activityTagChips .tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.tag === 'all'));
  document.querySelectorAll('#gourmetTagChips .tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.gtag === 'all'));
  document.querySelectorAll('#stayTagChips .tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.stag === 'all'));
  document.querySelectorAll('#shoppingTagChips .tag-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.shoptag === 'all'));

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
  }
  showToast('필터가 모두 초기화되었습니다.');
}

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

  // Generic Open/Close Modal
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

  // Notes Auto-save Handlers (Delegated)
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

  // Calculator
  document.getElementById('openCalcBtn')?.addEventListener('click', () => openModal(calcModal));
  document.getElementById('calcCloseBtn')?.addEventListener('click', () => closeModal(calcModal));
  calcModal?.addEventListener('click', (e) => {
    if (e.target === calcModal) closeModal(calcModal);
  });

  const rate = typeof DEFAULT_EXCHANGE_RATE !== 'undefined' ? DEFAULT_EXCHANGE_RATE : 0.054;
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

  // Guide
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
      closeModal(calcModal);
      closeModal(guideModal);
    }
  });
}

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
