# Portal CALI: resumo para continuidade

Registro da conversa e do estado do projeto em 18/11/2026. Este documento é contexto de passagem, não um manual de regras nem uma identidade visual encerrada. Patrícia pretende continuar ajustando o projeto com outra IA. As escolhas visuais abaixo podem evoluir.

## O que está publicado agora

- Portal: https://portal.calirh.com/
- Repositório: https://github.com/patricia258/cali-portal
- Checkout local: /Users/oiazumi/CALI/cali-portal, branch main.
- Commit publicado: 053b5c02d32358d945eace628fb9cc4f3548a6f2.
- Vercel: projeto cali-portal, equipe cali11. Deployment dpl_BsKiP3SWfpr6E5dtd3W2VGx6mGp1, READY em produção.
- URL do build: https://cali-portal-qli9zwdxa-cali11.vercel.app.

Patrícia primeiro escolheu a base B/Imersão, com fundo bordô. Depois pediu a publicação do estilo B da última comparação. Nesta publicação isso corresponde a Newsreader regular/itálico nos títulos, Manrope nos textos e controles, sobre a base bordô. Essa interpretação foi comunicada antes da publicação.

A LP tem abertura bordô com degradê, destaque em itálico dourado e animações de entrada e movimento. O menu e o rodapé derivam dos componentes padrão já usados no portal/site CALI. CALI Assessoria e CALI Build estão em dois cartões prioritários, separados dos outros sete briefings. Os links levam ao formulário de cada serviço, com a ação Abrir briefing explícita. A seta diagonal tipográfica foi trocada por uma seta horizontal em SVG. A faixa vazia superior do rodapé foi retirada.

Os rótulos People Advisory, Portal de briefings, a assinatura Uma leitura pessoal por Patrícia e a faixa Depois do envio foram retirados da LP a pedido dela. O objeto decorativo inventado também foi retirado. As apresentações já existentes dentro dos próprios briefings foram preservadas.

## Estado dos símbolos: ainda em exploração

A folha NÃO está aprovada como desenho final. A folha publicada neste momento é uma candidata provisória da prévia, em assets/portal-ui/leaf-provisoria.svg. Publicar o estilo B não significa encerrar a identidade da folha.

No último envio, Patrícia trouxe uma referência de carvalho mais delicada, natural e reconhecível, com contorno orgânico e nervuras finas. Ela considerou esse desenho bonito e mais fiel à essência real da folha. Essa referência aponta uma mudança em relação às três folhas geométricas propostas anteriormente. Não houve um novo redesenho botânico nesta publicação.

A imagem anterior da lima estilizada havia sido aprovada como estudo: símbolo bordô, curvas suaves, aplicação solta e sobre um botão marfim. Ela foi preservada como referência, sem reconstrução aproximada nesta rodada. A aplicação isolada exata ainda depende da arte original aprovada em formato adequado. Na atual LP, a cena mostra a folha provisória; a nova lima aprovada ainda não foi incorporada como ativo isolado.

Patrícia trouxe também uma ilustração mais naturalista de fruta cortada, com gomos e textura, mas disse que a estética era diferente da referência de carvalho. É uma pista de pesquisa, não uma aprovação de desenho final ou uma ordem para copiar a imagem. Ela ainda pretende procurar outras referências.

Arquivos de referência acompanham este resumo: referencia-carvalho.png, referencia-fruta-lima.png e lima-aprovada-anterior.png.

## O que a conversa buscava no visual

A intenção era uma CALI mais contemporânea e tecnológica, com precisão e sofisticação. Apple, Steep e Resend apareceram como referências de composição, materialidade e animação, sem copiar outras marcas. As primeiras propostas pareceram genéricas/amadoras para Patrícia. A rodada clara foi considerada pálida e distante da marca. Ela pediu bordô mais presente, degradês e uso dos símbolos próprios.

Ela gosta da construção tipográfica atual da CALI: texto regular combinado com trechos em itálico e destaque dourado. Pediu opções dessa lógica com composição mais moderna e melhor alinhamento em tela. Foram comparados Instrument Serif/Instrument Sans, Newsreader/Manrope e DM Sans/DM Serif Display. O B/Newsreader foi o publicado agora. Conteúdo e tipografia continuam sujeitos a refinamentos; isto não é uma aprovação geral de todo o design system.

## Funcionalidade resolvida antes do rebrand

