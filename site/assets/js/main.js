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

  /* The seat and clip forms email each submission to the team through
     FormSubmit (no account; the first submission sends an activation
     email to the inbox below). */
  var MAIL_TO = 'team@lightnet.org';
  document.querySelectorAll('form.mailform').forEach(function (form) {
    var done = form.querySelector('.signup__done');
    var err = form.querySelector('.signup__err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form._honey.value) return;
      var data = {};
      new FormData(form).forEach(function (v, k) { if (k !== '_honey') data[k] = v; });
      data._subject = form.dataset.subject;
      data._template = 'table';
      var btn = form.querySelector('button'); btn.disabled = true;
      done.hidden = true; err.hidden = true;
      fetch('https://formsubmit.co/ajax/' + MAIL_TO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (r) {
        if (String(r.success) !== 'true') throw new Error(r.message);
        form.reset(); done.hidden = false;
      }).catch(function () { err.hidden = false; })
        .then(function () { btn.disabled = false; });
    });
  });
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
