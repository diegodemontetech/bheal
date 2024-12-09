import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import postgres from '@fastify/postgres';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { leadRoutes } from './routes/leads';
import { eventRoutes } from './routes/events';

const fastify = Fastify({
  logger: true
});

// Register plugins
await fastify.register(cors, {
  origin: true,
  credentials: true
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
});

await fastify.register(postgres, {
  connectionString: 'postgres://postgres:postgres@localhost:5432/boneheal'
});

// Swagger documentation
await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Boneheal CRM API',
      description: 'API documentation for Boneheal CRM',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
});

await fastify.register(swaggerUi, {
  routePrefix: '/documentation'
});

// Register route handlers
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(userRoutes, { prefix: '/api/users' });
fastify.register(leadRoutes, { prefix: '/api/leads' });
fastify.register(eventRoutes, { prefix: '/api/events' });

// Add authentication hook
fastify.addHook('onRequest', async (request, reply) => {
  try {
    if (request.url.startsWith('/api/auth')) return;
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Start server
try {
  await fastify.listen({ port: 3000 });
  console.log('Server listening on port 3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}