# Handoff — Geração de PDF da Proposta (Assessoria Estratégica / CALI Portal)

Documento de continuidade para outra IA assumir este trabalho caso eu trave. Escrito em 18/11/2026.

## Projeto e onde tudo mora

- Repo: `/Users/oiazumi/CALI/cali-portal` (GitHub: `patricia258/cali-portal`, branch `main`, push direto sem PR).
- Supabase do portal: projeto ref `tpzcytjbglwzhgxrzzzb` (nome no dashboard: "Portal | Cali RH | Contato"). **Não é o mesmo projeto que aparece nas tools MCP de Supabase desta sessão** (essas listam só "CALI Prospect Compass", "CALI MAPA" e "Portal Cali" inativo — nenhum deles é este). Todo acesso a este projeto (deploy de function, SQL) tem que ser feito pelo navegador, logada, não pelas tools MCP.
- Função principal: `supabase/functions/portal-proposal-pdf/index.ts` — gera o PDF da proposta inteiro em @react-pdf/renderer, rodando como Deno Edge Function. É TypeScript puro sem JSX (usa `createElement as h`).
- Função de verificação: `supabase/functions/portal-verify/index.ts` + página `verificar.html`/`js/verificar.js`, servindo `/v/{protocolo}`.
- Tabela nova `cali_emissoes` (migration `supabase/migrations/20261118193000_add_cali_emissoes.sql`), já aplicada em produção: guarda protocolo/hash/emitido_em/signatário por proposta, pra bater com o padrão do CALI Tools (`tools.calirh.com`, repo irmão `/Users/oiazumi/CALI/cali-tools`, arquivo de referência `src/pdf/Documento.tsx`).
- UI de envio: `proposta.html` + `js/proposta.js` (botão "Enviar por e-mail" → modal → `portal-send-proposal`). Acesso: `https://portal.calirh.com/proposta.html?id=<proposal_id>`.
- Dados do conteúdo da proposta vêm de `calculatorData` (editorialVersion:2), editado pelo admin em `admin-editar.js`, com defaults em `js/proposal-profiles.js`. **Isso já existia pronto** antes deste trabalho — não precisei mexer na UI de edição, só no gerador de PDF.

## Referência que a Paty pediu pra replicar 1:1

PDF de um cliente real já fechado: `Proposta-CALI-RH---KIE-TEC---Assessoria-Estrategica-Mensal-HR-as-a-Service---KIE-TEC---CALI-AEM-20260925-A6CC6D.pdf` (pasta Downloads dela). Ela foi taxativa: **"Ctrl+C, Ctrl+V"** — mesma estrutura/regras pra TODOS os tipos de proposta, só o conteúdo muda. A única diferença intencional que ela pediu: a página final (antes só assinatura + botão CTA) agora precisa ter assinatura + QR/registro eletrônico — e depois ela corrigiu de novo: **só o QR, sem botão nenhum junto** (ver seção de erros abaixo).

## Estado atual — o que está pronto e verificado

