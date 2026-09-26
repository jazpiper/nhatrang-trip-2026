  // --- 8.5 Guide Hub & Survival Kit Domain Logic ---
  function getFilteredFlashcards() {
    if (typeof NHA_TRANG_GUIDE_HUB === 'undefined' || !NHA_TRANG_GUIDE_HUB.flashcards) return [];
    let list = [...NHA_TRANG_GUIDE_HUB.flashcards];

    const cat = state.guideCategory;
    const tag = state.guideTag;
    const targetCat = (cat !== 'all') ? cat : (tag !== 'all' ? tag : null);

    if (targetCat && targetCat !== 'all' && targetCat !== 'flashcards') {
      list = list.filter(fc => fc.category === targetCat);
    }

    const q = (state.searchQuery || '').trim().toLowerCase();
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter(fc => {
        const text = `${fc.ko} ${fc.vi} ${fc.pronunciation} ${fc.purpose} ${fc.categoryLabel || ''} ${fc.category}`.toLowerCase();
        return tokens.every(t => text.includes(t));
      });
    }

    return list;
  }

  function getFilteredSouvenirs() {
    if (typeof NHA_TRANG_GUIDE_HUB === 'undefined' || !NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix || !NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix.items) return [];
    let list = [...NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix.items];

    const q = (state.searchQuery || '').trim().toLowerCase();
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter(item => {
        const text = `${item.nameKo} ${item.nameVi} ${item.category} ${item.unit} ${item.description} ${item.originalVsFakeTip}`.toLowerCase();
        return tokens.every(t => text.includes(t));
      });
    }

    return list;
  }

  function getFilteredPharmacyMeds() {
    if (typeof NHA_TRANG_GUIDE_HUB === 'undefined' || !NHA_TRANG_GUIDE_HUB.emergencyPharmacy || !NHA_TRANG_GUIDE_HUB.emergencyPharmacy.pharmacyMeds) return [];
    let list = [...NHA_TRANG_GUIDE_HUB.emergencyPharmacy.pharmacyMeds];

    const q = (state.searchQuery || '').trim().toLowerCase();
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter(med => {
        const text = `${med.brandName} ${med.activeIngredient} ${med.category} ${med.symptom} ${med.dosageKo} ${med.boxPhotoTip}`.toLowerCase();
        return tokens.every(t => text.includes(t));
      });
    }

    return list;
  }

  // 가이드 허브는 리스트가 아니라 4개 독립 섹션의 조립이다. 한 함수가 450행에
  // 걸쳐 전부 만들던 것을 섹션별 함수로 갈랐다. renderGuide는 카테고리 필터에
  // 따라 조립하고 이벤트를 바인딩하는 일만 한다.

  function guideAirportTableHTML(matrix) {
    return `
          <!-- Airport Matrix Table -->
          <div class="airport-table-wrap">
            <table class="airport-table">
              <thead>
                <tr>
                  <th>이동 구간</th>
                  <th>거리/시간</th>
                  <th>4인승 세단</th>
                  <th>7인승 SUV</th>
                  <th>16인승 밴</th>
                  <th>대중교통 / 특이사항</th>
                </tr>
              </thead>
              <tbody>
                ${matrix.map(r => `
                  <tr>
                    <td><strong>${escapeHtml(r.routeKo)}</strong><div class="souv-name-vi">${escapeHtml(r.routeVi)}</div></td>
                    <td>${r.distanceKm}km<br><span class="label">(${escapeHtml(r.durationMins)})</span></td>
                    <td><strong class="souv-price-mart">${r.sedan4SeatVnd.toLocaleString()}동</strong><br><span class="label">약 ${r.sedan4SeatKrw.toLocaleString()}원</span></td>
                    <td><strong class="souv-price-mart">${r.suv7SeatVnd.toLocaleString()}동</strong><br><span class="label">약 ${r.suv7SeatKrw.toLocaleString()}원</span></td>
                    <td><strong>${r.van16SeatVnd.toLocaleString()}동</strong><br><span class="label">약 ${r.van16SeatKrw.toLocaleString()}원</span></td>
                    <td><span class="label">${escapeHtml(r.busOption)}</span><br><span class="airport-note-warn">💡 ${escapeHtml(r.nightSurcharge)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>`;
  }

  function guideTaxiCompareHTML(comparison) {
    return `
          <!-- 3-Way Taxi Comparison Grid -->
          <div class="taxi-compare-grid">
            <!-- Xanh SM EV -->
            <div class="taxi-compare-card taxi-card-accent-primary">
              <div class="taxi-card-header">
                <div>
                  <h3 class="taxi-card-name">⚡ ${escapeHtml(comparison.xanhSM.nameKo)}</h3>
                  <div class="souv-name-vi">${escapeHtml(comparison.xanhSM.nameVi)}</div>
                </div>
                <span class="taxi-card-tag taxi-card-tag-primary">추천 1위</span>
              </div>
              <div class="taxi-pros"><strong>장점:</strong> ${escapeHtml(comparison.xanhSM.pros)}</div>
              <div class="taxi-cons"><strong>단점:</strong> ${escapeHtml(comparison.xanhSM.cons)}</div>
              <div class="taxi-hotline">📞 콜센터: ${escapeHtml(comparison.xanhSM.hotline)}</div>
            </div>

            <!-- Grab -->
            <div class="taxi-compare-card taxi-card-accent-success">
              <div class="taxi-card-header">
                <div>
                  <h3 class="taxi-card-name">📱 ${escapeHtml(comparison.grab.nameKo)}</h3>
                  <div class="souv-name-vi">${escapeHtml(comparison.grab.nameVi)}</div>
                </div>
                <span class="taxi-card-tag taxi-card-tag-success">정찰제 앱</span>
              </div>
              <div class="taxi-pros"><strong>장점:</strong> ${escapeHtml(comparison.grab.pros)}</div>
              <div class="taxi-cons"><strong>단점:</strong> ${escapeHtml(comparison.grab.cons)}</div>
              <div class="taxi-hotline">📲 예약: ${escapeHtml(comparison.grab.bookingMethod)}</div>
            </div>

            <!-- Traditional Taxis -->
            <div class="taxi-compare-card taxi-card-accent-neutral">
              <div class="taxi-card-header">
                <div>
                  <h3 class="taxi-card-name">🚕 ${escapeHtml(comparison.traditionalTaxis.nameKo)}</h3>
                  <div class="souv-name-vi">${escapeHtml(comparison.traditionalTaxis.nameVi)}</div>
                </div>
                <span class="taxi-card-tag">호텔 대기</span>
              </div>
              <div class="taxi-pros"><strong>장점:</strong> ${escapeHtml(comparison.traditionalTaxis.pros)}</div>
              <div class="taxi-cons"><strong>단점:</strong> ${escapeHtml(comparison.traditionalTaxis.cons)}</div>
              <div class="taxi-hotline">📞 ${escapeHtml(comparison.traditionalTaxis.hotline)}</div>
            </div>
          </div>`;
  }

  function guideScamPreventionHTML(scamPrevention) {
    return `
          <!-- Scam Prevention 5 Rules -->
          <div class="guide-block-spacer">
            <h3 class="guide-subsection-title guide-subsection-title-warn">
              🛡️ 현지 택시·교통 사기 예방 5대 수칙
            </h3>
            <div class="scam-checklist-grid">
              ${scamPrevention.map(s => `
                <div class="scam-card">
                  <h4 class="scam-title">⚠️ ${escapeHtml(s.titleKo)}</h4>
                  <p class="scam-warning">${escapeHtml(s.warningText)}</p>
                  <p class="scam-action">💡 <strong>대처법:</strong> ${escapeHtml(s.actionRule)}</p>
                </div>
              `).join('')}
            </div>
          </div>`;
  }

  function guideIntercityBusHTML(intercityBuses) {
    return `
          <!-- Intercity Bus Guide (Dalat & Mui Ne) -->
          <div class="guide-block-spacer">
            <h3 class="guide-subsection-title">
              🚌 근교 도시 시외버스 & 리무진 가이드 (달랏 & 무이네)
            </h3>
            <div class="intercity-bus-grid">
              ${intercityBuses.map(b => `
                <div class="intercity-bus-card">
                  <div class="intercity-bus-header-row">
                    <h4 class="intercity-bus-destination">📍 ${escapeHtml(b.destination)}</h4>
                    <span class="label">${b.distanceKm}km (${escapeHtml(b.duration)})</span>
                  </div>
                  <p class="intercity-bus-route-feature">${escapeHtml(b.routeFeature)}</p>
                  <div class="intercity-bus-operators-box">
                    <strong class="intercity-bus-operators-label">주요 운행사 & 요금:</strong>
                    <ul class="intercity-bus-operators-list">
                      ${b.majorOperators.map(op => `
                        <li><strong>${escapeHtml(op.name)}:</strong> ${escapeHtml(op.type)} — <span class="souv-price-mart">${op.fareVnd.toLocaleString()}동</span> (약 ${op.fareKrw.toLocaleString()}원)</li>
                      `).join('')}
                    </ul>
                  </div>
                  <div class="intercity-bus-tip">
                    💡 ${escapeHtml(b.tips)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>`;
  }

  function guideMotorbikeRentalHTML(motorbikeRental) {
    return `
          <!-- Motorbike Rental Guide -->
          <div class="motorbike-guide-box">
            <h4 class="motorbike-guide-title">
              🛵 오토바이(스쿠터) 렌트 수칙 & 안전 가이드
            </h4>
            <div class="motorbike-guide-grid">
              <div><strong>💰 1일 렌트비:</strong> ${escapeHtml(motorbikeRental.pricePerDayVnd)}</div>
              <div><strong>🛵 인기 기종:</strong> ${escapeHtml(motorbikeRental.popularModels)}</div>
              <div><strong>📑 보증금 원칙:</strong> ${escapeHtml(motorbikeRental.depositRules)}</div>
              <div><strong>🪖 면허 및 법규:</strong> ${escapeHtml(motorbikeRental.legalRequirements)}</div>
              <div><strong>⛽ 주유 팁:</strong> ${escapeHtml(motorbikeRental.fuelType)}</div>
              <div><strong>🛡️ 안전 수칙:</strong> ${escapeHtml(motorbikeRental.safetyTip)}</div>
            </div>
          </div>`;
  }

  /** 교통·그랩 가이드 섹션 (공항 이동, 택시 앱 비교, 근교 버스, 안전 수칙). */
  function guideTransportHTML(transport) {
    return `
        <section class="guide-section-block" id="transportGuidePanel">
          <div class="guide-section-header">
            <h2 class="guide-section-title">🚗 깜란공항 & 나트랑 시내 교통 완벽 가이드</h2>
            <p class="guide-section-desc">공항 이동 요금표, 전기차 Xanh SM vs 그랩 vs 일반 택시 비교, 5대 사기 예방법</p>
          </div>
${guideAirportTableHTML(transport.airportMatrix)}
${guideTaxiCompareHTML(transport.taxiComparison)}
${guideScamPreventionHTML(transport.scamPrevention)}
${guideIntercityBusHTML(transport.intercityBuses)}
${guideMotorbikeRentalHTML(transport.motorbikeRental)}
        </section>
      `;
  }

  /** 30개 기념품 시세표 비교 테이블 HTML 생성 */
  function guideSouvenirsTableHTML(souvenirs) {
    return `<!-- 30 Souvenir Items Comparison Table -->
          <div class="souvenirs-matrix-wrap">
            <table class="souvenirs-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>품목명 (한국어 / 베트남어)</th>
                  <th>분류</th>
                  <th>규격/용량</th>
                  <th>롯데마트 정찰가</th>
                  <th>시장 목표 흥정가</th>
                  <th>흥정 할인율</th>
                  <th>정품 vs 짝퉁 구별 팁</th>
                  <th>세관 통관</th>
                </tr>
              </thead>
              <tbody>
                ${souvenirs.map((item, idx) => {
                  const martKrw = formatKRW(item.officialPriceVnd);
                  const marketKrw = formatKRW(item.marketBargainPriceVnd);
                  return `
                    <tr>
                      <td class="souv-index-cell">${idx + 1}</td>
                      <td>
                        <div class="souv-name-ko">${escapeHtml(item.nameKo)}</div>
                        <div class="souv-name-vi">${escapeHtml(item.nameVi)}</div>
                        <div class="souv-description">${escapeHtml(item.description)}</div>
                      </td>
                      <td><span class="mini-tag">${escapeHtml(item.category)}</span></td>
                      <td><span class="label">${escapeHtml(item.unit)}</span></td>
                      <td>
                        <div class="souv-price-mart">${item.officialPriceVnd.toLocaleString()}동</div>
                        <div class="souv-price-krw">${martKrw}</div>
                      </td>
                      <td>
                        <div class="souv-price-market">${item.marketBargainPriceVnd.toLocaleString()}동</div>
                        <div class="souv-price-krw">${marketKrw}</div>
                      </td>
                      <td>
                        <span class="souv-discount-badge">-${item.targetDiscountPercent}%</span>
                      </td>
                      <td class="souv-tip-cell">
                        💡 ${escapeHtml(item.originalVsFakeTip)}
                      </td>
                      <td>
                        <span class="souv-customs-badge ${item.customsAllowed ? 'customs-allowed' : 'customs-restricted'}">
                          ${item.customsAllowed ? '✓ 반입가능' : '⚠️ 검역주의'}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>`;
  }

  /** 시장 흥정 팁 콜아웃 박스 HTML 생성 */
  function guideBargainingTipsHTML(bargainingTips) {
    return `<!-- Bargaining Tips Callout Box -->
          <div class="bargaining-guide-box">
            <h3 class="guide-callout-title guide-callout-title-warn">
              🏷️ ${escapeHtml(bargainingTips.marketName)} 실전 5단계 흥정 전략
            </h3>
            <ul class="bargaining-tips-list">
              ${bargainingTips.coreStrategy.map(st => `
                <li>${escapeHtml(st)}</li>
              `).join('')}
            </ul>
          </div>`;
  }

  /** 세관 및 농림축산검역 안내 박스 HTML 생성 */
  function guideCustomsQuarantineHTML(customsQuarantine) {
    return `<!-- Customs Quarantine Guide Box -->
          <div class="customs-guide-box">
            <h3 class="guide-callout-title guide-callout-title-info">
              ✈️ 대한민국 관세청 면세 한도 & 농림축산검역본부 반입 규정
            </h3>
            <div class="customs-info-grid">
              <div class="customs-info-card customs-info-card-info">
                <strong class="customs-info-label-info">💵 1인 면세 한도:</strong>
                <ul class="customs-info-list">
                  <li>기본 면세: 미화 <strong>${escapeHtml(customsQuarantine.dutyFreeAllowance.basicAllowanceUsd)}</strong></li>
                  <li>주류: ${escapeHtml(customsQuarantine.dutyFreeAllowance.alcoholLimit)}</li>
                  <li>담배: ${escapeHtml(customsQuarantine.dutyFreeAllowance.tobaccoLimit)}</li>
                  <li>향수: ${escapeHtml(customsQuarantine.dutyFreeAllowance.perfumeLimit)}</li>
                </ul>
              </div>
              <div class="customs-info-card customs-info-card-danger">
                <strong class="customs-info-label-danger">🚫 반입 전면 금지 (검역 과태료):</strong>
                <ul class="customs-info-list customs-info-list-danger">
                  ${customsQuarantine.prohibitedItems.map(p => `
                    <li>${escapeHtml(p)}</li>
                  `).join('')}
                </ul>
              </div>
              <div class="customs-info-card customs-info-card-success">
                <strong class="customs-info-label-success">✅ 반입 가능 품목:</strong>
                <ul class="customs-info-list customs-info-list-success">
                  ${customsQuarantine.permittedItems.map(p => `
                    <li>${escapeHtml(p)}</li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>`;
  }

  /** 롯데마트 기념품 시세표 섹션. 정찰가/시장 흥정가와 원화 환산을 나란히 둔다. */
  function guideSouvenirMatrixHTML(matrix, souvenirs) {
    return `
        <section class="guide-section-block" id="souvenirsGuidePanel">
          <div class="guide-section-header">
            <div class="guide-header-flex-row">
              <div>
                <h2 class="guide-section-title">🛒 롯데마트 Top 30 쇼핑 시세표</h2>
                <p class="guide-section-desc">정찰제 마트 공식가 vs 담시장·야시장 흥정 목표가 & 정품 구별법 (총 30개 품목)</p>
              </div>
              <span class="mini-tag mini-tag-info">
                검색 일치: ${souvenirs.length}개 품목
              </span>
            </div>
          </div>

          ${guideSouvenirsTableHTML(souvenirs)}

          ${guideBargainingTipsHTML(matrix.bargainingTips)}

          ${guideCustomsQuarantineHTML(matrix.customsQuarantine)}
        </section>
      `;
  }

  /** 응급·24시 약국 섹션 (상비약, 24시 병원, 보험 청구). */
  function guideEmergencyHTML(emergency, meds) {
    return `
        <section class="guide-section-block" id="emergencyGuidePanel">
          <div class="guide-section-header">
            <h2 class="guide-section-title">💊 응급 상비약 & 24시 국제병원 가이드</h2>
            <p class="guide-section-desc">베트남 약국 핵심 10대 상비약, 빈멕·VK 국제병원 24시 핫라인, 해외 여행자보험 5대 청구 서류</p>
          </div>

          <!-- 10 Key Travel Remedies Grid -->
          <div>
            <h3 class="guide-block-title">
              🏥 현지 약국 즉시 구매 가능 10대 핵심 상비약
            </h3>
            <div class="meds-grid">
              ${meds.map(m => `
                <div class="med-card">
                  <div class="med-header">
                    <div>
                      <h4 class="med-name">${escapeHtml(m.brandName)}</h4>
                      <div class="med-ingredient">${escapeHtml(m.activeIngredient)}</div>
                    </div>
                    <span class="med-symptom-tag">${escapeHtml(m.category)}</span>
                  </div>
                  <div class="med-symptom-line">
                    🎯 증상: ${escapeHtml(m.symptom)}
                  </div>
                  <div class="med-dosage">
                    <strong>복용법:</strong> ${escapeHtml(m.dosageKo)}
                  </div>
                  <div class="med-box-tip">
                    📦 ${escapeHtml(m.boxPhotoTip)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 24h International Hospitals -->
          <div class="guide-block-spacer-lg">
            <h3 class="guide-block-title">
              🚨 나트랑 24시 국제 응급 종합병원
            </h3>
            <div class="hospitals-grid">
              ${emergency.hospitals.map(h => `
                <div class="hospital-card">
                  <div>
                    <h4 class="hospital-name-ko">${escapeHtml(h.nameKo)}</h4>
                    <p class="hospital-name-vi">${escapeHtml(h.nameVi)}</p>
                    <p class="hospital-address">📍 ${escapeHtml(h.addressVi)}</p>
                  </div>
                  <div class="hospital-hotline-box">
                    <a href="${escapeHtml(sanitizeUrl('tel:' + h.hotline.replace(/\s+/g, '')))}" class="hospital-hotline-btn">
                      <span>📞 진료 예약/문의: ${escapeHtml(h.hotline)}</span>
                    </a>
                    <a href="${escapeHtml(sanitizeUrl('tel:' + h.emergency24h.replace(/\s+/g, '')))}" class="hospital-hotline-btn hospital-hotline-btn-emergency">
                      <span>🚨 24시 응급실: ${escapeHtml(h.emergency24h)}</span>
                    </a>
                    <a href="${escapeHtml(sanitizeUrl(h.googleMapUrl))}" target="_blank" rel="noopener noreferrer" class="btn-secondary hospital-directions-link">
                      <span>🗺️ 구글 지도 길찾기</span>
                    </a>
                  </div>
                  <ul class="hospital-features-list">
                    ${h.features.map(f => `
                      <li>${escapeHtml(f)}</li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Insurance Claim 5-Step Guide -->
          <div class="insurance-guide-box">
            <h3 class="insurance-guide-title">
              📑 ${escapeHtml(emergency.insuranceGuide.title)}
            </h3>
            <div>
              ${emergency.insuranceGuide.steps.map(st => `
                <div class="insurance-step-item">
                  <div class="insurance-step-no">${escapeHtml(st.stepNo)}</div>
                  <div>
                    <div class="insurance-step-title">${escapeHtml(st.nameKo)}</div>
                    <div class="insurance-step-desc">${escapeHtml(st.desc)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
  }

  /** 원터치 생존 베트남어 플래시카드 섹션. */
  function guideFlashcardsHTML(flashcards, cat) {
    return `
        <section class="guide-section-block" id="flashcardsGuidePanel">
          <div class="guide-section-header">
            <div class="guide-header-flex-row">
              <div>
                <h2 class="guide-section-title">🗣️ 원터치 생존 베트남어 (21종 소통 카드)</h2>
                <p class="guide-section-desc">식당·카페, 택시·그랩, 쇼핑·시장, 응급·호텔 상황별 원클릭 대화 카드 (클릭 시 전면 확대 & 텍스트 복사)</p>
              </div>
              <span class="mini-tag mini-tag-primary">
                카드 ${flashcards.length}개 표시
              </span>
            </div>
          </div>

          <!-- Flashcards Responsive Grid -->
          <div class="flashcards-grid">
            ${flashcards.map(fc => `
              <div class="flashcard-card" data-fc-id="${escapeHtml(fc.id)}">
                <div class="flashcard-card-top">
                  <span class="flashcard-card-icon">${escapeHtml(fc.icon || '🗣️')}</span>
                  <span class="flashcard-card-cat">${escapeHtml(fc.categoryLabel)}</span>
                </div>
                <h3 class="flashcard-card-ko">${escapeHtml(fc.ko)}</h3>
                <div class="flashcard-card-vi">${escapeHtml(fc.vi)}</div>
                <div class="flashcard-card-pron">${escapeHtml(fc.pronunciation)}</div>
                <div class="flashcard-card-purpose">🎯 ${escapeHtml(fc.purpose)}</div>
                <div class="flashcard-card-actions">
                  <button type="button" class="btn-flashcard-zoom" data-fc-zoom="${escapeHtml(fc.id)}">
                    <span>🔍 크게 보기</span>
                  </button>
                  <button type="button" class="btn-flashcard-card-copy" data-fc-copy="${escapeHtml(fc.vi)}">
                    <span>📋 복사</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
  }

  function renderGuide() {
    const container = document.getElementById('guideCardsGridContainer');
    if (!container) return;
    if (typeof NHA_TRANG_GUIDE_HUB === 'undefined') {
      container.innerHTML = '<div class="empty-state">가이드 데이터를 불러오는 중입니다...</div>';
      return;
    }

    const { transport, shoppingPriceMatrix, emergencyPharmacy } = NHA_TRANG_GUIDE_HUB;
    const cat = state.guideCategory;
    const showAll = cat === 'all';
    const showTransport = showAll || cat === 'transport';
    const showShopping = showAll || cat === 'shopping';
    const showEmergency = showAll || cat === 'emergency';
    const showFlashcards = showAll || cat === 'flashcards';

    const filteredSouvenirs = getFilteredSouvenirs();
    const filteredMeds = getFilteredPharmacyMeds();
    const filteredFlashcards = getFilteredFlashcards();

    let html = '';

    // Transport & Grab Guide Section
    if (showTransport) html += guideTransportHTML(transport);

    // Lotte Mart Top 30 Souvenir Price Matrix Section
    if (showShopping) html += guideSouvenirMatrixHTML(shoppingPriceMatrix, filteredSouvenirs);

    // Emergency & 24h Pharmacy Guide Section
    if (showEmergency) html += guideEmergencyHTML(emergencyPharmacy, filteredMeds);

    // One-Touch Vietnamese Flashcards Section
    if (showFlashcards) html += guideFlashcardsHTML(filteredFlashcards, cat);

    container.innerHTML = html;

    // Bind flashcard click & zoom events
    container.querySelectorAll('[data-fc-id]').forEach(cardEl => {
      cardEl.addEventListener('click', (e) => {
        if (e.target.closest('[data-fc-copy]')) return;
        const fcId = cardEl.dataset.fcId;
        const fc = NHA_TRANG_GUIDE_HUB.flashcards.find(f => f.id === fcId);
        if (fc) openFlashcardModal(fc);
      });
    });

    container.querySelectorAll('[data-fc-copy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.fcCopy;
        if (text) {
          const notifySuccess = () => {
            showToast(`📋 베트남어가 복사되었습니다: "${text}"`);
            const span = btn.querySelector('span') || btn;
            const origText = span.textContent;
            span.textContent = '✓ 복사 완료!';
            setTimeout(() => { span.textContent = origText; }, 2000);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(notifySuccess).catch(() => {
              fallbackCopy(text, notifySuccess);
            });
          } else {
            fallbackCopy(text, notifySuccess);
          }
        }
      });
    });
  }

  function openFlashcardModal(fc) {
    if (!fc) return;
    state.activeModalFlashcard = fc;

    const iconEl = document.getElementById('flashcardModalIcon');
    const catEl = document.getElementById('flashcardModalCategory');
    const koEl = document.getElementById('flashcardModalKo');
    const viEl = document.getElementById('flashcardModalVi');
    const pronEl = document.getElementById('flashcardModalPron');
    const purposeEl = document.getElementById('flashcardModalPurpose');
    const copyBtn = document.getElementById('flashcardCopyBtn');
    const closeBtn2 = document.getElementById('flashcardModalCloseBtn2');

    if (iconEl) iconEl.textContent = fc.icon || '🗣️';
    if (catEl) catEl.textContent = fc.categoryLabel || '생존 베트남어';
    if (koEl) koEl.textContent = fc.ko;
    if (viEl) viEl.textContent = fc.fullscreenText || fc.vi;
    if (pronEl) pronEl.textContent = fc.pronunciation;
    if (purposeEl) purposeEl.textContent = fc.purpose;

    if (copyBtn) {
      copyBtn.onclick = () => {
        const textToCopy = fc.vi;
        const notifySuccess = () => {
          showToast(`📋 복사완료: "${textToCopy}"`);
          const span = copyBtn.querySelector('span') || copyBtn;
          const origText = span.textContent;
          span.textContent = '✓ 복사 완료!';
          setTimeout(() => { span.textContent = origText; }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(notifySuccess).catch(() => {
            fallbackCopy(textToCopy, notifySuccess);
          });
        } else {
          fallbackCopy(textToCopy, notifySuccess);
        }
      };
    }

    if (closeBtn2) {
      closeBtn2.onclick = () => closeFlashcardModal();
    }

    const modalEl = document.getElementById('flashcardModal');
    if (modalEl) {
      modalEl.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeFlashcardModal() { closeDomainModal('guide'); }

