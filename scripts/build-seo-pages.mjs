import fs from 'node:fs';
import path from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const slug = {
  services: ['servicii-ssm-psi-bucuresti', 'en/ohs-fire-safety-bucharest'],
  risks: ['evaluare-riscuri-bucuresti', 'en/risk-assessment-bucharest'],
  prices: ['preturi-servicii-ssm', 'en/ohs-service-pricing'],
  guide: ['ghid-ssm-firma-noua', 'en/ohs-guide-new-business'],
};
const href = (key, lang) => `/${slug[key][lang === 'ro' ? 0 : 1]}/`;
const escapeHtml = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const pages = {
  services: {
    ro: {
      title: 'Servicii SSM și PSI București | EVARIS Consulting',
      desc: 'Servicii SSM, protecția muncii și PSI pentru firme din București. Evaluarea riscurilor, documentație, instruire și o ofertă adaptată activității.',
      label: 'SERVICII PENTRU COMPANII DIN BUCUREȘTI',
      h1: 'Servicii SSM și PSI în București',
      intro: 'Organizăm prevenirea la locul de muncă pornind de la activitatea reală a firmei: posturi, echipamente, oameni și puncte de lucru. Primești o propunere clară pentru serviciile de care ai nevoie.',
      blocks: [
        ['Servicii SSM și externalizare', 'Stabilim activitățile necesare după ce înțelegem cum lucrează echipa. În funcție de situație, colaborarea poate include evaluarea riscurilor, planul de prevenire și protecție, documentația SSM, instrucțiuni proprii, organizarea instruirii și consultanță pentru schimbările din firmă. Serviciile externalizate și livrabilele exacte se precizează în ofertă.'],
        ['Situații de urgență și PSI', 'Analizăm activitatea și documentele existente, apoi stabilim măsurile, responsabilitățile și instruirea necesare pentru prevenirea incendiilor și răspunsul în situații de urgență. Dacă ai deja documentație, identificăm ce trebuie revizuit.'],
        ['Cum începe colaborarea', 'Ne spui domeniul de activitate, numărul de angajați, posturile, punctele de lucru și ce servicii cauți. Clarificăm ce există deja, ce lipsește și ce implică vizite la sediu. Oferta descrie livrabilele, etapele și condițiile colaborării.'],
      ],
      related: [['Evaluarea riscurilor', 'risks'], ['Prețuri și ofertare', 'prices'], ['Ghid pentru firma nouă', 'guide']],
      cta: 'Solicită o ofertă',
    },
    en: {
      title: 'Workplace and Fire Safety Services in Bucharest | EVARIS',
      desc: 'Occupational health and safety, risk assessment and fire safety support for companies in Bucharest. Request a proposal tailored to your activities.',
      label: 'SERVICES FOR BUSINESSES IN BUCHAREST',
      h1: 'Workplace and fire safety services in Bucharest',
      intro: 'We organise prevention around the work your company actually does: roles, equipment, people and locations. You receive a clear proposal for the services you need.',
      blocks: [
        ['Occupational health and safety', 'After learning how your team works, we define the necessary activities. Depending on your circumstances, these may include risk assessment, a prevention and protection plan, company specific instructions, training arrangements and advice when operations change. The exact scope is set out in the proposal.'],
        ['Emergency preparedness and fire safety', 'We review your activities and existing documents, then agree on measures, responsibilities and training for fire prevention and emergency response. If documentation already exists, we identify what needs updating.'],
        ['How we get started', 'Tell us your industry, employee count, roles, work locations and the services you need. We clarify what is in place, what is missing and whether site visits are needed. The proposal describes deliverables, stages and terms.'],
      ],
      related: [['Risk assessment', 'risks'], ['Pricing and proposals', 'prices'], ['Guide for new businesses', 'guide']],
      cta: 'Request a proposal',
    },
  },
  risks: {
    ro: {
      title: 'Evaluarea riscurilor de accidentare București | EVARIS',
      desc: 'Evaluarea riscurilor profesionale pentru posturi și locuri de muncă din București. Identificăm factorii de risc și formulăm măsuri concrete de prevenire.',
      label: 'EVALUAREA RISCURILOR PROFESIONALE',
      h1: 'Evaluarea riscurilor de accidentare în București',
      intro: 'O evaluare utilă descrie activitatea reală și arată ce măsuri trebuie luate. Analizăm locurile de muncă, sarcinile și echipamentele, apoi documentăm riscurile și soluțiile de prevenire.',
      blocks: [
        ['Ce analizăm', 'Pornim de la posturi, procese, echipamente și condițiile din spațiile de lucru. Discutăm cu persoanele care cunosc activitatea și examinăm documentele existente. Metoda și profunzimea analizei depind de specificul firmei.'],
        ['Ce primești', 'Livrabilele se stabilesc în ofertă. Acestea pot include documentul de evaluare pentru posturile convenite, măsurile propuse și informațiile necesare planului de prevenire și protecție. Îți explicăm concluziile pentru ca documentele să poată fi folosite în activitatea zilnică.'],
        ['Când se revizuiește', 'Discută cu specialistul când apar activități, utilaje, substanțe, spații sau posturi noi ori când se schimbă modul de lucru. Evaluarea trebuie să reflecte condițiile în care lucrează oamenii acum.'],
      ],
      related: [['Servicii SSM și PSI', 'services'], ['Prețuri și ofertare', 'prices'], ['Ghid pentru firma nouă', 'guide']],
      cta: 'Cere evaluarea riscurilor',
    },
    en: {
      title: 'Workplace Risk Assessment in Bucharest | EVARIS',
      desc: 'Risk assessment for roles and workplaces in Bucharest. We identify hazards and define practical prevention measures.',
      label: 'OCCUPATIONAL RISK ASSESSMENT',
      h1: 'Workplace risk assessment in Bucharest',
      intro: 'A useful assessment reflects real work and leads to clear action. We review workplaces, tasks and equipment, then document risks and appropriate prevention measures.',
      blocks: [
        ['What we review', 'We start with roles, processes, equipment and working conditions. We speak with people familiar with the work and review existing documents. The method and depth of analysis depend on your business activities.'],
        ['What you receive', 'Deliverables are defined in the proposal. They may include assessment documents for agreed roles, proposed measures and inputs for the prevention and protection plan. We explain the findings so the documents can support daily decisions.'],
        ['When to revisit the assessment', 'Speak with a specialist when activities, machinery, substances, premises or roles change, or when work is organised differently. The assessment should reflect current working conditions.'],
      ],
      related: [['Workplace and fire safety services', 'services'], ['Pricing and proposals', 'prices'], ['Guide for new businesses', 'guide']],
      cta: 'Request a risk assessment',
    },
  },
  prices: {
    ro: {
      title: 'Prețuri servicii SSM și PSI București | EVARIS',
      desc: 'Cum se stabilește prețul pentru servicii SSM, PSI și evaluarea riscurilor în București. Află ce date sunt necesare pentru o ofertă clară.',
      label: 'OFERTARE TRANSPARENTĂ',
      h1: 'Prețuri pentru servicii SSM și PSI',
      intro: 'Tariful depinde de activitatea firmei și de lucrările incluse. Îți spunem ce informații sunt necesare și îți pregătim o ofertă în care serviciile și costurile sunt explicitate.',
      blocks: [
        ['Ce influențează prețul', 'Contează numărul de angajați și de posturi, natura riscurilor, punctele de lucru, documentația existentă, frecvența activităților și combinația de servicii SSM, SU/PSI sau evaluare a riscurilor. O evaluare punctuală și o colaborare continuă se ofertează diferit.'],
        ['Ce conține oferta', 'Propunerea precizează serviciile, livrabilele, activitățile care necesită deplasare, etapele de lucru și costul. Pentru serviciile recurente, stabilim clar ce intră în colaborarea lunară și ce se ofertează separat.'],
        ['Ce date ne trimiți', 'Domeniul de activitate, numărul de angajați, posturile principale, adresele punctelor de lucru, documentele SSM/SU existente și serviciile dorite. Dacă nu știi exact ce îți lipsește, descrie activitatea și clarificăm împreună.'],
      ],
      related: [['Servicii SSM și PSI', 'services'], ['Evaluarea riscurilor', 'risks'], ['Ghid pentru firma nouă', 'guide']],
      cta: 'Solicită o ofertă personalizată',
    },
    en: {
      title: 'OHS and Fire Safety Service Pricing | EVARIS Bucharest',
      desc: 'Understand how workplace safety, fire safety and risk assessment services are priced in Bucharest. Request a clear proposal for your company.',
      label: 'CLEAR PROPOSALS',
      h1: 'Pricing for workplace and fire safety services',
      intro: 'The price depends on your activities and the work included. We explain what information is needed and provide a proposal with a defined scope and cost.',
      blocks: [
        ['What affects the price', 'Employee count and roles, the nature of the risks, work locations, existing documentation, service frequency and the mix of OHS, fire safety and risk assessment all matter. A one time assessment and ongoing support are priced differently.'],
        ['What the proposal includes', 'We describe the services, deliverables, site visits, work stages and cost. For ongoing work, the proposal makes clear what is included each month and what would require a separate quote.'],
        ['What we need from you', 'Share your business activity, employee count, main roles, work locations, existing safety documents and the services you need. If you are unsure what is missing, describe your work and we will clarify the scope together.'],
      ],
      related: [['Services in Bucharest', 'services'], ['Risk assessment', 'risks'], ['Guide for new businesses', 'guide']],
      cta: 'Request a tailored quote',
    },
  },
  guide: {
    ro: {
      title: 'SSM pentru firmă nouă: de unde începi | EVARIS',
      desc: 'Ghid practic pentru organizarea SSM într-o firmă nouă: activități, evaluarea riscurilor, documente, instruire și responsabilități.',
      label: 'GHID PRACTIC PENTRU ANGAJATORI',
      h1: 'SSM pentru o firmă nouă: de unde începi',
      intro: 'Înainte ca oamenii să înceapă lucrul, pune în ordine informațiile despre activitate, riscuri și instruire. Această listă te ajută să pregătești discuția cu un specialist și să stabilești ce se aplică firmei tale.',
      blocks: [
        ['1. Descrie activitatea și posturile', 'Notează ce face fiecare echipă, unde lucrează, ce echipamente utilizează și dacă există deplasări, lucru la înălțime, substanțe sau alte condiții speciale. Aceste informații sunt baza organizării SSM și a evaluării riscurilor.'],
        ['2. Evaluează riscurile și stabilește măsurile', 'Riscurile se analizează pentru activitățile și locurile de muncă relevante. Din concluzii rezultă măsuri de prevenire și protecție care trebuie planificate, aplicate și urmărite. Documentele se adaptează condițiilor reale.'],
        ['3. Organizează instruirea și evidențele', 'Stabilește cine instruiește lucrătorii, ce informații sunt specifice fiecărui post și cum se păstrează dovada instruirii. Instruirea trebuie să fie adecvată activității, iar schimbările de post sau proces pot necesita actualizări.'],
        ['4. Verifică și componenta SU/PSI', 'Analizează spațiile și responsabilitățile privind prevenirea incendiilor și situațiile de urgență. Cerințele concrete depind de activitatea și amplasamentul firmei; discută-le împreună cu serviciile SSM.'],
      ],
      note: 'Pentru obligațiile aplicabile, consultă <a href="https://legislatie.just.ro/Public/DetaliiDocument/73772" target="_blank" rel="noopener">Legea nr. 319/2006</a> și informațiile <a href="https://www.inspectiamuncii.ro/" target="_blank" rel="noopener">Inspecției Muncii</a>. Ghidul este orientativ; cerințele se stabilesc după activitatea concretă.',
      related: [['Servicii SSM și PSI', 'services'], ['Evaluarea riscurilor', 'risks'], ['Cum ceri o ofertă', 'prices']],
      cta: 'Discută organizarea SSM',
    },
    en: {
      title: 'OHS for a New Business: Where to Start | EVARIS',
      desc: 'A practical guide to setting up workplace safety in a new Romanian business: activities, risks, documents, training and responsibilities.',
      label: 'PRACTICAL GUIDE FOR EMPLOYERS',
      h1: 'Workplace safety for a new business',
      intro: 'Before people start work, organise information about your activities, risks and training. This checklist helps you prepare for a discussion with a specialist and identify what applies to your business.',
      blocks: [
        ['1. Describe the work and roles', 'List what each team does, where they work, the equipment they use and any travel, work at height, substances or other special conditions. This is the starting point for organising safety and assessing risks.'],
        ['2. Assess risks and define measures', 'Assess risks for relevant activities and workplaces. Use the findings to plan, apply and monitor prevention and protection measures. Documents should reflect actual working conditions.'],
        ['3. Arrange training and records', 'Decide who trains workers, what information is specific to each role and how training is recorded. Training should match the work, and changes in roles or processes may require updates.'],
        ['4. Review fire and emergency arrangements', 'Consider your premises and responsibilities for fire prevention and emergency response. Specific requirements depend on your business and location; review them alongside workplace safety.'],
      ],
      note: 'For applicable duties, consult <a href="https://legislatie.just.ro/Public/DetaliiDocument/73772" target="_blank" rel="noopener">Romanian Law 319/2006</a> and the <a href="https://www.inspectiamuncii.ro/" target="_blank" rel="noopener">Labour Inspection</a>. This guide is introductory; requirements depend on your activities.',
      related: [['Workplace and fire safety services', 'services'], ['Risk assessment', 'risks'], ['How to request a quote', 'prices']],
      cta: 'Discuss safety for your business',
    },
  },
};