1. **Paridade de verificação com o Tools**: QR no rodapé da última página aponta pra `/v/{protocolo}`, que abre uma página mínima idêntica à do Tools (logo centralizada, "Documento autêntico", detalhes colapsáveis com Responsável/Emitido em/Protocolo/Integridade). Testado ponta a ponta.
2. **PDF de 6 seções replicando a referência**: capa, solução recomendada, escopo contratado, governança, condições comerciais, próximos passos+assinatura+QR. Dados genéricos puxados do `calculatorData`, funcionam pra qualquer um dos 9 tipos de serviço.
3. **Taxa de Ativação**: adicionada como cobrança única separada (20% da mensalidade final) pra serviços recorrentes, conforme ela pediu — não duplica a mensalidade.
4. **Última correção feita agora (commits `7c3b919` e `54bb53e`, já deployados)**:
   - Bug de overlap nas listas de duas colunas (VALOR AGREGADO, RITMO E FORMATO, SEQUÊNCIA PREVISTA): tinha um `flex: 1` errado no estilo `twoColItem` que fazia os itens dividirem a altura disponível igualmente em vez de cada um crescer conforme seu próprio conteúdo — quando um item quebrava em 2 linhas, ele vazava em cima do próximo. Corrigido removendo o `flex: 1`.
   - Botão "Vamos conversar sobre a proposta?" removido de vez da página de assinatura. Agora só tem nome/cargo da Patrícia + bloco de registro eletrônico com QR.
   - Removido `ctaBotao`/`ctaTexto` do StyleSheet (ficaram mortos depois da remoção do botão).
   - Bug extra que eu achei sozinho (não foi ela quem apontou, mas bate com a reclamação dela de "página 2 toda errada"): a página 1 (capa) tinha padding duplicado — o `Page` já reservava 60pt de margem inferior e o `View` interno reaproveitava o estilo `paginaInner` que reservava mais 85pt, total 145pt desperdiçados só na capa. Isso empurrava o bloco "Mapa de People" pra uma página extra **sem cabeçalho nem rodapé** (aparência de "quebrado"). Criei um estilo `capaInner` dedicado sem esse padding redundante, e reduzi o padding das páginas internas de 85→30 (também estava sobrando nelas). **Resultado no teste com a proposta real da KIE-TEC: caiu de 8 páginas pra 7.** O Mapa de People ainda cai numa página própria quando o texto de contexto é longo (é conteúdo real demais pra caber na capa, não dá pra garantir que sempre caiba em 1 página só) — mas agora essa página tem espaçamento correto, sem sobreposição, e isso **não foi confirmado visualmente pela Paty ainda**, só por mim via render com PyMuPDF. Vale mostrar pra ela antes de considerar 100% resolvido.
5. Teste de envio real mais recente: mandado pra `patricia@calirh.com` (nunca pro e-mail real do cliente — ver regra de segurança abaixo), usando o registro real da KIE-TEC (`proposal_id = 5239b3e6-8f31-4096-b756-8a9fb9e37c29`, `submission_id = 9af00834-78d5-4bae-814c-4a0c9c41a9e6`, protocolo `CALI-AEM-20260925-A6CC6D`).

## Erros que cometi / coisas que ela teve que apontar mais de uma vez — NÃO REPETIR

Isso é o mais importante deste documento. São os pontos onde eu errei, demorei, ou ela teve que corrigir explicitamente:

