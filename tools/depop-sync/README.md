# Depop → Margin Material inventory feed

These tools read your Depop shop (`depop.com/margin_material_vintage`) and save every listing as an inventory feed, `depop-feed.json`. The Found pages load that feed and show each piece with its photo, title, price and size. Every **Buy on Depop** button opens that piece's own Depop listing, so checkout stays on Depop.

**Why it runs on your computer:** Depop blocks cloud servers, and Depop has no public API for shops. Your own browser on a home or phone connection is allowed in, so the tools run there.

## Option 1: The bookmark (no install)

1. Open `install.html` (in this folder) in Chrome, Safari or Edge on your computer.
2. Drag the **Pull Depop inventory** button to your bookmarks bar.
3. Go to `depop.com/margin_material_vintage` and click the bookmark.
4. It scrolls through your shop and saves **depop-feed.json** to your Downloads.
5. Send that file to Claude, or put it in `concepts/journal/assets/`. The shop updates from it.

Re-run it whenever you list or sell something.

## Option 2: Automatic sync (needs Node.js)

Install [Node.js](https://nodejs.org) once. Then, from this folder:

```bash
npm install          # first time only: installs the browser it drives
npm run sync         # opens your shop, reads every listing, writes the feed
npm run sync:push    # same, then commits and pushes so the live site redeploys
```

To run it every morning on a Mac, open Terminal and type `crontab -e`, then add this line with your real path to the repo:

```
0 8 * * * cd /path/to/Editor/tools/depop-sync && /usr/local/bin/npm run sync:push -- --headless >> sync.log 2>&1
```

## What the feed holds

```json
{ "shop": "margin_material_vintage", "fetchedAt": "…", "count": 4,
  "items": [{ "id": "…", "title": "Vintage 70s rust maxi dress", "price": 58, "currency": "USD",
              "size": "M", "brand": "", "category": "dresses",
              "image": "https://media-photos.depop.com/…", "url": "https://www.depop.com/products/…", "sold": false }] }
```

- `category` is guessed from the title (dresses, tops, outerwear, bottoms, accessories or other). Edit the file if a guess is wrong.
- Sold pieces stay on the page with a Sold stamp and no buy button.
- Without a feed file, the site shows the sample pieces in `assets/journal.js`.

## If it stops working

Depop can change its pages at any time. If the bookmark saves 0 listings, or titles come out blank, send Claude the file (or a screenshot of the shop) and the extractor in `extract.js` can be updated.
