# Rendezvous Social Club - Mobile App

An exclusive private social club mobile application built with React, TypeScript, and Vite.

## Features

- **Splash Screen** - Elegant welcome screen with branding and login/register buttons
- **Login Page** - User authentication with dummy credentials (demo@rendezvous.club / demo123)
- **Announcements** - Main page with admin announcements (parties, events, exhibitions, tournaments, trips)
- **Registration** - Member registration with invitation code validation
- **User Feed** - Facebook-like social feed for members to post and interact
- **Events** - Event listings with calendar integration and RSVP functionality
- **Search & Connect** - Find and connect with other members
- **Chat** - Real-time messaging with members and administrators
- **Profile** - User profiles including admin profile (Pernilla Ewarldsson)

## Design System

The app uses a sophisticated color palette:
- **Rustic Gold**: `#e3d18d`, `#d4bf74`, `#e8d797`
- **Dark Olive Green**: `#556B2F` (from green-swatch.png)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── context/         # React context for state management
├── types/           # TypeScript type definitions
├── data/            # Dummy data and mock data
└── design-system.css # Design system CSS variables
```

## Key Pages

1. **Splash Screen** (`/`) - Initial welcome screen with Login and Register buttons
2. **Login** (`/login`) - User authentication page
3. **Announcements** (`/announcements`) - Main announcements feed
4. **Registration** (`/register`) - Member registration
5. **Feed** (`/feed`) - User social feed
6. **Events** (`/events`) - Upcoming events with RSVP
7. **Search** (`/search`) - Find and connect with members
8. **Chat** (`/chat`) - Messaging interface
9. **Profile** (`/profile`) - User profile page

## Authentication

### Login
The landing page now includes **Login** and **Register** buttons. Users must choose an option to proceed.

**Demo Login Credentials:**
- Email: `demo@rendezvous.club`
- Password: `demo123`

### Registration
To register, use the invitation code: `RENDEZVOUS2025`

Required fields:
- Full Name
- Email Address
- Phone Number
- Invitation Code

Optional fields:
- Address
- Social Links (Instagram, Facebook, Twitter, LinkedIn)
- Profile Image

## Admin Profile

The admin profile for Pernilla Ewarldsson is automatically available. All new members are automatically added as friends with the admin.

## Public Assets

Place the following images in the `public/` directory:
- `splash-screen.jpg` - Splash screen image (swapped from splash-screen.png)
- `penilla-logo-3.png` - Header logo
- `pernilla.png` - Admin profile picture

## Mobile-First Design

The app is optimized for mobile devices with a maximum width of 414px (iPhone Plus size).

## Technologies

- React 18
- TypeScript
- Vite
- React Router DOM
- CSS Variables for theming

## License

Private - Rendezvous Social Club
