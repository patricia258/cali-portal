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
      PARTNER: "Direção estratégica periódica para organizar a agenda de pessoas, qualificar decisões críticas e criar uma rotina de leitura com a liderança.",
      FULL: "Acompanhamento executivo de maior proximidade para contextos mais complexos, com cadência quinzenal, atuação ampliada e uma visita presencial mensal.",
    },
    process: (ctx) => [
      ["Conversa estratégica", "Leitura do momento da empresa, dos riscos e das prioridades do ciclo."],
      ["Desenho do encaixe", `Definição do ${ctx.packageLabel}, das frentes ativas e da carga mensal.`],
      ["Leitura de indicadores", "Organização dos dados de pessoas e preparação das decisões com a liderança."],
      ["Rotina de decisão", "Encontros, acompanhamento das prioridades e ajustes de políticas e processos."],
    ],
    operating: (ctx) => ctx.packageCode === "FULL" ? [
      `Carga mensal contratada de ${ctx.monthlyHours || "20 a 25"} horas.`,
      "Encontros quinzenais com founders, diretoria ou liderança de RH.",
      "Uma visita presencial fixa por mês incluída, conforme região e condições acordadas.",
      "Até 2 ajustes de processo ou fluxo por mês, ou 1 projeto ou treinamento estrutural maior por trimestre.",
      "As horas e entregas do período não são cumulativas.",
    ] : [
      `Carga mensal contratada de ${ctx.monthlyHours || "10 a 15"} horas.`,
      "Encontro mensal virtual com founders, diretoria ou liderança de RH.",
      "Atuação 100% online; visitas presenciais são contratadas separadamente.",
      "Até 1 ajuste ou desenho de política ou processo por mês, não cumulativo.",
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
    needsTitle: "O que este ciclo precisa desenvolver",
    solutionCopy: {
      TRILHA: "Um ciclo de clareza e direção para organizar o momento profissional, priorizar competências e transformar intenção em um plano de desenvolvimento aplicável.",
      ESCALADA: "Um ciclo de desenvolvimento aplicado a desafios reais, com prática, discussão de casos e acompanhamento da evolução profissional.",
      AVIOES: "Uma jornada de maior intensidade para profissionais ou grupos que precisam ampliar repertório, posicionamento executivo e capacidade de decisão.",
    },
    process: () => [
      ["Leitura de partida", "Mapeamento do momento, da maturidade, dos objetivos e do primeiro desafio real."],
      ["Plano do ciclo", "Definição das competências prioritárias, da cadência e dos critérios de evolução."],
      ["Sessões aplicadas", "Discussão de casos, prática de posicionamento, decisão, comunicação e desenho de soluções."],
      ["Consolidação", "Síntese da evolução e próximos movimentos para sustentar o desenvolvimento."],
    ],
    operating: (ctx) => {
      const group = ctx.answers.modalidade === "grupo";
      return [
        group ? `Mentoria corporativa para ${ctx.answerText("participantes") || "até 5"} profissionais da mesma empresa.` : "Mentoria individual, com direcionamento conectado ao objetivo profissional.",
        `Encontros ${String(ctx.answerText("frequencia") || "em cadência acordada").toLowerCase()}, com ${ctx.answerText("duracao_sessao") || "60 a 90 minutos"} por sessão.`,
        `Suporte entre encontros: ${String(ctx.answerText("suporte") || "conforme o pacote").toLowerCase()}.`,
        "Ciclo ajustado à maturidade, ao objetivo e à evolução observada; não há promessa pública de duração fixa.",
        group ? "O objetivo do grupo é comum, mas casos individuais são tratados com confidencialidade." : "Casos reais trazidos pela pessoa orientam a aplicação prática das sessões.",
      ];
    },
    commercial: () => [
      ...commonProjectCommercial,
      "Sessões não realizadas não são cumulativas fora do período contratado.",
      "Remarcações devem ser solicitadas com pelo menos 24 horas de antecedência; no-show ou cancelamento fora do prazo contabiliza a sessão.",
      "A mentoria orienta e desenvolve; decisões e execução permanecem sob responsabilidade do participante e, quando aplicável, da empresa contratante.",
    ],
    outOfScope: [
      "Garantia de promoção, recolocação, aumento salarial ou resultado dependente de terceiros.",
      "Atendimento clínico, terapêutico ou de saúde mental.",
      "Execução de atividades, projetos ou decisões no lugar do participante.",
      "Avaliação de desempenho formal ou compartilhamento de conteúdo individual sem autorização.",
    ],
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
      ESSENCIAL: "Uma leitura executiva para organizar os riscos mais relevantes, identificar prioridades e orientar os primeiros movimentos de gestão de pessoas.",
      COMPLETO: "Um diagnóstico aprofundado, apoiado por entrevistas, documentos e indicadores, que transforma sinais dispersos em prioridades e plano de 90 dias.",
    },
    process: () => [
      ["Kickoff e insumos", "Alinhamento das decisões que o diagnóstico precisa sustentar e organização das fontes."],
      ["Escuta executiva", "Entrevistas com lideranças-chave e, quando previsto, pesquisa quantitativa."],
      ["Leitura integrada", "Cruzamento de documentos, indicadores, riscos, padrões e causas prováveis."],
      ["Devolutiva", "Relatório executivo, mapa de prioridades e plano de movimentos para 90 dias."],
    ],
    operating: () => [
      "Entrevistas remotas ou presenciais, conforme o desenho aprovado.",
      "Uma visita presencial pode ser destinada às entrevistas-chave quando prevista no escopo.",
      "A profundidade da leitura depende do acesso a documentos, indicadores e pessoas-chave.",
      "As sínteses são tratadas de forma confidencial e apresentadas em linguagem executiva.",
      "O cronograma é confirmado após a disponibilidade dos insumos e agendas.",
    ],
    commercial: () => commonProjectCommercial,
    outOfScope: [
      "Execução das ações priorizadas após a devolutiva, salvo contratação adicional.",
      "Auditoria contábil, trabalhista, jurídica ou de segurança ocupacional.",
      "Saneamento integral de bases e documentos não previsto no escopo.",
      "Garantia de resultado quando a implementação depende da empresa.",
    ],
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
      "A pesquisa, as entrevistas, os grupos focais e os workshops seguem a amostra aprovada.",
      "O patrocínio visível da alta liderança é condição para mobilização e legitimidade do processo.",
      "Relatos individuais são tratados com confidencialidade e consolidados por padrões.",
      "A empresa apoia comunicação, agenda, acesso às pessoas e validação das decisões.",
      "A duração é definida pela profundidade do escopo e pela capacidade de mobilização interna.",
    ],
    commercial: () => commonProjectCommercial,
    outOfScope: [
      "Campanha interna ou produção contínua de comunicação não descrita no escopo.",
      "Terapia organizacional, mediação jurídica ou investigação disciplinar.",
      "Implementação integral do roadmap após a entrega, salvo contratação específica.",
      "Garantia de mudança cultural sem participação ativa da liderança.",
    ],
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
      INDIVIDUAL: "Observação estruturada da liderança em situações reais, seguida de leitura franca e recomendações concretas para mudança de comportamento.",
      EXECUTIVO: "Um ciclo de observação de múltiplas lideranças, com devolutivas individuais e uma síntese executiva dos padrões relevantes para o negócio.",
    },
    process: () => [
      ["Alinhamento ético", "Definição de objetivo, situações observáveis, consentimento e regras de confidencialidade."],
      ["Observação real", "Acompanhamento de reuniões, decisões, feedbacks, conflitos ou rituais combinados."],
      ["Leitura técnica", "Análise de padrões de comunicação, decisão, influência e gestão de tensão."],
      ["Devolutiva", "Feedback individual e, quando contratado, síntese executiva com recomendações."],
    ],
    operating: (ctx) => [
      `${ctx.answerText("horas") || "Carga acordada de"} horas de observação por liderança no ciclo.`,
      `Formato ${String(ctx.answerText("presencial") || "preferencialmente presencial").toLowerCase()}; o presencial é recomendado por ser a essência do serviço.`,
      "As pessoas observadas precisam conhecer o objetivo e consentir com a dinâmica.",
      "A devolutiva individual é confidencial; a síntese executiva não expõe conteúdo pessoal inadequado.",
      "As situações observadas precisam ser reais e ocorrer dentro do período acordado.",
    ],
    commercial: () => commonProjectCommercial,
    outOfScope: [
      "Vigilância oculta, investigação disciplinar ou uso do serviço como mecanismo punitivo.",
      "Avaliação psicológica, diagnóstico clínico ou atendimento terapêutico.",
      "Garantia de mudança comportamental sem adesão da liderança observada.",
      "Gravação de reuniões ou pessoas sem autorização expressa.",
    ],
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
      TREINAMENTO: "Uma experiência de aprendizagem personalizada, com conteúdo aplicado, participação ativa e ferramentas conectadas aos desafios reais do público.",
      PROGRAMA: "Uma trilha de desenvolvimento construída em etapas, com prática entre encontros, evolução acompanhada e conexão com os desafios de liderança.",
    },
    process: () => [
      ["Diagnóstico rápido", "Alinhamento da dor, do público, do contexto e do resultado esperado."],
      ["Desenho", "Construção do conteúdo, exemplos, dinâmica e materiais sob medida."],
      ["Facilitação", "Condução ao vivo por Patrícia Lima, no formato e carga acordados."],
      ["Aplicação", "Orientação prática e, quando contratado, acompanhamento após o encontro."],
    ],
    operating: (ctx) => [
      `${ctx.answerText("turmas") || "Número acordado de"} turma(s), com até ${ctx.answerText("participantes") || "o limite definido"} participantes por turma.`,
      `${ctx.answerText("encontros") || "Número acordado de"} encontro(s), com carga de ${String(ctx.answerText("carga_horaria") || "duração definida").toLowerCase()} por encontro.`,
      `Formato ${String(ctx.answerText("formato") || "definido em proposta").toLowerCase()}.`,
      "A empresa garante infraestrutura, acesso, pontualidade e comunicação com os participantes.",
      "Gravação, reprodução ou reutilização do conteúdo depende de autorização e licenciamento expressos.",
      "A antecedência mínima recomendada para desenho e preparação é de quatro semanas.",
    ],
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
      PROJETO: "Um projeto estruturante para diagnosticar a percepção atual, definir o EVP e transformar estratégia de marca empregadora em ativos e plano de ativação.",
      RECORRENTE: "Uma atuação contínua para ativar e sustentar a marca empregadora, conectar comunicação interna e atração e acompanhar indicadores de percepção e resultado.",
    },
    process: () => [
      ["Diagnóstico", "Percepção interna e externa, reviews, referências e concorrência por talentos."],
      ["Estratégia", "Definição de EVP, pilares, atributos, personas e canais prioritários."],
      ["Ativação", "Campanhas, conteúdo empregador, embaixadores e experiências prioritárias."],
      ["Sustentação", "Governança, calendário e painel de indicadores para evolução contínua."],
    ],
    operating: (ctx) => [
      ctx.packageCode === "RECORRENTE" ? "Atuação recorrente com prioridades e calendário revistos em ciclos mensais." : "Projeto organizado nas fases de diagnóstico, estratégia e ativação.",
      "RH, Marketing, Comunicação e liderança participam das validações previstas no escopo.",
      "A empresa fornece pesquisas, guias de marca, acessos, dados e aprovações nos prazos combinados.",
      "Campanhas e conteúdos só são publicados após aprovação do responsável indicado.",
      "Os indicadores partem de uma linha de base e dependem da disponibilidade e qualidade dos dados.",
    ],
    commercial: (ctx) => [
      ...commonProjectCommercial,
      ...(ctx.packageCode === "RECORRENTE" ? ["A mensalidade cobre as frentes e a capacidade previstas; demandas extraordinárias são orçadas separadamente."] : []),
    ],
    outOfScope: [
      "Compra de mídia, impulsionamento, produção audiovisual ou fornecedores não descritos.",
      "Gestão operacional completa de redes sociais ou vagas, salvo contratação específica.",
      "Rebranding corporativo integral ou redesign da marca institucional.",
      "Garantia de volume de candidatos, redução de turnover ou reputação sem execução conjunta da empresa.",
    ],
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
    nextSteps: resolve(profile?.nextSteps, projectNextSteps),
  };
}
