const supabase = require('../config/supabase');

async function createService(req, res) {
  const { description, rate, user_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('services')
      .insert([{ description, rate, user_id }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error inserting service:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createService };