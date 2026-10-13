# Margin Material: The Drop Room

This is a static site with no build step, so Cloudflare Pages can host it for free.

```
site/
├── index.html      The Drop Room: countdown, blurred preview, three pillars, drop list
├── styling.html    Pillar 01: Personal Styling (services + booking form)
├── vintage.html    Pillar 02: Vintage Reselling (shop, drop lock, Depop)
├── custom.html     Pillar 03: Custom Dressmaking (options + request form)
├── about.html      Bio for Lady Britt
├── 404.html, robots.txt, sitemap.xml, _redirects
└── assets/
    ├── config.js     ← drop date, drop name, email, social links
    ├── products.js   ← your vintage pieces
    ├── logo.webp     ← your patch logo (plus favicon and app icon)
    ├── styles.css
    └── main.js
```

Brand colors are set at the top of `assets/styles.css`: forest and sage green for Styling, rust and peach for Vintage, and plum and lavender for Custom and the Drop Room.

## Running a drop

1. In `assets/config.js`, set `dropDate`, `dropName` and `dropTagline`. The countdown on the home page and the Vintage page follows that date.
2. In `assets/products.js`, add the pieces with `status: "drop"`. Until the countdown hits zero they appear blurred, with the name and price hidden. At zero they unlock automatically with a "New" badge, and the home page switches to "The drop is live."
3. Put photos in `site/assets/` (ideally 1200×1500 px) and set each piece's `image`.
4. Give each piece a `buyUrl` (Shopify product link), a `depopUrl` (Depop listing), or both.
5. When a piece sells, change it to `status: "sold"`. It stays up as proof.
6. After the drop, change the remaining pieces to `"available"` and set the next `dropDate`.

## Before going live

- In `assets/config.js`, add your real email and your Substack, Instagram, TikTok, Pinterest and Threads links. Add a Calendly or Acuity link as `bookingUrl` if you want styling clients to book directly.
- If your domain is not `marginmaterial.com`, find and replace it in the `.html` files, `robots.txt` and `sitemap.xml`.
- Add a 1200×630 share image at `assets/og.jpg`. It's what shows when someone shares your link in a text or DM.
- Replace the bio placeholder portrait in `about.html` with your photo.

## Connecting your domain with Cloudflare

### Step 1: Put the domain on Cloudflare
*Skip this step if you bought the domain through Cloudflare Registrar.*

1. Sign in at **dash.cloudflare.com**, then choose **Add a domain** (it may say **Add a site**).
2. Enter your domain without `www` (for example `marginmaterial.com`), then pick the **Free** plan.
3. Cloudflare copies your existing DNS records. Keep any **MX** records so your email keeps working.
4. Cloudflare shows you **two nameservers** (for example `ada.ns.cloudflare.com`).
5. Go to wherever you bought the domain (GoDaddy, Namecheap, Squarespace or another registrar):
   - Turn **DNSSEC off** first. You can turn it back on later from Cloudflare.
   - Replace the nameservers with the two Cloudflare ones, then save.
6. Back in Cloudflare, click **Check nameservers**. The domain changes to **Active**, which usually takes minutes but can take up to 24 hours. Cloudflare emails you when it's done.

### Step 2: Deploy the site to Cloudflare Pages
**Option A: connect GitHub (recommended, because every push updates the site automatically)**
1. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorize GitHub and pick the `bbissessbusi/Editor` repository.
3. Use these build settings:
   - Production branch: `main` (or whichever branch holds this site)
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `site`
4. Click **Save and Deploy**. You get a preview address such as `margin-material.pages.dev`.

**Option B: drag and drop**
1. Go to **Workers & Pages → Create → Pages → Upload assets**.
2. Name the project `margin-material`, then drag in the **`site` folder**.
3. To update the site later, upload the folder again.

### Step 3: Attach your domain
1. Open the Pages project, then go to **Custom domains → Set up a custom domain**.
2. Enter `marginmaterial.com`, then click **Activate domain**. Because the domain is on Cloudflare, it creates the DNS record for you.
3. Repeat the steps for `www.marginmaterial.com`.
4. If Cloudflare warns about an existing **A** or **CNAME** record for `@` or `www` (from an old host), delete that record under **DNS → Records** and try again.
5. HTTPS turns on automatically. The padlock shows up within a few minutes.

### Step 4: Lock it in
- **SSL/TLS → Overview**: set the mode to **Full (strict)**. Then go to **Edge Certificates** and turn on **Always Use HTTPS**.
- **Rules → Redirect Rules**: send `www.marginmaterial.com/*` to `https://marginmaterial.com/${1}` with a 301 so you have one main address. This is optional and helps SEO.
- **Email → Email Routing**: forward `hello@marginmaterial.com` to your personal inbox for free.
- **Google Search Console**: add the domain, then submit `https://marginmaterial.com/sitemap.xml` so Google starts indexing the shop.
