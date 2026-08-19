# Portal de Propostas CALI

Aplicação proprietária da CALI para captar briefings, calcular escopos e gerar propostas comerciais.

## Estrutura

- `index.html`: central pública dos serviços.
- `servico.html`: questionário dinâmico dos sete serviços.
- `admin/`: painel privado, restrito à Patricia.
- `admin/access.html`: primeiro acesso e recuperação por link seguro.
- `admin/reset.html`: definição de uma nova senha pelo Supabase Auth.
- `proposta.html`: composição e impressão da proposta em PDF.
- `supabase/schema.sql`: banco, segurança por linha, preços internos e storage privado.
- `supabase/functions/`: confirmação do lead e envio da proposta via Resend.

## Serviços

1. Assessoria Estratégica Mensal — CALI PARTNER e CALI FULL
2. Mentoria para Profissionais de RH — TRILHA, ESCALADA e AVIÕES
3. Diagnóstico Executivo de People
4. Projeto de Cultura e Direção
5. Shadowing de Liderança
6. Treinamentos & Palestras
7. Marca Empregadora

## Publicação

O frontend é estático e pode ser publicado diretamente na Vercel. O backend utiliza o projeto Supabase da CALI; apenas a chave pública fica no navegador. Todas as tabelas administrativas possuem RLS e os preços são privados.

As funções `portal-submit` e `portal-send-proposal` exigem o segredo `RESEND_API_KEY` no Supabase.
