// main.ts
import data from '../../public/data.json';

// Types
interface Item {
  id: number;
  title: string;
  subtitle: string;
  score: number;
  colors: string[];
  body: string;
}

const items: Item[] = data.items;
let currentItem: Item | null = null;
let taps = 0;
let isDark = false;

// DOM Elements (setup on mount)
const routerView = document.getElementById('router-view')!;
let heroThumbRect: DOMRect | null = null;

// Routing logic
function navigateTo(path: string, id?: number) {
  if (path === '/') {
    renderPage1();
  } else if (path === '/detail' && id) {
    currentItem = items.find(i => i.id === id) || items[0];
    renderPage2(currentItem);
  }
}

// Initial Navigation
// Check if detail route e.g. /detail/3 for C16 (Deep link)
const hash = window.location.hash;
if (hash.startsWith('#/detail/')) {
    const id = parseInt(hash.split('/')[2]);
    navigateTo('/detail', id);
} else {
    navigateTo('/');
}

// --- Page 1 (Showcase) ---
function renderPage1() {
  window.location.hash = '/';

  const page1HTML = `
    <div class="page p1" id="page-1">
      <div class="app-bar" id="app-bar-1">
        <div class="title">Pulse</div>
        <button class="icon-btn" id="theme-toggle">
          ${isDark ? '🌙' : '☀️'}
        </button>
      </div>

      <div class="p1-content">
        <!-- Hero Card -->
        <div class="hero-card" id="orbit">
          <div class="title">Same app.<br>Every framework.</div>
          <div class="orbit-container">
            <div class="orbit-dot"></div>
            <div class="orbit-dot"></div>
            <div class="orbit-dot"></div>
          </div>
        </div>

        <!-- Counter -->
        <div class="counter-row">
          <div class="counter-text">
            <div class="label">Taps</div>
            <div class="number-wrapper">
              <div class="display number-val" id="counter-val">${taps}</div>
            </div>
          </div>
          <button class="fab" id="counter-inc">+</button>
        </div>

        <!-- Controls -->
        <div class="controls-card">
          <div class="control-row">
            <div class="body-text">Notifications</div>
            <label class="switch">
              <input type="checkbox" id="switch">
              <span class="slider-track"></span>
            </label>
          </div>

          <div class="slider-container">
            <div class="slider-header">
              <div class="body-text">Intensity</div>
              <div class="label" id="slider-val">50</div>
            </div>
            <input type="range" min="0" max="100" value="50" id="slider">
          </div>

          <div class="chips-row">
            <button class="chip" id="chip-low">Low</button>
            <button class="chip selected" id="chip-medium">Medium</button>
            <button class="chip" id="chip-high">High</button>
          </div>
        </div>

        <!-- Text Field -->
        <div class="input-container">
          <input type="text" id="name-input" placeholder=" " />
          <label for="name-input">Your name</label>
        </div>
        <div class="body-text greeting" id="greeting"></div>

        <!-- List -->
        <div class="list-container" id="list-container">
          ${items.map(item => `
            <div class="list-item" id="item-${item.id}" data-id="${item.id}">
              <div class="item-thumb" style="background: linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})"></div>
              <div class="item-content">
                <div class="title" style="font-size: 16px">${item.title}</div>
                <div class="caption">${item.subtitle}</div>
              </div>
              <div class="item-chevron">›</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Transition Page 1 in if coming from Page 2
  const isBack = !!document.getElementById('page-2');

  if (isBack) {
      const p1 = document.createElement('div');
      p1.innerHTML = page1HTML;
      const newPage = p1.firstElementChild as HTMLElement;

      // Initial state for back animation
      newPage.style.transform = 'translateX(-10%)';
      newPage.style.opacity = '0.6';

      routerView.insertBefore(newPage, routerView.firstChild);

      const p2 = document.getElementById('page-2')!;

      // Animate
      requestAnimationFrame(() => {
          newPage.style.transition = 'transform var(--base), opacity var(--base)';
          p2.style.transition = 'transform var(--base), opacity var(--base)';

          newPage.style.transform = 'translateX(0)';
          newPage.style.opacity = '1';

          p2.style.transform = 'translateX(30%)';
          p2.style.opacity = '0';

          setTimeout(() => {
              p2.remove();
              setupPage1Events();
          }, 300);
      });
  } else {
      routerView.innerHTML = page1HTML;
      setupPage1Events();

      // Stagger list entrance on first load only
      const listItems = document.querySelectorAll('.list-item');
      listItems.forEach((el, index) => {
          setTimeout(() => {
              el.classList.add('show');
          }, index * 50);
      });
  }
}

