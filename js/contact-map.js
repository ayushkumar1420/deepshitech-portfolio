
document.addEventListener('DOMContentLoaded', function () {
  function mapUrl(address) {
    return 'https://www.google.com/maps?q=' + encodeURIComponent(address) + '&output=embed';
  }
  function renderContact(office) {
    document.getElementById('contactOfficeName').textContent = office.name;
    document.getElementById('contactOfficeAddress').textContent = office.address;
    document.getElementById('contactOfficePhone').textContent = office.phone;
    document.getElementById('contactOfficeGmb').href = office.gmb;
    document.getElementById('contactMapIframe').src = mapUrl(office.address);
  }
  function boot() {
    if (!window.SITE_OFFICES) { return setTimeout(boot, 50); }
    var offices = window.SITE_OFFICES;
    var idx = 0;
    renderContact(offices[idx]);
    var dotsEl = document.getElementById('contactOfficeDots');
    offices.forEach(function (_, i) {
      var dot = document.createElement('span');
      if (i === 0) dot.classList.add('mil-active');
      dot.addEventListener('click', function () { idx = i; update(); });
      dotsEl.appendChild(dot);
    });
    function update() {
      renderContact(offices[idx]);
      Array.prototype.forEach.call(dotsEl.children, function (d, i) { d.classList.toggle('mil-active', i === idx); });
    }
    document.querySelector('#contactOfficeCarousel .mil-office-prev').addEventListener('click', function () {
      idx = (idx - 1 + offices.length) % offices.length; update();
    });
    document.querySelector('#contactOfficeCarousel .mil-office-next').addEventListener('click', function () {
      idx = (idx + 1) % offices.length; update();
    });
  }
  boot();
});
