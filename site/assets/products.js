/*
  Margin Material — vintage catalog
  ─────────────────────────────────
  The only file you touch for a new drop.

    name      Piece name
    price     Number in USD
    category  "dresses" | "tops" | "outerwear" | "accessories"
    era       Short tag, e.g. "1970s"
    size      e.g. "M" or "US 8"
    status    "drop"      → blurred and locked until the countdown hits zero, then goes live with a "New" badge
              "available" → live now
              "sold"      → stays up with a Sold badge (social proof)
    image     Path to a photo, e.g. "/assets/pieces/sunday-midi.jpg" ("" shows a color swatch)
    swatch    1–6, the placeholder look when there's no image
    buyUrl    Shopify product link ("" hides "Buy now")
    depopUrl  Depop listing link ("" falls back to your Depop shop)

  Everything below is a PLACEHOLDER. Replace with your real pieces.
*/
window.PRODUCTS = [
  { name: "The Sunday Best Midi", price: 148, category: "dresses",     era: "1970s", size: "M",    status: "drop",      image: "", swatch: 1, buyUrl: "", depopUrl: "" },
  { name: "Lavender Silk Blouse", price: 64,  category: "tops",        era: "1980s", size: "S",    status: "drop",      image: "", swatch: 3, buyUrl: "", depopUrl: "" },
  { name: "Forest Wool Car Coat", price: 132, category: "outerwear",   era: "1960s", size: "L",    status: "drop",      image: "", swatch: 4, buyUrl: "", depopUrl: "" },
  { name: "Peach Leather Clutch", price: 46,  category: "accessories", era: "1990s", size: "One",  status: "drop",      image: "", swatch: 6, buyUrl: "", depopUrl: "" },
  { name: "Sage Gingham Two-Piece", price: 96, category: "dresses",    era: "1990s", size: "M",    status: "available", image: "", swatch: 2, buyUrl: "", depopUrl: "" },
  { name: "Ivory Linen Shirt",    price: 38,  category: "tops",        era: "1980s", size: "M",    status: "sold",      image: "", swatch: 5, buyUrl: "", depopUrl: "" },
];
