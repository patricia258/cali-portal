import { requestJson } from "/js/request.js";
import { CONFIG, functionUrl } from "/js/config.js";
import { requireAdmin, apiHeaders, signOut } from "/js/auth.js";
import { SERVICES } from "/js/services.js";
import { proposalPdfBaseName, proposalPdfFileName } from "/js/pdf-filename.js";

const session = await requireAdmin();
if (!session) throw new Error("Sessão ausente.");
const proposalId = new URLSearchParams(location.search).get("id") || location.pathname.split("/").filter(Boolean).pop();
const root = document.getElementById("proposal-root");
const printButton = document.getElementById("print");
const openSendButton = document.getElementById("open-send");
printButton.disabled = true;
openSendButton.disabled = true;
async function rest(path) {
  const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${path}`, { headers: apiHeaders(session) });
  if (response.status === 401 || response.status === 403) { await signOut(); throw new Error("Entre novamente para abrir a proposta."); }
  if (!response.ok) throw new Error("Não foi possível abrir a proposta.");
  return response.json();
}
let data;
try { data = await rest(`cali_proposals?id=eq.${encodeURIComponent(proposalId)}&select=*,submission:cali_submissions(*)`); }
catch (error) { root.textContent = error.message; throw error; }
const proposal = data?.[0], submission = proposal?.submission ? {...proposal.submission,...proposal.calculator_data?.contactSnapshot,protocol:proposal.calculator_data?.documentProtocol||proposal.submission.protocol} : null, service = SERVICES[proposal?.service_slug];
if (!proposal || !submission || !service) { root.textContent = "Proposta não encontrada."; throw new Error("Proposta não encontrada."); }
const pdfNameData = {serviceName:service.title,contactName:submission.contact_name,companyName:submission.company_name,protocol:submission.protocol};
const suggestedPdfName = proposalPdfFileName(pdfNameData);
document.title = proposalPdfBaseName(pdfNameData);
document.getElementById("edit-proposal").href = `/admin/editar.html?id=${encodeURIComponent(submission.id)}`;
let pdfBlob = null, pdfUrl = null, loading = false;
async function loadPdf() {
  if (loading) return;
  loading = true; pdfBlob = null;
  printButton.disabled = true; openSendButton.disabled = true;
  root.innerHTML = '<div class="proposal-pdf-status" role="status">Gerando sua proposta…</div>';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const query = new URLSearchParams({ proposal_id: proposal.id, protocolo: submission.protocol });
    const response = await fetch(`${functionUrl("portal-proposal-pdf")}?${query}`, { headers: apiHeaders(session), signal: controller.signal });
    if (!response.ok) {
      const info = await response.json().catch(() => ({}));
      throw new Error(info.error || `Não foi possível gerar o PDF (${response.status}).`);
    }
    const blob = await response.blob();
    if ((await blob.slice(0,5).text()) !== "%PDF-") throw new Error("O gerador não retornou um PDF válido.");
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    pdfBlob = blob; pdfUrl = URL.createObjectURL(blob);
    const { getDocument, GlobalWorkerOptions } = await import("/vendor/pdfjs/pdf.mjs");
    GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.mjs";
    const documentPdf = await getDocument({data:new Uint8Array(await blob.arrayBuffer()),isEvalSupported:false}).promise;
    const viewer = document.createElement("div"); viewer.className = "proposal-pdf-viewer";
    root.replaceChildren(viewer);
    const cssWidth = Math.min(900, Math.max(240, root.clientWidth - 48));
    for (let number = 1; number <= documentPdf.numPages; number++) {
      const page = await documentPdf.getPage(number);
      const natural = page.getViewport({scale:1});
      const viewport = page.getViewport({scale:cssWidth/natural.width});
      const ratio = Math.min(window.devicePixelRatio || 1,2);
      const sheet = document.createElement("section"); sheet.className = "proposal-pdf-sheet"; sheet.setAttribute("aria-label",`Página ${number} de ${documentPdf.numPages}`);
      const canvas = document.createElement("canvas"); canvas.width = Math.ceil(viewport.width*ratio); canvas.height = Math.ceil(viewport.height*ratio); canvas.setAttribute("aria-hidden","true");
      sheet.append(canvas); viewer.append(sheet);
      await page.render({canvasContext:canvas.getContext("2d"),viewport,transform:ratio===1?undefined:[ratio,0,0,ratio,0,0]}).promise;
      const content = await page.getTextContent();
      const text = document.createElement("p");text.className="proposal-pdf-accessible-text";text.textContent=content.items.map(item=>item.str||"").join(" ");sheet.append(text);
      page.cleanup();
    }
    await documentPdf.destroy();
    printButton.disabled = false; openSendButton.disabled = false;
  } catch (error) {
    const message = controller.signal.aborted ? "A geração demorou mais que o esperado. Tente novamente." : error.message;
    const box = document.createElement("div"); box.className = "proposal-pdf-status"; box.setAttribute("role", "alert");
    const text = document.createElement("p"); text.textContent = message;
    const retry = document.createElement("button"); retry.className = "btn btn-gold"; retry.textContent = "Gerar novamente"; retry.addEventListener("click", loadPdf);
    box.append(text, retry); root.replaceChildren(box);
  } finally { clearTimeout(timer); loading = false; }
}
printButton.title = `Salvar como ${suggestedPdfName}`;
printButton.addEventListener("click", () => {
  if (!pdfBlob || !pdfUrl) return;
  const link = document.createElement("a"); link.href = pdfUrl; link.download = suggestedPdfName; document.body.append(link); link.click(); link.remove();
});
window.addEventListener("pagehide", () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); });

// Prévia, download e envio usam o mesmo gerador de PDF para a proposta selecionada.
const drawer=document.getElementById("send-drawer"),overlay=document.getElementById("send-overlay"),sendButton=document.getElementById("send-email"),feedback=document.getElementById("send-feedback");
const companyInput=document.getElementById("send-company"),recipientNameInput=document.getElementById("send-recipient-name"),recipientEmailInput=document.getElementById("send-recipient-email"),subjectPreview=document.getElementById("send-subject");
const proposalSubject=()=>`CALI RH - Sua proposta chegou! ${service.title}.`;
let sending = false;
function refreshSendConfirmation(){subjectPreview.textContent=proposalSubject();const fieldsValid=recipientNameInput.value.trim().length>=2&&recipientEmailInput.checkValidity();sendButton.disabled=sending||!pdfBlob||!fieldsValid;}
function openSend(){companyInput.value=submission.company_name||"";recipientNameInput.value=submission.contact_name||"";recipientEmailInput.value=submission.contact_email||"";document.getElementById("send-to").textContent=`${service.title} · ${submission.protocol}`;feedback.textContent="";feedback.style.color="var(--vermelho)";refreshSendConfirmation();drawer.classList.add("open");overlay.classList.add("open");}
function closeSend(){drawer.classList.remove("open");overlay.classList.remove("open")}
document.getElementById("open-send").addEventListener("click",openSend);document.getElementById("close-send").addEventListener("click",closeSend);overlay.addEventListener("click",closeSend);
[companyInput,recipientNameInput,recipientEmailInput].forEach((input)=>input.addEventListener("input",()=>{feedback.textContent="";refreshSendConfirmation()}));
sendButton.addEventListener("click",async()=>{if(sendButton.disabled)return;sending=true;sendButton.disabled=true;sendButton.textContent="Gerando PDF e enviando…";feedback.textContent="";try{const result=await requestJson(functionUrl("portal-send-proposal"),{method:"POST",headers:apiHeaders(session),body:JSON.stringify({proposal_id:proposal.id,expected_updated_at:proposal.updated_at,note:document.getElementById("email-note").value,company_name:companyInput.value.trim(),recipient_name:recipientNameInput.value.trim(),recipient_email:recipientEmailInput.value.trim()})});feedback.style.color="var(--verde)";feedback.textContent=`Proposta enviada para ${result.to||recipientEmailInput.value.trim()} ✓${result.warning ? ` ${result.warning}` : ""}`;sendButton.textContent="Enviado"}catch(error){feedback.style.color="var(--vermelho)";feedback.textContent=error instanceof Error?error.message:"Falha no envio.";sendButton.textContent="Confirmar e enviar";sending=false;refreshSendConfirmation()}});

await loadPdf();
