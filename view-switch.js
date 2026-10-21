/* Changing the result lens changes presentation only, preserving every model input. */
(() => {
  const get = id => document.getElementById(id);
  function showSelectedView() {
    const money = get('resultView').value !== 'carbon';
    const chosen = get('journeyChoice').value !== '' && ['money', 'carbon'].includes(get('resultView').value);
    get('valuePanel').hidden = !chosen || !money;
    get('carbonPanel').hidden = !chosen || money;
    get('volumePanel').hidden = !chosen || money;
    get('viewResultsLink').href = money ? '#valuePanel' : '#carbonPanel';
    get('viewResultsLink').textContent = money ? 'See the money results ↓' : 'See the carbon results ↓';
  }
  get('resultView').addEventListener('change', showSelectedView);
  showSelectedView();
})();
