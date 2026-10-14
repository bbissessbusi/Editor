"""Builds the Margin Journal concept pages. Run: python3 build.py (writes next to this file)."""
import os

OUT = os.path.dirname(os.path.abspath(__file__))
FONTS = "https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"

NAV = [
    ("index.html", "Contents", ""),
    ("styling.html", "Styled", "I"),
    ("vintage.html", "Found", "II"),
    ("custom.html", "Made", "III"),
    ("about.html", "About", ""),
]


def page(file, title, desc, chapter, body):
    links = []
    for href, label, num in NAV:
        cur = ' aria-current="page"' if href == file else ""
        n = f'<span class="num">{num}</span>' if num else ""
        cls = ' class="hide-md"' if href == "about.html" else ""
        links.append(f'<li{cls}><a href="{href}"{cur}>{n}{label}</a></li>')
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#fde9dc">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="assets/journal.css">
</head>
<body class="{chapter}">
<header class="mast">
  <div class="wrap">
    <a class="brand" href="index.html"><img src="assets/logo-sm.webp" alt="" width="40" height="40"><b>Margin Material</b></a>
    <nav aria-label="Chapters"><ul>{''.join(links)}</ul></nav>
  </div>
</header>
<main>
{body}
</main>
<footer>
  <div class="wrap">
    <span class="hand">Margin Material · est. 2026</span>
    <ul>
      <li><a href="styling.html">Personal Styling</a></li>
      <li><a href="vintage.html">Vintage</a></li>
      <li><a href="custom.html">Custom Dresses</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="https://depop.app.link/KBBployVb7b" target="_blank" rel="noopener">Depop</a></li>
    </ul>
    <span>© <span data-year>2026</span> Margin Material by Lady Britt</span>
  </div>
</footer>
<script src="assets/journal.js"></script>
</body>
</html>
"""


SUBSCRIBE = """
<section class="band">
  <div class="wrap spread">
    <div class="main stack">
      <p class="kicker">The Journal</p>
      <h2 class="h2">Get the next entry in your inbox.</h2>
      <p class="lede muted">New finds, styling notes and the stories behind each dress. Only when it's worth reading.</p>
      <form class="subscribe" data-form="subscribe">
        <label class="sr" for="sub-email">Email</label>
        <input id="sub-email" type="email" placeholder="you@email.com" required>
        <button class="btn ink" type="submit">Subscribe</button>
      </form>
    </div>
    <aside class="margin">
      <p class="note lav">Stay close, Family.</p>
    </aside>
  </div>
</section>"""

HOME = """
<section class="hero">
  <div class="wrap spread">
    <div class="main stack">
      <p class="kicker">The Margin Journal · <b>Vol. 1</b></p>
      <h1 class="h1">Style lives in <em>the</em> <mark>margins.</mark></h1>
      <p class="lede">Margin Material is Lady Britt's studio for three crafts. Styling the closet you already own. Finding the vintage you've been missing. Making the dress that only exists because you asked.</p>
      <div class="btns">
        <a class="btn solid" href="vintage.html">Shop the rack</a>
        <a class="btn" href="#contents">Read the contents</a>
      </div>
    </div>
    <aside class="margin">
      <img class="patch" src="assets/logo.webp" alt="Margin Material patch: an open book, a needle and thread, scissors and a tee" width="150" height="150">
      <p class="note rust write" style="--d:.5s"><span class="arrow">↖</span> stitched by hand,<br>like everything here</p>
      <p class="note sage write" style="--d:.9s">read in any order</p>
    </aside>
  </div>
</section>

<section id="contents" style="padding-top:0">
  <div class="wrap stack" style="gap:28px">
    <p class="kicker">Contents</p>
    <ol class="toc">
      <li class="ch-styled"><a href="styling.html">
        <span class="numeral">I</span>
        <span class="title">Styled<small>Personal Styling</small></span>
        <span class="blurb">Outfits built around your real life, from the closet you already own.</span>
      </a></li>
      <li class="ch-found"><a href="vintage.html">
        <span class="numeral">II</span>
        <span class="title">Found<small>Vintage Reselling</small></span>
        <span class="blurb">One-of-one pieces, inspected seam by seam and restored before they reach you.</span>
      </a></li>
      <li class="ch-made"><a href="custom.html">
        <span class="numeral">III</span>
        <span class="title">Made<small>Custom Dressmaking</small></span>
        <span class="blurb">A dress drawn, cut and sewn for one person. You.</span>
      </a></li>
    </ol>
  </div>
</section>

