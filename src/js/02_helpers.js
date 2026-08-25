  // --- 2. Formatting & UI Helpers ---
  function formatVND(num) {
    if (!num) return '0 VND';
    return Number(num).toLocaleString() + ' VND';
  }

  function formatKRW(numVND) {
    if (!numVND) return '약 0원';
    const rate = typeof DEFAULT_EXCHANGE_RATE !== 'undefined' ? DEFAULT_EXCHANGE_RATE : 0.054;
    const krw = Math.round((numVND * rate) / 100) * 100;
    return '약 ' + krw.toLocaleString() + '원';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getIntensityStars(level) {
    const total = 5;
    return '⚡'.repeat(Math.min(level || 3, total));
  }

  function showToast(msg, duration = 2500) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function copyAddress(addressText, btnEl) {
    if (!addressText) return;
    const notifySuccess = () => {
      showToast('📋 베트남어 주소가 복사되었습니다! 그랩(Grab)에 붙여넣기 하세요.');
      if (btnEl) {
        const origText = btnEl.innerHTML;
        btnEl.innerHTML = '✓ 복사완료';
        btnEl.style.borderColor = 'var(--color-sea)';
        btnEl.style.color = 'var(--color-sea)';
        setTimeout(() => {
          btnEl.innerHTML = origText;
          btnEl.style.borderColor = '';
          btnEl.style.color = '';
        }, 2000);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addressText).then(notifySuccess).catch(() => {
        fallbackCopy(addressText, notifySuccess);
      });
    } else {
      fallbackCopy(addressText, notifySuccess);
    }
  }

  function fallbackCopy(text, callback) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
      else showToast('📋 주소가 복사되었습니다!');
    } catch (e) {
      prompt('주소를 복사하세요:', text);
    }
    ta.remove();
  }

