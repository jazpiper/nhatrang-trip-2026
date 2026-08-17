import { state, updateWishlistBadge } from '../store/state.js';
import { saveToStorage } from '../utils/storage.js';
import { formatVND, formatKRW, escapeHtml, showToast } from '../utils/helpers.js';

export function getFilteredGourmets() {
  if (typeof NHA_TRANG_GOURMETS === 'undefined') return [];
  return NHA_TRANG_GOURMETS.filter(item => {
    if (state.wishlistOnly && !state.gourmetWishlist.includes(item.id)) return false;
    
    // Category Filter with Multi-category Support
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

    // Tag Filter with English to Korean Keyword Mapping
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
      const matchName = item.name.toLowerCase().includes(q);
      const matchNameVi = (item.nameVi || '').toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchHighlight = item.highlight.toLowerCase().includes(q);
      const matchBadge = (item.badge || '').toLowerCase().includes(q);
      const matchCatLabel = (item.categoryLabel || '').toLowerCase().includes(q);
      const matchTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
      const matchMenu = item.signatureMenu.some(m => {
        const mStr = typeof m === 'string' ? m : (m.name + ' ' + m.desc);
        return mStr.toLowerCase().includes(q);
      });
      if (!matchName && !matchNameVi && !matchDesc && !matchLoc && !matchHighlight && !matchBadge && !matchCatLabel && !matchTags && !matchMenu) return false;
    }
    return true;
  }).sort((a, b) => {
    if (state.sortBy === 'rating') return (b.rating * 10000 + b.reviewCount) - (a.rating * 10000 + a.reviewCount);
    if (state.sortBy === 'price-asc') return a.avgPriceVnd - b.avgPriceVnd;
    if (state.sortBy === 'price-desc') return b.avgPriceVnd - a.avgPriceVnd;
    return 0;
  });
}

