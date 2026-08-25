# CLAUDE.md — Nha Trang 로컬 가이드

나트랑 자유 여행용 큐레이션 웹앱. **빌드 도구·프레임워크·패키지 매니저 없음** (Vanilla HTML/CSS/JS, `package.json` 없음). Node.js는 오직 테스트 스크립트 실행용. Vercel 정적 호스팅으로 공개 배포한다.
**7개 도메인 탭.**
- **액티비티 32선**: `data.js` (`NHA_TRANG_ACTIVITIES`)
- **로컬 맛집 113선**: `gourmet-data.js` (`NHA_TRANG_GOURMETS`)
- **숙소 24선 (4개 테마)**: `stays-data.js` (`NHA_TRANG_STAYS`)
- **스파·마사지 24선**: `spa-data.js` (`NHA_TRANG_SPAS`, `NHA_TRANG_SPA_TIPS`)
- **짝퉁/패션 쇼핑 18선**: `shopping-data.js` (`NHA_TRANG_SHOPPING`)
- **환전 & ATM 17곳**: `currency-data.js` (`NHA_TRANG_CURRENCY`, `NHA_TRANG_TRAVEL_CARDS`, `NHA_TRANG_ATM_TIPS`)
- **여행 꿀팁 & 생존 킷**: `guide-data.js` (`NHA_TRANG_GUIDE_HUB`) — 리스트가 아니라 4개 섹션 허브 (교통·시세표·응급·플래시카드)

## 실행

전부 클래식 스크립트라 `file://`로 열어도 동작하지만, 개발 중에는 HTTP 서버로 확인할 것.

```bash
python3 -m http.server 8000
```

테스트는 서버 없이 Node로 바로 실행한다. HTML이나 JS를 수정했거나 데이터 개수를 바꿨으면 `node build.js`를 실행하여 파일 병합 및 `index.html` 카운트 재스탬프를 수행한다.

## 아키텍처

**eager/lazy 하이브리드 로딩** — 전부 클래식 스크립트이고 전역 `const`로 통신한다. import 하지 않는다.

1. `index.html`은 `data.js`(`NHA_TRANG_ACTIVITIES` + `DEFAULT_EXCHANGE_RATE` — 환율은 전 탭이 쓴다)와 `js/app.js` **둘만** 정적 로드한다. `data.js`가 `js/app.js`보다 뒤로 가면 앱 전체가 죽는다.
2. 나머지 데이터 6종은 `js/app.js` 섹션 8.7의 `LAZY_DATA` 매니페스트가 해당 탭 최초 진입 시 `<script>` 태그를 동적 삽입해 로드한다. fetch가 아니라 스크립트 태그라 `file://`에서도 동작한다. 로드 중에는 로딩 상태, 실패 시 "다시 불러오기" 버튼이 뜬다 (`showDataLoadError`).

**나머지 6종에 정적 태그를 다시 넣지 말 것** — lazy와 이중 로드된다. `test-frontend.js` Suite 2가 (정적 태그 부재 + `LAZY_DATA` 등록 + 파일 실존)을 6종 전부 검증한다. `js/app.js`의 lazy 데이터 참조는 전부 `typeof` 가드 뒤에 있으므로, 새 코드가 lazy 전역을 만질 때도 같은 가드를 유지해야 한다.

