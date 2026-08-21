const option = (value, label = value, description = "") => ({ value, label, description });

export const STATUS = [
  option("novo", "Nova resposta"),
  option("analise", "Em análise"),
  option("edicao", "Proposta em edição"),
  option("aprovada", "Aprovada internamente"),
  option("enviada", "Enviada"),
  option("negociacao", "Em negociação"),
  option("fechada", "Fechada"),
  option("recusada", "Recusada"),
  option("expirada", "Expirada"),
];

export const COMMON_CONTACT = [
  { id: "nome", label: "Seu nome", type: "text", required: true, span: 6, lettersOnly: true, maxlength: 120, autocomplete: "name" },
  { id: "cargo", label: "Cargo", type: "text", required: true, span: 6, lettersOnly: true, maxlength: 120, autocomplete: "organization-title" },
  { id: "email", label: "E-mail profissional", type: "email", required: true, span: 6, maxlength: 254, autocomplete: "email", inputmode: "email" },
  { id: "whatsapp", label: "WhatsApp", type: "tel", required: true, span: 6, phone: true, maxlength: 20, autocomplete: "tel", inputmode: "tel", placeholder: "(41) 98779-1933" },
  { id: "preferencia_contato", label: "Como prefere receber nosso retorno?", type: "radio", required: true, options: [option("email", "E-mail"), option("whatsapp", "WhatsApp"), option("ambos", "Tanto faz")] },
  { id: "origem_contato", label: "Como conheceu a CALI?", type: "select", span: 6, options: [option("indicacao", "Indicação"), option("linkedin", "LinkedIn"), option("instagram", "Instagram"), option("site", "Site ou busca"), option("evento", "Evento ou palestra"), option("cliente", "Já sou cliente"), option("outro", "Outro")] },
  { id: "contexto_profissional", label: "Se quiser, conte um pouco sobre seu papel e o que motivou este contato", type: "textarea", maxlength: 1200, placeholder: "Este campo é opcional." },
];

export const COMMON_COMPANY = [
  { id: "empresa", label: "Empresa", type: "text", required: true, span: 6, maxlength: 180, autocomplete: "organization" },
  { id: "segmento", label: "Segmento", type: "select", required: true, span: 6, options: [option("tecnologia", "Tecnologia e software"), option("servicos", "Serviços profissionais"), option("industria", "Indústria"), option("varejo", "Varejo e e-commerce"), option("saude", "Saúde"), option("educacao", "Educação"), option("financeiro", "Financeiro e seguros"), option("logistica", "Logística e transportes"), option("construcao", "Construção e mercado imobiliário"), option("agro", "Agronegócio"), option("hospitalidade", "Hospitalidade e alimentação"), option("terceiro_setor", "Terceiro setor"), option("publico", "Setor público"), option("outro", "Outro")] },
  { id: "segmento_outro", label: "Qual é o segmento?", type: "text", required: true, span: 6, maxlength: 120, showWhen: { field: "segmento", equals: "outro" } },
  { id: "colaboradores", label: "Número aproximado de colaboradores", type: "number", min: 1, max: 1000000, required: true, span: 4 },
  { id: "unidades", label: "Número de unidades ou filiais", type: "number", min: 1, max: 10000, value: 1, required: true, span: 4 },
  { id: "localidade", label: "Cidade e estado da matriz", type: "text", required: true, span: 4, maxlength: 160 },
  { id: "site_empresa", label: "Site ou LinkedIn da empresa", type: "url", span: 6, maxlength: 300, placeholder: "https://" },
  { id: "filiais_outro_estado", label: "A empresa possui unidades ou filiais em outros estados", type: "checkbox" },
  { id: "estados_filiais", label: "Em quais outros estados?", type: "text", required: true, maxlength: 300, showWhen: { field: "filiais_outro_estado", equals: true }, placeholder: "Ex.: São Paulo, Santa Catarina e Rio de Janeiro" },
  { id: "modelo_trabalho", label: "Modelo de trabalho predominante", type: "select", required: true, span: 6, options: [option("presencial", "Presencial"), option("hibrido", "Híbrido"), option("remoto", "Remoto"), option("misto", "Varia por área")] },
  { id: "momento_empresa", label: "Momento atual da empresa", type: "select", required: true, span: 6, options: [option("crescimento", "Crescimento"), option("reestruturacao", "Reestruturação"), option("estabilizacao", "Estabilização"), option("ma", "Fusão ou aquisição"), option("crise", "Pressão ou crise operacional")] },
];

