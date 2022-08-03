const mapLoadPromise = new Promise((resolve) => {

  const map = new window.geolonia.Map('#map')

  const paths = window.location.pathname.split('/')
  if(paths[paths.length - 1].startsWith('csv-matching')) {
    paths.pop()
  }
  paths.push('tiles')
  const base = window.location.origin + paths.join('/')
  const attribution = "<a href=\"https://github.com/kamataryo/eez-explorer/\">About me</a> | <a href=\"https://www.marineregions.org/\">marineregions.org</a>"
  const beforeLayer = 'poi-z16'

  window.eez_explorer_points_feature_collection = {
    type: 'FeatureCollection',
    features: [],
  }

  map
  .on('load', () => {

    map.addSource('__eez-explore-point-source', {
      type: 'geojson',
      data: window.eez_explorer_points_feature_collection,
      cluster: true,
      clusterRadius: 80,
    })

    map.addLayer({
      id: '__eez-expolre-point-id-layer',
      type: 'symbol',
      source: '__eez-explore-point-source',
      layout: {
        "text-font": ["Noto Sans Regular"],
        "text-size": 12,
        "text-field": [
          'format',
          ['coalesce', ['get', 'id'], ['get', 'latlng']],
          {
            'font-scale': 1.2,
            "text-color": "crimson",
          },
          '\n',
          {},
          ['get', 'description'],
          {
            'font-scale': .8,
            "text-color": "darkslategray",
          },
        ],
        "text-letter-spacing": 0.1,
        'text-variable-anchor': ['top', 'bottom'],
        'text-offset': [0, .75],
        "icon-image": 'marker',
        'icon-size': 1.5,
      },
      paint: {
        "text-halo-width": 1.8,
        "text-halo-color": "rgba(255,250,220,0.7)",
      }
    })

    const style = map.getStyle()
    for (const layer of style.layers.filter(layer => layer.source === 'dem')) {
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
