# 리팩토링 검토 (2026-08-20)

작업 전 기준선: `node test-*.js` 11개 파일 전부 PASS, 렌더 스냅샷 **73/73 일치**. 아래 작업은 모두 이 기준선을 깨지 않는 것이 조건이다.

현재 규모: `js/app.js` 3,683행 / `style.css` 3,948행 / `index.html` 1,546행 / 도메인 **7개**(activities 32 · gourmet 113 · stays 24 · spa 24 · shopping 18 · currency 17 · guide 허브).

`DOMAINS` 레지스트리와 `applyDomainFilter` / `renderDomainGrid` / `applyModalFields` / `itemRowHTML` 4개 공통 파이프라인은 이미 잘 잡혀 있다. 남은 중복은 **그 파이프라인이 아직 흡수하지 못한 주변부**(찜 토글, 모달 열기/닫기, 갤러리)와 **guide 탭**에 몰려 있다.

---

## 0. 먼저 고칠 것 — 리팩토링이 아니라 결함

| # | 위치 | 문제 |
|---|---|---|
| A | `js/app.js:2795-2796` | 롯데마트 시세표가 환율을 `0.0545`로 **하드코딩**. `DEFAULT_EXCHANGE_RATE` 단일 출처 규칙 위반이고, `formatKRW()`의 100원 절사와도 결과가 어긋나 같은 화면 안에서 원화 표기가 두 방식으로 갈린다. → `formatKRW()` 호출로 교체 |
| B | `js/app.js:3298` | `viewToggleButtons`가 `isActivities`일 때만 표시된다. 뷰 모드는 7개 탭 전부에 적용되고(`setViewMode` → `renderCurrentTab`) 밀도 토글은 모든 탭에서 보이므로, **맛집·숙소·스파·쇼핑·환전 탭에서는 리스트↔그리드 전환 수단이 아예 없다.** 스냅샷은 `state`를 직접 바꿔 테스트하므로 이 결함을 못 잡는다 |
| C | `index.html:37,49,61` | `data-count-for="activity|spa|guide"` 속성이 `js/app.js`·테스트 어디에서도 읽히지 않는다. 카운트 자동 동기화를 붙이려던 반쪽 훅. → 완성(§4)하거나 제거 |
| D | `js/app.js:2103-2110` | `closeCurrencyModal`만 `modal.style.display = 'none'`을 추가로 만진다. 나머지 6개는 `.active` 클래스만 쓴다. 인라인 display가 클래스 기반 전환을 덮어써 향후 애니메이션/트랜지션을 막는다 |
| E | `js/app.js:2283,3654-3655` | `getFilteredSpa = getFilteredSpas` 별칭을 만들고 **둘 다** export한다. 어느 쪽이 정본인지 호출부에서 알 수 없다. → `getFilteredSpas` 하나로 통일 |

---

## 1. 도메인 주변부 중복 (가장 큰 효과, 위험 낮음)

`DOMAINS` 테이블이 이미 배선을 모으고 있는데, 아래 3종은 아직 도메인마다 손으로 복제돼 있다. **테이블에 필드 3개(`wishField` / `wishKey` / `wishLabel`)를 더하면 전부 테이블 순회로 접힌다.**

### 1-1. 찜 토글 6개 — 약 84행 → 20행

`toggleWishlist`(640) · `toggleGourmetWishlist`(920) · `toggleStayWishlist`(1166) · `toggleShoppingWishlist`(1458) · `toggleCurrencyWishlist`(1928) · `toggleSpaWishlist`(2395).

6개 본문이 **state 필드명 · localStorage 키 · 토스트 문구**만 다르고 나머지 14행이 동일하다. `state`에 이미 `wishlist`/`gourmetWishlist`/… 6개가 평평하게 있으니, `DOMAINS`에 `wishField`·`wishKey`·`wishLabel`을 추가하고

```js
function toggleDomainWishlist(key, id) { … }   // DOMAINS에서 필드를 읽어 처리
```

하나로 합친다. 기존 6개 이름은 `renderDomainGrid`의 `toggleWishlist` cfg와 export shim이 참조하므로 **얇은 래퍼로 남긴다** (호출 계약 불변).

### 1-2. 모달 닫기 7개 — 약 48행 → 12행

`closeActivityModal`(738) · `closeGourmetModal`(1006) · `closeStayModal`(1276) · `closeShoppingModal`(1640) · `closeCurrencyModal`(2103) · `closeSpaModal`(2530) · `closeFlashcardModal`(3091).

