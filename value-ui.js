/* Optional economic inputs do not block the emissions calculator. */
(() => {
  const $ = id => document.getElementById(id);
  const { categories, compareValue } = window.coffeeValue;
  let result = null, basis = 'No financial data loaded';
  const money = v => `${$('econCurrency').value} ${v.toLocaleString('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  const number = v => v.toLocaleString('en-GB', { maximumFractionDigits: 1 });
  const fieldId = (pathway, category, field) => `econ_${pathway}_${category}_${field}`;
  $('econInputs').innerHTML = categories.map(category => `<tr><th scope="row">${category.label}<small class="hint">Per kg ${category.basis}. ${category.note}</small></th>${['traditional', 'origin'].map(pathway => `<td><label class="sr-only" for="${fieldId(pathway, category.id, 'rate')}">${category.label}, ${pathway}, currency per kg ${category.basis}</label><input id="${fieldId(pathway, category.id, 'rate')}" type="number" min="0" step="any" placeholder="Unknown"></td><td><label class="sr-only" for="${fieldId(pathway, category.id, 'retention')}">${category.label}, ${pathway}, percent staying at origin</label><input id="${fieldId(pathway, category.id, 'retention')}" type="number" min="0" max="100" step="any" placeholder="Unknown"></td>`).join('')}</tr>`).join('');
  function read(id, optional = false) {
    const input = $(id), blank = input.value.trim() === '', value = Number(input.value);
    const invalid = (!optional && blank) || (!blank && (!Number.isFinite(value) || value < Number(input.min || 0) || (input.max !== '' && value > Number(input.max))));
    input.setAttribute('aria-invalid', String(invalid));
    if (invalid) throw new Error('Add valid costs and origin-retention shares for every row. Blank means unknown; use 0 only when known.');
    return blank ? null : value;
  }
  function getInput() {
    if ($('mass').value.trim() === '' || $('loss').value.trim() === '') throw new Error('Check coffee quantity and roast loss.');
    const input = { green: Number($('mass').value), loss: Number($('loss').value) / 100, hourlyWage: read('econHourly', true) };
    for (const pathway of ['traditional', 'origin']) {
      input[pathway] = {};
      for (const category of categories) input[pathway][category.id] = { rate: read(fieldId(pathway, category.id, 'rate')), retention: read(fieldId(pathway, category.id, 'retention')) };
    }
    return input;
  }
  function selectedJourney() {
    const choice = $('journeyChoice').value;
    const origin = choice === 'roasted';
    $('econAfterCard').classList.toggle('current-journey', choice === 'green');
    $('econBeforeCard').classList.toggle('current-journey', origin);
    $('econSelectedLabel').textContent = !choice ? 'Choose your journey above' : `Your choice · ${origin ? 'Roast at Origin' : 'Roast at Destination'}`;
    if (!choice || !result) {
      $('econSelectedRetained').textContent = '—';
      $('econSelectedStory').textContent = !choice ? 'Choose when to roast to see its financial result.' : 'Add your costs or load the illustrative example to see this journey’s financial result.';
      return;
    }
    const selected = result[origin ? 'origin' : 'traditional'];
    $('econSelectedRetained').textContent = `${money(selected.retainedPerKg)} / kg stays at origin`;
    $('econSelectedStory').textContent = `For this shipment: ${money(selected.retained)} estimated retained at origin, from ${money(selected.total)} in total buyer spending. ${selected.share === null ? 'No spending share is available.' : `${number(selected.share * 100)}% of the buyer’s spending stays at origin under the entered assumptions.`} The comparison below keeps both journeys visible. Transport and packing buttons do not set financial prices; edit those costs in the ledger.`;
  }
  function clear(message) {
    result = null;
    for (const id of ['econAfter', 'econBefore', 'econGrowers', 'econWages', 'econHours']) $(id).textContent = '—';
    $('econAfterShare').textContent = $('econBeforeShare').textContent = 'Per kg of finished coffee';
    $('econDifference').textContent = 'Add a cost breakdown to follow the money.';
    $('econStory').textContent = '';
    $('econTotals').replaceChildren();
    $('econStatus').textContent = message;
  }
  function refreshMoney() {
    const enteredMass = Number($('mass').value), enteredLoss = Number($('loss').value);
    $('econCoffeeAmount').textContent = $('mass').value.trim() !== '' && Number.isFinite(enteredMass) && enteredMass > 0
      ? `You’re buying ${number(enteredMass)} kg of green coffee.` + ($('loss').value.trim() !== '' && Number.isFinite(enteredLoss) && enteredLoss >= 0 && enteredLoss < 100 ? ` That gives ${number(enteredMass * (1 - enteredLoss / 100))} kg of roasted coffee at the entered ${number(enteredLoss)}% roasting loss. Both journeys use this same amount.` : '')
      : 'Enter your coffee amount above to compare the same shipment.';

    $('econBasis').textContent = `${basis}. Same buyer handover point, same finished output. Excludes retail, brewing and consumption taxes. Currency changes relabel amounts; they do not convert them.`;
    const hasData = categories.some(c => ['traditional', 'origin'].some(p => $(fieldId(p, c.id, 'rate')).value.trim() !== ''));
    if (!hasData) { clear('Add your own figures or try the clearly labelled example. No business-specific financial claims are loaded.'); return; }
    try {
      result = compareValue(getInput());
      const a = result.traditional, b = result.origin;
      $('econStatus').textContent = basis.includes('example') ? 'ILLUSTRATIVE EXAMPLE · invented prices and retention shares, not GGET figures or country averages.' : 'User-entered scenario · retention shares and ownership need supporting evidence.';
      $('econAfter').textContent = `${money(a.retainedPerKg)} / kg`;
      $('econBefore').textContent = `${money(b.retainedPerKg)} / kg`;
      $('econAfterShare').textContent = a.share === null ? 'No spending entered' : `${number(a.share * 100)}% of buyer spending stays at origin`;
      $('econBeforeShare').textContent = b.share === null ? 'No spending entered' : `${number(b.share * 100)}% of buyer spending stays at origin`;
      const delta = result.extraRetained;
      $('econDifference').textContent = `${money(Math.abs(delta))} ${delta >= 0 ? 'more' : 'less'} estimated to stay at origin for this shipment.`;
      const spend = result.extraSpend;
      const ratio = result.retainedPerExtraDollar;
      $('econStory').textContent = `Roasting before shipping ${spend >= 0 ? 'costs the buyer' : 'saves the buyer'} ${money(Math.abs(spend))} ${spend >= 0 ? 'more' : ''} across ${number(result.roasted)} kg of finished coffee. ${ratio === null ? 'There is no positive extra buyer spend to divide by.' : `For each extra ${$('econCurrency').value} 1 spent, estimated retained spending changes by ${money(ratio)}. This ratio can exceed 1 when spending shifts between recipients.`} ${Math.abs(result.extraGrower) < .005 ? 'Grower receipts are unchanged in this scenario.' : 'The grower-payment change is shown separately below.'}`;
      $('econGrowers').textContent = `${result.extraGrower >= 0 ? '+' : '−'}${money(Math.abs(result.extraGrower))}`;
      $('econWages').textContent = `${result.extraWages >= 0 ? '+' : '−'}${money(Math.abs(result.extraWages))}`;
      $('econHours').textContent = result.additionalWageHours === null ? 'Wage rate needed' : `${result.additionalWageHours >= 0 ? '+' : '−'}${number(Math.abs(result.additionalWageHours))} hours`;
      const rows = [
        ['Buyer spending / kg roasted', a.perKg, b.perKg], ['Buyer spending / shipment', a.total, b.total],
        ['Estimated retained at origin / shipment', a.retained, b.retained], ['Estimated going elsewhere / shipment', a.total - a.retained, b.total - b.retained],
        ['Gross grower receipts / shipment', a.grower, b.grower], ['Retained roast + pack wages / shipment', a.wages, b.wages],
        ...categories.map(c => [`${c.label} / shipment`, a.rows.find(r => r.id === c.id).total, b.rows.find(r => r.id === c.id).total])
      ];
      $('econTotals').innerHTML = rows.map(([label, left, right]) => `<tr><th scope="row">${label}</th><td>${money(left)}</td><td>${money(right)}</td></tr>`).join('');
    } catch (error) { clear(error.message); }
  }
  function refresh() {
    refreshMoney();selectedJourney();
    $('econCsv').disabled = !result;
  }
  function exportRows() {
    const rows = [
      ['Economic boundary', 'Buyer spending for same finished output; excludes retail, brewing and consumption taxes', 'Not a capital investment return'],
      ['Financial data basis', basis, 'Not business-specific evidence unless supplied by user'],
      ['Selected journey', $('journeyChoice').value || 'Not selected', 'Both pathways remain in comparison'], ['Currency (not converted)', $('econCurrency').value, ''], ['Financial evidence notes', $('econEvidence').value, ''],
      ['Retained-origin definition', 'Sum of each cost times its entered origin-retention share', 'Not audited GDP value added or farmer net income'],
      ['Work-hours definition', 'Additional retained roast/pack wages divided by entered average wage', 'Not new jobs, living-wage compliance or a multiplier'],
      ['Average hourly wage', $('econHourly').value, 'Currency/hour; blank means unknown']
    ];
    for (const category of categories) {
      rows.push([`Rate: ${category.label} (currency/kg ${category.basis})`, $(fieldId('traditional', category.id, 'rate')).value, $(fieldId('origin', category.id, 'rate')).value]);
      rows.push([`Retained share: ${category.label} (%)`, $(fieldId('traditional', category.id, 'retention')).value, $(fieldId('origin', category.id, 'retention')).value]);
    }
    rows.push(['Financial result status', result ? 'Calculated from complete entered ledger' : 'Unavailable: ledger missing or invalid', '']);
    if (result) {
      rows.push(['Finished output kg', result.roasted, result.roasted]);
      for (const key of ['total', 'perKg', 'retained', 'retainedPerKg', 'share', 'grower', 'wages']) rows.push([`Money result: ${key}`, result.traditional[key], result.origin[key]]);
      for (const key of ['extraRetained', 'extraSpend', 'extraGrower', 'extraWages', 'additionalWageHours', 'retainedPerExtraDollar']) rows.push([`Difference (origin minus traditional): ${key}`, result[key], '']);
    }
    return rows.map(row => row.map(value => typeof value === 'string' && /^[\s]*[=+@\-]/.test(value) ? "'" + value : value));
  }
  window.valueExportRows = exportRows;
  $('econCsv').addEventListener('click', () => {
    refresh();if ($('econCsv').disabled) return;
    const rows = [['Metric', 'Roast after / value', 'Roast at Origin / note'], ['Green input kg', $('mass').value, ''], ['Roast loss %', $('loss').value, ''], ...exportRows()];
    const csv = rows.map(row => row.map(value => '"' + String(value ?? '').replaceAll('"', '""') + '"').join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');link.href = url;link.download = 'coffee-money.csv';link.click();setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('econExample').addEventListener('click', () => {
    const amounts = { grower: [5, 5], originServices: [1, 1], wages: [.8, .8], localServices: [.6, .6], surplus: [1, 1], supplies: [.6, .6], freight: [.5, 3], destination: [1, 1] };
    const shares = { grower: [100, 100], originServices: [100, 100], wages: [0, 100], localServices: [0, 100], surplus: [0, 60], supplies: [0, 0], freight: [0, 0], destination: [0, 0] };
    for (const category of categories) ['traditional', 'origin'].forEach((pathway, index) => {
      $(fieldId(pathway, category.id, 'rate')).value = amounts[category.id][index];
      $(fieldId(pathway, category.id, 'retention')).value = shares[category.id][index];
    });
    $('econCurrency').value = 'USD';$('econHourly').value = '8';
    $('econEvidence').value = 'Invented teaching example. No company/country data. Same grower price in both pathways. Hypothetical 60% retention of origin roaster profit; no retained freight spend. All shares require replacement with evidence.';
    basis = 'Illustrative example';refresh();
  });
  $('econEdit').addEventListener('click', () => { $('econDetails').open = true;$('econDetails').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); });
  $('econClear').addEventListener('click', () => {
    for (const category of categories) for (const pathway of ['traditional', 'origin']) for (const field of ['rate', 'retention']) $(fieldId(pathway, category.id, field)).value = '';
    $('econHourly').value = '';$('econEvidence').value = '';basis = 'No financial data loaded';refresh();
  });
  for (const input of document.querySelectorAll('#valuePanel input, #valuePanel select, #valuePanel textarea')) input.addEventListener('input', () => {
    basis = basis.toLowerCase().includes('example') ? 'Edited illustrative example' : 'User-entered assumptions';refresh();
  });
  for (const id of ['mass', 'loss']) $(id).addEventListener('input', refresh);
  $('reset').addEventListener('click', refresh);
  $('journeyChoice').addEventListener('change', selectedJourney);
  refresh();
})();
