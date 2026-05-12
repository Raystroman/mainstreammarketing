(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Custom cursor
  if (canHover && !reduce) {
    var dot = document.createElement('div'); dot.id = 'cursor-dot';
    var ring = document.createElement('div'); ring.id = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add('has-custom-cursor');
    var mx = window.innerWidth/2, my = window.innerHeight/2;
    var rx = mx, ry = my;
    window.addEventListener('mousemove', function(e){ mx = e.clientX; my = e.clientY; dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)'; });
    function loop(){
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    document.addEventListener('mouseover', function(e){
      var t = e.target.closest('a, button, [role=button], .step-card, .glass-card, [data-cursor-hover]');
      if (t) { dot.classList.add('is-hover'); ring.classList.add('is-hover'); }
    });
    document.addEventListener('mouseout', function(e){
      var t = e.target.closest('a, button, [role=button], .step-card, .glass-card, [data-cursor-hover]');
      if (t) { dot.classList.remove('is-hover'); ring.classList.remove('is-hover'); }
    });

    // Ambient sections follow cursor
    var ambients = document.querySelectorAll('[data-ambient]');
    window.addEventListener('mousemove', function(e){
      ambients.forEach(function(a){
        var r = a.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          a.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          a.style.setProperty('--my', (e.clientY - r.top) + 'px');
          a.classList.add('is-active');
        } else {
          a.classList.remove('is-active');
        }
      });
    });
  }

  function fmt(n, sep) { return sep ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : n.toString(); }
  function runCountup(el) {
    var target = parseFloat(el.getAttribute('data-countup'));
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var sep = el.getAttribute('data-sep') === '1';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var duration = 1600;
    var start = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = target * eased;
      var out = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
      if (sep && decimals === 0) out = fmt(Math.round(v), true);
      el.textContent = prefix + out + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finalize(el) {
    el.classList.add('is-in');
    if (el.matches('[data-word-reveal]') || el.querySelector('[data-word-reveal]')) {
      var scope = el.matches('[data-word-reveal]') ? el : el.querySelector('[data-word-reveal]');
      var ws = scope.querySelectorAll('.w');
      ws.forEach(function(w, i){ w.style.transitionDelay = (i * 60) + 'ms'; });
    }
    var cu = el.matches('[data-countup]') ? [el] : Array.from(el.querySelectorAll('[data-countup]'));
    cu.forEach(function(n){
      if (reduce) {
        var t = parseFloat(n.getAttribute('data-countup'));
        var prefix = n.getAttribute('data-prefix') || '';
        var suffix = n.getAttribute('data-suffix') || '';
        var sep = n.getAttribute('data-sep') === '1';
        n.textContent = prefix + (sep ? fmt(Math.round(t), true) : Math.round(t).toString()) + suffix;
      } else {
        runCountup(n);
      }
    });
  }

  if (typeof IntersectionObserver === 'undefined') {
    document.querySelectorAll('.reveal,.reveal-left,.reveal-pop,.timeline-line').forEach(finalize);
    document.querySelectorAll('[data-countup]').forEach(function(el){ if (!el.closest('.reveal,.reveal-left,.reveal-pop')) runCountup(el); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        setTimeout(function(){ finalize(el); }, delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-pop, .timeline-line').forEach(function(el){ io.observe(el); });

  // Standalone word-reveal not wrapped in a .reveal
  var wrIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        var el = entry.target;
        var ws = el.querySelectorAll('.w');
        ws.forEach(function(w, i){ w.style.transitionDelay = (i * 60) + 'ms'; });
        el.classList.add('is-in');
        wrIo.unobserve(el);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-word-reveal]').forEach(function(el){
    if (!el.closest('.reveal, .reveal-left, .reveal-pop')) wrIo.observe(el);
  });

  // Standalone countups not wrapped in a reveal
  var cuIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        runCountup(entry.target);
        cuIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-countup]').forEach(function(el){
    if (!el.closest('.reveal, .reveal-left, .reveal-pop')) cuIo.observe(el);
  });
})();


