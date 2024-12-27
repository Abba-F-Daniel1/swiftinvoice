require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase Configuration:', {
    url: supabaseUrl ? '[SET]' : '[MISSING]',
    key: supabaseKey ? '[SET]' : '[MISSING]'
  });
  throw new Error('Missing Supabase credentials in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Test the connection
supabase.from('clients').select('count', { count: 'exact' })
  .then(({ count, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection successful. Found', count, 'clients');
    }
  })
  .catch(err => {
    console.error('Failed to connect to Supabase:', err);
  });

module.exports = supabase;