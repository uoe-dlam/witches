<template>
    <div class="w-full">
        <div
            v-if="property === currentProperty"
            class="w-full flex flex-wrap mt-2"
        >
            <div
                v-for="(filterItem, filterType) in sortedFiltersList"
                :key="filterType"
                class="flex flex-col items-center mx-3 mb-2"
                style="width: 50px"
            >
                <div class="flex justify-center items-center">
                    <input
                        :checked="filterItem.active"
                        type="checkbox"
                        @change="filterEmit(filterType)"
                    />
                    <img
                        :src="filterItem.iconUrl"
                        class="witch-icon mb-1 ml-0.5"
                    />
                </div>
                <p class="text-xs text-center mb-0">{{ filterItem.label }}</p>
            </div>
        </div>

        <!-- Else, show list without icons but with button to switch
        to current. -->
        <div v-else class="flex flex-col items-start w-full mt-2 mb-2">
            <div class="w-full flex flex-wrap px-2">
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
            <!-- Change icons button. -->
            <div class="flex flex-col w-4/5 ml-1 items-end mt-1">
                <div class="self-end flex justify-start items-center mb-1 mr-1">
                    <p class="text-xs">Show {{ propertyLabel }} Icons</p>
                    <label
                        class="container flex items-center justify-center ml-1"
                    >
                        <input
                            :checked="false"
                            name="radio"
                            type="radio"
                            @change="emitSetPropertyToCurrent(property)"
                        />
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div class="w-full bg-slate-600" style="height: 1.2px"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    currentProperty: {
        type: String,
        required: true,
    },
    property: {
        type: String,
        required: true,
    },
    propertyLabel: {
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

const emit = defineEmits(['filterOff', 'filterOn', 'setPropertyToCurrent'])

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

const emitSetPropertyToCurrent = () => {
    emit('setPropertyToCurrent', props.property)
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
