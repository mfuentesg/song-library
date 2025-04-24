create policy "Enable delete for users based on user_id"
on "public"."songs"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."songs"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));



