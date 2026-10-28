# Ocean vs Air Freight · Roasting Location Calculator

A Barista Hustle educational prototype comparing roasting at origin with roasting at destination. Explore retained spending, grower receipts, paid-work equivalents and emissions for the same finished roasted-coffee output.

## Run

Open `index.html` in a browser. Keep its JavaScript files alongside it. No build step, dependencies, API keys or network connection required. Alternatively run `python3 -m http.server 8000` in this folder. Static hosts such as GitHub Pages can serve this directory.

## Flow

Enter green-coffee quantity and origin/destination. Choose **Roast After the Trip** or **Roast at Origin**, then configure transport and packaging in the opening card. Choose **Follow the Money** or **Check the Carbon Footprint** to open results. Research settings and the financial ledger expose detailed assumptions. CSV exports accompany results.

Initial load and reset compare green by sea versus origin-roasted by air: a user-reported GGET-style scenario, not independently verified company logistics. Air selections offer calculated dry-sea and refrigerated-sea alternatives. Roasting location and transport are separate choices; no fixed percentage saving is assumed.

## Limits

This is an educational screening model, not a validated LCA or company footprint. Carbon totals include international freight, simplified road transport, roasting and packaging. Sea defaults are linked in the supplied research to GLEC v3.2; air remains a placeholder with unresolved boundary alignment. Routes, packing and loading need validation. Frozen shipping uses a generic reefer baseline plus entered incremental energy, not a calibrated frozen-specific estimate.

Financial inputs start blank. The opt-in example uses invented prices, wages and retained shares. Grower receipts are not grower profit; retained spending is not audited national value added; wage-hour equivalents are not jobs created. Actual estimates need invoices, payroll and ownership evidence. Financial freight prices are entered independently of carbon factors.

The map and freshness-clock interface have been removed. The archived map file and pure freshness helper are inactive in the interface.

## Checks

Requires Node.js, with no package installation:

```sh
node tests/value-model.cjs
node tests/value-ui.cjs
node tests/view-switch.cjs
node tests/freight-guidance.cjs
```

The UI integration harness also runs the main calculator regression checks. Browser visual/mobile QA remains outstanding.

## Documentation

See `CHANGELOG.md` for implementation history, `docs/FREIGHT-RESEARCH.md` and `docs/FROZEN-FREIGHT.md` for freight boundaries, and `docs/ECONOMICS-AND-FRESHNESS.md` for the economic ledger and historical freshness work. The original handover documents remain under `docs/`; their description of earlier interface behaviour may be superseded by the changelog. Review numerical provenance and claims before public release.

See `LICENSE-NOTE.md` for the supplied intellectual-property note.

## Frozen Container Energy

A separate expandable research panel estimates refrigeration electricity and optional onboard-generation emissions. GLEC totals are unchanged; the component alternative requires documented matching boundaries and exclusion evidence. See `docs/FROZEN-ENERGY.md` and `frozen-energy-sources.json`. Run `node tests/frozen-energy.cjs` and `node tests/frozen-energy-ui.cjs`. Keep both `frozen-energy.js` and `frozen-energy-ui.js` beside the HTML.

## Custom cities

Type a city at either end, press Find city (or Enter), then choose the correct match. Open-Meteo/GeoNames geocoding needs internet. Presets remain available offline. Choosing a match updates coordinates and the existing approximate distances; these are not port/airport itineraries. Coordinates and provenance accompany CSV exports. Review commercial API licensing before deployment. Run `node tests/city-search.cjs`.

## Current interface — 28 October 2026

Setup asks for coffee quantity, cities and roasting location. Choosing a location slides the console into a focused shipping/packing screen; choosing Money or Carbon slides the shared examine panel to the top. Both transitions respect reduced-motion preferences. Research settings, frozen energy, Sources and the sound toggle appear below results. Phone and laptop layout previews are available in `phone-preview.html` and `laptop-preview.html`.

Green coffee ships in sacks for destination roasting. The final destination pack choices are 1 kg or Retail bags; Bulk is retained for origin roasting. Retail bags use an illustrative 300 g model, rounded from GGET's listed 10.5 oz size (approximately 298 g). The GGET-style preset matches 300 g final packaging in both pathways. Actual packaging mass and stowage assumptions still require evidence.

Run `node tests/journey-focus.cjs` in addition to the checks above for the console transitions. The header uses an AI-edited photo with a white BH mark painted on the hull; the original asset is preserved. See its adjacent `.txt` file for the edit prompt.
