// node shoot.js page.html outPrefix  -> screenshots every .slide as outPrefix-N.png (one at a time, exact size)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [file, prefix] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(file));
  await p.evaluate(() => document.fonts.ready);
  const n = await p.$$eval('.slide', els => els.length);
  for (let i = 0; i < n; i++) {
    const [w, h] = await p.evaluate(i => {
      const els = [...document.querySelectorAll('.slide')];
      els.forEach((e, j) => { e.style.display = j === i ? '' : 'none'; e.style.margin = '0'; });
      window.scrollTo(0, 0);
      return [els[i].offsetWidth, els[i].offsetHeight];
    }, i);
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(250);
    const out = `${prefix}-${i + 1}.png`;
    await p.screenshot({ path: out });
    console.log(out);
  }
  await b.close();
})();
