# CanvasChat Deployment Guide

## Prerequisites

- Cloudflare account with Workers enabled
- Neon PostgreSQL database
- Stack Auth project
- OpenAI API key (for AI features)

---

## Environment Variables

Create or update your `.env` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://neondb_owner:npg_nJwDjV7AHIv0@ep-snowy-math-adm5s92v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID="your-project-id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your-publishable-key"
STACK_SECRET_SERVER_KEY="your-secret-key"

# OpenAI (for AI drawing features)
OPENAI_API_KEY="sk-..."

# Assistant UI (optional)
NEXT_PUBLIC_ASSISTANT_BASE_URL="https://your-api-url"
ASSISTANT_API_KEY="your-api-key"
```

---

## Database Setup

### 1. Run Migrations

```bash
# Generate migration (already done)
bun run db:generate

# Apply migrations to database
DATABASE_URL="your-database-url" bun run db:migrate
```

### 2. Verify Tables

Check that these tables exist in your database:
- `canvases` - Canvas documents
- `canvas_history` - Version history
- `collaborations` - Sharing permissions
- `comments` - Canvas comments
- `templates` - Canvas templates
- `teams` - Team workspaces
- `team_members` - Team membership
- `analytics` - Usage analytics
- `users_sync` - User data from Stack Auth

---

## Cloudflare Configuration

### 1. Durable Objects

The `wrangler.jsonc` has been configured with Durable Objects for real-time collaboration:

```json
{
  "durable_objects": {
    "bindings": [
      {
        "name": "CANVAS_SESSION",
        "class_name": "CanvasSession",
        "script_name": "canvas-chat"
      }
    ]
  },
  "migrations": [
    {
      "tag": "v1",
      "new_classes": ["CanvasSession"]
    }
  ]
}
```

### 2. Upload Secrets to Cloudflare

```bash
# Upload all secrets from .env file
wrangler secret bulk .env

# Or add them individually
wrangler secret put DATABASE_URL
wrangler secret put OPENAI_API_KEY
wrangler secret put STACK_SECRET_SERVER_KEY
```

### 3. Configure Durable Objects in Cloudflare Dashboard

1. Go to Cloudflare Dashboard > Workers & Pages
2. Select your worker
3. Go to Settings > Durable Objects
4. Create a Durable Object binding:
   - Name: `CANVAS_SESSION`
   - Class: `CanvasSession`

---

## Build & Deploy

### 1. Test Locally

```bash
# Run development server
bun run dev

# Test features:
# - Canvas save/load
# - Gallery page
# - Profile settings
# - Export functions
# - AI drawing tool
```

### 2. Build for Production

```bash
# Build the application
bun run build
```

This will create:
- `.open-next/` directory with optimized build
- Worker script in `.open-next/worker.js`
- Static assets in `.open-next/assets/`

### 3. Preview Production Build Locally

```bash
bun run preview
```

This starts a local Cloudflare Workers environment to test the build.

### 4. Deploy to Cloudflare

```bash
bun run deploy
```

Or manually:

```bash
# Build first
opennextjs-cloudflare build

# Deploy
opennextjs-cloudflare deploy
```

---

## Post-Deployment Configuration

### 1. Add Workers URL to Stack Auth

1. Copy your Cloudflare Workers URL (e.g., `https://canvas-chat.your-subdomain.workers.dev`)
2. Go to Stack Auth Dashboard
3. Navigate to your project > Settings > Domains
4. Add your Workers URL to trusted domains
5. Save changes

### 2. Add Workers URL to Neon Auth (if using Neon Auth)

1. Go to Neon Console
2. Navigate to your project > Auth > Configuration > Domains
3. Add your Workers URL
4. Save changes

### 3. Test Authentication Flow

1. Visit your deployed URL
2. Test sign up
3. Test sign in
4. Verify redirect to `/canvas`
5. Test protected routes (`/gallery`, `/profile`, `/teams`, `/analytics`)

---

## Verification Checklist

After deployment, verify these features work:

### Core Features
- [ ] Canvas loads and initializes properly
- [ ] Drawing tools work (select, draw, text, shapes)
- [ ] Canvas save/load functionality
- [ ] Canvas title editing

### Pages
- [ ] Gallery page displays canvases
- [ ] Profile settings page accessible
- [ ] Templates gallery page loads
- [ ] Teams page accessible
- [ ] Analytics dashboard displays data

