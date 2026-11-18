import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.3";
import { Document, Font, Image, Link, Page, Path, StyleSheet, Svg, Text, View, pdf } from "npm:@react-pdf/renderer@4.3.0";
import { createElement as h } from "npm:react@18.3.1";
import QRCode from "npm:qrcode@1.5.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const PORTAL_URL = "https://portal.calirh.com";
const LOGO_URL = `${PORTAL_URL}/assets/logo-cali-bordo.png`;
const LIME_URL = `${PORTAL_URL}/assets/cali-lime-mark.svg`;

const BORDO = "#5A1E2D", DOURADO = "#B58C52", GRAFITE = "#2B2B2B", CINZA = "#6B5D63", LINHA = "#E6DDD3", MARFIM = "#F7F3EE";

function cors(req: Request) {
  const o = req.headers.get("origin") ?? "";
  const ok = o === PORTAL_URL || /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(o) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o);
  return { "Access-Control-Allow-Origin": ok ? o : PORTAL_URL, "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", Vary: "Origin" };
}
function currency(v: number) { return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function dataCurta(iso?: string) { return iso ? new Date(iso).toLocaleDateString("pt-BR") : ""; }
function dataHora(iso: string) { return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

async function sha256Hex(text: string) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

let limaPathCache: string | null = null;
async function limaPath() {
  if (limaPathCache) return limaPathCache;
  try {
    const svg = await fetch(LIME_URL).then((r) => r.text());
    const match = /\sd="([^"]+)"/.exec(svg);
    limaPathCache = match?.[1] ?? "";
  } catch { limaPathCache = ""; }
  return limaPathCache;
}

const s = StyleSheet.create({
  pagina: { fontFamily: "Helvetica", fontSize: 9.5, lineHeight: 1.55, color: GRAFITE, paddingTop: 84, paddingBottom: 66, paddingHorizontal: 54 },
  topo: { position: "absolute", top: 30, left: 54, right: 54, height: 36, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.75, borderBottomColor: DOURADO, paddingBottom: 8 },
  logo: { width: 60, height: 28 },
  topoTexto: { fontSize: 7.5, color: CINZA, letterSpacing: 0.3 },
  marca: { position: "absolute", right: 0, bottom: 0, width: 210, height: 210 },
  fio: { position: "absolute", bottom: 44, left: 54, right: 54, borderTopWidth: 0.5, borderTopColor: LINHA },
  rodape: { position: "absolute", bottom: 28, left: 54, fontSize: 7.5, lineHeight: 1.3, color: CINZA },
  paginaNum: { position: "absolute", top: 804, left: 54, right: 54, textAlign: "right", fontSize: 7.5, lineHeight: 1.3, color: CINZA },
  titulo: { fontWeight: 700, fontSize: 22, lineHeight: 1.2, letterSpacing: -0.3, color: BORDO },
  linha2: { fontWeight: 700, fontSize: 11.5, color: GRAFITE, marginTop: 8 },
  cabecalho: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16 },
  ident: { alignItems: "flex-end", gap: 4, paddingTop: 4 },
  identLinha: { flexDirection: "row", alignItems: "baseline", gap: 5 },
  rotulo: { fontSize: 6.8, fontWeight: 700, color: DOURADO, letterSpacing: 0.8, textTransform: "uppercase" },
  valor: { fontSize: 8.2, color: GRAFITE, marginTop: 1 },
  p: { marginBottom: 7 },
  h1: { fontWeight: 700, fontSize: 12.5, lineHeight: 1.3, color: BORDO, marginTop: 15, marginBottom: 6 },
  itemLista: { flexDirection: "row", marginBottom: 3 },
  marcador: { width: 16, color: DOURADO, fontWeight: 700 },
  registro: { marginTop: 10, padding: 10, borderWidth: 0.75, borderColor: LINHA, borderRadius: 5, flexDirection: "row", gap: 16, alignItems: "center" },
  regNome: { fontWeight: 600, fontSize: 11.5, color: BORDO, marginTop: 3 },
  regCargo: { fontSize: 8.5, color: GRAFITE },
  regLinha: { fontSize: 7.4, lineHeight: 1.45, color: CINZA },
  regAvaliar: { fontSize: 7.6, lineHeight: 1.45, fontWeight: 700, color: BORDO },
  qr: { width: 60, height: 60 },
  investBox: { backgroundColor: MARFIM, borderWidth: 0.75, borderColor: "#E9DDB0", borderRadius: 6, paddingVertical: 12, paddingHorizontal: 14, marginTop: 6, marginBottom: 10 },
  investValor: { fontSize: 18, fontWeight: 700, color: BORDO },
});

function Lista({ itens }: { itens: string[] }) {
  return h(View, { style: { marginBottom: 6 } }, itens.map((item, i) => h(View, { key: i, style: s.itemLista, wrap: false },
    h(Text, { style: s.marcador }, `${i + 1}.`),
    h(Text, { style: { flex: 1 } }, item),
  )));
}

