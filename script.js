let medicines = JSON.parse(localStorage.getItem("med")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let currentBill = [];
let editIndex = -1;

// INITIALIZATION: Populates 20 medicines if inventory is empty or less than 5 items
if (medicines.length < 5) {
    const sampleMeds = [
        { name: "Paracetamol 500mg", price: 15.50, qty: 200, mfg: "2024-01-10", exp: "2026-12-10" },
        { name: "Amoxicillin 250mg", price: 45.00, qty: 150, mfg: "2024-02-15", exp: "2025-08-15" },
        { name: "Ibuprofen 400mg", price: 22.00, qty: 180, mfg: "2024-03-01", exp: "2026-03-01" },
        { name: "Cetirizine 10mg", price: 12.00, qty: 300, mfg: "2024-01-20", exp: "2027-01-20" },
        { name: "Azithromycin 500mg", price: 75.00, qty: 90, mfg: "2024-04-12", exp: "2025-11-12" },
        { name: "Metformin 500mg", price: 35.00, qty: 250, mfg: "2023-11-05", exp: "2026-11-05" },
        { name: "Omeprazole 20mg", price: 55.00, qty: 120, mfg: "2024-05-20", exp: "2026-05-20" },
        { name: "Amlodipine 5mg", price: 28.00, qty: 140, mfg: "2024-02-28", exp: "2027-02-28" },
        { name: "Atorvastatin 10mg", price: 85.00, qty: 100, mfg: "2024-03-15", exp: "2026-03-15" },
        { name: "Pantoprazole 40mg", price: 65.00, qty: 110, mfg: "2024-01-15", exp: "2025-12-15" },
        { name: "Loratadine 10mg", price: 18.00, qty: 200, mfg: "2024-02-10", exp: "2027-02-10" },
        { name: "Ciprofloxacin 500mg", price: 52.00, qty: 85, mfg: "2024-04-05", exp: "2026-04-05" },
        { name: "Diclofenac Gel", price: 95.00, qty: 50, mfg: "2024-01-01", exp: "2025-12-31" },
        { name: "Vitamin C 500mg", price: 10.00, qty: 500, mfg: "2024-05-01", exp: "2027-05-01" },
        { name: "Multivitamin Syrup", price: 145.00, qty: 40, mfg: "2024-03-20", exp: "2025-09-20" },
        { name: "Salbutamol Inhaler", price: 180.00, qty: 30, mfg: "2024-02-15", exp: "2026-02-15" },
        { name: "Ranitidine 150mg", price: 20.00, qty: 160, mfg: "2024-01-10", exp: "2025-10-10" },
        { name: "Losartan 50mg", price: 42.00, qty: 130, mfg: "2024-03-12", exp: "2027-03-12" },
        { name: "Dexamethasone 0.5mg", price: 8.00, qty: 400, mfg: "2024-04-20", exp: "2026-04-20" },
        { name: "ORS Sachet", price: 6.00, qty: 600, mfg: "2024-05-15", exp: "2027-05-15" }
    ];
    medicines = sampleMeds;
    saveData();
}

function saveData() {
    localStorage.setItem("med", JSON.stringify(medicines));
    localStorage.setItem("sales", JSON.stringify(sales));
    updateDashboard();
}

function login() {
    if(document.getElementById("user").value === "admin" && document.getElementById("pass").value === "1234") {
        localStorage.setItem("isLogged", "true");
        location.reload();
    } else alert("Invalid Credentials");
}

function logout() {
    localStorage.removeItem("isLogged");
    location.reload();
}

if(localStorage.getItem("isLogged")) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("topHeader").style.display = "none"; 
    document.getElementById("app").style.display = "block";
    document.getElementById("appBg").style.display = "block"; 
    document.getElementById("heroBanner").style.display = "flex"; 
    document.getElementById("preNavBg").style.display = "block";
    document.getElementById("postNavBg").style.display = "block";
}

function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    if(id === 'inventory') renderInventory();
    if(id === 'billing') loadMedDropdown();
}

