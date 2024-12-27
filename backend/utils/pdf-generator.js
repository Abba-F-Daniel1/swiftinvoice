const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const https = require('https');

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

async function generateInvoicePDF(invoice) {
  const tempDir = path.join(os.tmpdir(), `invoice-${invoice.id}-${Date.now()}`);
  await fs.ensureDir(tempDir);
  const pdfPath = path.join(tempDir, `invoice-${invoice.id}.pdf`);

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // Add logo if exists
      if (invoice.logo_url) {
        try {
          const logoBuffer = await downloadImage(invoice.logo_url);
          doc.image(logoBuffer, 50, 50, { width: 90 });
        } catch (error) {
          console.error('Error adding logo:', error);
        }
      }

      // Header
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('INVOICE', 200, 50, { align: 'right' })
        .fontSize(10)
        .font('Helvetica')
        .text(`Invoice #: ${invoice.id}`, 450, 85, { align: 'right' })
        .text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, { align: 'right' })
        .moveDown();

      // Client Information
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Bill To:', 50, 150)
        .font('Helvetica')
        .fontSize(10)
        .text(invoice.client.name)
        .text(invoice.client.company || '')
        .text(invoice.client.email || '')
        .moveDown();

      // Items Table Header
      const tableTop = 250;
      const tableHeaders = {
        item: { x: 50, width: 200 },
        description: { x: 250, width: 140 },
        quantity: { x: 390, width: 50 },
        rate: { x: 440, width: 60 },
        amount: { x: 500, width: 80 }
      };

      // Draw table header
      doc
        .font('Helvetica-Bold')
        .fontSize(10);

      // Table header background
      doc
        .fillColor('#f3f4f6')
        .rect(50, tableTop - 5, 530, 20)
        .fill();

      // Table header text
      doc
        .fillColor('#000000')
        .text('Item', tableHeaders.item.x, tableTop)
        .text('Description', tableHeaders.description.x, tableTop)
        .text('Qty', tableHeaders.quantity.x, tableTop)
        .text('Rate', tableHeaders.rate.x, tableTop)
        .text('Amount', tableHeaders.amount.x, tableTop);

      // Table content
      let y = tableTop + 25;
      let total = 0;

      // Draw alternating row backgrounds
      invoice.items.forEach((item, index) => {
        if (index % 2 === 0) {
          doc
            .fillColor('#f8fafc')
            .rect(50, y - 5, 530, 20)
            .fill();
        }
      });

      // Add items
      doc.font('Helvetica').fillColor('#000000');
      invoice.items.forEach(item => {
        const amount = item.quantity * item.rate;
        total += amount;

        doc
          .fontSize(9)
          .text(item.service_name, tableHeaders.item.x, y, { width: tableHeaders.item.width })
          .text(item.description || '', tableHeaders.description.x, y, { width: tableHeaders.description.width })
          .text(item.quantity.toString(), tableHeaders.quantity.x, y, { width: tableHeaders.quantity.width })
          .text(formatCurrency(item.rate), tableHeaders.rate.x, y, { width: tableHeaders.rate.width })
          .text(formatCurrency(amount), tableHeaders.amount.x, y, { width: tableHeaders.amount.width });

        y += 20;
      });

      // Total section
      const totalY = y + 20;
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Subtotal:', 400, totalY)
        .text(formatCurrency(total), tableHeaders.amount.x, totalY)
        .text('Tax (0%):', 400, totalY + 20)
        .text(formatCurrency(0), tableHeaders.amount.x, totalY + 20)
        .fontSize(12)
        .text('Total:', 400, totalY + 45)
        .text(formatCurrency(total), tableHeaders.amount.x, totalY + 45);

      // Footer
      const footerY = y + 120;
      doc
        .font('Helvetica')
        .fontSize(9)
        .text('Payment Terms: Due within 30 days', 50, footerY)
        .text('Thank you for your business!', 50, footerY + 15, { color: '#666666' });

      // End the document
      doc.end();

      writeStream.on('finish', () => resolve(pdfPath));
      writeStream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF }; 