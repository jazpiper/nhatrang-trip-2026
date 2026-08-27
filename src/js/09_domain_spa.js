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

