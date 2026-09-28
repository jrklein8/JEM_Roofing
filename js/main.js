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
    const fab = $('.float-cta');
    if (fab) fab.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7 && !contactInView);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
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
