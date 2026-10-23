"""Builds the Margin Journal pages. Run: python3 build.py (writes next to this file).
Chapter order: I Found (vintage via Depop) → II Styled (Styled By) → III Made (custom). Contents sits last on the home page."""
import os

OUT = os.path.dirname(os.path.abspath(__file__))
FONTS = "https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"

NAV = [
    ("found.html", "Found", "I"),
    ("styled.html", "Styled", "II"),
    ("made.html", "Made", "III"),
    ("about.html", "About", ""),
]


def page(file, title, desc, chapter, body):
    links = []
    for href, label, num in NAV:
        cur = ' aria-current="page"' if href == file else ""
        n = f'<span class="num">{num}</span>' if num else ""
        links.append(f'<li><a href="{href}"{cur}>{n}{label}</a></li>')
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
      <li><a href="found.html">Vintage</a></li>
      <li><a href="styled.html">Virtual Styling</a></li>
      <li><a href="made.html">Custom Pieces</a></li>
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


DEPOP_NOTE = '<span class="depop-note"><span class="depop-dot"></span>Checkout happens securely on Depop</span>'

SUBSCRIBE = """
<section class="band">
  <div class="wrap spread">
    <div class="main stack">
      <p class="kicker">The Journal</p>
      <h2 class="h2">Get the next entry in your inbox.</h2>
      <p class="lede muted">New finds, styling notes and the stories behind each piece. Only when it's worth reading.</p>
      <form class="subscribe" data-form="subscribe">
        <label class="sr" for="sub-email">Email</label>
        <input id="sub-email" type="email" placeholder="you@email.com" required>
        <button class="btn ink" type="submit">Subscribe</button>
      </form>
    </div>
    <aside class="margin"><p class="note lav">Stay close, Family.</p></aside>
  </div>
</section>"""

CONTENTS = """
<section id="contents">
  <div class="wrap stack" style="gap:28px">
    <p class="kicker">Contents</p>
    <ol class="toc">
      <li class="ch-found"><a href="found.html">
        <span class="numeral">I</span>
        <span class="title">Found<small>Vintage · Shop on Depop</small></span>
        <span class="blurb">One-of-one pieces, inspected seam by seam and restored before they reach you.</span>
      </a></li>
      <li class="ch-styled"><a href="styled.html">
        <span class="numeral">II</span>
        <span class="title">Styled<small>Virtual Styling · Styled By certified</small></span>
        <span class="blurb">Book a virtual session, pay upfront and get styled from anywhere.</span>
      </a></li>
      <li class="ch-made"><a href="made.html">
        <span class="numeral">III</span>
        <span class="title">Made<small>Custom Pieces</small></span>
        <span class="blurb">A piece drawn, cut and sewn for one person. You.</span>
      </a></li>
      <li class="ch-found"><a href="about.html">
        <span class="numeral" style="font-size:40px">✦</span>
        <span class="title">About<small>Lady Britt</small></span>
        <span class="blurb">The stylist, vintage hunter and dressmaker behind the patch.</span>
      </a></li>
    </ol>
  </div>
</section>"""

HOW_STYLED = """
<ol class="steps five">
  <li><b>Choose a session</b><span>Closet edit, shopping session or event styling.</span></li>
  <li><b>Pick a time</b><span>Open slots show live on the calendar below.</span></li>
  <li><b>Pay upfront</b><span>Your payment holds the spot. No invoices later.</span></li>
  <li><b>Style questionnaire</b><span>Sizes, photos and goals, sent right after booking.</span></li>
  <li><b>Get styled</b><span>We meet on video and you leave with every look saved.</span></li>
</ol>"""

