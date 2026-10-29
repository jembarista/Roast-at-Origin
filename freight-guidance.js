/* Explore transport alternatives while holding coffee, roasting and packaging fixed. */
(() => {
  const get = id => document.getElementById(id);
  let emissionsSeen = false;
  const modeLabels = { sea: 'dry sea', reefer: 'refrigerated sea', frozen: 'frozen sea (uncalibrated)', air: 'air' };
  const format = value => value.toLocaleString('en-GB', { maximumFractionDigits: 1 });
  const comparison = (value, reference) => {
    const difference = value - reference;
    if (Math.abs(difference) < .01) return 'about the same as';
    if (reference === 0) return `${format(Math.abs(difference))} kg CO₂e ${difference > 0 ? 'above' : 'below'}`;
    return `${format(Math.abs(difference / reference) * 100)}% ${difference > 0 ? 'above' : 'below'}`;
  };
  function fill(container, which) {
    container.replaceChildren();
    if (!window.last || get(which + 'Mode').value !== 'air') return;
    const current = window.last[which === 'origin' ? 'origin' : 'traditional'];
    const otherPrefix = which === 'origin' ? 'trad' : 'origin';
    const finishedPack = get(which + 'Pack').value;
    const otherLabel = which === 'origin' ? 'roasting at destination' : 'roasting at origin';
    const heading = document.createElement('h3');heading.textContent = ['sea','reefer'].some(mode => pathway(which,{mode}).total < current.total) ? 'Try a greener option?' : 'Compare another way to travel?';container.appendChild(heading);
    const intro = document.createElement('p');intro.textContent = 'Same roast. Different transport.';container.appendChild(intro);
    const options = document.createElement('div');options.className = 'freight-options';container.appendChild(options);
    for (const mode of ['sea', 'reefer']) {
      const alternative = pathway(which, { mode });
      const other = pathway(otherPrefix, {mode,pack:finishedPack});
      if (!Number.isFinite(alternative.total)) continue;
      const option = document.createElement('div');option.className = 'freight-option';
      const button = document.createElement('button');button.type = 'button';button.className = 'btn secondary';button.textContent = mode === 'sea' ? 'Try dry sea freight' : 'Try refrigerated sea freight';
      button.addEventListener('click', () => {
        const input = get(which + 'Mode');input.value = mode;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      option.appendChild(button);
      const detail = document.createElement('p');
      detail.textContent = `${format(alternative.total)} kg CO₂e for this journey: ${comparison(alternative.total, current.total)} your air option; ${comparison(alternative.total, other.total)} ${otherLabel} with the same freight and finished pack.`;
      option.appendChild(detail);options.appendChild(option);
    }
    const caveat = document.createElement('p');caveat.className = 'hint';caveat.textContent = 'Scenario estimates, not a guaranteed saving. Air and sea accounting boundaries still need aligning. Refrigerated sea is a generic reefer estimate, not validated frozen shipping. Check transit time, storage and coffee quality separately. This changes carbon assumptions, not financial freight quotes.';container.appendChild(caveat);
  }
  window.refreshFreightGuidance = () => {
    get('tradFreightGuide').replaceChildren();get('originFreightGuide').replaceChildren();
    const selected = get('journeyChoice').value;
    if (selected && emissionsSeen && get('resultView').value === 'carbon' && !get('carbonPanel').hidden) fill(get('carbonFreightGuide'), selected === 'roasted' ? 'origin' : 'trad');
    else get('carbonFreightGuide').replaceChildren();
    const comparison=window.last?.carbonComparison;
    get('carbonModeSummary').textContent = comparison?.mode
      ? `Both scenarios: ${modeLabels[comparison.mode]}. Same finished pack; green coffee travels in sacks, destination retail packing happens after roasting.`
      : `Destination → ${modeLabels[get('tradMode').value]}; origin → ${modeLabels[get('originMode').value]}.`;
  };
  get('journeyChoice').addEventListener('change', window.refreshFreightGuidance);
  get('resultView').addEventListener('change', window.refreshFreightGuidance);
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && get('resultView').value === 'carbon' && !get('carbonPanel').hidden && window.last) {
        emissionsSeen = true;
        window.refreshFreightGuidance();
      }
    }, { threshold: .15 });
    observer.observe(get('outcome'));
  } else {
    // Older browsers still place suggestions after the actual result in reading order.
    get('resultView').addEventListener('change', () => {
      if (get('resultView').value === 'carbon' && window.last) emissionsSeen = true;
      window.refreshFreightGuidance();
    });
  }
  window.refreshFreightGuidance();
})();
