# Portal CALI — UX brief

Fase 2 · Convergir. Conceito escolhido: orientação pelo momento da empresa com acesso direto a todos os serviços. Fluxo e inventário aprovados pela proprietária nesta conversa.

## Problema e público
Visitantes precisam reconhecer qual serviço atende ao seu contexto e iniciar o briefing com confiança. Público: founders, diretores e profissionais de RH, em celular e desktop; parte conhece a oferta, parte conhece apenas seu problema.

## Conceito escolhido
“Sei o que preciso resolver; quero identificar o trabalho correspondente.” O contexto orienta a leitura dos nove serviços. Nenhum questionário ou filtro obrigatório antecede o briefing.

Alternativas não escolhidas: catálogo puro favorece quem conhece a oferta, mas ajuda menos na interpretação; orientação por perguntas acrescenta etapas e regras comerciais. A proprietária aceitou o conceito 2 recomendado, com atalho ao catálogo.

## Jornada
| Etapa | Objetivo e ação | Pensamento / sentimento | Dificuldade | Resposta de UX |
|---|---|---|---|---|
| Chegada por indicação ou link | Entender onde chegou | “É aqui que conto minha necessidade?” | Confundir portal com site institucional | Explicar a finalidade e identificar a CALI |
| Reconhecer o momento | Localizar a necessidade | Incerteza sobre nomes dos serviços | Comparar ofertas parecidas | Contextos com diferenças breves e concretas |
| Escolher | Confirmar serviço e abrir briefing | Confiança se o encaixe estiver claro | Receio de escolher errado | Liberdade para consultar todos e opção personalizada |
| Responder | Preencher o briefing existente | Expectativa de atenção pessoal | Perder contexto na transição | Nome do serviço e saudação da Patrícia preservados |
| Enviar e aguardar | Entender o próximo passo | Segurança sobre o recebimento | Não saber quem lê ou quando retorna | Confirmação existente e explicação sem prometer prazo novo |
| Retornar | Encontrar rapidamente o serviço conhecido | Menos necessidade de orientação | Repetir exploração | Atalho direto para todos os serviços |

## Arquitetura e inventário
Uma única LP com seções; os itens abaixo não são páginas adicionais.

| Parte / tipo | Finalidade e conteúdo prioritário | Ação principal | Ações secundárias | Deve ficar óbvio |
|---|---|---|---|---|
| Abertura / chave | Identidade, finalidade do portal, como o briefing prepara a conversa | Encontrar meu serviço | Ver todos os serviços | É uma entrada para uma conversa com a CALI |
| Escolha por momento / chave | Três contextos e breve descrição; serviços acessíveis na mesma página | Consultar o contexto pertinente | Ver todos | A organização ajuda e não limita a escolha |
| Oferta de cada contexto / chave | Nome do serviço, quando faz sentido, diferença de modalidade, destino | Abrir briefing do serviço | Explorar outro contexto | O que muda entre as opções |
| Todos os serviços / apoio | Índice com nove nomes e respectivos destinos | Abrir briefing escolhido | Voltar à orientação | Quem já conhece a oferta pode ir direto |
| Necessidade diferente / apoio | Explicar que desafios fora dos exemplos também podem ser descritos | Abrir Solução Personalizada | Conversar com a Patrícia pelo contato existente | Não é preciso forçar um enquadramento |
| Próximos passos / apoio | Responder → leitura pessoal → contato/proposta conforme análise | Voltar à escolha | Contato existente | Não há promessa de proposta automática ou prazo não validado |
| Rodapé / apoio | Marca, privacidade, institucional, canais oficiais e acesso administrativo discreto | Consultar privacidade | Demais links existentes | Identidade e canais reais |

### Agrupamento proposto
1. **Dar direção e estruturar o RH:** Assessoria Estratégica; CALI Build; Diagnóstico Executivo de People.
   - Assessoria: acompanhamento recorrente e direção junto à liderança.
   - Build: estruturação assistida, com participação da execução interna.
   - Diagnóstico: leitura do cenário para definir prioridades antes de avançar.
2. **Desenvolver pessoas e lideranças:** Mentoria para profissionais de RH; Shadowing de Liderança; Treinamentos e Palestras.
   - Distinguir desenvolvimento do profissional, observação da liderança em situações reais e intervenção com grupos.
3. **Alinhar cultura e reputação:** Cultura e Direção; Marca Empregadora.
   - Distinguir alinhamento interno de cultura e liderança da reputação como empregadora.
4. **Necessidade diferente:** Solução Personalizada, sempre acessível e também no índice geral.

Esses agrupamentos são orientação editorial, não critérios de elegibilidade. Todos os nove destinos continuam disponíveis. O índice pode referenciar os mesmos serviços sem reproduzir suas descrições integralmente.

Navegação global: início do portal, escolha por momento, todos os serviços, contato. Links institucionais e de privacidade permanecem no rodapé. Navegação contextual: âncoras entre contextos e links dos briefings. Slugs existentes preservados.

## Fluxos
### Escolher a partir de uma necessidade
1. Abrir a LP e compreender sua finalidade.
2. Ir à escolha de serviços e reconhecer um contexto.
3. Comparar as ofertas desse contexto.
4. Abrir o briefing existente.
Alternativa: consultar o índice de todos os serviços. Recuperação de indecisão: Solução Personalizada ou contato. Voltar do briefing permite rever a escolha; não introduzir promessa de preservação de respostas que o produto não fornece.

### Abrir um serviço conhecido
1. Abrir a LP.
2. Acionar “Ver todos os serviços”.
3. Escolher pelo nome.
4. Acessar diretamente o briefing.
Links externos já compartilhados de cada serviço continuam válidos.

### Entender o que acontece depois
1. Ler a explicação breve de próximos passos.
2. Entender que a Patrícia analisa o contexto pessoalmente.
3. Voltar à escolha ou usar o contato existente.
Sem prazo novo de resposta nem contratação automática.

## Estados e recuperação
- LP estática: sem estado vazio normal. Conteúdo de serviços deve permanecer disponível se movimentos ou scripts opcionais falharem.
- Carregamento: imagens com dimensões reservadas; texto e links não aguardam animação.
- Falha de rede ao navegar: comportamento do navegador, com navegação normal por links; não inventar confirmação.
- Foco e seleção de contexto: localização reconhecível, sem depender só de cor.
- Primeiro acesso: orientação breve. Retorno: catálogo direto, sem login ou repetição de perguntas.
- Sucesso é a abertura do briefing correto; confirmação de envio permanece na tela existente.
- Formulário, erros de validação, envio, painel e proposta existentes ficam fora do redesenho desta fase.

## Hero screen
A abertura da LP, acompanhada do acesso à escolha por momento, deve estabelecer a linguagem de UI: é onde o visitante entende a função do portal e reconhece a mudança de marca. O serviço deve ser alcançável rapidamente em celular e desktop.

## Princípios
1. A necessidade vem antes do jargão comercial.
2. Orientar sem exigir etapas adicionais.
3. Mostrar diferenças reais entre ofertas.
4. Preservar a presença pessoal da Patrícia.
5. Movimento nunca impede leitura, foco ou navegação.

Voz: direta, humana, segura; frases curtas e informativas, sem superlativos ou promessas fabricadas.

## Cobertura
Todos os requisitos essenciais atendidos pelo fluxo. Nenhuma nova integração, coleta de dados, regra comercial ou sistema de recomendação. A linguagem visual será resolvida na fase 3. Agrupamento e inventário aprovados; seguir para rodada 1 de UI.
