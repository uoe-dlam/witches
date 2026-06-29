<template>
    <LMap
        ref="myMap"
        :center="center"
        :options="{ zoomControl: false }"
        :use-global-leaflet="true"
        :zoom="zoom"
        class="w-full h-full z-0 absolute"
        @ready="onMapReady"
    >
        <LControlZoom position="bottomright"></LControlZoom>
        <LTileLayer :attribution="attribution" :url="baseMapUrl"></LTileLayer>

        <!--historic layer-->
        <div v-if="mapUrl.startsWith('https://mapseries')">
            <LTileLayer :attribution="attribution" :url="mapUrl"></LTileLayer>
        </div>
    </LMap>
</template>

<script setup>
const props = defineProps({
    mapMarkers: {
        type: Array,
        required: true,
    },
    mapUrl: {
        type: String,
        required: true,
    },
    center: {
        type: Array,
        required: true,
    },
    zoom: {
        type: Number,
        required: true,
    },
})

const myMap = ref(null)
const baseMapUrl = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
const attribution = ref(
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, James Dorret 1750 from the <a href="https://maps.nls.uk/geo/explore/#zoom=6.6&lat=57.29330&lon=-5.04553&layers=125140579&b=1">NLS Maps API</a>'
)
const markers = ref([])
const clusterOptions = ref({
    iconCreateFunction: function (cluster) {
        const iconHtml =
            '<img class="cluster-img" src="/images/witches-cluster-composite-yellow.png">'
        return L.divIcon({
            html: iconHtml,
            className: 'mycluster',
            iconSize: null,
        })
    },
    disableClusteringAtZoom: 12,
    spiderfyOnMaxZoom: false,
})
const locationOptions = ref(['residence', 'detention', 'placeOfDeath'])
const locationsLabels = ref({
    residence: 'Residence',
    detention: 'Detention',
    placeOfDeath: 'Place of Death',
})
const standardAttributes = ref(['sex', 'occupation', 'socialClass'])
const standardAttributeLabels = ref({
    sex: 'Gender',
    occupation: 'Occupation',
    socialClass: 'Social Class',
})
const optionalAttributes = ref([
    'demonicPact',
    'propertyDamage',
    'meetingsInfo',
    'meetingsPlaces',
    'shapeshifting',
    'ritualObjects',
    'primary',
    'secondary',
])
const optionalsLabels = ref({
    demonicPact: 'Alleged Pacts with the devil',
    propertyDamage: 'Alleged Property Damage',
    meetingsPlaces: 'Alleged meetings places',
    meetingsInfo: 'Alleged nature of meetings',
    shapeshifting: 'Alleged shapeshifting',
    ritualObjects: 'Alleged ritual objects',
    primary: 'Primary Characteristics',
    secondary: 'Secondary Characteristics',
})

const fillMarkersArray = (mapMarkers) => {
    markers.value = mapMarkers.map((markerData) => {
        const lat = markerData.longLat[0]
        const lng = markerData.longLat[1]

        // Building the popup content as an HTML string
        const popupContent = `
          <h4 style="font-family: Roboto">${markerData.location}</h4><br>
          <div class="${markerData.witches.length > 1 ? 'witch-scroller' : 'no-witch-scroller'}">
            ${markerData.witches
                .map(
                    (witch) => `
              <div class="font-semibold text-base">${witch.name}</div><br>
              <div><b>Investigation Date:</b> ${witch.investigationDates[1]}</div>
              ${getStandardAttributesWithValue(witch)
                  .map(
                      (attr) => `
                <b>${standardAttributeLabels.value[attr]}:</b> ${witch[attr]}<br>
              `
                  )
                  .join('')}
              ${getLocationsWithValue(witch)
                  .map(
                      (locationOption) => `
                <b>${locationsLabels.value[locationOption]}:</b>
                ${witch[locationOption].locations
                    .map(
                        (subLocation) => `
                  ${subLocation}
                `
                    )
                    .join(', ')}<br>
              `
                  )
                  .join('')}
              ${getOptionalsWithValue(witch)
                  .map(
                      (optionalAttribute) => `
                <b>${optionalsLabels.value[optionalAttribute]}:</b>
                ${witch[optionalAttribute].join(', ')}<br>
              `
                  )
                  .join('')}
              ${witch.mannerOfDeath ? `<b>Manner of Death:</b> ${witch.mannerOfDeath}<br>` : ''}
              ${witch.wikiPage ? `<a href="${witch.wikiPage}" target="_blank">View Wiki Page</a><br>` : ''}
              <a href="${witch.link}" target="_blank">More Info</a><br><br>
            `
                )
                .join('')}
          </div>`

        // Return the formatted marker object
        return {
            lat: lat,
            lng: lng,
            options: {
                icon: L.icon({
                    iconUrl: markerData.markerIcon,
                    iconSize: [25, 38],
                    iconAnchor: iconAnchor.value,
                    shadowUrl: shadowUrl.value,
                    shadowSize: [25.6, 17.6],
                    shadowAnchor: shadowAnchor.value,
                }),
            },
            popup: popupContent,
        }
    })
}

