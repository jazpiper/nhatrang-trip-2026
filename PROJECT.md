# Project: Nha Trang Trip 2026 - Shopping & Replica Guide Domain

## Architecture
Vanilla Single Page Application (SPA) architecture without external framework dependencies.
- **Data Layer (`shopping-data.js`)**: Global constant `NHA_TRANG_SHOPPING` loaded before `app.js`, supporting dual Node.js `module.exports` for test runners. Contains 18 ground-truth verified shopping spots.
- **State Layer (`js/store/state.js`)**: Centralized reactive state managing `currentTab`, `shoppingCategory`, `shoppingTag`, `shoppingWishlist`, `shoppingNotes`, and `activeModalShopping`.
- **Component Layer (`js/components/shopping.js`)**: Pure functional module exporting `renderShopping()`, `openShoppingModal()`, `closeShoppingModal()`, `toggleShoppingWishlist()`, and `getFilteredShopping()`.
- **App Controller (`js/app.js`)**: Main orchestrator handling tab switching (`switchMainTab`), event routing, search debouncing, and hero banner updates.
- **Style Layer (`style.css`)**: Airbnb design tokens, scoped `.shopping-card`, `.bargaining-table`, `.pros-cons-grid`, and `.customs-warning-box` adhering to strict CSS class invariants.
- **Verification Layer (`test-shopping.js`, `test-frontend.js`)**: Automated test runner executing 12 validation suites with 100% schema, DOM, URL encoding, and business logic coverage.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Shopping Data Dataset (`shopping-data.js`) | 18 ground-truth verified shopping venues with 28-field schema | M1 | Spec Miner 2 / Explorer 1 |
| 2 | Bargaining Master Price Guide Tables | Item-by-item initial asking price vs target negotiated price | M1 | Spec Miner 2 |
| 3 | Korean Community Sentiment Analysis | Curated pros/cons, bestsellers, scam warnings, fabric quality | M1 | Spec Miner 2 |
| 4 | Customs Clearance & Safety Advice | Duty-free $800 limit, personal use rules, tag removal tips | M1 | Spec Miner 2 |
| 5 | Header Navigation Tab & Badge | Tab button with synced venue count badge | M2 | Explorer 1 / 3 |
| 6 | Category Filter Bar (`#shoppingCategoryNav`) | 5 category filters (전체, 명품/미러급, 담시장, 야시장, 크록스, 스포츠) | M2 | Explorer 1 / 3 |
| 7 | Tag Chips Bar (`#shoppingTagChips`) | 7 quick filter chips (에어컨완비, 정찰제, 계좌이체, 흥정필수 등) | M2 | Explorer 1 / 3 |
| 8 | Dynamic Shopping Grid Section | Responsive card grid container `#shoppingCardsGridContainer` | M2 | Explorer 1 / 3 |
| 9 | Comprehensive Detail Modal | Modal with gallery, bargaining table, sentiment, couple notes | M2 | Explorer 1 / 3 |
| 10 | CSS Styling & Design Tokens | Styles for cards, badges, bargaining tables, sentiment boxes | M2 | Explorer 1 |
| 11 | State Store Extension | `shoppingCategory`, `shoppingTag`, `shoppingWishlist`, `shoppingNotes` | M3 | Explorer 1 / 3 |
| 12 | Shopping Component Module | `js/components/shopping.js` with filtering, sorting, rendering | M3 | Explorer 1 / 3 |
| 13 | App Tab Switching & Event Router | `js/app.js` `switchMainTab('shopping')`, search, hero stats | M3 | Explorer 1 |
| 14 | LocalStorage Sync | Wishlist & couple notes persistent sync with storage helper | M3 | Explorer 1 / 3 |
| 15 | SSOT Count Synchronization | Sync header badge, category buttons, hero stats with dataset length | M3 | GEMINI.md |
| 16 | Automated Test Suite (`test-shopping.js`) | 12 test suites verifying schema, URLs, DOM sync, filter simulation | M4 | Explorer 3 / 1 |
| 17 | Regression & Frontend Suite Update | Extend `test-frontend.js` for shopping tab DOM IDs and CSS classes | M4 | Explorer 1 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Ground-Truth Dataset Creation | `shopping-data.js` (18 verified spots, 28 fields, bargaining tables, sentiment) | none | PLANNED |
| M2 | Markup & CSS Layout | `index.html` (tab, nav, chips, grid, modal) & `style.css` (tables, cards, sentiment) | M1 | PLANNED |
| M3 | State Store & App Component Integration | `js/store/state.js`, `js/components/shopping.js`, `js/app.js` | M1, M2 | PLANNED |
| M4 | Automated Verification & Test Harness | `test-shopping.js` & `test-frontend.js` execution & 100% pass | M1, M2, M3 | PLANNED |
| M5 | Final Gate & Dual-Track Acceptance | Reviewer, Challenger, Forensic Auditor Gate Verification | M4 | PLANNED |

