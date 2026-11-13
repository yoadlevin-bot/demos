// usage: node record.js <url-or-file> <out.mp4>
const { chromium, devices } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs'); const path = require('path');
(async () => {
  const [src, out] = process.argv.slice(2);
  const url = /^https?:/.test(src) ? src : 'file://' + path.resolve(src);
  const dir = fs.mkdtempSync('/tmp/vid-');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, recordVideo: { dir, size: { width: 390, height: 844 } } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(3500); // preloader + hero animation
  const h = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const steps = 14; // smooth scroll in ~14s
  for (let i = 1; i <= steps; i++) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'smooth' }), Math.round(h * i / steps));
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1500);
  const v = page.video(); await ctx.close(); await browser.close();
  const webm = await v.path();
  execSync(`ffmpeg -y -loglevel error -i "${webm}" -ss 0.6 -vf "scale=720:-2,fps=30" -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -movflags +faststart -an "${out}"`);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(out, (fs.statSync(out).size / 1e6).toFixed(1) + 'MB');
})();
