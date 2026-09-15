document.addEventListener("DOMContentLoaded", function () {

    const lightTheme = document.getElementById("lightTheme");
    const darkTheme = document.getElementById("darkTheme");

    const saveBtn = document.getElementById("saveBtn");
    const resetBtn = document.getElementById("resetBtn");

    const clearLogsBtn = document.getElementById("clearLogsBtn");
    const clearAlertsBtn = document.getElementById("clearAlertsBtn");

    const message = document.getElementById("settingsMessage");


    /* =========================================
       SHOW MESSAGE
    ========================================= */

    function showMessage(text) {

        message.textContent = text;
        message.style.display = "block";

        setTimeout(function () {
            message.style.display = "none";
        }, 2500);
    }


    /* =========================================
       APPLY THEME
    ========================================= */

    function applyTheme(theme) {

        if (theme === "dark") {

            document.body.classList.add("dark-mode");

            darkTheme.checked = true;
            lightTheme.checked = false;

        } else {

            document.body.classList.remove("dark-mode");

            lightTheme.checked = true;
            darkTheme.checked = false;
        }
    }


    /* =========================================
       LOAD SAVED THEME
    ========================================= */

    const savedTheme =
        localStorage.getItem("nidsTheme") || "light";

    applyTheme(savedTheme);


    /* =========================================
       THEME CHANGE
    ========================================= */

    lightTheme.addEventListener("change", function () {

        if (this.checked) {

            applyTheme("light");

            showMessage("Light mode selected.");
        }

    });


    darkTheme.addEventListener("change", function () {

        if (this.checked) {

            applyTheme("dark");

            showMessage("Dark mode selected.");
        }

    });


    /* =========================================
       SAVE
    ========================================= */

    saveBtn.addEventListener("click", function () {

        const selected =
            document.querySelector(
                'input[name="theme"]:checked'
            );

        if (!selected) {
            return;
        }

        localStorage.setItem(
            "nidsTheme",
            selected.value
        );

        applyTheme(selected.value);

        showMessage("Settings saved successfully.");

    });


    /* =========================================
       RESET
    ========================================= */

    resetBtn.addEventListener("click", function () {

        const confirmReset = confirm(
            "Reset settings to default?"
        );

        if (!confirmReset) {
            return;
        }

        localStorage.setItem(
            "nidsTheme",
            "light"
        );

        applyTheme("light");

        showMessage(
            "Settings restored to default."
        );

    });


    /* =========================================
       GET CSRF TOKEN
    ========================================= */

    function getCSRFToken() {

        const csrfInput =
            document.querySelector(
                '[name="csrfmiddlewaretoken"]'
            );

        if (csrfInput) {
            return csrfInput.value;
        }

        return "";
    }


    /* =========================================
       CLEAR PACKET LOGS
    ========================================= */

    clearLogsBtn.addEventListener("click", function () {

        const confirmClear = confirm(
            "Are you sure you want to delete all packet logs?"
        );

        if (!confirmClear) {
            return;
        }

        clearLogsBtn.disabled = true;

        fetch("/clear-packet-logs/", {

            method: "POST",

            headers: {
                "X-CSRFToken": getCSRFToken(),
                "Content-Type": "application/json"
            }

        })

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "HTTP Error: " + response.status
                );
            }

            return response.json();

        })

        .then(data => {

            if (data.success) {

                showMessage(
                    "Packet logs cleared successfully."
                );

            } else {

                showMessage(
                    data.message ||
                    "Unable to clear packet logs."
                );
            }

        })

        .catch(error => {

            console.error(
                "Clear packet logs error:",
                error
            );

            showMessage(
                "Unable to clear packet logs."
            );

        })

        .finally(() => {

            clearLogsBtn.disabled = false;

        });

    });


    /* =========================================
       CLEAR ALERT HISTORY
    ========================================= */

    clearAlertsBtn.addEventListener("click", function () {

        const confirmClear = confirm(
            "Are you sure you want to delete all alert history?"
        );

        if (!confirmClear) {
            return;
        }

        clearAlertsBtn.disabled = true;

        fetch("/clear-alerts/", {

            method: "POST",

            headers: {
                "X-CSRFToken": getCSRFToken(),
                "Content-Type": "application/json"
            }

        })

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "HTTP Error: " + response.status
                );
            }

            return response.json();

        })

        .then(data => {

            if (data.success) {

                showMessage(
                    "Alert history cleared successfully."
                );

            } else {

                showMessage(
                    data.message ||
                    "Unable to clear alert history."
                );
            }

        })

        .catch(error => {

            console.error(
                "Clear alerts error:",
                error
            );

            showMessage(
                "Unable to clear alert history."
            );

        })

        .finally(() => {

            clearAlertsBtn.disabled = false;

        });

    });

});