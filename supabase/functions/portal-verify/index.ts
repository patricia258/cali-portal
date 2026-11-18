import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SERVICE_LABELS: Record<string, string> = { "assessoria-estrategica": "Assessoria Estratégica Mensal — HR as a Service", "cali-build": "CALI Build — Estruturação Assistida de RH", "mentoria-rh": "Mentoria para Profissionais de RH", "diagnostico-executivo": "Diagnóstico Executivo de Pessoas", "cultura-direcao": "Projeto de Cultura e Direção", "shadowing-lideranca": "Shadowing de Liderança", "treinamentos": "Treinamentos & Palestras", "marca-empregadora": "Marca Empregadora", "solucao-personalizada": "Solução Personalizada" };

function cors(req: Request) {
  const o = req.headers.get("origin") ?? "";
  const ok = o === "https://portal.calirh.com" || /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(o) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o);
  return { "Access-Control-Allow-Origin": ok ? o : "https://portal.calirh.com", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "GET, OPTIONS", Vary: "Origin" };
}
function json(req: Request, body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json" } }); }
function dataCurta(iso?: string) { return iso ? new Date(iso).toLocaleDateString("pt-BR") : ""; }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  try {
    const protocolo = new URL(req.url).searchParams.get("protocolo") || "";
    if (!/^[A-Za-z0-9-]{6,80}$/.test(protocolo)) return json(req, { valid: false, error: "Protocolo inválido." }, 400);
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await admin.from("cali_proposals").select("service_slug,sent_at,submission:cali_submissions!inner(protocol,company_name,created_at)").eq("submission.protocol", protocolo).not("sent_at", "is", null).limit(1);
    if (error) throw error;
    const row = data?.[0] as any;
    if (!row) return json(req, { valid: false }, 404);
    return json(req, { valid: true, protocol: row.submission.protocol, company_name: row.submission.company_name || null, service_title: SERVICE_LABELS[row.service_slug] || row.service_slug, issued_at: dataCurta(row.sent_at) });
  } catch (error) {
    console.error(error);
    return json(req, { valid: false, error: "Falha na verificação." }, 500);
  }
});
