# CanvasChat Logo Usage Guide

## Logo Assets

Two logo files are provided for different use cases:

### 1. Standalone Icon (`CanvasChat.logo.png`)
- **Dimensions**: Square format (rounded corners)
- **Design**: Purple canvas easel with chat bubble
- **Use Cases**:
  - Favicon (browser tab icon)
  - Mobile app icon
  - Social media profile pictures
  - Small UI elements
  - Auth card headers

### 2. Full Logo with Text (`CanvasChat.logowithtext.png`)
- **Dimensions**: Horizontal format
- **Design**: Icon + "CanvasChat" text wordmark
- **Use Cases**:
  - Website headers
  - Marketing materials
  - Email signatures
  - Documentation headers
  - Footer branding

## Current Implementation

### Public Screens

#### Landing Page (`public/landing.html`)
- **Header**: Full logo with text (40px height)
- **Footer**: Full logo with text (32px height, white inverted)
- **Favicon**: Standalone icon

#### Login Page (`public/login.html`)
- **Auth Card**: Standalone icon (64px height)
- **Favicon**: Standalone icon

#### Signup Page (`public/signup.html`)
- **Auth Card**: Standalone icon (64px height)
- **Favicon**: Standalone icon

### Logged-In Screens

#### Canvas Workspace (`logged-in/canvas.html`)
- **Header**: Full logo with text (36px height, white inverted)
- **Favicon**: Standalone icon
- **Additional**: "My Gallery" navigation link added

#### Gallery (`logged-in/gallery.html`)
- **Header**: Full logo with text (36px height)
- **Favicon**: Standalone icon

#### Profile Settings (`logged-in/profile.html`)
- **Header**: Full logo with text (36px height)
- **Favicon**: Standalone icon

### Navigation & Index

#### Screen Navigator (`index.html`)
- **Hero**: Full logo with text (80px height, white inverted)
- **Favicon**: Standalone icon

#### Root Demo (`demo.html`)
- **Header**: Full logo with text (36px height, white inverted)
- **Favicon**: Standalone icon

## Logo Styling Examples

### Standard Header Logo
```html
<img src="../shared/assets/CanvasChat.logowithtext.png" 
     alt="CanvasChat" 
     style="height: 36px;">
```

### White Inverted Logo (Dark Backgrounds)
```html
<img src="../shared/assets/CanvasChat.logowithtext.png" 
     alt="CanvasChat" 
     style="height: 36px; filter: brightness(0) invert(1);">
```

### Auth Card Icon
```html
<img src="../shared/assets/CanvasChat.logo.png" 
     alt="CanvasChat Logo" 
     style="height: 64px;">
```

### Favicon
```html
<link rel="icon" type="image/png" href="../shared/assets/CanvasChat.logo.png">
```

## Logo Colors

The purple color in the logo complements the existing brand colors:

- **Logo Purple**: #6B46C1 (approximate)
- **Primary Orange**: #FF4A04
- **Primary Orange Hover**: #FF6B35
- **Secondary Yellow**: #FBAE41

## Design Principles

1. **Consistency**: Always use the full logo with text in main headers
2. **Hierarchy**: Standalone icon for small spaces and favicons
3. **Contrast**: Use white inversion filter on dark backgrounds
4. **Sizing**: 
   - Large headers: 40-48px
   - Standard headers: 32-36px
   - Small/Footer: 24-32px
   - Auth cards: 64px
   - Favicons: Original size (auto-scaled by browser)

## Brand Guidelines

### Do's ✓
- Use full logo in headers and navigation
- Use standalone icon for favicons and small UI elements
- Maintain aspect ratio (never stretch)
- Use white inversion on dark backgrounds
- Ensure adequate spacing around logo

### Don'ts ✗
- Don't modify logo colors manually
- Don't add effects (shadows, glows, etc.)
- Don't rotate or skew the logo
- Don't place on busy backgrounds without contrast
- Don't use text from the logo separately

## React Component Example

When converting to React:

```typescript
// Logo component
export function Logo({ 
  variant = 'full', 
  size = 'md',
  inverted = false 
}: LogoProps) {
  const heights = {
    sm: '24px',
    md: '36px',
    lg: '48px',
    xl: '64px'
  };

  const src = variant === 'full' 
    ? '/assets/CanvasChat.logowithtext.png'
    : '/assets/CanvasChat.logo.png';

  return (
    <img 
      src={src}
      alt="CanvasChat"
      style={{
        height: heights[size],
        filter: inverted ? 'brightness(0) invert(1)' : undefined
      }}
    />
  );
}

// Usage
<Logo variant="full" size="md" inverted />  // Header
<Logo variant="icon" size="xl" />            // Auth card
```

## Asset Locations

```
/
├── CanvasChat.logo.png              # Root (for demo.html)
├── CanvasChat.logowithtext.png      # Root (for demo.html)
└── screens/
    └── shared/
        └── assets/
            ├── CanvasChat.logo.png           # Screens folder
            └── CanvasChat.logowithtext.png   # Screens folder
```

## Future Considerations

When moving to production:

1. **Optimize Images**: Consider WebP format for better compression
2. **SVG Version**: Create SVG versions for perfect scaling
3. **Dark Mode**: May need additional logo variants
4. **Social Cards**: Create OG image versions (1200x630px)
5. **App Icons**: Generate iOS/Android icon sets from standalone logo
6. **Brand Kit**: Expand with logo variations (monochrome, reversed, etc.)

## Accessibility

- All logo images include descriptive `alt` text: "CanvasChat" or "CanvasChat Logo"
- Adequate color contrast maintained in all contexts
- Logo never used as the only means of navigation (always accompanies text links)

## Questions?

For additional logo variations or brand assets, refer to the design team or create new versions following the established style guide.

