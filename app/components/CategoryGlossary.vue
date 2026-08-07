<template>
    <div>
        <div class="text-right mb-5 mr-[10%]">
            <button
                class="hover:text-gray-400 text-gray-800 font-bold py-2 px-1 underline text-xs"
                @click="expandAll"
            >
                Expand All
            </button>
            <button
                class="hover:text-gray-400 text-gray-800 font-bold py-2 px-1 underline text-xs"
                @click="collapseAll"
            >
                Collapse All
            </button>
        </div>
        <div class="mr-[10%] ml-[10%]">
            <div v-for="categoryObj in categories" :key="categoryObj.category">
                <!-- Assign ref dynamically based on category name -->
                <h2
                    :ref="(el) => setCategoryRef(el, categoryObj.category)"
                    class="flex justify-between items-center cursor-pointer px-4"
                    @click="toggleShowingCategory(categoryObj.category)"
                >
                    <span>{{ categoryObj.category }}</span>
                    <span v-if="categoryObj.expanded">-</span
                    ><span v-else>+</span>
                </h2>
                <hr class="mb-3" />
                <ul v-show="categoryObj.expanded" class="mb-3 ml-4">
                    <li
                        v-for="item in sortedGlossary[categoryObj.category]"
                        :key="item.word"
                        class="mb-3"
                    >
                        <h3 class="font-semibold">{{ item.word }}</h3>
                        <p class="mb-0">
                            <span class="font-medium">Definition:</span>
                            {{ item.definition }}
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    glossary: { type: Array, required: true },
    initialCategory: { type: String, default: null },
})
const categories = ref([])
const categoryRefs = {}
const route = useRoute()

const setCategoryRef = (el, category) => {
    if (el) {
        categoryRefs[category] = el
    }
}

const sortedGlossary = computed(() => {
    const grouped = {}

    props.glossary.forEach((item) => {
        const category = item.category || 'Uncategorized'
        if (!grouped[category]) {
            grouped[category] = []
        }
        grouped[category].push(item)
    })

    const sortedGroups = {}
    Object.keys(grouped)
        .sort()
        .forEach((key) => {
            sortedGroups[key] = grouped[key].sort((a, b) =>
                a.word.localeCompare(b.word)
            )
        })

    return sortedGroups
})

const handleCategoryFromQuery = () => {
    const queryCategory = props.initialCategory || route.query.category

    if (queryCategory) {
        const categoryObj = categories.value.find(
            (c) => c.category === queryCategory
        )

        if (categoryObj) {
            categoryObj.expanded = true

            // Scroll after the DOM has updated
            nextTick(() => {
                setTimeout(() => {
                    const categoryHeader = categoryRefs[queryCategory]
                    if (categoryHeader) {
                        categoryHeader.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        })
                    }
                }, 100) // Small delay before scrolling
            })
        }
    }
}

const toggleShowingCategory = (category) => {
    const categoryObj = categories.value.find((c) => c.category === category)

    if (categoryObj) {
        categoryObj.expanded = !categoryObj.expanded
    }
}

const expandAll = () => {
    categories.value.forEach((categoryObj) => {
        categoryObj.expanded = true
    })
}
const collapseAll = () => {
    categories.value.forEach((categoryObj) => {
        categoryObj.expanded = false
    })
}

watch(
    () => route.query.category,
    () => {
        setTimeout(() => handleCategoryFromQuery(), 300)
    },
    { immediate: true }
)

onMounted(() => {
    categories.value = Object.keys(sortedGlossary.value)
        .sort()
        .map((category) => ({ category, expanded: false }))

    handleCategoryFromQuery()
})
</script>
