const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const output=process.env.EVARIS_QA_DIR||path.resolve(__dirname,'../test-results');
const base=process.env.EVARIS_TEST_URL||'http://127.0.0.1:4173';
(async()=>{
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.EVARIS_BROWSER_PATH||undefined,args:['--no-sandbox']});
const context=await browser.newContext();
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const matrix=[];
for(const width of (process.env.EVARIS_WIDTHS?process.env.EVARIS_WIDTHS.split(',').map(Number):[1440,1280,1024,1000,760,720,390,375,320])){
  const geometry={};
  for(const language of ['ro','en']){
    await page.setViewportSize({width,height:900});
    await page.goto(base+(language==='en'?'/en/':'/'));
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(1050);
    assert.equal(await page.locator('main > section').count(),3);
    const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,nav:getComputedStyle(document.querySelector('nav a')).fontSize,images:[...document.images].map(i=>({src:i.getAttribute('src'),fit:getComputedStyle(i).objectFit,position:getComputedStyle(i).objectPosition,width:Math.round(i.getBoundingClientRect().width),height:Math.round(i.getBoundingClientRect().height)})),font:document.fonts.check('500 16px Manrope')}));
    assert.ok(!metrics.overflow,`${language} ${width}: horizontal overflow`);
    assert.ok(metrics.font,'local Manrope loaded');
    geometry[language]=metrics.images;
    for(const el of await page.locator('[data-reveal]').all()){
      if(!await el.evaluate(e=>e.getClientRects().length>0))continue;
      await el.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));
      await page.waitForFunction(e=>e.classList.contains('is-visible'),await el.elementHandle(),{timeout:1500}).catch(async error=>{console.error('Reveal target',language,width,await el.evaluate(e=>({tag:e.tagName,id:e.id,class:e.className,rect:e.getBoundingClientRect().toJSON()})));throw error;});
      assert.equal(await el.evaluate(e=>e.classList.contains('is-visible')),true,`${language} ${width}: reveal`);
    }
    await page.locator('.story-image').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    assert.ok(await page.locator('.story-image').first().evaluate(e=>e.style.getPropertyValue('--parallax')));
    assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true);
    const m=await page.locator('.ticker-track').evaluate(e=>({width:e.getBoundingClientRect().width,groups:[...e.children].map(c=>c.getBoundingClientRect().width),animation:getComputedStyle(e).animationName}));
    assert.ok(Math.abs(m.width-m.groups[0]*2)<1,'seamless strip group geometry');
    assert.equal(m.animation,'marquee');
    await page.locator('.ticker-toggle').click();
    assert.equal(await page.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
    await page.locator('.ticker-toggle').click();
    assert.equal(await page.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationPlayState),'running');
    if(width<=1000){
      await page.locator('.menu').click();
      assert.equal(await page.locator('.menu').getAttribute('aria-expanded'),'true');
      assert.equal(await page.locator('main').evaluate(e=>e.inert),true);
      const box=await page.locator('nav').boundingBox();assert.ok(box.height>600&&box.y>=75,'menu covers viewport below header');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu').getAttribute('aria-expanded'),'false');
      assert.equal(await page.locator('main').evaluate(e=>e.inert),false);
      await page.locator('.menu').click();
      await page.locator('nav a[href="#digital"]').click();
      assert.equal(await page.locator('.menu').getAttribute('aria-expanded'),'false');
      await page.waitForTimeout(700);
      assert.equal(new URL(page.url()).hash,'#digital');
      await page.locator('.menu').click();
      await page.setViewportSize({width:1280,height:900});
      await page.waitForFunction(()=>document.querySelector('.menu').getAttribute('aria-expanded')==='false',null,{timeout:2000});
      assert.equal(await page.locator('.menu').getAttribute('aria-expanded'),'false');
      assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('menu-open')),false);
      await page.setViewportSize({width,height:900});
    }
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(150);
    if([1440,390].includes(width))await page.screenshot({path:path.join(output,`${language}-${width}-hero.png`)});
    if([1440,390].includes(width)){
      await page.locator('#digital').scrollIntoViewIfNeeded();await page.waitForTimeout(250);
      await page.screenshot({path:path.join(output,`${language}-${width}-digital.png`)});
    }
    matrix.push({language,width,...metrics,result:'PASS'});console.log('PASS',language,width);
  }
  assert.deepEqual(geometry.ro,geometry.en,`${width}: same image sources and crop settings`);
}
await page.setViewportSize({width:1440,height:960});
for(const language of ['ro','en']){
  await page.goto(base+(language==='en'?'/en/':'/'));
  await page.locator('#offer').scrollIntoViewIfNeeded();
  await page.locator('#offer button[type="submit"]').click();
  assert.equal(await page.locator('#quote-preview').isVisible(),false);
  const fields=page.locator('#offer input');
  for(const [i,v] of ['Test verificare','Companie test','qa@example.com','0700000000','12','București'].entries())await fields.nth(i).fill(v);
  await page.locator('#offer textarea[name]').fill('Solicitare de test local. Nu se expediază.');
  await page.locator('[data-service]').first().click();
  assert.equal(await page.locator('#offer select').evaluate(e=>e.selectedIndex),1);
  await page.locator('#offer button[type="submit"]').click();
  assert.equal(await page.locator('#quote-preview').isVisible(),true);
  assert.ok((await page.locator('#quote-message').inputValue()).includes('qa@example.com'));
  const email=await page.locator('#open-email').getAttribute('href');
  assert.ok(email.startsWith('mailto:office@evaris.ro?'));
  assert.equal(new URL(email).searchParams.get('body'),await page.locator('#quote-message').inputValue());
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.locator('#copy-quote').click();
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),await page.locator('#quote-message').inputValue());
  await page.locator('.questions details').nth(1).locator('summary').click();
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.questions details[open]').count(),1);
  await page.locator('#privacy-link').click();
  assert.equal(await page.locator('#privacy').evaluate(e=>e.open),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#privacy').evaluate(e=>e.open),false);
}
await page.goto(base+'/#oferta');await page.locator('#offer input').first().fill('Draft retained');
await page.locator('.languages a[lang="en"]').click();await page.waitForLoadState();
assert.equal(new URL(page.url()).pathname,'/en/');assert.equal(new URL(page.url()).hash,'#oferta');
assert.equal(await page.locator('#offer input').first().inputValue(),'Draft retained');
await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/en/');
assert.equal(await page.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationName),'none');
assert.equal(await page.locator('[data-reveal]').evaluateAll(es=>es.every(e=>getComputedStyle(e).opacity==='1')),true);
await page.emulateMedia({reducedMotion:'no-preference'});
assert.deepEqual(errors,[]);
fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({base,matrix,checks:['18 responsive RO/EN cases','3 main sections','no horizontal overflow','original images and matching crops','fonts loaded locally','reveal and parallax','seamless marquee with pause/resume','mobile navigation, Escape and resize','quote validation, preview, email target and copy','FAQ accordion and privacy dialog','language change preserves anchor and draft','reduced motion','no JavaScript errors'],result:'PASS'},null,2));
console.log('PASS: responsive RO/EN, navigation, animation, quote flow and accessibility checks.');
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
