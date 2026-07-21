<template>
    <div>
        <h1 class="text-center mb-6">Glossary</h1>
        <p class="text-center mb-3">
            This glossary contains unusual or specialist words used across this
            website, to help you better understand the terms and their meanings.
        </p>
        <div class="flex justify-center mb-5">
            <button
                :class="[
                    'px-4 py-2 mx-2',
                    {
                        'bg-gray-200 font-semibold outline':
                            sortMode === 'letters',
                    },
                ]"
                class="bg-white border rounded"
                @click="setSortMode('letters')"
            >
                Sort Alphabetically
            </button>
            <button
                :class="[
                    'px-4 py-2 mx-2',
                    {
                        'bg-gray-200 font-semibold outline':
                            sortMode === 'category',
                    },
                ]"
                class="bg-white border rounded"
                @click="setSortMode('category')"
            >
                Sort by Category
            </button>
        </div>
        <div class="mr-[10%] ml-[10%]">
            <AlphabetGlossary
                v-if="sortMode === 'letters'"
                :glossary="glossary"
            />
            <CategoryGlossary
                v-if="sortMode === 'category'"
                :glossary="glossary"
                :initial-category="initialCategory"
            />
        </div>
    </div>
</template>

<script setup>
import AlphabetGlossary from '@/components/AlphabetGlossary.vue'
import CategoryGlossary from '@/components/CategoryGlossary.vue'
import glossaryJSON from '../public/glossary.json'

definePageMeta({
    layout: 'basic',
})

const route = useRoute()
const sortMode = ref('letters') // Default sort mode
const glossary = ref(glossaryJSON)
const initialCategory = ref(null) // Store initial category from query

const setSortMode = (mode) => {
    sortMode.value = mode
}

onMounted(() => {
    const queryCategory = route.query.category || null // Access query params using this.$route

    // If a category is passed, switch to 'category' sort mode
    if (queryCategory) {
        setSortMode('category')

        initialCategory.value = queryCategory // Set the initial category
    }
})
</script>
