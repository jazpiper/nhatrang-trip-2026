const fs = require('fs');

console.log('=== Suite 1: DOM Elements and IDs in index.html ===');
const html = fs.readFileSync('index.html', 'utf8');

const requiredIds = [
  'stayCategoryNav',
  'stayTagChips',
  'staysGridSection',
  'stayResultCountText',
  'staysCardsGridContainer',
  'stayModal',
  'stayModalCloseBtn',
  'stayModalGallery',
  'stayModalMainImg',
  'stayModalThumbs',
  'stayModalBadge',
  'stayModalCategory',
  'stayModalThemeBadge',
  'stayModalTitle',
  'stayModalNameVi',
  'stayModalRating',
  'stayModalPriceRange',
  'stayModalCheckInOut',
  'stayModalLocation',
  'stayModalAddress',
  'stayCopyAddressBtn',
  'stayModalHighlight',
  'stayModalAmenitiesList',
  'stayModalHighlightsList',
  'stayModalNearbyList',
  'stayModalTip',
  'stayNoteInput',
  'stayNoteStatus',
  'stayModalAvgPrice',
  'stayModalAvgKrw',
  'stayModalPricePer',
  'stayModalHeartBtn',
  'stayModalMapBtn',
  'stayModalTripBtn',
  // Hotel Dining Domain IDs
  'hoteldiningCategoryNav',
  'hoteldiningTagChips',
  'hoteldiningGridSection',
  'hoteldiningResultCountText',
  'hoteldiningCardsGridContainer',
  'hoteldiningModal',
  'hoteldiningModalCloseBtn',
  'hoteldiningModalGallery',
  'hoteldiningModalMainImg',
  'hoteldiningModalThumbs',
  'hoteldiningModalBadge',
  'hoteldiningModalCategory',
  'hoteldiningModalTitle',
  'hoteldiningModalHotelName',
  'hoteldiningModalNameVi',
  'hoteldiningModalRating',
  'hoteldiningModalPriceRange',
  'hoteldiningModalOpenHours',
  'hoteldiningModalLocation',
  'hoteldiningModalAddress',
  'hoteldiningCopyAddressBtn',
  'hoteldiningModalHighlight',
  'hoteldiningModalSignatureList',
  'hoteldiningModalDressCode',
  'hoteldiningModalReservation',
  'hoteldiningModalPhone',
  'hoteldiningModalDesc',
  'hoteldiningModalTip',
  'hoteldiningNoteInput',
  'hoteldiningNoteStatus',
  'hoteldiningModalPriceVnd',
  'hoteldiningModalPriceKrw',
  'hoteldiningModalPricePer',
  'hoteldiningModalHeartBtn',
  'hoteldiningModalMapLink',
  'hoteldiningModalPhotosLink',
  'hoteldiningModalOfficialLink',
  // Shopping Domain IDs
  'shoppingCategoryNav',
  'shoppingTagChips',
  'shoppingGridSection',
  'shoppingResultCountText',
  'shoppingCardsGridContainer',
  'shoppingModal',
  'shoppingModalCloseBtn',
  'shoppingModalGallery',
  'shoppingModalMainImg',
  'shoppingModalThumbs',
  'shoppingModalBadge',
  'shoppingModalCategory',
  'shoppingModalQualityBadge',
  'shoppingModalAcBadge',
  'shoppingModalTitle',
  'shoppingModalNameVi',
  'shoppingModalRating',
  'shoppingModalHours',
  'shoppingModalPriceRange',
  'shoppingModalLocation',
  'shoppingModalAddress',
  'shoppingCopyAddressBtn',
  'shoppingModalHighlight',
  'shoppingModalFacilities',
  'shoppingModalBargainingTable',
  'shoppingModalSentimentPanel',
  'shoppingModalCustomsGuide',
  'shoppingCustomsWarningText',
  'shoppingModalDesc',
  'shoppingModalTip',
  'shoppingNoteInput',
  'shoppingNoteStatus',
  'shoppingModalAvgPrice',
  'shoppingModalAvgKrw',
  'shoppingModalPricePer',
  'shoppingModalHeartBtn',
  'shoppingModalPhotosBtn',
  'shoppingModalMapBtn',
  // Currency & ATM tab
  'currencyCategoryNav',
  'currencyTagChips',
  'currencyGridSection',
  'currencyResultCountText',
  'currencyCardsGridContainer',
  'currencyModal',
  'currencyModalCloseBtn',
  'currencyModalMainImg',
  'currencyModalThumbs',
  'currencyModalBadge',
  'currencyModalCategory',
  'currencyModalFeeBadge',
  'currencyModalTitle',
  'currencyModalNameVi',
  'currencyModalRating',
  'currencyModalHours',
  'currencyModalFeePolicy',
  'currencyModalLocation',
  'currencyModalAddress',
  'currencyCopyAddressBtn',
  'currencyModalHighlightText',
  'currencyModalCardsList',
  'currencyModalAtmSteps',
  'currencyModalDccGuide',
  'currencyModalRatesBox',
  'currencyModalLimitsBox',
  'currencyModalFacilities',
  'currencyModalDesc',
  'currencyModalTip',
  'currencyNoteInput',
  'currencyNoteStatus',
  'currencyModalHeartBtn',
  'currencyModalPhotosBtn',
  'currencyModalMapBtn',
  // Spa Domain IDs
  'spaCategoryNav',
  'spaTagChips',
  'spaGridSection',
  'spaResultCountText',
  'spaCardsGridContainer',
  'spaModal',
  'spaModalCloseBtn',
  'spaModalGallery',
  'spaModalMainImg',
  'spaModalThumbs',
  'spaModalBadge',
  'spaModalCategory',
  'spaModalTipBadge',
  'spaModalPickupBadge',
  'spaModalTitle',
  'spaModalNameVi',
  'spaModalRating',
  'spaModalHours',
  'spaModalPriceRange',
  'spaModalLocation',
  'spaModalAddress',
  'spaCopyAddressBtn',
  'spaModalPickup',
  'spaModalTipPolicy',
  'spaModalLuggage',
  'spaModalCourseTable',
  'spaModalCourseTableBody',
  'spaModalAmenities',
  'spaModalDesc',
  'spaModalTip',
  'spaNoteInput',
  'spaNoteStatus',
  'spaModalAvgPrice',
  'spaModalAvgKrw',
  'spaModalPricePer',
  'spaModalHeartBtn',
  'spaModalPhotosBtn',
  'spaModalMapBtn',
  // Currency calculator widget
  'calcVndInputMain',
  'calcKrwInputMain',
  'calcVndHelperMain',
  'calcKrwHelperMain',
  'calcResetBtnMain',
  // Guide Hub Domain IDs
  'guideCategoryNav',
  'guideTagChips',
  'guideGridSection',
  'guideResultCountText',
  'guideCardsGridContainer',
  'flashcardModal',
  'flashcardModalCloseBtn',
  'flashcardModalIcon',
  'flashcardModalCategory',
  'flashcardModalKo',
  'flashcardModalVi',
  'flashcardModalPron',
  'flashcardModalPurpose',
  'flashcardCopyBtn',
  'flashcardModalCloseBtn2'
];

