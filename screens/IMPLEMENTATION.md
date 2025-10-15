# CanvasChat - HTML to React Implementation Plan

## Overview

Complete set of production-ready HTML screens for the CanvasChat application. All screens are fully functional, styled, and ready for conversion to React components.

## Files Created

```
screens/
├── index.html              # Visual navigator for all screens
├── README.md               # Comprehensive screen documentation
├── IMPLEMENTATION.md       # This file - implementation guide
├── public/
│   ├── landing.html        # Marketing landing page
│   ├── login.html          # Sign in (email + OAuth)
│   └── signup.html         # Registration (email + OAuth)
├── logged-in/
│   ├── canvas.html         # Main canvas workspace (Fabric.js + Anime.js)
│   ├── gallery.html        # User's canvas gallery
│   └── profile.html        # Profile & settings
└── shared/
    └── styles.css          # Shared CSS variables & components
```

## Screen Summary

### Public Screens (3)

| Screen | Route | Status | Key Features |
|--------|-------|--------|--------------|
| Landing | `/` | Complete | Hero, 6 features, CTA, footer |
| Login | `/login` | Complete | Email/password, GitHub, Google OAuth |
| Signup | `/signup` | Complete | Email/password, GitHub, Google OAuth |

### Logged-In Screens (3)

| Screen | Route | Status | Key Features |
|--------|-------|--------|--------------|
| Canvas | `/canvas` | Complete | Fabric.js canvas, 5 tools, animations, undo/redo |
| Gallery | `/gallery` | Complete | Grid layout, filters, thumbnails, empty state |
| Profile | `/profile` | Complete | Profile info, preferences, security, danger zone |

## Implementation Roadmap

### Phase 1: Component Architecture Setup

1. **Create Base Layout Components**
   - `AppHeader.tsx` - Global header with logo, nav, user menu
   - `AuthLayout.tsx` - Centered card layout for auth screens
   - `DashboardLayout.tsx` - Full-height layout for logged-in screens
   - `Footer.tsx` - Global footer

2. **Create Shared UI Components**
   - Update existing Shadcn components as needed
   - Create `Avatar.tsx` component
   - Create `ToggleSwitch.tsx` component
   - Create `CanvasCard.tsx` for gallery items

3. **Set Up Route Structure**
   ```typescript
   src/app/
   ├── page.tsx                    # Landing (or redirect to /canvas)
   ├── login/page.tsx              # Login screen
   ├── signup/page.tsx             # Signup screen
   └── (dashboard)/
       ├── canvas/page.tsx         # Canvas workspace
       ├── gallery/page.tsx        # Gallery
       └── profile/page.tsx        # Profile settings
   ```

### Phase 2: Public Screens Conversion

#### Landing Page (`src/app/page.tsx`)

```typescript
// Structure
- Hero component with gradient background
- Features grid (6 cards)
- CTA section
- Footer

// State: None (static marketing page)
// Auth: Redirect to /canvas if logged in

// Components to create:
- HeroSection.tsx
- FeatureCard.tsx
- CTASection.tsx
```

#### Login (`src/app/login/page.tsx`)

```typescript
// Structure
- Centered card with AuthLayout
- OAuth buttons (GitHub, Google)
- Email/password form
- Link to signup

// State: Form state (React Hook Form)
// Auth: Stack Auth signIn methods

// Integration:
import { useStackApp } from "@stackframe/stack";

const signInWithGitHub = async () => {
  await stackApp.signInWithOAuth('github');
};

const signInWithGoogle = async () => {
  await stackApp.signInWithOAuth('google');
};

const handleEmailLogin = async (data) => {
  await stackApp.signInWithCredential({
    email: data.email,
    password: data.password
  });
};
```

#### Signup (`src/app/signup/page.tsx`)

```typescript
// Structure
- Centered card with AuthLayout
- OAuth buttons (GitHub, Google)
- Email/password/name form
- Terms acceptance checkbox
- Link to login

// State: Form state (React Hook Form + Zod)
// Auth: Stack Auth signUp methods

// Form Schema:
const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});
```

### Phase 3: Canvas Workspace Conversion

#### Canvas Page (`src/app/(dashboard)/canvas/page.tsx`)

This screen already has most components built! Just need to integrate:

```typescript
// Use existing components:
import { CanvasPage } from "@/components/canvas-page";

export default async function CanvasRoute() {
  const user = await stackServerApp.getUser({ or: "redirect" });
  return <CanvasPage />;
}

// Existing components:
- canvas-chat.tsx (main canvas with Fabric.js)
- canvas-toolbar.tsx (left sidebar with tools)
- canvas-animations.tsx (right sidebar with presets)
- canvas-page.tsx (orchestrates layout)

// State already managed by:
- useCanvasStore() from @/stores/canvas-store
```

