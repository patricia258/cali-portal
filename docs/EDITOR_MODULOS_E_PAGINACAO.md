# Editor de propostas: módulos, condições e conteúdo variável

Implementação de 19/11/2026, a partir dos ajustes aprovados por Patrícia. Este registro descreve o estado atual e pode evoluir.

## Campos e referências

- Ativação: percentual inicial de 20%, editável entre 0 e 100%, descrição editável e cálculo automático sobre o valor final do pacote após desconto. Valores monetários arredondados em centavos; 3.910 × 15% = 586,50.
- Apresentação: nome, categoria, subtítulo e natureza do pacote; condições importantes; introdução e lista de próximos passos.
- Referências do pacote preenchem inicialmente escopo, solução, ciclos, cadência, diferenciais, exclusões e condições. Ao mudar o pacote, campos que ainda correspondem às referências são atualizados; personalizações são mantidas. O botão de preenchimento explícito permite reaplicar essas referências.
- Abrangência opcional: contratante, unidades, quantidade, públicos, exclusões e expansão.
- Múltiplos módulos opcionais, sem ativação por padrão: nome, finalidade, cobrança, valor, abrangência, entregas, capacidade, periodicidade, responsabilidades, limites, condições, garantias e vigência.
- Modelo R&S: um processo mensal inicial editável; todos os campos específicos da especificação disponíveis. Demais compromissos ficam para preenchimento explícito, sem promessa automática de contratação ou prazo.
- Valores recorrentes, pontuais e personalizados discriminados. Módulos não recebem automaticamente desconto/teto do pacote e não alteram a base da ativação. A vigência não é multiplicada como pagamento imediato.

## Persistência e compatibilidade

Novos campos opcionais em calculator_data, sem migração de banco e sem alterar a matriz de serviços. Dados desconhecidos do objeto são preservados no salvamento. Contato da proposta salvo como snapshot, sem reescrever o briefing original ao salvar a proposta.

Rascunhos permanecem editáveis. Para propostas que já não são rascunho, salvar cria nova versão; protocolo documental recebe sufixo Vn. A versão anterior não é sobrescrita. Rascunhos usam atualização condicional por updated_at para evitar sobrescrita de outra aba. Há proteção contra duplo clique no salvamento.

## PDF e espaçamento

Removidos os limites artificiais de 7 entregas, 6 ciclos e listas curtas. Fluxo do React PDF com blocos delimitados permite páginas adicionais, sem cortar o conteúdo. Listas extensas são divididas em linhas ou trechos que cabem na página; ciclos incluem foco, objetivo e duração. Títulos têm espaço inferior e proteção contra separação do primeiro conteúdo. Cartões de sinais têm maior espaço interno. Cabeçalho é mantido nas continuações da capa, além dos cabeçalhos das seções internas. Numeração usa a quantidade real de páginas.

Módulos e abrangência aparecem em seções próprias somente quando ativados. Prévia e download continuam usando o PDF canônico, sem segundo modelo HTML.

## Verificação

- node --check dos módulos de interface; git diff --check.
- Testes de cálculo e validação em tests/proposal-extensions.test.mjs.
- Interface local: troca PARTNER/FULL, preservação de personalização e reaplicação explícita, ativação de 15%, inclusão/remoção de R&S, módulo pontual, abrangência, salvamento e reabertura. Salvamento de 12 entregas e 9 ciclos, acima dos limites antigos.
- Geração local de PDFs: sem módulos, R&S zero, R&S recorrente, múltiplos módulos, pontual, personalizado, módulo removido, módulos desativados, ativação 15%, abrangência e conteúdo extenso.
- Modelo convencional, módulos removidos e desativados: seis páginas. Estresse: 29 páginas, com os marcadores finais de todas as seções presentes, sem texto na área do rodapé e com cabeçalho nas continuações. Inspeção visual de páginas renderizadas.
- Nenhum e-mail de cliente foi disparado e nenhuma proposta real recebeu módulos ou condições de teste.

## Publicação conferida

