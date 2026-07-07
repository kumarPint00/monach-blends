# Monarch Blends Next.js Website

A Next.js version of the Monarch Blends site with:

- Firebase Firestore backed jobs, services, contact enquiries, and site settings
- Admin panel for jobs, services, enquiries, and contact details
- Server-side AI chat proxy at `/api/chat`
- Vercel-ready Next.js app router setup

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Fill in your Firebase web app values in `.env.local`.

4. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Firebase values are exposed to the browser and must use `NEXT_PUBLIC_`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Optional values:

```bash
NEXT_PUBLIC_ADMIN_PASSWORD=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

If `ANTHROPIC_API_KEY` is not set, the chat widget shows a configuration message instead of failing.

## Deploy

Import this folder into Vercel as a Next.js project and add the same environment variables in Vercel Project Settings.

Build locally with:

```bash
npm run build
```
