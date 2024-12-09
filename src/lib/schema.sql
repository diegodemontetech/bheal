-- Reset schema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT CHECK (role IN ('admin', 'user', 'manager')),
    pipelines TEXT[] DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE leads (
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
    responsible_id UUID REFERENCES users(id),
    support_team TEXT,
    team_interactions TEXT,
    pipeline TEXT NOT NULL,
    status TEXT NOT NULL,
    lead_source TEXT
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    type TEXT NOT NULL,
    contact TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Allow users to view all users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to update their own profile"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid()::uuid);

-- Create policies for leads table
CREATE POLICY "Allow users to view leads based on role"
ON leads FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()::uuid
        AND (
            users.role = 'admin'
            OR users.role = 'manager'
            OR (users.role = 'user' AND leads.responsible_id = auth.uid()::uuid)
        )
    )
);

CREATE POLICY "Allow users to insert leads"
ON leads FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow users to update leads based on role"
ON leads FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()::uuid
        AND (
            users.role = 'admin'
            OR users.role = 'manager'
            OR (users.role = 'user' AND leads.responsible_id = auth.uid()::uuid)
        )
    )
);

CREATE POLICY "Allow users to delete leads based on role"
ON leads FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()::uuid
        AND users.role = 'admin'
    )
);

-- Create policies for events table
CREATE POLICY "Allow users to view all events"
ON events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to insert events"
ON events FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Allow users to update their own events"
ON events FOR UPDATE
TO authenticated
USING (user_id = auth.uid()::uuid);

CREATE POLICY "Allow users to delete their own events"
ON events FOR DELETE
TO authenticated
USING (user_id = auth.uid()::uuid);

-- Create indexes
CREATE INDEX leads_responsible_id_idx ON leads(responsible_id);
CREATE INDEX leads_pipeline_status_idx ON leads(pipeline, status);
CREATE INDEX events_user_id_idx ON events(user_id);
CREATE INDEX events_date_idx ON events(date);

-- Insert admin user
INSERT INTO users (id, email, name, role, pipelines)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'diego.demonte@vpjalimentos.com.br',
    'Diego Demonte',
    'admin',
    ARRAY['hunting', 'carteira', 'positivacao', 'resgate', 'lixeira']
) ON CONFLICT (email) DO UPDATE
SET role = 'admin',
    pipelines = ARRAY['hunting', 'carteira', 'positivacao', 'resgate', 'lixeira'];