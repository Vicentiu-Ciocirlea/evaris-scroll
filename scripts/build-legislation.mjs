import fs from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const data = JSON.parse(fs.readFileSync(new URL('../data/legislation.json', import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const routes = { ro: '/legislatie/', en: '/en/legislation/' };
const pageRoutes = {
  services: { ro: '/servicii-ssm-psi-bucuresti/', en: '/en/ohs-fire-safety-bucharest/' },
  risks: { ro: '/evaluare-riscuri-bucuresti/', en: '/en/risk-assessment-bucharest/' },
  prices: { ro: '/preturi-servicii-ssm/', en: '/en/ohs-service-pricing/' },
  guide: { ro: '/ghid-ssm-firma-noua/', en: '/en/ohs-guide-new-business/' },
};

function fullTitle(act) {
  if (act.officialTitle) return act.officialTitle;
  const prefix = {
    Lege: 'Legea', HG: 'Hotărârea Guvernului', OUG: 'Ordonanța de urgență a Guvernului',
    Ordonanta: 'Ordonanța Guvernului', Ordin: 'Ordinul',
  }[act.type];
  if (!prefix) return act.title;
  return `${prefix} nr. ${act.number}/${act.year} — ${act.title}`;
}

function render(lang) {
  const ro = lang === 'ro';
  const home = ro ? '/' : '/en/';
  const t = ro ? {
    title: 'Legislație SSM, SU și PSI | EVARIS Consulting',
    description: 'Acte normative SSM, SU și PSI organizate pe domenii, cu trimiteri directe la Portalul Legislativ oficial.',
    skip: 'Sari la conținut', menu: 'Meniu', mainMenu: 'Meniul principal', language: 'Limba site-ului',
    quote: 'Solicită ofertă', back: 'Înapoi la pagina principală', pages: 'Pagini utile',
    primary: [['Servicii', '#servicii'], ['Exemple', '#exemple'], ['Cum lucrăm', '#colaborare'], ['SSM digital', '#digital'], ['Întrebări', '#intrebari'], ['Legislație', routes.ro]],
    secondary: [['Servicii SSM și PSI', 'services'], ['Evaluarea riscurilor', 'risks'], ['Prețuri', 'prices'], ['Ghid', 'guide'], ['Legislație', 'legislation']],
    eyebrow: 'BIBLIOTECĂ LEGISLATIVĂ', heading: 'Legislație SSM, SU și PSI',
    lead: 'Actele din proiectul nostru legislativ sunt organizate pe domenii. Selectează un act pentru a citi documentul direct în Portalul Legislativ.',
    search: 'Caută după număr sau denumire', searchLabel: 'Caută acte normative',
    all: 'Toate', ssm: 'Securitate și sănătate în muncă', su: 'Situații de urgență și PSI', conexe: 'Legislație conexă',
    results: n => `${n} ${n === 1 ? 'act afișat' : 'acte afișate'}`, empty: 'Nu am găsit acte pentru această căutare.',
    official: 'Deschide în Portalul Legislativ', update: act => `Formă consolidată la ${act.consolidationDate}, cu modificările ${act.amendingAct}`, missing: 'În proiect mai apare Ordinul nr. 3/2007 privind formularul FIAM. Nu îl includem între linkurile oficiale deoarece proiectul nu identifică o pagină verificată pe Portalul Legislativ.',
    footer: 'EVARIS Consulting · București, Sector 6',
  } : {
    title: 'Romanian OHS and Fire Safety Legislation | EVARIS',
    description: 'Romanian workplace and fire safety laws grouped by subject, with direct links to the official Legislative Portal.',
    skip: 'Skip to content', menu: 'Menu', mainMenu: 'Main menu', language: 'Site language',
    quote: 'Request a quote', back: 'Back to the home page', pages: 'Related pages',
    primary: [['Services', '#servicii'], ['Examples', '#exemple'], ['How we work', '#colaborare'], ['Digital safety', '#digital'], ['FAQs', '#intrebari'], ['Legislation', routes.en]],
    secondary: [['OHS & fire safety', 'services'], ['Risk assessment', 'risks'], ['Pricing', 'prices'], ['Guide', 'guide'], ['Legislation', 'legislation']],
    eyebrow: 'LEGAL LIBRARY', heading: 'Workplace and fire safety legislation',
    lead: 'Browse the acts collected in our legislation project. Select an act to read its official Romanian text in the Legislative Portal.',
    search: 'Search by number or title', searchLabel: 'Search legislation',
    all: 'All', ssm: 'Occupational health and safety', su: 'Fire safety and emergencies', conexe: 'Related legislation',
    results: n => `${n} ${n === 1 ? 'act shown' : 'acts shown'}`, empty: 'No acts match your search.',
    official: 'Open in the Legislative Portal', update: act => `Consolidated text as of ${act.consolidationDate}, including ${act.amendingAct}`, missing: 'The source project also lists Order no. 3/2007 on the FIAM accident form. It is not linked here because the project does not identify a verified page in the Legislative Portal.',
    footer: 'EVARIS Consulting · Bucharest, Sector 6',
  };
  const primary = t.primary.map(([label, target]) => `<a href="${target.startsWith('/') ? target : home + target}"${target === routes[lang] ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('');
  const secondary = t.secondary.map(([label, id]) => `<a href="${id === 'legislation' ? routes[lang] : pageRoutes[id][lang]}"${id === 'legislation' ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('');
  const categories = [
    ['ssm', t.ssm], ['su', t.su], ['conexe', t.conexe],
  ];
  const groups = categories.map(([domain, label]) => {
    const items = data.acts.filter(act => act.group === domain);
    const links = items.map((act, index) => {
      const update = act.consolidationDate ? t.update(act) : '';
      return `<li class="leg-act" data-domain="${domain}" data-search="${esc(`${fullTitle(act)} ${act.code} ${update}`)}"><a href="${esc(act.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(`${fullTitle(act)}. ${update ? update + '. ' : ''}${t.official}`)}"><span class="leg-no">${String(index + 1).padStart(2, '0')}</span><span class="leg-act-body"><span class="leg-act-title">${esc(fullTitle(act))}</span>${update ? `<span class="leg-act-update">${esc(update)}</span>` : ''}<span class="leg-act-meta">${esc(act.code)} <span aria-hidden="true">·</span> legislatie.just.ro</span></span><span class="leg-arrow" aria-hidden="true">↗</span></a></li>`;
    }).join('');
    return `<section class="leg-group" data-group="${domain}" aria-labelledby="leg-${domain}"><div class="leg-group-head"><h2 id="leg-${domain}">${esc(label)}</h2><span>${items.length}</span></div><ol class="leg-list">${links}</ol></section>`;
  }).join('');
  const filters = [['all', t.all], ...categories].map(([key, label]) => `<button type="button" data-filter="${key}" aria-pressed="${key === 'all'}">${esc(label)}</button>`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t.title)}</title><meta name="robots" content="noindex, nofollow"><meta name="description" content="${esc(t.description)}"><link rel="canonical" href="https://evaris.ro${routes[lang]}"><link rel="alternate" hreflang="ro" href="https://evaris.ro${routes.ro}"><link rel="alternate" hreflang="en" href="https://evaris.ro${routes.en}"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/seo-pages.css"><link rel="stylesheet" href="/legislation.css"><script defer src="/legislation.js"></script></head>
<body class="seo-page leg-page"><a class="skip" href="#main">${t.skip}</a>
<header class="seo-header"><a class="brand" href="${home}" aria-label="${ro ? 'Evaris, pagina principală' : 'Evaris, home page'}"><span class="mark">e</span><span>evaris</span><b>.</b></a><nav class="seo-primary-nav" aria-label="${t.mainMenu}">${primary}</nav><div class="languages" aria-label="${t.language}"><a href="${routes.ro}" lang="ro" ${ro ? 'aria-current="page"' : ''}>RO</a><a href="${routes.en}" lang="en" ${!ro ? 'aria-current="page"' : ''}>EN</a></div><a class="button small seo-header-cta" href="${home}#oferta">${t.quote} <span aria-hidden="true">↗</span></a><details class="seo-mobile-menu"><summary>${t.menu} <span aria-hidden="true">☰</span></summary><nav aria-label="${t.mainMenu}">${primary}<a href="${home}#oferta">${t.quote}</a></nav></details></header>
<div class="seo-subnav"><a class="seo-back" href="${home}"><span aria-hidden="true">←</span> ${t.back}</a><nav aria-label="${t.pages}">${secondary}</nav></div>
<main id="main"><section class="leg-hero"><p class="eyebrow"><span></span> ${t.eyebrow}</p><h1>${t.heading}</h1><p>${t.lead}</p></section>
<section class="leg-catalog" aria-label="${t.searchLabel}"><div class="leg-controls"><label for="leg-search">${t.searchLabel}</label><input id="leg-search" class="leg-search" type="search" placeholder="${t.search}" autocomplete="off"><div class="leg-filters" role="group" aria-label="${t.pages}">${filters}</div><p class="leg-count" id="leg-count" aria-live="polite">${t.results(data.acts.length)}</p></div><div class="leg-groups">${groups}</div><p id="leg-empty" class="leg-empty" hidden>${t.empty}</p><p class="leg-missing">${t.missing}</p></section></main>
<footer><a class="brand" href="${home}"><span class="mark">e</span><span>evaris</span><b>.</b></a><p>${t.footer}</p><span>© 2026 Evaris Consulting</span></footer></body></html>`;
}

if (data.acts.length !== 85 || data.acts.some(act => !/^https:\/\/legislatie\.just\.ro\/Public\/DetaliiDocument\/\d+$/.test(act.url))) {
  throw new Error('The legislation catalog must contain 85 verified official URLs.');
}
for (const lang of ['ro', 'en']) {
  const directory = new URL(`.${routes[lang]}`, dist);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(new URL('index.html', directory), render(lang), 'utf8');
}
