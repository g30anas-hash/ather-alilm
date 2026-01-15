
-- Create storage bucket for market items if not exists
insert into storage.buckets (id, name, public)
values ('market-items', 'market-items', true)
on conflict (id) do nothing;

-- Enable public access to market-items
create policy "Public Access Market Items"
  on storage.objects for select
  using ( bucket_id = 'market-items' );

-- Enable upload for authenticated users
create policy "Authenticated Upload Market Items"
  on storage.objects for insert
  with check ( bucket_id = 'market-items' and auth.role() = 'authenticated' );
