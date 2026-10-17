// Tiny dependency-free proxy that keeps the Neshan REST (service) key on the server.
//
//   NESHAN_API_KEY=xxx node proxy-server.mjs            # http://localhost:8787
//   STATIC_DIR=./public PORT=3000 node proxy-server.mjs # also serves your front-end
//
// Browser code calls these same-origin endpoints instead of api.neshan.org:
//   GET /api/search?term=کافه&lat=35.70&lng=51.39
//   GET /api/poi?hash=<poiHash>
//   GET /api/route?origin=35.7,51.38&destination=35.71,51.39[&waypoints=a,b|c,d][&type=car][&alternative=true][&mode=traffic]
//   GET /api/reverse?lat=35.70&lng=51.39
//   GET /api/geocode?address=...[&city=][&province=][&plus=1]
//   GET /api/nearby?lat=&lng=&layer=cafe&radius=500
//   GET /api/isochrone?lat=&lng=&time=10[&dataset=PRIMARY]   (or distance=<km> instead of time)
//
// Hardening you should add for production: auth/CORS rules, per-IP rate limiting, caching of repeated queries.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Neshan, NeshanError } from "./neshan.mjs";

const PORT = Number(process.env.PORT ?? 8787);
const STATIC_DIR = process.env.STATIC_DIR ? path.resolve(process.env.STATIC_DIR) : null;
const nz = new Neshan(process.env.NESHAN_API_KEY, { baseUrl: process.env.NESHAN_BASE_URL ?? "https://api.neshan.org" });

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
const send = (res, status, obj) => { res.writeHead(status, { "content-type": "application/json; charset=utf-8" }); res.end(JSON.stringify(obj)); };
const need = (q, ...names) => { for (const n of names) if (!q.get(n)) throw Object.assign(new Error(`missing query param: ${n}`), { status: 400 }); };
const num = (q, n) => { const v = Number(q.get(n)); if (!Number.isFinite(v)) throw Object.assign(new Error(`invalid number: ${n}`), { status: 400 }); return v; };

const routes = {
  "/api/search": (q) => { need(q, "term", "lat", "lng"); return nz.search(q.get("term"), [num(q, "lat"), num(q, "lng")]); },
  "/api/poi": (q) => { need(q, "hash"); return nz.poi(q.get("hash")); },
  "/api/route": (q) => {
    need(q, "origin", "destination");
    const wp = q.get("waypoints");
    return nz.direction(q.get("origin"), q.get("destination"), {
      type: q.get("type") ?? "car", mode: q.get("mode") ?? "traffic", alternative: q.get("alternative") === "true",
      waypoints: wp ? wp.split("|") : undefined,
      avoidTrafficZone: q.get("avoidTrafficZone") === "true", avoidOddEvenZone: q.get("avoidOddEvenZone") === "true",
    });
  },
  "/api/reverse": (q) => { need(q, "lat", "lng"); return nz.reverse(num(q, "lat"), num(q, "lng")); },
  "/api/geocode": (q) => { need(q, "address"); return nz.geocode(q.get("address"), { city: q.get("city") ?? undefined, province: q.get("province") ?? undefined, plus: q.get("plus") === "1" }); },
  "/api/isochrone": (q) => {
    need(q, "lat", "lng");
    const t = q.get("time"), d = q.get("distance");
    return nz.isochrone([num(q, "lat"), num(q, "lng")], { timeMin: t != null ? num(q, "time") : undefined,
      distanceKm: d != null ? num(q, "distance") : undefined, dataset: q.get("dataset") ?? undefined });
  },
  "/api/nearby": (q) => { need(q, "lat", "lng", "layer", "radius"); return nz.nearby([num(q, "lat"), num(q, "lng")], q.get("layer"), num(q, "radius")); },
};

export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const handler = routes[url.pathname];
  if (handler) {
    if (req.method !== "GET") return send(res, 405, { error: "method not allowed" });
    try { return send(res, 200, await handler(url.searchParams)); }
    catch (e) {
      if (e instanceof NeshanError) {
        // Never leak configuration details; map upstream config errors to 502, pass through client-side ones.
        const cfg = [480, 481, 483, 484, 485].includes(e.status);
        return send(res, cfg ? 502 : e.status === 503 ? 503 : e.status, { error: e.errorName, upstreamStatus: e.status });
      }
      return send(res, e.status ?? 400, { error: e.message });   // client-side validation errors
    }
  }
  if (STATIC_DIR) {
    const rel = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
    const file = path.resolve(STATIC_DIR, rel);
    if (file.startsWith(STATIC_DIR + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
      return fs.createReadStream(file).pipe(res);
    }
  }
  send(res, 404, { error: "not found" });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, () => console.log(`Neshan proxy on http://localhost:${PORT}`));
}
