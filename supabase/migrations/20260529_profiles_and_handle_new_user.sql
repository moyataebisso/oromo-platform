-- =============================================================
-- Migration: handle_new_user trigger for public.profiles
-- Date:      2026-05-29
-- Notes:     Idempotent. Run in the Supabase SQL Editor.
--            Aligned to the real public.profiles schema in
--            project edjeenuhmorqmjvedpem.
-- =============================================================

BEGIN;

-- -------------------------------------------------------------
-- handle_new_user() — inserts a profile row from auth metadata.
-- Uses NULLIF so missing/blank date_of_birth becomes NULL.
-- Falls back display_name → full_name → local-part of email.
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NULLIF(NEW.raw_user_meta_data->>'date_of_birth', '')::date,
    NEW.raw_user_meta_data->>'age_group',
    NEW.raw_user_meta_data->>'grade_level',
    NEW.raw_user_meta_data->>'parent_email'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- -------------------------------------------------------------
-- Trigger on auth.users — fires once per signup
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMIT;
