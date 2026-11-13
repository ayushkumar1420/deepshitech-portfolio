/* i18n.js
 * Whole-page language switching, powered by Google's translate widget so
 * every string on every page is translated automatically — not just a
 * hand-picked dictionary. The flag menu in the header drives it; Google's
 * own toolbar/banner UI is hidden via CSS (see css/custom.css) so only our
 * flag menu is visible.
 *
 * Requires internet access to translate.google.com at runtime (the browser
 * loads it directly — this is unrelated to how the site itself is hosted).
 */
(function () {
  var FLAGS = { en: "🇬🇧", hi: "🇮🇳", es: "🇪🇸", fr: "🇫🇷", ar: "🇸🇦", zh: "🇨🇳" };
  var COOKIE_NAME = 'googtrans';

  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[2]) : null;
  }

  function setCookie(value) {
    var host = location.hostname;
    // Clear first so stale values on other paths/domains don't win
    document.cookie = COOKIE_NAME + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = COOKIE_NAME + '=; path=/; domain=' + host + '; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    if (value) {
      document.cookie = COOKIE_NAME + '=' + value + '; path=/';
      if (host && host.indexOf('.') !== -1) {
        document.cookie = COOKIE_NAME + '=' + value + '; path=/; domain=' + host;
      }
    }
  }

  function getLang() {
    var c = getCookie(COOKIE_NAME); // format: /en/hi
    if (!c) return 'en';
    var parts = c.split('/');
    return parts[2] || 'en';
  }

  var RTL = { ar: true };

  function updateSwitcherUI(lang) {
    var codeEl = document.getElementById('langCurrentCode');
    var flagEl = document.getElementById('langCurrentFlag');
    if (codeEl) codeEl.textContent = lang.toUpperCase();
    if (flagEl) flagEl.textContent = FLAGS[lang] || '🌐';
    document.documentElement.dir = RTL[lang] ? 'rtl' : 'ltr';
  }

  function applyLang(lang) {
    var current = getLang();
    updateSwitcherUI(lang);
    if (lang === current) return; // nothing to do
    if (!lang || lang === 'en') {
      setCookie(null); // clear -> Google reverts to original text
    } else {
      setCookie('/en/' + lang);
    }
    location.reload();
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateSwitcherUI(getLang());
  });

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('#langCurrentBtn');
    var option = e.target.closest('[data-lang]');
    var list = document.getElementById('langList');

    if (toggle && list) {
      list.classList.toggle('mil-open');
      return;
    }
    if (option) {
      applyLang(option.getAttribute('data-lang'));
      if (list) list.classList.remove('mil-open');
      return;
    }
    if (list && !e.target.closest('#langSwitcher')) {
      list.classList.remove('mil-open');
    }
  });

  window.MilLang = { applyLang: applyLang, getLang: getLang };
})();
