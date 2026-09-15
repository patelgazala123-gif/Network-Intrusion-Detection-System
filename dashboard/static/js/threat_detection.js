/* =========================================
   THREAT DETECTION JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadThreatData();

});


/* =========================================
   LOAD REAL THREAT DATA
========================================= */

function loadThreatData() {

    fetch("/threat-detection-data/")
        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load threat data.");
            }

            return response.json();

        })

        .then(data => {

            updateSummary(data);
            updateRisk(data);
            updateChart(data);
            updateCategories(data);

        })

        .catch(error => {

            console.error("Threat detection error:", error);

            document.getElementById("categoryGrid").innerHTML =
                '<div class="empty-category">Unable to load threat data.</div>';

        });

}


/* =========================================
   SUMMARY
========================================= */

function updateSummary(data) {

    document.getElementById("threatCategories").textContent =
        data.threat_categories;

    document.getElementById("highRiskEvents").textContent =
        data.high_risk_events;

    document.getElementById("totalAlerts").textContent =
        data.total_alerts;

}


/* =========================================
   RISK SCORE
========================================= */

function updateRisk(data) {

    const scoreElement =
        document.getElementById("riskScore");

    const gauge =
        document.getElementById("riskGauge");

    const title =
        document.getElementById("riskTitle");

    const message =
        document.getElementById("riskMessage");


    const score = data.risk_score || 0;

    scoreElement.textContent = score;


    const degrees = score * 3.6;


    if (score >= 70) {

        gauge.style.background =
            `conic-gradient(
                #ef4444 0deg,
                #ef4444 ${degrees}deg,
                #e8edef ${degrees}deg,
                #e8edef 360deg
            )`;

        title.textContent = "High Risk";
        message.textContent = "Immediate attention required";

    }

    else if (score >= 40) {

        gauge.style.background =
            `conic-gradient(
                #f59e0b 0deg,
                #f59e0b ${degrees}deg,
                #e8edef ${degrees}deg,
                #e8edef 360deg
            )`;

        title.textContent = "Elevated Risk";
        message.textContent = "Network requires attention";

    }

    else {

        gauge.style.background =
            `conic-gradient(
                #22c55e 0deg,
                #22c55e ${degrees}deg,
                #e8edef ${degrees}deg,
                #e8edef 360deg
            )`;

        title.textContent = "Low Risk";
        message.textContent = "Network is being monitored";

    }

}


/* =========================================
   DONUT CHART
========================================= */

let attackChart = null;


function updateChart(data) {

    const canvas =
        document.getElementById("attackChart");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const labels =
        data.attack_labels || [];

    const values =
        data.attack_values || [];


    document.getElementById("totalThreats").textContent =
        data.total_alerts || 0;


    if (attackChart) {
        attackChart.destroy();
    }


    attackChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                data: values,

                borderWidth: 0,

                hoverOffset: 8,

                backgroundColor: [
                    "#0b6e79",
                    "#c4473c",
                    "#c27a00",
                    "#6b7c8a",
                    "#7c4dff",
                    "#d14d72",
                    "#2e9d63"
                ]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "68%",

            animation: {

                animateRotate: true,

                animateScale: true,

                duration: 900

            },

            plugins: {

                legend: {
                    display: false
                }

            }

        }

    });


    updateLegend(labels, values);

}


/* =========================================
   CHART LEGEND
========================================= */

function updateLegend(labels, values) {

    const legend =
        document.getElementById("chartLegend");

    legend.innerHTML = "";


    if (labels.length === 0) {

        legend.innerHTML =
            '<div class="empty-message">No threats detected yet.</div>';

        return;
    }


    const colors = [
        "#0b6e79",
        "#c4473c",
        "#c27a00",
        "#6b7c8a",
        "#7c4dff",
        "#d14d72",
        "#2e9d63"
    ];


    labels.forEach(function (label, index) {

        const item =
            document.createElement("div");

        item.className = "legend-item";


        const dot =
            document.createElement("span");

        dot.className = "legend-dot";

        dot.style.background =
            colors[index % colors.length];


        const name =
            document.createElement("span");

        name.textContent = label;


        const count =
            document.createElement("strong");

        count.textContent =
            values[index];


        item.appendChild(dot);
        item.appendChild(name);
        item.appendChild(count);

        legend.appendChild(item);

    });

}


