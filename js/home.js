import { SERVICES } from "/js/services.js";

if (location.hash.includes("type=recovery")) location.replace(`/redefinir-senha${location.hash}`);

const services = Object.values(SERVICES);
const summaries = {
  "assessoria-estrategica": ["CALI Assessoria", "Acompanhamento mensal da liderança para organizar prioridades e decisões de pessoas."],
  "cali-build": ["CALI Build", "Implantação orientada pela CALI, com seu RH interno executando e se desenvolvendo."],
  "mentoria-rh": ["Mentoria para profissionais de RH", "Desenvolvimento de quem atua em RH e quer crescer nas decisões."],
  "diagnostico-executivo": ["Diagnóstico Executivo de People", "Identifique os riscos de pessoas e defina por onde começar."],
  "cultura-direcao": ["Cultura e Direção", "Alinhe o que a empresa espera ao que as lideranças praticam."],
  "shadowing-lideranca": ["Shadowing de Liderança", "Observe situações reais e desenvolva a atuação de uma liderança."],
  treinamentos: ["Treinamentos e Palestras", "Trabalhe um tema importante com o público da sua empresa."],
  "marca-empregadora": ["Marca Empregadora", "Aproxime sua reputação da experiência de quem trabalha na empresa."],
  "solucao-personalizada": ["Solução Personalizada", "Descreva um desafio que não se encaixa nas outras opções."],
};
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const card = (service, featured = false, duplicate = false) => `<a class="portal-service-card ${featured ? "portal-service-featured" : ""} ${featured ? "reveal" : ""}" href="/servicos/${service.slug}" aria-label="Abrir briefing de ${summaries[service.slug][0]}"${duplicate ? ' aria-hidden="true" tabindex="-1"' : ""}>
  ${featured ? `<img class="portal-featured-mark" src="/assets/${service.slug === "cali-build" ? "cali-leaf-mark.svg" : "cali-lime-mark.svg"}" alt="" aria-hidden="true">` : ""}
  <span class="portal-card-overline">${featured ? "ASSESSORIA E IMPLANTAÇÃO" : "PROJETO OU DESENVOLVIMENTO"}</span>
  <span class="portal-card-content"><strong>${summaries[service.slug][0]}</strong><span>${summaries[service.slug][1]}</span></span>
  <span class="portal-card-action">Abrir briefing <span class="portal-card-arrow">${arrow}</span></span>
</a>`;

const grid = document.getElementById("service-grid");
grid.innerHTML = `<div class="portal-featured-list">${services.slice(0, 2).map(service => card(service, true)).join("")}</div>
  <div class="portal-carousel-heading reveal"><div><span class="eyebrow">PROJETOS E OUTRAS SOLUÇÕES</span><h3>Outros formulários</h3></div><div class="portal-carousel-controls"><button type="button" data-direction="-1" aria-label="Ver formulários anteriores">←</button><button type="button" data-direction="1" aria-label="Ver próximos formulários">→</button></div></div>
  <div class="portal-carousel" tabindex="0" aria-label="Formulários de projetos e outras soluções">${[0, 1, 2].map(copy => services.slice(2).map(service => card(service, false, copy !== 1)).join("")).join("")}</div>`;

const carousel = grid.querySelector(".portal-carousel");
const carouselCards = [...carousel.querySelectorAll(".portal-service-card")];
const pageSize = services.length - 2;
let selected = pageSize;
let scrollEndTimer;
let resetting = false;
const cardCenter = index => carouselCards[index].offsetLeft - (carousel.clientWidth - carouselCards[index].offsetWidth) / 2;
const focusCard = index => {
  selected = index;
  carouselCards.forEach((element, i) => element.classList.toggle("is-current", i === index));
};
const goTo = (index, smooth = true) => {
  if (index < 0 || index >= carouselCards.length) index = pageSize + ((index % pageSize + pageSize) % pageSize);
  focusCard(index);
  if (!smooth) {
    resetting = true;
    carousel.style.scrollSnapType = "none";
    carousel.style.scrollBehavior = "auto";
  }
  carousel.scrollTo({ left: cardCenter(index), behavior: smooth && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "instant" });
  if (!smooth) requestAnimationFrame(() => {
    carousel.style.scrollSnapType = "";
    carousel.style.scrollBehavior = "";
    resetting = false;
  });
};
const fitCarousel = () => carousel.style.setProperty("--carousel-viewport", `${document.documentElement.clientWidth}px`);
const nearestCard = () => {
  const middle = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
  return carouselCards.reduce((best, element, index) => Math.abs(element.getBoundingClientRect().left + element.offsetWidth / 2 - middle) < Math.abs(carouselCards[best].getBoundingClientRect().left + carouselCards[best].offsetWidth / 2 - middle) ? index : best, selected);
};
const settleCarousel = () => {
  if (resetting) return;
  const nearest = nearestCard();
  if (nearest < pageSize || nearest >= pageSize * 2) goTo(pageSize + (nearest % pageSize), false);
  else focusCard(nearest);
};
carousel.addEventListener("scroll", () => {
  if (resetting) return;
  focusCard(nearestCard());
  clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(settleCarousel, 230);
}, { passive: true });
window.addEventListener("resize", () => { fitCarousel(); goTo(pageSize + (selected % pageSize), false); });
fitCarousel();
requestAnimationFrame(() => goTo(selected, false));
grid.querySelectorAll(".portal-carousel-controls button").forEach(button => button.addEventListener("click", () => {
  goTo(nearestCard() + Number(button.dataset.direction));
}));
carousel.addEventListener("keydown", event => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  goTo(nearestCard() + (event.key === "ArrowRight" ? 1 : -1));
});

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: .08, rootMargin: "0px 0px -30px" });
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 85}ms`);
    observer.observe(element);
  });
} else document.querySelectorAll(".reveal").forEach(element => element.classList.add("is-visible"));
