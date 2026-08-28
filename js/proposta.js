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
const list = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
const linesHtml = (items, className="proposal-simple-list") => `<ul class="${className}">${list(items).map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

async function rest(path, options={}) {
  const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${path}`,{...options,headers:apiHeaders(session,options.headers||{})});
  if(response.status===401||response.status===403){await signOut();return null}
  if(!response.ok)throw new Error(await response.text());
  return response.status===204?null:response.json();
}
async function optionalRest(path) {
  try { const response=await fetch(`${CONFIG.supabaseUrl}/rest/v1/${path}`,{headers:apiHeaders(session)}); return response.ok ? response.json() : []; }
  catch { return []; }
}

const data = await rest(`cali_proposals?id=eq.${proposalId}&select=*,submission:cali_submissions(*)`);
const proposal = data?.[0], submission = proposal?.submission, service = proposal ? SERVICES[proposal.service_slug] : null;
if (!proposal || !submission || !service) { root.innerHTML='<div class="empty">Proposta não encontrada.</div>'; throw new Error("Proposta não encontrada"); }
const packageInfo = service.packages?.find((p)=>p.code===proposal.package_code);
const packageLabel = packageInfo?.label || proposal.package_code;
const validity = new Date(proposal.updated_at || proposal.created_at); validity.setDate(validity.getDate() + Number(proposal.validity_days || 15));
const fields = flattenFields(service), answers = submission.answers || {};
const fieldById = (id) => fields.find((field) => field.id === id);
const legacyAnswerLabels = { tempo_rh:{"5a10":"5 a 10 anos"}, momento:{novo_desafio:"Novo desafio profissional"}, objetivos:{visao_negocio:"Visão de negócio"} };
const readableAnswer = (field, value, id="") => legacyAnswerLabels[id]?.[value] || field?.options?.find((item) => item.value === value)?.label || value;
const answerText = (id) => {
  const field = fieldById(id), value = answers[id];
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) return "";
  if (field?.type === "indicator_matrix") return Array.isArray(value) ? value.join("; ") : String(value);
  if (field?.type === "checkbox") return value ? "Sim" : "Não";
  if (Array.isArray(value)) return value.map((item) => readableAnswer(field, item, id)).join(", ");
  return readableAnswer(field, value, id);
};
const calc = proposal.calculator_data || {};
const monthly = Boolean(calc.monthly || service.slug === "assessoria-estrategica" || (service.slug === "marca-empregadora" && proposal.package_code === "RECORRENTE"));
const referencePrice = Number(proposal.subtotal || calc.subtotal || proposal.final_unit || 0);
const discountValue = Math.max(0, referencePrice - Number(proposal.final_unit || 0));
const discountPct = referencePrice ? (discountValue / referencePrice) * 100 : 0;
const minimumMonths = Number(proposal.contract_months || packageInfo?.minimumMonths || 1);
const monthlyHours = Number(calc.monthlyHours || packageInfo?.suggestedHours || 0);
const profile = proposalProfile({ service, packageCode: proposal.package_code, packageLabel, answers, answerText, minimumMonths, monthlyHours });
const firstName = String(submission.contact_name || "").trim().split(/\s+/)[0] || "Olá";

