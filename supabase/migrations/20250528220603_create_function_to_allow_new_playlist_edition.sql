set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_playlist_songs(p_playlist_id uuid, p_song_id uuid, p_positions jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  -- Delete the song
  delete from playlist_songs 
  where playlist_id = p_playlist_id 
  and song_id = p_song_id;

  -- Update positions for remaining songs
  insert into playlist_songs (playlist_id, song_id, position)
  select 
    (jsonb_array_elements(p_positions)->>'playlist_id')::uuid,
    (jsonb_array_elements(p_positions)->>'song_id')::uuid,
    (jsonb_array_elements(p_positions)->>'position')::int
  on conflict (playlist_id, song_id) 
  do update set position = excluded.position;
end;
$function$
;