```
index.html         (자동 생성됨) 단일 진입점. src/html/ 의 8개 조각이 합쳐진 결과물
src/html/          index.html을 구성하는 8개의 HTML 조각 파일들
js/app.js          (자동 생성됨) 전체 앱 로직 단일 파일. src/js/ 의 15개 조각이 합쳐진 결과물
src/js/            js/app.js를 구성하는 15개의 JS 모듈 조각 파일들
build.js           src/ 내의 파일들을 순서대로 합쳐 최상위 index.html과 js/app.js를 생성하는 스크립트
robots.txt         크롤러 전면 차단
vercel.json        보안 + 색인 차단 헤더
style.css          Sea Glass 디자인 토큰 + 리스트 행/그리드 카드 (단일 파일)
data.js            NHA_TRANG_ACTIVITIES(32) + DEFAULT_EXCHANGE_RATE (환율 단일 출처)
gourmet-data.js    NHA_TRANG_GOURMETS(113)
stays-data.js      NHA_TRANG_STAYS(24)
spa-data.js        NHA_TRANG_SPAS(24) + NHA_TRANG_SPA_TIPS
shopping-data.js   NHA_TRANG_SHOPPING(18)
currency-data.js   NHA_TRANG_CURRENCY(17) + NHA_TRANG_TRAVEL_CARDS + NHA_TRANG_ATM_TIPS
guide-data.js      NHA_TRANG_GUIDE_HUB (transport / shoppingPriceMatrix / emergencyPharmacy / flashcards)
                   데이터 7종 전부 module.exports 있음 — 테스트에서 require() 가능
build-counts.js    index.html의 하드코딩 카운트를 데이터셋에서 파생시켜 재스탬프 (build.js가 호출)
test-*.js          Node 검증 스위트 (루트)
test-snapshots/    렌더 출력 골든 파일 (자동 생성, 직접 편집 금지)
scratch/, .agents/ 과거 에이전트 작업 산출물. 프로덕션 코드 아님 — 수정/참조 불필요
```

**`file://`로 열려면 클래식 스크립트여야 하므로 ES 모듈(`type="module"`)로 쪼개는 것은 금지**된다. 대신 `src/html/`과 `src/js/` 안에서 작업하고 `node build.js`로 단순히 문자열을 합쳐서 단일 파일로 만드는 방식을 사용한다. 루트의 `index.html`과 `js/app.js`를 직접 수정하지 말 것.

### 도메인 레지스트리 (`DOMAINS`, 섹션 8.6)

7개 도메인의 배선 차이가 이 테이블 하나에 모여 있다: 카테고리/태그 nav id와 `data-*` 속성명, state 필드명, 노트 스토리지 키, 모달 id, 히어로 문구, 섹션 id, 렌더 함수. 탭 전환·이벤트 바인딩·필터 초기화가 전부 이 테이블을 순회한다.

**`activities`만 접두어 규칙이 다르다** — `actCategory` / `wishlist` / `notes` / `cardsGridContainer` / `detailModal` / `modalNoteInput` / `renderCards`처럼 "activity" 접두어가 없다. 접두어로 유도하지 말고 테이블 값을 읽어라.

도메인 로직은 4개 축으로 분리돼 있다:
- `getFilteredX()` → `applyDomainFilter(cfg)` + 도메인별 `categoryMatch`/`tagMatch`/`searchMatch`/`compare`
- `renderX()` → `renderDomainGrid(cfg)` + 도메인별 `xCardTemplate(item)`(그리드) / `xRowTemplate(item, idx)`(리스트)
- `openXModal()` → `applyModalFields(item, X_MODAL_FIELDS)` + 도메인 고유 훅
- 배선 → `DOMAINS` 테이블

**정렬 comparator와 카테고리/태그 매처는 도메인마다 의도적으로 다르다.** 통일하면 판정이 깨진다: activities는 rating에 리뷰수 타이브레이크가 없고, currency만 배수가 100000이며, 가격 필드가 `priceVnd`/`avgPriceVnd`/`pricePerNightVnd`로 갈린다.

### 리스트 행 파이프라인 (섹션 3.55)

**리스트가 기본 뷰다.** 사진이 실제 장소가 아닌 스톡 이미지라 카드 면적의 절반 이상을 정보 없이 쓰고 있었고(카드 1개 490px, 1440px 첫 화면에 0개), 여섯 도메인이 하나의 84px 행 컴포넌트를 공유하도록 바꿨다(guide 탭은 리스트가 아니라 허브라 예외). 그리드는 사진을 볼 때를 위한 두 번째 뷰로 남는다.