let missing = 0;
for (const id of requiredIds) {
  const hasId = html.includes(`id="${id}"`) ||
                html.includes(`data-modal="${id}"`) ||
                html.includes(`data-close="${id}"`);
  if (!hasId) {
    console.error(`  ❌ MISSING ID in index.html: ${id}`);
    missing++;
  } else {
    console.log(`  ✔ Found ID: ${id}`);
  }
}

if (missing > 0) {
  console.error(`Total missing IDs: ${missing}`);
  process.exit(1);
}

console.log('\n=== Suite 2: Script Loading Structure (eager data.js + lazy 6종) ===');
// 로딩 구조가 2계층에서 eager/lazy 하이브리드로 바뀌었다 (js/app.js 섹션 8.7).
// - data.js(액티비티 + DEFAULT_EXCHANGE_RATE)만 index.html에서 정적 로드하고,
//   반드시 js/app.js보다 앞에 있어야 한다.
// - 나머지 6종은 정적 태그가 있으면 안 된다(있으면 이중 로드 + 초기 전송량 회귀).
//   대신 js/app.js의 LAZY_DATA 매니페스트에 등록돼 있고 파일이 실존해야 한다.
const hasAppScript = html.includes('<script src="./js/app.js"></script>');
const appIdx = html.indexOf('src="./js/app.js"');

if (!hasAppScript) {
  console.error('  ❌ js/app.js script tag missing');
  process.exit(1);
}

let orderOk = true;

// 2a. data.js는 정적 로드 + app.js보다 앞
const dataTagIdx = html.indexOf('<script src="./data.js"></script>');
if (dataTagIdx === -1) {
  console.error('  ❌ data.js 정적 script 태그가 없음 — 액티비티 탭과 환율 전체가 죽는다');
  orderOk = false;
} else if (dataTagIdx > appIdx) {
  console.error('  ❌ data.js가 js/app.js보다 뒤에 로드됨 — 전역이 undefined가 된다');
  orderOk = false;
} else {
  console.log('  ✔ data.js가 js/app.js보다 먼저 정적 로드됨');
}

// 2b. lazy 6종: 정적 태그 부재 + LAZY_DATA 등록 + 파일 실존
const lazyFiles = [
  'gourmet-data.js',
  'stays-data.js',
  'spa-data.js',
  'shopping-data.js',
  'currency-data.js',
  'guide-data.js'
];
const appSrcForLazy = fs.readFileSync('js/app.js', 'utf8');
const lazyBlockMatch = appSrcForLazy.match(/const LAZY_DATA = \{[\s\S]*?\n  \};/);
if (!lazyBlockMatch) {
  console.error('  ❌ js/app.js에서 LAZY_DATA 매니페스트를 찾지 못함');
  orderOk = false;
}
for (const f of lazyFiles) {
  if (html.includes(`<script src="./${f}"`)) {
    console.error(`  ❌ ${f}에 정적 script 태그가 있음 — lazy 로딩과 이중 로드된다`);
    orderOk = false;
    continue;
  }
  if (lazyBlockMatch && !lazyBlockMatch[0].includes(`'./${f}'`)) {
    console.error(`  ❌ ${f}가 LAZY_DATA 매니페스트에 없음 — 해당 탭이 영원히 로딩 상태에 머문다`);
    orderOk = false;
    continue;
  }
  if (!fs.existsSync(f)) {
    console.error(`  ❌ ${f} 파일이 존재하지 않음`);
    orderOk = false;
    continue;
  }
  console.log(`  ✔ ${f}: 정적 태그 없음 + LAZY_DATA 등록 + 파일 실존`);
}
if (!orderOk) process.exit(1);

