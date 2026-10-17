#!/usr/bin/env python3
"""Minimal, dependency-free Python client for the Neshan Maps web services.

Usage:
    from neshan import Neshan, decode_polyline, route_geometry
    nz = Neshan(os.environ["NESHAN_API_KEY"])
    data = nz.direction((35.7008, 51.3888), (35.7032, 51.3909))
    line = route_geometry(data["routes"][0])      # [[lng, lat], ...] for MapLibre

Conventions (see references/conventions.md):
  * Public methods take points as (lat, lng) tuples or "lat,lng" strings.
  * Responses are returned as parsed JSON (dict/list) unchanged.
  * Errors raise NeshanError(status, body); `.retryable` tells you if backoff helps.
Only the standard library is used.
"""
from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Iterable, Optional, Sequence, Tuple, Union

BASE_URL = "https://api.neshan.org"

Point = Union[Tuple[float, float], Sequence[float], str]

# HTTP status codes documented by Neshan (shared by all APIs).
ERROR_NAMES = {
    400: "INVALID_ARGUMENT",
    404: "NOT_FOUND",
    470: "CoordinateParseError",
    480: "KeyNotFound",
    481: "LimitExceeded",
    482: "RateExceeded",
    483: "ApiKeyTypeError",
    484: "ApiWhiteListError",
    485: "ApiServiceListError",
    500: "GenericError",
    503: "ServiceUnavailable",  # static map: render_timeout / overloaded
}
# Only these are worth retrying with backoff. 481 (quota) and 480/483/484/485
# (configuration) must NOT be retried.
RETRYABLE = {482, 500, 502, 503, 504}


class NeshanError(Exception):
    def __init__(self, status: int, body, message: str = ""):
        self.status = status
        self.name = ERROR_NAMES.get(status, "HTTPError")
        self.body = body
        self.retryable = status in RETRYABLE
        super().__init__(f"Neshan {status} {self.name}: {message or body}")


# ----------------------------------------------------------------- helpers
def _lat_lng(p: Point) -> Tuple[float, float]:
    if isinstance(p, str):
        a, b = p.replace(" ", "").split(",")
        return float(a), float(b)
    return float(p[0]), float(p[1])


# Neshan covers Iran only. Set NESHAN_NO_COORD_CHECK=1 to disable the swap guard.
STRICT_COORD_CHECK = os.environ.get("NESHAN_NO_COORD_CHECK") != "1"


def _check_range(lat: float, lng: float) -> None:
    """Cheap guard against the #1 bug: swapped lat/lng (Iran: lat 25-40, lng 44-64)."""
    if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
        raise ValueError(f"coordinate out of range: lat={lat} lng={lng}")
    if STRICT_COORD_CHECK and 44 <= lat <= 64 and 25 <= lng <= 40:
        raise ValueError(
            f"lat/lng look swapped (lat={lat}, lng={lng}); REST APIs expect lat,lng"
        )


def fmt_point(p: Point) -> str:
    """(lat, lng) or 'lat,lng' -> 'lat,lng' (the order REST requests use)."""
    lat, lng = _lat_lng(p)
    _check_range(lat, lng)
    return f"{lat},{lng}"


def fmt_points(points: Iterable[Point]) -> str:
    """Join points with '|' (urlencode turns it into %7C)."""
    return "|".join(fmt_point(p) for p in points)


def decode_polyline(encoded: str, precision: int = 5):
    """Decode a Google-style Encoded Polyline into [(lat, lng), ...].

    Neshan routing geometry uses precision 5. NOTE the result is (lat, lng);
    MapLibre/GeoJSON want [lng, lat] -> use to_lnglat().
    """
    coords, index, lat, lng = [], 0, 0, 0
    factor = 10 ** precision
    n = len(encoded)
    while index < n:
        for axis in (0, 1):
            shift = result = 0
            while True:
                b = ord(encoded[index]) - 63
                index += 1
                result |= (b & 0x1F) << shift
                shift += 5
                if b < 0x20:
                    break
            delta = ~(result >> 1) if result & 1 else result >> 1
            if axis == 0:
                lat += delta
            else:
                lng += delta
        coords.append((lat / factor, lng / factor))
    return coords


