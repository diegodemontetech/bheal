-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS boneheal_events CASCADE;
DROP TABLE IF EXISTS boneheal_leads CASCADE;
DROP TABLE IF EXISTS boneheal_users CASCADE;

-- Create users table
CREATE TABLE boneheal_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'user', 'manager')),
  pipelines TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Create leads table
CREATE TABLE boneheal_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  dentist_name TEXT NOT NULL,
  clinic_name TEXT,
  cnpj TEXT,
  cpf TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  socioeconomic_class TEXT,
  demographic_density INTEGER,
  consumption_potential DECIMAL,
  website TEXT,
  specialty TEXT,
  purchase_history TEXT,
  purchase_frequency TEXT,
  purchase_volume DECIMAL,
  last_purchase_date DATE,
  average_order_value DECIMAL,
  bone_barriers_type TEXT,
  preferred_brands TEXT,
  needs_samples BOOLEAN DEFAULT FALSE,
  other_interests TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  preferred_communication TEXT,
  conversation_notes TEXT,
  feedback TEXT,
  opportunity_status TEXT,
  next_steps TEXT,
  expected_close_date DATE,
  potential_value DECIMAL,
  competitors TEXT,
  payment_terms TEXT,
  credit_limit DECIMAL,
  payment_history TEXT,
  delivery_address TEXT,
  delivery_preferences TEXT,
  special_instructions TEXT,
  contracts TEXT,
  quotes TEXT,
  responsible_id UUID REFERENCES boneheal_users(id),
  support_team TEXT,
  team_interactions TEXT,
  pipeline TEXT NOT NULL,
  status TEXT NOT NULL,
  lead_source TEXT
);

-- Create events table
CREATE TABLE boneheal_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT NOT NULL,
  contact TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES boneheal_users(id)
);

-- Enable RLS
ALTER TABLE boneheal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boneheal_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE boneheal_events ENABLE ROW LEVEL SECURITY;

-- Create basic policies for users table
CREATE POLICY "Users can view all users"
  ON boneheal_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON boneheal_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for leads table based on user role
CREATE POLICY "Users can view leads based on role"
  ON boneheal_leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boneheal_users
      WHERE id = auth.uid()::uuid
      AND (
        role = 'admin'
        OR role = 'manager'
        OR (role = 'user' AND responsible_id = auth.uid()::uuid)
      )
    )
  );

CREATE POLICY "Users can insert leads"
  ON boneheal_leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update leads based on role"
  ON boneheal_leads
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boneheal_users
      WHERE id = auth.uid()::uuid
      AND (
        role = 'admin'
        OR role = 'manager'
        OR (role = 'user' AND responsible_id = auth.uid()::uuid)
      )
    )
  );

CREATE POLICY "Users can delete leads based on role"
  ON boneheal_leads
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boneheal_users
      WHERE id = auth.uid()::uuid
      AND (role = 'admin' OR role = 'manager')
    )
  );

-- Create policies for events table
CREATE POLICY "Users can view all events"
  ON boneheal_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own events"
  ON boneheal_events
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid()::uuid)
  WITH CHECK (user_id = auth.uid()::uuid);

-- Create indexes for better performance
CREATE INDEX boneheal_leads_responsible_id_idx ON boneheal_leads(responsible_id);
CREATE INDEX boneheal_leads_pipeline_status_idx ON boneheal_leads(pipeline, status);
CREATE INDEX boneheal_events_user_id_idx ON boneheal_events(user_id);
CREATE INDEX boneheal_events_date_idx ON boneheal_events(date);