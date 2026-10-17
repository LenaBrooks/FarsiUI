# 04 Delivery run: best order, real route, totals (Python)

Use the tested script `../scripts/plan_delivery.py` (TSP -> routing -> totals -> GeoJSON).

```python
from neshan import Neshan
from plan_delivery import plan_route

nz = Neshan()                                     # NESHAN_API_KEY from env (service key, server side)
plan = plan_route(nz, depot=(35.7001, 51.3882), stops=[
    {"name": "مشتری ۱", "lat": 35.7210, "lng": 51.4020},
    {"name": "مشتری ۲", "lat": 35.6890, "lng": 51.3770},
    {"name": "مشتری ۳", "lat": 35.7400, "lng": 51.4500},
], return_to_depot=True)
print(plan["order"], plan["distance_m"] / 1000, "km", plan["duration_s"] / 60, "min")
open("plan.geojson", "w").write(__import__("json").dumps(plan["geojson"]))   # drop into a MapLibre geojson source
```

CLI: `NESHAN_API_KEY=... python scripts/plan_delivery.py stops.json > plan.geojson`

What it does and why
1. **TSP** over depot + stops with `sourceIsAnyPoint=false` (depot first). Result `index` maps back to your list.
2. **Routing** with `origin=depot`, `waypoints=ordered stops`, `destination=depot` (or the last stop for a one-way run).
3. Totals are summed from legs; geometry decoded to `[lng, lat]`.

Choosing a different tool
- Costs only (assignment, pricing, nearest driver): `nz.distance_matrix(origins, destinations)`; check each element's `status == "Ok"`.
- Many vehicles, capacities, time windows: Logistics `nz.logistic(payload)`, see `../references/optimization.md` (set `solutionStrategy: "BEST_EFFORT"` if you prefer partial plans over an empty answer; always inspect `unassignedJobs`).
- Many stops (>~25): TSP and routing URLs get long; chunk the route into several direction calls (each with its own waypoints) and concatenate.
- Time-dependent plans (depart tomorrow 9:00): `nz.predictive(...)` for ETA of a given leg (Tehran, Mashhad, Karaj only).
