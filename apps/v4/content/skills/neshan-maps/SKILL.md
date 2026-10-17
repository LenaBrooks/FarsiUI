---
name: neshan-maps
description: "Neshan Maps Platform (نقشه نشان, platform.neshan.org), the Iranian map/routing/geocoding provider: REST APIs (routing with traffic, TSP, distance matrix, isochrone, map matching, VRP, search, geocoding, reverse geocoding, nearby, POI, region, static map) and SDKs (MapLibre web, React, Vue, Next.js, Android, iOS). Use when code or questions mention Neshan, api.neshan.org, @neshan-maps-platform, org.neshan.maplibre, or Iranian map needs (مسیریابی، ترافیک، ژئوکدینگ، جستجوی مکان، نقشه فارسی). Read the matching reference before writing code; reuse bundled scripts; never invent endpoint details."
---

# Neshan Maps

Neshan is Iran's map/routing platform. Two product families:

- **Web services (REST)** at `https://api.neshan.org`, key in header `Api-Key`.
- **Map SDKs** (web, Android, iOS) with a *map key*.

Docs: https://platform.neshan.org/docs/ (the site blocks automated fetching; do not rely on being able to open it).
This skill holds the verified knowledge. Answer in the user's language (usually Persian); code, identifiers and
parameter names stay in English.

Companion files live next to this `SKILL.md` (`references/`, `recipes/`, `scripts/`, `assets/`).
If installed via the Cursor ZIP that unpacks into `.cursor/`, the same files are under `.cursor/neshan-maps/`
and the Agent Requested rule is `.cursor/rules/neshan-maps.mdc`.

## Workflow

1. **Classify the request**: REST call, map display, or both. Note platform/framework (vanilla web, React, Next.js, Vue,
   Android, iOS, Python/Node backend). If it truly changes the answer and is unknown, ask **one** short question; otherwise
   pick the defaults below and state the assumption.
2. **Read the matching reference** (table below) before writing code. They contain verified parameter tables,
   response shapes, units and documented bugs. Do not answer endpoint/parameter details from memory.
3. **Reuse the bundled code** instead of rewriting it: `scripts/neshan.py`, `scripts/neshan.mjs` (clients with
   validation, retries, polyline decoding), `scripts/proxy-server.mjs` (key-safe proxy), `scripts/plan_delivery.py`,
   `assets/map-template.html`, and the recipes.
4. **Apply the safety rules and the checklist** below.
5. **Say what you could not verify.** If a detail is not in the references (rate limits, matrix size limits, tile
   details...) state that it is undocumented rather than inventing it.

Defaults when unspecified: new web map -> **MapLibre SDK**; REST from a **backend/proxy**; route with traffic
`/v4/direction`; address lookup `/geocoding/v1/plus`; coordinates in REST requests `lat,lng`.

## Which file to read

| Task | Read | Also |
|---|---|---|
| Keys, coordinate order, units, error codes, versions, doc bugs | `references/conventions.md` | always skim first |
| Directions/ETA (traffic, no-traffic, typical, predictive, walking) | `references/routing.md` | `recipes/02-route-on-map.md` |
| TSP, distance matrix, isochrone, map matching, logistics/VRP | `references/optimization.md` | `recipes/04`, `recipes/05` |
| Search, geocoding, reverse, nearby, POI details, region | `references/places.md` | `recipes/01`, `03`, `06` |
| Map as an image (emails, previews) | `references/static-maps.md` | |
| Web map: MapLibre, Leaflet, OpenLayers, React, Vue | `references/web-sdk.md` | `assets/map-template.html`, `recipes/07` |
| Android, iOS (new and legacy) | `references/mobile-sdk.md` | |
| Something is failing | `references/troubleshooting.md` | |
| End-to-end flows | `recipes/README.md` | |

## Hard rules (each one prevents a real bug)

1. **Coordinate order.** REST request points are `lat,lng`; MapLibre/GeoJSON/Mapbox are `[lng, lat]`; map-matching responses are
   `[lat, lng]`; search/POI `location` is `{x: lng, y: lat}`. Convert explicitly at every boundary. Full table in `conventions.md`.
2. **Keep REST keys off the front end.** Browser -> your backend/proxy -> Neshan. Only the SDK *map key* may be in client code,
   read from env/config, never committed, restricted by domain in the panel.
