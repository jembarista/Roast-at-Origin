# V1 default assumptions register

Statuses: **BH published benchmark**, **illustrative** (unvalidated), **heuristic**, or **user-reported**. These describe what is presently in `index.html`, *not verified new factors*.

| ID / control | Default | Unit | Status / provenance | Action |
|---|---:|---|---|---|
| green mass `mass` | 1000 | kg green | user-entered example | keep editable |
| roasting loss `loss` | 15 | % of green mass | illustrative representative | verify range by roast and coffee |
| `tradRoast` | 0.42 | kg CO₂e/kg green | BH Decision Tree cites Phrommarat (2019), gas fuel only | clarify boundary / separate fuel and grid |
| `originRoast` | 0.42 | kg CO₂e/kg green | same historical benchmark | replace with source/efficiency inputs |
| low roast benchmark | 0.19 | kg CO₂e/kg green | BH TDT 2.07 cites Killian/2008 German industrial | note study boundaries |
| high roast benchmark | 0.70 | kg CO₂e/kg green | BH TDT 2.07 cites Franco & Bartl (2018) gas input | not total mill+roast footprint |
| dry sea `dry` | 0.0717 | kg CO₂e/TEU-km | **GLEC v3.2 Table 18 industry-average WTW**, verified against indexed table values | replace with trade-lane coefficients where known |
| refrigerated sea `reef` | 0.1423 | kg CO₂e/TEU-km | **GLEC v3.2 Table 18 industry-average WTW**, verified against indexed table values | replace with trade-lane coefficients where known |
| air `airFactor` | 0.6 | kg CO₂e/tonne-km | **screening assumption, not directly sourced**; 2026 UK government long-haul all-air direct factor is 0.49 kg CO₂e/t-km (0.43 passenger belly, 0.62 dedicated freighter), BEFORE WTT fuel, distance uplift and aviation non-CO₂ | make boundaries consistent before replacing |
| assumed road `road` | 250 | km | **illustrative** | separate inland legs at both ends |
| road `roadFactor` | 0.1 | kg CO₂e/tonne-km | **illustrative** | calibrate fleet/weight/utilisation |
| `packFactor` | 2.5 | kg CO₂e/kg packaging | **illustrative all-material composite** | material-specific LCA needed |
| `teuVolume` | 28 | m³ usable/allocated TEU | **illustrative** | relate to equipment / usable volume |
| `teuPayload` | 20000 | kg per TEU | **illustrative** | verify route/equipment |
| `airVolume` | 167 | kg per m³ | **illustrative commercial chargeable-weight convention** | not an emissions factor |
| green bulk density | 705 | kg beans/m³ | secondary literature figure from earlier research; original study citation **not yet audited** | verify primary study and applicability |
| roast bulk density | 301 | kg beans/m³ | secondary literature figure; original study citation **not yet audited** | verify roast level and measurement |
| green sacks fill | 68 | % packing efficiency | **illustrative** | measure stacking / FIBC / sacks |
| bulk roast fill | 58 | % | **illustrative** | measure |
| 1kg bags fill | 45 | % | **illustrative** | obtain carton/case dimensions |
| 300g bags fill | 38 | % | **illustrative** | measure |
| green sack pack mass ratio | .015 | kg package/kg beans | **illustrative** | mass of actual sack, pallet, liner |
| bulk roast pack mass ratio | .025 | kg/kg | **illustrative** | measure |
| 1kg bag pack mass ratio | .045 | kg/kg | **illustrative** | measure |
| 300g bag pack mass ratio | .075 | kg/kg | **illustrative** | measure |
| air km | GC × 1.1 | km | **heuristic** | actual airport routing |
| sea km | max(GC × 1.4, GC+1200) | km | **heuristic** | actual port-to-port routing |
| GGET air shipping | selected in one preset | mode | **user-reported**, not publicly verified | do not attribute as verified statement |

**Separate published packaging comparison:** BH TDT 2.08 cites 0.13 kg CO₂ per kg green coffee from Tchibo/PCF Pilotprojekt Deutschland (2008). This is a *historical cross-check*, **not** the `packFactor=2.5` default and must not be substituted without matching denominator and boundary.

**Critical:** published roasting benchmarks above are not guaranteed methodologically equivalent: 0.70 is described by BH as natural gas used to roast, 0.42 is gas use, while 0.19 represents optimised industrial roasting. Documentation elsewhere quoting Franco & Bartl 0.318/0.744 per kg coffee uses different scenarios and perhaps different functional units. Do NOT equate these figures without checking original papers.


| frozen `freezeDays` | 25 | days | illustrative | use voyage-specific actual duration |
| frozen `freezeExtra` | 0 | incremental kWh/TEU/day above generic reefer | **unknown, not zero-emission assumption** | obtain temperature-differentiated evidence before scientific claims |
| frozen `freezeGrid` | 0.7 | kg CO₂e/kWh | illustrative ship power proxy | derive from generation fuel and efficient power supply |
