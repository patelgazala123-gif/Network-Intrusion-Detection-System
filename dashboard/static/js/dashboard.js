/* =========================================
   NIDS DASHBOARD - REAL TIME
========================================= */

let trafficChart = null;


/* =========================================
   ELEMENTS
========================================= */

const trafficCanvas =
    document.getElementById("trafficChart");

const trafficRange =
    document.getElementById("trafficRange");


/* =========================================
   CREATE CHART
========================================= */

if (trafficCanvas) {

    const ctx =
        trafficCanvas.getContext("2d");

    trafficChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: [],

            datasets: [{

                label: "Packets / Second",

                data: [],

                borderColor: "#0B6E79",

                backgroundColor:
                    "rgba(11, 110, 121, 0.08)",

                borderWidth: 2.5,

                fill: true,

                tension: 0.35,

                pointRadius: 2,

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

                        font: {
                            size: 9
                        },

                        color: "#9CA3AF",

                        maxTicksLimit: 8
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
   NUMBER UPDATE
========================================= */

function updateNumber(
    element,
    value
) {

    if (!element) return;

    value =
        Number(value) || 0;

    element.textContent =
        value.toLocaleString();
}


/* =========================================
   SYSTEM STATUS
========================================= */

function updateSystemStatus(system) {

    if (!system) return;

    const items =
        document.querySelectorAll(
            ".resource-item"
        );

    if (items.length < 4) return;

    const values = [

        system.cpu,

        system.ram,

        system.storage,

        system.network
    ];

    values.forEach(
        function(value, index) {

            value = Math.max(
                0,
                Math.min(
                    100,
                    Number(value) || 0
                )
            );

            const item =
                items[index];

            const number =
                item.querySelector(
                    "strong"
                );

            const bar =
                item.querySelector(
                    ".progress-bar"
                );

            if (number) {

                number.textContent =
                    value + "%";
            }

            if (bar) {

                bar.style.width =
                    value + "%";
            }
        }
    );
}


/* =========================================
   RECENT ALERTS
========================================= */

function updateRecentAlerts(alerts) {

    const tbody =
        document.querySelector(
            ".alerts-card tbody"
        );

    if (!tbody) return;

    tbody.innerHTML = "";


    if (
        !alerts ||
        alerts.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center;">

                    No security alerts detected

                </td>

            </tr>
        `;

        return;
    }


    alerts.forEach(
        function(alert) {

            const severity =
                String(
                    alert.severity ||
                    "Low"
                ).toLowerCase();


            let statusClass =
                "detected-status";


            if (
                alert.status ===
                "Blocked"
            ) {

                statusClass =
                    "blocked-status";

            }
            else if (
                alert.status ===
                "Monitoring"
            ) {

                statusClass =
                    "monitoring-status";
            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${alert.time}
                </td>

                <td>
                    <span class="attack-name">
                        ${alert.attack_type}
                    </span>
                </td>

                <td>
                    ${alert.source_ip}
                </td>

                <td>
                    <span
                        class="severity ${severity}">
                        ${alert.severity}
                    </span>
                </td>

                <td>
                    <span
                        class="status ${statusClass}">
                        ${alert.status}
                    </span>
                </td>
            `;


            tbody.appendChild(row);
        }
    );
}


/* =========================================
   SHOW LIVE TRAFFIC
========================================= */

function showLiveTraffic(data) {

    if (!trafficChart) return;


    trafficChart.data.labels =
        data.traffic_labels || [];


    trafficChart
        .data
        .datasets[0]
        .data =
        data.traffic || [];


    trafficChart
        .data
        .datasets[0]
        .label =
        "Packets / Second";


    trafficChart.update("none");
}


/* =========================================
   SHOW 24 HOURS
========================================= */

function show24HourTraffic(data) {

    if (!trafficChart) return;


    trafficChart.data.labels =
        data.traffic_24_labels || [];


    trafficChart
        .data
        .datasets[0]
        .data =
        data.traffic_24 || [];


    trafficChart
        .data
        .datasets[0]
        .label =
        "Packets / Hour";


    trafficChart.update("none");
}


/* =========================================
   SHOW 7 DAYS
========================================= */

function show7DayTraffic(data) {

    if (!trafficChart) return;


    trafficChart.data.labels =
        data.traffic_7_labels || [];


    trafficChart
        .data
        .datasets[0]
        .data =
        data.traffic_7 || [];


    trafficChart
        .data
        .datasets[0]
        .label =
        "Packets / Day";


    trafficChart.update("none");
}


/* =========================================
   LOAD DASHBOARD DATA
========================================= */

async function loadDashboardData() {

    try {

        let range = "live";


        if (trafficRange) {

            if (
                trafficRange.value ===
                "Last 24 Hours"
            ) {

                range = "24h";

            }

            else if (
                trafficRange.value ===
                "Last 7 Days"
            ) {

                range = "7d";

            }

            else {

                range = "live";
            }
        }


        const response =
            await fetch(
                `/dashboard-data/?range=${range}&_=${Date.now()}`,
                {
                    method: "GET",

                    cache: "no-store",

                    headers: {
                        "X-Requested-With":
                            "XMLHttpRequest"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );
        }


        const data =
            await response.json();


        /* =================================
           UPDATE COUNTERS
        ================================= */

        updateNumber(

            document.getElementById(
                "packetCount"
            ),

            data.total_packets
        );


        updateNumber(

            document.getElementById(
                "threatCount"
            ),

            data.total_alerts
        );


        updateNumber(

            document.getElementById(
                "safeConnections"
            ),

            data.safe_connections
        );


        updateNumber(

            document.getElementById(
                "blockedIPs"
            ),

            data.blocked_ips
        );


        /* =================================
           UPDATE ALERTS
        ================================= */

        updateRecentAlerts(
            data.recent_alerts
        );


        /* =================================
           UPDATE SYSTEM
        ================================= */

        updateSystemStatus(
            data.system
        );


        /* =================================
           UPDATE GRAPH
        ================================= */

        if (range === "live") {

            showLiveTraffic(data);

        }

        else if (range === "24h") {

            show24HourTraffic(data);

        }

        else if (range === "7d") {

            show7DayTraffic(data);
        }

    }

    catch (error) {

        console.error(
            "Dashboard update failed:",
            error
        );
    }
}


/* =========================================
   DROPDOWN
========================================= */

if (trafficRange) {

    trafficRange.addEventListener(
        "change",
        function() {

            loadDashboardData();
        }
    );
}


/* =========================================
   INITIAL LOAD
========================================= */

loadDashboardData();


/* =========================================
   REFRESH EVERY 1 SECOND
========================================= */

setInterval(
    loadDashboardData,
    1000
);