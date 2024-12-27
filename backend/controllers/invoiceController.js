const supabase = require('../config/supabase');
const { generateInvoicePDF } = require('../services/pdfService');

async function createInvoice(req, res) {
  const { client_id, items, user_id } = req.body;
  const logo = req.file;

  try {
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{ client_id, user_id, status: 'draft' }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    const invoiceItems = JSON.parse(items);
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(
        invoiceItems.map(item => ({
          invoice_id: invoice.id,
          service_id: item.service_id,
          quantity: item.quantity,
          rate: item.rate
        }))
      );

    if (itemsError) throw itemsError;

    const { data: fullInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        items:invoice_items(
          *,
          service:services(*)
        )
      `)
      .eq('id', invoice.id)
      .single();

    if (fetchError) throw fetchError;

    const pdfPath = await generateInvoicePDF(fullInvoice, logo?.path);
    res.download(pdfPath);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createInvoice };