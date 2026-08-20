import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ADMIN_EMAIL = "patricia@calirh.com";
const PORTAL_URL = "https://portal.calirh.com";
const BRAND_LOGO_URL = `${PORTAL_URL}/assets/logo-cali-light.png`;
const ALLOWED_ORIGINS = new Set([PORTAL_URL, "https://cali-portal.vercel.app", "https://propostas.calirh.com"]);

function isAllowedOrigin(origin: string) {
  return ALLOWED_ORIGINS.has(origin) || /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}
function cors(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : PORTAL_URL,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}
function response(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(request), "Content-Type": "application/json; charset=utf-8" } });
}
function emailHtml(link: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light only"><title>Seu acesso ao Painel CALI</title></head><body bgcolor="#F7F3EE" style="margin:0;background:#F7F3EE;font-family:Arial,sans-serif;color:#2B2B2B"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#F7F3EE"><tr><td style="padding:28px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:auto;background:#fff;border:1px solid #EDE4DE;border-radius:14px;overflow:hidden"><tr><td bgcolor="#5A1E2D" style="padding:25px;text-align:center"><img src="${BRAND_LOGO_URL}" width="174" alt="CALI — HR for Business" style="display:block;width:174px;max-width:70%;height:auto;margin:0 auto;border:0"></td></tr><tr><td style="padding:34px 32px"><p style="margin:0 0 18px;font-size:17px"><strong>Olá, Patrícia.</strong></p><p style="line-height:1.7;margin:0 0 16px">Use o botão abaixo para definir uma nova senha e acessar o painel administrativo do Portal CALI.</p><table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0"><tr><td bgcolor="#5A1E2D" style="border-radius:999px"><a href="${link}" style="display:inline-block;padding:13px 24px;color:#fff;text-decoration:none;font-weight:bold;font-size:13px">Definir minha senha</a></td></tr></table><p style="font-size:11px;line-height:1.65;color:#7A6F72;margin:24px 0 0">Este link é pessoal e temporário. Se você não solicitou a recuperação, pode ignorar esta mensagem.</p></td></tr><tr><td bgcolor="#F7F3EE" style="padding:17px 28px;text-align:center;font-size:10px;color:#8D8184">CALI · HR for Business · calirh.com · patricia@calirh.com</td></tr></table></td></tr></table></body></html>`;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors(request) });
  if (request.method !== "POST") return response(request, { error: "Método não permitido." }, 405);
  const origin = request.headers.get("origin") ?? "";
  if (!isAllowedOrigin(origin)) return response(request, { error: "Origem não autorizada." }, 403);

  try {
    const body = await request.json().catch(() => ({}));
    if (String(body.website ?? "").trim()) return response(request, { ok: true });

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count, error: countError } = await admin.from("cali_activity").select("id", { count: "exact", head: true }).eq("event_type", "admin_access_requested").gte("created_at", since);
    if (countError) throw countError;
    if ((count ?? 0) >= 1) return response(request, { error: "Um link já foi enviado. Aguarde 5 minutos antes de solicitar outro." }, 429);

    const { data, error } = await admin.auth.admin.generateLink({ type: "recovery", email: ADMIN_EMAIL });
    if (error) throw error;
    const tokenHash = data.properties?.hashed_token;
    if (!tokenHash) throw new Error("Token de recuperação ausente.");
    const link = `${PORTAL_URL}/redefinir-senha#token_hash=${encodeURIComponent(tokenHash)}&type=recovery`;

    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY não configurada.");
    const resend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `admin-access-${crypto.randomUUID()}` },
      body: JSON.stringify({
        from: "Portal CALI <patricia@calirh.com>",
        to: [ADMIN_EMAIL],
        reply_to: ADMIN_EMAIL,
        subject: "Seu acesso ao Painel CALI",
        html: emailHtml(link),
      }),
    });
    const email = await resend.json().catch(() => ({}));
    if (!resend.ok) throw new Error(`Resend ${resend.status}: ${JSON.stringify(email)}`);

    await admin.from("cali_activity").insert({ event_type: "admin_access_requested", metadata: { channel: "email", email_id: email.id ?? null } });
    return response(request, { ok: true });
  } catch (error) {
    console.error(error);
    return response(request, { error: "Não foi possível enviar o link agora. Tente novamente em alguns minutos." }, 500);
  }
});