const hasWikiEntry = (marker) => {
    const witchesWithEntry = marker.witches.filter(
        (witch) => witch.wikiPage !== ''
    )

    return witchesWithEntry.length > 0
}

const flyTo = (coordinates) => {
    myMap.value.leafletObject.flyTo(coordinates, 14)
}

const emit = defineEmits(['changeMaps'])

const emitMapData = () => {
    // Emmits an object containing the information about
    // where the center of the map is, the zoom, and what
    // map type to change to when the map is turned off,
    // in this case changing to clustersOff.
    const centerInfo = myMap.value.leafletObject.getCenter()
    const centerArray = [centerInfo.lat, centerInfo.lng]
    const changeInfo = {
        center: centerArray,
        zoom: myMap.value.leafletObject.getZoom(),
        changeTo: 'clustersOff',
    }

    emit('changeMaps', changeInfo)
}

const getLocationsWithValue = (witch) => {
    const locationsWithValue = []

    locationOptions.value.map((option) => {
        if (witch[option].locations.length !== 0) {
            locationsWithValue.push(option)
        }
    })

    return locationsWithValue
}

const getStandardAttributesWithValue = (witch) => {
    const standardAttributesWithValue = []

    standardAttributes.value.map((option) => {
        if (witch[option] !== 'unknown') {
            standardAttributesWithValue.push(option)
        }
    })

    return standardAttributesWithValue
}

const getOptionalsWithValue = (witch) => {
    const optionalsWithValue = []

    optionalAttributes.value.map((option) => {
        if (witch.hasOwnProperty(option) && witch[option][0] !== 'unknown') {
            optionalsWithValue.push(option)
        }
    })

    return optionalsWithValue
}

const refreshMapMarkers = () => {
    // clear existing markers
    myMap.value.leafletObject.eachLayer((layer) => {
        if (layer instanceof L.MarkerClusterGroup) {
            myMap.value.leafletObject.removeLayer(layer)
        }
    })

    //re add clusters to map
    useLMarkerClusterCustom({
        leafletObject: myMap.value.leafletObject,
        markers: markers.value,
        clusterOptions: clusterOptions.value,
    })
}

const onMapReady = () => {
    fillMarkersArray(props.mapMarkers)
    useLMarkerClusterCustom({
        leafletObject: myMap.value.leafletObject,
        markers: markers.value,
        clusterOptions: clusterOptions.value,
    })
}

const iconAnchor = computed(() => {
    return [11, 41]
})

const shadowAnchor = computed(() => {
    return [11, 26]
})
const shadowUrl = computed(() => {
    return '/images/North-Berwick-witch-shadow.png'
})

onBeforeUnmount(() => {
    emitMapData()
})

watch(
    () => props.mapMarkers,
    () => {
        fillMarkersArray(props.mapMarkers)
        refreshMapMarkers()
    }
)
</script>

<style>
.cluster-img {
    float: left;
    width: 72px;
    height: 55px;
}
</style>
