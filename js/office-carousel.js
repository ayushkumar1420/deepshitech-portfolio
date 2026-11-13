/* office-carousel.js
 * Simple accessible carousel that cycles through window.SITE_OFFICES.
 * Used on the footer (text + link) and can also drive an embedded map
 * (see contact page, which pairs this with an <iframe> map updater).
 */
(function () {
  function init(containerId, opts) {
    opts = opts || {};
    var root = document.getElementById(containerId);
    if (!root || !window.SITE_OFFICES) return;

    var offices = window.SITE_OFFICES;
    var index = 0;

    var nameEl = root.querySelector('#officeName') || document.getElementById('officeName');
    var addrEl = root.querySelector('#officeAddress') || document.getElementById('officeAddress');
    var phoneEl = root.querySelector('#officePhone') || document.getElementById('officePhone');
    var gmbEl = root.querySelector('#officeGmbLink') || document.getElementById('officeGmbLink');
    var dotsEl = root.querySelector('#officeDots') || document.getElementById('officeDots');
    var prevBtn = root.querySelector('.mil-office-prev');
    var nextBtn = root.querySelector('.mil-office-next');

    function render() {
      var o = offices[index];
      if (!o) return;
      if (nameEl) nameEl.textContent = o.name;
      if (addrEl) addrEl.textContent = o.address;
      if (phoneEl) phoneEl.textContent = o.phone;
      if (gmbEl) gmbEl.href = o.gmb;
      if (dotsEl) {
        Array.prototype.forEach.call(dotsEl.children, function (dot, i) {
          dot.classList.toggle('mil-active', i === index);
        });
      }
      root.dispatchEvent(new CustomEvent('officechange', { detail: { office: o, index: index } }));
    }

    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      offices.forEach(function (_, i) {
        var dot = document.createElement('span');
        dot.addEventListener('click', function () {
          index = i;
          render();
        });
        dotsEl.appendChild(dot);
      });
    }

    function go(delta) {
      index = (index + delta + offices.length) % offices.length;
      render();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

    buildDots();
    render();

    if (opts.autoplay) {
      setInterval(function () { go(1); }, 6000);
    }

    return { go: go, getIndex: function () { return index; }, getOffices: function () { return offices; } };
  }

  window.MilOfficeCarousel = { init: init };
})();
