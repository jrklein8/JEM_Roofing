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
    dragging: !L.Browser.mobile, tap: false,
  });
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd', maxZoom: 19,
  }).addTo(map);

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

  map.fitBounds(L.featureGroup(group).getBounds().pad(0.08));
  window.addEventListener('resize', () => map.invalidateSize());
})();
