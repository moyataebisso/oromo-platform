-- =============================================================
-- Migration: ensure public.profiles + auto-create on auth.users insert
-- Date:      2026-05-29
-- Notes:     Idempotent. Run in the Supabase SQL Editor.
-- =============================================================

BEGIN;

-- -------------------------------------------------------------
-- 1. public.profiles table (guarded — already exists in prod)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               TEXT NOT NULL,
  display_name        TEXT,
  username            TEXT UNIQUE,
  bio                 TEXT,
  avatar_url          TEXT,
  date_of_birth       DATE,
  age_group           TEXT,
  grade_level         TEXT,
  school_level        TEXT,
  parent_email        TEXT,
  is_parent_verified  BOOLEAN DEFAULT FALSE,
  role                TEXT DEFAULT 'user',
  location            TEXT,
  website             TEXT,
  interests           TEXT[],
  is_public           BOOLEAN DEFAULT TRUE,
  notify_community    BOOLEAN DEFAULT TRUE,
  notify_courses      BOOLEAN DEFAULT TRUE,
  notify_jobs         BOOLEAN DEFAULT TRUE,
  notify_wiki         BOOLEAN DEFAULT TRUE,
  screen_time_limit   INTEGER,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns that may be missing on older deployments (safe no-ops if present).
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age_group TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grade_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS parent_email TEXT;

-- -------------------------------------------------------------
-- 2. RLS — let a user read/update their own row
-- -------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by owner" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR is_public = TRUE);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- -------------------------------------------------------------
-- 3. handle_new_user() — inserts a profile row from auth metadata
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta JSONB := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  birthday_text TEXT := meta->>'birthday';
  parsed_dob DATE;
BEGIN
  -- birthday is stored as an ISO timestamp string from the client; cast safely.
  BEGIN
    parsed_dob := CASE
      WHEN birthday_text IS NULL OR birthday_text = '' THEN NULL
      ELSE (birthday_text)::timestamptz::date
    END;
  EXCEPTION WHEN others THEN
    parsed_dob := NULL;
  END;

  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    date_of_birth,
    age_group,
    grade_level,
    parent_email
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(meta->>'full_name', meta->>'display_name'),
    parsed_dob,
    meta->>'age_group',
    meta->>'grade_level',
    meta->>'parent_email'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- -------------------------------------------------------------
-- 4. Trigger on auth.users — fires once per signup
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMIT;
