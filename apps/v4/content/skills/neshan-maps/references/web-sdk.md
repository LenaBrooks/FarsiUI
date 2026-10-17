# Web SDKs

Default to **MapLibre**. Everything marked verified comes from the official docs (snapshot 2026-10-11).

| SDK | Status | Package | Key option | Base |
|---|---|---|---|---|
| **MapLibre** | current, recommended | `@neshan-maps-platform/maplibre-sdk` | `apiKey` | MapLibre GL JS (bundled) |
| Leaflet | maintained, traffic + POI layers **not updated** | `@neshan-maps-platform/leaflet` | `key` | Leaflet 1.9.4 |
| OpenLayers | maintained, traffic + POI layers **not updated** | `@neshan-maps-platform/ol` | `key` | OpenLayers 8.1.0 |
| React (OpenLayers) | `@neshan-maps-platform/react-openlayers` | | `mapKey` | latest needs React 19.2.1+; `@3.0.1` documented for React 18 |
| Vue 3 (OpenLayers) | `@neshan-maps-platform/vue3-openlayers` | | `mapKey` | |
| Mapbox GL (+ React/Vue) | **expired / unsupported per docs** | `@neshan-maps-platform/mapbox-gl`, `...-react`, `...-vue` | `mapKey` | Mapbox GL JS 1.13.2 |
| WordPress add-on | **deprecated**; docs point to Code Snippets + the Mapbox-based web SDK | | | |

Suggest MapLibre for new work. For an existing Mapbox GL integration recommend migrating to MapLibre (API is
nearly identical, `nmp_mapboxgl` -> `maplibregl`, `mapKey` -> `apiKey`).

Optional package mirror: npm packages can also be installed from Neshan's registry by adding
`@neshan-maps-platform:registry=https://npm.neshan.org` to `.npmrc` (Yarn Berry: `npmScopes.neshan-maps-platform.npmRegistryServer`).
The docs present this as optional.

## MapLibre SDK

Install: `npm i @neshan-maps-platform/maplibre-sdk` (do **not** install `maplibre-gl` separately, it is bundled).

```js
import maplibregl from "@neshan-maps-platform/maplibre-sdk";
import "@neshan-maps-platform/maplibre-sdk/style.css";      // required, else controls/canvas are unstyled

const map = new maplibregl.Map({
  container: "map",                                         // id of a div that has a height
  style: "https://static.neshan.org/sdk/maplibre/styles/light.json",
  center: [51.383743, 35.701150],                           // [lng, lat]
  zoom: 12, minZoom: 2, maxZoom: 21,
  trackResize: true,
  apiKey: import.meta.env.VITE_NESHAN_MAP_KEY,              // required
});
map.addControl(new maplibregl.NavigationControl());
```

- Missing `apiKey` -> error `Api key is not defined!` and no map.
- Use a **web map** key (panel option "نقشه وب"); restrict allowed domains/IPs in the panel.
- Hosted styles (all at `https://static.neshan.org/sdk/maplibre/styles/<name>.json`): `light`, `dark`,
  `monochrome_light`, `monochrome_dark`, `pastel`.
- Custom style: design it in the style editor, download `style.json`, pass the **object** as `style`
  (`import custom from "./my-style.json"`). In the editor, traffic and POI layers are **off by default** in every
  base style; enable them there before downloading. Custom vector tiles must be MVT, `{z}/{x}/{y}`, CORS-enabled.
- CDN (no bundler), version as documented: 
  `https://static.neshan.org/sdk/maplibre/5.24.3/neshan-maplibre-sdk.css` and `.../neshan-maplibre-sdk.umd.js`;
  the class is `const maplibregl = window.maplibregl.default;`.
- Persian/Arabic RTL label rendering is on by default. Options: `rtl: false`, `rtl: { lazy: false }` (the default `lazy: true` defers loading the RTL plugin until the first Persian/Arabic label appears;
  set `false` for mainly Persian maps), `rtl: { url: "/rtl.js" }` (self-hosted plugin).