export const SERVICES = {
  "assessoria-estrategica": {
    slug: "assessoria-estrategica",
    code: "AEM",
    title: "Assessoria Estratégica Mensal — HR as a Service",
    kicker: "RH sênior ao lado da liderança",
    intro: "Conte como a gestão de pessoas funciona hoje. A partir das respostas, estruturamos o modelo mais coerente entre CALI PARTNER e CALI FULL.",
    accent: "bordo",
    packages: [
      { code: "PARTNER", label: "CALI PARTNER", description: "Direção estratégica periódica, leitura de indicadores e apoio a decisões críticas.", minimumMonths: 6, suggestedHours: 12, hoursRange: "10 a 15" },
      { code: "FULL", label: "CALI FULL", description: "Acompanhamento mais próximo, maior profundidade e uma visita presencial fixa por mês.", minimumMonths: 8, suggestedHours: 22, hoursRange: "20 a 25" },
    ],
    sections: [
      { title: "Sobre você", description: "Quem conduz esta conversa com a CALI.", fields: COMMON_CONTACT },
      { title: "Sobre a empresa", description: "Contexto que define porte e complexidade.", fields: COMMON_COMPANY },
      { title: "A gestão de pessoas hoje", fields: [
        { id: "modelo_interesse", label: "Qual modelo parece mais próximo do que a empresa precisa hoje?", type: "radio", required: true, help: "Essa escolha não engessa a proposta: eu confirmo o melhor encaixe depois da leitura.", options: [
          option("PARTNER", "CALI PARTNER", "10 a 15h/mês · direção estratégica periódica · encontro mensal · 100% online · contrato mínimo de 6 meses."),
          option("FULL", "CALI FULL", "20 a 25h/mês · acompanhamento mais próximo · encontro quinzenal · 1 visita/mês · contrato mínimo de 8 meses."),
          option("RECOMENDAR", "Quero que a CALI recomende", "Eu comparo porte, maturidade, frentes, cadência e presencialidade para indicar o modelo mais coerente."),
        ] },
        { id: "rh_interno", label: "Existe RH interno?", type: "radio", required: true, options: [option("nao", "Não"), option("operacional", "Sim, predominantemente operacional"), option("estruturado", "Sim, já estruturado")] },
        { id: "pessoas_rh", label: "Quantas pessoas atuam no RH?", type: "number", min: 0, value: 0, span: 4 },
        { id: "lideranca_rh", label: "Há liderança sênior de RH?", type: "select", required: true, span: 8, options: [option("nao", "Não"), option("parcial", "Parcial ou acumulada por outra área"), option("sim", "Sim")] },
        { id: "estrutura_rh", label: "Conte um pouco mais sobre quem compõe o RH hoje", type: "textarea", maxlength: 1500, placeholder: "Papéis, senioridade, divisão de responsabilidades ou algum contexto importante. Campo opcional." },
        { id: "frentes", label: "Em quais frentes você precisa de apoio?", type: "checkboxes", required: true, help: "Você pode selecionar quantas forem necessárias.", options: [option("planejamento", "Planejamento estratégico de pessoas"), option("desenho", "Estrutura e desenho organizacional"), option("governanca", "Governança, políticas e processos"), option("people_analytics", "People Analytics e dashboards"), option("desempenho", "Gestão de desempenho e metas"), option("clima", "Clima e engajamento"), option("cultura", "Cultura e valores"), option("cargos", "Cargos, carreira e salários"), option("sucessao", "Sucessão e gestão de talentos"), option("liderancas", "Desenvolvimento e apoio às lideranças"), option("decisoes", "Decisões sensíveis e relações de trabalho"), option("atracao", "Atração, seleção e onboarding"), option("marca", "Marca empregadora e experiência do colaborador"), option("comunicacao", "Comunicação interna"), option("saude", "Saúde mental, ocupacional e conformidade"), option("diversidade", "Diversidade, equidade e inclusão")] },
        { id: "indicadores", label: "Quais indicadores são acompanhados e com qual nível de consistência?", type: "indicator_matrix", required: true, help: "Selecione o indicador e classifique o acompanhamento como baixo, médio ou alto.", options: [option("turnover_total", "Turnover total e voluntário"), option("retencao", "Retenção de posições críticas"), option("absenteismo", "Absenteísmo e afastamentos"), option("headcount", "Headcount e movimentações"), option("custo", "Custo de pessoal, folha e benefícios"), option("horas_extras", "Horas extras e banco de horas"), option("recrutamento", "Tempo e custo de contratação"), option("qualidade_contratacao", "Qualidade das contratações"), option("performance", "Desempenho e atingimento de metas"), option("clima", "Clima, engajamento ou eNPS"), option("desenvolvimento", "Treinamento e desenvolvimento"), option("mobilidade", "Mobilidade e promoções internas"), option("sucessao", "Sucessão e cobertura de posições-chave"), option("diversidade", "Diversidade e representatividade"), option("saude", "Saúde, segurança e riscos psicossociais"), option("produtividade", "Produtividade ou receita por colaborador"), { value: "nenhum", label: "Nenhum de forma consistente", exclusive: true }] },
        { id: "principal_desafio", label: "Qual decisão ou problema mais exige atenção agora?", type: "textarea", required: true },
        { id: "frequencia", label: "Qual cadência você espera para a atuação da Patrícia junto à liderança?", type: "radio", required: true, options: [option("mensal", "Mensal"), option("quinzenal", "Quinzenal"), option("semanal", "Semanal")] },
        { id: "presencial", label: "Necessidade de atuação presencial", type: "select", required: true, options: [option("nao", "Sem necessidade fixa"), option("eventual", "Eventual, quando necessário"), option("mensal", "Uma visita por mês"), option("mais", "Mais de uma visita por mês")] },
      ]},
      { title: "Momento da decisão", fields: [
        { id: "prazo_inicio", label: "Quando gostaria de iniciar?", type: "select", required: true, span: 6, options: [option("imediato", "O quanto antes"), option("30", "Em até 30 dias"), option("60", "Entre 30 e 60 dias"), option("planejamento", "Estou planejando")] },
        { id: "decisores", label: "Quem participa da decisão?", type: "text", required: true, span: 6 },
        { id: "investimento", label: "Faixa mensal considerada para este apoio", type: "select", span: 6, options: [option("ate5", "Até R$ 5 mil"), option("5a8", "R$ 5 mil a R$ 8 mil"), option("8a12", "R$ 8 mil a R$ 12 mil"), option("12mais", "Acima de R$ 12 mil"), option("avaliar", "Prefiro avaliar pelo escopo")] },
        { id: "observacoes", label: "Algo importante que não perguntamos?", type: "textarea" },
      ]},
    ],
    alerts(answers) {
      const alerts = [];
      const fronts = answers.frentes || [];
      if (fronts.length >= 5 || answers.frequencia === "semanal" || answers.presencial === "mais") alerts.push({ level: "high", text: "Complexidade e cadência indicam CALI FULL." });
      if (answers.rh_interno === "nao") alerts.push({ level: "medium", text: "Empresa sem RH interno: esclarecer limites entre advisory e execução operacional." });
      if ((answers.indicadores || []).some((item) => String(item).startsWith("Nenhum"))) alerts.push({ level: "medium", text: "Incluir implantação mínima de rotina de indicadores." });
      if (answers.modelo_interesse === "PARTNER" && (fronts.length >= 5 || answers.frequencia === "semanal" || ["mensal","mais"].includes(answers.presencial))) alerts.push({ level: "high", text: "O lead escolheu PARTNER, mas complexidade, cadência ou presencialidade sugerem revisar o encaixe para FULL." });
      return alerts;
    },
    notices(a) { const x=[]; if(a.rh_interno==="nao")x.push({level:"info",text:"A assessoria oferece direção sênior e estruturação estratégica. Rotinas de DP, folha e operação contínua não fazem parte do escopo."}); if(a.presencial==="mais")x.push({level:"attention",text:"Mais de uma visita mensal exige desenho específico de agenda, deslocamento e carga de horas."}); return x; },
  },
  "mentoria-rh": {
    slug: "mentoria-rh", code: "MRH", title: "Mentoria para Profissionais de RH", kicker: "Maturidade, decisão e posicionamento", intro: "Este formulário ajuda a entender o momento profissional e desenhar um ciclo coerente com o objetivo.",
    packages: [
      { code: "TRILHA", label: "TRILHA", description: "Clareza, organização e direção inicial." },
      { code: "ESCALADA", label: "ESCALADA", description: "Desenvolvimento aplicado a desafios reais." },
      { code: "AVIOES", label: "AVIÕES", description: "Acompanhamento executivo para desafios de maior complexidade." },
    ],
    sections: [
      { title: "Sobre você", fields: COMMON_CONTACT.concat([
        { id: "cidade", label: "Cidade e estado", type: "text", required: true, span: 6 },
        { id: "linkedin", label: "LinkedIn", type: "url", span: 6 },
      ])},
      { title: "Momento profissional", fields: [
        { id: "cargo_atual", label: "Cargo atual ou mais recente", type: "text", required: true, span: 6 },
        { id: "tempo_rh", label: "Tempo de atuação em RH", type: "select", required: true, span: 6, options: [option("ate2", "Até 2 anos"), option("3a5", "3 a 5 anos"), option("6a10", "6 a 10 anos"), option("10mais", "Mais de 10 anos")] },
        { id: "momento", label: "Como você descreve seu momento atual?", type: "textarea", required: true },
        { id: "objetivos", label: "O que deseja desenvolver?", type: "checkboxes", required: true, options: [option("estrategia", "Atuação estratégica"), option("posicionamento", "Posicionamento executivo"), option("decisao", "Tomada de decisão"), option("comunicacao", "Comunicação e oratória"), option("carreira", "Transição de carreira"), option("consultoria", "Crescimento em consultoria"), option("lideranca", "Liderança de RH")] },
        { id: "caso_real", label: "Qual desafio real você gostaria de trabalhar primeiro?", type: "textarea", required: true },
      ]},
      { title: "Formato do ciclo", fields: [
        { id: "modalidade", label: "Como a mentoria será contratada?", type: "radio", required: true, options: [option("individual", "Individual", "Para uma pessoa, com objetivos e casos profissionais próprios."), option("grupo", "Grupo da mesma empresa", "Para até 5 profissionais da mesma empresa, com uma agenda comum de desenvolvimento.")] },
        { id: "empresa_grupo", label: "Qual empresa formará o grupo?", type: "text", required: true, span: 6, maxlength: 180, showWhen: { field: "modalidade", equals: "grupo" } },
        { id: "status_iniciativa", label: "Em que etapa está a decisão interna?", type: "select", required: true, span: 6, showWhen: { field: "modalidade", equals: "grupo" }, options: [option("aprovada", "Aprovada e com orçamento"), option("aprovada_sem_orcamento", "Aprovada, orçamento em definição"), option("avaliacao", "Em avaliação pela empresa"), option("nao_apresentada", "Ainda não foi apresentada") ] },
        { id: "patrocinador_grupo", label: "Quem patrocina ou decide esta iniciativa?", type: "text", required: true, span: 6, maxlength: 180, showWhen: { field: "modalidade", equals: "grupo" }, placeholder: "Nome, cargo ou área" },
        { id: "participantes", label: "Quantas pessoas participarão do grupo?", type: "number", min: 2, max: 5, value: 2, required: true, span: 6, showWhen: { field: "modalidade", equals: "grupo" } },
        { id: "perfil_grupo", label: "Quais cargos, níveis ou áreas compõem o grupo?", type: "textarea", required: true, maxlength: 1200, showWhen: { field: "modalidade", equals: "grupo" } },
        { id: "objetivo_grupo", label: "Qual resultado comum a empresa espera deste grupo?", type: "textarea", required: true, maxlength: 1200, showWhen: { field: "modalidade", equals: "grupo" } },
        { id: "frequencia", label: "Frequência desejada dos encontros", type: "select", required: true, span: 4, options: [option("semanal", "Semanal"), option("quinzenal", "Quinzenal"), option("mensal", "Mensal")] },
        { id: "duracao_sessao", label: "Duração preferida de cada encontro", type: "select", required: true, span: 4, options: [option("60", "60 minutos"), option("90", "90 minutos")] },
        { id: "suporte", label: "Qual suporte deseja entre os encontros?", type: "select", required: true, span: 4, options: [option("essencial", "Sem suporte por mensagem", "Materiais e tarefas são tratados nos encontros."), option("mensagens", "Dúvidas pontuais por mensagem", "Canal para perguntas objetivas, respondidas em horário comercial."), option("proximo", "Check-ins e discussão de casos", "Acompanhamento de maior proximidade, com carga adicional prevista no ciclo.")] },
        { id: "prazo_inicio", label: "Quando gostaria de realizar o primeiro encontro?", type: "select", required: true, span: 6, options: [option("imediato", "O quanto antes"), option("30", "Em até 30 dias"), option("60", "Entre 30 e 60 dias"), option("planejamento", "Ainda estou planejando")] },
        { id: "disponibilidade", label: "Quais dias ou períodos costumam funcionar melhor?", type: "text", span: 6, maxlength: 300, placeholder: "Ex.: terças pela manhã" },
      ]},
    ],
    alerts(a) { const x=[]; if(a.modalidade==="grupo"&&Number(a.participantes)>5)x.push({level:"high",text:"A mentoria em grupo é limitada a 5 participantes da mesma empresa."}); if(a.suporte==="proximo")x.push({level:"medium",text:"Prever carga adicional de suporte entre sessões."}); if(a.modalidade==="grupo"&&["avaliacao","nao_apresentada"].includes(a.status_iniciativa))x.push({level:"medium",text:"Iniciativa corporativa ainda não aprovada: proposta deve apoiar a decisão e explicitar premissas."}); if(a.frequencia==="semanal")x.push({level:"medium",text:"Cadência semanal: validar agenda e intensidade do ciclo."}); return x; },
    notices(a) { const x=[]; if(a.modalidade==="grupo")x.push({level:"info",text:"A mentoria em grupo atende até 5 profissionais da mesma empresa e parte de um objetivo comum. Casos individuais continuam sendo tratados com confidencialidade."}); if(a.status_iniciativa==="nao_apresentada")x.push({level:"attention",text:"Tudo bem estar no início: a proposta poderá ser estruturada para apoiar a apresentação interna e a tomada de decisão."}); if(a.suporte==="proximo")x.push({level:"info",text:"Check-ins e discussão de casos entre encontros aumentam a carga dedicada e serão considerados no desenho do ciclo."}); return x; },
  },
  "diagnostico-executivo": {
    slug: "diagnostico-executivo", code: "DEP", title: "Diagnóstico Executivo de People", kicker: "Riscos, prioridades e próximos movimentos", intro: "Uma leitura estratégica da casa para definir o que precisa acontecer primeiro.",
    packages: [{code:"ESSENCIAL",label:"Leitura Essencial"},{code:"COMPLETO",label:"Diagnóstico Completo"}],
    sections: [
      { title: "Contato", fields: COMMON_CONTACT },
      { title: "Empresa", fields: COMMON_COMPANY.concat([
        { id: "pessoas_rh", label: "Pessoas no RH", type: "number", min: 0, value: 0, span: 4 },
        { id: "senioridade_rh", label: "Senioridade de quem responde pelo RH", type: "select", span: 8, options: [option("sem", "Não há responsável definido"), option("operacional", "Operacional"), option("coordenacao", "Coordenação ou gerência"), option("diretoria", "Diretoria ou CHRO")] },
      ])},
      { title: "Escopo da leitura", fields: [
        { id: "problemas", label: "Quais problemas estão mais presentes?", type: "checkboxes", required: true, options: [option("turnover", "Turnover"), option("lideranca", "Liderança"), option("clima", "Clima e engajamento"), option("processos", "Processos desorganizados"), option("cargos", "Cargos e salários"), option("indicadores", "Ausência de indicadores"), option("conformidade", "Riscos e conformidade"), option("crescimento", "Estrutura para crescimento")] },
        { id: "documentos", label: "Como está a documentação de RH?", type: "radio", required: true, options: [option("organizada", "Organizada e atualizada"), option("parcial", "Parcial ou dispersa"), option("desorganizada", "Muito desorganizada ou inexistente")] },
        { id: "indicadores_disponiveis", label: "Há indicadores confiáveis disponíveis?", type: "radio", required: true, options: [option("sim", "Sim"), option("parcial", "Alguns"), option("nao", "Não")] },
        { id: "entrevistas", label: "Lideranças-chave que devem ser entrevistadas", type: "number", min: 1, required: true, span: 6 },
        { id: "survey", label: "Deseja incluir uma pesquisa quantitativa?", type: "select", required: true, span: 6, options: [option("nao", "Não neste momento"), option("sim", "Sim, com colaboradores")] },
        { id: "acesso_dados", label: "A CALI terá acesso aos dados e documentos necessários?", type: "radio", required: true, options: [option("sim", "Sim, estão disponíveis"), option("parcial", "Parcialmente"), option("nao", "Ainda precisam ser organizados")] },
        { id: "patrocinador", label: "Quem patrocina o diagnóstico e valida as prioridades?", type: "text", required: true, maxlength: 180 },
        { id: "uso_resultado", label: "Que decisão o diagnóstico precisa sustentar?", type: "textarea", required: true, maxlength: 1500, placeholder: "Ex.: reorganizar o RH, priorizar projetos, preparar crescimento ou reduzir riscos." },
        { id: "situacao_critica", label: "Qual situação mais preocupa a liderança hoje?", type: "textarea", required: true },
        { id: "formato_entrevistas", label: "Formato das entrevistas", type: "select", required: true, span: 6, options: [option("remoto", "Remoto"), option("hibrido", "Híbrido"), option("presencial", "Presencial")] },
        { id: "prazo_inicio", label: "Prazo desejado para início", type: "select", required: true, span: 6, options: [option("imediato", "O quanto antes"), option("30", "Até 30 dias"), option("60", "30 a 60 dias"), option("planejamento", "Em planejamento")] },
      ]},
    ],
    alerts(a){const x=[]; if(Number(a.entrevistas)>10)x.push({level:"medium",text:"Mais de 10 entrevistas: revisar carga e cronograma."}); if(a.documentos==="desorganizada"||a.acesso_dados==="nao")x.push({level:"high",text:"Aplicar etapa e carga de organização documental antes da leitura."}); if(a.prazo_inicio==="imediato")x.push({level:"medium",text:"Confirmar disponibilidade mínima de quatro semanas."}); return x;},
    notices(a){const x=[]; if(a.acesso_dados==="nao")x.push({level:"attention",text:"Sem dados organizados, o cronograma precisa prever uma etapa inicial de coleta e estruturação das informações."}); if(a.prazo_inicio==="imediato")x.push({level:"info",text:"Diagnósticos executivos exigem agenda de entrevistas e acesso a documentos; o início imediato depende da disponibilidade das pessoas-chave."}); return x;},
  },
  "cultura-direcao": {
    slug: "cultura-direcao", code: "PCD", title: "Projeto de Cultura e Direção", kicker: "Cultura traduzida em comportamento", intro: "Mapeamos o que acontece por baixo das estruturas formais e conectamos cultura à estratégia.",
    packages:[{code:"DIAGNOSTICO",label:"Diagnóstico Cultural"},{code:"JORNADA",label:"Jornada Completa"}],
    sections:[
      {title:"Contato",fields:COMMON_CONTACT},{title:"Empresa",fields:COMMON_COMPANY},
      {title:"Cultura e transformação",fields:[
        {id:"contexto",label:"O que motivou o projeto?",type:"checkboxes",required:true,options:[option("crescimento","Crescimento"),option("ma","Fusão ou aquisição"),option("reestruturacao","Reestruturação"),option("desalinhamento","Desalinhamento entre discurso e prática"),option("lideranca","Mudança de liderança"),option("marca","Reposicionamento de marca")]},
        {id:"palavra_atual",label:"Se a cultura atual fosse uma palavra, qual seria?",type:"text",required:true,span:6},
        {id:"palavra_desejada",label:"E a cultura desejada?",type:"text",required:true,span:6},
        {id:"pesquisa",label:"Alcance da pesquisa quantitativa",type:"select",required:true,span:6,options:[option("amostra","Amostra"),option("todos","Todos os colaboradores"),option("definir","A definir")]},
        {id:"entrevistas",label:"Entrevistas individuais previstas",type:"number",min:1,value:6,span:6},
        {id:"grupos",label:"Grupos focais previstos",type:"number",min:0,value:2,span:6},
        {id:"workshops",label:"Workshops com liderança",type:"number",min:1,value:2,span:6},
        {id:"patrocinio_lideranca",label:"Qual é o nível de patrocínio da alta liderança?",type:"select",required:true,span:6,options:[option("alto","Alto — prioridade executiva"),option("parcial","Parcial — ainda precisa de alinhamento"),option("baixo","Baixo — iniciativa concentrada no RH")]},
        {id:"comunicacao_interna",label:"Existe canal e equipe para comunicar e mobilizar as pessoas?",type:"select",required:true,span:6,options:[option("sim","Sim, estruturados"),option("parcial","Parcialmente"),option("nao","Ainda não")]},
        {id:"sensibilidades",label:"Há histórico, conflito ou tema sensível que precisa ser considerado?",type:"textarea",maxlength:1500,help:"Não inclua nomes ou dados pessoais sensíveis de terceiros neste briefing."},
        {id:"principal_gap",label:"Onde a distância entre cultura e estratégia aparece com mais força?",type:"textarea",required:true},
        {id:"prazo_inicio",label:"Quando gostaria de iniciar?",type:"select",required:true,options:[option("30","Até 30 dias"),option("60","30 a 60 dias"),option("90","Em até 90 dias"),option("planejamento","Em planejamento")]},
      ]},
    ],
    alerts(a){const x=[]; if(Number(a.colaboradores)>200||Number(a.unidades)>3)x.push({level:"medium",text:"Revisar amostra, comunicação e logística por porte."}); if((a.contexto||[]).includes("ma"))x.push({level:"high",text:"Contexto de M&A exige trilha específica de integração cultural."}); if(a.patrocinio_lideranca==="baixo")x.push({level:"high",text:"Baixo patrocínio executivo: prever etapa de alinhamento antes da mobilização ampla."}); return x;},
    notices(a){const x=[]; if(a.patrocinio_lideranca==="baixo")x.push({level:"attention",text:"Projetos de cultura precisam de patrocínio visível da liderança. A proposta poderá incluir uma etapa inicial de alinhamento executivo."}); if((a.contexto||[]).includes("ma"))x.push({level:"info",text:"Em fusões ou aquisições, o desenho considera identidades anteriores, integração e riscos de perda de pessoas-chave."}); return x;},
  },
  "shadowing-lideranca": {
    slug:"shadowing-lideranca",code:"SHL",title:"Shadowing de Liderança",kicker:"Observar a liderança como ela realmente acontece",intro:"O escopo parte de situações reais, com observação estruturada e devolutiva franca.",
    packages:[{code:"INDIVIDUAL",label:"Shadowing Individual"},{code:"EXECUTIVO",label:"Ciclo Executivo"}],
    sections:[
      {title:"Contato",fields:COMMON_CONTACT},{title:"Empresa",fields:COMMON_COMPANY},
      {title:"Ciclo de observação",fields:[
        {id:"lideres",label:"Número de líderes",type:"number",min:1,required:true,span:4},
        {id:"nivel",label:"Nível predominante",type:"select",required:true,span:8,options:[option("primeira","Primeira liderança"),option("gerencia","Gerência"),option("diretoria","Diretoria"),option("founders","Founders ou sócios")]},
        {id:"situacoes",label:"Situações que devem ser observadas",type:"checkboxes",required:true,options:[option("reunioes","Reuniões de time"),option("decisoes","Tomada de decisão"),option("feedback","Feedback e conversas difíceis"),option("conflito","Conflitos"),option("rituais","Rituais de gestão"),option("um_a_um","Reuniões individuais") ]},
        {id:"horas",label:"Horas de observação por líder no ciclo",type:"number",min:2,value:6,span:6},
        {id:"presencial",label:"Formato",type:"select",required:true,span:6,options:[option("presencial","Presencial, recomendado"),option("hibrido","Híbrido"),option("remoto","Remoto") ]},
        {id:"devolutiva",label:"Formato de devolutiva",type:"select",required:true,span:6,options:[option("individual","Individual"),option("individual_executiva","Individual + síntese executiva") ]},
        {id:"feedback_360",label:"Incluir coleta 360°?",type:"radio",required:true,options:[option("nao","Não"),option("sim","Sim") ]},
        {id:"ciencia_lideres",label:"As lideranças observadas já sabem ou concordam com a proposta?",type:"select",required:true,options:[option("sim","Sim"),option("parcial","Algumas já sabem"),option("nao","Ainda não foi apresentada")]},
        {id:"contexto_observacao",label:"Em quais rituais, projetos ou decisões a observação pode acontecer?",type:"textarea",required:true,maxlength:1500},
        {id:"destinatario_devolutiva",label:"Quem receberá a síntese executiva, se houver?",type:"text",maxlength:180,showWhen:{field:"devolutiva",equals:"individual_executiva"}},
        {id:"confidencialidade",label:"Há alguma condição especial de confidencialidade?",type:"textarea"},
        {id:"objetivo",label:"O que precisa mudar na prática ao final do ciclo?",type:"textarea",required:true},
      ]},
    ],
    alerts(a){const x=[]; if(a.presencial==="remoto")x.push({level:"medium",text:"O presencial é recomendado por ser a essência do Shadowing."}); if(Number(a.lideres)>5)x.push({level:"high",text:"Mais de 5 líderes: dividir em ondas ou ampliar prazo."}); if(a.ciencia_lideres==="nao")x.push({level:"high",text:"Planejar comunicação e consentimento antes da observação."}); return x;},
    notices(a){const x=[]; if(a.ciencia_lideres==="nao")x.push({level:"attention",text:"A observação precisa ser apresentada com transparência. O escopo pode incluir uma conversa de alinhamento antes do início."}); if(a.presencial==="remoto")x.push({level:"info",text:"O formato remoto é possível quando existem rituais reais observáveis online; o presencial costuma gerar uma leitura mais completa."}); return x;},
  },
  treinamentos: {
    slug:"treinamentos",code:"TRN",title:"Treinamentos & Palestras",kicker:"Conteúdo sob medida, conectado ao contexto real",intro:"A lógica considera desenho, facilitação, participantes, turmas, materiais e aplicação prática.",
    packages:[
      {code:"PALESTRA",label:"Palestra Estratégica",description:"Encontro único de 60 a 90 minutos."},
      {code:"TREINAMENTO",label:"Treinamento Personalizado",description:"De 1 a 6 encontros."},
      {code:"PROGRAMA",label:"Programa de Liderança Sob Medida",description:"Trilha de 4 a 10 encontros."},
    ],
    sections:[
      {title:"Contato",fields:COMMON_CONTACT},{title:"Empresa",fields:COMMON_COMPANY},
      {title:"Necessidade de desenvolvimento",fields:[
        {id:"tema",label:"Tema principal",type:"text",required:true},
        {id:"objetivo",label:"O que precisa mudar depois do encontro ou da trilha?",type:"textarea",required:true},
        {id:"publico",label:"Público-alvo",type:"text",required:true,span:6},
        {id:"senioridade_publico",label:"Senioridade predominante do público",type:"select",required:true,span:6,options:[option("operacional","Operacional"),option("especialistas","Especialistas"),option("primeira_lideranca","Primeira liderança"),option("gestao","Gerência e coordenação"),option("executiva","Diretoria e C-level"),option("misto","Público misto")]},
        {id:"participantes",label:"Participantes por turma",type:"number",min:1,required:true,span:3},
        {id:"turmas",label:"Número de turmas",type:"number",min:1,value:1,required:true,span:3},
        {id:"formato",label:"Formato desejado",type:"select",required:true,span:6,options:[option("online","Online"),option("presencial","Presencial"),option("hibrido","Híbrido")]},
        {id:"encontros",label:"Número estimado de encontros",type:"number",min:1,value:1,required:true,span:3},
        {id:"carga_horaria",label:"Carga horária por encontro",type:"select",required:true,span:3,options:[option("1.5","60 a 90 min"),option("4","Meio período"),option("8","Dia inteiro")]},
        {id:"infraestrutura",label:"Estrutura disponível",type:"checkboxes",options:[option("sala","Sala adequada"),option("projetor","Projetor ou TV"),option("som","Sistema de som"),option("wifi","Wi-Fi") ]},
        {id:"materiais",label:"Materiais físicos personalizados",type:"radio",required:true,options:[option("nao","Não"),option("sim","Sim") ]},
        {id:"followup",label:"Deseja encontro de acompanhamento?",type:"radio",required:true,options:[option("nao","Não"),option("sim","Sim") ]},
        {id:"decisao_evento",label:"Em que etapa está a contratação?",type:"select",required:true,span:6,options:[option("aprovada","Aprovada e com orçamento"),option("aprovada_sem_orcamento","Aprovada, orçamento em definição"),option("cotacao","Cotação ou comparação de fornecedores"),option("ideia","Ainda é uma ideia inicial")]},
        {id:"acessibilidade",label:"Há necessidade de acessibilidade, tradução ou adaptação de materiais?",type:"textarea",span:6,maxlength:600},
        {id:"gravacao",label:"Pretende gravar ou reutilizar o conteúdo?",type:"radio",required:true,options:[option("nao","Não"),option("sim","Sim"),option("avaliar","A avaliar")]},
        {id:"data_desejada",label:"Data ou período desejado",type:"text",required:true,span:6},
        {id:"budget",label:"Faixa de investimento",type:"select",span:6,options:[option("ate3","Até R$ 3 mil"),option("3a6","R$ 3 mil a R$ 6 mil"),option("6a12","R$ 6 mil a R$ 12 mil"),option("12mais","Acima de R$ 12 mil"),option("avaliar","A avaliar pelo escopo")]},
        {id:"contexto",label:"Contexto e expectativas",type:"textarea"},
      ]},
    ],
    alerts(a){const x=[]; if(Number(a.participantes)>35)x.push({level:"medium",text:"Turma acima de 35 pessoas: avaliar divisão ou formato de palestra."}); if(a.formato==="presencial"&&!String(a.localidade||"").toLowerCase().includes("curitiba"))x.push({level:"medium",text:"Prever deslocamento e eventual hospedagem."}); if(a.data_desejada&&/próxima semana|semana que vem/i.test(a.data_desejada))x.push({level:"high",text:"Antecedência abaixo das quatro semanas recomendadas."}); if(a.gravacao==="sim")x.push({level:"medium",text:"Definir direito de uso, prazo, audiência e valor de licenciamento da gravação."}); return x;},
    notices(a){const x=[]; if(Number(a.participantes)>35)x.push({level:"attention",text:"Para mais de 35 pessoas, posso recomendar divisão em turmas ou formato de palestra para preservar a qualidade da experiência."}); if(a.gravacao==="sim")x.push({level:"info",text:"Gravação e reutilização precisam constar no escopo, incluindo audiência, período e direitos de uso."}); return x;},
  },
  "marca-empregadora": {
    slug:"marca-empregadora",code:"EMP",title:"Marca Empregadora",kicker:"Atrair, engajar e sustentar a experiência",intro:"O diagnóstico considera percepção interna e externa, EVP, atração, ativação e sustentação.",
    packages:[{code:"PROJETO",label:"Projeto de Marca Empregadora"},{code:"RECORRENTE",label:"Sustentação Recorrente"}],
    sections:[
      {title:"Contato",fields:COMMON_CONTACT},{title:"Empresa",fields:COMMON_COMPANY},
      {title:"Experiência e atração",fields:[
        {id:"modelo_contratacao",label:"Modelo de interesse",type:"radio",required:true,options:[option("projeto","Projeto pontual"),option("recorrente","Atuação recorrente"),option("avaliar","Quero avaliar os dois") ]},
        {id:"contratacoes_mes",label:"Contratações médias por mês",type:"number",min:0,span:6},
        {id:"turnover",label:"Turnover aproximado, se souber",type:"text",span:6},
        {id:"problemas",label:"Quais situações motivaram a busca?",type:"checkboxes",required:true,options:[option("rotatividade","Alta rotatividade"),option("escala","Escala de contratação"),option("reputacao","Reputação empregadora fraca"),option("ma","M&A ou transformação"),option("atracao","Dificuldade de atrair cargos-chave"),option("comunicacao","Comunicação interna desestruturada") ]},
        {id:"reviews",label:"Há avaliações relevantes em Glassdoor, Indeed ou redes?",type:"select",required:true,options:[option("positivas","Predominantemente positivas"),option("mistas","Mistas"),option("negativas","Predominantemente negativas"),option("poucas","Poucas ou nenhuma") ]},
        {id:"evp",label:"A empresa já possui EVP definido?",type:"radio",required:true,options:[option("sim","Sim"),option("parcial","Parcialmente"),option("nao","Não") ]},
        {id:"personas",label:"Quantidade estimada de personas de candidato",type:"number",min:1,value:2,span:6},
        {id:"canais",label:"Canais prioritários",type:"checkboxes",options:[option("linkedin","LinkedIn"),option("instagram","Instagram"),option("site","Site de carreiras"),option("interno","Comunicação interna"),option("eventos","Eventos e comunidades"),option("embaixadores","Embaixadores internos") ]},
        {id:"ativos",label:"Ativos esperados",type:"checkboxes",options:[option("evp","EVP e pilares"),option("campanhas","Campanhas"),option("conteudo","Calendário de conteúdo"),option("embaixadores","Programa de embaixadores"),option("incentivo","Programas de incentivo"),option("dashboard","Painel de KPIs") ]},
        {id:"equipe_interna",label:"Quais áreas internas participarão do projeto?",type:"checkboxes",required:true,options:[option("rh","RH"),option("marketing","Marketing"),option("comunicacao","Comunicação interna"),option("lideranca","Alta liderança"),option("juridico","Jurídico ou compliance"),option("agencia","Agência ou parceiro externo")]},
        {id:"aprovacao_conteudo",label:"Quem aprova campanhas e conteúdos?",type:"text",required:true,maxlength:180},
        {id:"ativos_existentes",label:"Quais pesquisas, guias de marca ou materiais já existem?",type:"textarea",maxlength:1200},
        {id:"objetivo",label:"Qual resultado precisa ser percebido primeiro?",type:"textarea",required:true},
        {id:"prazo_inicio",label:"Quando gostaria de iniciar?",type:"select",required:true,options:[option("30","Até 30 dias"),option("60","30 a 60 dias"),option("90","Em até 90 dias"),option("planejamento","Em planejamento")]},
      ]},
    ],
    alerts(a){const x=[]; if(a.reviews==="negativas")x.push({level:"high",text:"Prever frente de reputação e resposta a passivos de percepção."}); if(a.modelo_contratacao==="recorrente"&&(a.ativos||[]).includes("evp"))x.push({level:"medium",text:"Separar fase inicial de definição do EVP da sustentação mensal."}); if(!(a.equipe_interna||[]).includes("marketing")&&!(a.equipe_interna||[]).includes("comunicacao"))x.push({level:"medium",text:"Sem Marketing ou Comunicação: definir capacidade interna de produção e aprovação."}); return x;},
    notices(a){const x=[]; if(a.reviews==="negativas")x.push({level:"attention",text:"Quando há avaliações negativas, a primeira etapa costuma ser leitura de causa e reputação antes de campanhas de atração."}); if(a.modelo_contratacao==="recorrente"&&(a.ativos||[]).includes("evp"))x.push({level:"info",text:"A definição do EVP é uma fase estruturante; a sustentação recorrente começa depois que essa base estiver validada."}); return x;},
  },
};

