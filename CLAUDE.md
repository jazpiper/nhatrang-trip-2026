# CLAUDE.md — Nha Trang Trip 2026

나트랑 2026 자유 여행용 큐레이션 웹앱. **빌드 도구·프레임워크·패키지 매니저 없음** (Vanilla HTML/CSS/JS, `package.json` 없음). Node.js는 오직 테스트 스크립트 실행용.
- **액티비티 43선**: `data.js` (`NHA_TRANG_ACTIVITIES`)
- **로컬 맛집 113선**: `gourmet-data.js` (`NHA_TRANG_GOURMETS`)
- **숙소 24선 (4개 테마)**: `stays-data.js` (`NHA_TRANG_STAYS`)
- **짝퉁/패션 쇼핑 18선**: `shopping-data.js` (`NHA_TRANG_SHOPPING`)
- **환전 & ATM 17곳**: `currency-data.js` (`NHA_TRANG_CURRENCY`, `NHA_TRANG_TRAVEL_CARDS`, `NHA_TRANG_ATM_TIPS`)

## 실행

전부 클래식 스크립트라 `file://`로 열어도 동작하지만, 개발 중에는 HTTP 서버로 확인할 것.

```bash
python3 -m http.server 8000
```

테스트는 서버 없이 Node로 바로 실행한다.

## 아키텍처

**2계층 로딩 구조** — `index.html` 하단 스크립트 태그의 순서가 중요하다.

1. 데이터 5종이 **클래식 스크립트**로 먼저 로드되어 전역 `const`(`NHA_TRANG_ACTIVITIES`, `NHA_TRANG_GOURMETS`, `NHA_TRANG_STAYS`, `NHA_TRANG_SHOPPING`, `NHA_TRANG_CURRENCY`, `NHA_TRANG_SCHEDULE`, `DEFAULT_EXCHANGE_RATE`)를 만든다.
2. `js/app.js`가 마지막에 로드되어 위 전역을 직접 참조한다. import 하지 않는다.

데이터 스크립트가 `js/app.js`보다 뒤로 가면 해당 탭이 통째로 죽는다 (`test-frontend.js` Suite 2가 5개 전부 순서를 검증).

```
index.html         단일 진입점. 5개 탭의 모든 정적 마크업 + 모달 + 하드코딩 카운트 뱃지
style.css          Airbnb 스타일 디자인 토큰 (단일 파일)
data.js            NHA_TRANG_ACTIVITIES(43) + NHA_TRANG_SCHEDULE(7일) + DEFAULT_EXCHANGE_RATE
gourmet-data.js    NHA_TRANG_GOURMETS(113)   — module.exports 있음
stays-data.js      NHA_TRANG_STAYS(24)       — module.exports 있음
shopping-data.js   NHA_TRANG_SHOPPING(18)    — module.exports 있음
currency-data.js   NHA_TRANG_CURRENCY(17)    — module.exports 있음
js/app.js          전체 앱 로직 단일 파일 (IIFE). 도메인별 섹션 주석으로 구분:
                     1 스토리지 / 2 포맷·UI 헬퍼 / 3 state
                     4 액티비티 / 5 맛집 / 6 숙소 / 7 쇼핑 / 8 환전·ATM
                     9 탭 전환 / 10 이벤트 바인딩 / 11 부트스트랩 + Node export shim
test-*.js          Node 검증 스위트 (루트)
scratch/, .agents/ 과거 에이전트 작업 산출물. 프로덕션 코드 아님 — 수정/참조 불필요
```

과거의 `js/store/`, `js/utils/`, `js/components/` 모듈 분리는 되돌려져 지금은 `js/app.js` 하나뿐이다. `PROJECT.md`나 옛 문서가 그 경로를 언급하면 무시할 것.

5개 도메인은 동일한 패턴을 따른다: `typeof NHA_TRANG_X === 'undefined'` 가드 → 필터 → 정렬 → 템플릿 리터럴로 카드 HTML 생성 → 이미지 에러 핸들러/찜 버튼/모달 오픈 바인딩. 신규 도메인 추가 시 섹션 8(환전)을 그대로 본떠 쓸 것.

### Node 테스트용 export shim

`js/app.js` 맨 끝에서 `typeof module !== 'undefined'`일 때만 `getFilteredCurrency` 등 순수 함수를 `module.exports`로 내보낸다. 브라우저에서는 `module`이 없어 무해하고, 테스트는 이 덕분에 **로직을 재구현하지 않고 실제 함수를 실행**한다. 같은 이유로 부트스트랩(`init()` 호출)은 `typeof document !== 'undefined'` 가드 안에 있다.

새 도메인의 필터 함수를 만들면 이 export 목록에도 추가할 것. 안 하면 테스트가 또 재구현본을 검증하게 된다.

## 테스트

```bash
node test-activity.js && node test-gourmet.js && node test-stays.js && node test-seafood.js && node test-shopping.js && node test-currency.js && node test-frontend.js
```

