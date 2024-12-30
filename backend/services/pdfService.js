const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const axios = require('axios');

// Config
const config = {
  pageOptions: { margin: 50, size: 'A4', bufferPages: true },
  colors: {
    primary: '#2563eb',
    secondary: '#475569',
    background: '#f8fafc',
    header: '#1e40af',
    tableRow: '#EBF3FF'
  },
  statusColors: {
    draft: { bg: '#fef2f2', text: '#991b1b' },
    sent: { bg: '#eff6ff', text: '#1e40af' },
    paid: { bg: '#f0fdf4', text: '#166534' }
  },
  layout: {
    headerHeight: 200,
    tableStartY: 350,
    footerPosition: 100
  }
};

// Helper Functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const validateInvoice = (invoice) => {
  if (!invoice?.id) throw new Error('Invalid invoice: missing ID');
  if (!invoice.items?.length) throw new Error('Invalid invoice: no items');
  if (!invoice.client?.name) throw new Error('Invalid invoice: missing client');
};

// PDF Generation Functions
const generateHeader = async (doc, invoice) => {
  doc.rect(0, 0, doc.page.width, config.layout.headerHeight)
    .fillColor(config.colors.header)
    .fill();

  if (invoice.logo_url) {
    try {
      const response = await axios.get(invoice.logo_url, {
        responseType: 'arraybuffer',
        timeout: 5000
      });
      doc.image(Buffer.from(response.data), 50, 40, { width: 120 });
    } catch (error) {
      console.warn('Logo loading failed:', error);
    }
  }

  const titleX = doc.page.width - 200;
  doc.fontSize(32)
    .fillColor('#ffffff')
    .text('INVOICE', titleX, 45, { align: 'right' });

  doc.fontSize(11)
    .text(`Invoice #: ${invoice.id}`, titleX, 90, { align: 'right' })
    .text(`Date: ${formatDate(invoice.created_at)}`, titleX, 160, { align: 'right' });
};

const generateClientInfo = (doc, invoice) => {
  const y = 220;
  doc.fontSize(14)
    .fillColor(config.colors.primary)
    .text('BILL TO', 70, y + 20)
    .fontSize(11)
    .fillColor(config.colors.secondary)
    .text(invoice.client.name, 70, y + 45)
    .text(invoice.client.email || '', 70, y + 65);
};

const generateTableHeader = (doc, y) => {
  doc.fillColor(config.colors.primary)
    .fontSize(11);

  const columns = [
    { text: 'Item', x: 70, w: 130 },
    { text: 'Description', x: 210, w: 130 },
    { text: 'Qty', x: 350, w: 60 },
    { text: 'Rate', x: 420, w: 70 },
    { text: 'Amount', x: 500, w: 80 }
  ];

  columns.forEach(col => {
    doc.text(col.text, col.x, y, { width: col.w });
  });
};

const generateTableRow = (doc, item, y, isEven) => {
  if (isEven) {
    doc.fillColor(config.colors.tableRow);
  }

  const amount = Number(item.quantity) * Number(item.rate);

  doc.fontSize(10)
    .fillColor(config.colors.secondary)
    .text(item.service_name || '', 70, y, { width: 130 })
    .text(item.description || '', 210, y, { width: 130 })
    .text(item.quantity?.toString() || '0', 350, y, { width: 60, align: 'left' })
    .text(formatCurrency(item.rate), 420, y, { width: 70, align: 'left' })
    .text(formatCurrency(amount), 500, y, { width: 80, align: 'left' });

  return amount;
};

const generateItemsTable = (doc, items) => {
  let y = config.layout.tableStartY;
  let totalAmount = 0;

  generateTableHeader(doc, y);
  y += 30;

  items.forEach((item, i) => {
    totalAmount += generateTableRow(doc, item, y, i % 2 === 0);
    y += 30;
  });

  return { yPos: y, totalAmount };
};

const generateTotals = (doc, y, totalAmount) => {
  const startX = doc.page.width - 250;
  doc.fontSize(14)
    .fillColor(config.colors.primary)
    .text('Total:', startX, y)
    .text(formatCurrency(totalAmount), startX + 100, y, { align: 'right' });
};

const generateFooter = (doc) => {
  const y = doc.page.height - config.layout.footerPosition;
  doc.fontSize(10)
    .fillColor(config.colors.secondary)
    .text('Thank you for your patronage!', 50, y, { align: 'center' });
};

const cleanup = async (directory) => {
  if (directory) {
    try {
      await fs.remove(directory);
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }
};

const generateInvoicePDF = async (invoice) => {
  let tempDir = null;
  let doc = null;

  try {
    validateInvoice(invoice);
    tempDir = path.join(os.tmpdir(), `invoice-${invoice.id}-${Date.now()}`);
    await fs.ensureDir(tempDir);
    const pdfPath = path.join(tempDir, `invoice-${invoice.id}.pdf`);

    doc = new PDFDocument(config.pageOptions);
    const stream = fs.createWriteStream(pdfPath);

    return new Promise(async (resolve, reject) => {
      stream.on('finish', () => resolve(pdfPath));
      stream.on('error', async err => {
        await cleanup(tempDir);
        reject(err);
      });

      doc.pipe(stream);

      await generateHeader(doc, invoice);
      generateClientInfo(doc, invoice);
      const { yPos, totalAmount } = generateItemsTable(doc, invoice.items);
      generateTotals(doc, yPos, totalAmount);
      generateFooter(doc);

      doc.end();
    });
  } catch (error) {
    if (doc) doc.end();
    await cleanup(tempDir);
    throw new Error(`PDF Generation failed: ${error.message}`);
  }
};

module.exports = {
  generateInvoicePDF,
  cleanup
};