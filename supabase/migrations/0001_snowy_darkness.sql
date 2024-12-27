/*
  # Initial Schema Setup

  1. New Tables
    - clients
      - id (uuid, primary key)
      - name (text)
      - email (text)
      - company (text)
      - created_at (timestamptz)
      - user_id (uuid, foreign key)

    - services
      - id (uuid, primary key)
      - description (text)
      - rate (decimal)
      - created_at (timestamptz)
      - user_id (uuid, foreign key)

    - invoices
      - id (uuid, primary key)
      - client_id (uuid, foreign key)
      - date (timestamptz)
      - status (enum)
      - total (decimal)
      - created_at (timestamptz)
      - user_id (uuid, foreign key)

    - invoice_items
      - id (uuid, primary key)
      - invoice_id (uuid, foreign key)
      - service_id (uuid, foreign key)
      - quantity (integer)
      - rate (decimal)
      - total (decimal)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'paid', 'overdue');

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(email, user_id)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  rate decimal(10,2) NOT NULL CHECK (rate >= 0),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  date timestamptz DEFAULT now(),
  status invoice_status DEFAULT 'draft',
  total decimal(10,2) DEFAULT 0 CHECK (total >= 0),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  rate decimal(10,2) NOT NULL CHECK (rate >= 0),
  total decimal(10,2) GENERATED ALWAYS AS (quantity * rate) STORED,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own clients"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
  ON clients FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own services"
  ON services FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services"
  ON services FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services"
  ON services FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON invoices FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view invoice items through invoices"
  ON invoice_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert invoice items through invoices"
  ON invoice_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

-- Create function to update invoice totals
CREATE OR REPLACE FUNCTION update_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices
  SET total = (
    SELECT COALESCE(SUM(total), 0)
    FROM invoice_items
    WHERE invoice_id = NEW.invoice_id
  )
  WHERE id = NEW.invoice_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoice total updates
CREATE TRIGGER update_invoice_total
AFTER INSERT OR UPDATE OR DELETE ON invoice_items
FOR EACH ROW
EXECUTE FUNCTION update_invoice_total();