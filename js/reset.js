import { updatePassword } from "/js/auth.js";

const hash = new URLSearchParams(location.hash.slice(1));
const accessToken = hash.get("access_token");
const form = document.getElementById("reset-form");
const feedback = document.getElementById("feedback");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const meter = document.getElementById("password-meter");
const hint = document.getElementById("password-hint");

document.querySelectorAll("[data-password-toggle]").forEach((toggle) => toggle.addEventListener("click", () => {
  const input = toggle.parentElement.querySelector("input");
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  toggle.textContent = showing ? "Ver" : "Ocultar";
  toggle.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
}));

function passwordScore(value) {
  return [value.length >= 8, /[a-z]/.test(value) && /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
}

password.addEventListener("input", () => {
  const score = passwordScore(password.value);
  meter.style.width = `${score * 25}%`;
  meter.dataset.score = String(score);
  hint.textContent = ["Use pelo menos 8 caracteres.", "Senha ainda fraca.", "Senha razoável.", "Senha forte.", "Senha muito forte."][score];
});

if (!accessToken) {
  form.querySelectorAll("input,button[type=submit]").forEach((element) => { element.disabled = true; });
  feedback.innerHTML = 'Este link é inválido ou expirou. <a href="/acesso?modo=recuperar">Solicite um novo link.</a>';
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!accessToken) return;
  if (password.value.length < 8) { feedback.textContent = "A senha precisa ter pelo menos 8 caracteres."; return; }
  if (password.value !== confirmPassword.value) { feedback.textContent = "As senhas não coincidem."; return; }
  const button = form.querySelector("button[type=submit]");
  button.disabled = true; button.textContent = "Salvando…"; feedback.textContent = "";
  try {
    await updatePassword(accessToken, password.value);
    history.replaceState(null, "", location.pathname);
    form.classList.add("hidden");
    document.getElementById("reset-success").classList.remove("hidden");
  } catch (error) {
    feedback.textContent = error instanceof Error ? error.message : "Não foi possível salvar a nova senha.";
    button.disabled = false; button.textContent = "Salvar nova senha";
  }
});
