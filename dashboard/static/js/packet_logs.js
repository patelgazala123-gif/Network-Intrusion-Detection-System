/* =========================================
   PACKET LOGS
========================================= */


/* =========================================
   PACKET FILTER
========================================= */

const packetFilter = document.getElementById("packetFilter");
const logRows = document.querySelectorAll("#logsTable tbody tr");

if (packetFilter) {

    packetFilter.addEventListener("change", function () {

        const selected = this.value;

        logRows.forEach((row, index) => {

            const status = row.dataset.status;

            if (selected === "all" || status === selected) {

                row.style.display = "";

                // Small entrance animation
                row.style.animation = "none";

                requestAnimationFrame(() => {
                    row.style.animation =
                        `fadeUp 0.3s ease ${index * 0.04}s both`;
                });

            } else {

                row.style.display = "none";

            }

        });

    });

}


/* =========================================
   EXPORT PACKET LOGS
========================================= */

const exportButton =
    document.getElementById("exportLogs");

if (exportButton) {

    exportButton.addEventListener("click", function () {

        const table =
            document.getElementById("logsTable");

        if (!table) return;

        const rows =
            table.querySelectorAll("tr");

        const csv = [];

        rows.forEach(row => {

            const cells =
                row.querySelectorAll("th, td");

            const rowData = [];

            cells.forEach(cell => {

                rowData.push(
                    `"${cell.innerText.trim()}"`
                );

            });

            csv.push(rowData.join(","));

        });

        const blob = new Blob(
            [csv.join("\n")],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = "NIDS_Packet_Logs.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    });

}


/* =========================================
   DISTRIBUTION BAR ANIMATION
========================================= */

window.addEventListener("load", () => {

    const bars = document.querySelectorAll(
        ".distribution-bar div"
    );

    bars.forEach((bar, index) => {

        const finalWidth =
            bar.style.width;

        bar.style.width = "0";

        setTimeout(() => {

            bar.style.width = finalWidth;

        }, 250 + (index * 150));

    });

});