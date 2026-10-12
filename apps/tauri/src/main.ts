import './styles.css';

interface DataItem {
  id: number;
  title: string;
  subtitle: string;
  score: number;
  colors: string[];
  body: string;
}

let items: DataItem[] = [];
let appContainer: HTMLElement;

let isDark = false;

let currentItem: DataItem | null = null;

async function loadData() {
  const mod = await import('./data.json');
  items = mod.items;
}

function createPage1(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page';
  container.id = 'page1';

  const appBar = document.createElement('div');
  appBar.className = 'app-bar';
  appBar.innerHTML = `
    <div class="title">Pulse</div>
    <button id="theme-toggle" class="icon-button" aria-label="Toggle Theme" data-testid="theme-toggle">
      <svg id="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/>
      </svg>
    </button>
  `;
  container.appendChild(appBar);

  const content = document.createElement('div');
  content.className = 'page-content';
  content.innerHTML += `
    <div class="hero-card" id="hero-card">
      <div class="title" style="color: white; text-align: center;">Same app.<br>Every framework.</div>
      <canvas id="orbit" width="120" height="120" style="position: absolute;"></canvas>
    </div>

    <div class="counter-row">
      <div class="counter-text">
        <div class="label">Taps</div>
        <div class="display counter-value" id="counter-val">0</div>
      </div>
      <button id="counter-inc" class="fab" aria-label="Increment" data-testid="counter-inc">+</button>
    </div>

    <div class="controls-card">
      <div class="control-row">
        <div class="body">Notifications</div>
        <label class="switch">
          <input type="checkbox" id="switch" data-testid="switch">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="control-row-col">
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div class="body">Intensity</div>
          <div class="label" id="slider-val">50</div>
        </div>
        <input type="range" id="slider" min="0" max="100" value="50" data-testid="slider">
      </div>
      <div class="chips-row">
        <button id="chip-low" class="chip" data-testid="chip-low">Low</button>
        <button id="chip-medium" class="chip selected" data-testid="chip-medium">Medium</button>
        <button id="chip-high" class="chip" data-testid="chip-high">High</button>
      </div>
    </div>

    <div class="input-container">
      <input type="text" id="name-input" placeholder=" " data-testid="name-input">
      <label for="name-input" class="float-label">Your name</label>
      <div class="greeting label" id="greeting"></div>
    </div>

    <div class="list-container">
      ${items.map((item, index) => `
        <div class="list-item" id="item-${item.id}" data-testid="item-${item.id}" style="animation-delay: ${index * 50}ms">
          <div class="thumb" id="thumb-${item.id}" style="background: linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})"></div>
          <div class="item-text" id="item-text-${item.id}">
            <div class="title" style="font-size: 16px;">${item.title}</div>
            <div class="body" style="font-size: 14px; color: var(--text-med);">${item.subtitle}</div>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--outline)"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </div>
      `).join('')}
    </div>
  `;
  container.appendChild(content);

  setTimeout(() => setupPage1Events(container), 0);
  return container;
}

let counter = 0;

