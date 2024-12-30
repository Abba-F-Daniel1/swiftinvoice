const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabase');
const pdfService = require('../services/pdfService');
const fs = require('fs-extra');
const path = require('path');

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Invoice Routes
router.post('/invoices', upload.single('logo'), async (req, res) => {
  try {
    const { client_id, items } = req.body;
    let logo_url = null;

    if (req.file) {
      try {
        const { uploadLogo } = require('../config/storage');
        logo_url = await uploadLogo(req.file);
      } catch (uploadError) {
        console.error('Logo upload failed:', uploadError);
      }
    }

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{ client_id, logo_url, status: 'draft' }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

    for (const item of parsedItems) {
      const { error: itemError } = await supabase
        .from('invoice_items')
        .insert([{
          invoice_id: invoice.id,
          service_name: item.service_name,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate
        }]);

      if (itemError) throw itemError;
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`*, client:clients(*), items:invoice_items(*)`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/invoices/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        items:invoice_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const pdfPath = await pdfService.generateInvoicePDF(invoice);
    
    res.download(pdfPath, `invoice-${id}.pdf`, (err) => {
      pdfService.cleanup(path.dirname(pdfPath));
      if (err && !res.headersSent) {
        res.status(500).json({ error: 'Error sending file' });
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.patch('/invoices/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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
    res.status(500).json({ error: error.message });
  }
});

router.delete('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);

    if (itemsError) throw itemsError;

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Client Routes
router.get('/clients', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/clients', async (req, res) => {
  try {
    const { name, email, company } = req.body;

    const { data, error } = await supabase
      .from('clients')
      .insert([{ name, email, company }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
    res.status(500).json({ error: error.message });
  }
});

router.delete('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: invoices, error: invoiceError } = await supabase
      .from('invoices')
      .select('id')
      .eq('client_id', id);

    if (invoiceError) throw invoiceError;

    if (invoices?.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete client with existing invoices'
      });
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;