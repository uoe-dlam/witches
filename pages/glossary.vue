<template>
  <div>
    <h1 class="text-2xl text-center mb-3">Glossary</h1>
    <div class="ml-20 mr-20">
      <div v-for="letterObj in letters" :key="letterObj.letter">
        <h2 @click="toggleLetter(letterObj.letter)" class="cursor-pointer">
          {{ letterObj.letter }} <span v-if="letterObj.expanded">-</span><span v-else>+</span>
        </h2>
        <hr>
        <ul v-show="letterObj.expanded" class="mb-3">
          <li v-for="item in sortedGlossary[letterObj.letter]" :key="item.word">
            <h3><strong>{{ item.word }}</strong></h3>
            <p><span class="font-medium">Category:</span> {{ item.category }} </p>
            <p><span class="font-medium">Definition:</span> {{ item.definition }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import glossaryJSON from "../static/glossary.json";

export default {
  data() {
    return {
      glossary: glossaryJSON,
      letters: [] // Array to track letters and their expanded states
    };
  },
  computed: {
    sortedGlossary() {
      // Create an object to store groups of glossary items by letter
      let grouped = {};
      
      // Loop through glossary items and group them by the first letter of 'word'
      this.glossary.forEach(item => {
        let letter = item.word.charAt(0).toUpperCase(); // Get the first letter and convert to uppercase
        if (!grouped[letter]) {
          grouped[letter] = [];
        }
        grouped[letter].push(item);
      });
      
      // Sort groups by letter
      const sortedGroups = {};
      Object.keys(grouped).sort().forEach(key => {
        sortedGroups[key] = grouped[key].sort((a, b) => {
          return a.word.localeCompare(b.word);
        });
      });
      
      return sortedGroups;
    }
  },
  mounted() {
    // Initialize letters array with the expanded state set to false
    this.letters = Object.keys(this.sortedGlossary).sort().map(letter => {
      return { letter, expanded: false };
    });
  },
  methods: {
    toggleLetter(letter) {
      const letterObj = this.letters.find(l => l.letter === letter);
      if (letterObj) {
        letterObj.expanded = !letterObj.expanded;
      }
    }
  }
};
</script>

<style scoped>
/* Add styling for the expand/collapse indicator */
h2 span {
  float: right;
}
</style>
