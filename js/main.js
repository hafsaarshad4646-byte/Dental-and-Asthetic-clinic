(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var header = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  /* ---------- Header state on scroll ---------- */
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  function setNav(open) {
    nav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    header.classList.toggle('scrolled', open || window.scrollY > 40);
    document.body.classList.toggle('nav-locked', open);
    if (!open) onScroll();
  }
  navToggle.addEventListener('click', function () {
    setNav(!nav.classList.contains('open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Hero video: play immediately, fade in ---------- */
  var heroMedia = document.querySelector('.hero-media');
  if (heroMedia) {
    var heroVideo = heroMedia.querySelector('video');
    function startHeroVideo() {
      if (heroVideo) {
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {});
      }
      heroMedia.classList.add('ready');
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startHeroVideo);
    } else {
      startHeroVideo();
    }

    /* ---------- Subtle hero parallax (no zoom) ---------- */
    var ticking = false;
    function onParallax() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(Math.max(window.scrollY * 0.12, 0), 48);
        heroMedia.style.transform = 'translate3d(0,' + y + 'px,0)';
        ticking = false;
      });
    }
    window.addEventListener('scroll', onParallax, { passive: true });
    onParallax();
  }

  /* ---------- Appointment form ---------- */
  var form = document.getElementById('appointmentForm');
  var success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      form.reset();
    });
  }
})();