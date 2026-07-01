<template>
    <loading-message v-if="loading" />
    <map-component
        v-else
        :filter-properties="filterProperties"
        :filters-general-info="filtersGeneralInfo"
        :original-markers="originalMarkers"
        :page-info="pageInfo"
        icon-behaviour="constant"
    >
    </map-component>
</template>

<script setup>
import { SPARQLQueryDispatcher } from '~/assets/js/SPARQLQueryDispatcher'
import APIDataHandler from '~/assets/js/APIDataHandler'
import json from '../big-query-output.json'
import MapComponent from '../components/MapComponent.vue'
import LoadingMessage from '../components/LoadingMessage.vue'
import Swal from 'sweetalert2'
import filterDescriptions from '../public/filterDescriptions.json'

definePageMeta({
    layout: 'default',
})

const pageInfo = ref({
    title: 'Primary and Secondary Characterisations',
    html: '<div>This map shows the geographical residence location for each accused witch in Scotland taken from the Survey of Scottish Witchcraft Database. Out of the <strong>3212</strong> accused witches whose names are known, the residence for <strong>3142</strong> witches has been located. The majority of the residences are accurately located down to the precise settlement, while others range from parish to county depending on the records surviving for each accused witch. There is a total of 821 different locations recorded in the database; all but 25 of these have been identified. The remaining unidentified place-names are currently recorded as \‘County of’\ on the map.</div>',
    footer: 'witches.is.ed.ac.uk',
    confirmButtonText: 'Close',
    type: 'info',
    showCloseButton: true,
})
const queryOutput = ref(json)
const sparqlUrl = ref('https://query.wikidata.org/sparql')
const wikiPages = ref([])
const loading = ref(true)
const originalMarkers = ref([])
const filtersToFind = ref([
    ['primary', 'constant'],
    ['secondary', 'constant'],
])
const filtersGeneralInfo = ref({
    title: 'Case characterisations',
    filtersShowing: true,
})
const filterProperties = ref({
    primary: {
        label: 'Primary',
        description: '',
        descriptionShowing: false,
        filters: {},
        showing: true,
    },
    secondary: {
        label: 'Secondary',
        description: '',
        descriptionShowing: false,
        filters: {},
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

const loadDataFromLocalStorage = () => {
    originalMarkers.value = JSON.parse(localStorage.getItem('residenceMarkers'))
    const allFilters = JSON.parse(localStorage.getItem('allFilters'))
    filterProperties.value.primary.filters = allFilters.primary
    filterProperties.value.secondary.filters = allFilters.secondary

    setMarkersIcons()
}

const setMarkersIcons = () => {
    for (let i = 0; i < originalMarkers.value.length; i++) {
        const marker = originalMarkers.value[i]
        marker.markerIcon = '/images/witch-single-orange.png'
    }
}

const loadData = async () => {
    loadWikiEntries()
    const icon = '/images/witch-single-orange.png'

    try {
        queryOutput.value = await myFetch('/main.php?type=primarysecondary')
    } catch {
        Swal.fire({
            title: 'Server Error',
            html: '<div>We are unable to connect to the server to pull in map info. Please refresh the page and try again. If this error persists, please contact <a href="mailto:ltw-apps-dev.ed.ac.uk">ltw-apps-dev.ed.ac.uk</a></div>',
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
        null,
        icon
    )
    let filtersFound = null

    ;[originalMarkers.value, filtersFound] = getData.loadAccussed(
        'residence',
        filtersToFind.value
    )

    filterProperties.value.primary.filters = filtersFound.primary
    filterProperties.value.secondary.filters = filtersFound.secondary

    setMarkersIcons()
    loading.value = false
}

const hasLocalStorageExpired = () => {
    const hours = 24 // Reset when storage is more than 24hours
    const now = new Date().getTime()
    const setupTime = localStorage.getItem('setupTime')

    return setupTime === null || now - setupTime > hours * 60 * 60 * 1000
}

onMounted(() => {
    // Load descriptions from the JSON file
    Object.keys(filterDescriptions).forEach((key) => {
        if (filterProperties.value[key]) {
            filterProperties.value[key].description = filterDescriptions[key]
        }
    })

    loadData()
})
</script>
