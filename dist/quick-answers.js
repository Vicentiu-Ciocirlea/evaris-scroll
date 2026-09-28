(() => {
  'use strict';

  const en = document.documentElement.lang.toLowerCase().startsWith('en');
  const root = en ? '/en/' : '/';
  const copy = en ? {
    launcher: 'Ask Evaris', close: 'Close answers', title: 'Quick answers',
    intro: 'Choose a question or write a few words about what you need.',
    note: 'Prepared answers · no live operator or AI',
    placeholder: 'Type a question…', send: 'Send',
    yourQuestion: 'Your question',
    fallback: 'I do not have a prepared answer for that question. Please contact Evaris for details.',
    contact: 'Email Evaris', phone: 'Call 0723 335 436', resize: 'Drag to resize'
  } : {
    launcher: 'Întreabă Evaris', close: 'Închide răspunsurile', title: 'Răspunsuri rapide',
    intro: 'Alege o întrebare sau scrie câteva cuvinte despre ce te interesează.',
    note: 'Răspunsuri pregătite · fără operator sau AI',
    placeholder: 'Scrie o întrebare…', send: 'Trimite',
    yourQuestion: 'Întrebarea ta',
    fallback: 'Nu am un răspuns pregătit pentru această întrebare. Contactează Evaris pentru detalii.',
    contact: 'Scrie către Evaris', phone: 'Sună la 0723 335 436', resize: 'Trage pentru redimensionare'
  };

  const topics = en ? [
    {question:'What services do you offer?', answer:'Evaris offers workplace safety (OHS/SSM), emergency and fire safety (SU/PSI), and occupational risk assessment. The exact services are tailored to your business.', link:'See the services', href:root+'ohs-fire-safety-bucharest/', terms:['service','ohs','ssm','fire safety','psi','su','training','instruction','outsourc']},
    {question:'What is the difference between OHS and fire safety?', answer:'OHS/SSM focuses on workplace risks, prevention and worker training. SU/PSI covers fire prevention and preparedness for emergencies. Evaris discusses both in relation to your activities.', link:'See the services', href:root+'ohs-fire-safety-bucharest/', terms:['difference between','ohs versus','ssm versus','what is psi','what is su']},
    {question:'How does risk assessment work?', answer:'We examine the actual activities, roles, equipment and working conditions, then document the risks and proposed prevention measures. Deliverables are agreed in the proposal.', link:'About risk assessment', href:root+'risk-assessment-bucharest/', terms:['risk','assessment','hazard','evaluat']},
    {question:'How much does it cost?', answer:'The price depends on your activities, employee count, roles, locations, existing documentation and the services requested. Evaris prepares a tailored proposal with the scope and cost.', link:'How pricing works', href:root+'ohs-service-pricing/', terms:['price','pricing','cost','fee','quote','offer','budget']},
    {question:'Where does a new business start?', answer:'Start by describing the work, roles, locations and equipment. Risk assessment, prevention measures, training and emergency arrangements can then be planned for your actual activities.', link:'Guide for new businesses', href:root+'ohs-guide-new-business/', terms:['new business','new company','start','startup','first employee','begin']},
    {question:'Where can I find legislation?', answer:'The legislation page groups OHS and fire safety acts and links to the official Romanian Legislative Portal. For requirements specific to your business, speak with a specialist.', link:'Browse legislation', href:root+'legislation/', terms:['law','legislation','regulation','legal','act','norm']},
    {question:'What documents can be prepared?', answer:'Depending on the agreed scope, the work may include risk assessment, a prevention and protection plan, role-specific instructions and training records. We first check what your business already has.', link:'See the services', href:root+'ohs-fire-safety-bucharest/', terms:['document','file','records','prevention plan','safety plan']},
    {question:'Can I request only a risk assessment?', answer:'Yes. The information and deliverables for a separate risk assessment are agreed according to the workplaces and roles being analysed.', link:'About risk assessment', href:root+'risk-assessment-bucharest/', terms:['only risk','just risk','separate assessment','one off assessment']},
    {question:'What information do you need for a quote?', answer:'Tell us what your business does, the employee count, main roles, locations, documents you already have and the services you are interested in. We clarify the rest together.', link:'Prepare a quote request', href:root+'#oferta', terms:['information for','details for','need for a quote','send for a quote','to get a quote']},
    {question:'Can we discuss online training?', answer:'Yes. Evaris can discuss digital documents and remote training options. The available method and scope are confirmed before contracting.', link:'Digital options', href:root+'#digital', terms:['online training','digital training','remote training','e-learning','electronic signing','online instruction']},
    {question:'When should a risk assessment be updated?', answer:'Speak with a specialist when activities, equipment, substances, spaces or roles change. The assessment should reflect current working conditions.', link:'About risk assessment', href:root+'risk-assessment-bucharest/', terms:['update assessment','review assessment','change risk','new equipment']},
    {question:'Can I see document examples?', answer:'The home page includes example documents for an agricultural mechanic. These are examples of structure and must be adapted and checked for each workplace.', link:'View examples', href:root+'#exemple', terms:['example','sample','template','agricultural mechanic']},
    {question:'How can I contact Evaris?', answer:'Call 0723 335 436 or email office@evaris.ro. You can also prepare a quote request on the home page; the site opens your email app for you to review and send it.', link:'Prepare a quote request', href:root+'#oferta', terms:['contact','email','phone','call','reach','address']}
  ] : [
    {question:'Ce servicii oferiți?', answer:'Evaris oferă servicii de securitate și sănătate în muncă (SSM), situații de urgență și prevenirea incendiilor (SU/PSI), precum și evaluarea riscurilor. Serviciile se stabilesc pentru activitatea firmei tale.', link:'Vezi serviciile', href:root+'servicii-ssm-psi-bucuresti/', terms:['servic','ssm','psi','su','instruir','protectia muncii','protecția muncii','externaliz']},
    {question:'Care este diferența dintre SSM și PSI?', answer:'SSM privește riscurile de la locul de muncă, prevenirea și instruirea lucrătorilor. SU/PSI privește prevenirea incendiilor și pregătirea pentru situații de urgență. Analizăm ambele în raport cu activitatea firmei.', link:'Vezi serviciile', href:root+'servicii-ssm-psi-bucuresti/', terms:['diferenta dintre','diferența dintre','ssm versus','ce este psi']},
    {question:'Cum se face evaluarea riscurilor?', answer:'Analizăm activitățile reale, posturile, echipamentele și condițiile de lucru, apoi documentăm riscurile și măsurile de prevenire propuse. Livrabilele se stabilesc în ofertă.', link:'Despre evaluarea riscurilor', href:root+'evaluare-riscuri-bucuresti/', terms:['risc','evaluar','pericol']},
    {question:'Cât costă serviciile?', answer:'Prețul depinde de activitate, numărul de angajați, posturi, puncte de lucru, documentația existentă și serviciile solicitate. Evaris pregătește o ofertă personalizată, cu lucrările și costul explicate.', link:'Cum se stabilește prețul', href:root+'preturi-servicii-ssm/', terms:['pret','preț','cost','tarif','ofert','buget']},
    {question:'De unde începe o firmă nouă?', answer:'Descrie activitatea, posturile, spațiile și echipamentele. În funcție de acestea se pot organiza evaluarea riscurilor, măsurile de prevenire, instruirea și activitățile SU/PSI.', link:'Ghid pentru firma nouă', href:root+'ghid-ssm-firma-noua/', terms:['firma noua','firmă nouă','incep','încep','deschid','primul angajat','start']},
    {question:'Unde găsesc legislația?', answer:'Pagina de legislație grupează acte SSM și SU/PSI și trimite către Portalul Legislativ oficial. Pentru obligațiile aplicabile activității tale, discută cu un specialist.', link:'Consultă legislația', href:root+'legislatie/', terms:['legisl','lege','norm','acte normative','hotarare','hotărâre']},
    {question:'Ce documente puteți pregăti?', answer:'În funcție de serviciile convenite, lucrările pot include evaluarea riscurilor, planul de prevenire și protecție, instrucțiuni proprii și evidențe pentru instruire. Verificăm mai întâi ce există deja în firmă.', link:'Vezi serviciile', href:root+'servicii-ssm-psi-bucuresti/', terms:['document','dosar','plan de prevenire','instructiuni proprii','instrucțiuni proprii','fise ssm','fișe ssm']},
    {question:'Pot solicita doar evaluarea riscurilor?', answer:'Da. Informațiile și livrabilele pentru o evaluare separată se stabilesc în funcție de locurile de muncă și posturile analizate.', link:'Despre evaluarea riscurilor', href:root+'evaluare-riscuri-bucuresti/', terms:['doar evaluarea','numai evaluarea','evaluare separata','evaluare separată','fara abonament','fără abonament']},
    {question:'Ce informații trebuie pentru ofertă?', answer:'Spune-ne activitatea firmei, numărul de angajați, posturile principale, punctele de lucru, documentele existente și serviciile dorite. Restul le clarificăm împreună.', link:'Pregătește cererea', href:root+'#oferta', terms:['informatii pentru oferta','informații pentru ofertă','date pentru ofert','trebuie pentru oferta','trimit pentru oferta']},
    {question:'Putem discuta despre instruire online?', answer:'Da. Evaris poate discuta opțiuni de documente digitale și instruire la distanță. Modalitatea disponibilă și serviciile incluse se confirmă înainte de contractare.', link:'Opțiuni digitale', href:root+'#digital', terms:['instruire online','instruire la distanta','instruire la distanță','digital','semnare electronica','semnare electronică']},
    {question:'Când se revizuiește evaluarea?', answer:'Discută cu specialistul când se schimbă activitățile, echipamentele, substanțele, spațiile sau posturile. Evaluarea trebuie să reflecte condițiile actuale de lucru.', link:'Despre evaluarea riscurilor', href:root+'evaluare-riscuri-bucuresti/', terms:['revizu','actualizare evaluare','actualizata evaluarea','actualizată evaluarea','schimbare riscuri','echipamente noi']},
    {question:'Pot vedea exemple de documente?', answer:'Pe pagina principală există exemple pentru postul de mecanic agricol. Sunt exemple de structură și trebuie adaptate și verificate pentru fiecare loc de muncă.', link:'Vezi exemplele', href:root+'#exemple', terms:['exempl','model','mecanic agricol']},
    {question:'Cum contactez Evaris?', answer:'Sună la 0723 335 436 sau scrie la office@evaris.ro. Poți pregăti și o cerere de ofertă pe pagina principală; o verifici și o trimiți din aplicația ta de e-mail.', link:'Pregătește cererea', href:root+'#oferta', terms:['contact','telefon','email','e-mail','adresa','adresă','sun']}
  ];

  const norm = value => value.toLocaleLowerCase(en ? 'en' : 'ro').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const match = value => {
    const query = ` ${norm(value)} `;
    let best = null;
    let high = 0;
    topics.forEach(topic => topic.terms.forEach(term => {
      const needle = norm(term);
      const found = needle.length <= 3 ? query.includes(` ${needle} `) : query.includes(needle);
      const score = found ? needle.length + (needle.includes(' ') ? 10 : 0) : 0;
      if (score > high) { best = topic; high = score; }
    }));
    return best;
  };

  const host = document.createElement('aside');
  host.className = 'evaris-chat';
  host.setAttribute('aria-label', copy.title);
  host.innerHTML = `<section class="evaris-chat-panel" id="evaris-chat-panel" aria-label="${copy.title}" hidden>
    <div class="evaris-chat-head"><div><strong>${copy.title}</strong><span>${copy.note}</span></div><button type="button" class="evaris-chat-close" aria-label="${copy.close}">×</button></div>
    <div class="evaris-chat-log" role="log" aria-live="polite" aria-relevant="additions"></div>
    <div class="evaris-chat-choices" aria-label="${copy.title}"></div>
    <form class="evaris-chat-form"><label class="evaris-chat-sr" for="evaris-chat-input">${copy.yourQuestion}</label><input id="evaris-chat-input" type="text" maxlength="220" autocomplete="off" placeholder="${copy.placeholder}" required><button type="submit">${copy.send}</button></form>
  </section><button type="button" class="evaris-chat-launcher" aria-expanded="false" aria-controls="evaris-chat-panel"><span aria-hidden="true">?</span>${copy.launcher}</button>`;
  document.body.append(host);

  const panel = host.querySelector('.evaris-chat-panel');
  const toggle = host.querySelector('.evaris-chat-launcher');
  const log = host.querySelector('.evaris-chat-log');
  const input = host.querySelector('input');
  const choices = host.querySelector('.evaris-chat-choices');
  const clamp = (value, low, high) => Math.max(low, Math.min(value, high));

  for (const edge of ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se']) {
    const grip = document.createElement('span');
    grip.className = `evaris-chat-grip evaris-chat-grip-${edge}`;
    grip.setAttribute('aria-hidden', 'true');
    grip.title = copy.resize;
    panel.append(grip);
    grip.addEventListener('pointerdown', event => {
      if (event.button !== 0 || panel.hidden) return;
      event.preventDefault();
      const start = panel.getBoundingClientRect();
      const origin = {x:event.clientX, y:event.clientY};
      panel.style.position = 'fixed';
      panel.style.left = `${start.left}px`;
      panel.style.top = `${start.top}px`;
      panel.style.width = `${start.width}px`;
      panel.style.height = `${start.height}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      grip.setPointerCapture(event.pointerId);
      document.body.classList.add('evaris-chat-resizing');

      const move = current => {
        const margin = 8;
        const minWidth = Math.min(280, innerWidth - 2 * margin);
        const minHeight = Math.min(280, innerHeight - 2 * margin);
        let left = start.left, right = start.right, top = start.top, bottom = start.bottom;
        if (edge.includes('w')) left = clamp(start.left + current.clientX - origin.x, margin, right - minWidth);
        if (edge.includes('e')) right = clamp(start.right + current.clientX - origin.x, left + minWidth, innerWidth - margin);
        if (edge.includes('n')) top = clamp(start.top + current.clientY - origin.y, margin, bottom - minHeight);
        if (edge.includes('s')) bottom = clamp(start.bottom + current.clientY - origin.y, top + minHeight, innerHeight - margin);
        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
        panel.style.width = `${right - left}px`;
        panel.style.height = `${bottom - top}px`;
      };
      const finish = () => {
        grip.removeEventListener('pointermove', move);
        grip.removeEventListener('pointerup', finish);
        grip.removeEventListener('pointercancel', finish);
        grip.removeEventListener('lostpointercapture', finish);
        document.body.classList.remove('evaris-chat-resizing');
      };
      grip.addEventListener('pointermove', move);
      grip.addEventListener('pointerup', finish);
      grip.addEventListener('pointercancel', finish);
      grip.addEventListener('lostpointercapture', finish);
    });
  }

  window.addEventListener('resize', () => {
    if (panel.style.position !== 'fixed') return;
    const rect = panel.getBoundingClientRect();
    const margin = 8;
    const width = Math.min(rect.width, innerWidth - 2 * margin);
    const height = Math.min(rect.height, innerHeight - 2 * margin);
    panel.style.width = `${width}px`;
    panel.style.height = `${height}px`;
    panel.style.left = `${clamp(rect.left, margin, innerWidth - margin - width)}px`;
    panel.style.top = `${clamp(rect.top, margin, innerHeight - margin - height)}px`;
  });
  const bubble = (text, type) => {
    const element = document.createElement('div');
    element.className = `evaris-chat-message evaris-chat-${type}`;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    element.append(paragraph);
    log.append(element);
    log.scrollTop = log.scrollHeight;
    return element;
  };
  bubble(copy.intro, 'answer');

  const respond = (question, topic) => {
    bubble(question, 'question');
    const answer = bubble(topic ? topic.answer : copy.fallback, 'answer');
    const link = document.createElement('a');
    link.href = topic ? topic.href : 'mailto:office@evaris.ro';
    link.textContent = topic ? topic.link : copy.contact;
    answer.append(link);
    if (!topic) {
      const phone = document.createElement('a');
      phone.href = 'tel:+40723335436';
      phone.textContent = copy.phone;
      answer.append(phone);
    }
    log.scrollTop = log.scrollHeight;
  };

  topics.forEach(topic => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = topic.question;
    button.addEventListener('click', () => respond(topic.question, topic));
    choices.append(button);
  });

  const setOpen = open => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus({preventScroll:true});
    else toggle.focus({preventScroll:true});
  };
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  host.querySelector('.evaris-chat-close').addEventListener('click', () => setOpen(false));
  host.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); setOpen(false); }
  });
  host.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    respond(question, match(question));
    input.value = '';
    input.focus();
  });
})();
