drop policy "Users can remove their shared libraries" on "public"."shared_libraries";

create policy "Users can remove their shared libraries"
on "public"."shared_libraries"
as permissive
for delete
to authenticated
using ((auth.uid() = owner_id));



