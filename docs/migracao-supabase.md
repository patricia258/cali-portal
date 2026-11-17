# Migração do Portal para contato Cali

Projeto de destino: `tpzcytjbglwzhgxrzzzb`.

Foram copiados 16 solicitações, 17 propostas, 22 atividades e 24 regras de preço. Os hashes e as contagens das quatro tabelas coincidiram com a origem `kqtbfeeqbcllwvlkbrkq`. Foram copiados também seis PDFs privados (3.869.042 bytes), com comparação SHA-256 após leitura no destino. A conta administrativa, sua senha e o fator TOTP verificado foram preservados.

As funções `portal-submit`, `portal-admin-access` e `portal-send-proposal` foram implantadas com o código recuperado do ambiente antigo e a mesma configuração de validação JWT. O bucket continua privado, com as políticas de acesso do Portal. As funções temporárias de transferência foram substituídas por respostas 410 e exigem JWT; não transferem mais dados.

## Antes de publicar

- `RESEND_API_KEY` foi configurada pela proprietária no destino e reconhecida em execução. A API do Resend validou a chave com uma requisição sem destinatário; nenhum e-mail foi enviado.
- Configurar Supabase Auth: Site URL `https://portal.calirh.com`; URLs de retorno `https://portal.calirh.com/**`, `https://cali-portal.vercel.app/**`, `https://propostas.calirh.com/**` e `https://cali-prospect-compass.lovable.app/**`. Incluir a URL exata da prévia se usada para testar acesso por e-mail.
- Conferir SMTP e provedores de Auth se usados. As configurações do serviço não acompanham os registros da conta.
- Repetir a sincronização e comparação das tabelas e arquivos se a origem receber alterações desde a cópia.
- Conferir login e MFA, envio de solicitação, abertura dos PDFs e geração/envio de proposta antes do corte. Testes de envio devem usar destinatário autorizado.

O outro repositório também usará esse projeto. Não excluir nem pausar o ambiente antigo antes de validar os dois sistemas e possíveis consumidores fora desta migração.

## Validação para o corte

Em 17/11/2026, a proprietária confirmou SMTP e URLs de retorno salvos e confirmou login por link e visualização dos leads na prévia do Prospect. A chave Resend substituta passou na validação sem envio de e-mail pela ferramenta. A comparação imediatamente anterior ao corte confirmou igualdade das dez tabelas entre as origens e o destino. A sincronização adicional do Portal foi concluída à noite. Os ambientes antigos serão preservados.
