## 2025-05-18 - ARIA State Sync in Vanilla JS Tablists and Toggle Controls
**Learning:** In vanilla HTML/JS single-page applications with tabbed navigation and toggle controls, screen readers need dynamic `aria-selected` and `aria-pressed` state updates whenever tab or toggle state changes in JS handlers.
**Action:** Always pair `classList.toggle('active', isSelected)` with `setAttribute('aria-selected', String(isSelected))` or `setAttribute('aria-pressed', String(isPressed))` in DOM state update functions.
