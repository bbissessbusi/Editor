/**
 * Render key-frame previews of the SocialReel composition.
 * Uses puppeteer-core + Playwright's local Chromium (no download needed).
 *
 * Run: node scripts/preview.mjs
 */

import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../out");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Playwright Chromium binary
const CHROME =
  "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome";

// 1080×1920  →  scale down to 540×960 for GitHub readability
const W = 1080;
const H = 1920;
const SCALE = 0.5;
const VW = W * SCALE;
const VH = H * SCALE;

// ── shared design tokens ──────────────────────────────────────────────────────
const BG = "#04050c";
const CYAN = "#00d4ff";
const GOLD = "#f5c518";
const RED = "#ff3b30";

const glassCard = (glow = CYAN) => `
  background: rgba(255,255,255,0.065);
  border: 1.5px solid rgba(255,255,255,0.20);
  border-radius: ${16 * SCALE}px;
  box-shadow: 0 ${6 * SCALE}px ${24 * SCALE}px rgba(0,0,0,.7),
              inset 0 ${1 * SCALE}px 0 rgba(255,255,255,.14),
              0 0 ${32 * SCALE}px ${glow}18;
  position: relative; overflow: hidden;
`;

const heading3d = (color = "#fff", glow = CYAN, size = 50) => `
  font-size: ${size * SCALE}px;
  font-weight: 900;
  font-family: "Arial Black", Impact, sans-serif;
  letter-spacing: ${-1 * SCALE}px;
  line-height: 1.05;
  color: ${color};
  text-shadow:
    0 ${0.5 * SCALE}px 0 rgba(255,255,255,.35),
    0 ${-0.5 * SCALE}px 0 rgba(0,0,0,.7),
    0 ${1 * SCALE}px ${3 * SCALE}px rgba(0,0,0,.9),
    0 0 ${12 * SCALE}px ${glow}55,
    0 0 ${36 * SCALE}px ${glow}28;
`;

const grid = () => `
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(90deg, rgba(0,212,255,.025) 0 1px, transparent 1px 10%),
    repeating-linear-gradient(0deg, rgba(0,212,255,.018) 0 1px, transparent 1px 7.7%);
`;