function setupPage1Events(container: HTMLElement) {
  const themeToggle = container.querySelector('#theme-toggle') as HTMLElement;
  themeToggle?.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.style.transform = 'rotate(180deg)';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.style.transform = 'rotate(0deg)';
    }
    themeToggle.style.transition = 'transform var(--slow)';
  });

  const appBar = container.querySelector('.app-bar') as HTMLElement;
  container.addEventListener('scroll', () => {
    if (container.scrollTop > 0) {
      appBar.classList.add('scrolled');
    } else {
      appBar.classList.remove('scrolled');
    }
  });

  const counterBtn = container.querySelector('#counter-inc') as HTMLElement;
  const counterVal = container.querySelector('#counter-val') as HTMLElement;
  let resetTimeout: any;

  counterBtn?.addEventListener('pointerdown', (e) => {
    counterBtn.style.transform = 'scale(0.96)';
    (e.currentTarget as any)._pressTime = performance.now();
    resetTimeout = setTimeout(() => {
      counter = 0;
      updateCounterVal(counterVal, 0, true);
      counterVal.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' }
      ], { duration: 300 });
    }, 500);
  });

  counterBtn?.addEventListener('pointerup', () => {
    clearTimeout(resetTimeout);
    counterBtn.style.transform = 'scale(1)';
    if (performance.now() - (counterBtn as any)._pressTime < 500) {
      counter++;
      updateCounterVal(counterVal, counter);
    }
  });

  counterBtn?.addEventListener('pointerleave', () => {
    clearTimeout(resetTimeout);
    counterBtn.style.transform = 'scale(1)';
  });

  const slider = container.querySelector('#slider') as HTMLInputElement;
  const sliderVal = container.querySelector('#slider-val');
  slider?.addEventListener('input', () => {
    if (sliderVal) sliderVal.innerHTML = slider.value;
  });

  const chips = container.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  const nameInput = container.querySelector('#name-input') as HTMLInputElement;
  const greeting = container.querySelector('#greeting') as HTMLElement;
  nameInput?.addEventListener('input', () => {
    if (greeting) {
      if (nameInput.value) {
        greeting.innerHTML = `Hello, ${nameInput.value}`;
        greeting.style.opacity = '1';
      } else {
        greeting.style.opacity = '0';
      }
    }
  });

  items.forEach(item => {
    const el = container.querySelector(`#item-${item.id}`) as HTMLElement;
    el?.addEventListener('click', () => {
      navigateToDetail(item, el);
    });
  });

  startOrbit(container.querySelector('#orbit') as HTMLCanvasElement);
}

