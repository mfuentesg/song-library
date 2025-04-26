alter table "public"."playlists" add column "share_code" text;

CREATE UNIQUE INDEX playlists_share_code_key ON public.playlists USING btree (share_code);

alter table "public"."playlists" add constraint "playlists_share_code_key" UNIQUE using index "playlists_share_code_key";

set check_function_bodies = off;