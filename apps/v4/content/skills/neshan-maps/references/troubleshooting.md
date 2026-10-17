# Troubleshooting: symptom -> cause -> fix

## REST APIs

| Symptom | Likely cause | Fix |
|---|---|---|
| `480` | Header missing/misspelled, or wrong key | Header must be exactly `Api-Key`. Static Map needs `key=` in the query instead |
| `483 ApiKeyTypeError` | Using a web-map key for REST (or the reverse) | Create/select the key type for that product in the panel |
| `484 ApiWhiteListError` | Key scoped to other domains/IPs | Browser calls to REST with a restricted key fail by design; call from the allowed server/IP |
| `485 ApiServiceListError` | Service not enabled for this key | Enable it in the panel; check with `/account-inquiry/v1/services` (needs ticket activation) |
| `481` | Quota used up | Stop retrying; check `/account-inquiry/v1/remaining-charge` (`paidCharge` can be negative) |
| `482` | Per-minute rate hit | Exponential backoff, cache, debounce UI calls |
| `470` or points in the wrong place | lat/lng swapped | REST wants `lat,lng`; SDK/GeoJSON want `[lng, lat]`. `scripts/neshan.*` reject swapped Iran coordinates |
| CORS error, or you do not want the service key visible in the browser | The docs do not promise browser access; a REST key in front-end code is public | Call from a backend/proxy (`scripts/proxy-server.mjs`) |
| `400` on search | `q` not valid JSON or not URL-encoded; missing `term`/`center` | Build with `JSON.stringify`, then `encodeURIComponent` |
| Geocoding returns approximate point | `unMatchedTerm` non-empty or plain `/v1` | Use `/geocoding/v1/plus`; show the unmatched part to the user |
| Routing `NoRouteFound` | `avoidTrafficZone`/`avoidOddEvenZone` true and the destination lies inside that zone (outside Tehran), or points not snappable to a road | Drop the flags; move points to a road |
| Route line drawn as a straight/garbled line or in the ocean | Polyline decoded with wrong precision or axis order | Precision 5; result is `[lat, lng]` -> swap to `[lng, lat]`; use `overview_polyline.points` (object) |
| `Cannot read properties of undefined (reading 'split')` / decode crash | Passed the `overview_polyline` **object** to the decoder | Pass `.points` |
| Pedestrian route 400/404 | Endpoint documented inconsistently | Try `/v4/direction?type=pedestrian`, then `/v1/direction?type=pedestrian` (`pedestrian()` helper does this) |
| Predictive routing refuses | Outside Tehran/Mashhad/Karaj, `dateTime` outside the next 7 days, or malformed (`YYYY-MM-DDThh:mm`), or the doc sample's stray `%09` copied | Fix the inputs |
| Matrix element has no `distance` | `elements[j].status` is `NoRoute`/`UnknownError` | Check `status === "Ok"` before reading |
| Map matching points look swapped | `snappedPoints[].location` is `[lat, lng]` | Swap when drawing |
| Static map is empty/error `503` | Render timeout/overload, or zoom/size out of range | Retry with backoff; zoom 5..19, size 200..2048 |
| Static map centered in the wrong place | Trusting the doc's swapped parameter descriptions | `latitude` = latitude, `longitude` = longitude |
| VRP returns no routes | `solutionStrategy: STRICT` and something does not fit (capacity, windows, skills) | Use `BEST_EFFORT` and read `unassignedJobs`/`violationMessages` |
| VRP validation errors | Duplicate ids, `HH:mm:ss` format wrong, pickup+delivery over capacity, `useTrafficMultiplier` without `routingEngine: "notraffic"` | Fix the payload |
| Region API 4xx | Not activated for the key | Open a support ticket in the panel |

## Web SDK (MapLibre)

| Symptom | Cause | Fix |
|---|---|---|
| `Api key is not defined!`, no map | `apiKey` missing/undefined (often an env var not injected) | Provide the web-map key; check bundler env prefix (`VITE_`, `NEXT_PUBLIC_`) |
| Blank map or tiles not loading (check the Network tab status) | Wrong key type, or the page's domain is not allowed for that key **[inferred from 483/484 semantics]** | Use a web-map key; add the page's origin (incl. `localhost`) in the panel |
| Map has zero height | Container div has no height | `#map { position:absolute; inset:0 }` or explicit height |
| Controls/popups look broken | CSS not imported | `import "@neshan-maps-platform/maplibre-sdk/style.css"` (or the CDN css) |
| `window is not defined` / hydration errors (Next/Nuxt/SvelteKit) | Map created during SSR | Client-only creation, `dynamic(..., { ssr: false })`, create in `useEffect`/`onMounted` |
| Two maps / "container already initialized" in React dev | StrictMode double effect | Guard with a ref; `map.remove()` in cleanup |
| `Source already exists` / `Layer already exists` | Re-adding on each update | `getLayer`/`getSource` check and remove first, or `source.setData()` |
| Adding layers throws "Style is not done loading" | Added before `load` (or right after `setStyle`) | Add in `map.on("load")`; after `setStyle` wait for `styledata`/`idle` and re-add custom layers (a style change drops them) |
| Persian labels appear disconnected/reversed at first | RTL plugin disabled, or lazily loaded (default `lazy: true`) | Keep `rtl` on; for mostly Persian maps use `rtl: { lazy: false }` |
| Markers in the wrong place | `[lat, lng]` passed to MapLibre | `[lng, lat]` |
| Marker pin tip is off the point | Default anchor/custom element | `anchor: "bottom"` for pin shapes |
| Cannot remove the Neshan logo/copyright | Not allowed | Only reposition: `logoPosition` = attribution text, `copyRightPosition` = Neshan logo |
| No traffic/POI on the map | Layers off by default in styles | Enable them in the style editor and use that style JSON; Leaflet/OpenLayers SDKs do not maintain these layers |
| `getClusterExpansionZoom` callback never fires | It returns a Promise in MapLibre 5 | `await` it |
| Mapbox GL SDK stopped working | Documented as expired | Migrate to MapLibre |

## Android / iOS

| Symptom | Cause | Fix |
|---|---|---|
| Android blank map or crash on rotation | Lifecycle not forwarded to `MapView` | Forward `onCreate/onStart/onResume/onPause/onStop/onLowMemory/onDestroy/onSaveInstanceState` |
| Android `MapLibre.getInstance` missing crash | Not called before `setContentView` | Call it first in `onCreate` |
| Android auth failure | `<meta-data org.maplibre.android.API_KEY>` missing or outside `<application>` | Fix manifest; also `INTERNET` permission |
| iOS blank/401 | `MLNApiKey` missing in `Info.plist` or package product `MapLibre` not linked to the target | Add key; enable product for the right target |
| iOS line is black/thin | Colour/width are delegate-driven | Implement `strokeColorForShapeAnnotation`, `lineWidthForPolylineAnnotation` |
| Markers/lines vanish after style change | Annotations/layers dropped with the style | Re-add after the style-loaded callback |
| Legacy Android SDK shows nothing | License/applicationId mismatch, suspended account, >500 req/min | See `mobile-sdk.md` legacy notes; prefer migrating to the new SDK |
