/* =========================================
   ALERTS JAVASCRIPT
========================================= */




/* OPEN ALERT */

function openAlert(alert) {

    if (
        event &&
        event.target &&
        event.target.classList.contains("ack-btn")
    ) {
        return;
    }

    alert.classList.toggle("open");
}


/* ACKNOWLEDGE ALERT */

function acknowledgeAlert(event, button) {

    event.stopPropagation();

    const alert =
        button.closest(".alert-item");

    const severity =
        alert.querySelector(".severity");

    severity.textContent = "Acknowledged";

    severity.className =
        "severity resolved";

    alert.classList.add("acknowledged");

    button.textContent = "Acknowledged";

    button.disabled = true;

    button.style.opacity = "0.6";
}


/* CLEAR RESOLVED */

function clearResolved() {

    const resolvedAlerts =
        document.querySelectorAll(
            '.alert-item[data-resolved="true"]'
        );

    resolvedAlerts.forEach(alert => {

        alert.style.opacity = "0";

        alert.style.transform = "translateX(30px)";

        setTimeout(() => {
            alert.remove();
        }, 300);

    });
}


/* SIMULATED LIVE ALERT */

function simulateAlert() {

    const status =
        document.querySelector(".alert-system-status");

    if (!status) return;

    status.style.transform =
        "scale(1.04)";

    setTimeout(() => {

        status.style.transform =
            "scale(1)";

    }, 250);
}


/* START LIVE EFFECT */

setInterval(simulateAlert, 5000);