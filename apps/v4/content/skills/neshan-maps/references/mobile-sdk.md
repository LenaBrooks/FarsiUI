# Mobile SDKs (Android, iOS)

Both new SDKs are **MapLibre Native** with a Neshan API key added. In practice: you write ordinary MapLibre
Native code, so general MapLibre Native docs/answers apply. Only installation, the key and the style URLs are
Neshan-specific. Facts below are from the official docs (snapshot 2026-10-11).

Hosted styles (same as web): `https://static.neshan.org/sdk/maplibre/styles/{light|dark|monochrome_light|monochrome_dark|pastel}.json`.

## Android (new SDK)

1. `settings.gradle(.kts)`: `google()` and `mavenCentral()` in `dependencyResolutionManagement.repositories`. **No custom repository needed.**
2. `app/build.gradle(.kts)`: `implementation("org.neshan.maplibre:android-sdk-opengl:13.4.1")`
3. `AndroidManifest.xml`: `<uses-permission android:name="android.permission.INTERNET" />` and inside `<application>`:
   `<meta-data android:name="org.maplibre.android.API_KEY" android:value="YOUR_API_KEY" />`
4. Layout: `<org.maplibre.android.maps.MapView android:id="@+id/mapView" android:layout_width="match_parent" android:layout_height="match_parent" />`
5. Activity: call `MapLibre.getInstance(this)` **before** `setContentView`, forward every lifecycle callback to the `MapView`:

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var mapView: MapView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        MapLibre.getInstance(this)
        setContentView(R.layout.activity_main)
        mapView = findViewById(R.id.mapView)
        mapView.onCreate(savedInstanceState)
        mapView.getMapAsync { map ->
            map.setStyle(Style.Builder().fromUri("https://static.neshan.org/sdk/maplibre/styles/light.json"))
            map.cameraPosition = CameraPosition.Builder().target(LatLng(35.6892, 51.3890)).zoom(11.0).build()
        }
    }
    override fun onStart() { super.onStart(); mapView.onStart() }
    override fun onResume() { super.onResume(); mapView.onResume() }
    override fun onPause() { mapView.onPause(); super.onPause() }
    override fun onStop() { mapView.onStop(); super.onStop() }
    override fun onLowMemory() { super.onLowMemory(); mapView.onLowMemory() }
    override fun onDestroy() { mapView.onDestroy(); super.onDestroy() }
    override fun onSaveInstanceState(outState: Bundle) { super.onSaveInstanceState(outState); mapView.onSaveInstanceState(outState) }
}
```

Forgetting the lifecycle forwarding is the usual cause of a blank map or crashes on rotation.

Feature snippets (documented, Kotlin; `LatLng(lat, lng)`):
- Marker on long press: `map.addOnMapLongClickListener { latLng -> map.addMarker(MarkerOptions().position(latLng).title("..").snippet("..")); true }`.
  Custom icon: `IconFactory.getInstance(this).fromResource(R.drawable.ic_marker)` then `.icon(icon)`. Many: `map.addMarkers(listOf(MarkerOptions()...))`.
  Click: `map.setOnMarkerClickListener { m -> ...; true }`. Remove: `map.removeMarker(m)` / `map.clear()` (all annotations).
  `marker.showInfoWindow(map, mapView)`. For clustering the docs point to the separate MapLibre Annotation Plugin.
- Line: `map.addPolyline(PolylineOptions().add(LatLng(..), LatLng(..)).color(Color.parseColor("#2277BD")).width(4f).alpha(0.7f))`;
  remove with `map.removePolyline(p)`; batch with `addPolylines`. Polygons: `PolygonOptions` (`fillColor`, `strokeColor`, `alpha`), `addPolygon`.
- Camera: `map.cameraPosition = CameraPosition.Builder().target(..).zoom(..).bearing(..).tilt(..).build()`.
- Change style: `map.setStyle(Style.Builder().fromUri(url))`. Add markers/lines only after the style is loaded
  (the docs recommend a style-loaded callback), otherwise they can be lost on a style change.

Drawing a Neshan route on Android: call the routing API from your backend (or an HTTP client), decode `overview_polyline.points`
(precision 5, gives lat,lng) into `LatLng`s and feed them to `PolylineOptions`. Decoder (same algorithm as `scripts/neshan.py`; not compiled here):

```kotlin
fun decodePolyline(s: String): List<LatLng> {
    val out = ArrayList<LatLng>(); var i = 0; var lat = 0; var lng = 0
    while (i < s.length) {
        for (axis in 0..1) {
            var shift = 0; var result = 0; var b: Int
            do { b = s[i++].code - 63; result = result or ((b and 0x1f) shl shift); shift += 5 } while (b >= 0x20)
            val d = if (result and 1 != 0) (result shr 1).inv() else result shr 1
            if (axis == 0) lat += d else lng += d
        }
        out.add(LatLng(lat / 1e5, lng / 1e5))
    }
    return out
}
```

## iOS (new SDK)

1. Download `https://static.neshan.org/sdk/maplibre/ios/MapLibre-6.28.0.zip`, unzip: it must contain `Package.swift` at the root and `MapLibre.xcframework`.
2. Xcode: File > Add Package Dependencies... > **Add Local...** > pick that folder > enable product `MapLibre` for the target that shows the map.
3. `Info.plist`: `<key>MLNApiKey</key><string>YOUR_API_KEY</string>`. No init call needed; the key is read when the first `MLNMapView` is created.
4. Map:

