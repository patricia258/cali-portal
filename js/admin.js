import { CONFIG } from "/js/config.js";
import { requireAdmin, apiHeaders, signOut } from "/js/auth.js";
import { SERVICES, STATUS, flattenFields, labelFor, initialPackageFor, calculateProposal } from "/js/services.js";

const session = await requireAdmin();
if (!session) throw new Error("Sessão administrativa ausente.");
let submissions = [], pricingRules = [], proposals = [], selected = null;
const tableBody = document.getElementById("table-body");
const drawer = document.getElementById("drawer"), overlay = document.getElementById("overlay"), drawerBody = document.getElementById("drawer-body");

document.getElementById("admin-name").textContent = session.user.email === CONFIG.adminEmail ? "Patrícia" : session.user.email;
document.getElementById("logout").addEventListener("click", signOut);

function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]); }
const currency = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (value) => new Date(value).toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" });
const DISCOUNT_TYPES = ["Condição comercial","Cliente novo","Indicação","Campanha do mês","Parceria","Outro"];

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
  document.getElementById("kpi-new").textContent = submissions.filter((r) => r.status === "novo").length;
  document.getElementById("kpi-analysis").textContent = submissions.filter((r) => ["analise","edicao","aprovada"].includes(r.status)).length;
  document.getElementById("kpi-sent").textContent = submissions.filter((r) => ["enviada","negociacao"].includes(r.status)).length;
  document.getElementById("kpi-won").textContent = submissions.filter((r) => r.status === "fechada").length;
}

function filteredSubmissions() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const serviceFilter = document.getElementById("service-filter").value;
  const statusFilter = document.getElementById("status-filter").value;
  return submissions.filter((r) => {
    const haystack = [r.company_name,r.contact_name,r.contact_email,r.protocol].join(" ").toLowerCase();
    return (!query || haystack.includes(query)) && (!serviceFilter || r.service_slug === serviceFilter) && (!statusFilter || r.status === statusFilter);
  });
}

function render() {
  const filtered = filteredSubmissions();
  document.getElementById("empty").classList.toggle("hidden", filtered.length > 0);
  tableBody.innerHTML = filtered.map((r) => {
    const service = SERVICES[r.service_slug];
    return `<tr><td>${formatDate(r.created_at)}<br><small>${escapeHtml(r.protocol)}</small></td><td class="company-cell"><strong>${escapeHtml(r.company_name || r.contact_name)}</strong><span>${escapeHtml(r.contact_name)} · ${escapeHtml(r.contact_email)}</span></td><td>${escapeHtml(service?.title || r.service_slug)}</td><td>${escapeHtml(r.answers?.momento_empresa || r.answers?.prazo_inicio || "—")}</td><td><span class="status-chip" data-status="${escapeHtml(r.status)}">${escapeHtml(STATUS.find((s) => s.value === r.status)?.label || r.status)}</span></td><td><button class="btn btn-outline" data-open="${r.id}">Abrir</button></td></tr>`;
  }).join("");
  tableBody.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () => openSubmission(button.dataset.open)));
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

function scopeDefaults(service) {
  const map = {
    "assessoria-estrategica":["Direção estratégica de pessoas","Leitura de indicadores-chave","Reuniões com founders, diretoria ou RH","Apoio a decisões críticas","Ajuste ou desenho de políticas e processos conforme o pacote"],
    "mentoria-rh":["Leitura do momento profissional","Plano de desenvolvimento individual","Discussão de casos reais","Orientação para decisão e posicionamento","Materiais e tarefas entre sessões"],
    "diagnostico-executivo":["Entrevistas com lideranças-chave","Análise documental e dos indicadores disponíveis","Mapa de riscos e prioridades","Plano de 90 dias","Reunião executiva de devolutiva"],
    "cultura-direcao":["Leitura da cultura atual","Definição da cultura desejada em comportamentos","Pesquisa, entrevistas e grupos focais","Workshops de co-criação","Roadmap de 90 dias e 6 a 12 meses"],
    "shadowing-lideranca":["Observação estruturada de situações reais","Leitura de comunicação, decisão e conflito","Registro técnico de padrões","Devolutiva individual","Recomendações práticas"],
    treinamentos:["Diagnóstico rápido da necessidade","Desenho de conteúdo sob medida","Facilitação ao vivo","Materiais de apoio","Aplicação prática"],
    "marca-empregadora":["Diagnóstico de percepção interna e externa","Definição do EVP","Personas e canais de atração","Plano de ativação","Painel de indicadores"],
  };
  return map[service.slug] || [];
}

function latestProposal(submissionId) { return proposals.find((proposal) => proposal.submission_id === submissionId); }

