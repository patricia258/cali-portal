import { CONFIG } from "/js/config.js";
import { supabase, isAdmin, safeNext } from "/js/auth.js";

const params = new URLSearchParams(location.search);
const next = safeNext(params.get("next"));
const form = document.getElementById("login-form");
const feedback = document.getElementById("feedback");

document.querySelectorAll("[data-password-toggle]").forEach((toggle) => toggle.addEventListener("click", () => {
  const input = toggle.parentElement.querySelector("input");
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  toggle.textContent = showing ? "Ver" : "Ocultar";
  toggle.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
}));

form.email.value = CONFIG.adminEmail;
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.submitter;
  button.disabled = true; button.textContent = "Entrando…"; feedback.textContent = "";
  const { data, error } = await supabase.auth.signInWithPassword({ email: CONFIG.adminEmail, password: form.password.value });
  if (error || !isAdmin(data.user)) {
    if (data.session) await supabase.auth.signOut();
    feedback.textContent = "E-mail ou senha incorretos. Se não lembrar, use “Esqueci minha senha”.";
    button.disabled = false; button.textContent = "Entrar com segurança";
    return;
  }
  location.replace(next);
});

supabase.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY") location.replace("/redefinir-senha");
  if (event === "SIGNED_IN" && isAdmin(session?.user) && !location.hash.includes("type=recovery") && params.get("mode") !== "recovery") {
    location.replace(next);
  }
});

if (params.get("erro") === "sem-acesso") feedback.textContent = "Este usuário não tem permissão para acessar o painel.";

const { data: { session } } = await supabase.auth.getSession();
if (session && isAdmin(session.user) && !location.hash.includes("type=recovery") && params.get("mode") !== "recovery") location.replace(next);
