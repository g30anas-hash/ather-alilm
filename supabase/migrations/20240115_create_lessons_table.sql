
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  teacher_id integer,
  teacher_name text,
  class_id text,
  class_name text,
  subject text,
  date text,
  summary text,
  image_url text,
  attendees text[], -- Array of student names or IDs? logic says string[]
  questions jsonb, -- Storing questions as JSONB
  created_at timestamptz default now()
);

-- Add RLS policies if needed, for now public access as per other tables
alter table public.lessons enable row level security;

create policy "Enable read access for all users" on public.lessons
  for select using (true);

create policy "Enable insert access for all users" on public.lessons
  for insert with check (true);

create policy "Enable update access for all users" on public.lessons
  for update using (true);
