# Static Map APIs (map as an image)

Use for emails, SMS/chat previews, PDFs, thumbnails, receipts, or anywhere an interactive map is overkill.
Both endpoints return an **image** (not JSON), are `GET`, and take the key as a **query parameter `key`**
(not the `Api-Key` header). Errors are the shared table in `conventions.md`, plus `503` (`render_timeout`,
`overloaded`), so retry with backoff.

Because the key is in the URL, a static map URL embedded in a public page exposes that key. Restrict the key
(domain/service scope) in the panel, or fetch the image on your server and serve/cache it yourself.

## Static map: `GET https://api.neshan.org/v5/static`

| Param | Req | Notes |
|---|---|---|
| `key` | yes | key from the panel |
| `zoom` | yes | **5..19** |
| `latitude` | yes | center latitude (WGS84). **The docs' parameter table swaps the descriptions of latitude/longitude; the sample and the names are authoritative** |
| `longitude` | yes | center longitude |
| `width`, `height` | no | **200..2048** px, default 512 |
| `style` | no | `light` (default) or `dark` |
| `marker` | no | `red`, `green`, `blue`, `violet`, or a token of a custom icon uploaded at `https://platform.neshan.org/panel/icons`. No `marker` param = no marker |

```
https://api.neshan.org/v5/static?key=KEY&style=light&width=500&height=500&zoom=15&latitude=32.657307&longitude=51.677579&marker=red
```

## Static map arc: `GET https://api.neshan.org/v5/static/arc`

An image with a curved line between two points (good for "from city A to city B" previews; not a driving route).

| Param | Req | Notes |
|---|---|---|
| `key` | yes | |
| `fromLatitude`, `fromLongitude` | yes | arc start |
| `toLatitude`, `toLongitude` | yes | arc end |
| `width`, `height`, `style` | no | as above (200..2048, default 512, `light`/`dark`) |
| `color` | no | hex, with or without `#` (default black). A `#` must be encoded as `%23` |
| `dashed` | no | `true` for a dashed line. Default false |
| `fromMarker`, `toMarker` | no | `red`/`green`/`blue`/`violet` or custom icon token |

```
https://api.neshan.org/v5/static/arc?key=KEY&style=light&fromLatitude=38.073362&fromLongitude=46.298018&toLatitude=25.292741&toLongitude=60.649445&width=600&height=600&dashed=true&color=%23FF0AA5&fromMarker=red&toMarker=green
```

## Code

```python
img = nz.static_map(35.7008, 51.3888, zoom=15, width=600, height=400, marker="red")   # bytes
open("map.png", "wb").write(img)
```

```js
const url = nz.staticMapUrl(35.7008, 51.3888, { zoom: 15, width: 600, height: 400, marker: "red" });
// <img src={url}> (mind the key exposure note above) or fetch(url) on the server
```

The image format (PNG vs other) is not stated in the docs; detect by magic bytes or let the browser/`<img>` handle it.
Static maps cannot draw polylines or several markers (no such parameters are documented); use a real map or
the arc API for a line between two points.
