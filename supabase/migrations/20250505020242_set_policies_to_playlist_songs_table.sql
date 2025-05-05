drop policy "Enable read access for all users" on "public"."playlist_songs";

drop policy "allow update songs in a playlist" on "public"."playlist_songs";

create policy "Allow edition to playlist owner"
on "public"."playlist_songs"
as permissive
for update
to public
using ((auth.uid() = ( SELECT playlists.user_id
   FROM playlists
  WHERE (playlists.id = playlist_songs.playlist_id))));


create policy "Enable read access to playlist owner"
on "public"."playlist_songs"
as permissive
for select
to authenticated
using ((auth.uid() = ( SELECT playlists.user_id
   FROM playlists
  WHERE (playlists.id = playlist_songs.playlist_id))));


create policy "enable insert for playlist owner"
on "public"."playlist_songs"
as permissive
for insert
to authenticated
with check ((auth.uid() = ( SELECT playlists.user_id
   FROM playlists
  WHERE (playlists.id = playlist_songs.playlist_id))));



