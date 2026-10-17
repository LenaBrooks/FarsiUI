# 02 Route with ETA drawn on the map

```js
async function showRoute(origin, destination, { alternative = true } = {}) {      // points are [lat, lng]
  const q = new URLSearchParams({ origin: origin.join(","), destination: destination.join(","), alternative });
  const r = await fetch(`/api/route?${q}`);
  if (!r.ok) return alert(r.status === 404 ? "مسیری پیدا نشد" : "خطا در مسیریابی");
  const { routes } = await r.json();
  routes.forEach((route, i) => drawRoute(route, i));
  fit(routes[0]); renderSummary(routes); renderSteps(routes[0]);
}

function drawRoute(route, i) {
  const coords = decodePolyline(route.overview_polyline.points).map(([lat, lng]) => [lng, lat]);   // decodePolyline: see assets/map-template.html
  const id = `route-${i}`;
  for (const k of [id, id + "-casing"]) { if (map.getLayer(k)) map.removeLayer(k); }
  if (map.getSource(id)) map.removeSource(id);
  map.addSource(id, { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: coords } } });
  map.addLayer({ id: id + "-casing", type: "line", source: id, layout: { "line-join": "round", "line-cap": "round" },
                 paint: { "line-color": "#fff", "line-width": i === 0 ? 10 : 8 } });
  map.addLayer({ id, type: "line", source: id, layout: { "line-join": "round", "line-cap": "round" },
                 paint: { "line-color": i === 0 ? "#250ECD" : "#8a8aa0", "line-width": i === 0 ? 6 : 5 } });
}

const total = (route) => route.legs.reduce((a, l) => ({ m: a.m + l.distance.value, s: a.s + l.duration.value }), { m: 0, s: 0 });
function renderSummary(routes) {
  routes.forEach((r, i) => { const t = total(r);
    console.log(`مسیر ${i + 1}: ${(t.m / 1000).toFixed(1)} کیلومتر، ${Math.round(t.s / 60)} دقیقه`); });
}
function renderSteps(route) {
  for (const leg of route.legs) for (const st of leg.steps) console.log(st.instruction, st.distance.text);   // Persian text
}
function fit(route) {
  const pts = decodePolyline(route.overview_polyline.points).map(([la, ln]) => [ln, la]);
  map.fitBounds(pts.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(pts[0], pts[0])), { padding: 80 });
}
```

Rules
- Draw on/after `map.on("load")` (or after the style finished loading when you change styles).
- Totals = sum of **leg** values; there is no route-level total.
- Decoded polyline is `[lat, lng]`; MapLibre needs `[lng, lat]`.
- Alternatives exist only when the API returns more than one route; index 0 is the recommended one.
- Redraw on every request: remove old sources/layers first (ids above) or the second call throws "Source already exists".
- Pass `avoidTrafficZone`/`avoidOddEvenZone` only when the user asked; combined with a destination inside the odd-even zone outside Tehran the API returns `NoRouteFound`.
- Motorcycle: add `type=motorcycle` (proxy forwards it). Walking: the proxy does not expose it; use `nz.pedestrian()` in a new route.
- Turn-by-turn: `step.instruction` is Persian text; `step.start_location` is `[lng, lat]` (for highlighting the current step).
- Polling ETA with live traffic: re-request every 30-60 s at most; mind quota (`481`) and rate (`482`).

Mobile: draw with `PolylineOptions` (Android) / `MLNPolyline` (iOS), see `../references/mobile-sdk.md` for decoders.
