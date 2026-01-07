# Rendezvous Social Club - Mobile App

An exclusive private social club mobile application built with React, TypeScript, and Vite.

## Features

- **Splash Screen** - Elegant welcome screen with branding and compact side-by-side login/register buttons positioned lower on the page
- **Login Page** - User authentication with dummy credentials (demo@rendezvous.club / demo123)
- **Announcements** - Main page with admin announcements (parties, events, exhibitions, tournaments, trips)
- **Registration** - Member registration with invitation code validation
- **User Feed** - Facebook-like social feed for members to post and interact
- **Events** - Event listings with calendar integration and RSVP functionality
- **Search & Connect** - Find and connect with other members
- **Chat** - Real-time messaging with members and administrators
- **Profile** - User profiles with tabs for About, Friends, Liked Posts, Events, and Reminders. Dynamic routing for viewing any user's profile (`/profile/:userId`)
- **Admin Profile** - Complete profile page for Pernilla Ewarldsson with bio, achievements, hosted events, posts, and gallery
- **Friends System** - Facebook-style friends list with profile images, clickable cards, and navigation to friend profiles
- **User Profiles** - Six dummy user profiles with personalized biographies and full profile information
- **Notifications** - Notification system for posts, events, announcements, and updates
- **Watermarks** - Automatic logo watermark on all admin-created content (posts, announcements, events)

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
9. **Profile** (`/profile` or `/profile/:userId`) - User profile page with dynamic routing for viewing any member's profile
10. **Admin Profile** (`/admin-profile`) - Complete admin profile for Pernilla Ewarldsson
11. **Notifications** (`/notifications`) - Notifications for posts, events, and updates

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

A complete admin profile page has been created for Pernilla Ewarldsson (`/admin-profile`). The profile includes:
- **Hero Section** with Mallorca beach background
- **Profile Stats**: Events hosted, members connected, years active, countries represented
- **Social Links**: Instagram, Facebook, Twitter, LinkedIn
- **Tabs**: About (bio, achievements, interests, languages), Friends, Events, Posts, Gallery
- **Friends Section**: Facebook-style grid displaying all connected members with clickable profile cards (placed on its own line in the tabs)
- **Achievements**: List of notable accomplishments
- **Events Section**: All hosted events with images and details
- **Posts Section**: All admin posts
- **Gallery**: Photo gallery of past events

The admin profile for Pernilla Ewarldsson is automatically available. All new members are automatically added as friends with the admin. The Friends tab displays all 6 dummy user profiles and allows navigation to each member's profile.

## Navigation Features

- **Profile Navigation**: Click on any user's profile image or name in posts, feed, or friends list to navigate to their profile
- **Friends List**: View friends in a Facebook-style grid layout with clickable profile cards
- **Dynamic Routing**: User profiles support dynamic URLs (`/profile/:userId`) for easy sharing and direct access
- **Admin Profile Links**: Clicking on admin profile images navigates to the dedicated admin profile page (`/admin-profile`)

## Public Assets

Place the following images in the `public/` directory:
- `splash-screen.jpg` - Splash screen image (swapped from splash-screen.png)
- `penilla-logo-3.png` - Header logo (also used as watermark on admin content)
- `pernilla.png` - Admin profile picture
- `mallorca-beach.jpg` - Admin profile hero image (beach scene)
- `paddle.jpg` - Paddle Tennis Tournament announcement image
- `safari.jpg` - Safari Adventure to Kenya announcement image

## User Profiles

The app includes six dummy user profiles with complete information:
- **Marcus von Habsburg** - Investment banker and wine connoisseur
- **Isabella Rossi** - Italian fashion designer and art enthusiast
- **James Chen** - Tech entrepreneur and photography enthusiast
- **Sophie Laurent** - French chef and culinary instructor
- **Thomas Müller** - German real estate developer
- **Maria Santos** - Spanish marketing executive and event organizer

Each profile includes:
- Personalized biography
- Profile image
- Contact information
- Social media links
- Friend connections
- Registered events
- Liked posts

All users are automatically friends with the admin (Pernilla Ewarldsson).

## Watermark Feature

All admin-created content (posts, announcements, and events) automatically displays the `penilla-logo-3.png` watermark on the right side of images. The watermark:
- Appears on 75% of the image area
- Positioned on the right edge, vertically centered
- Applied to all posts by the admin, all announcements, and all admin-created events
- Uses 70% opacity for subtle branding

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
