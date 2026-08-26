# IBEROGO

**Problem:** Students waste time waiting in line to buy food between classes,
especially during busy hours.

**Solution (this project):** A web app that lets IBERO students order and
pay for food in advance, so it's ready to pick up the moment they arrive.

**User:** IBERO students who want to save time buying food and avoid lines.

This repo currently contains **Week 0** of the build: the technical
foundation only (repo, deploy pipeline, database connection). No ordering
features exist yet — see "Scope cuts" below.

## Prerequisites

- [Node.js](https://nodejs.org) 18 or newer
- A GitHub account
- A [Supabase](https://supabase.com) account and project
- A [Vercel](https://vercel.com) account

## Local setup

1. Clone the repo and move into it:
   ```bash
   git clone https://github.com/REPLACE_ME/iberogo.git
   cd iberogo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your local environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   Then open `.env.local` and fill in your real Supabase URL and anon key
   (see "Environment variables" below for where to find them).
4. Run the app locally:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment variables

| Variable | Where to get it | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → your project → Project Settings → Data API → Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → your project → Project Settings → API Keys → `anon public` | Yes |

Set these in two places:
- **Locally:** in `.env.local` (already git-ignored, never commit this file).
- **On Vercel:** Project → Settings → Environment Variables → add both, for
  Production and Preview.

## Deployment

This project deploys to Vercel automatically: every push to `main` triggers
a new production deploy once the GitHub repo is connected to a Vercel
project. No manual deploy step is needed after that initial connection.

**Live URL:** REPLACE_WITH_LIVE_URL

## Self-tests (Week 0)

1. **Clean-clone local run** — clone the repo fresh, run
   `npm install && npm run dev`, confirm the homepage loads with styling and
   no console errors.
2. **Production navigation** — on the live Vercel URL, click between Home
   and Docs in the navbar and confirm both load correctly on desktop and
   mobile widths.
3. **Supabase connection evidence** — on the live Vercel URL, confirm the
   small status pill on the homepage reads "Supabase: connected", proving
   the environment variables were set correctly in Vercel.

## Scope cuts (not built this week)

No authentication, no restaurant/menu database tables, no cart, no order
flow, no payments, no AI features. Those are planned for future weeks (see
the Roadmap on the homepage).
