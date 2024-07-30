<template>
  <div>
    <AlphabetGlossary :glossary="glossary" />
  </div>
</template>

<script>
import AlphabetGlossary from '@/components/AlphabetGlossary.vue';
import glossaryJSON from "../static/glossary.json";

export default {
  components: {
    AlphabetGlossary
  },
  data() {
    return {
      glossary: glossaryJSON
    };
  }
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
