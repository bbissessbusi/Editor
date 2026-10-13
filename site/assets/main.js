/* Margin Material — site behavior. Settings live in config.js. */
const S = window.SITE || {};
const P = window.PRODUCTS || [];
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => `$${Number(n).toLocaleString("en-US")}`;

const dropTime = Date.parse(S.dropDate) || 0;
const isLive = () => Date.now() >= dropTime;

// ── Mobile menu ────────────────────────────────────────────
const nav = $(".nav");
$(".menu-btn")?.addEventListener("click", (e) => {
  const open = nav.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
  e.currentTarget.textContent = open ? "Close" : "Menu";
});

// ── Scroll reveal ──────────────────────────────────────────
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 })
  : null;
const watch = (el) => (io ? io.observe(el) : el.classList.add("in"));
$$(".reveal").forEach(watch);

// ── Links from config ──────────────────────────────────────
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
$$("[data-link]").forEach((el) => {
  const url = S[el.dataset.link];
  if (url) el.href = url;
  else (el.closest("li") || el).remove();
});

// ── Drop text + countdown ──────────────────────────────────
$$("[data-drop-name]").forEach((el) => (el.textContent = S.dropName || "The next drop"));
$$("[data-drop-tagline]").forEach((el) => (el.textContent = S.dropTagline || ""));
$$("[data-drop-when]").forEach((el) => {
  if (!dropTime) return;
  el.textContent = new Date(dropTime).toLocaleString("en-US", {
    weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short",
  });
});

const pad = (n) => String(n).padStart(2, "0");
function tick() {
  const live = isLive();
  $$("[data-pre]").forEach((el) => (el.hidden = live));
  $$("[data-live]").forEach((el) => (el.hidden = !live));
  if (live) return;
  let s = Math.max(0, Math.floor((dropTime - Date.now()) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  $$("[data-countdown]").forEach((el) => {
    el.querySelector("[data-d]").textContent = pad(d);
    el.querySelector("[data-h]").textContent = pad(h);
    el.querySelector("[data-m]").textContent = pad(m);
    el.querySelector("[data-s]").textContent = pad(s);
  });
  $$("[data-short-countdown]").forEach((el) => (el.textContent = `${d}d ${pad(h)}h ${pad(m)}m`));
}
tick();
let wasLive = isLive();
setInterval(() => {
  tick();
  if (!wasLive && isLive()) { wasLive = true; renderShop?.(); renderTeasers?.(); }
}, 1000);

// ── Teasers (home): the next drop, blurred ─────────────────
const teaserEl = $("[data-teasers]");
function renderTeasers() {
  if (!teaserEl) return;
  const items = P.filter((p) => p.status === "drop").slice(0, 4);
  teaserEl.innerHTML = items.map((p) => `
    <div class="teaser">
      ${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : `<div class="ph swatch-${p.swatch || 1}"></div>`}
      <span>${isLive() ? esc(p.name) : esc(p.era)}</span>
    </div>`).join("");
  teaserEl.hidden = !items.length;
}
renderTeasers();

// ── Vintage shop ───────────────────────────────────────────
const grid = $("[data-grid]");
let filter = new URLSearchParams(location.search).get("c") || "all";
function card(p) {
  const locked = p.status === "drop" && !isLive();
  const isNew = p.status === "drop" && !locked;
  const media = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`
    : `<div class="ph swatch-${p.swatch || 1}" role="img" aria-label="${esc(p.name)}"></div>`;
  const badge = p.status === "sold" ? `<span class="badge sold">Sold</span>`
    : isNew ? `<span class="badge new">New</span>` : "";
  let actions = "";
  if (locked) {
    actions = `<a class="btn btn-ghost" href="#list">Get first access</a>`;
  } else if (p.status !== "sold") {
    if (p.buyUrl) actions += `<a class="btn btn-primary" href="${esc(p.buyUrl)}">Buy now</a>`;
    actions += `<a class="btn btn-ghost" href="${esc(p.depopUrl || S.depop)}" target="_blank" rel="noopener">Buy on Depop</a>`;
  }
  return `<article class="product reveal${locked ? " locked" : ""}">
    <div class="img">${badge}${media}</div>
    <div class="meta"><span class="name">${locked ? "Revealed at the drop" : esc(p.name)}</span><span class="price">${locked ? "" : money(p.price)}</span></div>
    <span class="muted">${esc(p.era)}${p.size ? " · Size " + esc(p.size) : ""}</span>
    <div class="actions">${actions}</div>
  </article>`;
}
function renderShop() {
  if (!grid) return;
  const q = ($(".search")?.value || "").toLowerCase();
  const rank = { drop: 0, available: 1, sold: 2 };
  const items = P
    .filter((p) => (filter === "all" || p.category === filter) &&
      (!q || `${p.name} ${p.era} ${p.category}`.toLowerCase().includes(q)))
    .sort((a, b) => rank[a.status] - rank[b.status]);
  grid.innerHTML = items.length ? items.map(card).join("") : `<p class="empty">Nothing on this rack yet. The next drop is coming.</p>`;
  $$(".reveal", grid).forEach(watch);
  $$(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === filter)));
}
$$(".chip").forEach((c) => c.addEventListener("click", () => { filter = c.dataset.filter; renderShop(); }));
$(".search")?.addEventListener("input", renderShop);
renderShop();

// ── Drop list sign-up → Substack if set, else email ────────
$$("form.signup").forEach((form) => form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const email = $("input", form).value.trim();
  if (!email) return;
  location.href = S.substack
    ? `${S.substack.replace(/\/$/, "")}/subscribe?email=${encodeURIComponent(email)}`
    : `mailto:${S.email}?subject=${encodeURIComponent("Drop Room list")}&body=${encodeURIComponent("Add me to the drop list: " + email)}`;
}));

// ── Request forms (styling + custom) → pre-filled email ────
$$("form.request").forEach((form) => form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const lines = $$("input, select, textarea", form)
    .filter((f) => f.name)
    .map((f) => `${f.closest("label")?.firstChild.textContent.trim() || f.name}: ${f.value || "—"}`);
  const name = form.elements.name?.value || "";
  location.href = `mailto:${S.email}?subject=${encodeURIComponent(`${form.dataset.subject} — ${name}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
}));