def encode_polyline(coords, precision: int = 5) -> str:
    """Inverse of decode_polyline (handy for tests/fixtures)."""
    factor = 10 ** precision
    out, plat, plng = [], 0, 0
    for lat, lng in coords:
        ilat, ilng = round(lat * factor), round(lng * factor)
        for d in (ilat - plat, ilng - plng):
            d = ~(d << 1) if d < 0 else d << 1
            while d >= 0x20:
                out.append(chr((0x20 | (d & 0x1F)) + 63))
                d >>= 5
            out.append(chr(d + 63))
        plat, plng = ilat, ilng
    return "".join(out)


def to_lnglat(coords):
    """[(lat, lng), ...] -> [[lng, lat], ...] for MapLibre / GeoJSON."""
    return [[lng, lat] for lat, lng in coords]


def route_geometry(route: dict):
    """[[lng, lat], ...] for one route of a direction response.

    Traffic / no-traffic / typical / pedestrian: route["overview_polyline"]["points"].
    Predictive routing: route["geometry"].
    """
    ov = route.get("overview_polyline")
    if isinstance(ov, dict):
        return to_lnglat(decode_polyline(ov["points"]))
    if isinstance(ov, str):
        return to_lnglat(decode_polyline(ov))
    if route.get("geometry"):
        return to_lnglat(decode_polyline(route["geometry"]))
    raise KeyError("route has neither overview_polyline nor geometry")


