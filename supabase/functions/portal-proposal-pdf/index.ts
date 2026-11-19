import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.3";
import { Document, Image, Page, Path, StyleSheet, Svg, Text, View, pdf } from "npm:@react-pdf/renderer@4.3.0";
import { createElement as h } from "npm:react@18.3.1";
import QRCode from "npm:qrcode@1.5.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const PORTAL_URL = "https://portal.calirh.com";
const LOGO_URL = `${PORTAL_URL}/assets/logo-cali-bordo.png`;
const LOGO_LIGHT_URL = `${PORTAL_URL}/assets/logo-cali-light.png`;
const LIME_URL = `${PORTAL_URL}/assets/cali-lime-mark.svg`;

const BORDO = "#5A1E2D", DOURADO = "#B58C52", GRAFITE = "#2B2B2B", CINZA = "#6B5D63", LINHA = "#E6DDD3", MARFIM = "#F7F3EE";

const SERVICE_LABELS: Record<string, string> = { "assessoria-estrategica": "Assessoria Estratégica Mensal — HR as a Service", "cali-build": "CALI Build — Estruturação Assistida de RH", "mentoria-rh": "Mentoria para Profissionais de RH", "diagnostico-executivo": "Diagnóstico Executivo de Pessoas", "cultura-direcao": "Projeto de Cultura e Direção", "shadowing-lideranca": "Shadowing de Liderança", "treinamentos": "Treinamentos & Palestras", "marca-empregadora": "Marca Empregadora", "solucao-personalizada": "Solução Personalizada" };

const PACKAGE_META: Record<string, { kicker: string; label: string; tagline: string }> = {
  PARTNER: { kicker: "PEOPLE ADVISORY RECORRENTE", label: "CALI PARTNER", tagline: "Direção estratégica de People para organizar prioridades, fortalecer lideranças." },
  FULL: { kicker: "PEOPLE ADVISORY RECORRENTE", label: "CALI FULL", tagline: "Direção estratégica de People com maior cadência, para organizar até duas prioridades simultâneas." },
  ESSENCIAL: { kicker: "ESTRUTURAÇÃO ASSISTIDA DE RH", label: "CALI BUILD ESSENCIAL", tagline: "Estruturação assistida de uma frente prioritária por ciclo, com método e revisão técnica da CALI." },
  COMPLETO: { kicker: "ESTRUTURAÇÃO ASSISTIDA DE RH", label: "CALI BUILD COMPLETO", tagline: "Estruturação assistida de uma agenda mais ampla de RH, com maior cadência de supervisão técnica." },
};

function cors(req: Request) {
  const o = req.headers.get("origin") ?? "";
  const ok = o === PORTAL_URL || /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(o) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o);
  return { "Access-Control-Allow-Origin": ok ? o : PORTAL_URL, "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", Vary: "Origin" };
}
function currency(v: number) { return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function dataCurta(iso?: string) { return iso ? new Date(iso).toLocaleDateString("pt-BR") : ""; }
function dataHora(iso: string) { return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
function primeiroNome(nome: string) { return String(nome || "").trim().split(/\s+/)[0] || "cliente"; }

async function sha256Hex(text: string) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

let limaPathCache: string | null = null;
async function limaPath() {
  if (limaPathCache !== null) return limaPathCache;
  try {
    const svg = await fetch(LIME_URL).then((r) => r.text());
    const match = /\sd="([^"]+)"/.exec(svg);
    limaPathCache = match?.[1] ?? "";
  } catch { limaPathCache = ""; }
  return limaPathCache;
}

