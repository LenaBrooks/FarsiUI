# 07 Next.js integration (untested template; adapt versions)

Rule: the map component is client-only; REST calls go through route handlers so the service key stays server-side.

`app/map/page.jsx`
```jsx
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("./MapView"), { ssr: false });
export default function Page() { return <MapView />; }
```

`app/map/MapView.jsx`
```jsx
"use client";
import { useEffect, useRef } from "react";
import maplibregl from "@neshan-maps-platform/maplibre-sdk";
import "@neshan-maps-platform/maplibre-sdk/style.css";

export default function MapView() {
  const ref = useRef(null), mapRef = useRef(null);
  useEffect(() => {
    if (mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current, style: "https://static.neshan.org/sdk/maplibre/styles/light.json",
      center: [51.389, 35.689], zoom: 12, apiKey: process.env.NEXT_PUBLIC_NESHAN_MAP_KEY,   // web-map key, domain-restricted
    });
    map.addControl(new maplibregl.NavigationControl());
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);
  return <div ref={ref} style={{ position: "absolute", inset: 0 }} />;
}
```

`app/api/route/route.js` (service key only on the server: `NESHAN_API_KEY`, no `NEXT_PUBLIC_` prefix)
```js
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin"), destination = searchParams.get("destination");
  if (!origin || !destination) return NextResponse.json({ error: "origin and destination required" }, { status: 400 });
  const url = "https://api.neshan.org/v4/direction?" + new URLSearchParams({
    type: searchParams.get("type") ?? "car", origin, destination, alternative: searchParams.get("alternative") ?? "false" });
  const r = await fetch(url, { headers: { "Api-Key": process.env.NESHAN_API_KEY }, cache: "no-store" });
  const body = await r.json().catch(() => ({}));
  return NextResponse.json(r.ok ? body : { error: r.status }, { status: r.ok ? 200 : [480, 481, 483, 484, 485].includes(r.status) ? 502 : r.status });
}
```
Create the sibling handlers the same way (`reverse`, `search`, `poi`, `geocode`) following `../scripts/proxy-server.mjs`, or import `scripts/neshan.mjs` into the handler.

Checklist: two env vars (`NEXT_PUBLIC_NESHAN_MAP_KEY` for the SDK map key, `NESHAN_API_KEY` for REST), CSS import present, `"use client"` + `ssr:false`, `map.remove()` on unmount, StrictMode double-mount guard (`mapRef`).
