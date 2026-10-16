<template>
    <loading-message v-if="loading" />
    <map-component
        v-else
        :filter-properties="filterProperties"
        :filters-general-info="filtersGeneralInfo"
        :original-markers="originalMarkers"
        :page-info="pageInfo"
        icon-behaviour="changing"
    >
    </map-component>
</template>

<script setup>
import { useIcons } from '@/composables/useIcons'
import { SPARQLQueryDispatcher } from '~/assets/js/SPARQLQueryDispatcher'
import APIDataHandler from '~/assets/js/APIDataHandler'
import FilteringMethods from '~/assets/js/FilteringMethods'
import MapComponent from '../components/MapComponent.vue'
import LoadingMessage from '../components/LoadingMessage.vue'
import Swal from 'sweetalert2'
import filterDescriptions from '../public/filterDescriptions.json'

definePageMeta({
    layout: 'default',
})

const pageInfo = ref({
    title: 'Witchcraft Prosecutions In Time and Place',
    html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">3142</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',
    footer: 'witches.is.ed.ac.uk',
    confirmButtonText: 'Close',
    type: 'info',
    showCloseButton: true,
})
const queryOutput = ref(null)
const sparqlUrl = ref('https://query.wikidata.org/sparql')
const wikiPages = ref([])
const loading = ref(true)
const originalMarkers = ref([])
const filtersToFind = ref([
    ['socialClass', 'changing'],
    ['occupation', 'changing'],
])
const filtersGeneralInfo = ref({
    title: 'Accused witch filters',
    filtersShowing: true,
})
const filterProperties = ref({
    sex: {
        label: 'Gender',
        description: '',
        descriptionShowing: false,
        filters: {
            male: {
                label: 'Male',
                active: true,
                iconUrl: '/images/witch-single-blue.png',
            },
            female: {
                label: 'Female',
                active: true,
                iconUrl: '/images/witch-single-orange.png',
            },
            unknown: {
                label: 'Unknown',
                active: true,
                iconUrl: '/images/witch-single-BW.png',
            },
        },
        showing: true,
    },
    socialClass: {
        label: 'Social Classification',
        description: '',
        descriptionShowing: false,
        filters: {},
        showing: false,
    },
    occupation: {
        label: 'Occupations',
        description: '',
        descriptionShowing: false,
        filters: {},
        showing: false,
    },
    hasWikiPage: {
        label: 'Wikipedia Page',
        description: '',
        descriptionShowing: false,
        filters: {
            hasWiki: {
                label: 'Has wiki',
                active: true,
                iconUrl: '/images/witch-single-blue.png',
            },
            noWiki: {
                label: 'No wiki',
                active: true,
                iconUrl: '/images/witch-single-orange.png',
            },
        },
        showing: false,
    },
})

const loadWikiEntries = () => {
    const sparqlQuery = `SELECT DISTINCT ?item ?LabelEN ?page_title
            WHERE {
              ?item wdt:P4478 ?witch .
              ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> ;  schema:name ?page_title .
              ?item rdfs:label ?LabelEN filter (lang(?LabelEN) = "en") .
            }`

    const queryDispatcher = new SPARQLQueryDispatcher(sparqlUrl.value)
    queryDispatcher.query(sparqlQuery).then((result) => {
        for (let i = 0; i < result.results.bindings.length; i++) {
            const item = result.results.bindings[i]

            const wikiPage = {
                id: item.item.value,
                pageTitle: item.page_title.value,
            }

            wikiPages.value.push(wikiPage)
        }
    })
}

const setMarkersIcons = () => {
    const Filtering = new FilteringMethods(filterProperties.value, 'sex')

    for (let i = 0; i < originalMarkers.value.length; i++) {
        const marker = originalMarkers.value[i]
        ;[marker.markerIcon, marker.active] =
            Filtering.getMarkerStateIconDependant(marker)
    }
}

const loadData = async () => {
    loadWikiEntries()

    const config = useRuntimeConfig()
    try {
        queryOutput.value = await $fetch('/main.php?type=accused', {
            baseURL: config.public.baseURL,
        })
    } catch {
        await Swal.fire({
            title: 'Server Error',
            html: `<div>We are unable to connect to the server to pull in map info. Please refresh the page and try again. If this error persists, please contact <a href="mailto:${config.public.supportEmail}">${config.public.supportEmail}</a></div>`,
            footer: 'witches.is.ed.ac.uk',
            confirmButtonText: 'Close',
            type: 'error',
            showCloseButton: true,
        })

        return
    }

    const getData = new APIDataHandler(
        queryOutput.value,
        wikiPages.value,
        icons,
        null
    )
    let filtersFound = null

    ;[originalMarkers.value, filtersFound] = getData.loadAccussed(
        'residence',
        filtersToFind.value
    )

    filterProperties.value.socialClass.filters = filtersFound.socialClass
    filterProperties.value.occupation.filters = filtersFound.occupation

    setMarkersIcons()
    loading.value = false
}

const numberOfWitches = computed(() => {
    let noWitches = 0

    for (let i = 0; i < originalMarkers.value.length; i++) {
        noWitches += originalMarkers.value[i].witches.length
    }

    return noWitches
})

const icons = computed(() => {
    const { icons } = useIcons()

    return icons.value
})

onMounted(() => {
    // Load descriptions from the JSON file
    Object.keys(filterDescriptions).forEach((key) => {
        if (filterProperties.value[key]) {
            filterProperties.value[key].description = filterDescriptions[key]
        }
    })

    loadData()
})

watch(
    originalMarkers,
    () => {
        pageInfo.value.html = `<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <b class="font-bold">3212</b> accused witches whose names are known, the residence for <b class="font-bold">${numberOfWitches.value}</b> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>`
    },
    { immediate: true } // Computes numberOfWitches immediately when originalMarkers gets filled
)
</script>

<style></style>
