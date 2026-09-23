const option = (value, label = value, description = "") => ({ value, label, description });

const INVESTMENT_BANDS = {
  "assessoria-estrategica": { period: "por mês", options: [
    { value: "ate5", label: "Até R$ 5 mil", min: 0, max: 5000 },
    { value: "5a8", label: "R$ 5 mil a R$ 8 mil", min: 5000, max: 8000 },
    { value: "8a12", label: "R$ 8 mil a R$ 12 mil", min: 8000, max: 12000 },
    { value: "12mais", label: "Acima de R$ 12 mil", min: 12000, max: null },
    { value: "avaliar", label: "Prefiro avaliar pelo escopo", min: null, max: null },
  ]},
  "mentoria-rh": { period: "por ciclo", options: [
    { value: "ate15", label: "Até R$ 1,5 mil", min: 0, max: 1500 },
    { value: "15a24", label: "R$ 1,5 mil a R$ 2,4 mil", min: 1500, max: 2400 },
    { value: "24mais", label: "Acima de R$ 2,4 mil", min: 2400, max: null },
    { value: "avaliar", label: "Prefiro avaliar pelo escopo", min: null, max: null },
  ]},
  "diagnostico-executivo": { period: "pelo projeto", options: [
    { value: "ate3", label: "Até R$ 3 mil", min: 0, max: 3000 },
    { value: "3a45", label: "R$ 3 mil a R$ 4,5 mil", min: 3000, max: 4500 },
    { value: "45mais", label: "Acima de R$ 4,5 mil", min: 4500, max: null },
    { value: "avaliar", label: "Prefiro avaliar pelo escopo", min: null, max: null },
  ]},
  "cultura-direcao": { period: "pelo projeto", options: [
    { value: "ate4", label: "Até R$ 4 mil", min: 0, max: 4000 },
    { value: "4mais", label: "Acima de R$ 4 mil", min: 4000, max: null },
    { value: "avaliar", label: "Prefiro avaliar pelo escopo", min: null, max: null },
  ]},
  "shadowing-lideranca": { period: "pelo ciclo", options: [
    { value: "ate4", label: "Até R$ 4 mil", min: 0, max: 4000 },
    { value: "4mais", label: "Acima de R$ 4 mil", min: 4000, max: null },
    { value: "avaliar", label: "Prefiro avaliar pelo escopo", min: null, max: null },
  ]},
  treinamentos: { period: "pela contratação", options: [
    { value: "ate25", label: "Até R$ 2,5 mil", min: 0, max: 2500 },
    { value: "25a4", label: "R$ 2,5 mil a R$ 4 mil", min: 2500, max: 4000 },
    { value: "4a6", label: "R$ 4 mil a R$ 6 mil", min: 4000, max: 6000 },
    { value: "6a10", label: "R$ 6 mil a R$ 10 mil", min: 6000, max: 10000 },
    { value: "10mais", label: "Acima de R$ 10 mil", min: 10000, max: null },
    { value: "avaliar", label: "Prefiro avaliar pelo escopo", min: null, max: null },
  ]},
  "marca-empregadora": { period: "pelo projeto ou mensalidade", options: [
    { value: "ate4", label: "Até R$ 4 mil", min: 0, max: 4000 },
    { value: "4mais", label: "Acima de R$ 4 mil", min: 4000, max: null },
    { value: "avaliar", label: "Prefiro avaliar pelo escopo", min: null, max: null },
  ]},
  "solucao-personalizada": { period: "pela contratação", options: [
    { value: "ate3", label: "Até R$ 3 mil", min: 0, max: 3000 },
    { value: "3mais", label: "Acima de R$ 3 mil", min: 3000, max: null },
    { value: "avaliar", label: "Prefiro avaliar pelo escopo", min: null, max: null },
  ]},
};

export const PACKAGE_PRICE_BANDS = {
  "assessoria-estrategica": {
    PARTNER: { min: 3900, max: 5800 },
    FULL: { min: 6500, max: 8000 },
  },
  "mentoria-rh": {
    ESSENCIAL: { min: 1500, max: 1800 },
    AMPLIADO: { min: 2200, max: 2400 },
  },
  "diagnostico-executivo": {
    ESSENCIAL: { min: 2800, max: 3000 },
    COMPLETO: { min: 4000, max: 4500 },
  },
  "cultura-direcao": { PROJETO: { min: 3800, max: 4000 } },
  "shadowing-lideranca": { CICLO: { min: 3500, max: 4000 } },
  treinamentos: {
    PALESTRA: { min: 1800, max: 2500 },
    WORKSHOP: { min: 2800, max: 3800 },
    TREINAMENTO: { min: 4000, max: 5000 },
  },
  "marca-empregadora": {
    PROJETO: { min: 3800, max: 4000 },
    RECORRENTE: { min: 3200, max: 4000 },
  },
  "solucao-personalizada": { SOB_MEDIDA: { min: 2800, max: 3000 } },
};

const LEGACY_INVESTMENT_BANDS = {
  "mentoria-rh": [
    { value:"ate2", label:"Até R$ 2 mil", min:0, max:2000 },
    { value:"2a4", label:"R$ 2 mil a R$ 4 mil", min:2000, max:4000 },
    { value:"4a7", label:"R$ 4 mil a R$ 7 mil", min:4000, max:7000 },
    { value:"7mais", label:"Acima de R$ 7 mil", min:7000, max:null },
  ],
  "diagnostico-executivo": [
    { value:"ate5", label:"Até R$ 5 mil", min:0, max:5000 },
    { value:"8a12", label:"R$ 8 mil a R$ 12 mil", min:8000, max:12000 },
    { value:"12mais", label:"Acima de R$ 12 mil", min:12000, max:null },
  ],
  "cultura-direcao": [
    { value:"ate6", label:"Até R$ 6 mil", min:0, max:6000 },
    { value:"6a10", label:"R$ 6 mil a R$ 10 mil", min:6000, max:10000 },
    { value:"10a15", label:"R$ 10 mil a R$ 15 mil", min:10000, max:15000 },
    { value:"15mais", label:"Acima de R$ 15 mil", min:15000, max:null },
  ],
  treinamentos: [
    { value:"25a5", label:"R$ 2,5 mil a R$ 5 mil", min:2500, max:5000 },
    { value:"5mais", label:"Acima de R$ 5 mil", min:5000, max:null },
    { value:"ate3", label:"Até R$ 3 mil", min:0, max:3000 },
    { value:"3a6", label:"R$ 3 mil a R$ 6 mil", min:3000, max:6000 },
    { value:"6a12", label:"R$ 6 mil a R$ 12 mil", min:6000, max:12000 },
  ],
  "marca-empregadora": [
    { value:"ate6", label:"Até R$ 6 mil", min:0, max:6000 },
    { value:"6a10", label:"R$ 6 mil a R$ 10 mil", min:6000, max:10000 },
    { value:"10a15", label:"R$ 10 mil a R$ 15 mil", min:10000, max:15000 },
    { value:"15mais", label:"Acima de R$ 15 mil", min:15000, max:null },
  ],
  "solucao-personalizada": [
    { value:"ate5", label:"Até R$ 5 mil", min:0, max:5000 },
    { value:"10a20", label:"R$ 10 mil a R$ 20 mil", min:10000, max:20000 },
    { value:"20mais", label:"Acima de R$ 20 mil", min:20000, max:null },
  ],
};

function investmentField(serviceSlug, label, id = "investimento", help = "") {
  return {
    id,
    label,
    type: "select",
    required: true,
    span: 6,
    help: help || "Essa resposta orienta o formato, a profundidade e as prioridades da proposta.",
    options: INVESTMENT_BANDS[serviceSlug].options.map(({ value, label: optionLabel }) => option(value, optionLabel)),
  };
}

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

const COMMON_COMPANY_TRAINING = COMMON_COMPANY.filter((field) => !["modelo_trabalho", "momento_empresa"].includes(field.id));

export const BRAZIL_STATES = [
  option("AC","Acre"),option("AL","Alagoas"),option("AP","Amapá"),option("AM","Amazonas"),option("BA","Bahia"),
  option("CE","Ceará"),option("DF","Distrito Federal"),option("ES","Espírito Santo"),option("GO","Goiás"),option("MA","Maranhão"),
  option("MT","Mato Grosso"),option("MS","Mato Grosso do Sul"),option("MG","Minas Gerais"),option("PA","Pará"),option("PB","Paraíba"),
  option("PR","Paraná"),option("PE","Pernambuco"),option("PI","Piauí"),option("RJ","Rio de Janeiro"),option("RN","Rio Grande do Norte"),
  option("RS","Rio Grande do Sul"),option("RO","Rondônia"),option("RR","Roraima"),option("SC","Santa Catarina"),option("SP","São Paulo"),
  option("SE","Sergipe"),option("TO","Tocantins"),
];
export const TRAINING_RMC_CITIES = [
  "adrianopolis","agudos do sul","almirante tamandare","araucaria","balsa nova","bocaiuva do sul","campina grande do sul",
  "campo do tenente","campo largo","campo magro","cerro azul","colombo","contenda","curitiba","doutor ulysses",
  "fazenda rio grande","itaperucu","lapa","mandirituba","pien","pinhais","piraquara","quatro barras","quitandinha",
  "rio branco do sul","rio negro","sao jose dos pinhais","tijucas do sul","tunas do parana"
];
const normalizeLocationName=(value="")=>String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase().replace(/\s+/g," ");
export function isTrainingRmcLocation(answers={}) {
  const state=String(answers.local_estado||"").trim().toUpperCase();
  const city=normalizeLocationName(answers.local_cidade||"");
  return state==="PR" && TRAINING_RMC_CITIES.includes(city);
}
export function trainingNeedsTravel(answers={}) {
  return ["presencial","hibrido"].includes(String(answers.formato||"")) && Boolean(answers.local_estado||answers.local_cidade||answers.local_execucao) && !isTrainingRmcLocation(answers);
}

