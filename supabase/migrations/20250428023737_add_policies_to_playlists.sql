create policy "allow update songs in a playlist"
on "public"."playlist_songs"
as permissive
for update
to authenticated
using (true);


create policy "Enable update for users based on user_id"
on "public"."playlists"
as permissive
for update
to public
using ((auth.uid() = user_id));