Commit funcional 709556e no domínio oficial. Frontend retornou HTTP 200 com o editor, módulo de campos e leitura de snapshots publicados. Funções de PDF e envio publicadas pelo painel autenticado do Supabase; teste autenticado de geração da proposta Academia do Rock retornou HTTP 200 e corpo %PDF-1.7. Não houve disparo de e-mail.

Teste adicional local de proposta marcada como enviada: salvar criou ID novo, versão 2 e protocolo V2; 12 entregas e 9 ciclos foram preservados. Conferência visual do editor e dos campos de ativação registrada em captura local. A sessão real da usuária não foi usada para inserir condições de teste.

## Fidelidade visual à referência — 20/11/2026

Restaurados: moldura marfim do produto selecionado com borda dourada, nome, subtítulo e lima discreta; painel de explicação com fundo marfim e filete dourado; filetes contínuos nos subtítulos; cartões de responsabilidades com fundo suave, cantos retos, borda superior dourada e rótulos bordô. Faixa superior em degradê vetorial dourado/marfim em todas as páginas, inclusive capa e continuações.

Verificação local dos onze cenários de PDF mantida: modelo convencional em seis páginas, estresse em 29, marcadores finais de conteúdo presentes, sem colisão com o rodapé e faixa verificada em todas as folhas. A alteração é no gerador canônico, utilizado tanto pela prévia do portal quanto pelo download e pelo anexo de e-mail; não altera valores nem dados dos clientes.

## Composição aprovada em 20/11/2026

A instrução mais recente delimita especificamente a página 3 do CALI Partner. Escopo, cadência, ciclos e responsabilidades agora dividem essa página. O editor mostra contagem de caracteres e itens e recusa salvar quando o limite for excedido, sem cortar textos. Limites atuais por bloco: escopo 800 caracteres/8 itens; cadência 320/4; ciclos 420/6; responsabilidades da CALI e do cliente 220/3 cada. O gerador também confere a paginação real e retorna orientação para encurtar o conteúdo caso uma composição excepcional ultrapasse a página. Essa exceção do Partner substitui a liberdade de paginação anterior apenas para esse conjunto; os outros modelos e seções continuam com páginas adicionais conforme necessário.

Limites/exclusões migraram para “Limites e observações da contratação” na seção comercial. A abrangência não cria uma página própria: a apresentação padrão inclui apenas observações importantes (exclusões e expansão); o editor permite habilitar o resumo compacto de unidades/público junto das observações. Dados estruturados são preservados.

Cada módulo complementar passou a ser apresentado como produto, com moldura, nome, descrição, condição de cobrança e agrupamentos de capacidade, entregas, responsabilidades e garantias. Campos vazios não criam cartões vazios; valores zero aparecem como inclusão na contratação, sem repetir linhas financeiras de R$ 0.

A página comercial segue a última referência: cabeçalho em moldura; quadro bordô com referência, percentual e valor do desconto, mensalidade e ativação; cartões de capacidade, prazo, atuação e recrutamento quando contratado; condições, limites e bônus. A descrição da condição comercial é exibida em destaque, preservando sua data real. Cláusulas relacionadas são agrupadas mantendo o texto salvo. A indicação genérica de pagamento é omitida quando apenas repete o cronograma já descrito. Valores e regras de cálculo não foram alterados.

### Verificação desta composição

- Quatro testes unitários passaram, incluindo equivalência da contagem dos ciclos, excesso de itens/caracteres e preservação do texto recusado.
- Editor local: aviso de excesso, bloqueio de salvamento, correção para estado válido, escolha de apresentação da abrangência, salvamento e prévia de seis páginas.
- Leitura somente da proposta real da Academia do Rock pelo painel autenticado; nenhuma alteração em seu registro. Renderização com esses dados: seis páginas; responsabilidades na 3, R&S na 4 e condições/limites/bônus na 5; valores e data da condição comercial conferidos.
- Limites máximos usuais do Partner renderizados em uma página; conteúdo muito acima recusado pelo gerador, sem truncamento.
- Onze cenários de geração foram repetidos; estresse no CALI Full resultou em 28 páginas, com os nove marcadores finais presentes e sem colisão do texto com a área do rodapé. O teste extenso usa Full porque o Partner agora possui a restrição expressa acima.