async function buildPdf(proposal: any, submission: any, service_title: string) {
  const protocolo = submission.protocol as string;
  const calc = proposal.calculator_data || {};
  const urlVerificar = `${PORTAL_URL}/v/${protocolo}`;
  const qr = await QRCode.toDataURL(urlVerificar, { margin: 0, width: 240, color: { dark: "#5A1E2D", light: "#FFFFFF" } });
  const emitidoEm = new Date().toISOString();
  const hash = await sha256Hex(JSON.stringify({ id: proposal.id, final_unit: proposal.final_unit, scope_items: proposal.scope_items, emitidoEm }));
  const d = await limaPath();

  const scope: string[] = Array.isArray(proposal.scope_items) ? proposal.scope_items : [];
  const painPoints: string[] = Array.isArray(calc.painPoints) ? calc.painPoints : [];
  const nextSteps: string[] = Array.isArray(calc.expectedResults) ? calc.expectedResults : [];

  const el = h(Document, { title: `Proposta CALI — ${service_title}`, author: "CALI RH", creator: "Portal CALI", producer: "Portal CALI", language: "pt-BR", subject: protocolo },
    h(Page, { size: "A4", style: s.pagina },
      h(View, { fixed: true, style: s.topo },
        h(Image, { src: LOGO_URL, style: s.logo }),
        h(Text, { style: s.topoTexto }, submission.company_name ? `Confidencial · ${submission.company_name}` : "Confidencial"),
      ),
      d ? h(View, { fixed: true, style: s.marca }, h(Svg, { viewBox: "0 0 256 256", style: { width: 210, height: 210 } }, h(Path, { d, fill: BORDO, fillOpacity: 0.045 }))) : null,
      h(View, { fixed: true, style: s.fio }),
      h(Text, { fixed: true, style: s.rodape }, `CALI RH · calirh.com · Protocolo ${protocolo}`),
      h(Text, { fixed: true, style: s.paginaNum, render: ({ pageNumber, totalPages }: any) => `Página ${pageNumber} de ${totalPages}` }),

      h(View, { style: s.cabecalho },
        h(View, { style: { flex: 1 } },
          h(Text, { style: s.titulo }, "Sua proposta CALI"),
          h(Text, { style: s.linha2 }, service_title),
        ),
        h(View, { style: s.ident },
          h(View, { style: s.identLinha }, h(Text, { style: s.rotulo }, "Emissão"), h(Text, { style: s.valor }, dataCurta(emitidoEm))),
          h(View, { style: s.identLinha }, h(Text, { style: s.rotulo }, "Empresa"), h(Text, { style: s.valor }, submission.company_name || "—")),
        ),
      ),

      h(Text, { style: s.h1 }, "O que entendemos"),
      h(Text, { style: s.p }, calc.contextSummary || "Contexto reunido a partir do briefing recebido."),
      painPoints.length ? h(Text, { style: s.h1 }, "Dores e prioridades") : null,
      painPoints.length ? h(Lista, { itens: painPoints }) : null,

      h(Text, { style: s.h1 }, "Solução recomendada"),
      h(Text, { style: s.p }, proposal.public_notes || calc.cycleObjective || "Solução desenhada a partir do contexto apresentado."),

      scope.length ? h(Text, { style: s.h1 }, "Escopo incluído") : null,
      scope.length ? h(Lista, { itens: scope }) : null,

      h(Text, { style: s.h1 }, "Investimento"),
      h(View, { style: s.investBox },
        h(Text, { style: s.investValor }, currency(proposal.final_unit)),
        h(Text, { style: { fontSize: 8.5, color: CINZA, marginTop: 4 } }, proposal.payment_terms || "Condições conforme cronograma definido na proposta."),
      ),

      nextSteps.length ? h(Text, { style: s.h1 }, "Próximos passos") : null,
      nextSteps.length ? h(Lista, { itens: nextSteps }) : null,

      h(View, { style: s.registro, wrap: false },
        h(View, { style: { flex: 1 } },
          h(Text, { style: s.rotulo }, "Registro eletrônico de emissão"),
          h(Text, { style: s.regNome }, "Patrícia Lima"),
          h(Text, { style: s.regCargo }, "People Advisory Executive · CALI RH"),
          h(View, { style: { marginTop: 5 } },
            h(Text, { style: s.regLinha }, `Registro gerado em ${dataHora(emitidoEm)} (horário de Brasília) · Protocolo ${protocolo}`),
            h(Text, { style: s.regLinha }, `Código de integridade: ${hash.slice(0, 32)}`),
            h(Link, { src: urlVerificar, style: s.regAvaliar }, "Confira a autenticidade desta proposta"),
          ),
        ),
        h(Image, { src: qr, style: s.qr }),
      ),
    ),
  );
  return pdf(el as never).toBlob();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  try {
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const url = new URL(req.url);
    const protocolParam = url.searchParams.get("protocolo");
    let query = admin.from("cali_proposals").select("*,submission:cali_submissions(*)").order("created_at", { ascending: false }).limit(1);
    if (protocolParam) query = admin.from("cali_proposals").select("*,submission:cali_submissions!inner(*)").eq("submission.protocol", protocolParam).limit(1);
    const { data, error } = await query;
    if (error) throw error;
    const proposal = data?.[0];
    if (!proposal || !proposal.submission) return new Response(JSON.stringify({ error: "Nenhuma proposta encontrada." }), { status: 404, headers: { ...cors(req), "Content-Type": "application/json" } });
    const serviceTitles: Record<string, string> = { "assessoria-estrategica": "Assessoria Estratégica Mensal — HR as a Service", "cali-build": "CALI Build", "mentoria-rh": "Mentoria para Profissionais de RH" };
    const blob = await buildPdf(proposal, proposal.submission, serviceTitles[proposal.service_slug] || proposal.service_slug);
    const bytes = await blob.arrayBuffer();
    return new Response(bytes, { headers: { ...cors(req), "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="teste-${proposal.submission.protocol}.pdf"` } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: String((error as Error)?.stack || error) }), { status: 500, headers: { ...cors(req), "Content-Type": "application/json" } });
  }
});
