// End-to-end test of proxy-server.mjs against a mock Neshan upstream. Run: node test_proxy.mjs
import http from "node:http";
import assert from "node:assert/strict";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";

const seen = [];
const upstream = http.createServer((req, res) => {
  seen.push({ url: req.url, key: req.headers["api-key"] });
  const u = new URL(req.url, "http://x");
  const j = (s, o) => { res.writeHead(s, { "content-type": "application/json" }); res.end(JSON.stringify(o)); };
  if (u.pathname === "/v4/direction") return j(200, { routes: [{ overview_polyline: { points: "_p~iF~ps|U" } }] });
  if (u.pathname === "/v5/reverse") return u.searchParams.get("lat") === "35.1" ? j(481, { status: "LimitExceeded" }) : j(200, { status: "OK", formatted_address: "تهران" });
  if (u.pathname === "/v2/isochrone") return j(200, { type: "FeatureCollection", features: [], echo: Object.fromEntries(u.searchParams) });
  if (u.pathname === "/v3/search") return j(200, { count: 0, items: [] });
  j(404, { status: "NOT_FOUND" });
});
await new Promise((r) => upstream.listen(0, r));
process.env.NESHAN_API_KEY = "SECRET";
process.env.NESHAN_BASE_URL = `http://127.0.0.1:${upstream.address().port}`;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "static-")); fs.writeFileSync(path.join(dir, "index.html"), "<h1>hi</h1>");
fs.writeFileSync(path.join(path.dirname(dir), "secret.txt"), "nope");
process.env.STATIC_DIR = dir;
const { server } = await import("./proxy-server.mjs");
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const get = async (p) => { const r = await fetch(base + p); return [r.status, await r.text(), r.headers.get("content-type")]; };

let [s, b] = await get("/api/route?origin=35.7,51.38&destination=35.71,51.39&alternative=true");
assert.equal(s, 200); assert.ok(JSON.parse(b).routes);
assert.equal(seen.at(-1).key, "SECRET");                       // key forwarded server-side
assert.ok(seen.at(-1).url.includes("alternative=true"));

[s, b] = await get("/api/reverse?lat=35.7&lng=51.4");           assert.equal(s, 200); assert.match(b, /تهران/);
[s, b] = await get("/api/reverse?lat=35.1&lng=51.4");           assert.equal(s, 502);                    // quota (481) hidden as 502
assert.ok(!b.includes("SECRET"));
[s] = await get("/api/reverse?lat=abc&lng=51.4");               assert.equal(s, 400);
[s] = await get("/api/route?origin=35.7,51.38");                assert.equal(s, 400);                    // missing destination
[s] = await get("/api/search?term=x&lat=35.7&lng=51.4");        assert.equal(s, 200);
[s] = await get("/api/poi?hash=zzz");                           assert.equal(s, 404);                    // upstream 404 passes through
[s, b] = await get("/");                                        assert.equal(s, 200); assert.match(b, /hi/);
[s] = await get("/..%2fsecret.txt");                            assert.equal(s, 404);                    // path traversal blocked
[s, b] = await get("/api/isochrone?lat=35.7&lng=51.4&time=10&dataset=PRIMARY");
assert.equal(s, 200); assert.deepEqual(JSON.parse(b).echo, { latitude: "35.7", longitude: "51.4", time: "10", dataset: "PRIMARY", polygons: "true" });
[s] = await get("/api/isochrone?lat=35.7&lng=51.4");            assert.equal(s, 400);                    // neither time nor distance -> validation error
const post = await fetch(base + "/api/route", { method: "POST" }); assert.equal(post.status, 405);

server.close(); upstream.close();
console.log("proxy OK");
