<template>
    <div id="outer">
        <div id="inner">
            <div id="page-intro" class="pl-5 pr-5 pt-3 pb-3">
                <br />
                <div class="flex content-start items-center">
                    <h2>
                        Locations of Trials for Accused Witches
                        <div
                            class="inline-flex items-center justify-center align-middle w-6 h-6 hover:w-7 hover:h-7 mb-0.5 ml-1 cursor-pointer"
                        >
                            <img
                                aria-label="Page Information Popup"
                                class="w-full h-full pt-0.5"
                                src="/images/infoIcon.svg"
                                @click="showPageInfo()"
                            />
                            <span class="visually-hidden"
                                >Page Information Pop Up</span
                            >
                        </div>
                    </h2>
                </div>
                <div>
                    <br />
                    <span v-for="(tile, index) in tiles" :key="index">
                        <input
                            :checked="tile.name === currentTileName"
                            name="tile"
                            type="radio"
                            @change="filterTiles(tile)"
                        />&nbsp;{{ tile.name }}&nbsp;
                    </span>
                </div>
                <br />
                <h2>Year: {{ sliderYear[0] }} - {{ sliderYear[1] }}</h2>
                <div class="p-2">
                    <Slider
                        v-model="numberRangeValue"
                        :format="getYearLabel"
                        :lazy="false"
                        :max="8"
                        :merge="1"
                        :min="0"
                        name="slider"
                        show-tooltip="drag"
                        @change="filterDates()"
                    />
                </div>
                <!-- Display slider years below the slider -->
                <div class="slider-years">
                    <span
                        v-for="(year, index) in sliderYears"
                        :key="index"
                        class="slider-year"
                        >{{ year }}</span
                    >
                </div>
                <br /><br />
            </div>
            <div id="map-wrapper">
                <client-only>
                    <LMap
                        :center="center"
                        :zoom="zoom"
                        style="height: 100%; width: 100%"
                    >
                        <LTileLayer
                            :attribution="attribution"
                            :url="url"
                        ></LTileLayer>

                        <LMarker
                            v-for="(marker, index) in activeMarkers"
                            :key="index"
                            :lat-lng="marker.longLat"
                        >
                            <LPopup class="adapted-popup">
                                <h2>{{ marker.location }}</h2>
                                <br />
                                <div
                                    :class="
                                        marker.trials.length > 1
                                            ? 'witch-scroller'
                                            : 'no-witch-scroller'
                                    "
                                >
                                    <div
                                        v-for="(
                                            trial, trialIndex
                                        ) in marker.trials"
                                        :key="trialIndex"
                                    >
                                        <strong>{{ trial.witchName }}</strong
                                        ><br />
                                        Trial Date: {{ trial.date }}<br />
                                        Trial Year: {{ trial.year }}<br />
                                        <a :href="trial.link" target="_blank"
                                            >More Info</a
                                        ><br /><br />
                                    </div>
                                </div>
                            </LPopup>
                            <LIcon
                                :icon-anchor="iconAnchor"
                                :icon-size="[25, 38]"
                                :icon-url="getIcon(marker)"
                                :shadow-anchor="shadowAnchor"
                                :shadow-size="[32, 22]"
                                :shadow-url="shadowUrl"
                            >
                            </LIcon>
                        </LMarker>
                    </LMap>
                </client-only>
            </div>
        </div>
    </div>
</template>

<script setup>
import { SPARQLQueryDispatcher } from '~/assets/js/SPARQLQueryDispatcher'
import Swal from 'sweetalert2'
import Slider from '@vueform/slider'

definePageMeta({
    layout: 'default',
})

const sparqlUrl = ref('https://query.wikidata.org/sparql')
const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
const attribution = ref(
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Historical Maps Layer, 1919-1947 from the <a href="https://maps.nls.uk/projects/api/">NLS Maps API</a>'
)
const zoom = ref(7)
const center = ref([55.95, -3.198888888])
const markers = ref([])
const originalMarkers = ref([])
const currentTileName = ref('Modern Map')
const tiles = ref([
    {
        name: 'Modern Map',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        active: true,
    },
    {
        name: 'Historic Map',
        url: 'https://nls.tileserver.com/nls/{z}/{x}/{y}.jpg',
        active: false,
    },
])
const sliderYear = ref([1550, 1750])
const sliderYears = ref([1550, 1575, 1600, 1625, 1650, 1675, 1700, 1725, 1750])
const noItems = ref('')
const numberRangeValue = ref([0, 8])

