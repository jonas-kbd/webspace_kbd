# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static business website for KBD (Kassel Business Digital), a specialized consulting firm for process architectures. The site focuses on automation and efficiency solutions for businesses. The website is built with vanilla HTML, CSS, and JavaScript, using Tailwind CSS via CDN and self-hosted fonts for GDPR compliance.

## Architecture

### Design System

The site uses a centralized design system approach:

- **css/design-system.css**: Global styles, color system, typography, button components, form inputs, accessibility features, and mobile optimizations. This is the single source of truth for all styling.
- **js/components.js**: Unified JavaScript for navigation, modals (contact/newsletter), form submissions, and interactive components.
- **config.js**: Configuration file containing N8N webhook URLs. **This file is gitignored and contains sensitive data.**

### Key Design Patterns

1. **Component Reusability**: Navigation, footer, and modals use consistent markup across all HTML pages
2. **Mobile-First**: All styles start mobile and scale up with media queries
3. **Accessibility**: Enhanced focus states, keyboard navigation, screen reader support, and touch targets (min 44px)
4. **Performance**: Self-hosted fonts, lazy loading images, preconnect hints for external resources

### Page Structure

All pages follow this structure:
- Fixed navigation with scroll behavior (transparent → white background)
- Main content sections with consistent spacing
- Footer with newsletter signup
- Contact modal (triggered by CTA buttons throughout site)
- Newsletter modal (triggered from footer)

### Color System (CSS Variables)

```css
--kbd-blue: #071F36 (primary brand color)
--kbd-blue-hover: #0A2A4A
--rich-grey: #2D3748 (body text)
--soft-grey: #4A5563
--light-grey: #9CA3AF
--border-grey: #E1E5E9
--bg-grey: #F3F5F7
--white: #FFFFFF
--dark-bg: #020B14
```

## Development Workflow

### Editing Styles

- **Global changes**: Edit `css/design-system.css`
- **Page-specific styles**: Add to `<style>` tag in individual HTML files (only for truly page-specific needs)
- The design system includes: typography, buttons, forms, navigation, hero sections, modals, accessibility features

### Editing JavaScript

- **Global functionality**: Edit `js/components.js`
- **Page-specific scripts**: Add inline `<script>` tags only when necessary
- All functions are exposed globally via `window.functionName` for inline onclick handlers

### Form Submissions

Forms submit to N8N webhooks configured in `config.js`:
- Contact form: `N8N_CONTACT_WEBHOOK`
- Newsletter: `N8N_NEWSLETTER_WEBHOOK`
- Unsubscribe: `N8N_UNSUBSCRIBE_WEBHOOK`

All form handlers include:
- Honeypot field (`b_address`) for spam prevention
- Loading states during submission
- Success/error handling
- Data sent as JSON with metadata (timestamp, URL, type)

### Navigation Behavior

The header navigation has two states:
1. **Transparent** (at top): White text, inverted logo
2. **Scrolled** (>10px): White background, dark text, normal logo

Mobile menu toggle changes logo and button colors to match background.

## Important Conventions

### Button Classes

- `.btn-primary`: Main CTA (white text on blue)
- `.btn-white`: Secondary CTA on dark backgrounds
- `.btn-outline`: Tertiary action (border only)

All buttons are mobile-optimized with full width on small screens, auto width on larger screens.

### Icons

The site uses Lucide icons loaded from CDN. Initialize with `lucide.createIcons()` after DOM manipulation.

### Security & Configuration

- `config.js` is gitignored and contains webhook URLs
- Never commit sensitive credentials
- Forms include honeypot spam protection

### Font Loading

Fonts are self-hosted (GDPR compliant) from `/fonts/`:
- Inter Regular (400)
- Inter Medium (500)
- Inter Bold (700)

### Image Optimization

- Use `loading="lazy"` for below-the-fold images
- Use `fetchpriority="high"` for hero images
- Always include width/height attributes to prevent layout shift
- Prefer .avif or .webp formats with .jpg/.png fallbacks

### Accessibility Requirements

- All interactive elements must have min 44x44px touch targets on mobile
- Focus states use 3px solid outline with 2px offset
- Reduced motion support via `@media (prefers-reduced-motion: reduce)`
- High contrast mode support
- Screen reader-only text with `.sr-only` class

## File Organization

```
/
├── index.html              # Homepage with hero, process overview, examples
├── ueberuns.html          # About us / team page
├── leistungen.html        # Services page
├── technologie.html       # Technology page
├── erfolge.html           # Success stories
├── karriere.html          # Careers page
├── partner.html           # Partners page
├── verantwortung.html     # Corporate responsibility
├── trust-center.html      # Trust & security info
├── kontakt.html           # Contact page (dedicated form)
├── datenschutz.html       # Privacy policy
├── impressum.html         # Legal notice
├── publikationen/
│   ├── index.html         # Publications listing
│   └── efficiency_paradox.html
├── css/
│   └── design-system.css  # Global design system
├── js/
│   └── components.js      # Global JavaScript
├── config.js              # Configuration (gitignored)
├── images/                # Site images organized by page
└── fonts/                 # Self-hosted Inter font files
```

## Testing

This is a static site with no build process. Test by:
1. Opening HTML files directly in browser
2. Testing all form submissions work with N8N webhooks
3. Verifying responsive behavior on mobile devices
4. Testing keyboard navigation and accessibility features
5. Checking navigation scroll behavior
6. Testing modal open/close functionality

## Deployment

This is a static site that can be deployed to any web server. Simply upload all files (except config.js should be configured per environment).

Ensure:
- config.js exists with proper webhook URLs
- All file paths are relative
- .htaccess or server config handles clean URLs if needed