/* ===== Proof Carousel ===== */
(function(){
  var carousel = document.querySelector('.proof-carousel');
  if (!carousel) return;
  var track = carousel.querySelector('.proof-track');
  var slides = carousel.querySelectorAll('.proof-slide');
  var dots = carousel.querySelectorAll('.proof-dot');
  var total = slides.length;
  var current = 0;

  function goTo(n) {
    current = (n + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i){ d.classList.toggle('is-active', i === current); });
  }

  goTo(0);

  carousel.querySelector('.proof-prev').addEventListener('click', function(){ goTo(current - 1); });
  carousel.querySelector('.proof-next').addEventListener('click', function(){ goTo(current + 1); });
  dots.forEach(function(d, i){ d.addEventListener('click', function(){ goTo(i); }); });

  // Touch swipe
  var startX = 0, startY = 0, dragging = false;
  track.addEventListener('touchstart', function(e){
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragging = true;
  }, { passive: true });
  track.addEventListener('touchend', function(e){
    if (!dragging) return;
    dragging = false;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  // Keyboard left/right when carousel is focused
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', function(e){
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });
})();


/* ===== Meta Pixel — tracking data capture ===== */
(function(){
  var data = { fbp: '', fbc: '', fbclid: '', landing_page_url: '', user_agent: '' };

  // Read a cookie by name
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|;)\\s*' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  // Capture fbclid from URL params (present on Meta ad click-throughs)
  try {
    var params = new URLSearchParams(window.location.search);
    data.fbclid = params.get('fbclid') || '';
  } catch (e) {}

  // Read _fbp and _fbc cookies set by Meta Pixel
  data.fbp = getCookie('_fbp');
  data.fbc = getCookie('_fbc');

  // Construct fbc from fbclid if cookie is missing
  if (!data.fbc && data.fbclid) {
    data.fbc = 'fb.1.' + Date.now() + '.' + data.fbclid;
  }

  data.landing_page_url = window.location.href;
  data.user_agent = navigator.userAgent;

  window.__pixelData = data;
})();


