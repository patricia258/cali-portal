insert into public.cali_pricing_rules(service_slug,package_code,package_label,base_price,sort_order,config,active)
values ('treinamentos','PROGRAMA','Programa de Liderança Sob Medida',5500,4,'{"meetings_included":4}'::jsonb,true)
on conflict(service_slug,package_code) do update
set package_label=excluded.package_label,
    base_price=excluded.base_price,
    sort_order=excluded.sort_order,
    config=excluded.config,
    active=true,
    updated_at=now();