7개 모두 "id로 찾아 `.active` 제거 → `body.style.overflow` 복원 → `activeModalX = null`"이다. `DOMAINS`에 `modalId`·`activeModalField`가 **이미 있으므로** cfg 추가 없이 바로 접힌다. 결함 D도 여기서 함께 없앤다. `initEvents` 안의 지역 `closeModal`(3505)도 같은 함수로 흡수한다.

### 1-3. openXModal 공통 꼬리 6개 — 약 120행 → 25행

각 opener 마지막 ~20행이 동일하다: 노트 input 값 채우기 → 상태 텍스트 비우기 → 하트 버튼 문구/`onclick` → `.active` 추가 → `body.overflow='hidden'`.

- activity `672-736` / gourmet `954-1004` / stay `1198-1274` / shopping `1493-1638` / currency `1959-2101` / spa `2431-2528`

`finishModalOpen(domainKey, item)` 하나로 뽑는다. 하트 버튼 문구(`♥ 찜 취소` / `♡ 찜하기`)가 6곳에 리터럴로 흩어져 있는 것도 여기서 한 곳으로 모인다.

**주의:** 하트 버튼은 `.onclick` 직접 대입이다. 공통화할 때 `initEvents`의 `addEventListener`와 이중 바인딩되지 않도록 대입 방식을 유지할 것 (CLAUDE.md 「핸들러는 한 곳에서만 바인딩」).

### 1-4. 모달 갤러리 5개 — 약 90행 → 25행

stay(`1204-1216`) · shopping(`1499-1511`) · currency(`1965-1978`) · spa(`2437-2450`)이 "메인 이미지 + 썸네일 행 + 썸네일 클릭 시 스왑"을 그대로 복제한다. 차이는 **엘리먼트 id 2개와 이미지 필드명(`photos` / `images`)뿐**이다. activity(`675-694`)만 `sub-imgs-grid` 구조라 별개로 남긴다.

```js
function renderModalGallery({ mainImgId, thumbsId, images, alt })
```

### 1-5. 리스트 헬퍼 중복 2곳

`setList`(activity 내부 700행대)와 stay 내부의 동일 함수가 각각 지역 정의돼 있다. `✔` 불릿 `<li>` + 없을 때 대체 문구까지 같다. 모듈 레벨 `setBulletList(id, list, fallbackText)`로 올린다.

**1절 총합: `js/app.js`에서 약 340행 감소.** 렌더 출력이 바뀌지 않으므로 스냅샷 73건이 그대로 통과해야 한다 — **통과하지 않으면 되돌릴 신호**다.

---

## 2. guide 탭 — `renderGuide()` 453행 단일 함수

`js/app.js:2594-3046`. 한 함수가 4개 독립 섹션(교통·그랩 / 롯데마트 시세표 / 응급·약국 / 베트남어 플래시카드)의 HTML을 통째로 만든다. 다른 6개 도메인이 `renderDomainGrid` + `xRowTemplate`로 쪼개져 있는 것과 대조적이다.

1. **섹션 4개를 각각 함수로 분리** — `guideTransportHTML()` / `guideShoppingMatrixHTML()` / `guideEmergencyHTML()` / `guideFlashcardsHTML()`. `renderGuide`는 카테고리 필터에 따라 조립+바인딩만 담당(~40행).
2. **인라인 스타일·하드코딩 색상 제거** — `js/app.js` 전체의 인라인 `style="` **78개**, 하드코딩 hex **60개**의 대부분이 이 함수에 있다. `#D97706`·`#06B6D4`·`#166534`·`#9A3412`·`#6B21A8` 등은 Sea Glass 토큰 체계에 없는 색이다. 클래스를 `style.css`에 **먼저** 선언하고 옮긴다 (Suite 4b가 순서를 강제).
3. 결함 A(환율 하드코딩)를 이 단계에서 함께 처리.

**분리(1)와 스타일 이관(2)을 같은 커밋에 섞지 말 것.** 1은 출력 무변경(스냅샷으로 증명 가능), 2는 출력이 바뀌어 스냅샷 갱신이 필요하다. 섞으면 diff에서 의도한 변경과 사고를 구분할 수 없다.

---

## 3. 디자인 시스템 이탈