HOME = f"""
<section class="opener ch-found" style="padding-block:72px 64px">
  <span class="big-num" aria-hidden="true">I</span>
  <div class="wrap spread" style="gap:0 56px">
    <div class="main stack">
      <p class="kicker">Margin Material · Chapter I · Found</p>
      <h1 class="h1">Found. <em>Then gone.</em></h1>
      <p class="lede">Hand-picked vintage from the back rack and the bottom of the bin. Every piece is one of one, and every piece checks out on Depop.</p>
      <div class="btns"><a class="btn solid" href="found.html">Shop the rack</a><a class="btn" data-depop-shop href="#" target="_blank" rel="noopener">Open Depop shop</a></div>
    </div>
    <aside class="margin" style="align-items:center">
      <img class="patch" src="assets/logo.webp" alt="Margin Material patch: an open book, a needle and thread, scissors and a tee" width="150" height="150">
    </aside>
  </div>
</section>

<section class="ch-found">
  <div class="wrap stack" style="gap:36px">
    <div class="spread">
      <div class="main stack">
        <p class="kicker">On the rack now</p>
        <h2 class="h2">This week's finds.</h2>
        {DEPOP_NOTE}
      </div>
      <aside class="margin"><p class="note rust">tap a piece to<br>buy it on Depop</p></aside>
    </div>
    <div class="pieces" data-pieces="6"></div>
    <a class="more" href="found.html" style="align-self:flex-start">See the whole rack</a>
  </div>
</section>

<section class="band ch-styled">
  <div class="wrap stack" style="gap:36px">
    <div class="spread">
      <div class="main stack">
        <p class="kicker">Chapter II · <b>Styled</b></p>
        <h2 class="h2">Get styled from anywhere.</h2>
        <p class="lede muted">Certified through Styled By. Book a virtual session, pay upfront and meet me on video.</p>
      </div>
      <aside class="margin" style="align-items:flex-start">
        <div class="score placeholder" style="width:130px;height:130px"><div><b style="font-size:44px">—</b><br><span>Styled By score</span></div></div>
      </aside>
    </div>
    <div class="services" data-services></div>
    <a class="more" href="styled.html" style="align-self:flex-start">See the portfolio and book</a>
  </div>
</section>

<section class="ch-made">
  <div class="wrap stack" style="gap:36px">
    <div class="spread">
      <div class="main stack">
        <p class="kicker">Chapter III · <b>Made</b></p>
        <h2 class="h2">Sewn by hand, for one.</h2>
        <p class="lede muted">A few pieces from the sewing table. Yours could be next.</p>
      </div>
      <aside class="margin"><p class="note lav">every piece starts<br>with a consult</p></aside>
    </div>
    <div class="sewn" data-sewn="3"></div>
    <div class="btns"><a class="btn solid" href="made.html#commission">Commission a piece</a><a class="btn" href="made.html">See everything I've made</a></div>
  </div>
</section>
{SUBSCRIBE}
{CONTENTS}
"""

FOUND = f"""
<section class="opener">
  <span class="big-num" aria-hidden="true">I</span>
  <div class="wrap">
    <p class="kicker">Chapter I · Found</p>
    <h1 class="h1">Found. <em>Then gone.</em></h1>
    <p class="lede">Hand-picked, restored and listed one piece at a time. Browse here, then tap any piece to buy it on Depop.</p>
    <div class="btns"><a class="btn solid" href="#rack">Shop the rack</a><a class="btn" data-depop-shop href="#" target="_blank" rel="noopener">Follow on Depop</a></div>
  </div>
</section>

<section id="rack">
  <div class="wrap stack" style="gap:8px">
    <div class="spread">
      <div class="main stack">
        <p class="kicker">The rack</p>
        <h2 class="h2">Every piece is the only one.</h2>
        {DEPOP_NOTE}
        <div class="filters" role="group" aria-label="Filter the rack" style="margin-top:12px">
          <button class="chip" data-filter="all" aria-pressed="true">All</button>
          <button class="chip" data-filter="dresses" aria-pressed="false">Dresses</button>
          <button class="chip" data-filter="tops" aria-pressed="false">Tops</button>
          <button class="chip" data-filter="outerwear" aria-pressed="false">Outerwear</button>
          <button class="chip" data-filter="accessories" aria-pressed="false">Accessories</button>
        </div>
      </div>
      <aside class="margin"><p class="note"><small>How I grade a piece</small>Seams. Fabric weight. Hardware.</p></aside>
    </div>
    <div class="pieces" data-pieces></div>
  </div>
</section>

<section class="band">
  <div class="wrap stack" style="gap:36px">
    <p class="kicker">How buying works</p>
    <ol class="steps">
      <li><b>Browse here</b><span>Every piece on the rack is live on Depop too.</span></li>
      <li><b>Tap "Buy on Depop"</b><span>You land on that exact listing.</span></li>
      <li><b>Check out on Depop</b><span>Payment and buyer protection run through Depop.</span></li>
      <li><b>It ships to you</b><span>Packed with care, tracking included.</span></li>
    </ol>
  </div>
</section>
"""

