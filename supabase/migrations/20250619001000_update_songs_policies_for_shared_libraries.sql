-- Drop existing song-related policies if they exist
drop policy if exists "allow users to select their songs" on "public"."songs";
drop policy if exists "Users can view songs from shared libraries" on "public"."songs";

-- Create policy to allow users to view their own songs and songs from libraries shared with them
create policy "Users can view songs"
  on public.songs
  for select
  to authenticated
  using (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM shared_libraries sl
      WHERE sl.shared_with_id = auth.uid()
      AND sl.owner_id = songs.user_id
    )
  );

-- Update index to improve query performance
DROP INDEX IF EXISTS songs_user_id_idx;
CREATE INDEX songs_user_id_idx ON public.songs USING btree (user_id);
CREATE INDEX shared_libraries_shared_with_id_idx ON public.shared_libraries USING btree (shared_with_id);
CREATE INDEX shared_libraries_owner_id_idx ON public.shared_libraries USING btree (owner_id);
