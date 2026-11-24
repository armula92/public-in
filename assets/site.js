// PUBLIC-IN 2판: 전체 메뉴, 첫 화면 사물 교체, 스크롤 등장, 아카이브 거르기
(function () {
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 전체 메뉴 (•••)
  var overlay = document.getElementById('overlay');
  var opener = document.querySelector('.dots-btn');
  function setMenu(open) {
    if (!overlay) return;
    overlay.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (opener) opener.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var f = overlay.querySelector('a'); if (f) f.focus(); } else if (opener) opener.focus();
  }
  if (opener) opener.addEventListener('click', function () { setMenu(true); });
  if (overlay) {
    overlay.querySelector('.close').addEventListener('click', function () { setMenu(false); });
    overlay.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('open')) setMenu(false); });
  }

  // 첫 화면 사물 교체
  var figs = document.querySelectorAll('.object figure');
  if (figs.length > 1 && !reduce) {
    var i = 0;
    setInterval(function () {
      figs[i].classList.remove('on');
      i = (i + 1) % figs.length;
      figs[i].classList.add('on');
    }, 3200);
  }

  // 스크롤 등장
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // 아카이브 영역 거르기
  var tabs = document.querySelectorAll('.tabs button');
  if (tabs.length) {
    var tiles = document.querySelectorAll('.wall .tile');
    function select(cat) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t.dataset.cat === cat ? 'true' : 'false'); });
      tiles.forEach(function (c) { c.hidden = !(cat === 'all' || c.dataset.cat === cat); if (!c.hidden) c.classList.add('in'); });
      try { history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat); } catch (e) {}
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { select(t.dataset.cat); }); });
    var start = decodeURIComponent(location.hash.slice(1));
    if (start && document.querySelector('.tabs button[data-cat="' + start + '"]')) select(start);
  }
})();
