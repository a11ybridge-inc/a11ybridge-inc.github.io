/* A11YBRIDGE — Main JS */

/* ── Dark mode ──────────────────────────────────────── */
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');

  // Initialise from system pref (no localStorage in sandboxed iframes)
  let current = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', current);
  updateIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      current = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', current);
      toggle.setAttribute('aria-label', `Switch to ${current === 'dark' ? 'light' : 'dark'} mode`);
      updateIcon();
    });
  }

  function updateIcon() {
    if (!toggle) return;
    toggle.innerHTML = current === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
})();

/* ── Sticky header shadow ───────────────────────────── */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Mobile nav toggle ──────────────────────────────── */
(function () {
  const btn = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  const cta = document.querySelector('.nav-cta');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    btn.innerHTML = isOpen
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    if (cta) cta.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      if (cta) cta.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      document.body.style.overflow = '';
    });
  });
})();

/* ── Scroll reveal ──────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* ── Active nav link ────────────────────────────────── */
(function () {
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (path !== '/' && path.endsWith(href) && href !== '/')) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
