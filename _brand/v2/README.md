# Content kit v2 (approved by Yoad, Nov 15 2026) – use this, not the older templates in ../
Style: dark navy scene (#050A16 -> #0B1324 -> #0c1b3a), blue glows, faint stars, glowing horizon line + perspective grid floor,
pill chips with a blue check circle, headline words in a light-to-dark BLUE gradient (#93C5FD -> #3F95F6 -> #2563EB). Blue only, never purple.
Mix: reels, carousel cover + last slide, and offer posts are dark; tip slides in the middle stay light (#F6F7F9) for readability.
Logo: the real logo (logo-original.png). Dark items: stacked logo (logo_stack_dark.png) top-right. Light slides: logo_light.png bottom-right.
Voice: plural ("אתם", "לכם"). CTA: "לסקיצה חינם בוואטסאפ" + 058-7336636. Sites shown are concept / fictional only, labeled "אתר לדוגמה · עסק בדוי".

Setup (in this folder): npm i @fontsource/heebo   (playwright is preinstalled)
1. Edit texts in gfx.js (reel cards, carousel slides, offer post). Run: node gfx.js  -> reel/*.png, carousel/*.png, offer/offer.png
2. Build a concept site (see site-example.html), then: node rec-scroll.js mysite.html  -> frames/ (sharp, 2x, smooth scroll ~15s)
   gfx.js uses frames/0042.jpg as the phone screenshot in the offer post.
3. ./make-reel.sh out.mp4  -> 22s 1080x1920 H.264 reel, no audio
Check 3 frames of every reel and look at every PNG before sending.
