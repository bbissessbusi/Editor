/* Margin Material — The Margin Journal
   ─────────────────────────────────────
   Everything you edit lives in the three lists at the top.
*/

// ── I. FOUND: your Depop listings ─────────────────────────
// Each piece links straight to its Depop listing, where the buyer checks out.
// image: a photo path such as "assets/found/sunday-midi.jpg" ("" shows a swatch)
const DEPOP_SHOP = "https://www.depop.com/margin_material_vintage/";
const PIECES = [
  { name: "The Sunday Best Midi",   price: 148, cat: "dresses",     era: "1970s", size: "M",   sw: 1, sold: false, note: "the one",     image: "", depop: "" },
  { name: "Lavender Silk Blouse",   price: 64,  cat: "tops",        era: "1980s", size: "S",   sw: 3, sold: false, note: "real silk",   image: "", depop: "" },
  { name: "Forest Wool Car Coat",   price: 132, cat: "outerwear",   era: "1960s", size: "L",   sw: 4, sold: false, note: "fully lined", image: "", depop: "" },
  { name: "Sage Gingham Two-Piece", price: 96,  cat: "dresses",     era: "1990s", size: "M",   sw: 2, sold: false, note: "",            image: "", depop: "" },
  { name: "Peach Leather Clutch",   price: 46,  cat: "accessories", era: "1990s", size: "One", sw: 6, sold: false, note: "",            image: "", depop: "" },
  { name: "Ivory Linen Shirt",      price: 38,  cat: "tops",        era: "1980s", size: "M",   sw: 5, sold: true,  note: "",            image: "", depop: "" },
];

// ── II. STYLED: your Styled By services (prices are placeholders) ──
const SERVICES = [
  { id: "edit",  name: "Virtual Closet Edit",      price: 0, mins: 60, blurb: "We go through what you own on video and build outfits from it." },
  { id: "shop",  name: "Virtual Shopping Session", price: 0, mins: 75, blurb: "I build you a shoppable edit, vintage included, and walk you through it." },
  { id: "event", name: "Virtual Event Styling",    price: 0, mins: 60, blurb: "One occasion, one complete look, styled head to toe." },
];

// ── III. MADE: pieces you've already sewn ─────────────────
const SEWN = [
  { name: "Oxblood Wrap Dress",    for: "Wedding guest", sw: 1, image: "" },
  { name: "Lavender Column Gown",  for: "Gala",          sw: 3, image: "" },
  { name: "Sage Tiered Midi",      for: "Church",        sw: 2, image: "" },
  { name: "Forest Satin Slip",     for: "Birthday",      sw: 4, image: "" },
  { name: "Peach Puff-Sleeve Mini",for: "Photoshoot",    sw: 6, image: "" },
  { name: "Ivory Linen Two-Piece", for: "Everyday",      sw: 5, image: "" },
];

/* ───────────────────────────────────────────────────────── */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => (n ? `$${n}` : "$—");
const tilts = ["-1.6deg", "1.2deg", "-0.6deg", "1.8deg", "-1.2deg", "0.8deg"];
const media = (p, label) => p.image
  ? `<img class="img" src="${esc(p.image)}" alt="${esc(label)}" loading="lazy" style="object-fit:cover">`
  : `<div class="img sw${p.sw}" role="img" aria-label="${esc(label)}"></div>`;

// ── Found: Depop catalog ──────────────────────────────────
function pieceCard(p, i) {
  const url = p.depop || DEPOP_SHOP;
  const stamp = p.sold ? `<span class="stamp">Sold</span>` : "";
  const action = p.sold
    ? `<span class="meta">Gone to a good home.</span>`
    : `<div class="btns"><a class="btn solid" href="${esc(url)}" target="_blank" rel="noopener">Buy on Depop</a></div>`;
  return `<article class="piece">
    <a class="cover" href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(p.name)} on Depop">
      <div class="photo" style="--tilt:${tilts[i % tilts.length]}">${media(p, p.name)}${stamp}</div>
    </a>
    <div class="row"><span class="name">${esc(p.name)}</span><span class="price">$${p.price}</span></div>
    <span class="meta">${esc(p.era)} · Size ${esc(p.size)}${p.note ? ` · <em>${esc(p.note)}</em>` : ""}</span>
    ${action}
  </article>`;
}
$$("[data-pieces]").forEach((grid) => {
  const limit = Number(grid.dataset.pieces) || PIECES.length;
  const chips = $$(".chip");
  let filter = "all";
  const render = () => {
    const list = PIECES.filter((p) => filter === "all" || p.cat === filter).slice(0, limit);
    grid.innerHTML = list.map(pieceCard).join("") || `<p class="muted">Nothing in this section right now. Check the Depop shop for the newest pieces.</p>`;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === filter)));
  };
  chips.forEach((c) => c.addEventListener("click", () => { filter = c.dataset.filter; render(); }));
  render();
});
$$("[data-depop-shop]").forEach((a) => (a.href = DEPOP_SHOP));