/* ===== Qualification Wizard ===== */
(function(){
  var WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/zpcsycTHoHZmUwrfk5zn/webhook-trigger/8e82fc4c-5fe0-4bdb-8c61-cfe0e9e7d453';

  var overlay = document.getElementById('wizard-overlay');
  if (!overlay) return;
  var modal = overlay.querySelector('.wiz-modal');
  var progress = document.getElementById('wiz-progress-bar');
  var errorEl = document.getElementById('wiz-error');

  // Flow definition (linear sequence of step ids; branches handled inline)
  var FLOW = ['business_name', 'services', 'revenue', 'struggle', 'growth_open', 'contact'];
  var state = {
    business_name: '',
    website: '',
    services: [],
    revenue: '',
    struggle: '',
    growth_open: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  };
  var history = []; // step ids visited, for back button

  function getStep(id) { return overlay.querySelector('.wiz-step[data-step="' + id + '"]'); }
  function setActive(id) {
    overlay.querySelectorAll('.wiz-step').forEach(function(s){ s.classList.remove('is-active'); });
    var el = getStep(id);
    if (el) el.classList.add('is-active');
    // Reset wide modal class (only the calendar step is wide)
    if (id === 'booked') modal.classList.add('is-wide');
    else modal.classList.remove('is-wide');
    // Progress bar (terminal screens override)
    var pct;
    if (id === 'booked') pct = 100;
    else if (id === 'submitting') pct = 95;
    else {
      var idx = FLOW.indexOf(id);
      pct = idx >= 0 ? Math.round(((idx + 1) / FLOW.length) * 100) : 10;
    }
    progress.style.width = pct + '%';
    // Focus first input
    setTimeout(function(){
      var input = el && el.querySelector('input, textarea');
      if (input) input.focus();
    }, 200);
  }

  function go(nextId) {
    var current = overlay.querySelector('.wiz-step.is-active');
    if (current) history.push(current.getAttribute('data-step'));
    setActive(nextId);
  }
  function goBack() {
    if (!history.length) return;
    var prev = history.pop();
    setActive(prev);
  }

  function open() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('wiz-locked');
    history = [];
    // Reset state and inputs
    Object.keys(state).forEach(function(k){ state[k] = ''; });
    state.services = [];
    overlay.querySelectorAll('input, textarea').forEach(function(i){ i.value = ''; i.classList.remove('is-error'); });
    overlay.querySelectorAll('.wiz-choice').forEach(function(c){ c.classList.remove('is-selected'); });
    if (errorEl) { errorEl.hidden = true; errorEl.textContent = ''; }
    setActive(FLOW[0]);
  }
  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('wiz-locked');
  }

  // Open triggers
  document.querySelectorAll('[data-open-wizard]').forEach(function(btn){
    btn.addEventListener('click', function(e){ e.preventDefault(); open(); });
  });
  // Close triggers
  overlay.querySelectorAll('[data-wiz-close]').forEach(function(btn){
    btn.addEventListener('click', close);
  });
  overlay.addEventListener('click', function(e){
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  // Step: business_name → services
  getStep('business_name').querySelector('[data-next]').addEventListener('click', function(){
    var biz = getStep('business_name').querySelector('input[name="business_name"]').value.trim();
    var web = getStep('business_name').querySelector('input[name="website"]').value.trim();
    if (!biz) { flagError('business_name', 'business_name'); return; }
    state.business_name = biz;
    state.website = web;
    go('services');
  });

  // Step: services (multi-select) → revenue
  getStep('services').querySelectorAll('.wiz-choice').forEach(function(c){
    c.addEventListener('click', function(){
      c.classList.toggle('is-selected');
    });
  });
  getStep('services').querySelector('[data-next]').addEventListener('click', function(){
    var picks = [];
    getStep('services').querySelectorAll('.wiz-choice.is-selected').forEach(function(c){
      picks.push(c.getAttribute('data-value'));
    });
    if (!picks.length) {
      errorEl.textContent = 'Pick at least one service.';
      errorEl.hidden = false;
      setTimeout(function(){ errorEl.hidden = true; }, 2200);
      return;
    }
    state.services = picks;
    go('revenue');
  });

  // Step: revenue choices → struggle
  getStep('revenue').querySelectorAll('.wiz-choice').forEach(function(c){
    c.addEventListener('click', function(){
      state.revenue = c.getAttribute('data-value');
      go('struggle');
    });
  });

  // Step: struggle → growth_open
  getStep('struggle').querySelectorAll('.wiz-choice').forEach(function(c){
    c.addEventListener('click', function(){
      state.struggle = c.getAttribute('data-value');
      go('growth_open');
    });
  });

  // Step: growth_open → contact
  getStep('growth_open').querySelectorAll('.wiz-choice').forEach(function(c){
    c.addEventListener('click', function(){
      state.growth_open = c.getAttribute('data-value');
      go('contact');
    });
  });

  // Back buttons
  overlay.querySelectorAll('[data-back]').forEach(function(btn){
    btn.addEventListener('click', goBack);
  });

  // Submit
  getStep('contact').querySelector('[data-submit]').addEventListener('click', function(){
    var contact = getStep('contact');
    var first = contact.querySelector('input[name="first_name"]');
    var last = contact.querySelector('input[name="last_name"]');
    var email = contact.querySelector('input[name="email"]');
    var phone = contact.querySelector('input[name="phone"]');
    [first, last, email, phone].forEach(function(i){ i.classList.remove('is-error'); });
    var bad = false;
    if (!first.value.trim()) { first.classList.add('is-error'); bad = true; }
    if (!last.value.trim()) { last.classList.add('is-error'); bad = true; }
    if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { email.classList.add('is-error'); bad = true; }
    if (phone.value.trim().replace(/\D/g,'').length < 7) { phone.classList.add('is-error'); bad = true; }
    if (bad) {
      errorEl.textContent = 'Please fill out all fields with a valid email and phone.';
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;
    state.first_name = first.value.trim();
    state.last_name = last.value.trim();
    state.email = email.value.trim();
    state.phone = phone.value.trim();
    submit();
  });

  function flagError(stepId, fieldName) {
    var input = getStep(stepId).querySelector('[name="' + fieldName + '"]');
    if (input) {
      input.classList.add('is-error');
      input.focus();
      setTimeout(function(){ input.classList.remove('is-error'); }, 1800);
    }
  }

  function submit() {
    go('submitting');

    // Generate deduplicated event IDs for browser Pixel + Zapier CAPI
    var event_id = 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    var qualified_event_id = event_id + '_qualified';

    // Lead quality: "qualified" if open to investing + has revenue + services + contact info
    var invest = state.growth_open;
    var lead_quality = (
      (invest === 'Yes' || invest === 'Possibly') &&
      state.revenue &&
      state.services.length > 0 &&
      state.email &&
      state.phone
    ) ? 'qualified' : 'standard';

    // Fire browser-side Meta Pixel Lead event (Zapier handles server-side CAPI)
    if (typeof fbq === 'function') {
      fbq('track', 'Lead', {}, { eventID: event_id });
    }

    var pd = window.__pixelData || {};
    var payload = {
      first_name: state.first_name,
      last_name: state.last_name,
      full_name: (state.first_name + ' ' + state.last_name).trim(),
      email: state.email,
      phone: state.phone,
      business_name: state.business_name,
      website_or_social: state.website || 'N/A',
      services_wanted: state.services.join(', '),
      current_revenue: state.revenue,
      currently_struggling_with: state.struggle,
      open_to_investing: state.growth_open,
      source: 'mainstream-marketing-landing',
      submitted_at: new Date().toISOString(),
      // Tracking fields for Zapier CAPI
      fbp: pd.fbp || '',
      fbc: pd.fbc || '',
      fbclid: pd.fbclid || '',
      event_source_url: pd.landing_page_url || window.location.href,
      user_agent: pd.user_agent || navigator.userAgent,
      event_id: event_id,
      qualified_event_id: qualified_event_id,
      lead_quality: lead_quality
    };

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(payload)
    }).catch(function(){ /* fire-and-forget; webhook may not return CORS-safe response */ })
      .finally(function(){
        setTimeout(function(){ go('booked'); }, 900);
      });
  }
})();


