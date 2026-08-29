## 2025-08-29 - Toolbar Toggle Buttons Aria State Pattern
**Learning:** Toolbar toggle controls (e.g. view mode, list density, wishlist filter) that use `.active` CSS classes need explicit initial `aria-pressed` attributes in HTML template source files as well as dynamic `setAttribute('aria-pressed', ...)` state sync in JS event handlers to properly expose toggle states to assistive technologies.
**Action:** Whenever adding stateful toggle buttons or chips, include `aria-pressed` in `src/html/` templates and synchronize `aria-pressed` whenever toggling `.active` state in `src/js/`.