const s = StyleSheet.create({
  pagina: { fontFamily: "Helvetica", fontSize: 9.5, lineHeight: 1.55, color: GRAFITE, paddingBottom: 60 },
  paginaInner: { fontFamily: "Helvetica", fontSize: 9.5, lineHeight: 1.55, color: GRAFITE, paddingTop: 40, paddingBottom: 30, paddingHorizontal: 54 },
  capaInner: { fontFamily: "Helvetica", fontSize: 9.5, lineHeight: 1.55, color: GRAFITE, paddingTop: 30, paddingHorizontal: 54 },
  marca: { position: "absolute", right: 0, bottom: 0, width: 220, height: 220 },
  rodapeLinha: { flexDirection: "row", justifyContent: "space-between", marginTop: 18, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: LINHA },
  rodape: { fontSize: 7.4, lineHeight: 1.3, color: CINZA },
  paginaNum: { fontSize: 7.4, lineHeight: 1.3, color: CINZA },

  // Page 1 cover band
  capaBand: { backgroundColor: BORDO, paddingTop: 34, paddingHorizontal: 54, paddingBottom: 26 },
  capaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottomWidth: 0.75, borderBottomColor: "#7A3F4F" },
  capaLogo: { width: 90, height: 42.5, objectFit: "contain" },
  capaProtocolo: { fontSize: 8, color: "#E9D7CE", textAlign: "right" },
  capaDatas: { fontSize: 7.4, color: "#CBA9A3", textAlign: "right", marginTop: 2 },
  capaEyebrow: { fontSize: 8.5, fontWeight: 700, letterSpacing: 1.4, color: "#DCC08E", marginTop: 22 },
  capaTitulo: { fontSize: 27, fontWeight: 700, color: "#FFFFFF", marginTop: 8, lineHeight: 1.15 },
  capaIntro: { fontSize: 10, lineHeight: 1.6, color: "#EAD9D1", marginTop: 10, maxWidth: 420 },
  capaPacoteWrap: { marginTop: 22, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: DOURADO },
  capaPacoteKicker: { fontSize: 7.4, fontWeight: 700, letterSpacing: 1, color: "#DCC08E" },
  capaPacoteLabel: { fontSize: 15, fontWeight: 700, color: "#FFFFFF", marginTop: 2 },

  // Section headers (inner pages)
  secHead: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 14 },
  secNum: { fontSize: 26, fontWeight: 700, color: DOURADO, lineHeight: 1.1 },
  secEyebrow: { fontSize: 7.6, fontWeight: 700, letterSpacing: 1.1, color: DOURADO },
  secTitulo: { fontSize: 17, fontWeight: 700, color: BORDO, marginTop: 3 },
  secIntro: { fontSize: 8.8, lineHeight: 1.6, color: CINZA, marginTop: 5, maxWidth: 440 },
  secDivider: { borderTopWidth: 0.5, borderTopColor: LINHA, marginBottom: 14 },

  topoInner: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 10, borderBottomWidth: 0.5, borderBottomColor: LINHA },
  logo: { width: 58, height: 27, objectFit: "contain" },
  topoDireita: { alignItems: "flex-end" },
  topoProtocolo: { fontSize: 7.6, fontWeight: 700, color: BORDO },
  topoDatas: { fontSize: 7, color: CINZA, marginTop: 1 },
  goldBar: { position: "absolute", top: 0, left: 0, right: 0, height: 5, backgroundColor: DOURADO },

  blocoRotulo: { fontSize: 7.6, fontWeight: 700, letterSpacing: 0.8, color: DOURADO, textTransform: "uppercase", marginBottom: 5, marginTop: 14 },
  blocoTitulo: { fontSize: 12.5, fontWeight: 700, color: BORDO, marginBottom: 4 },
  p: { marginBottom: 7, fontSize: 9, lineHeight: 1.6 },

  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: { width: "48%", backgroundColor: MARFIM, borderRadius: 5, paddingVertical: 8, paddingHorizontal: 10, fontSize: 8.4, color: GRAFITE },

  dualBox: { flexDirection: "row", gap: 10, marginTop: 4 },
  dualBoxLeft: { width: 170 },
  mapaCard: { borderTopWidth: 3, borderTopColor: "#B98E9B", backgroundColor: "#F3E9ED", borderRadius: 5, padding: 12 },
  mapaRotulo: { fontSize: 7, fontWeight: 700, letterSpacing: 0.6, color: "#8B5A6B", marginBottom: 10 },
  mapaScore: { fontSize: 26, fontWeight: 700, color: BORDO, lineHeight: 1.15 },
  mapaScoreSub: { fontSize: 8, color: CINZA },
  mapaQuadrante: { fontSize: 9.5, fontWeight: 700, color: BORDO, marginTop: 36 },
  leituraBox: { flex: 1, borderLeftWidth: 1, borderLeftColor: LINHA, paddingLeft: 14, paddingVertical: 2 },
  leituraRotulo: { fontSize: 7, fontWeight: 700, letterSpacing: 0.6, color: CINZA, marginBottom: 6 },
  leituraTexto: { fontSize: 8.6, lineHeight: 1.6, color: GRAFITE },

  pairRow: { flexDirection: "row", gap: 12, marginTop: 4, marginBottom: 6 },
  pairBox: { flex: 1, borderWidth: 0.75, borderColor: LINHA, borderRadius: 5, padding: 12 },
  pairRotulo: { fontSize: 7, fontWeight: 700, letterSpacing: 0.6, color: DOURADO, marginBottom: 6, textTransform: "uppercase" },
  pairTexto: { fontSize: 8.4, lineHeight: 1.6, color: GRAFITE },

  numRowNarrow: { backgroundColor: MARFIM, borderRadius: 5, padding: 10, marginBottom: 6, flexDirection: "row", gap: 10, width: "52%" },
  numRowWide: { borderRadius: 5, padding: 10, marginBottom: 6, flexDirection: "row", gap: 10, backgroundColor: MARFIM, borderLeftWidth: 2, borderLeftColor: DOURADO },
  numeral: { fontSize: 11, fontWeight: 700, color: DOURADO, width: 16 },
  numTexto: { fontSize: 8.6, lineHeight: 1.5, color: GRAFITE, flex: 1 },
  numTitulo: { fontSize: 9, fontWeight: 700, color: BORDO },

  twoColWrap: { flexDirection: "row", gap: 14 },
  twoColItem: { flexDirection: "row", gap: 9, paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: LINHA },

  bulletRow: { flexDirection: "row", gap: 7, marginBottom: 7, paddingRight: 8 },
  bulletDot: { fontSize: 9, color: DOURADO, width: 10 },
  bulletDotBordo: { fontSize: 9, color: BORDO, width: 10 },
  bulletTexto: { fontSize: 8.4, lineHeight: 1.55, color: GRAFITE, flex: 1 },

  investBox: { backgroundColor: BORDO, borderRadius: 6, overflow: "hidden", marginTop: 6 },
  investTopo: { height: 6, backgroundColor: DOURADO },
  investConteudo: { padding: 16 },
  investRotulo: { fontSize: 7.6, fontWeight: 700, letterSpacing: 1, color: "#DCC08E" },
  investValorLinha: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 4 },
  investValor: { fontSize: 24, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15 },
  investPorMes: { fontSize: 9, color: "#E9D7CE" },
  investDivider: { borderTopWidth: 0.5, borderTopColor: "#7A3F4F", marginTop: 12, marginBottom: 10 },
  investRefRow: { flexDirection: "row", justifyContent: "space-between" },
  investRefCol: {},
  investRefRotulo: { fontSize: 7, fontWeight: 700, letterSpacing: 0.6, color: "#DCC08E", marginBottom: 2 },
  investRefValor: { fontSize: 10.5, fontWeight: 700, color: "#FFFFFF" },

  ativacaoBox: { borderWidth: 0.75, borderColor: DOURADO, borderLeftWidth: 3, borderRadius: 4, padding: 10, marginTop: 10, flexDirection: "row", gap: 14, alignItems: "center" },
  ativacaoLeft: { width: 110 },
  ativacaoRotulo: { fontSize: 7, fontWeight: 700, letterSpacing: 0.6, color: DOURADO, textTransform: "uppercase" },
  ativacaoValor: { fontSize: 16, fontWeight: 700, color: BORDO, marginTop: 2, lineHeight: 1.15 },
  ativacaoTexto: { fontSize: 7.6, lineHeight: 1.5, color: CINZA, flex: 1 },

  cardsLinha: { flexDirection: "row", gap: 8, marginTop: 10, marginBottom: 4 },
  card: { flex: 1, borderWidth: 0.75, borderColor: LINHA, borderRadius: 5, padding: 9 },
  cardRotulo: { fontSize: 6.6, fontWeight: 700, color: CINZA, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 },
  cardValor: { fontSize: 8.8, fontWeight: 700, color: BORDO },

  passoRow: { flexDirection: "row", gap: 14, paddingVertical: 10, borderTopWidth: 1.25, borderTopColor: DOURADO },
  passoRowFirst: { flexDirection: "row", gap: 14, paddingVertical: 10, paddingTop: 0, borderTopWidth: 0 },
  passoNum: { fontSize: 14, fontWeight: 700, color: DOURADO, width: 20 },
  passoTitulo: { fontSize: 10.5, fontWeight: 700, color: BORDO, marginBottom: 2 },
  passoTexto: { fontSize: 8.6, color: CINZA, lineHeight: 1.5 },

  bonusBox: { backgroundColor: MARFIM, borderLeftWidth: 2.5, borderLeftColor: BORDO, borderRadius: 4, padding: 12, marginTop: 10 },
  bonusRotulo: { fontSize: 7, fontWeight: 700, letterSpacing: 0.6, color: CINZA, textTransform: "uppercase", marginBottom: 4 },
  bonusTitulo: { fontSize: 10.5, fontWeight: 700, color: BORDO, marginBottom: 4 },
  bonusDescricao: { fontSize: 8, lineHeight: 1.55, color: GRAFITE },

  assinaturaRow: { marginTop: 14 },
  assinaturaNome: { fontSize: 17, fontWeight: 700, color: BORDO, lineHeight: 1.15 },
  assinaturaCargo: { fontSize: 8.5, color: CINZA, marginTop: 2 },

  registro: { marginTop: 10, padding: 10, borderWidth: 0.75, borderColor: LINHA, borderRadius: 5, flexDirection: "row", gap: 16, alignItems: "center" },
  regRotulo: { fontSize: 6.8, fontWeight: 700, color: DOURADO, letterSpacing: 0.8, textTransform: "uppercase" },
  regLinha: { fontSize: 7.2, lineHeight: 1.45, color: CINZA },
  qr: { width: 56, height: 56 },
});

