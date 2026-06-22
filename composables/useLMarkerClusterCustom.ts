// Adapted version of : {https://github.com/nuxt-modules/leaflet/blob/0ce672e60537210e733846dae6e40d9c75d0e5a3/src/runtime/composables/useLMarkerCluster.ts}
import type { MarkerOptions, Map, Marker } from 'leaflet'

interface MarkerProps {
  name?: string
  lat: number
  lng: number
  options?: MarkerOptions
  /**
   * Should be a string formatted as HTML
   */
  popup?: string
}

interface Props {
  leafletObject: Map
  markers: MarkerProps[]
  clusterOptions?: Object // Add cluster options type
}

export const useLMarkerClusterCustom = async (props: Props) => {
  // Get Leaflet from the window object
  const L = window.L

  // Lazy-load leaflet.markercluster
  const { MarkerClusterGroup } = await import('leaflet.markercluster')

  // Initialize marker cluster with custom options if provided
  const markerCluster = new MarkerClusterGroup(props.clusterOptions || {})

  // Create an array to store the markers
  const markers = [] as Marker[]

  // For each marker in props
  props.markers.forEach((location: MarkerProps) => {
    // Create a Leaflet marker
    const marker = L.marker([location.lat, location.lng], {
      title: location.name,
      ...location.options,
    })

    // If a popup is provided, bind it to the marker
    if (location.popup) {
      const popup = L.DomUtil.create('div', 'popup')
      popup.innerHTML = location.popup
      marker.bindPopup(popup)
    }

    // Add the marker to the cluster
    markerCluster.addLayer(marker)

    // Add the marker to the markers array
    markers.push(marker)
  })

  // Add the marker cluster to the map
  props.leafletObject.addLayer(markerCluster)

  // Return the markerCluster and markers
  return {
    markerCluster,
    markers,
  }
}
