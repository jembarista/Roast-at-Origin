/* Button alternatives reuse the existing controls and their model listeners. */
(() => {
  for (const id of ['journeyChoice', 'resultView', 'tradMode', 'originMode', 'tradPack', 'originPack', 'econCurrency']) {
    const select = document.getElementById(id);
    if (!select) continue;
    const group = document.createElement('div');
    group.className = 'button-choices' + (id === 'resultView' ? ' lens-buttons' : '');
    group.setAttribute('role', 'group');
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) {
      label.id = `${id}Label`;
      group.setAttribute('aria-labelledby', label.id);
      // Keep the label visible without pointing to an inaccessible control.
      label.removeAttribute('for');
    }
    if (select.getAttribute('aria-describedby')) group.setAttribute('aria-describedby', select.getAttribute('aria-describedby'));
    const buttons = Array.from(select.options).filter(option => !option.disabled).map(option => {
      const button = document.createElement('button');
      button.type = 'button';button.textContent = option.textContent;
      button.dataset.value = option.value;
      button.addEventListener('click', () => {
        select.value = option.value;
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
        sync();
      });
      group.appendChild(button);
      return button;
    });
    function sync() {
      for (const button of buttons) button.setAttribute('aria-pressed', String(select.value === button.dataset.value));
    }
    select.insertAdjacentElement('afterend', group);
    if (id === 'journeyChoice') {
      group.classList.add('journey-card-grid');
      for (const button of buttons) {
        const card = document.createElement('div');
        card.className = 'journey-card';
        button.before(card);
        card.appendChild(button);
        button.setAttribute('aria-expanded', 'false');
        const panel = document.getElementById(button.dataset.value === 'green' ? 'greenJourney' : 'roastedJourney');
        button.setAttribute('aria-controls', panel.id);
        card.appendChild(panel);
      }
      const updateCards = () => {
        for (const button of buttons) {
          const selected = select.value === button.dataset.value;
          button.setAttribute('aria-expanded', String(selected));
          button.parentElement.classList.toggle('expanded', selected);
        }
      };
      select.addEventListener('change', updateCards);
      updateCards();
    }
    if (id === 'resultView') {
      group.classList.add('result-card-grid');
      for (const button of buttons) {
        const card = document.createElement('div');
        card.className = 'result-card';
        button.before(card);
        card.appendChild(button);
        const panel = document.getElementById(button.dataset.value === 'money' ? 'valuePanel' : 'carbonPanel');
        button.setAttribute('aria-controls', panel.id);
        card.appendChild(panel);
        if (button.dataset.value === 'carbon') card.appendChild(document.getElementById('volumePanel'));
      }
      const updateResultCards = () => {
        for (const button of buttons) {
          const selected = select.value === button.dataset.value;
          button.setAttribute('aria-expanded', String(selected));
          button.parentElement.classList.toggle('expanded', selected);
        }
      };
      select.addEventListener('change', updateResultCards);
      updateResultCards();
    }
    select.hidden = true;
    select.addEventListener('input', sync);
    select.addEventListener('change', sync);
    // Existing presets and reset assign values programmatically.
    for (const trigger of document.querySelectorAll('.tab, #reset, #econExample')) trigger.addEventListener('click', sync);
    sync();
  }
})();
