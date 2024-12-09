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

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update for users based on email"
ON users FOR UPDATE
TO authenticated
USING (auth.email() = email);

CREATE POLICY "Enable read access for authenticated users"
ON leads FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON leads FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON leads FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete for authenticated users"
ON leads FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Enable read access for authenticated users"
ON events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON events FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON events FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete for authenticated users"
ON events FOR DELETE
TO authenticated
USING (true);

-- Create indexes
CREATE INDEX leads_responsible_id_idx ON leads(responsible_id);
CREATE INDEX leads_pipeline_status_idx ON leads(pipeline, status);
CREATE INDEX events_user_id_idx ON events(user_id);
CREATE INDEX events_date_idx ON events(date);