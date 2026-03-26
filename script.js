/* ════════════════════════════════════════════════
   AftabBaba.com — Premium Denim Brand
   script.js — v2.0 Complete Interaction Layer
   ════════════════════════════════════════════════ */

'use strict';

/* ── Gallery Data ───────────────────────────────── */
const GALLERY_IMGS = [
  { src: 'images/p1.jpg', caption: 'Diamond Wide Leg Set' },
  { src: 'images/p2.jpg', caption: 'Denim Shirt & Flare' },
  { src: 'images/p3.jpg', caption: 'Denim Vest Duo' },
  { src: 'images/p4.jpg', caption: 'Vintage Distressed' },
  { src: 'images/p5.jpg', caption: 'Light Wash Diamond' },
  { src: 'images/p6.jpg', caption: 'Kids Line' },
  { src: 'images/p7.jpg', caption: 'Denim Dungarees' },
  { src: 'images/p8.jpg', caption: 'Acid Cargo Set' },
  { src: 'images/p9.jpg', caption: 'Custom Design' },
  { src: 'images/p10.jpg', caption: 'The Designer — Mr. Aftab' },
  { src: 'images/p11.jpg', caption: 'Heritage Wash Set' },
];

/* ── Init ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initThemeToggle();
  initNavbar();
  initHamburger();
  initScrollProgress();
  initReveal();
  initCounters();
  initLightboxKeys();
  initBackToTop();
  initFooterYear();
  bindLightboxNav();
});

/* ════════════════════════════════════════════════
   LOADER
════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Fire hero reveals after load
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120 + 100);
    });
  }, 2100);
}

/* ════════════════════════════════════════════════
   THEME — Persist preference
════════════════════════════════════════════════ */
function initTheme() {
  // Default is always LIGHT — only use saved preference if user manually toggled
  const saved = localStorage.getItem('ab-theme');
  applyTheme(saved || 'light');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ab-theme', theme);
  // Update meta theme-color for mobile browser UI
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = theme === 'dark' ? '#0f0f0f' : '#ffffff';
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Sync with OS preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('ab-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/* ════════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 56);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      setTimeout(() => {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    });
  });
}

/* ════════════════════════════════════════════════
   HAMBURGER / MOBILE MENU
════════════════════════════════════════════════ */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.contains('open');
    open ? closeMobileMenu() : openMobileMenu();
  });

  menu.addEventListener('click', e => { if (e.target === menu) closeMobileMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
}

function openMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');
  menu.classList.add('open');
  menu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Make links focusable
  menu.querySelectorAll('.mm-link, .mm-phone').forEach(el => el.removeAttribute('tabindex'));
}

function closeMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  menu.querySelectorAll('.mm-link, .mm-phone').forEach(el => el.setAttribute('tabindex', '-1'));
}

/* ════════════════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const total    = document.body.scrollHeight - window.innerHeight;
    const progress = total > 0 ? window.scrollY / total : 0;
    bar.style.transform = `scaleX(${progress})`;
  }, { passive: true });
}

/* ════════════════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
════════════════════════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  // Filter out hero elements (handled by loader)
  const observed = Array.from(els).filter(el => !el.closest('.hero'));

  if (!observed.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });

  observed.forEach(el => io.observe(el));
}


/* ════════════════════════════════════════════════
   ANIMATED COUNTERS — Premium number reveal on scroll
════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Prevent duplicate animations
      if (entry.target.dataset.animated) return;
      entry.target.dataset.animated = 'true';
      animateCount(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

function animateCount(el) {
  const target   = parseInt(el.dataset.target, 10) || 0;
  const duration = 2000; // Smooth 2-second animation
  const fps      = 60;
  const steps    = (duration / 1000) * fps;
  const increment = target / steps;
  let current = 0;
  let rafId;

  const tick = () => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString('en-IN');
      el.style.color = 'var(--text)';
      return;
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
    el.style.fontWeight = '700';
    el.style.transition = 'color 0.3s';
    rafId = requestAnimationFrame(tick);
  };

  // Start with a slight pulse
  el.style.transform = 'scale(0.95)';
  el.style.opacity = '0.6';
  setTimeout(() => {
    el.style.transform = 'scale(1)';
    el.style.opacity = '1';
    el.style.transition = 'transform 0.3s, opacity 0.3s';
    requestAnimationFrame(tick);
  }, 50);
}

/* ════════════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════════════ */
let lbCurrentIndex = 0;

