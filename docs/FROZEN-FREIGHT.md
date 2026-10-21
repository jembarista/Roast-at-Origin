# Frozen versus chilled marine freight — required model distinction

**Frozen (-18 °C as the initial setpoint) is not synonymous with a generic refrigerated/reefer container.** A reefer can carry chilled or frozen cargo; power demand depends on outdoor temperature, cargo load, target temperature, insulation, compressor, defrost cycles, voyage duration, electrical generation and pre-cooling.

## Evidence
- Australian Meat Processor Corporation (AMPC), *Warming the frozen* (2025): https://www.ampc.com.au/media/gkekch2x/ampc_final_report-_2024_1058.pdf?ext=.pdf , table 2 models 40-ft frozen meat shipping at -25,-22,-18,-15,-12 °C. At -18 °C: **5.4 kWh per tonne of product per day**; at -12 °C: **4.8 kWh/t/day**. These are modelling results specific to frozen meat, its loading and their grid assumption; **not direct coffee coefficients, nor generic ship reefer baselines**. PDF page numbers and table boundaries should be checked before publication.
- Smart Freight Centre GLEC 3.2: https://smartfreightcentre.org/news/13311209 has sea transport values for dry and reefer containers, but generic reefer factors cannot on their own establish emissions at a frozen temperature setpoint.
- ISO 14083:2023 https://www.iso.org/standard/78864.html provides transport-chain carbon-accounting methodology.

## Current implementation (screening only)
- Transport modes now include **dry sea**, **chilled reefer (generic)**, **frozen container (-18 °C)**, and **air** for either pathway.
- Frozen transport = generic GLEC reefer TEU-km × allocated TEUs × distance + **incremental** electricity kWh per TEU per day × transit days × kg CO2e/kWh × allocated TEUs.
- The incremental-energy default is **zero because no defensible coffee-specific adjustment has been established**. A bold warning is shown for frozen mode when it remains zero. This is a baseline-only result, **not an assertion that freezing consumes the same electricity as chilling**.
- Never add a full reefer refrigeration estimate to the GLEC reefer factor: that may double count cooling. Only add independently established *incremental* electricity above its reefer reference condition, or instead replace the whole refrigeration component using disaggregated carrier data.
- Additional cold-store power, cargo pre-freezing, refrigerant leakage, defrost and thaw handling should have distinct boundaries to avoid double-counting. Coffee may be stored frozen for quality preservation but whether it is pre-frozen, maintained continuously frozen or transported merely in an insulated container must be user-entered, not inferred from GGET.

## Codex research priorities
1. Obtain manufacturer/shipper records for kWh/TEU/day at -18 °C versus +4 °C under comparable ambient temperatures and container types, plus vessel generator emission factor.
2. Clarify whether GLEC generic reefer intensities include refrigeration plant energy (do not assume they exclude it).
3. Permit temperatures such as -18 °C, -20 °C, -25 °C and chilled +4 °C with a documented, temperature-sensitive refrigeration submodel.
4. Add port power, road reefer operation, cold storage at each end and loading/cooling to boundaries explicitly.

## Standalone energy extension — 21 October 2026

The new Frozen Container Energy panel estimates full refrigeration electricity separately. It does not alter the legacy baseline/incremental equation above. Its onboard factor is initially unknown, not the legacy 0.7 proxy. Method A never adds full electricity emissions to GLEC; evidence-gated Method B is a separate research total. See [FROZEN-ENERGY.md](FROZEN-ENERGY.md) for boundaries, sources, allocation differences and tests.
