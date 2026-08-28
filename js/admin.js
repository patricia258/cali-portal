import { CONFIG } from "/js/config.js";
import { requireAdmin, apiHeaders, signOut } from "/js/auth.js";
import { SERVICES, STATUS, flattenFields, labelFor, initialPackageFor, calculateProposal, investmentContextFor, PACKAGE_PRICE_BANDS } from "/js/services.js";

const session = await requireAdmin();
if (!session) throw new Error("Sessão administrativa ausente.");
let submissions = [], pricingRules = [], proposals = [], selected = null, pendingDelete = null, showArchived = false;
const tableBody = document.getElementById("table-body");
const drawer = document.getElementById("drawer"), overlay = document.getElementById("overlay"), drawerBody = document.getElementById("drawer-body");

document.getElementById("admin-name").textContent = session.user.email === CONFIG.adminEmail ? "Patrícia" : session.user.email;
document.getElementById("logout").addEventListener("click", signOut);

function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]); }
const currency = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (value) => new Date(value).toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" });
const DISCOUNT_TYPES = ["Condição comercial","Cliente novo","Indicação","Campanha do mês","Parceria","Outro"];
const BUDGET_STRATEGIES = [
  ["adequar", "Adequar pacote e escopo ao teto informado"],
  ["fasear", "Contratar uma primeira fase dentro do teto"],
  ["manter", "Manter escopo integral e justificar o valor"],
];
const pencilIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16-1 5 5-1L19 9l-4-4L4 16zM13.5 6.5l4 4"/></svg>';
const deleteIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

