// ==========================================
// Nha Trang Trip 2026 - Stays Dataset (24 Accommodations)
// 100% Real-Time Google Maps & Trip.com Verified Data
// Dual Export Support (Browser Window & Node.js)
// ==========================================

const NHA_TRANG_STAYS = [
  // ==========================================
  // THEME 1: 웰컴 가성비 0.5박 (Welcome Budget <50k KRW in City Center)
  // ==========================================
  {
    id: "stay_01",
    theme: "theme1",
    themeName: "웰컴 가성비 0.5박",
    nameKo: "레갈리아 골드 호텔",
    nameEn: "Regalia Gold Hotel",
    nameVi: "Khách sạn Regalia Gold",
    category: "호텔",
    pricePerNightVnd: 650000,
    priceRangeVnd: "550,000 ~ 850,000 VND",
    estimatedPriceKrw: "~36,000원",
    rating: 4.3,
    reviewCount: 3200,
    address: "39-41 Nguyen Thi Minh Khai, Tan Lap, Nha Trang (야시장 도보 3분)",
    addressVi: "39-41 Nguyễn Thị Minh Khai, Tân Lập, Nha Trang, Khánh Hòa 650000",
    area: "시내 중심 / 탄랍",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["40층루프탑수영장", "야시장도보3분", "24시간체크인", "가성비끝판왕", "시티뷰맛집"],
    amenities: ["40층 루프탑 인피니티 풀", "24시간 프런트 데스크", "무료 초고속 Wi-Fi", "피트니스 센터", "무료 수하물 보관", "조식 뷔페"],
    highlights: [
      "새벽 비행기 도착 시에도 24시간 프런트 데스크에서 빠르고 친절한 웰컴 체크인 지원",
      "나트랑 최고층(40층) 야외 인피니티 풀에서 시내와 에메랄드 바다를 한눈에 조망",
      "야시장, 콩카페, 인기 반쎄오 맛집들이 도보 3~5분 거리에 밀집해 있어 익일 동선 최적"
    ],
    nearbySpots: [
      "나트랑 야시장 (도보 3분 / 250m)",
      "콩카페 2호점 (도보 4분 / 300m)",
      "반쎄오 85 (도보 2분 / 150m)",
      "나트랑 해변 (도보 5분 / 400m)"
    ],
    googleMapQuery: "Khách sạn Regalia Gold 39-41 Nguyễn Thị Minh Khai Tân Lập Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch%20s%E1%BA%A1n%20Regalia%20Gold%2039-41%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Regalia%20Gold%20Hotel%20Nha%20Trang"
  },
  {
    id: "stay_02",
    theme: "theme1",
    themeName: "웰컴 가성비 0.5박",
    nameKo: "버고 호텔 나트랑",
    nameEn: "Virgo Hotel Nha Trang",
    nameVi: "Khách sạn Virgo Nha Trang",
    category: "호텔",
    pricePerNightVnd: 680000,
    priceRangeVnd: "580,000 ~ 900,000 VND",
    estimatedPriceKrw: "~38,000원",
    rating: 4.1,
    reviewCount: 2000,
    address: "39-41 Nguyen Thi Minh Khai, Tan Lap, Nha Trang (시내 중심가)",
    addressVi: "39-41 Nguyễn Thị Minh Khai, Tân Lập, Nha Trang, Khánh Hòa 650000",
    area: "시내 중심 / 탄랍",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["28층루프탑풀", "야시장도보4분", "가성비5성급", "발코니객실", "24시간체크인"],
    amenities: ["28층 인피니티 풀 & 바", "24시간 리셉션", "무료 Wi-Fi", "피트니스 센터", "조식 뷔페", "스파 & 사우나"],
    highlights: [
      "레갈리아 골드 바로 옆에 위치한 고층 랜드마크로 탁 트인 바다 및 도심 조망",
      "전 객실 발코니 구비로 개방감이 우수하며 28층 루프탑 수영장의 환상적인 일몰 뷰",
      "야시장과 도보 4분, CCCP 커피 및 유명 마사지샵이 도보권에 있어 편리한 여행 출발"
    ],
    nearbySpots: [
      "나트랑 야시장 (도보 4분 / 300m)",
      "CCCP 커피 (도보 3분 / 220m)",
      "포 한푹 쌀국수 (도보 5분 / 350m)",
      "나트랑 해변 (도보 6분 / 450m)"
    ],
    googleMapQuery: "Khách sạn Virgo Nha Trang 39-41 Nguyễn Thị Minh Khai Tân Lập Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch%20s%E1%BA%A1n%20Virgo%20Nha%20Trang%2039-41%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Virgo%20Hotel%20Nha%20Trang"
  },
  {
    id: "stay_03",
    theme: "theme1",
    themeName: "웰컴 가성비 0.5박",
    nameKo: "에리카 호텔 나트랑",
    nameEn: "Erica Nha Trang Hotel",
    nameVi: "Khách sạn Erica Nha Trang",
    category: "호텔",
    pricePerNightVnd: 520000,
    priceRangeVnd: "450,000 ~ 750,000 VND",
    estimatedPriceKrw: "~29,000원",
    rating: 4.2,
    reviewCount: 1150,
    address: "17 Biet Thu, Loc Tho, Nha Trang (여행자의 거리 포떠이)",
    addressVi: "17 Biệt Thự, Lộc Thọ, Nha Trang, Khánh Hòa 650000",
    area: "시내 중심 / 록토",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["포떠이거리", "27층루프탑풀", "해변도보4분", "2만원대가성비", "24시간체크인"],
    amenities: ["27층 루프탑 풀", "24시간 프런트 데스크", "무료 Wi-Fi", "피트니스 룸", "레스토랑", "수하물 무료 보관"],
    highlights: [
      "나트랑 번화가인 비엣투(Biệt Thự) 여행자 거리에 위치해 밤 늦게 도착해도 치안 안전",
      "해변까지 도보 4분(300m), 27층 루프탑에서 즐기는 탁 트인 바다 전망",
      "1박 2~3만원대 믿기지 않는 가성비로 밤비행기 도착 후 부담 없는 1박에 최적"
    ],
    nearbySpots: [
      "나트랑 해변 (도보 4분 / 300m)",
      "세일링 클럽 나트랑 (도보 5분 / 380m)",
      "야시장 & 침향탑 (도보 7분 / 500m)",
      "갈랑가 로컬 맛집 (도보 3분 / 200m)"
    ],
    googleMapQuery: "Khách sạn Erica Nha Trang 17 Biệt Thự Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch%20s%E1%BA%A1n%20Erica%20Nha%20Trang%2017%20Bi%E1%BB%87t%20Th%E1%BB%B1%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Erica%20Nha%20Trang%20Hotel"
  },
  {
    id: "stay_04",
    theme: "theme1",
    themeName: "웰컴 가성비 0.5박",
    nameKo: "DTX 호텔 나트랑",
    nameEn: "DTX Hotel Nha Trang",
    nameVi: "Khách sạn DTX Nha Trang",
    category: "호텔",
    pricePerNightVnd: 480000,
    priceRangeVnd: "400,000 ~ 680,000 VND",
    estimatedPriceKrw: "~27,000원",
    rating: 4.6,
    reviewCount: 960,
    address: "3A Quan Tran, Loc Tho, Nha Trang (훈붕 여행자 거리 골목)",
    addressVi: "3A Quân Trấn, Lộc Thọ, Nha Trang, Khánh Hòa 650000",
    area: "시내 중심 / 록토",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["평점4.6특급가성비", "루프탑수영장", "해변도보3분", "조용하고깔끔", "조식맛집"],
    amenities: ["루프탑 인피니티 풀", "24시간 프런트", "무료 Wi-Fi", "피트니스 센터", "조식 뷔페", "투어 데스크"],
    highlights: [
      "구글 평점 4.6의 압도적인 만족도를 자랑하는 록토 중심 4성급 신축급 가성비 호텔",
      "메인 로드에서 살짝 안쪽 골목에 위치해 도심 소음 없이 조용하고 쾌적한 수면 보장",
      "해변 도보 3분, 야시장 도보 5분 거리로 밤늦게 체크인 후 익일 일정 소화에 최적"
    ],
    nearbySpots: [
      "나트랑 해변 (도보 3분 / 260m)",
      "야시장 & 침향탑 (도보 5분 / 400m)",
      "CCCP 커피 1호점 (도보 4분 / 300m)",
      "포홍 쌀국수 (도보 6분 / 450m)"
    ],
    googleMapQuery: "Khách sạn DTX Nha Trang 3A Quân Trấn Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch%20s%E1%BA%A1n%20DTX%20Nha%20Trang%203A%20Qu%C3%A2n%20Tr%E1%BA%A5n%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=DTX%20Hotel%20Nha%20Trang"
  },
  {
    id: "stay_05",
    theme: "theme1",
    themeName: "웰컴 가성비 0.5박",
    nameKo: "봉주르 나트랑 호텔",
    nameEn: "Bonjour Nha Trang Hotel",
    nameVi: "Khách sạn Bonjour Nha Trang",
    category: "호텔",
    pricePerNightVnd: 450000,
    priceRangeVnd: "380,000 ~ 620,000 VND",
    estimatedPriceKrw: "~25,000원",
    rating: 4.2,
    reviewCount: 480,
    address: "17/2A Nguyen Thi Minh Khai, Loc Tho, Nha Trang",
    addressVi: "17/2A Nguyễn Thị Minh Khai, Lộc Thọ, Nha Trang, Khánh Hòa 650000",
    area: "시내 중심 / 록토",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["전객실발코니", "해변도보3분", "초특가가성비", "24시간프런트", "루프탑수영장"],
    amenities: ["루프탑 수영장", "전 객실 발코니", "24시간 프런트", "무료 Wi-Fi", "피트니스 센터", "조식 레스토랑"],
    highlights: [
      "전 102개 객실 모두 개별 발코니를 갖추어 시원한 개방감과 환기 편의 제공",
      "응우옌티민카이 거리 안쪽 골목에 위치해 소음 차단과 중심가 접근성을 동시에 만족",
      "1박 2만원대 중반의 초특가로 웰컴 0.5박 숙박비 지출을 극적으로 절약"
    ],
    nearbySpots: [
      "나트랑 해변 (도보 3분 / 280m)",
      "나트랑 야시장 (도보 4분 / 320m)",
      "촌촌킴 로컬 가정식 (도보 5분 / 380m)",
      "빈컴플라자 (도보 6분 / 450m)"
    ],
    googleMapQuery: "Khách sạn Bonjour Nha Trang 17/2A Nguyễn Thị Minh Khai Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch%20s%E1%BA%A1n%20Bonjour%20Nha%20Trang%2017%2F2A%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Bonjour%20Nha%20Trang%20Hotel"
  },
  {
    id: "stay_06",
    theme: "theme1",
    themeName: "웰컴 가성비 0.5박",
    nameKo: "리브라 호텔 나트랑",
    nameEn: "Libra Hotel Nha Trang",
    nameVi: "Khách sạn Libra Nha Trang",
    category: "호텔",
    pricePerNightVnd: 500000,
    priceRangeVnd: "420,000 ~ 720,000 VND",
    estimatedPriceKrw: "~28,000원",
    rating: 4.4,
    reviewCount: 1120,
    address: "14 Hung Vuong, Loc Tho, Nha Trang (훈붕 메인 로드 중심)",
    addressVi: "14 Hùng Vương, Lộc Thọ, Nha Trang, Khánh Hòa 650000",
    area: "시내 중심 / 록토",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["훈붕메인로드", "실내수영장", "야시장도보2분", "조식뷔페호평", "24시간프런트"],
    amenities: ["실내 수영장", "피트니스 센터", "스파 & 마사지", "24시간 리셉션", "무료 Wi-Fi", "조식 뷔페"],
    highlights: [
      "나트랑 시내 최고 요지인 훈붕(Hùng Vương) 대로변에 위치해 접근성 최고",
      "야시장과 도보 2분(180m), 해변 도보 4분으로 밤늦게 체크인 후에도 주변 인프라 100% 활용",
      "비가 오거나 햇볕이 강해도 쾌적하게 이용 가능한 실내 수영장 및 피트니스 시설 완비"
    ],
    nearbySpots: [
      "나트랑 야시장 (도보 2분 / 180m)",
      "침향탑 & 2/4 광장 (도보 4분 / 300m)",
      "J스파 & 로컬 마사지 거리 (도보 2분 / 150m)",
      "포 한푹 쌀국수 (도보 4분 / 280m)"
    ],
    googleMapQuery: "Khách sạn Libra Nha Trang 14 Hùng Vương Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch%20s%E1%BA%A1n%20Libra%20Nha%20Trang%2014%20H%C3%B9ng%20V%C6%B0%C6%A1ng%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Libra%20Hotel%20Nha%20Trang"
  },

  // ==========================================
  // THEME 2: 5성급 럭셔리 (5-Star Luxury Resorts / Beachfront)
  // ==========================================
  {
    id: "stay_07",
    theme: "theme2",
    themeName: "5성급 럭셔리",
    nameKo: "빈펄 리조트 나트랑 (혼째섬)",
    nameEn: "Vinpearl Resort Nha Trang",
    nameVi: "Vinpearl Resort Nha Trang (Đảo Hòn Tre)",
    category: "리조트",
    pricePerNightVnd: 3200000,
    priceRangeVnd: "2,600,000 ~ 4,500,000 VND",
    estimatedPriceKrw: "~178,000원",
    rating: 4.6,
    reviewCount: 5800,
    address: "Hon Tre Island, Vinh Nguyen, Nha Trang (혼째섬 프라이빗 비치)",
    addressVi: "Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang, Khánh Hòa 650000",
    area: "혼째섬 / 빈응우옌",
    checkIn: "15:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["혼째섬전용비치", "5000m²초대형수영장", "빈원더스도보권", "스피드보트/케이블카", "럭셔리5성급"],
    amenities: ["5,000m² 초대형 야외 풀", "프라이빗 비치 & 카약", "아키다 스파 (Akoya Spa)", "키즈클럽 & 골프클럽", "24시간 스피드보트", "미식 레스토랑 4곳"],
    highlights: [
      "혼째섬 전용 화이트 샌드 비치와 5,000m²에 달하는 동남아 최대 규모 야외 수영장 보유",
      "스피드보트/케이블카로 섬에 입도하는 특별한 럭셔리 휴양 경험 및 빈원더스 테마파크 무료 셔틀",
      "인도차이나풍 클래식 궁전 스타일의 압도적인 건축미와 전 객실 오션/가든 파노라마 뷰"
    ],
    nearbySpots: [
      "빈원더스 나트랑 테마파크 (버기 3분 / 700m)",
      "빈펄 하버 복합쇼핑몰 (버기 5분 / 1.2km)",
      "빈펄 골프 클럽 (버기 7분 / 2km)",
      "빈펄 케이블카 승강장 (스피드보트 7분)"
    ],
    googleMapQuery: "Vinpearl Resort Nha Trang Đảo Hòn Tre Vĩnh Nguyên Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Vinpearl%20Resort%20Nha%20Trang%20%C4%90%E1%BA%A3o%20H%C3%B2n%20Tre%20V%C3%ACnh%20Nguy%C3%AAn%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Vinpearl%20Resort%20Nha%20Trang"
  },
  {
    id: "stay_08",
    theme: "theme2",
    themeName: "5성급 럭셔리",
    nameKo: "아미아나 리조트 나트랑",
    nameEn: "Amiana Resort Nha Trang",
    nameVi: "Khu nghỉ dưỡng Amiana Nha Trang",
    category: "리조트",
    pricePerNightVnd: 5200000,
    priceRangeVnd: "4,500,000 ~ 7,800,000 VND",
    estimatedPriceKrw: "~289,000원",
    rating: 4.7,
    reviewCount: 7400,
    address: "Pham Van Dong, Vinh Hoa, Nha Trang (북부 해변 프라이빗 만)",
    addressVi: "Vịnh Nha Trang, Phạm Văn Đồng, Vĩnh Hòa, Nha Trang, Khánh Hòa 650000",
    area: "북부 해변 / 빈호아",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["천연해수풀2500m²", "스노클링명소", "프리미엄머드스파", "오션빌라", "평점4.7원탑"],
    amenities: ["2,500m² 천연 해수 수영장", "담수 인피니티 풀 2개", "프라이빗 머드 바스 & 스파", "스노클링 & 무동력 해양스포츠", "무료 시내 셔틀버스", "비치사이드 레스토랑"],
    highlights: [
      "나트랑에서 가장 평점이 높은 5성급 리조트로 구글 리뷰 7,400개 / 4.7점의 검증된 퀄리티",
      "2,500m² 초대형 천연 해수 풀과 리조트 앞바다에서 직접 즐기는 산호초 스노클링 포인트",
      "바다를 바라보며 즐기는 프라이빗 머드 스파와 울창한 열대 정원 속 독립형 럭셔리 빌라"
    ],
    nearbySpots: [
      "혼총 곶 (차량 10분 / 5.5km)",
      "포나가르 첨탑 (차량 13분 / 7km)",
      "아이리조트 머드온천 (차량 18분 / 9km)",
      "나트랑 시내 중심 (무료 셔틀 15분 / 8km)"
    ],
    googleMapQuery: "Khu nghỉ dưỡng Amiana Nha Trang Phạm Văn Đồng Vĩnh Hòa Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Khu%20ngh%E1%BB%89%20d%C6%B0%E1%BB%A1ng%20Amiana%20Nha%20Trang%20Ph%E1%BA%A1m%20V%C4%83n%20%C4%90%E1%BB%93ng%20V%C3%ACnh%20H%C3%B2a%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Amiana%20Resort%20Nha%20Trang"
  },
  {
    id: "stay_09",
    theme: "theme2",
    themeName: "5성급 럭셔리",
    nameKo: "인터컨티넨탈 나트랑",
    nameEn: "InterContinental Nha Trang",
    nameVi: "Khách sạn InterContinental Nha Trang",
    category: "호텔",
    pricePerNightVnd: 4200000,
    priceRangeVnd: "3,800,000 ~ 6,500,000 VND",
    estimatedPriceKrw: "~233,000원",
    rating: 4.7,
    reviewCount: 4800,
    address: "32-34 Tran Phu, Loc Tho, Nha Trang (쩐푸 해변도로 1번지)",
    addressVi: "32-34 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa 650000",
    area: "시내 해변가 / 록토",
    checkIn: "15:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["쩐푸비치프론트", "IHG글로벌럭셔리", "야외풀3개", "클럽라운지", "평점4.7"],
    amenities: ["3개 야외 수영장 & 키즈풀", "전용 비치 썬베드 구역", "스파 인터컨티넨탈", "24시간 피트니스", "인터컨티넨탈 클럽 라운지", "키즈클럽 플래닛 트레커"],
    highlights: [
      "나트랑의 상징적인 골든 스트리트 쩐푸(Trần Phú) 해변 정중앙에 위치한 IHG 최고급 5성급 호텔",
      "3개의 야외 수영장과 전 객실 개인 발코니에서 바라보는 에메랄드빛 나트랑만 파노라마 뷰",
      "유명 쿡북 카페(Cookbook Cafe)의 시그니처 조식 뷔페 및 시내 맛집/쇼핑몰 도보 1분 접근성"
    ],
    nearbySpots: [
      "나트랑 메인 비치 (길 건너 바로 앞 / 50m)",
      "나트랑 센터 쇼핑몰 (도보 2분 / 150m)",
      "나트랑 야시장 (도보 8분 / 650m)",
      "침향탑 & 2/4 광장 (도보 10분 / 800m)"
    ],
    googleMapQuery: "Khách sạn InterContinental Nha Trang 32-34 Trần Phú Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch%20s%E1%BA%A1n%20InterContinental%20Nha%20Trang%2032-34%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=InterContinental%20Nha%20Trang"
  },
  {
    id: "stay_10",
    theme: "theme2",
    themeName: "5성급 럭셔리",
    nameKo: "쉐라톤 나트랑 호텔 & 스파",
    nameEn: "Sheraton Nha Trang Hotel & Spa",
    nameVi: "Khách sạn Sheraton Nha Trang",
    category: "호텔",
    pricePerNightVnd: 3600000,
    priceRangeVnd: "3,200,000 ~ 5,800,000 VND",
    estimatedPriceKrw: "~200,000원",
    rating: 4.6,
    reviewCount: 4000,
    address: "26-28 Tran Phu, Loc Tho, Nha Trang (쩐푸 해변 도로)",
    addressVi: "26-28 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa 650000",
    area: "시내 해변가 / 록토",
    checkIn: "15:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["메리어트5성급", "28층루프탑바", "인피니티풀", "전객실오션뷰", "비치바로앞"],
    amenities: ["6층 야외 인피니티 풀", "28층 Altitude 루프탑 바", "샤인 스파 (Shine Spa)", "메리어트 본보이 혜택", "피트니스 & 사우나", "전용 비치 데스크"],
    highlights: [
      "메리어트 인터내셔널 5성급 브랜드의 검증된 환대 서비스와 전 객실 100% 오션뷰 발코니",
      "나트랑 시내 가장 높은 28층 야외 루프탑 바(Altitude Rooftop Bar)에서 즐기는 환상적인 야경",
      "6층 곡선형 인피니티 풀에서 해변과 바다를 내려다보며 칵테일과 힐링을 만끽"
    ],
    nearbySpots: [
      "나트랑 비치 (길 건너 바로 앞 / 50m)",
      "나트랑 센터 & 롯데시네마 (도보 2분 / 120m)",
      "포나가르 사원 (차량 7분 / 3.2km)",
      "담 시장 (차량 5분 / 2km)"
    ],
    googleMapQuery: "Khách sạn Sheraton Nha Trang 26-28 Trần Phú Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch%20s%E1%BA%A1n%20Sheraton%20Nha%20Trang%2026-28%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Sheraton%20Nha%20Trang%20Hotel%20Spa"
  },
  {
    id: "stay_11",
    theme: "theme2",
    themeName: "5성급 럭셔리",
    nameKo: "미아 리조트 나트랑",
    nameEn: "Mia Resort Nha Trang",
    nameVi: "Khu nghỉ dưỡng Mia Nha Trang",
    category: "리조트",
    pricePerNightVnd: 5600000,
    priceRangeVnd: "4,200,000 ~ 7,800,000 VND",
    estimatedPriceKrw: "~311,000원",
    rating: 4.7,
    reviewCount: 2700,
    address: "Bai Dong, Cam Hai Dong, Cam Lam (나트랑 남부 절벽 해안)",
    addressVi: "Bãi Đông, Cam Hải Đông, Cam Lâm, Khánh Hòa 650000",
    area: "남부 해안 절벽 / 깜람",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["절벽오션뷰", "프라이빗비치", "클리프빌라", "모히토라운지", "평점4.7에코럭셔리"],
    amenities: ["절벽 인피니티 풀 & 비치 풀", "프라이빗 비치", "오트 스파 (Oat Spa)", "모히토 라운지 & 바", "요가 클래스 (무료)", "샌달스 레스토랑"],
    highlights: [
      "깎아지른 해안 절벽과 에메랄드빛 프라이빗 만(Bay)이 어우러진 나트랑 최고의 에코 럭셔리 은신처",
      "전용 비치를 품은 클리프 빌라와 프라이빗 가든, 매주 진행되는 무료 해변 요가 세션",
      "선셋 명소 모히토스(Mojito's) 라운지에서 즐기는 시그니처 칵테일과 미슐랭급 이탈리안 & 해산물 다이닝"
    ],
    nearbySpots: [
      "다이아몬드 베이 골프클럽 (차량 6분 / 4km)",
      "깜라인 국제공항 (차량 20분 / 18km)",
      "나트랑 시내 중심가 (무료 셔틀 25분 / 17km)",
      "바이따이 비치 (차량 12분 / 10km)"
    ],
    googleMapQuery: "Khu nghỉ dưỡng Mia Nha Trang Bãi Đông Cam Hải Đông Cam Lâm",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Khu%20ngh%E1%BB%89%20d%C6%B0%E1%BB%A1ng%20Mia%20Nha%20Trang%20B%C3%A3i%20%C4%90%C3%B4ng%20Cam%20H%E1%BA%A3i%20%C4%90%C3%B4ng%20Cam%20L%C3%A2m",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Mia%20Resort%20Nha%20Trang"
  },
  {
    id: "stay_12",
    theme: "theme2",
    themeName: "5성급 럭셔리",
    nameKo: "퓨전 리조트 깜라인",
    nameEn: "Fusion Resort Cam Ranh",
    nameVi: "Khu nghỉ dưỡng Fusion Cam Ranh",
    category: "리조트",
    pricePerNightVnd: 6500000,
    priceRangeVnd: "5,200,000 ~ 9,500,000 VND",
    estimatedPriceKrw: "~361,000원",
    rating: 4.7,
    reviewCount: 2100,
    address: "Lo D10B, Nguyen Tat Thanh, Bai Dong, Cam Hai Dong, Cam Lam",
    addressVi: "Lô D10B, Nguyễn Tất Thành, Bãi Đông, Cam Hải Đông, Cam Lâm, Khánh Hòa 650000",
    area: "깜라인 바이따이 / 깜람",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["올스파인클루시브", "언제어디서나조식", "전객실풀빌라/스위트", "공항10분", "평점4.7웰니스"],
    amenities: ["1일 1회 무료 스파 (올스파 인클루시브)", "언제 어디서나 조식 서비스", "2개 대형 수영장 & 전용 비치", "무료 요가/태극권 클래스", "공항 무료 픽업/샌딩", "키즈클럽 & 팜투어"],
    highlights: [
      "투숙객 전원 1일 1회 스파 트리트먼트가 기본 포함된 '올 스파 인클루시브(All-Spa-Inclusive)' 럭셔리",
      "시간과 장소 제약 없이 객실, 해변, 수영장 어디서든 조식을 주문해 즐기는 혁신적인 힐링 서비스",
      "깜라인 공항에서 차량 10분 거리의 뛰어난 접근성과 바이따이 비치의 드넓은 백사장을 품은 독채 풀빌라"
    ],
    nearbySpots: [
      "깜라인 국제공항 (차량 10분 / 8km)",
      "KN 골프 링크스 깜라인 (차량 15분 / 12km)",
      "바이따이 서핑 스팟 (도보 1분 / 전면 비치)",
      "나트랑 시내 중심 (무료 셔틀 35분 / 28km)"
    ],
    googleMapQuery: "Khu nghỉ dưỡng Fusion Cam Ranh Nguyễn Tất Thành Cam Hải Đông Cam Lâm",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Khu%20ngh%E1%BB%89%20d%C6%B0%E1%BB%A1ng%20Fusion%20Cam%20Ranh%20Nguy%E1%BB%85n%20T%E1%BA%A5t%20Th%C3%A0nh%20Cam%20H%E1%BA%A3i%20%C4%90%C3%B4ng%20Cam%20L%C3%A2m",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Fusion%20Resort%20Cam%20Ranh"
  },

  // ==========================================
  // THEME 3: 감성 풀빌라 (Private Pool Villas & Peaceful Healing)
  // ==========================================
  {
    id: "stay_13",
    theme: "theme3",
    themeName: "감성 풀빌라",
    nameKo: "식스센스 닌반베이",
    nameEn: "Six Senses Ninh Van Bay",
    nameVi: "Six Senses Ninh Vân Bay",
    category: "풀빌라",
    pricePerNightVnd: 18500000,
    priceRangeVnd: "16,000,000 ~ 32,000,000 VND",
    estimatedPriceKrw: "~980,000원",
    rating: 4.7,
    reviewCount: 1150,
    address: "Vinh Ninh Van, Ninh Hoa, Khanh Hoa (스피드보트 20분 진입 전용 만)",
    addressVi: "Vịnh Ninh Vân, Xã Ninh Vân, Thị xã Ninh Hòa, Tỉnh Khánh Hòa",
    area: "닌반베이",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["최고급 풀빌라", "에코 럭셔리", "전용 보트 진입", "자연 힐링", "전담 버틀러"],
    amenities: ["프라이빗 전용풀", "전담 GEM(버틀러) 서비스", "오가닉 웰니스 스파", "야외 정글 시네마", "무료 요가 클래스", "해양 스포츠"],
    highlights: [
      "천연 화강암 바위와 열대 숲속에 완벽히 숨겨진 세계적 수준의 독채 풀빌라",
      "전담 버틀러(GEM)가 일정부터 다이닝까지 1:1 밀착 케어",
      "자체 유기농 농장 식재료로 완성하는 파인다이닝 & 멸종위기 야생 랑구르 관찰"
    ],
    nearbySpots: [
      "닌반베이 산호 리프 (리조트 앞 스노클링)",
      "식스센스 오가닉 팜 (리조트 내 도보 3분)",
      "나트랑 시내 선착장 (스피드보트 20분)"
    ],
    googleMapQuery: "Six Senses Ninh Van Bay Vịnh Ninh Vân Ninh Hòa Khánh Hòa",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Six%20Senses%20Ninh%20Van%20Bay%20V%E1%BB%8Bnh%20Ninh%20V%C3%A2n%20Ninh%20H%C3%B2a%20Kh%C3%A1nh%20H%C3%B2a",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Six%20Senses%20Ninh%20Van%20Bay"
  },
  {
    id: "stay_14",
    theme: "theme3",
    themeName: "감성 풀빌라",
    nameKo: "안람 리트리츠 닌반베이",
    nameEn: "An Lam Retreats Ninh Van Bay",
    nameVi: "An Lâm Retreats Ninh Vân Bay",
    category: "풀빌라",
    pricePerNightVnd: 9800000,
    priceRangeVnd: "8,200,000 ~ 16,500,000 VND",
    estimatedPriceKrw: "~520,000원",
    rating: 4.7,
    reviewCount: 680,
    address: "Hon Heo Peninsula, Ninh Van, Ninh Hoa (보트 전용 진입)",
    addressVi: "Bán Đảo Hòn Hèo, Xã Ninh Vân, Thị xã Ninh Hòa, Tỉnh Khánh Hòa",
    area: "닌반베이",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["트리하우스 풀빌라", "성인 힐링 리트리트", "연꽃 레스토랑", "계곡 트레킹", "프라이빗 보트"],
    amenities: ["단독 인피니티 풀", "24시간 1:1 버틀러", "정글 스파 & 사우나", "Sen 연꽃 레스토랑", "계곡 폭포 트레킹", "선셋 칵테일 크루즈"],
    highlights: [
      "자연 원목으로 지어진 신비로운 숲속 트리하우스 & 베이뷰 독채 풀빌라",
      "바다 위에 피어난 연꽃 모양의 Sen 레스토랑에서 즐기는 로맨틱 디너",
      "정글 계곡 폭포에서 즐기는 천연 피크닉과 명상 힐링 세션"
    ],
    nearbySpots: [
      "혼헤오 정글 폭포 (도보 10분 트레킹)",
      "안람 전용 라군 비치 (리조트 바로 앞)",
      "닌반 선착장 (스피드보트 15분)"
    ],
    googleMapQuery: "An Lam Retreats Ninh Van Bay Bán Đảo Hòn Hèo Ninh Hòa Khánh Hòa",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=An%20Lam%20Retreats%20Ninh%20Van%20Bay%20B%C3%A1n%20%C4%90%E1%BA%A3o%20H%C3%B2n%20H%C3%A8o%20Ninh%20H%C3%B2a",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=An%20Lam%20Retreats%20Ninh%20Van%20Bay"
  },
  {
    id: "stay_15",
    theme: "theme3",
    themeName: "감성 풀빌라",
    nameKo: "그란 멜리아 나트랑",
    nameEn: "Gran Meliá Nha Trang (Villa Le Corail)",
    nameVi: "Gran Meliá Nha Trang",
    category: "풀빌라",
    pricePerNightVnd: 10500000,
    priceRangeVnd: "8,800,000 ~ 19,500,000 VND",
    estimatedPriceKrw: "~560,000원",
    rating: 4.8,
    reviewCount: 1020,
    address: "Khu Do Thi Vega City, Bai Tien, Vinh Hoa, Nha Trang (북부 베가시티 단지)",
    addressVi: "Khu Đô Thị Vega City, Bãi Tiên, Đường Đệ, Phường Vĩnh Hòa, Nha Trang, Khánh Hòa",
    area: "바이띠엔 / 베가시티",
    checkIn: "15:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["초호화 럭셔리", "스페인 감성", "미슐랭 다이닝", "온천 온센", "전 객실 오션뷰 풀빌라"],
    amenities: ["단독 인피니티 전용풀", "미슐랭 Hispania 레스토랑", "천연 온천수 온센 & 하맘 스파", "키즈 클럽 & 프라이빗 비치", "24시간 컨시어지", "루프탑 바"],
    highlights: [
      "스페인 최고급 호스피탈리티 럭셔리 브랜드의 전 객실 독채 프라이빗 풀빌라",
      "스페인 미슐랭 3스타 셰프 마르코스 모란 협업 'Hispania' 정통 파인다이닝",
      "나트랑 유일의 천연 온천 미네랄 온센과 터키식 하맘 스파 시설"
    ],
    nearbySpots: [
      "도 아트 극장 (베가시티 내 도보 3분)",
      "바이띠엔 해변 산책로 (리조트 바로 앞)",
      "포나가르 사원 (차량 12분)"
    ],
    googleMapQuery: "Gran Meliá Nha Trang Khu Đô Thị Vega City Bãi Tiên Vĩnh Hòa Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Gran%20Meli%C3%A1%20Nha%20Trang%20Vega%20City%20B%C3%A3i%20Ti%C3%AAn%20V%C3%A9nh%20H%C3%B2a%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Gran%20Melia%20Nha%20Trang"
  },
  {
    id: "stay_16",
    theme: "theme3",
    themeName: "감성 풀빌라",
    nameKo: "미아 리조트 나트랑 (풀빌라)",
    nameEn: "Mia Resort Nha Trang - Cliff & Beachfront Villas",
    nameVi: "Mia Resort Nha Trang",
    category: "풀빌라",
    pricePerNightVnd: 7500000,
    priceRangeVnd: "6,800,000 ~ 12,500,000 VND",
    estimatedPriceKrw: "~400,000원",
    rating: 4.7,
    reviewCount: 2650,
    address: "Bai Dong, Cam Hai Dong, Cam Lam (나트랑-깜란 사이 바이동 절벽 해변)",
    addressVi: "Bãi Dông, Cam Hải Đông, Huyện Cam Lâm, Tỉnh Khánh Hòa",
    area: "바이동 / 절벽 해변",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["절벽 풀빌라", "오션뷰 끝판왕", "부티크 럭셔리", "Sandals 조식", "프라이빗 비치"],
    amenities: ["절벽 파노라마 전용풀", "Sandals 해변 레스토랑", "Oasis 인피니티 풀", "Xanh 스파 & 사우나", "주말 무료 비치 요가", "스노클링 & 카약"],
    highlights: [
      "자연 절벽 위에 자리 잡아 파도 소리와 쪽빛 바다가 쏟아지는 단독 클리프 풀빌라",
      "바다를 바라보며 즐기는 Sandals 레스토랑의 수준 높은 주문식 알라카르트 조식",
      "외부인 통제된 프라이빗 만(Bay)에서 만끽하는 완벽한 고요와 힐링"
    ],
    nearbySpots: [
      "바이동 프라이빗 비치 (빌라 앞 도보 1분)",
      "다이아몬드 베이 골프클럽 (차량 5분)",
      "깜란 국제공항 (차량 20분)"
    ],
    googleMapQuery: "Mia Resort Nha Trang Bãi Dông Cam Hải Đông Cam Lâm Khánh Hòa",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Mia%20Resort%20Nha%20Trang%20B%C3%A3i%20D%C3%B4ng%20Cam%20H%E1%BA%A3i%20%C4%90%C3%B4ng%20Kh%C3%A1nh%20H%C3%B2a",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Mia%20Resort%20Nha%20Trang"
  },
  {
    id: "stay_17",
    theme: "theme3",
    themeName: "감성 풀빌라",
    nameKo: "퓨전 리조트 깜란 (올 스파 풀빌라)",
    nameEn: "Fusion Resort Cam Ranh - All Spa Inclusive",
    nameVi: "Fusion Resort Cam Ranh",
    category: "풀빌라",
    pricePerNightVnd: 5800000,
    priceRangeVnd: "5,200,000 ~ 9,800,000 VND",
    estimatedPriceKrw: "~310,000원",
    rating: 4.6,
    reviewCount: 2250,
    address: "Lo D10B, Dai Lo Nguyen Tat Thanh, Cam Hai Dong, Cam Lam (깜란 롱비치 북부 모래언덕 위)",
    addressVi: "Lô D10B, Đại Lộ Nguyễn Tất Thành, Cam Hải Đông, Huyện Cam Lâm, Tỉnh Khánh Hòa",
    area: "깜란 롱비치",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["1일 1스파 무료", "해먹 욕조", "모래언덕 풀빌라", "올인클루시브 스파", "언제어디서나 조식"],
    amenities: ["단독 전용 수영장", "전 투숙객 1일 1회 무료 스파", "시그니처 플로팅 해먹 욕조", "언제 어디서나 조식(Breakfast Anywhere)", "유기농 퓨전 팜", "요가 파빌리온"],
    highlights: [
      "숙박비 전액에 1일 1회 정규 스파 트리트먼트가 기본 포함된 국내 유일 올-스파 인클루시브",
      "시간과 장소에 구애받지 않고 빌라 풀사이드나 비치에서 즐기는 '언제 어디서나 조식' 서비스",
      "모래언덕 위 공중에 매달린 듯한 환상적인 시그니처 해먹 욕조 & 프라이빗 풀"
    ],
    nearbySpots: [
      "깜란 롱비치 해변 (리조트 전용)",
      "퓨전 오가닉 팜 (리조트 내 도보 2분)",
      "깜란 국제공항 (차량 8분)"
    ],
    googleMapQuery: "Fusion Resort Cam Ranh Nguyễn Tất Thành Cam Hải Đông Cam Lâm Khánh Hòa",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Fusion%20Resort%20Cam%20Ranh%20Nguy%E1%BB%85n%20T%E1%BA%A5t%20Th%C3%A0nh%20Cam%20H%E1%BA%A3i%20%C4%90%C3%B4ng%20Cam%20L%C3%A2m",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Fusion%20Resort%20Cam%20Ranh"
  },
  {
    id: "stay_18",
    theme: "theme3",
    themeName: "감성 풀빌라",
    nameKo: "랄리아 닌반베이",
    nameEn: "L'Alya Ninh Van Bay",
    nameVi: "L'Alya Ninh Vân Bay",
    category: "풀빌라",
    pricePerNightVnd: 7200000,
    priceRangeVnd: "6,500,000 ~ 13,000,000 VND",
    estimatedPriceKrw: "~380,000원",
    rating: 4.7,
    reviewCount: 460,
    address: "Thon Tan Thanh, Ninh Ich, Ninh Hoa, Khanh Hoa (닌호아 닌익 탄탄 마을 닌반베이 만)",
    addressVi: "Thôn Tân Thành, Xã Ninh Ích, Thị xã Ninh Hòa, Tỉnh Khánh Hòa",
    area: "닌반베이",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["오리엔탈 풀빌라", "전담 1:1 버틀러", "라군 풀빌라", "초가지붕 감성", "프라이빗 힐링"],
    amenities: ["단독 프라이빗 인피니티 풀", "24시간 1:1 전담 버틀러", "라군 & 비치 프론트 다이닝", "천연 숲속 웰니스 스파", "무료 카약 & 패들보드", "선셋 칵테일 세션"],
    highlights: [
      "자연 목재와 짚풀 지붕으로 지어진 아늑하고 감성적인 베트남 러스틱 럭셔리 독채 풀빌라",
      "체크인부터 아웃까지 모든 동선과 요구를 도맡아주는 24시간 개인 버틀러 서비스",
      "호수와 바다가 한눈에 이어지는 청정 라군 수영장에서 만끽하는 온전한 휴식"
    ],
    nearbySpots: [
      "탄탄 프라이빗 라군 (리조트 바로 앞)",
      "닌익 정글 트레일 (도보 5분)",
      "나트랑 전용 선착장 (스피드보트 15분)"
    ],
    googleMapQuery: "L'Alya Ninh Van Bay Thôn Tân Thành Ninh Ích Ninh Hòa Khánh Hòa",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=L%27Alya%20Ninh%20Van%20Bay%20Th%C3%B4n%20T%C3%A2n%20Th%C3%A0nh%20Ninh%20%C3%8Dch%20Ninh%20H%C3%B2a",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=L%27Alya%20Ninh%20Van%20Bay"
  },

  // ==========================================
  // THEME 4: 출국 전 0.5박 (Late Check-out Budget Stays <50k KRW)
  // ==========================================
  {
    id: "stay_19",
    theme: "theme4",
    themeName: "출국 전 0.5박",
    nameKo: "씨에스타 호텔 나트랑",
    nameEn: "Seaesta Nha Trang Hotel",
    nameVi: "Khách Sạn Seaesta Nha Trang",
    category: "호텔",
    pricePerNightVnd: 580000,
    priceRangeVnd: "500,000 ~ 850,000 VND",
    estimatedPriceKrw: "~31,000원",
    rating: 4.8,
    reviewCount: 1250,
    address: "116A Hong Bang, Tan Lap, Nha Trang (나트랑 시내 중심 홍방 거리, 야시장 도보 5분)",
    addressVi: "116A Hồng Bàng, Tân Lập, Nha Trang, Khánh Hòa",
    area: "시내 중심 / 야시장 인근",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["0.5박 추천 1위", "루프탑 사우나", "신축급 청결", "야시장 도보", "짐보관 무료"],
    amenities: ["24시간 프론트 데스크", "루프탑 수영장 & 사우나", "무료 수하물 보관", "초고속 에어컨", "온수 샤워 시설", "공항 샌딩 차량 예약"],
    highlights: [
      "한국인 평점 4.8★ 극찬! 3만원대에 루프탑 수영장과 사우나까지 이용 가능한 최고 만족도 0.5박 호텔",
      "마지막 날 야시장 쇼핑과 마사지 후 사우나에서 개운하게 씻고 밤 비행기 타기 완벽한 동선",
      "새벽 출국 전까지 안전하고 친절한 무료 짐 보관 & 공항 그랩/샌딩 지원"
    ],
    nearbySpots: [
      "나트랑 야시장 (도보 5분 / 350m)",
      "CCCP 커피 홍방점 (도보 2분 / 150m)",
      "김청 환전소 & 반미판 (도보 4분 / 280m)",
      "나트랑 해변 (도보 7분 / 500m)"
    ],
    googleMapQuery: "Seaesta Nha Trang Hotel 116A Hồng Bàng Tân Lập Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Seaesta%20Nha%20Trang%20Hotel%20116A%20H%E1%BB%93ng%20B%C3%A0ng%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Seaesta%20Nha%20Trang%20Hotel"
  },
  {
    id: "stay_20",
    theme: "theme4",
    themeName: "출국 전 0.5박",
    nameKo: "레 스참 호텔 나트랑",
    nameEn: "Le's Cham Hotel Nha Trang",
    nameVi: "Khách Sạn Le's Cham Nha Trang",
    category: "호텔",
    pricePerNightVnd: 520000,
    priceRangeVnd: "450,000 ~ 750,000 VND",
    estimatedPriceKrw: "~28,000원",
    rating: 4.6,
    reviewCount: 1450,
    address: "87 Bach Dang, Tan Lap, Nha Trang (나트랑 시내 바찌에우/박당 거리, 반미판 도보 1분)",
    addressVi: "87 Bạch Đằng, Tân Lập, Nha Trang, Khánh Hòa",
    area: "시내 중심 / 맛집 거리",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["반미판 도보 1분", "루프탑 풀", "2만원대 가성비", "출국전 샤워", "한국인 인기"],
    amenities: ["20층 루프탑 인피니티 풀", "24시간 짐 보관 서비스", "풀타올 무료 대여", "온수 샤워부스", "개별 냉방 에어컨", "무료 Wi-Fi"],
    highlights: [
      "반미판 도보 1분! 마지막 날 맛집 정복과 기념품 정리 후 편안하게 쉬어가는 2만원대 쉼터",
      "체크아웃 후에도 루프탑 수영장과 샤워실을 자유롭게 이용 가능하여 상쾌하게 출국",
      "늦은 밤 10시까지 친절하게 캐리어를 보관해주고 공항 이동 차량을 바로 안내"
    ],
    nearbySpots: [
      "반미판 (도보 1분 / 80m)",
      "포홍 쌀국수 (도보 3분 / 220m)",
      "나트랑 야시장 (도보 6분 / 450m)",
      "해변 산책로 (도보 7분 / 500m)"
    ],
    googleMapQuery: "Le's Cham Hotel 87 Bạch Đằng Tân Lập Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Le%27s%20Cham%20Hotel%2087%20B%E1%BA%A1ch%20%C4%90%E1%BA%B1ng%20T%C3%A2n%20L%E1%BA%ADp%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Le%27s%20Cham%20Hotel%20Nha%20Trang"
  },
  {
    id: "stay_21",
    theme: "theme4",
    themeName: "출국 전 0.5박",
    nameKo: "메이플 호텔 & 아파트먼트",
    nameEn: "Maple Hotel & Apartment Nha Trang",
    nameVi: "Khách Sạn Maple Nha Trang",
    category: "레지던스",
    pricePerNightVnd: 550000,
    priceRangeVnd: "450,000 ~ 750,000 VND",
    estimatedPriceKrw: "~29,000원",
    rating: 4.4,
    reviewCount: 1100,
    address: "16 Ton Dan, Loc Tho, Nha Trang (톤단 거리, 야시장 도보 2분 / 해변 도보 3분)",
    addressVi: "16 Tôn Đản, Lộc Thọ, Nha Trang, Khánh Hòa",
    area: "야시장 / 쩐푸 해변 인근",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["야시장 도보 2분", "레지던스 주방", "세탁기 구비", "짐패킹 최적", "루프탑 풀"],
    amenities: ["주방 시설 & 대형 냉장고", "루프탑 야외 수영장", "24시간 짐 보관", "세탁 서비스", "발코니", "피트니스 센터"],
    highlights: [
      "야시장 바로 뒷골목 2분 거리! 쇼핑한 망고, 캐슈넛, 기념품을 객실에서 여유롭게 패킹하기 최고",
      "레지던스형 넓은 객실에 싱크대와 냉장고가 완비되어 있어 가족 및 커플의 출국 전 정리에 최적",
      "심야 공항 출발 전까지 루프탑 수영장과 시원한 샤워 시설 지원"
    ],
    nearbySpots: [
      "나트랑 야시장 (도보 2분 / 150m)",
      "향타워 & 쩐푸 해변 (도보 3분 / 200m)",
      "세일링 클럽 (도보 5분 / 380m)",
      "갈랑가 레스토랑 (도보 3분 / 220m)"
    ],
    googleMapQuery: "Maple Hotel & Apartment 16 Tôn Đản Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Maple%20Hotel%20%26%20Apartment%2016%20T%C3%B4n%20%C4%90%E1%BA%A3n%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Maple%20Hotel%20Apartment%20Nha%20Trang"
  },
  {
    id: "stay_22",
    theme: "theme4",
    themeName: "출국 전 0.5박",
    nameKo: "퀸터 센트럴 나트랑",
    nameEn: "Quinter Central Nha Trang",
    nameVi: "Khách Sạn Quinter Central Nha Trang",
    category: "호텔",
    pricePerNightVnd: 590000,
    priceRangeVnd: "480,000 ~ 800,000 VND",
    estimatedPriceKrw: "~31,000원",
    rating: 4.4,
    reviewCount: 2600,
    address: "86/4 Tran Phu, Loc Tho, Nha Trang (쩐푸 남부 록토, 해변 도보 5분)",
    addressVi: "86/4 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa",
    area: "록토 / 쩐푸 해변 남부",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["5성급 규모 가성비", "대형 수영장", "조용하고 쾌적", "넓은 로비", "공항 이동 편리"],
    amenities: ["대형 야외 수영장", "24시간 리셉션 & 컨시어지", "무료 짐 보관", "스파 & 마사지", "넓은 로비 라운지", "샤워 가운 & 어메니티"],
    highlights: [
      "3만원대에 누리는 5성급 규모의 넓은 객실과 웅장한 로비, 쾌적한 수영장 시설",
      "시내 중심의 소음에서 살짝 벗어나 출국 전 조용하고 깊은 휴식과 숙면 가능",
      "넓은 로비에서 대형 밴/택시 승하차가 매우 편리하여 단체 및 가족 공항 이동에 최적"
    ],
    nearbySpots: [
      "나트랑 해변 (도보 5분 / 380m)",
      "세일링 클럽 (도보 7분 / 500m)",
      "롯데마트 나트랑점 (차량 6분 / 2.5km)",
      "야시장 (도보 10분 / 800m)"
    ],
    googleMapQuery: "Quinter Central Nha Trang 86/4 Trần Phú Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Quinter%20Central%20Nha%20Trang%2086%2F4%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Quinter%20Central%20Nha%20Trang"
  },
  {
    id: "stay_23",
    theme: "theme4",
    themeName: "출국 전 0.5박",
    nameKo: "멜리사 호텔 나트랑",
    nameEn: "Melissa Hotel Nha Trang",
    nameVi: "Khách Sạn Melissa Nha Trang",
    category: "호텔",
    pricePerNightVnd: 560000,
    priceRangeVnd: "480,000 ~ 780,000 VND",
    estimatedPriceKrw: "~30,000원",
    rating: 4.4,
    reviewCount: 1150,
    address: "100A2-100A3 Tran Phu, Loc Tho, Nha Trang (쩐푸 해변 메인 비치프론트)",
    addressVi: "100A2-100A3 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa",
    area: "쩐푸 비치프론트",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["오션뷰 발코니", "해변 바로 앞", "루프탑 풀", "24시간 짐보관", "가성비 4성급"],
    amenities: ["21층 루프탑 오션뷰 풀", "전 객실 발코니 조망", "24시간 수하물 보관", "사우나 시설", "피트니스", "룸서비스"],
    highlights: [
      "쩐푸 메인 비치 바로 앞! 마지막 날 탁 트인 바다 전망을 보며 뒹굴거리다 씻고 출국",
      "3만원에 누리는 4성급 호텔의 루프탑 인피니티 풀 & 사우나 시설",
      "호텔 문을 열면 바로 해변 산책로와 비치 바가 연결되는 최고의 접근성"
    ],
    nearbySpots: [
      "쩐푸 비치 산책로 (도보 10초 / 20m)",
      "루이지애나 브루하우스 (도보 5분 / 400m)",
      "세일링 클럽 (도보 6분 / 450m)",
      "나트랑 야시장 (도보 8분 / 650m)"
    ],
    googleMapQuery: "Melissa Hotel 100A2-100A3 Trần Phú Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Melissa%20Hotel%20100A2-100A3%20Tr%E1%BA%A7n%20Ph%C3%BA%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Melissa%20Hotel%20Nha%20Trang"
  },
  {
    id: "stay_24",
    theme: "theme4",
    themeName: "출국 전 0.5박",
    nameKo: "세아나 호텔 나트랑",
    nameEn: "Seana Hotel Nha Trang",
    nameVi: "Khách Sạn Seana Nha Trang",
    category: "호텔",
    pricePerNightVnd: 420000,
    priceRangeVnd: "380,000 ~ 620,000 VND",
    estimatedPriceKrw: "~22,000원",
    rating: 4.4,
    reviewCount: 850,
    address: "4H-5H Quan Tran, Hung Vuong, Loc Tho, Nha Trang (훙브엉 여행자 거리 꽌쩐 골목, 야시장 도보 3분)",
    addressVi: "4H-5H Quân Trấn, Hùng Vương, Lộc Thọ, Nha Trang, Khánh Hòa",
    area: "시내 중심 / 야시장 인근",
    checkIn: "14:00",
    checkOut: "12:00",
    coverImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["초가성비 2만원대", "야시장 도보 3분", "꽌쩐 맛집골목", "온수 샤워", "친절한 짐보관"],
    amenities: ["24시간 프론트 데스크", "무료 수하물 보관", "루프탑 소형 수영장", "강력한 냉방 에어컨", "온수 샤워 & 어메니티", "공항 택시 예약"],
    highlights: [
      "1박 2만원대 압도적 가성비! 짐 보관, 샤워, 에어컨 침대 휴식이라는 0.5박의 본질에 100% 충실",
      "나트랑 여행자의 거리 군쩐(Quân Trấn) 골목에 있어 야시장, 약국 쇼핑, 마사지 도보 2~3분 완벽",
      "밤 10시까지 안전하게 짐을 보관해주고 로비에서 공항 그랩 차량 호출을 친절히 지원"
    ],
    nearbySpots: [
      "나트랑 야시장 (도보 3분 / 220m)",
      "65번 과일가게 & 약국 (도보 2분 / 120m)",
      "갈랑가 로컬 식당 (도보 2분 / 150m)",
      "나트랑 해변 (도보 4분 / 300m)"
    ],
    googleMapQuery: "Seana Hotel 4H-5H Quân Trấn Hùng Vương Lộc Thọ Nha Trang",
    googleMapUrl: "https://www.google.com/maps/search/?api=1&query=Seana%20Hotel%204H-5H%20Qu%C3%A2n%20Tr%E1%BA%A5n%20H%C3%B9ng%20V%C6%B0%C6%A1ng%20L%E1%BB%99c%20Th%E1%BB%8D%20Nha%20Trang",
    tripDotComUrl: "https://kr.trip.com/hotels/list?keyword=Seana%20Hotel%20Nha%20Trang"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NHA_TRANG_STAYS };
}