function render(key, lang) {
  const p = pages[key][lang], ro = lang === 'ro', home = ro ? '/' : '/en/';
  const sections = p.blocks.map(([h, body]) => `<section><h2>${escapeHtml(h)}</h2><p>${escapeHtml(body)}</p></section>`).join('');
  const related = p.related.map(([label, id]) => `<a href="${href(id, lang)}">${escapeHtml(label)} <span aria-hidden="true">↗</span></a>`).join('');
  const primaryItems = ro
    ? [['Servicii', '#servicii'], ['Exemple', '#exemple'], ['Cum lucrăm', '#colaborare'], ['SSM digital', '#digital'], ['Întrebări', '#intrebari'], ['Legislație', '/legislatie/']]
    : [['Services', '#servicii'], ['Examples', '#exemple'], ['How we work', '#colaborare'], ['Digital safety', '#digital'], ['FAQs', '#intrebari'], ['Legislation', '/en/legislation/']];
  const primaryLinks = primaryItems.map(([label, target]) => `<a href="${target.startsWith('/') ? target : home + target}">${label}</a>`).join('');
  const secondaryItems = ro
    ? [['Servicii SSM și PSI', 'services'], ['Evaluarea riscurilor', 'risks'], ['Prețuri', 'prices'], ['Ghid', 'guide'], ['Legislație', 'legislation']]
    : [['OHS & fire safety', 'services'], ['Risk assessment', 'risks'], ['Pricing', 'prices'], ['Guide', 'guide'], ['Legislation', 'legislation']];
  const secondaryLinks = secondaryItems.map(([label, id]) => `<a href="${id === 'legislation' ? (ro ? '/legislatie/' : '/en/legislation/') : href(id, lang)}"${id === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(p.title)}</title><meta name="robots" content="noindex, nofollow"><meta name="description" content="${escapeHtml(p.desc)}"><link rel="canonical" href="https://evaris.ro${href(key, lang)}"><link rel="alternate" hreflang="ro" href="https://evaris.ro${href(key, 'ro')}"><link rel="alternate" hreflang="en" href="https://evaris.ro${href(key, 'en')}"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/seo-pages.css"></head>
<body class="seo-page"><a class="skip" href="#main">${ro ? 'Sari la conținut' : 'Skip to content'}</a>
<header class="seo-header"><a class="brand" href="${home}" aria-label="${ro ? 'Evaris, pagina principală' : 'Evaris, home page'}"><span class="mark">e</span><span>evaris</span><b>.</b></a><nav class="seo-primary-nav" aria-label="${ro ? 'Meniul principal' : 'Main menu'}">${primaryLinks}</nav><div class="languages" aria-label="${ro ? 'Limba site-ului' : 'Site language'}"><a href="${href(key, 'ro')}" lang="ro" ${ro ? 'aria-current="page"' : ''}>RO</a><a href="${href(key, 'en')}" lang="en" ${!ro ? 'aria-current="page"' : ''}>EN</a></div><a class="button small seo-header-cta" href="${home}#oferta">${ro ? 'Solicită ofertă' : 'Request a quote'} <span aria-hidden="true">↗</span></a><details class="seo-mobile-menu"><summary>${ro ? 'Meniu' : 'Menu'} <span aria-hidden="true">☰</span></summary><nav aria-label="${ro ? 'Meniul principal' : 'Main menu'}">${primaryLinks}<a href="${home}#oferta">${ro ? 'Solicită ofertă' : 'Request a quote'}</a></nav></details></header>
<div class="seo-subnav"><a class="seo-back" href="${home}"><span aria-hidden="true">←</span> ${ro ? 'Înapoi la pagina principală' : 'Back to the home page'}</a><nav aria-label="${ro ? 'Pagini de servicii' : 'Service pages'}">${secondaryLinks}</nav></div>
<main id="main"><div class="seo-hero"><p class="eyebrow"><span></span> ${escapeHtml(p.label)}</p><h1>${escapeHtml(p.h1)}</h1><p class="seo-lead">${escapeHtml(p.intro)}</p><a class="button lime" href="${home}#oferta">${escapeHtml(p.cta)} <span aria-hidden="true">↗</span></a></div><div class="seo-content">${sections}${p.note ? `<aside class="seo-note">${p.note}</aside>` : ''}</div><section class="seo-related"><h2>${ro ? 'Pagini utile' : 'Related pages'}</h2><div>${related}</div></section><section class="seo-contact"><div><p class="eyebrow"><span></span> EVARIS CONSULTING · BUCUREȘTI</p><h2>${ro ? 'Spune-ne ce face firma ta.' : 'Tell us about your business.'}</h2><p>${ro ? 'Pregătim o propunere pentru serviciile de care ai nevoie.' : 'We will prepare a proposal for the services you need.'}</p></div><div><a href="${home}#oferta" class="button lime">${escapeHtml(p.cta)} <span aria-hidden="true">↗</span></a><a href="tel:+40723335436">0723 335 436</a><a href="mailto:office@evaris.ro">office@evaris.ro</a></div></section></main><footer><a class="brand" href="${home}"><span class="mark">e</span><span>evaris</span><b>.</b></a><p>EVARIS Consulting · București, Sector 6</p><span>© 2026 Evaris Consulting</span></footer></body></html>`;
}

for (const key of Object.keys(slug)) for (const lang of ['ro', 'en']) {
  const dir = new URL(`${slug[key][lang === 'ro' ? 0 : 1]}/`, dist);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(new URL('index.html', dir), render(key, lang), 'utf8');
}