function updateDashboard() {
    // Total Medicines (count of unique items)
    document.getElementById("dMed").innerText = medicines.length;

    // Total Stock Units (sum of all quantities)
    const totalStock = medicines.reduce((acc, m) => acc + (Number(m.qty) || 0), 0);
    document.getElementById("dStock").innerText = totalStock;

    // Total Revenue (sum of all completed sales)
    let totalRev = sales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
    document.getElementById("dSales").innerText = "₹" + totalRev.toFixed(2);
}

function resetForm() {
    editIndex = -1;
    document.getElementById("mname").value = "";
    document.getElementById("mprice").value = "";
    document.getElementById("mqty").value = "";
    document.getElementById("mfg").value = "";
    document.getElementById("exp").value = "";
    document.getElementById("saveBtn").style.display = "inline-block";
    document.getElementById("updateBtn").style.display = "none";
    document.getElementById("formTitle").innerText = "Add Medicine";
}

function addMedicine() {
    let m = {
        name: document.getElementById("mname").value,
        price: +document.getElementById("mprice").value,
        qty: +document.getElementById("mqty").value,
        mfg: document.getElementById("mfg").value,
        exp: document.getElementById("exp").value
    };
    if(!m.name || !m.price) return alert("Fill all fields");
    medicines.push(m);
    saveData();
    showMsg("Medicine Added!");
    resetForm();
}

function editMedicine(i) {
    editIndex = i;
    let m = medicines[i];
    document.getElementById("mname").value = m.name;
    document.getElementById("mprice").value = m.price;
    document.getElementById("mqty").value = m.qty;
    document.getElementById("mfg").value = m.mfg;
    document.getElementById("exp").value = m.exp;
    document.getElementById("saveBtn").style.display = "none";
    document.getElementById("updateBtn").style.display = "inline-block";
    document.getElementById("formTitle").innerText = "Edit Medicine";
    showSection('addMed');
}

function updateMedicine() {
    medicines[editIndex] = {
        name: document.getElementById("mname").value,
        price: +document.getElementById("mprice").value,
        qty: +document.getElementById("mqty").value,
        mfg: document.getElementById("mfg").value,
        exp: document.getElementById("exp").value
    };
    saveData();
    showMsg("Medicine Updated!");
    resetForm();
}

function deleteMedicine(i) {
    if(confirm("Are you sure you want to delete this record?")) {
        medicines.splice(i, 1);
        saveData();
        renderInventory();
    }
}

function renderInventory(filter = "") {
    let html = "";
    medicines.forEach((m, i) => {
        if(m.name.toLowerCase().includes(filter.toLowerCase())) {
            html += `<tr><td><strong>${m.name}</strong></td><td>₹${m.price}</td><td>${m.qty}</td><td>${m.exp}</td>
            <td><button onclick="editMedicine(${i})" style="padding: 5px 15px; font-size: 12px;">Edit</button> <button class="btn-danger" onclick="deleteMedicine(${i})" style="padding: 5px 15px; font-size: 12px;">Delete</button></td></tr>`;
        }
    });
    document.getElementById("invBody").innerHTML = html;
}

function searchMedicine() {
    renderInventory(document.getElementById("searchBox").value);
}

function loadMedDropdown() {
    let sel = document.getElementById("medSelect");
    sel.innerHTML = `<option value="">Select Medicine</option>` + medicines.map((m, i) => `<option value="${i}">${m.name} (Stock: ${m.qty})</option>`).join("");
}

function fillMedPrice() {
    let idx = document.getElementById("medSelect").value;
    if(idx === "") return;
    let med = medicines[idx];
    document.getElementById("bprice").value = med.price;
    calculateLiveTotal();
}

function calculateLiveTotal() {
    let price = +document.getElementById("bprice").value || 0;
    let qty = +document.getElementById("bqty").value || 0;
    document.getElementById("btotal").value = price * qty;
}

