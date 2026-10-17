# Search and location APIs

Search, Geocoding, Reverse Geocoding, Nearby, POI Details, Region. All `GET`, header `Api-Key`.
Shared rules: `conventions.md`.

## Which one?

| User intent | API |
|---|---|
| Free-text place search ("کافه نزدیک میدان تجریش") near a point | Search `GET /v3/search` |
| Full postal/typed **address** -> coordinates | Geocoding `GET /geocoding/v1` or `/geocoding/v1/plus` |
| Coordinates -> address | Reverse `GET /v5/reverse` |
| All places of one category within a radius | Nearby `GET /v1/nearby` |
| Phone, hours, website of one place | POI Details `GET /v1/point?hash=` |
| Province / county lists and boundaries | Region `GET /v2/region/...` |

Search vs Geocoding: Search is for names/places and needs a reference point; Geocoding parses structured
Persian addresses (plaque numbers, neighbourhoods, postal prefixes).

## Search: `GET /v3/search`

One param `q` = URL-encoded JSON `{"term": "...", "center": {"latitude": .., "longitude": ..}}`.
Both `term` and `center` are required; `center` is the user position or map center and ranks nearby results.

```
GET /v3/search?q={"term":"میدان تجریش","center":{"latitude":35.8069,"longitude":51.4287}}   (encode q)
```

Response: `{ "count": 19, "items": [ ... ] }`, item fields:
`title`, `address`, `neighbourhood` (may be empty), `region` ("city, province"), `type` (e.g. `town_square`,
`police`, mosque, street...), `category` (`place` | `municipal` | `region`), `location {x, y}`
(**x = longitude, y = latitude**), `poiHash` (only for verified Neshan places).
Pass `poiHash` to POI Details. Items without `poiHash` have no detail page.

## Geocoding: `GET /geocoding/v1` and `GET /geocoding/v1/plus`

One param `json` = URL-encoded JSON (it is a GET with the `Api-Key` header; the doc samples also add
`Content-Type: application/json`, which is harmless).

| Field | Req | Notes |
|---|---|---|
| `address` | yes | free text address, best entered from broad to specific (province, city, neighbourhood, street, plaque). For postal addresses the first 5 digits of the postal code help |
| `province`, `city` | no | filters |
| `extent` | no | bounding box `{southWest:{latitude,longitude}, northEast:{latitude,longitude}}` |
| `location` | no | `{latitude, longitude}` search center |

`/plus` additionally resolves **building plaque numbers** (Tehran, Mashhad, Karaj, Isfahan, Ahvaz) and considers
Neshan POIs. Plain `/v1` stops at the last main street.

Response: `{ "items": [ { "location": {"latitude","longitude"}, "province", "city", "neighbourhood", "unMatchedTerm" } ] }`
- Up to **5** suggestions, most relevant first.
- `unMatchedTerm` is the part of the input the service could not match ("پلاک ۱۰"). Surface it to the user and
  treat a non-empty value as lower confidence.

```python
res = nz.geocode("تهران، ارامنه، خیابان پلیس، پلاک ۱۰", city="تهران", province="تهران", plus=True)
best = res["items"][0]; lat, lng = best["location"]["latitude"], best["location"]["longitude"]
confident = not best["unMatchedTerm"]
```

## Reverse geocoding: `GET /v5/reverse?lat=..&lng=..`

Response fields: `status` (`OK`), `formatted_address`, `route_name`, `route_type`, `neighbourhood`, `city`, `state`,
`place` (nullable), `municipality_zone`, `in_traffic_zone` (bool), `in_odd_even_zone` (bool), `village`, `county`,
`district`. Many fields are `null` outside cities. `in_traffic_zone`/`in_odd_even_zone` are handy to decide whether
to set the routing avoid flags.

## Nearby: `GET /v1/nearby`

| Param | Req | Notes |
|---|---|---|
| `location` | yes | `lat,lng` |
| `layer` | yes | category slug from the table below |
| `searchRadius` | yes | meters (integer) |

Response `{ "layerPoints": { "layer": {"slug","farsiTitle","icon"}, "nearestPoints": [ {"name","location":{"latitude","longitude"},"distance","duration","poiHash"} ] } }`.
Sorted nearest first. `distance` (m) and `duration` (s) are **travel** values, so they can exceed `searchRadius`;
do not use them as straight-line filters. `404 NOT_FOUND` means nothing in range.

Layer slugs (`layer`): airline, airport, bank, cafe, cafe_restaurant, campground, car_dealer_official,
car_inspection, charity, cinema, city_hall, clinic, college, commercial_complex, company, courthouse, embassy,
entertainment, finance, foreign_consulate, formal_school, garden, gym, health_complex, helal_ahmar, historical,
hospital, hotel, industrial_zone, interests, international_expo, juice_shop, library, local_government_office,
lodging, lodging_tourist, marriage_registration_office, mosque, movie_theater, natural_feature, notary_public,
park, bus_station, metro_entrance, parking, pool, post_office, post_service, restaurant, school, shopping_mall,
stadium, studying_center, temporary_accommodation, theater, traffic_police, train_station, transit_station,
university, vegetable_market, water_park, wedding_venue.

Common Persian names: بانک=bank, کافی‌شاپ=cafe, رستوران=restaurant, بیمارستان=hospital, بوستان=park,
مسجد=mosque, هتل=hotel, ایستگاه مترو=metro_entrance, پارکینگ=parking, فرودگاه=airport, دانشگاه=university,
بازار و مرکز خرید=shopping_mall. There is no pharmacy slug in this list; for such places use Search instead.
Use only slugs from the list; the docs do not say what happens for others (expect `400`).

## POI details: `GET /v1/point?hash=<poiHash>`

`hash` comes from `poiHash` in Search v3 or Nearby. Response: `name`, `address`, `phoneNumber`, `website`,
`workHours[] {day, ranges[] {start, end}}`, `layer {slug, title, icon}`, `location {x, y}` (**x lng, y lat**),
`socialNetworks[]`.
- Optional fields can be empty. `website` is free text: it may lack `https://` or be a social-media URL; normalise
  before linking.
- A day with `ranges: []` means closed that day; a day can have several ranges (midday break); iterate them.
- Days are Persian weekday names (شنبه ... جمعه).

## Region: `GET /v2/region/...` (needs activation by support ticket)

- `/v2/region/provinces` and `/v2/region/provinces/geometry` -> `[{id, name, geometry?}]`
- `/v2/region/provinces/{provinceId}/cities` and `.../cities/geometry` -> `[{id, name, geometry?}]`
- `geometry` is a **WKT** string (`POLYGON ((lng lat, ...))`, longitude first). Convert with `wellknown` (JS), `wkx` (JS) or
  Shapely (Python) before drawing. Geometry responses are large; use the plain endpoints for dropdowns.
- Use province `id` from the list as `provinceId`.

## Typical combos

- Search box with details: `search` -> user picks result -> if `poiHash` then `poi` -> marker + popup (`../recipes/01-place-search-to-map.md`).
- Address form: `geocode` -> show up to 5 `items`, warn on `unMatchedTerm` -> set map marker (`../recipes/06-geocode-address-form.md`).
- Map tap: SDK `lngLat` -> `reverse(lat, lng)` (`../recipes/03-click-to-address.md`).
