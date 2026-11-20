// node frames.js reel.html out.mp4 [fps]  -> deterministic render: calls window.render(t) per frame, screenshots, encodes.
// also: node frames.js reel.html --stills t1,t2,...  -> PNG stills in out/
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs'); const path = require('path');
(async () => {
  const [file, out, arg] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(file) + '?rec=1');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  if (out === '--stills') {
    fs.mkdirSync('out', { recursive: true });
    for (const t of arg.split(',')) { await p.evaluate(t => render(t), Number(t)); await p.screenshot({ path: `out/f_${t}.png` }); }
    await b.close(); return;
  }
  const fps = Number(arg || 30); const T = await p.evaluate(() => window.T);
  const dir = fs.mkdtempSync(path.join(__dirname, 'fr-'));
  const N = Math.round(T * fps);
  for (let i = 0; i < N; i++) { await p.evaluate(t => render(t), i / fps); await p.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 95 }); }
  await b.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${fps} -i "${dir}/%05d.jpg" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -movflags +faststart -an "${out}"`);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(out, (fs.statSync(out).size / 1e6).toFixed(1) + 'MB', N, 'frames');
})();
