import { CONFIG } from "/js/config.js";
import { requestPasswordRecovery } from "/js/auth.js";

const mode = new URLSearchParams(location.search).get("modo") === "primeiro" ? "primeiro" : "recuperar";
const form = document.getElementById("access-form");
const feedback = document.getElementById("feedback");

if (mode === "primeiro") {
  document.title = "Primeiro acesso · CALI";
  document.getElementById("access-kicker").textContent = "Primeiro acesso";
  document.getElementById("access-title").textContent = "Crie sua senha";
  document.getElementById("access-copy").textContent = "Você receberá um link seguro para definir a senha deste portal.";
  document.getElementById("story-title").innerHTML = "Seu primeiro acesso,<br>protegido desde o início.";
}

form.email.value = CONFIG.adminEmail;
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.submitter;
  button.disabled = true; button.textContent = "Enviando…"; feedback.textContent = "";
  try {
    await requestPasswordRecovery();
    form.classList.add("hidden");
    document.getElementById("access-success").classList.remove("hidden");
  } catch (error) {
    feedback.textContent = error instanceof Error ? error.message : "Não foi possível enviar o link agora.";
    button.disabled = false; button.textContent = "Enviar link seguro";
  }
});