function Watermark({ d }: { d: string }) {
  if (!d) return null;
  return h(View, { fixed: true, style: s.marca }, h(Svg, { viewBox: "0 0 256 256", style: { width: 220, height: 220 } }, h(Path, { d, fill: BORDO, fillOpacity: 0.045 })));
}

function Footer({ protocolo }: { protocolo: string }) {
  return h(View, { style: s.rodapeLinha },
    h(Text, { style: s.rodape }, `Patrícia Lima · CALI RH · patricia@calirh.com`),
    h(Text, { style: s.paginaNum }, protocolo),
  );
}

function TopoInner({ protocolo, emitidoEm, validade }: { protocolo: string; emitidoEm: string; validade: string }) {
  return h(View, { fixed: true, style: s.topoInner },
    h(Image, { src: LOGO_URL, style: s.logo }),
    h(View, { style: s.topoDireita },
      h(Text, { style: s.topoProtocolo }, protocolo),
      h(Text, { style: s.topoDatas }, `${dataCurta(emitidoEm)} · válida até ${validade}`),
    ),
  );
}

function SecHead({ num, eyebrow, titulo, intro }: { num: string; eyebrow: string; titulo: string; intro?: string }) {
  return h(View, null,
    h(View, { style: s.secHead },
      h(Text, { style: s.secNum }, num),
      h(View, { style: { flex: 1 } },
        h(Text, { style: s.secEyebrow }, eyebrow),
        h(Text, { style: s.secTitulo }, titulo),
        intro ? h(Text, { style: s.secIntro }, intro) : null,
      ),
    ),
    h(View, { style: s.secDivider }),
  );
}

