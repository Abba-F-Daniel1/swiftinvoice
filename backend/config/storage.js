const supabase = require('./supabase');

const uploadLogo = async (file) => {
  try {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('logos')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
};

module.exports = {
  uploadLogo
}; 