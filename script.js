/* ============================================================
   CONFIGURAÇÃO — preencha com os dados reais da Arena Shark
   ============================================================ */
const CONFIG = {
  // Só números, com DDI e DDD. Ex.: "5511999998888"
  whatsapp: "5548998422746",
  // Ex.: "https://www.instagram.com/arenashark"
  instagram: "https://www.instagram.com/arenasharktb/",
  // Link externo com os horários e a reserva das quadras. Vazio = botão abre o WhatsApp.
  horarios: "",
  // Modo de desenvolvimento: mostra o rótulo de cada espaço de foto ainda vazio.
  // null = automático (arquivo local, localhost ou ?dev no endereço). Na versão pública, deixe null ou false.
  dev: null,
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const waLink = (msg) =>
  CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}` : "#";

/* ---------- Links de WhatsApp e Instagram ---------- */
function wireLinks(root = document) {
  $$("[data-wa]", root).forEach((a) => {
    a.href = waLink(a.dataset.wa);
    if (CONFIG.whatsapp) { a.target = "_blank"; a.rel = "noopener"; }
  });
  $$("[data-horarios]", root).forEach((a) => {
    a.href = CONFIG.horarios || waLink(a.dataset.horarios);
    if (a.href !== "#") { a.target = "_blank"; a.rel = "noopener"; }
    if (CONFIG.horarios) {
      const label = $("[data-label]", a);
      if (label) label.textContent = "Ver horários e reservar";
      const icon = $("use", a);
      if (icon) icon.setAttribute("href", "#i-arrow");
    }
  });
  $$("[data-ig]", root).forEach((a) => {
    a.href = CONFIG.instagram || "#";
    if (CONFIG.instagram) { a.target = "_blank"; a.rel = "noopener"; }
  });
}

/* ---------- Espaços de foto ---------- */
function isDev() {
  if (typeof CONFIG.dev === "boolean") return CONFIG.dev;
  const param = new URLSearchParams(location.search).get("dev");
  if (param !== null) return param !== "0";
  return ["", "localhost", "127.0.0.1"].includes(location.hostname);
}

function photos() {
  const dev = isDev();
  document.documentElement.classList.toggle("is-dev", dev);
  if (dev) return;
  // no site público, remove os espaços sem foto para o bloco se ajustar
  const tidy = () => $$(".photo").forEach((fig) => { if (!$("img", fig)) fig.remove(); });
  $$(".photo img").forEach((img) => img.addEventListener("error", () => { img.remove(); tidy(); }));
  tidy();
}

/* ---------- Folhas de palmeira ---------- */
function drawFronds() {
  let leaves = "";
  for (let i = 0; i < 15; i++) {
    const t = i / 14;
    const x = 20 + t * 350;
    const y = 200 - Math.sin(t * Math.PI * 0.55) * 120;
    const len = 150 * Math.sin(Math.PI * (0.12 + t * 0.85)) + 30;
    const tilt = 55 - t * 30;
    for (const side of [-1, 1]) {
      const a = ((side * tilt - 20 - t * 25) * Math.PI) / 180;
      const ex = x + Math.cos(a) * len * 0.75;
      const ey = y + Math.sin(a) * len * side * (side > 0 ? 1 : -1);
      const mx = (x + ex) / 2 + side * 14;
      const my = (y + ey) / 2 - 10;
      leaves += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}Q${(mx - side * 22).toFixed(1)} ${(my + 16).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}Z"/>`;
    }
  }
  const svg = `<svg viewBox="0 0 420 340" fill="currentColor">${leaves}<path d="M20 200Q190 60 370 96" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`;
  $$("[data-frond]").forEach((el) => (el.innerHTML = svg));
}

/* ---------- Topo ---------- */
function stickyTop() {
  const top = $("#top");
  const onScroll = () => top.classList.toggle("is-stuck", window.scrollY > window.innerHeight * 0.6);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

photos();
drawFronds();
wireLinks();
stickyTop();