function numberedWide(items: string[]) {
  return items.map((item, i) => h(View, { key: i, style: s.numRowWide, wrap: false }, h(Text, { style: s.numeral }, String(i + 1).padStart(2, "0")), h(Text, { style: s.numTexto }, item)));
}
function numberedNarrow(items: string[]) {
  return items.map((item, i) => h(View, { key: i, style: s.numRowNarrow, wrap: false }, h(Text, { style: s.numeral }, String(i + 1).padStart(2, "0")), h(Text, { style: s.numTexto }, item)));
}
function twoColNumbered(items: string[]) {
  const left = items.filter((_, i) => i % 2 === 0), right = items.filter((_, i) => i % 2 === 1);
  const col = (arr: string[], offset: number) => arr.map((item, i) => h(View, { key: i, style: s.twoColItem, wrap: false }, h(Text, { style: s.numeral }, String(i * 2 + 1 + offset).padStart(2, "0")), h(Text, { style: s.numTexto }, item)));
  return h(View, { style: s.twoColWrap, wrap: false }, h(View, { style: { flex: 1 } }, col(left, 0)), h(View, { style: { flex: 1 } }, col(right, 1)));
}
function twoColBullets(items: string[], bordo = false) {
  const left = items.filter((_, i) => i % 2 === 0), right = items.filter((_, i) => i % 2 === 1);
  const col = (arr: string[]) => arr.map((item, i) => h(View, { key: i, style: s.bulletRow, wrap: false }, h(Text, { style: bordo ? s.bulletDotBordo : s.bulletDot }, "•"), h(Text, { style: s.bulletTexto }, item)));
  return h(View, { style: s.twoColWrap, wrap: false }, h(View, { style: { flex: 1 } }, col(left)), h(View, { style: { flex: 1 } }, col(right)));
}
function bullets(items: string[]) {
  return items.map((item, i) => h(View, { key: i, style: s.bulletRow, wrap: false }, h(Text, { style: s.bulletDot }, "•"), h(Text, { style: s.bulletTexto }, item)));
}

function condicoesImportantes(months: number, hours: number, payment: any, hasScope: boolean) {
  const due = payment?.method === "monthly" ? (payment.monthlyDue || "1º dia útil de cada mês") : "conforme condição de pagamento acordada";
  return [
    `Contrato mínimo de ${months || 1} ${months === 1 ? "mês" : "meses"}, com renovação automática e vigência por prazo indeterminado após o período mínimo.`,
    "Cancelamento após o prazo mínimo mediante aviso prévio de 30 dias.",
    "Reajuste a cada 12 meses, conforme índice e condições definidos em contrato.",
    "Demandas fora da carga mensal, visitas adicionais e projetos extraordinários são orçados separadamente.",
    "A priorização das frentes é revista com a liderança ao longo do ciclo.",
    `Mensalidades pagas antecipadamente, com vencimento ${due}.`,
    `A mensalidade considera a atuação dentro das ${hours || 1} horas mensais contratadas${hasScope ? " e das frentes priorizadas" : ""}. Ampliações relevantes de escopo ou volume serão previamente alinhadas entre as partes.`,
  ];
}