- `itemRowHTML(v)` — 공용 행 마크업. 도메인마다 스키마가 달라 각 섹션의 `xRowTemplate`이 어댑터로 `v`를 만들어 넘긴다 (`id`, `rank`, `emoji`, `imgUrl`, `name`, `tags`, `rating`, `reviewCount`, `openState`, `metaParts`, `sigLabel`, `sigValue`, `subText`, `priceMain`, `priceKrw`, `priceUnit`, `isWish`, `note`, `mapUrl`). **필드를 늘리면 여섯 도메인 전부에 영향이 가고 스냅샷 81건이 잡는다.**
- `applyViewClass(container)` — 컨테이너를 `items-list`(+`is-comfy`) 또는 `cards-grid`로 바꾸고 리스트 여부를 반환
- `isOpenNow(openHours)` — `"15:00 - 21:00"`, `"18:00 - 22:30 (야간 영업)"`, `"24시간"`, 자정 넘김까지 파싱. **못 읽으면 `null`**이고 화면에 상태를 아예 띄우지 않는다
- `filterOpenNow(list)` — `renderDomainGrid`가 `getFiltered()` 결과에 적용한다. **파싱 실패 항목은 남긴다** (정보가 없다는 이유로 숨기면 사라진 이유를 알 수 없다). 칩은 `openHours`가 있는 맛집·스파·쇼핑·환전 탭에서만 보인다 (`DOMAINS[].hasOpenHours`)
- `parseSignature(raw)` — `"통오징어 반쎄오 (Bánh Xèo Mực Tôm - 45,000 VND)"`처럼 이름과 가격이 한 문자열인 대표 항목을 둘로 나눈다
- `buildMapUrl(item)` — `googleMapUrl`이 있으면 그대로, 없으면 정식 상호 + 주소로 검색 URL 생성

뷰 모드(`list`/`grid`)와 밀도(`tight`/`comfy`)는 리스트를 쓰는 여섯 탭 전체에 적용되고 localStorage에 남는다 (`setViewMode` / `setDensity` / `renderCurrentTab`).

이미지가 깨져도 빈 박스가 남지 않게 `.row-thumb-fallback` 이모지를 아래에 깔고 사진을 그 위에 올린다.

### Node 테스트용 export shim

`js/app.js` 맨 끝에서 `typeof module !== 'undefined'`일 때만 `getFilteredCurrency` 등 순수 함수를 `module.exports`로 내보낸다. 브라우저에서는 `module`이 없어 무해하고, 테스트는 이 덕분에 **로직을 재구현하지 않고 실제 함수를 실행**한다. 같은 이유로 부트스트랩(`init()` 호출)은 `typeof document !== 'undefined'` 가드 안에 있다.

새 도메인의 필터 함수를 만들면 이 export 목록에도 추가할 것. 안 하면 테스트가 또 재구현본을 검증하게 된다.

## 테스트

```bash
node test-activity.js && node test-gourmet.js && node test-stays.js && node test-seafood.js && \
node test-shopping.js && node test-currency.js && node test-spa.js && node test-guide.js && \
node test-challenger-2.js && node test-frontend.js && node test-render-snapshot.js
```

| 파일 | 대상 | 현재 상태 |
|---|---|---|
| `test-activity.js` | `data.js` 32개, 22필드 스키마, ID 유일성, **개인 일정 미노출** | PASS |
| `test-gourmet.js` | `gourmet-data.js` 113개, 26필드, 맵 URL 형식, XSS | 24/24 PASS |
| `test-stays.js` | `stays-data.js` 24개, 4테마 균등, Trip.com URL | 30/30 PASS |
| `test-spa.js` | `spa-data.js` 24개, 코스 가격표, 픽업 정보 | 21/21 PASS |
| `test-guide.js` | `guide-data.js` 4섹션 스키마, 플래시카드, **실제 필터 함수 구동** | 21/21 PASS |
| `test-seafood.js` | 해산물 카테고리 17곳 도메인 검증 | PASS |
| `test-shopping.js` | `shopping-data.js` 18개 | 25/25 PASS |
| `test-currency.js` | `currency-data.js` 17개, 스키마 균일성(+옵셔널 `bestTiming`), **실제 `getFilteredCurrency()` 구동** | PASS |
| `test-challenger-2.js` | 링크/보안 어드버세리얼, 결과 카운트 XSS 불변식 | 18/18 PASS |
| `test-frontend.js` | DOM ID, 스크립트 순서, CSS 클래스 불변식, 환전 탭 실제 필터, **카운트 동기화(Suite 10)·죽은 CSS(11)·디자인 토큰(12)** | 12 스위트 PASS |
| `test-render-snapshot.js` | **6개 도메인 리스트·그리드 렌더 HTML + 모달 채움 + 가이드 허브 골든 스냅샷** | 81/81 일치 |
| `test-harness.js` | (테스트 아님) 6개 스위트가 공유하는 `TestRunner`·`colors` | — |