STYLED = f"""
<section class="opener">
  <span class="big-num" aria-hidden="true">II</span>
  <div class="wrap">
    <p class="kicker">Chapter II · Styled</p>
    <h1 class="h1">Styled. <em>From anywhere.</em></h1>
    <p class="lede">Certified virtual styling through Styled By. Pick your session, pay upfront and meet me on video.</p>
    <div class="btns"><a class="btn solid" href="#book">Book a virtual session</a><a class="btn" href="#portfolio">See the portfolio</a></div>
  </div>
</section>

<section>
  <div class="wrap stack" style="gap:44px">
    <div class="profile">
      <div class="avatar sw4 placeholder"><span class="ph-label" style="color:#f1f6ee">your Styled By<br>profile photo</span></div>
      <div class="stack" style="gap:6px">
        <p class="kicker">Styled By profile</p>
        <h2>Lady Britt</h2>
        <p class="muted">Virtual stylist · Vintage specialist · Custom dressmaker</p>
        <div class="badges"><span class="badge ch">Styled By Certified Stylist</span><span class="badge">Virtual sessions</span><span class="badge">Vintage sourcing</span></div>
        <a class="more" href="#" style="align-self:flex-start;margin-top:8px">View my Styled By profile</a>
      </div>
      <div class="score placeholder"><div><b>—</b><br><span>Styled By score</span></div></div>
    </div>

    <div class="cert">
      <div class="frame"><div class="placeholder"><span class="ph-label">your Styled By<br>certificate goes here</span></div></div>
      <div class="stack">
        <p class="kicker">Certification</p>
        <h2 class="h2">Certified. And it shows.</h2>
        <p class="lede muted">My Styled By certification and score, right here for you to see before you book.</p>
      </div>
    </div>
  </div>
</section>

<section id="portfolio" class="band">
  <div class="wrap stack" style="gap:36px">
    <div class="spread">
      <div class="main stack"><p class="kicker">Portfolio</p><h2 class="h2">Looks I've styled.</h2></div>
      <aside class="margin"><p class="note">real clients,<br>real closets</p></aside>
    </div>
    <div class="portfolio">
      <div class="look"><div class="img sw4"></div><b>Sunday, elevated</b><span>Event styling</span></div>
      <div class="look"><div class="img sw6"></div><b>The work-week five</b><span>Closet edit</span></div>
      <div class="look"><div class="img sw3"></div><b>Gala in lavender</b><span>Event styling</span></div>
      <div class="look"><div class="img sw2"></div><b>Weekend vintage</b><span>Shopping session</span></div>
      <div class="look"><div class="img sw1"></div><b>Rust and gold</b><span>Shopping session</span></div>
      <div class="look"><div class="img sw5"></div><b>Linen layers</b><span>Closet edit</span></div>
      <div class="look"><div class="img sw4"></div><b>First-date fit</b><span>Event styling</span></div>
      <div class="look"><div class="img sw6"></div><b>Peach for spring</b><span>Closet edit</span></div>
    </div>
  </div>
</section>

<section>
  <div class="wrap stack" style="gap:36px">
    <div class="spread">
      <div class="main stack"><p class="kicker">Services</p><h2 class="h2">Pick your session.</h2></div>
      <aside class="margin"><p class="note">same sessions as<br>my Styled By profile</p></aside>
    </div>
    <div class="services" data-services></div>
  </div>
</section>

<section class="band">
  <div class="wrap stack" style="gap:36px">
    <div class="spread">
      <div class="main stack"><p class="kicker">How this works</p><h2 class="h2">Book, pay, get styled.</h2></div>
      <aside class="margin"><p class="note">your spot is held<br>once you pay</p></aside>
    </div>
    {HOW_STYLED}
  </div>
</section>

<section id="book">
  <div class="wrap stack" style="gap:28px">
    <div class="spread">
      <div class="main stack"><p class="kicker">Book</p><h2 class="h2">Book your virtual session.</h2></div>
      <aside class="margin"><p class="note">times show in<br>your time zone</p></aside>
    </div>
    <div class="booker" data-booker>
      <ol class="booker-steps" data-steps></ol>
      <div data-panel></div>
      <div class="booker-nav"><button class="btn" type="button" data-back>Back</button><button class="btn solid" type="button" data-next-step>Next</button></div>
    </div>
  </div>
</section>
"""