function defaultContextNarrative() {
  const company = submission.company_name || "A empresa";
  if (service.slug === "assessoria-estrategica") {
    const moment=answerText("momento_empresa"), people=answerText("colaboradores"), rh=answerText("rh_interno"), senior=answerText("lideranca_rh"), challenge=answerText("principal_desafio");
    return `${company} descreveu seu momento atual como ${String(moment || "uma etapa que exige organização").toLowerCase()}${people ? ` e informou uma estrutura de aproximadamente ${people} colaboradores` : ""}. ${rh ? `Sobre a estrutura atual de RH, o briefing registra: ${rh}.` : ""}${senior ? ` Em relação à liderança sênior de RH: ${senior}.` : ""}${challenge ? ` O desafio central compartilhado foi: ${challenge}.` : ""} Esta proposta transforma essas informações em uma sequência de trabalho compatível com a capacidade real de implantação.`;
  }
  const readings=profile.contextIds.slice(0,5).map((id)=>answerText(id)?`${String(profile.contextLabels[id]||fieldById(id)?.label||id).toLowerCase()}: ${answerText(id)}`:"").filter(Boolean);
  return `${company} compartilhou um contexto que reúne ${readings.join("; ") || "necessidades que pedem organização, direção e uma sequência viável de implantação"}. Esta proposta parte do briefing recebido e considera as decisões que precisam ser sustentadas pela liderança.`;
}
const contextSummary = calc.contextSummary || defaultContextNarrative();
const briefingPriorities = [answerText(profile.priorityIds[0]), ...list(answers.frentes).map((value)=>readableAnswer(fieldById("frentes"),value,"frentes"))].filter(Boolean);
const painPoints = list(calc.painPoints).length ? calc.painPoints : (briefingPriorities.length ? briefingPriorities.slice(0,4) : profile.priorityIds.map((id)=>answerText(id)).filter(Boolean).slice(0,4));
const executiveReading = calc.executiveReading || "A leitura inicial indica que o trabalho deve começar pelas prioridades que criam base para as demais necessidades avançarem com consistência.";
const solutionCopy = proposal.public_notes || profile.solutionCopy || packageInfo?.description || service.intro;
const whyNow = calc.whyNow || "A recomendação concentra energia no que precisa avançar agora, com critérios claros e uma condução compatível com a capacidade real de implantação da empresa.";
const cycleObjective = calc.cycleObjective || "Transformar a prioridade central em decisões, responsáveis e movimentos aplicáveis ao negócio.";
const expectedResults = list(calc.expectedResults).length ? calc.expectedResults : ["Prioridades organizadas e compreendidas pela liderança", "Decisões apoiadas por critérios mais claros", "Próximos movimentos registrados em roadmap"];
const concreteAdvantages = [
  "Mais de 15 anos de experiência em Recursos Humanos e atuação em mais de 110 empresas, aplicados à leitura de riscos, dependências e prioridades deste contexto.",
  "Condução direta por Patrícia Lima, com repertório de diretoria e CHRO, sem repasses ou camadas intermediárias.",
  profile.advantages?.[0] || "Método conectado ao negócio, com decisões, responsáveis e próximos movimentos claramente organizados.",
];
const advantages = Number(calc.editorialVersion || 0) >= 2 && list(calc.advantages).length ? calc.advantages : concreteAdvantages;
const roadmapItems = list(calc.roadmapItems), cycles = list(calc.cycles);
const cadence = list(calc.cadence).length ? calc.cadence : profile.operating.filter((item)=>!/(carga|\bhoras?\b|cumulativ|investimento)/i.test(item));
const caliResponsibilities = list(calc.caliResponsibilities).length ? calc.caliResponsibilities : ["Conduzir as análises, encontros e devolutivas previstos no escopo.","Organizar decisões, responsáveis e próximos movimentos."];
const clientResponsibilities = list(calc.clientResponsibilities).length ? calc.clientResponsibilities : ["Disponibilizar dados, pessoas e aprovações necessários ao trabalho.","Designar responsáveis internos e participar dos checkpoints acordados."];
const outOfScope = list(calc.outOfScope).length ? calc.outOfScope : profile.outOfScope;
const roadmapNote = "Todas as prioridades mencionadas são analisadas por Patrícia e organizadas em um roadmap. A proposta apresenta o que entra primeiro, respeitando dependências e sequência de implantação. As demais não são desconsideradas: permanecem mapeadas e podem compor ciclos posteriores de entrega.";

