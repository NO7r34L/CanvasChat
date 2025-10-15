import { db } from "./db/db";
import { users } from "./db/auth-schema";
import { eq } from "drizzle-orm";

/**
 * Edge-compatible JWT Authentication for Cloudflare Workers
 * Uses Web Crypto API (available in Edge Runtime)
 */

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_ALGORITHM = { name: "HMAC", hash: "SHA-256" };

// Convert string to ArrayBuffer for Web Crypto API
async function getSecretKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    JWT_ALGORITHM,
    false,
    ["sign", "verify"]
  );
}

// Hash password using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// Create JWT token
export async function createToken(userId: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const payloadB64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const key = await getSecretKey();
  const signature = await crypto.subtle.sign(JWT_ALGORITHM.name, key, data);

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !signatureB64) return null;

    // Verify signature
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await getSecretKey();

    const signature = Uint8Array.from(
      atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      JWT_ALGORITHM.name,
      key,
      signature,
      data
    );

    if (!valid) return null;

    // Check expiration
    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload.sub;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// Sign in user
export async function signIn(
  email: string,
  password: string
): Promise<{ token: string; user: any } | null> {
  try {
    console.log("Auth: Looking up user:", email);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log("Auth: User found:", !!user, "Has password:", !!user?.password);
    
    if (!user || !user.password) {
      console.log("Auth: No user or no password");
      return null;
    }

    console.log("Auth: Verifying password...");
    const valid = await verifyPassword(password, user.password);
    console.log("Auth: Password valid:", valid);
    
    if (!valid) return null;

    const token = await createToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return null;
  }
}

// Sign up user
export async function signUp(
  email: string,
  password: string,
  name?: string
): Promise<{ token: string; user: any } | null> {
  try {
    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("User already exists");
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
      })
      .returning();

    const token = await createToken(newUser.id);

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        image: newUser.image,
      },
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return null;
  }
}

// Get user from token
export async function getUserFromToken(
  token: string
): Promise<any | null> {
  try {
    const userId = await verifyToken(token);
    if (!userId) return null;

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

// Get user from request (for use in API routes)
export async function getUser(request: Request): Promise<any | null> {
  const authHeader = request.headers.get("Authorization");
  const token =
    authHeader?.replace("Bearer ", "") ||
    request.headers.get("X-Auth-Token") ||
    null;

  if (!token) return null;

  return await getUserFromToken(token);
}

// Middleware helper
export async function requireAuth(request: Request): Promise<any> {
  const user = await getUser(request);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
