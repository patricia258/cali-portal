alter table public.cali_submissions
  drop constraint if exists cali_submissions_service_slug_check;

alter table public.cali_submissions
  add constraint cali_submissions_service_slug_check
  check (service_slug = any (array[
    'assessoria-estrategica','cali-build','mentoria-rh','diagnostico-executivo','cultura-direcao',
    'shadowing-lideranca','treinamentos','marca-empregadora','solucao-personalizada'
  ]));

insert into public.cali_pricing_rules
  (service_slug, package_code, package_label, base_price, sort_order, config, active)
values
  ('cali-build','ESSENCIAL','CALI Build Essencial',4200,1,'{"minimum_months":4,"hours_min":8,"hours_max":12,"price_ceiling":6200,"execution_owner":"client","monthly":true}'::jsonb,true),
  ('cali-build','COMPLETO','CALI Build Completo',5600,2,'{"minimum_months":6,"hours_min":14,"hours_max":18,"price_ceiling":7600,"execution_owner":"client","monthly":true}'::jsonb,true)
on conflict (service_slug, package_code) do update
set package_label = excluded.package_label,
    base_price = excluded.base_price,
    sort_order = excluded.sort_order,
    config = excluded.config,
    active = true,
    updated_at = now();
