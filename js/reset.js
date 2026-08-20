import { supabase, isAdmin, updatePassword } from "/js/auth.js";

const form = document.getElementById("reset-form");
const feedback = document.getElementById("feedback");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const meter = document.getElementById("password-meter");
const hint = document.getElementById("password-hint");
const protectedControls = [...form.querySelectorAll("input,button[type=submit]")];
let recoveryReady = false;

protectedControls.forEach((element) => { element.disabled = true; });

document.querySelectorAll("[data-password-toggle]").forEach((toggle) => toggle.addEventListener("click", () => {
  const input = toggle.parentElement.querySelector("input");
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  toggle.textContent = showing ? "Ver" : "Ocultar";
}));

function enableRecovery(session) {
  if (!session || !isAdmin(session.user)) return false;
  recoveryReady = true;
  protectedControls.forEach((element) => { element.disabled = false; });
  feedback.textContent = "";
  return true;
}

function passwordScore(value) {
  return [value.length >= 8, /[a-z]/.test(value) && /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
}

password.addEventListener("input", () => {
  const score = passwordScore(password.value);
  meter.style.width = `${score * 25}%`; meter.dataset.score = String(score);
  hint.textContent = ["Use pelo menos 8 caracteres.", "Senha ainda fraca.", "Senha razoável.", "Senha forte.", "Senha muito forte."][score];
});

supabase.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") enableRecovery(session);
});

async function prepareRecovery() {
  const fragment = new URLSearchParams(location.hash.replace(/^#/, ""));
  const tokenHash = fragment.get("token_hash");

  if (tokenHash) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    history.replaceState(null, "", location.pathname);
    if (!error && enableRecovery(data.session)) return;
    feedback.innerHTML = 'Este link é inválido ou expirou. <a href="/acesso?modo=recuperar">Solicite um novo link.</a>';
    return;
  }

  const { data: { session }, error } = await supabase.auth.getSession();
  if (!error && enableRecovery(session)) return;
  feedback.innerHTML = 'Este link é inválido ou expirou. <a href="/acesso?modo=recuperar">Solicite um novo link.</a>';
}

await prepareRecovery();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!recoveryReady) return;
  if (password.value.length < 8) { feedback.textContent = "A senha precisa ter pelo menos 8 caracteres."; return; }
  if (password.value !== confirmPassword.value) { feedback.textContent = "As senhas não coincidem."; return; }
  const button = event.submitter;
  button.disabled = true; button.textContent = "Salvando…"; feedback.textContent = "";
  try {
    await updatePassword(password.value);
    await supabase.auth.signOut();
    history.replaceState(null, "", location.pathname);
    form.classList.add("hidden");
    document.getElementById("reset-success").classList.remove("hidden");
  } catch (error) {
    feedback.textContent = error instanceof Error ? `O link pode ter expirado. ${error.message}` : "Não foi possível salvar a nova senha.";
    button.disabled = false; button.textContent = "Salvar nova senha";
  }
});
