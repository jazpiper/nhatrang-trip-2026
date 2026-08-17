import { state, updateWishlistBadge } from '../store/state.js';
import { saveToStorage } from '../utils/storage.js';
import { formatVND, formatKRW, escapeHtml, showToast } from '../utils/helpers.js';

export function getFilteredShopping() {
  if (typeof NHA_TRANG_SHOPPING === 'undefined') return [];

  return NHA_TRANG_SHOPPING.filter(item => {
    // 1. Wishlist Only Filter
    if (state.wishlistOnly && !state.shoppingWishlist.includes(item.id)) return false;

    // 2. Category Filter
    if (state.shoppingCategory !== 'all') {
      if (item.category !== state.shoppingCategory) return false;
    }

    // 3. Tag Filter
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
        if (allText.includes('가성비') || item.avgPriceVnd <= 250000 || item.category === 'dam_market') match = true;
      } else if ((item.tags || []).includes(t)) {
        match = true;
      }

      if (!match) return false;
    }

    // 4. Multi-Field Search Filter
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
      const inTags = (item.tags || []).some(tag => tag.toLowerCase().includes(q));
      const inFacilities = (item.facilities || []).some(fac => fac.toLowerCase().includes(q));
      const inSignature = (item.signatureItems || []).some(sig => sig.toLowerCase().includes(q));
      const inBargain = (item.bargainingGuide || []).some(bg => (bg.item || '').toLowerCase().includes(q) || (bg.tip || '').toLowerCase().includes(q));
      const inSentiment = item.sentimentAnalysis ? (
        (item.sentimentAnalysis.communityVerdict || '').toLowerCase().includes(q) ||
        (item.sentimentAnalysis.pros || []).some(p => p.toLowerCase().includes(q)) ||
        (item.sentimentAnalysis.cons || []).some(c => c.toLowerCase().includes(q)) ||
        (item.sentimentAnalysis.scamWarning || '').toLowerCase().includes(q)
      ) : false;

      if (!inName && !inNameKo && !inNameVi && !inNameEn && !inCategory && !inLocation && !inAddress && !inQuality && !inHighlight && !inDesc && !inTip && !inTags && !inFacilities && !inSignature && !inBargain && !inSentiment) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (state.sortBy === 'rating') return (b.rating * 10000 + b.reviewCount) - (a.rating * 10000 + a.reviewCount);
    if (state.sortBy === 'price-asc') return a.avgPriceVnd - b.avgPriceVnd;
    if (state.sortBy === 'price-desc') return b.avgPriceVnd - a.avgPriceVnd;
    return 0;
  });
}