// ── scenes ────────────────────────────────────────────────────────────────────
const scenes = [
  {
    name: "01-hook",
    label: "Hook (0–3 s)",
    html: () => `
      <div style="position:relative;width:${VW}px;height:${VH}px;background:${BG};overflow:hidden;font-family:sans-serif;">
        <div style="${grid()}"></div>
        <!-- scanlines -->
        <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 1px,transparent 1px 4px);"></div>

        <div style="position:absolute;left:${32 * SCALE}px;right:${32 * SCALE}px;top:${H * 0.13 * SCALE}px;display:flex;flex-direction:column;gap:${14 * SCALE}px;">

          <!-- badge -->
          <div style="display:inline-flex;align-items:center;gap:${5 * SCALE}px;
                      background:${RED};color:#fff;
                      font-size:${15 * SCALE}px;font-weight:800;
                      padding:${5 * SCALE}px ${14 * SCALE}px;border-radius:${25 * SCALE}px;
                      letter-spacing:${1.5 * SCALE}px;text-transform:uppercase;
                      width:fit-content;
                      box-shadow:0 0 ${16 * SCALE}px ${RED}60;">
            ⚡ HOLD ON
          </div>

          <!-- hook text -->
          <div style="${heading3d("#fff","#fff",106)}">AI just wrote</div>
          <div style="${heading3d(RED, RED, 106)}">a 19-page</div>
          <div style="${heading3d("#fff","#fff",106)}">legal doc...</div>

          <!-- sub badge -->
          <div style="${glassCard(CYAN)}padding:${12 * SCALE}px ${20 * SCALE}px;margin-top:${4 * SCALE}px;">
            <div style="position:absolute;top:0;left:0;right:0;height:45%;background:linear-gradient(180deg,rgba(255,255,255,.09),transparent);border-radius:${16 * SCALE}px ${16 * SCALE}px 0 0;"></div>
            <div style="color:${CYAN};font-size:${23 * SCALE}px;font-weight:700;text-shadow:0 0 ${10 * SCALE}px ${CYAN}80;">
              🆓 Free. In 4 minutes.
            </div>
          </div>

          <!-- pills -->
          <div style="display:flex;gap:${8 * SCALE}px;flex-wrap:wrap;margin-top:${4 * SCALE}px;">
            ${["$0 lawyers","19 pages","0 sign-up"].map(t=>`
              <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);
                          border-radius:${20 * SCALE}px;padding:${5 * SCALE}px ${12 * SCALE}px;
                          color:rgba(255,255,255,.7);font-size:${14 * SCALE}px;">${t}</div>
            `).join("")}
          </div>
        </div>
      </div>`,
  },

  {
    name: "02-transition-01",
    label: 'Transition 01 — "The Tool"',
    html: () => `
      <div style="position:relative;width:${VW}px;height:${VH}px;background:rgba(4,5,12,.97);overflow:hidden;font-family:sans-serif;
                  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${16 * SCALE}px;">
        <!-- circle -->
        <div style="width:${100 * SCALE}px;height:${100 * SCALE}px;border-radius:50%;
                    background:radial-gradient(circle at 32% 28%,${CYAN}50,${CYAN}12);
                    border:${1.5 * SCALE}px solid ${CYAN}70;
                    display:flex;align-items:center;justify-content:center;
                    box-shadow:0 0 ${40 * SCALE}px ${CYAN}40,inset 0 0 ${20 * SCALE}px ${CYAN}12;">
          <span style="${heading3d(CYAN,CYAN,100)}letter-spacing:0;">01</span>
        </div>
        <!-- title -->
        <div style="${heading3d("#fff",CYAN,78)}">The Tool</div>
        <!-- line -->
        <div style="width:${200 * SCALE}px;height:${1.5 * SCALE}px;background:linear-gradient(90deg,transparent,${CYAN},transparent);border-radius:${2}px;"></div>
      </div>`,
  },

  {
    name: "03-github-skills",
    label: "GitHub Skills (3–7.5 s)",
    html: () => {
      const skills = [
        { icon: "🎬", name: "/remotion",           desc: "Render videos with React" },
        { icon: "🔧", name: "/session-start-hook", desc: "Auto-install deps on startup" },
        { icon: "📜", name: "/policy-writer",      desc: "Generate legal docs in minutes" },
        { icon: "🤖", name: "/claude-api",         desc: "Build Claude-powered apps" },
      ];
      return `
      <div style="position:relative;width:${VW}px;height:${VH}px;background:${BG};overflow:hidden;font-family:sans-serif;">
        <div style="${grid()}"></div>
        <!-- radial glow -->
        <div style="position:absolute;top:30%;left:50%;transform:translate(-50%,-50%);
                    width:${450 * SCALE}px;height:${450 * SCALE}px;border-radius:50%;
                    background:radial-gradient(circle,${CYAN}12,transparent 65%);"></div>

        <div style="position:absolute;left:${30 * SCALE}px;right:${30 * SCALE}px;top:${H * 0.13 * SCALE}px;display:flex;flex-direction:column;gap:${20 * SCALE}px;">
          <!-- header -->
          <div style="color:${CYAN};font-size:${15 * SCALE}px;font-weight:700;font-family:monospace;letter-spacing:${2 * SCALE}px;text-transform:uppercase;text-shadow:0 0 ${8 * SCALE}px ${CYAN}80;">
            ★ Free on GitHub
          </div>
          <div style="${heading3d("#fff",CYAN,96)}">Claude Code</div>
          <div style="${heading3d(CYAN,CYAN,96)}margin-top:${-8 * SCALE}px;">Skills</div>
          <div style="color:rgba(255,255,255,.45);font-size:${15 * SCALE}px;margin-top:${-6 * SCALE}px;">
            Prebuilt AI superpowers — zero cost
          </div>
          <!-- cards -->
          ${skills.map(s => `
            <div style="${glassCard(CYAN)}padding:${13 * SCALE}px ${18 * SCALE}px;">
              <div style="position:absolute;top:0;left:0;right:0;height:45%;background:linear-gradient(180deg,rgba(255,255,255,.09),transparent);border-radius:${16 * SCALE}px ${16 * SCALE}px 0 0;"></div>
              <div style="display:flex;align-items:center;gap:${12 * SCALE}px;">
                <span style="font-size:${24 * SCALE}px;flex-shrink:0;">${s.icon}</span>
                <div>
                  <div style="color:${CYAN};font-size:${16 * SCALE}px;font-weight:700;font-family:monospace;text-shadow:0 0 ${6 * SCALE}px ${CYAN}60;">${s.name}</div>
                  <div style="color:rgba(255,255,255,.55);font-size:${13 * SCALE}px;">${s.desc}</div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>`;
    },
  },

  {
    name: "04-phone-proof",
    label: "Phone Proof (8–12 s)",
    html: () => `
      <div style="position:relative;width:${VW}px;height:${VH}px;background:${BG};overflow:hidden;font-family:sans-serif;">
        <div style="${grid()}"></div>
        <div style="position:absolute;left:${30 * SCALE}px;right:${30 * SCALE}px;top:${H * 0.13 * SCALE}px;display:flex;flex-direction:column;align-items:center;gap:${18 * SCALE}px;">

          <!-- label -->
          <div style="${glassCard(GOLD)}padding:${10 * SCALE}px ${18 * SCALE}px;width:100%;box-sizing:border-box;text-align:center;">
            <div style="position:absolute;top:0;left:0;right:0;height:45%;background:linear-gradient(180deg,rgba(255,255,255,.09),transparent);border-radius:${16 * SCALE}px ${16 * SCALE}px 0 0;"></div>
            <span style="color:${GOLD};font-size:${17 * SCALE}px;font-weight:700;text-shadow:0 0 ${10 * SCALE}px ${GOLD}70;">📄 The actual output — 19 pages</span>
          </div>

          <!-- phone -->
          <div style="width:${210 * SCALE}px;height:${350 * SCALE}px;
                      background:linear-gradient(160deg,#1c1f2e,#101220);
                      border-radius:${26 * SCALE}px;
                      border:${4 * SCALE}px solid rgba(255,255,255,.14);
                      box-shadow:0 ${24 * SCALE}px ${48 * SCALE}px rgba(0,0,0,.85),
                                 inset 0 ${0.5 * SCALE}px 0 rgba(255,255,255,.18),
                                 0 0 ${40 * SCALE}px ${CYAN}22;
                      overflow:hidden;position:relative;flex-shrink:0;">
            <!-- notch -->
            <div style="position:absolute;top:${7 * SCALE}px;left:50%;transform:translateX(-50%);
                        width:${55 * SCALE}px;height:${13 * SCALE}px;background:#000;border-radius:${10 * SCALE}px;z-index:10;"></div>
            <!-- screen -->
            <div style="position:absolute;inset:0;background:#fff;border-radius:${22 * SCALE}px;overflow:hidden;">
              <!-- status bar -->
              <div style="height:${22 * SCALE}px;background:#f7f7f7;border-bottom:1px solid #ddd;
                          display:flex;align-items:flex-end;padding:0 ${8 * SCALE}px ${3 * SCALE}px;gap:${4 * SCALE}px;">
                <span style="font-size:${5.5 * SCALE}px;color:#444;font-weight:600;">📑 1 of 19</span>
                <span style="margin-left:auto;background:#fff0e8;color:#c44a00;font-size:${4.5 * SCALE}px;
                             padding:${1 * SCALE}px ${4 * SCALE}px;border-radius:${10 * SCALE}px;
                             border:1px solid #c44a00;text-transform:uppercase;letter-spacing:.5px;">Confidential</span>
              </div>
              <!-- content -->
              <div style="padding:${8 * SCALE}px ${9 * SCALE}px;">
                <div style="font-size:${9.5 * SCALE}px;font-weight:700;font-family:Georgia,serif;color:#111;line-height:1.2;margin-bottom:${5 * SCALE}px;">
                  Church Purchasing Policy & Procurement Procedures
                </div>
                <div style="font-size:${5.5 * SCALE}px;color:#666;line-height:1.6;margin-bottom:${8 * SCALE}px;">
                  Protecting Church funds, preventing fraud, ensuring legal compliance...
                </div>
                ${[
                  ["01","Purpose & Scope"],
                  ["02","Roles & Thresholds"],
                  ["03","Procedures & Vendors"],
                  ["04","Payments & Records"],
                  ["05","Contracts & Compliance"],
                ].map(([n,t]) => `
                  <div style="display:flex;gap:${5 * SCALE}px;margin-bottom:${6 * SCALE}px;padding-bottom:${6 * SCALE}px;border-bottom:1px solid #eee;">
                    <span style="color:#c44a00;font-size:${5 * SCALE}px;font-family:monospace;font-weight:700;min-width:${10 * SCALE}px;">${n}</span>
                    <span style="font-size:${6.5 * SCALE}px;font-weight:600;font-family:Georgia,serif;color:#111;">${t}</span>
                  </div>
                `).join("")}
                <!-- threshold box -->
                <div style="background:#fff8f2;border:1px solid #f0c8a0;border-radius:${4 * SCALE}px;padding:${6 * SCALE}px;">
                  <div style="font-size:${5.5 * SCALE}px;font-weight:700;color:#c44a00;margin-bottom:${4 * SCALE}px;">Section 4 — Purchase Approval Thresholds</div>
                  ${[["Up to $250","Ministry Leader"],["$251–$999","Treasurer"],["$1,000–$2,999","Senior Pastor"],["$3,000+","Board"]].map(([a,w])=>`
                    <div style="display:flex;justify-content:space-between;font-size:${5 * SCALE}px;color:#444;padding-bottom:${2 * SCALE}px;margin-bottom:${2 * SCALE}px;border-bottom:1px solid #f0d8c0;">
                      <span style="font-weight:600;">${a}</span><span>${w}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>

          <!-- stats -->
          <div style="${glassCard(GOLD)}padding:${14 * SCALE}px ${20 * SCALE}px;width:100%;box-sizing:border-box;">
            <div style="position:absolute;top:0;left:0;right:0;height:45%;background:linear-gradient(180deg,rgba(255,255,255,.09),transparent);border-radius:${16 * SCALE}px ${16 * SCALE}px 0 0;"></div>
            <div style="display:flex;justify-content:space-around;align-items:center;">
              ${[["19","Pages"],["$0","Cost"],["4m","Time"]].map(([v,l])=>`
                <div style="text-align:center;">
                  <div style="font-size:${28 * SCALE}px;font-weight:900;font-family:'Arial Black',sans-serif;color:${GOLD};text-shadow:0 0 ${12 * SCALE}px ${GOLD}70;line-height:1;">${v}</div>
                  <div style="color:rgba(255,255,255,.55);font-size:${13 * SCALE}px;margin-top:${2 * SCALE}px;">${l}</div>
                </div>
              `).join("")}
            </div>
          </div>

        </div>
      </div>`,
  },

  {
    name: "05-cta",
    label: "CTA (13–15 s)",
    html: () => `
      <div style="position:relative;width:${VW}px;height:${VH}px;background:${BG};overflow:hidden;font-family:sans-serif;">
        <div style="${grid()}"></div>
        <!-- glow -->
        <div style="position:absolute;top:38%;left:50%;transform:translate(-50%,-50%);
                    width:${450 * SCALE}px;height:${450 * SCALE}px;border-radius:50%;
                    background:radial-gradient(circle,${CYAN}18,transparent 68%);"></div>
        <div style="position:absolute;left:${30 * SCALE}px;right:${30 * SCALE}px;top:${H * 0.13 * SCALE}px;bottom:${H * 0.13 * SCALE}px;
                    display:flex;flex-direction:column;justify-content:center;align-items:center;gap:${26 * SCALE}px;">
          <div style="color:rgba(255,255,255,.4);font-size:${15 * SCALE}px;letter-spacing:${2 * SCALE}px;text-transform:uppercase;text-align:center;">
            You can do this too
          </div>
          <div style="text-align:center;">
            <div style="${heading3d("#fff",CYAN,104)}">Get the Free</div>
            <div style="${heading3d(CYAN,CYAN,104)}">Claude Skills</div>
          </div>
          <!-- button -->
          <div style="${glassCard(CYAN)}
                       padding:${18 * SCALE}px ${26 * SCALE}px;text-align:center;width:100%;box-sizing:border-box;
                       background:linear-gradient(135deg,${CYAN}28,${CYAN}08);
                       border-color:${CYAN}55;">
            <div style="position:absolute;top:0;left:0;right:0;height:45%;background:linear-gradient(180deg,rgba(255,255,255,.09),transparent);border-radius:${16 * SCALE}px ${16 * SCALE}px 0 0;"></div>
            <div style="color:${CYAN};font-size:${21 * SCALE}px;font-weight:700;text-shadow:0 0 ${12 * SCALE}px ${CYAN}90;margin-bottom:${5 * SCALE}px;">
              🔗 Link in bio
            </div>
            <div style="color:rgba(255,255,255,.45);font-size:${13 * SCALE}px;font-family:monospace;letter-spacing:.5px;">
              github.com/anthropics/claude-code
            </div>
          </div>
          <!-- trust pills -->
          <div style="display:flex;gap:${9 * SCALE}px;flex-wrap:wrap;justify-content:center;">
            ${["✨ Free forever","⚡ Open source","🚀 No sign-up"].map(t=>`
              <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);
                          border-radius:${20 * SCALE}px;padding:${5 * SCALE}px ${13 * SCALE}px;
                          color:rgba(255,255,255,.6);font-size:${14 * SCALE}px;">${t}</div>
            `).join("")}
          </div>
        </div>
      </div>`,
  },
];

// ── render ────────────────────────────────────────────────────────────────────
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
});

for (const scene of scenes) {
  const page = await browser.newPage();
  await page.setViewport({ width: VW, height: VH, deviceScaleFactor: 2 });
  await page.setContent(
    `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000;">${scene.html()}</body></html>`,
    { waitUntil: "networkidle0" }
  );
  const outPath = path.join(OUT_DIR, `${scene.name}.png`);
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: VW, height: VH } });
  await page.close();
  console.log(`✓  ${scene.label}  →  out/${scene.name}.png`);
}

await browser.close();
console.log("\nAll previews rendered.");
