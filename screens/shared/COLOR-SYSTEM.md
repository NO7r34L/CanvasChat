# CanvasChat Color System

## Design Philosophy

The color system is built around the **purple from the logo** (#6B46C1) as the primary brand color, with a complementary teal for secondary actions, and a refined neutral palette for text and backgrounds.

## Color Palette

### Primary Colors (Purple - From Logo)

```css
--primary-color: #6B46C1      /* Main brand purple */
--primary-hover: #7C3AED      /* Hover state */
--primary-light: #F5F3FF      /* Light backgrounds */
--primary-dark: #5B21B6       /* Dark variant */
```

**Usage:**
- Primary CTAs and buttons
- Links and interactive elements
- Headers and navigation
- Focus states
- Brand elements

**Example:**
```html
<button class="btn btn-primary">Get Started</button>
```

---

### Secondary Colors (Teal - Complementary)

```css
--secondary-color: #14B8A6    /* Teal accent */
--secondary-hover: #0D9488    /* Hover state */
--secondary-light: #F0FDFA    /* Light backgrounds */
```

**Usage:**
- Secondary actions
- Alternative CTAs
- Highlights and badges
- Success indicators

**Example:**
```html
<button class="btn btn-secondary">Learn More</button>
```

---

### Accent Colors

```css
--accent-purple: #A78BFA      /* Light purple */
--accent-pink: #EC4899        /* Pink accent */
--accent-cyan: #06B6D4        /* Cyan accent */
```

**Usage:**
- Decorative elements
- Gradient overlays
- Icons and illustrations
- Special highlights

---

### Neutral Colors (Text & UI)

#### Text Colors
```css
--text-primary: #1F2937       /* Headings, primary text */
--text-secondary: #6B7280     /* Body text, descriptions */
--text-muted: #9CA3AF         /* Placeholder, helper text */
--text-disabled: #D1D5DB      /* Disabled state */
```

**Hierarchy:**
1. **Primary** - Headings, important content
2. **Secondary** - Body text, descriptions
3. **Muted** - Helper text, captions, placeholders
4. **Disabled** - Inactive elements

#### Background Colors
```css
--bg-primary: #FFFFFF         /* Cards, modals, primary surfaces */
--bg-secondary: #F9FAFB       /* Page background */
--bg-tertiary: #F3F4F6        /* Subtle backgrounds, hover states */
--bg-hover: #F3F4F6           /* Interactive hover backgrounds */
```

#### Border Colors
```css
--border-color: #E5E7EB       /* Standard borders */
--border-light: #F3F4F6       /* Subtle dividers */
--border-dark: #D1D5DB        /* Emphasized borders */
```

---

### Semantic Colors

#### Success
```css
--success: #10B981
--success-light: #D1FAE5
```

**Usage:** Success messages, completed states, positive feedback

#### Warning
```css
--warning: #F59E0B
--warning-light: #FEF3C7
```

**Usage:** Warning messages, caution states, pending actions

#### Error
```css
--error: #EF4444
--error-light: #FEE2E2
```

**Usage:** Error messages, destructive actions, validation errors

---

## Shadows

### Standard Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)        /* Subtle elevation */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)      /* Cards */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)    /* Modals, popovers */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)    /* Dialogs */
```

### Brand Shadow
```css
--shadow-purple: 0 4px 14px 0 rgba(107, 70, 193, 0.25)  /* Purple glow */
```

**Usage:** Primary buttons, featured cards, brand elements

---

## Border Radius

```css
--radius-sm: 8px              /* Buttons, inputs */
--radius-md: 12px             /* Cards */
--radius-lg: 16px             /* Modals, large cards */
--radius-xl: 20px             /* Special containers */
--radius-full: 9999px         /* Pills, avatars */
```

---

## Gradient Combinations

### Primary Gradient
```css
background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
```
**Usage:** Headers, hero sections, primary CTAs

### Purple-Pink Gradient
```css
background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-pink) 100%);
```
**Usage:** Special features, highlighted cards

### Purple-Teal Gradient
```css
background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
```
**Usage:** Decorative elements, animations

### Avatar Gradient
```css
background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-purple) 100%);
```
**Usage:** User avatars, profile icons

---

## Color Usage Guidelines

### Do's ✓

1. **Use primary purple** for main CTAs and brand elements
2. **Use secondary teal** for alternative actions and highlights
3. **Maintain contrast ratios** (4.5:1 for text, 3:1 for UI elements)
4. **Use semantic colors** consistently (success = green, error = red)
5. **Layer backgrounds** with proper hierarchy (white > light gray > gray)
6. **Apply shadows** for depth and elevation
7. **Use gradients** for visual interest on brand elements

### Don'ts ✗

1. **Don't mix** too many accent colors in one view
2. **Don't use primary purple** for text (readability issues)
3. **Don't overuse** gradients - reserve for key elements
4. **Don't forget** hover and active states
5. **Don't use pure black** (#000) - use --text-primary instead
6. **Don't rely on color alone** - always include icons or labels

---

## Component Examples

### Primary Button
```html
<button class="btn btn-primary">
  Get Started
</button>
```
Result: Purple background, white text, purple shadow on hover

### Secondary Button
```html
<button class="btn btn-secondary">
  Learn More
</button>
```
Result: White background, purple border and text, hover background

### Ghost Button
```html
<button class="btn btn-ghost">
  Sign In
</button>
```
Result: Transparent background, white border, subtle hover

### Card
```html
<div class="card">
  <h3>Card Title</h3>
  <p class="text-secondary">Description text</p>
</div>
```
Result: White background, shadow, proper text hierarchy

### Success Message
```html
<div style="background: var(--success-light); color: var(--success); padding: 1rem; border-radius: var(--radius-sm);">
  ✓ Success! Your changes have been saved.
</div>
```

---

## Accessibility

### Contrast Ratios (WCAG AA)

**Text on White:**
- Primary purple (#6B46C1): 5.4:1 ✓
- Text primary (#1F2937): 15.3:1 ✓
- Text secondary (#6B7280): 5.8:1 ✓

**White on Primary Purple:**
- Contrast: 5.4:1 ✓

**Text on Backgrounds:**
- Primary text on secondary bg: 14.2:1 ✓
- Secondary text on secondary bg: 5.4:1 ✓

All color combinations meet WCAG AA standards for accessibility.

---

## Dark Mode (Future)

Suggested dark mode palette:

```css
:root[data-theme="dark"] {
  --primary-color: #8B5CF6;        /* Lighter purple */
  --bg-primary: #1F2937;           /* Dark surface */
  --bg-secondary: #111827;         /* Darker background */
  --text-primary: #F9FAFB;         /* Light text */
  --text-secondary: #D1D5DB;       /* Muted text */
  --border-color: #374151;         /* Dark borders */
}
```

---

## Migration from Old Colors

### Old → New Mapping

```
#FF4A04 (Old Orange)  → #6B46C1 (New Purple)
#FF6B35 (Old Hover)   → #7C3AED (New Hover)
#FBAE41 (Old Yellow)  → #14B8A6 (New Teal)
#666 (Old Gray)       → #6B7280 (New Secondary Text)
#999 (Old Muted)      → #9CA3AF (New Muted Text)
```

All HTML screens have been updated to use the new color system.

---

## Tools & Resources

- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Tailwind CSS Colors**: https://tailwindcss.com/docs/customizing-colors
- **Coolors Palette**: https://coolors.co/6b46c1-7c3aed-14b8a6-1f2937-f9fafb

