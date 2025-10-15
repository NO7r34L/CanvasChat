# Quick Secrets Setup - CanvasChat

## 🚀 Your app is deployed at:
### https://canvas-chat.jacob-navis.workers.dev

---

## ⚡ Quick Setup (Copy & Paste)

### Option 1: Interactive Script
```bash
cd /Users/jn/Documents/hackathon.cf
./setup-secrets.sh
```

### Option 2: Manual Commands

**1. Get Stack Auth Credentials**
- Visit: https://app.stack-auth.com/
- Create/select project
- Add domain: `https://canvas-chat.jacob-navis.workers.dev`
- Copy your 3 API keys

**2. Push Secrets (one at a time)**
```bash
cd /Users/jn/Documents/hackathon.cf

# Stack Auth Project ID
bunx wrangler secret put NEXT_PUBLIC_STACK_PROJECT_ID

# Stack Auth Client Key  
bunx wrangler secret put NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY

# Stack Auth Server Key
bunx wrangler secret put STACK_SECRET_SERVER_KEY

# Database URL
bunx wrangler secret put DATABASE_URL
# Paste: postgresql://neondb_owner:npg_nJwDjV7AHIv0@ep-snowy-math-adm5s92v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# Optional: OpenAI for AI features
bunx wrangler secret put OPENAI_API_KEY
```

---

## ✅ That's It!

After setting secrets, visit your app:
### https://canvas-chat.jacob-navis.workers.dev

The errors will be gone and you can sign up!

---

## 📋 What Each Secret Does

| Secret | Required? | Purpose |
|--------|-----------|---------|
| `NEXT_PUBLIC_STACK_PROJECT_ID` | ✅ Yes | Stack Auth project identifier |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | ✅ Yes | Stack Auth client authentication |
| `STACK_SECRET_SERVER_KEY` | ✅ Yes | Stack Auth server authentication |
| `DATABASE_URL` | ✅ Yes | Neon PostgreSQL connection |
| `OPENAI_API_KEY` | ⚠️ Optional | AI drawing generation |

---

## 🔍 Verify Setup

```bash
bunx wrangler secret list
```

You should see all 4-5 secrets listed.

---

## 🐛 Still Getting Errors?

1. Make sure all 4 required secrets are set
2. In Stack Auth dashboard, verify the domain is added
3. Wait 30 seconds after setting secrets, then refresh the page

---

**Need help?** Check `SECRETS_SETUP.md` for detailed instructions.

