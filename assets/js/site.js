(function () {
  var nav = document.querySelector('.nav');
  var btn = document.querySelector('.menu-btn');
  if (btn) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Specimen drawer: one measuring pass on load, then hover/tap to measure.
  var specs = Array.prototype.slice.call(document.querySelectorAll('.drawer-svg .spec'));
  if (specs.length) {
    specs.forEach(function (g) {
      g.addEventListener('click', function () {
        var was = g.classList.contains('on');
        specs.forEach(function (o) { o.classList.remove('on'); });
        if (!was) g.classList.add('on');
      });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.dispatchEvent(new Event('click')); }
      });
    });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      var order = [0, 6, 9];
      order.forEach(function (idx, k) {
        setTimeout(function () { specs[idx] && specs[idx].classList.add('on'); }, 700 + k * 650);
        setTimeout(function () { specs[idx] && specs[idx].classList.remove('on'); }, 2900 + k * 650);
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