- `gourmetCardTemplate`(809-865): 다크 카드 헤더 전체가 인라인 스타일이고, 평점에 **`#EA580C`** 를 쓴다. CLAUDE.md가 "탭마다 다른 색을 쓰지 않는다"며 명시적으로 금지한 구버전 색이다. `#059669`(4곳)도 같은 부류.
- `style.css`: 미디어쿼리 밖에서 **진짜로 두 번 정의된 셀렉터는 2개** — `.btn-currency-photos`(2677, 2700), `.btn-spa-photos`(3230, 3251). 뒤 정의가 앞을 덮으므로 앞 블록은 죽은 코드다.
- **죽은 CSS 클래스 약 25개** (330개 선언 중). 대표: `card-badge-day`(삭제된 `Day N` 기능 잔재), `scam-warning-box`, `best-seller*`(3), `sentiment-list`, `sentiment-verdict-box`, `stay-card-actions`, `shopping-card-actions`, `stay-name-vi`, `shopping-name-vi`, `gourmet-emoji*`(2), `price-badge-asking`, `price-badge-target`, `row-muted`, `spa-facility-badge`, `btn-stay-map`, `btn-shopping-map`, `btn-shopping-photos`, `brand-badge`, `copied`, `dot-separator`, `sub-imgs`.
  - Suite 4b는 **JS→CSS 방향만** 검사한다(선언 없는 클래스 사용 탐지). 역방향(쓰이지 않는 선언)은 검사가 없어 계속 쌓인다.
  - 제거 전 확인: `card-badge-day`는 개인 일정 제거의 잔재이므로 **지우는 게 맞다**. `copied`·`sub-imgs`는 향후 사용 의도가 있을 수 있어 커밋 메시지에 근거를 남길 것.

---

## 4. 카운트 하드코딩 — 테스트 사각지대

개수 리터럴이 `index.html`(탭 뱃지 7 + 카테고리 소계 10 + 결과 카운트 7)과 `js/app.js`(`DOMAINS`의 `heroPills` 문구)에 흩어져 있다.

현재 `NHA_TRANG_X.length`에서 기대값을 **파생시켜 검증하는 테스트는 currency·gourmet·shopping뿐**이다. activities·stays·spa·guide는 검증이 없어 데이터가 바뀌면 조용히 어긋난다. (CLAUDE.md가 "액티비티 43"이라 적고 실제 데이터가 32인 것이 그 증거 — 문서 쪽 드리프트지만 같은 원인이다.)

두 방향 중 하나를 고른다:

- **(권장) 검증 강화** — `test-frontend.js`에 도메인 7개 × (탭 뱃지 / 카테고리 첫 버튼 / 결과 카운트 / heroPills 숫자)를 `length`에서 파생시켜 대조하는 스위트를 추가. 마크업은 손대지 않으므로 위험이 없고, 하드코딩 자체가 정보로서 유용하다(JS 없이도 숫자가 보인다).
- **(대안) 런타임 주입** — 결함 C의 `data-count-for` 훅을 완성해 `init()`에서 뱃지를 채운다. 단 JS 로드 전 첫 페인트에 숫자가 비어 레이아웃이 흔들린다.

두 번째를 택하더라도 `heroPills`와 카테고리 소계는 문장 안에 박혀 있어 첫 번째 방식이 여전히 필요하다.

---

## 5. 테스트 인프라 중복

- `class TestRunner`가 **7개 파일**에 각각 정의돼 있다 (activity·gourmet·stays·spa·shopping·currency·guide). 파일당 50~60행 × 7 ≈ **400행 중복**.
- `const colors = {…}` ANSI 색상 객체는 **9개 파일**에 중복.
- → `test-harness.js` 하나로 추출하고 `require('./test-harness.js')`. 스위트 내용은 건드리지 않는다.
- `test-activity.js:104-105`가 `data.js`를 `readFileSync` + `const`→`global.` 치환 + `eval`로 읽는다. **`data.js`에는 이미 `module.exports`가 있다**(1404-1408행) — 그냥 `require('./data.js')`로 바꿀 수 있다. CLAUDE.md의 "data.js는 module.exports가 없어서" 설명은 낡았다.
- `gourmet-data.js`·`stays-data.js`만 dual export의 `window.*` 절반이 빠져 있다. 클래식 스크립트에서 최상위 `const`는 식별자로는 보이지만 `window.X`로는 안 보이므로, 다른 5개와 표기를 맞춰두는 편이 안전하다.

---

## 6. `DOMAINS` / 섹션 구조 정리 (저비용)

- 섹션 주석 번호 **`8.4`가 두 번** 쓰였다 — spa(2204), guide(2537). guide를 `8.6`으로.
- `DOMAINS` 머리 주석이 "6개 도메인"이라 적혀 있으나 실제 7개(3101행).
- `switchMainTab`의 하드코딩 특수 케이스를 레지스트리 필드로 옮긴다:
  - `hasHours = tab === 'gourmet' || 'shopping' || 'currency' || 'spa'` (3332) → `DOMAINS[].hasOpenHours`
  - `isCurrency`로 가격 정렬 옵션 숨김 (3303-3313) → `DOMAINS[].hasPriceSort`
  - `isActivities`로 뷰 토글 표시 (3298) → 결함 B 해결과 함께 제거하거나 `DOMAINS[].showViewToggle`
  탭이 8개가 될 때 손댈 곳을 `DOMAINS` 한 곳으로 유지하는 것이 이 테이블의 존재 이유다.
