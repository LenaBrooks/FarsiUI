# Recipes

Complete, copy-ready flows. Front-end recipes call the **same-origin proxy** from `../scripts/proxy-server.mjs`
(so the REST service key never reaches the browser) and draw with the MapLibre SDK (`../references/web-sdk.md`).
Code in the recipes is JavaScript for the browser unless the title says otherwise.

| # | Recipe | Uses |
|---|---|---|
| 01 | Place search box -> marker -> POI details | Search v3, POI details |
| 02 | Route with ETA drawn on the map (+ alternatives, step list) | Routing v4 |
| 03 | Tap the map to get an address | Reverse geocoding |
| 04 | Delivery run: best order, real route, totals (Python) | TSP, Routing |
| 05 | "Reachable in N minutes" overlay | Isochrone v2 |
| 06 | Address form with confidence check | Geocoding plus |
| 07 | Next.js integration (client map + route handlers) | MapLibre + all of the above |

Run the demo stack: `NESHAN_API_KEY=<service key> STATIC_DIR=./public node scripts/proxy-server.mjs`, copy
`assets/map-template.html` to `./public/index.html`, put a **web map key** in `MAP_KEY`, and set `ROUTE_ENDPOINT`/`REVERSE_ENDPOINT`.
