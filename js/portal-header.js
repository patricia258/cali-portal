const header = document.getElementById("portal-header");
const toggle = header?.querySelector(".menu-toggle");
const nav = header?.querySelector(".nav-links");
const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
