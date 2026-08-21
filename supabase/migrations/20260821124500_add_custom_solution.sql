alter table public.cali_submissions
  drop constraint if exists cali_submissions_service_slug_check;

alter table public.cali_submissions
  add constraint cali_submissions_service_slug_check
  check (service_slug = any (array[
    'assessoria-estrategica'::text,
    'mentoria-rh'::text,
    'diagnostico-executivo'::text,
    'cultura-direcao'::text,
    'shadowing-lideranca'::text,
    'treinamentos'::text,
    'marca-empregadora'::text,
    'solucao-personalizada'::text
  ]));

insert into public.cali_pricing_rules
  (service_slug, package_code, package_label, base_price, sort_order, config)
values
  ('solucao-personalizada', 'SOB_MEDIDA', 'Projeto sob medida', 0, 1, '{"manual_pricing": true}'::jsonb)
on conflict (service_slug, package_code) do update
set package_label = excluded.package_label,
    config = excluded.config,
    active = true,
    updated_at = now();
