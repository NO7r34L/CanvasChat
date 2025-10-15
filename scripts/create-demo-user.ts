import { neon } from "@neondatabase/serverless";
import { hashPassword } from "../src/lib/auth";

/**
 * Create a demo user in the database
 * Email: dev@demo.com
 * Password: Test123
 */

async function createDemoUser() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("Connecting to database...");
  const sql = neon(databaseUrl);

  const email = "dev@demo.com";
  const password = "Test123";
  const name = "Demo User";

  console.log("Hashing password...");
  const hashedPassword = await hashPassword(password);

  console.log("Creating user...");
  
  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM "user" WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      console.log("User already exists, updating password...");
      await sql`
        UPDATE "user" 
        SET password = ${hashedPassword}, updated_at = NOW()
        WHERE email = ${email}
      `;
      console.log("✅ Password updated for existing user");
    } else {
      console.log("Inserting new user...");
      await sql`
        INSERT INTO "user" (email, password, name, created_at, updated_at)
        VALUES (${email}, ${hashedPassword}, ${name}, NOW(), NOW())
      `;
      console.log("✅ New user created");
    }

    console.log("\n🎉 Demo user is ready!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email:    dev@demo.com");
    console.log("Password: Test123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nYou can now login at:");
    console.log("https://canvas-chat.jacob-navis.workers.dev/auth/signin");
  } catch (error) {
    console.error("❌ Error creating user:", error);
    process.exit(1);
  }
}

createDemoUser();

