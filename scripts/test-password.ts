import { hashPassword, verifyPassword } from "../src/lib/auth";

async function testPassword() {
  const password = "Test123";
  
  console.log("Testing password:", password);
  console.log("\nHashing password...");
  const hash1 = await hashPassword(password);
  console.log("Hash 1:", hash1);
  
  const hash2 = await hashPassword(password);
  console.log("Hash 2:", hash2);
  
  console.log("\nHashes match:", hash1 === hash2);
  
  console.log("\nVerifying password against hash1...");
  const valid1 = await verifyPassword(password, hash1);
  console.log("Valid:", valid1);
  
  console.log("\nVerifying wrong password...");
  const valid2 = await verifyPassword("WrongPassword", hash1);
  console.log("Valid:", valid2);
  
  // Test with the actual stored hash
  const storedHash = "d9b5f58f0b38198293974a0c04fdfdbf0130595c8c7a9099adc6d476f73c8f7b";
  console.log("\nVerifying against stored hash:", storedHash.substring(0, 20) + "...");
  const valid3 = await verifyPassword(password, storedHash);
  console.log("Valid:", valid3);
}

testPassword();

