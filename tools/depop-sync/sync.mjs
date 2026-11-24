#!/usr/bin/env node
/*
  Margin Material — Depop inventory sync
  ──────────────────────────────────────
  Run this on YOUR computer. Depop blocks cloud servers, so the sync has to come
  from a normal home or phone connection.

    cd tools/depop-sync
    npm install            (first time only)
    npm run sync           opens your shop, reads every listing, writes the feed
    npm run sync:push      same, then commits and pushes so the site updates

  Options:
    --shop <username>   default: margin_material_vintage
    --out <file>        default: ../../concepts/journal/assets/depop-feed.json
    --headless          run without showing the browser window
    --push              git commit + push the updated feed
*/
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : dflt; };
const flag = (name) => args.includes(`--${name}`);

const shop = opt("shop", "margin_material_vintage");
const out = resolve(here, opt("out", "../../concepts/journal/assets/depop-feed.json"));
const headless = flag("headless");

const extractor = await readFile(resolve(here, "extract.js"), "utf8");

const browser = await chromium.launch({ headless, args: ["--disable-blink-features=AutomationControlled"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: "en-US" });

// Keep every JSON response Depop's own page loads: it carries the full listing data.
const captured = [];
page.on("response", async (r) => {
  if (!/depop\.com/.test(r.url())) return;
  if (!(r.headers()["content-type"] || "").includes("json")) return;
  try { captured.push(await r.text()); } catch { /* body not available */ }
});

console.log(`Opening https://www.depop.com/${shop}/ …`);
const res = await page.goto(`https://www.depop.com/${shop}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
if (res && res.status() === 403) {
  console.error("Depop refused this connection (403). Run the sync from a home or phone connection, without a VPN.");
  if (!headless) console.error("If a check appears in the browser window, complete it and run the sync again.");
  await browser.close();
  process.exit(1);
}

// Dismiss the cookie banner if it shows, then scroll until no new listings load.
await page.waitForTimeout(3000);
for (const label of ["Accept", "Accept all", "Allow all"]) {
  const b = page.getByRole("button", { name: label, exact: true });
  if (await b.count()) { await b.first().click().catch(() => {}); break; }
}
let last = -1, stable = 0;
while (stable < 3) {
  const n = await page.locator('a[href*="/products/"]').count();
  if (n === last) stable++; else { stable = 0; last = n; }
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(1500);
}

const feed = await page.evaluate(
  ({ code, extra }) => { eval(code); return extractDepopInventory(extra); }, // eslint-disable-line no-eval
  { code: extractor.replace(/if \(typeof module[\s\S]*$/, ""), extra: captured },
);
await browser.close();

if (!feed.count) {
  console.error("No listings found. Open the shop in your browser to check it has active listings, then try again.");
  process.exit(1);
}

await mkdir(dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(feed, null, 2) + "\n");
const live = feed.items.filter((i) => !i.sold).length;
console.log(`Saved ${feed.count} listings (${live} for sale, ${feed.count - live} sold) to ${out}`);

if (flag("push")) {
  const git = (...a) => execFileSync("git", a, { cwd: here, stdio: "inherit" });
  git("add", out);
  let changed = true;
  try { execFileSync("git", ["diff", "--cached", "--quiet", "--", out], { cwd: here }); changed = false; } catch { /* exit 1 = staged changes */ }
  if (!changed) {
    console.log("Nothing new to publish: the feed matches the last sync.");
  } else {
    git("commit", "-m", `Update Depop inventory feed (${feed.count} listings)`, "--", out);
    git("push");
    console.log("Pushed. Cloudflare Pages will redeploy the site in a minute or two.");
  }
}
