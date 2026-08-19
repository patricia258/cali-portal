import { CONFIG, functionUrl } from "/js/config.js";
import { ASSETS } from "/js/assets-data.js";
import { requireAdmin, apiHeaders, signOut } from "/js/auth.js";
import { SERVICES } from "/js/services.js";

const session = await requireAdmin();
if (!session) throw new Error("Sessão ausente.");
const proposalId = new URLSearchParams(location.search).get("id") || location.pathname.split("/").filter(Boolean).pop();
const root = document.getElementById("proposal-root");
const currency = (v) => Number(v || 0).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);

async function rest(path, options={}) {
  const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${path}`,{...options,headers:apiHeaders(session,options.headers||{})});
  if(response.status===401||response.status===403){await signOut();return null} if(!response.ok)throw new Error(await response.text()); return response.status===204?null:response.json();
}

const data = await rest(`cali_proposals?id=eq.${proposalId}&select=*,submission:cali_submissions(*)`);
const proposal = data?.[0], submission = proposal?.submission, service = proposal ? SERVICES[proposal.service_slug] : null;
if (!proposal || !submission || !service) { root.innerHTML='<div class="empty">Proposta não encontrada.</div>'; throw new Error("Proposta não encontrada"); }
const packageLabel = service.packages?.find((p)=>p.code===proposal.package_code)?.label || proposal.package_code;
const validity = new Date(proposal.updated_at || proposal.created_at); validity.setDate(validity.getDate() + Number(proposal.validity_days || 15));
document.title = `Proposta ${service.title} · ${submission.company_name} · CALI`;
root.innerHTML = `<article class="proposal-page"><header class="proposal-head"><div class="proposal-logo"><img src="${ASSETS.logoBordo}" alt="CALI — HR for Business"></div><div class="proposal-meta"><strong>${escapeHtml(submission.protocol)}</strong><br>${new Date(proposal.updated_at||proposal.created_at).toLocaleDateString("pt-BR")}<br>Válida até ${validity.toLocaleDateString("pt-BR")}</div></header><div class="proposal-kicker">Proposta comercial · ${escapeHtml(packageLabel)}</div><h1>${escapeHtml(service.title)}</h1><p class="proposal-lead">${escapeHtml(submission.contact_name)}, esta proposta foi construída a partir do contexto compartilhado pela ${escapeHtml(submission.company_name || "empresa")} e da leitura técnica da CALI.</p><section class="proposal-section"><h2>O movimento proposto</h2><p>${escapeHtml(proposal.public_notes || service.intro)}</p></section><section class="proposal-section"><h2>Escopo incluído</h2><ul class="scope-list">${(proposal.scope_items||[]).map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul></section><section class="proposal-section"><h2>Investimento</h2><div class="investment"><div><div class="investment-label">${proposal.calculator_data?.monthly?"Investimento mensal":"Investimento total"}</div><div class="investment-value">${currency(proposal.final_unit)}</div></div>${proposal.calculator_data?.monthly?`<div><div class="investment-label">Contrato de ${proposal.contract_months} meses</div><div style="font-weight:800">${currency(proposal.total_value)}</div></div>`:""}</div><p>${escapeHtml(proposal.payment_terms || "Pagamento conforme cronograma definido.")}</p></section><section class="signature"><div class="signature-name">Patrícia Lima</div><div class="signature-role">People Advisory Executive · CALI — HR for Business</div></section><footer class="proposal-footer"><span>patricia@calirh.com · +55 41 98779-1933</span><span>calirh.com</span></footer></article>`;

document.getElementById("print").addEventListener("click",()=>window.print());
const drawer=document.getElementById("send-drawer"),overlay=document.getElementById("send-overlay"),fileInput=document.getElementById("pdf-file"),sendButton=document.getElementById("send-email"),feedback=document.getElementById("send-feedback");
function openSend(){document.getElementById("send-to").textContent=`${submission.contact_name} <${submission.contact_email}>`;drawer.classList.add("open");overlay.classList.add("open")}
function closeSend(){drawer.classList.remove("open");overlay.classList.remove("open")}
document.getElementById("open-send").addEventListener("click",openSend);document.getElementById("close-send").addEventListener("click",closeSend);overlay.addEventListener("click",closeSend);
fileInput.addEventListener("change",()=>{const file=fileInput.files?.[0];feedback.textContent="";sendButton.disabled=!file;if(file&&file.size>8*1024*1024){feedback.textContent="O PDF ultrapassa 8 MB.";sendButton.disabled=true}});
function fileBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]);reader.onerror=()=>reject(new Error("Não foi possível ler o PDF."));reader.readAsDataURL(file)})}
sendButton.addEventListener("click",async()=>{const file=fileInput.files?.[0];if(!file)return;sendButton.disabled=true;sendButton.textContent="Enviando…";feedback.textContent="";try{const response=await fetch(functionUrl("portal-send-proposal"),{method:"POST",headers:apiHeaders(session),body:JSON.stringify({proposal_id:proposal.id,pdf_base64:await fileBase64(file),pdf_name:file.name,note:document.getElementById("email-note").value})});const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result.error||"Falha no envio.");feedback.style.color="var(--verde)";feedback.textContent=`Enviado para ${submission.contact_email} ✓`;sendButton.textContent="Enviado"}catch(error){feedback.textContent=error instanceof Error?error.message:"Falha no envio.";sendButton.disabled=false;sendButton.textContent="Confirmar envio"}});
