import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string(),
  date: z.string(),
  time: z.string(),
  type: z.string(),
  contact: z.string(),
  location: z.string(),
  description: z.string().optional()
});

export const eventRoutes: FastifyPluginAsync = async (fastify) => {
  // Get events
  fastify.get('/', async (request) => {
    const user = request.user as any;
    const { rows } = await fastify.pg.query(
      'SELECT * FROM events WHERE user_id = $1 ORDER BY date, time',
      [user.id]
    );
    return rows;
  });

  // Get event by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;

    const { rows } = await fastify.pg.query(
      'SELECT * FROM events WHERE id = $1 AND user_id = $2',
      [id, user.id]
    );

    if (!rows[0]) {
      return reply.status(404).send({ error: 'Event not found' });
    }

    return rows[0];
  });

  // Create event
  fastify.post('/', async (request) => {
    const user = request.user as any;
    const data = eventSchema.parse(request.body);

    const { rows } = await fastify.pg.query(
      `INSERT INTO events (user_id, title, date, time, type, contact, location, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [user.id, data.title, data.date, data.time, data.type, data.contact, data.location, data.description]
    );

    return rows[0];
  });

  // Update event
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;
    const data = eventSchema.partial().parse(request.body);

    const setClause = Object.entries(data)
      .map(([key, _], index) => `${key} = $${index + 3}`)
      .join(', ');

    const values = Object.values(data);

    const { rows } = await fastify.pg.query(
      `UPDATE events 
       SET ${setClause} 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, user.id, ...values]
    );

    if (!rows[0]) {
      return reply.status(404).send({ error: 'Event not found' });
    }

    return rows[0];
  });

  // Delete event
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;

    const { rowCount } = await fastify.pg.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2',
      [id, user.id]
    );

    if (!rowCount) {
      return reply.status(404).send({ error: 'Event not found' });
    }

    return { success: true };
  });
};