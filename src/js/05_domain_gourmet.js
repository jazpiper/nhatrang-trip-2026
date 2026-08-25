  // --- 5. Gourmet Domain Logic ---
  function gourmetCategoryMatch(item, cat) {
    const tagStr = (item.tags || []).join(' ');
    if (cat === 'fruit') {
      return (item.category === 'fruit' || item.category === 'cafe' || item.category === 'dessert' || (item.categoryLabel && (item.categoryLabel.includes('카페') || item.categoryLabel.includes('디저트') || item.categoryLabel.includes('생과일'))));
    } else if (cat === 'rice') {
      return (item.category === 'rice' || (item.category === 'vietnamese' && (tagStr.includes('가정식') || tagStr.includes('솥밥') || tagStr.includes('치킨라이스') || tagStr.includes('닭고기밥') || tagStr.includes('전통') || tagStr.includes('식당'))) || tagStr.includes('가정식') || tagStr.includes('솥밥') || tagStr.includes('치킨라이스') || tagStr.includes('닭고기밥') || tagStr.includes('껌땀') || tagStr.includes('누룽지'));
    } else if (cat === 'pho') {
      return (item.category === 'pho' || item.category === 'bunca' || tagStr.includes('쌀국수') || tagStr.includes('분짜') || tagStr.includes('분까') || tagStr.includes('분보') || (item.category === 'vietnamese' && tagStr.includes('쌀국수')) || (item.categoryLabel && (item.categoryLabel.includes('쌀국수') || item.categoryLabel.includes('분짜'))));
    } else if (cat === 'banhxeo') {
      return (item.category === 'banhxeo' || tagStr.includes('반쎄오') || tagStr.includes('넴느엉') || tagStr.includes('반깐') || (item.categoryLabel && item.categoryLabel.includes('반쎄오')));
    } else if (cat === 'seafood') {
      return (item.category === 'seafood' || (item.categoryLabel && item.categoryLabel.includes('해산물')) || tagStr.includes('해산물') || tagStr.includes('조개'));
    } else if (cat === 'banhmi') {
      return (item.category === 'banhmi' || tagStr.includes('반미'));
    } else {
      return (item.category === cat);
    }
  }

  function gourmetTagMatch(item, gt) {
    const tagStr = (item.tags || []).join(' ');
    if (gt === 'line' && (tagStr.includes('줄서는') || tagStr.includes('1위') || tagStr.includes('인기') || tagStr.includes('성지') || tagStr.includes('명가') || tagStr.includes('단골'))) return true;
    if (gt === 'ac' && (tagStr.includes('에어컨') || tagStr.includes('냉방') || tagStr.includes('쾌적') || tagStr.includes('위생'))) return true;
    if (gt === 'breakfast' && (tagStr.includes('아침') || tagStr.includes('모닝') || tagStr.includes('해장') || (item.openHours && (item.openHours.startsWith('05:') || item.openHours.startsWith('06:') || item.openHours.startsWith('07:'))))) return true;
    if (gt === 'seafood' && (tagStr.includes('정찰제') || tagStr.includes('해산물') || tagStr.includes('조개') || item.category === 'seafood')) return true;
    if (gt === 'night' && (tagStr.includes('야간') || tagStr.includes('야식') || tagStr.includes('맥주') || tagStr.includes('심야') || (item.openHours && (item.openHours.includes('23:') || item.openHours.includes('24:') || item.openHours.includes('02:'))))) return true;
    if (item.tags && item.tags.includes(gt)) return true;
    return false;
  }

  const GOURMET_SEARCH = {
    strings: ['name', 'nameVi', 'description', 'location', 'highlight', 'badge', 'categoryLabel'],
    arrays: ['tags'],
    // signatureMenu entries are either a plain string or {name, desc}.
    extra: (item, q) => (item.signatureMenu || []).some(m => {
      const mStr = typeof m === 'string' ? m : (m.name + ' ' + m.desc);
      return mStr.toLowerCase().includes(q);
    })
  };

  function gourmetSearchMatch(item, q) {
    return matchTextFields(item, q, GOURMET_SEARCH);
  }

  function gourmetCompare(a, b) {
    if (state.sortBy === 'rating') return ((b.rating || 0) * 10000 + (b.reviewCount || 0)) - ((a.rating || 0) * 10000 + (a.reviewCount || 0));
    if (state.sortBy === 'price-asc') return (a.avgPriceVnd || 0) - (b.avgPriceVnd || 0);
    if (state.sortBy === 'price-desc') return (b.avgPriceVnd || 0) - (a.avgPriceVnd || 0);
    return 0;
  }

  function getFilteredGourmets() {
    if (typeof NHA_TRANG_GOURMETS === 'undefined') return [];
    return applyDomainFilter({
      source: NHA_TRANG_GOURMETS,
      catField: 'gourmetCategory', tagField: 'gourmetTag', wishField: 'gourmetWishlist',
      categoryMatch: gourmetCategoryMatch,
      tagMatch: gourmetTagMatch,
      searchMatch: gourmetSearchMatch,
      compare: gourmetCompare
    });
  }

  function gourmetCardTemplate(item) {
    const isWish = (state.gourmetWishlist || []).includes(item.id);
    const userNote = (state.gourmetNotes || {})[item.id];
    const tagBadges = (item.tags || []).slice(0, 3).map(t => `<span class="card-tag-pill">${escapeHtml(t)}</span>`).join('');

    const sigPreview = (item.signatureMenu && item.signatureMenu.length > 0)
      ? (typeof item.signatureMenu[0] === 'string' ? item.signatureMenu[0] : item.signatureMenu[0].name)
      : '';

    return `
        <div class="activity-card gourmet-card" data-id="${escapeHtml(item.id)}">
          <div class="card-media-wrapper">
            <div class="gourmet-media-top-row">
              <span class="card-badge-top-left">${escapeHtml(item.badge || item.categoryLabel || '맛집')}</span>
              <button class="card-heart-btn card-heart-btn-static ${isWish ? 'is-wishlisted' : ''}" data-id="${escapeHtml(item.id)}" title="위시리스트 저장" aria-label="위시리스트 저장">
                ♥
              </button>
            </div>
            <div class="gourmet-media-info">
              <div class="gourmet-media-eyebrow">Google Maps 인증 맛집</div>
              <div class="gourmet-media-name">${escapeHtml(item.name)}</div>
              <div class="gourmet-media-name-vi">${escapeHtml(item.nameVi || '')}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-header-line">
              <span class="card-title">${escapeHtml(item.name)}</span>
              <span class="card-rating"><span class="star">★</span> ${escapeHtml(item.rating || 4.5)} <span class="card-review-count">(${Number(item.reviewCount || 0).toLocaleString()})</span></span>
            </div>
            <div class="card-meta-line">
              <span>⏰ ${escapeHtml(item.openHours || '영업시간 확인')}</span>
              <span>•</span>
              <span>📍 ${escapeHtml(item.location || '나트랑')}</span>
            </div>
            <div class="card-tag-pill-list">
              ${tagBadges}
            </div>
            ${sigPreview ? `
              <div class="gourmet-signature-preview">
                ⭐ 대표: ${escapeHtml(sigPreview)}
              </div>
            ` : ''}
            <div class="card-price-line">
              <span class="price-main">${formatVND(item.avgPriceVnd)}</span>
              <span class="price-krw">(${formatKRW(item.avgPriceVnd)})</span>
              <span class="price-sub">/ 1인 예상</span>
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

  function gourmetRowTemplate(item, idx) {
    const sig = parseSignature((item.signatureMenu || [])[0]);
    return itemRowHTML({
      id: item.id,
      rank: idx + 1,
      emoji: item.iconEmoji || '🍽️',
      name: item.name,
      tags: [
        item.badge ? { label: item.badge, hot: true } : null,
        item.categoryLabel ? { label: item.categoryLabel } : null
      ].filter(Boolean),
      rating: item.rating,
      reviewCount: item.reviewCount,
      openState: isOpenNow(item.openHours),
      metaParts: [item.openHours, item.location],
      sigLabel: sig ? `⭐ ${sig.name}` : '',
      sigValue: sig ? sig.price : '',
      subText: item.nameVi,
      priceMain: formatVND(item.avgPriceVnd),
      priceKrw: formatKRW(item.avgPriceVnd),
      priceUnit: '1인 예상',
      isWish: (state.gourmetWishlist || []).includes(item.id),
      note: (state.gourmetNotes || {})[item.id],
      mapUrl: buildMapUrl(item)
    });
  }

  function renderGourmets() {
    renderDomainGrid({
      gridContainerId: 'gourmetCardsGridContainer',
      countTextId: 'gourmetResultCountText',
      getFiltered: getFilteredGourmets,
      countHtml: (n) => `총 <strong>${n}</strong>개의 현지인 찐 맛집`,
      emptyHtml: () => `
        <div class="empty-state">
          <div class="icon">🍜</div>
          <h3>조건에 맞는 맛집이 없습니다</h3>
          <p>필터 조건을 초기화하거나 다른 메뉴·식당 이름으로 찾아보세요.</p>
          <button class="btn-reset-filters" id="btnResetGourmetFilters">필터 전체 초기화</button>
        </div>
      `,
      resetBtnId: 'btnResetGourmetFilters',
      cardTemplate: gourmetCardTemplate,
      rowTemplate: gourmetRowTemplate,
      cardSelector: '.gourmet-card',
      ignoreSelectors: ['.card-heart-btn'],
      findItem: (id) => NHA_TRANG_GOURMETS.find(g => g.id === id),
      openModal: openGourmetModal,
      toggleWishlist: toggleGourmetWishlist,
      rerender: renderGourmets
    });
  }

  function toggleGourmetWishlist(id) { toggleDomainWishlist('gourmet', id); }

  const GOURMET_MODAL_FIELDS = [
    { id: 'gourmetModalBadge', value: item => item.badge || item.categoryLabel || '인기맛집' },
    { id: 'gourmetModalCategory', value: item => item.categoryLabel || item.category },
    { id: 'gourmetModalTitle', value: 'name' },
    { id: 'gourmetModalNameVi', value: item => item.nameVi || item.name },
    { id: 'gourmetModalRating', value: item => `★ ${item.rating || 4.5} (${Number(item.reviewCount || 0).toLocaleString()}개 구글 리뷰)` },
    { id: 'gourmetModalHours', value: item => item.openHours || '영업시간 확인 권장' },
    { id: 'gourmetModalPriceRange', value: item => item.priceRange || `${formatVND(item.avgPriceVnd)} 내외` },
    { id: 'gourmetModalMeal', value: item => item.recommendedMeal || '점심 / 저녁' },
    { id: 'gourmetModalAddress', value: item => item.addressVi || item.location },
    { id: 'gourmetModalHighlight', value: item => item.highlight || item.description },
    { id: 'gourmetModalDesc', value: item => item.description || '' },
    { id: 'gourmetModalTip', value: item => item.localTip || '웨이팅이 있을 수 있으니 여유 있게 방문하세요.' },
    { id: 'gourmetModalAvgPrice', value: item => formatVND(item.avgPriceVnd) },
    { id: 'gourmetModalAvgKrw', value: item => `(${formatKRW(item.avgPriceVnd)})` },
    { id: 'gourmetModalPricePer', value: () => '/ 1인 예상' },
    { id: 'gourmetModalPhotosBtn', as: 'href', value: item => sanitizeUrl(item.photosUrl || item.mapUrl || '#') },
    { id: 'gourmetModalMapBtn', as: 'href', value: item => sanitizeUrl(item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.nameVi || item.name) + ' Nha Trang')}`) },
  ];

  function openGourmetModal(item) {
    state.activeModalGourmet = item;
    const modal = document.getElementById('gourmetModal');
    if (!modal) return;

    applyModalFields(item, GOURMET_MODAL_FIELDS);

    const menuList = document.getElementById('gourmetModalMenuList');
    if (menuList) {
      if (item.signatureMenu && item.signatureMenu.length > 0) {
        menuList.innerHTML = item.signatureMenu.map(m => {
          if (typeof m === 'string') return `<li><span class="bullet">⭐</span> <strong>${escapeHtml(m)}</strong></li>`;
          return `
            <li>
              <span class="bullet">⭐</span>
              <strong>${escapeHtml(m.name)}</strong>
              ${m.price ? `<span class="gourmet-menu-price">(${escapeHtml(m.price)})</span>` : ''}
              ${m.desc ? `<div class="gourmet-menu-desc">${escapeHtml(m.desc)}</div>` : ''}
            </li>
          `;
        }).join('');
      } else {
        menuList.innerHTML = '<li>현장 메뉴판을 참고하세요.</li>';
      }
    }

    const officialBtn = document.getElementById('gourmetModalOfficialBtn');
    if (officialBtn) officialBtn.href = sanitizeUrl(item.photosUrl || item.mapUrl || '#');

    finishModalOpen('gourmet', item, modal);
  }

  function closeGourmetModal() { closeDomainModal('gourmet'); }

