  // --- 11. Initialization Entrypoint ---
  // 5개 모달이 공유하는 껍데기를 여기서 한 번만 만든다. 도메인 마크업은
  // index.html의 <template class="modal-tpl">에 그대로 있고, 이 함수는
  // overlay/box/close 버튼으로 감싸 #modalHost에 넣기만 한다.
  // initEvents()가 모달 id로 엘리먼트를 찾으므로 반드시 그보다 먼저 실행돼야 한다.
  function buildModals() {
    const host = document.getElementById('modalHost');
    if (!host) return;
    document.querySelectorAll('template.modal-tpl').forEach(tpl => {
      const modalId = tpl.dataset.modal;
      const closeId = tpl.dataset.close;
      if (!modalId || !closeId) return;
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = modalId;
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      const box = document.createElement('div');
      box.className = 'modal-box';
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-close-btn';
      closeBtn.id = closeId;
      closeBtn.setAttribute('aria-label', '닫기');
      closeBtn.textContent = '✕';
      box.appendChild(closeBtn);
      box.appendChild(tpl.content.cloneNode(true));
      overlay.appendChild(box);
      host.appendChild(overlay);
    });
  }

  function init() {
    buildModals();
    updateWishlistBadge();
    initEvents();
    renderCards();
  }

  // Browser: boot as usual. Node (test runners): there is no document, so skip booting.
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Node-only export shim so test suites can exercise the REAL filter/sort logic
  // instead of reimplementing it. `module` is undefined in the browser, so this
  // block is inert there and the IIFE keeps leaking nothing into window.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      state,
      resetStateFilters,
      escapeHtml,
      sanitizeUrl,
      sanitizeImageUrl,
      getIntensityStars,
      formatVND,
      formatKRW,
      formatVerbalVND,
      formatVerbalKRW,
      getFilteredActivities,
      getFilteredGourmets,
      getFilteredStays,
      getFilteredHotelDinings,
      getFilteredSpas,
      getFilteredShopping,
      getFilteredCurrency,
      // Renderers — exported for the snapshot harness (test-render-snapshot.js).
      // They resolve `document` at call time, so the harness can install a stub
      // AFTER requiring this file, which keeps the bootstrap above from running.
      renderCards,
      renderGourmets,
      renderStays,
      renderHotelDinings,
      renderSpa,
      renderShopping,
      renderCurrency,
      // Modal openers — Phase 4 refactor target, snapshotted the same way.
      openActivityModal,
      openGourmetModal,
      openStayModal,
      openHotelDiningModal,
      closeHotelDiningModal,
      openSpaModal,
      closeSpaModal,
      openShoppingModal,
      openCurrencyModal,
      renderGuide,
      openFlashcardModal,
      closeFlashcardModal,
      getFilteredFlashcards,
      getFilteredSouvenirs,
      getFilteredPharmacyMeds,
      // Storage & View helpers
      sanitizeStorageData,
      loadFromStorage,
      saveToStorage,
      setViewMode,
      setDensity,
      toggleDomainWishlist
    };
  }
})();