A prioridade inicial era completar briefing → e-mail → painel → proposta, porque havia travamento em Enviando. O relato herdado atribuía um 503 a um possível erro de boot. Na investigação desta conversa, os dados apontaram WallClockTime na função antiga e uma migração de projeto Supabase que não estava refletida corretamente no frontend local. A hipótese de segredo ausente no boot não foi confirmada como causa.

O Portal usa o Supabase tpzcytjbglwzhgxrzzzb. O antigo kqtbfeeqbcllwvlkbrkq era o CALI MAPA; a função antiga passou a responder PORTAL_MIGRATED. O frontend foi alinhado ao projeto correto.

Correções já publicadas anteriormente:
- js/request.js: timeout de 45 segundos, sem repetição automática de envio, mensagem para resultado incerto.
- js/form.js: tratamento do envio e proteção contra avanço automático duplicado.
- js/proposta.js: estado de envio e tratamento de timeout/avisos de sincronização.
- portal-send-proposal: checagem da chave de envio antes do upload e tratamento de falhas parciais de sincronização sem dizer que o e-mail falhou quando ele já foi enviado.
- Botão de continuar no celular abaixo do campo e botão final Voltar ao Portal centralizado.

Commits anteriores: d3e4c65cc43b01c57cadeae5a1193b3534e09722 e fab695742093c4348cba1c4b62e922b2da10eaa5. A Edge Function corrigida foi publicada no Supabase; ela não foi redeployada durante esta mudança visual.

## Validação funcional anterior

Com autorização expressa de Patrícia, foi enviado um briefing e uma proposta TESTE TÉCNICO apenas para patricia@calirh.com, sem clientes. Patrícia confirmou que entrou no painel e recebeu o e-mail. A conversa também verificou os registros e as mensagens recebidas.

- Empresa: TESTE TÉCNICO CALI.
- Briefing: bdf590aa-7199-4a1a-8c3a-90235d656fcc.
- Protocolo: CALI-AEM-20261118-929815.
- Proposta: 96a76e7a-d77a-45cf-ab9f-9532f5f91a3e; estado ENVIADA verificado.

O PDF desse teste foi montado a partir das cinco páginas renderizadas, depois que a impressão nativa não concluiu na automação. O teste confirmou envio de PDF e estado no painel, mas não certificou uma exportação automática de PDF em todos os ambientes.

## O que foi verificado nesta publicação visual

O domínio oficial carregou a LP e a fonte Newsreader. O caminho real de CALI Assessoria abriu o briefing e chegou à primeira pergunta; a validação de obrigatório apareceu corretamente. Os nove destinos e os arquivos locais foram conferidos antes do push. As prévias foram inspecionadas em celular e desktop sem overflow observado. A lógica de envio, banco, autenticação e painel não foi modificada neste release. Não foi feito um novo envio completo de e-mail após esta troca visual, nem uma certificação integral de acessibilidade.

## Arquivos úteis para continuar

Produção:
- index.html: estrutura da LP.
- styles-portal.css: estilo visual da LP, incluindo menu/rodapé e tipografia B.
- js/portal-header.js e js/portal-motion.js: menu e movimento.
- assets/portal-ui/leaf-provisoria.svg: folha temporária.
- servico.html: página real do briefing.
- styles-portal-briefing.css: ajustes visuais compartilhados com a LP.
- js/form.js, js/request.js e js/services.js: motor, requisições e conteúdo dos briefings.
- supabase/functions/portal-send-proposal/index.ts: envio de proposta.

As pastas locais designs/round-1 a round-4 guardam as comparações. São material de exploração; não foram publicadas junto com o commit de produção. Há documentos locais requirements.md, ux-brief.md, design-brief.md e ui-progress.md que registram etapas anteriores, inclusive escolhas depois revistas. Não são um conjunto de novas restrições para os próximos ajustes.

As skills usadas foram uxui-workflow, design-taste-frontend e ig-humano. O humanizador foi executado sobre a copy, mas não transforma o texto em conteúdo final aprovado. Na rodada 3, o detector heurístico marcou 66,8/100 e pediu revisão de voz; nenhum resultado comercial foi inventado para melhorar essa pontuação.

## Trabalho que permanece aberto

O desenho natural da folha, a aplicação isolada da lima, o acabamento tipográfico e a copy podem continuar evoluindo. Patrícia também quer renovar os e-mails para clientes; trouxe um modelo de boas-vindas como referência, mas essa reformulação visual ainda não foi implementada. A base funcional de envio foi consertada, o que é diferente de ter redesenhado os templates de e-mail.

Este resumo registra o ponto de partida para a próxima conversa. A intenção expressa de Patrícia é seguir ajustando, não congelar estas decisões.
