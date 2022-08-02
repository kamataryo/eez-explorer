# EEZ explorer

https://kamataryo.github.io/eez-explorer

EEZ explorer は EEZ (排他的経済水域) を探索するインタラクティブなウェブ地図です。
EEZ 領域は [marineregions.org](https://www.marineregions.org/) のデータを利用しています。
[Issues](https://github.com/kamataryo/eez-explorer/issues) と [プルリクエスト](https://github.com/kamataryo/eez-explorer/pulls) はお気軽にお寄せ下さい。日本語でも問題ありません。

## develop

```shell
$ ogr2ogr -f GeoJSON ./raw/eez.geojson ./raw/eez_v11.shp
$ tippecanoe -zg --output-to-directory ./tiles --no-tile-compression -l eez ./raw/eez.geojson
$ find ./tiles -name "*.pbf" -exec bash -c 'mv "$1" "${1%.pbf}"mvt' - '{}' \;
```
