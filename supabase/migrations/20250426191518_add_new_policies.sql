create policy "Enable read access for all users"
on "public"."playlist_songs"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."playlists"
as permissive
for select
to public
using (true);


create policy "allow users to create playlists"
on "public"."playlists"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "allow users to select their songs"
on "public"."songs"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));