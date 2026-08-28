const commonProjectConditions = [
  "O cronograma é confirmado após aceite, contrato e disponibilidade das pessoas e dos insumos necessários.",
  "As informações compartilhadas são tratadas de forma confidencial e utilizadas exclusivamente para a execução do escopo contratado.",
  "Mudanças relevantes de escopo, volume ou formato são avaliadas e formalizadas antes da execução.",
];

const commonProjectCommercial = [
  "A proposta é válida pelo prazo indicado neste documento.",
  "O início está condicionado à assinatura do contrato e ao cumprimento da condição de pagamento acordada.",
  "Custos de deslocamento, hospedagem, licenças ou fornecedores só são incluídos quando descritos expressamente.",
  "Materiais, métodos e modelos CALI permanecem protegidos por direitos autorais e não podem ser reproduzidos fora do uso contratado.",
];

const projectNextSteps = [
  ["Aprovação", "Confirmação do investimento, formato e escopo."],
  ["Contrato", "Formalização das condições e responsabilidades."],
  ["Kickoff", "Alinhamento final e organização dos insumos."],
  ["Início", "Execução conforme o cronograma acordado."],
];

const profiles = {
  "assessoria-estrategica": {
    contextIds: ["momento_empresa", "colaboradores", "rh_interno", "lideranca_rh", "modelo_interesse", "frequencia", "presencial", "prazo_inicio"],
    contextLabels: {
      momento_empresa: "Momento da empresa",
      colaboradores: "Número de colaboradores",
      rh_interno: "Estrutura atual de RH",
      lideranca_rh: "Liderança sênior de RH",
      modelo_interesse: "Modelo de assessoria",
      frequencia: "Cadência esperada",
      presencial: "Atuação presencial",
      prazo_inicio: "Início desejado",
    },
    priorityIds: ["principal_desafio", "frentes"],
    priorityLabels: {
      principal_desafio: "Desafio prioritário",
      frentes: "Frentes de atuação prioritárias",
    },
    needsTitle: "Prioridades que orientam o primeiro ciclo",
    solutionCopy: {
      PARTNER: "RH estratégico sênior, em formato fracionado, para organizar uma prioridade central por ciclo, qualificar decisões e criar uma rotina de leitura com a liderança.",
      FULL: "RH estratégico sênior com maior cadência e até duas prioridades simultâneas, sem ampliar a estrutura fixa nem criar expectativa de dedicação integral.",
    },
    process: (ctx) => [
      ["Conversa estratégica", "Leitura do momento da empresa, dos riscos e das prioridades do ciclo."],
      ["Desenho do encaixe", `Definição do ${ctx.packageLabel}, das frentes ativas e da carga mensal.`],
      ["Leitura de indicadores", "Organização dos dados de pessoas e preparação das decisões com a liderança."],
      ["Rotina de decisão", "Encontros, acompanhamento das prioridades e ajustes de políticas e processos."],
    ],
    operating: (ctx) => ctx.packageCode === "FULL" ? [
      `Carga mensal contratada de ${ctx.monthlyHours || "14 a 18"} horas, incluindo encontros, análise, preparação e devolutivas.`,
      "Encontros quinzenais com founders, diretoria ou liderança de RH.",
      "Até duas prioridades simultâneas, definidas e revistas com a liderança.",
      "Uma visita presencial por mês, com finalidade e agenda previamente definidas, conforme região e condições acordadas.",
      "As horas e entregas do período não são cumulativas.",
    ] : [
      `Carga mensal contratada de ${ctx.monthlyHours || "8 a 12"} horas, incluindo encontros, análise, preparação e devolutivas.`,
      "Encontro mensal virtual com founders, diretoria ou liderança de RH.",
      "Uma prioridade central por ciclo; as demais necessidades ficam organizadas no roadmap.",
      "Atuação 100% online; visitas presenciais são contratadas separadamente.",
      "As horas e entregas do período não são cumulativas.",
    ],
    commercial: (ctx) => [
      `Contrato mínimo de ${ctx.minimumMonths} meses, com renovação automática e vigência por prazo indeterminado após o período mínimo.`,
      "Cancelamento após o prazo mínimo mediante aviso prévio de 30 dias.",
      "Reajuste a cada 12 meses, conforme índice e condições definidos em contrato.",
      "Demandas fora da carga mensal, visitas adicionais e projetos extraordinários são orçados separadamente.",
      "A priorização das frentes é revista com a liderança ao longo do ciclo.",
    ],
    outOfScope: [
      "Folha de pagamento, eSocial, encargos e rotinas contínuas de Departamento Pessoal.",
      "Parecer jurídico trabalhista, defesa ou contencioso.",
      "Operação de recrutamento, abertura de vagas ou busca de candidatos.",
      "Execução sem participação do cliente, acesso aos dados e aprovações necessárias.",
    ],
    advantages: (ctx) => ctx.packageCode === "FULL" ? [
      "Até duas prioridades avançam simultaneamente, com encontros quinzenais e decisões registradas a cada ciclo.",
      "A visita mensal possui pauta e resultado definidos, evitando presença sem finalidade ou atuação operacional difusa.",
      "Indicadores, responsáveis e próximos movimentos ficam conectados em um único roadmap de implantação.",
    ] : [
      "Uma prioridade central recebe foco até ganhar estrutura, responsáveis e rotina de acompanhamento.",
      "As decisões de pessoas são preparadas com leitura sênior, sem transformar a CALI em RH operacional da empresa.",
      "O roadmap preserva as demais necessidades e define quando cada uma pode entrar sem sobrecarregar o ciclo.",
    ],
    bonus: ["Kit de governança de pessoas", "Agenda executiva mensal e modelo simples de acompanhamento das prioridades de 90 dias, incluídos sem custo adicional."],
    nextSteps: [
      ["Aprovação", "Confirmação do pacote, horas e mensalidade."],
      ["Contrato", "Formalização das condições e da vigência."],
      ["Conversa estratégica", "Priorização das frentes e dos indicadores."],
      ["Início do ciclo", "Ativação da cadência com a liderança."],
    ],
  },

  "mentoria-rh": {
    contextIds: ["modalidade", "cargo_atual", "tempo_rh", "momento", "participantes", "frequencia", "duracao_sessao", "suporte"],
    contextLabels: {
      modalidade: "Formato da contratação",
      cargo_atual: "Público participante",
      tempo_rh: "Experiência em RH",
      momento: "Momento profissional",
      participantes: "Número de participantes",
      frequencia: "Cadência dos encontros",
      duracao_sessao: "Duração por encontro",
      suporte: "Suporte entre encontros",
    },
    priorityIds: ["caso_real", "objetivos", "objetivo_grupo"],
    priorityLabels: {
      caso_real: "Desafio a trabalhar primeiro",
      objetivos: "Competências a desenvolver",
      objetivo_grupo: "Resultado esperado pela empresa",
    },
    needsTitle: "O que este programa precisa desenvolver",
    solutionCopy: {
      ESSENCIAL: "Um programa completo de três encontros para organizar um objetivo prioritário, trabalhar casos reais e transformar a reflexão em um plano de desenvolvimento aplicável.",
      AMPLIADO: "Um programa completo de cinco encontros para aprofundar competências relacionadas, praticar decisões e acompanhar a aplicação no contexto profissional.",
      TRILHA: "Um ciclo de clareza e direção para organizar o momento profissional, priorizar competências e transformar intenção em um plano de desenvolvimento aplicável.",
      ESCALADA: "Um ciclo de desenvolvimento aplicado a desafios reais, com prática, discussão de casos e acompanhamento da evolução profissional.",
      AVIOES: "Uma jornada de maior intensidade para profissionais ou grupos que precisam ampliar repertório, posicionamento executivo e capacidade de decisão.",
    },
    process: () => [
      ["Leitura de partida", "Mapeamento do momento, da maturidade, dos objetivos e do primeiro desafio real."],
      ["Plano do programa", "Definição das competências prioritárias, da cadência e dos critérios de evolução."],
      ["Encontros aplicados", "Discussão de casos, prática de posicionamento, decisão, comunicação e desenho de soluções."],
      ["Consolidação", "Síntese da evolução e próximos movimentos para sustentar o desenvolvimento."],
    ],
    operating: (ctx) => {
      const group = ctx.answers.modalidade === "grupo";
      const meetings = ctx.packageCode === "AMPLIADO" ? 5 : 3;
      return [
        group ? `Programa corporativo para ${ctx.answerText("participantes") || "até 5"} profissionais da mesma empresa.` : "Programa individual, com direcionamento conectado ao objetivo profissional.",
        `${meetings} encontros, em frequência ${String(ctx.answerText("frequencia") || "acordada").toLowerCase()}, com ${ctx.answerText("duracao_sessao") || "60 a 90 minutos"} por encontro.`,
        `Suporte entre encontros: ${String(ctx.answerText("suporte") || "conforme o pacote").toLowerCase()}.`,
        "O investimento é pelo programa completo; não há cobrança ou venda por encontro avulso.",
        group ? "O objetivo do grupo é comum, mas casos individuais são tratados com confidencialidade." : "Casos reais trazidos pela pessoa orientam a aplicação prática dos encontros.",
      ];
    },
    commercial: () => [
      ...commonProjectCommercial,
      "Encontros não realizados não são cumulativos fora do período contratado.",
      "Remarcações devem ser solicitadas com pelo menos 24 horas de antecedência; ausência ou cancelamento fora do prazo contabiliza o encontro.",
      "O programa orienta e desenvolve; decisões e execução permanecem sob responsabilidade do participante e, quando aplicável, da empresa contratante.",
    ],
    outOfScope: [
      "Garantia de promoção, recolocação, aumento salarial ou resultado dependente de terceiros.",
      "Atendimento clínico, terapêutico ou de saúde mental.",
      "Execução de atividades, projetos ou decisões no lugar do participante.",
      "Avaliação de desempenho formal ou compartilhamento de conteúdo individual sem autorização.",
    ],
    advantages: [
      "Programa fechado, com começo, desenvolvimento e consolidação — não uma sequência solta de encontros.",
      "Casos reais do participante orientam a prática e tornam o aprendizado aplicável.",
      "Contato direto com Patrícia e plano de desenvolvimento organizado ao final.",
    ],
    bonus: ["Caderno de aplicação CALI", "Roteiro de reflexão, registro das decisões e plano de ação pessoal para sustentar o desenvolvimento entre os encontros."],
    nextSteps: [
      ["Aprovação", "Confirmação do formato, pacote e investimento."],
      ["Contrato e pagamento", "Formalização e reserva da agenda."],
      ["Leitura inicial", "Alinhamento do objetivo e do desafio prioritário."],
      ["Primeiro encontro", "Início do ciclo de desenvolvimento."],
    ],
  },

  "diagnostico-executivo": {
    contextIds: ["momento_empresa", "colaboradores", "unidades", "pessoas_rh", "documentos", "indicadores_disponiveis", "entrevistas", "survey"],
    contextLabels: {
      momento_empresa: "Momento da empresa",
      colaboradores: "Número de colaboradores",
      unidades: "Unidades ou filiais",
      pessoas_rh: "Estrutura interna de RH",
      documentos: "Documentação disponível",
      indicadores_disponiveis: "Indicadores disponíveis",
      entrevistas: "Entrevistas previstas",
      survey: "Pesquisa quantitativa",
    },
    priorityIds: ["situacao_critica", "problemas", "uso_resultado"],
    priorityLabels: {
      situacao_critica: "Situação crítica que motivou a leitura",
      problemas: "Problemas que precisam ser esclarecidos",
      uso_resultado: "Decisão que o diagnóstico deve sustentar",
    },
    needsTitle: "Questões que a leitura precisa responder",
    solutionCopy: {
      ESSENCIAL: "Uma leitura executiva de raio curto para esclarecer uma decisão, organizar os riscos prioritários e orientar os primeiros movimentos de gestão de pessoas.",
      COMPLETO: "Uma leitura organizacional mais ampla, apoiada por entrevistas, documentos e indicadores, que transforma sinais dispersos em prioridades e plano de 90 dias.",
    },
    process: () => [
      ["Kickoff e insumos", "Alinhamento das decisões que o diagnóstico precisa sustentar e organização das fontes."],
      ["Escuta executiva", "Entrevistas com lideranças-chave e, quando previsto, pesquisa quantitativa."],
      ["Leitura integrada", "Cruzamento de documentos, indicadores, riscos, padrões e causas prováveis."],
      ["Devolutiva", "Relatório executivo, mapa de prioridades e plano de movimentos para 90 dias."],
    ],
    operating: (ctx) => [
      ctx.packageCode === "COMPLETO" ? "Até 6 entrevistas com lideranças-chave; volumes maiores são faseados ou contratados separadamente." : "Até 3 entrevistas com lideranças-chave, concentradas na decisão prioritária.",
      ctx.packageCode === "COMPLETO" ? "Leitura documental e dos indicadores disponíveis, com pesquisa quantitativa somente quando descrita no escopo." : "Leitura dos documentos e indicadores já disponíveis, sem saneamento integral das bases.",
      "Entrevistas remotas ou presenciais, conforme o desenho aprovado.",
      "A profundidade da leitura depende do acesso a documentos, indicadores e pessoas-chave.",
      "Relatório, mapa de prioridades de 90 dias e devolutiva executiva estão incluídos.",
    ],
    commercial: () => commonProjectCommercial,
    outOfScope: [
      "Execução das ações priorizadas após a devolutiva, salvo contratação adicional.",
      "Auditoria contábil, trabalhista, jurídica ou de segurança ocupacional.",
      "Saneamento integral de bases e documentos não previsto no escopo.",
      "Garantia de resultado quando a implementação depende da empresa.",
    ],
    advantages: [
      "Clareza antes de investir em várias iniciativas ao mesmo tempo.",
      "Riscos, prioridades e plano de 90 dias reunidos em uma leitura executiva única.",
      "Devolutiva conduzida diretamente por Patrícia, com espaço para decisão e dúvidas.",
    ],
    bonus: ["Check-in executivo de 30 dias", "Uma conversa de 30 minutos para revisar o avanço das prioridades e ajustar o primeiro movimento do roadmap."],
    nextSteps: projectNextSteps,
  },

  "cultura-direcao": {
    contextIds: ["momento_empresa", "colaboradores", "unidades", "palavra_atual", "palavra_desejada", "pesquisa", "entrevistas", "patrocinio_lideranca"],
    contextLabels: {
      momento_empresa: "Momento da empresa",
      colaboradores: "Número de colaboradores",
      unidades: "Unidades ou filiais",
      palavra_atual: "Cultura percebida hoje",
      palavra_desejada: "Cultura desejada",
      pesquisa: "Abrangência da pesquisa",
      entrevistas: "Entrevistas previstas",
      patrocinio_lideranca: "Patrocínio da liderança",
    },
    priorityIds: ["principal_gap", "contexto", "sensibilidades"],
    priorityLabels: {
      principal_gap: "Gap cultural prioritário",
      contexto: "Contexto que influencia a cultura",
      sensibilidades: "Sensibilidades que exigem cuidado",
    },
    needsTitle: "Tensões culturais que precisam ser trabalhadas",
    solutionCopy: {
      PROJETO: "Um projeto único que lê a cultura atual, traduz a direção desejada em comportamentos observáveis e organiza as prioridades de transformação para os próximos 90 dias.",
      DIAGNOSTICO: "Uma leitura estruturada da cultura atual para revelar forças, riscos e distâncias entre o discurso, a prática e a estratégia.",
      JORNADA: "Uma jornada de diagnóstico e direção que traduz a cultura desejada em comportamentos, prioridades, rituais e um roadmap de transformação.",
    },
    process: () => [
      ["Cultura atual", "Pesquisa, entrevistas e grupos focais para revelar padrões, forças e riscos."],
      ["Direção desejada", "Tradução da estratégia em princípios e comportamentos observáveis."],
      ["Co-criação", "Workshops com a liderança para decisões, compromissos e rituais prioritários."],
      ["Roadmap", "Plano de 90 dias e direção de 6 a 12 meses, com responsáveis e indicadores."],
    ],
    operating: () => [
      "O escopo-base contempla uma escuta quantitativa ou amostral, até 4 entrevistas, 1 grupo focal e 1 workshop com a liderança.",
      "O patrocínio visível da alta liderança é condição para mobilização e legitimidade do processo.",
      "Relatos individuais são tratados com confidencialidade e consolidados por padrões.",
      "A entrega inclui leitura da cultura atual, comportamentos desejados, direcionadores e roadmap de 90 dias.",
      "A empresa apoia comunicação, agenda, acesso às pessoas e validação das decisões.",
    ],
    commercial: () => commonProjectCommercial,
    outOfScope: [
      "Criação de peças, campanha interna, design ou produção contínua de comunicação.",
      "Terapia organizacional, mediação jurídica ou investigação disciplinar.",
      "Implementação integral do roadmap após a entrega, salvo contratação específica.",
      "Garantia de mudança cultural sem participação ativa da liderança.",
    ],
    advantages: [
      "A cultura é lida antes de ser definida, reduzindo decisões baseadas em percepção isolada.",
      "Comportamentos esperados ficam concretos para orientar liderança, rituais e escolhas.",
      "O projeto termina com prioridades e responsáveis, não apenas com um relatório conceitual.",
    ],
    bonus: ["Guia de ritual cultural para lideranças", "Modelo simples para conectar os comportamentos definidos às reuniões, decisões e conversas do dia a dia."],
    nextSteps: projectNextSteps,
  },

  "shadowing-lideranca": {
    contextIds: ["lideres", "nivel", "situacoes", "horas", "presencial", "devolutiva", "feedback_360", "ciencia_lideres"],
    contextLabels: {
      lideres: "Lideranças participantes",
      nivel: "Nível das lideranças",
      situacoes: "Situações observadas",
      horas: "Horas por liderança",
      presencial: "Formato da observação",
      devolutiva: "Formato da devolutiva",
      feedback_360: "Integração com feedback 360",
      ciencia_lideres: "Ciência das lideranças",
    },
    priorityIds: ["objetivo", "contexto_observacao", "confidencialidade"],
    priorityLabels: {
      objetivo: "Objetivo da observação",
      contexto_observacao: "Situações que precisam ser observadas",
      confidencialidade: "Acordos de confidencialidade",
    },
    needsTitle: "Comportamentos e situações que orientarão a observação",
    solutionCopy: {
      CICLO: "Um ciclo individual de observação da liderança em situações reais, seguido de devolutiva franca e plano prático para transformar comportamento em ação.",
      INDIVIDUAL: "Observação estruturada da liderança em situações reais, seguida de leitura franca e recomendações concretas para mudança de comportamento.",
      EXECUTIVO: "Um ciclo de observação de múltiplas lideranças, com devolutivas individuais e uma síntese executiva dos padrões relevantes para o negócio.",
    },
    process: () => [
      ["Alinhamento ético", "Definição de objetivo, situações observáveis, consentimento e regras de confidencialidade."],
      ["Observação real", "Acompanhamento de reuniões, decisões, feedbacks, conflitos ou rituais combinados."],
      ["Leitura técnica", "Análise de padrões de comunicação, decisão, influência e gestão de tensão."],
      ["Devolutiva", "Feedback individual e, quando contratado, síntese executiva com recomendações."],
    ],
    operating: (ctx) => {
      const format = String(ctx.answerText("presencial") || "preferencialmente presencial").toLowerCase();
      return [
        "O investimento contempla um ciclo individual para uma liderança; outras pessoas recebem ciclos próprios.",
        `Até ${ctx.answerText("horas") || "4"} horas de observação, distribuídas em até duas situações reais acordadas.`,
        format.includes("presencial")
          ? format.includes("recomendad")
            ? `Formato ${format}, pois preserva a observação direta que dá sentido ao serviço.`
            : `Formato ${format}, recomendado por preservar a observação direta que dá sentido ao serviço.`
          : `Formato ${format}, conforme viabilidade e objetivo definidos.`,
        "As pessoas observadas precisam conhecer o objetivo e consentir com a dinâmica.",
        "A entrega inclui registro técnico, devolutiva individual, três comportamentos prioritários e plano de ação.",
      ];
    },
    commercial: () => commonProjectCommercial,
    outOfScope: [
      "Vigilância oculta, investigação disciplinar ou uso do serviço como mecanismo punitivo.",
      "Avaliação psicológica, diagnóstico clínico ou atendimento terapêutico.",
      "Garantia de mudança comportamental sem adesão da liderança observada.",
      "Gravação de reuniões ou pessoas sem autorização expressa.",
    ],
    advantages: [
      "A leitura parte do comportamento real, não apenas do relato ou de uma avaliação teórica.",
      "Devolutiva confidencial e objetiva, conectada às situações observadas.",
      "Plano individual com poucos comportamentos prioritários para aumentar a chance de aplicação.",
    ],
    bonus: ["Roteiro para conversas difíceis", "Guia prático e personalizado para preparar uma conversa crítica relacionada ao objetivo trabalhado no ciclo."],
    nextSteps: [
      ["Aprovação", "Confirmação das lideranças, horas e investimento."],
      ["Contrato", "Formalização de confidencialidade e responsabilidades."],
      ["Alinhamento", "Comunicação e consentimento das pessoas envolvidas."],
      ["Observação", "Início do ciclo nas situações combinadas."],
    ],
  },

  treinamentos: {
    contextIds: ["tema", "publico", "participantes", "turmas", "formato", "encontros", "carga_horaria", "data_desejada"],
    contextLabels: {
      tema: "Tema principal",
      publico: "Público participante",
      participantes: "Participantes por turma",
      turmas: "Número de turmas",
      formato: "Formato da realização",
      encontros: "Número de encontros",
      carga_horaria: "Carga por encontro",
      data_desejada: "Data ou período desejado",
    },
    priorityIds: ["objetivo", "contexto", "acessibilidade"],
    priorityLabels: {
      objetivo: "Resultado de aprendizagem esperado",
      contexto: "Contexto que precisa entrar no desenho",
      acessibilidade: "Necessidades de acessibilidade",
    },
    needsTitle: "Resultado de aprendizagem esperado",
    solutionCopy: {
      PALESTRA: "Uma palestra estratégica desenhada para o contexto da empresa, com conteúdo objetivo, provocação responsável e conexão prática com o negócio.",
      WORKSHOP: "Uma oficina aplicada, de até quatro horas, para trabalhar uma competência prioritária com exercício, discussão e ferramenta prática.",
      TREINAMENTO: "Um programa compacto de até três encontros, com conteúdo aplicado, participação ativa e prática conectada aos desafios reais do público.",
      PROGRAMA: "Uma trilha de desenvolvimento construída em etapas, com prática entre encontros, evolução acompanhada e conexão com os desafios de liderança.",
    },
    process: () => [
      ["Diagnóstico rápido", "Alinhamento da dor, do público, do contexto e do resultado esperado."],
      ["Desenho", "Construção do conteúdo, exemplos, dinâmica e materiais sob medida."],
      ["Facilitação", "Condução ao vivo por Patrícia Lima, no formato e carga acordados."],
      ["Aplicação", "Orientação prática e, quando contratado, acompanhamento após o encontro."],
    ],
    operating: (ctx) => {
      const classCount = Number(ctx.answers.turmas || 0);
      const meetingCount = Number(ctx.answers.encontros || 0);
      const classes = classCount ? `${classCount} ${classCount === 1 ? "turma" : "turmas"}` : "Número de turmas acordado";
      const meetings = meetingCount ? `${meetingCount} ${meetingCount === 1 ? "encontro" : "encontros"}` : "Número de encontros acordado";
      return [
        `${classes}, com até ${ctx.answerText("participantes") || "o limite definido"} participantes por turma.`,
        `${meetings}, com carga de ${String(ctx.answerText("carga_horaria") || "duração definida").toLowerCase()} por encontro.`,
        `Formato ${String(ctx.answerText("formato") || "definido em proposta").toLowerCase()}.`,
        "A empresa garante infraestrutura, acesso, pontualidade e comunicação com os participantes.",
        "Gravação, reprodução ou reutilização do conteúdo depende de autorização e licenciamento expressos.",
        "O preço considera carga horária, formato, localidade, número de turmas, participantes, personalização e materiais previstos.",
      ];
    },
    commercial: () => [
      "A proposta é válida pelo prazo indicado neste documento.",
      "O pagamento deve ser concluído conforme a condição acordada antes da realização.",
      "Cancelamento até 15 dias antes do início permite reembolso de 50%; após esse prazo, não há reembolso.",
      "Remarcações devem ser solicitadas com pelo menos 10 dias de antecedência; prazos menores podem gerar taxa.",
      "Deslocamento, hospedagem, materiais físicos e licenciamento de gravação só estão incluídos quando descritos.",
      "O conteúdo e os materiais CALI são protegidos por direitos autorais.",
    ],
    outOfScope: [
      "Gravação, distribuição ou reprodução do conteúdo sem autorização expressa.",
      "Infraestrutura, plataforma, sala, equipamentos ou tradução não descritos.",
      "Atendimento clínico ou aconselhamento individual de participantes.",
      "Mudança de tema, público ou formato após aprovação sem revisão de escopo.",
    ],
    advantages: [
      "Conteúdo construído a partir da realidade da empresa, sem material genérico de prateleira.",
      "Facilitação conduzida ao vivo por Patrícia, com experiência executiva em RH.",
      "Formato escolhido pela mudança esperada — palestra, workshop ou treinamento — e não apenas pela duração.",
    ],
    bonus: ["Plano de aplicação pós-encontro", "Uma página para o sponsor orientar a aplicação do conteúdo e acompanhar os primeiros compromissos do público."],
    nextSteps: [
      ["Aprovação", "Confirmação do formato, data e investimento."],
      ["Contrato e pagamento", "Formalização e reserva da agenda."],
      ["Reunião de briefing", "Aprofundamento do contexto e do público."],
      ["Realização", "Facilitação conforme o desenho aprovado."],
    ],
  },

  "marca-empregadora": {
    contextIds: ["modelo_contratacao", "momento_empresa", "contratacoes_mes", "turnover", "reviews", "evp", "personas", "canais"],
    contextLabels: {
      modelo_contratacao: "Modelo da contratação",
      momento_empresa: "Momento da empresa",
      contratacoes_mes: "Contratações por mês",
      turnover: "Turnover atual",
      reviews: "Percepção nas avaliações",
      evp: "Maturidade do EVP",
      personas: "Personas prioritárias",
      canais: "Canais de atração",
    },
    priorityIds: ["objetivo", "problemas", "ativos"],
    priorityLabels: {
      objetivo: "Resultado de marca empregadora",
      problemas: "Problemas de percepção e atração",
      ativos: "Ativos que já existem ou precisam ser construídos",
    },
    needsTitle: "Percepções e resultados que precisam mudar",
    solutionCopy: {
      PROJETO: "Um projeto estratégico para diagnosticar a percepção atual, definir ou refinar o EVP e organizar um plano de ativação viável para RH, Marketing e liderança.",
      RECORRENTE: "Uma sustentação consultiva para revisar prioridades, orientar a ativação e acompanhar indicadores, sem assumir a produção criativa ou a operação dos canais.",
    },
    process: () => [
      ["Diagnóstico", "Percepção interna e externa, reviews, referências e concorrência por talentos."],
      ["Estratégia", "Definição de EVP, pilares, atributos, personas e canais prioritários."],
      ["Direção de ativação", "Priorização de mensagens, embaixadores, experiências e canais para execução pelas áreas responsáveis."],
      ["Governança", "Roadmap, responsabilidades e painel de indicadores para acompanhar a evolução."],
    ],
    operating: (ctx) => [
      ctx.packageCode === "RECORRENTE" ? "Atuação recorrente com prioridades e calendário revistos em ciclos mensais." : "Projeto organizado nas fases de diagnóstico, estratégia e ativação.",
      "RH, Marketing, Comunicação e liderança participam das validações previstas no escopo.",
      "A empresa fornece pesquisas, guias de marca, acessos, dados e aprovações nos prazos combinados.",
      "RH, Marketing, Comunicação ou parceiros executam as peças e campanhas a partir do direcionamento aprovado.",
      "Os indicadores partem de uma linha de base e dependem da disponibilidade e qualidade dos dados.",
    ],
    commercial: (ctx) => [
      ...commonProjectCommercial,
      ...(ctx.packageCode === "RECORRENTE" ? ["A mensalidade cobre as frentes e a capacidade previstas; demandas extraordinárias são orçadas separadamente."] : []),
    ],
    outOfScope: [
      "Design, produção gráfica ou audiovisual, redação contínua de peças e identidade visual.",
      "Compra de mídia, impulsionamento, gestão de campanhas pagas ou contratação de fornecedores.",
      "Gestão operacional de redes sociais, site de carreiras, vagas ou calendário de publicações.",
      "Rebranding corporativo integral ou redesign da marca institucional.",
      "Garantia de volume de candidatos, redução de turnover ou reputação sem execução conjunta da empresa.",
    ],
    advantages: [
      "A estratégia conecta percepção interna, atração e experiência — não apenas comunicação externa.",
      "EVP, personas, canais, roadmap e indicadores ficam organizados para orientar a execução.",
      "O escopo conversa com Marketing ou agência sem duplicar o trabalho criativo dessas áreas.",
    ],
    bonus: ["Matriz editável de ativação e KPIs", "Modelo para organizar iniciativa, responsável, canal, prazo e indicador de cada movimento da marca empregadora."],
    nextSteps: projectNextSteps,
  },

  "solucao-personalizada": {
    contextIds: ["momento_empresa", "colaboradores", "modelo_trabalho", "temas_aproximados", "publico_envolvido", "formato_desejado", "etapa_decisao", "prazo_inicio"],
    contextLabels: {
      momento_empresa: "Momento da empresa",
      colaboradores: "Número de colaboradores",
      modelo_trabalho: "Modelo de trabalho",
      temas_aproximados: "Temas relacionados",
      publico_envolvido: "Públicos envolvidos",
      formato_desejado: "Formato desejado",
      etapa_decisao: "Etapa da decisão",
      prazo_inicio: "Início desejado",
    },
    priorityIds: ["necessidade_descricao", "resultado_esperado", "impacto_negocio", "tentativas_anteriores", "restricoes"],
    priorityLabels: {
      necessidade_descricao: "Contexto que originou a necessidade",
      resultado_esperado: "Resultado que precisa ser alcançado",
      impacto_negocio: "Impacto atual no negócio e nas pessoas",
      tentativas_anteriores: "O que já foi tentado",
      restricoes: "Restrições e sensibilidades",
    },
    needsTitle: "O que esta solução precisa colocar em movimento",
    solutionCopy: {
      SOB_MEDIDA: "Uma solução desenhada a partir do contexto real da empresa, combinando leitura estratégica, estruturação e desenvolvimento sem forçar a necessidade em um pacote pronto.",
    },
    process: () => [
      ["Leitura do contexto", "Confirmação do desafio, do impacto, dos públicos envolvidos e do resultado esperado."],
      ["Desenho do encaixe", "Definição das frentes, da abordagem, dos limites e das premissas do trabalho."],
      ["Escopo sob medida", "Organização das entregas, do formato, da capacidade dedicada e do cronograma."],
      ["Execução e checkpoints", "Realização do trabalho com marcos de validação e ajustes previstos no escopo."],
    ],
    operating: () => [
      "O formato, a duração e a cadência são definidos conforme a natureza e a complexidade da necessidade.",
      "A empresa disponibiliza as pessoas, os dados, os acessos e as aprovações necessários ao trabalho.",
      "Entregas, limites e responsabilidades são descritos expressamente na proposta e no contrato.",
      "Mudanças relevantes de escopo, volume ou formato são avaliadas antes da execução.",
      "Etapas presenciais, fornecedores, licenças e deslocamentos só estão incluídos quando descritos.",
    ],
    commercial: () => commonProjectCommercial,
    outOfScope: [
      "Folha de pagamento, ponto, benefícios, admissões, férias, desligamentos, eSocial ou outras rotinas de Departamento Pessoal.",
      "Operação contínua de recrutamento, hunting em volume, abertura de vagas ou alocação de recrutadores.",
      "Serviços jurídicos, contábeis, médicos, clínicos ou outras atividades técnicas reguladas.",
      "Terceirização de rotinas administrativas ou execução transacional contínua do RH.",
    ],
    advantages: [
      "O desafio não é forçado em um pacote genérico: objetivo, entregas e limites são confirmados antes do início.",
      "Checkpoints evitam que uma necessidade personalizada se transforme em escopo aberto.",
      "Condução direta por Patrícia e conexão com as prioridades reais do negócio.",
    ],
    bonus: ["Check-in executivo de 30 dias", "Uma conversa breve para revisar a aplicação da entrega principal e orientar o próximo movimento."],
    nextSteps: [
      ["Conversa de confirmação", "Validação do desafio, do resultado esperado e das premissas principais."],
      ["Desenho do escopo", "Definição das entregas, do formato, do cronograma e do investimento."],
      ["Contrato", "Formalização das condições e responsabilidades."],
      ["Kickoff", "Organização dos insumos, das agendas e do primeiro movimento."],
    ],
  },
};

