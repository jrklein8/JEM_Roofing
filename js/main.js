/* JEM Roofing Co. — shared behaviors (no dependencies) */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* nav: scroll state + mobile toggle */
  const nav = $('.nav');
  let contactInView = false;
  const contact = $('#contact');
  if (contact) new IntersectionObserver(e => { contactInView = e[0].isIntersecting; onScroll(); }, { threshold: 0.15 }).observe(contact);
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
    const bar = $('.callbar');
    if (bar) bar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    const roof = $('.hero-roof'); const hero = $('.hero');
    if (roof && hero) {
      const pin = window.innerWidth <= 900 && hero.getBoundingClientRect().bottom > window.innerHeight;
      roof.classList.toggle('is-pinned', pin);
    }
    const fab = $('.float-cta');
    if (fab) fab.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7 && !contactInView);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  const toggle = $('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.nav-links a', nav).forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open'); document.body.style.overflow = '';
    }));
  }

  /* mobile hero cards: fly in on first scroll/touch, or after 4s */
  const side = $('.hero-side');
  if (side && window.matchMedia('(max-width: 900px)').matches) {
    const show = () => { side.classList.add('is-in'); ['scroll','touchstart','wheel','keydown'].forEach(e => window.removeEventListener(e, show)); };
    ['scroll','touchstart','wheel','keydown'].forEach(e => window.addEventListener(e, show, { passive: true, once: true }));
    setTimeout(show, 4000);
  } else if (side) { side.classList.add('is-in'); }

  /* lightning: one-shot strike at a random 3–10s interval */
  const heroEl = $('.hero');
  if (heroEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const strike = () => {
      heroEl.classList.remove('is-flashing'); void heroEl.offsetWidth; heroEl.classList.add('is-flashing');
      setTimeout(() => heroEl.classList.remove('is-flashing'), 1200);
      setTimeout(strike, 3000 + Math.random() * 7000);
    };
    setTimeout(strike, 2500 + Math.random() * 3000);
  }

  /* photo slots: detect missing images, keep the styled fallback */
  $$('.photo img').forEach(img => {
    const box = img.closest('.photo');
    const ok = () => { if (img.naturalWidth > 0) { box.classList.add('has-img'); img.classList.remove('is-missing'); } };
    const fail = () => { img.classList.add('is-missing'); box.classList.remove('has-img'); };
    img.addEventListener('load', ok); img.addEventListener('error', fail);
    if (img.complete) { img.naturalWidth > 0 ? ok() : fail(); }
  });

  /* reveal on scroll */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* animated counters: <span data-count="30" data-suffix="+"> */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; cio.unobserve(el);
      const end = parseFloat(el.dataset.count); const suffix = el.dataset.suffix || '';
      const t0 = performance.now(); const dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur); const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* tilt cards (pointer devices only) */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', (ev) => {
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - .5; const y = (ev.clientY - r.top) / r.height - .5;
        card.style.setProperty('--rx', (-y * 6) + 'deg'); card.style.setProperty('--ry', (x * 8) + 'deg');
        card.style.setProperty('--mx', ((x + .5) * 100) + '%'); card.style.setProperty('--my', ((y + .5) * 100) + '%');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }

  /* contact form (Formspree-style JSON post; works with any endpoint that accepts JSON) */
  $$('form.form').forEach(form => {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const btn = $('button[type=submit]', form); const orig = btn.textContent;
      const action = form.getAttribute('action') || '';
      if (action.includes('YOUR_FORM_ID')) {           /* demo mode: no backend wired yet */
        form.classList.add('is-sent'); return;
      }
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const res = await fetch(action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) });
        if (!res.ok) throw new Error('bad response');
        form.classList.add('is-sent');
      } catch (err) {
        btn.disabled = false; btn.textContent = orig;
        alert('Something went wrong. Please call (910) 469-0064 and we will take care of you.');
      }
    });
  });

  /* reviews carousel (mobile): arrows + dots drive the scroll-snap track */
  $$('.review-track').forEach(track => {
    const grid = $('.review-grid', track); const cards = $$('.review', grid); const dots = $('.review-dots', track);
    if (!grid || cards.length < 2) return;
    cards.forEach((_, i) => { const d = document.createElement('i'); if (i === 0) d.classList.add('is-active'); dots.appendChild(d); });
    const index = () => { const x = grid.scrollLeft + grid.clientWidth / 2; let best = 0, dist = Infinity; cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - x); if (d < dist) { dist = d; best = i; } }); return best; };
    const sync = () => $$('i', dots).forEach((d, i) => d.classList.toggle('is-active', i === index()));
    grid.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    $$('.review-btn', track).forEach(btn => btn.addEventListener('click', () => {
      const next = Math.max(0, Math.min(cards.length - 1, index() + Number(btn.dataset.dir)));
      const c = cards[next]; grid.scrollTo({ left: c.offsetLeft - (grid.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
    }));
  });

  /* year */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* before/after slider: .ba[data-ba] with input[type=range] */
  $$('.ba').forEach(ba => {
    const range = $('input[type=range]', ba);
    if (!range) return;
    const set = v => ba.style.setProperty('--pos', v + '%');
    range.addEventListener('input', () => set(range.value)); set(range.value);
  });
})();
