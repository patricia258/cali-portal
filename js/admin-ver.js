import { CONFIG } from "/js/config.js";
import { requireAdmin, apiHeaders } from "/js/auth.js";
import { SERVICES, STATUS, flattenFields, labelFor, investmentContextFor } from "/js/services.js";

const session = await requireAdmin();
if (!session) throw new Error("Sessão administrativa ausente.");

function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]); }
const currency = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function rest(path) {
  const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${path}`, { headers: apiHeaders(session) });
  if (!response.ok) throw new Error((await response.text()) || "Falha ao consultar os dados.");
  return response.json();
}

const id = new URLSearchParams(location.search).get("id");
const page = document.getElementById("page-body");
if (!id) { page.innerHTML = `<p>Registro não encontrado.</p>`; throw new Error("id ausente"); }

const [record] = await rest(`cali_submissions?id=eq.${id}&select=*`);
if (!record) { page.innerHTML = `<p>Registro não encontrado.</p>`; throw new Error("registro não encontrado"); }
const [proposal] = await rest(`cali_proposals?submission_id=eq.${id}&select=final_unit&order=created_at.desc&limit=1`).catch(() => [null]);

const service = SERVICES[record.service_slug], answers = record.answers || {}, fields = flattenFields(service);
document.getElementById("page-code").textContent = `${record.protocol} · ${service.code}`;
document.getElementById("page-title").textContent = record.company_name || record.contact_name;
document.getElementById("page-subtitle").textContent = `${service.title} · ${record.contact_name}`;
document.getElementById("edit-link").href = `/admin/editar.html?id=${id}`;

const answerHtml = fields.map((field) => {
  const answer = ["investimento","budget"].includes(field.id) ? investmentContextFor(service, answers)?.label || "—" : labelFor(field.options, answers[field.id]);
  return `<div class="answer"><small>${escapeHtml(field.label)}</small><div>${escapeHtml(answer)}</div></div>`;
}).join("");
const statusLabel = STATUS.find((s) => s.value === record.status)?.label || record.status;

page.innerHTML = `<section class="drawer-section"><h3>Contato e empresa</h3><div class="answer-grid"><div class="answer"><small>Contato</small><div>${escapeHtml(record.contact_name)}${record.contact_role ? ` · ${escapeHtml(record.contact_role)}` : ""}</div></div><div class="answer"><small>E-mail</small><div>${escapeHtml(record.contact_email)}</div></div><div class="answer"><small>WhatsApp</small><div>${escapeHtml(record.contact_phone || "—")}</div></div><div class="answer"><small>Empresa</small><div>${escapeHtml(record.company_name || "—")}</div></div><div class="answer"><small>Localidade</small><div>${escapeHtml(record.company_location || "—")}</div></div><div class="answer"><small>Status atual</small><div><span class="status-chip" data-status="${escapeHtml(record.status)}">${escapeHtml(statusLabel)}</span></div></div>${proposal ? `<div class="answer"><small>Valor na proposta</small><div>${currency(proposal.final_unit)}</div></div>` : ""}</div></section><section class="drawer-section"><h3>Respostas do briefing</h3><div class="answer-grid">${answerHtml}</div></section>${record.internal_notes ? `<section class="drawer-section"><h3>Observações internas</h3><p>${escapeHtml(record.internal_notes)}</p></section>` : ""}`;
