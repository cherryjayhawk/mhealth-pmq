import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  
  console.log('Running migrations...');
  
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  
  console.log('Migrations completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});