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
