// Global Definitions
const companies = {
    companyA: {
      name: "Company A",
      address: "123 Street, City A",
      logo: "logoA.png",
    },
    companyB: {
      name: "Company B",
      address: "456 Avenue, City B",
      logo: "logoB.png",
    },
    companyC: {
      name: "Company C",
      address: "789 Road, City C",
      logo: "logoC.png",
    },
  };
  
  const companyPerfomaId = { companyA: 1, companyB: 1, companyC: 1 };
  let items = [];
  let total = 0;
  let performaId = null;
  let selectedCompany = null;
  let companyPrefix = null;
  
  // Initialize Date on DOM Load
  document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0]; // Format: yyyy-mm-dd
    document.getElementById("invoiceDate").value = today;
  });
  
  // Functions
  function calculateTotal(items) {
    return items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    ).toFixed(2);
  }
  
  function generateProformaId(selectedCompany) {
    const paddedId = companyPerfomaId[selectedCompany].toString().padStart(3, "0");
    companyPrefix =
      selectedCompany === "companyA"
        ? "CA2425"
        : selectedCompany === "companyB"
        ? "CB2425"
        : "CC2425";
  
    return companyPrefix + paddedId;
  }
  
  function createPreviewContent(clientInfo, invoiceDate, performaId, items, total) {
    return `
      <div class="invoice-header text-center">
        <img src="${companies[selectedCompany].logo}" alt="${companies[selectedCompany].name} Logo" style="max-width: 100px;">
        <h3>${companies[selectedCompany].name}</h3>
        <p>${companies[selectedCompany].address}</p>
      </div>
      <hr>
      <div class="invoiceInfo">
        <div class="infoDiv1">
          <p><strong>Client Name:</strong> ${clientInfo.name}</p>
          <label><strong>Client Address:</strong></label>
          <p>${clientInfo.address}</p>
          <p><strong>Client GSTIN/UIN:</strong> ${clientInfo.gstin}</p>
        </div>
        <div class="infoDiv2">
          <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
          <p><strong>Proforma ID:</strong> ${performaId}</p>
        </div>
      </div>
      <h4>Items</h4>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unitPrice}</td>
                  <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>`
            )
            .join("")}
          <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td><strong>${total}</strong></td>
          </tr>
        </tbody>
      </table>`;
  }
  
  // Generate Preview
  document.getElementById("generatePreview").addEventListener("click", () => {
    selectedCompany = document.getElementById("companySelect").value;
    
    const clientInfo = {
      name: document.getElementById("clientName").value,
      address: document.getElementById("clientAddress").value,
      gstin: document.getElementById("clientGSTIN").value,
    };
    const invoiceDate = document.getElementById("invoiceDate").value;
  
    // Gather item details
    items = Array.from(document.querySelectorAll("#items .item")).map((item) => ({
      description: item.querySelector('input[name="itemDesc"]').value,
      quantity: parseInt(item.querySelector('input[name="itemQty"]').value),
      unitPrice: parseFloat(item.querySelector('input[name="itemPrice"]').value),
    }));
  
    total = calculateTotal(items);
    performaId = generateProformaId(selectedCompany);
  
    const previewContent = createPreviewContent(clientInfo, invoiceDate, performaId, items, total);
    document.getElementById("a4-preview").innerHTML = previewContent;
  
    $("#pdfPreviewModal").modal("show");
  });
  
  // Download PDF and Increment Proforma ID after successful print
  document.getElementById("downloadPdf").addEventListener("click", () => {
    window.print();
    setTimeout(() => {
      if (confirm("Did the invoice print successfully?")) {
        companyPerfomaId[selectedCompany] += 1;
      } else {
        console.log("Print failed. Proforma ID not incremented.");
      }
    }, 2000);
  });
  