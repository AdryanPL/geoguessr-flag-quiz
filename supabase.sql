create table if not exists public.quiz_progress (
  profile_id text primary key,
  cards jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.quiz_progress enable row level security;

create policy "Allow select for anon and authenticated"
  on public.quiz_progress
  for select
  to anon, authenticated
  using (true);

create policy "Allow insert for anon and authenticated"
  on public.quiz_progress
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow update for anon and authenticated"
  on public.quiz_progress
  for update
  to anon, authenticated
  using (true)
  with check (true);