1. **Deploy "não pegando" silenciosamente.** O editor Monaco do dashboard Supabase tem um botão "Deploy updates" que, se clicado por coordenada fixa de tela, erra o alvo depois que o scroll do editor muda (código de tamanho diferente desloca o layout) — e **não dá erro nenhum**, só não aplica a mudança. Isso me custou vários ciclos de "conserto não funcionou" quando na verdade nunca tinha sido deployado. **Regra obrigatória agora**: sempre localizar o botão via `find` (nunca coordenada fixa), clicar no `ref` retornado, depois `find` de novo pro diálogo de confirmação que abre ("Confirm to deploy updates") e clicar no `ref` do botão *dentro* do diálogo (é um elemento diferente do botão que abriu o diálogo). Depois do deploy real, o indicador "M" (modified) ao lado do nome do arquivo some.
2. **Cache do raw.githubusercontent.com atrasa a sincronização.** Eu busco o conteúdo mais novo do `index.ts` direto do GitHub (via `fetch` dentro da aba do navegador, não dá pra colar 33KB de texto manualmente) pra jogar no Monaco antes de deployar. O Fastly CDN do GitHub cacheia por **path, ignorando query string** — then usar `?t=timestamp` pra "furar cache" não funciona, o cache dura uns 1-2 minutos depois do push. Se buscar rápido demais, pega a versão antiga e redeploya a versão antiga sem erro nenhum. **Regra**: depois de um `git push`, esperar uns 60-90s antes de buscar o raw file, e sempre conferir no resultado do fetch que o trecho novo (uma string que só existe na versão nova) está presente antes de jogar no Monaco.
3. **Função do PDF exige header `apikey`.** `curl` direto sem esse header dá 401. A chave pública está em `js/config.js` (`supabasePublishableKey`).
4. **Bug do footer com `position: absolute`**: tentativa inicial de posicionar o rodapé fixo com `position:"absolute", bottom:24` + `fixed:true` rendereizava num Y completamente errado (comprovei com bounding box exato via PyMuPDF — saía em Y≈565 em vez de Y≈818). Corrigido abandonando `position:"absolute"` pro rodapé: agora é uma linha normal no fluxo (`rodapeLinha`), no final do conteúdo de cada página.
5. **Numeração de página (`render: ({pageNumber,totalPages})=>...`) nunca funcionou** dentro do contexto aninhado que eu tinha. Decidi abandonar numeração de página de verdade e usar o protocolo estático no lugar — pragmático, não é a solução "certa" mas funciona sempre.
6. **Logo esticada na capa**: a caixa da imagem (110×26, proporção 4.23:1) não batia com a proporção real do arquivo fonte (309×146px ≈ 2.116:1), e o `Image` do react-pdf estica pra preencher a caixa se não disser `objectFit:"contain"`. Isso é um erro bobo de não ter checado a proporção real do arquivo antes de definir o tamanho da caixa — checar sempre.
7. **"01 ." em listas numeradas**: tinha item vazio ("." sobrando) que um `.filter(Boolean)` ingênuo não pega porque "." é uma string truthy. Precisa de regex pra filtrar placeholder (`!/^[.\-–—•\s]*$/.test(v)`).
8. **Prefixo duplicado "Ciclo 1 · Ciclo 1 · ..."**: o parser de texto livre do admin guarda a linha inteira digitada (incluindo um "Ciclo 1 ·" que a Paty já tinha digitado manualmente) como `cycle.title` quando não tem separador "|". Resolvido checando se o título já começa com "ciclo" antes de prefixar de novo.
9. **A real e mais grave: mandei e-mail de teste usando o e-mail real do cliente (KIE-TEC) uma vez antes de perceber o risco.** Isso mudou o status do registro real de produção para "enviada" e setou `sent_at`. **Regra permanente e inegociável: NUNCA mandar e-mail de teste/proposta pro e-mail real de um cliente, mesmo usando o registro de submissão real pra testar o PDF. Sempre trocar o campo "E-mail de envio" pra `patricia@calirh.com` antes de confirmar qualquer envio.**
10. **Bug raiz do overlap nas listas de duas colunas** (item 4 do estado atual): levei um tempo pra achar porque tentei várias correções superficiais primeiro (nested Text, `alignItems:"baseline"`, `lineHeight` explícito) antes de perceber que o problema era estrutural: `flex: 1` num item que é um entre vários **empilhados em coluna** faz o Yoga (motor de layout do react-pdf) dividir a altura disponível IGUALMENTE entre os irmãos em vez de cada um crescer pro tamanho do próprio conteúdo. Esse padrão (`flex:1` num item dentro de coluna com múltiplos irmãos) é a causa de pelo meno dois bugs distintos nesta sessão (overlap nas listas + provavelmente o hack de `marginTop: 36` usado antes pra "consertar" o Mapa de People, que pode ter sido a mesma causa raiz disfarçada — não foi revisitado, fica como item de limpeza opcional).

## Pendente agora mesmo

