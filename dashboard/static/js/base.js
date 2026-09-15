/* =========================================
   NIDS BASE JAVASCRIPT
========================================= */


/* =========================================
   GLOBAL THEME
========================================= */

const savedTheme = localStorage.getItem("nidsTheme") || "light";

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
} else {
    document.body.classList.remove("dark-mode");
}


/* =========================================
   SIDEBAR TOGGLE
========================================= */

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

if (sidebarToggle && sidebar) {

    sidebarToggle.addEventListener("click", () => {

        sidebar.classList.toggle("open");

    });

}


/* =========================================
   FAB
========================================= */

const fabMain = document.getElementById("fabMain");
const fabContainer = document.querySelector(".fab-container");

if (fabMain && fabContainer) {

    fabMain.addEventListener("click", () => {

        fabContainer.classList.toggle("open");

    });

}


/* =========================================
   DATE & TIME
========================================= */

const datetime = document.getElementById("datetime");

function updateDateTime() {

    if (!datetime) return;

    const now = new Date();

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };

    datetime.textContent =
        now.toLocaleString("en-IN", options);
}

updateDateTime();

setInterval(updateDateTime, 1000);


/* =========================================
   SEARCH SHORTCUT
========================================= */

document.addEventListener("keydown", (event) => {

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        const search =
            document.getElementById("globalSearch");

        if (search) {
            search.focus();
        }

    }

});


/* =========================================
   NOTIFICATIONS
========================================= */

const notificationBtn =
    document.querySelector(".notification-btn");

if (notificationBtn) {

    notificationBtn.addEventListener("click", () => {

        window.location.href = "/alerts";

    });

}


/* =========================================
   CLOSE SIDEBAR ON MOBILE
========================================= */

document.addEventListener("click", (event) => {

    if (!sidebar || !sidebarToggle) return;

    if (
        window.innerWidth <= 800 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !sidebarToggle.contains(event.target)
    ) {

        sidebar.classList.remove("open");

    }

});
/* =========================================
   GLOBAL SEARCH
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const globalSearch =
        document.getElementById("globalSearch");

    if (!globalSearch) {
        return;
    }

    globalSearch.addEventListener("keydown", function (event) {

        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();

        const query =
            globalSearch.value.trim().toLowerCase();

        if (query === "") {
            return;
        }

        const pages = {

            "dashboard": "/",
            "home": "/",

            "live monitoring": "/live-monitoring/",
            "monitoring": "/live-monitoring/",
            "live": "/live-monitoring/",

            "packet logs": "/packet-logs/",
            "packet": "/packet-logs/",
            "packets": "/packet-logs/",
            "logs": "/packet-logs/",

            "threat detection": "/threat-detection/",
            "threat": "/threat-detection/",
            "threats": "/threat-detection/",

            "alerts": "/alerts/",
            "alert": "/alerts/",

            "reports": "/reports/",
            "report": "/reports/",

            "settings": "/settings/",
            "setting": "/settings/"
        };

        if (pages[query]) {

            window.location.assign(pages[query]);

        } else {

            alert("No matching page found.");

        }

    });

});