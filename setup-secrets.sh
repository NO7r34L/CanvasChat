#!/bin/bash

# CanvasChat - Cloudflare Secrets Setup Script
# This script will help you push all required secrets to Cloudflare Workers

echo "========================================="
echo "  CanvasChat - Secrets Setup"
echo "========================================="
echo ""
echo "This script will configure the following secrets for your Cloudflare Worker:"
echo ""
echo "Required Secrets:"
echo "  1. DATABASE_URL - Neon PostgreSQL connection string"
echo "  2. NEXT_PUBLIC_STACK_PROJECT_ID - Stack Auth project ID"
echo "  3. NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY - Stack Auth client key"
echo "  4. STACK_SECRET_SERVER_KEY - Stack Auth server key"
echo ""
echo "Optional Secrets:"
echo "  5. OPENAI_API_KEY - For AI drawing features"
echo ""
echo "========================================="
echo ""

# Check if wrangler is available
if ! command -v bunx &> /dev/null; then
    echo "Error: bunx is not available. Please install bun first."
    exit 1
fi

echo "Step 1: Stack Auth Setup"
echo "----------------------------------------"
echo "1. Go to: https://app.stack-auth.com/"
echo "2. Create a new project or select existing"
echo "3. Add this domain to allowed domains:"
echo "   https://canvas-chat.jacob-navis.workers.dev"
echo ""
echo "Press Enter when you have your Stack Auth credentials ready..."
read

echo ""
echo "Enter your Stack Auth Project ID:"
read -r STACK_PROJECT_ID
if [ -n "$STACK_PROJECT_ID" ]; then
    echo "$STACK_PROJECT_ID" | bunx wrangler secret put NEXT_PUBLIC_STACK_PROJECT_ID
    echo "✓ NEXT_PUBLIC_STACK_PROJECT_ID configured"
fi

echo ""
echo "Enter your Stack Auth Publishable Client Key:"
read -r STACK_CLIENT_KEY
if [ -n "$STACK_CLIENT_KEY" ]; then
    echo "$STACK_CLIENT_KEY" | bunx wrangler secret put NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
    echo "✓ NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY configured"
fi

echo ""
echo "Enter your Stack Auth Secret Server Key:"
read -r STACK_SERVER_KEY
if [ -n "$STACK_SERVER_KEY" ]; then
    echo "$STACK_SERVER_KEY" | bunx wrangler secret put STACK_SECRET_SERVER_KEY
    echo "✓ STACK_SECRET_SERVER_KEY configured"
fi

echo ""
echo "Step 2: Database Setup"
echo "----------------------------------------"
echo "You have a Neon database already configured."
echo "Connection string: postgresql://neondb_owner:...@ep-snowy-math-adm5s92v-pooler.c-2.us-east-1.aws.neon.tech/neondb"
echo ""
echo "Press Enter to configure the DATABASE_URL..."
read

DATABASE_URL="postgresql://neondb_owner:npg_nJwDjV7AHIv0@ep-snowy-math-adm5s92v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
echo "$DATABASE_URL" | bunx wrangler secret put DATABASE_URL
echo "✓ DATABASE_URL configured"

echo ""
echo "Step 3: OpenAI API Key (Optional)"
echo "----------------------------------------"
echo "For AI drawing features, you need an OpenAI API key."
echo "Press Enter to skip, or paste your OpenAI API key:"
read -r OPENAI_KEY
if [ -n "$OPENAI_KEY" ]; then
    echo "$OPENAI_KEY" | bunx wrangler secret put OPENAI_API_KEY
    echo "✓ OPENAI_API_KEY configured"
else
    echo "⊘ Skipped OPENAI_API_KEY (AI features will be disabled)"
fi

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "Your CanvasChat app is now fully configured at:"
echo "https://canvas-chat.jacob-navis.workers.dev"
echo ""
echo "Next steps:"
echo "1. Visit your app and sign up for an account"
echo "2. Start creating amazing canvas art!"
echo ""

