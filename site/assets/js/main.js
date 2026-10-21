/* Sign-up forms (Brevo), the same way Fashion Lab Sedona does it.
   Each form.signup posts to its Brevo form URL in the action attribute.
   Brevo replies with a page we don't need, so the post goes to a hidden
   iframe and we show our own thank-you. With no action set yet, the form
   shows an "opens soon" note instead. */
(function () {
  document.querySelectorAll('form.signup').forEach(function (form, i) {
    var done = form.querySelector('.signup__done');
    var soon = form.querySelector('.signup__soon');
    form.addEventListener('submit', function (e) {
      if (!form.getAttribute('action')) {
        e.preventDefault();
        if (soon) soon.hidden = false;
        return;
      }
      var name = 'signup-frame-' + i;
      if (!document.querySelector('iframe[name="' + name + '"]')) {
        var f = document.createElement('iframe');
        f.name = name; f.hidden = true; f.title = 'Sign-up';
        document.body.appendChild(f);
      }
      form.target = name;
      setTimeout(function () {
        form.reset();
        if (done) done.hidden = false;
      }, 400);
    });
  });

  /* Clip uploads go to a hosted upload form (for example Tally).
     Put its link in CLIP_FORM_URL to switch the button on. */
  var CLIP_FORM_URL = '';
  var clip = document.getElementById('clip-link');
  if (clip && CLIP_FORM_URL) {
    clip.href = CLIP_FORM_URL;
    clip.hidden = false;
    document.getElementById('clip-soon').hidden = true;
  }
})();

(function(){
  var d=document.getElementById("lightbox");if(!d||!d.showModal)return;
  var tiles=[].slice.call(document.querySelectorAll(".photos .ph")),i=0;
  function show(n){i=(n+tiles.length)%tiles.length;var t=tiles[i];document.getElementById("lb-img").src=t.querySelector("img").src;document.getElementById("lb-img").alt=t.querySelector("img").alt;document.getElementById("lb-cap").textContent=t.textContent+" · "+(i+1)+" of "+tiles.length}
  tiles.forEach(function(t,n){t.addEventListener("click",function(){show(n);d.showModal()})});
  document.getElementById("lb-prev").onclick=function(){show(i-1)};
  document.getElementById("lb-next").onclick=function(){show(i+1)};
  document.getElementById("lb-close").onclick=function(){d.close()};
  d.addEventListener("click",function(e){if(e.target===d)d.close()});
  d.addEventListener("keydown",function(e){if(e.key==="ArrowLeft")show(i-1);if(e.key==="ArrowRight")show(i+1)});
})();
