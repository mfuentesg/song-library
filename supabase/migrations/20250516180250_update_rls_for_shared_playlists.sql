create policy "allow guest users modify a public playlist with guest access"
on "public"."playlist_songs"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM playlists p
  WHERE ((p.id = playlist_songs.playlist_id) AND (p.is_public = true) AND (p.allow_guest_editing = true)))));


create policy "enable insert on public playlists with guest editing flag"
on "public"."playlist_songs"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM playlists p
  WHERE ((p.id = playlist_songs.playlist_id) AND (p.is_public = true) AND (p.allow_guest_editing = true)))));


create policy "retrieve list of songs for a public playlist"
on "public"."playlist_songs"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM playlists p
  WHERE ((p.id = playlist_songs.playlist_id) AND (p.is_public = true)))));


create policy "Enable access when playlist is public"
on "public"."playlists"
as permissive
for select
to public
using (is_public);


create policy "allow retrieve songs part of a public playlist"
on "public"."songs"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (playlist_songs ps
     JOIN playlists p ON ((p.id = ps.playlist_id)))
  WHERE ((ps.song_id = songs.id) AND p.is_public))));



