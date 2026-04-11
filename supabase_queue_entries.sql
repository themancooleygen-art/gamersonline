create table if not exists public.queue_entries (
  id uuid primary key default gen_random_uuid(),
  steam_id text not null,
  username text,
  queue_type text not null default 'ranked_5v5',
  region text not null default 'NA',
  status text not null default 'queued',
  elo int8 not null default 1000,
  created_at timestamptz not null default now()
);

create index if not exists idx_queue_entries_status on public.queue_entries(status);
create index if not exists idx_queue_entries_queue_type on public.queue_entries(queue_type);
create index if not exists idx_queue_entries_region on public.queue_entries(region);

create unique index if not exists uq_queue_entries_active_player
on public.queue_entries (steam_id, queue_type, region, status);
