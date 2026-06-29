<template>
    <div v-if="timelineShowing">
        <div
            class="bg-slate-200 z-30 py-5 px-12 filters-shadow rounded-tr-xl rounded-br-xl relative"
            style="
                min-height: 10%;
                max-height: 17%;
                width: 95%;
                position: absolute;
                bottom: 0%;
            "
        >
            <!-- Add the cross (close) button -->
            <div
                class="absolute top-2 right-2 cursor-pointer text-gray-500"
                @click="toggleTimelineShowing"
            >
                <svg
                    class="w-5 h-5 transition-transform transform hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 18L18 6M6 6l12 12"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                    ></path>
                </svg>
            </div>
            <Slider
                v-model="numberRangeValue"
                :format="getDateLabel"
                :lazy="false"
                :max="max"
                :merge="5"
                :min="0"
                name="slider"
                @change="handleCustomInputRangeChange"
            />
        </div>
    </div>
</template>

<script setup>
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

const props = defineProps({
    startRange: {
        required: true,
        type: Array,
    },
    timelineDates: {
        required: true,
        type: Array,
    },
    timelineMarkers: {
        required: true,
        type: Object,
    },
})

const dates = ref(props.timelineDates)
const markers = ref(props.timelineMarkers)
const timelineShowing = ref(true)
const numberRangeValue = ref([0, 0]) // Initialize with dummy values

const max = computed(() => {
    return dates.value.length - 1
})

const emit = defineEmits(['updatedRangeValue', 'timelineToggled'])

const emitRange = (rangeValue) => {
    emit('updatedRangeValue', rangeValue)
}

const toggleTimelineShowing = () => {
    timelineShowing.value = !timelineShowing.value
    emit('timelineToggled', timelineShowing.value)
}

const getDateLabel = (value) => {
    return dates.value[value].label
}

const handleCustomInputRangeChange = (newCustomInputRange) => {
    numberRangeValue.value = newCustomInputRange
}

const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number)
    //  JavaScript Date months are 0-indexed, so subtract 1 from month and day
    return new Date(year, month - 1, day - 1)
}

onMounted(() => {
    numberRangeValue.value = [0, max.value]
})

watch(numberRangeValue, (newRange) => {
    // Convert the slider range values to Date objects
    const dateRange = [
        parseDate(dates.value[newRange[0]].label),
        parseDate(dates.value[newRange[1]].label),
    ]

    emit('updatedRangeValue', dateRange)
})
</script>

<style>
:root {
    --slider-connect-bg: #0284c7;
    --slider-tooltip-bg: #0284c7;
    --slider-handle-ring-color: #3b82f630;
}
</style>
