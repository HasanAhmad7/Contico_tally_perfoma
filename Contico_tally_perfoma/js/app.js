document.getElementById('generatePreview').addEventListener('click', function() {
    const selectedCompany = document.getElementById('companySelect').value;

    const companies = {
        companyA: { name: "Company A", address: "123 Street, City A", logo: "logoA.png" },
        companyB: { name: "Company B", address: "456 Avenue, City B", logo: "logoB.png" },
        companyC: { name: "Company C", address: "789 Road, City C", logo: "logoC.png" }
    };

    const clientName = document.getElementById('clientName').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const clientGSTIN = document.getElementById('clientGSTIN').value;
    const invoiceDate = document.getElementById('invoiceDate').value;

    let items = [];
    document.querySelectorAll('#items .item').forEach(item => {
        const description = item.querySelector('input[name="itemDesc"]').value;
        const quantity = item.querySelector('input[name="itemQty"]').value;
        const unitPrice = item.querySelector('input[name="itemPrice"]').value;
        items.push({ description, quantity, unitPrice });
    });

    let total = 0;
    items.forEach(item => total += item.quantity * item.unitPrice);

    // Create A4 preview content
    const previewContent = `
        <div class="invoice-header text-center">
            <img src="${companies[selectedCompany].logo}" alt="${companies[selectedCompany].name} Logo" style="max-width: 100px;">
            <h3>${companies[selectedCompany].name}</h3>
            <p>${companies[selectedCompany].address}</p>
        </div>
        <hr>
        <p><strong>Client Name:</strong> ${clientName}</p>
        <p><strong>Client Address:</strong> ${clientAddress}</p>
        <p><strong>Client GSTIN/UIN:</strong> ${clientGSTIN}</p>
        <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
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
                ${items.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>${item.unitPrice}</td>
                        <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                `).join('')}
                <tr>
                    <td colspan="3"><strong>Total</strong></td>
                    <td><strong>${total.toFixed(2)}</strong></td>
                </tr>
            </tbody>
        </table>
    `;

    // Insert the content into the A4 preview div
    document.getElementById('a4-preview').innerHTML = previewContent;

    // Show the modal
    $('#pdfPreviewModal').modal('show');
});

document.getElementById('downloadPdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    // Get the content from the A4 preview div
    const content = document.getElementById('a4-preview').innerHTML;

    // Add the HTML content to the PDF
    doc.html(content, {
        callback: function(doc) {
            doc.save('proforma_invoice.pdf');
        },
        x: 10,
        y: 10,
        width: 190 // A4 page width in mm (210mm with 10mm margins)
    });
});
