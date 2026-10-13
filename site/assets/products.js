/*
  Margin Material — product catalog
  ─────────────────────────────────
  This is the only file you edit to change what's in the shop.

  Each item:
    name      Piece name shown on the card
    price     Number in USD
    category  "vintage" | "custom" | "accessories"
    era       Short tag, e.g. "1970s" or "Made to order"
    status    "available" | "sold" | "coming"
    image     Path or URL to a photo (leave "" to show a fabric swatch)
    swatch    1–6, the placeholder look used when there's no image
    buyUrl    Your Shopify product link (or Shopify checkout link). "" hides the button.
    depopUrl  The listing's Depop link. "" falls back to your Depop shop.

  The items below are PLACEHOLDERS. Replace them with your real pieces.
*/
window.DEPOP_SHOP_URL = "https://depop.app.link/KBBployVb7b";

window.PRODUCTS = [
  {
    name: "The Sunday Best Midi",
    price: 148,
    category: "vintage",
    era: "1970s",
    status: "available",
    image: "",
    swatch: 1,
    buyUrl: "",
    depopUrl: "",
  },
  {
    name: "Oxblood Wrap Dress",
    price: 320,
    category: "custom",
    era: "Made to order",
    status: "available",
    image: "",
    swatch: 3,
    buyUrl: "",
    depopUrl: "",
  },
  {
    name: "Gingham Garden Two-Piece",
    price: 96,
    category: "vintage",
    era: "1990s",
    status: "sold",
    image: "",
    swatch: 2,
    buyUrl: "",
    depopUrl: "",
  },
  {
    name: "Midnight Column Gown",
    price: 410,
    category: "custom",
    era: "Made to order",
    status: "coming",
    image: "",
    swatch: 4,
    buyUrl: "",
    depopUrl: "",
  },
  {
    name: "Linen Market Tote",
    price: 42,
    category: "accessories",
    era: "Upcycled",
    status: "available",
    image: "",
    swatch: 5,
    buyUrl: "",
    depopUrl: "",
  },
  {
    name: "Camel Wool Blazer",
    price: 88,
    category: "vintage",
    era: "1980s",
    status: "available",
    image: "",
    swatch: 6,
    buyUrl: "",
    depopUrl: "",
  },
];
