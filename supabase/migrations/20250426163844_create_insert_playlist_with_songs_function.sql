CREATE OR REPLACE FUNCTION public.create_playlist_with_songs(name text, user_id uuid, song_ids uuid[])
 RETURNS playlists
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  v_playlist playlists;
  v_share_code text;
begin
  v_share_code := upper(substr(md5(random()::text), 1, 7));

  insert into playlists (name, share_code, user_id)
  values (name, v_share_code, user_id)
  returning * into v_playlist;

  -- Insert playlist_songs relationships with position
  insert into playlist_songs (playlist_id, song_id, position)
  select 
    v_playlist.id,
    song_id,
    row_number() over ()
  from unnest(song_ids) as song_id;

  return v_playlist;
end;$function$
;