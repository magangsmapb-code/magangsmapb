# SIAKAD AI — SMA Pemberdayaan Bangsa

## Overview

This repository now includes a Next.js App Router foundation for the SIAKAD AI platform, using TypeScript, Tailwind CSS, shadcn/ui-style components, and Supabase-ready structure.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + Storage + RLS
- Gemini-ready AI evaluation endpoint

## Structure

```bash
app/
  api/
    attendance/route.ts
    exam/evaluate/route.ts
  dashboard/page.tsx
  developer/page.tsx
  guru/page.tsx
  murid/page.tsx
  attendance/page.tsx
  exam/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  attendance/geofence-attendance.tsx
  exams/exam-proctoring-demo.tsx
hooks/
lib/
  geofence.ts
  supabase.ts
  validation.ts
  utils.ts
supabase/
  migrations/
    001_initial_schema.sql
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure Supabase environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. Apply SQL migration in Supabase SQL Editor:

```bash
supabase/migrations/001_initial_schema.sql
```

4. Run development server:

```bash
npm run dev
```

## Included modules

- RBAC role landing dashboard
- Geofence attendance with GPS validation and selfie upload module
- Secure CBT proctoring prototype with fullscreen and tab violation detection
- AI exam evaluator endpoint with rubric-based scoring fallback
- SQL DDL and RLS policies

## Notes

This is a working application foundation / prototype. The Gemini API integration is ready via environment variables and a fallback heuristic scorer is currently implemented for local development when no API key is provided.
