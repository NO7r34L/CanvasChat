import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  try {
    console.log("🔄 Running NextAuth.js migration...");
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "name" TEXT,
        "email" TEXT UNIQUE,
        "emailVerified" TIMESTAMP,
        "image" TEXT
      )
    `;
    
    // Create accounts table
    await sql`
      CREATE TABLE IF NOT EXISTS "account" (
        "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        PRIMARY KEY ("provider", "providerAccountId")
      )
    `;
    
    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "sessionToken" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "expires" TIMESTAMP NOT NULL
      )
    `;
    
    // Create verification tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS "verificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP NOT NULL,
        PRIMARY KEY ("identifier", "token")
      )
    `;
    
    // Create authenticators table
    await sql`
      CREATE TABLE IF NOT EXISTS "authenticator" (
        "credentialID" TEXT NOT NULL UNIQUE,
        "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "providerAccountId" TEXT NOT NULL,
        "credentialPublicKey" TEXT NOT NULL,
        "counter" INTEGER NOT NULL,
        "credentialDeviceType" TEXT NOT NULL,
        "credentialBackedUp" BOOLEAN NOT NULL,
        "transports" TEXT,
        PRIMARY KEY ("userId", "credentialID")
      )
    `;
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId")`;
    await sql`CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId")`;
    await sql`CREATE INDEX IF NOT EXISTS "authenticator_userId_idx" ON "authenticator"("userId")`;
    
    console.log("✅ NextAuth.js tables created successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();