<section class="band ch-found">
  <div class="wrap stack" style="gap:40px">
    <div class="spread">
      <div class="main stack">
        <p class="kicker">Chapter II · <b>Fresh in the margins</b></p>
        <h2 class="h2">This week's finds.</h2>
      </div>
      <aside class="margin"><p class="note rust">one of each,<br>then gone</p></aside>
    </div>
    <div class="pieces" data-pieces="3"></div>
    <a class="more" href="vintage.html" style="align-self:flex-start">See the whole rack</a>
  </div>
</section>

<section>
  <div class="wrap spread">
    <div class="main">
      <div class="letter">
        <p class="kicker">A note from Britt</p>
        <p>Hey ya. So, let me say this. The pieces I love most were sitting where nobody looked. The back rack. The bottom of the bin. The margins.</p>
        <p>That's where this whole thing lives. I find what others walked past, I style it for the life you actually live, and when the perfect piece doesn't exist, I make it.</p>
        <p class="sig">— Britt</p>
      </div>
    </div>
    <aside class="margin">
      <p class="note lav">P.S. custom spots<br>are limited each month</p>
      <a class="more" href="about.html">Read her story</a>
    </aside>
  </div>
</section>
""" + SUBSCRIBE

STYLING = """
<section class="opener">
  <span class="big-num" aria-hidden="true">I</span>
  <div class="wrap">
    <p class="kicker">Chapter I · Personal Styling</p>
    <h1 class="h1">Styled. <em>On purpose.</em></h1>
    <p class="lede">Your closet already holds more outfits than you've worn. I help you find them, fill the gaps with intention and walk out the door certain.</p>
    <div class="btns"><a class="btn solid" href="#book">Book a free consult</a><a class="btn" href="#sessions">See the sessions</a></div>
  </div>
</section>

<section id="sessions">
  <div class="wrap stack" style="gap:34px">
    <div class="spread">
      <div class="main stack">
        <p class="kicker">Sessions</p>
        <h2 class="h2">Pick your starting page.</h2>
      </div>
      <aside class="margin"><p class="note">virtual or<br>in person</p></aside>
    </div>
    <div class="entries">
      <div class="entry">
        <div><h3 class="h3">The Closet Edit</h3><p class="muted">We go through what you own together and find the outfits already hiding in there.</p>
          <ul><li>Keep, tailor or donate decisions</li><li>Outfit formulas you can repeat</li><li>A short list of pieces worth adding</li></ul></div>
        <p class="note">start here if your<br>closet feels full but<br>you have nothing to wear</p>
      </div>
      <div class="entry">
        <div><h3 class="h3">The Shopping Session</h3><p class="muted">I pull pieces for your brief, vintage included. You try on, I style, you keep what you love.</p>
          <ul><li>Style brief and size profile</li><li>Private pull from the vintage rack</li><li>Try-on with styling notes</li></ul></div>
        <p class="note">first look at<br>vintage before<br>it hits the shop</p>
      </div>
      <div class="entry">
        <div><h3 class="h3">Event Styling</h3><p class="muted">Weddings, galas, Sunday service or a photoshoot. Walk in finished.</p>
          <ul><li>A look planned around the occasion</li><li>Vintage, custom or both</li><li>Accessories and final fitting</li></ul></div>
        <p class="note">pairs well with<br>Chapter III <a href="custom.html" class="arrow" style="text-decoration:none">→</a></p>
      </div>
    </div>
    <p class="muted">Pricing is shared at your free consult, based on the session you choose.</p>
  </div>
</section>

<section class="band">
  <div class="wrap stack" style="gap:36px">
    <p class="kicker">How a session runs</p>
    <ol class="steps">
      <li><b>Consult</b><span>We talk about your life, your goals and your budget.</span></li>
      <li><b>Mood board</b><span>You approve the direction before anything gets bought.</span></li>
      <li><b>The pull</b><span>I gather pieces from your closet and my racks.</span></li>
      <li><b>Styling day</b><span>We put it together and you leave with photos of every look.</span></li>
    </ol>
  </div>
</section>

<section id="book">
  <div class="wrap spread">
    <div class="main stack">
      <p class="kicker">Book</p>
      <h2 class="h2">Start with a free consult.</h2>
      <form class="req" data-form="book">
        <div class="two">
          <label for="s-name">Name<input id="s-name" name="name" required autocomplete="name"></label>
          <label for="s-email">Email<input id="s-email" name="email" type="email" required autocomplete="email"></label>
        </div>
        <div class="two">
          <label for="s-service">Session<select id="s-service" name="service"><option>The Closet Edit</option><option>The Shopping Session</option><option>Event Styling</option><option>Not sure yet</option></select></label>
          <label for="s-format">Format<select id="s-format" name="format"><option>Virtual</option><option>In person</option></select></label>
        </div>
        <label for="s-what">What are you dressing for?<textarea id="s-what" name="what" rows="4" placeholder="A new job, a wedding, a fresh start…"></textarea></label>
        <button class="btn solid" type="submit">Request a consult</button>
      </form>
    </div>
    <aside class="margin">
      <p class="note">bring the one piece<br>you'd never give up</p>
    </aside>
  </div>
