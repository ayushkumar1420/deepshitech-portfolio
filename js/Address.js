document.addEventListener("DOMContentLoaded", function () {

    const officeBlock = document.getElementById("footerOfficeRotating");
    const officeName = document.getElementById("footerOfficeName");
    const officeAddress = document.getElementById("footerOfficeAddress");
    const officePhone = document.getElementById("footerOfficePhone");

    if (
        !officeBlock ||
        !officeName ||
        !officeAddress ||
        !window.SITE_OFFICES ||
        !window.SITE_OFFICES.length
    ) {
        return;
    }

    const offices = window.SITE_OFFICES;

    let currentIndex = 0;

    function cleanOfficeName(name) {
        if (name === "London Office") {
            return "London UK";
        }

        return name.replace(" Office", "");
    }

    function changeOffice() {

        officeBlock.classList.add("is-changing");

        setTimeout(function () {

            currentIndex = (currentIndex + 1) % offices.length;

            const office = offices[currentIndex];

            officeName.textContent = cleanOfficeName(office.name);
            officeAddress.textContent = office.address;

            if (office.phone) {
                officePhone.textContent = "Call: " + office.phone;
                officePhone.style.display = "block";
            } else {
                officePhone.textContent = "";
                officePhone.style.display = "none";
            }

            officeBlock.classList.remove("is-changing");

        }, 300);
    }

    setInterval(changeOffice, 3000);

});