/* Shared touch and compact-screen behavior. No user-agent sniffing. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const compact = matchMedia('(max-width: 760px), (max-width: 1000px) and (pointer: coarse)');
  const stage = $('#stage'), side = $('#scene-side'), canvas = $('#canvas3d');
  const home = document.createComment('Desktop component panel');
  side.before(home);
  const sheet = document.createElement('dialog');
  sheet.className = 'component-sheet';
  sheet.setAttribute('aria-labelledby', 'sheet-title');
  sheet.innerHTML = '<div class="sheet-heading"><span id="sheet-title">部件解說</span><button type="button" id="close-sheet" autofocus aria-label="關閉部件解說">關閉 ×</button></div>';
  document.body.append(sheet);
  const supportsSheet = typeof sheet.showModal === 'function';
  const card = document.createElement('button');
  card.className = 'mobile-component-card';
  card.type = 'button';
  card.setAttribute('aria-haspopup', 'dialog');
  card.setAttribute('aria-controls', 'component-sheet');
  sheet.id = 'component-sheet';
  $('#scene-key').after(card);
  const mode = document.createElement('button');
  mode.type = 'button';
  mode.id = 'touch-mode';
  mode.className = 'touch-mode';
  mode.setAttribute('aria-controls', 'canvas3d');
  stage.before(mode);
  let touchActive = false, savedY = 0, opener = null;
  function syncCard() {
    const title = side.querySelector('h2,h3')?.textContent || '部件解說';
    card.textContent = title + ' · 查看解說 ↑';
    $('#sheet-title').textContent = title;
  }
  function setTouch(value) {
    touchActive = compact.matches && value;
    window.mobile3DLocked = compact.matches && !touchActive;
    document.documentElement.classList.toggle('touch-3d-active', touchActive);
    mode.textContent = touchActive ? '完成操作 · 恢復滑頁' : '操作 3D · 旋轉與縮放';
    mode.setAttribute('aria-pressed', String(touchActive));
    const hint = $('.scene-hint');
    if (compact.matches) hint.textContent = touchActive ? '單指旋轉 · 雙指縮放 · 點部件看解說' : '上下滑動閱讀 · 下方按鈕可直接選部件';
    else hint.textContent = '拖曳旋轉 · 滾輪／雙指縮放 · 點選部件';
    window.dispatchEvent(new CustomEvent('touchmodechange'));
  }
  function closeSheet() {
    if (!sheet.open) return;
    // Unlock before the native close event, so links can scroll immediately.
    document.body.classList.remove('sheet-open');
    document.body.style.removeProperty('top');
    window.scrollTo({top: savedY, behavior: 'instant'});
    sheet.close();
    if (opener?.isConnected) opener.focus({preventScroll: true});
  }
  function openSheet() {
    if (!window.mobileExperience || sheet.open) return;
    syncCard();
    savedY = window.scrollY;
    opener = document.activeElement;
    sheet.showModal();
    sheet.scrollTop = 0;
    document.body.style.top = -savedY + 'px';
    document.body.classList.add('sheet-open');
  }
  function syncLayout() {
    closeSheet();
    window.mobileExperience = compact.matches && supportsSheet;
    document.documentElement.classList.toggle('compact-experience', compact.matches);
    document.documentElement.classList.toggle('has-component-sheet', window.mobileExperience);
    if (window.mobileExperience) sheet.append(side);
    else home.after(side);
    setTouch(false);
    syncCard();
  }
  mode.addEventListener('click', () => setTouch(!touchActive));
  card.addEventListener('click', openSheet);
  $('#close-sheet').addEventListener('click', closeSheet);
  sheet.addEventListener('cancel', e => {e.preventDefault(); closeSheet();});
  sheet.addEventListener('click', e => {
    const r = sheet.getBoundingClientRect();
    if (e.target === sheet && (e.clientY < r.top || e.clientY > r.bottom || e.clientX < r.left || e.clientX > r.right)) closeSheet();
  });
  document.addEventListener('click', e => {
    if (sheet.open && e.target.closest('[data-term], [data-scene]')) closeSheet();
    // Keep selected controls visible in their own horizontal strip, without moving the page.
    const b = e.target.closest('.scene-nav button, #categories button');
    if (compact.matches && b) {
      const p = b.parentElement;
      p.scrollTo({left: b.offsetLeft - p.offsetLeft - 12, behavior: 'auto'});
    }
  }, true);
  window.addEventListener('partselect', syncCard);
  window.addEventListener('partopen', openSheet);
  window.addEventListener('scenechange', syncCard);
  compact.addEventListener('change', syncLayout);
  // End immersive touch mode on leaving the model, so returning allows normal scrolling.
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting && touchActive) setTouch(false);
  }).observe(stage);
  syncLayout();

  const dictionary = $('#dictionary') || $('#explore');
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'mobile-dictionary-back';
  back.textContent = '↑ 返回名詞選單';
  $('#detail').before(back);
  back.addEventListener('click', () => {
    dictionary.scrollIntoView({block:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  // Small result preview stays in view while editing assumptions on a narrow screen.
  const simulator = $('.simulator');
  if (simulator) {
    const summary = document.createElement('div');
    summary.className = 'mobile-sim-summary';
    summary.setAttribute('aria-label', '成本試算即時摘要（教學假設）');
    summary.innerHTML = '<span>教學假設 · 元</span><div><span>每片可歸存貨<strong id="mobile-inventory"></strong></span><span>每顆良品經濟成本<strong id="mobile-die"></strong></span></div>';
    simulator.prepend(summary);
    function syncPreview() {
      $('#mobile-inventory').textContent = $('#inventory-cost').textContent;
      $('#mobile-die').textContent = $('#die-cost').textContent;
    }
    ['volume', 'yield', 'fixed', 'variable'].forEach(id => {
      const range = $('#' + id);
      const line = document.createElement('div');
      line.className = 'mobile-number-entry';
      const input = document.createElement('input');
      input.type = 'number'; input.inputMode = 'numeric';
      input.min = range.min; input.max = range.max; input.step = range.step;
      input.value = range.value; input.id = id + '-number';
      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.textContent = ({volume:'輸入片數',yield:'輸入良率 %',fixed:'輸入百萬元',variable:'輸入元／片'})[id];
      line.append(label, input); range.after(line);
      input.addEventListener('change', () => {
        if (input.value !== '' && Number.isFinite(input.valueAsNumber)) {
          range.value = String(input.valueAsNumber);
          range.dispatchEvent(new Event('input', {bubbles:true}));
        }
        input.value = range.value;
      });
      range.addEventListener('input', () => {input.value = range.value; syncPreview();});
      $('#reset-sim').addEventListener('click', () => {input.value = range.value; syncPreview();});
    });
    syncPreview();
  }
})();
