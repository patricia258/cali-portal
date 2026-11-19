# Integração da proposta no Portal

18/11/2026. Correção da divergência entre a prévia HTML antiga e o PDF do servidor.

## Implementado
- A página /proposta/:id carrega o PDF canônico por proposal_id e mostra suas páginas no próprio portal com PDF.js local, sem dependência do plugin do navegador.
- Salvar PDF baixa o mesmo Blob exibido. O mecanismo antigo window.print e o segundo modelo HTML foram removidos da página de propostas.
- Envio por e-mail solicita o mesmo gerador pelo ID da proposta; recusa envio quando a versão salva mudou depois da prévia. Nenhum e-mail foi disparado na validação.
- Link Editar proposta leva ao editor do briefing correto.
- Calculadora mostra Ativação única 20%, automaticamente sobre finalUnit após descontos, separada da mensalidade. Mantido o arredondamento já usado no gerador.
- O gerador também reconhece os serviços mensais em registros antigos sem payment.method, sem depender apenas da forma de pagamento para exibir ativação.

## Campos conferidos
Já editáveis: contato/empresa, contexto, sinais, leitura executiva, Mapa de People, introdução da solução, justificativa, objetivo, resultados, diferenciais, escopo, ciclos, cadência, responsabilidades, roadmap, exclusões, bônus, pagamento, valor-base, adicionais, desconto, mensalidade final, prazo, horas e validade.

A ativação é derivada automaticamente, não uma segunda cobrança editável. Sua descrição e as condições institucionais fixas continuam vindo do modelo. Módulos R&S e abrangência estruturada continuam sendo a evolução especificada em ESPECIFICACAO_MODULOS_COMPLEMENTARES.md; não foram disfarçados como funcionalidades existentes nesta correção de integração.

## Validação
Node --check em proposta.js/admin-editar.js. Teste local de interface com dados conhecidos: seis páginas renderizadas em canvas; botão Salvar PDF habilitado; download SHA-256 idêntico ao PDF da prévia; modal de destinatário abre/fecha sem envio. Funções de geração e envio publicadas pelo painel do Supabase. Arquivos frontend verificados no domínio oficial. Geração em produção por ID de KIE-TEC e Academia do Rock: seis páginas; ativação 782 e 780 respectivamente. Teste de e-mail real não repetido nesta alteração. Nenhum valor comercial ou status de proposta foi salvo.

Limite da inspeção visual em produção: a captura nativa do Chrome retornou apenas uma superfície uniforme e a árvore de acessibilidade não expôs o conteúdo da página. Por isso, a conferência visual de canvas foi local; em produção foram verificados os arquivos publicados e os PDFs gerados pela função, sem afirmar uma inspeção visual completa da sessão da usuária.

## Evolução em 19/11/2026

Os módulos, a abrangência, a ativação editável e a paginação variável foram implementados. O estado atual e as verificações estão descritos em EDITOR_MODULOS_E_PAGINACAO.md. As pendências acima retratam o momento original deste documento.