### 렌더 스냅샷 (`test-render-snapshot.js`)

리팩토링 시 동작 보존을 증명하는 안전망이다. `test-dom-stub.js`의 최소 DOM 스텁으로 렌더러를 Node에서 실행해 생성 HTML을 `test-snapshots/`의 골든 파일과 바이트 단위로 비교한다.

- 54 케이스: 6도메인 × (기본/카테고리/태그/검색/평점정렬/가격오름/가격내림/찜만/빈결과) — 기본 뷰가 리스트라 전부 행 마크업
- 7 케이스: 6도메인 × 그리드 뷰 + 맛집 넉넉 밀도. 각 스냅샷 머리에 `<!-- container class: ... -->`를 박아 뷰/밀도 전환 자체를 고정한다 (innerHTML만으로는 컨테이너 클래스 변화를 못 잡는다)
- 12 케이스: 6도메인 × 모달 2개(첫/마지막 항목). 모달이 건드린 20~26개 엘리먼트의 `textContent`/`innerHTML`/`src`/`href`/`style`을 전부 덤프
- 8 케이스: 가이드 허브. 카테고리 5종(all/transport/shopping/emergency/flashcards) + 검색 + 플래시카드 모달 2개. guide 탭은 리스트가 아니라 `DOMAINS` 루프에 안 들어가서 `renderGuide()`의 450행 HTML이 오랫동안 무방비였다

"지금 영업중" 필터는 실행 시각에 따라 결과가 달라지므로 스냅샷으로 고정하지 않는다.

의도한 변경이면 `node test-render-snapshot.js --update` 후 **diff를 한 줄씩 확인하고** 커밋한다. DIFF가 났는데 원인을 모르겠으면 `--update`를 쓰지 말고 코드를 고쳐라.

주의: 스냅샷은 **렌더 출력만** 커버한다. 이벤트 바인딩·탭 전환·히어로 문구는 커버하지 않으므로 그 부분을 건드리면 HTTP 서버로 브라우저 확인이 필요하다.

데이터 파일 7종 전부 `module.exports`가 있어 테스트에서 `require()`로 읽는다. `test-activity.js`가 `data.js`를 `fs.readFileSync`로 한 번 더 읽는 곳은 **소스 텍스트를 정규식으로 검사**하는 개인 일정 노출 스위트용이다 — 데이터 로딩과 혼동하지 말 것.

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

`test-frontend.js` Suite 4b는 `js/app.js`가 템플릿 리터럴로 뱉는 모든 클래스(현재 95개)가 `style.css`에 선언돼 있는지 검사한다. `KNOWN_UNSTYLED` 예외 목록은 **현재 비어 있다** — 늘리지 말 것. 목록이 낡아도(이미 스타일이 생겼는데 남아 있어도) 실패한다.

## 절대 규칙: 개인 일정을 노출하지 않는다

공개 URL로 배포되므로 **실제 여행 날짜는 어디에도 넣지 않는다.** 날짜는 집을 비우는 기간을 그대로 알려주는 정보다. 데이터 파일도 정적으로 서빙되니 UI에서 숨기는 것으로는 부족하고, 데이터·주석·`<title>`·`meta`까지 전부 제거해야 한다.

금지: 절대 날짜(`M/D`, `YYYY년 M월 D일`, `YYYY.MM.DD` 형식 전부), 기간(`N박 N일`), 일자 지시(`Day 1`~`Day 7`). `NHA_TRANG_SCHEDULE` 배열과 `suggestedDay` 필드는 이 때문에 삭제됐다 — **되살리지 말 것.** 타임라인 뷰도 함께 걷어냈다.

