## 29 October 2026 — Diffui engraved-metal variant

- Added fine directional alloy grain and corner fixings on shared faceplates.
- Deepened engraved label shading; added visible cap downstroke and return for pointer and keyboard activation.
- Animation honours reduced motion and never delays calculator events.

## 29 October 2026 — Diffui control materials

- Added a scoped control stylesheet with machined retaining rings, translucent illuminated lenses, pressed travel and keyboard focus.
- Preserved shared aluminium faceplates, the red mushroom cap and three reset arrows, and all calculator behaviour.

# Working-copy changes — 21 October 2026

The supplied Desktop package is preserved. This copy keeps the standalone HTML app and original factors.

- Physical shipping mass is now the default air emissions basis, including after reset. The legacy billing-weight proxy remains an explicit, unvalidated sensitivity option.
- Numeric inputs are checked before calculations. Empty, non-finite, negative and out-of-range values clear results and disable CSV export. Overflowing calculations are rejected.
- A zero traditional total no longer produces an infinite percentage comparison.
- CSV exports include selected modes, allocation units, commercial billing masses, all input values, packaging presets and boundary caveats. Frozen incremental energy is a component of international transport, not an additional stage to sum again.
- Results prominently disclose the unresolved air/sea scope mismatch.
- Added nine automated regression checks against the actual inline JavaScript. Run `node tests/regression.cjs`.

Validation: nine checks passed in Node 24.19.0. The checks use a minimal DOM harness; they do not establish browser rendering, accessibility or mobile layout quality. An attempted local-file preview was rejected by the browser URL policy, so visual QA remains outstanding. Source publications were not independently audited during this pass.

## Next development priorities

1. Verify exact freight source rows, dates, upstream fuel and aviation boundaries. Reconcile conflicting source-validation statements across the supplied documents.
2. Obtain actual port/airport routes and shipment packing measurements.
3. Separate measured roasting fuel and electricity consumption and applicable emission factors.
4. Calibrate refrigerated/frozen shipping with suitable evidence; keep baseline-only frozen results explicit.
5. Review mobile usability and make uncertainty/sensitivity easier to explore.

## Route map update

Added an interactive Leaflet map with CARTO/OpenStreetMap attribution, city markers, a dashed great-circle connection, fit-route control and live distance/mode summaries. Pacific routes unwrap across the date line. The route geometry is display-only and does not enter emissions calculations. Map dependencies require internet; the original calculator continues working when they are unavailable.

Validation: eleven automated checks passed, including geometry for all 361 location pairs and offline fallback behaviour. JavaScript syntax checks pass. Browser visual QA remains outstanding under the existing local-file browser restriction.

## Research settings layout

Built-in transport presets, roasting yield/intensities, editable distances and freight/packaging factors now live inside a Research settings disclosure, closed on initial load. Primary controls retain origin, destination, shipment quantity, transport mode and packaging. The initial air-versus-sea preset is still loaded automatically. Presets explicitly retain edited factors, quantity and route. Closing settings keeps edits active; an invalid value reopens settings. Warnings and CSV export remain visible with results.

Validation: all eleven existing regression checks pass; HTML structure, unique control IDs and collapsed research-control placement checked. Browser visual QA remains outstanding.

## Conversational interface

Reworked the main flow around “How much coffee are you shipping?”, “Where’s it going?” and “When do we roast it?”. Added quick shipment quantities, warmer colours, larger type and clearer before/after journey cards. Detailed result tables, break-even values and CSV export sit under “Show me the numbers”. Volume and map-distance detail are collapsed. Research settings retain editable factors, source limitations and presets. The underlying equations are unchanged.

Validation: existing eleven automated checks pass; HTML nesting, IDs and label targets verified. Visual browser QA remains outstanding.

## Money, work and freshness

Added a separate buyer-spending comparison for the same finished output: eight cost categories, editable origin-retention shares, gross grower receipts, retained roast/pack wages, marginal retained spending per additional buyer dollar, and optional wage-hour equivalents. Financial data are initially unknown; an explicitly invented teaching example is opt-in. Added two freshness clocks plus storage notes without a quality score. Exportable ledger, source notes and freshness inputs are included. Carbon equations remain unchanged; optional economics/freshness inputs do not block carbon results.

