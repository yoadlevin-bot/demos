// node rec.js reel.html out.mp4 seconds  -> records a 1080x1920 page animation
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs'); const path = require('path');
(async () => {
  const [file, out, secs] = process.argv.slice(2);
  const dir = fs.mkdtempSync(path.join(__dirname, 'v-'));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, recordVideo: { dir, size: { width: 1080, height: 1920 } } });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto('file://' + path.resolve(file) + '?rec=1');
  await p.evaluate(() => document.fonts.ready);
  const lead = (Date.now() - t0) / 1000;
  await p.evaluate(() => window.start && window.start());
  await p.waitForTimeout(Number(secs) * 1000 + 300);
  const v = p.video(); await ctx.close(); await b.close();
  const webm = await v.path();
  execSync(`ffmpeg -y -loglevel error -ss ${(lead + 0.15).toFixed(2)} -i "${webm}" -t ${secs} -vf "fps=30" -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p -movflags +faststart -an "${out}"`);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(out, (fs.statSync(out).size / 1e6).toFixed(1) + 'MB');
})();
