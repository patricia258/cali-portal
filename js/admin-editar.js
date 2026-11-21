import { CONFIG } from "/js/config.js";
import { requireAdmin, apiHeaders, signOut } from "/js/auth.js";
import { SERVICES, STATUS, flattenFields, labelFor, initialPackageFor, calculateProposal, investmentContextFor, PACKAGE_PRICE_BANDS } from "/js/services.js";
import { proposalProfile } from "/js/proposal-profiles.js";

import { ACTIVATION_DESCRIPTION, COVERAGE_FIELDS, MODULE_FIELDS, RECRUITING_FIELDS, newModule, extensionTotals, validateExtensions, commercialDefaults, recurringSteps, PARTNER_PAGE3_LIMITS, partnerPage3Report, validatePartnerPage3 } from "/js/proposal-extensions.js";

const session = await requireAdmin();
if (!session) throw new Error("Sessão administrativa ausente.");

const id = new URLSearchParams(location.search).get("id");
const drawerBody = document.getElementById("page-body");
if (!id) { drawerBody.innerHTML = "<p>Registro não encontrado.</p>"; throw new Error("id ausente"); }
document.getElementById("view-link").href = `/admin/ver.html?id=${id}`;

let pricingRules = [], proposals = [], mapaResponses = [], selected = null;
const draftCreatedAt = new Date().toISOString();

function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]); }
const currency = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const priceBandText = (band) => !band ? "" : band.max == null ? `Referência interna: a partir de ${currency(band.min)}, sem teto fixo.` : `Faixa interna deste modelo: ${currency(band.min)} a ${currency(band.max)}.`;
const DISCOUNT_TYPES = ["Condição comercial","Cliente novo","Indicação","Campanha do mês","Parceria","Outro"];
const PAYMENT_METHODS = [
  ["monthly", "Mensal recorrente"],
  ["split", "Entrada + finalização"],
  ["project_installments", "Parcelamento do projeto"],
  ["pix", "À vista via PIX"],
  ["card", "Cartão de crédito + taxas"],
  ["custom", "Condição personalizada"],
];
const BONUS_PRESETS = {
  "assessoria-estrategica": [
    ["leadership-guide", "Guia prático de rituais de liderança", "Material editável com estrutura para reuniões, alinhamentos e acompanhamentos do ciclo."],
    ["extra-alignment", "Encontro adicional de alinhamento", "Uma conversa extraordinária de até 60 minutos com a liderança, agendada durante o primeiro ciclo."],
    ["governance-checklist", "Checklist de governança de pessoas", "Checklist editável para acompanhar decisões, responsáveis, prazos e pendências do primeiro ciclo."],
  ],
  "cali-build": [["build-sustain", "Checklist de sustentação do ciclo", "Material para registrar responsáveis, indicadores, rotinas de manutenção e próximos marcos após a implantação."]],
  "mentoria-rh": [
    ["application-book", "Caderno de aplicação CALI", "Roteiro editável para registrar decisões, práticas e próximos movimentos entre os encontros."],
    ["extra-checkin", "Check-in adicional de 30 minutos", "Um encontro breve após o encerramento para revisar a aplicação do plano de desenvolvimento."],
  ],
  "diagnostico-executivo": [["thirty-day-checkin", "Check-in executivo de 30 dias", "Uma conversa de 30 minutos para revisar o avanço das prioridades indicadas na devolutiva."]],
  "cultura-direcao": [["ritual-guide", "Guia de rituais culturais", "Modelo editável para conectar comportamentos esperados às reuniões, decisões e conversas de liderança."]],
  "shadowing-lideranca": [["followup", "Check-in de evolução", "Uma conversa de 30 minutos após o ciclo para revisar a aplicação do plano de ação da liderança."]],
  treinamentos: [["application-guide", "Guia de aplicação pós-encontro", "Material editável para transformar os principais aprendizados em compromissos de aplicação."]],
  "marca-empregadora": [["activation-matrix", "Matriz de ativação e indicadores", "Modelo editável para organizar iniciativa, responsável, canal, prazo e indicador."]],
  "solucao-personalizada": [["followup", "Check-in executivo de 30 dias", "Uma conversa breve para revisar a aplicação da entrega principal e orientar o próximo movimento."]],
};
const BUDGET_STRATEGIES = [
  ["adequar", "Adequar pacote e escopo ao teto informado"],
  ["fasear", "Contratar uma primeira fase dentro do teto"],
  ["manter", "Manter escopo integral e justificar o valor"],
];

