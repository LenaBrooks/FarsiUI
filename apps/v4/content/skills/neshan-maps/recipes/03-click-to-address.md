# 03 Tap the map to get an address

```js
let pin;
map.on("click", async (e) => {
  const { lng, lat } = e.lngLat;
  pin ??= new maplibregl.Marker({ anchor: "bottom" });
  pin.setLngLat([lng, lat]).addTo(map);
  showPanel({ loading: true, lat, lng });
  try {
    const r = await fetch(`/api/reverse?lat=${lat}&lng=${lng}`);
    if (!r.ok) throw new Error(r.status);
    const a = await r.json();                      // status "OK" on success
    showPanel({ lat, lng, address: a.formatted_address, city: a.city, neighbourhood: a.neighbourhood,
                inTrafficZone: a.in_traffic_zone, inOddEven: a.in_odd_even_zone });
  } catch { showPanel({ lat, lng, address: null }); }          // keep coordinates, say address unavailable
});
```

Notes
- Reverse geocoding takes separate `lat` and `lng` params (not `lat,lng`).
- Fields are nullable outside cities (`city`, `neighbourhood`, `place`, ...). Build the display string defensively:
  `formatted_address || [route_name, neighbourhood, city].filter(Boolean).join("، ")`.
- Use `in_traffic_zone` / `in_odd_even_zone` to warn the user or to decide the routing avoid flags.
- Rate-limit clicks (ignore clicks while a request is pending) to avoid `482`.
- Draggable pin variant: `new maplibregl.Marker({ draggable: true })`, then `pin.on("dragend", () => reverse(pin.getLngLat()))`.