/* ===== Client Command Center — notification rotator ===== */
(function(){
  var items = Array.prototype.slice.call(
    document.querySelectorAll('#cmdStage .cmd-notif-item')
  );
  if (!items.length) return;

  var FADE_IN  = 480;   // ms to fade in
  var HOLD     = 3200;  // ms to stay visible
  var FADE_OUT = 420;   // ms to fade out
  var INTERVAL = HOLD + FADE_OUT + 80; // total time before next starts

  var idx = 0;

  function applyStyles(el, styles) {
    Object.keys(styles).forEach(function(k){ el.style[k] = styles[k]; });
  }

  function showItem(el) {
    // Start hidden and slightly above
    applyStyles(el, { transition: 'none', opacity: '0', transform: 'translateY(-7px)' });
    // Force browser to register the initial state before animating
    void el.offsetWidth;
    // Animate in
    applyStyles(el, {
      transition: 'opacity ' + FADE_IN + 'ms ease, transform ' + FADE_IN + 'ms ease',
      opacity: '1',
      transform: 'translateY(0)'
    });
  }

  function hideItem(el, done) {
    // Fade out in place (no transform change so it doesn't jump)
    applyStyles(el, {
      transition: 'opacity ' + FADE_OUT + 'ms ease',
      opacity: '0'
    });
    setTimeout(function() {
      // Reset inline styles so it's clean for next cycle
      el.removeAttribute('style');
      if (done) done();
    }, FADE_OUT + 20);
  }

  // Show first notification immediately on load
  showItem(items[0]);

  // Rotate
  setInterval(function() {
    var outgoing = items[idx];
    idx = (idx + 1) % items.length;
    var incoming = items[idx];

    hideItem(outgoing, function() {
      showItem(incoming);
    });
  }, INTERVAL);

  // Reduce motion: just show first item statically
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function(el) { el.removeAttribute('style'); });
    items[0].style.opacity = '1';
  }
})();
