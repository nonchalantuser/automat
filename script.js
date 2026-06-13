'use strict';

/* ════════════════════════════════════════
   AUTOMAT INDUSTRIES — script.js
   Professional, clean interactions
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
  }, 2000);
});

// ── Hero Canvas — subtle particle network ─
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 60;
  const LINK_DIST = 130;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(rand = false) {
      this.x  = Math.random() * W;
      this.y  = rand ? Math.random() * H : H + 8;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.r  = Math.random() * 1.8 + 0.4;
      this.life = 0;
      this.max  = Math.random() * 250 + 200;
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.max || this.y < -10) this.reset();
    }
    draw() {
      const a = Math.min(this.life / 40, 1) * Math.min((this.max - this.life) / 40, 1) * 0.55;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(52,193,90,${a})`;
      ctx.fill();
    }
  }

  function drawLinks() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(52,193,90,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLinks();
    particles.forEach(p => { p.step(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  particles = Array.from({ length: COUNT }, () => new Particle());
  loop();
})();

// ── Navbar ────────────────────────────────
(function initNavbar() {
  const nav    = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  const secs   = document.querySelectorAll('section[id]');

  function update() {
    // scrolled class
    nav.classList.toggle('scrolled', window.scrollY > 50);

    // active link
    let curr = '';
    secs.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) curr = s.id;
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

  // close on any link click
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  // close on outside click
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
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  // stagger cards inside grids
  document.querySelectorAll(
    '.products-grid, .industries-grid, .standards-grid, .he-features-row, .fab-items-grid'
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

// ── Product Tabs ──────────────────────────
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

// ── Contact form ──────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const msg = document.getElementById('form-success');
  const frm = document.getElementById('contact-form');

  btn.disabled   = true;
  btn.style.opacity = '0.7';
  btn.querySelector('span').textContent = 'Sending…';

  setTimeout(() => {
    frm.reset();
    btn.disabled  = false;
    btn.style.opacity = '1';
    btn.querySelector('span').textContent = 'Send Enquiry';
    msg.classList.add('visible');
    setTimeout(() => msg.classList.remove('visible'), 5000);
  }, 1500);
}

// ── Footer tab helper ─────────────────────
function setTab(tabName) {
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

// ── Subtle card hover lift (no tilt on mobile) ─
(function initCardLift() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll(
    '.product-card, .industry-card, .standard-card, .he-feature, .fab-item, .asc, .contact-card'
  );
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width / 2;
      const y  = e.clientY - r.top  - r.height / 2;
      const rx = (y / r.height) * 5;
      const ry = -(x / r.width) * 5;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// ── Log ───────────────────────────────────
console.log(
  '%cAUTOMAT INDUSTRIES%c\nEngineers & Fabricators — Est. 1977 | Ankleshwar, Gujarat',
  'color:#1e7e34;font-size:18px;font-weight:900;',
  'color:#6c757d;font-size:11px;'
);
