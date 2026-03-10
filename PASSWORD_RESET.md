# Password Reset — Setup Guide

The password reset flow is already built into the app. This guide explains the one-time Supabase configuration you need to do to make it work.

---

## How it works (overview)

```
User clicks "Forgot password?" on the login page
  → enters their email
  → Supabase sends them a recovery email
  → user clicks the link in the email
  → link opens the app at /reset-password
  → user types new password + confirms it
  → password is updated
  → user is redirected back to /login
```

---

## Step 1 — Add your app URL to Supabase's allowed redirect list

Supabase will only send recovery links to URLs you have explicitly whitelisted.

1. Go to your Supabase project dashboard
2. Click **Authentication** in the left sidebar
3. Click **URL Configuration**
4. Under **Redirect URLs**, click **Add URL** and add:
   - Your Vercel URL: `https://your-app.vercel.app/reset-password`
   - If you have a custom domain: `https://rendezvousclub.com/reset-password`
   - For local development: `http://localhost:5173/reset-password`

> Add each one separately. Without this, Supabase will reject the redirect and the recovery link won't work.

---

## Step 2 — Set the Site URL

The Site URL is the base address Supabase uses when building links in emails.

1. Still in **Authentication → URL Configuration**
2. Under **Site URL**, enter your production URL:
   - `https://your-app.vercel.app`  *(or your custom domain)*
3. Click **Save**

---

## Step 3 — Customise the recovery email (optional but recommended)

Supabase sends a default recovery email. You can personalise the subject and body.

1. Go to **Authentication → Email Templates**
2. Click **Reset Password**
3. You'll see a template with a `{{ .ConfirmationURL }}` placeholder — this is where the reset link goes
4. Edit the subject line and body to match your club's tone, e.g.:

**Subject:**
```
Reset your Rendezvous password
```

**Body:**
```html
<h2>Password Reset</h2>
<p>Hello,</p>
<p>We received a request to reset your Rendezvous Social Club password.</p>
<p><a href="{{ .ConfirmationURL }}">Click here to set a new password</a></p>
<p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
```

5. Click **Save**

---

## Step 4 — Set up a custom SMTP sender (recommended for production)

By default Supabase sends emails from a shared Supabase address, which can land in spam and has a low rate limit (2 emails/hour on the free tier).

For production, connect a real email sender:

1. Go to **Project Settings → Auth**
2. Scroll to **SMTP Settings**
3. Toggle **Enable Custom SMTP** ON
4. Fill in your SMTP details. Easiest options:
   - **Resend** (resend.com) — free tier, 3,000 emails/month, easy setup
   - **SendGrid** — free tier, 100 emails/day
5. Set **Sender name** to `Rendezvous Social Club` and **Sender email** to a real address you own

---

## Step 5 — Test the full flow

1. Run the app locally (`npm run dev`) or open your Vercel deployment
2. Go to the login page and click **Forgot password?**
3. Enter the email address of a registered account
4. Check that email's inbox — you should receive the reset link within a minute
5. Click the link — it should open `/reset-password` in your app
6. Enter a new password (minimum 8 characters), confirm it, and submit
7. You should see a success message and be taken back to login
8. Log in with the new password to confirm it works

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Reset email never arrives | Check Supabase Auth logs (Authentication → Logs). Check your SMTP settings. Check spam folder. |
| "Unable to validate" error on reset page | The link expired (1 hour limit) or was already used. Request a new one. |
| Redirect goes to wrong URL | Make sure the URL in Supabase's Redirect URLs list exactly matches `/reset-password` (including the path). |
| Email arrives but link goes to Supabase's own page | Site URL is not set correctly in Step 2. |
| "Email rate limit exceeded" | You're on Supabase free tier (2 emails/hour). Set up custom SMTP in Step 4. |

---

## What was built in the app

| File | What it does |
|---|---|
| `src/pages/LoginPage.tsx` | Added "Forgot password?" button |
| `src/pages/ForgotPasswordPage.tsx` | Email entry form — calls `supabase.auth.resetPasswordForEmail()` |
| `src/pages/ResetPasswordPage.tsx` | New password form — calls `supabase.auth.updateUser({ password })` after Supabase fires the `PASSWORD_RECOVERY` session event |
| `src/App.tsx` | Added public routes `/forgot-password` and `/reset-password` |

No backend code or Supabase Edge Functions needed — Supabase handles the token generation and email sending automatically.
