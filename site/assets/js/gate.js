/* Temporary password gate for the preview site. It only keeps casual
   visitors out: the pages are still public files on GitHub Pages.
   To remove it, delete the gate.js script tag from each page.
   The password is stored as a SHA-256 hash; change HASH to change it. */
(function () {
  var HASH = 'b6dc933311bc2357cc5fc636a4dbe41a01b7a33b583d043a7f870f3440697e27', KEY = 'cl-gate';
  try { if (localStorage.getItem(KEY) === HASH) return; } catch (e) {}
  var d = document.documentElement;
  d.classList.add('gated');
  var css = document.createElement('style');
  css.textContent = 'html.gated body>*:not(#gate){display:none!important}' +
    '#gate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:16px;background:radial-gradient(circle at 50% 30%,#0F2F33,#000 70%);color:#fff;font-family:Figtree,system-ui,sans-serif}' +
    '#gate form{display:grid;gap:14px;justify-items:center;text-align:center;max-width:360px;width:100%}' +
    '#gate .ufo{font-size:3.4rem;animation:gbob 2.4s ease-in-out infinite}' +
    '@keyframes gbob{50%{transform:translateY(-10px) rotate(-6deg)}}' +
    '#gate h1{margin:0;font:400 1.7rem/1.1 "Dela Gothic One","Arial Black",sans-serif}' +
    '#gate p{margin:0;opacity:.8}' +
    '#gate input{width:100%;padding:14px 16px;border-radius:999px;border:2px solid #3FCF9E;background:#0B0B0B;color:#fff;font:inherit;font-size:1.1rem;text-align:center}' +
    '#gate button{padding:12px 26px;border:0;border-radius:999px;background:#3FCF9E;color:#0B0B0B;font-family:inherit;font-weight:700;font-size:1rem;cursor:pointer}' +
    '#gate .no{min-height:1.2em;color:#FF9B7A;font-weight:700}' +
    '#gate.shake form{animation:gshake .4s}@keyframes gshake{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}';
  d.firstChild ? d.insertBefore(css, d.firstChild) : d.appendChild(css);
  var NOPE = ['Nope. The aliens are unimpressed.', 'Wrong frequency. Try again.', 'Your spirit guide says no.', 'Close! (Not really.)'];
  function sha(s) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }
  function show() {
    var g = document.createElement('div');
    g.id = 'gate';
    g.innerHTML = '<form autocomplete="off"><div class="ufo" aria-hidden="true">🛸</div><h1>What on Earth!?</h1>' +
      '<p>The Comedy Lab is still in the lab. Say the magic word.</p>' +
      '<label for="gate-pw" style="position:absolute;left:-9999px">Password</label>' +
      '<input id="gate-pw" type="password" placeholder="Magic word" autofocus>' +
      '<button type="submit">Beam me in</button><p class="no" role="status"></p></form>';
    document.body.insertBefore(g, document.body.firstChild);
    var n = 0;
    g.querySelector('form').onsubmit = function (e) {
      e.preventDefault();
      sha(g.querySelector('input').value.trim().toLowerCase()).then(function (h) {
        if (h === HASH) {
          try { localStorage.setItem(KEY, HASH); } catch (e) {}
          g.remove(); d.classList.remove('gated');
          if (window.comedyLabCelebrate) window.comedyLabCelebrate();
        } else {
          g.querySelector('.no').textContent = NOPE[n++ % NOPE.length];
          g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake');
        }
      });
    };
  }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
