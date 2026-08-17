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
  'shoppingModalMapBtn'
];

let missing = 0;
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
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

console.log('\n=== Suite 2: Script Inclusion Order in index.html ===');
const staysScript = '<script src="./stays-data.js"></script>';
const shoppingScript = '<script src="./shopping-data.js"></script>';
const hasAppScript = html.includes('<script src="./js/app.js"></script>') || html.includes('<script type="module" src="./js/app.js"></script>');

if (html.includes(staysScript) && html.includes(shoppingScript) && hasAppScript) {
  const staysIdx = html.indexOf(staysScript);
  const shoppingIdx = html.indexOf(shoppingScript);
  const appIdx = html.indexOf('src="./js/app.js"');
  if (staysIdx < shoppingIdx && shoppingIdx < appIdx) {
    console.log('  ✔ stays-data.js and shopping-data.js are correctly positioned before app.js');
  } else {
    console.error('  ❌ script order violation');
    process.exit(1);
  }
} else {
  console.error('  ❌ Script tag missing');
  process.exit(1);
}

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
const requiredSelectors = [
  '.stay-card',
  '.stay-badge-theme',
  '.stay-badge-cat',
  '.stay-card-actions',
  '.btn-trip-dot-com',
  '.btn-stay-map',
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
  '.shopping-card-actions',
  '.btn-shopping-map',
  '.btn-shopping-photos',
  '.bargain-table-wrap',
  '.bargain-table',
  '.price-asking',
  '.price-target',
  '.pros-cons-grid',
  '.pros-box',
  '.cons-box',
  '.customs-warning-box'
];

for (const sel of requiredSelectors) {
  if (css.includes(sel)) {
    console.log(`  ✔ Found CSS Selector: ${sel}`);
  } else {
    console.error(`  ❌ Missing CSS Selector: ${sel}`);
    process.exit(1);
  }
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

console.log('\n✨ All Frontend Integration Suites Passed Perfectly! ✨');
