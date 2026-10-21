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
      var sms = form.querySelector('[name="SMS"]');
      if (sms) {
        var digits = sms.value.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
        var optin = form.querySelector('[name="SMS_OPTIN"]');
        var keep = digits.length >= 10 && (!optin || optin.checked);
        sms.value = digits;
        sms.disabled = !keep;
        form.querySelector('[name="SMS__COUNTRY_CODE"]').disabled = !keep;
        if (optin) optin.disabled = true;
        setTimeout(function () { sms.disabled = false; if (optin) optin.disabled = false; form.querySelector('[name="SMS__COUNTRY_CODE"]').disabled = false; }, 500);
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

/* Copy buttons in the donate section. */
(function(){
  document.querySelectorAll('.donate .copy').forEach(function(b){
    b.addEventListener('click',function(){
      var m=b.closest('.donate-info').querySelector('.btc-done');
      var done=function(){m.hidden=false;setTimeout(function(){m.hidden=true},2000)};
      if(navigator.clipboard)navigator.clipboard.writeText(b.dataset.addr).then(done);
    });
  });
})();

/* Partner logos animate in when they scroll into view. */
(function(){
  var els=document.querySelectorAll('.collab-logos,.logo-grid');
  if(!els.length)return;
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('seen')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('seen');io.unobserve(e.target)}})},{threshold:.25});
  els.forEach(function(e){io.observe(e)});
})();
