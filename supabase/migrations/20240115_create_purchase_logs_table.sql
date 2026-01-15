
create table if not exists public.purchase_logs (
  id uuid default gen_random_uuid() primary key,
  student_id integer,
  student_name text,
  item_id text,
  item_name text,
  price integer,
  date timestamptz default now()
);

alter table public.purchase_logs enable row level security;

create policy "Enable read access for all users" on public.purchase_logs
  for select using (true);

create policy "Enable insert access for all users" on public.purchase_logs
  for insert with check (true);