- **ATUALIZAÇÃO 18/11/2026, depois que outra IA assumiu**: ela confirmou que quer o PDF de referência (6 páginas) replicado **integralmente**, só trocando o fechamento por assinatura+QR. O gerador atual produz **7 páginas** pra proposta da KIE-TEC (não 6) porque o bloco "Mapa de People" (capa) ainda estoura pra uma página própria quando o texto de contexto é longo — ver item 4 do estado atual acima. Eu reduzi o padding duplicado e isso ajudou (era 8 páginas, caiu pra 7), mas não foi suficiente pra garantir 6 sempre. **Isso não está resolvido.** Causa raiz exata: na página 1 (capa), depois do bloco de "chips" (sinais que orientam a proposta), sobra só uns 65-70pt de altura disponível antes da margem inferior, e o bloco seguinte (`dualBox` = card "Mapa de People" + caixa "Leitura CALI", ambos com `wrap:false`) precisa de bem mais que isso pra caber — então ele inteiro pula pra página 2. Opções pra realmente garantir 6 páginas (nenhuma testada ainda):
  1. Tirar o `wrap:false` do `dualBox` pra permitir que a caixa "Leitura CALI" (que normalmente tem o texto mais longo) continue na página seguinte SEM TopoInner/cabeçalho — mas aí ela vaza pro meio de uma página sem moldura, o que pode parecer pior visualmente, não melhor.
  2. Reduzir o espaço do bloco de chips ("sinais que orientam a proposta") — está em grid 2 colunas com bastante padding (`chip`: paddingVertical 8), dá pra apertar.
  3. Diminuir um pouco o `fontSize`/`lineHeight` da `leituraTexto` e/ou do `mapaQuadrante` (ver aviso no item de limpeza do `marginTop:36`, abaixo).
  4. Perguntar pra Paty se tudo bem o "Mapa de People" ocupar uma página própria dedicada **sempre** (ou seja, assumir 7 páginas como padrão oficial em vez de tentar forçar 6) — mais simples e mais robusto a textos longos, mas muda a contagem de páginas que ela está comparando com a referência.
  Qualquer uma dessas precisa ser testada de novo com a proposta real da KIE-TEC (`protocolo CALI-AEM-20260925-A6CC6D`, é a mais longa que temos como teste de estresse) e confirmada visualmente com ela antes de considerar resolvido.
- **Confirmar visualmente com a Paty** que a correção do overflow da capa (item 4 acima) realmente resolveu o "página 2 toda errada" que ela reportou — eu só confirmei via render automático, ela ainda não viu o novo e-mail depois dessa correção específica.
- **Pergunta em aberto, não respondida por ela**: reverter o status do registro real da KIE-TEC de "enviada" de volta pra "Proposta em edição"? (Foi alterado sem querer durante os testes — ver erro nº 9 acima.) Perguntei duas vezes, ela não respondeu, focou nos bugs visuais.
- Item de limpeza opcional, não pedido por ela: revisitar o hack `mapaQuadrante: { marginTop: 36 }` (estilo da página 1, "Mapa de People") agora que a causa raiz real do bug de overlap em coluna foi entendida — pode ser que esse `marginTop` gigante não seja mais necessário, mas nunca foi testado reduzir, e ela nunca reclamou dele de novo depois do fix original, então **não mexer sem necessidade**.

## Próximo grande item — "Módulos complementares" (NÃO COMEÇAR sem ela confirmar)

Ela colou uma especificação completa (~10 seções numeradas) pedindo um novo recurso: módulos complementares opcionais (ex.: "Recrutamento e Seleção") pra propostas de Assessoria Estratégica, arquitetura genérica/reutilizável, preservando toda a lógica de dados/preço existente, com seção no PDF só quando o módulo está ativo, e um checklist de validação de 10 pontos. **Ela pediu explicitamente um diagnóstico/auditoria curto ANTES de qualquer implementação.**

**Texto completo da especificação, colado pela Paty (recuperado do histórico da sessão original em 18/11/2026, verbatim):**

