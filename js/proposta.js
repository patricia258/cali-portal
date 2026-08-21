import { CONFIG, functionUrl } from "/js/config.js";
import { ASSETS } from "/js/assets-data.js";
import { requireAdmin, apiHeaders, signOut } from "/js/auth.js";
import { SERVICES, flattenFields, labelFor } from "/js/services.js";

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
const answerText = (id) => {
  const field = fieldById(id), value = answers[id];
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) return "";
  if (field?.type === "indicator_matrix") return Array.isArray(value) ? value.join("; ") : String(value);
  if (field?.type === "checkbox") return value ? "Sim" : "Não";
  return labelFor(field?.options, value);
};
const firstAvailable = (ids) => ids.find((id) => answerText(id));
const contextIds = ["momento_empresa","modelo_trabalho","colaboradores","unidades","localidade",firstAvailable(["modelo_interesse","modalidade","modelo_contratacao"]),firstAvailable(["prazo_inicio","data_desejada"]),firstAvailable(["presencial","formato","formato_entrevistas"])].filter(Boolean);
const priorityIds = ["frentes","principal_desafio","uso_resultado","objetivo","objetivo_grupo","problemas","situacoes","contexto","principal_gap","observacoes"].filter((id) => answerText(id)).slice(0,3);
const contextCards = contextIds.map((id) => `<div class="proposal-context-card"><span>${escapeHtml(fieldById(id)?.label || id)}</span><strong>${escapeHtml(answerText(id))}</strong></div>`).join("");
const priorities = priorityIds.map((id) => `<div class="proposal-priority"><span>${escapeHtml(fieldById(id)?.label || id)}</span><p>${escapeHtml(answerText(id))}</p></div>`).join("");
const monthly = Boolean(proposal.calculator_data?.monthly || service.slug === "assessoria-estrategica" || (service.slug === "marca-empregadora" && proposal.package_code === "RECORRENTE"));
const referencePrice = Number(proposal.subtotal || proposal.calculator_data?.subtotal || proposal.final_unit || 0);
const discountValue = Math.max(0, referencePrice - Number(proposal.final_unit || 0));
const discountPct = referencePrice ? (discountValue / referencePrice) * 100 : 0;
const discountType = proposal.calculator_data?.discountType || "Condição comercial";
const discountDescription = proposal.calculator_data?.discountDescription || "";
const minimumMonths = Number(proposal.contract_months || packageInfo?.minimumMonths || 1);
const monthlyHours = Number(proposal.calculator_data?.monthlyHours || packageInfo?.suggestedHours || 0);
function packageConditions() {
  if (service.slug === "assessoria-estrategica" && proposal.package_code === "PARTNER") return [`Carga mensal contratada de ${monthlyHours} horas.`,"Atuação estratégica 100% online. Visita presencial sob demanda, precificada separadamente.","Encontro mensal com founders, diretoria ou liderança de RH.","Leitura mensal de indicadores e apoio a decisões críticas.","Até 1 ajuste ou desenho de política ou processo por mês, não cumulativo.","Direção estratégica, orientação a DP sem execução, DHO e decisões pontuais de estrutura, promoção ou desligamento.",`Contrato mínimo de ${minimumMonths} meses, com renovação automática. Após o período mínimo, passa a vigorar por prazo indeterminado.`,"Reajuste a cada 12 meses e cancelamento mediante aviso prévio de 30 dias."];
  if (service.slug === "assessoria-estrategica" && proposal.package_code === "FULL") return [`Carga mensal contratada de ${monthlyHours} horas.`,"Acompanhamento estratégico de maior proximidade, com encontros quinzenais.","Uma visita presencial fixa por mês incluída.","Indicadores, projeções e cruzamentos de maior complexidade.","Até 2 ajustes de processo ou fluxo por mês, ou 1 projeto ou treinamento estrutural maior por trimestre.","Inclui Partner, Cargos e Salários, People Analytics, T&D, Saúde Ocupacional, conformidade e apoio próximo à liderança.","Pode incluir desenho do processo de Atração e Seleção, sem operação de vagas ou busca de candidatos.",`Contrato mínimo de ${minimumMonths} meses, com renovação automática. Após o período mínimo, passa a vigorar por prazo indeterminado.`,"Reajuste a cada 12 meses e cancelamento mediante aviso prévio de 30 dias."];
  return [packageInfo?.description || service.intro, monthly ? `Contrato mínimo de ${minimumMonths} meses.` : "Cronograma definido após a aprovação da proposta.", "Escopo executado pessoalmente por Patrícia Lima."];
}
function processSteps() {
  if (service.slug === "assessoria-estrategica") return [
    ["Conversa estratégica", "Leitura do momento da empresa, dores prioritárias e foco do ciclo."],
    ["Desenho do encaixe", `Definição do pacote ${packageLabel}, frentes prioritárias e carga mensal.`],
    ["Leitura de indicadores", "Organização dos dados de pessoas e construção do plano de entregas."],
    ["Rotina de decisão", "Encontros com a liderança, leitura contínua e ajustes de políticas e processos."],
  ];
  return [["Leitura", "Confirmação do contexto, do objetivo e das pessoas envolvidas."],["Encaixe", "Definição do formato, escopo, cadência e responsabilidades."],["Preparação", "Coleta de insumos, desenho e organização do cronograma."],["Execução", "Início do trabalho, checkpoints e próximos movimentos."]];
}
function outOfScope() {
  if (service.slug === "assessoria-estrategica") return ["Folha de pagamento, eSocial, encargos e rotinas de Departamento Pessoal.","Parecer jurídico trabalhista, defesa ou contencioso.","Operação de recrutamento: abertura de vaga, busca de candidatos e condução integral do processo.","Horas, visitas e entregas não utilizadas não são acumuladas para o período seguinte."];
  if (service.slug === "mentoria-rh") return ["Garantia de promoção, recolocação, aumento salarial ou resultado dependente de terceiros.","Atendimento clínico, terapêutico ou de saúde mental.","Execução das decisões e entregas profissionais no lugar do participante."];
  return ["Parecer jurídico, clínico ou atividade que exija habilitação não prevista no escopo.","Custos de terceiros, deslocamentos e licenças não indicados expressamente na proposta.","Entregas adicionais ou reutilização de materiais fora das condições contratadas."];
}
const processHtml = processSteps().map((step,index)=>`<div class="proposal-process-step"><span>${String(index+1).padStart(2,"0")}</span><div><strong>${escapeHtml(step[0])}</strong><p>${escapeHtml(step[1])}</p></div></div>`).join("");
document.title = `Proposta ${service.title} · ${submission.company_name} · CALI`;
root.innerHTML = `<div class="proposal-document">
  <article class="proposal-page proposal-cover-page">
    <header class="proposal-head"><div class="proposal-logo"><img src="${ASSETS.logoBordo}" alt="CALI — HR for Business"></div><div class="proposal-meta"><strong>${escapeHtml(submission.protocol)}</strong><br>${new Date(proposal.updated_at||proposal.created_at).toLocaleDateString("pt-BR")}<br>Válida até ${validity.toLocaleDateString("pt-BR")}</div></header>
    <div class="proposal-kicker">Proposta comercial · ${escapeHtml(packageLabel)}</div><h1>${escapeHtml(service.title)}</h1>
    <p class="proposal-lead">${escapeHtml(submission.contact_name)}, transformei o contexto compartilhado pela ${escapeHtml(submission.company_name || "empresa")} em uma proposta coerente com o momento do negócio.</p>
    <section class="proposal-section"><h2>O contexto que orienta esta proposta</h2><div class="proposal-context-grid">${contextCards}</div></section>
    ${priorities ? `<section class="proposal-section proposal-needs"><h2>O que precisa ganhar movimento</h2>${priorities}</section>` : ""}
    <footer class="proposal-footer"><span>Patrícia Lima · People Advisory Executive</span><span>01</span></footer>
  </article>
  <article class="proposal-page proposal-detail-page">
    <header class="proposal-head"><div class="proposal-logo"><img src="${ASSETS.logoBordo}" alt="CALI — HR for Business"></div><div class="proposal-meta"><strong>${escapeHtml(packageLabel)}</strong><br>${escapeHtml(submission.company_name || submission.contact_name)}</div></header>
    <section class="proposal-section proposal-solution"><div class="proposal-kicker">A solução recomendada</div><h2>${escapeHtml(packageLabel)}</h2><p>${escapeHtml(proposal.public_notes || packageInfo?.description || service.intro)}</p></section>
    <section class="proposal-section"><h2>Escopo incluído</h2><ul class="scope-list">${(proposal.scope_items||[]).map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section class="proposal-section"><h2>Como esta atuação funciona</h2><ul class="condition-list">${packageConditions().map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section class="proposal-section"><h2>Da leitura ao início</h2><div class="proposal-process">${processHtml}</div></section>
    <footer class="proposal-footer"><span>Patrícia Lima · People Advisory Executive</span><span>02</span></footer>
  </article>
  <article class="proposal-page proposal-detail-page proposal-commercial-page">
    <header class="proposal-head"><div class="proposal-logo"><img src="${ASSETS.logoBordo}" alt="CALI — HR for Business"></div><div class="proposal-meta"><strong>${escapeHtml(packageLabel)}</strong><br>${escapeHtml(submission.company_name || submission.contact_name)}</div></header>
    <section class="proposal-section"><h2>Investimento</h2><div class="investment-reference"><span>${monthly ? "Mensalidade de referência" : "Investimento de referência"}</span><strong>${currency(referencePrice)}</strong></div>${discountValue ? `<div class="investment-discount"><span>${escapeHtml(discountType)}${discountDescription ? ` · ${escapeHtml(discountDescription)}` : ""}</span><strong>− ${currency(discountValue)} (${discountPct.toLocaleString("pt-BR",{maximumFractionDigits:2})}%)</strong></div>` : ""}<div class="investment"><div><div class="investment-label">${monthly ? "Mensalidade final" : "Investimento final"}</div><div class="investment-value">${currency(proposal.final_unit)}</div></div></div><p class="investment-terms">${monthly ? `${monthlyHours ? `${monthlyHours} horas mensais. ` : ""}Contrato mínimo de ${minimumMonths} meses, renovação automática e aviso prévio de 30 dias. ` : ""}${escapeHtml(proposal.payment_terms || "Pagamento conforme cronograma definido.")}</p></section>
    <section class="proposal-section"><h2>Fora do escopo</h2><ul class="condition-list">${outOfScope().map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section class="proposal-section"><h2>Próximos passos</h2><div class="proposal-next-steps"><div><span>01</span><strong>Aprovação da proposta</strong></div><div><span>02</span><strong>Contrato e condições</strong></div><div><span>03</span><strong>Kickoff e insumos</strong></div><div><span>04</span><strong>Início da atuação</strong></div></div></section>
    <section class="signature"><div class="signature-name">Patrícia Lima</div><div class="signature-role">People Advisory Executive · CALI · HR for Business</div></section>
    <footer class="proposal-footer"><span>patricia@calirh.com · +55 41 98779-1933</span><span>calirh.com · 03</span></footer>
  </article>
</div>`;

