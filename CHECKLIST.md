# ✅ Unsent MVP — Week 1 Deployment Checklist

Use this checklist to ensure everything is set up correctly before launching.

---

## Before You Start

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Supabase account created (free tier)
- [ ] Google Cloud project created (for OAuth)
- [ ] GitHub account ready
- [ ] Vercel account ready (optional, for deployment)

---

## Step 1: Supabase Setup

### Project Creation
- [ ] Created Supabase project
- [ ] Copied Project URL
- [ ] Copied Anon Public Key
- [ ] Saved credentials somewhere safe

### Database Tables
- [ ] Ran waitlist table SQL in Supabase SQL Editor
- [ ] Ran messages table SQL with RLS policies
- [ ] Verified both tables appear in "Tables" section
- [ ] Verified RLS policies are applied

### Authentication Configuration
- [ ] Set Site URL to `http://localhost:3000`
- [ ] Added redirect URL: `http://localhost:3000/auth/callback`
- [ ] Enabled Google provider
- [ ] Added Google Client ID to Supabase
- [ ] Added Google Client Secret to Supabase

### Google OAuth Setup
- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Created OAuth credentials (Web Application)
- [ ] Added `http://localhost:3000` to Authorized JavaScript origins
- [ ] Added Supabase redirect URI to Google (see SETUP_GUIDE.md)

---

## Step 2: Local Environment

- [ ] Cloned/navigated to project folder
- [ ] Created `.env.local` from `.env.local.example`
- [ ] Filled in `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Filled in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `.env.local` is in `.gitignore` (never commit!)

---

## Step 3: Testing Locally

### Installation
- [ ] Ran `npm install`
- [ ] No errors during install

### Dev Server
- [ ] Ran `npm run dev`
- [ ] Server starts without errors
- [ ] Open `http://localhost:3000` in browser

### Test Each Page
- [ ] **Landing page** (`/`) loads and looks good
  - [ ] Join Waitlist form works
  - [ ] Can submit email
  - [ ] Success message appears for new email
  - [ ] Duplicate email shows "already joined"
- [ ] **Login page** (`/login`) has Google button
  - [ ] Can click "Continue with Google"
  - [ ] Redirects to Google auth flow
- [ ] **After login → Vault** (`/vault`)
  - [ ] Shows "No messages yet" or existing messages
  - [ ] Can click "+ Write" button
- [ ] **Write page** (`/write`)
  - [ ] Can fill in all fields
  - [ ] Can select mood
  - [ ] "Save to Vault" button works
  - [ ] Redirects back to vault after save
- [ ] **Message card** in vault
  - [ ] Shows title, snippet, mood, date
  - [ ] Can click to open message
- [ ] **Message view/edit** (`/m/[id]`)
  - [ ] All fields populated
  - [ ] Can edit any field
  - [ ] Archive toggle works
  - [ ] "Update" button saves changes
  - [ ] "Delete" button removes message
- [ ] **Settings** (`/settings`)
  - [ ] Shows logged-in email
  - [ ] "Logout" button works
  - [ ] Redirects to home after logout

---

## Step 4: Production Build

- [ ] Ran `npm run build`
- [ ] Build completes with no errors
- [ ] No TypeScript errors

---

## Step 5: GitHub Setup

- [ ] Created GitHub repository
- [ ] Ran `git init` in project
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "Initial commit: Unsent MVP Week 1"`
- [ ] Ran `git remote add origin https://github.com/USERNAME/unsent.git`
- [ ] Ran `git push -u origin main`
- [ ] Verified all files on GitHub
- [ ] `.env.local` is NOT in repo (in `.gitignore`)

---

## Step 6: Vercel Deployment

### Setup
- [ ] Logged into Vercel
- [ ] Created new project
- [ ] Imported GitHub repository `unsent`
- [ ] Vercel automatically detected Next.js

### Environment Variables
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Clicked "Deploy"

### Monitoring
- [ ] Deployment completes without errors
- [ ] Vercel assigns domain (e.g., `unsent-xyz.vercel.app`)
- [ ] Copied domain for next steps

---

## Step 7: Update Supabase for Production

### Site URL
- [ ] In Supabase → Authentication → URL Configuration
- [ ] Updated **Site URL** to your Vercel domain (e.g., `https://unsent-xyz.vercel.app`)
- [ ] Added **Redirect URL**: `https://unsent-xyz.vercel.app/auth/callback`

### Google OAuth (if using)
- [ ] Updated Google Cloud Console
- [ ] Added Vercel domain to "Authorized JavaScript origins"
- [ ] Verified Supabase redirect URI in Google settings

---

## Step 8: Test Production

- [ ] Opened Vercel domain in browser
- [ ] Landing page loads
- [ ] Can join waitlist
- [ ] Google login works
- [ ] Can create, edit, delete messages
- [ ] Settings/logout works
- [ ] No console errors (F12)

---

## Step 9: Monitoring

- [ ] Checked Supabase logs for errors
- [ ] Checked Vercel deployment logs
- [ ] Tested from different devices/browsers
- [ ] Verified mobile responsiveness

---

## Step 10: Share & Feedback

- [ ] Shared Vercel domain with beta testers
- [ ] Collected feedback
- [ ] Recorded any issues/feature requests
- [ ] Ready for Week 2 improvements

---

## Troubleshooting Checklist

If something breaks:

- [ ] Check browser console (F12 → Console tab)
- [ ] Check Supabase logs (SQL Editor → Logs)
- [ ] Check Vercel deployment logs
- [ ] Verify `.env.local` has correct values
- [ ] Verify Supabase tables exist and have data
- [ ] Verify RLS policies are enabled
- [ ] Verify auth URLs match in Supabase and Google
- [ ] Restart `npm run dev` if needed
- [ ] Clear browser cache/cookies

---

## Post-Launch

- [ ] Document any issues for Week 2
- [ ] Create backlog for improvements
- [ ] Set up basic analytics (optional)
- [ ] Plan Week 2 features (location + map)

---

**Last Updated:** December 25, 2025  
**Status:** Ready for Week 1 Deployment 🚀
