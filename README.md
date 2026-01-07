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
- **Search Bar** - Floating search modal accessible from bottom menu with magnifying glass icon. Includes advanced search options (Date, Location, Time) hidden under "Advanced Search" button
- **Chat** - Real-time messaging with members and administrators
- **Profile** - User profiles with tabs for About, Friends, Liked Posts, Events, and Reminders. Dynamic routing for viewing any user's profile (`/profile/:userId`)
- **Admin Profile** - Complete profile page for Pernilla Ewarldsson with bio, achievements, hosted events, posts, and gallery
- **Friends System** - Facebook-style friends list with profile images, clickable cards, and navigation to friend profiles
- **User Profiles** - Six dummy user profiles with personalized biographies and full profile information
- **Notifications** - Notification system for posts, events, announcements, and updates
- **Watermarks** - Automatic logo watermark on all admin-created content (posts, announcements, events)
- **Pull-to-Refresh** - Facebook-like pull-to-refresh functionality on main content pages (Feed, Announcements, Events, Notifications)

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
- **Bottom Navigation**: Fixed bottom navigation bar with PNG icon images:
  - **Home** (`home.png`) - Navigate to announcements page
  - **Events** (`calendar.png`) - View upcoming events
  - **Search** (`search.png`) - Open search modal
  - **Notifications** (`notification.png`) - View notifications with unread badge
  - **Chat** (`chat.png`) - Access messaging interface
  - **Profile** (`user.png`) - View user profile
  - Icons have opacity states: inactive (60%), active (100%), hover (80%)
  - Active page indicator shown below selected icon
- **Search Bar**: Floating search modal accessible from the bottom navigation menu (search icon). The search bar:
  - Appears as a centered floating modal above page content
  - Always fully visible when activated
  - Includes basic search input and submit button
  - Advanced search options (Date, Location, Time filters) are hidden under an "Advanced Search" toggle button
  - Advanced options expand smoothly when activated
  - Modal can be closed via close button or backdrop click
  - Body scroll is locked when search is open to prevent positioning issues
- **Pull-to-Refresh**: Facebook-style pull-to-refresh functionality on main content pages. Features:
  - Pull down from the top of the page to refresh content
  - Custom refresh logo (`refreshlogo.jpg`) revealed progressively as you pull down
  - Logo appears above the header bar and is revealed from bottom to top
  - Visual feedback with animated arrow that rotates as you pull
  - Text indicators: "Pull to refresh" → "Release to refresh" → "Refreshing..."
  - Loading spinner appears during refresh
  - Only activates when scrolled to the top of the page
  - Available on Feed, Announcements, Events, and Notifications pages
  - Smooth animations and natural pull resistance

## Public Assets

Place the following images in the `public/` directory:
- `splash-screen.jpg` - Splash screen image (swapped from splash-screen.png)
- `penilla-logo-3.png` - Header logo (also used as watermark on admin content)
- `pernilla.png` - Admin profile picture
- `mallorca-beach.jpg` - Admin profile hero image (beach scene)
- `paddle.jpg` - Paddle Tennis Tournament announcement image
- `safari.jpg` - Safari Adventure to Kenya announcement image
- `refreshlogo.jpg` - Refresh logo revealed during pull-to-refresh gesture (also used as iOS home screen icon)
- `manifest.json` - Web app manifest for PWA support and home screen installation
- `appicon.png` - iOS home screen app icon
- `home.png` - Bottom navigation home icon
- `calendar.png` - Bottom navigation events/calendar icon
- `search.png` - Bottom navigation search icon
- `notification.png` - Bottom navigation notifications icon
- `chat.png` - Bottom navigation chat icon
- `user.png` - Bottom navigation profile/user icon

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

## iOS Home Screen Icon

The app includes full iOS home screen icon support:
- Uses `refreshlogo.jpg` as the home screen icon
- Configured for all iOS device sizes (iPhone and iPad)
- Supports "Add to Home Screen" functionality
- App launches in standalone mode (no browser UI)
- Theme color matches app design (#556B2F)
- Portrait orientation locked for optimal mobile experience

Users can add the app to their iPhone home screen by:
1. Opening the app in Safari
2. Tapping the Share button
3. Selecting "Add to Home Screen"
4. The app will appear with the refresh logo icon

## Technologies

- React 18
- TypeScript
- Vite
- React Router DOM
- CSS Variables for theming

## License

Private - Rendezvous Social Club
