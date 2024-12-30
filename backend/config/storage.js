const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function uploadLogo(file) {
  try {
    // Generate unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const filePath = `logos/${fileName}`;

    // Upload file using service role key
    const { data, error } = await supabase.storage
      .from('invoices')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('invoices')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
}

module.exports = { uploadLogo };