# Manual regression scenarios

Run in browser (or automate with Playwright after project setup). Use numeric tolerance appropriate for display rounding.

1. **Initial load:** choose Colombia → Los Angeles, 1,000 kg green, 15% loss. Green output = 1000 kg, roasted output = 850 kg. No errors or negative values.
2. **Same transport and roasting:** set both pathways to dry sea, roasting input 0.42 in both, 1 kg package in both. Expect similar roasting emissions; origin transported mass smaller but **volume larger** and may allocate more freight. Packaging should differ only from green sack treatment in traditional.
3. **Air preset:** traditional sea, origin air. Origin should usually show higher freight emissions for default route, but avoid hard-coding a verdict as user-editable factors may reverse it.
4. **Reefer preset:** traditional sea, origin reefer. Verify origin freight changes to reefer factor and road/roasting unaffected.
5. **Switch retail packing traditional:** 1 kg → 300 g retail. Green international shipping volume and shipment mass must NOT change; final packaging manufacture emissions SHOULD change.
6. **Switch origin packaging:** 1 kg → 300 g retail. Origin shipment volume and packaging emissions SHOULD change.
7. **Mass scaling:** with identical settings, doubling green mass should double roasting and material mass; full-container rounding can make freight non-linear.
8. **Break-even:** set origin roasting emissions to zero. If origin non-roasting emissions exceed traditional total, display zero-roast cannot break even.
9. **Guardrails:** no NaN or Infinity from zero shipment, zero denominator, impossible efficiencies, oversized roast loss, distances or negative inputs. Known V1 behaviour should be improved where necessary.
10. **CSV:** columns match labels, routes and selected settings; reconcile with displayed totals.
11. **Responsive:** 375px mobile viewport with no cut-off controls and usable charts.
