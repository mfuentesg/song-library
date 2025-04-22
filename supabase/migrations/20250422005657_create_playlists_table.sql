create table "public"."playlists" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "name" text not null default ''::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."playlists" enable row level security;

CREATE UNIQUE INDEX playlists_pkey ON public.playlists USING btree (id);

alter table "public"."playlists" add constraint "playlists_pkey" PRIMARY KEY using index "playlists_pkey";

alter table "public"."playlists" add constraint "playlists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."playlists" validate constraint "playlists_user_id_fkey";

grant delete on table "public"."playlists" to "anon";

grant insert on table "public"."playlists" to "anon";

grant references on table "public"."playlists" to "anon";

grant select on table "public"."playlists" to "anon";

grant trigger on table "public"."playlists" to "anon";

grant truncate on table "public"."playlists" to "anon";

grant update on table "public"."playlists" to "anon";

grant delete on table "public"."playlists" to "authenticated";

grant insert on table "public"."playlists" to "authenticated";

grant references on table "public"."playlists" to "authenticated";

grant select on table "public"."playlists" to "authenticated";

grant trigger on table "public"."playlists" to "authenticated";

grant truncate on table "public"."playlists" to "authenticated";

grant update on table "public"."playlists" to "authenticated";

grant delete on table "public"."playlists" to "service_role";

grant insert on table "public"."playlists" to "service_role";

grant references on table "public"."playlists" to "service_role";

grant select on table "public"."playlists" to "service_role";

grant trigger on table "public"."playlists" to "service_role";

grant truncate on table "public"."playlists" to "service_role";

grant update on table "public"."playlists" to "service_role";


