# Known limitations, risk register and next build priorities

## High-priority conceptual issues

1. **Freight rates are illustrative**, even though the UI links to GLEC and UK factors. Source and align exact numeric values before public quantitative conclusions.
2. **Air volumetric mass as emissions allocation** is not validated. Billing weight ≠ proportional fuel consumption. Separate *billable kg* (commercial info) from physical footprint, with a transparent allocation basis.
3. **Container emissions allocation by max(volume fraction, payload fraction)** is a heuristic, not an approved/verified life-cycle rule. Partial vs dedicated FCL/LCL must be handled carefully. TEU movement may be shared and capacity-constrained.
4. **Roasting source boundaries differ** (combustion only vs process LCA; electricity/fuel), and location isn't actually used to derive the energy factor. Introduce separately measured fuel, electricity, grid and emissions scope.
5. **Volume**: bag/box fill assumptions lack evidence; real pallet patterns, retail cases, compression, headspace and weight matter.
6. **Green sacks asymmetry**: origin-roasted pathway also receives green coffee in some form, but upstream sacks not presently counted. Need consistent scope, account for reusable bags and circular return.
7. **Routes**: inland places masquerade as port/airport departure points. No port handling, trucking split or actual itinerary. See editable inputs as proxies only.
8. **Cold chain**: reefer vessel factor may cover refrigeration but not inland freezers, storage, refrigerant leakage and energy emissions. Explicitly model if necessary.
9. **Equal outputs, not equal freshness/loss:** spoilage, quality preservation and unsold inventory are omitted.
10. **GGET**: user reports air freight; actual shipment size, airport, bag size, transit and company rationale not independently verified.

## Acceptance criteria for V2

- Every default has machine-readable provenance, date, unit, scope and confidence.
- Source-specific freight factor tables extracted and spot-checked from authoritative publications.
- Freight calculations include **physical shipping mode and route**, not just rough geography; full-container vs consolidated mode presented transparently.
- Emit exportable assumptions manifest with every CSV result.
- Distinguish direct CO₂ and well-to-wheel CO₂e, and explain optional aviation non-CO₂ adjustment.
- Packaging shipping configuration is independently selectable from final consumer package size.
- Country-specific electricity/fuel emissions only when evidence is available; otherwise ask user for consumption and label assumptions.
- Make the result's uncertainty obvious; ideally include sensitivity range for freight factors, occupancy and roasting intensity.
- Automated tests check mass conservation, equivalent scenarios, freight mode switching, package mass/volume, break-even and CSV output.
- Works at 375px viewport with readable charts/table and semantic inputs.

## Recommended feature priority

P0: source integrity, freight accounting, correctness/validation. P1: route selection and packaging, realistic reefer. P2: sensitivity chart and interactive learning explanations. P3: optional economics/employment lens, explicitly separate from carbon result.


### Frozen freight
Do not treat chilled and frozen as interchangeable. Frozen is currently a GLEC generic reefer baseline plus an uncalibrated, user-editable incremental energy allowance. See `FROZEN-FREIGHT.md`. Numerical results at default incremental cooling zero are expressly **not** frozen-specific estimates.
