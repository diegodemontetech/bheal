import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { hash, verify } from '../utils/password';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = loginSchema.extend({
  name: z.string(),
  role: z.enum(['admin', 'user', 'manager']),
  pipelines: z.array(z.string())
});

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);

    const { rows } = await fastify.pg.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = rows[0];
    if (!user || !await verify(password, user.password_hash)) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ 
      id: user.id,
      email: user.email,
      role: user.role
    });

    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  });

  fastify.post('/register', async (request, reply) => {
    const data = registerSchema.parse(request.body);
    const passwordHash = await hash(data.password);

    try {
      const { rows } = await fastify.pg.query(
        `INSERT INTO users (email, password_hash, name, role, pipelines)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, name, role`,
        [data.email, passwordHash, data.name, data.role, data.pipelines]
      );

      const user = rows[0];
      const token = fastify.jwt.sign({ 
        id: user.id,
        email: user.email,
        role: user.role
      });

      return { token, user };
    } catch (error) {
      if ((error as any).code === '23505') { // unique_violation
        return reply.status(400).send({ error: 'Email already exists' });
      }
      throw error;
    }
  });

  fastify.get('/me', async (request) => {
    const { rows } = await fastify.pg.query(
      'SELECT id, email, name, role, pipelines FROM users WHERE id = $1',
      [(request.user as any).id]
    );
    return rows[0];
  });
};