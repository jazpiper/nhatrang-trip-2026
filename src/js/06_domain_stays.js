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

