<template>
    <div>
      <h1>Glossary</h1>
      <ul>
        <li v-for="(item, index) in sortedGlossary" :key="index">
          <h2>{{ item.word }}</h2>
          <p><strong>Category:</strong> {{ item.category }}</p>
          <p><strong>Definition:</strong> {{ item.definition }}</p>
        </li>
      </ul>
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
        return this.glossary.slice().sort((a, b) => {
          return a.word.localeCompare(b.word);
        });
      },
    },
  };
  </script>
  