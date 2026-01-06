/*********************************
 * AUTHENTICATION & USER HANDLING
 *********************************/

// Login Function
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    // Default admin + registered users
    const users = JSON.parse(localStorage.getItem("users")) || [
        { u: "admin", p: "1234" }
    ];

    const validUser = users.find(u => u.u === user && u.p === pass);

    if (validUser) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", user);
        window.location.href = "index.html";
    } else {
        alert("Invalid Credentials");
    }
}

// Register New User
function registerUser() {
    const u = document.getElementById("newUsername").value;
    const p = document.getElementById("newPassword").value;

    if (!u || !p) {
        alert("Please fill both fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [
        { u: "admin", p: "1234" }
    ];

    // Check if username exists
    if (users.find(user => user.u === u)) {
        alert("Username already exists!");
        return;
    }

    users.push({ u: u, p: p });
    localStorage.setItem("users", JSON.stringify(users));

    alert("User " + u + " registered successfully!");
    document.getElementById("newUsername").value = "";
    document.getElementById("newPassword").value = "";
}

// Page Protection + User Display
document.addEventListener("DOMContentLoaded", function () {

    // Show current user in top bar
    const userDisplay = document.getElementById("userDisplay");
    if (userDisplay) {
        userDisplay.innerText =
            "User: " + (localStorage.getItem("currentUser") || "Admin");
    }

    const path = window.location.pathname;
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    // Pages that require login
    const protectedPages = [
        "index.html",
        "packing-slip.html",
        "add-user.html",
        "warehouse.html",
        "success.html",
        "bom.html"
    ];

    const isProtected = protectedPages.some(page => path.includes(page));

    if (isProtected && !isLoggedIn) {
        window.location.href = "login.html";
    }
});


/*********************************
 * SIDEBAR & NAVIGATION
 *********************************/

// Open / Close Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    const btn = document.querySelector(".toggle-btn");

    sidebar.classList.toggle("collapsed");

    if (sidebar.classList.contains("collapsed")) {
        btn.innerHTML = "▶";
        closeAllSubMenus();
    } else {
        btn.innerHTML = "◀";
    }
}

// Open / Close Sub Menus
function toggleSubMenu(menuId) {
    const menu = document.getElementById(menuId);
    const sidebar = document.getElementById("mySidebar");

    // Expand sidebar first if collapsed
    if (sidebar.classList.contains("collapsed")) {
        toggleSidebar();
    }

    const isOpen = menu.classList.contains("open");

    closeAllSubMenus();

    if (!isOpen) {
        menu.classList.add("open");
    }
}

// Close all sub menus
function closeAllSubMenus() {
    document.querySelectorAll(".sub-module-list").forEach(m => {
        m.classList.remove("open");
    });
}

// Page Navigation
function navigate(page) {
    window.location.href = page;
}

// Logout
function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}
