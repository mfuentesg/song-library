drop policy "Allow edition to playlist owner" on "public"."playlist_songs";

drop policy "Enable read access to playlist owner" on "public"."playlist_songs";

drop policy "delete song from playlist for each owner" on "public"."playlist_songs";

drop policy "enable insert for playlist owner" on "public"."playlist_songs";

drop policy "Enable update for users based on user_id" on "public"."playlists";

drop policy "allow users to create playlists" on "public"."playlists";

drop policy "allow users to retrieve their playlists" on "public"."playlists";

drop policy "allow users to select their songs" on "public"."songs";

CREATE INDEX songs_user_id_idx ON public.songs USING btree (user_id);

create policy "Enable update songs for users based on user_id"
on "public"."songs"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow edition to playlist owner"
on "public"."playlist_songs"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT playlists.user_id
   FROM playlists
  WHERE (playlists.id = playlist_songs.playlist_id))));


create policy "Enable read access to playlist owner"
on "public"."playlist_songs"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT playlists.user_id
   FROM playlists
  WHERE (playlists.id = playlist_songs.playlist_id))));


create policy "delete song from playlist for each owner"
on "public"."playlist_songs"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT playlists.user_id
   FROM playlists
  WHERE (playlists.id = playlist_songs.playlist_id))));


create policy "enable insert for playlist owner"
on "public"."playlist_songs"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = ( SELECT playlists.user_id
   FROM playlists
  WHERE (playlists.id = playlist_songs.playlist_id))));


create policy "Enable update for users based on user_id"
on "public"."playlists"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "allow users to create playlists"
on "public"."playlists"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "allow users to retrieve their playlists"
on "public"."playlists"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "allow users to select their songs"
on "public"."songs"
as permissive
for select
to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



