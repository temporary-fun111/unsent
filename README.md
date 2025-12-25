# Unsent — Week 1 MVP

A private-first unsent message vault. Write what you can't send.

## Stack

- **Frontend:** Next.js 15+ (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Auth:** Google OAuth + Session management

## Features (Week 1)

✅ Landing page + waitlist form  
✅ Google OAuth login  
✅ Write messages (create)  
✅ Vault (list messages with mood chips)  
✅ View/edit messages  
✅ Archive & delete messages  
✅ Settings + logout  
✅ Pink theme (design tokens included)  

## Quick Start

1. **Clone & install:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a Supabase project
   - Copy URL and anon key
   - Run SQL from `SETUP_GUIDE.md` (sections 2A & 2B)
   - Configure Auth URLs (section 3)

3. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run dev server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Deploy

See `SETUP_GUIDE.md` section 8 for Vercel deployment steps.

## Project Structure

```
unsent/
├── src/
│   ├── app/
│   │   ├── (marketing)/page.tsx       # Landing + waitlist
│   │   ├── (auth)/login/page.tsx      # Login
│   │   ├── auth/callback/page.tsx     # OAuth callback
│   │   ├── (app)/                     # App shell
│   │   │   ├── layout.tsx             # Nav
│   │   │   ├── vault/page.tsx         # List messages
│   │   │   ├── write/page.tsx         # Create message
│   │   │   ├── m/[id]/page.tsx        # View/edit message
│   │   │   └── settings/page.tsx      # Settings + logout
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css
│   └── lib/supabase/
│       └── client.ts                  # Supabase client
├── .env.local                         # Environment (placeholder)
├── SETUP_GUIDE.md                     # Setup + deployment guide
└── package.json
```

## Next Steps

- Email OTP auth option (Week 2)
- Sharing & public feed (Week 2+)
- Location/map features (later)
- Account export/delete (later)

---

**Questions?** See `SETUP_GUIDE.md` for detailed setup, troubleshooting, and deployment instructions.
