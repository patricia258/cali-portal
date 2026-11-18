import { CONFIG } from "/js/config.js";
import { requireAdmin, apiHeaders } from "/js/auth.js";
import { SERVICES, STATUS, labelFor, investmentContextFor } from "/js/services.js";

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

const service = SERVICES[record.service_slug], answers = record.answers || {};
document.getElementById("page-code").textContent = `${record.protocol} · ${service.code}`;
document.getElementById("page-title").textContent = record.company_name || record.contact_name;
document.getElementById("page-subtitle").textContent = `${service.title} · ${record.contact_name}`;
document.getElementById("edit-link").href = `/admin/editar.html?id=${id}`;

const DUPLICATE_IDS = new Set(["nome", "cargo", "email", "whatsapp", "empresa", "localidade"]);

function answerText(field, value) {
  if (["investimento", "budget"].includes(field.id)) return investmentContextFor(service, answers)?.label || "—";
  if (field.type === "checkbox") return value === true || value === "true" ? "Sim" : "Não";
  if (field.type === "indicator_matrix") return Array.isArray(value) && value.length ? value.join("; ") : "—";
  if (Array.isArray(value) && !value.length) return "—";
  return labelFor(field.options, value) || "—";
}

const sectionsHtml = service.sections.map((section) => {
  const sectionFields = section.fields.filter((field) => !DUPLICATE_IDS.has(field.id));
  if (!sectionFields.length) return "";
  const fieldsHtml = sectionFields.map((field) => {
    const value = answerText(field, answers[field.id]);
    const span = Array.isArray(answers[field.id]) || field.type === "textarea" || field.type === "indicator_matrix" ? 12 : (field.span || 12);
    return `<div class="answer span-${span}"><small>${escapeHtml(field.label)}</small><div>${escapeHtml(value)}</div></div>`;
  }).join("");
  return `<div class="answer-section-title">${escapeHtml(section.title)}</div><div class="answer-grid">${fieldsHtml}</div>`;
}).join("");

const statusLabel = STATUS.find((s) => s.value === record.status)?.label || record.status;

page.innerHTML = `<section class="drawer-section"><h3>Contato e empresa</h3><div class="answer-grid"><div class="answer span-6"><small>Contato</small><div>${escapeHtml(record.contact_name)}${record.contact_role ? ` · ${escapeHtml(record.contact_role)}` : ""}</div></div><div class="answer span-6"><small>E-mail</small><div>${escapeHtml(record.contact_email)}</div></div><div class="answer span-6"><small>WhatsApp</small><div>${escapeHtml(record.contact_phone || "—")}</div></div><div class="answer span-6"><small>Empresa</small><div>${escapeHtml(record.company_name || "—")}</div></div><div class="answer span-6"><small>Localidade</small><div>${escapeHtml(record.company_location || "—")}</div></div><div class="answer span-6"><small>Status atual</small><div><span class="status-chip" data-status="${escapeHtml(record.status)}">${escapeHtml(statusLabel)}</span></div></div>${proposal ? `<div class="answer span-6"><small>Valor na proposta</small><div>${currency(proposal.final_unit)}</div></div>` : ""}</div></section><section class="drawer-section"><h3>Respostas do briefing</h3>${sectionsHtml}</section>${record.internal_notes ? `<section class="drawer-section"><h3>Observações internas</h3><p>${escapeHtml(record.internal_notes)}</p></section>` : ""}`;
