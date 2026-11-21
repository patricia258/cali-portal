import { functionUrl } from '/js/config.js';
import { apiHeaders } from '/js/auth.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups = [
  {key:'p1',name:'Contexto',fields:['edit-contact-name','edit-company-name','proposal-context','proposal-pains','proposal-reading','mapa-include','mapa-score','mapa-quadrant']},
  {key:'p2',name:'Solução',fields:['package-code','package-label','package-kicker','package-tagline','public-notes','proposal-why-now','proposal-cycle-objective','proposal-results','proposal-advantages']},
  {key:'p3',name:'Escopo e responsabilidades',fields:['scope','proposal-cadence','proposal-cycles','proposal-cali-responsibilities','proposal-client-responsibilities','proposal-roadmap-items']},
  {key:'modules',name:'Módulos complementares',whole:'modules-enabled',fields:[]},
  {key:'p5',name:'Investimento e condições',fields:['base-price','extras','discount','final-price','discount-type','discount-description','monthly-hours','months','validity','proposal-nature','delivery-mode','activation-percent','activation-description','commercial-conditions','proposal-out-of-scope','payment-terms','payment-method','payment-monthly-due','payment-entry-pct','payment-final-pct','payment-project-installments','payment-project-installment-due','payment-pix-discount','payment-card-installments','payment-card-fees','payment-custom-label','bonus-choice','bonus-title','bonus-description']},
  {key:'coverage',name:'Abrangência contratual',whole:'coverage-enabled',fields:[]},
  {key:'p6',name:'Próximos passos',fields:['next-steps-intro','next-steps']},
  {key:'internal',name:'Contato e análise interna',fields:['edit-contact-name','edit-contact-role','edit-contact-email','edit-contact-phone','edit-company-name','edit-company-location','review-status','internal-notes','budget-strategy']},
];
const moneyFields = ['base-price','extras','discount','final-price','activation-percent','activation-description'];
const normalize = value => String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');