const mean = (values) => { const valid=(values||[]).filter((value)=>value!==null&&value!==undefined); return valid.length?valid.reduce((sum,value)=>sum+Number(value),0)/valid.length:0; };
function mapFromRow(row) {
  if (row?.diagnostico_v2?.version !== 2) return null;
  const d=row.diagnostico_v2, esc10=(value)=>Number(value||0)*2;
  const d1=mean([esc10(mean(d.d1.processos)),esc10(mean(d.d1.estrutura)),esc10(mean(d.d1.governanca))]);
  const d2=mean([esc10(mean(d.d2.comportamento)),esc10(d.d2.valores?.cultura_decisao),esc10(mean(d.d2.desenvolvimento))]);
  const d3=mean([esc10(mean(d.d3.indicadores)),esc10(mean(d.d3.decisao)),esc10(mean(d.d3.tecnologia))]);
  const d4=mean([esc10(mean(d.d4.tamanho)),esc10(d.d4.vinculos?.gestao),esc10(mean(d.d4.rotatividade))]);
  const score=d1*.25+d2*.30+d3*.20+d4*.25,maturity=mean([d1,d2,d3]);
  return {include:true,score:Number(score.toFixed(1)),quadrant:maturity<5?(d4<5?"Embrionário":"Frágil"):(d4<5?"Em Estruturação":"Estratégico")};
}
let mapaPeople = Object.prototype.hasOwnProperty.call(calc,"mapaPeople") ? calc.mapaPeople : null;
if (!Object.prototype.hasOwnProperty.call(calc,"mapaPeople")) {
  const email = encodeURIComponent(String(submission.contact_email || "").trim().toLowerCase());
  const rows = await optionalRest(`mapa_respostas?c_email=ilike.${email}&select=id,protocolo,created_at,diagnostico_v2&order=created_at.desc&limit=1`);
  mapaPeople = mapFromRow(rows?.[0]);
}
const quadrantClass = {"Embrionário":"embrionario","Frágil":"fragil","Em Estruturação":"estruturacao","Estratégico":"estrategico"}[mapaPeople?.quadrant] || "fragil";
const mapHtml = mapaPeople?.include && Number(mapaPeople.score) > 0 ? `<aside class="proposal-map-result"><div><span>Resultado do Mapa de People</span><strong>${Number(mapaPeople.score).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})}<small>/10</small></strong></div><div class="map-quadrant ${quadrantClass}"><span>Quadrante atual</span><strong>${escapeHtml(mapaPeople.quadrant)}</strong></div></aside>` : "";

let scopeNumber=0;
const scopeGroups=[];
for (const raw of list(proposal.scope_items)) {
  const isSub=/^\s*[-–—]\s*/.test(raw), text=String(raw).replace(/^\s*[-–—]\s*/,"");
  if (isSub && scopeGroups.length) scopeGroups.at(-1).subitems.push(text);
  else { scopeNumber+=1; scopeGroups.push({number:scopeNumber,text,subitems:[]}); }
}
const scopeChunks=[];
for(let i=0;i<scopeGroups.length;i+=5) scopeChunks.push(scopeGroups.slice(i,i+5));
if(!scopeChunks.length) scopeChunks.push([]);
const scopeChunkHtml=(chunk)=>`<ol class="proposal-scope-list">${chunk.map((item)=>`<li><span>${String(item.number).padStart(2,"0")}</span><div><strong>${escapeHtml(item.text)}</strong>${item.subitems.length?linesHtml(item.subitems,"proposal-subitems"):""}</div></li>`).join("")}</ol>`;
const cycleChunks=[];
for(let i=0;i<cycles.length;i+=3) cycleChunks.push(cycles.slice(i,i+3));

