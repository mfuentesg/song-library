drop policy "Enable read access for all users" on "public"."playlists";

drop policy "Allow edition to playlist owner" on "public"."playlist_songs";

drop policy "Enable update for users based on user_id" on "public"."playlists";

drop policy "Enable delete for users based on user_id" on "public"."songs";

drop policy "Enable insert for users based on user_id" on "public"."songs";

create policy "allow users to retrieve their playlists"
on "public"."playlists"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Allow edition to playlist owner"
on "public"."playlist_songs"
as permissive
for update
to authenticated
using ((auth.uid() = ( SELECT playlists.user_id
   FROM playlists
  WHERE (playlists.id = playlist_songs.playlist_id))));


create policy "Enable update for users based on user_id"
on "public"."playlists"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));


create policy "Enable delete for users based on user_id"
on "public"."songs"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."songs"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



