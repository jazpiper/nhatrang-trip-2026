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
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function decodeHtmlEntities(str) {
    if (!str || typeof str !== 'string') return '';
    let decoded = str;
    const namedMap = {
      '&colon;': ':',
      '&sol;': '/',
      '&bsol;': '\\',
      '&tab;': '',
      '&newline;': '',
      '&amp;': '&',
      '&quot;': '"',
      '&apos;': "'",
      '&lt;': '<',
      '&gt;': '>'
    };
    for (let i = 0; i < 5; i++) {
      const prev = decoded;
      decoded = decoded
        .replace(/&(?:colon|sol|bsol|tab|newline|amp|quot|apos|lt|gt);?/gi, m => {
          const key = m.toLowerCase().endsWith(';') ? m.toLowerCase() : m.toLowerCase() + ';';
          return namedMap[key] !== undefined ? namedMap[key] : '';
        })
        .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16) || 0))
        .replace(/&#([0-9]+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10) || 0));
      if (decoded === prev) break;
    }
    return decoded;
  }

  /**
   * Sanitizes dynamic URLs to prevent javascript:, vbscript:, data:, and other XSS attacks.
   * Only allows valid http(s), tel, mailto, anchor (#), and safe relative paths.
   */
  function sanitizeUrl(url, fallback = '#') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    if (trimmed === '' || trimmed === '#') return '#';

    const decoded = decodeHtmlEntities(trimmed);
    const normalized = decoded.replace(/[\x00-\x1f\x7f-\x9f\s]/g, '');

    if (/^(?:javascript|vbscript|data|file|blob|livescript|mocha):/i.test(normalized)) {
      return fallback;
    }

    if (/^[/\\\\]{2}/.test(normalized) || /^[/\\\\]{2}/.test(trimmed) || /^[/\\\\]{2}/.test(decoded)) {
      return fallback;
    }

    const schemeMatch = normalized.match(/^([a-z0-9+.-]+):/i);
    if (schemeMatch) {
      const scheme = schemeMatch[1].toLowerCase();
      if (['http', 'https', 'tel', 'mailto'].includes(scheme)) {
        if ((scheme === 'http' || scheme === 'https') && !/^(?:https?:\/\/)/i.test(normalized)) {
          return fallback;
        }
        return trimmed;
      }
      return fallback;
    }

    if (/^(?:#|\/|\.\/|\.\.\/|\?)/.test(trimmed) && !/^[/\\\\]{2}/.test(trimmed) && !/^[/\\\\]{2}/.test(normalized)) {
      return trimmed;
    }

    if (/^[a-zA-Z0-9_.~!*();@&=+$,/?%#[\]-]+$/.test(trimmed) && !trimmed.includes(':') && !decoded.includes(':') && !/^[/\\\\]{2}/.test(trimmed) && !/^[/\\\\]{2}/.test(normalized)) {
      return trimmed;
    }

    return fallback;
  }

  /**
   * Sanitizes image URLs to prevent script execution via image attributes or handlers.
   */
  function sanitizeImageUrl(url, fallback = '') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    if (trimmed === '') return fallback;

    const decoded = decodeHtmlEntities(trimmed);
    const normalized = decoded.replace(/[\x00-\x1f\x7f-\x9f\s]/g, '');

    if (/^(?:javascript|vbscript|file|blob|livescript|mocha):/i.test(normalized)) {
      return fallback;
    }

    if (/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-zA-Z0-9+/=]+$/i.test(normalized)) {
      return trimmed;
    }

    if (/^[/\\\\]{2}/.test(normalized) || /^[/\\\\]{2}/.test(trimmed) || /^[/\\\\]{2}/.test(decoded)) {
      return fallback;
    }

    const schemeMatch = normalized.match(/^([a-z0-9+.-]+):/i);
    if (schemeMatch) {
      const scheme = schemeMatch[1].toLowerCase();
      if (scheme === 'http' || scheme === 'https') {
        if (!/^(?:https?:\/\/)/i.test(normalized)) return fallback;
        return trimmed;
      }
      return fallback;
    }

    if (/^(?:\/|\.\/|\.\.\/)/.test(trimmed) && !/^[/\\\\]{2}/.test(trimmed) && !/^[/\\\\]{2}/.test(normalized)) {
      return trimmed;
    }

    if (/^[a-zA-Z0-9_.~!*();@&=+$,/?%#[\]-]+$/.test(trimmed) && !trimmed.includes(':') && !decoded.includes(':') && !/^[/\\\\]{2}/.test(trimmed) && !/^[/\\\\]{2}/.test(normalized)) {
      return trimmed;
    }

    return fallback;
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
        const origText = btnEl.textContent;
        btnEl.textContent = '✓ 복사완료';
        btnEl.style.borderColor = 'var(--color-sea)';
        btnEl.style.color = 'var(--color-sea)';
        setTimeout(() => {
          btnEl.textContent = origText;
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