const convertPointToLongLatArray = (pointString) => {
    pointString = pointString.substr(6)
    pointString = pointString.slice(0, -1)
    const pointArray = pointString.split(' ')

    return [pointArray[1], pointArray[0]]
}

const getYearLabel = (value) => {
    return sliderYears.value[value]
}

const loadTrials = () => {
    const sparqlQuery = `SELECT ?item ?residenceLabel ?coords ?personLabel ?date ?link
            WHERE
            {
              ?item wdt:P4532 ?witch .
              ?item wdt:P276 ?residence .
              ?residence wdt:P625 ?coords .
              ?item wdt:P1591 ?person .
              ?item wdt:P585 ?date .
              ?item wdt:P4532 ?link .
              SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }`

    const queryDispatcher = new SPARQLQueryDispatcher(sparqlUrl.value)
    queryDispatcher.query(sparqlQuery).then((result) => {
        noItems.value = result.results.bindings.length

        for (let i = 0; i < result.results.bindings.length; i++) {
            const item = result.results.bindings[i]

            let trialDate = item.date.value
            trialDate = trialDate.substr(0, 10)

            let trialYear = item.date.value
            trialYear = trialDate.substr(0, 4)
            const trialMonth = trialDate.substr(5, 2)
            const trialDay = trialDate.substr(8, 2)

            trialDate = trialDay + '/' + trialMonth + '/' + trialYear

            const trial = {
                id: item.item.value,
                location: item.residenceLabel.value,
                witchName: item.personLabel.value,
                link:
                    'https://witches.shca.ed.ac.uk/index.cfm?fuseaction=home.trialrecord&search_string&trialref=' +
                    item.link.value,
                longLat: convertPointToLongLatArray(item.coords.value),
                date: trialDate,
                year: trialYear,
            }

            const marker = markers.value.find((marker) => {
                return marker.location === trial.location
            })

            if (marker) {
                marker.trials.push(trial)
            } else {
                const marker = {
                    location: item.residenceLabel.value,
                    longLat: convertPointToLongLatArray(item.coords.value),
                    trials: [trial],
                }

                markers.value.push(marker)
            }
        }

        originalMarkers.value = JSON.parse(JSON.stringify(markers.value))

        filterDates()
    })
}

const getIcon = () => {
    return '/images/North-Berwick-witch.png'
}

const filterTiles = (tile) => {
    currentTileName.value = tile.name
    url.value = tile.url
}

const filterDates = () => {
    const markers = JSON.parse(JSON.stringify(originalMarkers.value))

    markers.forEach((marker) => {
        marker.trials = marker.trials.filter(
            (trial) =>
                trial.year >= sliderYears.value[numberRangeValue.value[0]] &&
                trial.year <= sliderYears.value[numberRangeValue.value[1]]
        )
    })

    markers.value = markers
}

const showPageInfo = () => {
    Swal.fire({
        title: 'Trial Location Map',
        html: '<div>This map indicates the location of trial for the accused witches. There is an option to change the year, to show how the numbers of trials changed with time. A few people had <strong>multiple trials</strong>, which could have been held in <strong>different locations</strong>. There are <b class="font-bold">3211</b> recorded trials which have been related to witchcraft within the database. However, there are geographical locations noted for only <strong>432</strong> trials, meaning that many trial locations were not recorded in the surviving documents.</div>',
        footer: 'witches.is.ed.ac.uk',
        confirmButtonText: 'Close',
        type: 'info',
        showCloseButton: true,
    })
}

const activeMarkers = computed(() => {
    return markers.value.filter(function (marker) {
        return marker.trials.length > 0
    })
})

const iconAnchor = computed(() => {
    return [11, 41]
})

const shadowUrl = computed(() => {
    return '/images/North-Berwick-witch-shadow.png'
})

const shadowAnchor = computed(() => {
    return [11, 26]
})

onMounted(() => {
    loadTrials()
})
</script>

<style>
.slider-years {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
}

.slider-year {
    font-size: 14px;
    color: #606f7b;
}
</style>