console.log('\n=== Suite 3: JavaScript Syntax & Compilation in app.js ===');
const appCode = fs.readFileSync('js/app.js', 'utf8');
try {
  new Function(appCode);
  console.log('  ✔ js/app.js syntax & logic compilation valid!');
} catch (e) {
  console.error('  ❌ js/app.js syntax error:', e.message);
  process.exit(1);
}

console.log('\n=== Suite 4: CSS Selectors in style.css ===');
const css = fs.readFileSync('style.css', 'utf8');
// 이 목록은 "선택자 문자열이 style.css에 존재하는가"만 보므로 실제 사용과 분리돼
// 낡는다. 실제 불변식(js/app.js가 뱉는 클래스 == style.css 선언)은 Suite 4b가,
// 역방향(선언만 있고 아무도 안 쓰는 죽은 CSS)은 Suite 11이 검사한다.
const requiredSelectors = [
  '.stay-card',
  '.stay-badge-theme',
  '.stay-badge-cat',
  '.btn-trip-dot-com',
  '.stay-gallery-container',
  '.gallery-main-img-wrap',
  '.gallery-thumbs-row',
  '.gallery-thumb',
  '.modal-address-box',
  '.btn-copy-address',
  // Shopping Selectors
  '.shopping-card',
  '.shopping-badge-tier',
  '.shopping-badge-ac',
  '.bargain-table-wrap',
  '.bargain-table',
  '.price-asking',
  '.price-target',
  '.pros-cons-grid',
  '.pros-box',
  '.cons-box',
  '.customs-warning-box',
  // Currency & ATM Selectors
  '.currency-card',
  '.currency-badge-fee',
  '.supported-card-pill',
  '.supported-card-pills-row',
  '.currency-card-actions',
  '.btn-currency-map',
  '.btn-currency-photos',
  '.card-fee-info',
  '.supported-cards-grid',
  '.badge-fee-zero',
  // Spa Selectors
  '.spa-card',
  '.spa-badge-service',
  '.spa-terms-grid',
  '.spa-term-card',
  '.spa-course-table-wrap',
  '.spa-course-table',
  '.spa-amenity-pills',
  '.spa-amenity-pill',
  '.btn-spa-map',
  '.btn-spa-photos',
  // Guide Hub Selectors
  '.guide-hub-container',
  '.guide-section-block',
  '.guide-section-title',
  '.airport-table',
  '.taxi-compare-card',
  '.scam-card',
  '.souvenirs-table',
  '.med-card',
  '.hospital-card',
  '.flashcard-card',
  '.flashcard-big-vi'
];

for (const sel of requiredSelectors) {
  if (css.includes(sel)) {
    console.log(`  ✔ Found CSS Selector: ${sel}`);
  } else {
    console.error(`  ❌ Missing CSS Selector: ${sel}`);
    process.exit(1);
  }
}

