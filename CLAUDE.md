# CLAUDE.md — Nha Trang Trip 2026

나트랑 2026 자유 여행용 큐레이션 웹앱. **빌드 도구·프레임워크·패키지 매니저 없음** (Vanilla HTML/CSS/JS, `package.json` 없음). Node.js는 오직 테스트 스크립트 실행용.
- **액티비티 43선**: `data.js` (`NHA_TRANG_ACTIVITIES`)
- **로컬 맛집 113선**: `gourmet-data.js` (`NHA_TRANG_GOURMETS`)
- **숙소 24선 (4개 테마)**: `stays-data.js` (`NHA_TRANG_STAYS`)
- **짝퉁/패션 쇼핑 18선**: `shopping-data.js` (`NHA_TRANG_SHOPPING`)

## 실행

ES Module(`<script type="module">`)을 쓰므로 **`file://`로 열면 CORS 에러로 앱이 뜨지 않는다.** 반드시 로컬 HTTP 서버로 서빙할 것.

```bash
python3 -m http.server 8000
```

테스트는 서버 없이 Node로 바로 실행한다.

## 아키텍처

**2계층 로딩 구조** — `index.html`(744~747행)에서 순서가 중요하다.

1. 데이터 3종은 **클래식 스크립트**로 먼저 로드되어 전역 `const`(`NHA_TRANG_ACTIVITIES`, `NHA_TRANG_GOURMETS`, `NHA_TRANG_STAYS`, `NHA_TRANG_SCHEDULE`, `DEFAULT_EXCHANGE_RATE`)를 만든다.
2. `js/app.js`가 **ES Module**로 마지막에 로드되어 위 전역을 직접 참조한다. import 하지 않는다.

즉 데이터 스크립트 태그가 `js/app.js`보다 뒤로 가면 앱 전체가 깨진다 (`test-frontend.js` Suite 2가 이 순서를 검증).

```
index.html         단일 진입점. 3개 탭의 모든 정적 마크업 + 모달 + 하드코딩 카운트 뱃지
style.css          Airbnb 스타일 디자인 토큰 (약 38KB, 단일 파일)
data.js            NHA_TRANG_ACTIVITIES(43) + NHA_TRANG_SCHEDULE(7일) + DEFAULT_EXCHANGE_RATE
gourmet-data.js    NHA_TRANG_GOURMETS(113)   — module.exports 있음
stays-data.js      NHA_TRANG_STAYS(24)       — module.exports 있음
js/
  app.js                 탭 전환(switchMainTab), 전역 이벤트 바인딩, 모달/계산기/가이드, ESC 핸들러
  store/state.js         단일 state 객체 + localStorage 초기 로드 + 위시리스트 뱃지
  utils/storage.js       loadFromStorage / saveToStorage (try-catch 래핑)
  utils/helpers.js       formatVND, formatKRW, escapeHtml, showToast, copyAddress
  components/activity.js getFilteredActivities / renderCards / renderTimeline / 모달
  components/gourmet.js  getFilteredGourmets / renderGourmets / 모달
  components/stay.js     getFilteredStays / renderStays / 모달
test-*.js          Node 검증 스위트 (루트)
scratch/, .agents/ 과거 에이전트 작업 산출물. 프로덕션 코드 아님 — 수정/참조 불필요
```

3개 컴포넌트는 동일한 패턴을 따른다: `typeof NHA_TRANG_X === 'undefined'` 가드 → 필터 → 정렬 → 템플릿 리터럴로 카드 HTML 생성 → 이미지 에러 핸들러/찜 버튼/모달 오픈 바인딩. 신규 도메인 추가 시 이 3개 중 하나를 그대로 본떠 쓸 것.

`js/app.js`는 `renderCards`·`renderGourmets`·`renderStays`를 직접 호출하지만, 컴포넌트 → 앱 방향(필터 초기화 등)은 `window.dispatchEvent(new Event('reset-filters'))` 커스텀 이벤트로 역참조 없이 통신한다.

## 테스트

```bash
node test-activity.js && node test-gourmet.js && node test-stays.js && node test-seafood.js && node test-frontend.js
```

| 파일 | 대상 | 현재 상태 |
|---|---|---|
| `test-activity.js` | `data.js` 43개, 23필드 스키마, ID 유일성, 스케줄 참조 무결성 | 21/21 PASS |
| `test-gourmet.js` | `gourmet-data.js` 113개, 26필드, 맵 URL 형식, XSS | 24/24 PASS |
| `test-stays.js` | `stays-data.js` 24개, 4테마 균등, Trip.com URL | 30/30 PASS |
| `test-seafood.js` | 해산물 카테고리 17곳 도메인 검증 | PASS |
| `test-frontend.js` | `index.html` 필수 DOM ID, 스크립트 로드 순서, `js/app.js` ESM 여부 | 5/5 PASS |
| `test-challenger-2.js` | 링크/보안 어드버세리얼 | **깨져 있음** |

`test-challenger-2.js`는 루트 `app.js`를 읽는데(102행) 해당 파일이 `js/` 이하로 분리되면서 사라져 `ENOENT`로 즉시 죽는다. 이 스위트를 되살리려면 경로를 `js/` 모듈들로 갱신해야 한다. 손대지 않을 거라면 실행 목록에서 빼둘 것.

