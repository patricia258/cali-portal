alter table public.cali_submissions
  add column if not exists archived_at timestamptz;

create index if not exists cali_submissions_archived_created_idx
  on public.cali_submissions (archived_at, created_at desc);