3. **Right key in the right place.** REST: header `Api-Key`. **Static Map: `key` query param.** SDK: `apiKey` (MapLibre), `key`
   (Leaflet/OpenLayers), manifest meta-data (Android), `MLNApiKey` (iOS). Wrong key type -> `483`.
4. **Polylines**: Encoded Polyline, precision 5; use `routes[i].overview_polyline.points` (an object!) or `steps[j].polyline`;
   predictive routing uses `geometry`. Use the bundled decoder; swap to `[lng, lat]` for maps.
5. **Totals** = sum over `legs`; units: meters and seconds in `.value` (Persian display text in `.text`).
6. **Errors**: never retry `480/481/483/484/485`; back off on `482/5xx/503`; show friendly states for `404`, `NoRouteFound`,
   `unMatchedTerm`, matrix `status != Ok`, VRP `unassignedJobs`.
7. **Map lifecycle**: create the map client-side only (no SSR), import the SDK CSS, give the container a height, add sources/layers
   after `load`, remove old sources/layers before re-adding, call `map.remove()` on unmount.
8. **Escape API text** (place names, addresses) before inserting into HTML.
9. **Do not use expired SDKs for new work**: web Mapbox GL SDK, Android/iOS legacy SDKs, WordPress add-on are marked
   expired/deprecated in the docs. Recommend MapLibre-based SDKs.
10. **Region and Active-Services APIs need activation** through a support ticket in the panel; say so before building on them.

## Documentation inconsistencies to flag when you rely on them

- Static Map parameter descriptions swap latitude/longitude; the names and sample are right.
- Pedestrian routing: endpoint section says `/v4/direction`, samples use `/v1/direction` (client helper tries both).
- Predictive routing `duration` is documented as minutes but behaves like seconds; the sample has a stray `%09`.
- `overview_polyline` is documented as a string-like "Encoded Polyline" but is `{ "points": ... }`.
- Leaflet docs promise six styles but list two (`dreamy`, `standard-night`).

## Using the bundled code

```bash
# Python client (stdlib only) and tests
python3 scripts/test_neshan.py && python3 scripts/test_plan_delivery.py
# Node client, proxy and template tests (Node >= 18)
node --test scripts/test_neshan.mjs && node scripts/test_proxy.mjs && node scripts/test_template.mjs
# Key-safe proxy + static front-end
NESHAN_API_KEY=... STATIC_DIR=./public node scripts/proxy-server.mjs
# Delivery plan
NESHAN_API_KEY=... python3 scripts/plan_delivery.py stops.json > plan.geojson
```

Copy the scripts into the user's source tree (they have no dependencies) and adapt; do not leave production code importing from the skill folder.
The clients validate inputs (swapped lat/lng, ranges, mutually exclusive params) so mistakes fail fast with a clear message; set
`NESHAN_NO_COORD_CHECK=1` to disable the swapped-coordinate guard (Neshan covers Iran only).

## Answer checklist

- [ ] Read the relevant reference; used the latest endpoint version.
- [ ] Key placement correct; no service key in browser code; key from env.
- [ ] Coordinate order correct at each boundary; polyline decoded with precision 5 and swapped.
- [ ] Query values encoded; JSON params (`q`, `json`) stringified then encoded; `|` as `%7C`.
- [ ] Error handling per `conventions.md` section 6; empty/no-result states handled.
- [ ] For maps: client-only creation, CSS, container height, cleanup.
- [ ] Persian UX where relevant: `lang="fa"` / `dir="rtl"`, Persian strings, RTL-safe layout.
- [ ] Mentioned any doc inconsistency or unverified assumption you relied on, and what was and was not tested.

## Scope notes

- Neshan data/coverage is Iran; do not promise worldwide results.
- Live-traffic, predictive and odd-even/traffic-zone features matter mainly for Tehran, Mashhad, Karaj (predictive is limited to those three).
- Pricing/quota/limits beyond what `conventions.md` lists are not in the docs bundled here; direct the user to the panel or support (platform@neshan.org).
- A Neshan MCP server exists (GitHub `NeshanMaps/Neshan-MCP`, listed in MCP directories; not reviewed here). If a user wants live tool calls from an AI client rather than app code, mention it.
