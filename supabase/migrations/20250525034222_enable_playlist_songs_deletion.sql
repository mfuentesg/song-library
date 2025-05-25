create policy "delete song from playlist for each owner"
on "public"."playlist_songs"
as permissive
for delete
to authenticated
using ((auth.uid() = ( SELECT playlists.user_id
   FROM playlists
  WHERE (playlists.id = playlist_songs.playlist_id))));


create policy "enable song deletion by user id"
on "public"."songs"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



