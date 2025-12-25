# Unsent MVP — Week 1 Setup Guide

**Build time: ~2 hours** (assuming Supabase + Google OAuth credentials ready)

This guide walks through the complete setup for the **Unsent MVP** with:
- ✅ Landing page + Waitlist
- ✅ Google OAuth login
- ✅ Write messages
- ✅ Vault (list + view/edit)
- ✅ Archive & Delete
- ✅ Settings/Logout

---

## Prerequisites

Before you start, you need:

1. **Node.js 18+** installed (`node --version`)
2. **Supabase account** (free tier works): https://supabase.com
3. **Google Cloud credentials** (optional but recommended)
4. **Vercel account** for deployment (optional for local testing)

---

## Step 1: Supabase Setup (10 minutes)

### 1.1 Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Fill in details:
   - Name: `unsent`
   - Database password: generate a strong one
   - Region: closest to you
4. Wait for provisioning (~2 min)
5. Copy and save these from the **Project Settings → API**:
   - **Project URL** (starts with `https://...supabase.co`)
   - **Anon Public Key** (under "anon")

### 1.2 Create Database Tables

In Supabase dashboard, go to **SQL Editor** and run each block:

#### Block A: Waitlist Table (public signups)

```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

create policy "public can insert waitlist"
on public.waitlist for insert
to anon
with check (true);
```

#### Block B: Messages Table (private user vault)

```sql
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  to_name text,
  title text,
  body text not null,
  mood text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "users select own messages"
on public.messages for select
to authenticated
using (auth.uid() = user_id);

create policy "users insert own messages"
on public.messages for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users update own messages"
on public.messages for update
to authenticated
using (auth.uid() = user_id);

create policy "users delete own messages"
on public.messages for delete
to authenticated
using (auth.uid() = user_id);
```

✅ Both tables are now live with RLS policies.

### 1.3 Configure Auth URLs

In Supabase, go to **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (for local dev)
- **Redirect URLs** (add these):
  - `http://localhost:3000/auth/callback`
  - (After deploy to Vercel, add `https://YOUR-VERCEL-DOMAIN/auth/callback`)


---


```
Unsent — Week 1 Setup Guide
===========================

This guide documents the exact steps to get the Week-1 MVP running (Landing + Waitlist + Auth + Write + Vault + Edit + Settings).

1) Requirements
----------------
- Node.js 18+ (use nvm if needed)
- A Supabase project (https://supabase.com)
- (Optional) Google Cloud project for OAuth credentials
- GitHub account & Vercel account for deployment

2) Supabase: create project + run SQL
------------------------------------
Create a new Supabase project. Copy two values from the project settings:
- Project URL (your SUPABASE_URL)
- Anon public key (your SUPABASE_ANON_KEY)

Run these SQL blocks in Supabase -> SQL Editor.

A) Waitlist table (public insert allowed)
```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

create policy "public can insert waitlist"
  on public.waitlist for insert
  to anon
  with check (true);
```

B) Messages table (RLS: users can only CRUD their records)
```sql
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  to_name text,
  title text,
  body text not null,
  mood text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "users select own messages"
  on public.messages for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users insert own messages"
  on public.messages for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users update own messages"
  on public.messages for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users delete own messages"
  on public.messages for delete
  to authenticated
  using (auth.uid() = user_id);
```

3) Supabase Auth configuration
------------------------------
- In Supabase Dashboard → Authentication → URL Configuration:
  - Site URL: http://localhost:3000
  - Additional Redirect URLs: http://localhost:3000/auth/callback

- (Optional) Enable Google provider in Supabase → Authentication → Providers.
  - Create OAuth credentials in Google Cloud Console.
  - Authorized redirect URI for Google OAuth (in Google console):
    https://<your-supabase-ref>.supabase.co/auth/v1/callback
  - Put the Google Client ID/Secret back into Supabase Google provider UI.

4) Local repo setup (already created in this workspace)
------------------------------------------------------
Project root: `unsent`
Key files added under `src/`:
- `src/lib/supabase/client.ts` — Supabase browser client
- `src/app/(marketing)/page.tsx` — Landing + Waitlist
- `src/app/(auth)/login/page.tsx` — Login (Google)
- `src/app/auth/callback/page.tsx` — OAuth callback redirect handler
- `src/app/(app)/layout.tsx` — App shell
- `src/app/(app)/vault/page.tsx` — Vault (list)
- `src/app/(app)/write/page.tsx` — Write (create)
- `src/app/(app)/m/[id]/page.tsx` — View/Edit message
- `src/app/(app)/settings/page.tsx` — Settings + Logout
- `.env.local` — local env (placeholders created)

Update `.env.local` with your real Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

5) Run locally (dev server)
---------------------------
From the project root run:

```bash
npm install
npm run dev
```

Open: http://localhost:3000 — Landing page
Open: http://localhost:3000/login — Login

6) Supabase redirect flow note
------------------------------
When initiating Google sign-in we call `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '<origin>/auth/callback' } })`.
Supabase will do the auth code exchange and set the session; `app/auth/callback/page.tsx` waits for the session then redirects to `/vault`.

7) Quick verification checklist
-------------------------------
- Landing: fill waitlist email → should insert into `waitlist` table (check in Supabase table viewer).
- Login: click "Continue with Google" → should redirect through Supabase/Google and land in the app (if configured).
- Vault (after login): should list messages (none yet).
- Write: create a message → should appear in Vault.
- Message edit: open a message → update, archive, or delete should work.

8) Deploy to Vercel
-------------------
1. Push repo to GitHub.

```bash
git init
git add .
git commit -m "MVP week 1"
git branch -M main
# add your remote and push
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. In Vercel: Import project from GitHub and deploy.
3. Add environment variables in Vercel (Project Settings → Environment Variables):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy.
5. In Supabase → Authentication → URL Configuration: set Site URL to your Vercel domain (e.g. https://unsent.vercel.app) and add redirect URL `https://your-vercel-domain/auth/callback`.

9) Common issues & fixes
------------------------
- Redirect URL mismatch (Google): ensure the redirect URI in Google Cloud matches Supabase's callback URL and Supabase provider settings.
- Insert fails with RLS: re-run the RLS policy SQL exactly and ensure RLS is enabled for the table.
- Login works locally but not in production: check Site URL and additional redirect URLs in Supabase settings, and ensure Vercel env vars are set.

10) Next steps (post Week 1)
---------------------------
- Add Email OTP auth option
- Add sharing & public feed (Week 2+)
- Add location/map features (later weeks)
- Add account export/delete flow

---

If you'd like, I can now:
- run the dev server and report the build output (I will do that next),
- help push to GitHub and create the Vercel deploy (I can run git commands and provide steps),
- or update UI components (MessageCard, MessageEditor) into `src/components/` for re-use.

I'll start the dev server now and report back with the build output / any errors.
✅ **RLS policies** — User data stays private  

---

## What's NOT Included (Future)

❌ Map / Location (Week 2)  
❌ Sharing / Public feed (Week 3)  
❌ Time capsule (Week 4)  
❌ Dark mode  
❌ Mobile app  

---

## Next Steps After Deployment

1. **Share with friends** — Get beta feedback
2. **Week 2** — Add location + map view
3. **Week 3** — Sharing + public profile
4. **Week 4** — Time capsule + scheduled messages

---

## Support

If you hit issues:
1. Check this guide's Troubleshooting section
2. Check Supabase logs (SQL Editor → Logs)
3. Check browser console (F12)
4. Check Vercel deployment logs

---

**Built with:** Next.js 15 + Tailwind + Supabase + TypeScript  
**Status:** MVP ready for Week 1 🚀
