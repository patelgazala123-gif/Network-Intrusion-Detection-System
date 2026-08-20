```javascript
/* =========================================
   ALERTS JAVASCRIPT
========================================= */


/* SEVERITY CHART */

const severityCanvas =
    document.getElementById("severityChart");

new Chart(severityCanvas, {

    type: "doughnut",

    data: {

        labels: [
            "Critical",
            "High",
            "Medium",
            "Low"
        ],

        datasets: [{
            data: [8, 15, 24, 13],
            borderWidth: 0
        }]
    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        cutout: "68%",

        plugins: {

            legend: {
                position: "bottom",

                labels: {
                    boxWidth: 9,
                    font: {
                        size: 10
                    }
                }
            }
        }
    }
});


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

    status.style.transform =
        "scale(1.04)";

    setTimeout(() => {

        status.style.transform =
            "scale(1)";

    }, 250);
}


/* START LIVE EFFECT */

setInterval(simulateAlert, 5000);
```