function updateCounterVal(el: HTMLElement, val: number, isReset = false) {
  if (isReset) {
    el.innerHTML = '0';
    return;
  }

  const newEl = el.cloneNode(true) as HTMLElement;
  newEl.innerHTML = val.toString();
  newEl.style.position = 'absolute';
  newEl.style.transform = 'translateY(100%)';
  newEl.style.opacity = '0';

  el.parentElement?.appendChild(newEl);

  el.animate([
    { transform: 'translateY(0)', opacity: 1 },
    { transform: 'translateY(-100%)', opacity: 0 }
  ], { duration: 300, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }).onfinish = () => el.remove();

  const a = newEl.animate([
    { transform: 'translateY(100%)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ], { duration: 300, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });

  a.onfinish = () => {
    newEl.style.position = 'static';
    newEl.style.transform = 'none';
    newEl.className = 'display counter-value';
    newEl.id = 'counter-val';
  };
}

function startOrbit(canvas: HTMLCanvasElement) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let start = performance.now();
  function draw(time: number) {
    if (!ctx) return;
    const progress = ((time - start) % 3000) / 3000;

    ctx.clearRect(0, 0, 120, 120);
    ctx.beginPath();
    ctx.arc(60, 60, 40, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < 3; i++) {
      const angle = (progress * 2 * Math.PI) + (i * 2 * Math.PI / 3);
      const x = 60 + 40 * Math.cos(angle);
      const y = 60 + 40 * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// Page 2

function createPage2(item: DataItem): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page';
  container.id = 'page2';
  container.style.zIndex = '20';

  container.innerHTML = `
    <div class="header" id="detail-header">
      <div class="header-bg" style="background: linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})" id="header-bg"></div>
      <div class="app-bar" style="background: transparent; position: absolute; width: 100%; top: 0; box-shadow: none;">
        <button id="back" class="icon-button" style="color: white;" data-testid="back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <div class="title" id="header-title" style="color: white; opacity: 0;">${item.title}</div>
        <div style="width: 44px;"></div>
      </div>
      <div class="header-content" id="header-content">
        <div class="display" style="color: white;">${item.title}</div>
      </div>
    </div>

    <div class="page-content" style="padding-top: 24px;">
      <div style="display: flex; justify-content: center;">
        <div style="position: relative; width: 120px; height: 120px;">
          <canvas id="ring" width="120" height="120" data-testid="ring"></canvas>
          <div id="ring-score" class="title" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">0%</div>
        </div>
      </div>

      <div class="accordion-card">
        <div class="accordion-header" id="accordion" data-testid="accordion">
          <div class="title" style="font-size: 16px;">Details</div>
          <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="var(--outline)"><path d="M12 15.5l-6-6 1.41-1.41L12 12.67l4.59-4.58L18 9.5z"/></svg>
        </div>
        <div class="accordion-body">
          <div class="shimmer" id="shimmer" data-testid="shimmer">
            <div class="shimmer-line"></div>
            <div class="shimmer-line"></div>
            <div class="shimmer-line" style="width: 60%;"></div>
          </div>
          <div class="body" id="detail-body" style="opacity: 0; display: none;">${item.body}</div>
        </div>
      </div>

      <div class="drag-area">
        <div class="drag-card" id="drag-card" data-testid="drag-card">Drag me</div>
      </div>

      <div class="swipe-list" id="swipe-list">
        <div class="swipe-item-container" data-testid="swipe-1">
          <div class="swipe-bg"><svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></div>
          <div class="swipe-item">Item 1</div>
        </div>
        <div class="swipe-item-container" data-testid="swipe-2">
          <div class="swipe-bg"><svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></div>
          <div class="swipe-item">Item 2</div>
        </div>
        <div class="swipe-item-container" data-testid="swipe-3">
          <div class="swipe-bg"><svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></div>
          <div class="swipe-item">Item 3</div>
        </div>
      </div>
      <button class="label" id="swipe-reset" data-testid="swipe-reset" style="color: var(--primary); align-self: flex-start; padding: 8px 0; display: none;">Reset</button>

      <div style="display: flex; gap: 16px; margin-top: 16px;">
        <button class="btn" id="btn-dialog" data-testid="btn-dialog">Show dialog</button>
        <button class="btn" id="btn-sheet" data-testid="btn-sheet">Show sheet</button>
        <button class="btn" id="btn-toast" data-testid="btn-toast">Toast</button>
      </div>
    </div>
  `;

  setTimeout(() => setupPage2Events(container, item), 0);
  return container;
}

function setupPage2Events(container: HTMLElement, item: DataItem) {
  // Back
  container.querySelector('#back')?.addEventListener('click', navigateBack);

  // Parallax Header

  const headerBg = container.querySelector('#header-bg') as HTMLElement;
  const headerTitle = container.querySelector('#header-title') as HTMLElement;
  const headerContent = container.querySelector('#header-content') as HTMLElement;

  container.addEventListener('scroll', () => {
    const y = container.scrollTop;
    if (y < 0) return;
    const maxScroll = 240 - 56;
    const p = Math.min(y / maxScroll, 1);

    headerBg.style.transform = `translateY(${y * 0.5}px)`;
    headerContent.style.opacity = (1 - p).toString();
    headerContent.style.transform = `translateY(${y * 0.5}px) scale(${1 - p * 0.3})`;
    headerTitle.style.opacity = p.toString();
  });

  // Ring
  const canvas = container.querySelector('#ring') as HTMLCanvasElement;
  const scoreEl = container.querySelector('#ring-score') as HTMLElement;
  let ringStart: number | null = null;
  let ringAnimFrame: number;

  function drawRing(time: number) {
    if (!ringStart) ringStart = time;
    const elapsed = time - ringStart;
    const duration = 500;
    let p = Math.min(elapsed / duration, 1);
    // slow curve
    p = 1 - Math.pow(1 - p, 3);

    const currentScore = Math.floor(p * item.score);
    scoreEl.innerHTML = `${currentScore}%`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 120, 120);
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';

      // bg
      ctx.beginPath();
      ctx.arc(60, 60, 54, 0, 2 * Math.PI);
      ctx.strokeStyle = 'var(--surface-alt)';
      ctx.stroke();

      // fg
      ctx.beginPath();
      ctx.arc(60, 60, 54, -Math.PI/2, -Math.PI/2 + (currentScore/100) * 2 * Math.PI);
      ctx.strokeStyle = item.colors[0];
      ctx.stroke();
    }

    if (p < 1) ringAnimFrame = requestAnimationFrame(drawRing);
  }
  ringAnimFrame = requestAnimationFrame(drawRing);

  canvas.addEventListener('click', () => {
    cancelAnimationFrame(ringAnimFrame);
    ringStart = null;
    ringAnimFrame = requestAnimationFrame(drawRing);
  });

  // Accordion
  const accordion = container.querySelector('#accordion') as HTMLElement;
  const accordionBody = container.querySelector('.accordion-body') as HTMLElement;
  const chevron = container.querySelector('.chevron') as HTMLElement;
  let expanded = false;

  accordion.addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
      chevron.style.transform = 'rotate(180deg)';
      accordionBody.style.maxHeight = '200px';
    } else {
      chevron.style.transform = 'rotate(0)';
      accordionBody.style.maxHeight = '0';
    }
  });

  // Shimmer -> Body
  const shimmer = container.querySelector('#shimmer') as HTMLElement;
  const detailBody = container.querySelector('#detail-body') as HTMLElement;
  setTimeout(() => {
    shimmer.style.opacity = '0';
    setTimeout(() => {
      shimmer.style.display = 'none';
      detailBody.style.display = 'block';
      requestAnimationFrame(() => detailBody.style.opacity = '1');
    }, 300);
  }, 1500);

  // Drag Card
  const dragCard = container.querySelector('#drag-card') as HTMLElement;
  let isDragging = false;
  let startX = 0, startY = 0;
  let tx = 0, ty = 0;

  dragCard.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX - tx;
    startY = e.clientY - ty;
    dragCard.style.transition = 'none';
    dragCard.setPointerCapture(e.pointerId);
  });
  dragCard.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    tx = e.clientX - startX;
    ty = e.clientY - startY;

    // Bounds check within 240x240 play area
    const max = 72; // (240 - 96) / 2
    tx = Math.max(-max, Math.min(max, tx));
    ty = Math.max(-max, Math.min(max, ty));

    dragCard.style.transform = `translate(${tx}px, ${ty}px)`;
  });
  function release() {
    isDragging = false;
    tx = 0; ty = 0;
    dragCard.style.transition = 'transform var(--spring)';
    dragCard.style.transform = 'translate(0, 0)';
  }
  dragCard.addEventListener('pointerup', release);
  dragCard.addEventListener('pointercancel', release);

  // Swipe
  const swipeItems = container.querySelectorAll('.swipe-item-container');
  const resetBtn = container.querySelector('#swipe-reset') as HTMLElement;
  let dismissedCount = 0;

  swipeItems.forEach(el => {
    const itemEl = el.querySelector('.swipe-item') as HTMLElement;
    let isSwiping = false;
    let sX = 0;
    let tX = 0;

    itemEl.addEventListener('pointerdown', e => {
      isSwiping = true;
      sX = e.clientX - tX;
      itemEl.style.transition = 'none';
      itemEl.setPointerCapture(e.pointerId);
    });
    itemEl.addEventListener('pointermove', e => {
      if(!isSwiping) return;
      tX = e.clientX - sX;
      if (tX > 0) tX = 0; // Swipe left only
      itemEl.style.transform = `translateX(${tX}px)`;
    });
    function endSwipe() {
      isSwiping = false;
      const width = itemEl.offsetWidth;
      if (tX < -width * 0.4) {
        // Dismiss
        itemEl.style.transition = 'transform var(--base)';
        itemEl.style.transform = `translateX(-${width}px)`;
        setTimeout(() => {
          (el as HTMLElement).style.maxHeight = '0';
          (el as HTMLElement).style.opacity = '0';
          (el as HTMLElement).style.marginBottom = '0';
          dismissedCount++;
          if (dismissedCount > 0) resetBtn.style.display = 'block';
        }, 300);
      } else {
        // Snap back
        tX = 0;
        itemEl.style.transition = 'transform var(--base)';
        itemEl.style.transform = 'translateX(0)';
      }
    }
    itemEl.addEventListener('pointerup', endSwipe);
    itemEl.addEventListener('pointercancel', endSwipe);
  });

  resetBtn.addEventListener('click', () => {
    swipeItems.forEach(el => {
      const itemEl = el.querySelector('.swipe-item') as HTMLElement;
      itemEl.style.transition = 'none';
      itemEl.style.transform = 'translateX(0)';
      (el as HTMLElement).style.maxHeight = '56px';
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.marginBottom = '8px';
    });
    dismissedCount = 0;
    resetBtn.style.display = 'none';
  });

  // Buttons for Modals
  container.querySelector('#btn-dialog')?.addEventListener('click', () => showDialog());
  container.querySelector('#btn-sheet')?.addEventListener('click', () => showSheet());
  container.querySelector('#btn-toast')?.addEventListener('click', () => showToast());
}

