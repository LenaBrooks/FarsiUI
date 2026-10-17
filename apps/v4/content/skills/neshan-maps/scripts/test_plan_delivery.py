"""Offline test of plan_delivery.plan_route with a fake Neshan client. Run: python3 test_plan_delivery.py"""
import os, sys, unittest
sys.path.insert(0, os.path.dirname(__file__))
from neshan import encode_polyline
from plan_delivery import plan_route


class FakeNZ:
    def __init__(self, trip_order):
        self.trip_order, self.calls = trip_order, []
    def trip(self, pts, **kw):
        self.calls.append(("trip", pts, kw))
        return {"points": [{"index": i, "location": [pts[i][1], pts[i][0]], "name": ""} for i in self.trip_order]}
    def direction(self, origin, destination, **kw):
        self.calls.append(("direction", origin, destination, kw))
        enc = encode_polyline([origin, *(kw.get("waypoints") or []), destination])
        return {"routes": [{"overview_polyline": {"points": enc},
                            "legs": [{"distance": {"value": 1000}, "duration": {"value": 120}},
                                     {"distance": {"value": 2500}, "duration": {"value": 300}}]}]}


class T(unittest.TestCase):
    depot = (35.70, 51.39)
    stops = [{"name": "A", "lat": 35.71, "lng": 51.40}, {"name": "B", "lat": 35.72, "lng": 51.41},
             {"name": "C", "lat": 35.73, "lng": 51.42}]

    def test_reorders_stops_and_sums_legs(self):
        nz = FakeNZ([0, 3, 1, 2, 0])                  # TSP repeats the depot at the end of a round trip
        plan = plan_route(nz, self.depot, self.stops)
        self.assertEqual(plan["order"], ["C", "A", "B"])
        self.assertEqual((plan["distance_m"], plan["duration_s"]), (3500, 420))
        kind, pts, kw = nz.calls[0]
        self.assertEqual(kw, {"round_trip": True, "source_is_any_point": False, "last_is_any_point": True})
        _, origin, dest, dkw = nz.calls[1]
        self.assertEqual(origin, self.depot); self.assertEqual(dest, self.depot)   # round trip returns to depot
        self.assertEqual(dkw["waypoints"], [(35.73, 51.42), (35.71, 51.40), (35.72, 51.41)])

    def test_one_way(self):
        nz = FakeNZ([0, 2, 1, 3])
        plan = plan_route(nz, self.depot, self.stops, return_to_depot=False)
        self.assertEqual(plan["order"], ["B", "A", "C"])
        _, origin, dest, dkw = nz.calls[1]
        self.assertEqual(dest, (35.73, 51.42)); self.assertEqual(dkw["waypoints"], [(35.72, 51.41), (35.71, 51.40)])

    def test_geojson_is_lnglat_and_has_sequenced_stops(self):
        plan = plan_route(FakeNZ([0, 1, 2, 3]), self.depot, self.stops, return_to_depot=False)
        feats = plan["geojson"]["features"]
        line = feats[0]["geometry"]["coordinates"]
        self.assertEqual(line[0], [51.39, 35.70])                     # [lng, lat]
        stops = [f for f in feats if f["properties"]["kind"] == "stop"]
        self.assertEqual([f["properties"]["seq"] for f in stops], [1, 2, 3])
        self.assertEqual(stops[0]["geometry"]["coordinates"], [51.40, 35.71])

    def test_single_stop_skips_tsp(self):
        nz = FakeNZ([])
        plan_route(nz, self.depot, self.stops[:1])
        self.assertEqual([c[0] for c in nz.calls], ["direction"])

    def test_depot_not_first_is_an_error(self):
        with self.assertRaises(RuntimeError):
            plan_route(FakeNZ([2, 0, 1, 3]), self.depot, self.stops)

    def test_no_stops(self):
        with self.assertRaises(ValueError):
            plan_route(FakeNZ([]), self.depot, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
