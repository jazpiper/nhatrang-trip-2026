  // --- 8.5 Curation Scenario Domain ---
  function getFilteredCurations() {
    if (typeof NHA_TRANG_CURATIONS === 'undefined' || !NHA_TRANG_CURATIONS) {
      return [];
    }

    const cat = state.curationCategory;
    const tag = state.curationTag;
    const q = state.searchQuery ? state.searchQuery.toLowerCase() : '';

    return NHA_TRANG_CURATIONS.filter(item => {
      // 1. Category Filter
      if (cat && cat !== 'all') {
        const itemCat = item.scenarioKey || item.category;
        if (itemCat !== cat) return false;
      }

      // 2. Tag Filter
      if (tag && tag !== 'all') {
        const allTagText = [
          ...(item.tags || []),
          ...(item.highlights || []),
          ...(item.keyTips || []),
          item.summary || '',
          item.title || ''
        ].join(' ').toLowerCase();

        if (tag === 'luggage' && !(allTagText.includes('짐보관') || allTagText.includes('공항') || allTagText.includes('샌딩') || allTagText.includes('체크아웃'))) return false;
        if (tag === 'indoor' && !(allTagText.includes('실내') || allTagText.includes('머드') || allTagText.includes('온천') || allTagText.includes('우천') || allTagText.includes('애프터눈티'))) return false;
        if (tag === 'late' && !(allTagText.includes('심야') || allTagText.includes('야간') || allTagText.includes('클럽') || allTagText.includes('루프탑') || allTagText.includes('야식'))) return false;
        if (tag === 'sunset' && !(allTagText.includes('선셋') || allTagText.includes('커플') || allTagText.includes('크루즈') || allTagText.includes('파인다이닝') || allTagText.includes('오션뷰'))) return false;
      }

      // 3. Search Query
      if (q) {
        const inTitle = textIncludes(item.title, q) || textIncludes(item.titleEn, q);
        const inSummary = textIncludes(item.summary, q);
        const inTarget = textIncludes(item.targetAudience, q);
        const inTags = (item.tags || []).some(t => textIncludes(t, q));
        const inHighlights = (item.highlights || []).some(h => textIncludes(h, q));
        const inTips = (item.keyTips || []).some(t => textIncludes(t, q));
        const inTimeline = (item.timeline || []).some(step => {
          const inStep = textIncludes(step.title, q) || textIncludes(step.actionGuide, q) || textIncludes(step.location, q);
          const inPlaces = (step.places || step.recommendedPlaces || []).some(p => textIncludes(p.name, q) || textIncludes(p.highlight, q));
          return inStep || inPlaces;
        });

        if (!inTitle && !inSummary && !inTarget && !inTags && !inHighlights && !inTips && !inTimeline) {
          return false;
        }
      }

      return true;
    });
  }

  function getFilteredCuration() {
    return getFilteredCurations();
  }

  function getDomainEmoji(domain) {
    const emojis = {
      spa: '💆',
      gourmet: '🍜',
      shopping: '🛍️',
      hoteldining: '🍽️',
      activities: '⛵',
      stays: '🏨',
      currency: '💱'
    };
    return emojis[domain] || '📍';
  }

  function renderCurationTimelineStep(step) {
    const places = step.places || step.recommendedPlaces || [];
    const stepNo = step.stepNo || step.step;
    const transit = step.transitTime || step.duration || '';
    const actionDesc = step.actionGuide || step.description || '';

    const placesHtml = places.length > 0 ? `
      <div class="timeline-places-grid">
        ${places.map(place => {
          const safeMapUrl = sanitizeUrl(place.mapUrl || place.googleMapUrl || buildMapUrl(place));
          const emoji = getDomainEmoji(place.domain);
          const ratingText = place.rating
            ? `<span class="timeline-place-rating"><span class="star">★</span> ${escapeHtml(place.rating)}</span>`
            : '';
          const reviewCountText = place.reviewCount
            ? `<span>(${Number(place.reviewCount).toLocaleString()})</span>`
            : '';
          const categoryOrHours = place.categoryLabel || place.hours || '';

          return `
            <div class="timeline-place-card">
              <div class="timeline-place-thumb">${emoji}</div>
              <div class="timeline-place-info">
                <span class="timeline-place-name" title="${escapeHtml(place.name)}">${escapeHtml(place.name)}</span>
                <div class="timeline-place-sub">
                  ${ratingText}
                  ${reviewCountText}
                  ${categoryOrHours ? `<span>·</span><span>${escapeHtml(categoryOrHours)}</span>` : ''}
                </div>
              </div>
              <div class="timeline-place-actions">
                <a class="btn-curation-map" href="${escapeHtml(safeMapUrl)}" target="_blank" rel="noopener noreferrer" title="구글 지도에서 보기">지도 ↗</a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : '';

    return `
      <div class="timeline-step">
        <div class="timeline-node">${stepNo}</div>
        <div class="timeline-step-header">
          <span class="timeline-time-badge">${escapeHtml(step.time)}</span>
          <h4 class="timeline-step-title">${escapeHtml(step.title)}</h4>
          ${transit ? `<span class="timeline-transit-badge">🚗 ${escapeHtml(transit)}</span>` : ''}
        </div>
        <p class="timeline-step-desc">${escapeHtml(actionDesc)}</p>
        ${placesHtml}
      </div>
    `;
  }

  function renderCurationCard(course) {
    const keyClass = course.scenarioKey || course.category || 'checkout';
    const keyTips = course.keyTips || course.highlights || [];
    const timeline = course.timeline || [];

    const tipsHtml = keyTips.length > 0 ? `
      <div class="curation-tip-box">
        <div class="curation-tip-title">💡 핵심 실전 꿀팁 & 동선 가이드</div>
        <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px;">
          ${keyTips.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    return `
      <article class="curation-card" data-id="${escapeHtml(course.id)}">
        <div class="curation-header">
          <div class="curation-header-top">
            <span class="curation-badge ${escapeHtml(keyClass)}">${escapeHtml(course.iconEmoji || '🎯')} ${escapeHtml(course.badge)}</span>
            <span class="curation-badge" style="background: var(--color-bg-subtle); color: var(--color-text-secondary);">⏱️ ${escapeHtml(course.duration || course.durationEstimate)}</span>
          </div>
          <h3 class="curation-title">${escapeHtml(course.title)}</h3>
          <p class="curation-summary">${escapeHtml(course.summary)}</p>
        </div>

        <div class="curation-meta-grid">
          <div class="curation-meta-item">
            <span class="curation-meta-label">추천 대상:</span>
            <span class="curation-meta-value">${escapeHtml(course.targetAudience || '자유여행자')}</span>
          </div>
          <div class="curation-meta-item">
            <span class="curation-meta-label">예상 경비:</span>
            <span class="curation-meta-value">${escapeHtml(course.estimatedCostKrw || course.estimatedCostVnd || course.budgetEstimate)}</span>
          </div>
          <div class="curation-meta-item">
            <span class="curation-meta-label">추천 교통:</span>
            <span class="curation-meta-value">${escapeHtml(course.recommendedTransport || '그랩 및 도보')}</span>
          </div>
          <div class="curation-meta-item">
            <span class="curation-meta-label">소요 시간:</span>
            <span class="curation-meta-value">${escapeHtml(course.duration || course.durationEstimate)}</span>
          </div>
        </div>

        ${tipsHtml}

        <div class="curation-timeline">
          ${timeline.map(renderCurationTimelineStep).join('')}
        </div>
      </article>
    `;
  }

  function renderCuration() {
    const container = document.getElementById('curationCardsGridContainer');
    const countEl = document.getElementById('curationResultCountText');
    if (!container) return;

    const list = getFilteredCurations();
    if (countEl) {
      countEl.innerHTML = `총 <strong>${list.length}</strong>개의 맞춤 상황별 추천 코스`;
    }

    if (list.length === 0) {
      container.className = 'empty-state-wrap';
      container.innerHTML = `
        <div class="empty-state">
          <div class="icon">🎯</div>
          <h3>조건에 맞는 상황별 코스가 없습니다</h3>
          <p>검색어나 필터 조건을 변경해 보세요.</p>
          <button class="btn-reset-filters" id="curationResetFiltersBtn">필터 초기화</button>
        </div>
      `;
      const resetBtn = document.getElementById('curationResetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('reset-filters'));
        });
      }
      return;
    }

    container.className = 'curation-container';
    container.innerHTML = list.map(renderCurationCard).join('');
  }
