# V1 methodology — implementation inventory

**Functional unit:** one shipment of green coffee mass `G` (default 1,000 kg) transformed into `R = G × (1-L)` kg roasted, where `L` is roasting mass loss (default 0.15). Both pathways deliver **R kg** of roasted product. For reporting, divide each total by R. Production/agriculture is held identical and excluded.

## Pathway definitions

**Traditional:** green coffee G plus green sacks ships internationally; roasting G occurs at destination; roasted R is packaged in selected destination format. **Origin roast:** roast G and package R before export; finished product plus packaging ships internationally. Both scenarios use a shared green mass loss. Check whether green sacks are used at origin before roasting; V1 does not include their manufacture for the origin pathway.

## Volume and mass

V1 packaging presets contain bean bulk density `density` in kg/m³; packing fill efficiency `fill` as a fraction; and packaging mass `mass` in kg packaging/kg coffee. `shipping_volume = shipped_coffee_mass / (density × fill)`. `shipping_mass = shipped_coffee_mass + shipping_packaging_mass`.

Green sacks in traditional international freight use the green preset **regardless of destination retail packaging selector**. This is correct and should be tested.

## Freight

**Sea:** allocated container units = `max(shipping_volume / TEU_usable_volume, shipping_mass / TEU_payload)`; if 'full container' is enabled, round allocation up to a whole TEU. `emissions = allocated_TEUs × sea_distance_km × dry_or_reefer_factor_kgCO2e_per_TEU_km`.

**Air (working copy):** physical shipment mass is the default emissions basis. The optional, unchecked legacy billing-weight sensitivity works as follows: if 'volumetric' is enabled, `chargeable_mass = max(actual_shipping_mass, shipping_volume × assumed_volumetric_kg_per_m3)`; otherwise use actual shipping mass. `emissions = chargeable_mass_tonnes × air_distance_km × air_factor_kgCO2e_per_tonne_km`. **IMPORTANT:** This chargeable-mass proxy is useful for illustrating freight pricing but is *not* automatically a defensible emissions allocation. Rework after researching method. 

**Road:** shared assumed road kilometres × shipment tonnes × road factor kgCO₂e/tonne-km. Only one simplified road leg is modelled. Origin/destination local transport differences omitted.

**Distance:** cities represented by coordinates. Air km = great circle × 1.1. Sea km = `max(great_circle × 1.4, great_circle + 1,200)`; this is not port-specific routing and can be very wrong, especially for inland points or intercontinental canals.

## Roasting and packaging

`roasting_emissions = G × input_roasting_kgCO2e_per_kg_green` independently for each pathway. Roasting input is a lumped historical benchmark; no fuel/grid breakdown yet.

`packaging_emissions = selected_roast_packaging_kg × package_factor_kgCO2e_per_kg_packaging` for both pathways, **plus traditional green sacks**. Origin scenario does not add upstream green sacks; this asymmetry should be revisited based on boundary selection and real operations.

`total = international_freight + road + roasting + packaging`. Break-even origin roasting intensity `I* = (traditional_total - origin_nonroasting_total) / G`. Negative I* means origin cannot break even through roasting changes alone.

## Boundaries and exclusions

Excluded: coffee cultivation, fertiliser and land use, cherry processing and milling, farm/export handling, warehouse energy, stockholding/freezer storage outside reefer factor, final delivery, sea-port/airport handling and transhipment, refrigeration outside travel, cold-chain refrigerant leakage where absent from factor, air non-CO₂ impacts unless deliberately included in calibrated factor, retail, brewing, disposal/end of life, variability in spoilage/quality and economic/social benefits. Equal cultivation cancels *in the difference* if truly identical but must not be counted as zero in a full cradle-to-cup study.

## Emissions accounting caution

Distinguish TTW (tank-to-wheel)/WTW (well-to-wheel), CO₂ versus CO₂e, GWP horizon, and aviation non-CO₂ treatment across sources. Scope-equivalent factors needed. Do not treat GLEC *methodology* as evidence that a particular hard-coded factor is correct.

## Packaging controls clarified — 28 October 2026

Destination roasting always ships green coffee in green sacks. Its package selector describes finished roasted coffee packed after arrival/roasting, not its international shipping packaging. Origin roasting packs the finished roasted coffee before international shipment; 300 g is a saleable retail bag. Bulk options describe wholesale roasted coffee in both pathways. Green sacks are no longer offered as a finished-coffee packaging option. The user-reported GGET-style preset uses 300 g final retail bags in both pathways for a matched retail format; actual company packing is not independently verified here. Other research presets retain their previous 1 kg finished-bag default. No freight or packaging equations were changed.

Destination final packaging is now limited to 1 kg bags or Retail bags. Bulk remains an option only for origin-roasted shipments in the current UI. “Retail bags” uses the 300 g illustrative preset, rounded from the 10.5 oz size listed at https://gget.com/collections/current-menu/products/prism-roasted-at-origin (checked 28 October 2026). This verifies the listed bag size, not the package material mass, fill efficiency, shipment configuration or air-freight use.

## Selected-journey carbon comparison — 29 October 2026

When a roasting location is selected, the primary result is (selected total − opposite-location total) / opposite-location total. Both displayed pathways use the selected journey’s freight mode and finished roasted-coffee packaging format; quantity, route, freight factors and other shared inputs are unchanged. Roasting intensities remain the independently entered location-specific assumptions. Green coffee still travels in sacks in the destination pathway, regardless of finished pack. A bulk origin selection produces a hypothetical bulk destination comparator even though bulk is not offered as a normal destination setup choice.

The opposite pathway is calculated using overrides, without altering its saved controls. Charts, stage table, per-kg results, volumes, break-even and carbon CSV use this matched comparison. `window.last` retains actual editable scenarios for other modules and additionally stores `carbonComparison`. With no roasting selection, the hidden research preview retains the original preset comparison. A zero comparator total produces an absolute difference rather than an infinite percentage.

Greener freight previews compare an alternative transport mode for the selected roasting location against the other roasting location using that same alternative mode and finished pack. Money and frozen-energy calculations retain their existing independent boundaries.
