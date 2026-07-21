<template>
    <div class="flex flex-col h-full w-full">
        <!-- Map and filters. -->
        <div class="relative h-full w-full">
            <div class="absolute flex flex-col w-full h-full">
                <map-filters
                    :date-range="timelineOutputRange"
                    :icon-behaviour="iconBehaviour"
                    :include-timeline="includeTimeline"
                    :no-witches="Filtering.getNoWitches()"
                    :page-info="pageInfo"
                    :starting-filters="filterProperties"
                    :starting-filters-general-info="filtersGeneralInfo"
                    :timeline-on="timelineOn"
                    @change-current-property="changeCurrentProperty($event)"
                    @filter-off="setWitchesOff($event[0], $event[1])"
                    @filter-on="setWitchesOn($event[0], $event[1])"
                    @reset-dates="resetDates()"
                    @selected-date-range="setTimeline($event[0], $event[1])"
                    @turn-timeline-off="setTimelineOff()"
                    @updated-tile="url = $event"
                >
                </map-filters>
                <timeline
                    v-if="timelineOn"
                    :key="timelineKey"
                    :start-range="timelineRangeStart"
                    :timeline-dates="timelineDates"
                    :timeline-markers="timelineMarkers"
                    @timeline-toggled="updateTimelineStatus"
                    @updated-range-value="
                        filterOnSlider(formatDateForFiltering($event))
                    "
                >
                </timeline>
            </div>
            <leaflet-map-main
                :clusters-initial="clustersOn"
                :map-markers="Filtering.getOutputMarkers(markers)"
                :map-url="url"
            >
            </leaflet-map-main>
        </div>
    </div>
</template>

<script setup>
import LeafletMapMain from './leaflet-maps/LeafletMapMain.vue'
import Timeline from './filter-components/Timeline.vue'
import MapFilters from './filter-components/MapFilters.vue'
import FilteringMethods from '../assets/js/FilteringMethods'
import TimelineMethods from '../assets/js/TimelineMethods'

const props = defineProps({
    pageInfo: {
        type: Object,
        required: true,
    },
    originalMarkers: {
        type: Array,
        required: true,
    },
    filtersGeneralInfo: {
        type: Object,
        required: true,
    },
    filterProperties: {
        type: Object,
        required: true,
    },
    iconBehaviour: {
        type: String,
        required: true,
    },
    clustersOnInitial: {
        type: Boolean,
        default: true,
    },
    includeTimeline: {
        type: Boolean,
        default: true,
    },
})

const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
const markers = ref(JSON.parse(JSON.stringify(props.originalMarkers)))
const Filtering = ref(new FilteringMethods(props.filterProperties, 'sex'))
const fullRange = ref([
    new Date('1562-02-21T00:00:00.000Z'),
    new Date('1727-06-12T00:00:00.000Z'),
])
const timelineOn = ref(false)
const timelineOutputRange = ref(null)
const timelineRangeStart = ref(null)
const timelineDates = ref(null)
const timelineMarkers = ref(null)
const timelineKey = ref(0)
const clustersOn = ref(props.clustersOnInitial)

const updateTimelineStatus = (status) => {
    timelineOn.value = status
}

const formatDateForFiltering = (dateRange) => {
    return [
        TimelineMethods.addDays(new Date(dateRange[0]), 1),
        TimelineMethods.addDays(new Date(dateRange[1]), 1),
    ]
}

const getMarkerState = (marker) => {
    if (props.iconBehaviour !== 'constant') {
        ;[marker.markerIcon, marker.active] =
            Filtering.value.getMarkerStateIconDependant(marker)
    } else {
        marker.active = Filtering.value.getMarkerStateNonIconDependant(
            marker.witches
        )
    }
}

const setWitchesOff = (filterProperty, filterType) => {
    // Filters <filterProperty>.<filterType> off. It goes through the current markers
    // setting witches that meet filter type to off and adds the
    // filter property to the witch's active filters.
    // It then updates the marker state by calling getMarkerState.

    for (let i = 0; i < markers.value.length; i++) {
        const marker = markers.value[i]

        for (let w = 0; w < marker.witches.length; w++) {
            const witch = marker.witches[w]

            // Calling checksMeetsCondition, which will check
            // if what we are filtering by is an array, in which
            // case checks with .includes() or a string and then checks
            // with ===
            if (
                Filtering.value.checkMeetsCondition(
                    witch[filterProperty],
                    filterType
                )
            ) {
                witch.witchState.on = false
                witch.witchState.activeFilters.push(filterProperty)
            }
        }

        getMarkerState(marker)
    }
}