## Interface Contracts
### `shopping-data.js` ↔ `js/components/shopping.js`
- `window.NHA_TRANG_SHOPPING`: Array of 18 `NhaTrangShoppingSpot` objects.
- Each object contains: `id`, `name`, `nameVi`, `category`, `categoryLabel`, `badge`, `qualityTier`, `rating`, `reviewCount`, `openHours`, `location`, `addressVi`, `phone`, `googleMapQuery`, `googleMapUrl`, `googlePhotosUrl`, `priceRangeVnd`, `avgPriceVnd`, `pricePer`, `paymentMethods`, `facilities`, `bargainingGuide`, `koreanReviewsSummary` / `sentimentAnalysis`, `customsAdvice`, `tags`, `images`, `coverImage`, `highlight`, `description`, `localTip`.

### `js/store/state.js` ↔ `js/components/shopping.js` & `js/app.js`
- `state.shoppingCategory`: string ('all' | category slug)
- `state.shoppingTag`: string ('all' | tag key)
- `state.shoppingWishlist`: string[] (array of IDs)
- `state.shoppingNotes`: Record<string, string> (id -> note)
- `state.activeModalShopping`: object | null

### `js/components/shopping.js` Exports
- `renderShopping()`: void (renders cards into `#shoppingCardsGridContainer`)
- `openShoppingModal(shop)`: void (populates `#shoppingModal` and adds `.active`)
- `closeShoppingModal()`: void (removes `.active` from `#shoppingModal`)
- `toggleShoppingWishlist(id)`: void (toggles item in wishlist, updates badge & storage)
- `getFilteredShopping()`: Array<NhaTrangShoppingSpot> (returns filtered & sorted list)

## Code Layout
```
NhaTrang_Trip_2026/
├── data.js                     # Activities & Schedule dataset
├── gourmet-data.js             # Gourmet dataset (113 spots)
├── stays-data.js               # Stays dataset (24 spots)
├── shopping-data.js            # [NEW M1] Shopping dataset (18 spots)
├── index.html                  # [UPDATED M2] Main SPA markup & shopping modal
├── style.css                   # [UPDATED M2] Airbnb design styles & shopping components
├── js/
│   ├── app.js                  # [UPDATED M3] Main router & tab switcher
│   ├── store/
│   │   └── state.js            # [UPDATED M3] Reactive state store
│   ├── utils/
│   │   └── dom.js              # DOM and storage helpers
│   └── components/
│       ├── activity.js         # Activities component
│       ├── gourmet.js          # Gourmet component
│       ├── stay.js             # Stays component
│       └── shopping.js         # [NEW M3] Shopping component
├── test-activity.js            # Activity test suite
├── test-gourmet.js             # Gourmet test suite
├── test-stays.js               # Stays test suite
├── test-seafood.js             # Seafood test suite
├── test-frontend.js            # [UPDATED M4] Frontend integration test
└── test-shopping.js            # [NEW M4] Dedicated 12-suite shopping test runner
```
