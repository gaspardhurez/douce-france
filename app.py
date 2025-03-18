from map_generation import load_map
import json
import streamlit as st
from streamlit_folium import folium_static
import folium


with open("data/regions.geojson", "r", encoding="utf-8") as f:
    regions_geojson = json.load(f)

m = load_map(regions_geojson)


# Afficher la carte dans Streamlit
folium_static(m, height=800, width=700)
