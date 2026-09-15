/* =========================================
   LIVE MONITORING - REAL DATA
========================================= */

let liveChart = null;


/* =========================================
   CREATE LIVE TRAFFIC CHART
========================================= */

const chartCanvas =
    document.getElementById("liveTrafficChart");

if (chartCanvas) {

    const ctx = chartCanvas.getContext("2d");

    liveChart = new Chart(ctx, {

        type: "line",

        data: {
            labels: [],
            datasets: [{
                data: [],

                borderColor: "#0B6E79",

                backgroundColor:
                    "rgba(11,110,121,0.08)",

                borderWidth: 2.5,

                fill: true,

                tension: 0.45,

                pointRadius: 0,

                pointHoverRadius: 5
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: false,

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
                        display: false
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
                        color: "#9CA3AF",
                        font: {
                            size: 9
                        }
                    }
                }
            }
        }
    });
}


/* =========================================
   UPDATE LIVE DATA
========================================= */

function updateLiveMonitoring() {

    fetch(
        "/live-monitoring-data/?t=" +
        Date.now(),
        {
            cache: "no-store"
        }
    )

    .then(response => {

        if (!response.ok) {
            throw new Error(
                "HTTP Error: " + response.status
            );
        }

        return response.json();
    })

    .then(data => {

        console.log(
            "Live monitoring data:",
            data
        );


        /* =====================================
           PACKETS / SECOND
        ===================================== */

        const metricCards =
            document.querySelectorAll(
                ".live-metric-card .count-number"
            );

        if (metricCards.length >= 1) {

            metricCards[0].textContent =
                data.packets_per_second;
        }


        /* =====================================
           ACTIVE CONNECTIONS
        ===================================== */

        if (metricCards.length >= 2) {

            metricCards[1].textContent =
                data.active_connections;
        }


        /* =====================================
           THREATS DETECTED
        ===================================== */

        if (metricCards.length >= 3) {

            metricCards[2].textContent =
                data.threats_detected;
        }


        /* =====================================
           INCOMING
        ===================================== */

        const incoming =
            document.getElementById(
                "incomingPackets"
            );

        if (incoming) {

            incoming.textContent =
                data.incoming;
        }


        /* =====================================
           OUTGOING
        ===================================== */

        const outgoing =
            document.getElementById(
                "outgoingPackets"
            );

        if (outgoing) {

            outgoing.textContent =
                data.outgoing;
        }


        /* =====================================
           LIVE TRAFFIC CHART
        ===================================== */

        if (liveChart) {

            liveChart.data.labels =
                data.labels;

            liveChart.data.datasets[0].data =
                data.traffic;

            liveChart.update("none");
        }


        /* =====================================
           LIVE PACKET FEED
        ===================================== */

        const packetFeed =
            document.getElementById(
                "packetFeed"
            );

        if (packetFeed) {

            packetFeed.innerHTML = "";

            data.packets.forEach(packet => {

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "packet-row";

                row.innerHTML = `

                    <span class="packet-time">
                        ${packet.time}
                    </span>

                    <span class="packet-ip">
                        ${packet.source_ip}
                    </span>

                    <span class="packet-protocol">
                        ${packet.protocol}
                    </span>

                    <span class="packet-port">
                        :${packet.port}
                    </span>

                    <span class="packet-status ${packet.status_class}">
                        ${packet.status}
                    </span>

                `;

                packetFeed.appendChild(row);

            });
        }

    })

    .catch(error => {

        console.error(
            "Live Monitoring Error:",
            error
        );

    });
}


/* =========================================
   START LIVE MONITORING
========================================= */

updateLiveMonitoring();

setInterval(
    updateLiveMonitoring,
    1000
);