-- Drop the existing view
drop view if exists public.user_profiles;

-- Recreate the view with full name
create view public.user_profiles as
  select
    u.id,
    u.email,
    u.raw_user_meta_data->> 'name' as full_name
  from auth.users as u;
