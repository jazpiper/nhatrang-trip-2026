/**
 * Nha Trang Activity Dataset
 * Comprehensive, Real, Curated for Couple's Trip to Nha Trang, Vietnam.
 * Contains 24+ high quality, authentic Nha Trang activities & experiences.
 */

const NHA_TRANG_ACTIVITIES = [
  // ==========================================
  // 1. Marine & Island Hopping Tours
  // ==========================================
  {
    id: "act-01",
    title: "혼문섬 & 랑섬 럭셔리 스피드보트 호핑투어",
    titleEn: "Hon Mun Marine Protected Area Luxury Snorkeling & Island Tour",
    category: "hopping",
    categoryLabel: "호핑 & 스노클링",
    badge: "인기 No.1",
    rating: 4.95,
    reviewCount: 420,
    duration: "반일 (08:30 ~ 14:30, 약 6시간)",
    bestTime: "오전 출발 (바다 시야 가장 맑음)",
    location: "혼문섬 해양생물보호구역 & 랑섬",
    googleMapQuery: "Hon Mun Island Nha Trang",
    priceVnd: 890000,
    pricePer: "1인 기준 (런치 & 픽업 포함)",
    tags: ["인기추천", "인생샷", "스노클링", "해산물바비큐"],
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "에메랄드빛 혼문섬 산호초 지대 스노클링과 패들보드, 선상 푸짐한 현지식 해산물 바비큐 런치까지 즐기는 필수 코스!",
    included: [
      "호텔 왕복 전용 픽업 & 샌딩 차량",
      "초고속 스피드보트 & 구명조끼 / 스노클링 장비 일체",
      "혼문섬 해양보호구역 입장료",
      "선상/해변 현지식 해산물 런치 & 시원한 음료",
      "SUP 패들보드 무료 대여 및 수중 사진 촬영"
    ],
    notIncluded: ["개인 스쿠버다이빙 추가 옵션", "개인 타월 및 매너 팁"],
    whatToBring: ["래시가드/수영복 (미리 착용)", "아쿠아슈즈", "방수팩", "선크림 & 선글라스", "비치타월"],
    coupleTip: "아침 일찍 출발하는 보트일수록 혼문섬 시야가 투명하고 사람이 적어요. 패들보드에서 둘이 마주보고 찍는 사진이 인생샷 명당입니다!",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=nhatrang%20snorkeling"
  },
  {
    id: "act-02",
    title: "혼문섬 수중 씨워커(Sea Walker) 산호초 해저 산책",
    titleEn: "Hon Mun Undersea Helmet Diving & Coral Reef Sea Walker",
    category: "hopping",
    categoryLabel: "호핑 & 스노클링",
    badge: "이색 체험",
    rating: 4.88,
    reviewCount: 260,
    duration: "약 30분 수중 체험 (호핑투어 연계)",
    bestTime: "오전 10:00 ~ 11:30",
    location: "혼문섬 해상 바지선 플랫폼",
    googleMapQuery: "Hon Mun Nha Trang",
    priceVnd: 750000,
    pricePer: "1인 헬멧 다이빙 체험 기준",
    tags: ["수영못해도OK", "수중인생샷", "물고기먹이주기", "이색체험"],
    images: [
      "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "특수 헬멧을 쓰고 얼굴에 물 한 방울 묻히지 않은 채 수심 5m 바닷속을 직접 걸으며 열대어 떼와 산호를 만나는 마법 같은 경험!",
    included: [
      "최신식 산소 공급 헬멧 장비 & 안전 다이버 1:1 밀착 가이드",
      "수중 물고기 먹이주기 체험",
      "수중 사진 및 동영상 촬영 파일 제공"
    ],
    notIncluded: ["호핑투어 선박 이동 요금 (호핑 연계 필수)"],
    whatToBring: ["수영복 또는 래시가드", "수중용 헤어밴드 (머리 정리용)"],
    coupleTip: "수영을 전혀 못하거나 렌즈/화장을 한 상태에서도 머리가 젖지 않아 여행자분들의 만족도가 매우 높습니다! 둘이 손잡고 수중에서 하트 포즈를 취해보세요.",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=nha%20trang%20sea%20walker"
  },
  {
    id: "act-03",
    title: "미니비치(Mini Beach) 프라이빗 휴양 & 패러세일링",
    titleEn: "Mini Beach Private Paradise & Ocean Parasailing",
    category: "hopping",
    categoryLabel: "호핑 & 해양 레저",
    badge: "휴양 핫플",
    rating: 4.92,
    reviewCount: 310,
    duration: "반일 ~ 자유 일정 (약 4~5시간)",
    bestTime: "오전 09:30 ~ 13:30 (에메랄드 바다)",
    location: "나트랑 미니비치 (선착장에서 보트 15분)",
    googleMapQuery: "Mini Beach Nha Trang",
    priceVnd: 650000,
    pricePer: "입장료 + 보트 + 썬베드 + 2인 패러세일링",
    tags: ["에메랄드바다", "패러세일링", "선베드힐링", "인생샷"],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "하얗고 부드러운 백사장과 야자수 아래 선베드에서 칵테일을 마시고, 둘이 함께 하늘로 솟아오르는 커플 패러세일링!",
    included: [
      "미니비치 왕복 스피드보트",
      "미니비치 섬 입장료 & 최고급 비치 선베드 이용",
      "2인 동반 탠덤 패러세일링 1회 탑승권",
      "신선한 웰컴 드링크"
    ],
    notIncluded: ["제트스키/바나나보트 개별 추가 옵션", "비치 레스토랑 개별 주문"],
    whatToBring: ["선글라스 & 비치 모자", "예쁜 비치웨어/수영복", "비치타월"],
    coupleTip: "중국 단체 관광객이 거의 없는 프라이빗한 비치라 조용히 사진 찍고 힐링하기에 최적입니다. 2인 동반 패러세일링 시 공중에서 내려다보는 나트랑 바다는 압권입니다.",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=mini%20beach%20nhatrang"
  },
  {
    id: "act-04",
    title: "혼땀섬(Hon Tam) 럭셔리 머드온천 & 비치 리조트 데이투어",
    titleEn: "Hon Tam Island Luxury Mud Bath & Resort Day Pass",
    category: "mudbath",
    categoryLabel: "머드 온천 & 섬투어",
    badge: "최고급 머드",
    rating: 4.93,
    reviewCount: 380,
    duration: "반일 (09:00 ~ 14:30)",
    bestTime: "오전 10:00 ~ 13:00",
    location: "혼땀섬 (Hon Tam Resort Pier)",
    googleMapQuery: "Hon Tam Mud Bath Nha Trang",
    priceVnd: 550000,
    pricePer: "1인 케이블보트 + 머드배스 + 뷔페 포함",
    tags: ["섬속머드온천", "인피니티풀", "씨푸드뷔페", "호텔급시설"],
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "섬 전체가 리조트로 조성된 혼땀섬에서 바다를 굽어보며 즐기는 테라스 머드 배스와 초대형 바다 전망 인피니티 풀!",
    included: [
      "혼땀섬 왕복 고속 보트 티켓",
      "프라이빗 스톤 머드 욕조 (20분)",
      "하이드로 테라피 폭포수 마사지 & 자쿠지 온천",
      "오션뷰 인피니티 수영장 & 선베드 자유 이용",
      "리조트 풍성한 인터내셔널 런치 뷔페"
    ],
    notIncluded: ["스파 마사지 트리트먼트 추가", "개인 주류 주문"],
    whatToBring: ["어두운 색상 수영복", "선크림", "방수 파우치"],
    coupleTip: "시내 육지 머드온천(아이리조트)과 달리 바다를 눈앞에 두고 산중턱 테라스에서 받는 머드온천이라 뷰가 훨씬 웅장합니다. 점심 뷔페 퀄리티도 매우 우수해요!",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=hon%20tam%20mud%20bath"
  },
  {
    id: "act-05",
    title: "디엡손(Diep Son) 섬 바닷길 모세의 기적 & 도크렛 비치 투어",
    titleEn: "Diep Son Island Underwater Sandbar & Doc Let Beach Day Tour",
    category: "hopping",
    categoryLabel: "스페셜 섬 투어",
    badge: "인스타 성지",
    rating: 4.86,
    reviewCount: 190,
    duration: "종일 (08:00 ~ 16:30, 약 8시간)",
    bestTime: "오전 썰물 시간대 (바닷길 열림)",
    location: "반퐁 만 디엡손 섬 & 도크렛 화이트비치",
    googleMapQuery: "Diep Son Island Khanh Hoa",
    priceVnd: 980000,
    pricePer: "1인 전용 차량 + 보트 + 런치 포함",
    tags: ["바닷길갈라짐", "모세의기적", "도크렛화이트비치", "인생샷"],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "썰물 때 바다 한가운데서 드러나는 800m 천연 모래 바닷길을 걷는 환상적인 경험과 베트남의 몰디브라 불리는 도크렛 해변!",
    included: [
      "호텔 왕복 전용 에어컨 차량",
      "디엡손 섬 왕복 스피드보트",
      "디엡손 섬 바닷길 도보 횡단 및 자유 포토타임",
      "도크렛 비치 리조트 입장 및 해산물 점심 식사",
      "생수 및 가이드"
    ],
    notIncluded: ["해양 스포츠 개인 이용료", "개인 경비"],
    whatToBring: ["카메라/스마트폰 완충", "하늘거리는 원피스", "모자 & 선글라스", "아쿠아슈즈"],
    coupleTip: "밀물과 썰물 시간을 맞춰 바다 위를 걷는 듯한 신비로운 사진을 남길 수 있습니다. 도크렛 비치의 모래는 밀가루처럼 부드러워 걷기만 해도 힐링됩니다.",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=diep%20son%20island"
  },
  {
    id: "act-06",
    title: "나트랑 밤바다 한치·오징어 배 낚시 & 선상 라면 투어",
    titleEn: "Nha Trang Night Squid Fishing Tour & Fresh Seafood Ramen",
    category: "nightlife",
    categoryLabel: "나이트 & 낚시",
    badge: "손맛 보장",
    rating: 4.82,
    reviewCount: 160,
    duration: "저녁 (17:30 ~ 21:00, 약 3.5시간)",
    bestTime: "밤 18:30 이후 (집어등 점등)",
    location: "나트랑 만 연안 낚시 포인트",
    googleMapQuery: "Cau Da Port Nha Trang",
    priceVnd: 550000,
    pricePer: "1인 낚시장비 + 선상야식 포함",
    tags: ["손맛체험", "선상라면", "오징어회", "밤바다낭만"],
    images: [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "달빛 아래 집어등을 밝힌 배 위에서 즐기는 짜릿한 오징어 낚시 손맛과 직접 잡은 오징어를 넣고 끓여주는 얼큰한 해물라면!",
    included: [
      "호텔 픽업 및 샌딩",
      "전용 낚시선박 탑승 & 집어등 조명",
      "전문 낚시대 & 루어 미끼 일체 제공",
      "선상 즉석 오징어회/숙회 & 해물 오징어 라면 야식",
      "맥주 및 음료 1캔 제공"
    ],
    notIncluded: ["멀미약 (멀미 심한 분은 사전 복용 권장)"],
    whatToBring: ["얇은 바람막이 (밤바다 바람 대비)", "편한 슬리퍼"],
    coupleTip: "초보자도 현지 스태프가 채비와 챔질 타이밍을 친절하게 다 알려줍니다. 갓 잡은 투명한 한치 회와 밤바다에서 먹는 라면의 맛은 잊을 수 없습니다!",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=nha%20trang%20squid%20fishing"
  },

  // ==========================================
  // 2. Mud Baths, Spas & Wellness
  // ==========================================
  {
    id: "act-07",
    title: "아이리조트(I-Resort) 프라이빗 머드온천 & 미네랄 워터파크",
    titleEn: "I-Resort Luxury Mineral Mud Bath & Hot Spring Waterpark",
    category: "mudbath",
    categoryLabel: "머드 온천 & 스파",
    badge: "힐링 1위",
    rating: 4.91,
    reviewCount: 520,
    duration: "약 3~4시간 (자유 일정)",
    bestTime: "오후 14:00 ~ 17:00 또는 오전 09:30",
    location: "나트랑 북부 (시내 중심에서 차량 20분)",
    googleMapQuery: "I-Resort Nha Trang",
    priceVnd: 450000,
    pricePer: "VIP 프라이빗 욕조 (2인 기준)",
    tags: ["힐링스파", "피부미용", "온천수영장", "비오는날강추"],
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "매끄럽고 따뜻한 천연 머드풀에서 여행의 피로를 녹이고, 인공 폭포수 미네랄 수영장과 자쿠지, 워터 슬라이드를 즐기는 대표 명소.",
    included: [
      "프라이빗 우드 욕조 천연 미네랄 머드 배스 (20~30분)",
      "하이드로테라피 마사지 샤워 & 온천 자쿠지",
      "대형 미네랄 온천 수영장 & 인공 폭포 자유 이용",
      "워터파크 슬라이드 & 선베드 이용",
      "타월 및 생수 제공"
    ],
    notIncluded: ["시내 왕복 그랩 요금 (약 7~8만 동)", "식음료 및 개인 마사지"],
    whatToBring: ["짙은 색 또는 편하게 입을 수영복 (머드 착색 대비)", "갈아입을 옷", "방수팩"],
    coupleTip: "일반 공용풀 대신 꼭 '프라이빗 머드 욕조'로 선택하세요! 둘만의 프라이빗한 정원에서 따뜻하게 머드를 즐긴 후 수영장 썬베드에서 마시는 코코넛 음료는 최고입니다.",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=i-resort%20nhatrang"
  },
  {
    id: "act-08",
    title: "센스파(Sen Spa) 시그니처 핫스톤 & 뱀부 아로마 마사지",
    titleEn: "Sen Spa Signature 90min Hot Stone & Bamboo Body Massage",
    category: "spa",
    categoryLabel: "스파 & 웰니스",
    badge: "여행자 베스트",
    rating: 4.97,
    reviewCount: 480,
    duration: "90분 ~ 120분 (코스별 선택)",
    bestTime: "저녁 18:30 ~ 21:00 (하루 일정 마무리)",
    location: "나트랑 시내 중심가 (야시장 도보 7분)",
    googleMapQuery: "Sen Spa Nha Trang",
    priceVnd: 580000,
    pricePer: "90분 핫스톤 코스 1인 기준",
    tags: ["호텔급시설", "프라이빗 커플룸", "웰컴티", "사전예약필수"],
    images: [
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "자연 친화적 플랜테리어와 은은한 레몬그라스 향기 속에서 전문 테라피스트의 정성 어린 손길로 힐링하는 최상급 커플 스파.",
    included: [
      "웰컴 허브티 & 아로마 족욕 풋 스파",
      "프라이빗 커플 VIP 전용 마사지 룸",
      "고급 천연 에센셜 오일 & 따뜻한 현무암 핫스톤 케어",
      "마사지 후 수제 요거트 & 열대 과일 디저트 제공"
    ],
    notIncluded: ["테라피스트 팁 (선택 사항, 보통 5~10만 동)"],
    whatToBring: ["가벼운 옷차림 (스파 가운 제공)"],
    coupleTip: "카카오톡 채널로 2~3일 전 커플룸 사전 예약은 필수입니다! 호핑투어나 많이 걸은 날 저녁에 일정 잡아두면 하루의 피로가 싹 풀립니다.",
    bookingUrl: "https://senspanhatrang.com"
  },
  {
    id: "act-09",
    title: "탑바(Thap Ba) 머드온천 & 프라이빗 허브 미네랄 테라피",
    titleEn: "Thap Ba Hot Springs Original Mud Bath & Herbal Jacuzzi",
    category: "mudbath",
    categoryLabel: "머드 온천 & 스파",
    badge: "원조 머드",
    rating: 4.83,
    reviewCount: 340,
    duration: "2.5 ~ 3시간",
    bestTime: "오전 09:30 ~ 12:00",
    location: "포나가르 사원 인근 (시내 북쪽 15분)",
    googleMapQuery: "Thap Ba Mud Bath Nha Trang",
    priceVnd: 380000,
    pricePer: "2인 프라이빗 욕조 + 허브탕",
    tags: ["원조머드온천", "피부진정", "포나가르연계", "가성비온천"],
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "울창한 유칼립투스 숲속에서 즐기는 나트랑 최초의 원조 머드 스파. 포나가르 사원 관광 후 바로 이어지는 완벽한 동선!",
    included: [
      "프라이빗 우드 미네랄 머드 배스 (20분)",
      "천연 한방 허브 온천탕 (30분)",
      "온천 자쿠지 & 폭포수 수영장 이용"
    ],
    notIncluded: ["수영복 대여료 (개인 지참 권장)"],
    whatToBring: ["검은색 수영복", "샤워용품 (간단 어메니티 구비)"],
    coupleTip: "포나가르 참탑 구경 후 차로 5분 거리라 오전에 사원 들렀다가 바로 머드 온천으로 이동하는 루트를 강력 추천합니다.",
    bookingUrl: "https://tambunthapba.vn"
  },
  {
    id: "act-10",
    title: "로얄 살롱(Royal Salon) 베트남 황제식 토탈 헤드스파 & 힐링",
    titleEn: "Royal Salon Luxury Vietnamese Head Spa, Ear Cleaning & Facial",
    category: "spa",
    categoryLabel: "스파 & 이발관 케어",
    badge: "이색 힐링",
    rating: 4.92,
    reviewCount: 310,
    duration: "90분 코스",
    bestTime: "낮 13:00 ~ 15:00 (시원한 실내 휴식)",
    location: "나트랑 시내 번화가 (CCCP커피 1호점 맞은편)",
    googleMapQuery: "Royal Salon Nha Trang",
    priceVnd: 420000,
    pricePer: "90분 풀코스 1인 기준 (약 2.3만원)",
    tags: ["귀청소", "오이팩세안", "두피샴푸스파", "만족도1위"],
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "발 세척부터 면도, 오이 마사지팩, 섬세한 전문 귀 청소, 손발톱 케어, 시원한 두피 스파와 전신 스트레칭까지 한 번에 끝내는 베트남식 풀케어!",
    included: [
      "아로마 풋스파 및 각질 케어",
      "페이스 딥클렌징 & 천연 오이 생팩 마사지",
      "전문 조명 도구 귀 청소 (소름 돋는 개운함)",
      "두피 지압 & 베트남식 시원한 샴푸 및 헤어 드라이",
      "상체 스트레칭"
    ],
    notIncluded: ["개인 매너 팁 (보통 5만동 내외)"],
    whatToBring: ["가벼운 복장"],
    coupleTip: "여행자분들이 여행 중 가장 만족스러워하는 코스 중 하나입니다! 동행과 함께 나란히 누워 케어 받으면 더위에 지친 몸과 두피가 완전히 리셋됩니다.",
    bookingUrl: "https://www.google.com/maps/search/Royal+Salon+Nha+Trang"
  },
  {
    id: "act-11",
    title: "망고 네일 & 패디큐어 프리미엄 젤아트 케어",
    titleEn: "Mango Nail & Spa Premium Gel Nail Art & Foot Care",
    category: "spa",
    categoryLabel: "뷰티 & 네일아트",
    badge: "힐링 케어",
    rating: 4.96,
    reviewCount: 450,
    duration: "60분 ~ 90분",
    bestTime: "여행 1~2일 차 오전/오후",
    location: "나트랑 시내 중심가",
    googleMapQuery: "Mango Nail Nha Trang",
    priceVnd: 350000,
    pricePer: "이달의 아트 젤네일 1인 기준 (약 1.9만원)",
    tags: ["한국1/3가격", "이달의아트", "휴양지네일", "에어컨빵빵"],
    images: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "한국 강남 퀄리티의 트렌디한 이달의 아트 젤네일과 패디를 한국의 1/3도 안 되는 착한 가격에 예쁘게 받는 힐링 케어 필수 코스!",
    included: [
      "손톱/발톱 기본 케어 & 큐티클 정리",
      "프리미엄 젤 컬러 & 트로피컬 휴양지 아트 디자인",
      "시원한 생과일 망고 주스 서비스",
      "동행인을 위한 발 마사지 또는 편안한 소파 대기 공간"
    ],
    notIncluded: ["파츠 추가 옵션 (소액)"],
    whatToBring: ["원하는 네일 디자인 사진 (캡처본)"],
    coupleTip: "여행 첫날이나 둘째 날 오전에 네일/패디를 받으면 남은 여행 내내 바다와 리조트에서 찍는 손/발 사진이 훨씬 화사하고 예쁘게 나옵니다!",
    bookingUrl: "https://www.google.com/maps/search/Mango+Nail+Nha+Trang"
  },
  {
    id: "act-12",
    title: "스완나 스파(Suanna Spa) 앤 풋케어 & 공항 샌딩 패키지",
    titleEn: "Suanna Spa & Foot Reflexology with Airport Drop-off Service",
    category: "spa",
    categoryLabel: "스파 & 웰니스",
    badge: "마지막 날 필수",
    rating: 4.94,
    reviewCount: 320,
    duration: "90분 마사지 + 짐보관 + 깜란 공항 샌딩",
    bestTime: "귀국일 18:00 ~ 21:00",
    location: "나트랑 시내 중심가",
    googleMapQuery: "Suanna Spa Nha Trang",
    priceVnd: 620000,
    pricePer: "90분 아로마 마사지 + 전용차 공항 샌딩 1인 기준",
    tags: ["짐보관무료", "샤워시설완비", "공항샌딩", "귀국날최고"],
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "호텔 체크아웃 후 무거운 짐을 맡기고 편하게 시내를 즐긴 뒤, 시원한 마사지와 개운한 샤워 후 공항까지 안전하게 전용차로 이동하는 스마트 패키지!",
    included: [
      "당일 캐리어 무료 안전 보관 서비스",
      "90분 전신 릴렉스 아로마 또는 핫스톤 마사지",
      "개별 샤워실 이용 & 고급 어메니티 및 타월",
      "스파 전용 차량으로 깜란 국제공항까지 프라이빗 샌딩"
    ],
    notIncluded: ["기사 및 테라피스트 매너 팁"],
    whatToBring: ["비행기 탑승용 편안한 옷 (기내용)"],
    coupleTip: "마지막 날 호텔 체크아웃(12:00) 후 짐 맡겨두고 시내 카페/쇼핑 즐기다가, 저녁에 마사지 받고 샤워 싹 하고 공항 가면 피로감 없이 밤비행기 꿀잠 가능합니다!",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=nhatrang%20spa%20airport"
  },

  // ==========================================
  // 3. Theme Parks & Sightseeing
  // ==========================================
  {
    id: "act-13",
    title: "빈원더스(VinWonders) 테마파크 & 알파인코스터 & 타타쇼",
    titleEn: "VinWonders Theme Park, Alpine Coaster & Tata Show",
    category: "vinwonders",
    categoryLabel: "빈원더스 테마파크",
    badge: "필수 명소",
    rating: 4.92,
    reviewCount: 780,
    duration: "종일 (10:00 ~ 20:30)",
    bestTime: "오후 13:30 입장 또는 종일 일정",
    location: "혼트레섬 (빈펄 케이블카/스피드보트 탑승)",
    googleMapQuery: "VinWonders Nha Trang",
    priceVnd: 950000,
    pricePer: "1인 케이블카 포함 올인데이 자유이용권",
    tags: ["알파인코스터", "워터파크", "사파리", "대형야간쇼"],
    images: [
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "바다를 굽어보며 질주하는 알파인 코스터, 핑크 홍학 사파리, 열대 식물원 돔, 초대형 워터파크, 그리고 밤 7시 30분의 환상적인 타타쇼!",
    included: [
      "빈펄 해상 케이블카 왕복 탑승권",
      "빈원더스 내 모든 어트랙션 (알파인 코스터, 롤러코스터, 대관람차)",
      "워터파크, 킹스가든 사파리, 플라워 블루밍 돔",
      "메인 광장 3D 맵핑 타타쇼(Tata Show) 관람"
    ],
    notIncluded: ["파크 내 식음료 & 기념품", "사파리 먹이주기 체험 (소액)"],
    whatToBring: ["수영복 & 비치타월 (워터파크용)", "편한 운동화 & 모자", "보조배터리", "얇은 셔츠"],
    coupleTip: "알파인 코스터는 입장 직후나 오후 4시경 타는 것이 대기가 적어요. 둘이서 한 썰매에 같이 타고 바다를 보며 내려오는 스릴이 최고! 밤 7:30 타타쇼는 30분 전 메인 성 앞 명당자리를 미리 선점하세요.",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=vinwonders%20nha%20trang"
  },
  {
    id: "act-14",
    title: "빈펄 하버(Vinpearl Harbour) 유럽풍 야경 산책 & 펍 투어",
    titleEn: "Vinpearl Harbour Waterfront Night Walk, Dining & Pubs",
    category: "vinwonders",
    categoryLabel: "빈펄 하버 & 야경",
    badge: "야경 핫플",
    rating: 4.87,
    reviewCount: 290,
    duration: "저녁 (17:30 ~ 21:30, 약 4시간)",
    bestTime: "일몰 후 18:30 ~ 21:00",
    location: "혼트레섬 빈펄 하버 부두",
    googleMapQuery: "Vinpearl Harbour Nha Trang",
    priceVnd: 200000,
    pricePer: "케이블카 왕복권 + 음료 예산",
    tags: ["유럽풍거리", "화려한야경", "분수쇼", "인스타핫플"],
    images: [
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "지중해 남유럽 항구 도시를 그대로 옮겨놓은 듯한 이국적인 건축물들과 화려한 조명, 바다 분수 레이저 쇼를 즐기는 감성 산책 코스.",
    included: [
      "빈펄 케이블카 또는 하버 전용 페리 왕복",
      "빈펄 하버 워터프론트 거리 자유 산책",
      "수상 카바레 쇼 & 야간 음악 분수 쇼 무료 관람"
    ],
    notIncluded: ["하버 내 레스토랑 & 펍 식음료 비용"],
    whatToBring: ["예쁜 데이트 룩", "스마트폰 카메라"],
    coupleTip: "빈원더스에 종일 가지 않더라도, 저녁에 케이블카 타고 하버만 방문해서 야경과 바다 분수쇼 보며 맥주 한잔하는 가벼운 나이트 코스로도 아주 훌륭합니다.",
    bookingUrl: "https://www.google.com/maps/search/Vinpearl+Harbour+Nha+Trang"
  },
  {
    id: "act-15",
    title: "양베이(Yang Bay) 테마파크 & 열대 폭포 트레킹 & 온천",
    titleEn: "Yang Bay Eco Theme Park, Tropical Waterfall & Mineral Springs",
    category: "culture",
    categoryLabel: "자연 생태 & 폭포",
    badge: "대자연 힐링",
    rating: 4.84,
    reviewCount: 220,
    duration: "반일 ~ 1일 (08:30 ~ 15:00, 약 6.5시간)",
    bestTime: "오전 출발",
    location: "나트랑 서부 산악 국립공원 지대 (차량 45분)",
    googleMapQuery: "Yang Bay Waterfall Khanh Hoa",
    priceVnd: 680000,
    pricePer: "1인 왕복 차량 + 입장료 + 런치 포함",
    tags: ["열대폭포", "소원나무", "악어먹이주기", "자연온천"],
    images: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "시원하게 쏟아지는 원시림 폭포와 에메랄드 천연 수영장, 라글라이 소수민족 전통 공연과 신비로운 거대 소원나무를 만나는 에코 투어!",
    included: [
      "호텔 왕복 전용 에어컨 차량",
      "양베이 에코 테마파크 입장료 & 파크 내 전동카 이용",
      "소원나무 리본 걸기 & 악어 낚시 체험",
      "양베이 폭포 천연 미네랄 온천욕",
      "현지 특식 런치"
    ],
    notIncluded: ["개인 음료 및 기념품"],
    whatToBring: ["수영복 & 비치타월", "편한 운동화/샌들", "모기 기피제"],
    coupleTip: "바다와는 또 다른 나트랑의 울창한 산림 매력을 느낄 수 있습니다. 거대한 200년 된 소원나무에 둘만의 사랑과 건강을 기원하는 소원 리본을 매달아보세요!",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=yang%20bay%20waterfall"
  },

  // ==========================================
  // 4. City Culture, Landmarks & Day Trips
  // ==========================================
  {
    id: "act-16",
    title: "포나가르 참탑 & 롱선사 & 나트랑 대성당 문화 투어",
    titleEn: "Ponagar Cham Towers, Long Son Pagoda & Cathedral Cultural Tour",
    category: "culture",
    categoryLabel: "역사 & 문화 유적",
    badge: "사진 명소",
    rating: 4.85,
    reviewCount: 620,
    duration: "반일 (오전 09:00 ~ 12:30, 약 3.5시간)",
    bestTime: "이른 아침 (햇볕 덜 뜨겁고 사진 맑음)",
    location: "나트랑 시내 북부 카이강 어귀 & 시내",
    googleMapQuery: "Po Nagar Cham Towers Nha Trang",
    priceVnd: 180000,
    pricePer: "입장료 + 그랩 이동 총 2인 기준",
    tags: ["천년유적", "이국적풍경", "인스타핫플", "가성비최고"],
    images: [
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566836610593-61a37a77d5ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "8~13세기 힌두교 참파 왕국의 붉은 벽돌 신전 포나가르 사원과 거대 백불상이 있는 롱선사에서 담아내는 이국적인 인생샷.",
    included: [
      "포나가르 참탑 입장료 (3만 동/1인)",
      "롱선사 & 나트랑 대성당 자유 관람",
      "전통 참족 민속 음악 & 무용 공연 관람 (사원 내 수시 진행)"
    ],
    notIncluded: ["이동 그랩 비용 (시내에서 편도 5~6만 동)", "사원 내 소원 초 구매"],
    whatToBring: ["무릎과 어깨를 가리는 얇은 린넨 셔츠/로브 (사원 내부 입장 시 필요)", "양산 또는 모자"],
    coupleTip: "포나가르 탑 붉은 벽돌과 푸른 하늘의 색감 대비가 엄청납니다. 흰색 원피스나 밝은 린넨 룩을 입으면 사진이 화사하게 나옵니다. 사원 바로 앞 카이강 뷰도 훌륭해요!",
    bookingUrl: "https://www.google.com/maps/search/Ponagar+Cham+Towers"
  },
  {
    id: "act-17",
    title: "영원한 봄의 도시 달랏(Da Lat) 핵심 일일 투어",
    titleEn: "Da Lat Flower City Full-Day Private Highlights Tour",
    category: "culture",
    categoryLabel: "달랏 근교 일일투어",
    badge: "베스트 근교",
    rating: 4.96,
    reviewCount: 390,
    duration: "종일 (06:30 ~ 19:30, 약 13시간)",
    bestTime: "선선한 가을 날씨 (연중 18~24°C)",
    location: "베트남 남부 고원지대 달랏",
    googleMapQuery: "Datanla Waterfalls Dalat",
    priceVnd: 1250000,
    pricePer: "1인 전용 리무진 + 루지 + 가이드 + 식사",
    tags: ["다딴라루지", "핑퐁폭포", "린푸억사원", "선선한고원"],
    images: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "해발 1,500m 고원에 위치한 프랑스풍 도시 달랏에서 아시아 최장 다딴라 폭포 루지, 도자기 모자이크 린푸억 사원, 랑비앙 산을 정복하는 알찬 하루!",
    included: [
      "고급 VIP 리무진 왕복 전용 차량 (나트랑 ↔ 달랏)",
      "다딴라 폭포 알파인 루지 탑승권",
      "린푸억 사원, 크레이지 하우스, 달랏 기차역 입장료",
      "현지 셰프 런치 & 달랏 아티초크 티 시음"
    ],
    notIncluded: ["기사/가이드 팁", "개인 쇼핑 비용"],
    whatToBring: ["가벼운 외투/가디건 (달랏은 선선하고 쌀쌀함)", "편한 운동화", "보조배터리"],
    coupleTip: "나트랑의 더위를 피해 하루쯤 선선한 봄 날씨의 달랏을 다녀오는 것은 최고의 선택입니다. 다딴라 폭포를 관통하는 루지는 둘이 타면 스릴과 낭만이 2배!",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=dalat%20tour%20from%20nha%20trang"
  },
  {
    id: "act-18",
    title: "무이네(Mui Ne) 사막 지프 선라이즈/선셋 투어",
    titleEn: "Mui Ne White & Red Sand Dunes Jeep Adventure Tour",
    category: "culture",
    categoryLabel: "사막 근교 투어",
    badge: "이색 어드벤처",
    rating: 4.90,
    reviewCount: 310,
    duration: "종일 또는 당일 새벽 출발 (약 12시간)",
    bestTime: "새벽 선라이즈 또는 오후 선셋",
    location: "무이네 사막 (화이트샌즈, 레드샌즈)",
    googleMapQuery: "White Sand Dunes Mui Ne",
    priceVnd: 1350000,
    pricePer: "1인 전용 차량 + 사막 지프 + 요정의 샘",
    tags: ["화이트샌즈", "사막ATV", "요정의샘", "인생샷끝판왕"],
    images: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "끝없이 펼쳐진 새하얀 화이트 샌즈 사막에서 질주하는 오픈탑 컬러 지프와 ATV, 붉은 협곡 요정의 샘물을 걷는 이국적인 인생샷 명소!",
    included: [
      "나트랑 호텔 ↔ 무이네 전용 리무진 픽업/샌딩",
      "무이네 현지 오픈탑 컬러 지프 탑승",
      "화이트 샌즈 사구, 레드 샌즈, 요정의 샘, 피싱 빌리지 입장",
      "생수 및 과일 간식"
    ],
    notIncluded: ["화이트샌즈 ATV 개별 렌탈비 (인당 약 30만동)", "식사비"],
    whatToBring: ["선글라스 & 스카프 (사막 모래바람 대비)", "화려한 색상의 옷/원피스 (사진 필수)", "물티슈"],
    coupleTip: "컬러풀한 지프차 보닛 위에 둘이 올라앉아 사막을 배경으로 찍는 사진은 무조건 인스타그램 메인 사진감입니다!",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=mui%20ne%20tour%20from%20nha%20trang"
  },
  {
    id: "act-19",
    title: "국립 해양박물관(Oceanographic Museum) & 아쿠아리움",
    titleEn: "National Oceanographic Museum & Giant Whale Skeleton",
    category: "culture",
    categoryLabel: "역사 & 해양 생태",
    badge: "가성비 명소",
    rating: 4.78,
    reviewCount: 240,
    duration: "1.5 ~ 2시간",
    bestTime: "오후 14:00 ~ 16:00 (시원한 실내)",
    location: "나트랑 남부 카우다 선착장 인근",
    googleMapQuery: "National Oceanographic Museum Nha Trang",
    priceVnd: 40000,
    pricePer: "1인 입장료 (약 2,200원)",
    tags: ["거대고래골격", "실내에어컨", "바다거북", "프랑스식건물"],
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "1923년 프랑스령 시절 설립된 유서 깊은 해양 연구소로, 길이 26m의 거대한 혹등고래 골격 표본과 귀여운 바다거북을 볼 수 있는 실내 명소.",
    included: [
      "해양박물관 전관 입장료",
      "해저 터널 아쿠아리움 및 표본 전시관 관람"
    ],
    notIncluded: ["교통비"],
    whatToBring: ["편한 신발"],
    coupleTip: "케이블카 선착장 바로 근처라 빈원더스 들어가기 전이나 호핑투어 끝난 후 가볍게 들르기 좋습니다. 2천 원대 입장료 대비 볼거리가 쏠쏠합니다.",
    bookingUrl: "https://www.google.com/maps/search/National+Oceanographic+Museum+Nha+Trang"
  },

  // ==========================================
  // 5. Cruises, Nightlife & Dining Experiences
  // ==========================================
  {
    id: "act-20",
    title: "엠페러(Emperor) 5성급 럭셔리 선셋 디너 크루즈",
    titleEn: "Emperor Luxury Sunset Dinner Cruise with Live Music & Wine",
    category: "cruise",
    categoryLabel: "선셋 크루즈",
    badge: "로맨틱 끝판왕",
    rating: 4.97,
    reviewCount: 290,
    duration: "16:30 ~ 20:30 (약 4시간)",
    bestTime: "골든아워 일몰 (17:00 ~ 18:30)",
    location: "나트랑 빈펄 하버 선착장 출발",
    googleMapQuery: "Emperor Cruises Nha Trang",
    priceVnd: 1350000,
    pricePer: "1인 5코스 디너 & 무제한 와인/칵테일 포함",
    tags: ["로맨틱디너", "무제한와인", "라이브바이올린", "선셋인생샷"],
    images: [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "황금빛 노을로 물드는 나트랑 만을 항해하며 랍스터/스테이크 5코스 요리와 무제한 와인, 감미로운 라이브 클래식 연주를 즐기는 낭만의 밤.",
    included: [
      "호텔 픽업 & 샌딩 서비스",
      "선셋 웰컴 샴페인 & 카나페",
      "5성급 셰프 특선 5코스 디너 (랍스터 또는 스테이크 메인)",
      "하우스 와인, 맥주, 칵테일 무제한 제공",
      "선상 라이브 바이올린 & 기타 어쿠스틱 연주"
    ],
    notIncluded: ["고급 프리미엄 샴페인 별도 주문", "개인 팁"],
    whatToBring: ["스마트 캐주얼/원피스 (인생 사진용)", "가벼운 가디건 (밤바다 바람 대비)"],
    coupleTip: "여행 6일 차 기념일 디너로 강력 추천합니다! 선셋 골든아워에 갑판에서 칵테일 잔을 들고 찍는 사진은 평생 남을 인생 사진이 됩니다.",
    bookingUrl: "https://emperorcruises.com"
  },
  {
    id: "act-21",
    title: "세일링 클럽(Sailing Club) 비치 카바나 & 해변 불쇼 나이트",
    titleEn: "Sailing Club Beachfront Cabana, Fire Show & Cocktails",
    category: "nightlife",
    categoryLabel: "비치 바 & 나이트라이프",
    badge: "감성 핫플",
    rating: 4.89,
    reviewCount: 460,
    duration: "저녁 19:30 ~ 23:30 (자유)",
    bestTime: "밤 20:30 (불쇼 시작 시간)",
    location: "나트랑 비치 메인 해변가",
    googleMapQuery: "Sailing Club Nha Trang",
    priceVnd: 450000,
    pricePer: "칵테일 2잔 + 스낵 2인 예상",
    tags: ["해변불쇼", "오션뷰카바나", "시그니처칵테일", "파도소리"],
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "하얀 모래사장에 놓인 푹신한 카바나에 누워 파도 소리와 라운지 음악을 들으며 즐기는 트로피컬 칵테일과 환상적인 해변 파이어 쇼!",
    included: [
      "비치 프론트 선베드 / 카바나 테이블 착석",
      "해변 화려한 파이어 댄스(Fire Show) 관람 (매일 밤 20:30~21:00)",
      "DJ 라운지 뮤직"
    ],
    notIncluded: ["음료 및 안주 주문 금액 (단품 주문)"],
    whatToBring: ["해변 슬리퍼", "가벼운 밤마실 룩"],
    coupleTip: "해변 바로 앞 모래사장 테이블에 앉으려면 19:30 전에 도착하거나 미리 예약해두는 것이 좋습니다. 밤바다 바람 맞으며 칵테일 한잔하기에 분위기가 너무 좋아요.",
    bookingUrl: "https://sailingclubnhatrang.com"
  },
  {
    id: "act-22",
    title: "스카이라이트(Skylight 360) 45층 루프탑 클럽 & 글래스 스카이워크",
    titleEn: "Skylight Nha Trang 360 Skydeck, Rooftop Club & Glass Walk",
    category: "nightlife",
    categoryLabel: "루프탑 & 야경",
    badge: "파노라마 뷰",
    rating: 4.85,
    reviewCount: 390,
    duration: "저녁 20:00 ~ 23:00",
    bestTime: "밤 20:30 ~ 22:00 (도시 야경 절정)",
    location: "하바나 호텔 45층 옥상",
    googleMapQuery: "Skylight Nha Trang",
    priceVnd: 250000,
    pricePer: "1인 입장료 + 웰컴 프리 드링크 1잔 포함",
    tags: ["45층파노라마야경", "유리스카이워크", "EDM클럽", "인생샷스팟"],
    images: [
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "나트랑 시내와 해안선이 360도 한눈에 내려다보이는 45층 초고층 루프탑에서 즐기는 아찔한 유리 스카이워크와 트렌디한 DJ 파티!",
    included: [
      "45층 초고속 전용 엘리베이터 & 스카이덱 입장",
      "웰컴 칵테일/맥주/음료 1잔 무료 교환권",
      "바닥이 훤히 보이는 글래스 스카이워크 체험"
    ],
    notIncluded: ["추가 주류 주문"],
    whatToBring: ["세련된 이브닝 캐주얼 복장 (슬리퍼는 제한될 수 있음)"],
    coupleTip: "유리 바닥 스카이워크에서 발밑으로 펼쳐지는 아찔한 야경을 배경으로 커플 사진을 꼭 남겨보세요!",
    bookingUrl: "https://www.google.com/maps/search/Skylight+Nha+Trang"
  },
  {
    id: "act-23",
    title: "루이지애나 브루하우스(Louisiane) 수제맥주 샘플러 & 해변 풀사이드",
    titleEn: "Louisiane Brewhouse Beachfront Craft Beer Tasting & Pool",
    category: "nightlife",
    categoryLabel: "비치 펍 & 수제맥주",
    badge: "수제맥주 성지",
    rating: 4.88,
    reviewCount: 410,
    duration: "1.5 ~ 2.5시간",
    bestTime: "오후 17:00 ~ 20:00 (선셋부터 밤까지)",
    location: "나트랑 해변 중앙 비치 프론트",
    googleMapQuery: "Louisiane Brewhouse Nha Trang",
    priceVnd: 320000,
    pricePer: "수제맥주 4종 샘플러 2세트 + 안주 기준",
    tags: ["패션후르츠맥주", "해변수영장", "화덕피자", "선셋맥주"],
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "자체 양조장에서 직접 만드는 상큼한 패션후르츠 수제 맥주와 다크에일, 화덕 피자를 해변 바로 앞 야외 수영장 테이블에서 즐기는 여유!",
    included: [
      "자유 테이블/선베드 이용",
      "해변 풀사이드 수영장 무료 이용"
    ],
    notIncluded: ["음식 및 주류 단품 주문"],
    whatToBring: ["가벼운 해변 복장"],
    coupleTip: "4가지 대표 수제맥주를 맛볼 수 있는 '샘플러 트레이'와 바삭한 화덕 깔조네 피자 조합을 추천합니다. 해질녘 바다를 보며 짠하기 딱 좋습니다.",
    bookingUrl: "https://www.google.com/maps/search/Louisiane+Brewhouse+Nha+Trang"
  },

  // ==========================================
  // 6. Markets, Shopping, Cafes & Classes
  // ==========================================
  {
    id: "act-24",
    title: "담시장(Dam Market) & 야시장 라탄백/크록스 쇼핑 탐방",
    titleEn: "Dam Market & Night Market Local Souvenir & Fashion Shopping",
    category: "shopping",
    categoryLabel: "로컬 마켓 & 쇼핑",
    badge: "쇼핑 필수",
    rating: 4.76,
    reviewCount: 380,
    duration: "2~3시간 (오후 또는 저녁)",
    bestTime: "담시장은 14:00~16:00 / 야시장은 19:30 이후",
    location: "나트랑 담시장(원형 건물) & 트란푸 야시장",
    googleMapQuery: "Cho Dam Nha Trang",
    priceVnd: 500000,
    pricePer: "라탄백, 지비츠, 커플 원피스 쇼핑 예산",
    tags: ["라탄백", "크록스지비츠", "원피스쇼핑", "흥정의재미"],
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "예쁜 핸드메이드 라탄백과 휴양지 커플룩 원피스, 크록스와 귀여운 지비츠 세트를 한국의 1/3 가격에 득템하는 쇼핑 천국!",
    included: [
      "담시장 원형 2층 건물 로컬 쇼핑 탐방",
      "야시장 먹거리(철판 아이스크림, 과일 주스) 체험"
    ],
    notIncluded: ["개인 쇼핑 비용", "현금 필수 지참"],
    whatToBring: ["소액 베트남 동 현금 (1만, 2만, 5만, 10만 동)", "에코백 또는 장바구니"],
    coupleTip: "담시장에서는 정가의 20~30% 정도 기분 좋게 흥정하는 재미가 쏠쏠합니다! 착용감이 편한 커플 휴양지 셔츠와 라탄백은 여행 초반에 사서 여행 내내 입고 다니면 사진이 예쁩니다.",
    bookingUrl: "https://www.google.com/maps/search/Dam+Market+Nha+Trang"
  },
  {
    id: "act-25",
    title: "롯데마트 나트랑점 기념품 & 간식 싹쓸이 쇼핑",
    titleEn: "Lotte Mart Nha Trang Souvenir, Mango Jelly & Coffee Shopping",
    category: "shopping",
    categoryLabel: "마트 쇼핑 & 기념품",
    badge: "기념품 1위",
    rating: 4.88,
    reviewCount: 510,
    duration: "1.5 ~ 2시간",
    bestTime: "여행 후반부 (귀국 전날 또는 마지막 날)",
    location: "나트랑 롯데마트 골드코스트점 (시내 중심)",
    googleMapQuery: "Lotte Mart Gold Coast Nha Trang",
    priceVnd: 800000,
    pricePer: "망고젤리, 커피, 캐슈넛 등 2인 선물 쇼핑 예산",
    tags: ["체리쉬망고젤리", "아치카페", "껍질캐슈넛", "친수소스", "카드결제가능"],
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "시원한 에어컨 아래에서 정찰제로 편안하게 즐기는 선물 쇼핑! 탑젤리/체리쉬 망고젤리, 코코넛 아치카페, A급 껍질 캐슈넛, 친수 칠리소스 득템!",
    included: [
      "쾌적한 대형 마트 카트 쇼핑 & 박스 포장대 무료 이용",
      "트래블로그/트래블월렛 및 신용카드 수수료 0원 결제"
    ],
    notIncluded: ["유료 비닐봉투 (에코백 챙김 권장)"],
    whatToBring: ["캐리어 여유 공간 또는 큰 타포린 쇼핑백", "트래블 카드"],
    coupleTip: "시내 중심 '골드코스트점(Gold Coast)'으로 가시면 접근성이 가장 좋습니다. 체리쉬 망고 젤리는 노란색 오리지널과 망고스틴 맛을 섞어서 사시면 가족/지인 선물로 호불호 없이 최고 인기입니다.",
    bookingUrl: "https://www.google.com/maps/search/Lotte+Mart+Gold+Coast+Nha+Trang"
  },
  {
    id: "act-26",
    title: "정글 테마 감성 카페 투어 (레인포레스트 & 안카페 & CCCP)",
    titleEn: "Rainforest, An Cafe & CCCP Coffee Jungle Greenery Cafe Tour",
    category: "cafe",
    categoryLabel: "감성 카페 & 디저트",
    badge: "카페 투어",
    rating: 4.89,
    reviewCount: 470,
    duration: "1.5 ~ 2시간",
    bestTime: "오후 13:00 ~ 15:30 (가장 더운 시간대 힐링)",
    location: "나트랑 시내 번화가",
    googleMapQuery: "Rainforest Nha Trang",
    priceVnd: 120000,
    pricePer: "음료 2잔 기준 (약 6,500원)",
    tags: ["코코넛스무디커피", "정글인테리어", "에어컨존", "인생샷"],
    images: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "초록빛 나무와 미끄럼틀, 해먹이 어우러진 정글 오두막 레인포레스트와 시원 달콤한 코코넛 스무디 커피의 정석 CCCP 커피 투어!",
    included: [
      "3층 규모의 독특한 트리하우스 공간 이용",
      "고속 와이파이 & 시원한 에어컨 룸 구비"
    ],
    notIncluded: ["주문 음료 및 디저트 비용"],
    whatToBring: ["카메라 또는 스마트폰 (인생샷 준비)"],
    coupleTip: "가장 더운 한낮에 레인포레스트 2층 해먹 좌석이나 나무 그네 좌석에 앉아 코코넛 커피와 망고 요거트를 마시면 최고의 휴식이 됩니다.",
    bookingUrl: "https://www.google.com/maps/search/Rainforest+Nha+Trang"
  },
  {
    id: "act-27",
    title: "베트남 전통 로컬 마켓 장보기 & 프라이빗 쿠킹 클래스",
    titleEn: "Traditional Vietnamese Local Market Tour & Cooking Class",
    category: "cooking",
    categoryLabel: "미식 & 쿠킹 클래스",
    badge: "이색 데이트",
    rating: 4.96,
    reviewCount: 180,
    duration: "오전 09:00 ~ 13:00 (약 4시간)",
    bestTime: "오전 (아침 시장 장보기 포함)",
    location: "나트랑 외곽 빌라 가든 키친",
    googleMapQuery: "Lanterns Cooking Class Nha Trang",
    priceVnd: 750000,
    pricePer: "1인 4코스 요리 & 마켓투어 포함",
    tags: ["직접만드는반쎄오", "분짜", "마켓투어", "힐링추억"],
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "현지 셰프와 함께 활기찬 로컬 시장에서 식재료를 직접 고르고, 바삭한 반쎄오와 분짜, 모닝글로리 볶음을 직접 요리해 먹는 꿀잼 클래스!",
    included: [
      "호텔 픽업 및 시장 투어 가이드",
      "모든 신선한 요리 재료 & 조리 도구",
      "4가지 전통 요리 실습 (반쎄오, 스프링롤, 분짜, 망고 샐러드)",
      "직접 만든 요리로 풍성한 점심 식사 & 레시피북 증정"
    ],
    notIncluded: ["추가 주류 음료"],
    whatToBring: ["편한 신발", "맛있게 먹을 배!"],
    coupleTip: "둘이서 앞치마를 두르고 알콩달콩 요리하며 베트남 향신료 비법을 배우는 색다른 데이트 코스입니다. 한국에 돌아와서도 생각나는 맛있는 추억이 됩니다.",
    bookingUrl: "https://www.klook.com/ko/search/result/?query=nha%20trang%20cooking%20class"
  },
  // ==========================================
  // Expanded Activities (act-28 to act-43)
  // ==========================================
  {
    id: "act-28",
    title: "혼총 곶(Hòn Chồng) 바다 위 거대 암석 지대 & 전통 음악 공연",
    titleEn: "Chong Rocks (Hon Chong Promontory) Coastal Boulders & Traditional Music",
    category: "culture",
    categoryLabel: "역사 & 자연 명소",
    badge: "절경 명소",
    rating: 4.4,
    reviewCount: 8900,
    duration: "1 ~ 1.5시간",
    bestTime: "오전 08:30 ~ 10:30 또는 일몰 17:00 ~ 18:00",
    location: "Khóm Hòn Chồng, Phường Vĩnh Phước, Nha Trang, Khánh Hòa",
    googleMapQuery: "Hòn Chồng Khóm Hòn Chồng Phường Vĩnh Phước Nha Trang",
    priceVnd: 30000,
    pricePer: "1인 입장료 (약 1,600원)",
    tags: ["거대바위절경", "전통음악공연", "해안파노라마", "인생샷명소"],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "바다 위에 자연적으로 쌓인 거대한 화강암 바위 군락과 전설 속 거인의 손바닥 자국, 전통 목조 가옥에서 열리는 베트남 민속 악기 연주를 감상하는 해안 명소!",
    included: [
      "혼총 곶 암석 지대 입장료",
      "혼총 전통 목조 가옥(Hội quán Hòn Chồng) 관람",
      "베트남 전통 민속 악기 라이브 공연 관람"
    ],
    notIncluded: ["카페 음료 주문 비용", "교통비 (시내에서 그랩 편도 약 5~6만 동)"],
    whatToBring: ["편한 샌들/운동화 (바위 위 미끄럼 주의)", "선글라스 & 양산", "스마트폰 카메라 완충"],
    coupleTip: "바위 끝자락에 서서 나트랑 북부 해안선과 바다를 배경으로 사진을 찍으면 장관입니다. 관람 후 바로 옆 혼총 카페 테라스에서 바닷바람 맞으며 카페 쓰어다 한잔 즐겨보세요.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=H%C3%B2n%20Ch%E1%BB%93ng%20Kh%C3%B3m%20H%C3%B2n%20Ch%E1%BB%93ng%20Ph%C6%B0%E1%BB%9Bc%20Nha%20Trang"
  },
  {
    id: "act-29",
    title: "바호 폭포(Ba Ho) 원시림 트레킹 & 천연 에메랄드 다이빙",
    titleEn: "Ba Ho Waterfalls Eco Park, Jungle Trekking & Cliff Diving",
    category: "culture",
    categoryLabel: "자연 생태 & 폭포",
    badge: "액티브 어드벤처",
    rating: 4.3,
    reviewCount: 1450,
    duration: "반일 (09:00 ~ 14:00, 약 5시간)",
    bestTime: "오전 09:30 ~ 12:30 (수영하기 가장 좋은 기온)",
    location: "Thôn Vạn Thuận, Xã Ninh Ích, Thị xã Ninh Hòa, Khánh Hòa (나트랑 북쪽 25km)",
    googleMapQuery: "Khu du lịch Ba Hồ Thôn Vạn Thuận Ninh Ích Ninh Hòa Khánh Hòa",
    priceVnd: 185000,
    pricePer: "1인 입장권 + 카약 & 구명조끼 포함",
    tags: ["천연수영장", "클리프다이빙", "정글트레킹", "카약체험"],
    images: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "3단계로 이어지는 맑고 시원한 천연 화강암 암반 호수에서 에메랄드빛 계곡물 수영과 스릴 만점 클리프 점핑, 정글 카약을 즐기는 숲속 힐링 어드벤처!",
    included: [
      "바호 생태공원 전 구역 입장료",
      "계곡 내 카약 및 패들보드 무료 대여",
      "구명조끼 안전 장비 제공",
      "해먹 휴식 공간 이용"
    ],
    notIncluded: ["왕복 그랩/차량 렌트비 (편도 약 25만 동)", "개인 락커 대여료 (소액)", "식음료"],
    whatToBring: ["아쿠아슈즈 또는 미끄럼 방지 샌들", "수영복 또는 래시가드", "비치타월 & 방수팩", "모기 기피제"],
    coupleTip: "1호수는 수심이 적당하고 카약 타기 좋아 함께 놀기에 최고입니다. 바위에 걸터앉아 맑은 계곡물에 발을 담그고 사진을 찍으면 영화 속 한 장면 같은 분위기가 연출됩니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Khu%20du%20l%E1%BB%8Bch%20Ba%20H%E1%BB%93%20Th%C3%B4n%20V%E1%BA%A1n%20Thu%E1%BA%ADn%20Ninh%20%C3%8Dch%20Ninh%20H%C3%B2a%20Kh%C3%A1nh%20H%C3%B2a"
  },
  {
    id: "act-30",
    title: "롱선사(Long Son Pagoda) 24m 거대 백불상 & 파노라마 전망대",
    titleEn: "Long Son Pagoda Giant White Buddha & Mountain City View",
    category: "culture",
    categoryLabel: "역사 & 사찰 유적",
    badge: "나트랑 대표 사찰",
    rating: 4.6,
    reviewCount: 8200,
    duration: "1 ~ 1.5시간",
    bestTime: "아침 08:00 ~ 10:00 (시원하고 한적함)",
    location: "22 Đường 23 Tháng 10, Phường Phương Sơn, Nha Trang, Khánh Hòa",
    googleMapQuery: "Chùa Long Sơn 22 Đường 23 Tháng 10 Phương Sơn Nha Trang",
    priceVnd: 0,
    pricePer: "무료 입장 (자유 관람)",
    tags: ["거대백불상", "152계단전망", "용조각사찰", "무료입장"],
    images: [
      "https://images.unsplash.com/photo-1566836610593-61a37a77d5ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "1886년에 건립된 나트랑 최대의 불교 사찰로, 152개의 계단을 올라 만나는 24m 거대한 백색 좌불상과 나트랑 시내 전경을 조망할 수 있는 힐링 명소.",
    included: [
      "롱선사 경내 및 대웅전 자유 관람",
      "중턱 와불상(누워있는 부처) 관람",
      "정상 거대 백불상(김신불조) 및 시내 전망대 이용"
    ],
    notIncluded: ["향 또는 소원 공양비 (자율 보시)", "주차비 (오토바이 이용 시 소액)"],
    whatToBring: ["무릎과 어깨를 가리는 복장 (사원 예절)", "편한 운동화/샌들", "부채 또는 손선풍기", "생수"],
    coupleTip: "백불상 아래에 서서 올려다보며 사진을 찍으면 웅장한 사진을 얻을 수 있습니다. 정상 전망대에서는 나트랑 시내와 푸른 산세가 파노라마로 펼쳐져 여행 기념사진을 찍기에 훌륭합니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Ch%C3%B9a%20Long%20S%C6%A1n%2022%20%C4%90%C6%B0%E1%BB%9Dng%2023%20Th%C3%A1ng%2010%20Ph%C6%B0%C6%A1ng%20S%C6%A1n%20Nha%20Trang"
  },
  {
    id: "act-31",
    title: "나트랑 대성당(Nha Trang Cathedral) 프랑스 고딕 석조 성당",
    titleEn: "Nha Trang Mountain Stone Cathedral (Christ the King Cathedral)",
    category: "culture",
    categoryLabel: "역사 & 유럽 건축",
    badge: "인생샷 명소",
    rating: 4.4,
    reviewCount: 6800,
    duration: "40분 ~ 1시간",
    bestTime: "오전 08:30 ~ 11:00 또는 오후 14:30 ~ 16:00",
    location: "01 Thái Nguyên, Phường Phước Tân, Nha Trang, Khánh Hòa",
    googleMapQuery: "Nhà thờ Chánh Tòa Kitô Vua 01 Thái Nguyên Phước Tân Nha Trang",
    priceVnd: 0,
    pricePer: "무료 입장 (자유 관람)",
    tags: ["프랑스고딕양식", "스테인드글라스", "언덕위성당", "웨딩촬영명소"],
    images: [
      "https://images.unsplash.com/photo-1548625361-16a7f9202a00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "1928년 프랑스 식민지 시절 높은 언덕 위에 지어진 고딕 양식의 석조 성당으로, 화려한 스테인드글라스와 고풍스러운 시계탑이 낭만적인 분위기를 자아냅니다.",
    included: [
      "성당 외부 회랑 및 광장 관람",
      "성당 내부 스테인드글라스 관람 (미사 시간 외 개방 시)",
      "언덕 위 도시 전경 감상"
    ],
    notIncluded: ["정문 주변 비공식 호객/가이드 팁 요구 (무시 권장)"],
    whatToBring: ["단정한 복장 (민소매/초미니스커트 지양)", "카메라"],
    coupleTip: "성당 옆 회랑 돌기둥 사이로 빛이 들어올 때 찍는 인물 사진이 마치 유럽 여행에 온 듯한 느낌을 줍니다. 밝은 색 옷을 입으면 짙은 회색 석조 벽과 대비되어 사진이 더욱 선명합니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0%20th%E1%BB%9D%20Ch%C3%A1nh%20T%C3%B2a%20Kit%C3%B4%20Vua%2001%20Th%C3%A1i%20Nguy%C3%AAn%20Ph%C6%B0%E1%BB%9Bc%20T%C3%A2n%20Nha%20Trang"
  },
  {
    id: "act-32",
    title: "알렉산더 예르신 박물관 & 파스퇴르 연구소 역사 탐방",
    titleEn: "Alexandre Yersin Museum & Historic Pasteur Institute",
    category: "culture",
    categoryLabel: "역사 & 박물관",
    badge: "역사 문화",
    rating: 4.3,
    reviewCount: 380,
    duration: "45분 ~ 1시간",
    bestTime: "오전 09:00 ~ 11:00 (시원한 실내 관람)",
    location: "8-10 Trần Phú, Phường Xương Huân, Nha Trang, Khánh Hòa",
    googleMapQuery: "Bảo tàng Alexandre Yersin 10 Trần Phú Xương Huân Nha Trang",
    priceVnd: 26000,
    pricePer: "1인 입장료 (약 1,400원)",
    tags: ["페스트균발견자", "파스퇴르연구소", "역사유물전시", "조용한실내"],
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "나트랑을 사랑하여 평생을 헌신한 세계적인 의학자 알렉산더 예르신 박사의 생애와 19세기 의학 연구 실험 도구, 천문 망원경, 친필 일기를 만나보는 뜻깊은 공간.",
    included: [
      "예르신 박물관 전관 관람권",
      "역사 사진 및 실험 도구 전시실",
      "프랑스풍 건축물 외관 포토존"
    ],
    notIncluded: ["가이드 해설료 (필요 시 현장 요청)"],
    whatToBring: ["편안한 신발", "가벼운 복장"],
    coupleTip: "해변 도로(Trần Phú) 바로 앞에 위치하여 롯데마트 골드코스트점이나 해변 산책과 묶어 방문하기 좋습니다. 베트남 사람들이 존경하는 프랑스 의학자의 따뜻한 스토리를 나누며 조용히 관람하기 좋습니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=B%E1%BA%A3o%20t%C3%A0ng%20Alexandre%20Yersin%2010%20Tr%E1%BA%A7n%20Ph%C3%BA%20X%C6%B0%C6%A1ng%20Hu%C3%A2n%20Nha%20Trang"
  },
  {
    id: "act-33",
    title: "화란섬 & 원숭이섬 냐푸 만(Nha Phu) 에코 아일랜드 투어",
    titleEn: "Hoa Lan Orchid Island & Monkey Island Eco Wildlife Day Tour",
    category: "culture",
    categoryLabel: "생태 섬 투어",
    badge: "동물 교감",
    rating: 4.4,
    reviewCount: 1850,
    duration: "반일 ~ 종일 (08:30 ~ 14:30, 약 6시간)",
    bestTime: "오전 08:30 출발 (오전 동물 쇼 관람)",
    location: "Bến tàu Long Phú, Quốc lộ 1A, Vĩnh Lương, Nha Trang, Khánh Hòa",
    googleMapQuery: "Bến Tàu Du Thuyền Long Phú Quốc lộ 1A Vĩnh Lương Nha Trang",
    priceVnd: 550000,
    pricePer: "1인 왕복 선박 + 2개 섬 입장료 + 런치 포함",
    tags: ["야생원숭이", "사슴먹이주기", "난초정원", "해양생태투어"],
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "수백 종의 열대 난초와 자유롭게 뛰노는 사슴에게 먹이를 주는 화란섬, 1,500마리 야생 원숭이들이 모여 사는 원숭이섬을 둘러보는 자연 생태 힐링 코스!",
    included: [
      "롱푸 선착장 왕복 쾌속선 탑승권",
      "화란섬 & 원숭이섬 입장료",
      "버드 쇼 & 동물 서커스 관람",
      "사슴/타조 먹이주기 체험",
      "현지식 점심 식사"
    ],
    notIncluded: ["개인 간식 및 음료", "원숭이 간식(바나나/땅콩) 개별 구매 (약 1~2만 동)"],
    whatToBring: ["모자 & 선글라스", "소지품 잠금 가능한 가방 (원숭이가 물건을 낚아챌 수 있음)", "물티슈"],
    coupleTip: "화란섬의 하트 모양 난초 터널과 숲속 사슴 먹이주기 공간에서 감성 가득한 커플 사진을 남겨보세요. 원숭이섬에서는 주머니 속 반짝이는 물건이나 안경을 조심하세요!",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=B%E1%BA%BFn%20T%C3%A0u%20Du%20Thuy%E1%BB%81n%20Long%20Ph%C3%BA%20Qu%E1%BB%91c%20l%E1%BB%99%201A%20V%C4%A9nh%20L%C6%B0%C6%A1ng%20Nha%20Trang"
  },
  {
    id: "act-34",
    title: "빈컴 플라자 쩐푸(Vincom Plaza) 해변가 대형 쇼핑몰 & 윈마트",
    titleEn: "Vincom Plaza Tran Phu Oceanfront Mall, Dining & WinMart",
    category: "shopping",
    categoryLabel: "대형 몰 & 쇼핑",
    badge: "쾌적한 쇼핑",
    rating: 4.4,
    reviewCount: 3600,
    duration: "1.5 ~ 2시간",
    bestTime: "낮 12:00 ~ 15:00 (가장 더운 시간대 시원한 쇼핑)",
    location: "78-80 Trần Phú, Phường Lộc Thọ, Nha Trang, Khánh Hòa",
    googleMapQuery: "Vincom Plaza Trần Phú 78 Trần Phú Lộc Thọ Nha Trang",
    priceVnd: 300000,
    pricePer: "쇼핑 및 카페/디저트 자유 예산",
    tags: ["윈마트슈퍼", "에어컨빵빵", "CGV영화관", "해변도로쇼핑"],
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "나트랑 메인 해변 도로 중심에 위치한 현대식 4층 복합 쇼핑몰로, 대형 슈퍼마켓(WinMart), 패션 브랜드, 오션뷰 푸드코트와 카페가 모여 있는 쾌적한 쇼핑 스팟.",
    included: [
      "쇼핑몰 자유 입장 및 쾌적한 에어컨 쉼터",
      "윈마트 대형 식료품점 카트 쇼핑",
      "무료 와이파이 & 깨끗한 실내 화장실 이용"
    ],
    notIncluded: ["개인 쇼핑 및 식음료 구매 금액"],
    whatToBring: ["신용카드 / 트래블로그 카드", "에코백"],
    coupleTip: "낮에 더위를 피해 시원한 에어컨 바람을 쐬며 윈마트에서 베트남 맥주, 건망고, 라면 등을 카드로 편하게 구매하기 좋습니다. 쇼핑몰 3~4층에서 내려다보는 바다 뷰도 근사합니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Vincom%20Plaza%20Tr%E1%BA%A7n%20Ph%C3%BA%2078%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang"
  },
  {
    id: "act-35",
    title: "나트랑 야시장(Night Market) 야간 길거리 쇼핑 & 스트리트 푸드",
    titleEn: "Nha Trang Walking Night Market, Souvenirs & Street Snacks",
    category: "shopping",
    categoryLabel: "야시장 & 길거리 쇼핑",
    badge: "밤거리 핫플",
    rating: 3.7,
    reviewCount: 4900,
    duration: "1 ~ 1.5시간",
    bestTime: "저녁 19:30 ~ 21:30 (가장 활기찬 골든타임)",
    location: "46 Trần Phú, Phường Lộc Thọ, Nha Trang, Khánh Hòa (침향탑 맞은편)",
    googleMapQuery: "Chợ Đêm Nha Trang 46 Trần Phú Lộc Thọ Nha Trang",
    priceVnd: 200000,
    pricePer: "길거리 간식 & 기념품 소소한 쇼핑 예산",
    tags: ["철판아이스크림", "크록스지비츠", "원피스쇼핑", "침향탑맞은편"],
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "침향탑과 2/4 광장 바로 맞은편 골목에 펼쳐지는 나트랑 대표 야시장으로, 즉석 철판 롤 아이스크림, 악어가죽 지갑, 휴양지 원피스, 귀여운 크록스 지비츠 쇼핑의 재미!",
    included: [
      "야시장 보행자 전용거리 자유 산책",
      "상점가 구경 및 길거리 디저트 체험"
    ],
    notIncluded: ["개인 쇼핑 및 음식 구매비 (현금 결제 권장)"],
    whatToBring: ["소액 베트남 동 현금 (1만~5만 동 권종)", "크로스백 (소매치기 주의)"],
    coupleTip: "저녁 식사 후 슬슬 걸어 나와 즉석 생과일 철판 아이스크림을 하나씩 들고 가게들을 구경해보세요. 가격은 첫 제시가의 70~80% 선에서 웃으며 흥정하면 재미있는 쇼핑이 됩니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Ch%E1%BB%A3%20%C4%90%C3%AAm%20Nha%20Trang%2046%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang"
  },
  {
    id: "act-36",
    title: "JW 기프트(JW Gift) 정찰제 감성 기념품 & 크록스 지비츠",
    titleEn: "JW Gift Nha Trang Fixed Price Souvenirs, Rattan Bags & Crocs",
    category: "shopping",
    categoryLabel: "정찰제 기념품 샵",
    badge: "쇼핑 강추",
    rating: 4.8,
    reviewCount: 820,
    duration: "45분 ~ 1시간",
    bestTime: "낮 13:00 ~ 17:00 (쾌적한 실내 쇼핑)",
    location: "92A Hồng Bàng, Phường Tân Lập, Nha Trang, Khánh Hòa",
    googleMapQuery: "JW Gift 92a Hồng Bàng Tân Lập Nha Trang",
    priceVnd: 400000,
    pricePer: "라탄백, 원피스, 지비츠 등 선물 쇼핑 예산",
    tags: ["흥정없는정찰제", "한국어소통가능", "라탄백성지", "계좌이체가능"],
    images: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "시장에서 바가지나 흥정 스트레스 없이 정찰제로 편안하게 고품질 라탄백, 자수 파우치, 마그넷, 휴양지 원피스, 크록스 지비츠를 구매할 수 있는 에어컨 완비 기념품 샵.",
    included: [
      "쾌적한 에어컨 룸에서 정찰제 쇼핑",
      "한국 계좌이체 및 카드 결제 지원",
      "선물용 깔끔한 개별 포장"
    ],
    notIncluded: ["개인 쇼핑 비용"],
    whatToBring: ["원하는 쇼핑 목록 메모", "트래블 카드 또는 스마트폰 뱅킹"],
    coupleTip: "담시장 흥정에 피로감을 느끼시는 분들께 적극 추천합니다! 가격표가 투명하게 다 붙어 있어 누구나 편안하게 라탄백과 예쁜 자수 파우치를 고를 수 있습니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=JW%20Gift%2092a%20H%E1%BB%93ng%20B%C3%A0ng%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang"
  },
  {
    id: "act-37",
    title: "엘스토어(L Store) 프리미엄 유기농 건과일 & 꽃차 & 위즐커피",
    titleEn: "L Store Premium Dried Fruits, Organic Herbal Tea & Weasel Coffee",
    category: "shopping",
    categoryLabel: "프리미엄 특산품",
    badge: "선물용 1위",
    rating: 4.8,
    reviewCount: 650,
    duration: "30 ~ 45분",
    bestTime: "오후 14:00 ~ 18:00",
    location: "37 Tô Hiến Thành, Phường Tân Lập, Nha Trang, Khánh Hòa",
    googleMapQuery: "L Store 37 Tô Hiến Thành Tân Lập Nha Trang",
    priceVnd: 350000,
    pricePer: "무설탕 건과일 3~4팩 & 꽃차 선물 세트 기준",
    tags: ["무설탕건망고", "버터플라이피꽃차", "위즐커피", "고급패키지선물"],
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "일반 시장의 설탕 범벅 건과일과 달리 설탕 무첨가 프리미엄 건망고, 자몽칩, 파란빛 버터플라이피 꽃차, 고급 족제비 똥 위즐 드립 커피를 깔끔하게 시식 후 구매하는 웰빙 샵!",
    included: [
      "매장 내 모든 건과일 및 꽃차 무료 시식/시음",
      "고급 선물용 박스 및 쇼핑백 포장",
      "카드 및 계좌이체 결제"
    ],
    notIncluded: ["개인 구매 비용"],
    whatToBring: ["선물할 지인 명단"],
    coupleTip: "모든 제품을 직접 맛보고 살 수 있어 실패가 없습니다. 무설탕 건망고와 패션후르츠 청, 장미/국화 꽃차는 부모님이나 직장 동료 선물로 포장이 아주 고급스러워 만족도가 높습니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=L%20Store%2037%20T%C3%B4%20Hi%E1%BA%BFn%20Th%C3%A0nh%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang"
  },
  {
    id: "act-38",
    title: "문밀크(Moon Milk) 수입 유러피언 델리 & 프리미엄 와인 그로서리",
    titleEn: "Moon Milk Gourmet Deli & European Imported Supermarket",
    category: "shopping",
    categoryLabel: "수입 델리 & 마켓",
    badge: "이국적 그로서리",
    rating: 4.4,
    reviewCount: 420,
    duration: "30 ~ 45분",
    bestTime: "오후 16:00 ~ 19:00 (호텔 와인 안주 쇼핑)",
    location: "63 Nguyễn Thiện Thuật, Phường Lộc Thọ, Nha Trang, Khánh Hòa",
    googleMapQuery: "Moonmilk 63 Nguyễn Thiện Thuật Lộc Thọ Nha Trang",
    priceVnd: 250000,
    pricePer: "수입 치즈, 하몽, 와인 및 프리미엄 스낵 2인 예산",
    tags: ["유럽수입치즈", "수입와인", "수제샌드위치", "호텔와인파티"],
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "나트랑 거주 서양인과 미식가들의 방앗간! 유럽 직수입 치즈와 살라미, 유기농 그릭 요거트, 전 세계 엄선 와인, 신선한 베이커리 델리를 갖춘 프리미엄 마켓.",
    included: [
      "글로벌 프리미엄 식료품 큐레이션 쇼핑",
      "콜드컷 치즈 및 와인 추천 서비스",
      "신용카드 결제 지원"
    ],
    notIncluded: ["개인 구매 비용"],
    whatToBring: ["트래블 카드"],
    coupleTip: "리조트나 호텔 발코니에서 둘만의 로맨틱한 와인 타임을 계획 중이라면 필수 코스입니다! 프랑스산 브리치즈와 프로슈토, 크래커, 와인 한 병을 사서 밤바다를 보며 짠해보세요.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Moonmilk%2063%20Nguy%E1%BB%85n%20Thi%E1%BB%87n%20Thu%E1%BA%ADt%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang"
  },
  {
    id: "act-39",
    title: "롯데마트 냐짱점 (23/10거리 본점) 대형 하이퍼마켓 & 대용량 쇼핑",
    titleEn: "Lotte Mart Nha Trang (23/10 St Flagship Hypermarket)",
    category: "shopping",
    categoryLabel: "대형 하이퍼마켓",
    badge: "최대 규모 마트",
    rating: 4.4,
    reviewCount: 5600,
    duration: "1.5 ~ 2시간",
    bestTime: "오전 10:00 ~ 12:00 또는 오후 15:00 ~ 17:00",
    location: "58 Đường 23 Tháng 10, Phường Phương Sơn, Nha Trang, Khánh Hòa",
    googleMapQuery: "Lotte Mart 58 Đường 23 Tháng 10 Phương Sơn Nha Trang",
    priceVnd: 800000,
    pricePer: "대용량 커피, 캐슈넛, 소스 등 2인 쇼핑 예산",
    tags: ["원조롯데마트", "대용량번들할인", "무료박스포장", "롱선사연계동선"],
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "골드코스트점보다 훨씬 넓은 매장 면적과 압도적인 물량을 자랑하는 나트랑 1호 본점 롯데마트! 롱선사 사원 바로 옆에 위치하여 묶음 관광과 대용량 박스 포장 쇼핑에 최적화.",
    included: [
      "초대형 하이퍼마켓 카트 쇼핑",
      "한국 귀국용 무료 자율 박스 테이핑 포장대 이용",
      "카드 수수료 없는 결제"
    ],
    notIncluded: ["시내 중심에서 왕복 그랩 요금 (편도 약 4~5만 동)"],
    whatToBring: ["대형 에코백 또는 장바구니", "트래블로그 카드"],
    coupleTip: "롱선사 관광 직후 도보 3분 거리라 롱선사 구경 후 시원한 에어컨 아래에서 장보기에 동선이 완벽합니다. 대량 구매 시 박스 포장해서 호텔로 그랩 타고 돌아오면 편리합니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Lotte%20Mart%2058%20%C4%90%C6%B0%E1%BB%9Dng%2023%20Th%C3%A1ng%2010%20Ph%C6%B0%C6%A1ng%20S%C6%A1n%20Nha%20Trang"
  },
  {
    id: "act-40",
    title: "100 에그 머드 온천(100 Egg Mud Bath) 달걀 욕조 & 숲속 워터파크",
    titleEn: "100 Egg Mud Spa & Mineral Hot Spring Theme Park",
    category: "mudbath",
    categoryLabel: "이색 머드 온천",
    badge: "이색 달걀탕",
    rating: 4.2,
    reviewCount: 1950,
    duration: "3 ~ 4시간 (반일 코스)",
    bestTime: "오전 09:30 ~ 12:30 또는 오후 14:00 ~ 17:00",
    location: "Đại lộ Nguyễn Tất Thành, Xã Phước Đồng, Nha Trang, Khánh Hòa",
    googleMapQuery: "Khu Du Lịch Tắm Bùn Trăm Trứng Nguyễn Tất Thành Phước Đồng Nha Trang",
    priceVnd: 350000,
    pricePer: "2인 프라이빗 에그 욕조 머드탕 + 온천 수영장",
    tags: ["달걀모양욕조", "숲속테마파크", "온천폭포", "이색인생샷"],
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "울창한 열대 숲속 산비탈을 따라 설치된 수백 개의 거대한 달걀 모양 석재 욕조 안에서 즐기는 따뜻한 미네랄 머드 배스와 인공 온천 폭포 수영장!",
    included: [
      "프라이빗 에그 머드 욕조 배스 (20~25분)",
      "하이드로테라피 온천 샤워 & 자쿠지",
      "야외 미네랄 온천 수영장 및 워터 슬라이드 자유 이용",
      "타월 및 기본 생수"
    ],
    notIncluded: ["시내 중심 왕복 그랩 요금 (차량 15분, 편도 약 8~9만 동)"],
    whatToBring: ["머드용 어두운 수영복", "방수팩", "갈아입을 옷"],
    coupleTip: "거대한 달걀 껍데기 속에 둘이 쏙 들어가 머드를 바르고 찍는 사진이 아주 유쾌하고 귀엽습니다! 산속이라 공기가 맑고 조용해 색다른 숲속 힐링을 선사합니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Khu%20Du%20L%E1%BB%8Bch%20T%E1%BA%AFm%20B%C3%B9n%20Tr%C4%83m%20Tr%E1%BB%A9ng%20Nguy%E1%BB%85n%20T%E1%BA%A5t%20Th%C3%A0nh%20Ph%C6%B0%E1%BB%9Bc%20%C4%90%E1%BB%93ng%20Nha%20Trang"
  },
  {
    id: "act-41",
    title: "갈리나 머드바스 & 스파(Galina) 시내 중심 동굴 테마 실내 온천",
    titleEn: "Galina Hotel In-City Cave Mud Bath & Mineral Spa",
    category: "mudbath",
    categoryLabel: "시내 머드 스파",
    badge: "도심 속 머드",
    rating: 4.5,
    reviewCount: 880,
    duration: "2 ~ 2.5시간",
    bestTime: "낮 12:00 ~ 15:00 (가장 더운 낮 시간대 도심 힐링)",
    location: "31 Hùng Vương, Phường Lộc Thọ, Nha Trang, Khánh Hòa",
    googleMapQuery: "Galina Hotel & Spa 31 Hùng Vương Lộc Thọ Nha Trang",
    priceVnd: 380000,
    pricePer: "2인 프라이빗 동굴 머드욕 + 사우나 + 온수풀",
    tags: ["시내한복판", "도보이동가능", "동굴인테리어", "사우나자쿠지"],
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "교외로 멀리 나가지 않고 시내 호텔 한복판에서 즐기는 유일한 머드 스파! 신비로운 천연 동굴 인테리어와 미네랄 머드탕, 핀란드식 사우나, 자쿠지 완비.",
    included: [
      "프라이빗 동굴 미네랄 머드 배스 (20분)",
      "건식 & 습식 사우나 이용",
      "온천수 자쿠지 및 실내 미네랄 풀 이용",
      "수영복 및 타월 무료 대여"
    ],
    notIncluded: ["개인 마사지 추가 트리트먼트"],
    whatToBring: ["가벼운 옷차림 (수영복/타월 매장 내 무료 제공)"],
    coupleTip: "야시장이나 시내 카페에서 도보 5분 거리라 이동 시간을 절약하고 싶은 날 최고입니다. 한낮의 뙤약볕을 피해 시원하고 아늑한 동굴 속에서 둘만의 머드 스파를 즐겨보세요.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Galina%20Hotel%20%26%20Spa%2031%20H%C3%B9ng%20V%C6%B0%C6%A1ng%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang"
  },
  {
    id: "act-42",
    title: "참 스파 그랜드(Charm Spa Grand) 프리미엄 허브볼 & 선인장 오일 마사지",
    titleEn: "Charm Spa Grand Premium Herbal Compress & Cactus Oil Massage",
    category: "spa",
    categoryLabel: "프리미엄 스파",
    badge: "평점 4.9 스파",
    rating: 4.9,
    reviewCount: 2650,
    duration: "90분 ~ 120분",
    bestTime: "저녁 19:00 ~ 21:30 (하루 일정 마무리)",
    location: "48C Nguyễn Thị Minh Khai, Phường Tân Lập, Nha Trang, Khánh Hòa",
    googleMapQuery: "Charm Spa Grand Nha Trang 48C Nguyễn Thị Minh Khai Tân Lập Nha Trang",
    priceVnd: 620000,
    pricePer: "90분 시그니처 허브 & 핫스톤 코스 1인 기준",
    tags: ["선인장오일", "한방허브볼", "프라이빗커플룸", "수제디저트제공"],
    images: [
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "구글 평점 4.9점에 빛나는 나트랑 최고급 웰니스 스파로, 보습에 탁월한 유기농 선인장 오일과 따뜻한 한방 허브볼, 핫스톤 테라피로 몸 전체의 림프를 순환시키는 극상의 힐링!",
    included: [
      "웰컴 허브티 및 아로마 족욕 풋 스파",
      "프라이빗 2인 커플 VIP 전용 룸",
      "선인장 오일 & 한방 허브 압착 & 핫스톤 전신 케어",
      "스파 후 전통 수제 죽 또는 수제 요거트 디저트"
    ],
    notIncluded: ["테라피스트 매너 팁"],
    whatToBring: ["편안한 복장"],
    coupleTip: "카카오톡(Charmspant)으로 미리 커플룸을 예약하고 가시는 것을 권장합니다. 마사지 전 아로마 오일 향을 직접 시향하고 선택할 수 있으며, 마사지 후 나오는 따뜻한 영양죽과 과일 디저트가 감동적입니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Grand%20Nha%20Trang%2048C%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang"
  },
  {
    id: "act-43",
    title: "퓨어 베트남 뷰티 & 스파(Pure Vietnam) 호주식 딥티슈 & 맞춤 체형 힐링",
    titleEn: "Pure Vietnam Beauty & Spa Australian Standard Deep Tissue & Lomi Lomi",
    category: "spa",
    categoryLabel: "인터내셔널 스파",
    badge: "전문가 마사지",
    rating: 4.9,
    reviewCount: 1280,
    duration: "90분 ~ 120분",
    bestTime: "저녁 18:30 ~ 21:00",
    location: "44 Đ. Ngô Quyền, Phường Vạn Thạnh, Nha Trang, Khánh Hòa",
    googleMapQuery: "Pure Vietnam Beauty & Spa 44 Ngô Quyền Vạn Thạnh Nha Trang",
    priceVnd: 650000,
    pricePer: "90분 딥티슈 / 로미로미 마사지 1인 기준",
    tags: ["호주스탠다드", "딥티슈전문", "체형교정지압", "청결도1위"],
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80"
    ],
    highlight: "트립어드바이저 수년 연속 1위 수상! 호주인이 직접 운영하며 국제 스탠다드로 교육받은 전문 테라피스트들이 뭉친 근육을 정확하게 풀어주는 정통 딥티슈 & 로미로미 마사지.",
    included: [
      "사전 1:1 맞춤형 컨설팅 (강도 및 집중 부위 체크)",
      "매 세션 침구류 100% 교체 청결 보장",
      "오가닉 아로마 오일 전신 케어",
      "허브티 & 열대과일 디저트"
    ],
    notIncluded: ["테라피스트 팁"],
    whatToBring: ["편한 옷차림"],
    coupleTip: "일반적인 부드러운 오일 마사지보다 목, 어깨, 허리의 뭉친 근육을 시원하게 풀고 싶어 하는 많은 여행자들에게 압도적인 찬사를 받는 곳입니다. 함께 받으면 여행의 피로가 완벽히 풀립니다.",
    bookingUrl: "https://www.google.com/maps/search/?api=1&query=Pure%20Vietnam%20Beauty%20%26%20Spa%2044%20Ng%C3%B4%20Quy%E1%BB%81n%20V%E1%BA%A1n%20Th%E1%BA%A1nh%20Nha%20Trang"
  }
];

// Current standard conversion rate (approximate for quick budget calculation)
// 100,000 VND ≈ 5,450 KRW (1 VND ≈ 0.0545 KRW)
// SINGLE SOURCE OF TRUTH: every KRW figure in the app derives from this constant —
// card price estimates (formatKRW), the header calculator modal, and the currency
// tab calculator's default benchmark (currentBenchmarkRate = this * 100).
// The currency tab's rate preset buttons (5.40 / 5.45 / 5.50) override it at runtime.
const DEFAULT_EXCHANGE_RATE = 0.0545;
