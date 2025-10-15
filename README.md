# AI Chat Template: Cloudflare, Assistant UI, Neon

A modern, production-ready template for building full-stack React applications using Next.js on Cloudflare with Assistant UI and Neon.

## Tech Stack

- **Runtime**: Cloudflare Workers via OpenNext
- **Framework**: Next.js 15 with React 19
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Stack Auth
- **AI Chat**: Assistant UI with Vercel AI SDK
- **State Management**: TanStack Query (server state) + Zustand (client state)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Package Manager**: Bun 1.3

## Getting Started

### Prerequisites

Make sure you have Bun 1.3+ and Wrangler CLI installed:

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install Wrangler globally
bun install -g wrangler
```

### Environment Variables

Create a `.env` file in the root of the project by copying the `example.env` file:

```bash
cp example.env .env
```

### Set up Neon

We use Neon for Storage (Postgres) and Authentication. The schema is currently very simple and only includes the users_sync table but we can expand for agent memory and application data. [Drizzle](https://orm.drizzle.team/) is used for database schema management.

First, sign up for a Neon account and create a new project: [Neon](https://neon.com/signup)

Next, enable Neon Auth by navigating to Configuration > Environment Variables > Next.js and copy the variables to the `.env` file, replacing the placeholder values.

### Set up Assistant UI Cloud

We use Assistant UI for AI chat functionality and Assistant UI Cloud for persisting the chat history.

Sign up for a Assistant UI Cloud account and create a new project: [Assistant UI Cloud](https://cloud.assistant-ui.com/)

From there, copy the project base URL and project slug and add them to the `.env` file. Optionally, you can also generate an API key and add it to the `.env` file. This is not required for the base setup of this template but useful for additional features.

### Model Provider Setup

This template uses Vercel's AI SDK and Assistant UI for model serving. The `example.env` file has OpenAI set as the provider. Other providers are also supported. Refer to the [AI SDK Providers documentation](https://ai-sdk.dev/docs/foundations/providers-and-models) for more information.

Create a new API key for your preferred provider and add it to the `.env` file.

```txt
OPENAI_API_KEY=your_openai_api_key
```

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Run the development server:

```bash
bun run dev
```

Your application will be available at `http://localhost:3000`.

### Deploying Secrets

Then run the following command to sync the secrets from the `.env` file to Cloudflare:

```bash
wrangler secret bulk .env
```

## Previewing the Production Build

Preview the production build locally:

```bash
bun run preview
```

## Building for Production

Create a production build:

```bash
bun run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To build and deploy directly to production:

```bash
bun run deploy
```

To deploy a preview URL:

```bash
bunx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```bash
bunx wrangler versions deploy
```

## Add Worker URL to Neon Auth Trusted Domains

After deploying to Cloudflare Workers for the first time, copy the URL of your app and add it to the Neon Auth trusted domains in your Neon project > Auth > Configuration > Domains section. This enables Neon Auth to redirect back to your app after authentication.

## State Management

This project uses a dual state management approach:

- **TanStack Query v5.90.3** - Server state, data fetching, caching, and synchronization
- **Zustand v5.0.8** - Client state, UI state, and user preferences

See the [state management documentation](.cursor/rules/state-management.mdc) for detailed patterns and examples.

## Canvas & Animations

Interactive canvas chat powered by:

- **Fabric.js v6.7.1** - HTML5 canvas library for object manipulation
- **Anime.js v4.2.2** - Lightweight animation library for smooth transitions

Features:
- Drawing tools (pen, shapes, text)
- Object manipulation and selection
- Preset animations (pulse, bounce, shake, rotate)
- Custom animation support
- Real-time rendering

Access the canvas interface at `/canvas`. See the [canvas documentation](.cursor/rules/canvas-animations.mdc) for API and usage patterns.

## Styling

This template comes with [Shadcn UI](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.
