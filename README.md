# OHO Premium Multipage Website — GitHub Pages

## Quick start

1. Upload all files to the root of a public GitHub repository.
2. Settings → Pages → Deploy from main branch / (root).
3. Configure custom domain `runoho.com`, DNS, and HTTPS.
4. Open `index.html` locally to preview. No build tools required.

## Google Sheets lead capture

1. Create a new Google Sheet dedicated to website enquiries.
2. Extensions → Apps Script → paste `GoogleAppsScript.gs` (the file is NOT part of the public frontend runtime).
3. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone**. Copy the `/exec` URL.
4. Edit `script.js`: replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.
5. Submit a test enquiry from `contact.html`; verify a row appears in `Website Leads`.
6. If you edit Apps Script later, redeploy a new version. The Apps Script deployment is public: validate inputs and watch spam. Consider CAPTCHA/proxy before high traffic.

**Important:** Browser `no-cors` submission cannot confirm whether Google Sheets saved the row. The UI intentionally says "sent for processing", not "saved". Always test the Sheet directly. For verifiable submissions, use a serverless API with proper CORS and response handling.

## Pricing & offers

Launch starts at ₹3,000 and includes a **single-page starter website** (not a 5-page site). Automate starts at ₹7,999 for a narrow, agreed workflow. Custom = Contact Sales. Prices are promotional proposed offers and must be reviewed before publication. Animated high-to-low numbers are visual effects, NOT previous actual prices. The website deliberately avoids fabricated crossed-out reference prices.

## Pricing animation

The Launch and Automate offers animate from the configured `data-start` value to the final `data-target` value over approximately 7.8 seconds when the price enters the viewport. This runs on both the homepage and pricing page and respects reduced-motion preferences.

## Testimonials

Policybazaar, upGrad and Physics Wallah are presented as founder-confirmed testimonial relationships. Direct quotes, speaker names and roles should only be added after the exact approved wording is available.

## WhatsApp

The site-wide WhatsApp contact uses `+91 80768 31603` through `wa.me/918076831603`. Update `WHATSAPP_NUMBER` in `script.js` if the number changes.

## Brand assets

Original primary, secondary and favicon PNGs included in `assets/`.

## Limitations

Static GitHub Pages, no login, no backend on GitHub. Icons load from Lucide CDN; some decorative glyphs remain visible without CDN. Animations respect reduced-motion preferences.
