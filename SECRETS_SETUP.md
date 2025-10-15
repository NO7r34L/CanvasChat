# CanvasChat - Secrets Configuration Guide

## Overview

Your CanvasChat app is deployed at: **https://canvas-chat.jacob-navis.workers.dev**

To make it functional, you need to configure the following secrets.

---

## Method 1: Using Cloudflare CLI (Recommended)

### Step 1: Stack Auth Setup

1. Go to https://app.stack-auth.com/
2. Create a new project (or use existing)
3. Add your domain to allowed origins:
   ```
   https://canvas-chat.jacob-navis.workers.dev
   ```
4. Copy your credentials from the dashboard

### Step 2: Push Secrets to Cloudflare

```bash
cd /Users/jn/Documents/hackathon.cf

# Stack Auth Project ID
bunx wrangler secret put NEXT_PUBLIC_STACK_PROJECT_ID
# When prompted, paste your project ID

# Stack Auth Client Key
bunx wrangler secret put NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
# When prompted, paste your publishable client key

# Stack Auth Server Key
bunx wrangler secret put STACK_SECRET_SERVER_KEY
# When prompted, paste your secret server key

# Database URL (already configured for you)
echo "postgresql://neondb_owner:npg_nJwDjV7AHIv0@ep-snowy-math-adm5s92v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" | bunx wrangler secret put DATABASE_URL

# Optional: OpenAI API Key (for AI features)
bunx wrangler secret put OPENAI_API_KEY
# When prompted, paste your OpenAI API key
```

### Step 3: Verify Secrets

```bash
bunx wrangler secret list
```

---

## Method 2: Using GitHub Secrets (CI/CD)

If you want to automate deployments via GitHub Actions:

1. Go to your GitHub repository settings
2. Navigate to **Settings → Secrets and variables → Actions**
3. Add the following repository secrets:

```
CLOUDFLARE_API_TOKEN=<your_cloudflare_api_token>
CLOUDFLARE_ACCOUNT_ID=e18f9694ee512bda5bfe8604c7ac6971

DATABASE_URL=postgresql://neondb_owner:npg_nJwDjV7AHIv0@ep-snowy-math-adm5s92v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

NEXT_PUBLIC_STACK_PROJECT_ID=<your_stack_project_id>
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=<your_stack_client_key>
STACK_SECRET_SERVER_KEY=<your_stack_server_key>

OPENAI_API_KEY=<your_openai_key>
```

---

## Method 3: Quick Setup Script

Run the interactive setup script:

```bash
cd /Users/jn/Documents/hackathon.cf
chmod +x setup-secrets.sh
./setup-secrets.sh
```

---

## Required Secrets

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `NEXT_PUBLIC_STACK_PROJECT_ID` | Stack Auth project identifier | https://app.stack-auth.com/projects → Your Project → Settings |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | Stack Auth client-side key | https://app.stack-auth.com/projects → Your Project → API Keys |
| `STACK_SECRET_SERVER_KEY` | Stack Auth server-side key | https://app.stack-auth.com/projects → Your Project → API Keys |
| `DATABASE_URL` | Neon PostgreSQL connection string | Already configured: `postgresql://neondb_owner:npg_nJwDjV7AHIv0@...` |

## Optional Secrets

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | https://platform.openai.com/api-keys |

---

## Troubleshooting

### Error: "placeholder_project_id not found"

This means Stack Auth secrets are not configured. Follow Step 1 and Step 2 above.

### Error: "Database connection failed"

Check that `DATABASE_URL` is properly set with the Neon connection string.

### AI Features Not Working

Make sure `OPENAI_API_KEY` is configured. This is optional but required for AI drawing generation.

---

## Stack Auth Configuration

After setting up secrets, you must also configure Stack Auth:

1. Go to https://app.stack-auth.com/
2. Select your project
3. Go to **Settings → Domains**
4. Add: `https://canvas-chat.jacob-navis.workers.dev`
5. Save changes

---

## Verify Your Setup

After configuring all secrets:

1. Visit: https://canvas-chat.jacob-navis.workers.dev
2. You should see the sign-in page without errors
3. Try creating an account
4. Test the canvas features

---

## Next Deployment

After making code changes, redeploy with:

```bash
bun run deploy
```

Secrets are persistent and don't need to be re-configured on each deployment.

