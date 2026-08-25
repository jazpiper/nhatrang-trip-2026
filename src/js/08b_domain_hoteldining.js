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
    const mainImg = item.coverImage || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80';
    const tagsHtml = (item.tags || []).slice(0, 3).map(tag => `<span class="card-tag-pill">${escapeHtml(tag)}</span>`).join('');
    const hotelShortName = item.hotelName ? item.hotelName.split('(')[0].trim() : '5성급 호텔';

    return `
      <div class="activity-card hoteldining-card" data-id="${item.id}">
        <div class="card-media-wrapper">
          <img class="card-img" src="${escapeHtml(mainImg)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'" />
          <span class="card-badge-top-left stay-badge-cat">${escapeHtml(item.categoryLabel || '호텔 다이닝')}</span>
          <span class="stay-badge-theme">${escapeHtml(item.badge || '추천')}</span>
          <button class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-id="${item.id}" title="위시리스트 저장" aria-label="위시리스트 저장">
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
              <span class="star">★</span> ${item.rating || 4.5} 
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
    { id: 'hoteldiningModalMapLink', as: 'href', value: item => item.googleMapUrl || buildMapUrl(item) },
    { id: 'hoteldiningModalPhotosLink', as: 'href', value: item => item.googlePhotosUrl || item.googleMapUrl || buildMapUrl(item) },
    { id: 'hoteldiningModalOfficialLink', as: 'href', value: item => item.officialUrl || item.googleMapUrl || '#' }
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
