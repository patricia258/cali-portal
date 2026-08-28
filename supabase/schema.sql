create extension if not exists pgcrypto;

create table if not exists public.cali_submissions (
  id uuid primary key default gen_random_uuid(),
  protocol text not null unique,
  service_slug text not null check (service_slug = any (array[
    'assessoria-estrategica','mentoria-rh','diagnostico-executivo','cultura-direcao',
    'shadowing-lideranca','treinamentos','marca-empregadora','solucao-personalizada'
  ])),
  status text not null default 'novo' check (status = any (array[
    'novo','analise','edicao','aprovada','enviada','negociacao','fechada','recusada','expirada'
  ])),
  contact_name text not null check (char_length(btrim(contact_name)) between 2 and 140),
  contact_role text,
  contact_email text not null check (char_length(btrim(contact_email)) between 5 and 254),
  contact_phone text,
  contact_preference text check (contact_preference is null or contact_preference = any (array['email','whatsapp','ambos'])),
  company_name text,
  company_segment text,
  company_size integer check (company_size is null or company_size between 1 and 1000000),
  company_units integer check (company_units is null or company_units between 1 and 10000),
  company_location text,
  answers jsonb not null default '{}'::jsonb check (jsonb_typeof(answers) = 'object' and pg_column_size(answers) <= 65536),
  source_path text,
  lgpd_accepted boolean not null default false,
  internal_notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cali_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null,
  package_code text not null,
  package_label text not null,
  base_price numeric(12,2) not null default 0 check (base_price >= 0),
  config jsonb not null default '{}'::jsonb check (jsonb_typeof(config) = 'object'),
  active boolean not null default true,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(service_slug, package_code)
);

create table if not exists public.cali_proposals (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.cali_submissions(id) on delete cascade,
  service_slug text not null,
  version integer not null default 1 check (version > 0),
  package_code text not null,
  base_price numeric(12,2) not null default 0,
  extras numeric(12,2) not null default 0,
  discount_pct numeric(5,2) not null default 0 check (discount_pct between 0 and 50),
  contract_months integer not null default 1 check (contract_months between 1 and 60),
  validity_days integer not null default 15 check (validity_days between 1 and 120),
  subtotal numeric(12,2) not null default 0,
  final_unit numeric(12,2) not null default 0,
  total_value numeric(12,2) not null default 0,
  calculator_data jsonb not null default '{}'::jsonb,
  scope_items jsonb not null default '[]'::jsonb check (jsonb_typeof(scope_items) = 'array'),
  payment_terms text,
  public_notes text,
  status text not null default 'rascunho' check (status = any (array['rascunho','aprovada','enviada','aceita','recusada','expirada'])),
  pdf_path text,
  resend_email_id text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(submission_id, version)
);

