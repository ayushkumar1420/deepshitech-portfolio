/* components.js
 * Header/footer are inlined directly into every generated page.
 * This script wires up the interactive components once the DOM is ready.
 */

(function () {

    // ============================================
  // LOAD OTP VERIFICATION SCRIPT
  // ============================================

  function loadOtpVerifyScript() {
    // Avoid loading the script more than once.
    if (window.DSOtp || document.querySelector('script[data-ds-otp-script]')) {
      return;
    }

    var prefix = window.MIL_PATH_PREFIX || '';
    var script = document.createElement('script');

    script.src = prefix + 'js/otp-verify.js';
    script.dataset.dsOtpScript = '1';

    script.onerror = function () {
      console.error('Failed to load otp-verify.js:', script.src);
    };

    document.head.appendChild(script);
  }

  // ============================================
  // BUILD SERVICES MENU
  // ============================================

  function buildServicesMenu() {
    var list = document.getElementById('servicesMenuList');

    if (!list || !window.SITE_SERVICES) return;

    var prefix = window.MIL_PATH_PREFIX || '';
    var html = '';

    Object.keys(window.SITE_SERVICES).forEach(function (slug) {

      var service = window.SITE_SERVICES[slug];
      var servicePath = service.route || slug;
      var subServicesPage = service.sub_services_page;
      var directSubServices = service.direct_sub_services || [];

      html += '<li class="mil-service-menu-group mil-has-children">';

      html += '<a href="' + prefix + 'index.php#creative-gallery">'
        + service.full_title
        + '</a>';

      if (service.sub_services && service.sub_services.length) {

        html += '<ul class="mil-submenu">';

        service.sub_services.forEach(function (sub) {

          html += '<li>';

          var subServicePath = directSubServices.indexOf(sub.slug) !== -1
            || !subServicesPage
            ? sub.slug + '/index.html'
            : subServicesPage;

          html += '<a href="' + prefix + 'index.php#creative-gallery">'
            + sub.name
            + '</a>';

          html += '</li>';

        });

        html += '</ul>';
      }

      html += '</li>';
    });

    list.innerHTML = html;
  }

  // The original theme referenced template pages that are not part of this
  // project. Keep those menu links useful by sending them to the corresponding
  // section of the actual site entry point.
  function normalizeInternalLinks() {
    var prefix = window.MIL_PATH_PREFIX || '';
    var galleryUrl = prefix + 'index.php#creative-gallery';
    var footerUrl = prefix + 'index.php#site-footer';
    var galleryPaths = [
      '/personal/',
      '/portfolio-slider/',
      '/portfolio/',
      '/services/'
    ];
    var footerPaths = [
      '/blog/',
      '/team/',
      '/contact/',
      '/privacy-policy/',
      '/terms-conditions/',
      '/cookie-policy/',
      '/career/'
    ];

    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (galleryPaths.some(function (path) { return href.indexOf(path) !== -1; })) {
        link.setAttribute('href', galleryUrl);
      } else if (footerPaths.some(function (path) { return href.indexOf(path) !== -1; })) {
        link.setAttribute('href', footerUrl);
      }
    });
  }


  // ============================================
  // SET CURRENT PAGE LABEL
  // ============================================

  function setCurrentPageLabel() {
    var element = document.getElementById('milCurrentPage');

    if (element) {
      element.textContent = document.title.split('|')[0].trim();
    }
  }


  // ============================================
  // MENU TOGGLE
  // ============================================

  function initMenuToggle() {
    var buttons = document.querySelectorAll('.mil-menu-btn');
    var menuFrame = document.querySelector('.mil-menu-frame');

    if (!menuFrame) return;

    buttons.forEach(function (button) {

      button.addEventListener('click', function () {

        menuFrame.classList.toggle('mil-active-menu');
        document.body.classList.toggle('mil-menu-opened');

      });

    });
  }



  // ============================================
  // LOAD SIDE CONTACT FORM
  // ============================================

  function loadSideForm() {

    // Prevent duplicate side form containers.
    if (document.getElementById('sideFormComponent')) {
      return;
    }

    var container = document.createElement('div');
    container.id = 'sideFormComponent';

    var prefix = window.MIL_PATH_PREFIX || '';

    fetch(prefix + 'side_form.html')
      .then(function (response) {

        if (!response.ok) {
          throw new Error(
            'Side form component could not be loaded.'
          );
        }

        return response.text();

      })
      .then(function (html) {

        container.innerHTML = html;
        document.body.appendChild(container);

        // Add the animated background to the side drawer.
        addDrawerShapes(
          container.querySelector('#dsFormDrawer')
        );

        // ------------------------------------
        // SIDE FORM SERVICES MULTISELECT
        // ------------------------------------

        var servicesMultiselect =
          container.querySelector('.ds-services-multiselect');

        var serviceCheckboxes =
          container.querySelectorAll(
            '#dsServicesOptions input[type="checkbox"]'
          );

        var servicesSelectedText =
          container.querySelector('#dsServicesSelectedText');

        serviceCheckboxes.forEach(function (checkbox) {

          checkbox.addEventListener('change', function () {

            var selectedServices = [];

            serviceCheckboxes.forEach(function (item) {

              if (item.checked) {
                selectedServices.push(item.value);
              }

            });

            if (servicesSelectedText) {

              servicesSelectedText.textContent =
                selectedServices.length > 0
                  ? selectedServices.join(', ')
                  : 'Select Services*';

            }

          });

        });

        var servicesSelectBtn =
          container.querySelector('#dsServicesSelectBtn');

        if (servicesMultiselect && servicesSelectBtn) {

          servicesSelectBtn.addEventListener('click', function () {
            servicesMultiselect.classList.toggle('active');
          });

        }

        // Initialize existing contact form data.
        if (typeof window.initContactFormData === 'function') {
          window.initContactFormData();
        }

        // Correct the side form logo path.
        var formLogo =
          container.querySelector('.ds-form-drawer img');

        if (formLogo) {
          formLogo.src = prefix + 'img/logo2.png';
        }

        // Correct the side form PHP action.
        var projectForm =
          container.querySelector('#dsProjectForm');

        if (projectForm) {
          projectForm.action = prefix + 'project-enquiry.php';
        }

        // ------------------------------------
        // SIDE DRAWER OPEN/CLOSE
        // ------------------------------------

        var openBtn = document.getElementById('dsFormOpen');
        var closeBtn = document.getElementById('dsFormClose');
        var overlay = document.getElementById('dsFormOverlay');
        var drawer = document.getElementById('dsFormDrawer');

        if (openBtn && drawer && overlay) {

          openBtn.addEventListener('click', function () {

            drawer.classList.add('active');
            overlay.classList.add('active');
            openBtn.classList.add('is-hidden');

          });

        }

        if (closeBtn && drawer && overlay) {

          closeBtn.addEventListener('click', function () {

            drawer.classList.remove('active');
            overlay.classList.remove('active');

            if (openBtn) {
              openBtn.classList.remove('is-hidden');
            }

          });

        }

        if (overlay && drawer) {

          overlay.addEventListener('click', function () {

            drawer.classList.remove('active');
            overlay.classList.remove('active');

            if (openBtn) {
              openBtn.classList.remove('is-hidden');
            }

          });

        }

    /* Notify popup.js and otp-verify.js that the side form is ready */
        document.dispatchEvent(new CustomEvent('ds:sideform-ready'));

      })
      .catch(function (error) {

        console.error(
          'Side form loading error:',
          error
        );

      });
  }


  // ============================================
  // INITIALIZE COMPONENTS
  // ============================================

  document.addEventListener('DOMContentLoaded', function () {

    loadOtpVerifyScript();

    buildServicesMenu();

    normalizeInternalLinks();

    setCurrentPageLabel();

    initMenuToggle();

    // Load the existing side contact form.
    loadSideForm();

    // Keep the old center popup animation unchanged.
    addPopupShapes(
      document.getElementById('dsAutoPopup')
    );

    // Initialize office carousel.
    if (window.MilOfficeCarousel) {

      window.MilOfficeCarousel.init(
        'footerOfficeCarousel',
        { autoplay: true }
      );

    }

    // Apply the selected language.
    if (window.MilLang) {

      window.MilLang.applyLang(
        window.MilLang.getLang()
      );

    }

  });

})();


