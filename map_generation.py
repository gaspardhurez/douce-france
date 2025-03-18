import json
import folium


def load_map(geojson):

    m = folium.Map(location=[46.603354, 1.888334], zoom_start=5.5)
    folium.GeoJson(geojson).add_to(m)

    import random

    def random_color():
        return "#{:06x}".format(random.randint(0, 0xFFFFFF))

    def style_function(feature):
        return {
            "fillColor": random_color(),  # Applique une couleur aléatoire
            "color": "black",  # Bordure noire
            "weight": 1,  # Épaisseur de la bordure
            "fillOpacity": 0.5  # Opacité du remplissage
        }

    folium.GeoJson(
        geojson,
        name="Régions",
        style_function=style_function
    ).add_to(m)

    return m