const map = L.map('map').setView([46.603354, 1.888334], 6);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20
}).addTo(map);

// Charger et afficher les PNR
fetch('data/pnr_reproj.geojson')
  .then((response) => response.json())
  .then((pnrData) => {
    L.geoJSON(pnrData, {
      style: {
        color: "#9bcaaf",
        weight: 2,
        fillOpacity: 0
      },
      onEachFeature: (feature, layer) => {
        const pnrName = feature.properties.short_name || feature.properties.name || feature.properties["name-fr"] || "Parc naturel";
        layer.bindTooltip(pnrName, {
          permanent: false,
          direction: "top"
        });
      }
    }).addTo(map);
  })
  .catch((error) => console.error('Erreur lors du chargement des PNR :', error));

// Charger et afficher les Parcs Nationaux
fetch('data/pn.geojson')
  .then((response) => response.json())
  .then((pnData) => {
    const filteredFeatures = pnData.features.filter(
      (feature) => !feature.properties.NOM_SITE.includes("adhésion")
    );
    const filteredPnData = { ...pnData, features: filteredFeatures };

    L.geoJSON(filteredPnData, {
      style: {
        color: "#228B22",
        weight: 2,
        fillOpacity: 0
      },
      onEachFeature: (feature, layer) => {
        const pnName = feature.properties.NOM_SITE || feature.properties.GEST_SITE || "Parc national";
        layer.bindTooltip(pnName, {
          permanent: false,
          direction: "top"
        });
      }
    }).addTo(map);
  })
  .catch((error) => console.error('Erreur lors du chargement des parcs nationaux :', error));

fetch('data/departements.geojson')
  .then((response) => response.json())
  .then((deptData) => {
    L.geoJSON(deptData, {
      style: {
        color: "#555",
        weight: 0.1,
        fillOpacity: 0 // pas de remplissage
      },
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(`${feature.properties.code} - ${feature.properties.nom}`, {
          permanent: false,
          direction: "center"
        });
      }
    }).addTo(map);
  })
  .catch((error) => console.error('Erreur lors du chargement des départements :', error));