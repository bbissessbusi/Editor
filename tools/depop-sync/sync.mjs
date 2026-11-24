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
const shopUrl = opt("from", `https://www.depop.com/${shop}/`); // --from: testing only

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

console.log(`Opening ${shopUrl} …`);
const res = await page.goto(shopUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
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
// Collect at every step: Depop removes cards that scroll off screen, so reading
// only at the end misses listings. Stop once 5 steps in a row add nothing new.
const code = extractor.replace(/if \(typeof module[\s\S]*$/, "");
const collect = (seed) => page.evaluate(
  ({ code, extra, seed }) => { eval(code); return extractDepopInventory(extra, seed); }, // eslint-disable-line no-eval
  { code, extra: captured, seed },
);
let feed = await collect([]);
let quiet = 0;
while (quiet < 5) {
  const before = feed.count;
  await page.mouse.wheel(0, 1800);
  await page.waitForTimeout(1800);
  const more = page.getByRole("button", { name: /load more|show more|see more/i });
  if (await more.count()) await more.first().click().catch(() => {});
  const sample = feed._sample;
  feed = await collect(feed.items);
  feed._sample = feed._sample || sample;
  quiet = feed.count > before ? 0 : quiet + 1;
  process.stdout.write(`\r  ${feed.count} listings found…`);
}
// One last pass from the top, in case anything above was missed.
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
feed = { ...(await collect(feed.items)), _sample: feed._sample };
console.log("");
await browser.close();

if (!feed.count) {
  console.error("No listings found. Open the shop in your browser to check it has active listings, then try again.");
  process.exit(1);
}

// Keep one raw Depop listing next to this script, so a format change is quick to diagnose.
const sampleFile = resolve(here, "last-sample.json");
await writeFile(sampleFile, JSON.stringify(feed._sample || null, null, 2) + "\n");
delete feed._sample;

await mkdir(dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(feed, null, 2) + "\n");
const noPrice = feed.items.filter((i) => i.price == null).length;
if (noPrice) console.warn(`Warning: ${noPrice} of ${feed.count} listings have no price. Send tools/depop-sync/last-sample.json to Claude.`);
const live = feed.items.filter((i) => !i.sold).length;
console.log(`Saved ${feed.count} listings (${live} for sale, ${feed.count - live} sold) to ${out}`);

if (flag("push")) {
  const git = (...a) => execFileSync("git", a, { cwd: here, stdio: "inherit" });
  git("add", out, sampleFile);
  let changed = true;
  try { execFileSync("git", ["diff", "--cached", "--quiet", "--", out, sampleFile], { cwd: here }); changed = false; } catch { /* exit 1 = staged changes */ }
  if (!changed) {
    console.log("Nothing new to publish: the feed matches the last sync.");
  } else {
    git("commit", "-m", `Update Depop inventory feed (${feed.count} listings)`, "--", out, sampleFile);
    git("push");
    console.log("Pushed. Cloudflare Pages will redeploy the site in a minute or two.");
  }
}
