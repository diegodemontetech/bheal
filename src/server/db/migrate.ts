import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'boneheal',
  user: 'postgres',
  password: 'postgres'
});

async function migrate() {
  const client = await pool.connect();
  try {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schema);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);