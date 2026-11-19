# CALI Portal — Evolução do editor de propostas comerciais

Preciso ampliar a flexibilidade do formulário administrativo de propostas da CALI RH, preservando integralmente o funcionamento atual.

## Objetivo

Permitir que uma proposta de Assessoria Estratégica Mensal (CALI Partner ou CALI Full) receba módulos complementares opcionais, com precificação, escopo, condições e responsabilidades próprios.

A alteração deve ser genérica e reutilizável. Não criar campos fixos para a Academia do Rock ou para qualquer cliente específico.

## 1. Auditoria antes das alterações

Analise o funcionamento atual do editor administrativo, calculadora, modelo de dados, regras de precificação, geração do PDF e persistência das propostas.

Identifique o que já existe e pode ser reutilizado.

Não recrie funcionalidades que já estejam implementadas. Preserve todos os dados e propostas existentes.

## 2. Preservar a política comercial atual

Os pacotes CALI Partner e CALI Full continuam com suas regras oficiais de precificação, capacidade e prazo.

A taxa única de ativação já existente, equivalente a 20% da mensalidade final, deve permanecer separada da mensalidade.

Exemplo:
- Mensalidade final: R$ 3.910,00
- Ativação: R$ 782,00

Não duplicar a taxa, não criar uma segunda cobrança de ativação e não alterar sua base de cálculo.

Descontos, adicionais e condições comerciais precisam manter a lógica atual, salvo aprovação expressa de nova regra.

## 3. Nova seção opcional: Módulos complementares

Adicionar uma seção expansível no editor com a opção:

"Incluir módulo complementar"

Por padrão, permanecer desativada.

Quando ativada, permitir cadastrar um ou mais módulos com:

- Nome do módulo.
- Descrição e finalidade.
- Tipo: recorrente, pontual ou personalizado.
- Valor adicional, podendo ser zero em condição comercial aprovada.
- Abrangência: unidades, áreas, públicos ou operações atendidas.
- Entregas e atividades incluídas.
- Capacidade ou quantidade contratada.
- Periodicidade.
- Responsabilidades da CALI.
- Responsabilidades do cliente.
- Limites e exclusões.
- Condições específicas.
- Garantias, quando aplicáveis.
- Vigência do módulo.

Permitir que um módulo seja incluído ou removido da proposta sem alterar o pacote principal.

Os módulos devem ser opcionais, não cumulativos automaticamente e não podem gerar compromissos que não tenham sido expressamente configurados.

## 4. Primeiro módulo: Recrutamento e Seleção

Criar um modelo reutilizável de R&S complementar.

Campos específicos:

- Quantidade de processos seletivos incluídos por período.
- Periodicidade mensal ou personalizada.
- Cargos e níveis elegíveis.
- Unidades atendidas.
- Quantidade máxima de processos simultâneos.
- Etapas contempladas.
- Avaliação técnica.
- Entrevista estruturada e avaliação comportamental não clínica.
- Critérios de apresentação dos candidatos.
- Responsável pela entrevista e decisão final.
- Custos adicionais de divulgação ou ferramentas.
- Garantia de reposição configurável.
- Quantidade máxima de reposições.
- Prazo para solicitar reposição.
- Condições que invalidam a garantia.
- Regras para alterações de perfil após abertura.
- Tratamento de processos não concluídos no período.
- Política de vagas não utilizadas.

A quantidade padrão pode ser de um processo mensal, mas deve permanecer editável.

Não prometer contratação em prazo determinado nem resultado garantido.

A execução de R&S deve ser tratada como capacidade operacional específica. Não presumir que esteja incluída nas horas executivas do pacote principal.

## 5. Outros módulos

A estrutura deverá permitir futuramente módulos de:

- Desenvolvimento de lideranças.
- Treinamentos específicos.
- Marca empregadora.
- Comunicação interna.
- Estruturação de processos.
- Projetos de cultura.
- Outros serviços personalizados.

Esses módulos não precisam ser cadastrados ou precificados agora. Apenas garantir que a arquitetura comporte sua inclusão futura sem refatoração significativa.

## 6. Abrangência contratual

Permitir informar de forma estruturada:

- Empresa contratante.
- Unidades incluídas.
- Quantidade de unidades atendidas.
- Público ou funções abrangidas.
- Empresas, franquias ou unidades excluídas.
- Possibilidade de expansão futura mediante nova avaliação e contratação.

Esses campos devem ser opcionais e aparecer no PDF somente quando preenchidos.

A inclusão de uma empresa com várias filiais não pode significar automaticamente atendimento integral à rede.

## 7. Condições comerciais

Preservar a calculadora existente e adaptar sua apresentação para discriminar:

- Valor-base do pacote.
- Adicionais ou módulos contratados.
- Descontos ou condições comerciais.
- Mensalidade final.
- Taxa única de ativação.
- Cobranças pontuais, quando existirem.
- Prazo mínimo.
- Horas executivas mensais.
- Capacidade operacional complementar, quando houver.

Não somar automaticamente a mensalidade multiplicada pela vigência como se fosse uma cobrança imediata.

Verificar como descontos e adicionais impactam a base de cálculo da ativação, preservando a regra oficial vigente.

## 8. PDF comercial

Quando houver módulos complementares, apresentar uma seção própria:

"Módulos complementares contratados"

Exibir apenas os módulos ativados.

Separar claramente:
- Escopo da assessoria principal.
- Entregas complementares.
- Condições e limitações de cada módulo.
- Abrangência do atendimento.
- Valores e condições comerciais.

Se nenhum módulo estiver selecionado, o PDF deve manter sua apresentação atual, sem páginas ou espaços vazios adicionais.

Manter a identidade visual da CALI, incluindo tipografia, paleta, hierarquia editorial e tratamento correto de quebras de página.

## 9. Persistência e compatibilidade

Preservar a leitura e edição de propostas antigas.

Não alterar retroativamente contratos, propostas enviadas ou dados comerciais existentes.

Se for necessário modificar o banco de dados, utilizar migração controlada, campos opcionais e compatibilidade com os registros anteriores.

Evitar criar estruturas paralelas ou duplicadas.

## 10. Validação obrigatória

Antes de concluir, testar:

1. Proposta convencional, sem módulos.
2. Proposta com um módulo de R&S.
3. Proposta com múltiplos módulos.
4. Módulo com valor zero.
5. Módulo com cobrança recorrente.
6. Módulo com cobrança pontual.
7. Remoção de módulo antes do envio.
8. Reabertura de proposta salva.
9. Geração de PDF em todos os cenários.
10. Cálculo da ativação, descontos e mensalidade.

Não alterar os sistemas públicos de briefing ou o fluxo de recebimento de propostas sem necessidade técnica comprovada.

## Entrega esperada

Apresentar primeiro um diagnóstico curto do que já existe e do que precisa ser acrescentado.

Implementar somente as alterações necessárias, preservando o comportamento atual.

Ao final, informar os arquivos modificados, migrações aplicadas, testes executados, riscos e eventuais pendências.

Não modificar a Matriz Institucional da CALI automaticamente. Qualquer alteração nas regras oficiais de serviços depende de aprovação expressa.