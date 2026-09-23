update public.cali_pricing_rules
set config = jsonb_set(
      config,
      '{minimum_months}',
      to_jsonb(case package_code
        when 'PARTNER' then 8
        when 'FULL' then 12
      end),
      true
    ),
    updated_at = now()
where service_slug = 'assessoria-estrategica'
  and package_code in ('PARTNER','FULL');
