import { getSession, signIn } from "/js/auth.js";

if (location.hash.includes("type=recovery")) location.replace(`/redefinir-senha${location.hash}`);
if (getSession()) location.replace(new URLSearchParams(location.search).get("next") || "/admin");
const form = document.getElementById("login-form");
document.querySelectorAll("[data-password-toggle]").forEach((toggle) => toggle.addEventListener("click", () => {
  const input = toggle.parentElement.querySelector("input");
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  toggle.textContent = showing ? "Ver" : "Ocultar";
  toggle.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
}));
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button[type=submit]");
  const feedback = document.getElementById("feedback");
  button.disabled = true; button.textContent = "Entrando…"; feedback.textContent = "";
  try {
    await signIn(form.email.value.trim().toLowerCase(), form.password.value);
    location.replace(new URLSearchParams(location.search).get("next") || "/admin");
  } catch (error) {
    feedback.textContent = error instanceof Error ? error.message : "Não foi possível entrar.";
    button.disabled = false; button.textContent = "Entrar com segurança";
  }
});
