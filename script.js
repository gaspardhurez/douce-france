const map = L.map('map').setView([46.603354, 1.888334], 6);

// Ajouter une tuile de fond OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap France',
  maxZoom: 18,
}).addTo(map);

// Charger le fichier GeoJSON des régions
fetch('data/regions.geojson')
  .then((response) => response.json())
  .then((geojsonData) => {
    // Ajouter les régions sur la carte
    L.geoJSON(geojsonData, {
      style: {
        color: '#000',
        weight: 1,
        fillColor: '#3388ff',
        fillOpacity: 0.4,
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.nom;
        const url = "https://www.notion.so/zeruh/Douce-France-Pr-paration-15da46ac2aa780f49f52e0f5e4fa69d5?pvs=4"; // lien à adapter
        
        layer.bindTooltip(name, { permanent: false, direction: "top" }); // Tooltip appears on hover

        // Ensure no popups are attached
        layer.unbindPopup();

        layer.on("click", () => {
          window.open(url, "_blank"); // ouvrir dans un nouvel onglet
        });
      }
    }).addTo(map);
  })
  .catch((error) => console.error('Erreur lors du chargement du GeoJSON :', error));