#!/usr/bin/env python3
"""Plan a single-vehicle delivery run with Neshan: TSP order -> real route -> totals + GeoJSON.

    NESHAN_API_KEY=... python plan_delivery.py stops.json > plan.geojson
    stops.json: {"depot": [35.70, 51.39], "stops": [{"name": "A", "lat": 35.71, "lng": 51.40}, ...]}

Library use:
    from plan_delivery import plan_route
    plan = plan_route(Neshan(), depot=(35.70, 51.39), stops=[{"name": "A", "lat": .., "lng": ..}, ...])
"""
from __future__ import annotations
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from neshan import Neshan, route_geometry


def plan_route(nz, depot, stops, *, return_to_depot=True, mode="traffic"):
    """depot=(lat,lng); stops=[{"name","lat","lng"}]. Returns dict with order, totals, GeoJSON.

    Steps: (1) TSP over depot+stops with the depot pinned as start (and end if return_to_depot);
           (2) /v4/direction through the ordered stops (origin=depot, waypoints=middle);
           (3) sum leg distance/duration and decode the geometry.
    """
    if not stops:
        raise ValueError("no stops")
    pts = [tuple(depot)] + [(s["lat"], s["lng"]) for s in stops]

    if len(stops) > 1:
        # depot pinned as the start (sourceIsAnyPoint=false). lastIsAnyPoint stays at its default (true):
        # the docs do not say how roundTrip=true combines with lastIsAnyPoint=false, so we avoid that combination.
        trip = nz.trip(pts, round_trip=return_to_depot, source_is_any_point=False, last_is_any_point=True)
        order = [p["index"] for p in trip["points"]]
    else:
        order = [0, 1]
    if order[0] != 0:
        raise RuntimeError(f"TSP did not keep the depot first: {order}")
    visit = [i for i in order if i != 0]                       # stop indices (1-based in pts) in visiting order

    ordered_pts = [pts[0]] + [pts[i] for i in visit]
    if return_to_depot:
        ordered_pts.append(pts[0])
    origin, destination, middle = ordered_pts[0], ordered_pts[-1], ordered_pts[1:-1]
    res = nz.direction(origin, destination, waypoints=middle or None, mode=mode)
    route = res["routes"][0]
    meters = sum(leg["distance"]["value"] for leg in route["legs"])
    seconds = sum(leg["duration"]["value"] for leg in route["legs"])
    line = route_geometry(route)                               # [[lng, lat], ...]

    names = [stops[i - 1]["name"] for i in visit]
    return {
        "order": names, "distance_m": meters, "duration_s": seconds,
        "geojson": {"type": "FeatureCollection", "features": [
            {"type": "Feature", "properties": {"kind": "route", "distance_m": meters, "duration_s": seconds},
             "geometry": {"type": "LineString", "coordinates": line}},
            *[{"type": "Feature", "properties": {"kind": "stop", "seq": n + 1, "name": stops[i - 1]["name"]},
               "geometry": {"type": "Point", "coordinates": [stops[i - 1]["lng"], stops[i - 1]["lat"]]}}
              for n, i in enumerate(visit)],
        ]},
    }


if __name__ == "__main__":
    cfg = json.load(open(sys.argv[1], encoding="utf-8"))
    plan = plan_route(Neshan(), tuple(cfg["depot"]), cfg["stops"], return_to_depot=cfg.get("return_to_depot", True))
    print(f"order: {' -> '.join(plan['order'])}  |  {plan['distance_m']/1000:.1f} km, {plan['duration_s']/60:.0f} min", file=sys.stderr)
    json.dump(plan["geojson"], sys.stdout, ensure_ascii=False)
