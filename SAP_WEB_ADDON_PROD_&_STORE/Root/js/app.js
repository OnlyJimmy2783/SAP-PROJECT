/* =========================================
   ERP COMMON APP.JS
   Used by all Production Pages
========================================= */

/*********************************
 * AUTHENTICATION & ACCESS CONTROL
 *********************************/

// Login
function login() {
    const user = document.getElementById("username")?.value;
    const pass = document.getElementById("password")?.value;

    const users = JSON.parse(localStorage.getItem("users")) || [
        { u: "admin", p: "1234" },
        { u: "jimit", p: "060804" }
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

// Register
function registerUser() {
    const u = document.getElementById("newUsername")?.value;
    const p = document.getElementById("newPassword")?.value;

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

    users.push({ u, p });
    localStorage.setItem("users", JSON.stringify(users));

    alert(`User ${u} registered successfully!`);

    document.getElementById("newUsername").value = "";
    document.getElementById("newPassword").value = "";
}

// Logout (single source of truth)
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

    if (!sidebar) return;

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

    if (!menu) return;

    if (sidebar?.classList.contains("collapsed")) {
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
 * TABLE UTILITIES
 *********************************/

function updateSerialNumbers() {
    const rows = document.querySelectorAll("table tr");
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].cells[0]) {
            rows[i].cells[0].innerText = i;
        }
    }
}

function removeRow(btn) {
    const row = btn.closest("tr");
    const table = row?.closest("table");

    if (table && table.rows.length > 2) {
        row.remove();
        updateSerialNumbers();
    } else {
        alert("At least one row is required.");
    }
}

/*********************************
 * MODULE-SPECIFIC LOGIC
 *********************************/

// Receipt from Production
function addReceiptRow() {
    const table = document.querySelector("table");
    if (!table) return;

    const rowCount = table.rows.length;
    const row = table.insertRow(-1);

    row.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" placeholder="Item Code"></td>
        <td><input type="text" placeholder="Finished Good Name"></td>
        <td><input type="number" placeholder="0"></td>
        <td><input type="text" placeholder="Batch No."></td>
        <td>
            <button onclick="removeRow(this)">X</button>
        </td>`;
}

// Barcode Management
function addBarcodeRow() {
    const table = document.querySelector("table");
    if (!table) return;

    const rowCount = table.rows.length;
    const row = table.insertRow(-1);

    row.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" placeholder="Item Code"></td>
        <td><input type="text" placeholder="Barcode"></td>
        <td>
            <select>
                <option>Pcs</option>
                <option>Meters</option>
                <option>Kgs</option>
                <option>Box</option>
            </select>
        </td>
        <td><input type="text" placeholder="Description"></td>
        <td>
            <button onclick="removeRow(this)">X</button>
        </td>`;
}

// Export Table
function exportTableToExcel() {
    const table = document.querySelector("table");
    if (!table) return;

    let csv = [...table.rows].map(row =>
        [...row.cells].map(cell =>
            `"${(cell.querySelector("input")?.value || cell.innerText).replace(/"/g, '""')}"`
        ).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ERP_Report.csv";
    a.click();
}

/*********************************
 * INITIALIZATION
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (!path.includes("login") && !path.includes("register") && !isLoggedIn) {
        window.location.href = "login.html";
    }

    const userDisplay = document.getElementById("userDisplay");
    if (userDisplay) {
        userDisplay.innerText = "User: " + (localStorage.getItem("currentUser") || "Admin");
    }

    const addBtn = document.querySelector(".btn-add");
    const saveBtn = document.querySelector(".btn-save");

    if (path.includes("receipt-prod")) {
        if (addBtn) addBtn.onclick = addReceiptRow;
        if (saveBtn) saveBtn.onclick = () => alert("Receipt posted successfully!");
    }
    else if (path.includes("barcode")) {
        if (addBtn) addBtn.onclick = addBarcodeRow;
        if (saveBtn) saveBtn.onclick = () => alert("Barcodes saved successfully!");
    }
    else if (path.includes("report")) {
        if (addBtn) addBtn.onclick = exportTableToExcel;
        if (saveBtn) saveBtn.onclick = () => alert("Report generated!");
    }
});


//More details section for multiple selection

function handleDetailsChange(row) {
  const container = document.getElementById("details" + row);
  const select = event.target;
  container.innerHTML = "";

  Array.from(select.selectedOptions).forEach(option => {
    if (option.value === "uom") {
      container.innerHTML += `
        <div>
          <label>UOM</label>
          <input type="text" value="PCS" style="width:100%; padding:6px;">
        </div>`;
    }

    if (option.value === "price") {
      container.innerHTML += `
        <div>
          <label>Unit Price</label>
          <input type="number" id="price${row}" value="0"
                 oninput="calculateTotal(${row})"
                 style="width:100%; padding:6px;">
        </div>`;
    }

    if (option.value === "total") {
      container.innerHTML += `
        <div>
          <label>Total</label>
          <input type="number" id="total${row}" readonly
                 style="width:100%; padding:6px; background:#f9f9f9;">
        </div>`;
    }

    if (option.value === "batch") {
      container.innerHTML += `
        <div>
          <label>Batch No</label>
          <input type="text" style="width:100%; padding:6px;">
        </div>`;
    }

    if (option.value === "bin") {
      container.innerHTML += `
        <div>
          <label>Bin Location</label>
          <input type="text" style="width:100%; padding:6px;">
        </div>`;
    }
  });
}

function calculateTotal(row) {
  const qty = document.getElementById("qty" + row)?.value || 0;
  const price = document.getElementById("price" + row)?.value || 0;
  const totalField = document.getElementById("total" + row);

  if (totalField) {
    totalField.value = qty * price;
  }
}

// popup menu for BOM chooser

function openBomChooser() {
    document.getElementById("bomModal").style.display = "block";
}

function closeBomChooser() {
    document.getElementById("bomModal").style.display = "none";
}

function selectBom(bomNo) {
    document.getElementById("productionNo").value = bomNo;
    closeBomChooser();
}