</section>
"""

VINTAGE = """
<section class="opener">
  <span class="big-num" aria-hidden="true">II</span>
  <div class="wrap">
    <p class="kicker">Chapter II · Vintage Reselling</p>
    <h1 class="h1">Found. <em>Then gone.</em></h1>
    <p class="lede">Hand-picked from the back rack and the bottom of the bin, restored and released one piece at a time. When it sells, it's gone for good.</p>
    <div class="btns"><a class="btn solid" href="#rack">Shop the rack</a><a class="btn" href="https://depop.app.link/KBBployVb7b" target="_blank" rel="noopener">Open Depop shop</a></div>
  </div>
</section>

<section id="rack">
  <div class="wrap stack" style="gap:8px">
    <div class="spread">
      <div class="main stack">
        <p class="kicker">The rack</p>
        <h2 class="h2">Every piece is the only one.</h2>
        <div class="filters" role="group" aria-label="Filter the rack">
          <button class="chip" data-filter="all" aria-pressed="true">All</button>
          <button class="chip" data-filter="dresses" aria-pressed="false">Dresses</button>
          <button class="chip" data-filter="tops" aria-pressed="false">Tops</button>
          <button class="chip" data-filter="outerwear" aria-pressed="false">Outerwear</button>
          <button class="chip" data-filter="accessories" aria-pressed="false">Accessories</button>
        </div>
      </div>
      <aside class="margin">
        <p class="note"><small>How I grade a piece</small>Seams. Fabric weight. Hardware.</p>
      </aside>
    </div>
    <div class="pieces" data-pieces></div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="depop">
      <div class="stack" style="gap:10px">
        <p class="kicker" style="color:#f5b48d">Also on Depop</p>
        <h2 class="h2">More finds between entries.</h2>
        <p class="muted">Quick-sell pieces and bundles live on Depop. Follow the shop so new listings land in your feed.</p>
      </div>
      <a class="btn depop" href="https://depop.app.link/KBBployVb7b" target="_blank" rel="noopener">Shop on Depop</a>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap stack" style="gap:36px">
    <p class="kicker">From the bin to your closet</p>
    <ol class="steps">
      <li><b>The hunt</b><span>Estate sales and the rack everybody walks past.</span></li>
      <li><b>The inspection</b><span>Seams. Fabric weight. Hardware. That's how you know.</span></li>
      <li><b>The restore</b><span>Cleaned and mended until it looks like it was waiting for you.</span></li>
      <li><b>The listing</b><span>Photographed, measured and posted here and on Depop.</span></li>
    </ol>
  </div>
</section>
"""

CUSTOM = """
<section class="opener">
  <span class="big-num" aria-hidden="true">III</span>
  <div class="wrap">
    <p class="kicker">Chapter III · Custom Dressmaking</p>
    <h1 class="h1">Made. <em>For one.</em></h1>
    <p class="lede">Tell me the occasion and the feeling. I'll sketch it, source the fabric and build it to your measurements.</p>
    <div class="btns"><a class="btn solid" href="#commission">Start a commission</a><a class="btn" href="#process">See the process</a></div>
  </div>
</section>

<section id="process">
  <div class="wrap stack" style="gap:36px">
    <div class="spread">
      <div class="main stack">
        <p class="kicker">The process</p>
        <h2 class="h2">From first sketch to final fitting.</h2>
      </div>
      <aside class="margin"><p class="note">custom takes time.<br>it's worth the wait.</p></aside>
    </div>
    <ol class="steps five">
      <li><b>Consult</b><span>We talk vision, occasion and timeline.</span></li>
      <li><b>Sketch</b><span>You approve the design before a cut is made.</span></li>
      <li><b>Fabric</b><span>I source the right material for the dress.</span></li>
      <li><b>Fitting</b><span>We adjust it on your body until it's right.</span></li>
      <li><b>Delivery</b><span>Pressed, packed and ready for the day.</span></li>
    </ol>
  </div>
</section>

<section class="band">
  <div class="wrap spread">
    <div class="main stack">
      <p class="kicker">Made for</p>
      <h2 class="h2">The days you'll remember.</h2>
      <div class="tags">
        <span class="tag">Wedding guest</span><span class="tag">Bridal party</span><span class="tag">Gala</span>
        <span class="tag">Church</span><span class="tag">Birthday</span><span class="tag">Photoshoot</span><span class="tag">Everyday statement</span>
      </div>
    </div>
    <aside class="margin"><p class="note">vintage fabric<br>upcycles welcome</p></aside>
  </div>
</section>

