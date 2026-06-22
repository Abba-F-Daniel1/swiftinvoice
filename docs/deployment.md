# Deployment Guide

This project deploys cleanly as:

1. Frontend on Vercel
2. Backend on Render

## Prerequisites

1. A Clerk application (publishable + secret key)
2. A Supabase project (URL, anon key, service role key)
3. Supabase migration applied from `supabase/migrations/0001_snowy_darkness.sql`
4. Supabase Storage bucket named `invoices`

## Frontend (Vercel)

1. Import this repository in Vercel.
2. Build settings:
   - Framework preset: Vite
   - Install command: `npm ci --include=dev --no-audit --no-fund`
   - Build command: `vite build`
   - Output directory: `dist`
3. Set environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_URL` (your backend URL)
4. Deploy.

`vercel.json` is included for SPA route rewrites and build configuration.

## Backend (Render)

1. Create a Render Web Service from this repository.
2. Use Blueprint from `render.yaml` or configure manually:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Auto deploy trigger: `commit`
   - Health check path: `/health`
3. Set environment variables:
   - `CLERK_SECRET_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - Optional: `PORT`
4. Deploy.

If a Render deploy log shows `Missing script: "build"`, your service is likely using a default build command (`npm install; npm run build`) instead of this guide's backend settings. Update Render service settings to:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

## Local smoke test before production

1. Root frontend env: copy `.env.example` to `.env`
2. Backend env: copy `backend/.env.example` to `backend/.env`
3. Start backend:
   - `cd backend && npm install && npm start`
4. Start frontend:
   - `npm install && npm run dev`
5. Verify:
   - `GET /health` returns `{ "status": "ok" }`
   - Sign in works
   - Service creation works
   - Invoice download works

## Verification commands

Run this before every deployment:

```bash
npm run verify:hardening
```

Expected result:

- Gate test passes
- Eval status is `PASS` with score `1.00`
- Report written to `/tmp/swiftinvoice-hardening-eval/report.json`
