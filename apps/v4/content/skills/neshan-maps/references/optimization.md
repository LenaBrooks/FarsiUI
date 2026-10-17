# Optimisation and analysis APIs

TSP, Distance Matrix, Isochrone, Map Matching, Logistics (VRP). Shared rules: `conventions.md`.

## Which one?

| Goal | API |
|---|---|
| Order N stops for **one** vehicle | TSP `GET /v3/trip` |
| Durations/distances between many origins and many destinations | Distance Matrix |
| Area reachable within X minutes or X km | Isochrone `GET /v2/isochrone` |
| Clean a noisy GPS trace onto roads | Map Matching `POST /v3/map-matching` |
| Assign many jobs to many vehicles with capacities, time windows, skills | Logistics `POST /vrp/logistic` |

Typical delivery pipeline: Matrix (cost sanity) or VRP (multi-vehicle) -> TSP (single vehicle order) ->
Routing with the final order (to get geometry and turn-by-turn) -> draw on map.

## TSP: `GET /v3/trip`

Returns **only the optimal order of the input points**, no geometry, distance or duration. Feed the
reordered points to Routing for the actual route.

| Param | Req | Notes |
|---|---|---|
| `waypoints` | yes | `lat,lng\|lat,lng\|...` |
| `roundTrip` | no | return to the start. Default `true` |
| `sourceIsAnyPoint` | no | `true` (default): the service picks the best start. `false`: first waypoint is the start |
| `lastIsAnyPoint` | no | `true` (default): the service picks the best end. `false`: last waypoint is the end |

Response: `{ "points": [{ "name": "<nearest road>", "location": [lng, lat], "index": <original index 0-based> }, ...] }`
already in optimal order. Use `index` to map back to your own records:

```python
trip = nz.trip(stops, round_trip=False, source_is_any_point=False, last_is_any_point=False)
ordered = [stops[p["index"]] for p in trip["points"]]
```

To pin both start and end, use `sourceIsAnyPoint=false` and `lastIsAnyPoint=false` with `roundTrip=false` (first waypoint = start,
last waypoint = end). The docs do not say how `roundTrip=true` combines with `lastIsAnyPoint=false`; avoid that pairing.
The response may or may not repeat the start point at the end of a round trip; skip duplicates by `index`.

## Distance Matrix

Endpoints: `GET /v1/distance-matrix` (live traffic) and `GET /v1/distance-matrix/no-traffic`.

| Param | Req | Notes |
|---|---|---|
| `type` | no | `car` (default) or `motorcycle` |
| `origins` | yes | `lat,lng\|...` |
| `destinations` | yes | `lat,lng\|...` |

Response:

```json
{ "status": "Ok",
  "rows": [ { "elements": [ { "status": "Ok",
        "duration": { "value": 699, "text": "۱۲ دقیقه" },
        "distance": { "value": 8332, "text": "۸ کیلومتر" } } ] } ],
  "origin_addresses": ["36.317559,59.532226"], "destination_addresses": ["36.350681,59.545227"] }
```

- `rows[i].elements[j]` = origin i -> destination j. Meters / seconds.
- Per-element `status`: `Ok`, `NoRoute`, `UnknownError`. `distance`/`duration` exist only when `Ok`: always check.
- `origin_addresses`/`destination_addresses` echo the input coordinates (not street addresses).
- No documented maximum on matrix size; keep requests reasonable (URL length) and batch if large **[inferred]**.

## Isochrone: `GET /v2/isochrone`

| Param | Req | Notes |
|---|---|---|
| `latitude`, `longitude` | yes | center (separate params in v2) |
| `time` | one of | **minutes** |
| `distance` | one of | **kilometres** |
| `dataset` | no | `PRIMARY` (car, live traffic), `TYPICAL`, `NO_TRAFFIC`, `MOTORCYCLE`, `BICYCLE`, `PEDESTRIAN` |
| `polygons` | no | `true` -> `Polygon`, else `LineString`. Default false. (v1 called it `polygon`) |
| `denoise` | no | 0..1 simplification, higher = fewer points. Default 0 |

`time` and `distance` together -> `400` "only one of time or distance is allowed"; send two requests if you need both.
Invalid `dataset` -> `400` with `field: "dataset"` and the allowed values.

Response is GeoJSON `FeatureCollection` with `properties.metric` (`time`|`distance`) and `geometry`
(`Polygon`/`LineString`) in **`[lng, lat]`**. The first and last coordinate are identical (closed ring), which is normal.
Add it to MapLibre as a `geojson` source with a `fill` layer: `../recipes/05-isochrone-on-map.md`.

