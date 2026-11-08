/* Site menu: a sticky top bar on every page. Links sit in a row on wide
   screens and fold into a menu button on phones. Edit LINKS to change it. */
(function () {
  var LINKS = [
    ['How it works', '#how'],
    ['The house', '#house'],
    ['Comedians', '#comedians'],
    ['Opening lines', '#prompts'],
    ['The Experiment', '#experiment']
  ];
  var CTA = ['Fund the Research 🧪', 'fund.html'];

  var path = location.pathname.split('/').pop() || 'index.html';
  var home = path === 'index.html' || path === '';
  var here = function (href) { return href === path; };

  var css = '' +
    'html{scroll-padding-top:72px}' +
    '.top>.wrap>.back{display:none}' +
    '.sitenav{position:sticky;top:0;z-index:1000;background:rgba(0,0,0,.92);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#FFFFFF;border-bottom:1px solid rgba(255,255,255,.08)}' +
    '.sitenav__in{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:18px;height:60px;padding:0 max(16px,env(safe-area-inset-left,0px))}' +
    '.sitenav__brand{display:flex;align-items:center;gap:10px;color:#FFFFFF;text-decoration:none;font:400 1.05rem/1 "Dela Gothic One","Arial Black",sans-serif;white-space:nowrap;margin-right:auto}' +
    '.sitenav__brand svg{width:34px;height:34px;flex:none}' +
    '.sitenav__links{display:flex;align-items:center;gap:4px;list-style:none;margin:0;padding:0}' +
    '.sitenav__links a{display:block;color:#E8E8E4;text-decoration:none;font:500 .95rem/1 "Figtree",system-ui,sans-serif;padding:10px 11px;border-radius:999px;white-space:nowrap}' +
    '.sitenav__links a:hover,.sitenav__links a[aria-current]{color:#FFFFFF;background:rgba(255,255,255,.1)}' +
    '.sitenav__links a.cta{background:#3FCF9E;color:#0B0B0B;font-weight:700;padding:11px 16px;margin-left:6px}' +
    '.sitenav__links a.cta:hover{background:#7FE0BF;color:#0B0B0B}' +
    '.sitenav__toggle{display:none;align-items:center;gap:8px;background:transparent;border:1.5px solid rgba(255,255,255,.35);color:#FFFFFF;border-radius:999px;padding:9px 14px;font:700 .9rem/1 "Figtree",system-ui,sans-serif;cursor:pointer}' +
    '.sitenav__toggle i{display:grid;gap:4px;width:16px}.sitenav__toggle i b{display:block;height:2px;background:currentColor;border-radius:2px;transition:transform .25s,opacity .2s}' +
    '.sitenav.open .sitenav__toggle i b:nth-child(1){transform:translateY(6px) rotate(45deg)}.sitenav.open .sitenav__toggle i b:nth-child(2){opacity:0}.sitenav.open .sitenav__toggle i b:nth-child(3){transform:translateY(-6px) rotate(-45deg)}' +
    '@media (max-width:980px){' +
      '.sitenav__toggle{display:inline-flex}' +
      '.sitenav__links{position:absolute;left:0;right:0;top:60px;flex-direction:column;align-items:stretch;gap:2px;padding:10px 16px 20px;background:#000;border-bottom:1px solid rgba(255,255,255,.12);box-shadow:0 18px 30px rgba(0,0,0,.4);display:none}' +
      '.sitenav.open .sitenav__links{display:flex}' +
      '.sitenav__links a{font-size:1.15rem;padding:14px 12px;border-radius:12px}' +
      '.sitenav__links a.cta{margin:10px 0 0;text-align:center;padding:16px}' +
    '}';

  var logo = '<svg viewBox="0 0 140 140" aria-hidden="true"><defs><linearGradient id="navdm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3FD6CF"/><stop offset=".55" stop-color="#14A37F"/><stop offset="1" stop-color="#0A4F3E"/></linearGradient></defs>' +
    '<ellipse cx="70" cy="70" rx="64" ry="20" fill="none" stroke="#FFFFFF" stroke-width="5" opacity=".55" transform="rotate(-18 70 70)"/><circle cx="70" cy="70" r="40" fill="url(#navdm)"/>' +
    '<path d="M6 70A64 20 0 0 0 134 70" fill="none" stroke="#FFFFFF" stroke-width="5" transform="rotate(-18 70 70)"/>' +
    '<text x="70" y="82" text-anchor="middle" font-family="Dela Gothic One, Arial Black, sans-serif" font-size="34" fill="#FFFFFF">!?</text></svg>';

  function build() {
    if (document.querySelector('.sitenav')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var items = LINKS.map(function (l) {
      return '<li><a href="' + (home ? '' : './') + l[1] + '">' + l[0] + '</a></li>';
    }).join('') + '<li><a class="cta" href="' + CTA[1] + '"' + (here(CTA[1]) ? ' aria-current="page"' : '') + '>' + CTA[0] + '</a></li>';
    var nav = document.createElement('nav');
    nav.className = 'sitenav'; nav.setAttribute('aria-label', 'Site');
    nav.innerHTML = '<div class="sitenav__in"><a class="sitenav__brand" href="' + (home ? '#top' : './') + '">' + logo + '<span>What on Earth!?</span></a>' +
      '<button class="sitenav__toggle" type="button" aria-expanded="false" aria-controls="sitenav-links"><i aria-hidden="true"><b></b><b></b><b></b></i>Menu</button>' +
      '<ul class="sitenav__links" id="sitenav-links">' + items + '</ul></div>';
    document.body.insertBefore(nav, document.body.firstChild);
    if (home && !document.getElementById('top')) document.body.id = document.body.id || 'top';

    var btn = nav.querySelector('.sitenav__toggle');
    function set(open) { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); }
    btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
    nav.querySelector('ul').addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) set(false); });
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
