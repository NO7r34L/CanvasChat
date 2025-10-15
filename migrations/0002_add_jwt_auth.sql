-- Add password and timestamps to user table for JWT auth
ALTER TABLE "user" ADD COLUMN "password" text;
ALTER TABLE "user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;

-- Drop old NextAuth tables if they exist
DROP TABLE IF EXISTS "authenticator" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "verificationToken" CASCADE;

