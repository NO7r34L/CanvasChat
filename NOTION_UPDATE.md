# CanvasChat - Project Documentation

**Interactive canvas chat application with real-time drawing, animations, and collaborative features**

---

## 🎯 Overview

CanvasChat is a full-stack canvas-based collaborative application that combines real-time drawing capabilities with smooth animations and a modern tech stack optimized for Cloudflare Workers deployment.

**Live Demo**: [Add your deployment URL here]
**GitHub**: https://github.com/NO7r34L/CanvasChat.git

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) with React 19
- **Canvas Engine**: Fabric.js v5.3.0 (locally hosted)
- **Animations**: Anime.js v3.2.1 (60fps smooth transitions)
- **Styling**: Tailwind CSS v4 + Shadcn UI (New York style)
- **Type Safety**: TypeScript with strict mode

### Backend & Infrastructure
- **Runtime**: Cloudflare Workers via OpenNext
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Stack Auth (@stackframe/stack)
- **Package Manager**: Bun 1.3

### State Management
- **Server State**: TanStack Query v5.90.3 (API caching, background refetching)
- **Client State**: Zustand v5.0.8 (UI, canvas, preferences)

---

## ✨ Features by Page

### 🎨 Canvas Workspace (`/canvas`)

**Status**: ✅ Fully Implemented with Full-Screen Layout

#### Core Features
- **Full-Screen Canvas**: Responsive canvas that fills entire viewport below header
- **Tool Suite**:
  - ✏️ Select - Object manipulation and selection
  - 🖊️ Draw - Free drawing with configurable brush
  - 📝 Text - Add and edit text objects
  - 🔲 Shape - Rectangle tool
  - ⭕ Circle - Circle tool
  - 💬 Comment - Annotation tool (planned)
  - ✋ Hand - Pan/navigate canvas

#### Floating Toolbar (Left Side)
- Tool selection with keyboard shortcuts
- Visual active state indicators
- Tooltips for each tool

#### Properties Panel (Right Side)
- **Design Controls**:
  - Fill color picker with hex input
  - Stroke color picker
  - Stroke width slider (0-20px)
- **Animation Presets** (contextual):
  - ↕ Pulse - Scale up/down effect
  - ↑ Bounce - Vertical bounce with easing
  - ↔ Shake - Horizontal shake effect
  - ↻ Rotate - 360° smooth rotation
  - × Delete - Remove selected object

#### Header Controls
- Canvas title (editable)
- Zoom controls (10%-300%)
- My Gallery button
- Share button
- User avatar menu

#### Bottom Toolbar
- Undo action
- Redo action
- Clear canvas (with confirmation)

#### Technical Improvements (Latest)
- **Local Vendor Libraries**: Fabric.js and Anime.js hosted locally for reliability
- **TextBaseline Patch**: Custom patch fixes browser warnings
- **Error Handling**: Loading indicators and retry logic
- **Full-Screen Layout**: Canvas fills entire viewport responsively
- **Performance**: Optimized resize handlers

#### Keyboard Shortcuts
- `V` - Select tool
- `H` - Hand tool
- `R` - Rectangle
- `O` - Circle
- `P` - Pen/Draw
- `T` - Text
- `Delete/Backspace` - Delete selected

---

### 🖼️ Gallery Page (`/gallery`)

**Status**: ✅ HTML Prototype Complete

#### Features
- **Canvas Grid Layout**: Masonry-style responsive grid
- **Filter System**:
  - All canvases
  - Recent
  - Favorites
  - Shared with me
- **Canvas Cards**:
  - Thumbnail preview
  - Title
  - Last modified date
  - Quick actions menu (⋮)
- **New Canvas** button (prominent CTA)
- **Empty State**: Welcoming message for new users

#### Sample Data
- 6 example canvases with realistic metadata
- Visual thumbnails with gradient backgrounds
- Date formatting (e.g., "2 days ago")

---

### 👤 Profile & Settings (`/profile`)

**Status**: ✅ HTML Prototype Complete

#### Profile Information
- Avatar with user initials
- Display name (editable)
- Email address (read-only)
- Change avatar button

#### Preferences (Toggle Switches)
- ✨ Enable Animations
- 💾 Auto-Save
- 📐 Grid Snap
- 📧 Email Notifications

#### Security Settings
- Change password
- Two-factor authentication
- Active sessions management

#### Danger Zone
- Delete account (with confirmation modal)

---

### 🏠 Public Pages

#### Landing Page (`/`)
**Status**: ✅ Complete with Animated Background

**Features**:
- Hero section with gradient background
- Animated particle system
- 6 feature cards with icons:
  - Real-time canvas collaboration
  - Smooth animations
  - Export & share
  - Cloud storage
  - Version history
  - Team workspaces
- Call-to-action sections
- Footer with links
- Fully responsive

#### Login Page (`/login`)
**Status**: ✅ Complete

**Features**:
- Email/password login form
- OAuth buttons (GitHub, Google)
- "Forgot password?" link
- Sign up link for new users
- Form validation
- Animated background

