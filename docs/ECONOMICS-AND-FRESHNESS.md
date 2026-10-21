# Money, work and freshness — 21 October 2026

## Decision boundary

Compare buyer spending to receive the same finished roasted-coffee output, at the same handover point. This is not capital-investment ROI, a retail-dollar analysis, a full LCA or a combined sustainability score. The economic ledger is independent of the emissions model; freight prices must come from financial quotes/invoices. Carbon factors do not imply freight costs.

The initial economic fields are blank: unknown is not zero. The opt-in teaching example is invented. No company, country, wage, profit or retention benchmark is implied. Economic fields do not block the emissions calculator.

## Ledger

For green input G and roast-loss fraction L, finished output R = G × (1 − L).

- Grower-payment and origin processing/export-service rates use currency per kg green. Multiply by G.
- Wages, roast/pack services, profit, supplies, freight and destination services/margin use currency per kg roasted. Multiply by R.
- Categories must be mutually exclusive. The processing/export rate is an additional cost, not an exporter invoice already including the grower price. Quotes that bundle costs must be disaggregated or assigned once.
- Total buyer spending is the sum of these costs, using one currency, consistent tax treatment, lot/grade and delivery boundary.
- Estimated retained amount = sum of each category's spending × its entered retained-at-origin percentage. This percentage needs evidence about imports, local wages, ownership and profit transfers. It is not simply the seller's address.
- Retained amount / total buyer spending gives the estimated origin share. Zero spending gives an undefined share, not an infinite percentage.
- Origin-minus-traditional differences show extra buyer spending, extra estimated origin retention, grower receipts and retained roasting/packing wages.
- Only when extra buyer spending is positive, divide the extra retained amount by extra buyer spending. This marginal ratio can exceed 1 because existing spending can move between recipients; it is not a profit or investment return.
- Wage-hour equivalent = difference in retained roast/pack wages / stated average hourly wage. An absent wage rate means unknown. These are financed wage-hour equivalents, not measured hours, jobs created, new full-time posts, living-wage compliance or economy-wide multipliers. Farm and other sector labour hours are not estimated.

Farm-gate receipts are gross grower revenue, not farmer net income, household income or living-income attainment. Retained spending is not audited national value added: payments may support intermediates and should not be interpreted as a national-accounts measure. A study of net local value added needs input-output boundaries and evidence of local/imported content. The current ledger supports non-negative prices/profit; losses, subsidies, financing, capital timing, tariffs by product classification and exchange-rate changes require further modelling.

## Teaching example

Amounts in USD; all prices and retained shares are invented.

| Cost | Roast after | Roast before | Rate basis | Retained % after / before |
|---|---:|---:|---|---|
| Grower payment | 5 | 5 | per kg green | 100 / 100 |
| Processing/export services | 1 | 1 | per kg green | 100 / 100 |
| Roast/pack wages | 0.8 | 0.8 | per kg roasted | 0 / 100 |
| Roast/pack services | 0.6 | 0.6 | per kg roasted | 0 / 100 |
| Roast/pack profit | 1 | 1 | per kg roasted | 0 / 60 |
| Equipment/packaging/other inputs | 0.6 | 0.6 | per kg roasted | 0 / 0 |
| Freight/customs/insurance | 0.5 | 3 | per kg roasted | 0 / 0 |
| Destination services/margin | 1 | 1 | per kg roasted | 0 / 0 |

Optional average wage is an illustrative USD 8/hour, not an origin-specific benchmark. At G=1,000 kg and 15% roast loss: R=850 kg; spending is USD 9,825 versus USD 11,950; retained estimates are USD 6,000 versus USD 7,700; extra retained amount USD 1,700 for USD 2,125 extra buyer spending; marginal ratio 0.80; grower receipts unchanged at USD 5,000; extra retained wages USD 680, equivalent to 85 wage hours at the entered rate. Neither trade pathway has been proven to have these prices or outcomes.

All numeric example defaults are illustrative, low-confidence placeholders for demonstration only. Rates, currency and source notes are editable. Changing currency relabels amounts and performs no exchange-rate conversion. The export includes inputs, definitions, status and calculated results; economic/freshness data also accompany the carbon CSV when its inputs are valid.

## Freshness clocks

Inputs are elapsed days from harvest to roasting and roasting to cup, separately for each pathway. Harvest-to-cup days are their sum. Include drying, processing, storage, transport and waiting in the appropriate period. No route mode automatically sets elapsed time. There are no assumed transit times, numerical quality scores or freshness winners. Storage and packaging notes should record green and roasted conditions separately. A validated sensory/shelf-life model would require temperature, moisture, oxygen, packaging, roast level and controlled measurements, beyond elapsed time alone.

## Sources and evidence limits

Reviewed 21 October 2026:

- [GGET](https://gget.com/) describes its roasted-at-origin proposition in terms of both harvest-to-cup time and moving finishing work to origin. It is company-authored evidence for that proposition, not independent proof of sensory advantage or a financial ledger. No GGET price split, wage rate, ownership-retention ratio or jobs outcome is used here.
- [ICO Market Transparency](https://ico.org/global-knowledge-hub/works/data-transparency/) distinguishes production costs and actual farmer-household income and points to research assessment guidelines. This supports collecting separate farmer-income evidence; it provides none of the invented example values above.
- [ICO Coffee Development Report 2020](https://www.ico.org/wp-content/uploads/2022/11/CDR2020.pdf) discusses value-chain upgrading and development opportunities. Macro-level findings should not be substituted for a particular shipment's causal employment effect.

Evidence needed next: comparable purchase quotes, farm-gate receipts, disaggregated exporter/roaster invoices, payroll/time records, local/imported cost shares, beneficial ownership/profit transfers, delivery terms, actual dated harvest/roast/arrival records and storage measurements. Document any services removed or relocated rather than treating every intermediary charge as waste.

## Validation

Run `node tests/value-model.cjs` and `node tests/value-ui.cjs` (the latter also runs the existing calculator checks). Checks cover ledger reconciliation, equal output, separation of grower and origin outcomes, profit leakage, scaling, undefined ratios, wages, missing/invalid inputs, freshness clocks, UI example/edit/clear behaviour and exports. Browser visual QA remains outstanding.
