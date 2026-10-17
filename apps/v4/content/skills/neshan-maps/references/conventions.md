# Conventions shared by every Neshan API and SDK

Read this once per task. Everything below was verified against the official docs
(platform.neshan.org/docs, snapshot 2026-10-11) unless marked **[inferred]** or **[docs bug]**.

## 1. Keys

- Free signup and key issuance: `https://platform.neshan.org/panel`.
- Keys are issued per product type. The docs and the charge API name at least two: **WebService**
  (REST APIs) and **WebSite** (web map SDKs; the panel option is called "نقشه وب"/web map).
  The wrong type returns `483 ApiKeyTypeError`.
- Keys can be scoped in the panel (allowed domains/IPs; service list). Violations return `484`/`485`.
- Where the key goes:

| Surface | Key location |
|---|---|
| REST APIs (routing, search, geocoding, matrix, ...) | HTTP header `Api-Key: <KEY>` |
| Static Map, Static Map Arc | **query parameter** `key=<KEY>` (no header) |
| MapLibre web SDK | `apiKey` option of `new maplibregl.Map({...})` |
| Leaflet / OpenLayers web SDK | `key` option (plus `maptype`) |
| Mapbox GL web SDK (expired) | `mapKey` option |
| React / Vue components | `mapKey` prop |
| Android (new SDK) | `<meta-data android:name="org.maplibre.android.API_KEY" android:value="..."/>` inside `<application>` |
| iOS (new SDK) | `MLNApiKey` string in `Info.plist` |

- Never put a REST (WebService) key in a public front-end bundle. Call REST APIs from a backend, or
  proxy them. Map SDK keys are meant for browsers/apps; restrict them by domain in the panel.
- Read keys from env/config (`NESHAN_API_KEY`), never hard-code them in committed code.
- `GET /account-inquiry/v1/services` lists which services a key may call (must be activated through a
  support ticket). `GET /account-inquiry/v1/remaining-charge` returns credit; `paidCharge` **can be negative**.
- Region API and Active Services API require activation via a support ticket in the panel.

## 2. Coordinate order (the #1 source of bugs; Iran is lat 25-40, lng 44-64, so a swap is silent)

| Where | Order |
|---|---|
| REST request params `origin`, `destination`, `waypoints`, `origins`, `destinations`, `path`, `location`, `waypoints` (TSP) | `lat,lng` string, points joined by `\|` |
| REST params as separate fields: reverse (`lat`,`lng`), isochrone v2 (`latitude`,`longitude`), static map (`latitude`,`longitude`) | named |
| JSON objects in requests: search `center`, geocoding `location`/`extent`, VRP `start`/`end`/`location`/`depot` | `{latitude, longitude}` |
| Routing response `step.start_location` | `[lng, lat]` |
| TSP response `points[].location` | `[lng, lat]` |
| **Map matching response `snappedPoints[].location`** | **`[lat, lng]`** (opposite of the others) |
| Predictive routing `step.location` | `{longitude, latitude}` object |
| Search and POI-details `location` | `{x: longitude, y: latitude}` |
| Geocoding / nearby response `location` | `{latitude, longitude}` |
| Isochrone response (GeoJSON) and region `geometry` (WKT) | `[lng, lat]` / `lng lat` |
| MapLibre / GeoJSON / Mapbox / Leaflet-style `center`, `setLngLat`, `maxBounds`, event `lngLat` | `[lng, lat]` (Leaflet itself uses `[lat, lng]`, see `web-sdk.md`) |
| Android `LatLng(lat, lng)`, iOS `CLLocationCoordinate2D(latitude:longitude:)` | named |
| `polyline.decode(...)` output | `[lat, lng]`, convert before giving it to MapLibre |

## 3. Units

| API | distance | duration |
|---|---|---|
| Routing (traffic, no-traffic, typical, pedestrian) | `distance.value` meters (+ Persian `text`) | `duration.value` **seconds** |
| Predictive routing | `distance` meters | `duration` documented as **minutes** but the sample (694 m in `139`) only makes sense as seconds **[docs bug, verify]** |
| Distance matrix | meters | seconds |
| Nearby | `distance` meters of **travel** distance (can exceed the search radius) | `duration` seconds |
| VRP | meters | seconds |
| Isochrone input | `distance` in **km**, `time` in **minutes** | |

Text fields (`text`) are Persian strings with Persian digits; use `value` for logic.

## 4. Request encoding

