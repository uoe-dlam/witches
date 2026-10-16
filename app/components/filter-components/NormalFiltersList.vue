<template>
    <div class="w-full flex flex-wrap pl-0 pr-4 mt-2">
        <div
            v-for="(filterItem, filterType) in sortedFiltersList"
            :key="filterType"
        >
            <div class="flex mb-3 mx-2 w-full items-center">
                <input
                    :checked="filterItem.active"
                    type="checkbox"
                    @change="filterEmit(filterType)"
                />
                <p class="text-xs text-center ml-1 mb-0">
                    {{ filterItem.label }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    property: {
        type: String,
        required: true,
    },
    filterTypes: {
        type: Object,
        required: true,
    },
})

const filtersList = ref(props.filterTypes)

const setFilterInactive = (filterType) => {
    filtersList.value[filterType].active = false
}

const setFilterActive = (filterType) => {
    filtersList.value[filterType].active = true
}

const emit = defineEmits(['filterOn', 'filterOff'])

const filterEmit = (filterType) => {
    const isActive = filtersList.value[filterType].active

    if (isActive) {
        setFilterInactive(filterType)
        emit('filterOff', [props.property, filterType])
    } else {
        setFilterActive(filterType)
        emit('filterOn', [props.property, filterType])
    }
}

const sortedFiltersList = computed(() => {
    const filtersEntries = Object.entries(filtersList.value)

    // Separating unknown so that it can appear first
    const unknownFilterEntry = filtersEntries.find(
        (entry) => entry[1].label === 'Unknown'
    )
    const restFiltersEntries = filtersEntries.filter(
        (entry) => entry[1].label !== 'Unknown'
    )

    // Sorting rest of filters into alphabetical order
    restFiltersEntries.sort((a, b) => a[1].label.localeCompare(b[1].label))

    // Recombining
    const sortedFiltersEntries = unknownFilterEntry
        ? [unknownFilterEntry, ...restFiltersEntries]
        : restFiltersEntries
    return Object.fromEntries(sortedFiltersEntries)
})
</script>
