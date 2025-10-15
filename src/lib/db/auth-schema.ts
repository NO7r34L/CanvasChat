import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Simple JWT-based authentication schema
 * Compatible with Cloudflare Workers Edge Runtime
 */
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  image: text("image"),
  password: text("password"), // Hashed password for JWT auth
});