> CALI Portal — Evolução do editor de propostas comerciais
>
> Preciso ampliar a flexibilidade do formulário administrativo de propostas da CALI RH, preservando integralmente o funcionamento atual.
>
> **Objetivo**
> Permitir que uma proposta de Assessoria Estratégica Mensal (CALI Partner ou CALI Full) receba módulos complementares opcionais, com precificação, escopo, condições e responsabilidades próprios.
> A alteração deve ser genérica e reutilizável. Não criar campos fixos para a Academia do Rock ou para qualquer cliente específico.
>
> **1. Auditoria antes das alterações**
> Analise o funcionamento atual do editor administrativo, calculadora, modelo de dados, regras de precificação, geração do PDF e persistência das propostas.
> Identifique o que já existe e pode ser reutilizado.
> Não recrie funcionalidades que já estejam implementadas. Preserve todos os dados e propostas existentes.
>
> **2. Preservar a política comercial atual**
> Os pacotes CALI Partner e CALI Full continuam com suas regras oficiais de precificação, capacidade e prazo.
> A taxa única de ativação já existente, equivalente a 20% da mensalidade final, deve permanecer separada da mensalidade.
> Exemplo:
> - Mensalidade final: R$ 3.910,00
> - Ativação: R$ 782,00
>
> Não duplicar a taxa, não criar uma segunda cobrança de ativação e não alterar sua base de cálculo.
> Descontos, adicionais e condições comerciais precisam manter a lógica atual, salvo aprovação expressa de nova regra.
>
> **3. Nova seção opcional: Módulos complementares**
> Adicionar uma seção expansível no editor com a opção: "Incluir módulo complementar". Por padrão, permanecer desativada.
> Quando ativada, permitir cadastrar um ou mais módulos com:
> - Nome do módulo.
> - Descrição e finalidade.
> - Tipo: recorrente, pontual ou personalizado.
> - Valor adicional, podendo ser zero em condição comercial aprovada.
> - Abrangência: unidades, áreas, públicos ou operações atendidas.
> - Entregas e atividades incluídas.
> - Capacidade ou quantidade contratada.
> - Periodicidade.
> - Responsabilidades da CALI.
> - Responsabilidades do cliente.
> - Limites e exclusões.
> - Condições específicas.
> - Garantias, quando aplicáveis.
> - Vigência do módulo.
>
> Permitir que um módulo seja incluído ou removido da proposta sem alterar o pacote principal.
> Os módulos devem ser opcionais, não cumulativos automaticamente e não podem gerar compromissos que não tenham sido expressamente configurados.
>
> **4. Primeiro módulo: Recrutamento e Seleção**
> Criar um modelo reutilizável de R&S complementar. Campos específicos:
> - Quantidade de processos seletivos incluídos por período.
> - Periodicidade mensal ou personalizada.
> - Cargos e níveis elegíveis.
> - Unidades atendidas.
> - Quantidade máxima de processos simultâneos.
> - Etapas contempladas.
> - Avaliação técnica.
> - Entrevista estruturada e avaliação comportamental não clínica.
> - Critérios de apresentação dos candidatos.
> - Responsável pela entrevista e decisão final.
> - Custos adicionais de divulgação ou ferramentas.
> - Garantia de reposição configurável.
> - Quantidade máxima de reposições.
> - Prazo para solicitar reposição.
> - Condições que invalidam a garantia.
> - Regras para alterações de perfil após abertura.
> - Tratamento de processos não concluídos no período.
> - Política de vagas não utilizadas.
>
> A quantidade padrão pode ser de um processo mensal, mas deve permanecer editável.
> Não prometer contratação em prazo determinado nem resultado garantido.
> A execução de R&S deve ser tratada como capacidade operacional específica. Não presumir que esteja incluída nas horas executivas do pacote principal.
>
> **5. Outros módulos**
> A estrutura deverá permitir futuramente módulos de: Desenvolvimento de lideranças, Treinamentos específicos, Marca empregadora, Comunicação interna, Estruturação de processos, Projetos de cultura, Outros serviços personalizados.
> Esses módulos não precisam ser cadastrados ou precificados agora. Apenas garantir que a arquitetura comporte sua inclusão futura sem refatoração significativa.
>
> **6. Abrangência contratual**
> Permitir informar de forma estruturada: empresa contratante, unidades incluídas, quantidade de unidades atendidas, público ou funções abrangidas, empresas/franquias/unidades excluídas, possibilidade de expansão futura mediante nova avaliação e contratação.
> Esses campos devem ser opcionais e aparecer no PDF somente quando preenchidos.
> A inclusão de uma empresa com várias filiais não pode significar automaticamente atendimento integral à rede.
>
> **7. Condições comerciais**
> Preservar a calculadora existente e adaptar sua apresentação para discriminar: valor-base do pacote, adicionais ou módulos contratados, descontos ou condições comerciais, mensalidade final, taxa única de ativação, cobranças pontuais (quando existirem), prazo mínimo, horas executivas mensais, capacidade operacional complementar (quando houver).
> Não somar automaticamente a mensalidade multiplicada pela vigência como se fosse uma cobrança imediata.
> Verificar como descontos e adicionais impactam a base de cálculo da ativação, preservando a regra oficial vigente.
>
> **8. PDF comercial**
> Quando houver módulos complementares, apresentar uma seção própria: "Módulos complementares contratados". Exibir apenas os módulos ativados. Separar claramente: escopo da assessoria principal, entregas complementares, condições e limitações de cada módulo, abrangência do atendimento, valores e condições comerciais.
> Se nenhum módulo estiver selecionado, o PDF deve manter sua apresentação atual, sem páginas ou espaços vazios adicionais.
> Manter a identidade visual da CALI, incluindo tipografia, paleta, hierarquia editorial e tratamento correto de quebras de página.
>
> **9. Persistência e compatibilidade**
> Preservar a leitura e edição de propostas antigas. Não alterar retroativamente contratos, propostas enviadas ou dados comerciais existentes.
> Se for necessário modificar o banco de dados, utilizar migração controlada, campos opcionais e compatibilidade com os registros anteriores. Evitar criar estruturas paralelas ou duplicadas.
>
> **10. Validação obrigatória**
> Antes de concluir, testar: (1) proposta convencional sem módulos; (2) proposta com um módulo de R&S; (3) proposta com múltiplos módulos; (4) módulo com valor zero; (5) módulo com cobrança recorrente; (6) módulo com cobrança pontual; (7) remoção de módulo antes do envio; (8) reabertura de proposta salva; (9) geração de PDF em todos os cenários; (10) cálculo da ativação, descontos e mensalidade.
> Não alterar os sistemas públicos de briefing ou o fluxo de recebimento de propostas sem necessidade técnica comprovada.
>
> **Entrega esperada**
> Apresentar primeiro um diagnóstico curto do que já existe e do que precisa ser acrescentado. Implementar somente as alterações necessárias, preservando o comportamento atual. Ao final, informar os arquivos modificados, migrações aplicadas, testes executados, riscos e eventuais pendências.
> Não modificar a Matriz Institucional da CALI automaticamente. Qualquer alteração nas regras oficiais de serviços depende de aprovação expressa.

