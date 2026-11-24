// PUBLIC-IN 사이트 공통 동작: 메뉴 접기, 스크롤 등장, 아카이브 탭
(function () {
  document.documentElement.classList.add('js');

  // 모바일 메뉴 (+ / −)
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('span').textContent = open ? '−' : '+';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.querySelector('span').textContent = '+'; }
    });
  }

  // 스크롤 등장
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // 아카이브 영역 탭
  var tabs = document.querySelectorAll('.tabs button');
  if (tabs.length) {
    var cards = document.querySelectorAll('.grid .item');
    function select(cat) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t.dataset.cat === cat ? 'true' : 'false'); });
      cards.forEach(function (c) { c.hidden = !(cat === 'all' || c.dataset.cat === cat); if (!c.hidden) c.classList.add('in'); });
      try { if (cat === 'all') history.replaceState(null, '', location.pathname); else history.replaceState(null, '', '#' + cat); } catch (e) {}
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { select(t.dataset.cat); }); });
    var start = decodeURIComponent(location.hash.slice(1));
    if (start && document.querySelector('.tabs button[data-cat="' + start + '"]')) select(start);
  }
})();