document.getElementById("print").addEventListener("click",()=>window.print());
const drawer=document.getElementById("send-drawer"),overlay=document.getElementById("send-overlay"),fileInput=document.getElementById("pdf-file"),sendButton=document.getElementById("send-email"),feedback=document.getElementById("send-feedback");
function openSend(){document.getElementById("send-to").textContent=`${submission.contact_name} <${submission.contact_email}>`;drawer.classList.add("open");overlay.classList.add("open")}
function closeSend(){drawer.classList.remove("open");overlay.classList.remove("open")}
document.getElementById("open-send").addEventListener("click",openSend);document.getElementById("close-send").addEventListener("click",closeSend);overlay.addEventListener("click",closeSend);
fileInput.addEventListener("change",()=>{const file=fileInput.files?.[0];feedback.textContent="";sendButton.disabled=!file;if(file&&file.size>8*1024*1024){feedback.textContent="O PDF ultrapassa 8 MB.";sendButton.disabled=true}});
function fileBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]);reader.onerror=()=>reject(new Error("Não foi possível ler o PDF."));reader.readAsDataURL(file)})}
sendButton.addEventListener("click",async()=>{const file=fileInput.files?.[0];if(!file)return;sendButton.disabled=true;sendButton.textContent="Enviando…";feedback.textContent="";try{const response=await fetch(functionUrl("portal-send-proposal"),{method:"POST",headers:apiHeaders(session),body:JSON.stringify({proposal_id:proposal.id,pdf_base64:await fileBase64(file),pdf_name:file.name,note:document.getElementById("email-note").value})});const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result.error||"Falha no envio.");feedback.style.color="var(--verde)";feedback.textContent=`Enviado para ${submission.contact_email} ✓`;sendButton.textContent="Enviado"}catch(error){feedback.textContent=error instanceof Error?error.message:"Falha no envio.";sendButton.disabled=false;sendButton.textContent="Confirmar envio"}});
