import { CONFIG, functionUrl } from "/js/config.js";
import { serviceFromPath } from "/js/services.js";

const service = serviceFromPath();
const form = document.getElementById("briefing-form");
const stepsRoot = document.getElementById("steps");
const stepList = document.getElementById("step-list");
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");
const backButton = document.getElementById("back");
const nextButton = document.getElementById("next");
const submitButton = document.getElementById("submit");
const feedback = document.getElementById("feedback");
let current = 0;

document.title = `${service.title} · CALI`;
document.getElementById("service-kicker").textContent = service.kicker;
document.getElementById("service-title").textContent = service.title;
document.getElementById("service-intro").textContent = service.intro;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function fieldHtml(field) {
  const id = `f-${field.id}`;
  const required = field.required ? '<span class="required">*</span>' : "";
  const common = `id="${id}" name="${field.id}" ${field.required ? "required" : ""}`;
  let control = "";
  if (field.type === "textarea") {
    control = `<textarea class="control" ${common} placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(field.value || "")}</textarea>`;
  } else if (field.type === "select") {
    control = `<select class="control" ${common}><option value="">Selecione</option>${field.options.map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`).join("")}</select>`;
  } else if (field.type === "radio" || field.type === "checkboxes") {
    const inputType = field.type === "radio" ? "radio" : "checkbox";
    control = `<div class="choices">${field.options.map((item, index) => `<label class="choice"><input type="${inputType}" name="${field.id}" value="${escapeHtml(item.value)}" ${field.required && index === 0 ? "" : ""}><span>${escapeHtml(item.label)}</span></label>`).join("")}</div>`;
  } else {
    control = `<input class="control" ${common} type="${field.type || "text"}" ${field.min !== undefined ? `min="${field.min}"` : ""} ${field.max !== undefined ? `max="${field.max}"` : ""} ${field.value !== undefined ? `value="${escapeHtml(field.value)}"` : ""}>`;
  }
  return `<div class="field ${field.span ? `span-${field.span}` : ""}" data-field="${field.id}"><label>${escapeHtml(field.label)} ${required}</label>${control}<div class="field-error">Preencha este campo para continuar.</div></div>`;
}

stepsRoot.innerHTML = service.sections.map((section, index) => `<section class="form-step" data-step="${index}"><div class="step-kicker">Etapa ${index + 1} de ${service.sections.length}</div><h2>${escapeHtml(section.title)}</h2>${section.description ? `<p class="step-description">${escapeHtml(section.description)}</p>` : ""}<div class="field-grid">${section.fields.map(fieldHtml).join("")}</div></section>`).join("");
stepList.innerHTML = service.sections.map((section, index) => `<li data-step-item="${index}"><span class="step-dot">${index + 1}</span><span>${escapeHtml(section.title)}</span></li>`).join("");

function showStep(index, shouldScroll = true) {
  current = Math.max(0, Math.min(index, service.sections.length - 1));
  document.querySelectorAll(".form-step").forEach((element, i) => element.classList.toggle("active", i === current));
  document.querySelectorAll("[data-step-item]").forEach((element, i) => {
    element.classList.toggle("active", i === current);
    element.classList.toggle("done", i < current);
  });
  progressLabel.textContent = `Etapa ${current + 1} de ${service.sections.length}`;
  progressBar.style.width = `${((current + 1) / service.sections.length) * 100}%`;
  backButton.style.visibility = current === 0 ? "hidden" : "visible";
  const finalStep = current === service.sections.length - 1;
  nextButton.classList.toggle("hidden", finalStep);
  submitButton.classList.toggle("hidden", !finalStep);
  document.getElementById("consent-wrap").classList.toggle("hidden", !finalStep);
  feedback.textContent = "";
  if (shouldScroll) {
    window.scrollTo({ top: Math.max(0, document.querySelector(".form-layout").offsetTop - 110), behavior: "smooth" });
  }
}

function valueFor(field) {
  if (field.type === "checkboxes") return [...form.querySelectorAll(`[name="${field.id}"]:checked`)].map((element) => element.value);
  if (field.type === "radio") return form.querySelector(`[name="${field.id}"]:checked`)?.value || "";
  const element = form.elements[field.id];
  if (!element) return "";
  return element.type === "number" && element.value !== "" ? Number(element.value) : element.value.trim();
}

function validateStep() {
  let valid = true;
  service.sections[current].fields.forEach((field) => {
    const wrapper = form.querySelector(`[data-field="${field.id}"]`);
    const value = valueFor(field);
    const missing = field.required && (Array.isArray(value) ? value.length === 0 : value === "");
    const invalidEmail = field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    wrapper?.classList.toggle("invalid", Boolean(missing || invalidEmail));
    if (missing || invalidEmail) valid = false;
  });
  if (!valid) feedback.textContent = "Revise os campos destacados.";
  return valid;
}

function collectAnswers() {
  return Object.fromEntries(service.sections.flatMap((section) => section.fields).map((field) => [field.id, valueFor(field)]));
}

backButton.addEventListener("click", () => showStep(current - 1));
nextButton.addEventListener("click", () => { if (validateStep()) showStep(current + 1); });
form.addEventListener("input", (event) => event.target.closest(".field")?.classList.remove("invalid"));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateStep()) return;
  if (!document.getElementById("lgpd").checked) { feedback.textContent = "Confirme a autorização de uso dos dados."; return; }
  submitButton.disabled = true;
  submitButton.textContent = "Enviando…";
  feedback.textContent = "";
  try {
    const response = await fetch(functionUrl("portal-submit"), {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: CONFIG.supabasePublishableKey },
      body: JSON.stringify({ service_slug: service.slug, answers: collectAnswers(), source_path: location.pathname, website: document.getElementById("website").value, lgpd_aceite: true }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Não foi possível enviar agora.");
    form.classList.add("hidden");
    document.getElementById("success").classList.remove("hidden");
    document.getElementById("protocol").textContent = result.protocol ? `Protocolo ${result.protocol}` : "";
  } catch (error) {
    feedback.textContent = error instanceof Error ? error.message : "Não foi possível enviar agora.";
    submitButton.disabled = false;
    submitButton.textContent = "Enviar briefing →";
  }
});

showStep(0, false);
