# Levin Web Design – content kit
Templates and tools for social posts and reels (see the levin-marketing skill).
Setup: `npm i playwright @fontsource/heebo` in this folder (base.css loads fonts from node_modules).
- `python3 build.py posts3.tpl.html` -> posts3.html (fills logo, CTA, icons)
- `node shoot.js posts3.html out/p` -> one PNG per `.slide`
- `node rec.js reel1.html out.mp4 21.5` -> 1080x1920 reel
- `node frames.js reelN.html out.mp4 30` -> deterministic frame-by-frame render (calls window.render(t)); `--stills 0,1.5,...` for quick PNG checks. Sharper and smoother than rec.js.
- reel5/6/7.tpl.html (20.11): phone mockup + fictional law-firm site, chat, lock-screen notification, skeleton->site scan build. `.ln` lines need padding/negative margin or overflow:hidden clips the blue glow into a visible box.