허용: `9월 나트랑 날씨` 같은 계절 정보(월 단위는 특정성이 낮고 가이드로서 유용). 베트남 주소의 숫자(`39/17 Đoàn Trần Nghiệp`)는 날짜가 아니다.

`test-activity.js`의 `개인 여행 일정 데이터가 노출되지 않는다` 스위트가 `data.js`를 정규식으로 검사한다.

차단 설정: `robots.txt`(AI 크롤러 포함 전면 `Disallow`), `index.html`의 `noindex, nofollow, noarchive, nosnippet, noimageindex` + `referrer: no-referrer`, `vercel.json`의 `X-Robots-Tag`·`Referrer-Policy`·`Permissions-Policy`.

정적 사이트라 JS 비밀번호 게이트는 소스에 답이 보여 실질 보호가 안 된다. 진짜 접근 제어가 필요하면 Vercel Deployment Protection(Pro)이나 Cloudflare Access를 써야 한다.

## 절대 규칙: 실제 데이터만 (Zero Hallucination)

이 프로젝트의 최상위 원칙이다. 평점, 리뷰 개수, 영업시간, 가격, 주소, 전화번호를 **추측하거나 그럴듯하게 지어내지 않는다.** 모든 수치는 실제 최신 Google Maps 데이터와 1:1 일치해야 한다. 신규 장소를 추가하거나 기존 수치를 갱신할 때는 웹 검색·브라우저 도구·서브에이전트 조사로 실측값을 수집하고 교차 검증한다. 확인이 안 되면 항목을 추가하지 말고 사용자에게 알린다.

구글 지도 링크는 **베트남 공식 정식 상호명 + 도로명 주소 + 행정동(`phường`) + Nha Trang** 조합으로 만들어 클릭 시 목록이 아닌 해당 매장으로 직결되게 한다.

```
https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}
```

## 카운트 동기화

데이터셋 개수가 `index.html`과 `js/app.js`에 **하드코딩**되어 있다. 데이터를 추가/삭제하면:

1. `node build-counts.js` 실행 — `index.html`의 탭 뱃지, 카테고리 첫 버튼 `전체 … (N곳)`, 환전 탭 카테고리별 소계(실제 `getFilteredCurrency()`로 센다), 결과 카운트 초기값을 데이터셋에서 파생시켜 다시 찍는다. 멱등이라 언제 돌려도 안전하다.
2. 수동으로 고칠 것: `js/app.js` `DOMAINS` 테이블의 `heroPills` 문구 안 숫자 (산문에 박혀 있어 자동 치환하지 않는다), 테스트 파일의 기대 개수 상수
3. `index.html` 마크업 구조를 바꿨는데 build-counts가 "패턴 매치 실패"로 죽으면 스크립트의 정규식을 함께 갱신할 것 — 조용히 넘어가지 않고 실패하도록 설계돼 있다

현재값: 액티비티 32 / 맛집 113 / 숙소 24 / 스파 24 / 쇼핑 18 / 환전·ATM 17.

`test-frontend.js`의 카운트 동기화 스위트가 6개 도메인 전부에 대해 데이터셋 `length`에서 기대값을 파생시켜 탭 뱃지·카테고리 소계·`heroPills` 숫자를 대조한다. 하드코딩 리터럴을 새로 심으면 여기서 잡힌다.

## 디자인 시스템 — Sea Glass

`style.css` `:root`에 토큰이 모여 있다. **밝은 색은 "면"(칩·아이콘·필터 배경)에, 같은 계열의 진한 짝(`-ink`)은 "글자"에 쓴다.** 밝은 청록을 흰 바탕 글자에 그대로 쓰면 대비가 2.89:1까지 떨어져 야외에서 읽히지 않는다.

| 역할 | 면 | 글자 | 용도 |
|---|---|---|---|
| 라군 (primary) | `#12A8B0` | `#0B7F87` | 구조 — 탭·필터·링크·영업중. 흰 바탕 대비 4.78:1 |
| 코랄 선셋 (accent) | `#FF7A59` | `#C9451F` | **가격과 찜에만.** 흰 바탕 대비 4.83:1 |
| 씨위드 잉크 | — | `#1E4A4E` | 본문 |
| 시폼 바탕 | `#F0FAF8` | — | `--color-bg-main` |
| 평점 골드 | — | `#D99B2B` | 별점 전용 |

