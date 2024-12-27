const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabase');
const { generateInvoicePDF } = require('../utils/pdf-generator');
const fs = require('fs-extra');
const path = require('path');

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// GET /invoices - Fetch all invoices
router.get('/invoices', async (req, res) => {
  try {
    console.log('Fetching invoices...');
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        items:invoice_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log(`Invoices fetched successfully: ${invoices.length} records`);
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /invoices - Create new invoice
router.post('/invoices', upload.single('logo'), async (req, res) => {
  try {
    const { client_id, items } = req.body;
    let logo_url = null;

    // Upload logo if provided
    if (req.file) {
      try {
        logo_url = await uploadLogo(req.file);
      } catch (uploadError) {
        console.error('Logo upload failed:', uploadError);
        // Continue without logo if upload fails
      }
    }

    // Create invoice with logo_url
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        client_id,
        logo_url,
        status: 'draft'
      }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Parse items if needed
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

    // Create invoice items
    for (const item of parsedItems) {
      const { error: itemError } = await supabase
        .from('invoice_items')
        .insert([{
          invoice_id: invoice.id,
          service_name: item.service_name,
          description: item.description,
          quantity: parseInt(item.quantity),
          rate: parseFloat(item.rate)
        }]);

      if (itemError) throw itemError;
    }

    // Fetch complete invoice data for PDF
    const { data: completeInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        items:invoice_items(*)
      `)
      .eq('id', invoice.id)
      .single();

    if (fetchError) throw fetchError;

    // Generate PDF
    const pdfPath = await generateInvoicePDF(completeInvoice);

    // Send the PDF file
    res.download(pdfPath, `invoice-${invoice.id}.pdf`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Clean up the file
      fs.unlink(pdfPath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all clients
router.get('/clients', async (req, res) => {
  try {
    console.log('Fetching clients...');

    // Test Supabase connection first
    const { data: testData, error: testError } = await supabase
      .from('clients')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      console.error('Supabase connection test failed:', testError);
      throw new Error('Database connection failed');
    }

    // Fetch actual data
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }

    if (!data) {
      console.log('No clients found, returning empty array');
      return res.json([]);
    }

    console.log(`Successfully fetched ${data.length} clients`);
    res.json(data);

  } catch (error) {
    console.error('Error in GET /clients:', error);
    res.status(500).json({
      message: 'Failed to fetch clients',
      error: error.message,
      details: error.details || 'No additional details'
    });
  }
});

// Create a new client
router.post('/clients', async (req, res) => {
  try {
    console.log('Creating client with data:', req.body);
    const { name, email, company } = req.body;

    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name,
        email,
        company
      }])
      .select()
      .single();

    if (error) {
      console.error('Client creation error:', error);
      throw error;
    }

    console.log('Client created successfully:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error in POST /clients:', error);
    res.status(500).json({
      error: error.message,
      details: error.details || 'No additional details'
    });
  }
});

// GET /invoices/:id/download - Download invoice PDF
router.get('/invoices/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch invoice data with related data
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        items:invoice_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Ensure we have all required data
    if (!invoice.client || !invoice.items) {
      console.error('Missing required invoice data:', invoice);
      return res.status(400).json({ error: 'Invalid invoice data' });
    }

    // Generate PDF
    try {
      const pdfPath = await generateInvoicePDF(invoice);

      // Check if file exists
      if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file not generated');
      }

      // Send file and handle cleanup
      res.download(pdfPath, `invoice-${id}.pdf`, (err) => {
        // Always try to delete the temp file
        fs.unlink(pdfPath).catch(unlinkErr => {
          console.error('Error cleaning up PDF file:', unlinkErr);
        });

        if (err) {
          console.error('Error sending file:', err);
          // Only send error if we haven't sent a response yet
          if (!res.headersSent) {
            res.status(500).json({ error: 'Error sending file' });
          }
        }
      });
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      throw new Error('Failed to generate PDF');
    }

  } catch (error) {
    console.error('Error in download route:', error);
    // Only send error if we haven't sent a response yet
    if (!res.headersSent) {
      res.status(500).json({
        error: error.message,
        details: error.details || 'No additional details'
      });
    }
  }
});

// Update client
router.put('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, company } = req.body;

    const { data, error } = await supabase
      .from('clients')
      .update({ name, email, company })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete client
router.delete('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First check if client has any invoices
    const { data: invoices, error: invoiceError } = await supabase
      .from('invoices')
      .select('id')
      .eq('client_id', id);

    if (invoiceError) throw invoiceError;

    if (invoices && invoices.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete client with existing invoices. Please delete associated invoices first.'
      });
    }

    // If no invoices exist, proceed with deletion
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update invoice status
router.patch('/invoices/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['draft', 'sent', 'paid', 'overdue'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete invoice
router.delete('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First delete related invoice items
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);

    if (itemsError) throw itemsError;

    // Then delete the invoice
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;