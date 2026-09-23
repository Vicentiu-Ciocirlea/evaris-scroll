document.documentElement.classList.add('js');

const redirectHosts=['www.evaris.ro','e-ssm.ro','www.e-ssm.ro','e-su.ro','www.e-su.ro'];
if(redirectHosts.includes(location.hostname.toLowerCase())) location.replace('https://evaris.ro'+location.pathname+location.search+location.hash);

const english=document.documentElement.lang==='en';
const labels=english
  ?{open:'Open menu',close:'Close menu',heading:'QUOTE REQUEST — EVARIS CONSULTING',subject:'Quote request — Evaris Consulting',ready:'Your enquiry is ready to review. Open your email app or copy the message; it has not been sent.',email:'Your browser will try to open your email app. Review the message and press Send there. If it does not open, copy the message to office@evaris.ro.',copied:'Message copied. Paste it into an email to office@evaris.ro.',copyFallback:'Select the message and copy it using your device’s copy command.',pause:'Pause animation',resume:'Resume animation'}
  :{open:'Deschide meniul',close:'Închide meniul',heading:'CERERE DE OFERTĂ — EVARIS CONSULTING',subject:'Cerere de ofertă — Evaris Consulting',ready:'Cererea este pregătită pentru verificare. Deschide e-mailul sau copiază mesajul; acesta nu a fost trimis.',email:'Browserul va încerca să deschidă aplicația de e-mail. Verifică mesajul și apasă Trimite acolo. Dacă nu se deschide, copiază mesajul către office@evaris.ro.',copied:'Mesaj copiat. Lipește-l într-un e-mail către office@evaris.ro.',copyFallback:'Selectează mesajul și copiază-l folosind comanda de copiere a dispozitivului.',pause:'Oprește animația',resume:'Reia animația'};

const header=document.querySelector('header');
const progress=document.querySelector('.scroll-progress span');
const menu=document.querySelector('.menu');
const nav=document.querySelector('nav');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile=window.matchMedia('(max-width: 1000px)');
const parallaxElements=[...document.querySelectorAll('[data-parallax]')];
const backgroundElements=[document.querySelector('main'),document.querySelector('footer')];
let ticking=false;
function updateScroll(){
  const y=window.scrollY;
  const max=document.documentElement.scrollHeight-window.innerHeight;
  if(progress)progress.style.transform=`scaleX(${Math.max(0,Math.min(1,max?y/max:0))})`;
  if(header)header.classList.toggle('sticky',y>28);
  for(const el of parallaxElements){
    if(reducedMotion.matches){el.style.removeProperty('--parallax');continue;}
    const rect=el.parentElement.getBoundingClientRect();
    if(rect.bottom>0&&rect.top<window.innerHeight){
      const speed=Number(el.dataset.parallax)||0;
      el.style.setProperty('--parallax',`${Math.max(-55,Math.min(55,(rect.top-window.innerHeight/2)*speed))}px`);
    }
  }
  ticking=false;
}
function scheduleScroll(){if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}}
window.addEventListener('scroll',scheduleScroll,{passive:true});
window.addEventListener('resize',scheduleScroll);
reducedMotion.addEventListener('change',scheduleScroll);
updateScroll();

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:.08});
  document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
}else document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('is-visible'));

function setMenu(open,restoreFocus=false){
  if(!menu||!nav)return;
  open=open&&mobile.matches;
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?labels.close:labels.open);
  nav.classList.toggle('open',open);
  document.body.classList.toggle('menu-open',open);
  for(const el of backgroundElements)if(el)el.inert=open;
  if(open)nav.querySelector('a')?.focus({preventScroll:true});
  else if(restoreFocus)menu.focus({preventScroll:true});
}
menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
header?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
mobile.addEventListener('change',()=>{
  const focusInNav=nav?.contains(document.activeElement);
  setMenu(false);
  if(mobile.matches&&focusInNav)menu?.focus({preventScroll:true});
});
window.addEventListener('pageshow',()=>setMenu(false));
document.addEventListener('keydown',e=>{
  if(menu?.getAttribute('aria-expanded')!=='true')return;
  if(e.key==='Escape'){e.preventDefault();setMenu(false,true);}
  if(e.key==='Tab'){
    const controls=[...header.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);
    const index=controls.indexOf(document.activeElement);
    if(e.shiftKey&&index<=0){e.preventDefault();controls.at(-1)?.focus();}
    else if(!e.shiftKey&&index===controls.length-1){e.preventDefault();controls[0]?.focus();}
  }
});

