const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const dir='frames'; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  await p.goto('file://'+path.resolve(process.argv[2]||'site.html'), {waitUntil:'load'});
  await p.evaluate(()=>document.fonts.ready);
  let n=0; const shot=async()=>p.screenshot({path:`${dir}/${String(n++).padStart(4,'0')}.jpg`,type:'jpeg',quality:92});
  // hero intro: 2.5s at real-time-ish (timestamped)
  const t0=Date.now(); while(Date.now()-t0<2500){ const s=Date.now(); await shot(); const w=33-(Date.now()-s); if(w>0) await p.waitForTimeout(w);} 
  const heroFrames=n;
  const h = await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
  const F=30*12.5;
  for(let i=1;i<=F;i++){ const k=i/F; const e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    await p.evaluate(y=>scrollTo(0,y),Math.round(h*e)); await p.waitForTimeout(16); await shot(); }
  for(let i=0;i<30;i++) await shot();
  console.log('hero',heroFrames,'total',n, 'heroSec',(Date.now()-t0));
  await b.close();
})();
