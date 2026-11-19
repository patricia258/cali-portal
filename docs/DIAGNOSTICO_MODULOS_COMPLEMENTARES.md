# Diagnóstico inicial: módulos complementares

18/11/2026. Auditoria de código local, sem alterações funcionais, deploy ou escrita em banco.

## Reutilização
- js/admin-editar.js já carrega e edita proposta, escopo, horas, prazo, pagamento e conteúdo editorial. Persiste em cali_proposals, com calculator_data (editorialVersion:2), scope_items e valores comerciais.
- js/services.js calculateProposal já trata preço-base, adicionais, descontos limitados, faixas/tetos por pacote, ajuste manual e valor mensal sem multiplicação pela vigência. Essa função é compartilhada com o sistema público; a extensão pode ficar no editor sem mudar o briefing.
- js/proposal-profiles.js já fornece modelos editoriais por serviço. O modelo R&S pode ser adicionado como catálogo separado reutilizável.
- O PDF usa calculator_data; pode receber módulos opcionais e abrangência sem nova tabela a princípio. Registros antigos sem os novos campos continuam no caminho atual.
- A taxa única de ativação já está no PDF em 20% de final_unit para pagamento mensal. Não existe uma segunda ativação a criar.

## O que falta
- Seção desativada por padrão, com inclusão/remoção e edição de múltiplos módulos.
- Estrutura versionada opcional em calculator_data para módulos e abrangência contratual, preservando dados existentes no salvamento.
- Modelo R&S com todos os campos da especificação, inclusive capacidade operacional, simultaneidade, etapas, responsabilidades e garantia configurável. Sem promessas automáticas de prazo ou contratação.
- Resumo financeiro com linhas independentes de pacote, módulos recorrentes, pontuais e condições personalizadas; capacidade operacional separada das horas executivas.
- Seção condicional no PDF e paridade da prévia HTML, sem alterações de estrutura quando não houver módulos.
- Os dez cenários de validação solicitados ainda precisam ser implementados/executados para a nova funcionalidade.

## Riscos concretos encontrados
1. Não é seguro inserir os módulos no campo extras existente: eles poderiam ser absorvidos pelo teto/faixa do pacote e pelo desconto do pacote. Tipos de cobrança precisam permanecer discriminados.
2. O tratamento de módulos na base da ativação e nos descontos não está definido na política atual, que só conhece final_unit. A inclusão automática de módulos na base ou a aplicação automática de desconto a eles seria uma regra comercial nova. Essa decisão precisa ser explícita antes do cálculo novo.
3. A ativação atual usa Math.round(finalUnit * 0.2), arredondando para reais inteiros. O exemplo 3.910 → 782 confere, mas valores com centavos exigem conferência da política de arredondamento, sem mudança silenciosa.
4. saveProposal reconstrói calculator_data e faz PATCH do registro existente, com status rascunho; depois altera a submissão para edicao. Assim, o fluxo atual pode alterar uma proposta enviada se ela for reeditada. A compatibilidade solicitada demanda proteção/versionamento antes de ampliar esse caminho.
5. O registro eletrônico atual é reaproveitado por protocolo, e o hash inicial contém id, final_unit, scope_items e data, não todo o conteúdo editorial. Módulos alterados depois da emissão exigem análise da estratégia de versão/documento emitido, preservando emissões antigas.
6. Existem dois caminhos visuais: HTML em js/proposta.js e PDF em portal-proposal-pdf. A alteração em apenas um pode produzir divergências na prévia e no documento.
7. O PDF base ainda tem divergência confirmada: sete páginas em vez das seis do arquivo de referência, com Mapa de People deslocado para uma página quase vazia. A referência aceita é a reprodução integral do modelo, com a única variação visual no fechamento assinatura + registro eletrônico/QR, sem botão.

## Sequência registrada
A especificação completa está salva ao lado deste diagnóstico. A prioridade pendente continua sendo a paridade do PDF base com a referência. Conforme o handoff, a implementação de módulos aguarda a confirmação visual do PDF pela proprietária e o sinal verde para a funcionalidade. Esta auditoria não implementa nem libera o recurso.

## Atualização após a correção de integração

Os itens 6 e 7 do diagnóstico foram resolvidos no commit 6fff78f: a prévia deixou de usar um segundo modelo HTML e renderiza o PDF canônico; o modelo base foi conferido com seis páginas em produção. A ativação também passou a aparecer na calculadora administrativa. Os demais itens de módulos continuam pendentes. Este registro mantém o diagnóstico original para contexto, sem transformá-lo em regra permanente.