#### Signup Page (`/signup`)
**Status**: ✅ Complete

**Features**:
- Full name field
- Email/password signup form
- OAuth buttons (GitHub, Google)
- Terms of service checkbox
- Password requirements display
- Sign in link for existing users
- Animated background

---

## 📁 Project Structure

```
hackathon.cf/
├── src/                          # Next.js application source
│   ├── app/
│   │   ├── api/user/profile/    # User profile API endpoint
│   │   ├── canvas/              # Canvas workspace page
│   │   ├── handler/[...stack]/  # Stack Auth handler
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── page.tsx             # Home (redirects to /canvas)
│   ├── components/
│   │   ├── canvas-chat.tsx      # Main Fabric.js canvas component
│   │   ├── canvas-toolbar.tsx   # Tool selection UI
│   │   ├── canvas-animations.tsx # Animation preset controls
│   │   ├── canvas-page.tsx      # Canvas page wrapper
│   │   ├── profile-button.tsx   # User profile dropdown
│   │   ├── profile-settings.tsx # Settings component
│   │   └── ui/                  # 40+ Shadcn UI components
│   ├── lib/
│   │   ├── canvas-utils.ts      # Animation helper functions
│   │   ├── providers.tsx        # TanStack Query provider
│   │   ├── utils.ts             # Utility functions (cn helper)
│   │   ├── db/
│   │   │   ├── db.ts           # Neon database client
│   │   │   └── schema.ts       # Drizzle schema definitions
│   │   └── stack/
│   │       ├── client.tsx      # Stack Auth client
│   │       ├── server.tsx      # Stack Auth server
│   │       └── utils.ts        # Auth utilities
│   ├── hooks/
│   │   ├── use-mobile.ts       # Mobile detection hook
│   │   └── use-user-profile.ts # TanStack Query user hook
│   └── stores/
│       ├── canvas-store.ts     # Canvas state (tools, colors, objects)
│       ├── ui-store.ts         # UI state (sidebar, modals, theme)
│       ├── chat-store.ts       # Chat preferences
│       └── index.ts            # Store exports
├── screens/                     # HTML prototypes
│   ├── public/
│   │   ├── landing.html        # Marketing page
│   │   ├── login.html          # Sign in
│   │   └── signup.html         # Sign up
│   ├── logged-in/
│   │   ├── canvas.html         # ✨ Interactive canvas workspace
│   │   ├── gallery.html        # Canvas gallery
│   │   └── profile.html        # User settings
│   └── shared/
│       ├── styles.css          # Shared CSS
│       ├── animated-bg.js      # Background animation
│       ├── debug-tool.js       # Debug utilities
│       ├── assets/             # Images and logos
│       └── vendor/             # 🆕 Local JS libraries
│           ├── fabric.min.js   # Fabric.js v5.3.0 (306KB)
│           ├── anime.min.js    # Anime.js v3.2.1 (17KB)
│           ├── fabric-patch.js # TextBaseline fix (1.4KB)
│           └── README.md       # Vendor documentation
├── migrations/                  # Drizzle database migrations
├── public/                      # Static assets
├── .cursor/rules/              # Project documentation
│   ├── canvas-animations.mdc   # Canvas API guide
│   ├── state-management.mdc    # State patterns
│   ├── database-patterns.mdc   # Database guide
│   ├── deployment.mdc          # Deployment guide
│   └── authentication.mdc      # Auth patterns
├── next.config.ts              # Next.js configuration
├── open-next.config.ts         # OpenNext config
├── wrangler.jsonc              # Cloudflare Workers config
├── drizzle.config.ts           # Database migrations config
├── tailwind.config.ts          # Tailwind configuration
└── package.json                # Dependencies
```

---

## 🎨 Design System

### Colors
```css
/* Primary Palette */
--primary: #6B46C1        /* Purple - Primary brand */
--primary-hover: #5a3ba3  /* Darker purple */
--secondary: #38B2AC      /* Teal - Secondary accent */

/* Text Colors */
--text-primary: #1a1a1a   /* Main content */
--text-secondary: #666    /* Labels, meta info */
--text-muted: #999        /* Disabled, placeholders */

/* UI Colors */
--border: #e5e5e5         /* Borders, dividers */
--bg-primary: #ffffff     /* Main background */
--bg-secondary: #f5f5f5   /* Secondary surfaces */
--bg-tertiary: #f0f0f0    /* Canvas background */
```

### Typography
- **Font Stack**: System fonts (Apple, Segoe UI, Roboto)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Sizes**: 0.75rem - 2rem scale

### Spacing Scale
- 0.25rem (4px) increments
- Components: 0.5rem - 2rem padding
- Sections: 2rem - 4rem margins

### Shadows
```css
/* Subtle */
box-shadow: 0 2px 8px rgba(0,0,0,0.05);

/* Medium */
box-shadow: 0 4px 20px rgba(0,0,0,0.1);

/* Large */
box-shadow: 0 8px 32px rgba(0,0,0,0.15);
```

---

## 🔧 Development Setup