async function rest(path, options = {}) {
  const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${path}`, { ...options, headers: apiHeaders(session, options.headers || {}) });
  if (response.status === 401 || response.status === 403) { await signOut(); return null; }
  if (!response.ok) throw new Error((await response.text()) || "Falha ao consultar os dados.");
  if (response.status === 204) return null;
  return response.json();
}

async function load() {
  const [submissionData, ruleData, proposalData] = await Promise.all([
    rest("cali_submissions?select=*&order=created_at.desc"),
    rest("cali_pricing_rules?select=*&active=eq.true&order=service_slug,sort_order"),
    rest("cali_proposals?select=*&order=created_at.desc"),
  ]);
  submissions = submissionData || []; pricingRules = ruleData || []; proposals = proposalData || [];
  updateKpis(); render();
}

function updateKpis() {
  const active = submissions.filter((row) => !row.archived_at);
  document.getElementById("kpi-new").textContent = active.filter((r) => r.status === "novo").length;
  document.getElementById("kpi-analysis").textContent = active.filter((r) => ["analise","edicao","aprovada"].includes(r.status)).length;
  document.getElementById("kpi-sent").textContent = active.filter((r) => ["enviada","negociacao"].includes(r.status)).length;
  document.getElementById("kpi-won").textContent = active.filter((r) => r.status === "fechada").length;
}

function filteredSubmissions() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const serviceFilter = document.getElementById("service-filter").value;
  const statusFilter = document.getElementById("status-filter").value;
  return submissions.filter((r) => {
    const haystack = [r.company_name,r.contact_name,r.contact_email,r.protocol].join(" ").toLowerCase();
    const archiveMatch = showArchived ? Boolean(r.archived_at) : !r.archived_at;
    return archiveMatch && (!query || haystack.includes(query)) && (!serviceFilter || r.service_slug === serviceFilter) && (!statusFilter || r.status === statusFilter);
  });
}

function render() {
  const filtered = filteredSubmissions();
  document.getElementById("empty").classList.toggle("hidden", filtered.length > 0);
  tableBody.innerHTML = filtered.map((r) => {
    const service = SERVICES[r.service_slug];
    const archiveAction = r.archived_at ? `<button class="table-icon-action restore" data-restore="${r.id}" aria-label="Restaurar ${escapeHtml(r.company_name || r.contact_name)}" title="Restaurar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6M4 4v6h6"/></svg></button>` : `<button class="table-icon-action danger" data-delete="${r.id}" aria-label="Arquivar ${escapeHtml(r.company_name || r.contact_name)}" title="Arquivar registro de teste">${deleteIcon}</button>`;
    return `<tr><td>${formatDate(r.created_at)}<br><small>${escapeHtml(r.protocol)}</small></td><td class="company-cell"><strong>${escapeHtml(r.company_name || r.contact_name)}</strong><span>${escapeHtml(r.contact_name)} · ${escapeHtml(r.contact_email)}</span></td><td>${escapeHtml(service?.title || r.service_slug)}</td><td>${escapeHtml(r.answers?.momento_empresa || r.answers?.prazo_inicio || "—")}</td><td><span class="status-chip" data-status="${escapeHtml(r.status)}">${escapeHtml(STATUS.find((s) => s.value === r.status)?.label || r.status)}</span></td><td><div class="table-actions"><button class="table-icon-action" data-open="${r.id}" aria-label="Editar ${escapeHtml(r.company_name || r.contact_name)}" title="Editar">${pencilIcon}</button>${archiveAction}</div></td></tr>`;
  }).join("");
  tableBody.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () => openSubmission(button.dataset.open)));
  tableBody.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => openDeleteConfirmation(button.dataset.delete)));
  tableBody.querySelectorAll("[data-restore]").forEach((button) => button.addEventListener("click", () => restoreSubmission(button.dataset.restore)));
}

function csvValue(value) {
  const text = Array.isArray(value) ? value.join(" | ") : typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv() {
  const rows = filteredSubmissions();
  if (!rows.length) return;
  const answerKeys = [...new Set(rows.flatMap((row) => Object.keys(row.answers || {})))];
  const fixed = ["Data","Protocolo","Serviço","Status","Nome","Cargo","E-mail","WhatsApp","Empresa"];
  const lines = [
    [...fixed, ...answerKeys].map(csvValue).join(";"),
    ...rows.map((row) => [
      new Date(row.created_at).toLocaleString("pt-BR"), row.protocol, SERVICES[row.service_slug]?.title || row.service_slug,
      STATUS.find((status) => status.value === row.status)?.label || row.status, row.contact_name, row.contact_role,
      row.contact_email, row.contact_phone, row.company_name, ...answerKeys.map((key) => row.answers?.[key]),
    ].map(csvValue).join(";")),
  ];
  const blob = new Blob(["\ufeff", lines.join("\n")], { type:"text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `CALI-briefings-${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
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

function latestProposal(submissionId) { return proposals.find((proposal) => proposal.submission_id === submissionId); }

function technicalPackageFor(service, answers) {
  return initialPackageFor(service, { ...answers, investimento:"avaliar", budget:"avaliar" });
}

function packageForBudget(service, answers, investment) {
  const technical = technicalPackageFor(service, answers);
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

function prioritizedScope(service, answers, phased = false, packageCode = initialPackageFor(service, answers)) {
  if (service.slug === "assessoria-estrategica") {
    const selected = Array.isArray(answers.frentes) ? answers.frentes : [];
    const challenge = String(answers.principal_desafio || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const keywordMap = { governanca:["governan","process"], clima:["clima","engaj"], comunicacao:["comunic"], planejamento:["planej"], desenho:["estrutur","desenho"], cultura:["cultur"], cargos:["cargo","salario"], atracao:["atracao","selec","onboard"] };
    const ordered = [
      ...selected.filter((value) => (keywordMap[value] || []).some((keyword) => challenge.includes(keyword))),
      ...selected,
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
  const defaults = scopeDefaults(service, initialPackageFor(service, answers));
  return [
    phased ? "Primeira fase do trabalho, com escopo e entregas delimitados" : "Escopo priorizado conforme o investimento informado",
    ...defaults.slice(0, 3),
    "Roadmap das demais necessidades para uma etapa posterior",
  ];
}

function openSubmission(id) {
  selected = submissions.find((r) => r.id === id); if (!selected) return;
  const service = SERVICES[selected.service_slug], answers = selected.answers || {}, fields = flattenFields(service), currentProposal = latestProposal(selected.id);
  document.getElementById("drawer-code").textContent = `${selected.protocol} · ${service.code}`;
  document.getElementById("drawer-title").textContent = selected.company_name || selected.contact_name;
  document.getElementById("drawer-subtitle").textContent = `${service.title} · ${selected.contact_name}`;
  const savedCalc = currentProposal?.calculator_data || {};
  const investment = investmentContextFor(service, answers);
  const technicalPackage = technicalPackageFor(service, answers);
  const budgetPackage = packageForBudget(service, answers, investment);
  const recommended = currentProposal?.package_code || budgetPackage || initialPackageFor(service, answers);
  const packages = service.packages || [];
  const defaultRule = pricingRules.find((r) => r.service_slug === service.slug && r.package_code === recommended);
  const base = currentProposal?.base_price ?? defaultRule?.base_price ?? 0;
  const packageInfo = packages.find((item) => item.code === recommended);
  const defaultHours = savedCalc.monthlyHours ?? packageInfo?.suggestedHours ?? 0;
  const hoursField = service.slug === "assessoria-estrategica" ? `<div class="field"><label>Horas mensais contratadas</label><input class="control" id="monthly-hours" type="number" min="1" max="200" step="1" value="${defaultHours}"><small class="field-help" id="monthly-hours-help">Referência da matriz: ${escapeHtml(packageInfo?.hoursRange || "a definir")}h/mês. O número final é ajustável.</small></div>` : "";
  const alerts = service.alerts?.(answers) || [];
  const answerHtml = fields.map((field) => {
    const answer = ["investimento","budget"].includes(field.id) ? investmentContextFor(service, answers)?.label || "—" : labelFor(field.options, answers[field.id]);
    return `<div class="answer"><small>${escapeHtml(field.label)}</small><div>${escapeHtml(answer)}</div></div>`;
  }).join("");
  const defaultBudgetStrategy = savedCalc.budgetStrategy || (currentProposal ? "manter" : investment?.max ? "adequar" : "manter");
  const initialScope = currentProposal?.scope_items || (["adequar","fasear"].includes(defaultBudgetStrategy) ? prioritizedScope(service, answers, defaultBudgetStrategy === "fasear", recommended) : scopeDefaults(service, recommended));
  const investmentHtml = investment
    ? `<div class="budget-reading"><span>Investimento informado pelo cliente</span><strong>${escapeHtml(investment.label)} <small>${escapeHtml(investment.period)}</small></strong></div><div class="budget-live" id="budget-live"></div>${investment.max ? `<div class="field budget-strategy-field"><label>Como tratar esta faixa na proposta?</label><select class="control" id="budget-strategy">${BUDGET_STRATEGIES.map(([value,label])=>`<option value="${value}" ${defaultBudgetStrategy===value?"selected":""}>${escapeHtml(label)}</option>`).join("")}</select></div><button class="btn btn-budget" type="button" id="apply-budget">Aplicar recomendação ao pacote e ao escopo</button>` : `<p class="budget-open-note">O cliente preferiu avaliar o investimento pelo escopo. A calculadora mantém a leitura técnica integral.</p>`}`
    : `<div class="budget-reading legacy"><span>Investimento do cliente</span><strong>Não informado</strong></div><p class="budget-open-note">Este briefing é anterior à pergunta obrigatória. Faça a análise comercial manualmente.</p>`;
  const selectedBand = PACKAGE_PRICE_BANDS[service.slug]?.[recommended];
  const priceBandHint = selectedBand ? `Faixa interna deste modelo: ${currency(selectedBand.min)} a ${currency(selectedBand.max)}.` : "";
  drawerBody.innerHTML = `<section class="drawer-section"><div class="drawer-section-heading"><div><div class="eyebrow">Dados editáveis</div><h3>Contato e empresa</h3></div><span class="edit-badge">${pencilIcon} Editar</span></div><div class="calc-grid"><div class="field"><label>Nome do contato / decisor</label><input class="control" id="edit-contact-name" value="${escapeHtml(selected.contact_name || "")}" maxlength="140"></div><div class="field"><label>Cargo</label><input class="control" id="edit-contact-role" value="${escapeHtml(selected.contact_role || "")}" maxlength="140"></div><div class="field"><label>E-mail</label><input class="control" id="edit-contact-email" type="email" value="${escapeHtml(selected.contact_email || "")}" maxlength="254"></div><div class="field"><label>WhatsApp</label><input class="control" id="edit-contact-phone" value="${escapeHtml(selected.contact_phone || "")}" maxlength="40"></div><div class="field"><label>Empresa</label><input class="control" id="edit-company-name" value="${escapeHtml(selected.company_name || "")}" maxlength="180"></div><div class="field"><label>Localidade</label><input class="control" id="edit-company-location" value="${escapeHtml(selected.company_location || "")}" maxlength="180"></div></div><p class="edit-note">As respostas originais do briefing permanecem preservadas abaixo. Aqui você corrige os dados que aparecem no painel, na proposta e na confirmação de envio.</p></section><section class="drawer-section"><h3>Leitura do briefing</h3><div class="answer-grid">${answerHtml}</div></section><section class="drawer-section"><h3>Avisos para a análise</h3><div class="alerts">${alerts.length ? alerts.map((a) => `<div class="alert ${a.level}">${escapeHtml(a.text)}</div>`).join("") : '<div class="alert low">Nenhum alerta crítico gerado pelas regras atuais.</div>'}</div></section><section class="drawer-section"><h3>Análise interna</h3><div class="field"><label>Status</label><select class="control" id="review-status">${STATUS.map((s) => `<option value="${s.value}" ${selected.status===s.value?"selected":""}>${s.label}</option>`).join("")}</select></div><div class="field" style="margin-top:12px"><label>Observações internas</label><textarea class="control" id="internal-notes">${escapeHtml(selected.internal_notes || "")}</textarea></div></section><section class="drawer-section"><h3>Calculadora da proposta</h3><p class="calc-explainer">A calculadora cruza a complexidade do briefing com o investimento informado. Cada pacote possui piso e teto próprios; acima do teto, o escopo precisa ser faseado ou migrar de modelo.</p><div class="budget-panel">${investmentHtml}</div><div class="calc-grid"><div class="field"><label>Modelo / pacote</label><select class="control" id="package-code">${packages.map((p) => `<option value="${p.code}" ${recommended===p.code?"selected":""}>${escapeHtml(p.label)}</option>`).join("")}</select><small id="package-price-band">${escapeHtml(priceBandHint)}</small></div><div class="field"><label>Valor-base interno</label><input class="control" id="base-price" type="number" min="0" step="50" value="${base}"></div><div class="field"><label>Adicionais</label><input class="control" id="extras" type="number" min="0" step="50" value="${currentProposal?.extras ?? 0}"></div><div class="field"><label>Desconto (%)</label><input class="control" id="discount" type="number" min="0" max="50" step=".01" value="${currentProposal?.discount_pct ?? 0}"></div><div class="field"><label>Tipo de desconto</label><select class="control" id="discount-type"><option value="">Sem identificação</option>${DISCOUNT_TYPES.map((type) => `<option value="${type}" ${savedCalc.discountType===type?"selected":""}>${type}</option>`).join("")}</select></div><div class="field"><label>Descrição da condição</label><input class="control" id="discount-description" value="${escapeHtml(savedCalc.discountDescription || "")}" placeholder="Ex.: condição válida neste mês"></div><div class="field"><label id="months-label">Contrato mínimo (meses)</label><input class="control" id="months" type="number" min="1" value="${currentProposal?.contract_months ?? packageInfo?.minimumMonths ?? 1}"></div>${hoursField}<div class="field"><label>Validade da proposta (dias)</label><input class="control" id="validity" type="number" min="1" value="${currentProposal?.validity_days ?? 15}"></div><div class="field calc-final-field"><label>Valor final editável</label><input class="control" id="final-price" type="number" min="0" step="50" value="${currentProposal?.final_unit ?? ""}"><small>O valor permanece dentro da faixa comercial definida para o modelo.</small></div></div><div class="calc-result" id="calc-result"></div></section><section class="drawer-section"><h3>Escopo e condições</h3><div class="field"><label>Entregas incluídas — uma por linha</label><textarea class="control" id="scope" style="min-height:160px">${escapeHtml(initialScope.join("\n"))}</textarea></div><div class="field" style="margin-top:12px"><label>Condições de pagamento</label><textarea class="control" id="payment-terms">${escapeHtml(currentProposal?.payment_terms || "Pagamento conforme cronograma definido na proposta.")}</textarea></div><div class="field" style="margin-top:12px"><label>Observações que aparecem na proposta</label><textarea class="control" id="public-notes">${escapeHtml(currentProposal?.public_notes || "")}</textarea></div></section>`;
  let manualFinal = Boolean(savedCalc.manualFinal);
  const recalc = () => {
    const rule = pricingRules.find((r) => r.service_slug === service.slug && r.package_code === document.getElementById("package-code").value);
    if (rule && Number(document.getElementById("base-price").value) === 0) document.getElementById("base-price").value = rule.base_price;
    const budgetStrategy = document.getElementById("budget-strategy")?.value || "manter";
    const scopeMode = ["adequar","fasear"].includes(budgetStrategy) ? "prioritized" : "integral";
    const result = calculateProposal({ service, answers, packageCode:document.getElementById("package-code").value, basePrice:document.getElementById("base-price").value, extras:document.getElementById("extras").value, discount:document.getElementById("discount").value, months:document.getElementById("months").value, finalOverride:manualFinal ? document.getElementById("final-price").value : null, scopeMode });
    if (!manualFinal) document.getElementById("final-price").value = result.finalUnit;
    document.getElementById("months-label").textContent = result.monthly ? "Contrato mínimo (meses)" : "Prazo de referência (meses)";
    const discountName = document.getElementById("discount-type").value || "Desconto";
    const hours = Number(document.getElementById("monthly-hours")?.value || 0);
    document.getElementById("calc-result").innerHTML = `<div class="calc-line"><span>Valor de referência</span><strong>${currency(result.subtotal)}</strong></div>${result.discountValue ? `<div class="calc-line"><span>${escapeHtml(discountName)} (${result.discountPct.toLocaleString("pt-BR") }%)</span><strong>− ${currency(result.discountValue)}</strong></div>` : ""}<div class="calc-total"><span>${result.monthly ? "Mensalidade final" : "Investimento final"}</span><strong>${currency(result.finalUnit)}</strong></div>${result.ceilingApplied ? `<div class="calc-condition">O teto comercial de ${currency(result.priceBand.max)} foi aplicado. Se o escopo integral exigir mais capacidade, divida em fases ou selecione outro modelo.</div>` : ""}${result.monthly ? `<div class="calc-condition">${hours ? `${hours} horas mensais. ` : ""}Contrato mínimo de ${result.months} meses, renovação automática e aviso prévio de 30 dias. A recorrência não é somada como valor total.</div>` : ""}`;
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
  ["base-price","extras","discount"].forEach((id) => document.getElementById(id).addEventListener("input", () => { manualFinal = false; recalc(); }));
  ["months","monthly-hours","discount-type","discount-description","budget-strategy"].forEach((id) => document.getElementById(id)?.addEventListener("input", recalc));
  document.getElementById("final-price").addEventListener("input", () => {
    manualFinal = true;
    const reference = calculateProposal({ service, answers, packageCode:document.getElementById("package-code").value, basePrice:document.getElementById("base-price").value, extras:document.getElementById("extras").value, discount:0, months:document.getElementById("months").value });
    const final = Number(document.getElementById("final-price").value) || 0;
    document.getElementById("discount").value = reference.subtotal ? Math.min(50, Math.max(0, ((reference.subtotal - final) / reference.subtotal) * 100)).toFixed(2) : 0;
    recalc();
  });
  document.getElementById("package-code").addEventListener("change", (event) => { const rule = pricingRules.find((r) => r.service_slug === service.slug && r.package_code === event.target.value); if (rule) document.getElementById("base-price").value = rule.base_price; const selectedPackage = packages.find((item) => item.code === event.target.value); const selectedBand = PACKAGE_PRICE_BANDS[service.slug]?.[event.target.value]; document.getElementById("package-price-band").textContent = selectedBand ? `Faixa interna deste modelo: ${currency(selectedBand.min)} a ${currency(selectedBand.max)}.` : ""; if (selectedPackage?.minimumMonths) document.getElementById("months").value = selectedPackage.minimumMonths; if (document.getElementById("monthly-hours") && selectedPackage?.suggestedHours) document.getElementById("monthly-hours").value = selectedPackage.suggestedHours; if (document.getElementById("monthly-hours-help")) document.getElementById("monthly-hours-help").textContent = `Referência da matriz: ${selectedPackage?.hoursRange || "a definir"}h/mês. O número final é ajustável.`; if (!currentProposal) document.getElementById("scope").value = scopeDefaults(service, event.target.value).join("\n"); manualFinal = false; recalc(); });
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
  drawer.dataset.recalc = "ready"; drawer._recalc = recalc; recalc();
  drawer.classList.add("open"); overlay.classList.add("open");
}

function closeDrawer() { drawer.classList.remove("open"); overlay.classList.remove("open"); selected = null; }

function editableSubmissionPayload() {
  const contactName = document.getElementById("edit-contact-name").value.trim();
  const contactEmail = document.getElementById("edit-contact-email").value.trim().toLowerCase();
  if (contactName.length < 2) throw new Error("Informe o nome do contato.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) throw new Error("Informe um e-mail válido.");
  return {status:document.getElementById("review-status").value,internal_notes:document.getElementById("internal-notes").value,contact_name:contactName,contact_role:document.getElementById("edit-contact-role").value.trim()||null,contact_email:contactEmail,contact_phone:document.getElementById("edit-contact-phone").value.trim()||null,company_name:document.getElementById("edit-company-name").value.trim()||null,company_location:document.getElementById("edit-company-location").value.trim()||null,updated_at:new Date().toISOString()};
}

async function saveReview() {
  if (!selected) return;
  await rest(`cali_submissions?id=eq.${selected.id}`, { method:"PATCH", headers:{Prefer:"return=representation"}, body:JSON.stringify(editableSubmissionPayload()) });
  await load(); closeDrawer();
}

function openDeleteConfirmation(id) {
  pendingDelete = submissions.find((item) => item.id === id) || null;
  if (!pendingDelete) return;
  document.getElementById("delete-summary").innerHTML = `<strong>${escapeHtml(pendingDelete.company_name || pendingDelete.contact_name)}</strong><br>${escapeHtml(pendingDelete.protocol)} · ${escapeHtml(SERVICES[pendingDelete.service_slug]?.title || pendingDelete.service_slug)}`;
  document.getElementById("delete-feedback").textContent = "";
  document.getElementById("delete-overlay").classList.remove("hidden");
}

function closeDeleteConfirmation() {
  document.getElementById("delete-overlay").classList.add("hidden");
  pendingDelete = null;
}

async function deleteSubmission() {
  if (!pendingDelete) return;
  const button = document.getElementById("confirm-delete"), feedback = document.getElementById("delete-feedback");
  button.disabled = true; button.textContent = "Excluindo…"; feedback.textContent = "";
  try {
    await rest(`cali_submissions?id=eq.${pendingDelete.id}`, {method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({archived_at:new Date().toISOString(),updated_at:new Date().toISOString()})});
    closeDeleteConfirmation(); await load();
  } catch (error) { feedback.textContent = error instanceof Error ? error.message : "Não foi possível arquivar o registro."; }
  finally { button.disabled = false; button.textContent = "Arquivar registro"; }
}

async function restoreSubmission(id) {
  await rest(`cali_submissions?id=eq.${id}`, {method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({archived_at:null,updated_at:new Date().toISOString()})});
  await load();
}

async function saveProposal() {
  if (!selected) return;
  await rest(`cali_submissions?id=eq.${selected.id}`, {method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify(editableSubmissionPayload())});
  const service = SERVICES[selected.service_slug], existing = latestProposal(selected.id), calculation = drawer._recalc();
  const calculatorData = { ...calculation, monthlyHours:Number(document.getElementById("monthly-hours")?.value || 0), discountType:document.getElementById("discount-type").value, discountDescription:document.getElementById("discount-description").value.trim(), budgetStrategy:document.getElementById("budget-strategy")?.value || "manter", investmentAnswer:investmentContextFor(service, selected.answers || {}) };
  const payload = { submission_id:selected.id, service_slug:selected.service_slug, version:existing?.version || 1, package_code:document.getElementById("package-code").value, base_price:Number(document.getElementById("base-price").value)||0, extras:Number(document.getElementById("extras").value)||0, discount_pct:Math.min(50, calculation.discountPct), contract_months:Number(document.getElementById("months").value)||1, validity_days:Number(document.getElementById("validity").value)||15, subtotal:calculation.subtotal, final_unit:calculation.finalUnit, total_value:calculation.finalUnit, calculator_data:calculatorData, scope_items:document.getElementById("scope").value.split("\n").map((x)=>x.trim()).filter(Boolean), payment_terms:document.getElementById("payment-terms").value, public_notes:document.getElementById("public-notes").value, status:"rascunho", updated_at:new Date().toISOString() };
  let saved;
  if (existing) saved = await rest(`cali_proposals?id=eq.${existing.id}`, {method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(payload)});
  else saved = await rest("cali_proposals", {method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(payload)});
  await rest(`cali_submissions?id=eq.${selected.id}`, {method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({status:"edicao",updated_at:new Date().toISOString()})});
  const id = saved?.[0]?.id || existing?.id;
  if (id) location.href = `/proposta/${id}`;
}

Object.entries(SERVICES).forEach(([slug, service]) => document.getElementById("service-filter").insertAdjacentHTML("beforeend", `<option value="${slug}">${service.title}</option>`));
STATUS.forEach((status) => document.getElementById("status-filter").insertAdjacentHTML("beforeend", `<option value="${status.value}">${status.label}</option>`));
["search","service-filter","status-filter"].forEach((id) => document.getElementById(id).addEventListener("input", render));
document.getElementById("clear").addEventListener("click", () => { document.getElementById("search").value=""; document.getElementById("service-filter").value=""; document.getElementById("status-filter").value=""; render(); });
const runDrawerAction = async (action) => { const feedback = document.getElementById("drawer-save-feedback"); feedback.textContent = ""; try { await action(); } catch (error) { feedback.textContent = error instanceof Error ? error.message : "Não foi possível salvar."; } };
document.getElementById("refresh").addEventListener("click", load); document.getElementById("close").addEventListener("click", closeDrawer); overlay.addEventListener("click", closeDrawer); document.getElementById("save-review").addEventListener("click", () => runDrawerAction(saveReview)); document.getElementById("save-proposal").addEventListener("click", () => runDrawerAction(saveProposal));
document.getElementById("export-csv").addEventListener("click", exportCsv);
document.getElementById("archive-filter").addEventListener("click", () => { showArchived = !showArchived; document.getElementById("archive-filter").textContent = showArchived ? "Ver ativos" : "Ver arquivados"; render(); });
document.getElementById("cancel-delete").addEventListener("click", closeDeleteConfirmation);
document.getElementById("delete-overlay").addEventListener("click", (event) => { if (event.target.id === "delete-overlay") closeDeleteConfirmation(); });
document.getElementById("confirm-delete").addEventListener("click", deleteSubmission);
await load();
