# Rendezvous Social Club App

A private members social club app built with React, TypeScript, and Vite. Members access the app by invitation only. Admins manage all content, events, and membership.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Routing | React Router v7 |
| Styling | CSS (mobile-first, max-width 414px) |
| Data (current) | localStorage (browser) |
| Data (production) | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Payments | Stripe (pending) |

---

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## Access control

The app enforces three access levels:

| Level | Who | Access |
|---|---|---|
| Public | Anyone | Splash screen, Login, Registration |
| Member | Registered users | Feed, Events, Chat, Profile, Search, Notifications |
| Admin | Users with `is_admin = true` in the database | All member pages + Admin dashboard, Create Post, Ad Manager, Messages, Console |

**Admin status is set in the database only** — there are no hardcoded admin accounts or passwords in the code. See [DEPLOY.md](DEPLOY.md) for how to create admin users in Supabase.

---

## Key pages

| Route | Description |
|---|---|
| `/` | Splash screen (auto-navigates after 4s) |
| `/login` | Login form |
| `/register` | Invitation-only registration |
| `/announcements` | Unified home feed (posts, events, ads) |
| `/events` | Events calendar |
| `/chat` | Member chat |
| `/profile` | User profile |
| `/admin` | Admin dashboard |
| `/admin/create-post` | Create post / event / announcement |
| `/admin/ads` | Advertisement manager |
| `/admin/messages` | Private admin–member messaging |
| `/admin-console` | Member management |
| `/admin-profile` | Admin profile + invitation codes |

---

## Invitation system

New members must have a valid invitation code to register. Codes are created by admins in the Admin Profile page. Each code can be set with:
- A usage limit (e.g. single-use or multi-use)
- An expiry date

---

## Sessions

Once logged in, users remain logged in across browser restarts until they explicitly log out. Session data is stored in `localStorage` (current) and will use Supabase Auth sessions when the backend is connected.

---

## Deployment

See [DEPLOY.md](DEPLOY.md) for the full step-by-step guide covering:
- Supabase database setup
- Creating admin users (database-controlled, no hardcoded credentials)
- Vercel deployment
- Stripe integration (paid events)
- Supabase Storage (image hosting)