const setWitchesOn = (filterProperty, filterType) => {
    // Filters <filterType> on. It goes through the current markers
    // setting witches that meet filter type to on and updating the witches
    // active filters. It updates the marker state by calling getMarkerState.

    for (let i = 0; i < markers.value.length; i++) {
        const marker = markers.value[i]

        for (let w = 0; w < marker.witches.length; w++) {
            const witch = marker.witches[w]

            if (
                Filtering.value.checkMeetsCondition(
                    witch[filterProperty],
                    filterType
                )
            ) {
                ;[witch.witchState.activeFilters, witch.witchState.on] =
                    Filtering.value.checkWitchOn(
                        witch.witchState.activeFilters,
                        filterProperty
                    )
            }
        }

        getMarkerState(marker)
    }
}

const filterByDateRange = (dateRange) => {
    // Filters off the witches whose date doesn't
    // fall whithin <dateRange>
    for (let i = 0; i < markers.value.length; i++) {
        const marker = markers.value[i]

        for (let w = 0; w < marker.witches.length; w++) {
            const witch = marker.witches[w]
            const date = new Date(witch.investigationDates[0])

            if (!TimelineMethods.checkDateInRange(date, dateRange)) {
                witch.witchState.on = false

                if (!witch.witchState.activeFilters.includes('timeline')) {
                    witch.witchState.activeFilters.push('timeline')
                }
            } else {
                ;[witch.witchState.activeFilters, witch.witchState.on] =
                    Filtering.value.checkWitchOn(
                        witch.witchState.activeFilters,
                        'timeline'
                    )
            }
        }

        getMarkerState(marker)
    }
}

const filterOnSlider = (dateRange) => {
    // Function called on slider filtering event. Date
    // range is an array with the date objects retrieved
    // from slider. <timelineOutputRange> is used to filter and
    // passed down to MapFilters to display the dates by
    // which the user is filtering.
    timelineOutputRange.value = dateRange

    filterByDateRange(dateRange)
}

const resetTimelineWithNewRange = (dateRange) => {
    // Creates the dates and markers for a new dateRange
    // and re-renders the timeline to apply them.
    ;[timelineDates.value, timelineMarkers.value] =
        TimelineMethods.getTimelineData(dateRange)

    // Remounting the timeline if it was already on.
    timelineKey.value++
}

const setTimeline = (dateRange, startRange) => {
    // Sets the timeline on the event of a range having
    // been selected by range selector. We re-render the
    // timeline every time - not very costly.
    timelineOutputRange.value = startRange
    timelineRangeStart.value = startRange

    filterByDateRange(startRange)

    if (clustersOn.value) {
        clustersOn.value = !clustersOn.value
    }

    // setting the dates and markers for the timeline.
    resetTimelineWithNewRange(dateRange)

    // Turning on if it wasn't on.
    if (!timelineOn.value) {
        timelineOn.value = true
    }
}

const resetDatesFully = () => {
    // Turns on every witch that has <timeline> in its
    // active filters.
    for (let i = 0; i < markers.value.length; i++) {
        const marker = markers.value[i]

        for (let w = 0; w < marker.witches.length; w++) {
            const witch = marker.witches[w]

            if (witch.witchState.activeFilters.includes('timeline')) {
                ;[witch.witchState.activeFilters, witch.witchState.on] =
                    Filtering.value.checkWitchOn(
                        witch.witchState.activeFilters,
                        'timeline'
                    )
            }
        }

        getMarkerState(marker)
    }
}

const setTimelineOff = () => {
    timelineOn.value = false

    if (!clustersOn.value) {
        clustersOn.value = !clustersOn.value
    }

    resetDatesFully()
}

const resetDates = () => {
    timelineOutputRange.value = fullRange.value
    timelineRangeStart.value = fullRange.value

    filterByDateRange(fullRange.value)
    resetTimelineWithNewRange(fullRange.value)
}

const setAllIcons = () => {
    // Goes through all markers changing the icons according
    // to the current filter property. Called in togglefilterProperties
    // when user changes filter properties so that icons update
    // accordingly.

    for (let i = 0; i < markers.value.length; i++) {
        const marker = markers.value[i]
        ;[marker.markerIcon, marker.active] =
            Filtering.value.getMarkerStateIconDependant(marker)
    }
}

const changeCurrentProperty = (property) => {
    Filtering.value.updateCurrentProperty(property)

    setAllIcons()
}

onMounted(() => {
    let noWitches = 0

    markers.value.map((marker) => {
        noWitches += marker.witches.length
    })

    Filtering.value.setNoWitches(noWitches)
})
</script>
