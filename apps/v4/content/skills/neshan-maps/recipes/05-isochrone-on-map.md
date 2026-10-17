# 05 "Reachable in N minutes" overlay

```js
async function showReach(center /* [lng, lat] */, minutes = 10, dataset = "PRIMARY") {
  const r = await fetch(`/api/isochrone?lat=${center[1]}&lng=${center[0]}&time=${minutes}&dataset=${dataset}`);
  if (!r.ok) return alert("خطا در دریافت محدوده");
  const fc = await r.json();                                   // GeoJSON FeatureCollection, coordinates [lng, lat]
  if (map.getLayer("reach-fill")) map.removeLayer("reach-fill");
  if (map.getLayer("reach-line")) map.removeLayer("reach-line");
  if (map.getSource("reach")) map.removeSource("reach");
  map.addSource("reach", { type: "geojson", data: fc });
  map.addLayer({ id: "reach-fill", type: "fill", source: "reach", paint: { "fill-color": "#250ECD", "fill-opacity": 0.18 } });
  map.addLayer({ id: "reach-line", type: "line", source: "reach", paint: { "line-color": "#250ECD", "line-width": 2 } });
  const ring = fc.features[0].geometry.coordinates[0];
  map.fitBounds(ring.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(ring[0], ring[0])), { padding: 60 });
}
```

Notes
- Query: exactly one of `time` (minutes) or `distance` (km). Both together -> `400`.
- Default output is `polygons=true` in the proxy/clients (a fill needs a Polygon). With `LineString` output use a `line` layer.
- `dataset`: `PRIMARY` (car with live traffic), `TYPICAL`, `NO_TRAFFIC`, `MOTORCYCLE`, `BICYCLE`, `PEDESTRIAN`.
- `denoise` (0..1) simplifies the polygon; raise it for lighter payloads on mobile.
- Typical use: store-locator "delivery area", "10-minute walk to metro". Test whether a point is inside the area with
  Turf `booleanPointInPolygon` (client) or Shapely (server).
