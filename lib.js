const normalizeLatLng = (latlngStr, firstItemIsId = false) => {
  let latlngFlagments = latlngStr.split(/[, \/|、;:\t　]+/g).filter(x => !!x)
  let id
  if(firstItemIsId) {
    latlngFlagments = latlngFlagments.slice(0, 3)
    id = latlngFlagments.shift()
  } else {
    latlngFlagments = latlngFlagments.slice(0, 2)
  }

  let lat
  let lng
  let useDirectionPrefix = false
  for (const flg of latlngFlagments) {
    const match = flg.toUpperCase()
      .replace(/[Ａ-Ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .match(/^([NSEW])([0-9]+(\.[0-9]+)?)/)
    if(match) {
      useDirectionPrefix = true
      const prefix = match[1]
      const number = parseFloat(match[2])
      if(prefix === 'N') {
        lat = number
      } else if (prefix === 'S') {
        lat = - number
      } else if (prefix === 'E') {
        lng = number
      } else if(prefix === 'W') {
        lng = - number
      }
    }
  }

  if(!useDirectionPrefix) {
    [lat, lng] = latlngFlagments.map(val => parseFloat(val))
  }

  if(lat < -90 || lat > 90) { throw new Errror('Invalid lat, lng') }
  while (lng < -180 || lng > 180) {
    if(lng < -180) {
      lng += 360
    } else {
      lng -= 360
    }
  }
  return [lat, lng, id]
}

const formatLatLng = (latlng) => {
  let { lat, lng } = latlng
  while (lng < -180 || lng > 180) {
    if(lng < -180) {
      lng += 360
    } else {
      lng -= 360
    }
  }
  lat = Math.round(1000 * lat) / 1000
  lng = Math.round(1000 * lng) / 1000

  lat = lat > 0 ? ('N' + lat) : ('S' + (-lat))
  lng = lng > 0 ? ('E' + lng) : ('W' + (-lng))

  return `${lat} ${lng}`
}

const query = ({ lat, lng }, map, { id } = {}) => {
  const point = map.project([lng, lat])
  const features = map.queryRenderedFeatures(point)
  const sovereigns = features
    .filter(({layer}) => layer.source === "eez")
    .map(feature => {
      const { SOVEREIGN1, SOVEREIGN2, SOVEREIGN3, TERRITORY1, TERRITORY2, TERRITORY3 } = feature.properties
      const label1 = SOVEREIGN1 === TERRITORY1 ? `${SOVEREIGN1} EEZ` : `${SOVEREIGN1} EEZ (${TERRITORY1})`
      const label2 = SOVEREIGN2 === TERRITORY2 ? `${SOVEREIGN2} EEZ` : `${SOVEREIGN2} EEZ (${TERRITORY2})`
      const label3 = SOVEREIGN3 === TERRITORY3 ? `${SOVEREIGN3} EEZ` : `${SOVEREIGN3} EEZ (${TERRITORY3})`
      return [label1, label2, label3].filter(label => label && !label.startsWith('undefined'))
    })
    .reduce((prev, arr) => {
      for (const item of arr) {
        if(prev.indexOf(item) === -1) {
          prev.push(item)
        }
      }
      return prev
    }, [])

  const hasOcOcean = features.find(feature => feature.layer.id === 'oc-ocean')
  const popupContent = `<dl class="popup">
        <dt>` + (id ? `<span class="id-display">[${id}]</span>` : '') + `${formatLatLng({ lat, lng })}</dt>
        <dd>
          ${sovereigns.length > 0 ? (`<ul>${sovereigns.map(name => `<li>${name}</li>`).join('')}</ul>`) :( hasOcOcean ? 'Public Sea' : 'Land')}
        </dd>
      </dl>`
  const markerColor = sovereigns.length > 0 ? 'darkblue' : hasOcOcean ? 'dodgerblue' : 'darkorange'

  const popup = new window.geolonia.Popup()
    .setLngLat([lng, lat])
    .setHTML(popupContent)

  const marker = new window.geolonia.Marker({ color: markerColor })
    .setLngLat([lng, lat])
    .setPopup(popup)
    .addTo(map)
    .togglePopup()

  return marker
}