**Minor updates needed:**
1. Add header with user profile to `canvas-page.tsx`
2. Add "My Gallery" navigation button
3. Add download/share buttons
4. Integrate with backend for canvas persistence

### Phase 4: Gallery Conversion

#### Gallery Page (`src/app/(dashboard)/gallery/page.tsx`)

```typescript
// Structure
- DashboardLayout with header
- Filter buttons (All, Recent, Favorites, Shared)
- Grid of canvas cards
- Empty state for new users

// State: TanStack Query for canvas list
// Store: Zustand for filter selection

// API Route to create:
// GET /api/canvas/list
interface Canvas {
  id: string;
  title: string;
  thumbnail: string;
  updatedAt: Date;
  userId: string;
}

// Hook to create:
// src/hooks/use-canvas-list.ts
export const useCanvasList = () => {
  return useQuery({
    queryKey: ['canvases'],
    queryFn: async () => {
      const res = await fetch('/api/canvas/list');
      return res.json();
    }
  });
};

// Components to create:
- CanvasCard.tsx (thumbnail, title, date, actions)
- EmptyState.tsx (for new users)
- FilterBar.tsx (filter buttons)
```

### Phase 5: Profile Settings Conversion

#### Profile Page (`src/app/(dashboard)/profile/page.tsx`)

```typescript
// Structure
- DashboardLayout with header
- Profile information section (avatar, name, email)
- Preferences section (4 toggles)
- Security section (password, 2FA, sessions)
- Danger zone (delete account)

// State: 
- TanStack Query for user profile
- React Hook Form for profile updates
- Zustand for preference toggles (if not persisted)

// API Routes to create:
// GET /api/user/profile (already exists!)
// PATCH /api/user/profile
// POST /api/user/change-password
// DELETE /api/user/account

// Components to create:
- ProfileHeader.tsx (avatar + info)
- PreferenceToggle.tsx (reusable toggle with label)
- SecuritySection.tsx
- DangerZone.tsx
```

### Phase 6: Backend Integration

#### Database Schema Updates

```typescript
// Add to src/lib/db/schema.ts

export const canvases = pgTable('canvases', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  data: jsonb('data').notNull(), // Fabric.js JSON
  thumbnail: text('thumbnail'), // Base64 or URL
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userPreferences = pgTable('user_preferences', {
  userId: text('user_id').primaryKey(),
  enableAnimations: boolean('enable_animations').default(true),
  autoSave: boolean('auto_save').default(true),
  gridSnap: boolean('grid_snap').default(false),
  emailNotifications: boolean('email_notifications').default(false),
});
```

#### API Routes to Create

```typescript
// Canvas CRUD
POST   /api/canvas/create      - Create new canvas
GET    /api/canvas/list        - List user's canvases
GET    /api/canvas/[id]        - Get canvas by ID
PATCH  /api/canvas/[id]        - Update canvas
DELETE /api/canvas/[id]        - Delete canvas
POST   /api/canvas/[id]/share  - Share canvas

// User preferences
GET    /api/user/preferences   - Get user preferences
PATCH  /api/user/preferences   - Update preferences

// User profile (already started)
GET    /api/user/profile       - Get profile ✓
PATCH  /api/user/profile       - Update profile
POST   /api/user/change-password
DELETE /api/user/account
```

### Phase 7: State Management Integration

#### Canvas State (Already Complete)

```typescript
// src/stores/canvas-store.ts ✓
- Canvas instance
- Active tool
- Brush color/width
- Animation settings
- Selected object
- History (undo/redo)
```

#### UI State (Already Complete)

```typescript
// src/stores/ui-store.ts ✓
- Sidebar open/closed
- Modal states
- Theme preferences
```

#### New Stores to Create

```typescript
// src/stores/gallery-store.ts
interface GalleryState {
  filter: 'all' | 'recent' | 'favorites' | 'shared';
  setFilter: (filter: string) => void;
  sortBy: 'date' | 'name';
  setSortBy: (sort: string) => void;
}

// src/stores/profile-store.ts (optional - might use React Hook Form instead)
interface ProfileState {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}
```

### Phase 8: Authentication Flow

#### Protected Routes

```typescript
// src/middleware.ts
import { stackServerApp } from "@/lib/stack/server";

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser();
  
  // Redirect logged-in users away from auth pages
  if (user && isAuthPage(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/canvas', request.url));
  }
  
  // Redirect logged-out users to login
  if (!user && isProtectedPage(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/canvas/:path*', '/gallery/:path*', '/profile/:path*', '/login', '/signup']
};
```

#### User Menu Component