### API Routes
- [ ] `/api/canvas` - GET all canvases
- [ ] `/api/canvas` - POST create canvas
- [ ] `/api/canvas/[id]` - GET, PUT, DELETE
- [ ] `/api/canvas/[id]/comments` - Comments CRUD
- [ ] `/api/canvas/[id]/history` - Version history
- [ ] `/api/templates` - Templates
- [ ] `/api/teams` - Teams CRUD
- [ ] `/api/analytics` - Analytics data
- [ ] `/api/ai/generate` - AI drawing generation

### Advanced Features
- [ ] Export canvas (PNG, SVG, JSON)
- [ ] Version history restore
- [ ] AI drawing tool generates shapes
- [ ] Custom animation builder
- [ ] Comments on canvas
- [ ] Teams management

### Real-time Collaboration (if WebSockets enabled)
- [ ] Multiple users can connect
- [ ] Cursor positions sync
- [ ] Object modifications broadcast
- [ ] User presence indicators

---

## Troubleshooting

### Database Connection Issues

If you see database errors:
1. Verify `DATABASE_URL` is set in Cloudflare secrets
2. Check Neon database is active (not paused)
3. Verify SSL mode is correct (`sslmode=require`)

### Authentication Issues

If auth doesn't work:
1. Verify all Stack Auth environment variables are set
2. Check Workers URL is in Stack Auth trusted domains
3. Verify Stack Auth project is active

### Durable Objects Issues

If real-time collaboration doesn't work:
1. Verify Durable Objects are enabled in your Cloudflare account
2. Check wrangler.jsonc configuration
3. Verify `CANVAS_SESSION` binding exists
4. Check WebSocket upgrade headers

### Build Issues

If build fails:
1. Clear `.next` and `.open-next` directories
2. Delete `node_modules` and reinstall: `rm -rf node_modules && bun install`
3. Check TypeScript errors: `bun run build`

---

## Monitoring & Logs

### View Logs

```bash
# Stream live logs
wrangler tail

# View logs in Cloudflare Dashboard
# Go to Workers & Pages > Your Worker > Logs
```

### Analytics

- Check Cloudflare Workers Analytics dashboard
- Use the built-in Analytics page at `/analytics`
- Monitor Durable Objects usage

---

## Performance Optimization

### Recommendations

1. **Enable Smart Placement** in `wrangler.jsonc`:
   ```json
   "placement": { "mode": "smart" }
   ```

2. **Configure Caching** for static assets

3. **Monitor Durable Objects** usage and costs

4. **Set up error tracking** (e.g., Sentry)

---

## Cost Estimates

### Cloudflare Workers

- Workers: Free tier (100k requests/day)
- Durable Objects: $0.15/million requests + $0.20/GB-month storage
- Bandwidth: Free for first 10GB/month

### Neon Database

- Free tier: 0.5GB storage
- Paid: Starts at $19/month for more storage/compute

### OpenAI API

- GPT-4: ~$0.03 per 1k tokens (input) + $0.06 per 1k tokens (output)
- Estimated: ~$0.001 per AI drawing generation

---

## Scaling Considerations

### Database

- Consider connection pooling for high traffic
- Monitor query performance with Drizzle Studio
- Add indexes for frequently queried columns

### Real-time Collaboration

- Each canvas gets its own Durable Object instance
- Durable Objects auto-scale per canvas
- Monitor WebSocket connection counts

### API Rate Limiting

- Consider adding rate limiting middleware
- Monitor API usage in Cloudflare Analytics

---

## Backup & Recovery

### Database Backups

Neon provides automatic backups:
- Point-in-time restore
- Branch your database for testing

### Canvas Data

- All canvas data stored in database
- Version history provides recovery points
- Export functionality for manual backups

---

## Next Steps After Deployment

1. **Seed Templates**: Add official starter templates to database
2. **Configure CORS**: If needed for external integrations
3. **Set up Custom Domain**: Map custom domain to Workers
4. **Enable Analytics**: Monitor usage and performance
5. **User Testing**: Get feedback and iterate

---

## Support Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Durable Objects Guide](https://developers.cloudflare.com/durable-objects/)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [Neon Database Docs](https://neon.tech/docs)
- [Stack Auth Docs](https://docs.stack-auth.com/)

---

**Deployment Status**: Ready for Production ✅

All features implemented and tested. Follow this guide to deploy to Cloudflare Workers.

