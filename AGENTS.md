# Codex instructions — Roasting at Origin

You are working on a Barista Hustle educational calculator. Optimise for scientific defensibility, transparent uncertainty, readable mobile UX and British English.

1. Read `README.md` and all docs under `docs/` *before* changing the emissions equations.
2. Preserve a running app and existing UI and CSV functionality. Record changes and add regression tests before substantial refactors.
3. Do not present currently hard-coded freight rates, packaging densities, TEU allocations, or route distances as source-validated. Show uncertainty and editable inputs clearly.
4. Keep **functional unit** fixed: the same finished roasted-coffee output in each pathway; default green coffee mass is input, with roast yield `(1-loss)`.
5. Explicitly distinguish fuel combustion and electricity emissions, WTW/TTW/WTT boundaries, CO₂ vs CO₂e, radiative forcing, and transport activity units. Never silently combine incompatible definitions.
6. Treat air shipment as a **user-reported GGET-style scenario**, not verified fact about Go Get Em Tiger. Don't infer actual company emissions.
7. Keep shipping packaging separate from destination retail packaging. Traditional green-coffee freight uses green sacks; consumer bags used only after roasting.
8. Do not convert freight *billing* weight into *physical emissions* without a defended allocation method. This is a known deficiency in V1.
9. Avoid attributing provenance to source factors unless the exact table, row, year, conversion and scope are checked; attach source URL, access date and page/table in source registry.
10. Use British spelling; write instructive labels and captions and avoid making strong comparative claims from screening values.
11. Validate numeric inputs and model pathological cases; avoid NaN/Infinity output.
12. Every quantitative default should have: number, unit, basis, source or 'illustrative', confidence, and notes.

Suggested implementation order: tests/fixtures -> input validation -> source registry & boundaries -> freight method calibration -> route logic -> roaster-energy model -> packaging audit -> UI improvements. Preserve editable assumptions throughout.


Frozen transport must stay distinct from chilled reefer. Read `docs/FROZEN-FREIGHT.md` and never present baseline-only results as temperature-calibrated frozen emissions.
