alter table "public"."playlist_songs" drop column "updated_at";

alter table "public"."playlists" alter column "created_at" drop not null;

alter table "public"."playlists" alter column "updated_at" drop default;

alter table "public"."playlists" alter column "updated_at" drop not null;

alter table "public"."songs" alter column "created_at" drop not null;

alter table "public"."songs" alter column "updated_at" drop not null;