- 색 역할을 섞지 말 것. 탭마다 다른 색(구버전 `#EA580C`/`#2563EB`/`#059669`)을 쓰지 않는다
- 서체: 본문·UI는 `Be Vietnam Pro`(베트남어 성조 ầ ộ ữ 를 위해 설계됨), 로고·타이틀은 `Fraunces`. 숫자는 `font-variant-numeric: tabular-nums`
- 새 색이 필요하면 하드코딩하지 말고 `:root`에 토큰을 추가한다. 인라인 `style=` 속성은 쓰지 않는다 (현재 0개, Suite 12가 hex를 막는다)
- 모바일(≤900px)에서 상단 탭이 숨고 `.mobile-tabbar`가 유일한 전환 수단이다. 탭을 추가하면 양쪽 모두 갱신할 것

## 코드 컨벤션

- **프레임워크 금지.** React, Tailwind, 번들러 도입하지 않는다.
- **CSS 클래스 1:1 일치.** 템플릿 리터럴로 HTML을 만들 때 클래스명을 새로 지어내지 말고 `style.css`에 이미 선언된 것(`.card-media-wrapper`, `.card-img`, `.card-body` 등)만 쓴다. 신규 클래스가 필요하면 `style.css`에 **먼저** 추가한다. 어기면 요소가 조용히 무스타일로 렌더되고 콘솔 에러도 안 난다 — `test-frontend.js` Suite 4b가 이걸 잡는다.
- **방어적 필드 바인딩.** 데이터 스키마가 도메인마다 다르므로 `(item.images || [item.imageUrl])`, `(item.tags || [])`, `(item.reviewCount || 0).toLocaleString()` 식 fallback 체이닝을 쓴다. **특히 `.toLocaleString()`·`.map()`·`.join()`을 원시 필드에 바로 붙이지 말 것** — `map()` 콜백 안에서 throw하면 `innerHTML` 대입 자체가 안 일어나 그리드가 통째로 이전 상태에 멈추고, 카운트 텍스트만 갱신돼 표시가 어긋난다.
- **인라인 `style=` 금지.** 현재 `js/app.js`에 0개다. 새 스타일이 필요하면 `style.css`에 의미 기반 클래스를 만들어라 (`.mt-24` 같은 유틸리티 클래스 금지 — Tailwind를 쓰지 않는 이유와 같다).
- **색은 `:root` 토큰만.** hex 리터럴을 코드에 박으면 `test-frontend.js` Suite 12가 잡는다 (흑백 `#000000`/`#FFFFFF`만 예외). 의미색은 `warn`/`success`/`danger`/`info`/`violet`/`neutral` 6계열 × `-surface`/`-border`/`-mark`/`-ink`가 이미 있다.
- **핸들러는 한 곳에서만 바인딩.** `initEvents()`에서 `addEventListener`로 걸었으면 모달 열 때 `.onclick`을 또 할당하지 않는다. 둘 다 걸리면 클릭 한 번에 두 번 실행된다.
- **환율은 `DEFAULT_EXCHANGE_RATE` 단일 출처.** `js/app.js`의 `currentBenchmarkRate`는 이 상수에서 파생되고, 헤더 계산기 모달도 같은 값을 실시간으로 읽는다. 별도 상수를 새로 만들지 말 것.
- **localStorage 키는 `nha_trang_*` 접두어.** 현재 14개: 찜/노트를 쓰는 6개 도메인 × (`_wishlist`, `_notes`) + 뷰 설정 `nha_trang_view`·`nha_trang_density`. guide 탭은 찜·노트가 없다. 읽기/쓰기는 항상 `loadFromStorage` / `saveToStorage` 경유.
- **사용자 입력·데이터 문자열은 `escapeHtml()`** 통과 후 innerHTML에 넣는다. 텍스트뿐 아니라 `src`·`href` **속성값에도** 적용한다.
- **찜 상태 클래스는 `is-wishlisted`** (`.active`가 아니다 — 과거 JS가 `active`를 붙이는데 CSS는 `is-wishlisted`를 기다려 찜 표시가 안 되던 버그가 있었다).
- **DOM 접근은 null 가드.** 7개 탭 마크업이 한 문서에 공존하고 `display:none`으로 전환되므로 `document.getElementById(...)?.` 또는 `if (el)` 패턴을 유지한다.
- UI 문안은 한국어, 베트남 상호/주소는 성조 포함 원문 표기(`nameVi`, `addressVi`).

