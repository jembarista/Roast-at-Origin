# Freight emissions research — October 2026

## Recommended authoritative sources

1. **Smart Freight Centre, Global Logistics Emissions Council (GLEC) Framework v3.2 (October 2025)**. Table 18, container vessel sea transport. Official listing: https://smartfreightcentre.org/news/13311209 ; publicly indexed official PDF: https://smart-freight-centre-media.s3.amazonaws.com/documents/GLEC_FRAMEWORK_v3.2_21_10_25_1.pdf . Industry-average **end-user well-to-wheel (WTW)** intensities, when trade-lane unknown: **dry 71.7 g CO2e/TEU-km**, **reefer 142.3 g CO2e/TEU-km**. GLEC specifies using measured filling rates or a default **10 tonnes per TEU**, with 6 tonnes for justified lightweight loads or 14.5 tonnes for heavyweight. **Preferred:** use trade-lane-specific container coefficients and an allocation method consistent with ISO 14083. Values verified from indexed version, but direct PDF retrieval can be restricted.
2. **UK Department for Energy Security and Net Zero, *2026 Government greenhouse gas conversion factors: methodology paper***, Table 44 (printed p. 104), https://assets.publishing.service.gov.uk/media/6a2940543b15d05a7ce3202e/2026-GHG-conversion-factors-methodology-report.pdf . Long-haul air freight **0.43 kg CO2e/t-km** in passenger aircraft, **0.62** dedicated cargo, **0.49** all-air weighted. These are CO2+CH4+N2O **direct operational factors before** the published distance uplift, WTT jet-fuel lifecycle, or treatment of non-CO2 aviation effects. The publication recommends **8% great-circle distance uplift**; do **not** apply twice if using factors already distance-uplifted from the full spreadsheet. The full reporting dataset may contain additional upstream-fuel factors.

## Units and fair comparisons

- **TEU-km**: one twenty-foot-equivalent container multiplied by km. **t-km**: one tonne of cargo multiplied by km. Do not compare a coefficient per TEU-km directly with a coefficient per t-km.
- At a **10-tonne/TEU** standard allocation, dry and reefer values equate to **0.00717 and 0.01423 kg CO2e/t-km**, respectively. These are *conditional conversions*, not universally valid emission intensities for light roasted coffee.
- **Shipping volume** may constrain container fill before weight. Model actual observed fill where available, and explicitly distinguish allocating container-service emissions from pricing/freight chargeable weight.
- **Air at 0.49 is not fully WTW** and cannot be fairly paired with GLEC WTW ocean factors without WTT adjustments. Contrail and NOx climate impacts have a different uncertainty and equivalence basis; show a separate sensitivity output rather than unqualified CO2e.
- **Real transport routing:** use sea route distances for vessel routes and airport-to-airport plus inland legs for air, rather than applying a single great-circle distance to both.
- **Precision:** do not claim certification or route-level validation from industry-average factors. Model uncertainty is greater than the displayed decimal precision.

## Implementation priority for Codex

1. Preserve the GLEC-linked 0.0717 / 0.1423 sea defaults, correct annotations, and add trade-lane selection later.
2. Keep the existing air 0.60 as a plainly labelled *screening placeholder* until the full WTW 2026 factor (including WTT) can be computed consistently. In an advanced dropdown, offer documented direct-air benchmarks (0.43/0.49/0.62), but never silently substitute a direct-only factor for WTW values.
3. Remove default checked use of **167 kg/m³ commercial volumetric weight** as an emissions allocation without evidence; let users inspect physical mass and cargo volume separately. Carrier emissions allocations should follow GLEC/ISO methodology rather than pricing rules.
4. Keep per-scenario provenance and source year visible, with uncertainty notes in exported CSV.

## Frozen reefer distinction
See `FROZEN-FREIGHT.md`. The GLEC generic reefer TEU-km coefficient is not a verified frozen (-18 °C) coefficient.