Essa funcionalidade **ainda não existe** em lugar nenhum do editor (`admin-editar.js`) nem do gerador de PDF — é trabalho 100% novo a fazer, não algo que foi começado e ficou pela metade. A entrega esperada por ela pede explicitamente um **diagnóstico curto primeiro**, antes de qualquer código.

**Regra dela**: não iniciar essa feature até (a) os bugs visuais atuais do PDF estarem 100% confirmados corrigidos por ela, e (b) ela dar o sinal verde explícito.

## Outro item mencionado, sem detalhamento ainda

Ela mencionou que vai ser necessário inserir a possibilidade de "vaga" (posição de recrutamento) em propostas de assessoria de RH, mas disse que ainda vai definir os detalhes. Nenhuma ação necessária até ela detalhar.

## Regras de segurança padrão pra este projeto (sempre válidas)

- Nunca mandar e-mail de teste/proposta pro endereço real de um cliente. Sempre trocar pra `patricia@calirh.com` antes de confirmar envio, mesmo usando um registro de submissão real pra testar.
- Escrita em banco de produção (mesmo via SQL Editor) precisa de permissão explícita dela antes.
- Deploy de Edge Function sempre pelo navegador logado (Claude in Chrome), nunca tentar achar credenciais ou burlar login.

## Como testar rapidamente (sem precisar da Paty)

```bash
curl -s "https://tpzcytjbglwzhgxrzzzb.supabase.co/functions/v1/portal-proposal-pdf?protocolo=CALI-AEM-20260925-A6CC6D" \
  -H "apikey: sb_publishable_7iOboMbIizp5dfqpiaehLg_xRAan-U2" \
  -o proposta.pdf
```

Depois inspecionar com PyMuPDF (`pip install pymupdf`, ou já instalado em `/Users/oiazumi/Library/Python/3.9/lib/python/site-packages` — rodar `python3` sem `-I` nesse caso específico, ou adicionar o path manualmente com `-I`) pra pegar contagem de páginas, texto por página e bounding boxes exatos — muito mais confiável que só olhar screenshot pra provar overlap/overflow.
