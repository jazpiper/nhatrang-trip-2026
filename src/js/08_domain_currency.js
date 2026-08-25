  // --- 8. Currency & ATM Domain Logic ---
  // KRW per 100 VND. Seeded from DEFAULT_EXCHANGE_RATE so the calculator, the header
  // calculator modal and every card's KRW estimate start from the same number.
  // The rate preset buttons reassign this at runtime.
  let currentBenchmarkRate = (typeof DEFAULT_EXCHANGE_RATE !== 'undefined' ? DEFAULT_EXCHANGE_RATE : 0.0545) * 100;

  function formatVerbalVND(vnd) {
    if (!vnd || vnd <= 0) return '0 동 (0k VND)';
    let text = '';
    if (vnd >= 100000000) {
      const eok = Math.floor(vnd / 100000000);
      const man = Math.floor((vnd % 100000000) / 10000);
      text = man > 0 ? `${eok}억 ${man.toLocaleString()}만 동` : `${eok}억 동`;
    } else if (vnd >= 10000) {
      const man = Math.floor(vnd / 10000);
      const rest = vnd % 10000;
      text = rest > 0 ? `${man.toLocaleString()}만 ${rest.toLocaleString()} 동` : `${man.toLocaleString()}만 동`;
    } else {
      text = `${vnd.toLocaleString()} 동`;
    }

    let kText = '';
    if (vnd >= 1000000) {
      const m = vnd / 1000000;
      kText = (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + 'M VND';
    } else if (vnd >= 1000) {
      const k = Math.round(vnd / 1000);
      kText = `${k}k VND`;
    } else {
      kText = `${vnd} VND`;
    }
    return `${text} (${kText})`;
  }

  function formatVerbalKRW(krw) {
    if (!krw || krw <= 0) return '약 0원';
    if (krw >= 100000000) {
      const eok = Math.floor(krw / 100000000);
      const man = Math.floor((krw % 100000000) / 10000);
      const rest = krw % 10000;
      if (man > 0 && rest > 0) return `약 ${eok}억 ${man.toLocaleString()}만 ${rest.toLocaleString()}원`;
      if (man > 0) return `약 ${eok}억 ${man.toLocaleString()}만원`;
      return `약 ${eok}억원`;
    } else if (krw >= 10000) {
      const man = Math.floor(krw / 10000);
      const rest = krw % 10000;
      if (rest > 0) return `약 ${man.toLocaleString()}만 ${rest.toLocaleString()}원`;
      return `약 ${man.toLocaleString()}만원`;
    } else {
      return `약 ${krw.toLocaleString()}원`;
    }
  }

  function currencyCategoryMatch(item, cat) {
    if (cat === 'atm_zero_fee') {
      return item.category === 'atm_zero_fee';
    } else if (cat === 'exchange_gold') {
      return item.category === 'exchange_gold';
    } else if (cat === 'exchange_bank') {
      return item.category === 'exchange_bank';
    } else if (cat === 'exchange_airport') {
      return item.category === 'exchange_airport';
    } else if (cat === 'card_travellog') {
      const cards = (item.supportedCards || []).join(' ');
      const tags = (item.tags || []).join(' ');
      return cards.includes('트래블로그') || tags.includes('트래블로그') || item.category === 'exchange_gold';
    } else if (cat === 'card_travelwallet') {
      const cards = (item.supportedCards || []).join(' ');
      const tags = (item.tags || []).join(' ');
      return cards.includes('트래블월렛') || tags.includes('트래블월렛') || item.category === 'exchange_gold';
    } else if (cat === 'card_sol_toss_wibee') {
      const cards = (item.supportedCards || []).join(' ');
      const tags = (item.tags || []).join(' ');
      return cards.includes('쏠트래블') || cards.includes('토스') || cards.includes('위비') ||
          tags.includes('신한쏠트래블') || tags.includes('토스뱅크') || tags.includes('위비트래블') ||
          item.category === 'exchange_gold';
    } else {
      return item.category === cat;
    }
  }

  function currencyTagMatch(item, t) {
    const allText = [
      ...(item.tags || []),
      ...(item.facilities || []),
      ...(item.supportedCards || []),
      ...(item.supportedCurrencies || []),
      ...(item.exchangePerks || []),
      item.badge || '',
      item.category || '',
      item.location || '',
      item.feePolicy || ''
    ].join(' ').toLowerCase();

    if (t === 'fee_free' || t === 'zero_fee') {
      if (item.feeFree === true || allText.includes('수수료 0') || allText.includes('수수료0')) return true;
    } else if (t === 'travellog') {
      if (allText.includes('트래블로그') || (item.supportedCards && item.supportedCards.some(c => c.includes('트래블로그')))) return true;
    } else if (t === 'travelwallet') {
      if (allText.includes('트래블월렛') || (item.supportedCards && item.supportedCards.some(c => c.includes('트래블월렛')))) return true;
    } else if (t === 'sol_travel') {
      if (allText.includes('쏠트래블') || allText.includes('sol') || (item.supportedCards && item.supportedCards.some(c => c.includes('쏠')))) return true;
    } else if (t === 'toss_bank') {
      if (allText.includes('토스') || (item.supportedCards && item.supportedCards.some(c => c.includes('토스')))) return true;
    } else if (t === 'wibee') {
      if (allText.includes('위비') || (item.supportedCards && item.supportedCards.some(c => c.includes('위비')))) return true;
    } else if (t === 'usd100') {
      if (allText.includes('100달러') || allText.includes('신권') || (item.supportedCurrencies && item.supportedCurrencies.some(c => c.includes('100')))) return true;
    } else if (t === 'livebank_24h') {
      if (allText.includes('livebank') || allText.includes('24시간') || (item.facilities && item.facilities.some(f => f.includes('24시간')))) return true;
    } else if (t === 'night_market') {
      if (allText.includes('야시장') || allText.includes('여행자거리') || (item.location || '').includes('야시장')) return true;
    } else if (t === 'korean_atm') {
      if (allText.includes('한국어') || (item.facilities && item.facilities.some(f => f.includes('한국어')))) return true;
    } else if ((item.tags || []).includes(t)) {
      return true;
    }
    return false;
  }

  const CURRENCY_SEARCH = {
    strings: ['name', 'nameKo', 'nameVi', 'nameEn', 'categoryLabel', 'location', 'addressVi',
              'districtLabel', 'highlight', 'description', 'localTip', 'feePolicy', 'withdrawalLimit'],
    arrays: ['tags', 'facilities', 'supportedCards', 'supportedCurrencies', 'exchangePerks']
  };

  function currencySearchMatch(item, q) {
    return matchTextFields(item, q, CURRENCY_SEARCH);
  }

  function currencyCompare(a, b) {
    if (state.sortBy === 'rating') {
      const scoreA = (a.rating || 0) * 100000 + (a.reviewCount || 0);
      const scoreB = (b.rating || 0) * 100000 + (b.reviewCount || 0);
      return scoreB - scoreA;
    }
    if (state.sortBy === 'reviews' || state.sortBy === 'reviewCount') {
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    }
    if (state.sortBy === 'name') {
      return (a.nameKo || a.name).localeCompare(b.nameKo || b.name, 'ko');
    }
    // price-asc / price-desc: switchMainTab hides these options on the currency tab
    // because every spot's avgPriceVnd is 0. Kept only so a stale state.sortBy
    // carried over from another tab degrades to "no reordering" instead of NaN.
    if (state.sortBy === 'price-asc') {
      return (a.avgPriceVnd || 0) - (b.avgPriceVnd || 0);
    }
    if (state.sortBy === 'price-desc') {
      return (b.avgPriceVnd || 0) - (a.avgPriceVnd || 0);
    }
    return 0;
  }

  function getFilteredCurrency() {
    if (typeof NHA_TRANG_CURRENCY === 'undefined') return [];
    return applyDomainFilter({
      source: NHA_TRANG_CURRENCY,
      catField: 'currencyCategory', tagField: 'currencyTag', wishField: 'currencyWishlist',
      categoryMatch: currencyCategoryMatch,
      tagMatch: currencyTagMatch,
      searchMatch: currencySearchMatch,
      compare: currencyCompare
    });
  }

  function currencyCardTemplate(item) {
    const isWish = (state.currencyWishlist || []).includes(item.id);
    const userNote = (state.currencyNotes || {})[item.id];
    const feeBadgeClass = item.feeFree ? 'free' : 'exchange';
    const feeBadgeText = item.feeFree ? '🎁 수수료 0원' : '💱 최우대 환율';

    const cardPills = (item.supportedCards || []).slice(0, 4).map(c => `
        <span class="supported-card-pill">${escapeHtml(c)}</span>
      `).join('');
    const morePill = (item.supportedCards || []).length > 4 ? `
        <span class="supported-card-pill more">+${(item.supportedCards || []).length - 4}</span>
      ` : '';

    return `
        <div class="activity-card currency-card" data-id="${item.id}">
          <div class="card-media-wrapper">
            <img class="card-img" src="${escapeHtml(item.coverImage || (item.images || [])[0] || '')}" alt="${escapeHtml(item.nameKo || item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80'" />
            <span class="card-badge-top-left ${item.feeFree ? 'badge-fee-zero' : ''}">${escapeHtml(item.badge || item.categoryLabel || '환전·ATM')}</span>
            <button type="button" class="card-heart-btn ${isWish ? 'is-wishlisted' : ''}" data-id="${item.id}" aria-label="찜하기">
              ${isWish ? '♥' : '♡'}
            </button>
            ${userNote ? `<span class="card-user-note-badge" title="${escapeHtml(userNote)}">📝 메모</span>` : ''}
          </div>
          <div class="card-content">
            <div class="card-category-row">
              <span class="card-cat-pill">${escapeHtml(item.categoryLabel || '환전·ATM')}</span>
              <span class="currency-badge-fee ${feeBadgeClass}">${feeBadgeText}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.nameKo || item.name)}</h3>
            <p class="card-name-vi">🇻🇳 ${escapeHtml(item.nameVi || '')}</p>
            <div class="card-meta-line">
              <span class="rating">★ ${item.rating || '-'}</span>
              <span class="reviews">(${(item.reviewCount || 0).toLocaleString()})</span>
              <span class="dot">·</span>
              <span class="hours">⏰ ${escapeHtml(item.openHours || '영업시간 미확인')}</span>
            </div>
            <p class="card-location-line">📍 ${escapeHtml(item.location || '나트랑')}</p>

            <div class="supported-card-pills-row">
              ${cardPills}${morePill}
            </div>

            <p class="card-highlight-text">✨ ${escapeHtml(item.highlight || '')}</p>

            <div class="card-bottom-bar">
              <div class="card-fee-info">
                <span class="fee-main">${item.feeFree ? '수수료 0 VND' : '최우대 스프레드'}</span>
                <span class="fee-sub">${escapeHtml(item.feePolicy || '')}</span>
              </div>
              <div class="currency-card-actions">
                <a href="${escapeHtml(item.googleMapUrl || '')}" target="_blank" rel="noopener noreferrer" class="btn-currency-map" onclick="event.stopPropagation();" title="구글 지도로 보기">📍 지도</a>
                <a href="${escapeHtml(item.googlePhotosUrl || item.googleMapUrl || '')}" target="_blank" rel="noopener noreferrer" class="btn-currency-photos" onclick="event.stopPropagation();" title="실시간 사진 보기">📸 사진</a>
              </div>
            </div>
          </div>
        </div>
      `;
  }

  function currencyRowTemplate(item, idx) {
    return itemRowHTML({
      id: item.id,
      rank: idx + 1,
      imgUrl: item.coverImage || (item.images && item.images[0]) || '',
      emoji: '💱',
      name: item.nameKo || item.name,
      tags: [
        { label: item.feeFree ? '수수료 0원' : '우대 환율', hot: !!item.feeFree },
        item.categoryLabel ? { label: item.categoryLabel } : null
      ].filter(Boolean),
      rating: item.rating,
      reviewCount: item.reviewCount,
      openState: isOpenNow(item.openHours),
      metaParts: [item.openHours, item.location],
      sigLabel: (item.supportedCards || []).length ? `💳 ${item.supportedCards.slice(0, 3).join(', ')}` : '',
      subText: item.bestTiming || item.nameVi,
      priceMain: item.feeFree ? '수수료 0 VND' : '최우대 스프레드',
      priceKrw: '',
      priceUnit: item.feePolicy || '',
      isWish: (state.currencyWishlist || []).includes(item.id),
      note: (state.currencyNotes || {})[item.id],
      mapUrl: buildMapUrl(item)
    });
  }

  function renderCurrency() {
    renderDomainGrid({
      gridContainerId: 'currencyCardsGridContainer',
      countTextId: 'currencyResultCountText',
      getFiltered: getFilteredCurrency,
      countHtml: (n) => `총 <strong>${n}</strong>개의 검증 환전소 & 수수료 무료 ATM`,
      emptyHtml: () => `
        <div class="empty-state empty-state-compact">
          <div class="icon">💱</div>
          <h3>조건에 맞는 환전소나 ATM이 없습니다</h3>
          <p>
            선택하신 카테고리 또는 태그를 변경하거나 검색어를 초기화해보세요.
          </p>
          <button class="btn-primary-reserve" id="btnResetCurrencyFilters">
            전체 보기 및 필터 초기화
          </button>
        </div>
      `,
      resetBtnId: 'btnResetCurrencyFilters',
      cardTemplate: currencyCardTemplate,
      rowTemplate: currencyRowTemplate,
      cardSelector: '.currency-card',
      ignoreSelectors: ['.card-heart-btn', '.btn-currency-map', '.btn-currency-photos'],
      findItem: (id) => (typeof NHA_TRANG_CURRENCY !== 'undefined' ? NHA_TRANG_CURRENCY : []).find(s => s.id === id),
      openModal: openCurrencyModal,
      toggleWishlist: toggleCurrencyWishlist,
      rerender: renderCurrency
    });
  }

  function toggleCurrencyWishlist(id) { toggleDomainWishlist('currency', id); }

  const CURRENCY_MODAL_FIELDS = [
    { id: 'currencyModalBadge', value: item => item.badge || item.categoryLabel },
    { id: 'currencyModalCategory', value: 'categoryLabel' },
    { id: 'currencyModalTitle', value: item => item.nameKo || item.name },
    { id: 'currencyModalNameVi', value: item => `🇻🇳 ${item.nameVi}` },
    { id: 'currencyModalRating', value: item => `★ ${item.rating || '-'} (${(item.reviewCount || 0).toLocaleString()}개 리뷰)` },
    { id: 'currencyModalHours', value: item => item.openHours || '24시간 연중무휴' },
    { id: 'currencyModalFeePolicy', value: item => item.feePolicy || '수수료 0원' },
    { id: 'currencyModalLocation', value: item => item.location || '시내 중심' },
    { id: 'currencyModalAddress', value: 'addressVi' },
    { id: 'currencyModalHighlightText', value: item => item.highlight || '' },
    { id: 'currencyModalDesc', value: item => item.description || '' },
    { id: 'currencyModalTip', value: item => item.localTip || '' },
    { id: 'currencyModalPhotosBtn', as: 'href', value: item => item.googlePhotosUrl || item.googleMapUrl },
    { id: 'currencyModalMapBtn', as: 'href', value: 'googleMapUrl' },
  ];

  function openCurrencyModal(item) {
    const modal = document.getElementById('currencyModal');
    if (!modal || !item) return;

    state.activeModalCurrency = item;

    const images = (item.images && item.images.length > 0) ? item.images : [item.coverImage].filter(Boolean);
    renderModalGallery({
      mainImgId: 'currencyModalMainImg', thumbsId: 'currencyModalThumbs',
      images, mainSrc: images[0] || item.coverImage,
      mainAlt: item.nameKo || item.name, thumbAlt: item.nameKo || item.name
    });

    applyModalFields(item, CURRENCY_MODAL_FIELDS);

    const modalFeeBadge = document.getElementById('currencyModalFeeBadge');
    if (modalFeeBadge) {
      modalFeeBadge.textContent = item.feeFree ? '현지 수수료 0 VND' : '최고 우대 환전';
      modalFeeBadge.style.background = item.feeFree ? 'var(--success-surface)' : 'var(--warn-surface)';
      modalFeeBadge.style.color = item.feeFree ? 'var(--success-mark)' : 'var(--warn-mark)';
    }

    // NOTE: copy handler is bound once in initEvents() via addEventListener.
    // Do NOT also assign .onclick here — both would fire on a single click.

    renderCurrencyCardsList(item, document.getElementById('currencyModalCardsList'));
    renderCurrencyAtmSteps(item, document.getElementById('currencyModalAtmSteps'));
    renderCurrencyDccGuide(document.getElementById('currencyModalDccGuide'));
    renderCurrencyRatesBox(item, document.getElementById('currencyModalRatesBox'));
    renderCurrencyLimitsBox(item, document.getElementById('currencyModalLimitsBox'));
    renderCurrencyFacilities(item, document.getElementById('currencyModalFacilities'));

    finishModalOpen('currency', item, modal);
  }

  function renderCurrencyCardsList(item, el) {
    if (!el) return;
    el.innerHTML = (item.supportedCards || []).map(card => `
      <div class="supported-card-item">
        <span class="card-icon">💳</span>
        <span class="card-name">${escapeHtml(card)}</span>
        <span class="card-status-badge ${item.feeFree ? 'free' : 'exchange'}">${item.feeFree ? '수수료 0원' : '환전 가능'}</span>
      </div>
    `).join('');
  }

  function renderCurrencyAtmSteps(item, el) {
    if (!el) return;
    if (item.category === 'atm_zero_fee') {
      el.innerHTML = `
        <div class="atm-steps-box">
          <div class="atm-step-item"><span class="step-badge">1</span><span><strong>카드 삽입 & 언어:</strong> 영문(English) 선택</span></div>
          <div class="atm-step-item"><span class="step-badge">2</span><span><strong>6자리 PIN 입력:</strong> 4자리 비밀번호 + 뒤에 00 입력 후 ENTER</span></div>
          <div class="atm-step-item"><span class="step-badge">3</span><span><strong>계좌 선택:</strong> 반드시 [Checking / Current Account] 선택</span></div>
          <div class="atm-step-item"><span class="step-badge">4</span><span><strong>금액 선택:</strong> 1회 인출 한도 (${escapeHtml(item.withdrawalLimit || '500만동')})</span></div>
          <div class="atm-step-item danger"><span class="step-badge">5</span><span><strong>★DCC 거절:</strong> 'Without Conversion' / 'No' 선택</span></div>
          <div class="atm-step-item warning"><span class="step-badge">6</span><span><strong>★★카드 먼저 회수!:</strong> 현금보다 카드가 먼저 나옵니다 (30초 내 회수)</span></div>
          <div class="atm-step-item"><span class="step-badge">7</span><span><strong>현금 & 영수증:</strong> 50만동 지폐 매수 확인 후 수령</span></div>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="atm-steps-box">
          <div class="atm-step-item"><span class="step-badge">1</span><span><strong>지폐 상태 확인:</strong> 2013년 이후 발행 빳빳한 $100 신권(낙서/찢김 없음) 제시</span></div>
          <div class="atm-step-item"><span class="step-badge">2</span><span><strong>환율 호가 확인:</strong> 매장 내 계산기에 직원이 찍어주는 환율 확인</span></div>
          <div class="atm-step-item"><span class="step-badge">3</span><span><strong>계수기 대조:</strong> 지폐 계수기 앞에서 금액 확인 후 즉시 가방 안쪽에 수납</span></div>
        </div>
      `;
    }
  }

  function renderCurrencyDccGuide(el) {
    if (!el) return;
    el.innerHTML = `
      <div class="dcc-warning-box">
        <div class="dcc-warning-header">
          <span>🛡️ DCC(원화 이중결제) 차단 필수 수칙</span>
        </div>
        <p>ATM 화면 또는 POS 단말기에서 통화 선택 창이 뜰 경우 <strong>반드시 [Without Conversion] 및 [VND]</strong>를 선택하세요. 원화(KRW) 선택 시 3~8% 불필요한 바가지 수수료가 발생합니다.</p>
      </div>
    `;
  }

  function renderCurrencyRatesBox(item, el) {
    if (!el) return;
    el.innerHTML = `
      <div class="exchange-perks-list">
        ${(item.exchangePerks || []).map(perk => `
          <div class="perk-item"><span class="perk-icon">✨</span><span>${escapeHtml(perk)}</span></div>
        `).join('')}
      </div>
    `;
  }

  function renderCurrencyLimitsBox(item, el) {
    if (!el) return;
    el.innerHTML = `
      <div class="limit-info-box">
        <div class="limit-row"><strong>인출/환전 한도:</strong> <span>${escapeHtml(item.withdrawalLimit || '제한 없음')}</span></div>
        <div class="limit-row"><strong>지원 통화/수단:</strong> <span>${(item.supportedCurrencies || []).map(c => escapeHtml(c)).join(', ')}</span></div>
      </div>
    `;
  }

  function renderCurrencyFacilities(item, el) {
    if (!el) return;
    el.innerHTML = (item.facilities || []).map(f => `
      <span class="facility-chip">✓ ${escapeHtml(f)}</span>
    `).join('');
  }

  function closeCurrencyModal() { closeDomainModal('currency'); }

  function initCurrencyCalculator() {
    const vndInputMain = document.getElementById('calcVndInputMain');
    const krwInputMain = document.getElementById('calcKrwInputMain');
    const vndHelperMain = document.getElementById('calcVndHelperMain');
    const krwHelperMain = document.getElementById('calcKrwHelperMain');
    const resetBtnMain = document.getElementById('calcResetBtnMain');

    const calcModalVnd = document.getElementById('calcVndInput');
    const calcModalKrw = document.getElementById('calcKrwInput');

    function updateFromVnd(vndValue) {
      const raw = String(vndValue).replace(/[^0-9]/g, '');
      const vnd = parseInt(raw, 10) || 0;
      const krw = Math.round(vnd * (currentBenchmarkRate / 100));

      if (vndInputMain) vndInputMain.value = vnd > 0 ? vnd.toLocaleString() : '';
      if (krwInputMain) krwInputMain.value = krw > 0 ? krw.toLocaleString() : '';
      if (vndHelperMain) vndHelperMain.textContent = formatVerbalVND(vnd);
      if (krwHelperMain) krwHelperMain.textContent = formatVerbalKRW(krw);

      if (calcModalVnd) calcModalVnd.value = vnd > 0 ? vnd.toLocaleString() : '';
      if (calcModalKrw) calcModalKrw.value = krw > 0 ? krw.toLocaleString() : '';
    }

    function updateFromKrw(krwValue) {
      const raw = String(krwValue).replace(/[^0-9]/g, '');
      const krw = parseInt(raw, 10) || 0;
      const vnd = Math.round((krw / (currentBenchmarkRate / 100)) / 1000) * 1000;

      if (krwInputMain) krwInputMain.value = krw > 0 ? krw.toLocaleString() : '';
      if (vndInputMain) vndInputMain.value = vnd > 0 ? vnd.toLocaleString() : '';
      if (vndHelperMain) vndHelperMain.textContent = formatVerbalVND(vnd);
      if (krwHelperMain) krwHelperMain.textContent = formatVerbalKRW(krw);

      if (calcModalVnd) calcModalVnd.value = vnd > 0 ? vnd.toLocaleString() : '';
      if (calcModalKrw) calcModalKrw.value = krw > 0 ? krw.toLocaleString() : '';
    }

    document.querySelectorAll('.calc-rate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rateVal = parseFloat(btn.dataset.rate);
        if (!isNaN(rateVal) && rateVal > 0) {
          currentBenchmarkRate = rateVal;
          document.querySelectorAll('.calc-rate-btn').forEach(b => {
            b.classList.toggle('active', b === btn);
            if (b === btn) {
              b.style.background = 'var(--success-mark)';
              b.style.color = 'white';
            } else {
              b.style.background = 'rgba(255,255,255,0.1)';
              b.style.color = 'var(--neutral-border)';
            }
          });

          const currentVnd = vndInputMain ? parseInt(vndInputMain.value.replace(/[^0-9]/g, ''), 10) || 0 : 0;
          if (currentVnd > 0) {
            updateFromVnd(currentVnd);
          } else {
            const currentKrw = krwInputMain ? parseInt(krwInputMain.value.replace(/[^0-9]/g, ''), 10) || 0 : 0;
            if (currentKrw > 0) updateFromKrw(currentKrw);
          }
        }
      });
    });

    vndInputMain?.addEventListener('input', (e) => updateFromVnd(e.target.value));
    krwInputMain?.addEventListener('input', (e) => updateFromKrw(e.target.value));

    document.querySelectorAll('.btn-calc-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const addVnd = parseInt(btn.dataset.addvnd, 10) || 0;
        const currentVnd = vndInputMain ? parseInt(vndInputMain.value.replace(/[^0-9]/g, ''), 10) || 0 : 0;
        const newVnd = currentVnd + addVnd;
        updateFromVnd(newVnd);
      });
    });

    resetBtnMain?.addEventListener('click', () => {
      if (vndInputMain) vndInputMain.value = '';
      if (krwInputMain) krwInputMain.value = '';
      if (vndHelperMain) vndHelperMain.textContent = '0 동 (0k VND)';
      if (krwHelperMain) krwHelperMain.textContent = '약 0원';
      if (calcModalVnd) calcModalVnd.value = '';
      if (calcModalKrw) calcModalKrw.value = '';
    });

    if (vndInputMain && !vndInputMain.value) {
      updateFromVnd(100000);
    }
  }

