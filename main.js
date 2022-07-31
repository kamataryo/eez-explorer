const mapLoadPromise = new Promise((resolve) => {

  const map = new window.geolonia.Map('#map')
  const base = window.location.origin + window.location.pathname + 'tiles'
  const attribution = "<a href=\"https://www.marineregions.org/\">marineregion.org</a> | <a href=\"https://github.com/kamataryo/eez-explorer\">The sorce code</a>"
  const beforeLayer = 'poi-z16' // TODO: oceanusのラベル...

  map
  .on('load', () => {
    map.addSource('eez', {
      type: 'vector',
      tiles: [`${base}/{z}/{x}/{y}.mvt`],
      attribution,
      maxzoom: 14,
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

    resolve(map)
  })
})
