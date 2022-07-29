# EEZ explorer

https://kamataryo.github.io/eez-explorer

## data

https://www.marineregions.org/

## develop

```shell
$ ogr2ogr -f GeoJSON ./raw/eez.geojson ./raw/eez_v11.shp
$ tippecanoe -zg --output-to-directory ./tiles --no-tile-compression -l eez ./raw/eez.geojson
$ find ./tiles -name "*.pbf" -exec bash -c 'mv "$1" "${1%.pbf}"mvt' - '{}' \;
```