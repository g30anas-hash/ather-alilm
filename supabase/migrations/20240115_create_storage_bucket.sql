
insert into storage.buckets (id, name, public)
values ('market-items', 'market-items', true)
on conflict (id) do nothing;

create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'market-items' );

create policy "Auth Upload"
on storage.objects for insert
with check ( bucket_id = 'market-items' and auth.role() = 'authenticated' );