// ── Made: sewn gallery ────────────────────────────────────
$$("[data-sewn]").forEach((grid) => {
  const limit = Number(grid.dataset.sewn) || SEWN.length;
  grid.innerHTML = SEWN.slice(0, limit).map((p, i) => `<article class="piece">
      <div class="photo" style="--tilt:${tilts[(i + 2) % tilts.length]}">${media(p, p.name)}</div>
      <div class="row"><span class="name">${esc(p.name)}</span></div>
      <span class="meta">Made for: ${esc(p.for)}</span>
    </article>`).join("");
});

// ── Styled: service cards ─────────────────────────────────
$$("[data-services]").forEach((wrap) => {
  wrap.innerHTML = SERVICES.map((s) => `<article class="svc">
      <h3 class="h3">${esc(s.name)}</h3>
      <div class="price">${money(s.price)} <small>· ${s.mins} min · paid upfront</small></div>
      <p class="muted">${esc(s.blurb)}</p>
      <a class="btn solid" href="#book" data-preselect="${s.id}">Book this session</a>
    </article>`).join("");
});

// ── Calendar (shared) ─────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SLOTS = { 1: ["10:00 AM", "12:30 PM", "3:00 PM", "6:00 PM"], 2: ["10:00 AM", "12:30 PM", "3:00 PM", "6:00 PM"], 3: ["12:30 PM", "3:00 PM", "6:00 PM"],
                4: ["10:00 AM", "12:30 PM", "3:00 PM", "6:00 PM"], 5: ["10:00 AM", "12:30 PM", "3:00 PM"], 6: ["10:00 AM", "12:30 PM"] }; // Sunday closed
const fmtDate = (d) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

function calendar(root, onChange) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  const state = { date: null, time: null };
  root.innerHTML = `<div class="cal-wrap">
      <div><div class="cal-head"><button type="button" data-prev aria-label="Previous month">‹</button><b data-title></b><button type="button" data-next aria-label="Next month">›</button></div>
        <div class="cal" data-grid></div></div>
      <div><p class="slots-title" data-slot-title>Pick a day to see open times.</p><div class="slots" data-slots></div></div>
    </div>`;
  const grid = $("[data-grid]", root), slots = $("[data-slots]", root);
  const draw = () => {
    $("[data-title]", root).textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
    $("[data-prev]", root).disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    const first = view.getDay(), days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    let html = ["S","M","T","W","T","F","S"].map((d) => `<span class="dow">${d}</span>`).join("");
    html += "<span></span>".repeat(first);
    for (let n = 1; n <= days; n++) {
      const d = new Date(view.getFullYear(), view.getMonth(), n);
      const open = d > today && SLOTS[d.getDay()];
      const on = state.date && d.getTime() === state.date.getTime();
      html += `<button type="button" class="day" data-day="${n}" ${open ? "" : "disabled"} aria-pressed="${on}" aria-label="${fmtDate(d)}">${n}</button>`;
    }
    grid.innerHTML = html;
  };
  const drawSlots = () => {
    if (!state.date) return;
    $("[data-slot-title]", root).textContent = fmtDate(state.date);
    slots.innerHTML = SLOTS[state.date.getDay()].map((t) => `<button type="button" class="slot" aria-pressed="${t === state.time}">${t}</button>`).join("");
  };
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".day"); if (!b || b.disabled) return;
    state.date = new Date(view.getFullYear(), view.getMonth(), Number(b.dataset.day)); state.time = null;
    draw(); drawSlots(); onChange?.({ ...state });
  });
  slots.addEventListener("click", (e) => {
    const b = e.target.closest(".slot"); if (!b) return;
    state.time = b.textContent; drawSlots(); onChange?.({ ...state });
  });
  $("[data-prev]", root).addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); draw(); });
  $("[data-next]", root).addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); draw(); });
  draw();
  return state;
}