<section id="commission">
  <div class="wrap spread">
    <div class="main stack">
      <p class="kicker">Commission</p>
      <h2 class="h2">Describe the dress.</h2>
      <form class="req" data-form="custom">
        <div class="two">
          <label for="c-name">Name<input id="c-name" name="name" required autocomplete="name"></label>
          <label for="c-email">Email<input id="c-email" name="email" type="email" required autocomplete="email"></label>
        </div>
        <div class="two">
          <label for="c-occ">Occasion<select id="c-occ" name="occasion"><option>Wedding guest</option><option>Gala or formal</option><option>Church</option><option>Birthday</option><option>Something else</option></select></label>
          <label for="c-date">Date needed<input id="c-date" name="date" type="date"></label>
        </div>
        <label for="c-vision">Your vision<textarea id="c-vision" name="vision" rows="5" placeholder="The color, the silhouette, how you want to feel walking in…"></textarea></label>
        <button class="btn solid" type="submit">Request a consult</button>
      </form>
    </div>
    <aside class="margin">
      <p class="note">a photo you love<br>says a lot. bring it.</p>
    </aside>
  </div>
</section>
"""

ABOUT = """
<section class="hero">
  <div class="wrap spread">
    <div class="main stack">
      <p class="kicker">About the author</p>
      <h1 class="h1">Hey ya. <em>I'm Lady Britt.</em></h1>
      <p class="lede dropcap">I almost walked past the first piece. Almost. That near miss taught me everything about this work: the best things wait quietly for someone who knows how to look.</p>
    </div>
    <aside class="margin">
      <img class="patch" src="assets/logo.webp" alt="Margin Material patch" width="150" height="150">
      <p class="note rust">replace with<br>your portrait</p>
    </aside>
  </div>
</section>

<section class="band">
  <div class="wrap spread">
    <div class="main prose">
      <p class="kicker">Why I do this</p>
      <p>So, let me say this first. I love clothes that carry a story. A coat that survived three owners. A dress somebody saved for Sunday. Fast fashion can't give you that.</p>
      <p>Margin Material started with thrifting. I learned to read a garment the way you read a letter. The more I found, the more I wanted to style, and the more I styled, the more I wanted to make.</p>
      <p>That's how one passion became three chapters. I style. I find. I make. And I document all of it so you can watch a piece travel from the bin or the sketchbook to your closet.</p>
    </div>
    <aside class="margin">
      <p class="note sage"><small>Chapter I</small><a href="styling.html" style="text-decoration:none">Styled →</a></p>
      <p class="note rust"><small>Chapter II</small><a href="vintage.html" style="text-decoration:none">Found →</a></p>
      <p class="note lav"><small>Chapter III</small><a href="custom.html" style="text-decoration:none">Made →</a></p>
    </aside>
  </div>
</section>

<section>
  <div class="wrap spread">
    <blockquote class="main quote">“Whatever you do, work at it with all your heart.”<cite>Colossians 3:23</cite></blockquote>
    <aside class="margin"><p class="note">the standard<br>behind every seam</p></aside>
  </div>
</section>

<section class="band">
  <div class="wrap stack" style="gap:30px">
    <p class="kicker">Read the patch</p>
    <div class="entries">
      <div class="entry"><div><h3 class="h3">The open book</h3><p class="muted">The sharpest notes live in the margins. So do the best pieces.</p></div><p class="note sage">the journal</p></div>
      <div class="entry"><div><h3 class="h3">The needle and thread</h3><p class="muted">Every custom dress starts with one stitch.</p></div><p class="note lav">chapter III</p></div>
      <div class="entry"><div><h3 class="h3">The scissors and the tee</h3><p class="muted">Vintage, restored and remade for right now.</p></div><p class="note rust">chapter II</p></div>
    </div>
  </div>
</section>
"""

PAGES = [
    ("index.html", "Margin Material Journal", "Lady Britt's studio for personal styling, vintage reselling and custom dressmaking.", "ch-found", HOME),
    ("styling.html", "Personal Styling · Margin Material", "Closet edits, shopping sessions and event styling by Lady Britt.", "ch-styled", STYLING),
    ("vintage.html", "Vintage · Margin Material", "One-of-one vintage pieces, hand-picked and restored. Shop here or on Depop.", "ch-found", VINTAGE),
    ("custom.html", "Custom Dresses · Margin Material", "Custom dresses designed and sewn to your measurements by Lady Britt.", "ch-made", CUSTOM),
    ("about.html", "About Lady Britt · Margin Material", "Meet Lady Britt, the stylist, vintage hunter and dressmaker behind Margin Material.", "ch-found", ABOUT + SUBSCRIBE),
]

for file, title, desc, ch, body in PAGES:
    with open(os.path.join(OUT, file), "w") as f:
        f.write(page(file, title, desc, ch, body))
print("built", len(PAGES), "pages")