MADE = """
<section class="opener">
  <span class="big-num" aria-hidden="true">III</span>
  <div class="wrap">
    <p class="kicker">Chapter III · Made</p>
    <h1 class="h1">Made. <em>For one.</em></h1>
    <p class="lede">Every piece below was drawn, cut and sewn by hand. Tell me what you want made and book your consult in the same form.</p>
    <div class="btns"><a class="btn solid" href="#commission">Commission a piece</a><a class="btn" href="#sewn">See what I've made</a></div>
  </div>
</section>

<section id="sewn">
  <div class="wrap stack" style="gap:36px">
    <div class="spread">
      <div class="main stack"><p class="kicker">From the sewing table</p><h2 class="h2">Pieces I've made.</h2></div>
      <aside class="margin"><p class="note">each one made<br>for one person</p></aside>
    </div>
    <div class="sewn" data-sewn></div>
  </div>
</section>

<section class="band">
  <div class="wrap stack" style="gap:36px">
    <p class="kicker">How a commission works</p>
    <ol class="steps five">
      <li><b>Request</b><span>Describe the piece and send your inspiration.</span></li>
      <li><b>Consult</b><span>We meet at the time you booked and settle the design.</span></li>
      <li><b>Sketch & fabric</b><span>You approve the sketch, then I source the material.</span></li>
      <li><b>Fitting</b><span>We adjust it on your body until it's right.</span></li>
      <li><b>Delivery</b><span>Pressed, packed and ready for the day.</span></li>
    </ol>
  </div>
</section>

<section id="commission">
  <div class="wrap stack" style="gap:28px">
    <div class="spread">
      <div class="main stack"><p class="kicker">Commission</p><h2 class="h2">Tell me what to make.</h2></div>
      <aside class="margin"><p class="note">a photo you love<br>says a lot. add it.</p></aside>
    </div>
    <div class="form-card" data-commission-wrap>
      <form class="req" data-commission novalidate style="gap:34px">
        <fieldset>
          <legend><small>Step 1</small>About you</legend>
          <div class="two">
            <label for="c-name">Name<input id="c-name" name="name" required autocomplete="name"></label>
            <label for="c-email">Email<input id="c-email" name="email" type="email" required autocomplete="email"></label>
          </div>
          <label for="c-phone">Phone (optional)<input id="c-phone" name="phone" type="tel" autocomplete="tel"></label>
        </fieldset>

        <fieldset>
          <legend><small>Step 2</small>The piece</legend>
          <div class="two">
            <label for="c-piece">What should I make?<select id="c-piece" name="piece"><option>Dress</option><option>Gown</option><option>Two-piece set</option><option>Skirt</option><option>Top</option><option>Something else</option></select></label>
            <label for="c-occ">Occasion<select id="c-occ" name="occasion"><option>Wedding guest</option><option>Bridal party</option><option>Gala or formal</option><option>Church</option><option>Birthday</option><option>Photoshoot</option><option>Everyday</option></select></label>
          </div>
          <div class="two">
            <label for="c-date">Date you need it<input id="c-date" name="date" type="date"></label>
            <label for="c-budget">Budget<select id="c-budget" name="budget"><option>Let's talk at the consult</option><option>Under $250</option><option>$250 – $500</option><option>$500 – $1,000</option><option>$1,000+</option></select></label>
          </div>
          <label for="c-vision">Describe it<textarea id="c-vision" name="vision" rows="5" placeholder="The color, the silhouette, the fabric, how you want to feel walking in…"></textarea></label>
        </fieldset>

        <fieldset>
          <legend><small>Step 3</small>Inspiration photos</legend>
          <div class="drop" role="button" tabindex="0" aria-label="Add inspiration photos">
            <b>Drop photos here</b>
            <span class="muted">or tap to choose from your phone · up to 10 images</span>
          </div>
          <input id="c-photos" type="file" accept="image/*" multiple hidden>
          <div class="thumbs"></div>
        </fieldset>

        <fieldset>
          <legend><small>Step 4</small>Book your consult</legend>
          <label for="c-format" style="max-width:320px">Consult format<select id="c-format" name="format"><option>Virtual</option><option>In person</option></select></label>
          <div data-consult-cal></div>
          <label class="check" for="c-fit"><input id="c-fit" type="checkbox"> Book my first fitting now too</label>
          <div data-fitting hidden>
            <p class="muted" style="margin-bottom:10px">Pick a fitting date at least three weeks after your consult. You can move it later.</p>
            <div data-fit-cal></div>
          </div>
        </fieldset>

        <p class="sent" data-error hidden></p>
        <button class="btn solid" type="submit">Send request & book consult</button>
      </form>
    </div>
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
      <p>That's how one passion became three chapters. I find. I style. I make. And I document all of it so you can watch a piece travel from the bin or the sketchbook to your closet.</p>
    </div>
    <aside class="margin">
      <p class="note rust"><small>Chapter I</small><a href="found.html" style="text-decoration:none">Found →</a></p>
      <p class="note sage"><small>Chapter II</small><a href="styled.html" style="text-decoration:none">Styled →</a></p>
      <p class="note lav"><small>Chapter III</small><a href="made.html" style="text-decoration:none">Made →</a></p>
    </aside>
  </div>
</section>

<section>
  <div class="wrap spread">
    <blockquote class="main quote">“Whatever you do, work at it with all your heart.”<cite>Colossians 3:23</cite></blockquote>
    <aside class="margin"><p class="note">the standard<br>behind every seam</p></aside>
  </div>
</section>
"""

PAGES = [
    ("index.html", "Margin Material Journal", "Vintage on Depop, certified virtual styling and custom pieces by Lady Britt.", "ch-found", HOME),
    ("found.html", "Found · Margin Material", "One-of-one vintage pieces by Lady Britt. Browse here and buy on Depop.", "ch-found", FOUND),
    ("styled.html", "Styled · Margin Material", "Certified virtual styling with Lady Britt. Book and pay upfront for your session.", "ch-styled", STYLED),
    ("made.html", "Made · Margin Material", "Custom pieces sewn by Lady Britt. Request a commission and book your consult.", "ch-made", MADE),
    ("about.html", "About Lady Britt · Margin Material", "Meet Lady Britt, the vintage hunter, stylist and dressmaker behind Margin Material.", "ch-found", ABOUT + SUBSCRIBE),
]

for file, title, desc, ch, body in PAGES:
    with open(os.path.join(OUT, file), "w") as f:
        f.write(page(file, title, desc, ch, body))
print("built", len(PAGES), "pages")
