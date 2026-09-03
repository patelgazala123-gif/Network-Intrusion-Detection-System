/* =========================================
   NIDS PACKET LOGS - LIVE
========================================= */

let knownPacketIds = [];

let currentFilter = "all";

const MAX_ROWS = 10;


/* =========================================
   ELEMENTS
========================================= */

const tableBody =
    document.getElementById(
        "packetTableBody"
    );

const packetFilter =
    document.getElementById(
        "packetFilter"
    );

const totalPackets =
    document.getElementById(
        "totalPackets"
    );

const safeCount =
    document.getElementById(
        "safeCount"
    );

const suspiciousCount =
    document.getElementById(
        "suspiciousCount"
    );

const threatCount =
    document.getElementById(
        "threatCount"
    );

const safeBar =
    document.getElementById(
        "safeBar"
    );

const suspiciousBar =
    document.getElementById(
        "suspiciousBar"
    );

const threatBar =
    document.getElementById(
        "threatBar"
    );


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================================
   FORMAT PACKET
========================================= */

function createPacketRow(packet) {

    const row =
        document.createElement("tr");

    row.dataset.packetId =
        packet.id;

    const status =
        packet.status || "Normal";

    let statusClass = "safe";

    if (
        status.toLowerCase() ===
        "suspicious"
    ) {

        statusClass =
            "suspicious";
    }

    else if (
        status.toLowerCase() ===
        "threat"
    ) {

        statusClass =
            "threat";
    }


    row.innerHTML = `

        <td>
            ${escapeHTML(packet.time)}
        </td>

        <td>
            ${escapeHTML(packet.source_ip)}
        </td>

        <td>
            ${escapeHTML(packet.destination_ip)}
        </td>

        <td>
            <span class="protocol-badge">
                ${escapeHTML(packet.protocol)}
            </span>
        </td>

        <td>
            ${escapeHTML(packet.source_port)}
        </td>

        <td>
            ${escapeHTML(packet.destination_port)}
        </td>

        <td>
            ${escapeHTML(packet.packet_length)} B
        </td>

        <td>

            <span
                class="log-status ${statusClass}">

                ${escapeHTML(status)}

            </span>

        </td>
    `;


    return row;
}


/* =========================================
   ADD NEW PACKET
========================================= */

function addPacket(packet) {

    if (!tableBody) return;


    /* Remove empty message */

    const emptyRow =
        tableBody.querySelector(
            ".empty-row"
        );

    if (emptyRow) {

        emptyRow.remove();
    }


    const row =
        createPacketRow(packet);


    row.classList.add(
        "new-packet"
    );


    /*
       NEW PACKET GOES TO TOP
    */

    tableBody.prepend(row);


    /*
       Keep only latest 10 rows
    */

    while (
        tableBody.children.length >
        MAX_ROWS
    ) {

        const lastRow =
            tableBody.lastElementChild;

        lastRow.classList.add(
            "packet-remove"
        );

        setTimeout(
            function() {

                if (lastRow) {
                    lastRow.remove();
                }

            },
            300
        );
    }


    knownPacketIds.push(
        packet.id
    );


    /*
       Keep memory small
    */

    if (
        knownPacketIds.length >
        100
    ) {

        knownPacketIds =
            knownPacketIds.slice(-50);
    }
}


/* =========================================
   LOAD PACKETS
========================================= */

