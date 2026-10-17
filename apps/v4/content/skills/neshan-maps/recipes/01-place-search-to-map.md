# 01 Place search box -> marker -> POI details

Flow: user types -> debounce 300 ms -> `/api/search` (Search v3, needs a reference point = map center) -> list ->
choose -> fly to it and drop a marker -> if the item has `poiHash`, fetch `/api/poi` for phone/hours.

```js
const $ = (s) => document.querySelector(s);
let timer, marker;

$("#q").addEventListener("input", (e) => {
  clearTimeout(timer);
  const term = e.target.value.trim();
  if (term.length < 2) return renderResults([]);
  timer = setTimeout(() => search(term), 300);
});

async function search(term) {
  const c = map.getCenter();                                        // reference point (lat from c.lat, lng from c.lng)
  const r = await fetch(`/api/search?term=${encodeURIComponent(term)}&lat=${c.lat}&lng=${c.lng}`);
  if (!r.ok) return renderResults([], "خطا در جستجو");
  renderResults((await r.json()).items);
}

function renderResults(items, err) {
  $("#results").innerHTML = err ? `<li>${err}</li>` : items.map((it, i) =>
    `<li data-i="${i}"><b>${esc(it.title)}</b><br><small>${esc(it.address || it.region || "")}</small></li>`).join("");
  $("#results").onclick = (ev) => { const li = ev.target.closest("li"); if (li) pick(items[li.dataset.i]); };
}

async function pick(it) {
  const lngLat = [it.location.x, it.location.y];                    // x = longitude, y = latitude
  marker?.remove();
  marker = new maplibregl.Marker({ anchor: "bottom" }).setLngLat(lngLat).addTo(map);
  map.flyTo({ center: lngLat, zoom: 16 });
  let html = `<b>${esc(it.title)}</b><br>${esc(it.address || "")}`;
  if (it.poiHash) {                                                  // only verified places have one
    const r = await fetch(`/api/poi?hash=${encodeURIComponent(it.poiHash)}`);
    if (r.ok) { const p = await r.json(); html += details(p); }
  }
  marker.setPopup(new maplibregl.Popup({ offset: 24 }).setHTML(html)).togglePopup();
}

function details(p) {
  const tel = p.phoneNumber ? `<br>☎ <a href="tel:${esc(p.phoneNumber)}">${esc(p.phoneNumber)}</a>` : "";
  const site = p.website ? `<br><a href="${/^https?:/.test(p.website) ? esc(p.website) : "https://" + esc(p.website)}" target="_blank" rel="noopener">وب‌سایت</a>` : "";
  const hours = (p.workHours || []).map((d) => `${esc(d.day)}: ${d.ranges?.length ? d.ranges.map((r) => `${esc(r.start)}–${esc(r.end)}`).join("، ") : "تعطیل"}`).join("<br>");
  return tel + site + (hours ? `<br><small>${hours}</small>` : "");
}
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
```

Notes
- Always HTML-escape API strings before putting them in popups (place names are user-contributed data).
- `location` of Search/POI items is `{x, y}` = `{lng, lat}`.
- Items without `poiHash` have no detail page: show only title/address.
- Show a "no results" state and keep the last good list while a new request is in flight.
- Search runs per keystroke after debounce; cache by `term + rounded center` to save quota.