const payment = calc.payment || {}, paymentRows=[];
if(payment.method==="monthly") paymentRows.push(["Forma","Mensal recorrente"],["Vencimento",payment.monthlyDue||"1º dia útil de cada mês"]);
else if(payment.method==="split"){const a=Number(payment.entryPct||50),b=Number(payment.finalPct||50);paymentRows.push([`Entrada · ${a}%`,currency(Number(proposal.final_unit)*a/100)],[`Finalização · ${b}%`,currency(Number(proposal.final_unit)*b/100)]);}
else if(payment.method==="pix") paymentRows.push(["Forma","PIX à vista"],["Desconto aplicado",`${Number(payment.pixDiscount||discountPct).toLocaleString("pt-BR",{maximumFractionDigits:2})}%`]);
else if(payment.method==="card") paymentRows.push(["Parcelamento",`Até ${Number(payment.cardInstallments||1)}x no cartão`],["Taxas",payment.cardFees==="included"?"Incluídas no valor final":"Acrescidas conforme a operadora"]);
else paymentRows.push(["Forma",payment.customLabel || (monthly?"Mensal recorrente":"Conforme cronograma acordado")]);
const paymentRowsHtml=paymentRows.map(([label,value])=>`<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
const bonus=calc.bonus;
const bonusHtml=bonus?.title&&bonus?.description?`<aside class="proposal-bonus"><span>Bônus selecionado</span><div><strong>${escapeHtml(bonus.title)}</strong><p>${escapeHtml(bonus.description)}</p></div></aside>`:"";
const nextStepsHtml=profile.nextSteps.slice(0,3).map((step,index)=>`<div><span>${String(index+1).padStart(2,"0")}</span><strong>${escapeHtml(step[0])}</strong><p>${escapeHtml(step[1])}</p></div>`).join("");
const whatsText=encodeURIComponent(`Olá, Patrícia! Aqui é ${submission.contact_name || ""}, da ${submission.company_name || ""}. Analisei a proposta ${packageLabel} (${submission.protocol}) e gostaria de conversar sobre ela.`);
const whatsappUrl=`https://wa.me/5541987791933?text=${whatsText}`;

const pages=[];
const header=()=>`<header class="proposal-head"><img src="${ASSETS.logoBordo}" alt="CALI — HR for Business"><div><strong>${escapeHtml(submission.protocol)}</strong><span>${new Date(proposal.updated_at||proposal.created_at).toLocaleDateString("pt-BR")} · válida até ${validity.toLocaleDateString("pt-BR")}</span></div></header>`;
const addPage=(role,content,classes="")=>pages.push({role,content,classes});
addPage("Contexto",`<div class="proposal-kicker">Proposta preparada para</div><h1 class="proposal-greeting">Olá, <span>${escapeHtml(firstName)}</span>.<br>Sua proposta chegou.</h1><div class="proposal-client"><span>Empresa</span><strong>${escapeHtml(submission.company_name||"Não informada")}</strong></div><section class="proposal-section"><div class="section-label">01 · O ponto de partida</div><h2>O que entendemos</h2><p class="proposal-lead">${escapeHtml(contextSummary)}</p></section>${painPoints.length?`<section class="proposal-section"><h3>Dores iniciais</h3>${linesHtml(painPoints,"proposal-pain-list")}</section>`:""}${mapHtml}<aside class="proposal-reading"><span>Leitura estratégica</span><p>${escapeHtml(executiveReading)}</p></aside>`,`proposal-context-page`);
addPage("Solução",`<div class="proposal-kicker">Solução recomendada</div><h1>${escapeHtml(packageLabel)}</h1><p class="proposal-service-label">${escapeHtml(service.title)}</p><section class="proposal-section proposal-solution-intro"><p class="proposal-lead">${escapeHtml(solutionCopy)}</p></section><div class="proposal-solution-grid"><section><span>Por que agora</span><p>${escapeHtml(whyNow)}</p></section><section><span>Objetivo do ciclo</span><p>${escapeHtml(cycleObjective)}</p></section></div><section class="proposal-section"><h2>O que este trabalho deve colocar em movimento</h2>${linesHtml(expectedResults,"proposal-result-list")}</section><section class="proposal-section"><h2>Por que a CALI neste contexto</h2><div class="proposal-advantage-grid">${advantages.map((item,index)=>`<div><span>${String(index+1).padStart(2,"0")}</span><p>${escapeHtml(item)}</p></div>`).join("")}</div></section>`,`proposal-solution-page`);
scopeChunks.forEach((chunk,index)=>addPage("Entrega",`<div class="proposal-kicker">Escopo contratado</div><h1>${index?"Continuação do escopo":"Escopo incluído"}</h1><p class="proposal-page-intro">As entregas abaixo seguem exatamente a ordem definida para esta proposta.</p>${scopeChunkHtml(chunk)}${index===scopeChunks.length-1?`<section class="proposal-section proposal-working"><h2>Cadência</h2>${linesHtml(cadence,"proposal-simple-list")}</section><section class="proposal-section"><h2>Responsabilidades</h2><div class="proposal-responsibility-grid"><div><span>A CALI conduz</span>${linesHtml(caliResponsibilities,"proposal-simple-list")}</div><div><span>O cliente fornece</span>${linesHtml(clientResponsibilities,"proposal-simple-list")}</div></div></section><aside class="proposal-roadmap-note"><strong>Roadmap posterior</strong><p>${escapeHtml(roadmapNote)}</p>${roadmapItems.length?linesHtml(roadmapItems,"proposal-roadmap-list"):""}</aside>`:""}`,`proposal-delivery-page`));
cycleChunks.forEach((chunk,index)=>addPage("Ciclos",`<div class="proposal-kicker">Sequência de implantação</div><h1>${index?"Continuação dos ciclos":"Ciclos e fases previstos"}</h1><div class="proposal-cycle-list">${chunk.map((cycle,cycleIndex)=>`<section><span>${String(index*3+cycleIndex+1).padStart(2,"0")}</span><div><h2>${escapeHtml(cycle.title)}</h2>${cycle.focus?`<strong>${escapeHtml(cycle.focus)}</strong>`:""}${cycle.objective?`<p>${escapeHtml(cycle.objective)}</p>`:""}${cycle.duration?`<small>${escapeHtml(cycle.duration)}</small>`:""}</div></section>`).join("")}</div>`,`proposal-cycles-page`));
addPage("Investimento",`<div class="proposal-kicker">Condições comerciais</div><h1>Investimento e próximos passos</h1><section class="proposal-investment"><div><span>${monthly?"Mensalidade de referência":"Investimento de referência"}</span><strong>${currency(referencePrice)}</strong></div>${discountValue?`<div class="proposal-discount"><span>${escapeHtml(calc.discountType||"Condição comercial")}${calc.discountDescription?` · ${escapeHtml(calc.discountDescription)}`:""}</span><strong>− ${currency(discountValue)}</strong></div>`:""}<div class="proposal-final-price"><span>${monthly?"Mensalidade final":"Investimento final"}</span><strong>${currency(proposal.final_unit)}</strong></div></section><div class="proposal-commercial-facts">${monthlyHours?`<div><span>Capacidade</span><strong>Até ${monthlyHours} horas por mês</strong></div>`:""}<div><span>${monthly?"Prazo mínimo":"Duração prevista"}</span><strong>${minimumMonths} ${minimumMonths===1?"mês":"meses"}</strong></div><div><span>Natureza</span><strong>${monthly?"Atuação recorrente e fracionada":"Projeto com início e fim"}</strong></div></div><section class="proposal-section"><h2>Forma de pagamento</h2><div class="proposal-payment-grid">${paymentRowsHtml}</div>${proposal.payment_terms?`<p class="proposal-payment-note">${escapeHtml(proposal.payment_terms)}</p>`:""}</section><section class="proposal-section"><h2>Fora do escopo</h2>${linesHtml(outOfScope,"proposal-out-list")}</section>${bonusHtml}<section class="proposal-section"><h2>Próximos passos</h2><div class="proposal-next-steps">${nextStepsHtml}</div></section><div class="proposal-closing"><section class="signature"><div class="signature-name">Patrícia Lima</div><div class="signature-role">People Advisory Executive · CALI RH</div></section><a class="proposal-whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener">Vamos conversar sobre a proposta?</a></div>`,`proposal-commercial-page`);

root.innerHTML=`<div class="proposal-document">${pages.map((page,index)=>`<article class="proposal-page ${page.classes}">${header()}<main>${page.content}</main><footer class="proposal-footer"><span>Patrícia Lima · CALI RH · patricia@calirh.com</span><span>${String(index+1).padStart(2,"0")} / ${String(pages.length).padStart(2,"0")}</span></footer></article>`).join("")}</div>`;

function pageOverflows(page) {
  const main=page.querySelector("main"), footer=page.querySelector(".proposal-footer");
  if (!main || !footer) return false;
  return main.getBoundingClientRect().bottom > footer.getBoundingClientRect().top - 14;
}
function continuationPage(source, moved) {
  const next=document.createElement("article");
  next.className=`proposal-page ${[...source.classList].filter((name)=>name!=="proposal-page"&&name!=="proposal-continuation").join(" ")} proposal-continuation`;
  next.innerHTML=`${source.querySelector(".proposal-head").outerHTML}<main><div class="proposal-kicker">Continuação</div></main>${source.querySelector(".proposal-footer").outerHTML}`;
  moved.forEach((node)=>next.querySelector("main").append(node));
  source.after(next);
  return next;
}
async function paginateProposal() {
  root.classList.add("proposal-paginating");
  if (document.fonts?.ready) await document.fonts.ready;
  await new Promise((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  let index=0, guard=0;
  while (index < document.querySelectorAll(".proposal-page").length && guard < 80) {
    guard+=1;
    const page=document.querySelectorAll(".proposal-page")[index];
    if (!pageOverflows(page)) { index+=1; continue; }
    const main=page.querySelector("main"), moved=[];
    while (pageOverflows(page) && main.children.length > 2) { const child=main.lastElementChild; child.remove(); moved.unshift(child); }
    if (!moved.length || pageOverflows(page)) {
      page.classList.add("proposal-page-flow");
      page.dataset.paginationWarning="Um bloco de texto ultrapassou uma página e seguirá o fluxo natural de impressão.";
      index+=1;
      continue;
    }
    continuationPage(page,moved);
    index+=1;
  }
  const renderedPages=[...document.querySelectorAll(".proposal-page")];
  renderedPages.forEach((page,pageIndex)=>{
    const counter=page.querySelector(".proposal-footer span:last-child");
    if(counter) counter.textContent=`${String(pageIndex+1).padStart(2,"0")} / ${String(renderedPages.length).padStart(2,"0")}`;
  });
  root.classList.remove("proposal-paginating");
}
await paginateProposal();

const pdfNameData={serviceName:service.title,contactName:submission.contact_name,companyName:submission.company_name,protocol:submission.protocol};
const suggestedPdfName=proposalPdfFileName(pdfNameData);
document.title=proposalPdfBaseName(pdfNameData);
const printButton=document.getElementById("print");
printButton.title=`Salvar como ${suggestedPdfName}`;
printButton.addEventListener("click",()=>{document.title=proposalPdfBaseName(pdfNameData);window.print();});

// O fluxo de envio permanece independente do desenho editorial do PDF.
const drawer=document.getElementById("send-drawer"),overlay=document.getElementById("send-overlay"),fileInput=document.getElementById("pdf-file"),sendButton=document.getElementById("send-email"),feedback=document.getElementById("send-feedback");
const companyInput=document.getElementById("send-company"),recipientNameInput=document.getElementById("send-recipient-name"),recipientEmailInput=document.getElementById("send-recipient-email"),subjectPreview=document.getElementById("send-subject");
const proposalSubject=()=>`CALI RH - Olá, ${recipientNameInput.value.trim()||"Nome do decisor"}, Sua proposta chegou! 🧲 ${service.title} · ${submission.protocol}.`;
function refreshSendConfirmation(){subjectPreview.textContent=proposalSubject();const file=fileInput.files?.[0],fieldsValid=recipientNameInput.value.trim().length>=2&&recipientEmailInput.checkValidity();sendButton.disabled=!file||file.size>8*1024*1024||!fieldsValid;}
function openSend(){companyInput.value=submission.company_name||"";recipientNameInput.value=submission.contact_name||"";recipientEmailInput.value=submission.contact_email||"";document.getElementById("send-to").textContent=`${service.title} · ${submission.protocol}`;feedback.textContent="";feedback.style.color="var(--vermelho)";refreshSendConfirmation();drawer.classList.add("open");overlay.classList.add("open");}
function closeSend(){drawer.classList.remove("open");overlay.classList.remove("open")}
document.getElementById("open-send").addEventListener("click",openSend);document.getElementById("close-send").addEventListener("click",closeSend);overlay.addEventListener("click",closeSend);
[companyInput,recipientNameInput,recipientEmailInput].forEach((input)=>input.addEventListener("input",()=>{feedback.textContent="";refreshSendConfirmation()}));
fileInput.addEventListener("change",()=>{const file=fileInput.files?.[0];feedback.textContent="";if(file&&file.size>8*1024*1024)feedback.textContent="O PDF ultrapassa 8 MB.";refreshSendConfirmation()});
function fileBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]);reader.onerror=()=>reject(new Error("Não foi possível ler o PDF."));reader.readAsDataURL(file)})}
sendButton.addEventListener("click",async()=>{const file=fileInput.files?.[0];if(!file||sendButton.disabled)return;sendButton.disabled=true;sendButton.textContent="Enviando…";feedback.textContent="";try{const response=await fetch(functionUrl("portal-send-proposal"),{method:"POST",headers:apiHeaders(session),body:JSON.stringify({proposal_id:proposal.id,pdf_base64:await fileBase64(file),pdf_name:file.name,note:document.getElementById("email-note").value,company_name:companyInput.value.trim(),recipient_name:recipientNameInput.value.trim(),recipient_email:recipientEmailInput.value.trim()})});const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result.error||"Falha no envio.");feedback.style.color="var(--verde)";feedback.textContent=`Proposta enviada para ${result.to||recipientEmailInput.value.trim()} ✓`;sendButton.textContent="Enviado"}catch(error){feedback.style.color="var(--vermelho)";feedback.textContent=error instanceof Error?error.message:"Falha no envio.";sendButton.textContent="Confirmar e enviar";refreshSendConfirmation()}});