async function obterCarimbo(admin: ReturnType<typeof createClient>, proposal: any, submission: any, titulo: string) {
  const protocolo = submission.protocol as string;
  const { data: existente } = await admin.from("cali_emissoes").select("protocolo,hash,emitido_em,titulo,cliente,signatario_nome,signatario_cargo").eq("protocolo", protocolo).maybeSingle();
  if (existente) return existente;
  const emitido_em = new Date().toISOString();
  const hash = await sha256Hex(JSON.stringify({ id: proposal.id, final_unit: proposal.final_unit, scope_items: proposal.scope_items, emitido_em }));
  const row = { proposal_id: proposal.id, protocolo, hash, emitido_em, titulo, cliente: submission.company_name || null, signatario_nome: "Patrícia Lima", signatario_cargo: "People Advisory Executive · CALI RH" };
  const { data: inserido, error } = await admin.from("cali_emissoes").insert(row).select("protocolo,hash,emitido_em,titulo,cliente,signatario_nome,signatario_cargo").single();
  if (!error) return inserido;
  const { data: corrida } = await admin.from("cali_emissoes").select("protocolo,hash,emitido_em,titulo,cliente,signatario_nome,signatario_cargo").eq("protocolo", protocolo).maybeSingle();
  if (corrida) return corrida;
  throw error;
}