export function renderGourmets() {
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
        <p>필터 조건을 초기화하거나 다른 검색어로 찾아보세요.</p>
        <button class="btn-reset-filters" id="btnResetGourmetFilters">필터 전체 초기화</button>
      </div>
    `;
    const resetBtn = document.getElementById('btnResetGourmetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const evt = new CustomEvent('reset-filters');
        window.dispatchEvent(evt);
      });
    }
    return;
  }

  gourmetCardsGrid.innerHTML = list.map(item => {
    const isWish = state.gourmetWishlist.includes(item.id);
    const userNote = state.gourmetNotes[item.id];
    const menuPreview = item.signatureMenu.slice(0, 2).map(m => {
      const title = typeof m === 'string' ? m.split('(')[0].trim() : m.name.split('(')[0].trim();
      return `<span class="mini-tag">🍽️ ${title}</span>`;
    }).join('');

    return `
      <div class="activity-card gourmet-card" data-gid="${item.id}" style="background: white; border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: 18px; box-shadow: var(--shadow-sm); transition: transform 0.2s ease, box-shadow 0.2s ease;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 2.2rem; line-height: 1; background: var(--color-bg-subtle); padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">${item.iconEmoji || '🍜'}</span>
            <div>
              <span class="card-badge-top-left" style="position: static; display: inline-block; background: #008489; color: white; margin-bottom: 4px;">${item.badge}</span>
              <div style="font-size: 0.78rem; font-weight: 700; color: #008489;">📍 Google Maps ${item.rating} ★ (${item.reviewCount.toLocaleString()}개 리뷰)</div>
            </div>
          </div>
          <button class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-gid="${item.id}" title="맛집 찜하기" aria-label="맛집 찜하기" style="position: static;">
            ${isWish ? '♥' : '♡'}
          </button>
        </div>
        
        <div class="card-body">
          <div class="card-header-line">
            <span class="card-title" style="font-size: 1.05rem; font-weight: 800;">${item.name}</span>
          </div>
          
          <div class="card-meta-line" style="color: var(--color-ocean); font-weight: 700; margin-top: 2px;">
            <span>🇻🇳 ${item.nameVi}</span>
          </div>

          <div class="card-meta-line" style="margin-top: 4px;">
            <span>🕒 ${item.openHours}</span>
          </div>

          <div class="card-meta-line" style="color: var(--color-text-secondary);">
            <span>📍 ${item.location}</span>
          </div>
          
          <div class="card-tag-pill-list" style="margin: 8px 0;">
            ${menuPreview}
          </div>
          
          <div class="card-price-line" style="border-top: 1px dashed var(--color-border-light); padding-top: 8px; margin-top: 6px;">
            <span class="price-main">${item.priceRangeVnd}</span>
            <span class="price-krw">(${formatKRW(item.avgPriceVnd)})</span>
          </div>

          <div style="margin-top: 12px;">
            <a href="${item.googlePhotosUrl || item.googleMapUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary-link" style="width: 100%; height: 34px; font-size: 0.78rem; font-weight: 700; justify-content: center; background: #F8FAFC; border-color: #CBD5E1; color: #1E293B;" onclick="event.stopPropagation();">
              📸 구글 실시간 사진·리뷰 ↗
            </a>
          </div>

          ${userNote ? `
            <div class="card-note-badge" style="background: #E6F7F8; border-color: #B2EBF2; color: #00695C; margin-top: 8px;">
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
      const gid = card.dataset.gid;
      const gourmet = NHA_TRANG_GOURMETS.find(g => g.id === gid);
      if (gourmet) openGourmetModal(gourmet);
    });
  });

  gourmetCardsGrid.querySelectorAll('.card-heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleGourmetWishlist(btn.dataset.gid);
      renderGourmets();
    });
  });
}

function openGourmetModal(g) {
  state.activeModalGourmet = g;
  const gourmetModal = document.getElementById('gourmetModal');

  const setContent = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  };

  const gourmetModalPhotosBtn = document.getElementById('gourmetModalPhotosBtn');
  if (gourmetModalPhotosBtn) gourmetModalPhotosBtn.href = g.googlePhotosUrl || g.googleMapUrl;

  setContent('gourmetModalBadge', g.badge);
  setContent('gourmetModalCategory', g.categoryLabel);
  setContent('gourmetModalTitle', g.name);
  setContent('gourmetModalNameVi', `🇻🇳 ${g.nameVi}`);
  setContent('gourmetModalRating', `★ ${g.rating} (구글 리뷰 ${g.reviewCount.toLocaleString()}개)`);
  setContent('gourmetModalHours', g.openHours);
  setContent('gourmetModalPriceRange', g.priceRangeVnd);
  setContent('gourmetModalMeal', g.suggestedMeal);
  setContent('gourmetModalAddress', g.addressVi);
  setContent('gourmetModalHighlight', g.highlight);
  setContent('gourmetModalDesc', g.description);

  const gourmetModalMenuList = document.getElementById('gourmetModalMenuList');
  if (gourmetModalMenuList) {
    gourmetModalMenuList.innerHTML = g.signatureMenu.map(m => {
      if (typeof m === 'string') {
        return `<li><span class="bullet">⭐</span> <span>${m}</span></li>`;
      }
      return `<li><span class="bullet">⭐</span> <span><strong>${m.name}</strong> (${formatVND(m.priceVnd)})<br><span style="color: var(--color-text-secondary); font-size: 0.82rem;">${m.desc}</span></span></li>`;
    }).join('');
  }
  
  setContent('gourmetModalTip', g.localTip);

  const gourmetNoteInput = document.getElementById('gourmetNoteInput');
  const gourmetNoteStatus = document.getElementById('gourmetNoteStatus');
  if (gourmetNoteInput) gourmetNoteInput.value = state.gourmetNotes[g.id] || '';
  if (gourmetNoteStatus) gourmetNoteStatus.textContent = '';

  setContent('gourmetModalAvgPrice', formatVND(g.avgPriceVnd));
  setContent('gourmetModalAvgKrw', `(${formatKRW(g.avgPriceVnd)})`);
  setContent('gourmetModalPricePer', `/ ${g.pricePer}`);

  const gourmetModalMapBtn = document.getElementById('gourmetModalMapBtn');
  if (gourmetModalMapBtn) gourmetModalMapBtn.href = g.googleMapUrl;
  
  const gourmetModalOfficialBtn = document.getElementById('gourmetModalOfficialBtn');
  if (gourmetModalOfficialBtn) {
    if (g.officialUrl) {
      gourmetModalOfficialBtn.href = g.officialUrl;
      gourmetModalOfficialBtn.style.display = 'inline-flex';
    } else {
      gourmetModalOfficialBtn.style.display = 'none';
    }
  }

  updateGourmetModalHeartState();
  if (gourmetModal) {
    gourmetModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function updateGourmetModalHeartState() {
  if (!state.activeModalGourmet) return;
  const isWish = state.gourmetWishlist.includes(state.activeModalGourmet.id);
  const gourmetModalHeartBtn = document.getElementById('gourmetModalHeartBtn');
  if (gourmetModalHeartBtn) {
    gourmetModalHeartBtn.innerHTML = isWish ? '♥ 찜 완료' : '♡ 찜하기';
    gourmetModalHeartBtn.classList.toggle('is-wishlisted', isWish);
  }
}

export function closeGourmetModal() {
  const gourmetModal = document.getElementById('gourmetModal');
  if (gourmetModal) {
    gourmetModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  state.activeModalGourmet = null;
}

export function toggleGourmetWishlist(id) {
  const idx = state.gourmetWishlist.indexOf(id);
  if (idx > -1) {
    state.gourmetWishlist.splice(idx, 1);
    showToast('맛집 찜 목록에서 제거되었습니다.');
  } else {
    state.gourmetWishlist.push(id);
    showToast('♥ 맛집 찜 목록에 추가되었습니다!');
  }
  saveToStorage('nha_trang_gourmet_wishlist', state.gourmetWishlist);
  updateWishlistBadge();
  updateGourmetModalHeartState();
}