function openLightbox(index) {
  lbCurrentIndex = index;
  renderLightbox(index);

  const lb = document.getElementById('lightbox');
  const bd = document.getElementById('lbBackdrop');
  if (!lb || !bd) return;

  lb.setAttribute('aria-hidden', 'false');
  lb.classList.add('open');
  bd.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose')?.focus();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const bd = document.getElementById('lbBackdrop');
  if (!lb || !bd) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  bd.classList.remove('open');
  document.body.style.overflow = '';
}

function renderLightbox(index) {
  const data = GALLERY_IMGS[index];
  if (!data) return;

  const img     = document.getElementById('lbImg');
  const caption = document.getElementById('lbCaption');
  const counter = document.getElementById('lbCounter');

  img.style.opacity   = '0';
  img.style.transform = 'scale(0.97)';

  const newImg    = new Image();
  newImg.onload = () => {
    img.src             = data.src;
    img.alt             = data.caption;
    img.style.opacity   = '1';
    img.style.transform = 'scale(1)';
  };
  newImg.src = data.src;

  if (caption) caption.textContent = data.caption;
  if (counter) counter.textContent = `${index + 1} / ${GALLERY_IMGS.length}`;
}

function lbPrev() {
  lbCurrentIndex = (lbCurrentIndex - 1 + GALLERY_IMGS.length) % GALLERY_IMGS.length;
  renderLightbox(lbCurrentIndex);
}

function lbNext() {
  lbCurrentIndex = (lbCurrentIndex + 1) % GALLERY_IMGS.length;
  renderLightbox(lbCurrentIndex);
}

function bindLightboxNav() {
  document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lbBackdrop')?.addEventListener('click', closeLightbox);
  document.getElementById('lbPrev')?.addEventListener('click', lbPrev);
  document.getElementById('lbNext')?.addEventListener('click', lbNext);

  // Keyboard navigation for gallery items
  document.querySelectorAll('.g-item').forEach((item, idx) => {
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });
}

function initLightboxKeys() {
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  lbPrev();
    if (e.key === 'ArrowRight') lbNext();
    // Touch swipe handled separately
  });

  // Touch swipe for lightbox
  let touchStartX = 0;
  document.getElementById('lightbox')?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.getElementById('lightbox')?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? lbNext() : lbPrev();
    }
  }, { passive: true });
}

window.openLightbox = openLightbox;

/* ════════════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 350);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ════════════════════════════════════════════════
   FOOTER YEAR
════════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('fyear');
  if (el) el.textContent = new Date().getFullYear();
}



/* ════════════════════════════════════════════════
   WHY CARDS — hover image pop (desktop)
════════════════════════════════════════════════ */
(function initWhyHover() {
  const cards = document.querySelectorAll('.wc');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'background 0.35s';
    });
  });
})();

/* ════════════════════════════════════════════════
   PASSIVE SCROLL — hero parallax & smooth effects
════════════════════════════════════════════════ */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const img = document.querySelector('.hero-bg-img');
  if (!img) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.5) {
      const offset = window.scrollY * 0.22;
      const scale = 1.04 + (window.scrollY / window.innerHeight) * 0.06;
      img.style.transform = `scale(${scale}) translateY(${offset}px)`;
    }
  }, { passive: true });
})();

/* ════════════════════════════════════════════════
   NATIVE LAZY IMAGE FALLBACK
════════════════════════════════════════════════ */
(function initLazyFallback() {
  if ('loading' in HTMLImageElement.prototype) return;
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src || e.target.src;
        io.unobserve(e.target);
      }
    });
  });
  imgs.forEach(img => io.observe(img));
})();

/* ════════════════════════════════════════════════
   VISIBILITY — pause marquee if any
════════════════════════════════════════════════ */
document.addEventListener('visibilitychange', () => {
  document.querySelectorAll('[style*="animation"]').forEach(el => {
    el.style.animationPlayState = document.hidden ? 'paused' : 'running';
  });
});

/* ════════════════════════════════════════════════
   DEV LOG
════════════════════════════════════════════════ */
console.log(
  '%cAftabBaba.com 🧵',
  'color:#2756a8;font-family:Georgia,serif;font-size:16px;font-weight:700;'
);
console.log(
  '%cPrecision Denim Manufacturing · Kalyan, Thane',
  'color:#888;font-family:monospace;font-size:11px;'
);
