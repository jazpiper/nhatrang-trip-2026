# Project: Nha Trang Trip 2026 - Comprehensive Travel Guide SPA 2-Phase Expansion

## Architecture
Vanilla Single Page Application (SPA) architecture with strict separation of concerns, zero external framework runtime dependencies, declarative `DOMAINS` registry in `js/app.js`, and Node.js CommonJS test compatibility.

- **Data Layer**:
  - `data.js`: 32 pure tour/marine/theme park activities (`NHA_TRANG_ACTIVITIES`), 6-day timeline (`NHA_TRANG_SCHEDULE`), travel tips (`NHA_TRANG_GUIDE_TIPS`).
  - `gourmet-data.js`: 113 local restaurants & cafes (`NHA_TRANG_GOURMETS`).
  - `stays-data.js`: 24 themed accommodations (`NHA_TRANG_STAYS`).
  - `shopping-data.js`: 18 shopping & market spots (`NHA_TRANG_SHOPPING`).
  - `currency-data.js`: 17 currency exchange spots & zero-fee ATMs (`NHA_TRANG_CURRENCY`).
  - `spa-data.js` [Phase 1]: 24 ground-truth verified spa/massage/barbershop spots (`NHA_TRANG_SPAS`) with 39-field schema.
  - `guide-data.js` [Phase 2]: 4 comprehensive survival kit sub-modules (`NHA_TRANG_GUIDE_HUB`).
- **State Layer (`js/app.js` §3)**: Reactive state managing active tab, per-domain category/tag filters, wishlist collections, user note stores (`nha_trang_*`), and modal dialogs.
- **Component & Controller Layer (`js/app.js`)**: Declarative `DOMAINS` table configuration, list/grid renderers (`itemRowHTML`, `itemCardHTML`), detail modal management, wishlist toggles, and live search.
- **Style Layer (`style.css`)**: Airbnb design tokens, 84px compact list rows, responsive photo cards, modal galleries, flashcard fullscreen overlays, and interactive tables.
- **Verification Layer (`test-*.js`)**: 12 automated test suites validating schemas, real DOM rendering, CSS class invariants, search/filter algorithms, and snapshot parity.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Verified Spa Dataset (`spa-data.js`) | 24 ground-truth verified spots across 4 categories with 39-field schema | M1 | Explorer 2 |
| 2 | Activity Dataset Cleanup (`data.js`) | Migrate 11 spa spots out, leaving 32 pure activities (`act-01`~`act-32`) | M1 | Explorer 2 |
| 3 | Automated Spa Test Suite (`test-spa.js`) | 13 test suites validating schema, pricing matrices, addresses, URLs, filters | M1 | Explorer 3 |
| 4 | Activity Test Suite Update (`test-activity.js`) | Update assertions for 32 activities, verify 100% pass | M1 | Explorer 3 |
| 5 | Spa UI Markup & Modals (`index.html`) | Header/bottom nav tabs, `#spaCategoryNav`, `#spaTagChips`, `#spaGridSection`, modal | M2 | Explorer 1 |
| 6 | Spa Logic & `DOMAINS` Registry (`js/app.js`) | Register `spa` domain, `getFilteredSpas()`, `renderSpa()`, list/grid templates | M2 | Explorer 1 |
| 7 | Spa Styling & CSS Invariants (`style.css`) | Airbnb styles for `.spa-card`, `.spa-course-table`, `.spa-terms-grid`, badges | M2 | Explorer 1 |
| 8 | Deterministic Test Stub & Snapshot Sync | Fix `isOpenNow` clock in `test-dom-stub.js`, sync `test-render-snapshot.js` | M2 | Explorer 3 |
| 9 | Survival Kit Dataset (`guide-data.js`) | 4 sub-sections: Transport, Lotte Mart Top 30, Pharmacy/Emergency, Flashcards | M3 | Explorer 3 |
| 10 | Automated Guide Test Suite (`test-guide.js`) | 8 test suites validating all 4 survival kit sub-modules | M3 | Explorer 3 |
| 11 | Guide Hub UI Markup & Layout (`index.html`) | Nav tab, `#guideCategoryNav`, interactive containers for 4 sub-modules | M4 | Explorer 1 |
| 12 | Guide Hub Interactivity & Flashcards (`js/app.js`) | Live search, price comparison table, fullscreen flashcard modal & copy | M4 | Explorer 1 |
| 13 | Guide Hub Styling (`style.css`) | Accordions, matrix tables, emergency cards, fullscreen flashcards | M4 | Explorer 1 |
| 14 | Full Regression & Integration Verification | All 12 test suites passing 100% (`test-*.js`, `test-frontend.js`) | M5 | Reviewers / Challengers / Workers |
| 15 | Forensic Integrity Audit | Systematic anti-hallucination & anti-dummy check | M5 | Forensic Auditor |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Phase 1 Data Layer & Activity Migration | `spa-data.js`, `data.js`, `test-spa.js`, `test-activity.js` | none | DONE |
| M2 | Phase 1 Spa UI, Logic & DOM Integration | `index.html`, `js/app.js`, `style.css`, `test-dom-stub.js`, `test-frontend.js` | M1 | DONE |
| M3 | Phase 2 Survival Kit Hub Dataset | `guide-data.js`, `test-guide.js` | none | DONE |
| M4 | Phase 2 Guide Hub UI, Flashcards & Interactivity | `index.html`, `js/app.js`, `style.css`, `test-frontend.js` | M3 | DONE |
| M5 | Final Full Verification, Hardening & Audit | Full regression across all 12 suites + Forensic Integrity Audit | M2, M4 | DONE |

