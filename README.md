# CanvasChat

Interactive canvas chat application with real-time drawing, animations, and collaborative features powered by Fabric.js and Anime.js.

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Runtime**: Cloudflare Workers via OpenNext
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Stack Auth
- **Canvas**: Fabric.js v6.7.1 for object manipulation
- **Animations**: Anime.js v4.2.2 for smooth transitions
- **State Management**: TanStack Query v5.90.3 (server) + Zustand v5.0.8 (client)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Package Manager**: Bun 1.3

## Features

### Canvas Tools
- **Select** - Object manipulation and selection
- **Draw** - Free drawing with configurable brush (color, width)
- **Text** - Add and edit text on canvas
- **Shape** - Create geometric shapes
- **Erase** - Remove objects

### Animation Presets
- **Pulse** - Scale up and down effect
- **Bounce** - Vertical bounce animation
- **Shake** - Horizontal shake effect
- **Rotate** - 360° rotation
- **Scale** - Dynamic scaling
- **Custom** - Build your own with Anime.js API

### Real-time Features
- Object selection and manipulation
- Smooth animations at 60fps
- Undo/redo support
- Clear canvas
- Export/import capabilities

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

We use Neon for Storage (Postgres) and Authentication.

1. Sign up for a Neon account: [Neon](https://neon.com/signup)
2. Create a new project
3. Enable Neon Auth: Configuration > Environment Variables > Next.js
4. Copy the variables to the `.env` file

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

Your application will be available at `http://localhost:3000` and will redirect to `/canvas`.

## Canvas API

### Animation Utilities

```typescript
import {
  animatePosition,
  animateScale,
  animateRotation,
  animatePulse,
  animateBounce,
} from "@/lib/canvas-utils";

// Animate object position
animatePosition(object, canvas, 200, 300, { duration: 500 });

// Pulse animation
animatePulse(object, canvas, { duration: 600 });
```

### Canvas Store

```typescript
import { useCanvasStore } from "@/stores/canvas-store";

// Access canvas state
const { canvas, activeTool, brushColor } = useCanvasStore();

// Update tool
useCanvasStore.getState().setActiveTool("draw");
```

### Creating Objects

```typescript
import { Rect, Circle, IText } from "fabric";

// Add rectangle
const rect = new Rect({
  left: 100,
  top: 100,
  width: 200,
  height: 100,
  fill: "#4A90E2",
});
canvas.add(rect);

// Add text
const text = new IText("Hello World", {
  left: 100,
  top: 100,
  fontSize: 24,
});
canvas.add(text);
```

## Deployment

### Deploying Secrets

Sync secrets from the `.env` file to Cloudflare:

```bash
wrangler secret bulk .env
```

### Preview Production Build

```bash
bun run preview
```

### Building for Production

```bash
bun run build
```

### Deploy to Cloudflare Workers

```bash
bun run deploy
```

Or deploy a preview version:

```bash
bunx wrangler versions upload
bunx wrangler versions deploy
```

### Post-Deployment

After first deployment:
1. Copy your Cloudflare Workers URL
2. Add URL to Neon Auth trusted domains:
   - Navigate to your Neon project
   - Go to Auth > Configuration > Domains
   - Add your Workers URL

## State Management

### TanStack Query (Server State)
- API data fetching and caching
- Automatic background refetching
- Optimistic updates
- Request deduplication

### Zustand (Client State)
- UI state (sidebar, modals, theme)
- Canvas state (tools, colors, selection)
- Persistent state with localStorage

See [state management documentation](.cursor/rules/state-management.mdc) for patterns.

## Project Structure

```
src/
├── app/
│   ├── api/user/profile/     # User profile API
│   ├── canvas/               # Canvas chat page
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Home (redirects to canvas)
├── components/
│   ├── canvas-chat.tsx       # Main canvas component
│   ├── canvas-toolbar.tsx    # Tool controls
│   ├── canvas-animations.tsx # Animation presets
│   ├── canvas-page.tsx       # Canvas page layout
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── canvas-utils.ts       # Animation utilities
│   ├── providers.tsx         # QueryClient provider
│   ├── db/                   # Database schema
│   └── stack/                # Stack Auth config
├── hooks/
│   └── use-user-profile.ts   # TanStack Query hooks
└── stores/
    ├── canvas-store.ts       # Canvas state
    ├── ui-store.ts           # UI state
    └── chat-store.ts         # Chat preferences
```

## Documentation

- [Canvas & Animations](.cursor/rules/canvas-animations.mdc) - Complete API guide
- [State Management](.cursor/rules/state-management.mdc) - TanStack Query & Zustand patterns
- [Database Patterns](.cursor/rules/database-patterns.mdc) - Drizzle ORM usage
- [Deployment](.cursor/rules/deployment.mdc) - Cloudflare Workers deployment

## Resources

- [Fabric.js Documentation](http://fabricjs.com/docs/)
- [Anime.js Documentation](https://animejs.com/documentation/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [Next.js 15](https://nextjs.org/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

## License

MIT