/* =========================================
   ATTACK CATEGORIES
========================================= */

function updateCategories(data) {

    const grid =
        document.getElementById("categoryGrid");

    grid.innerHTML = "";


    const attacks =
        data.attacks || [];


    if (attacks.length === 0) {

        grid.innerHTML =
            '<div class="empty-category">No threats detected yet.</div>';

        return;
    }


    attacks.forEach(function (attack) {

        const card =
            document.createElement("div");

        card.className = "category-card";


        card.onclick = function () {

            showThreatInfo(
                attack.type,
                attack.count
            );

        };


        const icon =
            document.createElement("div");

        icon.className = "category-icon";

        icon.innerHTML =
            '<i class="' +
            getAttackIcon(attack.type) +
            '"></i>';


        const content =
            document.createElement("div");


        const title =
            document.createElement("h3");

        title.textContent =
            attack.type;


        const description =
            document.createElement("p");

        description.textContent =
            getAttackDescription(attack.type);


        content.appendChild(title);
        content.appendChild(description);


        const count =
            document.createElement("strong");

        count.textContent =
            attack.count;


        card.appendChild(icon);
        card.appendChild(content);
        card.appendChild(count);


        grid.appendChild(card);

    });

}


/* =========================================
   ATTACK ICONS
========================================= */

function getAttackIcon(type) {

    const icons = {

        "High Traffic":
            "fas fa-chart-line",

        "Possible Port Scan":
            "fas fa-magnifying-glass",

        "ICMP Flood":
            "fas fa-tower-broadcast",

        "SYN Flood":
            "fas fa-bolt",

        "UDP Flood":
            "fas fa-wave-square",

        "ARP Spoofing":
            "fas fa-network-wired",

        "Firewall Disabled":
            "fas fa-shield-halved"

    };


    return icons[type] ||
           "fas fa-triangle-exclamation";

}


/* =========================================
   ATTACK DESCRIPTIONS
========================================= */

function getAttackDescription(type) {

    const descriptions = {

        "High Traffic":
            "Abnormally high packet traffic detected.",

        "Possible Port Scan":
            "Multiple destination ports were accessed.",

        "ICMP Flood":
            "High volume of ICMP packets detected.",

        "SYN Flood":
            "High number of TCP SYN packets detected.",

        "UDP Flood":
            "High volume of UDP packets detected.",

        "ARP Spoofing":
            "Suspicious ARP activity detected.",

        "Firewall Disabled":
            "Windows Firewall is currently disabled."

    };


    return descriptions[type] ||
           "Suspicious network activity detected.";

}


/* =========================================
   THREAT ANALYSIS
========================================= */

function showThreatInfo(type, count) {

    const title =
        document.getElementById("analysisTitle");

    const text =
        document.getElementById("analysisText");

    const status =
        document.getElementById("analysisStatus");


    title.textContent =
        type;


    text.textContent =
        getAttackDescription(type) +
        " Total detected events: " +
        count;


    if (
        type === "ARP Spoofing" ||
        type === "Firewall Disabled"
    ) {

        status.textContent =
            "Critical Attention";

    }

    else if (
        type === "SYN Flood" ||
        type === "UDP Flood" ||
        type === "ICMP Flood"
    ) {

        status.textContent =
            "High Attention";

    }

    else {

        status.textContent =
            "Investigation Recommended";

    }

}


/* =========================================
   AUTO REFRESH
========================================= */

setInterval(function () {

    loadThreatData();

}, 5000);