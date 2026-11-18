create table if not exists cali_emissoes (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references cali_proposals(id) on delete cascade,
  protocolo text not null unique,
  hash text not null,
  emitido_em timestamptz not null default now(),
  titulo text not null,
  cliente text,
  signatario_nome text not null default 'Patrícia Lima',
  signatario_cargo text not null default 'People Advisory Executive · CALI RH',
  created_at timestamptz not null default now()
);

create index if not exists cali_emissoes_proposal_id_idx on cali_emissoes(proposal_id);

alter table cali_emissoes enable row level security;

drop policy if exists "service role manages cali_emissoes" on cali_emissoes;
create policy "service role manages cali_emissoes" on cali_emissoes
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
