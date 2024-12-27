const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateInvoicePDF(invoice, logoPath) {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../invoices/invoice_${invoice.id}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  if (logoPath) {
    doc.image(logoPath, 50, 45, { width: 50 }).moveDown();
  }

  // Invoice header
  doc.fontSize(20).text('INVOICE', 110, 57).moveDown();
  doc
    .fontSize(10)
    .text(`Invoice Number: ${invoice.id}`, 200, 65, { align: 'right' })
    .text(`Date: ${invoice.date}`, 200, 80, { align: 'right' })
    .moveDown();

  // Client details
  doc
    .text('Bill To:', 50, 125)
    .text(invoice.client.name, 50, 140)
    .text(invoice.client.company, 50, 155)
    .text(invoice.client.email, 50, 170)
    .moveDown();

  // Items table
  const tableTop = 200;
  doc
    .text('Description', 50, tableTop)
    .text('Rate', 300, tableTop)
    .text('Quantity', 370, tableTop)
    .text('Total', 430, tableTop)
    .moveDown();

  invoice.items.forEach((item) => {
    const position = doc.y;
    doc
      .text(item.service.description, 50, position)
      .text(item.rate.toFixed(2), 300, position)
      .text(item.quantity.toString(), 370, position)
      .text(item.total.toFixed(2), 430, position)
      .moveDown();
  });

  doc.text(`Total: ${invoice.total.toFixed(2)}`, 430, doc.y).moveDown();
  doc.end();

  return filePath;
}

module.exports = { generateInvoicePDF };