alter table public.cali_submissions
drop constraint if exists cali_submissions_service_slug_check;

alter table public.cali_submissions
add constraint cali_submissions_service_slug_check
check (service_slug = any (array[
  'assessoria-estrategica'::text,
  'cali-build'::text,
  'mentoria-rh'::text,
  'diagnostico-executivo'::text,
  'cultura-direcao'::text,
  'shadowing-lideranca'::text,
  'treinamentos'::text,
  'marca-empregadora'::text,
  'solucao-personalizada'::text
]));

insert into public.cali_pricing_rules
  (service_slug, package_code, package_label, base_price, sort_order, config, active)
values
  ('cali-build','ESSENCIAL','CALI Build Essencial',3900,1,'{"minimum_months":4,"hours_min":8,"hours_max":12,"pricing_model":"complexity_scaled"}'::jsonb,true),
  ('cali-build','COMPLETO','CALI Build Completo',5200,2,'{"minimum_months":6,"hours_min":14,"hours_max":18,"pricing_model":"complexity_scaled"}'::jsonb,true)
on conflict (service_slug, package_code) do update
set package_label = excluded.package_label,
    base_price = excluded.base_price,
    sort_order = excluded.sort_order,
    config = excluded.config,
    active = true,
    updated_at = now();
