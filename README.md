# The Barking Lot — website

A static, production-ready website for **The Barking Lot**, professional dog and cat grooming at
606 N Belmont Ave, Richmond, VA 23221. Designed and built by Couture House Co. as a spec concept to replace
the business's current early-2000s site at **thebarkinglot.info**.

## What's here
- `index.html`, `services.html`, `regulars.html`, `about.html`, `visit.html`, `404.html`
- `assets/css/site.css` + `assets/css/fonts.css`, `assets/js/site.js` (vanilla JS, no libraries)
- `assets/fonts/` self-hosted woff2 (Big Shoulders Display, Fraunces italic, Libre Franklin)
- `assets/img/` optimized photos (webp), vectorized logo (`logo.svg`, `logo-light.svg`), favicons, `og.jpg`
- `robots.txt`, `sitemap.xml`, `llms.txt`, `site.webmanifest`, `netlify.toml`

No build step: every page is plain HTML.

## Preview locally
Double-click `index.html`, or (recommended, so fonts and forms behave like production):

```
cd the-barking-lot
python3 -m http.server 8080
```

then open http://localhost:8080/.

## Deploy on Netlify
1. Create a new site in Netlify and drag this folder onto the deploy area (or connect a Git repo; publish directory is the repo root).
2. `netlify.toml` sets security headers (including a Content Security Policy), cache headers and the custom 404 page.
3. Forms: the appointment request form on `visit.html` is a Netlify Form. It is detected automatically on deploy.
   In Netlify, go to Forms and add an email notification so new requests reach the shop's inbox.
4. Domain: the business already owns **thebarkinglot.info**. Point its DNS at Netlify (Domain management, add custom domain),
   and enable HTTPS (Let's Encrypt, automatic).

## Editing notes
- Hours are in three places: the HTML hours tables/footers, the JSON-LD in each page head, and the `HOURS` object at the top of the
  open/closed logic in `assets/js/site.js`. Update all three together, plus `llms.txt`.
- The inline `<script>` in each page head (adds the `js` class) is allowed by a sha256 hash in the CSP in `netlify.toml`.
  If you change that one line, update the hash.