### Prerequisites
```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Install Wrangler CLI
bun install -g wrangler
```

### Environment Setup
```bash
# Copy environment template
cp example.env .env

# Install dependencies
bun install
```

### Required Environment Variables
```bash
# Neon Database
DATABASE_URL="postgresql://..."

# Stack Auth
STACK_PROJECT_ID="..."
STACK_SECRET_KEY="..."
NEXT_PUBLIC_STACK_PROJECT_ID="..."
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="..."
```

### Run Development Server
```bash
bun run dev
# Open http://localhost:3000
```

---

## 📚 API & Utilities

### Canvas Animation API

```typescript
import { 
  animatePulse, 
  animateBounce,
  animateRotation,
  animatePosition 
} from "@/lib/canvas-utils";

// Pulse animation
animatePulse(object, canvas, { 
  duration: 600,
  scale: 1.2 
});

// Move object
animatePosition(object, canvas, 200, 300, { 
  duration: 500,
  easing: 'easeInOutQuad'
});
```

### Canvas Store

```typescript
import { useCanvasStore } from "@/stores/canvas-store";

function ToolSelector() {
  const { activeTool, setActiveTool, brushColor, setBrushColor } = useCanvasStore();
  
  return (
    <button onClick={() => setActiveTool("draw")}>
      Draw ({activeTool === "draw" ? "active" : "inactive"})
    </button>
  );
}
```

### UI Store

```typescript
import { useUIStore } from "@/stores/ui-store";

function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  
  return (
    <aside className={sidebarOpen ? "visible" : "hidden"}>
      {/* Sidebar content */}
    </aside>
  );
}
```

---

## 🚀 Deployment

### Build & Deploy to Cloudflare Workers

```bash
# Sync environment variables
wrangler secret bulk .env

# Preview production build locally
bun run preview

# Build for production
bun run build

# Deploy to Cloudflare Workers
bun run deploy
```

### Post-Deployment Setup
1. Copy your Cloudflare Workers URL
2. Add to Stack Auth trusted domains
3. Add to Neon Auth allowed origins
4. Test authentication flow

---

## 🔐 Authentication Flow

### Stack Auth Integration
- OAuth providers: GitHub, Google
- Email/password authentication
- Session management
- Protected routes with `getUser({ or: "redirect" })`

### Route Protection
```typescript
// In Server Components
import { stackServerApp } from "@/lib/stack/server";

export default async function CanvasPage() {
  const user = await stackServerApp.getUser({ or: "redirect" });
  // User is authenticated
}
```

---

## 📊 Database Schema

### Tables
- **users**: User profiles and settings
- **canvases**: Canvas documents and metadata
- **canvas_history**: Version history
- **collaborations**: Sharing and permissions

### Migrations
```bash
# Generate migration
bun run db:generate

# Push to database
bun run db:push

# Open Drizzle Studio
bun run db:studio
```

---

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Canvas workspace with Fabric.js
- [x] Animation presets with Anime.js
- [x] Tool suite (select, draw, text, shapes)
- [x] Full-screen responsive layout
- [x] Local vendor libraries
- [x] Error handling & loading states

### Phase 2: User Features (In Progress)
- [ ] User authentication (Stack Auth)
- [ ] Canvas save/load from database
- [ ] Gallery with filtering
- [ ] Profile settings
- [ ] Export canvas (PNG, SVG, JSON)

### Phase 3: Collaboration (Planned)
- [ ] Real-time multiplayer editing
- [ ] Cursor presence indicators
- [ ] Comments and annotations
- [ ] Share canvas with permissions
- [ ] Version history

### Phase 4: Advanced Features (Future)
- [ ] Canvas templates
- [ ] AI-assisted drawing tools
- [ ] Custom animation builder
- [ ] Team workspaces
- [ ] Analytics dashboard

---

## 🐛 Recent Fixes & Improvements

### Latest Update (October 15, 2025)
- ✅ Fixed Fabric.js loading issues by hosting locally
- ✅ Created custom textBaseline patch for browser compatibility
- ✅ Implemented full-screen canvas layout
- ✅ Added comprehensive error handling and retry logic
- ✅ Improved loading states with spinner
- ✅ Added vendor directory with documentation
- ✅ Optimized canvas resize behavior

---

## 📖 Documentation

- **Canvas & Animations**: `.cursor/rules/canvas-animations.mdc`
- **State Management**: `.cursor/rules/state-management.mdc`
- **Database Patterns**: `.cursor/rules/database-patterns.mdc`
- **Deployment Guide**: `.cursor/rules/deployment.mdc`
- **Authentication**: `.cursor/rules/authentication.mdc`

---

## 🔗 Resources

- [Fabric.js Docs](http://fabricjs.com/docs/)
- [Anime.js Docs](https://animejs.com/documentation/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [Stack Auth](https://docs.stack-auth.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Neon Database](https://neon.tech/docs)

---

## 📄 License

MIT

---

## 👥 Team

[Add your team information here]

---

**Last Updated**: October 15, 2025
**Status**: Active Development
**Version**: 0.1.0

