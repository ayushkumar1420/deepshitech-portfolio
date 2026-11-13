document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       GET ELEMENTS
    ========================================= */

    const autoPopup =
        document.getElementById("dsAutoPopup");

    const autoOverlay =
        document.getElementById("dsAutoOverlay");

    const autoClose =
        document.getElementById("dsAutoClose");

    const autoForm =
        document.getElementById("dsAutoProjectForm");

    const autoStatus =
        document.getElementById("dsAutoFormStatus");

    const sideDrawer =
        document.getElementById("dsFormDrawer");


    if (
        !autoPopup ||
        !autoOverlay ||
        !autoClose ||
        !autoForm ||
        !autoStatus
    ) {
        return;
    }


    const submitBtn =
        autoForm.querySelector(".ds-auto-submit");

    const submitText =
        submitBtn.querySelector("span:first-child");


    /* =========================================
       OPEN / CLOSE
    ========================================= */

    let autoPopupTimer = null;


    function openAutoPopup() {
        
                /* (changed) look the drawer up now: it is injected after page load,
           so the reference taken at the top of this file is always null */
        const sideDrawer =
            document.getElementById("dsFormDrawer");

        /* Don't open if side form is already open */

        if (
            sideDrawer &&
            sideDrawer.classList.contains("active")
        ) {
            scheduleAutoPopup();
            return;
        }


        /* Don't open twice */

        if (autoPopup.classList.contains("active")) {
            return;
        }


        autoPopup.classList.add("active");
        autoOverlay.classList.add("active");

        document.body.style.overflow = "hidden";
    }


    function closeAutoPopup() {

        autoPopup.classList.remove("active");
        autoOverlay.classList.remove("active");

        document.body.style.overflow = "";

        /* start another 60 sec timer */
        scheduleAutoPopup();
    }


    function scheduleAutoPopup() {

        if (autoPopupTimer) {
            clearTimeout(autoPopupTimer);
        }


        autoPopupTimer = setTimeout(
            function () {
                openAutoPopup();
            },

            25000
        );

    }


    autoClose.addEventListener(
        "click",
        closeAutoPopup
    );


    autoOverlay.addEventListener(
        "click",
        closeAutoPopup
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                autoPopup.classList.contains("active")
            ) {
                closeAutoPopup();
            }

        }
    );


    /* =========================================
       INPUT RESTRICTIONS
    ========================================= */

    const nameInput =
        autoForm.querySelector(
            'input[name="name"]'
        );

    const companyInput =
        autoForm.querySelector(
            'input[name="company"]'
        );

    const phoneInput =
        autoForm.querySelector(
            'input[name="phone"]'
        );

    const budgetInput =
        autoForm.querySelector(
            'input[name="budget"]'
        );


    if (nameInput) {

        nameInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^A-Za-z\s]/g,
                        ""
                    );

            }
        );

    }


    if (companyInput) {

        companyInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^A-Za-z0-9\s&.'-]/g,
                        ""
                    );

            }
        );

    }


    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^0-9]/g,
                        ""
                    );

            }
        );

    }


    if (budgetInput) {

        budgetInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^0-9.]/g,
                        ""
                    );


                const parts =
                    this.value.split(".");


                if (parts.length > 2) {

                    this.value =
                        parts[0] +
                        "." +
                        parts.slice(1).join("");

                }

            }
        );

    }


    /* =========================================
       COUNTRY CODES
    ========================================= */

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


    const autoCountryCode =
        document.getElementById(
            "autoCountryCode"
        );


    if (autoCountryCode) {

        autoCountryCode.innerHTML = "";


        COUNTRY_CODES.forEach(
            function (country) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    country.dial;


                option.textContent =
                    country.iso +
                    " " +
                    country.dial;


                if (country.iso === "IN") {
                    option.selected = true;
                }


                autoCountryCode.appendChild(
                    option
                );

            }
        );

    }


    /* =========================================
       CURRENCIES
    ========================================= */

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


    const autoCurrency =
        document.getElementById(
            "autoCurrency"
        );


    if (autoCurrency) {

        autoCurrency.innerHTML = "";


        CURRENCIES.forEach(
            function (currency) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    currency.symbol;


                option.textContent =
                    currency.symbol +
                    " " +
                    currency.code;


                if (currency.code === "INR") {
                    option.selected = true;
                }


                autoCurrency.appendChild(
                    option
                );

            }
        );

    }


    /* =========================================
       MULTI SERVICE SELECT
    ========================================= */

    const servicesBox =
        document.querySelector(
            ".ds-auto-services-multiselect"
        );

    const servicesBtn =
        document.getElementById(
            "dsAutoServicesBtn"
        );

    const servicesText =
        document.getElementById(
            "dsAutoServicesSelectedText"
        );


    if (
        servicesBox &&
        servicesBtn &&
        servicesText
    ) {

        const checkboxes =
            servicesBox.querySelectorAll(
                'input[name="services[]"]'
            );


        servicesBtn.addEventListener(
            "click",
            function () {

                servicesBox.classList.toggle(
                    "active"
                );

            }
        );


        checkboxes.forEach(
            function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        const selected = [];


                        checkboxes.forEach(
                            function (item) {

                                if (item.checked) {
                                    selected.push(
                                        item.value
                                    );
                                }

                            }
                        );


                        if (
                            selected.length === 0
                        ) {

                            servicesText.textContent =
                                "Select Services*";

                        }

                        else if (
                            selected.length <= 2
                        ) {

                            servicesText.textContent =
                                selected.join(", ");

                        }

                        else {

                            servicesText.textContent =
                                selected.length +
                                " Services Selected";

                        }

                    }
                );

            }
        );


        document.addEventListener(
            "click",
            function (event) {

                if (
                    !servicesBox.contains(
                        event.target
                    )
                ) {

                    servicesBox.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* =========================================
       FORM SUBMIT
    ========================================= */

    autoForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            autoStatus.className =
                "ds-auto-form-status";

            autoStatus.textContent =
                "";


            if (!autoForm.checkValidity()) {

                autoForm.reportValidity();

                return;

            }


            const selectedServices =
                autoForm.querySelectorAll(
                    'input[name="services[]"]:checked'
                );


            if (
                selectedServices.length === 0
            ) {

                autoStatus.className =
                    "ds-auto-form-status error";

                autoStatus.textContent =
                    "Please select at least one service.";


                if (servicesBox) {
                    servicesBox.classList.add(
                        "active"
                    );
                }

                return;

            }

            
            /* (added) OTP gate: email must be verified first */

            if (window.DSOtp && !window.DSOtp.isVerified(autoForm)) {

                autoStatus.className =
                    "ds-auto-form-status error";

                autoStatus.textContent =
                    window.DSOtp.requireVerification(autoForm);

                return;

            }


            submitBtn.disabled = true;

            submitText.textContent =
                "Sending...";


            try {

                const formData =
                    new FormData(autoForm);


                const response =
                    await fetch(
                        autoForm.action,
                        {
                            method: "POST",

                            body: formData,

                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );


                const responseText =
                    await response.text();


                let data;


                try {

                    data =
                        JSON.parse(responseText);

                } catch (error) {

                    throw new Error(
                        "Server returned an invalid response. HTTP " +
                        response.status
                    );

                }


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to send enquiry."
                    );

                }


                autoStatus.className =
                    "ds-auto-form-status success";


                autoStatus.textContent =
                    data.message ||
                    "Your enquiry has been sent successfully.";


                autoForm.reset();


                if (servicesText) {
                    servicesText.textContent =
                        "Select Services*";
                }


                if (servicesBox) {
                    servicesBox.classList.remove(
                        "active"
                    );
                }


                submitText.textContent =
                    "Sent Successfully";


            /* (changed) go to the Thank You page */

                if (window.DSOtp) {
                    window.DSOtp.reset(autoForm);
                }

                submitBtn.dataset.redirecting = "1";


                setTimeout(
                    function () {

                        window.location.href =
                            (window.MIL_PATH_PREFIX || "") + "thanks/";

                    },
                    2500
                );


            } catch (error) {


                autoStatus.className =
                    "ds-auto-form-status error";


                autoStatus.textContent =
                    error.message ||
                    "Something went wrong. Please try again.";


                submitText.textContent =
                    "Send Enquiry";


            } finally {


                if (!submitBtn.dataset.redirecting) {
                    submitBtn.disabled = false;
                }

            }

        }
    );


    /* =========================================
       START FIRST TIMER
    ========================================= */

    scheduleAutoPopup();

});