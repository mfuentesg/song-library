alter table "public"."playlists" add column "allow_guest_editing" boolean not null default false;

alter table "public"."playlists" add column "is_public" boolean not null default false;


