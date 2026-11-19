# Portal CALI — Rebrand da LP

## Summary
Reformular a landing page do Portal CALI para comunicar precisão, sofisticação e uma experiência tecnológica, ajudando visitantes a escolher um serviço e iniciar seu briefing com contexto breve. Enquadramento aprovado pela proprietária nesta conversa.

## Problem framing
### Problem statement
O visitante precisa reconhecer qual serviço atende ao seu momento e iniciar o briefing com confiança, porque os nomes dos serviços exigem contexto e a composição atual não comunica a qualidade e a direção de marca desejadas.
### Primary user snapshot
Founders, diretores e profissionais de RH, em celular e desktop, chegando por links da CALI ou indicação. Parte conhece o serviço; parte conhece apenas seu problema.
### Key scenarios
1. Recebeu uma indicação de Assessoria e quer encontrar o briefing correspondente.
2. Sabe que precisa estruturar o RH, mas precisa distinguir acompanhamento recorrente de implantação assistida.
3. Procura uma intervenção específica, como treinamento, diagnóstico ou desenvolvimento.
4. Não encontra um enquadramento exato e precisa explicar seu desafio.
### How might we
- Como tornar os serviços compreensíveis sem alongar a entrada do briefing?
- Como atender quem já sabe o que quer e quem precisa de contexto?
- Como fazer o rebrand aparecer na experiência completa da LP?
- Como dar unidade futura aos e-mails sem misturar sua implementação com a LP?

## Problem
A versão anterior alterou fontes, cores e cantos, preservando a composição. A proprietária considera o resultado simples e insuficiente como rebrand.
## Goals and success metrics
Rebrand perceptível e consistente; identificação do serviço e acesso ao formulário claros; navegação responsiva e acessível. Sem métricas numéricas de conversão inventadas. Critérios verificáveis: nove serviços alcançáveis, destinos corretos, navegação por teclado, ausência de cortes e de interferência nos fluxos existentes.
## Users
Primário: potenciais clientes e profissionais buscando os serviços. Secundária: Patrícia, que recebe briefings e elabora propostas. Sem nova área de conta na LP; painel mantém autenticação existente.
## Core jobs (ranked)
1. Reconhecer o serviço apropriado.
2. Iniciar o briefing correto.
3. Entender brevemente o que acontece depois do envio.
4. Encontrar ajuda se nenhum serviço parecer adequado.
## Scope
### Must have
- Rebrand da LP do portal com linguagem de precisão e sofisticação, referência Apple.
- Bordô, marfim e dourado CALI com aplicação mais marcante.
- Nove serviços e acesso aos briefings existentes.
- Contexto breve para ajudar na escolha.
- Preservação dos fluxos de formulário, painel, proposta e e-mail validados.
### Should have
Continuidade com a voz pessoal de Patrícia e identidade reconhecível como CALI; movimentos discretos e opcionais; legibilidade em celular.
### Won't have (this version)
Rebrand do site institucional, reescrita de regras comerciais, mudanças de banco/autenticação, redesenho do painel/PDF e implementação dos novos e-mails. A proprietária quer redesenhar os e-mails em etapa posterior.
## Content and data
Conteúdo de serviços em `js/services.js` e resumos em `js/home.js`. Logos e retrato próprios em assets. Preservar slugs, IDs e payloads. Sem testemunhos, números ou promessas fabricados. Não exibir dados de clientes na LP.
## Platform and integrations
HTML/CSS/JS estáticos, Vercel, links para os briefings existentes. Supabase não exige alteração para esta LP.
## Constraints
Trabalhar no checkout existente; escopar estilos à home; testar celular e desktop; manter privacidade e contatos oficiais. Protótipos de design não devem alterar produção antes da direção aprovada.
## Brand and tone
- Personalidade: precisa, sofisticada, tecnológica, humana e direta.
- Must never feel: ajuste cosmético insuficiente, template genérico, excesso de decoração ou complexidade para escolher um serviço.
- Referências aprovadas: Apple para sensação predominante; SuperHi e Titan fornecidas anteriormente como repertório. Comuni como contexto de evolução das marcas, sem alegar avaliação visual que ainda não foi realizada nesta fase.
- Paleta aprovada: bordô `#5A1E2D`, marfim `#F7F3EE`, dourado `#B58C52`.
- Logotipo CALI preservado. Fontes, composição e movimentos serão propostos na fase de UI.
- Referência de e-mail recebida: imagem principal, mensagem breve, ação clara e próximos passos. Uso futuro; não copiar identidade ou conteúdo da referência.
## Lifecycle
Primeira visita: reconhecer oferta e escolher. Retorno: acesso rápido ao serviço conhecido. Pós-envio: tela existente de confirmação, e-mails e leitura pela Patrícia.
## Edge cases and states
Serviço incerto: caminho existente de Solução Personalizada/contato. Nenhum dado pessoal de terceiros na LP. Links, foco, contraste, preferências de movimento reduzido e acesso com conexões lentas devem ser verificados. Eventual recomendação de serviço não representa diagnóstico ou contratação.
## Assumptions (signed off)
Enquadramento confirmado: LP primeiro, fluxos preservados, e-mails depois. Nenhuma nova preferência estética adicional presumida.
## Open questions
Modelo de escolha dos serviços (fase 2); direção visual e tipografia (fase 3); referências adicionais e identidade dos e-mails (etapa posterior).
## Decision log
| Decision | Options considered | Chosen | Why |
|---|---|---|---|
| Paleta | Preservar / adicionar cor / ampliar rebrand | Preservar com aplicação marcante | Escolha explícita da proprietária |
| Sensação | Apple / SuperHi / equilíbrio | Precisão e sofisticação Apple | Escolha explícita da proprietária |
| Papel da LP | Escolha com contexto / catálogo direto / apresentação ampla | Escolha com contexto breve | Escolha explícita da proprietária |
| Ordem | LP e e-mails | LP primeiro | Prioridade explícita da proprietária |