export function proposalProfile({ service, packageCode, packageLabel, answers, answerText, minimumMonths, monthlyHours }) {
  const profile = profiles[service.slug];
  const context = { service, packageCode, packageLabel, answers, answerText, minimumMonths, monthlyHours };
  const resolve = (value, fallback = []) => typeof value === "function" ? value(context) : value || fallback;
  return {
    contextIds: profile?.contextIds || ["momento_empresa", "modelo_trabalho", "colaboradores", "unidades", "localidade", "prazo_inicio"],
    contextLabels: profile?.contextLabels || {},
    priorityIds: profile?.priorityIds || ["objetivo", "contexto", "observacoes"],
    priorityLabels: profile?.priorityLabels || {},
    needsTitle: profile?.needsTitle || "O que precisa ganhar movimento",
    solutionCopy: profile?.solutionCopy?.[packageCode] || service.intro,
    process: resolve(profile?.process, [["Leitura", "Confirmação do contexto e do objetivo."], ["Encaixe", "Definição do formato e do escopo."], ["Preparação", "Organização dos insumos e do cronograma."], ["Execução", "Início do trabalho e checkpoints."]]),
    operating: resolve(profile?.operating, commonProjectConditions),
    commercial: resolve(profile?.commercial, commonProjectCommercial),
    outOfScope: resolve(profile?.outOfScope, ["Atividades não descritas expressamente no escopo aprovado."]),
    advantages: resolve(profile?.advantages, ["Escopo conectado ao contexto e ao resultado esperado.", "Condução direta por Patrícia Lima.", "Limites e responsabilidades descritos com clareza."]),
    bonus: resolve(profile?.bonus, ["Material de aplicação", "Um recurso simples para apoiar a continuidade do trabalho após a entrega."]),
    nextSteps: resolve(profile?.nextSteps, projectNextSteps),
  };
}
