import folium

def load_map(geojson):
    m = folium.Map(location=[46.603354, 1.888334], zoom_start=5.5)

    # Fonction de style pour colorier les régions
    def style_function(feature):
        return {
            "fillColor": "#3186cc",
            "color": "black",
            "weight": 1,
            "fillOpacity": 0.5
        }

    # Générer les popups avec un lien cliquable (pas de script)
    for feature in geojson["features"]:
        nom_region = feature["properties"]["nom"]
        url = f"https://www.notion.so/zeruh/Douce-France-Pr-paration-15da46ac2aa780f49f52e0f5e4fa69d5?pvs=4"

        popup_html = f"""
        <p><strong>{nom_region}</strong></p>
        <p><a href="{url}" target="_blank" onclick="window.open(this.href); return false;">📎 Ouvrir dans Notion</a></p>
        """

        folium.GeoJson(
            feature,
            style_function=style_function,
            tooltip=nom_region,
            popup=folium.Popup(popup_html, max_width=300)
        ).add_to(m)

    return m