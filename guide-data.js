/**
 * ============================================================================
 * Nha Trang Trip 2026 - Travel Tips & Survival Kit Hub Dataset
 * File: guide-data.js
 * Single Source of Truth (SSOT) for Phase 2 Guide Hub Domain
 * ============================================================================
 */

const NHA_TRANG_GUIDE_HUB = {
  // --------------------------------------------------------------------------
  // 1. Transport & Grab Guide (교통 & 그랩 완벽 가이드)
  // --------------------------------------------------------------------------
  transport: {
    airportMatrix: [
      {
        id: "route-camranh-city",
        routeKo: "깜란 국제공항 ↔ 나트랑 시내 (호텔/시내 중심부)",
        routeVi: "Sân bay Cam Ranh ↔ Trung tâm TP Nha Trang",
        distanceKm: 35,
        durationMins: "40~45분",
        sedan4SeatVnd: 250000,
        sedan4SeatKrw: 13600,
        suv7SeatVnd: 300000,
        suv7SeatKrw: 16300,
        van16SeatVnd: 550000,
        van16SeatKrw: 30000,
        busOption: "18번 Dat Moi 공항버스: 1인 60,000 VND (~3,270원), 시내 예르생 공원 하차 (50~60분)",
        nightSurcharge: "야간 심야(22:00~06:00) 탑승 시 평균 +50,000 VND 할증",
        tip: "공항 톨게이트 통행료(15,000 VND)는 일반적으로 기사가 별도 청구하거나 요금에 포함되므로 탑승 전 사전 확인 권장"
      },
      {
        id: "route-camranh-resorts",
        routeKo: "깜란 국제공항 ↔ 바이따이 리조트 단지 (아남, 알마, 미아, 래디슨 등)",
        routeVi: "Sân bay Cam Ranh ↔ Khu nghỉ dưỡng Bãi Dài",
        distanceKm: 12,
        durationMins: "10~15분",
        sedan4SeatVnd: 150000,
        sedan4SeatKrw: 8200,
        suv7SeatVnd: 180000,
        suv7SeatKrw: 9800,
        van16SeatVnd: 350000,
        van16SeatKrw: 19100,
        busOption: "공항버스 미정차 구간 (택시 또는 리조트 전용 셔틀버스 이용)",
        nightSurcharge: "야간 심야(22:00~06:00) 탑승 시 평균 +30,000 VND 할증",
        tip: "대부분의 5성급 리조트에서 사전 투숙객 무료 또는 할인 셔틀을 제공하므로 체크인 전 호텔 문의 필수"
      },
      {
        id: "route-city-doclet",
        routeKo: "나트랑 시내 ↔ 독렛 해변 / 파라다이스 리조트",
        routeVi: "TP Nha Trang ↔ Bãi biển Dốc Lết",
        distanceKm: 45,
        durationMins: "55~65분",
        sedan4SeatVnd: 450000,
        sedan4SeatKrw: 24500,
        suv7SeatVnd: 500000,
        suv7SeatKrw: 27200,
        van16SeatVnd: 850000,
        van16SeatKrw: 46300,
        busOption: "3번 시외버스 이용 가능: 1인 약 30,000 VND (약 1시간 30분 소요)",
        nightSurcharge: "장거리 편도 탑승 후 시내 복귀 차량 수배 어려우므로 왕복 대절 권장",
        tip: "독렛 해변 투어 시 당일 기사와 왕복 대기 시간 포함 대절(약 800,000~900,000 VND) 협상이 유리"
      },
      {
        id: "route-city-vinwonders",
        routeKo: "나트랑 시내 ↔ 빈원더스 케이블카 / 스피드보트 선착장",
        routeVi: "TP Nha Trang ↔ Cảng cáp treo VinWonders",
        distanceKm: 6,
        durationMins: "12~15분",
        sedan4SeatVnd: 80000,
        sedan4SeatKrw: 4400,
        suv7SeatVnd: 95000,
        suv7SeatKrw: 5200,
        van16SeatVnd: 200000,
        van16SeatKrw: 10900,
        busOption: "4번 시내버스: 1인 9,000 VND (약 25분 소요)",
        nightSurcharge: "야간 퇴장 시간(20:00~21:30) 그랩 호출 급증으로 현장 Xanh SM 또는 마이린 택시 대기열 이용 추천",
        tip: "타타쇼 관람 후 일제히 퇴장 시 그랩 호출 대기 시간이 20분 이상 소요되므로 선착장 택시 정류장 이용이 신속"
      }
    ],
    taxiComparison: {
      xanhSM: {
        nameKo: "Xanh SM 전기 택시 (빈패스트 EV)",
        nameVi: "Taxi Xanh SM (VinFast Electric)",
        color: "청록색 (Cyan)",
        pros: "순수 100% 전기차로 매연/엔진 소음 및 차량 냄새 제로, 멀미 예방에 최적. 빈그룹 직영 정찰제 미터기, 친절한 유니폼 기사, 카드 결제 및 전용 앱 호출 가능",
        cons: "비 오는 날이나 출퇴근 피크 타임에 배차가 다소 지연될 수 있음",
        hotline: "1900 2088",
        bookingMethod: "Xanh SM 전용 앱 (한국 카드 등록 가능) 또는 길거리 청록색 차량 손흔들기",
        recommendation: "가족 여행자, 냄새에 민감한 임산부 및 아이 동반 여행객 1순위 추천"
      },
      grab: {
        nameKo: "그랩 (GrabCar & GrabBike)",
        nameVi: "Grab Việt Nam",
        color: "초록색 (Green 앱 아이콘)",
        pros: "탑승 전 확정 정찰 요금 결제, 경로 실시간 트래킹, 인앱 자동 번역 채팅 지원, 트래블로그/트래블월렛 카드 자동 결제 지원",
        cons: "피크 타임 및 우천 시 탄력 할증(Surge Pricing)으로 요금 상승, 공항 픽업 시 톨게이트 비용(15,000 VND) 현금 요구 가능",
        hotline: "인앱 고객센터 24h 지원",
        bookingMethod: "Grab 모바일 앱",
        recommendation: "언어 소통 부담 없이 목적지를 정확히 입력하고 요금 분쟁을 피하고 싶은 여행객"
      },
      traditionalTaxis: {
        nameKo: "정규 브랜드 택시 (마이린 & 비나선)",
        nameVi: "Taxi Truyền Thống (Mai Linh & Vinasun)",
        color: "마이린: 초록색 / 비나선: 흰색 바탕에 빨강·초록 스트라이프",
        pros: "나트랑 시내 주요 호텔, 대형 마트, 관광지 앞에 상시 대기. 정규 미터기 요금 체계",
        cons: "미터기 미작동 요구 가능성, 잔돈 미반환 잔돈 팁 요구 가능성",
        hotline: "마이린: 0258 38 38 38 38 (단축 1055) / 비나선: 0258 38 27 27 27",
        bookingMethod: "호텔 벨보이 호출 요청 또는 승강장 상시 탑승",
        recommendation: "그랩 배차가 잡히지 않는 급한 상황이거나 야간 귀가 시"
      }
    },
    scamPrevention: [
      {
        id: "scam-01",
        titleKo: "공항 가짜 네임보드 / 예약 가로채기",
        warningText: "공항 입국장에서 예약자 이름과 유사한 피켓을 들고 다가와 '내가 그 기사다'라며 사설 바가지 차량으로 유도하는 수법",
        actionRule: "반드시 탑승 전 예약한 여행사/호텔 기사의 이름, 차량 번호판, 예약 확정 바우처를 대조하고 일치할 때만 탑승하세요."
      },
      {
        id: "scam-02",
        titleKo: "화폐 혼동 지갑 손대기 사기 (50만동 vs 2만동)",
        warningText: "베트남 동 화폐 색상이 유사한 점을 악용해 기사가 '내가 잔돈을 찾아주겠다'며 여행자의 지갑에 직접 손을 대고 고액권을 빼가는 수법",
        actionRule: "절대 지갑을 통째로 기사에게 보여주거나 건네지 마세요. 밝은 곳에서 액면가 0의 개수를 확인하고 직접 지불하세요."
      },
      {
        id: "scam-03",
        titleKo: "고속 회전 변조 미터기 (터보 미터)",
        warningText: "정체불명의 사설 택시(Xe Dù)가 미터기를 불법 개조하여 100m마다 요금이 폭증하도록 조작하는 수법",
        actionRule: "길거리 탑승 시 반드시 공인 브랜드(Xanh SM, Mai Linh, Vinasun)만 이용하고, 탑승 즉시 미터기 기본요금(약 10,000~12,000 VND) 시작을 확인하세요."
      },
      {
        id: "scam-04",
        titleKo: "호텔/식당 폐업 거짓말 및 리베이트 매장 유인",
        warningText: "목적지 호텔이나 맛집이 '오늘 화재/수리로 영업 안 한다'며 기사와 결탁된 비싼 식당이나 맛사지숍으로 강제 이동하는 수법",
        actionRule: "기사의 말을 무시하고 구글 지도 앱을 켜서 '원래 목적지 정문으로 가달라'고 단호하게 베트남어 플래시카드를 보여주세요."
      },
      {
        id: "scam-05",
        titleKo: "길거리 가짜 그랩바이크 호객 (No App)",
        warningText: "그랩 헬멧이나 조끼만 입고 앱 호출 없이 길거리에서 '그랩, 그랩 싸다'며 탑승을 유도한 뒤 도착 후 수배 요금을 요구하는 수법",
        actionRule: "그랩은 100% 모바일 앱으로 호출하여 번호판이 일치하는 기사의 바이크만 탑승해야 사고 시 보험 및 요금 보장이 됩니다."
      }
    ],
    intercityBuses: [
      {
        destination: "달랏 (Đà Lạt)",
        distanceKm: 135,
        duration: "3시간 30분 ~ 4시간",
        routeFeature: "해발 1,500m 칸레(Khánh Lê) 산악 고개를 넘는 환상적인 풍경, 급커브 구간 다수",
        majorOperators: [
          { name: "Phuong Trang (FUTA Bus)", type: "28인승 우등 리무진", fareVnd: 170000, fareKrw: 9300 },
          { name: "Cuc Tung Limousine", type: "9인승/11인승 VIP 리무진", fareVnd: 200000, fareKrw: 10900 },
          { name: "Lac Hong Limousine", type: "9인승 프리미엄 리무진", fareVnd: 220000, fareKrw: 12000 }
        ],
        tips: "칸레 고개의 급커브로 멀미가 발생하기 쉬우므로 탑승 30분 전 멀미약(Nautamine) 복용 필수. 시내 호텔 픽업 셔틀 여부 사전 확인."
      },
      {
        destination: "무이네 / 판티엣 (Mũi Né / Phan Thiết)",
        distanceKm: 220,
        duration: "4시간 ~ 4시간 30분",
        routeFeature: "남부 해안 고속도로를 따라 이동하는 쾌적한 평지 코스",
        majorOperators: [
          { name: "Phuong Trang (FUTA Bus)", type: "슬리핑 버스 (Sleeper)", fareVnd: 165000, fareKrw: 9000 },
          { name: "Hanh Cafe", type: "슬리핑 버스", fareVnd: 150000, fareKrw: 8200 },
          { name: "The Sinh Tourist", type: "우등 리무진 / 슬리퍼", fareVnd: 180000, fareKrw: 9800 }
        ],
        tips: "사막 일출 지프 투어와 연계할 경우 전날 밤 슬리핑 버스로 심야 이동하거나 새벽 첫차 리무진 이용 추천."
      }
    ],
    motorbikeRental: {
      pricePerDayVnd: "100,000 ~ 150,000 VND (스쿠터 기준, 한화 약 5,500~8,200원)",
      popularModels: "Honda Vision (110cc 여성/초보자 추천), Honda AirBlade (125cc 승차감 우수), Honda Lead (수납공간 최대)",
      depositRules: "여권 원본 절대 보관 금지 (여권 사진 사본 + 호텔 룸 번호 확인으로 대체 협상)",
      legalRequirements: "대한민국-베트남 1968년 비엔나 협약 상호인정 국제운전면허증 소지 권장. 헬멧 착용은 베트남 도로교통법상 100% 필수 의무",
      fuelType: "가솔린 Ron 95 (A95) 권장 (리터당 약 24,000 VND)",
      safetyTip: "중앙선 침범 및 역주행 오토바이가 많으므로 시내 30~40km/h 저속 방어 운전 필수, 우회전 시에도 항상 전방 및 좌우 주시"
    }
  },

  // --------------------------------------------------------------------------
  // 2. Lotte Mart Top 30 Souvenir Price Matrix (롯데마트 30대 쇼핑 시세표)
  // --------------------------------------------------------------------------
  shoppingPriceMatrix: {
    items: [
      {
        id: "souv-01",
        nameKo: "아치카페 코코넛 카푸치노",
        nameVi: "Cà phê Archcafé Coconut Cappuccino",
        category: "coffee",
        unit: "12포 (240g 박스)",
        officialPriceVnd: 68000,
        marketBargainPriceVnd: 60000,
        targetDiscountPercent: 33,
        originalVsFakeTip: "정품은 박스 측면 홀로그램 스티커 및 엠보싱 인쇄 확인. 야시장 저가 모조품은 설탕 비율이 높고 향이 인위적임.",
        customsAllowed: true,
        description: "고소한 코코넛 밀크와 부드러운 카푸치노의 조화로 한국인 여행자 1위 선호 믹스커피"
      },
      {
        id: "souv-02",
        nameKo: "체리쉬 망고 푸딩 젤리",
        nameVi: "Thạch pudding Cherish vị xoài",
        category: "snack",
        unit: "850g 대용량 (약 24개)",
        officialPriceVnd: 62000,
        marketBargainPriceVnd: 55000,
        targetDiscountPercent: 31,
        originalVsFakeTip: "정품 Cherish 로고 및 개별 포장재의 코코넛 젤리 알갱이 크기 확인. 유사 가짜 브랜드(Cheris 등) 주의.",
        customsAllowed: true,
        description: "생망고 과즙이 풍부하고 탱글탱글한 코코넛 젤리가 씹히는 베트남 대표 국민 젤리"
      },
      {
        id: "souv-03",
        nameKo: "베트남 A급 껍질 캐슈넛",
        nameVi: "Hạt điều rang muối vỏ lụa loại A",
        category: "nuts",
        unit: "500g 진공 밀봉캔",
        officialPriceVnd: 135000,
        marketBargainPriceVnd: 110000,
        targetDiscountPercent: 39,
        originalVsFakeTip: "담시장 구매 시 진공 포장 상태 확인 필수. 껍질째 볶아 알이 굵고 부서짐이 없는 W240/W320 등급 선택.",
        customsAllowed: true,
        description: "얇은 껍질째 볶아 고소함과 짭짤함이 극대화된 영양 만점 프리미엄 특산 견과류"
      },
      {
        id: "souv-04",
        nameKo: "친수 칠리소스 오리지널",
        nameVi: "Tương ớt Chin-Su truyền thống",
        category: "sauce",
        unit: "250g 보틀",
        officialPriceVnd: 14500,
        marketBargainPriceVnd: 15000,
        targetDiscountPercent: 40,
        originalVsFakeTip: "마트 정찰제 구매가 시장보다 저렴하며 유통기한이 가장 넉넉함. 마개 밀봉 상태 확인.",
        customsAllowed: true,
        description: "튀김, 쌀국수, 해산물 어디에나 잘 어울리는 감칠맛 넘치는 베트남 국민 매콤 소스"
      },
      {
        id: "souv-05",
        nameKo: "푸꾸옥 40N 피시소스 (느억맘)",
        nameVi: "Nước mắm Phú Quốc Khải Hoàn 40N",
        category: "sauce",
        unit: "500ml 보틀",
        officialPriceVnd: 65000,
        marketBargainPriceVnd: 65000,
        targetDiscountPercent: 24,
        originalVsFakeTip: "라벨에 표기된 단백질 질소 함량 '40°N' 확인. 기내 반입 불가 품목이므로 위탁 수하물 에어캡 3중 밀봉 필수.",
        customsAllowed: true,
        description: "100% 멸치와 천일염으로 전통 숙성한 최고급 원액 피시소스로 볶음 요리 필수템"
      },
      {
        id: "souv-06",
        nameKo: "비나밋 건조 잭푸르트 칩",
        nameVi: "Mít sấy Vinamit Jackfruit Chips",
        category: "dried_fruit",
        unit: "100g 지퍼백",
        officialPriceVnd: 38000,
        marketBargainPriceVnd: 35000,
        targetDiscountPercent: 30,
        originalVsFakeTip: "진공 동결 건조로 바삭한 식감이 유지되는 Vinamit 정품 홀로그램 및 지퍼백 실링 확인.",
        customsAllowed: true,
        description: "인공 감미료 없이 천연 잭푸르트의 달콤함과 바삭바삭한 식감을 살린 건강 간식"
      },
      {
        id: "souv-07",
        nameKo: "탑젤리 코코 망고맛",
        nameVi: "Kẹo dẻo CoCo Top Jelly vị xoài",
        category: "snack",
        unit: "320g 봉지",
        officialPriceVnd: 35000,
        marketBargainPriceVnd: 28000,
        targetDiscountPercent: 44,
        originalVsFakeTip: "야시장 가짜 모조품 극심: 포장지 우측 상단 CoCo 은박 홀로그램과 선명한 망고 일러스트 확인 필수.",
        customsAllowed: true,
        description: "쫄깃쫄깃한 식감과 진한 생망고 향으로 선물용 대량 구매 1위 망고 젤리"
      },
      {
        id: "souv-08",
        nameKo: "하이랜드 전통 블렌드 원두",
        nameVi: "Cà phê bột Highlands Coffee truyền thống",
        category: "coffee",
        unit: "200g 팩",
        officialPriceVnd: 62000,
        marketBargainPriceVnd: 60000,
        targetDiscountPercent: 25,
        originalVsFakeTip: "베트남 1위 커피 프랜차이즈 정품 알루미늄 증착 밸브 팩 및 유통기한 확인.",
        customsAllowed: true,
        description: "로부스타와 아라비카를 최적의 비율로 로스팅하여 구수하고 묵직한 바디감"
      },
      {
        id: "souv-09",
        nameKo: "킹망고 무설탕 건망고",
        nameVi: "Xoài sấy dẻo ít đường King Mango",
        category: "dried_fruit",
        unit: "500g 팩",
        officialPriceVnd: 145000,
        marketBargainPriceVnd: 130000,
        targetDiscountPercent: 35,
        originalVsFakeTip: "설탕 절임 과다 제품과 구분: 표면에 하얀 설탕 가루가 없고 과육 고유의 노란빛과 쫀득함 확인.",
        customsAllowed: true,
        description: "인공 설탕 첨가를 최소화하여 생망고 그대로의 상큼 달콤한 과즙을 담아낸 프리미엄 건망고"
      },
      {
        id: "souv-10",
        nameKo: "게리 치즈 크래커",
        nameVi: "Bánh quy phô mai Gery Saluut Malkist",
        category: "snack",
        unit: "220g (20개입)",
        officialPriceVnd: 33000,
        marketBargainPriceVnd: 30000,
        targetDiscountPercent: 33,
        originalVsFakeTip: "한쪽 면에 두툼하게 코팅된 프리미엄 슈가 치즈 크림과 바삭한 크래커 식감 확인.",
        customsAllowed: true,
        description: "단짠단짠의 정석으로 남녀노소 호불호 없이 즐기는 베스트셀러 티푸드 크래커"
      },
      {
        id: "souv-11",
        nameKo: "쭝응웬 레전드 스페셜 에디션",
        nameVi: "Cà phê Trung Nguyên Legend Special Edition",
        category: "coffee",
        unit: "18포 (450g)",
        officialPriceVnd: 75000,
        marketBargainPriceVnd: 70000,
        targetDiscountPercent: 26,
        originalVsFakeTip: "나폴레옹 등 역사적 인물 초상이 인쇄된 블랙 골드 프리미엄 박스 패키지 확인.",
        customsAllowed: true,
        description: "초미세 분쇄 원두가 블렌딩되어 깊고 진한 나노 크레마를 즐길 수 있는 고급 인스턴트 커피"
      },
      {
        id: "souv-12",
        nameKo: "미스터 비엣 아라비카 분쇄원두",
        nameVi: "Cà phê xay Mr. Viet Arabica",
        category: "coffee",
        unit: "250g 팩",
        officialPriceVnd: 95000,
        marketBargainPriceVnd: 90000,
        targetDiscountPercent: 25,
        originalVsFakeTip: "농부 일러스트 정품 패키지 및 원두 산지(달랏/람동) 표기 바코드 확인.",
        customsAllowed: true,
        description: "감각적인 일러스트 패키지와 초콜릿/캐러멜 아로마가 어우러져 선물용으로 인기 만점"
      },
      {
        id: "souv-13",
        nameKo: "콘삭 다람쥐 똥 헤이즐넛 드립백",
        nameVi: "Cà phê phin giấy Con Sóc Hazelnut",
        category: "coffee",
        unit: "10개입 박스 (설탕 포함)",
        officialPriceVnd: 82000,
        marketBargainPriceVnd: 80000,
        targetDiscountPercent: 27,
        originalVsFakeTip: "다람쥐 로고 및 개별 종이 필터 드립백 구조 확인 (실제 다람쥐똥이 아닌 헤이즐넛 향 원두 블렌드).",
        customsAllowed: true,
        description: "종이 핀 드리퍼가 내장되어 뜨거운 물만 부으면 간편하게 즐기는 헤이즐넛 풍미 커피"
      },
      {
        id: "souv-14",
        nameKo: "달랏 아티초크 앰플 티백",
        nameVi: "Trà Atisô Ladophar Đà Lạt",
        category: "tea",
        unit: "100티백 대용량 박스",
        officialPriceVnd: 98000,
        marketBargainPriceVnd: 90000,
        targetDiscountPercent: 31,
        originalVsFakeTip: "달랏 제약회사 라도파(Ladophar) 정품 인증 홀로그램 라벨 확인.",
        customsAllowed: true,
        description: "간 기능 개선, 숙취 해소, 혈액 순환에 탁월한 달랏 고원 청정 특산 건강차"
      },
      {
        id: "souv-15",
        nameKo: "하오하오 핑크 새우맛 봉지라면",
        nameVi: "Mì Hảo Hảo tôm chua cay",
        category: "noodles",
        unit: "75g 봉지",
        officialPriceVnd: 4200,
        marketBargainPriceVnd: 4500,
        targetDiscountPercent: 44,
        originalVsFakeTip: "베트남 Acecook 제조 핑크색 포장지 확인. 순수 해산물/채소 성분으로 한국 입국 검역 100% 통과.",
        customsAllowed: true,
        description: "매콤 새콤한 똠얌 새우 국물이 일품이며 그릇에 면과 스프를 넣고 끓는 물만 부어 먹는 컵라면식 봉지면"
      },
      {
        id: "souv-16",
        nameKo: "비폰 포보 소고기 쌀국수 용기면",
        nameVi: "Phở bò Vifon tô cao cấp",
        category: "noodles",
        unit: "120g 보울",
        officialPriceVnd: 22000,
        marketBargainPriceVnd: 22000,
        targetDiscountPercent: 37,
        originalVsFakeTip: "주의: 레토르트 실제 소고기 건더기 파우치 포함 제품은 한국 세관 검역 대상이므로 분말/향미유 버전 선택 권장.",
        customsAllowed: false,
        description: "진한 양지 육수와 부드러운 쌀국수 건면이 조화로운 베트남 1등 포보 쌀국수"
      },
      {
        id: "souv-17",
        nameKo: "무오이 티에우 짠 라임 후추 소금",
        nameVi: "Muối tiêu chanh Nha Trang",
        category: "sauce",
        unit: "120g 보틀",
        officialPriceVnd: 11000,
        marketBargainPriceVnd: 12000,
        targetDiscountPercent: 40,
        originalVsFakeTip: "나트랑 특산 천일염, 푸꾸옥 후추, 건조 라임 파우더 배합비 및 밀봉 캡 확인.",
        customsAllowed: true,
        description: "해산물 구이, 삶은 계란, 닭고기를 찍어 먹을 때 감칠맛을 극대화해주는 만능 시즈닝"
      },
      {
        id: "souv-18",
        nameKo: "비나밀크 옹토 붉은 라벨 연유",
        nameVi: "Sữa đặc có đường Ông Thọ đỏ",
        category: "dairy",
        unit: "380g 캔",
        officialPriceVnd: 26000,
        marketBargainPriceVnd: 25000,
        targetDiscountPercent: 29,
        originalVsFakeTip: "원조 할아버지 일러스트 붉은 라벨(Red Label)이 가장 유지방 함량이 높고 풍미가 진함.",
        customsAllowed: true,
        description: "베트남 현지 카페쓰어다(연유커피)의 묵직하고 달콤한 풍미를 100% 재현하는 필수 연유"
      },
      {
        id: "souv-19",
        nameKo: "비엣코코 엑스트라 버진 코코넛 오일",
        nameVi: "Dầu dừa nguyên chất Vietcoco Extra Virgin",
        category: "cosmetic",
        unit: "250ml 병",
        officialPriceVnd: 78000,
        marketBargainPriceVnd: 75000,
        targetDiscountPercent: 32,
        originalVsFakeTip: "냉압착 100% 비정제 엑스트라 버진 인증 마크 및 24도 이하 응고 현상 확인.",
        customsAllowed: true,
        description: "헤어 에센스, 바디 보습, 마사지용으로 피부 진정과 윤기를 더해주는 유기농 코코넛 오일"
      },
      {
        id: "souv-20",
        nameKo: "백호 활락유 타이거 밤",
        nameVi: "Dầu xoa bóp Bạch Hổ Hoạt Lạc Cao",
        category: "health",
        unit: "20g 틴케이스",
        officialPriceVnd: 38000,
        marketBargainPriceVnd: 35000,
        targetDiscountPercent: 42,
        originalVsFakeTip: "베트남 전통 약국 유통 정품 바코드 및 호랑이 각인 틴케이스 확인.",
        customsAllowed: true,
        description: "근육통, 관절염, 벌레 물린 곳, 두통 완화에 시원한 쿨링감을 주는 전통 만병통치 연고"
      },
      {
        id: "souv-21",
        nameKo: "산에스트 칸호아 제비집 음료",
        nameVi: "Nước yến sào Khánh Hòa Sanest",
        category: "health",
        unit: "6병 선물세트 (70ml*6)",
        officialPriceVnd: 235000,
        marketBargainPriceVnd: 230000,
        targetDiscountPercent: 21,
        originalVsFakeTip: "칸호아 국영 제비집 회사 정품 골드 라벨 및 제비집 원액 7.5% 함유 표기 확인.",
        customsAllowed: true,
        description: "나트랑 앞바다 야생 제비집 추출물로 제조된 최고급 프리미엄 면역력 보양 음료"
      },
      {
        id: "souv-22",
        nameKo: "베트남 서원 마카다미아 통넛",
        nameVi: "Hạt mắc ca Tây Nguyên nứt vỏ kèm đồ khui",
        category: "nuts",
        unit: "500g 팩 (전용 오프너 포함)",
        officialPriceVnd: 165000,
        marketBargainPriceVnd: 140000,
        targetDiscountPercent: 36,
        originalVsFakeTip: "껍질에 커팅 홈이 균일하게 파여 있고 쇠 오프너가 동봉되어 쉽게 쪼개지는지 확인.",
        customsAllowed: true,
        description: "버터처럼 부드럽고 고소한 풍미가 가득한 고원 지대 특산 프리미엄 영양 견과류"
      },
      {
        id: "souv-23",
        nameKo: "쭝응웬 레전드 카페쓰어다 스틱",
        nameVi: "Cà phê hòa tan Legend Cà Phê Sữa Đá",
        category: "coffee",
        unit: "9포 (225g)",
        officialPriceVnd: 55000,
        marketBargainPriceVnd: 50000,
        targetDiscountPercent: 33,
        originalVsFakeTip: "박스 개봉부 금박 씰 및 얼음잔 일러스트 패키지 정품 확인.",
        customsAllowed: true,
        description: "얼음만 넣으면 바로 완성되는 현지 노천카페 정통 연유커피의 진하고 달콤한 맛"
      },
      {
        id: "souv-24",
        nameKo: "수제 라탄 원형 탬버린백",
        nameVi: "Túi mây tre đan tròn handmade Nha Trang",
        category: "craft",
        unit: "1개 (지름 20cm 규격)",
        officialPriceVnd: 180000,
        marketBargainPriceVnd: 130000,
        targetDiscountPercent: 63,
        originalVsFakeTip: "담시장/야시장 구매 추천: 천연 라탄 훈연 향, 가죽 끈 바느질 마감 및 안감 패턴 확인.",
        customsAllowed: true,
        description: "휴양지 룩과 완벽하게 어울리는 내구성 뛰어난 베트남 장인 수공예 라탄 가방"
      },
      {
        id: "souv-25",
        nameKo: "수제 자수 실크 파우치 3종",
        nameVi: "Bộ 3 túi lụa thêu tay thủ công",
        category: "craft",
        unit: "3종 세트",
        officialPriceVnd: 85000,
        marketBargainPriceVnd: 70000,
        targetDiscountPercent: 53,
        originalVsFakeTip: "꽃 자수의 올 풀림 여부, 내부 부드러운 안감 마감 및 지퍼 부드러움 체크.",
        customsAllowed: true,
        description: "섬세한 전통 손자수가 놓여 있어 화장품 및 귀중품 보관용 선물로 인기"
      },
      {
        id: "souv-26",
        nameKo: "코코넛 껍질 자개 옻칠 볼",
        nameVi: "Bát gáo dừa cẩn xà cừ sơn mài",
        category: "craft",
        unit: "1개",
        officialPriceVnd: 55000,
        marketBargainPriceVnd: 45000,
        targetDiscountPercent: 50,
        originalVsFakeTip: "자개(Mother of Pearl) 조각의 접착 균일도와 외곽 천연 코코넛 껍질 크랙 여부 확인.",
        customsAllowed: true,
        description: "천연 코코넛 껍질 안쪽에 영롱한 천연 자개와 옻칠을 입힌 친환경 인테리어 식기"
      },
      {
        id: "souv-27",
        nameKo: "베트남 전통 논라 모자",
        nameVi: "Nón lá truyền thống Việt Nam",
        category: "craft",
        unit: "1개",
        officialPriceVnd: 45000,
        marketBargainPriceVnd: 35000,
        targetDiscountPercent: 56,
        originalVsFakeTip: "야자 잎 엮음 촘촘함과 턱 끈 리본 마감 상태 확인.",
        customsAllowed: true,
        description: "자외선 차단과 휴양지 인생샷 소품으로 최고의 가성비를 자랑하는 전통 원뿔 모자"
      },
      {
        id: "souv-28",
        nameKo: "구운 사차인치 오메가 스타넛츠",
        nameVi: "Hạt Sacha Inchi sấy giòn Tây Nguyên",
        category: "nuts",
        unit: "250g 팩",
        officialPriceVnd: 85000,
        marketBargainPriceVnd: 80000,
        targetDiscountPercent: 33,
        originalVsFakeTip: "오메가 3-6-9 풍부한 별 모양 슈퍼푸드 넛츠, 밀봉 지퍼백 바삭함 유지 확인.",
        customsAllowed: true,
        description: "세계 10대 슈퍼푸드로 꼽히는 청정 고원 지대 특산 오메가 지방산 덩어리 견과류"
      },
      {
        id: "souv-29",
        nameKo: "말린 패션후르츠 과육 칩",
        nameVi: "Chanh dây sấy dẻo Nha Trang",
        category: "dried_fruit",
        unit: "200g 팩",
        officialPriceVnd: 58000,
        marketBargainPriceVnd: 50000,
        targetDiscountPercent: 41,
        originalVsFakeTip: "과육 속 천연 씨앗이 씹히는 쫄깃한 식감과 과도한 착색료 무첨가 확인.",
        customsAllowed: true,
        description: "새콤달콤한 패션후르츠 특유의 비타민 풍미가 그대로 살아있는 매력적인 건과일"
      },
      {
        id: "souv-30",
        nameKo: "전통 알루미늄 커피 핀 드리퍼",
        nameVi: "Phin pha cà phê nhôm truyền thống",
        category: "craft",
        unit: "1인용 핀 세트",
        officialPriceVnd: 25000,
        marketBargainPriceVnd: 20000,
        targetDiscountPercent: 56,
        originalVsFakeTip: "드립 구멍의 간격이 균일하고 프레스 누름판이 견고한 알루미늄/스테인리스 재질 선택.",
        customsAllowed: true,
        description: "원두 가루와 연유만 있으면 집에서도 정통 베트남 드립 커피를 추출할 수 있는 도구"
      }
    ],
    bargainingTips: {
      marketName: "담시장 (Chợ Đầm) & 나트랑 야시장 (Chợ Đêm)",
      coreStrategy: [
        "1. 첫 호가의 50%부터 역제안 시작: 상인이 200,000동을 부르면 100,000동부터 시작하여 최종 120,000~130,000동 선에서 타결하세요.",
        "2. 스마트폰 계산기 활용: 베트남어 발음 혼선 없이 원하는 가격 숫자를 화면에 직접 입력하여 보여주세요.",
        "3. 돌아서기(Walk Away) 기술: 가격 협상이 막히면 정중히 인사하고 뒤돌아서는 순간 90% 확률로 상인이 붙잡고 가격을 낮춥니다.",
        "4. 묶음 구매(다량 구매) 할인: 3개 이상 구매 시 'Mua 3 cái thì tính bao nhiêu?' 플래시카드를 제시하여 추가 10~20% 할인을 유도하세요.",
        "5. 현금 잔돈 준비: 5만동, 2만동, 1만동 소액권을 미리 넉넉히 준비하여 거스름돈 실랑이를 사전에 차단하세요."
      ]
    },
    customsQuarantine: {
      dutyFreeAllowance: {
        basicAllowanceUsd: 800,
        alcoholLimit: "1인당 2병 (합산 2L 이하 및 총 $400 이하)",
        tobaccoLimit: "권련 200개비 (1보루)",
        perfumeLimit: "100ml 이하"
      },
      prohibitedItems: [
        "생과일 일체 (생망고, 생망고스틴, 라임, 패션후르츠 등 과채류 전면 반입 금지)",
        "육류 및 육가공품 (소고기 육포, 돼지고기 소시지, 치킨 파우더 등)",
        "실제 고기 건더기가 포함된 레토르트 라면 및 가공식품"
      ],
      permittedItems: [
        "완전 건조 가공 과일 (건망고, 잭푸르트 칩 등 1인당 5kg 이내)",
        "구운 견과류 (껍질 캐슈넛, 마카다미아, 사차인치 등 5kg 이내)",
        "밀봉 포장 가공 커피, 차, 젤리류, 과자류",
        "수산물 가공품 (피시소스, 멸치 가공품 등 위탁 수하물 밀봉 시)"
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 3. Emergency & 24h Pharmacy Guide (응급 & 24시 약국 가이드)
  // --------------------------------------------------------------------------
  emergencyPharmacy: {
    pharmacyMeds: [
      {
        id: "med-smecta",
        brandName: "Smecta (스멕타)",
        activeIngredient: "Dioctahedral Smectite 3g",
        category: "장염 & 설사 흡착제",
        symptom: "급성 설사, 물갈이, 장내 독소 배출",
        dosageKo: "성인 1회 1포를 미온수 50ml에 개어 1일 3회 식간 복용",
        boxPhotoTip: "노란색/하늘색 박스 파우더 형태, 베트남 전역 약국 상시 구비",
        urgency: "High"
      },
      {
        id: "med-berberin",
        brandName: "Berberin (베르베린)",
        activeIngredient: "Berberine Chloride 50mg / 100mg",
        category: "세균성 지사제",
        symptom: "세균성 식중독, 세균성 이질, 심한 복통 동반 설사",
        dosageKo: "성인 1회 2~4정, 1일 2회 식후 복용",
        boxPhotoTip: "노란색 원형 알약, 베트남 대표 천연 생약 지사제로 약국에서 1판(10정) 단위 저렴하게 구매 가능",
        urgency: "High"
      },
      {
        id: "med-panadol-extra",
        brandName: "Panadol Extra (파나돌 엑스트라)",
        activeIngredient: "Paracetamol 500mg + Caffeine 65mg",
        category: "해열 진통제",
        symptom: "고열, 두통, 치통, 근육통, 생리통",
        dosageKo: "성인 1회 1~2정, 4~6시간 간격 복용 (1일 최대 8정 초과 금지)",
        boxPhotoTip: "빨간색 강렬한 패키지, 편의점 및 약국 어디서나 쉽게 구매 가능",
        urgency: "Medium"
      },
      {
        id: "med-nautamine",
        brandName: "Nautamine (노타민)",
        activeIngredient: "Diphenhydramine 90mg",
        category: "멀미약",
        symptom: "호핑투어 배멀미, 달랏/무이네 산악 도로 차량 멀미",
        dosageKo: "성인 탑승 30분 전 1정 복용 (필요 시 6시간 후 추가 1정)",
        boxPhotoTip: "초록색 잎 일러스트 박스, 졸림 유발 가능하므로 운전 전 복용 금지",
        urgency: "Medium"
      },
      {
        id: "med-phosphalugel",
        brandName: "Phosphalugel (포스파겔)",
        activeIngredient: "Colloidal Aluminum Phosphate 20%",
        category: "위장약 & 제산제",
        symptom: "속쓰림, 위산 과다, 위염, 매운 음식 섭취 후 복통",
        dosageKo: "성인 1회 1~2포 식전 또는 속쓰림 발생 시 즉시 복용",
        boxPhotoTip: "주황색/흰색 겔 파우치 포장, 씹지 않고 그대로 복용",
        urgency: "Medium"
      },
      {
        id: "med-telfast",
        brandName: "Telfast 120 (텔파스트 120)",
        activeIngredient: "Fexofenadine HCl 120mg",
        category: "항히스타민제",
        symptom: "해산물 알레르기 두드러기, 가려움증, 비염",
        dosageKo: "성인 1일 1회 1정 물과 함께 복용",
        boxPhotoTip: "보라색 사선 라인 박스, 졸림 현상이 적은 2세대 항히스타민제",
        urgency: "High"
      },
      {
        id: "med-strepsils-eugica",
        brandName: "Strepsils / Eugica (스트렙실 / 유기카)",
        activeIngredient: "Dichlorobenzyl alcohol / Eucalyptol, Menthol",
        category: "목감기 & 인후통 캔디",
        symptom: "목 따가움, 에어컨 냉방병 인후염, 잔기침",
        dosageKo: "2~3시간마다 1개씩 입안에서 천천히 녹여 복용 (1일 최대 8~12개)",
        boxPhotoTip: "Strepsils 허니레몬 노란색 팩 / Eugica 초록색 생약 허브 캔디",
        urgency: "Low"
      },
      {
        id: "med-remos-tigerbalm",
        brandName: "Remos Spray & Tiger Balm (레모스 & 타이거밤)",
        activeIngredient: "DEET 15% / Camphor, Menthol, Clove Oil",
        category: "모기 기피제 & 소염 연고",
        symptom: "야간 뎅기열 모기 예방 및 벌레 물려 부어오른 환부 진정",
        dosageKo: "피부 노출 부위 및 옷에 20cm 거리 분사 / 가려운 환부에 얇게 도포",
        boxPhotoTip: "Remos 연두색 스프레이 보틀 / 호랑이 연고 틴케이스",
        urgency: "Medium"
      },
      {
        id: "med-biafine",
        brandName: "Biafine (비아핀 에멀전)",
        activeIngredient: "Trolamine 0.67g / 100g",
        category: "일광 화상 & 화상 치료제",
        symptom: "강한 자외선 피부 홍반, 스노클링 후 1도~2도 일광 화상(Sunburn)",
        dosageKo: "환부에 도톰하게 펴 바르고 피부가 흡수할 때까지 방치 (1일 2~4회)",
        boxPhotoTip: "프랑스 직수입 연고 튜브, 나트랑 해변 물놀이 필수 응급템",
        urgency: "High"
      },
      {
        id: "med-betadine-urgo",
        brandName: "Betadine & Urgo (베타딘 & 우르고 방수밴드)",
        activeIngredient: "Povidone Iodine 10% / Waterproof Adhesive Strip",
        category: "상처 소독 & 방수 밴드",
        symptom: "산호초 긁힘, 찰과상, 베인 상처 2차 세균 감염 예방",
        dosageKo: "상처 부위를 생수로 세척 후 베타딘 도포 및 우르고 방수 밴드 부착",
        boxPhotoTip: "노란색 베타딘 소독약 보틀 + Urgo 투명 방수 밴드 패키지",
        urgency: "Medium"
      }
    ],
    hospitals: [
      {
        id: "hosp-vinmec",
        nameKo: "빈멕 국제종합병원 나트랑 (Vinmec International Hospital)",
        nameVi: "Bệnh viện Đa khoa Quốc tế Vinmec Nha Trang",
        addressVi: "42A Trần Phú, Vĩnh Nguyên, Nha Trang, Khánh Hòa",
        hotline: "+84 258 3900 168",
        emergency24h: "+84 258 3900 199",
        features: [
          "국제 의료기관 평가 JCI 인증을 획득한 최고 수준의 5성급 종합병원",
          "영어 및 한국어 의료 통역 지원 상주",
          "24시간 응급실, 중환자실(ICU), 첨단 CT/MRI 장비 완비",
          "국내 주요 여행자보험 다이렉트 보증(GOP) 청구 연계 서비스"
        ],
        googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Vinmec+International+Hospital+Nha+Trang"
      },
      {
        id: "hosp-vk",
        nameKo: "VK 병원 / 22-12 종합병원 (VK Hospital Nha Trang)",
        nameVi: "Bệnh viện 22-12 (VK Hospital)",
        addressVi: "34/4 Nguyễn Thiện Thuật, Tân Lập, Nha Trang, Khánh Hòa",
        hotline: "+84 258 352 8866",
        emergency24h: "+84 258 352 8888",
        features: [
          "나트랑 시내 중심부(여행자 거리)에 위치하여 신속한 접근성",
          "24시간 외래 및 응급 진료, 신속한 외상 치료",
          "영문 진단서 및 진료비 세부 내역서 즉시 발급"
        ],
        googleMapUrl: "https://www.google.com/maps/search/?api=1&query=VK+Hospital+Nha+Trang"
      }
    ],
    insuranceGuide: {
      title: "해외 여행자보험 보상 청구 5대 필수 서류 준비법",
      steps: [
        {
          stepNo: 1,
          nameKo: "영문 의사 진단서 (Medical Certificate / Diagnosis)",
          desc: "병원 퇴원 전 반드시 질병명, 상병 코드(ICD Code), 진료 소견이 영문으로 명시된 진단서를 요청하세요."
        },
        {
          stepNo: 2,
          nameKo: "영문 진료비 세부 내역서 (Itemized Hospital Bill)",
          desc: "진찰료, 검사료, 투약료, 처치료 등이 항목별로 세부 분리된 영문 상세 내역서를 수령하세요."
        },
        {
          stepNo: 3,
          nameKo: "공식 전자 세금계산서 (VAT Red Invoice / Hóa đơn đỏ)",
          desc: "베트남 현지 법적 영수증인 레드 인보이스(전자 영수증)를 발급받아야 보험금 심사가 통과됩니다."
        },
        {
          stepNo: 4,
          nameKo: "의사 처방전 및 약국 결제 영수증",
          desc: "병원 외부 약국에서 조제한 경우 의사의 처방전 원본과 약국 공식 영수증을 반드시 보관하세요."
        },
        {
          stepNo: 5,
          nameKo: "도난/분실 시 현지 경찰서 폴리스 리포트 (Police Report)",
          desc: "휴대품 도난 사고 발생 시 24시간 이내에 관할 경찰서(Công an)를 방문하여 사건 경위서를 발급받으세요."
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 4. One-Touch Vietnamese Communication Flashcards (원터치 생존 베트남어)
  // Exactly 21 cards across 4 categories: dining (7), transport (5), shopping (4), emergency (5)
  // --------------------------------------------------------------------------
  flashcards: [
    // --- Dining (7 cards) ---
    {
      id: "fc-01",
      category: "dining",
      categoryLabel: "식당 & 카페",
      icon: "🌿",
      ko: "고수 빼주세요",
      vi: "Đừng cho rau mùi (Không ngò rí)",
      pronunciation: "[둥 조 라우 무이 (콩 응오 리)]",
      purpose: "음식 주문 시 고수(향채) 제외 요청",
      fullscreenText: "KHÔNG CHO RAU MÙI\n(ĐỪNG CHO NGÒ RÍ)"
    },
    {
      id: "fc-02",
      category: "dining",
      categoryLabel: "식당 & 카페",
      icon: "🍯",
      ko: "덜 달게 해주세요 (단맛 줄여주세요)",
      vi: "Ít ngọt thôi giùm tôi",
      pronunciation: "[잇 응옷 또이 지움 또이]",
      purpose: "음료/연유커피 주문 시 과도한 당도 조절",
      fullscreenText: "ÍT NGỌT THÔI\nGIÙM TÔI"
    },
    {
      id: "fc-03",
      category: "dining",
      categoryLabel: "식당 & 카페",
      icon: "🧊",
      ko: "얼음 많이 주세요",
      vi: "Cho tôi nhiều đá",
      pronunciation: "[조 또이 니에우 다]",
      purpose: "더운 날씨에 시원한 음료/얼음잔 요청",
      fullscreenText: "CHO TÔI NHIỀU ĐÁ"
    },
    {
      id: "fc-04",
      category: "dining",
      categoryLabel: "식당 & 카페",
      icon: "🧾",
      ko: "계산서 주세요 (얼마인가요?)",
      vi: "Tính tiền giùm tôi (Bao nhiêu tiền?)",
      pronunciation: "[띤 띠엔 지움 또이 (바오 니에우 띠엔?)]",
      purpose: "식사 후 자리에서 계산서 및 총액 요청",
      fullscreenText: "TÍNH TIỀN\nGIÙM TÔI"
    },
    {
      id: "fc-05",
      category: "dining",
      categoryLabel: "식당 & 카페",
      icon: "📦",
      ko: "남은 음식 포장해 주세요",
      vi: "Gói mang về giùm tôi",
      pronunciation: "[고이 망 베 지움 또이]",
      purpose: "남은 요리를 숙소로 테이크아웃 요청",
      fullscreenText: "GÓI MANG VỀ\nGIÙM TÔI"
    },
    {
      id: "fc-06",
      category: "dining",
      categoryLabel: "식당 & 카페",
      icon: "🥢",
      ko: "물티슈와 앞접시 더 주세요",
      vi: "Cho tôi thêm khăn ướt và đĩa nhỏ",
      pronunciation: "[조 또이 템 칸 으엇 바 디아 뇨]",
      purpose: "해산물/식사 중 추가 식기와 물티슈 요청",
      fullscreenText: "CHO TÔI THÊM KHĂN ƯỚT\nVÀ ĐĨA NHỎ"
    },
    {
      id: "fc-07",
      category: "dining",
      categoryLabel: "식당 & 카페",
      icon: "🌶️",
      ko: "맵지 않게 해주세요 (안 맵게)",
      vi: "Đừng làm cay giùm tôi (Không cay)",
      pronunciation: "[둥 람 까이 지움 또이 (콩 까이)]",
      purpose: "아이 동반 또는 매운 음식 제외 요청",
      fullscreenText: "ĐỪNG LÀM CAY\n(KHÔNG CAY)"
    },

    // --- Transport (5 cards) ---
    {
      id: "fc-08",
      category: "transport",
      categoryLabel: "택시 & 그랩",
      icon: "❄️",
      ko: "에어컨 세게 틀어주세요 (더워요)",
      vi: "Bật điều hòa mạnh lên giùm tôi",
      pronunciation: "[밧 디에우 호아 만 렌 지움 또이]",
      purpose: "택시/그랩 탑승 후 차량 내부 냉방 강화",
      fullscreenText: "BẬT ĐIỀU HÒA MẠNH LÊN\nGIÙM TÔI"
    },
    {
      id: "fc-09",
      category: "transport",
      categoryLabel: "택시 & 그랩",
      icon: "⏱️",
      ko: "미터기 켜고 가주세요",
      vi: "Bật đồng hồ tính tiền giùm tôi",
      pronunciation: "[밧 동 호 띤 띠엔 지움 또이]",
      purpose: "일반 택시 탑승 직후 미터기 작동 요구",
      fullscreenText: "BẬT ĐỒNG HỒ\nTÍNH TIỀN GIÙM TÔI"
    },
    {
      id: "fc-10",
      category: "transport",
      categoryLabel: "택시 & 그랩",
      icon: "🛑",
      ko: "여기서 세워주세요 (내려주세요)",
      vi: "Cho tôi xuống ở đây giùm",
      pronunciation: "[조 또이 수옹 어 더이 지움]",
      purpose: "목적지 부근에서 즉시 하차 요청",
      fullscreenText: "CHO TÔI XUỐNG\nỞ ĐÂY GIÙM"
    },
    {
      id: "fc-11",
      category: "transport",
      categoryLabel: "택시 & 그랩",
      icon: "🏨",
      ko: "호텔 로비 정문으로 가주세요",
      vi: "Đi đến sảnh chính khách sạn giùm tôi",
      pronunciation: "[디 덴 산 찐 칵 산 지움 또이]",
      purpose: "대형 리조트/호텔 진입 시 로비 직행 요청",
      fullscreenText: "ĐI ĐẾN SẢNH CHÍNH\nKHÁCH SẠN GIÙM TÔI"
    },
    {
      id: "fc-12",
      category: "transport",
      categoryLabel: "택시 & 그랩",
      icon: "🧳",
      ko: "트렁크 열어주세요 (짐 실을게요)",
      vi: "Mở cốp xe giùm tôi",
      pronunciation: "[머 꼭 쎄 지움 또이]",
      purpose: "캐리어 및 대형 짐 적재를 위한 트렁크 개방",
      fullscreenText: "MỞ CỐP XE\nGIÙM TÔI"
    },

    // --- Shopping (4 cards) ---
    {
      id: "fc-13",
      category: "shopping",
      categoryLabel: "쇼핑 & 시장",
      icon: "🏷️",
      ko: "너무 비싸요, 깎아주세요",
      vi: "Đắt quá, giảm giá đi",
      pronunciation: "[닷 꾸아, 지암 자 디]",
      purpose: "담시장/야시장 초기 호가에 대한 가격 흥정",
      fullscreenText: "ĐẮT QUÁ,\nGIẢM GIÁ ĐI!"
    },
    {
      id: "fc-14",
      category: "shopping",
      categoryLabel: "쇼핑 & 시장",
      icon: "✨",
      ko: "새 제품(밀봉된 것)으로 주세요",
      vi: "Cho tôi lấy cái mới nguyên hộp/bao",
      pronunciation: "[조 또이 라이 까이 머이 응우옌 홉/바오]",
      purpose: "진열품 대신 미개봉 새 박스 요청",
      fullscreenText: "CHO TÔI LẤY CÁI MỚI\nNGUYÊN HỘP/BAO"
    },
    {
      id: "fc-15",
      category: "shopping",
      categoryLabel: "쇼핑 & 시장",
      icon: "💳",
      ko: "카드 결제나 계좌이체 되나요?",
      vi: "Có thanh toán thẻ hoặc chuyển khoản được không?",
      pronunciation: "[꼬 탄 또안 테 혹 추엔 코안 드억 콩?]",
      purpose: "현금 부족 시 카드 결제 가능 여부 확인",
      fullscreenText: "CÓ THANH TOÁN THẺ\nĐƯỢC KHÔNG?"
    },
    {
      id: "fc-16",
      category: "shopping",
      categoryLabel: "쇼핑 & 시장",
      icon: "🔢",
      ko: "계산기에 가격을 찍어주세요",
      vi: "Bấm giá vào máy tính giùm tôi",
      pronunciation: "[밤 자 바오 마이 띤 지움 또이]",
      purpose: "소통 오류 방지를 위한 계산기 숫자 제시",
      fullscreenText: "BẤM GIÁ VÀO MÁY TÍNH\nGIÙM TÔI"
    },

    // --- Emergency (5 cards) ---
    {
      id: "fc-17",
      category: "emergency",
      categoryLabel: "응급 & 호텔",
      icon: "💊",
      ko: "배가 너무 아파요. 약국이 어디인가요?",
      vi: "Tôi bị đau bụng nhiều. Nhà thuốc ở đâu?",
      pronunciation: "[또이 비 다우 붕 니에우. nha 투옥 어 더우?]",
      purpose: "복통/물갈이 증상 시 인근 약국 위치 문의",
      fullscreenText: "TÔI BỊ ĐAU BỤNG NHIỀU.\nNHÀ THUỐC Ở ĐÂU?"
    },
    {
      id: "fc-18",
      category: "emergency",
      categoryLabel: "응급 & 호텔",
      icon: "🚨",
      ko: "도와주세요! 병원(응급실)에 가야 해요",
      vi: "Làm ơn giúp tôi! Cần đi bệnh viện cấp cứu gấp",
      pronunciation: "[람 온 줍 또이! 껀 디 벤 비엔 껍 꾸 겁]",
      purpose: "응급 환자 발생 시 긴급 후송 지원 요청",
      fullscreenText: "GIÚP TÔI!\nCẦN ĐI BỆNH VIỆN CẤP CỨU"
    },
    {
      id: "fc-19",
      category: "emergency",
      categoryLabel: "응급 & 호텔",
      icon: "🧳",
      ko: "체크인 전 짐을 맡길 수 있나요?",
      vi: "Tôi có thể gửi hành lý trước khi nhận phòng không?",
      pronunciation: "[또이 꼬 테 구이 한 리 뜨억 키 년 퐁 콩?]",
      purpose: "얼리 체크인 전 프런트 데스크 수하물 보관",
      fullscreenText: "GỬI HÀNH LÝ TRƯỚC\nĐƯỢC KHÔNG?"
    },
    {
      id: "fc-20",
      category: "emergency",
      categoryLabel: "응급 & 호텔",
      icon: "🚿",
      ko: "타월과 어메니티를 더 주세요",
      vi: "Cho tôi xin thêm khăn tắm và đồ dùng",
      pronunciation: "[조 또이 신 템 칸 땀 바 도 융]",
      purpose: "호텔 룸 추가 수건 및 비품 요청",
      fullscreenText: "CHO TÔI XIN THÊM\nKHĂN TẮM"
    },
    {
      id: "fc-21",
      category: "emergency",
      categoryLabel: "응급 & 호텔",
      icon: "⏰",
      ko: "공항 가는 택시(샌딩 차량) 예약해 주세요",
      vi: "Đặt giùm tôi xe ra sân bay Cam Ranh",
      pronunciation: "[닷 지움 또이 쎄 라 산 바이 깜란]",
      purpose: "호텔 리셉션에 공항 샌딩 차량 예약 요청",
      fullscreenText: "ĐẶT GIÙM TÔI XE\nRA SÂN BAY CAM RANH"
    }
  ]
};

// Dual export shim for browser window & Node.js CommonJS
if (typeof window !== 'undefined') {
  window.NHA_TRANG_GUIDE_HUB = NHA_TRANG_GUIDE_HUB;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NHA_TRANG_GUIDE_HUB };
}
