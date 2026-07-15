<template>
    <LMap
        ref="myMap"
        :center="center"
        :zoom="zoom"
        class="w-full h-full z-0 absolute"
    >
        <LControlZoom position="bottomright"></LControlZoom>
        <LTileLayer :attribution="attribution" :url="baseMapUrl"></LTileLayer>

        <!--historic layer-->
        <div v-if="mapUrl.startsWith('https://mapseries')">
            <LTileLayer :attribution="attribution" :url="mapUrl"></LTileLayer>
        </div>

        <LMarker
            v-for="(marker, index) in mapMarkers"
            :key="index"
            :lat-lng="marker.longLat"
        >
            <LPopup class="adapted-popup">
                <h4 style="font-family: Roboto">{{ marker.location }}</h4>
                <br />
                <div
                    :class="
                        marker.witches.length > 1
                            ? 'witch-scroller'
                            : 'no-witch-scroller'
                    "
                >
                    <div v-for="(witch, index) in marker.witches" :key="index">
                        <div class="font-semibold text-base">
                            {{ witch.name }}
                        </div>
                        <br />
                        <div>
                            <strong>Investigation Date:</strong>
                            {{ witch.investigationDates[1] }}<br />
                        </div>

                        <div
                            v-for="standardAttribute in getStandardAttributesWithValue(
                                witch
                            )"
                            :key="standardAttribute"
                        >
                            <strong
                                >{{
                                    standardAttributeLabels[standardAttribute]
                                }}:</strong
                            >
                            {{ witch[standardAttribute] }}<br />
                        </div>

                        <div
                            v-for="locationOption in getLocationsWithValue(
                                witch
                            )"
                            :key="locationOption"
                        >
                            <strong
                                >{{ locationsLabels[locationOption] }}:</strong
                            >
                            <template
                                v-for="(subLocation, index) in witch[
                                    locationOption
                                ].locations"
                                :key="index"
                            >
                                <a
                                    :style="{ cursor: 'pointer' }"
                                    @click="
                                        flyTo(
                                            witch[locationOption].coordinates[
                                                index
                                            ]
                                        )
                                    "
                                    >{{ subLocation }}</a
                                >
                                <template
                                    v-if="
                                        index <
                                        witch[locationOption].locations.length -
                                            1
                                    "
                                    >,
                                </template>
                            </template>
                            <br />
                        </div>

                        <div
                            v-for="optionalAttribute in getOptionalsWithValue(
                                witch
                            )"
                            :key="optionalAttribute"
                        >
                            <strong
                                >{{
                                    optionalsLabels[optionalAttribute]
                                }}:</strong
                            >
                            <template
                                v-for="(subAtribute, index) in witch[
                                    optionalAttribute
                                ]"
                                :key="index"
                            >
                                {{ subAtribute.toLowerCase()
                                }}<template
                                    v-if="
                                        index <
                                        witch[optionalAttribute].length - 1
                                    "
                                    >,</template
                                >
                            </template>
                            <br />
                        </div>

                        <div v-if="witch.mannerOfDeath !== ''">
                            <strong>Manner of Death:</strong>
                            {{ witch.mannerOfDeath }}<br />
                        </div>
                        <div v-if="witch.wikiPage !== ''">
                            <a :href="witch.wikiPage" target="_blank">
                                View Wiki Page </a
                            ><br />
                        </div>
                        <a :href="witch.link" target="_blank">More Info</a
                        ><br /><br />
                    </div>
                </div>
            </LPopup>

            <LIcon :icon-anchor="iconAnchor" class-name="">
                <div class="icon-wrapper">
                    <div v-if="marker.witches.length > 1" class="icon-text">
                        {{ marker.witches.length }}
                    </div>
                    <img :src="marker.markerIcon" class="zoomed-in-img" />
                    <img :src="shadowUrl" class="icon-shadow" />
                </div>
            </LIcon>
        </LMarker>
    </LMap>
</template>

<script setup>
defineProps({
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

const flyTo = (coords) => {
    myMap.value.leafletObject.flyTo(coords, 14)
}

const emit = defineEmits(['changeMaps'])
const emitMapData = () => {
    // Emits an object containing the information about
    // where the center of the map is, the zoom, and what
    // map type to change to when the map is turned off,
    // in this case changing to clustersOn.

    const centerInfo = myMap.value.leafletObject.getCenter()
    const centerArray = [centerInfo.lat, centerInfo.lng]
    const changeInfo = {
        center: centerArray,
        zoom: myMap.value.leafletObject.getZoom(),
        changeTo: 'clustersOn',
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

const iconAnchor = computed(() => {
    return [11, 41]
})
const shadowUrl = computed(() => {
    return '/images/North-Berwick-witch-shadow.png'
})

onBeforeUnmount(() => {
    emitMapData()
})
</script>

<style>
.cluster-img {
    float: left;
    width: 72px;
    height: 55px;
}

.zoomed-in-img {
    float: left;
    width: 25px;
    height: 38px;
}

.icon-wrapper img {
    background: none !important;
    border: none !important;
}

.icon-shadow {
    position: absolute;
    top: 15px !important;
    left: 0;
    z-index: -1;
    width: 25.6px;
    height: 17.6px !important;
    background: none !important;
}
</style>
