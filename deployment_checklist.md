# Deployment Checklist: Real-Time Chat App

Follow these steps to deploy your application to a production environment (Vercel + Supabase).

## 1. Supabase Setup 🛠️
- [ ] **Create Project**: Start a new project in the Supabase Dashboard.
- [ ] **Database Migration**: Run the contents of `supabase_schema.sql` in the Supabase SQL Editor.
- [ ] **Storage Bucket**: 
  - Create a bucket named `chat-attachments`.
  - Set it to **Public** or configure RLS policies for authenticated access.
- [ ] **API Keys**: Go to Project Settings -> API and copy the `URL` and `anon public` key.

## 2. Environment Variables 🔑
In Vercel (or your hosting provider), add the following environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key.

## 3. Vercel Deployment 🚀
- [ ] **Import Project**: Link your GitHub repository to Vercel.
- [ ] **Build Command**: Ensure the build command is `npm run build` or `next build`.
- [ ] **Framework Preset**: Select "Next.js".

## 4. Final Verification ✅
- [ ] **Supabase Realtime**: Go to **Project Settings -> API** and ensure **"Enable Realtime"** is toggled **ON**.
- [ ] **Database Replication**: Go to **Database -> Replication**, edit the `supabase_realtime` publication, and check `messages`, `conversations`, and `profiles`.
- [ ] **Authentication**: Verify that you can sign up and sign in.
- [ ] **Real-time Sync**: Open two different browsers and check if messages appear instantly.
- [ ] **Media**: Send an image and a voice message to verify storage integration.

## 5. Security & Scaling 🛡️
- [ ] **RLS Policies**: Double-check that Row Level Security is enabled for all tables in Supabase.
- [ ] **Edge Functions**: (Optional) Move AI logic to Supabase Edge Functions if you need more scale.
