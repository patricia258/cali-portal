import { SERVICES } from "/js/services.js";

const iconPaths = {
  "assessoria-estrategica": '<path d="M5 19V9l7-4 7 4v10M9 19v-6h6v6M4 19h16"/><path d="m9 8 3 2 3-2"/>',
  "mentoria-rh": '<circle cx="12" cy="8" r="3"/><path d="M5 20c.8-4.4 3.1-6.5 7-6.5s6.2 2.1 7 6.5M18 5l1 1 2-2"/>',
  "diagnostico-executivo": '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4M8 11l2 2 4-5"/>',
  "cultura-direcao": '<path d="M4 18h16M6 18V9h12v9M9 9V6h6v3M9 13h.01M12 13h.01M15 13h.01"/>',
  "shadowing-lideranca": '<path d="M4 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z"/><circle cx="12" cy="12" r="2.5"/>',
  treinamentos: '<path d="M4 6h16v11H4zM8 21l4-4 4 4M8 10h8M8 13h5"/>',
  "marca-empregadora": '<path d="M6 19V5h9l3 3v11H6zM15 5v4h4"/><path d="m9 14 2 2 4-5"/>',
};

const grid = document.getElementById("service-grid");
grid.innerHTML = Object.values(SERVICES).map((service, index) => `
  <a class="service-editorial-card reveal" href="/servicos/${service.slug}">
    <div class="service-card-top"><span class="service-index">0${index + 1}</span><svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[service.slug]}</svg></div>
    <div><div class="service-code">${service.code}</div><h3>${service.title}</h3><p>${service.intro}</p></div>
    <div class="service-card-bottom"><span>Iniciar briefing</span><span class="circle-arrow">↗</span></div>
  </a>`).join("");

const topbar = document.getElementById("topbar");
const updateHeader = () => topbar.classList.toggle("is-scrolled", window.scrollY > 28);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px" });

document.querySelectorAll(".reveal:not(.is-visible)").forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  observer.observe(element);
});
