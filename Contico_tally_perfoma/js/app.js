document.getElementById('generatePreview').addEventListener('click', function() {
    // Get the values from the form
    const clientName = document.getElementById('clientName').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    
    // Get the items
    let items = [];
    document.querySelectorAll('#items .item').forEach(item => {
        const description = item.querySelector('input[name="itemDesc"]').value;
        const quantity = item.querySelector('input[name="itemQty"]').value;
        const unitPrice = item.querySelector('input[name="itemPrice"]').value;
        items.push({ description, quantity, unitPrice });
    });

    // Calculate total price
    let total = 0;
    items.forEach(item => {
        total += item.quantity * item.unitPrice;
    });

    // Inject the values into the preview section
    const preview = document.getElementById('invoicePreview');
    preview.innerHTML = `
        <h3>Invoice Preview</h3>
        <p><strong>Client Name:</strong> ${clientName}</p>
        <p><strong>Client Address:</strong> ${clientAddress}</p>
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

    // Show the preview section and enable the download button
    preview.style.display = 'block';
    document.getElementById('downloadPdf').style.display = 'inline-block';
});

document.getElementById('downloadPdf').addEventListener('click', function() {
    const doc = new jsPDF();

    // Capture the content of the preview section
    const content = document.getElementById('invoicePreview').innerHTML;

    // Convert the content to PDF
    doc.fromHTML(content, 15, 15, {
        'width': 170
    });

    // Save the PDF
    doc.save('proforma_invoice.pdf');
});
