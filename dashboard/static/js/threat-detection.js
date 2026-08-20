```javascript
/* =========================================
   THREAT DETECTION JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       ATTACK DISTRIBUTION - DONUT
    ===================================== */

    const attackCanvas =
        document.getElementById("attackChart");

    if (attackCanvas && typeof Chart !== "undefined") {

        new Chart(attackCanvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Port Scanning",
                    "Brute Force",
                    "DoS Activity",
                    "Unusual Traffic"
                ],

                datasets: [{

                    data: [
                        35,
                        25,
                        22,
                        18
                    ],

                    borderWidth: 0,

                    hoverOffset: 8
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "68%",

                animation: {

                    animateRotate: true,

                    animateScale: true,

                    duration: 1400
                },

                plugins: {

                    legend: {
                        display: false
                    }
                }
            }

        });

    }


    /* =====================================
       THREAT ACTIVITY - LINE GRAPH
    ===================================== */

    const timelineCanvas =
        document.getElementById("threatTimeline");

    if (timelineCanvas && typeof Chart !== "undefined") {

        const ctx =
            timelineCanvas.getContext("2d");

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                300
            );

        gradient.addColorStop(
            0,
            "rgba(11,110,121,0.25)"
        );

        gradient.addColorStop(
            1,
            "rgba(11,110,121,0)"
        );


        new Chart(timelineCanvas, {

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

                    label: "Threat Activity",

                    data: [
                        3,
                        6,
                        4,
                        9,
                        5,
                        11,
                        7
                    ],

                    borderWidth: 3,

                    borderColor: "#0b6e79",

                    backgroundColor: gradient,

                    fill: true,

                    tension: 0.4,

                    pointRadius: 4,

                    pointHoverRadius: 7,

                    pointBackgroundColor: "#0b6e79"
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: {

                    duration: 1600,

                    easing: "easeOutQuart"
                },

                interaction: {

                    intersect: false,

                    mode: "index"
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        enabled: true,

                        displayColors: false
                    }
                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            precision: 0
                        },

                        grid: {
                            color: "#edf0f2"
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


    /* =====================================
       RISK SCORE ANIMATION
    ===================================== */

    const scoreElement =
        document.getElementById("riskScore");

    if (scoreElement) {

        let current = 0;

        const target = 72;

        const interval =
            setInterval(function () {

                current++;

                scoreElement.textContent =
                    current;

                if (current >= target) {
                    clearInterval(interval);
                }

            }, 18);
    }

});


/* =========================================
   ATTACK CATEGORY INFORMATION
========================================= */

function showThreatInfo(type) {

    const title =
        document.getElementById("analysisTitle");

    const text =
        document.getElementById("analysisText");

    const status =
        document.getElementById("analysisStatus");


    const data = {

        "Port Scanning": {

            text:
                "Multiple service discovery attempts were identified across network ports.",

            status:
                "Investigation Recommended"
        },

        "Brute Force": {

            text:
                "Repeated authentication attempts were detected against a network service.",

            status:
                "High Attention"
        },

        "DoS Activity": {

            text:
                "Abnormally high traffic patterns were detected and require monitoring.",

            status:
                "Monitoring"
        },

        "Unusual Traffic": {

            text:
                "Network behavior differs from the established traffic pattern.",

            status:
                "Under Analysis"
        }

    };


    if (data[type]) {

        title.textContent =
            type;

        text.textContent =
            data[type].text;

        status.textContent =
            data[type].status;


        title.style.animation =
            "none";

        void title.offsetWidth;

        title.style.animation =
            "fadeIn .4s ease";
    }

}
```
