import { SERVICES } from "/js/services.js";

if (location.hash.includes("type=recovery")) location.replace(`/redefinir-senha${location.hash}`);

const iconPaths = {
  "assessoria-estrategica": '<path d="M5 19V9l7-4 7 4v10M9 19v-6h6v6M4 19h16"/><path d="m9 8 3 2 3-2"/>',
  "cali-build": '<path d="M4 19h16M6 19V8l6-3 6 3v11"/><path d="M9 12h6M9 15h3"/><path d="m16.5 5.5 1 1 2-2"/>',
  "mentoria-rh": '<circle cx="12" cy="8" r="3"/><path d="M5 20c.8-4.4 3.1-6.5 7-6.5s6.2 2.1 7 6.5M18 5l1 1 2-2"/>',
  "diagnostico-executivo": '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4M8 11l2 2 4-5"/>',
  "cultura-direcao": '<path d="M4 18h16M6 18V9h12v9M9 9V6h6v3M9 13h.01M12 13h.01M15 13h.01"/>',
  "shadowing-lideranca": '<path d="M4 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z"/><circle cx="12" cy="12" r="2.5"/>',
  treinamentos: '<path d="M4 6h16v11H4zM8 21l4-4 4 4M8 10h8M8 13h5"/>',
  "marca-empregadora": '<path d="M6 19V5h9l3 3v11H6zM15 5v4h4"/><path d="m9 14 2 2 4-5"/>',
  "solucao-personalizada": '<path d="M5 5h6v6H5zM13 13h6v6h-6zM14 5h5M5 14v5M8 11v3h5M11 8h3"/>',
};

const grid = document.getElementById("service-grid");
const arrowIcon = '<svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const homeCopy = {
  "assessoria-estrategica": ["Assessoria Estratégica Mensal", "Direção sênior de RH para acompanhar prioridades e decisões da liderança."],
  "cali-build": ["CALI Build", "Construímos o plano com o seu RH e orientamos a implantação feita pelo time interno."],
  "mentoria-rh": ["Mentoria para profissionais de RH", "Desenvolvimento técnico para quem quer ganhar critério e espaço nas decisões."],
  "diagnostico-executivo": ["Diagnóstico Executivo de People", "Uma leitura do cenário para identificar riscos e decidir por onde começar."],
  "cultura-direcao": ["Cultura e Direção", "Alinhar o que a empresa espera ao que as lideranças praticam no dia a dia."],
  "shadowing-lideranca": ["Shadowing de Liderança", "Observar situações reais e devolver caminhos concretos para a liderança."],
  treinamentos: ["Treinamentos e Palestras", "Conteúdo desenhado para o público e a situação que a empresa precisa trabalhar."],
  "marca-empregadora": ["Marca Empregadora", "Aproximar o que a empresa promete da experiência de quem trabalha nela."],
  "solucao-personalizada": ["Solução Personalizada", "Seu desafio não cabe nas opções acima? Conte o que precisa resolver."],
};
const services = Object.values(SERVICES);
const card = (service, index) => `
  <article class="service-editorial-card ${service.slug === "solucao-personalizada" ? "service-editorial-custom" : service.slug === "cali-build" ? "service-editorial-build" : ""} reveal">
    <a class="service-card-primary" href="/servicos/${service.slug}">
      <div class="service-card-top"><span class="service-index">${String(index + 1).padStart(2, "0")}</span><svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[service.slug]}</svg></div>
      <div><h3>${homeCopy[service.slug][0]}</h3><p>${homeCopy[service.slug][1]}</p></div>
      <div class="service-card-bottom"><span>Iniciar briefing</span><span class="circle-arrow">${arrowIcon}</span></div>
    </a>
    ${index === 0 ? `<a class="service-site-link" href="https://calirh.com" target="_blank" rel="noreferrer">Conhecer este serviço no site <span>${arrowIcon}</span></a>` : ''}
  </article>`;
grid.innerHTML = `
  <div class="service-group">
    <div class="service-group-head reveal"><span class="eyebrow">01 · ATUAÇÃO CONTÍNUA</span><h3>Acompanhamento ou <em>implantação assistida.</em></h3><p>Na assessoria, acompanhamos a liderança. No Build, orientamos o RH interno que executa.</p></div>
    <div class="service-group-grid service-group-featured">${services.slice(0, 2).map(card).join("")}</div>
  </div>
  <div class="service-group">
    <div class="service-group-head reveal"><span class="eyebrow">02 · DESAFIOS ESPECÍFICOS</span><h3>Projetos para <em>um desafio definido.</em></h3><p>Há também mentoria para quem atua em RH.</p></div>
    <div class="service-group-grid">${services.slice(2).map((service, index) => card(service, index + 2)).join("")}</div>
  </div>`;

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
