import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function cors(req: Request) {
  const o = req.headers.get("origin") ?? "";
  const ok = o === "https://portal.calirh.com" || /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(o) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o);
  return { "Access-Control-Allow-Origin": ok ? o : "https://portal.calirh.com", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "GET, OPTIONS", Vary: "Origin" };
}
function json(req: Request, body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json" } }); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  try {
    const protocolo = new URL(req.url).searchParams.get("protocolo") || "";
    if (!/^[A-Za-z0-9-]{6,80}$/.test(protocolo)) return json(req, null, 400);
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await admin.from("cali_emissoes").select("protocolo,titulo,cliente,signatario_nome,signatario_cargo,hash,emitido_em").eq("protocolo", protocolo).maybeSingle();
    if (error) throw error;
    if (!data) return json(req, null, 404);
    return json(req, data);
  } catch (error) {
    console.error(error);
    return json(req, null, 500);
  }
});