## Interface Contracts
### `spa-data.js` ↔ `js/app.js`
- `window.NHA_TRANG_SPAS`: Array of 24 `NhaTrangSpaSpot` objects.
- Each object contains 39 fields: `id` (`spa-01`..`spa-24`), `name`, `nameKo`, `nameVi`, `category` (`local_budget`, `luxury_resort`, `barbershop`, `family_maternity`), `categoryLabel`, `badge`, `rating` (number), `reviewCount` (number), `priceRange`, `prices` (`m60_vnd`, `m60_krw`, `m90_vnd`, `m90_krw`, `m120_vnd`, `m120_krw`), `pickupDropoff`, `tipPolicy`, `luggageShower`, `openHours`, `addressVi`, `district`, `districtLabel`, `phone`, `googleMapQuery`, `googleMapUrl`, `googlePhotosUrl`, `coverImage`, `images` (array >=3), `tags` (array), `facilities` (array), `highlight`, `summary`, `description`, `features` (array), `localTip`.

### `guide-data.js` ↔ `js/app.js`
- `window.NHA_TRANG_GUIDE_HUB`: Object containing:
  1. `transport`: Airport matrix (`camRanhToCity`), Taxi comparison (`greenSmVsGrab`), Scam checklist (`scamChecklist`), Intercity bus (`intercityBus`), Motorbike rental (`motorbikeRules`).
  2. `shoppingPriceMatrix`: Array of 30 top souvenir objects with `nameKo`, `nameVi`, `unit`, `officialPriceVnd`, `marketBargainPriceVnd`, `targetDiscountPercent`, `originalVsFakeTip`, `customsAllowed`.
  3. `emergencyPharmacy`: 10 OTC symptom-to-medication mappings, 2 International Hospitals (`vinmec`, `vkHospital`), travel insurance claim checklist.
  4. `flashcards`: Array of 21 communicative cards across categories (`dining`, `transport`, `shopping`, `emergency`) with `ko`, `vi`, `pronunciation`, `purpose`, `icon`.

## Code Layout
```
./
├── data.js                     # 32 Pure activities + schedule + tips
├── gourmet-data.js             # 113 Gourmet places
├── stays-data.js               # 24 Themed accommodations
├── shopping-data.js            # 18 Shopping spots
├── currency-data.js            # 17 Currency & ATM spots
├── spa-data.js                 # [M1] 24 Verified spa/massage/barbershop spots
├── guide-data.js               # [M3] Survival Kit Hub dataset (4 sub-sections)
├── index.html                  # Generated from src/html/
├── style.css                   # [M2, M4] Airbnb design tokens, spa/guide styling, invariants
├── js/
│   └── app.js                  # Generated from src/js/
├── src/                        # Source directory
│   ├── html/                   # HTML partials (01_head.html, 02_header.html, etc.)
│   └── js/                     # JS modules (01_storage.js, 02_helpers.js, domain files, etc.)
├── test-dom-stub.js            # [M2] DOM & clock stub for Node.js test suites
├── test-activity.js            # [M1] 32 Activity test suite
├── test-gourmet.js             # 113 Gourmet test suite
├── test-stays.js               # 24 Stays test suite
├── test-shopping.js            # 18 Shopping test suite
├── test-currency.js            # 17 Currency test suite
├── test-seafood.js             # Seafood test suite
├── test-spa.js                 # [M1] Dedicated 13-suite Spa test runner
├── test-guide.js               # [M3] Dedicated 8-suite Guide Hub test runner
├── test-frontend.js            # [M2, M4] Frontend integration test runner
└── test-render-snapshot.js     # [M2] Visual snapshot parity test runner
```
