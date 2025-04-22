create table "public"."songs" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid default auth.uid(),
    "title" text,
    "artist" text not null,
    "bpm" numeric not null default '120'::numeric,
    "chord" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."songs" enable row level security;

CREATE UNIQUE INDEX songs_pkey ON public.songs USING btree (id);

alter table "public"."songs" add constraint "songs_pkey" PRIMARY KEY using index "songs_pkey";

alter table "public"."songs" add constraint "songs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."songs" validate constraint "songs_user_id_fkey";

grant delete on table "public"."songs" to "anon";

grant insert on table "public"."songs" to "anon";

grant references on table "public"."songs" to "anon";

grant select on table "public"."songs" to "anon";

grant trigger on table "public"."songs" to "anon";

grant truncate on table "public"."songs" to "anon";

grant update on table "public"."songs" to "anon";

grant delete on table "public"."songs" to "authenticated";

grant insert on table "public"."songs" to "authenticated";

grant references on table "public"."songs" to "authenticated";

grant select on table "public"."songs" to "authenticated";

grant trigger on table "public"."songs" to "authenticated";

grant truncate on table "public"."songs" to "authenticated";

grant update on table "public"."songs" to "authenticated";

grant delete on table "public"."songs" to "service_role";

grant insert on table "public"."songs" to "service_role";

grant references on table "public"."songs" to "service_role";

grant select on table "public"."songs" to "service_role";

grant trigger on table "public"."songs" to "service_role";

grant truncate on table "public"."songs" to "service_role";

grant update on table "public"."songs" to "service_role";


