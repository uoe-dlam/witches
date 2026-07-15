<template>
    <div class="ml-4 mt-2 flex flex-col">
        <div class="flex items-center">
            <div class="title-point"></div>
            <p>Choose slider date range:</p>
        </div>

        <div
            class="flex pl-2 py-1 flex-wrap items-center mt-2 cursor-pointer ml-1"
            @click="toggleRecommended()"
        >
            <p class="mr-1" style="font-weight: 500">-</p>
            <p style="font-weight: 500">Pre-set ranges showing panics</p>
            <img
                v-if="!recommendedOn"
                alt="Arrow down"
                class="w-6 h-6"
                src="/images/arrow-down.svg"
            />
            <img
                v-if="recommendedOn"
                alt="Arrow up"
                class="w-6 h-6"
                src="/images/arrow-up.svg"
            />
        </div>

        <div v-if="recommendedOn" class="ml-2 lg:ml-8 mt-2 flex mb-2">
            <select
                v-model="recommendedRange"
                class="h-8 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-gray-400"
            >
                <option
                    v-for="option in recommendedOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
        </div>

        <div
            class="flex pl-2 py-1 flex-wrap items-center mt-2 cursor-pointer ml-1"
            style="width: 225px"
            @click="toggleCustomSelector()"
        >
            <p class="mr-1" style="font-weight: 500">-</p>
            <p style="font-weight: 500">Custom range</p>
            <img
                v-if="!customSelectorOn"
                alt="Arrow down"
                class="w-6 h-6"
                src="/images/arrow-down.svg"
            />
            <img
                v-if="customSelectorOn"
                alt="Arrow up"
                class="w-6 h-6"
                src="/images/arrow-up.svg"
            />
        </div>

        <div
            v-if="customSelectorOn"
            class="ml-2 lg:ml-8 mt-2 flex flex-col w-60"
        >
            <VueDatePicker
                v-model="customInputRange"
                :enable-time-picker="false"
                :start-date="defaultRangeCustom[0]"
                :teleport="true"
                :year-range="[1562, 1670]"
                class="custom-datepicker"
                focus-start-date
                format="dd/MM/yyyy"
                multi-calendars
                placeholder="Select Custom Date Range"
                position="left"
                range
                @update:model-value="handleCustomInputRange"
            />
        </div>
    </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const panicsRanges = ref([
    [new Date('01/01/1563'), new Date('12/31/1589')],
    [new Date('01/01/1590'), new Date('12/31/1591')],
    [new Date('01/01/1592'), new Date('12/31/1596')],
    [new Date('01/01/1597'), new Date('12/31/1597')],
    [new Date('01/01/1598'), new Date('12/31/1627')],
    [new Date('01/01/1628'), new Date('12/31/1631')],
    [new Date('01/01/1632'), new Date('12/31/1642')],
    [new Date('01/01/1643'), new Date('12/31/1644')],
    [new Date('01/01/1645'), new Date('12/31/1648')],
    [new Date('01/01/1649'), new Date('12/31/1650')],
    [new Date('01/01/1651'), new Date('12/31/1657')],
    [new Date('01/01/1658'), new Date('12/31/1659')],
    [new Date('01/01/1660'), new Date('12/31/1660')],
    [new Date('01/01/1661'), new Date('12/31/1662')],
    [new Date('01/01/1663'), new Date('12/31/1736')],
])
const recommendedOptions = ref([
    { value: null, label: '(recommended ranges)' }, //placeholder
    { value: 0, label: '1563-89 (non-panic period)' },
    { value: 1, label: '1590-91 (panic period)' },
    { value: 2, label: '1592-96 (non-panic period)' },
    { value: 3, label: '1597 (panic period)' },
    { value: 4, label: '1598-1627 (non-panic period)' },
    { value: 5, label: '1628-31 (panic period)' },
    { value: 6, label: '1632-42 (non-panic period)' },
    { value: 7, label: '1643-44 (panic period)' },
    { value: 8, label: '1645-48 (non-panic period)' },
    { value: 9, label: '1649-50 (panic period)' },
    { value: 10, label: '1651-57 (non-panic period)' },
    { value: 11, label: '1658-59 (panic period)' },
    { value: 12, label: '1660 (non-panic period)' },
    { value: 13, label: '1661-62 (panic period)' },
    { value: 14, label: '1663-1736 (non-panic period)' },
])
const recommendedOn = ref(true)
const recommendedRange = ref(null)
const customSelectorOn = ref(false)
const customInputRange = ref(null)
const defaultRangeCustom = ref([new Date('01/01/1650'), new Date('01/01/1670')])

const handleCustomInputRange = (newCustomInputRange) => {
    customInputRange.value = newCustomInputRange
}

const toggleCustomSelector = () => {
    customSelectorOn.value = !customSelectorOn.value
}

const toggleRecommended = () => {
    recommendedOn.value = !recommendedOn.value
}

const emit = defineEmits(['scrollHeaderIntoView', 'selectedDateRange'])

watch(recommendedRange, (newRecommendedRange) => {
    if (newRecommendedRange !== null) {
        const dateRange = panicsRanges.value[newRecommendedRange]
        const startRange = [dateRange[0], dateRange[1]]

        emit('scrollHeaderIntoView')
        emit('selectedDateRange', [dateRange, startRange])
    }
})

watch(customInputRange, (newCustomInputRange) => {
    if (newCustomInputRange && newCustomInputRange.length === 2) {
        //Converting strings to date format
        const parsedDates = newCustomInputRange.map((dateString) => {
            return new Date(dateString)
        })

        emit('selectedDateRange', [parsedDates, parsedDates])
    }
})
</script>

<style>
/*Sizing of Vue Datepicker*/
:root {
    --dp-button-height: 25px; /* Size for buttons in overlays */
    --dp-month-year-row-height: 25px; /* Height of the month-year select row */
    --dp-month-year-row-button-size: 25px; /* Specific height for the next/previous buttons */
    --dp-button-icon-height: 15px; /* Icon sizing in buttons */
    --dp-cell-size: 25px; /* Width and height of calendar cell */
    --dp-cell-padding: 3px; /* Padding in the cell */
    --dp-common-padding: 5px; /* Common padding used */
    --dp-input-icon-padding: 25px; /* Padding on the left side of the input if icon is present */
    --dp-input-padding: 4px 20px 4px 8px; /* Padding in the input */
    --dp-menu-min-width: 200px; /* Adjust the min width of the menu */
    --dp-action-buttons-padding: 1px 3px; /* Adjust padding for the action buttons in action row */
    --dp-row-margin: 3px 0; /* Reduced spacing between rows in the calendar */
    --dp-calendar-header-cell-padding: 0.3rem; /* Adjust padding in calendar header cells */
    --dp-two-calendars-spacing: 5px; /* Space between multiple calendars */
    --dp-overlay-col-padding: 2px; /* Padding in the overlay column */
    --dp-time-inc-dec-button-size: 20px; /* Sizing for arrow buttons in the time picker */
    --dp-menu-padding: 4px 6px; /* Menu padding */

    /* Adjust the font size */
    --dp-font-size: 12px;
}
</style>
