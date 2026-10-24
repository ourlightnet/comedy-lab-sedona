/* Animated Dream Machine favicon: the infinity loop slowly cycles through
   its colors. Chrome, Edge and Firefox animate it; Safari and iOS keep the
   static icon. Pauses when the tab is hidden or motion is reduced. */
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var link = document.querySelector('link[rel="icon"]');
  if (!link) return;
  var img = new Image(), c = document.createElement('canvas'), x = c.getContext('2d');
  if (!x || !('filter' in x)) return;
  c.width = c.height = 64;
  var deg = 0, timer = null;
  function frame() {
    x.clearRect(0, 0, 64, 64);
    x.filter = 'hue-rotate(' + deg + 'deg)';
    var s = 1 + Math.sin(deg * Math.PI / 90) * 0.04, d = 64 * s, o = (64 - d) / 2;
    x.drawImage(img, o, o, d, d);
    link.href = c.toDataURL('image/png');
    deg = (deg + 6) % 360;
  }
  function run() { if (!timer) timer = setInterval(frame, 120); }
  function stop() { clearInterval(timer); timer = null; }
  img.onload = function () {
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : run(); });
    if (!document.hidden) run();
  };
  img.src = link.getAttribute('href');
})();
