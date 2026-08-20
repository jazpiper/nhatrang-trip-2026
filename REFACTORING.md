# 리팩토링 기록 (2026-08-20)

브랜치 `refactor/domain-plumbing`. 기준선 커밋 `4df1507`(spa/guide 기능 봉인 시점) → 리팩토링 7커밋.

**최종 상태: 테스트 11개 파일 전부 PASS, 렌더 스냅샷 81/81 일치.** 기준선 시점 73건이었고 가이드 허브 8건을 새로 덮었다.

| 지표 | 전 | 후 |
|---|---|---|
| `js/app.js` | 3,683행 | 3,513행 |
| `style.css` | 3,948행 | 4,120행 (인라인 스타일이 여기로 옮겨온 결과) |
| 인라인 `style=` (js/app.js) | 75개 | **0개** |
| `:root` 밖 hex 리터럴 | 203개 (고유 81색) | **1개** (`#000000`, 사진 배경) |
| `:root` 토큰 | 39개 | 75개 |
| `renderGuide()` | 453행 단일 함수 | 60행 + 섹션 4함수 |
| 죽은 CSS 클래스 | 25개 | 0개 |
| 미디어쿼리 밖 중복 룰 | 4건 | 0건 |
| 테스트 보일러플레이트 중복 | 약 450행 | 0 (`test-harness.js` 146행) |
| `test-frontend.js` 스위트 | 9개 | 12개 |

---

## 커밋별 내역

### 1. `refactor: 도메인 주변부 중복을 DOMAINS 레지스트리 위로 흡수`

`DOMAINS` 테이블이 배선을 모으고 있는데도 찜 토글(6개)·모달 닫기(7개)·모달 열기 마무리(6개)·갤러리(4개)는 도메인마다 손으로 복제돼 있었다. 테이블에 `wishField`/`wishKey`/`wishToast*`/`modalHeartBtnId`/`hasOpenHours`/`hasPriceSort`/`showViewToggle`를 더해 섹션 3.8의 공통 함수 5개로 접었다. 기존 함수 이름은 얇은 래퍼로 남겨 `renderDomainGrid` cfg와 export shim의 호출 계약을 유지했다.

렌더 출력 73건 중 67건이 바이트 단위로 동일. 나머지 6건은 아래 의도한 변경이다.

함께 고친 결함 7건:

- **리스트/그리드 토글이 activities 탭에서만 보였다.** 뷰 모드는 여섯 탭 전부에 적용되고 밀도 토글은 모든 탭에 보이는데도 나머지 다섯 탭에는 전환 수단이 아예 없었다. 스냅샷은 `state`를 직접 조작해 테스트하므로 이 결함을 구조적으로 못 잡는다 — 브라우저로 확인했다.
- **모달 하트 버튼의 찜 상태 클래스가 어디에도 안 붙었다.** 스파만 `.active`를 붙이고 나머지 다섯은 아무것도 안 붙여, 여섯 모달 전부 CSS가 기다리는 `.is-wishlisted`를 받지 못했다.
- 숙소·쇼핑 갤러리가 썸네일 `src`에 `escapeHtml`을 적용하지 않았다 (환전·스파는 하고 있었다).
- 환전 모달만 `.active` 클래스 외에 인라인 `display`를 토글했다. `.modal-overlay.active {display:flex}`가 이미 담당한다.
- 롯데마트 시세표가 환율 `0.0545`를 하드코딩해 `DEFAULT_EXCHANGE_RATE` 단일 출처를 우회하고, `formatKRW`의 100원 절사와도 표기가 어긋났다.
- `getFilteredSpa`/`getFilteredSpas` 별칭을 둘 다 export해 정본이 불분명했다.
- 섹션 주석 번호 `8.4`가 스파와 가이드에 중복.

`CLAUDE.md`가 도메인 5개·액티비티 43개·스냅샷 61건으로 낡아 있어 실제 7개·32개·73건에 맞췄다.

### 2. `refactor: renderGuide 453행을 섹션 4개 함수로 분리`

`guideTransportHTML` / `guideSouvenirMatrixHTML` / `guideEmergencyHTML` / `guideFlashcardsHTML`. `renderGuide`는 카테고리 필터에 따라 조립하고 플래시카드 이벤트를 바인딩하는 60행만 남았다.

당시 가이드 탭은 스냅샷 대상이 아니어서 분리 전/후 `js/app.js`로 5개 카테고리의 컨테이너 `innerHTML`을 뽑아 249,574바이트가 바이트 단위로 동일함을 직접 확인했다. (이 공백은 커밋 7에서 스냅샷으로 메웠다.)

### 3. `test: TestRunner 중복 제거 + 카운트 동기화·죽은 CSS 검사 추가`

