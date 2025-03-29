const map = L.map('map').setView([46.603354, 1.888334], 6);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
	maxZoom: 13
}).addTo(map);

function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function generateShuffledColors(n, seed) {
  const colors = [];
  const indices = [...Array(n).keys()];
  const rand = mulberry32(seed);

  // Shuffle (Fisher-Yates)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  for (let i = 0; i < n; i++) {
    const hue = indices[i] * (360 / n);
    const saturation = 50 + (rand() * 30); // 50% to 80%
    const lightness = 55 + (rand() * 15); // 55% to 70%
    colors.push(`hsl(${hue}, ${saturation.toFixed(1)}%, ${lightness.toFixed(1)}%)`);
  }

  return colors;
}


// Charger les zones depuis zones.json
fetch('src/datasets/gold/zones.json')
  .then(response => response.json())
  .then(zones => {
    const seed = 42;
    const colors = generateShuffledColors(zones.length, seed);
    const zoneColors = {};

    zones.forEach((zone, idx) => {
      zoneColors[zone.id.toString()] = colors[idx];
    });

    // Charger les départements
    fetch('src/datasets/gold/dpts.geojson')
      .then(response => response.json())
      .then(departements => {
        L.geoJSON(departements, {
          style: feature => {
            const code = feature.properties.code;
            const zone = zones.find(z => z.departements.includes(code.toString()));
            return {
              color: zone ? zoneColors[zone.id] : '#555',
              weight: zone ? 1.5 : 0.6,
              fillColor: zone ? zoneColors[zone.id] : 'transparent',
              fillOpacity: zone ? 0.3 : 0
            };
          },
          onEachFeature: (feature, layer) => {
            layer.bindTooltip(`${feature.properties.nom} (${feature.properties.code})`);
          }
        }).addTo(map);
      });

    // Charger les PNR
    fetch('src/datasets/gold/pnr.geojson')
      .then(response => response.json())
      .then(parcs => {
        L.geoJSON(parcs, {
          style: feature => {
            const parcIndex = feature.properties.index.toString();
            const zone = zones.find(z => z.parcs.includes(parcIndex.toString()));
            return {
              color: zone ? zoneColors[zone.id] : '#228B22',
              fillColor: zone ? zoneColors[zone.id] : '#228B22',
              weight: zone ? 2 : 1.5,
              fillOpacity: zone ? 1 : 0.1,
              dashArray: '4'
            };
          },
          onEachFeature: (feature, layer) => {
            layer.bindTooltip(`${feature.properties.name} - ${feature.properties.index}` || 'PNR');
          }
        }).addTo(map);
      });
  });
