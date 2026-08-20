import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ADMIN_EMAIL = "patricia@calirh.com";
const PORTAL_URL = "https://portal.calirh.com";
const BRAND_LOGO_URL = `${PORTAL_URL}/assets/logo-cali-light.png`;
const PORTAL_ORIGINS = new Set([
  PORTAL_URL,
  "https://cali-portal.vercel.app",
  "https://propostas.calirh.com",
]);
const SERVICE_LABELS: Record<string,string> = {
  "assessoria-estrategica":"Assessoria Estratégica Mensal","mentoria-rh":"Mentoria para Profissionais de RH",
  "diagnostico-executivo":"Diagnóstico Executivo de People","cultura-direcao":"Projeto de Cultura e Direção",
  "shadowing-lideranca":"Shadowing de Liderança",treinamentos:"Treinamentos & Palestras","marca-empregadora":"Marca Empregadora",
};

function cors(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = PORTAL_ORIGINS.has(origin) || /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  return { "Access-Control-Allow-Origin": allowed ? origin : PORTAL_URL, "Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods":"POST, OPTIONS", Vary:"Origin" };
}
function portalUrl(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return PORTAL_ORIGINS.has(origin) || /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(origin) ? origin : PORTAL_URL;
}
function response(request:Request, body:unknown, status=200){return new Response(JSON.stringify(body),{status,headers:{...cors(request),"Content-Type":"application/json; charset=utf-8"}})}
function esc(value:unknown){return String(value??"").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]??c))}
function clean(value:unknown,max=4000){return String(value??"").trim().slice(0,max)}
function protocol(slug:string){const code={"assessoria-estrategica":"AEM","mentoria-rh":"MRH","diagnostico-executivo":"DEP","cultura-direcao":"PCD","shadowing-lideranca":"SHL",treinamentos:"TRN","marca-empregadora":"EMP"}[slug]||"SOL";const day=new Date().toISOString().slice(0,10).replaceAll("-","");return `CALI-${code}-${day}-${crypto.randomUUID().slice(0,6).toUpperCase()}`}
async function sendEmail(payload:Record<string,unknown>, key:string){if(!RESEND_API_KEY)return null;const res=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${RESEND_API_KEY}`,"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify(payload)});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(`Resend ${res.status}: ${JSON.stringify(data)}`);return data}
function wrapper(content:string,preheader:string){return `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light only"><title>${esc(preheader)}</title></head><body bgcolor="#F7F3EE" style="margin:0;background:#F7F3EE;font-family:Arial,sans-serif;color:#2B2B2B"><div style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#F7F3EE"><tr><td style="padding:28px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:auto;background:#fff;border:1px solid #EDE4DE;border-radius:14px;overflow:hidden"><tr><td bgcolor="#5A1E2D" style="padding:25px;text-align:center"><img src="${BRAND_LOGO_URL}" width="174" alt="CALI — HR for Business" style="display:block;width:174px;max-width:70%;height:auto;margin:0 auto;border:0"></td></tr><tr><td style="padding:34px 32px">${content}</td></tr><tr><td bgcolor="#F7F3EE" style="padding:17px 28px;text-align:center;font-size:10px;color:#8D8184">CALI · HR for Business · calirh.com · patricia@calirh.com</td></tr></table></td></tr></table></body></html>`}

Deno.serve(async(request)=>{
  if(request.method==="OPTIONS")return new Response("ok",{headers:cors(request)});
  if(request.method!=="POST")return response(request,{error:"Método não permitido."},405);
  try{
    const body=await request.json();
    if(clean(body.website))return response(request,{ok:true});
    const slug=clean(body.service_slug,80);if(!SERVICE_LABELS[slug])return response(request,{error:"Serviço inválido."},400);
    if(!body.lgpd_aceite||!body.answers||typeof body.answers!=="object"||Array.isArray(body.answers))return response(request,{error:"Revise os dados obrigatórios."},400);
    const a=body.answers as Record<string,unknown>;const name=clean(a.nome,140),email=clean(a.email,254).toLowerCase();
    if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return response(request,{error:"Nome ou e-mail inválido."},400);
    const safeAnswers=Object.fromEntries(Object.entries(a).slice(0,80).map(([k,v])=>[clean(k,80),Array.isArray(v)?v.slice(0,30).map(x=>clean(x,300)):typeof v==="number"?v:clean(v,4000)]));
    if(new TextEncoder().encode(JSON.stringify(safeAnswers)).byteLength>60_000)return response(request,{error:"As respostas ultrapassaram o limite permitido. Reduza os textos e tente novamente."},400);
    const record={protocol:protocol(slug),service_slug:slug,status:"novo",contact_name:name,contact_role:clean(a.cargo,140)||null,contact_email:email,contact_phone:clean(a.whatsapp,40)||null,contact_preference:clean(a.preferencia_contato,20)||null,company_name:clean(a.empresa,180)||null,company_segment:clean(a.segmento,160)||null,company_size:Number(a.colaboradores)||null,company_units:Number(a.unidades)||null,company_location:clean(a.localidade||a.cidade,180)||null,answers:safeAnswers,source_path:clean(body.source_path,160)||null,lgpd_accepted:true};
    const admin=createClient(SUPABASE_URL,SERVICE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
    const since=new Date(Date.now()-60*60*1000).toISOString();
    const{count:recentCount,error:countError}=await admin.from("cali_submissions").select("id",{count:"exact",head:true}).eq("contact_email",email).gte("created_at",since);
    if(countError)throw countError;
    if((recentCount||0)>=3)return response(request,{error:"Recebemos várias solicitações recentes deste e-mail. Aguarde um pouco antes de tentar novamente."},429);
    const {data,error}=await admin.from("cali_submissions").insert(record).select("id,protocol").single();if(error)throw error;
    await admin.from("cali_activity").insert({submission_id:data.id,event_type:"submission_created",metadata:{service_slug:slug}});
    const first=esc(name.split(/\s+/)[0]);const company=esc(record.company_name||"sua empresa");const service=esc(SERVICE_LABELS[slug]);
    const clientHtml=wrapper(`<p style="margin:0 0 18px;font-size:16px">Olá, ${first}.</p><p style="line-height:1.7">Recebi as respostas sobre <strong>${service}</strong> para ${company}. Obrigada por compartilhar esse contexto.</p><p style="line-height:1.7">Eu mesma vou fazer a leitura do briefing e, se precisar entender algum ponto antes da proposta, entro em contato. Você não será encaminhado para uma equipe comercial.</p><table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0"><tr><td bgcolor="#5A1E2D" style="border-radius:999px"><a href="https://wa.me/5541987791933" style="display:inline-block;padding:12px 22px;color:#fff;text-decoration:none;font-weight:bold;font-size:13px">Vamos conversar?</a></td></tr></table><p style="font-size:12px;color:#7A6F72;margin-top:28px">Patrícia Lima<br><span style="font-size:11px">People Advisory Executive · CALI</span></p>`,"Recebi seu briefing — CALI");
    const adminHtml=wrapper(`<p style="margin:0 0 14px;font-size:16px"><strong>Novo briefing recebido</strong></p><p><strong>${service}</strong><br>${esc(record.company_name||"Sem empresa informada")} · ${esc(name)}<br>${esc(email)} · ${esc(record.contact_phone||"")}</p><p style="font-family:monospace;font-size:11px;color:#8D8184">${esc(data.protocol)}</p><table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0"><tr><td bgcolor="#5A1E2D" style="border-radius:999px"><a href="${portalUrl(request)}/admin" style="display:inline-block;padding:12px 22px;color:#fff;text-decoration:none;font-weight:bold;font-size:13px">Abrir no painel</a></td></tr></table>`,"Novo briefing no Portal CALI");
    const emailResults=await Promise.allSettled([
      sendEmail({from:"Patrícia Lima · CALI <patricia@calirh.com>",to:[email],reply_to:ADMIN_EMAIL,subject:`Recebi seu briefing — ${SERVICE_LABELS[slug]} | CALI`,html:clientHtml},`portal-confirm-${data.id}`),
      sendEmail({from:"Portal CALI <patricia@calirh.com>",to:[ADMIN_EMAIL],reply_to:email,subject:`Novo briefing — ${SERVICE_LABELS[slug]} · ${record.company_name||name}`,html:adminHtml},`portal-admin-${data.id}`),
    ]);
    const failures=emailResults.filter(x=>x.status==="rejected").map(x=>String((x as PromiseRejectedResult).reason));if(failures.length)await admin.from("cali_activity").insert({submission_id:data.id,event_type:"email_error",metadata:{errors:failures}});
    return response(request,{ok:true,protocol:data.protocol});
  }catch(error){console.error(error);return response(request,{error:"Não foi possível registrar agora. Tente novamente em alguns minutos."},500)}
});
