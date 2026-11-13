/* =========================================================
   CONTACT FORM DATA
   - Populates country codes
   - Populates currency options
========================================================= */

(function () {

  const CURRENCIES = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "INR", symbol: "₹" },
    { code: "JPY", symbol: "¥" },
    { code: "CNY", symbol: "¥" },
    { code: "AUD", symbol: "A$" },
    { code: "CAD", symbol: "C$" },
    { code: "CHF", symbol: "Fr" },
    { code: "SGD", symbol: "S$" },
    { code: "HKD", symbol: "HK$" },
    { code: "NZD", symbol: "NZ$" },
    { code: "AED", symbol: "د.إ" },
    { code: "SAR", symbol: "ر.س" },
    { code: "ZAR", symbol: "R" },
    { code: "RUB", symbol: "₽" },
    { code: "BRL", symbol: "R$" },
    { code: "KRW", symbol: "₩" },
    { code: "SEK", symbol: "kr" },
    { code: "NOK", symbol: "kr" },
    { code: "DKK", symbol: "kr" },
    { code: "MXN", symbol: "$" },
    { code: "TRY", symbol: "₺" },
    { code: "THB", symbol: "฿" },
    { code: "IDR", symbol: "Rp" },
    { code: "MYR", symbol: "RM" },
    { code: "PHP", symbol: "₱" },
    { code: "PLN", symbol: "zł" },
    { code: "NGN", symbol: "₦" },
    { code: "EGP", symbol: "E£" }
  ];


  const COUNTRY_CODES = [
    { iso: "IN", dial: "+91" },
    { iso: "US", dial: "+1" },
    { iso: "GB", dial: "+44" },
    { iso: "AU", dial: "+61" },
    { iso: "SG", dial: "+65" },
    { iso: "AE", dial: "+971" },
    { iso: "CA", dial: "+1" },
    { iso: "DE", dial: "+49" },
    { iso: "FR", dial: "+33" },
    { iso: "IT", dial: "+39" },
    { iso: "ES", dial: "+34" },
    { iso: "NL", dial: "+31" },
    { iso: "CN", dial: "+86" },
    { iso: "JP", dial: "+81" },
    { iso: "BR", dial: "+55" },
    { iso: "ZA", dial: "+27" },
    { iso: "SA", dial: "+966" },
    { iso: "NZ", dial: "+64" },
    { iso: "MY", dial: "+60" },
    { iso: "PH", dial: "+63" },
    { iso: "BD", dial: "+880" },
    { iso: "PK", dial: "+92" },
    { iso: "LK", dial: "+94" },
    { iso: "NP", dial: "+977" },
    { iso: "BT", dial: "+975" },
    { iso: "MV", dial: "+960" },
    { iso: "ID", dial: "+62" },
    { iso: "TH", dial: "+66" },
    { iso: "VN", dial: "+84" },
    { iso: "KR", dial: "+82" },
    { iso: "HK", dial: "+852" },
    { iso: "MO", dial: "+853" },
    { iso: "TW", dial: "+886" },
    { iso: "RU", dial: "+7" },
    { iso: "UA", dial: "+380" },
    { iso: "PL", dial: "+48" },
    { iso: "CZ", dial: "+420" },
    { iso: "AT", dial: "+43" },
    { iso: "CH", dial: "+41" },
    { iso: "BE", dial: "+32" },
    { iso: "DK", dial: "+45" },
    { iso: "SE", dial: "+46" },
    { iso: "NO", dial: "+47" },
    { iso: "FI", dial: "+358" },
    { iso: "IE", dial: "+353" },
    { iso: "PT", dial: "+351" },
    { iso: "GR", dial: "+30" },
    { iso: "TR", dial: "+90" },
    { iso: "IL", dial: "+972" },
    { iso: "QA", dial: "+974" },
    { iso: "KW", dial: "+965" },
    { iso: "OM", dial: "+968" },
    { iso: "BH", dial: "+973" },
    { iso: "EG", dial: "+20" },
    { iso: "NG", dial: "+234" },
    { iso: "KE", dial: "+254" },
    { iso: "GH", dial: "+233" },
    { iso: "MA", dial: "+212" },
    { iso: "MX", dial: "+52" },
    { iso: "AR", dial: "+54" },
    { iso: "CL", dial: "+56" },
    { iso: "CO", dial: "+57" },
    { iso: "PE", dial: "+51" }
  ];


  function populateSelect(select, items, buildOption, defaultPredicate) {

    if (!select) return;

    select.innerHTML = "";

    items.forEach(function (item) {

      const option = document.createElement("option");

      buildOption(option, item);

      if (defaultPredicate && defaultPredicate(item)) {
        option.selected = true;
      }

      select.appendChild(option);

    });

  }


  window.initContactFormData = function () {

    const form =
      document.getElementById("dsProjectForm") ||
      document.getElementById("contactForm");

    if (!form) {
      return;
    }


    const countrySelect =
      form.querySelector("#countryCode");

    const currencySelect =
      form.querySelector(".ds-currency-select, #currancy");


    /* COUNTRY CODE */

    populateSelect(
      countrySelect,
      COUNTRY_CODES,

      function (option, country) {

        option.value = country.dial;

        option.textContent =
          country.iso + " " + country.dial;

      },

      function (country) {
        return country.iso === "IN";
      }
    );


    /* CURRENCY */

    populateSelect(
      currencySelect,
      CURRENCIES,

      function (option, currency) {

        option.value = currency.symbol;

        option.textContent =
          currency.symbol + " " + currency.code;

      },

      function (currency) {
        return currency.code === "INR";
      }
    );

  }

  function initContactFormSubmission() {

    const form = document.getElementById("contactForm");

    if (!form) {
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.createElement("p");
    status.className = "mil-light-soft mil-contact-form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.appendChild(status);

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      status.textContent = "";

      if (!form.reportValidity()) {
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to send enquiry.");
        }

        status.textContent = result.message;
        form.reset();
        initContactFormData();
      } catch (error) {
        console.error("Contact form submission failed:", error);
        status.textContent =
          error instanceof Error ? error.message : "Unable to send enquiry.";
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }


  /* Works whether script loads before or after DOM */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      function () {
        initContactFormData();
        initContactFormSubmission();
      }
    );

  } else {

    initContactFormData();
    initContactFormSubmission();

  }

})();