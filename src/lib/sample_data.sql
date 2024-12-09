-- Insert sample users
INSERT INTO users (email, name, role, pipelines)
VALUES 
  ('diego.demonte@vpjalimentos.com.br', 'Diego Demonte', 'admin', ARRAY['hunting', 'carteira', 'positivacao', 'resgate', 'lixeira'])
ON CONFLICT (email) DO UPDATE
SET role = 'admin', pipelines = ARRAY['hunting', 'carteira', 'positivacao', 'resgate', 'lixeira'];

-- Insert sample leads
INSERT INTO leads (
  dentist_name,
  clinic_name,
  phone,
  email,
  responsible_id,
  pipeline,
  status,
  potential_value
) VALUES 
  ('Dr. João Silva', 'Clínica Silva', '11999999999', 'joao@silva.com', 
   (SELECT id FROM users WHERE email = 'diego.demonte@vpjalimentos.com.br'), 
   'hunting', 'backlog', 50000),
  ('Dra. Maria Santos', 'Clínica Santos', '11988888888', 'maria@santos.com',
   (SELECT id FROM users WHERE email = 'diego.demonte@vpjalimentos.com.br'),
   'hunting', 'interagindo', 75000),
  ('Dr. Pedro Costa', 'Clínica Costa', '11977777777', 'pedro@costa.com',
   (SELECT id FROM users WHERE email = 'diego.demonte@vpjalimentos.com.br'),
   'carteira', 'carteira-ativa', 100000);

-- Insert sample events
INSERT INTO events (
  title,
  date,
  time,
  type,
  contact,
  location,
  description,
  user_id
) VALUES 
  ('Reunião com Dr. João', 
   CURRENT_DATE + 1, 
   '14:00:00',
   'visita',
   'Dr. João Silva',
   'Clínica Silva',
   'Apresentação inicial',
   (SELECT id FROM users WHERE email = 'diego.demonte@vpjalimentos.com.br'));