| 파일 | 대상 | 현재 상태 |
|---|---|---|
| `test-activity.js` | `data.js` 43개, 23필드 스키마, ID 유일성, 스케줄 참조 무결성 | 21/21 PASS |
| `test-gourmet.js` | `gourmet-data.js` 113개, 26필드, 맵 URL 형식, XSS | 24/24 PASS |
| `test-stays.js` | `stays-data.js` 24개, 4테마 균등, Trip.com URL | 30/30 PASS |
| `test-seafood.js` | 해산물 카테고리 17곳 도메인 검증 | PASS |
| `test-shopping.js` | `shopping-data.js` 18개 | 25/25 PASS |
| `test-currency.js` | `currency-data.js` 17개, 스키마 균일성, **실제 `getFilteredCurrency()` 구동** | 43/43 PASS |
| `test-frontend.js` | DOM ID, 스크립트 순서, CSS 클래스 불변식, 환전 탭 실제 필터 | 7 스위트 PASS |
| `test-challenger-2.js` | 링크/보안 어드버세리얼 | **깨져 있음** |

`test-challenger-2.js`는 루트 `app.js`를 읽는데(102행) 지금 그 경로에 파일이 없어 `ENOENT`로 즉시 죽는다. 되살리려면 `js/app.js`를 읽도록 고쳐야 한다. 손대지 않을 거면 실행 목록에서 빼둘 것.

`data.js`는 `module.exports`가 없어서 `test-activity.js`가 `fs.readFileSync` + `eval`로 읽는다 (107행). 나머지 데이터 파일은 `require()` 가능.

### 테스트를 쓸 때 지킬 것

**필터·정렬 로직을 테스트 파일 안에 재구현하지 말 것.** `js/app.js`를 `require()`해서 실제 함수를 돌려라. 재구현본을 검증하는 테스트는 앱이 완전히 망가져도 통과한다(실제로 이 프로젝트에서 `getFilteredCurrency()`를 `return []`로 만들어도 전 스위트가 통과한 전례가 있다).

```js
global.NHA_TRANG_CURRENCY = require('./currency-data.js').NHA_TRANG_CURRENCY;
const app = require('./js/app.js');
app.resetStateFilters();
app.state.currencyCategory = 'atm_zero_fee';
app.getFilteredCurrency();   // 실제 앱 코드
```

**카운트·개수 단언은 데이터셋에서 파생시킬 것.** `includes('17곳')` 같은 하드코딩 리터럴은 데이터가 바뀌어도 안 잡힌다. `NHA_TRANG_X.length`로 기대값을 만들어라. OR로 여러 조건을 묶을 때 그중 하나가 항상 참이면 단언 전체가 무력화된다.

`test-frontend.js` Suite 4b는 `js/app.js`가 템플릿 리터럴로 뱉는 모든 클래스가 `style.css`에 선언돼 있는지 검사한다. 기존 부채는 `KNOWN_UNSTYLED` 목록에 있고 **줄이기만 하고 늘리지 않는다.**

## 절대 규칙: 실제 데이터만 (Zero Hallucination)

이 프로젝트의 최상위 원칙이다. 평점, 리뷰 개수, 영업시간, 가격, 주소, 전화번호를 **추측하거나 그럴듯하게 지어내지 않는다.** 모든 수치는 실제 최신 Google Maps 데이터와 1:1 일치해야 한다. 신규 장소를 추가하거나 기존 수치를 갱신할 때는 웹 검색·브라우저 도구·서브에이전트 조사로 실측값을 수집하고 교차 검증한다. 확인이 안 되면 항목을 추가하지 말고 사용자에게 알린다.

구글 지도 링크는 **베트남 공식 정식 상호명 + 도로명 주소 + 행정동(`phường`) + Nha Trang** 조합으로 만들어 클릭 시 목록이 아닌 해당 매장으로 직결되게 한다.

```
https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}
```

## 카운트 동기화

데이터셋 개수가 `index.html`과 `js/app.js`에 **하드코딩**되어 있다. 데이터를 추가/삭제하면 아래를 전부 함께 고쳐야 한다. (행 번호는 금방 낡으므로 `grep`으로 찾을 것.)

- `index.html`: 헤더 탭 뱃지(`class="tab-badge"`), 카테고리 첫 버튼 `전체 … (N곳)`, 카테고리별 소계 `(N곳)`, 결과 카운트 `id="…ResultCountText"`
- `js/app.js`: `switchMainTab`의 `heroTagsArea.innerHTML` 안 스탯 필
- 테스트 파일의 기대 개수 상수

현재값: 액티비티 43 / 맛집 113 / 숙소 24 / 쇼핑 18 / 환전·ATM 17.

환전 탭은 `test-currency.js`가 `NHA_TRANG_CURRENCY.length`에서 기대값을 파생시켜 `currencyCategoryNav`의 모든 `(N곳)`과 결과 카운트를 대조한다. 다른 탭도 같은 방식으로 강화할 여지가 있다.

