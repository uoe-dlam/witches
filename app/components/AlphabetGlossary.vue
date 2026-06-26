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
            <div v-for="letterObj in letters" :key="letterObj.letter">
                <h2
                    class="flex justify-between items-center cursor-pointer px-4"
                    @click="toggleShowingLetter(letterObj.letter)"
                >
                    <span>{{ letterObj.letter }}</span>
                    <span v-if="letterObj.expanded">-</span
                    ><span v-else>+</span>
                </h2>
                <hr class="mb-3" />
                <ul v-show="letterObj.expanded" class="mb-3 ml-4">
                    <li
                        v-for="item in sortedGlossary[letterObj.letter]"
                        :key="item.word"
                        class="mb-3"
                    >
                        <h3 class="font-semibold">{{ item.word }}</h3>
                        <p class="mb-0">
                            <span class="font-medium">Category:</span>
                            {{ item.category }}
                        </p>
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
const letters = ref([])
const props = defineProps({
    glossary: {
        type: Array,
        required: true,
    },
})

const toggleShowingLetter = (letter) => {
    const letterObj = letters.value.find((l) => l.letter === letter)
    if (letterObj) {
        letterObj.expanded = !letterObj.expanded
    }
}
const expandAll = () => {
    letters.value.forEach((letterObj) => {
        letterObj.expanded = true
    })
}
const collapseAll = () => {
    letters.value.forEach((letterObj) => {
        letterObj.expanded = false
    })
}

const sortedGlossary = computed(() => {
    const grouped = {}

    // group by the first letter of each word
    props.glossary.forEach((item) => {
        const letter = item.word.charAt(0).toUpperCase()
        if (!grouped[letter]) {
            grouped[letter] = []
        }
        grouped[letter].push(item)
    })

    // within group sort into alphabetical order
    const sortedGroups = {}
    Object.keys(grouped)
        .sort()
        .forEach((key) => {
            sortedGroups[key] = grouped[key].sort((a, b) => {
                return a.word.localeCompare(b.word)
            })
        })

    return sortedGroups
})

onMounted(() => {
    letters.value = Object.keys(sortedGlossary.value)
        .sort()
        .map((letter) => {
            return { letter, expanded: false }
        })
})
</script>
