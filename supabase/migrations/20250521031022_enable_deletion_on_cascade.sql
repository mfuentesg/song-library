alter table "public"."playlist_songs" drop constraint "playlist_songs_playlist_id_fkey";

alter table "public"."playlist_songs" drop constraint "playlist_songs_song_id_fkey";

alter table "public"."playlist_songs" add constraint "playlist_songs_playlist_id_fkey" FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE not valid;

alter table "public"."playlist_songs" validate constraint "playlist_songs_playlist_id_fkey";

alter table "public"."playlist_songs" add constraint "playlist_songs_song_id_fkey" FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE not valid;

alter table "public"."playlist_songs" validate constraint "playlist_songs_song_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."playlists"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



