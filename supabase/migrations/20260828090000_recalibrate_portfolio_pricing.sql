update public.cali_pricing_rules
set active = false,
    updated_at = now()
where (service_slug = 'mentoria-rh' and package_code in ('TRILHA','ESCALADA','AVIOES'))
   or (service_slug = 'cultura-direcao' and package_code in ('DIAGNOSTICO','JORNADA'))
   or (service_slug = 'shadowing-lideranca' and package_code in ('INDIVIDUAL','EXECUTIVO'))
   or (service_slug = 'treinamentos' and package_code = 'PROGRAMA');

insert into public.cali_pricing_rules
  (service_slug, package_code, package_label, base_price, sort_order, config, active)
values
  ('assessoria-estrategica','PARTNER','CALI PARTNER',3900,1,'{"minimum_months":6,"hours_min":8,"hours_max":12,"price_ceiling":5800,"visit_included":0}'::jsonb,true),
  ('assessoria-estrategica','FULL','CALI FULL',6500,2,'{"minimum_months":6,"hours_min":14,"hours_max":18,"price_ceiling":8000,"visit_included":1}'::jsonb,true),
  ('mentoria-rh','ESSENCIAL','Programa Essencial',1500,1,'{"meetings":3,"price_ceiling":1800}'::jsonb,true),
  ('mentoria-rh','AMPLIADO','Programa Ampliado',2200,2,'{"meetings":5,"price_ceiling":2400}'::jsonb,true),
  ('diagnostico-executivo','ESSENCIAL','Leitura Essencial',2800,1,'{"interviews_included":3,"price_ceiling":3000}'::jsonb,true),
  ('diagnostico-executivo','COMPLETO','Diagnóstico Completo',4000,2,'{"interviews_included":6,"price_ceiling":4500}'::jsonb,true),
  ('cultura-direcao','PROJETO','Projeto Cultura e Direção',3800,1,'{"interviews_included":4,"focus_groups_included":1,"workshops_included":1,"price_ceiling":4000}'::jsonb,true),
  ('shadowing-lideranca','CICLO','Ciclo Individual de Shadowing',3500,1,'{"leaders_included":1,"observation_hours_included":4,"price_ceiling":4000}'::jsonb,true),
  ('treinamentos','PALESTRA','Palestra Estratégica',1800,1,'{"price_ceiling":2500}'::jsonb,true),
  ('treinamentos','WORKSHOP','Workshop Aplicado',3000,2,'{"price_ceiling":3800}'::jsonb,true),
  ('treinamentos','TREINAMENTO','Treinamento Personalizado',4200,3,'{"meetings_included":3,"price_ceiling":5000}'::jsonb,true),
  ('marca-empregadora','PROJETO','Projeto de Marca Empregadora',3800,1,'{"price_ceiling":4000}'::jsonb,true),
  ('marca-empregadora','RECORRENTE','Sustentação Recorrente',3200,2,'{"minimum_months":4,"price_ceiling":4000}'::jsonb,true),
  ('solucao-personalizada','SOB_MEDIDA','Projeto sob medida',2800,1,'{"price_ceiling":3000}'::jsonb,true)
on conflict (service_slug, package_code) do update
set package_label = excluded.package_label,
    base_price = excluded.base_price,
    sort_order = excluded.sort_order,
    config = excluded.config,
    active = true,
    updated_at = now();
