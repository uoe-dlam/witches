<template>
  <div>
    <div class="text-right mb-5 mr-[10%]">
      <button
        @click="expandAll"
        class="
          hover:text-gray-400
          text-gray-800
          font-bold
          py-2
          px-1
          underline
          text-xs
        "
      >
        Expand All
      </button>
      <button
        @click="collapseAll"
        class="
          hover:text-gray-400
          text-gray-800
          font-bold
          py-2
          px-1
          underline
          text-xs
        "
      >
        Collapse All
      </button>
    </div>
    <div class="mr-[10%] ml-[10%]">
      <div v-for="categoryObj in categories" :key="categoryObj.category">
        <!-- Assign ref dynamically based on category name -->
        <h2
          :ref="`category-${categoryObj.category}`"
          @click="toggleShowingCategory(categoryObj.category)"
          class="flex justify-between items-center cursor-pointer px-4"
        >
          <span>{{ categoryObj.category }}</span>
          <span v-if="categoryObj.expanded">-</span><span v-else>+</span>
        </h2>
        <hr class="mb-3" />
        <ul v-show="categoryObj.expanded" class="mb-3 ml-4">
          <li
            v-for="item in sortedGlossary[categoryObj.category]"
            :key="item.word"
            class="mb-3"
          >
            <h3 class="font-semibold">{{ item.word }}</h3>
            <p>
              <span class="font-medium">Definition:</span> {{ item.definition }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    glossary: {
      type: Array,
      required: true,
    },
    initialCategory: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      categories: [], // Array to track categories and their expanded states
    };
  },
  computed: {
    sortedGlossary() {
      let grouped = {};

      this.glossary.forEach((item) => {
        let category = item.category || "Uncategorized";
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(item);
      });

      const sortedGroups = {};
      Object.keys(grouped)
        .sort()
        .forEach((key) => {
          sortedGroups[key] = grouped[key].sort((a, b) =>
            a.word.localeCompare(b.word)
          );
        });

      return sortedGroups;
    },
  },
  mounted() {
    this.categories = Object.keys(this.sortedGlossary)
      .sort()
      .map((category) => {
        return { category, expanded: false };
      });

    this.handleCategoryFromQuery();
  },
  watch: {
    "$route.query.category": {
      handler() {
        // to add a slight delay to ensure the DOM and route updates are complete -nextTick alone wasn't working
        setTimeout(() => {
          this.handleCategoryFromQuery();
        }, 300); // 300ms
      },
      immediate: true,
    },
  },
  methods: {
    handleCategoryFromQuery() {
      const queryCategory = this.initialCategory || this.$route.query.category;
      if (queryCategory) {
        const categoryObj = this.categories.find(
          (c) => c.category === queryCategory
        );
        if (categoryObj) {
          categoryObj.expanded = true;

          // Scroll after the DOM has updated
          this.$nextTick(() => {
            setTimeout(() => {
              const categoryHeader = this.$refs[`category-${queryCategory}`];
              if (categoryHeader && categoryHeader[0]) {
                categoryHeader[0].scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100); // Small delay before scrolling
          });
        }
      }
    },
    toggleShowingCategory(category) {
      const categoryObj = this.categories.find((c) => c.category === category);
      if (categoryObj) {
        categoryObj.expanded = !categoryObj.expanded;
      }
    },
    expandAll() {
      this.categories.forEach((categoryObj) => {
        categoryObj.expanded = true;
      });
    },
    collapseAll() {
      this.categories.forEach((categoryObj) => {
        categoryObj.expanded = false;
      });
    },
  },
};
</script>
