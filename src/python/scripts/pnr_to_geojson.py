import geopandas as gpd

gdf = gpd.read_file("data/pnr.geojson")
gdf = gdf.to_crs(epsg=4326)
gdf.to_file("pnr_reproj.geojson", driver="GeoJSON")



gdf = gpd.read_file("data/pn/N_ENP_PN_S_000.shp")
gdf = gdf.to_crs(epsg=4326)
gdf.to_file("pn.geojson", driver="GeoJSON")