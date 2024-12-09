import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const leadSchema = z.object({
  dentist_name: z.string(),
  clinic_name: z.string().optional(),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string().optional(),
  socioeconomic_class: z.string().optional(),
  demographic_density: z.number().optional(),
  consumption_potential: z.number().optional(),
  website: z.string().optional(),
  specialty: z.string().optional(),
  purchase_history: z.string().optional(),
  purchase_frequency: z.string().optional(),
  purchase_volume: z.number().optional(),
  last_purchase_date: z.string().optional(),
  average_order_value: z.number().optional(),
  bone_barriers_type: z.string().optional(),
  preferred_brands: z.string().optional(),
  needs_samples: z.boolean().optional(),
  other_interests: z.string().optional(),
  preferred_communication: z.string().optional(),
  conversation_notes: z.string().optional(),
  feedback: z.string().optional(),
  opportunity_status: z.string().optional(),
  next_steps: z.string().optional(),
  expected_close_date: z.string().optional(),
  potential_value: z.number().optional(),
  competitors: z.string().optional(),
  payment_terms: z.string().optional(),
  credit_limit: z.number().optional(),
  payment_history: z.string().optional(),
  delivery_address: z.string().optional(),
  delivery_preferences: z.string().optional(),
  special_instructions: z.string().optional(),
  contracts: z.string().optional(),
  quotes: z.string().optional(),
  support_team: z.string().optional(),
  team_interactions: z.string().optional(),
  pipeline: z.string(),
  status: z.string(),
  lead_source: z.string().optional()
});

export const leadRoutes: FastifyPluginAsync = async (fastify) => {
  // Get leads based on user role and permissions
  fastify.get('/', async (request) => {
    const user = request.user as any;
    let query = 'SELECT * FROM leads';
    const params: any[] = [];

    if (user.role === 'user') {
      query += ' WHERE responsible_id = $1';
      params.push(user.id);
    } else if (user.role === 'manager') {
      query += ' WHERE pipeline = ANY($1)';
      params.push(user.pipelines);
    }

    query += ' ORDER BY created_at DESC';
    const { rows } = await fastify.pg.query(query, params);
    return rows;
  });

  // Get lead by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;

    const { rows } = await fastify.pg.query(
      'SELECT * FROM leads WHERE id = $1',
      [id]
    );

    if (!rows[0]) {
      return reply.status(404).send({ error: 'Lead not found' });
    }

    const lead = rows[0];

    // Check permissions
    if (user.role === 'user' && lead.responsible_id !== user.id) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    if (user.role === 'manager' && !user.pipelines.includes(lead.pipeline)) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    return lead;
  });

  // Create lead
  fastify.post('/', async (request) => {
    const user = request.user as any;
    const data = leadSchema.parse(request.body);

    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 2}`);

    const { rows } = await fastify.pg.query(
      `INSERT INTO leads (responsible_id, ${fields.join(', ')})
       VALUES ($1, ${placeholders.join(', ')})
       RETURNING *`,
      [user.id, ...values]
    );

    return rows[0];
  });

  // Update lead
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;
    const data = leadSchema.partial().parse(request.body);

    // Check permissions
    const { rows: [lead] } = await fastify.pg.query(
      'SELECT responsible_id, pipeline FROM leads WHERE id = $1',
      [id]
    );

    if (!lead) {
      return reply.status(404).send({ error: 'Lead not found' });
    }

    if (user.role === 'user' && lead.responsible_id !== user.id) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    if (user.role === 'manager' && !user.pipelines.includes(lead.pipeline)) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    const setClause = Object.entries(data)
      .map(([key, _], index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = Object.values(data);

    const { rows } = await fastify.pg.query(
      `UPDATE leads SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );

    return rows[0];
  });

  // Delete lead
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;

    // Only admins can delete leads
    if (user.role !== 'admin') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    await fastify.pg.query('DELETE FROM leads WHERE id = $1', [id]);
    return { success: true };
  });
};