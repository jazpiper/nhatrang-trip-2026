# Project Guidelines & Rules: Nha Trang Trip 2026 (나트랑 여행 가이드)

## 1. Ground-Truth Real Data Verification (실제 데이터 검증 원칙)
- **추측·임의 더미 데이터 절대 금지 (Zero-Tolerance for Hallucinated Metrics)**:
  - 맛집, 액티비티, 숙소, 쇼핑 등 모든 장소 데이터(구글 평점, 구글 리뷰 개수, 영업시간, 가격대, 도로명 주소, 메뉴/특징 등)를 임의로 지어내거나 어림잡아 작성하지 않는다.
  - 모든 장소의 평점 및 리뷰 개수는 **실제 최신 Google Maps 데이터**와 1:1로 일치해야 한다.
- **실시간 데이터 수집 및 교차 검증**:
  - 데이터 갱신 시 웹 검색, Chrome DevTools MCP, 또는 서브에이전트 조사를 통해 실제 Google Maps 장소 페이지의 정확한 실시간 수치를 수집 및 교차 검증한다.
- **정확한 구글 지도 검색 쿼리 연동**:
  - 구글 지도 링크는 단순 영문명이 아닌 **베트남 공식 정식 상호명 + 도로명 주소 + 행정동(`phường`) + Nha Trang**으로 구성하여, 클릭 시 엉뚱한 매장이나 목록 대신 해당 매장의 공식 지도/사진 페이지로 직결되도록 생성한다.
  - URL 형식: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

---

## 2. Single Source of Truth & Data Architecture (데이터 아키텍처)
- **데이터셋 파일 분리 & 단일 진실 공급원 (SSOT)**:
  - `data.js`: 액티비티 43선 (`NHA_TRANG_ACTIVITIES`), 6박 7일 타임라인(`NHA_TRANG_SCHEDULE`), 여행 팁(`NHA_TRANG_GUIDE_TIPS`)
  - `gourmet-data.js`: 로컬 맛집 & 카페 113선 (`NHA_TRANG_GOURMETS`)
  - `stays-data.js`: 숙소 4개 테마 24선 (`NHA_TRANG_STAYS`)
- **UI 및 정적 HTML 불일치 방지**:
  - 헤더 탭 뱃지, 카테고리 첫 버튼(예: `전체 액티비티 (43곳)`, `전체 맛집 (113곳)`, `전체 숙소 (24곳)`), 히어로 뱃지, 검색 결과 카운트 텍스트를 데이터셋의 실제 길이(`length`)와 100% 일치하도록 동기화한다.

---

## 3. Standard SOP: Adding a New Page / Tab (신규 페이지/탭 추가 표준 절차)
프로젝트는 Vanilla SPA(Single Page Application) 구조로 동작하므로, 신규 탭(예: 쇼핑/마켓, 선물 리스트, 가계부/예산 플래너 등)을 추가할 때는 아래 5단계를 반드시 준수한다.

### Step 1. 데이터 모듈 정의 (`<domain>-data.js`)
- 최상위 글로벌 변수(예: `const NHA_TRANG_SHOPPING = [...]`)로 내보내고 `index.html`의 `<script>` 태그에 로드.
- 모든 엔트리는 ID, 한국어명, 베트남 공식명, 카테고리, 태그, 평점, 리뷰수, 가격대, 구글맵 링크(`mapUrl`), 사진 링크(`photosUrl`), 위치, 팁 등 규격화된 스키마를 준수.

### Step 2. `index.html` 마크업 확장
1. **상단 네비게이션 (`header .header-nav-tabs`)**: 신규 탭 버튼 `<button class="nav-tab-btn" data-tab="<domain>">` 추가.
2. **카테고리 스크롤 바 (`nav.category-filter-section`)**: `<nav id="<domain>CategoryNav" style="display: none;">` 및 카테고리 버튼들 추가.
3. **태그 칩스 바 (`.tag-chips-wrapper`)**: `<div id="<domain>TagChips" style="display: none;">` 추가.
4. **메인 콘텐츠 섹션 (`main`)**: `<section id="<domain>GridSection" style="display: none;">` 및 카드 컨테이너 `<div id="<domain>CardsGridContainer">` 추가.
5. **상세 모달 (`dialog`/`modal`)**: 필요 시 신규 상세 모달 마크업 추가.

