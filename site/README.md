# Margin Material: website

This is a static site with no build step, so Cloudflare Pages can host it for free.

```
site/
├── index.html        Home: hero, discovery tiles, process, drop list
├── shop.html         Shop: filterable grid, Depop banner, custom order form
├── about.html        Bio page for Lady Britt
├── 404.html
├── robots.txt / sitemap.xml
└── assets/
    ├── styles.css
    ├── main.js       ← your email + social links (SITE block at the top)
    └── products.js   ← your pieces (the only file you touch for new drops)
```

## Updating the shop

1. Put photos in `site/assets/` (for example `site/assets/sunday-midi.jpg`, ideally 1200×1500 px).
2. In `assets/products.js`, copy one item block and fill in the name, price and photo.
3. For each piece, set **one or both** of these:
   - `buyUrl`: the Shopify product link. People can check out on your site's "Buy now" button.
   - `depopUrl`: the listing link on Depop. If you leave it blank, the button opens your Depop shop.
4. Set `status: "sold"` when a piece sells. It stays on the page as social proof.

Before going live:
- Replace `hello@marginmaterial.com` in `assets/main.js` with your real email, and add your Substack, Instagram, TikTok, Pinterest and Threads links.
- If your domain is not `marginmaterial.com`, find and replace it in the four `.html` files, `robots.txt` and `sitemap.xml`.
- Add a 1200×630 share image at `assets/og.jpg`. Link previews in iMessage and Instagram DMs use it.

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
