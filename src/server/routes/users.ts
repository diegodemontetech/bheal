import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().optional(),
  role: z.enum(['admin', 'user', 'manager']).optional(),
  pipelines: z.array(z.string()).optional()
});

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all users (admin only)
  fastify.get('/', async (request, reply) => {
    const user = request.user as any;
    if (user.role !== 'admin') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    const { rows } = await fastify.pg.query(
      'SELECT id, email, name, role, pipelines FROM users'
    );
    return rows;
  });

  // Get user by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;

    // Users can only view their own profile unless they're admin
    if (user.role !== 'admin' && user.id !== id) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    const { rows } = await fastify.pg.query(
      'SELECT id, email, name, role, pipelines FROM users WHERE id = $1',
      [id]
    );

    if (!rows[0]) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return rows[0];
  });

  // Update user
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;
    const data = updateUserSchema.parse(request.body);

    // Users can only update their own profile unless they're admin
    if (user.role !== 'admin' && user.id !== id) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    // Only admins can change roles
    if (data.role && user.role !== 'admin') {
      return reply.status(403).send({ error: 'Only admins can change roles' });
    }

    const setClause = Object.entries(data)
      .map(([key, _], index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = Object.values(data);

    const { rows } = await fastify.pg.query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, email, name, role, pipelines`,
      [id, ...values]
    );

    return rows[0];
  });

  // Delete user (admin only)
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as any;

    if (user.role !== 'admin') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    await fastify.pg.query('DELETE FROM users WHERE id = $1', [id]);
    return { success: true };
  });
};