# Editor visual de propostas — 20/11/2026

Direção aprovada: A, edição diretamente no documento. Os estudos A/B/C continuam em `outputs/editor-visual` no workspace da conversa; não são páginas públicas do portal.

## Funcionamento

- `/admin/editar.html?id=<submission>` mantém sessão administrativa e os controles de dados existentes.
- Campos são apresentados por seção em um painel lateral. O documento é o PDF real renderizado com PDF.js local, e alvos sobre o texto abrem a edição no bloco.
- Não há HTML alternativo tentando prever a paginação. Cada prévia passa por `portal-proposal-pdf` e mostra o mesmo mecanismo de composição da exportação.
- O payload de prévia usa a mesma coleta e validação do salvamento, incluindo defaults por pacote, valores personalizados, módulos, abrangência, limite da página 3 Partner e controle de versões.
- POST autenticado no gerador exige usuário `patricia@calirh.com`. Busca o briefing pelo ID, valida serviço e valor, limita o corpo a300KB e compila sem alterações no banco. A prévia não chama `obterCarimbo` nem registra emissão. O espaço da autenticidade é reservado, sem QR/hash apresentado como emitido.
- GET continua gerando a versão salva, inclusive para o envio existente. Não houve alteração do fluxo de e-mail.
- `visualEditorExtras` em `calculator_data` guarda observações adicionais com seção, título e texto. Aparecem no renderer antes do rodapé da seção e continuam em outras folhas quando necessário. No Partner a seção p3 continua limitada a uma folha, com erro explícito e sem truncamento.
- Itens de listas podem ser reordenados no painel; observações podem ser reordenadas entre observações da mesma seção. Não há arrastar livremente elementos para fora da grade ou reorganizar as seções principais nesta versão.
- Revisões assíncronas descartam respostas antigas; mudanças indicam prévia pendente. Erros permanecem visíveis e podem ser corrigidos antes de atualizar. Conteúdo não salvo recebe proteção de saída; salvar continua explícito e usa concorrência por updated_at.

## Validação

`node --check js/admin-editar.js` e `node --check js/proposal-visual-editor.js`.
`node --test tests/proposal-extensions.test.mjs`: quatro cenários aprovados, incluindo valores/centavos, módulos e limite Partner.

Harness local em `/tmp/cali-pdf-review`: fonte do renderer transformada somente para imports/fontes locais; admin simulado lança erro em qualquer acesso a emissão no modo preview. Exemplo Academia:6 páginas; observação com90 frases:8 páginas, todas90 ocorrências preservadas e marcador final presente. Ativação15% de4320 =648. Sem hash de integridade no modo de prévia.

Teste de navegador com cópia local dos dados e persistência/envio bloqueados: seleção sobre o documento, edição inline, recompilação com texto editado e módulos acessíveis. Conferência de produção registrada na conversa após publicação; não salvar nem enviar a proposta real para testar.
