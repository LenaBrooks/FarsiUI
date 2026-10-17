# Routing APIs (direction / ETA)

All are `GET`, header `Api-Key`, coordinates `lat,lng`. Shared rules: `conventions.md`.

## Choosing the right routing API

| Need | API | Endpoint | Vehicles |
|---|---|---|---|
| Best route + ETA right now with live traffic | Routing (traffic) | `GET /v4/direction` | `car`, `motorcycle` |
| Route using fixed per-road speeds (no live traffic) | No-traffic | `GET /v4/direction/no-traffic` | `car` only |
| Route from typical (recurring) traffic patterns | Typical | `GET /v1/direction/typical` | `car` |
| ETA/route for a **future** time (next 7 days) | Predictive | `GET /v1/direction/historical` | no `type` param; **Tehran, Mashhad, Karaj only** |
| Walking | Pedestrian | `GET /v4/direction?type=pedestrian` (docs inconsistent, see below) | `pedestrian` |
| Many-to-many durations | Distance matrix | see `optimization.md` | |
| Visiting order for many stops | TSP | see `optimization.md` | |

Default choice for "route from A to B": traffic v4.

## Request parameters: traffic, no-traffic, typical (identical shape)

| Param | Req | Notes |
|---|---|---|
| `type` | yes | `car` or `motorcycle` (traffic). `car` only for no-traffic and typical. |
| `origin` | yes | `lat,lng` |
| `destination` | yes | `lat,lng` |
| `waypoints` | no | intermediate points `lat,lng\|lat,lng` (encode `\|` as `%7C`) |
| `avoidTrafficZone` | no | `true` avoids the traffic-restriction zone (طرح ترافیک). Default false |
| `avoidOddEvenZone` | no | `true` avoids the odd-even zone (طرح زوج و فرد). Default false |
| `alternative` | no | `true` also returns alternative routes when available. Default false |
| `bearing` | no | 0-360 degrees from north, hint for the initial heading |

Zone gotcha: outside Tehran the "traffic zone" name is often used for the odd-even zone. If either
avoid flag is `true` in another city and the destination is inside that city's odd-even zone, the API
returns **`NoRouteFound`**. Only set the flags when the user asked for them.

Pedestrian params: `type=pedestrian`, `origin`, `destination`, `waypoints`, `alternative`, `bearing`
(no avoid-zone flags).

Predictive params: `origin`, `destination`, `routingType` (`DepartAt` | `ArriveAt`), `dateTime`
(`YYYY-MM-DDThh:mm`, valid from now to +7 days, no timezone suffix), optional `avoidTrafficZone`,
`alternative` (up to 2 alternatives).

## Response (traffic / no-traffic / typical / pedestrian)

```json
{
  "routes": [{
    "overview_polyline": { "points": "kz{xEggtxHn@E..." },
    "legs": [{
      "summary": "روانمهر - ولیعصر",
      "distance": { "value": 1820.0, "text": "۲ کیلومتر" },
      "duration": { "value": 487.0,  "text": "۸ دقیقه" },
      "steps": [{
        "name": "میدان انقلاب اسلامی",
        "instruction": "در جهت جنوب در میدان انقلاب اسلامی قرار بگیرید",
        "bearing_after": 193,
        "type": "depart", "modifier": "left",
        "distance": { "value": 61.0, "text": "۷۵ متر" },
        "duration": { "value": 13.0, "text": "کمتر از ۱ دقیقه" },
        "polyline": "kz{xEggtxHHBRAPGPMJSDS",
        "start_location": [51.390755, 35.701021]
      }]
    }]
  }]
}
```

- One `route` per alternative; one `leg` per segment between origin/waypoints/destination.
- Totals for a route = sum over its legs (there is no route-level distance/duration field).
- `distance.value` meters, `duration.value` seconds. `text` is Persian display text.
- `step.type`: `turn`, `new name`, `depart`, `arrive`, `merge`, `continue`, `on ramp`, `off ramp`, `fork`,
  `end of road`, `roundabout`, `rotary`, `roundabout turn`, `exit roundabout`, `exit rotary`, `notification`.
- `step.modifier`: `right`, `left`, `slight right/left`, `sharp right/left`, `uturn`, `straight`
  (docs list the hyphenated spelling; samples show a space, so compare leniently).
- Conditional fields: `exit` and `rotary_name` only for roundabout/rotary types; `name` may be empty
  (unnamed roads); `modifier` is absent on `depart`/`arrive` when origin and destination are very close.
- `start_location` is `[lng, lat]`.

## Response (predictive)

Different shape; do not reuse the parser above.

```json
{ "routes": [{ "duration": 139.0, "distance": 694.459, "geometry": "...",
  "legs": [{ "summary": "...", "distance": 694.459, "duration": 139.814,
    "steps": [{ "direction": "E", "type": "depart", "location": {"longitude": 51.388078, "latitude": 35.700804},
               "distance": 261.564, "duration": 56.603, "name": "آزادی", "geometry": "..." }] }] }] }
```

Fields: route `duration`, `distance`, `geometry`, `dateTime`; step `direction` (N/E/...), `type`, `modifier`,
`location{longitude,latitude}`, `distance`, `duration`, `name`, `geometry`, and for roundabouts `exit`, `rotaryName`.
Duration unit is unclear (see `conventions.md` section 3).

## Pedestrian endpoint ambiguity

The doc's Endpoint section lists `https://api.neshan.org/v4/direction` but all sample requests call
`https://api.neshan.org/v1/direction?type=pedestrian...`. `scripts/neshan.py` and `neshan.mjs`
implement `pedestrian()` as: try v4, fall back to v1 on 400/404. Tell the user which one worked.

## Code

Python (tested client in `scripts/neshan.py`):

```python
from neshan import Neshan, route_geometry
nz = Neshan()                                   # NESHAN_API_KEY from env
res = nz.direction((35.7208, 51.4323), (35.6703, 51.2984),
                   waypoints=[(35.7001, 51.3882)], alternative=True)
best = res["routes"][0]
seconds = sum(l["duration"]["value"] for l in best["legs"])
meters  = sum(l["distance"]["value"] for l in best["legs"])
line = route_geometry(best)                     # [[lng, lat], ...] ready for MapLibre
```

Node / browser-via-backend (`scripts/neshan.mjs`):

```js
import { Neshan, routeGeometry } from "./neshan.mjs";
const nz = new Neshan();
const res = await nz.direction([35.7208, 51.4323], [35.6703, 51.2984], { alternative: true });
const line = routeGeometry(res.routes[0]);
```

Raw fetch, if no client is wanted:

```js
const url = "https://api.neshan.org/v4/direction?" + new URLSearchParams({
  type: "car", origin: "35.7208,51.4323", destination: "35.6703,51.2984",
});
const res = await fetch(url, { headers: { "Api-Key": process.env.NESHAN_API_KEY } });
if (!res.ok) throw new Error(`Neshan ${res.status}`);
const data = await res.json();
```

Draw the route on a map: `../recipes/02-route-on-map.md`.

## Error handling specific to routing

`470` invalid coordinates, `400` bad params, `NoRouteFound` (see zone gotcha, or points that cannot be
snapped to roads). Show "no route" to users; do not retry. Retry only `482`/`5xx`.
