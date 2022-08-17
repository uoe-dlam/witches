<template>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  components: { VueSlider },
  props: {
    startRange: {
      required: true,
      type: Array
    }
    timelineDates: {
      required: true,
      type: Object
    },
    timelineMarkers: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      rangeValue: [this.startRange[0], this.startRange[1]]
    }
  },
};
</script>

<style>

</style>