export function serviceFromPath() {
  const query = new URLSearchParams(location.search).get("tipo");
  const part = location.pathname.split("/").filter(Boolean).pop();
  return SERVICES[query] || SERVICES[part] || SERVICES["assessoria-estrategica"];
}

export function flattenFields(service) {
  return service.sections.flatMap((section) => section.fields);
}

export function labelFor(options, value) {
  if (Array.isArray(value)) return value.map((v) => options?.find((o) => o.value === v)?.label || v).join(", ");
  return options?.find((o) => o.value === value)?.label || value || "—";
}

export function initialPackageFor(service, answers = {}) {
  if (service.slug === "assessoria-estrategica") {
    if (["PARTNER", "FULL"].includes(answers.modelo_interesse)) return answers.modelo_interesse;
    const fronts = answers.frentes?.length || 0;
    if (fronts >= 5 || answers.frequencia === "semanal" || answers.presencial === "mensal" || answers.presencial === "mais") return "FULL";
    return "PARTNER";
  }
  if (service.slug === "treinamentos") {
    const meetings = Number(answers.encontros || 1);
    return meetings >= 4 ? "PROGRAMA" : meetings > 1 ? "TREINAMENTO" : "PALESTRA";
  }
  if (service.slug === "mentoria-rh") {
    if (answers.modalidade === "grupo" || answers.suporte === "proximo") return "AVIOES";
    if ((answers.objetivos?.length || 0) >= 3 || answers.frequencia === "semanal") return "ESCALADA";
    return "TRILHA";
  }
  if (service.slug === "diagnostico-executivo") return Number(answers.entrevistas || 0) > 6 || answers.survey === "sim" || answers.documentos !== "organizada" ? "COMPLETO" : "ESSENCIAL";
  if (service.slug === "cultura-direcao") return Number(answers.grupos || 0) > 0 || Number(answers.workshops || 0) > 1 ? "JORNADA" : "DIAGNOSTICO";
  if (service.slug === "shadowing-lideranca") return Number(answers.lideres || 1) > 1 || answers.feedback_360 === "sim" ? "EXECUTIVO" : "INDIVIDUAL";
  if (service.slug === "marca-empregadora") return answers.modelo_contratacao === "recorrente" ? "RECORRENTE" : "PROJETO";
  return service.packages?.[0]?.code || "PERSONALIZADO";
}

