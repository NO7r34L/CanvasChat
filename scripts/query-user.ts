import { neon } from "@neondatabase/serverless";

async function queryUser() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log("Querying all users...\n");
  
  try {
    const users = await sql`
      SELECT id, email, name, 
             LEFT(password, 30) as password_preview,
             LENGTH(password) as password_length,
             created_at, updated_at 
      FROM "user" 
      ORDER BY created_at DESC
    `;

    console.log(`Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Password: ${user.password_preview}... (${user.password_length} chars)`);
      console.log(`   Created: ${user.created_at}`);
      console.log(`   Updated: ${user.updated_at}`);
      console.log();
    });
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

queryUser();