console.log('\n=== Suite 4b: CSS Class Invariant (renderer output vs style.css) ===');
// The project rule is that template-literal markup may only use classes that already
// exist in style.css. Violations are invisible at runtime — the element just renders
// unstyled — so no other suite catches them.
const appSrcForClasses = fs.readFileSync('js/app.js', 'utf8');
const usedClasses = new Set();
for (const m of appSrcForClasses.matchAll(/class="([^"`]*)"/g)) {
  m[1].split(/\s+/).forEach(c => {
    if (c && !c.includes('${') && /^[a-z][a-z0-9-]*$/.test(c)) usedClasses.add(c);
  });
}

// Debt ledger for classes the renderers emit without a style.css rule. It is
// currently EMPTY — all classes are verified to exist in style.css.
const KNOWN_UNSTYLED = new Set([]);

const undefinedClasses = [...usedClasses]
  .filter(c => !css.includes('.' + c) && !html.includes(`class="${c}`))
  .sort();

const newViolations = undefinedClasses.filter(c => !KNOWN_UNSTYLED.has(c));
const stillOutstanding = undefinedClasses.filter(c => KNOWN_UNSTYLED.has(c));

if (stillOutstanding.length > 0) {
  console.log(`  ⚠ ${stillOutstanding.length} known-unstyled classes (pre-existing debt): ${stillOutstanding.join(', ')}`);
}

if (newViolations.length > 0) {
  console.error(`  ❌ ${newViolations.length} class(es) emitted by js/app.js are not declared in style.css:`);
  newViolations.forEach(c => console.error(`     .${c}`));
  console.error('     Add them to style.css, or reuse an existing class.');
  process.exit(1);
}
console.log(`  ✔ All ${usedClasses.size - stillOutstanding.length} renderer classes are declared in style.css`);

const staleAllowlist = [...KNOWN_UNSTYLED].filter(c => css.includes('.' + c));
if (staleAllowlist.length > 0) {
  console.error(`  ❌ KNOWN_UNSTYLED is stale — these are now styled, remove them: ${staleAllowlist.join(', ')}`);
  process.exit(1);
}

console.log('\n=== Suite 5: Simulation of Stays Filtering & Business Logic ===');
const { NHA_TRANG_STAYS } = require('./stays-data.js');
console.log(`  ✔ Loaded ${NHA_TRANG_STAYS.length} stays from stays-data.js`);

// Test Theme Categories Filtering
const themes = ['all', 'welcome', 'luxury', 'poolvilla', 'goodbye'];
for (const t of themes) {
  const filtered = NHA_TRANG_STAYS.filter(item => {
    if (t === 'all') return true;
    if (t === 'welcome' && item.theme === 'theme1') return true;
    if (t === 'luxury' && item.theme === 'theme2') return true;
    if (t === 'poolvilla' && item.theme === 'theme3') return true;
    if (t === 'goodbye' && item.theme === 'theme4') return true;
    return false;
  });
  console.log(`  ✔ Theme filter '${t}': ${filtered.length} stays matched`);
  if (t !== 'all' && filtered.length !== 6) {
    console.error(`Expected 6 stays for theme ${t}, got ${filtered.length}`);
    process.exit(1);
  }
}

// Test Tag Filtering
const tags = ['pool', 'beach', 'private_pool', 'budget', 'shopping'];
for (const tag of tags) {
  const filtered = NHA_TRANG_STAYS.filter(item => {
    const allTags = (item.tags || []).concat(item.amenities || []).join(' ').toLowerCase();
    if (tag === 'pool' && (allTags.includes('수영장') || allTags.includes('인피니티풀') || allTags.includes('루프탑풀') || allTags.includes('풀') || item.category === '풀빌라')) return true;
    if (tag === 'beach' && (allTags.includes('오션') || allTags.includes('비치') || allTags.includes('해변') || allTags.includes('바다'))) return true;
    if (tag === 'private_pool' && (allTags.includes('단독') || allTags.includes('프라이빗') || allTags.includes('개별') || item.category === '풀빌라')) return true;
    if (tag === 'budget' && (item.pricePerNightVnd <= 1000000 || allTags.includes('가성비') || allTags.includes('5만') || item.theme === 'theme1' || item.theme === 'theme4')) return true;
    if (tag === 'shopping' && (allTags.includes('야시장') || allTags.includes('쇼핑') || allTags.includes('시내') || allTags.includes('마트') || (item.nearbySpots || []).some(s => s.includes('야시장') || s.includes('마트')))) return true;
    return false;
  });
  console.log(`  ✔ Tag filter '${tag}': ${filtered.length} stays matched`);
  if (filtered.length === 0) {
    console.error(`Tag filter ${tag} matched 0 stays!`);
    process.exit(1);
  }
}

// Test Search
const searchQueries = ['인터컨티넨탈', '아미아나', '수영장', '야시장', '깜란'];
for (const q of searchQueries) {
  const lowerQ = q.toLowerCase();
  const matched = NHA_TRANG_STAYS.filter(item => {
    const inNameKo = (item.nameKo || '').toLowerCase().includes(lowerQ);
    const inNameEn = (item.nameEn || '').toLowerCase().includes(lowerQ);
    const inNameVi = (item.nameVi || '').toLowerCase().includes(lowerQ);
    const inArea = (item.area || '').toLowerCase().includes(lowerQ);
    const inTags = (item.tags || []).some(tag => tag.toLowerCase().includes(lowerQ));
    const inAmenities = (item.amenities || []).some(a => a.toLowerCase().includes(lowerQ));
    const inHighlights = (item.highlights || []).some(h => h.toLowerCase().includes(lowerQ));
    const inNearby = (item.nearbySpots || []).some(n => n.toLowerCase().includes(lowerQ));
    return inNameKo || inNameEn || inNameVi || inArea || inTags || inAmenities || inHighlights || inNearby;
  });
  console.log(`  ✔ Search query '${q}': ${matched.length} stays matched`);
  if (matched.length === 0) {
    console.error(`Search query ${q} had 0 results!`);
    process.exit(1);
  }
}

console.log('\n=== Suite 6: Simulation of Shopping Filtering & Business Logic ===');
const { NHA_TRANG_SHOPPING } = require('./shopping-data.js');
console.log(`  ✔ Loaded ${NHA_TRANG_SHOPPING.length} shopping spots from shopping-data.js`);

const shopCategories = ['all', 'crocs_shoes', 'dam_market', 'night_market', 'boutique_mirror', 'casual_sportswear'];
for (const cat of shopCategories) {
  const filtered = NHA_TRANG_SHOPPING.filter(s => cat === 'all' || s.category === cat);
  console.log(`  ✔ Shopping category '${cat}': ${filtered.length} spots matched`);
  if (filtered.length === 0) {
    console.error(`Shopping category ${cat} matched 0 spots!`);
    process.exit(1);
  }
}

const shopTags = ['ac', 'fixed', 'transfer', 'bargain', 'mirror_tier', 'value'];
for (const tag of shopTags) {
  const filtered = NHA_TRANG_SHOPPING.filter(s => {
    const allText = [
      ...(s.tags || []),
      ...(s.facilities || []),
      ...(s.paymentMethods || []),
      s.qualityTier || '',
      s.category || ''
    ].join(' ').toLowerCase();

    if (tag === 'ac') return s.hasAirConditioning || allText.includes('에어컨');
    if (tag === 'fixed') return s.bargainingRequired === false || allText.includes('정찰');
    if (tag === 'transfer') return allText.includes('계좌이체') || allText.includes('원화') || allText.includes('gln') || allText.includes('카카오페이');
    if (tag === 'bargain') return s.bargainingRequired === true || allText.includes('흥정');
    if (tag === 'mirror_tier') return s.category === 'boutique_mirror' || allText.includes('미러') || allText.includes('sa급');
    if (tag === 'value') return allText.includes('가성비') || s.avgPriceVnd <= 250000 || s.category === 'dam_market';
    return false;
  });
  console.log(`  ✔ Shopping tag chip '${tag}': ${filtered.length} spots matched`);
  if (filtered.length === 0) {
    console.error(`Shopping tag ${tag} matched 0 spots!`);
    process.exit(1);
  }
}

const shopSearchQueries = ['켄켄', '크록스', '담시장', '착한할아버지', '라탄', '탑젤리', '야시장', '롯데마트', '소호', 'VIP', '미스앤미스터', '스투시', '린넨', '원피스', '레깅스', '스니커즈', '김청', '김빈'];
for (const q of shopSearchQueries) {
  const lowerQ = q.toLowerCase();
  const matched = NHA_TRANG_SHOPPING.filter(s => {
    const inName = (s.name || '').toLowerCase().includes(lowerQ);
    const inNameVi = (s.nameVi || '').toLowerCase().includes(lowerQ);
    const inLocation = (s.location || '').toLowerCase().includes(lowerQ);
    const inHighlight = (s.highlight || '').toLowerCase().includes(lowerQ);
    const inDesc = (s.description || '').toLowerCase().includes(lowerQ);
    const inTags = (s.tags || []).some(t => t.toLowerCase().includes(lowerQ));
    const inBargain = (s.bargainingGuide || []).some(bg => bg.item.toLowerCase().includes(lowerQ));
    return inName || inNameVi || inLocation || inHighlight || inDesc || inTags || inBargain;
  });
  console.log(`  ✔ Shopping search query '${q}': ${matched.length} spots matched`);
  if (matched.length === 0) {
    console.error(`Shopping search query ${q} had 0 results!`);
    process.exit(1);
  }
}

console.log('\n=== Suite 7: Currency & ATM Tab wired through the real js/app.js ===');
const { NHA_TRANG_CURRENCY } = require('./currency-data.js');
console.log(`  ✔ Loaded ${NHA_TRANG_CURRENCY.length} currency spots from currency-data.js`);

// Seed the globals the app reads, then load the real application logic.
global.NHA_TRANG_CURRENCY = NHA_TRANG_CURRENCY;
global.NHA_TRANG_ACTIVITIES = global.NHA_TRANG_ACTIVITIES || [];
global.NHA_TRANG_GOURMETS = global.NHA_TRANG_GOURMETS || [];
global.NHA_TRANG_STAYS = NHA_TRANG_STAYS;
global.NHA_TRANG_SHOPPING = NHA_TRANG_SHOPPING;

let currencyApp;
try {
  currencyApp = require('./js/app.js');
} catch (e) {
  console.error('  ❌ js/app.js could not be loaded in Node:', e.message);
  process.exit(1);
}

if (typeof currencyApp.getFilteredCurrency !== 'function') {
  console.error('  ❌ js/app.js does not export getFilteredCurrency');
  process.exit(1);
}
console.log('  ✔ js/app.js exports the currency filter for testing');

const navBlock = html.slice(html.indexOf('id="currencyCategoryNav"'), html.indexOf('id="guideCategoryNav"'));
const chipBlock = html.slice(html.indexOf('id="currencyTagChips"'), html.indexOf('id="guideTagChips"'));
const navCats = [...navBlock.matchAll(/data-currcategory="([^"]+)"/g)].map(m => m[1]);
const navTags = [...chipBlock.matchAll(/data-currtag="([^"]+)"/g)].map(m => m[1]);

if (navCats.length === 0 || navTags.length === 0) {
  console.error('  ❌ No currency category buttons / tag chips found in index.html');
  process.exit(1);
}

for (const cat of navCats) {
  currencyApp.resetStateFilters();
  currencyApp.state.currencyCategory = cat;
  const n = currencyApp.getFilteredCurrency().length;
  if (n === 0) {
    console.error(`  ❌ Currency category '${cat}' returns 0 results through the real filter`);
    process.exit(1);
  }
  console.log(`  ✔ Currency category '${cat}': ${n} spots matched`);
}

for (const tag of navTags) {
  currencyApp.resetStateFilters();
  currencyApp.state.currencyTag = tag;
  const n = currencyApp.getFilteredCurrency().length;
  if (n === 0) {
    console.error(`  ❌ Currency tag chip '${tag}' returns 0 results through the real filter`);
    process.exit(1);
  }
  console.log(`  ✔ Currency tag '${tag}': ${n} spots matched`);
}
currencyApp.resetStateFilters();

console.log('\n=== Suite 8: Spa Tab wired through the real js/app.js ===');
const { NHA_TRANG_SPAS } = require('./spa-data.js');
console.log(`  ✔ Loaded ${NHA_TRANG_SPAS.length} spas from spa-data.js`);

global.NHA_TRANG_SPAS = NHA_TRANG_SPAS;

let spaApp;
try {
  spaApp = require('./js/app.js');
} catch (e) {
  console.error('  ❌ js/app.js could not be loaded in Node:', e.message);
  process.exit(1);
}

if (typeof spaApp.getFilteredSpas !== 'function') {
  console.error('  ❌ js/app.js does not export getFilteredSpas');
  process.exit(1);
}
console.log('  ✔ js/app.js exports the spa filter for testing');

const spaNavBlock = html.slice(html.indexOf('id="spaCategoryNav"'), html.indexOf('id="shoppingCategoryNav"'));
const spaChipBlock = html.slice(html.indexOf('id="spaTagChips"'), html.indexOf('id="shoppingTagChips"'));
const spaNavCats = [...spaNavBlock.matchAll(/data-spacategory="([^"]+)"/g)].map(m => m[1]);
const spaNavTags = [...spaChipBlock.matchAll(/data-spatag="([^"]+)"/g)].map(m => m[1]);

if (spaNavCats.length === 0 || spaNavTags.length === 0) {
  console.error('  ❌ No spa category buttons / tag chips found in index.html');
  process.exit(1);
}

for (const cat of spaNavCats) {
  spaApp.resetStateFilters();
  spaApp.state.spaCategory = cat;
  const n = spaApp.getFilteredSpas().length;
  if (n === 0) {
    console.error(`  ❌ Spa category '${cat}' returns 0 results through the real filter`);
    process.exit(1);
  }
  console.log(`  ✔ Spa category '${cat}': ${n} spots matched`);
}

for (const tag of spaNavTags) {
  spaApp.resetStateFilters();
  spaApp.state.spaTag = tag;
  const n = spaApp.getFilteredSpas().length;
  if (n === 0) {
    console.error(`  ❌ Spa tag chip '${tag}' returns 0 results through the real filter`);
    process.exit(1);
  }
  console.log(`  ✔ Spa tag '${tag}': ${n} spots matched`);
}
spaApp.resetStateFilters();

console.log('\n=== Suite 9: Guide Hub Tab wired through the real js/app.js ===');
const { NHA_TRANG_GUIDE_HUB } = require('./guide-data.js');
console.log(`  ✔ Loaded Guide Hub data (transport, ${NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix.items.length} souvenirs, ${NHA_TRANG_GUIDE_HUB.emergencyPharmacy.pharmacyMeds.length} meds, ${NHA_TRANG_GUIDE_HUB.flashcards.length} flashcards)`);

global.NHA_TRANG_GUIDE_HUB = NHA_TRANG_GUIDE_HUB;

let guideApp;
try {
  guideApp = require('./js/app.js');
} catch (e) {
  console.error('  ❌ js/app.js could not be loaded in Node for Guide Hub:', e.message);
  process.exit(1);
}

if (typeof guideApp.getFilteredFlashcards !== 'function' || typeof guideApp.getFilteredSouvenirs !== 'function') {
  console.error('  ❌ js/app.js does not export guide filter functions');
  process.exit(1);
}
console.log('  ✔ js/app.js exports Guide Hub filter functions');

const guideNavBlock = html.slice(html.indexOf('id="guideCategoryNav"'), html.indexOf('class="toolbar-section"'));
const guideChipBlock = html.slice(html.indexOf('id="guideTagChips"'), html.indexOf('class="toolbar-controls"'));
const guideNavCats = [...guideNavBlock.matchAll(/data-guidecategory="([^"]+)"/g)].map(m => m[1]);
const guideNavTags = [...guideChipBlock.matchAll(/data-guidetag="([^"]+)"/g)].map(m => m[1]);

for (const cat of guideNavCats) {
  guideApp.resetStateFilters();
  guideApp.state.guideCategory = cat;
  const fcCount = guideApp.getFilteredFlashcards().length;
  console.log(`  ✔ Guide category '${cat}': ${fcCount} flashcards matching category filter`);
}

for (const tag of guideNavTags) {
  guideApp.resetStateFilters();
  guideApp.state.guideTag = tag;
  const fcCount = guideApp.getFilteredFlashcards().length;
  console.log(`  ✔ Guide tag chip '${tag}': ${fcCount} flashcards matching tag filter`);
}
guideApp.resetStateFilters();

// Exchange rate must come from one constant, or the calculator and the card prices disagree.
const dataSrc = fs.readFileSync('data.js', 'utf8');
const rateMatch = dataSrc.match(/const DEFAULT_EXCHANGE_RATE\s*=\s*([\d.]+)/);
if (!rateMatch) {
  console.error('  ❌ DEFAULT_EXCHANGE_RATE not found in data.js');
  process.exit(1);
}
if (!appCode.includes('DEFAULT_EXCHANGE_RATE') || !appCode.includes('currentBenchmarkRate =')) {
  console.error('  ❌ js/app.js must seed currentBenchmarkRate from DEFAULT_EXCHANGE_RATE');
  process.exit(1);
}
if (!/const getRate = \(\) => currentBenchmarkRate \/ 100/.test(appCode)) {
  console.error('  ❌ The header calculator must derive its rate from currentBenchmarkRate (live), not a snapshot');
  process.exit(1);
}
console.log(`  ✔ Single exchange-rate source: DEFAULT_EXCHANGE_RATE = ${rateMatch[1]}`);

console.log('\n=== Suite 10: Dataset Count Synchronization (index.html + js/app.js) ===');
// index.html and js/app.js both hard-code dataset sizes in several places.
// Every expected value here is derived from the dataset's own .length, never
// a literal, so a data addition/removal that isn't propagated everywhere
// actually fails this suite instead of silently drifting.
const { NHA_TRANG_ACTIVITIES } = require('./data.js');
const { NHA_TRANG_GOURMETS } = require('./gourmet-data.js');
const { NHA_TRANG_HOTEL_DININGS } = require('./hotel-dining-data.js');

const domainCounts = {
  activities: NHA_TRANG_ACTIVITIES.length,
  gourmet: NHA_TRANG_GOURMETS.length,
  stays: NHA_TRANG_STAYS.length,
  hoteldining: NHA_TRANG_HOTEL_DININGS.length,
  spa: NHA_TRANG_SPAS.length,
  shopping: NHA_TRANG_SHOPPING.length,
  currency: NHA_TRANG_CURRENCY.length
};

let countSyncFailed = false;

// --- 10a. Header tab-badge counts ---
// Each nav-tab-btn carries the domain in data-tab, followed by one
// <span class="tab-badge">N</span>. The guide tab's badge reads "4대 가이드"
// (not a count of guide-data.js entries), so it is excluded here by design.
for (const domain of Object.keys(domainCounts)) {
  const re = new RegExp(`data-tab="${domain}"[\\s\\S]*?<span class="tab-badge"[^>]*>([^<]+)<\\/span>`);
  const m = html.match(re);
  const expected = String(domainCounts[domain]);
  if (!m) {
    console.error(`  ❌ Tab badge not found for domain '${domain}' (data-tab="${domain}")`);
    countSyncFailed = true;
  } else if (m[1] !== expected) {
    console.error(`  ❌ Tab badge for '${domain}' reads '${m[1]}', expected '${expected}' (dataset length)`);
    countSyncFailed = true;
  } else {
    console.log(`  ✔ Tab badge '${domain}': ${m[1]} matches dataset length`);
  }
}

// --- 10b. Category nav "전체 ... (N곳/개)" subtotal ---
const categoryNavIds = {
  activities: 'activityCategoryNav',
  gourmet: 'gourmetCategoryNav',
  stays: 'stayCategoryNav',
  hoteldining: 'hoteldiningCategoryNav',
  spa: 'spaCategoryNav',
  shopping: 'shoppingCategoryNav',
  currency: 'currencyCategoryNav'
};

for (const [domain, navId] of Object.entries(categoryNavIds)) {
  const navStart = html.indexOf(`id="${navId}"`);
  const navEnd = navStart === -1 ? -1 : html.indexOf('</nav>', navStart);
  const expected = domainCounts[domain];
  if (navStart === -1 || navEnd === -1) {
    console.error(`  ❌ Category nav not found: ${navId}`);
    countSyncFailed = true;
    continue;
  }
  const navBlock = html.slice(navStart, navEnd);
  const m = navBlock.match(/\((\d+)(?:곳|개)\)/);
  if (!m) {
    console.error(`  ❌ '${navId}' has no "(N곳/개)" subtotal on its first category button`);
    countSyncFailed = true;
  } else if (parseInt(m[1], 10) !== expected) {
    console.error(`  ❌ '${navId}' subtotal reads '(${m[1]})', expected '(${expected})'`);
    countSyncFailed = true;
  } else {
    console.log(`  ✔ '${navId}' subtotal: (${m[1]}) matches dataset length`);
  }
}

// --- 10c. js/app.js DOMAINS heroPills phrasing ---
// Phrasing differs per domain, so each domain gets its own regex tuned to its
// exact wording. Domains whose heroPills text doesn't embed a total dataset
// count (shopping, currency — their pills only mention subset counts like
// "ATM 8곳") are skipped: there is nothing meaningful to compare.
const heroPillPatterns = {
  activities: /엄선된 (\d+)개 리얼 액티비티/,
  gourmet: /현지인 & 스페셜티 (\d+)곳/,
  stays: /엄선 (\d+)선/,
  hoteldining: /5성급 호텔 시그니처 (\d+)곳/,
  spa: /엄선된 (\d+)선 힐링 스파/
};

function extractDomainBlock(src, key) {
  const marker = `key: '${key}'`;
  const start = src.indexOf(marker);
  if (start === -1) return null;
  const nextStart = src.indexOf(`key: '`, start + marker.length);
  return src.slice(start, nextStart === -1 ? src.length : nextStart);
}

for (const [domain, pattern] of Object.entries(heroPillPatterns)) {
  const block = extractDomainBlock(appCode, domain);
  const expected = domainCounts[domain];
  if (!block) {
    console.error(`  ❌ DOMAINS entry not found for key '${domain}' in js/app.js`);
    countSyncFailed = true;
    continue;
  }
  const m = block.match(pattern);
  if (!m) {
    console.error(`  ❌ heroPills for '${domain}' does not match its expected phrasing`);
    countSyncFailed = true;
  } else if (parseInt(m[1], 10) !== expected) {
    console.error(`  ❌ heroPills for '${domain}' embeds count '${m[1]}', expected '${expected}'`);
    countSyncFailed = true;
  } else {
    console.log(`  ✔ heroPills for '${domain}': embedded count ${m[1]} matches dataset length`);
  }
}

if (countSyncFailed) {
  console.error('Total count synchronization failures detected above.');
  process.exit(1);
}


// ===========================================================================
// Suite 11: Dead CSS — style.css에 선언만 있고 아무도 쓰지 않는 클래스
// ---------------------------------------------------------------------------
// Suite 4b가 검사하는 방향(js/app.js가 뱉는 클래스 -> style.css 선언)의 역방향이다.
// 이 검사가 없던 동안 25개가 쌓였다 (삭제된 Day N 기능의 .card-badge-day 등).
// 예외 목록을 늘려 통과시키지 말 것 — 안 쓰는 선언은 지우는 것이 정답이다.
// ===========================================================================
console.log('\n=== Suite 11: Dead CSS (style.css 선언 vs 실제 사용) ===');

const cssForDead = fs.readFileSync('style.css', 'utf8');
const srcForDead = fs.readFileSync('index.html', 'utf8') + fs.readFileSync('js/app.js', 'utf8');

// 룰 프렐류드(`{` 앞)에서만 클래스를 걷는다. 주석 안의 URL(`www.w3.org` 등)이
// `.org` 같은 가짜 클래스로 잡히지 않게 하려는 것이다.
const cssNoComments = cssForDead.replace(/\/\*[\s\S]*?\*\//g, '');
const declaredClasses = new Set();
for (const m of cssNoComments.matchAll(/(^|\}|\{)([^{}]+)\{/g)) {
  const prelude = m[2];
  if (prelude.trim().startsWith('@')) continue;
  for (const cm of prelude.matchAll(/\.([A-Za-z_][A-Za-z0-9_-]*)/g)) declaredClasses.add(cm[1]);
}

// 사용 판정: class 속성 / classList / 셀렉터 문자열 / 템플릿 리터럴 어디든
// 클래스명이 토큰 경계와 함께 등장하면 살아 있는 것으로 본다.
const deadClasses = [...declaredClasses].filter(cls => {
  const esc = cls.replace(/[-]/g, '\\-');
  return !new RegExp(`[\'"\`\\s>.]${esc}[\'"\`\\s.:,\\$]`).test(srcForDead);
}).sort();

if (deadClasses.length > 0) {
  console.error(`  ❌ ${deadClasses.length} dead class(es) declared in style.css but never used:`);
  deadClasses.forEach(c => console.error(`     .${c}`));
  console.error('  → 사용처를 만들거나 선언을 지워라. 예외 목록을 만들지 말 것.');
  process.exit(1);
}
console.log(`  ✔ ${declaredClasses.size} declared classes, 0 unused`);


// ===========================================================================
// Suite 12: 디자인 토큰 — 정의 없는 var() 참조 / 하드코딩 hex
// ---------------------------------------------------------------------------
// var(--없는이름)은 무효값이 되어 색이 조용히 상속된다. 콘솔 에러도 안 난다.
// 실제로 --color-sea가 9곳, --shadow-card가 1곳에서 정의 없이 참조되고 있었다.
// 두 번째 검사는 :root 토큰 밖의 hex 리터럴을 막는다 (사진 배경용 #000000 예외).
// ===========================================================================
console.log('\n=== Suite 12: 디자인 토큰 무결성 ===');

const cssTok = fs.readFileSync('style.css', 'utf8');
const jsTok = fs.readFileSync('js/app.js', 'utf8');
const htmlTok = fs.readFileSync('index.html', 'utf8');
let tokenFailed = false;

const definedVars = new Set([...cssTok.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m => m[1]));
const usedVars = new Set([...(cssTok + jsTok + htmlTok).matchAll(/var\((--[a-z0-9-]+)/g)].map(m => m[1]));
const undefinedVars = [...usedVars].filter(v => !definedVars.has(v)).sort();
if (undefinedVars.length > 0) {
  console.error(`  ❌ ${undefinedVars.length} var() reference(s) with no :root definition: ${undefinedVars.join(', ')}`);
  tokenFailed = true;
} else {
  console.log(`  ✔ ${usedVars.size} var() references all resolve (${definedVars.size} tokens defined)`);
}

// :root 블록 안의 hex는 토큰 정의 그 자체이므로 제외한다.
const rootBlock = cssTok.slice(cssTok.indexOf(':root'), cssTok.indexOf('\n}', cssTok.indexOf(':root')));
// 순수 흑백은 브랜드색이 아닌 원색이라 토큰화 대상이 아니다. 그 외에는 늘리지 말 것.
const HEX_ALLOWLIST = new Set(['#000000', '#FFFFFF']);
const strayHex = [...(cssTok.replace(rootBlock, '') + jsTok).matchAll(/#[0-9A-Fa-f]{6}\b/g)]
  .map(m => m[0].toUpperCase())
  .filter(h => !HEX_ALLOWLIST.has(h));
if (strayHex.length > 0) {
  const uniq = [...new Set(strayHex)].sort();
  console.error(`  ❌ ${strayHex.length} hardcoded hex literal(s) outside :root (${uniq.length} unique): ${uniq.join(', ')}`);
  console.error('  → :root에 토큰을 추가하고 var()로 참조하라.');
  tokenFailed = true;
} else {
  console.log('  ✔ 0 hardcoded hex outside :root (style.css + js/app.js)');
}

if (tokenFailed) process.exit(1);

console.log('\n✨ All Frontend Integration Suites Passed Perfectly! ✨');