export function calculateProposal({ service, answers, packageCode, basePrice, discount = 0, extras = 0, months = 1, finalOverride = null }) {
  const n = (value, fallback = 0) => Number(value) || fallback;
  let factor = 1;
  const breakdown = [];
  if (service.slug === "assessoria-estrategica") {
    const size = n(answers.colaboradores, 20);
    const sizeFactor = size <= 50 ? 1 : size <= 100 ? 1.12 : 1.25;
    const fronts = answers.frentes?.length || 1;
    const included = packageCode === "FULL" ? 6 : 3;
    const frontFactor = 1 + Math.max(0, fronts - included) * 0.08;
    const cadenceFactor = answers.frequencia === "semanal" ? 1.18 : answers.frequencia === "quinzenal" ? 1.08 : 1;
    factor = sizeFactor * frontFactor * cadenceFactor;
    breakdown.push(["Porte", sizeFactor], ["Frentes", frontFactor], ["Cadência", cadenceFactor]);
    months = packageCode === "FULL" ? Math.max(n(months, 8), 8) : Math.max(n(months, 6), 6);
  } else if (service.slug === "treinamentos") {
    const groups = n(answers.turmas, 1);
    const meetings = n(answers.encontros, 1);
    const participants = n(answers.participantes, 20);
    const formatFactor = answers.formato === "presencial" ? 1.15 : answers.formato === "hibrido" ? 1.2 : 1;
    const participantFactor = participants > 35 ? 1.15 : participants > 20 ? 1.08 : 1;
    factor = groups * Math.max(1, meetings) * formatFactor * participantFactor;
    if (answers.materiais === "sim") extras += participants * groups * 65;
    if (answers.followup === "sim") extras += 650;
    breakdown.push(["Turmas", groups], ["Encontros", meetings], ["Formato", formatFactor], ["Participantes", participantFactor]);
  } else if (service.slug === "mentoria-rh") {
    const participants = n(answers.participantes, 1);
    const durationFactor = answers.duracao_sessao === "90" ? 1.25 : 1;
    const supportFactor = answers.suporte === "proximo" ? 1.2 : answers.suporte === "mensagens" ? 1.1 : 1;
    factor = (1 + Math.max(0, participants - 1) * 0.55) * durationFactor * supportFactor;
    breakdown.push(["Participantes", participants], ["Duração", durationFactor], ["Suporte", supportFactor]);
  } else if (service.slug === "diagnostico-executivo") {
    const interviews = n(answers.entrevistas, 5);
    const units = n(answers.unidades, 1);
    const docFactor = answers.documentos === "desorganizada" ? 1.2 : answers.documentos === "parcial" ? 1.1 : 1;
    factor = (1 + Math.max(0, interviews - 5) * 0.04) * (1 + Math.max(0, units - 1) * 0.08) * docFactor;
    if (answers.survey === "sim") extras += 1200;
    breakdown.push(["Entrevistas", interviews], ["Unidades", units], ["Documentação", docFactor]);
  } else if (service.slug === "cultura-direcao") {
    const interviews = n(answers.entrevistas, 6), groups = n(answers.grupos, 2), workshops = n(answers.workshops, 2);
    factor = 1 + Math.max(0, interviews - 6) * 0.035 + Math.max(0, groups - 2) * 0.08 + Math.max(0, workshops - 2) * 0.1;
    breakdown.push(["Entrevistas", interviews], ["Grupos focais", groups], ["Workshops", workshops]);
  } else if (service.slug === "shadowing-lideranca") {
    const leaders = n(answers.lideres, 1), hours = n(answers.horas, 6);
    factor = leaders * Math.max(1, hours / 6);
    if (answers.feedback_360 === "sim") extras += leaders * 650;
    breakdown.push(["Líderes", leaders], ["Horas por líder", hours]);
  } else if (service.slug === "marca-empregadora") {
    const units = n(answers.unidades, 1), personas = n(answers.personas, 2), assets = answers.ativos?.length || 1;
    factor = (1 + Math.max(0, units - 1) * 0.08) * (1 + Math.max(0, personas - 2) * 0.05) * (1 + Math.max(0, assets - 3) * 0.06);
    breakdown.push(["Unidades", units], ["Personas", personas], ["Ativos", assets]);
  }
  const monthly = service.slug === "assessoria-estrategica" || (service.slug === "marca-empregadora" && packageCode === "RECORRENTE");
  const subtotal = Math.round((n(basePrice) * factor + n(extras)) / 50) * 50;
  const discountValue = Math.round(subtotal * Math.min(Math.max(n(discount), 0), 50) / 100);
  const calculatedFinal = subtotal - discountValue;
  const hasOverride = finalOverride !== null && finalOverride !== "" && Number.isFinite(Number(finalOverride));
  const finalUnit = hasOverride ? Math.max(0, Number(finalOverride)) : calculatedFinal;
  const effectiveDiscountValue = Math.max(0, subtotal - finalUnit);
  const effectiveDiscountPct = subtotal ? Number(((effectiveDiscountValue / subtotal) * 100).toFixed(2)) : 0;
  // Serviços recorrentes são apresentados pela mensalidade. O prazo mínimo é uma
  // condição contratual, não um total a ser somado na proposta.
  const total = finalUnit;
  return { factor: Number(factor.toFixed(3)), subtotal, discountValue: effectiveDiscountValue, discountPct: effectiveDiscountPct, finalUnit, total, months: n(months, 1), monthly, extras: n(extras), manualFinal: hasOverride, breakdown };
}