- Percent-encode every query value. `|` -> `%7C`, `,` -> `%2C` (the service accepts either form for `,`).
- JSON-in-query params: `q` (search) and `json` (geocoding) are JSON strings, `encodeURIComponent(JSON.stringify(obj))`.
- Booleans are the strings `true`/`false`.
- POST endpoints (`/v3/map-matching`, `/vrp/logistic`) take a JSON body with `Content-Type: application/json`.
- Responses are JSON, except Static Map which returns an image.

## 5. Encoded polylines

Routing geometry is the Google Encoded Polyline format, **precision 5**.
- Traffic/no-traffic/typical/pedestrian: `routes[i].overview_polyline.points` (note: an **object** with `points`, even though the docs table says "Encoded Polyline") and `steps[j].polyline` (a string).
- Predictive routing: `routes[i].geometry` and `steps[j].geometry`.
- Map matching: `geometry`. VRP: `routes[i].geometry`. Precision of these two is not stated; assume 5 and sanity-check that the decoded points are in Iran.
- `scripts/neshan.py` / `neshan.mjs` provide `decode_polyline` + `route_geometry` (tested against the doc samples).

## 6. Errors (same table in all APIs)

| HTTP | Name | Meaning | Action |
|---|---|---|---|
| 400 | INVALID_ARGUMENT | bad parameters (e.g. isochrone with both `time` and `distance`: "only one of time or distance is allowed") | fix the call |
| 404 | NOT_FOUND | listed for Nearby, POI details, VRP | handle as "no result" |
| 470 | CoordinateParseError | invalid coordinates | validate/swap check |
| 480 | KeyNotFound | invalid key or missing `Api-Key` header | config |
| 481 | LimitExceeded | quota exceeded | alert; **do not retry** |
| 482 | RateExceeded | per-minute rate exceeded | exponential backoff |
| 483 | ApiKeyTypeError | key type does not match the service | use the right key type |
| 484 | ApiWhiteListError | key scope forbids this caller (domain/IP) | fix the scope or caller |
| 485 | ApiServiceListError | service not enabled for the key | enable the service |
| 500 | GenericError | unknown | retry once or twice |
| 503 | render_timeout / overloaded | Static Map only | retry with backoff |

Routing can also fail with a `NoRouteFound` error body (see `routing.md`).
A legacy-SDK FAQ mentions an account being suspended when debt exceeds 100,000 toman or the balance stays
negative for 24 hours, and trouble above 500 requests/minute. Treat unexplained 48x failures as a billing/limit check.

## 7. Versions (use the latest; older versions are only kept in the docs)

| Service | Latest | Older |
|---|---|---|
| Routing with traffic | `/v4/direction` | `/v3/direction`, `/v2/direction` |
| Routing no traffic | `/v4/direction/no-traffic` | `/v2/direction/no-traffic` |
| Predictive | `/v1/direction/historical` | |
| Typical | `/v1/direction/typical` | |
| Pedestrian | see `routing.md` (**docs inconsistent**) | |
| TSP | `/v3/trip` | |
| Distance matrix | `/v1/distance-matrix`, `/v1/distance-matrix/no-traffic` | |
| Isochrone | `/v2/isochrone` | `/v1/isochrone` (`location=lat,lng`, `polygon` singular) |
| Map matching | `/v3/map-matching` (POST) | `/v2/map-matching` |
| VRP | `/vrp/logistic` (POST) | |
| Search | `/v3/search` | `/v1/search` |
| Geocoding | `/geocoding/v1`, `/geocoding/v1/plus` | `/v4/geocoding`, `/v6/geocoding` pages exist |
| Reverse geocoding | `/v5/reverse` | `/v2/reverse` |
| Nearby / POI details | `/v1/nearby`, `/v1/point` | |
| Region | `/v2/region/...` | |
| Static map / arc | `/v5/static`, `/v5/static/arc` | |

## 8. Documentation inconsistencies found (flag them to the user when you rely on one)

1. **Static map**: the parameter table describes `latitude` as longitude and `longitude` as latitude. The sample (`latitude=32.657307&longitude=51.677579`, which is Isfahan) shows the names mean what they say.
2. **Pedestrian routing**: the Endpoint section says `/v4/direction`; every sample uses `/v1/direction?type=pedestrian` (one sample also has a missing `&` before `bearing`).
3. **Predictive routing**: `duration` documented as minutes, looks like seconds; sample request contains a stray tab in `routingType%09`, do not copy it.
4. **Routing `overview_polyline`**: described as an Encoded Polyline, actually `{ "points": "..." }`.
5. **Leaflet docs** say "six map styles" but list two (`dreamy`, `standard-night`).
6. The shared URL-encoding table in the docs has a corrupted `|` row; the correct value is `%7C`.