# ------------------------------------------------------------------ client
class Neshan:
    def __init__(
        self,
        api_key: Optional[str] = None,
        *,
        base_url: str = BASE_URL,
        timeout: float = 15.0,
        retries: int = 2,
        backoff: float = 0.8,
    ):
        self.api_key = api_key or os.environ.get("NESHAN_API_KEY")
        if not self.api_key:
            raise ValueError("Neshan API key missing (pass it or set NESHAN_API_KEY)")
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.retries = retries
        self.backoff = backoff

    # -- transport ---------------------------------------------------------
    def build_url(self, path: str, params: Optional[dict] = None,
                  key_in_query: bool = False) -> str:
        params = {k: v for k, v in (params or {}).items() if v is not None}
        for k, v in list(params.items()):
            if isinstance(v, bool):
                params[k] = "true" if v else "false"
        if key_in_query:
            params["key"] = self.api_key
        url = self.base_url + path
        if params:
            url += "?" + urllib.parse.urlencode(params, quote_via=urllib.parse.quote)
        return url

    def _request(self, method: str, path: str, params: Optional[dict] = None,
                 body: Optional[dict] = None, key_in_query: bool = False):
        url = self.build_url(path, params, key_in_query)
        headers = {"Accept": "application/json"}
        if not key_in_query:
            headers["Api-Key"] = self.api_key
        data = None
        if body is not None:
            data = json.dumps(body).encode("utf-8")
            headers["Content-Type"] = "application/json"

        attempt = 0
        while True:
            req = urllib.request.Request(url, data=data, headers=headers, method=method)
            try:
                with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                    raw = resp.read()
                    ctype = resp.headers.get("Content-Type", "")
                    if "json" in ctype or raw[:1] in (b"{", b"["):
                        return json.loads(raw.decode("utf-8"))
                    return raw  # e.g. static map image bytes
            except urllib.error.HTTPError as e:
                raw = e.read()
                try:
                    payload = json.loads(raw.decode("utf-8"))
                except Exception:
                    payload = raw.decode("utf-8", "replace")
                err = NeshanError(e.code, payload)
            except (urllib.error.URLError, TimeoutError) as e:
                err = NeshanError(503, str(e), "network error")
            if err.retryable and attempt < self.retries:
                time.sleep(self.backoff * (2 ** attempt))
                attempt += 1
                continue
            raise err

    def _get(self, path, **params):
        return self._request("GET", path, params)

    # -- routing -----------------------------------------------------------
    def direction(self, origin: Point, destination: Point, *, type: str = "car",
                  waypoints: Optional[Sequence[Point]] = None,
                  avoid_traffic_zone: bool = False, avoid_odd_even_zone: bool = False,
                  alternative: bool = False, bearing: Optional[int] = None,
                  mode: str = "traffic"):
        """mode: 'traffic' -> /v4/direction (car|motorcycle);
        'no-traffic' -> /v4/direction/no-traffic (car only);
        'typical' -> /v1/direction/typical (car)."""
        path = {"traffic": "/v4/direction",
                "no-traffic": "/v4/direction/no-traffic",
                "typical": "/v1/direction/typical"}[mode]
        if mode != "traffic" and type != "car":
            raise ValueError(f"mode={mode!r} supports type='car' only")
        if type not in ("car", "motorcycle"):
            raise ValueError("type must be 'car' or 'motorcycle' (use pedestrian() for walking)")
        return self._get(path, type=type, origin=fmt_point(origin),
                         destination=fmt_point(destination),
                         waypoints=fmt_points(waypoints) if waypoints else None,
                         avoidTrafficZone=avoid_traffic_zone,
                         avoidOddEvenZone=avoid_odd_even_zone,
                         alternative=alternative, bearing=bearing)

    def pedestrian(self, origin: Point, destination: Point, *,
                   waypoints: Optional[Sequence[Point]] = None,
                   alternative: bool = False, bearing: Optional[int] = None):
        """Walking route. The docs are inconsistent (Endpoint section says /v4/direction,
        the samples use /v1/direction), so try v4 first and fall back to v1 on 400/404."""
        kw = dict(type="pedestrian", origin=fmt_point(origin),
                  destination=fmt_point(destination),
                  waypoints=fmt_points(waypoints) if waypoints else None,
                  alternative=alternative, bearing=bearing)
        try:
            return self._get("/v4/direction", **kw)
        except NeshanError as e:
            if e.status in (400, 404):
                return self._get("/v1/direction", **kw)
            raise

    def predictive(self, origin: Point, destination: Point, *, routing_type: str,
                   date_time: str, avoid_traffic_zone: bool = False,
                   alternative: bool = False):
        """Future-time ETA. routing_type 'DepartAt'|'ArriveAt'; date_time
        'YYYY-MM-DDThh:mm' within the next 7 days; Tehran, Mashhad, Karaj only."""
        if routing_type not in ("DepartAt", "ArriveAt"):
            raise ValueError("routing_type must be DepartAt or ArriveAt")
        return self._get("/v1/direction/historical", origin=fmt_point(origin),
                         destination=fmt_point(destination), routingType=routing_type,
                         dateTime=date_time, avoidTrafficZone=avoid_traffic_zone,
                         alternative=alternative)

    def trip(self, waypoints: Sequence[Point], *, round_trip: bool = True,
             source_is_any_point: bool = True, last_is_any_point: bool = True):
        """TSP: returns `points` reordered; `index` maps back to your input order."""
        return self._get("/v3/trip", waypoints=fmt_points(waypoints), roundTrip=round_trip,
                         sourceIsAnyPoint=source_is_any_point, lastIsAnyPoint=last_is_any_point)

    def distance_matrix(self, origins: Sequence[Point], destinations: Sequence[Point], *,
                        type: str = "car", traffic: bool = True):
        path = "/v1/distance-matrix" if traffic else "/v1/distance-matrix/no-traffic"
        return self._get(path, type=type, origins=fmt_points(origins),
                         destinations=fmt_points(destinations))

    def isochrone(self, point: Point, *, time_min: Optional[float] = None,
                  distance_km: Optional[float] = None, dataset: Optional[str] = None,
                  polygons: bool = True, denoise: Optional[float] = None):
        """Exactly one of time_min / distance_km. Returns GeoJSON with [lng, lat]."""
        if (time_min is None) == (distance_km is None):
            raise ValueError("pass exactly one of time_min or distance_km")
        lat, lng = _lat_lng(point)
        return self._get("/v2/isochrone", latitude=lat, longitude=lng, time=time_min,
                         distance=distance_km, dataset=dataset, polygons=polygons,
                         denoise=denoise)

    def map_match(self, path: Sequence[Point]):
        """Snap 2..1000 GPS points. NOTE snappedPoints[].location is [lat, lng]."""
        if not 2 <= len(path) <= 1000:
            raise ValueError("map matching needs 2..1000 points")
        return self._request("POST", "/v3/map-matching", body={"path": fmt_points(path)})

    def logistic(self, payload: dict):
        """Vehicle routing / fleet optimisation; see references/optimization.md."""
        return self._request("POST", "/vrp/logistic", body=payload)

    # -- places ------------------------------------------------------------
    def search(self, term: str, center: Point):
        lat, lng = _lat_lng(center)
        q = json.dumps({"term": term, "center": {"latitude": lat, "longitude": lng}},
                       ensure_ascii=False, separators=(",", ":"))
        return self._get("/v3/search", q=q)

    def geocode(self, address: str, *, province: Optional[str] = None,
                city: Optional[str] = None, location: Optional[Point] = None,
                extent: Optional[Tuple[Point, Point]] = None, plus: bool = False):
        """Address -> coordinates. plus=True uses /geocoding/v1/plus (plaque + POI aware)."""
        body = {"address": address}
        if province:
            body["province"] = province
        if city:
            body["city"] = city
        if location is not None:
            la, ln = _lat_lng(location)
            body["location"] = {"latitude": la, "longitude": ln}
        if extent is not None:
            (sw_la, sw_ln), (ne_la, ne_ln) = _lat_lng(extent[0]), _lat_lng(extent[1])
            body["extent"] = {"southWest": {"latitude": sw_la, "longitude": sw_ln},
                              "northEast": {"latitude": ne_la, "longitude": ne_ln}}
        path = "/geocoding/v1/plus" if plus else "/geocoding/v1"
        return self._get(path, json=json.dumps(body, ensure_ascii=False, separators=(",", ":")))

    def reverse(self, lat: float, lng: float):
        _check_range(lat, lng)
        return self._get("/v5/reverse", lat=lat, lng=lng)

    def nearby(self, location: Point, layer: str, radius_m: int):
        return self._get("/v1/nearby", location=fmt_point(location), layer=layer,
                         searchRadius=int(radius_m))

    def poi(self, poi_hash: str):
        return self._get("/v1/point", hash=poi_hash)

    def provinces(self, geometry: bool = False):
        """Needs activation via support ticket."""
        return self._get("/v2/region/provinces" + ("/geometry" if geometry else ""))

    def cities(self, province_id: int, geometry: bool = False):
        return self._get(f"/v2/region/provinces/{int(province_id)}/cities"
                         + ("/geometry" if geometry else ""))

    # -- static maps (key goes in the QUERY string; response is image bytes) ----
    def static_map(self, lat: float, lng: float, *, zoom: int = 15, width: int = 512,
                   height: int = 512, style: str = "light", marker: Optional[str] = None):
        if not 5 <= zoom <= 19:
            raise ValueError("zoom must be 5..19")
        for name, v in (("width", width), ("height", height)):
            if not 200 <= v <= 2048:
                raise ValueError(f"{name} must be 200..2048")
        return self._request("GET", "/v5/static", dict(
            zoom=zoom, latitude=lat, longitude=lng, width=width, height=height,
            style=style, marker=marker), key_in_query=True)

    def static_arc(self, frm: Point, to: Point, *, width: int = 512, height: int = 512,
                   style: str = "light", color: Optional[str] = None, dashed: bool = False,
                   from_marker: Optional[str] = None, to_marker: Optional[str] = None):
        (fa, fo), (ta, tl) = _lat_lng(frm), _lat_lng(to)
        return self._request("GET", "/v5/static/arc", dict(
            fromLatitude=fa, fromLongitude=fo, toLatitude=ta, toLongitude=tl,
            width=width, height=height, style=style, color=color, dashed=dashed,
            fromMarker=from_marker, toMarker=to_marker), key_in_query=True)

    # -- account -----------------------------------------------------------
    def remaining_charge(self):
        """`paidCharge` may be NEGATIVE; do not assume >= 0."""
        return self._get("/account-inquiry/v1/remaining-charge")

    def active_services(self):
        """Needs activation via support ticket."""
        return self._get("/account-inquiry/v1/services")


if __name__ == "__main__":  # smoke test: NESHAN_API_KEY=... python neshan.py
    print(json.dumps(Neshan().reverse(35.7008, 51.3888), ensure_ascii=False, indent=2))
