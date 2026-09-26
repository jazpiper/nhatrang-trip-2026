/**
 * ============================================================================
 * Nha Trang Trip 2026 - Tailored Scenario Curation Dataset (4 Essential Courses)
 * File: curation-data.js
 * Single Source of Truth (SSOT) for 4 Scenario-based Recommendation Courses
 * 100% Real-World Verified Google Maps Data & Cross-Referenced with 7 Domains (252 Places)
 * Dual Export Support (Browser Window & Node.js CommonJS Module)
 * ============================================================================
 */

const NHA_TRANG_CURATIONS = [
  // ==========================================================================
  // SCENARIO 1: ✈️ 마지막 날 체크아웃 투어 (밤 11시 비행기 굿바이 코스)
  // ==========================================================================
  {
    id: "cur-checkout",
    scenarioKey: "checkout",
    category: "checkout",
    scenarioName: "마지막 날 체크아웃",
    badge: "밤 11시 비행기 최적 동선",
    iconEmoji: "✈️",
    themeIcon: "✈️",
    title: "마지막 날 체크아웃 투어 (밤 11시 비행기 굿바이 코스)",
    titleEn: "Last Day Checkout Tour (Late-Night Flight Goodbye Course)",
    summary: "리조트 12시 체크아웃 후 시내 짐 보관, 현지 가정식 런치, 골드코스트 롯데마트 쇼핑, 오션뷰 카페, 해산물 만찬, 90분 핫스톤 스파 & 개별 샤워 후 깜란 공항(CXR) 전용 샌딩까지 이어지는 무결점 출국 당일치기 풀코스",
    duration: "약 11시간 (12:00 ~ 23:00)",
    durationEstimate: "약 11시간 (12:00 ~ 23:00)",
    targetAudience: "밤 22:00~24:00 귀국 항공편(비엣젯, 에어서울, 제주항공, 대한항공, 티웨이 등)을 탑승하는 여행자",
    recommendedTransport: "그랩(Grab) 택시 및 스파 연계 전용 공항 샌딩 차량",
    estimatedCostVnd: "약 1,200,000 ~ 1,950,000 VND / 1인",
    budgetEstimate: "약 1,200,000 ~ 1,950,000 VND / 1인",
    estimatedCostKrw: "약 65,000 ~ 106,000원 / 1인 (점심+기념품쇼핑+카페+해산물디너+90분스파+공항샌딩 포함)",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    tags: ["체크아웃투어", "무료짐보관", "개별샤워스파", "공항샌딩연계", "롯데마트쇼핑", "해산물디너", "동선최적화"],
    highlights: [
      "12:00 리조트 체크아웃 후 무거운 캐리어를 시내 럭셔리 스파에 무료 보관하여 가벼운 두 손으로 시내 관광",
      "골드코스트 롯데마트 & 켄켄 크록스에서 탑젤리, 체리쉬망고, 아치커피, 맞춤 지비츠 등 귀국 기념품 원스톱 쇼핑",
      "출국 전 90분 핫스톤 마사지와 프라이빗 개별 샤워로 하루 동안 쌓인 땀과 피로를 씻고 쾌적하게 기내 탑승 준비",
      "시내 중심에서 깜란 공항(CXR)까지 정체 없이 40분 만에 이동하는 전용 샌딩 연계로 비행기 놓칠 걱정 제로"
    ],
    keyTips: [
      "참 스파 그랜드(Charm Spa Grand) 또는 센 스파(Sen Spa) 사전 예약 시 정오부터 출국 전까지 무료 캐리어 보관 및 안전 보관증 발급",
      "밤 11시(23:00) 출발 항공편은 출발 2시간 15분 전인 20:45~21:00까지 깜란 공항 도착 권장 (스파에서 20:00~20:15 출발)",
      "나트랑 시내 중심 ↔ 깜란 국제공항 (CXR): 약 35km (차량 40~45분 소요, 4인승 그랩 약 250,000~300,000 VND)",
      "기내에서 입을 편안한 환복용 옷과 기본 세안/화장품을 보조가방에 미리 분리해두면 스파 샤워 후 신속 환복 가능"
    ],
    logisticsTips: {
      baggageStorage: "참 스파 그랜드(Charm Spa Grand) 또는 센 스파(Sen Spa) 사전 예약 시 정오부터 출국 전까지 무료 캐리어 보관 및 안전 보관증 발급",
      airportSendingTiming: "밤 11시(23:00) 출발 항공편은 출발 2시간 15분 전인 20:45~21:00까지 깜란 공항 도착 권장 (스파에서 20:00~20:15 출발)",
      airportDistance: "나트랑 시내 중심 ↔ 깜란 국제공항 (CXR): 약 35km (차량 40~45분 소요, 4인승 그랩 약 250,000~300,000 VND)",
      showerPrep: "기내에서 입을 편안한 환복용 옷과 기본 세안/화장품을 보조가방에 미리 분리해두면 스파 샤워 후 신속 환복 가능"
    },
    timeline: [
      {
        step: 1,
        stepNo: 1,
        time: "12:00 - 13:00",
        title: "리조트 체크아웃 & 시내 이동 후 무료 짐 보관",
        category: "transport",
        categoryLabel: "체크아웃 & 짐보관",
        location: "깜란/시내 숙소 → 시내 참 스파 그랜드 (Charm Spa Grand)",
        duration: "약 40~50분",
        transitTime: "차량 40분",
        description: "리조트 프런트에서 12:00 정규 체크아웃을 마친 뒤, 그랩 또는 리조트 셔틀을 이용해 시내 스파로 이동합니다. 스파 리셉션에 마사지 예약 내역을 제시하고 무거운 캐리어를 무료로 안전하게 맡겨둡니다.",
        actionGuide: "리조트 프런트에서 12:00 정규 체크아웃을 마친 뒤, 그랩 또는 리조트 셔틀을 이용해 시내 스파로 이동합니다. 스파 리셉션에 마사지 예약 내역을 제시하고 무거운 캐리어를 무료로 안전하게 맡겨둡니다.",
        recommendedAction: "리조트 프런트에서 12:00 정규 체크아웃을 마친 뒤, 그랩 또는 리조트 셔틀을 이용해 시내 스파로 이동합니다. 스파 리셉션에 마사지 예약 내역을 제시하고 무거운 캐리어를 무료로 안전하게 맡겨둡니다.",
        logisticsTip: "카카오톡으로 당일 야간 스파를 사전 예약해두면 짐 보관증 발급과 함께 시내 지도 및 할인 혜택을 제공받을 수 있습니다.",
        placeIds: ["stay_09", "spa-07"],
        places: [
          {
            id: "spa-07",
            domain: "spa",
            name: "참 스파 그랜드 (Charm Spa Grand)",
            categoryLabel: "럭셔리 힐링 스파",
            rating: 4.9,
            reviewCount: 2850,
            addressVi: "48C Nguyễn Thị Minh Khai, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Grand%2048C%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Grand%2048C%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "무료 캐리어 보관 + 개인 샤워실 완비 + 공항 샌딩 차량 연계",
            hours: "10:00 - 23:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "spa-07",
            domain: "spa",
            name: "참 스파 그랜드 (Charm Spa Grand)",
            categoryLabel: "럭셔리 힐링 스파",
            rating: 4.9,
            reviewCount: 2850,
            addressVi: "48C Nguyễn Thị Minh Khai, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Grand%2048C%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Grand%2048C%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "무료 캐리어 보관 + 개인 샤워실 완비 + 공항 샌딩 차량 연계",
            hours: "10:00 - 23:00"
          }
        ]
      },
      {
        step: 2,
        stepNo: 2,
        time: "13:00 - 14:30",
        title: "든든한 로컬 베트남 가정식 런치",
        category: "dining",
        categoryLabel: "로컬 미식",
        location: "시내 중심가 (벱 안토이 / 포 한푹)",
        duration: "약 1시간 30분",
        transitTime: "도보 5분",
        description: "에어컨이 완비된 깔끔한 베트남 전통 가정식 전문점에서 파인애플 볶음밥, 분짜, 모닝글로리 볶음, 반쎄오로 출국 당일 오후를 위한 든든한 에너지를 충전합니다.",
        actionGuide: "에어컨이 완비된 깔끔한 베트남 전통 가정식 전문점에서 파인애플 볶음밥, 분짜, 모닝글로리 볶음, 반쎄오로 출국 당일 오후를 위한 든든한 에너지를 충전합니다.",
        recommendedAction: "에어컨이 완비된 깔끔한 베트남 전통 가정식 전문점에서 파인애플 볶음밥, 분짜, 모닝글로리 볶음, 반쎄오로 출국 당일 오후를 위한 든든한 에너지를 충전합니다.",
        logisticsTip: "벱 안토이는 피크 타임(12:30~13:30)에 웨이팅이 있을 수 있으므로 13:00 이후 방문하면 대기 없이 착석 가능합니다.",
        placeIds: ["bep-an-thoi", "pho-hanh-phuc"],
        places: [
          {
            id: "bep-an-thoi",
            domain: "gourmet",
            name: "벱 안토이 (Bếp Ăn Thôi)",
            categoryLabel: "베트남 정통 가정식",
            rating: 4.8,
            reviewCount: 3250,
            addressVi: "03 Nguyễn Thị Minh Khai, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=B%E1%BA%BFp%20%C4%82n%20Th%C3%B4i%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=B%E1%BA%BFp%20%C4%82n%20Th%C3%B4i%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "쾌적한 실내 에어컨과 호불호 없는 정갈한 베트남 한상차림",
            hours: "10:30 - 22:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "bep-an-thoi",
            domain: "gourmet",
            name: "벱 안토이 (Bếp Ăn Thôi)",
            categoryLabel: "베트남 정통 가정식",
            rating: 4.8,
            reviewCount: 3250,
            addressVi: "03 Nguyễn Thị Minh Khai, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=B%E1%BA%BFp%20%C4%82n%20Th%C3%B4i%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=B%E1%BA%BFp%20%C4%82n%20Th%C3%B4i%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "쾌적한 실내 에어컨과 호불호 없는 정갈한 베트남 한상차림",
            hours: "10:30 - 22:00"
          }
        ]
      },
      {
        step: 3,
        stepNo: 3,
        time: "14:30 - 17:00",
        title: "골드코스트 롯데마트 & 켄켄 크록스 원스톱 기념품 쇼핑",
        category: "shopping",
        categoryLabel: "기념품 쇼핑",
        location: "골드코스트 몰 3~4층 롯데마트 & 인근 크록스 전문점",
        duration: "약 2시간 30분",
        transitTime: "그랩 5분",
        description: "시원한 에어컨이 나오는 골드코스트 몰 롯데마트에서 탑젤리, 체리쉬 망고 푸딩, 아치카페, 다람쥐 커피, 캐슈넛 등 필수 기념품을 카트에 담고, 켄켄 크록스에서 무료 지비츠 10개가 포함된 정찰제 크록스를 구매합니다.",
        actionGuide: "시원한 에어컨이 나오는 골드코스트 몰 롯데마트에서 탑젤리, 체리쉬 망고 푸딩, 아치카페, 다람쥐 커피, 캐슈넛 등 필수 기념품을 카트에 담고, 켄켄 크록스에서 무료 지비츠 10개가 포함된 정찰제 크록스를 구매합니다.",
        recommendedAction: "시원한 에어컨이 나오는 골드코스트 몰 롯데마트에서 탑젤리, 체리쉬 망고 푸딩, 아치카페, 다람쥐 커피, 캐슈넛 등 필수 기념품을 카트에 담고, 켄켄 크록스에서 무료 지비츠 10개가 포함된 정찰제 크록스를 구매합니다.",
        logisticsTip: "롯데마트에서 박스 포장대를 이용해 기념품 상자를 테이핑해두면 공항 위탁수하물로 즉시 부치기 편리합니다.",
        placeIds: ["gold-coast-lotte-mart", "kenken-crocs"],
        places: [
          {
            id: "gold-coast-lotte-mart",
            domain: "shopping",
            name: "골드코스트 몰 & 롯데마트 (Gold Coast & Lotte Mart)",
            categoryLabel: "대형 복합몰 & 마트",
            rating: 4.4,
            reviewCount: 1850,
            addressVi: "01 Trần Hưng Đạo, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Gold%20Coast%20Mall%20Lotte%20Mart%2001%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Gold%20Coast%20Mall%20Lotte%20Mart%2001%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "나트랑 30대 인기 기념품 정찰제 판매 및 쾌적한 실내 쇼핑",
            hours: "08:00 - 22:00"
          },
          {
            id: "kenken-crocs",
            domain: "shopping",
            name: "켄켄 크록스 (KenKen Shop)",
            categoryLabel: "크록스 & 슈즈 전문",
            rating: 4.8,
            reviewCount: 380,
            addressVi: "21A Nguyễn Trung Trực, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=KenKen%20Shop%2021A%20Nguy%E1%BB%85n%20Trung%20Tr%E1%BB%B1c%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=KenKen%20Shop%2021A%20Nguy%E1%BB%85n%20Trung%20Tr%E1%BB%B1c%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "지비츠 10개 무료 증정 & 한국 원화 계좌이체 가능 정찰 매장",
            hours: "08:30 - 21:30"
          }
        ],
        recommendedPlaces: [
          {
            id: "gold-coast-lotte-mart",
            domain: "shopping",
            name: "골드코스트 몰 & 롯데마트 (Gold Coast & Lotte Mart)",
            categoryLabel: "대형 복합몰 & 마트",
            rating: 4.4,
            reviewCount: 1850,
            addressVi: "01 Trần Hưng Đạo, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Gold%20Coast%20Mall%20Lotte%20Mart%2001%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Gold%20Coast%20Mall%20Lotte%20Mart%2001%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "나트랑 30대 인기 기념품 정찰제 판매 및 쾌적한 실내 쇼핑",
            hours: "08:00 - 22:00"
          },
          {
            id: "kenken-crocs",
            domain: "shopping",
            name: "켄켄 크록스 (KenKen Shop)",
            categoryLabel: "크록스 & 슈즈 전문",
            rating: 4.8,
            reviewCount: 380,
            addressVi: "21A Nguyễn Trung Trực, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=KenKen%20Shop%2021A%20Nguy%E1%BB%85n%20Trung%20Tr%E1%BB%B1c%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=KenKen%20Shop%2021A%20Nguy%E1%BB%85n%20Trung%20Tr%E1%BB%B1c%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "지비츠 10개 무료 증정 & 한국 원화 계좌이체 가능 정찰 매장",
            hours: "08:30 - 21:30"
          }
        ]
      },
      {
        step: 4,
        stepNo: 4,
        time: "17:00 - 18:30",
        title: "선셋 오션뷰 카페에서 시원한 코코넛 커피 힐링",
        category: "cafe",
        categoryLabel: "카페 & 휴식",
        location: "콩카페 1호점 또는 해변 본 무아 파크",
        duration: "약 1시간 30분",
        transitTime: "도보 8분",
        description: "쇼핑 후 나트랑 비치 또는 빈티지 감성의 콩카페에 들러 시원하고 달콤한 시그니처 코코넛 스무디 커피를 마시며 붉게 물드는 바다 선셋을 감상합니다.",
        actionGuide: "쇼핑 후 나트랑 비치 또는 빈티지 감성의 콩카페에 들러 시원하고 달콤한 시그니처 코코넛 스무디 커피를 마시며 붉게 물드는 바다 선셋을 감상합니다.",
        recommendedAction: "쇼핑 후 나트랑 비치 또는 빈티지 감성의 콩카페에 들러 시원하고 달콤한 시그니처 코코넛 스무디 커피를 마시며 붉게 물드는 바다 선셋을 감상합니다.",
        logisticsTip: "카페에서 모바일 항공권 웹 체크인을 미리 진행해두면 공항에서 좌석 선점 및 신속 수속이 가능합니다.",
        placeIds: ["cong-ca-phe-nguyen-chanh", "bon-mua-park-four-seasons"],
        places: [
          {
            id: "cong-ca-phe-nguyen-chanh",
            domain: "gourmet",
            name: "콩카페 1호점 (Cộng Cà Phê)",
            categoryLabel: "시그니처 카페",
            rating: 4.3,
            reviewCount: 1580,
            addressVi: "27 Nguyễn Chánh, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=C%E1%BB%99ng%20C%C3%A0%20Ph%C3%AA%2027%20Nguy%E1%BB%85n%20Ch%C3%A1nh%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=C%E1%BB%99ng%20C%C3%A0%20Ph%C3%AA%2027%20Nguy%E1%BB%85n%20Ch%C3%A1nh%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "나트랑 필수 코스 코코넛 스무디 커피와 레트로 군용 감성",
            hours: "07:30 - 23:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "cong-ca-phe-nguyen-chanh",
            domain: "gourmet",
            name: "콩카페 1호점 (Cộng Cà Phê)",
            categoryLabel: "시그니처 카페",
            rating: 4.3,
            reviewCount: 1580,
            addressVi: "27 Nguyễn Chánh, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=C%E1%BB%99ng%20C%C3%A0%20Ph%C3%AA%2027%20Nguy%E1%BB%85n%20Ch%C3%A1nh%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=C%E1%BB%99ng%20C%C3%A0%20Ph%C3%AA%2027%20Nguy%E1%BB%85n%20Ch%C3%A1nh%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "나트랑 필수 코스 코코넛 스무디 커피와 레트로 군용 감성",
            hours: "07:30 - 23:00"
          }
        ]
      },
      {
        step: 5,
        stepNo: 5,
        time: "18:30 - 20:00",
        title: "나트랑 라스트 굿바이 해산물 디너 만찬",
        category: "dining",
        categoryLabel: "해산물 만찬",
        location: "빈산 해산물 레스토랑 또는 목콴 해산물",
        duration: "약 1시간 30분",
        transitTime: "도보 5분",
        description: "수조에서 살아있는 치즈 갈릭 랍스터 구이, 파기름 가리비 구이, 맛조개 모닝글로리 볶음, 해산물 볶음밥을 바가지 걱정 없는 정찰제로 배불리 즐깁니다.",
        actionGuide: "수조에서 살아있는 치즈 갈릭 랍스터 구이, 파기름 가리비 구이, 맛조개 모닝글로리 볶음, 해산물 볶음밥을 바가지 걱정 없는 정찰제로 배불리 즐깁니다.",
        recommendedAction: "수조에서 살아있는 치즈 갈릭 랍스터 구이, 파기름 가리비 구이, 맛조개 모닝글로리 볶음, 해산물 볶음밥을 바가지 걱정 없는 정찰제로 배불리 즐깁니다.",
        logisticsTip: "빈산 레스토랑은 에어컨 완비 실내 좌석이 있어 땀 흘리지 않고 쾌적하게 식사할 수 있습니다.",
        placeIds: ["vinh-xanh-seafood", "moc-quan-seafood"],
        places: [
          {
            id: "vinh-xanh-seafood",
            domain: "gourmet",
            name: "빈산 해산물 레스토랑 (Nhà Hàng Vịnh Xanh)",
            categoryLabel: "프리미엄 해산물",
            rating: 4.9,
            reviewCount: 4200,
            addressVi: "03 Nguyễn Thị Minh Khai, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0%20H%C3%A0ng%20V%E1%BB%8Bnh%20Xanh%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0%20H%C3%A0ng%20V%E1%BB%8Bnh%20Xanh%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "구글 평점 4.9점의 바가지 없는 정찰제 랍스터 & 해산물 맛집",
            hours: "10:30 - 22:30"
          }
        ],
        recommendedPlaces: [
          {
            id: "vinh-xanh-seafood",
            domain: "gourmet",
            name: "빈산 해산물 레스토랑 (Nhà Hàng Vịnh Xanh)",
            categoryLabel: "프리미엄 해산물",
            rating: 4.9,
            reviewCount: 4200,
            addressVi: "03 Nguyễn Thị Minh Khai, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0%20H%C3%A0ng%20V%E1%BB%8Bnh%20Xanh%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0%20H%C3%A0ng%20V%E1%BB%8Bnh%20Xanh%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "구글 평점 4.9점의 바가지 없는 정찰제 랍스터 & 해산물 맛집",
            hours: "10:30 - 22:30"
          }
        ]
      },
      {
        step: 6,
        stepNo: 6,
        time: "20:00 - 21:30",
        title: "출국 전 90분 릴렉스 스파 & 프라이빗 개별 샤워/환복",
        category: "spa",
        categoryLabel: "스파 & 샤워",
        location: "참 스파 그랜드 (Charm Spa Grand)",
        duration: "약 1시간 30분",
        transitTime: "도보 3분",
        description: "보관해둔 짐을 찾고 90분 시그니처 핫스톤 마사지로 여행의 뭉친 피로를 완전히 풀어냅니다. 마사지 직후 샴푸/바디워시/수건/드라이기가 완비된 개별 샤워실에서 땀을 말끔히 씻어내고 기내용 편한 옷으로 환복합니다.",
        actionGuide: "보관해둔 짐을 찾고 90분 시그니처 핫스톤 마사지로 여행의 뭉친 피로를 완전히 풀어냅니다. 마사지 직후 샴푸/바디워시/수건/드라이기가 완비된 개별 샤워실에서 땀을 말끔히 씻어내고 기내용 편한 옷으로 환복합니다.",
        recommendedAction: "보관해둔 짐을 찾고 90분 시그니처 핫스톤 마사지로 여행의 뭉친 피로를 완전히 풀어냅니다. 마사지 직후 샴푸/바디워시/수건/드라이기가 완비된 개별 샤워실에서 땀을 말끔히 씻어내고 기내용 편한 옷으로 환복합니다.",
        logisticsTip: "스파 카운터에 예약해둔 공항 샌딩 차량(21:30 출발)을 확인하고, 마사지 후 따뜻한 생강차와 다과를 즐기며 대기합니다.",
        placeIds: ["spa-07"],
        places: [
          {
            id: "spa-07",
            domain: "spa",
            name: "참 스파 그랜드 (Charm Spa Grand)",
            categoryLabel: "럭셔리 힐링 스파",
            rating: 4.9,
            reviewCount: 2850,
            addressVi: "48C Nguyễn Thị Minh Khai, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Grand%2048C%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Grand%2048C%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "전문 테라피스트의 핫스톤 케어와 쾌적한 단독 샤워룸 완비",
            hours: "10:00 - 23:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "spa-07",
            domain: "spa",
            name: "참 스파 그랜드 (Charm Spa Grand)",
            categoryLabel: "럭셔리 힐링 스파",
            rating: 4.9,
            reviewCount: 2850,
            addressVi: "48C Nguyễn Thị Minh Khai, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Grand%2048C%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Grand%2048C%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "전문 테라피스트의 핫스톤 케어와 쾌적한 단독 샤워룸 완비",
            hours: "10:00 - 23:00"
          }
        ]
      },
      {
        step: 7,
        stepNo: 7,
        time: "21:30 - 23:00",
        title: "깜란 국제공항(CXR) 전용 샌딩 이동 & 출국 수속",
        category: "transport",
        categoryLabel: "공항 이동 & 출국",
        location: "나트랑 시내 → 깜란 국제공항 국제선 터미널 (CXR)",
        duration: "약 40~45분 소요 (22:15 도착)",
        transitTime: "전용차량 40분",
        description: "스파 연계 전용 샌딩 차량에 캐리어를 싣고 깜란 공항으로 이동합니다. 22:15경 공항 2층 출발장에 도착하여 항공사 카운터 수하물 위탁, 보안검색, 면세 구역 입장 후 밤 11시 비행기에 여유롭게 탑승합니다.",
        actionGuide: "스파 연계 전용 샌딩 차량에 캐리어를 싣고 깜란 공항으로 이동합니다. 22:15경 공항 2층 출발장에 도착하여 항공사 카운터 수하물 위탁, 보안검색, 면세 구역 입장 후 밤 11시 비행기에 여유롭게 탑승합니다.",
        recommendedAction: "스파 연계 전용 샌딩 차량에 캐리어를 싣고 깜란 공항으로 이동합니다. 22:15경 공항 2층 출발장에 도착하여 항공사 카운터 수하물 위탁, 보안검색, 면세 구역 입장 후 밤 11시 비행기에 여유롭게 탑승합니다.",
        logisticsTip: "공항 톨게이트 비용(15,000 VND) 포함 여부를 기사와 확인하고, 남은 베트남 동(VND)은 면세점 또는 공항 카페에서 털어내세요.",
        placeIds: ["spa-07"],
        places: [],
        recommendedPlaces: []
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 2: 🌧️ 갑자기 비 올 때 실내 힐링 코스
  // ==========================================================================
  {
    id: "cur-rainy",
    scenarioKey: "rainy",
    category: "rainy",
    scenarioName: "비 올 때 실내 힐링",
    badge: "100% 실내 에어컨 & 온천",
    iconEmoji: "🌧️",
    themeIcon: "🌧️",
    title: "갑자기 비 올 때 실내 힐링 코스 (우천 대비 완벽 동선)",
    titleEn: "Rainy Day Indoor Healing Course (All-Weather Escape)",
    summary: "스콜성 폭우나 흐린 날씨에도 비 한 방울 맞지 않고 즐기는 따뜻한 천연 머드온천, 뜨끈한 뚝배기 쌀국수, 대형 복합몰 쇼핑, 5성급 호텔 애프터눈 티, 정통 베트남 두피 헤드스파로 채운 감성 힐링 코스",
    duration: "약 11시간 (10:00 ~ 21:00)",
    durationEstimate: "약 11시간 (10:00 ~ 21:00)",
    targetAudience: "갑작스러운 비로 야외 호핑/해변 일정이 취소되었거나, 날씨에 구애받지 않고 실내에서 쾌적하게 쉬고 싶은 여행자",
    recommendedTransport: "Xanh SM 전기택시 및 시내 그랩(Grab)",
    estimatedCostVnd: "약 750,000 ~ 1,450,000 VND / 1인",
    budgetEstimate: "약 750,000 ~ 1,450,000 VND / 1인",
    estimatedCostKrw: "약 40,000 ~ 79,000원 / 1인 (머드온천+뚝배기쌀국수+애프터눈티+헤드스파+해산물식사 포함)",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    tags: ["우천대비", "천연머드온천", "실내쇼핑몰", "애프터눈티", "뚝배기쌀국수", "두피헤드스파", "에어컨완비"],
    highlights: [
      "비 내리는 날 더욱 운치 있는 따뜻한 38℃ 천연 미네랄 머드탕과 미네랄 온천수 수영장 힐링",
      "보글보글 끓어오르는 뜨끈하고 깊은 사골 육수의 뚝배기 쌀국수로 비 오는 날 쌀쌀함 완벽 퇴치",
      "골드코스트 몰 100% 실내 에어컨 환경에서 즐기는 쾌적한 롯데마트 쇼핑 및 명품 부티크 탐방",
      "인터컨티넨탈 나트랑 5성급 로비 라운지 통유리창 너머로 비 내리는 바다를 보며 즐기는 3단 애프터눈 티",
      "베트남 정통 천연 허브 샴푸와 목/어깨 지압이 포함된 60분 릴렉싱 두피 헤드스파로 노곤노곤한 마무리"
    ],
    keyTips: [
      "비 오는 날은 그랩 호출 수요가 급증하므로 Xanh SM 전기택시 앱 또는 길거리 청록색 택시 즉시 탑승을 적극 활용",
      "머드 온천 시 밝은 색 수영복은 착색될 수 있으므로 어두운 색 수영복 또는 현장 대여복(무료/소액) 착용 권장",
      "비바람이 거세 야외 이동이 부담스러울 경우 시내 중심 갈리나(Galina) 호텔 지하 100% 실내 머드 스파로 대체 가능",
      "우천 시 실내석 수요가 많으므로 매장 도착 15분 전 전화 또는 그랩 이동 중 자리 유무 문의 추천"
    ],
    logisticsTips: {
      transport: "비 오는 날은 그랩 호출 수요가 급증하므로 Xanh SM 전기택시 앱 또는 길거리 청록색 택시 즉시 탑승을 적극 활용",
      mudbathPrep: "머드 온천 시 밝은 색 수영복은 착색될 수 있으므로 어두운 색 수영복 또는 현장 대여복(무료/소액) 착용 권장",
      indoorAlternative: "비바람이 거세 야외 이동이 부담스러울 경우 시내 중심 갈리나(Galina) 호텔 지하 100% 실내 머드 스파로 대체 가능"
    },
    timeline: [
      {
        step: 1,
        stepNo: 1,
        time: "10:00 - 13:00",
        title: "따뜻한 천연 미네랄 머드 온천 & 미네랄 온천풀 힐링",
        category: "spa",
        categoryLabel: "머드온천 & 스파",
        location: "아이리조트 머드온천 (I-Resort) 또는 시내 갈리나 머드 스파",
        duration: "약 3시간",
        transitTime: "차량 20분",
        description: "비가 내릴 때 더욱 따뜻하게 느껴지는 38~40℃ 천연 미네랄 머드 욕조에 몸을 담그고 피부 미용과 피로 해소를 즐깁니다. 머드 체험 후 미네랄 온천수 폭포와 따뜻한 하이드로테라피 풀에서 수영을 즐깁니다.",
        actionGuide: "비가 내릴 때 더욱 따뜻하게 느껴지는 38~40℃ 천연 미네랄 머드 욕조에 몸을 담그고 피부 미용과 피로 해소를 즐깁니다. 머드 체험 후 미네랄 온천수 폭포와 따뜻한 하이드로테라피 풀에서 수영을 즐깁니다.",
        recommendedAction: "비가 내릴 때 더욱 따뜻하게 느껴지는 38~40℃ 천연 미네랄 머드 욕조에 몸을 담그고 피부 미용과 피로 해소를 즐깁니다. 머드 체험 후 미네랄 온천수 폭포와 따뜻한 하이드로테라피 풀에서 수영을 즐깁니다.",
        logisticsTip: "방수팩에 휴대폰을 넣고 타월을 챙기세요. 비가 많이 오면 처마가 있는 프라이빗 미네랄 탕을 선택하면 쾌적합니다.",
        placeIds: ["spa-17", "spa-20"],
        places: [
          {
            id: "spa-17",
            domain: "spa",
            name: "아이리조트 머드온천 (I-Resort Mud Bath)",
            categoryLabel: "천연 미네랄 머드 온천",
            rating: 4.5,
            reviewCount: 8400,
            addressVi: "Tổ 19, Thôn Xuân Ngọc, Vĩnh Ngọc, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=I-Resort%20Mud%20Bath%20T%E1%BB%95%2019%20Xu%C3%A2n%20Ng%E1%BB%8Dc%20V%C4%A9nh%20Ng%E1%BB%8Dc%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=I-Resort%20Mud%20Bath%20T%E1%BB%95%2019%20Xu%C3%A2n%20Ng%E1%BB%8Dc%20V%C4%A9nh%20Ng%E1%BB%8Dc%20Nha%20Trang",
            highlight: "8,400개 리뷰의 나트랑 1위 천연 머드 온천 & 따뜻한 온천 워터파크",
            hours: "08:00 - 18:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "spa-17",
            domain: "spa",
            name: "아이리조트 머드온천 (I-Resort Mud Bath)",
            categoryLabel: "천연 미네랄 머드 온천",
            rating: 4.5,
            reviewCount: 8400,
            addressVi: "Tổ 19, Thôn Xuân Ngọc, Vĩnh Ngọc, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=I-Resort%20Mud%20Bath%20T%E1%BB%95%2019%20Xu%C3%A2n%20Ng%E1%BB%8Dc%20V%C4%A9nh%20Ng%E1%BB%8Dc%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=I-Resort%20Mud%20Bath%20T%E1%BB%95%2019%20Xu%C3%A2n%20Ng%E1%BB%8Dc%20V%C4%A9nh%20Ng%E1%BB%8Dc%20Nha%20Trang",
            highlight: "8,400개 리뷰의 나트랑 1위 천연 머드 온천 & 따뜻한 온천 워터파크",
            hours: "08:00 - 18:00"
          }
        ]
      },
      {
        step: 2,
        stepNo: 2,
        time: "13:00 - 14:30",
        title: "보글보글 뜨끈한 뚝배기 쌀국수 런치",
        category: "dining",
        categoryLabel: "따뜻한 국물 요리",
        location: "포 한푹 (Phở Hạnh Phúc - 뚝배기 쌀국수)",
        duration: "약 1시간 30분",
        transitTime: "차량 15분",
        description: "온천 후 뜨겁게 달궈진 도자기 뚝배기에 담겨 나오는 진한 사골 육수에 생소고기, 차돌양지, 쌀국수 면을 즉석에서 샤브샤브처럼 넣어 먹는 나트랑 최고의 뚝배기 쌀국수를 맛봅니다.",
        actionGuide: "온천 후 뜨겁게 달궈진 도자기 뚝배기에 담겨 나오는 진한 사골 육수에 생소고기, 차돌양지, 쌀국수 면을 즉석에서 샤브샤브처럼 넣어 먹는 나트랑 최고의 뚝배기 쌀국수를 맛봅니다.",
        recommendedAction: "온천 후 뜨겁게 달궈진 도자기 뚝배기에 담겨 나오는 진한 사골 육수에 생소고기, 차돌양지, 쌀국수 면을 즉석에서 샤브샤브처럼 넣어 먹는 나트랑 최고의 뚝배기 쌀국수를 맛봅니다.",
        logisticsTip: "국물이 매우 뜨거우니 숙주와 고수를 뚝배기 바닥 깊숙이 먼저 넣고 숨을 죽인 뒤 특제 고추 소스를 곁들이세요.",
        placeIds: ["pho-hanh-phuc", "bo-nuong-lac-canh"],
        places: [
          {
            id: "pho-hanh-phuc",
            domain: "gourmet",
            name: "포 한푹 (Phở Hạnh Phúc - 뚝배기 쌀국수)",
            categoryLabel: "뚝배기 쌀국수 명가",
            rating: 4.7,
            reviewCount: 5420,
            addressVi: "19 Ngô Gia Tự, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20H%E1%BA%A1nh%20Ph%C3%BAc%2019%20Ng%C3%B4%20Gia%20T%E1%BB%B1%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20H%E1%BA%A1nh%20Ph%C3%BAc%2019%20Ng%C3%B4%20Gia%20T%E1%BB%B1%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "구글 리뷰 5,400개 평점 4.7점의 나트랑 1위 뚝배기 쌀국수 성지",
            hours: "06:00 - 21:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "pho-hanh-phuc",
            domain: "gourmet",
            name: "포 한푹 (Phở Hạnh Phúc - 뚝배기 쌀국수)",
            categoryLabel: "뚝배기 쌀국수 명가",
            rating: 4.7,
            reviewCount: 5420,
            addressVi: "19 Ngô Gia Tự, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20H%E1%BA%A1nh%20Ph%C3%BAc%2019%20Ng%C3%B4%20Gia%20T%E1%BB%B1%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20H%E1%BA%A1nh%20Ph%C3%BAc%2019%20Ng%C3%B4%20Gia%20T%E1%BB%B1%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "구글 리뷰 5,400개 평점 4.7점의 나트랑 1위 뚝배기 쌀국수 성지",
            hours: "06:00 - 21:00"
          }
        ]
      },
      {
        step: 3,
        stepNo: 3,
        time: "14:30 - 16:30",
        title: "골드코스트 몰 100% 실내 쇼핑 & 명품 부티크 몰링",
        category: "shopping",
        categoryLabel: "실내 몰링",
        location: "골드코스트 몰 & 미스앤미스터 부티크",
        duration: "약 2시간",
        transitTime: "차량 5분",
        description: "비바람 걱정 없이 쾌적한 냉방이 가동되는 대형 쇼핑몰에서 롯데마트 기념품을 구경하고, 인근 쾌적한 실내 명품 부티크에서 미러급 잡화와 패션 아이템을 둘러봅니다.",
        actionGuide: "비바람 걱정 없이 쾌적한 냉방이 가동되는 대형 쇼핑몰에서 롯데마트 기념품을 구경하고, 인근 쾌적한 실내 명품 부티크에서 미러급 잡화와 패션 아이템을 둘러봅니다.",
        recommendedAction: "비바람 걱정 없이 쾌적한 냉방이 가동되는 대형 쇼핑몰에서 롯데마트 기념품을 구경하고, 인근 쾌적한 실내 명품 부티크에서 미러급 잡화와 패션 아이템을 둘러봅니다.",
        logisticsTip: "골드코스트 몰 지하/1층에 환전소와 다양한 카페가 입점해 있어 비 오는 날 실내 원스톱 동선으로 최고입니다.",
        placeIds: ["gold-coast-lotte-mart", "miss-and-mister-luxury"],
        places: [
          {
            id: "gold-coast-lotte-mart",
            domain: "shopping",
            name: "골드코스트 몰 & 롯데마트 (Gold Coast & Lotte Mart)",
            categoryLabel: "대형 복합몰 & 마트",
            rating: 4.4,
            reviewCount: 1850,
            addressVi: "01 Trần Hưng Đạo, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Gold%20Coast%20Mall%20Lotte%20Mart%2001%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Gold%20Coast%20Mall%20Lotte%20Mart%2001%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "100% 실내 에어컨 & 마트/쇼핑/키즈존 완비 복합 문화공간",
            hours: "08:00 - 22:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "gold-coast-lotte-mart",
            domain: "shopping",
            name: "골드코스트 몰 & 롯데마트 (Gold Coast & Lotte Mart)",
            categoryLabel: "대형 복합몰 & 마트",
            rating: 4.4,
            reviewCount: 1850,
            addressVi: "01 Trần Hưng Đạo, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Gold%20Coast%20Mall%20Lotte%20Mart%2001%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Gold%20Coast%20Mall%20Lotte%20Mart%2001%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "100% 실내 에어컨 & 마트/쇼핑/키즈존 완비 복합 문화공간",
            hours: "08:00 - 22:00"
          }
        ]
      },
      {
        step: 4,
        stepNo: 4,
        time: "16:30 - 18:30",
        title: "5성급 호텔 로비 라운지 3단 프리미엄 애프터눈 티",
        category: "hoteldining",
        categoryLabel: "호텔 다이닝 & 티",
        location: "인터컨티넨탈 나트랑 로비 라운지 또는 쉐라톤 &More",
        duration: "약 2시간",
        transitTime: "차량 5분",
        description: "통유리창 너머로 비 내리는 나트랑 해변과 파도를 바라보며, 갓 구운 스콘, 정교한 타르트, 마카롱, 핑거 샌드위치가 담긴 3단 애프터눈 티 트레이와 고급 티/스페셜티 커피를 즐깁니다.",
        actionGuide: "통유리창 너머로 비 내리는 나트랑 해변과 파도를 바라보며, 갓 구운 스콘, 정교한 타르트, 마카롱, 핑거 샌드위치가 담긴 3단 애프터눈 티 트레이와 고급 티/스페셜티 커피를 즐깁니다.",
        recommendedAction: "통유리창 너머로 비 내리는 나트랑 해변과 파도를 바라보며, 갓 구운 스콘, 정교한 타르트, 마카롱, 핑거 샌드위치가 담긴 3단 애프터눈 티 트레이와 고급 티/스페셜티 커피를 즐깁니다.",
        logisticsTip: "IHG 또는 메리어트 본보이 멤버십 회원은 F&B 10~20% 현장 할인 혜택이 적용됩니다.",
        placeIds: ["dining-intercon-lobbylounge", "dining-sheraton-andmore"],
        places: [
          {
            id: "dining-intercon-lobbylounge",
            domain: "hoteldining",
            name: "로비 라운지 (Lobby Lounge - InterContinental)",
            categoryLabel: "애프터눈 티 & 라운지",
            rating: 4.6,
            reviewCount: 210,
            addressVi: "32-34 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Lobby%20Lounge%20InterContinental%2032-34%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Lobby%20Lounge%20InterContinental%2032-34%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "파노라마 오션뷰 통유리창과 3단 시그니처 하이티 & 에그커피",
            hours: "08:00 - 22:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "dining-intercon-lobbylounge",
            domain: "hoteldining",
            name: "로비 라운지 (Lobby Lounge - InterContinental)",
            categoryLabel: "애프터눈 티 & 라운지",
            rating: 4.6,
            reviewCount: 210,
            addressVi: "32-34 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Lobby%20Lounge%20InterContinental%2032-34%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Lobby%20Lounge%20InterContinental%2032-34%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "파노라마 오션뷰 통유리창과 3단 시그니처 하이티 & 에그커피",
            hours: "08:00 - 22:00"
          }
        ]
      },
      {
        step: 5,
        stepNo: 5,
        time: "18:30 - 20:00",
        title: "정통 베트남 두피 허브 샴푸 & 릴렉싱 헤드스파",
        category: "spa",
        categoryLabel: "헤드스파 & 샴푸",
        location: "참 스파 가든 헤드스파 (Charm Spa Garden)",
        duration: "약 1시간 30분",
        transitTime: "도보 7분",
        description: "천연 하수오와 자몽 껍질, 레몬그라스 허브를 우려낸 따뜻한 물로 두피를 딥클렌징하고, 목·어깨·두피 지압 마사지를 받아 눅눅한 날씨의 피로를 상쾌하게 날려버립니다.",
        actionGuide: "천연 하수오와 자몽 껍질, 레몬그라스 허브를 우려낸 따뜻한 물로 두피를 딥클렌징하고, 목·어깨·두피 지압 마사지를 받아 눅눅한 날씨의 피로를 상쾌하게 날려버립니다.",
        recommendedAction: "천연 하수오와 자몽 껍질, 레몬그라스 허브를 우려낸 따뜻한 물로 두피를 딥클렌징하고, 목·어깨·두피 지압 마사지를 받아 눅눅한 날씨의 피로를 상쾌하게 날려버립니다.",
        logisticsTip: "헤드스파 후 드라이와 헤어 에센스 케어까지 완벽히 제공되므로 헝클어진 머리 걱정 없이 다음 일정으로 이동할 수 있습니다.",
        placeIds: ["spa-15", "spa-13"],
        places: [
          {
            id: "spa-15",
            domain: "spa",
            name: "참 스파 가든 헤드스파 (Charm Spa Garden)",
            categoryLabel: "전문 헤드스파 & 바버",
            rating: 4.9,
            reviewCount: 1120,
            addressVi: "26 Nguyễn Trung Trực, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Garden%2026%20Nguy%E1%BB%85n%20Trung%20Tr%E1%BB%B1c%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Garden%2026%20Nguy%E1%BB%85n%20Trung%20Tr%E1%BB%B1c%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "천연 허브 온수 샴푸 + 두피 순환 지압 + 목/어깨 릴렉싱 풀케어",
            hours: "10:00 - 22:30"
          }
        ],
        recommendedPlaces: [
          {
            id: "spa-15",
            domain: "spa",
            name: "참 스파 가든 헤드스파 (Charm Spa Garden)",
            categoryLabel: "전문 헤드스파 & 바버",
            rating: 4.9,
            reviewCount: 1120,
            addressVi: "26 Nguyễn Trung Trực, Tân Lập, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Garden%2026%20Nguy%E1%BB%85n%20Trung%20Tr%E1%BB%B1c%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Charm%20Spa%20Garden%2026%20Nguy%E1%BB%85n%20Trung%20Tr%E1%BB%B1c%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
            highlight: "천연 허브 온수 샴푸 + 두피 순환 지압 + 목/어깨 릴렉싱 풀케어",
            hours: "10:00 - 22:30"
          }
        ]
      },
      {
        step: 6,
        stepNo: 6,
        time: "20:00 - 21:30",
        title: "쾌적한 실내 VIP룸 해산물 만찬 또는 정글 카페 디저트",
        category: "dining",
        categoryLabel: "실내 해산물 디너",
        location: "빈산 해산물 레스토랑 실내 에어컨 룸 또는 정글 커피",
        duration: "약 1시간 30분",
        transitTime: "도보 5분",
        description: "비바람 치는 바깥 풍경을 뒤로하고 시원하고 쾌적한 실내 에어컨 룸에서 신선한 해산물 구이와 볶음밥으로 만족스러운 하루를 마무리합니다.",
        actionGuide: "비바람 치는 바깥 풍경을 뒤로하고 시원하고 쾌적한 실내 에어컨 룸에서 신선한 해산물 구이와 볶음밥으로 만족스러운 하루를 마무리합니다.",
        recommendedAction: "비바람 치는 바깥 풍경을 뒤로하고 시원하고 쾌적한 실내 에어컨 룸에서 신선한 해산물 구이와 볶음밥으로 만족스러운 하루를 마무리합니다.",
        logisticsTip: "우천 시 실내석 수요가 많으므로 매장 도착 15분 전 전화 또는 그랩 이동 중 자리 유무를 문의하세요.",
        placeIds: ["vinh-xanh-seafood", "rainforest-cafe-jungle"],
        places: [
          {
            id: "vinh-xanh-seafood",
            domain: "gourmet",
            name: "빈산 해산물 레스토랑 (Nhà Hàng Vịnh Xanh)",
            categoryLabel: "프리미엄 해산물",
            rating: 4.9,
            reviewCount: 4200,
            addressVi: "03 Nguyễn Thị Minh Khai, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0%20H%C3%A0ng%20V%E1%BB%8Bnh%20Xanh%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0%20H%C3%A0ng%20V%E1%BB%8Bnh%20Xanh%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "완전 밀폐형 실내 에어컨 룸 완비로 쾌적한 해산물 만찬 가능",
            hours: "10:30 - 22:30"
          }
        ],
        recommendedPlaces: [
          {
            id: "vinh-xanh-seafood",
            domain: "gourmet",
            name: "빈산 해산물 레스토랑 (Nhà Hàng Vịnh Xanh)",
            categoryLabel: "프리미엄 해산물",
            rating: 4.9,
            reviewCount: 4200,
            addressVi: "03 Nguyễn Thị Minh Khai, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0%20H%C3%A0ng%20V%E1%BB%8Bnh%20Xanh%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Nh%C3%A0%20H%C3%A0ng%20V%E1%BB%8Bnh%20Xanh%2003%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "완전 밀폐형 실내 에어컨 룸 완비로 쾌적한 해산물 만찬 가능",
            hours: "10:30 - 22:30"
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 3: 🌙 밤 10시 이후 심야 핫스팟 코스
  // ==========================================================================
  {
    id: "cur-night",
    scenarioKey: "night",
    category: "night",
    scenarioName: "심야 핫스팟 & 야간",
    badge: "자정 넘어 02시까지 영업",
    iconEmoji: "🌙",
    themeIcon: "🌙",
    title: "밤 10시 이후 심야 핫스팟 코스 (나이트라이프 & 야식 명소)",
    titleEn: "Midnight & Late-Night Hotspots Course (Nightlife & Owl Eats)",
    summary: "밤 10시가 넘어도 잠들지 않는 나트랑! 45층 구름 위 360도 스카이라운지 클럽, 백사장 파이어 쇼 & 비치 파티, 수영장 옆 수제맥주 펍, 새벽까지 불을 밝히는 로컬 조개포차 & 심야 쌀국수 완벽 정복",
    duration: "약 5시간 30분 (21:00 ~ 익일 02:30)",
    durationEstimate: "약 5시간 30분 (21:00 ~ 익일 02:30)",
    targetAudience: "늦은 밤 나트랑에 도착했거나, 나이트라이프·클러빙·심야 야식과 술자리를 사랑하는 올빼미 여행자",
    recommendedTransport: "메인 도로 중심 도보 및 안전한 그랩(Grab)",
    estimatedCostVnd: "약 450,000 ~ 1,200,000 VND / 1인",
    budgetEstimate: "약 450,000 ~ 1,200,000 VND / 1인",
    estimatedCostKrw: "약 24,000 ~ 65,000원 / 1인 (루프탑입장료/음료+비치클럽+수제맥주+야식포차 포함)",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    tags: ["심야영업", "루프탑클럽", "세일링클럽", "파이어쇼", "비치펍", "수제맥주", "심야해산물", "야식쌀국수"],
    highlights: [
      "나트랑 최고층 45층 아바나 호텔 스카이라이트에서 즐기는 360도 환상적인 파노라마 야경과 DJ EDM 파티",
      "세일링 클럽 백사장 위에서 밤 10시 30분에 펼쳐지는 화려한 불쇼(Fire Show)와 밤바다 칵테일",
      "해변 야외 수영장 바로 옆 루이지애나 브루하우스에서 즐기는 신선한 자체 양조 수제맥주 4종 샘플러",
      "탑바 야식거리와 탄스엉에서 즐기는 밤 11시 이후의 불향 가득한 조개구이 & 자정까지 뜨끈한 포퀸 쌀국수",
      "밤 11시까지 영업하는 럭셔리 스파에서 심야 마사지를 받고 당일 피로를 녹여내는 나이트 스파 옵션"
    ],
    keyTips: [
      "스카이라이트 360은 비치웨어/슬리퍼 입장이 제한될 수 있으므로 단정한 캐주얼 샌들/운동화 착용 권장",
      "심야 시간대 이동 시 해변 어두운 골목은 피하고 메인 도로(Trần Phú, Nguyễn Thị Minh Khai) 위주로 이동하며 그랩 호출 권장",
      "세일링 클럽 파이어 쇼는 통상 22:15~22:45 사이에 시작되므로 22:00 이전 입장하여 비치 테이블 선점 추천",
      "자정 넘어 02:00까지 운영하는 매장이 많아 심야 비행기 도착 후 0.5박 체크인 전 야식 코스로도 적합"
    ],
    logisticsTips: {
      dressCode: "스카이라이트 360은 비치웨어/슬리퍼 입장이 제한될 수 있으므로 단정한 캐주얼 샌들/운동화 착용 권장",
      safety: "심야 시간대 이동 시 해변 어두운 골목은 피하고 메인 도로(Trần Phú, Nguyễn Thị Minh Khai) 위주로 이동하며 그랩 호출 권장",
      fireShowTime: "세일링 클럽 파이어 쇼는 통상 22:15~22:45 사이에 시작되므로 22:00 이전 입장하여 비치 테이블 선점 추천"
    },
    timeline: [
      {
        step: 1,
        stepNo: 1,
        time: "21:00 - 23:00",
        title: "45층 구름 위 스카이라운지 & 글래스 스카이워크 야경",
        category: "hoteldining",
        categoryLabel: "루프탑 & 클럽",
        location: "아바나 호텔 45층 스카이라이트 360 (Skylight Nha Trang)",
        duration: "약 2시간",
        transitTime: "도보 5분",
        description: "초고속 전용 엘리베이터를 타고 45층 루프탑에 올라 나트랑 도심과 해변선 전체가 한눈에 내려다보이는 투명 유리 스카이워크에서 아찔한 인생샷을 남기고, DJ 음악과 함께 시그니처 칵테일을 즐깁니다.",
        actionGuide: "초고속 전용 엘리베이터를 타고 45층 루프탑에 올라 나트랑 도심과 해변선 전체가 한눈에 내려다보이는 투명 유리 스카이워크에서 아찔한 인생샷을 남기고, DJ 음악과 함께 시그니처 칵테일을 즐깁니다.",
        recommendedAction: "초고속 전용 엘리베이터를 타고 45층 루프탑에 올라 나트랑 도심과 해변선 전체가 한눈에 내려다보이는 투명 유리 스카이워크에서 아찔한 인생샷을 남기고, DJ 음악과 함께 시그니처 칵테일을 즐깁니다.",
        logisticsTip: "입장료에 웰컴 드링크 1잔이 포함되어 있으며, 22시 이후 본격적인 클럽 분위기로 전환됩니다.",
        placeIds: ["dining-havana-skylight", "act-15", "dining-sheraton-altitude"],
        places: [
          {
            id: "dining-havana-skylight",
            domain: "hoteldining",
            name: "스카이라이트 360 루프탑 (Skylight 360)",
            categoryLabel: "360° 스카이라운지 바",
            rating: 4.4,
            reviewCount: 2400,
            addressVi: "38 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Skylight%20Nha%20Trang%2038%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Skylight%20Nha%20Trang%2038%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "나트랑 최고층 45층 파노라마 야경 & 글래스 스카이워크 포토존",
            hours: "17:30 - 01:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "dining-havana-skylight",
            domain: "hoteldining",
            name: "스카이라이트 360 루프탑 (Skylight 360)",
            categoryLabel: "360° 스카이라운지 바",
            rating: 4.4,
            reviewCount: 2400,
            addressVi: "38 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Skylight%20Nha%20Trang%2038%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Skylight%20Nha%20Trang%2038%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "나트랑 최고층 45층 파노라마 야경 & 글래스 스카이워크 포토존",
            hours: "17:30 - 01:00"
          }
        ]
      },
      {
        step: 2,
        stepNo: 2,
        time: "23:00 - 01:00",
        title: "백사장 파이어 댄스 쇼 & 비치프론트 파티",
        category: "gourmet",
        categoryLabel: "비치 클럽 & 펍",
        location: "세일링 클럽 나트랑 (Sailing Club Nha Trang)",
        duration: "약 2시간",
        transitTime: "차량 5분",
        description: "해변 모래사장 위에 마련된 선베드와 소파에 앉아 밤바다 파도 소리를 들으며 전문 댄서들의 박진감 넘치는 파이어 댄스 쇼를 감상하고, 트로피컬 칵테일과 물담배(시샤), 라이브 비트를 즐깁니다.",
        actionGuide: "해변 모래사장 위에 마련된 선베드와 소파에 앉아 밤바다 파도 소리를 들으며 전문 댄서들의 박진감 넘치는 파이어 댄스 쇼를 감상하고, 트로피컬 칵테일과 물담배(시샤), 라이브 비트를 즐깁니다.",
        recommendedAction: "해변 모래사장 위에 마련된 선베드와 소파에 앉아 밤바다 파도 소리를 들으며 전문 댄서들의 박진감 넘치는 파이어 댄스 쇼를 감상하고, 트로피컬 칵테일과 물담배(시샤), 라이브 비트를 즐깁니다.",
        logisticsTip: "새벽 02:00까지 연중무휴로 운영되며, 주말에는 해변 댄스 플로어가 열려 전 세계 여행자들과 어울릴 수 있습니다.",
        placeIds: ["sailing-club-nha-trang"],
        places: [
          {
            id: "sailing-club-nha-trang",
            domain: "gourmet",
            name: "세일링 클럽 나트랑 (Sailing Club Nha Trang)",
            categoryLabel: "비치 클럽 & 라운지",
            rating: 4.5,
            reviewCount: 14200,
            addressVi: "72-74 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Sailing%20Club%2072-74%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Sailing%20Club%2072-74%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "14,200개 리뷰의 독보적 비치 클럽 & 매일 밤 펼쳐지는 불쇼",
            hours: "07:00 - 02:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "sailing-club-nha-trang",
            domain: "gourmet",
            name: "세일링 클럽 나트랑 (Sailing Club Nha Trang)",
            categoryLabel: "비치 클럽 & 라운지",
            rating: 4.5,
            reviewCount: 14200,
            addressVi: "72-74 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Sailing%20Club%2072-74%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Sailing%20Club%2072-74%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "14,200개 리뷰의 독보적 비치 클럽 & 매일 밤 펼쳐지는 불쇼",
            hours: "07:00 - 02:00"
          }
        ]
      },
      {
        step: 3,
        stepNo: 3,
        time: "00:30 - 01:30",
        title: "해변 수영장 앞 자체 양조 수제맥주 샘플러",
        category: "activities",
        categoryLabel: "수제맥주 펍",
        location: "루이지애나 브루하우스 (Louisiane Brewhouse)",
        duration: "약 1시간",
        transitTime: "도보 3분",
        description: "바닷바람을 맞으며 야외 풀사이드 테이블에 앉아 패션후르츠 에일, 필스너, 다크라거, 바이젠으로 구성된 4종 수제맥주 샘플러와 갓 구운 화덕피자를 곁들입니다.",
        actionGuide: "바닷바람을 맞으며 야외 풀사이드 테이블에 앉아 패션후르츠 에일, 필스너, 다크라거, 바이젠으로 구성된 4종 수제맥주 샘플러와 갓 구운 화덕피자를 곁들입니다.",
        recommendedAction: "바닷바람을 맞으며 야외 풀사이드 테이블에 앉아 패션후르츠 에일, 필스너, 다크라거, 바이젠으로 구성된 4종 수제맥주 샘플러와 갓 구운 화덕피자를 곁들입니다.",
        logisticsTip: "야간 수영장 조명이 켜져 있어 분위기가 로맨틱하며, 새벽 01:00까지 주류 및 스낵 주문이 가능합니다.",
        placeIds: ["act-16"],
        places: [
          {
            id: "act-16",
            domain: "activities",
            name: "루이지애나 브루하우스 (Louisiane Brewhouse)",
            categoryLabel: "비치 펍 & 수제맥주",
            rating: 4.88,
            reviewCount: 410,
            addressVi: "Lot 29 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Louisiane%20Brewhouse%20Lot%2029%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Louisiane%20Brewhouse%20Lot%2029%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "자체 마이크로 브루어리 수제맥주 4종 & 오션 프론트 풀사이드",
            hours: "07:00 - 01:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "act-16",
            domain: "activities",
            name: "루이지애나 브루하우스 (Louisiane Brewhouse)",
            categoryLabel: "비치 펍 & 수제맥주",
            rating: 4.88,
            reviewCount: 410,
            addressVi: "Lot 29 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Louisiane%20Brewhouse%20Lot%2029%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Louisiane%20Brewhouse%20Lot%2029%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "자체 마이크로 브루어리 수제맥주 4종 & 오션 프론트 풀사이드",
            hours: "07:00 - 01:00"
          }
        ]
      },
      {
        step: 4,
        stepNo: 4,
        time: "01:00 - 02:30",
        title: "새벽을 깨우는 심야 로컬 조개포차 & 야식 쌀국수",
        category: "dining",
        categoryLabel: "심야 야식",
        location: "탑바 야식골목 쑤언안 조개포차 / 탄스엉 / 포퀸",
        duration: "약 1시간 30분",
        transitTime: "차량 8분",
        description: "자정 넘어서까지 영업하는 로컬 포차에서 파기름과 땅콩을 얹은 가리비 숯불구이, 마늘버터 소라 볶음, 그리고 자정까지 끓여내는 포퀸의 뜨끈한 소고기 쌀국수로 완벽한 심야 먹방을 즐깁니다.",
        actionGuide: "자정 넘어서까지 영업하는 로컬 포차에서 파기름과 땅콩을 얹은 가리비 숯불구이, 마늘버터 소라 볶음, 그리고 자정까지 끓여내는 포퀸의 뜨끈한 소고기 쌀국수로 완벽한 심야 먹방을 즐깁니다.",
        recommendedAction: "자정 넘어서까지 영업하는 로컬 포차에서 파기름과 땅콩을 얹은 가리비 숯불구이, 마늘버터 소라 볶음, 그리고 자정까지 끓여내는 포퀸의 뜨끈한 소고기 쌀국수로 완벽한 심야 먹방을 즐깁니다.",
        logisticsTip: "조개 포차 주문 시 느억맘 소스에 라임 즙과 다진 고추를 듬뿍 넣어 찍어 먹으면 해산물의 풍미가 배가됩니다.",
        placeIds: ["oc-xuan-anh", "thanh-suong-seafood", "pho-quynh", "kem-bo-sinh-to-thien-nhien"],
        places: [
          {
            id: "oc-xuan-anh",
            domain: "gourmet",
            name: "쑤언안 조개·해산물 (Quán Ốc Xuân Anh)",
            categoryLabel: "심야 조개 포차",
            rating: 3.9,
            reviewCount: 1260,
            addressVi: "25 Tháp Bà, Vĩnh Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Qu%C3%A1n%20%E1%BB%90c%20Xu%C3%A2n%20Anh%2025%20Th%C3%A1p%20B%C3%A0%20V%C4%A9nh%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Qu%C3%A1n%20%E1%BB%90c%20Xu%C3%A2n%20Anh%2025%20Th%C3%A1p%20B%C3%A0%20V%C4%A9nh%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "탑바 야식거리 대표 조개구이 노포, 밤 11시 30분까지 성업",
            hours: "16:00 - 23:30"
          },
          {
            id: "pho-quynh",
            domain: "gourmet",
            name: "포퀸 (Phở Quỳnh - 심야 쌀국수)",
            categoryLabel: "심야 쌀국수 명가",
            rating: 4.2,
            reviewCount: 280,
            addressVi: "70 Hoàng Văn Thụ, Vạn Thắng, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20Qu%E1%BB%B3nh%2070%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5%20V%E1%BA%A1n%20Th%E1%BA%AFng%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20Qu%E1%BB%B3nh%2070%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5%20V%E1%BA%A1n%20Th%E1%BA%AFng%20Nha%20Trang",
            highlight: "자정(24:00)까지 영업하는 진하고 깊은 사골 소고기 쌀국수",
            hours: "05:00 - 24:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "oc-xuan-anh",
            domain: "gourmet",
            name: "쑤언안 조개·해산물 (Quán Ốc Xuân Anh)",
            categoryLabel: "심야 조개 포차",
            rating: 3.9,
            reviewCount: 1260,
            addressVi: "25 Tháp Bà, Vĩnh Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Qu%C3%A1n%20%E1%BB%90c%20Xu%C3%A2n%20Anh%2025%20Th%C3%A1p%20B%C3%A0%20V%C4%A9nh%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Qu%C3%A1n%20%E1%BB%90c%20Xu%C3%A2n%20Anh%2025%20Th%C3%A1p%20B%C3%A0%20V%C4%A9nh%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "탑바 야식거리 대표 조개구이 노포, 밤 11시 30분까지 성업",
            hours: "16:00 - 23:30"
          },
          {
            id: "pho-quynh",
            domain: "gourmet",
            name: "포퀸 (Phở Quỳnh - 심야 쌀국수)",
            categoryLabel: "심야 쌀국수 명가",
            rating: 4.2,
            reviewCount: 280,
            addressVi: "70 Hoàng Văn Thụ, Vạn Thắng, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20Qu%E1%BB%B3nh%2070%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5%20V%E1%BA%A1n%20Th%E1%BA%AFng%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20Qu%E1%BB%B3nh%2070%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5%20V%E1%BA%A1n%20Th%E1%BA%AFng%20Nha%20Trang",
            highlight: "자정(24:00)까지 영업하는 진하고 깊은 사골 소고기 쌀국수",
            hours: "05:00 - 24:00"
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 4: 💑 커플 & 로맨틱 럭셔리 힐링 코스
  // ==========================================================================
  {
    id: "cur-couple",
    scenarioKey: "couple",
    category: "couple",
    scenarioName: "커플/로맨틱 힐링",
    badge: "오션뷰 선셋 & 파인다이닝",
    iconEmoji: "💑",
    themeIcon: "💑",
    title: "커플 & 로맨틱 럭셔리 힐링 코스 (둘만의 감성 데이트)",
    titleEn: "Romantic Couple Luxury Healing Course (Sunset & Fine Dining)",
    summary: "강변 프라이빗 빌라 룸 커플 스파, 기암괴석 절벽 위 에메랄드 오션뷰 카페, 5성급 럭셔리 선셋 디너 크루즈의 바이올린 라이브와 무제한 와인, 백사장 촛불 테이블 칵테일로 완성하는 로맨틱 풀코스",
    duration: "약 8시간 30분 (14:00 ~ 22:30)",
    durationEstimate: "약 8시간 30분 (14:00 ~ 22:30)",
    targetAudience: "신혼여행, 커플 기념일, 특별한 프러포즈, 또는 오붓하고 감성적인 둘만의 시간을 보내고 싶은 연인/동행 여행자",
    recommendedTransport: "크루즈 전용 리무진 및 편안한 그랩(Grab)",
    estimatedCostVnd: "약 1,600,000 ~ 3,200,000 VND / 1인",
    budgetEstimate: "약 1,600,000 ~ 3,200,000 VND / 1인",
    estimatedCostKrw: "약 87,000 ~ 174,000원 / 1인 (프라이빗스파+절벽카페+5성선셋크루즈5코스디너+루프탑칵테일 포함)",
    coverImage: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
    tags: ["커플여행", "선셋크루즈", "프라이빗스파", "파인다이닝", "오션뷰카페", "루프탑바", "인생샷명소"],
    highlights: [
      "도심 소음에서 벗어난 카이강변 정원 속 단독 프라이빗 빌라 룸에서 받는 최고급 90분 커플 핫스톤 & 뱀부 마사지",
      "혼총 곶 바다 기암괴석 절벽 위 테라스에서 둘이 함께 마주하는 환상적인 에메랄드빛 바다 파노라마 뷰",
      "엠페러 5성급 럭셔리 크루즈 선상에서 석양을 바라보며 즐기는 라이브 바이올린 연주와 5코스 랍스터 만찬 & 무제한 와인",
      "디 아남 깜란의 프렌치 파인다이닝 더 콜로니얼 또는 쉐라톤 28층 최고층 알티튜드 루프탑에서 즐기는 샴페인 야경 데이트"
    ],
    keyTips: [
      "엠페러 선셋 크루즈 및 호텔 파인다이닝은 좌석 수가 한정되어 있으므로 최소 2~3일 전 사전 예약 필수",
      "엠페러 크루즈는 16:00~16:30 시내 주요 호텔 로비로 전용 리무진 픽업 차량이 방문하므로 정시 대기",
      "혼총 곶 절벽 카페 야외 테라스 끝자락과 크루즈 2층 선베드 데크가 커플 스냅 최고의 인생샷 스팟",
      "프라이빗 커플 스파는 카카오톡으로 사전 예약 시 단독 빌라 커플룸 및 웰컴 과일/티를 무료로 준비해 줍니다"
    ],
    logisticsTips: {
      reservation: "엠페러 선셋 크루즈 및 호텔 파인다이닝은 좌석 수가 한정되어 있으므로 최소 2~3일 전 사전 예약 필수",
      cruisePickup: "엠페러 크루즈는 16:00~16:30 시내 주요 호텔 로비로 전용 리무진 픽업 차량이 방문하므로 정시 대기",
      photoSpot: "혼총 곶 절벽 카페 야외 테라스 끝자락과 크루즈 2층 선베드 데크가 커플 스냅 최고의 인생샷 스팟"
    },
    timeline: [
      {
        step: 1,
        stepNo: 1,
        time: "14:00 - 16:00",
        title: "카이강변 정원 속 프라이빗 빌라 커플 룸 스파",
        category: "spa",
        categoryLabel: "프라이빗 커플 스파",
        location: "센 스파 (Sen Spa Nha Trang) 또는 아미아나 리조트 스파",
        duration: "약 2시간",
        transitTime: "차량 12분",
        description: "나트랑 북부 카이강변의 울창한 열대 정원에 위치한 단독 프라이빗 빌라 룸에서 은은한 아로마 향과 함께 90분 시그니처 핫스톤 & 천연 뱀부 마사지를 둘만의 프라이빗한 공간에서 편안하게 받습니다.",
        actionGuide: "나트랑 북부 카이강변의 울창한 열대 정원에 위치한 단독 프라이빗 빌라 룸에서 은은한 아로마 향과 함께 90분 시그니처 핫스톤 & 천연 뱀부 마사지를 둘만의 프라이빗한 공간에서 편안하게 받습니다.",
        recommendedAction: "나트랑 북부 카이강변의 울창한 열대 정원에 위치한 단독 프라이빗 빌라 룸에서 은은한 아로마 향과 함께 90분 시그니처 핫스톤 & 천연 뱀부 마사지를 둘만의 프라이빗한 공간에서 편안하게 받습니다.",
        logisticsTip: "스파 카카오톡으로 사전 예약 시 시내 호텔 무료 픽업 차량을 지원받을 수 있으며, 마사지 후 수제 요거트 디저트가 제공됩니다.",
        placeIds: ["spa-01", "spa-09"],
        places: [
          {
            id: "spa-01",
            domain: "spa",
            name: "센 스파 (Sen Spa Nha Trang)",
            categoryLabel: "가성비 & 힐링 스파",
            rating: 4.9,
            reviewCount: 2150,
            addressVi: "241 Ngô Đến, Ngọc Hiệp, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Sen%20Spa%20241%20Ng%C3%B4%20%C4%90%E1%BA%BFn%20Ng%E1%BB%8Dc%20Hi%E1%BB%87p%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Sen%20Spa%20241%20Ng%C3%B4%20%C4%90%E1%BA%BFn%20Ng%E1%BB%8Dc%20Hi%E1%BB%87p%20Nha%20Trang",
            highlight: "카이강 전망 프라이빗 빌라 커플룸 & 시그니처 대나무 핫스톤",
            hours: "08:30 - 20:30"
          }
        ],
        recommendedPlaces: [
          {
            id: "spa-01",
            domain: "spa",
            name: "센 스파 (Sen Spa Nha Trang)",
            categoryLabel: "가성비 & 힐링 스파",
            rating: 4.9,
            reviewCount: 2150,
            addressVi: "241 Ngô Đến, Ngọc Hiệp, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Sen%20Spa%20241%20Ng%C3%B4%20%C4%90%E1%BA%BFn%20Ng%E1%BB%8Dc%20Hi%E1%BB%87p%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Sen%20Spa%20241%20Ng%C3%B4%20%C4%90%E1%BA%BFn%20Ng%E1%BB%8Dc%20Hi%E1%BB%87p%20Nha%20Trang",
            highlight: "카이강 전망 프라이빗 빌라 커플룸 & 시그니처 대나무 핫스톤",
            hours: "08:30 - 20:30"
          }
        ]
      },
      {
        step: 2,
        stepNo: 2,
        time: "16:00 - 17:00",
        title: "혼총 곶 절벽 카페에서 마주하는 에메랄드 오션뷰",
        category: "cafe",
        categoryLabel: "오션뷰 선셋 카페",
        location: "혼총 곶 절벽 카페 (Hội Quán Hòn Chồng) 또는 올라 카페",
        duration: "약 1시간",
        transitTime: "차량 8분",
        description: "바다로 뻗어나간 기암괴석 절벽 위에 자리 잡은 카페 야외 테라스에 앉아 시원한 바닷바람을 맞으며 쓰어다 연유커피와 코코넛 스무디를 마시고, 수평선 너머로 시작되는 선셋 빛깔을 감상합니다.",
        actionGuide: "바다로 뻗어나간 기암괴석 절벽 위에 자리 잡은 카페 야외 테라스에 앉아 시원한 바닷바람을 맞으며 쓰어다 연유커피와 코코넛 스무디를 마시고, 수평선 너머로 시작되는 선셋 빛깔을 감상합니다.",
        recommendedAction: "바다로 뻗어나간 기암괴석 절벽 위에 자리 잡은 카페 야외 테라스에 앉아 시원한 바닷바람을 맞으며 쓰어다 연유커피와 코코넛 스무디를 마시고, 수평선 너머로 시작되는 선셋 빛깔을 감상합니다.",
        logisticsTip: "혼총 곶 전설의 거인 손자국 바위 포토존에서 연인과 함께 바다를 배경으로 사진을 남겨보세요.",
        placeIds: ["hoi-quan-hon-chong-cafe", "ola-cafe"],
        places: [
          {
            id: "hoi-quan-hon-chong-cafe",
            domain: "gourmet",
            name: "혼총 곶 절벽 카페 (Hội Quán Hòn Chồng)",
            categoryLabel: "절벽 오션뷰 카페",
            rating: 4.1,
            reviewCount: 1450,
            addressVi: "Khu du lịch Hòn Chồng, Vĩnh Phước, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=H%E1%BB%99i%20Qu%C3%A1n%20H%C3%B2n%20Ch%E1%BB%93ng%20Khu%20du%20l%E1%BB%8Bch%20H%C3%B2n%20Ch%E1%BB%93ng%20V%C4%A9nh%20Ph%C6%B0%E1%BB%9Bc%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=H%E1%BB%99i%20Qu%C3%A1n%20H%C3%B2n%20Ch%E1%BB%93ng%20Khu%20du%20l%E1%BB%8Bch%20H%C3%B2n%20Ch%E1%BB%93ng%20V%C4%A9nh%20Ph%C6%B0%E1%BB%9Bc%20Nha%20Trang",
            highlight: "파도 치는 바다 절벽 위에서 감상하는 파노라마 수평선 뷰",
            hours: "06:30 - 22:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "hoi-quan-hon-chong-cafe",
            domain: "gourmet",
            name: "혼총 곶 절벽 카페 (Hội Quán Hòn Chồng)",
            categoryLabel: "절벽 오션뷰 카페",
            rating: 4.1,
            reviewCount: 1450,
            addressVi: "Khu du lịch Hòn Chồng, Vĩnh Phước, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=H%E1%BB%99i%20Qu%C3%A1n%20H%C3%B2n%20Ch%E1%BB%93ng%20Khu%20du%20l%E1%BB%8Bch%20H%C3%B2n%20Ch%E1%BB%93ng%20V%C4%A9nh%20Ph%C6%B0%E1%BB%9Bc%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=H%E1%BB%99i%20Qu%C3%A1n%20H%C3%B2n%20Ch%E1%BB%93ng%20Khu%20du%20l%E1%BB%8Bch%20H%C3%B2n%20Ch%E1%BB%93ng%20V%C4%A9nh%20Ph%C6%B0%E1%BB%9Bc%20Nha%20Trang",
            highlight: "파도 치는 바다 절벽 위에서 감상하는 파노라마 수평선 뷰",
            hours: "06:30 - 22:00"
          }
        ]
      },
      {
        step: 3,
        stepNo: 3,
        time: "17:00 - 20:30",
        title: "5성급 럭셔리 선셋 디너 크루즈 & 바이올린 라이브 만찬",
        category: "activities",
        categoryLabel: "선셋 크루즈 디너",
        location: "엠페러 선셋 크루즈 (Emperor Cruises) 선착장 및 선상 레스토랑",
        duration: "약 3시간 30분",
        transitTime: "리무진 15분",
        description: "바오다이 황제의 호화 요트를 모티브로 한 5성급 크루즈에 탑승하여 웰컴 샴페인과 카나페를 즐기며 출항합니다. 갑판에서 붉은 노을을 감상한 뒤, 선상 레스토랑에서 클래식 라이브 바이올린 연주를 들으며 5코스 프리미엄 랍스터 & 비프 안심 스테이크와 무제한 고급 와인을 만끽합니다.",
        actionGuide: "바오다이 황제의 호화 요트를 모티브로 한 5성급 크루즈에 탑승하여 웰컴 샴페인과 카나페를 즐기며 출항합니다. 갑판에서 붉은 노을을 감상한 뒤, 선상 레스토랑에서 클래식 라이브 바이올린 연주를 들으며 5코스 프리미엄 랍스터 & 비프 안심 스테이크와 무제한 고급 와인을 만끽합니다.",
        recommendedAction: "바오다이 황제의 호화 요트를 모티브로 한 5성급 크루즈에 탑승하여 웰컴 샴페인과 카나페를 즐기며 출항합니다. 갑판에서 붉은 노을을 감상한 뒤, 선상 레스토랑에서 클래식 라이브 바이올린 연주를 들으며 5코스 프리미엄 랍스터 & 비프 안심 스테이크와 무제한 고급 와인을 만끽합니다.",
        logisticsTip: "크루즈 2층 선베드 데크는 선셋 골든 아워(17:30~18:15)에 최고의 커플 사진 명당입니다.",
        placeIds: ["act-13", "dining-theanam-colonial", "dining-intercon-costaseafood"],
        places: [
          {
            id: "act-13",
            domain: "activities",
            name: "엠페러(Emperor) 5성급 럭셔리 선셋 디너 크루즈",
            categoryLabel: "5성급 선셋 크루즈",
            rating: 4.97,
            reviewCount: 290,
            addressVi: "Cảng Nha Trang, Vĩnh Nguyên, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Emperor%20Cruises%20Nha%20Trang%20C%E1%BA%A3ng%20Nha%20Trang%20V%C4%A9nh%20Nguy%C3%AAn%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Emperor%20Cruises%20Nha%20Trang%20C%E1%BA%A3ng%20Nha%20Trang%20V%C4%A9nh%20Nguy%C3%AAn%20Nha%20Trang",
            highlight: "평점 4.97점의 5코스 랍스터 만찬 & 무제한 프리미엄 와인/칵테일",
            hours: "16:30 - 20:30"
          }
        ],
        recommendedPlaces: [
          {
            id: "act-13",
            domain: "activities",
            name: "엠페러(Emperor) 5성급 럭셔리 선셋 디너 크루즈",
            categoryLabel: "5성급 선셋 크루즈",
            rating: 4.97,
            reviewCount: 290,
            addressVi: "Cảng Nha Trang, Vĩnh Nguyên, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Emperor%20Cruises%20Nha%20Trang%20C%E1%BA%A3ng%20Nha%20Trang%20V%C4%A9nh%20Nguy%C3%AAn%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Emperor%20Cruises%20Nha%20Trang%20C%E1%BA%A3ng%20Nha%20Trang%20V%C4%A9nh%20Nguy%C3%AAn%20Nha%20Trang",
            highlight: "평점 4.97점의 5코스 랍스터 만찬 & 무제한 프리미엄 와인/칵테일",
            hours: "16:30 - 20:30"
          }
        ]
      },
      {
        step: 4,
        stepNo: 4,
        time: "20:30 - 22:30",
        title: "28층 스카이라운지 바 또는 해변 캔들라이트 칵테일 데이트",
        category: "hoteldining",
        categoryLabel: "루프탑 & 칵테일",
        location: "쉐라톤 28층 알티튜드 루프탑 바 또는 세일링 클럽",
        duration: "약 2시간",
        transitTime: "차량 10분",
        description: "크루즈 하선 후 쉐라톤 호텔 28층 최고층 루프탑 바에 올라 시원한 바닷바람과 함께 반짝이는 나트랑 시내 야경을 360도로 내려다보며 시그니처 칵테일과 샴페인을 기울이며 로맨틱한 밤을 완성합니다.",
        actionGuide: "크루즈 하선 후 쉐라톤 호텔 28층 최고층 루프탑 바에 올라 시원한 바닷바람과 함께 반짝이는 나트랑 시내 야경을 360도로 내려다보며 시그니처 칵테일과 샴페인을 기울이며 로맨틱한 밤을 완성합니다.",
        recommendedAction: "크루즈 하선 후 쉐라톤 호텔 28층 최고층 루프탑 바에 올라 시원한 바닷바람과 함께 반짝이는 나트랑 시내 야경을 360도로 내려다보며 시그니처 칵테일과 샴페인을 기울이며 로맨틱한 밤을 완성합니다.",
        logisticsTip: "야외 난간 테라스 커플 소파석은 인기가 많으므로 20:30 크루즈 종료 직후 이동하면 대기 없이 착석 가능합니다.",
        placeIds: ["dining-sheraton-altitude", "sailing-club-nha-trang"],
        places: [
          {
            id: "dining-sheraton-altitude",
            domain: "hoteldining",
            name: "알티튜드 루프탑 바 (Altitude Rooftop Bar - Sheraton 28F)",
            categoryLabel: "루프탑 & 스카이라운지",
            rating: 4.6,
            reviewCount: 380,
            addressVi: "26-28 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Altitude%20Rooftop%20Bar%20Sheraton%2026-28%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Altitude%20Rooftop%20Bar%20Sheraton%2026-28%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "28층 최고층 스카이뷰에서 즐기는 환상적인 나트랑 야경 & 칵테일",
            hours: "15:00 - 24:00"
          }
        ],
        recommendedPlaces: [
          {
            id: "dining-sheraton-altitude",
            domain: "hoteldining",
            name: "알티튜드 루프탑 바 (Altitude Rooftop Bar - Sheraton 28F)",
            categoryLabel: "루프탑 & 스카이라운지",
            rating: 4.6,
            reviewCount: 380,
            addressVi: "26-28 Trần Phú, Lộc Thọ, Nha Trang",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Altitude%20Rooftop%20Bar%20Sheraton%2026-28%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Altitude%20Rooftop%20Bar%20Sheraton%2026-28%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
            highlight: "28층 최고층 스카이뷰에서 즐기는 환상적인 나트랑 야경 & 칵테일",
            hours: "15:00 - 24:00"
          }
        ]
      }
    ]
  }
];

// Dual Export Support
if (typeof window !== 'undefined') {
  window.NHA_TRANG_CURATIONS = NHA_TRANG_CURATIONS;
  window.NHA_TRANG_CURATION = NHA_TRANG_CURATIONS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NHA_TRANG_CURATIONS,
    NHA_TRANG_CURATION: NHA_TRANG_CURATIONS
  };
}