function addToBill() {
    let idx = document.getElementById("medSelect").value;
    let qty = +document.getElementById("bqty").value;
    let price = +document.getElementById("bprice").value;
    let dosage = document.getElementById("dosage").value || "N/A";

    if(idx === "") return alert("Select medicine");
    let med = medicines[idx];

    if(qty > med.qty) return alert("Not enough stock available!");
    if(qty <= 0) return alert("Enter valid quantity");

    currentBill.push({
        id: idx,
        name: med.name,
        qty: qty,
        price: price,
        total: price * qty,
        dosage: dosage
    });

    renderBill();
    document.getElementById("bqty").value = "";
    document.getElementById("btotal").value = "";
    document.getElementById("dosage").value = "";
}

function renderBill() {
    let html = "";
    let subtotal = 0;
    currentBill.forEach((item, i) => {
        subtotal += item.total;
        html += `<tr><td>${item.name}</td><td>${item.dosage}</td><td>${item.qty}</td><td>₹${item.price}</td><td>₹${item.total}</td>
        <td><button class="btn-danger" onclick="removeBillItem(${i})" style="padding: 5px 10px;">X</button></td></tr>`;
    });
    document.getElementById("billBody").innerHTML = html;
    let gst = subtotal * 0.18;
    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("gst").innerText = gst.toFixed(2);
    document.getElementById("grand").innerText = (subtotal + gst).toFixed(2);
}

function removeBillItem(i) {
    currentBill.splice(i, 1);
    renderBill();
}

function clearBill() {
    currentBill = [];
    document.getElementById("cname").value = "";
    document.getElementById("cmobile").value = "";
    renderBill();
}

function checkout() {
    let cname = document.getElementById("cname").value;
    let cmobile = document.getElementById("cmobile").value;
    if(!cname || !cmobile) return alert("Please enter customer details");
    if(currentBill.length === 0) return alert("Your bill is empty!");

    let subtotal = currentBill.reduce((acc, item) => acc + item.total, 0);
    let gst = subtotal * 0.18;
    let grand = subtotal + gst;

    currentBill.forEach(item => {
        medicines[item.id].qty -= item.qty;
    });

    sales.push({
    date: new Date().toLocaleString(),
    customer: cname,
    mobile: cmobile,
    total: Number(grand), // Explicitly ensure this is a number
    items: [...currentBill]
});

    saveData();
    
    let rows = currentBill.map((item, idx) => `
        <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9f9f9'}">
            <td style="padding: 12px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${item.dosage}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${item.qty}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">₹${item.total.toFixed(2)}</td>
        </tr>`).join("");

    let billHTML = `<html><head><title>Invoice</title></head><body onload="window.print()" style="font-family:sans-serif; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #0b79d0; padding-bottom: 20px;">
            <h1 style="color:#0b79d0; margin:0;">INVOICE - MEDICAL STORE PRO</h1>
            <p style="margin:5px 0;">Official Sales Receipt</p>
        </div>
        <div style="margin: 20px 0;">
            <p><strong>Customer:</strong> ${cname}</p>
            <p><strong>Mobile:</strong> ${cmobile}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <table border="1" style="width:100%; border-collapse:collapse; margin-top:20px;">
            <thead><tr style="background:#0b79d0; color:white"><th>Item</th><th>Dosage</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
        <div style="text-align: right; margin-top: 30px;">
            <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
            <p>GST (18%): ₹${gst.toFixed(2)}</p>
            <h2 style="color:#0b79d0;">Grand Total: ₹${grand.toFixed(2)}</h2>
        </div>
    </body></html>`;
    
    let win = window.open("", "", "width=800,height=900");
    win.document.write(billHTML);
    win.document.close();

    clearBill();
    showMsg("Transaction Complete!");
}

function showMsg(m) {
    let t = document.getElementById("toast");
    t.innerText = m; t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
}

document.getElementById("dosage").addEventListener("input", function (e) {
    let v = e.target.value.replace(/[^0-9]/g, '');
    if (v.length > 3) v = v.slice(0, 3);
    let final = v.split('').join('-');
    e.target.value = final;
});

updateDashboard();
