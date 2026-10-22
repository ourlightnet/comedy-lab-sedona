/* Opening Lines: add a line, vote it up or down, sort by Top or New.
   With Supabase set in lines-config.js, everything is shared through its
   REST API. Without it, a local store in the browser stands in so the page
   still works for previewing. Each browser gets a random voter id, which
   allows one vote per line per browser. */
(function () {
  var cfg = window.LINES_CONFIG || {};
  var live = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  var SEED = [
    { id: 1, text: 'Welcome to the simulation theory help line, where we care about your reality. How may I help you?', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-01T00:00:00Z', score: 0 },
    { id: 2, text: 'My dead grandmother showed up in my kitchen last night and tried to explain the dimensions to me using a pizza.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-01T00:00:01Z', score: 0 },
    { id: 3, text: 'Hi, I’m your spirit guide. I’m new, so bear with me.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:00:00Z', score: 0 },
    { id: 4, text: 'The vortex in my backyard started charging admission.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:00:01Z', score: 0 },
    { id: 5, text: 'My future self showed up and asked to borrow money.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:00:02Z', score: 0 },
    { id: 7, text: 'The universe answered my prayers, but it replied-all.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:00:04Z', score: 0 },
    { id: 8, text: 'Today, at Time Travel Traffic School, we’ll be covering yesterday.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:00:05Z', score: 0 },
    { id: 9, text: 'An alien moved into the guest room and keeps asking why we pay for water.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:01:00Z', score: 0 },
    { id: 10, text: 'Welcome to Earth orientation. Rule one: never tell them you can read minds at the coffee shop.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:01:01Z', score: 0 },
    { id: 11, text: 'So aliens finally landed and all they wanted to do was talk to the dolphins.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:02:00Z', score: 0 },
    { id: 12, text: 'I’m your guardian angel. We need to discuss your definition of ‘a sign.’', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:03:00Z', score: 0 },
    { id: 13, text: 'You asked the universe for a partner. We sent three. You called them lessons.', name: 'The Comedy Lab', city: 'Sedona', created_at: '2026-10-22T00:04:00Z', score: 0 }
  ];

  function store(k, v) {
    try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); }
    catch (e) { return null; }
  }
  var voter = store('cl-voter');
  if (!voter) {
    voter = (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, function () { return (Math.random() * 16 | 0).toString(16); }));
    store('cl-voter', voter);
  }

  /* Backends: both return promises with the same shapes. */
  var api = live ? (function () {
    var base = cfg.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/';
    var h = { apikey: cfg.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + cfg.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' };
    function req(path, opts) {
      return fetch(base + path, Object.assign({ headers: h }, opts)).then(function (r) {
        if (!r.ok) return r.text().then(function (t) { throw new Error(t || r.status); });
        return r.status === 204 ? null : r.json();
      });
    }
    return {
      list: function () { return req('lines_ranked?select=*'); },
      mine: function () { return req('rpc/my_votes', { method: 'POST', body: JSON.stringify({ p_voter: voter }) }); },
      add: function (l) { return req('lines', { method: 'POST', headers: Object.assign({ Prefer: 'return=minimal' }, h), body: JSON.stringify(l) }); },
      vote: function (id, v) { return req('rpc/cast_vote', { method: 'POST', body: JSON.stringify({ p_line: id, p_voter: voter, p_value: v }) }); }
    };
  })() : (function () {
    var lines = store('cl-lines') || SEED.slice();
    // Starting lines added after someone's first visit still show up for them.
    // Starting lines we've taken down disappear for returning visitors too.
    var REMOVED = [6];
    lines = lines.filter(function (l) { return REMOVED.indexOf(l.id) < 0; });
    SEED.forEach(function (s) { if (!lines.some(function (l) { return l.id === s.id; })) lines.push(s); });
    var votes = store('cl-votes') || {};
    return {
      list: function () {
        return Promise.resolve(lines.map(function (l) { return Object.assign({}, l, { score: (votes[l.id] || 0) }); }));
      },
      mine: function () { return Promise.resolve(Object.keys(votes).map(function (k) { return { line_id: +k, value: votes[k] }; })); },
      add: function (l) {
        lines.push(Object.assign({ id: Date.now(), created_at: new Date().toISOString() }, l));
        store('cl-lines', lines); return Promise.resolve();
      },
      vote: function (id, v) { if (v) votes[id] = v; else delete votes[id]; store('cl-votes', votes); return Promise.resolve(); }
    };
  })();

  var list = document.getElementById('list');
  var form = document.getElementById('add');
  var msg = document.getElementById('msg');
  var text = document.getElementById('text');
  var count = document.getElementById('count');
  document.getElementById('preview').hidden = live;

  var rows = [], mine = {}, sort = 'top';
  var UP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l8 9h-5v7H9v-7H4z" fill="currentColor"/></svg>';
  var DOWN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20l-8-9h5V4h6v7h5z" fill="currentColor"/></svg>';

  function esc(s) { return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function render() {
    var sorted = rows.slice().sort(sort === 'top'
      ? function (a, b) { return b.score - a.score || (b.created_at > a.created_at ? 1 : -1); }
      : function (a, b) { return b.created_at > a.created_at ? 1 : -1; });
    var limit = +list.dataset.limit || 0;
    if (limit) sorted = sorted.slice(0, limit);
    if (!sorted.length) { list.innerHTML = '<li class="empty">No lines yet. Add the first one.</li>'; return; }
    list.innerHTML = sorted.map(function (l, i) {
      var m = mine[l.id] || 0;
      var who = [l.name, l.city].filter(Boolean).map(esc).join(', ');
      return '<li class="line" data-id="' + l.id + '"><div class="vote">' +
        '<button class="up" aria-label="Vote up" aria-pressed="' + (m === 1) + '">' + UP + '</button>' +
        '<b aria-label="Score">' + l.score + '</b>' +
        '<button class="down" aria-label="Vote down" aria-pressed="' + (m === -1) + '">' + DOWN + '</button></div>' +
        '<div><q>' + esc(l.text) + '</q><div class="by">' + (sort === 'top' ? '<span class="rank">#' + (i + 1) + '</span>' : '') + (who ? 'by ' + who : 'anonymous') + '</div></div></li>';
    }).join('');
  }

  function load() {
    return Promise.all([api.list(), api.mine()]).then(function (r) {
      rows = r[0] || [];
      mine = {}; (r[1] || []).forEach(function (v) { mine[v.line_id] = v.value; });
      render();
    }).catch(function () { list.innerHTML = '<li class="empty">Could not load lines right now. Please try again.</li>'; });
  }

  list.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var id = +b.closest('.line').dataset.id;
    var row = rows.find(function (r) { return r.id === id; }); if (!row) return;
    var want = b.classList.contains('up') ? 1 : -1;
    var prev = mine[id] || 0, next = prev === want ? 0 : want;
    row.score += next - prev; mine[id] = next; render();
    api.vote(id, next).catch(function () { row.score -= next - prev; mine[id] = prev; render(); });
  });

  document.querySelectorAll('.tabs button').forEach(function (t) {
    t.addEventListener('click', function () {
      sort = t.dataset.sort;
      document.querySelectorAll('.tabs button').forEach(function (o) { o.setAttribute('aria-selected', String(o === t)); });
      render();
    });
  });

  text.addEventListener('input', function () { count.textContent = text.value.length + ' / 280'; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = text.value.trim();
    msg.hidden = false; msg.className = 'msg';
    if (t.length < 10) { msg.className = 'msg err'; msg.textContent = 'Give it a bit more: at least 10 characters.'; return; }
    var btn = form.querySelector('button'); btn.disabled = true;
    api.add({ text: t, name: form.name.value.trim() || null, city: form.city.value.trim() || null }).then(function () {
      text.value = ''; count.textContent = '0 / 280';
      msg.textContent = 'Posted. Thanks for the line!';
      sort = 'new';
      document.querySelectorAll('.tabs button').forEach(function (o) { o.setAttribute('aria-selected', String(o.dataset.sort === 'new')); });
      return load();
    }).catch(function () { msg.className = 'msg err'; msg.textContent = 'That did not post. Please try again.'; })
      .then(function () { btn.disabled = false; });
  });

  load();
})();
