# Modern Estate Agency - Dark Luxury Landing Page

A premium dark luxury landing page for Modern Estate Agency, built with Astro, Tailwind CSS, and Framer Motion.

## Features

- **Dark Luxury Design**: Rich black backgrounds with gold/metallic accents
- **Video Hero Section**: Full-screen video background with city night drone footage
- **Smooth Animations**: Framer Motion powered scroll-triggered animations
- **Responsive Design**: Fully responsive across all devices
- **Telegram Funnel**: Optimized to drive traffic to Telegram channel

## Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React** - For interactive components

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── public/
│   └── assets/          # Images and videos
├── src/
│   ├── components/      # React components (AnimatedSection, AnimatedCard)
│   ├── layouts/         # Layout.astro
│   └── pages/           # index.astro (main page)
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── package.json
```

## Design System

### Colors
- **Dark Background**: `#0a0a0a` (dark-bg)
- **Secondary Dark**: `#121212` (dark-bg-secondary)
- **Luxury Gold**: `#D4AF37` (luxury-gold)
- **Gold Light**: `#F3E5AB` (luxury-gold-light)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Manrope (sans-serif)

## Sections

1. **Hero Section**: Full-screen video background with main CTA
2. **Why Telegram?**: Explains the value proposition with marble texture background
3. **Our Focus**: Three service cards (Premium Residences, Smart Investments, Prime Locations)
4. **Trust & Local Expertise**: Local expertise section with Ukraine flag image
5. **Footer**: Minimal footer with Telegram CTA

## Customization

All assets are located in `/public/assets/`. Update the following files to customize:

- Logo: `modern-estate-agency-logo.jpg`
- Hero Video: `city-night-drone.mp4`
- Service Images: `dark-interior-design.jpg`, `dark-penthouse-lamp.jpg`, `kyiv-night.jpg`
- Background Textures: `black-marble-texture.jpg`, `ukraine-night-flag.jpg`

## Telegram Integration

All CTAs link to: `https://t.me/modern_estate_agency_ukraine`

Update this URL in `src/pages/index.astro` if needed.

