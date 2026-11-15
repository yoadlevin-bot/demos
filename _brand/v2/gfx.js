const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const LOGO = (theme, size) => `<img src="logo_${theme}.png" style="height:${Math.round(size*2.1)}px;display:block">`;
const head = (w,h,extra='') => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="brand.css"><style>html,body{width:${w}px;height:${h}px;overflow:hidden;background:transparent}${extra}</style></head><body>`;
const WA = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>`;


const SC = `
.scene{position:absolute;inset:0;overflow:hidden;color:#fff;background:linear-gradient(180deg,#050A16 0%,#0B1324 45%,#0c1b3a 100%)}
.scene .g1{position:absolute;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,.38),transparent 62%)}
.scene .g2{position:absolute;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(63,149,246,.28),transparent 62%)}
.floor{position:absolute;left:-50%;right:-50%;bottom:-6%;height:46%;transform:perspective(700px) rotateX(64deg);transform-origin:50% 100%;
 background-image:linear-gradient(rgba(63,149,246,.6) 2px,transparent 2px),linear-gradient(90deg,rgba(63,149,246,.6) 2px,transparent 2px);background-size:120px 120px;
 -webkit-mask-image:linear-gradient(to top,#000 10%,transparent 85%)}
.horizon{position:absolute;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,rgba(63,149,246,.9),transparent);box-shadow:0 0 30px 6px rgba(63,149,246,.5)}
.star{position:absolute;width:3px;height:3px;border-radius:50%;background:#cfe2ff}
.grad{background:linear-gradient(90deg,#93C5FD 0%,#3F95F6 45%,#2563EB 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.pill{display:inline-flex;align-items:center;gap:.5em;padding:.55em 1.1em;border-radius:999px;background:rgba(10,16,32,.75);border:2px solid rgba(147,197,253,.22);box-shadow:0 10px 40px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.06);font-weight:800;color:#fff;white-space:nowrap}
.pill.light{background:#fff;color:var(--navy);border-color:#dbe4f3;box-shadow:0 8px 24px rgba(11,19,36,.06)}
.ck{display:inline-grid;place-items:center;width:1.25em;height:1.25em;border-radius:50%;background:linear-gradient(135deg,#93C5FD,#2563EB);color:#fff;font-size:.8em;font-weight:900;box-shadow:0 0 18px rgba(63,149,246,.6)}
.dot{width:.55em;height:.55em;border-radius:50%;background:#3F95F6;box-shadow:0 0 14px 3px rgba(63,149,246,.8)}
.cta{display:inline-flex;align-items:center;gap:.4em;background:linear-gradient(135deg,#3F95F6,#2563EB);color:#fff;font-weight:800;border-radius:999px;padding:.6em 1.3em;box-shadow:0 18px 50px rgba(37,99,235,.55),inset 0 1px 0 rgba(255,255,255,.25)}
.phone{position:absolute;border-radius:70px;background:#0b0f1a;padding:16px;box-shadow:0 0 0 3px #2b3550,0 50px 120px rgba(0,0,0,.65),0 0 80px rgba(63,149,246,.25)}
.phone .scr{width:100%;height:100%;border-radius:56px;overflow:hidden;background:#fff;position:relative}
.phone .scr img{width:100%;display:block}
.phone .isl{position:absolute;top:30px;left:50%;transform:translateX(-50%);width:120px;height:34px;border-radius:20px;background:#000;z-index:2}
`;
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const stars=(w,h,n)=>{seed=7;let o='';for(let i=0;i<n;i++)o+=`<div class="star" style="left:${(rnd()*w)|0}px;top:${(rnd()*h*.55)|0}px;opacity:${(.25+rnd()*.6).toFixed(2)}"></div>`;return o};
const SCENE=(w,h,floor=true)=>`<div class="scene"><div class="g1" style="top:${h*.18}px;left:${-w*.45}px"></div><div class="g2" style="top:${-h*.12}px;right:${-w*.35}px"></div>${stars(w,h,40)}${floor?`<div class="horizon" style="top:${h*.6}px"></div><div class="floor"></div>`:''}</div>`;
const PILLS=(fs,light)=>[['סקיצה ראשונה בחינם'],['2,900 ₪ מחיר קבוע'],['ישירות איתי בוואטסאפ']].map(([t])=>`<span class="pill ${light?'light':''}" style="font-size:${fs}px"><span class="ck">✓</span>${t}</span>`).join('');
const STACK=(h)=>`<img src="logo_stack_dark.png" style="height:${h}px;display:block">`;
const R='.lg{position:absolute;top:70px;right:60px}'+SC;
const files = {
 'reel/intro1.png':[1080,1920,R,`${SCENE(1080,1920)}<div class="lg">${STACK(170)}</div>
  <div style="position:absolute;top:120px;left:60px"><span class="pill" style="font-size:36px"><span class="dot"></span>אתר לדוגמה</span></div>
  <div style="position:absolute;top:560px;right:80px;left:80px;color:#fff"><div style="font-size:150px;font-weight:900;line-height:1.02">עורך דין<br><span class="grad">בלי אתר?</span></div></div>`],
 'reel/intro2.png':[1080,1920,R,`${SCENE(1080,1920)}<div class="lg">${STACK(170)}</div>
  <div style="position:absolute;top:120px;left:60px"><span class="pill" style="font-size:36px"><span class="dot"></span>אתר לדוגמה</span></div>
  <div style="position:absolute;top:560px;right:80px;left:80px;color:#fff"><div style="font-size:150px;font-weight:900;line-height:1.02">עורך דין<br><span class="grad">בלי אתר?</span></div>
  <div style="font-size:64px;font-weight:300;margin-top:60px;line-height:1.3">הלקוחות מחפשים בגוגל<br>ומוצאים <b style="font-weight:800">את המתחרים.</b></div></div>`],
 'reel/bg.png':[1080,1920,R,SCENE(1080,1920)],
 'reel/frame.png':[1080,1920,R+`.ph{position:absolute;left:205px;top:300px;width:670px;height:1450px;border-radius:56px;box-shadow:0 0 0 16px #0b0f1a,0 0 0 19px #2b3550,0 50px 120px rgba(0,0,0,.65),0 0 90px 10px rgba(63,149,246,.3)}`,`<div class="ph"></div><div class="lg" style="top:40px;right:40px">${STACK(120)}</div>`],
 'reel/cap1.png':[1080,1920,SC,`<div style="position:absolute;top:172px;width:100%;text-align:center;color:#fff;font-size:76px;font-weight:900">ככה זה <span class="grad">יכול להיראות</span></div>
   <div style="position:absolute;top:1790px;width:100%;text-align:center;color:#9fb3d1;font-size:34px;font-weight:300">אתר לדוגמה · עסק בדוי</div>`],
 'reel/cap2.png':[1080,1920,SC,`<div style="position:absolute;top:172px;width:100%;text-align:center;color:#fff;font-size:76px;font-weight:900">ברור, מהיר, <span class="grad">בנוי לנייד</span></div>
   <div style="position:absolute;top:1790px;width:100%;text-align:center;color:#9fb3d1;font-size:34px;font-weight:300">אתר לדוגמה · עסק בדוי</div>`],
 'reel/cap3.png':[1080,1920,SC,`<div style="position:absolute;top:172px;width:100%;text-align:center;color:#fff;font-size:76px;font-weight:900">וואטסאפ <span class="grad">בלחיצה אחת</span></div>
   <div style="position:absolute;top:1790px;width:100%;text-align:center;color:#9fb3d1;font-size:34px;font-weight:300">אתר לדוגמה · עסק בדוי</div>`],
 'reel/end.png':[1080,1920,R,`${SCENE(1080,1920)}
  <div style="position:absolute;top:300px;width:100%;display:flex;justify-content:center">${STACK(280)}</div>
  <div style="position:absolute;top:680px;width:100%;text-align:center;font-size:104px;font-weight:900;line-height:1.1;color:#fff">אתר שמביא<br>לכם <span class="grad">לקוחות.</span></div>
  <div style="position:absolute;top:980px;width:100%;display:flex;flex-direction:column;align-items:center;gap:26px">${PILLS(44)}</div>
  <div style="position:absolute;top:1390px;width:100%;text-align:center"><span class="cta" style="font-size:58px">${WA} שלחו וואטסאפ</span></div>
  <div style="position:absolute;top:1560px;width:100%;text-align:center;font-size:66px;font-weight:800;direction:ltr;color:#fff">058-7336636</div>
  <div style="position:absolute;top:1660px;width:100%;text-align:center;font-size:38px;font-weight:300;direction:ltr;color:#9fb3d1">levin-webdesign.com</div>`],
};
// CAROUSEL 1080x1350
const C = SC+`.s{position:absolute;inset:0;padding:110px 90px}
.lgb{position:absolute;bottom:60px;right:90px}
.lgt{position:absolute;top:60px;right:70px}
.num{position:absolute;bottom:84px;left:90px;font-size:30px;font-weight:700;opacity:.5;direction:ltr}
h1{font-size:104px;font-weight:900;line-height:1.05}
h2{font-size:86px;font-weight:900;line-height:1.08;margin-bottom:40px}
p{font-size:52px;font-weight:300;line-height:1.45}
.big{position:absolute;top:60px;left:70px;font-size:330px;font-weight:900;line-height:1;direction:ltr;background:linear-gradient(180deg,#cfe0fb,#eef3fb);-webkit-background-clip:text;color:transparent}
.box{background:#fff;border-radius:28px;padding:36px 40px;margin-top:40px;font-size:40px;line-height:1.4;box-shadow:0 10px 30px rgba(11,19,36,.06);border:2px solid #e3eaf6}
.x{color:#c0392b;font-weight:700}.v{color:var(--blue);font-weight:700}`;
const light = (n, body) => [1080,1350,C,`<div class="s" style="background:var(--grey);color:var(--navy)">${body}<div class="lgb">${LOGO('light',50)}</div><div class="num">${n}/5</div></div>`];
const dark = (n, body) => [1080,1350,C,`${SCENE(1080,1350)}<div class="s" style="color:#fff">${body}</div><div class="lgt">${STACK(150)}</div>${n?`<div class="num" style="color:#fff">${n}/5</div>`:''}`];
const lp = t=>`<span class="pill light" style="font-size:34px;margin-bottom:34px"><span class="dot"></span>${t}</span>`;
Object.assign(files,{
 'carousel/1.png':dark(1,`<div style="margin-top:300px"><span class="pill" style="font-size:36px;margin-bottom:44px"><span class="dot"></span>טיפ לבעלי עסקים</span><h1>מחפשים אתכם<br>בגוגל.<br><span class="grad">מה הם מוצאים?</span></h1><p style="margin-top:50px">3 דברים לבדוק היום, בלי לשלם שקל.</p></div>`),
 'carousel/2.png':light(2,`<div class="big">1</div><div style="margin-top:330px">${lp('טיפ 1 מתוך 3')}<h2>פרופיל עסקי<br><span class="hl">בגוגל, מלא עד הסוף</span></h2><p>שעות פתיחה, טלפון, תמונות אמיתיות וקישור לאתר. זה בחינם, וזה הדבר הראשון שרואים כשמחפשים אתכם.</p></div>`),
 'carousel/3.png':light(3,`<div class="big">2</div><div style="margin-top:310px">${lp('טיפ 2 מתוך 3')}<h2>כתבו מה אתם עושים<br><span class="hl">ואיפה</span></h2><div class="box"><span class="x">✗</span> "ברוכים הבאים לאתר שלנו"<br><span class="v">✓</span> "עורך דין לדיני עבודה בפתח תקווה"</div><p style="margin-top:36px">ככה גם הלקוח וגם גוגל מבינים מיד.</p></div>`),
 'carousel/4.png':light(4,`<div class="big">3</div><div style="margin-top:330px">${lp('טיפ 3 מתוך 3')}<h2>בדקו את האתר<br><span class="hl">מהטלפון שלכם</span></h2><p>הלקוחות שלכם מחפשים מהנייד. אם צריך להגדיל כדי לקרוא, או שאין כפתור להתקשר או לשלוח וואטסאפ, הם חוזרים לגוגל ובוחרים מישהו אחר.</p></div>`),
 'carousel/5.png':dark(5,`<div style="margin-top:230px"><h1 style="font-size:92px">אין לכם אתר,<br>או שהוא <span class="grad">לא עובד בנייד?</span></h1>
   <div style="margin-top:56px;display:flex;flex-direction:column;align-items:flex-start;gap:22px">${PILLS(38)}</div>
   <div style="margin-top:60px"><span class="cta" style="font-size:46px">${WA} לסקיצה חינם בוואטסאפ</span></div>
   <div style="margin-top:28px;font-size:52px;font-weight:800;color:#fff;direction:ltr;text-align:right">058-7336636</div></div>`),
 'offer/offer.png':[1080,1350,C,`${SCENE(1080,1350)}<div class="lgt">${STACK(150)}</div>
  <div style="position:absolute;top:80px;left:70px"><span class="pill" style="font-size:32px"><span class="dot"></span>רוצים לראות לפני שמחליטים?</span></div>
  <div style="position:absolute;top:260px;width:100%;text-align:center;color:#fff"><div style="font-size:92px;font-weight:900;line-height:1.05">שלחו לנו את שם העסק.</div>
   <div style="font-size:54px;font-weight:800;margin-top:22px" class="grad">נראה לכם איך האתר שלכם יכול להיראות</div></div>
  <div class="phone" style="left:70px;top:520px;width:370px;height:770px;transform:rotate(-7deg)"><div class="isl"></div><div class="scr"><img src="frames/0042.jpg"></div></div>
  <div style="position:absolute;left:150px;top:1290px;font-size:24px;color:#9fb3d1;transform:rotate(-7deg)">אתר לדוגמה · עסק בדוי</div>
  <div style="position:absolute;right:80px;top:600px;display:flex;flex-direction:column;align-items:flex-start;gap:24px">${PILLS(36)}
   <div style="margin-top:40px"><span class="cta" style="font-size:33px">${WA} לסקיצה חינם בוואטסאפ</span></div>
   <div style="font-size:50px;font-weight:800;color:#fff;direction:ltr;align-self:stretch;text-align:center">058-7336636</div></div>`],
});
(async()=>{
  const b = await chromium.launch(); const p = await b.newPage();
  for (const [f,[w,h,css,body]] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(f),{recursive:true});
    fs.writeFileSync('_t.html', head(w,h,css)+body+'</body></html>');
    await p.setViewportSize({width:w,height:h});
    await p.goto('file://'+path.resolve('_t.html')); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({path:f, omitBackground:true});
  }
  await b.close(); console.log('done');
})();