const ticker=document.querySelector('.ticker-track');
const tickerToggle=document.querySelector('.ticker-toggle');
tickerToggle?.addEventListener('click',()=>{
  const paused=ticker.classList.toggle('paused');
  tickerToggle.setAttribute('aria-pressed',String(paused));
  tickerToggle.setAttribute('aria-label',paused?labels.resume:labels.pause);
  tickerToggle.textContent=paused?'▶':'Ⅱ';
});

const offer=document.getElementById('offer');
const fields=offer?[...offer.querySelectorAll('input,select,textarea[name]')]:[];
const status=document.getElementById('form-status');
const preview=document.getElementById('quote-preview');
function invalidatePreview(){if(preview)preview.hidden=true;if(status)status.textContent='';}
offer?.addEventListener('input',invalidatePreview);
offer?.addEventListener('change',invalidatePreview);
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{
  const select=offer?.querySelector('select');
  if(select&&[...select.options].some(o=>o.value===a.dataset.service)){select.value=a.dataset.service;invalidatePreview();}
}));

try{
  const draft=JSON.parse(sessionStorage.getItem('evaris-enquiry-draft')||'null');
  if(draft&&Date.now()-draft.time<30*60*1000&&Array.isArray(draft.fields))fields.forEach((el,i)=>{
    if(el.tagName==='SELECT')el.selectedIndex=Number(draft.fields[i])||0;
    else if(typeof draft.fields[i]==='string')el.value=draft.fields[i];
  });
  sessionStorage.removeItem('evaris-enquiry-draft');
}catch{}
document.querySelectorAll('.languages a').forEach(a=>{
  if(a.getAttribute('aria-current'))return;
  a.addEventListener('click',()=>{
    a.href=new URL(a.getAttribute('href'),location.origin).pathname+location.search+location.hash;
    try{sessionStorage.setItem('evaris-enquiry-draft',JSON.stringify({time:Date.now(),fields:fields.map(el=>el.tagName==='SELECT'?el.selectedIndex:el.value)}));}catch{}
  });
});

document.querySelectorAll('.questions details').forEach(detail=>detail.addEventListener('toggle',()=>{
  if(detail.open)document.querySelectorAll('.questions details').forEach(other=>{if(other!==detail)other.open=false;});
}));

offer?.addEventListener('submit',e=>{
  e.preventDefault();
  if(!offer.reportValidity())return;
  const text=labels.heading+'\n\n'+Array.from(new FormData(offer),([k,v])=>k+': '+String(v).trim()).join('\n');
  document.getElementById('quote-message').value=text;
  document.getElementById('open-email').href='mailto:office@evaris.ro?subject='+encodeURIComponent(labels.subject)+'&body='+encodeURIComponent(text);
  preview.hidden=false;
  status.textContent=labels.ready;
  document.getElementById('quote-message').focus({preventScroll:true});
  preview.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});
});
document.getElementById('open-email')?.addEventListener('click',()=>{status.textContent=labels.email;});
document.getElementById('copy-quote')?.addEventListener('click',async()=>{
  const message=document.getElementById('quote-message');
  try{await navigator.clipboard.writeText(message.value);status.textContent=labels.copied;}
  catch{message.focus();message.select();status.textContent=labels.copyFallback;}
});

const privacy=document.getElementById('privacy');
const privacyLink=document.getElementById('privacy-link');
const privacyClose=document.getElementById('close-privacy');
if(privacy&&privacyLink&&privacyClose){
  privacyLink.addEventListener('click',e=>{e.preventDefault();privacy.showModal();});
  privacyClose.addEventListener('click',()=>privacy.close());
  privacy.addEventListener('click',e=>{
    const r=privacy.getBoundingClientRect();
    if(e.target===privacy&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))privacy.close();
  });
}
