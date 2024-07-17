<template>
    <div>
      <h1 class="text-2xl text-center mb-3">Glossary</h1>
      <div class="ml-10 mr-10">
      <template v-for="letter in sortedLetters">
        <h2>{{ letter }}</h2>
        <hr>
        <ul class="mb-3">
          <li v-for="item in sortedGlossary[letter]" :key="item.word">
            <h3>{{ item.word }}</h3>
            <p><strong>Category:</strong> {{ item.category }}</p>
            <p><strong>Definition:</strong> {{ item.definition }}</p>
          </li>
        </ul>
      </template>
    </div>
    </div>
  </template>
  
  <script>
  import glossaryJSON from "../static/glossary.json";
  
  export default {
    data() {
      return {
        glossary: glossaryJSON,
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
      },
      sortedLetters() {
        // Return an array of sorted letters from sortedGlossary object keys
        return Object.keys(this.sortedGlossary).sort();
      }
    },
  };
  </script>
  