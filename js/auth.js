import { CONFIG } from "/js/config.js";

const STORAGE_KEY = "cali_portal_session";

export function getSession() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function signIn(email, password) {
  const response = await fetch(`${CONFIG.supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: CONFIG.supabasePublishableKey },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error("E-mail ou senha não conferem.");
  if (String(result.user?.email || "").toLowerCase() !== CONFIG.adminEmail) throw new Error("Este acesso não possui permissão administrativa.");
  saveSession(result);
  return result;
}

export async function refreshSession(session = getSession()) {
  if (!session?.refresh_token) return null;
  const response = await fetch(`${CONFIG.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: CONFIG.supabasePublishableKey },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) { clearSession(); return null; }
  const result = await response.json();
  saveSession(result);
  return result;
}

export async function requireAdmin() {
  let session = getSession();
  if (!session) { location.replace(`/login?next=${encodeURIComponent(location.pathname + location.search)}`); return null; }
  const expiresAt = Number(session.expires_at || 0) * 1000;
  if (expiresAt && expiresAt < Date.now() + 60_000) session = await refreshSession(session);
  if (!session || String(session.user?.email || "").toLowerCase() !== CONFIG.adminEmail) { clearSession(); location.replace("/login"); return null; }
  return session;
}

export function apiHeaders(session, extra = {}) {
  return { apikey: CONFIG.supabasePublishableKey, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", ...extra };
}

export async function signOut() {
  const session = getSession();
  if (session?.access_token) await fetch(`${CONFIG.supabaseUrl}/auth/v1/logout`, { method: "POST", headers: apiHeaders(session) }).catch(() => {});
  clearSession();
  location.replace("/login");
}
