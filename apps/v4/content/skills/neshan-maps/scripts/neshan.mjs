// Dependency-free Node (>=18) / browser-safe ESM client for the Neshan web services.
//
//   import { Neshan, decodePolyline, routeGeometry } from "./neshan.mjs";
//   const nz = new Neshan(process.env.NESHAN_API_KEY);
//   const data = await nz.direction([35.7008, 51.3888], [35.7032, 51.3909]);
//   const line = routeGeometry(data.routes[0]);   // [[lng, lat], ...] for MapLibre
//
// SECURITY: REST service keys belong on a server. Do not ship them in browser bundles;
// proxy through your backend. (SDK map keys are a different key type.)
//
// Points are [lat, lng] arrays or "lat,lng" strings. Errors throw NeshanError.

export const BASE_URL = "https://api.neshan.org";

const ERROR_NAMES = {
  400: "INVALID_ARGUMENT", 404: "NOT_FOUND", 470: "CoordinateParseError",
  480: "KeyNotFound", 481: "LimitExceeded", 482: "RateExceeded",
  483: "ApiKeyTypeError", 484: "ApiWhiteListError", 485: "ApiServiceListError",
  500: "GenericError", 503: "ServiceUnavailable",
};
// 481 (quota) and 480/483/484/485 (configuration) are never retried.
const RETRYABLE = new Set([482, 500, 502, 503, 504]);

export class NeshanError extends Error {
  constructor(status, body, message = "") {
    const name = ERROR_NAMES[status] ?? "HTTPError";
    super(`Neshan ${status} ${name}: ${message || (typeof body === "string" ? body : JSON.stringify(body))}`);
    this.status = status; this.errorName = name; this.body = body;
    this.retryable = RETRYABLE.has(status);
  }
}

// ---------------------------------------------------------------- helpers
const latLng = (p) => {
  if (typeof p === "string") { const [a, b] = p.replace(/\s/g, "").split(",").map(Number); return [a, b]; }
  return [Number(p[0]), Number(p[1])];
};
let STRICT_COORD_CHECK = true;
export const setStrictCoordCheck = (v) => { STRICT_COORD_CHECK = !!v; };

function checkRange(lat, lng) {
  if (!(lat >= -90 && lat <= 90) || !(lng >= -180 && lng <= 180) || Number.isNaN(lat + lng))
    throw new RangeError(`coordinate out of range: lat=${lat} lng=${lng}`);
  // Iran is lat 25-40, lng 44-64; the reverse pair almost surely means swapped args.
  if (STRICT_COORD_CHECK && lat >= 44 && lat <= 64 && lng >= 25 && lng <= 40)
    throw new RangeError(`lat/lng look swapped (lat=${lat}, lng=${lng}); REST APIs expect lat,lng`);
}
export function fmtPoint(p) { const [a, b] = latLng(p); checkRange(a, b); return `${a},${b}`; }
export const fmtPoints = (ps) => ps.map(fmtPoint).join("|");

/** Decode an Encoded Polyline (precision 5) into [[lat, lng], ...]. */
export function decodePolyline(str, precision = 5) {
  const f = 10 ** precision, out = [];
  let i = 0, lat = 0, lng = 0;
  while (i < str.length) {
    for (const axis of [0, 1]) {
      let shift = 0, result = 0, b;
      do { b = str.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      const d = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === 0) lat += d; else lng += d;
    }
    out.push([lat / f, lng / f]);
  }
  return out;
}
export function encodePolyline(coords, precision = 5) {
  const f = 10 ** precision; let out = "", pl = 0, pn = 0;
  for (const [la, ln] of coords) {
    const a = Math.round(la * f), b = Math.round(ln * f);
    for (let d of [a - pl, b - pn]) {
      d = d < 0 ? ~(d << 1) : d << 1;
      while (d >= 0x20) { out += String.fromCharCode((0x20 | (d & 0x1f)) + 63); d >>= 5; }
      out += String.fromCharCode(d + 63);
    }
    pl = a; pn = b;
  }
  return out;
}
/** [[lat, lng], ...] -> [[lng, lat], ...] (MapLibre / GeoJSON order). */
export const toLngLat = (cs) => cs.map(([la, ln]) => [ln, la]);