## 신규 탭 추가 시

`GEMINI.md` §3의 5단계 SOP를 따른다 (데이터 모듈 → `index.html` 마크업 5곳 → state/렌더러/이벤트 → CSS 점검 → `test-<domain>.js` 작성). 단 SOP가 말하는 "`js/components/<domain>.js` 신규 파일"은 이제 해당 없다 — `js/app.js` 안에 섹션을 추가한다. 가장 최근 참조 구현은 섹션 8(환전·ATM)이다.

체크리스트:
1. `<domain>-data.js`에 `module.exports` 이중 export를 넣었는가
2. `js/app.js` 섹션 8.7 `LAZY_DATA`에 `{src, containerId, ready}`를 등록했는가 (정적 script 태그를 넣으면 안 된다 — Suite 2가 잡는다)
3. 새 클래스를 `style.css`에 **먼저** 선언했는가 (Suite 4b가 잡는다)
4. `DOMAINS` 테이블에 항목을 추가했는가 — 이것만 하면 탭 전환·카테고리/태그 바인딩·검색·정렬·필터 초기화·모달 닫기·노트 저장이 전부 자동으로 붙는다
5. `render<Domain>()`의 cfg에 `cardTemplate`(그리드)과 `rowTemplate`(리스트) **둘 다** 넘겼는가 — `rowTemplate`이 없으면 리스트 뷰에서 그리드 카드가 그려진다
6. 모달은 `index.html`에 `<template class="modal-tpl" data-modal="..." data-close="...">`로 추가한다. overlay/box/close 버튼은 `buildModals()`가 만들어주므로 직접 쓰지 마라
7. `getFiltered<Domain>()`과 `render<Domain>()`을 `js/app.js` 하단 export 목록에 추가했는가
8. `test-render-snapshot.js`의 `DOMAINS`/`MODAL_OPENERS`에 새 도메인을 등록하고 골든을 기록했는가
9. `test-<domain>.js`가 재구현본이 아니라 실제 함수를 `require()`해서 돌리는가

## 작업 완료 전 체크

1. 신규/수정 장소의 구글 평점·리뷰 수가 실제 지도와 일치하는가
2. `nameVi` / `addressVi`가 공식 표기와 정확한가
3. 구글 맵 링크가 해당 장소로 직결되는가
4. **여행 날짜·`Day N`·기간이 코드·데이터·주석·메타에 새로 들어가지 않았는가**
5. `index.html` ↔ `js/app.js` ↔ 데이터셋 개수가 100% 동기화되었는가
6. 동적 생성 HTML의 클래스명이 `style.css`와 일치하는가 (Suite 4b)
7. 새 색을 하드코딩하지 않고 `:root` 토큰을 썼는가
8. 리스트/그리드 양쪽, 데스크톱/모바일(390px) 양쪽에서 깨지지 않는가
9. 카드 클릭·모달 오픈 시 콘솔 에러가 없는가 (HTTP 서버로 실제 확인)
10. `node test-*.js` 스위트가 통과하고, 렌더를 바꿨다면 스냅샷 diff를 한 줄씩 확인했는가
11. **테스트를 일부러 깨뜨려 봤을 때 실제로 실패하는가** — 통과만 하는 테스트는 없느니만 못하다

## 관련 문서

- `GEMINI.md` — 프로젝트 규칙 원문 및 신규 탭 SOP 상세. 컴포넌트 파일 분리 전제는 현재와 다름
- `PROJECT.md` — 도메인 확장 작업의 마일스톤 기록. 파일 레이아웃 기술이 실제와 어긋날 수 있으니 코드를 우선할 것
- `TEST_INFRA.md`, `TEST_READY.md` — 숙소 탭 테스트 설계 및 커버리지 기록
