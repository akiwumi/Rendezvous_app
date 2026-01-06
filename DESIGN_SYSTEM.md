# Rendezvous Social Club Design System

A comprehensive design system for the Rendezvous social media mobile app, inspired by the Mallorca Rendezvous brand identity and modern mobile app interfaces.

## Overview

This design system provides a cohesive set of design tokens, components, and guidelines to ensure consistency across the Rendezvous mobile application.

## Color Palette

### Primary Brand Colors

The color scheme is inspired by the Mallorca Rendezvous logo, featuring sophisticated metallic gold and dark olive green tones.

- **Gold**: `#D4AF37` - Primary brand color, used for accents, buttons, and highlights
- **Gold Light**: `#E5C158` - Lighter variant for hover states and highlights
- **Gold Dark**: `#B8941F` - Darker variant for depth and shadows
- **Olive**: `#556B2F` - Dark olive green for backgrounds and dark sections
- **Olive Light**: `#6B8E3A` - Lighter olive variant
- **Olive Dark**: `#3D4F21` - Darker olive for depth

### UI Colors

- **Background Primary**: `#FFFFFF` - Main white background
- **Background Secondary**: `#F8F9FA` - Light grey for cards
- **Background Tertiary**: `#E9ECEF` - Subtle grey for dividers
- **Text Primary**: `#1A1A1A` - Main dark text
- **Text Secondary**: `#6C757D` - Secondary grey text
- **Interactive Blue**: `#007AFF` - For profile icons and links
- **Notification Red**: `#FF3B30` - For notification badges

## Typography

### Font Sizes

- **XS**: 12px - Captions, labels
- **SM**: 14px - Small body text
- **Base**: 16px - Default body text
- **LG**: 18px - Large body text
- **XL**: 20px - Small headings
- **2XL**: 24px - Medium headings
- **3XL**: 30px - Large headings
- **4XL**: 36px - Extra large headings
- **5XL**: 48px - Display text

### Font Weights

- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

### Text Styles

Predefined text style combinations for consistent typography:

- **H1**: 36px, Bold (700), for main headings
- **H2**: 30px, Bold (700), for section headings
- **H3**: 24px, Semibold (600), for subsection headings
- **H4**: 20px, Semibold (600), for card headings
- **Body**: 16px, Normal (400), for body text
- **Body Small**: 14px, Normal (400), for secondary text
- **Caption**: 12px, Normal (400), for captions and metadata
- **Label**: 14px, Semibold (600), for form labels

## Spacing

Consistent spacing scale for padding and margins:

- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **2XL**: 48px
- **3XL**: 64px

## Border Radius

- **None**: 0px
- **SM**: 4px
- **MD**: 8px
- **LG**: 12px
- **XL**: 16px
- **2XL**: 24px
- **Full**: 9999px (for circles)

## Shadows

Elevation system for depth and hierarchy:

- **SM**: Subtle shadow for cards
- **MD**: Medium shadow for elevated cards
- **LG**: Large shadow for modals
- **XL**: Extra large shadow for overlays

## Layout Guidelines

### Screen Structure

- **Screen Padding**: 16px horizontal, 16px vertical
- **Card Padding**: 16px horizontal, 12px vertical
- **Header Height**: 56px
- **Navigation Height**: 56px

### Component Sizes

#### Avatars
- Small: 32px
- Medium: 40px
- Large: 56px
- Extra Large: 80px

#### Icons
- Small: 16px
- Medium: 24px
- Large: 32px
- Extra Large: 48px

#### Buttons
- Small: 36px height
- Medium: 44px height
- Large: 52px height

#### Daily Content Cards
- Width: 120px
- Height: 160px
- Border radius: 16px (top corners)

#### Feed Images
- Aspect ratio: 1:1 (square) or adjust as needed
- Border radius: 12px

## Component Styles

### Buttons

#### Primary Button
- Background: Gold (`#D4AF37`)
- Text: White
- Border radius: 8px
- Padding: 24px horizontal, 12px vertical
- Font weight: Semibold (600)

#### Secondary Button
- Background: Transparent
- Text: Gold
- Border: 1px solid gold
- Border radius: 8px
- Padding: 24px horizontal, 12px vertical
- Font weight: Semibold (600)

#### Outline Button
- Background: Transparent
- Text: Dark
- Border: 1px solid light grey
- Border radius: 8px
- Padding: 24px horizontal, 12px vertical
- Font weight: Medium (500)

### Cards

#### Default Card
- Background: White
- Border radius: 12px
- Padding: 16px
- Shadow: Medium elevation

#### Daily Content Card
- Background: White
- Border radius: 16px (top corners)
- Width: 120px
- Height: 160px
- Overflow: Hidden

#### Feed Card
- Background: White
- Border radius: 0px
- Margin bottom: 1px (for separation)

### Badges

#### Notification Badge
- Background: Red (`#FF3B30`)
- Text: White
- Border radius: 12px
- Padding: 6px horizontal, 2px vertical
- Font size: 10px
- Font weight: Semibold (600)
- Min width: 18px
- Height: 18px

#### Status Badge
- Background: Gold (`#D4AF37`)
- Text: White
- Border radius: 8px
- Padding: 8px horizontal, 4px vertical
- Font size: 12px
- Font weight: Semibold (600)

### Avatars

- Background: Blue (`#007AFF`)
- Border radius: Full (circle)
- Text: White
- Font weight: Semibold (600)
- Centered text

### Inputs

#### Default Input
- Background: Light grey (`#F8F9FA`)
- Border: 1px solid light grey (`#E9ECEF`)
- Border radius: 8px
- Padding: 16px horizontal, 12px vertical
- Font size: 16px
- Text color: Dark (`#1A1A1A`)

#### Focused Input
- Border: 2px solid gold (`#D4AF37`)

#### Error Input
- Border: 1px solid red (`#DC3545`)

## Animations

### Duration
- Fast: 150ms
- Normal: 300ms
- Slow: 500ms

### Easing
- Ease In: `ease-in`
- Ease Out: `ease-out`
- Ease In Out: `ease-in-out`

## Breakpoints

Responsive design breakpoints:

- **SM**: 375px (iPhone SE)
- **MD**: 414px (iPhone Plus)
- **LG**: 768px (iPad)
- **XL**: 1024px (iPad Pro)

## Usage Examples

### React Native Example

```typescript
import { colors, spacing, typography, borderRadius } from './design-system';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing.md,
  },
  title: {
    ...typography.styles.h1,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary.gold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    ...typography.styles.label,
    color: colors.text.inverse,
  },
});
```

### Web Example (CSS Variables)

```css
:root {
  --color-gold: #D4AF37;
  --color-olive: #556B2F;
  --spacing-md: 16px;
  --border-radius-md: 8px;
}

.button {
  background-color: var(--color-gold);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}
```

## Design Principles

1. **Elegance**: Inspired by the sophisticated Mallorca Rendezvous brand
2. **Clarity**: Clean, modern interface with clear hierarchy
3. **Consistency**: Unified design language across all components
4. **Accessibility**: Sufficient contrast ratios and readable text sizes
5. **Mobile-First**: Optimized for mobile devices with touch-friendly targets

## Accessibility

- Minimum touch target size: 44x44px
- Text contrast ratio: WCAG AA compliant (4.5:1 for normal text, 3:1 for large text)
- Color is not the only indicator of state or importance

## Updates

This design system is a living document and will be updated as the app evolves. All changes should maintain consistency with the brand identity and user experience goals.

