(() => {
  const search = document.getElementById('leg-search');
  const count = document.getElementById('leg-count');
  const empty = document.getElementById('leg-empty');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const groups = [...document.querySelectorAll('[data-group]')];
  const acts = [...document.querySelectorAll('.leg-act')];
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const ro = document.documentElement.lang === 'ro';
  let filter = 'all';

  function update() {
    const query = normalize(search.value.trim());
    let total = 0;
    for (const act of acts) {
      const shown = (filter === 'all' || filter === act.dataset.domain) && normalize(act.dataset.search).includes(query);
      act.hidden = !shown;
      if (shown) total++;
    }
    for (const group of groups) group.hidden = !group.querySelector('.leg-act:not([hidden])');
    count.textContent = ro ? `${total} ${total === 1 ? 'act afișat' : 'acte afișate'}` : `${total} ${total === 1 ? 'act shown' : 'acts shown'}`;
    empty.hidden = total !== 0;
  }

  search.addEventListener('input', update);
  for (const button of buttons) button.addEventListener('click', () => {
    filter = button.dataset.filter;
    for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
    update();
  });
})();