function setupPage1Events() {
  // Scroll shadow
  const appBar = document.getElementById('app-bar-1')!;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) appBar.classList.add('scrolled');
    else appBar.classList.remove('scrolled');
  });

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle')!;
  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '🌙' : '☀️';
    themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => { themeToggle.style.transform = 'rotate(0deg)'; }, 150);
  });

  // Counter
  const counterInc = document.getElementById('counter-inc')!;
  const counterValWrapper = document.querySelector('.number-wrapper')!;

  let pressTimer: any;
  counterInc.addEventListener('pointerdown', () => {
    pressTimer = setTimeout(() => {
      // Long press
      taps = 0;
      updateCounter(taps);
      counterInc.classList.add('shake');
      setTimeout(() => counterInc.classList.remove('shake'), 300);
    }, 500);
  });

  counterInc.addEventListener('pointerup', () => {
    clearTimeout(pressTimer);
    if (!counterInc.classList.contains('shake')) {
        taps++;
        updateCounter(taps);
    }
  });

  function updateCounter(newVal: number) {
      const currentEl = document.getElementById('counter-val')!;
      currentEl.classList.add('old');
      currentEl.removeAttribute('id');

      const newEl = document.createElement('div');
      newEl.className = 'display number-val new-enter';
      newEl.id = 'counter-val';
      newEl.textContent = newVal.toString();
      counterValWrapper.appendChild(newEl);

      requestAnimationFrame(() => {
          newEl.classList.remove('new-enter');
          newEl.classList.add('new-active');
      });

      setTimeout(() => {
          if (currentEl.parentNode) currentEl.remove();
          newEl.classList.remove('new-active');
      }, 300);
  }

  // Slider
  const slider = document.getElementById('slider') as HTMLInputElement;
  const sliderVal = document.getElementById('slider-val')!;
  slider.addEventListener('input', (e) => {
    sliderVal.textContent = (e.target as HTMLInputElement).value;
  });

  // Chips
  const chips = [document.getElementById('chip-low'), document.getElementById('chip-medium'), document.getElementById('chip-high')];
  chips.forEach(chip => {
    chip?.addEventListener('click', () => {
      chips.forEach(c => c?.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  // Text Input
  const nameInput = document.getElementById('name-input') as HTMLInputElement;
  const greeting = document.getElementById('greeting')!;
  nameInput.addEventListener('input', () => {
      const val = nameInput.value;
      if (val) {
          greeting.textContent = `Hello, ${val}`;
          greeting.style.opacity = '1';
      } else {
          greeting.style.opacity = '0';
      }
  });

  // List Item Clicks
  const listItems = document.querySelectorAll('.list-item');
  listItems.forEach(item => {
      item.addEventListener('click', () => {
          const id = parseInt(item.getAttribute('data-id')!);
          const thumb = item.querySelector('.item-thumb')!;
          heroThumbRect = thumb.getBoundingClientRect();

          navigateTo('/detail', id);
      });
  });
}

// --- Page 2 (Detail) ---
function renderPage2(item: Item) {
    window.location.hash = `/detail/${item.id}`;

    const page2HTML = `
      <div class="page p2" id="page-2">
        <div class="p2-header" id="p2-header">
          <div class="p2-header-bg" style="background: linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})"></div>
          <div class="p2-header-content">
            <button class="icon-btn p2-back-btn" id="back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div class="display p2-title" id="p2-title">${item.title}</div>
          </div>
        </div>

        <div class="p2-content">
          <!-- Progress Ring -->
          <div class="progress-container" id="ring-container">
            <svg class="progress-ring" width="120" height="120">
              <circle class="progress-ring-bg" cx="60" cy="60" r="45" />
              <circle class="progress-ring-fg" id="ring" cx="60" cy="60" r="45" />
            </svg>
            <div class="title progress-text" id="ring-text">0%</div>
          </div>

          <!-- Accordion -->
          <div class="accordion" id="accordion">
            <div class="accordion-header" id="accordion-header">
              <div class="title" style="font-size: 16px">Details</div>
              <div class="accordion-chevron">▼</div>
            </div>
            <div class="accordion-content" id="accordion-content">
              <div class="accordion-content-inner body-text">
                ${item.body}
              </div>
            </div>
          </div>

          <!-- Draggable Card -->
          <div class="drag-area" id="drag-area">
            <div class="drag-card" id="drag-card">Drag me</div>
          </div>

          <!-- Swipe List -->
          <div class="swipe-list">
            ${[1, 2, 3].map(i => `
              <div class="swipe-container" id="swipe-${i}">
                <div class="swipe-bg">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </div>
                <div class="swipe-item">
                  <div class="body-text">Swipe to dismiss ${i}</div>
                </div>
              </div>
            `).join('')}
            <button class="btn btn-text" id="swipe-reset" style="align-self: flex-start;">Reset</button>
          </div>

          <!-- Buttons Row -->
          <div class="btn-row">
            <button class="btn btn-primary" id="btn-dialog">Show dialog</button>
            <button class="btn btn-outline" id="btn-sheet">Show sheet</button>
            <button class="btn btn-outline" id="btn-toast">Toast</button>
          </div>

          <!-- Shimmer -->
          <div class="shimmer-block" id="shimmer">
            <div class="shimmer-line"></div>
            <div class="shimmer-line"></div>
            <div class="shimmer-line"></div>
          </div>
          <div class="body-text body-text-loaded" id="body-text-loaded">
            Content loaded successfully.
          </div>
        </div>

        <!-- Overlays -->
        <div class="scrim" id="dialog-scrim">
          <div class="dialog">
            <div class="title" style="margin-bottom: 16px">Dialog</div>
            <div class="body-text">This is a modal dialog.</div>
            <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
              <button class="btn btn-text" id="dialog-close">Close</button>
            </div>
          </div>
        </div>

        <div class="sheet-scrim" id="sheet-scrim">
          <div class="bottom-sheet" id="bottom-sheet">
            <div class="sheet-handle"></div>
            <div class="title" style="margin-bottom: 16px">Bottom Sheet</div>
            <div class="body-text">Drag down or tap outside to dismiss.</div>
          </div>
        </div>

        <div class="toast" id="toast">Toast message</div>
      </div>
    `;

    const p2 = document.createElement('div');
    p2.innerHTML = page2HTML;
    const newPage = p2.firstElementChild as HTMLElement;

    // Page 2 Entry Animation
    newPage.style.transform = 'translateX(30%)';
    newPage.style.opacity = '0';

    routerView.appendChild(newPage);

    const p1 = document.getElementById('page-1')!;

    // Fake Hero Element (if transitioning from P1)
    let fakeHero: HTMLElement | null = null;
    if (heroThumbRect) {
        fakeHero = document.createElement('div');
        fakeHero.style.position = 'fixed';
        fakeHero.style.top = heroThumbRect.top + 'px';
        fakeHero.style.left = heroThumbRect.left + 'px';
        fakeHero.style.width = heroThumbRect.width + 'px';
        fakeHero.style.height = heroThumbRect.height + 'px';
        fakeHero.style.background = `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`;
        fakeHero.style.borderRadius = '16px';
        fakeHero.style.zIndex = '100';
        fakeHero.style.transition = 'all var(--base)';
        document.body.appendChild(fakeHero);
    }

    requestAnimationFrame(() => {
        newPage.style.transition = 'transform var(--base), opacity var(--base)';
        if(p1) p1.style.transition = 'transform var(--base), opacity var(--base)';

        newPage.style.transform = 'translateX(0)';
        newPage.style.opacity = '1';

        if (p1) {
            p1.style.transform = 'translateX(-10%)';
            p1.style.opacity = '0.6';
        }

        if (fakeHero) {
            fakeHero.style.top = '0';
            fakeHero.style.left = '0';
            fakeHero.style.width = '100%';
            fakeHero.style.height = '240px';
            fakeHero.style.borderRadius = '0';

            setTimeout(() => {
                if (fakeHero) fakeHero.remove();
            }, 300);
        }

        setTimeout(() => {
            if (p1) p1.style.display = 'none'; // hide instead of remove to keep state, or re-render on back. Re-rendering is cleaner.
            setupPage2Events(item);
        }, 300);
    });
}

function setupPage2Events(item: Item) {
    // Back button
    const backBtn = document.getElementById('back')!;
    backBtn.addEventListener('click', () => {
        navigateTo('/');
    });

    // Parallax header
    const p2HeaderBg = document.querySelector('.p2-header-bg') as HTMLElement;
    const p2Title = document.getElementById('p2-title') as HTMLElement;

    window.addEventListener('scroll', () => {
        if (!document.getElementById('page-2')) return;
        const scrollY = window.scrollY;

        // Parallax background
        if (scrollY > 0 && scrollY < 240) {
            p2HeaderBg.style.transform = `translateY(${scrollY * 0.5}px)`;
        }

        // Shrink title
        const maxScroll = 184; // 240 - 56
        const progress = Math.min(scrollY / maxScroll, 1);
        const scale = 1 - (progress * (1 - (20/32))); // 32 -> 20
        // Move title up
        const translateY = -progress * 184;
        p2Title.style.transform = `translateY(${translateY}px) scale(${scale})`;

        // Header height collapse
        if (scrollY > maxScroll) {
            // p2Header.style.height = '56px';
        }
    });

    // Progress Ring
    const ringContainer = document.getElementById('ring-container')!;
    const ring = document.getElementById('ring')!;
    const ringText = document.getElementById('ring-text')!;

    function playRing() {
        // Reset
        ring.style.transition = 'none';
        ring.style.strokeDashoffset = '283';
        ringText.textContent = '0%';

        requestAnimationFrame(() => {
            ring.style.transition = 'stroke-dashoffset var(--slow)';
            const targetOffset = 283 - (283 * item.score) / 100;
            ring.style.strokeDashoffset = targetOffset.toString();

            // Animate number
            const duration = 500;
            const startTime = performance.now();

            function animateText(time: number) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * item.score);
                ringText.textContent = `${current}%`;

                if (progress < 1) {
                    requestAnimationFrame(animateText);
                } else {
                    ringText.textContent = `${item.score}%`;
                }
            }
            requestAnimationFrame(animateText);
        });
    }
    // Play on entry
    setTimeout(playRing, 300);
    // Replay on tap
    ringContainer.addEventListener('click', playRing);

    // Accordion
    const accHeader = document.getElementById('accordion-header')!;
    const accordion = document.getElementById('accordion')!;
    const accContent = document.getElementById('accordion-content')!;
    const accInner = document.querySelector('.accordion-content-inner') as HTMLElement;

    accHeader.addEventListener('click', () => {
        const isExpanded = accordion.classList.toggle('expanded');
        if (isExpanded) {
            accContent.style.height = accInner.offsetHeight + 'px';
        } else {
            accContent.style.height = '0';
        }
    });

    // Draggable Card
    const dragCard = document.getElementById('drag-card')!;
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;

    dragCard.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        dragCard.classList.remove('springing');
        dragCard.setPointerCapture(e.pointerId);
    });

    dragCard.addEventListener('pointermove', (e) => {
        if (!isDragging) return;

        // Simple unconstrained drag visually
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;

        dragCard.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    dragCard.addEventListener('pointerup', () => {
        isDragging = false;
        dragCard.classList.add('springing');
        currentX = 0;
        currentY = 0;
        dragCard.style.transform = `translate(0px, 0px)`;
    });

    // Swipe to dismiss
    const swipeItems = document.querySelectorAll('.swipe-item');
    swipeItems.forEach(item => {
        let isSwiping = false;
        let startX = 0;
        let currentX = 0;
        const container = item.parentElement!;

        item.addEventListener('pointerdown', (e: Event) => {
            const ev = e as PointerEvent;
            isSwiping = true;
            startX = ev.clientX;
            item.classList.remove('animating');
            (item as HTMLElement).setPointerCapture(ev.pointerId);
        });

        item.addEventListener('pointermove', (e: Event) => {
            if (!isSwiping) return;
            const ev = e as PointerEvent;
            currentX = ev.clientX - startX;
            // Only allow swipe left
            if (currentX > 0) currentX = 0;
            (item as HTMLElement).style.transform = `translateX(${currentX}px)`;
        });

        item.addEventListener('pointerup', () => {
            if (!isSwiping) return;
            isSwiping = false;
            item.classList.add('animating');

            const threshold = container.offsetWidth * -0.4;
            if (currentX < threshold) {
                // Dismiss
                (item as HTMLElement).style.transform = `translateX(-100%)`;
                setTimeout(() => {
                    container.classList.add('dismissed');
                }, 300);
            } else {
                // Snap back
                currentX = 0;
                (item as HTMLElement).style.transform = `translateX(0)`;
            }
        });
    });

    const swipeReset = document.getElementById('swipe-reset')!;
    swipeReset.addEventListener('click', () => {
        const containers = document.querySelectorAll('.swipe-container');
        containers.forEach(c => {
            c.classList.remove('dismissed');
            const item = c.querySelector('.swipe-item') as HTMLElement;
            item.style.transform = 'translateX(0)';
        });
    });

    // Dialog
    const btnDialog = document.getElementById('btn-dialog')!;
    const dialogScrim = document.getElementById('dialog-scrim')!;
    const dialogClose = document.getElementById('dialog-close')!;

    btnDialog.addEventListener('click', () => dialogScrim.classList.add('show'));
    dialogClose.addEventListener('click', () => dialogScrim.classList.remove('show'));

    // Sheet
    const btnSheet = document.getElementById('btn-sheet')!;
    const sheetScrim = document.getElementById('sheet-scrim')!;

    btnSheet.addEventListener('click', () => sheetScrim.classList.add('show'));
    sheetScrim.addEventListener('click', (e) => {
        if (e.target === sheetScrim) sheetScrim.classList.remove('show');
    });

    // Toast
    const btnToast = document.getElementById('btn-toast')!;
    const toast = document.getElementById('toast')!;
    let toastTimeout: any;

    btnToast.addEventListener('click', () => {
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    });

    // Shimmer
    setTimeout(() => {
        const shimmer = document.getElementById('shimmer')!;
        const loaded = document.getElementById('body-text-loaded')!;
        shimmer.style.display = 'none';
        loaded.classList.add('show');
    }, 1500);
}

// Handle global keyboard events (C17)
window.addEventListener('keydown', (e) => {
    // Escape for dialogs
    if (e.key === 'Escape') {
        document.getElementById('dialog-scrim')?.classList.remove('show');
        document.getElementById('sheet-scrim')?.classList.remove('show');
    }

    // Back navigation on Windows via Backspace
    if (e.key === 'Backspace' && document.getElementById('page-2') &&
        !(e.target instanceof HTMLInputElement)) {
        navigateTo('/');
    }
});
