/* Separate economic ledger. Currency values are inputs, never derived from carbon factors. */
(function (root) {
  const categories = [
    { id: 'grower', label: 'Paid to growers', basis: 'green', note: 'Farm-gate receipts, not grower profit. Use a green-equivalent price, not a cherry price.' },
    { id: 'originServices', label: 'Processing + export services', basis: 'green', note: 'Additional costs and margins only; exclude the grower payment above.' },
    { id: 'wages', label: 'Roasting + packing wages', basis: 'roasted', note: 'Gross wages only, separate from services and profit.' },
    { id: 'localServices', label: 'Roasting + packing services', basis: 'roasted', note: 'Additional operating costs; exclude wages, separately listed inputs and profit.' },
    { id: 'surplus', label: 'Roasting + packing profit', basis: 'roasted', note: 'Profit after all listed costs. Retention depends on ownership and where profits go.' },
    { id: 'supplies', label: 'Equipment + packaging + other inputs', basis: 'roasted', note: 'Allocated costs; exclude anything already in the services row. Imported inputs may leave origin.' },
    { id: 'freight', label: 'Freight + customs + insurance', basis: 'roasted', note: 'Actual quoted financial cost; not calculated from the emissions factors.' },
    { id: 'destination', label: 'Destination services + margin', basis: 'roasted', note: 'Costs to deliver finished coffee to the buyer, excluding the rows above. Excludes retail and brewing.' }
  ];
  function finite(value, name, minimum = 0, maximum = Infinity) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum || value > maximum) throw new Error(`Check ${name}.`);
    return value;
  }
  function compareValue(input) {
    const green = finite(input.green, 'green coffee quantity', Number.MIN_VALUE);
    const loss = finite(input.loss, 'roast loss', 0, .999999);
    const roasted = green * (1 - loss);
    if (!Number.isFinite(roasted) || roasted <= 0) throw new Error('Check roasted output.');
    const output = {};
    for (const pathway of ['traditional', 'origin']) {
      const rows = categories.map(category => {
        const row = input[pathway][category.id];
        const rate = finite(row.rate, `${pathway}: ${category.label}`);
        const retention = finite(row.retention, `${pathway}: ${category.label} retained share`, 0, 100);
        const total = rate * (category.basis === 'green' ? green : roasted);
        return { ...category, rate, retention, total, retained: total * retention / 100 };
      });
      const total = rows.reduce((sum, row) => sum + row.total, 0);
      const retained = rows.reduce((sum, row) => sum + row.retained, 0);
      const grower = rows.find(row => row.id === 'grower').total;
      const wages = rows.find(row => row.id === 'wages').retained;
      output[pathway] = { rows, total, retained, grower, wages, perKg: total / roasted, retainedPerKg: retained / roasted, share: total > 0 ? retained / total : null };
    }
    output.roasted = roasted;
    output.extraRetained = output.origin.retained - output.traditional.retained;
    output.extraSpend = output.origin.total - output.traditional.total;
    output.extraGrower = output.origin.grower - output.traditional.grower;
    output.extraWages = output.origin.wages - output.traditional.wages;
    output.retainedPerExtraDollar = output.extraSpend > 0 ? output.extraRetained / output.extraSpend : null;
    if (input.hourlyWage !== null && input.hourlyWage !== undefined) {
      const hourly = finite(input.hourlyWage, 'average hourly wage', Number.MIN_VALUE);
      output.additionalWageHours = output.extraWages / hourly;
    } else output.additionalWageHours = null;
    if (Object.values(output).some(value => typeof value === 'number' && !Number.isFinite(value)) || ['traditional', 'origin'].some(key => Object.values(output[key]).some(value => typeof value === 'number' && !Number.isFinite(value)))) throw new Error('Values are too large to calculate.');
    return output;
  }
  function freshnessClocks(greenDays, roastedDays) {
    finite(greenDays, 'days from harvest to roasting');finite(roastedDays, 'days from roasting to cup');
    const total = greenDays + roastedDays;
    if (!Number.isFinite(total)) throw new Error('Times are too large to calculate.');
    return { greenDays, roastedDays, total };
  }
  const api = { categories, compareValue, freshnessClocks };
  if (typeof module !== 'undefined') module.exports = api;
  else root.coffeeValue = api;
})(typeof window !== 'undefined' ? window : globalThis);
