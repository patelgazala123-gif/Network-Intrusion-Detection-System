/* =========================================
   REPORTS JAVASCRIPT
========================================= */


/* =========================================
   NETWORK ACTIVITY - LINE GRAPH
========================================= */

const activityCanvas =
    document.getElementById("activityChart");

if (activityCanvas) {

    new Chart(activityCanvas, {

        type: "line",

        data: {

            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            datasets: [

                {
                    label: "Network Activity",

                    data: [
                        420,
                        610,
                        530,
                        760,
                        680,
                        820,
                        720
                    ],

                    borderWidth: 3,

                    tension: 0.4,

                    fill: false,

                    pointRadius: 4,

                    pointHoverRadius: 7
                }

            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {
                duration: 1200
            },

            plugins: {

                legend: {
                    display: false
                }
            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        precision: 0
                    }
                },

                x: {

                    grid: {
                        display: false
                    }
                }
            }
        }

    });
}


/* =========================================
   THREAT SUMMARY - BAR GRAPH
========================================= */

const threatCanvas =
    document.getElementById("threatChart");

if (threatCanvas) {

    new Chart(threatCanvas, {

        type: "bar",

        data: {

            labels: [
                "Detected",
                "Resolved"
            ],

            datasets: [

                {
                    label: "Security Events",

                    data: [
                        34,
                        27
                    ],

                    borderWidth: 0,

                    borderRadius: 8,

                    barThickness: 60
                }

            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {
                duration: 1200
            },

            plugins: {

                legend: {
                    display: false
                }
            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        precision: 0
                    }
                },

                x: {

                    grid: {
                        display: false
                    }
                }
            }
        }

    });
}


/* =========================================
   GENERATE REPORT
========================================= */

function generateReport() {

    const button =
        document.getElementById("generateBtn");

    button.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Generating...';

    button.disabled = true;

    setTimeout(function () {

        button.innerHTML =
            '<i class="fas fa-check"></i> Report Ready';

        button.disabled = false;

    }, 1800);
}


/* =========================================
   PERIOD SELECTOR
========================================= */

const period =
    document.getElementById("reportPeriod");

if (period) {

    period.addEventListener(
        "change",
        function () {

            console.log(
                "Selected:",
                this.value
            );

        }
    );
}