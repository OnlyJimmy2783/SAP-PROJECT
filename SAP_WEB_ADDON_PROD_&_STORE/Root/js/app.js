/*********************************
 * AUTHENTICATION & ACCESS CONTROL
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
    const mainContent = document.querySelector(".main");

    sidebar.classList.toggle("collapsed");

    if (sidebar.classList.contains("collapsed")) {
        sidebar.style.width = "60px";
        if(mainContent) mainContent.style.marginLeft = "60px";
        btn.innerHTML = "▶";
        closeAllSubMenus();
    } else {
        sidebar.style.width = "250px";
        if(mainContent) mainContent.style.marginLeft = "250px";
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
 * TABLE UTILITIES (ADD/REMOVE)
 *********************************/

function updateSerialNumbers() {
    const rows = document.querySelectorAll("table tr");
    // Start from index 1 to skip header
    for (let i = 1; i < rows.length; i++) {
        if(rows[i].cells[0]) rows[i].cells[0].innerText = i;
    }
}

function removeRow(btn) {
    const row = btn.closest('tr');
    const table = row.closest('table');
    if (table.rows.length > 2) { 
        row.remove();
        updateSerialNumbers();
    } else {
        alert("At least one row is required.");
    }
}

/*********************************
 * MODULE SPECIFIC LOGIC
 *********************************/

// 1. Receipt from Production
function addReceiptRow() {
    const table = document.querySelector("table");
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
        </td>`;
}

// 2. Barcode Management
function addBarcodeRow() {
    const table = document.querySelector("table");
    const rowCount = table.rows.length;
    const row = table.insertRow(-1);
    row.style.borderBottom = "1px solid #eee";
    row.innerHTML = `
        <td style="padding: 12px;">${rowCount}</td>
        <td style="padding: 12px;"><input type="text" placeholder="Item Code" style="width: 90%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></td>
        <td style="padding: 12px;"><input type="text" placeholder="Barcode" style="width: 90%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></td>
        <td style="padding: 12px;">
            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100%;">
                <option>Pcs</option><option>Meters</option><option>Kgs</option><option>Box</option>
            </select>
        </td>
        <td style="padding: 12px;"><input type="text" placeholder="Description" style="width: 90%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></td>
        <td style="padding: 12px; text-align: center;">
            <button onclick="removeRow(this)" style="background: #d9534f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">X</button>
        </td>`;
}

// 3. Export Logic
function exportTableToExcel() {
    const table = document.querySelector("table");
    if (!table) return;
    let rows = Array.from(table.rows);
    let csvContent = rows.map(row => {
        const cols = Array.from(row.cells);
        return cols.map(c => {
            let val = c.querySelector('input') ? c.querySelector('input').value : c.innerText;
            return `"${val.replace(/\n/g, ' ')}"`;
        }).join(",");
    }).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ERP_Report.csv';
    a.click();
}

/*********************************
 * INITIALIZATION
 *********************************/

document.addEventListener("DOMContentLoaded", function () {
    // 1. Protection & User Display
    const path = window.location.pathname;
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const publicPages = ["login.html", "register.html"];
    const isPublic = publicPages.some(page => path.includes(page));

    if (!isPublic && !isLoggedIn) {
        window.location.href = "login.html";
    }

    const userDisplay = document.getElementById("userDisplay");
    if (userDisplay) {
        userDisplay.innerText = "User: " + (localStorage.getItem("currentUser") || "Admin");
    }

    // 2. Dynamic Button Routing
    const addBtn = document.querySelector('.btn-add');
    const saveBtn = document.querySelector('.btn-save');

    if (path.includes('receipt-prod')) {
        if (addBtn) addBtn.onclick = addReceiptRow;
        if (saveBtn) saveBtn.onclick = () => alert("Receipt posted successfully!");
    } 
    else if (path.includes('barcode')) {
        if (addBtn) addBtn.onclick = addBarcodeRow;
        if (saveBtn) saveBtn.onclick = () => alert("Barcodes saved successfully!");
        
        // Target the "Generate Barcode" button specifically
        const genBtn = document.querySelector('.btn-save[style*="width: 150px"]');
        if(genBtn) genBtn.onclick = () => alert("Barcode layout generated!");
    }
    else if (path.includes('report')) {
        if (addBtn) addBtn.onclick = exportTableToExcel;
        if (saveBtn) saveBtn.onclick = () => alert("Report generated!");
    }
});