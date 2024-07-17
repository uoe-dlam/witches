<template>
    <div>
      <h1>Glossary</h1>
      <ul>
        <li v-for="(item, index) in glossary" :key="index">
          <h2>{{ item.word }}</h2>
          <p><strong>Category:</strong> {{ item.category }}</p>
          <p><strong>Definition:</strong> {{ item.definition }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        glossary: []
      };
    },
    async asyncData() {
      try {
        const res = await fetch('/glossary.json'); // Correct path to fetch the glossary.json file
        const data = await res.json(); // Parse the JSON response
        return { glossary: data }; // Directly return the array since the JSON file is an array
      } catch (error) {
        console.error('Error fetching glossary:', error);
        return { glossary: [] }; // Return empty glossary on error
      }
    }
  };
  </script>
  