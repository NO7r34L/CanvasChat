import { neon } from "@neondatabase/serverless";

async function checkSchema() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log("Checking user table schema...\n");
  
  try {
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'user'
      ORDER BY ordinal_position
    `;

    console.log("Columns in 'user' table:\n");
    columns.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkSchema();

