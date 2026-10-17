# 06 Address form with confidence check

```js
async function geocode(address, { city, province } = {}) {
  const q = new URLSearchParams({ address, plus: "1" });
  if (city) q.set("city", city); if (province) q.set("province", province);
  const r = await fetch(`/api/geocode?${q}`);
  if (!r.ok) throw new Error(`geocode ${r.status}`);
  const { items = [] } = await r.json();                       // up to 5 suggestions, best first
  return items.map((it) => ({
    lngLat: [it.location.longitude, it.location.latitude],     // objects use {latitude, longitude}
    label: [it.province, it.city, it.neighbourhood].filter(Boolean).join("، "),
    exact: !it.unMatchedTerm,                                   // non-empty = part of the address was NOT matched
    unmatched: it.unMatchedTerm || "",
  }));
}

async function onSubmit(text) {
  const results = await geocode(text);
  if (!results.length) return say("آدرس پیدا نشد؛ جزئیات بیشتری وارد کنید");
  const best = results[0];
  marker.setLngLat(best.lngLat).addTo(map); map.flyTo({ center: best.lngLat, zoom: best.exact ? 17 : 14 });
  if (!best.exact) say(`این بخش پیدا نشد: «${best.unmatched}». موقعیت تقریبی نمایش داده شد؛ می‌توانید پین را جابه‌جا کنید.`);
}
```

Tips
- Write addresses from broad to specific: province, city, neighbourhood, street, plaque. `plus=1` resolves plaque numbers in Tehran, Mashhad, Karaj, Isfahan, Ahvaz.
- A plain `/geocoding/v1` result ends at the last main street; do not promise door-level accuracy from it.
- Let the user correct the result: make the marker draggable, then call reverse geocoding on `dragend` to refresh the address text.
- Do not store `unmatched` results as "verified" delivery locations without confirmation.
- Strip/normalise input: trim, collapse spaces, convert Arabic digits/letters to Persian (ي->ی, ك->ک) before sending.
