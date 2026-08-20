/* =========================================
   SETTINGS PAGE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const saveBtn = document.getElementById("saveBtn");
    const resetBtn = document.getElementById("resetBtn");

    const interfaceSelect = document.getElementById("interface");
    const portScan = document.getElementById("portScan");
    const suspiciousIP = document.getElementById("suspiciousIP");
    const multipleConnection = document.getElementById("multipleConnection");
    const autoStart = document.getElementById("autoStart");
    const captureInterval = document.getElementById("captureInterval");

    const themeOptions = document.querySelectorAll(
        'input[name="theme"]'
    );


    /* =========================================
       SAVE SETTINGS
    ========================================= */

    saveBtn.addEventListener("click", function () {

        const selectedTheme = document.querySelector(
            'input[name="theme"]:checked'
        ).value;

        const settings = {
            interface: interfaceSelect.value,
            portScan: portScan.checked,
            suspiciousIP: suspiciousIP.checked,
            multipleConnection: multipleConnection.checked,
            autoStart: autoStart.checked,
            captureInterval: captureInterval.value,
            theme: selectedTheme
        };

        localStorage.setItem(
            "nidsSettings",
            JSON.stringify(settings)
        );

        showMessage(
            "Settings saved successfully!",
            "success"
        );
    });


    /* =========================================
       RESET SETTINGS
    ========================================= */

    resetBtn.addEventListener("click", function () {

        const confirmReset = confirm(
            "Are you sure you want to reset all settings to default?"
        );

        if (!confirmReset) {
            return;
        }

        interfaceSelect.value = "wifi";

        portScan.checked = true;
        suspiciousIP.checked = true;
        multipleConnection.checked = true;

        autoStart.checked = false;

        captureInterval.value = "1";

        document.querySelector(
            'input[name="theme"][value="light"]'
        ).checked = true;

        localStorage.removeItem("nidsSettings");

        showMessage(
            "Settings restored to default.",
            "success"
        );
    });


    /* =========================================
       LOAD SAVED SETTINGS
    ========================================= */

    const savedSettings = localStorage.getItem("nidsSettings");

    if (savedSettings) {

        const settings = JSON.parse(savedSettings);

        interfaceSelect.value =
            settings.interface || "wifi";

        portScan.checked =
            settings.portScan ?? true;

        suspiciousIP.checked =
            settings.suspiciousIP ?? true;

        multipleConnection.checked =
            settings.multipleConnection ?? true;

        autoStart.checked =
            settings.autoStart ?? false;

        captureInterval.value =
            settings.captureInterval || "1";

        const savedTheme = settings.theme || "light";

        const theme = document.querySelector(
            `input[name="theme"][value="${savedTheme}"]`
        );

        if (theme) {
            theme.checked = true;
        }
    }


    /* =========================================
       THEME SELECTION
    ========================================= */

    themeOptions.forEach(function (option) {

        option.addEventListener("change", function () {

            if (this.value === "dark") {
                document.body.classList.add("settings-dark-preview");
            } else {
                document.body.classList.remove(
                    "settings-dark-preview"
                );
            }

        });

    });


    /* =========================================
       MESSAGE
    ========================================= */

    function showMessage(message, type) {

        const oldMessage =
            document.querySelector(".settings-message");

        if (oldMessage) {
            oldMessage.remove();
        }

        const messageBox = document.createElement("div");

        messageBox.className =
            "settings-message " + type;

        messageBox.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(messageBox);

        setTimeout(function () {
            messageBox.classList.add("show");
        }, 10);

        setTimeout(function () {

            messageBox.classList.remove("show");

            setTimeout(function () {
                messageBox.remove();
            }, 300);

        }, 2500);
    }

});