```swift
import UIKit
import MapLibre

final class MapViewController: UIViewController {
    private var mapView: MLNMapView!
    override func viewDidLoad() {
        super.viewDidLoad()
        let styleURL = URL(string: "https://static.neshan.org/sdk/maplibre/styles/light.json")
        mapView = MLNMapView(frame: view.bounds, styleURL: styleURL)
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        mapView.setCenter(CLLocationCoordinate2D(latitude: 35.6892, longitude: 51.3890), zoomLevel: 11, animated: false)
        view.addSubview(mapView)
    }
}
```
SwiftUI: wrap `MLNMapView` in `UIViewRepresentable`.

Feature snippets (documented):
- Marker: `let m = MLNPointAnnotation(); m.coordinate = c; m.title = ".."; m.subtitle = ".."; mapView.addAnnotation(m)`.
  Long press: add a `UILongPressGestureRecognizer`, `mapView.convert(point, toCoordinateFrom: mapView)`.
  Custom icon via `MLNMapViewDelegate.mapView(_:imageFor:)` returning `MLNAnnotationImage` (use `dequeueReusableAnnotationImage`).
- Line: `var coords = [CLLocationCoordinate2D(...)]; mapView.addAnnotation(MLNPolyline(coordinates: &coords, count: UInt(coords.count)))`.
  **Colour/width are set through delegate methods, not on the object:** `strokeColorForShapeAnnotation`, `lineWidthForPolylineAnnotation`,
  `alphaForShapeAnnotation`. Remove with `removeAnnotation`.
- Style: `mapView.styleURL = URL(string: ".../dark.json")`; use `mapView(_:didFinishLoading:)` to add things after the style loads.

## Legacy SDKs (do not start new projects on them)

- The Android and iOS **legacy** SDK pages in the docs carry an "expired / unsupported" notice. The Android legacy SDK needs a license file
  (`neshan.license`, generated in the panel from package name and SHA-1 fingerprints), the Neshan Maven repository
  (`https://maven.neshan.org/artifactory/public-maven`) and `neshan-android-sdk:mobile-sdk:1.0.3`.
- If a user is on the legacy SDK, recommend migrating to the new MapLibre-based SDK. Their layers (traffic, POI, database layer) and classes
  differ from the new SDK; do not mix snippets between the two.
- Legacy Android FAQ lists these causes of a blank/failed map: license file missing or not matching the app's `applicationId` (a separate license is
  needed per `applicationId` if build types/flavors change it), account suspended (debt over 100,000 toman, negative balance for 24 hours, holding more than
  one account), or more than 500 requests per minute. First fix to try: clean + rebuild, then Invalidate Caches.
- WordPress add-on is deprecated; the docs suggest the Code Snippets plugin with the web SDK instead.