async function buildPdf(admin: ReturnType<typeof createClient>, proposal: any, submission: any, service_title: string) {
  const protocolo = submission.protocol as string;
  const calc = proposal.calculator_data || {};
  const urlVerificar = `${PORTAL_URL}/v/${protocolo}`;
  const qr = await QRCode.toDataURL(urlVerificar, { margin: 0, width: 240, color: { dark: "#5A1E2D", light: "#FFFFFF" } });
  const carimbo = await obterCarimbo(admin, proposal, submission, `Proposta CALI — ${service_title}`);
  const emitidoEm = carimbo.emitido_em as string;
  const hash = carimbo.hash as string;
  const d = await limaPath();

  const empresa = submission.company_name || "a empresa";
  const nome = submission.contact_name || "";
  const criadaEm = proposal.created_at || submission.created_at || emitidoEm;
  const validade = dataCurta(new Date(new Date(criadaEm).getTime() + Number(proposal.validity_days || 15) * 86400000).toISOString());
  const pkg = PACKAGE_META[proposal.package_code] || { kicker: "SOLUÇÃO CALI", label: service_title, tagline: "" };

  const clean = (arr: unknown) => Array.isArray(arr) ? arr.map((v) => String(v ?? "").trim()).filter((v) => v && !/^[.\-–—•\s]*$/.test(v)) : [];
  const scope: string[] = clean(proposal.scope_items);
  const painPoints: string[] = clean(calc.painPoints);
  const expectedResults: string[] = clean(calc.expectedResults);
  const advantages: string[] = clean(calc.advantages);
  const cadence: string[] = clean(calc.cadence);
  const cycles: { title: string }[] = (Array.isArray(calc.cycles) ? calc.cycles : []).filter((c: any) => { const t = String(c?.title ?? "").trim(); return t && !/^[.\-–—•\s]*$/.test(t); });
  const caliResponsibilities: string[] = clean(calc.caliResponsibilities);
  const clientResponsibilities: string[] = clean(calc.clientResponsibilities);
  const roadmapItems: string[] = clean(calc.roadmapItems);
  const outOfScope: string[] = clean(calc.outOfScope);
  const bonus = calc.bonus;
  const mapa = calc.mapaPeople;
  const payment = calc.payment || {};

  const subtotal = Number(proposal.subtotal ?? proposal.final_unit ?? 0);
  const finalUnit = Number(proposal.final_unit ?? 0);
  const discountValue = Math.max(0, subtotal - finalUnit);
  const hours = Number(calc.monthlyHours || 0);
  const months = Number(proposal.contract_months || 0);
  const isRecorrente = payment.method === "monthly";
  const natureza = isRecorrente ? "Atuação recorrente" : months > 1 ? "Atuação recorrente" : "Projeto com entrega definida";
  const ativacaoValor = isRecorrente ? Math.round(finalUnit * 0.2) : 0;

  const protocoloHeader = h(View, { style: s.capaTopo },
    h(Image, { src: LOGO_LIGHT_URL, style: s.capaLogo }),
    h(View, null, h(Text, { style: s.capaProtocolo }, protocolo), h(Text, { style: s.capaDatas }, `${dataCurta(criadaEm)} · válida até ${validade}`)),
  );

  const paginas: unknown[] = [];

  // PÁGINA 1 — CAPA
  paginas.push(h(Page, { key: "p1", size: "A4", style: s.pagina },
    h(View, { style: s.capaBand },
      protocoloHeader,
      h(Text, { style: s.capaEyebrow }, "PROPOSTA CALI RH"),
      h(Text, { style: s.capaTitulo }, `Olá, ${primeiroNome(nome)}.`),
      h(Text, { style: s.capaIntro }, `Preparamos esta proposta para ${empresa}, a partir do contexto compartilhado no briefing.`),
      h(View, { style: s.capaPacoteWrap }, h(Text, { style: s.capaPacoteKicker }, pkg.kicker), h(Text, { style: s.capaPacoteLabel }, pkg.label)),
    ),
    h(View, { style: s.capaInner },
      h(Watermark, { d }),
      h(SecHead, { num: "01", eyebrow: "LEITURA DO CONTEXTO", titulo: "O que entendemos até aqui" }),
      h(Text, { style: s.p }, calc.contextSummary || "Contexto reunido a partir do briefing recebido."),
      painPoints.length ? h(Text, { style: s.blocoRotulo }, "SINAIS QUE ORIENTAM ESTA PROPOSTA") : null,
      painPoints.length ? h(View, { style: s.chipGrid, wrap: false }, ...painPoints.map((p, i) => h(Text, { key: i, style: s.chip }, p))) : null,
      h(View, { style: [s.dualBox, { marginTop: 16 }], wrap: false },
        mapa?.include ? h(View, { style: s.dualBoxLeft },
          h(View, { style: s.mapaCard },
            h(Text, { style: s.mapaRotulo }, "MAPA DE PEOPLE"),
            h(Text, { style: s.mapaScore }, `${Number(mapa.score).toLocaleString("pt-BR")}/10`),
            h(Text, { style: s.mapaQuadrante }, mapa.quadrant),
          ),
        ) : null,
        h(View, { style: s.leituraBox },
          h(Text, { style: s.leituraRotulo }, "LEITURA CALI"),
          h(Text, { style: s.leituraTexto }, calc.executiveReading || "—"),
        ),
      ),
    ),
    h(Footer, { protocolo }),
  ));

  // PÁGINA 2 — SOLUÇÃO RECOMENDADA
  paginas.push(h(Page, { key: "p2", size: "A4", style: s.paginaInner },
    h(Watermark, { d }),
    h(TopoInner, { protocolo, emitidoEm: criadaEm, validade }),
    h(SecHead, { num: "02", eyebrow: "SOLUÇÃO RECOMENDADA", titulo: pkg.label, intro: pkg.tagline || undefined }),
    h(Text, { style: s.p }, proposal.public_notes || calc.cycleObjective || "Solução desenhada a partir do contexto apresentado."),
    h(View, { style: s.pairRow, wrap: false },
      calc.whyNow ? h(View, { style: s.pairBox }, h(Text, { style: s.pairRotulo }, "Por que agora"), h(Text, { style: s.pairTexto }, calc.whyNow)) : null,
      calc.cycleObjective ? h(View, { style: s.pairBox }, h(Text, { style: s.pairRotulo }, "Objetivo deste ciclo"), h(Text, { style: s.pairTexto }, calc.cycleObjective)) : null,
    ),
    expectedResults.length ? h(Text, { style: s.blocoRotulo }, "RESULTADO ESPERADO") : null,
    expectedResults.length ? h(Text, { style: s.blocoTitulo }, "O que deve estar diferente ao final") : null,
    expectedResults.length ? h(View, null, numberedNarrow(expectedResults)) : null,
    advantages.length ? h(Text, { style: s.blocoRotulo }, "VALOR AGREGADO") : null,
    advantages.length ? h(Text, { style: s.blocoTitulo }, "Por que a CALI neste contexto") : null,
    advantages.length ? twoColNumbered(advantages) : null,
    h(Footer, { protocolo }),
  ));

  // PÁGINA 3 — ESCOPO
  paginas.push(h(Page, { key: "p3", size: "A4", style: s.paginaInner },
    h(Watermark, { d }),
    h(TopoInner, { protocolo, emitidoEm: criadaEm, validade }),
    h(SecHead, { num: "03", eyebrow: "ESCOPO CONTRATADO", titulo: "O que entra neste trabalho", intro: "O escopo abaixo traduz a prioridade desta versão em entregas claras, sem misturar o que pertence a etapas futuras." }),
    scope.length ? h(View, null, numberedWide(scope)) : null,
    cadence.length ? h(Text, { style: s.blocoRotulo }, "RITMO E FORMATO") : null,
    cadence.length ? h(Text, { style: s.blocoTitulo }, "Como a operação acontece") : null,
    cadence.length ? twoColNumbered(cadence) : null,
    cycles.length ? h(Text, { style: s.blocoRotulo }, "SEQUÊNCIA PREVISTA") : null,
    cycles.length ? h(Text, { style: s.blocoTitulo }, "Ciclos e fases") : null,
    cycles.length ? twoColNumbered(cycles.map((c, i) => /^ciclo\b/i.test(c.title) ? c.title : `Ciclo ${i + 1} · ${c.title}`)) : null,
    h(Footer, { protocolo }),
  ));

  // PÁGINA 4 — GOVERNANÇA
  paginas.push(h(Page, { key: "p4", size: "A4", style: s.paginaInner },
    h(Watermark, { d }),
    h(TopoInner, { protocolo, emitidoEm: criadaEm, validade }),
    h(SecHead, { num: "04", eyebrow: "GOVERNANÇA DO TRABALHO", titulo: "Responsabilidades, continuidade e limites", intro: "Uma boa proposta também deixa claro quem conduz cada parte, o que depende da empresa e o que não está incluído nesta contratação." }),
    (caliResponsibilities.length || clientResponsibilities.length) ? h(Text, { style: s.blocoRotulo }, "RESPONSABILIDADES") : null,
    (caliResponsibilities.length || clientResponsibilities.length) ? h(Text, { style: s.blocoTitulo }, "Quem faz o quê") : null,
    (caliResponsibilities.length || clientResponsibilities.length) ? h(View, { style: s.pairRow, wrap: false },
      h(View, { style: s.pairBox }, h(Text, { style: s.pairRotulo }, "A CALI conduz"), ...bullets(caliResponsibilities)),
      h(View, { style: s.pairBox }, h(Text, { style: s.pairRotulo }, "A empresa viabiliza"), ...bullets(clientResponsibilities)),
    ) : null,
    roadmapItems.length ? h(Text, { style: s.blocoRotulo }, "CONTINUIDADE") : null,
    roadmapItems.length ? h(Text, { style: s.blocoTitulo }, "O que fica organizado para depois") : null,
    roadmapItems.length ? h(View, null, numberedNarrow(roadmapItems)) : null,
    outOfScope.length ? h(Text, { style: s.blocoRotulo }, "LIMITES DESTA PROPOSTA") : null,
    outOfScope.length ? h(Text, { style: s.blocoTitulo }, "O que não está incluído") : null,
    outOfScope.length ? twoColBullets(outOfScope, true) : null,
    h(Footer, { protocolo }),
  ));

  // PÁGINA 5 — INVESTIMENTO
  const cards = [
    hours ? { rotulo: "Capacidade", valor: `Até ${hours}h/mês` } : null,
    months ? { rotulo: "Prazo mínimo", valor: `${months} ${months === 1 ? "mês" : "meses"}` } : null,
    { rotulo: "Natureza", valor: natureza },
  ].filter(Boolean) as { rotulo: string; valor: string }[];
  paginas.push(h(Page, { key: "p5", size: "A4", style: s.paginaInner },
    h(Watermark, { d }),
    h(TopoInner, { protocolo, emitidoEm: criadaEm, validade }),
    h(SecHead, { num: "05", eyebrow: "CONDIÇÕES COMERCIAIS", titulo: "Investimento e condições", intro: "O desenho comercial abaixo corresponde ao escopo, à capacidade reservada e ao prazo desta versão." }),
    h(View, { style: s.investBox },
      h(View, { style: s.investTopo }),
      h(View, { style: s.investConteudo },
        h(Text, { style: s.investRotulo }, "MENSALIDADE"),
        h(View, { style: s.investValorLinha }, h(Text, { style: s.investValor }, currency(finalUnit)), h(Text, { style: s.investPorMes }, "por mês")),
        discountValue > 0 ? h(View, { style: s.investDivider }) : null,
        discountValue > 0 ? h(View, { style: s.investRefRow },
          h(View, { style: s.investRefCol }, h(Text, { style: s.investRefRotulo }, "REFERÊNCIA"), h(Text, { style: s.investRefValor }, currency(subtotal))),
          h(View, { style: s.investRefCol }, h(Text, { style: s.investRefRotulo }, "CONDIÇÃO COMERCIAL"), h(Text, { style: s.investRefValor }, `− ${currency(discountValue)}`)),
        ) : null,
      ),
    ),
    isRecorrente ? h(View, { style: s.ativacaoBox, wrap: false },
      h(View, { style: s.ativacaoLeft }, h(Text, { style: s.ativacaoRotulo }, "Ativação · 20%"), h(Text, { style: s.ativacaoValor }, currency(ativacaoValor))),
      h(Text, { style: s.ativacaoTexto }, "Inclui a preparação para o início da operação: organização de insumos e acessos, configuração da dinâmica de trabalho, planejamento do primeiro ciclo e preparação do kickoff. É uma cobrança única na assinatura, separada das mensalidades, não abatida e não reembolsável."),
    ) : null,
    cards.length ? h(View, { style: s.cardsLinha }, ...cards.map((c, i) => h(View, { key: i, style: s.card }, h(Text, { style: s.cardRotulo }, c.rotulo), h(Text, { style: s.cardValor }, c.valor)))) : null,
    h(Text, { style: s.blocoRotulo }, "CONDIÇÕES IMPORTANTES"),
    h(Text, { style: s.blocoTitulo }, "Para esta contratação"),
    twoColBullets(condicoesImportantes(months, hours, payment, scope.length > 0)),
    h(Footer, { protocolo }),
  ));

  // PÁGINA 6 — PRÓXIMOS PASSOS + ASSINATURA
  const passos: [string, string][] = isRecorrente ? [
    ["Avaliação e aprovação da proposta", "Confirmação do escopo, investimento e condições desta versão."],
    ["Assinatura + pagamento da Ativação", "Formalização do contrato e pagamento da Ativação para abertura da operação CALI."],
    ["Kickoff", "Reunião de início para organizar insumos, responsáveis e o primeiro ciclo."],
  ] : [
    ["Aprovação", "Confirmação do investimento, formato e escopo."],
    ["Contrato", "Formalização das condições e responsabilidades."],
    ["Kickoff", "Alinhamento final e organização dos insumos."],
  ];
  paginas.push(h(Page, { key: "p6", size: "A4", style: s.paginaInner },
    h(Watermark, { d }),
    h(TopoInner, { protocolo, emitidoEm: criadaEm, validade }),
    h(View, { style: s.secHead },
      h(Text, { style: s.secNum }, "06"),
      h(View, { style: { flex: 1 } },
        h(Text, { style: [s.secTitulo, { marginTop: 3 }] }, "Próximos passos"),
        h(Text, { style: s.secIntro }, "Uma sequência simples para transformar a proposta aprovada em início de operação."),
      ),
    ),
    h(View, { style: s.secDivider }),
    h(View, null, ...passos.map(([titulo, texto], i) => h(View, { key: i, style: i === 0 ? s.passoRowFirst : s.passoRow, wrap: false },
      h(Text, { style: s.passoNum }, String(i + 1).padStart(2, "0")),
      h(View, { style: { flex: 1 } }, h(Text, { style: s.passoTitulo }, titulo), h(Text, { style: s.passoTexto }, texto)),
    ))),
    bonus?.title ? h(View, { style: s.bonusBox, wrap: false },
      h(Text, { style: s.bonusRotulo }, "Bônus selecionado"),
      h(Text, { style: s.bonusTitulo }, bonus.title),
      bonus.description ? h(Text, { style: s.bonusDescricao }, bonus.description) : null,
    ) : null,
    h(View, { style: s.assinaturaRow, wrap: false },
      h(Text, { style: s.assinaturaNome }, carimbo.signatario_nome),
      h(Text, { style: s.assinaturaCargo }, carimbo.signatario_cargo),
    ),
    h(View, { style: s.registro, wrap: false },
      h(View, { style: { flex: 1 } },
        h(Text, { style: s.regRotulo }, "Registro eletrônico de emissão"),
        h(View, { style: { marginTop: 5 } },
          h(Text, { style: s.regLinha }, `Registro gerado em ${dataHora(emitidoEm)} (horário de Brasília) · Protocolo ${protocolo}`),
          h(Text, { style: s.regLinha }, `Código de integridade: ${hash.slice(0, 32)}`),
          h(Text, { style: s.regLinha }, `Confira a autenticidade em ${urlVerificar.replace(/^https?:\/\//, "")}`),
        ),
      ),
      h(Image, { src: qr, style: s.qr }),
    ),
    h(Footer, { protocolo }),
  ));

  const el = h(Document, { title: `Proposta CALI — ${service_title}`, author: "CALI RH", creator: "Portal CALI", producer: "Portal CALI", language: "pt-BR", subject: protocolo }, ...paginas);
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
    const blob = await buildPdf(admin, proposal, proposal.submission, SERVICE_LABELS[proposal.service_slug] || proposal.service_slug);
    const bytes = await blob.arrayBuffer();
    return new Response(bytes, { headers: { ...cors(req), "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="teste-${proposal.submission.protocol}.pdf"` } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: String((error as Error)?.stack || error) }), { status: 500, headers: { ...cors(req), "Content-Type": "application/json" } });
  }
});