### Step 3. `js/app.js` 상태 관리 및 렌더링 로직 연동
1. **`state` 확장**:
   - `<domain>Category: 'all'`, `<domain>Tag: 'all'`
   - `<domain>Wishlist`, `<domain>Notes` (로컬스토리지 연동 `loadFromStorage`)
2. **`dom` 객체 캐싱**: 신규 네비게이션, 카테고리 버튼, 태그 칩스, 카드 컨테이너 등 DOM 참조 등록.
3. **`switchTab(tabName)` 업데이트**:
   - 탭 활성화 클래스 전환
   - 히어로 타이틀/설명/태그 교체
   - 해당 카테고리 바, 태그 바, 콘텐츠 섹션만 `display: block` 처리
   - 검색창 플레이스홀더 텍스트 변경
   - 해당 탭 렌더 함수(`render<Domain>s()`) 호출
4. **렌더러 및 필터/정렬 함수 구현**:
   - `getFiltered<Domain>s()`: 카테고리, 태그 칩, 검색어(다중 필드), 위시리스트 필터, 정렬(추천순/평점순/가격순)
   - `render<Domain>s()`: 카드 템플릿 생성, 이미지 에러 핸들러, 찜하기 버튼 이벤트, 클릭 시 상세 모달 오픈 바인딩
5. **이벤트 리스너 등록**: 카테고리 클릭, 태그 칩 클릭, 모달 열기/닫기, 찜/메모 로컬스토리지 저장.

### Step 4. `style.css` 스타일 점검 & 반응형 확인
- Airbnb 스타일의 디자인 토큰(그리드, 뱃지, 태그 칩, 둥근 모서리, 카드 호버 트랜지션, 모바일 반응형 뷰포트) 일관성 유지.

### Step 5. 테스트 스위트 작성 & 검증 (`test-<domain>.js`)
- `test-<domain>.js` 작성 후 `node test-<domain>.js`로 데이터 유효성(필수 필드 누락, rating/reviewCount 타입, mapUrl 인코딩) 100% 통과 검증.

---

## 4. Code & Quality Conventions (코드 및 품질 규칙)
- **Vanilla Modern Web**: 프레임워크(React, Next.js, Tailwind 등) 없이 순수 Vanilla HTML, CSS, JavaScript 유지.
- **동적 템플릿 마크업의 CSS 클래스 1:1 일치 (CSS Class Invariants)**:
  - `js/app.js` 등에서 템플릿 리터럴로 HTML을 동적 생성할 때 임의의 클래스명을 만들지 말고, 반드시 `style.css`에 기선언된 클래스(예: `.card-media-wrapper`, `.card-img`, `.modal-gallery-grid .main-img`, `.modal-gallery-grid .sub-imgs`)와 100% 일치시켜 레이아웃 붕괴를 방지한다.
- **스키마 필드명 방어적 바인딩 & Fallback**:
  - 데이터셋 필드 참조 시 fallback 체이닝(`act.images || [act.imageUrl]`, `act.whatToBring || []`)을 적용하여 `TypeError: undefined.map`과 같은 런타임 크래시를 전면 차단한다.
- **로컬 스토리지 데이터 격리**: 브라우저 `localStorage` 키 네이밍 접두어 `nha_trang_*` 준수.
- **방어적 DOM 렌더링**: XSS 방지 텍스트 처리, 요소 null 체크 가드, 이미지 로딩 실패 시 fallback 처리.

---

## 5. Operational Checklist Before Delivery (작업 완료 체크리스트)
1. [ ] 신규 추가/수정된 모든 장소의 Google Maps 평점 및 리뷰 개수가 실제 구글 지도와 일치하는가?
2. [ ] 베트남어 원문 주소(`addressVi`)와 상호명(`nameVi`)이 공식 표기와 정확히 일치하는가?
3. [ ] 구글 맵 다이렉트 링크를 눌렀을 때 해당 장소로 정확히 이동하는가?
4. [ ] `index.html`, `js/app.js`, 데이터셋 간의 장소 개수 및 메타데이터가 100% 동기화되었는가?
5. [ ] 동적 렌더링 HTML의 CSS 클래스명이 `style.css`와 100% 일치하며 레이아웃 깨짐이 없는가?
6. [ ] 모달 오픈 및 카드 클릭 시 자바스크립트 콘솔 에러가 발생하지 않는가?
7. [ ] `node test-*.js` 유효성 검사 스크립트를 통과했는가?

