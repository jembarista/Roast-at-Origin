/* Configure one pathway at a time; both remain in the underlying comparison. */
(() => {
  const get = id => document.getElementById(id);
  function chooseJourney() {
    const choice = get('journeyChoice').value;
    get('greenJourney').hidden = choice !== 'green';
    get('roastedJourney').hidden = choice !== 'roasted';
    get('resultsChoice').hidden = !choice;
    get('journeyHint').textContent = choice
      ? 'Set up your journey inside the open card, then choose money or carbon. Both journeys stay in the comparison; switch paths above to edit the other one.'
      : 'Roast at Destination: ship green coffee. Roast at Origin: ship roasted coffee. Pick one to see its options.';
    get('resultView').dispatchEvent(new Event('change', { bubbles: true }));
  }
  get('journeyChoice').addEventListener('change', chooseJourney);
  chooseJourney();
})();