function openSubmission(id) {
  selected = submissions.find((r) => r.id === id); if (!selected) return;
  const service = SERVICES[selected.service_slug], answers = selected.answers || {}, fields = flattenFields(service), currentProposal = latestProposal(selected.id);
  document.getElementById("drawer-code").textContent = `${selected.protocol} · ${service.code}`;
  document.getElementById("drawer-title").textContent = selected.company_name || selected.contact_name;
  document.getElementById("drawer-subtitle").textContent = `${service.title} · ${selected.contact_name}`;
  const recommended = currentProposal?.package_code || initialPackageFor(service, answers);
  const packages = service.packages || [];
  const defaultRule = pricingRules.find((r) => r.service_slug === service.slug && r.package_code === recommended);
  const base = currentProposal?.base_price ?? defaultRule?.base_price ?? 0;
  const savedCalc = currentProposal?.calculator_data || {};
  const alerts = service.alerts?.(answers) || [];
  const answerHtml = fields.map((field) => `<div class="answer"><small>${escapeHtml(field.label)}</small><div>${escapeHtml(labelFor(field.options, answers[field.id]))}</div></div>`).join("");
  drawerBody.innerHTML = `<section class="drawer-section"><h3>Leitura do briefing</h3><div class="answer-grid">${answerHtml}</div></section><section class="drawer-section"><h3>Avisos para a análise</h3><div class="alerts">${alerts.length ? alerts.map((a) => `<div class="alert ${a.level}">${escapeHtml(a.text)}</div>`).join("") : '<div class="alert low">Nenhum alerta crítico gerado pelas regras atuais.</div>'}</div></section><section class="drawer-section"><h3>Análise interna</h3><div class="field"><label>Status</label><select class="control" id="review-status">${STATUS.map((s) => `<option value="${s.value}" ${selected.status===s.value?"selected":""}>${s.label}</option>`).join("")}</select></div><div class="field" style="margin-top:12px"><label>Observações internas</label><textarea class="control" id="internal-notes">${escapeHtml(selected.internal_notes || "")}</textarea></div></section><section class="drawer-section"><h3>Calculadora da proposta</h3><p class="calc-explainer">O valor-base recebe os ajustes de complexidade do briefing. Você pode aplicar uma condição comercial e, se necessário, editar diretamente o valor final.</p><div class="calc-grid"><div class="field"><label>Modelo / pacote</label><select class="control" id="package-code">${packages.map((p) => `<option value="${p.code}" ${recommended===p.code?"selected":""}>${escapeHtml(p.label)}</option>`).join("")}</select></div><div class="field"><label>Valor-base interno</label><input class="control" id="base-price" type="number" min="0" step="50" value="${base}"></div><div class="field"><label>Adicionais</label><input class="control" id="extras" type="number" min="0" step="50" value="${currentProposal?.extras ?? 0}"></div><div class="field"><label>Desconto (%)</label><input class="control" id="discount" type="number" min="0" max="50" step=".01" value="${currentProposal?.discount_pct ?? 0}"></div><div class="field"><label>Tipo de desconto</label><select class="control" id="discount-type"><option value="">Sem identificação</option>${DISCOUNT_TYPES.map((type) => `<option value="${type}" ${savedCalc.discountType===type?"selected":""}>${type}</option>`).join("")}</select></div><div class="field"><label>Descrição da condição</label><input class="control" id="discount-description" value="${escapeHtml(savedCalc.discountDescription || "")}" placeholder="Ex.: condição válida neste mês"></div><div class="field"><label id="months-label">Contrato mínimo (meses)</label><input class="control" id="months" type="number" min="1" value="${currentProposal?.contract_months ?? (recommended === "FULL" ? 8 : recommended === "PARTNER" ? 6 : 1)}"></div><div class="field"><label>Validade da proposta (dias)</label><input class="control" id="validity" type="number" min="1" value="${currentProposal?.validity_days ?? 15}"></div><div class="field calc-final-field"><label>Valor final editável</label><input class="control" id="final-price" type="number" min="0" step="50" value="${currentProposal?.final_unit ?? ""}"><small>Ao editar, o desconto efetivo é recalculado.</small></div></div><div class="calc-result" id="calc-result"></div></section><section class="drawer-section"><h3>Escopo e condições</h3><div class="field"><label>Entregas incluídas — uma por linha</label><textarea class="control" id="scope" style="min-height:160px">${escapeHtml((currentProposal?.scope_items || scopeDefaults(service)).join("\n"))}</textarea></div><div class="field" style="margin-top:12px"><label>Condições de pagamento</label><textarea class="control" id="payment-terms">${escapeHtml(currentProposal?.payment_terms || "Pagamento conforme cronograma definido na proposta.")}</textarea></div><div class="field" style="margin-top:12px"><label>Observações que aparecem na proposta</label><textarea class="control" id="public-notes">${escapeHtml(currentProposal?.public_notes || "")}</textarea></div></section>`;
  let manualFinal = Boolean(savedCalc.manualFinal);
  const recalc = () => {
    const rule = pricingRules.find((r) => r.service_slug === service.slug && r.package_code === document.getElementById("package-code").value);
    if (rule && Number(document.getElementById("base-price").value) === 0) document.getElementById("base-price").value = rule.base_price;
    const result = calculateProposal({ service, answers, packageCode:document.getElementById("package-code").value, basePrice:document.getElementById("base-price").value, extras:document.getElementById("extras").value, discount:document.getElementById("discount").value, months:document.getElementById("months").value, finalOverride:manualFinal ? document.getElementById("final-price").value : null });
    if (!manualFinal) document.getElementById("final-price").value = result.finalUnit;
    document.getElementById("months-label").textContent = result.monthly ? "Contrato mínimo (meses)" : "Prazo de referência (meses)";
    const discountName = document.getElementById("discount-type").value || "Desconto";
    document.getElementById("calc-result").innerHTML = `<div class="calc-line"><span>Valor de referência</span><strong>${currency(result.subtotal)}</strong></div>${result.discountValue ? `<div class="calc-line"><span>${escapeHtml(discountName)} (${result.discountPct.toLocaleString("pt-BR") }%)</span><strong>− ${currency(result.discountValue)}</strong></div>` : ""}<div class="calc-total"><span>${result.monthly ? "Mensalidade final" : "Investimento final"}</span><strong>${currency(result.finalUnit)}</strong></div>${result.monthly ? `<div class="calc-condition">Contrato mínimo de ${result.months} meses. A recorrência não é somada como valor total.</div>` : ""}`;
    return result;
  };
  ["base-price","extras","discount"].forEach((id) => document.getElementById(id).addEventListener("input", () => { manualFinal = false; recalc(); }));
  ["months","discount-type","discount-description"].forEach((id) => document.getElementById(id).addEventListener("input", recalc));
  document.getElementById("final-price").addEventListener("input", () => {
    manualFinal = true;
    const reference = calculateProposal({ service, answers, packageCode:document.getElementById("package-code").value, basePrice:document.getElementById("base-price").value, extras:document.getElementById("extras").value, discount:0, months:document.getElementById("months").value });
    const final = Number(document.getElementById("final-price").value) || 0;
    document.getElementById("discount").value = reference.subtotal ? Math.min(50, Math.max(0, ((reference.subtotal - final) / reference.subtotal) * 100)).toFixed(2) : 0;
    recalc();
  });
  document.getElementById("package-code").addEventListener("change", (event) => { const rule = pricingRules.find((r) => r.service_slug === service.slug && r.package_code === event.target.value); if (rule) document.getElementById("base-price").value = rule.base_price; const selectedPackage = packages.find((item) => item.code === event.target.value); if (selectedPackage?.minimumMonths) document.getElementById("months").value = selectedPackage.minimumMonths; manualFinal = false; recalc(); });
  drawer.dataset.recalc = "ready"; drawer._recalc = recalc; recalc();
  drawer.classList.add("open"); overlay.classList.add("open");
}

function closeDrawer() { drawer.classList.remove("open"); overlay.classList.remove("open"); selected = null; }

async function saveReview() {
  if (!selected) return;
  await rest(`cali_submissions?id=eq.${selected.id}`, { method:"PATCH", headers:{Prefer:"return=representation"}, body:JSON.stringify({status:document.getElementById("review-status").value,internal_notes:document.getElementById("internal-notes").value,updated_at:new Date().toISOString()}) });
  await load(); closeDrawer();
}

async function saveProposal() {
  if (!selected) return;
  const service = SERVICES[selected.service_slug], existing = latestProposal(selected.id), calculation = drawer._recalc();
  const calculatorData = { ...calculation, discountType:document.getElementById("discount-type").value, discountDescription:document.getElementById("discount-description").value.trim() };
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
document.getElementById("refresh").addEventListener("click", load); document.getElementById("close").addEventListener("click", closeDrawer); overlay.addEventListener("click", closeDrawer); document.getElementById("save-review").addEventListener("click", saveReview); document.getElementById("save-proposal").addEventListener("click", saveProposal);
document.getElementById("export-csv").addEventListener("click", exportCsv);
await load();
