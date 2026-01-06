/*********************************
 * AUTHENTICATION & USER HANDLING
 *********************************/

// Login Function
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

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

    if (users.find(user => user.u === u)) {
        alert("Username already exists!");
        return;
    }

    users.push({ u: u, p: p });
    localStorage.setItem("users", JSON.stringify(users));

    alert("User " + u + " registered successfully!");
    
    // Clear fields if they exist
    if(document.getElementById("newUsername")) document.getElementById("newUsername").value = "";
    if(document.getElementById("newPassword")) document.getElementById("newPassword").value = "";
}

// Logout Function
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }
}

/*********************************
 * SIDEBAR & NAVIGATION
 *********************************/

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

function toggleSubMenu(menuId) {
    const menu = document.getElementById(menuId);
    const sidebar = document.getElementById("mySidebar");

    if (sidebar.classList.contains("collapsed")) {
        toggleSidebar();
    }

    const isOpen = menu.classList.contains("open");
    closeAllSubMenus();

    if (!isOpen) {
        menu.classList.add("open");
    }
}

function closeAllSubMenus() {
    document.querySelectorAll(".sub-module-list").forEach(m => {
        m.classList.remove("open");
    });
}

function navigate(page) {
    window.location.href = page;
}

/*********************************
 * PRODUCTION LOGIC (RECEIPT & REPORTS)
 *********************************/

// Add Row for Receipt from Production
function addReceiptRow() {
    const table = document.querySelector("table");
    if (!table) return;
    
    const rowCount = table.rows.length;
    const row = table.insertRow(-1);
    row.style.borderBottom = "1px solid #eee";

    row.innerHTML = `
        <td style="padding: 12px;">${rowCount}</td>
        <td style="padding: 12px;"><input type="text" placeholder="Item Code" style="width: 90%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></td>
        <td style="padding: 12px;"><input type="text" placeholder="Finished Good Name" style="width: 90%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></td>
        <td style="padding: 12px;"><input type="number" placeholder="0" style="width: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></td>
        <td style="padding: 12px;"><input type="text" placeholder="Batch No." style="width: 90%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></td>
        <td style="padding: 12px; text-align: center;">
            <button onclick="removeRow(this)" style="background: #d9534f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">X</button>
        </td>
    `;
}

// Remove Row Logic
function removeRow(btn) {
    const row = btn.parentNode.parentNode;
    const table = document.querySelector("table");
    if (table.rows.length > 2) { // Keep header + at least one data row
        row.parentNode.removeChild(row);
        updateSerialNumbers();
    } else {
        alert("At least one row is required.");
    }
}

function updateSerialNumbers() {
    const rows = document.querySelectorAll("table tr");
    for (let i = 1; i < rows.length; i++) {
        if(rows[i].cells[0]) rows[i].cells[0].innerText = i;
    }
}

// Export Table to Excel (CSV format)
function exportTableToExcel() {
    const table = document.querySelector("table");
    if (!table) return;

    let rows = Array.from(table.rows);
    let csvContent = rows.map(row => {
        const cols = Array.from(row.cells);
        return cols.map(c => `"${c.innerText.replace(/\n/g, ' ')}"`).join(",");
    }).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Production_Report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/*********************************
 * INITIALIZATION & PROTECTION
 *********************************/

document.addEventListener("DOMContentLoaded", function () {
    // 1. Display Current User
    const userDisplay = document.getElementById("userDisplay");
    if (userDisplay) {
        userDisplay.innerText = "User: " + (localStorage.getItem("currentUser") || "Admin");
    }

    // 2. Access Control
    const path = window.location.pathname;
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const publicPages = ["login.html", "register.html"];
    const isPublic = publicPages.some(page => path.includes(page));

    if (!isPublic && !isLoggedIn) {
        window.location.href = "login.html";
    }

    // 3. Receipt Page Events
    if (path.includes('receipt-prod')) {
        const addBtn = document.querySelector('.btn-add');
        const saveBtn = document.querySelector('.btn-save');

        if (addBtn) addBtn.onclick = addReceiptRow;
        if (saveBtn) {
            saveBtn.onclick = () => {
                alert("Receipt posted successfully! Inventory has been updated.");
            };
        }
    }

    // 4. Report Page Events
    if (path.includes('report')) {
        const generateBtn = document.querySelector('.btn-save');
        const exportBtn = document.querySelector('.btn-add');

        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                alert("Generating report results...");
            });
        }
        if (exportBtn) {
            exportBtn.addEventListener('click', exportTableToExcel);
        }
    }
});