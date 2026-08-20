/* =========================================
   LIVE MONITORING
========================================= */


/* =========================================
   ANIMATED NUMBER COUNTER
========================================= */

const counters = document.querySelectorAll(".count-number");

counters.forEach(counter => {

    const target = Number(counter.dataset.target);
    const duration = 1200;

    let start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {

        const progress = Math.min(
            (currentTime - startTime) / duration,
            1
        );

        const value = Math.floor(
            progress * target
        );

        counter.textContent =
            value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);

});


/* =========================================
   LIVE TRAFFIC GRAPH
========================================= */

const chartCanvas =
    document.getElementById("liveTrafficChart");

if (chartCanvas) {

    const ctx = chartCanvas.getContext("2d");

    const trafficData = [
        42, 58, 51, 74, 65,
        82, 69, 91, 78, 96,
        84, 108
    ];

    const liveChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: [
                "", "", "", "", "", "",
                "", "", "", "", "", ""
            ],

            datasets: [{
                data: trafficData,

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

            animation: {
                duration: 1400,
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


    /* =====================================
       CONTINUOUS LIVE GRAPH MOVEMENT
    ===================================== */

    setInterval(() => {

        trafficData.shift();

        trafficData.push(
            Math.floor(Math.random() * 55) + 55
        );

        liveChart.update("none");

    }, 1800);

}


/* =========================================
   LIVE PACKET NUMBERS
========================================= */

const incoming =
    document.getElementById("incomingPackets");

const outgoing =
    document.getElementById("outgoingPackets");

setInterval(() => {

    if (incoming) {

        incoming.textContent =
            Math.floor(Math.random() * 20) + 65;

    }

    if (outgoing) {

        outgoing.textContent =
            Math.floor(Math.random() * 15) + 45;

    }

}, 2000);


/* =========================================
   LIVE PACKET FEED
========================================= */

const packetFeed =
    document.getElementById("packetFeed");

if (packetFeed) {

    const protocols = ["TCP", "UDP", "HTTP"];
    const statuses = [
        ["Safe", "safe"],
        ["Suspicious", "suspicious"]
    ];

    function addPacket() {

        const now = new Date();

        const time =
            now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

        const protocol =
            protocols[
                Math.floor(
                    Math.random() * protocols.length
                )
            ];

        const status =
            statuses[
                Math.floor(
                    Math.random() * statuses.length
                )
            ];

        const row =
            document.createElement("div");

        row.className = "packet-row";

        row.innerHTML = `
            <span class="packet-time">${time}</span>

            <span class="packet-ip">
                192.168.1.${Math.floor(Math.random() * 200) + 1}
            </span>

            <span class="packet-protocol">
                ${protocol}
            </span>

            <span class="packet-port">
                :${protocol === "HTTP" ? "80" : "443"}
            </span>

            <span class="packet-status ${status[1]}">
                ${status[0]}
            </span>
        `;

        packetFeed.prepend(row);

        /* Keep feed compact */
        while (packetFeed.children.length > 5) {
            packetFeed.removeChild(
                packetFeed.lastElementChild
            );
        }

    }

    /* New packet every 3 seconds */
    setInterval(addPacket, 3000);

}