```typescript
// src/components/user-menu.tsx
"use client";

import { useUser } from "@stackframe/stack";

export function UserMenu() {
  const user = useUser();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="user-profile">
          <Avatar>
            <AvatarFallback>
              {user.displayName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user.displayName}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => user.signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Phase 9: Canvas Persistence

#### Auto-Save Implementation

```typescript
// In canvas-chat.tsx
import { useMutation } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";

const saveCanvas = useMutation({
  mutationFn: async (data: { id: string; data: object }) => {
    const res = await fetch(`/api/canvas/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ data: data.data })
    });
    return res.json();
  }
});

// Auto-save on canvas changes (debounced)
useEffect(() => {
  if (!canvas || !canvasId) return;
  
  const handleChange = () => {
    const json = canvas.toJSON();
    saveCanvas.mutate({ id: canvasId, data: json });
  };
  
  const debouncedSave = debounce(handleChange, 1000);
  
  canvas.on('object:modified', debouncedSave);
  canvas.on('object:added', debouncedSave);
  canvas.on('object:removed', debouncedSave);
  
  return () => {
    canvas.off('object:modified', debouncedSave);
    canvas.off('object:added', debouncedSave);
    canvas.off('object:removed', debouncedSave);
  };
}, [canvas, canvasId]);
```

### Phase 10: Polish & Features

1. **Loading States**
   - Skeleton loaders for gallery
   - Canvas loading spinner
   - Form submission states

2. **Error Handling**
   - Toast notifications (Sonner)
   - Error boundaries
   - Network error recovery

3. **Animations**
   - Page transitions
   - Card hover effects
   - Tool selection feedback

4. **Responsive Design**
   - Mobile canvas controls
   - Collapsible sidebars
   - Touch gestures

5. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - Focus management
   - ARIA labels

## Conversion Checklist

### Public Screens
- [ ] Landing page component
- [ ] Login page with Stack Auth
- [ ] Signup page with Stack Auth
- [ ] OAuth integration (GitHub, Google)
- [ ] Form validation with Zod

### Canvas Workspace
- [x] Canvas component (already exists)
- [x] Toolbar component (already exists)
- [x] Animation controls (already exists)
- [ ] Add header with user menu
- [ ] Canvas persistence API
- [ ] Auto-save implementation
- [ ] Thumbnail generation

### Gallery
- [ ] Gallery page component
- [ ] Canvas card component
- [ ] Filter bar component
- [ ] Empty state component
- [ ] Canvas list API hook
- [ ] Canvas deletion

### Profile
- [ ] Profile page component
- [ ] Profile header with avatar
- [ ] Preference toggles
- [ ] Security settings
- [ ] Password change flow
- [ ] Account deletion flow

### Backend
- [ ] Canvas CRUD API routes
- [ ] User preferences API routes
- [ ] Database schema migration
- [ ] Canvas thumbnails storage
- [ ] User profile updates

### Infrastructure
- [ ] Middleware for auth
- [ ] Error boundaries
- [ ] Loading states
- [ ] Toast notifications
- [ ] Responsive design
- [ ] Accessibility audit

## Testing Strategy

1. **Unit Tests**
   - Canvas utilities
   - Animation functions
   - Form validation schemas

2. **Integration Tests**
   - Auth flows (login, signup, logout)
   - Canvas CRUD operations
   - Gallery filtering

3. **E2E Tests**
   - User registration → create canvas → save
   - Login → view gallery → edit canvas
   - Profile settings updates

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Stack Auth domains configured
- [ ] Cloudflare Workers deployment
- [ ] Performance optimization
- [ ] Security headers
- [ ] Analytics integration
- [ ] Error monitoring (Sentry)

## Timeline Estimate

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Architecture | 1 day | Not started |
| Phase 2: Public Screens | 2 days | Not started |
| Phase 3: Canvas Integration | 1 day | 80% complete |
| Phase 4: Gallery | 2 days | Not started |
| Phase 5: Profile | 1 day | Not started |
| Phase 6: Backend | 3 days | Not started |
| Phase 7: State Management | 1 day | 60% complete |
| Phase 8: Authentication | 2 days | 40% complete |
| Phase 9: Persistence | 2 days | Not started |
| Phase 10: Polish | 3 days | Not started |
| **Total** | **18 days** | **~30% complete** |

## Resources

- [Stack Auth Docs](https://docs.stack-auth.com)
- [Fabric.js Docs](http://fabricjs.com/docs)
- [Anime.js Docs](https://animejs.com/documentation)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM Docs](https://orm.drizzle.team)

## Notes

- All HTML screens are production-ready and can be viewed at `screens/index.html`
- Canvas workspace has the most complete React implementation
- Focus on backend integration after converting remaining screens
- Consider adding real-time collaboration features in future