`TestRunner`가 7개 파일에, ANSI `colors`가 9개 파일에 복제돼 있었다 (약 450행). `test-harness.js`로 추출하고 요약 문구·`process.exit` 여부만 옵션으로 받는다. 6개 파일은 수정 전/후 콘솔 출력이 타이머 값을 빼면 바이트 단위로 동일하다.

`test-guide.js`의 `TestRunner`는 합치지 않았다 — 에러를 `{suite, description, error}`로 모으고 요약 블록 모양도 달라 문구 차이가 아니라 집계 방식 차이다.

`test-activity.js`의 `data.js` 로딩을 `eval`에서 `require()`로 바꿨다. 이때 `typeof global.NHA_TRANG_SCHEDULE === 'undefined'` 단언이 무력해진다 — `eval`이 최상위 `const`를 `global`에 흘리던 것에 의존했기 때문이다. 소스 텍스트 정규식으로 교체하고, `data.js`에 `NHA_TRANG_SCHEDULE`을 되살려 실제로 FAIL하는지 확인했다.

- **Suite 10 (카운트 동기화, 16건)** — 6개 도메인의 탭 뱃지·카테고리 소계·`heroPills` 숫자를 데이터셋 `length`에서 파생시켜 대조. 기존에는 환전·맛집·쇼핑만 검증돼 액티비티·숙소·스파는 조용히 어긋날 수 있었다.
- **Suite 11 (죽은 CSS)** — Suite 4b의 역방향. 선언만 있고 아무도 쓰지 않는 클래스를 잡는다. 이 검사가 없던 동안 25개가 쌓였다.

Suite 4의 하드코딩 selector 목록에서 실제로 죽은 5개를 제거했다. 이 목록은 "문자열이 `style.css`에 있는가"만 보므로 실사용과 분리돼 낡는다 — 진짜 불변식은 4b와 11이 담당한다는 주석을 달았다.

두 스위트 모두 일부러 깨뜨려 FAIL하는지 확인했다.

### 4. `refactor: 죽은 CSS 25개 제거, 중복 정의 룰 4건 병합`

약 300행. `.card-badge-day`는 삭제된 `Day N` 일정 기능의 잔재, `.sentiment-list`는 렌더되지 않는 부모 클래스의 자손 룰 전체다. 접두어 함정(`.sub-imgs` vs 살아 있는 `.sub-imgs-grid`)은 개별 확인 후 처리했다.

`.btn-currency-photos`/`.btn-spa-photos`는 레이아웃 속성을 담은 공통 그룹과 색만 담은 단독 블록으로 갈려 있었고, 그 둘을 합치자 그룹에 남은 `.btn-currency-map`/`.btn-spa-map`이 같은 형태로 중복돼 그것까지 병합했다. 속성 합집합은 그대로다.

### 5. `refactor: 하드코딩 색상 203개를 의미색 토큰으로 통일`

Tailwind 기본 팔레트에서 그때그때 집어온 색 81종이 흩어져 있어 같은 의미의 박스가 탭마다 다른 색을 쓰고 있었다. 의미 6계열(`warn`/`success`/`danger`/`info`/`violet`/`neutral`)을 `:root`에 추가했다. Sea Glass 본체와 같은 규율 — `-surface`/`-border`는 면, `-mark`는 아이콘·강조, `-ink`는 글자.

토큰 값은 현재 값을 그대로 옮겼다. 다만 한 계열 안에서 한두 단계 차이인 색은 한 토큰으로 합쳤다 (`#EF4444`→`danger-mark`, `#F59E0B`/`#EA580C`→`warn-mark`, `#16A34A`/`#10B981`→`success-mark` 등). 합치지 않으면 토큰이 81개가 되어 단일 출처의 의미가 없다.

함께 고친 결함 2건:

- **`--color-sea`가 9곳, `--shadow-card`가 1곳에서 정의 없이 `var()`로 참조되고 있었다.** 무효값이라 색이 조용히 상속되고 콘솔 에러도 안 난다.
- 맛집·숙소·쇼핑 카드가 `.card-rating` 전체를 탭 색(`#EA580C`/`#2563EB`/`#FF385C`)으로 덮어쓰고 있었다. 디자인 시스템이 금지한 구버전 탭별 색이고, 평점은 별에 `--color-star`를 쓰는 게 규칙이다. 인라인 덮어쓰기 3곳을 제거해 액티비티 카드와 통일했다 (스냅샷 155건).

**Suite 12 추가** — 정의 없는 `var()` 참조와 `:root` 밖 hex 리터럴을 막는다. 흑백만 원색으로 허용.

스냅샷 diff 614쌍을 전수 분류했다: hex→토큰 459건, 평점 인라인 색 제거 155건, 그 외 0건.

### 6. `refactor: 인라인 style 75개를 CSS 클래스로 이관 (잔여 0)`