export function mountVisualEditor({session,submission,existing,getPayload}) {
  const source=document.getElementById('page-body');
  const $=id=>document.getElementById(id);
  const label=id=>{const input=$(id);return input?.closest('.field')?.querySelector('label')?.textContent.trim()||({ 'mapa-include':'Incluir Mapa de People' })[id]||id;};
  // Guardamos os mesmos controles e listeners; não há formulário duplicado nem valores paralelos.
  const shell=document.createElement('div');shell.className='ve-workspace';
  shell.innerHTML=`<aside class="ve-outline"><p class="ve-eyebrow">ESTRUTURA DA PROPOSTA</p><h2>Editar no documento</h2><p class="ve-help">Selecione um bloco na página ou uma seção abaixo.</p><nav aria-label="Seções da proposta">${groups.map((g,i)=>`<button type="button" data-group="${g.key}"><span>${String(i+1).padStart(2,'0')}</span>${esc(g.name)}</button>`).join('')}</nav><div class="ve-outline-bottom"><span id="ve-page-count">Preparando páginas…</span><button type="button" id="ve-add">+ Adicionar observação</button></div></aside><main class="ve-main"><div class="ve-toolbar"><div><strong id="ve-status" role="status" aria-live="polite">Preparando a prévia exata…</strong><small>Mesmo layout e paginação do PDF · edição ainda não salva</small></div><button type="button" id="ve-refresh">Atualizar prévia</button></div><div id="ve-document" aria-label="Proposta em páginas"><p class="ve-loading">Gerando a proposta para edição…</p></div></main><aside class="ve-inspector"><div class="ve-inspector-head"><span class="ve-eyebrow">PROPRIEDADES DO BLOCO</span><button type="button" id="ve-close" aria-label="Fechar propriedades">×</button></div><h2 id="ve-field-heading">Contexto</h2><label class="ve-field-selector" for="ve-field-select">Campo para editar</label><select id="ve-field-select"></select><p class="ve-help" id="ve-field-help">Os campos são preenchidos pelo pacote e continuam editáveis.</p><div id="ve-source"></div><div id="ve-custom"></div><div class="ve-list-tools" hidden><p class="ve-help">Reorganizar itens desta lista</p><select id="ve-item" aria-label="Item para reorganizar"></select><button id="ve-item-up" type="button">↑ Subir item</button><button id="ve-item-down" type="button">↓ Descer item</button></div><div class="ve-extras"><h3>Observações adicionadas</h3><div id="ve-extras-list"></div></div></aside>`;
  source.parentElement.insertBefore(shell,source);shell.querySelector('#ve-source').append(source);
  document.body.classList.add('visual-proposal-editor');
  let current=groups[0],field='proposal-context',revision=0,timer,controller,pdfDoc,rendering=false,dirty=false,disposed=false;
  let extras=structuredClone(existing?.calculator_data?.visualEditorExtras||[]);
  window.__visualEditorExtras=()=>structuredClone(extras);
  let texts=[],pageNodes=[],lastRendered=-1;
  const sourceSections=[...source.querySelectorAll('.drawer-section')];
  const inputs=[...source.querySelectorAll('input,textarea,select')];
  inputs.forEach(input=>{const l=input.closest('.field')?.querySelector('label');if(l&&input.id)l.htmlFor=input.id;});
  // Todas as propriedades continuam acessíveis, inclusive novos campos de módulos.
  function showFields(groupKey,fieldId){
    commitInline();current=groups.find(g=>g.key===groupKey)||groups[0];field=fieldId||current.fields.find(id=>$(id))||'';
    document.body.classList.add('ve-properties-open');
    shell.querySelectorAll('[data-group]').forEach(b=>b.classList.toggle('selected',b.dataset.group===current.key));
    $('ve-field-heading').textContent=current.name;
    $('ve-field-select').innerHTML=current.fields.filter(id=>$(id)).map(id=>`<option value="${id}" ${id===field?'selected':''}>${esc(label(id))}</option>`).join('');
    $('ve-field-select').hidden=!!current.whole;
    let wholeSection=current.whole?$(current.whole)?.closest('.drawer-section'):null;
    source.querySelectorAll('.ve-whole').forEach(n=>n.classList.remove('ve-whole'));
    source.querySelectorAll('.field').forEach(n=>n.classList.add('ve-field-hidden'));
    source.querySelector('.proposal-editor-intro')?.classList.add('ve-field-hidden');
    const mapBox=$('mapa-include')?.closest('.mapa-toggle');if(mapBox)mapBox.hidden=!field.startsWith('mapa-');
    const ids=moneyFields.includes(field)?moneyFields:[field];
    ids.forEach(id=>$(id)?.closest('.field')?.classList.remove('ve-field-hidden'));
    sourceSections.forEach(section=>{section.hidden=wholeSection?section!==wholeSection:!ids.some(id=>$(id)&&section.contains($(id)));});
    wholeSection?.classList.add('ve-whole');
    if(wholeSection)wholeSection.querySelectorAll('.field').forEach(n=>n.classList.remove('ve-field-hidden'));
    // Checkbox do Mapa fica junto dos seus campos sem tornar a análise obrigatória.
    if(field.startsWith('mapa-'))source.querySelectorAll('[id^="mapa-"]').forEach(n=>n.closest('.field')?.classList.remove('ve-field-hidden'));
    $('ve-custom').replaceChildren();
    $('ve-field-help').textContent=current.key==='internal'?'Estes dados organizam o contato e a análise administrativa. A análise interna não aparece no PDF.':'Edite aqui ou clique no texto da página. A prévia exata será recompilada após a alteração.';
    updateListTools();updateExtraList();
    if(current.whole)$('ve-field-help').textContent='Preencha apenas os compromissos contratados. Os módulos têm capacidade e cobrança próprias.';
  }
  function updateListTools(){const input=$(field),isList=input?.tagName==='TEXTAREA'&&['scope','proposal-pains','proposal-results','proposal-advantages','proposal-cadence','proposal-cycles','proposal-cali-responsibilities','proposal-client-responsibilities','proposal-roadmap-items','proposal-out-of-scope','commercial-conditions','next-steps'].includes(field);shell.querySelector('.ve-list-tools').hidden=!isList;if(isList)$('ve-item').innerHTML=input.value.split('\n').map((v,i)=>`<option value="${i}">${i+1}. ${esc(v.slice(0,70))}</option>`).join('');}
  function reorder(delta){const input=$(field),list=input.value.split('\n'),i=Number($('ve-item').value),j=i+delta;if(j<0||j>=list.length)return;[list[i],list[j]]=[list[j],list[i]];input.value=list.join('\n');input.dispatchEvent(new Event('input',{bubbles:true}));updateListTools();$('ve-item').value=j;}
  function updateExtraList(){ $('ve-extras-list').innerHTML=extras.map((b,i)=>`<button type="button" data-extra="${i}">${esc(b.title||'Observação')} · ${esc(groups.find(g=>g.key===b.section)?.name||b.section)}</button>`).join('');$('ve-extras-list').querySelectorAll('[data-extra]').forEach(b=>b.onclick=()=>editExtra(Number(b.dataset.extra)));}
  function editExtra(i){commitInline();const block=extras[i];showFields(block.section);sourceSections.forEach(s=>s.hidden=true);$('ve-field-select').hidden=true;$('ve-field-heading').textContent='Observação adicional';$('ve-custom').innerHTML=`<label for="ve-extra-title">Título</label><input id="ve-extra-title" value="${esc(block.title)}"><label for="ve-extra-text">Conteúdo</label><textarea id="ve-extra-text">${esc(block.text)}</textarea><div class="ve-extra-actions"><button type="button" id="ve-extra-up">↑ Subir</button><button type="button" id="ve-extra-down">↓ Descer</button><button type="button" id="ve-extra-remove">Remover observação</button></div>`;
    ['title','text'].forEach(k=>$('ve-extra-'+k).oninput=e=>{block[k]=e.target.value;changed();updateExtraList();});
    const move=d=>{let j=i+d;if(j<0||j>=extras.length||extras[j].section!==block.section)return;[extras[i],extras[j]]=[extras[j],extras[i]];changed();editExtra(j);};$('ve-extra-up').onclick=()=>move(-1);$('ve-extra-down').onclick=()=>move(1);$('ve-extra-remove').onclick=()=>{extras.splice(i,1);changed();showFields(block.section);};
  }
  function changed(){revision++;dirty=true;$('ve-status').textContent='Alterações pendentes na prévia';$('ve-status').dataset.state='pending';clearTimeout(timer);controller?.abort();timer=setTimeout(()=>{if(!shell.querySelector('.ve-inline-editor'))refresh();},1400);}
  source.addEventListener('input',()=>{changed();updateListTools();});source.addEventListener('change',changed);source.addEventListener('click',e=>{if(e.target.closest('#add-module,#add-recruiting,[data-remove]'))setTimeout(changed,0);});
  function commitInline(){const input=shell.querySelector('.ve-inline-editor');if(input){input.remove();clearTimeout(timer);timer=setTimeout(refresh,300);}}
  function inlineEdit(id,sheet,rect){showFields(groups.find(g=>g.fields.includes(id))?.key||($(id)?.closest('[data-module]')?'modules':id.startsWith('coverage-')?'coverage':'p1'),id);const input=$(id);if(!input||!['TEXTAREA','INPUT'].includes(input.tagName)||input.type==='number')return;const textarea=document.createElement('textarea');textarea.className='ve-inline-editor';textarea.value=input.value;textarea.setAttribute('aria-label',label(id));textarea.style.cssText=`left:${rect.left}px;top:${rect.top}px;width:${Math.max(180,Math.min(rect.width,sheet.clientWidth-rect.left-12))}px;height:${Math.max(100,rect.height+35)}px`;sheet.append(textarea);textarea.oninput=()=>{input.value=textarea.value;input.dispatchEvent(new Event('input',{bubbles:true}));};textarea.onblur=commitInline;textarea.onkeydown=e=>{if(e.key==='Escape'){textarea.blur();}};textarea.focus();}
  function installTargets(sheet,content,viewport){
    const items=content.items.filter(x=>typeof x.str==='string'), spans=[];let joined='';for(const item of items){const text=normalize(item.str);spans.push({start:joined.length,end:joined.length+text.length,item});joined+=text;}
    const fieldIds=[...groups.filter(g=>g.key!=='internal').flatMap(g=>g.fields),...Array.from(source.querySelectorAll('[data-module] input,[data-module] textarea,#coverage-fields input,#coverage-fields textarea')).map(n=>n.id)].filter((id,i,a)=>id&&a.indexOf(id)===i);
    for(const id of fieldIds){const input=$(id);if(!input||input.type==='checkbox'||!['TEXTAREA','INPUT'].includes(input.tagName)||input.type==='number')continue;
      const value=normalize(input.value);if(value.length<12)continue;const needle=value.slice(0,Math.min(65,value.length)),at=joined.indexOf(needle);if(at<0)continue;
      const matches=spans.filter(p=>p.end>at&&p.start<at+Math.min(value.length,700));if(!matches.length)continue;
      const bounds=matches.map(({item})=>{const [x,y]=viewport.convertToViewportPoint(item.transform[4],item.transform[5]);return {x,y:y-item.height*viewport.scale,w:item.width*viewport.scale,h:item.height*viewport.scale};});const left=Math.min(...bounds.map(r=>r.x)),top=Math.max(0,Math.min(...bounds.map(r=>r.y))),right=Math.max(...bounds.map(r=>r.x+r.w)),bottom=Math.max(...bounds.map(r=>r.y+r.h));
      const button=document.createElement('button');button.className='ve-target';button.type='button';button.title='Editar: '+label(id);button.setAttribute('aria-label',button.title);button.style.cssText=`left:${left-4}px;top:${top-3}px;width:${Math.min(sheet.clientWidth-left,right-left+8)}px;height:${Math.max(20,bottom-top+8)}px`;button.onclick=()=>inlineEdit(id,sheet,{left:Math.max(4,left-4),top:Math.max(0,top-3),width:right-left+12,height:bottom-top+8});sheet.append(button);
    }
    const commercialAt=spans.find(p=>/^(mensalidade|investimento)$/.test(normalize(p.item.str)));if(commercialAt){const [x,y]=viewport.convertToViewportPoint(commercialAt.item.transform[4],commercialAt.item.transform[5]);const button=document.createElement('button');button.type='button';button.className='ve-money-target';button.textContent='Editar valores';button.style.cssText=`left:${x}px;top:${Math.max(0,y-24)}px`;button.onclick=()=>showFields('p5','base-price');sheet.append(button);}
  }
  async function refresh(){
    clearTimeout(timer);if(disposed||shell.querySelector('.ve-inline-editor'))return;const targetRevision=revision;controller?.abort();controller=new AbortController();const renderController=controller;const signal=renderController.signal;let draft;
    try{draft={...existing,...getPayload(),id:existing?.id||crypto.randomUUID()};}catch(error){$('ve-status').textContent=error.message;$('ve-status').dataset.state='error';return;}
    rendering=true;$('ve-status').textContent='Atualizando a paginação exata…';$('ve-status').dataset.state='loading';$('ve-refresh').disabled=true;
    const timeout=setTimeout(()=>renderController.abort(),60000);
    try{
      const response=await fetch(functionUrl('portal-proposal-pdf'),{method:'POST',headers:apiHeaders(session),body:JSON.stringify({proposal:draft}),signal});if(!response.ok){const info=await response.json().catch(()=>({}));throw new Error(info.error||`Não foi possível gerar a prévia (${response.status}).`);}
      const bytes=new Uint8Array(await response.arrayBuffer());if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw new Error('A prévia não retornou um PDF válido.');
      const {getDocument,GlobalWorkerOptions}=await import('/vendor/pdfjs/pdf.mjs');GlobalWorkerOptions.workerSrc='/vendor/pdfjs/pdf.worker.mjs';const doc=await getDocument({data:bytes,isEvalSupported:false}).promise;
      const stage=document.createElement('div'),width=Math.max(220,Math.min(850,$('ve-document').clientWidth-40));const newTexts=[],newPages=[];
      for(let n=1;n<=doc.numPages;n++){
        if(signal.aborted||targetRevision!==revision)break;const page=await doc.getPage(n),natural=page.getViewport({scale:1}),viewport=page.getViewport({scale:width/natural.width});const wrapper=document.createElement('section');wrapper.className='ve-sheet';wrapper.style.width=width+'px';wrapper.style.height=viewport.height+'px';wrapper.setAttribute('aria-label',`Página ${n} de ${doc.numPages}`);const canvas=document.createElement('canvas'),ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.ceil(viewport.width*ratio);canvas.height=Math.ceil(viewport.height*ratio);canvas.style.width=width+'px';canvas.style.height=viewport.height+'px';canvas.setAttribute('aria-hidden','true');wrapper.append(canvas);stage.append(wrapper);await page.render({canvasContext:canvas.getContext('2d'),viewport,transform:ratio===1?undefined:[ratio,0,0,ratio,0,0]}).promise;const content=await page.getTextContent();newTexts.push(normalize(content.items.map(i=>i.str||'').join(' ')));newPages.push(wrapper);const accessible=document.createElement("p");accessible.className="ve-accessible";accessible.textContent=content.items.map(i=>i.str||"").join(" ");wrapper.append(accessible);installTargets(wrapper,content,viewport);page.cleanup();}
      await doc.destroy();if(signal.aborted||targetRevision!==revision)return;
      const oldTop=$('ve-document').scrollTop;$('ve-document').replaceChildren(...stage.children);$('ve-document').scrollTop=oldTop;texts=newTexts;pageNodes=newPages;lastRendered=targetRevision;$('ve-page-count').textContent=`${newPages.length} páginas · paginação real`;$('ve-status').textContent='Prévia exata atualizada · alterações ainda não salvas';$('ve-status').dataset.state='ready';
    }catch(error){if(!signal.aborted){$('ve-status').textContent=error.message;$('ve-status').dataset.state='error';if(!pageNodes.length)$('ve-document').innerHTML='<p class="ve-loading">Não foi possível compilar a prévia. Revise os campos indicados e clique em Atualizar prévia.</p>';}}
    finally{clearTimeout(timeout);if(targetRevision===revision){rendering=false;$('ve-refresh').disabled=false;}else if(!disposed){$('ve-refresh').disabled=false;}}
  }
  shell.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>{showFields(b.dataset.group);const g=groups.find(g=>g.key===b.dataset.group),needle=g.fields.map(id=>normalize($(id)?.value)).find(v=>v?.length>50),index=texts.findIndex(t=>needle&&t.includes(needle.slice(0,50)));if(index>=0)pageNodes[index].scrollIntoView({behavior:'smooth',block:'start'});});
  $('ve-field-select').onchange=e=>showFields(current.key,e.target.value);
  $('ve-item-up').onclick=()=>reorder(-1);$('ve-item-down').onclick=()=>reorder(1);
  $('ve-refresh').onclick=()=>{commitInline();refresh();};$('ve-close').onclick=()=>document.body.classList.remove('ve-properties-open');
  $('ve-add').onclick=()=>{const section=['p1','p2','p3','p5','p6'].includes(current.key)?current.key:'p5';extras.push({id:crypto.randomUUID(),section,title:'Observação adicional',text:''});editExtra(extras.length-1);changed();};
  const defaultsButton=[...source.querySelectorAll('button')].find(b=>b.textContent.includes('Preencher referências do pacote'));if(defaultsButton){const button=document.createElement('button');button.type='button';button.className='ve-package-defaults';button.textContent='Preencher referências do pacote';button.onclick=()=>{defaultsButton.click();changed();};shell.querySelector('.ve-outline-bottom').append(button);}
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  // Salvar só usa o fluxo explícito existente; navegar após um salvamento bem-sucedido é esperado.
  window.__visualEditorSaved=()=>{dirty=false;};
  window.addEventListener('pagehide',()=>{disposed=true;clearTimeout(timer);controller?.abort();pdfDoc?.destroy();});
  let oldWidth=$('ve-document').clientWidth;window.addEventListener('resize',()=>{const width=$('ve-document').clientWidth;if(Math.abs(width-oldWidth)>25){oldWidth=width;clearTimeout(timer);timer=setTimeout(refresh,500);}});
  showFields('p1','proposal-context');refresh();
}
