-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For better text search
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive search

-- Drop existing schema
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'approved', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');

-- Create tables

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    pipelines TEXT[] DEFAULT ARRAY[]::TEXT[],
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User groups table
CREATE TABLE user_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User group memberships
CREATE TABLE user_group_memberships (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES user_groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id)
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dentist_name TEXT NOT NULL,
    clinic_name TEXT,
    cnpj TEXT,
    cpf TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT,
    cep TEXT,
    socioeconomic_class TEXT,
    demographic_density INTEGER,
    consumption_potential DECIMAL(10,2),
    website TEXT,
    specialty TEXT,
    purchase_history TEXT,
    purchase_frequency TEXT,
    purchase_volume DECIMAL(10,2),
    last_purchase_date DATE,
    average_order_value DECIMAL(10,2),
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
    potential_value DECIMAL(10,2),
    competitors TEXT,
    payment_terms TEXT,
    credit_limit DECIMAL(10,2),
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
    lead_source TEXT,
    registration_status registration_status,
    registration_date TIMESTAMP WITH TIME ZONE,
    registration_notes TEXT,
    client_registered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    type TEXT NOT NULL,
    contact TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id),
    lead_id UUID REFERENCES leads(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES product_categories(id),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    weight DECIMAL(8,3) NOT NULL, -- in kg
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shipping zones
CREATE TABLE shipping_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cep_start TEXT NOT NULL,
    cep_end TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shipping rates
CREATE TABLE shipping_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES shipping_zones(id),
    weight_start DECIMAL(8,3) NOT NULL,
    weight_end DECIMAL(8,3) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    delivery_days INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    max_discount_percent DECIMAL(5,2),
    min_order_value DECIMAL(10,2),
    max_order_value DECIMAL(10,2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quotes
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES leads(id),
    user_id UUID REFERENCES users(id),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2),
    total DECIMAL(10,2) NOT NULL,
    payment_method_id UUID REFERENCES payment_methods(id),
    shipping_address TEXT NOT NULL,
    shipping_cep TEXT NOT NULL,
    delivery_days INTEGER NOT NULL,
    status quote_status NOT NULL DEFAULT 'draft',
    notes TEXT,
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quote items
CREATE TABLE quote_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lead history/timeline
CREATE TABLE lead_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attachments
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_leads_responsible ON leads(responsible_id);
CREATE INDEX idx_leads_pipeline_status ON leads(pipeline, status);
CREATE INDEX idx_leads_registration ON leads(registration_status);
CREATE INDEX idx_leads_client ON leads(client_registered);
CREATE INDEX idx_leads_search ON leads USING GIN (
    to_tsvector('portuguese',
        COALESCE(dentist_name, '') || ' ' ||
        COALESCE(clinic_name, '') || ' ' ||
        COALESCE(cnpj, '') || ' ' ||
        COALESCE(cpf, '')
    )
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_shipping_rates_zone ON shipping_rates(zone_id);
CREATE INDEX idx_quotes_lead ON quotes(lead_id);
CREATE INDEX idx_quotes_user ON quotes(user_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);
CREATE INDEX idx_quote_items_product ON quote_items(product_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_events_lead ON events(lead_id);
CREATE INDEX idx_lead_history_lead ON lead_history(lead_id);
CREATE INDEX idx_attachments_lead ON attachments(lead_id);
CREATE INDEX idx_attachments_quote ON attachments(quote_id);

-- Create functions for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function for quote number generation
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
    year text;
    sequence int;
    new_quote_number text;
BEGIN
    year := to_char(CURRENT_DATE, 'YYYY');
    
    WITH next_seq AS (
        SELECT COALESCE(MAX(SUBSTRING(quote_number FROM '\d+')::integer), 0) + 1 as seq
        FROM quotes
        WHERE quote_number LIKE 'ORC' || year || '%'
    )
    SELECT seq INTO sequence FROM next_seq;
    
    new_quote_number := 'ORC' || year || LPAD(sequence::text, 5, '0');
    NEW.quote_number := new_quote_number;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for quote number
CREATE TRIGGER generate_quote_number_trigger
    BEFORE INSERT ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION generate_quote_number();

-- Create function for lead history tracking
CREATE OR REPLACE FUNCTION track_lead_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF NEW IS DISTINCT FROM OLD THEN
            INSERT INTO lead_history (
                lead_id,
                user_id,
                action,
                description,
                old_values,
                new_values
            ) VALUES (
                NEW.id,
                current_setting('app.current_user_id', true)::uuid,
                'update',
                'Lead atualizado',
                to_jsonb(OLD),
                to_jsonb(NEW)
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for lead history
CREATE TRIGGER track_lead_changes_trigger
    AFTER UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION track_lead_changes();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all users"
    ON users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    TO authenticated
    USING (id = current_setting('app.current_user_id')::uuid);

CREATE POLICY "Admins can manage users"
    ON users FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = current_setting('app.current_user_id')::uuid
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can view leads based on role"
    ON leads FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = current_setting('app.current_user_id')::uuid
            AND (
                role = 'admin'
                OR role = 'manager'
                OR (role = 'user' AND responsible_id = current_setting('app.current_user_id')::uuid)
            )
        )
    );

CREATE POLICY "Users can insert leads"
    ON leads FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update leads based on role"
    ON leads FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = current_setting('app.current_user_id')::uuid
            AND (
                role = 'admin'
                OR role = 'manager'
                OR (role = 'user' AND responsible_id = current_setting('app.current_user_id')::uuid)
            )
        )
    );

-- Insert initial admin user
INSERT INTO users (
    email,
    name,
    password_hash,
    role,
    pipelines,
    permissions
) VALUES (
    'admin@boneheal.com.br',
    'Admin',
    -- Password: admin123 (in production, use proper password hashing)
    '$2a$10$rK7PJxLxkJfhkJ0mX9z9y.t7h/LY9Z3z4Z3Z4Z3Z4Z3Z4Z3Z4Z',
    'admin',
    ARRAY['hunting', 'carteira', 'positivacao', 'resgate', 'lixeira'],
    ARRAY['*']
) ON CONFLICT (email) DO NOTHING;