async function loadPacketLogs() {

    try {

        const response =
            await fetch(
                `/packet-logs-data/?_=${Date.now()}`,
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
           TOTAL
        ================================= */

        if (totalPackets) {

            totalPackets.textContent =
                Number(
                    data.total_packets || 0
                ).toLocaleString();
        }


        /* =================================
           DISTRIBUTION
        ================================= */

        updateDistribution(data);


        /* =================================
           INITIAL TABLE
        ================================= */

        if (
            knownPacketIds.length === 0
        ) {

            tableBody.innerHTML = "";

            const packets =
                data.packets || [];

            packets.forEach(
                function(packet) {

                    knownPacketIds.push(
                        packet.id
                    );

                    if (
                        matchesFilter(
                            packet
                        )
                    ) {

                        tableBody.appendChild(
                            createPacketRow(
                                packet
                            )
                        );
                    }
                }
            );

            return;
        }


        /* =================================
           NEW PACKETS
        ================================= */

        const packets =
            data.packets || [];


        /*
           API returns newest first.
        */

        const newPackets =
            packets
                .filter(
                    function(packet) {

                        return !knownPacketIds
                            .includes(
                                packet.id
                            );
                    }
                )
                .reverse();


        /*
           Add newest packets
           one by one.
        */

        newPackets.forEach(
            function(packet) {

                if (
                    matchesFilter(
                        packet
                    )
                ) {

                    addPacket(packet);
                }

            }
        );

    }

    catch (error) {

        console.error(
            "Packet log update failed:",
            error
        );
    }
}


/* =========================================
   FILTER CHECK
========================================= */

function matchesFilter(packet) {

    if (
        currentFilter === "all"
    ) {

        return true;
    }


    return (
        String(
            packet.status || "safe"
        ).toLowerCase() ===
        currentFilter
    );
}


/* =========================================
   DISTRIBUTION
========================================= */

function updateDistribution(data) {

    const safe =
        Number(
            data.safe_count || 0
        );

    const suspicious =
        Number(
            data.suspicious_count || 0
        );

    const threat =
        Number(
            data.threat_count || 0
        );


    const total =
        safe +
        suspicious +
        threat;


    if (safeCount) {

        safeCount.textContent =
            safe.toLocaleString() +
            " packets";
    }


    if (suspiciousCount) {

        suspiciousCount.textContent =
            suspicious.toLocaleString() +
            " packets";
    }


    if (threatCount) {

        threatCount.textContent =
            threat.toLocaleString() +
            " packets";
    }


    if (total <= 0) {

        safeBar.style.width =
            "100%";

        suspiciousBar.style.width =
            "0%";

        threatBar.style.width =
            "0%";

        return;
    }


    safeBar.style.width =
        ((safe / total) * 100) +
        "%";


    suspiciousBar.style.width =
        ((suspicious / total) * 100) +
        "%";


    threatBar.style.width =
        ((threat / total) * 100) +
        "%";
}


/* =========================================
   FILTER CHANGE
========================================= */

if (packetFilter) {

    packetFilter.addEventListener(
        "change",
        function() {

            currentFilter =
                this.value;

            rebuildTable();
        }
    );
}


/* =========================================
   REBUILD TABLE
========================================= */

async function rebuildTable() {

    try {

        const response =
            await fetch(
                `/packet-logs-data/?_=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );


        const data =
            await response.json();


        tableBody.innerHTML = "";


        const packets =
            data.packets || [];


        packets.forEach(
            function(packet) {

                if (
                    matchesFilter(
                        packet
                    )
                ) {

                    tableBody.appendChild(
                        createPacketRow(
                            packet
                        )
                    );
                }
            }
        );


        if (
            tableBody.children.length === 0
        ) {

            tableBody.innerHTML = `

                <tr class="empty-row">

                    <td colspan="8">

                        No packets found.

                    </td>

                </tr>
            `;
        }

    }

    catch (error) {

        console.error(
            "Filter failed:",
            error
        );
    }
}


/* =========================================
   EXPORT LOGS
========================================= */

const exportButton =
    document.getElementById(
        "exportLogs"
    );


if (exportButton) {

    exportButton.addEventListener(
        "click",
        function() {

            const table =
                document.getElementById(
                    "logsTable"
                );


            if (!table) return;


            let csv = "";


            const rows =
                table.querySelectorAll(
                    "tr"
                );


            rows.forEach(
                function(row) {

                    const cells =
                        row.querySelectorAll(
                            "th, td"
                        );


                    const values = [];


                    cells.forEach(
                        function(cell) {

                            let text =
                                cell.innerText
                                    .replace(
                                        /,/g,
                                        " "
                                    )
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
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download =
                "NIDS_Packet_Logs.csv";


            document.body.appendChild(
                link
            );


            link.click();

            link.remove();


            URL.revokeObjectURL(
                url
            );
        }
    );
}


/* =========================================
   START
========================================= */

loadPacketLogs();


/*
   Refresh every 1 second.
*/

setInterval(
    loadPacketLogs,
    1000
);