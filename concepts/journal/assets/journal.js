/* Margin Material — The Margin Journal (concept B) */
const DEPOP = "https://depop.app.link/KBBployVb7b";

const PIECES = [
  { name: "The Sunday Best Midi",  price: 148, cat: "dresses",     era: "1970s", size: "M",   sw: 1, sold: false, note: "the one" },
  { name: "Lavender Silk Blouse",  price: 64,  cat: "tops",        era: "1980s", size: "S",   sw: 3, sold: false, note: "real silk" },
  { name: "Forest Wool Car Coat",  price: 132, cat: "outerwear",   era: "1960s", size: "L",   sw: 4, sold: false, note: "fully lined" },
  { name: "Sage Gingham Two-Piece",price: 96,  cat: "dresses",     era: "1990s", size: "M",   sw: 2, sold: false, note: "" },
  { name: "Peach Leather Clutch",  price: 46,  cat: "accessories", era: "1990s", size: "One", sw: 6, sold: false, note: "" },
  { name: "Ivory Linen Shirt",     price: 38,  cat: "tops",        era: "1980s", size: "M",   sw: 5, sold: true,  note: "" },
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tilts = ["-1.6deg", "1.2deg", "-0.6deg", "1.8deg", "-1.2deg", "0.8deg"];

function card(p, i) {
  const stamp = p.sold ? `<span class="stamp">Sold</span>` : "";
  const actions = p.sold
    ? `<span class="meta">Gone to a good home.</span>`
    : `<div class="btns"><a class="btn solid" href="#" data-buy>Buy now</a><a class="btn" href="${DEPOP}" target="_blank" rel="noopener">Buy on Depop</a></div>`;
  return `<article class="piece">
    <div class="photo" style="--tilt:${tilts[i % tilts.length]}"><div class="img sw${p.sw}" role="img" aria-label="${esc(p.name)}"></div>${stamp}</div>
    <div class="row"><span class="name">${esc(p.name)}</span><span class="price">$${p.price}</span></div>
    <span class="meta">${esc(p.era)} · Size ${esc(p.size)}${p.note ? ` · <em>${esc(p.note)}</em>` : ""}</span>
    ${actions}
  </article>`;
}

document.querySelectorAll("[data-pieces]").forEach((grid) => {
  const limit = Number(grid.dataset.pieces) || PIECES.length;
  const chips = document.querySelectorAll(".chip");
  let filter = "all";
  const render = () => {
    const list = PIECES.filter((p) => filter === "all" || p.cat === filter).slice(0, limit);
    grid.innerHTML = list.map(card).join("") || `<p class="muted">Nothing in this section right now. New pieces land every week.</p>`;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === filter)));
  };
  chips.forEach((c) => c.addEventListener("click", () => { filter = c.dataset.filter; render(); }));
  render();
});

// "Buy now" connects to Shopify checkout on the live site
document.addEventListener("click", (e) => {
  const buy = e.target.closest("[data-buy]");
  if (!buy) return;
  e.preventDefault();
  buy.textContent = "Checkout opens here";
});

// Forms: mock-up confirmation (live site sends to Britt's inbox)
document.querySelectorAll("form[data-form]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = form.querySelector(".sent") || Object.assign(document.createElement("p"), { className: "sent" });
    msg.textContent = form.dataset.form === "subscribe" ? "You're on the list. See you in the margins." : "Request received. Britt will be in touch.";
    form.append(msg);
    form.querySelectorAll("input, textarea").forEach((el) => (el.value = ""));
  });
});

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
