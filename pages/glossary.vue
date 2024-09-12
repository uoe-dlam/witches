<template>
  <div>
    <h1 class="text-center text-2xl md:text-3xl lg:text-4xl mb-6">Glossary</h1>
    <p class="text-center mb-3">
      This glossary contains unusual or specialist words used across this website, including in filters and explanations, to help you better understand the terms and their meanings.
    </p>
    <div class="flex justify-center mb-5">
      <button
        @click="setSortMode('letters')"
        :class="['px-4 py-2 mx-2', { 'bg-gray-200': sortMode === 'letters' }]"
        :style="sortMode === 'letters' ? { outline: '1.5px solid black', fontWeight:'600'} : {}"
        class="bg-white border rounded"
      >
        Sort Alphabetically
      </button>
      <button
        @click="setSortMode('category')"
        :class="['px-4 py-2 mx-2', { 'bg-gray-200 ': sortMode === 'category' }]"
        :style="sortMode === 'category' ? { outline: '1.5px solid black', fontWeight:'600'} : {}"
        class="bg-white border rounded"
      >
        Sort by Category
      </button>
    </div>
    <div :style="{ marginLeft: '10%', marginRight: '10%' }">
      <AlphabetGlossary v-if="sortMode === 'letters'" :glossary="glossary" />
      <CategoryGlossary v-if="sortMode === 'category'" :glossary="glossary" :initialCategory="initialCategory" />
    </div>
  </div>
</template>

<script>
import AlphabetGlossary from '@/components/AlphabetGlossary.vue';
import CategoryGlossary from '@/components/CategoryGlossary.vue';
import glossaryJSON from "../static/glossary.json";
import { useRoute } from 'vue-router';

export default {
  components: {
    AlphabetGlossary,
    CategoryGlossary
  },
  data() {
    return {
      sortMode: 'letters', // Default sort mode
      glossary: glossaryJSON,
      initialCategory: null // Store initial category from query
    };
  },
  mounted() {
  const queryCategory = this.$route.query.category || null; // Access query params using this.$route

  // If a category is passed, switch to 'category' sort mode
  if (queryCategory) {
    this.setSortMode('category');
    this.initialCategory = queryCategory; // Set the initial category
  }
},
  methods: {
    setSortMode(mode) {
      this.sortMode = mode;
    }
  }
};
</script>

<style scoped>

</style>
