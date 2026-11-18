import { CONFIG } from "/js/config.js";
import { requireAdmin, apiHeaders, signOut } from "/js/auth.js";
import { SERVICES, STATUS } from "/js/services.js";

const session = await requireAdmin();
if (!session) throw new Error("Sessão administrativa ausente.");
let submissions = [], pendingDelete = null, showArchived = false;
const tableBody = document.getElementById("table-body");

document.getElementById("admin-name").textContent = session.user.email === CONFIG.adminEmail ? "Patrícia" : session.user.email;
document.getElementById("logout").addEventListener("click", signOut);

function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]); }
const formatDate = (value) => new Date(value).toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" });
const eyeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
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
  submissions = await rest("cali_submissions?select=*&order=created_at.desc") || [];
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
    const statusSelect = `<select class="control status-inline" data-status-row="${r.id}">${STATUS.map((s) => `<option value="${s.value}" ${r.status===s.value?"selected":""}>${escapeHtml(s.label)}</option>`).join("")}</select>`;
    return `<tr><td>${formatDate(r.created_at)}<br><small>${escapeHtml(r.protocol)}</small></td><td class="company-cell"><strong>${escapeHtml(r.company_name || r.contact_name)}</strong><span>${escapeHtml(r.contact_name)} · ${escapeHtml(r.contact_email)}</span></td><td>${escapeHtml(service?.title || r.service_slug)}</td><td>${escapeHtml(r.answers?.momento_empresa || r.answers?.prazo_inicio || "—")}</td><td>${statusSelect}</td><td><div class="table-actions"><a class="table-icon-action" href="/admin/ver.html?id=${r.id}" aria-label="Ver ${escapeHtml(r.company_name || r.contact_name)}" title="Ver">${eyeIcon}</a><a class="table-icon-action" href="/admin/editar.html?id=${r.id}" aria-label="Editar ${escapeHtml(r.company_name || r.contact_name)}" title="Editar">${pencilIcon}</a>${archiveAction}</div></td></tr>`;
  }).join("");
  tableBody.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => openDeleteConfirmation(button.dataset.delete)));
  tableBody.querySelectorAll("[data-restore]").forEach((button) => button.addEventListener("click", () => restoreSubmission(button.dataset.restore)));
  tableBody.querySelectorAll("[data-status-row]").forEach((select) => select.addEventListener("change", async (event) => {
    const id = event.target.dataset.statusRow, value = event.target.value;
    event.target.disabled = true;
    try {
      await rest(`cali_submissions?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: value, updated_at: new Date().toISOString() }) });
      const row = submissions.find((item) => item.id === id); if (row) row.status = value;
      updateKpis();
    } finally { event.target.disabled = false; }
  }));
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
  const blob = new Blob(["﻿", lines.join("\n")], { type:"text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `CALI-briefings-${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
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

Object.entries(SERVICES).forEach(([slug, service]) => document.getElementById("service-filter").insertAdjacentHTML("beforeend", `<option value="${slug}">${service.title}</option>`));
STATUS.forEach((status) => document.getElementById("status-filter").insertAdjacentHTML("beforeend", `<option value="${status.value}">${status.label}</option>`));
["search","service-filter","status-filter"].forEach((id) => document.getElementById(id).addEventListener("input", render));
document.getElementById("clear").addEventListener("click", () => { document.getElementById("search").value=""; document.getElementById("service-filter").value=""; document.getElementById("status-filter").value=""; render(); });
document.getElementById("refresh").addEventListener("click", load);
document.getElementById("export-csv").addEventListener("click", exportCsv);
document.getElementById("archive-filter").addEventListener("click", () => { showArchived = !showArchived; document.getElementById("archive-filter").textContent = showArchived ? "Ver ativos" : "Ver arquivados"; render(); });
document.getElementById("cancel-delete").addEventListener("click", closeDeleteConfirmation);
document.getElementById("delete-overlay").addEventListener("click", (event) => { if (event.target.id === "delete-overlay") closeDeleteConfirmation(); });
document.getElementById("confirm-delete").addEventListener("click", deleteSubmission);
await load();
