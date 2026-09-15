/* =========================================
   REPORTS JAVASCRIPT
========================================= */

let activityChart = null;
let threatChart = null;


/* =========================================
   LOAD REPORT DATA
========================================= */

function loadReports() {

    const period =
        document.getElementById("reportPeriod").value;

    let days = 7;

    if (period === "Last 30 Days") {
        days = 30;
    }

    if (period === "Last 3 Months") {
        days = 90;
    }

    fetch(`/reports-data/?period=${days}`)
        .then(response => response.json())
        .then(data => {

            updateActivityChart(data);
            updateThreatChart(data);
            updateSecurityScore(data);

        })
        .catch(error => {

            console.error(
                "Error loading report data:",
                error
            );

        });
}


/* =========================================
   NETWORK ACTIVITY
========================================= */

function updateActivityChart(data) {

    const canvas =
        document.getElementById("activityChart");

    if (!canvas) return;

    if (activityChart) {
        activityChart.destroy();
    }

    activityChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: data.traffic_labels,

            datasets: [

                {
                    label: "Network Activity",

                    data: data.traffic_values,

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
   THREAT SUMMARY
========================================= */

function updateThreatChart(data) {

    const canvas =
        document.getElementById("threatChart");

    if (!canvas) return;

    if (threatChart) {
        threatChart.destroy();
    }

    threatChart = new Chart(canvas, {

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
                        data.detected,
                        data.resolved
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
   SECURITY SCORE
========================================= */

function updateSecurityScore(data) {

    const score =
        data.security_score;

    const scoreElement =
        document.getElementById("securityScore");

    const statusElement =
        document.getElementById("scoreStatus");

    const gauge =
        document.querySelector(".score-gauge");

    if (scoreElement) {
        scoreElement.textContent = score;
    }

    if (statusElement) {
        statusElement.textContent =
            data.score_status;
    }

    if (gauge) {

        gauge.style.background =
            `conic-gradient(
                #0b6e79 ${score}%,
                #e8eef0 ${score}%
            )`;
    }
}


/* =========================================
   PERIOD SELECTOR
========================================= */

const period =
    document.getElementById("reportPeriod");

if (period) {

    period.addEventListener(
        "change",
        loadReports
    );
}


/* =========================================
   INITIAL LOAD
========================================= */

loadReports();