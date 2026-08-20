/* =========================================
   NIDS BASE JAVASCRIPT
========================================= */


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

    datetime.textContent = now.toLocaleString("en-IN", options);
}

updateDateTime();

setInterval(updateDateTime, 1000);


/* =========================================
   SEARCH SHORTCUT
========================================= */

document.addEventListener("keydown", (event) => {

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {

        event.preventDefault();

        const search = document.getElementById("globalSearch");

        if (search) {
            search.focus();
        }

    }

});


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