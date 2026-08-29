(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.explore-item'));
  var panel = document.querySelector('.explore-panel');
  if (!items.length || !panel) return;

  var cards = {};
  var transitioning = false;

  items.forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute('aria-controls'));
    if (target) cards[btn.getAttribute('data-cat')] = target;
    btn.addEventListener('click', function () {
      activate(btn.getAttribute('data-cat'));
    });
  });

  function activate(cat) {
    if (!cards[cat] || transitioning) return;

    var currentOpen = panel.querySelector('.explore-card.is-open');
    if (currentOpen && currentOpen === cards[cat]) return;

    transitioning = true;

    /* Update card buttons */
    items.forEach(function (btn) {
      var on = btn.getAttribute('data-cat') === cat;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    /* Fade out current panel */
    if (currentOpen) {
      currentOpen.classList.remove('is-open');
    }

    /* After brief delay, show new panel */
    setTimeout(function () {
      Object.keys(cards).forEach(function (key) {
        cards[key].classList.toggle('is-open', key === cat);
      });

      requestAnimationFrame(function () {
        panel.style.height = cards[cat].offsetHeight + 'px';
      });

      setTimeout(function () {
        transitioning = false;
      }, 400);
    }, 180);
  }

  function syncHeight() {
    var open = panel.querySelector('.explore-card.is-open');
    if (open) {
      panel.style.height = open.offsetHeight + 'px';
    }
  }

  function onDialKey(e) {
    var keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];
    if (keys.indexOf(e.key) === -1) return;
    var cur = items.indexOf(document.activeElement);
    if (cur === -1) return;
    e.preventDefault();
    var dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
    var next = (cur + dir + items.length) % items.length;
    items[next].focus();
  }
  items.forEach(function (btn) { btn.addEventListener('keydown', onDialKey); });

  window.addEventListener('resize', syncHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeight);
  }
  window.addEventListener('load', function () { setTimeout(syncHeight, 80); });

  /* Initial sync */
  syncHeight();
})();