async function rest(path, options = {}) {
  const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${path}`, { ...options, headers: apiHeaders(session, options.headers || {}) });
  if (response.status === 401 || response.status === 403) { await signOut(); return null; }
  if (!response.ok) throw new Error((await response.text()) || "Falha ao consultar os dados.");
  if (response.status === 204) return null;
  return response.json();
}
async function optionalRest(path) {
  try { const response=await fetch(`${CONFIG.supabaseUrl}/rest/v1/${path}`,{headers:apiHeaders(session)}); return response.ok ? response.json() : []; }
  catch { return []; }
}

const mean = (values) => { const valid = (values || []).filter((value)=>value !== null && value !== undefined); return valid.length ? valid.reduce((sum,value)=>sum+Number(value),0)/valid.length : 0; };
function mapaSnapshot(row) {
  if (row?.diagnostico_v2?.version !== 2) return null;
  const d = row.diagnostico_v2;
  const esc10 = (value) => Number(value || 0) * 2;
  const d1 = mean([esc10(mean(d.d1.processos)),esc10(mean(d.d1.estrutura)),esc10(mean(d.d1.governanca))]);
  const d2 = mean([esc10(mean(d.d2.comportamento)),esc10(d.d2.valores?.cultura_decisao),esc10(mean(d.d2.desenvolvimento))]);
  const d3 = mean([esc10(mean(d.d3.indicadores)),esc10(mean(d.d3.decisao)),esc10(mean(d.d3.tecnologia))]);
  const d4 = mean([esc10(mean(d.d4.tamanho)),esc10(d.d4.vinculos?.gestao),esc10(mean(d.d4.rotatividade))]);
  const score = d1 * .25 + d2 * .30 + d3 * .20 + d4 * .25;
  const maturity = mean([d1,d2,d3]);
  const quadrant = maturity < 5 ? (d4 < 5 ? "Embrionário" : "Frágil") : (d4 < 5 ? "Em Estruturação" : "Estratégico");
  return { include:true, sourceId:row.id, protocol:row.protocolo, score:Number(score.toFixed(1)), quadrant, completedAt:row.created_at };
}

function defaultProposalNarrative(service, submission, answers, profile, answerText) {
  const company = submission.company_name || "A empresa";
  const contextParts = profile.contextIds.slice(0,4).map((id) => answerText(id)).filter(Boolean);
  const priorityParts = profile.priorityIds.map((id) => answerText(id)).filter(Boolean);
  return {
    contextSummary: `${company} compartilhou um contexto que combina ${contextParts.join(", ") || "necessidades de gestão de pessoas que pedem organização e direção"}. Esta proposta parte do briefing recebido e considera o momento atual, a capacidade de implantação e as decisões que precisam ser sustentadas pela liderança.`,
    painPoints: priorityParts.slice(0,4),
    executiveReading: `A leitura inicial indica que o trabalho deve começar pelo que cria base para as demais necessidades avançarem com consistência. Por isso, a recomendação prioriza uma sequência viável de implantação, sem perder de vista o conjunto de temas levantados.`,
    whyNow: `O momento pede foco, critérios claros de decisão e uma condução que conecte pessoas ao negócio sem ampliar desnecessariamente a estrutura fixa da empresa.`,
    cycleObjective: `Organizar a prioridade central deste ciclo, definir responsáveis e transformar as decisões em uma rotina de acompanhamento aplicável.`,
    expectedResults: ["Prioridades organizadas e compreendidas pela liderança", "Decisões apoiadas por critérios e informações mais claras", "Roadmap com responsáveis e próximos movimentos definidos"],
  };
}

function concreteAdvantages(profile) {
  return [
    "Mais de 15 anos de experiência em Recursos Humanos e atuação em mais de 110 empresas, aplicados à leitura de riscos, dependências e prioridades deste contexto.",
    "Condução direta por Patrícia Lima, com repertório de diretoria e CHRO, sem repasses ou camadas intermediárias.",
    profile.advantages?.[0] || "Método conectado ao negócio, com decisões, responsáveis e próximos movimentos claramente organizados.",
  ];
}

function latestProposal(submissionId) { return proposals.find((proposal) => proposal.submission_id === submissionId); }

function technicalPackageFor(service, answers) {
  return initialPackageFor(service, { ...answers, investimento:"avaliar", budget:"avaliar" });
}

function packageForBudget(service, answers, investment) {
  const technical = technicalPackageFor(service, answers);
  if (service.slug === "cali-build") return technical;
  if (!investment?.max) return technical;
  const currentPackageCodes = new Set((service.packages || []).map((item) => item.code));
  const technicalRule = pricingRules.find((rule) => rule.service_slug === service.slug && rule.package_code === technical);
  if (technicalRule && Number(technicalRule.base_price) > 0 && Number(technicalRule.base_price) <= investment.max) return technical;
  const fitting = pricingRules
    .filter((rule) => rule.service_slug === service.slug && currentPackageCodes.has(rule.package_code) && Number(rule.base_price) > 0 && Number(rule.base_price) <= investment.max)
    .sort((a, b) => Number(a.base_price) - Number(b.base_price));
  return fitting.at(-1)?.package_code || technical;
}

function selectedLabels(service, fieldId, values = []) {
  const field = flattenFields(service).find((item) => item.id === fieldId);
  return values.map((value) => field?.options?.find((item) => item.value === value)?.label || value);
}

function scopeDefaults(service, packageCode = service.packages?.[0]?.code) {
  const map = {
    "assessoria-estrategica": packageCode === "FULL" ? [
      "Direção estratégica quinzenal com a liderança",
      "Até duas prioridades simultâneas definidas para o ciclo",
      "Leitura dos indicadores-chave e apoio às decisões críticas",
      "Uma visita presencial mensal com finalidade previamente definida",
      "Roadmap das demais frentes e revisão periódica de prioridades",
    ] : [
      "Direção estratégica mensal com a liderança",
      "Uma prioridade central definida para o ciclo",
      "Leitura dos indicadores-chave e apoio às decisões críticas",
      "Estruturação de política, processo ou rotina vinculada à prioridade",
      "Roadmap das demais frentes para ciclos posteriores",
    ],
    "cali-build": packageCode === "COMPLETO" ? [
      "Arquitetura-alvo e roadmap de implantação por ciclos",
      "Métodos, critérios, templates e referências para as frentes priorizadas",
      "Revisões técnicas frequentes das entregas produzidas pelo RH interno",
      "Checkpoints executivos para aprovações e remoção de impedimentos",
      "Acompanhamento da adoção e transferência de conhecimento para sustentação interna",
    ] : [
      "Diagnóstico do ponto de partida e arquitetura da frente prioritária",
      "Método, critérios, templates e referências para o primeiro ciclo",
      "Checkpoints de orientação e revisão técnica das entregas internas",
      "Apoio à validação com sponsor ou diretoria nos marcos necessários",
      "Roadmap de sustentação e próximas frentes após o ciclo",
    ],
    "mentoria-rh": packageCode === "AMPLIADO" ? [
      "Leitura inicial do momento e dos objetivos profissionais",
      "Cinco encontros aplicados a casos reais",
      "Plano de desenvolvimento com competências prioritárias",
      "Práticas e registros de aplicação entre os encontros",
      "Encontro final de consolidação e próximos movimentos",
    ] : [
      "Leitura inicial do momento e do objetivo prioritário",
      "Três encontros aplicados a casos reais",
      "Plano de desenvolvimento focado em uma competência central",
      "Práticas de aplicação entre os encontros",
      "Síntese final com próximos movimentos",
    ],
    "diagnostico-executivo": packageCode === "COMPLETO" ? [
      "Kickoff e organização dos insumos",
      "Até 6 entrevistas com lideranças-chave",
      "Leitura documental e dos indicadores disponíveis",
      "Relatório executivo, mapa de riscos e prioridades de 90 dias",
      "Reunião executiva de devolutiva",
    ] : [
      "Kickoff focado na decisão prioritária",
      "Até 3 entrevistas com lideranças-chave",
      "Leitura dos documentos e indicadores já disponíveis",
      "Síntese executiva e prioridades de 90 dias",
      "Reunião remota de devolutiva",
    ],
    "cultura-direcao":[
      "Leitura da cultura atual por pesquisa ou amostra definida",
      "Até 4 entrevistas e 1 grupo focal",
      "1 workshop de direção com a liderança",
      "Comportamentos esperados e direcionadores culturais",
      "Roadmap de 90 dias com responsáveis e indicadores",
    ],
    "shadowing-lideranca":[
      "Alinhamento de objetivo, consentimento e confidencialidade",
      "Até 4 horas de observação em duas situações reais de uma liderança",
      "Registro técnico de padrões de comunicação, decisão e influência",
      "Devolutiva individual confidencial",
      "Plano de ação com três comportamentos prioritários",
    ],
    treinamentos: packageCode === "PALESTRA" ? [
      "Reunião breve de briefing com o sponsor",
      "Palestra estratégica de 60 a 90 minutos",
      "Conteúdo contextualizado ao público e ao negócio",
      "Facilitação ao vivo por Patrícia Lima",
      "Material-síntese de apoio",
    ] : packageCode === "WORKSHOP" ? [
      "Reunião de briefing com o sponsor",
      "Workshop aplicado de até quatro horas",
      "Conteúdo e exercícios conectados ao contexto real",
      "Facilitação ao vivo por Patrícia Lima",
      "Material de apoio e compromissos de aplicação",
    ] : [
      "Reunião de briefing e desenho da competência prioritária",
      "Até três encontros personalizados",
      "Conteúdo, exercícios e prática entre os encontros",
      "Facilitação ao vivo por Patrícia Lima",
      "Síntese de aplicação e próximos compromissos",
    ],
    "marca-empregadora": packageCode === "RECORRENTE" ? [
      "Revisão mensal das prioridades de marca empregadora",
      "Orientação estratégica para ativação por RH, Marketing ou agência",
      "Acompanhamento do roadmap e dos responsáveis",
      "Leitura dos indicadores de percepção e atração disponíveis",
      "Recomendações para o ciclo seguinte",
    ] : [
      "Diagnóstico de percepção interna e externa",
      "Definição ou refinamento do EVP e dos pilares",
      "Personas e canais prioritários",
      "Roadmap de ativação com responsabilidades definidas",
      "Matriz de indicadores para acompanhamento",
    ],
    "solucao-personalizada":["Leitura aprofundada do contexto","Desenho do escopo sob medida","Definição de entregas, limites e responsabilidades","Cronograma e checkpoints de validação","Recomendações conectadas ao resultado esperado"],
  };
  return map[service.slug] || [];
}

function prioritizedScope(service, answers, phased = false, packageCode = initialPackageFor(service, answers)) {
  if (service.slug === "assessoria-estrategica") {
    const selectedValues = Array.isArray(answers.frentes) ? answers.frentes : [];
    const challenge = String(answers.principal_desafio || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const keywordMap = { governanca:["governan","process"], clima:["clima","engaj"], comunicacao:["comunic"], planejamento:["planej"], desenho:["estrutur","desenho"], cultura:["cultur"], cargos:["cargo","salario"], atracao:["atracao","selec","onboard"] };
    const ordered = [
      ...selectedValues.filter((value) => (keywordMap[value] || []).some((keyword) => challenge.includes(keyword))),
      ...selectedValues,
    ].filter((value, index, list) => list.indexOf(value) === index);
    const priorityLimit = packageCode === "FULL" ? 2 : 1;
    const priorities = selectedLabels(service, "frentes", ordered.slice(0, priorityLimit));
    const priorityDescription = priorities.length
      ? priorities.join(", ")
      : packageCode === "FULL" ? "até duas frentes críticas" : "uma frente crítica";
    return [
      phased ? "Fase 1 de direção estratégica com a liderança" : "Direção estratégica mensal com a liderança",
      `${packageCode === "FULL" ? "Prioridades" : "Prioridade"} do primeiro ciclo: ${priorityDescription}`,
      `${packageCode === "FULL" ? "Encontros quinzenais" : "Encontro mensal"} e apoio a decisões críticas dentro da carga contratada`,
      "Organização de um roadmap para as demais frentes levantadas no briefing",
      "Revisão das prioridades conforme a evolução do ciclo",
    ];
  }
  if (service.slug === "cali-build") {
    const selectedValues = Array.isArray(answers.frentes) ? answers.frentes : [];
    const limit = packageCode === "COMPLETO" ? 3 : 1;
    const priorities = selectedLabels(service, "frentes", selectedValues.slice(0, limit));
    const description = priorities.length ? priorities.join(", ") : (answers.escopo_build === "rh_completo" ? "arquitetura do RH e subsistemas prioritários" : "frente prioritária a confirmar no kickoff");
    return [
      phased ? "Ciclo inicial de estruturação assistida com escopo delimitado" : "Estruturação assistida organizada em ciclos",
      "Prioridades do primeiro ciclo: " + description,
      "Método, modelos, critérios e revisão técnica pela CALI; execução pelo RH interno",
      "Checkpoints de implantação e validações com sponsor nos marcos necessários",
      "Roadmap das demais frentes para ciclos posteriores",
    ];
  }
  const defaults = scopeDefaults(service, initialPackageFor(service, answers));
  return [
    phased ? "Primeira fase do trabalho, com escopo e entregas delimitados" : "Escopo priorizado conforme o investimento informado",
    ...defaults.slice(0, 3),
    "Roadmap das demais necessidades para uma etapa posterior",
  ];
}

function renderEditor() {
  const service = SERVICES[selected.service_slug], answers = selected.answers || {}, currentProposal = latestProposal(selected.id);
  document.getElementById("page-code").textContent = `${selected.protocol} · ${service.code}`;
  document.getElementById("page-title").textContent = selected.company_name || selected.contact_name;
  document.getElementById("page-subtitle").textContent = `${service.title} · ${selected.contact_name}`;
  const savedCalc = currentProposal?.calculator_data || {};
  const contact = {...selected,...savedCalc.contactSnapshot};
  const investment = investmentContextFor(service, answers);
  const technicalPackage = technicalPackageFor(service, answers);
  const budgetPackage = packageForBudget(service, answers, investment);
  const recommended = currentProposal?.package_code || budgetPackage || initialPackageFor(service, answers);
  const packages = service.packages || [];
  const defaultRule = pricingRules.find((r) => r.service_slug === service.slug && r.package_code === recommended);
  const base = currentProposal?.base_price ?? defaultRule?.base_price ?? 0;
  const packageInfo = packages.find((item) => item.code === recommended);
  const defaultHours = savedCalc.monthlyHours ?? packageInfo?.suggestedHours ?? 0;
  const hoursField = ["assessoria-estrategica","cali-build"].includes(service.slug) ? `<div class="field span-4"><label>Horas mensais contratadas</label><input class="control" id="monthly-hours" type="number" min="1" max="200" step="1" value="${defaultHours}"><small class="field-help" id="monthly-hours-help">Referência da matriz: ${escapeHtml(packageInfo?.hoursRange || "a definir")}h/mês. O número final é ajustável.</small></div>` : "";
  const defaultBudgetStrategy = savedCalc.budgetStrategy || (currentProposal ? "manter" : investment?.max ? "adequar" : "manter");
  const initialScope = currentProposal?.scope_items || (["adequar","fasear"].includes(defaultBudgetStrategy) ? prioritizedScope(service, answers, defaultBudgetStrategy === "fasear", recommended) : scopeDefaults(service, recommended));
  const investmentHtml = investment
    ? `<div class="budget-reading"><span>Investimento informado pelo cliente</span><strong>${escapeHtml(investment.label)} <small>${escapeHtml(investment.period)}</small></strong></div><div class="budget-live" id="budget-live"></div>${investment.max ? `<div class="field budget-strategy-field"><label>Como tratar esta faixa na proposta?</label><select class="control" id="budget-strategy">${BUDGET_STRATEGIES.map(([value,label])=>`<option value="${value}" ${defaultBudgetStrategy===value?"selected":""}>${escapeHtml(label)}</option>`).join("")}</select></div><button class="btn btn-budget" type="button" id="apply-budget">Aplicar recomendação ao pacote e ao escopo</button>` : `<p class="budget-open-note">O cliente preferiu avaliar o investimento pelo escopo. A calculadora mantém a leitura técnica integral.</p>`}`
    : `<div class="budget-reading legacy"><span>Investimento do cliente</span><strong>Não informado</strong></div><p class="budget-open-note">Este briefing é anterior à pergunta obrigatória. Faça a análise comercial manualmente.</p>`;
  const selectedBand = PACKAGE_PRICE_BANDS[service.slug]?.[recommended];
  const priceBandHint = priceBandText(selectedBand);
  const fields = flattenFields(service);
  const profileAnswerText = (fieldId) => {
    const field = fields.find((item) => item.id === fieldId);
    return labelFor(field?.options, answers[fieldId]);
  };
  const profile = proposalProfile({ service, packageCode:recommended, packageLabel:packageInfo?.label || recommended, answers, answerText:profileAnswerText, minimumMonths:Number(currentProposal?.contract_months ?? packageInfo?.minimumMonths ?? 1), monthlyHours:Number(defaultHours) });
  const initialAdvantages = Number(savedCalc.editorialVersion || 0) >= 2 && Array.isArray(savedCalc.advantages) && savedCalc.advantages.length ? savedCalc.advantages : concreteAdvantages(profile);
  const bonusPresets = BONUS_PRESETS[service.slug] || [];
  const savedBonus = savedCalc.bonus ? {...savedCalc.bonus,code:savedCalc.bonus.code || "custom"} : { code:"none", title:"", description:"" };
  const bonusOptions = [["none", "Sem bônus"], ...bonusPresets.map(([code,title]) => [code,title]), ["custom", "Bônus personalizado"]];
  const recurringModel = service.slug === "assessoria-estrategica" || service.slug === "cali-build" || (service.slug === "marca-empregadora" && recommended === "RECORRENTE");
  const savedPayment = savedCalc.payment || {};
  const defaultPaymentMethod = savedPayment.method || (recurringModel ? "monthly" : "split");
  const narrativeDefaults = defaultProposalNarrative(service, selected, answers, profile, profileAnswerText);
  const matchedMap = mapaResponses.find((row) => String(row.c_email || "").trim().toLowerCase() === String(selected.contact_email || "").trim().toLowerCase());
  const automaticMap = mapaSnapshot(matchedMap);
  const savedMap = Object.prototype.hasOwnProperty.call(savedCalc, "mapaPeople") ? savedCalc.mapaPeople : automaticMap;
  const initialMap = savedMap || { include:false, score:automaticMap?.score || "", quadrant:automaticMap?.quadrant || "Frágil", sourceId:automaticMap?.sourceId || "", protocol:automaticMap?.protocol || "" };
  drawerBody.innerHTML = `<section class="drawer-section"><div class="drawer-section-heading"><div><div class="eyebrow">Dados editáveis</div><h3>Contato e empresa</h3></div><span class="edit-badge">${"✎"} Editar</span></div><div class="calc-grid"><div class="field"><label>Nome do contato / decisor</label><input class="control" id="edit-contact-name" value="${escapeHtml(contact.contact_name || "")}" maxlength="140"></div><div class="field"><label>Cargo</label><input class="control" id="edit-contact-role" value="${escapeHtml(contact.contact_role || "")}" maxlength="140"></div><div class="field"><label>E-mail</label><input class="control" id="edit-contact-email" type="email" value="${escapeHtml(contact.contact_email || "")}" maxlength="254"></div><div class="field"><label>WhatsApp</label><input class="control" id="edit-contact-phone" value="${escapeHtml(contact.contact_phone || "")}" maxlength="40"></div><div class="field"><label>Empresa</label><input class="control" id="edit-company-name" value="${escapeHtml(contact.company_name || "")}" maxlength="180"></div><div class="field"><label>Localidade</label><input class="control" id="edit-company-location" value="${escapeHtml(contact.company_location || "")}" maxlength="180"></div></div><p class="edit-note">As respostas originais do briefing ficam em “Ver briefing”. Aqui você só ajusta o que alimenta a proposta e a confirmação de envio.</p></section><section class="drawer-section"><h3>Análise interna</h3><div class="field"><label>Status</label><select class="control" id="review-status">${STATUS.map((s) => `<option value="${s.value}" ${selected.status===s.value?"selected":""}>${s.label}</option>`).join("")}</select></div><div class="field" style="margin-top:12px"><label>Observações internas</label><textarea class="control" id="internal-notes">${escapeHtml(selected.internal_notes || "")}</textarea></div></section><section class="drawer-section"><h3>Calculadora da proposta</h3><p class="calc-explainer">${service.slug === "cali-build" ? "A calculadora cruza porte, quantidade de frentes, capacidade interna, cadência e ponto de partida. No Build não há teto fixo: a referência cresce com a complexidade e o valor final continua editável." : "A calculadora cruza a complexidade do briefing com o investimento informado. Cada pacote possui piso e teto próprios; acima do teto, o escopo precisa ser faseado ou migrar de modelo."}</p><div class="budget-panel">${investmentHtml}</div><div class="field-grid calc-field-grid"><div class="field span-4"><label>Modelo / pacote</label><select class="control" id="package-code">${packages.map((p) => `<option value="${p.code}" ${recommended===p.code?"selected":""}>${escapeHtml(p.label)}</option>`).join("")}</select><small id="package-price-band">${escapeHtml(priceBandHint)}</small></div><div class="field span-4"><label>Valor-base interno</label><input class="control" id="base-price" type="number" min="0" step="50" value="${base}"></div><div class="field span-4"><label>Adicionais</label><input class="control" id="extras" type="number" min="0" step="50" value="${currentProposal?.extras ?? 0}"></div><div class="field span-4"><label>Desconto (%)</label><input class="control" id="discount" type="number" min="0" max="50" step=".01" value="${currentProposal?.discount_pct ?? 0}"></div><div class="field span-4"><label>Tipo de desconto</label><select class="control" id="discount-type"><option value="">Sem identificação</option>${DISCOUNT_TYPES.map((type) => `<option value="${type}" ${savedCalc.discountType===type?"selected":""}>${type}</option>`).join("")}</select></div><div class="field span-4"><label>Descrição da condição</label><input class="control" id="discount-description" value="${escapeHtml(savedCalc.discountDescription || "")}" placeholder="Ex.: condição válida neste mês"></div><div class="field span-4"><label id="months-label">Contrato mínimo (meses)</label><input class="control" id="months" type="number" min="1" value="${currentProposal?.contract_months ?? packageInfo?.minimumMonths ?? 1}"></div>${hoursField}<div class="field span-4"><label>Validade da proposta (dias)</label><input class="control" id="validity" type="number" min="1" value="${currentProposal?.validity_days ?? 15}"></div></div><div class="field calc-final-field"><label>Valor final editável</label><input class="control" id="final-price" type="number" min="0" step="50" value="${currentProposal?.final_unit ?? ""}"><small>O valor permanece dentro da faixa comercial definida para o modelo.</small></div><div class="calc-result" id="calc-result"></div></section><section class="drawer-section"><h3>Escopo e condições</h3><div class="field"><label>Entregas incluídas — uma por linha</label><textarea class="control" id="scope" style="min-height:160px">${escapeHtml(initialScope.join("\n"))}</textarea><small class="field-help">No Partner, respeite os limites exibidos para manter a página 3. Nos demais modelos, o conteúdo pode continuar nas páginas seguintes.</small></div><div class="field" style="margin-top:12px"><label>Condições de pagamento</label><textarea class="control" id="payment-terms">${escapeHtml(currentProposal?.payment_terms || "Pagamento conforme cronograma definido na proposta.")}</textarea></div><div class="field" style="margin-top:12px"><label>Observações que aparecem na proposta</label><textarea class="control" id="public-notes">${escapeHtml(currentProposal?.public_notes || "")}</textarea></div></section>`;
  const calcSection = document.getElementById("package-code").closest(".drawer-section");
  calcSection.classList.add("drawer-section-primary");
  drawerBody.insertBefore(calcSection, drawerBody.firstElementChild);
  const contentSection = document.getElementById("scope").closest(".drawer-section");
  contentSection.querySelector("h3").textContent = "Conteúdo da proposta";
  const scopeField = document.getElementById("scope").closest(".field");
  const paymentDetailsField = document.getElementById("payment-terms").closest(".field");
  if (!currentProposal) document.getElementById("payment-terms").value = "";
  const introductionField = document.getElementById("public-notes").closest(".field");
  introductionField.querySelector("label").textContent = "Introdução da solução";
  introductionField.querySelector("textarea").value = currentProposal?.public_notes || profile.solutionCopy || "";
  introductionField.insertAdjacentHTML("beforeend", '<small class="field-help">Aparece na página da solução, logo abaixo do nome do pacote.</small>');
  contentSection.insertBefore(introductionField, scopeField);
  contentSection.insertAdjacentHTML("afterbegin", `<div class="proposal-editor-intro"><div class="eyebrow">Conteúdo do PDF</div><p>Cada campo informa exatamente onde o texto aparecerá. O documento cria páginas adicionais quando o conteúdo precisar de mais espaço.</p></div><h4 class="drawer-subheading">1 · Contexto do cliente</h4><div class="field"><label>Contexto que orienta a proposta</label><textarea class="control" id="proposal-context" style="min-height:150px">${escapeHtml(savedCalc.contextSummary || narrativeDefaults.contextSummary)}</textarea><small class="field-help">Texto principal da página 1. Traga o momento, o que o cliente relatou e o que precisa ser compreendido.</small></div><div class="field" style="margin-top:12px"><label>Dores e sinais prioritários — um por linha</label><textarea class="control" id="proposal-pains" style="min-height:120px">${escapeHtml((savedCalc.painPoints || narrativeDefaults.painPoints).join("\n"))}</textarea></div><div class="field" style="margin-top:12px"><label>Leitura executiva da Patrícia</label><textarea class="control" id="proposal-reading" style="min-height:120px">${escapeHtml(savedCalc.executiveReading || narrativeDefaults.executiveReading)}</textarea><small class="field-help">Sua interpretação do contexto. Não é uma observação solta: aparece como fechamento da página 1.</small></div><div class="mapa-proposal-builder"><div><strong>Resultado do Mapa de People</strong><p>${automaticMap ? `Resultado localizado pelo e-mail do lead: ${automaticMap.score.toLocaleString("pt-BR")}/10 · ${escapeHtml(automaticMap.quadrant)} · ${escapeHtml(automaticMap.protocol || "")}.` : "Nenhum resultado foi localizado automaticamente pelo e-mail. Você pode incluir manualmente, se necessário."}</p></div><label class="mapa-toggle"><input type="checkbox" id="mapa-include" ${initialMap.include ? "checked" : ""}> Incluir no PDF</label><div class="calc-grid" id="mapa-fields"><div class="field"><label>Nota geral</label><input class="control" id="mapa-score" type="number" min="0" max="10" step=".1" value="${escapeHtml(initialMap.score)}"></div><div class="field"><label>Quadrante</label><select class="control" id="mapa-quadrant">${["Embrionário","Frágil","Em Estruturação","Estratégico"].map((value)=>`<option value="${value}" ${initialMap.quadrant===value?"selected":""}>${value}</option>`).join("")}</select></div></div></div><h4 class="drawer-subheading">2 · Solução recomendada</h4>`);
  scopeField.querySelector("label").textContent = "Escopo incluído — uma entrega por linha e na ordem desejada";
  scopeField.insertAdjacentHTML("beforeend", '<small class="field-help">A proposta numera as entregas nesta mesma ordem. Use “-” no início para criar um subitem sem nova numeração.</small>');
  introductionField.insertAdjacentHTML("afterend", `<div class="field" style="margin-top:12px"><label>Por que esta solução agora</label><textarea class="control" id="proposal-why-now">${escapeHtml(savedCalc.whyNow || narrativeDefaults.whyNow)}</textarea></div><div class="field" style="margin-top:12px"><label>Objetivo do primeiro ciclo / projeto</label><textarea class="control" id="proposal-cycle-objective">${escapeHtml(savedCalc.cycleObjective || narrativeDefaults.cycleObjective)}</textarea></div><div class="field" style="margin-top:12px"><label>Resultados esperados — um por linha</label><textarea class="control" id="proposal-results">${escapeHtml((savedCalc.expectedResults || narrativeDefaults.expectedResults).join("\n"))}</textarea></div><div class="field" style="margin-top:12px"><label>Por que a CALI neste contexto — um diferencial por linha</label><textarea class="control" id="proposal-advantages" style="min-height:120px">${escapeHtml(initialAdvantages.join("\n"))}</textarea><small class="field-help">Use diferenciais concretos: experiência, forma de condução, proximidade e método. Não repita carga horária, prazo ou escopo.</small></div><h4 class="drawer-subheading">3 · Escopo, ciclos e roadmap</h4>`);
  const cadenceDefaults = profile.operating.filter((item)=>!/(carga|\bhoras?\b|cumulativ|investimento)/i.test(item));
  scopeField.insertAdjacentHTML("afterend", `<div class="field" style="margin-top:12px"><label>Ciclos ou fases — uma por linha</label><textarea class="control" id="proposal-cycles" placeholder="Ex.: Ciclo 1 | Governança de pessoas | Estruturar papéis, ritos e decisões | Meses 1 e 2">${escapeHtml((savedCalc.cycles ?? profile.process.map(([title,objective])=>({title,objective}))).map((cycle)=>[cycle.title,cycle.focus||"",cycle.objective||"",cycle.duration||""].join(" | ")).join("\n"))}</textarea><small class="field-help">Formato: Nome do ciclo | Foco | Objetivo | Duração.</small></div><div class="field" style="margin-top:12px"><label>Cadência e formato — um item por linha</label><textarea class="control" id="proposal-cadence">${escapeHtml((savedCalc.cadence || cadenceDefaults).join("\n"))}</textarea><small class="field-help">Reuniões, checkpoints, canal e presencialidade. Não repita horas ou duração contratual.</small></div><div class="calc-grid" style="margin-top:12px"><div class="field"><label>Responsabilidades da CALI — uma por linha</label><textarea class="control" id="proposal-cali-responsibilities">${escapeHtml((savedCalc.caliResponsibilities || (service.slug === "cali-build" ? ["Definir arquitetura, prioridades, método e critérios técnicos do ciclo.","Orientar e revisar tecnicamente as entregas construídas pelo RH interno.","Conduzir checkpoints e apoiar validações executivas nos marcos previstos."] : ["Conduzir as análises, encontros e devolutivas previstos no escopo.","Organizar decisões, responsáveis e próximos movimentos."])).join("\n"))}</textarea></div><div class="field"><label>Responsabilidades do cliente — uma por linha</label><textarea class="control" id="proposal-client-responsibilities">${escapeHtml((savedCalc.clientResponsibilities || (service.slug === "cali-build" ? ["Designar e manter um responsável interno pela implantação entre os checkpoints.","Levantar dados, adaptar os materiais, construir entregas e implantar as rotinas definidas.","Garantir acesso aos insumos e aprovações do sponsor/diretoria dentro dos prazos do ciclo."] : ["Disponibilizar dados, pessoas e aprovações necessários ao trabalho.","Designar responsáveis internos e participar dos checkpoints acordados."])).join("\n"))}</textarea></div></div><div class="field" style="margin-top:12px"><label>Prioridades para ciclos posteriores — uma por linha</label><textarea class="control" id="proposal-roadmap-items">${escapeHtml((savedCalc.roadmapItems || []).join("\n"))}</textarea><small class="field-help">Estas prioridades são apresentadas como continuidade futura, fora do escopo contratado agora.</small></div><div class="field" style="margin-top:12px"><label>Fora do escopo — um item por linha</label><textarea class="control" id="proposal-out-of-scope">${escapeHtml((savedCalc.outOfScope || profile.outOfScope).join("\n"))}</textarea><small class="field-help">Aparece em Limites e observações da contratação, nas condições comerciais.</small></div><h4 class="drawer-subheading">4 · Condições comerciais e fechamento</h4><div class="bonus-builder"><div class="field"><label>Bônus de contratação</label><select class="control" id="bonus-choice">${bonusOptions.map(([code,label])=>`<option value="${code}" ${savedBonus.code===code?"selected":""}>${escapeHtml(label)}</option>`).join("")}</select></div><div id="bonus-fields" class="calc-grid"><div class="field"><label>Nome do bônus</label><input class="control" id="bonus-title" value="${escapeHtml(savedBonus.title || "")}" maxlength="140"></div><div class="field"><label>O que o cliente receberá</label><textarea class="control" id="bonus-description">${escapeHtml(savedBonus.description || "")}</textarea></div></div><small class="field-help">O bônus só aparece no PDF quando você selecionar e confirmar o conteúdo.</small></div>`);
  paymentDetailsField.querySelector("label").textContent = "Observações adicionais sobre o pagamento (opcional)";
  paymentDetailsField.querySelector("textarea").placeholder = "Ex.: primeira cobrança em data diferente, condição válida até determinada data ou observação sobre emissão de nota.";
  paymentDetailsField.insertAdjacentHTML("beforebegin", `<h4 class="drawer-subheading">Prazo e forma de pagamento</h4><div class="calc-grid payment-builder"><div class="field"><label>Forma de pagamento</label><select class="control" id="payment-method">${PAYMENT_METHODS.map(([value,label])=>`<option value="${value}" ${defaultPaymentMethod===value?"selected":""}>${label}</option>`).join("")}</select></div><div class="field" data-payment-panel="monthly"><label>Vencimento mensal</label><input class="control" id="payment-monthly-due" value="${escapeHtml(savedPayment.monthlyDue || "1º dia útil de cada mês")}"></div><div class="field" data-payment-panel="split"><label>Entrada (%)</label><input class="control" id="payment-entry-pct" type="number" min="0" max="100" value="${Number(savedPayment.entryPct ?? 50)}"></div><div class="field" data-payment-panel="split"><label>Na finalização (%)</label><input class="control" id="payment-final-pct" type="number" min="0" max="100" value="${Number(savedPayment.finalPct ?? 50)}"></div><div class="field" data-payment-panel="project_installments"><label>Número de parcelas</label><input class="control" id="payment-project-installments" type="number" min="2" max="12" value="${Number(savedPayment.projectInstallments ?? 2)}"></div><div class="field" data-payment-panel="project_installments"><label>Vencimento das parcelas</label><input class="control" id="payment-project-installment-due" value="${escapeHtml(savedPayment.projectInstallmentDue || "Mensais, com a primeira parcela no aceite")}" maxlength="160"></div><div class="field" data-payment-panel="pix"><label>Desconto à vista no PIX (%)</label><input class="control" id="payment-pix-discount" type="number" min="0" max="50" step=".01" value="${Number(savedPayment.pixDiscount ?? currentProposal?.discount_pct ?? 0)}"><small class="field-help">Ao alterar, o desconto da proposta é atualizado para esta condição.</small></div><div class="field" data-payment-panel="card"><label>Número de parcelas</label><input class="control" id="payment-card-installments" type="number" min="1" max="24" value="${Number(savedPayment.cardInstallments ?? 1)}"></div><div class="field" data-payment-panel="card"><label>Tratamento das taxas</label><select class="control" id="payment-card-fees"><option value="client" ${savedPayment.cardFees!=="included"?"selected":""}>Acrescidas ao valor do cliente</option><option value="included" ${savedPayment.cardFees==="included"?"selected":""}>Já incluídas no valor final</option></select></div><div class="field" data-payment-panel="custom"><label>Nome da condição</label><input class="control" id="payment-custom-label" value="${escapeHtml(savedPayment.customLabel || "Condição personalizada")}" maxlength="120"></div></div>`);

  const fieldHtml = ([key,label,kind],value='',prefix='') => `<div class="field" style="margin-top:12px"><label for="${prefix}${key}">${escapeHtml(label)}</label>${kind==='number'||kind==='input'?`<input class="control" id="${prefix}${key}" data-key="${key}" type="${kind==='number'?'number':'text'}" ${kind==='number'?'min="0" step="any"':''} value="${escapeHtml(value??'')}">`:`<textarea class="control" id="${prefix}${key}" data-key="${key}">${escapeHtml(value??'')}</textarea>`}</div>`;
  const templateDefaults = (code) => {
    const pkg=packages.find(p=>p.code===code);
    const recurring=service.slug==='assessoria-estrategica'||service.slug==='cali-build'||(service.slug==='marca-empregadora'&&code==='RECORRENTE');
    const info=proposalProfile({service,packageCode:code,packageLabel:pkg?.label||code,answers,answerText:profileAnswerText,minimumMonths:Number(document.getElementById('months').value),monthlyHours:Number(document.getElementById('monthly-hours')?.value||0)});
    return {
      'scope':scopeDefaults(service,code).join('\n'),
      'proposal-cycles':info.process.map(([title,objective])=>[title,'',objective,''].join(' | ')).join('\n'),
      'public-notes':info.solutionCopy||'',
      'proposal-cadence':info.operating.filter(item=>!/(carga|\bhoras?\b|cumulativ|investimento)/i.test(item)).join('\n'),
      'proposal-out-of-scope':info.outOfScope.join('\n'),
      'proposal-advantages':concreteAdvantages(info).join('\n'),
      'commercial-conditions':(recurring?commercialDefaults(Number(document.getElementById('months').value),Number(document.getElementById('monthly-hours')?.value||0),{...savedPayment,monthlyDue:document.getElementById('payment-monthly-due')?.value||savedPayment.monthlyDue}):info.commercial).join('\n'),
      'next-steps':(recurring?recurringSteps:info.nextSteps).map(p=>p.join(' | ')).join('\n'),
      'package-label':pkg?.label||service.title,
      'package-tagline':info.solutionCopy||'',
      'package-kicker':recurring?'PEOPLE ADVISORY RECORRENTE':'SOLUÇÃO CALI',
      'proposal-nature':recurring?'Atuação recorrente':'Projeto com entrega definida',
      'delivery-mode':code==='PARTNER'?'100% online':recurring?'Conforme escopo':'Conforme proposta',
    };
  };
  const templateStart=templateDefaults(recommended);
  const customSection=document.createElement('section');customSection.className='drawer-section';
  customSection.innerHTML=`<h3>Apresentação e condições editáveis</h3><p>O pacote preenche as referências iniciais. Você pode personalizar cada campo desta proposta.</p>${[
    ['package-label','Nome do pacote no documento','input'],['package-kicker','Categoria do pacote','input'],['package-tagline','Subtítulo da solução'],['proposal-nature','Natureza da contratação','input'],['delivery-mode','Atuação / formato','input'],['activation-percent','Ativação única (%)','number'],['activation-description','Texto da ativação'],['commercial-conditions','Condições importantes — uma por linha'],['next-steps','Próximos passos — Título | Descrição, um por linha'],['next-steps-intro','Introdução dos próximos passos'],
  ].map(def=>fieldHtml(def, ({'package-label':savedCalc.presentation?.label,'package-kicker':savedCalc.presentation?.kicker,'package-tagline':savedCalc.presentation?.tagline,'proposal-nature':savedCalc.presentation?.nature,'delivery-mode':savedCalc.presentation?.deliveryMode??(recommended==='PARTNER'?'100% online':recurringModel?'Conforme escopo':'Conforme proposta'),'activation-percent':savedCalc.activation?.percent??20,'activation-description':savedCalc.activation?.description??ACTIVATION_DESCRIPTION,'commercial-conditions':savedCalc.commercialConditions?.join('\n'),'next-steps':savedCalc.nextSteps?.map(p=>p.join(' | ')).join('\n'),'next-steps-intro':savedCalc.nextStepsIntro??'Uma sequência simples para transformar a proposta aprovada em início de operação.'})[def[0]]??templateStart[def[0]]??'')).join('')}<p class="field-help">A ativação é calculada sobre o valor final do pacote, após descontos. Módulos têm valores próprios e não entram automaticamente nessa base.</p>`;
  drawerBody.append(customSection);
  if(currentProposal && currentProposal.status!=='rascunho') customSection.insertAdjacentHTML('afterbegin','<p class="edit-note">Ao salvar, será criada uma nova versão em rascunho. A proposta anterior permanece preservada.</p>');
  const coverageSection=document.createElement('section');coverageSection.className='drawer-section';
  coverageSection.innerHTML=`<h3>Abrangência contratual</h3><label><input id="coverage-enabled" type="checkbox" ${savedCalc.coverage?.enabled?'checked':''}> Incluir abrangência na proposta</label><div id="coverage-fields"><div class="field" style="margin-top:12px"><label for="coverage-display-mode">Apresentação no PDF</label><select class="control" id="coverage-display-mode"><option value="notes" ${savedCalc.coverage?.displayMode!=='summary'?'selected':''}>Apenas observações importantes</option><option value="summary" ${savedCalc.coverage?.displayMode==='summary'?'selected':''}>Resumo de unidades e público + observações</option></select></div>${COVERAGE_FIELDS.map(def=>fieldHtml(def,savedCalc.coverage?.[def[0]]??(def[0]==='company'?(contact.company_name||''):def[0]==='expansion'?'Ampliações de unidades ou públicos dependem de nova avaliação e contratação.':''),'coverage-')).join('')}</div>`;
  drawerBody.append(coverageSection);
  const moduleSection=document.createElement('section');moduleSection.className='drawer-section';
  moduleSection.innerHTML=`<h3>Módulos complementares</h3><label><input id="modules-enabled" type="checkbox" ${savedCalc.modulesEnabled?'checked':''}> Incluir módulos complementares</label><div id="module-editor"><p>Capacidade operacional separada das horas executivas do pacote. Preencha apenas os compromissos efetivamente contratados.</p><div id="modules-list"></div><button type="button" class="btn btn-light" id="add-recruiting">Adicionar Recrutamento e Seleção</button> <button type="button" class="btn btn-light" id="add-module">Adicionar outro módulo</button></div>`;
  drawerBody.append(moduleSection);
  const readFields = (node,defs) => Object.fromEntries(defs.map(([key,,kind])=>{const value=node.querySelector(`[data-key="${key}"]`).value.trim();return [key,kind==='number'&&value!==''?Number(value):value];}));
  const readModules=()=>Array.from(document.querySelectorAll('[data-module]')).map(node=>({...JSON.parse(node.dataset.original||'{}'),...readFields(node.querySelector('.module-general'),MODULE_FIELDS),id:node.dataset.module,kind:node.dataset.kind,type:node.querySelector('[data-type]').value,recruiting:node.dataset.kind==='recruiting'?readFields(node.querySelector('.module-recruiting'),RECRUITING_FIELDS):{}}));
  const addModule=(module)=>{
    const node=document.createElement('article');node.dataset.module=module.id||crypto.randomUUID();node.dataset.kind=module.kind||'custom';node.dataset.original=JSON.stringify(module);node.className='module-card';node.style.cssText='border:1px solid var(--linha,#ddd);border-radius:12px;padding:20px;margin:20px 0';
    node.innerHTML=`<h4>${module.kind==='recruiting'?'Recrutamento e Seleção':'Módulo complementar'}</h4><label>Tipo de cobrança <select class="control" data-type>${[['recurring','Recorrente'],['one_time','Pontual'],['custom','Personalizado']].map(([v,l])=>`<option value="${v}" ${module.type===v?'selected':''}>${l}</option>`).join('')}</select></label><div class="module-general">${MODULE_FIELDS.map(def=>fieldHtml(def,module[def[0]],'module-'+node.dataset.module+'-')).join('')}</div>${module.kind==='recruiting'?`<details><summary>Escopo e condições de Recrutamento e Seleção</summary><div class="module-recruiting">${RECRUITING_FIELDS.map(def=>fieldHtml(def,module.recruiting?.[def[0]],'recruiting-'+node.dataset.module+'-')).join('')}</div></details>`:''}<button type="button" class="btn btn-light" data-remove>Remover módulo</button>`;
    node.querySelector('[data-remove]').addEventListener('click',()=>{node.remove();recalc();});document.getElementById('modules-list').append(node);
  };
  (savedCalc.modules||[]).forEach(addModule);
  document.getElementById('add-recruiting').addEventListener('click',()=>{addModule(newModule('recruiting'));recalc();});
  document.getElementById('add-module').addEventListener('click',()=>{addModule(newModule());recalc();});
  const toggleExtensions=()=>{document.getElementById('module-editor').hidden=!document.getElementById('modules-enabled').checked;document.getElementById('coverage-fields').hidden=!document.getElementById('coverage-enabled').checked;};
  toggleExtensions();
  ['modules-enabled','coverage-enabled'].forEach(id=>document.getElementById(id).addEventListener('change',()=>{toggleExtensions();recalc();}));
  moduleSection.addEventListener('input',()=>recalc());
  document.getElementById('activation-percent').max='100';document.getElementById('activation-percent').addEventListener('input',()=>recalc());
  const page3Fields={scope:'scope',cadence:'proposal-cadence',cycles:'proposal-cycles',caliResponsibilities:'proposal-cali-responsibilities',clientResponsibilities:'proposal-client-responsibilities'};
  const page3Notice=document.createElement('div');page3Notice.className='edit-note';page3Notice.id='partner-page3-notice';document.getElementById('scope').closest('.field').before(page3Notice);
  const refreshPage3Limits=()=>{
    const applies=service.slug==='assessoria-estrategica'&&document.getElementById('package-code').value==='PARTNER';
    const content=Object.fromEntries(Object.entries(page3Fields).map(([key,id])=>[key,document.getElementById(id).value.split('\n').map(s=>s.trim()).filter(Boolean)]));
    const report=partnerPage3Report(content);
    page3Notice.hidden=!applies;page3Notice.textContent='CALI Partner: escopo, cadência, ciclos e responsabilidades ficam juntos na página 3. '+(report.valid?'Conteúdo dentro dos limites.':'Encurte os campos destacados antes de salvar.');
    for(const field of report.fields){
      const input=document.getElementById(page3Fields[field.key]);
      let counter=document.getElementById('limit-'+field.key);
      if(!counter){counter=document.createElement('small');counter.id='limit-'+field.key;counter.className='field-help';input.after(counter);input.setAttribute('aria-describedby',counter.id);}
      counter.hidden=!applies;counter.textContent=`${field.used}/${field.characters} caracteres · ${field.count}/${field.items} itens`;
      counter.style.color=applies&&!field.valid?'#9D2535':'';
      input.setAttribute('aria-invalid',String(applies&&!field.valid));
      // Não usa maxlength para não impedir a correção de conteúdo antigo ou colado.
    }
  };
  Object.values(page3Fields).forEach(id=>document.getElementById(id).addEventListener('input',refreshPage3Limits));
  document.getElementById('package-code').addEventListener('change',()=>queueMicrotask(refreshPage3Limits));
  refreshPage3Limits();
  const managedDefaults={...templateStart};
  const refreshDefaults=(reset=false)=>{
    const defaults=templateDefaults(document.getElementById('package-code').value);
    for(const [key,value] of Object.entries(defaults)){
      const input=document.getElementById(key);
      if(input&&(reset||input.value===managedDefaults[key])) input.value=value;
      managedDefaults[key]=value;
    }
  };
  const resetButton=document.createElement('button');resetButton.type='button';resetButton.className='btn btn-light';resetButton.textContent='Preencher referências do pacote selecionado';
  resetButton.addEventListener('click',()=>{refreshDefaults(true);recalc();});customSection.prepend(resetButton);
  window.__proposalExtensions=()=>({extensionVersion:2,activation:{percent:Number(document.getElementById('activation-percent').value),description:document.getElementById('activation-description').value.trim()},presentation:{label:document.getElementById('package-label').value.trim(),kicker:document.getElementById('package-kicker').value.trim(),tagline:document.getElementById('package-tagline').value.trim(),nature:document.getElementById('proposal-nature').value.trim(),deliveryMode:document.getElementById('delivery-mode').value.trim()},commercialConditions:document.getElementById('commercial-conditions').value.split('\n').map(s=>s.trim()).filter(Boolean),nextSteps:document.getElementById('next-steps').value.split('\n').map(s=>s.trim()).filter(Boolean).map(s=>{const [title,...text]=s.split('|');return [title.trim(),text.join('|').trim()];}),nextStepsIntro:document.getElementById('next-steps-intro').value.trim(),coverage:{...savedCalc.coverage,...readFields(coverageSection,COVERAGE_FIELDS),displayMode:document.getElementById('coverage-display-mode').value,enabled:document.getElementById('coverage-enabled').checked},modulesEnabled:document.getElementById('modules-enabled').checked,modules:readModules()});

  let bonusInitialized = false;
  const updateBonusFields = () => {
    const code = document.getElementById("bonus-choice").value;
    const preset = bonusPresets.find(([presetCode]) => presetCode === code);
    document.getElementById("bonus-fields").classList.toggle("hidden", code === "none");
    if (preset && bonusInitialized) {
      document.getElementById("bonus-title").value = preset[1];
      document.getElementById("bonus-description").value = preset[2];
    } else if (code === "none") {
      document.getElementById("bonus-title").value = "";
      document.getElementById("bonus-description").value = "";
    }
    bonusInitialized = true;
  };
  const updatePaymentFields = () => {
    const method = document.getElementById("payment-method").value;
    document.querySelectorAll("[data-payment-panel]").forEach((field) => field.classList.toggle("hidden", field.dataset.paymentPanel !== method));
  };
  document.getElementById("bonus-choice").addEventListener("change", updateBonusFields);
  document.getElementById("payment-method").addEventListener("change", updatePaymentFields);
  document.getElementById("payment-pix-discount").addEventListener("input", (event) => {
    document.getElementById("discount").value = event.target.value;
    document.getElementById("discount-type").value = "Condição comercial";
    document.getElementById("discount-description").value = "Pagamento à vista via PIX";
    manualFinal = false;
    recalc();
  });
  updateBonusFields();
  updatePaymentFields();
  let manualFinal = Boolean(currentProposal && Number.isFinite(Number(currentProposal.final_unit))) || Boolean(savedCalc.manualFinal);
  const recalc = () => {
    const rule = pricingRules.find((r) => r.service_slug === service.slug && r.package_code === document.getElementById("package-code").value);
    if (rule && Number(document.getElementById("base-price").value) === 0) document.getElementById("base-price").value = rule.base_price;
    const budgetStrategy = document.getElementById("budget-strategy")?.value || "manter";
    const scopeMode = ["adequar","fasear"].includes(budgetStrategy) ? "prioritized" : "integral";
    const result = calculateProposal({ service, answers, packageCode:document.getElementById("package-code").value, basePrice:document.getElementById("base-price").value, extras:document.getElementById("extras").value, discount:document.getElementById("discount").value, months:document.getElementById("months").value, finalOverride:manualFinal ? document.getElementById("final-price").value : null, scopeMode });
    if (!manualFinal) document.getElementById("final-price").value = result.finalUnit;
    document.getElementById("months-label").textContent = result.monthly ? "Prazo mínimo do contrato (meses)" : "Duração do projeto (meses)";
    refreshPage3Limits();
    const extension=window.__proposalExtensions();
    const totals=extensionTotals(result.finalUnit,extension.modulesEnabled?extension.modules:[],extension.activation.percent);
    const discountName = document.getElementById("discount-type").value || "Desconto";
    const hours = Number(document.getElementById("monthly-hours")?.value || 0);
    document.getElementById("calc-result").innerHTML = `<div class="calc-line"><span>Valor de referência</span><strong>${currency(result.subtotal)}</strong></div>${result.discountValue ? `<div class="calc-line"><span>${escapeHtml(discountName)} (${result.discountPct.toLocaleString("pt-BR") }%)</span><strong>− ${currency(result.discountValue)}</strong></div>` : ""}<div class="calc-total"><span>${result.monthly ? "Mensalidade final" : "Investimento final"}</span><strong>${currency(result.finalUnit)}</strong></div>${result.monthly ? `<div class="calc-line" id="activation-result"><span>Ativação única · ${extension.activation.percent.toLocaleString("pt-BR")}%</span><strong>${currency(totals.activation)}</strong></div><div class="calc-condition">Calculada automaticamente sobre a mensalidade final, após os descontos. Cobrança única separada, sem multiplicação pelo prazo e sem inclusão na mensalidade.</div>` : ""}${result.ceilingApplied ? `<div class="calc-condition">O teto comercial de ${currency(result.priceBand.max)} foi aplicado. Se o escopo integral exigir mais capacidade, divida em fases ou selecione outro modelo.</div>` : ""}${result.monthly ? `<div class="calc-condition">${hours ? `${hours} horas mensais. ` : ""}Contrato mínimo de ${result.months} meses, renovação automática e aviso prévio de 30 dias. A recorrência não é somada como valor total.</div>` : ""}`;
    if(extension.modulesEnabled && (totals.recurring>0 || totals.oneTime>0 || extension.modules.some(m=>m.type==='custom'))) document.getElementById('calc-result').insertAdjacentHTML('beforeend',`<div class="calc-line"><span>Módulos recorrentes</span><strong>${currency(totals.recurring)}</strong></div><div class="calc-total"><span>Mensalidade com módulos</span><strong>${currency(totals.monthly)}</strong></div><div class="calc-line"><span>Módulos pontuais</span><strong>${currency(totals.oneTime)}</strong></div>${extension.modules.filter(m=>m.type==='custom').map(m=>`<div class="calc-line"><span>${escapeHtml(m.name)} · ${escapeHtml(m.billingLabel||'Defina a cobrança')}</span><strong>${currency(m.amount)}</strong></div>`).join('')}<p class="field-help">Valores dos módulos separados do pacote, sem aplicar o desconto ou teto do pacote. A vigência não é multiplicada como cobrança imediata.</p>`);
    const technicalRule = pricingRules.find((item) => item.service_slug === service.slug && item.package_code === technicalPackage);
    const technicalResult = technicalRule ? calculateProposal({ service, answers, packageCode:technicalPackage, basePrice:technicalRule.base_price, months:document.getElementById("months").value }) : null;
    const budgetLive = document.getElementById("budget-live");
    if (budgetLive && investment?.max) {
      const priced = result.finalUnit > 0;
      const aligned = priced && result.finalUnit <= investment.max;
      const technicalLabel = packages.find((item) => item.code === technicalPackage)?.label || technicalPackage;
      const gap = Math.max(0, (technicalResult?.finalUnit || 0) - investment.max);
      budgetLive.className = `budget-live ${!priced ? "pending" : aligned ? "aligned" : "over"}`;
      budgetLive.innerHTML = `<div><span>Leitura técnica do escopo integral</span><strong>${escapeHtml(technicalLabel)} · ${technicalResult?.finalUnit ? currency(technicalResult.finalUnit) : "valor a definir"}</strong></div><div><span>Proposta configurada agora</span><strong>${priced ? `${currency(result.finalUnit)} · ${aligned ? "alinhada à faixa" : `acima do teto em ${currency(result.finalUnit - investment.max)}`}` : "Informe o valor-base para validar o alinhamento"}</strong></div>${gap ? `<p>Há ${currency(gap)} de diferença entre a necessidade integral e o teto informado. A recomendação é priorizar o primeiro ciclo ou contratar por fases.</p>` : ""}`;
    }
    return result;
  };
  ["base-price","extras","discount"].forEach((fieldId) => document.getElementById(fieldId).addEventListener("input", () => { manualFinal = false; recalc(); }));
  ["months","monthly-hours","discount-type","discount-description","budget-strategy"].forEach((fieldId) => document.getElementById(fieldId)?.addEventListener("input", recalc));
  document.getElementById("final-price").addEventListener("input", () => {
    manualFinal = true;
    const reference = calculateProposal({ service, answers, packageCode:document.getElementById("package-code").value, basePrice:document.getElementById("base-price").value, extras:document.getElementById("extras").value, discount:0, months:document.getElementById("months").value });
    const final = Number(document.getElementById("final-price").value) || 0;
    document.getElementById("discount").value = reference.subtotal ? Math.min(50, Math.max(0, ((reference.subtotal - final) / reference.subtotal) * 100)).toFixed(2) : 0;
    recalc();
  });
  document.getElementById("package-code").addEventListener("change", (event) => { const rule = pricingRules.find((r) => r.service_slug === service.slug && r.package_code === event.target.value); if (rule) document.getElementById("base-price").value = rule.base_price; const selectedPackage = packages.find((item) => item.code === event.target.value); const selectedBandNow = PACKAGE_PRICE_BANDS[service.slug]?.[event.target.value]; document.getElementById("package-price-band").textContent = priceBandText(selectedBandNow); if (selectedPackage?.minimumMonths) document.getElementById("months").value = selectedPackage.minimumMonths; if (document.getElementById("monthly-hours") && selectedPackage?.suggestedHours) document.getElementById("monthly-hours").value = selectedPackage.suggestedHours; if (document.getElementById("monthly-hours-help")) document.getElementById("monthly-hours-help").textContent = `Referência da matriz: ${selectedPackage?.hoursRange || "a definir"}h/mês. O número final é ajustável.`; refreshDefaults(); manualFinal = false; recalc(); });
  document.getElementById("apply-budget")?.addEventListener("click", () => {
    const strategy = document.getElementById("budget-strategy").value;
    const nextPackage = strategy === "manter" ? technicalPackage : budgetPackage;
    const nextRule = pricingRules.find((item) => item.service_slug === service.slug && item.package_code === nextPackage);
    document.getElementById("package-code").value = nextPackage;
    if (nextRule) document.getElementById("base-price").value = nextRule.base_price;
    const nextPackageInfo = packages.find((item) => item.code === nextPackage);
    if (nextPackageInfo?.minimumMonths) document.getElementById("months").value = nextPackageInfo.minimumMonths;
    if (document.getElementById("monthly-hours") && nextPackageInfo?.suggestedHours) document.getElementById("monthly-hours").value = nextPackageInfo.suggestedHours;
    if (document.getElementById("monthly-hours-help")) document.getElementById("monthly-hours-help").textContent = `Referência da matriz: ${nextPackageInfo?.hoursRange || "a definir"}h/mês. O número final é ajustável.`;
    document.getElementById("extras").value = 0;
    document.getElementById("discount").value = 0;
    manualFinal = false;
    if (strategy !== "manter") {
      document.getElementById("scope").value = prioritizedScope(service, answers, strategy === "fasear", nextPackage).join("\n");
      const note = strategy === "fasear" ? "Esta proposta contempla a primeira fase do trabalho. As demais frentes serão organizadas em roadmap e contratadas após a validação desta etapa." : "O escopo foi priorizado para manter aderência à faixa de investimento informada, sem comprometer a qualidade das entregas contratadas.";
      if (!document.getElementById("public-notes").value.trim()) document.getElementById("public-notes").value = note;
    }
    recalc();
  });
  ['months','monthly-hours','payment-monthly-due'].forEach(id=>document.getElementById(id)?.addEventListener('change',()=>refreshDefaults()));
  window.__recalc = recalc; recalc();
}

function editableSubmissionPayload() {
  const contactName = document.getElementById("edit-contact-name").value.trim();
  const contactEmail = document.getElementById("edit-contact-email").value.trim().toLowerCase();
  if (contactName.length < 2) throw new Error("Informe o nome do contato.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) throw new Error("Informe um e-mail válido.");
  return {status:document.getElementById("review-status").value,internal_notes:document.getElementById("internal-notes").value,contact_name:contactName,contact_role:document.getElementById("edit-contact-role").value.trim()||null,contact_email:contactEmail,contact_phone:document.getElementById("edit-contact-phone").value.trim()||null,company_name:document.getElementById("edit-company-name").value.trim()||null,company_location:document.getElementById("edit-company-location").value.trim()||null,updated_at:new Date().toISOString()};
}

async function saveReview() {
  await rest(`cali_submissions?id=eq.${selected.id}`, { method:"PATCH", headers:{Prefer:"return=representation"}, body:JSON.stringify({status:document.getElementById("review-status").value,internal_notes:document.getElementById("internal-notes").value,updated_at:new Date().toISOString()}) });
  window.__visualEditorSaved?.();
  location.href = "/admin";
}

function proposalPayload() {
  const contactSnapshot=editableSubmissionPayload();
  delete contactSnapshot.status;delete contactSnapshot.internal_notes;delete contactSnapshot.updated_at;
  const extensions=window.__proposalExtensions();
  validateExtensions(extensions.modulesEnabled?extensions.modules:[],extensions.activation);
  if(extensions.coverage.enabled && extensions.coverage.unitCount!=="" && (!Number.isInteger(Number(extensions.coverage.unitCount)) || Number(extensions.coverage.unitCount)<1)) throw new Error("Informe uma quantidade inteira de unidades, a partir de 1, ou deixe o campo vazio.");
  const service = SERVICES[selected.service_slug], existing = latestProposal(selected.id), calculation = window.__recalc();
  const payment = {
    method:document.getElementById("payment-method").value,
    monthlyDue:document.getElementById("payment-monthly-due").value.trim(),
    entryPct:Number(document.getElementById("payment-entry-pct").value || 0),
    finalPct:Number(document.getElementById("payment-final-pct").value || 0),
    projectInstallments:Number(document.getElementById("payment-project-installments").value || 2),
    projectInstallmentDue:document.getElementById("payment-project-installment-due").value.trim(),
    pixDiscount:Number(document.getElementById("payment-pix-discount").value || 0),
    cardInstallments:Number(document.getElementById("payment-card-installments").value || 1),
    cardFees:document.getElementById("payment-card-fees").value,
    customLabel:document.getElementById("payment-custom-label").value.trim(),
  };
  if (payment.method === "split" && payment.entryPct + payment.finalPct !== 100) throw new Error("Na condição de entrada + finalização, os percentuais precisam somar 100%.");
  if (payment.method === "project_installments" && (payment.projectInstallments < 2 || payment.projectInstallments > 12)) throw new Error("O parcelamento do projeto deve ter entre 2 e 12 parcelas.");
  const bonusCode = document.getElementById("bonus-choice").value;
  const bonus = bonusCode === "none" ? null : { code:bonusCode, title:document.getElementById("bonus-title").value.trim(), description:document.getElementById("bonus-description").value.trim() };
  if (bonus && (!bonus.title || !bonus.description)) throw new Error("Preencha o nome e a descrição do bônus ou selecione “Sem bônus”.");
  const advantages = document.getElementById("proposal-advantages").value.split("\n").map((item)=>item.trim()).filter(Boolean);
  if (!advantages.length) throw new Error("Informe ao menos uma vantagem concreta desta proposta.");
  const lines = (fieldId) => document.getElementById(fieldId).value.split("\n").map((item)=>item.trim()).filter(Boolean);
  const scopeItems = lines("scope");
  const cycles = lines("proposal-cycles").map((line) => {
    const raw = line.replace(/^\s*[-–—]\s*/, "");
    if (raw.includes("|")) {
      const [title="", focus="", objective="", duration=""] = raw.split("|").map((item)=>item.trim());
      return { title, focus, objective, duration };
    }
    const compact = raw.match(/^(Ciclo\s+\d+)\s*(?:\(([^)]+)\))?\s*:\s*(.+)$/i);
    return compact ? {title:compact[1], duration:compact[2] || "", focus:compact[3], objective:""} : {title:raw,focus:"",objective:"",duration:""};
  }).filter((cycle)=>cycle.title);
  const cadence = lines("proposal-cadence");
  const caliResponsibilities = lines("proposal-cali-responsibilities");
  const clientResponsibilities = lines("proposal-client-responsibilities");
  const roadmapItems = lines("proposal-roadmap-items");
  const outOfScope = lines("proposal-out-of-scope");
  if(service.slug==="assessoria-estrategica" && document.getElementById("package-code").value==="PARTNER") validatePartnerPage3({scope:scopeItems,cadence,cycles,caliResponsibilities,clientResponsibilities});
  const includeMap = document.getElementById("mapa-include").checked;
  const mapaPeople = { include:includeMap, score:Number(document.getElementById("mapa-score").value || 0), quadrant:document.getElementById("mapa-quadrant").value, sourceId:document.getElementById("mapa-score").dataset.sourceId || null };
  const matchedMap = mapaResponses.find((row) => String(row.c_email || "").trim().toLowerCase() === String(selected.contact_email || "").trim().toLowerCase());
  if (matchedMap) Object.assign(mapaPeople, { sourceId:matchedMap.id, protocol:matchedMap.protocolo, completedAt:matchedMap.created_at });
  if (includeMap && (!mapaPeople.score || mapaPeople.score > 10)) throw new Error("Informe uma nota válida do Mapa de People entre 0,1 e 10.");
  const nextVersion=existing && existing.status!=="rascunho" ? Number(existing.version||1)+1 : existing?.version||1;
  const documentProtocol=nextVersion>1 ? `${selected.protocol}-V${nextVersion}` : selected.protocol;
  const calculatorData = { ...existing?.calculator_data, ...calculation, ...extensions, contactSnapshot, documentProtocol, editorialVersion:2, visualEditorExtras:window.__visualEditorExtras?.() || existing?.calculator_data?.visualEditorExtras || [], monthlyHours:Number(document.getElementById("monthly-hours")?.value || 0), discountType:document.getElementById("discount-type").value, discountDescription:document.getElementById("discount-description").value.trim(), budgetStrategy:document.getElementById("budget-strategy")?.value || "manter", investmentAnswer:investmentContextFor(service, selected.answers || {}), contextSummary:document.getElementById("proposal-context").value.trim(), painPoints:lines("proposal-pains"), executiveReading:document.getElementById("proposal-reading").value.trim(), mapaPeople, whyNow:document.getElementById("proposal-why-now").value.trim(), cycleObjective:document.getElementById("proposal-cycle-objective").value.trim(), expectedResults:lines("proposal-results"), advantages, cycles, cadence, caliResponsibilities, clientResponsibilities, roadmapItems, outOfScope, bonus, payment };
  const payload = { created_at:existing?.status==="rascunho" ? existing.created_at : draftCreatedAt, submission_id:selected.id, service_slug:selected.service_slug, version:nextVersion, package_code:document.getElementById("package-code").value, base_price:Number(document.getElementById("base-price").value)||0, extras:Number(document.getElementById("extras").value)||0, discount_pct:Math.min(50, calculation.discountPct), contract_months:Number(document.getElementById("months").value)||1, validity_days:Number(document.getElementById("validity").value)||15, subtotal:calculation.subtotal, final_unit:calculation.finalUnit, total_value:calculation.finalUnit, calculator_data:calculatorData, scope_items:scopeItems, payment_terms:document.getElementById("payment-terms").value, public_notes:document.getElementById("public-notes").value, status:"rascunho", updated_at:new Date().toISOString() };
  return {payload,existing};
}

async function saveProposal() {
  const {payload,existing}=proposalPayload();
  let saved;
  if (existing?.status === "rascunho") saved = await rest(`cali_proposals?id=eq.${existing.id}&updated_at=eq.${encodeURIComponent(existing.updated_at)}`, {method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(payload)});
  else saved = await rest("cali_proposals", {method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(payload)});
  if(!saved?.[0]?.id) throw new Error("A proposta mudou em outra aba. Atualize a página antes de salvar novamente.");
  await rest(`cali_submissions?id=eq.${selected.id}`, {method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({status:"edicao",internal_notes:document.getElementById("internal-notes").value,updated_at:new Date().toISOString()})});
  const savedId = saved?.[0]?.id || existing?.id;
  if (savedId) { window.__visualEditorSaved?.(); location.href = `/proposta/${savedId}`; }
}

let saving=false;
const runAction = async (action) => {
  if(saving)return;
  saving=true;document.getElementById("save-review").disabled=true;document.getElementById("save-proposal").disabled=true;
  const feedback = document.getElementById("drawer-save-feedback"); feedback.textContent = "";
  try { await action(); } catch (error) { feedback.textContent = error instanceof Error ? error.message : "Não foi possível salvar."; } finally {saving=false;document.getElementById("save-review").disabled=false;document.getElementById("save-proposal").disabled=false;}
};
document.getElementById("save-review").addEventListener("click", () => runAction(saveReview));
document.getElementById("save-proposal").addEventListener("click", () => runAction(saveProposal));

const [submissionData, ruleData, proposalData, mapaData] = await Promise.all([
  rest(`cali_submissions?id=eq.${id}&select=*`),
  rest("cali_pricing_rules?select=*&active=eq.true&order=service_slug,sort_order"),
  rest("cali_proposals?select=*&order=created_at.desc"),
  optionalRest("mapa_respostas?select=id,protocolo,status,c_nome,c_empresa,c_email,created_at,diagnostico_v2&order=created_at.desc"),
]);
selected = submissionData?.[0];
if (!selected) { drawerBody.innerHTML = "<p>Registro não encontrado.</p>"; throw new Error("registro não encontrado"); }
pricingRules = ruleData || []; proposals = proposalData || []; mapaResponses = mapaData || [];
renderEditor();
const { mountVisualEditor } = await import("/js/proposal-visual-editor.js?v=20261120-visual2");
mountVisualEditor({session,submission:selected,existing:latestProposal(selected.id),getPayload:()=>proposalPayload().payload});