export const SERVICES = {
  "assessoria-estrategica": {
    slug: "assessoria-estrategica",
    code: "AEM",
    title: "Assessoria Estratégica Mensal — HR as a Service",
    kicker: "RH sênior ao lado da liderança",
    intro: "Conte como a gestão de pessoas funciona hoje. A partir das respostas, estruturamos o modelo mais coerente entre CALI PARTNER e CALI FULL.",
    accent: "bordo",
    packages: [
      { code: "PARTNER", label: "CALI PARTNER", description: "Direção estratégica sênior para uma prioridade central por ciclo, com leitura de indicadores e apoio à decisão.", minimumMonths: 8, suggestedHours: 10, hoursRange: "8 a 12" },
      { code: "FULL", label: "CALI FULL", description: "Maior cadência e até duas prioridades simultâneas, sem criar expectativa de RH interno em tempo integral.", minimumMonths: 12, suggestedHours: 16, hoursRange: "14 a 18" },
    ],
    sections: [
      { title: "Sobre você", description: "Quem conduz esta conversa com a CALI.", fields: COMMON_CONTACT },
      { title: "Sobre a empresa", description: "Contexto que define porte e complexidade.", fields: COMMON_COMPANY },
      { title: "A gestão de pessoas hoje", fields: [
        { id: "modelo_interesse", label: "Qual modelo parece mais próximo do que a empresa precisa hoje?", type: "radio", required: true, help: "Essa escolha não engessa a proposta: eu confirmo o melhor encaixe depois da leitura.", options: [
          option("PARTNER", "CALI PARTNER", "8 a 12h/mês · uma prioridade central por ciclo · encontro mensal · 100% online · contrato mínimo de 8 meses."),
          option("FULL", "CALI FULL", "14 a 18h/mês · até duas prioridades simultâneas · encontros quinzenais · 1 visita/mês com finalidade definida · contrato mínimo de 12 meses."),
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
        investmentField("assessoria-estrategica", "Até quanto a empresa considera investir por mês neste apoio?"),
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
  "cali-build": {
    slug: "cali-build",
    code: "BLD",
    title: "CALI Build — Estruturação Assistida de RH",
    kicker: "A CALI desenha. Seu RH constrói.",
    intro: "Para empresas que já têm alguém de RH e precisam estruturar a área, um subsistema ou várias frentes com método, direção sênior e supervisão técnica — mantendo a execução com o time interno.",
    accent: "dourado",
    packages: [
      { code: "ESSENCIAL", label: "CALI Build Essencial", description: "Uma frente prioritária por ciclo, com método, revisão técnica e checkpoints de implantação.", minimumMonths: 4, suggestedHours: 10, hoursRange: "8 a 12" },
      { code: "COMPLETO", label: "CALI Build Completo", description: "Estruturação mais ampla, com várias frentes conectadas, maior cadência e checkpoints executivos.", minimumMonths: 6, suggestedHours: 16, hoursRange: "14 a 18" },
    ],
    boundaryTitle: "Estruturação assistida, não terceirização do RH",
    boundaryIntro: "No CALI Build, a CALI define arquitetura, método, critérios e prioridades; o time interno coloca a estrutura em prática.",
    boundaryItems: [
      "A CALI diagnostica, organiza o roadmap, ensina o método, fornece referências e revisa tecnicamente as entregas.",
      "O RH interno levanta dados, adapta os materiais, constrói as entregas, implanta as rotinas e mantém a operação.",
      "Se a CALI precisar assumir a execução no lugar do time interno, o enquadramento deixa de ser Build e passa a ser CALI Full.",
      "A atuação é 100% online por padrão. Visitas presenciais podem ser contratadas separadamente quando fizer sentido.",
    ],
    boundaryClosing: "A proposta final considera porte, quantidade de frentes, capacidade interna de execução, cadência e complexidade do negócio.",
    sections: [
      { title: "Sobre você", description: "Quem está conduzindo esta conversa com a CALI.", fields: COMMON_CONTACT },
      { title: "Sobre a empresa", description: "Contexto de porte e complexidade. O investimento da CALI não aparece aqui; esta etapa serve para dimensionar o trabalho.", fields: COMMON_COMPANY },
      { title: "O RH que vai construir", description: "Quero entender quem existe hoje e quem, de fato, vai executar a implantação com a supervisão da CALI.", fields: [
        { id: "mapa_people_status", label: "Você já respondeu o Mapa de People da CALI?", type: "radio", required: true, options: [option("sim", "Sim"), option("nao", "Ainda não"), option("nao_sei", "Não lembro / não tenho certeza")] },
        { id: "mapa_people_referencia", label: "Se usou outro e-mail ou tiver o protocolo do Mapa, informe aqui", type: "text", maxlength: 180, help: "Se foi o mesmo e-mail deste briefing, eu localizo o Mapa automaticamente.", showWhen: { field: "mapa_people_status", equals: "sim" } },
        { id: "estrutura_rh_status", label: "Como está a estrutura de RH hoje?", type: "radio", required: true, options: [
          option("nao_existe", "Ainda não existe uma área formal de RH"),
          option("em_criacao", "A área está sendo criada agora"),
          option("pouco_estruturado", "Existe, mas ainda é pouco estruturada"),
          option("parcial", "Existe e alguns subsistemas já funcionam"),
          option("estruturado", "Existe e é estruturada, mas uma frente precisa ser construída ou revista"),
        ] },
        { id: "pessoas_rh", label: "Quantas pessoas atuam hoje no RH?", type: "number", min: 0, max: 5000, required: true, span: 4 },
        { id: "equipe_rh", label: "Quem faz parte do time de RH hoje?", type: "textarea", required: true, maxlength: 2200, help: "Uma pessoa por linha: nome — cargo — senioridade — principal responsabilidade.", placeholder: "Ex.: Vitória Moura — Analista de RH — Pleno — estruturação de processos e rotinas.", showWhen: { field: "estrutura_rh_status", in: ["em_criacao","pouco_estruturado","parcial","estruturado"] } },
        { id: "responsavel_implantacao", label: "Já existe uma pessoa interna responsável por tocar a implantação entre os checkpoints da CALI?", type: "radio", required: true, options: [option("sim", "Sim, já está definida"), option("definindo", "Está sendo definida"), option("nao", "Ainda não")] },
        { id: "responsavel_nome", label: "Nome da pessoa responsável pela implantação", type: "text", required: true, span: 4, maxlength: 120, lettersOnly: true, showWhen: { field: "responsavel_implantacao", equals: "sim" } },
        { id: "responsavel_cargo", label: "Cargo", type: "text", required: true, span: 4, maxlength: 120, showWhen: { field: "responsavel_implantacao", equals: "sim" } },
        { id: "responsavel_senioridade", label: "Senioridade", type: "select", required: true, span: 4, showWhen: { field: "responsavel_implantacao", equals: "sim" }, options: [option("assistente", "Assistente / estágio"), option("junior", "Júnior"), option("pleno", "Pleno"), option("senior", "Sênior"), option("especialista", "Especialista"), option("coordenacao", "Coordenação"), option("gerencia", "Gerência"), option("direcao", "Direção / CHRO"), option("outro", "Outro")] },
        { id: "responsavel_previsao", label: "Como e quando essa pessoa será definida?", type: "textarea", required: true, maxlength: 900, showWhen: { field: "responsavel_implantacao", equals: "definindo" } },
      ]},
      { title: "O que precisa ser construído", description: "Aqui não repetimos o diagnóstico de maturidade do Mapa. Quero saber qual estrutura precisa sair do papel e qual deve ser o primeiro movimento.", fields: [
        { id: "escopo_build", label: "O que a empresa precisa estruturar neste momento?", type: "radio", required: true, options: [
          option("rh_completo", "RH como um todo", "Estruturar a função de RH e seus subsistemas de forma organizada por ciclos."),
          option("frente_especifica", "Uma frente específica", "Construir ou reconstruir um subsistema prioritário."),
          option("multiplas_frentes", "Várias frentes relacionadas", "Organizar uma sequência de implantação para temas que dependem entre si."),
          option("recomendar", "Ainda não sei — quero que a CALI recomende", "Eu cruzo o contexto, o Mapa de People e a capacidade interna para propor a ordem."),
        ] },
        { id: "frentes", label: "Quais frentes precisam entrar no radar do Build?", type: "checkboxes", required: true, help: "Selecione as frentes que precisam ser construídas ou reorganizadas; a proposta define o que entra primeiro.", showWhen: { field: "escopo_build", in: ["rh_completo","frente_especifica","multiplas_frentes"] }, options: [
          option("planejamento", "Planejamento estratégico de pessoas"),
          option("desenho", "Estrutura e desenho organizacional"),
          option("governanca", "Governança, políticas e processos"),
          option("people_analytics", "Indicadores, People Analytics e dashboards"),
          option("desempenho", "Gestão de desempenho e metas"),
          option("clima", "Clima e engajamento"),
          option("cultura", "Cultura e valores"),
          option("cargos", "Cargos, carreira e salários"),
          option("sucessao", "Sucessão e gestão de talentos"),
          option("liderancas", "Desenvolvimento de lideranças"),
          option("atracao", "Atração, seleção e onboarding"),
          option("marca", "Marca empregadora e experiência do colaborador"),
          option("comunicacao", "Comunicação interna"),
          option("saude", "Saúde, segurança e conformidade"),
          option("diversidade", "Diversidade, equidade e inclusão"),
        ] },
        { id: "ponto_partida", label: "Qual é o ponto de partida das frentes que precisam ser implantadas?", type: "radio", required: true, options: [
          option("zero", "Precisam nascer do zero"),
          option("disperso", "Existem materiais ou práticas dispersas"),
          option("parcial", "Já existe uma base parcial, mas precisa ganhar método e consistência"),
          option("revisao", "Já existe estrutura e precisamos revisar / reconstruir"),
        ] },
        { id: "o_que_ja_existe", label: "O que já existe e pode ser aproveitado?", type: "textarea", maxlength: 1600, placeholder: "Políticas, planilhas, fluxos, sistemas, documentos, rituais, indicadores ou materiais que não precisam começar do zero." },
        { id: "objetivo_primeiro_ciclo", label: "Se o primeiro ciclo terminasse muito bem, o que precisaria estar implantado ou encaminhado?", type: "textarea", required: true, maxlength: 1600 },
        { id: "resultado_esperado", label: "Qual mudança concreta a diretoria espera perceber ao final desta estruturação?", type: "textarea", required: true, maxlength: 1600 },
      ]},
      { title: "Capacidade de implantação", description: "O Build funciona quando existe execução interna entre um checkpoint e outro. Esta etapa mede a capacidade real, não a intenção.", fields: [
        { id: "capacidade_execucao", label: "Quanto tempo o responsável interno consegue dedicar por semana à implantação?", type: "select", required: true, span: 6, options: [option("menos2", "Menos de 2 horas"), option("2a4", "De 2 a 4 horas"), option("5a8", "De 5 a 8 horas"), option("9mais", "9 horas ou mais")] },
        { id: "autonomia_implantacao", label: "Qual autonomia essa pessoa tem para construir e propor mudanças?", type: "select", required: true, span: 6, options: [option("alta", "Alta — consegue construir e levar para aprovação"), option("parcial", "Parcial — depende de validações frequentes"), option("baixa", "Baixa — precisa de autorização para a maior parte dos movimentos")] },
        { id: "acesso_insumos", label: "Dados, documentos e pessoas necessários para a implantação estão acessíveis?", type: "radio", required: true, options: [option("sim", "Sim, em grande parte"), option("parcial", "Parcialmente"), option("nao", "Ainda precisam ser organizados ou liberados")] },
        { id: "dependencias", label: "Quais áreas precisam participar ou aprovar partes da implantação?", type: "checkboxes", help: "Selecione somente o que realmente entra no caminho da implantação.", options: [option("diretoria", "Diretoria / board"), option("juridico", "Jurídico / compliance"), option("dp", "DP / folha / contabilidade"), option("sst", "SST / medicina do trabalho"), option("ti", "TI / sistemas / dados"), option("financeiro", "Financeiro"), option("comunicacao", "Comunicação / Marketing")] },
        { id: "principal_bloqueio", label: "Hoje, o que mais pode atrasar ou travar essa implantação?", type: "textarea", maxlength: 1400 },
        { id: "cadencia_build", label: "Qual ritmo parece viável para os checkpoints com a CALI?", type: "radio", required: true, options: [option("semanal", "Semanal"), option("quinzenal", "Quinzenal"), option("mensal", "Mensal"), option("recomendar", "Quero que a CALI recomende")] },
      ]},
      { title: "Decisão e formato", description: "Últimos pontos para desenhar duração, carga mensal, governança e proposta comercial.", fields: [
        { id: "sponsor_nome", label: "Quem patrocina esta estruturação na liderança?", type: "text", required: true, span: 6, maxlength: 120 },
        { id: "sponsor_cargo", label: "Cargo do sponsor", type: "text", required: true, span: 6, maxlength: 120 },
        { id: "aprovacao_status", label: "Em que etapa está a decisão?", type: "select", required: true, span: 6, options: [option("aprovada", "A estruturação está aprovada"), option("aprovada_sem_budget", "Aprovada; orçamento ainda será definido"), option("propostas", "A diretoria pediu propostas para decidir"), option("avaliacao", "Ainda está em avaliação interna")] },
        { id: "budget_status", label: "A empresa já definiu orçamento para esta estruturação?", type: "radio", required: true, options: [option("conheco", "Sim, e eu conheço o valor"), option("existe_sem_valor", "Existe orçamento, mas o valor não foi compartilhado comigo"), option("propostas_primeiro", "A diretoria quer avaliar propostas antes de definir"), option("nao_definido", "Ainda não existe orçamento definido")] },
        { id: "budget_teto", label: "Qual é o teto mensal aproximado disponível?", type: "number", min: 1, max: 1000000, step: 100, required: true, span: 6, help: "Informe uma referência aproximada. Este campo não altera o escopo automaticamente; ele ajuda a desenhar a proposta.", showWhen: { field: "budget_status", equals: "conheco" } },
        { id: "visita_interesse", label: "Você gostaria de prever alguma atuação presencial?", type: "radio", required: true, options: [option("online", "Não — 100% online está ótimo"), option("eventual", "Talvez, em momentos específicos"), option("recorrente", "Sim, gostaria de prever visitas recorrentes")] },
        { id: "visita_localidade", label: "Em qual cidade e estado aconteceria a visita?", type: "text", required: true, span: 6, maxlength: 160, placeholder: "Ex.: Curitiba/PR", showWhen: { field: "visita_interesse", in: ["eventual","recorrente"] } },
        { id: "visita_frequencia", label: "Qual frequência presencial imagina?", type: "select", required: true, span: 6, showWhen: { field: "visita_interesse", equals: "recorrente" }, options: [option("mensal", "Mensal"), option("bimestral", "Bimestral"), option("trimestral", "Trimestral"), option("definir", "A definir com a CALI")] },
        { id: "prazo_inicio", label: "Quando gostaria de iniciar?", type: "select", required: true, span: 6, options: [option("imediato", "O quanto antes"), option("30", "Em até 30 dias"), option("60", "Entre 30 e 60 dias"), option("90", "Em até 90 dias"), option("planejamento", "Estou planejando")] },
        { id: "observacoes", label: "Algo importante que não perguntamos?", type: "textarea", maxlength: 1600 },
      ]},
    ],
    alerts(answers) {
      const alerts = [];
      const fronts = Array.isArray(answers.frentes) ? answers.frentes : [];
      const people = Number(answers.pessoas_rh || 0);
      const size = Number(answers.colaboradores || 0);
      if (answers.responsavel_implantacao === "nao") alerts.push({ level: "high", text: "O CALI Build exige uma pessoa interna responsável pela execução. Sem esse papel, avaliar CALI Full ou redefinir o desenho antes da proposta." });
      if (answers.capacidade_execucao === "menos2") alerts.push({ level: "high", text: "Capacidade interna muito baixa para implantação: revisar ritmo, escopo e viabilidade do Build." });
      if (size >= 300 && people > 0 && size / people > 150) alerts.push({ level: "medium", text: "Relação colaboradores por profissional de RH elevada: considerar maior carga de acompanhamento e implantação por fases." });
      if (answers.escopo_build === "frente_especifica" && fronts.length > 1) alerts.push({ level: "medium", text: "O briefing marcou uma frente específica, mas selecionou várias frentes. Confirmar qual é a prioridade real do primeiro ciclo." });
      return alerts;
    },
    notices(a) {
      const x = [];
      if (a.mapa_people_status === "sim") x.push({ level: "info", text: "Se o Mapa de People foi respondido com o mesmo e-mail, ele será localizado automaticamente e usado como leitura de contexto; você não precisa repetir o diagnóstico aqui." });
      if (a.responsavel_implantacao === "nao") x.push({ level: "attention", text: "No Build, a execução é obrigatoriamente interna. Se a CALI precisar executar no lugar do RH, o serviço correto passa a ser CALI Full." });
      if (["eventual","recorrente"].includes(a.visita_interesse)) x.push({ level: "attention", text: "Visitas presenciais são adicionais. Quando houver deslocamento, passagem, hospedagem, alimentação e demais custos são pagos antecipadamente pela contratante, e não por reembolso posterior." });
      return x;
    },
  },
  "mentoria-rh": {
    slug: "mentoria-rh", code: "MRH", title: "Programa de Desenvolvimento para Profissionais de RH", kicker: "Maturidade, decisão e posicionamento", intro: "Este formulário ajuda a entender o momento profissional e desenhar um programa completo, com começo, desenvolvimento e fechamento.",
    packages: [
      { code: "ESSENCIAL", label: "Programa Essencial", description: "Três encontros para organizar um objetivo prioritário e construir um plano aplicável." },
      { code: "AMPLIADO", label: "Programa Ampliado", description: "Cinco encontros para aprofundar competências relacionadas e acompanhar a aplicação prática." },
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
      { title: "Formato do programa", fields: [
        { id: "modalidade", label: "Como o programa será contratado?", type: "radio", required: true, options: [option("individual", "Individual", "Para uma pessoa, com objetivos e casos profissionais próprios."), option("grupo", "Grupo da mesma empresa", "Para até 5 profissionais da mesma empresa, com uma agenda comum de desenvolvimento.")] },
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
        investmentField("mentoria-rh", "Até quanto você ou a empresa considera investir neste ciclo?"),
      ]},
    ],
    alerts(a) { const x=[]; if(a.modalidade==="grupo"&&Number(a.participantes)>5)x.push({level:"high",text:"O programa em grupo é limitado a 5 participantes da mesma empresa."}); if(a.suporte==="proximo")x.push({level:"medium",text:"Prever carga adicional de suporte entre encontros."}); if(a.modalidade==="grupo"&&["avaliacao","nao_apresentada"].includes(a.status_iniciativa))x.push({level:"medium",text:"Iniciativa corporativa ainda não aprovada: a proposta deve apoiar a decisão e explicitar as premissas."}); if(a.frequencia==="semanal")x.push({level:"medium",text:"Cadência semanal: validar agenda e intensidade do ciclo."}); return x; },
    notices(a) { const x=[]; if(a.modalidade==="grupo")x.push({level:"info",text:"O programa em grupo atende até 5 profissionais da mesma empresa e parte de um objetivo comum. Casos individuais continuam sendo tratados com confidencialidade."}); if(a.status_iniciativa==="nao_apresentada")x.push({level:"attention",text:"Tudo bem estar no início: a proposta poderá ser estruturada para apoiar a apresentação interna e a tomada de decisão."}); if(a.suporte==="proximo")x.push({level:"info",text:"Check-ins e discussão de casos entre encontros aumentam a carga dedicada e serão considerados no desenho do ciclo."}); return x; },
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
        investmentField("diagnostico-executivo", "Até quanto a empresa considera investir neste diagnóstico?"),
      ]},
    ],
    alerts(a){const x=[]; if(Number(a.entrevistas)>10)x.push({level:"medium",text:"Mais de 10 entrevistas: revisar carga e cronograma."}); if(a.documentos==="desorganizada"||a.acesso_dados==="nao")x.push({level:"high",text:"Aplicar etapa e carga de organização documental antes da leitura."}); if(a.prazo_inicio==="imediato")x.push({level:"medium",text:"Confirmar disponibilidade mínima de quatro semanas."}); return x;},
    notices(a){const x=[]; if(a.acesso_dados==="nao")x.push({level:"attention",text:"Sem dados organizados, o cronograma precisa prever uma etapa inicial de coleta e estruturação das informações."}); if(a.prazo_inicio==="imediato")x.push({level:"info",text:"Diagnósticos executivos exigem agenda de entrevistas e acesso a documentos; o início imediato depende da disponibilidade das pessoas-chave."}); return x;},
  },
  "cultura-direcao": {
    slug: "cultura-direcao", code: "PCD", title: "Projeto de Cultura e Direção", kicker: "Cultura traduzida em comportamento", intro: "Mapeamos o que acontece por baixo das estruturas formais e conectamos cultura à estratégia.",
    packages:[{code:"PROJETO",label:"Projeto Cultura e Direção",description:"Leitura da cultura atual, definição de comportamentos e roadmap de 90 dias."}],
    sections:[
      {title:"Contato",fields:COMMON_CONTACT},{title:"Empresa",fields:COMMON_COMPANY},
      {title:"Cultura e transformação",fields:[
        {id:"contexto",label:"O que motivou o projeto?",type:"checkboxes",required:true,options:[option("crescimento","Crescimento"),option("ma","Fusão ou aquisição"),option("reestruturacao","Reestruturação"),option("desalinhamento","Desalinhamento entre discurso e prática"),option("lideranca","Mudança de liderança"),option("marca","Reposicionamento de marca")]},
        {id:"palavra_atual",label:"Se a cultura atual fosse uma palavra, qual seria?",type:"text",required:true,span:6},
        {id:"palavra_desejada",label:"E a cultura desejada?",type:"text",required:true,span:6},
        {id:"pesquisa",label:"Alcance da pesquisa quantitativa",type:"select",required:true,span:6,options:[option("amostra","Amostra"),option("todos","Todos os colaboradores"),option("definir","A definir")]},
        {id:"entrevistas",label:"Entrevistas individuais previstas",type:"number",min:1,value:4,span:6},
        {id:"grupos",label:"Grupos focais previstos",type:"number",min:0,value:1,span:6},
        {id:"workshops",label:"Workshops com liderança",type:"number",min:1,value:1,span:6},
        {id:"patrocinio_lideranca",label:"Qual é o nível de patrocínio da alta liderança?",type:"select",required:true,span:6,options:[option("alto","Alto — prioridade executiva"),option("parcial","Parcial — ainda precisa de alinhamento"),option("baixo","Baixo — iniciativa concentrada no RH")]},
        {id:"comunicacao_interna",label:"Existe canal e equipe para comunicar e mobilizar as pessoas?",type:"select",required:true,span:6,options:[option("sim","Sim, estruturados"),option("parcial","Parcialmente"),option("nao","Ainda não")]},
        {id:"sensibilidades",label:"Há histórico, conflito ou tema sensível que precisa ser considerado?",type:"textarea",maxlength:1500,help:"Não inclua nomes ou dados pessoais sensíveis de terceiros neste briefing."},
        {id:"principal_gap",label:"Onde a distância entre cultura e estratégia aparece com mais força?",type:"textarea",required:true},
        {id:"prazo_inicio",label:"Quando gostaria de iniciar?",type:"select",required:true,options:[option("30","Até 30 dias"),option("60","30 a 60 dias"),option("90","Em até 90 dias"),option("planejamento","Em planejamento")]},
        investmentField("cultura-direcao", "Até quanto a empresa considera investir neste projeto?"),
      ]},
    ],
    alerts(a){const x=[]; if(Number(a.colaboradores)>200||Number(a.unidades)>3)x.push({level:"medium",text:"Revisar amostra, comunicação e logística por porte."}); if((a.contexto||[]).includes("ma"))x.push({level:"high",text:"Contexto de M&A exige trilha específica de integração cultural."}); if(a.patrocinio_lideranca==="baixo")x.push({level:"high",text:"Baixo patrocínio executivo: prever etapa de alinhamento antes da mobilização ampla."}); return x;},
    notices(a){const x=[]; if(a.patrocinio_lideranca==="baixo")x.push({level:"attention",text:"Projetos de cultura precisam de patrocínio visível da liderança. A proposta poderá incluir uma etapa inicial de alinhamento executivo."}); if((a.contexto||[]).includes("ma"))x.push({level:"info",text:"Em fusões ou aquisições, o desenho considera identidades anteriores, integração e riscos de perda de pessoas-chave."}); return x;},
  },
  "shadowing-lideranca": {
    slug:"shadowing-lideranca",code:"SHL",title:"Shadowing de Liderança",kicker:"Observar a liderança como ela realmente acontece",intro:"O escopo parte de situações reais, com observação estruturada e devolutiva franca.",
    packages:[{code:"CICLO",label:"Ciclo Individual de Shadowing",description:"Observação estruturada, devolutiva individual e plano de desenvolvimento para uma liderança."}],
    sections:[
      {title:"Contato",fields:COMMON_CONTACT},{title:"Empresa",fields:COMMON_COMPANY},
      {title:"Ciclo de observação",fields:[
        {id:"lideres",label:"Número de líderes",type:"number",min:1,required:true,span:4,help:"O investimento cobre um ciclo individual por liderança. Quando houver mais pessoas, os ciclos são organizados separadamente."},
        {id:"nivel",label:"Nível predominante",type:"select",required:true,span:8,options:[option("primeira","Primeira liderança"),option("gerencia","Gerência"),option("diretoria","Diretoria"),option("founders","Founders ou sócios")]},
        {id:"situacoes",label:"Situações que devem ser observadas",type:"checkboxes",required:true,options:[option("reunioes","Reuniões de time"),option("decisoes","Tomada de decisão"),option("feedback","Feedback e conversas difíceis"),option("conflito","Conflitos"),option("rituais","Rituais de gestão"),option("um_a_um","Reuniões individuais") ]},
        {id:"horas",label:"Horas de observação por líder no ciclo",type:"number",min:2,value:4,span:6},
        {id:"presencial",label:"Formato",type:"select",required:true,span:6,options:[option("presencial","Presencial, recomendado"),option("hibrido","Híbrido"),option("remoto","Remoto") ]},
        {id:"devolutiva",label:"Formato de devolutiva",type:"select",required:true,span:6,options:[option("individual","Individual"),option("individual_executiva","Individual + síntese executiva") ]},
        {id:"feedback_360",label:"Incluir coleta 360°?",type:"radio",required:true,options:[option("nao","Não"),option("sim","Sim") ]},
        {id:"ciencia_lideres",label:"As lideranças observadas já sabem ou concordam com a proposta?",type:"select",required:true,options:[option("sim","Sim"),option("parcial","Algumas já sabem"),option("nao","Ainda não foi apresentada")]},
        {id:"contexto_observacao",label:"Em quais rituais, projetos ou decisões a observação pode acontecer?",type:"textarea",required:true,maxlength:1500},
        {id:"destinatario_devolutiva",label:"Quem receberá a síntese executiva, se houver?",type:"text",maxlength:180,showWhen:{field:"devolutiva",equals:"individual_executiva"}},
        {id:"confidencialidade",label:"Há alguma condição especial de confidencialidade?",type:"textarea"},
        {id:"objetivo",label:"O que precisa mudar na prática ao final do ciclo?",type:"textarea",required:true},
        investmentField("shadowing-lideranca", "Até quanto a empresa considera investir neste ciclo?"),
      ]},
    ],
    alerts(a){const x=[]; if(a.presencial==="remoto")x.push({level:"medium",text:"O presencial é recomendado por ser a essência do Shadowing."}); if(Number(a.lideres)>1)x.push({level:"high",text:"O Shadowing é individual: organizar uma proposta ou ciclo próprio para cada liderança."}); if(a.ciencia_lideres==="nao")x.push({level:"high",text:"Planejar comunicação e consentimento antes da observação."}); return x;},
    notices(a){const x=[]; if(a.ciencia_lideres==="nao")x.push({level:"attention",text:"A observação precisa ser apresentada com transparência. O escopo pode incluir uma conversa de alinhamento antes do início."}); if(a.presencial==="remoto")x.push({level:"info",text:"O formato remoto é possível quando existem rituais reais observáveis online; o presencial costuma gerar uma leitura mais completa."}); return x;},
  },
  treinamentos: {
    slug:"treinamentos",code:"TRN",title:"Treinamentos & Palestras",kicker:"Conteúdo sob medida, conectado ao contexto real",intro:"Palestras, workshops, treinamentos e programas de liderança desenhados conforme objetivo, público, nível de interação e contexto da empresa.",
    packages:[
      {code:"PALESTRA",label:"Palestra Estratégica",description:"Encontro único de 60 ou 90 minutos, com conteúdo objetivo e interação compatível com o tempo disponível."},
      {code:"WORKSHOP",label:"Workshop Aplicado",description:"Oficina prática de 2 a 4 horas, com exercícios ou dinâmica conectados ao contexto real."},
      {code:"TREINAMENTO",label:"Treinamento Personalizado",description:"Desenvolvimento de uma competência prioritária em 2 ou 3 encontros, com prática entre etapas."},
      {code:"PROGRAMA",label:"Programa de Liderança Sob Medida",description:"Trilha estruturada de 4 a 10 encontros, com evolução acompanhada."},
    ],
    sections:[
      {title:"Contato",fields:COMMON_CONTACT},
      {title:"Empresa",description:"Informações para dimensionar público, logística e contexto da contratação.",fields:COMMON_COMPANY_TRAINING},
      {title:"Objetivo e tipo de contratação",description:"Escolha a solução que mais se aproxima do que você busca. O desenho final considera duração, público-alvo, formato, nível de interação, personalização, localidade e demais necessidades da ação.",fields:[
        {id:"tipo_contratacao",label:"O que você está buscando?",type:"radio",required:true,help:"Você não precisa montar o formato sozinho. As opções abaixo definem os limites iniciais e a CALI ajusta o desenho final conforme o contexto.",options:[
          option("palestra","Palestra Estratégica"),
          option("workshop","Workshop Aplicado"),
          option("treinamento","Treinamento Personalizado"),
          option("programa_lideranca","Programa / trilha de desenvolvimento de lideranças"),
          option("recomendar","Ainda não sei — quero que a CALI recomende"),
        ]},
        {id:"campanha_vinculada",label:"Esta palestra está ligada a uma campanha ou data do calendário?",type:"radio",required:true,showWhen:{field:"tipo_contratacao",equals:"palestra"},options:[option("sim","Sim"),option("nao","Não")]},
        {id:"campanha_calendario",label:"Qual é a campanha ou data?",type:"select",required:true,span:6,showWhen:{field:"campanha_vinculada",equals:"sim"},options:[
          option("janeiro_branco","Janeiro Branco"),
          option("kickoff","Kickoff / início do ano"),
          option("dia_mulher","Dia da Mulher"),
          option("abril_verde_sipat","Abril Verde / SIPAT"),
          option("dia_trabalho","Dia do Trabalho"),
          option("dia_maes","Dia das Mães"),
          option("orgulho_lgbtqia","Mês do Orgulho LGBTQIA+"),
          option("agosto_lilas","Agosto Lilás"),
          option("dia_pais","Dia dos Pais"),
          option("setembro_amarelo","Setembro Amarelo"),
          option("outubro_rosa","Outubro Rosa"),
          option("dia_criancas","Dia das Crianças"),
          option("novembro_azul","Novembro Azul"),
          option("consciencia_negra","Consciência Negra"),
          option("black_friday","Black Friday / alta temporada"),
          option("fechamento_ano","Fechamento de ano / Natal"),
          option("outro","Outra campanha ou data"),
        ]},
        {id:"campanha_outro",label:"Qual campanha ou data?",type:"text",required:true,span:6,maxlength:160,showWhen:{field:"campanha_calendario",equals:"outro"}},
        {id:"recorrencia_esperada",label:"Você imagina uma ação pontual ou uma jornada com mais encontros?",type:"select",required:true,span:6,showWhen:{field:"tipo_contratacao",equals:"recomendar"},options:[
          option("unica","Uma ação única"),
          option("2a3","Dois ou três encontros"),
          option("4mais","Quatro ou mais encontros"),
          option("nao_sei","Ainda não sei"),
        ]},
        {id:"tema_status",label:"O tema já está definido?",type:"radio",required:true,options:[option("definido","Sim, quero indicar o tema"),option("recomendar","Quero que a CALI recomende o tema")]},
        {id:"tema",label:"Tema principal ou título desejado",type:"text",required:true,maxlength:220,showWhen:{field:"tema_status",equals:"definido"}},
        {id:"contexto",label:"Qual contexto motivou esta contratação?",type:"textarea",required:true,maxlength:1800,placeholder:"Ex.: campanha interna, semana de saúde, convenção, mudança de liderança, necessidade de desenvolver uma competência ou outro contexto."},
        {id:"objetivo",label:"O que precisa estar diferente depois do encontro ou da trilha?",type:"textarea",required:true,maxlength:1800},
      ]},
      {title:"Público e desenho",description:"As próximas perguntas mudam conforme o tipo de solução escolhido. Você verá apenas o que faz sentido para esse formato.",fields:[
        {id:"publico",label:"Quem participará?",type:"checkboxes",required:true,help:"Se selecionar “Toda a empresa”, os demais públicos ficam indisponíveis para evitar combinações contraditórias.",options:[
          option("empresa","Toda a empresa"),option("liderancas","Lideranças"),option("diretoria","Diretoria ou C-level"),option("rh","Time de RH"),
          option("operacional","Equipe operacional"),option("especialistas","Especialistas ou técnicos"),option("area","Uma área específica"),option("misto","Público misto"),
        ]},
        {id:"nivel_publico",label:"Nível predominante, quando fizer sentido",type:"select",span:6,options:[
          option("nao_aplica","Não se aplica / público amplo"),option("primeira_lideranca","Primeira liderança"),
          option("gestao","Coordenação e gerência"),option("executiva","Diretoria e C-level"),option("misto","Misto"),
        ]},
        {id:"participantes",label:"Quantidade estimada de participantes",type:"number",min:1,required:true,span:3},
        {id:"turmas",label:"Número de grupos / turmas",type:"number",min:1,value:1,required:true,span:3},
        {id:"formato",label:"Formato desejado",type:"select",required:true,span:6,options:[option("online","Remoto (Google Meet)"),option("presencial","Presencial"),option("hibrido","Híbrido")]},
        {id:"local_estado",label:"Estado da realização",type:"select",required:true,span:3,options:BRAZIL_STATES,showWhen:{field:"formato",in:["presencial","hibrido"]}},
        {id:"local_cidade",label:"Cidade da realização",type:"text",required:true,span:3,maxlength:120,placeholder:"Ex.: Curitiba",showWhen:{field:"formato",in:["presencial","hibrido"]}},
        {id:"local_cep",label:"CEP do local",type:"text",required:true,span:3,maxlength:9,inputmode:"numeric",cep:true,placeholder:"00000-000",showWhen:{field:"formato",in:["presencial","hibrido"]}},
        {id:"local_logradouro",label:"Endereço / logradouro",type:"text",required:true,span:6,maxlength:220,placeholder:"Rua, avenida, rodovia…",showWhen:{field:"formato",in:["presencial","hibrido"]}},
        {id:"local_numero",label:"Número da unidade / filial",type:"text",required:true,span:3,maxlength:30,placeholder:"Ex.: 850",showWhen:{field:"formato",in:["presencial","hibrido"]}},
        {id:"local_complemento",label:"Complemento",type:"text",span:3,maxlength:120,placeholder:"Sala, bloco, andar…",showWhen:{field:"formato",in:["presencial","hibrido"]}},
        {id:"deslocamento_ciente",label:"Estou ciente de que, para realizações fora de Curitiba e Região Metropolitana, passagens, hospedagem, alimentação e deslocamentos locais são de responsabilidade da empresa contratante e não estão incluídos no valor do serviço.",type:"checkbox",required:true},
        {id:"encontros",label:"Número de encontros",type:"number",min:1,value:1,required:true,span:3},
        {id:"carga_horaria",label:"Duração por encontro",type:"select",required:true,span:3,options:[
          option("1","60 min"),option("1.5","90 min"),option("2","2 horas"),option("3","3 horas"),option("4","4 horas"),
        ]},
        {id:"nivel_interacao",label:"Como você imagina a participação do público?",type:"radio",required:true,options:[
          option("expositivo","Conteúdo expositivo, sem dinâmica"),option("perguntas","Conteúdo + perguntas ao final"),
          option("interacao","Interação ao longo da fala"),option("dinamica","Exercícios ou dinâmica prática"),option("recomendar","Quero que a CALI recomende"),
        ]},
        {id:"infraestrutura",label:"Estrutura disponível",type:"checkboxes",showWhen:{field:"formato",in:["presencial","hibrido"]},options:[option("sala","Sala adequada"),option("projetor","Projetor ou TV"),option("som","Sistema de som"),option("wifi","Wi-Fi")]},
        {id:"materiais",label:"Materiais físicos personalizados",type:"radio",required:true,options:[option("nao","Não"),option("sim","Sim")]},
        {id:"followup",label:"Deseja encontro de acompanhamento?",type:"radio",required:true,options:[option("nao","Não"),option("sim","Sim")]},
        {id:"acessibilidade",label:"Há necessidade de acessibilidade, tradução ou adaptação de materiais?",type:"textarea",span:6,maxlength:600},
      ]},
      {title:"Momento da contratação",description:"Agora eu preciso entender o momento da decisão e a faixa de investimento que a empresa considera possível.",fields:[
        {id:"decisao_evento",label:"Em que etapa está a contratação?",type:"select",required:true,span:6,options:[option("aprovada","Aprovada e com orçamento"),option("aprovada_sem_orcamento","Aprovada, orçamento em definição"),option("cotacao","Cotação ou comparação de fornecedores"),option("ideia","Ainda é uma ideia inicial")]},
        {id:"data_desejada",label:"Data ou período desejado",type:"text",required:true,span:6,maxlength:180},
        investmentField("treinamentos","Qual faixa de investimento a empresa considera para esta contratação?","budget","Use uma faixa aproximada. Esta resposta serve para entendermos a disponibilidade de investimento; o valor final será definido pela CALI a partir do escopo e do desenho da solução."),
        {id:"observacoes",label:"Existe alguma restrição, sensibilidade ou informação importante para o desenho?",type:"textarea",maxlength:1600},
      ]},
    ],
    alerts(a){const x=[]; const participants=Number(a.participantes||0),hours=Number(a.carga_horaria||0); if(participants>150)x.push({level:"high",text:"Público acima de 150 pessoas: revisar desenho, infraestrutura e nível de interação."}); else if(participants>40&&a.tipo_contratacao==="workshop")x.push({level:"medium",text:"Workshop com mais de 40 pessoas pode exigir divisão em grupos, apoio de facilitação ou adaptação da dinâmica."}); if(a.nivel_interacao==="dinamica"&&hours>0&&hours<=1.5)x.push({level:"medium",text:"Atividade prática em uma janela curta pode exigir revisão de duração para preservar a qualidade da aplicação."}); if(a.tipo_contratacao==="programa_lideranca"&&Number(a.encontros||0)<4)x.push({level:"medium",text:"Programas de liderança são estruturados entre 4 e 10 encontros; revise a quantidade antes da proposta."}); if(trainingNeedsTravel(a))x.push({level:"medium",text:"Realização fora de Curitiba e Região Metropolitana: prever estimativa de passagens, hospedagem, alimentação e deslocamentos locais por conta da contratante."}); if(a.data_desejada&&/próxima semana|semana que vem/i.test(a.data_desejada))x.push({level:"high",text:"Antecedência abaixo das quatro semanas recomendadas."}); return x;},
    notices(a){const x=[]; const participants=Number(a.participantes||0); if(a.formato==="online")x.push({level:"info",text:"No formato online, a realização acontece via Google Meet, com gravação e transcrição da sessão mediante ciência dos participantes."}); if(trainingNeedsTravel(a))x.push({level:"attention",text:"Esta localidade fica fora de Curitiba e da Região Metropolitana. Passagens, hospedagem, alimentação e deslocamentos locais ficam por conta da empresa contratante e serão estimados na proposta."}); if(participants>150)x.push({level:"attention",text:"Para públicos acima de 150 pessoas, o desenho considera escala, infraestrutura e formas de interação compatíveis com o evento."}); else if(participants>40&&a.tipo_contratacao==="workshop")x.push({level:"attention",text:"Em workshops com público maior, a dinâmica pode ser adaptada para manter participação e qualidade."}); return x;},
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
        investmentField("marca-empregadora", "Até quanto a empresa considera investir nesta iniciativa?"),
      ]},
    ],
    alerts(a){const x=[]; if(a.reviews==="negativas")x.push({level:"high",text:"Prever frente de reputação e resposta a passivos de percepção."}); if(a.modelo_contratacao==="recorrente"&&(a.ativos||[]).includes("evp"))x.push({level:"medium",text:"Separar fase inicial de definição do EVP da sustentação mensal."}); if(!(a.equipe_interna||[]).includes("marketing")&&!(a.equipe_interna||[]).includes("comunicacao"))x.push({level:"medium",text:"Sem Marketing ou Comunicação: definir capacidade interna de produção e aprovação."}); return x;},
    notices(a){const x=[]; if(a.reviews==="negativas")x.push({level:"attention",text:"Quando há avaliações negativas, a primeira etapa costuma ser leitura de causa e reputação antes de campanhas de atração."}); if(a.modelo_contratacao==="recorrente"&&(a.ativos||[]).includes("evp"))x.push({level:"info",text:"A definição do EVP é uma fase estruturante; a sustentação recorrente começa depois que essa base estiver validada."}); return x;},
  },
  "solucao-personalizada": {
    slug:"solucao-personalizada",
    code:"SOB",
    title:"Solução Personalizada",
    kicker:"Quando o desafio não cabe em uma categoria",
    intro:"Você não encontrou o serviço que precisa? Compartilhe sua necessidade. Eu avalio o contexto e, quando houver aderência, desenho uma solução personalizada.",
    boundaryTitle:"O que a CALI não executa",
    boundaryIntro:"A CALI atua em estratégia, estruturação e desenvolvimento de pessoas. Não fazem parte do escopo:",
    boundaryItems:[
      "Folha de pagamento, ponto, benefícios, admissões, férias, desligamentos, eSocial ou outras rotinas de Departamento Pessoal.",
      "Operação contínua de recrutamento, hunting em volume, abertura de vagas ou alocação de recrutadores.",
      "Serviços jurídicos, contábeis, médicos, clínicos ou outras atividades técnicas reguladas.",
      "Terceirização de rotinas administrativas ou execução transacional contínua do RH.",
    ],
    boundaryClosing:"Fora desses limites, conte o seu desafio. Eu avalio a aderência e proponho o formato mais coerente — sem encaixar sua necessidade à força em um pacote pronto.",
    packages:[{code:"SOB_MEDIDA",label:"Projeto sob medida",description:"Escopo, formato e investimento construídos após a leitura do contexto."}],
    sections:[
      {title:"Sobre você",description:"Quem conduz esta conversa com a CALI.",fields:COMMON_CONTACT},
      {title:"Sobre a empresa",description:"Contexto para dimensionar a necessidade e a complexidade.",fields:COMMON_COMPANY},
      {title:"O desafio",description:"Conte o que está acontecendo hoje e o que precisa mudar.",fields:[
        {id:"temas_aproximados",label:"De quais temas esta necessidade mais se aproxima?",type:"checkboxes",required:true,help:"Selecione quantos forem necessários. Esta escolha só organiza a leitura; ela não limita o desenho.",options:[option("estrategia_pessoas","Estratégia de pessoas e RH"),option("estrutura_processos","Estrutura, políticas ou processos"),option("lideranca","Liderança e tomada de decisão"),option("cultura","Cultura e transformação"),option("carreira_desenvolvimento","Carreira e desenvolvimento"),option("dados_indicadores","Dados, indicadores e People Analytics"),option("comunicacao_experiencia","Comunicação e experiência do colaborador"),option("atracao_marca","Atração e marca empregadora"),option("treinamento","Treinamento, palestra ou facilitação"),option("outro","Outro desafio") ]},
        {id:"necessidade_descricao",label:"O que está acontecendo hoje e por que essa necessidade surgiu?",type:"textarea",required:true,maxlength:3000,placeholder:"Traga o contexto, os sinais percebidos e o que motivou esta busca."},
        {id:"resultado_esperado",label:"O que precisa estar diferente ao final deste trabalho?",type:"textarea",required:true,maxlength:2000},
        {id:"impacto_negocio",label:"Que impacto esta situação gera hoje para o negócio ou para as pessoas?",type:"textarea",maxlength:1800,placeholder:"Ex.: decisões lentas, retrabalho, risco, perda de talentos, baixa clareza ou crescimento travado."},
        {id:"publico_envolvido",label:"Quem será envolvido ou impactado?",type:"checkboxes",required:true,options:[option("founders","Founders ou sócios"),option("diretoria","Diretoria ou C-level"),option("liderancas","Lideranças"),option("rh","Time de RH"),option("area","Uma área específica"),option("empresa","Toda a empresa"),option("outros","Outros públicos") ]},
        {id:"quantidade_pessoas",label:"Número aproximado de pessoas diretamente envolvidas",type:"number",min:1,max:1000000,span:6},
        {id:"tentativas_anteriores",label:"O que já foi tentado e o que aconteceu?",type:"textarea",maxlength:1600,placeholder:"Campo opcional, mas ajuda a evitar repetir soluções que não funcionaram."},
      ]},
      {title:"Formato e decisão",description:"Informações práticas para eu avaliar o melhor encaixe.",fields:[
        {id:"formato_desejado",label:"Qual formato parece mais adequado?",type:"radio",required:true,options:[option("remoto","Remoto"),option("hibrido","Híbrido"),option("presencial","Presencial"),option("avaliar","Quero que a CALI recomende")]},
        {id:"local_execucao",label:"Cidade e estado caso exista etapa presencial",type:"text",span:6,maxlength:180},
        {id:"prazo_inicio",label:"Quando gostaria de iniciar?",type:"select",required:true,span:6,options:[option("imediato","O quanto antes"),option("30","Em até 30 dias"),option("60","Entre 30 e 60 dias"),option("90","Em até 90 dias"),option("planejamento","Ainda estou planejando")]},
        {id:"decisores",label:"Quem participa da decisão?",type:"text",required:true,span:6,maxlength:220,placeholder:"Nome, cargo ou área"},
        {id:"etapa_decisao",label:"Em que etapa está esta contratação?",type:"select",required:true,span:6,options:[option("aprovada","Demanda aprovada e com orçamento"),option("orcamento","Demanda aprovada; orçamento em definição"),option("avaliacao","Em avaliação interna"),option("exploratoria","Primeira conversa exploratória")]},
        investmentField("solucao-personalizada", "Até quanto a empresa considera investir nesta solução?"),
        {id:"restricoes",label:"Existe algum prazo, restrição, sensibilidade ou condição que eu precise considerar?",type:"textarea",maxlength:1600},
        {id:"observacoes",label:"Algo importante que não perguntamos?",type:"textarea",maxlength:1600},
      ]},
    ],
    alerts(a){const x=[];if(a.prazo_inicio==="imediato")x.push({level:"medium",text:"Início imediato: validar agenda, disponibilidade dos decisores e insumos mínimos."});if(a.formato_desejado==="presencial"&&!String(a.local_execucao||"").toLowerCase().includes("curitiba"))x.push({level:"medium",text:"Etapa presencial fora de Curitiba e Região Metropolitana: prever deslocamento e eventual hospedagem."});if(a.etapa_decisao==="exploratoria")x.push({level:"medium",text:"Demanda ainda exploratória: a proposta deve explicitar premissas e possíveis caminhos antes de fechar o escopo."});return x;},
    notices(a){const x=[];if(a.formato_desejado==="presencial")x.push({level:"info",text:"Atuações presenciais são avaliadas conforme localidade, agenda, deslocamento e carga dedicada."});if(a.etapa_decisao==="exploratoria")x.push({level:"attention",text:"Tudo bem ainda não ter um escopo fechado. A leitura deste briefing serve justamente para organizar o melhor caminho."});return x;},
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

export function investmentContextFor(service, answers = {}) {
  if (service.slug === "cali-build") {
    const status = String(answers.budget_status || "");
    if (!status) return null;
    const max = status === "conheco" && Number(answers.budget_teto) > 0 ? Number(answers.budget_teto) : null;
    const labels = {
      conheco: "Orçamento informado pelo lead",
      existe_sem_valor: "Existe orçamento, valor não compartilhado",
      propostas_primeiro: "Diretoria quer avaliar propostas primeiro",
      nao_definido: "Orçamento ainda não definido",
    };
    return { value: status, label: labels[status] || status, min: null, max, period: "por mês", open: max === null };
  }
  const config = INVESTMENT_BANDS[service.slug];
  if (!config) return null;
  const value = answers.investimento || answers.budget || "";
  if (!value) return null;
  const band = config.options.find((item) => item.value === value) || LEGACY_INVESTMENT_BANDS[service.slug]?.find((item) => item.value === value);
  if (!band) return null;
  return { value, label: band.label, min: band.min, max: band.max, period: config.period, open: value === "avaliar" };
}

export function initialPackageFor(service, answers = {}) {
  if (service.slug === "assessoria-estrategica") {
    const investment = investmentContextFor(service, answers);
    if (investment?.max && investment.max <= 5800) return "PARTNER";
    if (["PARTNER", "FULL"].includes(answers.modelo_interesse)) return answers.modelo_interesse;
    const fronts = answers.frentes?.length || 0;
    if (fronts >= 5 || answers.frequencia === "semanal" || answers.presencial === "mensal" || answers.presencial === "mais") return "FULL";
    return "PARTNER";
  }
  if (service.slug === "cali-build") {
    const size = Number(answers.colaboradores || 0);
    const people = Number(answers.pessoas_rh || 0);
    const fronts = Array.isArray(answers.frentes) ? answers.frentes.length : 0;
    const ratio = people > 0 ? size / people : size;
    const complexScope = ["rh_completo","multiplas_frentes"].includes(String(answers.escopo_build || ""));
    const complex = complexScope || fronts >= 3 || answers.cadencia_build === "semanal" || answers.capacidade_execucao === "menos2" || (size >= 300 && (people <= 2 || ratio > 150 || fronts >= 2));
    return complex ? "COMPLETO" : "ESSENCIAL";
  }
  if (service.slug === "treinamentos") {
    const requested = String(answers.tipo_contratacao || "");
    if (requested === "palestra" || requested === "campanha" || requested === "palestra_tema") return "PALESTRA";
    if (requested === "workshop") return "WORKSHOP";
    if (requested === "treinamento") return "TREINAMENTO";
    if (requested === "programa_lideranca") return "PROGRAMA";
    const recurrence = String(answers.recorrencia_esperada || "");
    const meetings = Number(answers.encontros || (recurrence === "4mais" ? 4 : recurrence === "2a3" ? 2 : 1));
    const hours = Number(answers.carga_horaria || 1.5);
    const interaction = String(answers.nivel_interacao || "");
    const audience = Array.isArray(answers.publico) ? answers.publico : [];
    if (recurrence === "4mais" || (meetings >= 4 && (audience.includes("liderancas") || audience.includes("diretoria")))) return "PROGRAMA";
    if (recurrence === "2a3" || meetings > 1) return "TREINAMENTO";
    if (interaction === "dinamica" || hours >= 2) return "WORKSHOP";
    return "PALESTRA";
  }
  if (service.slug === "mentoria-rh") {
    if (answers.modalidade === "grupo" || answers.suporte === "proximo" || (answers.objetivos?.length || 0) >= 3 || answers.frequencia === "semanal") return "AMPLIADO";
    return "ESSENCIAL";
  }
  if (service.slug === "diagnostico-executivo") return Number(answers.entrevistas || 0) > 3 || answers.survey === "sim" || answers.documentos !== "organizada" ? "COMPLETO" : "ESSENCIAL";
  if (service.slug === "cultura-direcao") return "PROJETO";
  if (service.slug === "shadowing-lideranca") return "CICLO";
  if (service.slug === "marca-empregadora") return answers.modelo_contratacao === "recorrente" ? "RECORRENTE" : "PROJETO";
  return service.packages?.[0]?.code || "PERSONALIZADO";
}

export function calculateProposal({ service, answers, packageCode, basePrice, discount = 0, extras = 0, months = 1, finalOverride = null, scopeMode = "integral" }) {
  const n = (value, fallback = 0) => Number(value) || fallback;
  let factor = 1;
  const breakdown = [];
  if (service.slug === "assessoria-estrategica") {
    const size = n(answers.colaboradores, 20);
    const sizeFactor = size <= 20 ? 1 : size <= 50 ? 1.08 : size <= 100 ? 1.15 : 1.22;
    const fronts = answers.frentes?.length || 1;
    const included = packageCode === "FULL" ? 2 : 1;
    const frontFactor = 1 + Math.max(0, fronts - included) * 0.06;
    const cadenceFactor = answers.frequencia === "semanal" ? 1.14 : answers.frequencia === "quinzenal" ? 1.06 : 1;
    factor = sizeFactor * frontFactor * cadenceFactor;
    breakdown.push(["Porte", sizeFactor], ["Frentes", frontFactor], ["Cadência", cadenceFactor]);
    const minimumMonths = packageCode === "FULL" ? 12 : 8;
    months = Math.max(n(months, minimumMonths), minimumMonths);
  } else if (service.slug === "cali-build") {
    const size = n(answers.colaboradores, 20);
    const people = n(answers.pessoas_rh, 0);
    const fronts = Array.isArray(answers.frentes) ? answers.frentes.length : 0;
    const included = packageCode === "COMPLETO" ? 3 : 1;
    const sizeDelta = size <= 50 ? 0 : size <= 100 ? 0.05 : size <= 250 ? 0.12 : size <= 500 ? 0.20 : size <= 1000 ? 0.28 : 0.35;
    const scopeDelta = answers.escopo_build === "rh_completo" ? 0.10 : answers.escopo_build === "multiplas_frentes" ? 0.07 : 0;
    const frontDelta = Math.min(0.15, Math.max(0, fronts - included) * 0.03);
    const capacityDelta = answers.capacidade_execucao === "menos2" ? 0.08 : answers.capacidade_execucao === "2a4" ? 0.05 : answers.capacidade_execucao === "5a8" ? 0.02 : 0;
    const ratio = people > 0 ? size / people : size;
    const ratioDelta = ratio > 250 ? 0.10 : ratio > 150 ? 0.07 : ratio > 100 ? 0.04 : 0;
    const cadenceDelta = answers.cadencia_build === "semanal" ? 0.05 : answers.cadencia_build === "quinzenal" ? 0.02 : 0;
    const startingDelta = answers.ponto_partida === "zero" ? 0.04 : 0;
    factor = 1 + sizeDelta + scopeDelta + frontDelta + capacityDelta + ratioDelta + cadenceDelta + startingDelta;
    breakdown.push(["Porte", 1 + sizeDelta], ["Escopo", 1 + scopeDelta], ["Frentes", 1 + frontDelta], ["Capacidade interna", 1 + capacityDelta], ["Carga do RH interno", 1 + ratioDelta], ["Cadência", 1 + cadenceDelta], ["Ponto de partida", 1 + startingDelta]);
    const minimumMonths = packageCode === "COMPLETO" ? 6 : 4;
    months = Math.max(n(months, minimumMonths), minimumMonths);
  } else if (service.slug === "treinamentos") {
    const groups = n(answers.turmas, 1);
    const meetings = n(answers.encontros, 1);
    const participants = n(answers.participantes, 20);
    const duration = n(answers.carga_horaria, 1.5);
    const formatFactor = answers.formato === "presencial" ? 1.15 : answers.formato === "hibrido" ? 1.2 : 1;
    const participantFactor = participants > 150 ? 1.18 : participants > 40 ? 1.08 : 1;
    const durationFactor = duration <= 1 ? 1 : duration <= 1.5 ? 1.05 : duration <= 2 ? 1.12 : duration <= 4 ? 1.2 : 1.3;
    const interactionFactor = answers.nivel_interacao === "dinamica" ? 1.15 : answers.nivel_interacao === "interacao" ? 1.08 : answers.nivel_interacao === "perguntas" ? 1.03 : 1;
    const includedMeetings = packageCode === "PROGRAMA" ? 4 : packageCode === "TREINAMENTO" ? 3 : 1;
    const meetingFactor = 1 + Math.max(0, meetings - includedMeetings) * 0.12;
    const groupFactor = 1 + Math.max(0, groups - 1) * 0.18;
    factor = groupFactor * meetingFactor * formatFactor * participantFactor * durationFactor * interactionFactor;
    if (answers.materiais === "sim") extras += Math.min(participants * groups * 25, 500);
    breakdown.push(["Turmas", groups], ["Encontros", meetings], ["Formato", formatFactor], ["Participantes", participantFactor], ["Duração", durationFactor], ["Interação", interactionFactor]);
  } else if (service.slug === "mentoria-rh") {
    const participants = answers.modalidade === "grupo" ? n(answers.participantes, 2) : 1;
    const durationFactor = answers.duracao_sessao === "90" ? 1.25 : 1;
    const supportFactor = answers.suporte === "proximo" ? 1.2 : answers.suporte === "mensagens" ? 1.1 : 1;
    factor = (1 + Math.max(0, participants - 1) * 0.12) * durationFactor * supportFactor;
    breakdown.push(["Participantes", participants], ["Duração", durationFactor], ["Suporte", supportFactor]);
  } else if (service.slug === "diagnostico-executivo") {
    const interviews = n(answers.entrevistas, packageCode === "COMPLETO" ? 6 : 3);
    const units = n(answers.unidades, 1);
    const docFactor = answers.documentos === "desorganizada" ? 1.2 : answers.documentos === "parcial" ? 1.1 : 1;
    const includedInterviews = packageCode === "COMPLETO" ? 6 : 3;
    factor = (1 + Math.max(0, interviews - includedInterviews) * 0.03) * (1 + Math.max(0, units - 1) * 0.05) * docFactor;
    breakdown.push(["Entrevistas", interviews], ["Unidades", units], ["Documentação", docFactor]);
  } else if (service.slug === "cultura-direcao") {
    const interviews = n(answers.entrevistas, 4), groups = n(answers.grupos, 1), workshops = n(answers.workshops, 1);
    factor = 1 + Math.max(0, interviews - 4) * 0.03 + Math.max(0, groups - 1) * 0.06 + Math.max(0, workshops - 1) * 0.08;
    breakdown.push(["Entrevistas", interviews], ["Grupos focais", groups], ["Workshops", workshops]);
  } else if (service.slug === "shadowing-lideranca") {
    const leaders = n(answers.lideres, 1), hours = n(answers.horas, 4);
    factor = Math.max(1, hours / 4);
    breakdown.push(["Líderes", leaders], ["Horas por líder", hours]);
  } else if (service.slug === "marca-empregadora") {
    const units = n(answers.unidades, 1), personas = n(answers.personas, 2), assets = answers.ativos?.length || 1;
    factor = (1 + Math.max(0, units - 1) * 0.08) * (1 + Math.max(0, personas - 2) * 0.05) * (1 + Math.max(0, assets - 3) * 0.06);
    breakdown.push(["Unidades", units], ["Personas", personas], ["Ativos", assets]);
  }
  if (scopeMode === "prioritized") {
    factor = Math.min(factor, 1);
    extras = 0;
    breakdown.push(["Escopo priorizado", 1]);
  }
  const priceBand = PACKAGE_PRICE_BANDS[service.slug]?.[packageCode] || null;
  const monthly = service.slug === "assessoria-estrategica" || service.slug === "cali-build" || (service.slug === "marca-empregadora" && packageCode === "RECORRENTE");
  const rawSubtotal = Math.round((n(basePrice) * factor + n(extras)) / 50) * 50;
  const subtotal = priceBand && rawSubtotal > 0 ? Math.min(priceBand.max, Math.max(priceBand.min, rawSubtotal)) : rawSubtotal;
  const discountValue = Math.round(subtotal * Math.min(Math.max(n(discount), 0), 50) / 100);
  const calculatedFinal = subtotal - discountValue;
  const hasOverride = finalOverride !== null && finalOverride !== "" && Number.isFinite(Number(finalOverride));
  const requestedFinal = hasOverride ? Math.max(0, Number(finalOverride)) : calculatedFinal;
  const finalUnit = priceBand && requestedFinal > 0 ? Math.min(priceBand.max, Math.max(priceBand.min, requestedFinal)) : requestedFinal;
  const effectiveDiscountValue = Math.max(0, subtotal - finalUnit);
  const effectiveDiscountPct = subtotal ? Number(((effectiveDiscountValue / subtotal) * 100).toFixed(2)) : 0;
  // Serviços recorrentes são apresentados pela mensalidade. O prazo mínimo é uma
  // condição contratual, não um total a ser somado na proposta.
  const total = finalUnit;
  return { factor: Number(factor.toFixed(3)), subtotal, rawSubtotal, discountValue: effectiveDiscountValue, discountPct: effectiveDiscountPct, finalUnit, total, months: n(months, 1), monthly, extras: n(extras), manualFinal: hasOverride, scopeMode, breakdown, priceBand, ceilingApplied: Boolean(priceBand && rawSubtotal > priceBand.max) };
}
