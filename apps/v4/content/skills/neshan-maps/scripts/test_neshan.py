"""Offline unit tests for neshan.py (no network, no API key). Run: python3 test_neshan.py"""
import io, json, sys, os, unittest, urllib.error
from unittest import mock
sys.path.insert(0, os.path.dirname(__file__))
import neshan
from neshan import Neshan, NeshanError, decode_polyline, encode_polyline, route_geometry, fmt_point, fmt_points


class FakeResp:
    def __init__(self, payload, ctype="application/json"):
        self._b = payload if isinstance(payload, bytes) else json.dumps(payload).encode()
        self.headers = {"Content-Type": ctype}
    def read(self): return self._b
    def __enter__(self): return self
    def __exit__(self, *a): return False


def http_error(code, body=b'{"status":"x"}'):
    return urllib.error.HTTPError("u", code, "m", {}, io.BytesIO(body))


class Polyline(unittest.TestCase):
    def test_google_reference_example(self):
        pts = decode_polyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@")
        self.assertEqual(pts, [(38.5, -120.2), (40.7, -120.95), (43.252, -126.453)])

    def test_roundtrip(self):
        src = [(35.70082, 51.38881), (35.70063, 51.39095), (35.70129, 51.39115)]
        self.assertEqual(decode_polyline(encode_polyline(src)), src)

    def test_neshan_doc_sample_lands_in_tehran(self):
        # overview_polyline.points from the Neshan routing docs sample
        pts = decode_polyline("cy{xEa{sxHCyEr@}FIi@MWi@Um@L[l@A^{Jr@")
        lat, lng = pts[0]
        self.assertAlmostEqual(lat, 35.70, delta=0.01)
        self.assertAlmostEqual(lng, 51.39, delta=0.01)

    def test_route_geometry_shapes(self):
        enc = encode_polyline([(35.7, 51.38), (35.71, 51.39)])
        a = route_geometry({"overview_polyline": {"points": enc}})
        b = route_geometry({"geometry": enc})           # predictive routing
        self.assertEqual(a, b)
        self.assertEqual(a[0], [51.38, 35.7])            # [lng, lat]
        with self.assertRaises(KeyError):
            route_geometry({})


class Formatting(unittest.TestCase):
    def test_points(self):
        self.assertEqual(fmt_point((35.7, 51.4)), "35.7,51.4")
        self.assertEqual(fmt_point("35.7, 51.4"), "35.7,51.4")
        self.assertEqual(fmt_points([(35.7, 51.4), (35.8, 51.5)]), "35.7,51.4|35.8,51.5")

    def test_swapped_latlng_is_caught(self):
        with self.assertRaises(ValueError):
            fmt_point((51.4, 35.7))
        with self.assertRaises(ValueError):
            fmt_point((135.0, 51.4))

    def test_url_building(self):
        nz = Neshan("K")
        url = nz.build_url("/v4/direction", dict(type="car", origin="35.7,51.4", waypoints="35.7,51.4|35.8,51.5",
                                                  alternative=True, bearing=None))
        self.assertIn("alternative=true", url)
        self.assertNotIn("bearing", url)
        self.assertIn("%7C", url)                        # '|' must be encoded
        self.assertNotIn("key=", url)                    # key goes in header for REST
        self.assertIn("key=K", nz.build_url("/v5/static", {"zoom": 15}, key_in_query=True))


