/*
  Margin Material — Depop inventory extractor
  ───────────────────────────────────────────
  Runs inside a Depop shop page (in your own browser, or in sync.mjs).
  It reads every listing the page has loaded and returns a clean inventory feed:

    { shop, fetchedAt, count, items: [{ id, title, price, currency, size, brand,
      category, image, url, sold }] }

  It reads two sources and merges them:
    1. Listing data Depop ships with the page (the __NEXT_DATA__ JSON and any
       extra JSON passed in, such as API responses captured by sync.mjs).
    2. The product cards on screen (links to /products/...), as a fallback.
*/
function extractDepopInventory(extraJson, seedItems) {
  const ORIGIN = "https://www.depop.com";
  const shop = (location.pathname.split("/").filter(Boolean)[0] || "").toLowerCase();
  const items = new Map();
  let sample = null; // one raw listing object, kept for troubleshooting
  // Listings collected on earlier scroll steps. Depop drops cards that scroll off screen,
  // so the callers extract at every step and pass the running list back in.

  const CATS = [
    ["dresses", /\b(dress|gown|maxi|midi|mini dress|sundress|slip)\b/i],
    ["outerwear", /\b(coat|jacket|blazer|trench|parka|cardigan|vest|puffer)\b/i],
    ["bottoms", /\b(jeans|pants|trousers|skirt|shorts|slacks)\b/i],
    ["accessories", /\b(bag|purse|clutch|tote|belt|scarf|hat|jewel|necklace|earring|bracelet|shoe|boot|heel|sandal)\b/i],
    ["tops", /\b(top|blouse|shirt|tee|t-shirt|sweater|knit|tank|cami|bodysuit|corset|hoodie|sweatshirt)\b/i],
  ];
  const catOf = (text) => (CATS.find(([, re]) => re.test(text || "")) || ["other"])[0];
  // The title decides first ("…Plaid Blouse" is a top even if the description says "dress it up").
  const guessCategory = (title, more) => { const c = catOf(title); return c !== "other" ? c : catOf(more); };

  const cleanTitle = (desc, slug) => {
    let t = String(desc || "").split(/\r?\n/).map((s) => s.trim()).find(Boolean) || "";
    t = t.replace(/#\S+/g, "")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
      .split(/\s+[|•·]\s+/)[0]
      .replace(/[\s|•·…]+$/, "")
      .replace(/\s{2,}/g, " ").trim();
    if (!t && slug) t = slug.replace(/^[^-]+-/, "").replace(/-[a-z0-9]{4,}$/i, "").replace(/-/g, " ");
    t = t.charAt(0).toUpperCase() + t.slice(1);
    return t.length > 70 ? t.slice(0, 67).replace(/\s+\S*$/, "") + "…" : t;
  };

  const num = (v) => {
    if (v == null) return null;
    if (typeof v === "number") return v;
    const m = String(v).replace(/,/g, "").match(/\d+(\.\d+)?/);
    return m ? Number(m[0]) : null;
  };

  // Depop nests prices in a few shapes (price.priceAmount, pricing.original_price.total_price, …).
  // Search the price object at any depth; a discounted/sale price wins over the original.
  const findPrice = (o) => {
    const found = [];
    const walk = (v, path, depth) => {
      if (v == null || depth > 6) return;
      if (typeof v === "number" || (typeof v === "string" && /^\d[\d,]*(\.\d+)?$/.test(v.trim()))) {
        if (/price|amount|total/i.test(path) && !/fee|shipping|postage|tax|percent|(^|[._])(count|id)$/i.test(path)) found.push({ path, value: num(v) });
        return;
      }
      if (typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, path + "." + k, depth + 1);
    };
    walk(o.pricing, "pricing", 0);
    walk(o.price, "price", 0);
    for (const k of ["priceAmount", "price_amount", "totalPrice", "total_price"]) if (o[k] != null) walk(o[k], k, 0);
    const ok = found.filter((f) => f.value > 0);
    if (!ok.length) return { price: null, currency: null };
    const pick = ok.find((f) => /discount|sale|reduced/i.test(f.path)) || ok.find((f) => /total/i.test(f.path)) || ok[0];
    let currency = null;
    const cw = (v, d) => { if (!v || typeof v !== "object" || d > 6 || currency) return; for (const [k, x] of Object.entries(v)) { if (/currency/i.test(k) && typeof x === "string") { currency = x; return; } cw(x, d + 1); } };
    cw({ a: o.pricing, b: o.price, c: o.currency }, 0);
    return { price: pick.value, currency };
  };

  const firstImage = (o) => {
    let best = null;
    const walk = (v, depth) => {
      if (best || depth > 6 || v == null) return;
      if (typeof v === "string") {
        if (/^https:\/\/[^"]*depop[^"]*\.(jpe?g|png|webp)/i.test(v)) best = v;
        return;
      }
      if (Array.isArray(v)) return v.forEach((x) => walk(x, depth + 1));
      if (typeof v === "object") {
        // prefer the largest format when Depop lists several (P0 is usually the biggest)
        if (v.formats && typeof v.formats === "object") {
          const f = v.formats.P0 || v.formats.P1 || Object.values(v.formats)[0];
          if (f && f.url) { best = f.url; return; }
        }
        Object.values(v).forEach((x) => walk(x, depth + 1));
      }
    };
    walk(o.pictures || o.preview || o.pictureData || o.images || o, 0);
    return best;
  };

  const add = (it) => {
    if (!it.id) return;
    const prev = items.get(it.id) || {};
    const merged = { ...prev };
    for (const [k, v] of Object.entries(it)) if (v !== null && v !== undefined && v !== "" && (merged[k] == null || merged[k] === "")) merged[k] = v;
    if (it.sold) merged.sold = true;
    items.set(it.id, merged);
  };

  (seedItems || []).forEach((it) => add(it));

  // ── 1. Structured listing data ──
  const fromObject = (o) => {
    const slug = typeof o.slug === "string" ? o.slug : null;
    if (!slug || !/^[a-z0-9_.-]+-[a-z0-9-]+$/i.test(slug)) return false;
    const looksLikeProduct = "price" in o || "pricing" in o || "pictures" in o || "preview" in o || "description" in o;
    if (!looksLikeProduct) return false;
    const { price, currency: cur } = findPrice(o);
    const currency = cur || (typeof o.currency === "string" ? o.currency : null) || "USD";
    if (!sample) sample = JSON.parse(JSON.stringify(o, (k, v) => (typeof v === "string" && v.length > 300 ? v.slice(0, 300) : v)));
    const sizeArr = o.sizes || o.size || o.variants;
    let size = "";
    if (Array.isArray(sizeArr)) size = sizeArr.map((s) => (typeof s === "string" ? s : s.name || s.size || s.label || "")).filter(Boolean).join(" / ");
    else if (sizeArr && typeof sizeArr === "object") size = sizeArr.name || sizeArr.label || "";
    else if (typeof sizeArr === "string") size = sizeArr;
    const desc = o.description || o.title || "";
    const status = String(o.status || "").toLowerCase();
    add({
      id: slug,
      title: cleanTitle(desc, slug),
      price, currency, size,
      brand: (o.brand && (o.brand.name || o.brand)) || o.brandName || "",
      category: guessCategory(cleanTitle(desc, slug), `${desc} ${slug}`),
      image: firstImage(o),
      url: `${ORIGIN}/products/${slug}/`,
      sold: o.sold === true || o.isSold === true || status === "sold" || status === "purchased",
    });
    return true;
  };
  const walkJson = (v, depth = 0) => {
    if (!v || depth > 14) return;
    if (Array.isArray(v)) return v.forEach((x) => walkJson(x, depth + 1));
    if (typeof v === "object") {
      if (fromObject(v)) return;
      Object.values(v).forEach((x) => walkJson(x, depth + 1));
    }
  };
  try {
    const nd = document.getElementById("__NEXT_DATA__");
    if (nd) walkJson(JSON.parse(nd.textContent));
  } catch (e) { /* page without Next data */ }
  (extraJson || []).forEach((j) => { try { walkJson(typeof j === "string" ? JSON.parse(j) : j); } catch (e) {} });

  // ── 2. Product cards on screen ──
  document.querySelectorAll('a[href*="/products/"]').forEach((a) => {
    const m = a.getAttribute("href").match(/\/products\/([^/?#]+)/);
    if (!m) return;
    const slug = m[1];
    let card = a.closest("li, article, [class*='product'], [class*='Product']") || a;
    // climb a few levels until the price text is inside the card
    for (let i = 0; i < 4 && !/[$£€]\s?\d/.test(card.innerText || "") && card.parentElement; i++) {
      const up = card.parentElement;
      if (up.querySelectorAll('a[href*="/products/"]').length > 1) break; // reached the grid
      card = up;
    }
    const text = card.innerText || "";
    const img = card.querySelector("img");
    let src = img && (img.currentSrc || img.src);
    if (img && img.srcset) {
      const last = img.srcset.split(",").map((s) => s.trim().split(" ")[0]).filter(Boolean).pop();
      if (last) src = last;
    }
    const priceMatch = text.match(/([$£€])\s?(\d[\d,]*(?:\.\d{2})?)/);
    const sizeMatch = text.match(/\b(?:Size\s*)?(XXS|XS|S|M|L|XL|XXL|XXXL|One size|US\s?\d{1,2}|UK\s?\d{1,2}|W\d{2})\b/i);
    add({
      id: slug,
      title: cleanTitle(img && img.alt, slug),
      price: priceMatch ? num(priceMatch[2]) : null,
      currency: priceMatch ? ({ "$": "USD", "£": "GBP", "€": "EUR" })[priceMatch[1]] : null,
      size: sizeMatch ? sizeMatch[1] : "",
      category: guessCategory(cleanTitle(img && img.alt, slug), slug),
      image: src || null,
      url: `${ORIGIN}/products/${slug}/`,
      sold: /\bsold\b/i.test(text),
    });
  });

  // Depop slugs start with the seller's username. If any listing carries this
  // shop's name, drop the rest (e.g. "you may also like" items from other sellers).
  let list = [...items.values()];
  const own = list.filter((it) => shop && it.id.toLowerCase().startsWith(shop + "-"));
  if (own.length) list = own;
  return { shop, source: location.href, fetchedAt: new Date().toISOString(), count: list.length, items: list, _sample: sample };
}

if (typeof module !== "undefined") module.exports = { extractDepopInventory };
