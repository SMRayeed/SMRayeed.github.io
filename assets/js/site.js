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

  // Copy BibTeX
  document.querySelectorAll('.bib button').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.parentNode.querySelector('pre').innerText;
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy BibTeX'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done); else done();
    });
  });
})();
