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
    const isWish = state.wishlist.includes(item.id);
    const userNote = state.notes[item.id];
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
      isWish: state.wishlist.includes(item.id),
      note: state.notes[item.id],
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