## Map Matching: `POST /v3/map-matching`

Body `{"path": "lat,lng|lat,lng|..."}` with **2 to 1000 points**. Headers: `Api-Key`, `Content-Type: application/json`.

Response:

```json
{ "snappedPoints": [ { "location": [35.70015, 51.38825], "originalIndex": 0 } ],
  "geometry": "<encoded polyline>" }
```

- `snappedPoints[].location` is **`[lat, lng]`** (every other array in the platform is `[lng, lat]`).
- Unmatchable input points are dropped from `snappedPoints`; use `originalIndex` to align with your input.
- `geometry` is the encoded polyline of the whole matched path.

## Logistics / VRP: `POST /vrp/logistic`

Headers: `Api-Key`, `Content-Type: application/json`. Body fields:

| Field | Req | Notes |
|---|---|---|
| `vehicles[]` | yes | see below |
| `jobs[]` | yes | see below |
| `depot` | no | `{latitude, longitude}`; used as start/end for vehicles that lack `start`/`end` |
| `solutionStrategy` | no | `STRICT` (default: answers only if **all** jobs fit, otherwise empty routes) or `BEST_EFFORT` (assign as many as possible, return the rest unassigned) |
| `costType` | no | `DISTANCE` (default) or `DURATION` |
| `explorationLevel` | no | `FAST`, `MEDIUM` (default), `THOROUGH` |
| `routingEngine` | no | `typical` (default), `primary` (live traffic), `notraffic`, `motorcycle`, `bicycle`, `foot` |
| `balanceWorkload` | no | balance distance/time across vehicles. Default false |
| `useTimeBalancing` | no | balance working time. Default false |
| `useTrafficMultiplier` | no | traffic multiplier in optimisation. Default false. **Requires `routingEngine: "notraffic"`** |
| `planTime` | no | start of the logistics process; used with the traffic multiplier. The docs sample uses `16200` (unit not stated, looks like seconds since midnight, i.e. 04:30) **[inferred, verify]** |

Vehicle: `id` (int, unique, required), `capacity` (int, required), `timeWindow {from, to}` (`HH:mm:ss`, required),
`start {latitude, longitude}` and `end {...}` (required unless `depot` is given), optional `maxDistance` (int),
`skills` (int array), `excludeZones` (`["TRAFFIC", "ODD_EVEN"]`).

Job: `id` (int, unique, required), `location {latitude, longitude}` (required), `timeWindows [{from, to}]`
(required, `HH:mm:ss`), optional `setUpTime` and `serviceTime` (seconds), `delivery` and `pickup` (load units),
`priority` (lower number = higher priority), `skills` (int array).

Rules from the docs: all `id`s unique across the request; times are `HH:mm:ss`; per route, the sum of
`pickup` and `delivery` must not exceed the vehicle `capacity`.

Response:

```json
{ "routes": [ { "vehicleId": "2", "distance": 38515, "duration": 5812, "geometry": "<polyline>",
     "steps": [ {"type":"start"}, {"id":102,"type":"job"}, {"id":104,"type":"job"}, {"type":"end"} ] } ],
  "summary": { "distance": 89902, "duration": 12224, "routesCount": 2, "unassignedCount": 0 },
  "unassignedJobs": [], "violationMessages": [] }
```

`vehicleId` is a **string** in the response although `id` is an int in the request. Step types: `start`, `end`,
`job`, `pickup`, `delivery`. Always check `summary.unassignedCount`, `unassignedJobs` and `violationMessages`.

Minimal payload (taken from the docs sample, trimmed):

```json
{ "solutionStrategy": "STRICT", "costType": "DURATION", "routingEngine": "primary",
  "vehicles": [ { "id": 1, "capacity": 5, "timeWindow": {"from": "06:00:00", "to": "17:00:00"},
                  "start": {"latitude": 35.665, "longitude": 51.415}, "end": {"latitude": 35.665, "longitude": 51.415} } ],
  "jobs": [ { "id": 101, "location": {"latitude": 35.683, "longitude": 51.365},
              "serviceTime": 300, "delivery": 3, "timeWindows": [ {"from": "06:00:00", "to": "18:00:00"} ] } ] }
```

Traffic-multiplier variant: same payload plus `"useTrafficMultiplier": true`, `"routingEngine": "notraffic"`, `"planTime": ...`.
