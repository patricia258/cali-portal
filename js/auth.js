import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/+esm";
import { CONFIG, functionUrl } from "/js/config.js";

export const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "implicit",
  },
});

try { localStorage.removeItem("cali_portal_session"); } catch {}

export function isAdmin(user) {
  return Boolean(user?.email && user.email.toLowerCase() === CONFIG.adminEmail);
}

export function safeNext(value, fallback = "/admin") {
  if (!value) return fallback;
  try {
    const url = new URL(value, location.origin);
    return url.origin === location.origin ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch {
    return fallback;
  }
}

export async function requestPasswordRecovery() {
  const response = await fetch(functionUrl("portal-admin-access"), {
    method: "POST",
    headers: {
      apikey: CONFIG.supabasePublishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ website: "" }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Não foi possível enviar o link agora.");
  return true;
}

export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message || "Não foi possível salvar a nova senha.");
  return data.user;
}

export async function requireAdmin() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    location.replace(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
    return null;
  }
  if (!isAdmin(session.user)) {
    await supabase.auth.signOut();
    location.replace("/login?erro=sem-acesso");
    return null;
  }
  return session;
}

export function apiHeaders(session, extra = {}) {
  return { apikey: CONFIG.supabasePublishableKey, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", ...extra };
}

export async function signOut() {
  await supabase.auth.signOut();
  location.replace("/login");
}
