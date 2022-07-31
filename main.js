const mapLoadPromise = new Promise((resolve) => {

  const map = new window.geolonia.Map('#map')

  const paths = window.location.pathname.split('/')
  if(paths[paths.length - 1].startsWith('csv-matching')) {
    paths.pop()
  }
  paths.push('tiles')
  const base = window.location.origin + paths.join('/')
  const attribution = "<a href=\"https://www.marineregions.org/\">marineregion.org</a> | <a href=\"https://github.com/kamataryo/eez-explorer\">©︎kamataryo</a>"
  const beforeLayer = 'poi-z16'

  map
  .on('load', () => {

    const style = map.getStyle()
    for (const layer of style.layers.filter(layer => layer.source === 'dem')) {
      console.log(layer)
      map.removeLayer(layer.id)
    }
    map.removeSource('dem')


    map.addSource('eez', {
      type: 'vector',
      tiles: [`${base}/{z}/{x}/{y}.mvt`],
      attribution,
      maxzoom: 14,
    })

    map.addSource('equator', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [[0, 0], [360, 0]]
            }
          }
        ]
      }
    })

    map.addLayer({
      id: 'eez-boundary',
      type: 'fill',
      source: 'eez',
      'source-layer': 'eez',
      paint: {
        'fill-color': 'darkblue',
        'fill-opacity': .3,
      },
      maxzoom: 22,
    }, beforeLayer)

    map.addLayer({
      id:'eq-line',
      type: 'line',
      source: 'equator',
      paint: {
        'line-color': 'crimson',
        'line-width': 3,
        'line-opacity': .5,
      }
    }, beforeLayer)

    resolve(map)
  })
})

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