create table if not exists public.cali_activity (
  id bigint generated always as identity primary key,
  submission_id uuid references public.cali_submissions(id) on delete cascade,
  proposal_id uuid references public.cali_proposals(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object' and pg_column_size(metadata) <= 8192),
  created_at timestamptz not null default now()
);

create index if not exists cali_submissions_status_created_idx on public.cali_submissions(status, created_at desc);
create index if not exists cali_submissions_service_created_idx on public.cali_submissions(service_slug, created_at desc);
create index if not exists cali_submissions_archived_created_idx on public.cali_submissions(archived_at, created_at desc);
create index if not exists cali_proposals_submission_idx on public.cali_proposals(submission_id, version desc);
create index if not exists cali_activity_submission_idx on public.cali_activity(submission_id, created_at desc);
create index if not exists cali_activity_proposal_idx on public.cali_activity(proposal_id, created_at desc);

alter table public.cali_submissions enable row level security;
alter table public.cali_pricing_rules enable row level security;
alter table public.cali_proposals enable row level security;
alter table public.cali_activity enable row level security;

revoke all on table public.cali_submissions from anon, authenticated;
revoke all on table public.cali_pricing_rules from anon, authenticated;
revoke all on table public.cali_proposals from anon, authenticated;
revoke all on table public.cali_activity from anon, authenticated;

grant select, update on table public.cali_submissions to authenticated;
grant select, insert, update, delete on table public.cali_proposals to authenticated;
grant select, update on table public.cali_pricing_rules to authenticated;
grant select on table public.cali_activity to authenticated;
grant usage, select on sequence public.cali_activity_id_seq to authenticated;

drop policy if exists "CALI admin reads submissions" on public.cali_submissions;
create policy "CALI admin reads submissions" on public.cali_submissions for select to authenticated
using ((select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email') = 'patricia@calirh.com');
drop policy if exists "CALI admin updates submissions" on public.cali_submissions;
create policy "CALI admin updates submissions" on public.cali_submissions for update to authenticated
using ((select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email') = 'patricia@calirh.com')
with check ((select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email') = 'patricia@calirh.com');

drop policy if exists "CALI admin manages proposals" on public.cali_proposals;
create policy "CALI admin manages proposals" on public.cali_proposals for all to authenticated
using ((select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email') = 'patricia@calirh.com')
with check ((select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email') = 'patricia@calirh.com');

drop policy if exists "CALI admin reads pricing" on public.cali_pricing_rules;
create policy "CALI admin reads pricing" on public.cali_pricing_rules for select to authenticated
using ((select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email') = 'patricia@calirh.com');
drop policy if exists "CALI admin updates pricing" on public.cali_pricing_rules;
create policy "CALI admin updates pricing" on public.cali_pricing_rules for update to authenticated
using ((select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email') = 'patricia@calirh.com')
with check ((select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email') = 'patricia@calirh.com');

drop policy if exists "CALI admin reads activity" on public.cali_activity;
create policy "CALI admin reads activity" on public.cali_activity for select to authenticated
using ((select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email') = 'patricia@calirh.com');

insert into public.cali_pricing_rules(service_slug,package_code,package_label,base_price,sort_order,config) values
('assessoria-estrategica','PARTNER','CALI PARTNER',3900,1,'{"minimum_months":6,"hours_min":8,"hours_max":12,"price_ceiling":5800,"visit_included":0}'::jsonb),
('assessoria-estrategica','FULL','CALI FULL',6500,2,'{"minimum_months":6,"hours_min":14,"hours_max":18,"price_ceiling":8000,"visit_included":1}'::jsonb),
('mentoria-rh','ESSENCIAL','Programa Essencial',1500,1,'{"meetings":3,"price_ceiling":1800}'::jsonb),
('mentoria-rh','AMPLIADO','Programa Ampliado',2200,2,'{"meetings":5,"price_ceiling":2400}'::jsonb),
('diagnostico-executivo','ESSENCIAL','Leitura Essencial',2800,1,'{"interviews_included":3,"price_ceiling":3000}'::jsonb),
('diagnostico-executivo','COMPLETO','Diagnóstico Completo',4000,2,'{"interviews_included":6,"price_ceiling":4500}'::jsonb),
('cultura-direcao','PROJETO','Projeto Cultura e Direção',3800,1,'{"interviews_included":4,"focus_groups_included":1,"workshops_included":1,"price_ceiling":4000}'::jsonb),
('shadowing-lideranca','CICLO','Ciclo Individual de Shadowing',3500,1,'{"leaders_included":1,"observation_hours_included":4,"price_ceiling":4000}'::jsonb),
('treinamentos','PALESTRA','Palestra Estratégica',1800,1,'{"price_ceiling":2500}'::jsonb),
('treinamentos','WORKSHOP','Workshop Aplicado',3000,2,'{"price_ceiling":3800}'::jsonb),
('treinamentos','TREINAMENTO','Treinamento Personalizado',4200,3,'{"meetings_included":3,"price_ceiling":5000}'::jsonb),
('marca-empregadora','PROJETO','Projeto de Marca Empregadora',3800,1,'{"price_ceiling":4000}'::jsonb),
('marca-empregadora','RECORRENTE','Sustentação Recorrente',3200,2,'{"minimum_months":4,"price_ceiling":4000}'::jsonb),
('solucao-personalizada','SOB_MEDIDA','Projeto sob medida',2800,1,'{"price_ceiling":3000}'::jsonb)
on conflict(service_slug,package_code) do update set package_label=excluded.package_label, base_price=excluded.base_price, sort_order=excluded.sort_order, config=excluded.config, active=true, updated_at=now();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('cali-proposals','cali-proposals',false,8388608,array['application/pdf'])
on conflict(id) do update set public=false,file_size_limit=8388608,allowed_mime_types=array['application/pdf'];

drop policy if exists "CALI admin reads proposal files" on storage.objects;
create policy "CALI admin reads proposal files" on storage.objects for select to authenticated
using (bucket_id='cali-proposals' and (select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email')='patricia@calirh.com');
drop policy if exists "CALI admin uploads proposal files" on storage.objects;
create policy "CALI admin uploads proposal files" on storage.objects for insert to authenticated
with check (bucket_id='cali-proposals' and (select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email')='patricia@calirh.com');
drop policy if exists "CALI admin updates proposal files" on storage.objects;
create policy "CALI admin updates proposal files" on storage.objects for update to authenticated
using (bucket_id='cali-proposals' and (select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email')='patricia@calirh.com')
with check (bucket_id='cali-proposals' and (select auth.uid()) is not null and lower((select auth.jwt()) ->> 'email')='patricia@calirh.com');