- Logo and copyright cannot be removed, only moved: `logoPosition` (this is the **attribution/copyright text**,
  default `bottom-left`) and `copyRightPosition` (this is the **Neshan logo**, default `bottom-right`). The names are swapped
  relative to what you would expect.
- All standard MapLibre GL JS features work (GeoJSON/raster/vector sources, layers, style expressions, camera).
  MapLibre docs: https://maplibre.org/maplibre-gl-js/docs/

### Frameworks: the one rule

MapLibre needs a real DOM element and browser globals such as `window` and `DecompressionStream` at construction. Create the map **only on the client**,
inside `useEffect` / `onMounted` / `ngAfterViewInit` / `onMount`, and call `map.remove()` on unmount. In Next.js use a
client component with `dynamic(() => import("./MapView"), { ssr: false })`.

```jsx
import { useEffect, useRef } from "react";
import maplibregl from "@neshan-maps-platform/maplibre-sdk";
import "@neshan-maps-platform/maplibre-sdk/style.css";

export function MapView({ apiKey, style = "https://static.neshan.org/sdk/maplibre/styles/light.json", onReady }) {
  const ref = useRef(null), mapRef = useRef(null);
  useEffect(() => {
    if (!ref.current || mapRef.current) return;              // StrictMode double-invoke guard
    const map = new maplibregl.Map({ container: ref.current, style, center: [51.389, 35.689], zoom: 12, apiKey });
    map.addControl(new maplibregl.NavigationControl());
    map.on("load", () => onReady?.(map));
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [apiKey, style]);
  return <div ref={ref} style={{ position: "absolute", inset: 0 }} />;
}
```

(The official page also has Vue 3, Angular and Svelte versions of the same pattern.)

### Core recipes (all coordinates `[lng, lat]`)

Marker + popup:
```js
new maplibregl.Marker().setLngLat([51.391173, 35.700954])
  .setPopup(new maplibregl.Popup().setHTML("<b>موقعیت</b>")).addTo(map);
```
Custom marker element: `new maplibregl.Marker({ element: el, anchor: "bottom" })` with `el` a styled `div`
(`anchor: "bottom"` for pin-shaped icons so the tip sits on the point, `center` for circles).

Click -> coordinates (basis of "pick location" forms):
```js
map.on("click", (e) => { const { lng, lat } = e.lngLat; /* then call reverse geocoding with lat, lng */ });
```

Restrict the viewport (e.g. to Tehran); also set `minZoom`, otherwise users can zoom out and the limit is meaningless:
```js
new maplibregl.Map({ /* ... */ minZoom: 10, maxZoom: 18, maxBounds: [[51.20, 35.55], [51.60, 35.83]] }); // [[SW],[NE]] each [lng,lat]
map.setMaxBounds(null);   // remove the limit
```

Add data layers only after `map.on("load", ...)`. Route line (decode Neshan polylines, swap to `[lng, lat]`):
```js
// polyline lib used in the docs: https://cdn.jsdelivr.net/npm/@mapbox/polyline@1.2.1/src/polyline.js
const coords = polyline.decode(step.polyline, 5).map(([lat, lng]) => [lng, lat]);   // decode gives [lat, lng]
map.addSource("route", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: coords } } });
map.addLayer({ id: "route-line", type: "line", source: "route",
  layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#250ECD", "line-width": 8 } });
```
Fit the view to a line: compute bounds with `coords.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]))`
and `map.fitBounds(bounds, { padding: 60 })`.

Clustering is a GeoJSON **source** feature: `cluster: true`, `clusterRadius` (px, default 50), `clusterMaxZoom`, optional
`clusterProperties`. MapLibre adds `point_count`, `point_count_abbreviated`, `cluster_id` to cluster features.
Draw clusters with a `circle` layer filtered by `["has", "point_count"]` (colour/size via a `step` expression on
`point_count`), a `symbol` layer showing `{point_count_abbreviated}`, and unclustered points with filter
`["!", ["has", "point_count"]]`. Expand on click with `await map.getSource(id).getClusterExpansionZoom(cluster_id)` then `easeTo` (in MapLibre 5 this returns a **Promise**; older callback samples are outdated); list a cluster's points with `getClusterLeaves(clusterId, limit, offset)` (also a Promise).
(All client side; works for hundreds to thousands of points.) Working template: `../assets/map-template.html` (JS syntax-checked, not browser-tested).

