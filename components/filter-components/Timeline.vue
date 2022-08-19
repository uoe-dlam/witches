<template>
  <!--<div class="h-40 bg-slate-300 flex items-center
             justify-center z-20"
       style="width: 80%;">-->

  <div class="bg-slate-200 z-30 py-5 px-12 filters-shadow
              rounded-tr-xl rounded-br-xl"
       style="height: 11%; width: 95%;">
    <vue-slider class=""
                v-model="rangeValue"
                :data="timelineDates"
                :data-value="'date'"
                :data-label="'label'"
                :marks="timelineMarkers">
    </vue-slider>
  </div>
</template>

<script>
//import VueSlider from 'vue-slider-component'
//import 'vue-slider-component/theme/default.css'

export default {
  //components: { VueSlider },
  props: {
    startRange: {
      required: true,
      type: Array
    },
    timelineDates: {
      required: true,
      type: Array
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
  watch: {
    // whenever question changes, this function will run
    rangeValue(newRange, oldQuestion) {
      this.$emit("updatedRangeValue", newRange);
    }
  },
  methods: {
    emitRange: function (rangeValue) {
      this.$emit("updatedRangeValue", rangeValue);
    }
  }
};
</script>

<style>

</style>