function showDialog() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="dialog">
      <div class="title" style="margin-bottom: 8px;">Dialog</div>
      <div class="body" style="color: var(--text-med); margin-bottom: 24px;">This is a modal dialog.</div>
      <div style="display: flex; justify-content: flex-end;">
        <button class="label" style="color: var(--primary); padding: 8px 16px;" id="dialog-close">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add('visible'));
  overlay.querySelector('#dialog-close')?.addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 300);
  });
}

function showSheet() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="sheet" id="sheet">
      <div class="sheet-handle"></div>
      <div class="title" style="margin-bottom: 16px;">Bottom Sheet</div>
      <div class="body" style="color: var(--text-med);">Drag handle down to dismiss.</div>
    </div>
  `;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add('visible'));

  const sheet = overlay.querySelector('#sheet') as HTMLElement;
  let isDragging = false;
  let sY = 0;
  let tY = 0;

  sheet.addEventListener('pointerdown', e => {
    isDragging = true;
    sY = e.clientY - tY;
    sheet.style.transition = 'none';
  });
  sheet.addEventListener('pointermove', e => {
    if(!isDragging) return;
    tY = e.clientY - sY;
    if (tY < 0) tY = 0;
    sheet.style.transform = `translateY(${tY}px)`;
  });
  function endDrag() {
    isDragging = false;
    if (tY > 100) {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 300);
    } else {
      tY = 0;
      sheet.style.transition = 'transform var(--base)';
      sheet.style.transform = 'translateY(0)';
    }
  }
  sheet.addEventListener('pointerup', endDrag);
  sheet.addEventListener('pointercancel', endDrag);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 300);
    }
  });
}

function showToast() {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = 'This is a toast message';
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.style.transform = 'translateY(0)');
  setTimeout(() => {
    toast.style.transform = 'translateY(150%)';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Navigation & Shared Element Transition
function navigateToDetail(item: DataItem, element: HTMLElement) {
  currentItem = item;
  const p1 = document.getElementById('page1')!;
  const p2 = createPage2(item);
  appContainer.appendChild(p2);

  // Shared Element Setup
  const thumb = element.querySelector('.thumb') as HTMLElement;
  const rect = thumb.getBoundingClientRect();

  const clone = thumb.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.top = `${rect.top}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.margin = '0';
  clone.style.zIndex = '100';
  clone.style.transition = 'all var(--base)';
  document.body.appendChild(clone);

  thumb.style.opacity = '0';

  // P1 Exit
  p1.style.transition = 'transform var(--base), opacity var(--base)';
  p1.style.transform = 'translateX(-10%)';
  p1.style.opacity = '0.6';

  // P2 Enter
  p2.style.transform = 'translateX(30%)';
  p2.style.opacity = '0';

  // Force reflow
  p2.offsetWidth;

  p2.style.transition = 'transform var(--base), opacity var(--base)';
  p2.style.transform = 'translateX(0)';
  p2.style.opacity = '1';

  // Animate Clone to Header
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '100%';
  clone.style.height = '240px';
  clone.style.borderRadius = '0';

  // Crossfade item text
  const text = element.querySelector('.item-text') as HTMLElement;
  text.style.transition = 'opacity var(--fast)';
  text.style.opacity = '0';

  setTimeout(() => {
    clone.remove();
    // Re-enable elements
    thumb.style.opacity = '1';
    text.style.opacity = '1';

    // N.B: Since we don't have true routing, handling physical back is complex.
    // We add a window state.
    history.pushState({ id: item.id }, '');
  }, 300);
}

function navigateBack() {
  if (!currentItem) return;
  const p1 = document.getElementById('page1')!;
  const p2 = document.getElementById('page2')!;

  p2.style.transform = 'translateX(30%)';
  p2.style.opacity = '0';

  p1.style.transform = 'translateX(0)';
  p1.style.opacity = '1';

  setTimeout(() => {
    p2.remove();
    currentItem = null;
  }, 300);
}

window.addEventListener('popstate', () => {
  if (document.getElementById('page2')) {
    navigateBack();
  }
});

async function init() {
  appContainer = document.getElementById('app')!;
  await loadData();

  const p1 = createPage1();
  appContainer.appendChild(p1);

  // Check deep link
  const path = window.location.pathname;
  if (path.startsWith('/detail/')) {
    const id = parseInt(path.split('/')[2]);
    const item = items.find(i => i.id === id);
    if (item) {
      setTimeout(() => navigateToDetail(item, document.body), 100);
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