// ============================================
// ANIMATED SHAPES: SIDE DRAWER
// ============================================

function buildDodecahedron() {

  var dodecahedron = document.createElement('div');
  dodecahedron.className = 'mil-dodecahedron';

  for (var i = 0; i < 12; i++) {

    var pentagon = document.createElement('div');
    pentagon.className = 'mil-pentagon';

    for (var j = 0; j < 5; j++) {
      pentagon.appendChild(document.createElement('div'));
    }

    dodecahedron.appendChild(pentagon);

  }

  return dodecahedron;
}


function addDrawerShapes(drawer) {

  if (!drawer || drawer.querySelector('.ds-drawer-bg')) {
    return;
  }

  var background = document.createElement('div');
  background.className = 'ds-drawer-bg';
  background.setAttribute('aria-hidden', 'true');

  var inner = document.createElement('div');
  inner.className = 'ds-drawer-bg-inner';

  ['ds-shape-1', 'ds-shape-2', 'ds-shape-3'].forEach(function (className) {

    var shape = document.createElement('div');
    shape.className = 'ds-shape ' + className;

    shape.appendChild(buildDodecahedron());
    inner.appendChild(shape);

  });

  background.appendChild(inner);
  drawer.insertBefore(background, drawer.firstChild);

}


// ============================================
// ANIMATED SHAPES: CENTER POPUPS
// Used by the existing old popup and the new popup.
// ============================================

function addPopupShapes(popup) {

  if (!popup || popup.querySelector('.ds-popup-bg')) {
    return;
  }

  var closeButton = popup.querySelector('.ds-auto-close');

  // Background animation layer.
  var background = document.createElement('div');
  background.className = 'ds-popup-bg';
  background.setAttribute('aria-hidden', 'true');

  ['ds-pshape-1', 'ds-pshape-2', 'ds-pshape-3'].forEach(function (className) {

    var shape = document.createElement('div');
    shape.className = 'ds-shape ' + className;

    shape.appendChild(buildDodecahedron());
    background.appendChild(shape);

  });

  // Scroll area for popup content.
  var scroll = document.createElement('div');
  scroll.className = 'ds-popup-scroll';

  Array.prototype.slice.call(popup.childNodes).forEach(function (node) {

    if (node !== closeButton) { scroll.appendChild(node);
    }

  });

  // Preserve the close button outside the scrolling content.
  popup.insertBefore(background, closeButton);
  popup.insertBefore(scroll, closeButton);

}
