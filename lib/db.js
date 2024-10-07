import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Uses the DATABASE_URL from .env.local
});

export default pool;
