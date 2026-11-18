import { CONFIG, functionUrl } from "/js/config.js";

const protocolo = decodeURIComponent(location.pathname.split("/").filter(Boolean).pop() || "");
const badge = document.getElementById("badge"), title = document.getElementById("title"), lead = document.getElementById("lead"), details = document.getElementById("details");
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function showFail(message) {
  badge.className = "verify-badge fail"; badge.textContent = "✕";
  title.textContent = "Documento não verificado";
  lead.textContent = message;
}

async function run() {
  if (!/^[A-Za-z0-9-]{6,80}$/.test(protocolo)) return showFail("Protocolo ausente ou inválido no link.");
  try {
    const res = await fetch(`${functionUrl("portal-verify")}?protocolo=${encodeURIComponent(protocolo)}`, { headers: { apikey: CONFIG.supabasePublishableKey } });
    const data = await res.json();
    if (!res.ok || !data.valid) return showFail("Não encontramos uma proposta CALI com este protocolo.");
    badge.className = "verify-badge ok"; badge.textContent = "✓";
    title.textContent = "Documento autêntico";
    lead.textContent = "Esta proposta foi emitida oficialmente pela CALI RH.";
    details.innerHTML = `<div class="verify-grid">
      <div class="verify-row"><span>Protocolo</span><span>${escapeHtml(data.protocol)}</span></div>
      ${data.company_name ? `<div class="verify-row"><span>Empresa</span><span>${escapeHtml(data.company_name)}</span></div>` : ""}
      <div class="verify-row"><span>Serviço</span><span>${escapeHtml(data.service_title)}</span></div>
      <div class="verify-row"><span>Emissão</span><span>${escapeHtml(data.issued_at)}</span></div>
    </div>
    <div class="verify-sign"><strong>Patrícia Lima</strong>People Advisory Executive · CALI RH</div>
    <p class="verify-foot">Em caso de dúvida sobre esta proposta, fale diretamente com patricia@calirh.com.</p>`;
  } catch {
    showFail("Não foi possível verificar este documento agora. Tente novamente em instantes.");
  }
}
run();
