// Offline tests for neshan.mjs. Run: node --test test_neshan.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { Neshan, NeshanError, decodePolyline, encodePolyline, routeGeometry, fmtPoint, fmtPoints } from "./neshan.mjs";

const json = (obj, status = 200, ctype = "application/json") =>
  new Response(typeof obj === "string" || obj instanceof Uint8Array ? obj : JSON.stringify(obj), { status, headers: { "content-type": ctype } });
const mk = (impl, opts = {}) => new Neshan("K", { retries: 2, backoffMs: 0, fetchImpl: impl, ...opts });

test("polyline: google reference + roundtrip + neshan doc sample", () => {
  assert.deepEqual(decodePolyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@"), [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]);
  const src = [[35.70082, 51.38881], [35.70063, 51.39095]];
  assert.deepEqual(decodePolyline(encodePolyline(src)), src);
  const [lat, lng] = decodePolyline("cy{xEa{sxHCyEr@}FIi@MWi@Um@L[l@A^{Jr@")[0];
  assert.ok(Math.abs(lat - 35.70) < 0.01 && Math.abs(lng - 51.39) < 0.01);
});

test("routeGeometry handles traffic and predictive shapes", () => {
  const enc = encodePolyline([[35.7, 51.38], [35.71, 51.39]]);
  assert.deepEqual(routeGeometry({ overview_polyline: { points: enc } }), routeGeometry({ geometry: enc }));
  assert.deepEqual(routeGeometry({ geometry: enc })[0], [51.38, 35.7]);
  assert.throws(() => routeGeometry({}));
});

test("point formatting + swapped guard", () => {
  assert.equal(fmtPoint([35.7, 51.4]), "35.7,51.4");
  assert.equal(fmtPoints([[35.7, 51.4], "35.8, 51.5"]), "35.7,51.4|35.8,51.5");
  assert.throws(() => fmtPoint([51.4, 35.7]), RangeError);
});

test("direction: URL, header, encoding", async () => {
  let seen;
  const nz = mk(async (url, init) => { seen = { url, init }; return json({ routes: [] }); });
  await nz.direction([35.7, 51.38], [35.71, 51.39], { waypoints: [[35.705, 51.385], [35.708, 51.388]], alternative: true });
  assert.ok(seen.url.startsWith("https://api.neshan.org/v4/direction?"));
  assert.ok(seen.url.includes("%7C") && seen.url.includes("alternative=true") && !seen.url.includes("bearing"));
  assert.equal(seen.init.headers["Api-Key"], "K");
  assert.ok(!seen.url.includes("key=K"));
});

test("no-traffic is car only; isochrone XOR; map-match limits", async () => {
  const nz = mk(async () => json({}));
  assert.throws(() => nz.direction([35.7, 51.38], [35.71, 51.39], { type: "motorcycle", mode: "no-traffic" }));
  assert.throws(() => nz.isochrone([35.7, 51.4], {}));
  assert.throws(() => nz.isochrone([35.7, 51.4], { timeMin: 5, distanceKm: 2 }));
  assert.throws(() => nz.mapMatch([[35.7, 51.3]]), RangeError);
});

test("search sends JSON q; geocode plus path", async () => {
  const urls = [];
  const nz = mk(async (url) => { urls.push(url); return json({ items: [] }); });
  await nz.search("میدان تجریش", [35.8069, 51.4287]);
  const q = JSON.parse(new URL(urls[0]).searchParams.get("q"));
  assert.deepEqual(q, { term: "میدان تجریش", center: { latitude: 35.8069, longitude: 51.4287 } });
  await nz.geocode("تهران ستارخان", { city: "تهران", plus: true });
  assert.ok(urls[1].includes("/geocoding/v1/plus?json="));
});

test("map-match is POST JSON", async () => {
  let seen;
  const nz = mk(async (url, init) => { seen = { url, init }; return json({ snappedPoints: [] }); });
  await nz.mapMatch([[35.70, 51.32], [35.71, 51.33]]);
  assert.equal(seen.init.method, "POST");
  assert.deepEqual(JSON.parse(seen.init.body), { path: "35.7,51.32|35.71,51.33" });
  assert.equal(seen.init.headers["Content-Type"], "application/json");
});

test("static map URL carries key in query; validates ranges", () => {
  const nz = mk(async () => json({}));
  const u = nz.staticMapUrl(35.7, 51.4, { zoom: 15, marker: "red" });
  assert.ok(u.includes("key=K") && u.includes("zoom=15") && u.includes("marker=red"));
  assert.throws(() => nz.staticMapUrl(35.7, 51.4, { zoom: 3 }), RangeError);
  assert.throws(() => nz.staticMapUrl(35.7, 51.4, { width: 100 }), RangeError);
});

test("481 not retried; 482 retried; error names", async () => {
  let n = 0;
  const a = mk(async () => { n++; return json({ s: 1 }, 481); }, { retries: 3 });
  await assert.rejects(a.reverse(35.7, 51.4), (e) => e instanceof NeshanError && e.errorName === "LimitExceeded" && !e.retryable);
  assert.equal(n, 1);
  n = 0;
  const b = mk(async () => (++n < 3 ? json({}, 482) : json({ status: "OK" })), { retries: 3 });
  assert.equal((await b.reverse(35.7, 51.4)).status, "OK");
  assert.equal(n, 3);
});

test("pedestrian falls back to v1 on 404", async () => {
  const urls = [];
  const nz = mk(async (url) => { urls.push(url); return url.includes("/v4/direction") ? json({}, 404) : json({ routes: [] }); });
  await nz.pedestrian([35.7, 51.38], [35.71, 51.39]);
  assert.equal(urls.length, 2); assert.ok(urls[1].includes("/v1/direction?"));
});