`data.js`는 `module.exports`가 없어서 `test-activity.js`가 `fs.readFileSync` + `eval`로 읽는다 (107행). 다른 두 데이터 파일은 `require()` 가능.

## 절대 규칙: 실제 데이터만 (Zero Hallucination)

이 프로젝트의 최상위 원칙이다. 평점, 리뷰 개수, 영업시간, 가격, 주소, 전화번호를 **추측하거나 그럴듯하게 지어내지 않는다.** 모든 수치는 실제 최신 Google Maps 데이터와 1:1 일치해야 한다. 신규 장소를 추가하거나 기존 수치를 갱신할 때는 웹 검색·브라우저 도구·서브에이전트 조사로 실측값을 수집하고 교차 검증한다. 확인이 안 되면 항목을 추가하지 말고 사용자에게 알린다.

구글 지도 링크는 **베트남 공식 정식 상호명 + 도로명 주소 + 행정동(`phường`) + Nha Trang** 조합으로 만들어 클릭 시 목록이 아닌 해당 매장으로 직결되게 한다.

```
https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}
```

## 카운트 동기화

데이터셋 개수가 `index.html`과 `js/app.js`에 **하드코딩**되어 있다. 데이터를 추가/삭제하면 아래를 전부 함께 고쳐야 하고, 안 고치면 테스트가 잡는다.

- `index.html`: 헤더 탭 뱃지(33, 37, 41행), 히어로 스탯 필(83행), 카테고리 첫 버튼 `전체 액티비티 (43곳)`·`전체 맛집 (113곳)`·`전체 숙소 (24곳)`(96, 146, 180행), 결과 카운트(280행)
- `js/app.js`: `switchMainTab`의 `heroTagsArea.innerHTML` 안 스탯 필 (60, 81, 98행)
- 테스트 파일의 기대 개수 상수

현재값: 액티비티 43 / 맛집 113 / 숙소 24.

## 코드 컨벤션

- **프레임워크 금지.** React, Tailwind, 번들러 도입하지 않는다.
- **CSS 클래스 1:1 일치.** 템플릿 리터럴로 HTML을 만들 때 클래스명을 새로 지어내지 말고 `style.css`에 이미 선언된 것(`.card-media-wrapper`, `.card-img`, `.modal-gallery-grid .main-img` 등)만 쓴다. 신규 클래스가 필요하면 `style.css`에 먼저 추가한다.
- **방어적 필드 바인딩.** 데이터 스키마가 도메인마다 다르므로 `(item.images || [item.imageUrl])`, `(item.tags || [])`, `(day.activities || day.activityIds || [])` 식 fallback 체이닝으로 `undefined.map` 크래시를 막는다.
- **localStorage 키는 `nha_trang_*` 접두어.** 현재 6개: `nha_trang_wishlist`, `nha_trang_gourmet_wishlist`, `nha_trang_stay_wishlist`, `nha_trang_notes`, `nha_trang_gourmet_notes`, `nha_trang_stay_notes`. 읽기/쓰기는 항상 `utils/storage.js` 경유.
- **사용자 입력·데이터 문자열은 `escapeHtml()`** 통과 후 innerHTML에 넣는다.
- **DOM 접근은 null 가드.** 3개 탭 마크업이 한 문서에 공존하고 `display:none`으로 전환되므로 `document.getElementById(...)?.` 또는 `if (el)` 패턴을 유지한다.
- UI 문안은 한국어, 베트남 상호/주소는 성조 포함 원문 표기(`nameVi`, `addressVi`).

## 신규 탭 추가 시

`GEMINI.md` §3의 5단계 SOP를 따른다 (데이터 모듈 → `index.html` 마크업 5곳 → state/렌더러/이벤트 → CSS 점검 → `test-<domain>.js` 작성). `js/components/stay.js`가 가장 최근에 이 절차로 만들어진 참조 구현이다.

## 작업 완료 전 체크

1. 신규/수정 장소의 구글 평점·리뷰 수가 실제 지도와 일치하는가
2. `nameVi` / `addressVi`가 공식 표기와 정확한가
3. 구글 맵 링크가 해당 장소로 직결되는가
4. `index.html` ↔ `js/app.js` ↔ 데이터셋 개수가 100% 동기화되었는가
5. 동적 생성 HTML의 클래스명이 `style.css`와 일치하는가
6. 카드 클릭·모달 오픈 시 콘솔 에러가 없는가 (HTTP 서버로 실제 확인)
7. `node test-*.js` 스위트가 통과하는가

## 관련 문서

- `GEMINI.md` — 프로젝트 규칙 원문 및 신규 탭 SOP 상세
- `PROJECT.md` — 액티비티 27→43 확장 작업의 아키텍처/마일스톤 기록. `app.js` 경로 기술은 `js/` 분리 이전 기준이라 현재와 다름
- `TEST_INFRA.md`, `TEST_READY.md` — 숙소 탭 테스트 설계 및 커버리지 기록
