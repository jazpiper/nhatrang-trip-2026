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
            <span class="card-badge-top-left">${escapeHtml(item.badge || item.categoryLabel || '쇼핑')}</span>
            ${qualityTierBadge}
            ${acBadge}
            <button class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-id="${item.id}" title="위시리스트 저장" aria-label="위시리스트 저장">
              ♥
            </button>
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.nameKo || item.name)}</span>
              <span class="card-rating">
                <span class="star">★</span> ${item.rating || 4.7} 
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
    { id: 'shoppingModalPhotosBtn', as: 'href', value: item => item.photosUrl || item.mapUrl || '#' },
    { id: 'shoppingModalMapBtn', as: 'href', value: item => item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.nameKo || item.name) + ' Nha Trang')}` },
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

