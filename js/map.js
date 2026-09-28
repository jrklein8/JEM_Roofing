/* JEM Roofing Co. — service area map (Leaflet + CARTO dark basemap) */
(function () {
  'use strict';
  const el = document.getElementById('area-map');
  if (!el || !window.L) return;

  const HQ = [34.2257, -77.9447]; // Wilmington, NC
  /* name, lat, lng, label direction (null = show on hover only), hq */
  const towns = [
    ['Wilmington', 34.2257, -77.9447, 'top', true],
    ['Leland', 34.2563, -78.0447, 'left'],
    ['Wrightsville Beach', 34.2085, -77.7964, 'right'],
    ['Carolina Beach', 34.0352, -77.8936, 'right'],
    ['Kure Beach', 33.9932, -77.9072, null],
    ['Southport', 33.9215, -78.0203, 'right'],
    ['Oak Island', 33.9166, -78.1611, 'bottom'],
    ['Boiling Spring Lakes', 34.0313, -78.0672, null],
    ['Shallotte', 33.9738, -78.3861, 'left'],
    ['Ocean Isle Beach', 33.8935, -78.4267, 'bottom'],
    ['Castle Hayne', 34.3557, -77.9003, null],
    ['Hampstead', 34.3677, -77.7105, 'right'],
  ];

  const map = L.map(el, {
    zoomControl: false, scrollWheelZoom: false, attributionControl: true,
    dragging: !L.Browser.mobile, tap: false, zoomSnap: 0.25, zoomDelta: 0.5,
  });
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  /* Esri World Dark Gray basemap (free to use with attribution) + its label/reference layer */
  const esriAttr = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, OpenStreetMap contributors';
  const base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: esriAttr, maxZoom: 16 }).addTo(map);
  const ref = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, pane: 'overlayPane', opacity: .8 }).addTo(map);

  /* fallback 1: if Esri tiles fail, switch to OpenStreetMap with a CSS dark filter */
  let failures = 0, swapped = false;
  base.on('tileerror', () => {
    if (swapped || ++failures < 3) return;
    swapped = true; map.removeLayer(base); map.removeLayer(ref); el.classList.add('map-osm-dark');
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 }).addTo(map);
    let osmFail = 0;
    osm.on('tileerror', () => { if (++osmFail >= 3) { map.removeLayer(osm); el.classList.remove('map-osm-dark'); addSketch(); } });
  });

  /* fallback 2: no tile host reachable (e.g. a sandboxed preview) — draw the coast and river
     in real coordinates so the pins still sit on a recognizable map instead of a blank box */
  let sketched = false;
  function addSketch() {
    if (sketched) return; sketched = true; el.classList.add('map-sketch');
    const coast = [[33.85,-78.60],[33.88,-78.51],[33.89,-78.43],[33.91,-78.30],[33.905,-78.20],[33.91,-78.10],[33.89,-78.02],[33.86,-77.98],[33.84,-77.95],[33.88,-77.93],[33.96,-77.92],[34.03,-77.885],[34.10,-77.86],[34.18,-77.81],[34.21,-77.79],[34.27,-77.74],[34.35,-77.65],[34.43,-77.55],[34.52,-77.40]];
    const ocean = coast.concat([[34.52,-76.6],[33.2,-76.6],[33.2,-78.6]]);
    L.polygon(ocean, { color: 'rgba(120,170,200,.35)', weight: 1.5, fillColor: '#0c1a24', fillOpacity: 1, interactive: false }).addTo(map).bringToBack();
    const river = [[34.32,-77.99],[34.23,-77.955],[34.17,-77.96],[34.10,-77.94],[34.04,-77.96],[33.98,-77.99],[33.93,-78.00],[33.90,-77.99],[33.87,-77.97]];
    L.polyline(river, { color: '#0c1a24', weight: 7, opacity: 1, interactive: false }).addTo(map);
    L.polyline(river, { color: 'rgba(120,170,200,.35)', weight: 1, interactive: false }).addTo(map);
    const note = L.control({ position: 'topleft' });
    note.onAdd = () => { const d = L.DomUtil.create('div', 'map-note'); d.textContent = 'Simplified map — live street tiles load on the published site'; return d; };
    note.addTo(map);
  }

  /* soft service radius around HQ (~35 mi) */
  L.circle(HQ, { radius: 56000, color: '#2E8B3E', weight: 1.5, opacity: .6, fillColor: '#2E8B3E', fillOpacity: .08, dashArray: '6 8' }).addTo(map);

  const pin = (hq) => L.divIcon({ className: 'map-pin' + (hq ? ' map-pin-hq' : ''), iconSize: hq ? [18, 18] : [10, 10], iconAnchor: hq ? [9, 9] : [5, 5] });
  const group = [];
  const offsets = { top: [0, -10], bottom: [0, 10], left: [-8, 0], right: [8, 0] };
  towns.forEach(([name, lat, lng, dir, hq]) => {
    const m = L.marker([lat, lng], { icon: pin(hq), keyboard: false }).addTo(map);
    m.bindTooltip(name, { permanent: !!dir, direction: dir || 'top', offset: dir ? offsets[dir] : [0, -8], className: 'map-label' + (hq ? ' map-label-hq' : '') });
    group.push(m);
  });

  map.fitBounds(L.featureGroup(group).getBounds(), { padding: [36, 36] });
  window.addEventListener('resize', () => map.invalidateSize());
})();