// ── Styled: book + pay upfront ────────────────────────────
const booker = $("[data-booker]");
if (booker) {
  const steps = ["Session", "Date & time", "Pay", "Confirmed"];
  const st = { step: 0, svc: null, slot: { date: null, time: null } };
  const panel = $("[data-panel]", booker), nav = $("[data-steps]", booker);
  const back = $("[data-back]", booker), next = $("[data-next-step]", booker);
  let cal = null;

  const ready = () => (st.step === 0 && st.svc) || (st.step === 1 && st.slot.date && st.slot.time) || st.step === 2;
  const render = () => {
    nav.innerHTML = steps.map((s, i) => `<li class="${i < st.step ? "done" : ""}" ${i === st.step ? 'aria-current="step"' : ""}>${i + 1}. ${s}</li>`).join("");
    back.hidden = st.step === 0 || st.step === 3;
    next.hidden = st.step === 3;
    const svc = SERVICES.find((s) => s.id === st.svc);
    if (st.step === 0) {
      panel.innerHTML = `<div class="pick-svc">${SERVICES.map((s) => `<button type="button" data-svc="${s.id}" aria-pressed="${s.id === st.svc}"><b>${esc(s.name)}</b><span>${s.mins} min · ${money(s.price)}</span></button>`).join("")}</div>`;
      next.textContent = "Choose a time";
    } else if (st.step === 1) {
      panel.innerHTML = `<div data-cal></div>`;
      cal = calendar($("[data-cal]", panel), (s) => { st.slot = s; next.disabled = !ready(); });
      if (st.slot.date) { /* keep it simple: re-pick after going back */ st.slot = { date: null, time: null }; }
      next.textContent = "Continue to payment";
    } else if (st.step === 2) {
      panel.innerHTML = `<div class="summary">
          <div class="line"><span>${esc(svc.name)}</span><span>${money(svc.price)}</span></div>
          <div class="line muted"><span>${fmtDate(st.slot.date)} · ${st.slot.time}</span><span>${svc.mins} min on video</span></div>
          <div class="line total"><span>Due today</span><span>${money(svc.price)}</span></div>
        </div>
        <div class="pay">
          <label class="full" for="pay-name">Name<input id="pay-name" autocomplete="name" placeholder="Your name"></label>
          <label class="full" for="pay-email">Email<input id="pay-email" type="email" autocomplete="email" placeholder="you@email.com"></label>
          <label class="full" for="pay-card">Card<input id="pay-card" inputmode="numeric" placeholder="Card checkout opens here on the live site"></label>
        </div>
        <p class="secure">Payment is taken upfront to hold your spot. The live site uses a secure checkout from your booking tool.</p>`;
      next.textContent = `Pay ${money(svc.price)} & book`;
    } else {
      panel.innerHTML = `<div class="done-card"><p class="hand">You're booked.</p>
          <p><b>${esc(svc.name)}</b><br>${fmtDate(st.slot.date)} at ${st.slot.time}</p>
          <p class="muted">A confirmation, your style questionnaire and the video link arrive by email.</p></div>`;
    }
    next.disabled = !ready();
  };
  panel.addEventListener("click", (e) => {
    const b = e.target.closest("[data-svc]"); if (!b) return;
    st.svc = b.dataset.svc; render();
  });
  next.addEventListener("click", () => { if (ready()) { st.step++; render(); booker.scrollIntoView({ block: "start" }); } });
  back.addEventListener("click", () => { st.step--; render(); });
  document.addEventListener("click", (e) => {
    const pre = e.target.closest("[data-preselect]"); if (!pre) return;
    st.svc = pre.dataset.preselect; st.step = 0; render();
  });
  render();
}

// ── Made: commission form ─────────────────────────────────
const commission = $("[data-commission]");
if (commission) {
  // Inspiration photos
  const drop = $(".drop", commission), input = $("#c-photos", commission), thumbs = $(".thumbs", commission);
  let files = [];
  const drawThumbs = () => {
    thumbs.innerHTML = "";
    files.forEach((f, i) => {
      const fig = document.createElement("figure");
      const img = document.createElement("img"); img.alt = f.name; img.src = URL.createObjectURL(f);
      const x = document.createElement("button"); x.type = "button"; x.textContent = "×"; x.setAttribute("aria-label", `Remove ${f.name}`);
      x.onclick = () => { files.splice(i, 1); drawThumbs(); };
      fig.append(img, x); thumbs.append(fig);
    });
  };
  const add = (list) => { files = files.concat([...list].filter((f) => f.type.startsWith("image/"))).slice(0, 10); drawThumbs(); };
  drop.addEventListener("click", () => input.click());
  drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
  input.addEventListener("change", () => add(input.files));
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => add(e.dataTransfer.files));

  // Consult + optional fitting
  const consult = calendar($("[data-consult-cal]", commission), (c) => { if (c.date && c.time) $("[data-error]", commission).hidden = true; });
  const fitWrap = $("[data-fitting]", commission);
  let fitting = null;
  $("#c-fit", commission).addEventListener("change", (e) => {
    fitWrap.hidden = !e.target.checked;
    if (e.target.checked && !fitting) fitting = calendar($("[data-fit-cal]", commission));
  });

  commission.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("[data-error]", commission);
    if (!consult.date || !consult.time) { err.textContent = "Pick a consult day and time in step 4 to send your request."; err.hidden = false; $("[data-consult-cal]", commission).scrollIntoView({ block: "center" }); return; }
    err.hidden = true;
    const d = new FormData(commission);
    const fit = fitting && fitting.date && fitting.time ? `<br>First fitting: ${fmtDate(fitting.date)} at ${fitting.time}` : "";
    $("[data-commission-wrap]").innerHTML = `<div class="done-card"><p class="hand">Your request is in.</p>
      <p><b>${esc(d.get("piece") || "Custom piece")}</b> for ${esc(d.get("occasion"))}<br>
      Consult: ${fmtDate(consult.date)} at ${consult.time} (${esc(d.get("format"))})${fit}</p>
      <p class="muted">${files.length} inspiration photo${files.length === 1 ? "" : "s"} attached. Britt reviews every request before the consult.</p></div>`;
  });
}

// ── Subscribe ─────────────────────────────────────────────
$$("form[data-form]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $(".sent", form) || Object.assign(document.createElement("p"), { className: "sent" });
    msg.textContent = "You're on the list. See you in the margins.";
    form.append(msg);
    $$("input", form).forEach((el) => (el.value = ""));
  });
});
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