export function renderShopping() {
  const gridContainer = document.getElementById('shoppingCardsGridContainer');
  const countText = document.getElementById('shoppingResultCountText');
  if (!gridContainer) return;

  const list = getFilteredShopping();
  if (countText) {
    countText.innerHTML = `총 <strong>${list.length}</strong>개의 검증 쇼핑 스팟`;
  }

  if (list.length === 0) {
    gridContainer.innerHTML = `
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
        const evt = new CustomEvent('reset-filters');
        window.dispatchEvent(evt);
      });
    }
    return;
  }

  gridContainer.innerHTML = list.map(item => {
    const isWish = state.shoppingWishlist.includes(item.id);
    const tagsHtml = (item.tags || []).slice(0, 3).map(tag => `<span class="mini-tag">#${escapeHtml(tag)}</span>`).join('');
    const cover = item.coverImage || (item.images && item.images[0]) || '';
    const acBadgeHtml = item.hasAirConditioning ? `<span class="shopping-badge-ac">❄️ 에어컨 완비</span>` : '';

    return `
      <article class="activity-card shopping-card" data-shopid="${escapeHtml(item.id)}">
        <div class="card-media-wrapper">
          <span class="shopping-badge-tier">${escapeHtml(item.qualityTier || item.categoryLabel)}</span>
          ${acBadgeHtml}
          <button class="card-heart-btn ${isWish ? 'active' : ''}" 
                  data-wish-shop="${escapeHtml(item.id)}" 
                  title="${isWish ? '찜 취소' : '찜하기'}">
            ${isWish ? '♥' : '♡'}
          </button>
          <img class="card-img" src="${escapeHtml(cover)}" alt="${escapeHtml(item.name || item.nameKo)}" loading="lazy" 
               onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80';" />
        </div>

        <div class="card-body">
          <div>
            <div class="card-header-line">
              <h3 class="card-title">${escapeHtml(item.name || item.nameKo)}</h3>
            </div>
            <div class="shopping-name-vi">${escapeHtml(item.nameVi || '')}</div>
            
            <div class="card-meta-line">
              <span class="rating"><span class="star">★</span> ${item.rating} <span style="font-size:0.75rem; color:var(--color-text-secondary);">(${item.reviewCount.toLocaleString()}개)</span></span>
              <span>•</span>
              <span>🕒 ${escapeHtml(item.openHours)}</span>
              <span>•</span>
              <span>📍 ${escapeHtml(item.location)}</span>
            </div>

            <div class="card-tag-pill-list" style="margin-bottom: 8px;">
              ${tagsHtml}
            </div>
          </div>

          <div>
            <div class="card-price-line">
              <span class="price-val">${escapeHtml(item.priceRangeVnd)}</span>
              <span class="price-sub">${escapeHtml(item.estimatedPriceKrw)}</span>
            </div>

            <div class="shopping-card-actions">
              <a href="${escapeHtml(item.googleMapUrl)}" target="_blank" rel="noopener noreferrer" 
                 class="btn-shopping-map" onclick="event.stopPropagation();">
                📍 지도
              </a>
              <a href="${escapeHtml(item.googlePhotosUrl)}" target="_blank" rel="noopener noreferrer" 
                 class="btn-shopping-photos" onclick="event.stopPropagation();">
                📸 실시간 사진
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Event Listeners: Card Click -> Modal Open
  gridContainer.querySelectorAll('.shopping-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const shopId = card.dataset.shopid;
      const shop = NHA_TRANG_SHOPPING.find(s => s.id === shopId);
      if (shop) openShoppingModal(shop);
    });
  });

  // Event Listeners: Heart Toggle
  gridContainer.querySelectorAll('.card-heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const shopId = btn.dataset.wishShop;
      toggleShoppingWishlist(shopId, e);
    });
  });
}

export function openShoppingModal(shop) {
  state.activeModalShopping = shop;
  const modal = document.getElementById('shoppingModal');
  if (!modal) return;

  // 1. Gallery
  const mainImg = document.getElementById('shoppingModalMainImg');
  const thumbsRow = document.getElementById('shoppingModalThumbs');
  const images = shop.images || [shop.coverImage];

  if (mainImg) {
    mainImg.src = images[0] || '';
    mainImg.alt = shop.name || shop.nameKo;
  }

  if (thumbsRow) {
    thumbsRow.innerHTML = images.map((imgUrl, idx) => `
      <img class="gallery-thumb ${idx === 0 ? 'active' : ''}" 
           src="${escapeHtml(imgUrl)}" 
           alt="매장 사진 ${idx + 1}" 
           data-idx="${idx}" 
           loading="lazy" />
    `).join('');

    thumbsRow.querySelectorAll('.gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        thumbsRow.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        if (mainImg) mainImg.src = e.currentTarget.src;
      });
    });
  }

  // 2. Badges & Titles
  const badgeEl = document.getElementById('shoppingModalBadge');
  const categoryEl = document.getElementById('shoppingModalCategory');
  const qualityBadgeEl = document.getElementById('shoppingModalQualityBadge');
  const acBadgeEl = document.getElementById('shoppingModalAcBadge');
  const titleEl = document.getElementById('shoppingModalTitle');
  const nameViEl = document.getElementById('shoppingModalNameVi');

  if (badgeEl) badgeEl.textContent = shop.badge || '쇼핑 명소';
  if (categoryEl) categoryEl.textContent = shop.categoryLabel || '쇼핑';
  if (qualityBadgeEl) qualityBadgeEl.textContent = shop.qualityTier || '정찰제';
  if (acBadgeEl) {
    acBadgeEl.style.display = shop.hasAirConditioning ? 'inline-block' : 'none';
    acBadgeEl.textContent = '❄️ 에어컨 완비';
  }
  if (titleEl) titleEl.textContent = shop.name || shop.nameKo;
  if (nameViEl) nameViEl.textContent = `🇻🇳 ${shop.nameVi}`;

  // 3. Meta Grid
  const ratingEl = document.getElementById('shoppingModalRating');
  const hoursEl = document.getElementById('shoppingModalHours');
  const priceRangeEl = document.getElementById('shoppingModalPriceRange');
  const locationEl = document.getElementById('shoppingModalLocation');

  if (ratingEl) ratingEl.textContent = `★ ${shop.rating} (${shop.reviewCount.toLocaleString()}개 리뷰)`;
  if (hoursEl) hoursEl.textContent = shop.openHours;
  if (priceRangeEl) priceRangeEl.textContent = shop.priceRangeVnd;
  if (locationEl) locationEl.textContent = shop.location;

  // 4. Address
  const addressEl = document.getElementById('shoppingModalAddress');
  if (addressEl) addressEl.textContent = shop.addressVi;

  // 5. Highlight
  const highlightEl = document.getElementById('shoppingModalHighlight');
  if (highlightEl) highlightEl.textContent = shop.highlight;

  // 6. Facilities & Payment Methods
  const facilitiesEl = document.getElementById('shoppingModalFacilities');
  if (facilitiesEl) {
    const allPills = [
      ...(shop.facilities || []).map(f => `<span class="facility-pill">🏢 ${escapeHtml(f)}</span>`),
      ...(shop.paymentMethods || []).map(p => `<span class="facility-pill">💳 ${escapeHtml(p)}</span>`),
      `<span class="facility-pill">🗣️ ${escapeHtml(shop.koreanSpeaking || '기본 소통')}</span>`,
      `<span class="facility-pill">${shop.bargainingRequired ? '🤝 흥정 필수' : '🏷️ 정찰제 매장'}</span>`
    ];
    facilitiesEl.innerHTML = allPills.join('');
  }

  // 7. Bargaining Table
  const tableContainer = document.getElementById('shoppingModalBargainingTable');
  if (tableContainer) {
    const guides = shop.bargainingGuide || [];
    if (guides.length > 0) {
      tableContainer.innerHTML = `
        <table class="bargain-table">
          <thead>
            <tr>
              <th style="width: 28%;">품목 / 대표 상품</th>
              <th style="width: 22%;">상인 초기 호가 (Asking)</th>
              <th style="width: 25%;">추천 목표가 (Target)</th>
              <th style="width: 25%;">실전 흥정 팁</th>
            </tr>
          </thead>
          <tbody>
            ${guides.map(g => `
              <tr>
                <td><strong>${escapeHtml(g.item)}</strong></td>
                <td><span class="price-badge-asking">${escapeHtml(g.askingPriceVnd)}</span></td>
                <td>
                  <span class="price-badge-target">${escapeHtml(g.targetPriceVnd)}</span>
                  <div style="font-size:0.75rem; color: #16A34A; margin-top:2px;">${escapeHtml(g.targetPriceKrw)}</div>
                </td>
                <td style="font-size:0.8rem; color: var(--color-text-secondary);">${escapeHtml(g.tip)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      tableContainer.innerHTML = `<p style="padding: 12px; color: var(--color-text-secondary);">정찰제 매장으로 품목별 별도 흥정이 필요 없습니다.</p>`;
    }
  }

  // 8. Korean Community Sentiment Analysis Panel
  const sentimentPanel = document.getElementById('shoppingModalSentimentPanel');
  if (sentimentPanel) {
    const s = shop.sentimentAnalysis || {};
    const sigItems = shop.signatureItems || [];
    sentimentPanel.innerHTML = `
      ${s.communityVerdict ? `<div class="sentiment-verdict-box">💡 <strong>커뮤니티 총평:</strong> ${escapeHtml(s.communityVerdict)}</div>` : ''}
      
      <div class="pros-cons-grid">
        <div class="pros-box">
          <h4>👍 만족 포인트 (Pros)</h4>
          <ul class="sentiment-list">
            ${(s.pros || []).map(p => `<li>${escapeHtml(p)}</li>`).join('')}
          </ul>
        </div>
        <div class="cons-box">
          <h4>⚠️ 주의 & 아쉬운 점 (Cons)</h4>
          <ul class="sentiment-list">
            ${(s.cons || []).map(c => `<li>${escapeHtml(c)}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${sigItems.length > 0 ? `
        <div class="best-sellers-box">
          <h4>🔥 한국인 인기 구매 품목 (Best-Sellers)</h4>
          <div class="best-seller-pills-row">
            ${sigItems.map(item => `<span class="best-seller-pill">${escapeHtml(item)}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${s.scamWarning ? `
        <div class="scam-warning-box">
          ⚠️ <strong>현장 구매 주의사항:</strong> ${escapeHtml(s.scamWarning)}
        </div>
      ` : ''}
    `;
  }

  // 9. Customs Guide Box
  const customsTextEl = document.getElementById('shoppingCustomsWarningText');
  if (customsTextEl) {
    customsTextEl.textContent = shop.customsAdvice || '자가사용 목적 1인 소량 반입 규정을 준수하고 상자나 가격 태그를 분리해 안전하게 반입하세요.';
  }

  // 10. Description & Tip
  const descEl = document.getElementById('shoppingModalDesc');
  const tipEl = document.getElementById('shoppingModalTip');
  if (descEl) descEl.textContent = shop.description;
  if (tipEl) tipEl.textContent = shop.localTip;

  // 11. Notes Auto-save Input
  const noteInput = document.getElementById('shoppingNoteInput');
  const noteStatus = document.getElementById('shoppingNoteStatus');
  if (noteInput) {
    noteInput.value = state.shoppingNotes[shop.id] || '';
  }
  if (noteStatus) noteStatus.textContent = '';

  // 12. Bottom Sticky Bar
  const avgPriceEl = document.getElementById('shoppingModalAvgPrice');
  const avgKrwEl = document.getElementById('shoppingModalAvgKrw');
  const pricePerEl = document.getElementById('shoppingModalPricePer');
  const heartBtn = document.getElementById('shoppingModalHeartBtn');
  const photosBtn = document.getElementById('shoppingModalPhotosBtn');
  const mapBtn = document.getElementById('shoppingModalMapBtn');

  if (avgPriceEl) avgPriceEl.textContent = formatVND(shop.avgPriceVnd);
  if (avgKrwEl) avgKrwEl.textContent = `(${formatKRW(shop.avgPriceVnd)})`;
  if (pricePerEl) pricePerEl.textContent = `/ ${shop.pricePer || '대표 품목'}`;

  updateShoppingModalHeartState(shop.id);

  if (heartBtn) {
    heartBtn.onclick = () => {
      toggleShoppingWishlist(shop.id);
      updateShoppingModalHeartState(shop.id);
    };
  }

  if (photosBtn) photosBtn.href = shop.googlePhotosUrl;
  if (mapBtn) mapBtn.href = shop.googleMapUrl;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateShoppingModalHeartState(shopId) {
  const heartBtn = document.getElementById('shoppingModalHeartBtn');
  if (!heartBtn) return;
  const isWish = state.shoppingWishlist.includes(shopId);
  heartBtn.textContent = isWish ? '♥ 찜 취소' : '♡ 찜하기';
  heartBtn.classList.toggle('active', isWish);
}

export function closeShoppingModal() {
  const modal = document.getElementById('shoppingModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
  state.activeModalShopping = null;
}

export function toggleShoppingWishlist(id, e) {
  if (e) e.stopPropagation();

  const idx = state.shoppingWishlist.indexOf(id);
  let added = false;
  if (idx > -1) {
    state.shoppingWishlist.splice(idx, 1);
  } else {
    state.shoppingWishlist.push(id);
    added = true;
  }

  saveToStorage('nha_trang_shopping_wishlist', state.shoppingWishlist);
  updateWishlistBadge();

  // Update card heart buttons in DOM
  const btn = document.querySelector(`button[data-wish-shop="${id}"]`);
  if (btn) {
    btn.classList.toggle('active', added);
    btn.textContent = added ? '♥' : '♡';
    btn.title = added ? '찜 취소' : '찜하기';
  }

  if (state.activeModalShopping && state.activeModalShopping.id === id) {
    updateShoppingModalHeartState(id);
  }

  if (state.wishlistOnly) {
    renderShopping();
  }

  showToast(added ? '쇼핑 스팟을 위시리스트에 담았습니다! ❤️' : '위시리스트에서 제외했습니다.');
}
