import { CONFIG, functionUrl } from "/js/config.js";
import { ASSETS } from "/js/assets-data.js";
import { requireAdmin, apiHeaders, signOut } from "/js/auth.js";
import { SERVICES, flattenFields } from "/js/services.js";
import { proposalProfile } from "/js/proposal-profiles.js";
import { proposalPdfBaseName, proposalPdfFileName } from "/js/pdf-filename.js";

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
const packageInfo = service.packages?.find((p)=>p.code===proposal.package_code);
const packageLabel = packageInfo?.label || proposal.package_code;
const validity = new Date(proposal.updated_at || proposal.created_at); validity.setDate(validity.getDate() + Number(proposal.validity_days || 15));
const fields = flattenFields(service), answers = submission.answers || {};
const fieldById = (id) => fields.find((field) => field.id === id);
const legacyAnswerLabels = {
  tempo_rh: { "5a10": "5 a 10 anos" },
  momento: { novo_desafio: "Novo desafio profissional" },
  objetivos: { visao_negocio: "Visão de negócio" },
};
const readableAnswer = (id, field, value) => {
  const direct = legacyAnswerLabels[id]?.[value];
  if (direct) return direct;
  const option = field?.options?.find((item) => item.value === value)?.label;
  if (option) return option;
  return value;
};
const answerText = (id) => {
  const field = fieldById(id), value = answers[id];
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) return "";
  if (field?.type === "indicator_matrix") return Array.isArray(value) ? value.join("; ") : String(value);
  if (field?.type === "checkbox") return value ? "Sim" : "Não";
  if (Array.isArray(value)) return value.map((item) => readableAnswer(id, field, item)).join(", ");
  return readableAnswer(id, field, value);
};
const monthly = Boolean(proposal.calculator_data?.monthly || service.slug === "assessoria-estrategica" || (service.slug === "marca-empregadora" && proposal.package_code === "RECORRENTE"));
const referencePrice = Number(proposal.subtotal || proposal.calculator_data?.subtotal || proposal.final_unit || 0);
const discountValue = Math.max(0, referencePrice - Number(proposal.final_unit || 0));
const discountPct = referencePrice ? (discountValue / referencePrice) * 100 : 0;
const discountType = proposal.calculator_data?.discountType || "Condição comercial";
const discountDescription = proposal.calculator_data?.discountDescription || "";
const minimumMonths = Number(proposal.contract_months || packageInfo?.minimumMonths || 1);
const monthlyHours = Number(proposal.calculator_data?.monthlyHours || packageInfo?.suggestedHours || 0);
const profile = proposalProfile({ service, packageCode: proposal.package_code, packageLabel, answers, answerText, minimumMonths, monthlyHours });
const contextIds = profile.contextIds.filter((id) => answerText(id)).slice(0, 6);
const focusId = profile.priorityIds.find((id) => answerText(id));
const contextRows = contextIds.map((id) => `<div class="proposal-context-row"><span>${escapeHtml(profile.contextLabels[id] || fieldById(id)?.label || id)}</span><strong>${escapeHtml(answerText(id))}</strong></div>`).join("");
const focusHtml = focusId ? `<section class="proposal-focus"><span>${escapeHtml(profile.priorityLabels[focusId] || "Foco de partida")}</span><strong>${escapeHtml(answerText(focusId))}</strong></section>` : "";
const scopeItems = proposal.scope_items || [];
let scopeNumber = 0;
const scopeHtml = scopeItems.map((item) => {
  const isSubitem = /^\s*[-–—]\s*/.test(item);
  const cleanItem = item.replace(/^\s*[-–—]\s*/, "");
  if (isSubitem) return `<li class="scope-subitem"><span></span><p>${escapeHtml(cleanItem)}</p></li>`;
  scopeNumber += 1;
  return `<li class="scope-main-item"><span>${String(scopeNumber).padStart(2,"0")}</span><p>${escapeHtml(cleanItem)}</p></li>`;
}).join("");
const advantages = Array.isArray(proposal.calculator_data?.advantages) && proposal.calculator_data.advantages.length ? proposal.calculator_data.advantages : profile.advantages;
const advantagesHtml = advantages.map((item,index)=>`<div><span>${String(index+1).padStart(2,"0")}</span><p>${escapeHtml(item)}</p></div>`).join("");
const bonus = proposal.calculator_data?.bonus;
const bonusHtml = bonus?.title && bonus?.description ? `<div class="proposal-bonus"><span>Bônus escolhido</span><div><strong>${escapeHtml(bonus.title)}</strong><p>${escapeHtml(bonus.description)}</p></div></div>` : "";
const nextStepsHtml = profile.nextSteps.slice(0,3).map((step,index)=>`<div><span>${String(index+1).padStart(2,"0")}</span><strong>${escapeHtml(step[0])}</strong><p>${escapeHtml(step[1])}</p></div>`).join("");
const contractingParty = service.slug === "mentoria-rh" && answers.modalidade !== "grupo" ? submission.contact_name : (submission.company_name || submission.contact_name);
const solutionCopy = proposal.public_notes || profile.solutionCopy || packageInfo?.description || service.intro;
const firstName = String(submission.contact_name || "").trim().split(/\s+/)[0] || "Olá";
const payment = proposal.calculator_data?.payment || {};
const paymentRows = [];
if (payment.method === "monthly") {
  paymentRows.push(["Forma", "Mensal recorrente"], ["Vencimento", payment.monthlyDue || "1º dia útil de cada mês"]);
} else if (payment.method === "split") {
  const entryPct = Number(payment.entryPct || 50), finalPct = Number(payment.finalPct || 50);
  paymentRows.push([`Entrada · ${entryPct}%`, currency(Number(proposal.final_unit) * entryPct / 100)], [`Finalização · ${finalPct}%`, currency(Number(proposal.final_unit) * finalPct / 100)]);
} else if (payment.method === "pix") {
  paymentRows.push(["Forma", "PIX à vista"], ["Desconto aplicado", `${Number(payment.pixDiscount || discountPct).toLocaleString("pt-BR",{maximumFractionDigits:2})}%`]);
} else if (payment.method === "card") {
  paymentRows.push(["Parcelamento", `Até ${Number(payment.cardInstallments || 1)}x no cartão`], ["Taxas", payment.cardFees === "included" ? "Incluídas no valor final" : "Acrescidas conforme a operadora"]);
} else if (payment.method === "custom") {
  paymentRows.push(["Forma", payment.customLabel || "Condição personalizada"]);
} else {
  paymentRows.push(["Forma de pagamento", monthly ? "Mensal recorrente" : "Conforme cronograma acordado"]);
}
const paymentRowsHtml = paymentRows.map(([label,value])=>`<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
const paymentNote = String(proposal.payment_terms || "").trim();
const contractFacts = [
  ...(monthlyHours ? [["Capacidade contratada", `Até ${monthlyHours} horas por mês`]] : []),
  [monthly ? "Prazo mínimo" : "Duração prevista", `${minimumMonths} ${minimumMonths === 1 ? "mês" : "meses"}`],
  ["Natureza", monthly ? "Atuação recorrente e fracionada" : "Projeto com início e fim"],
];
const contractFactsHtml = contractFacts.map(([label,value])=>`<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
const roadmapNote = "Todas as prioridades mencionadas no briefing são analisadas por Patrícia e organizadas em um roadmap. Esta proposta apresenta o que entra primeiro, respeitando ordem, dependências e sequência de implantação. As demais não são desconsideradas: permanecem mapeadas e podem compor ciclos posteriores de entrega.";
const pdfNameData = {
  serviceName: service.title,
  contactName: submission.contact_name,
  companyName: submission.company_name,
  protocol: submission.protocol,
};
const suggestedPdfName = proposalPdfFileName(pdfNameData);
document.title = proposalPdfBaseName(pdfNameData);
root.innerHTML = `<div class="proposal-document">
  <article class="proposal-page proposal-cover-page">
    <header class="proposal-head"><div class="proposal-logo"><img src="${ASSETS.logoBordo}" alt="CALI — HR for Business"></div><div class="proposal-meta"><strong>${escapeHtml(submission.protocol)}</strong><br>${new Date(proposal.updated_at||proposal.created_at).toLocaleDateString("pt-BR")}<br>Válida até ${validity.toLocaleDateString("pt-BR")}</div></header>
    <div class="proposal-kicker">Proposta comercial · ${escapeHtml(packageLabel)}</div><h1 class="proposal-greeting">Olá, <span>${escapeHtml(firstName)}</span>,<br>sua proposta chegou!</h1>
    <div class="proposal-recipient"><span>Preparada especialmente para</span><strong>${escapeHtml(submission.contact_name)}</strong><em>${escapeHtml(submission.company_name || contractingParty)}</em></div>
    <div class="proposal-service-name">${escapeHtml(service.title)}</div>
    <section class="proposal-section"><h2>O contexto que orienta esta proposta</h2><div class="proposal-context-list">${contextRows}</div></section>
    ${focusHtml}
    <footer class="proposal-footer"><span>Patrícia Lima · People Advisory Executive</span><span>01</span></footer>
  </article>
  <article class="proposal-page proposal-detail-page">
    <header class="proposal-head"><div class="proposal-logo"><img src="${ASSETS.logoBordo}" alt="CALI — HR for Business"></div><div class="proposal-meta"><strong>${escapeHtml(packageLabel)}</strong><br>${escapeHtml(submission.company_name || submission.contact_name)}</div></header>
    <section class="proposal-section proposal-solution"><div class="proposal-kicker">A solução recomendada</div><h2>${escapeHtml(packageLabel)}</h2><p>${escapeHtml(solutionCopy)}</p></section>
    <section class="proposal-section proposal-scope-section"><h2>O que está incluído</h2><ol class="scope-list">${scopeHtml}</ol></section>
    <aside class="proposal-roadmap-note"><strong>Sobre as demais prioridades</strong><p>${escapeHtml(roadmapNote)}</p></aside>
    <section class="proposal-section proposal-value-section"><h2>Vantagens desta proposta</h2><div class="proposal-advantages">${advantagesHtml}</div>${bonusHtml}</section>
    <footer class="proposal-footer"><span>Patrícia Lima · People Advisory Executive</span><span>02</span></footer>
  </article>
  <div class="proposal-hard-break" aria-hidden="true"></div>
  <article class="proposal-page proposal-detail-page proposal-commercial-page">
    <header class="proposal-head"><div class="proposal-logo"><img src="${ASSETS.logoBordo}" alt="CALI — HR for Business"></div><div class="proposal-meta"><strong>${escapeHtml(packageLabel)}</strong><br>${escapeHtml(submission.company_name || submission.contact_name)}</div></header>
    <section class="proposal-section"><h2>Investimento</h2><div class="investment-reference"><span>${monthly ? "Mensalidade de referência" : "Investimento de referência"}</span><strong>${currency(referencePrice)}</strong></div>${discountValue ? `<div class="investment-discount"><span>${escapeHtml(discountType)}${discountDescription ? ` · ${escapeHtml(discountDescription)}` : ""}</span><strong>− ${currency(discountValue)} (${discountPct.toLocaleString("pt-BR",{maximumFractionDigits:2})}%)</strong></div>` : ""}<div class="investment"><div><div class="investment-label">${monthly ? "Mensalidade final" : "Investimento final"}</div><div class="investment-value">${currency(proposal.final_unit)}</div></div></div></section>
    <section class="proposal-commercial-summary">${contractFactsHtml}</section>
    <section class="proposal-section proposal-payment"><h2>Forma de pagamento</h2><div class="proposal-payment-grid">${paymentRowsHtml}</div>${paymentNote ? `<p class="proposal-payment-note">${escapeHtml(paymentNote)}</p>` : ""}</section>
    <section class="proposal-section proposal-conditions"><h2>Condições do trabalho</h2><ul class="condition-list">${profile.commercial.slice(0,4).map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section class="proposal-section"><h2>Fora do escopo</h2><ul class="condition-list">${profile.outOfScope.map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section class="proposal-section"><h2>Próximos passos</h2><div class="proposal-next-steps">${nextStepsHtml}</div></section>
    <section class="signature"><div class="signature-name">Patrícia Lima</div><div class="signature-role">People Advisory Executive · CALI · HR for Business</div></section>
    <footer class="proposal-footer"><span>patricia@calirh.com · +55 41 98779-1933</span><span>calirh.com · 03</span></footer>
  </article>
</div>`;

const printButton = document.getElementById("print");
printButton.title = `Salvar como ${suggestedPdfName}`;
printButton.addEventListener("click",()=>{
  document.title = proposalPdfBaseName(pdfNameData);
  window.print();
});
const drawer=document.getElementById("send-drawer"),overlay=document.getElementById("send-overlay"),fileInput=document.getElementById("pdf-file"),sendButton=document.getElementById("send-email"),feedback=document.getElementById("send-feedback");
const companyInput=document.getElementById("send-company"),recipientNameInput=document.getElementById("send-recipient-name"),recipientEmailInput=document.getElementById("send-recipient-email"),subjectPreview=document.getElementById("send-subject");
const proposalSubject=()=>`CALI RH - Olá, ${recipientNameInput.value.trim()||"Nome do decisor"}, Sua proposta chegou! 🧲 ${service.title} · ${submission.protocol}.`;
function refreshSendConfirmation(){
  subjectPreview.textContent=proposalSubject();
  const file=fileInput.files?.[0],fieldsValid=recipientNameInput.value.trim().length>=2&&recipientEmailInput.checkValidity();
  sendButton.disabled=!file||file.size>8*1024*1024||!fieldsValid;
}
function openSend(){
  companyInput.value=submission.company_name||"";
  recipientNameInput.value=submission.contact_name||"";
  recipientEmailInput.value=submission.contact_email||"";
  document.getElementById("send-to").textContent=`${service.title} · ${submission.protocol}`;
  feedback.textContent="";
  feedback.style.color="var(--vermelho)";
  refreshSendConfirmation();
  drawer.classList.add("open");overlay.classList.add("open");
}
function closeSend(){drawer.classList.remove("open");overlay.classList.remove("open")}
document.getElementById("open-send").addEventListener("click",openSend);document.getElementById("close-send").addEventListener("click",closeSend);overlay.addEventListener("click",closeSend);
[companyInput,recipientNameInput,recipientEmailInput].forEach((input)=>input.addEventListener("input",()=>{feedback.textContent="";refreshSendConfirmation()}));
fileInput.addEventListener("change",()=>{const file=fileInput.files?.[0];feedback.textContent="";if(file&&file.size>8*1024*1024)feedback.textContent="O PDF ultrapassa 8 MB.";refreshSendConfirmation()});
function fileBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]);reader.onerror=()=>reject(new Error("Não foi possível ler o PDF."));reader.readAsDataURL(file)})}
sendButton.addEventListener("click",async()=>{const file=fileInput.files?.[0];if(!file||sendButton.disabled)return;sendButton.disabled=true;sendButton.textContent="Enviando…";feedback.textContent="";try{const response=await fetch(functionUrl("portal-send-proposal"),{method:"POST",headers:apiHeaders(session),body:JSON.stringify({proposal_id:proposal.id,pdf_base64:await fileBase64(file),pdf_name:file.name,note:document.getElementById("email-note").value,company_name:companyInput.value.trim(),recipient_name:recipientNameInput.value.trim(),recipient_email:recipientEmailInput.value.trim()})});const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result.error||"Falha no envio.");feedback.style.color="var(--verde)";feedback.textContent=`Proposta enviada para ${result.to||recipientEmailInput.value.trim()} ✓`;sendButton.textContent="Enviado"}catch(error){feedback.style.color="var(--vermelho)";feedback.textContent=error instanceof Error?error.message:"Falha no envio.";sendButton.textContent="Confirmar e enviar";refreshSendConfirmation()}});
