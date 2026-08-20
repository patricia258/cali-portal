import { CONFIG, functionUrl } from "/js/config.js";
import { serviceFromPath } from "/js/services.js";

const service = serviceFromPath();
const form = document.getElementById("briefing-form");
const welcome = document.getElementById("briefing-welcome");
const startButton = document.getElementById("start-briefing");
const stepsRoot = document.getElementById("steps");
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");
const progressCount = document.getElementById("progress-count");
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

function inputAttributes(field) {
  return [
    `id="f-${field.id}"`, `name="${field.id}"`, field.required ? "required" : "",
    field.min !== undefined ? `min="${field.min}"` : "", field.max !== undefined ? `max="${field.max}"` : "",
    field.maxlength ? `maxlength="${field.maxlength}"` : "", field.autocomplete ? `autocomplete="${field.autocomplete}"` : "",
    field.inputmode ? `inputmode="${field.inputmode}"` : "", field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : "",
    field.lettersOnly ? 'data-letters-only="true"' : "", field.phone ? 'data-phone="true"' : "",
  ].filter(Boolean).join(" ");
}

function indicatorMatrixHtml(field) {
  return `<div class="indicator-matrix" data-indicator-matrix="${field.id}">${field.options.map((item) => `
    <div class="indicator-row ${item.exclusive ? "indicator-exclusive" : ""}">
      <label><input type="checkbox" name="${field.id}__selected" value="${escapeHtml(item.value)}" data-indicator-label="${escapeHtml(item.label)}" ${item.exclusive ? 'data-exclusive="true"' : ""}><span>${escapeHtml(item.label)}</span></label>
      ${item.exclusive ? '<span class="indicator-na">Não se aplica</span>' : `<select class="control indicator-level" name="${field.id}__level__${escapeHtml(item.value)}" disabled aria-label="Nível de acompanhamento de ${escapeHtml(item.label)}"><option value="">Nível de acompanhamento</option><option value="baixo">Baixo</option><option value="medio">Médio</option><option value="alto">Alto</option></select>`}
    </div>`).join("")}</div>`;
}

function fieldHtml(field) {
  const required = field.required ? '<span class="required">*</span>' : "";
  const common = inputAttributes(field);
  let control = "";
  if (field.type === "textarea") control = `<textarea class="control" ${common}>${escapeHtml(field.value || "")}</textarea>`;
  else if (field.type === "select") control = `<select class="control" ${common}><option value="">Selecione</option>${field.options.map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`).join("")}</select>`;
  else if (field.type === "radio" || field.type === "checkboxes") {
    const inputType = field.type === "radio" ? "radio" : "checkbox";
    control = `<div class="choices">${field.options.map((item) => `<label class="choice"><input type="${inputType}" name="${field.id}" value="${escapeHtml(item.value)}"><span>${escapeHtml(item.label)}</span></label>`).join("")}</div>`;
  } else if (field.type === "checkbox") control = `<label class="single-check"><input id="f-${field.id}" name="${field.id}" type="checkbox"><span>${escapeHtml(field.label)} ${required}</span></label>`;
  else if (field.type === "indicator_matrix") control = indicatorMatrixHtml(field);
  else control = `<input class="control" ${common} type="${field.type || "text"}" ${field.value !== undefined ? `value="${escapeHtml(field.value)}"` : ""}>`;
  const condition = field.showWhen ? `data-show-field="${field.showWhen.field}" data-show-equals="${escapeHtml(field.showWhen.equals)}"` : "";
  const label = field.type === "checkbox" ? "" : `<label for="f-${field.id}">${escapeHtml(field.label)} ${required}</label>`;
  return `<div class="field ${field.span ? `span-${field.span}` : ""}" data-field="${field.id}" ${condition}>${label}${field.help ? `<p class="field-help">${escapeHtml(field.help)}</p>` : ""}${control}<div class="field-error">Preencha este campo para continuar.</div></div>`;
}

stepsRoot.innerHTML = service.sections.map((section, index) => `<section class="form-step" data-step="${index}"><div class="step-kicker">Briefing estratégico</div><h2>${escapeHtml(section.title)}</h2>${section.description ? `<p class="step-description">${escapeHtml(section.description)}</p>` : ""}<div class="field-grid">${section.fields.map(fieldHtml).join("")}</div></section>`).join("");

function valueFor(field) {
  if (field.type === "checkboxes") return [...form.querySelectorAll(`[name="${field.id}"]:checked`)].map((element) => element.value);
  if (field.type === "radio") return form.querySelector(`[name="${field.id}"]:checked`)?.value || "";
  if (field.type === "checkbox") return Boolean(form.elements[field.id]?.checked);
  if (field.type === "indicator_matrix") {
    return [...form.querySelectorAll(`[name="${field.id}__selected"]:checked`)].map((element) => {
      if (element.dataset.exclusive === "true") return element.dataset.indicatorLabel;
      const level = form.elements[`${field.id}__level__${element.value}`]?.value || "não informado";
      const levelLabel = { baixo: "baixo", medio: "médio", alto: "alto" }[level] || level;
      return `${element.dataset.indicatorLabel} — acompanhamento ${levelLabel}`;
    });
  }
  const element = form.elements[field.id];
  if (!element || element.disabled) return "";
  return element.type === "number" && element.value !== "" ? Number(element.value) : element.value.trim();
}

function updateConditionalFields() {
  form.querySelectorAll("[data-show-field]").forEach((wrapper) => {
    const sourceField = service.sections.flatMap((section) => section.fields).find((field) => field.id === wrapper.dataset.showField);
    const sourceValue = sourceField ? valueFor(sourceField) : "";
    const visible = String(sourceValue) === wrapper.dataset.showEquals;
    wrapper.classList.toggle("conditional-hidden", !visible);
    wrapper.querySelectorAll("input,select,textarea").forEach((element) => { element.disabled = !visible; });
    if (!visible) wrapper.classList.remove("invalid");
  });
}

function showStep(index, shouldScroll = true) {
  current = Math.max(0, Math.min(index, service.sections.length - 1));
  document.querySelectorAll(".form-step").forEach((element, i) => element.classList.toggle("active", i === current));
  progressLabel.textContent = service.sections[current].title;
  progressCount.textContent = `${String(current + 1).padStart(2, "0")} / ${String(service.sections.length).padStart(2, "0")}`;
  progressBar.style.width = `${((current + 1) / service.sections.length) * 100}%`;
  backButton.style.visibility = current === 0 ? "hidden" : "visible";
  const finalStep = current === service.sections.length - 1;
  nextButton.classList.toggle("hidden", finalStep);
  submitButton.classList.toggle("hidden", !finalStep);
  document.getElementById("consent-wrap").classList.toggle("hidden", !finalStep);
  feedback.textContent = "";
  updateConditionalFields();
  if (shouldScroll) window.scrollTo({ top: Math.max(0, document.querySelector(".form-layout").offsetTop - 96), behavior: "smooth" });
}

function validateStep() {
  let valid = true;
  service.sections[current].fields.forEach((field) => {
    const wrapper = form.querySelector(`[data-field="${field.id}"]`);
    if (!wrapper || wrapper.classList.contains("conditional-hidden")) return;
    const value = valueFor(field);
    const missing = field.required && (Array.isArray(value) ? value.length === 0 : value === "");
    const invalidEmail = field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const phoneDigits = field.phone ? String(value).replace(/\D/g, "") : "";
    const invalidPhone = field.phone && value && (phoneDigits.length < 10 || phoneDigits.length > 15);
    const invalidLetters = field.lettersOnly && value && !/^[\p{L}\p{M}\s'.-]+$/u.test(value);
    const invalidIndicator = field.type === "indicator_matrix" && Array.isArray(value) && value.some((item) => item.endsWith("não informado"));
    const isInvalid = Boolean(missing || invalidEmail || invalidPhone || invalidLetters || invalidIndicator);
    wrapper.classList.toggle("invalid", isInvalid);
    const error = wrapper.querySelector(".field-error");
    if (error) {
      if (invalidEmail) error.textContent = "Informe um e-mail válido.";
      else if (invalidPhone) error.textContent = "Informe um WhatsApp válido, com DDD.";
      else if (invalidLetters) error.textContent = "Use apenas letras neste campo.";
      else if (invalidIndicator) error.textContent = "Defina o nível dos indicadores selecionados.";
      else error.textContent = "Preencha este campo para continuar.";
    }
    if (isInvalid) valid = false;
  });
  if (!valid) feedback.textContent = "Revise os campos destacados.";
  return valid;
}

function collectAnswers() {
  return Object.fromEntries(service.sections.flatMap((section) => section.fields).map((field) => [field.id, valueFor(field)]));
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 15);
  if (digits.startsWith("55") && digits.length > 11) {
    const local = digits.slice(2, 13);
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7, 11)}`.replace(/[-\s]+$/, "");
  }
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

