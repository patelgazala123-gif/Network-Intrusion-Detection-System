/* =========================================
   NIDS DASHBOARD JAVASCRIPT
========================================= */


/* =========================================
   NETWORK TRAFFIC CHART
========================================= */

const trafficCanvas = document.getElementById("trafficChart");

if (trafficCanvas) {

    const ctx = trafficCanvas.getContext("2d");

    new Chart(ctx, {

        type: "line",

        data: {

            labels: [
                "00:00",
                "04:00",
                "08:00",
                "12:00",
                "16:00",
                "20:00",
                "24:00"
            ],

            datasets: [{
                label: "Network Traffic",

                data: [
                    220,
                    450,
                    390,
                    620,
                    540,
                    760,
                    680
                ],

                borderColor: "#0B6E79",

                backgroundColor: "rgba(11, 110, 121, 0.08)",

                borderWidth: 2.5,

                fill: true,

                tension: 0.4,

                pointRadius: 3,

                pointHoverRadius: 6
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {
                duration: 1200,
                easing: "easeOutQuart"
            },

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                x: {
                    grid: {
                        display: false
                    },

                    ticks: {
                        font: {
                            size: 9
                        },

                        color: "#9CA3AF"
                    }
                },

                y: {

                    beginAtZero: true,

                    border: {
                        display: false
                    },

                    grid: {
                        color: "#EEF1F3"
                    },

                    ticks: {
                        font: {
                            size: 9
                        },

                        color: "#9CA3AF"
                    }
                }

            }
        }

    });

}


/* =========================================
   STATISTICS COUNT-UP
========================================= */

function animateNumber(element, target) {

    if (!element) return;

    let current = 0;

    const duration = 900;

    const startTime = performance.now();

    function update(time) {

        const progress = Math.min(
            (time - startTime) / duration,
            1
        );

        current = Math.floor(target * progress);

        element.textContent =
            current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }

    }

    requestAnimationFrame(update);
}


animateNumber(
    document.getElementById("packetCount"),
    24650
);

animateNumber(
    document.getElementById("threatCount"),
    38
);


/* =========================================
   TRAFFIC RANGE
========================================= */

const trafficRange =
    document.getElementById("trafficRange");

if (trafficRange) {

    trafficRange.addEventListener("change", function () {

        console.log(
            "Traffic range:",
            this.value
        );

        // Later this will connect
        // to real Django/network data.

    });

}