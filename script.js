'use strict';

/* ════════════════════════════════════════
   AUTOMAT INDUSTRIES — script.js
   Engineers & Fabricators — Est. 1977
   ════════════════════════════════════════ */

// ── Preloader ─────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const pl = document.getElementById('preloader');
    if (pl) {
      pl.classList.add('hidden');
      setTimeout(() => pl.remove(), 600);
    }
    initScrollAnimations();
    initCounters();
    initProcessSteps();
    initBarChartAnimation();
  }, 2000);
});



// ── Navbar active link tracking ─────────────
(function initNavbar() {
  const links = document.querySelectorAll('.nav-link');
  const secs  = document.querySelectorAll('section[id]');
  const OFFSET = 130; // header height (top bar + nav)

  function update() {
    let curr = '';
    secs.forEach(s => {
      if (window.scrollY >= s.offsetTop - OFFSET) curr = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${curr}`);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── Hamburger ─────────────────────────────
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) close();
  });

  function close() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
})();

// ── Scroll Reveal ─────────────────────────
function initScrollAnimations() {
  const items = document.querySelectorAll('[data-animate]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay) || 0;
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  // stagger cards inside grids
  document.querySelectorAll(
    '.industries-grid, .standards-grid, .mfg-stats, .eng-cards, .clients-grid, .org-tree .org-row'
  ).forEach(grid => {
    grid.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.dataset.delay = i * 70;
    });
  });

  items.forEach(el => io.observe(el));
}

// ── Counter animation ──────────────────────
function initCounters() {
  const nums = document.querySelectorAll('.stat-number[data-target]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateNum(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  nums.forEach(n => io.observe(n));
}

function animateNum(el) {
  const target = +el.dataset.target;
  const dur    = 1800;
  const tick   = 16;
  const inc    = target / (dur / tick);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + inc, target);
    el.textContent = Math.floor(cur);
    if (cur >= target) clearInterval(t);
  }, tick);
}

// ── Desktop Product Tabs ──────────────────
(function initTabs() {
  const btns     = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  btns.forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.tab;
    btns.forEach(b => b.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const pane = document.getElementById(`tab-content-${id}`);
    if (!pane) return;
    pane.classList.add('active');

    // re-animate cards in new tab
    pane.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.classList.remove('visible');
      el.style.transitionDelay = `${i * 60}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
    });
  }));
})();

// ── Mobile Product Accordion ──────────────
(function initProductAccordion() {
  const headers = document.querySelectorAll('.acc-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.dataset.acc;
      const body = document.getElementById(`acc-body-${targetId}`);
      if (!body) return;

      const isOpen = header.classList.contains('active');

      // Close all
      document.querySelectorAll('.acc-header').forEach(h => h.classList.remove('active'));
      document.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));

      // If was closed, open this one
      if (!isOpen) {
        header.classList.add('active');
        body.classList.add('open');
      }
    });
  });
})();

// ── Materials Accordion ───────────────────
(function initMaterialsAccordion() {
  const headers = document.querySelectorAll('.mat-acc-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.dataset.matacc;
      const item = header.closest('.mat-acc-item');
      const body = document.getElementById(`mat-body-${targetId}`);
      const chevron = header.querySelector('.mat-chevron');

      if (!body || !item) return;

      const isOpen = item.classList.contains('open');

      // Toggle this item
      if (isOpen) {
        item.classList.remove('open');
        body.classList.add('collapsed');
        if (chevron) chevron.classList.remove('open');
      } else {
        item.classList.add('open');
        body.classList.remove('collapsed');
        if (chevron) chevron.classList.add('open');
      }
    });
  });
})();

// ── Bar Chart Animation ────────────────────
function initBarChartAnimation() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;

  // Save and reset heights to animate them in
  bars.forEach(bar => {
    const targetH = bar.style.getPropertyValue('--bar-h');
    bar.style.setProperty('--bar-h', '0%');
    bar._targetH = targetH;
  });

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    bars.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.setProperty('--bar-h', bar._targetH);
      }, i * 150);
    });
    io.disconnect();
  }, { threshold: 0.3 });

  const chart = document.querySelector('.bar-chart');
  if (chart) io.observe(chart);
}

// ── Back to Top ───────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ── Smooth anchor scroll ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href   = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ── Footer tab helper (updated for new tab IDs) ──
function setTab(tabName) {
  // On mobile, do nothing (accordion is shown instead)
  if (window.innerWidth <= 768) return;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const btn  = document.querySelector(`[data-tab="${tabName}"]`);
  const pane = document.getElementById(`tab-content-${tabName}`);
  if (btn)  btn.classList.add('active');
  if (pane) pane.classList.add('active');
}

// ── Process steps stagger ─────────────────
function initProcessSteps() {
  const steps = document.querySelectorAll('.process-step');
  if (!steps.length) return;

  steps.forEach(s => {
    s.style.opacity   = '0';
    s.style.transform = 'translateX(-16px)';
    s.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  });

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    steps.forEach((s, i) => {
      setTimeout(() => {
        s.style.opacity   = '1';
        s.style.transform = 'translateX(0)';
      }, i * 100);
    });
    io.disconnect();
  }, { threshold: 0.15 });

  const wrap = steps[0].closest('.process-flow') || steps[0];
  io.observe(wrap);
}

// ── Subtle card hover lift ─────────────────
(function initCardLift() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll(
    '.industry-card, .standard-card, .asc, .contact-card, .eng-card, .mfg-stat-card, .client-badge'
  );
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width / 2;
      const y  = e.clientY - r.top  - r.height / 2;
      const rx = (y / r.height) * 4;
      const ry = -(x / r.width) * 4;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// ── Log ───────────────────────────────────
console.log(
  '%cAUTOMAT INDUSTRIES%c\nEngineers & Fabricators — Est. 1977 | Ankleshwar, Gujarat\nGSTIN: 24AEBPP4548K1ZB',
  'color:#1e7e34;font-size:18px;font-weight:900;',
  'color:#6c757d;font-size:11px;'
);
