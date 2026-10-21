/* Geographic context only: this geometry never enters the emissions model. */
function routeArc(start, finish, steps = 80) {
  const rad = Math.PI / 180;
  const vector = ([lat, lon]) => [Math.cos(lat * rad) * Math.cos(lon * rad), Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad)];
  const a = vector(start), b = vector(finish);
  const angle = Math.acos(Math.max(-1, Math.min(1, a.reduce((sum, v, i) => sum + v * b[i], 0))));
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // The app's fixed locations contain no antipodal pair.
    const weights = angle < 1e-8 ? [1 - t, t] : [Math.sin((1 - t) * angle) / Math.sin(angle), Math.sin(t * angle) / Math.sin(angle)];
    const v = a.map((x, j) => weights[0] * x + weights[1] * b[j]);
    const lat = Math.atan2(v[2], Math.hypot(v[0], v[1])) / rad;
    let lon = Math.atan2(v[1], v[0]) / rad;
    const previous = points.length ? points[points.length - 1][1] : start[1];
    while (lon - previous > 180) lon -= 360;
    while (lon - previous < -180) lon += 360;
    points.push([lat, lon]);
  }
  return points;
}
if (typeof module !== 'undefined') module.exports = { routeArc };
if (typeof document !== 'undefined') {
  (() => {
    const get = id => document.getElementById(id);
    let map, layers, lastRoute = '';
    function fit() {
      if (map && layers) map.fitBounds(layers.getBounds(), { padding: [40, 45], maxZoom: 6, animate: false });
    }
    function refresh() {
      const from = get('from').value, to = get('to').value;
      get('mapRouteName').textContent = `${from} → ${to}`;
      const modeName = id => get(id).selectedOptions[0].textContent;
      get('mapDistances').replaceChildren();
      for (const [label, id] of [['Sea assumption', 'seaDist'], ['Air assumption', 'airDist']]) {
        const chip = document.createElement('span');
        const value = Number(get(id).value);
        chip.textContent = `${label}: ${get(id).value.trim() !== '' && Number.isFinite(value) && value >= 0 ? value.toLocaleString('en-GB') + ' km' : 'check distance'}`;
        get('mapDistances').appendChild(chip);
      }
      const chip = document.createElement('span');
      chip.textContent = `Traditional: ${modeName('tradMode')} · Origin roasted: ${modeName('originMode')}`;
      get('mapDistances').appendChild(chip);
      if (!map || lastRoute === from + to) return;
      lastRoute = from + to;
      const points = routeArc(locations[from], locations[to]);
      layers.clearLayers();
      L.polyline(points, { color: '#466e93', weight: 3, dashArray: '5 8', opacity: .85 }).addTo(layers);
      for (const [position, name, colour, role] of [[points[0], from, '#146b50', 'Coffee origin'], [points[points.length - 1], to, '#c16b3d', 'Consuming market']]) {
        const text = document.createElement('span');
        text.textContent = `${role}: ${name}`;
        L.circleMarker(position, { radius: 8, color: 'white', weight: 3, fillColor: colour, fillOpacity: 1 }).bindTooltip(text, { direction: 'top' }).addTo(layers);
      }
      fit();
    }
    if (typeof L !== 'undefined') {
      get('routeMap').replaceChildren();
      map = L.map('routeMap', { scrollWheelZoom: false, minZoom: 1, maxZoom: 12 });
      layers = L.featureGroup().addTo(map);
      // Public CARTO basemap; attribution stays visible. No tile prefetch or bulk downloads.
      const tiles = L.tileLayer('https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', maxZoom: 19
      }).addTo(map);
      tiles.on('tileerror', () => { get('mapStatus').textContent = 'Some map imagery could not load. The markers and geographic connection still show the selected locations.'; });
      get('fitRoute').disabled = false;
      get('fitRoute').addEventListener('click', fit);
    } else {
      get('routeMap').textContent = 'Map unavailable. Connect to the internet and reload to see the map. The calculator and route summary still work.';
      get('routeMap').classList.add('map-fallback');
    }
    for (const id of ['from', 'to', 'seaDist', 'airDist', 'tradMode', 'originMode']) get(id).addEventListener('input', refresh);
    for (const button of document.querySelectorAll('.tab, #reset')) button.addEventListener('click', refresh);
    refresh();
  })();
}
