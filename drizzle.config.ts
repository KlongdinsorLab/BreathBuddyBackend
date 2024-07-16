import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
config({ path: '.env' });
export default defineConfig({
  schema: './supabase/functions/common/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
    // url: process.env.DATABASE_URL!,
  },
});