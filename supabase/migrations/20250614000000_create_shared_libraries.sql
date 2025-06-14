-- Create a view to expose user profiles
create view public.user_profiles as
  select
    users.id,
    users.email
  from auth.users as users;

create table public.shared_libraries (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  shared_with_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(owner_id, shared_with_id)
);

-- Enable row level security
alter table public.shared_libraries enable row level security;

-- Create policies for shared libraries
create policy "Users can see libraries shared with them"
  on public.shared_libraries
  for select
  to authenticated
  using (
    auth.uid() = shared_with_id
    or auth.uid() = owner_id
  );

create policy "Users can share their own libraries"
  on public.shared_libraries
  for insert
  to authenticated
  with check ((select auth.uid() as user_id) = owner_id);

create policy "Users can remove their shared libraries"
  on public.shared_libraries
  for delete
  to authenticated
  using ((select auth.uid() as user_id) = owner_id);