## Leaflet SDK (1.9.4)

CDN (as documented): `https://static.neshan.org/sdk/leaflet/v1.9.4/neshan-sdk/v1.0.8/index.css` and `index.js`.
```js
import L from "@neshan-maps-platform/leaflet";
import "@neshan-maps-platform/leaflet/dist/leaflet.css";
const map = new L.Map("map", { key: "<KEY>", maptype: "dreamy", center: [35.699756, 51.338076], zoom: 14 }); // Leaflet center = [lat, lng]
map.setMapType("standard-night");                 // styles: "dreamy", "standard-night", or any {z}/{x}/{y} tile URL
```
Leaflet itself is `[lat, lng]`. Neshan's online traffic and POI layers are not updated in this SDK.

## OpenLayers SDK (8.1.0)

CDN: `https://static.neshan.org/sdk/openlayers/v8.1.0/neshan-sdk/v1.0.5/index.css` and `index.js`; npm `@neshan-maps-platform/ol`.
The docs state that the online traffic layer and the POI layer are **not updated** in this SDK (and in Leaflet) and suggest the Mapbox GL SDK
for them. With MapLibre you enable them in the style instead (style editor).

```js
var map = new ol.Map({
  maptype: "dreamy",                 // or "standard-night"
  target: "map",
  key: "YOUR_WEB_API_KEY",
  view: new ol.View({ center: ol.proj.fromLonLat([51.389, 35.6892]), zoom: 14 })   // fromLonLat([lng, lat])
});
// marker
const marker = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat([51.338076, 35.699756])) });
marker.setStyle(new ol.style.Style({ image: new ol.style.Icon({ anchor: [0.5, 1], scale: 0.5, src: "marker.png" }) }));
```
Routes: decode `overview_polyline.points` / `step.polyline` (precision 5) and build an `ol.geom.LineString` in EPSG:3857 with
`ol.proj.fromLonLat([lng, lat])` per point (the official draw-route page does exactly this with a sample response).

## React / Vue components (OpenLayers based)

```jsx
import NeshanMap from "@neshan-maps-platform/react-openlayers";
import "@neshan-maps-platform/react-openlayers/dist/style.css";
<NeshanMap mapKey="YOUR_MAP_KEY" center={{ latitude: 35.7665394, longitude: 51.4749824 }} zoom={14}
           poi={true} defaultType="dreamy" onInit={(map) => { /* OpenLayers map, extra methods below */ }} />
```
Props: `mapKey` (required), `center {latitude, longitude}` (if omitted the component asks for the user's geolocation),
`zoom`, `poi`, `defaultType` (`dreamy` | `standard-night`), `onInit`. Extra map methods: `setMapType(type)`, `switchPoiLayer(bool)`.
`mapRef` exposes `mapContainer`, `ol`, `map`, `isInitiated`. For TypeScript also install `@types/ol@5` as the docs say.
React 18 projects: install `@neshan-maps-platform/react-openlayers@3.0.1`.

Vue 3: `npm i @neshan-maps-platform/vue3-openlayers`, same `mapKey` prop (see the official page for the component name and events).

## Mapbox GL SDK (expired, migrate if possible)

Class `nmp_mapboxgl` instead of `mapboxgl`; options `mapType: nmp_mapboxgl.Map.mapTypes.neshanVector`, `mapKey`, `poi`, `traffic`,
`mapTypeControllerOptions {show, position}`. CDN `https://static.neshan.org/sdk/mapboxgl/v1.13.2/neshan-sdk/v1.1.5/index.{css,js}`.
The Leaflet and OpenLayers pages recommend it for the online traffic and POI layers, but its own page carries an "expired, unsupported" warning; prefer MapLibre with traffic/POI enabled in the style.

## Direct raster tiles

A raster tile service (OSM-style) exists for verified legal entities; request it via a support ticket after identity
verification. It is not part of the normal key.
