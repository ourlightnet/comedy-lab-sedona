/* Playful bits: things squish when you press them, buttons throw confetti,
   and a big celebration fires whenever a form or vote succeeds.
   Everything is skipped for visitors who ask for reduced motion. */
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var COLORS = ['#3FCF9E', '#14A37F', '#3FD6CF', '#C9A66B', '#FFFFFF', '#E8734F', '#B48CFF'];
  var EMOJI = ['😂', '🛸', '👽', '✨', '👼', '🪐', '🎉'];
  var canvas, ctx, bits = [], running = false;

  function setup() {
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    size();
    addEventListener('resize', size);
  }
  function size() {
    var r = devicePixelRatio || 1;
    canvas.width = innerWidth * r; canvas.height = innerHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }

  function burst(x, y, n, opts) {
    opts = opts || {};
    for (var i = 0; i < n; i++) {
      var a = opts.down ? Math.PI / 2 + (Math.random() - .5) * 1.2 : Math.random() * Math.PI * 2;
      var v = (opts.speed || 6) * (.5 + Math.random());
      bits.push({
        x: x, y: y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - (opts.down ? 0 : 3),
        r: Math.random() * 6.28, vr: (Math.random() - .5) * .4,
        w: 5 + Math.random() * 6, h: 3 + Math.random() * 5,
        c: COLORS[i % COLORS.length],
        e: opts.emoji ? (opts.emoji.length ? opts.emoji[i % opts.emoji.length] : null) : null,
        life: 0, max: 60 + Math.random() * 50
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    bits = bits.filter(function (b) { return b.life < b.max && b.y < innerHeight + 40; });
    bits.forEach(function (b) {
      b.life++; b.vy += .22; b.vx *= .985; b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.globalAlpha = Math.max(0, 1 - b.life / b.max);
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
      if (b.e) { ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.fillText(b.e, 0, 0); }
      else { ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    if (bits.length) requestAnimationFrame(tick); else running = false;
  }

  /* Confetti rain across the whole screen, for the big wins. */
  function celebrate() {
    for (var i = 0; i < 6; i++) {
      (function (i) {
        setTimeout(function () {
          burst(innerWidth * (i + .5) / 6, -10, 18, { down: true, speed: 4 });
          burst(innerWidth * (i + .5) / 6, -10, 3, { down: true, speed: 3, emoji: EMOJI });
        }, i * 70);
      })(i);
    }
  }
  window.comedyLabCelebrate = celebrate;

  function squish(el) {
    if (!el.animate) return;
    el.animate([
      { transform: 'scale(1)' }, { transform: 'scale(.92)' },
      { transform: 'scale(1.06)' }, { transform: 'scale(1)' }
    ], { duration: 380, easing: 'cubic-bezier(.3,1.6,.5,1)' });
  }

  function onClick(e) {
    var t = e.target;
    var x = e.clientX, y = e.clientY;
    if (!x && !y) { var r = t.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }

    var up = t.closest('.vote .up'), down = t.closest('.vote .down');
    if (up) { squish(up); burst(x, y, 16, { speed: 4 }); return; }
    if (down) { squish(down); burst(x, y, 4, { speed: 2, emoji: ['💨'] }); return; }

    var star = t.closest('.slot.star');
    if (star && !t.closest('a')) { squish(star); burst(x, y, 8, { speed: 5, emoji: ['😂', '🤣', '✨'] }); return; }

    var logo = t.closest('.hero svg, .back svg');
    if (logo && logo.animate) {
      logo.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg) scale(1.15)' }, { transform: 'rotate(360deg)' }],
        { duration: 900, easing: 'cubic-bezier(.3,1.4,.5,1)' });
      burst(x, y, 6, { speed: 5, emoji: ['🛸', '👽', '🪐'] });
      return;
    }

    var btn = t.closest('.btn, button, .copy, .tabs button');
    if (btn) { squish(btn); burst(x, y, 22, { speed: 6 }); return; }

    var tile = t.closest('.logo-grid > *, .collab-logos > *, .slot, .ph, .links a, .donate');
    if (tile) { squish(tile); burst(x, y, 10, { speed: 4 }); }
  }

  /* Celebrate whenever a thank-you or success message appears. */
  function watchSuccess() {
    var sel = '.signup__done, .btc-done, #msg';
    var seen = new WeakSet();
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        var el = m.target;
        if (!el.matches || !el.matches(sel) || el.hidden) return;
        if (el.id === 'msg' && el.classList.contains('err')) return;
        if (el.matches('.btc-done')) { var r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top, 30, { speed: 6 }); return; }
        if (seen.has(el) && el.id !== 'msg') return;
        seen.add(el); celebrate();
      });
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });
  }

  function start() {
    setup();
    document.addEventListener('click', onClick);
    watchSuccess();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
