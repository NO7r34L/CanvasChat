import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

/**
 * Edge-compatible database client for Cloudflare Workers
 * Uses Neon's HTTP driver which works in Edge Runtime
 * No dotenv needed - environment variables are provided by the runtime
 */
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
