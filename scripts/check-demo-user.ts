import { neon } from "@neondatabase/serverless";

async function checkDemoUser() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const email = "dev@demo.com";

  console.log("Checking for user:", email);
  
  try {
    const users = await sql`
      SELECT id, email, name, password, created_at, updated_at 
      FROM "user" 
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      console.log("❌ User not found!");
    } else {
      const user = users[0];
      console.log("\n✅ User found:");
      console.log("ID:", user.id);
      console.log("Email:", user.email);
      console.log("Name:", user.name);
      console.log("Password Hash:", user.password?.substring(0, 20) + "...");
      console.log("Created:", user.created_at);
      console.log("Updated:", user.updated_at);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkDemoUser();