## 코드 컨벤션

- **프레임워크 금지.** React, Tailwind, 번들러 도입하지 않는다.
- **CSS 클래스 1:1 일치.** 템플릿 리터럴로 HTML을 만들 때 클래스명을 새로 지어내지 말고 `style.css`에 이미 선언된 것(`.card-media-wrapper`, `.card-img`, `.card-body` 등)만 쓴다. 신규 클래스가 필요하면 `style.css`에 **먼저** 추가한다. 어기면 요소가 조용히 무스타일로 렌더되고 콘솔 에러도 안 난다 — `test-frontend.js` Suite 4b가 이걸 잡는다.
- **방어적 필드 바인딩.** 데이터 스키마가 도메인마다 다르므로 `(item.images || [item.imageUrl])`, `(item.tags || [])`, `(item.reviewCount || 0).toLocaleString()` 식 fallback 체이닝을 쓴다. **특히 `.toLocaleString()`·`.map()`·`.join()`을 원시 필드에 바로 붙이지 말 것** — `map()` 콜백 안에서 throw하면 `innerHTML` 대입 자체가 안 일어나 그리드가 통째로 이전 상태에 멈추고, 카운트 텍스트만 갱신돼 표시가 어긋난다.
- **핸들러는 한 곳에서만 바인딩.** `initEvents()`에서 `addEventListener`로 걸었으면 모달 열 때 `.onclick`을 또 할당하지 않는다. 둘 다 걸리면 클릭 한 번에 두 번 실행된다.
- **환율은 `DEFAULT_EXCHANGE_RATE` 단일 출처.** `js/app.js`의 `currentBenchmarkRate`는 이 상수에서 파생되고, 헤더 계산기 모달도 같은 값을 실시간으로 읽는다. 별도 상수를 새로 만들지 말 것.
- **localStorage 키는 `nha_trang_*` 접두어.** 현재 10개: 5개 도메인 × (`_wishlist`, `_notes`). 읽기/쓰기는 항상 `loadFromStorage` / `saveToStorage` 경유.
- **사용자 입력·데이터 문자열은 `escapeHtml()`** 통과 후 innerHTML에 넣는다. 텍스트뿐 아니라 `src`·`href` **속성값에도** 적용한다.
- **DOM 접근은 null 가드.** 5개 탭 마크업이 한 문서에 공존하고 `display:none`으로 전환되므로 `document.getElementById(...)?.` 또는 `if (el)` 패턴을 유지한다.
- UI 문안은 한국어, 베트남 상호/주소는 성조 포함 원문 표기(`nameVi`, `addressVi`).

## 신규 탭 추가 시

`GEMINI.md` §3의 5단계 SOP를 따른다 (데이터 모듈 → `index.html` 마크업 5곳 → state/렌더러/이벤트 → CSS 점검 → `test-<domain>.js` 작성). 단 SOP가 말하는 "`js/components/<domain>.js` 신규 파일"은 이제 해당 없다 — `js/app.js` 안에 섹션을 추가한다. 가장 최근 참조 구현은 섹션 8(환전·ATM)이다.

체크리스트:
1. `<domain>-data.js`에 `module.exports` 이중 export를 넣었는가
2. `index.html` 스크립트 태그를 `js/app.js` **앞**에 넣었는가
3. 새 클래스를 `style.css`에 먼저 선언했는가
4. `getFiltered<Domain>()`을 `js/app.js` 하단 export 목록에 추가했는가
5. `test-<domain>.js`가 재구현본이 아니라 실제 함수를 `require()`해서 돌리는가

## 작업 완료 전 체크

1. 신규/수정 장소의 구글 평점·리뷰 수가 실제 지도와 일치하는가
2. `nameVi` / `addressVi`가 공식 표기와 정확한가
3. 구글 맵 링크가 해당 장소로 직결되는가
4. `index.html` ↔ `js/app.js` ↔ 데이터셋 개수가 100% 동기화되었는가
5. 동적 생성 HTML의 클래스명이 `style.css`와 일치하는가 (Suite 4b)
6. 카드 클릭·모달 오픈 시 콘솔 에러가 없는가 (HTTP 서버로 실제 확인)
7. `node test-*.js` 스위트가 통과하는가
8. **테스트를 일부러 깨뜨려 봤을 때 실제로 실패하는가** — 통과만 하는 테스트는 없느니만 못하다

## 관련 문서

- `GEMINI.md` — 프로젝트 규칙 원문 및 신규 탭 SOP 상세. 컴포넌트 파일 분리 전제는 현재와 다름
- `PROJECT.md` — 도메인 확장 작업의 마일스톤 기록. 파일 레이아웃 기술이 실제와 어긋날 수 있으니 코드를 우선할 것
- `TEST_INFRA.md`, `TEST_READY.md` — 숙소 탭 테스트 설계 및 커버리지 기록
