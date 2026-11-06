(function () {
  var nav = document.querySelector('.nav');
  var btn = document.querySelector('.menu-btn');
  if (btn) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Hero demo panels: one pass on load, then hover, focus or tap.
  var demos = Array.prototype.slice.call(document.querySelectorAll('.demo'));
  if (demos.length) {
    demos.forEach(function (d) {
      d.addEventListener('click', function () {
        var was = d.classList.contains('on');
        demos.forEach(function (o) { o.classList.remove('on'); });
        if (!was) d.classList.add('on');
      });
    });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      demos.forEach(function (d, k) {
        setTimeout(function () { d.classList.add('on'); }, 600 + k * 900);
        setTimeout(function () { d.classList.remove('on'); }, 3000 + k * 900);
      });
    }
  }

  // Publication filters
  var fbtns = document.querySelectorAll('.filters button');
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      fbtns.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var f = b.getAttribute('data-f');
      document.querySelectorAll('.pubs .pub').forEach(function (li) {
        var show = f === 'all' || (li.getAttribute('data-f') || '').split(' ').indexOf(f) > -1;
        li.hidden = !show;
      });
    });
  });

  // Bio-VQA live demo: a random question, the visitor's answer, then all 18 models.
  var vd = document.querySelector('.vd');
  if (vd && window.fetch) {
    var src = vd.getAttribute('data-src'), base = src.replace(/[^\/]*$/, '');
    var els = { sel: vd.querySelector('select'), img: vd.querySelector('.vd-img img'), task: vd.querySelector('.vd-task'),
      q: vd.querySelector('.vd-q'), form: vd.querySelector('.vd-form'), ch: vd.querySelector('.vd-choices'),
      res: vd.querySelector('.vd-res'), verdict: vd.querySelector('.vd-verdict'), dots: vd.querySelector('.vd-dots'),
      n: vd.querySelector('.vd-n'), list: vd.querySelector('.vd-models'), next: vd.querySelector('.vd-next') };
    var data, cur, pick = null, last = [];
    var norm = function (s) { return String(s == null ? '' : s).toLowerCase().replace(/^\(?[a-e]\)\s*/, '').replace(/[^a-z0-9.]+/g, ' ').trim(); };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mk = function (tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

    var draw = function () {
      var t = els.sel.value, pool = data.items.filter(function (it) { return t === 'all' || it.task === t; });
      if (!pool.length) return;
      var k, tries = 0;
      do { k = Math.floor(Math.random() * pool.length); tries++; } while (pool.length > 8 && last.indexOf(pool[k].id) > -1 && tries < 20);
      cur = pool[k]; last.push(cur.id); if (last.length > 8) last.shift();
      pick = null;
      els.img.classList.add('loading');
      els.img.onload = function () { els.img.classList.remove('loading'); };
      els.img.src = base + cur.img; els.img.alt = 'Image for the question: ' + cur.q;
      els.task.textContent = (data.tasks[cur.task] || cur.task);
      els.q.textContent = cur.q;
      els.ch.innerHTML = '';
      var opts = cur.choices || (cur.task === 'reid' ? ['Yes', 'No'] : null);
      if (opts) {
        opts.forEach(function (o) {
          var b = mk('button', '', o); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
          b.addEventListener('click', function () {
            els.ch.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
            b.setAttribute('aria-pressed', 'true'); pick = o;
          });
          els.ch.appendChild(b);
        });
      } else {
        var inp = mk('input'); inp.type = cur.task === 'counting' ? 'number' : 'text';
        if (inp.type === 'number') inp.min = '0';
        inp.placeholder = cur.task === 'counting' ? 'How many?' : 'Your answer';
        inp.setAttribute('aria-label', 'Your answer');
        els.ch.appendChild(inp);
      }
      els.form.classList.remove('done');
      els.res.hidden = true;
    };

    var reveal = function () {
      var inp = els.ch.querySelector('input');
      var mine = inp ? inp.value : pick;
      var gold = cur.gold, right = mine != null && String(mine).trim() !== '' && norm(mine) === norm(gold);
      els.verdict.innerHTML = '';
      if (mine == null || String(mine).trim() === '') {
        els.verdict.appendChild(document.createTextNode('Answer: ')); els.verdict.appendChild(mk('b', '', gold));
      } else {
        els.verdict.appendChild(mk('span', right ? 'ok' : 'bad', right ? 'You got it. ' : 'Not quite. '));
        els.verdict.appendChild(document.createTextNode('Answer: ')); els.verdict.appendChild(mk('b', '', gold));
      }
      els.dots.innerHTML = ''; els.list.innerHTML = '';
      var nOk = 0, nAll = 0;
      data.models.forEach(function (m, i) {
        var a = cur.ans[i], d = mk('i');
        var li = mk('li', a ? (a[1] ? 'ok' : 'no') : 'na');
        if (a) { nAll++; if (a[1]) nOk++; d.className = a[1] ? 'ok' : 'no'; }
        li.appendChild(mk('span', 'mk', a ? (a[1] ? '✓' : '✗') : '·'));
        li.appendChild(mk('span', 'mn', m.name));
        var ma = mk('span', 'ma', a ? a[0] : 'no answer'); ma.title = a ? a[0] : ''; li.appendChild(ma);
        els.dots.appendChild(d); els.list.appendChild(li);
      });
      els.n.textContent = nOk + ' of ' + nAll + ' models correct';
      els.form.classList.add('done');
      els.res.hidden = false;
      var ds = els.dots.querySelectorAll('i');
      ds.forEach(function (d, i) { if (reduce) d.classList.add('on'); else setTimeout(function () { d.classList.add('on'); }, 40 + i * 45); });
    };

    fetch(src).then(function (r) { if (!r.ok) throw r; return r.json(); }).then(function (j) {
      if (!j || !j.items || !j.items.length) return;
      data = j;
      Object.keys(j.tasks).forEach(function (k) {
        if (j.items.some(function (it) { return it.task === k; })) { var o = mk('option', '', j.tasks[k]); o.value = k; els.sel.appendChild(o); }
      });
      vd.hidden = false;
      draw();
      els.sel.addEventListener('change', draw);
      els.next.addEventListener('click', draw);
      els.form.addEventListener('submit', function (e) { e.preventDefault(); reveal(); });
    }).catch(function () {});
  }

  // Copy BibTeX
  document.querySelectorAll('.bib button').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.parentNode.querySelector('pre').innerText;
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy BibTeX'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done); else done();
    });
  });
})();
