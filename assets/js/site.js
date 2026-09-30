/* The Barking Lot — site behaviour (vanilla, no dependencies) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900) setMenu(false); });
  }

  /* ---------- Reveal-on-scroll (lines, portraits, blocks) ---------- */
  var revealEls = document.querySelectorAll('.reveal, .lines, .reg, [data-count]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          if (en.target.hasAttribute('data-count')) countUp(en.target);
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Counters (years count up to the real value) ---------- */
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var start = parseFloat(el.getAttribute('data-from') || '0');
    var dec = (el.getAttribute('data-count').split('.')[1] || '').length;
    var dur = 1400, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = (start + (end - start) * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step); else el.textContent = el.getAttribute('data-count');
    }
    requestAnimationFrame(step);
  }

  /* ---------- Live open / closed (America/New_York) ---------- */
  // 0=Sun ... 6=Sat ; minutes from midnight
  var HOURS = { 0: null, 1: null, 2: [450, 1050], 3: [450, 1050], 4: [450, 1050], 5: [450, 1050], 6: [480, 1020] };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function fmt(min) {
    var h = Math.floor(min / 60), m = min % 60, ap = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12 === 0 ? 12 : h % 12;
    return hh + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }
  function nyNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var h = parseInt(o.hour, 10) % 24;
      return { day: map[o.weekday], min: h * 60 + parseInt(o.minute, 10) };
    } catch (e) { var d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
  }
  function status() {
    var n = nyNow(), today = HOURS[n.day];
    if (today && n.min >= today[0] && n.min < today[1]) {
      return { open: true, text: 'Open now until ' + fmt(today[1]), day: n.day };
    }
    if (today && n.min < today[0]) return { open: false, text: 'Closed now. Opens today at ' + fmt(today[0]), day: n.day };
    for (var i = 1; i <= 7; i++) {
      var d = (n.day + i) % 7;
      if (HOURS[d]) return { open: false, text: 'Closed now. Opens ' + (i === 1 ? 'tomorrow' : DAYS[d]) + ' at ' + fmt(HOURS[d][0]), day: n.day };
    }
    return { open: false, text: 'Closed now', day: n.day };
  }
  function paintStatus(first) {
    var s = status();
    document.querySelectorAll('[data-status-chip]').forEach(function (c) {
      c.classList.toggle('is-open', s.open); c.classList.toggle('is-closed', !s.open);
      var t = c.querySelector('.txt'); if (t) t.textContent = s.text;
    });
    document.querySelectorAll('[data-sign]').forEach(function (sign) {
      var was = sign.classList.contains('is-open') ? 'open' : sign.classList.contains('is-closed') ? 'closed' : '';
      var now = s.open ? 'open' : 'closed';
      sign.classList.toggle('is-open', s.open); sign.classList.toggle('is-closed', !s.open);
      var w = sign.querySelector('.sign-word'); if (w) w.textContent = s.open ? 'Open' : 'Closed';
      var sub = sign.querySelector('.sign-sub'); if (sub) sub.textContent = s.text;
      if (!reduce && (first || was !== now)) {
        var flipNow = function () { sign.classList.remove('flip'); void sign.offsetWidth; sign.classList.add('flip'); };
        if (first && 'IntersectionObserver' in window) {
          var so = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { flipNow(); so.disconnect(); } }, { threshold: 0.4 });
          so.observe(sign);
        } else if (!first) { flipNow(); }
      }
    });
    document.querySelectorAll('.hours tr[data-day]').forEach(function (tr) {
      tr.classList.toggle('today', parseInt(tr.getAttribute('data-day'), 10) === s.day);
      var th = tr.querySelector('th');
      if (th && parseInt(tr.getAttribute('data-day'), 10) === s.day && !th.querySelector('.visually-hidden')) {
        var v = document.createElement('span'); v.className = 'visually-hidden'; v.textContent = ' (today)'; th.appendChild(v);
      }
    });
  }
  paintStatus(true);
  setInterval(function () { paintStatus(false); }, 60000);

  /* ---------- Hero soap bubbles (canvas, paused off-screen) ---------- */
  var canvas = document.querySelector('.bubbles');
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext('2d');
    var bubbles = [], pops = [], running = false, visible = true, W = 0, H = 0, dpr = 1, raf = 0, last = 0;
    function size() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(initial) {
      var r = 4 + Math.random() * (W < 600 ? 12 : 18);
      return {
        x: r + Math.random() * (W - 2 * r), y: initial ? H * (0.3 + Math.random() * 0.7) : H + r,
        r: r, vy: 14 + Math.random() * 22, amp: 6 + Math.random() * 14, ph: Math.random() * 6.28,
        popAt: H * (0.05 + Math.random() * 0.55)
      };
    }
    function drawBubble(b) {
      var g = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, b.x, b.y, b.r);
      g.addColorStop(0, 'rgba(255,255,255,0.28)');
      g.addColorStop(0.7, 'rgba(180,230,230,0.06)');
      g.addColorStop(1, 'rgba(244,250,251,0.35)');
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.2832); ctx.fillStyle = g; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(244,250,251,0.45)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(b.x - b.r * 0.38, b.y - b.r * 0.38, b.r * 0.22, 0, 6.2832);
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();
    }
    function tick(ts) {
      if (!running) return;
      var dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
      ctx.clearRect(0, 0, W, H);
      var target = W < 600 ? 10 : 18;
      while (bubbles.length < target) bubbles.push(spawn(false));
      for (var i = bubbles.length - 1; i >= 0; i--) {
        var b = bubbles[i];
        b.y -= b.vy * dt; b.ph += dt * 1.4;
        b.x += Math.sin(b.ph) * b.amp * dt;
        if (b.x < b.r) b.x = b.r; if (b.x > W - b.r) b.x = W - b.r;
        if (b.y < b.popAt) { pops.push({ x: b.x, y: b.y, r: b.r, t: 0 }); bubbles.splice(i, 1); continue; }
        drawBubble(b);
      }
      for (var j = pops.length - 1; j >= 0; j--) {
        var p = pops[j]; p.t += dt * 3.2;
        if (p.t >= 1) { pops.splice(j, 1); continue; }
        ctx.strokeStyle = 'rgba(244,250,251,' + (0.5 * (1 - p.t)) + ')'; ctx.lineWidth = 1.2;
        for (var k = 0; k < 6; k++) {
          var a = k * 1.047, r1 = p.r * (1 + p.t * 0.6), r2 = p.r * (1.2 + p.t * 1.1);
          ctx.beginPath(); ctx.moveTo(p.x + Math.cos(a) * r1, p.y + Math.sin(a) * r1);
          ctx.lineTo(p.x + Math.cos(a) * r2, p.y + Math.sin(a) * r2); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(tick);
    }
    function start() { if (running || !visible || document.hidden) return; running = true; last = 0; raf = requestAnimationFrame(tick); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    size();
    for (var s0 = 0; s0 < (W < 600 ? 6 : 10); s0++) bubbles.push(spawn(true));
    window.addEventListener('resize', function () { size(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
    }
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    start();
  }

  /* ---------- Regulars filter ---------- */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var liveRegion = document.getElementById('filter-status');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter'), shown = 0;
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      document.querySelectorAll('.regulars-grid .reg').forEach(function (it) {
        var ok = f === 'all' || it.getAttribute('data-kind') === f;
        it.hidden = !ok; if (ok) { shown++; it.classList.add('is-in'); }
      });
      if (liveRegion) liveRegion.textContent = 'Showing ' + shown + (f === 'all' ? ' portraits' : f === 'cat' ? ' cats' : ' dogs');
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lb-cap'), opener = null, idx = 0;
    function items() { return Array.prototype.slice.call(document.querySelectorAll('.regulars-grid .reg:not([hidden]) .shot')); }
    function show(i) {
      var list = items(); if (!list.length) return;
      idx = (i + list.length) % list.length;
      var b = list[idx], im = b.querySelector('img');
      lbImg.src = b.getAttribute('data-full');
      lbImg.alt = im.alt;
      lbImg.width = parseInt(b.getAttribute('data-w'), 10); lbImg.height = parseInt(b.getAttribute('data-h'), 10);
      lbCap.innerHTML = '';
      var n = document.createElement('strong'); n.textContent = b.getAttribute('data-num');
      lbCap.appendChild(n); lbCap.appendChild(document.createTextNode(im.alt + '. Portrait by Steve Boschen.'));
    }
    document.querySelectorAll('.regulars-grid .shot').forEach(function (b) {
      b.addEventListener('click', function () { opener = b; show(items().indexOf(b)); lb.showModal(); lb.querySelector('.lb-close').focus(); });
    });
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { if (opener) opener.focus(); });
  }

  /* ---------- Appointment request form (Netlify) ---------- */
  var form = document.getElementById('request-form');
  if (form) {
    var success = document.getElementById('form-success');
    var statusEl = form.querySelector('.form-status');
    function showSuccess() {
      form.hidden = true; success.classList.add('show'); success.focus();
    }
    if (/[?&]sent=1/.test(window.location.search)) showSuccess();
    function validate() {
      var ok = true, firstBad = null;
      form.querySelectorAll('[data-req]').forEach(function (f) {
        var input = f.querySelector('input, select, textarea'), good;
        if (input.type === 'radio') good = !!f.querySelector('input:checked');
        else if (input.type === 'tel') good = input.value.replace(/\D/g, '').length >= 10;
        else if (input.type === 'email') good = input.value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        else good = input.value.trim().length > 0;
        f.classList.toggle('invalid', !good);
        input.setAttribute('aria-invalid', good ? 'false' : 'true');
        if (!good) { ok = false; if (!firstBad) firstBad = input; }
      });
      if (firstBad) firstBad.focus();
      return ok;
    }
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      if (!validate()) { statusEl.textContent = 'Please fix the highlighted fields.'; return; }
      var body = new URLSearchParams(new FormData(form)).toString();
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      fetch(form.getAttribute('action').split('?')[0] === 'visit.html' ? '/' : form.getAttribute('action'), {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body
      }).then(function (r) {
        if (!r.ok) throw new Error('bad');
        showSuccess();
      }).catch(function () {
        btn.disabled = false;
        statusEl.textContent = 'Sorry, the request could not be sent right now. Please call (804) 358-4038.';
      });
    });
  }

  /* footer year */
  var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();
