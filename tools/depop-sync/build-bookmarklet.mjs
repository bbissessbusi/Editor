// Builds install.html: a page with the "Pull Depop inventory" bookmark to drag
// into your browser's bookmarks bar. Run: npm run bookmarklet
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const extractor = (await readFile(resolve(here, "extract.js"), "utf8"))
  .replace(/if \(typeof module[\s\S]*$/, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .split("\n").map((l) => l.replace(/^\s+/, "").replace(/\s\/\/ .*$/, "")).filter((l) => l && !l.startsWith("//")).join("\n");

// Runs on depop.com: scroll until every listing has loaded, extract, download the feed.
const runner = `
(async () => {
  if (!/depop\\.com$/.test(location.hostname)) { alert("Open your Depop shop page first, then click this bookmark."); return; }
  const box = document.createElement("div");
  box.style.cssText = "position:fixed;z-index:2147483647;left:50%;top:20px;transform:translateX(-50%);background:#23182f;color:#fde9dc;font:600 15px/1.4 -apple-system,Arial,sans-serif;padding:14px 22px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.3)";
  document.body.appendChild(box);
  const say = (t) => (box.textContent = t);
  let last = -1, stable = 0;
  while (stable < 3) {
    const n = document.querySelectorAll('a[href*="/products/"]').length;
    say("Margin Material: loading listings… " + n);
    if (n === last) stable++; else { stable = 0; last = n; }
    window.scrollBy(0, 4000);
    await new Promise((r) => setTimeout(r, 1400));
  }
  ${extractor}
  const feed = extractDepopInventory([]);
  const blob = new Blob([JSON.stringify(feed, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "depop-feed.json";
  document.body.appendChild(a); a.click(); a.remove();
  say("Saved depop-feed.json with " + feed.count + " listings. Send that file to Claude or drop it into the site.");
  setTimeout(() => box.remove(), 9000);
})();`;

const href = "javascript:" + encodeURIComponent(runner.replace(/\n\s*/g, "\n"));

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Depop Inventory Bookmark</title>
<style>
  :root { --paper:#fde9dc; --ink:#23182f; --rust:#b04f28; --sheet:#fff6ef; }
  body { margin:0; background:var(--paper); color:var(--ink); font:17px/1.6 -apple-system, "Helvetica Neue", Arial, sans-serif; }
  main { max-width:640px; margin:0 auto; padding:56px 20px; display:grid; gap:22px; }
  h1 { font:400 44px/1.05 Georgia, serif; margin:0; }
  .bm { display:inline-block; background:var(--rust); color:#fff; text-decoration:none; font-weight:700; padding:14px 26px; border-radius:999px; cursor:grab; }
  ol { background:var(--sheet); border-radius:18px; padding:24px 24px 24px 44px; margin:0; display:grid; gap:10px; }
  .muted { color:#6d5b6c; font-size:15px; }
</style>
</head>
<body>
<main>
  <h1>Pull your Depop inventory</h1>
  <p>Drag this button to your browser's bookmarks bar:</p>
  <p><a class="bm" href="${href.replace(/"/g, "&quot;")}">Pull Depop inventory</a></p>
  <ol>
    <li>Open <b>depop.com/margin_material_vintage</b> on your computer.</li>
    <li>Click the <b>Pull Depop inventory</b> bookmark.</li>
    <li>Wait while it scrolls through your shop. It saves <b>depop-feed.json</b> to your Downloads.</li>
    <li>Send that file to Claude, or put it in <code>concepts/journal/assets/</code>. The shop updates from it.</li>
  </ol>
  <p class="muted">Works in Chrome, Safari, Edge and Firefox on a computer. Nothing is sent anywhere: the file is made in your browser and saved to your computer.</p>
</main>
</body>
</html>
`;
await writeFile(resolve(here, "install.html"), html);
console.log(`Wrote install.html (bookmark is ${href.length.toLocaleString()} characters)`);
