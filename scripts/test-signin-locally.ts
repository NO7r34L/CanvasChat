import { signIn } from "../src/lib/auth";

async function testSignIn() {
  console.log("Testing sign in locally with demo credentials...\n");
  
  const email = "dev@demo.com";
  const password = "Test123";
  
  console.log("Email:", email);
  console.log("Password:", password);
  console.log();
  
  try {
    const result = await signIn(email, password);
    
    if (result) {
      console.log("✅ Sign in successful!");
      console.log("User:", result.user);
      console.log("Token:", result.token.substring(0, 50) + "...");
    } else {
      console.log("❌ Sign in failed - Invalid credentials");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSignIn();

