/* Configure one pathway at a time; both remain in the underlying comparison. */
(() => {
  const get = id => document.getElementById(id);
  let panelAnimations = [];
  function chooseJourney() {
    const choice = get('journeyChoice').value;
    const heading = get('roastChoiceHeading');
    const panel = heading.closest?.('.journey-choice');
    const selectedButton = choice ? document.querySelector?.(`.journey-card > button[data-value="${choice}"]`) : null;
    // Record the pressed control before setup collapses. Invert the layout change
    // immediately, so the same visible button travels continuously to its new spot.
    const before = (selectedButton || panel)?.getBoundingClientRect?.();
    for (const animation of panelAnimations) animation.cancel();
    panelAnimations = [];
    document.body.classList.toggle('roast-focus', Boolean(choice));
    get('backToSetup').hidden = !choice;
    get('greenJourney').hidden = choice !== 'green';
    get('roastedJourney').hidden = choice !== 'roasted';
    get('resultsChoice').hidden = !choice;
    get('journeyHint').textContent = '';
    get('resultView').dispatchEvent(new Event('change', { bubbles: true }));
    if (choice) {
      window.scrollTo({top:0,behavior:'instant'});
      const after = (selectedButton || panel)?.getBoundingClientRect?.();
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!reduced && panel?.animate && before && after) {
        const x = before.left - after.left, y = before.top - after.top;
        const travel = [
          {transform:`translate(${x}px, ${y}px)`,opacity:1},
          {transform:'translate(0, 0)',opacity:1}
        ];
        const timing = {duration:1350,easing:'cubic-bezier(.35,0,.2,1)'};
        panelAnimations.push(panel.animate(travel,timing));
        if (get('resultsChoice').animate) panelAnimations.push(get('resultsChoice').animate(travel,timing));
      }
      heading.focus({preventScroll:true});
    }
  }
  get('journeyChoice').addEventListener('change', chooseJourney);
  get('backToSetup').addEventListener('click', () => {
    get('journeyChoice').value = '';
    get('journeyChoice').dispatchEvent(new Event('change', {bubbles:true}));
    window.scrollTo({top:0,behavior:'instant'});
    get('mass').focus({preventScroll:true});
  });
  chooseJourney();
})();