class Calls(unittest.TestCase):
    def setUp(self):
        self.nz = Neshan("K", retries=2, backoff=0)

    def _capture(self, payload):
        calls = []
        def fake(req, timeout=None):
            calls.append(req)
            return FakeResp(payload)
        return calls, fake

    def test_direction_header_and_path(self):
        calls, fake = self._capture({"routes": []})
        with mock.patch("urllib.request.urlopen", fake):
            self.nz.direction((35.7, 51.38), (35.71, 51.39), alternative=True)
        r = calls[0]
        self.assertTrue(r.full_url.startswith("https://api.neshan.org/v4/direction?"))
        self.assertEqual(r.get_header("Api-key"), "K")

    def test_no_traffic_is_car_only(self):
        with self.assertRaises(ValueError):
            self.nz.direction((35.7, 51.38), (35.71, 51.39), type="motorcycle", mode="no-traffic")

    def test_search_sends_json_q(self):
        calls, fake = self._capture({"count": 0, "items": []})
        with mock.patch("urllib.request.urlopen", fake):
            self.nz.search("میدان تجریش", (35.8069, 51.4287))
        import urllib.parse as up
        q = up.parse_qs(up.urlparse(calls[0].full_url).query)["q"][0]
        self.assertEqual(json.loads(q), {"term": "میدان تجریش", "center": {"latitude": 35.8069, "longitude": 51.4287}})

    def test_geocode_plus_path_and_json_param(self):
        calls, fake = self._capture({"items": []})
        with mock.patch("urllib.request.urlopen", fake):
            self.nz.geocode("تهران ستارخان", city="تهران", plus=True)
        self.assertIn("/geocoding/v1/plus?json=", calls[0].full_url)

    def test_map_match_is_post_json(self):
        calls, fake = self._capture({"snappedPoints": []})
        with mock.patch("urllib.request.urlopen", fake):
            self.nz.map_match([(35.70, 51.32), (35.71, 51.33)])
        r = calls[0]
        self.assertEqual(r.get_method(), "POST")
        self.assertEqual(json.loads(r.data), {"path": "35.7,51.32|35.71,51.33"})
        self.assertEqual(r.get_header("Content-type"), "application/json")
        with self.assertRaises(ValueError):
            self.nz.map_match([(35.7, 51.3)])

    def test_isochrone_xor(self):
        with self.assertRaises(ValueError):
            self.nz.isochrone((35.7, 51.4))
        with self.assertRaises(ValueError):
            self.nz.isochrone((35.7, 51.4), time_min=5, distance_km=3)
        calls, fake = self._capture({"type": "FeatureCollection", "features": []})
        with mock.patch("urllib.request.urlopen", fake):
            self.nz.isochrone((35.7, 51.4), time_min=10, dataset="PRIMARY")
        self.assertIn("latitude=35.7", calls[0].full_url)
        self.assertIn("polygons=true", calls[0].full_url)

    def test_static_uses_query_key_no_header(self):
        calls, fake = self._capture(b"\x89PNG")
        with mock.patch("urllib.request.urlopen", lambda r, timeout=None: (calls.append(r), FakeResp(b"\x89PNG", "image/png"))[1]):
            img = self.nz.static_map(35.7, 51.4, zoom=15, marker="red")
        self.assertEqual(img, b"\x89PNG")
        self.assertIn("key=K", calls[0].full_url)
        self.assertIsNone(calls[0].get_header("Api-key"))
        with self.assertRaises(ValueError):
            self.nz.static_map(35.7, 51.4, zoom=3)

    def test_pedestrian_falls_back_to_v1(self):
        seen = []
        def fake(req, timeout=None):
            seen.append(req.full_url)
            if "/v4/direction" in req.full_url:
                raise http_error(404)
            return FakeResp({"routes": []})
        with mock.patch("urllib.request.urlopen", fake):
            self.nz.pedestrian((35.7, 51.38), (35.71, 51.39))
        self.assertEqual(len(seen), 2)
        self.assertIn("/v1/direction?", seen[1])


class Errors(unittest.TestCase):
    def test_481_is_not_retried(self):
        n = []
        def fake(req, timeout=None):
            n.append(1); raise http_error(481)
        with mock.patch("urllib.request.urlopen", fake):
            with self.assertRaises(NeshanError) as c:
                Neshan("K", retries=3, backoff=0).reverse(35.7, 51.4)
        self.assertEqual(len(n), 1)
        self.assertEqual(c.exception.name, "LimitExceeded")
        self.assertFalse(c.exception.retryable)

    def test_482_is_retried_then_succeeds(self):
        n = []
        def fake(req, timeout=None):
            n.append(1)
            if len(n) < 3: raise http_error(482)
            return FakeResp({"status": "OK"})
        with mock.patch("urllib.request.urlopen", fake):
            out = Neshan("K", retries=3, backoff=0).reverse(35.7, 51.4)
        self.assertEqual(out["status"], "OK"); self.assertEqual(len(n), 3)

    def test_483_names(self):
        def fake(req, timeout=None): raise http_error(483)
        with mock.patch("urllib.request.urlopen", fake):
            with self.assertRaises(NeshanError) as c:
                Neshan("K").reverse(35.7, 51.4)
        self.assertEqual(c.exception.name, "ApiKeyTypeError")

    def test_missing_key(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(ValueError):
                Neshan()


if __name__ == "__main__":
    unittest.main(verbosity=2)
