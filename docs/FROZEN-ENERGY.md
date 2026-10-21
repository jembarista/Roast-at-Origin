# Standalone Frozen Container Energy extension

Implemented 21 October 2026. This extends the existing standalone HTML/JavaScript app without replacing its freight equations.

## Existing boundaries identified before implementation

`pathway()` calculates ocean transport as max(volume/usable TEU volume, shipping mass/TEU payload) × distance × dry/reefer kg CO₂e/TEU-km. Whole-container mode rounds TEUs up. Frozen mode uses the generic reefer factor and adds the existing `freezeExtra × freezeDays × freezeGrid × allocatedTEU` incremental allowance. Its defaults remain 0 incremental kWh/TEU/day, 25 days and a provisional 0.7 kg CO₂e/kWh. The default zero increment does not establish a temperature-calibrated frozen total. The old 0.7 proxy is **not** used as the new panel's onboard factor.

The new module estimates **full** refrigeration electricity, not electricity incremental to the GLEC baseline. Its emissions are never added to that baseline or the existing incremental allowance. Existing transport, road, roasting, packaging and financial calculations are unchanged.

## Equations and inputs

- Container TEU equivalents: 20-foot = 1; 40-foot = 2. Using this to scale electrical demand is provisional.
- Total electricity = entered kW/TEU × TEU × powered voyage days × 24.
- Allocated electricity = total electricity × shipment allocation fraction.
- Allocated refrigeration emissions = allocated electricity × documented onboard-generation WTW factor.
- Per-kg electricity = allocated electricity / finished roasted output from the main mass and roast-loss inputs.
- Sensitivity: 40%, 100% and 160% of entered average power. These are illustrative sensitivities, not probability bounds; for non-reference power they are not study-specific measured ranges.
- Temperature is descriptive only. It never interpolates or changes power automatically.

The 30-day and 100% allocation defaults describe a hypothetical single loaded container; they are not route- or cargo-validated. The share is independent of the main shipment's allocated TEUs. The panel displays both allocations when a refrigerated/frozen journey is selected. Match them before comparing transport figures. Multiple containers require a separate calculation or future extension.

The onboard factor starts unknown. A number alone does not enable the UI conversion: its source and WTW boundary must be recorded. Unknown is exported as unavailable, not zero. An explicitly entered, documented zero factor is distinct from missing data. Do not substitute the destination electricity grid factor.

## Accounting methods

**A — GLEC reefer:** the panel shows the generic GLEC baseline for its own allocation and main sea distance when the selected journey uses refrigerated/frozen transport. Full electricity and its carbon conversion remain contextual. It also identifies the existing main journey allocation/baseline and any legacy incremental allowance. For air/dry-sea journeys, the energy estimate is hypothetical and the reefer transport baseline is unavailable.

**B — Components:** a separate research total, using a researcher-supplied propulsion-only kg CO₂e/TEU-km factor × entered distance × allocated TEUs, plus allocated refrigeration CO₂e. The existing dry factor is not prefilled or assumed suitable. Activation requires numeric factors/distance, source records for both factors, matching WTW boundaries, evidence-confirmation that refrigeration is excluded, and confirmation of compatible allocation/lifecycle boundaries. Withdrawal of required evidence invalidates the component result. Confirmation is researcher attestation, not independent verification by the app.

Methods are mutually exclusive within the panel. Neither changes the main headline comparison. This deliberate separation avoids using incompatible allocation or electricity assumptions as a silent replacement for existing freight totals. Do not subtract the Fitzgerald electricity estimate from GLEC totals.

## Source registry

Machine-readable defaults and citations are in `frozen-energy-sources.json`.

- Fitzgerald, W. B., Howitt, O. J. A., Smith, I. J., Hume, A. (2011), *Energy use of integral refrigerated containers in maritime transportation*, Energy Policy 39(4), 1885–1896. DOI: https://doi.org/10.1016/j.enpol.2010.12.015 . Author manuscript: https://www.physics.otago.ac.nz/eman/documents/fitzgerald_et_al_2011_refn_pers_rev_ver.pdf . Abstract; §3.2/Table 2, manuscript p.12 (PDF index 11). The 2.7 kW/TEU reference is an overall modelling assumption, with approximate ±60% variation discussed separately; reported monitored samples are not universal coffee coefficients.
- Cheaitou, A., Cariou, P. (2012), *Liner shipping service optimisation with reefer containers capacity: an application to northern Europe–South America trade*, Maritime Policy & Management 39(6), 589–602. DOI: https://doi.org/10.1080/03088839.2012.728726 . §2.2.3.2, p.594; power inputs of 5.2 kW/TEU for −18 °C frozen products and 7.2 kW/TEU for +2 °C fresh products. Checked in author-uploaded full text: https://www.researchgate.net/publication/263480595_Liner_shipping_service_optimisation_with_reefer_containers_capacity_an_application_to_northern_Europe-South_America_trade . These are modelling inputs, not measured voyage averages. The paper's cycle-average treatment is not applied to the panel's entered powered voyage duration.

Texts checked on 21 October 2026. No paper copies are redistributed. No universal relation between lower setpoints and greater electrical consumption is inferred.

## Files and integration

- `frozen-energy.js`: standalone pure calculation and preset metadata.
- `frozen-energy-ui.js`: optional inputs, evidence gate, selected-journey context, sensitivity results and CSV export.
- `index.html`: expandable panel, citations and minimal CSS. Energy inputs are excluded from the main model's numeric validation; invalid optional research inputs do not block the original app. Existing CSV exports append energy assumptions/results via `window.frozenExportRows()`.
- `tests/frozen-energy.cjs`: pure-model tests including all supplied A–E cases and accounting/validation safeguards.
- `tests/frozen-energy-ui.cjs`: integration tests for missing factors, boundary gates, unchanged main totals, source withdrawal, presets, scaling and exports.

## Checks

Run both new test files with Node.js, plus the existing regression, money UI, result-switch and freight-guidance checks. Expected full-container examples are 1,944 kWh (20-foot, 2.7), 3,888 kWh (40-foot, 2.7, provisional scaling) and 3,744 kWh (20-foot, 5.2), all at 30 powered days. Browser visual/mobile QA remains outstanding.
