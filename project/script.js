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
