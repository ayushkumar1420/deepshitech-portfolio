/* =========================================================
   SERVICE ENQUIRY POPUP
   - Opens from Discuss Requirement buttons
   - Automatically selects the main service
   - Loads matching sub-services from SITE_SERVICES
   - Supports multiple sub-service selections
   - Validates form before submission
   - Redirects to Thank You page after successful submission
========================================================= */

(function () {
    "use strict";

    var initialized = false;

    // ============================================
    // ELEMENTS
    // ============================================

    function getElements() {
        return {
            popup: document.getElementById("dsServicePopup"),
            overlay: document.getElementById("dsServiceOverlay"),
            close: document.getElementById("dsServiceClose"),
            form: document.getElementById("dsServiceForm"),

            title: document.getElementById("dsServiceTitle"),
            mainService: document.getElementById("dsServiceMain"),

            subServiceBox: document.getElementById("dsServiceSubServicesBox"),
            subServiceButton: document.getElementById("dsServiceSubServicesBtn"),
            subServiceText: document.getElementById("dsServiceSubServicesText"),
            subServiceOptions: document.getElementById("dsServiceSubServicesOptions"),

            status: document.getElementById("dsServiceFormStatus"),
            countryCode: document.getElementById("dsServiceCountryCode"),
            currency: document.getElementById("dsServiceCurrency")
        };
    }


    // ============================================
    // NORMALIZE SERVICE NAME
    // ============================================

    function normalize(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "");
    }


    // ============================================
    // FIND MAIN SERVICE
    // ============================================

    function findMainService(value) {
        var services = window.SITE_SERVICES || {};
        var requested = normalize(value);

        if (!requested) {
            return null;
        }

        var keys = Object.keys(services);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var service = services[key];

            if (
                normalize(key) === requested ||
                normalize(service.full_title) === requested
            ) {
                return {
                    slug: key,
                    data: service
                };
            }
        }

        return null;
    }


    // ============================================
    // POPULATE COUNTRY CODE SELECT
    // ============================================

    function populateCountryCodes(select) {
        if (!select || select.options.length > 0) {
            return;
        }

        var countries = [
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

        countries.forEach(function (country) {
            var option = document.createElement("option");

            option.value = country.dial;
            option.textContent =
                country.iso + " (" + country.dial + ")";

            if (country.iso === "IN") {
                option.selected = true;
            }

            select.appendChild(option);
        });
    }


    // ============================================
    // POPULATE CURRENCY SELECT
    // ============================================

    function populateCurrencies(select) {
        if (!select || select.options.length > 0) {
            return;
        }

        var currencies = [
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

        currencies.forEach(function (currency) {
            var option = document.createElement("option");

            option.value = currency.code;
            option.textContent =
                currency.code + " (" + currency.symbol + ")";

            if (currency.code === "INR") {
                option.selected = true;
            }

            select.appendChild(option);
        });
    }


    // ============================================
    // UPDATE SELECTED SUB-SERVICE TEXT
    // ============================================

    function updateSelectedSubServices(elements) {
        if (!elements.subServiceOptions || !elements.subServiceText) {
            return [];
        }

        var checked = elements.subServiceOptions.querySelectorAll(
            'input[name="sub_services[]"]:checked'
        );

        var selectedNames = [];

        checked.forEach(function (checkbox) {
            selectedNames.push(checkbox.value);
        });

        if (selectedNames.length) {
            elements.subServiceText.textContent =
                selectedNames.join(", ");
        } else {
            elements.subServiceText.textContent =
                "Select Sub-Services*";
        }

        return selectedNames;
    }


    // ============================================
    // BUILD SUB-SERVICE OPTIONS
    // ============================================

    function populateSubServices(service, elements) {
        if (!elements.subServiceOptions) {
            return;
        }

        elements.subServiceOptions.replaceChildren();

        if (
            !service ||
            !service.data ||
            !Array.isArray(service.data.sub_services) ||
            service.data.sub_services.length === 0
        ) {
            var emptyMessage = document.createElement("p");

            emptyMessage.textContent =
                "No sub-services are available for this service.";

            emptyMessage.className = "ds-service-empty-message";

            elements.subServiceOptions.appendChild(emptyMessage);

            if (elements.subServiceButton) {
                elements.subServiceButton.disabled = true;
            }

            return;
        }

        if (elements.subServiceButton) {
            elements.subServiceButton.disabled = false;
        }

        service.data.sub_services.forEach(function (subService, index) {
            var label = document.createElement("label");
            label.className = "ds-service-option";

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "sub_services[]";
            checkbox.value = subService.name;
            checkbox.id = "dsServiceSubOption" + index;

            var text = document.createElement("span");
            text.textContent = subService.name;

            label.appendChild(checkbox);
            label.appendChild(text);

            elements.subServiceOptions.appendChild(label);

            checkbox.addEventListener("change", function () {
                updateSelectedSubServices(elements);
            });
        });

        updateSelectedSubServices(elements);
    }


    // ============================================
    // OPEN POPUP
    // ============================================

    function openPopup(serviceValue) {
        var elements = getElements();

        if (!elements.popup || !elements.overlay) {
            console.error(
                "Service enquiry popup elements were not found."
            );
            return;
        }

        var service = findMainService(serviceValue);

        if (!service) {
            console.error(
                "Could not find a matching main service:",
                serviceValue
            );

            if (elements.status) {
                elements.status.hidden = false;
                elements.status.textContent =
                    "We couldn't identify this service. Please contact our team.";
            }

            return;
        }

        if (elements.mainService) {
            elements.mainService.value = service.data.full_title;
        }

        if (elements.title) {
            elements.title.innerHTML =
                "Let's Get <span>Project Started</span>";
        }

        if (elements.status) {
            elements.status.hidden = true;
            elements.status.textContent = "";
        }

        populateSubServices(service, elements);
        closeSubServiceDropdown(elements);

        elements.popup.classList.add("active");
        elements.overlay.classList.add("active");

        document.body.classList.add("ds-service-popup-open");

        if (elements.close) {
            elements.close.focus();
        }
    }


    // ============================================
    // CLOSE POPUP
    // ============================================

    function closePopup() {
        var elements = getElements();

        if (elements.popup) {
            elements.popup.classList.remove("active");
        }

        if (elements.overlay) {
            elements.overlay.classList.remove("active");
        }

        document.body.classList.remove("ds-service-popup-open");

        closeSubServiceDropdown(elements);
    }


    // ============================================
    // OPEN/CLOSE SUB-SERVICE DROPDOWN
    // ============================================

    function closeSubServiceDropdown(elements) {
        if (elements.subServiceBox) {
            elements.subServiceBox.classList.remove("active");
        }

        if (elements.subServiceButton) {
            elements.subServiceButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        if (elements.subServiceOptions) {
            elements.subServiceOptions.hidden = true;
        }
    }


    function toggleSubServiceDropdown() {
        var elements = getElements();

        if (
            !elements.subServiceBox ||
            !elements.subServiceButton ||
            !elements.subServiceOptions
        ) {
            return;
        }

        var isOpen =
            elements.subServiceBox.classList.contains("active");

        if (isOpen) {
            closeSubServiceDropdown(elements);
        } else {
            elements.subServiceBox.classList.add("active");

            elements.subServiceButton.setAttribute(
                "aria-expanded",
                "true"
            );

            elements.subServiceOptions.hidden = false;
        }
    }


    // ============================================
    // VALIDATE SUB-SERVICE SELECTION
    // ============================================

    function validateSubServices() {
        var elements = getElements();

        var checked = elements.subServiceOptions
            ? elements.subServiceOptions.querySelectorAll(
                'input[name="sub_services[]"]:checked'
            )
            : [];

        if (!checked.length) {
            if (elements.status) {
                elements.status.hidden = false;
                elements.status.textContent =
                    "Please select at least one sub-service.";

                elements.status.classList.remove("success");
                elements.status.classList.add("error");
            }

            if (elements.subServiceButton) {
                elements.subServiceButton.focus();
            }

            return false;
        }

        if (elements.status) {
            elements.status.hidden = true;
            elements.status.textContent = "";
            elements.status.classList.remove("error");
        }

        return true;
    }


    // ============================================
    // INITIALIZE POPUP
    // ============================================

    function initServiceEnquiryPopup() {
        if (initialized) {
            return;
        }

        var elements = getElements();

        if (!elements.popup || !elements.overlay) {
            console.error(
                "Cannot initialize service enquiry popup: popup HTML is missing."
            );
            return;
        }

        initialized = true;

        populateCountryCodes(elements.countryCode);
        populateCurrencies(elements.currency);


        // ============================================
        // DISCUSS REQUIREMENT BUTTON HANDLER
        // ============================================

        document.addEventListener("click", function (event) {
            var button = event.target.closest(".js-service-enquiry");

            if (!button) {
                return;
            }

            event.preventDefault();

            var currentElements = getElements();

            var serviceValue = button.getAttribute("data-service");
            var service = findMainService(serviceValue);

            if (!service) {
                console.error("Service not found:", serviceValue);
                return;
            }

            if (currentElements.mainService) {
                currentElements.mainService.value =
                    service.data.full_title;
            }

            populateSubServices(service, currentElements);

            if (currentElements.status) {
                currentElements.status.hidden = true;
                currentElements.status.textContent = "";
                currentElements.status.classList.remove("error");
            }

            closeSubServiceDropdown(currentElements);

            currentElements.popup.classList.add("active");
            currentElements.overlay.classList.add("active");

            document.body.classList.add("ds-service-popup-open");
        });


        // ============================================
        // CLOSE BUTTON
        // ============================================

        if (elements.close) {
            elements.close.addEventListener("click", closePopup);
        }


        // ============================================
        // OVERLAY CLICK
        // ============================================

        elements.overlay.addEventListener("click", closePopup);


        // ============================================
        // ESCAPE KEY
        // ============================================

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closePopup();
            }
        });


        // ============================================
        // SUB-SERVICE DROPDOWN BUTTON
        // ============================================

        if (elements.subServiceButton) {
            elements.subServiceButton.addEventListener(
                "click",
                toggleSubServiceDropdown
            );
        }


        // ============================================
        // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
        // ============================================

        document.addEventListener("click", function (event) {
            var currentElements = getElements();

            if (
                currentElements.subServiceBox &&
                !currentElements.subServiceBox.contains(event.target)
            ) {
                closeSubServiceDropdown(currentElements);
            }
        });


        // ============================================
        // AJAX FORM SUBMISSION
        // ============================================

        const serviceForm =
            document.getElementById("dsServiceForm");

        const formStatus =
            document.getElementById("dsServiceFormStatus");

        const submitButton =
            document.getElementById("dsServiceSubmit");

        if (serviceForm && !serviceForm.dataset.ajaxInitialized) {
            serviceForm.dataset.ajaxInitialized = "true";

            serviceForm.addEventListener(
                "submit",
                async function (event) {
                    event.preventDefault();

                    // Validate required HTML form fields.
                    if (!serviceForm.reportValidity()) {
                        return;
                    }

                    // Validate sub-service selection.
                    if (!validateSubServices()) {
                        return;
                    }

                    const originalButtonText = submitButton
                        ? submitButton.innerHTML
                        : "";

                    // Show loading state.
                    if (submitButton) {
                        submitButton.disabled = true;
                        submitButton.innerHTML =
                            "<span>Sending...</span>";
                    }

                    // Show submission status.
                    if (formStatus) {
                        formStatus.hidden = false;
                        formStatus.textContent =
                            "Sending your enquiry...";

                        formStatus.classList.remove(
                            "success",
                            "error"
                        );
                    }

                    try {
                        // Submit the form to project-enquiry.php.
                        const response = await fetch(
                            serviceForm.action,
                            {
                                method: "POST",
                                body: new FormData(serviceForm),
                                headers: {
                                    "Accept": "application/json"
                                }
                            }
                        );

                        // Read the PHP response.
                        const result = await response.json();

                        // Check whether submission succeeded.
                        if (!response.ok || !result.success) {
                            throw new Error(
                                result.message ||
                                "Unable to send your enquiry."
                            );
                        }

                        // Redirect to the existing Thank You page.
                        window.location.href =
                            (window.MIL_PATH_PREFIX || "") +
                            "thanks/index.html";

                    } catch (error) {
                        // Display an error if submission fails.
                        if (formStatus) {
                            formStatus.hidden = false;

                            formStatus.textContent =
                                error.message ||
                                "Something went wrong. Please try again.";

                            formStatus.classList.remove("success");
                            formStatus.classList.add("error");
                        }

                    } finally {
                        // Restore the button if the page hasn't navigated.
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.innerHTML =
                                originalButtonText;
                        }
                    }
                }
            );
        }

        console.log(
            "Service Enquiry Popup initialized successfully."
        );
    }


    // ============================================
    // EXPOSE INITIALIZER FOR components.js
    // ============================================

    window.initServiceEnquiryPopup =
        initServiceEnquiryPopup;

})();