startButton.addEventListener("click", () => { welcome.classList.add("hidden"); form.classList.remove("hidden"); showStep(0); });
backButton.addEventListener("click", () => showStep(current - 1));
nextButton.addEventListener("click", () => { if (validateStep()) showStep(current + 1); });

form.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches("[data-letters-only]")) target.value = target.value.replace(/[^\p{L}\p{M}\s'.-]/gu, "");
  if (target.matches("[data-phone]")) target.value = formatPhone(target.value);
  if (target.type === "email") target.value = target.value.replace(/\s/g, "").toLowerCase();
  target.closest(".field")?.classList.remove("invalid");
  updateConditionalFields();
});

form.addEventListener("change", (event) => {
  const target = event.target;
  if (!target.matches('.indicator-matrix input[type="checkbox"]')) return;
  const matrix = target.closest(".indicator-matrix");
  const selected = [...matrix.querySelectorAll('input[type="checkbox"]')];
  if (target.dataset.exclusive === "true" && target.checked) selected.filter((item) => item !== target).forEach((item) => { item.checked = false; });
  else if (target.checked) selected.filter((item) => item.dataset.exclusive === "true").forEach((item) => { item.checked = false; });
  selected.forEach((item) => {
    const level = item.closest(".indicator-row").querySelector(".indicator-level");
    if (level) { level.disabled = !item.checked; if (!item.checked) level.value = ""; }
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateStep()) return;
  if (!document.getElementById("lgpd").checked) { feedback.textContent = "Confirme a autorização de uso dos dados."; return; }
  submitButton.disabled = true;
  submitButton.textContent = "Enviando…";
  feedback.textContent = "";
  try {
    const response = await fetch(functionUrl("portal-submit"), {
      method: "POST", headers: { "Content-Type": "application/json", apikey: CONFIG.supabasePublishableKey },
      body: JSON.stringify({ service_slug: service.slug, answers: collectAnswers(), source_path: location.pathname, website: document.getElementById("website").value, lgpd_aceite: true }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Não foi possível enviar agora.");
    form.classList.add("hidden");
    document.getElementById("success").classList.remove("hidden");
    document.getElementById("protocol").textContent = result.protocol ? `Protocolo ${result.protocol}` : "";
  } catch (error) {
    feedback.textContent = error instanceof TypeError ? "Não consegui concluir o envio. Verifique sua conexão e tente novamente." : (error instanceof Error ? error.message : "Não foi possível enviar agora.");
    submitButton.disabled = false;
    submitButton.textContent = "Enviar briefing →";
  }
});

showStep(0, false);
updateConditionalFields();
