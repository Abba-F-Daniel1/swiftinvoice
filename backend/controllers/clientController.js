const supabase = require('../config/supabase');
const { logActivity } = require('../routes/activities');

async function createClient(req, res) {
  const { name, email, company, user_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([{ name, email, company, user_id }])
      .select()
      .single();

    if (error) throw error;

    // Log the activity
    logActivity(user_id, 'create', `Created client: ${name}`, 'client', data.id);

    res.json(data);
  } catch (error) {
    console.error('Error inserting client:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createClient };