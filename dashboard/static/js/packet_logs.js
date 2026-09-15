/* =========================================
NIDS PACKET LOGS - LIGHTWEIGHT LIVE
========================================= */

let currentFilter = "all";
let loading = false;

const MAX_ROWS = 10;

/* =========================================
ELEMENTS
========================================= */

const tableBody = document.getElementById("packetTableBody");
const packetFilter = document.getElementById("packetFilter");

const totalPackets = document.getElementById("totalPackets");

const safeCount = document.getElementById("safeCount");
const suspiciousCount = document.getElementById("suspiciousCount");
const threatCount = document.getElementById("threatCount");

const safeBar = document.getElementById("safeBar");
const suspiciousBar = document.getElementById("suspiciousBar");
const threatBar = document.getElementById("threatBar");

/* =========================================
ESCAPE HTML
========================================= */

function escapeHTML(value) {

const div = document.createElement("div");

div.textContent = value ?? "";

return div.innerHTML;

}

/* =========================================
CREATE ROW
========================================= */

function createPacketRow(packet) {

const row = document.createElement("tr");

const status = packet.status || "Normal";

let statusClass = "safe";

if (status.toLowerCase() === "suspicious") {
    statusClass = "suspicious";
}

if (status.toLowerCase() === "threat") {
    statusClass = "threat";
}

row.innerHTML = `
    <td>${escapeHTML(packet.time)}</td>

    <td>${escapeHTML(packet.source_ip)}</td>

    <td>${escapeHTML(packet.destination_ip)}</td>

    <td>
        <span class="protocol-badge">
            ${escapeHTML(packet.protocol)}
        </span>
    </td>

    <td>${escapeHTML(packet.source_port || "-")}</td>

    <td>${escapeHTML(packet.destination_port || "-")}</td>

    <td>${escapeHTML(packet.packet_length)} B</td>

    <td>
        <span class="log-status ${statusClass}">
            ${escapeHTML(status)}
        </span>
    </td>
`;

return row;

}

/* =========================================
FILTER
========================================= */

function matchesFilter(packet) {

if (currentFilter === "all") {
    return true;
}

return String(packet.status || "safe").toLowerCase()
    === currentFilter;

}

/* =========================================
UPDATE DISTRIBUTION
========================================= */

function updateDistribution(data) {

const safe = Number(data.safe_count || 0);
const suspicious = Number(data.suspicious_count || 0);
const threat = Number(data.threat_count || 0);

const total = safe + suspicious + threat;

if (safeCount) {
    safeCount.textContent =
        safe.toLocaleString() + " packets";
}

if (suspiciousCount) {
    suspiciousCount.textContent =
        suspicious.toLocaleString() + " packets";
}

if (threatCount) {
    threatCount.textContent =
        threat.toLocaleString() + " packets";
}

if (total === 0) {

    safeBar.style.width = "100%";
    suspiciousBar.style.width = "0%";
    threatBar.style.width = "0%";

    return;
}

safeBar.style.width =
    ((safe / total) * 100) + "%";

suspiciousBar.style.width =
    ((suspicious / total) * 100) + "%";

threatBar.style.width =
    ((threat / total) * 100) + "%";

}

/* =========================================
LOAD LIVE PACKETS
========================================= */

async function loadPacketLogs() {

if (loading) {
    return;
}

loading = true;

try {

    const response = await fetch(
        `/packet-logs-data/?limit=10&_=${Date.now()}`,
        {
            method: "GET",
            cache: "no-store",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            "Server error: " + response.status
        );
    }

    const data = await response.json();

    /* ================================
       TOTAL
    ================================= */

    if (totalPackets) {

        totalPackets.textContent =
            Number(
                data.total_packets || 0
            ).toLocaleString();
    }


    /* ================================
       DISTRIBUTION
    ================================= */

    updateDistribution(data);


    /* ================================
       TABLE
    ================================= */

    if (!tableBody) {
        return;
    }

    let packets = data.packets || [];


    /* Apply filter */

    packets = packets.filter(
        matchesFilter
    );


    /* Only latest 10 */

    packets = packets.slice(0, MAX_ROWS);


    /* Completely replace visible rows */

    tableBody.innerHTML = "";


    if (packets.length === 0) {

        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="8">
                    No packets found.
                </td>
            </tr>
        `;

        return;
    }


    /* Add only latest packets */

    packets.forEach(
        function(packet) {

            tableBody.appendChild(
                createPacketRow(packet)
            );

        }
    );

}

catch (error) {

    console.error(
        "Packet log update failed:",
        error
    );

}

finally {

    loading = false;
}

}

/* =========================================
FILTER CHANGE
========================================= */

if (packetFilter) {

packetFilter.addEventListener(
    "change",
    function() {

        currentFilter = this.value;

        loadPacketLogs();

    }
);

}

/* =========================================
EXPORT LOGS
========================================= */

const exportButton =
document.getElementById("exportLogs");

if (exportButton) {

exportButton.addEventListener(
    "click",
    function() {

        const table =
            document.getElementById("logsTable");

        if (!table) {
            return;
        }

        let csv = "";

        const rows =
            table.querySelectorAll("tr");

        rows.forEach(
            function(row) {

                const cells =
                    row.querySelectorAll("th, td");

                const values = [];

                cells.forEach(
                    function(cell) {

                        const text =
                            cell.innerText
                                .replace(/,/g, " ")
                                .trim();

                        values.push(
                            `"${text}"`
                        );

                    }
                );

                csv +=
                    values.join(",") +
                    "\n";

            }
        );


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "NIDS_Packet_Logs.csv";


        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

    }
);

}

/* =========================================
INITIAL LOAD
========================================= */

loadPacketLogs();

/* =========================================
LIVE REFRESH
========================================= */

setInterval(
loadPacketLogs,
1000
);