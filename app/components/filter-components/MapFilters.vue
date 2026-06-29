<template>
    <div
        :style="[
            timelineOn ? { height: '89%' } : { height: '100%' },
            filtersBox ? {} : { 'pointer-events': 'none' },
        ]"
        class="xs:w-11/12 sm:w-1/2 lg:w-2/5 xl:w-1/3 z-20 left-0"
    >
        <transition>
            <div v-if="filtersBox" class="w-full h-full flex">
                <!-- Filters box -->
                <div
                    class="h-full flex flex-col bg-white rounded-tr-xl rounded-br-xl filters-shadow overflow-y-visible overflow-x-hidden relative"
                    style="width: 90%"
                >
                    <!-- Header -->
                    <div
                        ref="FiltersHeader"
                        class="flex w-full flex-col bg-white md:sticky md:top-0 md:z-10"
                    >
                        <div
                            class="flex flex-col w-full h-full"
                            style="backdrop-filter: blur(1.5px)"
                        >
                            <!-- Title and info-->
                            <div class="flex text-center mt-1">
                                <h1
                                    class="flex gap-1 items-baseline px-2 text-2xl sm:text-3xl md:text-4xl lg:text-5x"
                                >
                                    {{ pageInfo.title }}
                                    <img
                                        alt="Page Information Popup"
                                        class="box-border w-6 h-6 cursor-pointer"
                                        src="/images/infoIcon.svg"
                                        @click="showPageInfo()"
                                    />
                                    <span class="visually-hidden"
                                        >Page Information Pop Up</span
                                    >
                                </h1>
                            </div>

                            <!-- Display number of active witches. -->
                            <div class="ml-3 flex mt-3 items-center pb-1">
                                <p class="mr-2 text-lg witchy-text mb-0">
                                    Showing
                                </p>
                                <span
                                    class="h-6 px-1 flex items-center justify-center mr-2 border-2 rounded-md text-white font-semibold bg-slate-500 border-slate-700 mb-0"
                                >
                                    {{ noWitches }}
                                </span>
                                <p class="mr-1 text-lg witchy-text mb-0">
                                    Accused Witches
                                </p>
                            </div>
                            <div
                                v-if="!iconsConstant"
                                class="ml-3 flex mt-1y items-center pb-2"
                            >
                                <p class="text-base witchy-text mr-2">
                                    Colour of map icons indicating
                                </p>
                                <div
                                    class="px-1 flex items-center justify-center mr-2 border-2 rounded-md text-white text-base bg-slate-500 border-slate-700 font-semibold"
                                >
                                    <span>
                                        {{
                                            filterProperties[currentProperty]
                                                .label
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="w-full border mt-1"></div>
                    </div>

                    <!-- Timeline section -->
                    <div class="ml-3 flex flex-col mt-4">
                        <div
                            class="flex items-center cursor-pointer"
                            @click="toggleTimelineShowing()"
                        >
                            <h4 class="font-medium mr-3 py-0">Timeline</h4>
                            <img
                                v-if="timelineShowing"
                                class="w-6 h-6"
                                src="/images/arrow-up.svg"
                            />
                            <img
                                v-else
                                class="w-6 h-6"
                                src="/images/arrow-down.svg"
                            />
                        </div>

                        <transition name="slide-in">
                            <timeline-range-selector
                                v-if="timelineShowing"
                                :key="timelineSelectorKey"
                                @deactivated-timeline="deactivateTimeline()"
                                @scroll-header-into-view="
                                    scrollHeaderIntoView()
                                "
                                @selected-date-range="emitDateRange($event)"
                            >
                            </timeline-range-selector>
                        </transition>

                        <button
                            v-if="dateRange != null"
                            :style="[
                                timelineOn
                                    ? { 'margin-top': '20px' }
                                    : { 'margin-top': '10px' },
                            ]"
                            class="rounded-lg w-24 text-white ml-4 bg-sky-600 py-1 hover:bg-sky-700 text-sm"
                            @click="emitDateReset()"
                        >
                            Reset Dates
                        </button>

                        <div
                            v-if="dateRange !== null && timelineSelectorOn"
                            class="flex flex-col ml-4 mt-4"
                        >
                            <div class="border" style="width: 300px"></div>
                            <p class="text-lg witchy-text mt-2 ml-1">
                                Showing accused witches between:
                            </p>
                            <div class="flex items-center mt-3 justify-center">
                                <div
                                    class="h-6 px-1 flex items-center justify-center mr-2 border-2 rounded-md text-white font-semibold bg-slate-500 border-slate-700"
                                >
                                    <p class="text-sm mb-0">
                                        {{ dateRangeFormatted[0] }}
                                    </p>
                                </div>
                                <p class="mr-2 text-lg witchy-text">and</p>
                                <div
                                    class="h-6 px-1 flex items-center justify-center mr-2 border-2 rounded-md text-white font-semibold bg-slate-500 border-slate-700"
                                >
                                    <p class="text-sm mb-0">
                                        {{ dateRangeFormatted[1] }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Title for "witch filters" -->
                    <div
                        :style="[
                            includeTimeline
                                ? { 'margin-top': '17px' }
                                : { 'margin-top': '3px' },
                        ]"
                        class="flex ml-3 flex-wrap items-center mt-2 cursor-pointer"
                        @click="toggleFiltersShowing(property)"
                    >
                        <h4 class="font-medium">
                            {{ filtersGeneralInfo.title }}
                        </h4>
                        <img
                            v-if="!filtersGeneralInfo.filtersShowing"
                            class="w-7 h-7 mt-1"
                            src="/images/arrow-down.svg"
                        />
                        <img
                            v-if="filtersGeneralInfo.filtersShowing"
                            class="w-7 h-7 mt-1"
                            src="/images/arrow-up.svg"
                        />
                    </div>

                    <!-- Filter dropdowns -->
                    <div
                        v-if="filtersGeneralInfo.filtersShowing"
                        class="w-full"
                    >
                        <!-- Note that <propertyItem> denotes the object and 
              property the key. -->
                        <div
                            v-for="(propertyItem, property) in filterProperties"
                            class="w-full flex flex-col ml-4"
                        >
                            <!-- Property titles -->
                            <div
                                class="flex pl-2 py-1 flex-wrap items-center mt-2 cursor-pointer w-full"
                                @click="togglePropertyShowing(property)"
                            >
                                <div class="title-point"></div>
                                <!--Descriptions-->
                                <div class="tooltip">
                                    <span class="label-and-icon">
                                        <p
                                            class="mr-1"
                                            style="
                                                font-weight: 500;
                                                display: inline;
                                            "
                                        >
                                            {{ propertyItem.label }}
                                        </p>
                                        <div
                                            class="inline-flex items-center justify-center align-middle w-5 h-5 ml-1 mb-1 cursor-pointer"
                                        >
                                            <img
                                                aria-label="Filter Description"
                                                class="pt-0.5 h-5 inline"
                                                src="/images/questionIcon.svg"
                                            />
                                            <span class="visually-hidden"
                                                >Filter Description</span
                                            >
                                        </div>
                                    </span>
                                    <span class="tooltiptext text-xs">
                                        <h4 class="font-semibold mb-2">
                                            {{ propertyItem.label }}
                                        </h4>
                                        <div
                                            v-html="propertyItem.description"
                                        ></div>
                                    </span>
                                </div>
                                <img
                                    v-if="!propertyItem.showing"
                                    class="w-6 h-6"
                                    src="/images/arrow-down.svg"
                                />
                                <img
                                    v-if="propertyItem.showing"
                                    class="w-6 h-6"
                                    src="/images/arrow-up.svg"
                                />
                            </div>
                            <!-- Filters list if property is showing. -->
                            <div v-if="propertyItem.showing" class="w-full">
                                <div>
                                    <button
                                        class="inline-block rounded hover:bg-gray-300 text-black px-1 pb-1 pt-1 text-xs leading-normal border border-gray-200 hover:shadow-md hover:-translate-y-1 transform transition-all duration-200 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                        @click="
                                            selectAll(property, propertyItem)
                                        "
                                    >
                                        Select All
                                    </button>
                                    <button
                                        class="inline-block rounded hover:bg-gray-300 text-black px-1 pb-1 pt-1 text-xs leading-normal border border-gray-200 hover:shadow-md hover:-translate-y-1 transform transition-all duration-200 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                        @click="
                                            clearAll(property, propertyItem)
                                        "
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <icon-dependent-filters-list
                                    v-if="!iconsConstant"
                                    :current-property="currentProperty"
                                    :filter-types="propertyItem.filters"
                                    :property="property"
                                    :property-label="propertyItem.label"
                                    @filter-off="emitFilterOff($event)"
                                    @filter-on="emitFilterOn($event)"
                                    @set-property-to-current="
                                        setPropertyToCurrent($event)
                                    "
                                >
                                </icon-dependent-filters-list>

                                <normal-filters-list
                                    v-else
                                    :filter-types="propertyItem.filters"
                                    :property="property"
                                    @filter-off="emitFilterOff($event)"
                                    @filter-on="emitFilterOn($event)"
                                >
                                </normal-filters-list>
                                <NuxtLink
                                    v-if="getGlossaryLabel(propertyItem.label)"
                                    :to="{
                                        path: '/glossary',
                                        query: {
                                            category: getGlossaryLabel(
                                                propertyItem.label
                                            ),
                                        },
                                    }"
                                    class="block font-sans text-gray-500 text-xs underline hover:text-gray-800 ml-2"
                                >
                                    {{ getGlossaryLabel(propertyItem.label) }}
                                    Glossary
                                </NuxtLink>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="!iconsConstant"
                        class="self-end flex flex-col mt-3 mr-3 h-full justify-end"
                    >
                        <div class="flex items-center">
                            <p class="text-sm mr-0.5">-</p>
                            <img
                                class="witch-icon mb-1 ml-1"
                                src="/images/witch-single-purple.png"
                            />
                            <p class="ml-1 text-sm">= Mixed.</p>
                        </div>
                    </div>

                    <div
                        :style="[
                            iconsConstant
                                ? { 'margin-top': '15px', height: '100%' }
                                : { 'margin-top': '0px', height: 'auto' },
                        ]"
                        class="flex flex-col justify-end"
                    >
                        <div class="w-full border mt-3 mb-3"></div>

                        <!-- Map tiles -->
                        <div
                            class="w-full flex justify-between px-2 sm:px-3 md:px-5 lg:px-10 mb-3"
                        >
                            <div v-for="tile in tiles">
                                <input
                                    :checked="tile.name === currentTileName"
                                    name="tile"
                                    type="radio"
                                    @change="filterTiles(tile)"
                                />
                                {{ tile.name }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Left chevron to hide filters. -->
                <div
                    class="w-8 flex flex-col justify-center ml-1 cursor-pointer"
                >
                    <div
                        class="flex items-center justify-center w-8 h-8 hover:w-10 hover:h-10 rounded-full bg-slate-200 filters-shadow"
                        @click="toggleFiltersBox()"
                    >
                        <img
                            class="max-w-full max-h-full"
                            src="/images/chevrons-left.svg"
                        />
                    </div>
                </div>
            </div>
        </transition>

        <!-- Right chevron to show filters. -->
        <div
            v-if="!filtersBox"
            class="w-8 flex flex-col justify-center ml-1 h-full cursor-pointer"
            style="pointer-events: auto"
        >
            <div
                class="flex items-center justify-center w-8 h-8 hover:w-10 hover:h-10 rounded-full bg-slate-200 filters-shadow"
                @click="toggleFiltersBox()"
            >
                <img
                    class="max-w-full max-h-full"
                    src="/images/chevrons-right.svg"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import TimelineRangeSelector from './TimelineRangeSelector.vue'
import IconDependentFiltersList from './IconDependentFiltersList.vue'
import NormalFiltersList from './NormalFiltersList.vue'
import Swal from 'sweetalert2'
import TimelineMethods from '~/assets/js/TimelineMethods'

const props = defineProps({
    pageInfo: {
        type: Object,
        required: true,
    },
    startingFiltersGeneralInfo: {
        type: Object,
        required: true,
    },
    startingFilters: {
        type: Object,
        required: true,
    },
    iconBehaviour: {
        type: String,
        required: true,
    },
    includeTimeline: {
        type: Boolean,
        default: false,
    },
    timelineOn: {
        // Recieves from parent when timeline has been
        // activated by selecting a dateRange.
        type: Boolean,
        required: true,
    },
    dateRange: {
        required: false,
    },
    noWitches: {
        type: Number,
        required: true,
    },
})

const isTooltipVisible = ref(false)
const timelineSelectorOn = ref(false) // Set to true on mounted if includeTimeline.
const timelineSelectorKey = ref(0)
const filtersBox = ref(true)
const currentTileName = ref('Modern Map')
const filtersGeneralInfo = ref(
    JSON.parse(JSON.stringify(props.startingFiltersGeneralInfo))
)
const filterProperties = ref(JSON.parse(JSON.stringify(props.startingFilters)))
const tiles = ref([
    {
        name: 'Modern Map',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        active: true,
    },
    {
        name: 'Historic Map',
        url: 'https://mapseries-tilesets.s3.amazonaws.com/mapdata3/125140579/{z}/{x}/{y}.png',
        active: false,
    },
])
const currentProperty = ref('sex') // Determines the property the icons of which are showing.
const timelineShowing = ref(true)

const toggleTooltip = (propertyItem) => {
    if (isMobileDevice.value) {
        propertyItem.descriptionShowing = !propertyItem.descriptionShowing
    }
}

const closeTooltip = (propertyItem) => {
    propertyItem.descriptionShowing = false
}

const setFilterInactive = (property, filterType) => {
    filterProperties.value[property].filters[filterType].active = false
}

const setFilterActive = (property, filterType) => {
    filterProperties.value[property].filters[filterType].active = true
}

const emit = defineEmits([
    'filterOff',
    'filterOn',
    'changeCurrentProperty',
    'updatedTile',
    'turnTimelineOff',
    'resetDates',
    'selectedDateRange',
    'deactivatedTimeline',
])

const filterEmit = (property, filterType) => {
    const isActive = filterProperties.value[property].filters[filterType].active

    if (isActive) {
        setFilterInactive(property, filterType)
        emit('filterOff', [property, filterType])
    } else {
        setFilterActive(property, filterType)
        emit('filterOn', [property, filterType])
    }
}

const emitFilterOff = (filterInfo) => {
    emit('filterOff', filterInfo)
}

const emitFilterOn = (filterInfo) => {
    emit('filterOn', filterInfo)
}

const setPropertyToCurrent = (property) => {
    // Sets <property> as the current property, and
    // calls setAllIcons to change the icons accordingly.
    currentProperty.value = property

    if (props.iconBehaviour !== 'constant') {
        emit('changeCurrentProperty', property)
    }
}

const selectAll = (property, propertyItem) => {
    const filtersList = Object.keys(propertyItem.filters)

    filtersList.forEach((type) => {
        propertyItem.filters[type].active = true
        const filterInfo = [property, type]
        emit('filterOn', filterInfo)
    })
}

const clearAll = (property, propertyItem) => {
    const filtersList = Object.keys(propertyItem.filters)

    filtersList.forEach((type) => {
        propertyItem.filters[type].active = false
        const filterInfo = [property, type]
        emit('filterOff', filterInfo)
    })
}

const togglePropertyShowing = (property) => {
    // If the property <property> is not showing, sets to showing,
    // and calls setPropertyToCurrent to set the property as the
    // current property, and change the icons accordingly. If it is
    // showing, sets to not showing.

    if (!filterProperties.value[property].showing) {
        if (currentProperty.value !== property) {
            setPropertyToCurrent(property)
        }

        filterProperties.value[property].showing = true
    } else {
        filterProperties.value[property].showing = false
    }
}

const filterTiles = (tile) => {
    currentTileName.value = tile.name
    emit('updatedTile', tile.url)
}

const toggleFiltersShowing = () => {
    filtersGeneralInfo.value.filtersShowing =
        !filtersGeneralInfo.value.filtersShowing
}

const toggleFiltersBox = () => {
    filtersBox.value = !filtersBox.value
}

const toggleTimelineSelector = () => {
    timelineSelectorOn.value = !timelineSelectorOn.value

    if (!timelineSelectorOn.value) {
        emit('turnTimelineOff')
    }
}

const toggleTimelineShowing = () => {
    timelineShowing.value = !timelineShowing.value
}

const emitDateReset = () => {
    // Re-redner timeline selector with its default values.
    timelineSelectorKey.value = !timelineSelectorKey.value
    emit('resetDates')
}

const emitDateRange = (dateRange) => {
    emit('selectedDateRange', dateRange)
}

const deactivateTimeline = () => {
    emit('deactivatedTimeline')
}

const showPageInfo = () => {
    Swal.fire(props.pageInfo)
}

const getGlossaryLabel = (label) => {
    if (
        label === 'Gender' ||
        label === 'Shapeshifting' ||
        label === 'Wikipedia Page'
    ) {
        return null
    }
    if (label === 'Primary' || label === 'Secondary') {
        return 'Case Characterisations'
    }
    return label
}

const dateRangeFormatted = computed(() => {
    if (props.dateRange != null) {
        return [
            TimelineMethods.formatDate(props.dateRange[0]),
            TimelineMethods.formatDate(props.dateRange[1]),
        ]
    }

    return null
})

const iconsConstant = computed(() => {
    return props.iconBehaviour === 'constant'
})

const isMobileDevice = computed(() => {
    return window.innerWidth <= 768 // You can adjust the width as needed
})

const FiltersHeader = useTemplateRef('FiltersHeader')

const scrollHeaderIntoView = () => {
    const el = FiltersHeader.value

    if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}

onMounted(() => {
    if (props.includeTimeline) {
        timelineSelectorOn.value = true
    }
})
</script>

<style>
@tailwind base;

.p {
    @apply mb-0;
}

.label-and-icon {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 10%;
    margin-left: -5px; /* Adjust based on the arrow's size */
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent rgb(223, 223, 223) transparent; /* Adjust the color as needed */
}

/*Links within the tooltip*/
.tooltip a {
    text-decoration: underline;
    color: rgb(0, 123, 255);
}

.tooltip .tooltiptext {
    display: none;
}

.tooltip .tooltiptext {
    visibility: hidden;
    max-width: 80%;
    background-color: rgb(255, 255, 255);
    color: #070707;
    text-align: center;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 1;
}

.tooltip:hover .tooltiptext {
    display: block;
}

.label-and-icon:hover + .tooltiptext {
    visibility: visible;
}

/*Tooltip stays when hovering over tooltip"*/
.tooltip:hover .tooltiptext,
.tooltip.active .tooltiptext {
    visibility: visible;
}

.tooltip.active .tooltiptext {
    display: block;
}

.arrow-container {
    border-radius: 50%;
}

.arrow-icon {
    max-width: 100%;
    max-height: 100%;
}

.witch-icon {
    max-width: 20px;
    height: auto;
}

/* The container */
.container {
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #b5b5b5;
}

/* Hide the browser's default radio button */
.container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: white;
}

/* On mouse-over, add a grey background color */
.container:hover {
    background-color: #eeb518e1;
}

.v-enter-active {
    animation: slide-in 0.4s ease-out;
}

.v-leave-active {
    animation: slide-in 0.4s reverse ease-out;
}

@keyframes slide-in {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(0%);
    }
}
</style>
