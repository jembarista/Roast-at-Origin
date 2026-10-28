/* Result reveal uses the same continuous, fully visible console slide as roasting. */
(() => {
  const get = id => document.getElementById(id);
  let animations = [];
  function showSelectedView() {
    const view = get('resultView').value;
    const money = view !== 'carbon';
    const chosen = get('journeyChoice').value !== '' && ['money', 'carbon'].includes(view);
    const panel = get('resultsChoice');
    const button = chosen ? document.querySelector?.(`.result-card > button[data-value="${view}"]`) : null;
    const before = panel?.getBoundingClientRect?.();
    for (const animation of animations) animation.cancel();
    animations = [];
    document.body?.classList.toggle('result-focus', chosen);
    if (get('backToJourney')) get('backToJourney').hidden = !chosen;
    get('valuePanel').hidden = !chosen || !money;
    get('carbonPanel').hidden = !chosen || money;
    get('volumePanel').hidden = !chosen || money;
    get('resultResources').hidden = !chosen;
    get('viewResultsLink').href = money ? '#valuePanel' : '#carbonPanel';
    get('viewResultsLink').textContent = money ? 'See the money results ↓' : 'See the carbon results ↓';
    if (chosen && typeof window !== 'undefined') {
      window.scrollTo({top:0,behavior:'instant'});
      const after = panel?.getBoundingClientRect?.();
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!reduced && panel?.animate && before && after) {
        const x = before.left - after.left, y = before.top - after.top;
        const travel = [{transform:`translate(${x}px, ${y}px)`,opacity:1},{transform:'translate(0, 0)',opacity:1}];
        animations.push(panel.animate(travel,{duration:1350,easing:'cubic-bezier(.35,0,.2,1)'}));
      }
      button?.focus?.({preventScroll:true});
    }
  }
  get('resultView').addEventListener('change', showSelectedView);
  get('backToJourney')?.addEventListener('click', () => {
    get('resultView').value = '';
    get('resultView').dispatchEvent(new Event('change', {bubbles:true}));
    window.scrollTo({top:0,behavior:'instant'});
    get('roastChoiceHeading').focus({preventScroll:true});
  });
  showSelectedView();
})();
