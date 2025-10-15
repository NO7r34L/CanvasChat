# CanvasChat HTML Screens

Complete set of HTML screens for the CanvasChat application, ready for conversion to React components.

## Structure

```
screens/
├── public/           # Unauthenticated screens
│   ├── landing.html  # Marketing landing page
│   ├── login.html    # Sign in page
│   └── signup.html   # Sign up page
├── logged-in/        # Authenticated screens
│   ├── canvas.html   # Main canvas workspace
│   ├── gallery.html  # User's canvas gallery
│   └── profile.html  # User profile & settings
└── shared/
    └── styles.css    # Shared CSS variables & utilities
```

## Public Screens

### 1. Landing Page (`public/landing.html`)
**Route:** `/`

**Features:**
- Hero section with CTA buttons
- Features grid (6 features)
- Call-to-action section
- Footer
- Responsive design
- Brand gradient colors

**Navigation:**
- Sign In → `login.html`
- Get Started → `signup.html`

---

### 2. Login Page (`public/login.html`)
**Route:** `/login`

**Features:**
- Email/password login form
- OAuth buttons (GitHub, Google)
- "Forgot password?" link
- "Sign up" link for new users
- Centered card layout
- Form validation

**Actions:**
- Sign in → `../logged-in/canvas.html`
- OAuth → `../logged-in/canvas.html`
- Sign up → `signup.html`
- Back to home → `landing.html`

---

### 3. Signup Page (`public/signup.html`)
**Route:** `/signup`

**Features:**
- Email/password signup form
- OAuth buttons (GitHub, Google)
- Full name field
- Terms of service acceptance
- "Sign in" link for existing users
- Password strength requirements

**Actions:**
- Create account → `../logged-in/canvas.html`
- OAuth → `../logged-in/canvas.html`
- Sign in → `login.html`
- Back to home → `landing.html`

---

## Logged-In Screens

### 4. Canvas Workspace (`logged-in/canvas.html`)
**Route:** `/canvas`

**Features:**
- Full Fabric.js canvas (1000x600)
- Left sidebar with tools:
  - Tool selection (select, draw, text, shape, erase)
  - Color picker with hex input
  - Brush width slider (1-50px)
  - Animation toggle & duration
  - Undo/redo/clear actions
- Right sidebar with animation presets:
  - Pulse, Bounce, Shake, Rotate, Scale
  - Delete object
  - Contextual (shows only when object selected)
- Header with logo, user profile
- Download/share buttons
- Real-time canvas with Anime.js animations

**Dependencies:**
- Fabric.js v6.7.1 (CDN)
- Anime.js v4.2.2 (CDN)

**State:**
- Tool selection
- Brush color & width
- Animation settings
- Selected objects

---

### 5. Gallery (`logged-in/gallery.html`)
**Route:** `/gallery`

**Features:**
- Grid layout of user's canvases
- Filter buttons (All, Recent, Favorites, Shared)
- Canvas cards with:
  - Thumbnail preview
  - Title
  - Last modified date
  - Quick actions menu
- "New Canvas" button
- Empty state for new users
- Hover effects

**Sample Data:**
- 6 example canvases with dates
- Icons for visual interest

**Actions:**
- Click canvas → `canvas.html`
- New Canvas → `canvas.html`
- Filter by category

---

### 6. Profile Settings (`logged-in/profile.html`)
**Route:** `/profile`

**Features:**
- Profile information section:
  - Avatar with initials
  - Display name (editable)
  - Email (read-only)
  - Change avatar button
- Preferences section (toggles):
  - Enable Animations
  - Auto-Save
  - Grid Snap
  - Email Notifications
- Security section:
  - Change password
  - Two-factor authentication
  - Active sessions management
- Danger zone:
  - Delete account (with confirmation)

**State:**
- Form fields
- Toggle switches
- User profile data

---

## Shared Assets

### Styles (`shared/styles.css`)

**CSS Variables:**
```css
--primary-color: #FF4A04
--primary-hover: #FF6B35
--secondary-color: #FBAE41
--text-primary: #1a1a1a
--text-secondary: #666
--text-muted: #999
--border-color: #e5e5e5
--bg-primary: #ffffff
--bg-secondary: #f5f5f5
```

**Components:**
- Header with logo
- Buttons (primary, secondary, ghost, danger)
- Form inputs & labels
- User profile avatar
- Cards
- Toggle switches
- Utility classes (flex, spacing, sizing)

---

## Usage

### Viewing Screens

```bash
# Open any screen in browser
open screens/public/landing.html
open screens/public/login.html
open screens/logged-in/canvas.html
```

### Navigation Flow

```
Landing → Sign Up → Canvas
Landing → Sign In → Canvas
Canvas → Gallery (header nav)
Canvas → Profile (user menu)
Gallery → Canvas (new/open canvas)
Profile → Canvas (back)
```

---

## Authentication Integration

All auth screens use placeholder functions that should be replaced with **Stack Auth**:

```javascript
// Login
function signInWithGitHub() {
  // Replace with: stackClientApp.signInWithOAuth('github')
}

// Signup
function signUpWithGoogle() {
  // Replace with: stackClientApp.signUpWithOAuth('google')
}

// Logout (profile menu)
function logout() {
  // Replace with: await user.signOut()
}
```

---

## Canvas Integration

The canvas screen uses:

- **Fabric.js** for canvas rendering and object manipulation
- **Anime.js** for smooth 60fps animations
- All animation utilities from `src/lib/canvas-utils.ts`
- All state management from `src/stores/canvas-store.ts`

---

## React Conversion Notes

When converting to React components:

1. **Shared styles** → Convert to Tailwind classes
2. **State** → Use Zustand stores (already created)
3. **Forms** → Use React Hook Form + Zod validation
4. **Canvas** → Use existing `src/components/canvas-*.tsx`
5. **Auth** → Use existing Stack Auth setup
6. **Navigation** → Use Next.js Link and useRouter

---

## Design System

**Colors:**
- Primary: Orange gradient (#FF4A04 → #FF6B35)
- Secondary: Yellow (#FBAE41)
- Neutral grays for text and backgrounds

**Typography:**
- System font stack
- Bold weights for headings
- Clean, modern aesthetic

**Spacing:**
- Consistent 0.5rem increments
- Cards with 1.5-2rem padding
- Generous whitespace

**Shadows:**
- Subtle: 0 2px 8px rgba(0,0,0,0.05)
- Medium: 0 4px 12px rgba(0,0,0,0.1)
- Large: 0 8px 24px rgba(0,0,0,0.15)

---

## Next Steps

1. Review all screens in browser
2. Test all navigation flows
3. Verify responsive design
4. Convert to React components
5. Integrate with Stack Auth
6. Connect to Neon database
7. Deploy to Cloudflare Workers