- `initEvents`의 ESC 핸들러(3577)가 7개 모달 닫기를 무조건 전부 호출한다. 1-2 공통화 후 `state.currentTab`의 모달만 닫도록.

---

## 손대지 말 것 (의도된 중복)

CLAUDE.md에 명시돼 있고 실제로 통일하면 판정이 깨진다:

- **정렬 comparator 7개** — activities는 rating 타이브레이크가 없고, gourmet은 `rating*10000 + reviewCount`, currency만 배수 100000. 가격 필드도 `priceVnd`/`avgPriceVnd`/`pricePerNightVnd`로 갈린다.
- **카테고리/태그 매처** — `gourmetCategoryMatch`(746-763)의 한국어 키워드 분기는 데이터 태그 실측에 맞춰 손으로 튜닝된 결과다. 보기 흉하지만 정확하다.
- **`xRowTemplate` 어댑터 7개** — 스키마가 도메인마다 달라 `itemRowHTML`의 `v`를 만드는 변환은 도메인별로 남아야 한다.
- **`x_MODAL_FIELDS` 선언 7개** — 필드 구성이 실제로 다르다.

---

## 실행 순서

각 단계를 별도 커밋으로. **함수 이동(출력 불변)과 새 추상화 도입·스타일 이관(출력 변경)을 한 커밋에 섞지 않는다.**

| 단계 | 내용 | 스냅샷 | 규모 |
|---|---|---|---|
| 1 | 결함 A·D·E + 섹션 번호/주석 정정 (§0, §6 앞부분) | 불변 | 소 |
| 2 | 찜 토글 · 모달 닫기 공통화 (§1-1, §1-2) | 불변 | 중 |
| 3 | 모달 꼬리 · 갤러리 · 리스트 헬퍼 공통화 (§1-3~1-5) | 불변 | 중 |
| 4 | `test-harness.js` 추출 + `test-activity.js` eval 제거 (§5) | 불변 | 중 |
| 5 | 카운트 검증 스위트 추가 (§4) | 불변 | 소 |
| 6 | `renderGuide` 섹션 분리 (§2-1) | 불변 | 대 |
| 7 | guide 인라인 스타일 → `style.css` 토큰 이관 (§2-2) | **갱신 필요** | 대 |
| 8 | `gourmetCardTemplate` 인라인/`#EA580C` 정리 (§3) | **갱신 필요** | 중 |
| 9 | 죽은 CSS 25개 · 중복 룰 2개 제거 (§3) | 불변 | 소 |
| 10 | `switchMainTab` 특수 케이스 → `DOMAINS` 필드 + 결함 B (§6) | 불변 | 중 |

7·8단계는 스냅샷 diff를 **한 줄씩** 확인하고 커밋한다. 원인을 모르는 diff가 나오면 `--update`를 쓰지 말고 코드를 고친다.

10단계는 탭 전환 UI를 건드리므로 스냅샷이 커버하지 못한다 — `python3 -m http.server 8000`으로 7개 탭 × (리스트/그리드) × (데스크톱/390px)을 직접 확인하고 콘솔 에러가 없는지 볼 것.

예상 결과: `js/app.js` 3,683행 → 약 3,150행, 인라인 스타일 78→10 미만, 하드코딩 hex 60→0, 테스트 중복 약 450행 제거.

---

## 부수 작업: `CLAUDE.md` 갱신

코드보다 문서가 먼저 낡았다. 리팩토링과 별개로 지금 고칠 것:

- 도메인 **5개 → 7개** (spa, guide 누락). 데이터 파일 목록에 `spa-data.js`(`NHA_TRANG_SPAS` 24 + `NHA_TRANG_SPA_TIPS`), `guide-data.js`(`NHA_TRANG_GUIDE_HUB`) 추가
- 액티비티 **43 → 32**
- 테스트 실행 명령과 표에 `test-spa.js`·`test-guide.js` 추가, 스냅샷 **61 → 73**
- localStorage 키 "현재 12개" → 실제 14개 (spa 2개 추가)
- "`data.js`는 `module.exports`가 없어서 eval" → 지금은 있다 (§5)
- "뷰 모드는 다섯 탭 전체" → 일곱 탭 (그리고 결함 B가 해결될 때까지는 실제로는 activities 탭에서만 전환 가능하다는 사실을 적어둘 것)
