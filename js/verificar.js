import { CONFIG, functionUrl } from "/js/config.js";

const protocolo = decodeURIComponent(location.pathname.split("/").filter(Boolean).pop() || "");
const centro = document.getElementById("centro");
const auth = document.getElementById("auth");
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const dataHora = (iso) => new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

function naoEncontrado() {
  centro.innerHTML = `<div class="av-fim"><h1>Documento não encontrado</h1><p>Confira o protocolo impresso no documento.</p></div>`;
}

async function run() {
  if (!/^[A-Za-z0-9-]{6,80}$/.test(protocolo)) return naoEncontrado();
  try {
    const res = await fetch(`${functionUrl("portal-verify")}?protocolo=${encodeURIComponent(protocolo)}`, { headers: { apikey: CONFIG.supabasePublishableKey } });
    const data = res.ok ? await res.json() : null;
    if (!data) return naoEncontrado();
    centro.innerHTML = `<div class="av-fim"><h1>Documento autêntico</h1><p>${[escapeHtml(data.titulo), escapeHtml(data.cliente)].filter(Boolean).join(" · ")}</p></div>`;
    document.getElementById("auth-responsavel").textContent = `${data.signatario_nome}, ${data.signatario_cargo}`;
    document.getElementById("auth-emitido").textContent = dataHora(data.emitido_em);
    document.getElementById("auth-protocolo").textContent = data.protocolo;
    document.getElementById("auth-hash").textContent = String(data.hash || "").slice(0, 32);
    auth.classList.remove("hidden");
  } catch {
    naoEncontrado();
  }
}
run();
