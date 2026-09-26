  // --- 8.6 Domain Registry ---
  // 7개 도메인의 배선 차이를 한 테이블로 모은다. 탭을 추가할 때 손댈 곳을
  // 줄이는 것이 목적이며, 렌더/필터/모달 로직은 각 도메인 섹션에 그대로 있다.
  // activities만 접두어 규칙이 다르다(actCategory / wishlist / detailModal 등) —
  // 접두어로 유도하지 말고 이 표의 값을 그대로 쓸 것.
  const DOMAINS = [
    {
      key: 'activities',
      render: () => renderCards(),
      categoryNavId: 'activityCategoryNav', tagChipsId: 'activityTagChips',
      catAttr: 'category', tagAttr: 'tag',
      catField: 'actCategory', tagField: 'actTag',
      notesField: 'notes', notesKey: 'nha_trang_notes',
      wishField: 'wishlist', wishKey: 'nha_trang_wishlist',
      wishToastAdd: '♥ 위시리스트에 저장되었습니다!', wishToastRemove: '위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'modalHeartBtn',
      hasOpenHours: false, hasPriceSort: true, showViewToggle: true,
      activeModalField: 'activeModalActivity',
      modalId: 'detailModal', modalCloseBtnId: 'modalCloseBtn', closeModal: () => closeActivityModal(),
      noteInputIds: ['modalNoteInput', 'noteInput'], noteStatusIds: ['modalNoteStatus', 'noteStatus'],
      copyAddressBtnId: null,
      gridSectionId: 'activitiesGridSection',
      placeholder: '액티비티 검색 (예: 스노클링, 마사지, 인생샷, 아이리조트)...',
      heroTitle: '나트랑 힐링 여행 가이드 🌴',
      heroSubtitle: '호핑, 스파, 빈원더스, 선셋 크루즈 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">✨</span> 엄선된 32개 리얼 액티비티</span>
          <span class="hero-stat-pill"><span class="icon">💆</span> 프라이빗 스파 & 머드온천</span>
          <span class="hero-stat-pill"><span class="icon">⛵</span> 럭셔리 선셋 크루즈 & 호핑</span>
          <span class="hero-stat-pill"><span class="icon">🏜️</span> 달랏 / 무이네 근교투어</span>
        `
    },
    {
      key: 'gourmet',
      render: () => renderGourmets(),
      categoryNavId: 'gourmetCategoryNav', tagChipsId: 'gourmetTagChips',
      catAttr: 'gcategory', tagAttr: 'gtag',
      catField: 'gourmetCategory', tagField: 'gourmetTag',
      notesField: 'gourmetNotes', notesKey: 'nha_trang_gourmet_notes',
      wishField: 'gourmetWishlist', wishKey: 'nha_trang_gourmet_wishlist',
      wishToastAdd: '♥ 맛집 위시리스트에 저장되었습니다!', wishToastRemove: '맛집 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'gourmetModalHeartBtn',
      hasOpenHours: true, hasPriceSort: true, showViewToggle: true,
      activeModalField: 'activeModalGourmet',
      modalId: 'gourmetModal', modalCloseBtnId: 'gourmetModalCloseBtn', closeModal: () => closeGourmetModal(),
      noteInputIds: ['gourmetNoteInput'], noteStatusIds: ['gourmetNoteStatus'],
      copyAddressBtnId: 'gourmetCopyAddressBtn',
      gridSectionId: 'gourmetGridSection',
      placeholder: '로컬 맛집 & 메뉴 검색 (예: 반쎄오, 뚝배기쌀국수, 탄스엉, 망고)...',
      heroTitle: '나트랑 현지인 찐 로컬 맛집 🍜',
      heroSubtitle: '구글 지도 실시간 평점 & 리뷰 검증 완료 현지 맛집 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">📍</span> Google Maps 실시간 연동 검증</span>
          <span class="hero-stat-pill"><span class="icon">🔥</span> 현지인 & 스페셜티 113곳</span>
          <span class="hero-stat-pill"><span class="icon">🦞</span> 바가지 없는 해산물 정찰제</span>
          <span class="hero-stat-pill"><span class="icon">🥭</span> 특A급 생망고 & 솔트커피</span>
        `
    },
    {
      key: 'stays',
      render: () => renderStays(),
      categoryNavId: 'stayCategoryNav', tagChipsId: 'stayTagChips',
      catAttr: 'scategory', tagAttr: 'stag',
      catField: 'stayCategory', tagField: 'stayTag',
      notesField: 'stayNotes', notesKey: 'nha_trang_stay_notes',
      wishField: 'stayWishlist', wishKey: 'nha_trang_stay_wishlist',
      wishToastAdd: '♥ 숙소 위시리스트에 저장되었습니다!', wishToastRemove: '숙소 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'stayModalHeartBtn',
      hasOpenHours: false, hasPriceSort: true, showViewToggle: true,
      activeModalField: 'activeModalStay',
      modalId: 'stayModal', modalCloseBtnId: 'stayModalCloseBtn', closeModal: () => closeStayModal(),
      noteInputIds: ['stayNoteInput'], noteStatusIds: ['stayNoteStatus'],
      copyAddressBtnId: 'stayCopyAddressBtn',
      gridSectionId: 'staysGridSection',
      placeholder: '숙소명, 지역, 편의시설 검색 (예: 인터컨티넨탈, 풀빌라, 인피니티풀, 야시장)...',
      heroTitle: '나트랑 테마별 추천 숙소 & 리조트 🏨',
      heroSubtitle: '입국 웰컴 0.5박부터 5성급 럭셔리, 감성 풀빌라, 출국 전 0.5박 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">✨</span> 4개 테마별 엄선 24선</span>
          <span class="hero-stat-pill"><span class="icon">👑</span> 5성급 럭셔리 호캉스 & 리조트</span>
          <span class="hero-stat-pill"><span class="icon">🏊</span> 프라이빗 단독 온수/인피니티 풀빌라</span>
          <span class="hero-stat-pill"><span class="icon">💰</span> 5만원 이하 시내 중심 0.5박 알짜 호텔</span>
        `
    },
    {
      key: 'hoteldining',
      render: () => renderHotelDinings(),
      categoryNavId: 'hoteldiningCategoryNav', tagChipsId: 'hoteldiningTagChips',
      catAttr: 'hdcategory', tagAttr: 'hdtag',
      catField: 'hoteldiningCategory', tagField: 'hoteldiningTag',
      notesField: 'hoteldiningNotes', notesKey: 'nha_trang_hoteldining_notes',
      wishField: 'hoteldiningWishlist', wishKey: 'nha_trang_hoteldining_wishlist',
      wishToastAdd: '♥ 호텔 다이닝 위시리스트에 저장되었습니다!', wishToastRemove: '호텔 다이닝 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'hoteldiningModalHeartBtn',
      hasOpenHours: true, hasPriceSort: true, showViewToggle: true,
      activeModalField: 'activeModalHoteldining',
      modalId: 'hoteldiningModal', modalCloseBtnId: 'hoteldiningModalCloseBtn', closeModal: () => closeHotelDiningModal(),
      noteInputIds: ['hoteldiningNoteInput'], noteStatusIds: ['hoteldiningNoteStatus'],
      copyAddressBtnId: 'hoteldiningCopyAddressBtn',
      gridSectionId: 'hoteldiningGridSection',
      placeholder: '호텔 다이닝, 뷔페, 메뉴 검색 (예: 쿡북카페, 피스트, 바카로, 씨푸드BBQ, 조식)...',
      heroTitle: '나트랑 5성급 호텔 시그니처 다이닝 🍽️',
      heroSubtitle: '인터내셔널 조식·디너 뷔페부터 오션뷰 씨푸드 BBQ, 파인다이닝 & 루프탑 바 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">🏨</span> 5성급 호텔 시그니처 24곳</span>
          <span class="hero-stat-pill"><span class="icon">🦞</span> 랍스터 & 해산물 무제한 BBQ</span>
          <span class="hero-stat-pill"><span class="icon">🌅</span> 나트랑 비치 파노라마 오션뷰</span>
          <span class="hero-stat-pill"><span class="icon">🍸</span> 45층 360도 스카이라운지 바</span>
        `
    },
    {
      key: 'spa',
      render: () => renderSpa(),
      categoryNavId: 'spaCategoryNav', tagChipsId: 'spaTagChips',
      catAttr: 'spacategory', tagAttr: 'spatag',
      catField: 'spaCategory', tagField: 'spaTag',
      notesField: 'spaNotes', notesKey: 'nha_trang_spa_notes',
      wishField: 'spaWishlist', wishKey: 'nha_trang_spa_wishlist',
      wishToastAdd: '❤️ 스파 위시리스트에 담겼습니다!', wishToastRemove: '🤍 스파 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'spaModalHeartBtn',
      hasOpenHours: true, hasPriceSort: true, showViewToggle: true,
      activeModalField: 'activeModalSpa',
      modalId: 'spaModal', modalCloseBtnId: 'spaModalCloseBtn', closeModal: () => closeSpaModal(),
      noteInputIds: ['spaNoteInput'], noteStatusIds: ['spaNoteStatus'],
      copyAddressBtnId: 'spaCopyAddressBtn',
      gridSectionId: 'spaGridSection',
      placeholder: '스파, 마사지, 이발관, 머드온천 검색 (예: 센스파, 픽업, 핫스톤, 아이리조트)...',
      heroTitle: '나트랑 힐링 스파 & 마사지 💆',
      heroSubtitle: '5성급 호텔 스파부터 가성비 로컬 마사지, 황제 이발관, 픽드랍·팁 완벽 정리',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">💆</span> 엄선된 24선 힐링 스파</span>
          <span class="hero-stat-pill"><span class="icon">🚗</span> 무료 픽업·샌딩 & 짐보관</span>
          <span class="hero-stat-pill"><span class="icon">💵</span> 코스별 60/90/120분 정찰 시세</span>
          <span class="hero-stat-pill"><span class="icon">♨️</span> 시그니처 머드 온천 & 바버샵</span>
        `
    },
    {
      key: 'shopping',
      render: () => renderShopping(),
      categoryNavId: 'shoppingCategoryNav', tagChipsId: 'shoppingTagChips',
      catAttr: 'shopcategory', tagAttr: 'shoptag',
      catField: 'shoppingCategory', tagField: 'shoppingTag',
      notesField: 'shoppingNotes', notesKey: 'nha_trang_shopping_notes',
      wishField: 'shoppingWishlist', wishKey: 'nha_trang_shopping_wishlist',
      wishToastAdd: '♥ 쇼핑 위시리스트에 저장되었습니다!', wishToastRemove: '쇼핑 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'shoppingModalHeartBtn',
      hasOpenHours: true, hasPriceSort: true, showViewToggle: true,
      activeModalField: 'activeModalShopping',
      modalId: 'shoppingModal', modalCloseBtnId: 'shoppingModalCloseBtn', closeModal: () => closeShoppingModal(),
      noteInputIds: ['shoppingNoteInput'], noteStatusIds: ['shoppingNoteStatus'],
      copyAddressBtnId: 'shoppingCopyAddressBtn',
      gridSectionId: 'shoppingGridSection',
      placeholder: '쇼핑 스팟, 브랜드, 품목 검색 (예: 켄켄크록스, 담시장, 미스앤미스터, 스투시, 탑젤리)...',
      heroTitle: '나트랑 짝퉁 & 패션 쇼핑 가이드 🛍️',
      heroSubtitle: '담시장, 야시장, 미러급 부티크부터 실전 흥정 시세표 & 세관 유의사항 총정리',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">👑</span> 미러급 & SA급 하이엔드 샵</span>
          <span class="hero-stat-pill"><span class="icon">🏷️</span> 품목별 실전 흥정 적정가 가이드</span>
          <span class="hero-stat-pill"><span class="icon">❄️</span> 에어컨 완비 & 한국 계좌이체 매장</span>
          <span class="hero-stat-pill"><span class="icon">✈️</span> 한국 세관 통관 & 주의사항 완벽 대비</span>
        `
    },
    {
      key: 'currency',
      render: () => renderCurrency(),
      categoryNavId: 'currencyCategoryNav', tagChipsId: 'currencyTagChips',
      catAttr: 'currcategory', tagAttr: 'currtag',
      catField: 'currencyCategory', tagField: 'currencyTag',
      notesField: 'currencyNotes', notesKey: 'nha_trang_currency_notes',
      wishField: 'currencyWishlist', wishKey: 'nha_trang_currency_wishlist',
      wishToastAdd: '❤️ 환전/ATM 위시리스트에 담겼습니다!', wishToastRemove: '🤍 환전/ATM 위시리스트에서 제외되었습니다.',
      modalHeartBtnId: 'currencyModalHeartBtn',
      // 환전소/ATM에는 가격이 없어 가격 정렬을 그대로 두면 선택해도 순서가 안 바뀐다.
      hasOpenHours: true, hasPriceSort: false, showViewToggle: true,
      activeModalField: 'activeModalCurrency',
      modalId: 'currencyModal', modalCloseBtnId: 'currencyModalCloseBtn', closeModal: () => closeCurrencyModal(),
      noteInputIds: ['currencyNoteInput'], noteStatusIds: ['currencyNoteStatus'],
      copyAddressBtnId: 'currencyCopyAddressBtn',
      gridSectionId: 'currencyGridSection',
      placeholder: '환전소, 은행명, 카드사 검색 (예: VPBank, TPBank, 김청, 트래블로그, 100달러)...',
      heroTitle: '나트랑 환전 & 수수료 무료 ATM 가이드 💱',
      heroSubtitle: '5대 여행 체크카드 맞춤 수수료 0원 ATM & 실전 환율 계산기',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">🏧</span> 5대 카드 수수료 0원 ATM 8곳</span>
          <span class="hero-stat-pill"><span class="icon">💎</span> 김청·김빈 100달러 우대 환전</span>
          <span class="hero-stat-pill"><span class="icon">🛡️</span> DCC 이중환전 차단 완벽 가이드</span>
          <span class="hero-stat-pill"><span class="icon">💱</span> 실시간 양방향 환율 계산기</span>
        `
    },
    {
      key: 'curation',
      render: () => renderCuration(),
      categoryNavId: 'curationCategoryNav', tagChipsId: 'curationTagChips',
      catAttr: 'curcategory', tagAttr: 'curtag',
      catField: 'curationCategory', tagField: 'curationTag',
      notesField: null, notesKey: null,
      wishField: null, wishKey: null,
      wishToastAdd: null, wishToastRemove: null,
      modalHeartBtnId: null,
      hasOpenHours: false, hasPriceSort: false, showViewToggle: false,
      activeModalField: null,
      modalId: null, modalCloseBtnId: null, closeModal: () => {},
      noteInputIds: [], noteStatusIds: [],
      copyAddressBtnId: null,
      gridSectionId: 'curationGridSection',
      placeholder: '상황별 코스, 장소, 키워드 검색 (예: 체크아웃, 머드온천, 세일링클럽, 선셋크루즈)...',
      heroTitle: '나트랑 맞춤 상황별 추천 코스 🎯',
      heroSubtitle: '마지막 날 체크아웃 투어부터 우천 실내, 심야 핫스팟, 커플 힐링 코스 큐레이션',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">✈️</span> 밤 11시 비행기 체크아웃 투어</span>
          <span class="hero-stat-pill"><span class="icon">🌧️</span> 우천 대비 100% 실내 힐링 코스</span>
          <span class="hero-stat-pill"><span class="icon">🌙</span> 밤 10시 이후 심야 핫스팟 02시</span>
          <span class="hero-stat-pill"><span class="icon">💑</span> 커플 & 로맨틱 파인다이닝 크루즈</span>
        `
    },
    {
      key: 'guide',
      render: () => renderGuide(),
      categoryNavId: 'guideCategoryNav', tagChipsId: 'guideTagChips',
      catAttr: 'guidecategory', tagAttr: 'guidetag',
      catField: 'guideCategory', tagField: 'guideTag',
      notesField: null, notesKey: null,
      // 허브 탭이라 찜·노트·리스트/그리드 개념이 없다.
      wishField: null, wishKey: null,
      wishToastAdd: null, wishToastRemove: null,
      modalHeartBtnId: null,
      hasOpenHours: false, hasPriceSort: true, showViewToggle: false,
      activeModalField: 'activeModalFlashcard',
      modalId: 'flashcardModal', modalCloseBtnId: 'flashcardModalCloseBtn', closeModal: () => closeFlashcardModal(),
      noteInputIds: [], noteStatusIds: [],
      copyAddressBtnId: null,
      gridSectionId: 'guideGridSection',
      placeholder: '가이드 검색 (예: 공항, 그랩, 롯데마트, 스멕타, 고수 빼주세요)...',
      heroTitle: '나트랑 여행 꿀팁 & 생존 킷 💡',
      heroSubtitle: '교통·그랩 가이드, 롯데마트 30대 시세표, 응급 상비약/병원, 원터치 베트남어',
      heroPills: `
          <span class="hero-stat-pill"><span class="icon">🚗</span> 깜란공항 & 그랩 완벽 가이드</span>
          <span class="hero-stat-pill"><span class="icon">🛒</span> 롯데마트 30대 기념품 시세표</span>
          <span class="hero-stat-pill"><span class="icon">💊</span> 응급 상비약 10종 & 24시 병원</span>
          <span class="hero-stat-pill"><span class="icon">🗣️</span> 원터치 생존 베트남어 21종</span>
        `
    }
  ];

  function getDomain(key) {
    return DOMAINS.find(d => d.key === key) || DOMAINS[0];
  }

  function renderCurrentTab() {
    getDomain(state.currentTab).render();
  }


