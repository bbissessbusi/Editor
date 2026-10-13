/*
  Margin Material — site behavior
  Edit SITE below with your real links. Leave a value "" to hide it.
*/
const SITE = {
  email: "hello@marginmaterial.com", // custom orders + newsletter replies go here
  substack: "",                      // e.g. "https://ladybritt.substack.com"
  instagram: "",
  tiktok: "",
  pinterest: "",
  threads: "",
};

// ── Scroll reveal ──────────────────────────────────────────
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 })
  : null;
const watch = (el) => (io ? io.observe(el) : el.classList.add("in"));
document.querySelectorAll(".reveal").forEach(watch);

// ── Footer year + social links ─────────────────────────────
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
document.querySelectorAll("[data-social]").forEach((el) => {
  const url = SITE[el.dataset.social];
  if (url) el.href = url; else el.parentElement.remove();
});
document.querySelectorAll("[data-depop]").forEach((el) => (el.href = window.DEPOP_SHOP_URL || "#"));

// ── Newsletter: send to Substack if set, otherwise email ──
document.querySelectorAll("form.signup").forEach((form) => {
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const email = form.querySelector("input").value.trim();
    if (!email) return;
    if (SITE.substack) {
      window.location.href = `${SITE.substack.replace(/\/$/, "")}/subscribe?email=${encodeURIComponent(email)}`;
    } else {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("First access list")}&body=${encodeURIComponent("Add me to the drop list: " + email)}`;
    }
  });
});

// ── Custom order form → pre-filled email ───────────────────
const custom = document.querySelector("form.custom");
if (custom) {
  custom.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(custom));
    const body = [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Occasion: ${d.occasion}`,
      `Date needed: ${d.date || "Flexible"}`,
      "",
      d.vision,
    ].join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Custom piece — " + d.name)}&body=${encodeURIComponent(body)}`;
  });
}

// ── Shop ───────────────────────────────────────────────────
const grid = document.querySelector("[data-grid]");
if (grid && window.PRODUCTS) {
  const chips = document.querySelectorAll(".chip");
  const search = document.querySelector(".search");
  let filter = new URLSearchParams(location.search).get("c") || "all";

  const label = { available: "", sold: "Sold", coming: "Coming soon" };
  const money = (n) => `$${Number(n).toLocaleString("en-US")}`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const card = (p) => {
    const media = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`
      : `<div class="ph swatch-${p.swatch || 1}" role="img" aria-label="${esc(p.name)}"></div>`;
    const badge = label[p.status] ? `<span class="badge ${p.status === "sold" ? "sold" : ""}">${label[p.status]}</span>` : "";
    let actions = "";
    if (p.status === "available") {
      if (p.buyUrl) actions += `<a class="btn btn-primary" href="${esc(p.buyUrl)}">Buy now</a>`;
      actions += `<a class="btn btn-ghost" href="${esc(p.depopUrl || window.DEPOP_SHOP_URL)}" target="_blank" rel="noopener">Buy on Depop</a>`;
    } else if (p.status === "coming") {
      actions = `<a class="btn btn-ghost" href="#list">Get first access</a>`;
    }
    return `<article class="product reveal">
      <div class="img">${badge}${media}</div>
      <div class="meta"><span class="name">${esc(p.name)}</span><span class="price">${money(p.price)}</span></div>
      <span class="muted">${esc(p.era)}</span>
      <div class="actions">${actions}</div>
    </article>`;
  };

  const render = () => {
    const q = (search?.value || "").toLowerCase();
    const items = window.PRODUCTS.filter((p) =>
      (filter === "all" || p.category === filter) &&
      (!q || `${p.name} ${p.era} ${p.category}`.toLowerCase().includes(q))
    );
    grid.innerHTML = items.length
      ? items.map(card).join("")
      : `<p class="empty">Nothing here yet. The next drop is coming.</p>`;
    grid.querySelectorAll(".reveal").forEach(watch);
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === filter)));
  };

  chips.forEach((c) => c.addEventListener("click", () => { filter = c.dataset.filter; render(); }));
  search?.addEventListener("input", render);
  render();
}
