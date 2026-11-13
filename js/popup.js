function dsInitSideForm() {

    /* =========================================
       GET ELEMENTS
    ========================================= */

    const openBtn = document.getElementById("dsFormOpen");
    const closeBtn = document.getElementById("dsFormClose");
    const drawer = document.getElementById("dsFormDrawer");
    const overlay = document.getElementById("dsFormOverlay");

    const form = document.getElementById("dsProjectForm");
    const statusBox = document.getElementById("dsFormStatus");

    if (
        !openBtn ||
        !closeBtn ||
        !drawer ||
        !overlay ||
        !form ||
        !statusBox
    ) {
        return;
    }

    /* (added) the form is injected after page load, so this function can be
       triggered twice (DOMContentLoaded + ds:sideform-ready). Run once only. */
    if (form.dataset.dsInit) {
        return;
    }
    form.dataset.dsInit = "1";

    const submitBtn = form.querySelector(".ds-form-submit");
    const submitText = submitBtn.querySelector("span:first-child");


    /* =========================================
       INPUT RESTRICTIONS
    ========================================= */

    const nameInput =
        form.querySelector('input[name="name"]');

    const companyInput =
        form.querySelector('input[name="company"]');

    const phoneInput =
        form.querySelector('input[name="phone"]');

    const budgetInput =
        form.querySelector('input[name="budget"]');


    /* Name: letters + spaces only */
    if (nameInput) {
        nameInput.addEventListener("input", function () {
            this.value =
                this.value.replace(/[^A-Za-z\s]/g, "");
        });
    }


    /* Company:
       letters, numbers, spaces and common company characters */
    if (companyInput) {
        companyInput.addEventListener("input", function () {
            this.value =
                this.value.replace(/[^A-Za-z0-9\s&.'-]/g, "");
        });
    }


    /* Phone: numbers only */
    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            this.value =
                this.value.replace(/[^0-9]/g, "");
        });
    }


    /* Budget: numbers + one decimal point */
    if (budgetInput) {
        budgetInput.addEventListener("input", function () {

            this.value =
                this.value.replace(/[^0-9.]/g, "");

            const parts =
                this.value.split(".");

            if (parts.length > 2) {

                this.value =
                    parts[0] +
                    "." +
                    parts.slice(1).join("");

            }

        });
    }


    /* =========================================
       OPEN / CLOSE DRAWER
    ========================================= */

    function openDrawer() {

        drawer.classList.add("active");
        overlay.classList.add("active");
        openBtn.classList.add("is-hidden");

        document.body.style.overflow = "hidden";

    }


    function closeDrawer() {

        drawer.classList.remove("active");
        overlay.classList.remove("active");
        openBtn.classList.remove("is-hidden");

        document.body.style.overflow = "";

    }


    openBtn.addEventListener(
        "click",
        openDrawer
    );

    closeBtn.addEventListener(
        "click",
        closeDrawer
    );

    overlay.addEventListener(
        "click",
        closeDrawer
    );

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeDrawer();
            }

        }
    );


    /* =========================================
       MULTI SERVICE DROPDOWN
    ========================================= */

    const servicesMultiSelect =
        document.querySelector(
            ".ds-services-multiselect"
        );

    const servicesSelectBtn =
        document.getElementById(
            "dsServicesSelectBtn"
        );

    const servicesSelectedText =
        document.getElementById(
            "dsServicesSelectedText"
        );


    let serviceCheckboxes = [];


    if (
        servicesMultiSelect &&
        servicesSelectBtn &&
        servicesSelectedText
    ) {

        serviceCheckboxes =
            servicesMultiSelect.querySelectorAll(
                'input[name="services[]"]'
            );


        /* (removed) the open/close click on this button is already handled in
           components.js; a second handler here would toggle it twice. */


        serviceCheckboxes.forEach(
            function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    updateSelectedServices
                );

            }
        );


        function updateSelectedServices() {

            const selected = [];

            serviceCheckboxes.forEach(
                function (checkbox) {

                    if (checkbox.checked) {
                        selected.push(
                            checkbox.value
                        );
                    }

                }
            );


            if (selected.length === 0) {

                servicesSelectedText.textContent =
                    "Select Services*";

            } else if (selected.length === 1) {

                servicesSelectedText.textContent =
                    selected[0];

            } else if (selected.length === 2) {

                servicesSelectedText.textContent =
                    selected.join(", ");

            } else {

                servicesSelectedText.textContent =
                    selected.length +
                    " Services Selected";

            }

        }


        /* Close dropdown when clicking outside */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    !servicesMultiSelect
                        .contains(event.target)
                ) {

                    servicesMultiSelect
                        .classList
                        .remove("active");

                }

            }
        );

    }


    /* =========================================
       FORM SUBMIT
    ========================================= */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            statusBox.className =
                "ds-form-status";

            statusBox.textContent = "";


            /* Browser validation */

            if (!form.checkValidity()) {

                form.reportValidity();

                return;

            }


            /* Require at least one service */

            const selectedServices =
                form.querySelectorAll(
                    'input[name="services[]"]:checked'
                );


            if (selectedServices.length === 0) {

                statusBox.className =
                    "ds-form-status error";

                statusBox.textContent =
                    "Please select at least one service.";


                if (servicesMultiSelect) {

                    servicesMultiSelect
                        .classList
                        .add("active");

                }

                return;

            }


            /* (added) OTP gate: email must be verified first */

            if (window.DSOtp && !window.DSOtp.isVerified(form)) {

                statusBox.className =
                    "ds-form-status error";

                statusBox.textContent =
                    window.DSOtp.requireVerification(form);

                return;

            }


            submitBtn.disabled = true;

            submitText.textContent =
                "Sending...";


            try {

                const formData =
                    new FormData(form);


                const response =
                    await fetch(
                        form.action,
                        {
                            method: "POST",

                            body: formData,

                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );


                /* =========================================
                   SAFE SERVER RESPONSE
                ========================================= */

                const responseText =
                    await response.text();


                let data;


                try {

                    data =
                        JSON.parse(responseText);

                } catch (jsonError) {

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


                /* =========================================
                   SUCCESS
                ========================================= */

                statusBox.className =
                    "ds-form-status success";

                statusBox.textContent =
                    data.message ||
                    "Your enquiry has been sent successfully.";


                form.reset();


                /* Reset services label */

                if (servicesSelectedText) {

                    servicesSelectedText.textContent =
                        "Select Services*";

                }


                if (servicesMultiSelect) {

                    servicesMultiSelect
                        .classList
                        .remove("active");

                }


                submitText.textContent =
                    "Sent Successfully";


                /* (changed) go to the Thank You page */

                if (window.DSOtp) {
                    window.DSOtp.reset(form);
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


                statusBox.className =
                    "ds-form-status error";


                statusBox.textContent =
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

}

document.addEventListener("DOMContentLoaded", dsInitSideForm);
document.addEventListener("ds:sideform-ready", dsInitSideForm);