Validation: eleven existing checks, ten economic/freshness model checks, UI integration scenarios, JavaScript syntax and HTML structure pass. Visual browser QA remains outstanding.

## Remove freshness clocks

Removed the freshness section, its event handlers and CSV fields. The financial download now contains the money ledger only. Money, work, map and emissions remain.

## Separate roasting location from transport choice

Initial load and reset now select dry sea for both pathways. Air remains explicitly selectable and available in the research preset. Air selections expose computed dry-sea and generic-reefer alternatives with one-click switches. Alternative previews hold all other assumptions fixed and do not mutate model inputs. The carbon view states both active shipping modes. No fixed percentage saving, transit-time assumption, quality outcome or financial-price change is imposed. Existing air/sea boundary limitations remain visible.

Validation: calculator/economic UI checks and freight-guidance preview, switch and invalidation checks pass. Browser visual QA remains outstanding.

## Restore original starting scenario

Restored green-by-sea versus origin-roasted-by-air on initial load and reset, following user direction. Retained live alternative-freight previews and switches. Result copy distinguishes this shipping scenario from roasting at origin in general. Company logistics remain user-reported.

## Frozen Container Energy extension

Added standalone full-refrigeration electricity module with 20/40-foot configuration, editable power/duration/allocation, temperature context, unknown onboard factor, research presets, sensitivity outputs and CSV assumptions. Audited the legacy generic-reefer-plus-increment equation before integration. Method A keeps energy contextual; Method B requires researcher evidence and compatible WTW boundaries and remains a separate research result. Existing freight equations and main comparison totals are unchanged. Both citations and a machine-readable defaults registry are included.

Validation: eleven pure frozen-energy tests and UI integration checks pass, alongside existing checks. Browser visual/mobile QA remains outstanding. GitHub push remains on hold pending destination and authentication.

## Custom city search

Added explicit city searches for both endpoints using Open-Meteo/GeoNames, with disambiguation buttons and offline preset fallback. A typed query does not change the route until a match is confirmed. Confirmed coordinates update the existing distance proxies. Added caching, coordinate validation, stale-response/timeout handling, source attribution and export provenance. Mocked integration checks cover matches, routes, errors and exports; live browser/API QA remains outstanding.

## Clarify shipping versus finished packaging

Distinguished green-coffee freight sacks from finished retail/wholesale bags in labels and CSV exports. Removed green sacks from the finished destination pack selector. The GGET-style preset now compares 300 g retail formats in both pathways, based on user-reported context. Added explicit checks for the preset and retained regression checks that destination retail packaging does not change green freight, while origin finished packaging does. Freight equations are unchanged.

## Compact console release — 28 October 2026

Shortened main copy; moved research controls and sources below results; added laptop preview. Roasting and result choices now slide continuously to the top in focused screens, with back controls and reduced-motion support. Updated header title and painted BH ship asset. Clarified final-retail versus green-shipping packaging; default GGET-style retail format is 300 g on both sides, destination choices exclude Bulk, and shorter Reefer/Retail bags labels are used. Main freight equations and research limitations are preserved.

Validation: nine check suites pass, including quantity/packaging correctness, economic UI, result/roast transitions, city search, freight guidance and frozen-energy accounting. HTML structure and local asset references checked. Browser visual QA remains outstanding.

## Selected journey leads carbon results — 29 October 2026

The carbon headline now reports the user’s selected journey relative to the opposite roasting location with matched freight and final packaging. The selection, denominator and comparison basis are explicit. Charts, totals, breakdown, volumes, break-even and CSV reconcile with that basis. Saved settings for the other journey remain intact; exports include them separately. Greener-option comparisons use the corresponding matched basis.

Validation includes the reported destination-air case (10.4% higher) and reverse origin-air case (9.4% lower), packaging matching without input mutation, zero denominator, frozen warnings, chart totals and CSV reconciliation.
