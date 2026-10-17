// Executes the inline script of assets/map-template.html against a stubbed MapLibre + DOM and checks behaviour.
// Run: node test_template.mjs
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(here, "../assets/map-template.html"), "utf8");
const scripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
assert.equal(scripts.length, 1, "expected exactly one inline script");

const log = { sources: {}, layers: [], markers: [], fit: null, handlers: {}, opts: null };
class LngLatBounds { constructor(a, b) { this.min = [...a]; this.max = [...b]; }
  extend(c) { this.min = [Math.min(this.min[0], c[0]), Math.min(this.min[1], c[1])]; this.max = [Math.max(this.max[0], c[0]), Math.max(this.max[1], c[1])]; return this; } }
class Marker { constructor(o) { this.o = o; log.markers.push(this); } setLngLat(c) { this.ll = c; return this; } addTo() { return this; } }
class MapStub {
  constructor(o) { log.opts = o; }
  addControl() {} addSource(id, s) { log.sources[id] = s; } addLayer(l) { log.layers.push(l); }
  fitBounds(b, o) { log.fit = b; }
  on(ev, a, b) { const [layer, fn] = typeof a === "function" ? [null, a] : [a, b]; (log.handlers[ev + (layer ? ":" + layer : "")] ??= []).push(fn); }
  getCanvas() { return { style: {} }; } easeTo() {} queryRenderedFeatures() { return []; }
  getSource() { return { getClusterExpansionZoom: async () => 15 }; }
}
const info = { textContent: "" };
const ctx = vm.createContext({
  window: { maplibregl: { default: { Map: MapStub, Marker, LngLatBounds, NavigationControl: class {} } } },
  document: { getElementById: () => info }, fetch: async () => { throw new Error("no network"); }, console, Math,
});
vm.runInContext(scripts[0], ctx);

// map options
assert.equal(log.opts.apiKey, "YOUR_MAP_API_KEY");
assert.equal(JSON.stringify(log.opts.center), "[51.389,35.689]");                      // [lng, lat]

// load handler draws the sample route in Tehran, in [lng, lat] order
await log.handlers.load[0]();
const coords = log.sources.route.data.geometry.coordinates;
assert.ok(coords.length > 5);
for (const [lng, lat] of coords) { assert.ok(lng > 51 && lng < 52, "lng"); assert.ok(lat > 35 && lat < 36, "lat"); }
assert.ok(log.layers.some((l) => l.id === "route-line" && l.type === "line"));
assert.ok(log.fit, "fitBounds called");
assert.equal(log.markers.length, 2);                                       // start + end markers
// clustering wiring
assert.equal(log.sources.pts.cluster, true);
for (const id of ["clusters", "cluster-count", "unclustered"]) assert.ok(log.layers.some((l) => l.id === id), id);
assert.ok(log.handlers["click:clusters"]);

// click handler places a pin and writes coordinates
await log.handlers.click[0]({ lngLat: { lng: 51.4, lat: 35.7 } });
assert.match(info.textContent, /35\.700000/);
assert.match(info.textContent, /51\.400000/);
console.log("template OK:", coords.length, "route points,", log.layers.length, "layers");
