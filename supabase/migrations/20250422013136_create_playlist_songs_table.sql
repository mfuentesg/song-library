create table "public"."playlist_songs" (
    "playlist_id" uuid not null default gen_random_uuid(),
    "song_id" uuid not null default gen_random_uuid(),
    "position" numeric not null default '0'::numeric,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone
);


alter table "public"."playlist_songs" enable row level security;

CREATE UNIQUE INDEX playlist_songs_pkey ON public.playlist_songs USING btree (playlist_id, song_id);

alter table "public"."playlist_songs" add constraint "playlist_songs_pkey" PRIMARY KEY using index "playlist_songs_pkey";

alter table "public"."playlist_songs" add constraint "playlist_songs_playlist_id_fkey" FOREIGN KEY (playlist_id) REFERENCES playlists(id) not valid;

alter table "public"."playlist_songs" validate constraint "playlist_songs_playlist_id_fkey";

alter table "public"."playlist_songs" add constraint "playlist_songs_song_id_fkey" FOREIGN KEY (song_id) REFERENCES songs(id) not valid;

alter table "public"."playlist_songs" validate constraint "playlist_songs_song_id_fkey";

grant delete on table "public"."playlist_songs" to "anon";

grant insert on table "public"."playlist_songs" to "anon";

grant references on table "public"."playlist_songs" to "anon";

grant select on table "public"."playlist_songs" to "anon";

grant trigger on table "public"."playlist_songs" to "anon";

grant truncate on table "public"."playlist_songs" to "anon";

grant update on table "public"."playlist_songs" to "anon";

grant delete on table "public"."playlist_songs" to "authenticated";

grant insert on table "public"."playlist_songs" to "authenticated";

grant references on table "public"."playlist_songs" to "authenticated";

grant select on table "public"."playlist_songs" to "authenticated";

grant trigger on table "public"."playlist_songs" to "authenticated";

grant truncate on table "public"."playlist_songs" to "authenticated";

grant update on table "public"."playlist_songs" to "authenticated";

grant delete on table "public"."playlist_songs" to "service_role";

grant insert on table "public"."playlist_songs" to "service_role";

grant references on table "public"."playlist_songs" to "service_role";

grant select on table "public"."playlist_songs" to "service_role";

grant trigger on table "public"."playlist_songs" to "service_role";

grant truncate on table "public"."playlist_songs" to "service_role";

grant update on table "public"."playlist_songs" to "service_role";