/** [[lng, lat], ...] for one route (traffic/no-traffic/typical/pedestrian use
 *  overview_polyline.points; predictive routing uses `geometry`). */
export function routeGeometry(route) {
  const ov = route.overview_polyline;
  if (ov && typeof ov === "object") return toLngLat(decodePolyline(ov.points));
  if (typeof ov === "string") return toLngLat(decodePolyline(ov));
  if (route.geometry) return toLngLat(decodePolyline(route.geometry));
  throw new Error("route has neither overview_polyline nor geometry");
}

// ----------------------------------------------------------------- client
export class Neshan {
  constructor(apiKey = globalThis.process?.env?.NESHAN_API_KEY, { baseUrl = BASE_URL, timeoutMs = 15000, retries = 2, backoffMs = 800, fetchImpl } = {}) {
    if (!apiKey) throw new Error("Neshan API key missing (pass it or set NESHAN_API_KEY)");
    Object.assign(this, { apiKey, baseUrl: baseUrl.replace(/\/$/, ""), timeoutMs, retries, backoffMs });
    this.fetch = fetchImpl ?? globalThis.fetch;
  }

  buildUrl(path, params = {}, keyInQuery = false) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) sp.set(k, String(v));
    if (keyInQuery) sp.set("key", this.apiKey);
    const qs = sp.toString().replace(/\+/g, "%20");   // spaces as %20, '|' becomes %7C
    return this.baseUrl + path + (qs ? "?" + qs : "");
  }

  async request(method, path, { params, body, keyInQuery = false } = {}) {
    const url = this.buildUrl(path, params, keyInQuery);
    const headers = { Accept: "application/json" };
    if (!keyInQuery) headers["Api-Key"] = this.apiKey;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    for (let attempt = 0; ; attempt++) {
      let err;
      try {
        const res = await this.fetch(url, {
          method, headers, body: body !== undefined ? JSON.stringify(body) : undefined,
          signal: AbortSignal.timeout(this.timeoutMs),
        });
        const ctype = res.headers.get("content-type") ?? "";
        if (res.ok) return ctype.includes("json") ? res.json() : new Uint8Array(await res.arrayBuffer());
        const text = await res.text();
        let payload; try { payload = JSON.parse(text); } catch { payload = text; }
        err = new NeshanError(res.status, payload);
      } catch (e) {
        err = e instanceof NeshanError ? e : new NeshanError(503, String(e), "network error");
      }
      if (err.retryable && attempt < this.retries) { await new Promise((r) => setTimeout(r, this.backoffMs * 2 ** attempt)); continue; }
      throw err;
    }
  }
  get(path, params) { return this.request("GET", path, { params }); }

  // routing
  direction(origin, destination, { type = "car", waypoints, avoidTrafficZone = false, avoidOddEvenZone = false, alternative = false, bearing, mode = "traffic" } = {}) {
    const path = { traffic: "/v4/direction", "no-traffic": "/v4/direction/no-traffic", typical: "/v1/direction/typical" }[mode];
    if (!path) throw new Error(`unknown mode ${mode}`);
    if (mode !== "traffic" && type !== "car") throw new Error(`mode=${mode} supports type=car only`);
    if (!["car", "motorcycle"].includes(type)) throw new Error("type must be car or motorcycle (use pedestrian() for walking)");
    return this.get(path, { type, origin: fmtPoint(origin), destination: fmtPoint(destination),
      waypoints: waypoints?.length ? fmtPoints(waypoints) : undefined, avoidTrafficZone, avoidOddEvenZone, alternative, bearing });
  }
  /** Docs disagree (/v4/direction vs /v1/direction samples): try v4, fall back to v1 on 400/404. */
  async pedestrian(origin, destination, { waypoints, alternative = false, bearing } = {}) {
    const p = { type: "pedestrian", origin: fmtPoint(origin), destination: fmtPoint(destination),
      waypoints: waypoints?.length ? fmtPoints(waypoints) : undefined, alternative, bearing };
    try { return await this.get("/v4/direction", p); }
    catch (e) { if (e instanceof NeshanError && [400, 404].includes(e.status)) return this.get("/v1/direction", p); throw e; }
  }
  predictive(origin, destination, { routingType, dateTime, avoidTrafficZone = false, alternative = false }) {
    if (!["DepartAt", "ArriveAt"].includes(routingType)) throw new Error("routingType must be DepartAt or ArriveAt");
    return this.get("/v1/direction/historical", { origin: fmtPoint(origin), destination: fmtPoint(destination), routingType, dateTime, avoidTrafficZone, alternative });
  }
  trip(waypoints, { roundTrip = true, sourceIsAnyPoint = true, lastIsAnyPoint = true } = {}) {
    return this.get("/v3/trip", { waypoints: fmtPoints(waypoints), roundTrip, sourceIsAnyPoint, lastIsAnyPoint });
  }
  distanceMatrix(origins, destinations, { type = "car", traffic = true } = {}) {
    return this.get(traffic ? "/v1/distance-matrix" : "/v1/distance-matrix/no-traffic", { type, origins: fmtPoints(origins), destinations: fmtPoints(destinations) });
  }
  isochrone(point, { timeMin, distanceKm, dataset, polygons = true, denoise } = {}) {
    if ((timeMin == null) === (distanceKm == null)) throw new Error("pass exactly one of timeMin or distanceKm");
    const [latitude, longitude] = latLng(point);
    return this.get("/v2/isochrone", { latitude, longitude, time: timeMin, distance: distanceKm, dataset, polygons, denoise });
  }
  mapMatch(path) {
    if (path.length < 2 || path.length > 1000) throw new RangeError("map matching needs 2..1000 points");
    return this.request("POST", "/v3/map-matching", { body: { path: fmtPoints(path) } });
  }
  logistic(payload) { return this.request("POST", "/vrp/logistic", { body: payload }); }

  // places
  search(term, center) {
    const [latitude, longitude] = latLng(center);
    return this.get("/v3/search", { q: JSON.stringify({ term, center: { latitude, longitude } }) });
  }
  geocode(address, { province, city, location, extent, plus = false } = {}) {
    const body = { address };
    if (province) body.province = province;
    if (city) body.city = city;
    if (location) { const [latitude, longitude] = latLng(location); body.location = { latitude, longitude }; }
    if (extent) {
      const [sw, ne] = extent.map(latLng);
      body.extent = { southWest: { latitude: sw[0], longitude: sw[1] }, northEast: { latitude: ne[0], longitude: ne[1] } };
    }
    return this.get(plus ? "/geocoding/v1/plus" : "/geocoding/v1", { json: JSON.stringify(body) });
  }
  reverse(lat, lng) { checkRange(lat, lng); return this.get("/v5/reverse", { lat, lng }); }
  nearby(location, layer, radiusM) { return this.get("/v1/nearby", { location: fmtPoint(location), layer, searchRadius: Math.trunc(radiusM) }); }
  poi(hash) { return this.get("/v1/point", { hash }); }
  provinces(geometry = false) { return this.get("/v2/region/provinces" + (geometry ? "/geometry" : "")); }
  cities(provinceId, geometry = false) { return this.get(`/v2/region/provinces/${Math.trunc(provinceId)}/cities` + (geometry ? "/geometry" : "")); }

  // static maps: the key goes in the QUERY string; response is image bytes
  staticMapUrl(lat, lng, { zoom = 15, width = 512, height = 512, style = "light", marker } = {}) {
    if (zoom < 5 || zoom > 19) throw new RangeError("zoom must be 5..19");
    for (const [n, v] of [["width", width], ["height", height]]) if (v < 200 || v > 2048) throw new RangeError(`${n} must be 200..2048`);
    return this.buildUrl("/v5/static", { zoom, latitude: lat, longitude: lng, width, height, style, marker }, true);
  }
  staticArcUrl(from, to, { width = 512, height = 512, style = "light", color, dashed = false, fromMarker, toMarker } = {}) {
    const [fromLatitude, fromLongitude] = latLng(from), [toLatitude, toLongitude] = latLng(to);
    return this.buildUrl("/v5/static/arc", { fromLatitude, fromLongitude, toLatitude, toLongitude, width, height, style, color, dashed, fromMarker, toMarker }, true);
  }

  // account
  remainingCharge() { return this.get("/account-inquiry/v1/remaining-charge"); }   // paidCharge may be negative
  activeServices() { return this.get("/account-inquiry/v1/services"); }            // needs support activation
}