의미 기반 클래스 63개로 옮겼다. 반복 선언은 하나로 합쳤다 — `.card-review-count`(카드 3곳), `.guide-header-flex-row`(헤더 2곳), `.souv-price-krw`, `.customs-info-card`(3변형의 공통 베이스). 도메인별 덮어쓰기는 새 클래스가 아니라 기존 `.stay-card .card-media-wrapper` 패턴을 따라 중첩 선택자로 넣었다.

색은 전부 기존 `var(--토큰)`을 재사용했다 (새 hex 0개).

검증: 스냅샷 6개 파일의 태그 구조와 텍스트가 속성을 제외하면 완전히 동일. 맛집 그리드 HTML 278KB → 216KB (-22%). 가이드 허브는 이관 전/후 `renderGuide()` 출력을 5개 카테고리에 대해 직접 비교 — `style` 속성 436개가 0개가 되고 태그를 벗긴 텍스트는 전량 일치. 브라우저에서 새 클래스가 실제 계산값을 받는지 확인했다 (선언만 있고 적용되지 않으면 `initial`로 남아 조용히 무스타일이 된다).

### 7. `test: 가이드 허브 렌더 스냅샷 8건 추가 (73 → 81)`

가이드 탭은 리스트가 아니라 `DOMAINS` 루프에 안 들어가서 `renderGuide()`의 450행 HTML이 무방비였고, 커밋 2와 6에서 매번 임시 스크립트로 확인해야 했다. 카테고리 5종 + 검색 + 플래시카드 모달 2개를 골든으로 고정했다.

이빨 확인: 플래시카드 섹션 조립을 `if (false)`로 막았더니 `guide.all`(DIFF) / `guide.flashcards`(EMPTY) / `guide.search`(DIFF) 3건이 실패하고 무관한 transport·shopping·emergency는 통과했다.

`test-render-snapshot.js`가 `data.js`를 `eval`로 읽던 우회도 걷어냈다.

---

## 브라우저 확인

`python3 -m http.server`로 7개 탭 전부:

- 렌더 개수 32/113/24/24/18/17 + 가이드 4섹션(플래시카드 21, 시세표 34행), 콘솔 에러 0
- 리스트/그리드 토글이 여섯 리스트 탭 전부에서 노출 (결함 해소 확인), 가이드 탭에서만 숨김
- `var()` 74개 전부 해소, DOM의 `[style]` 속성 잔여 0개
- 환전 탭에서 가격 정렬 옵션 숨김, "지금 영업중" 칩은 맛집·스파·쇼핑·환전에서만 노출
- 롯데마트 원화가 `formatKRW` 경유 "약 13,600원" (100원 절사)

`≤900px` 모바일 브레이크포인트는 확장 프로그램의 리사이즈가 뷰포트에 적용되지 않아 브라우저 측정이 무효였다. `style.css`의 `.header-nav-tabs { display: none }` + `.mobile-tabbar { display: flex }` 블록이 온전한 것은 정적으로 확인했고, 레이아웃 속성은 이관 과정에서 값을 그대로 옮겼다. **실기기/디바이스 모드에서 한 번 눈으로 볼 것.**

---

## 손대지 않은 것 (의도된 중복)

`CLAUDE.md`에 명시돼 있고 실제로 통일하면 판정이 깨진다:

- **정렬 comparator 7개** — activities는 rating 타이브레이크가 없고, gourmet은 `rating*10000 + reviewCount`, currency만 배수 100000. 가격 필드도 `priceVnd`/`avgPriceVnd`/`pricePerNightVnd`로 갈린다.
- **카테고리/태그 매처** — `gourmetCategoryMatch`의 한국어 키워드 분기는 데이터 태그 실측에 맞춰 손으로 튜닝된 결과다. 보기 흉하지만 정확하다.
- **`xRowTemplate` 어댑터 7개**, **`x_MODAL_FIELDS` 선언 7개** — 스키마가 실제로 다르다.

## 남은 것

1. **맛집 그리드 카드의 배지가 하트 버튼에 살짝 가려진다.** 인라인 스타일로 짜여 있던 카드의 기존 레이아웃 문제다. 이관 작업과 섞으면 검증이 흐려지므로 손대지 않았다 — 이제 `.gourmet-card .card-media-wrapper` 클래스가 생겼으니 고치기 쉽다.
2. **가이드 시세표의 "550,000동 / 약 30,000원" 열이 좁아 줄바꿈이 어색하다.** 역시 기존 문제.
3. **`openShoppingModal`(147행) / `openCurrencyModal`(144행)이 여전히 길다.** 흥정표·ATM 단계·감정 분석 패널처럼 도메인 고유 블록이라 공통화 대상이 아니지만, 섹션 함수로 갈라 볼 여지는 있다 (커밋 2와 같은 방식).
4. **`GEMINI.md` / `PROJECT.md`가 낡았다.** `CLAUDE.md`는 이번에 맞췄지만 나머지 두 문서는 컴포넌트 파일 분리를 전제하고 있다. `CLAUDE.md`가 이미 "무시하라"고 적고 있으니 급하지는 않다.
