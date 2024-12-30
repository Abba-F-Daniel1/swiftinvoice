const { createClient } = require('@supabase/supabase-js');
const supabase = require('./supabase');

async function uploadLogo(file) {
  try {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `logos/${fileName}`;

    const { data, error } = await supabase.storage
      .from('invoices')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('invoices')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    throw error;
  }
}

module.exports = { uploadLogo };